import { 
  ScenarioState, 
  TyreDegradationResult, 
  PitWindowResult, 
  UndercutResult, 
  WeatherModelResult, 
  SafetyCarResult, 
  SimulationResult 
} from "./types";
import { calculateTyreDegradation, TYRE_THRESHOLDS } from "./tyre-model";

/**
 * Consolidates all F1 simulation models into a unified race forecast result.
 * Follows the explanation-payload architecture.
 */
export function generateRaceForecast(
  scenario: ScenarioState,
  tyre: TyreDegradationResult,
  pitWindow: PitWindowResult,
  undercut: UndercutResult,
  weather: WeatherModelResult,
  safetyCar: SafetyCarResult
): Omit<SimulationResult, "tyre" | "pitWindow" | "undercut" | "weather" | "safetyCar"> {
  // Total laps is assumed to be 70 (or based on standard Montreal/Barcelona lengths)
  const totalLaps = 70;
  
  // 1. Predict Finish Position
  let predictedPosition = scenario.currentPosition;

  // Undercut gain: Pits early and gains P1
  if (undercut.probability > 60 && scenario.targetPitLap <= scenario.currentLap + 1) {
    predictedPosition = Math.max(1, predictedPosition - 1);
  }

  // Cliff penalty: Pits too late and loses positions
  const threshold = TYRE_THRESHOLDS[scenario.tyreCompound] || 25;
  const targetStintLength = scenario.targetPitLap - (scenario.currentLap - scenario.tyreAge);
  if (targetStintLength > threshold + 4) {
    predictedPosition = Math.min(20, predictedPosition + 2); // lose 2 spots
  }

  // Safety Car Pit Advantage
  if (safetyCar.shouldPit && safetyCar.timeSavedSeconds > 0 && scenario.targetPitLap === scenario.currentLap) {
    predictedPosition = Math.max(1, predictedPosition - 1); // gain 1 spot from pit savings
  }

  // 2. Risk Score (0-100)
  let riskScore = 0;
  riskScore += (100 - tyre.tyreHealthPercent) * 0.4;
  riskScore += weather.rainRiskScore * 0.4;
  if (safetyCar.doubleStackRisk) riskScore += 20;
  riskScore = Math.round(Math.max(5, Math.min(95, riskScore)));

  // 3. Opportunity Score (0-100)
  let opportunityScore = 0;
  opportunityScore += undercut.probability * 0.5;
  if (safetyCar.timeSavedSeconds > 0) opportunityScore += 30;
  if (scenario.weather.trackEvolution === "High") opportunityScore += 10;
  opportunityScore = Math.round(Math.max(5, Math.min(95, opportunityScore)));

  // 4. Pit Sequence Timeline
  const pitSequence: SimulationResult["pitSequence"] = [];
  if (scenario.currentLap < totalLaps) {
    if (scenario.targetPitLap > scenario.currentLap && scenario.targetPitLap <= totalLaps) {
      pitSequence.push({
        lap: scenario.targetPitLap,
        action: `BOX FOR ${scenario.nextTyreCompound}`,
        compound: scenario.nextTyreCompound
      });
    }
  }

  // 5. Pace Projection Curve
  const paceProjection: SimulationResult["paceProjection"] = [];
  let simulatedAge = scenario.tyreAge;
  let simulatedCompound = scenario.tyreCompound;

  for (let lap = scenario.currentLap; lap <= Math.min(totalLaps, scenario.currentLap + 35); lap++) {
    if (lap === scenario.targetPitLap) {
      simulatedCompound = scenario.nextTyreCompound;
      simulatedAge = 0;
    }

    const deg = calculateTyreDegradation(
      simulatedCompound,
      simulatedAge,
      scenario.weather.airTemperature,
      scenario.weather.rainProbability,
      scenario.weather.trackEvolution
    );

    paceProjection.push({
      lap,
      tyreAge: simulatedAge,
      paceLoss: deg.paceLoss
    });

    simulatedAge++;
  }

  return {
    predictedPosition,
    recommendedPitLap: pitWindow.optimalStopLap,
    recommendedNextCompound: scenario.nextTyreCompound,
    riskScore,
    opportunityScore,
    pitSequence,
    paceProjection
  };
}
