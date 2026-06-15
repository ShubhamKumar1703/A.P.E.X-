"use client";

import React from "react";
import { ScenarioState, SimulationResult } from "@/lib/sandbox/types";
import { ChatMessage as ChatMessageType } from "@/lib/ai/types";
import { ChatMessage } from "../ai/ChatMessage";
import { TypingIndicator } from "../ai/TypingIndicator";
import { MessageInput } from "../ai/MessageInput";
import { Trash2, ShieldAlert, MessageSquareCode } from "lucide-react";
import { stripThinking } from "@/lib/ai/response-parser";

interface SandboxChatWindowProps {
  scenarioA: ScenarioState;
  resultA: SimulationResult;
  scenarioB?: ScenarioState | null;
  resultB?: SimulationResult | null;
}

const SANDBOX_PROMPTS = [
  "Why is Scenario A projected to finish where it is?",
  "Compare the tyre life and pace loss between Scenario A and B.",
  "How does the track evolution or temperature impact these setups?",
  "What strategy is better if a late Safety Car occurs?"
];

export function SandboxChatWindow({
  scenarioA,
  resultA,
  scenarioB,
  resultB
}: SandboxChatWindowProps) {
  const [messages, setMessages] = React.useState<ChatMessageType[]>([]);
  const [input, setInput] = React.useState("");
  const [isStreaming, setIsStreaming] = React.useState(false);
  const messageFeedRef = React.useRef<HTMLDivElement>(null);

  // Reset chat when the active scenarios change to ensure fresh context or fresh start if needed,
  // but let's just initialize the welcome message once.
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome-sandbox",
          role: "assistant",
          content: `Strategy Sandbox AI Channel Established.

I have ingested your custom scenarios:
- **Scenario A**: "${scenarioA.name}" (Driver #${scenarioA.driverNumber}, Target Pit Lap ${scenarioA.targetPitLap})
${scenarioB ? `- **Scenario B**: "${scenarioB.name}" (Driver #${scenarioB.driverNumber}, Target Pit Lap ${scenarioB.targetPitLap})` : ""}

Ask me to analyze these configurations, compare stint degradation rates, or suggest adjustments for undercuts and safety car opportunities.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        }
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, scenarioA.name, scenarioB?.name]);

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
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          context: {
            isSandbox: true,
            scenarioA,
            resultA,
            scenarioB,
            resultB
          }
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || errJson.message || "Sandbox strategy channel offline.");
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
          content: `⚠️ **SIGNAL LOSS // SANDBOX COCKPIT ERROR**: ${errMsg}`,
          timestamp: assistantTime
        }
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Confirm reset of sandbox chat history?")) {
      setMessages([
        {
          id: "welcome-reset",
          role: "assistant",
          content: "Strategy sandbox channel refreshed. Ready for strategy comparisons.",
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
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-[10px] font-black text-zinc-400 tracking-wider uppercase">
            SANDBOX RACE ENGINEER
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
          !messages.some((m) => m.role === "assistant" && m.id !== "welcome-sandbox" && m.id !== "welcome-reset" && messages[messages.length - 1]?.id === m.id) && (
            <TypingIndicator />
          )
        )}
      </div>

      {/* Suggested prompts and message input */}
      <div className="p-4 bg-zinc-950/30 border-t border-zinc-900 space-y-4 shrink-0">
        {messages.length <= 2 && !isStreaming && (
          <div className="space-y-2.5 font-mono">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 px-1">
              <MessageSquareCode size={12} className="text-zinc-655" />
              Suggested Sandbox Enquiries:
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {SANDBOX_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  className="flex text-left items-center justify-between p-2.5 rounded-lg border border-zinc-900 bg-zinc-950/60 hover:bg-[#FF1801]/5 hover:border-[#FF1801]/20 text-[10px] text-zinc-450 hover:text-white transition-all duration-200 group focus:outline-none cursor-pointer"
                >
                  <span className="truncate pr-2">{prompt}</span>
                  <span className="text-zinc-700 group-hover:text-[#FF1801] shrink-0 font-bold font-mono transition-colors">&rarr;</span>
                </button>
              ))}
            </div>
          </div>
        )}
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={() => handleSendMessage(input)}
          disabled={isStreaming}
        />
        <div className="flex items-center gap-1.5 text-[8px] text-zinc-600 font-bold select-none justify-center">
          <ShieldAlert size={10} className="text-zinc-750" />
          <span>A.P.E.X. STRATEGY ASSISTANT MODULE</span>
        </div>
      </div>
    </div>
  );
}
export default SandboxChatWindow;
