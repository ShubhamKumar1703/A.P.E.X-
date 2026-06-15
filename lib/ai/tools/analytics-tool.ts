import { CompactAnalyticsContext } from "../types";

/**
 * Formats compiled analytics insights into a compact text block for the prompt.
 */
export function formatAnalyticsContext(insights: CompactAnalyticsContext): string {
  let output = "=== STRATEGY ANALYTICS SUMMARY ===\n";

  if (insights.biggestGainer) {
    const bg = insights.biggestGainer;
    output += `- Biggest Position Gainer: ${bg.driverName} (+${bg.gain} spots, P${bg.from} -> P${bg.to})\n`;
  } else {
    output += `- Biggest Position Gainer: None\n`;
  }

  if (insights.closestBattle) {
    const cb = insights.closestBattle;
    output += `- Closest Battle: ${cb.driverA} vs ${cb.driverB} (Gap: ${cb.gapSeconds}s)\n`;
  } else {
    output += `- Closest Battle: None\n`;
  }

  if (insights.bestRookie) {
    const br = insights.bestRookie;
    output += `- Best Finishing Rookie: ${br.driverName} (P${br.position})\n`;
  }

  if (insights.strongestRecovery) {
    const sr = insights.strongestRecovery;
    output += `- Strongest Recovery Drive: ${sr.driverName} (Score: ${sr.recoveryScore}, P${sr.startingPosition} -> P${sr.finishingPosition})\n`;
  }

  return output.trim();
}
