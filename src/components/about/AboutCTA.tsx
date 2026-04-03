"use client";

import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "next/link";

export default function AboutCTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
          Let&apos;s Build Something Great Together
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          Ready to modernize your web presence? We&apos;d love to hear about
          your project and show you what&apos;s possible.
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
              px: 4,
              py: 1.5,
              "&:hover": { bgcolor: "#1d4ed8" },
            }}
          >
            Get in Touch
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
              px: 4,
              py: 1.5,
              "&:hover": {
                borderColor: "#1d4ed8",
                bgcolor: "rgba(37, 99, 235, 0.04)",
              },
            }}
          >
            See Our Portfolio
          </Button>
        </div>
      </div>
    </section>
  );
}
