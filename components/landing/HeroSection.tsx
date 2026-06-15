"use client";

import React from "react";
import Link from "next/link";
import { DashboardMockup } from "./DashboardMockup";
import { Play, Activity } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-44 lg:pb-32 bg-zinc-950">
      {/* Visual Background: Telemetry Grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/60 via-zinc-950 to-zinc-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a08_1px,transparent_1px),linear-gradient(to_bottom,#27272a08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Accent glowing aura */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#FF1801]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Content (left column) */}
          <div className="lg:col-span-5 text-left space-y-6">
            {/* Speed Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-[#FF1801]/10 text-[#FF1801] border border-[#FF1801]/20 uppercase">
              <Activity size={12} className="animate-pulse" />
              <span>LIVE RACING TELEMETRY</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              A.P.E.X.
              <span className="block text-zinc-500 text-3xl sm:text-4xl lg:text-5xl font-bold mt-1 font-mono tracking-tighter">
                YOUR DIGITAL RACE ENGINEER
              </span>
            </h1>

            <p className="text-base text-zinc-400 font-medium leading-relaxed max-w-xl">
              Live telemetry, tyre strategy intelligence, pit stop analysis, race predictions, and AI-powered Formula 1 insights. Designed for engineers and race strategists.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/dashboard/calendar"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold font-mono tracking-widest text-white bg-[#FF1801] hover:bg-[#E01500] rounded-lg transition-all shadow-lg shadow-[#FF1801]/10 uppercase group"
              >
                <Play size={14} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                Launch Mission Control
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-bold font-mono tracking-widest text-zinc-300 bg-zinc-900 border border-zinc-850 hover:bg-zinc-800 hover:text-white rounded-lg transition-all uppercase"
              >
                <GithubIcon size={14} />
                View Source Code
              </a>
            </div>

            {/* Telemetry metadata status row */}
            <div className="grid grid-cols-3 gap-4 border-t border-zinc-900 pt-6 font-mono text-[10px] text-zinc-500">
              <div>
                <span className="block text-zinc-300 font-bold text-xs">OPENF1</span>
                <span>DATA INTEGRATION</span>
              </div>
              <div>
                <span className="block text-zinc-300 font-bold text-xs">&lt; 15MS</span>
                <span>POLL INTERVAL</span>
              </div>
              <div>
                <span className="block text-[#FF1801] font-bold text-xs">QWEN 32B</span>
                <span>AI STRATEGY MODEL</span>
              </div>
            </div>
          </div>

          {/* Hero Workstation Mockup (right column) */}
          <div id="dashboard-preview" className="lg:col-span-7 w-full relative">
            {/* Soft backdrop glow behind mockup */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#FF1801]/10 to-orange-500/10 opacity-70 blur-xl pointer-events-none" />
            <DashboardMockup />
          </div>

        </div>
      </div>
    </section>
  );
}
