import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-100 selection:bg-[#FF1801] selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Sections */}
      <main>
        {/* Hero & Mockup */}
        <HeroSection />

        {/* Feature Highlights */}
        <FeatureGrid />

        {/* Tactical Call to Action */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
