-- 2026-10-07: link-fire audit after registering people-extra-20261007-d. 마흐무트 카밀 파샤
-- (Ottoman Third Army commander, 1916; nikolai-yudenich section) is not Kâmil Pasha the
-- grand vizier; the ballet 『파피용』 (doc much-of-a-muchness) and other bare Papillon are not
-- Jean-François Papillon, who is named in full where he appears.
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('ko', '마흐무트 카밀 파샤', 'Mahmud Kâmil Pasha (Third Army, 1916), not the grand vizier Kâmil Pasha', 'phrase'),
    ('en', 'mahmud kâmil pasha', 'Mahmud Kâmil Pasha (Third Army, 1916), not the grand vizier Kâmil Pasha', 'phrase'),
    ('ko', '파피용', 'Jean-François Papillon''s surname; also the ballet Le Papillon', 'alias'),
    ('en', 'papillon', 'Jean-François Papillon''s surname; also the ballet and the French word', 'alias')
ON CONFLICT DO NOTHING;
COMMIT;
