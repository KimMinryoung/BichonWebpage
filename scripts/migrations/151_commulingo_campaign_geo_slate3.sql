-- 151: third campaign-geometry slate — the war events left bare by 146/148.
--
-- Same shape as 146/148/150: inline timeline geo, point = static beat,
-- arrow = movement with actor {ko,en} (legend + highlight label). Side
-- convention: red = Soviet/communist-led, axis = that war's opponent of the
-- red side (Luftwaffe, Franco, the Berlin-airlift West), omitted = western
-- Allies where they fight the Axis. Purely political beats stay bare, and
-- beats at an already-marked spot reuse the marker with no label. City-scale
-- moves (Kronstadt ice assaults, Khalkhin Gol tactics) get points, not
-- arrows — at these frames a sub-degree arrow is an arrowhead blob.

-- ── 태평양 전쟁 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo}',  '{"kind":"point","lat":39.85,"lng":116.21,"label":{"ko":"루거우차오","en":"Marco Polo Bridge"}}'),
    '{4,geo}',  '{"kind":"arrow","variant":"axis","points":[[38.0,145.0],[27.0,-170.0],[22.5,-159.5]],"actor":{"ko":"일본군","en":"Japanese forces"},"label":{"ko":"진주만 기습","en":"the Pearl Harbor strike"}}'),
    '{5,geo}',  '{"kind":"point","lat":-14.5,"lng":154.0,"label":{"ko":"산호해","en":"the Coral Sea"}}'),
    '{6,geo}',  '{"kind":"point","lat":28.21,"lng":-177.37}'),
    '{7,geo}',  '{"kind":"arrow","points":[[-13.0,163.5],[-9.5,160.3]],"actor":{"ko":"연합군","en":"Allied forces"},"label":{"ko":"과달카날","en":"Guadalcanal"}}'),
    '{8,geo}',  '{"kind":"arrow","points":[[8.0,150.0],[15.0,145.9]],"actor":{"ko":"미군","en":"US forces"},"label":{"ko":"마리아나 제도","en":"the Marianas"}}'),
    '{9,geo}',  '{"kind":"point","lat":24.78,"lng":141.32,"label":{"ko":"이오지마","en":"Iwo Jima"}}'),
    '{10,geo}', '{"kind":"point","lat":34.39,"lng":132.45}'),
    '{11,geo}', '{"kind":"arrow","variant":"red","points":[[49.0,116.0],[44.0,125.0]],"actor":{"ko":"소련군","en":"Soviet forces"},"label":{"ko":"만주","en":"Manchuria"}}'),
    '{12,geo}', '{"kind":"point","lat":35.35,"lng":139.80,"label":{"ko":"도쿄만","en":"Tokyo Bay"}}')
WHERE id = 'pacific-war';

-- ── 레닌그라드 봉쇄 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{2,geo}',  '{"kind":"point","lat":58.73,"lng":29.85,"label":{"ko":"루가","en":"Luga"}}'),
    '{3,geo}',  '{"kind":"arrow","variant":"axis","points":[[58.3,30.2],[59.7,31.05]],"actor":{"ko":"독일군","en":"German forces"},"label":{"ko":"므가","en":"Mga"}}'),
    '{4,geo}',  '{"kind":"point","lat":59.95,"lng":31.03,"label":{"ko":"슐리셀부르크","en":"Shlisselburg"}}'),
    '{6,geo}',  '{"kind":"arrow","variant":"red","points":[[59.95,32.7],[60.12,31.1]],"actor":{"ko":"소련군","en":"Soviet forces"},"label":{"ko":"생명의 길","en":"the Road of Life"}}'),
    '{8,geo}',  '{"kind":"arrow","variant":"red","points":[[59.7,32.8],[59.92,31.15]],"actor":{"ko":"소련군","en":"Soviet forces"},"label":{"ko":"이스크라 작전","en":"Operation Iskra"}}'),
    '{10,geo}', '{"kind":"arrow","variant":"red","points":[[59.6,30.2],[57.9,28.8]],"actor":{"ko":"소련군","en":"Soviet forces"},"label":{"ko":"프스코프 방면","en":"toward Pskov"}}')
