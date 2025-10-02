// Provider factory for Vercel AI SDK
// Set server envs in `.env.local` (do not commit):
// - OPENAI_API_KEY=...   // REQUIRED for OpenAI models
// - OPENAI_BASE_URL=...  // Optional: for OpenAI-compatible proxy
// - ANTHROPIC_API_KEY=... // For Claude models

import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";

export type ProviderName = "openai" | "anthropic";

export function getProvider(name: ProviderName = "openai") {
  switch (name) {
    case "openai": {
      const apiKey = process.env.OPENAI_API_KEY;
      const baseURL = process.env.OPENAI_BASE_URL;
      if (!apiKey) {
        throw new Error("Missing OPENAI_API_KEY. Add it to .env.local");
      }
      return createOpenAI({ apiKey, baseURL });
    }
    case "anthropic": {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        throw new Error("Missing ANTHROPIC_API_KEY. Add it to .env.local");
      }
      return createAnthropic({ apiKey });
    }
    default:
      throw new Error(`Unsupported provider: ${name}`);
  }
}
