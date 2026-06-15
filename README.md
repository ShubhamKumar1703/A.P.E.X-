# A.P.E.X. — AI-Powered Formula 1 Race Intelligence

[![Tech Stack](https://img.shields.io/badge/Tech_Stack-Next.js_15_--_TS_--_Tailwind-black?style=flat&logo=nextdotjs&logoColor=white)](#tech-stack)
[![F1 Inspired](https://img.shields.io/badge/Inspired_By-Motorsport_Telemetry-FF1801?style=flat)](#brand-identity)
[![Dark Mode](https://img.shields.io/badge/Theme-Dark_Mode_Only-zinc-950?style=flat)](#design-system)

**A.P.E.X.** (AI-Powered Race Intelligence) is a premium, desktop-first Formula 1 Mission Control platform. Built to feel like a real-world racing team's strategy hub, it integrates live timing data, telemetry visualization, tire compound age tracking, and AI-powered race engineering to act as your digital race engineer.

---

## 🏎️ Project Overview

A.P.E.X. is designed to deliver a high-readability telemetry and strategy center for motorsport analysts. Rather than a generic SaaS layout, the interface features a dense, data-rich HUD reminiscent of team telemetry terminals, blending glassmorphism, animated grids, and high-contrast Formula 1 Racing Red accents.

### Visual Preview
*Placeholder: High-resolution screenshots of the Mission Control interface and Landing Page hero workstation mockup will be added here.*

---

## ✨ Features

- **Mission Control Workstation Mockup**: High-fidelity landing page preview showcasing real-time leaderboards, throttle/brake telemetry curves, and strategy status gauges.
- **2026 Season Mock Data**: Initial static dataset detailing rounds, locations, circuit lengths, and dates for the 2026 championship.
- **Motorsport Design System**: Structured color, typography, spacing, and button variants defined in `lib/design-system.ts`.
- **Responsive Terminal Design**: Clean layout that adapts dynamically to mobile, tablet, and widescreen layouts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: Inspired by Shadcn/UI and built with [Lucide React](https://lucide.dev/) icons
- **State & Data**: [TanStack Query](https://tanstack.com/query/latest)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Installation & Local Development

Follow these steps to run A.P.E.X. locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/apex-race-intelligence.git
   cd apex-race-intelligence
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🗺️ Roadmap

- **Phase 1**: Landing Page & App Shell (Complete)
- **Phase 2**: 2026 Race Calendar
- **Phase 3**: Driver & Constructor Standings
- **Phase 4**: Race Weekend Hub
- **Phase 5**: OpenF1 Live Timing Integration
- **Phase 6**: AI Race Engineer Chat (Groq / Qwen 32B)
- **Phase 7**: Tyre Strategy Wear & Weather Forecasting Engines

---

## 🔮 Future Enhancements

- **OpenF1 Telemetry**: Live chart integration of speed, engine RPM, throttle application, and braking force.
- **Jolpica Historical Standings**: Explore championship histories and career stat head-to-heads.
- **Groq-Powered Race Engineer**: Chat with an AI assistant that suggests pit stops and flags strategy errors during active sessions.

---

## 📄 License

This project is licensed under the MIT License.
