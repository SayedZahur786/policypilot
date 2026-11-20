import { spawnSync } from "node:child_process";
process.loadEnvFile(".env.local");
for (const key of ["DATABASE_URL", "APP_URL"]) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing ${key}`);
  const r = spawnSync("vercel", ["env", "add", key, "production", "--force"], {
    input: value,
    encoding: "utf8",
  });
  if (r.status !== 0) throw new Error(`Could not configure ${key}`);
  console.log(`Configured ${key} for production`);
}
