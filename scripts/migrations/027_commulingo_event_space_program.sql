-- Event: the Soviet space program (1957–1965).
-- Covers Tsiolkovsky's legacy, Korolev's OKB-1 (including his 1938 arrest,
-- stated honestly), the R-7, Sputnik, Laika, the Luna probes, Gagarin's
-- Vostok 1, Titov, Tereshkova, and Leonov's first spacewalk.
-- Idempotent: safe to run more than once.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('soviet-space-program', 90, '1957–1965',
     '소련 우주 계획', 'The Soviet Space Program',
     '40년 전까지 말과 쟁기로 밭을 갈던 나라는 어떻게 인류를 우주로 먼저 보냈는가?',
     'How did a country that had been ploughing with horses forty years earlier become the first to send humanity into space?',
     '1957년 스푸트니크 1호에서 1965년 레오노프의 우주 유영까지, 소련은 최초의 인공위성, 최초의 유인 비행, 최초의 여성 우주인, 최초의 우주 유영이라는 우주 시대의 첫 관문들을 모두 먼저 통과했다. 치올콥스키가 남긴 이론, 코롤료프의 OKB-1 설계국, 그리고 무상 대중 기술교육과 계획경제가 집중시킨 자원이 이 도약을 떠받쳤다. 그것은 한 세대 전까지 농업국이었던 나라가 이룬 세계사적 성취였다.',
     'From Sputnik 1 in 1957 to Leonov''s spacewalk in 1965, the Soviet Union was first through every early gateway of the space age: the first artificial satellite, the first human spaceflight, the first woman in space, and the first spacewalk. The theoretical legacy of Tsiolkovsky, Korolev''s OKB-1 design bureau, and the resources concentrated by free mass technical education and the planned economy carried the leap. It was a world-historical achievement by a country that had been agrarian a generation earlier.',
     '가가린은 식민 지배에서 갓 벗어난 나라들을 포함해 전 세계가 환영한 상징이 됐고, 소련의 성취는 각국의 과학 교육과 우주 개발을 자극했다. R-7 계열 발사체와 보스토크에서 이어진 소유스는 오늘날까지 사람을 궤도로 실어 나른다. 총설계사 코롤료프의 이름은 보안을 이유로 생전에 공개되지 않았고, 1966년 그가 죽은 뒤에야 나라는 우주 계획을 이끈 사람이 누구였는지 알게 됐다.',
     'Gagarin became a symbol welcomed across the world, including in countries newly emerging from colonial rule, and Soviet achievements spurred science education and space programs everywhere. The R-7 family of launchers and the Soyuz line descended from Vostok still carry people to orbit today. The name of chief designer Korolev was kept secret during his lifetime, and only after his death in 1966 did the country learn who had led its space program.',
     $$[
  {
    "date":"1903",
    "title":{"ko":"치올콥스키, 우주 비행의 방정식을 내놓다","en":"Tsiolkovsky publishes the equations of spaceflight"},
    "body":{"ko":"칼루가의 독학 교사 콘스탄틴 치올콥스키가 「반작용 장치에 의한 우주 공간의 탐구」에서 로켓 방정식과 액체 연료, 다단 로켓의 원리를 제시했다. 혁명 뒤 소비에트 정부는 무명이던 그의 연구를 지원했고, 그의 이론은 한 세대의 기술자들에게 우주 비행을 실현 가능한 과제로 만들었다.","en":"Konstantin Tsiolkovsky, a self-taught schoolteacher in Kaluga, set out the rocket equation and the principles of liquid propellant and multi-stage rockets in his Exploration of Outer Space by Means of Reaction Devices. After the revolution the Soviet government supported his once-obscure research, and his theory made spaceflight a practical task for a generation of engineers."}
  },
  {
    "date":"1938–1944",
    "title":{"ko":"코롤료프의 체포와 복귀","en":"Korolev's arrest and return"},
    "body":{"ko":"대테러기인 1938년, 로켓 연구자 세르게이 코롤료프는 근거 없는 혐의로 체포되어 콜리마 금광을 거쳐 수감 설계국(샤라시카)에서 일했다. 1944년 석방된 그는 로켓 개발의 중심으로 복귀했고, 부당했던 유죄 판결은 1957년 완전 복권으로 바로잡혔다.","en":"In 1938, during the Great Terror, the rocket engineer Sergei Korolev was arrested on baseless charges and passed through the Kolyma gold mines into a prison design bureau (sharashka). Released in 1944, he returned to the center of rocket development, and the unjust conviction was overturned by full rehabilitation in 1957."}
  },
  {
    "date":"1946.08",
    "title":{"ko":"코롤료프, 장거리 로켓 총설계사가 되다","en":"Korolev becomes chief designer of long-range rockets"},
    "body":{"ko":"전후 소련은 로켓 개발을 국가 최우선 과제로 삼아 모스크바 근교의 NII-88 연구소에 인력과 자원을 집중했고, 코롤료프가 장거리 탄도로켓 총설계사로 임명됐다. 그의 설계국은 1956년 독립해 OKB-1이 됐다.","en":"After the war the Soviet state made rocketry a top national priority, concentrating people and resources at the NII-88 institute near Moscow, and Korolev was appointed chief designer of long-range ballistic rockets. His design bureau became the independent OKB-1 in 1956."}
  },
  {
    "date":"1957.08.21",
    "title":{"ko":"R-7, 세계 최초의 대륙간탄도로켓","en":"The R-7, the world's first intercontinental ballistic missile"},
    "body":{"ko":"바이코누르에서 발사된 R-7이 처음으로 완전한 비행에 성공했다. 군사적 필요에서 태어난 이 로켓은 곧바로 우주 발사체로 쓰일 만큼 강력했고, 그 개량형은 오늘날까지 사람과 위성을 궤도로 실어 나른다.","en":"Launched from Baikonur, the R-7 completed its first fully successful flight. Born of military necessity, the rocket was powerful enough to serve at once as a space launcher, and its descendants still carry people and satellites to orbit today."}
  },
  {
    "date":"1957.10.04",
    "title":{"ko":"스푸트니크 1호, 우주 시대의 개막","en":"Sputnik 1 opens the space age"},
    "body":{"ko":"인류 최초의 인공위성 스푸트니크 1호가 궤도에 올랐다. 지구 어디서나 아마추어 수신기로 들을 수 있던 그 신호음은, 40년 전까지 말과 쟁기로 밭을 갈던 나라에서 무상 기술교육과 계획경제가 길러 낸 과학 역량의 선언이었다.","en":"Sputnik 1, the first artificial satellite in human history, reached orbit. Its beeps, audible on amateur receivers anywhere on Earth, were a declaration of the scientific capacity that free technical education and a planned economy had built in a country that forty years earlier had ploughed with horses."}
  },
  {
    "date":"1957.11.03",
    "title":{"ko":"스푸트니크 2호와 라이카","en":"Sputnik 2 and Laika"},
    "body":{"ko":"모스크바의 떠돌이 개 라이카를 태운 스푸트니크 2호가 생명체의 궤도 비행을 처음으로 시험했다. 귀환 수단은 없었고, 라이카가 발사 몇 시간 뒤 과열로 죽었다는 사실은 2002년에야 공개됐다. 이 비행의 생체 데이터는 유인 비행 준비의 출발점이 됐다.","en":"Sputnik 2 carried Laika, a Moscow stray dog, on the first orbital flight of a living creature. There was no means of return, and only in 2002 was it disclosed that Laika died of overheating within hours of launch. The biomedical data from the flight became the starting point for preparing human spaceflight."}
  },
  {
    "date":"1959",
    "title":{"ko":"루나 계획, 달에 닿다","en":"The Luna probes reach the Moon"},
    "body":{"ko":"루나 1호는 달을 스쳐 지나 태양 궤도에 진입한 최초의 인공 물체가 됐고, 루나 2호는 인류가 만든 물체로는 처음으로 달 표면에 도달했다. 루나 3호는 인류가 한 번도 본 적 없던 달의 뒷면을 촬영해 지구로 전송했다.","en":"Luna 1 flew past the Moon to become the first artificial object in solar orbit, and Luna 2 became the first human-made object to reach the lunar surface. Luna 3 photographed the far side of the Moon, never before seen by human eyes, and transmitted the images to Earth."}
  },
  {
    "date":"1961.04.12",
    "title":{"ko":"보스토크 1호, 가가린","en":"Vostok 1: Gagarin"},
    "body":{"ko":"유리 가가린이 보스토크 1호로 지구를 한 바퀴 돌아 인류 최초의 우주인이 됐다. 스몰렌스크 농촌의 노동자 가정에서 태어나 직업기술학교와 무상 교육을 거쳐 조종사가 된 그의 이력은 체제가 내세운 약속 그 자체였다. 발사 순간 그가 외친 말은 '포예할리!(갑시다!)'였다.","en":"Yuri Gagarin orbited the Earth once aboard Vostok 1 and became the first human in space. Born to a working family in rural Smolensk and raised through vocational school and free education into a pilot, his biography embodied the promise the system claimed to offer. At liftoff he called out 'Poyekhali!' (Let's go!)."}
  },
  {
    "date":"1961.08.06",
    "title":{"ko":"티토프, 하루 동안의 궤도 비행","en":"Titov: a full day in orbit"},
    "body":{"ko":"게르만 티토프가 보스토크 2호로 지구를 17바퀴 도는 25시간의 비행을 수행해 인간이 장시간 우주에 머물 수 있음을 입증했다. 당시 25세였던 그는 지금까지도 최연소 우주 비행 기록을 갖고 있다.","en":"Gherman Titov flew 17 orbits over 25 hours aboard Vostok 2, proving that humans could remain in space for extended periods. At 25, he remains the youngest person ever to fly in space."}
  },
  {
    "date":"1963.06.16",
    "title":{"ko":"테레시코바, 우주로 간 최초의 여성","en":"Tereshkova, the first woman in space"},
    "body":{"ko":"방직공장 노동자이자 아마추어 낙하산 선수 출신의 발렌티나 테레시코바가 보스토크 6호로 지구를 48바퀴 돌았다. 미국이 첫 여성 우주인을 보낸 것은 그로부터 20년 뒤의 일이었다.","en":"Valentina Tereshkova, a former textile worker and amateur parachutist, completed 48 orbits aboard Vostok 6. The United States would not fly its first woman astronaut for another twenty years."}
  },
  {
    "date":"1965.03.18",
    "title":{"ko":"레오노프, 최초의 우주 유영","en":"Leonov performs the first spacewalk"},
    "body":{"ko":"알렉세이 레오노프가 보스호트 2호에서 12분간 인류 최초의 우주 유영을 수행했다. 팽창한 우주복 탓에 귀환이 위태로웠던 순간과 예정 지점을 벗어난 착륙까지, 이 비행은 초기 우주 개발의 대담함과 위험을 함께 보여 주었다.","en":"Alexei Leonov carried out humanity's first spacewalk, twelve minutes outside Voskhod 2. From the perilous re-entry into the airlock in a ballooning suit to a landing far off target, the flight showed both the daring and the danger of early spaceflight."}
  }
]$$::jsonb,
     $$[
  "K. E. Tsiolkovsky, Issledovanie mirovykh prostranstv reaktivnymi priborami (The Exploration of Outer Space by Means of Reaction Devices, 1903)",
  "Asif A. Siddiqi, Challenge to Apollo: The Soviet Union and the Space Race, 1945–1974 (NASA SP-2000-4408, 2000)",
  "Boris Chertok, Rockets and People, 4 vols. (NASA SP-4110, 2005–2011)",
  "James Harford, Korolev: How One Man Masterminded the Soviet Drive to Beat America to the Moon (1997)",
  "Andrew L. Jenks, The Cosmonaut Who Couldn't Stop Smiling: The Life and Legend of Yuri Gagarin (2012)",
  "Slava Gerovitch, Soviet Space Mythologies: Public Images, Private Memories, and the Making of a Cultural Identity (2015)",
  "https://history.nasa.gov/sputnik/"
]$$::jsonb,
     NOW())
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, period_label = EXCLUDED.period_label,
    title_ko = EXCLUDED.title_ko, title_en = EXCLUDED.title_en,
    question_ko = EXCLUDED.question_ko, question_en = EXCLUDED.question_en,
    summary_ko = EXCLUDED.summary_ko, summary_en = EXCLUDED.summary_en,
    outcome_ko = EXCLUDED.outcome_ko, outcome_en = EXCLUDED.outcome_en,
    timeline = EXCLUDED.timeline, sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT 'soviet-space-program', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('korolev', 0, 'leader', '총설계사', 'Chief designer',
     'OKB-1을 이끌며 R-7, 스푸트니크, 보스토크를 설계·지휘했고, 1938년의 부당한 체포와 수감을 딛고 우주 계획의 중심이 됐다.',
     'He led OKB-1, directing the R-7, Sputnik, and Vostok, and became the center of the space program after surviving an unjust arrest and imprisonment in 1938.'),
    ('keldysh', 1, 'leader', '수석 이론가', 'Chief theoretician',
     '수학자로서 궤도 계산과 우주 계획 수립을 이끌어 익명 시절 언론에서 우주비행의 수석 이론가로 불렸다.',
     'As a mathematician he led orbital calculations and space-program planning, known in the press during the years of anonymity as the chief theoretician of cosmonautics.'),
    ('khrushchev', 2, 'leader', '정치적 후원자', 'Political patron',
     '당 제1서기로서 우주 계획에 최우선의 자원과 정치적 지원을 부여하고 그 성취를 사회주의의 성취로 세계에 내세웠다.',
     'As First Secretary he gave the space program top-priority resources and political backing, presenting its achievements to the world as achievements of socialism.'),
    ('gagarin', 3, 'participant', '최초의 우주인', 'First human in space',
     '1961년 4월 12일 보스토크 1호로 지구를 돌아 인류 최초의 우주인이 됐고, 식민지에서 갓 독립한 나라들을 포함한 전 세계의 상징이 됐다.',
     'On 12 April 1961 he orbited the Earth aboard Vostok 1 as the first human in space, becoming a symbol across the world, including in newly independent former colonies.'),
    ('kerimov', 4, 'participant', '우주 개발 관리자', 'Space program administrator',
     '국방부와 우주산업 부처에서 우주 계획의 관리와 감독을 맡았고, 뒤에 유인 비행 국가위원회 위원장이 됐다.',
     'He administered and supervised the space program in the defense ministry and space industry apparatus, later chairing the State Commission for crewed flights.'),
    ('ustinov', 5, 'participant', '방위산업 총괄', 'Defense industry overseer',
     '군수산업을 총괄하는 지도자로서 로켓·우주 개발에 자원을 배정하고 설계국들 사이의 조율을 맡았다.',
     'As the leader overseeing the defense industry, he allocated resources to rocketry and spaceflight and coordinated among the design bureaus.'),
    ('afanasyev', 6, 'participant', '우주산업 장관', 'Space industry minister',
     '1965년 신설된 일반기계제작부의 초대 장관으로 로켓·우주 산업 전체를 통합 관리했다.',
     'As the first minister of the General Machine-Building Ministry created in 1965, he brought the entire rocket and space industry under unified management.'),
    ('brezhnev', 7, 'participant', '당 감독자', 'Party supervisor',
     '1950년대 후반 당 중앙위원회 서기로 방위·우주 산업을 감독하며 초기 발사들을 지원했다.',
     'As a Central Committee secretary in the late 1950s he supervised the defense and space industries and supported the early launches.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
