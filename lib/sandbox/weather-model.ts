import { WeatherModelResult } from "./types";

/**
 * Calculates weather suitability, pit urgency, evolution impacts, and rain risk scores.
 * Follows the explanation-payload architecture.
 */
export function calculateWeatherSandbox(
  compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET",
  rainProbability: number,
  airTemperature: number,
  trackEvolution: "Low" | "Medium" | "High"
): WeatherModelResult {
  const explanation: string[] = [];
  const isDryTyre = compound === "SOFT" || compound === "MEDIUM" || compound === "HARD";
  const isWetTyre = compound === "INTERMEDIATE" || compound === "WET";

  // 1. Tyre Suitability & Pit Urgency
  let tyreSuitability: WeatherModelResult["tyreSuitability"] = "Optimal";
  let pitUrgency: WeatherModelResult["pitUrgency"] = "None";

  if (rainProbability >= 60) {
    if (isDryTyre) {
      tyreSuitability = "Dangerous";
      pitUrgency = "Immediate";
      explanation.push(`Heavy rain threat (${rainProbability}%): Dry slick tyres are highly dangerous. Risk of hydroplaning. Pit immediately.`);
    } else {
      tyreSuitability = "Optimal";
      pitUrgency = "None";
      explanation.push(`Heavy rain threat (${rainProbability}%): Wet/Intermediate tread is optimal for water displacement and track grip.`);
    }
  } else if (rainProbability >= 30) {
    if (isDryTyre) {
      tyreSuitability = "Sub-Optimal";
      pitUrgency = "Moderate";
      explanation.push(`Damp track risk (${rainProbability}%): Slick tyres operating close to structural grip limits. Monitor radar closely.`);
    } else {
      tyreSuitability = "Sub-Optimal";
      pitUrgency = "Low";
      explanation.push(`Damp track risk (${rainProbability}%): Wet/Intermediate tyres optimal if standing water occurs. Stint extension viable.`);
    }
  } else {
    // Dry track conditions (< 30% rain probability)
    if (isWetTyre) {
      tyreSuitability = "Dangerous";
      pitUrgency = "Immediate";
      explanation.push(`Dry track surface: Wet/Intermediate tyres will overheat rapidly, blister, and suffer immediate grip collapse. Pit for dry slicks.`);
    } else {
      tyreSuitability = "Optimal";
      pitUrgency = "None";
      explanation.push(`Dry track surface: Slick tyres operating within nominal operating temperature windows.`);
    }
  }

  // 2. Track Evolution
  let trackEvolutionImpact: WeatherModelResult["trackEvolutionImpact"] = "Neutral";
  if (trackEvolution === "High" && rainProbability < 30) {
    trackEvolutionImpact = "Favorable";
    explanation.push("High track evolution improves mechanical grip and lowers tyre slide wear.");
  } else if (rainProbability >= 50) {
    trackEvolutionImpact = "Unfavorable";
    explanation.push("Wet track resets rubber evolution, making the track surface slick and green.");
  } else {
    explanation.push("Standard track surface evolution provides expected grip build-up.");
  }

  // 3. Ambient temperature comments
  if (airTemperature > 30) {
    explanation.push(`Thermal warning: High air temperature (${airTemperature}°C) accelerates tread blister risks.`);
  }

  return {
    tyreSuitability,
    pitUrgency,
    trackEvolutionImpact,
    rainRiskScore: rainProbability,
    explanation
  };
}
export default calculateWeatherSandbox;
