-- A one-sentence introduction per history event (owner, 2026-11-28): what
-- happened, when, who and how it ended, in one sentence. It opens the event
-- page in the place the question line held, and stands in for the event in a
-- link preview and on the event list. Hand-written, not derived from the
-- summary, whose opening sentence often gives background first. Empty until
-- written; readers fall back to the summary.
BEGIN;
ALTER TABLE commulingo_history_events
    ADD COLUMN IF NOT EXISTS blurb_ko TEXT NOT NULL DEFAULT '',
    ADD COLUMN IF NOT EXISTS blurb_en TEXT NOT NULL DEFAULT '';
COMMIT;
