"use client";

import React from "react";
import { OpenF1CarData } from "@/lib/services/openf1/types";
import { LiveDriverState } from "@/lib/live/driver-state";
import { Activity, Loader2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface TelemetryPreviewPanelProps {
  driver: LiveDriverState | null;
  telemetryData: OpenF1CarData[];
  isLoading: boolean;
}

export default function TelemetryPreviewPanel({
  driver,
  telemetryData,
  isLoading,
}: TelemetryPreviewPanelProps) {
  // Extract latest sample values for numeric telemetry readout
  const latestSample =
    telemetryData && telemetryData.length > 0
      ? telemetryData[telemetryData.length - 1]
      : null;

  // Format data for chart consumption
  const chartData = (telemetryData || []).map((sample, idx) => {
    let timeLabel = `${idx + 1}`;
    try {
      const d = new Date(sample.date);
      const secs = d.getSeconds().toString().padStart(2, "0");
      const ms = Math.floor(d.getMilliseconds() / 100);
      timeLabel = `${secs}.${ms}s`;
    } catch {
      // fallback
    }

    return {
      name: timeLabel,
      speed: sample.speed,
      rpm: sample.rpm,
      gear: sample.gear,
      throttle: sample.throttle,
      brake: sample.brake > 0 ? 100 : 0, // normalize brake as 0 or 100
    };
  });

  return (
    <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 md:p-6 font-mono relative overflow-hidden backdrop-blur-sm h-full flex flex-col min-h-[350px]">
      {/* Top glowing bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600/30" />

      {/* Panel Header */}
      <div className="flex items-center justify-between mb-4 text-xs font-bold text-zinc-500 tracking-wider uppercase border-b border-zinc-900 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-red-500" />
          <span>DRIVER TELEMETRY ANALYSIS</span>
        </div>
        {driver && (
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: driver.teamColor }}
            />
            <span className="text-white font-black">
              {driver.fullName} ({driver.acronym}) #{driver.driverNumber}
            </span>
          </div>
        )}
      </div>

      {/* Loading & Selection States */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-2">
          <Loader2 className="animate-spin text-red-500" size={24} />
          <span className="text-xs uppercase font-bold tracking-widest">
            FETCHING TELEMETRY STREAMS...
          </span>
        </div>
      ) : !driver ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-1 text-center py-12">
          <span className="text-xs font-black uppercase tracking-wider">
            NO ACTIVE DRIVER SELECTED
          </span>
          <span className="text-[10px] text-zinc-500 font-sans max-w-[280px]">
            Click any driver acronym on the session timing leaderboard to initialize a telemetry trace stream.
          </span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-1 text-center py-12">
          <span className="text-xs font-black uppercase tracking-wider text-amber-500/80">
            NO TELEMETRY PACKETS DETECTED
          </span>
          <span className="text-[10px] font-sans max-w-[280px]">
            The telemetry stream for driver #{driver.driverNumber} returned no samples. Check session active status.
          </span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4">
          {/* Numeric Readouts */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-lg p-2 text-center">
              <span className="text-[9px] text-zinc-500 block uppercase font-black">
                SPEED
              </span>
              <span className="text-sm font-black text-white">
                {latestSample ? latestSample.speed : "--"}
                <span className="text-[9px] text-zinc-500 font-bold ml-0.5">KM/H</span>
              </span>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-lg p-2 text-center">
              <span className="text-[9px] text-zinc-500 block uppercase font-black">
                GEAR
              </span>
              <span className="text-sm font-black text-red-500">
                {latestSample ? latestSample.gear : "--"}
              </span>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-lg p-2 text-center">
              <span className="text-[9px] text-zinc-500 block uppercase font-black">
                RPM
              </span>
              <span className="text-sm font-black text-zinc-300">
                {latestSample ? latestSample.rpm.toLocaleString() : "--"}
              </span>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-lg p-2 text-center">
              <span className="text-[9px] text-zinc-500 block uppercase font-black">
                THROTTLE
              </span>
              <span className="text-sm font-black text-emerald-400">
                {latestSample ? latestSample.throttle : "--"}
                <span className="text-[9px] text-emerald-600 font-bold ml-0.5">%</span>
              </span>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900/80 rounded-lg p-2 text-center col-span-3 sm:col-span-1">
              <span className="text-[9px] text-zinc-500 block uppercase font-black">
                BRAKE
              </span>
              <span
                className={`text-sm font-black ${
                  latestSample && latestSample.brake > 0
                    ? "text-red-500 animate-pulse"
                    : "text-zinc-600"
                }`}
              >
                {latestSample && latestSample.brake > 0 ? "ACTIVE" : "OFF"}
              </span>
            </div>
          </div>

          {/* Recharts Charts Layout */}
          <div className="flex-1 flex flex-col gap-3 min-h-[200px]">
            {/* Speed Graph */}
            <div className="flex-1 min-h-[100px]">
              <span className="text-[9px] text-zinc-500 font-black uppercase mb-1 block">
                SPEED & GEAR OVERLAY
              </span>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={9} />
                  <YAxis domain={["dataMin - 10", "dataMax + 10"]} stroke="#52525b" fontSize={9} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#09090b",
                      borderColor: "#27272a",
                      color: "#f4f4f5",
                      fontSize: "10px",
                      fontFamily: "monospace",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="speed"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    name="Speed (km/h)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Throttle & Brake Graph */}
            <div className="flex-1 min-h-[100px]">
              <span className="text-[9px] text-zinc-500 font-black uppercase mb-1 block">
                THROTTLE / BRAKE INPUTS
              </span>
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#18181b" />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={9} />
                  <YAxis domain={[0, 100]} stroke="#52525b" fontSize={9} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#09090b",
                      borderColor: "#27272a",
                      color: "#f4f4f5",
                      fontSize: "10px",
                      fontFamily: "monospace",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="throttle"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    dot={false}
                    name="Throttle (%)"
                  />
                  <Line
                    type="stepAfter"
                    dataKey="brake"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    dot={false}
                    name="Brake (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
