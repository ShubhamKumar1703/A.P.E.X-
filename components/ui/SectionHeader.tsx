import React from "react";
import { tokens } from "@/lib/design-system";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
}

export function SectionHeader({ title, subtitle, badge, centered = false }: SectionHeaderProps) {
  return (
    <div className={`mb-12 ${centered ? "text-center" : "text-left"}`}>
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold font-mono tracking-wider bg-red-500/10 text-[#FF1801] border border-red-500/20 mb-4 uppercase">
          {badge}
        </span>
      )}
      <h2 className={`${tokens.typography.h2} text-white mb-4`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`${tokens.typography.body} max-w-2xl ${centered ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
