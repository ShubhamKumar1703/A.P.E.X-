import React from "react";
import { Compass } from "lucide-react";
import { ScenarioState, SimulationResult } from "@/lib/sandbox/types";

interface StrategyTimelineProps {
  scenario: ScenarioState;
  result: SimulationResult;
}

export function StrategyTimeline({ scenario, result }: StrategyTimelineProps) {
  const totalLaps = 70;
  
  // Calculations for percentage placements
  const getPct = (lap: number) => {
    return Math.max(0, Math.min(100, (lap / totalLaps) * 100));
  };

  const currentLapPct = getPct(scenario.currentLap);
  const targetPitPct = getPct(scenario.targetPitLap);
  const optimalStartPct = getPct(result.pitWindow.earliestStopLap);
  const optimalEndPct = getPct(result.pitWindow.latestStopLap);
  const optimalWindowWidth = optimalEndPct - optimalStartPct;

  // Compound Badge Color
  const getCompoundColor = (comp: string) => {
    switch (comp.toUpperCase()) {
      case "SOFT": return "bg-[#FF1801] border-[#FF1801]/30 text-white";
      case "MEDIUM": return "bg-yellow-500 border-yellow-500/30 text-black";
      case "HARD": return "bg-zinc-100 border-zinc-200/30 text-black";
      case "INTERMEDIATE": return "bg-green-500 border-green-500/30 text-black";
      case "WET": return "bg-blue-500 border-blue-500/30 text-white";
      default: return "bg-zinc-800 text-zinc-300";
    }
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-4 font-mono text-[10px] text-zinc-300 space-y-4">
      {/* Title */}
      <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2">
        <Compass size={12} className="text-[#FF1801]" />
        <span className="font-bold text-zinc-400 uppercase tracking-wider">
          STRATEGY WINDOW TIMELINE
        </span>
      </div>

      {/* Visual Timeline Bar */}
      <div className="relative pt-6 pb-8 px-2">
        {/* Main Track Line */}
        <div className="h-1.5 w-full bg-zinc-900 rounded-full relative">
          
          {/* Optimal Pit Stop Window (Highlighted Range) */}
          <div 
            className="absolute h-1.5 bg-emerald-500/20 border-l border-r border-emerald-500/40"
            style={{ left: `${optimalStartPct}%`, width: `${optimalWindowWidth}%` }}
            title={`Optimal Window: Lap ${result.pitWindow.earliestStopLap} - ${result.pitWindow.latestStopLap}`}
          />

          {/* Current Lap Indicator */}
          <div 
            className="absolute w-2 h-2 rounded-full bg-white border border-zinc-950 absolute -translate-x-1/2 -top-[1px] z-20 flex items-center justify-center"
            style={{ left: `${currentLapPct}%` }}
          >
            {/* Pulsing indicator if active */}
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
          </div>

          {/* Target Pit stop indicator */}
          {scenario.targetPitLap <= totalLaps && (
            <div 
              className="absolute -top-[10px] -translate-x-1/2 z-30 flex flex-col items-center gap-0.5"
              style={{ left: `${targetPitPct}%` }}
            >
              {/* Compound Badge */}
              <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-[8px] font-black shadow-lg ${getCompoundColor(scenario.nextTyreCompound)}`}>
                {scenario.nextTyreCompound[0]}
              </span>
              {/* Indicator tick line */}
              <div className="w-[1.5px] h-3 bg-zinc-200" />
            </div>
          )}
        </div>

        {/* Labels positioned underneath the line */}
        <div className="absolute left-2 right-2 top-[34px] flex justify-between text-[7.5px] text-zinc-550 font-bold uppercase select-none">
          <span>Lap 1</span>
          
          {/* Current Lap text */}
          <span 
            className="absolute -translate-x-1/2 text-white font-black"
            style={{ left: `${currentLapPct}%` }}
          >
            Lap {scenario.currentLap} (Current)
          </span>

          {/* Optimal range text */}
          <span 
            className="absolute -translate-x-1/2 text-emerald-400 font-bold"
            style={{ left: `${optimalStartPct + (optimalWindowWidth / 2)}%` }}
          >
            Pit Window
          </span>

          {/* Target Pit text */}
          {scenario.targetPitLap <= totalLaps && (
            <span 
              className="absolute -translate-x-1/2 text-[#FF1801] font-black"
              style={{ left: `${targetPitPct}%`, top: "10px" }}
            >
              BOX Lap {scenario.targetPitLap}
            </span>
          )}

          <span>Lap 70 (Finish)</span>
        </div>
      </div>

      {/* Info details box */}
      <div className="grid grid-cols-3 gap-2 bg-zinc-950/60 p-2 rounded-lg border border-zinc-900 text-[8.5px] text-zinc-500">
        <div>
          CURRENT LAP STATE: <strong className="text-zinc-350">LAP {scenario.currentLap}</strong>
        </div>
        <div className="text-center">
          WINDOW WINDOW OPENS: <strong className="text-emerald-400">LAP {result.pitWindow.earliestStopLap}</strong>
        </div>
        <div className="text-right">
          BOX FOR COMPOUND: <strong className="text-[#FF1801]">{scenario.nextTyreCompound}</strong>
        </div>
      </div>
    </div>
  );
}
export default StrategyTimeline;
