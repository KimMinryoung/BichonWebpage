-- 152: polish pass on the 151 slate, after rendering every map (pattern: 149).
--
-- Three arrows collided with resting city labels: at Leningrad the Road of
-- Life and Iskra arrowheads pierced the 레닌그라드 label (the label spans
-- ~2° of longitude at this frame), at Belgrade the liberation arrow ran the
-- length of the 베오그라드 label, and the Pearl Harbor dashes cut through
-- 미드웨이. Reroute: Road of Life crosses the lake higher, Iskra approaches
-- below the label band, Belgrade is entered from the southeast under its
-- label, the invasion arrowhead stops above it, and the Pearl arrow bows
-- one degree lower.

UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(timeline,
    '{6,geo,points}', '[[60.05,32.9],[60.42,31.55]]'),
    '{8,geo,points}', '[[59.5,32.6],[59.78,31.6]]')
WHERE id = 'siege-of-leningrad';

UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(timeline,
    '{0,geo,points}',  '[[46.6,18.9],[45.05,20.3]]'),
    '{10,geo,points}', '[[44.15,22.3],[44.62,20.75]]')
WHERE id = 'yugoslav-partisans';

UPDATE commulingo_history_events SET timeline =
  jsonb_set(timeline,
    '{4,geo,points}', '[[38.0,145.0],[25.5,-170.0],[22.5,-159.5]]')
WHERE id = 'pacific-war';

-- 슐리셀부르크 점(4번 항목)은 레닌그라드 라벨 글자 위에 정확히 겹치는
-- 자리라 제거 — 그 자리는 이스크라 화살표가 가리킨다.
UPDATE commulingo_history_events SET timeline = timeline #- '{4,geo}'
WHERE id = 'siege-of-leningrad';
