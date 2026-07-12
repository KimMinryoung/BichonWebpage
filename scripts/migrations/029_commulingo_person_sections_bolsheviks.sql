-- 029_commulingo_person_sections_bolsheviks.sql
-- Person detail sections for 12 Bolshevik-era figures that previously had none:
-- nikolai-krylenko, nadezhda-krupskaya, gorky, babel, zamyatin, mayakovsky,
-- varvara-yakovleva, podvoisky, tomsky, shlyapnikov, armand, antonov-ovseenko.
-- Two narrative sections per person, bilingual ko/en, markdown bodies, real sources.
-- Idempotent: ON CONFLICT (person_id, slug) DO UPDATE.

-- ============================================================
-- Nikolai Krylenko
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'nikolai-krylenko', 'commander-in-chief-1917', 0,
    $h$1917년 11월, 소위가 총사령관이 되다$h$,
    $h$November 1917, An Ensign Becomes Commander-in-Chief$h$,
    $b$1917년 11월 22일, 인민위원회의는 강화 교섭 명령을 거부한 두호닌 장군을 해임하고 그 자리에 소위 니콜라이 크릴렌코를 임명했다. 차르 군대의 최말단 장교가 수백만 병사의 최고총사령관이 된 이 인사는 혁명이 군대의 위계를 어떻게 뒤집었는지 보여 주는 상징적 사건이었다. 크릴렌코는 페테르부르크 대학 출신의 볼셰비키 연설가로, 전선 병사들 사이에서 「아브람 동지」라는 당명으로 알려져 있었다.

크릴렌코는 수병 분견대와 함께 열차로 전선 사령부가 있는 모길료프로 향했고, 12월 3일 스타프카를 무혈 접수했다. 같은 날 격분한 병사와 수병들이 두호닌을 살해했는데, 크릴렌코는 이를 막으려 했으나 실패했고 자기 통제를 벗어난 폭력을 공개적으로 개탄했다. 이후 그는 독일과의 정전 교섭을 뒷받침하며 낡은 군대의 해산과 새 군대의 건설이라는 모순된 과제를 떠안았다.

1918년 3월 브레스트-리톱스크 조약 체결과 함께 총사령관직에서 물러난 크릴렌코는 군복을 벗고 혁명 법정으로 자리를 옮겼다. 세계대전을 끝내겠다는 볼셰비키의 공약을 전선에서 집행한 인물로서, 그는 10월 혁명이 단지 궁전의 탈취가 아니라 참호 속 병사 대중의 평화 열망 위에 서 있었음을 증언하는 존재였다.$b$,
    $b$On 22 November 1917 the Council of People's Commissars dismissed General Dukhonin, who had refused the order to open armistice negotiations, and appointed Ensign Nikolai Krylenko Supreme Commander-in-Chief in his place. The promotion of one of the tsarist army's most junior officers to command over millions of soldiers was a symbol of how thoroughly the revolution had overturned the military hierarchy. Krylenko, a Bolshevik orator educated at St Petersburg University, was known among frontline soldiers by his party name "Comrade Abram".

Krylenko traveled with a detachment of sailors by rail to the general headquarters at Mogilev and took over the Stavka without bloodshed on 3 December. That same day enraged soldiers and sailors lynched Dukhonin; Krylenko tried and failed to stop them, and publicly deplored the violence that had escaped his control. He then backed the armistice negotiations with Germany while shouldering the contradictory task of dissolving the old army and building a new one.

