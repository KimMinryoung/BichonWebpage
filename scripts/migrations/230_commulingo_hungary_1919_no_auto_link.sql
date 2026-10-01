-- 2026-10-01: on the 1919 Hungarian Soviet Republic page the second mention of
-- 헝가리 백색테러 fell back to the Russian white-terror term's alias 백색테러
-- (the Hungarian term links once per page). Block that alias on this page, as
-- horthy-regime-1920-1938 already does.
BEGIN;
UPDATE commulingo_history_events
SET no_auto_link = '["백색테러", "백색 테러", "적색 테러", "White Terror", "Red Terror"]'::jsonb, updated_at = now()
WHERE id = 'hungarian-soviet-republic-1919'
  AND no_auto_link = '["백색 테러", "적색 테러", "White Terror", "Red Terror"]'::jsonb;
COMMIT;
