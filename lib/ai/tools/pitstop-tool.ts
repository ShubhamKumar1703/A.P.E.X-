import { CompactDriverContext } from "../types";

/**
 * Summarizes pitstop counts for all drivers.
 */
export function formatPitStopContext(drivers: CompactDriverContext[]): string {
  if (!drivers || drivers.length === 0) {
    return "Pitstop Status: No active pitstop logs available.";
  }

  let output = "=== PITSTOP MATRIX ===\n";
  const active = [...drivers].sort((a, b) => a.position - b.position);

  active.forEach((d) => {
    output += `${d.acronym} (#${d.driverNumber}): ${d.pitStopsCount} stops\n`;
  });

  return output.trim();
}
