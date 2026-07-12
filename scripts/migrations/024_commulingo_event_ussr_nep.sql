-- 024: Two history events for the CommuLingo archive:
--   1) ussr-formation      (1922.12)   The formation of the USSR, the Georgian affair,
--                                      Lenin's fight against Great-Russian chauvinism,
--                                      korenizatsiya, and the 1924 Constitution.
--   2) new-economic-policy (1921–1928) NEP from the 1921 crisis to its end in 1928.
-- Idempotent: ON CONFLICT ... DO UPDATE everywhere; people inserts guarded by
-- WHERE EXISTS against commulingo_people.

-- ============================================================================
-- Event 1: Formation of the USSR
-- ============================================================================

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('ussr-formation', 45, '1922.12',
     '소련의 결성', 'Formation of the USSR',
     '다민족 연방국가는 어떤 원칙 위에 세워졌고, 그 원칙을 둘러싸고 누가 싸웠는가?',
     'On what principles was the multinational union state built, and who fought over those principles?',
     '1922년 12월 30일, 러시아·우크라이나·벨로루시야·자캅카스의 소비에트 공화국들이 대등한 자격으로 연방조약을 맺어 소비에트 사회주의 공화국 연방이 탄생했다. 공화국들을 러시아 연방에 편입하려던 자치화안은 레닌의 개입으로 폐기되었고, 탈퇴권을 명시한 대등한 공화국들의 연방이라는 원칙이 채택되었다. 뒤이은 코레니자치야(토착화) 정책은 민족 언어와 민족 간부를 국가가 체계적으로 육성한, 당대 세계에 전례가 없는 민족정책이었다.',
     'On 30 December 1922 the Soviet republics of Russia, Ukraine, Byelorussia, and Transcaucasia concluded a union treaty as equals, creating the Union of Soviet Socialist Republics. The autonomization draft that would have absorbed the republics into the Russian federation was abandoned after Lenin''s intervention, in favor of a union of equal republics with an explicit right of secession. The korenizatsiya (nativization) policy that followed had the state systematically promote national languages and national cadres, a nationality policy without precedent in the world of its time.',
     '1924년 헌법은 연방과 공화국의 권한 배분을 성문화하고 각 연방 공화국의 자유로운 탈퇴권을 명시했다. 코레니자치야는 수십 개 민족의 학교·출판·행정을 민족어로 세웠고, 역사가 테리 마틴은 그 결과를 「소수민족 우대 제국」이라 불렀다. 형식적 평등과 단일한 당의 중앙집권 사이의 긴장은 남았지만, 연방은 민족 문제에 대한 세계사적 실험으로서 이후 탈식민 세계에 깊은 영향을 주었다.',
     'The 1924 Constitution codified the division of powers and each union republic''s free right of secession. Korenizatsiya built schools, publishing, and administration in dozens of national languages, and the historian Terry Martin called the result an "affirmative action empire". Tension remained between formal equality and the centralism of a single party, but the union stood as a world-historical experiment in the national question that deeply influenced the later decolonizing world.',
     $$[
       {
         "date":"1920–1921",
         "title":{"ko":"조약 체계: 독립 공화국들의 동맹","en":"The treaty system: an alliance of independent republics"},
         "body":{"ko":"내전기 러시아 소비에트 공화국은 우크라이나·벨로루시야·자캅카스의 소비에트 공화국들과 군사·경제 동맹 조약을 맺었다. 형식상 독립국들 사이의 조약 관계였으나, 국방과 경제의 통합이 깊어지면서 항구적인 국가 형태의 문제가 제기되었다.","en":"During the civil war the Russian Soviet republic concluded military and economic alliance treaties with the Soviet republics of Ukraine, Byelorussia, and Transcaucasia. Formally a treaty relationship among independent states, the deepening integration of defense and economy posed the question of a permanent state form."}
       },
       {
         "date":"1922.03.12",
         "title":{"ko":"자캅카스 연방의 결성","en":"Formation of the Transcaucasian federation"},
         "body":{"ko":"그루지야·아르메니아·아제르바이잔이 연방적 동맹으로 결합했다. 오르조니키제가 이끄는 자캅카스 당 지도부가 통합을 강하게 밀어붙이면서 그루지야 공산당 지도부와의 갈등이 자라났다.","en":"Georgia, Armenia, and Azerbaijan were joined in a federal union. As the Transcaucasian party leadership under Ordzhonikidze pressed integration hard, conflict grew with the leaders of the Georgian Communist Party."}
       },
       {
         "date":"1922.08–09",
         "title":{"ko":"스탈린의 자치화안","en":"Stalin's autonomization draft"},
         "body":{"ko":"조직국 위원회에서 민족인민위원 스탈린은 우크라이나 등 공화국들을 자치공화국 자격으로 러시아 연방에 편입하는 안을 기초했다. 우크라이나와 그루지야의 당 지도부가 반발했고, 안건은 병상의 레닌에게 회부되었다.","en":"In an Orgburo commission, Stalin as Commissar of Nationalities drafted a plan to incorporate Ukraine and the other republics into the Russian federation as autonomous republics. The Ukrainian and Georgian party leaderships objected, and the question went to the ailing Lenin."}
       },
       {
         "date":"1922.09.26",
         "title":{"ko":"레닌의 개입: 대등한 공화국들의 연방","en":"Lenin's intervention: a union of equal republics"},
         "body":{"ko":"레닌은 카메네프에게 보낸 서한에서 자치화안을 비판하고, 러시아가 다른 공화국들과 대등한 자격으로 함께 가입하는 새로운 연방, 곧 유럽과 아시아의 소비에트 공화국 연방을 제안했다. 스탈린은 이 수정을 받아들여 안을 다시 썼다.","en":"In a letter to Kamenev, Lenin criticized the autonomization draft and proposed a new union that Russia itself would join on equal terms with the other republics, a union of the Soviet republics of Europe and Asia. Stalin accepted the revision and redrafted the plan."}
       },
       {
         "date":"1922.10–12",
         "title":{"ko":"그루지야 사건","en":"The Georgian affair"},
         "body":{"ko":"자캅카스 연방을 경유하지 않는 직접 가입을 요구하던 그루지야 중앙위원회가 집단 사임했고, 오르조니키제가 그루지야 활동가를 구타하는 사건까지 벌어졌다. 제르진스키가 이끈 조사위원회는 사실상 오르조니키제를 옹호했고, 그 결론은 레닌을 격분시켰다.","en":"The Georgian Central Committee, which demanded direct entry into the union rather than through the Transcaucasian federation, resigned as a body, and Ordzhonikidze went so far as to strike a Georgian activist. The investigating commission led by Dzerzhinsky effectively sided with Ordzhonikidze, and its conclusion enraged Lenin."}
       },
       {
         "date":"1922.12.30",
         "title":{"ko":"제1차 연방 소비에트 대회: 연방의 탄생","en":"First All-Union Congress of Soviets: the union is born"},
         "body":{"ko":"러시아·우크라이나·벨로루시야·자캅카스의 대표들이 연방 결성 선언과 연방조약을 채택했다. 스탈린이 결성 보고를 했고, 프룬제의 제안에 따라 문서는 각 공화국의 심의를 거쳐 확정하기로 했다. 칼리닌이 포함된 의장단이 새 연방 중앙집행위원회를 이끌게 되었다.","en":"Delegates of Russia, Ukraine, Byelorussia, and Transcaucasia adopted the Declaration and the Treaty on the Formation of the USSR. Stalin delivered the founding report, and on Frunze's motion the documents were to be finalized after review by each republic. A presidium including Kalinin headed the new Union Central Executive Committee."}
       },
       {
         "date":"1922.12.30–31",
         "title":{"ko":"레닌의 마지막 투쟁: 대러시아 국수주의 비판","en":"Lenin's last struggle: against Great-Russian chauvinism"},
         "body":{"ko":"레닌은 「민족 문제 또는 자치화에 관하여」를 구술해 대러시아 국수주의를 억압 민족의 배외주의로 규정하고, 과거에 억압했던 민족은 형식적 평등을 넘어 실질적 불평등을 보상해야 한다고 썼다. 그는 그루지야 사건의 정치적 책임을 스탈린과 제르진스키에게 물었다.","en":"Lenin dictated The Question of Nationalities or Autonomisation, defining Great-Russian chauvinism as the chauvinism of an oppressor nation and arguing that a formerly oppressing nation must compensate for real inequality beyond formal equality. He laid political responsibility for the Georgian affair on Stalin and Dzerzhinsky."}
       },
       {
         "date":"1923.04",
         "title":{"ko":"제12차 당대회와 코레니자치야","en":"The Twelfth Congress and korenizatsiya"},
         "body":{"ko":"당대회는 민족 문제 결의를 채택해, 각 공화국에서 민족어와 민족 간부를 육성하는 코레니자치야(토착화)를 공식 정책으로 삼았다. 라콥스키 등은 연방 중앙 권한의 비대화를 경고하며 공화국 권한의 확대를 요구했다.","en":"The congress adopted a resolution on the national question, making korenizatsiya, the promotion of national languages and national cadres in each republic, official policy. Rakovsky and others warned against the growth of central power and demanded broader rights for the republics."}
       },
       {
         "date":"1923.07.06",
         "title":{"ko":"연방 헌법의 발효","en":"The union constitution takes effect"},
         "body":{"ko":"연방 중앙집행위원회가 헌법 초안을 승인해 발효시켰다. 헌법은 외교·국방·대외무역을 연방에, 교육·보건·토지 등의 사무를 공화국에 배분했다.","en":"The Union Central Executive Committee approved the draft constitution and put it into effect, assigning foreign affairs, defense, and foreign trade to the union while leaving matters such as education, health, and land to the republics."}
       },
       {
         "date":"1924.01.31",
         "title":{"ko":"1924년 헌법의 비준","en":"Ratification of the 1924 Constitution"},
         "body":{"ko":"제2차 연방 소비에트 대회가 헌법을 최종 비준했다. 헌법은 각 연방 공화국의 자유로운 탈퇴권을 명문화했고, 이후 중앙아시아의 민족 구획을 거쳐 새 공화국들이 연방에 더해졌다.","en":"The Second All-Union Congress of Soviets gave the constitution final ratification. It codified each union republic's free right of secession, and new republics were later added through the national delimitation of Central Asia."}
       },
       {
         "date":"1923–1932",
         "title":{"ko":"코레니자치야의 실천","en":"Korenizatsiya in practice"},
         "body":{"ko":"우크라이나화를 비롯한 각지의 토착화로 민족어 학교·신문·행정이 급증했고, 문자가 없던 민족들에게 새 문자가 만들어졌다. 역사가 테리 마틴은 이 시기의 소련을 소수민족의 발전을 국가가 체계적으로 지원한 최초의 사례로 평가했다.","en":"Nativization drives such as Ukrainization multiplied national-language schools, newspapers, and administration, and new scripts were created for peoples who had none. The historian Terry Martin assessed the USSR of this period as the first state to systematically sponsor the development of its minority nations."}
       }
     ]$$::jsonb,
     $$[
       "https://www.marxists.org/archive/lenin/works/1922/dec/testamnt/autonomy.htm",
       "https://www.departments.bucknell.edu/russian/const/1924toc.html",
       "Terry Martin, The Affirmative Action Empire: Nations and Nationalism in the Soviet Union, 1923–1939 (2001)",
       "Moshe Lewin, Lenin's Last Struggle (1968)",
       "Jeremy Smith, The Bolsheviks and the National Question, 1917–23 (1999)",
       "Stephen Kotkin, Stalin, vol. 1: Paradoxes of Power, 1878–1928 (2014)"
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
SELECT 'ussr-formation', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('lenin', 0, 'leader', '연방 원칙의 설계자', 'Architect of the union principle',
     '자치화안을 물리치고 대등한 공화국들의 연방을 관철했으며, 마지막 구술에서 대러시아 국수주의와 싸웠다.',
     'He overturned the autonomization draft in favor of a union of equal republics and, in his last dictations, fought Great-Russian chauvinism.'),
    ('stalin', 1, 'leader', '민족인민위원', 'Commissar of Nationalities',
     '자치화안을 기초했고, 레닌의 비판 뒤 연방안을 수용해 제1차 대회에서 결성 보고를 맡았다.',
     'He drafted the autonomization plan and, after Lenin''s criticism, accepted the union formula and delivered the founding report at the First Congress.'),
    ('trotsky', 2, 'participant', '레닌의 동맹자', 'Lenin''s ally',
     '레닌이 그루지야 문제를 당대회에서 방어해 달라고 요청했던 정치국의 동맹자였다.',
     'He was the Politburo ally whom Lenin asked to defend the Georgian cause at the party congress.'),
    ('ordzhonikidze', 3, 'participant', '자캅카스 당 책임자', 'Transcaucasian party chief',
     '자캅카스 연방화를 강행하다 그루지야 활동가를 구타해 그루지야 사건의 중심에 섰다.',
     'Forcing through Transcaucasian federation, he struck a Georgian activist and stood at the center of the Georgian affair.'),
    ('dzerzhinsky', 4, 'participant', '조사위원장', 'Investigation chair',
     '그루지야 사건 조사위원회를 이끌었고, 오르조니키제를 옹호한 그 결론은 레닌의 강한 비판을 받았다.',
     'He led the commission investigating the Georgian affair; its conclusion in Ordzhonikidze''s favor drew Lenin''s sharp criticism.'),
    ('rakovsky', 5, 'participant', '공화국 권한의 옹호자', 'Defender of republic rights',
     '우크라이나 정부수반으로서 12차 당대회에서 연방 중앙집권화에 맞서 공화국 권한을 가장 일관되게 옹호했다.',
     'As Ukrainian head of government he was the most consistent defender of republic rights against centralization at the Twelfth Congress.'),
    ('kamenev', 6, 'participant', '위원회 지도부', 'Commission leadership',
     '결성 준비 위원회의 지도부로서 자치화안을 비판한 레닌의 9월 서한을 받아 수정 과정에 반영했다.',
     'A leader of the preparatory commission, he received Lenin''s September letter criticizing autonomization and carried its revisions forward.'),
    ('kalinin', 7, 'participant', '연방 중앙집행위 의장', 'Union CEC chairman',
     '제1차 연방 소비에트 대회에서 연방 중앙집행위원회 의장단의 일원으로 선출되어 새 연방 기구를 대표했다.',
     'Elected to the presidium of the Union Central Executive Committee at the First Congress, he represented the new union institutions.'),
    ('frunze', 8, 'participant', '조약 확정 절차 제안자', 'Mover of the treaty procedure',
     '제1차 대회에서 결성 선언과 조약을 각 공화국의 심의를 거쳐 확정하자는 결의를 제안했다.',
     'At the First Congress he moved the resolution to finalize the Declaration and Treaty after review by each republic.'),
    ('manuilsky', 9, 'participant', '중앙집권 노선 지지자', 'Advocate of centralization',
     '우크라이나 당 지도자로서 결성 논쟁에서 자치화에 가까운 중앙집권적 노선을 지지했다.',
     'A Ukrainian party leader who, in the formation debate, backed a centralizing line close to autonomization.'),
    ('chicherin', 10, 'participant', '외교인민위원', 'Foreign affairs commissar',
     '제노바 회의 등 대외 관계의 경험에서 조약을 맺을 통일된 연방 주체의 필요를 제기했다.',
     'Drawing on Genoa and other diplomatic experience, he pressed the need for a single union subject capable of concluding treaties.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;

-- ============================================================================
-- Event 2: The New Economic Policy (NEP)
-- ============================================================================

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('new-economic-policy', 50, '1921–1928',
     '신경제정책(네프)', 'The New Economic Policy (NEP)',
     '혁명 권력은 왜 전략적 후퇴를 선택했고, 그 후퇴는 무엇을 살렸으며 어떤 딜레마를 남겼는가?',
     'Why did the revolutionary state choose a strategic retreat, what did that retreat save, and what dilemmas did it leave?',
     '내전에서 승리했으나 경제 붕괴와 크론시타트 반란까지 겪은 1921년 봄, 당은 식량할당징발을 현물세로 바꾸고 시장과 소경영을 허용하는 신경제정책으로 전환했다. 레닌이 전략적 후퇴라 부른 이 전환은 노동자와 농민의 동맹, 곧 스미치카를 지키기 위한 것이었다. 네프 아래에서 경제는 전전 수준을 회복했고, 1920년대의 문화적 개화가 꽃피었다.',
     'In the spring of 1921 the party, victorious in the civil war but facing economic collapse and the Kronstadt revolt, replaced grain requisitioning with a tax in kind and legalized markets and small enterprise: the New Economic Policy. Lenin called it a strategic retreat, made to preserve the smychka, the alliance of workers and peasants. Under NEP the economy recovered to prewar levels and the cultural flowering of the 1920s bloomed.',
     '1926–27년까지 공업과 농업 생산은 대체로 1913년 수준을 회복했고, 체르보네츠 개혁으로 통화가 안정되었다. 그러나 사적 축적에 기대지 않고 공업화 자금을 어떻게 마련할 것인가라는 딜레마는 해소되지 않았고, 1927–28년 곡물 조달 위기 속에서 당은 비상조치와 제1차 5개년계획으로 돌아섰다. 네프는 사회주의 권력이 후퇴와 회복을 관리할 수 있음을 보여 준 경험으로 남았다.',
     'By 1926–27 industrial and agricultural output had broadly recovered to 1913 levels, and the chervonets reform stabilized the currency. Yet the dilemma of financing industrialization without relying on private accumulation was never resolved, and amid the grain procurement crisis of 1927–28 the party turned to emergency measures and the first Five-Year Plan. NEP remained proof that a socialist state could manage retreat and recovery.',
     $$[
       {
         "date":"1921.02–03",
         "title":{"ko":"위기의 겨울","en":"A winter of crisis"},
         "body":{"ko":"7년에 걸친 전쟁으로 대공업 생산은 전전의 5분의 1 수준으로 떨어졌고, 탐보프 농민봉기와 페트로그라드 파업에 이어 크론시타트 수병들이 봉기했다. 전시공산주의의 할당징발은 더 이상 유지될 수 없었다.","en":"After seven years of war, large-scale industry had fallen to roughly a fifth of its prewar output; the Tambov peasant rising and Petrograd strikes were followed by the revolt of the Kronstadt sailors. War Communism's requisitioning could no longer be sustained."}
       },
       {
         "date":"1921.03",
         "title":{"ko":"제10차 당대회: 현물세로의 전환","en":"Tenth Party Congress: the turn to the tax in kind"},
         "body":{"ko":"레닌의 보고에 따라 당대회는 할당징발을 현물세로 대체하기로 결의했다. 세금을 내고 남은 농산물을 농민이 처분할 수 있게 되면서 시장이 되살아날 길이 열렸다.","en":"On Lenin's report the congress resolved to replace requisitioning with a tax in kind. Peasants could now dispose of their surplus after tax, opening the way for the revival of the market."}
       },
       {
         "date":"1921.03.21",
         "title":{"ko":"현물세 법령","en":"The tax-in-kind decree"},
         "body":{"ko":"전러시아 중앙집행위원회가 현물세 법령을 공포했다. 뒤이어 소매 상업, 소기업 임대, 협동조합 활동이 단계적으로 합법화되면서 네프의 골격이 갖추어졌다.","en":"The All-Russian Central Executive Committee promulgated the tax-in-kind decree. Retail trade, the leasing of small enterprises, and cooperative activity were legalized step by step, giving NEP its framework."}
       },
       {
         "date":"1921–1922",
         "title":{"ko":"기근과 회복의 시작","en":"Famine and the start of recovery"},
         "body":{"ko":"볼가 유역의 대기근이 수백만 명의 목숨을 앗아 갔고, 국가는 국제 구호를 받아들이며 위기를 넘겼다. 1922년부터 파종 면적과 공업 생산이 뚜렷이 회복되기 시작했다.","en":"The great Volga famine took millions of lives, and the state accepted international relief to weather the crisis. From 1922 sown area and industrial output began a marked recovery."}
       },
       {
         "date":"1922.11",
         "title":{"ko":"체르보네츠: 통화의 안정","en":"The chervonets: stabilizing the currency"},
         "body":{"ko":"재정인민위원 소콜니코프의 주도로 금을 준거로 한 신통화 체르보네츠가 발행되었다. 1924년 화폐개혁이 완료되면서 초인플레이션이 종식되어 시장 회복의 토대가 되었다.","en":"Under finance commissar Sokolnikov the gold-backed chervonets was issued. The completion of monetary reform in 1924 ended hyperinflation and underpinned the market recovery."}
       },
       {
         "date":"1922.12–1923.03",
         "title":{"ko":"레닌의 마지막 저작들","en":"Lenin's last writings"},
         "body":{"ko":"병상의 레닌은 대회에 보내는 편지와 「협동조합에 관하여」 등을 구술하며, 문화혁명과 협동조합을 통해 네프의 러시아가 사회주의 러시아로 성장할 수 있다고 전망했다. 그는 당 지도부가 분열할 위험도 경고했다.","en":"From his sickbed Lenin dictated the Letter to the Congress and On Cooperation, arguing that through cultural revolution and cooperatives the Russia of NEP could grow into socialist Russia. He also warned of the danger of a split in the leadership."}
       },
       {
         "date":"1923.10",
         "title":{"ko":"협상가격차 위기","en":"The scissors crisis"},
         "body":{"ko":"공업품 가격이 농산물 가격보다 크게 벌어지는 협상가격차 위기가 정점에 이르렀다. 국가는 공업품 가격 인하로 대응해 스미치카를 지켰으나, 공업 축적의 어려움이 드러났다.","en":"The scissors crisis peaked as industrial prices opened far above agricultural prices. The state responded by forcing industrial prices down, preserving the smychka, but the difficulty of industrial accumulation was exposed."}
       },
       {
         "date":"1924.01.21",
         "title":{"ko":"레닌의 죽음","en":"The death of Lenin"},
         "body":{"ko":"레닌이 고리키 마을에서 사망했다. 노동자 수십만 명이 입당한 레닌 입당 운동이 이어졌고, 네프의 앞날을 둘러싼 지도부의 논쟁이 본격화되었다.","en":"Lenin died at Gorki. The Lenin Enrollment brought hundreds of thousands of workers into the party, and the leadership's debates over the future of NEP began in earnest."}
       },
       {
         "date":"1925.12",
         "title":{"ko":"제14차 당대회: 일국사회주의와 스미치카","en":"Fourteenth Congress: socialism in one country and the smychka"},
         "body":{"ko":"당대회는 일국에서의 사회주의 건설 노선을 확인했다. 부하린과 리코프가 이끄는 다수파는 농민 경제의 성장 위에서 점진적으로 공업화한다는 노선을 견지했고, 지노비예프와 카메네프의 신반대파는 부농의 위험을 경고하며 맞섰다.","en":"The congress confirmed the line of building socialism in one country. The majority led by Bukharin and Rykov held to gradual industrialization on the growth of the peasant economy, while the New Opposition of Zinoviev and Kamenev warned of the kulak danger."}
       },
       {
         "date":"1925–1927",
         "title":{"ko":"1920년대의 문화 개화","en":"The cultural flowering of the 1920s"},
         "body":{"ko":"문맹퇴치 운동이 확산되는 한편, 마야콥스키의 좌익예술전선, 에이젠슈테인의 영화, 구성주의 건축 등 전위 예술이 만개했다. 경쟁하는 문학 유파들이 공존한 이 시기는 소비에트 문화의 실험장이었다.","en":"While the literacy campaign spread, the avant-garde flourished: Mayakovsky's LEF, Eisenstein's films, constructivist architecture. With rival literary schools coexisting, the period was a laboratory of Soviet culture."}
       },
       {
         "date":"1926–1927",
         "title":{"ko":"공업화 논쟁","en":"The industrialization debate"},
         "body":{"ko":"프레오브라젠스키는 사회주의 시초축적론을 통해 공업화 자금을 농민 경제로부터 이전해야 한다고 주장했고, 부하린은 시장을 통한 균형 성장을 옹호했다. 통합반대파는 1927년 12월 제15차 당대회에서 패배해 축출되었다.","en":"Preobrazhensky argued from primitive socialist accumulation that industrialization must be financed by transfers from the peasant economy, while Bukharin defended balanced growth through the market. The United Opposition was defeated and expelled at the Fifteenth Congress in December 1927."}
       },
       {
         "date":"1928",
         "title":{"ko":"곡물 조달 위기와 네프의 종언","en":"The grain crisis and the end of NEP"},
         "body":{"ko":"1927–28년 겨울 곡물 조달이 급감하자 스탈린은 시베리아에서 비상조치를 지휘했고, 강제 수매와 형법 적용이 재개되었다. 제1차 5개년계획이 시작되고 부하린 그룹이 패배하면서 네프는 사실상 막을 내렸다.","en":"When grain procurement collapsed in the winter of 1927–28, Stalin directed emergency measures in Siberia, reviving forced procurement and criminal prosecution. With the first Five-Year Plan under way and the defeat of Bukharin's group, NEP came to its effective end."}
       }
     ]$$::jsonb,
     $$[
       "https://www.marxists.org/archive/lenin/works/1921/apr/21.htm",
       "https://www.marxists.org/archive/lenin/works/1923/jan/06.htm",
       "E. H. Carr, The Interregnum 1923–1924 (1954)",
       "Alan Ball, Russia's Last Capitalists: The Nepmen, 1921–1929 (1987)",
       "Alexander Erlich, The Soviet Industrialization Debate, 1924–1928 (1960)",
       "Sheila Fitzpatrick, The Russian Revolution (4th ed., 2017)",
       "Stephen Kotkin, Stalin, vol. 1: Paradoxes of Power, 1878–1928 (2014)"
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
SELECT 'new-economic-policy', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('lenin', 0, 'leader', '네프의 설계자', 'Architect of NEP',
     '제10차 당대회에서 현물세로의 전환을 관철했고, 만년의 저작에서 협동조합을 통한 사회주의의 길을 제시했다.',
     'He carried the turn to the tax in kind at the Tenth Congress and, in his last writings, charted a road to socialism through cooperatives.'),
    ('bukharin', 1, 'leader', '네프의 이론가', 'NEP''s leading theorist',
     '스미치카를 옹호하며 시장을 통한 점진적 사회주의 건설론을 가장 체계적으로 발전시켰다.',
     'Defending the smychka, he developed the most systematic case for gradual socialist construction through the market.'),
    ('rykov', 2, 'leader', '정부수반', 'Head of government',
     '레닌 사후 인민위원회 의장으로서 네프 경제의 운영을 책임졌다.',
     'As chairman of Sovnarkom after Lenin''s death, he was responsible for running the NEP economy.'),
    ('sokolnikov', 3, 'participant', '재정인민위원', 'Finance commissar',
     '체르보네츠 통화개혁을 이끌어 네프의 화폐 안정을 만들어 냈다.',
     'He led the chervonets currency reform that gave NEP its monetary stability.'),
    ('stalin', 4, 'participant', '당 서기장', 'General secretary',
     '당 기구를 이끌며 부하린과 함께 네프 노선을 방어하다가, 1928년 곡물 위기에서 비상조치로 돌아섰다.',
     'Heading the party apparatus, he defended the NEP line alongside Bukharin before turning to emergency measures in the 1928 grain crisis.'),
    ('tomsky', 5, 'participant', '노동조합 지도자', 'Trade union leader',
     '네프 시기 노동조합을 이끌며 시장 조건 아래 노동자의 이해를 대변했다.',
     'He led the trade unions through the NEP years, representing workers under market conditions.'),
    ('zinoviev', 6, 'participant', '신반대파 지도자', 'New Opposition leader',
     '3인지도체제의 일원이었다가 1925년부터 부농의 위험을 경고하는 신반대파를 이끌었다.',
     'A member of the ruling triumvirate, from 1925 he led the New Opposition warning of the kulak danger.'),
    ('kamenev', 7, 'participant', '신반대파 지도자', 'New Opposition leader',
     '모스크바 당과 노동방위회의를 이끌었고, 지노비예프와 함께 네프의 부농 위험을 경고했다.',
     'He led the Moscow party and the Council of Labor and Defense, and with Zinoviev warned of the kulak danger under NEP.'),
    ('trotsky', 8, 'participant', '계획화의 주창자', 'Advocate of planning',
     '네프의 틀 안에서 국가 계획과 공업 우선을 요구하며 당 관료화를 비판했다.',
     'Within the NEP framework he demanded state planning and industrial priority while criticizing party bureaucratization.'),
    ('preobrazhensky', 9, 'opponent', '좌파 경제 비판자', 'Left economic critic',
     '사회주의 시초축적론으로 네프의 축적 딜레마를 가장 날카롭게 정식화했다.',
     'His theory of primitive socialist accumulation formulated NEP''s accumulation dilemma most sharply.'),
    ('nadezhda-krupskaya', 10, 'participant', '문맹퇴치 지도자', 'Literacy campaigner',
     '교육인민위원회에서 문맹퇴치 운동과 성인 교육을 이끌어 네프기 문화 건설을 뒷받침했다.',
     'At the education commissariat she led the literacy campaign and adult education, underpinning the cultural construction of the NEP years.'),
    ('dzerzhinsky', 11, 'participant', '국민경제최고회의 의장', 'VSNKh chairman',
     '1924년부터 국민경제최고회의를 이끌며 네프의 틀 안에서 공업 회복을 옹호했다.',
     'From 1924 he headed the Supreme Council of the National Economy, championing industrial recovery within the NEP framework.'),
    ('mayakovsky', 12, 'witness', '시대의 시인', 'Poet of the era',
     '국영기업 광고 시와 풍자로 네프 시대의 활력과 모순을 함께 기록했다.',
     'With advertising verse for state enterprises and satire, he recorded both the energy and the contradictions of the NEP era.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
