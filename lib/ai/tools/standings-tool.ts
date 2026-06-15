import { F1DriverStanding, F1ConstructorStanding } from "@/lib/services/f1/types";

/**
 * Formats driver and constructor standings into a highly compressed, token-efficient text format.
 */
export function formatStandingsContext(
  drivers: F1DriverStanding[],
  constructors: F1ConstructorStanding[]
): string {
  if (!drivers.length && !constructors.length) {
    return "Season championship standings: Data not loaded.";
  }

  let output = "=== SEASON STANDINGS ===\n";

  if (drivers.length > 0) {
    output += "Drivers (Top 10):\n";
    drivers.slice(0, 10).forEach((d) => {
      output += `P${d.position}: ${d.firstName} ${d.lastName} (${d.code}) - ${d.teamName} [${d.points} pts, ${d.wins} wins]\n`;
    });
  }

  if (constructors.length > 0) {
    output += "\nConstructors:\n";
    constructors.forEach((c) => {
      output += `P${c.position}: ${c.teamName} [${c.points} pts, ${c.wins} wins]\n`;
    });
  }

  return output.trim();
}
