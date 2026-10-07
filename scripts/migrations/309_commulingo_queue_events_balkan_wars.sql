-- 2026-10-07: political-position collections for the person cards registered
-- with the event balkan-wars-1912-1913 (scripts/content/queue-events-20261007/
-- REPORT-balkan-wars-1912-1913.md); reverse related links from the First World
-- War and the collapse of the Second International (Basel congress, 1912).
-- The event closes queue gap 2064.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('monarchist', 'ferdinand-i-of-bulgaria'),
    ('liberal-republican', 'eleftherios-venizelos'),
    ('nationalist', 'nikola-pasic'),
    ('conservative', 'ivan-geshov'),
    ('monarchist', 'nikola-i-of-montenegro'),
    ('national-liberation', 'ismail-qemali'),
    ('non-bolshevik-socialist', 'dragisa-lapcevic')
ON CONFLICT DO NOTHING;
UPDATE commulingo_history_events
   SET relations = jsonb_set(relations, '{related}', coalesce(relations->'related', '[]'::jsonb) || '["balkan-wars-1912-1913"]'::jsonb)
 WHERE id IN ('world-war-i', 'second-international-collapse-1914')
   AND NOT coalesce(relations->'related', '[]'::jsonb) ? 'balkan-wars-1912-1913';
UPDATE commulingo_curation_gaps SET status='done', resolved_id='balkan-wars-1912-1913', resolution='2026-10-07 사건 등록 (scripts/content/queue-events-20261007)', updated_at=now() WHERE id=2064 AND status='pending';
COMMIT;
