CREATE TABLE IF NOT EXISTS sites (
 id text PRIMARY KEY, slug text UNIQUE NOT NULL, key_hash text NOT NULL,
 answers jsonb NOT NULL, published jsonb, paid boolean NOT NULL DEFAULT false,
 revision integer NOT NULL DEFAULT 0, updated timestamptz NOT NULL DEFAULT now(), created timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS revisions (site_id text REFERENCES sites(id) ON DELETE CASCADE, revision integer NOT NULL, answers jsonb NOT NULL, created timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(site_id,revision));
CREATE TABLE IF NOT EXISTS payment_events(id text PRIMARY KEY, site_id text NOT NULL REFERENCES sites(id), created timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS rate_limits(key text PRIMARY KEY, count integer NOT NULL, created timestamptz NOT NULL DEFAULT now());
