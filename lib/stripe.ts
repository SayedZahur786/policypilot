import Stripe from "stripe";
export function stripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Payments unavailable");
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    timeout: 10000,
    maxNetworkRetries: 1,
  });
}
