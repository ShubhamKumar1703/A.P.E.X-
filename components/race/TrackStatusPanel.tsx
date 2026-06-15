import React from "react";
import { LiveRaceState } from "@/lib/live/race-state";
import { Flag, AlertOctagon, Radio } from "lucide-react";

interface TrackStatusPanelProps {
  raceState: LiveRaceState;
}

export default function TrackStatusPanel({ raceState }: TrackStatusPanelProps) {
  const { flagStatus, trackAlert, messages } = raceState;

  // Determine flag styling & icons
  let flagBg = "bg-zinc-900 border-zinc-800 text-zinc-400";
  let flagText = "CLEAR";
  let animatePulse = false;

  switch (flagStatus) {
    case "GREEN":
      flagBg = "bg-emerald-950/40 border-emerald-900 text-emerald-400";
      flagText = "TRACK CLEAR / GREEN FLAG";
      break;
    case "YELLOW":
      flagBg = "bg-amber-950/40 border-amber-900 text-amber-400";
      flagText = "TRACK HAZARD / YELLOW FLAG";
      animatePulse = true;
      break;
    case "RED":
      flagBg = "bg-red-950/40 border-red-900 text-red-400";
      flagText = "SESSION SUSPENDED / RED FLAG";
      animatePulse = true;
      break;
    case "BLUE":
      flagBg = "bg-blue-950/40 border-blue-900 text-blue-400";
      flagText = "OVERTAKE / BLUE FLAG";
      break;
    default:
      flagText = "TRACK CLEAR";
  }

  return (
    <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 md:p-6 font-mono relative overflow-hidden backdrop-blur-sm h-full flex flex-col">
      {/* Top glowing bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600/30" />

      <div className="flex items-center gap-2 mb-4 text-xs font-bold text-zinc-500 tracking-wider uppercase border-b border-zinc-900 pb-2 flex-shrink-0">
        <Radio size={14} className="text-red-500" />
        <span>RACE CONTROL & TRACK STATUS</span>
      </div>

      {/* Flag Alert Banner */}
      <div
        className={`border rounded-lg p-3.5 mb-4 flex items-center justify-between transition-all duration-300 ${flagBg} ${
          animatePulse ? "animate-pulse" : ""
        } flex-shrink-0`}
      >
        <div className="flex items-center gap-3">
          <Flag
            size={18}
            className={
              flagStatus === "YELLOW"
                ? "fill-amber-400"
                : flagStatus === "RED"
                ? "fill-red-400"
                : flagStatus === "GREEN"
                ? "fill-emerald-400"
                : flagStatus === "BLUE"
                ? "fill-blue-400"
                : ""
            }
          />
          <span className="font-black text-sm tracking-wider">{flagText}</span>
        </div>
        
        {trackAlert !== "NONE" && (
          <div className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded tracking-widest animate-bounce">
            <AlertOctagon size={10} />
            <span>
              {trackAlert === "SAFETY_CAR" ? "SAFETY CAR" : "VSC ACTIVE"}
            </span>
          </div>
        )}
      </div>

      {/* Message Feed */}
      <div className="flex-1 flex flex-col min-h-[150px]">
        <span className="text-[10px] text-zinc-500 font-bold mb-2 uppercase block">
          OFFICIAL FEED MESSAGES
        </span>
        <div className="flex-1 overflow-y-auto max-h-[300px] md:max-h-full space-y-2 pr-1 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-zinc-700 text-xs">
              NO MESSAGES LOGGED FOR THIS SESSION
            </div>
          ) : (
            messages.map((msg, index) => {
              const dateObj = new Date(msg.date);
              const timeStr = dateObj.toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              });

              return (
                <div
                  key={index}
                  className="p-2.5 rounded-lg border border-zinc-900 bg-zinc-900/10 hover:bg-zinc-900/35 transition-colors duration-150 text-xs flex gap-3 items-start"
                >
                  <div className="flex flex-col text-[10px] text-zinc-500 font-bold min-w-[65px] select-none">
                    <span>{timeStr}</span>
                    {msg.lap_number && (
                      <span className="text-red-500/80 mt-0.5">LAP {msg.lap_number}</span>
                    )}
                  </div>
                  <div className="flex-1 text-zinc-300 leading-normal font-sans">
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
