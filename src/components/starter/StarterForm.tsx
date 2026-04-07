"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CircularProgress from "@mui/material/CircularProgress";

interface FormData {
  clientName: string;
  websiteUrl: string;
  description: string;
  specialRequirements: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function StarterForm() {
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
      const res = await fetch("/convertyoursite/api/starter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setForm({
        clientName: "",
        websiteUrl: "",
        description: "",
        specialRequirements: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  return (
    <Box className="max-w-2xl mx-auto" sx={{ px: 3, py: 6 }}>
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
