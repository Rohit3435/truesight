import type { InlineImageInput, StructuredGenerationRequest, TextModelProvider } from "./types.ts";
import { ProviderRequestError, ProviderUnavailableError } from "./types.ts";

interface GeminiProviderOptions {
  apiKey?: string;
  model?: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
}

const API_ROOT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_MODEL = "gemini-3.5-flash-lite";
const MAX_INLINE_IMAGE_BYTES = 8 * 1024 * 1024;

/**
 * Server-side Gemini adapter for grounded structured text and image analysis.
 * Credentials are sent in the documented header, never in a URL or browser.
 */
export class GeminiProvider implements TextModelProvider {
  readonly providerName = "gemini";
  readonly supportsImages = true;
  readonly modelName: string;
  private readonly apiKey?: string;
  private readonly fetcher: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: GeminiProviderOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.GEMINI_API_KEY;
    this.modelName = options.model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
    this.fetcher = options.fetcher ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 30_000;
  }

  isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<T> {
    if (!this.apiKey) {
      throw new ProviderUnavailableError("Gemini is not configured. Set GEMINI_API_KEY on the server.");
    }
    validateImages(request.images ?? []);

    const parts: Array<Record<string, unknown>> = [
      { text: request.userInput },
      ...(request.images ?? []).map(imagePart),
    ];
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetcher(`${API_ROOT}/${encodeURIComponent(this.modelName)}:generateContent`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": this.apiKey,
        },
        signal: controller.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: request.systemInstruction }] },
          contents: [{ role: "user", parts }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: request.responseSchema,
            temperature: 0.1,
          },
        }),
      });

      if (!response.ok) {
        throw new ProviderRequestError(`Gemini request failed with HTTP ${response.status}.`);
      }

      const payload = await response.json() as GeminiResponse;
      const text = payload.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim();
      if (!text) throw new ProviderRequestError("Gemini returned no structured content.");

      let output: unknown;
      try {
        output = JSON.parse(text);
      } catch {
        throw new ProviderRequestError("Gemini returned invalid JSON.");
      }
      try {
        return request.validate(output);
      } catch {
        throw new ProviderRequestError("Gemini output did not match the required response schema.");
      }
    } catch (error) {
      if (error instanceof ProviderRequestError || error instanceof ProviderUnavailableError) throw error;
      if (controller.signal.aborted) throw new ProviderRequestError("Gemini request timed out.");
      throw new ProviderRequestError("Gemini request could not be completed.");
    } finally {
      clearTimeout(timeout);
    }
  }
}

function validateImages(images: InlineImageInput[]): void {
  let totalBytes = 0;
  for (const image of images) {
    if (!image.base64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image.base64)) {
      throw new ProviderRequestError("Image input must be valid base64 data.");
    }
    totalBytes += Math.floor(image.base64.length * 3 / 4);
  }
  if (totalBytes > MAX_INLINE_IMAGE_BYTES) {
    throw new ProviderRequestError("Combined inline image data exceeds the 8 MB limit.");
  }
}

function imagePart(image: InlineImageInput): Record<string, unknown> {
  return { inlineData: { mimeType: image.mimeType, data: image.base64 } };
}
