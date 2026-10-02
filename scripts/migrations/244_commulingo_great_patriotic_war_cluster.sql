-- 2026-10-02: Eastern Front cluster under great-patriotic-war (user decision).
-- Hungary on the Axis side, Hungary under German occupation, the Baltic under
-- German occupation, Leningrad, Stalingrad and the Warsaw Uprising become
-- children, so each lists the others as siblings under 「이 시기의 문서」.
-- related ids that are now the parent or a sibling are dropped (the panel
-- would dedupe them anyway, but they would no longer mean anything).
BEGIN;
SET LOCAL lock_timeout = '3s';

DO $$
DECLARE
  child text;
  n int;
BEGIN
  IF (SELECT relations FROM commulingo_history_events WHERE id = 'great-patriotic-war') IS DISTINCT FROM '{}'::jsonb THEN
    RAISE EXCEPTION 'great-patriotic-war relations changed; recheck before clustering';
  END IF;
  FOREACH child IN ARRAY ARRAY['hungary-axis-1938-1944', 'hungary-1944-1945', 'baltic-german-occupation-1941-1944', 'siege-of-leningrad', 'stalingrad', 'warsaw-uprising'] LOOP
    IF (SELECT relations ? 'parent' FROM commulingo_history_events WHERE id = child) IS DISTINCT FROM FALSE THEN
      RAISE EXCEPTION '% is missing or already has a parent', child;
    END IF;
  END LOOP;

  UPDATE commulingo_history_events e
  SET relations = jsonb_build_object('parent', 'great-patriotic-war')
    || CASE WHEN e.relations ? 'related' THEN jsonb_build_object('related', COALESCE((
         SELECT jsonb_agg(r ORDER BY ord)
         FROM jsonb_array_elements_text(e.relations->'related') WITH ORDINALITY AS x(r, ord)
         WHERE r NOT IN ('great-patriotic-war', 'hungary-axis-1938-1944', 'hungary-1944-1945', 'baltic-german-occupation-1941-1944', 'siege-of-leningrad', 'stalingrad', 'warsaw-uprising')
       ), '[]'::jsonb)) ELSE '{}'::jsonb END,
      updated_at = now()
  WHERE e.id IN ('hungary-axis-1938-1944', 'hungary-1944-1945', 'baltic-german-occupation-1941-1944', 'siege-of-leningrad', 'stalingrad', 'warsaw-uprising');
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 6 THEN
    RAISE EXCEPTION 'expected 6 children, updated %', n;
  END IF;
END $$;

COMMIT;
