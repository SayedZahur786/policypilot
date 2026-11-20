import { notFound } from "next/navigation";
import Link from "next/link";
import { publicSite } from "@/lib/public-site";
import { kinds, type Kind, titles } from "@/lib/schema";
import { PolicyDocument } from "@/components/policy-document";
export default async function Policy({
  params,
}: {
  params: Promise<{ slug: string; kind: string }>;
}) {
  const { slug, kind } = await params;
  if (!kinds.includes(kind as Kind)) notFound();
  const site = await publicSite(slug);
  if (!site) notFound();
  return (
    <>
      <div className="workspace">
        <Link href={`/s/${slug}`}>All {site.answers.name} policies</Link>
        {site.sample && (
          <p className="notice status">
            Illustrative sample. Review required; not legal advice.
          </p>
        )}
        <nav className="tabs">
          {kinds.map((k) => (
            <Link
              key={k}
              className={k === kind ? "selected" : ""}
              href={`/s/${slug}/${k}`}
            >
              {titles[k]}
            </Link>
          ))}
        </nav>
      </div>
      <PolicyDocument
        answers={site.answers}
        kind={kind as Kind}
        date={site.date}
      />
    </>
  );
}
