"use client";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/30" />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Get in Touch
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.08] tracking-tight">
            Let&apos;s Start Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Project
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Ready to modernize your website? Drop us a message and we&apos;ll
            get back to you within 24 hours with a free consultation.
          </p>
        </div>
      </div>
    </section>
  );
}
