-- The 원문·편집 정보 of a published original as fields (data/commulingo/doc-bibliography.js,
-- dev_docs/commulingo-doc-bibliography.md), one bibliography per site language:
-- { "ko": { "parts": [...] }, "en": { "parts": [...] } }. Until 2026-11-20 it was a
-- hand-written <details class="doc-edition"> in each language's 해제 box plus a
-- free-text `source` line; the reader now draws the box from this column.
BEGIN;

ALTER TABLE commulingo_doc_originals ADD COLUMN IF NOT EXISTS bibliography JSONB;
ALTER TABLE commulingo_doc_original_revisions ADD COLUMN IF NOT EXISTS bibliography JSONB;

COMMIT;
