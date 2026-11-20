import { demo } from "./schema";
import { findSite, ready } from "./store";
export async function publicSite(slug: string) {
  if (slug === "orbit-notes")
    return { answers: demo, date: "2026-11-21", sample: true };
  if (!ready()) return null;
  const site = await findSite(slug);
  return site?.paid && site.published
    ? {
        answers: site.published,
        date: site.updated.slice(0, 10),
        sample: false,
      }
    : null;
}
