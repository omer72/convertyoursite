"use client";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import WebIcon from "@mui/icons-material/Web";
import SpeedIcon from "@mui/icons-material/Speed";
import BrushIcon from "@mui/icons-material/Brush";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface Project {
  id: string;
  icon: typeof WebIcon;
  title: string;
  category: string;
  description: string;
  techStack: string[];
  metric: string;
  color: string;
  liveUrl?: string;
  featured?: boolean;
  migrationFrom?: string;
}

const projects: Project[] = [
  {
    id: "liat-leshem",
    icon: RecordVoiceOverIcon,
    title: "Liat Leshem — Voice Artist Portfolio",
    category: "Wix Migration",
    description:
      "Redesigned a Wix-based portfolio for a bilingual voice-over artist and actress into a polished dark-and-gold Next.js site with RTL Hebrew support, scroll animations, and JSON-LD structured data for SEO.",
    techStack: ["Next.js", "React", "MUI", "GitHub Pages"],
    metric: "Full Code Ownership",
    color: "from-amber-500 to-yellow-600",
    liveUrl: "https://omer72.github.io/liat-leshem-site/",
    featured: true,
    migrationFrom: "Wix",
  },
  {
    id: "bialystok-heritage",
    icon: HistoryEduIcon,
    title: "Bialystok Vicinity Expats Israel",
    category: "Wix Migration",
    description:
      "Migrated a nonprofit heritage organization from Wix to a modern stack on Netlify, delivering full code ownership, static-site performance, and Israeli web-accessibility compliance via the Nagishli widget.",
    techStack: ["Next.js", "Tailwind CSS", "Netlify"],
    metric: "Accessibility Compliant",
    color: "from-blue-500 to-indigo-500",
    liveUrl: "https://bialystoksite.netlify.app/",
    featured: true,
    migrationFrom: "Wix",
  },
  {
    id: "flavor-house",
    icon: RestaurantIcon,
    title: "Flavor House Restaurant",
    category: "Wix Migration",
    description:
      "Migrated a popular restaurant chain from Wix to Next.js, achieving a 3x improvement in page load speed and a fully responsive reservation system.",
    techStack: ["Next.js", "Tailwind CSS", "Vercel"],
    metric: "95+ Lighthouse Score",
    color: "from-orange-500 to-red-500",
  },
  {
    id: "peak-fitness",
    icon: FitnessCenterIcon,
    title: "Peak Fitness Studio",
    category: "Custom Build",
    description:
      "Built a modern membership platform with class scheduling, trainer profiles, and integrated payment processing from the ground up.",
    techStack: ["React", "TypeScript", "Stripe", "Netlify"],
    metric: "40% More Sign-ups",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "luxe-living",
    icon: BrushIcon,
    title: "Luxe Living Interiors",
    category: "Wix Migration",
    description:
      "Transformed a slow Wix portfolio site into a blazing-fast image-heavy showcase with optimized lazy loading and edge caching.",
    techStack: ["Next.js", "MDX", "Cloudinary", "Vercel"],
    metric: "2.1s → 0.4s LCP",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "greenleaf",
    icon: ShoppingCartIcon,
    title: "GreenLeaf Organics",
    category: "E-Commerce",
    description:
      "Developed a headless e-commerce storefront with real-time inventory, subscription boxes, and a custom CMS for weekly product updates.",
    techStack: ["Next.js", "Shopify API", "Tailwind CSS"],
    metric: "60% Faster Checkout",
    color: "from-lime-500 to-green-500",
  },
  {
    id: "summit-consulting",
    icon: WebIcon,
    title: "Summit Consulting Group",
    category: "Custom Build",
    description:
      "Designed and built a corporate site with a gated resource library, lead capture forms, and HubSpot CRM integration.",
    techStack: ["Next.js", "HubSpot API", "MUI", "AWS"],
    metric: "3x Lead Generation",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "velocity-auto",
    icon: SpeedIcon,
    title: "Velocity Auto Detailing",
    category: "Performance Audit + Rebuild",
    description:
      "Audited and rebuilt a sluggish WordPress site into a high-performance Next.js application with online booking and before/after galleries.",
    techStack: ["Next.js", "Tailwind CSS", "Calendly", "Vercel"],
    metric: "98 Performance Score",
    color: "from-amber-500 to-orange-500",
  },
];

const featuredProjects = projects.filter((p) => p.featured);
const otherProjects = projects.filter((p) => !p.featured);

function FeaturedCard({ project }: { project: Project }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/5">
      {/* Gradient border effect */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity`}
      />
      <div className="absolute inset-[1px] rounded-2xl bg-white dark:bg-gray-900" />

      <div className="relative">
        {/* Gradient top bar */}
        <div className={`h-2 bg-gradient-to-r ${project.color}`} />

        <div className="p-6 sm:p-8">
          {/* Top row: icon, badges */}
          <div className="flex items-start justify-between mb-5">
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${project.color} bg-opacity-10 flex items-center justify-center shadow-sm`}
            >
              <project.icon className="!w-7 !h-7 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live Project
              </span>
            </div>
          </div>

          {/* Migration indicator */}
          {project.migrationFrom && (
            <div className="flex items-center gap-2 mb-4 text-xs">
              <span className="font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded line-through decoration-red-400">
                {project.migrationFrom}
              </span>
              <ArrowForwardIcon className="!w-3.5 !h-3.5 text-gray-400" />
              <span className="font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                Next.js
              </span>
            </div>
          )}

          {/* Title + description */}
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed mb-5">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Metric + live link */}
          <div className="flex items-center justify-between pt-5 border-t border-gray-100 dark:border-gray-800">
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              {project.metric}
            </span>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                Visit Live Site
                <OpenInNewIcon className="!w-4 !h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
      {/* Color bar */}
      <div className={`h-1.5 bg-gradient-to-r ${project.color}`} />

      <div className="p-6">
        {/* Icon + category */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <project.icon className="!w-6 !h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-full">
            {project.category}
          </span>
        </div>

        {/* Title + description */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {project.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Metric + live link */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            {project.metric}
          </span>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Visit Site
              <OpenInNewIcon className="!w-4 !h-4" />
            </a>
          ) : (
            <OpenInNewIcon className="!w-4 !h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectGrid() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Featured Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Real results for real businesses — migrations, custom builds, and
            performance transformations.
          </p>
        </div>

        {/* Featured projects — prominent 2-col row */}
        {featuredProjects.length > 0 && (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {featuredProjects.map((project) => (
              <FeaturedCard key={project.id} project={project} />
            ))}
          </div>
        )}

        {/* Divider */}
        {featuredProjects.length > 0 && otherProjects.length > 0 && (
          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              More Projects
            </span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>
        )}

        {/* Other projects — standard 3-col grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {otherProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
