import { NextRequest, NextResponse, after } from "next/server";
import { checkSession } from "@/lib/auth";
import { listProjects, createProject, advanceStage, updateProject, setStageError } from "@/lib/store";
import { scrapeWebsite } from "@/lib/scraper";

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

  // Auto-start scraping in the background after the response is sent
  after(async () => {
    const id = project.id;
    // Advance from stage 1 (Starting) to stage 2 (Reading Website)
    advanceStage(id);
    try {
      const scrapeResult = await scrapeWebsite(project.websiteUrl);
      updateProject(id, { scrapeResult });
      // Advance from stage 2 (Reading Website) to stage 3 (Designing)
      advanceStage(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Scrape failed";
      setStageError(id, message);
    }
  });

  return NextResponse.json(project, { status: 201 });
}
