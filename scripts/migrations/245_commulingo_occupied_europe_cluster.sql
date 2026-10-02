-- 2026-10-02: occupation/resistance cluster under the new overview event
-- axis-occupied-europe-1939-1945 (user decision; registered beforehand with
-- scripts/apply-history-events.js from scripts/content/occupied-europe-20261002.json).
-- great-patriotic-war keeps the Eastern Front documents (Axis Hungary,
-- Leningrad, Stalingrad); occupied Hungary, the occupied Baltic and the
-- Warsaw Uprising move here, joined by France, the French Resistance, the
-- Yugoslav Partisans and the Greek resistance. related ids that become the
-- parent or a sibling are dropped.
BEGIN;
SET LOCAL lock_timeout = '3s';

DO $$
DECLARE
  members text[] := ARRAY['fall-of-france', 'baltic-german-occupation-1941-1944', 'hungary-1944-1945', 'french-resistance', 'warsaw-uprising', 'yugoslav-partisans', 'greek-resistance'];
  n int;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id = 'axis-occupied-europe-1939-1945') THEN
    RAISE EXCEPTION 'register axis-occupied-europe-1939-1945 first';
  END IF;
  IF EXISTS (SELECT 1 FROM commulingo_history_events WHERE id = ANY(members)
             AND relations ? 'parent' AND relations->>'parent' <> 'great-patriotic-war') THEN
    RAISE EXCEPTION 'a member has an unexpected parent; recheck';
  END IF;

  UPDATE commulingo_history_events e
  SET relations = jsonb_build_object('parent', 'axis-occupied-europe-1939-1945')
    || CASE WHEN e.relations ? 'related' THEN jsonb_build_object('related', COALESCE((
         SELECT jsonb_agg(r ORDER BY ord)
         FROM jsonb_array_elements_text(e.relations->'related') WITH ORDINALITY AS x(r, ord)
         WHERE r <> 'axis-occupied-europe-1939-1945' AND r <> ALL(members)
       ), '[]'::jsonb)) ELSE '{}'::jsonb END,
      updated_at = now()
  WHERE e.id = ANY(members);
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 7 THEN
    RAISE EXCEPTION 'expected 7 members, updated %', n;
  END IF;

  -- 244 dropped these related ids because they had become siblings under
  -- great-patriotic-war; with the clusters split they are related again.
  UPDATE commulingo_history_events
  SET relations = jsonb_set(relations, '{related}', '["hungary-axis-1938-1944", "great-patriotic-war"]'::jsonb || COALESCE(relations->'related', '[]'::jsonb))
  WHERE id = 'hungary-1944-1945';
  UPDATE commulingo_history_events
  SET relations = jsonb_set(relations, '{related}', COALESCE(relations->'related', '[]'::jsonb) || '["great-patriotic-war", "siege-of-leningrad"]'::jsonb)
  WHERE id = 'baltic-german-occupation-1941-1944';
END $$;

COMMIT;
