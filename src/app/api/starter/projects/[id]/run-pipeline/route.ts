import { NextRequest, NextResponse, after } from "next/server";
import { checkSession } from "@/lib/auth";
import { getProject, updateProject, advanceStage, setStageError, rewindToStage } from "@/lib/store";
import { scrapeWebsite } from "@/lib/scraper";
import { generateDesign } from "@/lib/design-generator";
import { generateCode } from "@/lib/code-generator";
import { pushToGitHub } from "@/lib/github-push";
import { deployToGitHubPages } from "@/lib/github-deploy";
import { runQaComparison } from "@/lib/qa-checker";
import { generateFixes } from "@/lib/fix-generator";

export const maxDuration = 300;

const MAX_FIX_ITERATIONS = 3;

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) {
    const status = (err as { status?: number }).status;
    return status ? `${err.message} (HTTP ${status})` : err.message;
  }
  if (typeof err === "string") return err;
  return fallback;
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = getProject(id);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  if (project.pipelineStatus !== "error") {
    return NextResponse.json(
      { error: "Pipeline can only be retried when in error state" },
      { status: 400 }
    );
  }

  // Rewind to the errored stage and restart
  const errorStage = project.pipelineStage;
  rewindToStage(id, errorStage);

  after(async () => {
    const proj = getProject(id)!;
    const stage = proj.pipelineStage;

    try {
      // Resume from the current stage
      if (stage <= 2) {
        // Scrape
        try {
          const scrapeResult = await scrapeWebsite(proj.websiteUrl);
          updateProject(id, { scrapeResult });
          advanceStage(id);
        } catch (err) {
          setStageError(id, extractErrorMessage(err, "Scrape failed"));
          return;
        }
      }

      if (getProject(id)!.pipelineStage <= 3) {
        if (!process.env.OPENAI_API_KEY) {
          setStageError(id, "OPENAI_API_KEY is not configured — cannot generate design");
          return;
        }
        try {
          const current = getProject(id)!;
          const design = await generateDesign(
            current.scrapeResult!,
            current.clientName,
            current.description,
            current.specialRequirements
          );
          updateProject(id, { design });
          advanceStage(id);
        } catch (err) {
          setStageError(id, extractErrorMessage(err, "Design generation failed"));
          return;
        }
      }

      if (getProject(id)!.pipelineStage <= 4) {
        try {
          const current = getProject(id)!;
          const generatedCode = await generateCode(current.design!, current.scrapeResult!, current.clientName);
          updateProject(id, { generatedCode });
          advanceStage(id);
        } catch (err) {
          setStageError(id, extractErrorMessage(err, "Code generation failed"));
          return;
        }
      }

      if (getProject(id)!.pipelineStage <= 5) {
        if (!process.env.GITHUB_TOKEN) {
          setStageError(id, "GITHUB_TOKEN is not configured — cannot push to GitHub");
          return;
        }
        try {
          const current = getProject(id)!;
          const { repoUrl, repoFullName } = await pushToGitHub(current.clientName, current.generatedCode!);
          updateProject(id, { repoUrl, repoFullName });
          advanceStage(id);
        } catch (err) {
          setStageError(id, extractErrorMessage(err, "GitHub push failed"));
          return;
        }
      }

      if (getProject(id)!.pipelineStage <= 6) {
        advanceStage(id); // → Deploying
      }

      if (getProject(id)!.pipelineStage <= 7) {
        try {
          const current = getProject(id)!;
          const { deployedUrl } = await deployToGitHubPages(current.repoFullName!);
          updateProject(id, { deployedUrl });
          advanceStage(id);
        } catch (err) {
          setStageError(id, extractErrorMessage(err, "Deployment failed"));
          return;
        }
      }

      if (getProject(id)!.pipelineStage <= 8) {
        try {
          const current = getProject(id)!;
          let qaReport = await runQaComparison(current.scrapeResult!, current.deployedUrl!, current.websiteUrl);
          updateProject(id, { qaReport });
          advanceStage(id); // → stage 9

          if (qaReport.summary.fail === 0) {
            advanceStage(id); // → stage 10 (Complete)
            return;
          }

          // Fix loop
          let iterations = current.fixIterations ?? 0;
          while (qaReport.summary.fail > 0 && iterations < MAX_FIX_ITERATIONS) {
            iterations++;
            const cur = getProject(id)!;

            const fixedCode = await generateFixes(qaReport, cur.scrapeResult!, cur.generatedCode!, cur.clientName);
            updateProject(id, { generatedCode: fixedCode, fixIterations: iterations });

            const { repoUrl, repoFullName } = await pushToGitHub(cur.clientName, fixedCode);
            updateProject(id, { repoUrl, repoFullName });

            rewindToStage(id, 7);
            const { deployedUrl } = await deployToGitHubPages(repoFullName);
            updateProject(id, { deployedUrl });
            advanceStage(id);

            qaReport = await runQaComparison(cur.scrapeResult!, deployedUrl, cur.websiteUrl);
            updateProject(id, { qaReport });
            advanceStage(id);

            if (qaReport.summary.fail === 0) {
              advanceStage(id);
              return;
            }
          }
        } catch (err) {
          setStageError(id, extractErrorMessage(err, "QA/Fix cycle failed"));
        }
      }
    } catch (err) {
      // Top-level safety net
      setStageError(id, extractErrorMessage(err, "Pipeline failed unexpectedly"));
    }
  });

  return NextResponse.json({ message: "Pipeline restarted from stage " + errorStage });
}
