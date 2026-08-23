-- 148: campaign geometry for the maneuver-war events (pattern: 146/147).
--
-- Timeline geo per beat: point = static, arrow = movement ([lat,lng]
-- waypoints). variant 'red' = Red Army and communist-led forces, 'axis' =
-- their opponent in that war (Wehrmacht, Whites, Polish army, UN command),
-- omitted = western Allies (neutral solid stroke). Beats at an already-
-- numbered or already-labeled spot get no geo; political beats get none —
-- that is the intended shape. locations gain kind:'geo' river names where
-- the river is on the frame and carries the story.

-- ── 대조국전쟁 ──
UPDATE commulingo_history_events SET locations = '[
  {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"},"kind":"main"},
  {"lat":52.10,"lng":23.70,"label":{"ko":"브레스트","en":"Brest"}},
  {"lat":48.71,"lng":44.51,"label":{"ko":"스탈린그라드","en":"Stalingrad"}},
  {"lat":51.73,"lng":36.19,"label":{"ko":"쿠르스크","en":"Kursk"}},
  {"lat":52.52,"lng":13.40,"label":{"ko":"베를린","en":"Berlin"}},
  {"lat":49.00,"lng":33.90,"label":{"ko":"드네프르강","en":"Dnieper"},"kind":"geo"}
]'::jsonb WHERE id = 'great-patriotic-war';

UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{0,geo}',  '{"kind":"arrow","variant":"axis","points":[[52.3,23.8],[54.8,31.0]],"label":{"ko":"스몰렌스크 방면","en":"toward Smolensk"}}'),
    '{2,geo}',  '{"kind":"point","lat":59.94,"lng":30.31,"label":{"ko":"레닌그라드","en":"Leningrad"}}'),
    '{4,geo}',  '{"kind":"arrow","variant":"red","points":[[55.8,37.9],[56.2,35.2]]}'),
    '{5,geo}',  '{"kind":"point","lat":48.71,"lng":44.51}'),
    '{7,geo}',  '{"kind":"arrow","variant":"red","points":[[49.6,42.7],[48.7,43.5]],"label":{"ko":"칼라치","en":"Kalach"}}'),
    '{9,geo}',  '{"kind":"point","lat":51.73,"lng":36.19}'),
    '{10,geo}', '{"kind":"point","lat":53.50,"lng":28.00,"label":{"ko":"벨라루스","en":"Byelorussia"}}'),
    '{11,geo}', '{"kind":"arrow","variant":"red","points":[[54.3,30.5],[52.5,24.0]],"label":{"ko":"민스크 방면","en":"through Minsk"}}'),
    '{12,geo}', '{"kind":"point","lat":50.03,"lng":19.20,"label":{"ko":"아우슈비츠","en":"Auschwitz"}}'),
    '{13,geo}', '{"kind":"arrow","variant":"red","points":[[52.5,15.6],[52.52,13.6]]}')
WHERE id = 'great-patriotic-war';

-- ── 겨울전쟁 ──
UPDATE commulingo_history_events SET locations = '[
  {"lat":60.71,"lng":28.75,"label":{"ko":"비푸리","en":"Viipuri"},"kind":"main"},
  {"lat":60.17,"lng":24.94,"label":{"ko":"헬싱키","en":"Helsinki"}},
  {"lat":64.88,"lng":28.91,"label":{"ko":"수오무살미","en":"Suomussalmi"}},
  {"lat":60.90,"lng":31.50,"label":{"ko":"라도가호","en":"Lake Ladoga"},"kind":"geo"}
]'::jsonb WHERE id = 'winter-war';

UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{2,geo}', '{"kind":"point","lat":60.28,"lng":29.85,"label":{"ko":"마이닐라","en":"Mainila"}}'),
    '{3,geo}', '{"kind":"arrow","variant":"red","points":[[60.05,30.1],[60.5,29.2]],"label":{"ko":"카렐리야 지협","en":"Karelian Isthmus"}}'),
    '{4,geo}', '{"kind":"point","lat":60.20,"lng":29.70,"label":{"ko":"테리요키","en":"Terijoki"}}'),
    '{6,geo}', '{"kind":"point","lat":64.88,"lng":28.90}'),
    '{7,geo}', '{"kind":"arrow","variant":"red","points":[[60.25,29.6],[60.68,28.85]]}')
WHERE id = 'winter-war';

