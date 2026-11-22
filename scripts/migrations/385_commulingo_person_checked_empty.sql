-- "Researched, nothing to record" marks on person cards (owner's decision
-- 2026-11-22), so an empty field that was looked into is not researched again.
--
-- commulingo_people.checked_empty: {"<field>": {"at": "YYYY-MM-DD", "note": "..."}}
-- for the fields that have no "unknown" value of their own:
--   citizenship, nationalOrigin, wikidataId,
--   birthDate, deathDate (the month/day of birth or death, lifeDates; years
--     already has ? for an unknown year, and deathDate is only for the dead),
--   career (no career rows at all).
-- A mark is set through registry_edit person_checked_empty_set, which refuses
-- a field that holds a value. Filling the field drops the mark (triggers
-- below), whatever path writes it.
--
-- Career rows also gain startQual 'unknown': a row whose start date could not
-- be found (shown as ?–현재, ?–1950), as endQual 'unknown' already does for
-- the end.
BEGIN;

ALTER TABLE commulingo_people ADD COLUMN IF NOT EXISTS checked_empty jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE commulingo_people DROP CONSTRAINT IF EXISTS commulingo_person_checked_empty_shape;
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_person_checked_empty_shape CHECK (
    jsonb_typeof(checked_empty) = 'object'
    AND (checked_empty - ARRAY['citizenship', 'nationalOrigin', 'wikidataId', 'birthDate', 'deathDate', 'career']) = '{}'::jsonb
);

CREATE OR REPLACE FUNCTION commulingo_person_checked_empty_prune() RETURNS trigger AS $$
BEGIN
    IF NEW.checked_empty <> '{}'::jsonb THEN
        IF coalesce(NEW.citizenship_code, '') <> '' THEN NEW.checked_empty := NEW.checked_empty - 'citizenship'; END IF;
        IF coalesce(NEW.origin_code, '') <> '' THEN NEW.checked_empty := NEW.checked_empty - 'nationalOrigin'; END IF;
        IF coalesce(NEW.wikidata_id, '') <> '' THEN NEW.checked_empty := NEW.checked_empty - 'wikidataId'; END IF;
        IF NEW.birth_date IS NOT NULL THEN NEW.checked_empty := NEW.checked_empty - 'birthDate'; END IF;
        IF NEW.death_date IS NOT NULL OR NEW.death_year IS NULL THEN NEW.checked_empty := NEW.checked_empty - 'deathDate'; END IF;
    END IF;
    RETURN NEW;
END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS commulingo_person_checked_empty_prune ON commulingo_people;
CREATE TRIGGER commulingo_person_checked_empty_prune BEFORE INSERT OR UPDATE ON commulingo_people
    FOR EACH ROW EXECUTE FUNCTION commulingo_person_checked_empty_prune();

CREATE OR REPLACE FUNCTION commulingo_person_career_clears_checked_empty() RETURNS trigger AS $$
BEGIN
    UPDATE commulingo_people SET checked_empty = checked_empty - 'career'
     WHERE id = NEW.person_id AND checked_empty ? 'career';
    RETURN NEW;
END $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS commulingo_person_career_clears_checked_empty ON commulingo_person_career_entries;
CREATE TRIGGER commulingo_person_career_clears_checked_empty AFTER INSERT ON commulingo_person_career_entries
    FOR EACH ROW EXECUTE FUNCTION commulingo_person_career_clears_checked_empty();

ALTER TABLE commulingo_person_career_entries DROP CONSTRAINT IF EXISTS commulingo_person_career_entries_start_qual_check;
ALTER TABLE commulingo_person_career_entries ADD CONSTRAINT commulingo_person_career_entries_start_qual_check
    CHECK (start_qual = ANY (ARRAY['circa', 'decade', 'early', 'mid', 'late', 'after', 'summer', 'unknown']));
ALTER TABLE commulingo_office_rows DROP CONSTRAINT IF EXISTS commulingo_office_rows_start_qual_check;
ALTER TABLE commulingo_office_rows ADD CONSTRAINT commulingo_office_rows_start_qual_check
    CHECK (start_qual = ANY (ARRAY['circa', 'decade', 'early', 'mid', 'late', 'after', 'summer', 'unknown']));

COMMIT;
