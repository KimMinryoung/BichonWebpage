-- 2026-10-01: "레닌 소년단" / "Lenin Boys" (Szamuely's 1919 terror squad, glossary
-- lenin-boys) linked its first word to Lenin's person card. Block the phrase in
-- the person pass everywhere; the term pass still links it to lenin-boys.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '레닌 소년단', '1919년 헝가리 서무엘리의 테러 부대(용어 lenin-boys). 레닌 인물 카드로 오링크 방지', 'phrase'),
    ('en', 'Lenin Boys', 'Szamuely''s 1919 Hungarian terror squad (term lenin-boys); not Lenin', 'phrase')
ON CONFLICT DO NOTHING;
COMMIT;
