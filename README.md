# A.P.E.X. — AI-Powered Formula 1 Race Intelligence

[![Tech Stack](https://img.shields.io/badge/Tech_Stack-Next.js_15_--_TS_--_Tailwind-black?style=flat&logo=nextdotjs&logoColor=white)](#tech-stack)
[![F1 Inspired](https://img.shields.io/badge/Inspired_By-Motorsport_Telemetry-FF1801?style=flat)](#brand-identity)
[![Dark Mode](https://img.shields.io/badge/Theme-Dark_Mode_Only-zinc-950?style=flat)](#design-system)
[![Status](https://img.shields.io/badge/Status-Phases_1--7_Complete-emerald-500?style=flat)](#roadmap)

**A.P.E.X.** (AI-Powered Race Intelligence) is a premium, desktop-first Formula 1 Mission Control and strategy simulation platform. Designed to replicate a real-world racing team's telemetry workstation, A.P.E.X. integrates live timing feeds, high-frequency telemetry charting, tire degradation models, weather intelligence forecasts, and a Groq-powered AI Race Engineer to help you simulate and analyze race strategies.

---

## 🏎️ Completed Features by Phase

### 1. Presentational Shell & Scaffolding (Phase 1)
* **Motorsport Design System**: Monospace typography (Outfit/Fira Code), high-contrast Formula 1 Racing Red accents (`#FF1801`), card widgets, and micro-animations.
* **Landing Page Workstation Mockup**: Recharts-powered throttle/brake/speed telemetry lines, static leaderboards, and interactive advisor advice cards.

### 2. Live Calendar & Standing Hubs (Phase 2)
* **TanStack Query F1 Service**: Integrates the Jolpica F1 API with global caching and error handling.
* **Podium Standings**: Renders driver standings with a custom gold, silver, and bronze podium component, mapping constructors' brand styling colors dynamically.
* **Constructor Roster**: Modern viewport mapping constructor points, victories, and team nationalities.

### 3. Dynamic Race Weekend Hub (Phase 3 & 4)
* **Circuit Database**: Profiles DRS zones, corners, records, and historic GP winners for all 24 calendar tracks.
* **Pre- & Post-Race Layouts**:
  * *Pre-Weekend*: Visualizes circuit profile data, practice/qualify timelines, and pre-race previews.
  * *Post-Weekend*: Renders final qualifying sheets, race classification tables, fastest lap records (e.g. lap number and timing), and podium summaries.
* **Session Intelligence Layer**: Calculates analytical performance metrics:
  * **Recovery Drive Score**: Weights grid-to-finish position changes against starting grid difficulty.
  * **Biggest Gainer/Loser**: Details net positions won/lost.
  * **Closest Battles**: Evaluates timing intervals to isolate the tightest finish margins.

### 4. OpenF1 Live Timing Command Center (Phase 5)
* **Real-time Telemetry Streams**: Fetches session states, timing boards, stints, pit stops, and race control alerts from `api.openf1.org`.
* **High-DensityTiming Board**: Shows real-time intervals, tyre ages, pit counts, and highlights the session's fastest lap in purple.
* **Stability Controls**:
  * **Pacing FIFO Queue**: Enforces a `150ms` delay between OpenF1 fetch requests to prevent API 429 rate limit errors.
  * **DNF Identification**: Automatically marks drivers as retired (DNF) and sorts them to the bottom if timing timestamps stall for over 10 minutes.

### 5. AI Race Engineer (Phase 6)
* **Groq Cloud Integration**: Establishes streaming strategy chat using Alibaba's `qwen/qwen3-32b` (Qwen 3 32B model) on Groq.
* **Streaming Sanitizer**: Automatically parses and filters out reasoning tags (`<think>...</think>`) from the chat interface in real-time.
* **Context Compiler**: Compresses timing gaps, tyre compounds, standings, and performance stats into LLM prompts.

### 6. Weather Intelligence Layer (Phase 6.5)
* **Open-Meteo Integration**: Maps F1 circuit coordinates to fetch real-time atmospheric, track, and rainfall forecast data.
* **Strategy Weather Context**: Interpolates forecast weather offsets (`current`, `+15m`, `+30m`, `+60m`) to let the simulator evaluate dry-wet transition boundaries and pitstop timing windows.

### 7. Interactive Strategy Sandbox (Phase 7)
* **Deterministic Simulator**: Evaluates undercut probabilities, tyre cliff degradation, stop windows, and Safety Car pit delta gains using mathematical models.
* **Exposed Explanation Payloads**: Standardizes all models to output numeric outputs alongside explanation arrays (`explanation: string[]`). The AI Race Engineer consumes these explanation payloads directly rather than reverse-engineering the score.
* **Side-by-Side Cockpit Comparison**: Toggles and compares Scenario A (e.g. Dry Stint) and Scenario B (e.g. Rain Stint) overlays contrasting risk, tyre health, and finishing positions.
* **Preset Persistence**: Supports naming, duplicating, resetting, and loading custom scenarios cached in `localStorage`.

---

## 🛠️ Tech Stack

* **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Node.js runtime)
* **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode compilation)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **State & Data**: [TanStack React Query v5](https://tanstack.com/query/latest) (5-minute stale timing rules)
* **Charts**: [Recharts](https://recharts.org/) (High-frequency telemetry overlays)
* **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Installation & Local Development

Follow these steps to run A.P.E.X. locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ShubhamKumar1703/A.P.E.X-.git
   cd A.P.E.X-
   ```

2. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   # Optional overrides:
   # GROQ_MODEL=qwen/qwen3-32b
   ```

3. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the workstation:**
   Open [http://localhost:3000](http://localhost:3000) in your browser. Navigating to `/dashboard/live` accesses live timing, and `/dashboard/sandbox` opens the strategy workbench.

---

## 🏁 Verification & Build Audits

* **Compilation**: `npx tsc --noEmit` returns zero compilation warnings or type conflicts.
* **Linting**: `npx next lint` returns zero warnings or style violations (`✔ No ESLint warnings or errors`).

---

## 📄 License

This project is licensed under the MIT License.
