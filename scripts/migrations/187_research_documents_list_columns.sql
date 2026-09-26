-- The research list (/reports, sitemap, feeds, the slug set the renderer links
-- against) needs each document's byte size and whether it has an English
-- body. Computing OCTET_LENGTH(markdown) and BTRIM(markdown_en) in the list
-- query detoasted every public document's full text: 41 ms per list build
-- against 0.3 ms without them (EXPLAIN ANALYZE, 175 documents, 2026-09-26).
-- The list cache has a 60 s TTL and traffic is sparse, so most visits paid it.
--
-- Stored generated columns keep both values on the row itself. leninbot's
-- writers use explicit column lists, so they are unaffected.
-- Owner of the table is `postgres`; apply before deploying the code that
-- reads the columns:
--   docker exec -i leninbot-pg psql -U postgres -d leninbot -f - < this file
ALTER TABLE research_documents
    ADD COLUMN IF NOT EXISTS markdown_size INTEGER
        GENERATED ALWAYS AS (OCTET_LENGTH(markdown)) STORED,
    ADD COLUMN IF NOT EXISTS has_markdown_en BOOLEAN
        GENERATED ALWAYS AS (COALESCE(BTRIM(markdown_en), '') <> '') STORED;
