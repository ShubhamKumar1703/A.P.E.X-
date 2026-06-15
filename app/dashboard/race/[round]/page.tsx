"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getRaceDetails, getRaceResults, getQualifyingResults } from "@/lib/services/f1/races";
import { getCircuitDetails } from "@/data/circuits-db";
import { F1Race, F1RaceResult, F1QualifyingResult } from "@/lib/services/f1/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { 
  ArrowLeft, 
  Clock, 
  Flag, 
  Zap, 
  Award, 
  Trophy,
  AlertTriangle, 
  RefreshCw, 
  Compass, 
  Cpu
} from "lucide-react";

export default function RaceDetailsPage() {
  const params = useParams();
  const round = parseInt(params.round as string, 10);
  
  const [activeTab, setActiveTab] = useState<"overview" | "practice" | "qualifying" | "race">("overview");

  // Query Race Metadata
  const {
    data: race,
    isLoading: raceLoading,
    isError: raceError,
    refetch: refetchRace
  } = useQuery<F1Race | null>({
    queryKey: ["raceDetails", round],
    queryFn: () => getRaceDetails(round),
  });

  // Query Race Results
  const {
    data: results,
    isLoading: resultsLoading,
    isError: resultsError,
    refetch: refetchResults
  } = useQuery<F1RaceResult[]>({
    queryKey: ["raceResults", round],
    queryFn: () => getRaceResults(round),
    retry: false
  });

  // Query Qualifying Results
  const {
    data: qualifying,
    isLoading: qualifyingLoading,
    isError: qualifyingError,
    refetch: refetchQualifying
  } = useQuery<F1QualifyingResult[]>({
    queryKey: ["qualifyingResults", round],
    queryFn: () => getQualifyingResults(round),
    retry: false
  });

  const isLoading = raceLoading || resultsLoading || qualifyingLoading;
  const isError = raceError || resultsError || qualifyingError;

  const handleRetry = () => {
    refetchRace();
    refetchResults();
    refetchQualifying();
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-6 w-32 bg-zinc-900 rounded animate-pulse" />
        <div className="h-40 w-full bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LoadingSkeleton className="h-44" count={3} />
        </div>
      </div>
    );
  }

  if (isError || !race) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-500/20 flex items-center justify-center text-[#FF1801]">
          <AlertTriangle size={28} />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
            SESSION DATA FEED OFFLINE
          </h3>
          <p className="text-sm text-zinc-400">
            Unable to establish connection to the F1 API databases for Round {round}.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/dashboard/calendar"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold tracking-widest text-zinc-400 bg-zinc-950 border border-zinc-900 rounded-lg hover:border-zinc-850 transition-all uppercase"
          >
            <ArrowLeft size={14} />
            Back to Calendar
          </Link>
          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold tracking-widest text-white bg-[#FF1801] hover:bg-[#E01500] rounded-lg transition-all uppercase"
          >
            <RefreshCw size={14} />
            Retry Link
          </button>
        </div>
      </div>
    );
  }

  // Load Circuit Lookup Specs
  const circuitSpecs = getCircuitDetails(race.circuitId);

  // Determine if race has occurred based on results availability
  const hasResults = results && results.length > 0;
  const hasQuali = qualifying && qualifying.length > 0;

  // Podium Positions (Post-Race)
  const podium = hasResults ? results.slice(0, 3) : [];
  
  // Arrange podium: [2nd, 1st, 3rd]
  const podiumLayout = [];
  if (podium.length >= 2) podiumLayout.push(podium[1]); // 2nd
  if (podium.length >= 1) podiumLayout.push(podium[0]); // 1st
  if (podium.length >= 3) podiumLayout.push(podium[2]); // 3rd

  // Gained Places calculation for Driver of the Day (Post-Race)
  let dotdCandidate: F1RaceResult | null = null;
  if (hasResults) {
    let maxGained = -1;
    results.forEach((r) => {
      const gained = r.grid - r.position;
      if (gained > maxGained) {
        maxGained = gained;
        dotdCandidate = r;
      }
    });
  }

  const getPodiumColor = (pos: number) => {
    if (pos === 1) return { border: "border-[#FFD700]/30", text: "text-[#FFD700]", bg: "bg-[#FFD700]/5", badge: "bg-[#FFD700]/10 border-[#FFD700]/30" };
    if (pos === 2) return { border: "border-[#C0C0C0]/20", text: "text-[#C0C0C0]", bg: "bg-[#C0C0C0]/5", badge: "bg-[#C0C0C0]/10 border-[#C0C0C0]/20" };
    return { border: "border-[#CD7F32]/20", text: "text-[#CD7F32]", bg: "bg-[#CD7F32]/5", badge: "bg-[#CD7F32]/10 border-[#CD7F32]/20" };
  };

  return (
    <div className="space-y-10">
      {/* Back Link */}
      <div>
        <Link
          href="/dashboard/calendar"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-zinc-500 hover:text-white uppercase transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Calendar
        </Link>
      </div>

      {/* GP Spotlight Banner */}
      <div className="relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900/10 p-6 md:p-8 backdrop-blur-sm">
        <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-[radial-gradient(circle_at_right,_var(--tw-gradient-stops))] from-zinc-800/15 to-transparent pointer-events-none" />
        
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono text-[9px] font-bold uppercase tracking-widest">
              ROUND {race.round < 10 ? `0${race.round}` : race.round}
            </span>
            <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
              {race.locality}, {race.country}
            </span>
          </div>

          <h2 className="text-3xl font-black text-white leading-tight font-sans">
            {race.raceName}
          </h2>

          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Compass size={14} className="text-[#FF1801]" />
              {race.circuitName}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {race.date} @ {race.time ? race.time.slice(0, 5) : "14:00"} UTC
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Controller */}
      <div className="flex bg-zinc-900/60 p-1 rounded-lg border border-zinc-850/80 self-start w-fit">
        {(["overview", "practice", "qualifying", "race"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all ${
              activeTab === tab
                ? "bg-[#FF1801] text-white shadow-md"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Circuit Specs (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-zinc-900 bg-zinc-900/10 rounded-xl p-6 md:p-8 space-y-6">
              <h3 className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest">
                CIRCUIT CHARACTERISTICS
              </h3>
              
              <p className="text-sm text-zinc-300 leading-relaxed">
                {circuitSpecs.description}
              </p>

              {/* Grid Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-900 pt-6 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase">TRACK LENGTH</span>
                  <span className="text-white font-bold text-sm">{circuitSpecs.length}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase">TURN COUNT</span>
                  <span className="text-white font-bold text-sm">{circuitSpecs.turns} TURNS</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase">DRS ZONES</span>
                  <span className="text-white font-bold text-sm">{circuitSpecs.drsZones} ZONES</span>
                </div>
                <div>
                  <span className="text-[#FF1801] block text-[9px] uppercase font-bold">LAP RECORD</span>
                  <span className="text-white font-bold block">{circuitSpecs.lapRecord.time}</span>
                  <span className="text-[9px] text-zinc-500">{circuitSpecs.lapRecord.driver} ({circuitSpecs.lapRecord.year})</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4">
                {circuitSpecs.characteristics.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-850 font-mono text-[9px] uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Preview Section */}
            {!hasResults && (
              <div className="relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900/10 p-6 md:p-8 space-y-4">
                <div className="absolute top-0 right-0 p-4 font-mono text-[8px] text-zinc-600 font-black">
                  {"MODEL // QWEN_32B"}
                </div>
                <div className="flex items-center gap-2 text-[#FF1801]">
                  <Cpu size={18} />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
                    AI RACE ENGINEER PREVIEW
                  </h4>
                </div>
                <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                  &ldquo;Simulation profiles indicate high rear tyre lateral loads in turns. Pit strategy models forecast a 1-stop Medium-to-Hard crossover between Laps 18-22, assuming dry conditions. Awaiting live weather updates to finalize precipitation multipliers.&rdquo;
                </p>
              </div>
            )}
          </div>

          {/* Previous Winners (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="border border-zinc-900 bg-zinc-900/10 rounded-xl p-6 space-y-4">
              <h3 className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <Trophy size={14} className="text-[#FF1801]" />
                HISTORICAL WINNERS
              </h3>

              <div className="space-y-2.5 font-mono text-xs">
                {circuitSpecs.previousWinners.map((winner) => (
                  <div
                    key={winner.year}
                    className="flex items-center justify-between border-b border-zinc-950 pb-2.5 last:border-0 last:pb-0"
                  >
                    <div className="space-y-0.5">
                      <span className="text-zinc-300 font-bold">{winner.driver}</span>
                      <span className="text-[10px] text-zinc-500 block uppercase">{winner.team}</span>
                    </div>
                    <span className="text-[#FF1801] font-bold">{winner.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {activeTab === "practice" && (
        <div className="border border-dashed border-zinc-800 rounded-xl p-10 text-center space-y-4 bg-zinc-900/5 backdrop-blur-sm max-w-2xl mx-auto font-mono text-xs">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FF1801] mx-auto">
            <Zap size={18} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-tight">{"// PRACTICE TELEMETRY LINKED"}</h4>
            <p className="text-zinc-500 max-w-sm mx-auto leading-relaxed">
              Practice timing sheets are securely logged in the local mission control database. Live telemetry visualization boards will link in Phase 5.
            </p>
          </div>
        </div>
      )}

      {activeTab === "qualifying" && (
        <div>
          {hasQuali ? (
            <div className="bg-zinc-900/10 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs text-zinc-400">
                  <thead className="bg-zinc-950 text-zinc-500 uppercase tracking-widest text-[9px] font-bold border-b border-zinc-900">
                    <tr>
                      <th className="py-4 px-6 text-center w-16">POS</th>
                      <th className="py-4 px-4">DRIVER</th>
                      <th className="py-4 px-4">CONSTRUCTOR</th>
                      <th className="py-4 px-4 text-center w-28">Q1</th>
                      <th className="py-4 px-4 text-center w-28">Q2</th>
                      <th className="py-4 px-6 text-center w-28">Q3</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/60">
                    {qualifying.map((quali) => (
                      <tr key={quali.driverId} className="hover:bg-zinc-900/30 transition-colors">
                        <td className="py-4 px-6 text-center font-bold text-zinc-300">
                          {quali.position}
                        </td>
                        <td className="py-4 px-4 font-bold text-zinc-200">
                          <span className="text-zinc-500 text-[9px] mr-2 uppercase bg-zinc-950 border border-zinc-900 px-1 rounded">
                            {quali.number}
                          </span>
                          {quali.firstName} {quali.lastName}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="w-1 h-3 rounded-sm block shrink-0" style={{ backgroundColor: quali.teamColor }} />
                            <span>{quali.teamName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center text-zinc-400">{quali.q1 || "--"}</td>
                        <td className="py-4 px-4 text-center text-zinc-400">{quali.q2 || "--"}</td>
                        <td className="py-4 px-6 text-center font-bold text-white">{quali.q3 || "--"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border border-zinc-900 rounded-xl p-8 text-center bg-zinc-900/10 backdrop-blur-sm max-w-sm mx-auto font-mono text-xs text-zinc-500">
              <Flag size={20} className="mx-auto text-zinc-700 mb-3" />
              <h4 className="text-zinc-400 font-bold uppercase mb-1">QUALIFYING STANDBY</h4>
              <p>Qualifying session times will compile automatically on Saturday afternoon.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "race" && (
        <div className="space-y-10">
          {hasResults ? (
            <>
              {/* Podium & Driver of the Day row */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
                
                {/* Podium block (7 cols) */}
                <div className="lg:col-span-8 flex flex-col space-y-4">
                  <h3 className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest">
                    SESSION PODIUM
                  </h3>
                  
                  <div className="grid grid-cols-3 gap-4 items-end bg-zinc-950/40 border border-zinc-900 p-5 rounded-xl">
                    {podiumLayout.map((driver) => {
                      const colors = getPodiumColor(driver.position);
                      const height = driver.position === 1 ? "h-[160px]" : driver.position === 2 ? "h-[130px]" : "h-[115px]";
                      
                      return (
                        <div
                          key={driver.driverId}
                          className={`relative rounded-lg border bg-gradient-to-t ${colors.bg} ${colors.border} ${height} flex flex-col justify-end p-4 shadow-xl ${
                            driver.position === 1 ? "scale-[1.02]" : ""
                          }`}
                        >
                          {/* Color bar */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ backgroundColor: driver.teamColor }} />
                          
                          {/* Position */}
                          <span className={`absolute top-3 right-3 w-4.5 h-4.5 rounded-full border flex items-center justify-center font-mono font-black text-[9px] ${colors.badge}`}>
                            {driver.position}
                          </span>

                          <div className="space-y-1 font-mono text-xs">
                            <h4 className="font-bold text-white text-[11px] truncate leading-tight">
                              {driver.firstName[0]}. {driver.lastName}
                            </h4>
                            <span className="text-[8px] font-bold block truncate uppercase" style={{ color: driver.teamColor }}>
                              {driver.teamName}
                            </span>
                            <div className="flex justify-between border-t border-zinc-900 pt-1.5 text-[8px] text-zinc-500">
                              <span>PTS: <strong className="text-zinc-300">{driver.points}</strong></span>
                              <span>GRID: <strong className="text-zinc-300">{driver.grid}</strong></span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Driver of the Day block (4 cols) */}
                {dotdCandidate && (
                  <div className="lg:col-span-4 flex flex-col space-y-4">
                    <h3 className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest">
                      DRIVER OF THE DAY (TELEMETRY)
                    </h3>
                    
                    <div className="bg-gradient-to-br from-purple-950/15 via-zinc-950 to-zinc-950 border border-purple-500/20 rounded-xl p-5 relative overflow-hidden h-[160px] flex flex-col justify-between">
                      {/* Purple glow */}
                      <div className="absolute -inset-px bg-gradient-to-r from-purple-600/10 to-transparent blur-md pointer-events-none" />
                      
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                          <Award size={10} /> Maximum Gained
                        </span>
                        <span className="font-mono text-zinc-500 text-[10px]">
                          +{(dotdCandidate as F1RaceResult).grid - (dotdCandidate as F1RaceResult).position} POSITIONS
                        </span>
                      </div>

                      <div className="space-y-1 mt-4">
                        <h4 className="text-base font-black text-white font-mono leading-none">
                          {(dotdCandidate as F1RaceResult).firstName} {(dotdCandidate as F1RaceResult).lastName}
                        </h4>
                        <span className="text-xs font-mono font-bold block uppercase" style={{ color: (dotdCandidate as F1RaceResult).teamColor }}>
                          {(dotdCandidate as F1RaceResult).teamName}
                        </span>
                      </div>

                      <div className="border-t border-zinc-900 pt-2 flex justify-between font-mono text-[9px] text-zinc-500">
                        <span>STARTED: P{(dotdCandidate as F1RaceResult).grid}</span>
                        <span>FINISHED: P{(dotdCandidate as F1RaceResult).position}</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Race standings Table */}
              <div className="bg-zinc-900/10 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs text-zinc-400">
                    <thead className="bg-zinc-950 text-zinc-500 uppercase tracking-widest text-[9px] font-bold border-b border-zinc-900">
                      <tr>
                        <th className="py-4 px-6 text-center w-16">POS</th>
                        <th className="py-4 px-4">DRIVER</th>
                        <th className="py-4 px-4">CONSTRUCTOR</th>
                        <th className="py-4 px-4 text-center w-20">GRID</th>
                        <th className="py-4 px-4 text-center w-20">LAPS</th>
                        <th className="py-4 px-4 text-center w-24">STATUS</th>
                        <th className="py-4 px-4 text-center w-28">FAST LAP</th>
                        <th className="py-4 px-6 text-right w-24">PTS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900/60">
                      {results.map((r) => (
                        <tr key={r.driverId} className="hover:bg-zinc-900/30 transition-colors group">
                          <td className="py-4 px-6 text-center font-bold text-zinc-300">
                            {r.position}
                          </td>
                          <td className="py-4 px-4 font-bold text-zinc-200 group-hover:text-white transition-colors">
                            <span className="text-zinc-500 text-[9px] mr-2 uppercase bg-zinc-950 border border-zinc-900 px-1 rounded">
                              {r.number}
                            </span>
                            {r.firstName} {r.lastName}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="w-1 h-3 rounded-sm block shrink-0" style={{ backgroundColor: r.teamColor }} />
                              <span>{r.teamName}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center text-zinc-400">{r.grid}</td>
                          <td className="py-4 px-4 text-center text-zinc-400">{r.laps}</td>
                          <td className="py-4 px-4 text-center text-zinc-400">{r.status}</td>
                          <td className="py-4 px-4 text-center font-bold text-zinc-300">
                            {r.fastestLapTime || "--"}
                          </td>
                          <td className="py-4 px-6 text-right font-black text-white text-sm">
                            {r.points > 0 ? `+${r.points}` : "0"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="border border-zinc-900 rounded-xl p-8 text-center bg-zinc-900/10 backdrop-blur-sm max-w-sm mx-auto font-mono text-xs text-zinc-500">
              <Flag size={20} className="mx-auto text-zinc-700 mb-3" />
              <h4 className="text-zinc-400 font-bold uppercase mb-1">RACE DAY STANDBY</h4>
              <p>Grand Prix standings will populate instantly upon checkers flag deployment.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
