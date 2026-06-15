import React from "react";
import { 
  Trophy, 
  Timer, 
  Flame, 
  CloudRain, 
  Target, 
  AlertOctagon 
} from "lucide-react";
import { SimulationResult } from "@/lib/sandbox/types";

interface SimulationResultsProps {
  result: SimulationResult;
  scenarioName: string;
  themeColorClass: string; // text-[#FF1801] or text-blue-500
  borderColorClass: string; // border-[#FF1801]/10 or border-blue-500/10
  bgGlowClass: string; // bg-[#FF1801]/5 or bg-blue-500/5
}

export function SimulationResults({
  result,
  scenarioName,
  themeColorClass,
  borderColorClass,
  bgGlowClass
}: SimulationResultsProps) {
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-red-500";
    if (score >= 40) return "text-amber-500";
    return "text-emerald-500";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Immediate":
      case "High":
        return "text-red-500 animate-pulse";
      case "Moderate":
        return "text-amber-500";
      case "Low":
        return "text-blue-400";
      default:
        return "text-zinc-500";
    }
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Overview Header Banner */}
      <div className={`border ${borderColorClass} ${bgGlowClass} rounded-xl p-3 flex justify-between items-center shrink-0`}>
        <div className="space-y-0.5">
          <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest block">
            SIMULATION SUMMARY // ACTIVE STRATEGY
          </span>
          <h3 className={`text-xs font-black ${themeColorClass} uppercase tracking-tight`}>
            {scenarioName}
          </h3>
        </div>
        <div className="flex gap-4 text-[9px] text-zinc-500 uppercase">
          <div>
            RISK: <span className={`font-black ${getScoreColor(result.riskScore)}`}>{result.riskScore}%</span>
          </div>
          <div>
            OPP: <span className="text-emerald-400 font-black">{result.opportunityScore}%</span>
          </div>
        </div>
      </div>

      {/* Main Heuristic Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Predicted Finish */}
        <div className={`border border-zinc-900 bg-zinc-950/40 rounded-xl p-4 flex items-center justify-between relative overflow-hidden`}>
          <div className="space-y-1 z-10">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">
              PREDICTED FINISH POSITION
            </span>
            <div className="text-3xl font-black text-white">
              P{result.predictedPosition}
            </div>
            <span className="text-[8px] text-zinc-550 block font-bold">
              Based on pace loss vs undercut deltas
            </span>
          </div>
          <Trophy size={48} className="text-zinc-800/20 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>

        {/* Recommended Pit Lap */}
        <div className={`border border-zinc-900 bg-zinc-950/40 rounded-xl p-4 flex items-center justify-between relative overflow-hidden`}>
          <div className="space-y-1 z-10">
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">
              RECOMMENDED PIT STOP WINDOW
            </span>
            <div className="text-2xl font-black text-white">
              LAP {result.pitWindow.optimalStopLap}
            </div>
            <span className="text-[8px] text-zinc-550 block font-bold">
              Window: Laps {result.pitWindow.earliestStopLap} &mdash; {result.pitWindow.latestStopLap}
            </span>
          </div>
          <Timer size={48} className="text-zinc-800/20 absolute right-4 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Structured Explanation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tyre Degradation Stint Analysis */}
        <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
              <span className="font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 text-[9px]">
                <Flame size={12} className="text-red-500" />
                Tyre Degradation Model
              </span>
              <span className="text-[8px] text-zinc-500">
                Health: <strong className="text-white">{result.tyre.tyreHealthPercent}%</strong>
              </span>
            </div>

            {/* Explanation lines */}
            <div className="space-y-1 text-[8.5px] text-zinc-400 leading-relaxed">
              {result.tyre.explanation.map((e, idx) => (
                <div key={idx} className="flex gap-1.5 items-start">
                  <span className="text-[#FF1801] shrink-0 font-bold">&rarr;</span>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 text-[9px] border-t border-zinc-900/60 text-zinc-500 flex justify-between">
            <span>Stint Pace Loss: +{result.tyre.paceLoss.toFixed(2)}s/lap</span>
            <span>Est. Life: {result.tyre.remainingLife} laps</span>
          </div>
        </div>

        {/* Undercut Potential Analysis */}
        <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
              <span className="font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 text-[9px]">
                <Target size={12} className="text-emerald-400" />
                Undercut Model
              </span>
              <span className="text-[8px] text-zinc-500">
                Probability: <strong className="text-emerald-400">{result.undercut.probability}%</strong>
              </span>
            </div>

            <div className="space-y-1 text-[8.5px] text-zinc-400 leading-relaxed">
              {result.undercut.explanation.map((e, idx) => (
                <div key={idx} className="flex gap-1.5 items-start">
                  <span className="text-emerald-500 shrink-0 font-bold">&rarr;</span>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 text-[9px] border-t border-zinc-900/60 text-zinc-500 flex justify-between">
            <span>Estimated Gain: +{result.undercut.estimatedGainSeconds}s</span>
            <span>Confidence: {result.undercut.confidenceScore}/100</span>
          </div>
        </div>

        {/* Weather Suitability Analysis */}
        <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
              <span className="font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 text-[9px]">
                <CloudRain size={12} className="text-blue-400" />
                Weather Model
              </span>
              <span className="text-[8px] text-zinc-500">
                Urgency: <strong className={getUrgencyColor(result.weather.pitUrgency)}>{result.weather.pitUrgency.toUpperCase()}</strong>
              </span>
            </div>

            <div className="space-y-1 text-[8.5px] text-zinc-400 leading-relaxed">
              {result.weather.explanation.map((e, idx) => (
                <div key={idx} className="flex gap-1.5 items-start">
                  <span className="text-blue-400 shrink-0 font-bold">&rarr;</span>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 text-[9px] border-t border-zinc-900/60 text-zinc-500 flex justify-between">
            <span>Tyre Status: {result.weather.tyreSuitability}</span>
            <span>Track Evolution: {result.weather.trackEvolutionImpact}</span>
          </div>
        </div>

        {/* Safety Car Decision Model */}
        <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-3.5 space-y-2.5 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5">
              <span className="font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 text-[9px]">
                <AlertOctagon size={12} className="text-yellow-500" />
                Safety Car Model
              </span>
              <span className="text-[8px] text-zinc-500">
                Stack Risk: <strong className={result.safetyCar.doubleStackRisk ? "text-red-500 animate-pulse" : "text-emerald-500"}>
                  {result.safetyCar.doubleStackRisk ? "HIGH" : "NONE"}
                </strong>
              </span>
            </div>

            <div className="space-y-1 text-[8.5px] text-zinc-400 leading-relaxed">
              {result.safetyCar.explanation.map((e, idx) => (
                <div key={idx} className="flex gap-1.5 items-start">
                  <span className="text-yellow-500 shrink-0 font-bold">&rarr;</span>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-2 text-[9px] border-t border-zinc-900/60 text-zinc-500 flex flex-col gap-0.5">
            <div className="flex justify-between w-full">
              <span>Decision: {result.safetyCar.shouldPit ? "BOX NOW" : "STAY OUT"}</span>
              <span>SC Pit Savings: +{result.safetyCar.timeSavedSeconds}s</span>
            </div>
            <div className="text-[8px] text-zinc-400 mt-1 truncate">
              ADVISE: {result.safetyCar.actionRecommendation}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default SimulationResults;
