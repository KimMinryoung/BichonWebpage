-- 2026-10-04: political-position collections for the person cards registered
-- with the event finland-1917-1920 (dev_docs/commulingo-civil-war-theaters-20261004.md).
-- Gylling, Haapalainen and Rahja went on to the Communist Party of Finland and
-- Soviet service (as Kuusinen and Manner); Aaltonen, a Social Democrat killed
-- before that party existed, as revolutionary socialist; Tokoi, who sat in the
-- Red government and later broke with the communists, as a non-Bolshevik
-- socialist; President Ståhlberg as liberal-republican.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('communist', 'edvard-gylling'),
    ('communist', 'eero-haapalainen'),
    ('communist', 'eino-rahja'),
    ('revolutionary-socialist', 'ali-aaltonen'),
    ('non-bolshevik-socialist', 'oskari-tokoi'),
    ('liberal-republican', 'kaarlo-juho-stahlberg')
ON CONFLICT DO NOTHING;
COMMIT;
