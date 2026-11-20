import Link from "next/link";
export default function Home() {
  return (
    <div className="wrap">
      <section className="hero">
        <div>
          <div className="eyebrow">For the almost-ready-to-launch founder</div>
          <h1>
            Your app is ready.
            <br />
            Let’s get the
            <br />
            <em>fine print ready.</em>
          </h1>
          <p className="lede">
            Turn 10 answers into privacy, terms and refund policy drafts. Clear
            pages for your first paid app, all in one place.
          </p>
          <div className="actions">
            <Link className="btn" href="/create">
              Create my policies
            </Link>
            <Link className="btn secondary" href="/s/orbit-notes">
              Explore the sample
            </Link>
          </div>
          <p className="small">
            Preview first · $19 per site when payments open
          </p>
        </div>
        <div className="preview">
          <div className="browserbar">
            <i className="dot" />
            <i className="dot" />
            <i className="dot" />
            <span>policypilot / orbit-notes</span>
          </div>
          <div className="document">
            <div className="dochead">
              <strong>◉ Orbit Notes</strong>
              <span className="badge">Sample policy set</span>
            </div>
            <h3>
              Good ideas.
              <br />
              Clear policies.
            </h3>
            <p>A home for the details that matter.</p>
            <div className="docline" />
            <div className="docline short" />
            <div className="docline" />
            <br />
            {[
              ["privacy", "Privacy policy"],
              ["terms", "Terms of service"],
              ["refund", "Refund policy"],
            ].map(([k, t]) => (
              <Link className="doclink" key={k} href={`/s/orbit-notes/${k}`}>
                <span>{t}</span>
                <span>↗</span>
              </Link>
            ))}
          </div>
          <p className="footer-note">
            Illustrative SaaS · India, US and EU variants
          </p>
        </div>
      </section>
      <div className="trust">
        <span>✓ No legal jargon marathon</span>
        <span>✓ No AI-generated surprises</span>
        <span>✓ Your pages, your HTML</span>
      </div>
      <section className="section">
        <div className="sectionhead">
          <h2>
            One small step.
            <br />
            Three loose ends, tied up.
          </h2>
          <p>
            Built for solo founders who would rather be shipping. Start with
            your app, not a blank document.
          </p>
        </div>
        <div className="cards">
          <div className="card">
            <span className="icon">☷</span>
            <h3>Tell us what you’re building</h3>
            <p>
              Ten focused questions about your app, data, payments and
              customers. Plain language, all the way.
            </p>
          </div>
          <div className="card">
            <span className="icon">▤</span>
            <h3>Make the details yours</h3>
            <p>
              Review three structured drafts, with clauses selected for India,
              the US and the EU.
            </p>
          </div>
          <div className="card">
            <span className="icon">↗</span>
            <h3>Give your policies a home</h3>
            <p>
              Publish to clean URLs or copy the HTML. Change your answers and
              republish to the same links.
            </p>
          </div>
        </div>
      </section>
      <section className="pricing">
        <div>
          <div className="eyebrow">Simple scope. Clear price.</div>
          <h2>
            A launch expense.
            <br />
            Not a legal department.
          </h2>
          <p>
            Designed for adult, general-purpose apps. PolicyPilot is not a law
            firm, and drafts need your review.
          </p>
          <Link href="/privacy-policy-for-nextjs">
            Building with Next.js? Start here
          </Link>
        </div>
        <div>
          <span className="price">$19</span>{" "}
          <span className="muted">one time / site</span>
          <ul className="checklist">
            <li>Privacy, terms and refund policy drafts</li>
            <li>Hosted pages and copy-paste HTML</li>
            <li>Edit answers and republish</li>
          </ul>
          <p className="small">
            Planned optional maintenance: $5/month. Not available for purchase
            yet; no automatic legal updates are promised.
          </p>
          <Link className="btn" href="/create">
            Start with my app
          </Link>
        </div>
      </section>
      <section className="section">
        <h2>A little clarity before you start.</h2>
        <details className="faq">
          <summary>Is this legal advice?</summary>
          <p>
            No. PolicyPilot assembles drafts from a clause library. It does not
            guarantee compliance, replace a lawyer or implement the practices
            described in your policies.
          </p>
        </details>
        <details className="faq">
          <summary>Can I change my answers later?</summary>
          <p>
            Yes. Save your recovery key, reopen your site and update the
            answers. Paid sites republish at the same URL.
          </p>
        </details>
        <details className="faq">
          <summary>What is outside the scope?</summary>
          <p>
            Child-directed services, sensitive-data products and complex
            regulated businesses need specialist review. Cookie banners and
            data-request workflows are not included.
          </p>
        </details>
      </section>
    </div>
  );
}
