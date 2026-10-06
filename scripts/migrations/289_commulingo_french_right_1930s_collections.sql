-- 2026-10-06: political-position collections for the eight 1930s French right
-- cards registered with scripts/content/french-right-1930s-people-20261006.json.
-- All are filed under counterrevolution like Maurras, Daudet, La Rocque,
-- Taittinger and Coty; the leaders and propagandists of openly fascist
-- organizations (Francisme, Solidarité Française, the Cagoule, the RNP, the
-- Milice, Je suis partout) are also fascist, as Doriot is.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('counterrevolution', 'maurice-pujo'),
    ('counterrevolution', 'xavier-vallat'),
    ('counterrevolution', 'marcel-bucard'),
    ('counterrevolution', 'jean-renaud'),
    ('counterrevolution', 'eugene-deloncle'),
    ('counterrevolution', 'marcel-deat'),
    ('counterrevolution', 'philippe-henriot'),
    ('counterrevolution', 'robert-brasillach'),
    ('fascist', 'marcel-bucard'),
    ('fascist', 'jean-renaud'),
    ('fascist', 'eugene-deloncle'),
    ('fascist', 'marcel-deat'),
    ('fascist', 'philippe-henriot'),
    ('fascist', 'robert-brasillach')
ON CONFLICT DO NOTHING;
COMMIT;