With the signing of the Treaty of Brest-Litovsk in March 1918 Krylenko resigned his command and moved from the army to the revolutionary courts. As the man who had enforced the Bolshevik promise of peace at the front, he embodied the fact that October rested not merely on the seizure of a palace but on the peace hunger of the soldier masses in the trenches.$b$,
    $s$["Alexander Rabinowitch, The Bolsheviks in Power: The First Year of Soviet Rule in Petrograd (Indiana UP, 2007)","Rex A. Wade, The Russian Revolution, 1917 (Cambridge UP, 2000)","V. I. Lenin, 'To All Army Committees, To All Soldiers of the Revolutionary Army', November 1917, Collected Works vol. 26 (marxists.org)","John W. Wheeler-Bennett, Brest-Litovsk: The Forgotten Peace (1938)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'nikolai-krylenko')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'nikolai-krylenko', 'revolutionary-justice-chess-alpinism', 1,
    $h$혁명 법정과 체스, 그리고 파미르의 등반가$h$,
    $h$Revolutionary Tribunals, Chess, and the Pamirs$h$,
    $b$내전기부터 크릴렌코는 소비에트 법 체계의 건설자였다. 그는 수석 검사로서 1922년 사회혁명당 재판, 1928년 샤흐티 재판, 1930년 산업당 재판 등 굵직한 정치 재판을 이끌었고, 1931년 러시아공화국, 1936년 소련의 사법인민위원이 되었다. 법을 계급투쟁의 도구로 보는 그의 법학은 절차적 형식주의를 배격했으나, 동시에 그는 법전 편찬과 법률 교육 등 새 국가의 사법 제도화에 힘썼다.

크릴렌코는 소련 체스와 등산의 최대 후원자이기도 했다. 전연방 체스 부문 의장으로서 「체스를 대중에게」라는 구호 아래 1925년 모스크바 국제 체스 대회를 조직했고 잡지 『64』를 창간했다. 여름이면 파미르 고원으로 떠나 1928년 소련-독일 합동 파미르 탐사를 비롯한 원정을 이끌었으며, 소련 등산 운동의 제도적 기틀을 놓았다.

1938년 1월 최고소비에트 회의에서 그의 「취미」는 인민위원의 직무 태만으로 공격받았다. 경쟁자였던 비신스키의 법학이 그의 자리를 대신했고, 크릴렌코는 1월 31일 체포되어 7월 29일 20분간의 재판 끝에 총살되었다. 1956년 명예 회복되었다. 혁명 법정의 창설자가 그 법정의 절차조차 없이 사라진 사실은, 대숙청이 소비에트 법질서 자체를 삼켰음을 보여 준다.$b$,
    $b$From the Civil War years Krylenko was a builder of the Soviet legal system. As chief state prosecutor he led the major political trials of the era, including the SR trial of 1922, the Shakhty trial of 1928 and the Industrial Party trial of 1930, and he became People's Commissar of Justice of the RSFSR in 1931 and of the USSR in 1936. His jurisprudence treated law as an instrument of class struggle and rejected procedural formalism, yet he also worked at codification and legal education, the institutionalization of justice in the new state.

Krylenko was also the greatest patron of Soviet chess and mountaineering. As chairman of the All-Union chess section he organized the Moscow international tournament of 1925 under the slogan "chess to the masses" and founded the magazine 64. In summer he left for the Pamirs, leading expeditions including the joint Soviet-German Pamir expedition of 1928, and he laid the institutional foundations of Soviet alpinism.

At the January 1938 session of the Supreme Soviet his "hobbies" were attacked as proof of a commissar neglecting his duties. Vyshinsky's rival school of law took the place of his own; Krylenko was arrested on 31 January and shot on 29 July 1938 after a trial that lasted twenty minutes. He was rehabilitated in 1956. That the founder of the revolutionary tribunals vanished without even their minimal procedure shows how the Great Terror consumed the Soviet legal order itself.$b$,
    $s$["Peter H. Solomon, Soviet Criminal Justice under Stalin (Cambridge UP, 1996)","Eugene Huskey, Russian Lawyers and the Soviet State (Princeton UP, 1986)","D. J. Richards, Soviet Chess (Oxford UP, 1965)","Eva Maurer, Wege zum Pik Stalin: Sowjetische Alpinisten 1928–1953 (Chronos, 2010)","J. Arch Getty & Oleg V. Naumov, The Road to Terror (Yale UP, 1999)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'nikolai-krylenko')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Nadezhda Krupskaya
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'nadezhda-krupskaya', 'iskra-secretary', 0,
    $h$1901년 뮌헨, 이스크라의 비밀 통신망$h$,
    $h$Munich 1901, Running Iskra's Secret Network$h$,
    $b$나데즈다 크룹스카야는 「레닌의 아내」이기 이전에 이미 독자적인 혁명가였다. 페테르부르크의 야학 교사로서 5년간 노동자들을 가르치며 그들 속에서 마르크스주의자가 되었고, 1896년 노동계급해방투쟁동맹 활동으로 체포되어 유형을 살았다. 1899년에 쓴 소책자 『여성 노동자』는 러시아 마르크스주의가 여성 노동자 문제를 본격적으로 다룬 최초의 저작이었다.

1901년부터 그는 망명지 뮌헨에서 신문 『이스크라』의 서기가 되었다. 화학 잉크로 쓴 암호 편지, 책 제본 속에 숨겨 들여보내는 신문, 수백 명에 이르는 지하 연락원의 가명과 주소를 기억하는 일이 모두 그의 몫이었다. 러시아 각지의 지하 위원회와 망명 편집부를 잇는 이 통신망이 없었다면 당은 존재할 수 없었다. 이후 20년간 그는 사실상 볼셰비키당의 조직 서기로 일했다.$b$,
    $b$Nadezhda Krupskaya was a revolutionary in her own right long before she was "Lenin's wife". As a teacher in a Sunday evening school for St Petersburg workers she spent five years teaching and became a Marxist among them, and in 1896 she was arrested for her work in the Union of Struggle for the Emancipation of the Working Class and sentenced to exile. Her 1899 pamphlet The Woman Worker was the first work of Russian Marxism devoted to the condition of women workers.

From 1901, in emigration in Munich, she became secretary of the newspaper Iskra. Letters written in code and invisible ink, newspapers smuggled inside book bindings, the aliases and addresses of hundreds of underground agents held in memory: all of it was her work. Without the communications network she ran between the exile editorial board and the underground committees across Russia, the party could not have existed. For the next two decades she served as the Bolsheviks' organizational secretary in all but name.$b$,
    $s$["N. K. Krupskaya, Reminiscences of Lenin (1933, marxists.org)","Robert H. McNeal, Bride of the Revolution: Krupskaya and Lenin (1972)","N. K. Krupskaya, The Woman Worker (1899)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'nadezhda-krupskaya')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'nadezhda-krupskaya', 'likbez-education', 1,
    $h$문맹 퇴치, 나라 전체를 학교로$h$,
    $h$Likbez, Turning a Country into a School$h$,
    $b$1917년 이후 크룹스카야는 교육인민위원부의 부인민위원이자 정치교육총국(글라프폴리트프로스베트)의 의장으로서 소비에트 교육 체계의 설계자가 되었다. 1919년 12월 26일 인민위원회의는 8세부터 50세까지 모든 문맹 인민에게 읽기를 배울 의무를 부과하는 문맹 퇴치 법령을 공포했고, 크룹스카야는 이 운동, 즉 리크베스의 이론가이자 조직자로 나섰다. 도서관망과 성인 학교, 독서실이 전국에 세워졌다.

성과는 통계로 남았다. 1897년 인구조사에서 제국 인민의 문해율은 대략 넷에 하나 꼴이었으나, 1939년 조사에서 9세부터 49세 인구의 문해율은 87퍼센트를 넘어섰다. 크룹스카야는 또한 통합노동학교와 유아 교육, 소비에트 도서관학, 피오네르 조직의 기초를 놓았고, 교육이 단순한 기술 전수가 아니라 인민의 자기 해방이라는 관점을 끝까지 견지했다. 1939년 2월 모스크바에서 사망해 크렘린 벽에 안장되었다.$b$,
    $b$After 1917 Krupskaya became deputy People's Commissar of Enlightenment and chair of the Main Political Education Committee (Glavpolitprosvet), one of the chief architects of the Soviet educational system. On 26 December 1919 the Council of People's Commissars issued the decree on the liquidation of illiteracy, obliging everyone between the ages of eight and fifty to learn to read, and Krupskaya became the theorist and organizer of the likbez campaign. Networks of libraries, adult schools and reading rooms spread across the country.

The results survive in the statistics. In the census of 1897 roughly one in four subjects of the empire could read; the census of 1939 recorded literacy above 87 percent among those aged 9 to 49. Krupskaya also laid foundations for the unified labor school, preschool education, Soviet library science and the Pioneer organization, and to the end she held to the view that education was not the transfer of skills but the self-emancipation of the people. She died in Moscow in February 1939 and was buried by the Kremlin wall.$b$,
    $s$["Sheila Fitzpatrick, The Commissariat of Enlightenment (Cambridge UP, 1970)","Charles E. Clark, Uprooting Otherness: The Literacy Campaign in NEP-Era Russia (Susquehanna UP, 2000)","Sovnarkom decree 'On the Liquidation of Illiteracy among the Population of the RSFSR', 26 December 1919","Ben Eklof, 'Russian Literacy Campaigns, 1861–1939', in Arnove & Graff (eds.), National Literacy Campaigns (1987)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'nadezhda-krupskaya')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Maxim Gorky
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'gorky', 'bloody-sunday-1905', 0,
    $h$1905년 1월, 피의 일요일과 페트로파블롭스크 요새$h$,
    $h$January 1905, Bloody Sunday and the Fortress$h$,
    $b$볼가 강변의 고아 알렉세이 페시코프는 부두 노동자, 빵집 점원, 방랑자로 러시아의 밑바닥을 떠돌며 독학했고, 「쓰라린 자」를 뜻하는 막심 고리키라는 필명으로 러시아 문학의 스타가 되었다. 부랑자들의 세계를 무대에 올린 희곡 『밤주막』(1902)은 유럽을 뒤흔들었다. 그의 명성과 인세는 곧장 혁명 운동의 금고로 흘러들었다.

1905년 1월 22일(구력 1월 9일) 피의 일요일 전야, 고리키는 유혈을 막으려는 지식인 대표단에 참여해 관청을 오갔고, 학살 직후 「러시아의 모든 시민에게」라는 격문을 써서 차르 정부를 살인자로 고발했다. 그는 페트로파블롭스크 요새에 수감되었으나 유럽 전역의 작가와 과학자 들이 벌인 항의 운동으로 한 달 만에 석방되었다. 이후 그는 볼셰비키의 최대 재정 후원자가 되어 미국 모금 여행을 다녀왔고, 카프리 섬 망명 시절에는 자기 별장에서 노동자 혁명가들을 위한 당 학교가 열리도록 자리를 내주었다.$b$,
    $b$Alexei Peshkov, an orphan from the Volga, educated himself while drifting through Russia's lower depths as a dockhand, a baker's assistant and a tramp, and became the star of Russian literature under the pen name Maxim Gorky, "the bitter one". His play The Lower Depths (1902), which put the world of the down-and-out on stage, shook Europe. His fame and royalties flowed straight into the funds of the revolutionary movement.

On the eve of Bloody Sunday, 22 January 1905 (9 January Old Style), Gorky joined the deputation of intellectuals that went from office to office trying to prevent bloodshed, and immediately after the massacre he wrote an appeal, "To All Russian Citizens", denouncing the tsar's government as murderers. He was locked in the Peter and Paul Fortress, but a protest campaign by writers and scientists across Europe forced his release within a month. He went on to become the Bolsheviks' greatest financial patron, touring America to raise funds, and during his exile on Capri he gave over his villa to a party school for worker revolutionaries.$b$,
    $s$["Tovah Yedlin, Maxim Gorky: A Political Biography (Praeger, 1999)","Abraham Ascher, The Revolution of 1905, vol. 1 (Stanford UP, 1988)","Maxim Gorky, My Universities (1923)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'gorky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'gorky', 'untimely-thoughts-return', 1,
    $h$『때 이른 생각들』, 그리고 귀환$h$,
    $h$Untimely Thoughts, and the Return$h$,
    $b$1917년부터 1918년까지 고리키는 자신의 신문 『노바야 지즌』에 「때 이른 생각들」 연재를 이어 가며 10월 봉기의 시기와 방법에 공개적으로 반대했다. 오랜 동지 레닌과의 논쟁은 격렬했으나 최종적인 결별은 아니었다. 내전기에 그는 세계문학 출판사와 학자생활개선위원회를 만들어 굶주리는 작가와 과학자 수천 명에게 배급과 일자리를 마련해 주었고, 그의 집은 페트로그라드 지식인들의 피난처가 되었다.

1921년 결핵이 악화되어 이탈리아로 떠났던 그는 1928년부터 소련을 다시 찾았고 1933년 영구 귀국했다. 1934년 제1차 소비에트작가대회를 주재하며 작가동맹의 초대 의장이 되었고, 사회주의 리얼리즘의 정식화에 이름을 빌려 주었다. 문학사가들은 이 말년을 두고 여전히 논쟁하지만, 세계 문학과 소비에트 문화 건설을 잇는 다리로서 그가 지닌 권위는 누구도 대신할 수 없었다. 1936년 6월 지병으로 사망해 크렘린 벽에 안장되었다.$b$,
    $b$Through 1917 and into 1918 Gorky ran the series "Untimely Thoughts" in his newspaper Novaya Zhizn, publicly opposing the timing and methods of the October rising. His quarrel with his old comrade Lenin was fierce, but it was never a final break. In the Civil War years he created the World Literature publishing house and the Commission for Improving the Living Conditions of Scholars, which found rations and work for thousands of starving writers and scientists, and his home became a refuge for the Petrograd intelligentsia.

He left for Italy in 1921 as his tuberculosis worsened, began revisiting the Soviet Union in 1928 and returned for good in 1933. In 1934 he presided over the First Congress of Soviet Writers as the founding chairman of the Writers' Union and lent his name to the formulation of socialist realism. Literary historians still argue over these last years, but no one else could have carried his authority as the bridge between world literature and the construction of Soviet culture. He died of illness in June 1936 and was buried by the Kremlin wall.$b$,
    $s$["Maxim Gorky, Untimely Thoughts: Essays on Revolution, Culture, and the Bolsheviks, trans. Herman Ermolaev (1968)","Tovah Yedlin, Maxim Gorky: A Political Biography (Praeger, 1999)","Soviet Writers' Congress 1934: The Debate on Socialist Realism and Modernism (Lawrence & Wishart, 1977)","Katerina Clark, Moscow, the Fourth Rome (Harvard UP, 2011)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'gorky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Isaac Babel
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'babel', 'red-cavalry-1920', 0,
    $h$1920년 여름, 제1기병군의 종군기자$h$,
    $h$Summer 1920, War Correspondent with the First Cavalry$h$,
    $b$1920년 소비에트-폴란드 전쟁이 벌어지자 오데사 출신의 젊은 작가 이사크 바벨은 「키릴 류토프」라는 가명으로 부됸니의 제1기병군에 종군기자로 배속되었다. 그는 군 신문 『붉은 기병』에 기사를 쓰면서 남몰래 일기를 적었다. 안경 쓴 유대인 지식인이 카자크 기병들 사이에서 보낸 이 여름은 그의 문학 전체의 광맥이 되었다.

그 일기에서 태어난 연작 『기병대』(1926)는 혁명 전쟁의 잔혹과 영웅성을 한 문장 안에 눌러 담은, 20세기 단편소설의 새로운 문법이었다. 부됸니는 자기 부대가 모욕당했다며 격분해 공개 논쟁을 벌였으나, 1928년 고리키가 지면에서 바벨을 옹호하며 논쟁을 정리했다. 「제자리에 찍힌 마침표만큼 강하게 심장을 찌르는 쇠는 없다」고 말한 그는 초고를 수십 번 고쳐 쓰는 완벽주의자였고, 그 작업 방식은 전설이 되었다.$b$,
    $b$When the Soviet-Polish war broke out in 1920, the young Odessa writer Isaac Babel was attached to Budyonny's First Cavalry Army as a war correspondent under the alias "Kirill Lyutov". He wrote for the army newspaper Red Cavalryman while secretly keeping a diary. That summer, spent as a bespectacled Jewish intellectual riding among Cossack horsemen, became the lode of his entire literary life.

Out of the diary grew the story cycle Red Cavalry (1926), a new grammar for the twentieth-century short story that pressed the cruelty and the heroism of revolutionary war into single sentences. Budyonny raged in print that his army had been slandered, but in 1928 Gorky defended Babel publicly and closed the argument. The writer who declared that "no iron can pierce the heart with such force as a full stop put just at the right place" rewrote his drafts dozens of times, and his working method became legend.$b$,
    $s$["Isaac Babel, 1920 Diary, ed. Carol J. Avins (Yale UP, 1995)","Isaac Babel, Red Cavalry (1926)","The Complete Works of Isaac Babel, ed. Nathalie Babel (Norton, 2002)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'babel')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'babel', 'genre-of-silence-1939', 1,
    $h$침묵이라는 장르, 1939년 5월 15일$h$,
    $h$The Genre of Silence, 15 May 1939$h$,
    $b$1934년 제1차 작가대회 연단에서 바벨은 자신이 「침묵이라는 새로운 장르의 대가」가 되었다고 농담했다. 사회주의 리얼리즘의 시대에 그의 과작은 스스로 택한 방어이기도 했다. 그는 발표하지 않은 채 집필을 계속했고, 집단화를 다룬 소설과 체카를 다룬 작품을 준비하고 있었다.

1939년 5월 15일 새벽 페레델키노 별장에서 체포될 때 그가 남긴 부탁은 「작업을 끝맺게 해 달라」는 것뿐이었다. 압수된 원고 뭉치, 미발표 단편과 희곡 들은 끝내 발견되지 않았다. 고문 속에 나온 자백을 그는 법정에서 철회했으나 1940년 1월 27일 총살되었다. 1954년 명예 회복 뒤 그의 책은 다시 간행되었고, 소련과 세계의 독자들은 혁명이 낳은 가장 위대한 단편작가를 되찾았다. 비탈리 셴탈린스키가 공개한 수사 기록은 이 사건 전체를 문서로 복원했다.$b$,
    $b$From the platform of the First Writers' Congress in 1934 Babel joked that he had become "a great master of a new genre, the genre of silence". In the age of socialist realism his small output was also a chosen defense. He kept writing without publishing, preparing work on collectivization and on the Cheka.

When he was arrested at his Peredelkino dacha before dawn on 15 May 1939, his one plea was to be allowed to finish his work. The confiscated folders of manuscripts, unpublished stories and plays, were never found. He retracted in court the confession extracted under torture, and was shot on 27 January 1940. After his rehabilitation in 1954 his books returned to print, and readers in the Soviet Union and beyond recovered the greatest short-story writer the revolution had produced. The investigation file, published by Vitaly Shentalinsky, restored the whole case to the documentary record.$b$,
    $s$["Vitaly Shentalinsky, Arrested Voices: Resurrecting the Disappeared Writers of the Soviet Regime (Free Press, 1996)","Antonina Pirozhkova, At His Side: The Last Years of Isaac Babel (Steerforth, 1996)","Soviet Writers' Congress 1934 (Lawrence & Wishart, 1977)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'babel')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Yevgeny Zamyatin
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'zamyatin', 'bolshevik-engineer-1905', 0,
    $h$1905년의 볼셰비키, 쇄빙선의 기술자$h$,
    $h$A Bolshevik of 1905, Engineer of Icebreakers$h$,
    $b$예브게니 자먀틴은 1905년 혁명의 볼셰비키였다. 페테르부르크 공과대학 학생 시절 당의 볼셰비키 분파에 가담해 선전 활동을 벌였고, 1905년 12월 체포되어 독방에서 몇 달을 보낸 뒤 수도에서 추방당했다. 훗날 그는 「그 시절 볼셰비키가 된다는 것은 최대 저항선을 따라가는 일이었고, 나는 그때 볼셰비키였다」고 회고했다.

그는 조선 기사로서도 일급이었다. 1916년 러시아 정부의 주문으로 영국 뉴캐슬에 파견되어 쇄빙선 건조를 감독했는데, 그중에는 훗날 「레닌」으로 개명되는 상트 알렉산드르 넵스키 호가 있었다. 기계의 정밀함과 타고난 이단자의 기질을 한 몸에 지닌 이 「영국풍의 러시아인」은 1917년 9월 혁명의 소용돌이 속으로 귀국했고, 페트로그라드 문단의 장인이자 스승이 되어 세라피온 형제들을 길러 냈다.$b$,
    $b$Yevgeny Zamyatin was a Bolshevik of 1905. As a student at the St Petersburg Polytechnic Institute he joined the party's Bolshevik faction and worked as an agitator; in December 1905 he was arrested, spent months in solitary confinement and was banished from the capital. He later recalled: "In those years being a Bolshevik meant following the line of greatest resistance, and I was a Bolshevik then."

He was also a first-rate naval engineer. In 1916 the Russian government sent him to Newcastle in England to supervise the construction of icebreakers, among them the St Alexander Nevsky, later renamed the Lenin. Precision engineer and born heretic in one, this "Russian Englishman" returned in September 1917 into the whirlwind of the revolution, became a master craftsman of the Petrograd literary world and trained the Serapion Brothers.$b$,
    $s$["J. A. E. Curtis, The Englishman from Lebedian: A Life of Evgeny Zamiatin (Academic Studies Press, 2013)","Alex M. Shane, The Life and Works of Evgenij Zamjatin (University of California Press, 1968)","Yevgeny Zamyatin, A Soviet Heretic: Essays, trans. Mirra Ginsburg (Chicago UP, 1970)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'zamyatin')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'zamyatin', 'letter-to-stalin-1931', 1,
    $h$1931년 6월, 스탈린에게 보낸 편지$h$,
    $h$June 1931, A Letter to Stalin$h$,
    $b$1920–1921년에 쓴 소설 『우리들』은 국내에서 출판을 거부당했고, 1924년 뉴욕에서 영역본으로 먼저 세상에 나왔다. 1927년 프라하의 망명 잡지에 러시아어 축약본이 실리자 1929년 문단에서 자먀틴 규탄 운동이 벌어졌다. 그의 희곡은 무대에서, 책은 서가에서 사라졌고, 그는 작가 단체에서 스스로 탈퇴했다.

1931년 6월 자먀틴은 스탈린에게 직접 편지를 썼다. 작가에게 침묵은 사형 선고와 같으니, 쓸 수 없다면 떠나게 해 달라는 요청이었다. 고리키가 힘을 보탰고, 스탈린은 이례적으로 출국을 허가했다. 자먀틴은 1931년 11월 소련 여권을 지닌 채 파리로 떠났고, 1935년 파리 문화옹호 국제작가대회에는 소련 대표단의 일원으로 참석했다. 그는 끝까지 망명자가 아니라 일시 체류자로 남고자 했으며, 1937년 3월 파리에서 사망했다. 『우리들』은 1988년 소련에서 정식으로 출간되었다.$b$,
    $b$His novel We, written in 1920–1921, was refused publication at home and appeared first in English translation in New York in 1924. When an abridged Russian text appeared in a Prague emigre journal in 1927, a campaign of denunciation erupted against Zamyatin in 1929. His plays were pulled from the stage and his books from the shelves, and he resigned from the writers' organization himself.

In June 1931 Zamyatin wrote directly to Stalin. For a writer, he argued, silence was a death sentence: if he could not write, let him leave. Gorky added his weight, and Stalin, exceptionally, granted permission. Zamyatin left in November 1931 carrying a Soviet passport, and in 1935 he sat with the Soviet delegation at the International Congress of Writers for the Defense of Culture in Paris. To the end he insisted he was not an emigre but a temporary resident abroad; he died in Paris in March 1937. We was finally published in the Soviet Union in 1988.$b$,
    $s$["Yevgeny Zamyatin, letter to Stalin, June 1931, in A Soviet Heretic (Chicago UP, 1970)","J. A. E. Curtis, The Englishman from Lebedian (Academic Studies Press, 2013)","Yevgeny Zamyatin, We (1924)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'zamyatin')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Vladimir Mayakovsky
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'mayakovsky', 'rosta-windows', 0,
    $h$로스타의 창, 포스터가 된 시$h$,
    $h$The ROSTA Windows, Poetry Turned Poster$h$,
    $b$블라디미르 마야콥스키는 열네 살에 볼셰비키당에 들어가 세 차례 체포되었고, 부티르카 감옥 103호 독방에서 처음 시를 썼다. 미래주의의 반항아였던 그는 1917년을 「나의 혁명」으로 받아들였고, 「좌익 행진곡」(1918)과 메이예르홀트가 연출한 『미스테리야 부프』로 혁명의 첫 시인이 되었다.

1919년 가을부터 1922년까지 그는 러시아전신국(로스타)의 「풍자의 창」 작업에 뛰어들었다. 전선 소식과 방역 캠페인, 문맹 퇴치 구호를 만화와 짧은 시로 옮긴 이 포스터들은 신문이 닿지 않는 거리의 상점 유리창마다 붙었고, 마야콥스키는 밤샘 작업으로 그림과 시구 수천 점을 직접 만들었다. 예술을 거리로, 시를 생산으로 가져간다는 좌익예술전선(레프)의 강령은 이 시기의 경험에서 자라났다.$b$,
    $b$Vladimir Mayakovsky joined the Bolshevik party at fourteen, was arrested three times, and began writing poems in cell 103 of Butyrka prison. The enfant terrible of Futurism embraced 1917 as "my revolution", and with "Left March" (1918) and Mystery-Bouffe, staged by Meyerhold, he became the revolution's first poet.

From the autumn of 1919 until 1922 he threw himself into the "satire windows" of the Russian Telegraph Agency (ROSTA). These posters, translating news from the fronts, epidemic warnings and literacy slogans into cartoons and short verses, went up in shop windows wherever newspapers could not reach, and Mayakovsky drew and captioned thousands of them himself through overnight shifts. The program of the Left Front of the Arts (LEF), art into the streets and poetry into production, grew out of this experience.$b$,
    $s$["Bengt Jangfeldt, Mayakovsky: A Biography (Chicago UP, 2014)","Stephen White, The Bolshevik Poster (Yale UP, 1988)","Edward J. Brown, Mayakovsky: A Poet in the Revolution (Princeton UP, 1973)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'mayakovsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'mayakovsky', 'april-1930-canon', 1,
    $h$1930년 4월 14일, 그리고 사후의 정전$h$,
    $h$14 April 1930, and the Posthumous Canon$h$,
    $b$1930년의 마야콥스키는 지쳐 있었다. 풍자 희곡 『목욕탕』은 혹평받았고, 창작 20주년 전시회에 문단 동료와 지도부는 오지 않았으며, 개인적 삶도 헝클어져 있었다. 4월 14일 아침 그는 루뱐스키 통로의 작업실에서 권총으로 삶을 끝냈다. 유서에는 「사랑의 조각배가 일상에 부딪혀 부서졌다」는 구절과 함께 가족을 돌봐 달라는 부탁이 적혀 있었다. 15만 명이 장례 행렬을 따랐다.

1935년 릴리 브릭이 시인의 유산이 방치되고 있다는 편지를 스탈린에게 보내자, 스탈린은 「마야콥스키는 우리 소비에트 시대의 가장 뛰어나고 가장 재능 있는 시인이었고 지금도 그러하다. 그의 기억과 작품에 대한 무관심은 범죄다」라고 답했다. 이 결정으로 마야콥스키는 소비에트 문학 정전의 한복판에 놓였다. 광장과 지하철역이 그의 이름을 얻었고, 그의 계단식 시행은 이후 수십 년간 소련 시의 표준 문법이 되었다.$b$,
    $b$The Mayakovsky of 1930 was exhausted. His satirical play The Bathhouse had been savaged, fellow writers and officials stayed away from the exhibition marking his twenty years of work, and his personal life was in knots. On the morning of 14 April he ended his life with a revolver in his workroom on Lubyansky Passage. The note spoke of "the love boat crashed against the everyday" and asked that his family be cared for. A hundred and fifty thousand people followed the funeral procession.

In 1935 Lilya Brik wrote to Stalin that the poet's legacy was being neglected. Stalin's reply became a formula: "Mayakovsky was and remains the best and most talented poet of our Soviet epoch. Indifference to his memory and his works is a crime." The resolution placed Mayakovsky at the center of the Soviet literary canon: squares and metro stations took his name, and his stepped verse line became the standard grammar of Soviet poetry for decades.$b$,
    $s$["Bengt Jangfeldt, Mayakovsky: A Biography (Chicago UP, 2014)","Stalin's resolution on Mayakovsky, Pravda, 5 December 1935","Roman Jakobson, 'On a Generation That Squandered Its Poets' (1931)","Edward J. Brown, Mayakovsky: A Poet in the Revolution (Princeton UP, 1973)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'mayakovsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Varvara Yakovleva
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'varvara-yakovleva', 'petrograd-cheka-1918', 0,
    $h$1918년 가을, 페트로그라드 체카를 맡은 여성$h$,
    $h$Autumn 1918, The Woman Who Headed the Petrograd Cheka$h$,
    $b$바르바라 야코블레바는 모스크바 상인 가문에서 태어나 수학을 공부한 직업 혁명가였다. 1917년 당 모스크바주국의 서기로서, 페트로그라드보다 훨씬 길고 격렬했던 모스크바의 10월 시가전을 조직하는 데 참여했다. 1918년 초에는 부하린과 함께 브레스트-리톱스크 강화에 반대한 좌익 공산주의자 그룹의 핵심이었고, 그가 속한 모스크바주국은 이 반대파의 거점이었다.

1918년 11월 그는 페트로그라드 체카의 의장이 되었다. 우리츠키 암살과 적색 테러 직후의 이 도시에서, 혁명 국가의 보안 기관을 이끈 최초이자 유일한 여성이었다. 재임은 1919년 1월까지로 짧았으나, 혁명의 가장 가혹한 기구조차 여성에게 열려 있었다는 사실 자체가 구체제에서는 상상할 수 없는 일이었다.$b$,
    $b$Varvara Yakovleva, born into a Moscow merchant family and trained in mathematics, was a professional revolutionary of the Moscow underground. In 1917, as secretary of the party's Moscow Regional Bureau, she helped organize the October street fighting in Moscow, which was far longer and bloodier than in Petrograd. In early 1918 she belonged to the core of the Left Communists who opposed the Brest-Litovsk peace alongside Bukharin, and her Moscow Regional Bureau was that opposition's stronghold.

In November 1918 she became chair of the Petrograd Cheka: in a city still reeling from Uritsky's assassination and the Red Terror, she was the first and only woman to head a major organ of the revolutionary state's security police. Her tenure was short, ending in January 1919, but the fact that even the revolution's harshest institution was open to a woman was unthinkable under the old regime.$b$,
    $s$["Barbara Evans Clements, Bolshevik Women (Cambridge UP, 1997)","George Leggett, The Cheka: Lenin's Political Police (Oxford UP, 1981)","Alexander Rabinowitch, The Bolsheviks in Power (Indiana UP, 2007)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'varvara-yakovleva')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'varvara-yakovleva', 'finance-commissar-oryol', 1,
    $h$재정인민위원, 그리고 오룔의 숲$h$,
    $h$Finance Commissar, and the Forest at Oryol$h$,
    $b$1920년대 야코블레바는 교육인민위원부 간부회에서 일했고, 1923년에는 46인 선언에 서명해 당내 민주주의의 확대를 요구했다. 1929년부터 1937년까지는 러시아공화국 재정인민위원으로서 제1차, 제2차 5개년 계획기의 공화국 재정을 운영했다. 옛 반대파 경력에도 불구하고 그는 소비에트 국가 건설의 실무를 놓지 않았다.

1937년 9월 체포된 그는 1938년 부하린 재판에 검찰 측 증인으로 세워져 1918년 좌익 공산주의자들의 「음모」에 관해 증언해야 했고, 이후 20년형을 선고받았다. 1941년 9월 11일, 독일군이 접근하던 오룔 감옥에서 라콥스키, 스피리도노바 등 150여 명의 수감자와 함께 메드베데프 숲으로 끌려가 총살되었다. 1958년 명예 회복되었다. 그의 생애는 혁명이 여성에게 연 가능성과 대숙청이 앗아 간 것을 동시에 증언한다.$b$,
    $b$In the 1920s Yakovleva served on the collegium of the Commissariat of Enlightenment, and in 1923 she signed the Declaration of 46 calling for wider party democracy. From 1929 to 1937 she was People's Commissar of Finance of the RSFSR, running the republic's finances through the first two Five-Year Plans. Despite her oppositional past she never let go of the practical work of building the Soviet state.

Arrested in September 1937, she was produced as a prosecution witness at the Bukharin trial of 1938 to testify about the alleged Left Communist "plot" of 1918, and was then sentenced to twenty years. On 11 September 1941, as the Wehrmacht approached Oryol, she was taken from the prison with Rakovsky, Spiridonova and some 150 other inmates and shot in the Medvedev Forest. She was rehabilitated in 1958. Her life testifies at once to the possibilities the revolution opened to women and to what the Terror took away.$b$,
    $s$["Barbara Evans Clements, Bolshevik Women (Cambridge UP, 1997)","Report of Court Proceedings in the Case of the Anti-Soviet Bloc of Rights and Trotskyites (Moscow, 1938)","J. Arch Getty & Oleg V. Naumov, The Road to Terror (Yale UP, 1999)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'varvara-yakovleva')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Nikolai Podvoisky
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'podvoisky', 'mrc-winter-palace-1917', 0,
    $h$1917년 11월 7일, 군사혁명위원회의 작전 지휘자$h$,
    $h$7 November 1917, Directing the MRC Operation$h$,
    $b$니콜라이 포드보이스키는 체르니고프 지방의 사제 아들로 신학교에서 혁명으로 걸어 나온 조직가였다. 1917년 그는 볼셰비키 군사조직(보옌카)을 이끌며 수비대 병사들을 당의 편으로 끌어들였고, 페트로그라드 소비에트 군사혁명위원회의 의장이 되었다.

봉기의 날인 1917년 11월 7일(구력 10월 25일), 포드보이스키는 안토노프-옵세옌코, 추드놉스키와 함께 겨울궁전 작전을 지휘하는 3인 지휘부를 이루었다. 다리와 전신국, 역 들을 차례로 접수하는 계획은 거의 유혈 없이 집행되었고, 이튿날 새벽 궁전이 함락되었다. 그는 훗날 이 날들을 상세한 회고록으로 남겼고, 예이젠시테인의 영화 『10월』(1927)에는 자기 자신의 역으로 출연했다.$b$,
    $b$Nikolai Podvoisky, a priest's son from Chernigov province who walked out of the seminary into revolution, was above all an organizer. In 1917 he led the Bolshevik Military Organization, winning the garrison's soldiers over to the party, and became chairman of the Military Revolutionary Committee of the Petrograd Soviet.

On 7 November 1917 (25 October Old Style), the day of the insurrection, Podvoisky formed with Antonov-Ovseenko and Chudnovsky the operational troika that directed the Winter Palace operation. The plan, taking the bridges, the telegraph and the stations one after another, was carried out almost without bloodshed, and the palace fell before dawn the next day. He later left a detailed memoir of those days, and in Eisenstein's film October (1927) he appeared as himself.$b$,
    $s$["Alexander Rabinowitch, The Bolsheviks Come to Power (Norton, 1976)","John Reed, Ten Days That Shook the World (1919, marxists.org)","N. I. Podvoisky, God 1917 (Moscow, 1958)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'podvoisky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'podvoisky', 'vsevobuch-spartakiad', 1,
    $h$전 인민을 단련하라, 브세보부치에서 스파르타키아다까지$h$,
    $h$Train the Whole People, from Vsevobuch to the Spartakiad$h$,
    $b$10월 이후 포드보이스키는 1917년 11월부터 1918년 3월까지 군사인민위원으로서 낡은 군대의 해체와 적군 창설의 첫걸음을 이끌었다. 1918년 봄부터는 보편군사훈련국(브세보부치)의 책임자로서 노동자와 청년 수백만 명에게 기초 군사훈련과 체력 단련을 조직했고, 이 사업은 내전 승리의 보이지 않는 기반이 되었다.

내전이 끝나자 그는 군사훈련의 유산을 대중 체육 운동으로 전환하는 데 남은 생애를 바쳤다. 적색스포츠인터내셔널의 의장으로서 노동자 스포츠의 국제 조직을 이끌었고, 1928년 모스크바에서 열린 제1차 전연방 스파르타키아다를 조직했다. 부르주아 올림픽에 맞선 이 노동자 체전에는 소련 전역과 해외에서 온 노동자 선수 수천 명이 참가했다. 그는 대숙청에서 살아남아 1948년 모스크바 근교에서 병사했다.$b$,
    $b$After October, Podvoisky served as People's Commissar for Military Affairs from November 1917 to March 1918, presiding over the demobilization of the old army and the first steps of the Red Army. From the spring of 1918 he headed Vsevobuch, the administration of universal military training, which gave millions of workers and young people basic military and physical training and became an invisible foundation of victory in the Civil War.

When the war ended he devoted the rest of his life to turning that legacy into a mass physical culture movement. As chairman of the Red Sport International he led the international organization of workers' sport, and in 1928 he organized the first All-Union Spartakiad in Moscow, a workers' games set against the bourgeois Olympics, with thousands of worker athletes from across the USSR and abroad. He survived the purges and died near Moscow in 1948.$b$,
    $s$["James Riordan, Sport in Soviet Society (Cambridge UP, 1977)","Susan Grant, Physical Culture and Sport in Soviet Society (Routledge, 2012)","Alexander Rabinowitch, The Bolsheviks Come to Power (Norton, 1976)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'podvoisky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Mikhail Tomsky
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'tomsky', 'union-chief', 0,
    $h$인쇄공 출신의 정치국원, 노동조합의 수장$h$,
    $h$The Printer in the Politburo, Chief of the Trade Unions$h$,
    $b$미하일 톰스키는 당 최고 지도부의 유일한 진짜 노동자였다. 페테르부르크 근교 콜피노에서 태어나 석판 인쇄공으로 일했고, 1905년 레벨(탈린)에서 소비에트를 이끌다 체포와 유형을 거듭했다. 감옥이 그의 학교였고 파업이 그의 대학이었다.

1918년부터 그는 전러시아노동조합중앙평의회의 수장으로서 소비에트 노동조합 운동을 이끌었고 1922년 정치국원이 되었다. 1920–1921년 노동조합 논쟁에서 그는 조합의 군사화를 주장한 트로츠키에 맞서 조합의 자율성과 노동자 보호 기능을 옹호했고, 레닌의 강령과 함께 승리했다. 수백만 조합원의 조직을 대표한 그는 당과 공장을 잇는 살아 있는 연결 고리였다.$b$,
    $b$Mikhail Tomsky was the one genuine worker in the party's top leadership. Born in Kolpino outside St Petersburg, he worked as a lithographer, led the soviet in Revel (Tallinn) in 1905, and passed through the familiar cycle of arrests and exile. Prison was his school and the strike his university.

From 1918 he headed the All-Russian Central Council of Trade Unions, and in 1922 he entered the Politburo. In the trade union controversy of 1920–1921 he stood against Trotsky's program of militarizing the unions, defending their autonomy and their function of protecting workers, and won alongside Lenin's platform. Representing an organization of millions, he was the living link between the party and the factory floor.$b$,
    $s$["Charters Wynn, The Moderate Bolshevik: Mikhail Tomsky from the Factory to the Kremlin, 1880–1936 (Brill, 2023)","Isaac Deutscher, Soviet Trade Unions (RIIA, 1950)","E. H. Carr, Socialism in One Country, 1924–1926 (Macmillan, 1958)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'tomsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'tomsky', 'bolshevo-1936', 1,
    $h$1936년 8월 22일, 볼셰보의 다차$h$,
    $h$22 August 1936, the Dacha at Bolshevo$h$,
    $b$1928년 곡물 조달 위기 앞에서 톰스키는 부하린, 리코프와 함께 농민에 대한 비상 조치와 무리한 공업화 속도에 반대했다. 이른바 우익 편향으로 낙인찍힌 그는 1929년 노동조합 지도부에서 해임되었고, 자기비판 뒤 국영출판연합(오기스)의 책임자로 밀려났다. 노동자 출신 지도자가 대변해 온 점진주의 노선은 그렇게 패배했다.

1936년 8월 지노비예프-카메네프 재판의 법정에서 그의 이름이 「음모」 연루자로 불렸다. 8월 22일, 수사 개시 보도가 신문에 실린 날 톰스키는 볼셰보의 다차에서 스탈린에게 보내는 편지를 남기고 권총으로 목숨을 끊었다. 재판도 자백도 거부한 이 죽음은 옛 노동자 지도자에게 남아 있던 마지막 자기 결정이었다. 그의 아들들도 탄압을 피하지 못했고, 그의 이름은 1988년에야 완전히 회복되었다.$b$,
    $b$Facing the grain crisis of 1928, Tomsky joined Bukharin and Rykov in opposing emergency measures against the peasantry and the breakneck tempo of industrialization. Branded the "Right deviation", he was removed from the trade union leadership in 1929 and, after recanting, shunted off to run the state publishing association (OGIZ). The gradualist line the worker-leader had voiced was defeated.

In August 1936 his name was called out at the Zinoviev-Kamenev trial as an alleged conspirator. On 22 August, the day the press announced that an investigation had been opened against him, Tomsky shot himself at his dacha in Bolshevo, leaving a letter addressed to Stalin. Refusing both trial and confession, this death was the last act of self-determination left to the old workers' leader. His sons did not escape repression, and his name was fully cleared only in 1988.$b$,
    $s$["Charters Wynn, The Moderate Bolshevik (Brill, 2023)","Oleg V. Khlevniuk, Master of the House: Stalin and His Inner Circle (Yale UP, 2009)","J. Arch Getty & Oleg V. Naumov, The Road to Terror (Yale UP, 1999)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'tomsky')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Alexander Shlyapnikov
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'shlyapnikov', 'february-1917-russian-bureau', 0,
    $h$1917년 2월, 수도의 당을 이끈 금속노동자$h$,
    $h$February 1917, the Metalworker Who Led the Party in the Capital$h$,
    $b$알렉산드르 실랴프니코프는 무롬의 가난한 구교도 집안에서 태어나 소년 시절부터 금속 선반공으로 일했다. 숙련공으로서 프랑스, 독일, 영국의 공장을 떠돌며 유럽 노동운동을 안에서부터 익힌 그는, 전쟁 중에는 스칸디나비아를 오가는 당의 비밀 연락망을 운영했다.

1917년 3월(구력 2월) 2월 혁명이 터졌을 때 페트로그라드에 있던 최고위 볼셰비키가 바로 그였다. 몰로토프, 잘루츠키와 함께 당 중앙위원회 러시아국을 이끌며 봉기의 나날에 당의 방향을 잡았고, 페트로그라드 소비에트 집행위원회에 볼셰비키 대표로 들어갔다. 10월 이후 첫 노동인민위원이 된 그는 8시간 노동제 법령과 사회보험 제도의 기초를 놓았다. 공장의 선반에서 인민위원회의까지, 그의 이력 자체가 노동자 혁명의 축도였다.$b$,
    $b$Alexander Shlyapnikov was born into a poor Old Believer family in Murom and went to work as a metal turner while still a boy. A skilled craftsman, he learned the European labor movement from inside its factories in France, Germany and England, and during the war he ran the party's clandestine courier network through Scandinavia.

When the February Revolution broke out in March 1917 (February Old Style), he was the most senior Bolshevik in Petrograd. With Molotov and Zalutsky he led the Russian Bureau of the Central Committee through the days of the rising and sat as a Bolshevik representative on the executive committee of the Petrograd Soviet. After October he became the first People's Commissar of Labor, laying the foundations of the eight-hour-day decree and the social insurance system. From the lathe to the Council of People's Commissars, his biography was the workers' revolution in miniature.$b$,
    $s$["Barbara C. Allen, Alexander Shlyapnikov, 1885–1937: Life of an Old Bolshevik (Brill, 2015)","Alexander Shlyapnikov, On the Eve of 1917 (Allison & Busby, 1982)","Tsuyoshi Hasegawa, The February Revolution: Petrograd, 1917 (University of Washington Press, 1981)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'shlyapnikov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'shlyapnikov', 'workers-opposition', 1,
    $h$노동자 반대파, 자백을 거부한 최후$h$,
    $h$The Workers' Opposition, a Refusal to Confess$h$,
    $b$내전 말기 실랴프니코프는 콜론타이, 메드베데프와 함께 노동자 반대파를 이끌었다. 생산 관리를 노동조합과 「생산자 대회」에 맡기라는 이들의 강령은 당과 국가의 관료화에 맞서 혁명의 노동자적 기원을 지키려는 시도였다. 1921년 제10차 당대회는 이 강령을 부결하고 분파 금지를 결의했으나, 실랴프니코프는 당에 남아 금속노동자들의 목소리를 계속 대변했다.

그의 회고록 『1917년 전야』와 『1917년』은 2월 혁명의 일급 사료였으나, 1917년 당시 스탈린의 행적을 있는 그대로 적었다는 이유로 공격받았다. 1933년 출당과 1935년 체포로 이어진 탄압 속에서 그는 끝까지 테러 혐의의 자백을 거부했고, 1937년 9월 2일 총살되었다. 바버라 앨런의 전기가 복원했듯, 그는 심문자들 앞에서도 노동자 반대파의 강령이 옳았다고 진술한 드문 옛 볼셰비키였다. 1963년 사법적으로 명예 회복되었다.$b$,
    $b$At the end of the Civil War Shlyapnikov led the Workers' Opposition together with Kollontai and Medvedev. Their platform, which demanded that the management of production pass to the trade unions and a "congress of producers", was an attempt to defend the revolution's working-class origins against the bureaucratization of party and state. The Tenth Congress rejected the platform in 1921 and banned factions, but Shlyapnikov stayed in the party and went on speaking for the metalworkers.

His memoirs, On the Eve of 1917 and The Year 1917, were first-rate sources on the February Revolution, and they were attacked precisely because they recorded Stalin's actual conduct in 1917. Expelled in 1933 and arrested in 1935, he refused to the end to confess to terrorism and was shot on 2 September 1937. As Barbara Allen's biography has reconstructed, he was one of the rare Old Bolsheviks who told his interrogators that the program of the Workers' Opposition had been right. He was judicially rehabilitated in 1963.$b$,
    $s$["Barbara C. Allen, Alexander Shlyapnikov, 1885–1937 (Brill, 2015)","Alexandra Kollontai, The Workers' Opposition (1921, marxists.org)","Robert V. Daniels, The Conscience of the Revolution (Harvard UP, 1960)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'shlyapnikov')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Inessa Armand
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'armand', 'longjumeau-1911', 0,
    $h$1911년, 롱쥐모 당 학교의 교사$h$,
    $h$1911, Teaching at the Longjumeau Party School$h$,
    $b$이네사 아르만트는 파리에서 태어나 모스크바의 부유한 아르만트 집안에서 자랐고, 그 집안의 아들과 결혼해 다섯 아이를 두었다. 자선 사업의 한계를 깨달은 그는 1904년 사회민주노동당에 입당해 직업 혁명가가 되었고, 체포와 북부 메젠 유형, 탈출을 차례로 겪었다.

1911년 여름 파리 근교 롱쥐모에서 볼셰비키 최초의 당 학교가 열렸을 때, 아르만트는 학교의 살림을 꾸리는 동시에 정치경제학을 강의한 핵심 교사였다. 러시아의 공장에서 온 노동자 학생들은 낮에는 강의를 듣고 밤에는 토론했다. 다섯 개 언어를 구사한 그는 레닌이 가장 신뢰하는 특사가 되어 1914년 브뤼셀 통합 회의에 볼셰비키 대표로 파견되었고, 전쟁이 터지자 1915년 베른 국제사회주의여성회의에 볼셰비키 대표단을 이끌고 참가해 반전 좌파의 결집에 나섰다.$b$,
    $b$Inessa Armand was born in Paris, raised in Moscow within the wealthy Armand household, married one of its sons and had five children. Having found the limits of charitable work, she joined the Social Democratic party in 1904 and became a professional revolutionary, passing through arrest, exile to Mezen in the far north, and escape.

When the Bolsheviks' first party school opened at Longjumeau outside Paris in the summer of 1911, Armand ran the school's household and was one of its core teachers, lecturing on political economy; worker-students from Russia's factories heard lectures by day and debated by night. Fluent in five languages, she became one of Lenin's most trusted emissaries, representing the Bolsheviks at the Brussels "unity" conference of 1914, and when the war came she led the Bolshevik delegation to the International Socialist Women's Conference in Bern in 1915, helping to gather the antiwar left.$b$,
    $s$["R. C. Elwood, Inessa Armand: Revolutionary and Feminist (Cambridge UP, 1992)","N. K. Krupskaya, Reminiscences of Lenin (1933, marxists.org)","Richard Stites, The Women's Liberation Movement in Russia (Princeton UP, 1978)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'armand')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'armand', 'zhenotdel-1920', 1,
    $h$제노트델의 초대 책임자, 1920년 9월$h$,
    $h$First Head of the Zhenotdel, September 1920$h$,
    $b$1917년 4월 아르만트는 레닌, 크룹스카야와 같은 봉인 열차로 귀국해 모스크바에서 혁명을 맞았다. 1918년 11월 콜론타이, 스베르들로프와 함께 제1차 전러시아 여성노동자대회를 조직했고, 1919년 9월 당 중앙위원회에 여성부(제노트델)가 창설되자 초대 책임자가 되었다. 대의원 회의 제도를 통해 평범한 여성 노동자와 농민 들을 소비에트 행정으로 끌어들이고, 탁아소와 공동 식당, 문맹 퇴치 강습을 조직하는 것이 제노트델의 일상 사업이었다. 그는 잡지 『코무니스트카』를 편집했고 1920년 여름 제1차 국제공산주의여성회의를 주재했다.

과로로 쇠약해진 그에게 레닌은 캅카스에서 요양할 것을 권했다. 그러나 내전의 혼란 속에 요양지를 전전하던 아르만트는 날치크에서 콜레라에 감염되어 1920년 9월 24일 마흔여섯의 나이로 숨졌다. 유해는 모스크바로 옮겨져 크렘린 벽 아래 안장되었고, 장례식에서 레닌이 보인 비통함은 여러 목격자의 기록에 남아 있다. 그가 세운 제노트델은 이후 10년간 소비에트 여성 해방 정책의 엔진이 되었다.$b$,
    $b$In April 1917 Armand returned to Russia on the same sealed train as Lenin and Krupskaya and lived the revolution in Moscow. In November 1918 she organized the First All-Russian Congress of Women Workers with Kollontai and Sverdlov, and when the Central Committee created its women's department, the Zhenotdel, in September 1919, she became its first director. Drawing ordinary working women and peasants into soviet administration through the delegate-meeting system, and organizing nurseries, communal dining rooms and literacy courses: this was the Zhenotdel's daily work. She edited the journal Kommunistka and presided over the First International Conference of Communist Women in the summer of 1920.

Worn down by overwork, she was urged by Lenin to rest in the Caucasus. Shuttled between resorts in the chaos of the Civil War, she contracted cholera at Nalchik and died on 24 September 1920, aged forty-six. Her body was brought back to Moscow and buried by the Kremlin wall, and witnesses recorded Lenin's open grief at the funeral. The Zhenotdel she built drove Soviet policy on women's emancipation for the next decade.$b$,
    $s$["R. C. Elwood, Inessa Armand: Revolutionary and Feminist (Cambridge UP, 1992)","Barbara Evans Clements, Bolshevik Women (Cambridge UP, 1997)","Wendy Z. Goldman, Women, the State and Revolution (Cambridge UP, 1993)","Richard Stites, The Women's Liberation Movement in Russia (Princeton UP, 1978)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'armand')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

-- ============================================================
-- Vladimir Antonov-Ovseenko
-- ============================================================

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'antonov-ovseenko', 'winter-palace-arrest', 0,
    $h$1917년 11월 8일 새벽, 임시정부를 체포하다$h$,
    $h$Dawn, 8 November 1917, Arresting the Provisional Government$h$,
    $b$블라디미르 안토노프-옵세옌코는 차르 군 장교의 아들로 태어나 사관학교를 나왔으나, 자신을 위해 준비된 장교의 길 대신 혁명을 택했다. 1905–1906년 군대 반란을 조직하다 사형을 선고받고 탈출한 그는 오랜 망명 끝에 1917년 귀국해 볼셰비키에 합류했고, 페트로그라드 군사혁명위원회의 서기가 되었다.

1917년 11월 7일 밤(구력 10월 25일) 그는 포드보이스키와 함께 겨울궁전에 대한 최종 작전을 지휘했고, 이튿날 새벽 2시가 지나 궁전 안 소회의실로 들어서서 「군사혁명위원회의 이름으로 임시정부 각료 전원을 체포한다」고 선언했다. 그는 격앙한 병사들로부터 각료들을 보호하며 페트로파블롭스크 요새로 호송했다. 존 리드의 『세계를 뒤흔든 열흘』이 기록한 이 장면과 함께 그의 이름은 10월의 역사에 새겨졌다.$b$,
    $b$Vladimir Antonov-Ovseenko, the son of a tsarist officer and a military school graduate himself, chose revolution over the officer's career prepared for him. He organized military mutinies in 1905–1906, was sentenced to death and escaped, and after long years of exile returned in 1917, joined the Bolsheviks and became secretary of the Petrograd Military Revolutionary Committee.

On the night of 7 November 1917 (25 October Old Style) he directed the final operation against the Winter Palace together with Podvoisky, and shortly after two in the morning he entered the small dining room of the palace and declared: "In the name of the Military Revolutionary Committee, I declare the members of the Provisional Government under arrest." He then protected the ministers from enraged soldiers and escorted them to the Peter and Paul Fortress. With that scene, recorded in John Reed's Ten Days That Shook the World, his name was written into the history of October.$b$,
    $s$["Alexander Rabinowitch, The Bolsheviks Come to Power (Norton, 1976)","John Reed, Ten Days That Shook the World (1919, marxists.org)","V. A. Antonov-Ovseenko, Zapiski o grazhdanskoi voine, 4 vols. (Moscow, 1924–1933)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'antonov-ovseenko')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_person_sections
    (person_id, slug, sort_order, heading_ko, heading_en, body_ko, body_en, sources, updated_at)
SELECT 'antonov-ovseenko', 'barcelona-consul', 1,
    $h$바르셀로나의 소련 총영사, 1936–1937$h$,
    $h$Soviet Consul General in Barcelona, 1936–1937$h$,
    $b$내전기에 안토노프-옵세옌코는 남부 전선과 우크라이나에서 소비에트 군대를 지휘했고, 1921년에는 탐보프 농민 봉기 진압을 총괄하는 전권위원회를 이끌었다. 이는 내전기 혁명 권력이 마주한 가장 어두운 과제에 속했다. 1920년대에 그는 적군 정치국의 수장을 지내다 1923년 트로츠키의 좌익 반대파를 지지해 해임되었고, 이후 체코슬로바키아, 리투아니아, 폴란드 주재 외교관으로 일했다.

1936년 8월 스페인 내전이 격화되자 그는 바르셀로나 주재 소련 총영사로 부임했다. 카탈루냐 정부와 소련의 군사 원조를 조율하고 전선으로 가는 물자를 챙기던 그는 카탈루냐에서 가장 눈에 띄는 소련인이었다. 1937년 소환된 그는 러시아공화국 사법인민위원에 임명되었으나 몇 주 뒤인 10월 체포되었고, 1938년 2월 10일 총살되었다. 아들 안톤의 증언에 따르면 그는 「안토노프-옵세옌코는 볼셰비키였고 마지막 날까지 볼셰비키로 남았다고 전해 달라」는 말을 남겼다. 1956년 명예 회복되었다.$b$,
    $b$In the Civil War Antonov-Ovseenko commanded Soviet forces on the southern front and in Ukraine, and in 1921 he chaired the plenipotentiary commission that directed the suppression of the Tambov peasant rising, one of the darkest tasks revolutionary power faced in those years. In the 1920s he headed the Red Army's Political Administration until his support for Trotsky's Left Opposition cost him the post in 1923; he then served as a Soviet diplomat in Czechoslovakia, Lithuania and Poland.

In August 1936, as the Spanish Civil War intensified, he arrived in Barcelona as Soviet consul general. Coordinating Soviet military aid with the Catalan government and chasing supplies to the front, he was the most visible Soviet figure in Catalonia. Recalled in 1937, he was named People's Commissar of Justice of the RSFSR, only to be arrested weeks later in October; he was shot on 10 February 1938. According to his son Anton, his last request was: "Tell them that Antonov-Ovseenko was a Bolshevik and remained a Bolshevik to his last day." He was rehabilitated in 1956.$b$,
    $s$["Daniel Kowalsky, Stalin and the Spanish Civil War (Columbia UP, 2004)","Erik C. Landis, Bandits and Partisans: The Antonov Movement in the Russian Civil War (University of Pittsburgh Press, 2008)","Anton Antonov-Ovseenko, The Time of Stalin: Portrait of a Tyranny (Harper & Row, 1981)","J. Arch Getty & Oleg V. Naumov, The Road to Terror (Yale UP, 1999)"]$s$::jsonb,
    NOW()
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = 'antonov-ovseenko')
ON CONFLICT (person_id, slug) DO UPDATE SET
    sort_order = EXCLUDED.sort_order,
    heading_ko = EXCLUDED.heading_ko, heading_en = EXCLUDED.heading_en,
    body_ko = EXCLUDED.body_ko, body_en = EXCLUDED.body_en,
    sources = EXCLUDED.sources, updated_at = NOW();
