/**
 * Decodes a single SSE line from the Groq stream.
 * e.g., 'data: {"choices":[{"delta":{"content":"hello"}}]}' -> 'hello'
 */
export function parseSSELine(line: string): string | null {
  const cleanLine = line.trim();
  if (!cleanLine.startsWith("data:")) return null;

  const dataStr = cleanLine.slice(5).trim();
  if (dataStr === "[DONE]") return null;

  try {
    const parsed = JSON.parse(dataStr);
    const content = parsed.choices?.[0]?.delta?.content;
    return content || "";
  } catch {
    return null;
  }
}

/**
 * Standardizes or cleans response content (e.g. stripping prompt injection attempts or system instructions).
 */
export function sanitizeResponseText(text: string): string {
  // Strip any system prompt leak patterns
  let clean = text;
  clean = clean.replace(/SYSTEM_PROMPT/gi, "");
  clean = clean.replace(/CORE PERSONA & BEHAVIOR/gi, "");
  clean = clean.replace(/STRICT CRITICAL RULES/gi, "");
  return clean.trim();
}

/**
 * Strips out <think>...</think> reasoning blocks from the accumulated text.
 * Also handles unclosed <think> blocks while the model is still streaming thoughts.
 */
export function stripThinking(text: string): string {
  let clean = text.replace(/<think>[\s\S]*?<\/think>/g, "");
  // Remove any trailing unclosed think blocks
  clean = clean.replace(/<think>[\s\S]*$/g, "");
  return clean;
}
