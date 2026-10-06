-- 295: an office page can hold several formal post lineages ("tracks"), e.g.
-- 농업인민위원 → 농업장관 beside the 국가농공위원회 chairmen, or the finance
-- ministers beside the State Bank chairmen. commulingo_offices.tracks lists them
-- in display order ([{id, title:{ko,en}, blurb:{ko,en}}]); a row names its track.
-- A row with no track, or a track the office does not list, falls into a
-- default section, so existing rows keep rendering unchanged.

BEGIN;
ALTER TABLE commulingo_offices ADD COLUMN IF NOT EXISTS tracks jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE commulingo_office_rows ADD COLUMN IF NOT EXISTS track_id text;
COMMIT;
