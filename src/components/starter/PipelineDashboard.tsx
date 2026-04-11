"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ProjectCard, { Project } from "./ProjectCard";

interface PipelineDashboardProps {
  projects: Project[];
  onNewProject: () => void;
  onDeleteProject?: (projectId: string) => void;
  onRetryProject?: (projectId: string) => void;
  onRefresh?: () => void;
}

export default function PipelineDashboard({
  projects,
  onNewProject,
  onDeleteProject,
  onRetryProject,
  onRefresh,
}: PipelineDashboardProps) {
  const activeCount = projects.filter(
    (p) => p.pipelineStatus === "in_progress"
  ).length;
  const doneCount = projects.filter(
    (p) => p.pipelineStatus === "done"
  ).length;

  return (
    <Box
      sx={{
        minHeight: "60vh",
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 50%)"
            : "linear-gradient(180deg, #eff6ff 0%, rgba(255,255,255,0) 30%)",
      }}
    >
      <Box className="max-w-3xl mx-auto" sx={{ px: 3, py: 5 }}>
        {/* Header */}
        <Box
          sx={{
            mb: 4,
            pb: 4,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box className="flex items-start justify-between flex-wrap gap-3">
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                Pipeline Dashboard
              </Typography>
              <Box className="flex items-center gap-4 mt-1.5">
                <Typography variant="body2" color="text.secondary">
                  {projects.length} project
                  {projects.length !== 1 ? "s" : ""}
                </Typography>
                {activeCount > 0 && (
                  <Box className="flex items-center gap-1.5">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark" ? "#22d3ee" : "#2563eb",
                        animation: "dashboard-pulse 2s ease-in-out infinite",
                        "@keyframes dashboard-pulse": {
                          "0%, 100%": {
                            opacity: 1,
                            transform: "scale(1)",
                          },
                          "50%": {
                            opacity: 0.5,
                            transform: "scale(0.85)",
                          },
                        },
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: (theme) =>
                          theme.palette.mode === "dark" ? "#22d3ee" : "#2563eb",
                        fontWeight: 500,
                      }}
                    >
                      {activeCount} active
                    </Typography>
                  </Box>
                )}
                {doneCount > 0 && (
                  <Box className="flex items-center gap-1.5">
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: (theme) =>
                          theme.palette.mode === "dark" ? "#4ade80" : "#22c55e",
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: (theme) =>
                          theme.palette.mode === "dark" ? "#4ade80" : "#22c55e",
                        fontWeight: 500,
                      }}
                    >
                      {doneCount} complete
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box className="flex items-center gap-1.5">
            {onRefresh && (
              <Tooltip title="Refresh projects">
                <IconButton
                  onClick={onRefresh}
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "#94a3b8" : "#64748b",
                    "&:hover": {
                      bgcolor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(148,163,184,0.1)"
                          : "rgba(100,116,139,0.08)",
                    },
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onNewProject}
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)"
                    : "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                fontWeight: 600,
                borderRadius: "0.625rem",
                textTransform: "none",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 4px 16px -2px rgba(6,182,212,0.3)"
                    : "0 4px 12px -2px rgba(37,99,235,0.3)",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #0891b2 0%, #4f46e5 100%)"
                      : "linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 6px 20px -2px rgba(6,182,212,0.4)"
                      : "0 6px 16px -2px rgba(37,99,235,0.4)",
                },
              }}
            >
              New Project
            </Button>
            </Box>
          </Box>
        </Box>

        {/* Project list */}
        {projects.length === 0 ? (
          <Box
            className="flex flex-col items-center justify-center text-center"
            sx={{
              py: 10,
              px: 4,
              border: "1px dashed",
              borderColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(6,182,212,0.2)"
                  : "rgba(37,99,235,0.2)",
              borderRadius: "1rem",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(6,182,212,0.03)"
                  : "rgba(239,246,255,0.5)",
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "1rem",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(99,102,241,0.12) 100%)"
                    : "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 2.5,
              }}
            >
              <RocketLaunchIcon
                sx={{
                  fontSize: 28,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#22d3ee" : "#2563eb",
                }}
              />
            </Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              No projects yet
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 300 }}
            >
              Create your first project to start the website conversion pipeline.
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onNewProject}
              sx={{
                borderRadius: "0.625rem",
                fontWeight: 600,
                textTransform: "none",
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "#06b6d4" : "#2563eb",
                color: (theme) =>
                  theme.palette.mode === "dark" ? "#22d3ee" : "#2563eb",
                "&:hover": {
                  borderColor: (theme) =>
                    theme.palette.mode === "dark" ? "#22d3ee" : "#1d4ed8",
                  bgcolor: (theme) =>
                    theme.palette.mode === "dark"
                      ? "rgba(6,182,212,0.06)"
                      : "rgba(37,99,235,0.04)",
                },
              }}
            >
              Create Project
            </Button>
          </Box>
        ) : (
          <Box className="space-y-3">
            {[...projects].reverse().map((project) => (
              <ProjectCard key={project.id} project={project} onDelete={onDeleteProject} onRetry={onRetryProject} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
