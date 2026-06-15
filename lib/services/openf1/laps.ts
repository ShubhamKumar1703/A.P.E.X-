import { fetchFromOpenF1 } from "./client";
import { OpenF1Lap } from "./types";

/**
 * Retrieves the listing of laps completed by drivers in a specific session.
 */
export async function getLaps(sessionKey: number, driverNumber?: number): Promise<OpenF1Lap[]> {
  return await fetchFromOpenF1<OpenF1Lap[]>("/laps", { 
    session_key: sessionKey,
    driver_number: driverNumber
  });
}
