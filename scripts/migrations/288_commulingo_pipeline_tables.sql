-- 288: the CommuLingo enrichment pipeline's work state moves to this repository
-- (dev_docs/commulingo-agent-pipeline.md, 2026-10-05). leninbot created these
-- tables (its commulingo/pipeline/schema.sql); the frontend now runs the queue
-- and calls leninbot only as an agent worker. Every statement is idempotent: on
-- the production database the tables already exist and nothing changes.
-- commulingo_curation_gaps (125) and commulingo_person_review_jobs (177) are
-- this repository's again as well.
CREATE TABLE IF NOT EXISTS commulingo_pipeline_jobs (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kind text NOT NULL CHECK (kind IN ('person','term')),
    action text NOT NULL CHECK (action IN ('create','update')),
    target text NOT NULL,
    topic text NOT NULL,
    baseline text NOT NULL DEFAULT '',
    reason text NOT NULL,
    priority integer NOT NULL DEFAULT 50,
    stage text NOT NULL DEFAULT 'research' CONSTRAINT commulingo_pipeline_jobs_stage_check
        CHECK (stage IN ('discover','research','judge','draft','validate','review','submit','complete')),
    status text NOT NULL DEFAULT 'ready' CHECK (status IN ('ready','running','deferred','complete','escalated','cancelled')),
    payload jsonb NOT NULL DEFAULT '{}',
    lease_token uuid,
    lease_until timestamptz,
    available_at timestamptz NOT NULL DEFAULT now(),
    attempts integer NOT NULL DEFAULT 0,
    last_error text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS commulingo_pipeline_active_target ON commulingo_pipeline_jobs(kind,target,topic)
    WHERE status IN ('ready','running','deferred','escalated');
CREATE INDEX IF NOT EXISTS commulingo_pipeline_ready ON commulingo_pipeline_jobs(priority,available_at,id)
    WHERE status IN ('ready','running','deferred');
CREATE TABLE IF NOT EXISTS commulingo_pipeline_artifacts (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    job_id bigint NOT NULL REFERENCES commulingo_pipeline_jobs(id),
    stage text NOT NULL,
    value jsonb NOT NULL,
    metrics jsonb NOT NULL DEFAULT '{}',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS commulingo_pipeline_sources (
    id text PRIMARY KEY,
    url text NOT NULL,
    content_hash text NOT NULL,
    fetched_at timestamptz NOT NULL,
    expires_at timestamptz NOT NULL,
    body text,
    UNIQUE(url,content_hash)
);
CREATE TABLE IF NOT EXISTS commulingo_pipeline_materials (
    material_id text PRIMARY KEY,
    content_hash text NOT NULL,
    processed_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS commulingo_pipeline_mentions (
    kind text NOT NULL, target text NOT NULL, material_id text NOT NULL,
    mention text NOT NULL, PRIMARY KEY(kind,target,material_id)
);
CREATE TABLE IF NOT EXISTS commulingo_pipeline_job_sources (
    job_id bigint NOT NULL REFERENCES commulingo_pipeline_jobs(id),
    source_id text NOT NULL REFERENCES commulingo_pipeline_sources(id),
    PRIMARY KEY(job_id,source_id)
);
CREATE TABLE IF NOT EXISTS commulingo_pipeline_fetch_cache (
    tool text NOT NULL, args_hash text NOT NULL,
    source_id text NOT NULL REFERENCES commulingo_pipeline_sources(id),
    PRIMARY KEY(tool,args_hash)
);
-- The budget and canary publication day starts at 02:00 KST.
CREATE TABLE IF NOT EXISTS commulingo_pipeline_budget (
    id uuid PRIMARY KEY,
    day date NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Seoul') - interval '2 hours')::date,
    lane text NOT NULL,
    job_id bigint REFERENCES commulingo_pipeline_jobs(id),
    reserved numeric(12,6) NOT NULL CHECK (reserved >= 0),
    actual numeric(12,6) CHECK (actual >= 0),
    created_at timestamptz NOT NULL DEFAULT now(),
    settled_at timestamptz
);
CREATE INDEX IF NOT EXISTS commulingo_pipeline_budget_day ON commulingo_pipeline_budget(day);
CREATE TABLE IF NOT EXISTS commulingo_pipeline_scheduler (
    id integer PRIMARY KEY CHECK (id=1), cursor integer NOT NULL DEFAULT 0
);
INSERT INTO commulingo_pipeline_scheduler(id) VALUES (1) ON CONFLICT DO NOTHING;
CREATE TABLE IF NOT EXISTS commulingo_pipeline_publications (
    job_id bigint PRIMARY KEY REFERENCES commulingo_pipeline_jobs(id),
    day date NOT NULL DEFAULT ((now() AT TIME ZONE 'Asia/Seoul') - interval '2 hours')::date,
    kind text NOT NULL, action text NOT NULL
);
CREATE TABLE IF NOT EXISTS commulingo_pipeline_attempts (
    id uuid PRIMARY KEY,
    job_id bigint NOT NULL REFERENCES commulingo_pipeline_jobs(id),
    stage text NOT NULL,
    started_at timestamptz NOT NULL DEFAULT now(),
    finished_at timestamptz,
    duration_seconds double precision,
    outcome text NOT NULL DEFAULT 'running',
    next_stage text,
    error text NOT NULL DEFAULT '',
    budget_id uuid REFERENCES commulingo_pipeline_budget(id),
    metrics jsonb NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS commulingo_pipeline_attempts_started ON commulingo_pipeline_attempts(started_at,job_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON commulingo_pipeline_jobs, commulingo_pipeline_artifacts, commulingo_pipeline_sources,
    commulingo_pipeline_materials, commulingo_pipeline_mentions, commulingo_pipeline_job_sources, commulingo_pipeline_fetch_cache,
    commulingo_pipeline_budget, commulingo_pipeline_scheduler, commulingo_pipeline_publications, commulingo_pipeline_attempts TO frontend;
