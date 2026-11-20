import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { body, guard, owned, failure } from "@/lib/http";
export async function POST(req: Request) {
  try {
    const denied = await guard(req);
    if (denied) return denied;
    const b = await body(req);
    if (typeof b.id !== "string")
      return NextResponse.json({ error: "Site required" }, { status: 400 });
    const site = await owned(b.id);
    if (!site)
      return NextResponse.json(
        { error: "Management access required" },
        { status: 403 },
      );
    if (site.paid)
      return NextResponse.json(
        { error: "This site is already paid" },
        { status: 409 },
      );
    if (
      !process.env.STRIPE_SECRET_KEY ||
      !process.env.STRIPE_WEBHOOK_SECRET ||
      !process.env.APP_URL
    )
      return NextResponse.json(
        {
          error:
            "Payments are not available yet. Your draft is saved; no charge has been made.",
        },
        { status: 503 },
      );
    const checkout = await stripe().checkout.sessions.create(
      {
        mode: "payment",
        client_reference_id: site.id,
        metadata: { siteId: site.id },
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 1900,
              product_data: { name: "PolicyPilot — one site" },
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.APP_URL}/manage?id=${site.id}&payment=received`,
        cancel_url: `${process.env.APP_URL}/manage?id=${site.id}`,
      },
      { idempotencyKey: `purchase-${site.id}` },
    );
    return NextResponse.json({ url: checkout.url });
  } catch {
    return failure();
  }
}
