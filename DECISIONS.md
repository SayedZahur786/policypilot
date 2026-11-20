# Decisions
- 2026-11-21: Work exclusively in policypilot. The root ignore already excludes every folder except launch-kit; no root modification required.
- Use the shared launch kit as read-only source and copy its components. User-selected Vercel hosting takes precedence over Sites hosting.
- Primary scope is adult general-purpose SaaS. Outputs are drafts requiring factual and legal review; never claim compliance.
- Choose a real Playwright recording with system text-to-speech and large captions for the demo because the actual ten-question flow is the product. No promotional reconstruction is needed.
- Use capability-based management: a high-entropy recovery key exchanged for an HttpOnly session. Store hashes, never raw credentials. Keys are never accepted in URLs.
- Paid hosting unlocks only from a verified Stripe event; local simulation requires explicit local mode and cannot run on Vercel.
- Keep analytics disabled. Week-one counts come from durable site/payment records, not fabricated landing-page counters.
- GitHub authentication failed: existing CLI token is invalid. Repository creation/push requires renewed login.
