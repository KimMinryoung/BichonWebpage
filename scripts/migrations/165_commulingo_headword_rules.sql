-- Related entities are not synonyms. The two entries' definitions distinguish
-- the 1923 faction from the 1926 alliance; route its names to the alliance.
DELETE FROM commulingo_term_aliases
 WHERE term_id = 'left-opposition'
   AND ((lang = 'ko' AND alias = '통합반대파')
     OR (lang = 'en' AND alias IN ('United Opposition', 'Joint Opposition')));
INSERT INTO commulingo_term_aliases (term_id, lang, alias)
SELECT 'united-opposition', 'en', 'Joint Opposition'
 WHERE EXISTS (SELECT 1 FROM commulingo_terms WHERE id = 'united-opposition')
ON CONFLICT DO NOTHING;

-- Apply syntax rules to newly inserted or changed values, including direct
-- SQL writes. Old rows remain editable without an unrelated field forcing a
-- bulk name rewrite. Deliberate homonyms are legal; the linker refuses them.
CREATE OR REPLACE FUNCTION commulingo_check_headwords() RETURNS trigger
LANGUAGE plpgsql AS $$
DECLARE
    column_name text;
    value text;
BEGIN
    FOREACH column_name IN ARRAY TG_ARGV LOOP
        value := to_jsonb(NEW)->>column_name;
        IF TG_OP = 'UPDATE' THEN
            IF value IS NOT DISTINCT FROM (to_jsonb(OLD)->>column_name) THEN
                CONTINUE;
            END IF;
        END IF;
        IF value IS NULL OR value = ''
           OR value <> normalize(value, NFC)
           OR value <> btrim(value)
           OR value ~ '[[:cntrl:]<>]'
           OR value ~ '  '
           OR value ~ '&(#[0-9]+|#x[0-9a-fA-F]+|[A-Za-z]+);'
           OR value ~ U&'[\00A0\1680\2000-\200F\2028-\202F\205F\2060-\206F\3000\FEFF]'
           OR (column_name = 'alias' AND char_length(value) < 2) THEN
            RAISE EXCEPTION '%: invalid headword/alias in % (use NFC plain text and single ordinary spaces)', TG_TABLE_NAME, column_name
                USING ERRCODE = '23514';
        END IF;
    END LOOP;
    RETURN NEW;
END;
$$;

CREATE TRIGGER commulingo_person_alias_syntax BEFORE INSERT OR UPDATE ON commulingo_person_aliases
FOR EACH ROW EXECUTE FUNCTION commulingo_check_headwords('alias');
CREATE TRIGGER commulingo_term_alias_syntax BEFORE INSERT OR UPDATE ON commulingo_term_aliases
FOR EACH ROW EXECUTE FUNCTION commulingo_check_headwords('alias');
CREATE TRIGGER commulingo_person_headword_syntax BEFORE INSERT OR UPDATE ON commulingo_people
FOR EACH ROW EXECUTE FUNCTION commulingo_check_headwords('name_ko', 'name_en');
CREATE TRIGGER commulingo_term_headword_syntax BEFORE INSERT OR UPDATE ON commulingo_terms
FOR EACH ROW EXECUTE FUNCTION commulingo_check_headwords('term_ko', 'term_en');
CREATE TRIGGER commulingo_event_headword_syntax BEFORE INSERT OR UPDATE ON commulingo_history_events
FOR EACH ROW EXECUTE FUNCTION commulingo_check_headwords('title_ko', 'title_en');
