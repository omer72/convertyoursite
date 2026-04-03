import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import HandshakeIcon from "@mui/icons-material/Handshake";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const values = [
  {
    icon: RocketLaunchIcon,
    title: "Performance First",
    description:
      "We believe every millisecond matters. Our sites are built for speed, optimized for Core Web Vitals, and engineered to convert visitors into customers.",
  },
  {
    icon: HandshakeIcon,
    title: "Transparent Partnership",
    description:
      "No black boxes. We keep you in the loop at every stage — from discovery to deployment — with clear timelines, honest estimates, and open communication.",
  },
  {
    icon: AutoAwesomeIcon,
    title: "Craftsmanship",
    description:
      "We treat every project like our own. Clean code, thoughtful design, and meticulous attention to detail are non-negotiable in everything we deliver.",
  },
];

export default function MissionValues() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Our Mission &amp; Values
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto">
            The principles that guide every project we take on.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value) => (
            <div
              key={value.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-8 hover:shadow-md hover:scale-[1.01] transition-all duration-200 border border-gray-100 dark:border-gray-700"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <value.icon
                  sx={{ color: "#2563eb", fontSize: 28 }}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">
                {value.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2 text-base leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
