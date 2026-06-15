import { WeatherContext } from "@/lib/services/weather/types";
import { ScenarioState, SimulationResult } from "@/lib/sandbox/types";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface CompactDriverContext {
  driverNumber: number;
  acronym: string;
  fullName: string;
  teamName: string;
  position: number;
  gapToLeader: string;
  intervalAhead: string;
  tyreCompound: string;
  tyreAge: number;
  pitStopsCount: number;
  lastLapTime: string;
  bestLapTime: string;
  inPitLane: boolean;
}

export interface CompactAnalyticsContext {
  biggestGainer?: {
    driverName: string;
    gain: number;
    from: number;
    to: number;
  } | null;
  closestBattle?: {
    driverA: string;
    driverB: string;
    gapSeconds: number;
  } | null;
  bestRookie?: {
    driverName: string;
    position: number;
  } | null;
  strongestRecovery?: {
    driverName: string;
    recoveryScore: number;
    startingPosition: number;
    finishingPosition: number;
  } | null;
}

export interface CompactSessionContext {
  sessionKey: number;
  sessionName: string;
  circuitName: string;
  location: string;
  year: number;
  currentLap: number;
  totalLaps: number;
  flagStatus: "GREEN" | "YELLOW" | "RED" | "BLUE" | "CLEAR";
  trackAlert: "SAFETY_CAR" | "VIRTUAL_SAFETY_CAR" | "NONE";
  latestMessage: string;
}

export interface AICompileContext {
  session: CompactSessionContext;
  drivers: CompactDriverContext[];
  analytics: CompactAnalyticsContext;
  standingsSummary?: string;
  weather?: WeatherContext | null;
}

export interface AISandboxContext {
  isSandbox: true;
  scenarioA: ScenarioState;
  resultA: SimulationResult;
  scenarioB?: ScenarioState | null;
  resultB?: SimulationResult | null;
}
