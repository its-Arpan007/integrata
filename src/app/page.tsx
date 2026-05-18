"use client";

import { Navbar } from "@/components/shared/navbar";
import { FloatingElements } from "@/components/shared/floating-elements";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { AIMatching } from "@/components/landing/ai-matching";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen animated-gradient-bg">
      <FloatingElements count={6} />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <AIMatching />
        <Testimonials />
        <CTA />
      </main>
    </div>
  );
}
