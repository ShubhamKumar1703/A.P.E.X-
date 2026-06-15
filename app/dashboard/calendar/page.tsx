"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getCurrentCalendar } from "@/lib/services/f1/races";
import { F1Race } from "@/lib/services/f1/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { 
  MapPin, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw
} from "lucide-react";

export default function CalendarPage() {
  const { 
    data: races, 
    isLoading, 
    isError, 
    error,
    refetch,
    isRefetching
  } = useQuery<F1Race[]>({
    queryKey: ["racesCalendar"],
    queryFn: getCurrentCalendar,
    staleTime: 10 * 60 * 1000, // 10 minutes cache freshness
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-10 w-64 bg-zinc-900 rounded animate-pulse" />
        <div className="h-44 w-full bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton className="h-40" count={6} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-500/20 flex items-center justify-center text-[#FF1801]">
          <AlertTriangle size={28} />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
            CALENDAR FEED OFFLINE
          </h3>
          <p className="text-sm text-zinc-400">
            {error instanceof Error ? error.message : "Unable to retrieve the 2026 race calendar from the F1 API."}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold tracking-widest text-white bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all uppercase"
        >
          <RefreshCw size={14} className={isRefetching ? "animate-spin" : ""} />
          {isRefetching ? "Retrying..." : "Retry Connection"}
        </button>
      </div>
    );
  }

  const raceList = races || [];

  // Determine the next upcoming or active race
  const activeOrUpcoming = raceList.filter(
    (r) => r.status === "CURRENT_WEEKEND" || r.status === "UPCOMING"
  );
  
  const nextRace = activeOrUpcoming.length > 0 ? activeOrUpcoming[0] : null;

  // Format date utility
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF1801] uppercase">
            Season Schedule // 2026
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
            Championship Calendar
          </h2>
        </div>
        <div className="text-xs font-mono text-zinc-500">
          COMPLETED: <span className="text-zinc-300 font-bold">{raceList.filter(r => r.status === "COMPLETED").length}</span> / {raceList.length} ROUNDS
        </div>
      </div>

      {/* Featured: Next Upcoming Race */}
      {nextRace && (
        <Link
          href={`/dashboard/race/${nextRace.round}`}
          className="block relative overflow-hidden rounded-xl border border-[#FF1801]/30 bg-gradient-to-r from-[#FF1801]/10 via-zinc-950 to-zinc-950 p-6 md:p-8 shadow-2xl hover:border-[#FF1801]/50 hover:scale-[1.005] transition-all duration-300 group/spotlight cursor-pointer"
        >
          {/* Neon track glow effect */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial-gradient from-[#FF1801]/5 to-transparent blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* Spotlight Content */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#FF1801] text-white font-mono text-[9px] font-black uppercase tracking-wider animate-pulse">
                <Clock size={10} />
                <span>Next Grand Prix</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-widest block">
                  ROUND {nextRace.round < 10 ? `0${nextRace.round}` : nextRace.round}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {nextRace.raceName}
                </h3>
                <p className="text-sm text-zinc-400 flex items-center gap-2">
                  <MapPin size={14} className="text-[#FF1801]" />
                  {nextRace.circuitName} &mdash; <span className="font-bold text-zinc-200">{nextRace.locality}, {nextRace.country}</span>
                </p>
              </div>

              {/* Event Dates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-900 pt-5 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase">QUALIFYING</span>
                  <span className="text-zinc-300 font-bold">{nextRace.qualifyingDate ? formatDate(nextRace.qualifyingDate) : "TBD"}</span>
                </div>
                <div>
                  <span className="text-[#FF1801] block text-[9px] uppercase font-bold">RACE DAY</span>
                  <span className="text-white font-bold">{formatDate(nextRace.date)}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase">LOCAL TIME</span>
                  <span className="text-zinc-300 font-bold">{nextRace.time ? nextRace.time.slice(0, 5) : "14:00"} UTC</span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase">STATUS</span>
                  <span className="text-emerald-500 font-bold uppercase tracking-wider">ON SCHEDULE</span>
                </div>
              </div>
            </div>

            {/* Track Info Badge / Graphic Placeholder */}
            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <div className="border border-zinc-800 bg-zinc-900/60 p-4 rounded-xl font-mono text-xs text-zinc-400 w-full max-w-[280px] space-y-3">
                <span className="text-[#FF1801] font-bold block uppercase tracking-widest text-[9px]">
                  {"// TRACK SPECS"}
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between border-b border-zinc-950 pb-1">
                    <span>CIRCUIT ID:</span>
                    <span className="text-zinc-200 font-bold uppercase">{nextRace.circuitId}</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-950 pb-1">
                    <span>SECTOR PING:</span>
                    <span className="text-emerald-500 font-bold">8ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TELEMETRY:</span>
                    <span className="text-zinc-200 font-bold">READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid: All Races */}
      <div className="space-y-6">
        <h3 className="text-xs font-mono text-zinc-500 font-bold uppercase tracking-widest">
          COMPLETE CHAMPIONSHIP TIMELINE
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {raceList.map((race) => {
            const isCompleted = race.status === "COMPLETED";
            const isCurrent = race.status === "CURRENT_WEEKEND";
            const isNext = nextRace?.round === race.round;

            return (
              <Link
                key={race.round}
                href={`/dashboard/race/${race.round}`}
                className={`relative rounded-xl border p-5 font-mono text-xs flex flex-col justify-between transition-all duration-300 bg-zinc-900/20 backdrop-blur-sm hover:scale-[1.01] hover:border-zinc-700 group/card cursor-pointer ${
                  isNext
                    ? "border-[#FF1801] shadow-lg shadow-[#FF1801]/5"
                    : isCurrent
                    ? "border-emerald-500/50 shadow-md shadow-emerald-500/5"
                    : isCompleted
                    ? "border-zinc-900/80 opacity-60 hover:opacity-100"
                    : "border-zinc-850 hover:border-zinc-700"
                }`}
              >
                {/* Header Tag */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">
                    ROUND {race.round < 10 ? `0${race.round}` : race.round}
                  </span>
                  
                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[9px] text-zinc-400 font-bold bg-zinc-900/80 px-2 py-0.5 rounded border border-zinc-800 uppercase">
                      <CheckCircle2 size={10} className="text-zinc-500" /> Completed
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-1.5 text-[9px] text-emerald-500 font-bold bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Active GP
                    </span>
                  ) : isNext ? (
                    <span className="flex items-center gap-1 text-[9px] text-[#FF1801] font-bold bg-[#FF1801]/10 px-2 py-0.5 rounded border border-[#FF1801]/25 uppercase">
                      Next Up
                    </span>
                  ) : (
                    <span className="text-[9px] text-zinc-600 font-bold bg-zinc-950/60 px-2 py-0.5 rounded border border-zinc-900 uppercase">
                      Scheduled
                    </span>
                  )}
                </div>

                {/* Race Details */}
                <div className="space-y-3 mb-6">
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 line-clamp-1">
                      {race.raceName.replace("Grand Prix", "")}GP
                    </h4>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                      {race.circuitName}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                    <MapPin size={12} className="text-zinc-600 shrink-0" />
                    <span>{race.locality}, {race.country}</span>
                  </div>
                </div>

                {/* Footer specs */}
                <div className="border-t border-zinc-950 pt-3 flex items-center justify-between text-[10px] text-zinc-500">
                  <span className="font-bold text-zinc-400">{formatDate(race.date)}</span>
                  <span>{race.time ? race.time.slice(0, 5) : "14:00"} UTC</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
