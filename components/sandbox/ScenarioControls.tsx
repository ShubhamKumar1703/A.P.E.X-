import React from "react";
import { Sliders, Save, Copy, RotateCcw, AlertTriangle, CloudRain, Sun, Wind } from "lucide-react";
import { ScenarioState, WeatherScenario, RaceEvent } from "@/lib/sandbox/types";

interface ScenarioControlsProps {
  activeScenario: ScenarioState;
  activeTab: "A" | "B";
  setActiveTab: (tab: "A" | "B") => void;
  onUpdateScenario: (updates: Partial<ScenarioState>) => void;
  onSaveScenario: () => void;
  onDuplicateToOther: () => void;
  onResetScenarios: () => void;
  savedScenariosList: { id: string; name: string }[];
  onLoadScenario: (id: string) => void;
}

const DRIVERS_LIST = [
  { num: 1, acronym: "VER", name: "Max Verstappen" },
  { num: 44, acronym: "HAM", name: "Lewis Hamilton" },
  { num: 4, acronym: "NOR", name: "Lando Norris" },
  { num: 16, acronym: "LEC", name: "Charles Leclerc" },
  { num: 81, acronym: "PIA", name: "Oscar Piastri" },
  { num: 55, acronym: "SAI", name: "Carlos Sainz" },
  { num: 63, acronym: "RUS", name: "George Russell" },
  { num: 14, acronym: "ALO", name: "Fernando Alonso" },
  { num: 11, acronym: "PER", name: "Sergio Perez" },
  { num: 10, acronym: "GAS", name: "Pierre Gasly" },
  { num: 31, acronym: "OCO", name: "Esteban Ocon" },
  { num: 23, acronym: "ALB", name: "Alexander Albon" },
  { num: 22, acronym: "TSU", name: "Yuki Tsunoda" },
  { num: 27, acronym: "HUL", name: "Nico Hulkenberg" },
  { num: 18, acronym: "STR", name: "Lance Stroll" },
  { num: 20, acronym: "MAG", name: "Kevin Magnussen" },
  { num: 77, acronym: "BOT", name: "Valtteri Bottas" },
  { num: 24, acronym: "ZHO", name: "Zhou Guanyu" },
  { num: 12, acronym: "LAW", name: "Liam Lawson" },
  { num: 2, acronym: "SAR", name: "Logan Sargeant" }
];

