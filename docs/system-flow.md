# A.P.E.X. System Flow & Pipeline Architecture

This document details the telemetry processing, strategy simulation, and AI context serialization pipelines within the A.P.E.X. Mission Control workstation.

---

## 🌀 1. Telemetry & Data Collection Pipeline

Data is collected in real-time from three distinct providers:
1. **OpenF1 API**: Serves high-frequency telemetry samples, timing boards, tyres stints, laps, and race control alert streams.
2. **Jolpica F1 API**: Provides seasonal stats, standings, and historical weekend details.
3. **Open-Meteo API**: Feeds weather readings using coordinate lookups for the target circuit.

```
[OpenF1 API] ------> [FIFO Pacing Queue] ------> [Driver State Aggregator]
[Jolpica API] ---------------------------------> [Standings & Stats Services]
[Open-Meteo] -------> [Interpolation Engine] ---> [Weather Pipeline]
```

### Rate-Limiting & Pacing Guard
To prevent API `429 Too Many Requests` errors from concurrent component mounting, the base OpenF1 fetcher uses a **FIFO Promise Queue** (`lib/services/openf1/client.ts`) that enforces a strict `150ms` delay between consecutive requests.

---

## 🧮 2. Aggregation & Analytics Layer

Raw streams are compiled into structured domains:
* **Driver State Aggregator**: Merges driver profiles, tyre compounds, stint lap age, and intervals into unified state vectors.
* **DNF & Retirement Classifier**: Stalls timing boards and marks retired drivers if their active timing timestamps freeze for over 10 minutes, sorting them to the bottom.
* **Analytics Engine**: Computes comparative metrics, closest finishing battles, and recovery drive scores (grid position vs. finish difficulty weights).
* **Weather Interpolation Pipeline**: Linearly interpolates hourly forecast metrics into high-resolution strategy slots (+15m, +30m, +60m).

---

## 🔬 3. Strategy Sandbox Simulation Engine

The **Strategy Sandbox** runs deterministic calculations for two comparative setups (Scenario A vs. Scenario B).

```
   [Scenario State]
          │
          ▼
┌───────────────────┐
│  Simulator Entry  │
└─────────┬─────────┘
          │
          ├──> [Tyre Degradation Model] ──────> Quadratic wear curves
          ├──> [Pit Window Model] ────────────> Optimal lap brackets
          ├──> [Undercut Model] ──────────────> Outlap outpace delta
          ├──> [Weather Model] ───────────────> Wet/Dry crossovers
          └──> [Safety Car Model] ────────────> SC/VSC free-stop savings
          │
          ▼
┌───────────────────┐
│ Consolidated      │ ──────> Numeric Results + Explanation Payloads
│ Race Forecast     │         (e.g., explanation: string[])
└───────────────────┘
```

---

## 🤖 4. AI context Builder & Groq LLM streaming

To connect the deterministic sandbox results to the conversational chatbot:
1. **Serialization**: The `AIContextBuilder` converts scenario variables, comparative stats, and **explanation payloads** (`explanation: string[]`) into a compressed prompt text block.
2. **SSE Streaming Route**: The `/api/engineer` API routes the prompt to Groq Cloud using Alibaba's `qwen/qwen3-32b` (Qwen 3 32B model).
3. **Thinking Filter**: The server-sent events (SSE) parser automatically regex-filters out reasoning `<think>` tags on-the-fly, serving clean text directly to the UI.
