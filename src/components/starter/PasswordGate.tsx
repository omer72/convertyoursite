"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import InputAdornment from "@mui/material/InputAdornment";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import KeyIcon from "@mui/icons-material/Key";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CircularProgress from "@mui/material/CircularProgress";

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
      // Known limitation: with `output: "export"` (static site), NEXT_PUBLIC_STARTER_PASSWORD
      // is inlined into the JS bundle at build time. This is unavoidable without a backend
      // and only provides a lightweight gate against casual access, not real security.
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
      className="min-h-[80vh] flex items-center justify-center"
      sx={{
        px: 3,
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.06) 0%, transparent 50%), #0a0a0a"
            : "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 50%, #fdf2f8 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-20%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "-30%",
          left: "-10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(124,58,237,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 420,
          width: "100%",
          p: { xs: 3.5, sm: 5 },
          borderRadius: "1rem",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(6,182,212,0.12)"
              : "rgba(0,0,0,0.06)",
          bgcolor: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(20,20,20,0.8)"
              : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(20px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? "0 4px 6px -1px rgba(0,0,0,0.3), 0 20px 40px -8px rgba(6,182,212,0.08), inset 0 1px 0 rgba(255,255,255,0.03)"
              : "0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 40px -8px rgba(37,99,235,0.08)",
          position: "relative",
          zIndex: 1,
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
          "&:hover": {
            borderColor: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(6,182,212,0.2)"
                : "rgba(0,0,0,0.06)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 4px 6px -1px rgba(0,0,0,0.3), 0 25px 50px -8px rgba(6,182,212,0.12), inset 0 1px 0 rgba(255,255,255,0.03)"
                : "0 4px 6px -1px rgba(0,0,0,0.05), 0 25px 50px -8px rgba(37,99,235,0.12)",
          },
        }}
      >
        {/* Icon badge */}
        <Box className="flex flex-col items-center mb-6">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "1rem",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)"
                  : "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 8px 24px -4px rgba(6,182,212,0.35)"
                  : "0 8px 16px -4px rgba(37,99,235,0.3)",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 28, color: "#fff" }} />
          </Box>
          <Typography
            variant="h4"
            component="h1"
            textAlign="center"
            sx={{ fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            Starter Access
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 1, maxWidth: 280 }}
          >
            Enter the access code to manage your website conversion projects.
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: "0.75rem",
              "& .MuiAlert-icon": { alignItems: "center" },
            }}
          >
            {error}
          </Alert>
        )}

        <TextField
          label="Access Code"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          variant="outlined"
          autoFocus
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <KeyIcon sx={{ fontSize: 20, color: "text.secondary" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "0.625rem",
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(255,255,255,0.6)",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "#06b6d4" : "#2563eb",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: (theme) =>
                  theme.palette.mode === "dark" ? "#06b6d4" : "#2563eb",
                borderWidth: 2,
              },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={loading || !password}
          endIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
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
          {loading ? "Verifying..." : "Continue"}
        </Button>
      </Box>
    </Box>
  );
}
