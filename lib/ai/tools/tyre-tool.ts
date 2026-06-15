import { CompactDriverContext } from "../types";

/**
 * Summarizes compounds, current tyre age, and stint lengths for all active drivers.
 */
export function formatTyreContext(drivers: CompactDriverContext[]): string {
  if (!drivers || drivers.length === 0) {
    return "Tyre Status: No active session telemetry available.";
  }

  let output = "=== TYRE COMPOUND & AGE STATUS ===\n";
  
  // Sort by position or rank
  const active = [...drivers].sort((a, b) => a.position - b.position);
  
  active.forEach((d) => {
    const pitStatus = d.inPitLane ? " [IN PIT]" : "";
    output += `P${d.position} ${d.acronym} (#${d.driverNumber}): ${d.tyreCompound} (Age: ${d.tyreAge} laps)${pitStatus}\n`;
  });

  return output.trim();
}
