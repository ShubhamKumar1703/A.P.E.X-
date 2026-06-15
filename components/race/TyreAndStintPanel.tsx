import React from "react";
import { LiveDriverState } from "@/lib/live/driver-state";
import { Gauge } from "lucide-react";

interface TyreAndStintPanelProps {
  drivers: LiveDriverState[];
}

export default function TyreAndStintPanel({ drivers }: TyreAndStintPanelProps) {
  // Helpers for tyre compound style configurations
  const getCompoundStyle = (compound: string) => {
    const norm = (compound || "").toUpperCase();
    if (norm.includes("SOFT")) {
      return {
        label: "S",
        colorClass: "text-red-500 border-red-500 bg-red-950/30",
        bgClass: "bg-red-500",
        maxStint: 18,
      };
    } else if (norm.includes("MEDIUM")) {
      return {
        label: "M",
        colorClass: "text-amber-500 border-amber-500 bg-amber-950/30",
        bgClass: "bg-amber-500",
        maxStint: 28,
      };
    } else if (norm.includes("HARD")) {
      return {
        label: "H",
        colorClass: "text-zinc-100 border-zinc-200 bg-zinc-800/40",
        bgClass: "bg-zinc-200",
        maxStint: 40,
      };
    } else if (norm.includes("INTER")) {
      return {
        label: "I",
        colorClass: "text-emerald-400 border-emerald-400 bg-emerald-950/30",
        bgClass: "bg-emerald-400",
        maxStint: 25,
      };
    } else if (norm.includes("WET")) {
      return {
        label: "W",
        colorClass: "text-blue-500 border-blue-500 bg-blue-950/30",
        bgClass: "bg-blue-500",
        maxStint: 25,
      };
    }
    return {
      label: "?",
      colorClass: "text-zinc-500 border-zinc-700 bg-zinc-800/10",
      bgClass: "bg-zinc-500",
      maxStint: 30,
    };
  };

  return (
    <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 md:p-6 font-mono relative overflow-hidden backdrop-blur-sm h-full flex flex-col">
      {/* Top glowing bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600/30" />

      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-zinc-500 tracking-wider uppercase border-b border-zinc-900 pb-2 flex-shrink-0">
        <Gauge size={14} className="text-red-500" />
        <span>TYRE STRATEGY & STINT TRACKER</span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[500px] md:max-h-full space-y-3 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        {drivers.length === 0 ? (
          <div className="text-center py-8 text-zinc-700 text-xs">
            NO TYRE DATA AVAILABLE
          </div>
        ) : (
          drivers.map((driver) => {
            const cmp = getCompoundStyle(driver.tyreCompound);
            const pct = Math.min(100, (driver.tyreAge / cmp.maxStint) * 100);

            return (
              <div
                key={driver.driverNumber}
                className="bg-zinc-900/10 border border-zinc-900/60 hover:border-zinc-800/80 rounded-lg p-2.5 flex items-center gap-4 transition-all duration-150"
              >
                {/* Position & Driver Identification */}
                <div className="flex items-center gap-2 w-[80px] flex-shrink-0">
                  <span className="text-[10px] font-black text-zinc-500 w-4 text-right">
                    P{driver.position}
                  </span>
                  <span
                    className="w-[3px] h-3.5 block rounded-sm flex-shrink-0"
                    style={{ backgroundColor: driver.teamColor || "#CCCCCC" }}
                  />
                  <span className="text-xs font-black text-zinc-100 uppercase">
                    {driver.acronym}
                  </span>
                </div>

                {/* Stint Tyre Indicator */}
                <div className="flex items-center gap-1.5 w-[50px] flex-shrink-0">
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-black tracking-tighter ${cmp.colorClass}`}
                  >
                    {cmp.label}
                  </span>
                  <span className="text-[9.5px] text-zinc-400 font-bold">
                    {driver.tyreAge}L
                  </span>
                </div>

                {/* Stint Progress Bar */}
                <div className="flex-1 hidden sm:block">
                  <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/60">
                    <div
                      className={`h-full ${cmp.bgClass} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Pit Stops Counter */}
                <div className="text-right w-[65px] flex-shrink-0">
                  <span className="text-[9px] text-zinc-500 block uppercase font-black leading-none mb-0.5">
                    STOPS
                  </span>
                  <span className="text-xs font-bold text-zinc-300">
                    {driver.pitStopsCount}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
