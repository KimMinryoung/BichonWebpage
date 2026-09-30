-- Which migration files have been applied, and in what form. Until now nothing
-- recorded this: a file could be applied twice, edited after it ran, or never
-- applied at all (2026-09-05: commulingo_progress was missing in production
-- because its migration had not run). scripts/apply-migration writes one row
-- per file it applies; `--status` lists files with no row or a changed hash.
CREATE TABLE IF NOT EXISTS schema_migrations (
    filename text PRIMARY KEY,
    sha256 text NOT NULL,
    applied_at timestamptz NOT NULL DEFAULT now(),
    applied_by text NOT NULL DEFAULT '',
    note text NOT NULL DEFAULT ''
);
GRANT SELECT ON TABLE schema_migrations TO frontend;
