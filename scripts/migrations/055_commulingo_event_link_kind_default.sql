-- Stop a missing relation_kind from silently meaning "target" (i.e. a victim).
-- The AI backfill (leninbot/scripts/commulingo_backfill_event_links.py) and any
-- future insert that omits relation_kind previously fell through to the column
-- default 'target', libeling mere participants as victims of the event. Make the
-- neutral, human-review bucket 'unclassified' the default instead. The app
-- (routes/commulingo-events.js, history-events-store.js) renders 'unclassified'
-- as a muted, provisional group and never as "Targets & victims".
ALTER TABLE commulingo_history_event_people
    ALTER COLUMN relation_kind SET DEFAULT 'unclassified';
