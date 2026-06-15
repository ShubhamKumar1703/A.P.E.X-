import { PitWindowResult } from "./types";
import { TYRE_THRESHOLDS } from "./tyre-model";

/**
 * Calculates earliest, optimal, and latest stop laps.
 * Follows the explanation-payload architecture.
 */
export function calculatePitWindow(
  compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET",
  currentLap: number,
  tyreAge: number,
  airTemp: number,
  rainProb: number
): PitWindowResult {
  const threshold = TYRE_THRESHOLDS[compound] || 25;
  const stintStart = Math.max(1, currentLap - tyreAge);
  const explanation: string[] = [];

  // Calculate temperature scaling factor
  let tempFactor = 1.0;
  if (airTemp > 30) {
    tempFactor = 0.85;
    explanation.push(`High track temp (${airTemp}°C) shortens stint life to ${Math.round(tempFactor * 100)}% of nominal.`);
  } else if (airTemp < 18) {
    tempFactor = 1.05;
    explanation.push(`Cooler track temp (${airTemp}°C) extends tyre durability to ${Math.round(tempFactor * 100)}% of nominal.`);
  }

  // Rain factor: accelerates stops if dry compound is run on incoming rain
  let rainFactor = 1.0;
  if (rainProb > 50 && (compound === "SOFT" || compound === "MEDIUM" || compound === "HARD")) {
    rainFactor = 0.8;
    explanation.push(`Incoming precipitation risk (${rainProb}%) compresses the dry tyre pit window to prepare wet tyre transition.`);
  }

  const optimalStintLength = Math.round(threshold * tempFactor * rainFactor);
  const optimalStopLap = stintStart + optimalStintLength;
  
  // Earliest stop lap is 4 laps before optimal
  const earliestStopLap = Math.max(stintStart + 1, optimalStopLap - 4);
  // Latest stop lap is 3 laps after optimal (before massive cliff)
  const latestStopLap = optimalStopLap + 3;

  explanation.push(`Optimal pit stop identified at Lap ${optimalStopLap} (stint length: ${optimalStintLength} laps).`);
  explanation.push(`Earliest safety window opens at Lap ${earliestStopLap}; latest stop viable at Lap ${latestStopLap} before critical grip loss.`);

  return {
    earliestStopLap,
    optimalStopLap,
    latestStopLap,
    explanation
  };
}
