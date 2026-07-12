-- 022: History event "The October Revolution" (october-revolution).
-- Covers the Kornilov aftermath and Bolshevization of the soviets, the Lenin
-- letters urging insurrection, the Military Revolutionary Committee, the
-- 7 November (25 October OS) seizure of power, the Second Congress of Soviets,
-- the Decrees on Peace and Land, Sovnarkom, the early social legislation, and
-- the dissolution of the Constituent Assembly in January 1918.
-- Dates are Gregorian (New Style); Julian dates are marked 구력/Old Style.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('october-revolution', 30, '1917.10–1918.01',
     '10월 혁명', 'The October Revolution',
     '10월 혁명은 어떻게 소비에트의 이름으로 권력을 장악했고, 첫 법령들로 무엇을 바꾸었는가?',
     'How did the October Revolution take power in the name of the soviets, and what did its first decrees change?',
     '1917년 가을 코르닐로프 반란이 좌절된 뒤 페트로그라드와 모스크바 소비에트에서 볼셰비키가 다수파가 되었고, 트로츠키가 이끄는 군사혁명위원회가 수도 수비대의 충성을 확보했다. 11월 7일(구력 10월 25일)의 봉기는 페트로그라드에서 거의 유혈 없이 수도를 장악했으며, 같은 날 밤 개회한 제2차 전러시아 소비에트 대회가 권력 이양을 승인했다. 대회는 즉시 평화에 관한 법령과 토지에 관한 법령을 채택하고, 레닌을 수반으로 하는 인민위원회의(소브나르콤)를 구성했다.',
     'After the defeat of the Kornilov revolt in autumn 1917, the Bolsheviks won majorities in the Petrograd and Moscow soviets, and the Military Revolutionary Committee led by Trotsky secured the loyalty of the capital''s garrison. The insurrection of 7 November (25 October, Old Style) took Petrograd almost without bloodshed, and the Second All-Russian Congress of Soviets, opening that same night, ratified the transfer of power. The Congress immediately adopted the Decrees on Peace and Land and formed the Council of People''s Commissars (Sovnarkom) headed by Lenin.',
     '새 정부의 첫 조치들은 즉각적인 강화 교섭, 지주 토지의 무상 분배, 8시간 노동제, 노동자 통제, 민족 자결 선언, 시민혼과 이혼을 포함한 여성 권리 입법 등 당시 세계에서 유례를 찾기 어려운 사회 입법이었다. 1918년 1월 제헌의회가 소비에트 권력의 강령을 거부하자 해산되었고, 소비에트 대회가 국가 권력의 유일한 원천으로 확립되었다. 이는 의회제와 소비에트제라는 두 정통성의 충돌이었으며, 이후 내전과 소비에트 국가 건설의 출발점이 되었다.',
     'The new government''s first measures amounted to social legislation with few precedents anywhere at the time: immediate peace negotiations, free distribution of landlord estates, the eight-hour day, workers'' control, a declaration of national self-determination, and women''s rights legislation including civil marriage and divorce. When the Constituent Assembly rejected the program of soviet power in January 1918, it was dissolved, and the Congress of Soviets was established as the sole source of state authority. This was a collision between two rival legitimacies, parliament and soviet, and it became the starting point of the civil war and of soviet state-building.',
     $$[
  {
    "date":"1917.09.13",
    "title":{"ko":"소비에트의 볼셰비키화","en":"Bolshevization of the soviets"},
    "body":{"ko":"코르닐로프 반란을 저지하는 과정에서 노동자 무장과 볼셰비키의 영향력이 급성장했다. 9월 13일(구력 8월 31일) 페트로그라드 소비에트가, 곧이어 모스크바 소비에트가 볼셰비키의 권력 결의안을 채택했고, 10월 8일 트로츠키가 페트로그라드 소비에트 의장으로 선출되었다.","en":"In the course of blocking the Kornilov revolt, workers were armed and Bolshevik influence grew rapidly. On 13 September (31 August, Old Style) the Petrograd Soviet, followed by the Moscow Soviet, adopted the Bolshevik resolution on power, and on 8 October Trotsky was elected chairman of the Petrograd Soviet."}
  },
  {
    "date":"1917.09.25–27",
    "title":{"ko":"레닌의 봉기 촉구 서한","en":"Lenin's letters urging insurrection"},
    "body":{"ko":"핀란드에 은신 중이던 레닌이 「볼셰비키는 권력을 장악해야 한다」와 「마르크스주의와 봉기」를 중앙위원회에 보내, 두 수도의 소비에트 다수파를 근거로 무장봉기를 의사일정에 올릴 것을 촉구했다.","en":"From hiding in Finland, Lenin sent the Central Committee 'The Bolsheviks Must Assume Power' and 'Marxism and Insurrection', arguing that the soviet majorities in both capitals put armed insurrection on the order of the day."}
  },
  {
    "date":"1917.10.23",
    "title":{"ko":"중앙위원회, 무장봉기를 결의하다","en":"The Central Committee resolves on armed insurrection"},
    "body":{"ko":"비밀리에 페트로그라드로 돌아온 레닌이 참석한 중앙위원회가 10 대 2로 무장봉기를 당면 과제로 결의했다. 반대한 카메네프와 지노비예프는 이후 당 외부 신문에 반대 의견을 밝혀 계획의 존재가 공공연해졌다.","en":"With Lenin secretly back in Petrograd, the Central Committee voted 10 to 2 to place armed insurrection on the immediate agenda. The dissenters, Kamenev and Zinoviev, aired their objections in a non-party newspaper, making the plan an open secret."}
  },
  {
    "date":"1917.10.25",
    "title":{"ko":"군사혁명위원회 창설","en":"The Military Revolutionary Committee is created"},
    "body":{"ko":"페트로그라드 소비에트가 수도 방위를 명분으로 군사혁명위원회(MRC)를 설치했다. MRC는 수비대 각 부대에 코미사르를 파견했고, 11월 초에는 수비대 대부분이 MRC가 승인하지 않은 명령을 거부하기에 이르렀다.","en":"The Petrograd Soviet established the Military Revolutionary Committee (MRC), formally to defend the capital. The MRC sent commissars to the garrison units, and by early November most of the garrison refused to act on orders the MRC had not endorsed."}
  },
  {
    "date":"1917.11.06",
    "title":{"ko":"봉기 전야: 정부의 선제 조치","en":"Eve of insurrection: the government strikes first"},
    "body":{"ko":"케렌스키 정부가 볼셰비키 신문사를 폐쇄하고 다리를 차단하려 하자, MRC는 이를 반혁명 기도로 규정하고 인쇄소를 다시 열었으며 다리, 역, 전신국 등 요충을 차례로 확보했다. 봉기는 소비에트 대회를 지킨다는 방어의 형식으로 시작되었다.","en":"When Kerensky's government shut Bolshevik newspapers and tried to raise the bridges, the MRC declared this a counterrevolutionary move, reopened the presses, and occupied the bridges, stations, and telegraph in turn. The insurrection began in the form of a defense of the coming Congress of Soviets."}
  },
  {
    "date":"1917.11.07",
    "title":{"ko":"수도 장악과 「러시아 시민들에게」","en":"The capital taken: 'To the Citizens of Russia'"},
    "body":{"ko":"아침까지 MRC 부대가 사실상 무저항 속에 수도의 요충을 장악했고, 레닌은 「러시아 시민들에게」 포고로 임시정부의 타도를 선언했다. 케렌스키는 전선의 병력을 구하러 수도를 떠났다. 페트로그라드의 권력 이양은 거의 유혈 없이 이루어졌다.","en":"By morning MRC forces held the key points of the capital against virtually no resistance, and Lenin's proclamation 'To the Citizens of Russia' declared the Provisional Government deposed. Kerensky left the city to seek troops at the front. The transfer of power in Petrograd was accomplished almost without bloodshed."}
  },
  {
    "date":"1917.11.07–08",
    "title":{"ko":"겨울궁전의 밤","en":"The night of the Winter Palace"},
    "body":{"ko":"순양함 아브로라의 공포탄을 신호로 한 압박 끝에 자정 무렵 겨울궁전이 점령되었고, 안토노프-옵세옌코가 임시정부 각료들을 체포했다. 후대의 전설과 달리 대규모 돌격전은 없었으며 사상자는 극소수였다.","en":"After pressure signaled by a blank shot from the cruiser Aurora, the Winter Palace was occupied around midnight and Antonov-Ovseenko arrested the ministers of the Provisional Government. Contrary to later legend there was no great storming battle, and casualties were very few."}
  },
  {
    "date":"1917.11.07–09",
    "title":{"ko":"제2차 전러시아 소비에트 대회","en":"The Second All-Russian Congress of Soviets"},
    "body":{"ko":"봉기의 밤에 개회한 대회에서 볼셰비키와 좌파 사회혁명당이 다수를 차지했다. 멘셰비키와 우파 사회혁명당 대의원들은 봉기에 항의하며 퇴장했고, 마르토프의 전 사회주의 정당 연립안은 부결되었다. 대회는 「모든 권력을 소비에트로」를 선포하며 권력 이양을 승인했다.","en":"At the Congress that opened on the night of the insurrection, the Bolsheviks and Left SRs held the majority. The Menshevik and Right SR delegates walked out in protest, and Martov's proposal for an all-socialist coalition was voted down. The Congress proclaimed all power to the soviets, ratifying the transfer of power."}
  },
  {
    "date":"1917.11.08",
    "title":{"ko":"평화 법령, 토지 법령, 소브나르콤","en":"The Decrees on Peace and Land, and Sovnarkom"},
    "body":{"ko":"대회는 무병합·무배상의 즉각 강화와 비밀외교 폐지를 요구하는 평화 법령, 지주 토지를 무상 몰수해 농민에게 넘기는 토지 법령을 채택했다. 토지 법령은 농민 스스로 작성한 사회혁명당 계열의 위임장을 그대로 수용한 것이었다. 이어 레닌을 의장으로 하는 인민위원회의(소브나르콤)가 구성되었다.","en":"The Congress adopted the Decree on Peace, demanding an immediate peace without annexations or indemnities and the abolition of secret diplomacy, and the Decree on Land, expropriating landlord estates without compensation for the peasants. The land decree took over, almost verbatim, the peasant mandate compiled by the SRs. The Congress then formed the Council of People's Commissars (Sovnarkom) with Lenin as chairman."}
  },
  {
    "date":"1917.11.10–15",
    "title":{"ko":"첫 반격의 격퇴와 모스크바","en":"The first counterattacks defeated; Moscow"},
    "body":{"ko":"케렌스키가 크라스노프의 카자크 부대와 함께 시도한 반격은 풀코보 고지에서 격퇴되었고, 수도의 사관생도 반란도 진압되었다. 모스크바에서는 페트로그라드와 달리 시가전이 벌어져 더 많은 희생 끝에 11월 15일 소비에트 측이 크렘린을 장악했다.","en":"Kerensky's counterattack with Krasnov's Cossacks was beaten back at the Pulkovo Heights, and a cadet rising in the capital was suppressed. In Moscow, unlike Petrograd, there was real street fighting, and only after heavier losses did the soviet side take the Kremlin on 15 November."}
  },
  {
    "date":"1917.11–12",
    "title":{"ko":"초기 사회 입법","en":"The early social legislation"},
    "body":{"ko":"11월 11일 8시간 노동제 법령, 11월 15일 민족들의 평등과 자결을 선언한 「러시아 제 민족의 권리 선언」, 11월 27일 노동자 통제 법령이 잇따랐다. 12월에는 시민혼과 이혼의 자유를 도입한 법령들이 공포되어, 당시 세계 기준으로 가장 앞선 여성 권리 입법이 시작되었다.","en":"The decree on the eight-hour day followed on 11 November, the Declaration of the Rights of the Peoples of Russia, proclaiming equality and self-determination, on 15 November, and the decree on workers' control on 27 November. December brought decrees introducing civil marriage and freedom of divorce, opening what was by the standards of the time the world's most advanced women's rights legislation."}
  },
  {
    "date":"1917.11.25",
    "title":{"ko":"제헌의회 선거","en":"Elections to the Constituent Assembly"},
    "body":{"ko":"소브나르콤은 임시정부가 예정한 제헌의회 선거를 그대로 실시했다. 사회혁명당이 최다 의석을 얻었고 볼셰비키는 약 4분의 1의 표를 얻었으나, 두 수도와 북부·서부 전선의 군대에서는 다수파였다. 소비에트와 의회라는 두 정통성이 정면으로 마주 서게 되었다.","en":"Sovnarkom held the Constituent Assembly elections scheduled by the Provisional Government. The SRs won the most seats and the Bolsheviks about a quarter of the vote, though they held majorities in the two capitals and in the armies of the northern and western fronts. Two rival legitimacies, soviet and parliament, now stood face to face."}
  },
  {
    "date":"1917.12.20",
    "title":{"ko":"체카의 창설","en":"Creation of the Cheka"},
    "body":{"ko":"사보타주와 반혁명에 대처한다는 목적으로 제르진스키를 의장으로 하는 전러시아 비상위원회(체카)가 설치되었다. 처음에는 소규모 조사 기구였으나, 내전이 격화되면서 훨씬 큰 권한을 가진 기관으로 성장하게 된다.","en":"The All-Russian Extraordinary Commission (Cheka), chaired by Dzerzhinsky, was set up to counter sabotage and counterrevolution. Initially a small investigative body, it would grow into an institution with far greater powers as the civil war intensified."}
  },
  {
    "date":"1918.01.18–19",
    "title":{"ko":"제헌의회의 하루와 해산","en":"The Constituent Assembly's single day and dissolution"},
    "body":{"ko":"1월 18일 개회한 제헌의회는 소비에트 권력과 첫 법령들을 승인하라는 「근로·피착취 인민의 권리 선언」 채택을 거부했다. 볼셰비키와 좌파 사회혁명당 대의원이 퇴장한 뒤 의회는 이튿날 새벽 해산되었고, 곧이어 제3차 소비에트 대회가 해산을 추인하며 소비에트를 국가 권력의 유일한 원천으로 선언했다.","en":"Convening on 18 January, the Constituent Assembly refused to adopt the Declaration of Rights of the Working and Exploited People, which would have endorsed soviet power and the first decrees. After the Bolshevik and Left SR delegates walked out, the Assembly was dissolved at dawn the next day, and the Third Congress of Soviets soon ratified the dissolution, declaring the soviets the sole source of state power."}
  }
]$$::jsonb,
     $$[
  "https://www.marxists.org/archive/lenin/works/1917/sep/12.htm",
  "https://www.marxists.org/archive/lenin/works/1917/oct/25-26/",
  "https://en.wikisource.org/wiki/Declaration_of_Rights_of_the_Peoples_of_Russia",
  "https://www.marxists.org/archive/reed/1919/10days/10days/",
  "Leon Trotsky, The History of the Russian Revolution (1930), https://www.marxists.org/archive/trotsky/1930/hrr/",
  "Alexander Rabinowitch, The Bolsheviks Come to Power: The Revolution of 1917 in Petrograd (1976)",
  "Rex A. Wade, The Russian Revolution, 1917 (Cambridge University Press, 2000)",
  "Stephen Kotkin, Stalin: Paradoxes of Power, 1878–1928 (2014)"
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
SELECT 'october-revolution', v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('lenin', 0, 'leader', '봉기의 설계자·정부 수반', 'Architect of insurrection, head of government',
     '은신처에서 봉기를 촉구하는 서한으로 당을 움직였고, 대회에서 평화·토지 법령을 보고했으며 소브나르콤 의장이 되었다.',
     'From hiding he pressed the party toward insurrection, reported the Decrees on Peace and Land to the Congress, and became chairman of Sovnarkom.'),
    ('trotsky', 1, 'leader', '소비에트 의장·봉기 지휘', 'Soviet chairman, insurrection director',
     '페트로그라드 소비에트 의장으로서 군사혁명위원회를 통해 봉기의 실무를 지휘했고, 초대 외무 인민위원이 되었다.',
     'As chairman of the Petrograd Soviet he directed the practical work of the insurrection through the MRC, and became the first Commissar of Foreign Affairs.'),
    ('sverdlov', 2, 'leader', '당 조직 총괄', 'Chief party organizer',
     '중앙위원회 서기로 봉기 준비를 조율했고, 11월 21일 전러시아 중앙집행위원회(VTsIK) 의장이 되었다.',
     'As Central Committee secretary he coordinated the preparations, and on 21 November became chairman of the All-Russian Central Executive Committee (VTsIK).'),
    ('antonov-ovseenko', 3, 'participant', '겨울궁전 작전 지휘관', 'Winter Palace commander',
     'MRC 서기로서 겨울궁전 점령 작전을 지휘하고 임시정부 각료들의 체포를 집행했다.',
     'As an MRC secretary he led the operation at the Winter Palace and carried out the arrest of the Provisional Government ministers.'),
    ('podvoisky', 4, 'participant', 'MRC 실무 지도부', 'MRC operational leadership',
     '군사혁명위원회의 핵심 실무자로 봉기의 군사 작전을 조직했다.',
     'A core operational figure of the Military Revolutionary Committee, he organized the military side of the insurrection.'),
    ('nikolai-krylenko', 5, 'participant', 'MRC 위원', 'MRC member',
     'MRC 지도부의 일원으로 봉기에 참여했고, 곧 최고총사령관에 임명되었다.',
     'A member of the MRC leadership during the insurrection, he was soon appointed commander-in-chief of the army.'),
    ('dzerzhinsky', 6, 'participant', '봉기 참가·체카 창설', 'Insurgent, Cheka founder',
     '봉기에서 우편·전신 장악을 맡았고, 12월 창설된 체카의 초대 의장이 되었다.',
     'He took charge of seizing the post and telegraph during the insurrection, and in December became the first chairman of the newly created Cheka.'),
    ('stalin', 7, 'participant', '민족 인민위원', 'Commissar of Nationalities',
     '중앙위원으로 봉기 결의에 참여했고, 초대 민족 인민위원으로 민족들의 권리 선언 작업을 맡았다.',
     'As a Central Committee member he backed the insurrection resolution, and as the first Commissar of Nationalities he worked on the declaration of national rights.'),
    ('kollontai', 8, 'participant', '사회복지 인민위원', 'Commissar of Social Welfare',
     '사회복지 인민위원으로 세계에서 가장 이른 여성 각료 가운데 한 명이 되었고, 시민혼·이혼·모성 보호 입법을 추진했다.',
     'As Commissar of Social Welfare she became one of the first women ministers in the world, driving legislation on civil marriage, divorce, and maternity protection.'),
    ('lunacharsky', 9, 'participant', '교육 인민위원', 'Commissar of Enlightenment',
     '초대 교육 인민위원으로 문화·교육 정책을 맡아 새 정부의 계몽 사업을 시작했다.',
     'As the first Commissar of Enlightenment he took charge of culture and education, launching the new government''s literacy and schooling work.'),
    ('shlyapnikov', 10, 'participant', '노동 인민위원', 'Commissar of Labour',
     '초대 노동 인민위원으로 8시간 노동제를 비롯한 초기 노동 입법을 담당했다.',
     'As the first Commissar of Labour he was responsible for the early labor legislation, including the eight-hour day.'),
    ('rykov', 11, 'participant', '내무 인민위원', 'Commissar of Internal Affairs',
     '초대 내무 인민위원이 되었으나, 곧 전 사회주의 정당 연립정부를 요구하며 잠시 사임했다.',
     'He became the first Commissar of Internal Affairs, though he soon resigned for a time in demanding an all-socialist coalition government.'),
    ('kamenev', 12, 'participant', '신중파 지도자', 'Dissenting leader',
     '봉기 계획에 반대했으나 대회에서 초대 VTsIK 의장으로 선출되었고, 연립정부 협상을 이끌었다.',
     'He opposed the insurrection plan, yet was elected the first chairman of VTsIK by the Congress and led the coalition negotiations.'),
    ('zinoviev', 13, 'participant', '신중파 지도자', 'Dissenting leader',
     '카메네프와 함께 봉기 계획에 공개적으로 반대했으나, 혁명 뒤 당 지도부에 남았다.',
     'With Kamenev he publicly opposed the insurrection plan, but remained in the party leadership after the revolution.'),
    ('kerensky', 14, 'opponent', '임시정부 수반', 'Head of the Provisional Government',
     '봉기 당일 수도를 떠나 크라스노프 부대와 함께 반격을 시도했으나 풀코보에서 패배한 뒤 망명길에 올랐다.',
     'He left the capital on the day of the insurrection and attempted a counterattack with Krasnov''s forces, but after defeat at Pulkovo went into exile.'),
    ('martov', 15, 'opponent', '멘셰비키 국제파 지도자', 'Menshevik-Internationalist leader',
     '제2차 소비에트 대회에서 전 사회주의 정당 연립을 제안했으나 부결되자 퇴장했다.',
     'At the Second Congress of Soviets he proposed an all-socialist coalition, and walked out when it was voted down.'),
    ('gorky', 16, 'witness', '비판적 목격자', 'Critical witness',
     '「노바야 지즌」 지면의 「때 이른 생각들」 연재에서 봉기와 새 정부의 초기 조치들을 비판적으로 기록했다.',
     'In the ''Untimely Thoughts'' columns of Novaya Zhizn he chronicled the insurrection and the new government''s first measures with a critical eye.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
