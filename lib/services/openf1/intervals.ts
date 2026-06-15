import { fetchFromOpenF1 } from "./client";
import { OpenF1Interval } from "./types";

/**
 * Retrieves timing gap intervals to leader and driver ahead in a session.
 */
export async function getIntervals(sessionKey: number, driverNumber?: number): Promise<OpenF1Interval[]> {
  return await fetchFromOpenF1<OpenF1Interval[]>("/intervals", { 
    session_key: sessionKey,
    driver_number: driverNumber
  });
}
