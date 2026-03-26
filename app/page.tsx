import Companies from "@/components/landing/companies";
import CTA from "@/components/landing/cta";
import FAQs from "@/components/landing/faq";
import Features from "@/components/landing/features";
import Hero from "@/components/landing/hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Companies />
      <FAQs />
      <CTA />
    </div>
  );
}
