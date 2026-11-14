import assert from "node:assert/strict";
import test from "node:test";
import { VirusTotalClient } from "../src/lib/osint/virustotal.ts";
import { UrlScanClient } from "../src/lib/osint/urlscan.ts";
import { ProviderUnavailableError } from "../src/lib/providers/types.ts";

test("VirusTotal lookup requires consent and an explicit premium tier", async () => {
  let calls = 0;
  const client = new VirusTotalClient({ apiKey: "key", apiTier: "public", fetcher: async () => { calls += 1; } });
  await assert.rejects(client.lookupUrl("https://example.com", true), ProviderUnavailableError);
  const premium = new VirusTotalClient({ apiKey: "key", apiTier: "premium", fetcher: async () => { calls += 1; } });
  await assert.rejects(premium.lookupUrl("https://example.com", false), ProviderUnavailableError);
  assert.equal(calls, 0);
});

test("VirusTotal performs a lookup and preserves reputation statistics", async () => {
  let captured;
  const client = new VirusTotalClient({
    apiKey: "test-key",
    apiTier: "premium",
    fetcher: async (url, options) => {
      captured = { url, headers: options.headers };
      return Response.json({ data: { attributes: {
        reputation: -2,
        last_analysis_stats: { harmless: 78, malicious: 2, suspicious: 1 },
        last_analysis_date: 1_700_000_000,
      } } });
    },
  });
  const report = await client.lookupUrl("https://example.com/path#fragment", true);
  assert.equal(captured.headers["x-apikey"], "test-key");
  assert.ok(captured.url.startsWith("https://www.virustotal.com/api/v3/urls/"));
  assert.equal(report.url, "https://example.com/path");
  assert.equal(report.analysisStats.malicious, 2);
});

test("URLScan requires consent, rejects local targets, and submits private visibility", async () => {
  let calls = 0;
  const client = new UrlScanClient({
    apiKey: "test-key",
    fetcher: async (_url, options) => {
      calls += 1;
      const body = JSON.parse(options.body);
      assert.equal(options.headers["API-Key"], "test-key");
      assert.equal(body.visibility, "private");
      return Response.json({ uuid: "12345678-1234-1234-1234-123456789012", result: "https://urlscan.io/result/12345678-1234-1234-1234-123456789012/" });
    },
  });
  await assert.rejects(client.submitPrivateScan("https://example.com", false), ProviderUnavailableError);
  await assert.rejects(client.submitPrivateScan("https://127.0.0.1/", true), /public DNS hostnames/);
  await assert.rejects(client.submitPrivateScan("https://internal.local/", true), /public DNS hostnames/);
  assert.equal(calls, 0);
  const submission = await client.submitPrivateScan("https://example.com/path#fragment", true);
  assert.equal(submission.visibility, "private");
  assert.equal(submission.status, "submitted");
  assert.equal(calls, 1);
});
