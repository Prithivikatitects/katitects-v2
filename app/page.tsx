import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { LogoSection } from "@/components/logo-section";
import { FeaturesSection } from "@/components/features-section";
import { KeyFeaturesAltSection } from "@/components/key-features-alt";
import { RenderSeamlessGridSection } from "@/components/render-seamless-grid";
import { PricingShowcaseSection } from "@/components/pricing-showcase";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CTASection } from "@/components/cta-section";
import { SiteFooter } from "@/components/site-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        {/* 2nd section: Trusted by leading companies */}
        <LogoSection />
        {/* 3rd section: Features */}
        <FeaturesSection />
        {/* 4th section: Key Features (Alt Version) */}
        <KeyFeaturesAltSection />
        {/* 5th section: Render Seamlessly (Animated Grid) */}
        <RenderSeamlessGridSection />
        {/* 6th section: Pricing (Showcase) */}
        <PricingShowcaseSection />
        {/* 7th section: Testimonials */}
        <TestimonialsSection />
        {/* 8th section: CTA */}
        <CTASection />
      </main>
      {/* 9th: Footer */}
      <SiteFooter />
    </div>
  );
}
