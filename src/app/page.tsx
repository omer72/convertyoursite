import { buildMetadata } from "@/components/layout/seo";
import HeroSection from "@/components/home/HeroSection";
import ServicesPreview from "@/components/home/ServicesPreview";
import StatsBar from "@/components/home/StatsBar";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";
import VideoShowcase from "@/components/home/VideoShowcase";

export const metadata = buildMetadata({
  title: "Modern Web Development",
  description:
    "We convert legacy Wix sites into modern, high-performance websites using Next.js, React, Tailwind CSS, and MUI.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
      <StatsBar />
      <VideoShowcase />
      <Testimonials />
      <CTABanner />
    </>
  );
}
