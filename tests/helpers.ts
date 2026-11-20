import { type Page } from "@playwright/test";
export async function intake(page: Page) {
  await page.goto("/create");
  await page.getByLabel("App or business name").fill("Orbit Notes");
  await page.getByLabel("Website URL").fill("https://orbit-notes.test");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Legal operator name").fill("Orbit Notes Studio");
  await page.getByLabel("Business postal address").fill("Bengaluru, India");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Contact email").fill("privacy@orbit-notes.test");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  for (const name of ["India", "US", "EU"])
    await page.getByLabel(name, { exact: true }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel("Account details", { exact: true }).check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByLabel("Providers and purposes")
    .fill("Vercel hosting, Neon database and Stripe payments.");
  await page
    .getByLabel("Storage locations and transfer safeguards")
    .fill(
      "US infrastructure; verify appropriate contractual safeguards with providers.",
    );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByLabel(/I confirm/).check();
  await page.getByRole("button", { name: "Generate my drafts" }).click();
  await page.waitForURL("**/manage?id=*");
}
