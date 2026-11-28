-- Second step of 387: drop the columns the release deployed after 387 no
-- longer reads or writes (an original's rights, a document's sort_order). The
-- revision tables keep their rights column as history.
BEGIN;
ALTER TABLE commulingo_doc_originals DROP COLUMN IF EXISTS rights;
ALTER TABLE commulingo_docs DROP COLUMN IF EXISTS sort_order;
COMMIT;
