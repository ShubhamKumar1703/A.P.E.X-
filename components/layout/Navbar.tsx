import React from "react";
import Link from "next/link";
import { Cpu } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/75 backdrop-blur-md border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF1801] flex items-center justify-center text-white shadow-lg shadow-[#FF1801]/20">
              <Cpu size={18} />
            </div>
            <span className="text-xl font-black tracking-wider text-white font-mono">
              A.P.E.X.<span className="text-[#FF1801]">.</span>
            </span>
          </div>

          {/* Links - Desktop */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-zinc-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#telemetry" className="text-zinc-400 hover:text-white transition-colors">
              Telemetry
            </a>
            <a href="#roadmap" className="text-zinc-400 hover:text-white transition-colors">
              Roadmap
            </a>
            <a href="#architecture" className="text-zinc-400 hover:text-white transition-colors">
              Architecture
            </a>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 rounded-lg transition-all"
              aria-label="GitHub Repository"
            >
              <GithubIcon size={18} />
            </a>
            <Link
              href="/dashboard/calendar"
              className="px-4 py-2 text-xs font-bold font-mono tracking-wider text-white bg-[#FF1801] hover:bg-[#E01500] rounded-lg transition-all shadow-md shadow-[#FF1801]/10 uppercase"
            >
              Launch Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
