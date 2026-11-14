import assert from "node:assert/strict";
import test from "node:test";
import { orchestrateInvestigation } from "../src/lib/agents/orchestrator.ts";

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
  assert.ok(report.agents.every((agent) => agent.status === "skipped"));
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
