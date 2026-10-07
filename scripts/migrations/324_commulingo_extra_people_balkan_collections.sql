-- 2026-10-07: political-position collections for the Balkan Wars follow-up cards
-- (scripts/content/queue-events-20261007/people-extra-20261007-b.js, REPORT-people-extra-b.md).
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('communist', 'dimitrije-tucovic'),
    ('nationalist', 'talat-pasha'),
    ('monarchist', 'constantine-i-of-greece')
ON CONFLICT DO NOTHING;
