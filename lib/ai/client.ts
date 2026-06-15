export function getGroqApiKey(): string {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY environment variable is not configured on the server.");
  }
  return apiKey;
}

export function getGroqModel(): string {
  return process.env.GROQ_MODEL || "qwen/qwen3-32b";
}

interface GroqChatCompletionOptions {
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

/**
 * Initiates a chat completion request to the Groq API.
 * If stream is true, returns the raw Response for the stream handler to consume.
 */
export async function sendGroqChatCompletion(
  options: GroqChatCompletionOptions
): Promise<Response> {
  const apiKey = getGroqApiKey();
  const model = getGroqModel();

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
    },
    body: JSON.stringify({
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.max_tokens ?? 1024,
      stream: options.stream ?? false,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "Unknown error");
    throw new Error(`Groq API request failed with status ${response.status}: ${errorBody}`);
  }

  return response;
}
