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
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LanguageIcon from "@mui/icons-material/Language";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TuneIcon from "@mui/icons-material/Tune";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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

export default function StarterForm({
  onProjectCreated,
  onBack,
}: StarterFormProps) {
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
      if (!form.clientName.trim()) throw new Error("Client name is required");
      if (!form.websiteUrl.trim()) throw new Error("Website URL is required");
      if (!form.description.trim()) throw new Error("Description is required");

      try {
        new URL(form.websiteUrl);
      } catch {
        throw new Error("Invalid website URL");
      }

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

      let existing: Project[] = [];
      try {
        existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      } catch {
        existing = [];
      }
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

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "0.625rem",
      bgcolor: (theme: { palette: { mode: string } }) =>
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,0.03)"
          : "rgba(255,255,255,0.5)",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: (theme: { palette: { mode: string } }) =>
          theme.palette.mode === "dark" ? "#06b6d4" : "#2563eb",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: (theme: { palette: { mode: string } }) =>
          theme.palette.mode === "dark" ? "#06b6d4" : "#2563eb",
        borderWidth: 2,
      },
    },
  };

  return (
    <Box
      className="min-h-[60vh]"
      sx={{
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.06) 0%, transparent 50%)"
            : "linear-gradient(180deg, #eff6ff 0%, rgba(255,255,255,0) 40%)",
      }}
    >
      <Box className="max-w-2xl mx-auto" sx={{ px: 3, py: 5 }}>
        {onBack && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            sx={{
              mb: 2,
              color: "text.secondary",
              fontWeight: 500,
              "&:hover": { color: "primary.main", bgcolor: "transparent" },
            }}
          >
            Back to Dashboard
          </Button>
        )}

        {/* Header */}
        <Box className="mb-8 text-center">
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "0.875rem",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)"
                  : "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2.5,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 8px 24px -4px rgba(6,182,212,0.35)"
                  : "0 8px 16px -4px rgba(37,99,235,0.3)",
            }}
          >
            <RocketLaunchIcon sx={{ fontSize: 26, color: "#fff" }} />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            New Project
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 1, maxWidth: 400, mx: "auto" }}
          >
            Enter the client details to kick off the website conversion pipeline.
          </Typography>
        </Box>

        {status === "success" && (
          <Alert
            severity="success"
            icon={<CheckCircleOutlineIcon />}
            sx={{
              mb: 3,
              borderRadius: "0.75rem",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(16,185,129,0.1)"
                  : "rgba(16,185,129,0.08)",
              border: "1px solid",
              borderColor: "rgba(16,185,129,0.2)",
            }}
          >
            Project created successfully! Redirecting to dashboard...
          </Alert>
        )}

        {status === "error" && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: "0.75rem",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(239,68,68,0.1)"
                  : "rgba(239,68,68,0.06)",
              border: "1px solid",
              borderColor: "rgba(239,68,68,0.15)",
            }}
          >
            {errorMessage}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: "1rem",
            border: "1px solid",
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.06)",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(20,20,20,0.6)"
                : "background.paper",
            backdropFilter: (theme) =>
              theme.palette.mode === "dark" ? "blur(12px)" : "none",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 1px 3px rgba(0,0,0,0.2), 0 8px 24px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.02)"
                : "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px -4px rgba(0,0,0,0.06)",
          }}
        >
          <Box className="space-y-5">
            {/* Client Info Section */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#06b6d4" : "primary.main",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.7rem",
                  mb: 2,
                }}
              >
                Client Information
              </Typography>
              <Box className="space-y-4">
                <TextField
                  label="Client Name"
                  name="clientName"
                  value={form.clientName}
                  onChange={handleChange}
                  required
                  fullWidth
                  variant="outlined"
                  placeholder="Acme Corp"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box sx={{ mr: 1, display: "flex", color: "text.secondary" }}>
                          <PersonOutlineIcon sx={{ fontSize: 20 }} />
                        </Box>
                      ),
                    },
                  }}
                  sx={inputSx}
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
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box sx={{ mr: 1, display: "flex", color: "text.secondary" }}>
                          <LanguageIcon sx={{ fontSize: 20 }} />
                        </Box>
                      ),
                    },
                  }}
                  sx={inputSx}
                />
              </Box>
            </Box>

            {/* Project Details Section */}
            <Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "#06b6d4" : "primary.main",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  fontSize: "0.7rem",
                  mb: 2,
                }}
              >
                Project Details
              </Typography>
              <Box className="space-y-4">
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
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box
                          sx={{
                            mr: 1,
                            display: "flex",
                            color: "text.secondary",
                            alignSelf: "flex-start",
                            mt: 1.5,
                          }}
                        >
                          <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
                        </Box>
                      ),
                    },
                  }}
                  sx={inputSx}
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
                  slotProps={{
                    input: {
                      startAdornment: (
                        <Box
                          sx={{
                            mr: 1,
                            display: "flex",
                            color: "text.secondary",
                            alignSelf: "flex-start",
                            mt: 1.5,
                          }}
                        >
                          <TuneIcon sx={{ fontSize: 20 }} />
                        </Box>
                      ),
                    },
                  }}
                  sx={inputSx}
                />
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={status === "submitting"}
              endIcon={
                status === "submitting" ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <RocketLaunchIcon sx={{ fontSize: 18 }} />
                )
              }
              sx={{
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)"
                    : "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                fontWeight: 600,
                py: 1.5,
                borderRadius: "0.625rem",
                textTransform: "none",
                fontSize: "0.95rem",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 4px 16px -2px rgba(6,182,212,0.35)"
                    : "0 4px 12px -2px rgba(37,99,235,0.35)",
                "&:hover": {
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #0891b2 0%, #4f46e5 100%)"
                      : "linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%)",
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 6px 20px -2px rgba(6,182,212,0.45)"
                      : "0 6px 16px -2px rgba(37,99,235,0.45)",
                },
                "&.Mui-disabled": {
                  background: (theme) =>
                    theme.palette.mode === "dark" ? "#1f2937" : "#e5e7eb",
                  boxShadow: "none",
                },
              }}
            >
              {status === "submitting"
                ? "Creating Project..."
                : "Launch Project"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
