import React, { useMemo } from "react";
import { F1RaceResult } from "@/lib/services/f1/types";
import { getBiggestGainer, getBiggestLoser } from "@/lib/analytics/position-gain";
import { Zap, TrendingUp, TrendingDown, Flag, AlertTriangle } from "lucide-react";

interface RaceAnalysisProps {
  results: F1RaceResult[];
}

export default function RaceAnalysis({ results }: RaceAnalysisProps) {
  // 1. Calculate gainer and loser
  const gainer = useMemo(() => getBiggestGainer(results), [results]);
  const loser = useMemo(() => getBiggestLoser(results), [results]);

  if (!results || results.length === 0) {
    return (
      <div className="border border-zinc-900 rounded-xl p-8 text-center bg-zinc-900/10 backdrop-blur-sm max-w-md mx-auto font-mono text-xs text-zinc-500">
        <AlertTriangle size={24} className="mx-auto text-yellow-500/80 mb-3 animate-pulse" />
        <h4 className="text-zinc-400 font-bold uppercase mb-1">RACE AWAITING DATA</h4>
        <p>Race results session has not loaded or has not occurred yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Biggest Gainer Card */}
        {gainer && gainer.gain > 0 ? (
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono relative overflow-hidden backdrop-blur-sm flex flex-col justify-between h-[130px]">
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-green-500" />
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>BIGGEST GAINER</span>
              <TrendingUp size={12} className="text-green-400" />
            </div>
            <div>
              <h4 className="text-base font-black text-white leading-none">
                {gainer.driver.firstName} {gainer.driver.lastName}
              </h4>
              <span className="text-[10px] font-bold uppercase mt-1 block" style={{ color: gainer.driver.teamColor }}>
                {gainer.driver.teamName}
              </span>
            </div>
            <div className="border-t border-zinc-900/60 pt-2 flex justify-between text-[10px] text-zinc-400">
              <span className="text-green-400 font-bold">+{gainer.gain} POSITIONS</span>
              <span>GRID: P{gainer.driver.grid} &rarr; FINISH: P{gainer.driver.position}</span>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono relative overflow-hidden backdrop-blur-sm flex flex-col justify-between h-[130px]">
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-zinc-800" />
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>BIGGEST GAINER</span>
              <TrendingUp size={12} className="text-zinc-600" />
            </div>
            <p className="text-[10px] text-zinc-500 italic">No positive position gains recorded.</p>
            <div className="border-t border-zinc-900/60 pt-2 text-[10px] text-zinc-500">
              Grid layout remained static.
            </div>
          </div>
        )}

        {/* Biggest Loser Card */}
        {loser && loser.gain < 0 ? (
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono relative overflow-hidden backdrop-blur-sm flex flex-col justify-between h-[130px]">
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-red-600" />
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>POSITION DEFICIT</span>
              <TrendingDown size={12} className="text-red-400" />
            </div>
            <div>
              <h4 className="text-base font-black text-white leading-none">
                {loser.driver.firstName} {loser.driver.lastName}
              </h4>
              <span className="text-[10px] font-bold uppercase mt-1 block" style={{ color: loser.driver.teamColor }}>
                {loser.driver.teamName}
              </span>
            </div>
            <div className="border-t border-zinc-900/60 pt-2 flex justify-between text-[10px] text-zinc-400">
              <span className="text-red-400 font-bold">{loser.gain} POSITIONS</span>
              <span>GRID: P{loser.driver.grid} &rarr; FINISH: P{loser.driver.position}</span>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono relative overflow-hidden backdrop-blur-sm flex flex-col justify-between h-[130px]">
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-zinc-800" />
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>POSITION DEFICIT</span>
              <TrendingDown size={12} className="text-zinc-600" />
            </div>
            <p className="text-[10px] text-zinc-500 italic">No negative position changes recorded.</p>
            <div className="border-t border-zinc-900/60 pt-2 text-[10px] text-zinc-500">
              Grid layout remained static.
            </div>
          </div>
        )}
      </div>

      {/* Classification List */}
      <div className="space-y-4">
        <h3 className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
          <Flag size={14} className="text-red-500" /> FINAL CLASSIFICATION & POSITION CHANGES
        </h3>
        
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-zinc-400">
              <thead className="bg-zinc-950 text-zinc-500 uppercase tracking-widest text-[9px] font-bold border-b border-zinc-900">
                <tr>
                  <th className="py-4 px-6 text-center w-16">POS</th>
                  <th className="py-4 px-4">DRIVER</th>
                  <th className="py-4 px-4">CONSTRUCTOR</th>
                  <th className="py-4 px-4 text-center w-20">GRID</th>
                  <th className="py-4 px-4 text-center w-24">CHANGE</th>
                  <th className="py-4 px-4 text-center w-24">TIME/STATUS</th>
                  <th className="py-4 px-6 text-right w-20">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {results.map((r) => {
                  const gain = r.grid - r.position;
                  let changeElement = <span className="text-zinc-500 font-bold">0</span>;
                  if (gain > 0) {
                    changeElement = <span className="text-green-400 font-bold">+{gain}</span>;
                  } else if (gain < 0) {
                    changeElement = <span className="text-red-400 font-bold">{gain}</span>;
                  }
                  
                  return (
                    <tr key={r.driverId} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="py-3 px-6 text-center font-black text-white">{r.position}</td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-3.5 rounded-sm" style={{ backgroundColor: r.teamColor }} />
                        <span>{r.firstName} {r.lastName}</span>
                        <span className="text-[9px] text-zinc-600 font-medium">#{r.number}</span>
                        {r.fastestLapRank === 1 && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-purple-500/15 border border-purple-500/30 text-purple-400 font-mono text-[8px] font-bold uppercase tracking-wider scale-[0.85] origin-left">
                            <Zap size={8} className="fill-purple-400/20" /> Purple
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-zinc-400 font-bold text-[10px] uppercase" style={{ color: r.teamColor }}>
                        {r.teamName}
                      </td>
                      <td className="py-3 px-4 text-center text-zinc-300 font-semibold">P{r.grid}</td>
                      <td className="py-3 px-4 text-center">{changeElement}</td>
                      <td className="py-3 px-4 text-center text-zinc-400 font-medium">{r.time || r.status}</td>
                      <td className="py-3 px-6 text-right font-black text-white">{r.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
