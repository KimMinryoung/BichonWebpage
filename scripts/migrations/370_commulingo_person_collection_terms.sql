-- 370: a political position names its glossary entries, as an office does
-- (commulingo_offices.term_ids). The people explorer shows them above the
-- results when the position is chosen; a combined position (자유주의·공화주의)
-- names one entry per current. An id with no glossary entry is skipped.

BEGIN;
SET LOCAL lock_timeout = '5s';
ALTER TABLE commulingo_person_collections
    ADD COLUMN IF NOT EXISTS term_ids text[] NOT NULL DEFAULT '{}';
COMMIT;
