-- How an office page shows its tracks (views/public/commulingo-office.ejs):
-- 'auto'     more than two tracks get the line picker, otherwise every list shows;
-- 'list'     every list shows (short single chains whose name only changed by era);
-- 'numbered' the picker, numbering the lines below the leading row (state security,
--            where the KGB directorate numbers give the order).
BEGIN;

ALTER TABLE commulingo_offices ADD COLUMN IF NOT EXISTS track_display TEXT NOT NULL DEFAULT 'auto';
ALTER TABLE commulingo_offices DROP CONSTRAINT IF EXISTS commulingo_offices_track_display_check;
ALTER TABLE commulingo_offices ADD CONSTRAINT commulingo_offices_track_display_check
    CHECK (track_display IN ('auto', 'list', 'numbered'));

-- Owner's decision 2026-11-21: numbers on state security only; the four short
-- single chains show every list.
UPDATE commulingo_offices SET track_display = 'numbered' WHERE id = 'state-security';
UPDATE commulingo_offices SET track_display = 'list'
 WHERE id IN ('state-head', 'head-of-government', 'foreign-affairs', 'party-leadership');

COMMIT;
