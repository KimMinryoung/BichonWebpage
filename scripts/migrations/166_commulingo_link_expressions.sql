-- Reviewed link expressions augment (or override) the existing aliases. Empty
-- arrays preserve existing behavior; no bulk semantic reclassification.
CREATE OR REPLACE FUNCTION commulingo_valid_link_expressions(expressions jsonb)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
    expression jsonb;
    spelling text;
    key text;
    seen text[] := ARRAY[]::text[];
BEGIN
    IF expressions IS NULL OR jsonb_typeof(expressions) <> 'array' THEN RETURN false; END IF;
    FOR expression IN SELECT value FROM jsonb_array_elements(expressions) LOOP
        IF jsonb_typeof(expression) <> 'object'
           OR expression - ARRAY['text','lang','role','policy'] <> '{}'::jsonb
           OR NOT (expression ?& ARRAY['text','lang','role','policy']) THEN RETURN false; END IF;
        IF jsonb_typeof(expression->'text') <> 'string'
           OR expression->>'lang' NOT IN ('ko', 'en')
           OR expression->>'role' NOT IN ('identity', 'short', 'related')
           OR expression->>'policy' NOT IN ('auto', 'context', 'search')
           OR jsonb_typeof(expression->'lang') <> 'string'
           OR jsonb_typeof(expression->'role') <> 'string'
           OR jsonb_typeof(expression->'policy') <> 'string' THEN RETURN false; END IF;
        spelling := expression->>'text';
        IF spelling = '' OR spelling <> btrim(spelling) OR spelling <> normalize(spelling, NFC)
           OR spelling ~ '[[:cntrl:]<>]' OR spelling ~ '  '
           OR spelling ~ '&(#[0-9]+|#x[0-9a-fA-F]+|[A-Za-z]+);'
           OR spelling ~ U&'[\00A0\1680\2000-\200F\2028-\202F\205F\2060-\206F\3000\FEFF]'
           OR (expression->>'policy' <> 'search' AND char_length(spelling) < 2) THEN RETURN false; END IF;
        key := (expression->>'lang') || ':' || spelling;
        IF key = ANY(seen) THEN RETURN false; END IF;
        seen := array_append(seen, key);
    END LOOP;
    RETURN true;
END;
$$;

ALTER TABLE commulingo_people ADD COLUMN link_expressions jsonb NOT NULL DEFAULT '[]'
    CHECK (commulingo_valid_link_expressions(link_expressions));
ALTER TABLE commulingo_terms ADD COLUMN link_expressions jsonb NOT NULL DEFAULT '[]'
    CHECK (commulingo_valid_link_expressions(link_expressions));
ALTER TABLE commulingo_history_events ADD COLUMN link_expressions jsonb NOT NULL DEFAULT '[]'
    CHECK (commulingo_valid_link_expressions(link_expressions));

-- Attested identity spellings in the existing corpus, retained after adding
-- surname boundaries/name-context checks. Do not infer these via fuzzy names.
-- Sources: zdenek-mlynar/bio, vladimir-bakaric/bio, paul-nitze/moment,
-- kavbiuro/definition, vyso-any-party-congress/body respectively.
WITH reviewed(person_id, spelling) AS (VALUES
    ('dubcek', '알렉산데르 두브체크'),
    ('edvard-kardelj', '에드바르드 카르델리'),
    ('yuli-kvitsinsky', '유리 크비친스키'),
    ('ordzhonikidze', '그리고리 오르조니키제'),
    ('gustav-husak', '구스타프 후사크')
)
UPDATE commulingo_people AS person
SET link_expressions = person.link_expressions || jsonb_build_array(jsonb_build_object(
    'text', reviewed.spelling, 'lang', 'ko', 'role', 'identity', 'policy', 'auto'
))
FROM reviewed
WHERE person.id = reviewed.person_id
  AND NOT EXISTS (SELECT 1 FROM jsonb_array_elements(person.link_expressions) AS expression
                  WHERE expression->>'lang' = 'ko' AND expression->>'text' = reviewed.spelling);
