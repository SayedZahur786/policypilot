import test from "node:test";
import assert from "node:assert/strict";
import { demo, intakeSchema, kinds, type Intake } from "../lib/schema";
import { policy, html } from "../lib/policies";
import { authorized, hash, localMode } from "../lib/store";
for (const region of ["India", "US", "EU"] as const)
  for (const payments of ["Stripe", "Razorpay", "No payments"] as const)
    for (const refunds of [
      "14 days",
      "30 days",
      "No voluntary refunds",
    ] as const)
      test(`${region} / ${payments} / ${refunds}`, () => {
        const a: Intake = { ...demo, regions: [region], payments, refunds };
        const p = policy(a, "privacy");
        assert.equal(
          p.some((s) => s.heading === "European Union"),
          region === "EU",
        );
        assert.equal(
          p.some((s) => s.heading === "India"),
          region === "India",
        );
        assert.equal(
          p.some((s) => s.heading === "United States"),
          region === "US",
        );
        const r = policy(a, "refund")
          .map((s) => s.body)
          .join(" ");
        assert.match(r, /Mandatory|mandatory/);
        if (payments === "No payments") assert.match(r, /No payment/);
        else if (refunds !== "No voluntary refunds")
          assert.ok(r.includes(refunds));
        for (const k of kinds) assert.ok(policy(a, k).length >= 4);
      });
test("HTML output escapes untrusted names and processor text", () => {
  const out = html(
    {
      ...demo,
      name: "<script>alert(1)</script>",
      processors: "<img src=x onerror=alert(1)>",
    },
    "privacy",
    "2026-11-21",
  );
  assert.ok(!out.includes("<script>"));
  assert.ok(!out.includes("<img"));
  assert.ok(out.includes("&lt;script&gt;"));
});
test("rejects unsafe URL, empty regions and unconfirmed scope", () => {
  for (const a of [
    { ...demo, website: "javascript:alert(1)" },
    { ...demo, regions: [] },
    { ...demo, confirmed: false },
    { ...demo, email: "invalid" },
  ])
    assert.equal(intakeSchema.safeParse(a).success, false);
});
test("omits optional analytics when not collected", () => {
  assert.ok(
    !policy(demo, "privacy").some((s) =>
      s.body.includes("Usage analytics help"),
    ),
  );
  assert.ok(
    policy({ ...demo, data: ["Usage analytics"] }, "privacy").some((s) =>
      s.body.includes("Usage analytics help"),
    ),
  );
});
test("management capability rejects wrong key", () => {
  const site = {
    id: "a",
    slug: "a",
    keyHash: hash("secret-long-key"),
    answers: demo,
    published: null,
    paid: false,
    revision: 0,
    updated: "",
  };
  assert.equal(authorized(site, "wrong-key"), false);
  assert.equal(authorized(site, "secret-long-key"), true);
});
test("Vercel can never use local test payments", () => {
  const old = process.env.VERCEL;
  process.env.VERCEL = "1";
  process.env.POLICYPILOT_LOCAL = "1";
  assert.equal(localMode(), false);
  delete process.env.POLICYPILOT_LOCAL;
  if (old) process.env.VERCEL = old;
  else delete process.env.VERCEL;
});
