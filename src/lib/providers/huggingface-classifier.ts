import { ProviderRequestError, ProviderUnavailableError } from "./types.ts";

export interface ClassificationLabel {
  label: string;
  score: number;
}

interface HuggingFaceOptions {
  token?: string;
  model?: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}

/**
 * Optional model-specific text classifier. Returned probabilities retain the
 * model's labels and must not be interpreted as universal person-level scores.
 */
export class HuggingFaceTextClassifier {
  readonly providerName = "huggingface";
  private readonly token?: string;
  private readonly model: string;
  private readonly fetcher: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: HuggingFaceOptions = {}) {
    this.token = options.token ?? process.env.HF_TOKEN;
    this.model = options.model ?? process.env.HF_TEXT_CLASSIFICATION_MODEL ?? "unitary/toxic-bert";
    this.fetcher = options.fetcher ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 30_000;
  }

  isConfigured(): boolean {
    return Boolean(this.token);
  }

  get modelName(): string {
    return this.model;
  }

  async classify(text: string): Promise<ClassificationLabel[]> {
    if (!this.token) throw new ProviderUnavailableError("Hugging Face is not configured. Set HF_TOKEN on the server.");
    if (!text.trim() || text.length > 8_000) throw new ProviderRequestError("Classification input must contain 1–8000 characters.");
    const modelPath = this.model.split("/").map(encodeURIComponent).join("/");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetcher(`https://router.huggingface.co/hf-inference/models/${modelPath}`, {
        method: "POST",
        headers: { authorization: `Bearer ${this.token}`, "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ inputs: text, parameters: { function_to_apply: "sigmoid", top_k: 20 } }),
      });
      if (!response.ok) throw new ProviderRequestError(`Hugging Face request failed with HTTP ${response.status}.`);
      const payload = await response.json() as unknown;
      return validateLabels(payload);
    } catch (error) {
      if (error instanceof ProviderRequestError || error instanceof ProviderUnavailableError) throw error;
      if (controller.signal.aborted) throw new ProviderRequestError("Hugging Face request timed out.");
      throw new ProviderRequestError("Hugging Face classification request could not be completed.");
    } finally {
      clearTimeout(timeout);
    }
  }
}

function validateLabels(payload: unknown): ClassificationLabel[] {
  const labels = Array.isArray(payload) && payload.length > 0 && Array.isArray(payload[0]) ? payload[0] : payload;
  if (!Array.isArray(labels) || labels.length === 0) throw new ProviderRequestError("Hugging Face returned no classification labels.");
  return labels.map((entry): ClassificationLabel => {
    if (!entry || typeof entry !== "object") throw new ProviderRequestError("Hugging Face returned an invalid label.");
    const { label, score } = entry as Record<string, unknown>;
    if (typeof label !== "string" || typeof score !== "number" || score < 0 || score > 1) {
      throw new ProviderRequestError("Hugging Face returned an invalid label or probability.");
    }
    return { label, score };
  });
}
