import { ProviderRequestError, ProviderUnavailableError } from "../providers/types.ts";

export interface VirusTotalUrlReport {
  source: "VirusTotal";
  url: string;
  reputation: number;
  analysisStats: Record<string, number>;
  lastAnalysisDate?: number;
}

interface VirusTotalOptions {
  apiKey?: string;
  apiTier?: string;
  fetcher?: typeof fetch;
  timeoutMs?: number;
}

/** Lookup-only VirusTotal adapter. It refuses public-tier keys due to usage terms. */
export class VirusTotalClient {
  private readonly apiKey?: string;
  private readonly apiTier: string;
  private readonly fetcher: typeof fetch;
  private readonly timeoutMs: number;

  constructor(options: VirusTotalOptions = {}) {
    this.apiKey = options.apiKey ?? process.env.VIRUSTOTAL_API_KEY;
    this.apiTier = (options.apiTier ?? process.env.VIRUSTOTAL_API_TIER ?? "public").toLowerCase();
    this.fetcher = options.fetcher ?? fetch;
    this.timeoutMs = options.timeoutMs ?? 20_000;
  }

  async lookupUrl(input: string, externalProviderConsent: boolean): Promise<VirusTotalUrlReport> {
    if (!externalProviderConsent) throw new ProviderUnavailableError("VirusTotal lookup requires explicit external-provider consent.");
    if (this.apiTier !== "premium") {
      throw new ProviderUnavailableError("VirusTotal is disabled unless a premium-tier API license is configured.");
    }
    if (!this.apiKey) throw new ProviderUnavailableError("VirusTotal is not configured. Set VIRUSTOTAL_API_KEY on the server.");

    const normalizedUrl = validateLookupUrl(input);
    const id = Buffer.from(normalizedUrl, "utf8").toString("base64url");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.fetcher(`https://www.virustotal.com/api/v3/urls/${id}`, {
        headers: { "x-apikey": this.apiKey },
        signal: controller.signal,
      });
      if (!response.ok) throw new ProviderRequestError(`VirusTotal lookup failed with HTTP ${response.status}.`);
      const payload = await response.json() as {
        data?: { attributes?: { reputation?: unknown; last_analysis_stats?: unknown; last_analysis_date?: unknown } };
      };
      const attributes = payload.data?.attributes;
      if (!attributes || typeof attributes.reputation !== "number" || !isNumberRecord(attributes.last_analysis_stats)) {
        throw new ProviderRequestError("VirusTotal returned an invalid URL report.");
      }
      return {
        source: "VirusTotal",
        url: normalizedUrl,
        reputation: attributes.reputation,
        analysisStats: attributes.last_analysis_stats,
        lastAnalysisDate: typeof attributes.last_analysis_date === "number" ? attributes.last_analysis_date : undefined,
      };
    } catch (error) {
      if (error instanceof ProviderRequestError || error instanceof ProviderUnavailableError) throw error;
      if (controller.signal.aborted) throw new ProviderRequestError("VirusTotal lookup timed out.");
      throw new ProviderRequestError("VirusTotal lookup could not be completed.");
    } finally {
      clearTimeout(timeout);
    }
  }
}

function validateLookupUrl(value: string): string {
  let url: URL;
  try { url = new URL(value); } catch { throw new ProviderRequestError("VirusTotal lookup requires a valid HTTP or HTTPS URL."); }
  if (!(["http:", "https:"].includes(url.protocol)) || url.username || url.password || url.port) {
    throw new ProviderRequestError("VirusTotal lookup accepts only web URLs without credentials or custom ports.");
  }
  url.hash = "";
  return url.toString();
}

function isNumberRecord(value: unknown): value is Record<string, number> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value)
    && Object.values(value).every((entry) => typeof entry === "number"));
}
