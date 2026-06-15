import React from "react";

export function LiveTimingTable() {
  return (
    <div className="border border-zinc-800 bg-zinc-900/40 p-6 rounded-xl font-mono text-xs text-zinc-400">
      <div className="text-zinc-300 font-bold mb-4">LIVE TIMING FEED [STUB]</div>
      <div className="space-y-2">
        <div className="h-6 bg-zinc-850 rounded animate-pulse" />
        <div className="h-6 bg-zinc-850 rounded animate-pulse" />
        <div className="h-6 bg-zinc-850 rounded animate-pulse" />
      </div>
    </div>
  );
}
