const technologies = [
  { name: "Next.js", category: "Framework" },
  { name: "React", category: "Library" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "MUI", category: "Components" },
  { name: "Node.js", category: "Runtime" },
  { name: "Netlify", category: "Hosting" },
  { name: "GitHub", category: "Version Control" },
];

export default function TechStack() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our Tech Stack
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto">
            We use best-in-class tools to build fast, reliable, and maintainable
            websites.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
          {technologies.map((tech) => (
            <div
              key={tech.name}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-100 dark:border-gray-700 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
            >
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {tech.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide font-medium">
                {tech.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
