BEGIN;
CREATE TABLE IF NOT EXISTS commulingo_learning_events (
    event_id uuid PRIMARY KEY,
    run_id uuid NOT NULL,
    kind text NOT NULL CHECK (kind IN ('lesson', 'drill')),
    content_id text NOT NULL,
    content_version text NOT NULL,
    lang text NOT NULL CHECK (lang IN ('ko', 'en')),
    mode text NOT NULL CHECK (mode IN ('lesson', 'retry', 'review', 'quiz', 'timeline')),
    event text NOT NULL CHECK (event IN ('started', 'answered', 'completed')),
    step integer NOT NULL CHECK (step BETWEEN 0 AND 500),
    correct boolean,
    received_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE(run_id, event, step)
);
CREATE INDEX IF NOT EXISTS commulingo_learning_events_received_idx ON commulingo_learning_events(received_at);
-- Grant to the same application roles as the existing progress table.
DO $$ DECLARE app_role record; BEGIN
    FOR app_role IN SELECT DISTINCT grantee FROM information_schema.role_table_grants
        WHERE table_schema = 'public' AND table_name = 'commulingo_progress'
          AND privilege_type = 'INSERT' AND grantee <> 'PUBLIC'
    LOOP
        EXECUTE format('GRANT SELECT, INSERT, DELETE ON commulingo_learning_events TO %I', app_role.grantee);
    END LOOP;
END $$;
COMMIT;
