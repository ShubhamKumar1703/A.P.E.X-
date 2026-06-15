"use client";

import React, { useState, useEffect, useMemo } from "react";
import { runStrategySimulation } from "@/lib/sandbox/simulator";
import { ScenarioState } from "@/lib/sandbox/types";
import { ScenarioControls } from "@/components/sandbox/ScenarioControls";
import { SimulationResults } from "@/components/sandbox/SimulationResults";
import { StrategyTimeline } from "@/components/sandbox/StrategyTimeline";
import { ScenarioComparison } from "@/components/sandbox/ScenarioComparison";
import { SandboxChatWindow } from "@/components/sandbox/SandboxChatWindow";

// Default Scenarios
const DEFAULT_SCENARIO_A: ScenarioState = {
  id: "default-dry",
  name: "Dry Target One-Stop",
  driverNumber: 44,
  driverAcronym: "HAM",
  currentLap: 10,
  currentPosition: 3,
  tyreCompound: "MEDIUM",
  tyreAge: 10,
  gapAhead: 1.5,
  gapBehind: 2.1,
  pitStopsCount: 0,
  weather: {
    rainProbability: 5,
    airTemperature: 24,
    trackEvolution: "Medium",
    windSpeed: 12
  },
  raceEvent: "NONE",
  targetPitLap: 26,
  nextTyreCompound: "HARD"
};

const DEFAULT_SCENARIO_B: ScenarioState = {
  id: "default-rain",
  name: "Rain Stint Forecast",
  driverNumber: 44,
  driverAcronym: "HAM",
  currentLap: 10,
  currentPosition: 3,
  tyreCompound: "MEDIUM",
  tyreAge: 10,
  gapAhead: 1.5,
  gapBehind: 2.1,
  pitStopsCount: 0,
  weather: {
    rainProbability: 75,
    airTemperature: 19,
    trackEvolution: "Medium",
    windSpeed: 18
  },
  raceEvent: "NONE",
  targetPitLap: 16,
  nextTyreCompound: "INTERMEDIATE"
};

