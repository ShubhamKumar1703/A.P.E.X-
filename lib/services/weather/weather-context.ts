import { RawWeatherData, WeatherContext, WeatherForecastPoint } from "./types";
import { analyzeWeatherState } from "./weather-analysis";

/**
 * Maps standard WMO Weather Codes to readable description tags.
 */
export function getWeatherDescription(code: number): string {
  switch (code) {
    case 0: return "Clear Sky";
    case 1: return "Mainly Clear";
    case 2: return "Partly Cloudy";
    case 3: return "Overcast";
    case 45:
    case 48: return "Fog / Mist";
    case 51:
    case 53:
    case 55: return "Light Drizzle";
    case 56:
    case 57: return "Freezing Drizzle";
    case 61: return "Light Rain";
    case 63: return "Moderate Rain";
    case 65: return "Heavy Rain";
    case 66:
    case 67: return "Freezing Rain";
    case 71: return "Light Snow";
    case 73: return "Moderate Snow";
    case 75: return "Heavy Snow";
    case 77: return "Snow Grains";
    case 80: return "Light Rain Showers";
    case 81: return "Moderate Rain Showers";
    case 82: return "Heavy Rain Showers";
    case 85:
    case 86: return "Snow Showers";
    case 95: return "Thunderstorm";
    case 96:
    case 99: return "Thunderstorm with Hail";
    default: return "Variable Conditions";
  }
}

/**
 * Linearly interpolates value at a target date between two closest timestamps in a list.
 */
function interpolateValue(targetTime: Date, times: string[], values: number[]): number {
  if (times.length === 0 || values.length === 0) return 0;
  
  const targetMs = targetTime.getTime();
  
  // Underflow: clamp to first
  const firstMs = new Date(times[0]).getTime();
  if (targetMs <= firstMs) return values[0];
  
  // Overflow: clamp to last
  const lastMs = new Date(times[times.length - 1]).getTime();
  if (targetMs >= lastMs) return values[values.length - 1];

  // Find bounding interval
  for (let i = 0; i < times.length - 1; i++) {
    const t0 = new Date(times[i]).getTime();
    const t1 = new Date(times[i + 1]).getTime();
    
    if (targetMs >= t0 && targetMs <= t1) {
      const denom = t1 - t0;
      if (denom === 0) return values[i];
      const factor = (targetMs - t0) / denom;
      return values[i] + factor * (values[i + 1] - values[i]);
    }
  }

  return values[values.length - 1];
}

/**
 * Retrieves the closest discrete value (e.g. weather code) without interpolation.
 */
function getClosestDiscreteValue(targetTime: Date, times: string[], values: number[]): number {
  if (times.length === 0 || values.length === 0) return 0;
  
  const targetMs = targetTime.getTime();
  let minDiff = Infinity;
  let closestIndex = 0;

  for (let i = 0; i < times.length; i++) {
    const diff = Math.abs(new Date(times[i]).getTime() - targetMs);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  }

  return values[closestIndex];
}

/**
 * Assembles a high-resolution WeatherForecastPoint at a offset (in minutes) from the current time.
 */
