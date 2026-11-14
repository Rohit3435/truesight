import assert from "node:assert/strict";
import test from "node:test";
import { GeminiProvider } from "../src/lib/providers/gemini.ts";
import { ProviderRequestError, ProviderUnavailableError } from "../src/lib/providers/types.ts";

const request = {
  systemInstruction: "Report only observations supported by the supplied evidence.",
  userInput: "Describe visible non-identifying objects.",
  responseSchema: {
    type: "OBJECT",
    properties: { summary: { type: "STRING" } },
    required: ["summary"],
  },
  images: [{ mimeType: "image/jpeg", base64: "YWJj" }],
  validate(value) {
    if (!value || typeof value.summary !== "string") throw new TypeError("Invalid summary");
    return value;
  },
};

test("reports missing API credentials without making a request", async () => {
  let called = false;
  const provider = new GeminiProvider({ apiKey: "", fetcher: async () => { called = true; } });
  await assert.rejects(provider.generateStructured(request), ProviderUnavailableError);
  assert.equal(called, false);
});

test("sends structured multimodal input with the secret in a header", async () => {
  let captured;
  const provider = new GeminiProvider({
    apiKey: "test-key",
    model: "test-model",
    fetcher: async (url, options) => {
      captured = { url, options, body: JSON.parse(options.body) };
      return Response.json({ candidates: [{ content: { parts: [{ text: '{"summary":"A chair is visible."}' }] } }] });
    },
  });
  const result = await provider.generateStructured(request);
  assert.deepEqual(result, { summary: "A chair is visible." });
  assert.equal(captured.url, "https://generativelanguage.googleapis.com/v1beta/models/test-model:generateContent");
  assert.equal(captured.options.headers["x-goog-api-key"], "test-key");
  assert.equal(captured.body.contents[0].parts[1].inlineData.mimeType, "image/jpeg");
  assert.deepEqual(captured.body.generationConfig.responseSchema, request.responseSchema);
});

test("converts provider HTTP errors to a credential-safe error", async () => {
  const provider = new GeminiProvider({
    apiKey: "test-key",
    fetcher: async () => new Response("sensitive provider body", { status: 429 }),
  });
  await assert.rejects(
    provider.generateStructured(request),
    (error) => error instanceof ProviderRequestError && error.message.includes("429") && !error.message.includes("sensitive"),
  );
});

test("validates decoded output instead of trusting syntactically valid JSON", async () => {
  const provider = new GeminiProvider({
    apiKey: "test-key",
    fetcher: async () => Response.json({ candidates: [{ content: { parts: [{ text: '{"unexpected":true}' }] } }] }),
  });
  await assert.rejects(provider.generateStructured(request), /required response schema/);
});
