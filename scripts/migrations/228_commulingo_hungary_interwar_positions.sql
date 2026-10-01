-- 2026-10-01: political-position collections for the 21 people of the
-- hungary-interwar-20261001 batch (1919 Soviet Republic, Horthy regime, Axis Hungary).
-- Communists of 1919 and the underground; Social Democrats of 1919–21 as
-- non-Bolshevik socialists; Horthy-era rulers next to Horthy (counterrevolution),
-- with Gömbös and Imrédy (Party of Hungarian Renewal) also as fascists.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('communist', 'tibor-szamuely'),
    ('communist', 'jeno-landler'),
    ('communist', 'otto-korvin'),
    ('communist', 'imre-sallai'),
    ('communist', 'sandor-furst'),
    ('communist', 'zoltan-schonherz'),
    ('communist', 'ferenc-rozsa'),
    ('non-bolshevik-socialist', 'sandor-garbai'),
    ('non-bolshevik-socialist', 'vilmos-bohm'),
    ('non-bolshevik-socialist', 'gyula-peidl'),
    ('non-bolshevik-socialist', 'karoly-peyer'),
    ('liberal-republican', 'mihaly-karolyi'),
    ('counterrevolution', 'istvan-bethlen'),
    ('conservative', 'istvan-bethlen'),
    ('counterrevolution', 'pal-teleki'),
    ('conservative', 'pal-teleki'),
    ('counterrevolution', 'pal-pronay'),
    ('conservative', 'albert-apponyi'),
    ('monarchist', 'albert-apponyi'),
    ('counterrevolution', 'gyula-gombos'),
    ('fascist', 'gyula-gombos'),
    ('counterrevolution', 'bela-imredy'),
    ('fascist', 'bela-imredy'),
    ('counterrevolution', 'laszlo-bardossy'),
    ('nationalist', 'laszlo-bardossy'),
    ('conservative', 'miklos-kallay'),
    ('counterrevolution', 'gusztav-jany')
ON CONFLICT DO NOTHING;
COMMIT;
