-- 372: an office row says which seat it fills, head of state or head of
-- government (2026-10-23).
--
-- The France lineage puts a regime's heads of state and its heads of
-- government in one track; sorted by start date in a single list, Macron's row
-- was followed by seven prime ministers at the same level and nothing showed
-- they all served under him. `seat` lets the office page lay a track out in two
-- columns, each head of government beside the head of state in office when it
-- began. NULL (every Soviet row, collective bodies) keeps the single list.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_office_rows
    ADD COLUMN IF NOT EXISTS seat TEXT;
ALTER TABLE commulingo_office_rows DROP CONSTRAINT IF EXISTS commulingo_office_rows_seat_check;
ALTER TABLE commulingo_office_rows
    ADD CONSTRAINT commulingo_office_rows_seat_check
    CHECK (seat IN ('state', 'government'));

COMMIT;
