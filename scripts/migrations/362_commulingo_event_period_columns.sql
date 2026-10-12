-- 362: an event's period is stored as year/month/day columns, like career
-- entries (career-period.js), instead of the free-text period_label.
--
-- start_year/end_year were generated from period_label (338); they become
-- ordinary columns, joined by month and day columns, filled from the labels
-- (2026-10-12 census: 131 distinct labels, all 1917, 1917.02, 1917–1921,
-- 1917.03–1920.10, 1917.02–07 or 1938–1944.03). A single date has no end.
-- Readers format the period with formatPeriod; 363 drops period_label once
-- the code no longer reads it.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_history_events ALTER COLUMN start_year DROP EXPRESSION;
ALTER TABLE commulingo_history_events ALTER COLUMN end_year DROP EXPRESSION;
ALTER TABLE commulingo_history_events
    ADD COLUMN start_month smallint, ADD COLUMN start_day smallint,
    ADD COLUMN end_month smallint, ADD COLUMN end_day smallint;

DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM commulingo_history_events WHERE btrim(period_label) <> ''
            AND btrim(period_label) !~ '^\d{4}(\.\d{2})?(–(\d{4}(\.\d{2})?|\d{2}))?$') THEN
        RAISE EXCEPTION 'unparsed event period_label';
    END IF;
END $$;

UPDATE commulingo_history_events e SET
    start_year = m[1]::integer,
    start_month = m[2]::smallint,
    start_day = NULL,
    end_year = CASE WHEN m[3] IS NOT NULL THEN m[3]::integer WHEN m[5] IS NOT NULL THEN m[1]::integer END,
    end_month = COALESCE(m[4], m[5])::smallint,
    end_day = NULL
FROM (SELECT id, regexp_match(btrim(period_label), '^(\d{4})(?:\.(\d{2}))?(?:–(?:(\d{4})(?:\.(\d{2}))?|(\d{2})))?$') AS m
      FROM commulingo_history_events) p
WHERE p.id = e.id AND p.m IS NOT NULL;

UPDATE commulingo_history_events SET start_year = NULL, end_year = NULL
WHERE btrim(period_label) = '';

ALTER TABLE commulingo_history_events ADD CONSTRAINT commulingo_history_events_period CHECK (
    (start_month IS NULL OR start_month BETWEEN 1 AND 12)
    AND (end_month IS NULL OR end_month BETWEEN 1 AND 12)
    AND (start_day IS NULL OR (start_month IS NOT NULL AND start_day BETWEEN 1 AND 31))
    AND (end_day IS NULL OR (end_month IS NOT NULL AND end_day BETWEEN 1 AND 31))
    AND (start_month IS NULL OR start_year IS NOT NULL)
    AND (end_month IS NULL OR end_year IS NOT NULL)
    AND (end_year IS NULL OR (start_year IS NOT NULL
        AND (end_year, COALESCE(end_month, 12), COALESCE(end_day, 31)) >= (start_year, COALESCE(start_month, 1), COALESCE(start_day, 1))))
);

COMMENT ON COLUMN commulingo_history_events.start_year IS 'Period start [year, month, day]; formatted by career-period.js formatPeriod.';
COMMENT ON COLUMN commulingo_history_events.end_year IS 'Period end [year, month, day], NULL for a single date.';
COMMIT;
