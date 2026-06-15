import React from "react";
import { LiveDriverState } from "@/lib/live/driver-state";
import { Zap, Timer } from "lucide-react";

interface LiveTimingBoardProps {
  drivers: LiveDriverState[];
  selectedDriverNumber: number | null;
  onSelectDriver: (driverNumber: number) => void;
  fastestDriverNumber: number | null;
}

export default function LiveTimingBoard({
  drivers,
  selectedDriverNumber,
  onSelectDriver,
  fastestDriverNumber,
}: LiveTimingBoardProps) {
  return (
    <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 md:p-6 font-mono relative overflow-hidden backdrop-blur-sm h-full flex flex-col">
      {/* Top glowing bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600/30" />

      <div className="flex items-center justify-between mb-4 text-xs font-bold text-zinc-500 tracking-wider uppercase border-b border-zinc-900 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Timer size={14} className="text-red-500 animate-pulse" />
          <span>LIVE SESSION TIMING</span>
        </div>
        <span className="text-[10px] text-zinc-600 font-normal">CLICK TO TRACE TELEMETRY</span>
      </div>

      <div className="flex-1 overflow-auto max-h-[500px] md:max-h-full scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="text-zinc-500 border-b border-zinc-900/60 pb-1 text-[10px]">
              <th className="py-2 px-1 text-center font-bold">POS</th>
              <th className="py-2 px-1">DRIVER</th>
              <th className="py-2 px-1">GAP TO LDR</th>
              <th className="py-2 px-1 hidden sm:table-cell">INTERVAL</th>
              <th className="py-2 px-1">LAST LAP</th>
              <th className="py-2 px-1 text-right">BEST LAP</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-zinc-600">
                  NO LIVE TIMING DATA AVAILABLE
                </td>
              </tr>
            ) : (
              drivers.map((driver) => {
                const isSelected = selectedDriverNumber === driver.driverNumber;
                const isFastestLap = fastestDriverNumber === driver.driverNumber;
                
                return (
                  <tr
                    key={driver.driverNumber}
                    onClick={() => onSelectDriver(driver.driverNumber)}
                    className={`border-b border-zinc-900/40 hover:bg-zinc-900/30 cursor-pointer transition-colors duration-150 ${
                      isSelected ? "bg-zinc-900/50 border-l-2 border-l-red-500" : ""
                    }`}
                  >
                    {/* Position */}
                    <td className="py-2 px-1 text-center font-black text-white w-8">
                      {driver.position}
                    </td>

                    {/* Driver & Team */}
                    <td className="py-2 px-1 flex items-center gap-2">
                      {/* Team Color Left Border */}
                      <span
                        className="w-[3px] h-4 block rounded-sm flex-shrink-0"
                        style={{ backgroundColor: driver.teamColor || "#CCCCCC" }}
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-black text-zinc-100 text-sm tracking-wide">
                            {driver.acronym}
                          </span>
                          <span className="text-[9px] text-zinc-500">
                            #{driver.driverNumber}
                          </span>
                          {driver.inPitLane && (
                            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[8px] px-1 rounded font-bold scale-90 origin-left">
                              PIT
                            </span>
                          )}
                        </div>
                        <span className="text-[9.5px] text-zinc-500 font-sans hidden md:block max-w-[100px] truncate leading-tight">
                          {driver.fullName}
                        </span>
                      </div>
                    </td>

                    {/* Gap To Leader */}
                    <td className="py-2 px-1 text-zinc-300 font-medium font-mono">
                      {driver.gapToLeader}
                    </td>

                    {/* Interval */}
                    <td className="py-2 px-1 text-zinc-500 font-mono hidden sm:table-cell">
                      {driver.intervalAhead}
                    </td>

                    {/* Last Lap */}
                    <td className="py-2 px-1 text-zinc-300 font-mono">
                      {driver.lastLapTime}
                    </td>

                    {/* Best Lap */}
                    <td className="py-2 px-1 text-right font-mono font-bold">
                      <div className="flex items-center justify-end gap-1">
                        {isFastestLap && (
                          <Zap size={10} className="text-purple-400 fill-purple-400/30 animate-pulse" />
                        )}
                        <span className={isFastestLap ? "text-purple-400" : "text-zinc-200"}>
                          {driver.bestLapTime}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
