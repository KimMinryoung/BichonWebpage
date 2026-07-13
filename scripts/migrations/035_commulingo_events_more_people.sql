-- Fill out related-people mappings across the remaining history events, using
-- people already present in commulingo_people. Each row is bucketed by
-- relation_kind so it lands in the right involvement container. WHERE EXISTS
-- skips any missing id; the upsert keeps it idempotent. sort_order 100+ appends
-- these after existing rows within each bucket.

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT v.event_id, v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    -- Civil War
    ('civil-war','moisei-uritsky',100,'executor','페트로그라드 체카 의장','Petrograd Cheka chairman','적색테러를 억제하려 했으나 1918년 암살되어 오히려 그 방아쇠가 됐다.','He tried to restrain the Red Terror but was assassinated in 1918, becoming its trigger instead.'),
    ('civil-war','menzhinsky',101,'executor','체카 지도부','Cheka leadership','제르진스키의 후계자로 병상에서도 보안기구를 지휘했다.','Dzerzhinsky’s successor, he directed the security organs even from his sickbed.'),
    ('civil-war','vasily-blyukher',102,'participant','붉은 지휘관','Red commander','내전의 영웅으로 극동에서 백군과 간섭군에 맞섰다.','A hero of the civil war who fought the Whites and interventionists in the Far East.'),
    ('civil-war','iona-yakir',103,'participant','붉은 지휘관','Red commander','남부전선의 내전 영웅으로 훗날 군 개혁을 이끌었다.','A civil-war hero of the southern front who later led military reform.'),
    ('civil-war','ieronim-uborevich',104,'participant','붉은 지휘관','Red commander','스물세 살에 군을 지휘한 붉은 군대의 젊은 사령관이었다.','A young Red Army commander who led armies at twenty-three.'),
    ('civil-war','stepan-shaumyan',105,'leader','바쿠 코뮌 지도자','Leader of the Baku Commune','캅카스 볼셰비키의 지도자로 1918년 26인 바쿠 인민위원과 함께 처형됐다.','A Bolshevik leader in the Caucasus, executed in 1918 with the 26 Baku Commissars.'),
    ('civil-war','larisa-reisner',106,'participant','해군 정치위원','Naval political commissar','볼가 소함대의 정치위원이자 종군기자로 내전을 기록했다.','A political commissar of the Volga flotilla and war correspondent who chronicled the civil war.'),
    ('civil-war','victor-serge',107,'witness','증언한 혁명가','Revolutionary witness','페트로그라드의 내전과 기근을 문학으로 증언한 코민테른 작가였다.','A Comintern writer who bore literary witness to the civil war and famine in Petrograd.'),
    -- February Revolution
    ('february-revolution','molotov',100,'participant','수도의 볼셰비키','Bolshevik in the capital','2월 당시 페트로그라드에 있던 소수의 볼셰비키 지도자로 『프라우다』를 이끌었다.','One of the few Bolshevik leaders in Petrograd in February, he ran Pravda.'),
    ('february-revolution','konkordia-samoilova',101,'participant','여성의 날 조직가','Organizer of Women’s Day','여성의 날 운동을 세운 볼셰비키로, 2월 혁명은 그 여성의 날 시위에서 시작됐다.','A Bolshevik who built the Women’s Day movement; the February Revolution began from its marches.'),
    ('february-revolution','maria-spiridonova',102,'participant','좌파 SR 지도자','Left SR leader','2월 뒤 유형에서 돌아와 좌파 사회혁명당을 이끈 농민 대변자였다.','She returned from exile after February to lead the Left SR as a voice for the peasantry.'),
    ('february-revolution','vera-figner',103,'witness','혁명의 원로','Elder of the revolution','나로드나야 볼랴의 최후 생존자로 새 혁명을 목격한 원로였다.','The last survivor of Narodnaya Volya, an elder who witnessed the new revolution.'),
    -- Five-Year Plans
    ('five-year-plans','stanislav-strumilin',100,'participant','계획 경제학자','Planning economist','5개년계획의 성장 목표를 숫자로 설계한 고스플란 경제학자였다.','A Gosplan economist who designed the growth targets of the Five-Year Plans in numbers.'),
    ('five-year-plans','vladimir-groman',101,'participant','통제숫자의 설계자','Architect of control figures','고스플란 초기의 통제숫자와 균형법을 설계한 멘셰비키 출신 통계학자였다.','A former-Menshevik statistician who designed Gosplan’s early control figures and balances.'),
    ('five-year-plans','osinsky',102,'participant','최고경제회의 초대 의장','First head of Vesenkha','최고경제회의(VSNKh)를 처음 이끈 경제 행정가로 계획 논쟁에 참여했다.','The first head of the Supreme Economic Council, engaged in the planning debates.'),
    ('five-year-plans','tevosian',103,'participant','금속공업 관료','Metallurgy administrator','스탈린 공업화의 금속공업을 맡은 생산 관료였다.','A production administrator who ran the metallurgy of Stalin’s industrialization.'),
    ('five-year-plans','mykola-skrypnyk',104,'opponent','민족공산주의 저항','National-communist resistance','우크라이나화를 설계했으나 집단화기 압박 속에 1933년 스스로 목숨을 끊었다.','The architect of Ukrainization, he took his own life in 1933 under the pressures of the collectivization years.'),
    -- Great Patriotic War
    ('great-patriotic-war','kurchatov',100,'participant','원자 과학 책임자','Head of atomic science','전쟁 중 시작된 소련 원자폭탄 계획의 과학 책임자였다.','The scientific head of the Soviet atomic-bomb project launched during the war.'),
    ('great-patriotic-war','litvinov',101,'participant','전시 외교관','Wartime diplomat','전시 주미 대사로 연합국 협력의 통로를 열었다.','As wartime ambassador to Washington, he opened a channel for Allied cooperation.'),
    ('great-patriotic-war','lev-mekhlis',102,'participant','군 정치총국장','Army political chief','붉은 군대의 정치총국을 이끈 스탈린의 대리인이었다.','Stalin’s deputy who led the political directorate of the Red Army.'),
    ('great-patriotic-war','akhmatova',103,'witness','포위의 시인','Poet of the siege','레닌그라드 봉쇄를 견디며 전시의 저항을 시로 남긴 시인이었다.','A poet who endured the Leningrad blockade and left wartime resistance in verse.'),
    -- New Economic Policy
    ('new-economic-policy','krzhizhanovsky',100,'participant','전력화·계획 설계자','Architect of electrification and planning','GOELRO 전력화 계획을 이끈 초기 계획의 설계자였다.','The architect of early planning who led the GOELRO electrification scheme.'),
    ('new-economic-policy','alexander-chayanov',101,'participant','농민경제 이론가','Theorist of peasant economy','네프기 소농 경제의 논리를 연구한 농업경제학자였다.','An agrarian economist who studied the logic of the smallholding economy under NEP.'),
    ('new-economic-policy','nikolai-kondratiev',102,'participant','농업경제학자','Agrarian economist','네프기 농업 시장과 경기순환을 연구한 경제학자였다.','An economist who studied agrarian markets and business cycles under NEP.'),
    ('new-economic-policy','bulgakov',103,'witness','네프의 풍자가','Satirist of NEP','네프 시대 모스크바의 모순을 풍자로 기록한 작가였다.','A writer who recorded the contradictions of NEP-era Moscow in satire.'),
    ('new-economic-policy','zamyatin',104,'witness','금지된 미래의 작가','Author of a forbidden future','네프기의 문학 논쟁 속에서 디스토피아 『우리들』을 쓴 작가였다.','A writer who produced the dystopia We amid the literary debates of the NEP years.'),
    -- October Revolution
    ('october-revolution','stasova',100,'participant','당 서기국 실무자','Party secretariat organizer','봉기 전후 당 서기국의 실무를 관리한 조직가였다.','An organizer who managed the party secretariat’s work around the insurrection.'),
    ('october-revolution','rozaliya-zemlyachka',101,'participant','모스크바 봉기 조직가','Organizer of the Moscow rising','지하 암호명 데몬으로 불린 조직가로 모스크바 봉기를 이끌었다.','An organizer known by the underground name Demon who helped lead the Moscow uprising.'),
    -- 1905 Revolution
    ('revolution-1905','pavel-akselrod',100,'participant','멘셰비키 이론가','Menshevik theorist','1905년 혁명기 멘셰비키의 대중정당 노선을 대표한 이론가였다.','A theorist who represented the Menshevik mass-party line during 1905.'),
    ('revolution-1905','vera-zasulich',101,'witness','혁명의 원로','Elder revolutionary','나로드니키에서 마르크스주의로 건너간 원로로 1905년을 지켜봤다.','An elder who crossed from populism to Marxism and witnessed 1905.'),
    ('revolution-1905','maria-spiridonova',102,'participant','사회혁명당 청년','Young SR','1906년 억압적 관리를 처단한 사회혁명당의 젊은 혁명가였다.','A young SR revolutionary who assassinated a repressive official in 1906.'),
    -- Soviet Space Program
    ('soviet-space-program','mikhail-yangel',100,'participant','전략로켓 설계자','Strategic-rocket designer','저장성 추진제 로켓으로 전략로켓군의 척추를 만든 설계자였다.','A designer who built the backbone of the strategic rocket forces with storable-propellant rockets.'),
    ('soviet-space-program','vladimir-chelomey',101,'participant','경쟁 설계국의 설계자','Rival-bureau designer','흐루쇼프의 후원 아래 독자적 미사일·우주 설계국을 이끈 설계자였다.','A designer who led an independent missile and space bureau under Khrushchev’s patronage.'),
    -- USSR Formation
    ('ussr-formation','grigory-petrovsky',100,'participant','우크라이나 소비에트 국가원수','Head of the Ukrainian Soviet state','우크라이나 소비에트 공화국을 대표해 연방 결성에 참여했다.','He represented the Ukrainian Soviet republic in forming the union.'),
    ('ussr-formation','mykola-skrypnyk',101,'participant','우크라이나화 설계자','Architect of Ukrainization','민족문화 권리를 주장하며 연방 구성 논쟁에 참여한 우크라이나 공산주의자였다.','A Ukrainian communist who joined the federation debates arguing for national-cultural rights.'),
    ('ussr-formation','turar-ryskulov',102,'opponent','통합 투르키스탄 주장','Advocate of united Turkestan','통합 투르키스탄을 주장하며 중앙아시아 민족 획정에 맞선 카자흐 볼셰비키였다.','A Kazakh Bolshevik who advocated a unified Turkestan and opposed the national delimitation of Central Asia.'),
    ('ussr-formation','peteris-stucka',103,'participant','라트비아 소비에트 법이론가','Latvian Soviet jurist','라트비아 혁명정부를 이끈 경험으로 소비에트 연방 법질서에 기여했다.','Drawing on his lead of the Latvian revolutionary government, he contributed to the union’s legal order.'),
    ('ussr-formation','mirsaid-sultangaliev',104,'opponent','민족공산주의 비판자','National-communist critic','무슬림 민족공산주의의 관점에서 중앙집권적 연방 구상에 맞섰다.','From the standpoint of Muslim national communism, he resisted the centralizing design of the union.')
) AS v(event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
