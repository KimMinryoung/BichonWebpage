-- 379: page-scoped person links on event, term and person pages. A name two
-- cards share (알렉세이 이사예프 the rocket-engine designer and the military
-- historian) links on a page only when the page's related people settle it;
-- where they do not, the page names its bearer here:
-- [{lang, text, personId, reason}]. Read by the three stores as personLinks;
-- the page's linker (linkify.js pagePeople) links exactly that text to that
-- card ahead of the namesake, shared-surname and surname-only rules. The same
-- page's no_auto_link still wins.

BEGIN;
SET LOCAL lock_timeout = '5s';
ALTER TABLE commulingo_history_events
    ADD COLUMN IF NOT EXISTS person_links jsonb NOT NULL DEFAULT '[]'::jsonb
    CONSTRAINT commulingo_history_events_person_links_array CHECK (jsonb_typeof(person_links) = 'array');
ALTER TABLE commulingo_terms
    ADD COLUMN IF NOT EXISTS person_links jsonb NOT NULL DEFAULT '[]'::jsonb
    CONSTRAINT commulingo_terms_person_links_array CHECK (jsonb_typeof(person_links) = 'array');
ALTER TABLE commulingo_people
    ADD COLUMN IF NOT EXISTS person_links jsonb NOT NULL DEFAULT '[]'::jsonb
    CONSTRAINT commulingo_people_person_links_array CHECK (jsonb_typeof(person_links) = 'array');
COMMENT ON COLUMN commulingo_history_events.person_links IS
    'Page-scoped person links: [{lang: ko|en, text, personId, reason}] — exact strings this event links to one person card ahead of the namesake and shared-surname rules (migration 379).';
COMMENT ON COLUMN commulingo_terms.person_links IS
    'Page-scoped person links: [{lang: ko|en, text, personId, reason}] — exact strings this term page links to one person card ahead of the namesake and shared-surname rules (migration 379).';
COMMENT ON COLUMN commulingo_people.person_links IS
    'Page-scoped person links: [{lang: ko|en, text, personId, reason}] — exact strings this person page links to one person card ahead of the namesake and shared-surname rules (migration 379).';
COMMIT;
