"use client";

import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip
} from "recharts";
import { Cpu, Zap } from "lucide-react";

// Mock drivers telemetry profile
interface DriverTelemetry {
  code: string;
  speedData: { distance: number; speed: number; rpm: number; throttle: number; brake: number; gear: number }[];
  currentStats: {
    lap: number;
    speed: number;
    rpm: number;
    gear: number;
    throttle: number;
    brake: number;
    tyre: "S" | "M" | "H";
    tyreAge: number;
    pitStops: number;
    status: "TRACK" | "PIT" | "OUT";
    gap: string;
    lastLap: string;
    bestLap: string;
  };
  strategyAdvice: string;
}

const telemetryDataLEC = Array.from({ length: 30 }, (_, i) => {
  const distance = i * 150;
  // Leclerc's Spa throttle/brake profile
  let throttle = 100;
  let brake = 0;
  let speed = 310;
  let gear = 8;

  if (i > 8 && i < 15) { // chicane/braking zone
    throttle = 0;
    brake = 85 - (i - 9) * 10;
    speed = 310 - (i - 8) * 35;
    gear = Math.max(3, 8 - (i - 8));
  } else if (i >= 15 && i < 22) { // traction phase
    throttle = 20 + (i - 15) * 12;
    brake = 0;
    speed = 100 + (i - 15) * 20;
    gear = 3 + Math.floor((i - 15) / 2);
  }

  return { distance, speed, rpm: Math.floor(speed * 40 + 4000), throttle, brake, gear };
});

const telemetryDataVER = Array.from({ length: 30 }, (_, i) => {
  const distance = i * 150;
  // Verstappen profile
  let throttle = 100;
  let brake = 0;
  let speed = 315;
  let gear = 8;

  if (i > 7 && i < 14) {
    throttle = 0;
    brake = 90 - (i - 8) * 15;
    speed = 315 - (i - 7) * 38;
    gear = Math.max(3, 8 - (i - 7));
  } else if (i >= 14 && i < 21) {
    throttle = 30 + (i - 14) * 12;
    brake = 0;
    speed = 110 + (i - 14) * 22;
    gear = 3 + Math.floor((i - 14) / 2);
  }

  return { distance, speed, rpm: Math.floor(speed * 38 + 4200), throttle, brake, gear };
});

const telemetryDataHAM = Array.from({ length: 30 }, (_, i) => {
  const distance = i * 150;
  // Hamilton profile
  let throttle = 100;
  let brake = 0;
  let speed = 308;
  let gear = 8;

  if (i > 9 && i < 16) {
    throttle = 0;
    brake = 80 - (i - 10) * 10;
    speed = 308 - (i - 9) * 30;
    gear = Math.max(4, 8 - (i - 9));
  } else if (i >= 16 && i < 23) {
    throttle = 15 + (i - 16) * 13;
    brake = 0;
    speed = 95 + (i - 16) * 19;
    gear = 4 + Math.floor((i - 16) / 2);
  }

  return { distance, speed, rpm: Math.floor(speed * 41 + 3900), throttle, brake, gear };
});

const mockDrivers: Record<string, DriverTelemetry> = {
  LEC: {
    code: "LEC",
    speedData: telemetryDataLEC,
    currentStats: {
      lap: 42,
      speed: 312,
      rpm: 11800,
      gear: 8,
      throttle: 100,
      brake: 0,
      tyre: "M",
      tyreAge: 18,
      pitStops: 1,
      status: "TRACK",
      gap: "LEADER",
      lastLap: "1:46.210",
      bestLap: "1:45.980"
    },
    strategyAdvice: "Tyre wear at 42%. Soft tyre crossover in 3 laps. Maintain current pace to secure pit window against VER."
  },
  VER: {
    code: "VER",
    speedData: telemetryDataVER,
    currentStats: {
      lap: 42,
      speed: 316,
      rpm: 12100,
      gear: 8,
      throttle: 100,
      brake: 0,
      tyre: "H",
      tyreAge: 24,
      pitStops: 1,
      status: "TRACK",
      gap: "+1.842s",
      lastLap: "1:46.040",
      bestLap: "1:45.812"
    },
    strategyAdvice: "Hard tyres dropping performance. Box for Softs in Lap 44 for fastest lap attempt. Push now."
  },
  HAM: {
    code: "HAM",
    speedData: telemetryDataHAM,
    currentStats: {
      lap: 42,
      speed: 308,
      rpm: 11500,
      gear: 7,
      throttle: 90,
      brake: 0,
      tyre: "S",
      tyreAge: 8,
      pitStops: 2,
      status: "TRACK",
      gap: "+4.912s",
      lastLap: "1:45.620",
      bestLap: "1:45.510"
    },
    strategyAdvice: "Soft tyres in optimal window. Overtake threat on VER active. Engine mode set to Strat 2."
  }
};

