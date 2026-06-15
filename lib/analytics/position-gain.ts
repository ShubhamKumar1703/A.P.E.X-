import { F1RaceResult } from "../services/f1/types";

export interface PositionGainInfo {
  driver: F1RaceResult;
  gain: number;
}

/**
 * Calculates position gains (grid start position minus final finishing position)
 * for all drivers in a race, sorted by gain descending.
 */
export function calculatePositionGains(results: F1RaceResult[]): PositionGainInfo[] {
  if (!results || results.length === 0) return [];
  
  return results
    .map((r) => ({
      driver: r,
      gain: r.grid - r.position
    }))
    .sort((a, b) => b.gain - a.gain);
}

/**
 * Gets the driver who gained the most positions in the race.
 */
export function getBiggestGainer(results: F1RaceResult[]): PositionGainInfo | null {
  const gains = calculatePositionGains(results);
  return gains.length > 0 ? gains[0] : null;
}

/**
 * Gets the driver who lost the most positions in the race.
 */
export function getBiggestLoser(results: F1RaceResult[]): PositionGainInfo | null {
  const gains = calculatePositionGains(results);
  return gains.length > 0 ? gains[gains.length - 1] : null;
}
