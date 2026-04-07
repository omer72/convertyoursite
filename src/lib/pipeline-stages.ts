export type StageStatus = "pending" | "in_progress" | "done" | "error";

export interface PipelineStage {
  label: string;
  description: string;
  status: StageStatus;
}

export const PIPELINE_STAGES: { label: string; description: string }[] = [
  { label: "Starting", description: "Form submitted" },
  { label: "Reading Website", description: "Scraping/analyzing the old site" },
  { label: "Designing", description: "Generating design concept" },
  { label: "UI/UX", description: "Applying design system" },
  { label: "Creating Repo", description: "New GitHub repo created" },
  { label: "Generating Code", description: "Building new site code" },
  { label: "Deploying", description: "Deploying to GitHub Pages" },
  { label: "QA Validation", description: "Comparing new vs old" },
  { label: "Fixes", description: "Addressing issues" },
  { label: "Complete", description: "New site link ready" },
];
