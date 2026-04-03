import { buildMetadata } from "@/components/layout/seo";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import ProjectGrid from "@/components/portfolio/ProjectGrid";
import PortfolioCTA from "@/components/portfolio/PortfolioCTA";

export const metadata = buildMetadata({
  title: "Portfolio",
  description:
    "Explore our portfolio of Wix migrations, custom web builds, and performance transformations — real results for real businesses.",
  path: "/portfolio",
});

export default function PortfolioPage() {
  return (
    <>
      <PortfolioHero />
      <ProjectGrid />
      <PortfolioCTA />
    </>
  );
}
