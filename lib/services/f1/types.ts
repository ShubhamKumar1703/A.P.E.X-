/**
 * A.P.E.X. F1 API Service Types
 * Defines interfaces for raw Jolpica/Ergast API JSON responses and cleaned client models.
 */

// Cleaned F1 Models used in UI
export interface F1Race {
  round: number;
  raceName: string;
  circuitId: string;
  circuitName: string;
  locality: string;
  country: string;
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM:SSZ"
  status: "COMPLETED" | "UPCOMING" | "CURRENT_WEEKEND";
  firstPracticeDate?: string;
  secondPracticeDate?: string;
  thirdPracticeDate?: string;
  qualifyingDate?: string;
}

export interface F1DriverStanding {
  position: number;
  points: number;
  wins: number;
  driverId: string;
  code: string;
  number: string;
  firstName: string;
  lastName: string;
  teamId: string;
  teamName: string;
  teamColor: string;
  nationality: string;
}

export interface F1ConstructorStanding {
  position: number;
  points: number;
  wins: number;
  teamId: string;
  teamName: string;
  teamColor: string;
  nationality: string;
}

// Raw API Response interfaces
export interface ErgastApiResponse {
  MRData: {
    xmlns: string;
    series: string;
    url: string;
    limit: string;
    offset: string;
    total: string;
    RaceTable?: {
      season: string;
      Races: RawApiRace[];
    };
    StandingsTable?: {
      season: string;
      StandingsLists: RawApiStandingsList[];
    };
  };
}

export interface RawApiRace {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: {
    circuitId: string;
    url: string;
    circuitName: string;
    Location: {
      lat: string;
      long: string;
      locality: string;
      country: string;
    };
  };
  date: string;
  time: string;
  FirstPractice?: { date: string; time?: string };
  SecondPractice?: { date: string; time?: string };
  ThirdPractice?: { date: string; time?: string };
  Qualifying?: { date: string; time?: string };
  Results?: RawApiRaceResult[];
  QualifyingResults?: RawApiQualifyingResult[];
}

export interface RawApiStandingsList {
  season: string;
  round: string;
  DriverStandings?: RawApiDriverStanding[];
  ConstructorStandings?: RawApiConstructorStanding[];
}

export interface RawApiDriverStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    permanentNumber?: string;
    code?: string;
    url: string;
    givenName: string;
    familyName: string;
    dateOfBirth: string;
    nationality: string;
  };
  Constructors: {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  }[];
}

export interface RawApiConstructorStanding {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    url: string;
    name: string;
    nationality: string;
  };
}

// Cleaned models for race and qualifying results
export interface F1RaceResult {
  position: number;
  points: number;
  grid: number;
  laps: number;
  status: string;
  driverId: string;
  code: string;
  number: string;
  firstName: string;
  lastName: string;
  teamId: string;
  teamName: string;
  teamColor: string;
  nationality: string;
  time?: string;
  fastestLapTime?: string;
  fastestLapRank?: number;
  fastestLapLap?: number;
}

export interface F1QualifyingResult {
  position: number;
  number: string;
  driverId: string;
  code: string;
  firstName: string;
  lastName: string;
  teamId: string;
  teamName: string;
  teamColor: string;
  nationality: string;
  q1?: string;
  q2?: string;
  q3?: string;
}

// Raw API response result sub-structures
export interface RawApiRaceResult {
  position: string;
  points: string;
  grid: string;
  laps: string;
  status: string;
  Driver: {
    driverId: string;
    permanentNumber?: string;
    code?: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
  Constructor: {
    constructorId: string;
    name: string;
  };
  Time?: {
    millis: string;
    time: string;
  };
  FastestLap?: {
    rank: string;
    lap: string;
    Time: {
      time: string;
    };
  };
}

export interface RawApiQualifyingResult {
  number: string;
  position: string;
  Driver: {
    driverId: string;
    code?: string;
    givenName: string;
    familyName: string;
    nationality: string;
  };
  Constructor: {
    constructorId: string;
    name: string;
  };
  Q1?: string;
  Q2?: string;
  Q3?: string;
}

