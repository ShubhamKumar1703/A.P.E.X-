import { F1RaceResult } from "../services/f1/types";

export interface RecoveryDriveInfo {
  driver: F1RaceResult;
  score: number;
}

/**
 * Calculates a recovery score for a driver.
 * Recovery is defined as starting lower and finishing higher.
 * Formula weighs position gain by starting position (starting back and progressing is harder).
 */
export function calculateRecoveryScore(driver: F1RaceResult): number {
  const gain = driver.grid - driver.position;
  if (gain <= 0) return 0;
  
  // Base score is the position gain
  // Multiplier increases with a lower starting grid position (e.g. grid P20 gets a higher multiplier than P10)
  const gridWeight = 1 + (driver.grid - 1) / 10;
  return parseFloat((gain * gridWeight).toFixed(2));
}

/**
 * Identifies the driver with the highest recovery score.
 */
export function getStrongestRecoveryDrive(results: F1RaceResult[]): RecoveryDriveInfo | null {
  if (!results || results.length === 0) return null;
  
  let bestDriver: F1RaceResult | null = null;
  let maxScore = -1;
  
  results.forEach((r) => {
    const score = calculateRecoveryScore(r);
    if (score > maxScore) {
      maxScore = score;
      bestDriver = r;
    }
  });
  
  if (!bestDriver || maxScore <= 0) {
    // If no one made any recovery, default to biggest gainer (or null)
    return null;
  }
  
  return {
    driver: bestDriver,
    score: maxScore
  };
}
