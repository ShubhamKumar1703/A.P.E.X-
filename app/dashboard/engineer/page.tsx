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
import { getDriverStandings, getConstructorStandings } from "@/lib/services/f1/standings";

// State Compiler Imports
import { aggregateDriverStates } from "@/lib/live/driver-state";
import { sortTimingBoard, getSessionFastestLapDriver } from "@/lib/live/timing-state";
import { aggregateRaceState } from "@/lib/live/race-state";
import { parseGapToSeconds } from "@/lib/analytics/race-insights";
import { formatStandingsContext } from "@/lib/ai/tools/standings-tool";

// UI Presentational Imports
import { ChatWindow } from "@/components/ai/ChatWindow";
import { StrategyInsightPanel } from "@/components/ai/StrategyInsightPanel";
import { 
  Activity, 
  AlertTriangle, 
  Flag, 
  Play, 
  Trophy, 
  Compass 
} from "lucide-react";
import { CompactSessionContext, CompactDriverContext, CompactAnalyticsContext, AICompileContext } from "@/lib/ai/types";

// Weather & Coordinate system Imports
import { getCircuitCoordinates } from "@/data/circuit-coordinates";
import { fetchCircuitWeather } from "@/lib/services/weather/openmeteo";
import { WeatherIntelligenceCard } from "@/components/ai/WeatherIntelligenceCard";

const CIRCUIT_LAPS: Record<string, number> = {
  catalunya: 66,
  barcelona: 66,
  albert_park: 58,
  melbourne: 58,
  bahrain: 57,
  sakhir: 57,
  jeddah: 50,
  suzuka: 53,
  shanghai: 56,
  miami: 57,
  imola: 63,
  monaco: 78,
  monte_carlo: 78,
  villeneuve: 70,
  montreal: 70,
  red_bull_ring: 71,
  spielberg: 71,
  silverstone: 52,
  hungaroring: 70,
  budapest: 70,
  spa: 44,
  zandvoort: 72,
  monza: 53,
  baku: 51,
  marina_bay: 62,
  singapore: 62,
  americas: 56,
  austin: 56,
  rodriguez: 71,
  mexico: 71,
  interlagos: 71,
  sao_paulo: 71,
  vegas: 50,
  las_vegas: 50,
  losail: 57,
  qatar: 57,
  yas_marina: 58,
  abu_dhabi: 58
};

function getCountryName(circuitShortName: string, location: string): string {
  const normCircuit = circuitShortName.toLowerCase();
  const normLoc = location.toLowerCase();

  if (normCircuit.includes("catalunya") || normLoc.includes("barcelona")) return "Spain";
  if (normCircuit.includes("villeneuve") || normLoc.includes("montreal")) return "Canada";
  if (normCircuit.includes("monaco") || normLoc.includes("monte")) return "Monaco";
  if (normCircuit.includes("silverstone")) return "Great Britain";
  if (normCircuit.includes("spa")) return "Belgium";
  if (normCircuit.includes("monza")) return "Italy";
  if (normCircuit.includes("marina bay") || normLoc.includes("singapore")) return "Singapore";
  if (normCircuit.includes("albert park") || normLoc.includes("melbourne")) return "Australia";
  if (normCircuit.includes("bahrain") || normLoc.includes("sakhir")) return "Bahrain";
  if (normCircuit.includes("jeddah")) return "Saudi Arabia";
  if (normCircuit.includes("suzuka")) return "Japan";
  if (normCircuit.includes("shanghai")) return "China";
  if (normCircuit.includes("miami")) return "Miami (USA)";
  if (normCircuit.includes("imola")) return "Emilia Romagna";
  if (normCircuit.includes("red bull ring") || normLoc.includes("spielberg")) return "Austria";
  if (normCircuit.includes("hungaroring") || normLoc.includes("budapest")) return "Hungary";
  if (normCircuit.includes("zandvoort")) return "Netherlands";
  if (normCircuit.includes("baku")) return "Azerbaijan";
  if (normCircuit.includes("americas") || normLoc.includes("austin")) return "United States";
  if (normCircuit.includes("rodriguez") || normLoc.includes("mexico")) return "Mexico";
  if (normCircuit.includes("interlagos") || normLoc.includes("sao paulo")) return "Brazil";
  if (normCircuit.includes("las vegas") || normLoc.includes("vegas")) return "Las Vegas (USA)";
  if (normCircuit.includes("losail") || normLoc.includes("qatar")) return "Qatar";
  if (normCircuit.includes("yas marina") || normLoc.includes("abu dhabi")) return "Abu Dhabi";

  return circuitShortName;
}

function EngineerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSessionKey = searchParams.get("session_key");

  // 1. Fetch available sessions
  const { data: sessions = [], isLoading: isSessionsLoading } = useQuery({
    queryKey: ["openf1Sessions"],
    queryFn: () => getSessions(),
    staleTime: 5 * 60 * 1000,
  });

  // Determine active session key
  const resolvedSessionKey = React.useMemo(() => {
    if (urlSessionKey) {
      return parseInt(urlSessionKey, 10);
    }
    const now = new Date();
    const active = sessions.find((s) => {
      const start = new Date(s.date_start);
      const end = new Date(s.date_end);
      return now >= start && now <= end;
    });

    if (active) return active.session_key;
    return sessions.length > 0 ? sessions[sessions.length - 1].session_key : null;
  }, [sessions, urlSessionKey]);

  // 2. Fetch session details
  const { data: sessionDetails, isLoading: isDetailsLoading } = useQuery({
    queryKey: ["sessionDetails", resolvedSessionKey],
    queryFn: () => getSessionDetails(resolvedSessionKey!),
    enabled: !!resolvedSessionKey,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Polling intervals based on session timeframe
  const pollInterval = React.useMemo(() => {
    if (!sessionDetails) return false;
    const now = new Date();
    const start = new Date(sessionDetails.date_start);
    const end = new Date(sessionDetails.date_end);

    if (now >= start && now <= end) {
      return 3000; // Live session: poll every 3 seconds
    }
    return false; // Historical: do not poll
  }, [sessionDetails]);

  // Resolve circuit coordinates
  const coordinates = React.useMemo(() => {
    if (!sessionDetails) return null;
    return getCircuitCoordinates(sessionDetails.circuit_short_name, sessionDetails.location);
  }, [sessionDetails]);

  // Fetch weather conditions from Open-Meteo
  const { data: weatherData = null, isLoading: isWeatherLoading } = useQuery({
    queryKey: ["circuitWeather", resolvedSessionKey, coordinates?.latitude, coordinates?.longitude],
    queryFn: () => fetchCircuitWeather(coordinates!.latitude, coordinates!.longitude),
    enabled: !!resolvedSessionKey && !!coordinates,
    staleTime: 5 * 60 * 1000,
    refetchInterval: pollInterval ? 5 * 60 * 1000 : false,
    refetchOnWindowFocus: false,
  });

  // 3. Fetch sub-streams
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

  // 4. Fetch seasonal standings for LLM context
  const { data: driverStandings = [] } = useQuery({
    queryKey: ["driverStandings"],
    queryFn: () => getDriverStandings(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: constructorStandings = [] } = useQuery({
    queryKey: ["constructorStandings"],
    queryFn: () => getConstructorStandings(),
    staleTime: 10 * 60 * 1000,
  });

  // Compile driver state timing board
  const aggregatedDrivers = React.useMemo(() => {
    if (!drivers || drivers.length === 0) return [];
    const states = aggregateDriverStates(drivers, laps, stints, intervals, pitstops);
    return sortTimingBoard(states);
  }, [drivers, laps, stints, intervals, pitstops]);

  // Retrieve fastest lap driver details
  const fastestDriverNumber = React.useMemo(() => {
    return getSessionFastestLapDriver(aggregatedDrivers);
  }, [aggregatedDrivers]);

  const fastestLapString = React.useMemo(() => {
    if (!fastestDriverNumber) return "N/A";
    const driver = aggregatedDrivers.find(d => d.driverNumber === fastestDriverNumber);
    return driver ? `${driver.acronym} (${driver.bestLapTime})` : "N/A";
  }, [fastestDriverNumber, aggregatedDrivers]);

  // Aggregate race control alerts
  const raceState = React.useMemo(() => {
    const state = aggregateRaceState(raceControlMessages);
    if (!pollInterval) {
      // Historical session: override flag to CLEAR and alert to NONE for completed races
      return {
        ...state,
        flagStatus: "CLEAR" as const,
        trackAlert: "NONE" as const
      };
    }
    return state;
  }, [raceControlMessages, pollInterval]);

  // Build the compiled, compressed context to feed to LLM
  const compiledContext = React.useMemo((): AICompileContext => {
    // Current lap (max lap of the session leader or standard laps)
    const currentLap = laps.length > 0 ? Math.max(...laps.map(l => l.lap_number)) : 0;
    
    // Resolve circuit laps from map or default to 57
    const circuitKey = sessionDetails?.circuit_short_name.toLowerCase().replace(/[\s-]/g, "_") || "";
    const resolvedLapsFromMap = CIRCUIT_LAPS[circuitKey] || 57;
    const totalLapsExpected = sessionDetails?.session_name.toLowerCase().includes("sprint") ? 24 : resolvedLapsFromMap;
    // If completed race (historical) and laps have loaded, total laps equals the max lap completed
    const totalLaps = !pollInterval && currentLap > 0 ? Math.max(totalLapsExpected, currentLap) : totalLapsExpected;

    const sessionCtx: CompactSessionContext = {
      sessionKey: resolvedSessionKey || 0,
      sessionName: sessionDetails?.session_name || "Race",
      circuitName: sessionDetails?.circuit_short_name || "Unknown",
      location: sessionDetails?.location || "Unknown",
      year: sessionDetails?.year || 2026,
      currentLap,
      totalLaps,
      flagStatus: raceState.flagStatus,
      trackAlert: raceState.trackAlert,
      latestMessage: raceState.latestMessage
    };

    const driversCtx: CompactDriverContext[] = aggregatedDrivers.map(d => ({
      driverNumber: d.driverNumber,
      acronym: d.acronym,
      fullName: d.fullName,
      teamName: d.teamName,
      position: d.position,
      gapToLeader: d.gapToLeader,
      intervalAhead: d.intervalAhead,
      tyreCompound: d.tyreCompound,
      tyreAge: d.tyreAge,
      pitStopsCount: d.pitStopsCount,
      lastLapTime: d.lastLapTime,
      bestLapTime: d.bestLapTime,
      inPitLane: d.inPitLane
    }));

    // Calculate live analytics context
    let closestBattle: CompactAnalyticsContext["closestBattle"] = null;
    let minGap = Infinity;

    for (let i = 1; i < aggregatedDrivers.length; i++) {
      const p = aggregatedDrivers[i];
      const t = aggregatedDrivers[i - 1];
      if (p.gapToLeader === "DNF" || t.gapToLeader === "DNF") continue;

      const gap = parseGapToSeconds(p.intervalAhead);
      if (gap !== null && gap > 0 && gap < minGap) {
        minGap = gap;
        closestBattle = {
          driverA: t.acronym,
          driverB: p.acronym,
          gapSeconds: parseFloat(gap.toFixed(3))
        };
      }
    }

    // Positions gained relative to standings as biggest gainer heuristic
    const standingsPositionMap = new Map<string, number>();
    driverStandings.forEach((s) => {
      standingsPositionMap.set(s.code.toLowerCase(), s.position);
    });

    let biggestGainer: CompactAnalyticsContext["biggestGainer"] = null;
    let maxGain = -99;

    aggregatedDrivers.forEach((d) => {
      if (d.gapToLeader === "DNF") return;
      const standPos = standingsPositionMap.get(d.acronym.toLowerCase());
      if (standPos) {
        const gain = standPos - d.position; // positive: finished higher than standing
        if (gain > maxGain) {
          maxGain = gain;
          biggestGainer = {
            driverName: d.fullName,
            gain,
            from: standPos,
            to: d.position
          };
        }
      }
    });

    const analyticsCtx: CompactAnalyticsContext = {
      closestBattle,
      biggestGainer: maxGain > 0 ? biggestGainer : null
    };

    return {
      session: sessionCtx,
      drivers: driversCtx,
      analytics: analyticsCtx,
      standingsSummary: formatStandingsContext(driverStandings, constructorStandings),
      weather: weatherData
    };
  }, [resolvedSessionKey, sessionDetails, laps, raceState, aggregatedDrivers, driverStandings, constructorStandings, pollInterval, weatherData]);

  // Loading state
  const isInitialLoading = isSessionsLoading || (resolvedSessionKey && isDetailsLoading);

  if (isInitialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-zinc-550 font-mono">
        <Activity className="animate-spin text-[#FF1801]" size={32} />
        <span className="text-xs uppercase font-black tracking-widest">
          CONNECTING PIT-WALL STRATEGY ANALYZERS...
        </span>
      </div>
    );
  }

  if (!resolvedSessionKey) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center space-y-4 font-mono">
        <AlertTriangle size={36} className="text-[#FF1801]" />
        <span className="text-sm font-bold text-white uppercase">
          NO SESSION LOADED
        </span>
        <span className="text-xs text-zinc-500 max-w-sm">
          Could not locate any active or historical F1 sessions. Please check connectivity to api.openf1.org.
        </span>
      </div>
    );
  }

  // Find leader
  const leaderDriver = aggregatedDrivers.find(d => d.position === 1);
  const leaderLabel = leaderDriver ? `${leaderDriver.acronym} (#${leaderDriver.driverNumber})` : "N/A";

  // Compute max lap
  const currentLap = compiledContext.session.currentLap;
  const totalLaps = compiledContext.session.totalLaps;

  // Flag colors mapping
  const flagColorClasses: Record<string, string> = {
    GREEN: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    YELLOW: "bg-amber-500/15 border-amber-500/30 text-amber-400 animate-pulse",
    RED: "bg-red-500/15 border-red-500/30 text-red-500 animate-ping",
    BLUE: "bg-blue-500/15 border-blue-500/30 text-blue-400",
    CLEAR: "bg-zinc-900 border-zinc-800 text-zinc-400"
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}} />
      {/* Cockpit Status Header */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                pollInterval
                  ? "bg-red-500 animate-ping"
                  : "bg-blue-500"
              }`}
            />
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              {pollInterval
                ? "MISSION CONTROL // LIVE STRATEGY FEED"
                : "MISSION CONTROL // SESSION COMPLETED"}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
            {sessionDetails ? getCountryName(sessionDetails.circuit_short_name, sessionDetails.location) : "UNKNOWN"} &mdash;{" "}
            <span className="text-zinc-400">
              {sessionDetails ? sessionDetails.session_name : "Race"}
            </span>
          </h2>
          <div className="text-[10px] text-zinc-500 font-bold flex gap-4">
            <span>LOCATION: {sessionDetails?.location}</span>
            <span>KEY: <span className="text-zinc-350">{resolvedSessionKey}</span></span>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-[10px] text-zinc-500 font-bold uppercase shrink-0 hidden sm:inline">
            SELECT WEEKEND:
          </span>
          <select
            value={resolvedSessionKey}
            onChange={(e) => {
              const key = e.target.value;
              router.push(`/dashboard/engineer?session_key=${key}`);
            }}
            className="bg-zinc-950 border border-zinc-800 text-xs font-mono font-bold text-zinc-300 rounded-lg px-3 py-2 w-full md:w-auto focus:outline-none focus:border-[#FF1801] transition-all cursor-pointer"
          >
            {sessions.map((s) => (
              <option key={s.session_key} value={s.session_key}>
                {s.year} {getCountryName(s.circuit_short_name, s.location)} &mdash; {s.session_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 3-Column Cockpit Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Race Context */}
        <div className="lg:col-span-3 bg-zinc-950/20 border border-zinc-900 rounded-xl p-4 flex flex-col justify-between space-y-4 font-mono lg:h-[650px]">
          <div className="space-y-4">
            {/* Panel Title */}
            <div className="border-b border-zinc-900 pb-2">
              <span className="text-[10px] font-black text-[#FF1801] tracking-widest uppercase flex items-center gap-1.5">
                <Compass size={12} />
                Telemetry Summary
              </span>
            </div>

            {/* Timing lap readout */}
            <div className="bg-zinc-950/60 border border-zinc-900 rounded-lg p-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Race Lap Counter
                </span>
                {!pollInterval && (
                  <span className="text-[8px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-black tracking-wider uppercase font-mono">
                    COMPLETED
                  </span>
                )}
              </div>
              <div className="text-xl font-black text-white">
                {currentLap > 0 ? `LAP ${currentLap} / ${totalLaps}` : "FORMATION LAP"}
              </div>
              <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-[#FF1801] h-1.5 transition-all duration-500" 
                  style={{ width: `${Math.min((currentLap / totalLaps) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Dynamic context outputs */}
            <div className="space-y-2.5 text-xs">
              {/* Leader */}
              <div className="flex justify-between items-center py-1 border-b border-zinc-900/60">
                <span className="text-zinc-500 flex items-center gap-1">
                  <Trophy size={11} className="text-zinc-650" />
                  LEADER:
                </span>
                <span className="text-white font-bold">{leaderLabel}</span>
              </div>

              {/* Fastest Lap */}
              <div className="flex justify-between items-center py-1 border-b border-zinc-900/60">
                <span className="text-zinc-500 flex items-center gap-1">
                  <Play size={11} className="text-zinc-650 rotate-90" style={{ transform: 'rotate(0deg)' }} />
                  FASTEST LAP:
                </span>
                <span className="text-purple-400 font-bold">{fastestLapString}</span>
              </div>

              {/* Track Flag */}
              <div className="flex justify-between items-center py-1 border-b border-zinc-900/60">
                <span className="text-zinc-500 flex items-center gap-1">
                  <Flag size={11} className="text-zinc-650" />
                  FLAG STATUS:
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${flagColorClasses[raceState.flagStatus] || flagColorClasses.CLEAR}`}>
                  {raceState.flagStatus}
                </span>
              </div>

              {/* Session status alert */}
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500 flex items-center gap-1">
                  <Compass size={11} className="text-zinc-650" />
                  ALERT CODE:
                </span>
                <span className={`text-[10px] font-bold uppercase ${raceState.trackAlert !== "NONE" ? "text-amber-400 animate-pulse" : "text-zinc-500"}`}>
                  {raceState.trackAlert}
                </span>
              </div>
            </div>

            {/* Weather Intelligence Card */}
            <WeatherIntelligenceCard weather={weatherData} isLoading={isWeatherLoading} />
          </div>

          {/* Session metadata panel footer */}
          <div className="pt-2 border-t border-zinc-900 text-[9px] text-zinc-600 flex justify-between">
            <span>REFRESH STATE: {pollInterval ? "3S INTERVAL" : "HISTORICAL"}</span>
            <span>OK 200</span>
          </div>
        </div>

        {/* Center Panel: Chat Interface */}
        <div className="lg:col-span-6 flex flex-col h-[500px] lg:h-[650px]">
          <ChatWindow
            key={resolvedSessionKey || "default"}
            sessionContext={compiledContext.session}
            driversContext={compiledContext.drivers}
            analyticsContext={compiledContext.analytics}
            standingsSummary={compiledContext.standingsSummary}
          />
        </div>

        {/* Right Panel: Strategy Insights */}
        <div className="lg:col-span-3 flex flex-col h-[500px] lg:h-[650px]">
          <StrategyInsightPanel drivers={aggregatedDrivers} weather={weatherData} />
        </div>

      </div>
    </div>
  );
}

export default function EngineerDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-zinc-550 font-mono">
          <Activity className="animate-spin text-[#FF1801]" size={32} />
          <span className="text-xs uppercase font-black tracking-widest">
            INITIALIZING PIT-WALL COCKPIT...
          </span>
        </div>
      }
    >
      <EngineerDashboardContent />
    </Suspense>
  );
}
