-- 296: Ивашко is 이바시코 (final о is 오; there is no -в). The card was renamed
-- through the people store (2026-10-06); this fixes the one prose mention.
BEGIN;
UPDATE commulingo_history_events SET body_ko = replace(body_ko, '이바시코프', '이바시코'), updated_at = now()
    WHERE body_ko LIKE '%이바시코프%';
COMMIT;
