import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../src/app/api/investigations/route.ts";

function createForm({ platform = "instagram", profile = "example", text = "A public caption #example", image } = {}) {
  const form = new FormData();
  form.set("platform", platform);
  form.set("profile", profile);
  form.set("evidenceKind", "caption");
  form.set("evidenceText", text);
  form.set("externalProviderConsent", "false");
  if (image) form.set("evidenceImage", image, "evidence.png");
  return form;
}

test("analysis route returns only user-provided evidence and source-linked findings", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", {
    method: "POST",
    body: createForm(),
  }));
  assert.equal(response.status, 201);
  const { report } = await response.json();
  assert.equal(report.username, "example");
  assert.equal(report.collectionMethod, "user_provided");
  assert.equal(report.evidenceSources.length, 1);
  assert.ok(report.findings.some((finding) => finding.observation.includes("#example")));
  assert.ok(!JSON.stringify(report).includes("base64"));
  assert.ok(report.limitations.some((item) => item.includes("Automated Instagram collection is unavailable")));
});

test("analysis route rejects unsupported or invalid profiles", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", {
    method: "POST",
    body: createForm({ profile: "https://example.com/person" }),
  }));
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /Instagram profile URL/);
});

test("image evidence is optional and validated when supplied", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", {
    method: "POST",
    body: createForm({ text: "", image: new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], "screenshot.png", { type: "image/png" }) }),
  }));
  assert.equal(response.status, 201);
  const { report } = await response.json();
  assert.equal(report.evidenceCount, 1);
  assert.equal(report.evidenceSources[0].kind, "image");
  assert.equal(report.agents.find((agent) => agent.agent === "image-intelligence").status, "skipped");
});
