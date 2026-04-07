import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/auth";
import { getProject, advanceStage, updateProject, setStageError } from "@/lib/store";
import { deployToGitHubPages } from "@/lib/github-deploy";

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

  if (!project.repoUrl) {
    return NextResponse.json(
      { error: "No repository URL — GitHub push must complete first" },
      { status: 409 }
    );
  }

  // Must be at stage 7 (Deploying) to deploy
  if (project.pipelineStage !== 7) {
    return NextResponse.json(
      { error: `Project is at stage ${project.pipelineStage}, expected stage 7 (Deploying)` },
      { status: 409 }
    );
  }

  // Extract repoFullName from repoUrl (https://github.com/owner/repo)
  const repoFullName = project.repoUrl.replace("https://github.com/", "");

  try {
    const { deployedUrl } = await deployToGitHubPages(repoFullName);
    updateProject(id, { deployedUrl });

    // Advance from stage 7 (Deploying) to stage 8 (QA Validation)
    advanceStage(id);

    const updated = getProject(id)!;
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Deployment failed";
    setStageError(id, message);
    return NextResponse.json(
      { error: message, project: getProject(id) },
      { status: 502 }
    );
  }
}
