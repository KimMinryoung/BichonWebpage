-- 366: page-scoped glossary links for a history event. A word that means one
-- entry on this page but too many things elsewhere to link everywhere (bare
-- 백군 is the Finnish Whites on the Finland event and the Russian Whites on
-- the civil-war events) is linked here only: [{lang, text, termId, reason}].
-- Read by history-events-store.js as termLinks; event-presentation.js hands
-- it to the event's linker (linkify.js pageTerms).

BEGIN;
SET LOCAL lock_timeout = '5s';
ALTER TABLE commulingo_history_events
    ADD COLUMN term_links jsonb NOT NULL DEFAULT '[]'::jsonb
    CONSTRAINT commulingo_history_events_term_links_array CHECK (jsonb_typeof(term_links) = 'array');
COMMENT ON COLUMN commulingo_history_events.term_links IS
    'Page-scoped glossary links: [{lang: ko|en, text, termId, reason}] — words this event links to a term though the corpus at large leaves them unlinked (migration 366).';
COMMIT;
