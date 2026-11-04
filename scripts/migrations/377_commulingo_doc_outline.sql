-- The outline of a reference document (data/commulingo/doc-outline.js): the
-- parse the reader used to redo on every cache miss — contents, heading and
-- note offsets, editor's boxes, the page plan — computed once when the body is
-- written and kept beside it. Derived data: docs-db.js writes it with every
-- body and `scripts/commulingo-docs outline` recomputes it for every row
-- (after this migration, and whenever the reader's rules change). The reader
-- falls back to parsing when a row has none or it is stale (it names the
-- body sha it was built from). Revisions do not keep it; a restore rebuilds it.
BEGIN;

ALTER TABLE commulingo_docs ADD COLUMN IF NOT EXISTS outline JSONB;
ALTER TABLE commulingo_doc_originals ADD COLUMN IF NOT EXISTS outline JSONB;

COMMIT;
