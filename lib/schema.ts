import { z } from "zod";
const text = z.string().trim().min(2).max(300);
export const intakeSchema = z.object({
  name: text.max(80),
  website: z
    .string()
    .url()
    .max(300)
    .refine((v) => /^https:\/\//.test(v), "Use an HTTPS website URL"),
  operator: text,
  address: text,
  email: z.string().email().max(200),
  product: z.enum(["SaaS", "Mobile app", "Digital downloads"]),
  regions: z
    .array(z.enum(["India", "US", "EU"]))
    .min(1)
    .max(3),
  data: z
    .array(z.enum(["Account details", "Usage analytics", "Customer content"]))
    .min(1)
    .max(3),
  processors: text.max(1500),
  transfers: text.max(1000),
  payments: z.enum(["Stripe", "Razorpay", "No payments"]),
  retention: z.enum(["30 days", "90 days", "365 days"]),
  refunds: z.enum(["14 days", "30 days", "No voluntary refunds"]),
  confirmed: z.literal(true),
});
export type Intake = z.infer<typeof intakeSchema>;
export const kinds = ["privacy", "terms", "refund"] as const;
export type Kind = (typeof kinds)[number];
export const titles: Record<Kind, string> = {
  privacy: "Privacy policy",
  terms: "Terms of service",
  refund: "Refund policy",
};
export const demo: Intake = {
  name: "Orbit Notes",
  website: "https://orbit-notes.test",
  operator: "Orbit Notes Studio (illustrative)",
  address: "Bengaluru, India (illustrative)",
  email: "privacy@orbit-notes.test",
  product: "SaaS",
  regions: ["India", "US", "EU"],
  data: ["Account details", "Customer content"],
  processors:
    "Vercel for application hosting; Neon for database storage; Stripe for payment processing.",
  transfers:
    "Application and database infrastructure in the United States. Appropriate contractual safeguards must be confirmed with each provider before publication.",
  payments: "Stripe",
  retention: "30 days",
  refunds: "14 days",
  confirmed: true,
};
