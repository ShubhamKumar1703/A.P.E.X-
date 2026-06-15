/**
 * Standings Service
 * Fetches and transforms Driver and Constructor Standings.
 */

import { fetchFromJolpica } from "./jolpica";
import { 
  ErgastApiResponse, 
  F1DriverStanding, 
  F1ConstructorStanding, 
  RawApiDriverStanding, 
  RawApiConstructorStanding 
} from "./types";

// Official F1 Constructor Color Codes
export const CONSTRUCTOR_COLORS: Record<string, string> = {
  mercedes: "#27F4D2", // Petronas Mint
  red_bull: "#3671C6", // RB Blue
  ferrari: "#E80020", // Scuderia Red
  mclaren: "#FF8000", // Papaya Orange
  aston_martin: "#229971", // British Racing Green
  alpine: "#0093cc", // Alpine Blue
  williams: "#64C4FF", // Williams Blue
  haas: "#B6BABD", // Haas Grey/Red
  sauber: "#52E252", // Stake Neon Green
  rb: "#6692FF", // VCARB Blue
  kick_sauber: "#52E252"
};

/**
 * Gets a constructor brand color, defaulting to zinc if not recognized.
 */
export function getTeamColor(constructorId: string): string {
  const normalized = constructorId.toLowerCase().replace(/[\s-]/g, "_");
  return CONSTRUCTOR_COLORS[normalized] || CONSTRUCTOR_COLORS[constructorId] || "#71717A";
}

/**
 * Retrieves the current season's driver standings.
 */
export async function getDriverStandings(): Promise<F1DriverStanding[]> {
  const rawData = await fetchFromJolpica<ErgastApiResponse>("/current/driverStandings.json");
  const standingsList = rawData.MRData.StandingsTable?.StandingsLists?.[0];
  const driverStandings = standingsList?.DriverStandings || [];

  return driverStandings.map((raw: RawApiDriverStanding): F1DriverStanding => {
    const activeConstructor = raw.Constructors?.[0] || {
      constructorId: "unknown",
      name: "Privateer",
      nationality: "Unknown"
    };

    return {
      position: parseInt(raw.position, 10),
      points: parseFloat(raw.points),
      wins: parseInt(raw.wins, 10),
      driverId: raw.Driver.driverId,
      code: raw.Driver.code || raw.Driver.familyName.slice(0, 3).toUpperCase(),
      number: raw.Driver.permanentNumber || "N/A",
      firstName: raw.Driver.givenName,
      lastName: raw.Driver.familyName,
      teamId: activeConstructor.constructorId,
      teamName: activeConstructor.name,
      teamColor: getTeamColor(activeConstructor.constructorId),
      nationality: raw.Driver.nationality
    };
  });
}

/**
 * Retrieves the current season's constructor standings.
 */
export async function getConstructorStandings(): Promise<F1ConstructorStanding[]> {
  const rawData = await fetchFromJolpica<ErgastApiResponse>("/current/constructorStandings.json");
  const standingsList = rawData.MRData.StandingsTable?.StandingsLists?.[0];
  const constructorStandings = standingsList?.ConstructorStandings || [];

  return constructorStandings.map((raw: RawApiConstructorStanding): F1ConstructorStanding => {
    return {
      position: parseInt(raw.position, 10),
      points: parseFloat(raw.points),
      wins: parseInt(raw.wins, 10),
      teamId: raw.Constructor.constructorId,
      teamName: raw.Constructor.name,
      teamColor: getTeamColor(raw.Constructor.constructorId),
      nationality: raw.Constructor.nationality
    };
  });
}
