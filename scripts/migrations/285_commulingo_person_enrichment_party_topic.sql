-- 2026-10-05: record whether a person's party membership was checked (owner
-- request). status complete = a party activity is on the card; not_applicable =
-- the cited sources were read and name no party membership or party post;
-- sources_unavailable = no source text to check. Data only: the card and the
-- person page never show that someone had no party.
BEGIN;
ALTER TABLE commulingo_person_enrichment DROP CONSTRAINT commulingo_person_enrichment_topic_check;
ALTER TABLE commulingo_person_enrichment ADD CONSTRAINT commulingo_person_enrichment_topic_check
    CHECK (topic IN ('basics', 'nationality', 'bio', 'moment', 'events', 'sections', 'party'));
COMMIT;
