import { expect, test } from "@playwright/test";

async function signInForScan(page: import("@playwright/test").Page) {
  const email = `browser-${Date.now()}-${Math.random().toString(36).slice(2)}@example.test`;
  const response = await page.request.post("/api/auth/signup", { data: { name: "Browser Test", email, password: "ValidPassword123" } });
  expect(response.ok()).toBeTruthy();
}

test("home page retains the TrueSight identity and links to scanning", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle(/TrueSight/);
  await expect(page.getByRole("link", { name: /start scan/i }).first()).toHaveAttribute("href", "/scan");
});

test("scan page exposes the supported Instagram and LinkedIn platforms", async ({ page }) => {
  await signInForScan(page);
  await page.goto("/scan", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  const platform = page.getByLabel("Platform");
  await expect(platform.locator("option[value='instagram']")).toHaveCount(1);
  await expect(platform.locator("option[value='linkedin']")).toHaveCount(1);
  await expect(page.getByText("Optional image evidence")).toBeVisible();
  await expect(page.locator("input[type=file]")).not.toHaveAttribute("required", "");
});

test("submitting pasted evidence produces only source-linked observations", async ({ page }) => {
  await signInForScan(page);
  await page.goto("/scan", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Username or profile URL").fill("sample_user");
  await page.getByLabel("Investigation mode").selectOption("combined");
  await page.getByLabel("Text evidence type").selectOption("caption");
  await page.getByLabel("Paste the relevant text").fill("A public caption #evidenceonly");
  await page.getByRole("checkbox").first().check();
  await expect(page.getByRole("checkbox").first()).toBeChecked();
  await page.getByRole("button", { name: "Start investigation" }).click();
  await expect(page.getByRole("heading", { name: "sample_user" })).toBeVisible({ timeout: 30_000 });
  await expect(page.getByText("#evidenceonly", { exact: false })).toBeVisible();
  await expect(page.getByText("Not called: required server configuration is missing.")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "sample_user" })).toBeVisible();
});

test("hr__rohit skills evidence runs independent agents and blocks missing provider success", async ({ page }) => {
  await signInForScan(page);
  await page.goto("/scan", { waitUntil: "domcontentloaded" });
  await page.waitForLoadState("networkidle");
  await page.getByLabel("Platform").selectOption("instagram");
  await page.getByLabel("Username or profile URL").fill("hr__rohit");
  await page.getByLabel("Investigation mode").selectOption("combined");
  await page.getByLabel("Text evidence type").selectOption("skills");
  await page.getByLabel("Paste the relevant text").fill("About person");
  await page.getByRole("checkbox").first().check();
  await page.getByRole("checkbox").nth(1).check();
  const responsePromise = page.waitForResponse((response) => response.url().includes("/api/investigations") && response.request().method() === "POST");
  await page.getByRole("button", { name: "Start investigation" }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(201);
  const payload = await response.json();
  const report = payload.report;
  expect(report.username).toBe("hr__rohit");
  expect(report.collection.attempted).toBe(false);
  expect(report.collection.failureReason).toMatch(/INSTAGRAM_ACCESS_TOKEN/);
  expect(report.status).toBe("partially_completed");
  expect(report.findings.some((finding: { observation: string }) => finding.observation.includes("not contain enough detail"))).toBeTruthy();
  expect(report.agents.find((agent: { agent: string }) => agent.agent === "professional-intelligence").status).toBe("completed");
  expect(report.agents.find((agent: { agent: string }) => agent.agent === "content-intelligence").status).toBe("completed");
  expect(report.agents.find((agent: { agent: string }) => agent.agent === "evidence-observation").status).toBe("skipped");
  await expect(page.getByRole("heading", { name: "hr__rohit" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Collection outcome" })).toBeVisible();
  await expect(page.getByText("Not called: required server configuration is missing.")).toBeVisible();
  await expect(page.getByText("partially completed", { exact: false }).first()).toBeVisible();
});
