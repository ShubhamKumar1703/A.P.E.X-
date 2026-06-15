/**
 * OpenF1 API Typings
 * Represents flat JSON responses returned by the api.openf1.org endpoints.
 */

export interface OpenF1Session {
  meeting_key: number;
  session_key: number;
  session_name: string;
  date_start: string;
  date_end: string;
  gmt_offset: string;
  location: string;
  country_key: number;
  circuit_key: number;
  circuit_short_name: string;
  year: number;
}

export interface OpenF1Driver {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  broadcast_name: string;
  full_name: string;
  name_acronym: string;
  team_name: string;
  team_colour: string; // e.g. "FF8000" or hex code without hash
  first_name: string;
  last_name: string;
  headshot_url: string | null;
  country_code: string | null;
}

export interface OpenF1Lap {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  lap_number: number;
  lap_duration: number | null; // in seconds
  is_pit_out_lap: boolean;
  duration_sector_1: number | null;
  duration_sector_2: number | null;
  duration_sector_3: number | null;
  i1_speed: number | null;
  i2_speed: number | null;
  stfl_speed: number | null;
}

export interface OpenF1Stint {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  stint_number: number;
  lap_start: number;
  lap_end: number;
  compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET" | "UNKNOWN";
  tyre_age_at_start: number;
}

export interface OpenF1Interval {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  gap_to_leader: number | null; // in seconds
  interval: number | null; // in seconds to driver ahead
  date: string; // ISO timestamp
}

export interface OpenF1PitStop {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  lap_number: number;
  pit_duration: number | null; // in seconds
  date: string;
}

export interface OpenF1CarData {
  session_key: number;
  meeting_key: number;
  driver_number: number;
  date: string;
  speed: number;
  rpm: number;
  gear: number;
  throttle: number; // 0-100
  brake: number; // 0 or 100 / boolean-like
  drs: number; // 8 or 10 or boolean-like
}

export interface OpenF1RaceControl {
  session_key: number;
  meeting_key: number;
  date: string;
  category: "Flag" | "SafetyCar" | "TrackStatus" | "Other";
  flag: "GREEN" | "YELLOW" | "RED" | "BLUE" | "BLACK" | "WHITE" | "DOUBLE YELLOW" | "CLEAR" | null;
  scope: string | null;
  message: string;
  lap_number: number | null;
}
