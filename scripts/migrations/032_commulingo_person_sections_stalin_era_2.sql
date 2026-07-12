-- 032: CommuLingo person detail sections, Stalin era batch 2
-- Adds two narrative sections each for: platonov, kosior, vasily-grossman,
-- lozovsky, sudoplatov, postyshev, gamarnik, malenkov, nagy, dubcek.
-- Idempotent: ON CONFLICT (person_id, slug) DO UPDATE. Guarded by WHERE EXISTS
-- so the file is safe even if a person id is absent.

-- ============================================================
-- Andrei Platonov (platonov)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'platonov', 'stalin-marginalia', 0,
    '1931년, 「브프로크」 여백에 남은 스탈린의 글씨',
    '1931, Stalin''s Handwriting in the Margins of "For Future Use"',
    $sec$안드레이 플라토노프는 보로네시의 철도 노동자 가정에서 태어나 혁명을 자기 세대의 사업으로 받아들인 사람이었다. 1921년 볼가 대기근을 목격한 그는 사람들이 굶주리는 동안 문학에만 종사할 수는 없다며 펜을 내려놓고 토지개량 기사가 되었고, 이후 몇 해 동안 보로네시 일대에서 우물과 저수지를 파고 농촌에 소형 발전소를 세웠다. 전기화와 관개는 그에게 단순한 기술 업무가 아니라 혁명의 물질적 실현이었다. 그리고 바로 이 체험이 그를 다른 누구와도 닮지 않은 작가로 만들었다. 1928년 완성한 장편 『체벤구르』와 1930년의 『코틀로반(구덩이)』은 유토피아를 향한 갈망과 그 건설의 고통을 같은 언어 안에 담았고, 두 작품 모두 그의 생전에 소련에서 출판되지 못했다.

1931년, 집단화 시기의 농촌을 다룬 중편 「브프로크(장래를 위하여)」가 잡지 『크라스나야 노비』에 실리면서 파국이 왔다. 스탈린은 잡지의 여백에 격한 메모를 남기며 작품을 쿨라크적 연대기로 규정했고, 「재능 있는 작가이지만 비열한 자」라고 평했다는 기록이 전해진다. 문단의 비판 캠페인이 뒤따랐고, 플라토노프는 스탈린과 고리키에게 자신의 의도를 해명하는 편지를 썼다. 그는 풍자가가 아니라 건설의 어려움을 안에서부터 그리려 한 사람이었으나, 그 문장은 공식 문법이 허용하는 범위를 넘어서 있었다.

이후 플라토노프는 문단의 주변부로 밀려나 기술 특허 작업과 산발적인 발표로 생계를 이었다. 플라토노프 사건은 사회주의 건설의 언어를 누구보다 진지하게 받아들인 작가가 바로 그 진지함 때문에 국가의 문학 지도와 충돌한 역설을 보여준다. 포스트소비에트 시기의 문서고 연구는 그의 원고와 검열 기록을 복원했고, 『체벤구르』와 『코틀로반』은 오늘날 20세기 러시아 산문의 정점으로 평가된다.$sec$,
    $sec$Andrei Platonov was born into a railway worker's family in Voronezh and embraced the revolution as the cause of his generation. After witnessing the Volga famine of 1921 he set down his pen, saying he could not practice literature while people starved, and became a land-reclamation engineer: for several years he dug wells and ponds around Voronezh and built small rural power stations. Electrification and irrigation were for him not technical chores but the material realization of the revolution. That experience made him a writer unlike any other. The novel *Chevengur*, finished in 1928, and *The Foundation Pit* of 1930 held the longing for utopia and the pain of its construction in a single language; neither could be published in the Soviet Union in his lifetime.

Catastrophe came in 1931, when the novella "For Future Use" (*Vprok*), a chronicle of the collectivized countryside, appeared in the journal *Krasnaya Nov*. Stalin left furious notes in the margins of the journal, branding the work a kulak chronicle; the verdict "a talented writer, but a scoundrel" is recorded as his. A press campaign followed, and Platonov wrote letters to Stalin and to Gorky explaining his intentions. He was no satirist: he had tried to render the difficulty of construction from within, but his sentences exceeded what the official grammar allowed.

