-- 2026-10-03: drop the free-text period_label of career entries and office
-- rows. Since migration 270 every writer sends structured columns and every
-- reader formats from them (frontend career-period.js, leninbot
-- commulingo/periods.py); 271 converted the old labels. Events and terms keep
-- their own period_label — a different column.
BEGIN;
SET LOCAL lock_timeout = '3s';
ALTER TABLE commulingo_person_career_entries DROP COLUMN period_label;
ALTER TABLE commulingo_office_rows DROP COLUMN period_label;
COMMIT;
