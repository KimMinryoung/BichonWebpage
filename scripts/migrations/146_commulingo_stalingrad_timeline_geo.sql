-- 146: first timeline campaign map — Stalingrad.
--
-- Timeline entries carry an optional inline geo field (see event-map-svg.js):
--   point = static beat (a battle joined, a surrender),
--   arrow = movement, points as [lat,lng] waypoints,
--   variant 'red' (Red Army) or 'axis'.
-- Inline, not a parallel array: reordering the timeline can never orphan a
-- geometry. Entries at the same spot as an earlier one get NO geo (the badge
-- would overlap) — here 공장지구 방어 and 항복 stay unnumbered because the
-- 제62군 point already marks the city.
--
-- Geometry, 9 numbered beats: German Blau drive east and the split south
-- (axis, dashed), the Don-bend fight and the lunge to the Volga, then the
-- Soviet pincers meeting at Kalach and Ring closing in — the classic
-- encirclement drawn the way an atlas draws it.

UPDATE commulingo_history_events SET timeline =
  jsonb_set(
  jsonb_set(
  jsonb_set(
  jsonb_set(
  jsonb_set(
  jsonb_set(
  jsonb_set(
  jsonb_set(
  jsonb_set(timeline,
    '{0,geo}',  '{"kind":"point","lat":49.99,"lng":36.23}'),
    '{1,geo}',  '{"kind":"arrow","variant":"axis","points":[[51.0,36.8],[51.55,39.1]]}'),
    '{2,geo}',  '{"kind":"arrow","variant":"axis","points":[[49.6,40.0],[47.4,39.85]]}'),
    '{3,geo}',  '{"kind":"arrow","variant":"axis","points":[[48.9,41.6],[48.72,43.3]]}'),
    '{5,geo}',  '{"kind":"arrow","variant":"axis","points":[[48.9,43.7],[48.85,44.52]]}'),
    '{6,geo}',  '{"kind":"point","lat":48.71,"lng":44.51}'),
    '{8,geo}',  '{"kind":"arrow","variant":"red","points":[[49.6,42.7],[48.74,43.55]]}'),
    '{9,geo}',  '{"kind":"arrow","variant":"red","points":[[47.9,45.0],[48.66,43.62]]}'),
    '{10,geo}', '{"kind":"arrow","variant":"red","points":[[48.6,43.75],[48.7,44.38]]}')
WHERE id = 'stalingrad';
