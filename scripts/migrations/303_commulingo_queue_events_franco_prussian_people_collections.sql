-- 2026-10-07: political-position collections for the person cards registered
-- with the event franco-prussian-war-1870-1871 (scripts/content/queue-events-20261007/
-- REPORT-franco-prussian-war-1870-1871.md). Bismarck and Moltke as conservatives;
-- Napoleon III, Wilhelm I and Trochu (Orleanist general) as monarchists;
-- Gambetta and Favre as liberal republicans.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('conservative', 'otto-von-bismarck'),
    ('conservative', 'helmuth-von-moltke'),
    ('monarchist', 'napoleon-iii'),
    ('monarchist', 'wilhelm-i'),
    ('monarchist', 'louis-jules-trochu'),
    ('liberal-republican', 'leon-gambetta'),
    ('liberal-republican', 'jules-favre')
ON CONFLICT DO NOTHING;
COMMIT;
