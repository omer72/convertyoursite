import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "@/lib/auth";
import { listProjects, createProject } from "@/lib/store";

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

  return NextResponse.json(project, { status: 201 });
}
