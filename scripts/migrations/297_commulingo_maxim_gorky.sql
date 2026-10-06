-- 297: Горький is Maxim Gorky; Alexei is his real first name (Алексей Пешков),
-- so "알렉세이 고리키" mixed the two. The card was renamed through the people
-- store (2026-10-06); this fixes the two prose mentions.
BEGIN;
UPDATE commulingo_people SET bio_ko = replace(bio_ko, '알렉세이 고리키', '막심 고리키') WHERE bio_ko LIKE '%알렉세이 고리키%';
UPDATE commulingo_history_events SET body_ko = replace(body_ko, '알렉세이 고리키', '막심 고리키'), updated_at = now() WHERE body_ko LIKE '%알렉세이 고리키%';
COMMIT;
