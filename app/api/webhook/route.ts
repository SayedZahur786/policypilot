import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { markPaid } from "@/lib/store";
export async function POST(req: Request) {
  if (!process.env.STRIPE_WEBHOOK_SECRET)
    return new NextResponse("Unavailable", { status: 503 });
  const raw = await req.text();
  if (raw.length > 65536) return new NextResponse("Too large", { status: 413 });
  let event;
  try {
    event = stripe().webhooks.constructEvent(
      raw,
      req.headers.get("stripe-signature") ?? "",
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }
  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const s = event.data.object;
      if (
        s.payment_status === "paid" &&
        s.mode === "payment" &&
        s.currency === "usd" &&
        s.amount_total === 1900 &&
        s.metadata?.siteId &&
        s.client_reference_id === s.metadata.siteId
      )
        await markPaid(s.metadata.siteId, s.id);
    }
    return NextResponse.json({ received: true });
  } catch {
    return new NextResponse("Retry later", { status: 503 });
  }
}
