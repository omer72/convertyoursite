"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import SendIcon from "@mui/icons-material/Send";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Send Us a Message
      </h2>

      {status === "success" && (
        <Alert severity="success" sx={{ borderRadius: "0.75rem" }}>
          Thank you! Your message has been sent. We&apos;ll be in touch soon.
        </Alert>
      )}

      {status === "error" && (
        <Alert severity="error" sx={{ borderRadius: "0.75rem" }}>
          {errorMessage}
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TextField
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
        />
      </div>

      <TextField
        label="Subject"
        name="subject"
        value={form.subject}
        onChange={handleChange}
        required
        fullWidth
        variant="outlined"
      />

      <TextField
        label="Message"
        name="message"
        value={form.message}
        onChange={handleChange}
        required
        fullWidth
        multiline
        rows={5}
        variant="outlined"
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        disabled={status === "submitting"}
        endIcon={<SendIcon />}
        sx={{
          bgcolor: "#2563eb",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          "&:hover": { bgcolor: "#1d4ed8" },
        }}
      >
        {status === "submitting" ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
