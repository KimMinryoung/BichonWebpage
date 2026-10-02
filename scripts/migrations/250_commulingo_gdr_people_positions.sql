-- 2026-10-02: political-position collections for the ten East German people
-- registered from the queue in
-- dev_docs/commulingo-wwi-east-germany-people-queue-20261002.md (batch 2).
-- KPD/SED functionaries and the SMAD officer Tiulpanov as communist (former
-- Social Democrat Fechner too, as Grotewohl is); the West German SPD leader
-- Schumacher as non-Bolshevik socialist; the CDU leaders Kaiser and Nuschke as
-- conservative / Christian Democrat.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('communist', 'rudolf-herrnstadt'),
    ('communist', 'wilhelm-zaisser'),
    ('communist', 'max-fechner'),
    ('communist', 'ernst-wollweber'),
    ('communist', 'hermann-matern'),
    ('communist', 'anton-ackermann'),
    ('communist', 'sergei-tiulpanov'),
    ('non-bolshevik-socialist', 'kurt-schumacher'),
    ('conservative', 'jakob-kaiser'),
    ('conservative', 'otto-nuschke')
ON CONFLICT DO NOTHING;
COMMIT;
