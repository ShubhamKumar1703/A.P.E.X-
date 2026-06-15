import React, { useMemo } from "react";
import { F1RaceResult } from "@/lib/services/f1/types";
import { getRaceInsights } from "@/lib/analytics/race-insights";
import { Clock, Award, ShieldAlert, Users, TrendingUp } from "lucide-react";

interface InsightsPanelProps {
  results: F1RaceResult[];
}

export default function InsightsPanel({ results }: InsightsPanelProps) {
  const insights = useMemo(() => {
    if (!results || results.length === 0) return null;
    return getRaceInsights(results);
  }, [results]);

  if (!results || results.length === 0 || !insights) {
    return (
      <div className="border border-zinc-900 rounded-xl p-8 text-center bg-zinc-900/10 backdrop-blur-sm max-w-md mx-auto font-mono text-xs text-zinc-500">
        <ShieldAlert size={24} className="mx-auto text-yellow-500/80 mb-3 animate-pulse" />
        <h4 className="text-zinc-400 font-bold uppercase mb-1">NO RACE INTEL COMPILED</h4>
        <p>Race results must be populated to generate deterministic session insights.</p>
      </div>
    );
  }

  const { biggestGainer, strongestRecovery, bestConstructor, closestBattle, bestRookie } = insights;

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest">
        DETERMINISTIC SESSION INTEL (NO AI)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Strongest Recovery Drive */}
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono flex flex-col justify-between backdrop-blur-sm h-[180px] relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-red-600" />
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider pb-2 border-b border-zinc-900">
            <span>STRONGEST RECOVERY</span>
            <TrendingUp size={12} className="text-red-500" />
          </div>
          <div className="my-2 space-y-1">
            {strongestRecovery ? (
              <>
                <h4 className="text-sm font-black text-white truncate leading-tight">
                  {strongestRecovery.driver.firstName} {strongestRecovery.driver.lastName}
                </h4>
                <span className="text-[10px] font-bold block uppercase leading-none" style={{ color: strongestRecovery.driver.teamColor }}>
                  {strongestRecovery.driver.teamName}
                </span>
                <div className="text-[20px] font-black text-white font-mono mt-1">
                  {strongestRecovery.score} <span className="text-xs text-zinc-500 font-normal">pts</span>
                </div>
              </>
            ) : (
              <span className="text-[10px] text-zinc-500 italic block">No recovery drives logged.</span>
            )}
          </div>
          <div className="text-[8.5px] leading-tight text-zinc-500 border-t border-zinc-900 pt-2 uppercase">
            Calculated score weighting position gain against starting grid difficulty.
          </div>
        </div>

        {/* Best Constructor Performance */}
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono flex flex-col justify-between backdrop-blur-sm h-[180px] relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-blue-500" />
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider pb-2 border-b border-zinc-900">
            <span>TEAM OF THE WEEKEND</span>
            <Users size={12} className="text-blue-400" />
          </div>
          <div className="my-2 space-y-1">
            {bestConstructor ? (
              <>
                <h4 className="text-sm font-black text-white truncate leading-tight">
                  {bestConstructor.teamName}
                </h4>
                <div className="text-[20px] font-black text-white font-mono mt-1" style={{ color: bestConstructor.teamColor }}>
                  {bestConstructor.points} <span className="text-xs text-zinc-500 font-normal">pts scored</span>
                </div>
                <span className="text-[9px] text-zinc-400 block font-bold">
                  AVG FINISH: P{bestConstructor.averagePosition} | NET GAIN: {bestConstructor.positionGain >= 0 ? `+${bestConstructor.positionGain}` : bestConstructor.positionGain}
                </span>
              </>
            ) : (
              <span className="text-[10px] text-zinc-500 italic block">No team metrics parsed.</span>
            )}
          </div>
          <div className="text-[8.5px] leading-tight text-zinc-500 border-t border-zinc-900 pt-2 uppercase">
            Determined by points scored, position gains, and average finish.
          </div>
        </div>

        {/* Closest Battle */}
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono flex flex-col justify-between backdrop-blur-sm h-[180px] relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-purple-500" />
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider pb-2 border-b border-zinc-900">
            <span>CLOSEST CONTEST</span>
            <Clock size={12} className="text-purple-400" />
          </div>
          <div className="my-2 space-y-1">
            {closestBattle ? (
              <>
                <h4 className="text-sm font-black text-white truncate leading-none">
                  {closestBattle.driverA.lastName} vs {closestBattle.driverB.lastName}
                </h4>
                <span className="text-[8px] text-zinc-400 block font-bold uppercase tracking-wide">
                  P{closestBattle.driverA.position} AND P{closestBattle.driverB.position} BATTLE
                </span>
                <div className="text-[20px] font-black text-purple-400 font-mono mt-1">
                  +{closestBattle.gapSeconds}s <span className="text-xs text-zinc-500 font-normal">gap</span>
                </div>
              </>
            ) : (
              <span className="text-[10px] text-zinc-500 italic block">No time gaps parsed.</span>
            )}
          </div>
          <div className="text-[8.5px] leading-tight text-zinc-500 border-t border-zinc-900 pt-2 uppercase">
            Tightest difference in absolute race time between consecutive finishers.
          </div>
        </div>

        {/* Biggest Position Gain */}
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono flex flex-col justify-between backdrop-blur-sm h-[180px] relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-green-500" />
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider pb-2 border-b border-zinc-900">
            <span>NET POSITIONS GAINED</span>
            <TrendingUp size={12} className="text-green-400" />
          </div>
          <div className="my-2 space-y-1">
            {biggestGainer && biggestGainer.gain > 0 ? (
              <>
                <h4 className="text-sm font-black text-white truncate leading-tight">
                  {biggestGainer.driver.firstName} {biggestGainer.driver.lastName}
                </h4>
                <span className="text-[10px] font-bold block uppercase leading-none" style={{ color: biggestGainer.driver.teamColor }}>
                  {biggestGainer.driver.teamName}
                </span>
                <div className="text-[20px] font-black text-green-400 font-mono mt-1">
                  +{biggestGainer.gain} <span className="text-xs text-zinc-500 font-normal">positions</span>
                </div>
              </>
            ) : (
              <span className="text-[10px] text-zinc-500 italic block">No positive gains recorded.</span>
            )}
          </div>
          <div className="text-[8.5px] leading-tight text-zinc-500 border-t border-zinc-900 pt-2 uppercase">
            Net positive difference between grid start and finish classification.
          </div>
        </div>

        {/* Best Finishing Rookie */}
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono flex flex-col justify-between backdrop-blur-sm h-[180px] relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-yellow-500" />
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider pb-2 border-b border-zinc-900">
            <span>BEST ROOKIE FINISH</span>
            <Award size={12} className="text-yellow-500" />
          </div>
          <div className="my-2 space-y-1">
            {bestRookie ? (
              <>
                <h4 className="text-sm font-black text-white truncate leading-tight">
                  {bestRookie.firstName} {bestRookie.lastName}
                </h4>
                <span className="text-[10px] font-bold block uppercase leading-none" style={{ color: bestRookie.teamColor }}>
                  {bestRookie.teamName}
                </span>
                <div className="text-[20px] font-black text-yellow-500 font-mono mt-1">
                  P{bestRookie.position} <span className="text-xs text-zinc-500 font-normal">at finish</span>
                </div>
              </>
            ) : (
              <span className="text-[10px] text-zinc-500 italic block">No rookies classified in this race.</span>
            )}
          </div>
          <div className="text-[8.5px] leading-tight text-zinc-500 border-t border-zinc-900 pt-2 uppercase">
            Highest classified finisher from the season rookie cohort.
          </div>
        </div>

      </div>
    </div>
  );
}
