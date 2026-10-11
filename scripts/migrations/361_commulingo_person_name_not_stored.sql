-- 361: a person's full name is no longer stored.
--
-- name_ko/name_en were the composition of the name parts, written by the Admin
-- store and nothing else, yet hand-written statements and old imports had left
-- 14 rows with bracketed tails no reader agreed on (2026-10-11 census; the
-- disambiguators moved to name_qualifier_* in 360, the other names were
-- aliases). Instead of guarding a copy, the copy goes: every reader composes
-- the name through data/commulingo/person-name.js from given_name_*,
-- family_name_*, the patronymic table and citizenship_code. SQL that only has
-- to find a person by name matches the parts in either order (nameMatchSql);
-- the MCP people dataset adds the composed name_ko/name_en for mirrors.
--
-- The two triggers that read the columns move to the parts: the headword
-- syntax check guards family_name_* (every row has one; a mononym lives there),
-- and the generic-alias guard's "an alias equal to the headword is allowed"
-- compares against the parts in both orders.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_people DROP CONSTRAINT IF EXISTS commulingo_people_name_derived;
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_people_name_parts CHECK (
    family_name_ko <> '' AND family_name_en <> ''
    AND concat(given_name_ko, given_name_en, family_name_ko, family_name_en) !~ '[()（）]'
    AND name_qualifier_ko !~ '[()（）]' AND name_qualifier_en !~ '[()（）]'
    AND (name_qualifier_ko = '') = (name_qualifier_en = '')
);

DROP TRIGGER IF EXISTS commulingo_person_headword_syntax ON commulingo_people;
CREATE TRIGGER commulingo_person_headword_syntax BEFORE INSERT OR UPDATE ON commulingo_people
    FOR EACH ROW EXECUTE FUNCTION commulingo_check_headwords('family_name_ko', 'family_name_en');

CREATE OR REPLACE FUNCTION commulingo_check_generic_alias() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $_$
DECLARE
    headwords text[];
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.alias IS NOT DISTINCT FROM OLD.alias AND NEW.lang IS NOT DISTINCT FROM OLD.lang THEN
        RETURN NEW;
    END IF;
    IF TG_TABLE_NAME = 'commulingo_term_aliases' THEN
        SELECT ARRAY[term_ko, term_en] INTO headwords FROM commulingo_terms WHERE id = NEW.term_id;
    ELSE
        SELECT ARRAY[
                   btrim(given_name_ko || ' ' || family_name_ko), family_name_ko || given_name_ko, btrim(family_name_ko || ' ' || given_name_ko),
                   btrim(given_name_en || ' ' || family_name_en), btrim(family_name_en || ' ' || given_name_en)]
          INTO headwords FROM commulingo_people WHERE id = NEW.person_id;
    END IF;
    IF NEW.alias = ANY(headwords) THEN
        RETURN NEW;
    END IF;
    IF EXISTS (SELECT 1 FROM commulingo_generic_aliases g WHERE g.lang = NEW.lang AND g.phrase = NEW.alias)
       OR (NEW.lang = 'ko' AND NEW.alias ~ '^제?[0-9]+(조|군|기|범주|공화국|사단|군단)$') THEN
        RAISE EXCEPTION '%: generic alias "%" refused; an alias must name only this entry (its own name, abbreviation or transliteration), never a common noun another country or context also uses', TG_TABLE_NAME, NEW.alias
            USING ERRCODE = '23514';
    END IF;
    RETURN NEW;
END;
$_$;

ALTER TABLE commulingo_people DROP COLUMN name_ko, DROP COLUMN name_en;

COMMIT;
