-- 376: a person's Wikidata item (2026-11-03).
--
-- One QID per card maps it to Wikidata and, through sitelinks, to every
-- Wikipedia article, so later data work looks a person up by id instead of by
-- name. Article URLs are not stored; they follow from the QID. Two cards may
-- not share an item (a duplicate card would show up as a conflict here).

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_people
    ADD COLUMN IF NOT EXISTS wikidata_id TEXT;

ALTER TABLE commulingo_people DROP CONSTRAINT IF EXISTS commulingo_person_wikidata_id;
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_person_wikidata_id
    CHECK (wikidata_id IS NULL OR wikidata_id ~ '^Q[1-9][0-9]*$');

CREATE UNIQUE INDEX IF NOT EXISTS commulingo_people_wikidata_id_key
    ON commulingo_people (wikidata_id) WHERE wikidata_id IS NOT NULL;

COMMENT ON COLUMN commulingo_people.wikidata_id IS 'Wikidata item (Q…) of this person; Wikipedia articles follow from its sitelinks';

COMMIT;
