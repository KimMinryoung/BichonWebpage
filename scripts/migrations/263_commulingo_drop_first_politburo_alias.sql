-- 2026-10-03: "First Politburo" is not a name anyone uses for the bureau of
-- October 1917 (user decision); the entry keeps its dated names.
BEGIN;
SET LOCAL lock_timeout = '3s';

DO $$
DECLARE
  n int;
BEGIN
  DELETE FROM commulingo_term_aliases
  WHERE term_id = 'bolshevik-politburo-october-1917' AND lang = 'en' AND alias = 'First Politburo';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'expected 1 alias, deleted %', n;
  END IF;
END $$;

COMMIT;
