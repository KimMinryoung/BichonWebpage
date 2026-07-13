-- Two Eastern-bloc uprisings and their Soviet suppression: the Hungarian
-- Revolution (1956, placed at 87 between the fall of Beria and the Anti-Party
-- Group) and the Prague Spring (1968, at 95 after the space program).
-- Idempotent.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('hungarian-revolution', 87, '1956',
     '헝가리 혁명', 'The Hungarian Revolution',
     '탈스탈린화의 희망은 왜 부다페스트에서 소련 전차에 부딪혔는가?',
     'Why did the hope of de-Stalinization run into Soviet tanks in Budapest?',
     '1956년 헝가리 혁명은 흐루쇼프의 비밀연설이 연 탈스탈린화의 기대 속에서 스탈린주의 체제에 맞서 터진 봉기였다. 10월 부다페스트의 학생·노동자 시위가 전국적 항쟁으로 번지자 개혁파 너지 임레가 총리로 복귀해 다당제와 바르샤바조약 탈퇴, 중립을 선언했다. 소련 지도부는 이를 진영의 붕괴로 보고 11월 대규모 군사 개입으로 봉기를 진압했다.',
     'The Hungarian Revolution of 1956 was an uprising against the Stalinist system, born of the hopes for de-Stalinization opened by Khrushchev’s Secret Speech. When student and worker protests in Budapest grew into a nationwide revolt in October, the reformer Imre Nagy returned as premier and declared a multiparty system, withdrawal from the Warsaw Pact, and neutrality. The Soviet leadership saw this as the collapse of the bloc and crushed the uprising with a massive military intervention in November.',
     '소련군의 진압으로 수천 명이 죽고 20만 명 이상이 서방으로 탈출했다. 너지는 체포되어 1958년 비밀리에 처형됐고, 소련이 세운 카다르 정권이 들어섰다. 혁명은 좌절됐으나, 「사회주의 진영」 안에서 개혁이 어디까지 허용되는가라는 물음을 유럽 전체에 남겼다.',
     'The Soviet crackdown killed thousands and drove more than 200,000 to flee to the West. Nagy was arrested and secretly executed in 1958, and a Soviet-installed government under Kádár took power. The revolution was defeated, but it left all of Europe with the question of how far reform would be allowed within the socialist bloc.',
     $$[
       {"date":"1956.02","title":{"ko":"흐루쇼프의 비밀연설","en":"Khrushchev’s Secret Speech"},"body":{"ko":"스탈린 비판이 동유럽 전역에 개혁의 기대를 불러일으켰다.","en":"The denunciation of Stalin raised hopes for reform across Eastern Europe."}},
       {"date":"1956.10.23","title":{"ko":"부다페스트 시위","en":"Protests in Budapest"},"body":{"ko":"학생·노동자 시위가 전국적 봉기로 번졌다.","en":"Student and worker protests grew into a nationwide uprising."}},
       {"date":"1956.10–11","title":{"ko":"너지의 개혁","en":"Nagy’s reforms"},"body":{"ko":"너지가 총리로 복귀해 다당제와 바르샤바조약 탈퇴, 중립을 선언했다.","en":"Nagy returned as premier and declared a multiparty system, withdrawal from the Warsaw Pact, and neutrality."}},
       {"date":"1956.11.04","title":{"ko":"소련의 개입","en":"The Soviet intervention"},"body":{"ko":"소련군이 부다페스트로 진입해 봉기를 진압했다.","en":"Soviet forces entered Budapest and crushed the uprising."}},
       {"date":"1958","title":{"ko":"너지의 처형","en":"Nagy executed"},"body":{"ko":"체포된 너지가 비밀재판 뒤 처형됐다.","en":"The arrested Nagy was executed after a secret trial."}}
     ]$$::jsonb,
     '["Csaba Békés et al., The 1956 Hungarian Revolution: A History in Documents", "Encyclopaedia Britannica: Hungarian Revolution of 1956"]'::jsonb,
     NOW()),
    ('prague-spring', 95, '1968',
     '프라하의 봄', 'The Prague Spring',
     '「인간의 얼굴을 한 사회주의」는 왜 바르샤바조약군의 전차 앞에서 멈췄는가?',
     'Why did “socialism with a human face” stop before the tanks of the Warsaw Pact?',
     '프라하의 봄은 1968년 체코슬로바키아에서 두브체크가 이끈 개혁운동이다. 검열 완화, 표현과 이동의 자유 확대, 경제 개혁을 내건 「인간의 얼굴을 한 사회주의」는 대중의 광범위한 지지를 받았다. 그러나 소련은 이를 진영 이탈로 규정하고, 1968년 8월 바르샤바조약 5개국 군대를 동원해 체코슬로바키아를 점령했다.',
     'The Prague Spring was a reform movement in Czechoslovakia in 1968 led by Alexander Dubček. Its “socialism with a human face” — easing censorship, widening freedom of expression and movement, and economic reform — won broad popular support. But the Soviet Union defined it as a break from the bloc and, in August 1968, occupied Czechoslovakia with the armies of five Warsaw Pact states.',
     '군사 점령으로 개혁은 중단되고 「정상화」라 불린 억압적 원상복구가 이어졌다. 소련은 사회주의 진영 국가의 주권을 제한할 수 있다는 「브레즈네프 독트린」으로 개입을 정당화했다. 두브체크는 밀려나 산림청 직원으로 보내졌고, 프라하의 봄은 진영 안 개혁의 한계를 다시 한번 확인시켰다.',
     'The occupation halted the reforms and brought a repressive rollback known as “normalization.” The Soviet Union justified the intervention with the “Brezhnev Doctrine,” the claim that it could limit the sovereignty of socialist-bloc states. Dubček was pushed out and sent to work in the forestry service, and the Prague Spring once again marked the limits of reform within the bloc.',
     $$[
       {"date":"1968.01","title":{"ko":"두브체크의 등장","en":"Dubček rises"},"body":{"ko":"두브체크가 체코슬로바키아 공산당 제1서기가 되며 개혁이 시작됐다.","en":"Dubček became First Secretary of the Czechoslovak party, and the reforms began."}},
       {"date":"1968.04","title":{"ko":"행동강령","en":"The Action Programme"},"body":{"ko":"검열 완화와 자유 확대를 담은 개혁 강령이 발표됐다.","en":"A reform programme easing censorship and widening freedoms was announced."}},
       {"date":"1968.08.20–21","title":{"ko":"바르샤바조약군의 침공","en":"The Warsaw Pact invasion"},"body":{"ko":"소련을 비롯한 5개국 군대가 체코슬로바키아를 점령했다.","en":"The armies of five states led by the Soviet Union occupied Czechoslovakia."}},
       {"date":"1969~","title":{"ko":"「정상화」","en":"“Normalization”"},"body":{"ko":"개혁이 되돌려지고 두브체크가 당에서 밀려났다.","en":"The reforms were reversed and Dubček was pushed out of the party."}}
     ]$$::jsonb,
     '["Kieran Williams, The Prague Spring and its Aftermath", "Encyclopaedia Britannica: Prague Spring"]'::jsonb,
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
SELECT v.event_id, v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    -- Hungarian Revolution
    ('hungarian-revolution','khrushchev',0,'executor','개입을 결정','Ordered the intervention','봉기를 진영의 붕괴로 보고 군사 개입을 최종 결정했다.','Seeing the uprising as the collapse of the bloc, he made the final decision to intervene militarily.'),
    ('hungarian-revolution','ivan-konev',1,'executor','침공군 사령관','Commander of the invasion','바르샤바조약군 총사령관으로 부다페스트 진압 작전을 지휘했다.','As Warsaw Pact commander, he directed the operation to crush Budapest.'),
    ('hungarian-revolution','zhukov',2,'executor','국방장관','Defense minister','국방장관으로 군사 개입을 뒷받침했다.','As defense minister, he backed the military intervention.'),
    ('hungarian-revolution','andropov',3,'executor','주헝가리 대사','Ambassador to Hungary','부다페스트 주재 소련 대사로 진압의 현장에서 핵심 역할을 했다.','As Soviet ambassador in Budapest, he played a key role on the ground in the crackdown.'),
    ('hungarian-revolution','janos-kadar',4,'executor','소련이 세운 대항정부','Soviet-installed government','너지 정부를 떠나 소련의 지원으로 대항정부를 세워 헝가리를 이끌었다.','He left Nagy’s government and, with Soviet backing, formed the rival government that ruled Hungary.'),
    ('hungarian-revolution','mikoyan',5,'participant','부다페스트 파견','Sent to Budapest','수슬로프와 함께 부다페스트에 파견되어 사태를 조율했다.','Sent to Budapest with Suslov, he helped manage the crisis on the spot.'),
    ('hungarian-revolution','suslov',6,'participant','부다페스트 파견','Sent to Budapest','미코얀과 함께 현지에서 강경 대응을 조율했다.','With Mikoyan, he coordinated the hard-line response on the ground.'),
    ('hungarian-revolution','nagy',7,'target','혁명의 총리, 처형되다','Premier of the revolution, executed','다당제와 중립을 선언한 개혁 총리로 1958년 비밀리에 처형됐다.','The reform premier who declared a multiparty system and neutrality, secretly executed in 1958.'),
    ('hungarian-revolution','matyas-rakosi',8,'opponent','스탈린주의 강경파','Stalinist hardliner','봉기를 촉발한 스탈린주의 통치의 설계자로 혁명 직전 실각했다.','The architect of the Stalinist rule that provoked the uprising, ousted just before it.'),
    -- Prague Spring
    ('prague-spring','brezhnev',0,'executor','개입을 결정','Ordered the intervention','개혁을 진영 이탈로 규정하고 브레즈네프 독트린으로 침공을 정당화했다.','He defined the reforms as a break from the bloc and justified the invasion with the Brezhnev Doctrine.'),
    ('prague-spring','grechko',1,'executor','국방장관','Defense minister','국방장관으로 바르샤바조약군의 침공을 지휘했다.','As defense minister, he commanded the Warsaw Pact invasion.'),
    ('prague-spring','andropov',2,'executor','KGB 의장','KGB chairman','KGB 의장으로 개입을 밀어붙인 강경파였다.','As KGB chairman, he was a hard-liner pushing for intervention.'),
    ('prague-spring','suslov',3,'participant','이념 담당','Ideology chief','당의 이념 책임자로 강경 노선을 뒷받침했다.','The party’s ideology chief, he backed the hard line.'),
    ('prague-spring','kosygin',4,'participant','협상 담당','Negotiator','총리로서 체코 지도부와의 협상에 관여했다.','As premier, he took part in the negotiations with the Czech leadership.'),
    ('prague-spring','dubcek',5,'leader','개혁의 얼굴','Face of the reform','「인간의 얼굴을 한 사회주의」를 이끈 제1서기로, 침공 뒤 밀려나 산림청으로 보내졌다.','The First Secretary who led “socialism with a human face,” pushed out after the invasion and sent to the forestry service.'),
    ('prague-spring','wladyslaw-gomulka',6,'participant','바르샤바조약 동맹','Warsaw Pact ally','폴란드 지도자로 침공에 가담했다.','The Polish leader who joined the invasion.'),
    ('prague-spring','walter-ulbricht',7,'participant','바르샤바조약 동맹','Warsaw Pact ally','동독 지도자로 개입을 강하게 지지했다.','The East German leader who strongly supported the intervention.'),
    ('prague-spring','janos-kadar',8,'participant','바르샤바조약 동맹','Warsaw Pact ally','헝가리 지도자로 침공에 가담했다 — 1956년 자신이 겪은 개입을 12년 뒤 되풀이한 셈이었다.','The Hungarian leader who joined the invasion, repeating twelve years later the intervention he had himself experienced in 1956.')
) AS v(event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
