import { ScenarioState, SimulationResult } from "@/lib/sandbox/types";

/**
 * Converts simulation inputs, outputs, and explanations into an AI-optimal text block.
 * This directly supports the F1 strategy assistant sandbox chat queries.
 */
export function buildCuratedSandboxContextText(
  scenarioA: ScenarioState,
  resultA: SimulationResult,
  scenarioB?: ScenarioState | null,
  resultB?: SimulationResult | null
): string {
  let block = "";

  // 1. Header
  block += `=== A.P.E.X. STRATEGY SANDBOX WORKSPACE ===\n`;
  block += `The user is running Formula 1 race strategy simulations in a sandbox cockpit workspace. All results, wear curves, and undercut chances are pre-calculated deterministically by A.P.E.X. algorithms. The AI's role is to explain these outputs, identify risks, and guide the user in selecting the optimal strategy option. Do not perform math calculations yourself; refer directly to the metrics below.\n\n`;

  // 2. Scenario A
  block += `=== SIMULATION SCENARIO A: "${scenarioA.name}" ===\n`;
  block += `- Driver: #${scenarioA.driverNumber} (${scenarioA.driverAcronym})\n`;
  block += `- Current Position: P${scenarioA.currentPosition} | Current Lap: ${scenarioA.currentLap} | Stops completed: ${scenarioA.pitStopsCount}\n`;
  block += `- Tyre Stint: ${scenarioA.tyreCompound} (${scenarioA.tyreAge} laps old)\n`;
  block += `- Target Pit Stop Lap: Lap ${scenarioA.targetPitLap} | Next Compound: ${scenarioA.nextTyreCompound}\n`;
  block += `- Interval Ahead: ${scenarioA.gapAhead}s | Interval Behind: ${scenarioA.gapBehind}s\n`;
  block += `- Weather Parameters: Temp ${scenarioA.weather.airTemperature}°C | Rain Risk ${scenarioA.weather.rainProbability}% | Track Evolution ${scenarioA.weather.trackEvolution}\n`;
  block += `- Track Event: ${scenarioA.raceEvent}\n`;
  
  block += `[Deterministic Predictions A]:\n`;
  block += `  - Predicted Finish Position: P${resultA.predictedPosition}\n`;
  block += `  - Recommended Pit Window: Laps ${resultA.pitWindow.earliestStopLap} - ${resultA.pitWindow.latestStopLap} (Optimal: Lap ${resultA.pitWindow.optimalStopLap})\n`;
  block += `  - Tyre Pace Loss at Stint End: +${resultA.tyre.paceLoss}s/lap | Remaining health: ${resultA.tyre.tyreHealthPercent}%\n`;
  block += `  - Undercut Success Chance: ${resultA.undercut.probability}% (Est. Gain: ${resultA.undercut.estimatedGainSeconds}s)\n`;
  block += `  - Weather Tyre Suitability: ${resultA.weather.tyreSuitability} | Pit Urgency: ${resultA.weather.pitUrgency}\n`;
  block += `  - Safety Car Pit Advantage Action: "${resultA.safetyCar.actionRecommendation}" (Saved: ${resultA.safetyCar.timeSavedSeconds}s)\n`;
  block += `  - Overall Risk Score: ${resultA.riskScore}/100 | Opportunity Score: ${resultA.opportunityScore}/100\n`;
  
  block += `[Model Explanation Points A]:\n`;
  resultA.tyre.explanation.forEach(exp => block += `  - Tyre: ${exp}\n`);
  resultA.pitWindow.explanation.forEach(exp => block += `  - Pit Window: ${exp}\n`);
  resultA.undercut.explanation.forEach(exp => block += `  - Undercut: ${exp}\n`);
  resultA.weather.explanation.forEach(exp => block += `  - Weather: ${exp}\n`);
  resultA.safetyCar.explanation.forEach(exp => block += `  - Safety Car: ${exp}\n`);
  block += `\n`;

  // 3. Scenario B (if active)
  if (scenarioB && resultB) {
    block += `=== SIMULATION SCENARIO B: "${scenarioB.name}" ===\n`;
    block += `- Driver: #${scenarioB.driverNumber} (${scenarioB.driverAcronym})\n`;
    block += `- Current Position: P${scenarioB.currentPosition} | Current Lap: ${scenarioB.currentLap} | Stops completed: ${scenarioB.pitStopsCount}\n`;
    block += `- Tyre Stint: ${scenarioB.tyreCompound} (${scenarioB.tyreAge} laps old)\n`;
    block += `- Target Pit Stop Lap: Lap ${scenarioB.targetPitLap} | Next Compound: ${scenarioB.nextTyreCompound}\n`;
    block += `- Interval Ahead: ${scenarioB.gapAhead}s | Interval Behind: ${scenarioB.gapBehind}s\n`;
    block += `- Weather Parameters: Temp ${scenarioB.weather.airTemperature}°C | Rain Risk ${scenarioB.weather.rainProbability}% | Track Evolution ${scenarioB.weather.trackEvolution}\n`;
    block += `- Track Event: ${scenarioB.raceEvent}\n`;
    
    block += `[Deterministic Predictions B]:\n`;
    block += `  - Predicted Finish Position: P${resultB.predictedPosition}\n`;
    block += `  - Recommended Pit Window: Laps ${resultB.pitWindow.earliestStopLap} - ${resultB.pitWindow.latestStopLap} (Optimal: Lap ${resultB.pitWindow.optimalStopLap})\n`;
    block += `  - Tyre Pace Loss at Stint End: +${resultB.tyre.paceLoss}s/lap | Remaining health: ${resultB.tyre.tyreHealthPercent}%\n`;
    block += `  - Undercut Success Chance: ${resultB.undercut.probability}% (Est. Gain: ${resultB.undercut.estimatedGainSeconds}s)\n`;
    block += `  - Weather Tyre Suitability: ${resultB.weather.tyreSuitability} | Pit Urgency: ${resultB.weather.pitUrgency}\n`;
    block += `  - Safety Car Pit Advantage Action: "${resultB.safetyCar.actionRecommendation}" (Saved: ${resultB.safetyCar.timeSavedSeconds}s)\n`;
    block += `  - Overall Risk Score: ${resultB.riskScore}/100 | Opportunity Score: ${resultB.opportunityScore}/100\n`;
    
    block += `[Model Explanation Points B]:\n`;
    resultB.tyre.explanation.forEach(exp => block += `  - Tyre: ${exp}\n`);
    resultB.pitWindow.explanation.forEach(exp => block += `  - Pit Window: ${exp}\n`);
    resultB.undercut.explanation.forEach(exp => block += `  - Undercut: ${exp}\n`);
    resultB.weather.explanation.forEach(exp => block += `  - Weather: ${exp}\n`);
    resultB.safetyCar.explanation.forEach(exp => block += `  - Safety Car: ${exp}\n`);
    block += `\n`;
    
    // Comparison metrics
    const posGainDelta = resultA.predictedPosition - resultB.predictedPosition; // negative means A finished higher (better position)
    block += `=== COMPARATIVE STRATEGY METRICS ===\n`;
    if (posGainDelta < 0) {
      block += `- Position Advantage: Scenario A ("${scenarioA.name}") finishes ${Math.abs(posGainDelta)} positions higher than Scenario B ("${scenarioB.name}").\n`;
    } else if (posGainDelta > 0) {
      block += `- Position Advantage: Scenario B ("${scenarioB.name}") finishes ${posGainDelta} positions higher than Scenario A ("${scenarioA.name}").\n`;
    } else {
      block += `- Position Advantage: Both scenarios project identical finishing position (P${resultA.predictedPosition}).\n`;
    }
    block += `- Risk Delta: Scenario A Risk is ${resultA.riskScore} vs Scenario B Risk of ${resultB.riskScore}.\n`;
    block += `- Opportunity Delta: Scenario A Opportunity is ${resultA.opportunityScore} vs Scenario B Opportunity of ${resultB.opportunityScore}.\n\n`;
  }

  return block.trim();
}
