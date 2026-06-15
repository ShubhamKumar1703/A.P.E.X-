import React from "react";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
}

export function FeatureCard({ title, description, icon: Icon, index }: FeatureCardProps) {
  return (
    <div className={`group relative p-6 md:p-8 rounded-xl border border-zinc-900 bg-zinc-900/30 backdrop-blur-md transition-all duration-300 hover:border-zinc-800 hover:bg-zinc-900/50 hover:shadow-2xl hover:shadow-[#FF1801]/5 overflow-hidden flex flex-col justify-between`}>
      {/* Decorative corner lines inspired by telemetry terminals */}
      <div className="absolute top-0 right-0 w-8 h-px bg-zinc-800 group-hover:bg-[#FF1801]/30 transition-colors" />
      <div className="absolute top-0 right-0 w-px h-8 bg-zinc-800 group-hover:bg-[#FF1801]/30 transition-colors" />
      
      {/* Card Index */}
      <div className="absolute top-4 right-4 text-[10px] font-mono text-zinc-700 font-bold group-hover:text-[#FF1801]/50 transition-colors">
        REF_0{index + 1}
      </div>

      <div className="space-y-4">
        {/* Icon wrapper */}
        <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-850 flex items-center justify-center text-[#FF1801] shadow-inner group-hover:border-[#FF1801]/30 group-hover:bg-[#FF1801]/5 transition-all duration-300">
          <Icon size={20} className="group-hover:scale-110 transition-transform duration-300" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold font-mono tracking-tight text-white group-hover:text-[#FF1801] transition-colors duration-200">
            {title}
          </h3>
          <p className="text-sm text-zinc-400 font-normal leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Decorative timing signal bar at the bottom */}
      <div className="mt-6 pt-4 border-t border-zinc-950/80 flex items-center justify-between text-[9px] font-mono text-zinc-600">
        <span>STATUS // CONNECTED</span>
        <span>LATENCY // 1.2MS</span>
      </div>
    </div>
  );
}
