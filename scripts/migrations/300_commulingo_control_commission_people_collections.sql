-- 300: political-position collection for the eight control-commission holders
-- registered on 2026-10-07 (scripts/content/control-commission-people-20261007.json).
-- All eight are documented party members, Orlov included (КПСС 1957–1991).
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('communist', 'karl-lander'),
    ('communist', 'pavel-komarov'),
    ('communist', 'yevgeny-makhov'),
    ('communist', 'zakhar-belenky'),
    ('communist', 'alexander-pavelyev'),
    ('communist', 'vasily-zhavoronkov'),
    ('communist', 'georgy-yenyutin'),
    ('communist', 'alexander-kondratyevich-orlov')
ON CONFLICT DO NOTHING;
COMMIT;
