import { fetchFromOpenF1 } from "./client";
import { OpenF1RaceControl } from "./types";

/**
 * Retrieves official flag flags and safety car updates.
 */
export async function getRaceControlMessages(sessionKey: number): Promise<OpenF1RaceControl[]> {
  return await fetchFromOpenF1<OpenF1RaceControl[]>("/race_control", { session_key: sessionKey });
}
