import React from "react";

export function TyreStrategyCard() {
  return (
    <div className="border border-zinc-800 bg-zinc-900/40 p-6 rounded-xl font-mono text-xs text-zinc-400">
      <div className="text-zinc-300 font-bold mb-4">TYRE STRATEGY TRACKER [STUB]</div>
      <div className="flex gap-2">
        <span className="w-8 h-8 rounded-full border border-red-650 flex items-center justify-center font-bold text-red-500">S</span>
        <span className="w-8 h-8 rounded-full border border-yellow-650 flex items-center justify-center font-bold text-yellow-500">M</span>
        <span className="w-8 h-8 rounded-full border border-white flex items-center justify-center font-bold text-white">H</span>
      </div>
    </div>
  );
}
