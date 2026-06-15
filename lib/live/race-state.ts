import { OpenF1RaceControl } from "../services/openf1/types";

export interface LiveRaceState {
  flagStatus: "GREEN" | "YELLOW" | "RED" | "BLUE" | "CLEAR";
  trackAlert: "SAFETY_CAR" | "VIRTUAL_SAFETY_CAR" | "NONE";
  latestMessage: string;
  messages: OpenF1RaceControl[];
}

/**
 * Aggregates race control messages to determine current track flag flags and safety car status.
 */
export function aggregateRaceState(messages: OpenF1RaceControl[]): LiveRaceState {
  // Sort messages descending by date (latest first)
  const sorted = [...messages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  let flagStatus: "GREEN" | "YELLOW" | "RED" | "BLUE" | "CLEAR" = "CLEAR";
  let trackAlert: "SAFETY_CAR" | "VIRTUAL_SAFETY_CAR" | "NONE" = "NONE";
  let latestMessage = "Track green. All sessions active.";

  if (sorted.length > 0) {
    latestMessage = sorted[0].message;
    
    // Find the latest message with an active flag state
    const flagMsg = sorted.find((m) => m.flag !== null);
    if (flagMsg && flagMsg.flag) {
      const f = flagMsg.flag.toUpperCase();
      if (f.includes("YELLOW") || f.includes("DOUBLE")) {
        flagStatus = "YELLOW";
      } else if (f.includes("RED")) {
        flagStatus = "RED";
      } else if (f.includes("GREEN") || f.includes("CLEAR")) {
        flagStatus = "GREEN";
      } else if (f.includes("BLUE")) {
        flagStatus = "BLUE";
      }
    }

    // Determine safety car / VSC deployment from recent messages
    const scMsg = sorted.find((m) => 
      m.message.toUpperCase().includes("SAFETY CAR") || 
      m.message.toUpperCase().includes("VIRTUAL SAFETY CAR") ||
      m.message.toUpperCase().includes("VSC")
    );

    if (scMsg) {
      const msgText = scMsg.message.toUpperCase();
      if (msgText.includes("VIRTUAL SAFETY CAR") || msgText.includes("VSC")) {
        if (!msgText.includes("CONCLUDED") && !msgText.includes("ENDING") && !msgText.includes("CLEAR")) {
          trackAlert = "VIRTUAL_SAFETY_CAR";
        }
      } else if (msgText.includes("SAFETY CAR")) {
        if (!msgText.includes("CONCLUDED") && !msgText.includes("ENDING") && !msgText.includes("IN THIS LAP")) {
          trackAlert = "SAFETY_CAR";
        }
      }
    }
  }

  // If trackAlert is active, override flagStatus to YELLOW (as standard F1 regulation)
  if (trackAlert !== "NONE" && flagStatus !== "RED") {
    flagStatus = "YELLOW";
  }

  return {
    flagStatus,
    trackAlert,
    latestMessage,
    messages: sorted.slice(0, 15) // Keep top 15 messages for log display
  };
}