-- ── 내전과 열강의 개입 ── (대륙 규모 프레임: 화살표는 파노라마로 읽힌다)
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{0,geo}',  '{"kind":"point","lat":52.10,"lng":23.70,"label":{"ko":"브레스트-리토프스크","en":"Brest-Litovsk"}}'),
    '{2,geo}',  '{"kind":"arrow","variant":"axis","points":[[53.2,45.0],[55.0,82.9]],"label":{"ko":"시베리아 횡단철도","en":"Trans-Siberian Railway"}}'),
    '{3,geo}',  '{"kind":"point","lat":46.48,"lng":30.73,"label":{"ko":"오데사","en":"Odessa"}}'),
    '{6,geo}',  '{"kind":"point","lat":54.99,"lng":73.37}'),
    '{7,geo}',  '{"kind":"arrow","variant":"red","points":[[53.4,51.0],[54.7,65.0]],"label":{"ko":"우랄 방면","en":"toward the Urals"}}'),
    '{8,geo}',  '{"kind":"arrow","variant":"axis","points":[[47.5,39.9],[52.9,36.1]],"label":{"ko":"오룔","en":"Oryol"}}'),
    '{9,geo}',  '{"kind":"arrow","variant":"red","points":[[55.0,73.4],[52.3,104.3]],"label":{"ko":"이르쿠츠크","en":"Irkutsk"}}'),
    '{11,geo}', '{"kind":"arrow","variant":"red","points":[[46.2,33.7],[45.0,34.1]],"label":{"ko":"페레코프","en":"Perekop"}}'),
    '{13,geo}', '{"kind":"point","lat":43.12,"lng":131.89}')
WHERE id = 'civil-war';

-- ── 소비에트-폴란드 전쟁 ──
UPDATE commulingo_history_events SET locations = '[
  {"lat":52.23,"lng":21.01,"label":{"ko":"바르샤바","en":"Warsaw"},"kind":"main"},
  {"lat":50.45,"lng":30.52,"label":{"ko":"키예프","en":"Kiev"}},
  {"lat":49.84,"lng":24.03,"label":{"ko":"리보프","en":"Lwów"}},
  {"lat":51.40,"lng":21.70,"label":{"ko":"비스와강","en":"Vistula"},"kind":"geo"}
]'::jsonb WHERE id = 'soviet-polish-war';

UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo}',  '{"kind":"point","lat":52.53,"lng":24.98,"label":{"ko":"베레자 카르투스카","en":"Bereza Kartuska"}}'),
    '{2,geo}',  '{"kind":"point","lat":54.69,"lng":25.28,"label":{"ko":"빌노","en":"Wilno"}}'),
    '{4,geo}',  '{"kind":"arrow","variant":"axis","points":[[50.9,26.5],[50.5,30.2]]}'),
    '{5,geo}',  '{"kind":"arrow","variant":"red","points":[[49.8,30.0],[50.2,27.8]],"label":{"ko":"지토미르 돌파","en":"breakthrough at Zhytomyr"}}'),
    '{6,geo}',  '{"kind":"arrow","variant":"red","points":[[55.0,29.5],[53.9,25.8]],"label":{"ko":"민스크 방면","en":"through Minsk"}}'),
    '{8,geo}',  '{"kind":"point","lat":53.13,"lng":23.16,"label":{"ko":"비아위스토크","en":"Białystok"}}'),
    '{9,geo}',  '{"kind":"arrow","variant":"axis","points":[[51.55,22.6],[52.75,21.9]],"label":{"ko":"비에프시강 반격","en":"Wieprz counterstroke"}}'),
    '{10,geo}', '{"kind":"arrow","variant":"axis","points":[[53.2,23.4],[53.75,25.0]],"label":{"ko":"네만강","en":"the Niemen"}}'),
    '{12,geo}', '{"kind":"point","lat":56.95,"lng":24.11,"label":{"ko":"리가","en":"Riga"}}')
WHERE id = 'soviet-polish-war';

-- ── 소련의 대일 참전과 만주 작전 ──
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{4,geo}',  '{"kind":"point","lat":34.39,"lng":132.45,"label":{"ko":"히로시마","en":"Hiroshima"}}'),
    '{6,geo}',  '{"kind":"arrow","variant":"red","points":[[47.5,115.5],[46.3,121.5],[44.8,124.5]],"label":{"ko":"대흥안령 돌파","en":"across the Greater Khingan"}}'),
    '{10,geo}', '{"kind":"point","lat":43.90,"lng":125.30,"label":{"ko":"신징(창춘)","en":"Hsinking (Changchun)"}}'),
    '{11,geo}', '{"kind":"point","lat":35.40,"lng":139.75,"label":{"ko":"도쿄만","en":"Tokyo Bay"}}')
