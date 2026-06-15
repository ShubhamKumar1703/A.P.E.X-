import { fetchFromOpenF1 } from "./client";
import { OpenF1CarData } from "./types";

/**
 * Retrieves speed, gear, throttle, brake, and RPM telemetry samples for a driver.
 */
export async function getCarData(
  sessionKey: number, 
  driverNumber: number
): Promise<OpenF1CarData[]> {
  try {
    // OpenF1 car_data returns high frequency stream.
    // Fetching the raw list; usually we want the most recent records.
    // We fetch a list filtered by session and driver.
    const rawData = await fetchFromOpenF1<OpenF1CarData[]>("/car_data", {
      session_key: sessionKey,
      driver_number: driverNumber
    });
    
    // Slice the last 30 elements to prevent front-end lag and keep chart rendering performant
    return rawData.slice(-30);
  } catch (err) {
    console.error(`Failed to fetch telemetry for driver ${driverNumber}:`, err);
    return [];
  }
}
