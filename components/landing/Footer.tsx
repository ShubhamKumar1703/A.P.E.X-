import { Cpu } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";

export function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#FF1801] flex items-center justify-center text-white">
              <Cpu size={14} />
            </div>
            <span className="text-sm font-bold tracking-wider text-white font-mono">
              A.P.E.X.<span className="text-[#FF1801]">.</span>
            </span>
            <span className="text-xs text-zinc-500 font-mono">
              — Your Digital Race Engineer
            </span>
          </div>

          {/* Links and Built-With */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs font-mono text-zinc-500">
            <span>Built with Next.js 15 & TS</span>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              <GithubIcon size={12} />
              GitHub
            </a>
            <span>© {new Date().getFullYear()} A.P.E.X. Inc. All rights reserved.</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
