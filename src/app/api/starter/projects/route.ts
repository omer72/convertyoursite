import { NextRequest, NextResponse, after } from "next/server";
import { checkSession } from "@/lib/auth";
import { listProjects, createProject, advanceStage, updateProject, setStageError, getProject } from "@/lib/store";
import { scrapeWebsite } from "@/lib/scraper";
import { generateDesign } from "@/lib/design-generator";
import { generateCode } from "@/lib/code-generator";
import { pushToGitHub } from "@/lib/github-push";
import { deployToGitHubPages } from "@/lib/github-deploy";
import { runQaComparison } from "@/lib/qa-checker";

async function requireAuth() {
  if (!(await checkSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  return NextResponse.json(listProjects());
}

export async function POST(request: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;

  const body = await request.json();
  const { clientName, websiteUrl, description, specialRequirements } = body;

  if (!clientName?.trim() || !websiteUrl?.trim() || !description?.trim()) {
    return NextResponse.json(
      { error: "clientName, websiteUrl, and description are required" },
      { status: 400 }
    );
  }

  try {
    new URL(websiteUrl);
  } catch {
    return NextResponse.json({ error: "Invalid websiteUrl" }, { status: 400 });
  }

  const project = createProject({
    clientName: clientName.trim(),
    websiteUrl: websiteUrl.trim(),
    description: description.trim(),
    specialRequirements: specialRequirements?.trim() || null,
  });

  // Auto-run pipeline stages in the background after the response is sent
  after(async () => {
    const id = project.id;

    // Stage 1 → 2: Scrape website
    advanceStage(id);
    try {
      const scrapeResult = await scrapeWebsite(project.websiteUrl);
      updateProject(id, { scrapeResult });
      advanceStage(id); // → stage 3 (Designing)
    } catch (err) {
      setStageError(id, err instanceof Error ? err.message : "Scrape failed");
      return;
    }

    // Stage 3 → 4: Design generation (only if ANTHROPIC_API_KEY is set)
    if (!process.env.ANTHROPIC_API_KEY) return;
    try {
      const proj = getProject(id)!;
      const design = await generateDesign(
        proj.scrapeResult!,
        proj.clientName,
        proj.description,
        proj.specialRequirements
      );
      updateProject(id, { design });
      advanceStage(id); // → stage 4 (UI/UX)
    } catch (err) {
      setStageError(id, err instanceof Error ? err.message : "Design generation failed");
      return;
    }

    // Stage 4 → 5: Code generation
    try {
      const proj = getProject(id)!;
      const generatedCode = await generateCode(proj.design!, proj.scrapeResult!, proj.clientName);
      updateProject(id, { generatedCode });
      advanceStage(id); // → stage 5 (Creating Repo)
    } catch (err) {
      setStageError(id, err instanceof Error ? err.message : "Code generation failed");
      return;
    }

    // Stage 5 → 6: GitHub push (only if GITHUB_TOKEN is set)
    if (!process.env.GITHUB_TOKEN) return;
    try {
      const proj = getProject(id)!;
      const { repoUrl } = await pushToGitHub(proj.clientName, proj.generatedCode!);
      updateProject(id, { repoUrl });
      advanceStage(id); // → stage 6 (Generating Code)
    } catch (err) {
      setStageError(id, err instanceof Error ? err.message : "GitHub push failed");
      return;
    }

    // Stage 6 → 7: Advance to Deploying
    advanceStage(id); // → stage 7 (Deploying)

    // Stage 7 → 8: Deploy to GitHub Pages
    try {
      const proj = getProject(id)!;
      const repoFullName = proj.repoUrl!.replace("https://github.com/", "");
      const { deployedUrl } = await deployToGitHubPages(repoFullName);
      updateProject(id, { deployedUrl });
      advanceStage(id); // → stage 8 (QA Validation)
    } catch (err) {
      setStageError(id, err instanceof Error ? err.message : "Deployment failed");
      return;
    }

    // Stage 8 → 9/10: QA Comparison
    try {
      const proj = getProject(id)!;
      const qaReport = await runQaComparison(
        proj.scrapeResult!,
        proj.deployedUrl!,
        proj.websiteUrl
      );
      updateProject(id, { qaReport });
      advanceStage(id); // → stage 9 (Fixes)

      // If no failures, skip Fixes and go to Complete
      if (qaReport.summary.fail === 0) {
        advanceStage(id); // → stage 10 (Complete)
      }
    } catch (err) {
      setStageError(id, err instanceof Error ? err.message : "QA check failed");
    }
  });

  return NextResponse.json(project, { status: 201 });
}
