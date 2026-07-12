-- Event: the First Five-Year Plans and the Soviet transformation (1928–1937).
-- Covers the grain crisis and the Great Break, collectivization and dekulakization,
-- the 1932–33 famine (following Davies & Wheatcroft's archival scholarship),
-- Magnitogorsk and Dneprostroi, likbez, women entering industry and education,
-- Stakhanovism, the 1936 constitution, and what the industrial base meant in 1941.
-- Idempotent: safe to re-run.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('five-year-plans', 60, '1928–1937',
     '5개년 계획과 소련의 대전환', 'The Five-Year Plans and the Soviet Transformation',
     '농민의 나라는 어떻게 10년 만에 산업 강국이 되었고, 그 대가는 무엇이었는가?',
     'How did a peasant country become an industrial power in a single decade, and at what cost?',
     '1928년부터 1937년까지 두 차례의 5개년 계획은 농민의 나라를 산업 강국으로 바꾼 세계사적 전환이었다. 곡물 조달 위기에서 출발한 집단화와 초고속 공업화는 마그니토고르스크와 드네프로스트로이 같은 거대 건설, 대중 문맹 퇴치 운동, 여성의 공장과 대학 진출을 낳았다. 그러나 강제 집단화는 농촌에 격변을 불러왔고, 1932–1933년에는 과도한 조달과 흉작이 겹친 기근으로 수백만 명이 목숨을 잃었다. 이 시기의 성취와 희생은 분리할 수 없는 하나의 역사로 남았다.',
     'From 1928 to 1937, two Five-Year Plans transformed a peasant country into an industrial power, a turn of world-historical scale. Beginning from a grain procurement crisis, collectivization and crash industrialization produced giant construction projects such as Magnitogorsk and Dneprostroi, a mass literacy campaign, and the entry of women into factories and universities. Yet forced collectivization convulsed the countryside, and in 1932–1933 a famine born of excessive procurement and harvest failure killed millions. The achievements and the sacrifices of this decade remain a single, inseparable history.',
     '1937년까지 소련의 공업 생산은 몇 배로 늘었고, 우랄과 시베리아에 새로운 산업 기지가 세워졌으며, 보편 교육과 보건 체계의 골격이 갖추어졌다. 기록보관소 연구는 집단화와 기근의 대가를 숨김없이 보여 준다. 동시에 이 10년이 만든 산업적 토대는 1941년 이후 소련이 국방산업을 동부로 소개하고 독일보다 많은 전차와 항공기를 생산하며 나치 국방군을 꺾는 물질적 기반이 되었다.',
     'By 1937 Soviet industrial output had multiplied several times over, new industrial bases stood in the Urals and Siberia, and the framework of universal education and healthcare was in place. Archival research shows the cost of collectivization and famine without concealment. At the same time, the industrial foundation built in this decade became the material base on which, after 1941, the USSR evacuated its defense industry eastward, outproduced Germany in tanks and aircraft, and broke the Wehrmacht.',
     $$[
  {
    "date":"1928.01",
    "title":{"ko":"곡물 조달 위기와 시베리아 출장","en":"The grain crisis and the Siberian journey"},
    "body":{"ko":"1927년 말 국가 곡물 조달량이 급감하자 스탈린은 1928년 1월 시베리아로 직접 내려가 형법 제107조를 동원한 비상 징발을 지시했다. 이른바 ‘우랄-시베리아 방식’은 네프의 시장 관계가 끝나 가고 있음을 알리는 신호였다.","en":"When state grain procurement collapsed in late 1927, Stalin traveled to Siberia in January 1928 and ordered emergency requisitioning under Article 107 of the criminal code. The so-called Urals-Siberian method signaled that the market relations of the NEP were coming to an end."}
  },
  {
    "date":"1929.04",
    "title":{"ko":"제1차 5개년 계획 채택","en":"The First Five-Year Plan adopted"},
    "body":{"ko":"제16차 당협의회와 소비에트 대회가 5개년 계획을 승인했고, 계획은 1928년 10월로 소급 적용됐다. 중공업 우선의 초고속 공업화가 국가의 공식 노선이 되었다.","en":"The Sixteenth Party Conference and the Congress of Soviets approved the Five-Year Plan, backdated to October 1928. Crash industrialization with priority for heavy industry became official state policy."}
  },
  {
    "date":"1929.11.07",
    "title":{"ko":"‘대전환의 해’","en":"‘The Year of the Great Break’"},
    "body":{"ko":"혁명 12주년에 발표된 스탈린의 프라우다 논설은 농업 집단화와 공업화의 전면 가속을 선언했다. 이해 가을부터 전면 집단화 운동이 곡창지대를 휩쓸기 시작했다.","en":"Published on the revolution's twelfth anniversary, Stalin's Pravda article proclaimed the all-out acceleration of collectivization and industrialization. From that autumn the drive for wholesale collectivization swept through the grain regions."}
  },
  {
    "date":"1930.01.30",
    "title":{"ko":"전면 집단화와 탈쿨라크화","en":"Wholesale collectivization and dekulakization"},
    "body":{"ko":"정치국은 전면 집단화 지구에서 ‘계급으로서의 쿨라크 청산’을 결정했다. 1930–1931년에 약 180만 명이 특별이주민으로 북부와 시베리아 등지에 강제 이주됐고, 이 과정의 폭력과 혼란은 기록보관소 문서에 상세히 남아 있다.","en":"The Politburo resolved to ‘liquidate the kulaks as a class’ in districts of wholesale collectivization. In 1930–1931 roughly 1.8 million people were deported as special settlers to the North, Siberia, and elsewhere; the violence and chaos of the process are documented in detail in the archives."}
  },
  {
    "date":"1930.03.02",
    "title":{"ko":"‘성공에 취하여’","en":"‘Dizzy with Success’"},
    "body":{"ko":"스탈린은 프라우다 논설에서 집단화의 과열과 강압을 지방 간부의 탓으로 돌리며 시정을 지시했고, 수백만 농가가 일시적으로 콜호스에서 탈퇴했다. 그러나 그해 가을부터 집단화는 다시 추진되어 1937년에는 농가의 90% 이상이 콜호스에 속하게 됐다.","en":"In a Pravda article Stalin blamed local officials for the excesses and coercion of collectivization and ordered corrections, and millions of households temporarily left the kolkhozes. From that autumn, however, collectivization resumed, and by 1937 over ninety percent of peasant households belonged to collective farms."}
  },
  {
    "date":"1932.02.01",
    "title":{"ko":"마그니토고르스크의 첫 선철","en":"First pig iron at Magnitogorsk"},
    "body":{"ko":"우랄의 초원에 맨손으로 세워진 마그니토고르스크 제철소의 첫 고로가 선철을 쏟아냈다. 수만 명의 노동자가 천막과 흙집에서 겨울을 나며 세계 최대급 철강 도시를 건설했고, 이 현장은 새 문명을 짓는다는 열망과 극심한 결핍이 공존한 대건설의 상징이 되었다.","en":"The first blast furnace of the Magnitogorsk steel complex, raised from bare steppe in the Urals, produced its first pig iron. Tens of thousands of workers wintered in tents and dugouts to build one of the world's largest steel cities, a site where the aspiration to build a new civilization coexisted with severe deprivation."}
  },
  {
    "date":"1932.10.10",
    "title":{"ko":"드네프로스트로이 발전소 가동","en":"Dneprostroi hydroelectric station opens"},
    "body":{"ko":"드네프르강의 드네프로스트로이(드네프로게스) 수력발전소가 가동을 시작했다. 당시 유럽 최대의 발전소로, 레닌의 고엘로 전력화 구상을 잇는 공업화의 상징이었다.","en":"The Dneprostroi (DneproGES) hydroelectric station on the Dnieper began operation. The largest power station in Europe at the time, it stood as a symbol of industrialization in the lineage of Lenin's GOELRO electrification plan."}
  },
  {
    "date":"1932–1933",
    "title":{"ko":"곡창지대의 기근","en":"Famine across the grain regions"},
    "body":{"ko":"과도한 곡물 조달, 집단화가 초래한 농업 혼란, 연이은 흉작이 겹치면서 우크라이나, 카자흐스탄, 볼가, 북캅카스 등 곡창지대 전역에서 기근이 발생했다. 기록보관소에 근거한 데이비스와 휘트크로프트의 연구는 소련 전역의 초과 사망을 약 550만에서 650만 명으로 추산하며, 기근을 계획된 학살이 아니라 조달 우선 정책과 흉작, 지도부의 뒤늦고 불충분한 대응이 결합된 결과로 설명한다. 1933년 봄 정부는 종자와 식량 대여로 대응했으나 재난의 규모에 비해 늦고 부족했다.","en":"Excessive grain procurement, the agricultural disruption caused by collectivization, and successive harvest failures combined to produce famine across the grain regions: Ukraine, Kazakhstan, the Volga, and the North Caucasus. The archival research of Davies and Wheatcroft estimates excess deaths across the USSR at roughly 5.5 to 6.5 million, and explains the famine not as a planned extermination but as the outcome of procurement-first policy, harvest failure, and a leadership response that came late and fell short. In spring 1933 the government issued seed and food loans, but relief was late and inadequate against the scale of the disaster."}
  },
  {
    "date":"1928–1939",
    "title":{"ko":"리크베즈, 문맹과의 전쟁","en":"Likbez: the war on illiteracy"},
    "body":{"ko":"문화 원정대와 야학, 성인 학교가 전국의 마을과 공장으로 퍼져 나갔다. 1926년 인구조사에서 약 57%였던 문해율은 1939년 인구조사에서 87%를 넘어섰고, 무상 보편 교육과 보건 체계가 같은 시기에 뼈대를 갖추었다.","en":"Cultural campaigns, night schools, and adult classes spread through villages and factories across the country. Literacy, about 57 percent in the 1926 census, exceeded 87 percent in the 1939 census, while free universal education and a public healthcare system took shape in the same years."}
  },
  {
    "date":"1928–1937",
    "title":{"ko":"공장과 대학으로 간 여성들","en":"Women enter the factories and universities"},
    "body":{"ko":"공업화는 여성 노동력을 대규모로 산업과 교육으로 불러들였다. 여성 취업자는 1928년 약 300만 명에서 1940년 1300만 명 이상으로 늘었고, 탁아소와 공동식당이 확충되는 가운데 여성 기사, 의사, 교사가 대량으로 배출됐다.","en":"Industrialization drew women into industry and education on a mass scale. Women in paid employment rose from about three million in 1928 to over thirteen million by 1940, and as nurseries and canteens expanded, women engineers, doctors, and teachers graduated in large numbers."}
  },
  {
    "date":"1935.08.31",
    "title":{"ko":"스타하노프의 교대 근무","en":"Stakhanov's shift"},
    "body":{"ko":"돈바스의 광부 알렉세이 스타하노프가 한 교대에 기준량의 14배인 102톤의 석탄을 캤다. 노동 조직의 재편과 결합된 이 기록은 전국적인 스타하노프 운동으로 번져 생산성 경쟁과 노동 영웅의 문화를 낳았다.","en":"Alexei Stakhanov, a Donbass miner, cut 102 tons of coal in a single shift, fourteen times the norm. Built on a reorganization of the labor process, the record grew into the nationwide Stakhanovite movement, a culture of productivity competition and labor heroes."}
  },
  {
    "date":"1936.12.05",
    "title":{"ko":"1936년 소련 헌법","en":"The 1936 Soviet Constitution"},
    "body":{"ko":"제8차 소비에트 대회가 새 헌법을 채택했다. 보통·직접·평등 선거와 함께 노동권, 휴식권, 교육권, 의료를 포함한 사회적 권리를 명문화하여, 건설된 사회주의의 사회적 성취를 법의 언어로 선언했다.","en":"The Eighth Congress of Soviets adopted a new constitution. Alongside universal, direct, and equal suffrage, it codified social rights including the rights to work, rest, education, and healthcare, declaring in legal language the social achievements of the socialism that had been built."}
  },
  {
    "date":"1937",
    "title":{"ko":"제2차 5개년 계획의 결산","en":"Results of the Second Five-Year Plan"},
    "body":{"ko":"1937년까지 선철 생산은 1928년의 330만 톤에서 1450만 톤으로, 석탄은 3600만 톤에서 1억 2800만 톤으로 늘었고, 트랙터·자동차·항공기·공작기계 등 이전에 없던 산업 부문이 통째로 만들어졌다. 소련은 한 세대 안에 공업 생산 기준 유럽 1위, 세계 2위권의 산업국이 되었다.","en":"By 1937 pig iron output had grown from 3.3 million tons in 1928 to 14.5 million, coal from 36 million tons to 128 million, and entire industries that had not existed before, tractors, automobiles, aircraft, machine tools, had been created outright. Within a single generation the USSR became first in Europe and among the top two in the world in industrial output."}
  },
  {
    "date":"1941.06",
    "title":{"ko":"1941년의 시험대","en":"The test of 1941"},
    "body":{"ko":"독일의 침공이 시작되자 5개년 계획이 세운 우랄과 시베리아의 산업 기지가 결정적 의미를 드러냈다. 1941년 하반기에만 1500개가 넘는 공장이 동부로 소개되어 기존 기지에 접속됐고, 소련은 1942년부터 독일보다 많은 전차와 항공기를 생산했다. 10년의 공업화가 없었다면 이 전쟁의 물질적 토대는 존재하지 않았을 것이다.","en":"When the German invasion began, the industrial bases the Five-Year Plans had built in the Urals and Siberia revealed their decisive meaning. In the second half of 1941 alone, over 1,500 factories were evacuated eastward and grafted onto the existing base, and from 1942 the USSR outproduced Germany in tanks and aircraft. Without the decade of industrialization, the material foundation of that war effort would not have existed."}
  }
]$$::jsonb,
     $$[
  "R. W. Davies and Stephen G. Wheatcroft, The Years of Hunger: Soviet Agriculture, 1931–1933 (Palgrave Macmillan, 2004)",
  "Stephen Kotkin, Magnetic Mountain: Stalinism as a Civilization (University of California Press, 1995)",
  "Sheila Fitzpatrick, Stalin's Peasants: Resistance and Survival in the Russian Village after Collectivization (Oxford University Press, 1994)",
  "Lynne Viola, The Unknown Gulag: The Lost World of Stalin's Special Settlements (Oxford University Press, 2007)",
  "Lewis H. Siegelbaum, Stakhanovism and the Politics of Productivity in the USSR, 1935–1941 (Cambridge University Press, 1988)",
  "https://www.marxists.org/reference/archive/stalin/works/1930/03/02.htm",
  "https://www.marxists.org/reference/archive/stalin/works/1931/02/04.htm",
  "https://en.wikisource.org/wiki/1936_Constitution_of_the_USSR"
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
SELECT 'five-year-plans', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('stalin', 0, 'leader', '대전환의 지도자', 'Leader of the Great Break',
     '집단화와 초고속 공업화 노선을 최종 결정하고 두 차례의 5개년 계획 전 과정을 지휘했다.',
     'He made the final decision for collectivization and crash industrialization and directed both Five-Year Plans from start to finish.'),
    ('molotov', 1, 'leader', '인민위원회 의장', 'Sovnarkom chairman',
     '1930년부터 정부 수반으로 계획 집행을 총괄했고, 1932년 우크라이나 곡물 조달 위원회를 이끌었다.',
     'Head of government from 1930, he oversaw plan implementation and led the 1932 grain procurement commission to Ukraine.'),
    ('kuibyshev', 2, 'leader', '계획의 설계자', 'Chief planner',
     '최고국민경제회의 의장과 고스플란 의장으로 5개년 계획의 목표 수치를 입안하고 조정했다.',
     'As chairman of Vesenkha and then of Gosplan, he drafted and adjusted the targets of the Five-Year Plans.'),
    ('ordzhonikidze', 3, 'leader', '중공업 인민위원', 'Heavy industry commissar',
     '중공업 인민위원으로 마그니토고르스크를 비롯한 대건설 현장을 지휘하며 소련 중공업 체계를 세웠다.',
     'As commissar of heavy industry, he directed the great construction sites, Magnitogorsk among them, and built the Soviet heavy-industry system.'),
    ('kaganovich', 4, 'executor', '조달 전권위원', 'Procurement plenipotentiary',
     '1932년 북캅카스 등지에 파견된 전권위원회를 이끌며 곡물 조달을 강제하고 저항하는 마을에 제재를 가했다.',
     'Leading plenipotentiary commissions sent to the North Caucasus and elsewhere in 1932, he enforced grain procurement and imposed sanctions on resisting villages.'),
    ('mikoyan', 5, 'participant', '공급 인민위원', 'Supply commissar',
     '식량공업과 공급을 맡은 인민위원으로 조달, 배급, 식품산업 건설을 운영했다.',
     'As the commissar responsible for supply and the food industry, he ran procurement, rationing, and the building of food-processing industries.'),
    ('kosior', 6, 'executor', '우크라이나 제1서기', 'Ukrainian first secretary',
     '우크라이나 당 제1서기로 집단화와 곡물 조달의 현지 집행을 책임졌으며, 기근이 가장 참혹했던 시기의 공화국 최고 책임자였다.',
     'As first secretary of the Ukrainian party, he was responsible for implementing collectivization and grain procurement, and was the republic''s top official during the worst of the famine.'),
    ('postyshev', 7, 'executor', '우크라이나 제2서기', 'Ukraine second secretary',
     '1933년 초 모스크바의 전권을 안고 우크라이나에 파견되어 조달 집행과 당 조직 정비를 지휘했다.',
     'Sent to Ukraine in early 1933 with Moscow''s plenipotentiary authority, he directed procurement enforcement and the overhaul of the party organization.'),
    ('yakov-yakovlev', 8, 'participant', '농업 인민위원', 'Agriculture commissar',
     '농업 인민위원으로 전면 집단화 정책의 실무 입안과 콜호스 제도 설계를 맡았다.',
     'As commissar of agriculture, he handled the practical drafting of wholesale collectivization policy and the design of the kolkhoz system.'),
    ('pyatakov', 9, 'participant', '공업 관리자', 'Industrial manager',
     '중공업 인민위원부 제1부위원으로 신규 공장 건설과 기술 도입 사업을 관리했다.',
     'As first deputy commissar of heavy industry, he managed new plant construction and the import of foreign technology.'),
    ('krzhizhanovsky', 10, 'participant', '고스플란 초대 의장', 'First Gosplan chairman',
     '고엘로 전력화 계획의 설계자이자 고스플란 초대 의장으로 5개년 계획 작업의 기초를 놓았다.',
     'Architect of the GOELRO electrification plan and first chairman of Gosplan, he laid the groundwork on which Five-Year planning was built.'),
    ('bukharin', 11, 'opponent', '우파 반대파 지도자', 'Right opposition leader',
     '네프의 지속과 점진적 공업화를 주장하며 강제 집단화 노선에 반대하다 1929년 지도부에서 밀려났다.',
     'Arguing for the continuation of the NEP and gradual industrialization, he opposed forced collectivization and was pushed out of the leadership in 1929.'),
    ('rykov', 12, 'opponent', '정부 수반, 반대자', 'Head of government, opponent',
     '인민위원회 의장으로서 초고속 노선의 무리함을 경고하다 1930년 해임됐다.',
     'As chairman of Sovnarkom he warned against the excesses of the crash course and was removed in 1930.'),
    ('tomsky', 13, 'opponent', '노조 지도자, 반대자', 'Trade union leader, opponent',
     '노동조합 지도자로서 부하린, 리코프와 함께 강행 노선에 반대하다 1929년 노조 지도부에서 물러났다.',
     'As head of the trade unions he opposed the forced course alongside Bukharin and Rykov, and was removed from the union leadership in 1929.'),
    ('nadezhda-krupskaya', 14, 'participant', '문맹 퇴치 조직자', 'Literacy campaign organizer',
     '교육 인민위원부에서 성인 교육과 문맹 퇴치 운동의 조직을 이끌었다.',
     'Within the education commissariat, she led the organization of adult education and the literacy campaign.'),
    ('lunacharsky', 15, 'participant', '계몽 인민위원', 'Enlightenment commissar',
     '1929년까지 교육 인민위원으로 재직하며 리크베즈와 보편 교육 체계의 기초를 놓았다.',
     'Serving as commissar of enlightenment until 1929, he laid the foundations of likbez and the universal school system.'),
    ('sholokhov', 16, 'witness', '증언자', 'Witness',
     '1933년 스탈린에게 보낸 편지들에서 돈 지역 곡물 조달의 폭력적 실태를 고발했고, 스탈린은 일부 구호를 승인하면서도 조달 노선을 옹호했다.',
     'In letters to Stalin in 1933 he exposed the violent conduct of grain procurement in the Don region; Stalin approved some relief while defending the procurement line.'),
    ('platonov', 17, 'witness', '문학적 증언자', 'Literary witness',
     '소설 「코틀로반」에서 대전환기의 고통과 유토피아적 열망을 함께 기록했다.',
     'In his novel The Foundation Pit he recorded both the suffering and the utopian longing of the years of the Great Break.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
