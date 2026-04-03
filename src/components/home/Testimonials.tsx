import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import StarIcon from "@mui/icons-material/Star";

const testimonials = [
  {
    quote:
      "convertYourSite took our outdated Wix page and turned it into a lightning-fast Next.js site. Our load time dropped from 8 seconds to under 2.",
    name: "Sarah Cohen",
    company: "TechVentures IL",
    rating: 5,
  },
  {
    quote:
      "The migration was seamless — zero downtime, preserved SEO rankings, and the new site looks incredible. Highly recommend their team.",
    name: "David Levy",
    company: "StartupHub",
    rating: 5,
  },
  {
    quote:
      "We saw a 40% increase in conversions after the redesign. The performance improvements alone were worth the investment.",
    name: "Maya Ben-Ari",
    company: "DigitalFirst Agency",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
            Don&apos;t just take our word for it — hear from businesses we&apos;ve helped
            transform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-100 dark:border-gray-700"
            >
              <FormatQuoteIcon className="!w-8 !h-8 text-blue-200 dark:text-blue-800" />
              <p className="text-gray-700 dark:text-gray-300 text-lg italic leading-relaxed mt-4">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="border-t border-gray-100 dark:border-gray-700 mt-6 pt-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {t.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t.company}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5 mt-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className="!w-4 !h-4 text-amber-400"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
