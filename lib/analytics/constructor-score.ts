import { F1RaceResult } from "../services/f1/types";

export interface ConstructorPerformance {
  teamId: string;
  teamName: string;
  teamColor: string;
  points: number;
  averagePosition: number;
  positionGain: number;
  driversCount: number;
}

/**
 * Aggregates race results to analyze team performance (points, average finish, net gains).
 */
export function calculateConstructorPerformance(results: F1RaceResult[]): ConstructorPerformance[] {
  if (!results || results.length === 0) return [];

  const teamMap: Record<string, {
    teamName: string;
    teamColor: string;
    points: number;
    posSum: number;
    gainSum: number;
    count: number;
  }> = {};

  results.forEach((r) => {
    if (!teamMap[r.teamId]) {
      teamMap[r.teamId] = {
        teamName: r.teamName,
        teamColor: r.teamColor,
        points: 0,
        posSum: 0,
        gainSum: 0,
        count: 0
      };
    }
    
    const team = teamMap[r.teamId];
    team.points += r.points;
    team.posSum += r.position;
    team.gainSum += (r.grid - r.position);
    team.count += 1;
  });

  return Object.entries(teamMap).map(([teamId, data]) => ({
    teamId,
    teamName: data.teamName,
    teamColor: data.teamColor,
    points: data.points,
    averagePosition: parseFloat((data.posSum / data.count).toFixed(1)),
    positionGain: data.gainSum,
    driversCount: data.count
  })).sort((a, b) => {
    // Sort by points desc, then by position gain desc, then average position asc
    if (b.points !== a.points) return b.points - a.points;
    if (b.positionGain !== a.positionGain) return b.positionGain - a.positionGain;
    return a.averagePosition - b.averagePosition;
  });
}

/**
 * Gets the constructor that performed best in this race.
 */
export function getBestConstructorPerformance(results: F1RaceResult[]): ConstructorPerformance | null {
  const performances = calculateConstructorPerformance(results);
  return performances.length > 0 ? performances[0] : null;
}
