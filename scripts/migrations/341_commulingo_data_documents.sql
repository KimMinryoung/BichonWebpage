-- CommuLingo data that was kept as whole JSON files in git moves into the
-- database, one row per file, so correcting it is a DB write with history
-- instead of a commit (dev_docs/commulingo-data-off-git.md, stage 3):
--   activity-catalog              person activity functions and affiliations
--   politburo, secretariat, orgburo   Central Committee body rosters
--   event-control/<event id>      territorial-control phases for event maps
--   genealogy/<chart id>          genealogy charts
-- content is json, not jsonb: jsonb reorders object keys, and several of these
-- documents are displayed in their key order. data/commulingo/data-documents.js
-- serves them (memory → disk snapshot → DB); scripts/commulingo-data edits them.
-- The data itself is loaded by scripts/migrations/data/342_commulingo_data_documents_import.sql.
BEGIN;

CREATE TABLE IF NOT EXISTS commulingo_data_documents (
    key        TEXT PRIMARY KEY CHECK (key ~ '^[a-z0-9-]+(/[a-z0-9-]+)?$'),
    content    JSON NOT NULL,
    revision   INTEGER NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by TEXT NOT NULL DEFAULT 'unknown',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by TEXT NOT NULL DEFAULT 'unknown'
);

-- Superseded versions: every update or delete first copies the row it replaces.
CREATE TABLE IF NOT EXISTS commulingo_data_document_revisions (
    id            BIGSERIAL PRIMARY KEY,
    key           TEXT NOT NULL,
    revision      INTEGER NOT NULL,
    content       JSON NOT NULL,
    updated_at    TIMESTAMPTZ NOT NULL,
    updated_by    TEXT NOT NULL,
    superseded_op TEXT NOT NULL CHECK (superseded_op IN ('update', 'delete')),
    superseded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    superseded_by TEXT NOT NULL,
    note          TEXT,
    UNIQUE (key, revision)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON commulingo_data_documents TO frontend;
GRANT SELECT, INSERT ON commulingo_data_document_revisions TO frontend;
GRANT USAGE ON SEQUENCE commulingo_data_document_revisions_id_seq TO frontend;

COMMIT;
