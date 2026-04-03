"use client";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import WebIcon from "@mui/icons-material/Web";
import SpeedIcon from "@mui/icons-material/Speed";
import BrushIcon from "@mui/icons-material/Brush";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

const projects = [
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300"
            >
              {/* Color bar */}
              <div
                className={`h-1.5 bg-gradient-to-r ${project.color}`}
              />

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

                {/* Metric */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    {project.metric}
                  </span>
                  <OpenInNewIcon className="!w-4 !h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
