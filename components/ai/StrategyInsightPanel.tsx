import React from "react";
import { LiveDriverState } from "@/lib/live/driver-state";
import { parseGapToSeconds } from "@/lib/analytics/race-insights";
import { ShieldAlert, Timer, TrendingDown, Target, Hourglass, Zap, Wind } from "lucide-react";
import { WeatherContext } from "@/lib/services/weather/types";

interface StrategyInsightPanelProps {
  drivers: LiveDriverState[];
  weather?: WeatherContext | null;
}

const TYRE_THRESHOLDS: Record<string, number> = {
  SOFT: 15,
  MEDIUM: 25,
  HARD: 38,
  INTERMEDIATE: 22,
  WET: 28,
  UNKNOWN: 25
};

// Parse lap times like "1:22.670" or "58.123" into seconds
function parseLapTimeToSeconds(lapTime: string): number | null {
  if (lapTime === "--" || !lapTime) return null;
  const parts = lapTime.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
  }
  const secs = parseFloat(parts[0]);
  return isNaN(secs) ? null : secs;
}

export function StrategyInsightPanel({ drivers, weather }: StrategyInsightPanelProps) {
  // 1. Calculate Longest Stint
  const longestStint = React.useMemo<{ driver: LiveDriverState; laps: number } | null>(() => {
    let maxAge = -1;
    let driver: LiveDriverState | null = null;
    for (const d of drivers) {
      if (d.gapToLeader === "DNF") continue;
      if (d.tyreAge > maxAge) {
        maxAge = d.tyreAge;
        driver = d;
      }
    }
    return driver ? { driver, laps: maxAge } : null;
  }, [drivers]);

  // 2. Calculate Pit Candidate (highest tyre age ratio)
  const pitCandidate = React.useMemo<{ driver: LiveDriverState; tyreAge: number; limit: number } | null>(() => {
    let maxRatio = -1;
    let driver: LiveDriverState | null = null;
    let limit = 25;
    for (const d of drivers) {
      if (d.gapToLeader === "DNF" || d.inPitLane) continue;
      const comp = d.tyreCompound.toUpperCase();
      const thresh = TYRE_THRESHOLDS[comp] || 25;
      const ratio = d.tyreAge / thresh;
      if (ratio > maxRatio) {
        maxRatio = ratio;
        driver = d;
        limit = thresh;
      }
    }
    // Only return if tyre is at least 65% worn
    return (driver && maxRatio > 0.65) ? { driver, tyreAge: driver.tyreAge, limit } : null;
  }, [drivers]);

  // 3. Calculate Tyre Risk (exceeding compound limit)
  const tyreRisk = React.useMemo<{ driver: LiveDriverState; tyreAge: number; compound: string } | null>(() => {
    let maxRiskRatio = 1.0; // must exceed 100% of threshold
    let driver: LiveDriverState | null = null;
    for (const d of drivers) {
      if (d.gapToLeader === "DNF" || d.inPitLane) continue;
      const comp = d.tyreCompound.toUpperCase();
      const thresh = TYRE_THRESHOLDS[comp] || 25;
      const ratio = d.tyreAge / thresh;
      if (ratio > maxRiskRatio) {
        maxRiskRatio = ratio;
        driver = d;
      }
    }
    return driver ? { driver, tyreAge: driver.tyreAge, compound: driver.tyreCompound } : null;
  }, [drivers]);

  // 4. Calculate Undercut Candidate (interval between 0.3s and 1.5s)
  const undercutCandidate = React.useMemo(() => {
    let minUndercutGap = Infinity;
    let pursuer: LiveDriverState | null = null;
    let target: LiveDriverState | null = null;

    for (let i = 1; i < drivers.length; i++) {
      const p = drivers[i];
      const t = drivers[i - 1];
      if (p.gapToLeader === "DNF" || t.gapToLeader === "DNF" || p.inPitLane || t.inPitLane) continue;

      const gap = parseGapToSeconds(p.intervalAhead);
      if (gap !== null && gap >= 0.3 && gap <= 1.5) {
        // Pursuer must have tyres that are fresher than target or in pit window
        if (gap < minUndercutGap) {
          minUndercutGap = gap;
          pursuer = p;
          target = t;
        }
      }
    }

    return pursuer && target
      ? { pursuer, target, gap: parseFloat(minUndercutGap.toFixed(3)) }
      : null;
  }, [drivers]);

  // 5. Calculate Fastest Closing Gap (catching > 0.3s faster behind < 4.0s)
  const closingGap = React.useMemo(() => {
    let maxRate = 0.25; // s/lap minimum catch rate
    let pursuer: LiveDriverState | null = null;
    let target: LiveDriverState | null = null;
    let finalGap = 0;

    for (let i = 1; i < drivers.length; i++) {
      const p = drivers[i];
      const t = drivers[i - 1];
      if (p.gapToLeader === "DNF" || t.gapToLeader === "DNF") continue;

      const gap = parseGapToSeconds(p.intervalAhead);
      if (gap !== null && gap > 0 && gap <= 4.0) {
        const pLap = parseLapTimeToSeconds(p.lastLapTime);
        const tLap = parseLapTimeToSeconds(t.lastLapTime);
        if (pLap && tLap) {
          const diff = tLap - pLap; // positive: pursuer is faster
          if (diff > maxRate) {
            maxRate = diff;
            pursuer = p;
            target = t;
            finalGap = gap;
          }
        }
      }
    }

    return pursuer && target
      ? { pursuer, target, rate: parseFloat(maxRate.toFixed(3)), gap: parseFloat(finalGap.toFixed(3)) }
      : null;
  }, [drivers]);

  return (
    <div className="flex flex-col h-full border border-zinc-900 rounded-xl bg-zinc-950/20 overflow-hidden font-mono text-zinc-100">
      {/* Header */}
      <div className="px-4 py-3 bg-zinc-950/40 border-b border-zinc-900 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#FF1801]" />
          <span className="text-[10px] font-black text-zinc-400 tracking-wider uppercase">
            STRATEGY INSIGHT COMPUTER
          </span>
        </div>
        <span className="text-[9px] bg-[#FF1801]/10 text-[#FF1801] border border-[#FF1801]/20 px-1.5 py-0.5 rounded uppercase font-bold">
          LIVE DELTAS
        </span>
      </div>

      {/* Body List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {/* Weather Alerts - Strategic Insights */}
        {weather && (weather.analysis.rainRisk === "Moderate" || weather.analysis.rainRisk === "High") && (
          <div className="border border-red-950/20 bg-red-950/5 p-3 rounded-lg flex items-start gap-3">
            <div className="p-1.5 rounded bg-red-950/10 text-red-500 shrink-0 mt-0.5 border border-red-900/20 animate-pulse">
              <ShieldAlert size={14} />
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
                CRITICAL RAIN RISK ALERT
              </div>
              <div className="text-xs font-bold text-white">
                Precipitation Threat: {weather.analysis.rainRisk}
              </div>
              <div className="text-[10px] text-zinc-400 leading-relaxed">
                {weather.analysis.rainRiskReason} Prepare wet tyre stint variations.
              </div>
            </div>
          </div>
        )}

        {weather && weather.analysis.tyreManagementRisk === "High" && (
          <div className="border border-amber-950/20 bg-amber-950/5 p-3 rounded-lg flex items-start gap-3">
            <div className="p-1.5 rounded bg-amber-950/10 text-amber-500 shrink-0 mt-0.5 border border-amber-900/20">
              <TrendingDown size={14} />
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">
                TYRE THERMAL STRESS WARNING
              </div>
              <div className="text-xs font-bold text-white">
                Ambient Air: {weather.airTemp.toFixed(1)}°C
              </div>
              <div className="text-[10px] text-zinc-400 leading-relaxed">
                High ambient temperature detected. Tyre thermal degradation will accelerate. Increase management margins.
              </div>
            </div>
          </div>
        )}

        {weather && (weather.analysis.windSensitivity === "Elevated" || weather.analysis.windSensitivity === "Severe") && (
          <div className="border border-zinc-900 bg-zinc-950/30 p-3 rounded-lg flex items-start gap-3">
            <div className="p-1.5 rounded bg-zinc-900 text-blue-400 shrink-0 mt-0.5 border border-zinc-850">
              <Wind size={14} />
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                AERO STABILITY WIND ALERT
              </div>
              <div className="text-xs font-bold text-white">
                Wind Velocity: {weather.windSpeed.toFixed(1)} km/h
              </div>
              <div className="text-[10px] text-zinc-400 leading-relaxed">
                {weather.analysis.windImpactReason} Aero balance in high-speed zones will be affected.
              </div>
            </div>
          </div>
        )}

        {weather && weather.analysis.tempTrend === "Cooling Trend" && (
          <div className="border border-zinc-900 bg-zinc-950/30 p-3 rounded-lg flex items-start gap-3">
            <div className="p-1.5 rounded bg-zinc-900 text-purple-400 shrink-0 mt-0.5 border border-zinc-850">
              <Hourglass size={14} />
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                TRACK COOLING TREND DETECTED
              </div>
              <div className="text-xs font-bold text-white">
                Cooling Trend Indicated
              </div>
              <div className="text-[10px] text-zinc-400 leading-relaxed">
                Track temp is dropping. Tyre thermal windows will contract. Drivers must adapt out-lap tyre warming cycles.
              </div>
            </div>
          </div>
        )}

        {/* Longest Stint Card */}
        {longestStint && (
          <div className="border border-zinc-900 bg-zinc-950/30 p-3 rounded-lg flex items-start gap-3">
            <div className="p-1.5 rounded bg-zinc-900 text-zinc-400 shrink-0 mt-0.5 border border-zinc-850">
              <Hourglass size={14} />
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                LONGEST CURRENT STINT
              </div>
              <div className="text-xs font-bold text-white">
                {longestStint.driver.fullName} &mdash;{" "}
                <span className="text-[#FF1801]">P{longestStint.driver.position}</span>
              </div>
              <div className="text-[10px] text-zinc-400 leading-relaxed">
                Running <strong className="text-zinc-200">{longestStint.laps} laps</strong> on{" "}
                <span className="text-zinc-300 font-bold">{longestStint.driver.tyreCompound}</span>. Expect tyres to hit thermal limit soon.
              </div>
            </div>
          </div>
        )}

        {/* Pit stop candidate Card */}
        {pitCandidate && (
          <div className="border border-zinc-900 bg-zinc-950/30 p-3 rounded-lg flex items-start gap-3">
            <div className="p-1.5 rounded bg-zinc-900 text-zinc-400 shrink-0 mt-0.5 border border-zinc-850">
              <Timer size={14} />
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                CRITICAL PIT STOPS WINDOW
              </div>
              <div className="text-xs font-bold text-white">
                {pitCandidate.driver.fullName} &mdash;{" "}
                <span className="text-zinc-400">P{pitCandidate.driver.position}</span>
              </div>
              <div className="text-[10px] text-zinc-400 leading-relaxed">
                Stint: <strong className="text-zinc-200">{pitCandidate.tyreAge}/{pitCandidate.limit} laps</strong>. Pit window open. Fresh tyre delta is optimal.
              </div>
            </div>
          </div>
        )}

        {/* Tyre risk alert Card */}
        {tyreRisk ? (
          <div className="border border-red-950/20 bg-red-950/5 p-3 rounded-lg flex items-start gap-3">
            <div className="p-1.5 rounded bg-red-950/10 text-red-500 shrink-0 mt-0.5 border border-red-900/20 animate-pulse">
              <ShieldAlert size={14} />
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-red-500 uppercase tracking-widest">
                TYRE FAILURE RISK ALERT
              </div>
              <div className="text-xs font-bold text-white">
                {tyreRisk.driver.fullName} &mdash;{" "}
                <span className="text-red-400">P{tyreRisk.driver.position}</span>
              </div>
              <div className="text-[10px] text-zinc-400 leading-relaxed">
                Tyre age is <strong className="text-red-400">{tyreRisk.tyreAge} laps</strong> on{" "}
                <span className="text-zinc-300 font-bold">{tyreRisk.compound}</span>. Grip loss exceeds 35%. Danger of immediate pace collapse.
              </div>
            </div>
          </div>
        ) : (
          <div className="border border-zinc-900 bg-zinc-950/10 p-3 rounded-lg flex items-start gap-3">
            <div className="p-1.5 rounded bg-zinc-900 text-emerald-500 shrink-0 mt-0.5 border border-zinc-850">
              <ShieldAlert size={14} />
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                TYRE INTEGRITY METRIC
              </div>
              <div className="text-xs font-bold text-zinc-300">
                All Systems Normal
              </div>
              <div className="text-[10px] text-zinc-500 leading-relaxed">
                No drivers exceeding critical compound degradation boundaries currently.
              </div>
            </div>
          </div>
        )}

        {/* Undercut Card */}
        {undercutCandidate && (
          <div className="border border-zinc-900 bg-zinc-950/30 p-3 rounded-lg flex items-start gap-3">
            <div className="p-1.5 rounded bg-zinc-900 text-zinc-400 shrink-0 mt-0.5 border border-zinc-850">
              <Target size={14} />
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                UNDERCUT THREAT ANALYSIS
              </div>
              <div className="text-xs font-bold text-white">
                {undercutCandidate.pursuer.acronym} vs {undercutCandidate.target.acronym}
              </div>
              <div className="text-[10px] text-zinc-400 leading-relaxed">
                Gap: <strong className="text-zinc-200">{undercutCandidate.gap}s</strong>. {undercutCandidate.pursuer.acronym} is within pit undercut range. In lap timing is crucial.
              </div>
            </div>
          </div>
        )}

        {/* Closing Gap Card */}
        {closingGap && (
          <div className="border border-zinc-900 bg-zinc-950/30 p-3 rounded-lg flex items-start gap-3">
            <div className="p-1.5 rounded bg-zinc-900 text-zinc-400 shrink-0 mt-0.5 border border-zinc-850">
              <TrendingDown size={14} />
            </div>
            <div className="space-y-1">
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                FASTEST CLOSING GAP RATE
              </div>
              <div className="text-xs font-bold text-white">
                {closingGap.pursuer.acronym} catching {closingGap.target.acronym}
              </div>
              <div className="text-[10px] text-zinc-400 leading-relaxed">
                Catching at <strong className="text-emerald-500">+{closingGap.rate}s/lap</strong>. Gap now at <strong className="text-zinc-200">{closingGap.gap}s</strong>. DRS overtake zone imminent.
              </div>
            </div>
          </div>
        )}

        {/* Empty State Fallback */}
        {drivers.length === 0 && (
          <div className="text-center py-8 text-zinc-650 text-xs">
            NO LIVE SESSION TIMING DATA CONNECTED
          </div>
        )}
      </div>
    </div>
  );
}
export default StrategyInsightPanel;
