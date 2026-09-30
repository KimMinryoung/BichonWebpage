-- Aliases drive site-wide auto-linking, so a common noun in an alias list
-- links every ordinary use of that word, and every other country's institution
-- of the same name, to one entry: the German revolution's 최고사령부 linked to
-- the Soviet Stavka (2026-09-30). An alias must name its own subject only (its
-- own name, abbreviation or transliteration). Two checks, on insert or change
-- of an alias row, whatever the write path (frontend stores, the leninbot
-- curator tools, hand SQL):
--   * commulingo_generic_aliases lists common nouns refused outright;
--   * a numbered generic form (6조, 제7군, 제2공화국, 제1범주, 제3기) is refused.
-- An alias equal to the entry's own headword passes: the headword is indexed
-- anyway, and a generic headword is the term-headword blocklist's business.
CREATE TABLE IF NOT EXISTS commulingo_generic_aliases (
    lang text NOT NULL CHECK (lang IN ('ko', 'en')),
    phrase text NOT NULL,
    note text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (lang, phrase)
);
GRANT SELECT ON TABLE commulingo_generic_aliases TO frontend;

CREATE OR REPLACE FUNCTION commulingo_check_generic_alias() RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    headword_ko text;
    headword_en text;
BEGIN
    IF TG_OP = 'UPDATE' AND NEW.alias IS NOT DISTINCT FROM OLD.alias AND NEW.lang IS NOT DISTINCT FROM OLD.lang THEN
        RETURN NEW;
    END IF;
    IF TG_TABLE_NAME = 'commulingo_term_aliases' THEN
        SELECT term_ko, term_en INTO headword_ko, headword_en FROM commulingo_terms WHERE id = NEW.term_id;
    ELSE
        SELECT name_ko, name_en INTO headword_ko, headword_en FROM commulingo_people WHERE id = NEW.person_id;
    END IF;
    IF NEW.alias = headword_ko OR NEW.alias = headword_en THEN
        RETURN NEW;
    END IF;
    IF EXISTS (SELECT 1 FROM commulingo_generic_aliases g WHERE g.lang = NEW.lang AND g.phrase = NEW.alias)
       OR (NEW.lang = 'ko' AND NEW.alias ~ '^제?[0-9]+(조|군|기|범주|공화국|사단|군단)$') THEN
        RAISE EXCEPTION '%: generic alias "%" refused; an alias must name only this entry (its own name, abbreviation or transliteration), never a common noun another country or context also uses', TG_TABLE_NAME, NEW.alias
            USING ERRCODE = '23514';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS commulingo_term_alias_generic ON commulingo_term_aliases;
CREATE TRIGGER commulingo_term_alias_generic BEFORE INSERT OR UPDATE ON commulingo_term_aliases
FOR EACH ROW EXECUTE FUNCTION commulingo_check_generic_alias();
DROP TRIGGER IF EXISTS commulingo_person_alias_generic ON commulingo_person_aliases;
CREATE TRIGGER commulingo_person_alias_generic BEFORE INSERT OR UPDATE ON commulingo_person_aliases
FOR EACH ROW EXECUTE FUNCTION commulingo_check_generic_alias();
