import type { NormalizedProfileInput } from "../profile-input.ts";
import type { EvidenceRecord } from "./types.ts";

export interface CollectionResult {
  status: "unavailable" | "partial" | "complete";
  method: "official_api" | "user_provided" | "none";
  evidence: EvidenceRecord[];
  limitations: string[];
}

export interface ProfileCollector {
  readonly platform: NormalizedProfileInput["platform"];
  collect(input: NormalizedProfileInput): Promise<CollectionResult>;
}

/**
 * The prototype has no authorized Instagram API credentials. This adapter is
 * explicit about that state and intentionally does not scrape or bypass access
 * controls. An authorized provider can replace this implementation later.
 */
export class InstagramCollector implements ProfileCollector {
  readonly platform = "instagram" as const;

  async collect(_input: NormalizedProfileInput): Promise<CollectionResult> {
    return {
      status: "unavailable",
      method: "none",
      evidence: [],
      limitations: [
        "Automated Instagram collection is unavailable because no authorized API/provider is configured.",
        "Private content, login-restricted pages, and platform protections are not accessed.",
      ],
    };
  }
}

/**
 * LinkedIn access is permissioned; without an approved integration this
 * adapter reports unavailable rather than attempting page scraping.
 */
export class LinkedInCollector implements ProfileCollector {
  readonly platform = "linkedin" as const;

  async collect(_input: NormalizedProfileInput): Promise<CollectionResult> {
    return {
      status: "unavailable",
      method: "none",
      evidence: [],
      limitations: [
        "Automated LinkedIn collection is unavailable because no authorized API/provider is configured.",
        "Login-restricted pages and platform access controls are not bypassed.",
      ],
    };
  }
}
