"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import PasswordGate from "@/components/starter/PasswordGate";
import StarterForm from "@/components/starter/StarterForm";

type AuthState = "checking" | "unauthenticated" | "authenticated";

export default function StarterPage() {
  const [auth, setAuth] = useState<AuthState>("checking");

  useEffect(() => {
    fetch("/convertyoursite/api/starter-auth")
      .then((res) => {
        setAuth(res.ok ? "authenticated" : "unauthenticated");
      })
      .catch(() => {
        setAuth("unauthenticated");
      });
  }, []);

  if (auth === "checking") {
    return (
      <Box className="min-h-[60vh] flex items-center justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (auth === "unauthenticated") {
    return <PasswordGate onAuthenticated={() => setAuth("authenticated")} />;
  }

  return <StarterForm />;
}
