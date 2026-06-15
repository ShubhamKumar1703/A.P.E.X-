/**
 * A.P.E.X. Types Definitions
 * TypeScript interfaces and types for the Formula 1 Analytics Platform.
 */

export interface Race {
  round: number;
  raceName: string;
  circuitName: string;
  locality: string;
  country: string;
  date: string;
  time: string;
  laps: number;
}

export interface Driver {
  id: string;
  code: string;
  number: number;
  firstName: string;
  lastName: string;
  constructorId: string;
  constructorName: string;
  points: number;
  position: number;
  nationality: string;
}

export interface Constructor {
  id: string;
  name: string;
  points: number;
  position: number;
  nationality: string;
  color: string;
}

export interface TelemetryPoint {
  time: number; // relative seconds or distance
  speed: number; // km/h
  rpm: number;
  gear: number;
  throttle: number; // percentage 0-100
  brake: number; // percentage 0-100
  drs: boolean;
}

export interface LiveDriverTiming {
  position: number;
  driverNumber: number;
  driverCode: string;
  driverName: string;
  constructorColor: string;
  gapToLeader: string;
  interval: string;
  lastLapTime: string;
  bestLapTime: string;
  tyreCompound: "S" | "M" | "H" | "I" | "W";
  tyreAge: number; // laps
  pitStops: number;
  status: "TRACK" | "PIT" | "OUT";
}

export interface PitStop {
  round: number;
  driverId: string;
  driverCode: string;
  lap: number;
  duration: number; // seconds
  stopNumber: number;
}

export interface RacePrediction {
  driverCode: string;
  probability: number;
  predictedStrategy: string;
  confidenceScore: number;
}
