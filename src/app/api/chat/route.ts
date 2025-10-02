import { NextRequest } from "next/server";
import { streamText } from "ai";
import { getProvider } from "@/lib/ai/provider";
import { Mem0Client } from "@/lib/memory/mem0";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { messages, config } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
      config?: { model?: string; provider?: string };
    };

    // Use OpenAI by default, but allow switching
    const providerName = (config?.provider as "openai" | "anthropic") || "openai";
    const provider = getProvider(providerName);
    
    // Model selection based on provider
    const model = providerName === "anthropic" 
      ? provider("claude-3-5-sonnet-20241022") // Latest Claude
      : provider(config?.model || "gpt-4o-mini");

    // Basic long-context handling: trim oldest messages if too long
    const MAX_MESSAGES = 50;
    const trimmed = messages.slice(-MAX_MESSAGES);

    // Hook into Mem0 (no-op if key not set)
    const mem0 = new Mem0Client();
    const userText = trimmed
      .filter((m) => m.role === "user")
      .map((m) => m.content)
      .join("\n\n");
    if (userText) {
      // NOTE: Provide a real user/session id from auth when available
      await mem0.addMemory("anonymous", userText);
    }

    const result = await streamText({
      model,
      messages: trimmed,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" }), 
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
}