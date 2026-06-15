import { fetchFromOpenF1 } from "./client";
import { OpenF1Session } from "./types";

/**
 * Retrieves meetings/sessions for a specific year, defaulting to the current/latest year.
 */
export async function getSessions(year?: number): Promise<OpenF1Session[]> {
  const currentYear = new Date().getFullYear();
  const filterYear = year || currentYear;
  try {
    const sessions = await fetchFromOpenF1<OpenF1Session[]>("/sessions", { year: filterYear });
    if (sessions && sessions.length > 0) {
      return sessions;
    }
    // If current year returns no sessions, try the previous year
    if (!year) {
      const prevYearSessions = await fetchFromOpenF1<OpenF1Session[]>("/sessions", { year: currentYear - 1 });
      if (prevYearSessions && prevYearSessions.length > 0) {
        return prevYearSessions;
      }
    }
    return sessions;
  } catch {
    // If latest year queries fail, try a known historical year (2023) to keep page functional
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
