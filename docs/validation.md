# Validation evidence

Performed 21 November 2026. All counts below are test evidence, not customer traction.

| Check | Observed result |
| --- | --- |
| Frozen install | PASS: npm ci, 408 audited packages, zero reported vulnerabilities. |
| Unit and signature tests | PASS: 33 tests, including 27 region/payment/refund combinations, HTML escaping, input validation, capability checks, Vercel simulation denial and signed webhook amount/replay handling. |
| Lint and TypeScript | PASS: npm run lint and npm run typecheck. |
| Production build | PASS: npm run build (Next.js 16.4.6, Webpack). |
| Real Neon service | PASS: migration, create/read, ownership hash, draft privacy, publish, duplicate receipt, revision update, stable slug and atomic rate-limit checks. Temporary smoke records were removed. |
| Deployed service flow | PASS: HTTPS intake, secure HttpOnly/Strict session, management render and edit against Neon; signed-out write denied, checkout fails closed without keys, simulation returns 404, unpaid draft stays private. Temporary record removed. |
| Local browser flow | PASS: ten-question intake, local simulated purchase, hosted policy URL, edit/republish, signed-out denial, hostile origin, invalid input and real 404. Live Stripe purchase is not tested. |
| Screenshots | PASS: every main route at 1440px desktop and 390px mobile; no horizontal overflow. 24 committed PNGs including private workspace captures with recovery keys hidden. |
| Placeholder gate | PASS: launch-kit scanner over authored project files. |
| HTTPS header gate | PASS: /, /privacy and /terms, including HSTS, on https://policypilot-mauve.vercel.app . |
| Policy gate | PASS: distinct substantive rendered pages. Does not establish factual completeness or legal adequacy. |
| Cold performance gate | PASS: three LCP measurements 568, 608 and 540 ms; worst 608 ms, below 2500 ms. Mobile context, 4× CPU slowdown, 1.6 Mbps/150 ms network. Local lab evidence only. |
| Secret audit | PASS: gitleaks directory and Git-history scans with redaction. Local secrets/runtime data, dependency/build folders excluded; ignored-file boundary verified. |
| README animation | PASS: SVG embedded as an image produces different frames after 1.5 seconds in Chromium. GitHub-hosted rendering was not independently frame-compared. |
| Demo media | PASS: 63.148-second MP4, H.264 video and AAC narration. Audio mean -17.0 dB, peak -2.1 dB. Large captions visually inspected on the policy-centre frame. |

Performance runner used IS_WEBPACK_TEST=1 to select the same bundler as the production build; the shared gate script and measurement thresholds were unchanged. Turbopack failed under the local process sandbox. Initial browser failures (origin mismatch, streamed 404 and legal-page overflow) were fixed before the passing runs.

## Launch limitations
The preview is deployed. Commercial launch is not complete: live Stripe credentials and purchase/refund verification, a verified private operator contact, professional clause review, support/retention operations and a restore drill are still needed. Optional recurring maintenance is not offered. GitHub source is private pending an owner visibility/license decision.

Final verified Vercel deployment: dpl_6WyBsgaiA4edYBXUA8VW3WJvQSVU, aliased at https://policypilot-mauve.vercel.app . Production metric query after test cleanup: 0 generated, 0 paid, 0% conversion; goals remain 50, 10 and 20%.
