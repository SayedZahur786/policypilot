import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Analytics } from "@/components/analytics";
import { ErrorBoundary } from "@/components/error-boundary";
import "./globals.css";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3417"),
  title: {
    default: "PolicyPilot — Your launch, in good words.",
    template: "%s | PolicyPilot",
  },
  description:
    "Ten questions. Three clear policy drafts. Privacy, terms and refunds for your first paid app.",
  openGraph: {
    title: "PolicyPilot — Your launch, in good words.",
    description:
      "Ten questions. Three policy drafts. One less thing between you and launch.",
    images: ["/og.png"],
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header
          name="PolicyPilot"
          links={[
            { href: "/s/orbit-notes", label: "See a sample" },
            { href: "/manage", label: "My policies" },
            { href: "/create", label: "Get started" },
          ]}
        />
        <ErrorBoundary>
          <main id="main">{children}</main>
        </ErrorBoundary>
        <Analytics consent={false} />
        <Footer name="PolicyPilot" year={2026} />
      </body>
    </html>
  );
}
