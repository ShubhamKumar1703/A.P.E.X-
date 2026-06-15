import React from "react";
import { FeatureCard } from "./FeatureCard";
import { SectionHeader } from "../ui/SectionHeader";
import { Timer, Radio, Compass, History, Gauge, Sparkles } from "lucide-react";

const features = [
  {
    title: "Live Timing",
    description: "Ingest live timing feeds from active track sessions. Monitor gaps, intervals, pit stops, and sectors in real time.",
    icon: Timer
  },
  {
    title: "AI Race Engineer",
    description: "Receive real-time natural language updates on tire wear status, DRS windows, weather forecasts, and strategy advice.",
    icon: Radio
  },
  {
    title: "Strategy Analysis",
    description: "Compare pit stop windows and compound degradations to optimize race pacing and anticipate undercuts/overcuts.",
    icon: Compass
  },
  {
    title: "Historical Results",
    description: "Explore previous championship races, qualifying performances, and track histories to understand team and driver trends.",
    icon: History
  },
  {
    title: "Driver Insights",
    description: "Compare direct driver telemetry overlays, including throttle/brake application rates and terminal speeds.",
    icon: Gauge
  },
  {
    title: "Race Predictions",
    description: "Utilize weather models, past track performance, and fuel profiles to run simulations and predict podium probability.",
    icon: Sparkles
  }
];

export function FeatureGrid() {
  return (
    <section id="features" className="py-20 md:py-28 lg:py-36 bg-zinc-950 border-t border-zinc-900 relative">
      {/* Decorative side overlay */}
      <div className="absolute right-0 top-1/3 w-96 h-96 bg-[#FF1801]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="Mission Core"
          title="Engineered for Motorsport Intelligence"
          subtitle="A.P.E.X. aggregates complex racing feeds into actionable tactical insights. Maintain pit lane superiority and engineer winning strategies."
          centered={true}
        />

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              index={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
