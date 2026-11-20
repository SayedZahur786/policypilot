import { Login, Manager } from "@/components/manager";
import { owned } from "@/lib/http";
import { localMode, ready } from "@/lib/store";
export default async function Manage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  let site = null;
  try {
    if (id && ready()) site = await owned(id);
  } catch {}
  return (
    <div className="workspace">
      <div className="eyebrow">Your policy workspace</div>
      <h1>{site ? site.answers.name : "Good words, kept up to date."}</h1>
      {site ? (
        <Manager
          site={{
            id: site.id,
            slug: site.slug,
            answers: site.answers,
            published: site.published,
            paid: site.paid,
            revision: site.revision,
            updated: site.updated,
          }}
          local={localMode()}
          payments={Boolean(
            process.env.STRIPE_SECRET_KEY &&
            process.env.STRIPE_WEBHOOK_SECRET &&
            process.env.APP_URL,
          )}
        />
      ) : (
        <Login />
      )}
    </div>
  );
}
