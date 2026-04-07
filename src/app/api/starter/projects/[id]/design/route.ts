import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/auth";
import { getProject, advanceStage, updateProject, setStageError } from "@/lib/store";
import { generateDesign } from "@/lib/design-generator";

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

  if (!project.scrapeResult) {
    return NextResponse.json(
      { error: "No scrape results available — scrape must complete first" },
      { status: 409 }
    );
  }

  // Must be at stage 3 (Designing) to generate design
  if (project.pipelineStage !== 3) {
    return NextResponse.json(
      { error: `Project is at stage ${project.pipelineStage}, expected stage 3 (Designing)` },
      { status: 409 }
    );
  }

  try {
    const design = await generateDesign(
      project.scrapeResult,
      project.clientName,
      project.description,
      project.specialRequirements
    );

    updateProject(id, { design });

    // Advance from stage 3 (Designing) to stage 4 (UI/UX)
    advanceStage(id);

    const updated = getProject(id)!;
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Design generation failed";
    setStageError(id, message);
    return NextResponse.json(
      { error: message, project: getProject(id) },
      { status: 502 }
    );
  }
}
