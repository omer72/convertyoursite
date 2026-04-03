import { buildMetadata } from "@/components/layout/seo";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioList from "@/components/portfolio/PortfolioList";
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
      <PortfolioList />
      <PortfolioCTA />
    </>
  );
}
