/**
 * Races Service
 * Fetches the race calendar, individual GP details, and session results from the F1 API.
 */

import { fetchFromJolpica } from "./jolpica";
import { getTeamColor } from "./standings";
import { 
  ErgastApiResponse, 
  F1Race, 
  F1RaceResult, 
  F1QualifyingResult, 
  RawApiRace, 
  RawApiRaceResult, 
  RawApiQualifyingResult 
} from "./types";

/**
 * Retrieves the current season's race schedule.
 * Automatically classifies races relative to the system date.
 */
export async function getCurrentCalendar(): Promise<F1Race[]> {
  const rawData = await fetchFromJolpica<ErgastApiResponse>("/current.json");
  const rawRaces = rawData.MRData.RaceTable?.Races || [];
  
  // Set system reference time to the user context current time (2026-06-15)
  const systemTime = new Date("2026-06-15T13:50:53Z");

  return rawRaces.map((raw: RawApiRace): F1Race => {
    const round = parseInt(raw.round, 10);
    const raceDateTime = new Date(`${raw.date}T${raw.time || "00:00:00Z"}`);
    
    // Practice date boundaries for determining active weekend
    const practiceDateTime = raw.FirstPractice 
      ? new Date(`${raw.FirstPractice.date}T${raw.FirstPractice.time || "00:00:00Z"}`)
      : new Date(raceDateTime.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days before race

    let status: "COMPLETED" | "UPCOMING" | "CURRENT_WEEKEND" = "UPCOMING";

    if (systemTime > raceDateTime) {
      status = "COMPLETED";
    } else if (systemTime >= practiceDateTime && systemTime <= raceDateTime) {
      status = "CURRENT_WEEKEND";
    } else {
      status = "UPCOMING";
    }

    return {
      round,
      raceName: raw.raceName,
      circuitId: raw.Circuit.circuitId,
      circuitName: raw.Circuit.circuitName,
      locality: raw.Circuit.Location.locality,
      country: raw.Circuit.Location.country,
      date: raw.date,
      time: raw.time,
      status,
      firstPracticeDate: raw.FirstPractice?.date,
      secondPracticeDate: raw.SecondPractice?.date,
      thirdPracticeDate: raw.ThirdPractice?.date,
      qualifyingDate: raw.Qualifying?.date
    };
  });
}

/**
 * Retrieves details for a specific race round.
 */
export async function getRaceDetails(round: number): Promise<F1Race | null> {
  const races = await getCurrentCalendar();
  return races.find(r => r.round === round) || null;
}

/**
 * Retrieves the results of a specific race round.
 */
export async function getRaceResults(round: number): Promise<F1RaceResult[]> {
  const rawData = await fetchFromJolpica<ErgastApiResponse>(`/current/${round}/results.json`);
  const race = rawData.MRData.RaceTable?.Races?.[0];
  const results: RawApiRaceResult[] = race?.Results || [];

  return results.map((raw: RawApiRaceResult): F1RaceResult => {
    return {
      position: parseInt(raw.position, 10),
      points: parseFloat(raw.points),
      grid: parseInt(raw.grid, 10),
      laps: parseInt(raw.laps, 10),
      status: raw.status,
      driverId: raw.Driver.driverId,
      code: raw.Driver.code || raw.Driver.familyName.slice(0, 3).toUpperCase(),
      number: raw.Driver.permanentNumber || raw.grid,
      firstName: raw.Driver.givenName,
      lastName: raw.Driver.familyName,
      teamId: raw.Constructor.constructorId,
      teamName: raw.Constructor.name,
      teamColor: getTeamColor(raw.Constructor.constructorId),
      nationality: raw.Driver.nationality,
      time: raw.Time?.time,
      fastestLapTime: raw.FastestLap?.Time?.time,
      fastestLapRank: raw.FastestLap ? parseInt(raw.FastestLap.rank, 10) : undefined,
      fastestLapLap: raw.FastestLap ? parseInt(raw.FastestLap.lap, 10) : undefined
    };
  });
}

/**
 * Retrieves the qualifying results of a specific race round.
 */
export async function getQualifyingResults(round: number): Promise<F1QualifyingResult[]> {
  const rawData = await fetchFromJolpica<ErgastApiResponse>(`/current/${round}/qualifying.json`);
  const race = rawData.MRData.RaceTable?.Races?.[0];
  const results: RawApiQualifyingResult[] = race?.QualifyingResults || [];

  return results.map((raw: RawApiQualifyingResult): F1QualifyingResult => {
    return {
      position: parseInt(raw.position, 10),
      number: raw.number,
      driverId: raw.Driver.driverId,
      code: raw.Driver.code || raw.Driver.familyName.slice(0, 3).toUpperCase(),
      firstName: raw.Driver.givenName,
      lastName: raw.Driver.familyName,
      teamId: raw.Constructor.constructorId,
      teamName: raw.Constructor.name,
      teamColor: getTeamColor(raw.Constructor.constructorId),
      nationality: raw.Driver.nationality,
      q1: raw.Q1,
      q2: raw.Q2,
      q3: raw.Q3
    };
  });
}
