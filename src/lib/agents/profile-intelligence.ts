import type { InvestigationAgent } from "./agent.ts";
import type { AgentOutput, Finding } from "../investigation/types.ts";

/** Reports which profile fields are present in supplied evidence, not identity truth. */
export class ProfileIntelligenceAgent implements InvestigationAgent {
  readonly name = "profile-intelligence";

  canRun(context: Parameters<InvestigationAgent["canRun"]>[0]): boolean {
    return context.evidence.some((item) => item.kind === "profile");
  }

  async run(context: Parameters<InvestigationAgent["run"]>[0]): Promise<AgentOutput> {
    const evidence = context.evidence.filter((item) => item.kind === "profile");
    const findings: Finding[] = evidence.map((item) => ({
      id: `${this.name}-${item.id}`,
      agent: this.name,
      title: "Profile text supplied",
      observation: `Profile information was provided from ${item.sourceLabel}. It has not been independently verified.`,
      evidenceIds: [item.id],
      confidence: "limited",
      verification: "requires_review",
    }));

    return {
      agent: this.name,
      status: "completed",
      summary: `Reviewed ${evidence.length} profile evidence item(s).`,
      findings,
      limitations: ["Profile statements are claims and have not been independently authenticated."],
    };
  }
}
