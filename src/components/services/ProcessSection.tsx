const steps = [
  {
    number: "01",
    title: "Discovery & Audit",
    description:
      "We review your current site, understand your goals, and create a migration or development plan with clear milestones.",
  },
  {
    number: "02",
    title: "Design & Architecture",
    description:
      "We craft responsive layouts and define the technical architecture — component library, routing, CMS, and integrations.",
  },
  {
    number: "03",
    title: "Build & Iterate",
    description:
      "Development sprints with regular previews. You review progress on a staging URL and we refine until it's perfect.",
  },
  {
    number: "04",
    title: "Launch & Optimize",
    description:
      "DNS cutover, go-live monitoring, performance tuning, and a handoff with documentation so your team is fully equipped.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            How We Work
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            A straightforward, transparent process from first call to launch day
            and beyond.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <span className="text-5xl font-extrabold text-blue-100 dark:text-blue-900/40 select-none">
                {step.number}
              </span>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-2">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
