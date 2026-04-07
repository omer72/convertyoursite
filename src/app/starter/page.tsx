"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordGate from "@/components/starter/PasswordGate";
import StarterForm from "@/components/starter/StarterForm";

const AUTH_SESSION_KEY = "starter_authenticated";

type AuthState = "checking" | "unauthenticated" | "authenticated";

export default function StarterPage() {
  const [auth, setAuth] = useState<AuthState>("checking");

  useEffect(() => {
    if (sessionStorage.getItem(AUTH_SESSION_KEY) === "1") {
      setAuth("authenticated");
      return;
    }
    setAuth("unauthenticated");
  }, []);

  function handleAuthenticated() {
    sessionStorage.setItem(AUTH_SESSION_KEY, "1");
    setAuth("authenticated");
  }

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

  return <StarterForm />;
}
