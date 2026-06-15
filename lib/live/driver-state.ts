import { 
  OpenF1Driver, 
  OpenF1Lap, 
  OpenF1Stint, 
  OpenF1Interval, 
  OpenF1PitStop 
} from "../services/openf1/types";

export interface LiveDriverState {
  driverNumber: number;
  fullName: string;
  teamName: string;
  teamColor: string;
  acronym: string;
  position: number;
  gapToLeader: string;
  intervalAhead: string;
  tyreCompound: string;
  tyreAge: number;
  pitStopsCount: number;
  lastLapTime: string;
  bestLapTime: string;
  inPitLane: boolean;
}

/**
 * Formats a duration in seconds (e.g., 92.456) into a standard F1 lap time (e.g., "1:32.456").
 */
export function formatLapTime(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || isNaN(seconds) || seconds <= 0) return "--";
  
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins > 0) {
    return `${mins}:${secs.toFixed(3).padStart(6, "0")}`;
  }
  return secs.toFixed(3);
}

/**
 * Aggregates separate OpenF1 streams into a single list of live driver states.
 */
export function aggregateDriverStates(
  drivers: OpenF1Driver[],
  laps: OpenF1Lap[],
  stints: OpenF1Stint[],
  intervals: OpenF1Interval[],
  pitstops: OpenF1PitStop[]
): LiveDriverState[] {
  if (!drivers || drivers.length === 0) return [];

  // Group laps by driver
  const lapsByDriver = new Map<number, OpenF1Lap[]>();
  laps.forEach((l) => {
    if (!lapsByDriver.has(l.driver_number)) {
      lapsByDriver.set(l.driver_number, []);
    }
    lapsByDriver.get(l.driver_number)!.push(l);
  });

  // Group stints by driver
  const stintsByDriver = new Map<number, OpenF1Stint[]>();
  stints.forEach((s) => {
    if (!stintsByDriver.has(s.driver_number)) {
      stintsByDriver.set(s.driver_number, []);
    }
    stintsByDriver.get(s.driver_number)!.push(s);
  });

  // Group intervals by driver (keep the latest one) and find max interval timestamp
  const latestIntervalByDriver = new Map<number, OpenF1Interval>();
  let maxIntervalTime = 0;
  intervals.forEach((i) => {
    const t = new Date(i.date).getTime();
    if (t > maxIntervalTime) {
      maxIntervalTime = t;
    }
    const existing = latestIntervalByDriver.get(i.driver_number);
    if (!existing || new Date(i.date) > new Date(existing.date)) {
      latestIntervalByDriver.set(i.driver_number, i);
    }
  });

  // Group pitstops by driver
  const pitstopsByDriver = new Map<number, OpenF1PitStop[]>();
  pitstops.forEach((p) => {
    if (!pitstopsByDriver.has(p.driver_number)) {
      pitstopsByDriver.set(p.driver_number, []);
    }
    pitstopsByDriver.get(p.driver_number)!.push(p);
  });

  return drivers.map((driver): LiveDriverState => {
    const num = driver.driver_number;
    const driverLaps = lapsByDriver.get(num) || [];
    const driverStints = stintsByDriver.get(num) || [];
    const driverPits = pitstopsByDriver.get(num) || [];
    const latestInterval = latestIntervalByDriver.get(num);

    // Calculate last lap & best lap
    const validLaps = driverLaps.filter((l) => l.lap_duration !== null);
    
    // Sort laps chronologically by lap number
    const sortedLaps = [...driverLaps].sort((a, b) => a.lap_number - b.lap_number);
    const lastLapObj = sortedLaps.length > 0 ? sortedLaps[sortedLaps.length - 1] : null;
    const lastLapTime = lastLapObj ? formatLapTime(lastLapObj.lap_duration) : "--";

    // Best lap
    let bestLapTime = "--";
    if (validLaps.length > 0) {
      const bestLapObj = validLaps.reduce((best, curr) => 
        (curr.lap_duration! < best.lap_duration!) ? curr : best
      , validLaps[0]);
      bestLapTime = formatLapTime(bestLapObj.lap_duration);
    }

    // Get current stint info
    // Active stint is the one with the maximum stint_number
    const sortedStints = [...driverStints].sort((a, b) => b.stint_number - a.stint_number);
    const activeStint = sortedStints.length > 0 ? sortedStints[0] : null;

    const tyreCompound = activeStint ? activeStint.compound : "UNKNOWN";
    
    // Tyre age calculation: tyre_age_at_start + (current_lap - lap_start)
    let tyreAge = 0;
    if (activeStint) {
      const currentLapNum = lastLapObj ? lastLapObj.lap_number : activeStint.lap_start;
      const lapsCompletedInStint = Math.max(0, currentLapNum - activeStint.lap_start);
      tyreAge = activeStint.tyre_age_at_start + lapsCompletedInStint;
    }

    // Interval gaps
    let gapToLeader = "--";
    let intervalAhead = "--";
    const position = 20; // fallback

    // Check if driver is retired (interval data is older than session max by 10 minutes)
    let isRetired = false;
    if (latestInterval && maxIntervalTime > 0) {
      const driverTime = new Date(latestInterval.date).getTime();
      if (maxIntervalTime - driverTime > 600000) {
        isRetired = true;
      }
    }

    if (latestInterval) {
      if (isRetired) {
        gapToLeader = "DNF";
        intervalAhead = "—";
      } else {
        const rawGap = latestInterval.gap_to_leader;
        if (rawGap === 0 || String(rawGap) === "0") {
          gapToLeader = "Leader";
        } else if (rawGap !== null && rawGap !== undefined) {
          const rawGapStr = String(rawGap).toUpperCase().trim();
          if (rawGapStr.includes("LAP")) {
            gapToLeader = rawGapStr.startsWith("+") ? rawGapStr : `+${rawGapStr}`;
          } else {
            const gapVal = typeof rawGap === "number" ? rawGap : parseFloat(rawGapStr);
            gapToLeader = !isNaN(gapVal) ? `+${gapVal.toFixed(3)}s` : "--";
          }
        }

        const intVal = typeof latestInterval.interval === "number"
          ? latestInterval.interval
          : latestInterval.interval !== null
          ? parseFloat(String(latestInterval.interval))
          : null;
          
        intervalAhead = intVal === 0
          ? "—"
          : intVal !== null && !isNaN(intVal)
          ? `+${intVal.toFixed(3)}s`
          : "--";
      }
    }

    // Pit status
    const inPitLane = lastLapObj ? lastLapObj.is_pit_out_lap : false;

    // Team color hex code configuration
    const rawColour = driver.team_colour || "CCCCCC";
    const teamColor = rawColour.startsWith("#") 
      ? rawColour 
      : `#${rawColour}`;

    return {
      driverNumber: num,
      fullName: driver.full_name,
      teamName: driver.team_name,
      teamColor,
      acronym: driver.name_acronym,
      position, // will be sorted & assigned by timing-state
      gapToLeader,
      intervalAhead,
      tyreCompound,
      tyreAge,
      pitStopsCount: driverPits.length,
      lastLapTime,
      bestLapTime,
      inPitLane
    };
  });
}
