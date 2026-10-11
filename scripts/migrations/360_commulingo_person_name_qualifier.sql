-- 360: a person's disambiguator gets its own columns; name_ko/name_en become
-- derived values only.
--
-- Two cards could share one name (two 오토 브라운, two 블라디미르 코마로프), and
-- the only way to tell them apart was a "(qualifier)" typed onto the end of
-- name_ko/name_en. The Admin store recomposes those columns from the name parts
-- on every name edit, so it silently dropped the qualifier; the person page
-- never showed it (it composes from the parts), while event, term and roster
-- lists did. Other names (먀스니캰, 오포코프) had been parked in the same brackets.
--
-- name_qualifier_ko/en hold the disambiguator; people-standard/person-label.js
-- labels list entries 「오토 브라운 (프로이센 총리)」 and the person page prints it
-- under the heading. name_ko/name_en stay as the plain composition of the parts
-- (the store writes them through composeFromParts; audit-person-name-order
-- checks it exactly). The CHECK keeps brackets out of them for good. It is
-- added NOT VALID: the 14 bracketed rows are moved by a data-only SQL, which
-- then validates it.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_people
    ADD COLUMN IF NOT EXISTS name_qualifier_ko TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS name_qualifier_en TEXT NOT NULL DEFAULT '';

ALTER TABLE commulingo_people
    ADD CONSTRAINT commulingo_people_name_derived CHECK (
        name_ko !~ '[()（）]' AND name_en !~ '[()（）]'
        AND name_qualifier_ko !~ '[()（）]' AND name_qualifier_en !~ '[()（）]'
        AND (name_qualifier_ko = '') = (name_qualifier_en = '')
    ) NOT VALID;

COMMIT;
