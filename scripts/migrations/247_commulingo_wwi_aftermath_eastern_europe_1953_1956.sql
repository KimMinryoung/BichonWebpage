-- 2026-10-02 (user decisions): the First World War split into two clusters, and
-- the post-Stalin crises in Eastern Europe gathered under a new overview.
--   world-war-i (the war, 1914–1918)            → second-international-collapse-1914
--   world-war-i-aftermath-1918-1923 (new)       → german-revolution-1918-1919, hungarian-soviet-republic-1919
--   eastern-europe-crisis-1953-1956 (new)       → hungary-new-course-1953, poznan-1956, hungarian-revolution
--     (east-german-uprising-1953 is registered with this parent already)
-- Register first with scripts/apply-history-events.js: scripts/content/world-war-i-20261002.json,
-- eastern-europe-1953-1956-20261002.json, then east-germany-20261002.json
-- (soviet-zone-gdr-1945-1949 under eastern-europe-peoples-democracies, east-german-uprising-1953). The new events carry their own relations;
-- this file only edits existing rows. related ids that become a parent, a child
-- or a sibling are dropped on both sides, as in 246.
BEGIN;
SET LOCAL lock_timeout = '3s';

DO $$
DECLARE
  clusters jsonb := '{
    "world-war-i": ["second-international-collapse-1914"],
    "world-war-i-aftermath-1918-1923": ["german-revolution-1918-1919", "hungarian-soviet-republic-1919"],
    "eastern-europe-crisis-1953-1956": ["hungary-new-course-1953", "poznan-1956", "hungarian-revolution"]
  }';
  -- Children registered with their parent; they count as family when dropping related ids.
  registered jsonb := '{"eastern-europe-crisis-1953-1956": ["east-german-uprising-1953"]}';
  parent text;
  members text[];
  family text[];
  n int;
BEGIN
  IF (SELECT count(*) FROM commulingo_history_events
      WHERE id IN ('world-war-i-aftermath-1918-1923', 'eastern-europe-crisis-1953-1956', 'soviet-zone-gdr-1945-1949')
         OR (id = 'east-german-uprising-1953' AND relations->>'parent' = 'eastern-europe-crisis-1953-1956')) <> 4 THEN
    RAISE EXCEPTION 'register the aftermath, 1953–1956 and East German events first';
  END IF;

  FOR parent IN SELECT jsonb_object_keys(clusters) LOOP
    members := ARRAY(SELECT jsonb_array_elements_text(clusters->parent));
    family := members || parent || ARRAY(SELECT jsonb_array_elements_text(COALESCE(registered->parent, '[]'::jsonb)));
    IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id = parent AND NOT relations ? 'parent') THEN
      RAISE EXCEPTION '% is missing or is itself a child', parent;
    END IF;
    IF EXISTS (SELECT 1 FROM commulingo_history_events WHERE id = ANY(members) AND relations ? 'parent') THEN
      RAISE EXCEPTION 'a member of % already has a parent', parent;
    END IF;

    UPDATE commulingo_history_events e
    SET relations = jsonb_build_object('parent', parent)
      || CASE WHEN e.relations ? 'related' THEN jsonb_build_object('related', COALESCE((
           SELECT jsonb_agg(r ORDER BY ord)
           FROM jsonb_array_elements_text(e.relations->'related') WITH ORDINALITY AS x(r, ord)
           WHERE r <> ALL(family)), '[]'::jsonb)) ELSE '{}'::jsonb END,
        updated_at = now()
    WHERE e.id = ANY(members);
    GET DIAGNOSTICS n = ROW_COUNT;
    IF n <> cardinality(members) THEN
      RAISE EXCEPTION '%: expected % members, updated %', parent, cardinality(members), n;
    END IF;

    UPDATE commulingo_history_events e
    SET relations = jsonb_set(e.relations, '{related}', COALESCE((
          SELECT jsonb_agg(r ORDER BY ord)
          FROM jsonb_array_elements_text(e.relations->'related') WITH ORDINALITY AS x(r, ord)
          WHERE r <> ALL(members)), '[]'::jsonb)),
        updated_at = now()
    WHERE e.id = parent AND e.relations ? 'related';
  END LOOP;

  -- related links pointing at the new documents from existing ones.
  UPDATE commulingo_history_events
  SET relations = jsonb_set(relations, '{related}', COALESCE(relations->'related', '[]'::jsonb) || to_jsonb(ARRAY(
        SELECT x FROM unnest(CASE id
          WHEN 'world-war-i' THEN ARRAY['world-war-i-aftermath-1918-1923']
          WHEN 'berlin-blockade' THEN ARRAY['soviet-zone-gdr-1945-1949']
          WHEN 'eastern-europe-crisis-1953-1956' THEN ARRAY['soviet-zone-gdr-1945-1949']
          WHEN 'berlin-wall' THEN ARRAY['soviet-zone-gdr-1945-1949', 'east-german-uprising-1953']
          ELSE ARRAY['eastern-europe-crisis-1953-1956', 'east-german-uprising-1953'] END) AS x
        WHERE NOT COALESCE(relations->'related', '[]'::jsonb) ? x))),
      updated_at = now()
  WHERE id IN ('world-war-i', 'berlin-blockade', 'eastern-europe-crisis-1953-1956', 'berlin-wall', 'beria-purge');
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 5 THEN
    RAISE EXCEPTION 'expected 5 related updates, updated %', n;
  END IF;
END $$;

COMMIT;
