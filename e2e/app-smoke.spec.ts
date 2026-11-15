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
  await expect(page.locator("section").filter({ hasText: "Collection outcome" }).getByRole("listitem").first()).toContainText("Instagram collection was attempted");
  await page.reload();
  await expect(page.getByRole("heading", { name: "sample_user" })).toBeVisible();
});
