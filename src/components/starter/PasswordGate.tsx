"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import LockIcon from "@mui/icons-material/Lock";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export default function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const expected = process.env.NEXT_PUBLIC_STARTER_PASSWORD;
      if (!expected) {
        throw new Error("Starter password not configured");
      }
      if (password !== expected) {
        throw new Error("Invalid password");
      }
      onAuthenticated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      className="min-h-[60vh] flex items-center justify-center"
      sx={{ px: 3 }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          borderRadius: "0.75rem",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box className="flex flex-col items-center mb-6">
          <LockIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
          <Typography variant="h4" component="h1" textAlign="center">
            Starter Access
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 1 }}
          >
            Enter the password to access the project starter.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "0.75rem" }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          variant="outlined"
          autoFocus
          sx={{ mb: 3 }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading}
          sx={{
            bgcolor: "#2563eb",
            fontWeight: 600,
            py: 1.5,
            "&:hover": { bgcolor: "#1d4ed8" },
          }}
        >
          {loading ? "Verifying..." : "Enter"}
        </Button>
      </Box>
    </Box>
  );
}
