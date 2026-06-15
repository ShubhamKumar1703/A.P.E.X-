import { LiveDriverState } from "./driver-state";

/**
 * Sorts and ranks the aggregated driver states based on timing intervals.
 * Automatically assigns sequential positions (1 to N) to the ranked list.
 */
export function sortTimingBoard(states: LiveDriverState[]): LiveDriverState[] {
  if (!states || states.length === 0) return [];

  const parseGap = (gapStr: string): number => {
    if (gapStr === "Leader") return 0;
    if (gapStr === "--" || !gapStr) return Infinity;
    
    // Strip "+" and "s" (e.g. "+1.234s" -> "1.234")
    const clean = gapStr.replace(/[+s]/g, "").trim();
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? Infinity : parsed;
  };

  const ranked = [...states].sort((a, b) => {
    const gapA = parseGap(a.gapToLeader);
    const gapB = parseGap(b.gapToLeader);
    
    if (gapA !== gapB) {
      return gapA - gapB;
    }
    // Fallback to driver number if intervals are equal or unparsed
    return a.driverNumber - b.driverNumber;
  });

  // Assign sequential positions
  return ranked.map((state, idx) => ({
    ...state,
    position: idx + 1
  }));
}

/**
 * Identifies the driver number with the absolute fastest lap time of the session.
 */
export function getSessionFastestLapDriver(states: LiveDriverState[]): number | null {
  if (!states || states.length === 0) return null;

  let minSeconds = Infinity;
  let fastestDriverNum: number | null = null;

  states.forEach((s) => {
    if (s.bestLapTime === "--") return;
    
    // Parse bestLapTime e.g. "1:32.456" or "58.123"
    const parts = s.bestLapTime.split(":");
    let secs = 0;
    if (parts.length === 2) {
      secs = parseInt(parts[0], 10) * 60 + parseFloat(parts[1]);
    } else {
      secs = parseFloat(parts[0]);
    }

    if (!isNaN(secs) && secs < minSeconds) {
      minSeconds = secs;
      fastestDriverNum = s.driverNumber;
    }
  });

  return fastestDriverNum;
}
