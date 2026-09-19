BEGIN;
SET LOCAL lock_timeout = '5s';
-- Working notes an author leaves for the next author of the same entry
-- (planned sections, open questions, what the research supported but the
-- patch left out). Internal editorial data: never rendered on the public site.
CREATE TABLE IF NOT EXISTS commulingo_editorial_notes (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    target_type text NOT NULL CHECK (target_type IN ('person','term')),
    target_id text NOT NULL,
    note text NOT NULL CHECK (length(note) BETWEEN 1 AND 4000),
    changed_by text NOT NULL,
    job_ref text NOT NULL DEFAULT '',
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS commulingo_editorial_notes_target
    ON commulingo_editorial_notes (target_type, target_id, created_at DESC);
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='frontend') THEN
        GRANT SELECT,INSERT,UPDATE,DELETE ON commulingo_editorial_notes TO frontend;
        GRANT USAGE,SELECT ON SEQUENCE commulingo_editorial_notes_id_seq TO frontend;
    END IF;
END $$;
COMMIT;
