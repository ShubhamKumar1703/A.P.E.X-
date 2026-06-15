import { RawWeatherData, WeatherContext } from "./types";
import { buildWeatherContext } from "./weather-context";

/**
 * Fetches current weather conditions and hourly forecasts for a circuit coordinate from Open-Meteo.
 * Gracefully returns null on API failures or downtimes.
 */
export async function fetchCircuitWeather(latitude: number, longitude: number): Promise<WeatherContext | null> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto&forecast_days=1`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error(`Open-Meteo API responded with status: ${res.status}`);
    }

    const data = await res.json() as RawWeatherData;
    
    if (!data.current || !data.hourly) {
      throw new Error("Open-Meteo response payload is missing current/hourly objects");
    }

    return buildWeatherContext(data);
  } catch (err) {
    console.error(`[WEATHER API ERROR]: Failed to fetch weather for coordinates (${latitude}, ${longitude}):`, err);
    return null;
  }
}
