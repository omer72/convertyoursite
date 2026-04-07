"use client";

import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordGate from "@/components/starter/PasswordGate";
import StarterForm, { STORAGE_KEY } from "@/components/starter/StarterForm";
import PipelineDashboard from "@/components/starter/PipelineDashboard";
import { Project } from "@/components/starter/ProjectCard";

const AUTH_SESSION_KEY = "starter_authenticated";

type AuthState = "checking" | "unauthenticated" | "authenticated";
type View = "dashboard" | "form";

export default function StarterPage() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [view, setView] = useState<View>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_SESSION_KEY) === "1") {
      setAuth("authenticated");
    } else {
      setAuth("unauthenticated");
    }
  }, []);

  // Load projects from localStorage once authenticated
  useEffect(() => {
    if (auth === "authenticated") {
      let stored: Project[] = [];
      try {
        stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      } catch {
        stored = [];
      }
      setProjects(stored);
      // If no projects yet, go straight to form
      if (stored.length === 0) {
        setView("form");
      }
    }
  }, [auth]);

  function handleAuthenticated() {
    sessionStorage.setItem(AUTH_SESSION_KEY, "1");
    setAuth("authenticated");
  }

  const handleDeleteProject = useCallback((projectId: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleProjectCreated = useCallback((project: Project) => {
    setProjects((prev) => {
      const updated = [...prev, project];
      return updated;
    });
    // Switch to dashboard after a brief delay so user sees success message
    setTimeout(() => setView("dashboard"), 800);
  }, []);

  if (auth === "checking") {
    return (
      <Box className="min-h-[60vh] flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (auth === "unauthenticated") {
    return <PasswordGate onAuthenticated={handleAuthenticated} />;
  }

  if (view === "form") {
    return (
      <StarterForm
        onProjectCreated={handleProjectCreated}
        onBack={projects.length > 0 ? () => setView("dashboard") : undefined}
      />
    );
  }

  return (
    <PipelineDashboard
      projects={projects}
      onNewProject={() => setView("form")}
      onDeleteProject={handleDeleteProject}
    />
  );
}
