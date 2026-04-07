"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CircularProgress from "@mui/material/CircularProgress";
import { PIPELINE_STAGES, PipelineStage } from "./PipelineStepper";
import { Project } from "./ProjectCard";

interface FormData {
  clientName: string;
  websiteUrl: string;
  description: string;
  specialRequirements: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export const STORAGE_KEY = "starter_projects";

function buildInitialStages(): PipelineStage[] {
  return PIPELINE_STAGES.map((s, i) => ({
    label: s.label,
    description: s.description,
    status: i === 0 ? "in_progress" : "pending",
  }));
}

interface StarterFormProps {
  onProjectCreated?: (project: Project) => void;
  onBack?: () => void;
}

export default function StarterForm({ onProjectCreated, onBack }: StarterFormProps) {
  const [form, setForm] = useState<FormData>({
    clientName: "",
    websiteUrl: "",
    description: "",
    specialRequirements: "",
  });
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      // Validate required fields
      if (!form.clientName.trim()) throw new Error("Client name is required");
      if (!form.websiteUrl.trim()) throw new Error("Website URL is required");
      if (!form.description.trim()) throw new Error("Description is required");

      // Validate URL format
      try {
        new URL(form.websiteUrl);
      } catch {
        throw new Error("Invalid website URL");
      }

      // Create project record with pipeline data
      const project: Project = {
        id: crypto.randomUUID(),
        clientName: form.clientName.trim(),
        websiteUrl: form.websiteUrl.trim(),
        description: form.description.trim(),
        specialRequirements: form.specialRequirements.trim() || null,
        createdAt: new Date().toISOString(),
        pipelineStage: 1,
        pipelineStatus: "in_progress",
        stages: buildInitialStages(),
      };

      // Store in localStorage
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      existing.push(project);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));

      setStatus("success");
      setForm({
        clientName: "",
        websiteUrl: "",
        description: "",
        specialRequirements: "",
      });

      if (onProjectCreated) {
        onProjectCreated(project);
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  return (
    <Box className="max-w-2xl mx-auto" sx={{ px: 3, py: 6 }}>
      {onBack && (
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          sx={{ mb: 2, color: "text.secondary" }}
        >
          Back to Dashboard
        </Button>
      )}
      <Box className="mb-8 text-center">
        <Typography variant="h2" component="h1" gutterBottom>
          New Project Starter
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter the client details below to create a new project.
        </Typography>
      </Box>

      {status === "success" && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: "0.75rem" }}>
          Project created successfully! You can submit another one or close this
          page.
        </Alert>
      )}

      {status === "error" && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "0.75rem" }}>
          {errorMessage}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 4,
          borderRadius: "0.75rem",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box className="space-y-5">
          <TextField
            label="Client Name"
            name="clientName"
            value={form.clientName}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            placeholder="Acme Corp"
          />

          <TextField
            label="Website URL"
            name="websiteUrl"
            type="url"
            value={form.websiteUrl}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            placeholder="https://example.com"
          />

          <TextField
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Describe the project goals, target audience, and key features..."
          />

          <TextField
            label="Special Requirements"
            name="specialRequirements"
            value={form.specialRequirements}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Any specific technologies, integrations, or constraints... (optional)"
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={status === "submitting"}
            endIcon={
              status === "submitting" ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <RocketLaunchIcon />
              )
            }
            sx={{
              bgcolor: "#2563eb",
              fontWeight: 600,
              py: 1.5,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            {status === "submitting" ? "Creating Project..." : "Create Project"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
