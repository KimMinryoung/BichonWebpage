-- The gap queue learns a fourth kind: an event the site should cover.
--
-- The queue was built for what an event's own text leans on — a person, a term,
-- a document. The reverse direction had nowhere to go: on 2026-08-09 the events
-- lane ran out of work because all 39 events had reached nine body sections, and
-- the answer was to widen the catalogue rather than deepen it. The candidates
-- that came out of that review (the Soviet-Japanese border wars, Kronstadt,
-- Poland 1919, the Holodomor, Berlin 1948 and 1961, Solidarity) had no home but
-- a chat message.
--
-- Nothing consumes kind='event' automatically, and that is deliberate: an event
-- row needs a period, a question, a summary and a timeline that a person has
-- checked, and a half-filled one is a public page that says nothing. The queue
-- holds them as a worklist; the writing stays a decision.

ALTER TABLE commulingo_curation_gaps
    DROP CONSTRAINT commulingo_curation_gaps_kind_check;

ALTER TABLE commulingo_curation_gaps
    ADD CONSTRAINT commulingo_curation_gaps_kind_check
    CHECK (kind = ANY (ARRAY['person'::text, 'term'::text, 'doc'::text, 'event'::text]));
