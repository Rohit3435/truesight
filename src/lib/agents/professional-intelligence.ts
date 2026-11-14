import type { InvestigationAgent } from "./agent.ts";
import type { AgentOutput, Finding } from "../investigation/types.ts";

const PROFESSIONAL_KINDS = new Set(["professional_experience", "education", "skills", "certification"]);

/** Summarizes provided LinkedIn evidence without treating claims as verified credentials. */
export class ProfessionalIntelligenceAgent implements InvestigationAgent {
  readonly name = "professional-intelligence";

  canRun(context: Parameters<InvestigationAgent["canRun"]>[0]): boolean {
    return context.platform === "linkedin" && context.evidence.some((item) => PROFESSIONAL_KINDS.has(item.kind));
  }

  async run(context: Parameters<InvestigationAgent["run"]>[0]): Promise<AgentOutput> {
    const evidence = context.evidence.filter((item) => PROFESSIONAL_KINDS.has(item.kind));
    const findings: Finding[] = evidence.map((item) => ({
      id: `${this.name}-${item.id}`,
      agent: this.name,
      title: `${item.kind.replaceAll("_", " ")} information provided`,
      observation: `The supplied material contains ${item.kind.replaceAll("_", " ")} information. Its accuracy and issuer have not been independently verified.`,
      evidenceIds: [item.id],
      confidence: "limited",
      verification: "requires_review",
    }));

    return {
      agent: this.name,
      status: "completed",
      summary: `Reviewed ${evidence.length} professional profile evidence item(s).`,
      findings,
      limitations: ["Employment, education, skills, and certifications are not verified against their issuers."],
    };
  }
}
