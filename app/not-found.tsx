import Link from "next/link";
export default function Missing() {
  return (
    <div className="workspace">
      <div className="eyebrow">404 · A loose end</div>
      <h1>This page hasn’t landed.</h1>
      <p>
        The link may be incorrect, or the policy set has not been published.
      </p>
      <Link className="btn" href="/">
        Back to PolicyPilot
      </Link>
    </div>
  );
}
