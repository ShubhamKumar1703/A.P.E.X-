import { OpenF1CarData } from "@/lib/services/openf1/types";

/**
 * Compiles high-level telemetry stats from a stream of telemetry data.
 */
export function formatTelemetryContext(
  driverAcronym: string,
  driverNumber: number,
  samples: OpenF1CarData[]
): string {
  if (!samples || samples.length === 0) {
    return `Telemetry: No live trace data loaded for ${driverAcronym} (#${driverNumber}).`;
  }

  // Calculate averages and peaks
  let totalSpeed = 0;
  let maxSpeed = 0;
  let throttleSum = 0;
  let brakeCount = 0;
  const gearCounts: Record<number, number> = {};

  samples.forEach((sample) => {
    totalSpeed += sample.speed;
    if (sample.speed > maxSpeed) maxSpeed = sample.speed;
    throttleSum += sample.throttle;
    if (sample.brake > 50) brakeCount++;
    gearCounts[sample.gear] = (gearCounts[sample.gear] || 0) + 1;
  });

  const avgSpeed = Math.round(totalSpeed / samples.length);
  const avgThrottle = Math.round(throttleSum / samples.length);
  const brakePercentage = Math.round((brakeCount / samples.length) * 100);

  // Find dominant gear
  let dominantGear = -1;
  let maxCount = 0;
  Object.entries(gearCounts).forEach(([gearStr, count]) => {
    const gear = parseInt(gearStr, 10);
    if (count > maxCount) {
      maxCount = count;
      dominantGear = gear;
    }
  });

  return `=== TELEMETRY TRACE SUMMARY FOR ${driverAcronym} (#${driverNumber}) ===
- Avg Speed: ${avgSpeed} km/h (Max: ${maxSpeed} km/h)
- Avg Throttle Input: ${avgThrottle}%
- Brake Application Rate: ${brakePercentage}% of lap time
- Dominant Gear: P${dominantGear === 0 ? "N" : dominantGear}
- Active DRS status: ${samples[samples.length - 1]?.drs > 9 ? "OPENED" : "CLOSED"}`;
}
