"use client";

import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

const trustedLogos = [
  "TechCorp",
  "StartupX",
  "ModernBiz",
  "DigitalFirst",
  "WebScale",
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Wix to Next.js Migration Experts
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.08] tracking-tight">
              Transform Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Legacy Website
              </span>{" "}
              Into a Modern Powerhouse
            </h1>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              We convert legacy Wix sites into blazing-fast, modern websites
              built with Next.js, React, and Tailwind CSS. Better performance,
              better SEO, better results.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
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
                Get Free Estimate
              </Button>
              <Button
                component={Link}
                href="/portfolio"
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
                View Our Work
              </Button>
            </div>
          </div>

          {/* Right: Visual element */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl shadow-blue-500/20">
              {/* Code mockup */}
              <div className="rounded-lg bg-gray-900 p-6 font-mono text-sm">
                <div className="flex gap-2 mb-4">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="text-purple-400">import</span>{" "}
                    <span className="text-blue-300">{"{ NextPage }"}</span>{" "}
                    <span className="text-purple-400">from</span>{" "}
                    <span className="text-green-400">&apos;next&apos;</span>
                  </p>
                  <p className="text-gray-500">
                    {"// Your old Wix site → modern Next.js"}
                  </p>
                  <p>
                    <span className="text-purple-400">export default</span>{" "}
                    <span className="text-yellow-300">function</span>{" "}
                    <span className="text-blue-300">Home</span>
                    {"() {"}
                  </p>
                  <p className="pl-4">
                    <span className="text-purple-400">return</span> (
                  </p>
                  <p className="pl-8 text-green-400">
                    {"<FastSite performance={100} />"}
                  </p>
                  <p className="pl-4">)</p>
                  <p>{"}"}</p>
                </div>
              </div>

              {/* Floating metrics */}
              <div className="absolute -top-4 -right-4 rounded-lg bg-white dark:bg-gray-800 shadow-lg px-4 py-2 flex items-center gap-2">
                <span className="text-green-500 text-lg font-bold">98</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Lighthouse
                </span>
              </div>
              <div className="absolute -bottom-3 -left-3 rounded-lg bg-white dark:bg-gray-800 shadow-lg px-4 py-2 flex items-center gap-2">
                <span className="text-blue-600 text-lg font-bold">3x</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Faster Load
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by logos */}
        <div className="mt-16 pt-10 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500 text-center uppercase tracking-wider mb-6">
            Trusted by businesses worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
            {trustedLogos.map((name) => (
              <span
                key={name}
                className="text-lg font-semibold text-gray-300 dark:text-gray-600 select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
