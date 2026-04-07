import { PIPELINE_STAGES, PipelineStage } from "@/components/starter/PipelineStepper";

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
}

// In-memory store — replace with a Vercel Marketplace database for production persistence.
const projects = new Map<string, StoredProject>();

export function listProjects(): StoredProject[] {
  return Array.from(projects.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getProject(id: string): StoredProject | undefined {
  return projects.get(id);
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
  projects.set(project.id, project);
  return project;
}

export function deleteProject(id: string): boolean {
  return projects.delete(id);
}

export function updateProject(id: string, updates: Partial<StoredProject>): StoredProject | null {
  const project = projects.get(id);
  if (!project) return null;
  Object.assign(project, updates);
  projects.set(id, project);
  return project;
}

export function setStageError(id: string, errorMessage: string): StoredProject | null {
  const project = projects.get(id);
  if (!project) return null;
  const currentIdx = project.pipelineStage - 1;
  project.stages[currentIdx].status = "error";
  project.pipelineStatus = "error";
  project.pipelineError = errorMessage;
  projects.set(id, project);
  return project;
}

export function advanceStage(id: string): StoredProject | null {
  const project = projects.get(id);
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

  projects.set(id, project);
  return project;
}
