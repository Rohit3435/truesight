import { randomUUID } from "node:crypto";
import { normalizeProfileInput, ProfileInputError, type SocialPlatform } from "../../../lib/profile-input.ts";
import { InstagramCollector, LinkedInCollector } from "../../../lib/investigation/collectors.ts";
import type { EvidenceRecord } from "../../../lib/investigation/types.ts";
import { orchestrateInvestigation } from "../../../lib/agents/orchestrator.ts";
import { getSessionUser, saveInvestigation, sessionToken } from "../../../lib/database.ts";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_REQUEST_BYTES = 4 * 1024 * 1024;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const MAX_TEXT_CHARS = 12_000;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const EVIDENCE_KINDS = new Set<EvidenceRecord["kind"]>([
  "profile", "caption", "professional_experience", "education", "skills", "certification", "external_url",
]);

/** Attempts configured authorized collection and then analyzes available evidence. */
export async function POST(request: Request): Promise<Response> {
  const user = await getSessionUser(sessionToken(request));
  if (!user) return json({ error: "Sign in to save and run investigations." }, 401);
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_REQUEST_BYTES) return json({ error: "Request exceeds the 4 MB limit." }, 413);

  try {
    const form = await request.formData();
    const platformValue = form.get("platform");
    if (platformValue !== "instagram" && platformValue !== "linkedin") {
      return json({ error: "Choose Instagram or LinkedIn." }, 400);
    }
    const profileValue = form.get("profile");
    if (typeof profileValue !== "string") return json({ error: "Enter a username or profile URL." }, 400);

    let target;
    try {
      target = normalizeProfileInput(platformValue as SocialPlatform, profileValue);
    } catch (error) {
      if (error instanceof ProfileInputError) return json({ error: error.message }, 400);
      throw error;
    }

    const content = form.get("evidenceText");
    if (typeof content !== "string" || content.length > MAX_TEXT_CHARS) {
      return json({ error: `Evidence text must be at most ${MAX_TEXT_CHARS.toLocaleString()} characters.` }, 400);
    }
    const evidenceKindValue = form.get("evidenceKind");
    if (typeof evidenceKindValue !== "string" || !EVIDENCE_KINDS.has(evidenceKindValue as EvidenceRecord["kind"])) {
      return json({ error: "Choose a supported evidence type." }, 400);
    }

    const modeValue = form.get("mode");
    const mode = modeValue === "automatic" || modeValue === "evidence" || modeValue === "combined" ? modeValue : "combined";
    const evidence: EvidenceRecord[] = [];
    if (mode !== "automatic" && content.trim()) {
      evidence.push({
        id: randomUUID(),
        platform: target.platform,
        kind: evidenceKindValue as EvidenceRecord["kind"],
        content: content.trim(),
        source: "user_provided",
        sourceLabel: "User-provided text",
        collectedAt: new Date().toISOString(),
      });
    }

    const imageValue = form.get("evidenceImage");
    if (mode !== "automatic" && imageValue !== null) {
      if (!isFile(imageValue)) return json({ error: "Uploaded evidence must be an image file." }, 400);
      if (imageValue.size > MAX_IMAGE_BYTES) return json({ error: "Image must be 3 MB or smaller." }, 413);
      if (!IMAGE_TYPES.has(imageValue.type)) return json({ error: "Use a JPEG, PNG, WebP, or GIF image." }, 400);
      const bytes = Buffer.from(await imageValue.arrayBuffer());
      const detectedType = detectImageType(bytes);
      if (detectedType !== imageValue.type) return json({ error: "The image content does not match its declared file type." }, 400);
      evidence.push({
        id: randomUUID(),
        platform: target.platform,
        kind: "image",
        content: "",
        imageData: { mimeType: detectedType, base64: bytes.toString("base64") },
        source: "user_provided",
        sourceLabel: "User-uploaded image",
        collectedAt: new Date().toISOString(),
      });
    }

    const externalProviderConsent = form.get("externalProviderConsent") === "true";
    if (form.get("permissionConfirmed") !== "true") return json({ error: "Confirm that you have permission to submit this material for investigation." }, 400);
    const collection = mode === "evidence"
      ? { status: "unavailable" as const, method: "none" as const, evidence: [] as EvidenceRecord[], limitations: [] as string[] }
      : await (target.platform === "instagram" ? new InstagramCollector() : new LinkedInCollector()).collect(target);
    const allEvidence = [...collection.evidence, ...evidence];
    if (allEvidence.length === 0 && mode === "evidence") {
      return json({ error: "Add profile text, captions, professional details, or an image for evidence-based analysis." }, 400);
    }
    const report = await orchestrateInvestigation({
      investigationId: randomUUID(),
      platform: target.platform,
      username: target.username,
      profileUrl: target.profileUrl,
      evidence: allEvidence,
      externalProviderConsent,
    });

    report.limitations = [...collection.limitations, ...report.limitations];
    report.collectionStatus = mode === "evidence" ? "evidence_provided"
      : collection.status === "complete" ? "complete"
      : collection.status === "partial" ? "partial"
      : collection.status === "unavailable" ? (evidence.length ? "partial" : "unavailable") : "evidence_provided";
    report.collectionMethod = collection.method === "none" ? (evidence.length ? "user_provided" : "none")
      : evidence.length ? "mixed" : collection.method;
    report.collectionErrors = collection.limitations;
    report.completedStatus = allEvidence.length ? "completed" : "failed";
    report.limitations = [...new Set([...collection.limitations, ...report.limitations])];
    await saveInvestigation(user.id, report);
    return json({ report }, 201);
  } catch {
    return json({ error: "The investigation could not be saved. Check the upload and local storage, then try again." }, 500);
  }
}

function isFile(value: FormDataEntryValue): value is File {
  return typeof value !== "string"
    && typeof value.size === "number"
    && typeof value.type === "string"
    && typeof value.arrayBuffer === "function";
}

function detectImageType(bytes: Buffer): NonNullable<EvidenceRecord["imageData"]>["mimeType"] | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (bytes.length >= 6 && ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6))) return "image/gif";
  return null;
}

function json(body: unknown, status: number): Response {
  return Response.json(body, { status });
}
