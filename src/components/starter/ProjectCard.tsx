"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import LinkIcon from "@mui/icons-material/Link";
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

function stageChipColor(status: string): "info" | "success" | "error" | "default" {
  if (status === "done") return "success";
  if (status === "error") return "error";
  if (status === "in_progress") return "info";
  return "default";
}

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  const currentStage = project.stages[project.pipelineStage - 1];
  const stageLabel = currentStage?.label ?? "Unknown";

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "0.75rem",
        bgcolor: "background.paper",
        overflow: "hidden",
        transition: "border-color 0.2s",
        "&:hover": { borderColor: "primary.dark" },
      }}
    >
      {/* Header row */}
      <Box
        className="flex items-center justify-between cursor-pointer"
        sx={{ px: 2.5, py: 2 }}
        onClick={() => setExpanded((v) => !v)}
      >
        <Box className="flex-1 min-w-0">
          <Box className="flex items-center gap-2 mb-0.5">
            <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
              {project.clientName}
            </Typography>
            <Chip
              label={stageLabel}
              size="small"
              color={stageChipColor(project.pipelineStatus)}
              sx={{ fontWeight: 500, fontSize: "0.75rem" }}
            />
          </Box>
          <Box className="flex items-center gap-1">
            <LinkIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{ maxWidth: 300 }}
            >
              {project.websiteUrl}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1.5 }}
            >
              {new Date(project.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small">
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Expanded pipeline detail */}
      <Collapse in={expanded}>
        <Box sx={{ px: 2.5, pb: 2.5, pt: 0.5 }}>
          <PipelineStepper stages={project.stages} />
        </Box>
      </Collapse>
    </Box>
  );
}