export function ScenarioControls({
  activeScenario,
  activeTab,
  setActiveTab,
  onUpdateScenario,
  onSaveScenario,
  onDuplicateToOther,
  onResetScenarios,
  savedScenariosList,
  onLoadScenario
}: ScenarioControlsProps) {
  
  const handleDriverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(e.target.value, 10);
    const drv = DRIVERS_LIST.find(d => d.num === num);
    if (drv) {
      onUpdateScenario({
        driverNumber: drv.num,
        driverAcronym: drv.acronym
      });
    }
  };

  const handleWeatherChange = <K extends keyof WeatherScenario>(key: K, value: WeatherScenario[K]) => {
    onUpdateScenario({
      weather: {
        ...activeScenario.weather,
        [key]: value
      }
    });
  };

  return (
    <div className="border border-zinc-900 bg-zinc-950/20 rounded-xl p-4 flex flex-col h-full font-mono text-zinc-300 overflow-y-auto custom-scrollbar space-y-4">
      {/* Workspace Header & Tab Selector */}
      <div className="flex flex-col gap-2.5 border-b border-zinc-900 pb-3">
        <div className="flex items-center gap-2">
          <Sliders size={14} className="text-[#FF1801]" />
          <span className="text-xs font-black uppercase tracking-wider text-white">
            SCENARIO EDITOR
          </span>
        </div>
        
        {/* Scenario Tab Toggles */}
        <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-900">
          <button
            onClick={() => setActiveTab("A")}
            className={`py-1.5 px-3 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
              activeTab === "A"
                ? "bg-[#FF1801] text-white shadow shadow-[#FF1801]/20"
                : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            Scenario A
          </button>
          <button
            onClick={() => setActiveTab("B")}
            className={`py-1.5 px-3 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
              activeTab === "B"
                ? "bg-blue-500 text-white shadow shadow-blue-500/20"
                : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            Scenario B
          </button>
        </div>
      </div>

      {/* Driver & Track Controls */}
      <div className="space-y-3.5 text-[10px]">
        <span className="text-zinc-500 font-bold uppercase tracking-wider text-[8px] block">
          DRIVER & TRACK VARIABLES
        </span>

        {/* Driver Selector */}
        <div className="flex flex-col gap-1">
          <label className="text-zinc-500 font-bold uppercase">Target Driver:</label>
          <select
            value={activeScenario.driverNumber}
            onChange={handleDriverChange}
            className="bg-zinc-950 border border-zinc-900 rounded px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#FF1801] transition-all cursor-pointer w-full"
          >
            {DRIVERS_LIST.map(d => (
              <option key={d.num} value={d.num}>
                #{d.num} {d.acronym} &mdash; {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* Position, Lap & Pitstop Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Position */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 font-bold uppercase">Position (P{activeScenario.currentPosition}):</label>
            <input
              type="range"
              min={1}
              max={20}
              value={activeScenario.currentPosition}
              onChange={(e) => onUpdateScenario({ currentPosition: parseInt(e.target.value, 10) })}
              className="accent-[#FF1801] w-full"
            />
          </div>

          {/* Current Lap */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 font-bold uppercase">Current Lap ({activeScenario.currentLap}/70):</label>
            <input
              type="range"
              min={1}
              max={70}
              value={activeScenario.currentLap}
              onChange={(e) => onUpdateScenario({ currentLap: parseInt(e.target.value, 10) })}
              className="accent-[#FF1801] w-full"
            />
          </div>

          {/* completed stops */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 font-bold uppercase">Pit Stops Staged ({activeScenario.pitStopsCount}):</label>
            <input
              type="range"
              min={0}
              max={4}
              value={activeScenario.pitStopsCount}
              onChange={(e) => onUpdateScenario({ pitStopsCount: parseInt(e.target.value, 10) })}
              className="accent-[#FF1801] w-full"
            />
          </div>

          {/* target pit lap */}
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 font-bold uppercase">Target Pit Lap (Lap {activeScenario.targetPitLap}):</label>
            <input
              type="range"
              min={activeScenario.currentLap}
              max={70}
              value={activeScenario.targetPitLap}
              onChange={(e) => onUpdateScenario({ targetPitLap: parseInt(e.target.value, 10) })}
              className="accent-[#FF1801] w-full"
            />
          </div>
        </div>

        {/* Stint tyre variables */}
        <div className="border border-zinc-900 bg-zinc-950/40 p-2.5 rounded-lg space-y-2.5">
          <span className="text-zinc-500 font-bold uppercase tracking-wider text-[8px] block">
            TYRE PARAMETERS
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-zinc-500 font-bold uppercase">Current Tyre:</label>
              <select
                value={activeScenario.tyreCompound}
                onChange={(e) => onUpdateScenario({ tyreCompound: e.target.value as "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET" })}
                className="bg-zinc-950 border border-zinc-900 rounded p-1.5 focus:outline-none focus:border-[#FF1801] transition-all cursor-pointer text-zinc-300"
              >
                <option value="SOFT">SOFT (S)</option>
                <option value="MEDIUM">MEDIUM (M)</option>
                <option value="HARD">HARD (H)</option>
                <option value="INTERMEDIATE">INTER (I)</option>
                <option value="WET">WET (W)</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-zinc-500 font-bold uppercase">Tyre Age ({activeScenario.tyreAge} laps):</label>
              <input
                type="range"
                min={0}
                max={50}
                value={activeScenario.tyreAge}
                onChange={(e) => onUpdateScenario({ tyreAge: parseInt(e.target.value, 10) })}
                className="accent-[#FF1801] w-full"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-zinc-500 font-bold uppercase">Next Tyre Compound:</label>
              <select
                value={activeScenario.nextTyreCompound}
                onChange={(e) => onUpdateScenario({ nextTyreCompound: e.target.value as "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET" })}
                className="bg-zinc-950 border border-zinc-900 rounded p-1.5 focus:outline-none focus:border-[#FF1801] transition-all cursor-pointer text-zinc-300"
              >
                <option value="SOFT">SOFT (S)</option>
                <option value="MEDIUM">MEDIUM (M)</option>
                <option value="HARD">HARD (H)</option>
                <option value="INTERMEDIATE">INTER (I)</option>
                <option value="WET">WET (W)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Intervals */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 font-bold uppercase">Gap Ahead ({activeScenario.gapAhead.toFixed(1)}s):</label>
            <input
              type="range"
              min={0.1}
              max={10.0}
              step={0.1}
              value={activeScenario.gapAhead}
              onChange={(e) => onUpdateScenario({ gapAhead: parseFloat(e.target.value) })}
              className="accent-[#FF1801] w-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-zinc-500 font-bold uppercase">Gap Behind ({activeScenario.gapBehind.toFixed(1)}s):</label>
            <input
              type="range"
              min={0.1}
              max={10.0}
              step={0.1}
              value={activeScenario.gapBehind}
              onChange={(e) => onUpdateScenario({ gapBehind: parseFloat(e.target.value) })}
              className="accent-[#FF1801] w-full"
            />
          </div>
        </div>

        {/* Weather simulation variables */}
        <div className="border border-zinc-900 bg-zinc-950/40 p-2.5 rounded-lg space-y-2.5">
          <span className="text-zinc-500 font-bold uppercase tracking-wider text-[8px] block flex items-center gap-1">
            <CloudRain size={10} />
            ENVIRONMENT ENVIRONMENT SENSORS
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1">
              <label className="text-zinc-500 font-bold uppercase flex items-center gap-0.5">
                <Sun size={9} /> Air Temp ({activeScenario.weather.airTemperature}°C):
              </label>
              <input
                type="range"
                min={5}
                max={45}
                value={activeScenario.weather.airTemperature}
                onChange={(e) => handleWeatherChange("airTemperature", parseInt(e.target.value, 10))}
                className="accent-[#FF1801] w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-500 font-bold uppercase flex items-center gap-0.5">
                <CloudRain size={9} /> Rain Prob ({activeScenario.weather.rainProbability}%):
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={activeScenario.weather.rainProbability}
                onChange={(e) => handleWeatherChange("rainProbability", parseInt(e.target.value, 10))}
                className="accent-[#FF1801] w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-500 font-bold uppercase">Track Evolution:</label>
              <select
                value={activeScenario.weather.trackEvolution}
                onChange={(e) => handleWeatherChange("trackEvolution", e.target.value as "Low" | "Medium" | "High")}
                className="bg-zinc-950 border border-zinc-900 rounded p-1 focus:outline-none focus:border-[#FF1801] transition-all cursor-pointer text-zinc-300"
              >
                <option value="Low">Low Evolution</option>
                <option value="Medium">Medium Evolution</option>
                <option value="High">High Evolution</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-zinc-500 font-bold uppercase flex items-center gap-0.5">
                <Wind size={9} /> Wind Speed ({activeScenario.weather.windSpeed} km/h):
              </label>
              <input
                type="range"
                min={0}
                max={55}
                value={activeScenario.weather.windSpeed}
                onChange={(e) => handleWeatherChange("windSpeed", parseInt(e.target.value, 10))}
                className="accent-[#FF1801] w-full"
              />
            </div>
          </div>
        </div>

        {/* Track Events */}
        <div className="flex flex-col gap-1">
          <label className="text-zinc-500 font-bold uppercase flex items-center gap-1">
            <AlertTriangle size={10} className="text-yellow-500" />
            Active Track Event:
          </label>
          <select
            value={activeScenario.raceEvent}
            onChange={(e) => onUpdateScenario({ raceEvent: e.target.value as RaceEvent })}
            className="bg-zinc-950 border border-zinc-900 rounded px-2 py-1.5 text-zinc-200 focus:outline-none focus:border-[#FF1801] transition-all cursor-pointer"
          >
            <option value="NONE">NO EVENT // TRACK CLEAR</option>
            <option value="SAFETY_CAR">SAFETY CAR (SC)</option>
            <option value="VIRTUAL_SAFETY_CAR">VIRTUAL SAFETY CAR (VSC)</option>
            <option value="RED_FLAG">RED FLAG (FREE TYRE CHANGE)</option>
          </select>
        </div>
      </div>

      {/* Scenario Persistence and Presets */}
      <div className="pt-3 border-t border-zinc-900 space-y-3 mt-auto shrink-0 text-[10px]">
        {/* Preset Selector */}
        {savedScenariosList.length > 0 && (
          <div className="flex flex-col gap-1 text-[9px]">
            <label className="text-zinc-500 font-bold uppercase">LOAD SCENARIO PRESET:</label>
            <select
              onChange={(e) => {
                if (e.target.value) onLoadScenario(e.target.value);
              }}
              value=""
              className="bg-zinc-950 border border-zinc-900 rounded p-1 text-zinc-400 focus:outline-none cursor-pointer"
            >
              <option value="" disabled>-- Select scenario --</option>
              {savedScenariosList.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Persistence CTA buttons */}
        <div className="grid grid-cols-2 gap-2 text-[9px]">
          <button
            onClick={onSaveScenario}
            className="flex items-center justify-center gap-1 bg-[#FF1801]/10 text-white border border-[#FF1801]/25 hover:bg-[#FF1801]/20 py-2 rounded font-black uppercase cursor-pointer transition-all"
          >
            <Save size={11} className="text-[#FF1801]" />
            Save Preset
          </button>
          <button
            onClick={onDuplicateToOther}
            className="flex items-center justify-center gap-1 bg-zinc-900 text-zinc-350 border border-zinc-800 hover:bg-zinc-800 py-2 rounded font-black uppercase cursor-pointer transition-all"
          >
            <Copy size={11} />
            Copy to {activeTab === "A" ? "B" : "A"}
          </button>
        </div>

        <button
          onClick={onResetScenarios}
          className="flex items-center justify-center gap-1 w-full bg-zinc-950 text-zinc-500 border border-zinc-900 hover:border-zinc-850 hover:text-zinc-400 py-1.5 rounded uppercase font-bold text-[8.5px] cursor-pointer transition-all"
        >
          <RotateCcw size={10} />
          Reset Workspace to Defaults
        </button>
      </div>
    </div>
  );
}
export default ScenarioControls;
