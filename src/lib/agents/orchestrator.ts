import type { InvestigationContext, InvestigationReport } from "../investigation/types.ts";
import type { InvestigationAgent } from "./agent.ts";
import { ContentIntelligenceAgent } from "./content-intelligence.ts";
import { ProfileIntelligenceAgent } from "./profile-intelligence.ts";
import { ProfessionalIntelligenceAgent } from "./professional-intelligence.ts";
import { ToxicityLanguageAgent } from "./toxicity-language.ts";
import { EvidenceObservationAgent } from "./evidence-observation.ts";
import { ImageIntelligenceAgent } from "./image-intelligence.ts";
import { verifyAgentFindings } from "./evidence-verification.ts";

/**
 * Runs only agents whose evidence prerequisites are met. Independent agents
 * run concurrently; one failure is recorded without cancelling other work.
 */
export async function orchestrateInvestigation(
  context: InvestigationContext,
  agents: InvestigationAgent[] = [
    new ProfileIntelligenceAgent(),
    new ContentIntelligenceAgent(),
    new ProfessionalIntelligenceAgent(),
    new ToxicityLanguageAgent(),
    new EvidenceObservationAgent(),
    new ImageIntelligenceAgent(),
  ],
): Promise<InvestigationReport> {
  const eligible = agents.filter((agent) => agent.canRun(context));
  const skipped = agents.filter((agent) => !agent.canRun(context)).map((agent) => ({
    agent: agent.name,
    status: "skipped" as const,
    summary: "Required evidence was not available.",
    findings: [],
    limitations: [],
  }));

  const settled = await Promise.allSettled(eligible.map((agent) => agent.run(context)));
  const completed = settled.map((result, index) => result.status === "fulfilled"
    ? result.value
    : {
        agent: eligible[index].name,
        status: "failed" as const,
        summary: "The agent could not complete its analysis.",
        findings: [],
        limitations: [],
        error: result.reason instanceof Error ? result.reason.message : "Unknown agent error",
      });
  const agentOutputs = verifyAgentFindings([...completed, ...skipped], context.evidence);
  const findings = agentOutputs.flatMap((output) => output.findings);

  return {
    investigationId: context.investigationId,
    platform: context.platform,
    username: context.username,
    profileUrl: context.profileUrl,
    generatedAt: new Date().toISOString(),
    collectionStatus: context.evidence.length ? "evidence_provided" : "unavailable",
    collectionMethod: context.evidence.length ? "user_provided" : "none",
    evidenceCount: context.evidence.length,
    evidenceSources: context.evidence.map(({ id, kind, source, sourceLabel, collectedAt }) => ({ id, kind, source, sourceLabel, collectedAt })),
    agents: agentOutputs,
    findings,
    limitations: [...new Set(agentOutputs.flatMap((output) => output.limitations))],
  };
}
