import { AICompileContext, AISandboxContext, ChatMessage } from "./types";
import { buildCuratedContextText } from "./context-builder";
import { buildCuratedSandboxContextText } from "./sandbox-context";
import { buildSystemInstruction } from "./prompts";
import { sendGroqChatCompletion } from "./client";

function isSandboxContext(context: AICompileContext | AISandboxContext): context is AISandboxContext {
  return "isSandbox" in context && context.isSandbox === true;
}

/**
 * Main entry point for the Race Engineer logic.
 * Combines full race context, prompts, and message history into a Groq chat completion request.
 */
export async function invokeRaceEngineer(
  history: ChatMessage[],
  context: AICompileContext | AISandboxContext,
  stream = true
): Promise<Response> {
  // 1. Build compressed text context
  const curatedContextText = isSandboxContext(context)
    ? buildCuratedSandboxContextText(context.scenarioA, context.resultA, context.scenarioB, context.resultB)
    : buildCuratedContextText(context);

  // 2. Build final system instruction containing instructions + session context
  const systemInstructionText = buildSystemInstruction(curatedContextText);

  // 3. Assemble Groq payload messages
  const groqMessages = [
    { role: "system", content: systemInstructionText },
    ...history.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  // 4. Send request to Groq Cloud API
  return sendGroqChatCompletion({
    messages: groqMessages,
    stream,
    temperature: 0.3,
    max_tokens: 4096,
  });
}
