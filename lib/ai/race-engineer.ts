import { AICompileContext, ChatMessage } from "./types";
import { buildCuratedContextText } from "./context-builder";
import { buildSystemInstruction } from "./prompts";
import { sendGroqChatCompletion } from "./client";

/**
 * Main entry point for the Race Engineer logic.
 * Combines full race context, prompts, and message history into a Groq chat completion request.
 */
export async function invokeRaceEngineer(
  history: ChatMessage[],
  context: AICompileContext,
  stream = true
): Promise<Response> {
  // 1. Build compressed text context
  const curatedContextText = buildCuratedContextText(context);

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
