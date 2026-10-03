-- 2026-10-03: the country hubs list parties and organizations from the
-- person-activity affiliations (activity-catalog.json), which carry their
-- members, so the term-level classification of migration 259 has no reader.
-- Drop it rather than keep a second, unused registry.
BEGIN;
SET LOCAL lock_timeout = '3s';

ALTER TABLE commulingo_terms
  DROP COLUMN IF EXISTS org_kind,
  DROP COLUMN IF EXISTS countries;

COMMIT;
