-- 2026-10-03: country hubs list the parties, factions, forces and
-- organizations of a country. Terms had no notion of either, so two curated
-- columns: org_kind marks a term that names one standing organization, and
-- countries names the country (flag-icons.js codes) whose political life it
-- belongs to. International bodies carry a kind and an empty list. The
-- classification itself is data (scripts/migrations/data/259_*).
BEGIN;
SET LOCAL lock_timeout = '3s';

ALTER TABLE commulingo_terms
  ADD COLUMN IF NOT EXISTS org_kind text
    CHECK (org_kind IN ('party', 'faction', 'force', 'organization', 'state')),
  ADD COLUMN IF NOT EXISTS countries jsonb NOT NULL DEFAULT '[]'::jsonb
    CHECK (jsonb_typeof(countries) = 'array');

COMMIT;
