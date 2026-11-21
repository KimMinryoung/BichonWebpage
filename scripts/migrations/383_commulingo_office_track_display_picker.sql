-- track_display gains 'picker': the line picker even with only two tracks
-- (heavy industry and military industry, owner's decision 2026-11-21).
BEGIN;

ALTER TABLE commulingo_offices DROP CONSTRAINT IF EXISTS commulingo_offices_track_display_check;
ALTER TABLE commulingo_offices ADD CONSTRAINT commulingo_offices_track_display_check
    CHECK (track_display IN ('auto', 'list', 'picker', 'numbered'));

COMMIT;
