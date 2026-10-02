-- 2026-10-02: He Long's family name "He" matched the English pronoun at the
-- start of a sentence (audit-family-name-collisions: 4,436 candidate matches;
-- it linked on the hungary-1944-1945 page). Never link the bare surname;
-- "He Long" still links. English alias rows are lowercase (see 236).
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('en', 'he', 'He Long''s surname, but almost always the pronoun He', 'alias')
ON CONFLICT DO NOTHING;
COMMIT;
