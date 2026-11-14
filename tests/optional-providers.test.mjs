import assert from "node:assert/strict";
import test from "node:test";
import { GroqProvider } from "../src/lib/providers/groq.ts";
import { OllamaProvider } from "../src/lib/providers/ollama.ts";
import { HuggingFaceTextClassifier } from "../src/lib/providers/huggingface-classifier.ts";
import { createModelProvider } from "../src/lib/providers/factory.ts";
import { ProviderUnavailableError } from "../src/lib/providers/types.ts";

const structuredRequest = {
  systemInstruction: "Only summarize supplied text.",
  userInput: "A sample caption.",
  responseSchema: {},
  validate(value) {
    if (!value || typeof value.summary !== "string") throw new Error("invalid");
    return value;
  },
};

test("Groq optional text adapter validates JSON and rejects image inputs", async () => {
  const provider = new GroqProvider({
    apiKey: "test-key",
    model: "test-model",
    fetcher: async (_url, options) => {
      assert.equal(options.headers.authorization, "Bearer test-key");
      return Response.json({ choices: [{ message: { content: '{"summary":"caption"}' } }] });
    },
  });
  assert.deepEqual(await provider.generateStructured(structuredRequest), { summary: "caption" });
  await assert.rejects(provider.generateStructured({ ...structuredRequest, images: [{ mimeType: "image/jpeg", base64: "YQ==" }] }), ProviderUnavailableError);
});

test("Ollama is restricted to loopback and returns validated local output", async () => {
  assert.throws(() => new OllamaProvider({ baseUrl: "http://169.254.169.254:80", model: "model" }), ProviderUnavailableError);
  const provider = new OllamaProvider({
    baseUrl: "http://127.0.0.1:11434",
    model: "local-model",
    fetcher: async (url) => {
      assert.equal(url, "http://127.0.0.1:11434/api/chat");
      return Response.json({ message: { content: '{"summary":"local result"}' } });
    },
  });
  assert.deepEqual(await provider.generateStructured(structuredRequest), { summary: "local result" });
});

test("Hugging Face classifier preserves model labels and probabilities", async () => {
  const classifier = new HuggingFaceTextClassifier({
    token: "test-token",
    model: "unitary/toxic-bert",
    fetcher: async (url, options) => {
      assert.equal(url, "https://router.huggingface.co/hf-inference/models/unitary/toxic-bert");
      assert.equal(options.headers.authorization, "Bearer test-token");
      return Response.json([{ label: "toxic", score: 0.81 }, { label: "obscene", score: 0.12 }]);
    },
  });
  assert.deepEqual(await classifier.classify("A short example."), [
    { label: "toxic", score: 0.81 },
    { label: "obscene", score: 0.12 },
  ]);
});

test("provider factory defaults to Gemini and requires explicit selection", () => {
  assert.equal(createModelProvider({}).providerName, "gemini");
  assert.equal(createModelProvider({ AI_PROVIDER: "groq", GROQ_API_KEY: "x", GROQ_MODEL: "m" }).providerName, "groq");
  assert.throws(() => createModelProvider({ AI_PROVIDER: "unknown" }), ProviderUnavailableError);
});
