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
  imageData?: {
    mimeType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
    base64: string;
  };
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
  /** External model calls are disabled unless the caller records explicit consent. */
  externalProviderConsent?: boolean;
}

export type AgentStatus = "completed" | "skipped" | "failed";
export type Confidence = "limited" | "moderate" | "strong";

export interface Finding {
  id: string;
  agent: string;
  title: string;
  observation: string;
  evidenceIds: string[];
  evidenceQuote?: string;
  confidence: Confidence;
  verification: "supported" | "requires_review";
  modelOutput?: {
    provider: string;
    model: string;
    label: string;
    probability: number;
  };
}

export interface AgentOutput {
  agent: string;
  status: AgentStatus;
  summary: string;
  findings: Finding[];
  limitations: string[];
  provider?: string;
  model?: string;
  error?: string;
}

export interface InvestigationReport {
  investigationId: string;
  platform: SocialPlatform;
  username: string;
  profileUrl: string;
  generatedAt: string;
  collectionStatus: "unavailable" | "partial" | "evidence_provided";
  collectionMethod: "none" | "user_provided" | "official_api";
  evidenceCount: number;
  evidenceSources: Array<Pick<EvidenceRecord, "id" | "kind" | "source" | "sourceLabel" | "collectedAt">>;
  agents: AgentOutput[];
  findings: Finding[];
  limitations: string[];
}
