import assert from "node:assert/strict";
import { neon } from "@neondatabase/serverless";
import { demo } from "../lib/schema";
import {
  createSite,
  findSite,
  newKey,
  authorized,
  updateSite,
  markPaid,
  rateLimit,
} from "../lib/store";
const key = newKey();
const site = await createSite({ ...demo, name: "Database smoke check" }, key);
try {
  assert.equal(authorized((await findSite(site.id))!, key), true);
  assert.equal((await findSite(site.id))!.published, null);
  await updateSite(site.id, { ...demo, name: "Database revision check" });
  await markPaid(site.id, `smoke-${site.id}`);
  await markPaid(site.id, `smoke-${site.id}`);
  assert.equal((await findSite(site.id))!.revision, 1);
  await updateSite(site.id, demo);
  assert.equal((await findSite(site.id))!.revision, 2);
  assert.equal((await findSite(site.slug))!.published!.name, demo.name);
  const bucket = `smoke-${site.id}`;
  assert.equal(await rateLimit(bucket, 1), true);
  assert.equal(await rateLimit(bucket, 1), false);
  console.log(
    "PASS Neon: create, ownership, draft, publish, replay, revision, stable URL, shared limit",
  );
} finally {
  const sql = neon(process.env.DATABASE_URL!);
  await sql`DELETE FROM payment_events WHERE site_id=${site.id}`;
  await sql`DELETE FROM sites WHERE id=${site.id}`;
  await sql`DELETE FROM rate_limits WHERE key LIKE ${`smoke-${site.id}:%`}`;
}
