import { buildMetadata } from "@/components/layout/seo";
import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export const metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Get in touch with convertYourSite — send us a message about your project and we'll respond within 24 hours.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
    </>
  );
}
