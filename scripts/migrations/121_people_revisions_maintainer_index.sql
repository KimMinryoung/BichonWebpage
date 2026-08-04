-- The leninbot maintainer's candidate query runs, per person, a correlated
--   SELECT MAX(created_at) FROM commulingo_people_revisions
--    WHERE (entity_id = $person OR entity_id LIKE $person || '/%')
--      AND changed_by LIKE 'commulingo-maintainer%'
-- The existing (entity_type, entity_id, created_at) index cannot serve it
-- (entity_type absent from the predicate; LIKE prefix needs text_pattern_ops),
-- so every poll seq-scanned the whole table once per person (~1,284 scans,
-- observed 183k scans / 939M tuples read total).
CREATE INDEX IF NOT EXISTS commulingo_people_revisions_entity_text_idx
    ON commulingo_people_revisions (entity_id text_pattern_ops);
