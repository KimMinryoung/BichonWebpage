-- 2026-10-01: position collections for two Hungarian cards registered today.
-- Szálasi (Arrow Cross leader) joins the Nazi/fascist and counter-revolution
-- collections like Hitler and Mussolini; Vas (MDP politburo, planning chief) is a communist.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('fascist', 'ferenc-szalasi'),
    ('counterrevolution', 'ferenc-szalasi'),
    ('communist', 'zoltan-vas')
ON CONFLICT DO NOTHING;
COMMIT;
