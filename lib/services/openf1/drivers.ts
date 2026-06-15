import { fetchFromOpenF1 } from "./client";
import { OpenF1Driver } from "./types";

/**
 * Retrieves the roster of drivers active in a specific session.
 */
export async function getDrivers(sessionKey: number): Promise<OpenF1Driver[]> {
  return await fetchFromOpenF1<OpenF1Driver[]>("/drivers", { session_key: sessionKey });
}
