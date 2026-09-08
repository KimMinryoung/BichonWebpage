BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';
CREATE TABLE commulingo_link_reviews (
    kind TEXT NOT NULL CHECK (kind IN ('term','event','doc')),
    entity_id TEXT NOT NULL,
    lang TEXT NOT NULL CHECK (lang IN ('ko','en')),
    expression TEXT NOT NULL,
    source_signature TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('identity','short','related','legacy')),
    policy TEXT NOT NULL CHECK (policy IN ('auto','context','search')),
    note TEXT NOT NULL,
    reviewed_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (kind,entity_id,lang,expression)
);
CREATE TABLE commulingo_link_review_history (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    kind TEXT NOT NULL, entity_id TEXT NOT NULL, lang TEXT NOT NULL, expression TEXT NOT NULL,
    before_value JSONB, after_value JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'frontend') THEN
        GRANT SELECT, INSERT, UPDATE ON commulingo_link_reviews TO frontend;
        GRANT SELECT, INSERT ON commulingo_link_review_history TO frontend;
        GRANT USAGE, SELECT ON SEQUENCE commulingo_link_review_history_id_seq TO frontend;
    END IF;
END $$;
-- Polymorphic references also include file-backed documents; validate in the service.
COMMIT;
