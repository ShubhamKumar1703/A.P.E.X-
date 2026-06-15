import React, { useMemo } from "react";
import { F1QualifyingResult, F1DriverStanding } from "@/lib/services/f1/types";
import { getQualifyingWinners } from "@/lib/analytics/race-insights";
import { Zap, Trophy, TrendingUp, AlertTriangle } from "lucide-react";

interface QualifyingAnalysisProps {
  qualifyingResults: F1QualifyingResult[];
  standings: F1DriverStanding[];
}

// Helper to convert qualifying times (e.g. "1:15.541" or "75.541") to seconds
function parseTimeToSeconds(timeStr: string | undefined): number | null {
  if (!timeStr) return null;
  const parts = timeStr.trim().split(":");
  try {
    if (parts.length === 2) {
      // mm:ss.xxx
      return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
    } else if (parts.length === 1) {
      // ss.xxx
      const sec = parseFloat(parts[0]);
      return isNaN(sec) ? null : sec;
    }
  } catch {
    return null;
  }
  return null;
}

export default function QualifyingAnalysis({ qualifyingResults, standings }: QualifyingAnalysisProps) {
  // 1. Pole sitter & Gap to P2
  const poleDetails = useMemo(() => {
    if (!qualifyingResults || qualifyingResults.length < 2) return null;
    const p1 = qualifyingResults[0];
    const p2 = qualifyingResults[1];
    
    if (!p1.q3) return { pole: p1, gapText: "N/A" };
    
    const t1 = parseTimeToSeconds(p1.q3);
    const t2 = parseTimeToSeconds(p2?.q3);
    
    if (t1 !== null && t2 !== null) {
      const diff = t2 - t1;
      return {
        pole: p1,
        gapText: `+${diff.toFixed(3)}s`
      };
    }
    
    return { pole: p1, gapText: "Interval N/A" };
  }, [qualifyingResults]);

  // 2. Q3 Team Distribution (Top 10)
  const teamDistribution = useMemo(() => {
    if (!qualifyingResults) return [];
    const counts: Record<string, { name: string; color: string; count: number }> = {};
    
    // Look at top 10 qualifiers
    qualifyingResults.slice(0, 10).forEach((q) => {
      if (!counts[q.teamId]) {
        counts[q.teamId] = {
          name: q.teamName,
          color: q.teamColor,
          count: 0
        };
      }
      counts[q.teamId].count += 1;
    });
    
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [qualifyingResults]);

  // 3. Qualifying Winners (significantly above standings)
  const winners = useMemo(() => {
    return getQualifyingWinners(qualifyingResults, standings).slice(0, 3);
  }, [qualifyingResults, standings]);

  if (!qualifyingResults || qualifyingResults.length === 0) {
    return (
      <div className="border border-zinc-900 rounded-xl p-8 text-center bg-zinc-900/10 backdrop-blur-sm max-w-md mx-auto font-mono text-xs text-zinc-500">
        <AlertTriangle size={24} className="mx-auto text-yellow-500/80 mb-3 animate-pulse" />
        <h4 className="text-zinc-400 font-bold uppercase mb-1">DATA UNAVAILABLE</h4>
        <p>Qualifying details have not loaded or session has not occurred yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pole Sitter card */}
        {poleDetails && (
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono relative overflow-hidden backdrop-blur-sm flex flex-col justify-between h-[140px]">
            <div className="absolute top-0 left-0 bottom-0 w-[3px]" style={{ backgroundColor: poleDetails.pole.teamColor }} />
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>POLE POSITION</span>
              <Trophy size={12} className="text-yellow-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-white leading-none">
                {poleDetails.pole.firstName} {poleDetails.pole.lastName}
              </h4>
              <span className="text-[10px] font-bold uppercase mt-1 block" style={{ color: poleDetails.pole.teamColor }}>
                {poleDetails.pole.teamName}
              </span>
            </div>
            <div className="border-t border-zinc-900/60 pt-2 flex justify-between text-[10px] text-zinc-400">
              <span>TIME: <strong>{poleDetails.pole.q3 || poleDetails.pole.q2 || poleDetails.pole.q1}</strong></span>
              <span>GRID: P1</span>
            </div>
          </div>
        )}

        {/* Pole Gap Card */}
        {poleDetails && (
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono relative overflow-hidden backdrop-blur-sm flex flex-col justify-between h-[140px]">
            <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-red-600/30" />
            <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>Q3 GAP TO P2</span>
              <Zap size={12} className="text-red-500" />
            </div>
            <div>
              <h4 className="text-2xl font-black text-white leading-none">
                {poleDetails.gapText}
              </h4>
              <span className="text-[9px] text-zinc-500 block uppercase mt-1 leading-none">
                MARG. DIFFERENCE IN FINAL QUALIFYING STAGE
              </span>
            </div>
            <div className="border-t border-zinc-900/60 pt-2 text-[10px] text-zinc-400">
              <span>P2 TIME: <strong>{qualifyingResults[1]?.q3 || "N/A"}</strong></span>
            </div>
          </div>
        )}

        {/* Qualifying Winners card */}
        <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono relative overflow-hidden backdrop-blur-sm flex flex-col justify-between h-[140px]">
          <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-green-600/30" />
          <div className="flex justify-between items-center text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            <span>QUALIFYING WINNERS</span>
            <TrendingUp size={12} className="text-green-500" />
          </div>
          <div className="space-y-1">
            {winners.length > 0 ? (
              winners.map((w, idx) => (
                <div key={idx} className="flex justify-between text-[10.5px] items-center">
                  <span className="font-bold text-zinc-200 truncate max-w-[150px]">
                    {w.driver.lastName}
                  </span>
                  <span className="text-green-400 font-bold">
                    +{w.placesOutperformed} POS (P{w.qualifyingPosition})
                  </span>
                </div>
              ))
            ) : (
              <span className="text-[10px] text-zinc-500 italic block">
                No drivers significantly outperformed standings.
              </span>
            )}
          </div>
          <div className="border-t border-zinc-900/60 pt-2 text-[9px] text-zinc-500 leading-none">
            OUTPERFORMED SEASON CHAMPIONSHIP POSITION
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Q3 Top 10 times */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest">
            QUALIFYING LEADERBOARD (TOP 10)
          </h3>
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-zinc-400">
                <thead className="bg-zinc-950 text-zinc-500 uppercase tracking-widest text-[9px] font-bold border-b border-zinc-900">
                  <tr>
                    <th className="py-3 px-4 text-center w-12">POS</th>
                    <th className="py-3 px-4">DRIVER</th>
                    <th className="py-3 px-4">TEAM</th>
                    <th className="py-3 px-4 text-center w-24">Q1</th>
                    <th className="py-3 px-4 text-center w-24">Q2</th>
                    <th className="py-3 px-4 text-center w-24">Q3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {qualifyingResults.slice(0, 10).map((q) => (
                    <tr key={q.driverId} className="hover:bg-zinc-900/20 transition-colors">
                      <td className="py-3 px-4 text-center font-bold text-white">{q.position}</td>
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-3 rounded" style={{ backgroundColor: q.teamColor }} />
                        <span>{q.firstName} {q.lastName}</span>
                        <span className="text-[9px] text-zinc-500">#{q.number}</span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400 font-bold text-[10px] uppercase truncate max-w-[120px]" style={{ color: q.teamColor }}>
                        {q.teamName}
                      </td>
                      <td className="py-3 px-4 text-center text-zinc-500">{q.q1 || "—"}</td>
                      <td className="py-3 px-4 text-center text-zinc-500">{q.q2 || "—"}</td>
                      <td className="py-3 px-4 text-center text-red-500 font-bold">{q.q3 || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Team Distribution */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest">
            Q3 CONSTRUCTOR RATIO
          </h3>
          
          <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 font-mono space-y-4">
            <div className="text-[10px] text-zinc-500 font-bold uppercase leading-none pb-2 border-b border-zinc-900">
              REPRESENTATION IN TOP 10 GRID
            </div>
            
            <div className="space-y-4">
              {teamDistribution.map((t) => {
                const percent = (t.count / 10) * 100;
                return (
                  <div key={t.name} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-200 truncate uppercase text-[10px]" style={{ color: t.color }}>
                        {t.name}
                      </span>
                      <span className="text-zinc-400 text-[10px]">{t.count} / 10 Cars</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percent}%`, backgroundColor: t.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
