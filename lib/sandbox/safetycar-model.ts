import { SafetyCarResult } from "./types";
import { TYRE_THRESHOLDS } from "./tyre-model";

/**
 * Evaluates pit decisions under Safety Car, VSC, or Red Flags.
 * Follows the explanation-payload architecture.
 */
export function calculateSafetyCarSandbox(
  raceEvent: "NONE" | "SAFETY_CAR" | "VIRTUAL_SAFETY_CAR" | "RED_FLAG",
  compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET",
  tyreAge: number,
  currentPosition: number,
  gapAhead: number
): SafetyCarResult {
  const explanation: string[] = [];
  const threshold = TYRE_THRESHOLDS[compound] || 25;

  if (raceEvent === "NONE") {
    explanation.push("Track status is CLEAR. Normal pit stop loss estimated at 22.0 seconds.");
    return {
      shouldPit: false,
      timeSavedSeconds: 0,
      doubleStackRisk: false,
      actionRecommendation: "Maintain nominal strategy. Pit window opens according to tyre wear.",
      explanation
    };
  }

  let shouldPit = false;
  let timeSavedSeconds = 0;
  let doubleStackRisk = false;
  let actionRecommendation = "";

  if (raceEvent === "RED_FLAG") {
    shouldPit = true;
    timeSavedSeconds = 22.0;
    actionRecommendation = "FIT NEW TYRES FREE OF CHARGE";
    explanation.push("Red Flag active: Cars directed to pit lane.");
    explanation.push("FIA Sporting Regulations permit tyre replacement during red flags. Free pit stop executed (22.0s saved).");
    explanation.push("Recommended action: Mount fresh compound immediately to match track restart grip.");
  } else {
    // SC or VSC
    const isSC = raceEvent === "SAFETY_CAR";
    timeSavedSeconds = isSC ? 10.0 : 7.0;
    explanation.push(`${isSC ? "Safety Car" : "Virtual Safety Car"} speed restrictions reduce pit lane delta loss.`);
    explanation.push(`Pitting under ${isSC ? "SC" : "VSC"} saves approximately ${timeSavedSeconds}s relative to a green-flag pit stop.`);

    // Heuristic: pit if tyre is at least 40% worn
    const wearRatio = tyreAge / threshold;
    if (wearRatio >= 0.4) {
      shouldPit = true;
      actionRecommendation = `BOX THIS LAP (${isSC ? "SC" : "VSC"} window open)`;
      explanation.push(`Tyres are at ${Math.round(wearRatio * 100)}% wear. Time savings exceed grip loss of pitting early.`);
    } else {
      shouldPit = false;
      actionRecommendation = "STAY OUT (Preserve track position)";
      explanation.push(`Tyres are relatively fresh (${tyreAge} laps / ${Math.round(wearRatio * 100)}% wear). Pitting now sacrifices track position unnecessarily.`);
    }

    // Heuristic for double stack risk: if we are the second car (even position) and gap to car ahead is small (< 3.0s)
    if (currentPosition % 2 === 0 && gapAhead < 3.0) {
      doubleStackRisk = true;
      actionRecommendation = shouldPit ? "BOX NOW (Caution: Double Stack Risk)" : actionRecommendation;
      explanation.push(`Double stack risk: Teammate likely ahead in queue within ${gapAhead}s. Pitting now may result in 2.5s-4.0s delay in pit box.`);
    } else {
      explanation.push("No immediate teammate queue interference detected. Clean pit box entry expected.");
    }
  }

  return {
    shouldPit,
    timeSavedSeconds,
    doubleStackRisk,
    actionRecommendation,
    explanation
  };
}
export default calculateSafetyCarSandbox;
