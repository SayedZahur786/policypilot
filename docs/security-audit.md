# Security self-audit

Reviewer: implementation agent, 21 November 2026. This is a self-audit, not an independent security assessment. Checklist source: ../launch-kit/checklists/security.md.

| Item | Result and evidence |
| --- | --- |
| Protected entry points | PASS: site updates, checkout and local payment require a matching hashed capability; management pages disclose no data without the cookie. API tests prove signed-out update and checkout denial. Public policies expose only paid published answers. |
| Validation, SQL and uploads | PASS: shared Zod schema bounds fields and enums; origin and body-size checks precede processing. Tagged SQL parameters separate data from queries. HTML and React escape untrusted data. No upload path exists (not applicable). Versioned schema applied to the dedicated project. Runtime role has table DML privileges and schema usage, not schema ownership. |
| Secret handling | PASS: gitleaks source and history scans found no leaks; see validation.md. Recovery keys are random 256-bit values, stored as SHA-256 hashes. Raw keys are never URLs or server logs. Environment files, local data and build output are ignored. Preview and production should use separate Neon branches when preview deployments are enabled. |
| Rate limiting and payment authenticity | PASS: shared Postgres atomic counter limits mutations globally to 100/hour, independent of spoofable forwarded IP headers. This conservative global cap can be exhausted by another visitor; per-user fairness remains a limitation. DB failures fail closed. Signed webhook tests reject invalid signatures and wrong amounts; repeated receipts cannot republish. Checkout uses a server-defined USD 19 price and idempotency key. Stripe calls have a 10-second timeout. |
| Cookies, CSRF and redirects | PASS for implemented controls: HttpOnly, production Secure, SameSite cookies and seven-day browser expiry. Explicit origin checks reject foreign-origin mutations. Checkout redirect URLs use server-configured APP_URL; the browser cannot choose them. No CORS grants. Capability holders have the same single-site role. Recovery key revocation is currently operator-managed by changing key_hash; automatic lost-key recovery is absent. |
| Headers | PASS: deployed HTTPS header gate, including HSTS; see validation.md. CSP uses per-request nonces, restrictive object/base/frame rules, no production eval, and no third-party browser scripts. No iframe or upload capability is enabled. |
| Dependencies | npm audit found zero vulnerabilities after installation; frozen-install evidence is recorded in validation.md. ESLint 9 selected for current plugin compatibility; npm marks that major unsupported, so replace it when the plugins support ESLint 10. Runtime dependencies are current locked packages. |
| Policy/placeholder/performance gates | Exact automated outcomes in validation.md. Legal adequacy is NOT established by these checks. Private support contact, paid refund operations and professional clause review remain paid-launch blockers. |
| Errors, recovery and devices | Generic API failures reveal no stack trace or secrets. Global and route error boundaries allow retry. Browser tests cover desktop/mobile overflow, invalid requests, origin rejection, public sample, editing and publication. No claim of exhaustive assistive-technology testing. |

## Operational procedures
- Lost or compromised management key: verify ownership privately before rotating sites.key_hash to the SHA-256 hash of a newly generated 32-byte key. Existing cookies immediately fail authentication. Never accept a public issue containing a raw key.
- Deletion: after privately verifying ownership, delete payment_events rows for the site, then the sites row; revisions cascade. Retain legally required billing records at the payment provider, not in public documents. Private request handling must be established before paid launch.
- Recovery: Neon project has a six-hour history window on its present free-plan configuration. Restore into a separate branch and validate data before switching traffic. A full restore drill has not been performed and remains an operational launch task.
- Rate-limit maintenance: remove rate_limits rows older than two days during routine operations. Fixed hourly keys mean old rows do not affect current limits, but rows otherwise accumulate.

## Remaining limits
No independent penetration test, qualified legal review, actual Stripe checkout/refund, private support channel, or production restore drill has been completed. Paid commercial launch remains blocked. The site can be released honestly as a functional preview.
