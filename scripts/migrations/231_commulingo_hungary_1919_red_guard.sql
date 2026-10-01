-- 2026-10-01: the 1919 page's "Red Guard" is the Hungarian Vörös Őrség, not the
-- Russian Red Guards term; block it on this page only.
BEGIN;
UPDATE commulingo_history_events
SET no_auto_link = no_auto_link || '["Red Guard"]'::jsonb, updated_at = now()
WHERE id = 'hungarian-soviet-republic-1919' AND NOT no_auto_link ? 'Red Guard';
COMMIT;
