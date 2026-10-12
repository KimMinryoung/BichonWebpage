-- 364: a glossary term's period is stored as columns, like career entries and
-- events (career-period.js), instead of the free-text period_ko/period_en.
--
-- start_year/end_year already existed as hand-kept sort years; they become
-- the period's own years, joined by month/day, a qualifier per side (decade,
-- early/mid/late, circa, after; end-only open), ongoing ("–현재"), an override
-- label for what the columns cannot say ("개념", "19세기 말–현재", several
-- spans) and a note for the parenthetical that followed many periods
-- ("1917–1921 (전성기)"). The rows are converted by the data-only
-- term-structured-periods-20261012.sql; 365 drops the text columns.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_terms
    ADD COLUMN start_month smallint, ADD COLUMN start_day smallint,
    ADD COLUMN end_month smallint, ADD COLUMN end_day smallint,
    ADD COLUMN start_qual text, ADD COLUMN end_qual text,
    ADD COLUMN ongoing boolean NOT NULL DEFAULT false,
    ADD COLUMN period_label_ko text, ADD COLUMN period_label_en text,
    ADD COLUMN period_note_ko text, ADD COLUMN period_note_en text;

ALTER TABLE commulingo_terms ADD CONSTRAINT commulingo_terms_period CHECK (
    (start_month IS NULL OR start_month BETWEEN 1 AND 12)
    AND (end_month IS NULL OR end_month BETWEEN 1 AND 12)
    AND (start_day IS NULL OR (start_month IS NOT NULL AND start_day BETWEEN 1 AND 31))
    AND (end_day IS NULL OR (end_month IS NOT NULL AND end_day BETWEEN 1 AND 31))
    AND (start_month IS NULL OR start_year IS NOT NULL)
    AND (end_month IS NULL OR end_year IS NOT NULL)
    AND (start_qual IS NULL OR start_qual IN ('circa', 'decade', 'early', 'mid', 'late', 'after', 'summer'))
    AND (end_qual IS NULL OR end_qual IN ('circa', 'decade', 'early', 'mid', 'late', 'after', 'summer', 'until', 'open', 'unknown'))
    AND ((period_label_ko IS NULL) = (period_label_en IS NULL))
    AND ((period_note_ko IS NULL) = (period_note_en IS NULL))
);
COMMIT;
