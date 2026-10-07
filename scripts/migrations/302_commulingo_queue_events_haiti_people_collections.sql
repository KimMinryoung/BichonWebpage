-- 2026-10-07: political-position collections for the person cards registered
-- with the event haitian-revolution-1791-1804 (scripts/content/queue-events-20261007/
-- REPORT-haitian-revolution-1791-1804.md). Louverture, Dessalines, Christophe,
-- Pétion and Boukman led the slave insurrection and the independence war, so
-- national-liberation, as Ho Chi Minh and Cabral are. Rigaud (free-coloured
-- commander of the South), Ogé (free-coloured rights petitioner, executed 1791)
-- and Leclerc (French expedition commander) have no collection on record.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('national-liberation', 'toussaint-louverture'),
    ('national-liberation', 'jean-jacques-dessalines'),
    ('national-liberation', 'henri-christophe'),
    ('national-liberation', 'alexandre-petion'),
    ('national-liberation', 'dutty-boukman')
ON CONFLICT DO NOTHING;
COMMIT;
