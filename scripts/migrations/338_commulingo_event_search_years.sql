-- Search the duration of an event, rather than literal year mentions. Keep
-- these stored numeric bounds in sync with editorial period_label changes.
-- Unknown/prose labels stay NULL; do not invent a duration from their text.
BEGIN;
SET LOCAL lock_timeout = '5s';

CREATE OR REPLACE FUNCTION commulingo_event_period_years(label text)
RETURNS integer[] LANGUAGE sql IMMUTABLE STRICT PARALLEL SAFE AS $$
    SELECT CASE WHEN m IS NOT NULL AND m[1]::integer > 0
        AND COALESCE(m[2], m[1])::integer >= m[1]::integer
        THEN ARRAY[m[1]::integer, COALESCE(m[2], m[1])::integer]
        ELSE ARRAY[NULL::integer, NULL::integer] END
    FROM (SELECT regexp_match(btrim(label),
        '^([0-9]{4})(?:\.(?:0[1-9]|1[0-2]))?(?:\s*[-–—~]\s*(?:([0-9]{4})(?:\.(?:0[1-9]|1[0-2]))?|(?:0[1-9]|1[0-2])))?$') AS m) parsed;
$$;

ALTER TABLE commulingo_history_events
    ADD COLUMN IF NOT EXISTS start_year integer GENERATED ALWAYS AS ((commulingo_event_period_years(period_label))[1]) STORED,
    ADD COLUMN IF NOT EXISTS end_year integer GENERATED ALWAYS AS ((commulingo_event_period_years(period_label))[2]) STORED;

COMMENT ON COLUMN commulingo_history_events.start_year IS 'Inclusive start year, generated from the explicit event period (NULL if unknown).';
COMMENT ON COLUMN commulingo_history_events.end_year IS 'Inclusive end year, generated from the explicit event period (NULL if unknown).';
COMMIT;
