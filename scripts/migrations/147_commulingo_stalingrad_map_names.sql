-- 147: name the geography on the Stalingrad campaign map.
--
-- Two kinds of names (see event-map-svg.js):
--   locations kind 'geo'  — physical geography (돈강, 볼가강), always visible,
--                           italic, no marker dot, no vote in the frame fit;
--   timeline geo.label    — the place a numbered beat happens at, revealed
--                           only while that number is highlighted.
-- Coordinates for 'geo' labels sit ON the feature at a stretch of the frame
-- with room; the label anchors centered there.

UPDATE commulingo_history_events SET locations = '[
  {"lat":48.71,"lng":44.51,"label":{"ko":"스탈린그라드","en":"Stalingrad"},"kind":"main"},
  {"lat":50.05,"lng":40.60,"label":{"ko":"돈강","en":"Don"},"kind":"geo"},
  {"lat":50.40,"lng":45.85,"label":{"ko":"볼가강","en":"Volga"},"kind":"geo"}
]'::jsonb WHERE id = 'stalingrad';

UPDATE commulingo_history_events SET timeline =
  jsonb_set(
  jsonb_set(
  jsonb_set(
  jsonb_set(
  jsonb_set(
  jsonb_set(
  jsonb_set(timeline,
    '{0,geo,label}', '{"ko":"하리코프","en":"Kharkov"}'),
    '{1,geo,label}', '{"ko":"보로네시 방면","en":"toward Voronezh"}'),
    '{2,geo,label}', '{"ko":"캅카스 방면","en":"toward the Caucasus"}'),
    '{3,geo,label}', '{"ko":"치르강","en":"the Chir"}'),
    '{5,geo,label}', '{"ko":"스탈린그라드 북쪽 외곽","en":"north of Stalingrad"}'),
    '{8,geo,label}', '{"ko":"세라피모비치 교두보","en":"Serafimovich bridgehead"}'),
    '{9,geo,label}', '{"ko":"칼라치","en":"Kalach"}')
WHERE id = 'stalingrad';
