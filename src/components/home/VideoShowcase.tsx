export default function VideoShowcase() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            See What We Do
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Watch how we transform legacy websites into modern, high-performance
            experiences.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div
            className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10"
            style={{ aspectRatio: "16/9", backgroundColor: "#0a0a2e" }}
          >
            <video
              src="/company-reel.mp4"
              autoPlay
              loop
              muted
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
