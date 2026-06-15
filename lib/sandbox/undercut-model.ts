import { UndercutResult } from "./types";

/**
 * Calculates undercut probability, position gain, recommended pit lap, and confidence scores.
 * Follows the explanation-payload architecture.
 */
export function calculateUndercut(
  gapAhead: number,
  tyreAge: number,
  currentLap: number
): UndercutResult {
  const explanation: string[] = [];
  
  if (gapAhead <= 0 || gapAhead > 10) {
    explanation.push("Gap ahead is outside active undercut zone (> 10s). Undercut is not viable.");
    return {
      probability: 0,
      estimatedGainSeconds: 0,
      recommendedPitLap: currentLap,
      confidenceScore: 0,
      explanation
    };
  }

  // Fresh tyre pace delta (nominal is 1.0s, increases as old tyres get older and lose grip)
  const tyreDegDelta = Math.min(2.5, 1.0 + tyreAge * 0.04);
  explanation.push(`Simulated fresh tyre pace advantage calculated at +${tyreDegDelta.toFixed(2)}s/lap.`);

  // Overtake probability based on gap and stint age
  let probability = 0;
  const estimatedGainSeconds = parseFloat((tyreDegDelta - gapAhead).toFixed(2));
  
  if (gapAhead < 1.0) {
    probability = 85;
    explanation.push(`Interval ahead (${gapAhead}s) is within critical DRS range. High probability (85%) of successful undercut.`);
  } else if (gapAhead <= 2.2) {
    probability = 60;
    explanation.push(`Interval ahead (${gapAhead}s) is within single-lap pitstop delta. Moderate probability (60%) of success.`);
  } else if (gapAhead <= 4.0) {
    probability = 25;
    explanation.push(`Interval ahead (${gapAhead}s) is wide. Overtake requires a 2-lap out-lap margin or opponent traffic delays.`);
  } else {
    probability = 5;
    explanation.push(`Interval ahead (${gapAhead}s) exceeds optimal undercut boundaries. Probability is extremely low (5%).`);
  }

  // Confidence score based on tyre age and gap
  let confidenceScore = 0;
  if (tyreAge > 15) {
    confidenceScore = Math.round(probability * 1.1);
    explanation.push(`High tyre wear stint (${tyreAge} laps) maximizes out-lap speed delta.`);
  } else {
    confidenceScore = Math.round(probability * 0.85);
    explanation.push(`Relatively fresh tyre stint (${tyreAge} laps) limits the immediate out-lap pace delta.`);
  }
  confidenceScore = Math.max(0, Math.min(100, confidenceScore));

  const recommendedPitLap = currentLap + 1;
  explanation.push(`Execution window: Recommended trigger lap is Lap ${recommendedPitLap} to force opponent cover.`);

  return {
    probability,
    estimatedGainSeconds,
    recommendedPitLap,
    confidenceScore,
    explanation
  };
}
