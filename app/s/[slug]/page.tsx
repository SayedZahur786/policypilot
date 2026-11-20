import { notFound } from "next/navigation";
import Link from "next/link";
import { publicSite } from "@/lib/public-site";
import { kinds, titles } from "@/lib/schema";
export default async function Site({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await publicSite(slug);
  if (!site) notFound();
  return (
    <div className="workspace">
      <div className="eyebrow">Policy centre</div>
      <h1>{site.answers.name}</h1>
      <p>A clear home for privacy, terms and refunds.</p>
      {site.sample && (
        <p className="notice">
          Illustrative sample, not an actual customer. The reserved .test domain
          and contact are demonstration data.
        </p>
      )}
      <div className="cards section">
        {kinds.map((k) => (
          <Link key={k} className="card" href={`/s/${slug}/${k}`}>
            <span className="icon">▤</span>
            <h2>{titles[k]}</h2>
            <p>Read the full document</p>
          </Link>
        ))}
      </div>
      <p className="status small">
        Updated {site.date} · Prepared with PolicyPilot. Not legal advice.
      </p>
    </div>
  );
}
