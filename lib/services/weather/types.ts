/**
 * Weather Intelligence Service Types
 */

export interface RawWeatherData {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    weather_code: number[];
  };
}

export interface WeatherAnalysis {
  rainRisk: "None" | "Low" | "Moderate" | "High";
  trackEvolution: "Low" | "Medium" | "High";
  tyreManagementRisk: "Low" | "Medium" | "High";
  windSensitivity: "None" | "Low" | "Elevated" | "Severe";
  tempTrend: "Cooling Trend" | "Heating Trend" | "Stable Temperature";
  weatherVolatility: "Stable" | "Volatile";
  rainRiskReason?: string;
  windImpactReason?: string;
}

export interface WeatherForecastPoint {
  time: string;
  temp: number;
  humidity: number;
  rainProb: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  analysis: WeatherAnalysis;
}

export interface WeatherContext {
  airTemp: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  analysis: WeatherAnalysis;
  
  // Reusable hourly forecast for general dashboard display
  hourlyForecast: {
    time: string;
    temp: number;
    rainProb: number;
    windSpeed: number;
    weatherCode: number;
  }[];

  // High-resolution forecast deltas for strategy simulation queries
  forecasts: {
    current: WeatherForecastPoint;
    plus15m: WeatherForecastPoint;
    plus30m: WeatherForecastPoint;
    plus60m: WeatherForecastPoint;
  };
}
