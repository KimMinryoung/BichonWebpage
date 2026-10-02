-- 2026-10-02: one Korean spelling for the SED (owner decision). 「독일 사회주의통일당」 /
-- 사회주의통일당 is the majority form in events, terms and people; 「독일사회통일당」 /
-- 사회통일당 came in with eastern-europe-peoples-democracies and the 2026-10-02
-- batches. Every text and jsonb column of history events and every person-relation
-- note is rewritten; nothing may keep the old form. The term
-- socialist-unity-party-of-germany (scripts/content/sed-spelling-20261002-terms.json)
-- keeps both as aliases.
BEGIN;
SET LOCAL lock_timeout = '3s';

CREATE FUNCTION pg_temp.sed(t text) RETURNS text LANGUAGE sql IMMUTABLE AS
$$ SELECT replace(replace(t, '독일사회통일당', '독일 사회주의통일당'), '사회통일당', '사회주의통일당') $$;

DO $$
DECLARE n int;
BEGIN
  UPDATE commulingo_history_events SET
    title_ko = pg_temp.sed(title_ko), question_ko = pg_temp.sed(question_ko),
    summary_ko = pg_temp.sed(summary_ko), outcome_ko = pg_temp.sed(outcome_ko), body_ko = pg_temp.sed(body_ko),
    timeline = pg_temp.sed(timeline::text)::jsonb,
    focus = pg_temp.sed(focus::text)::jsonb,
    sides = pg_temp.sed(sides::text)::jsonb,
    updated_at = now()
  WHERE to_jsonb(commulingo_history_events)::text LIKE '%사회통일당%';
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> 4 THEN
    RAISE EXCEPTION 'expected 4 events, updated %', n;
  END IF;

  UPDATE commulingo_history_event_people SET
    relation_ko = pg_temp.sed(relation_ko), note_ko = pg_temp.sed(note_ko)
  WHERE relation_ko LIKE '%사회통일당%' OR note_ko LIKE '%사회통일당%';

  IF EXISTS (SELECT 1 FROM commulingo_history_events e WHERE to_jsonb(e)::text LIKE '%사회통일당%')
     OR EXISTS (SELECT 1 FROM commulingo_history_event_people ep WHERE to_jsonb(ep)::text LIKE '%사회통일당%') THEN
    RAISE EXCEPTION 'old spelling left';
  END IF;
END $$;

COMMIT;
