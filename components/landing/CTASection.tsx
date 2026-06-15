import React from "react";
import Link from "next/link";
import { Terminal, Shield, ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-zinc-950 border-t border-zinc-900 relative overflow-hidden">
      {/* Background visual indicators */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a04_1px,transparent_1px),linear-gradient(to_bottom,#27272a04_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#FF1801]/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-8 md:p-12 lg:p-16 text-center space-y-6 relative overflow-hidden">
          {/* Neon border glow overlay */}
          <div className="absolute -inset-px bg-gradient-to-r from-[#FF1801]/10 to-transparent opacity-50 pointer-events-none rounded-2xl" />

          {/* Icon HUD */}
          <div className="mx-auto w-12 h-12 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#FF1801] mb-6">
            <Terminal size={20} />
          </div>

          <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF1801] uppercase">
            {"// SECURE NODE: STRATEGY_CONNECT_OK"}
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight max-w-2xl mx-auto">
            Ready to Take Control of Your Strategy?
          </h2>

          <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Connect your telemetry feeds, optimize your pit window models, and leverage state-of-the-art AI insights to secure the checker flag.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/dashboard/calendar"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-bold font-mono tracking-widest text-white bg-[#FF1801] hover:bg-[#E01500] rounded-lg transition-all uppercase shadow-lg shadow-[#FF1801]/15 group"
            >
              <span>Launch Mission Control</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-bold font-mono tracking-widest text-zinc-400 bg-zinc-950 border border-zinc-900 hover:border-zinc-800 hover:text-zinc-200 rounded-lg transition-all uppercase"
            >
              Explore Modules
            </a>
          </div>

          {/* System status logs */}
          <div className="pt-8 border-t border-zinc-950/80 flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[10px] font-mono text-zinc-600">
            <div className="flex items-center gap-1.5">
              <Shield size={10} className="text-emerald-500" />
              <span>TLS 1.3 ENCRYPTION</span>
            </div>
            <span>STABLE CONNECTION</span>
            <span>API RECEPTIVITY 100%</span>
          </div>

        </div>
      </div>
    </section>
  );
}
