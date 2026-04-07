import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/auth";
import { getProject, updateProject, advanceStage, setStageError } from "@/lib/store";
import { generateFixes } from "@/lib/fix-generator";
import { pushToGitHub } from "@/lib/github-push";

export const maxDuration = 300;

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

  if (project.pipelineStage !== 9) {
    return NextResponse.json(
      { error: "Project must be in Fixes stage (stage 9)" },
      { status: 400 }
    );
  }

  if (!project.qaReport || !project.scrapeResult || !project.generatedCode) {
    return NextResponse.json(
      { error: "Missing QA report, scrape data, or generated code" },
      { status: 400 }
    );
  }

  const maxIterations = 3;
  const currentIterations = project.fixIterations ?? 0;
  if (currentIterations >= maxIterations) {
    return NextResponse.json(
      { error: `Maximum fix iterations (${maxIterations}) reached` },
      { status: 400 }
    );
  }

  try {
    // Generate fixes based on QA failures
    const fixedCode = await generateFixes(
      project.qaReport,
      project.scrapeResult,
      project.generatedCode,
      project.clientName
    );

    updateProject(id, {
      generatedCode: fixedCode,
      fixIterations: currentIterations + 1,
    });

    // Push fixed code to GitHub
    const { repoUrl, repoFullName } = await pushToGitHub(
      project.clientName,
      fixedCode
    );
    updateProject(id, { repoUrl, repoFullName });

    // Advance past Fixes stage
    advanceStage(id); // → stage 10 (Complete) — will be re-validated by pipeline

    return NextResponse.json({
      message: "Fixes generated and pushed",
      fixIteration: currentIterations + 1,
      repoUrl,
    });
  } catch (err) {
    setStageError(id, err instanceof Error ? err.message : "Fix generation failed");
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fix generation failed" },
      { status: 500 }
    );
  }
}
