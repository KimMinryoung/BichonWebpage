-- 031: CommuLingo person detail sections, Stalin-era figures (batch 1)
-- Adds two narrative sections each for: rudzutak, kirov, sorge, chuikov,
-- vasilevsky, tukhachevsky, zakovsky, sholokhov, agranov, frinovsky.
-- Idempotent: ON CONFLICT (person_id, slug) DO UPDATE.

-- ============================================================
-- rudzutak (얀 루주타크, 1887–1938)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'rudzutak', 'katorga-to-politburo', 0,
    '1922년, 레닌이 떠올린 이름',
    '1922, the Name Lenin Had in Mind',
    $ko$라트비아 농업 노동자의 아들로 태어난 얀 루주타크는 리가의 공장에서 일하며 1905년 혁명의 파도 속에서 볼셰비키가 됐다. 1907년 체포된 그는 10년의 카토르가(중노동 유형)를 선고받고 리가 중앙감옥과 모스크바 부티르카 감옥에서 형기를 채웠다. 감옥은 그의 건강을 망가뜨렸지만 신념은 꺾지 못했고, 1917년 2월 혁명이 감옥 문을 열었을 때 그는 곧바로 노동조합 운동의 조직가로 복귀했다.

내전기와 1920년대에 루주타크는 전국 노동조합 중앙평의회 서기장, 투르케스탄 국(뷰로) 책임자, 철도 인민위원, 인민위원회의 부의장을 거치며 당의 가장 신뢰받는 실무가 중 한 사람이 됐다. 노동조합 논쟁에서 레닌은 트로츠키의 테제 대신 루주타크가 기초한 강령을 지지하며 그의 균형 감각을 높이 평가했다.

1922년 당 서기장 인선을 둘러싼 논의에서 레닌이 스탈린 대신 루주타크를 서기장감으로 거론했다는 증언이 여러 회고에 남아 있다. 실현되지는 않았지만 이 일화는 카토르가 출신의 과묵한 라트비아인 노동자가 당 안에서 어떤 위상을 지녔는지 보여 준다. 그는 1926년 정치국 정위원이 됐고, 파벌 투쟁의 시기에도 특정 분파의 사람으로 분류되지 않는 드문 지도자로 남았다.$ko$,
    $en$Born the son of a Latvian farm labourer, Janis Rudzutaks became a Bolshevik in the wave of the 1905 revolution while working in Riga's factories. Arrested in 1907, he was sentenced to ten years of katorga, penal hard labour, and served his term in Riga Central Prison and Moscow's Butyrka. Prison ruined his health but not his convictions, and when the February Revolution of 1917 opened the gates he returned at once as an organizer of the trade union movement.

Through the Civil War and the 1920s Rudzutaks served as general secretary of the All-Russian Central Council of Trade Unions, head of the party's Turkestan Bureau, People's Commissar of Railways and deputy chairman of the Council of People's Commissars, becoming one of the party's most trusted practical men. In the trade union controversy Lenin backed the platform Rudzutaks had drafted against Trotsky's theses, valuing his sense of balance.

