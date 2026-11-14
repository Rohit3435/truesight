export interface InlineImageInput {
  mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  base64: string;
}

export interface StructuredGenerationRequest<T> {
  systemInstruction: string;
  userInput: string;
  responseSchema: Record<string, unknown>;
  images?: InlineImageInput[];
  /** Runtime validation is required; JSON syntax alone does not prove the shape. */
  validate: (output: unknown) => T;
}

export interface TextModelProvider {
  readonly providerName: string;
  readonly modelName: string;
  isConfigured?(): boolean;
  generateStructured<T>(request: StructuredGenerationRequest<T>): Promise<T>;
}

export class ProviderUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderUnavailableError";
  }
}

export class ProviderRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderRequestError";
  }
}
