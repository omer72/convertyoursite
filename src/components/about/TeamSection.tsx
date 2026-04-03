import Avatar from "@mui/material/Avatar";

const team = [
  {
    name: "Alex Rivera",
    title: "Founder & Lead Developer",
    bio: "Full-stack engineer with 10+ years of experience. Obsessed with performance and clean architecture.",
    initials: "AR",
    color: "#2563eb",
  },
  {
    name: "Sam Chen",
    title: "UI/UX Designer",
    bio: "Designs interfaces that are both beautiful and functional. Believes great UX is invisible.",
    initials: "SC",
    color: "#7c3aed",
  },
  {
    name: "Jordan Lee",
    title: "Frontend Engineer",
    bio: "React and Next.js specialist. Turns designs into pixel-perfect, accessible components.",
    initials: "JL",
    color: "#059669",
  },
  {
    name: "Taylor Kim",
    title: "Project Manager",
    bio: "Keeps projects on track and clients happy. Expert at translating business goals into technical roadmaps.",
    initials: "TK",
    color: "#d97706",
  },
];

export default function TeamSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Meet the Team
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-xl mx-auto">
            A small, senior team that punches above its weight.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-md transition-all duration-200 border border-gray-100 dark:border-gray-700"
            >
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: member.color,
                  fontSize: 32,
                  fontWeight: 700,
                  mx: "auto",
                }}
              >
                {member.initials}
              </Avatar>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
                {member.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {member.title}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-3">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
