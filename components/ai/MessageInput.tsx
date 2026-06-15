import React from "react";
import { Send, CornerDownLeft } from "lucide-react";

interface MessageInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export function MessageInput({ value, onChange, onSubmit, disabled }: MessageInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="relative border border-zinc-850 rounded-xl bg-zinc-950 p-2 flex items-end gap-2 focus-within:border-[#FF1801]/30 transition-all font-mono">
      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Strategy Engineer is formulating advice..." : "Ask about race delta, tyre degradation, undercut potential..."}
          disabled={disabled}
          className="w-full bg-transparent border-0 text-xs text-zinc-100 placeholder-zinc-550 focus:outline-none resize-none max-h-[120px] p-2 leading-relaxed"
          style={{ scrollbarWidth: "thin" }}
        />
      </div>
      
      <div className="flex items-center gap-2 shrink-0 pr-1 pb-1">
        {/* Keyboard shortcut hint */}
        <span className="hidden sm:flex items-center gap-0.5 text-[8px] text-zinc-600 font-bold uppercase tracking-wider select-none">
          <span>press enter</span>
          <CornerDownLeft size={8} />
        </span>

        <button
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
            value.trim() && !disabled
              ? "bg-[#FF1801] text-white hover:opacity-90 shadow-md shadow-[#FF1801]/10 cursor-pointer"
              : "bg-zinc-900 text-zinc-650 cursor-not-allowed"
          }`}
        >
          <Send size={12} className={value.trim() && !disabled ? "translate-x-[0.5px] -translate-y-[0.5px]" : ""} />
        </button>
      </div>
    </div>
  );
}
export default MessageInput;
