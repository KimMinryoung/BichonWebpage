-- 2026-10-03: brest-litovsk moves from civil-war to
-- world-war-i-aftermath-1918-1923 (user decision): the peace treaty belongs
-- with the German revolution and the Hungarian Soviet Republic among the
-- war's settlements. An event has one parent, so civil-war stays reachable
-- as a related id.
BEGIN;
SET LOCAL lock_timeout = '3s';

DO $$
DECLARE
  n int;
BEGIN
  IF (SELECT relations FROM commulingo_history_events WHERE id = 'brest-litovsk') IS DISTINCT FROM '{"parent": "civil-war"}'::jsonb THEN
    RAISE EXCEPTION 'brest-litovsk relations changed; recheck';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM commulingo_history_events WHERE id = 'world-war-i-aftermath-1918-1923') THEN
    RAISE EXCEPTION 'world-war-i-aftermath-1918-1923 missing';
  END IF;

  UPDATE commulingo_history_events
  SET relations = '{"parent": "world-war-i-aftermath-1918-1923", "related": ["civil-war"]}'::jsonb,
      updated_at = now()
  WHERE id = 'brest-litovsk';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 1 THEN
    RAISE EXCEPTION 'expected 1 row, updated %', n;
  END IF;
END $$;

COMMIT;
