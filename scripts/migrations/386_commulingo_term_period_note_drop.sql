-- The free-text remark beside a term's years (period_note_ko/en, shown as
-- "1917–1921 (전성기)") is removed (2026-11-27, owner's decision): the years
-- are the structured period, period_label stays for what the numbers cannot
-- say, and a fact about the dates belongs in the body. The facts found only in
-- a note were moved into the bodies before this ran
-- (scripts/content/term-period-note-removal-20261127/). Apply after the
-- release that stops reading the columns is deployed.
BEGIN;
ALTER TABLE commulingo_terms DROP COLUMN IF EXISTS period_note_ko, DROP COLUMN IF EXISTS period_note_en;
COMMIT;
