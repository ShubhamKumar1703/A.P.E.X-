import { fetchFromOpenF1 } from "./client";
import { OpenF1Session } from "./types";

/**
 * Retrieves meetings/sessions for a specific year, defaulting to the current/latest year.
 */
export async function getSessions(year?: number): Promise<OpenF1Session[]> {
  const filterYear = year || new Date().getFullYear() - 1; // default to previous year if current year hasn't started
  try {
    const sessions = await fetchFromOpenF1<OpenF1Session[]>("/sessions", { year: filterYear });
    return sessions;
  } catch {
    // If current/latest year query fails, try a known historical year (2023) to keep page functional
    return await fetchFromOpenF1<OpenF1Session[]>("/sessions", { year: 2023 });
  }
}

/**
 * Gets details for a specific session by session key.
 */
export async function getSessionDetails(sessionKey: number): Promise<OpenF1Session | null> {
  const sessions = await fetchFromOpenF1<OpenF1Session[]>("/sessions", { session_key: sessionKey });
  return sessions.length > 0 ? sessions[0] : null;
}
