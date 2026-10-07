-- 2026-10-07: political-position collections for the Haitian Revolution and Franco-Prussian
-- War follow-up cards (scripts/content/queue-events-20261007/people-extra-20261007-a.js,
-- REPORT-people-extra-a.md). Rochambeau, Maitland and Ducrot: no position on record.
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('jacobin', 'etienne-polverel'),
    ('jacobin', 'jean-baptiste-belley'),
    ('monarchist', 'achille-bazaine'),
    ('non-bolshevik-socialist', 'wilhelm-bracke'),
    ('liberal-republican', 'charles-de-freycinet')
ON CONFLICT DO NOTHING;
