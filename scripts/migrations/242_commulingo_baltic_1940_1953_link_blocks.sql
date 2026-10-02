-- 2026-10-02: link blocks for the new people of the Baltic 1940–1953 batch
-- (audit-family-name-collisions):
--   로젠베르크/Rosenberg (Alfred Rosenberg) is also Marcel Rosenberg (Soviet
--   ambassador in Spain), Arthur Rosenberg (historian) and Julius Rosenberg, so
--   the bare surname never links; 알프레트 로젠베르크 still does. English alias
--   rows are lowercase (236).
--   바레스 (Johannes Vares) fired on Maurice Barrès; 웰스 (Sumner Welles) inside
--   the term 커뮤니티 웰스 빌딩.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '로젠베르크', '알프레트 로젠베르크의 성이지만 마르셀·아르투어·줄리어스 로젠베르크와 겹침', 'alias'),
    ('en', 'rosenberg', 'Alfred Rosenberg''s surname, shared with Marcel, Arthur and Julius Rosenberg', 'alias'),
    ('ko', '모리스 바레스', '프랑스 작가. 요하네스 바레스로 오링크 방지', 'phrase'),
    ('ko', '커뮤니티 웰스', '용어 커뮤니티 웰스 빌딩. 섬너 웰스로 오링크 방지', 'phrase')
ON CONFLICT DO NOTHING;
COMMIT;
