-- 363: drop the free-text event period_label now that every reader formats
-- the period columns from 362, and the parser that generated the years.

BEGIN;
SET LOCAL lock_timeout = '5s';
ALTER TABLE commulingo_history_events DROP COLUMN period_label;
DROP FUNCTION IF EXISTS commulingo_event_period_years(text);
COMMIT;
