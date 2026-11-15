import type { NormalizedProfileInput } from "../profile-input.ts";
import type { CollectionSummary, EvidenceRecord } from "./types.ts";
import { randomUUID } from "node:crypto";

export interface CollectionResult {
  status: "unavailable" | "partial" | "complete";
  method: "official_api" | "user_provided" | "none";
  evidence: EvidenceRecord[];
  limitations: string[];
  summary: CollectionSummary;
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
    const provider = "Meta Instagram Graph API Business Discovery";
    if (!token || !actorId) {
      const reason = "Missing INSTAGRAM_ACCESS_TOKEN and/or INSTAGRAM_BUSINESS_ACCOUNT_ID.";
      return {
      status: "unavailable", method: "none", evidence: [],
      limitations: [`${reason} ${provider} was not called. It can return only profiles within the connected account's approved Business Discovery scope; it cannot access arbitrary private or login-restricted profiles.`],
      summary: { provider, attempted: false, response: "Not called: required server configuration is missing.", dataCollected: [], dataUnavailable: ["Profile metadata", "Captions", "Images", "External links"], failureReason: reason, nextAction: "Configure an authorized Meta access token and eligible Instagram professional account ID, or provide authorized profile material." },
      };
    }

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
        const message = safeProviderMessage(reason);
        return { status: "unavailable", method: "none", evidence: [], limitations: [`${provider} returned HTTP ${response.status}: ${message}`], summary: { provider, attempted: true, response: `HTTP ${response.status}: ${message}`, dataCollected: [], dataUnavailable: ["Profile metadata", "Captions", "Images", "External links"], failureReason: message, nextAction: "Check Meta app permissions, token validity, account eligibility, and Business Discovery access; then retry or submit authorized evidence." } };
      }
      const profile = payload.business_discovery;
      const now = new Date().toISOString();
      const evidence: EvidenceRecord[] = [];
      const add = (kind: EvidenceRecord["kind"], content: string) => evidence.push({ id: randomUUID(), platform: "instagram", kind, content, source: "official_api", sourceLabel: "Meta Instagram Graph API Business Discovery", collectedAt: now });
      const fieldsOut = [profile.username && `Username: ${profile.username}`, profile.name && `Display name: ${profile.name}`, profile.biography && `Biography: ${profile.biography}`, profile.website && `Website: ${profile.website}`, typeof profile.followers_count === "number" && `Followers: ${profile.followers_count}`].filter(Boolean);
      if (fieldsOut.length) add("profile", fieldsOut.join("\n"));
      for (const post of profile.media?.data ?? []) if (post.caption?.trim()) add("caption", [post.caption.trim(), post.permalink && `Post URL: ${post.permalink}`, post.timestamp && `Published: ${post.timestamp}`].filter(Boolean).join("\n"));
      const dataCollected = [...new Set(evidence.map((item) => item.kind))].map((kind) => kind.replaceAll("_", " "));
      const dataUnavailable = ["Images", "External links"];
      const limitation = "Meta Business Discovery returns a limited set of fields for eligible public professional accounts; private content and all profile media are not available through this request.";
      return { status: evidence.length ? "partial" : "unavailable", method: evidence.length ? "official_api" : "none", evidence, limitations: [limitation], summary: { provider, attempted: true, response: "HTTP 200: Business Discovery response received.", dataCollected, dataUnavailable, ...(evidence.length ? {} : { failureReason: "Meta returned no supported profile fields for this target." }), nextAction: evidence.length ? "Review the collected evidence and provide additional authorized material for unavailable fields." : "Confirm that the target is eligible and visible to the connected professional account, or provide authorized evidence." } };
    } catch (error) {
      const reason = error instanceof Error ? safeProviderMessage(error.message) : "Network error.";
      return { status: "unavailable", method: "none", evidence: [], limitations: [`${provider} request failed: ${reason}`], summary: { provider, attempted: true, response: "Request failed before a usable response was received.", dataCollected: [], dataUnavailable: ["Profile metadata", "Captions", "Images", "External links"], failureReason: reason, nextAction: "Check network access and Meta API availability, then retry or submit authorized profile material." } };
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
    const reason = process.env.LINKEDIN_ACCESS_TOKEN
      ? "The configured member token does not grant an approved API for arbitrary target profile lookup."
      : "No authorized LinkedIn API/provider is configured.";
    return {
      status: "unavailable",
      method: "none",
      evidence: [],
      limitations: [
        `${reason} LinkedIn's standard member OAuth APIs do not permit arbitrary public profile lookup by URL.`,
        "Login-restricted pages and platform access controls are not bypassed. Supply authorized profile text, screenshots, or exports to continue.",
      ],
      summary: { provider: "LinkedIn member/profile API", attempted: false, response: "No target-profile request made: no approved API scope for arbitrary profile lookup is configured.", dataCollected: [], dataUnavailable: ["Name", "Headline", "About", "Experience", "Education", "Skills", "Posts"], failureReason: reason, nextAction: "Use a specifically approved LinkedIn partner/member-consent integration if available, or provide authorized profile text, screenshot, or export." },
    };
  }
}

function safeProviderMessage(message: string): string {
  return message.replace(/access_token=[^&\s]+/gi, "access_token=[redacted]").slice(0, 300);
}
