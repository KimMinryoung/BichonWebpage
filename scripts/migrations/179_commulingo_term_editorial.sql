BEGIN;
SET LOCAL lock_timeout = '5s';
CREATE TABLE IF NOT EXISTS commulingo_term_evidence (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    term_id text NOT NULL REFERENCES commulingo_terms(id) ON DELETE CASCADE,
    field text NOT NULL, claim text NOT NULL, source text NOT NULL,
    locator text NOT NULL, excerpt text NOT NULL DEFAULT '',
    stance text NOT NULL CHECK (stance IN ('supports','disputes')),
    revision text NOT NULL, changed_by text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS commulingo_term_enrichment (
    term_id text NOT NULL REFERENCES commulingo_terms(id) ON DELETE CASCADE,
    topic text NOT NULL, status text NOT NULL CHECK (status IN
        ('open','complete','not_applicable','sources_unavailable')),
    reason text NOT NULL, sources jsonb NOT NULL, revision text NOT NULL,
    review_after timestamptz NOT NULL, updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY(term_id,topic)
);
CREATE TABLE IF NOT EXISTS commulingo_editorial_receipts (
    key text PRIMARY KEY, request_hash text NOT NULL, result jsonb NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='frontend') THEN
        GRANT SELECT,INSERT,UPDATE,DELETE ON commulingo_term_evidence,
            commulingo_term_enrichment,commulingo_editorial_receipts TO frontend;
        GRANT USAGE,SELECT ON SEQUENCE commulingo_term_evidence_id_seq TO frontend;
    END IF;
END $$;
COMMIT;
