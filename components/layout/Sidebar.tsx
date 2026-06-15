"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Home, Calendar, Trophy, Activity, MessageSquare } from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

function SidebarLink({ href, icon, label, active }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
        active
          ? "bg-[#FF1801]/10 text-white border-l-2 border-[#FF1801] pl-3"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-white border-l-2 border-transparent pl-3"
      }`}
    >
      <div className={`transition-transform duration-200 group-hover:scale-110 ${active ? "text-[#FF1801]" : "text-zinc-500 group-hover:text-zinc-300"}`}>
        {icon}
      </div>
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between h-screen sticky top-0">
      {/* Top Section */}
      <div>
        {/* Branding */}
        <div className="p-6 border-b border-zinc-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#FF1801] flex items-center justify-center text-white shadow-lg shadow-[#FF1801]/20">
            <Cpu size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-wider text-white font-mono leading-none">
              A.P.E.X.<span className="text-[#FF1801]">.</span>
            </span>
            <span className="text-[8px] font-mono text-zinc-500 tracking-widest mt-1 uppercase">
              RACE CONTROL
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[9px] font-mono text-zinc-600 font-black tracking-widest uppercase mb-3 px-3">
            Navigation
          </div>
          <SidebarLink
            href="/"
            icon={<Home size={16} />}
            label="Home / Landing"
            active={pathname === "/"}
          />
          <SidebarLink
            href="/dashboard/calendar"
            icon={<Calendar size={16} />}
            label="Race Calendar"
            active={pathname.startsWith("/dashboard/calendar")}
          />
          <SidebarLink
            href="/dashboard/standings"
            icon={<Trophy size={16} />}
            label="Standings"
            active={pathname.startsWith("/dashboard/standings")}
          />
        </nav>

        {/* Future Modules (Placeholders) */}
        <div className="p-4 pt-2">
          <div className="text-[9px] font-mono text-zinc-600 font-black tracking-widest uppercase mb-3 px-3">
            Telemetry & AI
          </div>
          <div className="space-y-1">
            <SidebarLink
              href="/dashboard/live"
              icon={<Activity size={16} />}
              label="Live Timing"
              active={pathname.startsWith("/dashboard/live")}
            />
            <SidebarLink
              href="/dashboard/engineer"
              icon={<MessageSquare size={16} />}
              label="AI Engineer"
              active={pathname.startsWith("/dashboard/engineer")}
            />
          </div>
        </div>
      </div>

      {/* Footer System Specs */}
      <div className="p-6 border-t border-zinc-900 font-mono text-[9px] text-zinc-600 space-y-1">
        <div className="flex justify-between">
          <span>LATENCY:</span>
          <span className="text-emerald-500 font-bold">1.2ms</span>
        </div>
        <div className="flex justify-between">
          <span>API RATE:</span>
          <span className="text-zinc-400">100% OK</span>
        </div>
      </div>
    </aside>
  );
}
export default Sidebar;
