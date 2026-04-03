"use client";

import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import SendIcon from "@mui/icons-material/Send";

const budgetRanges = [
  "Under $1,000",
  "$1,000 – $3,000",
  "$3,000 – $5,000",
  "$5,000 – $10,000",
  "$10,000+",
  "Not sure yet",
];

interface FormData {
  name: string;
  email: string;
  websiteUrl: string;
  budget: string;
  description: string;
}

export default function EstimateForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    websiteUrl: "",
    budget: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Estimate Request from ${form.name}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${form.name}`,
        `Email: ${form.email}`,
        `Website URL: ${form.websiteUrl}`,
        `Budget Range: ${form.budget}`,
        "",
        "Project Description:",
        form.description,
      ].join("\n")
    );

    window.location.href = `mailto:info@convertyoursite.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Tell Us About Your Project
      </h2>

      {submitted && (
        <Alert severity="success" sx={{ borderRadius: "0.75rem" }}>
          Your email client should have opened with the estimate request.
          If it didn&apos;t, please email us directly at{" "}
          <strong>info@convertyoursite.com</strong>.
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
        label="Website URL"
        name="websiteUrl"
        type="url"
        placeholder="https://yoursite.com"
        value={form.websiteUrl}
        onChange={handleChange}
        required
        fullWidth
        variant="outlined"
      />

      <TextField
        label="Estimated Budget Range"
        name="budget"
        value={form.budget}
        onChange={handleChange}
        required
        fullWidth
        select
        variant="outlined"
      >
        {budgetRanges.map((range) => (
          <MenuItem key={range} value={range}>
            {range}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Project Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        required
        fullWidth
        multiline
        rows={5}
        placeholder="Describe what you'd like to achieve with your new website..."
        variant="outlined"
      />

      <Button
        type="submit"
        variant="contained"
        size="large"
        endIcon={<SendIcon />}
        sx={{
          bgcolor: "#2563eb",
          fontWeight: 600,
          px: 4,
          py: 1.5,
          "&:hover": { bgcolor: "#1d4ed8" },
        }}
      >
        Request Estimate
      </Button>
    </form>
  );
}
