import { type Intake, type Kind, titles } from "./schema";
export type Section = { heading: string; body: string };
export function policy(a: Intake, kind: Kind): Section[] {
  const contact = `Contact ${a.operator} at ${a.email}. Our business address is ${a.address}.`;
  const common = [
    {
      heading: "About this document",
      body: `This document describes ${a.name}, a ${a.product} available at ${a.website}. ${contact}`,
    },
  ];
  if (kind === "privacy")
    return [
      ...common,
      {
        heading: "Information we collect and why",
        body: `We collect ${a.data.join(", ").toLowerCase()}. Account details support access and customer communication.${a.data.includes("Usage analytics") ? " Usage analytics help us understand performance and improve the service. Optional tracking requires any consent applicable to your region." : ""}${a.data.includes("Customer content") ? " Customer content is processed to deliver the features you request." : ""} We do not sell personal information or use it for cross-context behavioral advertising under this policy.`,
      },
      {
        heading: "Payments and service providers",
        body: `${a.payments === "No payments" ? "The service does not collect payments." : `Payments are processed by ${a.payments}; we do not store full payment-card numbers.`} Service providers: ${a.processors} Providers receive information needed for their services.`,
      },
      { heading: "Storage and international transfers", body: a.transfers },
      {
        heading: "Retention and security",
        body: `We retain account information while your account is active, then delete or anonymize it within ${a.retention} after account closure unless a legal obligation requires retention. Payment providers may retain their own transaction records under their policies. We use access controls and reasonable technical safeguards; no internet service can promise absolute security.`,
      },
      {
        heading: "Cookies and choices",
        body: `Essential storage may be needed for authentication and security.${a.data.includes("Usage analytics") ? " Optional analytics must not run before consent where required. You can withdraw that consent through the controls supplied by the service." : " We do not use optional analytics under this policy."} Contact us to request access, correction or deletion. We may verify your identity before acting.`,
      },
      ...(a.regions.includes("EU")
        ? [
            {
              heading: "European Union",
              body: `Processing necessary to deliver requested services relies on contract; legal recordkeeping relies on legal obligations. Optional analytics relies on consent. Where applicable you may request access, rectification, erasure, restriction and portability, object to processing, withdraw consent, and complain to your local supervisory authority. International-transfer safeguards and any required representative must be reviewed for your circumstances.`,
            },
          ]
        : []),
      ...(a.regions.includes("US")
        ? [
            {
              heading: "United States",
              body: `Depending on your state and applicable thresholds, you may have rights to know, access, correct or delete personal information and appeal a refused request. We do not discriminate against you for exercising applicable rights. We do not sell or share personal information for targeted advertising under this policy. Contact us to submit a request or appeal.`,
            },
          ]
        : []),
      ...(a.regions.includes("India")
        ? [
            {
              heading: "India",
              body: `You may contact us to request information about processing, correction, erasure, withdrawal of consent or grievance resolution. Rights under the Digital Personal Data Protection framework apply as relevant provisions commence; this document does not claim that all provisions are already in force. Contact ${a.email} for grievances and nomination requests where applicable.`,
            },
          ]
        : []),
      {
        heading: "Audience and changes",
        body: `This service is intended for adults, not children. Do not submit sensitive health, biometric, financial-account or identity-document information. We will publish material changes here with a revised effective date and provide additional notice where required.`,
      },
    ];
  if (kind === "terms")
    return [
      ...common,
      {
        heading: "Agreement and eligibility",
        body: `By using ${a.name}, you agree to these terms. You must be an adult able to enter a contract. Keep your account credentials secure and provide accurate information.`,
      },
      {
        heading: "Acceptable use",
        body: "Do not use the service unlawfully, infringe others’ rights, distribute malware, attempt unauthorized access or interfere with service availability. You remain responsible for content you submit.",
      },
      {
        heading: "Your content and our service",
        body: "You retain ownership of your content and give us permission to process it only to operate the service. The application and its original materials remain the property of their respective owners.",
      },
      {
        heading: "Payment and cancellation",
        body:
          a.payments === "No payments"
            ? "No payments are collected for this service."
            : `Prices, billing frequency and any taxes are disclosed before purchase. Payments are processed by ${a.payments}. Cancel renewal before the next billing date through the payment controls or by contacting us. See our separate refund policy.`,
      },
      {
        heading: "Availability and responsibility",
        body: "We aim to provide a reliable service but cannot guarantee uninterrupted availability. To the extent permitted by law, the service is provided as available. Nothing in these terms excludes liability or consumer rights that cannot lawfully be excluded.",
      },
      {
        heading: "Termination and disputes",
        body: `You may stop using the service and request account deletion. We may restrict access for material misuse, with notice where practicable. Contact us first to resolve disputes. Mandatory consumer protections and jurisdiction rights continue to apply; these terms do not waive them.`,
      },
      {
        heading: "Changes and contact",
        body: `Material changes will be published here with a new effective date. ${contact}`,
      },
    ];
  return [
    ...common,
    {
      heading: "Refund eligibility",
      body:
        a.payments === "No payments"
          ? "No payment is collected, so there is no purchase to refund."
          : a.refunds === "No voluntary refunds"
            ? "We do not offer voluntary change-of-mind refunds. Mandatory consumer remedies, including remedies for defective or misdescribed services, remain available."
            : `You may request a refund within ${a.refunds} of purchase. Include your receipt reference and the email used for the purchase; never send full card details.`,
    },
    {
      heading: "How to request a refund",
      body: `Send your request to ${a.email}. We will acknowledge it and explain eligibility and the next steps. Approved refunds go to the original payment method; bank processing time varies.`,
    },
    {
      heading: "Cancellation and statutory rights",
      body: "Canceling a subscription stops future renewals; it does not itself issue a refund. Any applicable withdrawal rights and mandatory consumer remedies override this voluntary policy. For EU digital products, any loss of withdrawal rights requires the legally required express consent and acknowledgment, not merely this policy.",
    },
    { heading: "Contact", body: contact },
  ];
}
export function escapeHtml(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
}
export function html(a: Intake, k: Kind, date: string) {
  return `<article><h1>${titles[k]}</h1><p>Effective date: ${escapeHtml(date)}</p>${policy(
    a,
    k,
  )
    .map(
      (s) =>
        `<section><h2>${escapeHtml(s.heading)}</h2><p>${escapeHtml(s.body)}</p></section>`,
    )
    .join("")}</article>`;
}
