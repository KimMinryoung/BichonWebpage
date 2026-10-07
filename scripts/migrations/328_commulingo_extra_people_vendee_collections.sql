-- 2026-10-07: political-position collections for the Vendée follow-up cards
-- (scripts/content/queue-events-20261007/people-extra-20261007-c.js, REPORT-people-extra-c.md).
-- Marceau, a republican general with no position on record, is left out (Kléber/Hoche precedent).
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('counterrevolution', 'charles-de-bonchamps'),
    ('counterrevolution', 'louis-marie-de-lescure'),
    ('counterrevolution', 'georges-cadoudal'),
    ('counterrevolution', 'joseph-de-puisaye'),
    ('jacobin', 'jean-antoine-rossignol')
ON CONFLICT DO NOTHING;
