-- A glossary term and a history event can be the same subject rather than
-- merely related: 대숙청 is one campaign written up twice, once as a concept
-- with a definition, aliases, a category and nested entries, and once as a
-- narrative with a question, a timeline, an outcome and a cast. Each page held
-- what the other lacked and pointed at it only from a list at the bottom.
--
-- commulingo_term_events already links a term to the events it touches, but
-- that link means 'relevant to' — 굴라크 is linked to 대숙청 without being it.
-- same_subject marks the stronger claim, so the pages can carry each other's
-- content instead of just each other's names.
--
-- At most one event per term and one term per event: a page transcludes one
-- counterpart, not a stack of them.

ALTER TABLE commulingo_term_events
    ADD COLUMN IF NOT EXISTS same_subject BOOLEAN NOT NULL DEFAULT FALSE;

CREATE UNIQUE INDEX IF NOT EXISTS commulingo_term_events_same_subject_term_idx
    ON commulingo_term_events (term_id) WHERE same_subject;
CREATE UNIQUE INDEX IF NOT EXISTS commulingo_term_events_same_subject_event_idx
    ON commulingo_term_events (event_id) WHERE same_subject;

-- 대숙청 only, for now. 네프 ↔ 신경제정책 is the next obvious candidate, and
-- 페레스트로이카 and 대전환 sit under compound events that cover more than the
-- term does, which is a weaker claim than this flag makes. Those stay off until
-- someone decides they qualify.
UPDATE commulingo_term_events SET same_subject = TRUE
 WHERE term_id = 'great-purge' AND event_id = 'great-terror';
