import { buildMetadata } from "@/components/layout/seo";
import EstimateHero from "@/components/estimate/EstimateHero";
import EstimateForm from "@/components/estimate/EstimateForm";
import EstimateInfo from "@/components/estimate/EstimateInfo";

export const metadata = buildMetadata({
  title: "Get a Free Estimate",
  description:
    "Request a free project estimate for your website migration — tell us about your site and we'll provide a detailed quote within 48 hours.",
  path: "/estimate",
});

export default function EstimatePage() {
  return (
    <>
      <EstimateHero />
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <EstimateForm />
            <EstimateInfo />
          </div>
        </div>
      </section>
    </>
  );
}
