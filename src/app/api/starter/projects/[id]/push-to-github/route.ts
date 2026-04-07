import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/auth";
import { getProject, advanceStage, updateProject, setStageError } from "@/lib/store";
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

  if (!project.generatedCode) {
    return NextResponse.json(
      { error: "No generated code available — code generation must complete first" },
      { status: 409 }
    );
  }

  // Must be at stage 5 (Creating Repo) to push
  if (project.pipelineStage !== 5) {
    return NextResponse.json(
      { error: `Project is at stage ${project.pipelineStage}, expected stage 5 (Creating Repo)` },
      { status: 409 }
    );
  }

  try {
    const { repoUrl } = await pushToGitHub(
      project.clientName,
      project.generatedCode
    );

    updateProject(id, { repoUrl });

    // Advance from stage 5 (Creating Repo) to stage 6 (Generating Code)
    advanceStage(id);

    const updated = getProject(id)!;
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "GitHub push failed";
    setStageError(id, message);
    return NextResponse.json(
      { error: message, project: getProject(id) },
      { status: 502 }
    );
  }
}
