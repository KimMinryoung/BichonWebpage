-- 2026-10-07: reverse "related" links for the two queue events, as the
-- Transcaucasia batch did for ussr-formation. The French Revolution lists the
-- Haitian Revolution; the Paris Commune lists the Franco-Prussian War.
BEGIN;
UPDATE commulingo_history_events
   SET relations = jsonb_set(relations, '{related}', (relations->'related') || '["haitian-revolution-1791-1804"]'::jsonb)
 WHERE id = 'french-revolution-1789-1799' AND NOT (relations->'related') ? 'haitian-revolution-1791-1804';
UPDATE commulingo_history_events
   SET relations = jsonb_set(relations, '{related}', (relations->'related') || '["franco-prussian-war-1870-1871"]'::jsonb)
 WHERE id = 'paris-commune-1871' AND NOT (relations->'related') ? 'franco-prussian-war-1870-1871';
COMMIT;
