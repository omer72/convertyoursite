"use client";

import { useEffect, useRef } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

interface PortfolioProject {
  id: string;
  clientName: string;
  role: string;
  description: string;
  result: string;
  liveUrl?: string;
  beforeImage?: { src: string; alt: string };
  afterImage?: { src: string; alt: string };
  image?: { src: string; alt: string };
}

const projects: PortfolioProject[] = [
  {
    id: "smart-parking",
    clientName: "Smart Parking (AppCard)",
    role: "Full-Stack Development",
    description:
      "Built a modern smart parking management dashboard with real-time occupancy tracking, payment integration, and responsive design for municipal parking operations.",
    result: "Production Live",
    liveUrl: "https://chaniya-appcard.netlify.app/",
    image: {
      src: "/images/portfolio/appcard-parking.webp",
      alt: "Smart Parking by AppCard — live dashboard",
    },
  },
  {
    id: "liat-leshem",
    clientName: "Liat Leshem — Voice Artist",
    role: "Wix → Next.js Migration",
    description:
      "Redesigned a Wix-based portfolio for a bilingual voice-over artist into a polished dark-and-gold Next.js site with RTL Hebrew support, scroll animations, and JSON-LD structured data.",
    result: "Full Code Ownership",
    liveUrl: "https://omer72.github.io/liat-leshem-site/",
    beforeImage: {
      src: "/images/portfolio/liat-leshem-before.webp",
      alt: "Liat Leshem site before — old Wix version",
    },
    afterImage: {
      src: "/images/portfolio/liat-leshem-after.webp",
      alt: "Liat Leshem site after — new Next.js version",
    },
  },
  {
    id: "bialystok",
    clientName: "Bialystok Vicinity Expats Israel",
    role: "Wix → Next.js Migration",
    description:
      "Migrated a nonprofit heritage organization from Wix to a modern stack on Netlify, delivering static-site performance and Israeli web-accessibility compliance via the Nagishli widget.",
    result: "Accessibility Compliant",
    liveUrl: "https://bialystoksite.netlify.app/",
    beforeImage: {
      src: "/images/portfolio/bialystok-before.webp",
      alt: "Bialystok Association site before — old Wix version",
    },
    afterImage: {
      src: "/images/portfolio/bialystok-after.webp",
      alt: "Bialystok Association site after — new Next.js version",
    },
  },
];

function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("opacity-100", "translate-y-0");
          el.classList.remove("opacity-0", "translate-y-8");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
    >
      {children}
    </div>
  );
}

function PortfolioItem({ item }: { item: PortfolioProject }) {
  const hasSlider = item.beforeImage && item.afterImage;

  return (
    <ScrollReveal>
      <article aria-label={`Portfolio: ${item.clientName}`}>
        {hasSlider ? (
          <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
            <ReactCompareSlider
              aria-label={`Drag to compare before and after website for ${item.clientName}`}
              keyboardIncrement="5%"
              style={{ width: "100%", height: "100%" }}
              itemOne={
                <ReactCompareSliderImage
                  src={item.beforeImage!.src}
                  alt={item.beforeImage!.alt}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={item.afterImage!.src}
                  alt={item.afterImage!.alt}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              }
            />
          </div>
        ) : item.image ? (
          <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
            <img
              src={item.image.src}
              alt={item.image.alt}
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}

        {/* Glass metadata card */}
        <div className="mt-4 rounded-xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {item.clientName}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {item.role}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed">
            {item.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="inline-block rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-sm font-semibold text-white">
              {item.result}
            </span>
            {item.liveUrl && (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                View Live Site
                <OpenInNewIcon className="!w-3.5 !h-3.5" />
              </a>
            )}
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}

export default function PortfolioList() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Featured Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Real results for real businesses — migrations, custom builds, and
            performance transformations.
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {projects.map((project) => (
            <PortfolioItem key={project.id} item={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
