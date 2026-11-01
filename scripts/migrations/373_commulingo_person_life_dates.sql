-- 373: exact birth and death dates on person cards (2026-11-01).
--
-- years_label keeps the years every card shows. A date is stored only when a
-- source gives the month: [year, month] or [year, month, day], Gregorian. The
-- person page shows it ("1891년 1월 24일 – 1945년 4월 21일"); a person without
-- one keeps the years. Its year must be the exact year in years_label
-- (data/commulingo/person-life-dates.js checks the day as well).

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_people
    ADD COLUMN IF NOT EXISTS birth_date INTEGER[],
    ADD COLUMN IF NOT EXISTS death_date INTEGER[];

ALTER TABLE commulingo_people DROP CONSTRAINT IF EXISTS commulingo_person_life_dates;
ALTER TABLE commulingo_people ADD CONSTRAINT commulingo_person_life_dates CHECK (
    (birth_date IS NULL OR (cardinality(birth_date) BETWEEN 2 AND 3
        AND birth_date[1] = birth_year
        AND birth_date[2] BETWEEN 1 AND 12
        AND (cardinality(birth_date) = 2 OR birth_date[3] BETWEEN 1 AND 31)))
    AND
    (death_date IS NULL OR (cardinality(death_date) BETWEEN 2 AND 3
        AND death_date[1] = death_year
        AND death_date[2] BETWEEN 1 AND 12
        AND (cardinality(death_date) = 2 OR death_date[3] BETWEEN 1 AND 31)))
);

COMMENT ON COLUMN commulingo_people.birth_date IS '[year, month] or [year, month, day] (Gregorian) when the source gives the month; year = birth_year';
COMMENT ON COLUMN commulingo_people.death_date IS '[year, month] or [year, month, day] (Gregorian) when the source gives the month; year = death_year';

COMMIT;
