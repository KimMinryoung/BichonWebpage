-- Work queue for event-led curation.
--
-- The people and glossary lanes used to pick their own targets: the sparsest
-- person card, an unregistered concept from whatever report came up in the
-- rotation. That fills the dictionaries evenly but leaves the history events —
-- the pages a reader actually arrives on — surrounded by names and terms that
-- do not resolve. This table inverts the order. The event lane writes a
-- section, notices what that section needed and the site does not have, and
-- files it here; the people and glossary lanes then drain the queue instead of
-- choosing for themselves.
--
-- A row is a request, not an edit. `status` moves pending -> claimed -> done
-- (or 'skipped' when a lane judges the gap not worth a card), and the lane that
-- resolves it writes back which entry it produced.

CREATE TABLE IF NOT EXISTS commulingo_curation_gaps (
    id           BIGSERIAL PRIMARY KEY,
    -- What kind of entry would close the gap.
    kind         TEXT NOT NULL CHECK (kind IN ('person', 'term', 'doc')),
    -- The event whose text needed it. Kept as plain text rather than a FK so a
    -- renamed or retired event never deletes the curation record.
    event_id     TEXT NOT NULL DEFAULT '',
    -- Existing entry id when the gap is "this card is too thin", empty when the
    -- entry does not exist yet.
    target_id    TEXT NOT NULL DEFAULT '',
    -- What the event text calls it, in both languages, so the lane can search.
    label_ko     TEXT NOT NULL DEFAULT '',
    label_en     TEXT NOT NULL DEFAULT '',
    -- Why the event narrative needs it. This is the brief the consuming lane
    -- works from, so it is required to be non-empty at the tool layer.
    reason       TEXT NOT NULL DEFAULT '',
    -- Higher runs first. The event lane sets it from how load-bearing the gap
    -- is in the section it just wrote.
    priority     INTEGER NOT NULL DEFAULT 0,
    status       TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'claimed', 'done', 'skipped')),
    -- Filled by the lane that resolves the row.
    resolved_id  TEXT NOT NULL DEFAULT '',
    resolution   TEXT NOT NULL DEFAULT '',
    claimed_by   TEXT NOT NULL DEFAULT '',
    claimed_at   TIMESTAMPTZ,
    created_by   TEXT NOT NULL DEFAULT '',
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- The consuming lanes' only query: highest-priority pending row of one kind.
CREATE INDEX IF NOT EXISTS commulingo_curation_gaps_queue_idx
    ON commulingo_curation_gaps (kind, status, priority DESC, id);

-- Two sections of the same event routinely need the same person. Re-filing the
-- gap each time would have the people lane write the same card twice, so an
-- open request for a given kind+label is unique. Partial, so the history of
-- resolved rows still accumulates.
CREATE UNIQUE INDEX IF NOT EXISTS commulingo_curation_gaps_open_uniq
    ON commulingo_curation_gaps (kind, lower(label_ko), lower(label_en))
    WHERE status IN ('pending', 'claimed');
