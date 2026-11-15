import assert from "node:assert/strict";
import test from "node:test";
import { POST } from "../src/app/api/investigations/route.ts";
import { createSession, registerUser } from "../src/lib/database.ts";
import { randomUUID } from "node:crypto";

let cookie;
test.before(async () => {
  const email = `route-${randomUUID()}@example.test`;
  await registerUser(email, "ValidPassword123", "Route Test");
  cookie = `truesight_session=${(await createSession(email, "ValidPassword123")).token}`;
});

function createForm({ platform = "instagram", profile = "example", text = "A public caption #example", image, mode = "combined", evidenceKind = "caption" } = {}) {
  const form = new FormData();
  form.set("platform", platform);
  form.set("profile", profile);
  form.set("mode", mode);
  form.set("evidenceKind", evidenceKind);
  form.set("evidenceText", text);
  form.set("externalProviderConsent", "false");
  form.set("permissionConfirmed", "true");
  if (image) form.set("evidenceImage", image, "evidence.png");
  return form;
}

test("analysis route returns only user-provided evidence and source-linked findings", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", {
    method: "POST",
    headers: { cookie },
    body: createForm(),
  }));
  assert.equal(response.status, 201);
  const { report } = await response.json();
  assert.equal(report.username, "example");
  assert.equal(report.collectionMethod, "user_provided");
  assert.equal(report.evidenceSources.length, 1);
  assert.ok(report.findings.some((finding) => finding.observation.includes("#example")));
  assert.ok(!JSON.stringify(report).includes("base64"));
  assert.ok(report.limitations.some((item) => item.includes("INSTAGRAM_ACCESS_TOKEN")));
});

test("analysis route rejects unsupported or invalid profiles", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", {
    method: "POST",
    headers: { cookie },
    body: createForm({ profile: "https://example.com/person" }),
  }));
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /Instagram profile URL/);
});

test("image evidence is optional and validated when supplied", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", {
    method: "POST",
    headers: { cookie },
    body: createForm({ text: "", image: new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], "screenshot.png", { type: "image/png" }) }),
  }));
  assert.equal(response.status, 201);
  const { report } = await response.json();
  assert.equal(report.evidenceCount, 1);
  assert.equal(report.evidenceSources[0].kind, "image");
  assert.equal(report.agents.find((agent) => agent.agent === "image-intelligence").status, "skipped");
  assert.equal(report.status, "blocked");
  assert.equal(report.agents.find((agent) => agent.agent === "report-generation").status, "skipped");
});

test("automatic username investigation runs without manual evidence and explains unavailable collection", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", { method: "POST", headers: { cookie }, body: createForm({ profile: "hr__rohit", text: "", mode: "automatic", evidenceKind: "skills" }) }));
  assert.equal(response.status, 201);
  const { report } = await response.json();
  assert.equal(report.username, "hr__rohit");
  assert.equal(report.evidenceCount, 0);
  assert.equal(report.collectionStatus, "unavailable");
  assert.equal(report.collectionMethod, "none");
  assert.ok(report.collectionErrors.some((reason) => reason.includes("INSTAGRAM_ACCESS_TOKEN")));
  assert.equal(report.collection.attempted, false);
  assert.equal(report.status, "blocked");
  assert.equal(report.completedStatus, "blocked");
  assert.deepEqual(report.statusHistory.map((event) => event.status), ["queued", "collecting", "analysing", "blocked"]);
  assert.equal(report.agents.find((agent) => agent.agent === "report-generation").status, "skipped");
});

test("combined mode preserves an automatic attempt when no optional evidence was added", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", { method: "POST", headers: { cookie }, body: createForm({ profile: "hr__rohit", text: "", mode: "combined" }) }));
  assert.equal(response.status, 201);
  const { report } = await response.json();
  assert.equal(report.evidenceCount, 0);
  assert.equal(report.collectionStatus, "unavailable");
  assert.equal(report.status, "blocked");
});

test("evidence-only mode requires supplied evidence", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", { method: "POST", headers: { cookie }, body: createForm({ text: "", mode: "evidence" }) }));
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /needs|Add profile text/i);
});

test("Instagram URLs and LinkedIn URLs normalize in automatic mode without fabricating evidence", async () => {
  for (const [platform, profile, username] of [
    ["instagram", "https://www.instagram.com/hr__rohit/", "hr__rohit"],
    ["linkedin", "https://www.linkedin.com/in/example-person/", "example-person"],
  ]) {
    const response = await POST(new Request("http://localhost/api/investigations", { method: "POST", headers: { cookie }, body: createForm({ platform, profile, text: "", mode: "automatic" }) }));
    assert.equal(response.status, 201);
    const { report } = await response.json();
    assert.equal(report.username, username);
    assert.equal(report.evidenceCount, 0);
    assert.equal(report.findings.length, 0);
  }
});

test("exact About person skills input remains a limited user claim, not a profile finding", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", { method: "POST", headers: { cookie }, body: createForm({ profile: "hr__rohit", text: "About person", evidenceKind: "skills" }) }));
  const { report } = await response.json();
  assert.equal(report.evidenceCount, 1);
  assert.equal(report.evidenceSources[0].source, "user_provided");
  assert.ok(report.collectionErrors.length);
  assert.ok(report.findings.some((finding) => /not contain enough detail/.test(finding.observation) && finding.evidenceQuote === "About person"));
  assert.equal(report.status, "partially_completed");
  assert.equal(report.collection.attempted, false);
  assert.deepEqual(report.statusHistory.map((event) => event.status), ["queued", "collecting", "analysing", "partially_completed"]);
});

test("investigation route requires a real authenticated session", async () => {
  const response = await POST(new Request("http://localhost/api/investigations", { method: "POST", body: createForm() }));
  assert.equal(response.status, 401);
});
