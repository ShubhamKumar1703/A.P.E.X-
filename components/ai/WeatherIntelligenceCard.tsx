import React from "react";
import { CloudSun, Wind, Droplets, ShieldAlert, Compass } from "lucide-react";
import { WeatherContext } from "@/lib/services/weather/types";
import { getWeatherDescription } from "@/lib/services/weather/weather-context";

interface WeatherIntelligenceCardProps {
  weather?: WeatherContext | null;
  isLoading?: boolean;
}

export function WeatherIntelligenceCard({ weather, isLoading }: WeatherIntelligenceCardProps) {
  if (isLoading) {
    return (
      <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-3.5 space-y-3 font-mono text-[10px] animate-pulse">
        <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-2">
          <CloudSun size={12} className="text-zinc-700 animate-spin" />
          <span className="font-bold text-zinc-500 uppercase tracking-wider">
            ENVIRONMENT SENSORS // CONNECTING...
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-zinc-950 p-2 rounded border border-zinc-900 h-10" />
          ))}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="border border-red-950/20 bg-red-950/5 rounded-xl p-3.5 space-y-3 font-mono text-[10px]">
        <div className="flex items-center gap-1.5 border-b border-red-900/20 pb-2">
          <ShieldAlert size={12} className="text-red-500 animate-pulse" />
          <span className="font-bold text-red-400 uppercase tracking-wider">
            ENVIRONMENT TELEMETRY OFFLINE
          </span>
        </div>
        <div className="text-zinc-550 leading-relaxed">
          Unable to establish link to local track weather telemetry station. Strategy algorithms will degrade to default dry-conditions baseline.
        </div>
      </div>
    );
  }

  const desc = getWeatherDescription(weather.weatherCode);

  // Helper for strategic impact color coding
  const getImpactColor = (val: string) => {
    switch (val) {
      case "High":
      case "Severe":
        return "text-red-400 font-black";
      case "Medium":
      case "Elevated":
        return "text-amber-400 font-bold";
      case "Low":
        return "text-emerald-400 font-bold";
      default:
        return "text-zinc-400";
    }
  };

  // Convert wind degrees to compass directions
  const getWindDirectionStr = (deg: number): string => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const idx = Math.round(deg / 22.5) % 16;
    return directions[idx];
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950/40 rounded-xl p-3.5 space-y-3 font-mono text-[10px] text-zinc-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
        <span className="font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <CloudSun size={12} className="text-[#FF1801]" />
          ENVIRONMENT & RADAR
        </span>
        <span className="text-[8px] bg-zinc-900 text-zinc-500 px-1.5 py-0.5 rounded font-black uppercase">
          {desc}
        </span>
      </div>

      {/* Primary Weather Sensors Grid */}
      <div className="grid grid-cols-2 gap-2 text-[9px]">
        {/* Air Temp */}
        <div className="bg-zinc-950 p-2 rounded border border-zinc-900/60">
          <div className="text-zinc-500 font-bold uppercase tracking-wider">AIR TEMP</div>
          <div className="text-white text-xs font-black mt-0.5">{weather.airTemp.toFixed(1)}°C</div>
        </div>

        {/* Humidity */}
        <div className="bg-zinc-950 p-2 rounded border border-zinc-900/60">
          <div className="text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Droplets size={10} className="text-blue-500" />
            HUMIDITY
          </div>
          <div className="text-white text-xs font-black mt-0.5">{weather.humidity}%</div>
        </div>

        {/* Rain Risk */}
        <div className="bg-zinc-950 p-2 rounded border border-zinc-900/60">
          <div className="text-zinc-500 font-bold uppercase tracking-wider">RAIN RISK</div>
          <div className={`text-xs font-black mt-0.5 ${getImpactColor(weather.analysis.rainRisk)}`}>
            {weather.analysis.rainRisk.toUpperCase()}
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-zinc-950 p-2 rounded border border-zinc-900/60">
          <div className="text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1">
            <Wind size={10} className="text-emerald-500" />
            WIND
          </div>
          <div className="text-white text-[11px] font-black mt-0.5 truncate">
            {weather.windSpeed.toFixed(1)} km/h {getWindDirectionStr(weather.windDirection)}
          </div>
        </div>
      </div>

      {/* Strategic Racing Impacts */}
      <div className="border-t border-zinc-900/80 pt-2.5 space-y-2">
        <span className="text-zinc-500 font-bold uppercase tracking-wider block text-[8px]">
          STRATEGIC PIT-WALL ANALYTICS:
        </span>
        
        <div className="grid grid-cols-3 gap-1 bg-zinc-950/60 p-2 rounded border border-zinc-900/50 text-[8px] text-center">
          <div>
            <div className="text-zinc-500 uppercase">TRACK GRIP</div>
            <div className={`mt-0.5 font-bold ${getImpactColor(weather.analysis.trackEvolution)}`}>
              {weather.analysis.trackEvolution.toUpperCase()}
            </div>
          </div>
          <div>
            <div className="text-zinc-500 uppercase">TYRE WEAR</div>
            <div className={`mt-0.5 font-bold ${getImpactColor(weather.analysis.tyreManagementRisk)}`}>
              {weather.analysis.tyreManagementRisk.toUpperCase()}
            </div>
          </div>
          <div>
            <div className="text-zinc-500 uppercase">AERO SENS</div>
            <div className={`mt-0.5 font-bold ${getImpactColor(weather.analysis.windSensitivity)}`}>
              {weather.analysis.windSensitivity.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Textual Reason Summaries */}
        <div className="space-y-1.5 text-[8.5px] text-zinc-400 bg-zinc-900/20 p-2 rounded border border-zinc-900/40 leading-relaxed">
          {weather.analysis.rainRisk !== "None" && (
            <div className="flex gap-1.5 items-start">
              <Compass size={10} className="text-blue-400 shrink-0 mt-0.5" />
              <span>{weather.analysis.rainRiskReason}</span>
            </div>
          )}
          {weather.analysis.windSensitivity !== "None" && (
            <div className="flex gap-1.5 items-start">
              <Compass size={10} className="text-emerald-400 shrink-0 mt-0.5" />
              <span>{weather.analysis.windImpactReason}</span>
            </div>
          )}
          {weather.analysis.tempTrend !== "Stable Temperature" && (
            <div className="flex gap-1.5 items-start">
              <Compass size={10} className="text-purple-400 shrink-0 mt-0.5" />
              <span>Track trend indicates a <strong className="text-zinc-300">{weather.analysis.tempTrend.toLowerCase()}</strong> in upcoming stints.</span>
            </div>
          )}
          {weather.analysis.rainRisk === "None" && weather.analysis.windSensitivity === "None" && weather.analysis.tempTrend === "Stable Temperature" && (
            <div className="flex gap-1.5 items-start justify-center text-zinc-500 italic">
              Weather systems stable. Ambient track conditions normal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherIntelligenceCard;
