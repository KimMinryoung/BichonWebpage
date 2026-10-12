-- 365: drop the free-text term periods (period_label, frozen since 071, and
-- period_ko/period_en) now that every reader formats the columns from 364.

BEGIN;
SET LOCAL lock_timeout = '5s';
ALTER TABLE commulingo_terms DROP COLUMN period_label, DROP COLUMN period_ko, DROP COLUMN period_en;
COMMIT;
