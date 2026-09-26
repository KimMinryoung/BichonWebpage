-- Helsinki Accords: Molotov first proposed a European security conference
-- at the Berlin foreign ministers' conference of February 1954, as the
-- event's own body says; the first timeline row named Geneva. The row now
-- names Berlin and carries its map point.
--
-- The Northern Expedition: Moscow's part in the story is political, not a
-- place on the campaign map, and its marker stretched the frame across
-- Eurasia. The marker is dropped; the text is unchanged.
--
-- Each update applies only to the text it corrects, so a rerun is a no-op.

BEGIN;

UPDATE commulingo_history_events
   SET timeline = jsonb_set(
           jsonb_set(timeline, '{0,body}', jsonb_build_object(
               'ko', '소련은 베를린 외상회의에서 유럽안보회의를 처음 제안했다. 전후 국경의 국제적 승인을 얻으려는 의도였으나, 서방은 소련의 입지 강화를 우려해 거부했다.',
               'en', 'At the Berlin Conference of Foreign Ministers, the Soviet Union first proposed a European security conference, seeking international recognition of postwar borders; the West, fearing this would strengthen the Soviet position, declined.')),
           '{0,geo}', '{"kind": "point", "lat": 52.52, "lng": 13.40, "label": {"ko": "베를린", "en": "Berlin"}}'::jsonb)
 WHERE id = 'helsinki-accords'
   AND timeline->0->>'date' = '1954'
   AND timeline->0->'body'->>'en' LIKE 'At the Geneva Conference of Foreign Ministers,%';

UPDATE commulingo_history_events
   SET locations = (SELECT jsonb_agg(loc ORDER BY n)
                      FROM jsonb_array_elements(locations) WITH ORDINALITY AS t(loc, n)
                     WHERE loc->'label'->>'en' <> 'Moscow')
 WHERE id = 'first-united-front-1924-1927'
   AND locations @> '[{"label": {"en": "Moscow"}}]'::jsonb;

COMMIT;
