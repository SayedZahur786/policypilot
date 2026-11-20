# PolicyPilot implementation plan

## Customer and smallest lovable product
Primary persona: an adult solo developer launching a first paid, general-purpose SaaS for adults in India, the US or EU. Core job: turn a truthful description of the app into three readable policy drafts, review them, then publish and maintain one stable set of links. Exactly ten grouped questions cover identity, operator, contact, product, audience, data/purpose, processors/transfers, payments, retention and refunds. Unsupported sensitive-data or child-directed products require professional help.

The fixed scope is intake, deterministic clause generation, hosted privacy/terms/refund pages and HTML export, regional variants, and revision/republish. No cookie banner or rights-request workflow. Drafts are not legal advice or a compliance guarantee.

## Architecture
Next.js App Router, strict TypeScript, Tailwind. A pure typed clause library renders structured text, escaped by React and by the HTML exporter. Neon Postgres holds sites, immutable revisions, hashed management credentials, payment receipts and shared rate limits. Stripe Checkout handles $19 purchases; signed webhooks alone grant paid publishing. Optional $5 monthly maintenance is offered only when its price is configured. Local isolated file storage supports development and tests; never enabled on Vercel. No AI requests.

Routes: / landing; /create ten-step intake; /manage site editor using a session cookie; /s/[slug] policy index; /s/[slug]/[kind] public policies; /privacy, /terms; /privacy-policy-for-nextjs SEO guide. API: sites create/update, checkout, Stripe webhook, management session. Loading and validation states are explicit; missing infrastructure fails closed; empty management has a create action; unknown sites return 404.

## Research, checked 21 November 2026
- Termly: policies, hosted documents and consent management. Official pricing lists Free, Starter at $14/site/month and Pro+ at $20/site/month on monthly billing; annual Pro+ is $15/site/month. Promotional discounts are temporary. Sources: https://termly.io/pricing/ and https://www.reddit.com/r/webdev/comments/17vwx89/can_i_use_termly_to_generate_tcs_and_privacy/ . The latter contains an anecdotal complaint that a subscription is expensive for one-time use. Gap: explicit one-site purchase.
- iubenda: policy clause library and ongoing updates with broader consent tooling. Official pricing lists Essentials from $5.99/site/month when billed yearly and Advanced from $24.99/site/month when billed yearly; monthly amounts shown are $6.99 and $27.99 respectively. Advanced includes terms as well as privacy/cookie documents. https://www.iubenda.com/en/pricing/ . Subscription confusion appears in https://www.reddit.com/r/Blogging/comments/w3v5at/privacy_policy_termly_iubenda_monthly_subscription/ . Gap: ten questions and transparent bounded scope.
- TermsFeed: free simple documents, hosting and HTML export; premium one-time clause add-ons include $82 for privacy-law provisions and $24 for analytics at https://www.termsfeed.com/pricing/ . Developer questionnaire friction across these three providers is reported at https://www.reddit.com/r/SideProject/comments/1ryfc9t/i_spent_2_hours_generating_a_privacy_policy_for/ . This is anecdotal, not a representative satisfaction study. Gap: a predictable $19 bundle.

## Risk and cheapest test
The riskiest assumption is that ten questions collect enough truthful detail for a useful draft while customers accept the need for review. Before paid release, have a qualified reviewer inspect India/US/EU outputs, then observe five founders complete intake and ask whether they would actually pay $19. Do not infer legal sufficiency or demand from generated-site counts.

## Delivery sequence
1. Isolate repo, establish infrastructure access and decision log.
2. Implement pure clause library, validation, storage, checkout and ownership controls.
3. Build accessible polished landing, intake, preview, hosted and edit flows.
4. Test clauses, authorization, payments and production browser paths; run all kit gates.
5. Capture screenshots and a narrated real-browser video; document launch, limits and handoff.
