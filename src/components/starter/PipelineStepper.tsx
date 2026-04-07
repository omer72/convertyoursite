"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CircularProgress from "@mui/material/CircularProgress";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import SearchIcon from "@mui/icons-material/Search";
import BrushIcon from "@mui/icons-material/Brush";
import PaletteIcon from "@mui/icons-material/Palette";
import GitHubIcon from "@mui/icons-material/GitHub";
import CodeIcon from "@mui/icons-material/Code";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VerifiedIcon from "@mui/icons-material/Verified";
import BuildIcon from "@mui/icons-material/Build";
import CelebrationIcon from "@mui/icons-material/Celebration";

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

const STAGE_ICONS = [
  PlayArrowRoundedIcon,
  SearchIcon,
  BrushIcon,
  PaletteIcon,
  GitHubIcon,
  CodeIcon,
  CloudUploadIcon,
  VerifiedIcon,
  BuildIcon,
  CelebrationIcon,
];

const STAGE_COLORS: Record<StageStatus, { bg: string; icon: string; border: string }> = {
  done: {
    bg: "rgba(34,197,94,0.1)",
    icon: "#22c55e",
    border: "rgba(34,197,94,0.25)",
  },
  in_progress: {
    bg: "rgba(37,99,235,0.08)",
    icon: "#2563eb",
    border: "rgba(37,99,235,0.25)",
  },
  error: {
    bg: "rgba(239,68,68,0.08)",
    icon: "#ef4444",
    border: "rgba(239,68,68,0.25)",
  },
  pending: {
    bg: "rgba(0,0,0,0.02)",
    icon: "#9ca3af",
    border: "rgba(0,0,0,0.06)",
  },
};

function StageStatusBadge({ status }: { status: StageStatus }) {
  if (status === "done") {
    return <CheckCircleIcon sx={{ fontSize: 16, color: "#22c55e" }} />;
  }
  if (status === "in_progress") {
    return <CircularProgress size={14} sx={{ color: "#2563eb" }} />;
  }
  if (status === "error") {
    return <ErrorIcon sx={{ fontSize: 16, color: "#ef4444" }} />;
  }
  return null;
}

interface PipelineStepperProps {
  stages: PipelineStage[];
}

export default function PipelineStepper({ stages }: PipelineStepperProps) {
  const doneCount = stages.filter((s) => s.status === "done").length;
  const progress = Math.round((doneCount / stages.length) * 100);

  return (
    <Box>
      {/* Progress bar */}
      <Box className="flex items-center gap-3 mb-4">
        <Box
          sx={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            bgcolor: "rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${progress}%`,
              borderRadius: 3,
              background: "linear-gradient(90deg, #2563eb 0%, #22c55e 100%)",
              transition: "width 0.5s ease-out",
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: progress === 100 ? "#22c55e" : "#2563eb",
            minWidth: 40,
            textAlign: "right",
            fontSize: "0.8rem",
          }}
        >
          {progress}%
        </Typography>
      </Box>

      {/* Stage list */}
      <Box className="space-y-1.5">
        {stages.map((stage, i) => {
          const colors = STAGE_COLORS[stage.status];
          const StageIconComponent = STAGE_ICONS[i] || PlayArrowRoundedIcon;

          return (
            <Box
              key={i}
              className="flex items-center gap-3"
              sx={{
                p: 1.5,
                borderRadius: "0.625rem",
                border: "1px solid",
                borderColor: colors.border,
                bgcolor: colors.bg,
                transition: "all 0.25s ease",
                ...(stage.status === "in_progress" && {
                  boxShadow: "0 0 0 1px rgba(37,99,235,0.1)",
                }),
              }}
            >
              {/* Stage icon */}
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor:
                    stage.status === "pending"
                      ? "rgba(0,0,0,0.03)"
                      : `${colors.icon}15`,
                  flexShrink: 0,
                }}
              >
                <StageIconComponent
                  sx={{
                    fontSize: 18,
                    color: colors.icon,
                  }}
                />
              </Box>

              {/* Label + description */}
              <Box className="flex-1 min-w-0">
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: stage.status === "in_progress" ? 700 : 500,
                    color:
                      stage.status === "pending"
                        ? "text.secondary"
                        : "text.primary",
                    fontSize: "0.825rem",
                    lineHeight: 1.3,
                  }}
                  noWrap
                >
                  {stage.label}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: "0.7rem", lineHeight: 1.2 }}
                  noWrap
                >
                  {stage.description}
                </Typography>
              </Box>

              {/* Status badge */}
              <Box sx={{ flexShrink: 0, width: 20, display: "flex", justifyContent: "center" }}>
                <StageStatusBadge status={stage.status} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
