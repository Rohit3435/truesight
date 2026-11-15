import type { InvestigationAgent } from "./agent.ts";
import type { AgentOutput, Finding } from "../investigation/types.ts";

/** Runs on available text and extracts only literal hashtags; it does not assign sentiment or risk. */
export class ContentIntelligenceAgent implements InvestigationAgent {
  readonly name = "content-intelligence";

  canRun(context: Parameters<InvestigationAgent["canRun"]>[0]): boolean {
    return context.evidence.some((item) => item.kind !== "image" && item.content.trim().length > 0);
  }

  async run(context: Parameters<InvestigationAgent["run"]>[0]): Promise<AgentOutput> {
    const captions = context.evidence.filter((item) => item.kind !== "image" && item.content.trim());
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
      } else if (item.kind === "caption") {
        findings.push({
          id: `${this.name}-${item.id}-text`,
          agent: this.name,
          title: "Caption text supplied",
          observation: "Caption text was provided, but no literal hashtag pattern was present. This deterministic check does not infer sentiment, themes, or intent.",
          evidenceIds: [item.id],
          evidenceQuote: item.content.trim().slice(0, 180),
          confidence: "limited",
          verification: "requires_review",
        });
      }
    }

    return {
      agent: this.name,
      status: "completed",
      summary: `Reviewed ${captions.length} text evidence item(s) for literal hashtag patterns.`,
      findings,
      limitations: ["No sentiment, toxicity, intent, or personal trait inference was performed."],
    };
  }
}
