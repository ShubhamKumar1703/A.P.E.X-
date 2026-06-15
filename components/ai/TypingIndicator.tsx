import React from "react";
import { Cpu } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3.5 p-4 rounded-xl border bg-[#FF1801]/5 border-[#FF1801]/10 text-zinc-100 animate-pulse">
      <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center bg-[#FF1801] border border-[#FF1801]/30 text-white shadow-md shadow-[#FF1801]/10">
        <Cpu size={14} className="animate-spin text-zinc-100" style={{ animationDuration: '3s' }} />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5 font-mono">
        <div className="flex items-center gap-2 text-[9px] font-bold text-[#FF1801] uppercase tracking-wider">
          <span>STRATEGY ENGINEER</span>
          <span className="w-1.5 h-1.5 bg-[#FF1801] rounded-full animate-ping" />
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-xs text-zinc-500 font-mono">COMPUTING PIT-WALL STRATEGY DELTAS</span>
          <span className="text-zinc-400 animate-bounce font-black text-xs leading-none">.</span>
          <span className="text-zinc-400 animate-bounce font-black text-xs leading-none" style={{ animationDelay: '150ms' }}>.</span>
          <span className="text-zinc-400 animate-bounce font-black text-xs leading-none" style={{ animationDelay: '300ms' }}>.</span>
        </div>
      </div>
    </div>
  );
}
export default TypingIndicator;
