import React from "react";
import { ChatMessage as ChatMessageType } from "@/lib/ai/types";
import { Cpu, User } from "lucide-react";

interface ChatMessageProps {
  message: ChatMessageType;
}

/**
 * A custom simple renderer to format markdown bold, lists, and tables in the F1 terminal layout.
 */
function FormatF1Message({ content }: { content: string }) {
  // Split content by lines to process lists and tables
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const renderTextFormatting = (text: string) => {
    // Replace **bold** with strong elements
    // Replace `code` with styled span elements
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={idx} className="text-[#FF1801] font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <span key={idx} className="bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[10px] px-1 py-0.5 rounded">
            {part.slice(1, -1)}
          </span>
        );
      }
      return part;
    });
  };

  const flushList = (key: number) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${key}`} className="list-disc pl-5 my-2 space-y-1 text-xs text-zinc-300 font-mono">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  const flushTable = (key: number) => {
    if (tableRows.length > 0) {
      // Check if second row is separator (e.g. |---|)
      const hasHeader = tableRows.length > 1 && tableRows[1].every(cell => cell.trim().startsWith("-") || cell.trim() === "");
      const finalRows = hasHeader ? [tableRows[0], ...tableRows.slice(2)] : tableRows;
      
      elements.push(
        <div key={`table-${key}`} className="my-3 overflow-x-auto border border-zinc-800 rounded-lg bg-zinc-950/60 max-w-full">
          <table className="w-full text-left border-collapse font-mono text-[10px] leading-relaxed">
            <thead>
              {hasHeader && (
                <tr className="border-b border-zinc-800 bg-zinc-900/40">
                  {tableRows[0].map((cell, idx) => (
                    <th key={idx} className="px-3 py-2 text-[#FF1801] font-bold uppercase tracking-wider">
                      {cell.trim()}
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {finalRows.map((row, rIdx) => {
                if (hasHeader && rIdx === 0) return null; // Already rendered in head
                return (
                  <tr key={rIdx} className="border-b border-zinc-900 hover:bg-zinc-900/20 last:border-0">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-3 py-2 text-zinc-300 border-r border-zinc-900/40 last:border-r-0">
                        {renderTextFormatting(cell.trim())}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Check if table row
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList(idx);
      inTable = true;
      const cells = trimmed.split("|").slice(1, -1);
      tableRows.push(cells);
      return;
    } else if (inTable) {
      flushTable(idx);
    }

    // Check if list item
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      currentList.push(
        <li key={`li-${idx}`} className="leading-relaxed">
          {renderTextFormatting(trimmed.slice(2))}
        </li>
      );
      return;
    } else {
      flushList(idx);
    }

    // Regular line
    if (trimmed === "") {
      elements.push(<div key={`space-${idx}`} className="h-2" />);
    } else {
      elements.push(
        <p key={`p-${idx}`} className="text-xs text-zinc-300 font-mono leading-relaxed my-1">
          {renderTextFormatting(line)}
        </p>
      );
    }
  });

  // Flush remaining table or lists
  flushList(lines.length);
  flushTable(lines.length);

  return <div className="space-y-1">{elements}</div>;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isEngineer = message.role === "assistant";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex items-center justify-center p-2 bg-zinc-900/20 border border-zinc-900/60 rounded-lg my-2 font-mono text-[10px] text-zinc-500">
        <span>[SYSTEM] {message.content}</span>
      </div>
    );
  }

  return (
    <div
      className={`flex gap-3.5 p-4 rounded-xl border transition-all ${
        isEngineer
          ? "bg-[#FF1801]/5 border-[#FF1801]/10 text-zinc-100"
          : "bg-zinc-900/20 border-zinc-800/40 text-zinc-200"
      }`}
    >
      {/* Icon Badge */}
      <div
        className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center border font-mono text-xs ${
          isEngineer
            ? "bg-[#FF1801] border-[#FF1801]/30 text-white shadow-md shadow-[#FF1801]/10"
            : "bg-zinc-900 border-zinc-800 text-zinc-400"
        }`}
      >
        {isEngineer ? <Cpu size={14} /> : <User size={14} />}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center justify-between font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-wider">
          <span className={isEngineer ? "text-[#FF1801]" : "text-zinc-400"}>
            {isEngineer ? "STRATEGY ENGINEER // QWEN 32B" : "RACE CONTROLLER // USER"}
          </span>
          <span>{message.timestamp}</span>
        </div>
        <div className="pt-0.5">
          <FormatF1Message content={message.content} />
        </div>
      </div>
    </div>
  );
}
