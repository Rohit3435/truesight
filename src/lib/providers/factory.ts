import type { TextModelProvider } from "./types.ts";
import { ProviderUnavailableError } from "./types.ts";
import { GeminiProvider } from "./gemini.ts";
import { GroqProvider } from "./groq.ts";
import { OllamaProvider } from "./ollama.ts";

/** Provider changes are explicit: no automatic data rerouting between vendors. */
export function createModelProvider(environment: NodeJS.ProcessEnv = process.env): TextModelProvider {
  switch (environment.AI_PROVIDER?.trim().toLowerCase() || "gemini") {
    case "gemini":
      return new GeminiProvider({ apiKey: environment.GEMINI_API_KEY, model: environment.GEMINI_MODEL });
    case "groq":
      return new GroqProvider({ apiKey: environment.GROQ_API_KEY, model: environment.GROQ_MODEL });
    case "ollama":
      return new OllamaProvider({ baseUrl: environment.OLLAMA_BASE_URL, model: environment.OLLAMA_MODEL });
    default:
      throw new ProviderUnavailableError("AI_PROVIDER must be gemini, groq, or ollama.");
  }
}
