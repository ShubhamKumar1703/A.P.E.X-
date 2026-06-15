import { F1RaceResult, F1QualifyingResult, F1DriverStanding } from "../services/f1/types";
import { getBiggestGainer } from "./position-gain";
import { getStrongestRecoveryDrive } from "./recovery-score";
import { getBestConstructorPerformance } from "./constructor-score";

export interface ClosestBattleInfo {
  driverA: F1RaceResult;
  driverB: F1RaceResult;
  gapSeconds: number;
}

export interface QualifyingWinnerInfo {
  driver: F1QualifyingResult;
  championshipPosition: number;
  qualifyingPosition: number;
  placesOutperformed: number;
}

// Static F1 rookie IDs for current seasons (2025/2026)
export const ROOKIE_DRIVER_IDS = [
  "bearman",
  "antonelli",
  "doohan",
  "bortoleto",
  "colapinto",
  "hadjar",
  "martins"
];

/**
 * Helper to parse a time gap string (e.g. "+1.234", "+1:12.345") into seconds.
 * Returns null if the gap represents laps down (e.g. "+1 Lap") or is unparseable.
 */
export function parseGapToSeconds(gapStr: string | undefined): number | null {
  if (!gapStr) return null;
  
  const clean = gapStr.trim();
  
  // If it's a lap gap, we can't easily convert it to a time gap
  if (clean.includes("Lap") || clean.includes("Laps")) {
    return null;
  }
  
  // Strip the '+' sign if present
  let timePart = clean;
  if (clean.startsWith("+")) {
    timePart = clean.slice(1);
  }
  
  const parts = timePart.split(":");
  try {
    if (parts.length === 3) {
      // hh:mm:ss.xxx
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      const seconds = parseFloat(parts[2]);
      return hours * 3600 + minutes * 60 + seconds;
    } else if (parts.length === 2) {
      // mm:ss.xxx
      const minutes = parseInt(parts[0], 10);
      const seconds = parseFloat(parts[1]);
      return minutes * 60 + seconds;
    } else if (parts.length === 1) {
      // ss.xxx
      const seconds = parseFloat(parts[0]);
      if (isNaN(seconds)) return null;
      return seconds;
    }
  } catch {
    return null;
  }
  
  return null;
}

/**
 * Calculates the closest finishing time gap between any two consecutive finishing drivers.
 */
export function getClosestBattle(results: F1RaceResult[]): ClosestBattleInfo | null {
  if (!results || results.length < 2) return null;

  let minGap = Infinity;
  let closestPair: { driverA: F1RaceResult; driverB: F1RaceResult } | null = null;

  // Track absolute time gap to winner in seconds for each driver
  const timesInSeconds: { driver: F1RaceResult; timeSec: number }[] = [];

  results.forEach((r, idx) => {
    if (idx === 0) {
      // Winner's gap is 0.0 seconds
      timesInSeconds.push({ driver: r, timeSec: 0.0 });
    } else if (r.status === "Finished" && r.time) {
      const parsed = parseGapToSeconds(r.time);
      if (parsed !== null) {
        timesInSeconds.push({ driver: r, timeSec: parsed });
      }
    }
  });

  // Compare consecutive positions that have parsed times
  for (let i = 0; i < timesInSeconds.length - 1; i++) {
    const d1 = timesInSeconds[i];
    const d2 = timesInSeconds[i + 1];
    
    // The gap between consecutive drivers is the difference in their gaps to the winner
    const gap = d2.timeSec - d1.timeSec;
    if (gap > 0 && gap < minGap) {
      minGap = gap;
      closestPair = { driverA: d1.driver, driverB: d2.driver };
    }
  }

  if (!closestPair || minGap === Infinity) return null;

  return {
    driverA: closestPair.driverA,
    driverB: closestPair.driverB,
    gapSeconds: parseFloat(minGap.toFixed(3))
  };
}

/**
 * Finds the highest-finishing rookie in the race results.
 */
export function getBestFinishingRookie(results: F1RaceResult[]): F1RaceResult | null {
  if (!results || results.length === 0) return null;
  
  // Results are sorted by position, so the first driver in the results who is in the ROOKIES list is the best finishing rookie
  const rookie = results.find((r) => ROOKIE_DRIVER_IDS.includes(r.driverId.toLowerCase()));
  return rookie || null;
}

/**
 * Identifies drivers who qualified significantly higher than their season championship standing position.
 */
export function getQualifyingWinners(
  qualifyingResults: F1QualifyingResult[],
  standings: F1DriverStanding[]
): QualifyingWinnerInfo[] {
  if (!qualifyingResults || qualifyingResults.length === 0 || !standings || standings.length === 0) {
    return [];
  }

  const standingsMap = new Map<string, number>();
  standings.forEach((s) => {
    standingsMap.set(s.driverId.toLowerCase(), s.position);
  });

  return qualifyingResults
    .map((q) => {
      const champPos = standingsMap.get(q.driverId.toLowerCase()) || 20; // Default to P20 if standing not found
      return {
        driver: q,
        championshipPosition: champPos,
        qualifyingPosition: q.position,
        placesOutperformed: champPos - q.position
      };
    })
    .filter((info) => info.placesOutperformed > 0) // Only those who outperformed their standing
    .sort((a, b) => b.placesOutperformed - a.placesOutperformed);
}

/**
 * Centralized aggregator returning all post-race insights.
 */
export function getRaceInsights(results: F1RaceResult[]) {
  return {
    biggestGainer: getBiggestGainer(results),
    strongestRecovery: getStrongestRecoveryDrive(results),
    bestConstructor: getBestConstructorPerformance(results),
    closestBattle: getClosestBattle(results),
    bestRookie: getBestFinishingRookie(results)
  };
}
