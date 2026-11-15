import assert from "node:assert/strict";
import test from "node:test";
import { AuthError, createSession, getInvestigation, getSessionUser, registerUser, removeSession, saveInvestigation } from "../src/lib/database.ts";
import { POST as signup } from "../src/app/api/auth/signup/route.ts";
import { GET as me } from "../src/app/api/auth/me/route.ts";
import { POST as logout } from "../src/app/api/auth/logout/route.ts";
import { randomUUID } from "node:crypto";

test("registration hashes passwords, rejects weak passwords and duplicate emails", async () => {
  const email = `auth-${Date.now()}@example.test`;
  await assert.rejects(registerUser(email, "short", "Test User"), AuthError);
  const user = await registerUser(email, "SecurePassword123", "Test User");
  assert.ok(user.id);
  await assert.rejects(registerUser(email.toUpperCase(), "SecurePassword123", "Duplicate"), /already exists/);
  const session = await createSession(email, "SecurePassword123");
  assert.equal((await getSessionUser(session.token)).email, email);
  await assert.rejects(createSession(email, "WrongPassword123"), /incorrect/);
  await removeSession(session.token);
  assert.equal(await getSessionUser(session.token), null);
});

test("signup and login APIs issue a persistent HttpOnly session that logout revokes", async () => {
  const email = `api-${randomUUID()}@example.test`;
  const response = await signup(new Request("http://localhost/api/auth/signup", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "API Test", email, password: "SecurePassword123" }),
  }));
  assert.equal(response.status, 201);
  const setCookie = response.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/);
  const cookie = setCookie.split(";")[0];
  assert.equal((await me(new Request("http://localhost/api/auth/me", { headers: { cookie } }))).status, 200);
  assert.equal((await logout(new Request("http://localhost/api/auth/logout", { method: "POST", headers: { cookie } }))).status, 200);
  assert.equal((await me(new Request("http://localhost/api/auth/me", { headers: { cookie } }))).status, 401);
});

test("legacy empty reports are surfaced as blocked with missing collection details", async () => {
  const email = `legacy-${randomUUID()}@example.test`;
  await registerUser(email, "SecurePassword123", "Legacy Test");
  const user = await createSession(email, "SecurePassword123");
  const report = {
    investigationId: randomUUID(), platform: "instagram", username: "hr__rohit",
    profileUrl: "https://www.instagram.com/hr__rohit/", generatedAt: new Date().toISOString(),
    collectionStatus: "evidence_provided", collectionMethod: "user_provided", evidenceCount: 1,
    evidenceSources: [{ id: "legacy-evidence", kind: "education", source: "user_provided", sourceLabel: "User supplied", collectedAt: new Date().toISOString() }],
    agents: ["profile-intelligence", "content-intelligence", "professional-intelligence", "toxicity-language", "image-intelligence"].map((agent) => ({ agent, status: "skipped", summary: "Skipped", findings: [], limitations: [] })),
    findings: [], limitations: [], completedStatus: "completed",
  };
  await saveInvestigation(user.user.id, report);
  const saved = await getInvestigation(user.user.id, report.investigationId);
  assert.equal(saved.status, "blocked");
  assert.equal(saved.completedStatus, "blocked");
  assert.equal(saved.collection.attempted, false);
  assert.match(saved.collection.response, /did not record a collection attempt/);
  assert.match(saved.collection.nextAction, /Rerun in automatic or combined mode/);
});
