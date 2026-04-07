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
import { useTheme } from "@mui/material/styles";
import PipelineStepper, { PipelineStage } from "./PipelineStepper";
import type { ScrapeResult } from "@/lib/store";

export interface Project {
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
}

function getStatusStyles(isDark: boolean) {
  return {
    in_progress: {
      bg: isDark ? "rgba(6,182,212,0.1)" : "rgba(37,99,235,0.08)",
      color: isDark ? "#22d3ee" : "#2563eb",
      borderColor: isDark ? "rgba(6,182,212,0.2)" : "rgba(37,99,235,0.2)",
      label: "In Progress",
    },
    done: {
      bg: isDark ? "rgba(34,197,94,0.1)" : "rgba(34,197,94,0.08)",
      color: isDark ? "#4ade80" : "#16a34a",
      borderColor: isDark ? "rgba(34,197,94,0.2)" : "rgba(34,197,94,0.2)",
      label: "Complete",
    },
    error: {
      bg: isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.08)",
      color: isDark ? "#f87171" : "#dc2626",
      borderColor: isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.2)",
      label: "Error",
    },
  } as const;
}

interface ProjectCardProps {
  project: Project;
  onDelete?: (projectId: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const currentStage = project.stages[project.pipelineStage - 1];
  const stageLabel = currentStage?.label ?? "Unknown";
  const statusStyles = getStatusStyles(isDark);
  const statusStyle = statusStyles[project.pipelineStatus] || statusStyles.in_progress;

  const doneCount = project.stages.filter((s) => s.status === "done").length;
  const progress = Math.round((doneCount / project.stages.length) * 100);

  const progressBarColor =
    project.pipelineStatus === "done"
      ? isDark ? "#4ade80" : "#22c55e"
      : project.pipelineStatus === "error"
        ? isDark ? "#f87171" : "#ef4444"
        : isDark
          ? "linear-gradient(90deg, #06b6d4 0%, #8b5cf6 100%)"
          : "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)";

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: expanded
          ? isDark ? "rgba(6,182,212,0.3)" : "primary.main"
          : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
        borderRadius: "0.875rem",
        bgcolor: isDark ? "rgba(20,20,20,0.6)" : "background.paper",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: isDark ? "blur(8px)" : "none",
        boxShadow: expanded
          ? isDark
            ? "0 4px 20px -2px rgba(6,182,212,0.12), inset 0 1px 0 rgba(255,255,255,0.02)"
            : "0 4px 16px -2px rgba(37,99,235,0.1)"
          : isDark
            ? "0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.02)"
            : "0 1px 3px rgba(0,0,0,0.04)",
        "&:hover": {
          borderColor: expanded
            ? isDark ? "rgba(6,182,212,0.3)" : "primary.main"
            : isDark ? "rgba(6,182,212,0.15)" : "rgba(37,99,235,0.2)",
          boxShadow: expanded
            ? isDark
              ? "0 4px 20px -2px rgba(6,182,212,0.12), inset 0 1px 0 rgba(255,255,255,0.02)"
              : "0 4px 16px -2px rgba(37,99,235,0.1)"
            : isDark
              ? "0 2px 8px -1px rgba(6,182,212,0.08), inset 0 1px 0 rgba(255,255,255,0.02)"
              : "0 2px 8px -1px rgba(0,0,0,0.06)",
        },
      }}
    >
      {/* Mini progress bar at top */}
      <Box
        sx={{
          height: 3,
          bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${progress}%`,
            background: progressBarColor,
            transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            ...(progress > 0 && progress < 100 && isDark && {
              boxShadow: "0 0 6px rgba(6,182,212,0.3)",
            }),
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
                color: progress === 100
                  ? isDark ? "#4ade80" : "#22c55e"
                  : isDark ? "#22d3ee" : "#2563eb",
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
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              color: "text.secondary",
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
            borderColor: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.04)",
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

          {project.pipelineError && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: "0.5rem",
                bgcolor: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
                border: "1px solid",
                borderColor: isDark ? "rgba(239,68,68,0.2)" : "rgba(239,68,68,0.15)",
              }}
            >
              <Typography variant="body2" sx={{ color: isDark ? "#f87171" : "#dc2626", fontSize: "0.8rem" }}>
                Error: {project.pipelineError}
              </Typography>
            </Box>
          )}

          {project.scrapeResult && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: "0.5rem",
                bgcolor: isDark ? "rgba(6,182,212,0.05)" : "rgba(37,99,235,0.03)",
                border: "1px solid",
                borderColor: isDark ? "rgba(6,182,212,0.1)" : "rgba(37,99,235,0.08)",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, fontSize: "0.825rem" }}>
                Scrape Results
              </Typography>
              <Box className="grid grid-cols-2 sm:grid-cols-4 gap-2" sx={{ mb: 1.5 }}>
                {[
                  { label: "Pages", value: project.scrapeResult.totalPages },
                  { label: "Failed", value: project.scrapeResult.failedPages },
                  { label: "Images", value: project.scrapeResult.pages.reduce((sum, p) => sum + p.images.length, 0) },
                  { label: "Nav Items", value: project.scrapeResult.navigation.length },
                ].map((stat) => (
                  <Box key={stat.label} sx={{ textAlign: "center", py: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: "1rem", color: isDark ? "#22d3ee" : "#2563eb" }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem" }}>
                      {stat.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
              {project.scrapeResult.meta.title && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", mb: 0.5 }}>
                  <strong>Title:</strong> {project.scrapeResult.meta.title}
                </Typography>
              )}
              {project.scrapeResult.meta.description && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", mb: 0.5 }}>
                  <strong>Description:</strong> {project.scrapeResult.meta.description}
                </Typography>
              )}
              {project.scrapeResult.branding.colors.length > 0 && (
                <Box className="flex items-center gap-1 mt-1">
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: "0.7rem", mr: 0.5 }}>
                    Colors:
                  </Typography>
                  {project.scrapeResult.branding.colors.slice(0, 8).map((color) => (
                    <Box
                      key={color}
                      title={color}
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: "3px",
                        bgcolor: color,
                        border: "1px solid",
                        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
                      }}
                    />
                  ))}
                </Box>
              )}
              {project.scrapeResult.contact.emails.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", mt: 0.5 }}>
                  <strong>Emails:</strong> {project.scrapeResult.contact.emails.join(", ")}
                </Typography>
              )}
              {project.scrapeResult.contact.phones.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", mt: 0.5 }}>
                  <strong>Phones:</strong> {project.scrapeResult.contact.phones.join(", ")}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
}
