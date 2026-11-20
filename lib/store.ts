import { neon } from "@neondatabase/serverless";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Intake } from "./schema";
export type Site = {
  id: string;
  slug: string;
  keyHash: string;
  answers: Intake;
  published: Intake | null;
  paid: boolean;
  revision: number;
  updated: string;
};
type State = {
  sites: Site[];
  events: string[];
  limits: Record<string, { count: number; expires: number }>;
};
export const localMode = () =>
  process.env.POLICYPILOT_LOCAL === "1" && !process.env.VERCEL;
export const ready = () => Boolean(process.env.DATABASE_URL) || localMode();
export const hash = (s: string) => createHash("sha256").update(s).digest("hex");
export const newKey = () => randomBytes(32).toString("base64url");
export function authorized(site: Site, key: string) {
  const a = Buffer.from(site.keyHash);
  const b = Buffer.from(hash(key));
  return a.length === b.length && timingSafeEqual(a, b);
}
const file = path.join(process.cwd(), ".local", "data.json");
let queue: Promise<unknown> = Promise.resolve();
async function local<T>(fn: (s: State) => T | Promise<T>): Promise<T> {
  const result = queue.then(async () => {
    await fs.mkdir(path.dirname(file), { recursive: true });
    let s: State = { sites: [], events: [], limits: {} };
    try {
      s = JSON.parse(await fs.readFile(file, "utf8"));
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== "ENOENT") throw e;
    }
    const out = await fn(s);
    await fs.writeFile(file, JSON.stringify(s), { mode: 0o600 });
    return out;
  });
  queue = result.catch(() => {});
  return result;
}
function sql() {
  if (!process.env.DATABASE_URL) throw new Error("Database unavailable");
  return neon(process.env.DATABASE_URL);
}
function row(r: Record<string, unknown>): Site {
  return {
    id: String(r.id),
    slug: String(r.slug),
    keyHash: String(r.key_hash),
    answers: r.answers as Intake,
    published: r.published as Intake | null,
    paid: Boolean(r.paid),
    revision: Number(r.revision),
    updated: String(r.updated),
  };
}
export async function findSite(id: string): Promise<Site | null> {
  if (localMode())
    return local(
      (s) => s.sites.find((x) => x.id === id || x.slug === id) ?? null,
    );
  const rows =
    await sql()`SELECT * FROM sites WHERE id=${id} OR slug=${id} LIMIT 1`;
  return rows[0] ? row(rows[0]) : null;
}
export async function createSite(answers: Intake, key: string) {
  const id = randomBytes(12).toString("hex");
  const slug =
    answers.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) +
    "-" +
    id.slice(0, 8);
  const site: Site = {
    id,
    slug,
    keyHash: hash(key),
    answers,
    published: null,
    paid: false,
    revision: 0,
    updated: new Date().toISOString(),
  };
  if (localMode())
    return local((s) => {
      s.sites.push(site);
      return site;
    });
  await sql()`INSERT INTO sites(id,slug,key_hash,answers) VALUES(${id},${slug},${site.keyHash},${JSON.stringify(answers)}::jsonb)`;
  return site;
}
export async function updateSite(id: string, answers: Intake) {
  if (localMode())
    return local((s) => {
      const x = s.sites.find((x) => x.id === id)!;
      x.answers = answers;
      if (x.paid) {
        x.published = answers;
        x.revision++;
      }
      x.updated = new Date().toISOString();
    });
  await sql()`WITH updated AS (UPDATE sites SET answers=${JSON.stringify(answers)}::jsonb, published=CASE WHEN paid THEN ${JSON.stringify(answers)}::jsonb ELSE published END, revision=revision+CASE WHEN paid THEN 1 ELSE 0 END, updated=now() WHERE id=${id} RETURNING *) INSERT INTO revisions(site_id,revision,answers) SELECT id,revision,published FROM updated WHERE paid`;
}
export async function markPaid(id: string, event: string) {
  if (localMode())
    return local((s) => {
      if (s.events.includes(event)) return;
      s.events.push(event);
      const x = s.sites.find((x) => x.id === id);
      if (x && !x.paid) {
        x.paid = true;
        x.published = x.answers;
        x.revision = 1;
      }
    });
  await sql()`WITH receipt AS (INSERT INTO payment_events(id,site_id) VALUES(${event},${id}) ON CONFLICT DO NOTHING RETURNING site_id), changed AS (UPDATE sites SET paid=true,published=answers,revision=1,updated=now() WHERE id IN(SELECT site_id FROM receipt) AND NOT paid RETURNING *) INSERT INTO revisions(site_id,revision,answers) SELECT id,revision,published FROM changed`;
}
export async function rateLimit(bucket: string, max = 100) {
  const window = Math.floor(Date.now() / 3600000);
  const key = `${bucket}:${window}`;
  if (localMode())
    return local((s) => {
      for (const [k, v] of Object.entries(s.limits))
        if (v.expires < Date.now()) delete s.limits[k];
      const v = s.limits[key] ?? { count: 0, expires: Date.now() + 3600000 };
      v.count++;
      s.limits[key] = v;
      return v.count <= max;
    });
  const rows =
    await sql()`INSERT INTO rate_limits(key,count) VALUES(${key},1) ON CONFLICT(key) DO UPDATE SET count=rate_limits.count+1 RETURNING count`;
  return Number(rows[0].count) <= max;
}
