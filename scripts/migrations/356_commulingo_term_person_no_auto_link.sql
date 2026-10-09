-- 356: per-page auto-link refusals for glossary terms and person pages
-- (2026-10-09).
--
-- Events have carried no_auto_link since 154 and reference documents declare
-- noAutoLink in their entry, but a term or person page whose prose uses a
-- dictionary word in another sense (프랑스 혁명가 블랑키 on the Blanquism page)
-- could only be fixed by rewording the prose. Same shape as the event column:
-- a JSON array of exact strings the page's prose does not auto-link.

BEGIN;
SET LOCAL lock_timeout = '5s';

ALTER TABLE commulingo_terms
    ADD COLUMN IF NOT EXISTS no_auto_link jsonb NOT NULL DEFAULT '[]';
ALTER TABLE commulingo_people
    ADD COLUMN IF NOT EXISTS no_auto_link jsonb NOT NULL DEFAULT '[]';

COMMENT ON COLUMN commulingo_terms.no_auto_link IS
    'Strings this term''s definition and body refuse to auto-link (same shape as commulingo_history_events.no_auto_link).';
COMMENT ON COLUMN commulingo_people.no_auto_link IS
    'Strings this person''s card and sections refuse to auto-link (same shape as commulingo_history_events.no_auto_link).';

COMMIT;
