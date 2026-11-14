import { isIP } from "node:net";
import { ProviderRequestError, ProviderUnavailableError } from "../providers/types.ts";

export interface UrlScanSubmission {
  source: "URLScan.io";
  scanId: string;
  resultUrl: string;
  visibility: "private";
  status: "submitted";
}

interface UrlScanOptions {
  apiKey?: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}

/**
 * Consent-gated URLScan adapter that only submits private scans of public
 * HTTPS hostnames. It never fetches a user-controlled URL from this server.
 */
export class UrlScanClient {
  private readonly apiKey?: string;
  private readonly fetcher: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: UrlScanOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.URLSCAN_API_KEY;
    this.fetcher = options.fetcher ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 30_000;
  }

  async submitPrivateScan(input: string, externalProviderConsent: boolean): Promise<UrlScanSubmission> {
    if (!externalProviderConsent) throw new ProviderUnavailableError("URLScan submission requires explicit external-provider consent.");
    if (!this.apiKey) throw new ProviderUnavailableError("URLScan is not configured. Set URLSCAN_API_KEY on the server.");
    const targetUrl = validatePublicTarget(input);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetcher("https://urlscan.io/api/v1/scan/", {
        method: "POST",
        headers: {
          "API-Key": this.apiKey,
          "Content-Type": "application/json",
          "User-Agent": "TrueSight/0.1 (+https://github.com/Rohit3435/truesight)",
        },
        signal: controller.signal,
        body: JSON.stringify({ url: targetUrl, visibility: "private" }),
      });
      if (!response.ok) throw new ProviderRequestError(`URLScan submission failed with HTTP ${response.status}.`);
      const payload = await response.json() as { uuid?: unknown; result?: unknown };
      if (typeof payload.uuid !== "string" || !/^[0-9a-f-]{20,}$/i.test(payload.uuid)) {
        throw new ProviderRequestError("URLScan returned an invalid scan identifier.");
      }
      const resultUrl = typeof payload.result === "string" && payload.result.startsWith("https://urlscan.io/")
        ? payload.result
        : `https://urlscan.io/result/${payload.uuid}/`;
      return { source: "URLScan.io", scanId: payload.uuid, resultUrl, visibility: "private", status: "submitted" };
    } catch (error) {
      if (error instanceof ProviderRequestError || error instanceof ProviderUnavailableError) throw error;
      if (controller.signal.aborted) throw new ProviderRequestError("URLScan submission timed out.");
      throw new ProviderRequestError("URLScan submission could not be completed.");
    } finally {
      clearTimeout(timeout);
    }
  }
}

function validatePublicTarget(input: string): string {
  let url: URL;
  try { url = new URL(input); } catch { throw new ProviderRequestError("URLScan requires a valid HTTPS URL."); }
  const hostname = url.hostname.toLowerCase().replace(/\.$/, "");
  if (url.protocol !== "https:" || url.username || url.password || url.port) {
    throw new ProviderRequestError("URLScan accepts only HTTPS URLs without credentials or custom ports.");
  }
  if (!hostname.includes(".") || hostname === "localhost" || hostname.endsWith(".local") || hostname.endsWith(".internal") || isIP(hostname)) {
    throw new ProviderRequestError("URLScan accepts public DNS hostnames only; local and IP targets are rejected.");
  }
  url.hash = "";
  return url.toString();
}
