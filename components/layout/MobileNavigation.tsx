"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Trophy, Activity } from "lucide-react";

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-zinc-900 bg-zinc-950/80 backdrop-blur-md flex items-center justify-around z-50 px-6">
      {/* Home Link */}
      <Link 
        href="/"
        className={`flex flex-col items-center justify-center gap-1 ${
          pathname === "/" ? "text-[#FF1801]" : "text-zinc-500"
        }`}
      >
        <Home size={18} />
        <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Home</span>
      </Link>

      {/* Calendar Link */}
      <Link 
        href="/dashboard/calendar"
        className={`flex flex-col items-center justify-center gap-1 ${
          pathname.startsWith("/dashboard/calendar") ? "text-[#FF1801]" : "text-zinc-500"
        }`}
      >
        <Calendar size={18} />
        <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Calendar</span>
      </Link>

      {/* Live Timing Link */}
      <Link 
        href="/dashboard/live"
        className={`flex flex-col items-center justify-center gap-1 ${
          pathname.startsWith("/dashboard/live") ? "text-[#FF1801]" : "text-zinc-500"
        }`}
      >
        <Activity size={18} />
        <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Live</span>
      </Link>

      {/* Standings Link */}
      <Link 
        href="/dashboard/standings"
        className={`flex flex-col items-center justify-center gap-1 ${
          pathname.startsWith("/dashboard/standings") ? "text-[#FF1801]" : "text-zinc-500"
        }`}
      >
        <Trophy size={18} />
        <span className="text-[9px] font-mono font-bold tracking-wider uppercase">Standings</span>
      </Link>
    </nav>
  );
}
export default MobileNavigation;
