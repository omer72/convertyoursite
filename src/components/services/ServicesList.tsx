"use client";

import WebIcon from "@mui/icons-material/Web";
import SpeedIcon from "@mui/icons-material/Speed";
import BrushIcon from "@mui/icons-material/Brush";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CloudIcon from "@mui/icons-material/Cloud";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const services = [
  {
    id: "migration",
    icon: WebIcon,
    title: "Wix to Next.js Migration",
    description:
      "Seamlessly migrate your existing Wix site to a modern Next.js platform. We preserve your content, SEO rankings, and domain setup while delivering a dramatically faster, more flexible website.",
    features: [
      "Zero-downtime migration with DNS cutover planning",
      "Full content & media transfer",
      "SEO redirect mapping to preserve rankings",
      "Custom design that matches or exceeds your current look",
      "Post-launch monitoring and support",
    ],
  },
  {
    id: "apps",
    icon: BrushIcon,
    title: "Custom Web Development",
    description:
      "Bespoke web applications built from the ground up with React, TypeScript, and Tailwind CSS. From marketing sites to complex dashboards — tailored to your exact requirements.",
    features: [
      "React & Next.js with TypeScript",
      "Responsive, mobile-first design",
      "Component-driven architecture for easy maintenance",
      "API integrations and headless CMS setup",
      "Accessibility (WCAG 2.1) compliance",
    ],
  },
  {
    id: "hosting",
    icon: CloudIcon,
    title: "Hosting & Deployment",
    description:
      "We set up fast, reliable hosting on modern platforms like Vercel or Netlify with CI/CD pipelines, custom domains, SSL, and edge caching — so your site loads instantly worldwide.",
    features: [
      "Vercel / Netlify / AWS deployment",
      "Automated CI/CD with GitHub Actions",
      "Custom domain & SSL configuration",
      "Global CDN with edge caching",
      "Environment management (staging & production)",
    ],
  },
  {
    id: "seo",
    icon: SearchIcon,
    title: "SEO & Performance Optimization",
    description:
      "Achieve Lighthouse scores of 90+ with image optimization, code splitting, server-side rendering, and technical SEO best practices baked into every page.",
    features: [
      "Core Web Vitals optimization",
      "Structured data & meta tag management",
      "Image optimization with next/image",
      "Lazy loading & code splitting",
      "Sitemap, robots.txt, and Open Graph setup",
    ],
  },
  {
    id: "maintenance",
    icon: SupportAgentIcon,
    title: "Ongoing Maintenance & Support",
    description:
      "Continuous monitoring, dependency updates, and priority support to keep your site secure, fast, and always up to date — so you can focus on your business.",
    features: [
      "Monthly dependency & security updates",
      "Uptime monitoring with alerting",
      "Content updates and minor feature additions",
      "Performance audits and reporting",
      "Priority email & chat support",
    ],
  },
  {
    id: "speed",
    icon: SpeedIcon,
    title: "Performance Audits",
    description:
      "Comprehensive analysis of your existing website with actionable recommendations. We identify bottlenecks and deliver a prioritized roadmap to dramatically improve load times.",
    features: [
      "Full Lighthouse & WebPageTest audit",
      "Bundle size analysis & optimization plan",
      "Server response time profiling",
      "Prioritized improvement roadmap",
      "Before / after benchmarks",
    ],
  },
];

export default function ServicesList() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            What We Offer
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            A full suite of services to take your web presence from legacy to
            leading-edge.
          </p>
        </div>

        <div className="space-y-16">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`scroll-mt-24 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start ${
                index % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Info */}
              <div className="flex-1">
                <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-5">
                  <service.icon className="!w-7 !h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Features */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 border border-gray-100 dark:border-gray-700 w-full">
                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  What&apos;s Included
                </h4>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircleOutlineIcon className="!w-5 !h-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
