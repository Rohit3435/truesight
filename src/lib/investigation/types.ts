import type { SocialPlatform } from "../profile-input.ts";

/** Evidence is the only input to analysis agents; agents must cite its IDs. */
export interface EvidenceRecord {
  id: string;
  platform: SocialPlatform;
  kind:
    | "profile"
    | "caption"
    | "professional_experience"
    | "education"
    | "skills"
    | "certification"
    | "external_url"
    | "image";
  content: string;
  source: "official_api" | "user_provided";
  sourceLabel: string;
  collectedAt: string;
}

export interface InvestigationContext {
  investigationId: string;
  platform: SocialPlatform;
  username: string;
  profileUrl: string;
  evidence: EvidenceRecord[];
}

export type AgentStatus = "completed" | "skipped" | "failed";
export type Confidence = "limited" | "moderate" | "strong";

export interface Finding {
  id: string;
  agent: string;
  title: string;
  observation: string;
  evidenceIds: string[];
  confidence: Confidence;
  verification: "supported" | "requires_review";
}

export interface AgentOutput {
  agent: string;
  status: AgentStatus;
  summary: string;
  findings: Finding[];
  limitations: string[];
  error?: string;
}

export interface InvestigationReport {
  investigationId: string;
  platform: SocialPlatform;
  username: string;
  profileUrl: string;
  generatedAt: string;
  collectionStatus: "unavailable" | "partial" | "evidence_provided";
  evidenceCount: number;
  agents: AgentOutput[];
  findings: Finding[];
  limitations: string[];
}
