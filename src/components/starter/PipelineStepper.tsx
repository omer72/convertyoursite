"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
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

function getStageColors(mode: "light" | "dark") {
  const isDark = mode === "dark";
  return {
    done: {
      bg: isDark ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.08)",
      icon: isDark ? "#4ade80" : "#22c55e",
      border: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.25)",
      iconBg: isDark ? "rgba(34,197,94,0.15)" : "rgba(34,197,94,0.1)",
    },
    in_progress: {
      bg: isDark ? "rgba(6,182,212,0.08)" : "rgba(37,99,235,0.06)",
      icon: isDark ? "#22d3ee" : "#2563eb",
      border: isDark ? "rgba(6,182,212,0.25)" : "rgba(37,99,235,0.25)",
      iconBg: isDark ? "rgba(6,182,212,0.15)" : "rgba(37,99,235,0.1)",
    },
    error: {
      bg: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.06)",
      icon: isDark ? "#f87171" : "#ef4444",
      border: isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.25)",
      iconBg: isDark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)",
    },
    pending: {
      bg: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)",
      icon: isDark ? "#4b5563" : "#9ca3af",
      border: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)",
      iconBg: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
    },
  } as const;
}

function StageStatusBadge({ status, isDark }: { status: StageStatus; isDark: boolean }) {
  if (status === "done") {
    return (
      <CheckCircleIcon
        sx={{ fontSize: 16, color: isDark ? "#4ade80" : "#22c55e" }}
      />
    );
  }
  if (status === "in_progress") {
    return (
      <CircularProgress
        size={14}
        sx={{ color: isDark ? "#22d3ee" : "#2563eb" }}
      />
    );
  }
  if (status === "error") {
    return (
      <ErrorIcon
        sx={{ fontSize: 16, color: isDark ? "#f87171" : "#ef4444" }}
      />
    );
  }
  return null;
}

interface PipelineStepperProps {
  stages: PipelineStage[];
}

export default function PipelineStepper({ stages }: PipelineStepperProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const colors = getStageColors(theme.palette.mode);

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
            bgcolor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              height: "100%",
              width: `${progress}%`,
              borderRadius: 3,
              background: isDark
                ? "linear-gradient(90deg, #06b6d4 0%, #4ade80 100%)"
                : "linear-gradient(90deg, #2563eb 0%, #22c55e 100%)",
              transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              ...(progress > 0 &&
                progress < 100 && {
                  boxShadow: isDark
                    ? "0 0 8px rgba(6,182,212,0.4)"
                    : "0 0 6px rgba(37,99,235,0.3)",
                }),
            }}
          />
        </Box>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: progress === 100
              ? isDark ? "#4ade80" : "#22c55e"
              : isDark ? "#22d3ee" : "#2563eb",
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
          const c = colors[stage.status];
          const StageIconComponent = STAGE_ICONS[i] || PlayArrowRoundedIcon;
          const isActive = stage.status === "in_progress";

          return (
            <Box
              key={i}
              className="flex items-center gap-3"
              sx={{
                p: 1.5,
                borderRadius: "0.625rem",
                border: "1px solid",
                borderColor: c.border,
                bgcolor: c.bg,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                ...(isActive && {
                  boxShadow: isDark
                    ? "0 0 0 1px rgba(6,182,212,0.1), 0 2px 8px -2px rgba(6,182,212,0.15)"
                    : "0 0 0 1px rgba(37,99,235,0.1), 0 2px 8px -2px rgba(37,99,235,0.1)",
                }),
                "@keyframes subtle-glow": {
                  "0%, 100%": { opacity: 1 },
                  "50%": { opacity: 0.7 },
                },
                ...(isActive && {
                  animation: "subtle-glow 2.5s ease-in-out infinite",
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
                  bgcolor: c.iconBg,
                  flexShrink: 0,
                  transition: "background-color 0.3s ease",
                }}
              >
                <StageIconComponent
                  sx={{
                    fontSize: 18,
                    color: c.icon,
                    transition: "color 0.3s ease",
                  }}
                />
              </Box>

              {/* Label + description */}
              <Box className="flex-1 min-w-0">
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 700 : 500,
                    color:
                      stage.status === "pending"
                        ? "text.secondary"
                        : "text.primary",
                    fontSize: "0.825rem",
                    lineHeight: 1.3,
                    transition: "color 0.3s ease",
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
              <Box
                sx={{
                  flexShrink: 0,
                  width: 20,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <StageStatusBadge status={stage.status} isDark={isDark} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
