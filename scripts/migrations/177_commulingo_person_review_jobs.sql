BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';
CREATE TABLE commulingo_person_review_jobs (
    suggestion_id BIGINT PRIMARY KEY REFERENCES commulingo_agent_suggestions(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','reviewing','retry','escalated','approved','rejected')),
    attempts INTEGER NOT NULL DEFAULT 0,
    lease_token TEXT,
    lease_until TIMESTAMPTZ,
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    decision JSONB,
    research JSONB NOT NULL DEFAULT '{}'::jsonb,
    last_error TEXT NOT NULL DEFAULT '',
    notification_after TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX commulingo_person_review_jobs_due ON commulingo_person_review_jobs(status,next_attempt_at);
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='frontend') THEN
        GRANT SELECT, INSERT, UPDATE ON commulingo_person_review_jobs TO frontend;
    END IF;
END $$;
COMMIT;
