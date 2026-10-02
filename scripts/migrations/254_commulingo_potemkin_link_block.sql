-- 2026-10-02: 포툠킨/Potemkin is Vladimir Potemkin's surname, but in prose it is
-- almost always the battleship (1905 mutiny, Eisenstein's film): 38 Korean and
-- 43 English fires, all but his own card and one Nazi-Soviet pact sentence about
-- the ship. The bare name never links; 블라디미르 포툠킨 / Vladimir Potemkin
-- still do. English alias rows are lowercase (236).
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '포툠킨', '블라디미르 포툠킨의 성이지만 본문에서는 대개 전함 포툠킨', 'alias'),
    ('en', 'potemkin', 'Vladimir Potemkin''s surname, but mostly the battleship in prose', 'alias')
ON CONFLICT DO NOTHING;
COMMIT;
