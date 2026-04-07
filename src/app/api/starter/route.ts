import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const COOKIE_NAME = "starter_auth";

interface StarterInput {
  clientName: string;
  websiteUrl: string;
  description: string;
  specialRequirements?: string;
}

export async function POST(req: NextRequest) {
  // Check auth
  const cookie = req.cookies.get(COOKIE_NAME);
  if (cookie?.value !== "1") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: StarterInput = await req.json();

  // Validate required fields
  if (!body.clientName?.trim()) {
    return NextResponse.json(
      { error: "Client name is required" },
      { status: 400 }
    );
  }
  if (!body.websiteUrl?.trim()) {
    return NextResponse.json(
      { error: "Website URL is required" },
      { status: 400 }
    );
  }
  if (!body.description?.trim()) {
    return NextResponse.json(
      { error: "Description is required" },
      { status: 400 }
    );
  }

  // Validate URL format
  try {
    new URL(body.websiteUrl);
  } catch {
    return NextResponse.json(
      { error: "Invalid website URL" },
      { status: 400 }
    );
  }

  // Create project record
  const project = {
    id: crypto.randomUUID(),
    clientName: body.clientName.trim(),
    websiteUrl: body.websiteUrl.trim(),
    description: body.description.trim(),
    specialRequirements: body.specialRequirements?.trim() || null,
    createdAt: new Date().toISOString(),
  };

  // Write to data/projects/
  const dataDir = path.join(process.cwd(), "data", "projects");
  await fs.mkdir(dataDir, { recursive: true });
  const filePath = path.join(dataDir, `${project.id}.json`);
  await fs.writeFile(filePath, JSON.stringify(project, null, 2));

  return NextResponse.json({ ok: true, project });
}
