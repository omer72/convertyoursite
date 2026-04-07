import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/auth";
import { getProject, advanceStage, updateProject, setStageError } from "@/lib/store";
import { runQaComparison } from "@/lib/qa-checker";

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

  if (!project.deployedUrl) {
    return NextResponse.json(
      { error: "No deployed URL — deployment must complete first" },
      { status: 409 }
    );
  }

  if (!project.scrapeResult) {
    return NextResponse.json(
      { error: "No scrape data available for comparison" },
      { status: 409 }
    );
  }

  // Must be at stage 8 (QA Validation) to run QA
  if (project.pipelineStage !== 8) {
    return NextResponse.json(
      { error: `Project is at stage ${project.pipelineStage}, expected stage 8 (QA Validation)` },
      { status: 409 }
    );
  }

  try {
    const qaReport = await runQaComparison(
      project.scrapeResult,
      project.deployedUrl,
      project.websiteUrl
    );

    updateProject(id, { qaReport });

    // Advance from stage 8 (QA Validation) to next stage
    advanceStage(id);

    // If any checks failed, advance to stage 9 (Fixes)
    // If all passed, advance again to stage 10 (Complete)
    if (qaReport.summary.fail === 0) {
      advanceStage(id); // Skip Fixes, go to Complete
    }

    const updated = getProject(id)!;
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "QA check failed";
    setStageError(id, message);
    return NextResponse.json(
      { error: message, project: getProject(id) },
      { status: 502 }
    );
  }
}
