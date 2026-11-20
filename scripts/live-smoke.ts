import assert from "node:assert/strict";
import { neon } from "@neondatabase/serverless";
import { demo } from "../lib/schema";
const base = process.env.APP_URL!;
const created = await fetch(base + "/api/sites", {
  method: "POST",
  headers: { origin: base, "content-type": "application/json" },
  body: JSON.stringify({ ...demo, name: "Deployment verification" }),
});
assert.equal(created.status, 201);
const site = await created.json();
const cookie = created.headers.get("set-cookie")!;
assert.match(cookie, /HttpOnly/i);
assert.match(cookie, /Secure/i);
assert.match(cookie, /SameSite=strict/i);
try {
  const headers = {
    origin: base,
    "content-type": "application/json",
    cookie: cookie.split(";")[0],
  };
  const page = await fetch(`${base}/manage?id=${site.id}`, {
    headers: { cookie: headers.cookie },
  });
  assert.ok((await page.text()).includes("Deployment verification"));
  const update = await fetch(`${base}/api/sites/${site.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(demo),
  });
  assert.equal(update.status, 200);
  const pay = await fetch(base + "/api/checkout", {
    method: "POST",
    headers,
    body: JSON.stringify({ id: site.id }),
  });
  assert.equal(pay.status, 503);
  const denied = await fetch(`${base}/api/sites/${site.id}`, {
    method: "PUT",
    headers: { origin: base, "content-type": "application/json" },
    body: JSON.stringify(demo),
  });
  assert.equal(denied.status, 403);
  assert.equal(
    (
      await fetch(base + "/api/local-payment", {
        method: "POST",
        headers,
        body: JSON.stringify({ id: site.id }),
      })
    ).status,
    404,
  );
  assert.equal((await fetch(`${base}/s/${site.slug}/privacy`)).status, 404);
  console.log(
    "PASS deployed Neon intake, secure session, edit, denied cross-account write, payment unavailable, no simulation, private draft",
  );
} finally {
  await neon(process.env.DATABASE_URL!)`DELETE FROM sites WHERE id=${site.id}`;
}