WHERE id = 'siege-of-leningrad';

-- ── 제2전선과 노르망디 상륙 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{6,geo}',  '{"kind":"point","lat":50.80,"lng":-1.09,"label":{"ko":"영국 남부","en":"southern England"}}'),
    '{8,geo}',  '{"kind":"arrow","points":[[50.9,-1.3],[49.37,-0.6]],"actor":{"ko":"연합군","en":"Allied forces"},"label":{"ko":"오버로드 작전","en":"Operation Overlord"}}'),
    '{10,geo}', '{"kind":"arrow","points":[[49.2,0.2],[48.88,2.2]],"actor":{"ko":"연합군","en":"Allied forces"},"label":{"ko":"파리 해방","en":"liberation of Paris"}}'),
    '{11,geo}', '{"kind":"point","lat":49.26,"lng":4.03,"label":{"ko":"랭스","en":"Reims"}}')
WHERE id = 'second-front-normandy';

-- ── 스페인 내전 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo}',  '{"kind":"arrow","variant":"axis","points":[[35.2,-5.4],[37.4,-5.98]],"actor":{"ko":"반란군","en":"Nationalist rebels"},"label":{"ko":"세비야","en":"Seville"}}'),
    '{8,geo}',  '{"kind":"point","lat":40.10,"lng":-3.69,"label":{"ko":"세세냐","en":"Seseña"}}'),
    '{9,geo}',  '{"kind":"point","lat":40.42,"lng":-3.70}'),
    '{10,geo}', '{"kind":"point","lat":43.31,"lng":-2.68}'),
    '{12,geo}', '{"kind":"point","lat":41.39,"lng":2.17}'),
    '{17,geo}', '{"kind":"arrow","variant":"red","points":[[42.0,1.4],[41.02,0.42]],"actor":{"ko":"공화국 인민군","en":"the Republican People''s Army"},"label":{"ko":"에브로강","en":"the Ebro"}}'),
    '{18,geo}', '{"kind":"arrow","variant":"axis","points":[[40.7,0.8],[41.39,2.1]],"actor":{"ko":"프랑코군","en":"Franco''s forces"},"label":{"ko":"카탈루냐","en":"Catalonia"}}')
WHERE id = 'spanish-civil-war';

-- ── 독소 불가침조약과 동유럽 분할 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{4,geo}',  '{"kind":"point","lat":55.75,"lng":37.62}'),
    '{5,geo}',  '{"kind":"arrow","variant":"axis","points":[[52.5,14.8],[52.25,19.6]],"actor":{"ko":"독일군","en":"German forces"},"label":{"ko":"바르샤바 방면","en":"toward Warsaw"}}'),
    '{7,geo}',  '{"kind":"arrow","variant":"red","points":[[53.5,27.5],[52.6,23.9]],"actor":{"ko":"소련군","en":"Soviet forces"},"label":{"ko":"폴란드 동부","en":"eastern Poland"}}'),
    '{8,geo}',  '{"kind":"point","lat":52.10,"lng":23.70}'),
    '{14,geo}', '{"kind":"point","lat":54.77,"lng":31.79,"label":{"ko":"카틴","en":"Katyn"}}'),
    '{15,geo}', '{"kind":"arrow","variant":"red","points":[[56.2,25.5],[58.6,25.0]],"actor":{"ko":"소련군","en":"Soviet forces"},"label":{"ko":"발트 3국","en":"the Baltic states"}}'),
    '{16,geo}', '{"kind":"arrow","variant":"red","points":[[48.0,30.8],[47.03,28.6]],"actor":{"ko":"소련군","en":"Soviet forces"},"label":{"ko":"베사라비아","en":"Bessarabia"}}')
WHERE id = 'nazi-soviet-pact';

