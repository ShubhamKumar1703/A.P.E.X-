/**
 * A.P.E.X. Date and Race Status Utilities
 * Centralizes date boundaries, session active checks, and weekend statuses.
 */

/**
 * Gets the current system reference date.
 * Enforces dynamic new Date() instead of a hardcoded date.
 */
export function getSystemDate(): Date {
  return new Date();
}

/**
 * Checks if a race session has been completed relative to the current system date.
 */
export function isRaceCompleted(raceDateStr: string, raceTimeStr?: string): boolean {
  const systemTime = getSystemDate();
  const raceDateTime = new Date(`${raceDateStr}T${raceTimeStr || "00:00:00Z"}`);
  return systemTime > raceDateTime;
}

/**
 * Checks if a race is currently in its active weekend.
 * An active weekend is defined as starting from Free Practice 1 until the Grand Prix ends.
 */
export function isCurrentRaceWeekend(
  raceDateStr: string,
  raceTimeStr?: string,
  fp1DateStr?: string,
  fp1TimeStr?: string
): boolean {
  const systemTime = getSystemDate();
  const raceDateTime = new Date(`${raceDateStr}T${raceTimeStr || "00:00:00Z"}`);
  
  // FP1 is typically 2 days before the race. If fp1DateStr is missing, default to 2 days before the race.
  const fp1DateTime = fp1DateStr 
    ? new Date(`${fp1DateStr}T${fp1TimeStr || "00:00:00Z"}`)
    : new Date(raceDateTime.getTime() - 2 * 24 * 60 * 60 * 1000);
    
  return systemTime >= fp1DateTime && systemTime <= raceDateTime;
}

/**
 * Checks if a race is in the future.
 */
export function isUpcomingRace(
  raceDateStr: string,
  raceTimeStr?: string,
  fp1DateStr?: string,
  fp1TimeStr?: string
): boolean {
  const systemTime = getSystemDate();
  const raceDateTime = new Date(`${raceDateStr}T${raceTimeStr || "00:00:00Z"}`);
  
  const fp1DateTime = fp1DateStr 
    ? new Date(`${fp1DateStr}T${fp1TimeStr || "00:00:00Z"}`)
    : new Date(raceDateTime.getTime() - 2 * 24 * 60 * 60 * 1000);
    
  return systemTime < fp1DateTime;
}

/**
 * Determines the status of a race.
 */
export function getRaceStatus(
  raceDateStr: string,
  raceTimeStr?: string,
  fp1DateStr?: string,
  fp1TimeStr?: string
): "COMPLETED" | "CURRENT_WEEKEND" | "UPCOMING" {
  if (isRaceCompleted(raceDateStr, raceTimeStr)) {
    return "COMPLETED";
  }
  if (isCurrentRaceWeekend(raceDateStr, raceTimeStr, fp1DateStr, fp1TimeStr)) {
    return "CURRENT_WEEKEND";
  }
  return "UPCOMING";
}

/**
 * Checks if a session is currently active (within its start and end times).
 */
export function isActiveSession(startDateStr: string, endDateStr: string): boolean {
  const systemTime = getSystemDate();
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  return systemTime >= start && systemTime <= end;
}
