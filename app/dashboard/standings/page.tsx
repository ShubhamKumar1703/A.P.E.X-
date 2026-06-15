"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDriverStandings, getConstructorStandings } from "@/lib/services/f1/standings";
import { F1DriverStanding, F1ConstructorStanding } from "@/lib/services/f1/types";
import { LoadingSkeleton } from "@/components/ui/LoadingSkeleton";
import { RefreshCw, AlertTriangle, Award } from "lucide-react";

export default function StandingsPage() {
  const [activeTab, setActiveTab] = useState<"drivers" | "constructors">("drivers");

  // Fetch Drivers
  const {
    data: drivers,
    isLoading: driversLoading,
    isError: driversError,
    error: driversErrorObj,
    refetch: refetchDrivers,
    isRefetching: driversRefetching
  } = useQuery<F1DriverStanding[]>({
    queryKey: ["driverStandings"],
    queryFn: getDriverStandings,
    staleTime: 15 * 60 * 1000,
  });

  // Fetch Constructors
  const {
    data: constructors,
    isLoading: constructorsLoading,
    isError: constructorsError,
    error: constructorsErrorObj,
    refetch: refetchConstructors,
    isRefetching: constructorsRefetching
  } = useQuery<F1ConstructorStanding[]>({
    queryKey: ["constructorStandings"],
    queryFn: getConstructorStandings,
    staleTime: 15 * 60 * 1000,
  });

  const isLoading = activeTab === "drivers" ? driversLoading : constructorsLoading;
  const isError = activeTab === "drivers" ? driversError : constructorsError;
  const errorObj = activeTab === "drivers" ? driversErrorObj : constructorsErrorObj;
  const refetch = activeTab === "drivers" ? refetchDrivers : refetchConstructors;
  const isRefetching = activeTab === "drivers" ? driversRefetching : constructorsRefetching;

  if (isLoading) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="h-10 w-64 bg-zinc-900 rounded animate-pulse" />
        <div className="h-8 w-80 bg-zinc-900 rounded animate-pulse" />
        <div className="h-44 w-full bg-zinc-900 border border-zinc-800 rounded-xl animate-pulse" />
        <div className="space-y-3">
          <LoadingSkeleton className="h-10" count={8} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-500/20 flex items-center justify-center text-[#FF1801]">
          <AlertTriangle size={28} />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-lg font-bold font-mono tracking-tight text-white uppercase">
            STANDINGS FEED OFFLINE
          </h3>
          <p className="text-sm text-zinc-400">
            {errorObj instanceof Error ? errorObj.message : "Unable to load current standings from Jolpica."}
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono font-bold tracking-widest text-white bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 transition-all uppercase"
        >
          <RefreshCw size={14} className={isRefetching ? "animate-spin" : ""} />
          {isRefetching ? "Retrying..." : "Retry Connection"}
        </button>
      </div>
    );
  }

  // Extract Driver Podium Positions
  const topDrivers = drivers ? drivers.slice(0, 3) : [];
  const listDrivers = drivers ? drivers.slice(3) : [];

  // Podium layout mapping: [2nd, 1st, 3rd]
  const podiumLayout = [];
  if (topDrivers.length >= 2) podiumLayout.push(topDrivers[1]); // 2nd
  if (topDrivers.length >= 1) podiumLayout.push(topDrivers[0]); // 1st
  if (topDrivers.length >= 3) podiumLayout.push(topDrivers[2]); // 3rd

  const getPodiumAccents = (position: number) => {
    switch (position) {
      case 1:
        return {
          glow: "from-[#FFD700]/10 to-transparent border-[#FFD700]/30 shadow-[#FFD700]/5",
          text: "text-[#FFD700]",
          badge: "bg-[#FFD700]/10 border-[#FFD700]/30",
          trophy: "text-[#FFD700]",
          height: "h-[220px] sm:h-[250px]"
        };
      case 2:
        return {
          glow: "from-[#C0C0C0]/10 to-transparent border-[#C0C0C0]/20 shadow-[#C0C0C0]/2",
          text: "text-[#C0C0C0]",
          badge: "bg-[#C0C0C0]/10 border-[#C0C0C0]/20",
          trophy: "text-[#C0C0C0]",
          height: "h-[180px] sm:h-[210px]"
        };
      case 3:
        return {
          glow: "from-[#CD7F32]/10 to-transparent border-[#CD7F32]/20 shadow-[#CD7F32]/2",
          text: "text-[#CD7F32]",
          badge: "bg-[#CD7F32]/10 border-[#CD7F32]/20",
          trophy: "text-[#CD7F32]",
          height: "h-[160px] sm:h-[190px]"
        };
      default:
        return {
          glow: "from-zinc-900 to-zinc-950 border-zinc-800 shadow-none",
          text: "text-zinc-400",
          badge: "bg-zinc-800 border-zinc-700",
          trophy: "text-zinc-600",
          height: "h-40"
        };
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#FF1801] uppercase">
            Championship Standings // 2026
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mt-1">
            Season Standings
          </h2>
        </div>

        {/* Custom Tab Selector */}
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-850 self-start">
          <button
            onClick={() => setActiveTab("drivers")}
            className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all ${
              activeTab === "drivers"
                ? "bg-[#FF1801] text-white shadow-md shadow-[#FF1801]/10"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Drivers
          </button>
          <button
            onClick={() => setActiveTab("constructors")}
            className={`px-4 py-1.5 rounded-md text-xs font-mono font-bold tracking-wider uppercase transition-all ${
              activeTab === "constructors"
                ? "bg-[#FF1801] text-white shadow-md shadow-[#FF1801]/10"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Constructors
          </button>
        </div>
      </div>

      {activeTab === "drivers" ? (
        <div className="space-y-12">
          {/* Driver Podium Showcase */}
          {podiumLayout.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end max-w-4xl mx-auto pt-6 border-b border-zinc-950 pb-8">
              {podiumLayout.map((driver) => {
                const accent = getPodiumAccents(driver.position);
                
                return (
                  <div
                    key={driver.driverId}
                    className={`relative rounded-xl border bg-gradient-to-t ${accent.glow} flex flex-col justify-end p-4 md:p-6 shadow-2xl transition-all duration-300 ${accent.height} ${
                      driver.position === 1 ? "z-10 scale-[1.03]" : ""
                    }`}
                  >
                    {/* Left border team indicator */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" 
                      style={{ backgroundColor: driver.teamColor }}
                    />

                    {/* Position Shield */}
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono font-black text-[9px] ${accent.badge}`}>
                        {driver.position}
                      </span>
                    </div>

                    {/* Profile details */}
                    <div className="space-y-2 mt-4 text-center sm:text-left">
                      <div className="space-y-0.5">
                        <span className="hidden sm:inline-block text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                          {driver.nationality}
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-white leading-tight font-mono tracking-tight">
                          {driver.firstName[0]}. {driver.lastName}
                        </h4>
                        <span className="text-[9px] font-mono font-bold text-zinc-400 block truncate" style={{ color: driver.teamColor }}>
                          {driver.teamName.toUpperCase()}
                        </span>
                      </div>

                      {/* Points / Wins HUD */}
                      <div className="flex flex-col sm:flex-row justify-between items-center border-t border-zinc-900/60 pt-2 text-[10px] font-mono text-zinc-500 gap-1">
                        <div>
                          <span className="text-zinc-500 text-[8px] block uppercase">POINTS</span>
                          <span className="text-zinc-200 font-bold text-xs">{driver.points}</span>
                        </div>
                        <div className="text-center sm:text-right">
                          <span className="text-zinc-500 text-[8px] block uppercase">WINS</span>
                          <span className="text-zinc-200 font-bold text-xs">{driver.wins}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Grid Drivers Standings List (Table Layout) */}
          <div className="bg-zinc-900/10 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-zinc-400">
                <thead className="bg-zinc-950 text-zinc-500 uppercase tracking-widest text-[9px] font-bold border-b border-zinc-900">
                  <tr>
                    <th className="py-4 px-6 text-center w-16">POS</th>
                    <th className="py-4 px-4">DRIVER</th>
                    <th className="py-4 px-4">CONSTRUCTOR</th>
                    <th className="py-4 px-4 hidden sm:table-cell">NATIONALITY</th>
                    <th className="py-4 px-4 text-center w-24">WINS</th>
                    <th className="py-4 px-6 text-right w-24">POINTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900/60">
                  {listDrivers.map((driver) => (
                    <tr 
                      key={driver.driverId} 
                      className="hover:bg-zinc-900/30 transition-all duration-150 group"
                    >
                      {/* Position */}
                      <td className="py-4 px-6 text-center font-bold text-zinc-300">
                        {driver.position}
                      </td>

                      {/* Driver Name */}
                      <td className="py-4 px-4 font-bold text-zinc-200 group-hover:text-white transition-colors">
                        <span className="text-zinc-500 text-[9px] font-bold mr-2 uppercase bg-zinc-950 border border-zinc-900 px-1.5 py-0.5 rounded">
                          {driver.number}
                        </span>
                        {driver.firstName} {driver.lastName}
                      </td>

                      {/* Constructor */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-3 rounded-sm block shrink-0" style={{ backgroundColor: driver.teamColor }} />
                          <span className="text-zinc-200 font-bold group-hover:text-zinc-100 transition-colors">
                            {driver.teamName}
                          </span>
                        </div>
                      </td>

                      {/* Nationality */}
                      <td className="py-4 px-4 hidden sm:table-cell text-zinc-500">
                        {driver.nationality}
                      </td>

                      {/* Wins */}
                      <td className="py-4 px-4 text-center text-zinc-300">
                        {driver.wins > 0 ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 text-yellow-500 border border-zinc-800 text-[10px]">
                            <Award size={10} /> {driver.wins}
                          </span>
                        ) : (
                          "0"
                        )}
                      </td>

                      {/* Points */}
                      <td className="py-4 px-6 text-right font-black text-white text-sm">
                        {driver.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Constructor Standings List (Table Layout) */
        <div className="bg-zinc-900/10 border border-zinc-900 rounded-xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs text-zinc-400">
              <thead className="bg-zinc-950 text-zinc-500 uppercase tracking-widest text-[9px] font-bold border-b border-zinc-900">
                <tr>
                  <th className="py-4 px-6 text-center w-16">POS</th>
                  <th className="py-4 px-4">CONSTRUCTOR</th>
                  <th className="py-4 px-4 hidden sm:table-cell">NATIONALITY</th>
                  <th className="py-4 px-4 text-center w-24">WINS</th>
                  <th className="py-4 px-6 text-right w-24">POINTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {constructors?.map((team) => (
                  <tr 
                    key={team.teamId} 
                    className="hover:bg-zinc-900/30 transition-all duration-150 group"
                  >
                    {/* Position */}
                    <td className="py-4 px-6 text-center font-bold text-zinc-300">
                      {team.position}
                    </td>

                    {/* Constructor Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-4 rounded-sm block shrink-0" style={{ backgroundColor: team.teamColor }} />
                        <span className="text-zinc-200 font-bold text-sm group-hover:text-white transition-colors">
                          {team.teamName}
                        </span>
                      </div>
                    </td>

                    {/* Nationality */}
                    <td className="py-4 px-4 hidden sm:table-cell text-zinc-500">
                      {team.nationality}
                    </td>

                    {/* Wins */}
                    <td className="py-4 px-4 text-center text-zinc-300">
                      {team.wins > 0 ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-900 text-yellow-500 border border-zinc-800 text-[10px]">
                          <Award size={10} /> {team.wins}
                        </span>
                      ) : (
                        "0"
                      )}
                    </td>

                    {/* Points */}
                    <td className="py-4 px-6 text-right font-black text-white text-sm">
                      {team.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
