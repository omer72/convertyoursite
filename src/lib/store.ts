import { PIPELINE_STAGES, PipelineStage } from "@/components/starter/PipelineStepper";

export interface StoredProject {
  id: string;
  clientName: string;
  websiteUrl: string;
  description: string;
  specialRequirements: string | null;
  createdAt: string;
  pipelineStage: number;
  pipelineStatus: "in_progress" | "done" | "error";
  stages: PipelineStage[];
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
