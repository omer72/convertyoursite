"use client";

import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const highlights = [
  {
    icon: <ScheduleIcon sx={{ fontSize: 28, color: "#2563eb" }} />,
    title: "Quick Turnaround",
    description: "Receive your detailed estimate within 48 hours of submission.",
  },
  {
    icon: <CheckCircleIcon sx={{ fontSize: 28, color: "#2563eb" }} />,
    title: "No Obligation",
    description:
      "Our estimates are completely free — no strings attached, no hidden fees.",
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 28, color: "#2563eb" }} />,
    title: "Expert Consultation",
    description:
      "Get personalized recommendations from our team of experienced developers.",
  },
];

export default function EstimateInfo() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        What to Expect
      </h2>

      <div className="space-y-6">
        {highlights.map((item) => (
          <div key={item.title} className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          Our Process
        </h3>
        <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              1
            </span>
            You submit your project details through this form.
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              2
            </span>
            We analyze your current website and requirements.
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              3
            </span>
            You receive a detailed estimate with timeline and pricing.
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
              4
            </span>
            We schedule a free consultation to discuss the project.
          </li>
        </ol>
      </div>
    </div>
  );
}