-- ── 소련-일본 국경 전쟁 ── (전술 이동은 이 프레임에서 덩어리라 점만)
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(timeline,
    '{4,geo}', '{"kind":"point","lat":42.43,"lng":130.64}'),
    '{6,geo}', '{"kind":"point","lat":47.63,"lng":118.63}')
WHERE id = 'soviet-japanese-border-wars';

-- ── 유고슬라비아 파르티잔 전쟁 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{0,geo}',  '{"kind":"arrow","variant":"axis","points":[[46.6,18.9],[44.9,20.35]],"actor":{"ko":"추축군","en":"Axis forces"},"label":{"ko":"유고슬라비아 침공","en":"invasion of Yugoslavia"}}'),
    '{3,geo}',  '{"kind":"point","lat":43.86,"lng":19.84,"label":{"ko":"우지체","en":"Užice"}}'),
    '{5,geo}',  '{"kind":"point","lat":44.82,"lng":15.87,"label":{"ko":"비하치","en":"Bihać"}}'),
    '{6,geo}',  '{"kind":"point","lat":43.66,"lng":17.76,"label":{"ko":"네레트바강","en":"the Neretva"}}'),
    '{7,geo}',  '{"kind":"point","lat":43.35,"lng":18.69,"label":{"ko":"수테스카","en":"Sutjeska"}}'),
    '{8,geo}',  '{"kind":"point","lat":44.34,"lng":17.27}'),
    '{10,geo}', '{"kind":"arrow","variant":"red","points":[[44.6,22.3],[44.8,20.6]],"actor":{"ko":"파르티잔과 붉은 군대","en":"Partisans and the Red Army"},"label":{"ko":"베오그라드","en":"Belgrade"}}')
WHERE id = 'yugoslav-partisans';

-- ── 베를린 봉쇄와 공수 ── (냉전 규약: 서방 공수 = axis)
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(timeline,
    '{4,geo}', '{"kind":"point","lat":52.52,"lng":13.40}'),
    '{5,geo}', '{"kind":"arrow","variant":"axis","points":[[50.1,8.6],[52.4,13.2]],"actor":{"ko":"미·영 공군","en":"US and British air forces"},"label":{"ko":"공중 회랑","en":"the air corridors"}}')
WHERE id = 'berlin-blockade';

-- ── 크론시타트 봉기 ── (도시 규모라 점만: 파업의 페트로그라드, 함락의 요새)
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(timeline,
    '{1,geo}', '{"kind":"point","lat":59.94,"lng":30.31,"label":{"ko":"페트로그라드","en":"Petrograd"}}'),
    '{8,geo}', '{"kind":"point","lat":60.01,"lng":29.77}')
WHERE id = 'kronstadt-1921';

-- ── 헝가리 혁명 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(timeline,
    '{1,geo}', '{"kind":"point","lat":47.50,"lng":19.04}'),
    '{3,geo}', '{"kind":"arrow","variant":"red","points":[[48.4,22.2],[47.55,19.4]],"actor":{"ko":"소련군","en":"Soviet forces"},"label":{"ko":"부다페스트 진입","en":"into Budapest"}}')
WHERE id = 'hungarian-revolution';

-- ── 소련-아프가니스탄 전쟁 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo}', '{"kind":"arrow","variant":"red","points":[[37.1,67.4],[34.7,69.0]],"actor":{"ko":"소련군","en":"Soviet forces"},"label":{"ko":"카불 진입","en":"into Kabul"}}'),
    '{2,geo}', '{"kind":"point","lat":35.35,"lng":69.70}'),
    '{3,geo}', '{"kind":"arrow","variant":"red","points":[[34.75,69.35],[37.15,67.75]],"actor":{"ko":"소련군","en":"Soviet forces"},"label":{"ko":"철군","en":"withdrawal"}}')
WHERE id = 'afghanistan-war';

