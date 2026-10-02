-- 2026-10-02: link blocks for the ten East German people of migration 250
-- (audit-family-name-collisions). 카이저/Kaiser is Jakob Kaiser's surname but in
-- prose mostly means the emperor (Kühlmann's letter to the Kaiser in pravda,
-- Bernstein, Nkrumah), so the bare name never links; 야코프 카이저 still does.
-- English alias rows are lowercase (236). 「힐베르트와 아커만」 is the logician
-- Wilhelm Ackermann, not Anton Ackermann.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '카이저', '야코프 카이저의 성이지만 본문에서는 대개 독일 황제(카이저)', 'alias'),
    ('en', 'kaiser', 'Jakob Kaiser''s surname, but mostly the German emperor (the Kaiser)', 'alias'),
    ('ko', '힐베르트와 아커만', '논리학자 빌헬름 아커만. 안톤 아커만으로 오링크 방지', 'phrase'),
    ('en', 'Hilbert and Ackermann', 'Logician Wilhelm Ackermann; not Anton Ackermann', 'phrase')
ON CONFLICT DO NOTHING;
COMMIT;
