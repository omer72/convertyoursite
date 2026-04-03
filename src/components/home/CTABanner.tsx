import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function CTABanner() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-16 sm:px-16 sm:py-20 text-center overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to Modernize Your Website?
            </h2>
            <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
              Get a free estimate for your Wix-to-Next.js migration. No
              commitment, no surprises — just a clear path to a faster site.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center bg-white text-blue-700 font-semibold px-8 py-4 rounded-md shadow-sm hover:bg-blue-50 hover:shadow-md focus:ring-2 focus:ring-white/50 transition-all duration-150 text-base no-underline"
              >
                Get Free Estimate
                <ArrowForwardIcon className="ml-2 !w-5 !h-5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center bg-transparent text-white font-semibold border-2 border-white/40 px-8 py-4 rounded-md hover:bg-white/10 hover:border-white/60 transition-all duration-150 text-base no-underline"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
