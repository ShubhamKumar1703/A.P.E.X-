import React from "react";
import { ArrowLeftRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { ScenarioState, SimulationResult } from "@/lib/sandbox/types";

interface ScenarioComparisonProps {
  scenarioA: ScenarioState;
  resultA: SimulationResult;
  scenarioB: ScenarioState;
  resultB: SimulationResult;
}

export function ScenarioComparison({
  scenarioA,
  resultA,
  scenarioB,
  resultB
}: ScenarioComparisonProps) {
  
  // Diff positions (lower is better, e.g. P2 is better than P4)
  const posDiff = resultA.predictedPosition - resultB.predictedPosition;
  
  // Diff tyre age at target stop
  const targetStintA = scenarioA.targetPitLap - (scenarioA.currentLap - scenarioA.tyreAge);
  const targetStintB = scenarioB.targetPitLap - (scenarioB.currentLap - scenarioB.tyreAge);
  const stintDiff = targetStintA - targetStintB;

  // Diff risk scores
  const riskDiff = resultA.riskScore - resultB.riskScore;

  // Render position advantage badge
  const renderPosAdvantage = () => {
    if (posDiff < 0) {
      return (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-2.5 flex items-start gap-2">
          <ShieldCheck size={14} className="text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-emerald-400 block text-[9.5px]">SCENARIO A ADVANTAGE</span>
            <span className="text-zinc-400 text-[8.5px] leading-relaxed">
              Scenario A is projected to finish <strong className="text-white">{Math.abs(posDiff)} position(s) higher</strong> than Scenario B (P{resultA.predictedPosition} vs P{resultB.predictedPosition}).
            </span>
          </div>
        </div>
      );
    } else if (posDiff > 0) {
      return (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2.5 flex items-start gap-2">
          <ShieldCheck size={14} className="text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-blue-400 block text-[9.5px]">SCENARIO B ADVANTAGE</span>
            <span className="text-zinc-400 text-[8.5px] leading-relaxed">
              Scenario B is projected to finish <strong className="text-white">{posDiff} position(s) higher</strong> than Scenario A (P{resultB.predictedPosition} vs P{resultA.predictedPosition}).
            </span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-zinc-900 border border-zinc-800 rounded p-2.5 flex items-start gap-2 text-zinc-400 text-[8.5px]">
          <CheckCircle2 size={14} className="text-zinc-500 shrink-0 mt-0.5" />
          <span>Both strategies predict an identical finishing position (P{resultA.predictedPosition}). Compare risk thresholds and undercut percentages to select optimal path.</span>
        </div>
      );
    }
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-4 font-mono text-[10px] text-zinc-300 space-y-4">
      {/* Title */}
      <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2">
        <ArrowLeftRight size={12} className="text-[#FF1801]" />
        <span className="font-bold text-zinc-400 uppercase tracking-wider">
          SCENARIO COMPARISON OVERLAY
        </span>
      </div>

      {/* Visual Difference Highlights */}
      {renderPosAdvantage()}

      {/* Side-by-Side Table Grid */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* Scenario A specs */}
        <div className="border border-[#FF1801]/10 bg-[#FF1801]/5 p-3 rounded-lg space-y-2">
          <span className="text-[9px] font-black text-[#FF1801] uppercase tracking-wider block border-b border-[#FF1801]/15 pb-1">
            {scenarioA.name} (A)
          </span>
          <div className="space-y-1.5 text-[8.5px]">
            <div className="flex justify-between">
              <span className="text-zinc-500">Predicted Finish:</span>
              <span className="text-white font-bold">P{resultA.predictedPosition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Pit Stop Lap:</span>
              <span className="text-white font-bold">Lap {scenarioA.targetPitLap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Stint Length:</span>
              <span className="text-white font-bold">{targetStintA} Laps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Pace Loss Stint End:</span>
              <span className="text-red-400 font-bold">+{resultA.tyre.paceLoss.toFixed(2)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Risk Profile:</span>
              <span className="text-white font-bold">{resultA.riskScore}%</span>
            </div>
          </div>
        </div>

        {/* Scenario B specs */}
        <div className="border border-blue-500/10 bg-blue-500/5 p-3 rounded-lg space-y-2">
          <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider block border-b border-blue-500/15 pb-1">
            {scenarioB.name} (B)
          </span>
          <div className="space-y-1.5 text-[8.5px]">
            <div className="flex justify-between">
              <span className="text-zinc-500">Predicted Finish:</span>
              <span className="text-white font-bold">P{resultB.predictedPosition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Pit Stop Lap:</span>
              <span className="text-white font-bold">Lap {scenarioB.targetPitLap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Stint Length:</span>
              <span className="text-white font-bold">{targetStintB} Laps</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Pace Loss Stint End:</span>
              <span className="text-red-400 font-bold">+{resultB.tyre.paceLoss.toFixed(2)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Risk Profile:</span>
              <span className="text-white font-bold">{resultB.riskScore}%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Difference deltas footer */}
      <div className="bg-zinc-950 p-2 rounded border border-zinc-900 grid grid-cols-3 gap-2 text-[8px] text-zinc-500 uppercase">
        <div>
          STINT DELTA:{" "}
          <span className={stintDiff === 0 ? "text-zinc-400" : (stintDiff > 0 ? "text-emerald-400 font-bold" : "text-amber-400 font-bold")}>
            {stintDiff === 0 ? "EQUAL" : (stintDiff > 0 ? `A EXTENDS +${stintDiff}L` : `B EXTENDS +${Math.abs(stintDiff)}L`)}
          </span>
        </div>
        <div className="text-center">
          RISK DELTA:{" "}
          <span className={riskDiff === 0 ? "text-zinc-400" : (riskDiff > 0 ? "text-red-400 font-bold" : "text-emerald-400 font-bold")}>
            {riskDiff === 0 ? "EQUAL" : (riskDiff > 0 ? `A +${riskDiff}% RISK` : `B +${Math.abs(riskDiff)}% RISK`)}
          </span>
        </div>
        <div className="text-right">
          WEATHER SUIT:{" "}
          <span className="text-white font-bold">
            {resultA.weather.tyreSuitability === resultB.weather.tyreSuitability ? "MATCHING" : "DIVERGENT"}
          </span>
        </div>
      </div>
    </div>
  );
}
export default ScenarioComparison;
