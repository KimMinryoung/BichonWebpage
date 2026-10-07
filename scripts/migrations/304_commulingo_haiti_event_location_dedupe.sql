-- 2026-10-07: audit-event-locations flagged the Haitian Revolution event's
-- Vertières marker (19.73, -72.22) as a duplicate of Cap-Français (19.76, -72.20):
-- Vertières is a suburb of the same town. The marker is dropped; the timeline
-- row for the battle keeps its own point. The batch module was edited to match.
BEGIN;
UPDATE commulingo_history_events
   SET locations = locations - 9
 WHERE id = 'haitian-revolution-1791-1804'
   AND locations->9->'label'->>'en' = 'Vertières';
COMMIT;
