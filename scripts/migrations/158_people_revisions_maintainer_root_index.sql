-- The leninbot maintainer's candidate query runs, once per person (2,175×),
--   SELECT MAX(created_at) FROM commulingo_people_revisions rev
--    WHERE (rev.entity_id = p.id OR rev.entity_id LIKE p.id || '/%')
--      AND rev.changed_by LIKE 'commulingo-maintainer%'
-- Migration 121's text_pattern_ops index cannot serve it after all: the LIKE
-- pattern is built from the outer row, so the planner has no constant prefix
-- to turn into a range, and each of the 2,175 LATERAL evaluations seq-scans
-- the table (measured 2.6 s per poll; 537k seq scans / 4.07G tuples read
-- since August).
--
-- This index keys on the person id that entity_id starts with (the part
-- before any '/'), restricted to maintainer rows, and orders by created_at
-- so MAX() is one index probe. It serves the query only once the maintainer
-- rewrites its predicate to the equivalent
--   WHERE split_part(rev.entity_id, '/', 1) = p.id
--     AND rev.changed_by LIKE 'commulingo-maintainer%'
-- (verified identical results over all 2,175 people on 2026-09-02).
-- Owner of the table is `postgres`; apply with
--   docker exec -i leninbot-pg psql -U postgres -d leninbot -f - < this file
CREATE INDEX IF NOT EXISTS commulingo_people_revisions_root_maintainer_idx
    ON commulingo_people_revisions (split_part(entity_id, '/', 1), created_at DESC)
    WHERE changed_by LIKE 'commulingo-maintainer%';