export function DashboardMockup() {
  const [selectedDriver, setSelectedDriver] = useState<string>("LEC");
  const [ticker, setTicker] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"telemetry" | "strategy">("telemetry");

  const driverData = mockDrivers[selectedDriver];

  // Micro-interaction simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Modify active stats dynamically based on ticker to show it's alive
  const liveSpeed = driverData.currentStats.speed + (ticker % 3) - 1;
  const liveRpm = driverData.currentStats.rpm + (ticker % 5) * 50 - 100;
  const liveThrottle = ticker % 2 === 0 ? 100 : 95;

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl relative group/terminal">
      {/* Terminal Title Bar */}
      <div className="bg-zinc-900 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 block" />
          </div>
          <span className="text-xs font-mono text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF1801] animate-ping" />
            A.P.E.X. Mission Control v1.0.0
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline-block">
            SESSION: FP3 (DRY)
          </span>
          <span className="text-[10px] font-mono text-[#FF1801] font-bold">
            LIVE TELEMETRY FEED
          </span>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-zinc-800/80">
        
        {/* Panel 1: Leaderboard Timing Tower (3 cols) */}
        <div className="lg:col-span-4 bg-zinc-950 p-4 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest mb-3 flex justify-between">
              <span>POS / DRIVER</span>
              <span>GAP / TYRE</span>
            </div>
            
            <div className="space-y-1.5">
              {Object.keys(mockDrivers).map((code, index) => {
                const isSelected = selectedDriver === code;
                const d = mockDrivers[code];
                const tyreColors = {
                  S: "text-red-500 border-red-500/30 bg-red-500/5",
                  M: "text-yellow-500 border-yellow-500/30 bg-yellow-500/5",
                  H: "text-white border-zinc-600 bg-white/5",
                };

                return (
                  <button
                    key={code}
                    onClick={() => setSelectedDriver(code)}
                    className={`w-full text-left p-2.5 rounded-lg border font-mono text-xs transition-all duration-200 flex items-center justify-between ${
                      isSelected 
                        ? "border-[#FF1801] bg-[#FF1801]/5 text-white" 
                        : "border-zinc-900 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 hover:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold ${isSelected ? "text-[#FF1801]" : "text-zinc-500"}`}>
                        0{index + 1}
                      </span>
                      <span className="font-bold tracking-wide text-zinc-100">{code}</span>
                      <span className="text-[10px] text-zinc-500 truncate hidden sm:inline-block">
                        {code === "LEC" ? "Leclerc" : code === "VER" ? "Verstappen" : "Hamilton"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-zinc-300">{d.currentStats.gap}</span>
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-bold text-[9px] ${tyreColors[d.currentStats.tyre]}`}>
                        {d.currentStats.tyre}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick HUD Specs */}
          <div className="mt-6 border-t border-zinc-900 pt-4 space-y-3">
            <div className="text-[10px] font-mono text-zinc-500 font-bold uppercase tracking-widest">
              DRIVER FOCUS DETAILS
            </div>
            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
              <div className="bg-zinc-900/60 p-2 border border-zinc-900 rounded">
                <span className="text-zinc-500 block text-[9px]">LAST LAP</span>
                <span className="text-zinc-100 font-bold">{driverData.currentStats.lastLap}</span>
              </div>
              <div className="bg-zinc-900/60 p-2 border border-zinc-900 rounded">
                <span className="text-zinc-500 block text-[9px]">BEST LAP</span>
                <span className="text-[#FF1801] font-bold">{driverData.currentStats.bestLap}</span>
              </div>
              <div className="bg-zinc-900/60 p-2 border border-zinc-900 rounded">
                <span className="text-zinc-500 block text-[9px]">TYRE AGE</span>
                <span className="text-zinc-100 font-bold">{driverData.currentStats.tyreAge} LAPS</span>
              </div>
              <div className="bg-zinc-900/60 p-2 border border-zinc-900 rounded">
                <span className="text-zinc-500 block text-[9px]">PIT STOPS</span>
                <span className="text-zinc-100 font-bold">{driverData.currentStats.pitStops}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Telemetry Core Chart & Tabs (8 cols) */}
        <div className="lg:col-span-8 bg-zinc-950 p-4 flex flex-col justify-between">
          <div>
            {/* Tabs */}
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3 mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("telemetry")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    activeTab === "telemetry" 
                      ? "bg-zinc-900 text-white border border-zinc-800" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  TELEMETRY WAVES
                </button>
                <button
                  onClick={() => setActiveTab("strategy")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    activeTab === "strategy" 
                      ? "bg-zinc-900 text-white border border-zinc-800" 
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  AI STRATEGY ADVISOR
                </button>
              </div>
              
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-zinc-500">SELECTED CAR:</span>
                <span className="text-[#FF1801] font-bold">#{driverData.currentStats.lap === 42 ? (selectedDriver === "LEC" ? "16" : selectedDriver === "VER" ? "1" : "44") : ""} ({selectedDriver})</span>
              </div>
            </div>

            {activeTab === "telemetry" ? (
              <div>
                {/* Real-time stats display */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded p-2.5">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase">SPEED</span>
                    <span className="text-lg font-mono font-bold text-white tracking-tight">
                      {liveSpeed} <span className="text-[10px] text-zinc-500 font-normal">KM/H</span>
                    </span>
                  </div>
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded p-2.5">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase">ENGINE RPM</span>
                    <span className="text-lg font-mono font-bold text-white tracking-tight">
                      {liveRpm} <span className="text-[10px] text-zinc-500 font-normal">RPM</span>
                    </span>
                  </div>
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded p-2.5">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase">GEAR</span>
                    <span className="text-lg font-mono font-bold text-[#FF1801] tracking-tight">
                      {driverData.currentStats.gear} <span className="text-[10px] text-zinc-500 font-normal">TH</span>
                    </span>
                  </div>
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded p-2.5">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase">THROTTLE</span>
                    <span className="text-lg font-mono font-bold text-emerald-500 tracking-tight">
                      {liveThrottle}%
                    </span>
                  </div>
                </div>

                {/* Telemetry Chart */}
                <div className="h-[170px] w-full font-mono text-[9px] relative select-none">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={driverData.speedData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                      <XAxis dataKey="distance" stroke="#27272a" />
                      <YAxis domain={[0, 350]} stroke="#27272a" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#09090b", borderColor: "#27272a" }}
                        labelClassName="text-zinc-400 font-mono text-[10px]"
                        itemStyle={{ color: "#ffffff", fontFamily: "monospace", fontSize: "10px" }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="speed" 
                        name="Speed" 
                        stroke="#FF1801" 
                        strokeWidth={2} 
                        dot={false} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="throttle" 
                        name="Throttle (%)" 
                        stroke="#10b981" 
                        strokeWidth={1} 
                        dot={false} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="brake" 
                        name="Brake (%)" 
                        stroke="#ef4444" 
                        strokeWidth={1} 
                        strokeDasharray="3 3"
                        dot={false} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex gap-4 justify-center text-[10px] font-mono text-zinc-500 mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-[#FF1801] block" /> SPEED (KM/H)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 bg-emerald-500 block" /> THROTTLE %
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 border-t border-dashed border-red-500 block" /> BRAKE %
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* AI Advice */}
                <div className="border border-[#FF1801]/30 bg-[#FF1801]/5 rounded-lg p-4 flex items-start gap-4">
                  <div className="p-2 bg-[#FF1801]/10 rounded border border-[#FF1801]/20 text-[#FF1801] mt-0.5 shrink-0">
                    <Cpu size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-200 uppercase mb-1">
                      RACE ENGINEER COMMUNICATOR (AI)
                    </h4>
                    <p className="text-xs font-mono text-zinc-300 leading-relaxed">
                      &ldquo;{driverData.strategyAdvice}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Strategy Graph or Tire Wear wear simulation */}
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-4 space-y-3 font-mono text-xs">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>TYRE DEGRADATION (ESTIMATED)</span>
                    <span className="text-white font-bold">42% WEAR</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-emerald-500 to-yellow-500 h-full rounded-full" style={{ width: "58%" }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-zinc-500 text-center">
                    <div>
                      <span className="block text-zinc-400 font-bold">LAP DEP. WINDOW</span>
                      <span>Laps 24 - 28</span>
                    </div>
                    <div>
                      <span className="block text-zinc-400 font-bold">EST. STOP TIME</span>
                      <span>2.25 seconds</span>
                    </div>
                    <div>
                      <span className="block text-zinc-400 font-bold">TARGET DELTA</span>
                      <span>+0.250s vs VER</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer of terminal: live updates log */}
          <div className="mt-4 border-t border-zinc-900 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-zinc-500">
            <div className="flex items-center gap-1.5">
              <Zap size={10} className="text-emerald-500" />
              <span>TELEMETRY SYNC: SECURE SSL</span>
            </div>
            <div className="flex items-center gap-4">
              <span>LAP PROGRESS: 42/57</span>
              <span>GPS ACCURACY: ±0.01m</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
