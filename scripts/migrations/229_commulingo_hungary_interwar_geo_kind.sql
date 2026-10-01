-- 2026-10-01: the hungary-interwar-20261001 batch wrote its timeline map points
-- without kind (the batch helper P() omitted it; fixed in lib.js), which
-- audit-event-locations rejects. Mark every geo without a kind as a point.
BEGIN;
UPDATE commulingo_history_events ev
SET timeline = (
    SELECT jsonb_agg(CASE WHEN t.e ? 'geo' AND NOT (t.e->'geo' ? 'kind')
                          THEN jsonb_set(t.e, '{geo,kind}', '"point"') ELSE t.e END ORDER BY t.ord)
    FROM jsonb_array_elements(ev.timeline) WITH ORDINALITY AS t(e, ord)),
    updated_at = now()
WHERE ev.id IN ('hungarian-soviet-republic-1919', 'horthy-regime-1920-1938', 'hungary-axis-1938-1944');
COMMIT;
