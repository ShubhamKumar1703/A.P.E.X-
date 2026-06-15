import React from "react";
import { MessageSquareCode } from "lucide-react";

interface PromptSuggestionsProps {
  onSelect: (prompt: string) => void;
}

const SUGGESTED_PROMPTS = [
  "Why is Norris losing time?",
  "Who has the strongest tyre life?",
  "Can Verstappen undercut Piastri?",
  "Which drivers are at risk of a pit stop?",
  "Who is likely to benefit from a Safety Car?",
  "Explain the current strategy battle.",
  "Summarize this race in plain English.",
  "Why did Ferrari pit early?"
];

export function PromptSuggestions({ onSelect }: PromptSuggestionsProps) {
  return (
    <div className="space-y-2.5 font-mono">
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
        <MessageSquareCode size={12} className="text-zinc-600" />
        Suggested Strategy Enquiries:
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTED_PROMPTS.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(prompt)}
            className="flex text-left items-center justify-between p-3 rounded-lg border border-zinc-800/80 bg-zinc-950/40 hover:bg-[#FF1801]/5 hover:border-[#FF1801]/20 text-[11px] text-zinc-400 hover:text-white transition-all duration-200 group focus:outline-none focus:border-[#FF1801]/30"
          >
            <span className="truncate pr-2">{prompt}</span>
            <span className="text-zinc-700 group-hover:text-[#FF1801] shrink-0 font-bold font-mono transition-colors">&rarr;</span>
          </button>
        ))}
      </div>
    </div>
  );
}
export default PromptSuggestions;
