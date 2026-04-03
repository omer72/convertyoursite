const stats = [
  { value: "50+", label: "Sites Migrated" },
  { value: "98", label: "Avg. Lighthouse Score" },
  { value: "3x", label: "Faster Load Times" },
  { value: "100%", label: "Client Satisfaction" },
];

export default function StatsBar() {
  return (
    <section className="bg-blue-600 dark:bg-blue-700 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl lg:text-5xl font-extrabold text-white">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-white/70 mt-2 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
