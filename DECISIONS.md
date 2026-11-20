# Decisions
- 2026-11-21: Work exclusively in policypilot. The root ignore already excludes every folder except launch-kit; no root modification required.
- Use the shared launch kit as read-only source and copy its components. User-selected Vercel hosting takes precedence over Sites hosting.
- Primary scope is adult general-purpose SaaS. Outputs are drafts requiring factual and legal review; never claim compliance.
- Choose a real Playwright recording with system text-to-speech and large captions for the demo because the actual ten-question flow is the product. No promotional reconstruction is needed.
- Use capability-based management: a high-entropy recovery key exchanged for an HttpOnly session. Store hashes, never raw credentials. Keys are never accepted in URLs.
- Paid hosting unlocks only from a verified Stripe event; local simulation requires explicit local mode and cannot run on Vercel.
- Keep analytics disabled. Week-one counts come from durable site/payment records, not fabricated landing-page counters.
- GitHub authentication succeeds when checked with network access. The earlier sandbox check was misleading; no renewed login is needed.

- Neon project long-tooth-90874557 created exclusively for PolicyPilot in org-sweet-wildflower-67376060 (existing Sayed organization), Singapore region. The CLI has no organization-create command; isolated project scope is preserved.
- Consulted project-local neon and neon-postgres skills. Keep the already implemented HTTP driver for short queries; migration uses the unpooled URL.
- Turbopack fails under this execution environment when its CSS worker binds a port. Webpack production build succeeds; use the supported --webpack option. For the kit performance runner, IS_WEBPACK_TEST=1 selects the same bundler without altering the shared script or measurements.

- Installed Neon guidance was consulted, then archived unchanged under node_modules/.consulted-neon-skills as a tooling dependency; its example content is not application source.

- GitHub public creation was rejected by automatic approval review for unspecified public visibility. Created private SayedZahur786/policypilot instead; public source and license remain owner decisions.
- Neon deploy completed; migration and real-database smoke tests passed. A restricted policypilot_app runtime role is configured separately from the migration owner.
- Source audit: gitleaks scans authored files and Git history; runtime secret files and dependency/build directories are excluded, then the Git ignore boundary is checked before push.

- Approval review rejected relaxing SameSite=Strict for Stripe return navigation. Retained Strict, added a same-origin session refresh action and a payment-status refresh; no cookie protection was relaxed.

- Vercel assigned https://policypilot-mauve.vercel.app; APP_URL and launch links use that exact origin. Deployed HTTPS smoke tests passed against real Neon, then removed their temporary records.
