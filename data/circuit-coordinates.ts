/**
 * Formula 1 Circuits GPS Coordinate Database
 * Maps circuit IDs and normalized circuit names to latitude and longitude.
 * Used for fetching weather data from Open-Meteo.
 */

export interface GPSCoordinates {
  latitude: number;
  longitude: number;
}

export const CIRCUIT_COORDINATES: Record<string, GPSCoordinates> = {
  albert_park: { latitude: -37.8497, longitude: 144.968 },
  melbourne: { latitude: -37.8497, longitude: 144.968 },
  bahrain: { latitude: 26.0325, longitude: 50.5106 },
  sakhir: { latitude: 26.0325, longitude: 50.5106 },
  jeddah: { latitude: 21.6319, longitude: 39.1044 },
  suzuka: { latitude: 34.8431, longitude: 136.541 },
  shanghai: { latitude: 31.3389, longitude: 121.22 },
  miami: { latitude: 25.9581, longitude: -80.2389 },
  imola: { latitude: 44.3439, longitude: 11.7167 },
  monaco: { latitude: 43.7347, longitude: 7.4206 },
  monte_carlo: { latitude: 43.7347, longitude: 7.4206 },
  villeneuve: { latitude: 45.5006, longitude: -73.5228 },
  montreal: { latitude: 45.5006, longitude: -73.5228 },
  barcelona: { latitude: 41.57, longitude: 2.2611 },
  catalunya: { latitude: 41.57, longitude: 2.2611 },
  red_bull_ring: { latitude: 47.2197, longitude: 14.7647 },
  spielberg: { latitude: 47.2197, longitude: 14.7647 },
  silverstone: { latitude: 52.0786, longitude: -1.0169 },
  hungaroring: { latitude: 47.5831, longitude: 19.2508 },
  budapest: { latitude: 47.5831, longitude: 19.2508 },
  spa: { latitude: 50.4372, longitude: 5.9714 },
  zandvoort: { latitude: 52.3888, longitude: 4.5409 },
  monza: { latitude: 45.6156, longitude: 9.2811 },
  baku: { latitude: 40.3725, longitude: 49.8533 },
  marina_bay: { latitude: 1.2914, longitude: 103.864 },
  singapore: { latitude: 1.2914, longitude: 103.864 },
  americas: { latitude: 30.1328, longitude: -97.6411 },
  austin: { latitude: 30.1328, longitude: -97.6411 },
  rodriguez: { latitude: 19.4042, longitude: -99.0907 },
  mexico: { latitude: 19.4042, longitude: -99.0907 },
  interlagos: { latitude: -23.7036, longitude: -46.6997 },
  sao_paulo: { latitude: -23.7036, longitude: -46.6997 },
  vegas: { latitude: 36.1147, longitude: -115.1728 },
  las_vegas: { latitude: 36.1147, longitude: -115.1728 },
  losail: { latitude: 25.49, longitude: 51.4542 },
  qatar: { latitude: 25.49, longitude: 51.4542 },
  yas_marina: { latitude: 24.4672, longitude: 54.6031 },
  abu_dhabi: { latitude: 24.4672, longitude: 54.6031 }
};

/**
 * Retrieves GPS coordinates for a circuit based on normalized short name or location.
 * Gracefully defaults to null if not found.
 */
export function getCircuitCoordinates(circuitShortName?: string, location?: string): GPSCoordinates | null {
  if (circuitShortName) {
    const normName = circuitShortName.toLowerCase().replace(/[\s-]/g, "_");
    if (CIRCUIT_COORDINATES[normName]) return CIRCUIT_COORDINATES[normName];
  }
  
  if (location) {
    const normLoc = location.toLowerCase().replace(/[\s-]/g, "_");
    if (CIRCUIT_COORDINATES[normLoc]) return CIRCUIT_COORDINATES[normLoc];
  }

  // Substring fallback checks
  const combined = `${circuitShortName || ""} ${location || ""}`.toLowerCase();
  for (const key of Object.keys(CIRCUIT_COORDINATES)) {
    if (combined.includes(key.replace(/_/g, " "))) {
      return CIRCUIT_COORDINATES[key];
    }
  }

  return null;
}
