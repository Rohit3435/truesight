import assert from "node:assert/strict";
import test from "node:test";
import { InstagramCollector, LinkedInCollector } from "../src/lib/investigation/collectors.ts";
import { normalizeProfileInput } from "../src/lib/profile-input.ts";

test("Instagram collector reports missing authorized credentials clearly", async () => {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const actor = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  delete process.env.INSTAGRAM_ACCESS_TOKEN;
  delete process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  try {
    const result = await new InstagramCollector().collect(normalizeProfileInput("instagram", "hr__rohit"));
    assert.equal(result.status, "unavailable");
    assert.match(result.limitations[0], /was not called/);
    assert.equal(result.summary.attempted, false);
    assert.match(result.summary.failureReason, /INSTAGRAM_ACCESS_TOKEN/);
  } finally {
    if (token) process.env.INSTAGRAM_ACCESS_TOKEN = token;
    if (actor) process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID = actor;
  }
});

test("Instagram Graph API evidence is source-labeled and carries the target profile/post", async () => {
  const oldToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const oldActor = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const oldFetch = globalThis.fetch;
  process.env.INSTAGRAM_ACCESS_TOKEN = "test-token";
  process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID = "actor-123";
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.Authorization, "Bearer test-token");
    return Response.json({ business_discovery: { username: "hr__rohit", name: "Rohit", biography: "Engineer", media: { data: [{ caption: "Public caption #work", timestamp: "2026-01-01T00:00:00+0000" }] } } });
  };
  try {
    const result = await new InstagramCollector().collect(normalizeProfileInput("instagram", "hr__rohit"));
    assert.equal(result.status, "partial");
    assert.equal(result.method, "official_api");
    assert.equal(result.evidence.length, 2);
    assert.ok(result.evidence.every((entry) => entry.source === "official_api"));
    assert.match(result.evidence[0].content, /Display name: Rohit/);
    assert.match(result.evidence[1].content, /#work/);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldToken) process.env.INSTAGRAM_ACCESS_TOKEN = oldToken; else delete process.env.INSTAGRAM_ACCESS_TOKEN;
    if (oldActor) process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID = oldActor; else delete process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  }
});

test("an inaccessible or private Instagram target returns Meta's actual access failure without evidence", async () => {
  const oldToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const oldActor = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const oldFetch = globalThis.fetch;
  process.env.INSTAGRAM_ACCESS_TOKEN = "test-token";
  process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID = "actor-123";
  globalThis.fetch = async () => Response.json({ error: { message: "Target is not available to Business Discovery due to permissions." } }, { status: 400 });
  try {
    const result = await new InstagramCollector().collect(normalizeProfileInput("instagram", "hr__rohit"));
    assert.equal(result.status, "unavailable");
    assert.equal(result.evidence.length, 0);
    assert.match(result.limitations[0], /Target is not available to Business Discovery/);
  } finally {
    globalThis.fetch = oldFetch;
    if (oldToken) process.env.INSTAGRAM_ACCESS_TOKEN = oldToken; else delete process.env.INSTAGRAM_ACCESS_TOKEN;
    if (oldActor) process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID = oldActor; else delete process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  }
});

test("LinkedIn collector does not treat an OAuth token as arbitrary target lookup access", async () => {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  delete process.env.LINKEDIN_ACCESS_TOKEN;
  try {
    const result = await new LinkedInCollector().collect(normalizeProfileInput("linkedin", "https://www.linkedin.com/in/example-person/"));
    assert.equal(result.status, "unavailable");
    assert.match(result.limitations.join(" "), /No authorized LinkedIn API\/provider/);
  } finally {
    if (token) process.env.LINKEDIN_ACCESS_TOKEN = token;
  }
});
