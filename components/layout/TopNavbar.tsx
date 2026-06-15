"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Cpu, Activity, Clock } from "lucide-react";

import { getSystemDate } from "@/lib/utils/date";

export function TopNavbar() {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.includes("/calendar")) return "Race Calendar";
    if (pathname.includes("/standings")) return "Standings Control";
    return "Mission Control";
  };

  const formattedDate = getSystemDate().toISOString().split("T")[0];

  return (
    <header className="h-16 border-b border-zinc-900 bg-zinc-950/40 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Breadcrumb Title */}
      <div className="flex items-center gap-3">
        {/* Mobile Logo (Sidebar is hidden on mobile) */}
        <div className="w-6 h-6 rounded bg-[#FF1801] flex md:hidden items-center justify-center text-white shadow-md">
          <Cpu size={12} />
        </div>
        <h1 className="text-sm font-bold font-mono tracking-wider text-white uppercase flex items-center gap-2">
          {getPageTitle()}
        </h1>
      </div>

      {/* Terminal Stats */}
      <div className="flex items-center gap-6 font-mono text-[10px] text-zinc-500">
        {/* Mock System Date */}
        <div className="hidden sm:flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-900 px-2.5 py-1 rounded">
          <Clock size={11} className="text-[#FF1801]" />
          <span className="text-zinc-400">SYS_DATE:</span>
          <span className="text-zinc-200 font-bold">{formattedDate}</span>
        </div>

        {/* Sync Rate */}
        <div className="flex items-center gap-1.5 bg-zinc-900/60 border border-zinc-900 px-2.5 py-1 rounded">
          <Activity size={11} className="text-emerald-500 animate-pulse" />
          <span className="text-zinc-400">STATUS:</span>
          <span className="text-emerald-500 font-bold">ACTIVE</span>
        </div>
      </div>
    </header>
  );
}
export default TopNavbar;
