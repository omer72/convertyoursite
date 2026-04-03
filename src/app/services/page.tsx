import { buildMetadata } from "@/components/layout/seo";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import ProcessSection from "@/components/services/ProcessSection";
import ServicesCTA from "@/components/services/ServicesCTA";

export const metadata = buildMetadata({
  title: "Our Services",
  description:
    "From Wix-to-Next.js migration to custom web development, hosting setup, and ongoing maintenance — convertYourSite delivers end-to-end modern web solutions.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <ProcessSection />
      <ServicesCTA />
    </>
  );
}
