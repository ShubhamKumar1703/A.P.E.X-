/**
 * Strategy Sandbox Simulation Service Types
 */

export interface WeatherScenario {
  rainProbability: number;
  airTemperature: number;
  trackEvolution: "Low" | "Medium" | "High";
  windSpeed: number; // wind speed km/h
}

export type RaceEvent = "NONE" | "SAFETY_CAR" | "VIRTUAL_SAFETY_CAR" | "RED_FLAG";

export interface ScenarioState {
  id: string;
  name: string;
  driverNumber: number;
  driverAcronym: string;
  currentLap: number;
  currentPosition: number;
  tyreCompound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
  tyreAge: number;
  gapAhead: number; // seconds
  gapBehind: number; // seconds
  pitStopsCount: number;
  weather: WeatherScenario;
  raceEvent: RaceEvent;
  targetPitLap: number;
  nextTyreCompound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
}

// ----------------------------------------------------
// Model Results (supporting numerical + explanation payloads)
// ----------------------------------------------------

export interface TyreDegradationResult {
  paceLoss: number;          // lap time penalty in seconds
  remainingLife: number;     // remaining useful life in laps
  tyreHealthPercent: number;  // tyre health (0-100)
  explanation: string[];
}

export interface PitWindowResult {
  earliestStopLap: number;
  optimalStopLap: number;
  latestStopLap: number;
  explanation: string[];
}

export interface UndercutResult {
  probability: number;       // percentage (0-100)
  estimatedGainSeconds: number;
  recommendedPitLap: number;
  confidenceScore: number;   // score (0-100)
  explanation: string[];
}

export interface WeatherModelResult {
  tyreSuitability: "Optimal" | "Sub-Optimal" | "Dangerous";
  pitUrgency: "None" | "Low" | "Moderate" | "High" | "Immediate";
  trackEvolutionImpact: "Favorable" | "Neutral" | "Unfavorable";
  rainRiskScore: number;     // score (0-100)
  explanation: string[];
}

export interface SafetyCarResult {
  shouldPit: boolean;
  timeSavedSeconds: number;
  doubleStackRisk: boolean;
  actionRecommendation: string;
  explanation: string[];
}

// ----------------------------------------------------
// Unified Simulator Result
// ----------------------------------------------------

export interface SimulationResult {
  predictedPosition: number;
  recommendedPitLap: number;
  recommendedNextCompound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
  riskScore: number;        // score (0-100)
  opportunityScore: number; // score (0-100)
  
  // Model specific outputs
  tyre: TyreDegradationResult;
  pitWindow: PitWindowResult;
  undercut: UndercutResult;
  weather: WeatherModelResult;
  safetyCar: SafetyCarResult;
  
  // Strategy sequence
  pitSequence: {
    lap: number;
    action: string;
    compound: string;
  }[];
  
  // Pace projection curve (lap number vs simulated lap time loss)
  paceProjection: {
    lap: number;
    tyreAge: number;
    paceLoss: number;
  }[];
}
