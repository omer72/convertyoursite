import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/auth";
import { getProject, advanceStage, updateProject, setStageError } from "@/lib/store";
import { generateCode } from "@/lib/code-generator";

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

  if (!project.design) {
    return NextResponse.json(
      { error: "No design spec available — design must be generated first" },
      { status: 409 }
    );
  }

  if (!project.scrapeResult) {
    return NextResponse.json(
      { error: "No scrape results available" },
      { status: 409 }
    );
  }

  // Must be at stage 4 (UI/UX) to generate code
  if (project.pipelineStage !== 4) {
    return NextResponse.json(
      { error: `Project is at stage ${project.pipelineStage}, expected stage 4 (UI/UX)` },
      { status: 409 }
    );
  }

  try {
    const generatedCode = await generateCode(
      project.design,
      project.scrapeResult,
      project.clientName
    );

    updateProject(id, { generatedCode });

    // Advance from stage 4 (UI/UX) to stage 5 (Creating Repo)
    advanceStage(id);

    const updated = getProject(id)!;
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Code generation failed";
    setStageError(id, message);
    return NextResponse.json(
      { error: message, project: getProject(id) },
      { status: 502 }
    );
  }
}
