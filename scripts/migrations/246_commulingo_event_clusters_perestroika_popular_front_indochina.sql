-- 2026-10-02: three more event clusters under existing overview events (user decision).
--   perestroika → the Gorbachev-era documents (1985–1991), the Baltic independence movement included
--   comintern-popular-front-1934-1939 → 6 February 1934, the French Popular Front, the Spanish Civil War
--   second-indochina-war-1955-1975 → Laos 1975, Vietnamese reunification, Democratic Kampuchea
-- related ids that become a parent, a child or a sibling are dropped on both sides.
BEGIN;
SET LOCAL lock_timeout = '3s';

DO $$
DECLARE
  clusters jsonb := '{
    "perestroika": ["anti-alcohol-campaign", "chernobyl", "new-thinking-diplomacy", "nineteenth-party-conference", "economic-reform-debate", "nationalities-crisis", "baltic-independence", "novo-ogaryovo-process", "soviet-collapse"],
    "comintern-popular-front-1934-1939": ["february-1934-crisis", "french-popular-front", "spanish-civil-war"],
    "second-indochina-war-1955-1975": ["lao-republic-1975", "vietnam-reunification-1975-1976", "cambodian-regime-change-1975-1979"]
  }';
  parent text;
  members text[];
  family text[];
  n int;
BEGIN
  FOR parent IN SELECT jsonb_object_keys(clusters) LOOP
    members := ARRAY(SELECT jsonb_array_elements_text(clusters->parent));
    family := members || parent;
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
END $$;

COMMIT;
