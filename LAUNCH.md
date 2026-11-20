# PolicyPilot release and launch

## Release status
Functional preview; paid launch is blocked. Live target: https://policypilot-mauve.vercel.app . Repository: https://github.com/SayedZahur786/policypilot (private). No live purchase or revenue is claimed. The $5/month maintenance offer is deferred until an actual ongoing update/review service is defined.

## HUMAN NEEDED
1. Configure the business's Stripe account and live/test keys. Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in Vercel production, register /api/webhook for checkout.session.completed and checkout.session.async_payment_succeeded, then run an actual Stripe test-mode purchase/refund before enabling live charges.
2. Supply a verified private support/privacy contact and business details for PolicyPilot itself; approve the actual refund/support process. Current public legal pages accurately describe a preview and link the maintainer profile, which is not a substitute for private support.
3. Have a qualified professional review the generated regional clauses and ten-question coverage before selling them. Resolve the unsupported analytics-consent and transfer details for each real product; this generator does not implement them.
4. Choose a source license and approve public repository visibility if desired. Automatic approval review rejected public creation because visibility was not explicitly authorized. The repository was safely created private.
5. Post the launch drafts after the paid-release blockers are resolved. Add a link from Launchcheck through its owning project; this task is restricted to the PolicyPilot folder and does not modify that project.

## Infrastructure and deployment
Dedicated Neon project: long-tooth-90874557. Organization: org-sweet-wildflower-67376060. Production branch: br-damp-cake-bib5tphj, Singapore. The organization already existed; the CLI exposes no organization-create command. No other app shares this project.

```sh
npx neon@latest init -y --org-id org-sweet-wildflower-67376060 --project-id long-tooth-90874557 --branch production --services postgres --no-agent-setup
npx neon@latest deploy
npm run db:migrate
npm run build
vercel --prod
```

`neon deploy` pulls owner environment variables. Use DATABASE_URL_UNPOOLED for migrations; use the restricted policypilot_app role for runtime DATABASE_URL. Do not overwrite the Vercel runtime role with the owner connection after a subsequent env pull. Environment values belong only in ignored local files or Vercel secrets. APP_URL must match the final canonical deployment origin. Stripe keys remain absent until provided by the owner.

## Week-one metrics
Targets, not results:
- 50 distinct sites generated: count sites.created in the first seven days.
- 10 paid sites: count distinct sites with a verified payment_events receipt in those seven days. This avoids counting duplicate webhook events.
- 20% generated-to-paid conversion: paid distinct sites divided by generated sites in that cohort.

Run `node --env-file=.env.local --import tsx scripts/metrics.ts` for the last seven days. Local simulation records are stored separately and excluded from production counts. No visitor tracking or consent analytics is enabled.

## Launch drafts, adapted from the shared launch-post template
Do not post until the release status is accurately reflected.

### X thread
1/ PolicyPilot: ten answers into privacy, terms and refund policy drafts for your first paid app.
2/ The last three links in your footer should not start with a blank document. Describe your data, providers and customers in one focused intake.
3/ Review India, US and EU clause variants, copy the HTML, and maintain hosted pages at stable URLs.
4/ This is a preview, not legal advice. Paid checkout is not open yet. Try the sample: https://policypilot-mauve.vercel.app — which question needs more explanation?

### LinkedIn
I built PolicyPilot around a small launch-day problem: the app works, but the privacy, terms and refund links are still missing.

Ten grouped answers generate three reviewable drafts, with regional variants, copyable HTML and a stable hosted policy flow. The clause library is deterministic, so there is no AI request in the generation path.

This is a functional preview, not legal advice or a compliance guarantee. Live payments and professional clause review are still pending. Explore the sample at https://policypilot-mauve.vercel.app and tell me where the intake needs to be clearer.

### Show HN
Title: Show HN: PolicyPilot – Policy drafts from ten answers
URL: https://policypilot-mauve.vercel.app

I built this for the launch-day gap between finishing an app and writing its legal pages. It generates privacy, terms and refund drafts, exports HTML and maintains hosted policy URLs.

Implementation: Next.js, typed clause selection, Neon revisions and signed Stripe payment events. No AI requests. The preview is usable, but live checkout and professional legal review are pending. I would value feedback on which app practices cannot be captured honestly in ten grouped questions.

### Indie communities
I’m testing a narrow workflow for solo founders: answer ten questions, review three policy drafts, then keep one set of stable links as the app changes. PolicyPilot is currently a preview with an illustrative sample. No compliance promise, no fake traction. Would a $19 one-site bundle be useful after professional review? https://policypilot-mauve.vercel.app

### SEO and Launchcheck
The implemented guide is /privacy-policy-for-nextjs. It explains data flows and actual providers before linking to intake. Avoid mass-generated regional SEO pages until their legal coverage is reviewed. Proposed Launchcheck link text: “Draft your app’s privacy, terms and refund policies with PolicyPilot.” No external posting or other-project edits were performed.