Platonov was pushed to the margins of literary life, surviving on patent work as an engineer and scattered publications. His case shows the paradox of a writer who took the language of socialist construction more seriously than anyone, and collided with the state's literary tutelage precisely because of that seriousness. Post-Soviet archival scholarship has restored his manuscripts and censorship files, and *Chevengur* and *The Foundation Pit* are now ranked among the summits of twentieth-century Russian prose.$sec$,
    $src$["Thomas Seifrid, Andrei Platonov: Uncertainties of Spirit (Cambridge University Press, 1992)", "Robert Chandler, introduction to Andrei Platonov, The Foundation Pit (NYRB Classics, 2009)", "Aleksei Varlamov, Andrei Platonov (Molodaya Gvardiya, ZhZL series, 2011)", "Andrei Platonov, Vprok: bednyatskaya khronika, Krasnaya nov, no. 3 (1931)", "Natalya Kornienko et al. (eds.), Andrei Platonov: Vospominaniya sovremennikov. Materialy k biografii (1994)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'platonov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'platonov', 'son-and-last-years', 1,
    '1938년, 열다섯 살 아들의 체포',
    '1938, the Arrest of a Fifteen-Year-Old Son',
    $sec$1938년 5월, 플라토노프의 외아들 플라톤이 열다섯 살의 나이로 체포되었다. 대공포 시기의 밀고에서 비롯된 사건으로, 소년은 터무니없는 혐의로 수용소형을 선고받았다. 플라토노프는 도움을 청할 수 있는 모든 곳에 손을 내밀었고, 미하일 숄로호프의 개입에 힘입어 1940년 가을 플라톤은 석방되었다. 그러나 수용소에서 얻은 결핵은 이미 깊어져 있었다. 아버지는 병상의 아들을 밤낮으로 간호하다 자신도 감염되었고, 플라톤은 1943년 1월에 세상을 떠났다.

아들을 잃은 뒤에도 플라토노프는 전쟁의 한복판으로 갔다. 1942년부터 『크라스나야 즈베즈다(붉은 별)』의 종군기자로 여러 전선을 돌았고, 병사의 죽음을 추상화하지 않는 그의 전선 산문은 병사들과 동료 기자들의 존경을 받았다. 1946년 발표한 단편 「귀환」은 전쟁에서 돌아온 병사의 가정을 그렸다는 이유로 비평가 예르밀로프의 공격을 받았고, 그는 다시 발표 지면을 잃었다.

말년의 플라토노프는 결핵과 궁핍 속에서 러시아 민담을 다시 쓰는 일로 생계를 이었고, 1951년 1월 5일 모스크바에서 사망했다. 『코틀로반』과 『체벤구르』가 소련에서 정식으로 출판된 것은 1980년대 후반 글라스노스트 시기에 이르러서였다. 전기 기사에서 출발해 참호와 병상을 거쳐 간 그의 문장은, 혁명의 세기가 낳은 가장 진실한 문학적 증언 가운데 하나로 남아 있다.$sec$,
    $sec$In May 1938 Platonov's only son, Platon, was arrested at the age of fifteen. The case grew out of a denunciation in the years of the Great Terror, and the boy was sentenced to a labor camp on absurd charges. Platonov appealed to everyone he could reach, and thanks in large part to the intervention of Mikhail Sholokhov, Platon was released in the autumn of 1940. But the tuberculosis he had contracted in the camps was already advanced. Nursing his son day and night, the father caught the disease himself; Platon died in January 1943.

Even after losing his son, Platonov went to the center of the war. From 1942 he served as a front-line correspondent for *Krasnaya Zvezda* (Red Star), and his war sketches, which refused to abstract the death of the ordinary soldier, earned the respect of soldiers and fellow correspondents alike. In 1946 his story "The Return", a portrait of a soldier's homecoming, was attacked by the critic Yermilov, and he lost his access to print once more.

In his last years Platonov, ill with tuberculosis and living in poverty, supported his family by retelling Russian folk tales. He died in Moscow on January 5, 1951. *The Foundation Pit* and *Chevengur* were published in the Soviet Union only in the late 1980s, under glasnost. The prose of this electrical engineer, carried through trenches and sickrooms, remains one of the most truthful literary testimonies the revolutionary century produced.$sec$,
    $src$["Aleksei Varlamov, Andrei Platonov (Molodaya Gvardiya, ZhZL series, 2011)", "Robert Chandler (ed.), Andrei Platonov, Soul and Other Stories (NYRB Classics, 2007)", "Thomas Seifrid, A Companion to Andrei Platonov's The Foundation Pit (Academic Studies Press, 2009)", "V. Yermilov, Klevetnicheskii rasskaz A. Platonova, Literaturnaya gazeta (1947)", "Natalya Kornienko et al. (eds.), Andrei Platonov: Vospominaniya sovremennikov. Materialy k biografii (1994)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'platonov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Stanislav Kosior (kosior)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'kosior', 'famine-ukraine', 0,
    '1932년, 곡물 조달과 우크라이나의 기근',
    '1932, Grain Procurement and the Famine in Ukraine',
    $sec$스타니스와프 코시오르는 폴란드 벵그루프의 노동자 가정에서 태어나 돈바스의 제철소에서 일하며 1907년 볼셰비키에 입당한 고참 지하활동가였다. 내전기 우크라이나에서 당 조직을 이끌었고, 1928년부터 우크라이나 공산당(볼셰비키) 중앙위원회 총서기로서 집단화와 공업화의 최전선에 섰으며, 1930년 전연방 정치국원이 되었다.

문서고 연구가 복원한 1932~33년의 코시오르는 이중의 모습을 하고 있다. 그는 모스크바가 내려보낸 곡물 조달 목표를 우크라이나에서 집행한 최고 책임자였고, 1932년 봄까지 기근의 규모를 과소평가하는 보고를 중앙에 올렸다. 동시에 그해 여름부터는 조달 목표의 하향과 종자 대여, 식량 지원을 거듭 요청한 청원자이기도 했다. 조달 위기가 파국으로 치닫자 1932년 말 몰로토프 위원회가 파견되고 블랙리스트와 현물 벌금 같은 가혹한 조치가 시행되었다. 데이비스와 위트크로프트의 연구는 이 기근을 무리한 조달 목표, 연이은 흉작, 위기 대응의 실패가 겹친 파국으로 설명하면서도, 코시오르를 포함한 공화국 지도부가 농촌의 실상을 알면서도 조달을 앞세운 책임을 분명히 기록한다. 1933년 이후 그는 기근 지역에 대한 종자, 식량 지원과 파종 캠페인의 집행 또한 지휘했다.

수백만 명이 목숨을 잃은 이 재난에서 코시오르의 이름을 떼어낼 수는 없다. 아카이브에 기초한 역사서술은 그를 학살의 설계자로도, 무력한 방관자로도 그리지 않는다. 그는 강행 공업화라는 국가적 선택의 우크라이나 집행자였고, 그 선택의 대가를 농민이 치렀다는 사실은 이 시기를 다루는 어떤 서술에서도 생략될 수 없다.$sec$,
    $sec$Stanisław Kosior was born into a worker's family in Węgrów, Poland, labored in the ironworks of the Donbass, and joined the Bolsheviks in 1907 as a veteran of the underground. He led party organizations in Ukraine during the civil war, and from 1928 stood at the front line of collectivization and industrialization as general secretary of the Central Committee of the Communist Party (Bolsheviks) of Ukraine, joining the all-union Politburo in 1930.

The Kosior of 1932–33 restored by archival research has a double face. He was the man ultimately responsible in Ukraine for enforcing the grain procurement targets handed down from Moscow, and into the spring of 1932 he sent the center reports that underestimated the scale of the famine. At the same time, from that summer he repeatedly petitioned for lower targets, seed loans, and food relief. As the procurement crisis turned catastrophic, the Molotov commission arrived at the end of 1932 and harsh measures such as blacklisting and fines in kind were imposed. The research of Davies and Wheatcroft explains the famine as a catastrophe compounded of excessive procurement targets, successive poor harvests, and failed crisis management, while clearly recording the responsibility of the republican leadership, Kosior included, which knew the condition of the countryside and still put procurement first. From 1933 he also directed the delivery of seed and food relief to the famine regions and the sowing campaigns.

Kosior's name cannot be separated from a disaster that cost millions of lives. Archive-based historiography paints him neither as the architect of a deliberate massacre nor as a helpless bystander. He was the Ukrainian executor of the national choice of forced-pace industrialization, and no account of these years can omit the fact that the peasantry paid the price of that choice.$sec$,
    $src$["R. W. Davies and Stephen G. Wheatcroft, The Years of Hunger: Soviet Agriculture, 1931-1933 (Palgrave Macmillan, 2004)", "Stephen Kotkin, Stalin: Waiting for Hitler, 1929-1941 (Penguin, 2017)", "Terry Martin, The Affirmative Action Empire (Cornell University Press, 2001)", "R. W. Davies, Oleg Khlevniuk et al. (eds.), The Stalin-Kaganovich Correspondence, 1931-36 (Yale University Press, 2003)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'kosior')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'kosior', 'polish-operation-fall', 1,
    '1938년 5월 3일, 「폴란드군사조직」이라는 죄목',
    'May 3, 1938: the Charge of the "Polish Military Organization"',
    $sec$1938년 1월 코시오르는 우크라이나 당 지도부에서 물러나 모스크바로 옮겨져 소련 인민위원회의 부의장 겸 소비에트통제위원회 의장이 되었다. 승진처럼 보였던 이 인사는 몇 달 뒤 체포로 이어졌다. 1937년 8월 NKVD 명령 제00485호로 시작된 「폴란드 작전」은 폴란드 출신자와 폴란드 연고자를 겨냥한 대량 작전으로, 문서고 통계에 따르면 이 작전 하나로 11만 명 이상이 총살되었다. 폴란드 태생의 정치국원 코시오르는 이 광풍의 정점에서 1938년 5월 3일 체포되었다.

그에게 씌워진 죄목은 존재하지도 않는 지하조직 「폴란드군사조직(POW)」의 지도자라는 것이었다. 고문 끝에 자백이 받아내졌고, 1939년 2월 26일 군사법정에서 사형이 선고되어 같은 날 집행되었다. 같은 날 우크라이나에서 그와 함께 일했던 블라스 추바리와 파벨 포스티셰프도 총살되었다. 집단화의 집행자였던 사람이 몇 해 뒤 조작된 죄목으로 같은 기계에 갈려 나간 것이다.

1956년 소련 최고재판소는 코시오르를 복권했고, 흐루쇼프는 제20차 당대회 비밀연설에서 그의 사건을 조작된 탄압의 대표 사례로 직접 거명했다. 포스트소비에트 문서고 연구는 「폴란드군사조직」 사건 전체가 NKVD 내부에서 만들어진 허구였음을 확인했다. 코시오르의 생애는 1930년대의 두 얼굴, 즉 강행 건설의 책임과 조작된 테러의 희생이 한 사람 안에서 겹칠 수 있었음을 보여준다.$sec$,
    $sec$In January 1938 Kosior left the Ukrainian party leadership for Moscow, becoming deputy chairman of the USSR Council of People's Commissars and chairman of the Soviet Control Commission. What looked like a promotion led within months to arrest. The "Polish operation" launched by NKVD Order No. 00485 in August 1937 was a mass operation aimed at people of Polish origin and Polish connections; by archival count more than 110,000 people were shot in this operation alone. Kosior, a Polish-born member of the Politburo, was arrested at the height of this storm on May 3, 1938.

The charge against him was leadership of the "Polish Military Organization" (POW), an underground network that did not exist. A confession was extracted under torture, and on February 26, 1939 a military tribunal sentenced him to death; the sentence was carried out the same day. Vlas Chubar and Pavel Postyshev, who had worked alongside him in Ukraine, were shot on the same date. A man who had enforced collectivization was, a few years later, ground up by the same machine on fabricated charges.

In 1956 the USSR Supreme Court rehabilitated Kosior, and Khrushchev named his case in the Secret Speech to the Twentieth Congress as an emblematic instance of fabricated repression. Post-Soviet archival research confirmed that the entire "Polish Military Organization" case was a fiction manufactured inside the NKVD. Kosior's life shows how the two faces of the 1930s, responsibility for forced-pace construction and victimhood in a fabricated terror, could overlap in a single person.$sec$,
    $src$["Nikita Petrov and Arseny Roginsky, The Polish Operation of the NKVD, 1937-8, in Barry McLoughlin and Kevin McDermott (eds.), Stalin's Terror: High Politics and Mass Repression in the Soviet Union (Palgrave, 2003)", "Oleg Khlevniuk, Master of the House: Stalin and His Inner Circle (Yale University Press, 2009)", "J. Arch Getty and Oleg Naumov, The Road to Terror: Stalin and the Self-Destruction of the Bolsheviks, 1932-1939 (Yale University Press, 1999)", "N. S. Khrushchev, Secret Speech to the 20th Congress of the CPSU, February 25, 1956 (marxists.org)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'kosior')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Vasily Grossman (vasily-grossman)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'vasily-grossman', 'stalingrad-treblinka', 0,
    '1942년 가을, 스탈린그라드의 특파원',
    'Autumn 1942, a Correspondent in Stalingrad',
    $sec$바실리 그로스만은 베르디체프의 유대인 가정에서 태어나 화학기사로 돈바스 탄광에서 일하다 1930년대에 작가가 되었다. 1941년 전쟁이 터지자 그는 시력과 건강 문제로 후방에 남을 수 있었음에도 『크라스나야 즈베즈다(붉은 별)』의 종군기자를 자원했고, 이후 1,000일이 넘는 시간을 전선에서 보냈다. 1941년 9월 어머니 예카테리나가 독일 점령하의 베르디체프에서 학살당했다. 그는 이 죽음을 평생의 짐으로 지고 다녔고, 훗날 『삶과 운명』의 가장 유명한 장, 아들에게 보내는 어머니의 마지막 편지에 그 짐을 옮겨 놓았다.

1942년 8월부터 그로스만은 스탈린그라드에 있었다. 볼가강을 건너 시가전의 한복판까지 들어가 저격수 바실리 자이체프와 체호프, 구르티예프 사단의 병사들을 취재했고, 참호에서 병사들과 같은 위험을 나눴기에 그들의 신뢰를 얻었다. 그의 르포 「주공 방향」은 전선과 후방에서 두루 돌려 읽혔다. 스탈린그라드의 병사들이 무엇을 견뎌냈는가에 대한 가장 밀도 높은 기록 가운데 상당수가 그의 수첩에서 나왔다.

1944년 여름 붉은군대와 함께 폴란드에 들어간 그로스만은 트레블링카 절멸수용소 터에 도착해 생존자와 인근 주민 수십 명을 인터뷰했다. 그해 11월 『즈나먀』에 실린 「트레블링카의 지옥」은 절멸수용소의 작동 방식을 재구성한 최초의 본격적인 보고 가운데 하나였고, 뉘른베르크 재판에서 자료로 배포되었다. 파시즘의 실체를 세계에 알린 이 문서는 소비에트 종군 문학이 남긴 가장 무거운 업적에 속한다.$sec$,
    $sec$Vasily Grossman was born into a Jewish family in Berdichev, worked as a chemical engineer in the Donbass mines, and became a writer in the 1930s. When war broke out in 1941 he could have stayed in the rear on grounds of eyesight and health, but volunteered as a front correspondent for *Krasnaya Zvezda* (Red Star) and went on to spend more than a thousand days at the front. In September 1941 his mother Yekaterina was murdered in German-occupied Berdichev. He carried that death as a lifelong burden, and later poured it into the most famous chapter of *Life and Fate*, a mother's last letter to her son.

From August 1942 Grossman was in Stalingrad. He crossed the Volga into the heart of the street fighting, reported on the snipers Zaitsev and Chekhov and on the men of Gurtiev's division, and won the soldiers' trust because he shared their dangers in the trenches. His essay "The Direction of the Main Blow" was passed from hand to hand at the front and in the rear. A large share of the densest testimony about what the soldiers of Stalingrad endured came out of his notebooks.

Entering Poland with the Red Army in the summer of 1944, Grossman reached the site of the Treblinka extermination camp and interviewed dozens of survivors and local residents. "The Hell of Treblinka", published in *Znamya* that November, was among the first substantial accounts to reconstruct how an extermination camp worked, and it was distributed as documentation at the Nuremberg trials. This document, which showed the world the substance of fascism, belongs to the weightiest achievements of Soviet war literature.$sec$,
    $src$["Antony Beevor and Luba Vinogradova (eds.), A Writer at War: Vasily Grossman with the Red Army 1941-1945 (Harvill, 2005)", "John Garrard and Carol Garrard, The Bones of Berdichev: The Life and Fate of Vasily Grossman (Free Press, 1996)", "Vasily Grossman, The Hell of Treblinka, Znamya, no. 11 (1944)", "Alexandra Popoff, Vasily Grossman and the Soviet Century (Yale University Press, 2019)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'vasily-grossman')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
-- Uses the slug already created by the commulingo-maintainer service (2026-07-12)
-- so this richer bilingual version replaces it instead of duplicating the topic.
SELECT 'vasily-grossman', 'manuscript-arrest', 1,
    '1961년 2월 14일, 원고의 체포',
    'February 14, 1961: the Arrest of a Manuscript',
    $sec$1960년 그로스만은 스탈린그라드 전투를 축으로 전쟁의 세기를 통째로 담은 대작 『삶과 운명』을 완성해 잡지 『즈나먀』에 투고했다. 편집장 코제브니코프는 원고를 당 기관에 넘겼고, 1961년 2월 14일 KGB 요원들이 그의 아파트에 찾아와 원고와 사본, 초고, 심지어 타자기 리본까지 압수해 갔다. 작가는 체포되지 않았다. 체포된 것은 책이었다.

그로스만은 흐루쇼프에게 「내 책에 자유를 달라」는 편지를 썼고, 1962년 이데올로기 담당 서기 수슬로프의 접견을 받았다. 그로스만이 남긴 기록에 따르면 수슬로프는 이 책이 200~300년 안에는 출판될 수 없다고 말했다. 그러나 친구 세묜 립킨이 보관한 사본이 살아남았고, 훗날 보이노비치와 사하로프의 도움으로 마이크로필름이 국외로 반출되어 1980년 로잔에서 초판이 나왔다. 소련에서는 1988년 글라스노스트 시기에 출판되었다. 그로스만 자신은 그 어느 것도 보지 못한 채 1964년 9월 14일 위암으로 사망했다.

『삶과 운명』은 톨스토이적 서사 안에 스탈린그라드의 영웅성과 국가의 압제를 함께 담은 작품으로, 파시즘에 승리한 인민과 그 인민을 옥죈 관료제를 같은 화폭에 그렸다. 이 원고의 압수는 해빙기 문화 정책의 한계를 보여주는 사건으로 기록되며, 책의 귀환은 소련 사회가 자신의 역사를 정면으로 마주보기 시작한 글라스노스트의 상징적 장면이 되었다.$sec$,
    $sec$In 1960 Grossman completed *Life and Fate*, a vast novel that held the whole century of war around the axis of Stalingrad, and submitted it to the journal *Znamya*. The editor Kozhevnikov passed the manuscript to the party organs, and on February 14, 1961 KGB officers came to his apartment and confiscated the manuscript, its copies, the drafts, even the typewriter ribbons. The writer was not arrested. The book was.

Grossman wrote to Khrushchev demanding freedom for his book, and in 1962 was received by Suslov, the secretary for ideology. According to Grossman's own record of the meeting, Suslov told him the book could not be published for two or three hundred years. But a copy kept by his friend Semyon Lipkin survived; years later, with the help of Voinovich and Sakharov, a microfilm was carried abroad, and the first edition appeared in Lausanne in 1980. In the Soviet Union it was published in 1988, under glasnost. Grossman himself saw none of this: he died of stomach cancer on September 14, 1964.

*Life and Fate* holds the heroism of Stalingrad and the weight of state coercion within a single Tolstoyan canvas, painting the people who defeated fascism and the bureaucracy that constrained them in the same frame. The confiscation of the manuscript is recorded as a marker of the limits of Thaw-era cultural policy, and the book's return became one of the emblematic scenes of glasnost, when Soviet society began to face its own history directly.$sec$,
    $src$["Alexandra Popoff, Vasily Grossman and the Soviet Century (Yale University Press, 2019)", "John Garrard and Carol Garrard, The Bones of Berdichev: The Life and Fate of Vasily Grossman (Free Press, 1996)", "Semyon Lipkin, Zhizn i sudba Vasiliya Grossmana (1990)", "Robert Chandler, introduction to Vasily Grossman, Life and Fate (NYRB Classics, 2006)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'vasily-grossman')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Solomon Lozovsky (lozovsky)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'lozovsky', 'profintern-sovinformburo', 0,
    '1941년 가을, 소빈포름뷰로의 브리핑 단상에서',
    'Autumn 1941, at the Sovinformburo Briefing Podium',
    $sec$솔로몬 로조프스키는 1901년 러시아사회민주노동당에 입당한 고참 혁명가로, 망명지 파리에서 노동조합 운동을 조직했고 혁명 후에는 국제 노동운동의 붉은 축을 세우는 일에 반평생을 바쳤다. 1921년부터 1937년까지 적색노동조합인터내셔널(프로핀테른)의 총서기로서 수십 개 나라의 좌파 노조를 하나의 국제 조직으로 묶었고, 여러 언어를 구사하는 이론가이자 조직가로서 국제 공산주의 운동에서 손꼽히는 노동운동 전문가였다. 1939년에는 외무인민위원부 부인민위원이 되었다.

전쟁은 그에게 새로운 단상을 주었다. 1941년 6월 창설된 소비에트정보국(소빈포름뷰로)의 부국장으로서 그는 모스크바와 쿠이비셰프에서 외국 특파원들을 상대로 정례 브리핑을 열었다. 독일군이 모스크바 코앞까지 진격한 1941년 가을의 가장 어두운 몇 주 동안, 노련하고 침착하며 때로 신랄한 그의 브리핑은 소련이 무너지지 않는다는 사실을 세계 언론에 전하는 통로였다. 1945년부터 1948년까지는 소빈포름뷰로 국장을 지냈다.

그의 감독 아래 1942년 유대인반파시스트위원회(JAC)를 비롯한 여러 반파시스트 위원회가 조직되었다. 미헤일스가 이끈 JAC의 미국 순회는 소련의 전쟁 수행을 위한 거액의 연대 기금을 모았고, 세계 여론을 반파시즘 전선으로 묶는 데 기여했다. 전쟁 승리에 바친 이 사업이 몇 해 뒤 그를 파멸시키는 죄목으로 뒤바뀌리라는 것을 당시에는 아무도 알지 못했다.$sec$,
    $sec$Solomon Lozovsky was a veteran revolutionary who joined the Russian Social Democratic Labour Party in 1901, organized trade union work in Parisian exile, and after the revolution gave half his life to building the red axis of the international labor movement. As general secretary of the Red International of Labour Unions (Profintern) from 1921 to 1937 he bound left trade unions of dozens of countries into a single international, and as a multilingual theorist and organizer he was one of the international communist movement's foremost specialists on labor. In 1939 he became a deputy people's commissar of foreign affairs.

The war gave him a new podium. As deputy chief of the Soviet Information Bureau (Sovinformburo), created in June 1941, he held regular briefings for foreign correspondents in Moscow and Kuibyshev. In the darkest weeks of autumn 1941, with the Wehrmacht at the approaches to Moscow, his seasoned, calm, and often sharp-tongued briefings were the channel through which the world press learned that the Soviet Union was not collapsing. From 1945 to 1948 he headed the Sovinformburo.

Under his supervision the Jewish Anti-Fascist Committee (JAC) and several other anti-fascist committees were organized in 1942. The JAC's American tour, led by Mikhoels, raised large solidarity funds for the Soviet war effort and helped bind world opinion into the anti-fascist front. No one then could know that this work, given to the cause of victory, would a few years later be twisted into the charge that destroyed him.$sec$,
    $src$["Joshua Rubenstein and Vladimir P. Naumov (eds.), Stalin's Secret Pogrom: The Postwar Inquisition of the Jewish Anti-Fascist Committee (Yale University Press, 2001)", "Shimon Redlich, War, Holocaust and Stalinism: A Documented History of the Jewish Anti-Fascist Committee in the USSR (Harwood, 1995)", "Gennadi Kostyrchenko, Out of the Red Shadows: Anti-Semitism in Stalin's Russia (Prometheus, 1995)", "Reiner Tosstorff, The Red International of Labour Unions (RILU) 1920-1937 (Brill, 2016)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'lozovsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'lozovsky', 'jac-trial-1952', 1,
    '1952년 여름, 법정에서의 마지막 변론',
    'Summer 1952, a Last Defense in the Courtroom',
    $sec$1948년 말 유대인반파시스트위원회가 해산되고 전후 반유대주의 캠페인이 본격화되면서 로조프스키의 운명이 결정되었다. 1949년 1월 그는 당에서 제명되고 체포되었다. 크림반도에 유대인 공화국을 세워 미국에 넘기려 했다는 등의 혐의는 처음부터 끝까지 조작이었고, 3년에 걸친 수사 동안 칠십 대의 그에게서 자백이 짜내어졌다.

1952년 5월부터 7월까지 군사법정에서 열린 비공개 재판에서 로조프스키는 놀라운 일을 해냈다. 그는 법정에서 자백을 전면 철회하고, 며칠에 걸친 진술을 통해 기소장의 논리를 조목조목 해체했다. 반세기 당력의 노혁명가가 기억과 논리만으로 사건 전체가 허구임을 입증해 가는 이 변론은 함께 기소된 피고인들까지 용기 내어 자백을 철회하게 만들었다. 재판장 체프초프조차 사건의 재수사를 상부에 요청했으나 기각되었다. 1952년 7월 18일 사형이 선고되었고, 8월 12일 로조프스키는 시인 페레츠 마르키시, 다비트 베르겔손, 레이프 크비트코 등과 함께 총살되었다. 이날은 「살해된 시인들의 밤」으로 기억된다.

1955년 11월 소련 군사법정은 사건 전체가 조작임을 인정하고 피고인 전원을 복권했다. 1990년대에 공개된 재판 기록은 로조프스키의 변론을 온전히 담고 있으며, 루벤스타인과 나우모프가 편집한 영역본으로 출판되었다. 조작된 법정에서조차 논리와 존엄을 무기로 싸운 그의 마지막 나날은, 전후 반유대주의 캠페인이라는 어두운 장 안에서 가장 빛나는 기록으로 남아 있다.$sec$,
    $sec$With the dissolution of the Jewish Anti-Fascist Committee at the end of 1948 and the hardening of the postwar antisemitic campaign, Lozovsky's fate was sealed. In January 1949 he was expelled from the party and arrested. The charges, including a plot to establish a Jewish republic in Crimea and hand it to the United States, were fabricated from beginning to end, and over three years of investigation a confession was wrung out of a man in his seventies.

At the closed trial before the Military Collegium from May to July 1952, Lozovsky did something remarkable. He retracted his confession in open court and, in testimony spread over several days, dismantled the logic of the indictment point by point. This defense, in which an old revolutionary with half a century in the movement proved from memory and logic alone that the entire case was fiction, gave his co-defendants the courage to withdraw their own confessions. Even the presiding judge, Cheptsov, asked his superiors to return the case for reinvestigation and was refused. On July 18, 1952 the death sentence was pronounced, and on August 12 Lozovsky was shot together with the poets Peretz Markish, David Bergelson, Leib Kvitko and others. The date is remembered as the Night of the Murdered Poets.

In November 1955 the Soviet military court acknowledged that the whole case had been fabricated and rehabilitated all the defendants. The trial transcript, opened in the 1990s, preserves Lozovsky's defense in full and has been published in the English edition prepared by Rubenstein and Naumov. His final days, fighting with logic and dignity even inside a rigged courtroom, remain the brightest record within the dark chapter of the postwar antisemitic campaign.$sec$,
    $src$["Joshua Rubenstein and Vladimir P. Naumov (eds.), Stalin's Secret Pogrom: The Postwar Inquisition of the Jewish Anti-Fascist Committee (Yale University Press, 2001)", "Gennadi Kostyrchenko, Tainaya politika Stalina: vlast i antisemitizm (Mezhdunarodnye otnosheniya, 2001)", "Shimon Redlich, War, Holocaust and Stalinism: A Documented History of the Jewish Anti-Fascist Committee in the USSR (Harwood, 1995)", "Aleksandr Cheptsov, memorandum on the JAC trial (1957), published in Rubenstein and Naumov (2001)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'lozovsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Pavel Sudoplatov (sudoplatov)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'sudoplatov', 'special-tasks', 0,
    '1938년 5월 23일, 로테르담의 초콜릿 상자',
    'May 23, 1938: a Box of Chocolates in Rotterdam',
    $sec$파벨 수도플라토프는 멜리토폴 태생으로 소년 시절 내전의 한복판에서 붉은군대에 들어갔고, 십 대에 이미 체카 계통에서 일하기 시작했다. 1930년대에 그는 밀사로 위장해 국외의 우크라이나 민족주의자조직(OUN)에 침투했다. OUN의 지도자 예브겐 코노발레츠는 독일 정보기관과 손잡고 소련을 겨냥한 공작을 준비하던 인물이었다. 1938년 5월 23일 로테르담의 한 카페에서 수도플라토프는 코노발레츠에게 폭탄이 장치된 초콜릿 상자를 건네고 자리를 떴다. 몇 분 뒤 폭발로 코노발레츠는 즉사했고, 수도플라토프는 유럽을 가로질러 무사히 귀환했다.

1939년 스탈린은 그를 직접 불러 트로츠키를 겨냥한 작전, 암호명 「우트카(오리)」의 책임을 맡겼다. 수도플라토프는 예이팅곤과 함께 멕시코 공작망을 구축했고, 1940년 8월 라몬 메르카데르가 트로츠키를 살해했다. 전쟁이 터지자 그는 NKVD 특수임무국(후일 제4국)의 수장으로서 적 후방의 파르티잔전과 파괴 공작, 그리고 아프베어를 상대로 한 「모나스티리」, 「베레지노」 같은 무전 기만전을 총괄했다.

전쟁 말기부터는 S국을 이끌며 클라우스 푹스를 비롯한 해외 정보망이 보내온 원자폭탄 관련 정보를 정리해 쿠르차토프의 개발 계획에 연결하는 조정자 역할을 맡았다. 특수작전과 정보전이라는 소비에트 정보기관의 가장 은밀한 영역을 20년 가까이 관통한 경력이었고, 그 경력의 무게가 훗날 그의 운명을 결정하게 된다.$sec$,
    $sec$Pavel Sudoplatov was born in Melitopol, joined the Red Army as a boy in the midst of the civil war, and began working in the Cheka apparatus while still in his teens. In the 1930s he infiltrated the Organization of Ukrainian Nationalists (OUN) abroad in the guise of a courier. The OUN's leader, Yevhen Konovalets, was working with German intelligence and preparing operations aimed at the Soviet Union. On May 23, 1938, in a Rotterdam cafe, Sudoplatov handed Konovalets a box of chocolates rigged with a bomb and left. Minutes later the explosion killed Konovalets instantly, and Sudoplatov made his way safely back across Europe.

In 1939 Stalin summoned him personally and put him in charge of the operation against Trotsky, code-named "Utka" (Duck). Together with Eitingon he built the network in Mexico, and in August 1940 Ramón Mercader killed Trotsky. When the war began, Sudoplatov headed the NKVD's Administration for Special Tasks (later the Fourth Directorate), directing partisan warfare and sabotage behind enemy lines and the radio deception games against the Abwehr known as "Monastyr" and "Berezino".

From the end of the war he led Department S, the coordinating desk that collated atomic intelligence arriving from Klaus Fuchs and other foreign sources and channeled it into Kurchatov's bomb program. His career ran for nearly twenty years through the most secret domains of Soviet intelligence, special operations and deception, and the weight of that career would later decide his fate.$sec$,
    $src$["Pavel Sudoplatov and Anatoli Sudoplatov, with Jerrold L. and Leona P. Schecter, Special Tasks: The Memoirs of an Unwanted Witness (Little, Brown, 1994)", "Christopher Andrew and Vasili Mitrokhin, The Mitrokhin Archive: The KGB in Europe and the West (Allen Lane, 1999)", "David Holloway, Stalin and the Bomb: The Soviet Union and Atomic Energy, 1939-1956 (Yale University Press, 1994)", "Amy Knight, Beria: Stalin's First Lieutenant (Princeton University Press, 1993)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'sudoplatov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'sudoplatov', 'vladimir-prison-memoirs', 1,
    '1953년 8월, 블라디미르 감옥으로 가는 길',
    'August 1953, the Road to Vladimir Prison',
    $sec$1953년 6월 베리야가 실각하자 그의 계통에서 일했던 간부들에 대한 숙청이 뒤따랐다. 수도플라토프는 그해 8월 자신의 집무실에서 체포되었다. 그는 혐의를 인정하지 않았고, 수사가 길어지자 정신 이상을 가장해 수 년을 감옥 정신병원에서 버텼다. 1958년 결국 15년형이 선고되었고, 그는 1968년 8월까지 블라디미르 중앙감옥에서 복역했다. 옥중에서 뇌졸중을 겪어 한쪽 눈의 시력을 잃은 채 출소한 그는 이후 사반세기 동안 복권을 위해 싸웠고, 1992년 1월에야 복권되었다.

1994년 미국에서 출판된 회고록 『특수임무』는 소비에트 정보사의 내부를 담은 일급 증언으로 큰 반향을 일으켰지만, 동시에 격렬한 사료 논쟁을 불러왔다. 특히 오펜하이머, 페르미, 보어 같은 서방 과학자들이 소련 정보기관에 의식적으로 협력했다는 주장은 데이비드 홀로웨이를 비롯한 핵개발사 연구자들과 물리학계의 검증에서 문서적 근거가 없는 것으로 판정되었다. 오늘날의 연구는 이 회고록을 문서고 자료와 대조해 선별적으로만 사용한다.

수도플라토프는 1996년 모스크바에서 사망했다. 그의 생애는 소비에트 국가가 가장 위험한 시기에 운용한 특수작전의 실체와, 그 도구였던 사람들이 정치의 풍향이 바뀔 때 치른 대가를 동시에 보여준다. 코노발레츠와 트로츠키 작전의 집행자였고 파르티잔전과 원자 정보전의 조정자였던 그는, 인생의 마지막 40년을 자신이 봉사했던 국가를 상대로 한 명예 회복 투쟁에 바쳤다.$sec$,
    $sec$When Beria fell in June 1953, a purge of the officers who had worked in his apparatus followed. Sudoplatov was arrested in his own office that August. He refused to admit the charges, and as the investigation dragged on he feigned insanity, holding out for years in prison psychiatric hospitals. In 1958 he was finally sentenced to fifteen years, which he served in Vladimir Central Prison until August 1968. He left prison half-blind after a stroke, fought for rehabilitation for a quarter of a century, and was rehabilitated only in January 1992.

His memoir *Special Tasks*, published in the United States in 1994, caused a sensation as first-hand testimony from inside Soviet intelligence history, but it also ignited a fierce controversy over its reliability. In particular, its claims that Western scientists such as Oppenheimer, Fermi, and Bohr knowingly cooperated with Soviet intelligence were examined by historians of the atomic project, David Holloway among them, and by the physics community, and found to lack documentary support. Scholarship today uses the memoir selectively, checking it against archival records.

Sudoplatov died in Moscow in 1996. His life displays at once the reality of the special operations the Soviet state ran in its most dangerous years, and the price paid by the instruments of those operations when the political wind changed. The executor of the Konovalets and Trotsky operations and the coordinator of partisan warfare and atomic intelligence spent the last forty years of his life fighting for his good name against the state he had served.$sec$,
    $src$["Pavel Sudoplatov and Anatoli Sudoplatov, with Jerrold L. and Leona P. Schecter, Special Tasks: The Memoirs of an Unwanted Witness (Little, Brown, 1994)", "David Holloway, Stalin and the Bomb: The Soviet Union and Atomic Energy, 1939-1956 (Yale University Press, 1994)", "Hans A. Bethe, Kurt Gottfried and Roald Z. Sagdeev, Did Bohr Share Nuclear Secrets?, Scientific American, May 1995", "Amy Knight, Beria: Stalin's First Lieutenant (Princeton University Press, 1993)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'sudoplatov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Pavel Postyshev (postyshev)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'postyshev', 'ukraine-1933', 0,
    '1933년 1월, 하르키우로 내려온 전권',
    'January 1933, Plenipotentiary Powers Sent to Kharkiv',
    $sec$파벨 포스티셰프는 이바노보-보즈네센스크의 직조공 가정에서 태어나 1904년 당에 들어간 노동자 출신 혁명가였다. 유형과 지하활동, 극동 내전을 거쳐 1920년대에 우크라이나에서 당 사업을 했고, 1930년부터 전연방 중앙위원회 서기로 일했다. 1933년 1월, 조달 위기와 기근이 정점으로 치닫던 시점에 그는 우크라이나 공산당 제2서기로 파견되었다. 형식상 2인자였으나 전연방 중앙위 서기직을 유지한 채 내려온 그는 사실상 모스크바의 전권대표였다.

포스티셰프의 임무는 두 가지였다. 곡물 조달과 파종 캠페인을 완수하는 것, 그리고 우크라이나 당 기구를 「민족주의적 편향」으로부터 숙청하는 것이었다. 그는 기근이 농촌을 휩쓰는 와중에 조달 압박을 유지했고, 동시에 종자 대여와 구호의 집행을 지휘했다. 우크라이나화 정책의 상징이던 스크리프니크는 그의 주도로 진행된 비판 캠페인 속에서 1933년 7월 자살했다. 데이비스와 위트크로프트, 테리 마틴의 연구는 이 시기 포스티셰프가 위기 수습의 관리자이자 정치적 숙청의 집행자라는 두 역할을 동시에 수행했음을 문서로 보여준다.

1934년부터 그는 키예프로 옮긴 우크라이나 수도의 재건과 공업화 완수를 지휘하며 공화국의 실질적 지배자로 군림했다. 기근의 해에 우크라이나에 파견된 인물이라는 사실은 그의 이름에서 지워지지 않으며, 이 시기의 책임은 아카이브가 확인하는 그대로 기록되어야 한다.$sec$,
    $sec$Pavel Postyshev was a worker-revolutionary, born into a weaver's family in Ivanovo-Voznesensk, who joined the party in 1904. After exile, underground work, and the civil war in the Far East, he worked in the Ukrainian party in the 1920s and from 1930 served as a secretary of the all-union Central Committee. In January 1933, as the procurement crisis and the famine reached their peak, he was sent to Ukraine as second secretary of the republican party. Formally the number two, he arrived retaining his all-union secretaryship and was in effect Moscow's plenipotentiary.

Postyshev's mandate was twofold: to complete the grain procurement and sowing campaigns, and to purge the Ukrainian party apparatus of "nationalist deviation". He kept up the procurement pressure while famine swept the countryside, and at the same time directed the distribution of seed loans and relief. Skrypnyk, the symbol of the Ukrainization policy, killed himself in July 1933 amid the denunciation campaign Postyshev led. The research of Davies and Wheatcroft and of Terry Martin documents how in these months Postyshev performed both roles at once, manager of crisis relief and executor of a political purge.

From 1934 he presided over the transfer of the republican capital to Kiev, its reconstruction, and the completion of industrialization, ruling as the republic's de facto master. The fact that he was the man sent to Ukraine in the famine year cannot be detached from his name, and the responsibility of these months must be recorded exactly as the archives confirm it.$sec$,
    $src$["R. W. Davies and Stephen G. Wheatcroft, The Years of Hunger: Soviet Agriculture, 1931-1933 (Palgrave Macmillan, 2004)", "Terry Martin, The Affirmative Action Empire (Cornell University Press, 2001)", "Stephen Kotkin, Stalin: Waiting for Hitler, 1929-1941 (Penguin, 2017)", "Oleg Khlevniuk, Master of the House: Stalin and His Inner Circle (Yale University Press, 2009)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'postyshev')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'postyshev', 'yolka-and-terror', 1,
    '1935년 12월 28일, 욜카를 되살린 편지',
    'December 28, 1935: the Letter That Brought Back the Yolka',
    $sec$1935년 12월 28일자 『프라우다』에 포스티셰프의 짧은 기고가 실렸다. 종교적 잔재로 몰려 금지되어 있던 새해 전나무(욜카)를 아이들에게 돌려주자는 제안이었다. 「우리 아이들에게 좋은 욜카를 만들어 주자」는 이 편지가 실린 지 며칠 만에 전국의 학교와 문화궁전에 전나무가 세워졌고, 데드 모로스와 스네구로치카가 함께하는 새해 축제는 이후 소비에트 생활의 가장 사랑받는 풍습으로 자리 잡았다. 수천만의 소련 아이들에게 포스티셰프는 이름 모를 새해의 은인이었다.

그러나 같은 사람의 다른 얼굴이 있다. 1937년 3월 그는 니콜라엔코 사건을 계기로 우크라이나에서 소환되어 쿠이비셰프주 제1서기로 전보되었고, 그곳에서 대공포의 가장 열성적인 집행자 중 하나가 되었다. 그는 수십 개의 군당위원회를 「적의 소굴」로 규정해 통째로 해산했고, 당원 수천 명을 제명으로 몰아넣었다. 1938년 1월 중앙위원회 전원회의에서 말렌코프가 바로 이 「과잉」을 문제 삼아 그를 공격했고, 포스티셰프는 정치국 후보위원에서 해임되었다. 한 달 뒤 그는 체포되었고, 1939년 2월 26일 총살되었다. 같은 날 코시오르와 추바리도 처형되었다.

포스티셰프는 1955년 복권되었다. 기근의 해의 전권대표, 욜카를 되살린 편지의 필자, 쿠이비셰프 숙청의 광풍, 그리고 조작된 죄목의 희생자. 이 네 가지는 모두 같은 사람의 사실이며, 아카이브에 기초한 역사는 그중 어느 하나도 지우지 않고 기록한다.$sec$,
    $sec$On December 28, 1935 *Pravda* carried a short letter from Postyshev proposing that the New Year fir tree (yolka), banned as a religious survival, be given back to the children. Within days of the letter, "Let's organize a good yolka for the children", fir trees stood in schools and palaces of culture across the country, and the New Year holiday with Ded Moroz and Snegurochka became one of the most beloved customs of Soviet life. To tens of millions of Soviet children, Postyshev was the unnamed benefactor of the New Year.

But the same man had another face. In March 1937, following the Nikolaenko affair, he was recalled from Ukraine and transferred to Kuibyshev as first secretary of the oblast, where he became one of the most zealous executors of the Great Terror. He declared dozens of district party committees "nests of enemies" and dissolved them wholesale, driving thousands of members to expulsion. At the January 1938 Central Committee plenum it was precisely these "excesses" that Malenkov attacked him for, and Postyshev was removed from candidate membership of the Politburo. A month later he was arrested; on February 26, 1939 he was shot, on the same day as Kosior and Chubar.

Postyshev was rehabilitated in 1955. The plenipotentiary of the famine year, the author of the letter that revived the yolka, the frenzy of the Kuibyshev purge, and the victim of fabricated charges: all four are facts about the same man, and archive-based history records every one of them without erasure.$sec$,
    $src$["Karen Petrone, Life Has Become More Joyous, Comrades: Celebrations in the Time of Stalin (Indiana University Press, 2000)", "P. P. Postyshev, letter on organizing New Year trees for children, Pravda, December 28, 1935", "J. Arch Getty and Oleg Naumov, The Road to Terror: Stalin and the Self-Destruction of the Bolsheviks, 1932-1939 (Yale University Press, 1999)", "Oleg Khlevniuk, Master of the House: Stalin and His Inner Circle (Yale University Press, 2009)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'postyshev')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Yan Gamarnik (gamarnik)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'gamarnik', 'pur-chief', 0,
    '1929년, 붉은군대 정치총국의 수장',
    '1929, Chief of the Red Army Political Administration',
    $sec$얀 가마르니크는 지토미르의 유대인 가정에서 태어나 1916년 볼셰비키에 입당했고, 내전기 우크라이나에서 지하활동과 정치위원 사업으로 단련된 세대의 전형이었다. 내전 후 그는 극동으로 보내져 달네보스토치니 지방당을 이끌며 이 광대한 변경의 소비에트화와 개발을 지휘했고, 이어 벨로루시야 당 제1서기를 지냈다.

1929년 그는 붉은군대 정치총국(PUR)의 수장으로 임명되었고, 이듬해부터 국방인민위원 제1부위원과 혁명군사평의회 부의장을 겸했다. 정치총국은 군의 당 조직과 정치교육, 간부 정책을 관장하는 기구였고, 가마르니크는 이 자리에서 8년 동안 군의 정치 사업과 군사 전문성의 결합을 관리했다. 그는 투하체프스키, 우보레비치, 야키르 등과 함께 기계화와 항공, 간부 양성을 축으로 한 군 현대화를 뒷받침했으며, 극동 근무의 경험을 살려 특별극동군의 증강과 극동 개발 사업에도 깊이 관여했다.

1930년대 중반의 붉은군대는 세계에서 가장 빠르게 현대화되는 군대 가운데 하나였고, 그 정치적 골간을 관리한 것이 가마르니크였다. 군과 당을 잇는 바로 그 위치가, 군 지휘부에 대한 의심이 폭발한 1937년에 그를 가장 위험한 자리에 세우게 된다.$sec$,
    $sec$Yan Gamarnik was born into a Jewish family in Zhitomir, joined the Bolsheviks in 1916, and was a characteristic figure of the generation forged by underground work and commissar service in civil-war Ukraine. After the war he was sent to the Far East, where he led the regional party organization and directed the sovietization and development of that vast frontier, and then served as first secretary of the party in Belorussia.

In 1929 he was appointed head of the Political Administration of the Red Army (PUR), and from the following year also first deputy people's commissar of defense and deputy chairman of the Revolutionary Military Council. The Political Administration ran the army's party organizations, political education, and cadre policy, and for eight years Gamarnik managed the joining of political work and military professionalism. Together with Tukhachevsky, Uborevich, and Yakir he underpinned the modernization of the army built around mechanization, aviation, and officer training, and drawing on his Far Eastern experience he was deeply involved in strengthening the Special Far Eastern Army and in Far Eastern development.

The Red Army of the mid-1930s was among the most rapidly modernizing armies in the world, and Gamarnik managed its political backbone. That very position, the hinge between army and party, would place him in the most dangerous spot of all when suspicion of the high command exploded in 1937.$sec$,
    $src$["Peter Whitewood, The Red Army and the Great Terror: Stalin's Purge of the Soviet Military (University Press of Kansas, 2015)", "John Erickson, The Soviet High Command: A Military-Political History, 1918-1941 (Macmillan, 1962)", "Stephen Kotkin, Stalin: Waiting for Hitler, 1929-1941 (Penguin, 2017)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'gamarnik')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'gamarnik', 'may-1937', 1,
    '1937년 5월 31일, 마지막 아침',
    'May 31, 1937: the Last Morning',
    $sec$1937년 5월 말, 투하체프스키 사건이 군 수뇌부를 삼키고 있었다. 투하체프스키, 야키르, 우보레비치가 잇따라 체포되었고, 이들과 오랜 세월 함께 일해 온 가마르니크의 처지는 하루가 다르게 좁아졌다. 5월 30일 그는 국방인민위원 부위원직에서 해임되었다. 5월 31일 아침, 군 간부들이 병으로 누워 있던 그의 아파트를 찾아와 군사평의회 위원직 해임을 통보했다. 그들이 떠난 직후 가마르니크는 권총으로 스스로 목숨을 끊었다. 체포와 심문, 그리고 조작된 자백 대신 그가 택한 길이었다.

다음 날 『프라우다』는 그가 「반소비에트 분자들과 얽혀 자멸했다」고 보도했다. 6월 11일 투하체프스키와 일곱 명의 지휘관이 비공개 군사법정에서 사형을 선고받고 처형되었고, 가마르니크는 사후에 「군사-파시스트 음모」의 일원으로 낙인찍혔다. 탄압은 가족에게로 이어져 아내 블류마는 1938년 총살되었고 어린 딸은 보육원과 수용소를 거쳐야 했다.

가마르니크는 1955년 복권되었다. 문서고에 기초한 연구는 「군사-파시스트 음모」 사건 전체가 고문으로 짜낸 자백 위에 세워진 조작이었으며 실재하는 음모는 없었다는 결론에 도달했다. 대숙청이 붉은군대의 지휘부와 정치 간부단에 남긴 손실은 1941년의 재난에서 혹독한 값을 치렀고, 가마르니크의 마지막 아침은 그 손실의 서두에 놓인 장면으로 기록된다.$sec$,
    $sec$At the end of May 1937 the Tukhachevsky case was swallowing the army's high command. Tukhachevsky, Yakir, and Uborevich were arrested one after another, and the ground under Gamarnik, who had worked with them for years, narrowed by the day. On May 30 he was dismissed as deputy people's commissar of defense. On the morning of May 31, army officials came to the apartment where he lay ill and informed him of his removal from the Military Council. Shortly after they left, Gamarnik shot himself. It was the road he chose instead of arrest, interrogation, and a fabricated confession.

The next day *Pravda* reported that he had "become entangled with anti-Soviet elements" and destroyed himself. On June 11 Tukhachevsky and seven commanders were sentenced to death by a closed military tribunal and executed, and Gamarnik was posthumously branded a member of the "military-fascist plot". The repression reached his family: his wife Blyuma was shot in 1938, and his young daughter passed through orphanages and the camps.

Gamarnik was rehabilitated in 1955. Archive-based research has concluded that the entire "military-fascist plot" was a fabrication built on confessions extracted under torture, and that no real conspiracy existed. The losses the purge inflicted on the Red Army's command and political cadre were paid for cruelly in the catastrophe of 1941, and Gamarnik's last morning stands recorded as the opening scene of that loss.$sec$,
    $src$["Oleg Khlevniuk, Stalin: New Biography of a Dictator (Yale University Press, 2015)", "Peter Whitewood, The Red Army and the Great Terror: Stalin's Purge of the Soviet Military (University Press of Kansas, 2015)", "Stephen Kotkin, Stalin: Waiting for Hitler, 1929-1941 (Penguin, 2017)", "Pravda, announcement on the suicide of Ya. B. Gamarnik, June 1, 1937"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'gamarnik')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Georgy Malenkov (malenkov)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'malenkov', 'premier-1953', 0,
    '1953년 8월 8일, 최고회의 연단의 새 노선',
    'August 8, 1953: a New Course from the Supreme Soviet Rostrum',
    $sec$게오르기 말렌코프는 오렌부르크 출신으로 내전기에 정치사업 요원으로 복무한 뒤 당 기구의 계단을 조용히 올라간 전형적인 기구 간부였다. 1930년대에 중앙위원회 지도당기관부(ORPO)를 이끌며 전국 간부들의 인사 기록을 관장하는 「인사 서류철의 지배자」가 되었고, 이 위치에서 대숙청기의 지방 숙청에도 관여했다. 전쟁 중에는 국가방위위원회 위원으로 항공기 생산을 담당했고, 전후에는 1949년 레닌그라드 사건의 조직자 가운데 하나였다. 1952년 10월 제19차 당대회에서 중앙위원회 사업보고를 한 것은 스탈린이 아니라 말렌코프였다. 후계 구도의 신호였다.

1953년 3월 스탈린이 사망하자 말렌코프는 소련 각료회의 의장, 곧 정부 수반이 되었다. 그해 8월 8일 최고회의 연단에서 그는 전후 소련 경제의 방향을 트는 연설을 했다. 중공업 일변도에서 소비재 생산으로 무게를 옮기고, 농업세를 대폭 낮추며, 콜호스 수매 가격을 올리고 미납금을 탕감한다는 내용이었다. 농촌은 이 연설을 기억했다. 「말렌코프가 오니 블린을 먹게 되었다」는 농민들의 말이 전해질 정도였다.

1954년 3월에는 소련 지도자로서는 처음으로, 핵무기 시대의 세계전쟁은 「세계 문명의 파멸」을 뜻한다고 공개적으로 말했다. 동료들에게서 이념적 오류라고 비판받고 곧 표현을 후퇴시켜야 했던 이 발언은, 훗날 평화공존 노선으로 정식화될 인식을 앞질러 내놓은 것이었다. 짧았던 말렌코프 시대는 탈스탈린화가 시작되기 전에 이미 방향 전환이 준비되고 있었음을 보여준다.$sec$,
    $sec$Georgy Malenkov, born in Orenburg, served as a political worker in the civil war and then climbed the party apparatus quietly, the very type of the machine cadre. In the 1930s he headed the Central Committee's Department of Leading Party Organs (ORPO), master of the personnel files of the country's cadres, and from that position was also involved in the regional purges of the Great Terror. During the war he sat on the State Defense Committee with responsibility for aircraft production, and after it he was one of the organizers of the Leningrad affair of 1949. At the Nineteenth Party Congress in October 1952 it was Malenkov, not Stalin, who delivered the Central Committee report: a signal of the succession.

When Stalin died in March 1953, Malenkov became chairman of the USSR Council of Ministers, head of the government. On August 8 that year, from the rostrum of the Supreme Soviet, he gave a speech that turned the direction of the postwar economy: weight would shift from heavy industry alone toward consumer goods, the agricultural tax would be cut sharply, procurement prices paid to the kolkhozes raised, and arrears written off. The countryside remembered the speech; peasants were heard to say that when Malenkov came, they ate pancakes.

In March 1954 he became the first Soviet leader to state publicly that a world war in the nuclear age would mean "the destruction of world civilization". Criticized by his colleagues as an ideological error, the formula soon had to be softened, but it anticipated the understanding later codified as peaceful coexistence. The brief Malenkov era shows that the change of course was already being prepared before de-Stalinization had a name.$sec$,
    $src$["Yoram Gorlizki and Oleg Khlevniuk, Cold Peace: Stalin and the Soviet Ruling Circle, 1945-1953 (Oxford University Press, 2004)", "William Taubman, Khrushchev: The Man and His Era (W. W. Norton, 2003)", "Vladislav Zubok and Constantine Pleshakov, Inside the Kremlin's Cold War (Harvard University Press, 1996)", "G. M. Malenkov, speech to the USSR Supreme Soviet, August 8, 1953 (Pravda, August 9, 1953)", "G. M. Malenkov, election speech of March 12, 1954 (Pravda, March 13, 1954)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'malenkov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'malenkov', 'fall-and-kazakhstan', 1,
    '1957년 6월, 「반당그룹」과 카자흐스탄의 발전소',
    'June 1957: the "Anti-Party Group" and a Power Station in Kazakhstan',
    $sec$말렌코프의 총리 재임은 2년을 채우지 못했다. 흐루쇼프가 당 기구를 장악해 가는 가운데 1955년 2월 그는 농업 정책의 실패를 자아비판하며 각료회의 의장직에서 물러났고, 부총리 겸 발전소 담당 장관으로 강등되었다. 1957년 6월 그는 몰로토프, 카가노비치와 함께 간부회 다수를 규합해 흐루쇼프 해임을 시도했다. 그러나 흐루쇼프는 문제를 중앙위원회 전원회의로 가져가는 데 성공했고, 주코프가 군용기로 실어 나른 중앙위원들이 모이자 형세는 역전되었다. 말렌코프 일파는 「반당그룹」으로 규정되어 지도부에서 축출되었다.

그 뒤의 처분이 이 사건의 역사적 의미를 말해 준다. 패배한 자들은 총살되지 않았다. 말렌코프는 카자흐스탄으로 보내져 우스티카메노고르스크 수력발전소 소장, 이어 에키바스투스 화력발전소 소장으로 일했다. 한때 초강대국의 정부 수반이었던 사람이 변방의 발전소를 관리하며 1960년대를 보냈고, 1961년 당에서 제명된 뒤 모스크바로 돌아와 연금생활자로 조용히 살다 1988년 1월 사망했다.

말렌코프의 생애는 스탈린 이후 소비에트 정치의 문법 전환을 압축한다. 그 자신이 대숙청과 레닌그라드 사건에 관여한 기구의 사람이었으나, 그가 패배한 1957년의 권력투쟁은 처형이 아니라 좌천으로 끝났다. 소비재와 평화에 대한 그의 짧은 실험은 흐루쇼프 시대에, 그리고 더 멀리는 개혁기의 경제 논쟁에 계승자를 남겼다.$sec$,
    $sec$Malenkov's premiership did not last two full years. As Khrushchev consolidated his hold on the party apparatus, in February 1955 Malenkov resigned the chairmanship of the Council of Ministers with a self-criticism over agricultural policy, demoted to deputy premier and minister for power stations. In June 1957, together with Molotov and Kaganovich, he assembled a majority of the Presidium and moved to remove Khrushchev. But Khrushchev succeeded in carrying the question to a full Central Committee plenum, and as members flown in on military aircraft arranged by Zhukov assembled, the balance reversed. Malenkov's group was branded the "Anti-Party Group" and expelled from the leadership.

What followed tells the historical meaning of the episode. The defeated were not shot. Malenkov was sent to Kazakhstan to direct the Ust-Kamenogorsk hydroelectric station and then the Ekibastuz thermal power plant. A man who had been head of government of a superpower spent the 1960s managing provincial power stations; expelled from the party in 1961, he returned to Moscow, lived out a quiet pensioner's life, and died in January 1988.

Malenkov's life compresses the change in the grammar of Soviet politics after Stalin. He was himself a man of the apparatus implicated in the Great Terror and the Leningrad affair, yet the power struggle he lost in 1957 ended in demotion, not execution. His brief experiment with consumer goods and peace left heirs in the Khrushchev era and, further on, in the economic debates of the reform years.$sec$,
    $src$["William Taubman, Khrushchev: The Man and His Era (W. W. Norton, 2003)", "Yoram Gorlizki and Oleg Khlevniuk, Cold Peace: Stalin and the Soviet Ruling Circle, 1945-1953 (Oxford University Press, 2004)", "Vladislav Zubok, A Failed Empire: The Soviet Union in the Cold War from Stalin to Gorbachev (University of North Carolina Press, 2007)", "Roy Medvedev, All Stalin's Men (Blackwell, 1983)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'malenkov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Imre Nagy (nagy)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'nagy', 'new-course-1953', 0,
    '1953년 6월, 부다페스트의 새 노선',
    'June 1953, the New Course in Budapest',
    $sec$너지 임레는 헝가리 커포슈바르 태생으로, 제1차 세계대전에 징집되어 1916년 러시아군의 포로가 되었다. 시베리아의 포로수용소에서 혁명을 만난 그는 1917년 이후 볼셰비키에 가담해 적위대원으로 내전을 치렀고, 이후 평생을 공산주의자로 살았다. 헝가리로 돌아가 지하활동을 하다 1930년 소련으로 망명했고, 모스크바에서 농업 문제를 연구하는 이론가로 일했다. 1944년 말 붉은군대와 함께 귀국한 그는 임시정부의 농업장관으로서 1945년 3월의 토지개혁을 집행했다. 대영지를 해체해 60만이 넘는 농민 가구에 땅을 나눠 준 이 개혁으로 그는 「땅을 나눠 준 장관」으로 불리며 농민들의 사랑을 받았다.

스탈린 사후인 1953년 6월, 모스크바의 새 지도부는 헝가리 지도부를 크렘린으로 불러 라코시의 강행 공업화와 대량 탄압을 신랄하게 비판하고 너지를 총리로 내세웠다. 너지의 「새 노선」은 수용소와 강제수용 체계를 폐쇄하고, 정치범을 사면했으며, 콜호스 탈퇴를 허용하고 소비재와 생활수준에 무게를 옮겼다. 헝가리 사회는 숨을 돌렸다.

그러나 1955년 초 모스크바에서 말렌코프가 밀려나자 라코시가 반격했다. 너지는 총리직에서 해임되고 당에서 제명되었으나 자아비판을 거부했고, 사회주의적 합법성과 각국의 조건에 맞는 사회주의의 길을 옹호하는 글들을 썼다. 이 시기의 너지는 반체제 인사가 아니라, 당 안에서 개혁을 요구한 공산주의자였다. 그의 집은 개혁을 바라는 당내 지식인들의 구심점이 되어 갔다.$sec$,
    $sec$Imre Nagy was born in Kaposvár, Hungary, conscripted in the First World War, and taken prisoner by the Russian army in 1916. He met the revolution in the prisoner-of-war camps of Siberia, joined the Bolsheviks after 1917, fought in the civil war as a Red Guard, and lived the rest of his life a communist. After underground work back in Hungary he emigrated to the Soviet Union in 1930 and worked in Moscow as a theorist of agrarian questions. Returning at the end of 1944 with the Red Army, he executed the land reform of March 1945 as minister of agriculture in the provisional government. The reform broke up the great estates and gave land to more than six hundred thousand peasant families, and it made him beloved in the villages as "the land-distributing minister".

In June 1953, after Stalin's death, the new Moscow leadership summoned the Hungarian leaders to the Kremlin, sharply criticized Rákosi's forced industrialization and mass reprisals, and put Nagy forward as prime minister. Nagy's "New Course" closed the internment camps, amnestied political prisoners, allowed peasants to leave the collectives, and shifted weight to consumer goods and living standards. Hungarian society caught its breath.

But when Malenkov was pushed aside in Moscow in early 1955, Rákosi counterattacked. Nagy was removed as premier and expelled from the party, yet refused self-criticism and wrote essays defending socialist legality and roads to socialism suited to each country's conditions. The Nagy of these years was not a dissident but a communist demanding reform from within the party, and his home became the gathering point of the party intellectuals who wanted it.$sec$,
    $src$["János M. Rainer, Imre Nagy: A Biography (I.B. Tauris, 2009)", "Csaba Békés, Malcolm Byrne and János M. Rainer (eds.), The 1956 Hungarian Revolution: A History in Documents (Central European University Press, 2002)", "Johanna Granville, The First Domino: International Decision Making during the Hungarian Crisis of 1956 (Texas A&M University Press, 2004)", "Mark Kramer, The Soviet Union and the 1956 Crises in Hungary and Poland: Reassessments and New Findings, Journal of Contemporary History 33:2 (1998)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'nagy')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'nagy', 'budapest-1956', 1,
    '1956년 10월, 두 주일의 총리와 1958년의 재판',
    'October 1956: a Premier of Two Weeks, and the Trial of 1958',
    $sec$1956년 10월 23일 부다페스트에서 대학생들의 시위가 대중 봉기로 번지자, 당 지도부는 그날 밤 너지를 다시 총리로 불러냈다. 이후 열이틀 동안 그는 봉기한 거리와 소련군, 무너져 가는 당 기구 사이에서 사태를 헌정적 궤도에 올려놓으려 분투했다. 그는 봉기를 「민족적, 민주주의적 운동」으로 재규정하고 정치경찰을 해산했으며 다당제 연립정부를 구성했다. 말린 노트가 보여주듯 소련 간부회는 10월 30일 협상과 철군 쪽으로 기울었으나, 공화국광장에서 벌어진 보안요원 린치, 블록 전체가 흔들릴 수 있다는 공포, 그리고 수에즈 전쟁의 국제 정세 속에서 10월 31일 결정을 뒤집었다. 소련군의 재진입이 시작되자 11월 1일 너지는 중립을 선언하고 바르샤바조약 탈퇴를 발표하며 유엔에 호소했다.

11월 4일 새벽 「회오리바람 작전」이 시작되었고, 너지는 유고슬라비아 대사관으로 피신했다. 서면으로 신변 보장을 약속받고 대사관을 나선 그는 그러나 소련군에 연행되어 루마니아 스나고프로 이송되었다. 1958년 6월 부다페스트의 비공개 재판에서 그는 사형을 선고받았다. 그는 자신의 행동이 합법적이었다고 주장하며 사면 청원을 거부했고, 자신에 대한 판단을 역사에 맡긴다고 말했다. 1958년 6월 16일 처형된 그는 감옥 마당에, 뒤에는 공동묘지 301구역에 표지 없이 묻혔다.

문서고 개방 이후의 연구는 이 재판이 복원된 헝가리 지도부가 주도하고 모스크바가 용인한 정치 재판이었음을 보여주었다. 1989년 6월 16일, 영웅광장에 20만 명이 모인 가운데 너지의 재장례가 치러졌고, 헝가리 대법원은 그를 완전히 복권했다. 1956년은 냉전의 어느 쪽 신화로도 환원되지 않는 비극이었다. 포로수용소에서 볼셰비키가 된 이 헝가리 농업학자는 마지막까지 자신을 사회주의자로 여겼고, 그의 처형은 사회주의 운동 자신에게 가장 깊은 상처를 남긴 결정 가운데 하나로 기록된다.$sec$,
    $sec$When a student demonstration in Budapest on October 23, 1956 swelled into a mass uprising, the party leadership called Nagy back to the premiership that night. For the next twelve days he struggled to set events on a constitutional track between the risen streets, the Soviet army, and a collapsing party apparatus. He redefined the uprising as a "national democratic movement", dissolved the political police, and formed a multi-party coalition government. As the Malin notes show, the Soviet Presidium leaned on October 30 toward negotiation and withdrawal, then reversed itself on October 31 amid the lynching of security men on Republic Square, the fear that the whole bloc might unravel, and the international storm of the Suez war. As Soviet forces re-entered, on November 1 Nagy declared neutrality, announced withdrawal from the Warsaw Pact, and appealed to the United Nations.

Operation Whirlwind began at dawn on November 4, and Nagy took refuge in the Yugoslav embassy. He left it under a written promise of safe conduct, but was seized by Soviet forces and taken to Snagov in Romania. At a closed trial in Budapest in June 1958 he was sentenced to death. He maintained that his actions had been lawful, refused to petition for clemency, and said he entrusted the judgment of his case to history. Executed on June 16, 1958, he was buried without a marker, finally in plot 301 of the municipal cemetery.

Post-archive research has shown the trial to be a political trial driven by the restored Hungarian leadership and countenanced by Moscow. On June 16, 1989 Nagy was reburied before two hundred thousand people on Heroes' Square, and Hungary's Supreme Court fully rehabilitated him. 1956 was a tragedy that cannot be reduced to either side's Cold War myth. The Hungarian agrarian scholar who became a Bolshevik in a prisoner-of-war camp considered himself a socialist to the end, and his execution is recorded among the decisions that wounded the socialist movement itself most deeply.$sec$,
    $src$["János M. Rainer, Imre Nagy: A Biography (I.B. Tauris, 2009)", "Csaba Békés, Malcolm Byrne and János M. Rainer (eds.), The 1956 Hungarian Revolution: A History in Documents (Central European University Press, 2002)", "The Malin Notes on the Crises in Hungary and Poland, 1956, Cold War International History Project Bulletin 8-9 (1996-97)", "Mark Kramer, The Soviet Union and the 1956 Crises in Hungary and Poland: Reassessments and New Findings, Journal of Contemporary History 33:2 (1998)", "Johanna Granville, The First Domino: International Decision Making during the Hungarian Crisis of 1956 (Texas A&M University Press, 2004)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'nagy')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Alexander Dubcek (dubcek)
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'dubcek', 'prague-spring', 0,
    '1968년 1월, 「인간의 얼굴을 한 사회주의」',
    'January 1968, "Socialism with a Human Face"',
    $sec$알렉산드르 두브체크는 1921년 슬로바키아 우흐로베츠에서 태어났다. 사회주의 이상에 이끌린 그의 부모는 1925년 소련 키르기지아의 인테르헬포 협동조합에 합류했고, 두브체크는 프룬제와 고리키에서 소년기를 보냈다. 1938년 슬로바키아로 돌아온 그는 이듬해 비합법 슬로바키아공산당에 입당했고, 1944년 슬로바키아 민족봉기에서 무기를 들고 싸우다 두 차례 부상을 입었으며 형 율리우스를 잃었다. 소련에서 자라고 파시즘과 싸운 이 경력은 그를 누구도 반소주의자로 부를 수 없는 인물로 만들었다.

전후 당 기구에서 성장한 그는 모스크바 고등당학교에서 수학했고, 1963년 슬로바키아공산당 제1서기가 되어 1950년대 정치재판 희생자들의 복권과 슬로바키아의 동등한 지위를 밀고 나갔다. 1968년 1월 5일 중앙위원회는 노보트니를 대신해 그를 체코슬로바키아공산당 제1서기로 선출했다. 4월의 행동강령은 당내 민주주의, 언론 자유, 복권, 연방제, 경제 개혁을 내걸었고, 6월에는 검열이 폐지되었다. 「인간의 얼굴을 한 사회주의」라는 구호 아래 진행된 프라하의 봄은 사회주의의 포기가 아니라 갱신의 시도로 제시되었고, 대중의 열광적 지지를 받았다.

두브체크는 바르샤바조약과 코메콘에 대한 충성을 거듭 확인했으나, 소련과 이웃 당 지도부들은 개혁이 당의 지도적 역할을 침식하고 블록의 안보를 위협한다고 판단해 갔다. 드레스덴 회동, 바르샤바 서한, 치에르나 회담으로 이어진 1968년 여름의 압박은 사회주의 국가들 사이의 관계가 어디까지 대등할 수 있는가라는, 운동 전체의 미해결 문제를 노출시켰다.$sec$,
    $sec$Alexander Dubček was born in 1921 in Uhrovec, Slovakia. His parents, drawn by the socialist ideal, joined the Interhelpo cooperative in Soviet Kirghizia in 1925, and Dubček spent his boyhood in Frunze and Gorky. Returning to Slovakia in 1938, he joined the illegal Communist Party of Slovakia the following year, fought with arms in the Slovak National Uprising of 1944, was wounded twice, and lost his brother Július. Raised in the Soviet Union and tested against fascism, his was a biography no one could call anti-Soviet.

He rose through the postwar party apparatus, studied at the Higher Party School in Moscow, and as first secretary of the Slovak party from 1963 pressed for the rehabilitation of the victims of the political trials of the 1950s and for Slovakia's equal standing. On January 5, 1968 the Central Committee elected him first secretary of the Communist Party of Czechoslovakia in place of Novotný. The Action Programme of April promised inner-party democracy, freedom of the press, rehabilitation, federalization, and economic reform; censorship was abolished in June. The Prague Spring, under the slogan "socialism with a human face", was presented not as the abandonment of socialism but as its renewal, and it won passionate popular support.

Dubček repeatedly affirmed loyalty to the Warsaw Pact and Comecon, but the Soviet and neighboring party leaderships came to judge that the reforms were eroding the party's leading role and endangering the security of the bloc. The pressure of the summer of 1968, from the Dresden meeting through the Warsaw letter to the Čierna talks, exposed an unresolved question of the whole movement: how equal the relations between socialist states could really be.$sec$,
    $src$["Alexander Dubcek, with Jiri Hochman, Hope Dies Last: The Autobiography of Alexander Dubcek (Kodansha, 1993)", "Kieran Williams, The Prague Spring and Its Aftermath: Czechoslovak Politics 1968-1970 (Cambridge University Press, 1997)", "H. Gordon Skilling, Czechoslovakia's Interrupted Revolution (Princeton University Press, 1976)", "Jaromir Navratil (ed.), The Prague Spring 1968: A National Security Archive Documents Reader (Central European University Press, 1998)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'dubcek')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'dubcek', 'august-1968-return-1989', 1,
    '1968년 8월 21일 새벽, 그리고 1989년 11월의 발코니',
    'Dawn of August 21, 1968, and a Balcony in November 1989',
    $sec$1968년 8월 20일 밤에서 21일 새벽 사이, 바르샤바조약 5개국 군대가 체코슬로바키아에 진입했다. 두브체크와 동료 지도자들은 중앙위원회 청사에서 소련 공수부대에 연행되어 모스크바로 압송되었고, 8월 26일 개혁의 대부분을 되돌리는 모스크바 의정서에 서명해야 했다. 크리겔 한 사람만이 서명을 거부했다. 귀국한 두브체크가 라디오에서 국민에게 연설할 때 그의 목소리는 여러 차례 끊겼다. 1969년 4월 그는 후사크로 교체되었고, 터키 대사를 거쳐 1970년 당에서 제명된 뒤 슬로바키아 산림청의 기계 담당 직원으로 15년을 감시 속에서 일했다.

문서고 개방 이후의 연구는 개입 결정이 블록 붕괴에 대한 공포와 「건전한 세력」을 자처한 체코슬로바키아 보수파의 요청 서한 위에서 내려졌음을 보여주었다. 그러나 개입은 스스로 내건 목적에서도 실패로 판정되었다. 그것은 개혁을 멈춰 세웠으나 사회주의에 대한 대중의 신뢰를 함께 무너뜨렸고, 서유럽의 공산당들을 이반시켰다. 1989년 12월 4일, 개입에 참여했던 바르샤바조약 국가들 스스로가 1968년의 개입을 부당한 내정 간섭으로 공식 규탄했다.

1989년 11월 24일, 두브체크는 프라하 바츨라프 광장이 내려다보이는 발코니에 하벨과 나란히 서서 21년 만에 군중 앞에 모습을 드러냈다. 그해 12월 28일 그는 연방의회 의장으로 선출되었다. 그는 마지막까지 자신을 민주적 사회주의자로 여겼고 1992년 슬로바키아 사회민주당에 합류했으며, 그해 9월의 교통사고 후유증으로 11월 7일 사망했다. 소련에서 자란 소년이 사회주의의 갱신을 시도하고, 그 시도를 짓밟은 결정이 훗날 그 결정의 당사자들에 의해 철회되는 것을 지켜본 생애였다.$sec$,
    $sec$In the night of August 20-21, 1968, the armies of five Warsaw Pact states entered Czechoslovakia. Dubček and his fellow leaders were seized in the Central Committee building by Soviet paratroopers and flown to Moscow, where on August 26 they had to sign the Moscow Protocol rolling back most of the reforms; Kriegel alone refused. When Dubček addressed the nation by radio on his return, his voice broke repeatedly. In April 1969 he was replaced by Husák; after a spell as ambassador to Turkey he was expelled from the party in 1970 and spent fifteen years as a mechanical clerk in the Slovak forestry administration, under surveillance.

Post-archive research has shown that the decision to intervene rested on fear of the bloc's unraveling and on the letter of invitation from Czechoslovak conservatives styling themselves the "healthy forces". Yet the intervention failed even by its own declared aims. It halted the reforms, but it also broke popular confidence in socialism and alienated the communist parties of Western Europe. On December 4, 1989 the Warsaw Pact states that had taken part formally condemned the 1968 intervention as an unlawful interference in internal affairs.

On November 24, 1989 Dubček stood beside Havel on a balcony above Wenceslas Square in Prague, appearing before a crowd for the first time in twenty-one years. On December 28 that year he was elected chairman of the Federal Assembly. To the end he considered himself a democratic socialist, joining the Slovak Social Democrats in 1992; he died on November 7 that year of injuries from a September car crash. It was the life of a boy raised in the Soviet Union who attempted the renewal of socialism, and who lived to see the decision that crushed that attempt revoked by its own authors.$sec$,
    $src$["Kieran Williams, The Prague Spring and Its Aftermath: Czechoslovak Politics 1968-1970 (Cambridge University Press, 1997)", "Jaromir Navratil (ed.), The Prague Spring 1968: A National Security Archive Documents Reader (Central European University Press, 1998)", "Mark Kramer, The Kremlin, the Prague Spring, and the Brezhnev Doctrine, in Vladimir Tismaneanu (ed.), Promises of 1968 (Central European University Press, 2010)", "Vladislav Zubok, A Failed Empire: The Soviet Union in the Cold War from Stalin to Gorbachev (University of North Carolina Press, 2007)", "Alexander Dubcek, with Jiri Hochman, Hope Dies Last: The Autobiography of Alexander Dubcek (Kodansha, 1993)"]$src$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'dubcek')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();
