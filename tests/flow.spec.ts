import { test, expect } from "@playwright/test";
import { intake } from "./helpers";
import { demo } from "../lib/schema";
test("ten answers → local simulated purchase → hosted URL → update", async ({
  page,
  request,
}) => {
  await intake(page);
  await expect(page.getByText("Draft · not published")).toBeVisible();
  const id = new URL(page.url()).searchParams.get("id")!;
  const denied = await request.put(`/api/sites/${id}`, {
    headers: { origin: "http://127.0.0.1:3417" },
    data: demo,
  });
  expect(denied.status()).toBe(403);
  const cross = await page.request.put(`/api/sites/${id}`, {
    headers: { origin: "https://hostile.test" },
    data: demo,
  });
  expect(cross.status()).toBe(403);
  await page.getByRole("button", { name: "I saved it — hide key" }).click();
  await page.getByRole("button", { name: "Simulate payment locally" }).click();
  await expect(page.getByText("Published · revision 1")).toBeVisible();
  const hosted = await page
    .getByRole("link", { name: "Open hosted policies" })
    .getAttribute("href");
  await page.getByRole("button", { name: "Edit answers" }).click();
  await page.getByLabel("App or business name").fill("Orbit Notes Updated");
  for (let n = 0; n < 9; n++)
    await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Save and republish" }).click();
  await expect(
    page.getByRole("heading", { name: "Orbit Notes Updated", exact: true }),
  ).toBeVisible();
  await page.goto(hosted + "/privacy");
  await expect(
    page.getByRole("heading", { name: "Privacy policy", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Orbit Notes Updated", { exact: true }),
  ).toBeVisible();
});
test("invalid input, missing authentication and webhook failures", async ({
  request,
}) => {
  expect(
    (
      await request.post("/api/sites", {
        headers: { origin: "http://127.0.0.1:3417" },
        data: { name: "bad" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/checkout", {
        headers: { origin: "http://127.0.0.1:3417" },
        data: { id: "unknown" },
      })
    ).status(),
  ).toBe(403);
  expect((await request.post("/api/webhook", { data: {} })).status()).toBe(503);
  expect((await request.get("/s/not-published/privacy")).status()).toBe(404);
});
