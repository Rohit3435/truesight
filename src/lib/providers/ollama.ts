import type { StructuredGenerationRequest, TextModelProvider } from "./types.ts";
import { ProviderRequestError, ProviderUnavailableError } from "./types.ts";

interface OllamaOptions {
  baseUrl?: string;
  model?: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}

/** Optional local-only text provider. Remote Ollama hosts are deliberately rejected. */
export class OllamaProvider implements TextModelProvider {
  readonly providerName = "ollama";
  readonly modelName: string;
  private readonly baseUrl: string;
  private readonly fetcher: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: OllamaOptions = {}) {
    this.baseUrl = options.baseUrl ?? process.env.OLLAMA_BASE_URL ?? "http://127.0.0.1:11434";
    this.modelName = options.model ?? process.env.OLLAMA_MODEL ?? "";
    this.fetcher = options.fetcher ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 60_000;
    validateLocalUrl(this.baseUrl);
  }

  isConfigured(): boolean {
    return Boolean(this.modelName);
  }

  async generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<T> {
    if (!this.modelName) throw new ProviderUnavailableError("Ollama requires OLLAMA_MODEL and a locally installed model.");
    if (request.images?.length) throw new ProviderUnavailableError("This Ollama adapter supports text only.");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetcher(`${this.baseUrl.replace(/\/$/, "")}/api/chat`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.modelName,
          stream: false,
          format: "json",
          messages: [
            { role: "system", content: request.systemInstruction },
            { role: "user", content: request.userInput },
          ],
          options: { temperature: 0.1 },
        }),
      });
      if (!response.ok) throw new ProviderRequestError(`Ollama request failed with HTTP ${response.status}.`);
      const payload = await response.json() as { message?: { content?: string } };
      const text = payload.message?.content;
      if (!text) throw new ProviderRequestError("Ollama returned no structured content.");
      let output: unknown;
      try { output = JSON.parse(text); } catch { throw new ProviderRequestError("Ollama returned invalid JSON."); }
      try { return request.validate(output); } catch { throw new ProviderRequestError("Ollama output did not match the required response schema."); }
    } catch (error) {
      if (error instanceof ProviderRequestError || error instanceof ProviderUnavailableError) throw error;
      if (controller.signal.aborted) throw new ProviderRequestError("Ollama request timed out.");
      throw new ProviderRequestError("Ollama local service could not be reached.");
    } finally {
      clearTimeout(timeout);
    }
  }
}

function validateLocalUrl(value: string): void {
  let url: URL;
  try { url = new URL(value); } catch { throw new ProviderUnavailableError("OLLAMA_BASE_URL must be a local HTTP URL."); }
  const isLoopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname.toLowerCase());
  if (!isLoopback || url.protocol !== "http:" || url.username || url.password) {
    throw new ProviderUnavailableError("Ollama is restricted to an unauthenticated local loopback URL.");
  }
}
