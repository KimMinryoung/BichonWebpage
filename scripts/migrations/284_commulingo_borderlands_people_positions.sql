-- 2026-10-04: political-position collections for the person cards registered
-- with the Russian Civil War child events bessarabia-1917-1924,
-- belarus-1917-1921 and volga-ural-crimea-1917-1921
-- (dev_docs/commulingo-civil-war-theaters-20261004.md). Communists: Klyushnikov,
-- Zhylunovich, Vakhitov, Ibraimov. National movements: Halippa, Pelivan,
-- Lastouski, Krecheuski, Validi, Maksudi, Çelebicihan, Seydahmet as
-- nationalist. The SR leaders of the Bessarabian and Belarusian councils
-- (Inculeț, Erhan, Sierada, Luckievič) as non-Bolshevik socialists.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('communist', 'andrei-klyushnikov'),
    ('communist', 'zmicier-zhylunovich'),
    ('communist', 'mullanur-vakhitov'),
    ('communist', 'veli-ibraimov'),
    ('nationalist', 'pan-halippa'),
    ('nationalist', 'ion-pelivan'),
    ('nationalist', 'vaclau-lastouski'),
    ('nationalist', 'piotra-krecheuski'),
    ('nationalist', 'zaki-validi'),
    ('nationalist', 'sadri-maksudi'),
    ('nationalist', 'noman-celebicihan'),
    ('nationalist', 'cafer-seydahmet'),
    ('non-bolshevik-socialist', 'ion-inculet'),
    ('non-bolshevik-socialist', 'pantelimon-erhan'),
    ('non-bolshevik-socialist', 'jan-sierada'),
    ('non-bolshevik-socialist', 'anton-luckievic')
ON CONFLICT DO NOTHING;
COMMIT;
