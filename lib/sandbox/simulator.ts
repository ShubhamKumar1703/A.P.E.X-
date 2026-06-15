import { ScenarioState, SimulationResult } from "./types";
import { calculateTyreDegradation } from "./tyre-model";
import { calculatePitWindow } from "./pit-window";
import { calculateUndercut } from "./undercut-model";
import { calculateWeatherSandbox } from "./weather-model";
import { calculateSafetyCarSandbox } from "./safetycar-model";
import { generateRaceForecast } from "./race-forecast";

/**
 * Executes a full strategy simulation on a given scenario state.
 * Returns a deterministic, consolidated strategy forecast.
 */
export function runStrategySimulation(scenario: ScenarioState): SimulationResult {
  // 1. Run Tyre Degradation Model
  const tyre = calculateTyreDegradation(
    scenario.tyreCompound,
    scenario.tyreAge,
    scenario.weather.airTemperature,
    scenario.weather.rainProbability,
    scenario.weather.trackEvolution
  );

  // 2. Run Pit Stop Window Model
  const pitWindow = calculatePitWindow(
    scenario.tyreCompound,
    scenario.currentLap,
    scenario.tyreAge,
    scenario.weather.airTemperature,
    scenario.weather.rainProbability
  );

  // 3. Run Pit Undercut Potential Model
  const undercut = calculateUndercut(
    scenario.gapAhead,
    scenario.tyreAge,
    scenario.currentLap
  );

  // 4. Run Weather Intelligence Model
  const weather = calculateWeatherSandbox(
    scenario.tyreCompound,
    scenario.weather.rainProbability,
    scenario.weather.airTemperature,
    scenario.weather.trackEvolution
  );

  // 5. Run Safety Car Pit Advantage Model
  const safetyCar = calculateSafetyCarSandbox(
    scenario.raceEvent,
    scenario.tyreCompound,
    scenario.tyreAge,
    scenario.currentPosition,
    scenario.gapAhead
  );

  // 6. Consolidate into Race Forecast Engine
  const forecast = generateRaceForecast(
    scenario,
    tyre,
    pitWindow,
    undercut,
    weather,
    safetyCar
  );

  return {
    ...forecast,
    tyre,
    pitWindow,
    undercut,
    weather,
    safetyCar
  };
}
export default runStrategySimulation;
