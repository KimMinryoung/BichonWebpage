-- CommuLingo reference documents move from git-tracked files
-- (data/commulingo/docs/manifest.json + one HTML fragment per document) into the
-- database, so publishing or editing a document is a DB write with its own
-- history instead of a commit. data/commulingo/docs-store.js serves them through
-- a snapshot (memory → disk → DB) and a content-addressed body cache on disk.
--
-- entry is the manifest entry as before (title, description, aliases, people,
-- excerpts, members, …) minus id and file. body is the sanitized fragment;
-- body_sha256 names its cache file; body_updated_at is what the reader and the
-- sitemap show as the document's modification time (metadata edits leave it).
-- The data itself is loaded by scripts/migrations/data/340_commulingo_docs_import.sql.
BEGIN;

CREATE TABLE IF NOT EXISTS commulingo_docs (
    id              TEXT PRIMARY KEY CHECK (id ~ '^[a-z0-9-]+$'),
    sort_order      INTEGER NOT NULL,
    entry           JSONB NOT NULL CHECK (jsonb_typeof(entry) = 'object' AND NOT entry ? 'id' AND NOT entry ? 'file'),
    body            TEXT NOT NULL CHECK (length(body) > 0),
    body_sha256     TEXT NOT NULL CHECK (body_sha256 ~ '^[0-9a-f]{64}$'),
    revision        INTEGER NOT NULL DEFAULT 1,
    body_updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by      TEXT NOT NULL DEFAULT 'unknown',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      TEXT NOT NULL DEFAULT 'unknown'
);

-- Superseded versions: every update or delete first copies the row it replaces
-- here (its revision number, entry and who wrote it). body is copied only when
-- the write changed or removed the body; NULL means "same body as the next
-- version", so restoring revision r takes the first non-NULL body among
-- revisions >= r, else the current row's body. The current version lives only
-- in commulingo_docs.
CREATE TABLE IF NOT EXISTS commulingo_doc_revisions (
    id              BIGSERIAL PRIMARY KEY,
    doc_id          TEXT NOT NULL,
    revision        INTEGER NOT NULL,
    entry           JSONB NOT NULL,
    body            TEXT,
    body_sha256     TEXT NOT NULL,
    body_updated_at TIMESTAMPTZ NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL,
    updated_by      TEXT NOT NULL,
    superseded_op   TEXT NOT NULL CHECK (superseded_op IN ('update', 'delete')),
    superseded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    superseded_by   TEXT NOT NULL,
    note            TEXT,
    UNIQUE (doc_id, revision)
);
CREATE INDEX IF NOT EXISTS commulingo_doc_revisions_doc_idx ON commulingo_doc_revisions (doc_id, id DESC);

-- Merged documents' old ids still lead to the piece inside the collection
-- (was manifest.json's top-level "redirects").
CREATE TABLE IF NOT EXISTS commulingo_doc_redirects (
    from_id TEXT PRIMARY KEY CHECK (from_id ~ '^[a-z0-9-]+$'),
    to_id   TEXT NOT NULL CHECK (to_id ~ '^[a-z0-9-]+$'),
    anchor  TEXT NOT NULL CHECK (anchor ~ '^[a-z0-9-]+$'),
    note    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON commulingo_docs, commulingo_doc_redirects TO frontend;
GRANT SELECT, INSERT ON commulingo_doc_revisions TO frontend;
GRANT USAGE ON SEQUENCE commulingo_doc_revisions_id_seq TO frontend;

COMMIT;
