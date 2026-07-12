-- 030: Person detail sections for people who previously had none:
--   international revolutionaries (plekhanov, martov, fidel-castro, kim-il-sung, kim-jong-il),
--   old regime (kornilov), perestroika era (gorbachev, yeltsin, shevardnadze, yakovlev, kryuchkov).
-- Two narrative sections per person, bilingual ko/en, markdown bodies.
-- Idempotent: ON CONFLICT (person_id, slug) DO UPDATE; every insert is guarded by
-- WHERE EXISTS on commulingo_people.

-- ============================================================
-- Georgi Plekhanov (plekhanov)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('plekhanov', 'emancipation-of-labour', 0,
     '1883년 제네바, 노동해방그룹의 탄생',
     'Geneva, 1883: Founding the Emancipation of Labour Group',
     $body$1883년 9월, 스위스 제네바에서 게오르기 플레하노프는 악셀로드, 자술리치 등 망명 동지들과 함께 「노동해방그룹」을 결성했다. 러시아 최초의 마르크스주의 조직이었다. 인민주의 조직 「토지와 자유」의 지도자였던 그는 농민공동체에 기대는 전망 및 테러 전술과 결별하고, 러시아의 미래가 성장하는 노동계급에 있다는 결론에 도달한 터였다.

그는 그해 『사회주의와 정치투쟁』을, 1885년 『우리의 견해차』를 써서 인민주의를 비판하고 러시아 사회민주주의의 이론적 기초를 놓았다. 『공산당 선언』을 비롯한 마르크스와 엥겔스의 저작을 러시아어로 번역했고, 국내로 밀반입된 그의 소책자들은 러시아 최초의 마르크스주의 서클들을 길러냈다. 훗날 레닌은 그의 철학 저작을 국제 마르크스주의 문헌 전체에서 가장 뛰어난 것이라 평가하며 젊은 공산주의자들에게 필독을 권했다.

1895년 봄, 스물다섯 살의 레닌이 제네바로 찾아와 플레하노프를 만났다. 사제 관계에 가까웠던 이 만남에서 훗날 『이스크라』 편집진의 동맹이 자라났다. 그러나 러시아 마르크스주의의 아버지와 그 아들 세대의 협력은 오래가지 못할 운명이었다.$body$,
     $body$In September 1883, in Geneva, Georgi Plekhanov founded the Emancipation of Labour group together with fellow exiles Pavel Axelrod and Vera Zasulich. It was the first Russian Marxist organization. A former leader of the populist Land and Liberty, he had broken with terrorist tactics and with faith in the peasant commune, concluding that Russia's future lay with its growing working class.

That year he wrote Socialism and the Political Struggle, followed in 1885 by Our Differences, criticizing populism and laying the theoretical foundations of Russian Social Democracy. He translated Marx and Engels into Russian, including the Communist Manifesto, and his pamphlets, smuggled into Russia, nourished the country's first Marxist circles. Lenin later judged his philosophical writings the best in the entire international Marxist literature and urged young communists to study them.

In the spring of 1895 the twenty-five-year-old Lenin travelled to Geneva to meet him. Out of that almost teacher-and-pupil encounter grew the later alliance of the Iskra editorial board. The partnership between the father of Russian Marxism and the generation of his sons, however, was not destined to last.$body$,
     $src$["Samuel H. Baron, Plekhanov: The Father of Russian Marxism (1963)", "G. V. Plekhanov, Socialism and the Political Struggle (1883)", "G. V. Plekhanov, Our Differences (1885)", "https://www.marxists.org/archive/plekhanov/index.htm", "V. I. Lenin, Once Again on the Trade Unions (1921)"]$src$),
    ('plekhanov', 'revolution-outgrows-teacher', 1,
     '1917–1918년, 혁명이 스승을 앞질러 가다',
     '1917–1918: The Revolution Outgrows Its Teacher',
     $body$1917년 4월 플레하노프는 37년의 망명을 끝내고 페트로그라드로 돌아왔다. 그러나 그가 돌아온 러시아는 더 이상 그의 러시아가 아니었다. 그는 러시아가 아직 사회주의 혁명을 감당할 만큼 성숙하지 않았다고 확신했고, 독일에 맞선 방위 전쟁을 지지했으며, 레닌의 4월 테제를 「잠꼬대」라 불렀다. 한때 러시아 마르크스주의 전체의 스승이었던 그의 신문 『예딘스트보』는 이제 소수의 목소리에 불과했다.

10월 무장봉기(구력 10월 25일, 신력 11월 7일) 직후 그는 「페트로그라드 노동자들에게 보내는 공개서한」에서 프롤레타리아트가 시기상조의 권력을 잡았다며 봉기를 비판했다. 그러나 그는 반혁명의 편에 서는 것만은 단호히 거부했다. 볼셰비키에 맞서는 정부의 수반이 되어 달라는 제안을 받았을 때, 그는 40년을 프롤레타리아트와 함께 싸운 자신이 노동자에게 총을 겨눌 수는 없다며 물리쳤다.

지병인 결핵이 악화되어 그는 1918년 5월 30일 핀란드 테리요키의 요양원에서 세상을 떠났다. 그가 비판했던 볼셰비키 정부도 그의 유산을 부정하지 않았다. 그의 저작은 소비에트 시대 내내 간행되었고, 레닌은 플레하노프의 철학 전체를 공부하지 않고서는 의식적인 공산주의자가 될 수 없다고 썼다.$body$,
     $body$In April 1917 Plekhanov returned to Petrograd after thirty-seven years of exile, but the Russia he returned to was no longer his. Convinced that the country was not yet mature enough for a socialist revolution, he supported the defensive war against Germany and dismissed Lenin's April Theses as ravings. Yedinstvo, the newspaper of the man who had once taught all of Russian Marxism, now spoke for a small minority.

Immediately after the October insurrection (25 October Old Style, 7 November New Style) he published an Open Letter to the Petrograd Workers, arguing that the proletariat had seized power prematurely. Yet he flatly refused to stand with the counterrevolution. When he was asked to head a government against the Bolsheviks, he answered that after forty years of fighting alongside the proletariat he would not raise a gun against the workers.

His tuberculosis worsened, and he died on 30 May 1918 in a sanatorium at Terijoki in Finland. The Bolshevik government he had criticized did not disown his legacy: his works were published throughout the Soviet era, and Lenin wrote that no one could become a conscious communist without studying everything Plekhanov had written on philosophy.$body$,
     $src$["Samuel H. Baron, Plekhanov: The Father of Russian Marxism (1963)", "G. V. Plekhanov, Open Letter to the Petrograd Workers (October 1917)", "V. I. Lenin, Once Again on the Trade Unions, on the Current Situation and on the Mistakes of Trotsky and Bukharin (1921)", "https://www.marxists.org/archive/plekhanov/index.htm"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Julius Martov (martov)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('martov', '1903-split', 0,
     '1903년 여름, 가장 가까운 동지와의 결별',
     'Summer 1903: Parting with His Closest Comrade',
     $body$율리 마르토프는 레닌의 가장 가까운 초기 동지였다. 1895년 두 사람은 페테르부르크에서 「노동계급해방투쟁동맹」을 함께 만들었고, 나란히 체포되어 시베리아 유형을 살았으며, 1900년부터는 망명지에서 『이스크라』를 함께 편집했다. 동지들은 두 사람을 한 쌍으로 여겼다.

1903년 여름 브뤼셀과 런던에서 열린 러시아사회민주노동당 제2차 대회에서 두 사람은 당규 제1조를 놓고 갈라섰다. 마르토프는 당의 문을 넓게 열어 당의 지도 아래 정기적으로 협력하는 것으로 충분하다고 했고, 레닌은 당원이라면 당 조직 하나에 직접 몸담아야 한다고 맞섰다. 표결에서는 마르토프가 이겼으나, 분트와 「경제주의자」 대표들이 퇴장한 뒤 중앙기관 선거에서 레닌파가 다수파(볼셰비키)가 되었고 마르토프파에게는 소수파(멘셰비키)라는 이름이 남았다.

규약 한 조항의 차이는 곧 당 개념 전체의 차이로, 나아가 러시아 사회민주주의의 두 흐름으로 자라났다. 결별은 정치적이었으나 상처는 개인적이었다. 훗날의 회고들은 레닌이 마르토프와의 절교를 오래도록 아파했다고 전한다.$body$,
     $body$Julius Martov was Lenin's closest early comrade. In 1895 the two founded the League of Struggle for the Emancipation of the Working Class in St Petersburg, were arrested in turn and served terms of Siberian exile, and from 1900 edited Iskra together in emigration. Their comrades thought of them as a pair.

At the Second Congress of the RSDLP, held in Brussels and London in the summer of 1903, they split over Paragraph 1 of the party rules. Martov wanted the party's doors opened wide, with regular cooperation under its guidance sufficing for membership; Lenin insisted that a member must belong personally to a party organization. Martov won that vote, but after the Bund and Economist delegates walked out, Lenin's faction won the elections to the central bodies and took the name of the majority, Bolsheviks, leaving Martov's followers the name of the minority, Mensheviks.

The difference over one clause grew into a difference over the whole conception of the party, and then into the two currents of Russian Social Democracy. The break was political, but the wound was personal: memoirs record that Lenin grieved over the rupture with Martov for years afterwards.$body$,
     $src$["Israel Getzler, Martov: A Political Biography of a Russian Social Democrat (1967)", "V. I. Lenin, One Step Forward, Two Steps Back (1904)", "N. K. Krupskaya, Reminiscences of Lenin (1933)", "https://www.marxists.org/archive/martov/index.htm"]$src$),
    ('martov', 'internationalist-conscience', 1,
     '1917년 10월, 혁명 안의 반대파로 남다',
     'October 1917: Remaining an Opposition Within the Revolution',
     $body$전쟁이 터지자 마르토프는 멘셰비키 안에서도 국제주의 좌파에 섰다. 그는 방위주의를 거부하고 침머발트 반전 회의에 참가했으며, 1917년 내내 전쟁 계속에 반대했다. 10월 봉기의 밤(신력 11월 7일), 제2차 전러시아 소비에트 대회에서 그는 유혈을 피하기 위해 모든 사회주의 정당이 참여하는 연립정부를 제안했다. 제안이 묻힌 채 퇴장하는 그의 등 뒤로 트로츠키의 유명한 말이 날아들었다. 「당신들의 자리는 이제부터 역사의 쓰레기통이오.」

그러나 마르토프는 반혁명으로 넘어가지 않았다. 그는 러시아에 남아 합법 야당으로서 탄압과 적색테러를 비판하는 동시에, 백군과 외국 간섭에 맞서 혁명을 방어하라고 노동자들에게 호소했다. 1919년에는 전러시아 중앙집행위원회 위원으로 선출되기도 했다. 1920년 병든 몸으로 합법적으로 출국한 그는 베를린에서 『사회주의 통보』를 창간했고, 1923년 4월 4일 결핵으로 숨졌다.

크룹스카야의 회고에 따르면, 이미 병석에 누운 레닌은 옛 동지에 대한 애정을 감추지 않은 채 마르토프의 병세를 물었다. 「마르토프도 죽어가고 있다지.」 평생을 갈라져 싸운 두 사람은 한 해 사이를 두고 세상을 떠났고, 마르토프는 혁명을 배신하지 않은 비판자로 기억된다.$body$,
     $body$When the war broke out, Martov stood with the internationalist left even within Menshevism: he rejected defencism, attended the Zimmerwald anti-war conference, and opposed the continuation of the war throughout 1917. On the night of the October insurrection (7 November New Style), at the Second All-Russian Congress of Soviets, he proposed a coalition government of all socialist parties to avert bloodshed. As the proposal died and he walked out, Trotsky's famous words followed him: from now on, your place is in the dustbin of history.

Yet Martov never crossed over to the counterrevolution. He remained in Russia as a legal opposition, criticizing repression and the Red Terror while calling on workers to defend the revolution against the Whites and foreign intervention; in 1919 he was even elected to the All-Russian Central Executive Committee. In 1920, gravely ill, he left the country legally and founded the Sotsialistichesky Vestnik in Berlin. He died of tuberculosis on 4 April 1923.

According to Krupskaya, Lenin, by then on his own sickbed, kept asking after Martov's condition with unconcealed affection: they say Martov is dying too. The two men who had fought each other for a lifetime died within a year of one another, and Martov is remembered as the critic who never betrayed the revolution.$body$,
     $src$["Israel Getzler, Martov: A Political Biography of a Russian Social Democrat (1967)", "N. N. Sukhanov, The Russian Revolution 1917: A Personal Record", "Leon Trotsky, The History of the Russian Revolution (1932)", "N. K. Krupskaya, Reminiscences of Lenin (1933)", "https://www.marxists.org/archive/martov/index.htm"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Fidel Castro (fidel-castro)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('fidel-castro', 'moncada-to-havana', 0,
     '1953년 7월 26일, 몬카다의 새벽',
     '26 July 1953: Dawn at the Moncada Barracks',
     $body$1953년 7월 26일 새벽, 스물여섯 살의 변호사 피델 카스트로는 백여 명의 청년들을 이끌고 산티아고데쿠바의 몬카다 병영을 습격했다. 바티스타의 쿠데타 정권을 무너뜨릴 봉기의 신호탄이 될 계획이었으나 습격은 실패했고, 붙잡힌 동지 다수가 고문 끝에 살해되었다. 그해 10월 16일 법정에서 카스트로는 스스로를 변호하는 긴 연설을 남겼다. 「나를 단죄하라. 그것은 중요하지 않다. 역사가 나를 무죄로 하리라.」

1955년 사면으로 풀려난 그는 멕시코로 건너가 「7월 26일 운동」을 조직했고, 그곳에서 체 게바라를 만났다. 1956년 12월 2일, 82명의 대원이 요트 그란마호를 타고 쿠바에 상륙했다. 상륙 직후의 궤멸을 딛고 시에라 마에스트라 산맥에 뿌리내린 게릴라는 농민의 지지 속에 자라났고, 2년 만에 바티스타의 군대를 무너뜨렸다.

1959년 1월 1일 바티스타는 국외로 도주했고, 1월 8일 카스트로는 아바나에 입성했다. 미국의 뒷마당이라 불리던 섬에서 민중 혁명이 승리한 순간이었다.$body$,
     $body$At dawn on 26 July 1953, the twenty-six-year-old lawyer Fidel Castro led about a hundred young rebels in an assault on the Moncada barracks in Santiago de Cuba. It was meant to signal an uprising against Batista's coup regime, but the attack failed, and many of the captured comrades were tortured and killed. In court on 16 October that year, Castro delivered the long speech in his own defence that ended: condemn me, it does not matter, history will absolve me.

Released in the amnesty of 1955, he went to Mexico, organized the 26th of July Movement, and there met Che Guevara. On 2 December 1956, eighty-two men landed in Cuba from the yacht Granma. Surviving near annihilation after the landing, the guerrilla force took root in the Sierra Maestra, grew with peasant support, and within two years broke Batista's army.

On 1 January 1959 Batista fled the country, and on 8 January Castro entered Havana. A popular revolution had triumphed on an island long treated as the backyard of the United States.$body$,
     $src$["Fidel Castro, History Will Absolve Me (1953), https://www.marxists.org/history/cuba/archive/castro/1953/10/16.htm", "Ernesto Che Guevara, Reminiscences of the Cuban Revolutionary War (1963)", "Leycester Coltman, The Real Fidel Castro (2003)", "Richard Gott, Cuba: A New History (2004)"]$src$),
    ('fidel-castro', 'revolution-that-endured', 1,
     '1961년, 피그스만과 문맹퇴치의 해',
     '1961: The Year of the Bay of Pigs and the Literacy Campaign',
     $body$1961년 4월, 미국이 조직한 망명자 부대가 피그스만의 히론 해변에 상륙했다. 침공은 사흘 만에 분쇄되었고, 카스트로는 전선에서 직접 방어를 지휘했다. 침공 전야, 공습 희생자들을 위한 추도 연설에서 그는 혁명의 사회주의적 성격을 처음으로 공식 선언했다. 이후 반세기 동안 쿠바는 미국의 봉쇄와 수백 차례의 암살 기도 속에서도 무너지지 않았다.

같은 해 쿠바는 다른 종류의 동원도 벌였다. 십만 명이 넘는 청년 교사와 학생이 등불을 들고 농촌으로 들어가 글을 가르쳤고, 1961년 12월 쿠바는 문맹 없는 영토임을 선언했다. 유네스코가 현지 조사로 확인한 이 문맹퇴치운동은 무상 의료와 무상 교육 체계의 출발점이 되었다. 쿠바의 영아사망률과 기대수명은 훨씬 부유한 나라들과 어깨를 나란히 하게 되었다.

카스트로의 국제주의는 말에 그치지 않았다. 쿠바 의사들은 세계 곳곳의 재난과 전염병 현장으로 파견되었고, 1975년부터 앙골라에 파병된 쿠바군은 남아프리카공화국 아파르트헤이트 군대의 침공을 저지하는 데 결정적 역할을 했다. 만델라는 석방 후 쿠바를 찾아 감사를 표했다. 소련 해체 이후 「특별시기」의 극한 위기도 혁명을 무너뜨리지 못했고, 카스트로는 2016년 11월 25일 아흔 살로 세상을 떠났다.$body$,
     $body$In April 1961 a US-organized exile force landed at Playa Girón, on the Bay of Pigs. The invasion was crushed within three days, with Castro directing the defence at the front. On the eve of the invasion, in the funeral oration for the victims of the preparatory air raids, he proclaimed for the first time the socialist character of the revolution. Over the following half century Cuba withstood the US embargo and hundreds of assassination plots without collapsing.

That same year Cuba mounted a mobilization of another kind. More than a hundred thousand young teachers and students went into the countryside with lanterns to teach reading, and in December 1961 Cuba declared itself a territory free of illiteracy. The campaign, verified on the ground by UNESCO, became the foundation of a system of free health care and education; Cuban infant mortality and life expectancy came to stand alongside those of far richer countries.

Castro's internationalism was more than rhetoric. Cuban doctors were dispatched to disasters and epidemics around the world, and from 1975 Cuban troops in Angola played a decisive part in halting the invasions of apartheid South Africa's army. After his release, Mandela travelled to Cuba to give thanks. Not even the extreme crisis of the post-Soviet Special Period broke the revolution. Castro died on 25 November 2016, at the age of ninety.$body$,
     $src$["Piero Gleijeses, Conflicting Missions: Havana, Washington, and Africa 1959–1976 (2002)", "UNESCO, Methods and Means Utilized in Cuba to Eliminate Illiteracy (1965)", "Richard Gott, Cuba: A New History (2004)", "Leycester Coltman, The Real Fidel Castro (2003)"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Kim Il Sung (kim-il-sung)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('kim-il-sung', 'pochonbo-1937', 0,
     '1937년 6월 4일, 보천보의 밤',
     '4 June 1937: The Night of Pochonbo',
     $body$1937년 6월 4일 밤, 동북항일연군 제1로군 제6사(사장 김일성) 병력이 압록강을 건너 함경남도 갑산군 보천면 보천보(현 량강도 보천군)를 습격했다. 주재소와 면사무소 등 일제 통치기관이 불탔다. 군사적으로는 소규모 작전이었으나 정치적 반향은 컸다. 「동아일보」가 이튿날 두 차례의 호외로 이 소식을 전하면서, 국내 민중은 국경 너머에서 일제와 싸우는 조선인 유격대와 김일성이라는 이름을 알게 되었다.

김일성은 1912년 4월 15일 평양 근교 만경대에서 태어나 어린 시절 가족을 따라 만주로 건너갔다. 1930년대 초부터 중국공산당 계열의 항일 유격대에서 싸웠고, 동북항일연군의 조선인 지휘관으로 성장했다. 일제의 토벌이 극심해진 1940년 소련 연해주로 이동했고, 소련군 제88독립보병여단에서 동지들과 함께 해방의 날을 준비했다.

보천보 전투는 이후 조선민주주의인민공화국에서 항일무장투쟁의 상징이 되었다. 와다 하루키를 비롯한 연구자들은 이 만주 유격대의 경험이 해방 후 북한 국가의 성격 자체를 규정했다고 분석한다.$body$,
     $body$On the night of 4 June 1937, troops of the Sixth Division of the Northeast Anti-Japanese United Army's First Route Army, commanded by Kim Il Sung, crossed the Yalu River and raided Pochonbo in Kapsan county, South Hamgyong province (today Pochon county, Ryanggang province). The Japanese police substation, the township office, and other organs of colonial rule were burned. Militarily it was a small operation, but its political echo was large: the Donga Ilbo carried the news in two extra editions the next day, and Koreans at home learned that Korean guerrillas were fighting Japan across the border, under a commander named Kim Il Sung.

Kim Il Sung was born on 15 April 1912 at Mangyongdae near Pyongyang and moved to Manchuria with his family as a boy. From the early 1930s he fought in anti-Japanese guerrilla units organized under the Chinese Communist Party, rising to command Korean forces in the Northeast Anti-Japanese United Army. When Japanese punitive campaigns intensified in 1940 he withdrew to the Soviet Far East, where he and his comrades prepared for the day of liberation in the Soviet 88th Separate Rifle Brigade.

The battle of Pochonbo later became the emblem of the anti-Japanese armed struggle in the DPRK. Scholars such as Wada Haruki argue that this Manchurian guerrilla experience shaped the very character of the postwar North Korean state.$body$,
     $src$["와다 하루키(和田春樹), 김일성과 만주항일전쟁 (창작과비평사, 1992)", "Dae-Sook Suh, Kim Il Sung: The North Korean Leader (1988)", "동아일보 호외, 1937년 6월 5일", "Charles K. Armstrong, The North Korean Revolution, 1945–1950 (2003)"]$src$),
    ('kim-il-sung', 'founding-and-juche', 1,
     '1948년 9월 9일, 공화국 창건에서 주체까지',
     '9 September 1948: From Founding the Republic to Juche',
     $body$1945년 해방과 함께 귀국한 김일성은 북조선임시인민위원회 위원장으로서 1946년 3월 무상몰수·무상분배 원칙의 토지개혁을 단행했고, 주요 산업 국유화와 남녀평등권 법령이 뒤따랐다. 1948년 9월 9일 조선민주주의인민공화국이 창건되었고 그는 초대 내각 수상이 되었다.

1950–1953년의 전쟁에서 미군의 폭격은 북부의 도시들을 잿더미로 만들었다. 전후 복구는 소련과 중국, 동유럽 사회주의 나라들의 원조 속에 놀라운 속도로 진행되었고, 1950년대 후반의 천리마운동은 대중적 증산 운동으로 중공업의 기반을 세웠다. 1960년대 북한의 공업화 수준은 당시의 남한을 앞선다는 평가를 받았다.

1955년 12월 28일의 연설 「사상사업에서 교조주의와 형식주의를 퇴치할 데 대하여」에서 김일성은 「주체」를 처음으로 정식화했다. 소련과 중국이라는 두 대국 사이에서 사상에서의 주체, 정치에서의 자주, 경제에서의 자립, 국방에서의 자위를 내세운 이 노선은 이후 주체사상으로 체계화되어 공화국의 지도이념이 되었다. 그는 1994년 7월 8일 사망할 때까지 반세기 가까이 국가를 이끌었다.$body$,
     $body$Returning to Korea at liberation in 1945, Kim Il Sung, as chairman of the Provisional People's Committee of North Korea, carried out the land reform of March 1946 on the principle of confiscation without compensation and distribution without payment, followed by the nationalization of major industries and the law on equal rights for women. On 9 September 1948 the Democratic People's Republic of Korea was founded, with Kim as its first premier.

In the war of 1950–1953, American bombing reduced the cities of the north to ashes. Postwar reconstruction, aided by the Soviet Union, China, and the socialist countries of Eastern Europe, proceeded at remarkable speed, and the Chollima movement of the late 1950s built a heavy-industrial base through a mass production drive. By the 1960s the DPRK's level of industrialization was widely judged to be ahead of South Korea's at the time.

In a speech of 28 December 1955, On Eliminating Dogmatism and Formalism and Establishing Juche in Ideological Work, Kim first formulated the idea of Juche. Between the two great powers of the Soviet Union and China, this line of Juche in ideology, independence in politics, self-sufficiency in the economy, and self-reliance in defence was later systematized as the Juche idea, the guiding ideology of the republic. He led the state for nearly half a century, until his death on 8 July 1994.$body$,
     $src$["Charles K. Armstrong, The North Korean Revolution, 1945–1950 (2003)", "김일성, 사상사업에서 교조주의와 형식주의를 퇴치할 데 대하여 (1955.12.28)", "와다 하루키(和田春樹), 북조선: 유격대국가에서 정규군국가로 (돌베개, 2002)", "Dae-Sook Suh, Kim Il Sung: The North Korean Leader (1988)"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Kim Jong Il (kim-jong-il)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('kim-jong-il', 'arduous-march-songun', 0,
     '1994–1998년, 고난의 행군과 선군정치',
     '1994–1998: The Arduous March and Songun Politics',
     $body$1994년 7월 김일성이 사망했을 때 김정일은 이미 20년 가까이 후계자로 준비된 상태였다. 1974년 당내에서 후계자로 추대되었고, 1991년 12월부터는 조선인민군 최고사령관이었다. 그러나 그가 물려받은 것은 공화국 역사상 최악의 위기였다. 소련과 동구권의 해체로 연료·비료·수출시장을 한꺼번에 잃은 경제 위에 1995년과 1996년의 대홍수가 덮쳤다.

식량난과 아사가 잇따른 1990년대 중후반을 북한은 항일유격대의 시련에 빗대어 「고난의 행군」이라 불렀다. 수십만 명에 이르는 것으로 추산되는 인명 피해를 낳은 이 시기는 공화국이 겪은 가장 어두운 시련이었다. 김정일은 3년의 유훈통치를 거쳐 1997년 10월 조선로동당 총비서로 추대되었고, 1998년 개정 헌법 아래 국방위원회 위원장으로서 국가를 이끌었다.

그가 내세운 통치 노선은 선군정치, 곧 인민군을 혁명의 주력군으로 삼아 위기의 국가를 지탱하는 방식이었다. 국제적 고립과 제재, 미국과의 핵 대립 속에서도 체제는 잇따른 붕괴 전망을 비웃듯 살아남았다.$body$,
     $body$When Kim Il Sung died in July 1994, Kim Jong Il had been prepared as successor for nearly twenty years: designated within the party in 1974, and Supreme Commander of the Korean People's Army since December 1991. What he inherited, however, was the worst crisis in the republic's history. Onto an economy that had lost its fuel, fertilizer, and export markets at a stroke with the collapse of the Soviet bloc came the great floods of 1995 and 1996.

North Korea named the years of food shortage and famine in the mid-to-late 1990s the Arduous March, after the ordeal of the anti-Japanese guerrillas. This period, with a death toll estimated in the hundreds of thousands, was the darkest trial the republic had known. After three years of rule under his father's testament, Kim Jong Il was elected General Secretary of the Workers' Party of Korea in October 1997 and led the state as Chairman of the National Defence Commission under the revised constitution of 1998.

The line he proclaimed was Songun, army-first politics: sustaining the state in crisis with the People's Army as the main force of the revolution. Amid international isolation, sanctions, and the nuclear standoff with the United States, the system survived in defiance of repeated predictions of collapse.$body$,
     $src$["Stephan Haggard and Marcus Noland, Famine in North Korea: Markets, Aid, and Reform (2007)", "와다 하루키(和田春樹), 북조선: 유격대국가에서 정규군국가로 (돌베개, 2002)", "Don Oberdorfer and Robert Carlin, The Two Koreas: A Contemporary History (2013)"]$src$),
    ('kim-jong-il', 'summits-2000-2007', 1,
     '2000년 6월 13일, 순안공항의 악수',
     '13 June 2000: The Handshake at Sunan Airport',
     $body$2000년 6월 13일, 김정일은 평양 순안공항 트랩 아래에서 남측의 김대중 대통령을 직접 맞이했다. 분단 반세기 만에 처음으로 남북 정상이 마주 잡은 손이었다. 사흘간의 회담은 6월 15일 남북공동선언으로 이어졌다. 통일 문제의 자주적 해결, 이산가족 상봉, 경제·사회 협력이 합의되었다.

선언 이후 금강산 관광과 개성공단, 경의선 철도·도로 연결, 여러 차례의 이산가족 상봉이 뒤따랐다. 2007년 10월에는 노무현 대통령이 군사분계선을 걸어서 넘어 평양을 방문했고, 두 정상은 10·4 선언에서 종전선언 추진과 서해평화협력특별지대 설치 등 더 구체적인 협력에 합의했다.

김정일은 2011년 12월 17일 현지지도의 길에 오른 열차에서 사망했다. 그가 열어 놓은 남북 정상회담의 선례는 2018년의 회담들로 이어졌다. 영화와 예술에 깊이 관여한 지도자, 그리고 가장 혹독한 위기의 시대에 체제를 지켜낸 지도자라는 두 얼굴이 그의 유산으로 남아 있다.$body$,
     $body$On 13 June 2000, Kim Jong Il stood at the foot of the aircraft steps at Pyongyang's Sunan airport to greet President Kim Dae-jung of the South in person. It was the first time in half a century of division that the leaders of the two Koreas had clasped hands. Three days of talks produced the June 15 Joint Declaration: independent resolution of the unification question, reunions of separated families, and economic and social cooperation.

The declaration was followed by Mount Kumgang tourism, the Kaesong industrial complex, the reconnection of the Gyeongui railway and road, and repeated reunions of separated families. In October 2007 President Roh Moo-hyun walked across the military demarcation line on his way to Pyongyang, and the two leaders agreed in the October 4 Declaration on more concrete cooperation, including pursuit of a declaration ending the Korean War and a special peace and cooperation zone in the West Sea.

Kim Jong Il died on 17 December 2011 aboard his train at the start of a guidance tour. The precedent of inter-Korean summits he established was taken up again in the meetings of 2018. His legacy remains twofold: a leader deeply engaged with cinema and the arts, and a leader who preserved his state through its harshest crisis.$body$,
     $src$["남북공동선언 (2000.6.15)", "남북관계 발전과 평화번영을 위한 선언 (2007.10.4)", "Don Oberdorfer and Robert Carlin, The Two Koreas: A Contemporary History (2013)", "임동원, 피스메이커 (2008)"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Lavr Kornilov (kornilov)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('kornilov', 'march-on-petrograd', 0,
     '1917년 9월, 페트로그라드로 향한 진군',
     'September 1917: The March on Petrograd',
     $body$1917년 7월 임시정부의 총사령관에 임명된 라브르 코르닐로프는 시베리아 카자크 출신의 강골 군인으로, 병사 소비에트와 이중권력을 혁명이 낳은 무질서로만 보았다. 그는 전선의 사형제 부활과 후방의 계엄을 요구했고, 우익 장교들과 자본가들은 그에게서 자신들이 바라던 「강한 손」을 발견했다.

1917년 9월 초(구력 8월 말), 코르닐로프는 크리모프 장군의 제3기병군단과 「야만사단」을 페트로그라드로 이동시켰다. 케렌스키와의 막후 교섭이 파국으로 끝나자 이 이동은 공공연한 쿠데타가 되었다. 그러나 진군은 전투 한 번 없이 무너졌다. 철도노동자들이 병력 수송 열차를 지선으로 돌리고 선로를 뜯었으며, 전신노동자들이 명령의 전달을 끊었고, 소비에트가 보낸 선동가들이 병사들을 설득했다. 야만사단의 병사들마저 총을 내려놓았다. 크리모프는 자결했고, 코르닐로프는 비호프 수도원에 수감되었다.

쿠데타의 최대 수혜자는 볼셰비키였다. 수도 방어를 위해 무장한 적위대는 해산되지 않았고, 7월 사건 이후 투옥되었던 볼셰비키 지도자들이 풀려났으며, 9월 중 페트로그라드와 모스크바 소비에트에서 처음으로 볼셰비키가 다수파가 되었다. 반혁명의 첫 칼은 오히려 혁명을 급진화시켰다.$body$,
     $body$Appointed Supreme Commander by the Provisional Government in July 1917, Lavr Kornilov, a hard soldier of Siberian Cossack origin, saw the soldiers' soviets and dual power as nothing but the disorder bred by revolution. He demanded the restoration of the death penalty at the front and martial law in the rear, and right-wing officers and industrialists found in him the strong hand they had been waiting for.

In early September 1917 (late August Old Style), Kornilov set General Krymov's Third Cavalry Corps and the Savage Division moving toward Petrograd. When his backstage negotiations with Kerensky collapsed, the movement became an open coup. Yet the march fell apart without a single battle: railway workers shunted the troop trains onto sidings and tore up track, telegraph workers cut the transmission of orders, and agitators sent by the soviets talked the soldiers around. Even the men of the Savage Division laid down their arms. Krymov shot himself; Kornilov was imprisoned in the Bykhov monastery.

The chief beneficiary of the coup was the Bolshevik party. The Red Guards armed to defend the capital were never disarmed, the Bolshevik leaders jailed after the July Days were released, and during September the Petrograd and Moscow soviets gained Bolshevik majorities for the first time. The counterrevolution's first sword had only radicalized the revolution.$body$,
     $src$["Alexander Rabinowitch, The Bolsheviks Come to Power: The Revolution of 1917 in Petrograd (1976)", "Leon Trotsky, The History of the Russian Revolution (1932)", "George Katkov, The Kornilov Affair: Kerensky and the Break-up of the Russian Army (1980)"]$src$),
    ('kornilov', 'ekaterinodar-1918', 1,
     '1918년 4월 13일, 예카테리노다르 농가에 떨어진 포탄',
     '13 April 1918: A Shell Strikes a Farmhouse at Ekaterinodar',
     $body$1917년 12월(구력 11월 말), 코르닐로프는 비호프 수도원을 벗어나 테킨스키 연대의 호위 속에 돈 지방으로 향했다. 노보체르카스크에서 그는 알렉세예프 장군과 함께 백군 의용군을 창설했다. 남부 러시아에서 반볼셰비키 무장투쟁의 핵이 만들어진 것이다.

1918년 2월, 붉은 부대에 밀린 4천 명 남짓의 의용군은 얼어붙은 초원을 가로지르는 「얼음 행군」(제1차 쿠반 원정)에 나섰다. 코르닐로프는 이 절망적인 행군을 무자비한 규율로 이끌었고, 포로를 잡지 말라는 그의 명령은 내전 초기의 잔혹화를 앞당겼다. 3월 말 그는 쿠반의 수도 예카테리노다르(현 크라스노다르) 공격을 결정했다. 수적으로 몇 배나 우세한 붉은 수비대를 상대로 한 무모한 정면 공격이었다.

1918년 4월 13일(구력 3월 31일) 새벽, 강변 농가에 차린 그의 사령부에 포탄 한 발이 명중했다. 코르닐로프는 그 자리에서 죽었다. 지휘를 이은 데니킨은 공격을 포기하고 퇴각했다. 서둘러 매장된 그의 시신은 도시에 진입한 붉은 부대에 의해 파헤쳐져 불태워졌다. 반혁명의 첫 칼은 부러졌으나, 내전은 이제 막 시작이었을 뿐이다.$body$,
     $body$In December 1917 (late November Old Style) Kornilov left the Bykhov monastery and made his way to the Don under the escort of the Tekinsky regiment. At Novocherkassk, together with General Alekseev, he founded the White Volunteer Army: the nucleus of armed anti-Bolshevik struggle in south Russia.

In February 1918, pressed by Red forces, the Volunteer Army of some four thousand men set out on the Ice March, the First Kuban Campaign, across the frozen steppe. Kornilov drove this desperate march with merciless discipline, and his order to take no prisoners hastened the brutalization of the early civil war. At the end of March he resolved to storm Ekaterinodar, capital of the Kuban and today's Krasnodar: a reckless frontal assault on Red defenders several times his strength.

At dawn on 13 April 1918 (31 March Old Style), a single shell struck the riverside farmhouse that housed his headquarters, killing him on the spot. Denikin, taking over command, abandoned the assault and withdrew. Kornilov's hastily buried body was dug up and burned by Red troops entering the city. The counterrevolution's first sword was broken, but the civil war had only begun.$body$,
     $src$["Peter Kenez, Civil War in South Russia, 1918: The First Year of the Volunteer Army (1971)", "Anton Denikin, Ocherki russkoi smuty (The Russian Turmoil, 1921–1926)", "W. Bruce Lincoln, Red Victory: A History of the Russian Civil War (1989)"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Mikhail Gorbachev (gorbachev)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('gorbachev', 'perestroika-promise', 0,
     '1985년 3월, 「더 많은 사회주의」의 약속',
     'March 1985: The Promise of More Socialism',
     $body$1985년 3월 11일, 체르넨코가 죽은 다음 날 54세의 미하일 고르바초프가 소련공산당 서기장으로 선출되었다. 노쇠한 지도자들의 장례가 이어지던 시대에 그의 젊음은 그 자체로 변화의 약속이었다. 스타브로폴의 농민 가정에서 태어나 콤바인 조수로 일하며 모스크바대학 법학부를 나온 그는, 당 기구의 정점까지 올라간 전형적인 소비에트 세대의 아들이었다.

그의 개혁은 사회주의를 버리려는 것이 아니라 되살리려는 것이었다. 그는 「더 많은 사회주의, 더 많은 민주주의」를 구호로 내걸었고, 페레스트로이카(개편)와 글라스노스트(공개성)로 침체한 경제와 경직된 정치를 깨우려 했다. 1986년 4월 체르노빌 참사에서 관료적 은폐의 대가를 확인한 뒤 글라스노스트는 더욱 과감해졌다. 검열이 풀리고, 스탈린 시대의 탄압이 공론의 장에 올랐으며, 1989년에는 소련 역사상 처음으로 경쟁 선거를 통해 인민대의원대회가 구성되었다.

대외적으로 그는 「신사고」를 내걸고 군비경쟁의 종식을 추구했다. 1987년 중거리핵전력조약으로 한 세대 만에 처음으로 핵무기가 실제로 감축되었고, 1989년에는 소련군이 아프가니스탄에서 철수했다. 그해 동유럽의 격변 앞에서 그는 무력 개입을 거부했다.$body$,
     $body$On 11 March 1985, the day after Chernenko's death, the fifty-four-year-old Mikhail Gorbachev was elected General Secretary of the CPSU. In an era of successive funerals for aged leaders, his youth was itself a promise of change. Born to a peasant family in Stavropol, a combine operator's assistant who graduated in law from Moscow State University, he was a typical son of the Soviet generation, risen to the summit of the party apparatus.

His reforms were meant not to abandon socialism but to revive it. Under the slogan of more socialism and more democracy, he set out to shake a stagnant economy and an ossified politics awake through perestroika, restructuring, and glasnost, openness. After the Chernobyl disaster of April 1986 showed the price of bureaucratic concealment, glasnost grew bolder: censorship loosened, the repressions of the Stalin era entered public debate, and in 1989 a Congress of People's Deputies was formed through the first competitive elections in Soviet history.

Abroad, he proclaimed the New Thinking and pursued an end to the arms race. The INF Treaty of 1987 brought the first actual reduction of nuclear weapons in a generation, and in 1989 Soviet troops left Afghanistan. When upheaval swept Eastern Europe that year, he refused to intervene by force.$body$,
     $src$["Archie Brown, The Gorbachev Factor (1996)", "Mikhail Gorbachev, Perestroika: New Thinking for Our Country and the World (1987)", "William Taubman, Gorbachev: His Life and Times (2017)"]$src$),
    ('gorbachev', 'red-flag-comes-down', 1,
     '1991년 12월 25일, 크렘린에서 내려진 붉은 깃발',
     '25 December 1991: The Red Flag Comes Down Over the Kremlin',
     $body$개혁은 그의 손을 벗어났다. 부분적인 개혁은 계획경제의 조정 기능을 허물면서도 시장의 조정 기능을 세우지 못했고, 상점 진열대는 비어 갔다. 글라스노스트는 민족문제의 봉인을 풀었고, 카라바흐와 발트, 캅카스에서 분쟁이 타올랐다. 1991년 3월 17일의 연방 존속 국민투표에서 참여 공화국 투표자의 76퍼센트가 연방 유지에 찬성했으나, 그 연방을 지킬 정치적 수단은 이미 흩어지고 있었다.

1991년 8월의 쿠데타 시도는 고르바초프 자신이 임명한 측근들이 일으켰고, 실패한 쿠데타는 그가 지키려던 당과 연방을 함께 무너뜨렸다. 12월 8일 러시아·우크라이나·벨라루스의 정상들이 벨로베자 숲에서 연방의 해체를 선언했을 때, 그에게는 이를 막을 힘이 남아 있지 않았다. 12월 25일 저녁 그는 대통령직 사임을 발표했고, 그날 밤 크렘린 위의 붉은 깃발이 내려졌다.

서방에서 고르바초프는 유혈 없이 냉전을 끝낸 지도자로 칭송받았다. 그러나 소련 시민들이 치른 대가는 참혹했다. 1990년대 러시아의 국내총생산은 거의 절반으로 줄었고, 남성 기대수명은 급락했으며, 수천만 명이 하루아침에 빈곤이나 무국적 상태로 떨어졌다. 사회주의를 구하려던 진심과 그 진심이 낳은 파국 사이의 간극, 그것이 그의 유산이다. 그는 2022년 8월 30일 모스크바에서 사망했다.$body$,
     $body$The reforms escaped his hands. Partial measures dismantled the coordinating functions of the planned economy without building those of a market, and the shop shelves emptied. Glasnost unsealed the national question, and conflict flared in Karabakh, the Baltics, and the Caucasus. In the referendum of 17 March 1991, 76 percent of voters in the participating republics chose to preserve the union, but the political instruments for preserving it were already dissolving.

The coup attempt of August 1991 was made by men Gorbachev himself had appointed, and its failure brought down together the party and the union he had tried to save. When the leaders of Russia, Ukraine, and Belarus declared the union dissolved in the Belovezha forest on 8 December, he had no strength left to stop them. On the evening of 25 December he announced his resignation as president, and that night the red flag over the Kremlin came down.

In the West, Gorbachev was celebrated as the leader who ended the Cold War without bloodshed. The price paid by Soviet citizens, however, was terrible: in the 1990s Russia's GDP nearly halved, male life expectancy plunged, and tens of millions fell overnight into poverty or statelessness. His legacy is the gulf between a sincere attempt to save socialism and the catastrophe that attempt produced. He died in Moscow on 30 August 2022.$body$,
     $src$["William Taubman, Gorbachev: His Life and Times (2017)", "Stephen Kotkin, Armageddon Averted: The Soviet Collapse, 1970–2000 (2001)", "Serhii Plokhy, The Last Empire: The Final Days of the Soviet Union (2014)", "Archie Brown, The Gorbachev Factor (1996)"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Boris Yeltsin (yeltsin)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('yeltsin', 'tank-and-belovezha', 0,
     '1991년 8월 19일, 탱크 위의 연설과 그해 12월의 서명',
     'August 1991: The Speech on the Tank, and the Signature That December',
     $body$스베르들롭스크 주당위원회 제1서기 출신의 보리스 옐친은 고르바초프에 의해 모스크바 시당 제1서기로 발탁되었다가, 1987년 개혁의 속도를 둘러싼 충돌 끝에 실각했다. 그러나 그는 실각을 발판으로 삼았다. 특권 반대와 급진 개혁을 내걸고 대중 정치인으로 되살아난 그는 1991년 6월 러시아공화국 대통령에 직접선거로 당선되었다.

1991년 8월 19일 아침, 국가비상사태위원회의 탱크들이 모스크바에 들어오자 옐친은 러시아 정부청사 앞에서 탱크 위에 올라 저항을 호소했다. 이 장면은 쿠데타를 무너뜨린 상징이 되었고, 권력은 소련 대통령이 아니라 러시아 대통령에게 넘어갔다. 그는 곧바로 러시아 영토에서 소련공산당의 활동을 정지시키고 당 재산을 몰수했다.

12월 8일, 옐친은 우크라이나의 크라프추크, 벨라루스의 슈시케비치와 함께 벨로베자 숲의 별장에서 소련의 소멸과 독립국가연합의 창설을 선언하는 협정에 서명했다. 아홉 달 전 국민투표에서 연방 유지에 찬성한 76퍼센트의 표심을 묻는 어떤 절차도 없었다. 세 공화국 정상의 서명으로 하나의 초강대국이 지도에서 지워졌다.$body$,
     $body$Boris Yeltsin, a former first secretary of the Sverdlovsk regional party committee, was brought to Moscow by Gorbachev as the city's party chief, then toppled in 1987 after a clash over the pace of reform. He turned his fall into a platform: reborn as a mass politician campaigning against privilege and for radical reform, he was elected president of the Russian republic by direct vote in June 1991.

On the morning of 19 August 1991, as the Emergency Committee's tanks entered Moscow, Yeltsin climbed onto a tank in front of the Russian government building and called for resistance. The scene became the symbol that broke the coup, and power passed not to the Soviet president but to the Russian one. He promptly suspended the CPSU's activity on Russian territory and confiscated its property.

On 8 December, at a hunting lodge in the Belovezha forest, Yeltsin signed with Ukraine's Kravchuk and Belarus's Shushkevich the accords declaring that the USSR had ceased to exist and creating the Commonwealth of Independent States. No procedure consulted the 76 percent who had voted nine months earlier to preserve the union. With the signatures of three republic leaders, a superpower was erased from the map.$body$,
     $src$["Timothy J. Colton, Yeltsin: A Life (2008)", "Serhii Plokhy, The Last Empire: The Final Days of the Soviet Union (2014)", "Stephen Kotkin, Armageddon Averted: The Soviet Collapse, 1970–2000 (2001)"]$src$),
    ('yeltsin', '1993-white-house', 1,
     '1993년 10월 4일, 포격당한 의회',
     '4 October 1993: The Parliament Under Tank Fire',
     $body$1992년 1월 2일 가이다르 정부가 가격을 전면 자유화하면서 「충격요법」이 시작되었다. 그해 물가는 공식 통계로도 2500퍼센트 넘게 뛰었고, 시민들의 평생 저축은 휴지가 되었다. 산업 생산은 해마다 무너졌고, 임금과 연금은 몇 달씩 체불되었다. 사유화는 국가 자산을 소수의 손에 몰아주었고, 1995–1996년의 「주식 담보 대출」은 석유와 금속 산업을 헐값에 신흥 재벌들에게 넘겼다.

개혁의 사회적 비용을 둘러싸고 최고소비에트와의 대립이 격화되자, 옐친은 1993년 9월 21일 대통령령 1400호로 의회를 해산했다. 헌법재판소는 이를 위헌으로 판정했으나 그는 밀어붙였다. 10월 3일 의회 지지자들과 경찰·군의 충돌이 유혈 사태로 번졌고, 10월 4일 아침 탱크들이 의회 건물을 포격했다. 2년 전 그가 그 앞에서 쿠데타에 맞섰던 바로 그 「백악관」이었다. 공식 집계만으로도 140명 이상이 죽었다. 두 달 뒤 국민투표로 채택된 새 헌법은 대통령에게 막대한 권한을 집중시켰다.

1990년대 러시아 남성의 기대수명은 57–58세까지 떨어졌고, 초과 사망은 수백만 명으로 추산된다. 1996년의 재선은 재벌 소유 언론의 총동원으로 얻어낸 것이었다. 1999년 12월 31일 옐친은 사임하면서 블라디미르 푸틴을 후계자로 지명했고, 2007년 4월 23일 사망했다. 민주주의의 이름으로 시작해 의회 포격과 과두정으로 끝난 궤적이었다.$body$,
     $body$Shock therapy began on 2 January 1992, when the Gaidar government freed prices across the board. Inflation that year exceeded 2,500 percent even by official statistics, and citizens' lifetime savings turned to waste paper. Industrial output collapsed year after year; wages and pensions went unpaid for months at a time. Privatization funnelled state assets into a few hands, and the loans-for-shares deals of 1995–1996 handed the oil and metals industries to the new oligarchs at token prices.

As conflict with the Supreme Soviet over the social cost of reform escalated, Yeltsin dissolved parliament by Decree No. 1400 on 21 September 1993. The Constitutional Court ruled the decree unconstitutional; he pressed on. On 3 October clashes between parliament's supporters and police and troops turned bloody, and on the morning of 4 October tanks shelled the parliament building: the same White House before which he had defied the coup two years earlier. More than 140 people died by the official count alone. The new constitution adopted by referendum two months later concentrated enormous power in the presidency.

In the 1990s Russian male life expectancy fell to 57–58 years, and excess deaths are estimated in the millions. His re-election in 1996 was won through the total mobilization of oligarch-owned media. On 31 December 1999 Yeltsin resigned, naming Vladimir Putin his successor; he died on 23 April 2007. It was a trajectory that began in the name of democracy and ended in the shelling of a parliament and in oligarchy.$body$,
     $src$["Timothy J. Colton, Yeltsin: A Life (2008)", "David M. Kotz and Fred Weir, Revolution from Above: The Demise of the Soviet System (1997)", "F. C. Notzon et al., Causes of Declining Life Expectancy in Russia, JAMA 279:10 (1998)", "Stephen Kotkin, Armageddon Averted: The Soviet Collapse, 1970–2000 (2001)"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Eduard Shevardnadze (shevardnadze)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('shevardnadze', 'foreign-minister-retreat', 0,
     '1985–1990년, 후퇴를 관리한 외무장관',
     '1985–1990: The Foreign Minister Who Managed the Retreat',
     $body$1985년 7월, 고르바초프는 외교 경험이 전혀 없는 그루지야 당 제1서기 예두아르트 셰바르드나제를 그로미코의 후임 외무장관으로 앉혔다. 놀라운 인사였으나 계산된 것이었다. 고르바초프는 낡은 외교의 관성에 물들지 않은 맹우를 원했다. 셰바르드나제는 1972년부터 그루지야를 이끌며 부패 척결 운동과 실험적인 경제 개혁으로 이름을 얻은 인물이었다.

이후 5년간 그는 「신사고」 외교의 실무 책임자였다. 1987년의 중거리핵전력조약, 1988년의 제네바 합의와 이듬해의 아프가니스탄 철군, 1990년의 독일 통일 승인과 유럽재래식무기감축조약까지, 소련의 세계적 후퇴는 그의 손을 거쳐 조약문이 되었다. 1989년 동유럽의 정권들이 차례로 무너질 때 소련의 불개입 방침을 대변한 것도 그였다.

비판자들은 그가 너무 많은 것을 너무 빨리, 반대급부 없이 내주었다고 지적한다. 특히 독일 통일 과정에서 나토의 동진 문제를 문서로 못박지 않은 것은 두고두고 논쟁거리가 되었다. 1990년 12월 20일 그는 「독재가 다가오고 있다」는 경고를 남기고 전격 사임했다. 여덟 달 뒤 그 경고는 쿠데타로 현실이 되었다.$body$,
     $body$In July 1985 Gorbachev made Eduard Shevardnadze, first secretary of the Georgian party with no diplomatic experience whatever, foreign minister in succession to Gromyko. It was a startling appointment, but a calculated one: Gorbachev wanted a loyal ally untouched by the inertia of the old diplomacy. Shevardnadze had led Georgia since 1972, making his name with anti-corruption drives and experimental economic reforms.

For the next five years he was the working executor of New Thinking diplomacy. The INF Treaty of 1987, the Geneva accords of 1988 and the withdrawal from Afghanistan the following year, the acceptance of German unification and the CFE treaty in 1990: the Soviet Union's global retreat passed through his hands and became treaty text. When the Eastern European regimes fell one after another in 1989, it was he who articulated Moscow's policy of non-intervention.

Critics charge that he gave away too much, too fast, for too little in return; above all, the failure to fix NATO's eastward non-expansion in writing during German unification became a lasting controversy. On 20 December 1990 he resigned abruptly with the warning that dictatorship was coming. Eight months later the warning came true as a coup.$body$,
     $src$["Eduard Shevardnadze, The Future Belongs to Freedom (1991)", "Carolyn M. Ekedahl and Melvin A. Goodman, The Wars of Eduard Shevardnadze (1997)", "Vladislav Zubok, A Failed Empire: The Soviet Union in the Cold War from Stalin to Gorbachev (2007)", "Archie Brown, The Gorbachev Factor (1996)"]$src$),
    ('shevardnadze', 'return-to-tbilisi', 1,
     '1992–2003년, 트빌리시로의 귀환과 장미혁명',
     '1992–2003: The Return to Tbilisi and the Rose Revolution',
     $body$1992년 3월, 셰바르드나제는 내전 끝에 초대 대통령 감사후르디아가 축출된 조국 그루지야로 돌아와 국가평의회 의장이 되었다. 소련 해체를 이끈 외교의 얼굴이, 이번에는 그 해체가 남긴 폐허를 수습하는 자리에 선 것이다. 그가 물려받은 나라는 민병대가 거리를 지배하고 압하지야와 남오세티야가 떨어져 나가는 파탄 국가였다.

1993년 압하지야 전쟁의 패배로 수십만 명의 그루지야계 주민이 고향에서 쫓겨났고, 셰바르드나제는 러시아의 지원을 얻는 대가로 독립국가연합 가입을 받아들여야 했다. 1995년 대통령에 당선된 그는 1995년과 1998년 두 차례의 암살 기도에서 살아남았다. 서방의 원조와 바쿠-트빌리시-제이한 송유관 유치가 국가를 지탱했으나, 경제는 침체했고 부패는 그의 정권의 대명사가 되었다.

2003년 11월, 부정 총선을 규탄하는 시위대가 장미를 들고 의회에 난입하자 그는 유혈 진압을 거부하고 사임했다. 장미혁명이었다. 그는 트빌리시의 자택에서 회고록을 쓰며 여생을 보냈고, 2014년 7월 7일 사망했다. 초강대국의 외교를 주무르던 인물이 작은 조국의 혼돈 속에서 경력을 마감한 이 궤적은, 소련 해체가 풀어놓은 운명들의 축도였다.$body$,
     $body$In March 1992 Shevardnadze returned to Georgia, where the first president, Gamsakhurdia, had been driven out by civil war, and became chairman of the State Council. The diplomatic face of the Soviet dissolution now stood amid the ruins that dissolution had left behind: a failing state where militias ruled the streets and Abkhazia and South Ossetia were breaking away.

Defeat in the Abkhazian war of 1993 drove hundreds of thousands of ethnic Georgians from their homes, and Shevardnadze had to accept membership of the CIS as the price of Russian support. Elected president in 1995, he survived assassination attempts in 1995 and 1998. Western aid and the Baku-Tbilisi-Ceyhan pipeline kept the state afloat, but the economy stagnated and corruption became the byword of his rule.

In November 2003, when demonstrators protesting a rigged parliamentary election entered the chamber carrying roses, he refused to order a bloody crackdown and resigned. It was the Rose Revolution. He spent his last years writing memoirs at his Tbilisi residence and died on 7 July 2014. The career of a man who had once steered a superpower's diplomacy, ending amid the chaos of his small homeland, was a miniature of the fates the Soviet collapse set loose.$body$,
     $src$["Carolyn M. Ekedahl and Melvin A. Goodman, The Wars of Eduard Shevardnadze (1997)", "Thomas de Waal, The Caucasus: An Introduction (2010)", "Eduard Shevardnadze, Als der Eiserne Vorhang zerriss (2007)"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Alexander Yakovlev (yakovlev)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('yakovlev', 'architect-of-glasnost', 0,
     '1985–1988년, 글라스노스트의 설계자',
     '1985–1988: The Architect of Glasnost',
     $body$알렉산드르 야코블레프는 전쟁 세대였다. 1941년 열여덟 살에 해병여단 소대장으로 참전한 그는 볼호프 전선에서 중상을 입고 평생 다리를 절었다. 전후 당 선전 기구에서 경력을 쌓았으나, 1972년 러시아 민족주의를 비판하는 논문으로 보수파의 반발을 사 캐나다 대사로 사실상 좌천되었다. 10년의 명예 유배 동안 그는 서방 사회를 관찰했고, 1983년 캐나다를 방문한 고르바초프와 사흘간 나눈 대화에서 개혁의 동지를 발견했다.

고르바초프는 그를 모스크바로 불러들여 1985년 당 선전부장으로, 1987년 정치국원으로 초고속 승진시켰다. 야코블레프는 글라스노스트의 실무 설계자였다. 그는 『오고뇨크』와 『모스크바 뉴스』 등에 개혁파 편집장들을 앉혔고, 금지되었던 영화들을 개봉시켰으며, 스탈린 시대 탄압 희생자 복권을 심의하는 정치국 위원회를 이끌었다. 1989년에는 몰로토프-리벤트로프 조약 비밀의정서의 존재를 공식 인정하는 작업을 주도했다.

보수파에게 그는 「페레스트로이카의 악령」이었고, 개혁파에게는 「글라스노스트의 아버지」였다. 어느 쪽이든, 1980년대 후반 소련의 정신적 풍경을 그만큼 바꾼 인물이 드물다는 데는 이견이 없었다.$body$,
     $body$Alexander Yakovlev belonged to the war generation. A marine brigade platoon commander at eighteen in 1941, he was gravely wounded on the Volkhov front and limped for the rest of his life. He built a postwar career in the party's propaganda apparatus, but a 1972 article criticizing Russian nationalism earned him the conservatives' wrath and effective exile as ambassador to Canada. During ten years of honorable banishment he observed Western society, and in three days of conversation with Gorbachev during the latter's 1983 visit to Canada he found a fellow reformer.

Gorbachev brought him back to Moscow and promoted him at extraordinary speed: head of the party's propaganda department in 1985, Politburo member in 1987. Yakovlev was the working architect of glasnost. He installed reformist editors at Ogonyok and Moscow News, had banned films released, and led the Politburo commission reviewing the rehabilitation of victims of Stalin-era repression. In 1989 he directed the work of officially acknowledging the existence of the secret protocols to the Molotov-Ribbentrop pact.

To conservatives he was the evil spirit of perestroika; to reformers, the father of glasnost. Neither side disputed that few individuals did more to transform the Soviet Union's mental landscape in the late 1980s.$body$,
     $src$["William Taubman, Gorbachev: His Life and Times (2017)", "Archie Brown, The Gorbachev Factor (1996)", "Alexander Yakovlev, Omut pamyati (Maelstrom of Memory, 2000)"]$src$),
    ('yakovlev', 'de-sovietization-and-archives', 1,
     '탈소비에트화의 이데올로그, 그리고 문서고',
     'The Ideologist of De-Sovietization, and the Archives',
     $body$소련 해체 후 야코블레프의 사상적 여정은 마르크스주의와의 전면 결별로 끝났다. 그는 만년의 저작들에서 소비에트 체제를 개혁 불가능한 범죄적 체제로 규정했고, 자신이 오래전부터 체제를 안에서부터 허물기 위해 「스탈린을 때려 레닌을 치는」 우회 전술을 썼다고 주장했다. 그러나 이런 회고적 주장에 대해 아치 브라운을 비롯한 연구자들은 신중하다. 동시대 기록 속의 야코블레프는 파괴자가 아니라, 사회주의의 민주적 갱신을 진지하게 믿었던 개혁 공산주의자에 가깝기 때문이다.

그의 만년에서 가장 논쟁적인 유산은 이데올로기였고, 가장 값진 유산은 문서였다. 그는 옐친 정부에서 정치탄압 희생자 복권위원회 위원장을 맡았고, 국제민주주의재단을 세워 「러시아 20세기」 문서집 총서로 방대한 당·국가 기밀문서를 공간했다. 오늘날 역사가들이 소비에트사를 문서로 검증할 수 있게 된 데에는 그의 몫이 있다.

그는 2005년 10월 18일 모스크바에서 사망했다. 사회주의의 깃발 아래 전쟁에서 피를 흘린 청년이 그 체제의 가장 철저한 부정자로 생을 마친 궤적은, 페레스트로이카 세대가 겪은 환멸의 깊이를 보여주는 초상으로 남아 있다.$body$,
     $body$After the Soviet collapse, Yakovlev's intellectual journey ended in a total break with Marxism. In his late writings he defined the Soviet system as criminal and beyond reform, and claimed that he had long worked to undermine it from within by the roundabout tactic of striking at Stalin in order to hit Lenin. Scholars such as Archie Brown treat these retrospective claims with caution: the Yakovlev of the contemporary record looks less like a saboteur than a reform communist who sincerely believed in the democratic renewal of socialism.

The most contested legacy of his last years was ideological; the most valuable was documentary. Under Yeltsin he chaired the commission for the rehabilitation of victims of political repression, and through his International Democracy Foundation he published vast runs of classified party and state documents in the Rossiya XX vek series. That historians today can test Soviet history against documents owes something to him.

He died in Moscow on 18 October 2005. The arc of a young man who shed his blood in war under the banner of socialism and ended as that system's most thorough negator remains a portrait of the depth of disillusionment lived by the perestroika generation.$body$,
     $src$["Alexander Yakovlev, A Century of Violence in Soviet Russia (2002)", "Archie Brown, The Gorbachev Factor (1996)", "Alexander Yakovlev, Omut pamyati (Maelstrom of Memory, 2000)", "William Taubman, Gorbachev: His Life and Times (2017)"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Vladimir Kryuchkov (kryuchkov)
-- ============================================================
INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT v.person_id, v.slug, v.sort_order, v.heading_ko, v.heading_en, v.body_ko, v.body_en, v.sources::jsonb, NOW()
FROM (VALUES
    ('kryuchkov', 'andropov-man-kgb', 0,
     '1988년 10월, 안드로포프의 사람이 KGB를 맡다',
     'October 1988: Andropov''s Man Takes Over the KGB',
     $body$블라디미르 크류치코프의 경력은 유리 안드로포프의 그림자 속에서 자랐다. 1956년 헝가리 봉기 당시 그는 부다페스트 주재 소련대사관의 젊은 외교관으로, 안드로포프 대사의 곁에서 사회주의 정권이 무너지는 광경을 목격했다. 그 경험은 두 사람 모두에게 평생의 각인을 남겼다. 안드로포프가 KGB 의장이 되자 크류치코프도 그를 따라갔고, 1974년부터 14년간 해외정보를 총괄하는 제1총국장을 지냈다.

1988년 10월 고르바초프는 그를 KGB 의장으로 임명했다. 개혁에 우호적인 정보기관장을 얻었다는 기대였으나, 크류치코프의 눈에 비친 페레스트로이카의 말년은 국가 해체의 가속이었다. 동유럽이 떨어져 나가고, 발트 공화국들이 독립을 선언하고, 당의 권위가 무너지는 것을 그는 서방 정보기관의 「영향력 공작」이 거둔 결실로 읽었다. 1991년 6월 그는 최고소비에트 비공개 회의에서 나라가 파국을 향해 가고 있다고 경고했다.

1990년 말부터 그는 비상사태 도입을 촉구하는 강경파의 중심이 되었다. KGB는 그의 지시로 비상통치 계획 문서들을 준비했고, 그 문서들은 이듬해 8월에 쓰이게 된다.$body$,
     $body$Vladimir Kryuchkov's career grew in the shadow of Yuri Andropov. During the Hungarian uprising of 1956 he was a young diplomat at the Soviet embassy in Budapest, watching at Ambassador Andropov's side as a socialist government collapsed. The experience marked both men for life. When Andropov became KGB chairman, Kryuchkov followed him, and from 1974 he headed the First Chief Directorate, in charge of foreign intelligence, for fourteen years.

In October 1988 Gorbachev appointed him KGB chairman, expecting an intelligence chief sympathetic to reform. But to Kryuchkov's eyes the last years of perestroika looked like accelerating state dissolution. As Eastern Europe broke away, the Baltic republics declared independence, and the party's authority crumbled, he read it all as the harvest of Western intelligence operations through agents of influence. In June 1991, in a closed session of the Supreme Soviet, he warned that the country was heading for catastrophe.

From late 1990 he became the centre of the hardliners urging the introduction of emergency rule. On his instructions the KGB prepared planning documents for emergency governance, documents that would be put to use the following August.$body$,
     $src$["Christopher Andrew and Vasili Mitrokhin, The Sword and the Shield: The Mitrokhin Archive (1999)", "Vladimir Kryuchkov, Lichnoe delo (Personal File, 1996)", "Vladislav Zubok, Collapse: The Fall of the Soviet Union (2021)"]$src$),
    ('kryuchkov', 'gkchp-august-1991', 1,
     '1991년 8월 19일, 사흘 만에 무너진 국가비상사태위원회',
     '19 August 1991: The Emergency Committee That Collapsed in Three Days',
     $body$1991년 8월 20일로 예정된 신연방조약 서명은 크류치코프에게 연방 해체의 법적 확정으로 보였다. 8월 18일 그가 조직한 대표단이 크림 포로스의 대통령 별장으로 날아가 고르바초프에게 비상사태 동의를 요구했고, 거부당하자 그의 통신을 끊고 그를 별장에 연금했다. 8월 19일 아침, 국가비상사태위원회(GKChP)는 대통령의 유고를 선언하고 모스크바에 탱크를 들여보냈다.

그러나 위원회에는 3월 국민투표에서 연방 유지에 찬성한 76퍼센트를 결집할 어떤 정치적 기획도 없었다. 기자회견에서 대통령 대행 야나예프의 손은 떨렸고, 옐친 체포 명령은 끝내 내려지지 않았으며, 백악관 강습 계획은 유혈을 꺼린 군과 알파부대가 물러서면서 무산되었다. 8월 20일에서 21일로 넘어가는 밤, 지하차도에서 청년 세 명이 장갑차에 깔려 숨진 것이 이 쿠데타의 거의 유일한 유혈이었다. 위원회는 사흘 만에 무너졌고 크류치코프는 체포되었다.

연방을 구하려던 시도는 연방의 숨통을 끊는 결과가 되었다. 쿠데타 실패 나흘 만에 당의 활동이 정지되었고, 넉 달 뒤 연방 자체가 해체되었다. 마트로스카야 티시나 감옥에 수감된 크류치코프는 1994년 국가두마의 사면으로 풀려났고, 죽을 때까지 자신의 행동이 국가를 지키려는 의무였다고 주장했다. 그는 2007년 11월 23일 사망했다. 역사는 이 사건을, 지키려던 것을 지킬 능력도 계획도 갖추지 못했던 비극적 실패로 기록한다.$body$,
     $body$To Kryuchkov, the new union treaty due to be signed on 20 August 1991 looked like the legal consummation of the union's dissolution. On 18 August a delegation he organized flew to the presidential dacha at Foros in Crimea to demand Gorbachev's consent to a state of emergency; refused, they cut his communications and confined him there. On the morning of 19 August the State Committee on the State of Emergency, the GKChP, declared the president incapacitated and sent tanks into Moscow.

Yet the committee had no political plan for rallying the 76 percent who had voted in March to preserve the union. Acting president Yanayev's hands trembled at the press conference, the order to arrest Yeltsin was never given, and the plan to storm the White House dissolved as the army and the Alpha group, unwilling to shed blood, stood aside. Three young men crushed by armoured vehicles in an underpass on the night of 20–21 August were almost the coup's only bloodshed. The committee collapsed in three days, and Kryuchkov was arrested.

The attempt to save the union ended by cutting its lifeline: within four days of the coup's failure the party's activity was suspended, and within four months the union itself was dissolved. Imprisoned in Matrosskaya Tishina, Kryuchkov was released under the State Duma's amnesty in 1994 and insisted to the end that he had acted out of duty to preserve the state. He died on 23 November 2007. History records the episode as a tragic failure: an attempt that possessed neither the capacity nor the plan to protect what it meant to save.$body$,
     $src$["Serhii Plokhy, The Last Empire: The Final Days of the Soviet Union (2014)", "Vladislav Zubok, Collapse: The Fall of the Soviet Union (2021)", "GKChP, Obrashchenie k sovetskomu narodu (Appeal to the Soviet People, 19 August 1991)", "Stephen Kotkin, Armageddon Averted: The Soviet Collapse, 1970–2000 (2001)"]$src$)
) AS v(person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();
