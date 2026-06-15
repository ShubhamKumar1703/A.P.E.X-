import { AICompileContext } from "./types";
import { formatTyreContext } from "./tools/tyre-tool";
import { formatPitStopContext } from "./tools/pitstop-tool";
import { formatAnalyticsContext } from "./tools/analytics-tool";

/**
 * Compiles a dense, token-efficient text block summarising the live race context.
 * This summary is passed to the LLM system prompt.
 */
export function buildCuratedContextText(context: AICompileContext): string {
  const { session, drivers, analytics, standingsSummary } = context;

  let block = "";

  // 1. Session Status
  block += `=== CIRCUIT & SESSION STATUS ===\n`;
  block += `- Session: ${session.year} ${session.circuitName} ${session.sessionName} (Key: ${session.sessionKey})\n`;
  block += `- Location: ${session.location}\n`;
  block += `- Current Lap: ${session.currentLap} / ${session.totalLaps}\n`;
  block += `- Track Flag Status: ${session.flagStatus}\n`;
  block += `- Track Condition Alert: ${session.trackAlert}\n`;
  block += `- Latest Control Message: "${session.latestMessage}"\n\n`;

  // 2. Leaderboard & Timing Gaps
  block += `=== TIMING LEADERBOARD (Top 10) ===\n`;
  const top10 = drivers.slice(0, 10);
  if (top10.length > 0) {
    top10.forEach((d) => {
      block += `P${d.position}: ${d.acronym} (#${d.driverNumber}) | Team: ${d.teamName} | Gap: ${d.gapToLeader} | Last: ${d.lastLapTime} | Best: ${d.bestLapTime} | ${d.inPitLane ? "IN PIT" : "ON TRACK"}\n`;
    });
  } else {
    block += "Leaderboard: No timing logs available.\n";
  }
  block += "\n";

  // 3. Tyre Compounds & Stint Ages (compresses all drivers)
  block += `${formatTyreContext(drivers)}\n\n`;

  // 4. Pitstop Counts
  block += `${formatPitStopContext(drivers)}\n\n`;

  // 5. Strategy Analytics
  block += `${formatAnalyticsContext(analytics)}\n\n`;

  // 6. Season Standings (if loaded)
  if (standingsSummary) {
    block += `${standingsSummary}\n`;
  }

  return block.trim();
}
