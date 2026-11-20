import { test, expect } from "@playwright/test";
import { intake } from "./helpers";
for (const [name, width] of [
  ["desktop", 1440],
  ["mobile", 390],
] as const)
  test(`main routes ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const [label, route] of [
      ["home", "/"],
      ["intake", "/create"],
      ["manage", "/manage"],
      ["sample", "/s/orbit-notes"],
      ["privacy", "/s/orbit-notes/privacy"],
      ["terms", "/s/orbit-notes/terms"],
      ["refund", "/s/orbit-notes/refund"],
      ["legal-privacy", "/privacy"],
      ["legal-terms", "/terms"],
      ["guide", "/privacy-policy-for-nextjs"],
      ["404", "/missing-page"],
    ]) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBeTruthy();
      await page.screenshot({
        path: `docs/screenshots/${label}-${name}.png`,
        fullPage: true,
      });
    }
    await intake(page);
    await page.getByRole("button", { name: "I saved it — hide key" }).click();
    await page.screenshot({
      path: `docs/screenshots/preview-${name}.png`,
      fullPage: true,
    });
  });
