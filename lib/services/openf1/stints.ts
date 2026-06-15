import { fetchFromOpenF1 } from "./client";
import { OpenF1Stint } from "./types";

/**
 * Retrieves the tire compound stints for a specific session.
 */
export async function getStints(sessionKey: number, driverNumber?: number): Promise<OpenF1Stint[]> {
  return await fetchFromOpenF1<OpenF1Stint[]>("/stints", { 
    session_key: sessionKey,
    driver_number: driverNumber
  });
}
