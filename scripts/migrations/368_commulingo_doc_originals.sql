-- The original-language text a reference document was translated from
-- (commulingo_docs holds the translation). Every translated document can keep
-- its original here for checking the translation; the reader shows it behind a
-- 「원문」 button only when `public` is set, and `public` needs `rights`, the
-- stated reason the text may be published (public domain, official document,
-- licence). An original still under copyright stays stored and unpublished:
-- docs-store.js never reads a non-public body.
--
-- body is a sanitized HTML fragment in the reader's format; body_sha256 names
-- its cache file, the same content-addressed cache as the translations.
BEGIN;

CREATE TABLE IF NOT EXISTS commulingo_doc_originals (
    doc_id          TEXT PRIMARY KEY REFERENCES commulingo_docs (id) ON DELETE CASCADE,
    lang            TEXT NOT NULL CHECK (lang ~ '^[a-z]{2,3}$'),
    body            TEXT NOT NULL CHECK (length(body) > 0),
    body_sha256     TEXT NOT NULL CHECK (body_sha256 ~ '^[0-9a-f]{64}$'),
    public          BOOLEAN NOT NULL DEFAULT FALSE,
    rights          TEXT NOT NULL DEFAULT '',
    source          TEXT NOT NULL DEFAULT '',
    revision        INTEGER NOT NULL DEFAULT 1,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by      TEXT NOT NULL DEFAULT 'unknown',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      TEXT NOT NULL DEFAULT 'unknown',
    CHECK (NOT public OR length(btrim(rights)) > 0)
);

-- Superseded versions, written by docs-db.js before every update or removal
-- (a document deleted with its original keeps the original here too).
CREATE TABLE IF NOT EXISTS commulingo_doc_original_revisions (
    id              BIGSERIAL PRIMARY KEY,
    doc_id          TEXT NOT NULL,
    revision        INTEGER NOT NULL,
    lang            TEXT NOT NULL,
    body            TEXT NOT NULL,
    body_sha256     TEXT NOT NULL,
    public          BOOLEAN NOT NULL,
    rights          TEXT NOT NULL,
    source          TEXT NOT NULL,
    updated_at      TIMESTAMPTZ NOT NULL,
    updated_by      TEXT NOT NULL,
    superseded_op   TEXT NOT NULL CHECK (superseded_op IN ('update', 'delete')),
    superseded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    superseded_by   TEXT NOT NULL,
    note            TEXT,
    UNIQUE (doc_id, revision)
);
CREATE INDEX IF NOT EXISTS commulingo_doc_original_revisions_doc_idx
    ON commulingo_doc_original_revisions (doc_id, id DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON commulingo_doc_originals TO frontend;
GRANT SELECT, INSERT ON commulingo_doc_original_revisions TO frontend;
GRANT USAGE ON SEQUENCE commulingo_doc_original_revisions_id_seq TO frontend;

COMMIT;
