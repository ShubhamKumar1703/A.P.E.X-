"use client";

import React from "react";
import { ChatMessage as ChatMessageType, CompactSessionContext, CompactDriverContext, CompactAnalyticsContext } from "@/lib/ai/types";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { PromptSuggestions } from "./PromptSuggestions";
import { MessageInput } from "./MessageInput";
import { Trash2, ShieldAlert } from "lucide-react";
import { stripThinking } from "@/lib/ai/response-parser";

interface ChatWindowProps {
  sessionContext: CompactSessionContext;
  driversContext: CompactDriverContext[];
  analyticsContext: CompactAnalyticsContext;
  standingsSummary?: string;
}

export function ChatWindow({
  sessionContext,
  driversContext,
  analyticsContext,
  standingsSummary
}: ChatWindowProps) {
  const [messages, setMessages] = React.useState<ChatMessageType[]>([]);
  const [input, setInput] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const messageFeedRef = React.useRef<HTMLDivElement>(null);

  // Initialize with a welcome message from the Strategy Engineer
  React.useEffect(() => {
    // Check if we already have messages loaded (client-side persistence in state)
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: `Pit Wall Strategy Link Established. 

I am your Strategy Engineer, monitoring the telemetry and timing streams. I have ingested the track telemetry, tyre stint metrics, and championship standings.

Ask me any strategic question, or select one of the suggested prompts below to initiate timing calculations.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        }
      ]);
    }
  }, [messages.length]);

  // Smooth scroll to bottom on new messages
  React.useEffect(() => {
    if (messageFeedRef.current) {
      messageFeedRef.current.scrollTo({
        top: messageFeedRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isStreaming) return;

    const userTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const userMsg: ChatMessageType = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: userTime
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsStreaming(true);

    const assistantId = (Date.now() + 1).toString();

    try {
      const response = await fetch("/api/engineer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Filter out the welcome message so we don't spam context if we want to save token,
          // but sending full local history is fine for client flow
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          context: {
            session: sessionContext,
            drivers: driversContext,
            analytics: analyticsContext,
            standingsSummary
          }
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || "Telemetry feed offline.");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Telemetry response stream could not be opened.");
      }

      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const textChunk = decoder.decode(value, { stream: true });
        accumulatedText += textChunk;

        setMessages((prev) => {
          const list = [...prev];
          const existingIdx = list.findIndex((m) => m.id === assistantId);
          const assistantTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
          
          const updatedMsg: ChatMessageType = {
            id: assistantId,
            role: "assistant",
            content: stripThinking(accumulatedText),
            timestamp: assistantTime
          };

          if (existingIdx !== -1) {
            list[existingIdx] = updatedMsg;
          } else {
            list.push(updatedMsg);
          }
          return list;
        });
      }
    } catch (err) {
      console.error("Failed to stream engineer response:", err);
      const assistantTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
      const errMsg = err instanceof Error ? err.message : "Failed to contact Groq API. Please verify GROQ_API_KEY is configured in .env.";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `⚠️ **SIGNAL LOSS // PIT WALL ERROR**: ${errMsg}`,
          timestamp: assistantTime
        }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Confirm reset of strategy session log? All current session chat history will be cleared.")) {
      setMessages([
        {
          id: "welcome-reset",
          role: "assistant",
          content: "Strategy terminal connection refreshed. Channel is open for timing queries.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        }
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full border border-zinc-900 rounded-xl bg-zinc-950/20 overflow-hidden font-mono">
      {/* Top Header Controls */}
      <div className="px-4 py-3 bg-zinc-950/40 border-b border-zinc-900 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-400 tracking-wider uppercase">
            ACTIVE ENGINEER CHANNEL
          </span>
        </div>
        <button
          onClick={handleClearHistory}
          title="Clear Chat History"
          className="text-zinc-500 hover:text-[#FF1801] p-1 rounded hover:bg-zinc-900/40 transition-all cursor-pointer"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Message Feed Area */}
      <div 
        ref={messageFeedRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[350px] custom-scrollbar"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isStreaming && (
          // Only show typing indicator if the assistant message is not yet added in the list
          !messages.some((m) => m.role === "assistant" && m.id !== "welcome" && m.id !== "welcome-reset" && messages[messages.length - 1]?.id !== m.id) && (
            <TypingIndicator />
          )
        )}
      </div>

      {/* Suggested prompts and message input */}
      <div className="p-4 bg-zinc-950/30 border-t border-zinc-900 space-y-4 shrink-0">
        {messages.length <= 2 && !isStreaming && (
          <PromptSuggestions onSelect={handleSendMessage} />
        )}
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={() => handleSendMessage(input)}
          disabled={isStreaming}
        />
        <div className="flex items-center gap-1.5 text-[8px] text-zinc-600 font-bold select-none justify-center">
          <ShieldAlert size={10} className="text-zinc-700" />
          <span>A.P.E.X. SECURE CHANNEL &mdash; DATA DECRYPTED REAL-TIME FROM OPENF1 & ERGAST</span>
        </div>
      </div>
    </div>
  );
}
export default ChatWindow;
