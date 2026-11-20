import { neon } from "@neondatabase/serverless";
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
const admin = neon(process.env.DATABASE_URL_UNPOOLED!);
const pass = randomBytes(40).toString("hex");
const roles =
  await admin`SELECT rolname FROM pg_roles WHERE rolname='policypilot_app'`;
if (!roles.length) {
  await admin.query(`CREATE ROLE policypilot_app LOGIN PASSWORD '${pass}'`);
  await admin.query("GRANT USAGE ON SCHEMA public TO policypilot_app");
  await admin.query(
    "GRANT SELECT, INSERT, UPDATE, DELETE ON sites, revisions, payment_events, rate_limits TO policypilot_app",
  );
  const url = new URL(process.env.DATABASE_URL!);
  url.username = "policypilot_app";
  url.password = pass;
  const env = await readFile(".env.local", "utf8");
  await writeFile(
    ".env.local",
    env.replace(/^DATABASE_URL=.*$/m, `DATABASE_URL="${url.toString()}"`),
    { mode: 0o600 },
  );
  console.log(
    "Created restricted runtime role; migration owner remains separate.",
  );
} else console.log("Restricted role already exists; retained its credentials.");
