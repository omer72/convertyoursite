"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import InboxIcon from "@mui/icons-material/Inbox";
import ProjectCard, { Project } from "./ProjectCard";

interface PipelineDashboardProps {
  projects: Project[];
  onNewProject: () => void;
}

export default function PipelineDashboard({
  projects,
  onNewProject,
}: PipelineDashboardProps) {
  return (
    <Box className="max-w-3xl mx-auto" sx={{ px: 3, py: 6 }}>
      {/* Header */}
      <Box className="flex items-center justify-between mb-6">
        <Box>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            Pipeline Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewProject}
          sx={{
            bgcolor: "#2563eb",
            fontWeight: 600,
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          New Project
        </Button>
      </Box>

      {/* Project list */}
      {projects.length === 0 ? (
        <Box
          className="flex flex-col items-center justify-center text-center"
          sx={{
            py: 10,
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: "0.75rem",
          }}
        >
          <InboxIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No projects yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first project to see the pipeline in action.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onNewProject}
          >
            Create Project
          </Button>
        </Box>
      ) : (
        <Box className="space-y-3">
          {[...projects].reverse().map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </Box>
      )}
    </Box>
  );
}
