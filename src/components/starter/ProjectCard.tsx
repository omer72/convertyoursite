"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LanguageIcon from "@mui/icons-material/Language";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PipelineStepper, { PipelineStage } from "./PipelineStepper";

export interface Project {
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

const STATUS_STYLES: Record<
  string,
  { bg: string; color: string; borderColor: string; label: string }
> = {
  in_progress: {
    bg: "rgba(37,99,235,0.08)",
    color: "#2563eb",
    borderColor: "rgba(37,99,235,0.2)",
    label: "In Progress",
  },
  done: {
    bg: "rgba(34,197,94,0.08)",
    color: "#16a34a",
    borderColor: "rgba(34,197,94,0.2)",
    label: "Complete",
  },
  error: {
    bg: "rgba(239,68,68,0.08)",
    color: "#dc2626",
    borderColor: "rgba(239,68,68,0.2)",
    label: "Error",
  },
};

interface ProjectCardProps {
  project: Project;
  onDelete?: (projectId: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  const currentStage = project.stages[project.pipelineStage - 1];
  const stageLabel = currentStage?.label ?? "Unknown";
  const statusStyle = STATUS_STYLES[project.pipelineStatus] || STATUS_STYLES.in_progress;

  const doneCount = project.stages.filter((s) => s.status === "done").length;
  const progress = Math.round((doneCount / project.stages.length) * 100);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: expanded ? "primary.main" : "rgba(0,0,0,0.06)",
        borderRadius: "0.875rem",
        bgcolor: "background.paper",
        overflow: "hidden",
        transition: "all 0.25s ease",
        boxShadow: expanded
          ? "0 4px 16px -2px rgba(37,99,235,0.1)"
          : "0 1px 3px rgba(0,0,0,0.04)",
        "&:hover": {
          borderColor: expanded ? "primary.main" : "rgba(37,99,235,0.2)",
          boxShadow: expanded
            ? "0 4px 16px -2px rgba(37,99,235,0.1)"
            : "0 2px 8px -1px rgba(0,0,0,0.06)",
        },
      }}
    >
      {/* Mini progress bar at top */}
      <Box
        sx={{
          height: 3,
          bgcolor: "rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${progress}%`,
            background:
              project.pipelineStatus === "done"
                ? "#22c55e"
                : project.pipelineStatus === "error"
                  ? "#ef4444"
                  : "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
            transition: "width 0.5s ease-out",
          }}
        />
      </Box>

      {/* Header row */}
      <Box
        role="button"
        tabIndex={0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
        className="flex items-center justify-between cursor-pointer"
        sx={{ px: 2.5, py: 2 }}
        onClick={() => setExpanded((v) => !v)}
      >
        <Box className="flex-1 min-w-0">
          <Box className="flex items-center gap-2 mb-1">
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, letterSpacing: "-0.005em" }}
              noWrap
            >
              {project.clientName}
            </Typography>
            <Chip
              label={stageLabel}
              size="small"
              sx={{
                fontWeight: 600,
                fontSize: "0.7rem",
                height: 22,
                bgcolor: statusStyle.bg,
                color: statusStyle.color,
                border: "1px solid",
                borderColor: statusStyle.borderColor,
                "& .MuiChip-label": { px: 1.5 },
              }}
            />
          </Box>
          <Box className="flex items-center gap-3">
            <Box className="flex items-center gap-1">
              <LanguageIcon
                sx={{ fontSize: 13, color: "text.secondary", opacity: 0.7 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ maxWidth: 260, fontSize: "0.8rem" }}
              >
                {project.websiteUrl}
              </Typography>
            </Box>
            <Box className="flex items-center gap-1">
              <CalendarTodayIcon
                sx={{ fontSize: 12, color: "text.secondary", opacity: 0.7 }}
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: "0.8rem" }}
              >
                {new Date(project.createdAt).toLocaleDateString()}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                color: progress === 100 ? "#22c55e" : "#2563eb",
                ml: "auto",
              }}
            >
              {progress}%
            </Typography>
          </Box>
        </Box>
        <Box className="flex items-center">
          {onDelete && (
            <IconButton
              size="small"
              aria-label={`Delete project ${project.clientName}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              sx={{
                ml: 0.5,
                color: "text.secondary",
                opacity: 0.5,
                "&:hover": { opacity: 1, color: "error.main" },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </IconButton>
          )}
          <IconButton
            size="small"
            aria-label={expanded ? "Collapse project details" : "Expand project details"}
            sx={{
              ml: 0.5,
              transition: "transform 0.25s ease",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ExpandMoreIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Expanded pipeline detail */}
      <Collapse in={expanded}>
        <Box
          sx={{
            px: 2.5,
            pb: 2.5,
            pt: 0.5,
            borderTop: "1px solid",
            borderColor: "rgba(0,0,0,0.04)",
          }}
        >
          {project.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2, fontSize: "0.825rem", lineHeight: 1.5 }}
            >
              {project.description}
            </Typography>
          )}
          <PipelineStepper stages={project.stages} />
        </Box>
      </Collapse>
    </Box>
  );
}
