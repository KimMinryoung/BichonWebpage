-- 357: link expressions may carry anyEra: true (2026-10-09).
--
-- Dictionary pages refuse a bare surname whose bearer lived more than a
-- generation away from the page's years (data/commulingo/person-page-links.js).
-- People whom prose names by surname long after their death (마르크스, 레닌)
-- mark that expression anyEra. The flag is optional and only ever true; the
-- rest of the check is unchanged from 166.

BEGIN;
SET LOCAL lock_timeout = '5s';

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
           OR expression - ARRAY['text','lang','role','policy','anyEra'] <> '{}'::jsonb
           OR NOT (expression ?& ARRAY['text','lang','role','policy']) THEN RETURN false; END IF;
        IF expression ? 'anyEra' AND expression->'anyEra' <> 'true'::jsonb THEN RETURN false; END IF;
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

COMMIT;
