-- 2026-10-03: political-position collections for the seventeen people of the
-- last batch of dev_docs/commulingo-wwi-east-germany-people-queue-20261002.md
-- (group B) and curation gaps 2077/2078 (Legien, Sembat). Zaghlul (Wafd) under
-- national liberation; Legien, Sembat, Gniffke and Ollenhauer as non-Bolshevik
-- socialists; Hermes (CDU) as conservative; Havemann, expelled from the SED in
-- 1964, as dissident. Dyer is left without a collection.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('national-liberation', 'saad-zaghloul'),
    ('non-bolshevik-socialist', 'carl-legien'),
    ('non-bolshevik-socialist', 'marcel-sembat'),
    ('non-bolshevik-socialist', 'erich-gniffke'),
    ('non-bolshevik-socialist', 'erich-ollenhauer'),
    ('conservative', 'andreas-hermes'),
    ('communist', 'wolfgang-leonhard'),
    ('communist', 'heinrich-rau'),
    ('communist', 'bruno-leuschner'),
    ('communist', 'fritz-selbmann'),
    ('communist', 'hilde-benjamin'),
    ('communist', 'fred-oelssner'),
    ('communist', 'pyotr-dibrova'),
    ('communist', 'jozef-swiatlo'),
    ('communist', 'ferenc-munnich'),
    ('dissident', 'robert-havemann')
ON CONFLICT DO NOTHING;
COMMIT;
