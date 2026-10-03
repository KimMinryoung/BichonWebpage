-- 2026-10-03: link blocks for the people of migration 264
-- (audit-family-name-collisions). The bare surnames are ordinary syllables or
-- other things in prose: 라우 inside 라우카아 and 라우터부르크, 다이어 inside
-- 다이어리, Hermes the model name (Hermes 4) and the god. The full names
-- (하인리히 라우, 레지널드 다이어, 안드레아스 헤르메스) still link. English
-- alias rows are lowercase (236).
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '라우', '하인리히 라우의 성이지만 라우카아·라우터부르크 같은 낱말 속 음절', 'alias'),
    ('en', 'rau', 'Heinrich Rau''s surname; also Johannes Rau and others', 'alias'),
    ('ko', '다이어', '레지널드 다이어의 성이지만 다이어리 같은 낱말 속 음절', 'alias'),
    ('en', 'dyer', 'Reginald Dyer''s surname; a common English surname and word', 'alias'),
    ('ko', '헤르메스', '안드레아스 헤르메스의 성이지만 대개 그리스 신 또는 제품명', 'alias'),
    ('en', 'hermes', 'Andreas Hermes''s surname, but mostly the god or a product name (Hermes 4)', 'alias')
ON CONFLICT DO NOTHING;
COMMIT;
