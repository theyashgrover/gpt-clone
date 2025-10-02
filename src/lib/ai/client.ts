// Client-side wrapper for AI provider selection and streaming helpers.
// TODO: Provide API keys via environment variables in `.env.local`.
// - OpenAI-compatible base URL/key: NEXT_PUBLIC_AI_BASE_URL, NEXT_PUBLIC_AI_API_KEY (avoid exposing secret keys; prefer server routes)
// - Alternatively, use provider-specific keys on the server (recommended).

export type Provider = "openai" | "anthropic" | "groq" | "custom";

export type AIConfig = {
  provider: Provider;
  model: string;
  apiBase?: string;
};

export const defaultAIConfig: AIConfig = {
  provider: "openai",
  model: "gpt-4o-mini",
  // apiBase can be set to an OpenAI-compatible endpoint if needed
};

export async function streamChat(
  body: {
    messages: Array<{ role: string; content: string }>;
    config?: Partial<AIConfig>;
  },
): Promise<Response> {
  return fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}


