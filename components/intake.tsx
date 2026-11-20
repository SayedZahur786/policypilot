"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { intakeSchema, type Intake } from "@/lib/schema";
const labels = [
  "Your app",
  "The operator",
  "Contact details",
  "Product type",
  "Your customers",
  "Data you collect",
  "Service providers",
  "Payments",
  "Data retention",
  "Refunds & review",
];
const empty = {
  name: "",
  website: "",
  operator: "",
  address: "",
  email: "",
  product: "SaaS",
  regions: [],
  data: [],
  processors: "",
  transfers: "",
  payments: "Stripe",
  retention: "30 days",
  refunds: "14 days",
  confirmed: false,
};
export function IntakeForm({ initial, id }: { initial?: Intake; id?: string }) {
  const [a, setA] = useState<Record<string, unknown>>(initial ?? empty);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  function set(k: string, v: unknown) {
    setA({ ...a, [k]: v });
  }
  function field(k: string, label: string, type = "text") {
    return (
      <label className="field">
        {label}
        <input
          required
          type={type}
          value={String(a[k])}
          maxLength={300}
          onChange={(e) => set(k, e.target.value)}
        />
      </label>
    );
  }
  function choices(k: string, values: string[]) {
    return values.map((v) => (
      <label className="choice" key={v}>
        <input
          type="checkbox"
          checked={(a[k] as string[]).includes(v)}
          onChange={(e) =>
            set(
              k,
              e.target.checked
                ? [...(a[k] as string[]), v]
                : (a[k] as string[]).filter((x) => x !== v),
            )
          }
        />
        {v}
      </label>
    ));
  }
  function select(k: string, label: string, values: string[]) {
    return (
      <label className="field">
        {label}
        <select value={String(a[k])} onChange={(e) => set(k, e.target.value)}>
          {values.map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
    );
  }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (step === 4 && !(a.regions as string[]).length) {
      setError("Choose at least one region.");
      return;
    }
    if (step === 5 && !(a.data as string[]).length) {
      setError("Choose at least one data category.");
      return;
    }
    if (step < 9) {
      setStep(step + 1);
      return;
    }
    const parsed = intakeSchema.safeParse(a);
    if (!parsed.success) {
      setError(
        parsed.error.issues
          .map((x) => x.path.join(".") + ": " + x.message)
          .join(" · "),
      );
      return;
    }
    setBusy(true);
    try {
      const r = await fetch(id ? `/api/sites/${id}` : "/api/sites", {
        method: id ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error);
      if (data.key) sessionStorage.setItem(`pp-key-${data.id}`, data.key);
      router.push(`/manage?id=${id ?? data.id}`);
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not save. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="stepgrid">
      <aside>
        <ol className="steps">
          {labels.map((l, i) => (
            <li className={step === i ? "active" : ""} key={l}>
              {i + 1}. {l}
            </li>
          ))}
        </ol>
      </aside>
      <form className="formcard" onSubmit={submit}>
        <div className="eyebrow">Question {step + 1} of 10</div>
        <h2>{labels[step]}</h2>
        {step === 0 && (
          <>
            <p>Give these policies a name and a home.</p>
            {field("name", "App or business name")}
            {field("website", "Website URL", "url")}
          </>
        )}
        {step === 1 && (
          <>
            <p>
              Use the actual person or legal entity responsible for the app.
              These details appear publicly.
            </p>
            {field("operator", "Legal operator name")}
            {field("address", "Business postal address")}
          </>
        )}
        {step === 2 && (
          <>
            <p>
              A real, monitored inbox for privacy and refund requests. This
              address will be public.
            </p>
            {field("email", "Contact email", "email")}
          </>
        )}
        {step === 3 && (
          <>
            <p>This version is for adult, general-purpose products.</p>
            {select("product", "What are you shipping?", [
              "SaaS",
              "Mobile app",
              "Digital downloads",
            ])}
          </>
        )}
        {step === 4 && (
          <>
            <p>Where do you serve customers? Select every relevant region.</p>
            {choices("regions", ["India", "US", "EU"])}
          </>
        )}
        {step === 5 && (
          <>
            <p>
              Select what you actually collect. Sensitive data and
              child-directed services are outside this version’s scope.
            </p>
            {choices("data", [
              "Account details",
              "Usage analytics",
              "Customer content",
            ])}
          </>
        )}
        {step === 6 && (
          <>
            <p>
              Name your actual providers, their purposes and where they process
              information. Verify transfer safeguards with them.
            </p>
            <label className="field">
              Providers and purposes
              <textarea
                required
                maxLength={1500}
                value={String(a.processors)}
                onChange={(e) => set("processors", e.target.value)}
              />
            </label>
            <label className="field">
              Storage locations and transfer safeguards
              <textarea
                required
                maxLength={1000}
                value={String(a.transfers)}
                onChange={(e) => set("transfers", e.target.value)}
              />
            </label>
          </>
        )}
        {step === 7 && (
          <>
            <p>Card details stay with your payment processor.</p>
            {select("payments", "Payment provider", [
              "Stripe",
              "Razorpay",
              "No payments",
            ])}
          </>
        )}
        {step === 8 && (
          <>
            <p>
              Choose a period you can actually implement after account closure.
              Legal recordkeeping exceptions are explained in the draft.
            </p>
            {select("retention", "Delete or anonymize account data within", [
              "30 days",
              "90 days",
              "365 days",
            ])}
          </>
        )}
        {step === 9 && (
          <>
            {select("refunds", "Voluntary refund window", [
              "14 days",
              "30 days",
              "No voluntary refunds",
            ])}
            <div className="notice">
              Mandatory consumer rights still apply. Review all three drafts
              before publishing. Selecting a policy does not implement it in
              your app.
            </div>
            <label className="choice">
              <input
                required
                type="checkbox"
                checked={Boolean(a.confirmed)}
                onChange={(e) => set("confirmed", e.target.checked)}
              />
              I confirm these answers describe an adult, non-sensitive-data
              product. I will review the drafts; this is not legal advice.
            </label>
          </>
        )}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="formnav">
          {step > 0 ? (
            <button
              className="btn secondary"
              type="button"
              onClick={() => {
                setStep(step - 1);
                setError("");
              }}
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <button className="btn" disabled={busy}>
            {busy
              ? "Saving…"
              : step < 9
                ? "Continue"
                : id
                  ? "Save and republish"
                  : "Generate my drafts"}
          </button>
        </div>
      </form>
    </div>
  );
}
