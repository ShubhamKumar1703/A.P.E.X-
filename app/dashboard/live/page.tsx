"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

// Service Imports
import { getSessions, getSessionDetails } from "@/lib/services/openf1/sessions";
import { getDrivers } from "@/lib/services/openf1/drivers";
import { getLaps } from "@/lib/services/openf1/laps";
import { getStints } from "@/lib/services/openf1/stints";
import { getIntervals } from "@/lib/services/openf1/intervals";
import { getPitStops } from "@/lib/services/openf1/pitstops";
import { getRaceControlMessages } from "@/lib/services/openf1/racecontrol";
import { getCarData } from "@/lib/services/openf1/telemetry";

// State Compiler Imports
import { aggregateDriverStates } from "@/lib/live/driver-state";
import { sortTimingBoard, getSessionFastestLapDriver } from "@/lib/live/timing-state";
import { aggregateRaceState } from "@/lib/live/race-state";

// UI Panel Imports
import LiveTimingBoard from "@/components/race/LiveTimingBoard";
import TrackStatusPanel from "@/components/race/TrackStatusPanel";
import TyreAndStintPanel from "@/components/race/TyreAndStintPanel";
import TelemetryPreviewPanel from "@/components/race/TelemetryPreviewPanel";

import { Activity, AlertTriangle, Globe } from "lucide-react";

function LiveDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSessionKey = searchParams.get("session_key");

  const [selectedDriverNumber, setSelectedDriverNumber] = React.useState<number | null>(null);

  // 1. Fetch available sessions (previous/current year)
  const { data: sessions = [], isLoading: isSessionsLoading } = useQuery({
    queryKey: ["openf1Sessions"],
    queryFn: () => getSessions(),
    staleTime: 5 * 60 * 1000,
  });

  // Determine active or default fallback session key
  const resolvedSessionKey = React.useMemo(() => {
    if (urlSessionKey) {
      return parseInt(urlSessionKey, 10);
    }
    
    // Fallback: Check if there's a live session, else default to latest completed
    const now = new Date();
    const active = sessions.find((s) => {
      const start = new Date(s.date_start);
      const end = new Date(s.date_end);
      return now >= start && now <= end;
    });

    if (active) return active.session_key;
    return sessions.length > 0 ? sessions[sessions.length - 1].session_key : null;
  }, [sessions, urlSessionKey]);

  // 2. Fetch session details for the resolved session key
  const { data: sessionDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["sessionDetails", resolvedSessionKey],
    queryFn: () => getSessionDetails(resolvedSessionKey!),
    enabled: !!resolvedSessionKey,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Calculate polling intervals based on session timeframe
  const pollInterval = React.useMemo(() => {
    if (!sessionDetails) return false;
    const now = new Date();
    const start = new Date(sessionDetails.date_start);
    const end = new Date(sessionDetails.date_end);

    if (now >= start && now <= end) {
      return 3000; // Live session: poll every 3 seconds
    }
    if (now < start) {
      return 60000; // Upcoming: poll every 60 seconds
    }
    return false; // Historical: do not poll
  }, [sessionDetails]);

  // 3. Fetch session sub-streams with active poll intervals
  const { data: drivers = [] } = useQuery({
    queryKey: ["liveDrivers", resolvedSessionKey],
    queryFn: () => getDrivers(resolvedSessionKey!),
    enabled: !!resolvedSessionKey,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const { data: laps = [] } = useQuery({
    queryKey: ["liveLaps", resolvedSessionKey],
    queryFn: () => getLaps(resolvedSessionKey!),
    enabled: !!resolvedSessionKey,
    refetchInterval: pollInterval,
    staleTime: pollInterval || 5000,
    refetchOnWindowFocus: false,
  });

  const { data: stints = [] } = useQuery({
    queryKey: ["liveStints", resolvedSessionKey],
    queryFn: () => getStints(resolvedSessionKey!),
    enabled: !!resolvedSessionKey,
    refetchInterval: pollInterval,
    staleTime: pollInterval || 5000,
    refetchOnWindowFocus: false,
  });

  const { data: intervals = [] } = useQuery({
    queryKey: ["liveIntervals", resolvedSessionKey],
    queryFn: () => getIntervals(resolvedSessionKey!),
    enabled: !!resolvedSessionKey,
    refetchInterval: pollInterval,
    staleTime: pollInterval || 5000,
    refetchOnWindowFocus: false,
  });

  const { data: pitstops = [] } = useQuery({
    queryKey: ["livePitstops", resolvedSessionKey],
    queryFn: () => getPitStops(resolvedSessionKey!),
    enabled: !!resolvedSessionKey,
    refetchInterval: pollInterval,
    staleTime: pollInterval || 5000,
    refetchOnWindowFocus: false,
  });

  const { data: raceControlMessages = [] } = useQuery({
    queryKey: ["liveRaceControl", resolvedSessionKey],
    queryFn: () => getRaceControlMessages(resolvedSessionKey!),
    enabled: !!resolvedSessionKey,
    refetchInterval: pollInterval,
    staleTime: pollInterval || 5000,
    refetchOnWindowFocus: false,
  });

  // 4. Compile raw streams into domain aggregated states
  const aggregatedDrivers = React.useMemo(() => {
    if (!drivers || drivers.length === 0) return [];
    const states = aggregateDriverStates(drivers, laps, stints, intervals, pitstops);
    return sortTimingBoard(states);
  }, [drivers, laps, stints, intervals, pitstops]);

  const fastestDriverNumber = React.useMemo(() => {
    return getSessionFastestLapDriver(aggregatedDrivers);
  }, [aggregatedDrivers]);

  const raceState = React.useMemo(() => {
    return aggregateRaceState(raceControlMessages);
  }, [raceControlMessages]);

  // Handle default selection of leader driver if none selected yet
  React.useEffect(() => {
    if (selectedDriverNumber === null && aggregatedDrivers.length > 0) {
      setSelectedDriverNumber(aggregatedDrivers[0].driverNumber);
    }
  }, [aggregatedDrivers, selectedDriverNumber]);

  // 5. Fetch telemetry for selected driver
  const { data: telemetryData = [], isLoading: isTelemetryLoading } = useQuery({
    queryKey: ["liveTelemetry", resolvedSessionKey, selectedDriverNumber],
    queryFn: () => getCarData(resolvedSessionKey!, selectedDriverNumber!),
    enabled: !!resolvedSessionKey && !!selectedDriverNumber,
    refetchInterval: pollInterval,
    staleTime: pollInterval || 5000,
    refetchOnWindowFocus: false,
  });

  const selectedDriver = React.useMemo(() => {
    return aggregatedDrivers.find((d) => d.driverNumber === selectedDriverNumber) || null;
  }, [aggregatedDrivers, selectedDriverNumber]);

  // Loading indicator for basic session resolution
  const isInitialLoading = isSessionsLoading || (resolvedSessionKey && isDetailsLoading);

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-zinc-500 font-mono">
        <Activity className="animate-spin text-red-500" size={32} />
        <span className="text-xs uppercase font-black tracking-widest">
          CONNECTING TO PIT WALL SYSTEM...
        </span>
      </div>
    );
  }

  if (!resolvedSessionKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center space-y-4 font-mono">
        <AlertTriangle size={36} className="text-red-500" />
        <span className="text-sm font-bold text-white uppercase">
          NO SESSIONS RETRIEVED
        </span>
        <span className="text-xs text-zinc-500 max-w-sm">
          OpenF1 API endpoint returned an empty directory of session folders. Check upstream client state.
        </span>
      </div>
    );
  }

  // Determine session status description for telemetry hub tag
  const isSessionLive = pollInterval === 3000;
  const isSessionUpcoming = pollInterval === 60000;

  return (
    <div className="space-y-6">
      {/* Session Header / Control Panel */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isSessionLive
                  ? "bg-red-500 animate-ping"
                  : isSessionUpcoming
                  ? "bg-amber-500 animate-pulse"
                  : "bg-blue-500"
              }`}
            />
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              {isSessionLive
                ? "MISSION CONTROL // LIVE STREAMING"
                : isSessionUpcoming
                ? "MISSION CONTROL // READY TO START"
                : "MISSION CONTROL // TELEMETRY REPLAY"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
            {sessionDetails ? sessionDetails.circuit_short_name : "UNKNOWN"} &mdash;{" "}
            <span className="text-zinc-400">
              {sessionDetails ? sessionDetails.session_name : "Race"}
            </span>
          </h2>
          <div className="flex items-center gap-4 text-[10px] text-zinc-500 font-bold">
            <span className="flex items-center gap-1">
              <Globe size={11} className="text-zinc-600" />
              {sessionDetails?.location}, {sessionDetails?.year}
            </span>
            <span>
              SESSION KEY: <span className="text-zinc-300">{resolvedSessionKey}</span>
            </span>
          </div>
        </div>

        {/* Action Controls / Dropdown Selection */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-[10px] text-zinc-500 font-bold uppercase shrink-0 hidden sm:inline">
            SELECT SESSION:
          </span>
          <select
            value={resolvedSessionKey}
            onChange={(e) => {
              const key = e.target.value;
              router.push(`/dashboard/live?session_key=${key}`);
            }}
            className="bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold text-zinc-300 rounded-lg px-3 py-2 w-full md:w-auto focus:outline-none focus:border-red-500 transition-all cursor-pointer"
          >
            {sessions.map((s) => (
              <option key={s.session_key} value={s.session_key}>
                {s.year} {s.circuit_short_name} &mdash; {s.session_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section - Leaderboard (Timing Board) */}
        <div className="lg:col-span-5 h-[650px] flex flex-col">
          <LiveTimingBoard
            drivers={aggregatedDrivers}
            selectedDriverNumber={selectedDriverNumber}
            onSelectDriver={setSelectedDriverNumber}
            fastestDriverNumber={fastestDriverNumber}
          />
        </div>

        {/* Right Section - Track Status, Tyre Strategy, and Telemetry */}
        <div className="lg:col-span-7 flex flex-col gap-6 h-auto lg:h-[650px]">
          {/* Sub-grid: Track Status & Tyre strategy side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-auto lg:h-[310px] shrink-0">
            <TrackStatusPanel raceState={raceState} />
            <TyreAndStintPanel drivers={aggregatedDrivers} />
          </div>

          {/* Lower Box: Driver Telemetry Waveform Graph */}
          <div className="flex-1 min-h-[300px] lg:min-h-0">
            <TelemetryPreviewPanel
              driver={selectedDriver}
              telemetryData={telemetryData}
              isLoading={isTelemetryLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-zinc-500 font-mono">
          <Activity className="animate-spin text-red-500" size={32} />
          <span className="text-xs uppercase font-black tracking-widest">
            INITIALIZING MISSION CONTROL HUB...
          </span>
        </div>
      }
    >
      <LiveDashboardContent />
    </Suspense>
  );
}
