import type { InvestigationAgent } from "./agent.ts";
import type { AgentOutput, Finding } from "../investigation/types.ts";

const WEB_URL = /https?:\/\/[^\s<>()\[\]{}"']+/giu;

/** Reports literal external links from evidence; it does not fetch or rate their destinations. */
export class UrlSecurityAgent implements InvestigationAgent {
  readonly name = "url-security-intelligence";
  canRun(context: Parameters<InvestigationAgent["canRun"]>[0]): boolean {
    WEB_URL.lastIndex = 0;
    return context.evidence.some((record) => WEB_URL.test(record.content));
  }
  async run(context: Parameters<InvestigationAgent["run"]>[0]): Promise<AgentOutput> {
    WEB_URL.lastIndex = 0;
    const findings: Finding[] = [];
    for (const evidence of context.evidence) {
      WEB_URL.lastIndex = 0;
      for (const [index, match] of [...evidence.content.matchAll(WEB_URL)].entries()) {
        const literal = match[0].replace(/[.,;!?]+$/, "");
        try {
          const parsed = new URL(literal);
          if (parsed.username || parsed.password) continue;
          findings.push({
            id: `${this.name}-${evidence.id}-${index}`,
            agent: this.name,
            title: "External web link present in evidence",
            observation: `The supplied material contains the external URL ${parsed.origin}${parsed.pathname}. Its destination and reputation were not checked.`,
            evidenceIds: [evidence.id], evidenceQuote: literal,
            confidence: "limited", verification: "requires_review",
          });
        } catch { /* Invalid URL-like text is not treated as a link. */ }
      }
    }
    return { agent: this.name, status: "completed", summary: `Found ${findings.length} literal web link(s) in supplied evidence.`, findings, limitations: ["This agent only extracts URLs. VirusTotal and URLScan adapters are not connected to the investigation flow, so no reputation or security verdict was requested."] };
  }
}

/** Placeholder status is explicit until an approved, opt-in search source is configured. */
export class UsernameOsintAgent implements InvestigationAgent {
  readonly name = "username-osint";
  canRun(): boolean { return false; }
  async run(): Promise<AgentOutput> {
    return { agent: this.name, status: "skipped", summary: "Skipped: no approved username-discovery provider is configured; no external sites were queried.", findings: [], limitations: ["Username matches are not collected or treated as identity evidence."] };
  }
}
