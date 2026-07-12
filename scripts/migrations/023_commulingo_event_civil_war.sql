-- CommuLingo history archive: the Civil War and foreign intervention (1918-1922).
-- Covers Brest-Litovsk, the Czechoslovak Legion revolt, the intervention by
-- over a dozen foreign states, the White armies (Kolchak, Denikin, Yudenich,
-- Wrangel), the creation of the Red Army under Trotsky, war communism, Red and
-- White terror, the Polish-Soviet war, Kronstadt, and the costs of victory.
-- Note: the roster contains no dedicated entries for Kolchak, Denikin,
-- Wrangel, Yudenich, Budyonny, or Makhno; they are covered in the timeline
-- text, while linked people use existing roster ids only.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('civil-war', 40, '1918–1922',
     '내전과 열강의 개입', 'The Civil War and Foreign Intervention',
     '포위된 혁명은 어떻게 살아남았고, 그 승리는 무엇을 대가로 치렀는가?',
     'How did a besieged revolution survive, and what price did its victory exact?',
     '1918년부터 1922년까지 소비에트 공화국은 백군 장군들과 십여 개 열강의 개입군에 포위된 채 생존을 건 전쟁을 치렀다. 트로츠키가 조직한 붉은 군대는 500만 명 규모로 성장해 콜차크, 데니킨, 유데니치, 브란겔의 군대를 차례로 격파했고, 노동자와 농민 다수는 지주와 구체제의 복귀보다 소비에트 권력을 선택했다. 그러나 승리의 대가는 참혹했다. 전쟁과 기근, 전염병으로 수백만 명이 목숨을 잃었고, 양측 모두가 자행한 테러와 전시의 비상 통치는 이후 소비에트 국가의 성격에 깊은 흔적을 남겼다.',
     'From 1918 to 1922 the Soviet republic fought for its survival, encircled by White generals and intervention forces from more than a dozen foreign powers. The Red Army that Trotsky organized grew to five million soldiers and defeated the armies of Kolchak, Denikin, Yudenich, and Wrangel in turn, as the majority of workers and peasants preferred Soviet power to the return of the landlords and the old order. Yet victory came at a terrible price: millions died from war, famine, and epidemics, while the terror practiced by both sides and the emergency rule of wartime left deep marks on the character of the Soviet state that followed.',
     '1922년 말 소비에트 권력은 옛 제국 영토 대부분에서 승리했고, 12월에 소비에트 사회주의 공화국 연방이 수립되었다. 그러나 산업 생산은 붕괴하고 도시 인구는 흩어졌으며, 1921~22년 볼가 기근까지 포함하면 인적 손실은 천만 명 안팎으로 추산된다. 크론시타트의 경고 앞에서 당은 전시 공산주의를 버리고 신경제정책으로 전환했지만, 내전에서 단련된 군사적 명령과 비상조치의 통치 문화는 이후 당과 국가의 습속으로 남았다.',
     'By late 1922 Soviet power had prevailed across most of the former empire, and in December the Union of Soviet Socialist Republics was founded. Yet industrial output had collapsed, the cities had emptied, and human losses, including the Volga famine of 1921-22, are estimated at around ten million. Facing the warning of Kronstadt, the party abandoned war communism for the New Economic Policy, but the culture of military command and emergency rule forged in the civil war remained a habit of the party and the state that followed.',
     $$[
  {
    "date":"1918.03.03",
    "title":{"ko":"브레스트-리토프스크 강화 조약","en":"The Treaty of Brest-Litovsk"},
    "body":{"ko":"소비에트 정부는 독일과 가혹한 강화 조약을 맺어 우크라이나와 발트 지역 등 광대한 영토를 내주었다. 격렬한 당내 논쟁 끝에 레닌은 혁명의 생존을 위해 「숨 돌릴 틈」이 필요하다며 조약 수용을 관철했다.","en":"The Soviet government signed a punishing peace with Germany, ceding vast territories including Ukraine and the Baltic region. After fierce debate inside the party, Lenin carried acceptance of the treaty, arguing the revolution needed a breathing space to survive."}
  },
  {
    "date":"1918.03–04",
    "title":{"ko":"트로츠키, 붉은 군대를 세우다","en":"Trotsky builds the Red Army"},
    "body":{"ko":"전쟁인민위원이 된 트로츠키는 자원병 부대를 징집제 정규군으로 개편하고, 구 제국군 장교 수만 명을 군사전문가로 기용하되 정치위원 제도로 통제했다. 그는 장갑열차를 타고 전선을 누비며 규율과 사기를 세웠다.","en":"As People's Commissar for War, Trotsky rebuilt the volunteer detachments into a regular conscript army, employing tens of thousands of former imperial officers as military specialists under the watch of political commissars. From his armored train he crisscrossed the fronts, imposing discipline and raising morale."}
  },
  {
    "date":"1918.05",
    "title":{"ko":"체코슬로바키아 군단의 반란","en":"Revolt of the Czechoslovak Legion"},
    "body":{"ko":"시베리아 횡단 철도를 따라 블라디보스토크로 이동하던 4만여 명의 체코슬로바키아 군단이 봉기해 볼가에서 태평양에 이르는 철도 연선의 소비에트 권력을 무너뜨렸다. 산발적이던 내전은 이때부터 전면전으로 확대되었다.","en":"Some forty thousand soldiers of the Czechoslovak Legion, traveling along the Trans-Siberian Railway toward Vladivostok, rose in revolt and toppled Soviet power along the railway from the Volga to the Pacific. From this point the scattered civil war widened into full-scale war."}
  },
  {
    "date":"1918.03–08",
    "title":{"ko":"열강의 개입","en":"The powers intervene"},
    "body":{"ko":"영국, 프랑스, 미국, 일본을 비롯한 십여 개 국가가 무르만스크, 아르한겔스크, 블라디보스토크, 오데사 등지에 병력을 상륙시키고 백군에 무기와 자금을 지원했다. 소비에트 공화국은 당대 최강 열강들의 봉쇄와 침공에 동시에 맞서야 했다.","en":"More than a dozen states, including Britain, France, the United States, and Japan, landed troops at Murmansk, Arkhangelsk, Vladivostok, Odessa, and elsewhere, and supplied the White armies with weapons and money. The Soviet republic faced blockade and invasion by the greatest powers of the age at once."}
  },
  {
    "date":"1918.09.05",
    "title":{"ko":"테러의 시대: 적색과 백색","en":"The age of terror, Red and White"},
    "body":{"ko":"8월 30일 레닌 암살 미수와 페트로그라드 체카 의장 우리츠키 암살 뒤, 인민위원회는 적색 테러를 공식 포고했고 체카는 인질 처형과 대량 체포를 집행했다. 같은 시기 백군 점령지에서도 노동자, 공산주의자, 유대인에 대한 백색 테러와 포그롬이 자행되어, 폭력은 내전 양측 모두의 무기가 되었다.","en":"After the attempt on Lenin's life on August 30 and the assassination of Petrograd Cheka chief Uritsky, Sovnarkom formally proclaimed the Red Terror, and the Cheka carried out hostage executions and mass arrests. In the same period White-held territories saw their own terror and pogroms against workers, communists, and Jews: violence became a weapon of both sides of the civil war."}
  },
  {
    "date":"1918–1920",
    "title":{"ko":"전시 공산주의","en":"War communism"},
    "body":{"ko":"국가는 산업을 국유화하고 사적 상업을 금지했으며, 무장 징발대를 보내 농민의 곡물을 강제 할당제로 거두었다. 도시와 군대는 이것으로 버텼으나 농민의 불만은 깊어 갔고, 화폐 경제는 사실상 붕괴했다.","en":"The state nationalized industry, banned private trade, and sent armed detachments to requisition grain from the peasants under compulsory quotas. Cities and the army survived on this system, but peasant resentment deepened and the money economy effectively collapsed."}
  },
  {
    "date":"1918.11.18",
    "title":{"ko":"콜차크, 「최고 통치자」가 되다","en":"Kolchak becomes Supreme Ruler"},
    "body":{"ko":"옴스크에서 쿠데타로 사회혁명당 계열 임시정부가 무너지고 해군제독 알렉산드르 콜차크가 「최고 통치자」로 추대되었다. 백군 운동은 군사 독재로 수렴했고, 점령지의 농민 징발과 처벌 원정은 민심을 소비에트 쪽으로 밀어냈다.","en":"A coup in Omsk toppled the SR-led provisional government there and installed Admiral Alexander Kolchak as Supreme Ruler. The White movement converged on military dictatorship, and its requisitions and punitive expeditions in the countryside pushed the peasantry toward the Soviets."}
  },
  {
    "date":"1919.03–06",
    "title":{"ko":"동부전선의 반격","en":"The counteroffensive in the east"},
    "body":{"ko":"콜차크의 춘계 공세가 볼가에 접근했으나, 프룬제가 지휘한 남부집단군과 투하쳅스키의 제5군이 반격해 우파를 탈환하고 백군을 우랄 너머로 밀어냈다. 이후 콜차크군은 시베리아를 가로질러 붕괴를 거듭했다.","en":"Kolchak's spring offensive approached the Volga, but the Southern Group under Frunze and Tukhachevsky's Fifth Army counterattacked, retook Ufa, and drove the Whites back beyond the Urals. Kolchak's army then disintegrated in stages across Siberia."}
  },
  {
    "date":"1919.10",
    "title":{"ko":"위기의 정점: 오룔과 페트로그라드","en":"The peak of the crisis: Oryol and Petrograd"},
    "body":{"ko":"데니킨의 남러시아군이 모스크바를 향해 오룔까지 진격하고 유데니치가 페트로그라드 교외에 이르렀으나, 붉은 군대는 두 공세를 모두 꺾었다. 이 반격이 내전의 결정적 전환점이 되었고 데니킨군은 이듬해 봄까지 흑해 연안으로 밀려났다.","en":"Denikin's Armed Forces of South Russia drove toward Moscow as far as Oryol, and Yudenich reached the outskirts of Petrograd, but the Red Army broke both offensives. This counterblow proved the decisive turning point, and by the following spring Denikin's forces had been pushed back to the Black Sea coast."}
  },
  {
    "date":"1920.02.07",
    "title":{"ko":"콜차크의 최후와 개입의 퇴조","en":"The end of Kolchak and the ebb of intervention"},
    "body":{"ko":"이르쿠츠크에서 붙잡힌 콜차크가 처형되었다. 자국 내 반전 여론과 병사들의 동요, 백군의 패색 속에 영국과 프랑스 등 개입국들은 병력을 차례로 철수시켰다.","en":"Kolchak, captured at Irkutsk, was executed. Amid antiwar sentiment at home, restive troops, and the failing White cause, Britain, France, and the other intervening powers withdrew their forces one after another."}
  },
  {
    "date":"1920.04–10",
    "title":{"ko":"폴란드-소비에트 전쟁","en":"The Polish-Soviet war"},
    "body":{"ko":"피우수트스키의 폴란드군이 키예프를 점령하자 붉은 군대가 반격했고, 투하쳅스키의 서부전선군은 바르샤바 앞까지 진격했으나 8월 비스와강에서 결정적으로 패퇴했다. 10월 휴전에 이어 1921년 3월 리가 조약으로 국경이 확정되었고, 혁명을 서유럽으로 이어 가려던 기대는 꺾였다.","en":"When Pilsudski's Polish army seized Kiev, the Red Army counterattacked, and Tukhachevsky's Western Front advanced to the gates of Warsaw before suffering decisive defeat on the Vistula in August. An armistice in October and the Treaty of Riga in March 1921 fixed the border, ending hopes of carrying the revolution westward."}
  },
  {
    "date":"1920.11",
    "title":{"ko":"페레코프 돌파와 크림 철수","en":"Perekop stormed, Crimea evacuated"},
    "body":{"ko":"프룬제가 지휘하는 남부전선군이 페레코프 지협의 요새선을 돌파하자, 브란겔은 군대와 민간인 약 15만 명을 배에 태워 크림에서 철수시켰다. 유럽 러시아에서 조직된 백군의 저항은 이것으로 끝났다.","en":"When the Southern Front under Frunze stormed the fortified lines of the Perekop isthmus, Wrangel evacuated roughly 150,000 soldiers and civilians from Crimea by sea. Organized White resistance in European Russia was over."}
  },
  {
    "date":"1921.03",
    "title":{"ko":"크론시타트의 비극","en":"The tragedy of Kronstadt"},
    "body":{"ko":"한때 혁명의 자랑이던 크론시타트 요새의 수병들이 「당 없는 소비에트」를 내걸고 봉기했고, 붉은 군대는 얼어붙은 만을 건너 요새를 진압했다. 혁명이 제 지지자들에게 총을 겨눈 이 비극적 종막과 때를 같이해, 제10차 당대회는 곡물 징발을 현물세로 바꾸는 신경제정책으로의 전환을 결정했다.","en":"The sailors of the Kronstadt fortress, once the pride of the revolution, rose under the slogan of soviets without parties, and the Red Army suppressed the rising across the frozen bay. In the same days as this tragic coda, in which the revolution turned its guns on its own supporters, the Tenth Party Congress voted to replace grain requisitioning with a tax in kind, opening the New Economic Policy."}
  },
  {
    "date":"1922.10.25",
    "title":{"ko":"블라디보스토크와 내전의 종결","en":"Vladivostok and the end of the civil war"},
    "body":{"ko":"일본군이 철수한 블라디보스토크에 인민혁명군이 입성하면서 내전과 개입은 사실상 막을 내렸다. 두 달 뒤 소비에트 사회주의 공화국 연방이 수립되었다.","en":"The People's Revolutionary Army entered Vladivostok after the Japanese withdrawal, effectively ending the civil war and the intervention. Two months later the Union of Soviet Socialist Republics was founded."}
  }
]$$::jsonb,
     $$[
  "Evan Mawdsley, The Russian Civil War (Birlinn, 2008)",
  "W. Bruce Lincoln, Red Victory: A History of the Russian Civil War (Simon and Schuster, 1989)",
  "Jonathan D. Smele, The Russian Civil Wars, 1916–1926: Ten Years That Shook the World (Oxford University Press, 2015)",
  "Stephen Kotkin, Stalin, vol. 1: Paradoxes of Power, 1878–1928 (Penguin, 2014)",
  "Sheila Fitzpatrick, The Russian Revolution (Oxford University Press, 4th ed., 2017)",
  "https://en.wikisource.org/wiki/Peace_Treaty_of_Brest-Litovsk",
  "https://www.marxists.org/archive/trotsky/1920/terrcomm/index.htm"
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
SELECT 'civil-war', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('trotsky', 0, 'leader', '적군 창설자', 'Red Army founder',
     '전쟁인민위원으로 붉은 군대를 창설하고 장갑열차로 전선을 오가며 전쟁 수행을 지휘했다.',
     'As People''s Commissar for War he built the Red Army and directed the war effort from his armored train across the fronts.'),
    ('lenin', 1, 'leader', '전쟁 지도부', 'War leadership',
     '브레스트 강화를 관철해 혁명의 생존을 확보하고, 노농국방회의를 통해 전쟁 수행 전체를 총괄했다.',
     'He carried the Brest-Litovsk peace to secure the revolution''s survival and oversaw the whole war effort through the Council of Labor and Defense.'),
    ('frunze', 2, 'participant', '적군 사령관', 'Red Army commander',
     '동부전선에서 콜차크군을 격파했고 1920년 남부전선 사령관으로 페레코프를 돌파해 브란겔을 크림에서 몰아냈다.',
     'He broke Kolchak''s forces on the Eastern Front and, commanding the Southern Front in 1920, stormed Perekop and drove Wrangel from Crimea.'),
    ('tukhachevsky', 3, 'participant', '적군 사령관', 'Red Army commander',
     '제5군으로 콜차크를 추격했고 서부전선군을 이끌고 바르샤바로 진격했으며 1921년 크론시타트 진압을 지휘했다.',
     'He pursued Kolchak with the Fifth Army, led the Western Front toward Warsaw, and commanded the suppression of Kronstadt in 1921.'),
    ('stalin', 4, 'participant', '전선 정치위원', 'Front commissar',
     '차리친 방어와 남서전선에서 정치위원으로 활동했으며, 이 시기 군사 지도부와 빚은 갈등은 이후 당내 대립의 씨앗이 되었다.',
     'He served as a political commissar in the defense of Tsaritsyn and on the Southwestern Front; his wartime clashes with the military leadership sowed later conflicts inside the party.'),
    ('voroshilov', 5, 'participant', '차리친의 지휘관', 'Tsaritsyn commander',
     '차리친 방어전을 지휘하고 부됸니의 제1기병군에서 정치 지도를 맡아 남부 전선을 누볐다.',
     'He commanded in the defense of Tsaritsyn and served as political leader of Budyonny''s First Cavalry Army across the southern fronts.'),
    ('dzerzhinsky', 6, 'executor', '체카 의장', 'Cheka chairman',
     '반혁명과 사보타주에 맞서는 비상위원회를 이끌며 후방을 통제했고 적색 테러의 집행을 지휘했다.',
     'He led the Extraordinary Commission against counterrevolution and sabotage, controlling the rear and directing the implementation of the Red Terror.'),
    ('sverdlov', 7, 'participant', '국가 조직자', 'State organizer',
     '전러시아 중앙집행위원회 의장으로 전시 소비에트 국가기구를 조직하다 1919년 3월 급서했다.',
     'As chairman of the All-Russian Central Executive Committee he organized the wartime Soviet state until his sudden death in March 1919.'),
    ('chicherin', 8, 'participant', '외교 인민위원', 'Foreign affairs commissar',
     '브레스트-리토프스크 조약에 서명하고 봉쇄와 개입 속에서 소비에트 외교를 이끌었다.',
     'He signed the Treaty of Brest-Litovsk and led Soviet diplomacy through blockade and intervention.'),
    ('antonov-ovseenko', 9, 'participant', '우크라이나 전선 사령관', 'Ukraine front commander',
     '1918~19년 우크라이나에서 소비에트군을 지휘해 독일 점령군 철수 후의 권력 수립을 이끌었다.',
     'He commanded Soviet forces in Ukraine in 1918-19, establishing Soviet power after the German occupation withdrew.'),
    ('rakovsky', 10, 'participant', '우크라이나 정부 수반', 'Head of Ukrainian government',
     '우크라이나 소비에트 공화국 인민위원회의 의장으로 내전기 우크라이나의 소비에트 권력을 이끌었다.',
     'As chairman of the Ukrainian Soviet republic''s Council of People''s Commissars, he led Soviet power in Ukraine through the civil war.'),
    ('smilga', 11, 'participant', '군 정치위원', 'Military commissar',
     '공화국 혁명군사회의 위원으로 여러 전선의 정치위원을 지냈고 폴란드 전쟁에서 서부전선군에 배속되었다.',
     'A member of the republic''s Revolutionary Military Council, he served as political commissar on several fronts, including the Western Front in the Polish war.'),
    ('kornilov', 12, 'opponent', '백군 창설자', 'White Army founder',
     '돈 지방에서 의용군을 조직해 남부의 반소비에트 무장투쟁을 시작했고, 1918년 4월 예카테리노다르 공격 중 전사했다.',
     'He organized the Volunteer Army in the Don region, opening the armed anti-Soviet struggle in the south, and was killed in April 1918 during the assault on Ekaterinodar.'),
    ('kerensky', 13, 'opponent', '반소비에트 망명 정객', 'Anti-Soviet emigre politician',
     '10월 봉기 직후 크라스노프의 카자크 부대와 함께 페트로그라드 탈환을 시도했다가 실패했고, 이후 망명지에서 열강의 개입을 호소했다.',
     'Immediately after the October rising he tried and failed to retake Petrograd with Krasnov''s Cossacks, then campaigned from exile for foreign intervention.'),
    ('babel', 14, 'witness', '종군 작가', 'War correspondent writer',
     '1920년 폴란드 전쟁에서 부됸니의 제1기병군에 종군했고, 그 경험을 단편집 「기병대」로 남겼다.',
     'He rode with Budyonny''s First Cavalry Army in the 1920 Polish war and turned the experience into the stories of Red Cavalry.'),
    ('marina-tsvetaeva', 15, 'witness', '내전기의 시인', 'Poet of the civil war',
     '남편이 백군에 복무하는 동안 궁핍한 모스크바에서 내전의 세월을 시로 기록했다.',
     'While her husband served with the Whites, she recorded the civil war years in verse from an impoverished Moscow.'),
    ('sholokhov', 16, 'witness', '돈 지방의 연대기 작가', 'Chronicler of the Don',
     '돈 카자크 지역을 휩쓴 내전의 비극을 장편 「고요한 돈강」으로 형상화했다.',
     'He gave the tragedy of the civil war in the Don Cossack lands its epic form in And Quiet Flows the Don.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
