import type { StructuredGenerationRequest, TextModelProvider } from "./types.ts";
import { ProviderRequestError, ProviderUnavailableError } from "./types.ts";

interface ProviderOptions {
  apiKey?: string;
  model?: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}

/** Optional text-only provider. It is selected explicitly and never failover-invoked silently. */
export class GroqProvider implements TextModelProvider {
  readonly providerName = "groq";
  readonly modelName: string;
  private readonly apiKey?: string;
  private readonly fetcher: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: ProviderOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.GROQ_API_KEY;
    this.modelName = options.model ?? process.env.GROQ_MODEL ?? "";
    this.fetcher = options.fetcher ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 30_000;
  }

  async generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<T> {
    if (!this.apiKey || !this.modelName) {
      throw new ProviderUnavailableError("Groq requires server-side GROQ_API_KEY and GROQ_MODEL configuration.");
    }
    if (request.images?.length) {
      throw new ProviderUnavailableError("The configured Groq adapter supports text only.");
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetcher("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { authorization: `Bearer ${this.apiKey}`, "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.modelName,
          temperature: 0.1,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: request.systemInstruction },
            { role: "user", content: request.userInput },
          ],
        }),
      });
      if (!response.ok) throw new ProviderRequestError(`Groq request failed with HTTP ${response.status}.`);
      const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const text = payload.choices?.[0]?.message?.content;
      if (!text) throw new ProviderRequestError("Groq returned no structured content.");
      return parseAndValidate(text, request);
    } catch (error) {
      if (error instanceof ProviderRequestError || error instanceof ProviderUnavailableError) throw error;
      if (controller.signal.aborted) throw new ProviderRequestError("Groq request timed out.");
      throw new ProviderRequestError("Groq request could not be completed.");
    } finally {
      clearTimeout(timeout);
    }
  }
}

function parseAndValidate<T>(text: string, request: StructuredGenerationRequest<T>): T {
  let output: unknown;
  try { output = JSON.parse(text); } catch { throw new ProviderRequestError("Groq returned invalid JSON."); }
  try { return request.validate(output); } catch { throw new ProviderRequestError("Groq output did not match the required response schema."); }
}
