import type { InvestigationContext, InvestigationReport } from "../investigation/types.ts";
import type { InvestigationAgent } from "./agent.ts";
import { ContentIntelligenceAgent } from "./content-intelligence.ts";
import { ProfileIntelligenceAgent } from "./profile-intelligence.ts";
import { ProfessionalIntelligenceAgent } from "./professional-intelligence.ts";
import { ToxicityLanguageAgent } from "./toxicity-language.ts";
import { EvidenceObservationAgent } from "./evidence-observation.ts";
import { ImageIntelligenceAgent } from "./image-intelligence.ts";
import { verifyAgentFindings } from "./evidence-verification.ts";
import { UrlSecurityAgent, UsernameOsintAgent } from "./url-security.ts";

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
    new UrlSecurityAgent(),
    new UsernameOsintAgent(),
  ],
): Promise<InvestigationReport> {
  const eligible = agents.filter((agent) => agent.canRun(context));
  const skipped = agents.filter((agent) => !agent.canRun(context)).map((agent) => ({
    agent: agent.name,
    status: "skipped" as const,
    summary: skippedReason(agent.name, context),
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

  // These workflow steps are visible in every report so skipped capabilities
  // and evidence checks are never represented as invisible work.
  agentOutputs.push({ agent: "evidence-verification", status: "completed", summary: `Validated evidence references for ${findings.length} finding(s).`, findings: [], limitations: [] });
  agentOutputs.push({ agent: "investigation-orchestrator", status: "completed", summary: `Routed ${context.evidence.length} evidence item(s) to applicable agents; independent failures were isolated.`, findings: [], limitations: [] });
  agentOutputs.push({ agent: "report-generation", status: "completed", summary: `Assembled a report from ${context.evidence.length} evidence item(s) and ${findings.length} verified finding(s).`, findings: [], limitations: [] });

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

function skippedReason(name: string, context: InvestigationContext): string {
  if (name === "profile-intelligence") return "Skipped: no profile text evidence was collected or submitted.";
  if (name === "content-intelligence") return "Skipped: no caption or post text was collected or submitted.";
  if (name === "professional-intelligence") return "Skipped: no LinkedIn professional evidence was available.";
  if (name === "image-intelligence") return "Skipped: no image evidence, external AI consent, or configured multimodal provider was available.";
  if (name === "toxicity-language") return "Skipped: caption text, external analysis consent, or a configured classifier was unavailable.";
  if (name === "evidence-observation") return context.externalProviderConsent
    ? "Skipped: no configured text model or analyzable text evidence was available."
    : "Skipped: external AI processing consent was not enabled.";
  if (name === "username-osint") return "Skipped: no approved username-discovery provider is configured; no external sites were queried.";
  if (name === "url-security-intelligence") return "Skipped: no web links were present in the available evidence.";
  return "Skipped because this agent's required input was not available.";
}
