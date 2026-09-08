BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

-- Immutable evidence attached to an edit. A later correction adds new evidence;
-- it does not rewrite the citations that justified a previous revision.
CREATE TABLE commulingo_person_evidence (
    id BIGSERIAL PRIMARY KEY,
    person_id TEXT NOT NULL,
    section_slug TEXT NOT NULL DEFAULT '',
    field TEXT NOT NULL,
    claim TEXT NOT NULL,
    source TEXT NOT NULL,
    locator TEXT NOT NULL DEFAULT '',
    excerpt TEXT NOT NULL DEFAULT '',
    stance TEXT NOT NULL CHECK (stance IN ('supports', 'disputes')),
    changed_by TEXT NOT NULL,
    revision TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX commulingo_person_evidence_person_idx ON commulingo_person_evidence(person_id, id);

CREATE TABLE commulingo_person_enrichment (
    person_id TEXT NOT NULL REFERENCES commulingo_people(id) ON DELETE CASCADE,
    topic TEXT NOT NULL CHECK (topic IN ('basics', 'nationality', 'bio', 'moment', 'events', 'sections')),
    status TEXT NOT NULL CHECK (status IN ('open', 'complete', 'not_applicable', 'sources_unavailable')),
    reason TEXT NOT NULL,
    sources JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(sources)='array'),
    revision TEXT NOT NULL,
    review_after TIMESTAMPTZ NOT NULL,
    changed_by TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY(person_id, topic)
);
CREATE INDEX commulingo_person_enrichment_due_idx ON commulingo_person_enrichment(review_after);
-- Match the production frontend application role; isolated test DBs may omit it.
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname='frontend') THEN
        GRANT SELECT, INSERT ON commulingo_person_evidence TO frontend;
        GRANT SELECT, INSERT, UPDATE, DELETE ON commulingo_person_enrichment TO frontend;
        GRANT USAGE, SELECT ON SEQUENCE commulingo_person_evidence_id_seq TO frontend;
    END IF;
END $$;
COMMIT;
