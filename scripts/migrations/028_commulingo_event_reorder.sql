-- Slot the Great Terror into chronological order among the new event pages.
-- New ordering: 1905 (10), February (20), October (30), Civil War (40),
-- USSR formation (45), NEP (50), Five-Year Plans (60), Great Terror (70),
-- Great Patriotic War (80), Space Program (90).
UPDATE commulingo_history_events
SET sort_order = 70, updated_at = NOW()
WHERE id = 'great-terror';
