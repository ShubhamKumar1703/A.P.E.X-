# A.P.E.X. — Development Roadmap

This roadmap documents the implementation milestones for the A.P.E.X. digital race engineering platform.

---

## Roadmap Phases

### [x] Phase 1: Landing Page & App Shell (Current)
- Initialize Next.js 15, Tailwind, and TypeScript project.
- Establish F1 motorsport visual design system (`lib/design-system.ts`).
- Build responsive high-fidelity landing page with a mock race control workstation telemetry preview.
- Set up directory structure and component stubs.

### [ ] Phase 2: Race Calendar
- Display the mock 2026 season schedule.
- Detail race metadata, track lengths, circuit configurations, and lap counts.
- Add local and track time conversions.

### [ ] Phase 3: Standings
- Add current season Driver Standings and Constructor Standings.
- Visual team card accents reflecting constructors' official brand colors.
- Interactive grid view with filterable histories.

### [ ] Phase 4: Race Weekend Hub
- Detailed view for individual Grand Prix rounds.
- Sessions overview (FP1, FP2, FP3, Qualifying, Sprint, Main Race).
- Historical race winner comparisons.

### [ ] Phase 5: Live Timing Center
- Integrate with OpenF1 API.
- Render dynamic timing tower leaderboard.
- Real-time pit stop trackers and tire compound duration logs.

### [ ] Phase 6: AI Race Engineer
- Integrate Groq API (Qwen 3 32B model).
- Render natural language commentary on race status.
- Build interactive "Ask the Engineer" chat interface with telemetry context injection.

### [ ] Phase 7: Advanced Strategy Analytics
- Pit stop duration histogram.
- Weather precipitation probability versus tyre wear wear modeling.
- Driver comparison head-to-head performance graphs.
