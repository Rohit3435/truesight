import type { InvestigationAgent } from "./agent.ts";
import type { AgentOutput, Finding } from "../investigation/types.ts";

/** Extracts literal hashtags from text; it does not assign sentiment or risk. */
export class ContentIntelligenceAgent implements InvestigationAgent {
  readonly name = "content-intelligence";

  canRun(context: Parameters<InvestigationAgent["canRun"]>[0]): boolean {
    return context.evidence.some((item) => item.kind === "caption");
  }

  async run(context: Parameters<InvestigationAgent["run"]>[0]): Promise<AgentOutput> {
    const captions = context.evidence.filter((item) => item.kind === "caption");
    const findings: Finding[] = [];
    for (const item of captions) {
      const hashtags = [...new Set(item.content.match(/#[\p{L}\p{N}_]+/gu) ?? [])];
      if (hashtags.length) {
        findings.push({
          id: `${this.name}-${item.id}-hashtags`,
          agent: this.name,
          title: "Hashtags present in supplied caption",
          observation: `The caption contains these literal hashtags: ${hashtags.join(", ")}.`,
          evidenceIds: [item.id],
          confidence: "moderate",
          verification: "supported",
        });
      }
    }

    return {
      agent: this.name,
      status: "completed",
      summary: `Reviewed ${captions.length} caption evidence item(s) for literal content patterns.`,
      findings,
      limitations: ["No sentiment, toxicity, intent, or personal trait inference was performed."],
    };
  }
}
