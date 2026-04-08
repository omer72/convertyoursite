import { PIPELINE_STAGES, PipelineStage } from "@/lib/pipeline-stages";
import { readFileSync, writeFileSync } from "fs";

export interface ScrapePageResult {
  url: string;
  title: string;
  headings: string[];
  paragraphs: string[];
  images: string[];
  links: string[];
  error?: string;
}

export interface ScrapeResult {
  pages: ScrapePageResult[];
  branding: {
    colors: string[];
    fonts: string[];
  };
  navigation: string[];
  contact: {
    emails: string[];
    phones: string[];
    socialLinks: string[];
  };
  meta: {
    title: string;
    description: string;
    ogTags: Record<string, string>;
    favicon: string;
  };
  scrapedAt: string;
  totalPages: number;
  failedPages: number;
}

export interface DesignSpec {
  layout: {
    pages: { name: string; path: string; sections: string[] }[];
    navigation: { items: { label: string; href: string }[] };
  };
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: string;
  };
  contentMapping: Record<string, { heading: string; content: string[]; images: string[] }>;
  components: {
    hero: { style: string; hasImage: boolean; hasSubtitle: boolean };
    sections: { name: string; type: string; description: string }[];
  };
}

export interface GeneratedCode {
  files: { path: string; content: string }[];
  generatedAt: string;
}

export interface QaCheck {
  name: string;
  status: "pass" | "fail" | "warn";
  details: string;
}

export interface QaReport {
  checks: QaCheck[];
  summary: { pass: number; fail: number; warn: number };
  originalUrl: string;
  deployedUrl: string;
  completedAt: string;
}

export interface StoredProject {
  id: string;
  clientName: string;
  websiteUrl: string;
  description: string;
  specialRequirements: string | null;
  createdAt: string;
  pipelineStage: number;
  pipelineStatus: "in_progress" | "done" | "error";
  pipelineError?: string;
  stages: PipelineStage[];
  scrapeResult?: ScrapeResult;
  design?: DesignSpec;
  generatedCode?: GeneratedCode;
  repoUrl?: string;
  repoFullName?: string;
  deployedUrl?: string;
  qaReport?: QaReport;
  fixIterations?: number;
}

// Persistent store using /tmp file + globalThis in-memory cache.
// On Vercel, each API route can be a separate function instance. /tmp is writable
// and shared within an instance, so we use it as a write-through cache to persist
// projects across module reloads and route boundaries within the same instance.
// For cross-instance persistence, replace with a Vercel Marketplace database.
const STORE_PATH = "/tmp/starter-projects.json";
const globalKey = "__starter_projects__";

function getProjects(): Map<string, StoredProject> {
  // Check globalThis cache first
  let map = (globalThis as Record<string, unknown>)[globalKey] as Map<string, StoredProject> | undefined;
  if (map && map.size > 0) return map;

  // Try loading from /tmp file
  map = new Map<string, StoredProject>();
  try {
    const data = readFileSync(STORE_PATH, "utf-8");
    const parsed = JSON.parse(data) as Record<string, StoredProject>;
    for (const [k, v] of Object.entries(parsed)) {
      map.set(k, v);
    }
  } catch {
    // File doesn't exist or is corrupt — start fresh
  }
  (globalThis as Record<string, unknown>)[globalKey] = map;
  return map;
}

function persistProjects(): void {
  const map = getProjects();
  const obj: Record<string, StoredProject> = {};
  for (const [k, v] of map) {
    obj[k] = v;
  }
  try {
    writeFileSync(STORE_PATH, JSON.stringify(obj));
  } catch {
    // /tmp write failed — in-memory state still works
  }
}


export function listProjects(): StoredProject[] {
  return Array.from(getProjects().values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getProject(id: string): StoredProject | undefined {
  return getProjects().get(id);
}

export function createProject(data: {
  clientName: string;
  websiteUrl: string;
  description: string;
  specialRequirements: string | null;
}): StoredProject {
  const project: StoredProject = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    pipelineStage: 1,
    pipelineStatus: "in_progress",
    stages: PIPELINE_STAGES.map((s, i) => ({
      label: s.label,
      description: s.description,
      status: i === 0 ? ("in_progress" as const) : ("pending" as const),
    })),
  };
  getProjects().set(project.id, project);
  persistProjects();
  return project;
}

export function deleteProject(id: string): boolean {
  const result = getProjects().delete(id);
  persistProjects();
  return result;
}

export function updateProject(id: string, updates: Partial<StoredProject>): StoredProject | null {
  const project = getProjects().get(id);
  if (!project) return null;
  Object.assign(project, updates);
  getProjects().set(id, project);
  persistProjects();
  return project;
}

export function setStageError(id: string, errorMessage: string): StoredProject | null {
  const project = getProjects().get(id);
  if (!project) return null;
  const currentIdx = project.pipelineStage - 1;
  project.stages[currentIdx].status = "error";
  project.pipelineStatus = "error";
  project.pipelineError = errorMessage;
  getProjects().set(id, project);
  persistProjects();
  return project;
}

export function advanceStage(id: string): StoredProject | null {
  const project = getProjects().get(id);
  if (!project) return null;

  const currentIdx = project.pipelineStage - 1;
  if (currentIdx >= project.stages.length - 1) {
    project.stages[currentIdx].status = "done";
    project.pipelineStatus = "done";
  } else {
    project.stages[currentIdx].status = "done";
    project.pipelineStage += 1;
    project.stages[currentIdx + 1].status = "in_progress";
  }

  getProjects().set(id, project);
  persistProjects();
  return project;
}

export function rewindToStage(id: string, stage: number): StoredProject | null {
  const project = getProjects().get(id);
  if (!project || stage < 1 || stage > project.stages.length) return null;

  project.pipelineStage = stage;
  project.pipelineStatus = "in_progress";
  delete project.pipelineError;

  for (let i = 0; i < project.stages.length; i++) {
    if (i < stage - 1) {
      project.stages[i].status = "done";
    } else if (i === stage - 1) {
      project.stages[i].status = "in_progress";
    } else {
      project.stages[i].status = "pending";
    }
  }

  getProjects().set(id, project);
  persistProjects();
  return project;
}
