"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import PasswordGate from "@/components/starter/PasswordGate";
import StarterForm from "@/components/starter/StarterForm";
import PipelineDashboard from "@/components/starter/PipelineDashboard";
import { Project } from "@/components/starter/ProjectCard";

type AuthState = "checking" | "unauthenticated" | "authenticated";
type View = "dashboard" | "form";

const POLL_INTERVAL = 8000; // 8 seconds

export default function StarterPage() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [view, setView] = useState<View>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [blobError, setBlobError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Check auth via API on mount
  useEffect(() => {
    fetch("/api/starter-auth")
      .then((res) => {
        setAuth(res.ok ? "authenticated" : "unauthenticated");
      })
      .catch(() => setAuth("unauthenticated"));
  }, []);

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/starter/projects");
      if (!res.ok) return;
      let body: unknown;
      try {
        body = await res.json();
      } catch {
        return;
      }
      // Handle both formats: { projects: [...], _blobError? } or plain array (legacy)
      if (body && typeof body === "object" && "projects" in body) {
        const envelope = body as { projects: Project[]; _blobError?: string };
        setProjects(envelope.projects);
        setBlobError(envelope._blobError ?? null);
      } else if (Array.isArray(body)) {
        setProjects(body as Project[]);
      }
    } catch {
      // silently ignore polling failures
    }
  }, []);

  // Stop polling when all projects are in a terminal state (done or error)
  const needsPolling = projects.length === 0 || projects.some(
    (p) => p.pipelineStatus === "in_progress"
  );

  // Load projects once authenticated, then poll only while needed
  useEffect(() => {
    if (auth !== "authenticated") return;

    fetchProjects().then(() => {
      // If no projects, show form
      setProjects((prev) => {
        if (prev.length === 0) setView("form");
        return prev;
      });
    });

    if (!needsPolling) return;

    pollRef.current = setInterval(fetchProjects, POLL_INTERVAL);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [auth, fetchProjects, needsPolling]);

  function handleAuthenticated() {
    setAuth("authenticated");
  }

  const handleDeleteProject = useCallback(async (projectId: string) => {
    try {
      const res = await fetch(`/api/starter/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!res.ok) return;
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch {
      // ignore
    }
  }, []);

  const handleRetryProject = useCallback(async (projectId: string) => {
    try {
      await fetch(`/api/starter/projects/${projectId}/run-pipeline`, {
        method: "POST",
      });
      // Polling will pick up the status changes
    } catch {
      // ignore
    }
  }, []);

  const handleProjectCreated = useCallback((project: Project) => {
    setProjects((prev) => [project, ...prev]);
    setTimeout(() => setView("dashboard"), 800);
  }, []);

  if (auth === "checking") {
    return (
      <Box
        className="min-h-[60vh] flex items-center justify-center"
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#0a0a0a" : "background.default",
        }}
      >
        <CircularProgress
          sx={{
            color: (theme) =>
              theme.palette.mode === "dark" ? "#06b6d4" : "primary.main",
          }}
        />
      </Box>
    );
  }

  if (auth === "unauthenticated") {
    return (
      <Fade in timeout={400}>
        <Box>
          <PasswordGate onAuthenticated={handleAuthenticated} />
        </Box>
      </Fade>
    );
  }

  if (view === "form") {
    return (
      <Fade in timeout={350} key="form">
        <Box>
          <StarterForm
            onProjectCreated={handleProjectCreated}
            onBack={projects.length > 0 ? () => setView("dashboard") : undefined}
          />
        </Box>
      </Fade>
    );
  }

  return (
    <Fade in timeout={350} key="dashboard">
      <Box>
        {blobError && (
          <Box sx={{
            mx: 3, mt: 2, p: 2, borderRadius: "0.5rem",
            bgcolor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)",
          }}>
            <Box component="strong" sx={{ color: "#dc2626", fontSize: "0.85rem" }}>
              Storage Error — projects will not persist
            </Box>
            <Box sx={{ color: "#b91c1c", fontSize: "0.8rem", mt: 0.5 }}>
              {blobError}
            </Box>
            <Box sx={{ color: "#6b7280", fontSize: "0.75rem", mt: 0.5 }}>
              Check that BLOB_READ_WRITE_TOKEN is set in Vercel env vars and the Blob store is connected to this project.
            </Box>
          </Box>
        )}
        <PipelineDashboard
          projects={projects}
          onNewProject={() => setView("form")}
          onDeleteProject={handleDeleteProject}
          onRetryProject={handleRetryProject}
          onRefresh={fetchProjects}
        />
      </Box>
    </Fade>
  );
}
