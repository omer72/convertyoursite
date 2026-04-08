import { PIPELINE_STAGES, PipelineStage } from "@/lib/pipeline-stages";
import { put, list as blobList, del } from "@vercel/blob";

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

// ---------------------------------------------------------------------------
// Persistent store using Vercel Blob.
// Each project is stored as `starter-projects/{id}.json` in the blob store.
// An in-memory cache with a short TTL avoids redundant reads during the same
// request or rapid polling.
// ---------------------------------------------------------------------------

const BLOB_PREFIX = "starter-projects/";
const CACHE_TTL_MS = 4_000; // 4 seconds — shorter than the 8s poll interval

// In-memory write-through cache (per function instance)
const cache = new Map<string, { project: StoredProject; at: number }>();
let allLoadedAt = 0;

function blobPath(id: string): string {
  return `${BLOB_PREFIX}${id}.json`;
}

// Track the last Blob error for diagnostics
let lastBlobError: string | null = null;
export function getLastBlobError(): string | null { return lastBlobError; }

async function saveToBlob(project: StoredProject): Promise<void> {
  cache.set(project.id, { project, at: Date.now() });
  try {
    await put(blobPath(project.id), JSON.stringify(project), {
      access: "private",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    lastBlobError = null;
  } catch (err) {
    lastBlobError = err instanceof Error ? err.message : String(err);
    // Blob unavailable — in-memory cache still works within same function instance.
  }
}

async function loadFromBlob(id: string): Promise<StoredProject | undefined> {
  const cached = cache.get(id);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.project;

  try {
    const { blobs } = await blobList({ prefix: blobPath(id) });
    const blob = blobs.find((b) => b.pathname === blobPath(id));
    if (!blob) return undefined;
    const res = await fetch(blob.downloadUrl);
    if (!res.ok) return undefined;
    const project = (await res.json()) as StoredProject;
    cache.set(id, { project, at: Date.now() });
    return project;
  } catch {
    return undefined;
  }
}

async function loadAllFromBlob(): Promise<StoredProject[]> {
  if (Date.now() - allLoadedAt < CACHE_TTL_MS && cache.size > 0) {
    return Array.from(cache.values()).map((c) => c.project);
  }

  try {
    const { blobs } = await blobList({ prefix: BLOB_PREFIX });
    const projects: StoredProject[] = [];
    const now = Date.now();
    let readErrors = 0;
    for (const blob of blobs) {
      try {
        const res = await fetch(blob.downloadUrl);
        if (!res.ok) {
          readErrors++;
          lastBlobError = `Blob read failed: HTTP ${res.status} for ${blob.pathname}`;
          continue;
        }
        const project = (await res.json()) as StoredProject;
        cache.set(project.id, { project, at: now });
        projects.push(project);
      } catch (err) {
        readErrors++;
        lastBlobError = `Blob read error: ${err instanceof Error ? err.message : String(err)}`;
      }
    }
    if (readErrors === 0 && blobs.length > 0) lastBlobError = null;
    if (blobs.length === 0) lastBlobError = lastBlobError ?? `Blob list empty (prefix: ${BLOB_PREFIX}) — writes may be failing silently`;
    allLoadedAt = now;
    return projects;
  } catch (err) {
    lastBlobError = `Blob list failed: ${err instanceof Error ? err.message : String(err)}`;
    return Array.from(cache.values()).map((c) => c.project);
  }
}

// ---------------------------------------------------------------------------
// Public API (unchanged signatures — all now async-safe via background saves)
// ---------------------------------------------------------------------------

export function listProjects(): StoredProject[] {
  // Synchronous return from cache; loadAllFromBlob called separately by routes
  return Array.from(cache.values())
    .map((c) => c.project)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Async version — routes should prefer this */
export async function listProjectsAsync(): Promise<StoredProject[]> {
  const projects = await loadAllFromBlob();
  return projects.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getProject(id: string): StoredProject | undefined {
  const cached = cache.get(id);
  return cached?.project;
}

/** Async version — routes should prefer this for cross-function reads */
export async function getProjectAsync(id: string): Promise<StoredProject | undefined> {
  return loadFromBlob(id);
}

export async function createProject(data: {
  clientName: string;
  websiteUrl: string;
  description: string;
  specialRequirements: string | null;
}): Promise<StoredProject> {
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
  cache.set(project.id, { project, at: Date.now() });
  await saveToBlob(project);
  return project;
}

export async function deleteProject(id: string): Promise<boolean> {
  const existed = cache.has(id);
  cache.delete(id);
  await del(blobPath(id)).catch(() => {});
  return existed;
}

export async function updateProject(id: string, updates: Partial<StoredProject>): Promise<StoredProject | null> {
  const cached = cache.get(id);
  if (!cached) return null;
  const project = cached.project;
  Object.assign(project, updates);
  cache.set(id, { project, at: Date.now() });
  await saveToBlob(project);
  return project;
}

export async function setStageError(id: string, errorMessage: string): Promise<StoredProject | null> {
  const cached = cache.get(id);
  if (!cached) return null;
  const project = cached.project;
  const currentIdx = project.pipelineStage - 1;
  project.stages[currentIdx].status = "error";
  project.pipelineStatus = "error";
  project.pipelineError = errorMessage;
  cache.set(id, { project, at: Date.now() });
  await saveToBlob(project);
  return project;
}

export async function advanceStage(id: string): Promise<StoredProject | null> {
  const cached = cache.get(id);
  if (!cached) return null;
  const project = cached.project;

  const currentIdx = project.pipelineStage - 1;
  if (currentIdx >= project.stages.length - 1) {
    project.stages[currentIdx].status = "done";
    project.pipelineStatus = "done";
  } else {
    project.stages[currentIdx].status = "done";
    project.pipelineStage += 1;
    project.stages[currentIdx + 1].status = "in_progress";
  }

  cache.set(id, { project, at: Date.now() });
  await saveToBlob(project);
  return project;
}

export async function rewindToStage(id: string, stage: number): Promise<StoredProject | null> {
  const cached = cache.get(id);
  if (!cached) return null;
  const project = cached.project;
  if (stage < 1 || stage > project.stages.length) return null;

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

  cache.set(id, { project, at: Date.now() });
  await saveToBlob(project);
  return project;
}
