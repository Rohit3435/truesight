import type { AgentOutput, EvidenceRecord, Finding } from "../investigation/types.ts";

/** Drops claims with missing source records and marks user-supplied material for review. */
export function verifyAgentFindings(outputs: AgentOutput[], evidence: EvidenceRecord[]): AgentOutput[] {
  const evidenceById = new Map(evidence.map((item) => [item.id, item]));
  return outputs.map((output) => {
    const findings: Finding[] = output.findings.flatMap((finding) => {
      const sourcesExist = finding.evidenceIds.length > 0 && finding.evidenceIds.every((id) => evidenceById.has(id));
      if (!sourcesExist) return [];
      const includesUserEvidence = finding.evidenceIds.some((id) => evidenceById.get(id)?.source === "user_provided");
      return [{
        ...finding,
        verification: includesUserEvidence ? "requires_review" : finding.verification,
      }];
    });
    return { ...output, findings };
  });
}
