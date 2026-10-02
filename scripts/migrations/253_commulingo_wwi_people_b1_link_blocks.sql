-- 2026-10-02: link blocks for the people of migration 252
-- (audit-family-name-collisions). 바우어/Bauer is Gustav Bauer's surname but in
-- prose mostly Otto Bauer (the Austromarxist, and a Nazi official in Lviv), so
-- the bare name never links; 구스타프 바우어 still does. English alias rows are
-- lowercase (236). The English "Curzon Line" (25 passages) is the line, not
-- the man; the Korean 커즌선 does not fire.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '바우어', '구스타프 바우어의 성이지만 본문에서는 대개 오토 바우어', 'alias'),
    ('en', 'bauer', 'Gustav Bauer''s surname, but mostly Otto Bauer in prose', 'alias'),
    ('en', 'Curzon Line', 'The demarcation line; not George Curzon', 'phrase')
ON CONFLICT DO NOTHING;
COMMIT;
