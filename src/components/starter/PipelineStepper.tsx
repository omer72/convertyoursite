"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CircularProgress from "@mui/material/CircularProgress";

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

function StageIcon({ status }: { status: StageStatus }) {
  switch (status) {
    case "done":
      return <CheckCircleIcon sx={{ color: "#22c55e", fontSize: 28 }} />;
    case "in_progress":
      return <CircularProgress size={24} sx={{ color: "#3b82f6" }} />;
    case "error":
      return <ErrorIcon sx={{ color: "#ef4444", fontSize: 28 }} />;
    default:
      return (
        <RadioButtonUncheckedIcon sx={{ color: "#4b5563", fontSize: 28 }} />
      );
  }
}

interface PipelineStepperProps {
  stages: PipelineStage[];
}

export default function PipelineStepper({ stages }: PipelineStepperProps) {
  return (
    <Box className="space-y-1">
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1;
        return (
          <Box key={i} className="flex items-start gap-3">
            {/* Icon + connector line */}
            <Box className="flex flex-col items-center" sx={{ minWidth: 28 }}>
              <StageIcon status={stage.status} />
              {!isLast && (
                <Box
                  sx={{
                    width: 2,
                    height: 24,
                    bgcolor:
                      stage.status === "done" ? "#22c55e" : "divider",
                    my: 0.25,
                    transition: "background-color 0.3s",
                  }}
                />
              )}
            </Box>
            {/* Label + description */}
            <Box sx={{ pt: 0.25, pb: isLast ? 0 : 1 }}>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: stage.status === "in_progress" ? 700 : 500,
                  color:
                    stage.status === "pending"
                      ? "text.secondary"
                      : "text.primary",
                }}
              >
                {stage.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stage.description}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
