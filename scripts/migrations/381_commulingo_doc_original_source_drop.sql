-- An original's source line moved into its bibliography (sourceText) on
-- 2026-11-20 (migration 380); every row's source was left empty. Drop the
-- column; the revisions keep theirs as history, defaulting to '' from now on.
ALTER TABLE commulingo_doc_originals DROP COLUMN IF EXISTS source;
ALTER TABLE commulingo_doc_original_revisions ALTER COLUMN source SET DEFAULT '';
