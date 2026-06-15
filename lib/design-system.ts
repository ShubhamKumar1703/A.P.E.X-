/**
 * A.P.E.X. Design System Tokens
 * Defines the visual styling variables and utility classes for the Formula 1 Analytics Platform.
 */

export const tokens = {
  // Brand Colors (Dark Mode Only)
  colors: {
    background: "bg-zinc-950",
    backgroundHex: "#09090b", // zinc-950
    surface: "bg-zinc-900",
    surfaceHex: "#18181b", // zinc-900
    border: "border-zinc-800",
    borderHex: "#27272a", // zinc-800
    primary: "#FF1801", // Racing Red
    primaryMuted: "rgba(255, 24, 1, 0.15)",
    text: "text-zinc-100",
    textMuted: "text-zinc-400",
    accent: "text-[#FF1801]"
  },

  // Typography tokens
  typography: {
    h1: "text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none",
    h2: "text-2xl md:text-3xl font-bold tracking-tight",
    h3: "text-lg md:text-xl font-semibold tracking-tight",
    h4: "text-sm md:text-base font-medium uppercase tracking-widest text-[#FF1801]",
    body: "text-sm md:text-base text-zinc-400 leading-relaxed",
    mono: "font-mono text-xs tracking-tight",
    stat: "font-mono text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight"
  },

  // Spacing and Layout
  spacing: {
    section: "py-16 md:py-24 lg:py-32",
    container: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
    grid: "grid gap-6 md:gap-8",
    flexCenter: "flex items-center justify-center"
  },

  // Card Styles (Premium Motorsport Aesthetics)
  card: {
    base: "relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md transition-all duration-300 hover:border-zinc-700/80",
    hover: "hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF1801]/5",
    glow: "absolute -inset-px rounded-xl bg-gradient-to-r from-[#FF1801]/20 to-orange-500/10 opacity-0 blur transition-all duration-500 group-hover:opacity-100",
    f1Terminal: "bg-zinc-950 border border-zinc-800 font-mono text-xs rounded-md shadow-2xl relative"
  },

  // Button Variants
  button: {
    primary: "relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-[#FF1801] rounded-lg transition-all duration-200 hover:bg-[#E01500] hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#FF1801]/10 focus:outline-none focus:ring-2 focus:ring-[#FF1801] focus:ring-offset-2 focus:ring-offset-zinc-950",
    secondary: "inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg transition-all duration-200 hover:bg-zinc-800 hover:text-white hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:ring-offset-2 focus:ring-offset-zinc-950",
    outline: "inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-zinc-400 bg-transparent border border-zinc-800 rounded-md transition-all duration-150 hover:border-zinc-700 hover:text-zinc-200",
    ghost: "inline-flex items-center justify-center px-4 py-2 text-xs font-medium text-zinc-400 bg-transparent rounded-md transition-all duration-150 hover:bg-zinc-900 hover:text-zinc-200"
  }
};