-- ── 프랑스 레지스탕스와 해방 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{6,geo}',  '{"kind":"arrow","variant":"axis","points":[[46.6,3.4],[44.3,4.6]],"actor":{"ko":"독일군","en":"German forces"},"label":{"ko":"남부 점령","en":"occupation of the south"}}'),
    '{8,geo}',  '{"kind":"point","lat":45.76,"lng":4.84}'),
    '{9,geo}',  '{"kind":"point","lat":49.34,"lng":-0.60,"label":{"ko":"노르망디","en":"Normandy"}}'),
    '{10,geo}', '{"kind":"arrow","points":[[42.5,7.0],[43.4,6.5],[45.0,5.5]],"actor":{"ko":"연합군","en":"Allied forces"},"label":{"ko":"용기병 작전","en":"Operation Dragoon"}}'),
    '{11,geo}', '{"kind":"point","lat":48.86,"lng":2.35}')
WHERE id = 'french-resistance';

-- ── 영국 본토 항공전 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(timeline,
    '{6,geo}',  '{"kind":"arrow","variant":"axis","points":[[50.2,1.6],[51.2,0.5]],"actor":{"ko":"독일 공군","en":"the Luftwaffe"},"label":{"ko":"남부 비행장","en":"southern airfields"}}'),
    '{8,geo}',  '{"kind":"arrow","variant":"axis","points":[[50.3,1.9],[51.45,0.1]],"actor":{"ko":"독일 공군","en":"the Luftwaffe"},"label":{"ko":"블리츠","en":"the Blitz"}}'),
    '{11,geo}', '{"kind":"point","lat":52.41,"lng":-1.51}')
WHERE id = 'battle-of-britain';

-- ── 1905년 혁명 ── (움직임 없는 산개 사건: 점만, 범례 없음)
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo}',  '{"kind":"point","lat":59.94,"lng":30.31}'),
    '{2,geo}',  '{"kind":"point","lat":57.00,"lng":40.97,"label":{"ko":"이바노보-보즈네센스크","en":"Ivanovo-Voznesensk"}}'),
    '{4,geo}',  '{"kind":"point","lat":46.48,"lng":30.73}'),
    '{10,geo}', '{"kind":"point","lat":55.75,"lng":37.62}')
WHERE id = 'revolution-1905';

-- ── 그리스 저항과 12월 사건 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{0,geo}',  '{"kind":"arrow","variant":"axis","points":[[40.9,20.4],[39.6,20.9]],"actor":{"ko":"이탈리아군","en":"Italian forces"},"label":{"ko":"에피루스","en":"Epirus"}}'),
    '{1,geo}',  '{"kind":"arrow","variant":"axis","points":[[42.0,22.3],[40.7,22.9]],"actor":{"ko":"독일군","en":"German forces"},"label":{"ko":"테살로니키","en":"Thessaloniki"}}'),
    '{3,geo}',  '{"kind":"point","lat":41.15,"lng":24.14,"label":{"ko":"드라마","en":"Drama"}}'),
    '{6,geo}',  '{"kind":"point","lat":38.78,"lng":22.38}'),
    '{10,geo}', '{"kind":"point","lat":37.98,"lng":23.73}')
WHERE id = 'greek-resistance';

-- ── 바르샤바 봉기 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(timeline,
    '{3,geo}', '{"kind":"point","lat":51.25,"lng":22.57,"label":{"ko":"루블린","en":"Lublin"}}'),
    '{6,geo}', '{"kind":"point","lat":52.23,"lng":21.01}'),
    '{9,geo}', '{"kind":"arrow","variant":"red","points":[[52.2,23.5],[52.24,21.6]],"actor":{"ko":"제1폴란드군","en":"the First Polish Army"},"label":{"ko":"비스와강","en":"the Vistula"}}')
WHERE id = 'warsaw-uprising';

-- 항공전 지도의 무대인 해협에 지형 이름(마커 없음, 프레임 불참)
UPDATE commulingo_history_events SET locations = locations ||
  '[{"lat":50.55,"lng":0.3,"label":{"ko":"영국 해협","en":"English Channel"},"kind":"geo"}]'::jsonb
WHERE id = 'battle-of-britain';
