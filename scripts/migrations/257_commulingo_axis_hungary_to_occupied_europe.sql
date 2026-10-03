-- 2026-10-03: Axis Hungary (1938–1944) moves from great-patriotic-war to
-- axis-occupied-europe-1939-1945 (user decision), so the two Hungary
-- documents sit together the way the two France documents do. The Eastern
-- Front link survives as a related id; hungary-1944-1945 drops
-- hungary-axis-1938-1944 from related because it is now a sibling.
BEGIN;
SET LOCAL lock_timeout = '3s';

DO $$
DECLARE
  n int;
BEGIN
  IF (SELECT relations->>'parent' FROM commulingo_history_events WHERE id = 'hungary-axis-1938-1944') IS DISTINCT FROM 'great-patriotic-war' THEN
    RAISE EXCEPTION 'hungary-axis-1938-1944 parent changed; recheck';
  END IF;

  UPDATE commulingo_history_events
  SET relations = jsonb_build_object(
        'parent', 'axis-occupied-europe-1939-1945',
        'related', COALESCE((
          SELECT jsonb_agg(r ORDER BY ord)
          FROM jsonb_array_elements_text(relations->'related') WITH ORDINALITY AS x(r, ord)
          WHERE r NOT IN ('great-patriotic-war', 'axis-occupied-europe-1939-1945', 'hungary-1944-1945')
        ), '[]'::jsonb) || '["great-patriotic-war"]'::jsonb),
      updated_at = now()
  WHERE id = 'hungary-axis-1938-1944';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'expected 1 row, updated %', n;
  END IF;

  UPDATE commulingo_history_events
  SET relations = jsonb_set(relations, '{related}', COALESCE((
        SELECT jsonb_agg(r ORDER BY ord)
        FROM jsonb_array_elements_text(relations->'related') WITH ORDINALITY AS x(r, ord)
        WHERE r <> 'hungary-axis-1938-1944'
      ), '[]'::jsonb)),
      updated_at = now()
  WHERE id = 'hungary-1944-1945';
END $$;

COMMIT;
