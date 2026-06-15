import React from "react";
import { CircuitInfo } from "@/data/circuits";
import { Compass } from "lucide-react";

interface CircuitIntelligenceCardProps {
  circuit: CircuitInfo;
}

export default function CircuitIntelligenceCard({ circuit }: CircuitIntelligenceCardProps) {
  return (
    <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 md:p-6 font-mono relative overflow-hidden backdrop-blur-sm">
      {/* Top glowing bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600/30" />
      
      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-zinc-500 tracking-wider uppercase border-b border-zinc-900 pb-2">
        <Compass size={14} className="text-red-500" />
        <span>TRACK METRICS & SPECIFICATIONS</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-lg p-3">
          <span className="text-[10px] text-zinc-500 block uppercase font-black">TRACK LENGTH</span>
          <span className="text-sm font-black text-white">{circuit.length}</span>
        </div>
        
        <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-lg p-3">
          <span className="text-[10px] text-zinc-500 block uppercase font-black">TURNS</span>
          <span className="text-sm font-black text-white">{circuit.turns}</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-lg p-3">
          <span className="text-[10px] text-zinc-500 block uppercase font-black">DRS ZONES</span>
          <span className="text-sm font-black text-white">{circuit.drsZones}</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-lg p-3">
          <span className="text-[10px] text-zinc-500 block uppercase font-black">LAP RECORD</span>
          <span className="text-xs font-black text-red-500 block truncate leading-tight mt-0.5">
            {circuit.lapRecord.time}
          </span>
          <span className="text-[8px] text-zinc-400 block truncate leading-tight">
            {circuit.lapRecord.driver} ({circuit.lapRecord.year})
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <span className="text-[10px] text-zinc-500 block uppercase font-black mb-1.5">TRACK CHARACTERISTICS</span>
          <div className="flex flex-wrap gap-1.5">
            {circuit.characteristics.map((char, index) => (
              <span 
                key={index} 
                className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-300 font-bold uppercase tracking-wider hover:border-red-500/30 transition-colors"
              >
                {char}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-zinc-900/60 pt-3">
          <span className="text-[10px] text-zinc-500 block uppercase font-black mb-1">ANALYSIS BRIEF</span>
          <p className="text-[10.5px] leading-relaxed text-zinc-400 font-sans">
            {circuit.description}
          </p>
        </div>

        {circuit.previousWinners && circuit.previousWinners.length > 0 && (
          <div className="border-t border-zinc-900/60 pt-3">
            <span className="text-[10px] text-zinc-500 block uppercase font-black mb-1.5">HISTORIC WINNERS</span>
            <div className="grid grid-cols-3 gap-2">
              {circuit.previousWinners.map((winner, idx) => (
                <div key={idx} className="bg-zinc-900/20 border border-zinc-900/40 rounded p-2 text-center">
                  <span className="text-[8px] text-zinc-500 block font-bold">{winner.year}</span>
                  <span className="text-[10px] text-zinc-200 block truncate font-black">{winner.driver}</span>
                  <span className="text-[8px] text-zinc-400 block truncate uppercase">{winner.team}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
