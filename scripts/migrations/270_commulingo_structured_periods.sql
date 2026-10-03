-- 2026-10-03: career entries and office rows store their period as columns,
-- not as a label to parse. Day precision, a qualifier per side, an ongoing
-- flag and, only for periods the columns cannot say ("1963 또는 1964"), a
-- bilingual override label. The display string is formatted from these by
-- data/commulingo/career-period.js; period_label is dropped once every writer
-- and reader has moved off it (migration 272).
BEGIN;
SET LOCAL lock_timeout = '3s';

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['commulingo_person_career_entries', 'commulingo_office_rows'] LOOP
    EXECUTE format($f$
      ALTER TABLE %1$I
        ADD COLUMN start_day smallint,
        ADD COLUMN end_day smallint,
        ADD COLUMN start_qual text,
        ADD COLUMN end_qual text,
        ADD COLUMN ongoing boolean NOT NULL DEFAULT false,
        ADD COLUMN period_label_ko text,
        ADD COLUMN period_label_en text,
        ADD CONSTRAINT %1$s_start_qual_check CHECK (start_qual IN ('circa','decade','early','mid','late','after','summer')),
        ADD CONSTRAINT %1$s_end_qual_check CHECK (end_qual IN ('circa','decade','early','mid','late','after','summer','until','open','unknown')),
        ADD CONSTRAINT %1$s_month_check CHECK ((start_month BETWEEN 1 AND 12 OR start_month IS NULL) AND (end_month BETWEEN 1 AND 12 OR end_month IS NULL)),
        ADD CONSTRAINT %1$s_day_check CHECK ((start_day IS NULL OR (start_month IS NOT NULL AND start_day BETWEEN 1 AND 31))
                                           AND (end_day IS NULL OR (end_month IS NOT NULL AND end_day BETWEEN 1 AND 31))),
        ADD CONSTRAINT %1$s_label_pair_check CHECK ((period_label_ko IS NULL) = (period_label_en IS NULL))
    $f$, tbl);
  END LOOP;
END $$;

COMMIT;
