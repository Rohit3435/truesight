import { expect, test } from "@playwright/test";

test("home page retains the TrueSight identity and links to scanning", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle(/TrueSight/);
  await expect(page.getByRole("link", { name: /start scan/i }).first()).toHaveAttribute("href", "/scan");
});

test("scan page exposes the supported Instagram and LinkedIn platforms", async ({ page }) => {
  await page.goto("/scan", { waitUntil: "domcontentloaded" });
  const platform = page.getByLabel("Platform");
  await expect(platform.locator("option[value='instagram']")).toHaveCount(1);
  await expect(platform.locator("option[value='linkedin']")).toHaveCount(1);
});
