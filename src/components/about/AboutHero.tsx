"use client";

import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Our Story
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.08] tracking-tight">
            Passionate About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Great Web
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            We started convertYourSite with one mission: help businesses break
            free from legacy platforms and embrace the modern web. What began as
            a small team of developers frustrated with Wix limitations has grown
            into a full-service web studio.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              component={Link}
              href="/contact"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "#2563eb",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                "&:hover": { bgcolor: "#1d4ed8" },
              }}
            >
              Work With Us
            </Button>
            <Button
              component={Link}
              href="/services"
              variant="outlined"
              size="large"
              sx={{
                borderColor: "#2563eb",
                color: "#2563eb",
                fontWeight: 600,
                px: 3,
                py: 1.5,
                "&:hover": {
                  borderColor: "#1d4ed8",
                  bgcolor: "rgba(37, 99, 235, 0.04)",
                },
              }}
            >
              Our Services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
