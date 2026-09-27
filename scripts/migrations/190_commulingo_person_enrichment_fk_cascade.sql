-- 190: let a person id rename carry the enrichment row.
--
-- Every other foreign key to commulingo_people already cascades on update, so
-- one UPDATE of commulingo_people.id moves the whole card. The enrichment
-- ledger's key was added without it and would block the rename
-- (scripts/commulingo-person-rename refuses to run while any foreign key to
-- commulingo_people lacks ON UPDATE CASCADE).

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_person_enrichment DROP CONSTRAINT commulingo_person_enrichment_person_id_fkey;
ALTER TABLE commulingo_person_enrichment ADD CONSTRAINT commulingo_person_enrichment_person_id_fkey
    FOREIGN KEY (person_id) REFERENCES commulingo_people(id) ON UPDATE CASCADE ON DELETE CASCADE;

COMMIT;
