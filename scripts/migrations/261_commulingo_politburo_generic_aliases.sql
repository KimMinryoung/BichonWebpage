-- 2026-10-03: bare 정치국 / Politburo is no one body's name — the Soviet,
-- Chinese, East German, Korean and every other ruling party had one — yet it
-- was an alias of bolshevik-politburo-october-1917, so a later Politburo in
-- prose linked to the seven-man bureau of October 1917 (user decision).
-- Remove the generic forms and list them in the generic-alias gate
-- (migration 194) so no entry takes them again.
BEGIN;
SET LOCAL lock_timeout = '3s';

DO $$
DECLARE
  n int;
BEGIN
  DELETE FROM commulingo_term_aliases
  WHERE term_id = 'bolshevik-politburo-october-1917'
    AND (lang, alias) IN (('ko', '정치국'), ('en', 'Politburo'), ('en', 'Political Bureau'),
                          ('en', 'Political Bureau of the Central Committee'));
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 4 THEN
    RAISE EXCEPTION 'expected 4 aliases, deleted %', n;
  END IF;
END $$;

INSERT INTO commulingo_generic_aliases (lang, phrase, note) VALUES
  ('ko', '정치국', '2026-10-03 모든 집권당에 있는 기구 이름(소련·중국·동독·북한 등). 1917년 10월 볼셰비키 정치국 별칭에서 제거'),
  ('en', 'Politburo', '2026-10-03 generic: every ruling party had one; removed from bolshevik-politburo-october-1917'),
  ('en', 'Political Bureau', '2026-10-03 generic: every ruling party had one; removed from bolshevik-politburo-october-1917'),
  ('en', 'Political Bureau of the Central Committee', '2026-10-03 generic: every ruling party had one; removed from bolshevik-politburo-october-1917')
ON CONFLICT DO NOTHING;

COMMIT;
