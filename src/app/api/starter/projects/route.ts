import { NextRequest, NextResponse, after } from "next/server";
import { checkSession } from "@/lib/auth";
import { listProjectsAsync, createProject, advanceStage, updateProject, setStageError, getProject, rewindToStage } from "@/lib/store";
import { scrapeWebsite } from "@/lib/scraper";
import { generateDesign } from "@/lib/design-generator";
import { generateCode } from "@/lib/code-generator";
import { pushToGitHub } from "@/lib/github-push";
import { deployToGitHubPages } from "@/lib/github-deploy";
import { runQaComparison } from "@/lib/qa-checker";
import { generateFixes } from "@/lib/fix-generator";

const MAX_FIX_ITERATIONS = 3;

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    // OpenAI SDK errors include status + message
    const status = (err as { status?: number }).status;
    return status ? `${err.message} (HTTP ${status})` : err.message;
  }
  if (typeof err === "string") return err;
  return fallback;
}

async function requireAuth() {
  if (!(await checkSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  return NextResponse.json(await listProjectsAsync());
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

  const project = await createProject({
    clientName: clientName.trim(),
    websiteUrl: websiteUrl.trim(),
    description: description.trim(),
    specialRequirements: specialRequirements?.trim() || null,
  });

  // Auto-run pipeline stages in the background after the response is sent
  after(async () => {
    const id = project.id;

    try {
      // Stage 1 → 2: Scrape website
      await advanceStage(id);
      try {
        const scrapeResult = await scrapeWebsite(project.websiteUrl);
        await updateProject(id, { scrapeResult });
        await advanceStage(id); // → stage 3 (Designing)
      } catch (err) {
        await setStageError(id, extractErrorMessage(err, "Scrape failed"));
        return;
      }

      // Stage 3 → 4: Design generation
      if (!process.env.OPENAI_API_KEY) {
        await setStageError(id, "OPENAI_API_KEY is not configured — cannot generate design");
        return;
      }
      try {
        const proj = getProject(id)!;
        const design = await generateDesign(
          proj.scrapeResult!,
          proj.clientName,
          proj.description,
          proj.specialRequirements
        );
        await updateProject(id, { design });
        await advanceStage(id); // → stage 4 (UI/UX)
      } catch (err) {
        await setStageError(id, extractErrorMessage(err, "Design generation failed"));
        return;
      }

      // Stage 4 → 5: Code generation
      try {
        const proj = getProject(id)!;
        const generatedCode = await generateCode(proj.design!, proj.scrapeResult!, proj.clientName);
        await updateProject(id, { generatedCode });
        await advanceStage(id); // → stage 5 (Creating Repo)
      } catch (err) {
        await setStageError(id, extractErrorMessage(err, "Code generation failed"));
        return;
      }

      // Stage 5 → 6: GitHub push
      if (!process.env.GITHUB_TOKEN) {
        await setStageError(id, "GITHUB_TOKEN is not configured — cannot push to GitHub");
        return;
      }
      try {
        const proj = getProject(id)!;
        const { repoUrl, repoFullName } = await pushToGitHub(proj.clientName, proj.generatedCode!);
        await updateProject(id, { repoUrl, repoFullName });
        await advanceStage(id); // → stage 6 (Generating Code)
      } catch (err) {
        await setStageError(id, extractErrorMessage(err, "GitHub push failed"));
        return;
      }

      // Stage 6 → 7: Advance to Deploying
      await advanceStage(id); // → stage 7 (Deploying)

      // Stage 7 → 8: Deploy to GitHub Pages
      try {
        const proj = getProject(id)!;
        const { deployedUrl } = await deployToGitHubPages(proj.repoFullName!);
        await updateProject(id, { deployedUrl });
        await advanceStage(id); // → stage 8 (QA Validation)
      } catch (err) {
        await setStageError(id, extractErrorMessage(err, "Deployment failed"));
        return;
      }

      // Stage 8 → 9/10: QA Comparison + Fix Loop
      try {
        const proj = getProject(id)!;
        let qaReport = await runQaComparison(
          proj.scrapeResult!,
          proj.deployedUrl!,
          proj.websiteUrl
        );
        await updateProject(id, { qaReport });
        await advanceStage(id); // → stage 9 (Fixes)

        // If no failures, skip Fixes and go to Complete
        if (qaReport.summary.fail === 0) {
          await advanceStage(id); // → stage 10 (Complete)
          return;
        }

        // Fix/re-validate loop (up to MAX_FIX_ITERATIONS)
        let iterations = 0;
        while (qaReport.summary.fail > 0 && iterations < MAX_FIX_ITERATIONS) {
          iterations++;
          const current = getProject(id)!;

          // Generate AI-powered fixes
          const fixedCode = await generateFixes(
            qaReport,
            current.scrapeResult!,
            current.generatedCode!,
            current.clientName
          );
          await updateProject(id, { generatedCode: fixedCode, fixIterations: iterations });

          // Push fixes to GitHub
          const { repoUrl: fixedRepoUrl, repoFullName: fixedRepoFullName } = await pushToGitHub(
            current.clientName,
            fixedCode
          );
          await updateProject(id, { repoUrl: fixedRepoUrl, repoFullName: fixedRepoFullName });

          // Re-deploy
          await rewindToStage(id, 7); // back to Deploying
          const { deployedUrl: fixedDeployedUrl } = await deployToGitHubPages(fixedRepoFullName);
          await updateProject(id, { deployedUrl: fixedDeployedUrl });
          await advanceStage(id); // → stage 8 (QA Validation)

          // Re-run QA
          qaReport = await runQaComparison(
            current.scrapeResult!,
            fixedDeployedUrl,
            current.websiteUrl
          );
          await updateProject(id, { qaReport });
          await advanceStage(id); // → stage 9 (Fixes)

          if (qaReport.summary.fail === 0) {
            await advanceStage(id); // → stage 10 (Complete)
            return;
          }
        }

        // Max iterations reached — leave at stage 9 (Fixes) with current QA report
      } catch (err) {
        await setStageError(id, extractErrorMessage(err, "QA/Fix cycle failed"));
      }
    } catch (err) {
      // Top-level safety net — catch any unexpected errors so they surface in the UI
      setStageError(id, extractErrorMessage(err, "Pipeline failed unexpectedly"));
    }
  });

  return NextResponse.json(project, { status: 201 });
}
