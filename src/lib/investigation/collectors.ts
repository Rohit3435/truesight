import type { NormalizedProfileInput } from "../profile-input.ts";
import type { EvidenceRecord } from "./types.ts";
import { randomUUID } from "node:crypto";

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

  async collect(input: NormalizedProfileInput): Promise<CollectionResult> {
    const token = process.env.INSTAGRAM_ACCESS_TOKEN;
    const actorId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    if (!token || !actorId) return {
      status: "unavailable", method: "none", evidence: [],
      limitations: ["Instagram collection was attempted but is unavailable: configure an authorized Meta Instagram Graph API access token and professional account ID. This official API can only return profiles within its approved Business Discovery scope; it cannot access arbitrary private or login-restricted profiles."],
    };

    try {
      // Business Discovery is an authorized Meta API path for eligible public
      // professional accounts. It does not fetch or scrape the profile URL.
      const fields = `business_discovery.username(${input.username}){username,name,biography,website,followers_count,media.limit(12){caption,permalink,timestamp}}`;
      const endpoint = new URL(`https://graph.facebook.com/v21.0/${encodeURIComponent(actorId)}`);
      endpoint.searchParams.set("fields", fields);
      const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(12_000), cache: "no-store" });
      const payload = await response.json() as {
        business_discovery?: { username?: string; name?: string; biography?: string; website?: string; followers_count?: number; media?: { data?: Array<{ caption?: string; permalink?: string; timestamp?: string }> } };
        error?: { message?: string; code?: number };
      };
      if (!response.ok || !payload.business_discovery) {
        const reason = payload.error?.message || `Meta Graph API returned HTTP ${response.status}.`;
        return { status: "unavailable", method: "none", evidence: [], limitations: [`Instagram collection failed: ${safeProviderMessage(reason)} Check token validity, app permissions, account eligibility, and Business Discovery access.`] };
      }
      const profile = payload.business_discovery;
      const now = new Date().toISOString();
      const evidence: EvidenceRecord[] = [];
      const add = (kind: EvidenceRecord["kind"], content: string) => evidence.push({ id: randomUUID(), platform: "instagram", kind, content, source: "official_api", sourceLabel: "Meta Instagram Graph API Business Discovery", collectedAt: now });
      const fieldsOut = [profile.username && `Username: ${profile.username}`, profile.name && `Display name: ${profile.name}`, profile.biography && `Biography: ${profile.biography}`, profile.website && `Website: ${profile.website}`, typeof profile.followers_count === "number" && `Followers: ${profile.followers_count}`].filter(Boolean);
      if (fieldsOut.length) add("profile", fieldsOut.join("\n"));
      for (const post of profile.media?.data ?? []) if (post.caption?.trim()) add("caption", [post.caption.trim(), post.permalink && `Post URL: ${post.permalink}`, post.timestamp && `Published: ${post.timestamp}`].filter(Boolean).join("\n"));
      return { status: evidence.length ? "partial" : "unavailable", method: evidence.length ? "official_api" : "none", evidence, limitations: evidence.length ? ["Meta Business Discovery exposes limited fields and recent media for eligible public professional accounts. It does not provide arbitrary private profile content or all images." ] : ["Meta returned no supported profile fields for this target."] };
    } catch (error) {
      return { status: "unavailable", method: "none", evidence: [], limitations: [`Instagram collection failed: ${error instanceof Error ? safeProviderMessage(error.message) : "network error"}. Verify outbound access and Meta API availability.`] };
    }
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
        process.env.LINKEDIN_ACCESS_TOKEN
          ? "LinkedIn collection was attempted but the configured token does not grant an approved API for arbitrary public profile lookup. LinkedIn member APIs generally expose the consenting member's own profile, not another member by URL."
          : "LinkedIn collection was attempted but is unavailable: no authorized LinkedIn API/provider is configured. LinkedIn's standard OAuth member APIs do not permit arbitrary public profile lookup by URL.",
        "Login-restricted pages and platform access controls are not bypassed. Supply authorized profile text, screenshots, or exports to continue.",
      ],
    };
  }
}

function safeProviderMessage(message: string): string {
  return message.replace(/access_token=[^&\s]+/gi, "access_token=[redacted]").slice(0, 300);
}
