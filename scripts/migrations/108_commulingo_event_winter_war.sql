-- The Winter War (1939.11–1940.03), placed at sort_order 75 between the Great
-- Purge (70) and the Great Patriotic War (80) — the purge of the officer corps
-- is part of why this war went the way it did, and the war is why Timoshenko
-- was rebuilding the army when Germany invaded. Idempotent.
--
-- Titled 겨울전쟁 / The Winter War, the name in common use; 소련-핀란드 전쟁 and
-- Russo-Finnish War are carried as linkify aliases (data/commulingo/event-linkify.js).
-- The 1941–44 sequel (계속전쟁 / Continuation War) is not a separate event here;
-- it appears in the outcome and in the timeline tail.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('winter-war', 75, '1939.11–1940.03',
     '겨울전쟁', 'The Winter War',
     '압도적으로 우세한 붉은 군대는 왜 작은 이웃 앞에서 105일을 흘렸는가?',
     'Why did an overwhelmingly superior Red Army bleed for 105 days against a small neighbour?',
     '겨울전쟁은 1939년 11월 30일 소련의 침공으로 시작해 1940년 3월 모스크바 강화조약으로 끝난 105일간의 소련-핀란드 전쟁이다. 독소불가침조약의 비밀의정서로 핀란드를 자국 세력권에 넣은 소련은 레닌그라드 방위를 이유로 카렐리야 지협의 국경 이동과 항코 반도 조차를 요구했고, 핀란드가 거부하자 마이닐라 포격 사건을 구실로 공격했다. 병력과 장비는 압도적이었으나 대숙청으로 지휘부가 무너진 붉은 군대는 겨울 삼림전에 준비되어 있지 않았고, 수오무살미에서 사단째 포위·궤멸당하며 만네르헤임 선 앞에 멈춰 섰다.',
     'The Winter War was the 105-day Soviet-Finnish war that began with the Soviet invasion of 30 November 1939 and ended with the Moscow Peace Treaty of March 1940. Having placed Finland in its sphere under the secret protocol of the Nazi-Soviet pact, the Soviet Union demanded a shift of the Karelian Isthmus border and a lease on the Hanko peninsula in the name of defending Leningrad; when Finland refused, it attacked, using the shelling at Mainila as a pretext. The Red Army was overwhelmingly superior in men and equipment, but its command had been gutted by the Great Purge and it was unprepared for winter forest warfare — whole divisions were encircled and destroyed at Suomussalmi, and the advance stalled before the Mannerheim Line.',
     '1940년 3월 모스크바 강화조약으로 핀란드는 비푸리(비보르크)와 카렐리야 지협을 포함한 영토의 약 11%를 잃고 42만 명이 고향을 떠났으나 독립과 체제는 지켰다. 소련은 침략국으로 국제연맹에서 제명됐고, 12만 명이 넘는 전사자와 드러난 무능은 히틀러에게 「썩은 문을 걷어차면 무너진다」는 확신을 주었다. 안으로는 보로실로프가 국방인민위원에서 물러나고 티모셴코 아래 군 재편이 시작됐지만, 시간은 1년 남짓밖에 남아 있지 않았다. 잃은 땅을 되찾으려는 핀란드는 1941년 독일 편에서 계속전쟁에 나섰다.',
     'By the Moscow Peace Treaty of March 1940 Finland lost about 11 per cent of its territory, including Viipuri (Vyborg) and the Karelian Isthmus, and 420,000 people left their homes — but it kept its independence and its system. The Soviet Union was expelled from the League of Nations as an aggressor, and its losses of more than 120,000 dead, together with the incompetence on display, convinced Hitler that the rotten door would collapse if kicked in. At home Voroshilov was removed as defence commissar and a rebuilding of the army began under Timoshenko, but barely a year remained. Finland, seeking to recover what it had lost, entered the Continuation War alongside Germany in 1941.',
     $$[
       {"date":"1939.08.23","title":{"ko":"비밀의정서","en":"The secret protocol"},"body":{"ko":"독소불가침조약의 비밀의정서가 핀란드·발트 3국·동폴란드를 소련의 세력권으로 나눴다.","en":"The secret protocol of the Nazi-Soviet pact assigned Finland, the Baltic states, and eastern Poland to the Soviet sphere."}},
       {"date":"1939.10","title":{"ko":"모스크바 교섭과 결렬","en":"The Moscow talks break down"},"body":{"ko":"소련은 레닌그라드 방위를 이유로 카렐리야 지협 국경의 후퇴와 항코 반도 조차를, 그 대가로 동카렐리야의 더 넓은 땅을 제안했다. 핀란드 대표단은 이를 거부했다.","en":"Citing the defence of Leningrad, the Soviet Union demanded that the Karelian Isthmus border be moved back and Hanko leased, offering a larger stretch of eastern Karelia in exchange. The Finnish delegation refused."}},
       {"date":"1939.11.26","title":{"ko":"마이닐라 포격 사건","en":"The shelling at Mainila"},"body":{"ko":"국경 마을 마이닐라에 포격이 가해지자 소련은 핀란드의 도발이라 주장하며 불가침조약을 파기했다. 포격은 소련 측이 스스로 벌인 구실이었다.","en":"When shells fell on the border village of Mainila, the Soviet Union called it a Finnish provocation and renounced the non-aggression pact. The shelling was its own manufactured pretext."}},
       {"date":"1939.11.30","title":{"ko":"침공과 헬싱키 폭격","en":"Invasion and the bombing of Helsinki"},"body":{"ko":"붉은 군대가 전 국경에서 진격을 시작하고 헬싱키가 폭격당했다. 몰로토프는 투하된 것이 폭탄이 아니라 굶주린 이웃에게 보내는 식량이라고 했고, 핀란드인들은 그 화염병에 「몰로토프 칵테일」이라는 이름을 붙였다.","en":"The Red Army advanced along the whole border and Helsinki was bombed. Molotov said what had been dropped was not bombs but food for a starving neighbour; the Finns named their petrol bombs the Molotov cocktail in reply."}},
       {"date":"1939.12.01","title":{"ko":"테리요키 정부","en":"The Terijoki government"},"body":{"ko":"점령지 테리요키에 쿠시넨을 수반으로 한 「핀란드 민주공화국」이 세워졌다. 소련은 이 정부를 유일한 합법 정부로 인정해 교섭 상대를 지웠으나, 핀란드 안에서 지지를 얻지 못했다.","en":"A Finnish Democratic Republic under Kuusinen was proclaimed in occupied Terijoki. Moscow recognized it as the only lawful government — erasing anyone left to negotiate with — but it won no support inside Finland."}},
       {"date":"1939.12.14","title":{"ko":"국제연맹 제명","en":"Expulsion from the League of Nations"},"body":{"ko":"국제연맹은 소련을 침략국으로 규정하고 제명했다.","en":"The League of Nations declared the Soviet Union an aggressor and expelled it."}},
       {"date":"1939.12–1940.01","title":{"ko":"수오무살미와 라테 도로","en":"Suomussalmi and the Raate road"},"body":{"ko":"핀란드군은 도로에 묶인 소련군 종대를 잘라 포위하는 「모티」 전술로 제163·제44 사단을 궤멸시켰다. 제44사단장 비노그라도프는 부대 앞에서 총살됐다.","en":"Finnish troops used motti tactics — cutting road-bound Soviet columns into encircled pockets — to destroy the 163rd and 44th Divisions. Vinogradov, who commanded the 44th, was shot in front of his troops."}},
       {"date":"1940.01–02","title":{"ko":"지휘 개편과 총공세","en":"New command, new offensive"},"body":{"ko":"티모셴코의 북서전선군이 편성되어 포병과 물량을 집중한 정면 돌파로 방식을 바꿨다. 2월 중순 만네르헤임 선이 숨마에서 뚫렸다.","en":"Timoshenko's North-Western Front was formed and the method changed to a frontal breakthrough backed by massed artillery and materiel. In mid-February the Mannerheim Line was pierced at Summa."}},
       {"date":"1940.03.12","title":{"ko":"모스크바 강화조약","en":"The Moscow Peace Treaty"},"body":{"ko":"핀란드는 카렐리야 지협과 비푸리, 라도가 카렐리야를 넘기고 항코를 조차해 주었다. 테리요키 정부는 조용히 사라졌다.","en":"Finland ceded the Karelian Isthmus, Viipuri, and Ladoga Karelia, and leased Hanko. The Terijoki government quietly disappeared."}},
       {"date":"1940.04–05","title":{"ko":"교훈의 회의","en":"The reckoning"},"body":{"ko":"중앙위 회의가 전쟁의 교훈을 결산했고, 보로실로프 대신 티모셴코가 국방인민위원이 되어 훈련·규율·기계화 개편에 착수했다.","en":"A Central Committee conference took stock of the war's lessons, and Timoshenko replaced Voroshilov as defence commissar, beginning a reform of training, discipline, and mechanization."}},
       {"date":"1941.06","title":{"ko":"계속전쟁","en":"The Continuation War"},"body":{"ko":"핀란드는 독일의 소련 침공에 발맞춰 잃은 땅을 되찾는 계속전쟁에 들어갔다. 겨울전쟁이 만든 적대는 그렇게 대조국전쟁의 북쪽 전선이 됐다.","en":"As Germany invaded the Soviet Union, Finland entered the Continuation War to recover what it had lost. The enmity the Winter War created thus became the northern front of the Great Patriotic War."}}
     ]$$::jsonb,
     $$[
       "William R. Trotter, A Frozen Hell: The Russo-Finnish Winter War of 1939-40",
       "Carl Van Dyke, The Soviet Invasion of Finland, 1939-1940",
       "Г. Ф. Кривошеев (ред.), Россия и СССР в войнах XX века: потери вооружённых сил",
       "https://www.britannica.com/event/Russo-Finnish-War"
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
SELECT 'winter-war', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('stalin', 0, 'leader', '개전을 결정한 지도자', 'The leader who decided on war', '핀란드가 요구를 거부하자 짧고 손쉬운 전쟁을 예상하고 침공을 승인했다. 예상이 빗나가자 지휘 방식과 책임자를 갈아치웠다.', 'When Finland refused his demands he approved the invasion, expecting a short and easy war; when it proved otherwise he replaced both the method of command and the men responsible.'),
    ('molotov', 1, 'leader', '외교 · 강화조약 서명', 'Diplomacy and the peace treaty', '가을 교섭에서 국경 이동과 항코 조차를 요구했고, 헬싱키 폭격을 식량 투하라 부른 발언은 「몰로토프 칵테일」이라는 이름을 남겼다. 1940년 3월 강화조약에 서명했다.', 'He pressed the border and Hanko demands in the autumn talks; his claim that the bombing of Helsinki was a food drop gave the Molotov cocktail its name. He signed the peace treaty in March 1940.'),
    ('voroshilov', 2, 'executor', '국방인민위원 · 참패의 책임', 'Defence commissar, answerable for the debacle', '개전을 낙관하고 준비 없는 공세를 승인한 국방수장으로, 초기 참패의 책임을 지고 1940년 5월 티모셴코에게 자리를 넘겼다.', 'The defence chief who was optimistic about the war and approved an unprepared offensive; held responsible for the early debacle, he handed his post to Timoshenko in May 1940.'),
    ('kirill-meretskov', 3, 'executor', '제7군 사령관 · 만네르헤임 선 돌파', 'Commander of the 7th Army, breaker of the Mannerheim Line', '레닌그라드 군관구와 제7군을 이끌고 지협 정면을 맡아 초기 정체를 겪었으나, 재편 뒤 만네르헤임 선을 돌파해 소비에트연방영웅이 됐다.', 'Leading the Leningrad Military District and the 7th Army on the isthmus, he was stalled at first, but after the reorganization broke through the Mannerheim Line and was made a Hero of the Soviet Union.'),
    ('timoshenko', 4, 'executor', '북서전선군 사령관 · 2월 총공세', 'Commander of the North-Western Front, the February offensive', '1940년 1월 편성된 북서전선군을 맡아 포병과 물량을 집중한 돌파로 전황을 뒤집었고, 그 공으로 보로실로프를 대신해 국방인민위원이 됐다.', 'Given the North-Western Front formed in January 1940, he turned the war around with a breakthrough backed by massed artillery and materiel, and on that record replaced Voroshilov as defence commissar.'),
    ('zhdanov', 5, 'participant', '레닌그라드 당 제1서기 · 개전 추동', 'Leningrad party chief, a driver of the war', '레닌그라드의 안전을 명분으로 강경한 대(對)핀란드 노선을 밀어붙였고, 군관구 군사평의회의 일원으로 개전과 작전에 관여했다.', 'He pushed the hard line toward Finland in the name of Leningrad''s safety and, as a member of the military district war council, took part in launching and running the campaign.'),
    ('lev-mekhlis', 6, 'executor', '군 정치총국장 · 전선의 책임 추궁', 'Head of the army political directorate, hunting for blame at the front', '정치총국장으로 전선에 나가 패배의 책임을 추궁했다. 포위 궤멸된 제44사단의 지휘부 처형이 그 방식을 보여 준다.', 'As head of the political directorate he went to the front to fix blame for defeat; the execution of the encircled 44th Division''s commanders shows the method.'),
    ('kuusinen', 7, 'participant', '테리요키 정부 수반', 'Head of the Terijoki government', '소련이 세운 「핀란드 민주공화국」의 수반으로 앉아 침공에 정통성의 외피를 씌우는 역할을 맡았으나, 정부는 강화조약과 함께 사라졌다.', 'Installed at the head of the Soviet-created Finnish Democratic Republic, he was there to give the invasion a covering of legitimacy; the government vanished with the peace treaty.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
