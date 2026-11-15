import type { InvestigationAgent } from "./agent.ts";
import type { AgentOutput, Finding } from "../investigation/types.ts";

const PROFESSIONAL_KINDS = new Set(["professional_experience", "education", "skills", "certification"]);

/** Analyzes any platform's evidence labeled as professional material without treating it as verified credentials. */
export class ProfessionalIntelligenceAgent implements InvestigationAgent {
  readonly name = "professional-intelligence";

  canRun(context: Parameters<InvestigationAgent["canRun"]>[0]): boolean {
    // The evidence category, not the social network, determines whether this specialist applies.
    return context.evidence.some((item) => PROFESSIONAL_KINDS.has(item.kind));
  }

  async run(context: Parameters<InvestigationAgent["run"]>[0]): Promise<AgentOutput> {
    const evidence = context.evidence.filter((item) => PROFESSIONAL_KINDS.has(item.kind));
    const findings: Finding[] = evidence.map((item) => {
      const specificClaim = item.content.trim().length > 30;
      return {
        id: `${this.name}-${item.id}`,
        agent: this.name,
        title: specificClaim ? `${item.kind.replaceAll("_", " ")} material supplied` : `Insufficient ${item.kind.replaceAll("_", " ")} detail`,
        observation: specificClaim
          ? `Material was submitted under the ${item.kind.replaceAll("_", " ")} category. It is a user-supplied claim and has not been verified against an issuer.`
          : `The item is labeled ${item.kind.replaceAll("_", " ")} but does not contain enough detail to identify a specific claim. Submitted text: “${item.content.trim().slice(0, 180)}”. No credential or skill is inferred.`,
        evidenceIds: [item.id],
        evidenceQuote: item.content.trim().slice(0, 180),
        confidence: "limited" as const,
        verification: "requires_review" as const,
      };
    });

    return {
      agent: this.name,
      status: "completed",
      summary: `Reviewed ${evidence.length} evidence item(s) labeled as professional information for specific, supportable details.`,
      findings,
      limitations: ["Submitted labels do not prove professional credentials. Employment, education, skills, and certifications are not verified against their issuers."],
    };
  }
}
