-- Reference-document review follow-ups (dev_docs/archive/commulingo-docs-design-review-20261104.md),
-- 2026-11-28. This step only relaxes, so the running release keeps working;
-- apply it before deploying the release that stops writing the columns, and
-- 388 (which drops them) after.
--
-- Rights: why an original may be published is stated in its bibliography
--   (parts[0].rights { text, status }); the write path checks the status. The
--   rights column held an older copy of the same sentence.
-- S5: documents are ordered by their date; sort_order was never read for order.
-- S7: a redirect with an empty anchor sends the old id to the document head.
-- S8: an original's revision keeps the body only when the write replaced it.
-- L3: the entries a document's body linked when its link audit last ran
--     ({ at, links: ["person:id", ...] }), so a later dictionary change that
--     moves those links can be reported (scripts/commulingo-docs link-drift).
BEGIN;
ALTER TABLE commulingo_doc_originals DROP CONSTRAINT IF EXISTS commulingo_doc_originals_check;
ALTER TABLE commulingo_doc_original_revisions ALTER COLUMN rights SET DEFAULT '';
ALTER TABLE commulingo_doc_original_revisions ALTER COLUMN body DROP NOT NULL;
ALTER TABLE commulingo_docs ALTER COLUMN sort_order DROP NOT NULL;
ALTER TABLE commulingo_doc_redirects DROP CONSTRAINT IF EXISTS commulingo_doc_redirects_anchor_check;
ALTER TABLE commulingo_doc_redirects ADD CONSTRAINT commulingo_doc_redirects_anchor_check CHECK (anchor ~ '^([a-z0-9-]+)?$');
ALTER TABLE commulingo_doc_redirects ALTER COLUMN anchor SET DEFAULT '';
ALTER TABLE commulingo_docs ADD COLUMN IF NOT EXISTS link_audit JSONB;
COMMIT;