WHERE id = 'manchurian-operation';

-- ── 한국전쟁 ── (red = 조선인민군·중국 인민지원군, axis = 유엔군)
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo}', '{"kind":"arrow","variant":"red","points":[[38.15,127.0],[37.45,127.0]],"label":{"ko":"38선","en":"the 38th parallel"}}'),
    '{3,geo}', '{"kind":"arrow","variant":"axis","points":[[37.2,126.0],[37.55,126.85]],"label":{"ko":"인천","en":"Incheon"}}'),
    '{4,geo}', '{"kind":"arrow","variant":"red","points":[[41.4,126.6],[39.6,126.4]],"label":{"ko":"압록강","en":"the Yalu"}}'),
    '{5,geo}', '{"kind":"point","lat":40.10,"lng":124.60,"label":{"ko":"미그 회랑","en":"MiG Alley"}}'),
    '{6,geo}', '{"kind":"point","lat":37.96,"lng":126.67,"label":{"ko":"판문점","en":"Panmunjom"}}')
WHERE id = 'korean-war';

-- ── 프랑스 침공과 비시 정부 ── (variant 생략 = 프랑스·영국의 중립 실선)
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{1,geo}',  '{"kind":"point","lat":51.03,"lng":4.48,"label":{"ko":"메헬렌","en":"Mechelen"}}'),
    '{3,geo}',  '{"kind":"arrow","variant":"axis","points":[[50.4,6.0],[49.7,4.9],[50.1,1.85]],"label":{"ko":"낫질 기동","en":"the sickle cut"}}'),
    '{4,geo}',  '{"kind":"arrow","points":[[49.4,4.15],[49.68,3.96]],"label":{"ko":"몽코르네","en":"Montcornet"}}'),
    '{5,geo}',  '{"kind":"arrow","points":[[51.03,2.3],[51.14,1.45]]}'),
    '{6,geo}',  '{"kind":"point","lat":48.86,"lng":2.35}'),
    '{7,geo}',  '{"kind":"point","lat":51.51,"lng":-0.13,"label":{"ko":"런던","en":"London"}}'),
    '{8,geo}',  '{"kind":"point","lat":49.43,"lng":2.90,"label":{"ko":"콩피에뉴","en":"Compiègne"}}'),
    '{9,geo}',  '{"kind":"point","lat":46.13,"lng":3.42}'),
    '{12,geo}', '{"kind":"arrow","variant":"axis","points":[[46.5,3.5],[44.2,4.7]],"label":{"ko":"자유지대","en":"the zone libre"}}')
WHERE id = 'fall-of-france';

-- ── 이탈리아 전선과 무솔리니의 몰락 ── (variant 생략 = 연합군, red = 파르티잔)
UPDATE commulingo_history_events SET timeline =
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(
  jsonb_set(jsonb_set(jsonb_set(jsonb_set(jsonb_set(timeline,
    '{0,geo}',  '{"kind":"point","lat":36.80,"lng":10.18,"label":{"ko":"튀니스","en":"Tunis"}}'),
    '{1,geo}',  '{"kind":"arrow","points":[[35.9,14.6],[36.95,14.35]]}'),
    '{4,geo}',  '{"kind":"point","lat":38.19,"lng":15.55,"label":{"ko":"메시나","en":"Messina"}}'),
    '{5,geo}',  '{"kind":"point","lat":36.98,"lng":15.20,"label":{"ko":"카시빌레","en":"Cassibile"}}'),
    '{6,geo}',  '{"kind":"arrow","variant":"axis","points":[[46.3,11.2],[43.8,11.35]],"label":{"ko":"북이탈리아","en":"northern Italy"}}'),
    '{7,geo}',  '{"kind":"point","lat":42.47,"lng":13.57,"label":{"ko":"그란사소","en":"Gran Sasso"}}'),
    '{8,geo}',  '{"kind":"arrow","points":[[41.2,12.2],[41.45,12.62]],"label":{"ko":"안치오","en":"Anzio"}}'),
    '{10,geo}', '{"kind":"arrow","points":[[43.55,11.4],[44.5,11.25]],"label":{"ko":"고딕선","en":"the Gothic Line"}}'),
    '{11,geo}', '{"kind":"point","lat":45.46,"lng":9.19}'),
    '{12,geo}', '{"kind":"point","lat":41.07,"lng":14.33,"label":{"ko":"카세르타","en":"Caserta"}}')
WHERE id = 'italian-campaign';
