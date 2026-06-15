import { fetchFromOpenF1 } from "./client";
import { OpenF1PitStop } from "./types";

/**
 * Retrieves the pit lane entry/stop logs.
 */
export async function getPitStops(sessionKey: number, driverNumber?: number): Promise<OpenF1PitStop[]> {
  return await fetchFromOpenF1<OpenF1PitStop[]>("/pit", { 
    session_key: sessionKey,
    driver_number: driverNumber
  });
}
