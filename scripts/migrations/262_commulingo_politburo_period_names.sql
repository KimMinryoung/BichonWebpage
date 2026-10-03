-- 2026-10-03: the standing Politburo from 1919 was also the Bolshevik party's
-- Politburo, so the undated 볼셰비키 정치국 cannot single out the bureau of
-- October 1917; that entry keeps only its dated names (1917년 정치국, 정치국
-- (1917년 10월), October/First Politburo). politburo-of-the-cpsu takes the
-- party's period names instead: RKP(b) 1918–1925, VKP(b) 1925–1952 (user
-- decision). Link reviews: scripts/reviews/commulingo-links-20261003-politburo-period-names.json.
BEGIN;
SET LOCAL lock_timeout = '3s';

DO $$
DECLARE
  n int;
BEGIN
  DELETE FROM commulingo_term_aliases
  WHERE term_id = 'bolshevik-politburo-october-1917' AND lang = 'ko' AND alias = '볼셰비키 정치국';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'expected 1 alias, deleted %', n;
  END IF;
END $$;

INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order) VALUES
  ('politburo-of-the-cpsu', 'ko', '러시아 공산당(볼셰비키) 정치국', 2),
  ('politburo-of-the-cpsu', 'ko', '전연방공산당(볼셰비키) 정치국', 3),
  ('politburo-of-the-cpsu', 'en', 'Politburo of the RKP(b)', 6),
  ('politburo-of-the-cpsu', 'en', 'Politburo of the VKP(b)', 7);

COMMIT;
