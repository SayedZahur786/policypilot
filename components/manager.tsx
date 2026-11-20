"use client";
import { useSyncExternalStore, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Site } from "@/lib/store";
import { type Kind, titles } from "@/lib/schema";
import { html } from "@/lib/policies";
import { PolicyDocument } from "./policy-document";
import { IntakeForm } from "./intake";
type PublicSite = Omit<Site, "keyHash">;
export function Login() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <form
      className="formcard"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        const f = new FormData(e.currentTarget);
        try {
          const r = await fetch("/api/session", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ id: f.get("id"), key: f.get("key") }),
          });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          router.push(`/manage?id=${d.id}`);
          router.refresh();
        } catch (e) {
          setError(e instanceof Error ? e.message : "Unable to open site");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>Welcome back.</h2>
      <p>
        Returning from checkout? Your secure session can be restored by
        refreshing this page.
      </p>
      <button
        type="button"
        className="btn secondary"
        onClick={() => router.refresh()}
      >
        Refresh my session
      </button>
      <p>
        Enter the site ID and recovery key saved when you created your policies.
        The key grants editing access: keep it private.
      </p>
      <label className="field">
        Site ID
        <input name="id" required maxLength={100} />
      </label>
      <label className="field">
        Recovery key
        <input name="key" type="password" required maxLength={100} />
      </label>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <button className="btn" disabled={busy}>
        {busy ? "Opening…" : "Open my policies"}
      </button>
      <p className="status">
        Starting fresh? <Link href="/create">Create a policy set</Link>
      </p>
    </form>
  );
}
export function Manager({
  site,
  local,
  payments,
}: {
  site: PublicSite;
  local: boolean;
  payments: boolean;
}) {
  const [kind, setKind] = useState<Kind>("privacy");
  const [edit, setEdit] = useState(false);
  const [hidden, setHidden] = useState(false);
  const savedKey = useSyncExternalStore(
    () => () => {},
    () => sessionStorage.getItem(`pp-key-${site.id}`) ?? "",
    () => "",
  );
  const key = hidden ? "" : savedKey;
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  async function pay(simulate = false) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(simulate ? "/api/local-payment" : "/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: site.id }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (d.url) window.location.assign(d.url);
      else router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Payment unavailable");
    } finally {
      setBusy(false);
    }
  }
  const date = site.updated.slice(0, 10);
  return (
    <>
      <div className="split">
        <span className="badge">
          {site.paid
            ? `Published · revision ${site.revision}`
            : "Draft · not published"}
        </span>
        <span className="small">Site ID: {site.id}</span>
      </div>
      {key && (
        <div className="notice status">
          <strong>Save your recovery key now.</strong>
          <p>
            Keep it in a password manager with your site ID. Anyone with this
            key can edit these policies.
          </p>
          <div className="key">{key}</div>
          <button
            className="btn secondary status"
            onClick={() => {
              sessionStorage.removeItem(`pp-key-${site.id}`);
              setHidden(true);
            }}
          >
            I saved it — hide key
          </button>
        </div>
      )}
      <div className="actions">
        {!site.paid && payments && (
          <button className="btn secondary" onClick={() => router.refresh()}>
            Refresh payment status
          </button>
        )}
        <button className="btn secondary" onClick={() => setEdit(!edit)}>
          {edit ? "Return to preview" : "Edit answers"}
        </button>
        {site.paid ? (
          <Link className="btn" href={`/s/${site.slug}`}>
            Open hosted policies
          </Link>
        ) : (
          <>
            {payments && (
              <button className="btn" disabled={busy} onClick={() => pay()}>
                Publish for $19
              </button>
            )}
            {local && (
              <button className="btn" disabled={busy} onClick={() => pay(true)}>
                Simulate payment locally
              </button>
            )}
          </>
        )}
      </div>
      {!site.paid && !payments && (
        <div className="notice">
          Payments are not configured. Your draft is saved; publishing will open
          after setup.
          {local
            ? " Local simulation is for testing only. No money is charged."
            : ""}
        </div>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {edit ? (
        <IntakeForm initial={site.answers} id={site.id} />
      ) : (
        <>
          <div className="tabs" aria-label="Policy preview">
            {(["privacy", "terms", "refund"] as Kind[]).map((k) => (
              <button
                className={k === kind ? "selected" : ""}
                key={k}
                onClick={() => {
                  setKind(k);
                  setCopied(false);
                }}
              >
                {titles[k]}
              </button>
            ))}
          </div>
          <div className="notice">
            Review draft: verify your practices, processors, transfer safeguards
            and regional requirements before using this document.
          </div>
          <PolicyDocument answers={site.answers} kind={kind} date={date} />
          <h2>Take the HTML with you.</h2>
          <p>Semantic HTML, with your input safely escaped.</p>
          <textarea
            className="code"
            readOnly
            aria-label="Policy HTML"
            value={html(site.answers, kind, date)}
          />
          <button
            className="btn secondary status"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  html(site.answers, kind, date),
                );
                setCopied(true);
              } catch {
                setError(
                  "Clipboard unavailable. Select and copy the HTML above.",
                );
              }
            }}
          >
            {copied ? "Copied HTML" : "Copy HTML"}
          </button>
        </>
      )}
    </>
  );
}
