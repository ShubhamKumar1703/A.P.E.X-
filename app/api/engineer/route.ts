import { NextRequest } from "next/server";
import { invokeRaceEngineer } from "@/lib/ai/race-engineer";
import { parseSSELine } from "@/lib/ai/response-parser";

// Set runtime to nodejs
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { messages, context } = body;

    if (!messages || !Array.isArray(messages) || !context) {
      return new Response(
        JSON.stringify({ error: "Invalid request payload. Ensure 'messages' array and 'context' object are provided." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Call orchestration layer to connect to Groq Cloud with stream=true
    let groqResponse: Response;
    try {
      groqResponse = await invokeRaceEngineer(messages, context, true);
    } catch (err) {
      console.error("Failed to connect to Groq:", err);
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      return new Response(
        JSON.stringify({ error: `Groq Service Unavailable: ${errMsg}` }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const reader = groqResponse.body?.getReader();
    if (!reader) {
      return new Response(
        JSON.stringify({ error: "Failed to read stream body from Groq API" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder("utf-8");

    // Construct a ReadableStream that processes SSE frames into plain text
    const customStream = new ReadableStream({
      async start(controller) {
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            // Decode chunk and append to buffer
            buffer += decoder.decode(value, { stream: true });
            
            // Split by lines
            const lines = buffer.split("\n");
            
            // The last line might be incomplete, save it back to buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              const textContent = parseSSELine(line);
              if (textContent !== null) {
                controller.enqueue(encoder.encode(textContent));
              }
            }
          }

          // Process anything remaining in the buffer
          if (buffer) {
            const textContent = parseSSELine(buffer);
            if (textContent !== null) {
              controller.enqueue(encoder.encode(textContent));
            }
          }
        } catch (streamErr) {
          console.error("Stream reading error:", streamErr);
          controller.error(streamErr);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Unhandled API route error in /api/engineer:", error);
    const errorMsg = error instanceof Error ? error.message : "Internal Server Error";
    return new Response(
      JSON.stringify({ error: "Internal Server Error", message: errorMsg }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
