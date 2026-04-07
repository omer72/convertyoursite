import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/auth";
import { getProject, advanceStage, updateProject, setStageError } from "@/lib/store";
import { scrapeWebsite } from "@/lib/scraper";

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

  // Must be at stage 1 (Starting) to begin scraping
  if (project.pipelineStage !== 1) {
    return NextResponse.json(
      { error: "Project is not at the Starting stage" },
      { status: 409 }
    );
  }

  // Advance to stage 2 (Reading Website)
  advanceStage(id);

  try {
    const scrapeResult = await scrapeWebsite(project.websiteUrl);

    // Store scrape results
    updateProject(id, { scrapeResult });

    // Advance to stage 3 (Designing)
    advanceStage(id);

    const updated = getProject(id)!;
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Scrape failed";
    setStageError(id, message);
    return NextResponse.json(
      { error: message, project: getProject(id) },
      { status: 502 }
    );
  }
}