export default function StrategySandboxPage() {
  const [activeTab, setActiveTab] = useState<"A" | "B">("A");
  const [scenarioA, setScenarioA] = useState<ScenarioState>(DEFAULT_SCENARIO_A);
  const [scenarioB, setScenarioB] = useState<ScenarioState>(DEFAULT_SCENARIO_B);
  
  // List of saved scenarios loaded from localStorage
  const [savedScenariosList, setSavedScenariosList] = useState<{ id: string; name: string; state: ScenarioState }[]>([]);

  // Load saved scenarios from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("apex_sandbox_scenarios");
    if (saved) {
      try {
        setSavedScenariosList(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to load saved scenarios from localStorage:", err);
      }
    }
  }, []);

  // Recalculate simulation results deterministically upon state change
  const resultA = useMemo(() => runStrategySimulation(scenarioA), [scenarioA]);
  const resultB = useMemo(() => runStrategySimulation(scenarioB), [scenarioB]);

  const activeScenario = activeTab === "A" ? scenarioA : scenarioB;
  const activeResult = activeTab === "A" ? resultA : resultB;

  // Handle Scenario editor updates
  const handleUpdateScenario = (updates: Partial<ScenarioState>) => {
    if (activeTab === "A") {
      setScenarioA(prev => ({ ...prev, ...updates }));
    } else {
      setScenarioB(prev => ({ ...prev, ...updates }));
    }
  };

  // Save scenario preset to localStorage
  const handleSaveScenario = () => {
    const defaultName = activeScenario.name;
    const name = window.prompt("Enter a name for this strategy preset:", defaultName);
    if (!name) return; // User cancelled

    const updatedState = { ...activeScenario, name };
    if (activeTab === "A") {
      setScenarioA(updatedState);
    } else {
      setScenarioB(updatedState);
    }

    const newItem = {
      id: `preset-${Date.now()}`,
      name,
      state: updatedState
    };

    const updatedList = [...savedScenariosList.filter(s => s.name !== name), newItem];
    setSavedScenariosList(updatedList);
    localStorage.setItem("apex_sandbox_scenarios", JSON.stringify(updatedList));
  };

  // Load scenario from presets
  const handleLoadScenario = (id: string) => {
    const preset = savedScenariosList.find(s => s.id === id);
    if (!preset) return;

    if (activeTab === "A") {
      setScenarioA({ ...preset.state, id: "scenario-a" });
    } else {
      setScenarioB({ ...preset.state, id: "scenario-b" });
    }
  };

  // Copy current active scenario parameters to the other tab
  const handleDuplicateToOther = () => {
    if (activeTab === "A") {
      setScenarioB({
        ...scenarioA,
        id: "scenario-b",
        name: `${scenarioA.name} (Copy)`
      });
    } else {
      setScenarioA({
        ...scenarioB,
        id: "scenario-a",
        name: `${scenarioB.name} (Copy)`
      });
    }
  };

  // Reset workspace
  const handleResetScenarios = () => {
    if (window.confirm("Are you sure you want to reset the strategy sandbox workspace to defaults?")) {
      setScenarioA(DEFAULT_SCENARIO_A);
      setScenarioB(DEFAULT_SCENARIO_B);
    }
  };

  return (
    <div className="space-y-6">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}} />
      
      {/* Page Title Header */}
      <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 md:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">
              STRATEGY SANDBOX WORKSTATION
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
            STRATEGY SIMULATOR //{" "}
            <span className="text-zinc-400">COCKPIT EDITOR</span>
          </h2>
          <div className="text-[10px] text-zinc-550 font-bold flex gap-4">
            <span>DETERMINISTIC SIMULATIONS FIRST // AI INTERPRETER SECOND</span>
          </div>
        </div>
      </div>

      {/* Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column (3/12): Controls Editor */}
        <div className="lg:col-span-4 bg-zinc-950/10 border border-zinc-900/60 rounded-xl p-0 h-[650px] lg:h-[750px]">
          <ScenarioControls
            activeScenario={activeScenario}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onUpdateScenario={handleUpdateScenario}
            onSaveScenario={handleSaveScenario}
            onDuplicateToOther={handleDuplicateToOther}
            onResetScenarios={handleResetScenarios}
            savedScenariosList={savedScenariosList.map(s => ({ id: s.id, name: s.name }))}
            onLoadScenario={handleLoadScenario}
          />
        </div>

        {/* Center Column (5/12): Simulation Outputs & Visualizer */}
        <div className="lg:col-span-5 space-y-4 overflow-y-auto h-[650px] lg:h-[750px] custom-scrollbar pr-1">
          
          {/* Main Results Board */}
          <SimulationResults
            result={activeResult}
            scenarioName={activeScenario.name}
            themeColorClass={activeTab === "A" ? "text-[#FF1801]" : "text-blue-500"}
            borderColorClass={activeTab === "A" ? "border-[#FF1801]/10" : "border-blue-500/10"}
            bgGlowClass={activeTab === "A" ? "bg-[#FF1801]/5" : "bg-blue-500/5"}
          />

          {/* Timeline bar */}
          <StrategyTimeline
            scenario={activeScenario}
            result={activeResult}
          />

          {/* Scenario Side-by-Side Comparison widget */}
          <ScenarioComparison
            scenarioA={scenarioA}
            resultA={resultA}
            scenarioB={scenarioB}
            resultB={resultB}
          />
        </div>

        {/* Right Column (3/12): AI Race Engineer Terminal */}
        <div className="lg:col-span-3 h-[650px] lg:h-[750px]">
          <SandboxChatWindow
            scenarioA={scenarioA}
            resultA={resultA}
            scenarioB={scenarioB}
            resultB={resultB}
          />
        </div>

      </div>
    </div>
  );
}
