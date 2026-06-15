import { WeatherAnalysis } from "./types";

/**
 * Generates a deterministic WeatherAnalysis object based on current conditions and upcoming trends.
 */
export function analyzeWeatherState(
  temp: number,
  humidity: number,
  rainProb: number,
  precip: number,
  windSpeed: number,
  windDir: number,
  tempTrendList: number[] = [],
  rainProbTrendList: number[] = []
): WeatherAnalysis {
  // 1. Rain Risk Calculation
  let rainRisk: WeatherAnalysis["rainRisk"] = "None";
  let rainRiskReason = "Dry track conditions expected.";

  if (precip > 1.5 || rainProb >= 60) {
    rainRisk = "High";
    rainRiskReason = `Heavy precipitation risk detected (${rainProb}% probability, ${precip}mm). Expect wet track conditions.`;
  } else if (precip > 0.0 || rainProb >= 30) {
    rainRisk = "Moderate";
    rainRiskReason = `Moderate risk of light showers (${rainProb}% probability). Radar tracking active.`;
  } else if (rainProb >= 10) {
    rainRisk = "Low";
    rainRiskReason = `Low probability of rain (${rainProb}%). Track expected to remain dry.`;
  }

  // 2. Track Evolution
  let trackEvolution: WeatherAnalysis["trackEvolution"] = "Medium";
  if (precip > 0.0 || rainProb >= 50) {
    trackEvolution = "Low"; // Rain washes off rubber, track grip resets
  } else if (temp >= 28.0) {
    trackEvolution = "High"; // Hot temperatures dry the track, improving tyre rubber bonding
  }

  // 3. Tyre Management Risk
  let tyreManagementRisk: WeatherAnalysis["tyreManagementRisk"] = "Medium";
  if (temp >= 30.0) {
    tyreManagementRisk = "High"; // High ambient temperature accelerates thermal degradation
  } else if (temp < 18.0) {
    tyreManagementRisk = "Low"; // Cold ambient temperature reduces thermal degradation but increases graining risk
  }

  // 4. Wind Impact
  let windSensitivity: WeatherAnalysis["windSensitivity"] = "None";
  let windImpactReason = "Calm wind conditions.";

  if (windSpeed > 35.0) {
    windSensitivity = "Severe";
    windImpactReason = `High-velocity gusts (${windSpeed} km/h) will severely destabilize vehicle aerodynamics in fast corners.`;
  } else if (windSpeed >= 20.0) {
    windSensitivity = "Elevated";
    windImpactReason = `Moderate wind speeds (${windSpeed} km/h) from ${windDir}° will affect DRS zones and braking stability.`;
  } else if (windSpeed >= 10.0) {
    windSensitivity = "Low";
    windImpactReason = `Light breeze (${windSpeed} km/h). Minimal impact on aerodynamic balance.`;
  }

  // 5. Temperature Trend (Cooling vs Heating over next 3 hours)
  let tempTrend: WeatherAnalysis["tempTrend"] = "Stable Temperature";
  if (tempTrendList.length >= 3) {
    const delta = tempTrendList[2] - temp;
    if (delta < -1.5) {
      tempTrend = "Cooling Trend";
    } else if (delta > 1.5) {
      tempTrend = "Heating Trend";
    }
  }

  // 6. Weather Volatility (Rain probability shifts)
  let weatherVolatility: WeatherAnalysis["weatherVolatility"] = "Stable";
  if (rainProbTrendList.length >= 3) {
    for (const p of rainProbTrendList) {
      if (Math.abs(p - rainProb) >= 30) {
        weatherVolatility = "Volatile";
        break;
      }
    }
  }

  return {
    rainRisk,
    trackEvolution,
    tyreManagementRisk,
    windSensitivity,
    tempTrend,
    weatherVolatility,
    rainRiskReason,
    windImpactReason
  };
}
