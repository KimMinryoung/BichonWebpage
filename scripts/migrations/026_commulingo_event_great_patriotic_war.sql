-- CommuLingo history archive: the Great Patriotic War (1941-1945).
-- Covers Barbarossa and the catastrophe of 1941, the eastward evacuation of
-- industry, Moscow, the siege of Leningrad, Stalingrad, Kursk, the partisan
-- war, Bagration, the liberation of Auschwitz, Berlin, and the human cost.
-- Figures follow post-archive scholarship (Glantz & House, Harrison,
-- Krivosheev, Overy, Hellbeck).

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('great-patriotic-war', 80, '1941–1945',
     '대조국전쟁', 'The Great Patriotic War',
     '소비에트 인민은 어떻게 파시즘의 전쟁 기계를 분쇄했으며, 그 승리의 대가는 무엇이었는가?',
     'How did the Soviet people destroy the war machine of fascism, and what was the price of victory?',
     '1941년 6월 나치 독일의 기습 침공으로 시작된 대조국전쟁은 인류 역사상 최대 규모의 지상전이었다. 소련은 개전 첫 해의 파국적 손실을 딛고 공업 기반을 통째로 동쪽으로 옮겨 재무장했으며, 모스크바와 스탈린그라드, 쿠르스크에서 전세를 뒤집고 1945년 베를린까지 진격해 나치 독일을 무너뜨렸다. 독일 국방군 지상 전투력의 약 80%가 동부전선에서 소모되었고, 파시즘 격파의 압도적 부담을 짊어진 것은 다민족 소비에트 인민이었다.',
     'The Great Patriotic War, opened by Nazi Germany with a surprise invasion in June 1941, was the largest land war in human history. Recovering from the catastrophic losses of the first year, the Soviet Union moved its industrial base bodily eastward and rearmed, reversed the tide at Moscow, Stalingrad, and Kursk, and drove on to Berlin in 1945 to bring down Nazi Germany. Roughly 80 percent of the ground combat power of the Wehrmacht was destroyed on the Eastern Front, and it was the multinational Soviet people who bore the overwhelming burden of defeating fascism.',
     '승리의 대가는 약 2,700만 명의 소련 인민의 목숨이었다. 계획경제는 국토의 서부를 잃고도 독일보다 많은 전차와 항공기를 생산해 그 동원 능력을 입증했고, 붉은 군대는 아우슈비츠를 해방하고 유럽 절멸 체제의 심장을 멈춰 세웠다. 이 전쟁은 소련을 초강대국으로 만들었으며, 파시즘에 대한 승리는 이후 소비에트 사회의 가장 깊은 공동 기억으로 남았다.',
     'The price of victory was the lives of some 27 million Soviet people. The planned economy proved its powers of mobilization by outproducing Germany in tanks and aircraft even after losing the western part of the country, and the Red Army liberated Auschwitz and stopped the heart of the European machinery of extermination. The war made the Soviet Union a superpower, and the victory over fascism remained the deepest shared memory of Soviet society thereafter.',
     $$[
  {
    "date":"1941.06.22",
    "title":{"ko":"바르바로사 작전: 기습 침공","en":"Operation Barbarossa: the surprise invasion"},
    "body":{"ko":"독일과 그 동맹국들이 300만 명이 넘는 병력으로 발트해에서 흑해에 이르는 전선에서 소련을 침공했다. 몰로토프가 정오의 라디오 연설에서 「우리의 대의는 정의롭다. 적은 분쇄될 것이다. 승리는 우리의 것이다」라고 선언했다.","en":"Germany and its allies invaded the Soviet Union with more than three million troops along a front stretching from the Baltic to the Black Sea. In a radio address at noon, Molotov declared: our cause is just, the enemy will be crushed, victory will be ours."}
  },
  {
    "date":"1941.06–12",
    "title":{"ko":"파국의 여름과 공업의 동방 소개","en":"The catastrophic summer and the eastward evacuation of industry"},
    "body":{"ko":"개전 첫 몇 달 동안 붉은 군대는 수백만 명의 사상자와 포로를 내며 후퇴했다. 그 와중에 슈베르니크가 이끄는 소개위원회는 1941년 말까지 1,500여 개의 대공장과 1,000만 명이 넘는 사람을 우랄, 시베리아, 중앙아시아로 옮겼다. 철도로 나라의 공업 기반을 통째로 이동시킨 이 소개는 전쟁사에서 유례없는 위업으로 꼽힌다.","en":"In the first months the Red Army fell back with millions of casualties and prisoners. Amid the retreat, the Evacuation Council under Shvernik moved some 1,500 large enterprises and more than ten million people to the Urals, Siberia, and Central Asia by the end of 1941. This wholesale relocation of a country's industrial base by rail is counted among the unmatched feats of the war."}
  },
  {
    "date":"1941.09.08",
    "title":{"ko":"레닌그라드 포위의 시작","en":"The siege of Leningrad begins"},
    "body":{"ko":"독일군이 슐리셀부르크를 점령하면서 872일에 걸친 레닌그라드 봉쇄가 시작됐다. 즈다노프가 이끄는 당 조직과 시민들은 기아와 포격 속에서 도시를 지켰고, 라도가 호수의 얼음길 「생명의 길」이 유일한 보급선이 됐다. 봉쇄로 최소 80만 명의 민간인이 목숨을 잃었다.","en":"With the German capture of Shlisselburg, the 872-day blockade of Leningrad began. The party organization under Zhdanov and the citizens held the city through starvation and shelling, supplied only by the ice road across Lake Ladoga, the Road of Life. At least 800,000 civilians died in the siege."}
  },
  {
    "date":"1941.09–10",
    "title":{"ko":"조르게의 정보와 시베리아 사단","en":"Sorge's intelligence and the Siberian divisions"},
    "body":{"ko":"도쿄의 소련 정보원 리하르트 조르게는 일본이 소련이 아니라 남방을 공격할 것이라고 보고했다. 이 정보는 극동의 정예 사단들을 모스크바 방어전으로 이동시키는 결정을 뒷받침했다.","en":"Richard Sorge, the Soviet intelligence officer in Tokyo, reported that Japan would strike south rather than against the Soviet Union. His reporting underpinned the decision to transfer fresh Far Eastern divisions to the defense of Moscow."}
  },
  {
    "date":"1941.12.05",
    "title":{"ko":"모스크바 반격","en":"The Moscow counteroffensive"},
    "body":{"ko":"주코프가 지휘한 소련군의 반격이 수도 문턱에서 독일군을 100~250km 밀어냈다. 나치 독일 지상군이 당한 최초의 대규모 패배였으며, 전격전 불패의 신화가 여기서 깨졌다.","en":"The Soviet counteroffensive directed by Zhukov threw the Germans back 100 to 250 kilometers from the gates of the capital. It was the first major defeat inflicted on the Nazi ground forces, and the myth of the invincible blitzkrieg broke here."}
  },
  {
    "date":"1942.07–11",
    "title":{"ko":"스탈린그라드 방어전","en":"The defense of Stalingrad"},
    "body":{"ko":"독일군의 하계 공세가 볼가 강까지 도달하자 「한 걸음도 물러서지 마라」는 명령 제227호가 내려졌다. 추이코프의 제62군은 폐허가 된 도시에서 건물 하나, 층계 하나를 두고 싸우며 강안의 좁은 교두보를 끝내 지켜냈다.","en":"As the German summer offensive reached the Volga, Order No. 227, Not One Step Back, was issued. Chuikov's 62nd Army fought building by building and staircase by staircase in the ruined city, holding a narrow bridgehead on the river bank to the end."}
  },
  {
    "date":"1942–1943",
    "title":{"ko":"계획경제, 독일을 앞지르다","en":"The planned economy outproduces Germany"},
    "body":{"ko":"국토 서부의 공업지대를 잃고도 소련은 1942년 한 해에만 전차 약 2만 4천 대를 생산해 독일을 크게 앞질렀고, 항공기와 화포에서도 우위를 굳혔다. 우랄로 옮겨진 공장들과 여성·청소년이 대거 투입된 후방 노동이 이 역전을 만들어냈다.","en":"Despite losing the industrial regions of the west, the Soviet Union built some 24,000 tanks in 1942 alone, far outstripping Germany, and secured superiority in aircraft and artillery as well. The relocated factories in the Urals and a home-front workforce drawing heavily on women and youth produced this reversal."}
  },
  {
    "date":"1942.11.19",
    "title":{"ko":"우라누스 작전: 포위","en":"Operation Uranus: the encirclement"},
    "body":{"ko":"바실렙스키와 주코프가 입안한 반격이 스탈린그라드 양익의 추축군 전선을 돌파해 독일 제6군 전체를 포위했다. 소련군이 전략적 주도권을 쥐는 전환이 시작됐다.","en":"The counteroffensive planned by Vasilevsky and Zhukov broke through the Axis flanks on either side of Stalingrad and encircled the entire German Sixth Army. The shift of strategic initiative to the Red Army had begun."}
  },
  {
    "date":"1943.02.02",
    "title":{"ko":"스탈린그라드의 승리","en":"Victory at Stalingrad"},
    "body":{"ko":"포위된 독일 제6군이 항복하고 파울루스 원수를 포함한 약 9만 1천 명이 포로가 됐다. 스탈린그라드는 제2차 세계대전 전체의 전환점으로, 세계에 파시즘이 격파될 수 있음을 보여 주었다.","en":"The encircled Sixth Army capitulated, and about 91,000 men, including Field Marshal Paulus, were taken prisoner. Stalingrad was the turning point of the Second World War as a whole, showing the world that fascism could be beaten."}
  },
  {
    "date":"1943.07–08",
    "title":{"ko":"쿠르스크: 마지막 독일 공세의 분쇄","en":"Kursk: the last German offensive broken"},
    "body":{"ko":"쿠르스크 돌출부에서 사상 최대 규모의 기갑전이 벌어졌다. 종심 방어로 독일군의 공세를 소진시킨 소련군은 즉시 반격으로 전환했고, 이후 종전까지 전략적 주도권은 단 한 번도 독일로 돌아가지 않았다.","en":"The largest armored battles in history were fought on the Kursk salient. Having exhausted the German offensive in deep defensive belts, the Red Army passed immediately to the counterattack, and strategic initiative never returned to Germany for the rest of the war."}
  },
  {
    "date":"1943.08–09",
    "title":{"ko":"파르티잔 전쟁과 레일 전쟁","en":"The partisan war and the war on the rails"},
    "body":{"ko":"점령지에서는 수십만 명의 파르티잔이 싸우고 있었고, 1943년 여름 「레일 전쟁」과 「콘체르트」 작전으로 독일군 후방의 철도망을 조직적으로 파괴했다. 러시아인, 벨로루시인, 우크라이나인, 유대인 등 여러 민족이 함께 싸운 이 저항은 점령 체제를 안에서부터 갉아먹었다.","en":"Hundreds of thousands of partisans were fighting in the occupied territories, and in the summer of 1943 the Rail War and Concert operations systematically wrecked the railway network in the German rear. This resistance, fought jointly by Russians, Belorussians, Ukrainians, Jews, and many other peoples, ate away at the occupation from within."}
  },
  {
    "date":"1944.06.22",
    "title":{"ko":"바그라티온 작전","en":"Operation Bagration"},
    "body":{"ko":"침공 3주년이 되는 날 개시된 공세가 독일 중부집단군을 궤멸시키고 벨로루시를 해방했다. 몇 주 만에 28개 사단 규모의 독일군이 소멸한 이 작전은 독일 국방군이 동부전선에서 입은 최대의 패배였다.","en":"Launched three years to the day after the invasion, the offensive destroyed Army Group Centre and liberated Belorussia. With some 28 German divisions effectively wiped out within weeks, it was the greatest single defeat the Wehrmacht suffered on the Eastern Front."}
  },
  {
    "date":"1945.01.27",
    "title":{"ko":"붉은 군대, 아우슈비츠를 해방하다","en":"The Red Army liberates Auschwitz"},
    "body":{"ko":"제1우크라이나전선군 제60군이 아우슈비츠 수용소군을 해방해 남아 있던 약 7,000명의 수감자를 구했다. 소련 종군기자 바실리 그로스만이 앞서 쓴 「트레블린카의 지옥」과 함께, 절멸 수용소의 실상을 세계에 알린 최초의 증언들이 붉은 군대의 진격로에서 나왔다.","en":"The 60th Army of the 1st Ukrainian Front liberated the Auschwitz camp complex, saving about 7,000 remaining prisoners. Together with the earlier report The Hell of Treblinka by the Soviet war correspondent Vasily Grossman, the first testimony revealing the reality of the extermination camps came from the Red Army's line of advance."}
  },
  {
    "date":"1945.04.16–05.09",
    "title":{"ko":"베를린과 승리, 그리고 2,700만 명","en":"Berlin, victory, and the 27 million"},
    "body":{"ko":"주코프와 코네프의 전선군이 베를린을 포위해 함락시켰고, 5월 1일 국회의사당 위에 승리의 깃발이 올랐다. 5월 8일 밤 카를스호르스트에서 주코프가 독일의 무조건 항복 문서를 접수했다. 승리의 대가는 약 2,700만 명의 소련 인민의 목숨이었고, 독일 국방군 손실의 약 80%가 동부전선에서 발생했다.","en":"The fronts of Zhukov and Konev encircled and took Berlin, and on 1 May the banner of victory rose over the Reichstag. On the night of 8 May at Karlshorst, Zhukov accepted the instrument of Germany's unconditional surrender. The price of victory was some 27 million Soviet lives, and roughly 80 percent of the Wehrmacht's losses were inflicted on the Eastern Front."}
  }
]$$::jsonb,
     $$[
  "David M. Glantz and Jonathan House, When Titans Clashed: How the Red Army Stopped Hitler (1995)",
  "Richard Overy, Russia's War (1997)",
  "Evan Mawdsley, Thunder in the East: The Nazi-Soviet War, 1941–1945 (2005)",
  "Mark Harrison, Accounting for War: Soviet Production, Employment, and the Defence Burden, 1940–1945 (1996)",
  "Jochen Hellbeck, Stalingrad: The City that Defeated the Third Reich (2015)",
  "Vasily Grossman, A Writer at War: Vasily Grossman with the Red Army 1941–1945, ed. Antony Beevor and Luba Vinogradova (2005)",
  "G. F. Krivosheev (ed.), Soviet Casualties and Combat Losses in the Twentieth Century (1997)",
  "https://encyclopedia.ushmm.org/content/en/article/liberation-of-auschwitz"
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
SELECT 'great-patriotic-war', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('stalin', 0, 'leader', '최고사령관', 'Supreme Commander',
     '국가방위위원회 의장이자 최고사령관으로 전쟁 지도부 전체를 총괄했다.',
     'As chairman of the State Defense Committee and Supreme Commander, he directed the entire wartime leadership.'),
    ('zhukov', 1, 'leader', '부최고사령관', 'Deputy Supreme Commander',
     '모스크바 방어전과 스탈린그라드·베를린 작전을 지휘·조율했고, 카를스호르스트에서 독일의 항복 문서를 접수했다.',
     'He directed and coordinated the defense of Moscow and the Stalingrad and Berlin operations, and accepted the German surrender at Karlshorst.'),
    ('vasilevsky', 2, 'leader', '총참모장', 'Chief of the General Staff',
     '총참모장으로 우라누스 작전과 바그라티온 작전 등 주요 전략 공세를 입안했다.',
     'As Chief of the General Staff he planned the major strategic offensives, including Operations Uranus and Bagration.'),
    ('molotov', 3, 'leader', '국가방위위원회 부의장', 'GKO deputy chairman',
     '6월 22일 개전을 인민에게 알린 라디오 연설을 했고, 외무인민위원으로 반파시즘 연합 외교를 이끌었다.',
     'He announced the outbreak of war to the people in the radio address of 22 June and, as foreign commissar, led the diplomacy of the anti-fascist coalition.'),
    ('chuikov', 4, 'participant', '제62군 사령관', '62nd Army commander',
     '스탈린그라드 시가전에서 제62군을 지휘해 도시를 지켰고, 1945년 베를린 수비대의 항복을 받았다.',
     'He commanded the 62nd Army in the street fighting that held Stalingrad, and in 1945 received the surrender of the Berlin garrison.'),
    ('timoshenko', 5, 'participant', '개전기 국방인민위원', 'Defense commissar in 1941',
     '개전 당시 국방인민위원으로 1941~42년 서부·남서 방면의 방어전을 지휘했다.',
     'Defense commissar at the outbreak of war, he commanded the defensive battles on the western and southwestern axes in 1941 and 1942.'),
    ('voroshilov', 6, 'participant', '국가방위위원회 위원', 'GKO member',
     '국가방위위원회 위원으로 개전 초 레닌그라드 방면을 지휘했고 파르티잔 운동의 조직에도 관여했다.',
     'A member of the State Defense Committee, he commanded the Leningrad axis early in the war and took part in organizing the partisan movement.'),
    ('zhdanov', 7, 'participant', '레닌그라드 당 지도자', 'Leningrad party leader',
     '872일의 봉쇄 기간 내내 레닌그라드의 당 조직과 방어를 이끌었다.',
     'He led the party organization and defense of Leningrad throughout the 872-day blockade.'),
    ('shvernik', 8, 'participant', '소개위원회 의장', 'Evacuation Council chairman',
     '소개위원회 의장으로 1,500여 개 대공장과 1,000만 명이 넘는 인원의 동방 이동을 지휘했다.',
     'As chairman of the Evacuation Council he directed the eastward movement of some 1,500 large enterprises and more than ten million people.'),
    ('voznesensky', 9, 'participant', '고스플란 의장', 'Gosplan chairman',
     '고스플란 의장으로 전시 계획경제를 운용해 독일을 앞지르는 군수 생산을 조직했다.',
     'As Gosplan chairman he ran the wartime planned economy, organizing the munitions production that outstripped Germany.'),
    ('mikoyan', 10, 'participant', '보급 총책', 'Supply chief',
     '붉은 군대의 식량·연료·피복 보급과 연합국 원조 물자의 수용을 총괄했다.',
     'He oversaw the food, fuel, and clothing supply of the Red Army and the reception of Allied aid deliveries.'),
    ('kaganovich', 11, 'participant', '철도인민위원', 'Railways commissar',
     '전시 철도를 운영해 공업 소개와 전선 보급의 수송을 떠받쳤다.',
     'He ran the wartime railways that carried the industrial evacuation and the supply of the fronts.'),
    ('malyshev', 12, 'participant', '전차공업 인민위원', 'Tank industry commissar',
     '전차공업 인민위원으로 우랄의 「탄코그라드」에서 T-34의 대량생산을 조직했다.',
     'As tank industry commissar he organized the mass production of the T-34 at Tankograd in the Urals.'),
    ('khrushchev', 13, 'participant', '전선 군사평의회 위원', 'Front military council member',
     '스탈린그라드 전선 군사평의회 위원으로 방어전과 반격에 참여했다.',
     'As a member of the Stalingrad Front military council he took part in the defense and the counteroffensive.'),
    ('malinovsky', 14, 'participant', '전선 사령관', 'Front commander',
     '스탈린그라드 반격에서 구원 시도를 저지했고, 이후 전선군 사령관으로 우크라이나 해방과 부다페스트 점령을 지휘했다.',
     'He blocked the German relief attempt in the Stalingrad counteroffensive and, as a front commander, led the liberation of Ukraine and the taking of Budapest.'),
    ('sorge', 15, 'witness', '정보 장교', 'Intelligence officer',
     '도쿄에서 바르바로사 침공과 일본의 남진 방침을 보고해 시베리아 사단의 서부 전용을 가능하게 했다.',
     'From Tokyo he reported the coming Barbarossa invasion and Japan''s decision to strike south, enabling the transfer of Siberian divisions westward.'),
    ('vasily-grossman', 16, 'witness', '종군기자', 'War correspondent',
     '스탈린그라드에서 종군하며 전투를 기록했고, 「트레블린카의 지옥」으로 절멸 수용소의 실상을 처음 세계에 알렸다.',
     'He reported from Stalingrad through the battle, and with The Hell of Treblinka gave the world its first account of an extermination camp.'),
    ('ilya-ehrenburg', 17, 'witness', '전시 논설가', 'Wartime publicist',
     '「크라스나야 즈베즈다」의 논설로 전선과 후방의 항전 의지를 벼린 전시의 대표적 문필가였다.',
     'The emblematic writer of the war years, his articles in Krasnaya Zvezda steeled the will to resist at the front and in the rear.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
