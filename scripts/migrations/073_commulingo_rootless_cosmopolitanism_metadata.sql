-- 'rootless-cosmopolitanism' was added to the glossary while 071/072 were being
-- written, so it missed the period/category backfill and the relation graph.
-- The store falls back to period_label and tolerates an empty category, so this
-- is a data catch-up rather than a fix for broken rendering.

UPDATE commulingo_terms SET
    period_ko  = '1946–1953',
    period_en  = '1946–1953',
    start_year = 1946,
    end_year   = 1953,
    category   = 'repression'
WHERE id = 'rootless-cosmopolitanism';

INSERT INTO commulingo_term_relations (term_id, related_id) VALUES
('rootless-cosmopolitanism', 'great-russian-chauvinism'),
('rootless-cosmopolitanism', 'socialist-realism'),
('rootless-cosmopolitanism', 'great-purge')
ON CONFLICT DO NOTHING;
