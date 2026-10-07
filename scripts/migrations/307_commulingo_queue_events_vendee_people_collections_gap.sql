-- 2026-10-07: political-position collections for the person cards registered
-- with the event vendee-war-1793-1796 (scripts/content/queue-events-20261007/
-- REPORT-vendee-war-1793-1796.md): Turreau, Carrier and Westermann as Jacobins
-- (Carrier's club membership is sourced; Turreau and Westermann served the
-- Montagnard war effort), d'Elbée and Stofflet as counterrevolution; Kléber and
-- Hoche, republican generals with no political position on record, left out.
-- The event closes queue gap 2063.
BEGIN;
INSERT INTO commulingo_person_collection_members (collection_id, person_id) VALUES
    ('jacobin', 'louis-marie-turreau'),
    ('jacobin', 'jean-baptiste-carrier'),
    ('jacobin', 'francois-joseph-westermann'),
    ('counterrevolution', 'maurice-d-elbee'),
    ('counterrevolution', 'jean-nicolas-stofflet')
ON CONFLICT DO NOTHING;
UPDATE commulingo_history_events
   SET relations = jsonb_set(relations, '{related}', (relations->'related') || '["vendee-war-1793-1796"]'::jsonb)
 WHERE id = 'french-revolutionary-wars-1792-1802' AND NOT (relations->'related') ? 'vendee-war-1793-1796';
UPDATE commulingo_curation_gaps SET status='done', resolved_id='vendee-war-1793-1796', resolution='2026-10-07 사건 등록 (scripts/content/queue-events-20261007)', updated_at=now() WHERE id=2063 AND status='pending';
COMMIT;