function compileForecastPoint(
  currentTimeStr: string,
  offsetMinutes: number,
  raw: RawWeatherData
): WeatherForecastPoint {
  const baseTime = new Date(currentTimeStr);
  const targetTime = new Date(baseTime.getTime() + offsetMinutes * 60 * 1000);

  const temp = parseFloat(interpolateValue(targetTime, raw.hourly.time, raw.hourly.temperature_2m).toFixed(1));
  const humidity = Math.round(interpolateValue(targetTime, raw.hourly.time, raw.hourly.relative_humidity_2m));
  const rainProb = Math.round(interpolateValue(targetTime, raw.hourly.time, raw.hourly.precipitation_probability));
  const precipitation = parseFloat(interpolateValue(targetTime, raw.hourly.time, raw.hourly.precipitation).toFixed(2));
  const windSpeed = parseFloat(interpolateValue(targetTime, raw.hourly.time, raw.hourly.wind_speed_10m).toFixed(1));
  const windDirection = Math.round(interpolateValue(targetTime, raw.hourly.time, raw.hourly.wind_direction_10m));
  const weatherCode = getClosestDiscreteValue(targetTime, raw.hourly.time, raw.hourly.weather_code);

  // Compile trend lists (next 3 hours from targetTime)
  const tempTrendList: number[] = [];
  const rainProbTrendList: number[] = [];
  for (let i = 1; i <= 3; i++) {
    const trendTime = new Date(targetTime.getTime() + i * 60 * 60 * 1000);
    tempTrendList.push(interpolateValue(trendTime, raw.hourly.time, raw.hourly.temperature_2m));
    rainProbTrendList.push(interpolateValue(trendTime, raw.hourly.time, raw.hourly.precipitation_probability));
  }

  const analysis = analyzeWeatherState(
    temp,
    humidity,
    rainProb,
    precipitation,
    windSpeed,
    windDirection,
    tempTrendList,
    rainProbTrendList
  );

  return {
    time: targetTime.toISOString(),
    temp,
    humidity,
    rainProb,
    precipitation,
    windSpeed,
    windDirection,
    weatherCode,
    analysis
  };
}

/**
 * Builds the comprehensive WeatherContext from raw Open-Meteo data.
 */
export function buildWeatherContext(raw: RawWeatherData): WeatherContext {
  const current = raw.current;
  const currentTimeStr = current.time;

  // 1. Compile Current Forecast trends
  const tempTrendList: number[] = [];
  const rainProbTrendList: number[] = [];
  for (let i = 1; i <= 3; i++) {
    const trendTime = new Date(new Date(currentTimeStr).getTime() + i * 60 * 60 * 1000);
    tempTrendList.push(interpolateValue(trendTime, raw.hourly.time, raw.hourly.temperature_2m));
    rainProbTrendList.push(interpolateValue(trendTime, raw.hourly.time, raw.hourly.precipitation_probability));
  }

  const currentAnalysis = analyzeWeatherState(
    current.temperature_2m,
    current.relative_humidity_2m,
    raw.hourly.precipitation_probability.length > 0 ? raw.hourly.precipitation_probability[0] : 0,
    current.precipitation,
    current.wind_speed_10m,
    current.wind_direction_10m,
    tempTrendList,
    rainProbTrendList
  );

  // 2. Map Reusable Hourly Forecast (e.g. next 6 hourly intervals)
  const hourlyForecast: WeatherContext["hourlyForecast"] = [];
  const startIdx = raw.hourly.time.findIndex(t => new Date(t).getTime() >= new Date(currentTimeStr).getTime());
  const useStartIdx = startIdx === -1 ? 0 : startIdx;

  for (let i = useStartIdx; i < Math.min(useStartIdx + 6, raw.hourly.time.length); i++) {
    hourlyForecast.push({
      time: raw.hourly.time[i],
      temp: raw.hourly.temperature_2m[i],
      rainProb: raw.hourly.precipitation_probability[i],
      windSpeed: raw.hourly.wind_speed_10m[i],
      weatherCode: raw.hourly.weather_code[i]
    });
  }

  // 3. Compile High-Resolution Strategy offsets (+0m, +15m, +30m, +60m)
  const currentPoint = compileForecastPoint(currentTimeStr, 0, raw);
  const plus15m = compileForecastPoint(currentTimeStr, 15, raw);
  const plus30m = compileForecastPoint(currentTimeStr, 30, raw);
  const plus60m = compileForecastPoint(currentTimeStr, 60, raw);

  return {
    airTemp: current.temperature_2m,
    humidity: current.relative_humidity_2m,
    precipitation: current.precipitation,
    windSpeed: current.wind_speed_10m,
    windDirection: current.wind_direction_10m,
    weatherCode: current.weather_code,
    analysis: currentAnalysis,
    hourlyForecast,
    forecasts: {
      current: currentPoint,
      plus15m,
      plus30m,
      plus60m
    }
  };
}
