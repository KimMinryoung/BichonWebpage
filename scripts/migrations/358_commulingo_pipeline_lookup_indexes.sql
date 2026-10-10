-- 358: lookup indexes for the pipeline planner (2026-10-10).
--
-- personInGrace/termInGrace (services/commulingo-pipeline/store.js) look up a
-- target's jobs and their artifacts, but jobs had no plain (kind, target)
-- index and artifacts none on job_id. The planner's candidate query therefore
-- scanned all ~17k artifacts once per person (484 loops, 1.1M job lookups):
-- 20 s on 2026-10-10, the database's most expensive statement. With these two
-- it runs in ~90 ms. Do not add a partial "submit/approved" artifacts index:
-- it flipped the plan to read artifacts first and doubled the time.
--
-- The research/sources_unavailable index serves the planner's completed-jobs
-- read, whose EXISTS otherwise detoasts every artifact value (213 ms -> 13 ms).
--
-- CONCURRENTLY: the pipeline writes these tables while this runs, so no
-- transaction block here.

CREATE INDEX CONCURRENTLY IF NOT EXISTS commulingo_pipeline_jobs_kind_target
    ON commulingo_pipeline_jobs (kind, target);

CREATE INDEX CONCURRENTLY IF NOT EXISTS commulingo_pipeline_artifacts_job
    ON commulingo_pipeline_artifacts (job_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS commulingo_pipeline_artifacts_sources_unavailable
    ON commulingo_pipeline_artifacts (job_id)
    WHERE stage = 'research' AND (value->>'status') = 'sources_unavailable';

ANALYZE commulingo_pipeline_jobs;
ANALYZE commulingo_pipeline_artifacts;
