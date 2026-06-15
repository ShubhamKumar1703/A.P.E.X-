"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getRaceDetails, getRaceResults, getQualifyingResults } from "@/lib/services/f1/races";
import { getDriverStandings } from "@/lib/services/f1/standings";
import { getCircuitDetails } from "@/data/circuits-db";
import { F1Race, F1RaceResult, F1QualifyingResult, F1DriverStanding } from "@/lib/services/f1/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import CircuitIntelligenceCard from "@/components/race/CircuitIntelligenceCard";
import QualifyingAnalysis from "@/components/race/QualifyingAnalysis";
import RaceAnalysis from "@/components/race/RaceAnalysis";
import InsightsPanel from "@/components/race/InsightsPanel";
import RaceWeekendTimeline from "@/components/race/RaceWeekendTimeline";
import { getBiggestGainer } from "@/lib/analytics/position-gain";

import { 
  ArrowLeft, 
  Clock, 
  Trophy,
  AlertTriangle, 
  RefreshCw, 
  Compass, 
  Cpu
} from "lucide-react";

export default function RaceDetailsPage() {
  const params = useParams();
  const round = parseInt(params.round as string, 10);
  
  const [activeTab, setActiveTab] = useState<"overview" | "qualifying" | "race" | "insights">("overview");

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
    data: resultsData,
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
    data: qualifyingData,
    isLoading: qualifyingLoading,
    isError: qualifyingError,
    refetch: refetchQualifying
  } = useQuery<F1QualifyingResult[]>({
    queryKey: ["qualifyingResults", round],
    queryFn: () => getQualifyingResults(round),
    retry: false
  });

  // Query Driver Standings for Qualifying Winners / Insights
  const {
    data: standings = [],
    isLoading: standingsLoading,
    isError: standingsError,
    refetch: refetchStandings
  } = useQuery<F1DriverStanding[]>({
    queryKey: ["driverStandings"],
    queryFn: getDriverStandings,
    retry: false
  });

  const results = resultsData || [];
  const qualifying = qualifyingData || [];

  const isLoading = raceLoading || resultsLoading || qualifyingLoading || standingsLoading;
  const isError = raceError || resultsError || qualifyingError || standingsError;

  const handleRetry = () => {
    refetchRace();
    refetchResults();
    refetchQualifying();
    refetchStandings();
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

  // Podium Positions (Post-Race)
  const podium = hasResults ? results.slice(0, 3) : [];
  
  // Arrange podium: [2nd, 1st, 3rd]
  const podiumLayout = [];
  if (podium.length >= 2) podiumLayout.push(podium[1]); // 2nd
  if (podium.length >= 1) podiumLayout.push(podium[0]); // 1st
  if (podium.length >= 3) podiumLayout.push(podium[2]); // 3rd

  // Find driver with the fastest lap of the race
  const fastestLapDriver = hasResults ? results.find((r) => r.fastestLapRank === 1) : null;

  // Telemetry Driver of the Day calculation (biggest gainer)
  const dotdDriver = hasResults ? getBiggestGainer(results)?.driver : null;

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
        {(["overview", "qualifying", "race", "insights"] as const).map((tab) => (
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
          
          {/* Circuit Specs & Weekend Honors (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {hasResults && (
              <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 md:p-6 font-mono relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600/30" />
                <div className="flex items-center gap-2 mb-4 text-xs font-bold text-zinc-500 tracking-wider uppercase border-b border-zinc-900 pb-2">
                  <Trophy size={14} className="text-red-500" />
                  <span>WEEKEND HONORS & SUMMARY</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Race Winner */}
                  <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-lg p-3 flex items-center gap-3">
                    <span className="w-1.5 h-10 rounded shrink-0" style={{ backgroundColor: results[0]?.teamColor }} />
                    <div className="min-w-0">
                      <span className="text-[8px] text-zinc-500 block uppercase font-black tracking-wider">RACE WINNER</span>
                      <span className="text-xs font-black text-white block truncate leading-tight">
                        {results[0]?.firstName} {results[0]?.lastName}
                      </span>
                      <span className="text-[9px] text-zinc-400 block truncate leading-none uppercase mt-0.5" style={{ color: results[0]?.teamColor }}>
                        {results[0]?.teamName}
                      </span>
                    </div>
                  </div>

                  {/* Pole Sitter */}
                  <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-lg p-3 flex items-center gap-3">
                    <span className="w-1.5 h-10 rounded shrink-0" style={{ backgroundColor: qualifying[0]?.teamColor || "#71717A" }} />
                    <div className="min-w-0">
                      <span className="text-[8px] text-zinc-500 block uppercase font-black tracking-wider">POLE POSITION</span>
                      <span className="text-xs font-black text-white block truncate leading-tight">
                        {qualifying[0] ? `${qualifying[0].firstName} ${qualifying[0].lastName}` : "N/A"}
                      </span>
                      <span className="text-[9px] text-zinc-400 block truncate leading-none uppercase mt-0.5" style={{ color: qualifying[0]?.teamColor }}>
                        {qualifying[0] ? qualifying[0].teamName : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Fastest Lap */}
                  <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-lg p-3 flex items-center gap-3">
                    <span className="w-1.5 h-10 rounded shrink-0" style={{ backgroundColor: fastestLapDriver?.teamColor || "#71717A" }} />
                    <div className="min-w-0">
                      <span className="text-[8px] text-zinc-500 block uppercase font-black tracking-wider">FASTEST LAP</span>
                      <span className="text-xs font-black text-white block truncate leading-tight">
                        {fastestLapDriver ? `${fastestLapDriver.firstName} ${fastestLapDriver.lastName}` : "N/A"}
                      </span>
                      <span className="text-[9px] text-purple-400 block truncate font-bold leading-none mt-0.5">
                        {fastestLapDriver ? fastestLapDriver.fastestLapTime : "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Driver of the Day */}
                  <div className="bg-zinc-900/40 border border-zinc-900/60 rounded-lg p-3 flex items-center gap-3">
                    <span className="w-1.5 h-10 rounded shrink-0" style={{ backgroundColor: dotdDriver?.teamColor || "#71717A" }} />
                    <div className="min-w-0">
                      <span className="text-[8px] text-zinc-500 block uppercase font-black tracking-wider">DRIVER OF THE DAY</span>
                      <span className="text-xs font-black text-white block truncate leading-tight">
                        {dotdDriver ? `${dotdDriver.firstName} ${dotdDriver.lastName}` : "N/A"}
                      </span>
                      <span className="text-[9px] text-zinc-400 block truncate leading-none uppercase mt-0.5" style={{ color: dotdDriver?.teamColor }}>
                        {dotdDriver ? dotdDriver.teamName : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Podium Layout */}
                <div className="mt-6 border-t border-zinc-900 pt-5 space-y-3">
                  <span className="text-[10px] text-zinc-500 block uppercase font-black">PODIUM FINISHERS</span>
                  <div className="grid grid-cols-3 gap-3 items-end bg-zinc-950/40 border border-zinc-900 p-4 rounded-xl">
                    {podiumLayout.map((driver) => {
                      const colors = getPodiumColor(driver.position);
                      const height = driver.position === 1 ? "h-[120px]" : driver.position === 2 ? "h-[100px]" : "h-[90px]";
                      return (
                        <div
                          key={driver.driverId}
                          className={`relative rounded-lg border bg-gradient-to-t ${colors.bg} ${colors.border} ${height} flex flex-col justify-end p-3 shadow-xl ${
                            driver.position === 1 ? "scale-[1.02]" : ""
                          }`}
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg" style={{ backgroundColor: driver.teamColor }} />
                          <span className={`absolute top-2 right-2 w-4 h-4 rounded-full border flex items-center justify-center font-mono font-black text-[8px] ${colors.badge}`}>
                            {driver.position}
                          </span>
                          <div className="space-y-0.5 font-mono text-[10px] min-w-0">
                            <h4 className="font-bold text-white text-[11px] truncate leading-tight">
                              {driver.firstName[0]}. {driver.lastName}
                            </h4>
                            <span className="text-[8px] font-bold block truncate uppercase leading-none" style={{ color: driver.teamColor }}>
                              {driver.teamName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <CircuitIntelligenceCard circuit={circuitSpecs} />
            
            {/* AI Preview (Only if upcoming) */}
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

          {/* Timeline and other info (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <RaceWeekendTimeline race={race} />
          </div>

        </div>
      )}

      {activeTab === "qualifying" && (
        <QualifyingAnalysis qualifyingResults={qualifying} standings={standings} />
      )}

      {activeTab === "race" && (
        <RaceAnalysis results={results} />
      )}

      {activeTab === "insights" && (
        <InsightsPanel results={results} />
      )}
    </div>
  );
}
