-- 150: name the mover on every campaign arrow (146/148/149 geometry).
--
-- An arrow's variant colors the side, but color alone cannot say WHOSE
-- advance it is — the map showed movement with no subject. Each movement
-- arrow gains geo.actor {ko,en}; the renderer builds an always-visible
-- legend from the distinct actors and prefixes the actor to the highlight
-- label. Names follow the event's own timeline prose (독일 제6군, 자바이칼
-- 전선군, 조선인민군…), not invented precision. Points stay actor-less —
-- a conference or a surrender has no moving force.

-- ── 스탈린그라드 전투 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo,actor}',  '{"ko":"독일 남부 집단군","en":"German Army Group South"}'),
    '{2,geo,actor}',  '{"ko":"독일 A집단군","en":"German Army Group A"}'),
    '{3,geo,actor}',  '{"ko":"독일 제6군","en":"German Sixth Army"}'),
    '{5,geo,actor}',  '{"ko":"독일 제6군","en":"German Sixth Army"}'),
    '{8,geo,actor}',  '{"ko":"소련군","en":"Soviet forces"}'),
    '{9,geo,actor}',  '{"ko":"소련군","en":"Soviet forces"}'),
    '{10,geo,actor}', '{"ko":"소련군","en":"Soviet forces"}')
WHERE id = 'stalingrad';

-- ── 대조국전쟁 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{0,geo,actor}',  '{"ko":"독일군","en":"German forces"}'),
    '{4,geo,actor}',  '{"ko":"소련군","en":"Soviet forces"}'),
    '{7,geo,actor}',  '{"ko":"소련군","en":"Soviet forces"}'),
    '{11,geo,actor}', '{"ko":"소련군","en":"Soviet forces"}'),
    '{13,geo,actor}', '{"ko":"소련군","en":"Soviet forces"}')
WHERE id = 'great-patriotic-war';

-- ── 겨울전쟁 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(timeline,
    '{3,geo,actor}', '{"ko":"붉은 군대","en":"Red Army"}'),
    '{7,geo,actor}', '{"ko":"붉은 군대","en":"Red Army"}')
WHERE id = 'winter-war';

-- ── 내전과 열강의 개입 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{2,geo,actor}',  '{"ko":"체코슬로바키아 군단","en":"Czechoslovak Legion"}'),
    '{7,geo,actor}',  '{"ko":"붉은 군대","en":"Red Army"}'),
    '{8,geo,actor}',  '{"ko":"데니킨의 백군","en":"Denikin''s White army"}'),
    '{9,geo,actor}',  '{"ko":"붉은 군대","en":"Red Army"}'),
    '{11,geo,actor}', '{"ko":"붉은 군대","en":"Red Army"}')
WHERE id = 'civil-war';

-- ── 소비에트-폴란드 전쟁 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{4,geo,actor}',  '{"ko":"폴란드군","en":"Polish army"}'),
    '{5,geo,actor}',  '{"ko":"제1기병군","en":"First Cavalry Army"}'),
    '{6,geo,actor}',  '{"ko":"서부전선군","en":"Western Front"}'),
    '{9,geo,actor}',  '{"ko":"폴란드군","en":"Polish army"}'),
    '{10,geo,actor}', '{"ko":"폴란드군","en":"Polish army"}')
WHERE id = 'soviet-polish-war';

-- ── 소련의 대일 참전과 만주 작전 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(timeline,
    '{6,geo,actor}', '{"ko":"자바이칼 전선군","en":"Transbaikal Front"}')
WHERE id = 'manchurian-operation';

-- ── 한국전쟁 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo,actor}', '{"ko":"조선인민군","en":"Korean People''s Army"}'),
    '{3,geo,actor}', '{"ko":"유엔군","en":"UN forces"}'),
    '{4,geo,actor}', '{"ko":"중국 인민지원군","en":"Chinese People''s Volunteers"}')
WHERE id = 'korean-war';

-- ── 프랑스 침공과 비시 정부 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{3,geo,actor}',  '{"ko":"독일군","en":"German forces"}'),
    '{4,geo,actor}',  '{"ko":"드골의 제4기갑사단","en":"de Gaulle''s 4th Armoured Division"}'),
    '{5,geo,actor}',  '{"ko":"연합군","en":"Allied forces"}'),
    '{12,geo,actor}', '{"ko":"독일·이탈리아군","en":"German and Italian forces"}')
WHERE id = 'fall-of-france';

-- ── 이탈리아 전선과 무솔리니의 몰락 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo,actor}',  '{"ko":"연합군","en":"Allied forces"}'),
    '{6,geo,actor}',  '{"ko":"독일군","en":"German forces"}'),
    '{8,geo,actor}',  '{"ko":"연합군","en":"Allied forces"}'),
    '{10,geo,actor}', '{"ko":"연합군","en":"Allied forces"}')
WHERE id = 'italian-campaign';
