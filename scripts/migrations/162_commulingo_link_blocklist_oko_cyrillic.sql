-- 162_commulingo_link_blocklist_oko_cyrillic.sql
-- The Oko satellite entry also carries its Cyrillic name Око as an alias in
-- both languages; Korean prose has no word boundary and the alias matcher
-- runs the same way on Cyrillic, so it fires inside Окопы (a village in the
-- Riga treaty). The headword 오코 조기경보위성 / Oko satellite stays.

BEGIN;

INSERT INTO commulingo_link_blocklist (kind, lang, phrase, note) VALUES
('term-alias', 'ko', 'Око', '오코 위성의 키릴 별칭 — Окопы 같은 낱말 속에서 걸린다'),
('term-alias', 'en', 'Око', 'Cyrillic alias of the Oko satellite fires inside Окопы and similar words')
ON CONFLICT (kind, lang, phrase) DO NOTHING;

COMMIT;
