import test from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import Stripe from "stripe";
import { demo } from "../lib/schema";
import { createSite, newKey, findSite } from "../lib/store";
import { POST } from "../app/api/webhook/route";
test("signed webhook publishes only the exact paid purchase and is idempotent", async () => {
  process.env.POLICYPILOT_LOCAL = "1";
  delete process.env.VERCEL;
  process.env.STRIPE_SECRET_KEY = randomBytes(24).toString("hex");
  process.env.STRIPE_WEBHOOK_SECRET = randomBytes(32).toString("hex");
  const client = new Stripe(process.env.STRIPE_SECRET_KEY);
  const site = await createSite(demo, newKey());
  async function send(amount: number, signed = true) {
    const payload = JSON.stringify({
      id: "evt_" + site.id,
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_" + site.id,
          payment_status: "paid",
          mode: "payment",
          currency: "usd",
          amount_total: amount,
          metadata: { siteId: site.id },
          client_reference_id: site.id,
        },
      },
    });
    const signature = signed
      ? client.webhooks.generateTestHeaderString({
          payload,
          secret: process.env.STRIPE_WEBHOOK_SECRET!,
        })
      : "invalid";
    return POST(
      new Request("http://localhost/api/webhook", {
        method: "POST",
        headers: { "stripe-signature": signature },
        body: payload,
      }),
    );
  }
  assert.equal((await send(1900, false)).status, 400);
  assert.equal((await send(1)).status, 200);
  assert.equal((await findSite(site.id))!.paid, false);
  assert.equal((await send(1900)).status, 200);
  assert.equal((await findSite(site.id))!.paid, true);
  await send(1900);
  assert.equal((await findSite(site.id))!.revision, 1);
});