Several memoirs record that in the 1922 discussions over the post of general secretary, Lenin mentioned Rudzutaks as a candidate in place of Stalin. Nothing came of it, but the episode shows the standing this taciturn Latvian worker, a veteran of katorga, held inside the party. He became a full member of the Politburo in 1926 and remained a rare leader who belonged to no faction through the years of inner-party struggle.$en$,
    $src$["Stephen Kotkin, Stalin: Paradoxes of Power, 1878–1928 (2014)", "V. I. Lenin, The Trade Unions, the Present Situation and Trotsky's Mistakes (1920), marxists.org", "Oleg Khlevniuk, Master of the House: Stalin and His Inner Circle (2009)", "Branko Lazitch and Milorad Drachkovitch, Biographical Dictionary of the Comintern (1986)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'rudzutak')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'rudzutak', 'refusal-1938', 1,
    '1938년 7월, 20분의 재판과 거부된 자백',
    'July 1938, a Twenty-Minute Trial and a Refused Confession',
    $ko$1937년 5월 24일 밤, 루주타크는 지인들과의 저녁 모임 자리에서 체포됐다. 정치국 정위원을 지낸 인물로서는 이례적으로, 그는 구금과 구타 속에서도 끝내 자신에 대한 혐의를 인정하지 않았다. 트로츠키주의와 간첩 혐의를 뒷받침할 증거는 없었고, 사건 전체가 강요된 진술로 짜맞춰졌다.

1938년 7월 28일 소련 최고법원 군사협의회의 재판은 20분 만에 끝났다. 흐루쇼프가 1956년 비밀 연설에서 공개한 재판 기록에 따르면, 루주타크는 마지막 진술에서 자신의 무죄를 밝히며 이렇게 요청했다. 「NKVD 안에는 아직 청산되지 않은 중심이 있어 사건을 인위적으로 조작하고, 무고한 사람들에게 자백을 강요하고 있다. 이를 당 중앙위원회에 알려 달라.」 법정은 이 진술을 무시했고, 그는 이튿날 총살됐다.

카토르가 10년을 견딘 사람은 NKVD의 심문실에서도 꺾이지 않았다. 그의 거부는 대숙청의 조작 메커니즘을 법정 기록 안에 증언으로 남긴 드문 사례가 됐다. 루주타크는 1956년 완전히 복권됐고, 당적도 회복됐다.$ko$,
    $en$On the night of 24 May 1937 Rudzutaks was arrested at a dinner party with friends. Unusually for a man who had sat as a full member of the Politburo, he never admitted the charges against him, through detention and beatings alike. There was no evidence behind the accusations of Trotskyism and espionage; the whole case was assembled from coerced statements.

His trial before the Military Collegium of the USSR Supreme Court on 28 July 1938 lasted twenty minutes. According to the trial record disclosed by Khrushchev in the 1956 Secret Speech, Rudzutaks declared his innocence in his final statement and made one request: that the Central Committee be told there existed within the NKVD an as yet unliquidated centre that was artificially fabricating cases and forcing innocent people to confess. The court ignored the statement, and he was shot the following day.

A man who had endured ten years of katorga did not break in the NKVD's interrogation rooms either. His refusal left inside the court record itself a rare testimony to the fabrication machinery of the Great Terror. Rudzutaks was fully rehabilitated in 1956 and restored to party membership.$en$,
    $src$["Nikita Khrushchev, Secret Speech to the 20th Party Congress (1956), marxists.org", "J. Arch Getty and Oleg Naumov, The Road to Terror: Stalin and the Self-Destruction of the Bolsheviks, 1932–1939 (1999)", "Oleg Khlevniuk, Master of the House: Stalin and His Inner Circle (2009)", "Stephen Kotkin, Stalin: Waiting for Hitler, 1929–1941 (2017)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'rudzutak')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- kirov (세르게이 키로프, 1886–1934)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'kirov', 'leningrad-organizer', 0,
    '1926년, 레닌그라드를 맡은 조직가',
    '1926, the Organizer Sent to Leningrad',
    $ko$우르줌의 가난한 집에서 태어나 고아원에서 자란 세르게이 키로프는 톰스크의 기술학교 시절 혁명 운동에 뛰어들었고, 캅카스에서 지하 활동과 신문 일을 하며 단련됐다. 내전기에는 아스트라한 방어전을 조직했고, 캅카스 소비에트 권력 수립의 핵심 인물로 활동한 뒤 아제르바이잔 당 조직을 이끌었다.

1926년 당은 지노비예프 반대파의 근거지였던 레닌그라드로 그를 보냈다. 키로프는 공장을 일일이 돌며 노동자 집회에서 연설하는 방식으로 당 조직을 다시 세웠고, 특유의 소탈하고 힘 있는 연설로 레닌그라드 노동자들 사이에서 실제적인 인기를 얻었다. 그의 지도 아래 레닌그라드는 1차 5개년 계획기 소련 공업화의 핵심 기지로 재편됐다.

1934년 초 제17차 당대회, 이른바 「승리자들의 대회」에서 키로프는 가장 긴 박수를 받은 연사 중 한 사람이었다. 대회 직후 그는 당 중앙위원회 서기로 선출됐고, 스탈린 지도부의 가장 가까운 동료 중 한 사람으로 꼽혔다.$ko$,
    $en$Born into a poor family in Urzhum and raised in an orphanage, Sergei Kirov joined the revolutionary movement as a technical student in Tomsk and was tempered by underground work and newspaper journalism in the Caucasus. During the Civil War he organized the defence of Astrakhan, played a central role in establishing Soviet power in the Caucasus, and then led the party organization of Azerbaijan.

In 1926 the party sent him to Leningrad, the stronghold of the Zinoviev opposition. Kirov rebuilt the party organization by touring the factories one by one and speaking at workers' meetings, and his plain, forceful oratory won him genuine popularity among Leningrad's workers. Under his leadership Leningrad was reshaped into one of the key industrial bases of the First Five-Year Plan.

At the 17th Party Congress in early 1934, the so-called Congress of Victors, Kirov was among the speakers who drew the longest applause. Immediately after the congress he was elected a secretary of the Central Committee and was counted among the closest colleagues of the Stalin leadership.$en$,
    $src$["Matthew E. Lenoe, The Kirov Murder and Soviet History (2010)", "Oleg Khlevniuk, Stalin: New Biography of a Dictator (2015)", "Stephen Kotkin, Stalin: Waiting for Hitler, 1929–1941 (2017)", "Alla Kirilina, Neizvestnyi Kirov (2001)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'kirov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'kirov', 'smolny-1934', 1,
    '1934년 12월 1일, 스몰니의 총성',
    '1 December 1934, the Shot at Smolny',
    $ko$1934년 12월 1일 오후, 레닌그라드 당 본부인 스몰니 3층 복도에서 레오니트 니콜라예프가 키로프의 뒤통수에 권총을 발사했다. 니콜라예프는 당에서 제명됐다가 복당한 실직 상태의 당원으로, 개인적 원한과 좌절을 키워 온 인물이었다. 키로프는 그 자리에서 사망했다.

이 암살을 스탈린이 사주했다는 설은 흐루쇼프 시대 이래 오랫동안 유포됐다. 그러나 소련 문서고가 열린 뒤의 연구, 특히 레노의 전면적 사건 재검토와 흘레브뉴크, 코트킨의 연구는 스탈린이 암살을 지시했다는 증거가 문서고 어디에도 없으며, 니콜라예프가 단독으로 범행했다는 결론을 일관되게 내린다. 소련 시기와 페레스트로이카 시기에 걸쳐 구성된 여러 조사위원회도 같은 결론에 도달했다. 이 오래된 소문은 이제 근거 없는 것으로 보아야 한다.

암살의 실제 결과는 무거웠다. 사건 당일 저녁 테러 사건의 수사와 재판을 극단적으로 단축하는 12월 1일 법이 공포됐고, 지노비예프와 카메네프가 「도덕적 책임」을 물어 체포되면서 옛 반대파에 대한 탄압이 본격화됐다. 키로프의 죽음은 그가 결코 원하지 않았을 방식으로, 대숙청으로 가는 길목의 사건이 됐다. 그의 유해는 크렘린 벽에 안장됐고, 뱌트카 시가 키로프 시로 개칭된 것을 비롯해 수많은 거리, 공장, 발레단이 그의 이름을 받았다.$ko$,
    $en$On the afternoon of 1 December 1934, in a third-floor corridor of Smolny, the Leningrad party headquarters, Leonid Nikolaev fired a revolver into the back of Kirov's head. Nikolaev was an unemployed party member, once expelled and readmitted, who had been nursing personal grievance and frustration. Kirov died on the spot.

The claim that Stalin ordered the assassination circulated for decades from the Khrushchev era onward. But post-archival scholarship, above all Lenoe's exhaustive re-examination of the case together with the work of Khlevniuk and Kotkin, consistently concludes that no evidence exists anywhere in the archives that Stalin ordered the killing, and that Nikolaev acted alone. Successive investigative commissions convened in the Soviet and perestroika periods reached the same conclusion. The old rumor should now be regarded as unfounded.

The real consequences of the murder were heavy. On the evening of the assassination the Law of 1 December was promulgated, drastically shortening the investigation and trial of terrorism cases, and the arrest of Zinoviev and Kamenev on charges of moral responsibility opened the campaign against the former opposition. Kirov's death became, in a way he could never have wanted, a waystation on the road to the Great Terror. He was buried in the Kremlin Wall, and the city of Vyatka, renamed Kirov, along with countless streets, factories and a ballet company, took his name.$en$,
    $src$["Matthew E. Lenoe, The Kirov Murder and Soviet History (2010)", "Oleg Khlevniuk, Stalin: New Biography of a Dictator (2015)", "Stephen Kotkin, Stalin: Waiting for Hitler, 1929–1941 (2017)", "J. Arch Getty and Oleg Naumov, The Road to Terror (1999)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'kirov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- sorge (리하르트 조르게, 1895–1944)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'sorge', 'tokyo-warnings', 0,
    '1941년, 도쿄에서 온 전문들',
    '1941, the Signals from Tokyo',
    $ko$바쿠에서 태어나 베를린에서 자란 리하르트 조르게는 1차대전 서부전선에서 세 차례 부상을 입고 마르크스주의자가 되어 돌아왔다. 독일 공산당을 거쳐 코민테른 정보 사업에 들어간 그는 1933년 독일 신문 특파원 신분으로 도쿄에 부임했고, 이후 8년에 걸쳐 20세기 정보사에서 가장 뛰어난 첩보망 중 하나로 꼽히는 「람자이」 조직을 구축했다. 나치당원증을 지닌 그는 주일 독일대사 오트의 개인적 신임을 얻어 대사관 내부 정보에 접근했고, 고노에 내각의 브레인이었던 오자키 호쓰미는 일본 정부 최상층의 판단을 전해 왔다.

1941년 봄부터 조르게는 독일의 대소련 공격 준비에 관한 경고를 반복해서 모스크바로 타전했다. 5월과 6월의 전문들은 공격 집결과 예상 시점을 담고 있었으나, 여러 정보 계통의 상충하는 보고 속에서 스탈린과 정보 지도부는 이를 영국의 이간책일 수 있다고 의심했고 경고는 활용되지 못했다.

그의 가장 결정적인 기여는 그해 가을에 왔다. 1941년 9월과 10월, 조르게는 일본이 시베리아의 소련을 치는 북진이 아니라 남방으로 향하기로 했다는 판단을 타전했다. 다른 정보 출처들과 함께 이 보고는 극동의 소련 사단들을 모스크바 방면으로 이전하는 결정을 뒷받침했고, 그 병력은 12월 모스크바 앞에서의 반격에 투입됐다.$ko$,
    $en$Born in Baku and raised in Berlin, Richard Sorge came back from the Western Front of the First World War three times wounded and a convinced Marxist. Moving from the German Communist Party into Comintern intelligence work, he arrived in Tokyo in 1933 under cover as a German newspaper correspondent, and over the next eight years built the Ramsay ring, reckoned among the finest espionage networks of the twentieth century. Carrying a Nazi party card, he won the personal confidence of Ott, the German ambassador to Japan, gaining access to the embassy's inner information, while Ozaki Hotsumi, an adviser to the Konoe cabinet, relayed the thinking of the highest levels of the Japanese government.

From the spring of 1941 Sorge repeatedly cabled Moscow warnings about German preparations for an attack on the Soviet Union. His May and June dispatches described the concentration of forces and the expected timing, but amid conflicting reports from many intelligence channels, Stalin and the intelligence leadership suspected a British provocation, and the warnings went unused.

His most decisive contribution came that autumn. In September and October 1941 Sorge signalled his judgment that Japan had decided to strike south rather than north against the Soviet Far East. Together with other sources, this reporting underpinned the decision to transfer Soviet divisions from the Far East toward Moscow, troops that went into the December counteroffensive before the capital.$en$,
    $src$["Owen Matthews, An Impeccable Spy: Richard Sorge, Stalin's Master Agent (2019)", "Robert Whymant, Stalin's Spy: Richard Sorge and the Tokyo Espionage Ring (1996)", "Gordon W. Prange, Target Tokyo: The Story of the Sorge Spy Ring (1984)", "David M. Glantz and Jonathan House, When Titans Clashed (1995)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'sorge')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'sorge', 'gallows-and-star', 1,
    '1944년 11월 7일, 스가모의 교수대',
    '7 November 1944, the Gallows at Sugamo',
    $ko$1941년 10월 18일, 일본 특별고등경찰이 조르게를 체포했다. 오자키를 비롯한 조직원들이 차례로 검거됐고, 조르게는 심문에서 자신이 코민테른과 붉은 군대를 위해 일했음을 인정하되 일본에 대한 적대 행위가 아니라 전쟁을 막기 위한 활동이었다고 진술했다. 소련 정부는 그를 아는 바 없다고 부인했고, 억류자 교환의 기회도 성사되지 않았다.

1944년 11월 7일, 10월 혁명 27주년 기념일에 조르게는 도쿄 스가모 형무소에서 교수형에 처해졌다. 마지막 순간 그는 일본어로 붉은 군대, 국제공산당, 소비에트 공산당 만세를 외쳤다고 형무소 기록은 전한다. 같은 날 오자키 호쓰미도 처형됐다.

소련은 20년 가까이 그의 이름에 침묵했다. 1964년에 이르러서야 조르게는 소련영웅 칭호를 추서받았고, 그의 얼굴이 우표에 실렸으며, 모스크바와 여러 도시의 거리가 그의 이름을 받았다. 그의 유해는 도쿄 다마 묘지에 묻혔고, 일본인 동반자 이시이 하나코가 오랫동안 무덤을 지켰다.$ko$,
    $en$On 18 October 1941 the Japanese special higher police arrested Sorge. Ozaki and the other members of the ring were rounded up one after another, and under interrogation Sorge admitted that he had worked for the Comintern and the Red Army, while insisting that his work had been aimed not at hostility to Japan but at preventing war. The Soviet government denied knowing him, and no exchange of detainees ever materialized.

On 7 November 1944, the twenty-seventh anniversary of the October Revolution, Sorge was hanged at Sugamo prison in Tokyo. Prison records relate that at the last moment he called out, in Japanese, salutes to the Red Army, the international communist movement and the Soviet Communist Party. Ozaki Hotsumi was executed the same day.

For nearly twenty years the Soviet Union kept silent about his name. Only in 1964 was Sorge posthumously awarded the title Hero of the Soviet Union; his face appeared on a postage stamp, and streets in Moscow and other cities took his name. His remains lie in Tama cemetery in Tokyo, where his Japanese companion Ishii Hanako tended the grave for decades.$en$,
    $src$["Owen Matthews, An Impeccable Spy: Richard Sorge, Stalin's Master Agent (2019)", "Robert Whymant, Stalin's Spy: Richard Sorge and the Tokyo Espionage Ring (1996)", "Gordon W. Prange, Target Tokyo: The Story of the Sorge Spy Ring (1984)", "Chalmers Johnson, An Instance of Treason: Ozaki Hotsumi and the Sorge Spy Ring (1964)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'sorge')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- chuikov (바실리 추이코프, 1900–1982)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'chuikov', 'volga-command', 0,
    '1942년 9월 12일, 볼가 서안의 지휘소',
    '12 September 1942, a Command Post on the Volga''s West Bank',
    $ko$툴라 지방 세레브랴니예 프루디의 농민 가정에서 여덟째로 태어난 바실리 추이코프는 열두 살에 고향을 떠나 페트로그라드에서 견습공으로 일했고, 열여덟 살에 붉은 군대 연대장이 되어 내전을 치렀다. 프룬제 군사아카데미를 마치고 중국 군사고문으로도 근무한 그는 1942년 9월, 독일 6군이 시가지에 진입한 스탈린그라드의 62군 사령관으로 임명됐다. 전임자가 도시를 지킬 수 있다고 확신하지 못한 자리였다. 임무를 어떻게 이해하느냐는 물음에 그는 도시를 사수하거나 그곳에서 죽겠다고 답했다.

추이코프의 62군은 볼가 강 서안의 좁아지는 교두보에서 독일군의 화력 우위를 무력화하는 싸움법을 만들어 냈다. 전선을 적과 「포옹」할 만큼 밀착시켜 독일 공군과 포병이 아군 오폭 없이는 때릴 수 없게 했고, 소총과 수류탄, 공병 폭약으로 무장한 소규모 돌격조가 건물 하나, 층 하나를 놓고 싸웠다. 저격수 자이체프의 말에서 나온 「볼가 너머에 우리 땅은 없다」는 62군 전체의 맹세가 됐다.

그의 지휘소는 강안 벙커에 있었고 여러 차례 매몰과 화재를 겪었지만 강 동안으로 물러나지 않았다. 62군은 두 달 넘게 도시의 마지막 몇 백 미터를 지켜 냈고, 그 사이 소련군은 도시 밖에서 우라누스 작전의 포위망을 준비했다. 스탈린그라드의 시가전은 추이코프라는 지휘관 없이는 설명되지 않는다.$ko$,
    $en$Born the eighth of twelve children to a peasant family in Serebryanye Prudy in Tula province, Vasily Chuikov left home at twelve to work as an apprentice in Petrograd and commanded a Red Army regiment in the Civil War at eighteen. A graduate of the Frunze Military Academy who had also served as a military adviser in China, he was appointed in September 1942 to command the 62nd Army in Stalingrad, where the German Sixth Army had already broken into the city. His predecessor had not been confident the city could be held. Asked how he understood his task, Chuikov answered that he would defend the city or die there.

On the narrowing bridgehead along the Volga's west bank, Chuikov's 62nd Army worked out a way of fighting that cancelled the German superiority in firepower. He pressed his front line so close that it hugged the enemy, so German aircraft and artillery could not strike without hitting their own men, while small storm groups armed with rifles, grenades and engineer charges fought for a single building, a single floor. The words of the sniper Zaitsev, that for us there is no land beyond the Volga, became the oath of the whole army.

His command post sat in a bunker on the riverbank and was buried and burned out more than once, but it never withdrew to the east bank. For over two months the 62nd Army held the last few hundred metres of the city, while outside it the Red Army prepared the encirclement of Operation Uranus. The street war of Stalingrad cannot be explained without the commander Chuikov.$en$,
    $src$["Vasily Chuikov, The Beginning of the Road (Nachalo puti, 1959)", "Jochen Hellbeck, Stalingrad: The City that Defeated the Third Reich (2015)", "Antony Beevor, Stalingrad (1998)", "David M. Glantz and Jonathan House, To the Gates of Stalingrad / Armageddon in Stalingrad (2009)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'chuikov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'chuikov', 'berlin-surrender', 1,
    '1945년 5월 1일, 베를린에서 받은 항복',
    '1 May 1945, Taking the Surrender in Berlin',
    $ko$스탈린그라드의 62군은 1943년 4월 근위 칭호를 받아 8근위군이 됐고, 추이코프는 이 군을 이끌고 우크라이나와 폴란드를 거쳐 베를린까지 서진했다. 1945년 4월, 젤로 고지의 혈전을 뚫은 8근위군은 베를린 시가로 진입했다. 스탈린그라드에서 단련된 시가전 돌격조 전술이 이번에는 공격하는 쪽의 무기가 됐다.

1945년 5월 1일 새벽, 독일 육군참모총장 크렙스 장군이 백기를 들고 추이코프의 지휘소를 찾아와 히틀러의 자살을 알리고 정전 교섭을 시도했다. 추이코프는 무조건 항복 외에는 협상하지 않는다는 소련군의 입장을 통보했고, 5월 2일 베를린 방위사령관 바이틀링이 수비대 전체의 항복을 그에게 문서로 제출했다. 스탈린그라드의 지휘관이 베를린의 항복을 받은 것이다.

전후 추이코프는 독일 주둔 소련군 총사령관, 소련 지상군 총사령관, 국방차관을 지냈고 1955년 소련원수가 됐다. 1982년 사망한 그는 유언에 따라 모스크바의 국립묘지가 아니라 볼고그라드 마마예프 쿠르간, 62군 병사들이 묻힌 언덕에 안장됐다. 소련원수 가운데 유일하게 크렘린 벽 밖에, 자신의 병사들 곁에 묻힌 사람이다.$ko$,
    $en$Stalingrad's 62nd Army received the Guards title in April 1943, becoming the 8th Guards Army, and Chuikov led it west through Ukraine and Poland all the way to Berlin. In April 1945, after the bloody fight for the Seelow Heights, the 8th Guards broke into the streets of Berlin. The storm-group tactics forged in Stalingrad's street war now served the attacker.

At dawn on 1 May 1945 General Krebs, chief of the German Army General Staff, came under a white flag to Chuikov's command post to announce Hitler's suicide and attempt a ceasefire negotiation. Chuikov relayed the Soviet position that there would be no negotiation short of unconditional surrender, and on 2 May Weidling, commandant of the Berlin defence, submitted to him the written capitulation of the entire garrison. The commander of Stalingrad took the surrender of Berlin.

After the war Chuikov headed the Soviet forces in Germany, commanded the Soviet Ground Forces and served as a deputy minister of defence, becoming a Marshal of the Soviet Union in 1955. When he died in 1982 he was buried, by his own wish, not in Moscow but on Mamayev Kurgan in Volgograd, the hill where the soldiers of the 62nd Army lie. He is the only Soviet marshal buried away from the Kremlin Wall, beside his own men.$en$,
    $src$["Vasily Chuikov, The End of the Third Reich (Konets tretego reikha, 1973)", "John Erickson, The Road to Berlin (1983)", "Antony Beevor, Berlin: The Downfall 1945 (2002)", "Jochen Hellbeck, Stalingrad: The City that Defeated the Third Reich (2015)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'chuikov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- vasilevsky (알렉산드르 바실렙스키, 1895–1977)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'vasilevsky', 'uranus-planner', 0,
    '1942년 11월, 우라누스 작전의 설계자',
    'November 1942, the Planner of Operation Uranus',
    $ko$알렉산드르 바실렙스키는 볼가 상류 노바야 골치하의 사제 집안에서 태어나 신학교에서 공부하다가 1차대전이 터지자 장교 속성 과정을 거쳐 참모대위까지 올랐다. 붉은 군대에 들어온 뒤 그는 야전 지휘보다 참모 업무에서 재능을 드러냈고, 참모총장 샤포시니코프의 눈에 들어 참모본부 작전부의 핵심으로 성장했다. 사제의 아들이라는 출신 때문에 오랫동안 아버지와 연락을 끊고 지냈으나, 뒷날 스탈린이 직접 아버지와 다시 왕래하라고 권해 부자가 화해한 일화는 그의 회고록에 남아 있다.

1942년 6월 참모총장이 된 바실렙스키는 그해 가을 주코프와 함께 스탈린그라드 반격 구상을 스탈린에게 보고했다. 도시 안의 소모전으로 독일 6군을 붙잡아 두는 동안, 전선 양익의 취약한 루마니아군 구간을 돌파해 거대한 포위망을 닫는다는 계획, 우라누스 작전이었다. 두 달에 걸쳐 병력과 물자가 은밀하게 집결됐고, 바실렙스키는 스타프카 대표로 현지에서 준비를 조율했다.

1942년 11월 19일 반격이 시작됐고 나흘 만에 포위망이 칼라치에서 닫혀 독일 6군 33만 명이 갇혔다. 바실렙스키는 이후에도 스타프카 대표로 쿠르스크, 크림, 벨라루스의 주요 작전을 전선에서 조율했다. 참모본부의 책상과 전선 지휘소를 오간 그는 소련군 승리의 계획자 중 가장 조용한 사람으로 불렸다.$ko$,
    $en$Aleksandr Vasilevsky was born into a priest's family in Novaya Golchikha on the upper Volga and was studying at a seminary when the First World War broke out; an accelerated officers' course carried him to the rank of staff captain. In the Red Army his talent showed less in field command than in staff work, and he caught the eye of Chief of the General Staff Shaposhnikov, growing into a mainstay of the General Staff's operations directorate. Because of his origins as a priest's son he long broke off contact with his father; his memoirs record that it was Stalin himself who later urged him to resume relations, and father and son were reconciled.

Appointed Chief of the General Staff in June 1942, Vasilevsky reported to Stalin that autumn, together with Zhukov, the concept for a counteroffensive at Stalingrad. While the attritional battle inside the city pinned the German Sixth Army, the plan called for breaking through the weakly held Romanian sectors on both flanks and closing a vast encirclement: Operation Uranus. For two months men and materiel were concentrated in secrecy, and Vasilevsky coordinated the preparations on the spot as the Stavka representative.

The counteroffensive opened on 19 November 1942, and within four days the pincers closed at Kalach, trapping some 330,000 men of the Sixth Army. Vasilevsky went on coordinating the great operations at Kursk, in the Crimea and in Belorussia as Stavka representative at the front. Moving between the General Staff's desks and frontline command posts, he was called the quietest of the planners of the Soviet victory.$en$,
    $src$["Aleksandr Vasilevsky, A Lifelong Cause (Delo vsei zhizni, 1973)", "David M. Glantz and Jonathan House, When Titans Clashed: How the Red Army Stopped Hitler (1995)", "John Erickson, The Road to Stalingrad (1975)", "Geoffrey Roberts, Stalin's Wars: From World War to Cold War (2006)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'vasilevsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'vasilevsky', 'manchuria-1945', 1,
    '1945년 8월 9일, 만주 전략 공세',
    '9 August 1945, the Manchurian Strategic Offensive',
    $ko$1945년 2월, 3벨라루스전선군 사령관 체르냐홉스키가 전사하자 바실렙스키가 그 자리를 이어받아 4월 쾨니히스베르크 요새를 함락시켰다. 독일 항복 뒤 그에게 주어진 임무는 지구 반대편에 있었다. 얄타 합의에 따라 소련이 약속한 대일본전의 총사령관으로서, 그는 유럽에서 극동으로 병력을 옮기는 사상 최대 규모의 전략적 재배치를 지휘했다. 시베리아 횡단철도 하나에 의지해 석 달 만에 수십만 병력과 장비가 9천 킬로미터를 이동했다.

1945년 8월 9일 자정, 세 개 전선군 150만 병력이 만주의 일본 관동군을 상대로 세 방향에서 동시에 공격을 개시했다. 자바이칼전선군의 전차부대는 통행 불가능하다고 여겨졌던 대흥안령 산맥과 고비 사막 연변을 넘어 관동군의 배후 깊숙이 진격했다. 소련군이 전쟁 내내 발전시킨 종심 작전 이론이 가장 완성된 형태로 구현된 작전이었고, 관동군은 열흘 남짓 만에 조직적 저항 능력을 상실했다.

만주 작전은 일본의 항복 결정을 앞당긴 요인 중 하나로 평가되며, 미국 전략가들이 오랫동안 연구한 기동전의 교본이 됐다. 바실렙스키는 이 작전으로 두 번째 소련영웅 칭호를 받았고, 전후 참모총장과 국방장관을 지낸 뒤 1977년 사망해 크렘린 벽에 안장됐다.$ko$,
    $en$In February 1945, when the commander of the 3rd Belorussian Front, Chernyakhovsky, was killed in action, Vasilevsky took over the front and in April reduced the fortress of Königsberg. After the German surrender his next assignment lay on the other side of the globe. As commander-in-chief of the war against Japan that the Soviet Union had promised at Yalta, he directed the largest strategic redeployment in history, moving forces from Europe to the Far East. Relying on the single Trans-Siberian railway, hundreds of thousands of troops and their equipment covered nine thousand kilometres in three months.

At midnight on 9 August 1945, one and a half million men in three fronts struck the Japanese Kwantung Army in Manchuria simultaneously from three directions. The tank forces of the Transbaikal Front crossed the Greater Khingan range and the fringe of the Gobi, terrain judged impassable, and drove deep into the Kwantung Army's rear. It was the most complete realization of the deep operations theory the Red Army had developed through the whole war, and within some ten days the Kwantung Army lost the capacity for organized resistance.

The Manchurian operation is judged one of the factors that hastened Japan's decision to surrender, and it became a textbook of mobile warfare long studied by American strategists. Vasilevsky received his second title of Hero of the Soviet Union for the operation, served after the war as Chief of the General Staff and Minister of Defence, and on his death in 1977 was buried in the Kremlin Wall.$en$,
    $src$["David M. Glantz, August Storm: The Soviet 1945 Strategic Offensive in Manchuria (1983)", "Aleksandr Vasilevsky, A Lifelong Cause (Delo vsei zhizni, 1973)", "Tsuyoshi Hasegawa, Racing the Enemy: Stalin, Truman, and the Surrender of Japan (2005)", "John Erickson, The Road to Berlin (1983)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'vasilevsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- tukhachevsky (미하일 투하쳅스키, 1893–1937)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'tukhachevsky', 'deep-operations', 0,
    '1936년, 종심 작전과 붉은 군대의 근대화',
    '1936, Deep Operations and the Modernization of the Red Army',
    $ko$몰락한 귀족 가문 출신의 미하일 투하쳅스키는 1차대전에서 근위 장교로 싸우다 포로가 됐고, 다섯 차례의 탈출 시도 끝에 러시아로 돌아와 1918년 볼셰비키에 입당했다. 스물다섯에 내전의 군 사령관이 된 그는 동부전선에서 콜차크군을 격파하는 데 기여했고, 「붉은 나폴레옹」이라는 별명을 얻었다. 1920년 폴란드 전쟁에서 바르샤바 앞의 패배를 겪었고, 1921년 크론시타트 반란과 탐보프 농민 봉기의 진압을 지휘한 것도 그였다.

투하쳅스키의 역사적 유산은 전간기의 군사 이론에 있다. 그는 트리안다필로프 등과 함께 「종심 작전」 이론을 발전시켰다. 전차, 항공, 공수부대, 차량화 보병을 결합해 적 방어선을 돌파한 뒤 작전적 종심 전체를 동시에 타격해 마비시킨다는 구상이었다. 군비 담당 부국방인민위원으로서 그는 소련 전차군과 공군, 세계 최초의 공수부대 창설을 밀어붙였고, 1935년 최초의 소련원수 다섯 명 중 한 사람이 됐다.

1936년의 붉은 군대 야전교범(PU-36)은 그의 이론을 공식 교리로 담아냈다. 그는 또한 나치 독일의 재무장을 가장 일찍, 가장 집요하게 경고한 군인 중 하나였다. 1937년 그가 사라진 뒤 종심 작전 이론도 한동안 금기가 됐지만, 스탈린그라드와 바그라티온과 만주에서 소련군이 실행한 것은 결국 그와 동료들이 설계한 전쟁 방식이었다.$ko$,
    $en$Mikhail Tukhachevsky, from an impoverished noble family, fought as a Guards officer in the First World War, was taken prisoner, and after five escape attempts made it back to Russia, joining the Bolsheviks in 1918. An army commander in the Civil War at twenty-five, he helped rout Kolchak's forces on the Eastern Front and earned the nickname the Red Napoleon. In the Polish war of 1920 he suffered the defeat before Warsaw, and in 1921 it was he who directed the suppression of the Kronstadt revolt and the Tambov peasant rising.

Tukhachevsky's historical legacy lies in interwar military theory. With Triandafillov and others he developed the theory of deep operations: combining tanks, aviation, airborne troops and motorized infantry to break through the enemy's defences and then strike and paralyse the entire operational depth simultaneously. As deputy defence commissar for armaments he drove the creation of the Soviet tank forces, the air force and the world's first airborne troops, and in 1935 he became one of the first five Marshals of the Soviet Union.

The Red Army field regulations of 1936, PU-36, enshrined his theory as official doctrine. He was also among the earliest and most persistent military voices warning of Nazi Germany's rearmament. After he vanished in 1937 deep operations theory was for a time taboo, but what the Red Army executed at Stalingrad, in Bagration and in Manchuria was in the end the way of war he and his colleagues had designed.$en$,
    $src$["Richard Simpkin, Deep Battle: The Brainchild of Marshal Tukhachevskii (1987)", "Lennart Samuelson, Plans for Stalin's War Machine: Tukhachevskii and Military-Economic Planning, 1925–1941 (2000)", "David M. Glantz, Soviet Military Operational Art: In Pursuit of Deep Battle (1991)", "Peter Whitewood, The Red Army and the Great Terror: Stalin's Purge of the Soviet Military (2015)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'tukhachevsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'tukhachevsky', 'trial-1937', 1,
    '1937년 6월 11일, 비공개 군사재판',
    '11 June 1937, the Closed Military Trial',
    $ko$1937년 5월 22일 투하쳅스키는 볼가 군관구 사령관으로 좌천된 직후 체포됐다. 심문은 가혹했다. 문서고에서 확인된 그의 자백 조서에는 핏자국이 남아 있다. 6월 11일, 그는 야키르, 우보레비치 등 붉은 군대 최고 지휘관 7명과 함께 독일을 위한 간첩 활동과 군사 쿠데타 음모 혐의로 비공개 군사법정에 세워졌다. 재판관석에는 동료 원수와 장군들이 앉아 있었고, 그들 대부분도 곧 같은 운명을 맞았다. 8명 전원이 그날 밤 사형을 선고받고 이튿날 새벽 총살됐다.

투하쳅스키 사건을 둘러싸고 오랫동안 유포된 이야기가 있다. 하이드리히의 나치 정보기관이 위조한 문서가 베네시 체코슬로바키아 대통령을 거쳐 스탈린에게 전달돼 숙청을 촉발했다는 설이다. 나치의 위조 공작 자체는 실재했지만, 문서고 개방 이후의 연구는 이 설을 지지하지 않는다. 위조 문서는 실제 수사 기록 어디에도 등장하지 않고, 사건은 전적으로 NKVD가 받아낸 자백 위에 세워졌으며, 군 지휘부에 대한 의심과 수사는 위조 문서가 도착했다는 시점보다 앞서 진행되고 있었다. 숙청의 동력은 외부의 기만이 아니라 군의 자율성에 대한 스탈린의 불신에서 나왔다는 것이 오늘날 학계의 결론이다.

뒤이은 군 숙청으로 원수 5명 중 3명, 군단장급 이상 지휘관의 다수가 희생돼 붉은 군대는 독소전 개전을 앞두고 지휘 경험의 공백을 안게 됐다. 1957년 소련 군사검찰의 재심은 사건 전체가 조작임을 확인했고, 투하쳅스키와 동료들은 전원 복권됐다.$ko$,
    $en$On 22 May 1937, just after being demoted to command the Volga Military District, Tukhachevsky was arrested. The interrogation was brutal: his confession protocols, verified in the archives, carry bloodstains. On 11 June he was placed before a closed military court with seven of the Red Army's highest commanders, including Yakir and Uborevich, charged with espionage for Germany and plotting a military coup. On the bench sat fellow marshals and generals, most of whom soon met the same fate. All eight were sentenced to death that night and shot before dawn the next day.

A story long circulated around the Tukhachevsky case: that documents forged by Heydrich's Nazi intelligence service reached Stalin through Czechoslovak president Benes and triggered the purge. The Nazi forgery operation itself was real, but post-archival research does not support the story. The forged documents appear nowhere in the actual investigation files; the case was built entirely on confessions extracted by the NKVD; and suspicion and investigation of the military leadership were already under way before the dossier is supposed to have arrived. The scholarship concludes that the purge was driven not by an external deception but by Stalin's distrust of the army's autonomy.

The military purge that followed took three of the five marshals and a large share of commanders from corps level upward, leaving the Red Army with a gulf of command experience on the eve of the war with Germany. In 1957 a review by the Soviet military procuracy confirmed that the entire case had been fabricated, and Tukhachevsky and his co-defendants were all rehabilitated.$en$,
    $src$["Peter Whitewood, The Red Army and the Great Terror: Stalin's Purge of the Soviet Military (2015)", "Oleg Khlevniuk, Master of the House: Stalin and His Inner Circle (2009)", "Stephen Kotkin, Stalin: Waiting for Hitler, 1929–1941 (2017)", "J. Arch Getty and Oleg Naumov, The Road to Terror (1999)", "Igor Lukes, Czechoslovakia between Stalin and Hitler (1996)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'tukhachevsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- zakovsky (레오니트 자콥스키, 1894–1938)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'zakovsky', 'leningrad-executor', 0,
    '1937년, 레닌그라드의 집행자',
    '1937, the Executor in Leningrad',
    $ko$본명이 헨리크스 슈투비스인 라트비아인 레오니트 자콥스키는 1917년부터 체카에서 일한 최고참 세대의 요원이었다. 내전기와 1920년대에 오데사, 포돌리아, 시베리아의 보안기관을 거치며 그는 가혹한 심문과 대규모 추방 작전의 실무자로 경력을 쌓았고, 시베리아에서는 농업 집단화기의 「쿨라크 청산」 작전을 지휘했다.

1934년 12월 키로프 암살 직후 그는 레닌그라드주 NKVD 책임자로 임명됐다. 이후 3년여 동안 레닌그라드는 소련에서 탄압이 가장 가혹한 지역 중 하나가 됐다. 옛 귀족과 관리 출신 주민 수천 가구를 도시에서 추방한 1935년의 「옛 사람들」 작전, 1937년 명령 제00447호에 따른 쿨라크 작전의 대규모 처형과 수용소 이송, 라트비아인과 폴란드인을 겨냥한 민족 작전이 모두 그의 서명 아래 집행됐다. 그는 심문에서 구타를 제도처럼 사용했고, 할당량을 채우는 데 열성적인 지방 책임자로 중앙의 신임을 받았다.

흐루쇼프의 1956년 비밀 연설은 자콥스키의 심문실에서 살아남은 옛 당원 로젠블륨의 진술을 인용했다. 자콥스키가 조작된 「레닌그라드 중심」 사건의 각본을 보여 주며 협조하면 목숨을 살려 주고 거부하면 파멸시키겠다고 말했다는 내용이다. 그의 이름은 대숙청의 조작 메커니즘을 보여 주는 사례로 당 문서에 남았다.$ko$,
    $en$Leonids Zakovsky, a Latvian whose real name was Henriks Stubis, belonged to the oldest generation of Cheka officers, in the service from 1917. Through the Civil War and the 1920s he built his career in the security organs of Odessa, Podolia and Siberia as a practitioner of harsh interrogation and mass deportation operations, and in Siberia he directed dekulakization operations during collectivization.

Immediately after the Kirov assassination in December 1934 he was appointed head of the NKVD for Leningrad province. For the next three years and more, Leningrad was among the regions of the Soviet Union where repression was most severe. The 1935 operation against the so-called former people, which expelled thousands of families of old nobles and officials from the city, the mass executions and camp transports of the kulak operation under Order No. 00447 in 1937, and the national operations aimed at Latvians and Poles were all carried out over his signature. He used beatings in interrogation as a matter of routine and enjoyed the centre's confidence as a regional chief zealous in filling quotas.

Khrushchev's 1956 Secret Speech quoted the testimony of Rozenblum, an old party member who survived Zakovsky's interrogation rooms: Zakovsky showed him the script of a fabricated Leningrad centre case and told him that cooperation would buy his life and refusal his destruction. His name remains in the party record as a case study in the fabrication machinery of the Great Terror.$en$,
    $src$["Nikita Khrushchev, Secret Speech to the 20th Party Congress (1956), marxists.org", "N. V. Petrov and K. V. Skorkin, Kto rukovodil NKVD, 1934–1941: Spravochnik (1999)", "J. Arch Getty and Oleg Naumov, The Road to Terror (1999)", "Oleg Khlevniuk, Master of the House: Stalin and His Inner Circle (2009)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'zakovsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'zakovsky', 'purge-of-purgers', 1,
    '1938년, 숙청하는 자의 숙청',
    '1938, the Purge of the Purgers',
    $ko$1938년 1월 자콥스키는 모스크바로 승진해 NKVD 부인민위원 겸 모스크바주 NKVD 책임자가 됐다. 정점은 짧았다. 석 달 뒤인 4월 그는 모든 보안기관 직책에서 해임돼 수용소 건설 부서로 밀려났고, 4월 30일 체포됐다.

그에게 적용된 혐의는 그 자신이 레닌그라드에서 수없이 뒤집어씌운 것과 같은 종류였다. 라트비아 정보기관의 간첩이자 NKVD 내 라트비아 민족주의 조직의 일원이라는 것이었다. 그가 집행한 라트비아인 민족 작전의 논리가 라트비아인인 그 자신에게 되돌아온 셈이다. 1938년 8월 29일 자콥스키는 총살됐다. 예조프 체제의 집행자들을 제거하는 「숙청하는 자들의 숙청」의 일부였다.

전후 재심에서 그의 간첩 혐의는 근거 없는 것으로 판정됐으나, 소련 검찰은 재직 중 저지른 사회주의 법질서의 중대한 침해, 곧 대량 조작과 불법 처형을 이유로 복권을 거부했다. 자콥스키는 오늘날까지 복권되지 않은 채 남아 있다. 그의 경력은 대숙청이 집행자 자신도 소모품으로 삼았다는 사실을 보여 주는 대표적 사례다.$ko$,
    $en$In January 1938 Zakovsky was promoted to Moscow as deputy people's commissar of the NKVD and head of the NKVD for Moscow province. The summit was brief. Three months later, in April, he was removed from all security posts and shunted to a camp construction administration, and on 30 April he was arrested.

The charges laid against him were of exactly the kind he had pinned on countless others in Leningrad: that he was a spy for Latvian intelligence and a member of a Latvian nationalist organization inside the NKVD. The logic of the Latvian national operation he had executed came back upon the Latvian who had run it. On 29 August 1938 Zakovsky was shot, part of the purge of the purgers that removed the executors of the Yezhov apparatus.

A postwar review found the espionage charge baseless, but the Soviet procuracy refused rehabilitation on the grounds of his grave violations of socialist legality in office, that is, mass fabrication and unlawful executions. Zakovsky remains unrehabilitated to this day. His career stands as a leading example of how the Great Terror consumed its own executors.$en$,
    $src$["N. V. Petrov and K. V. Skorkin, Kto rukovodil NKVD, 1934–1941: Spravochnik (1999)", "J. Arch Getty and Oleg Naumov, The Road to Terror (1999)", "Oleg Khlevniuk, Master of the House: Stalin and His Inner Circle (2009)", "Marc Jansen and Nikita Petrov, Stalinist Executioner: People's Commissar Nikolai Ezhov (2002)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'zakovsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- sholokhov (미하일 숄로호프, 1905–1984)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'sholokhov', 'letters-to-stalin', 0,
    '1933년 4월, 스탈린에게 보낸 편지',
    'April 1933, the Letters to Stalin',
    $ko$돈 강변 뵤셴스카야에 살던 20대의 작가 미하일 숄로호프는 1933년 봄, 자기 고장에서 벌어지는 일을 더는 두고 볼 수 없었다. 곡물 조달 목표를 채우려는 지방 간부들이 농민들의 종자와 식량까지 쓸어 갔고, 할당량을 못 채운 콜호스니크들에게 구타와 한겨울 축출, 모의 처형까지 동원되고 있었다. 4월 4일과 16일, 그는 스탈린에게 장문의 편지 두 통을 보내 조달 작전에서 자행된 학대 방법들을 이름과 날짜를 들어 낱낱이 고발하고, 굶주리는 뵤셴스카야와 베르흐네돈스코이 지구에 곡물을 보내 달라고 요청했다.

스탈린은 답장을 보냈고 실제로 움직였다. 두 지구에 십수만 푸드의 곡물 지원이 결정됐고, 시키랴토프가 이끄는 조사위원회가 파견돼 일부 간부가 처벌받았다. 그러나 5월 6일자 답장에서 스탈린은 작가의 시야가 한쪽에 치우쳤다고 반박했다. 존경받는 곡물 재배자들이 소비에트 권력을 상대로 「굶주림을 이용한 조용한 전쟁」을 벌였다는 것이었다.

1990년대에 전문이 공간된 이 왕복 서한은 기근기의 조달 폭력을 내부에서, 실명으로, 최고 권력자를 향해 고발한 가장 극적인 문서 중 하나다. 체제 안의 충성스러운 작가가 체제의 폭력을 문서로 남긴 이 사례는, 대기근 연구의 표준 저작들에서 핵심 사료로 인용된다. 숄로호프는 1938년 대숙청기에도 로스토프 NKVD의 조작 수사에 걸린 지역 간부들을 위해 다시 스탈린에게 직접 탄원해 이들을 구해 냈다.$ko$,
    $en$In the spring of 1933 Mikhail Sholokhov, a writer in his twenties living at Veshenskaya on the Don, could no longer stand what was happening in his district. Local officials straining to meet grain procurement targets were sweeping away the peasants' seed and food grain, and beatings, evictions into the winter cold and mock executions were being used against collective farmers who fell short of their quotas. On 4 and 16 April he sent Stalin two long letters, denouncing the methods of abuse used in the procurement campaign point by point, with names and dates, and asking that grain be sent to the starving Veshenskaya and Verkhne-Donskoy districts.

Stalin replied, and he acted. Grain aid amounting to well over a hundred thousand poods was allotted to the two districts, and an investigating commission under Shkiryatov was sent down; some officials were punished. But in his reply of 6 May Stalin countered that the writer saw only one side: the esteemed grain growers, he wrote, had waged a quiet war against Soviet power, a war by starvation.

This correspondence, published in full in the 1990s, is among the most dramatic documents to denounce procurement violence from inside the system, by name, to the supreme leader himself. The case of a loyal Soviet writer putting the system's violence on paper is cited as a key source in the standard works on the famine. In 1938, at the height of the Terror, Sholokhov again appealed directly to Stalin for local officials caught in a fabricated case run by the Rostov NKVD, and saved them.$en$,
    $src$["Stalin-Sholokhov correspondence, April–May 1933, published in Voprosy istorii No. 3 (1994)", "R. W. Davies and Stephen G. Wheatcroft, The Years of Hunger: Soviet Agriculture, 1931–1933 (2004)", "Brian J. Boeck, Stalin's Scribe: Literature, Ambition, and Survival. The Life of Mikhail Sholokhov (2019)", "Sheila Fitzpatrick, Stalin's Peasants: Resistance and Survival in the Russian Village after Collectivization (1994)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'sholokhov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'sholokhov', 'quiet-don-nobel', 1,
    '1965년, 「고요한 돈강」과 노벨상',
    '1965, And Quiet Flows the Don and the Nobel Prize',
    $ko$숄로호프는 스무 살 무렵부터 돈 카자크의 삶과 혁명, 내전을 그린 대하소설 「고요한 돈강」을 쓰기 시작해 1928년부터 1940년까지 네 권으로 완성했다. 백군에 가담했다가 파멸해 가는 카자크 그리고리 멜레호프를 주인공으로 삼아 혁명의 적편에 선 사람들의 비극까지 정면으로 그린 이 소설은, 소비에트 문학의 틀 안에서 나온 작품 가운데 가장 대담한 서사시로 꼽힌다. 검열과 라프(RAPP) 계열의 공격 속에서도 스탈린은 이 소설의 간행을 허용했고, 젊은 작가가 이런 대작을 썼을 리 없다는 표절 시비가 일찍부터 따라다녔다.

표절설은 냉전기에 솔제니친 등에 의해 되살아났으나, 1999년 러시아 과학아카데미가 1, 2권의 자필 초고를 발굴해 감정했고, 계량문체론 연구들도 저자가 숄로호프임을 뒷받침했다. 오늘날 학계의 다수 결론은 표절설에 근거가 없다는 것이다.

1965년 스웨덴 한림원은 「돈 강 서사시에서 러시아 민중의 삶의 한 역사적 국면을 그려 낸 예술적 힘과 성실성」을 이유로 숄로호프에게 노벨문학상을 수여했다. 소련 정부의 축하 속에 상을 받은 유일한 소련 작가였다. 만년의 그는 시냡스키와 다니엘 재판 때 두 작가를 가혹하게 비난하는 연설을 하는 등 체제 강경파의 목소리를 냈고, 이는 그의 명성에 그늘로 남았다. 그는 평생 뵤셴스카야를 떠나지 않았고, 노벨상 상금을 고향의 학교 건설에 내놓았다.$ko$,
    $en$From around the age of twenty Sholokhov began writing And Quiet Flows the Don, an epic of Don Cossack life through revolution and civil war, completing it in four volumes between 1928 and 1940. Centred on Grigory Melekhov, a Cossack who joins the Whites and is destroyed, the novel faces squarely even the tragedy of those who stood on the revolution's enemy side, and is counted the boldest epic to emerge within the frame of Soviet literature. Through censorship battles and attacks from the RAPP camp Stalin allowed the novel to be published, while accusations of plagiarism, on the claim that so young a writer could not have produced such a work, pursued it from the start.

The plagiarism charge was revived in the Cold War by Solzhenitsyn among others, but in 1999 the Russian Academy of Sciences recovered and authenticated the manuscript drafts of the first two volumes, and stylometric studies have likewise supported Sholokhov's authorship. The prevailing scholarly conclusion today is that the charge is unfounded.

In 1965 the Swedish Academy awarded Sholokhov the Nobel Prize in Literature for the artistic power and integrity with which, in his epic of the Don, he had given expression to a historic phase in the life of the Russian people. He was the only Soviet writer to receive the prize with his government's blessing. In his later years he spoke as a hardliner, delivering a harsh denunciation of Sinyavsky and Daniel at the time of their trial, which left a shadow on his reputation. He never left Veshenskaya, and gave his Nobel money to build a school in his home district.$en$,
    $src$["Nobel Prize in Literature 1965, award citation, nobelprize.org", "Herman Ermolaev, Mikhail Sholokhov and His Art (1982)", "Brian J. Boeck, Stalin's Scribe: Literature, Ambition, and Survival. The Life of Mikhail Sholokhov (2019)", "Felix Kuznetsov, Tikhii Don: sudba i pravda velikogo romana (2005)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'sholokhov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- __APPEND__
