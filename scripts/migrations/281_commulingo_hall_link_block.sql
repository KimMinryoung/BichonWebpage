-- 2026-10-04: "Hall" is Gus Hall's surname, but in English prose it is almost
-- always a building or a phrase (Hall of Columns, Great Hall of the People,
-- Beer Hall Putsch, Town Hall, Workers' Hall, the Hall effect): 52 fires in 41
-- passages by audit-link-fires, nearly all wrong. The bare name never links;
-- Gus Hall still does. English alias rows are lowercase (236).
BEGIN;
INSERT INTO commulingo_link_blocklist (lang, phrase, note, kind) VALUES
    ('en', 'hall', 'Gus Hall''s surname, but in prose almost always a building or phrase (Hall of Columns, Beer Hall Putsch, Town Hall)', 'alias')
ON CONFLICT DO NOTHING;
COMMIT;
