BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '30s';

-- Exclude concurrent writers throughout deduplication and index creation.
LOCK TABLE commulingo_term_relations IN SHARE ROW EXCLUSIVE MODE;
UPDATE commulingo_term_relations a
SET sort_order = LEAST(a.sort_order, b.sort_order)
FROM commulingo_term_relations b
WHERE a.term_id = b.related_id AND a.related_id = b.term_id
  AND a.term_id < a.related_id;
DELETE FROM commulingo_term_relations a
USING commulingo_term_relations b
WHERE a.term_id = b.related_id AND a.related_id = b.term_id
  AND a.term_id > a.related_id;
CREATE UNIQUE INDEX commulingo_term_relations_unordered_idx
ON commulingo_term_relations (LEAST(term_id, related_id), GREATEST(term_id, related_id));

ALTER TABLE commulingo_terms
ADD CONSTRAINT commulingo_terms_category_fkey FOREIGN KEY (category)
REFERENCES commulingo_term_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;
COMMENT ON TABLE commulingo_term_categories IS
'Glossary category registry; terms reference its IDs with ON UPDATE CASCADE and ON DELETE RESTRICT.';

CREATE INDEX commulingo_term_people_person_idx ON commulingo_term_people(person_id);
CREATE INDEX commulingo_term_events_event_idx ON commulingo_term_events(event_id);
CREATE INDEX commulingo_term_relations_related_idx ON commulingo_term_relations(related_id);
COMMIT;
