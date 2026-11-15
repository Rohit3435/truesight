import assert from "node:assert/strict";
import test from "node:test";
import { orchestrateInvestigation } from "../src/lib/agents/orchestrator.ts";
import { ToxicityLanguageAgent } from "../src/lib/agents/toxicity-language.ts";
import { EvidenceObservationAgent } from "../src/lib/agents/evidence-observation.ts";

const baseContext = {
  investigationId: "inv-1",
  platform: "instagram",
  username: "sample",
  profileUrl: "https://www.instagram.com/sample/",
};

test("skips agents when their required evidence is absent", async () => {
  const report = await orchestrateInvestigation({ ...baseContext, evidence: [] });
  assert.equal(report.collectionStatus, "unavailable");
  assert.equal(report.findings.length, 0);
  assert.ok(report.agents.filter((agent) => !["evidence-verification", "investigation-orchestrator", "report-generation"].includes(agent.agent)).every((agent) => agent.status === "skipped"));
});

test("runs only applicable agents and retains traceable observations", async () => {
  const report = await orchestrateInvestigation({
    ...baseContext,
    evidence: [{
      id: "ev-1",
      platform: "instagram",
      kind: "caption",
      content: "A note #publicinfo",
      source: "user_provided",
      sourceLabel: "User supplied caption",
      collectedAt: "2026-11-15T00:00:00.000Z",
    }],
  });
  assert.equal(report.findings.length, 1);
  assert.deepEqual(report.findings[0].evidenceIds, ["ev-1"]);
  assert.equal(report.findings[0].verification, "requires_review");
  assert.ok(report.agents.some((agent) => agent.agent === "profile-intelligence" && agent.status === "skipped"));
});

test("isolates agent failure and removes unsupported findings", async () => {
  const failingAgent = {
    name: "broken-agent",
    canRun: () => true,
    run: async () => { throw new Error("controlled failure"); },
  };
  const unsupportedAgent = {
    name: "unsupported-agent",
    canRun: () => true,
    run: async () => ({
      agent: "unsupported-agent",
      status: "completed",
      summary: "test",
      limitations: [],
      findings: [{
        id: "orphan",
        agent: "unsupported-agent",
        title: "Orphan claim",
        observation: "No matching evidence exists.",
        evidenceIds: ["missing-evidence"],
        confidence: "strong",
        verification: "supported",
      }],
    }),
  };
  const report = await orchestrateInvestigation(
    { ...baseContext, evidence: [] },
    [failingAgent, unsupportedAgent],
  );
  assert.equal(report.agents.find((agent) => agent.agent === "broken-agent").status, "failed");
  assert.equal(report.findings.length, 0);
});

test("classifier agent requires explicit external consent and preserves model labels", async () => {
  let calls = 0;
  const classifier = {
    providerName: "huggingface",
    modelName: "unitary/toxic-bert",
    isConfigured: () => true,
    classify: async () => {
      calls += 1;
      return [{ label: "toxicity", score: 0.73 }];
    },
  };
  const agent = new ToxicityLanguageAgent(classifier);
  const context = {
    ...baseContext,
    evidence: [{
      id: "caption-1",
      platform: "instagram",
      kind: "caption",
      content: "Example caption",
      source: "user_provided",
      sourceLabel: "User supplied text",
      collectedAt: "2026-11-15T00:00:00.000Z",
    }],
  };
  assert.equal(agent.canRun(context), false);
  assert.equal(calls, 0);
  const output = await agent.run({ ...context, externalProviderConsent: true });
  assert.equal(calls, 1);
  assert.equal(output.findings[0].modelOutput.label, "toxicity");
  assert.equal(output.findings[0].modelOutput.probability, 0.73);
  assert.equal(output.findings[0].verification, "requires_review");
});

test("model evidence agent requires consent and drops quotes absent from source evidence", async () => {
  let calls = 0;
  const provider = {
    providerName: "gemini",
    modelName: "test-model",
    isConfigured: () => true,
    generateStructured: async (request) => {
      calls += 1;
      return request.validate({ observations: [
        { evidenceId: "profile-1", quote: "Developer at Example", observation: "The supplied text states a developer role." },
        { evidenceId: "profile-1", quote: "Invented quote", observation: "Unsupported." },
      ] });
    },
  };
  const agent = new EvidenceObservationAgent(provider);
  const context = {
    ...baseContext,
    evidence: [{
      id: "profile-1",
      platform: "linkedin",
      kind: "profile",
      content: "Headline: Developer at Example",
      source: "user_provided",
      sourceLabel: "Copied profile text",
      collectedAt: "2026-11-15T00:00:00.000Z",
    }],
  };
  assert.equal(agent.canRun(context), false);
  assert.equal(calls, 0);
  const output = await agent.run({ ...context, externalProviderConsent: true });
  assert.equal(calls, 1);
  assert.equal(output.findings.length, 1);
  assert.equal(output.findings[0].evidenceQuote, "Developer at Example");
  assert.equal(output.findings[0].verification, "requires_review");
  assert.equal(output.provider, "gemini");
});

test("URL intelligence reports literal links without pretending to check reputation", async () => {
  const report = await orchestrateInvestigation({
    ...baseContext,
    evidence: [{
      id: "url-evidence", platform: "instagram", kind: "external_url",
      content: "My site is https://example.org/about.", source: "user_provided",
      sourceLabel: "User-provided profile details", collectedAt: "2026-11-15T00:00:00.000Z",
    }],
  });
  const urlAgent = report.agents.find((agent) => agent.agent === "url-security-intelligence");
  assert.equal(urlAgent.status, "completed");
  assert.equal(urlAgent.findings.length, 1);
  assert.match(urlAgent.limitations.join(" "), /not connected/);
  assert.ok(report.agents.some((agent) => agent.agent === "username-osint" && agent.status === "skipped"));
  assert.ok(report.agents.some((agent) => agent.agent === "evidence-verification" && agent.status === "completed"));
  assert.ok(report.agents.some((agent) => agent.agent === "report-generation" && agent.status === "completed"));
});

test("Instagram education or skills evidence executes text and professional agents independently", async () => {
  const report = await orchestrateInvestigation({
    ...baseContext,
    evidence: [{
      id: "short-education", platform: "instagram", kind: "education",
      content: "About person", source: "user_provided", sourceLabel: "User submitted education text",
      collectedAt: "2026-11-15T00:00:00.000Z",
    }],
  });
  assert.equal(report.agents.find((agent) => agent.agent === "professional-intelligence").status, "completed");
  assert.equal(report.agents.find((agent) => agent.agent === "content-intelligence").status, "completed");
  assert.equal(report.findings.length, 1);
  assert.match(report.findings[0].observation, /not contain enough detail/);
  assert.match(report.findings[0].evidenceQuote, /About person/);
  assert.ok(report.agents.find((agent) => agent.agent === "toxicity-language").summary.includes("Skipped"));
});
