import { TyreDegradationResult } from "./types";

export const TYRE_THRESHOLDS: Record<string, number> = {
  SOFT: 15,
  MEDIUM: 25,
  HARD: 38,
  INTERMEDIATE: 22,
  WET: 28,
  UNKNOWN: 25
};

/**
 * Calculates tyre degradation, pace drop-off, remaining life, and health.
 * Follows the explanation-payload architecture.
 */
export function calculateTyreDegradation(
  compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET",
  age: number,
  airTemp: number,
  rainProb: number,
  trackEvolution: "Low" | "Medium" | "High"
): TyreDegradationResult {
  const threshold = TYRE_THRESHOLDS[compound] || 25;
  const explanation: string[] = [];

  // Base degradation pace loss coefficient (seconds lost per lap under nominal conditions)
  let baseCoeff = 0.035;
  if (compound === "SOFT") baseCoeff = 0.055;
  else if (compound === "MEDIUM") baseCoeff = 0.035;
  else if (compound === "HARD") baseCoeff = 0.018;
  else if (compound === "INTERMEDIATE") baseCoeff = 0.045;
  else if (compound === "WET") baseCoeff = 0.065;

  explanation.push(`Base degradation coefficient set to ${baseCoeff}s/lap for ${compound} compound.`);

  // 1. Air Temperature (Thermal Stress)
  let tempMultiplier = 1.0;
  if (airTemp > 30) {
    tempMultiplier = 1.0 + (airTemp - 30) * 0.06;
    explanation.push(`Severe thermal stress: high ambient temp (${airTemp}°C) increases wear rate by ${Math.round((tempMultiplier - 1) * 100)}%.`);
  } else if (airTemp < 18) {
    tempMultiplier = 0.95;
    explanation.push(`Cold ambient temp (${airTemp}°C) reduces thermal wear but increases risk of tread graining.`);
  } else {
    explanation.push(`Ambient temperature (${airTemp}°C) is within optimal operating window.`);
  }

  // 2. Weather & Track Dampness
  let weatherMultiplier = 1.0;
  if (rainProb > 40) {
    if (compound === "SOFT" || compound === "MEDIUM" || compound === "HARD") {
      weatherMultiplier = 2.5 + (rainProb - 40) * 0.04;
      explanation.push(`Slipping risk: dry compound tyres sliding on damp track surface, increasing wear by ${Math.round(weatherMultiplier)}x.`);
    } else {
      explanation.push(`Wet weather tyres executing normal drainage on active rainfall surface.`);
    }
  } else {
    if (compound === "INTERMEDIATE") {
      weatherMultiplier = 3.5;
      explanation.push(`Overheating: Intermediate tread running on dry asphalt, causing rapid block flex and 3.5x degradation.`);
    } else if (compound === "WET") {
      weatherMultiplier = 5.0;
      explanation.push(`Overheating: Full Wet tread running on dry asphalt, causing severe friction blistering and 5.0x degradation.`);
    }
  }

  // 3. Track Evolution
  let evoMultiplier = 1.0;
  if (trackEvolution === "High") {
    evoMultiplier = 0.9;
    explanation.push(`Highly rubbered track surface reduces tyre slip, saving 10% wear.`);
  } else if (trackEvolution === "Low") {
    evoMultiplier = 1.1;
    explanation.push(`Green track surface (low rubber laydown) increases tyre slip, raising wear by 10%.`);
  }

  // 4. Pace Loss Calculation
  // Standard degradation is linear with stint length: baseCoeff * age
  // There is a non-linear "cliff" after threshold age: 0.22 * (age - threshold) ^ 1.8
  let paceLoss = baseCoeff * age * tempMultiplier * weatherMultiplier * evoMultiplier;
  
  if (age > threshold) {
    const cliffDelta = age - threshold;
    const cliffLoss = 0.22 * Math.pow(cliffDelta, 1.8);
    paceLoss += cliffLoss;
    explanation.push(`Tyre cliff breached: stint length (${age} laps) exceeds optimal threshold (${threshold} laps), adding +${cliffLoss.toFixed(2)}s pace drop.`);
  } else if (age > threshold * 0.8) {
    explanation.push(`Tyre approaching degradation window: stint age is at ${Math.round((age / threshold) * 100)}% of optimal lifespan.`);
  }

  // 5. Tyre Health Percentage
  // 100% at age 0, drops to 0% at threshold * 1.35
  const maxLife = threshold * 1.35;
  const tyreHealthPercent = Math.max(0, Math.round(((maxLife - age) / maxLife) * 100));
  const remainingLife = Math.max(0, threshold - age);

  return {
    paceLoss: parseFloat(paceLoss.toFixed(3)),
    remainingLife,
    tyreHealthPercent,
    explanation
  };
}
