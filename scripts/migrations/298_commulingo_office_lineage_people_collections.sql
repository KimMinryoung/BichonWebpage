-- 298: political-position collections for the people registered from the
-- 2026-10-06 office lineages (2026-10-07). Sosnovsky and Maksimovsky signed the
-- Declaration of the 46 and are filed with the Left Opposition like Sapronov;
-- the six whose party membership the sources do not state (Tikhonov the
-- non-party poet, Pulatov, Raevsky, Andrei Zverev, Chernoivanov, Doguzhiev)
-- are left unclassified.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('communist', 'semyon-sereda'),
    ('communist', 'vasily-yakovenko'),
    ('communist', 'nikolai-kubyak'),
    ('communist', 'alexei-kozlov'),
    ('communist', 'konstantin-pysin'),
    ('communist', 'ivan-volovchenko'),
    ('communist', 'vladilen-nikitin'),
    ('communist', 'pyotr-tyurkin'),
    ('communist', 'vladimir-stavsky'),
    ('communist', 'vladimir-karpov'),
    ('communist', 'pyotr-smirnov'),
    ('communist', 'pyotr-smirnov-svetlovsky'),
    ('communist', 'isidor-gukovsky'),
    ('communist', 'vladimir-orlov'),
    ('communist', 'nikolai-tumanov'),
    ('communist', 'solomon-kruglikov'),
    ('communist', 'alexei-grichmanov'),
    ('communist', 'nikolai-garetovsky'),
    ('communist', 'yevgeny-chvyalev'),
    ('communist', 'pavel-kumykin'),
    ('communist', 'ruben-katanyan'),
    ('left-opposition', 'lev-sosnovsky'),
    ('communist', 'alexander-krinitsky'),
    ('communist', 'georgy-smirnov'),
    ('communist', 'yuri-sklyarov'),
    ('communist', 'alexander-kapto'),
    ('communist', 'alexander-degtyaryov'),
    ('communist', 'anuar-alimzhanov'),
    ('left-opposition', 'vladimir-maksimovsky'),
    ('communist', 'alfred-lepa'),
    ('communist', 'arkady-alsky'),
    ('communist', 'konstantin-gey'),
    ('communist', 'ivan-moskvin'),
    ('communist', 'dmitry-bulatov'),
    ('communist', 'grigory-gromov'),
    ('communist', 'yevgeny-gromov'),
    ('communist', 'viktor-churayev'),
    ('communist', 'vitaly-titov'),
    ('communist', 'yuri-manayenkov'),
    ('communist', 'mikhail-polekhin'),
    ('communist', 'nikolai-voronovsky'),
    ('communist', 'vitaly-konovalov'),
    ('communist', 'oleg-shishkin'),
    ('communist', 'nikolai-konstantinovich-sokolov')
ON CONFLICT DO NOTHING;
COMMIT;
