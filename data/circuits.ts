/**
 * Formula 1 Circuits Technical Database
 * Centralizes technical stats, DRS zones, lap records, and histories for F1 tracks.
 */

export interface CircuitInfo {
  circuitId: string;
  turns: number;
  length: string; // e.g. "5.891 km"
  drsZones: number;
  lapRecord: {
    time: string;
    driver: string;
    year: number;
  };
  characteristics: string[];
  previousWinners: {
    year: number;
    driver: string;
    team: string;
  }[];
  description: string;
}

export const circuitsDb: Record<string, CircuitInfo> = {
  albert_park: {
    circuitId: "albert_park",
    turns: 14,
    length: "5.278 km",
    drsZones: 4,
    lapRecord: { time: "1:20.260", driver: "Lewis Hamilton", year: 2024 },
    characteristics: ["Street circuit layout", "High traction demand", "Medium downforce", "Fast flow"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Carlos Sainz", team: "Ferrari" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "Set around Melbourne's Albert Park Lake, this semi-street circuit is fast and flowing, featuring a newly reprofiled layout designed to maximize overtaking opportunities."
  },
  bahrain: {
    circuitId: "bahrain",
    turns: 15,
    length: "5.412 km",
    drsZones: 3,
    lapRecord: { time: "1:31.447", driver: "Pedro de la Rosa", year: 2005 },
    characteristics: ["Heavy braking zones", "High tyre degradation", "Desert wind variables", "Traction-focused"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "Located in the Sakhir desert, the Bahrain International Circuit is famous for intense night races, sand variables blowing onto the track surface, and extreme tyre degradation."
  },
  jeddah: {
    circuitId: "jeddah",
    turns: 27,
    length: "6.174 km",
    drsZones: 3,
    lapRecord: { time: "1:30.734", driver: "Lewis Hamilton", year: 2021 },
    characteristics: ["Ultra-high speed street track", "Blind corners", "Low grip limits", "Proximity to walls"],
    previousWinners: [
      { year: 2025, driver: "Sergio Perez", team: "Red Bull" },
      { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2023, driver: "Sergio Perez", team: "Red Bull" }
    ],
    description: "Jeddah is the fastest street circuit in the world, averaging speeds over 250 km/h. High concentration is key due to blind turns flanked by concrete barriers."
  },
  suzuka: {
    circuitId: "suzuka",
    turns: 18,
    length: "5.807 km",
    drsZones: 1,
    lapRecord: { time: "1:30.983", driver: "Lewis Hamilton", year: 2019 },
    characteristics: ["Figure-eight geometry", "High-G S-curves", "Highly technical", "Aerodynamic stress"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "A driver favorite, Suzuka is F1's only figure-eight circuit. Demands high aerodynamic efficiency and precision through the iconic Spoon Curve and 130R."
  },
  shanghai: {
    circuitId: "shanghai",
    turns: 16,
    length: "5.451 km",
    drsZones: 2,
    lapRecord: { time: "1:32.238", driver: "Michael Schumacher", year: 2004 },
    characteristics: ["Tightening Turn 1-2 complex", "Long 1.2km back straight", "Front tyre wear focus", "Varying grip levels"],
    previousWinners: [
      { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2019, driver: "Lewis Hamilton", team: "Mercedes" },
      { year: 2018, driver: "Daniel Ricciardo", team: "Red Bull" }
    ],
    description: "Designed to resemble the Chinese character 'shang' (上), this circuit features the spiral Turns 1 & 2 and the longest straight on the F1 calendar."
  },
  miami: {
    circuitId: "miami",
    turns: 19,
    length: "5.412 km",
    drsZones: 3,
    lapRecord: { time: "1:29.708", driver: "Max Verstappen", year: 2023 },
    characteristics: ["Temporary street layout", "Tight chicane section", "High ambient heat", "Overtaking straights"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Lando Norris", team: "McLaren" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "Set around the Hard Rock Stadium, this circuit mixes street track chicanes with dedicated high-speed straightaways."
  },
  imola: {
    circuitId: "imola",
    turns: 19,
    length: "4.909 km",
    drsZones: 1,
    lapRecord: { time: "1:15.484", driver: "Lewis Hamilton", year: 2020 },
    characteristics: ["Old-school gravel traps", "Anti-clockwise routing", "Narrow track width", "Challenging chicanes"],
    previousWinners: [
      { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2022, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2021, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "The Autodromo Enzo e Dino Ferrari (Imola) is a classic fast track flowing through Italian hillsides, requiring aggressive curb-riding and precise handling."
  },
  monaco: {
    circuitId: "monaco",
    turns: 19,
    length: "3.337 km",
    drsZones: 1,
    lapRecord: { time: "1:12.909", driver: "Lewis Hamilton", year: 2021 },
    characteristics: ["Narrowest street track", "Low speed corners", "High downforce config", "Zero margin of error"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Charles Leclerc", team: "Ferrari" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "The crown jewel of Formula 1. An iconic, narrow street layout winding through the Monaco harbor. Overtaking is almost impossible, putting extreme pressure on Saturday qualifying sessions."
  },
  villeneuve: {
    circuitId: "villeneuve",
    turns: 14,
    length: "4.361 km",
    drsZones: 3,
    lapRecord: { time: "1:13.078", driver: "Valtteri Bottas", year: 2019 },
    characteristics: ["Stop-and-go acceleration", "Wall of Champions exit", "Low downforce wings", "Brake wear strain"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "Located on Notre Dame Island, Montreal. A semi-permanent track famous for its close walls, aggressive curb-striking, and the legendary Wall of Champions."
  },
  barcelona: {
    circuitId: "barcelona",
    turns: 14,
    length: "4.657 km",
    drsZones: 2,
    lapRecord: { time: "1:16.330", driver: "Max Verstappen", year: 2023 },
    characteristics: ["High-speed sweepers", "Aerodynamic benchmark", "Front-left tyre stress", "Wind direction shifts"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "The classic European testing venue. Demands a highly efficient chassis. Features the long pit straight and high-speed final Turn 13-14 sequence."
  },
  red_bull_ring: {
    circuitId: "red_bull_ring",
    turns: 10,
    length: "4.318 km",
    drsZones: 3,
    lapRecord: { time: "1:05.619", driver: "Carlos Sainz", year: 2020 },
    characteristics: ["Short lap times", "High altitude variables", "Aggressive yellow curbs", "Overtaking opportunities"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "George Russell", team: "Mercedes" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "Set in the Styrian hills, the Red Bull Ring has only 10 corners and very short lap times. Aggressive elevation changes test engine torque."
  },
  silverstone: {
    circuitId: "silverstone",
    turns: 18,
    length: "5.891 km",
    drsZones: 2,
    lapRecord: { time: "1:27.097", driver: "Max Verstappen", year: 2020 },
    characteristics: ["Ultra fast Copse corner", "Maggotts-Becketts complex", "High lateral G-forces", "Unpredictable UK weather"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Lewis Hamilton", team: "Mercedes" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "The home of British motorsport. High-speed sweepers test the absolute limits of aerodynamic downforce and driver commitment."
  },
  hungaroring: {
    circuitId: "hungaroring",
    turns: 14,
    length: "4.381 km",
    drsZones: 2,
    lapRecord: { time: "1:16.627", driver: "Lewis Hamilton", year: 2020 },
    characteristics: ["Karting-style curves", "Dusty tarmac surfaces", "High ambient temp", "Low top-end speeds"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Oscar Piastri", team: "McLaren" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "Often called 'Monaco without walls', the Hungaroring is dusty, twisty, and hot. Brakes and chassis flexibility are highly taxed."
  },
  spa: {
    circuitId: "spa",
    turns: 19,
    length: "7.004 km",
    drsZones: 2,
    lapRecord: { time: "1:46.286", driver: "Valtteri Bottas", year: 2018 },
    characteristics: ["Longest circuit track", "Eau Rouge elevation", "Micro-climate rain", "Slipstream straightaways"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Lewis Hamilton", team: "Mercedes" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "A legendary circuit carved through the Belgian Ardennes forest. Features extreme elevation changes and the fast Eau Rouge/Raidillon complex."
  },
  zandvoort: {
    circuitId: "zandvoort",
    turns: 14,
    length: "4.259 km",
    drsZones: 2,
    lapRecord: { time: "1:11.097", driver: "Lewis Hamilton", year: 2021 },
    characteristics: ["Banked corners (18°)", "Sand dunes variables", "Tight track width", "Narrow overtaking zones"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Lando Norris", team: "McLaren" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "A historic seaside track winding through coastal sand dunes. Features unique banked turns at Turn 3 and the final Arie Luyendijk bocht."
  },
  monza: {
    circuitId: "monza",
    turns: 11,
    length: "5.793 km",
    drsZones: 2,
    lapRecord: { time: "1:21.046", driver: "Rubens Barrichello", year: 2004 },
    characteristics: ["Temple of Speed", "Ultra thin wing layouts", "Heavy chicane braking", "Engine power dominant"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Charles Leclerc", team: "Ferrari" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "The Temple of Speed. Teams run custom low-drag wings to maximize terminal velocity down Monza's infinite straights."
  },
  baku: {
    circuitId: "baku",
    turns: 20,
    length: "6.003 km",
    drsZones: 2,
    lapRecord: { time: "1:43.009", driver: "Charles Leclerc", year: 2019 },
    characteristics: ["2.2km main straight", "Castle section (7.6m)", "Low downforce street", "Heavy slipstream"],
    previousWinners: [
      { year: 2025, driver: "Sergio Perez", team: "Red Bull" },
      { year: 2024, driver: "Oscar Piastri", team: "McLaren" },
      { year: 2023, driver: "Sergio Perez", team: "Red Bull" }
    ],
    description: "Combines the tight, medieval castle street section with an ultra-long 2km straight where cars draft three-wide at 350 km/h."
  },
  marina_bay: {
    circuitId: "marina_bay",
    turns: 19,
    length: "4.940 km",
    drsZones: 3,
    lapRecord: { time: "1:35.867", driver: "Lewis Hamilton", year: 2023 },
    characteristics: ["Extreme humidity stress", "Bumpy street tarmac", "High traction demand", "Long 2-hour duration"],
    previousWinners: [
      { year: 2025, driver: "Carlos Sainz", team: "Ferrari" },
      { year: 2024, driver: "Lando Norris", team: "McLaren" },
      { year: 2023, driver: "Carlos Sainz", team: "Ferrari" }
    ],
    description: "F1's original night race. Extreme tropical heat and 19 corners test physical driver endurance and vehicle cooling systems."
  },
  americas: {
    circuitId: "americas",
    turns: 20,
    length: "5.513 km",
    drsZones: 2,
    lapRecord: { time: "1:36.169", driver: "Charles Leclerc", year: 2019 },
    characteristics: ["Steep hill climb Turn 1", "S-curve copy inputs", "Bumpiness on braking", "Varying track width"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Charles Leclerc", team: "Ferrari" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "The Circuit of the Americas in Austin. Features a signature 41-meter climb into Turn 1 and sweeps inspired by Silverstone and Suzuka."
  },
  rodriguez: {
    circuitId: "rodriguez",
    turns: 17,
    length: "4.304 km",
    drsZones: 3,
    lapRecord: { time: "1:17.774", driver: "Valtteri Bottas", year: 2021 },
    characteristics: ["High altitude (2,200m)", "Thin cooling air", "Foro Sol baseball stadium", "Low mechanical drag"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Carlos Sainz", team: "Ferrari" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "Sitting 2,240 meters above sea level, the thin air reduces cooling capacity and wing downforce, making it a unique engineering challenge."
  },
  interlagos: {
    circuitId: "interlagos",
    turns: 15,
    length: "4.309 km",
    drsZones: 2,
    lapRecord: { time: "1:10.540", driver: "Valtteri Bottas", year: 2018 },
    characteristics: ["Anti-clockwise layout", "Steep start straight", "Dusty infield runs", "Unpredictable showers"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "The Autódromo José Carlos Pace (Interlagos) in São Paulo. A short, historic track with legendary elevation climbs and frequent dramatic wet races."
  },
  vegas: {
    circuitId: "vegas",
    turns: 17,
    length: "6.201 km",
    drsZones: 2,
    lapRecord: { time: "1:35.490", driver: "Oscar Piastri", year: 2023 },
    characteristics: ["Cold night conditions", "Las Vegas Strip straight", "Low tyre temperature", "Heated slipstreams"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "George Russell", team: "Mercedes" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "Winds through the heart of Las Vegas at night, past the Sphere and down the Strip. Extreme low temperatures test tyre warming strategy."
  },
  losail: {
    circuitId: "losail",
    turns: 16,
    length: "5.419 km",
    drsZones: 1,
    lapRecord: { time: "1:24.319", driver: "Max Verstappen", year: 2023 },
    characteristics: ["Medium-high speed bends", "Intense curbing loads", "Sand blowing overlays", "High downforce grip"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "A fast, flowing track layout in Qatar. Pushes tyres to their absolute lateral load limits over high-speed sweepers."
  },
  yas_marina: {
    circuitId: "yas_marina",
    turns: 16,
    length: "5.281 km",
    drsZones: 2,
    lapRecord: { time: "1:26.103", driver: "Max Verstappen", year: 2021 },
    characteristics: ["Day-to-night transitions", "Marina hotel backdrop", "Heavy braking straights", "Tyre traction limit"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2024, driver: "Max Verstappen", team: "Red Bull" },
      { year: 2023, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "The season finale venue in Abu Dhabi. Features long back straights and a yacht-lined hotel complex sector."
  }
};

/**
 * Gets circuit specifications from database, or returns default specs if not recognized.
 */
export function getCircuitDetails(circuitId: string): CircuitInfo {
  const normalized = circuitId.toLowerCase().replace(/[\s-]/g, "_");
  
  if (circuitsDb[normalized]) {
    return circuitsDb[normalized];
  }
  
  return {
    circuitId,
    turns: 15,
    length: "5.000 km",
    drsZones: 2,
    lapRecord: { time: "1:30.000", driver: "Unknown Driver", year: 2026 },
    characteristics: ["Standard race layout", "Medium aerodynamic stress"],
    previousWinners: [
      { year: 2025, driver: "Max Verstappen", team: "Red Bull" }
    ],
    description: "F1 Championship Circuit layout."
  };
}
