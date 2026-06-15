import React from "react";
import { F1Race } from "@/lib/services/f1/types";
import { Calendar, Clock, Radio } from "lucide-react";

interface RaceWeekendTimelineProps {
  race: F1Race;
}

export default function RaceWeekendTimeline({ race }: RaceWeekendTimelineProps) {
  const isCompleted = race.status === "COMPLETED";
  const isCurrent = race.status === "CURRENT_WEEKEND";

  const sessions = [
    {
      name: "FREE PRACTICE 1 & 2",
      day: "FRIDAY SESSIONS",
      date: race.firstPracticeDate || race.date, // fallback
      status: isCompleted ? "ARCHIVED" : isCurrent ? "COMPLETED" : "SCHEDULED",
      statusColor: isCompleted || isCurrent ? "text-zinc-400 bg-zinc-900 border-zinc-800" : "text-zinc-500 bg-zinc-950 border-zinc-900",
      description: "Baseline tyre wear tests and aerodynamic configuration validation."
    },
    {
      name: "FREE PRACTICE 3 & QUALIFYING",
      day: "SATURDAY SESSIONS",
      date: race.qualifyingDate || race.date,
      status: isCompleted ? "ARCHIVED" : isCurrent ? "LIVE TELEMETRY" : "SCHEDULED",
      statusColor: isCompleted ? "text-zinc-400 bg-zinc-900 border-zinc-800" : isCurrent ? "text-red-400 bg-red-950/20 border-red-500/30 animate-pulse" : "text-zinc-500 bg-zinc-950 border-zinc-900",
      description: "Qualifying knockout stages Q1, Q2, and Q3 determining final grid order."
    },
    {
      name: "FORMULA 1 GRAND PRIX",
      day: "SUNDAY RACE",
      date: race.date,
      time: race.time,
      status: isCompleted ? "CONCLUDED" : isCurrent ? "FORMING GRID" : "SCHEDULED",
      statusColor: isCompleted ? "text-green-400 bg-green-950/20 border-green-500/30" : isCurrent ? "text-red-500 bg-red-950/30 border-red-500/40 animate-pulse font-black" : "text-zinc-500 bg-zinc-950 border-zinc-900",
      description: "Full distance grand prix race weekend finale. Championship points assigned."
    }
  ];

  return (
    <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-5 md:p-6 font-mono relative overflow-hidden backdrop-blur-sm">
      {/* Top glowing bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-600/30" />
      
      <div className="flex items-center gap-2 mb-6 text-xs font-bold text-zinc-500 tracking-wider uppercase border-b border-zinc-900 pb-2">
        <Calendar size={14} className="text-red-500" />
        <span>RACE WEEKEND EVENT TIMELINE</span>
      </div>

      <div className="relative border-l border-zinc-900 ml-3 pl-6 space-y-6">
        {sessions.map((session, index) => {
          return (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <span className={`absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full border ${
                session.status === "LIVE TELEMETRY" || session.status === "FORMING GRID"
                  ? "bg-red-500 border-red-400 animate-ping"
                  : session.status === "CONCLUDED" || session.status === "ARCHIVED"
                  ? "bg-zinc-600 border-zinc-800"
                  : "bg-zinc-900 border-zinc-850"
              }`} />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <span className="text-[9px] text-zinc-500 block font-bold tracking-wider">{session.day}</span>
                  <h4 className="text-xs font-black text-white">{session.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded border text-[8px] font-bold tracking-wider uppercase ${session.statusColor}`}>
                    {session.status}
                  </span>
                  <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <Clock size={10} /> {session.date} {session.time && `| ${session.time}`}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-zinc-400 mt-1 font-sans leading-normal">
                {session.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 border-t border-zinc-900/60 pt-4 flex items-center gap-2 text-[9px] text-zinc-500">
        <Radio size={12} className="text-red-500 animate-pulse" />
        <span>OPENF1 LIVE STREAM LINK CAPABILITY INTEGRATED &middot; AWAITING PHASE 5 ACTIVATION</span>
      </div>
    </div>
  );
}
