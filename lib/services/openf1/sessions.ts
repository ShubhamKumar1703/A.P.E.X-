import { fetchFromOpenF1 } from "./client";
import { OpenF1Session } from "./types";

/**
 * Retrieves meetings/sessions for a specific year, defaulting to the current/latest year.
 */
export async function getSessions(year?: number): Promise<OpenF1Session[]> {
  const filterYear = year || 2026;
  try {
    return await fetchFromOpenF1<OpenF1Session[]>("/sessions", { year: filterYear });
  } catch (err) {
    console.error("Failed to retrieve 2026 sessions:", err);
    return [];
  }
}

/**
 * Gets details for a specific session by session key.
 */
export async function getSessionDetails(sessionKey: number): Promise<OpenF1Session | null> {
  const sessions = await fetchFromOpenF1<OpenF1Session[]>("/sessions", { session_key: sessionKey });
  return sessions.length > 0 ? sessions[0] : null;
}
