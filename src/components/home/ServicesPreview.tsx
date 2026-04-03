"use client";

import Link from "next/link";
import WebIcon from "@mui/icons-material/Web";
import SpeedIcon from "@mui/icons-material/Speed";
import BrushIcon from "@mui/icons-material/Brush";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const services = [
  {
    icon: WebIcon,
    title: "Wix to Next.js Migration",
    description:
      "Seamlessly migrate your Wix site to a modern Next.js platform with zero downtime and preserved SEO rankings.",
    href: "/services#migration",
  },
  {
    icon: BrushIcon,
    title: "Custom Web Development",
    description:
      "Bespoke web applications built with React, TypeScript, and Tailwind CSS — tailored to your exact needs.",
    href: "/services#apps",
  },
  {
    icon: SpeedIcon,
    title: "Performance Optimization",
    description:
      "Achieve Lighthouse scores of 90+ with optimized images, code splitting, and server-side rendering.",
    href: "/services#seo",
  },
  {
    icon: SupportAgentIcon,
    title: "Ongoing Maintenance",
    description:
      "Continuous monitoring, updates, and support to keep your site secure, fast, and always up to date.",
    href: "/services#maintenance",
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            What We Do
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            End-to-end web development services to take your online presence
            from legacy to leading-edge.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 no-underline"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-5">
                <service.icon className="!w-6 !h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {service.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-base leading-relaxed">
                {service.description}
              </p>
              <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 font-medium mt-4 text-sm group-hover:gap-2 transition-all duration-150">
                Learn more <ArrowForwardIcon className="!w-4 !h-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
