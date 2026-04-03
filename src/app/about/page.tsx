import { buildMetadata } from "@/components/layout/seo";
import AboutHero from "@/components/about/AboutHero";
import MissionValues from "@/components/about/MissionValues";
import TeamSection from "@/components/about/TeamSection";
import TechStack from "@/components/about/TechStack";
import AboutCTA from "@/components/about/AboutCTA";

export const metadata = buildMetadata({
  title: "About Us",
  description:
    "Learn about convertYourSite — our mission, team, and the modern tech stack we use to build fast, beautiful websites.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <MissionValues />
      <TeamSection />
      <TechStack />
      <AboutCTA />
    </>
  );
}
