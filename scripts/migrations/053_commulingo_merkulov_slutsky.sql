-- 053_commulingo_merkulov_slutsky.sql
-- Two person-level changes:
--   1. Merkulov: his entry was two sentences with an empty moment and five vague
--      career rows ("1920s-1938"). He was the NKVD's number two, named FIRST in
--      the Politburo decision of 5 March 1940 that ordered Katyn, and the most
--      educated man in Beria's circle. Rewritten at length, with a moment.
--   2. Slutsky: added. Chief of NKVD foreign intelligence 1935-38, the last of
--      Yagoda's GUGB department heads still in post, killed in Frinovsky's office.
--
-- APPLY THIS BEFORE 054. 054's event links are guarded by WHERE EXISTS on
-- commulingo_people, so running it first would silently drop the slutsky rows.
--
-- Sourcing: Petrov & Skorkin "Kto rukovodil NKVD 1934-1941"; Petrov "Kto
-- rukovodil organami gosbezopasnosti 1941-1954"; Jansen & Petrov "Stalin's
-- Loyal Executioner" (2002); RGASPI texts via istmat; "Politbyuro i delo Beriya"
-- (2012).
--
-- Precision notes, against the popular versions:
--   * Merkulov was NOT in the NKVD during the Georgian terror of 1937-38. He was
--     a party official (Special Sector, then Industrial-Transport Department of
--     the Georgian CC) under Beria. The common framing of him running Chekist
--     terror in Georgia then conflates his 1921-31 Cheka service with his
--     1931-38 party service. He is therefore NOT linked to great-terror in 054.
--   * No Leningrad Affair role exists; that is a confusion with Abakumov, his
--     successor and enemy, who ran it from 1949 after Merkulov was already out.
--   * The Katyn troika adjudicated nothing: no defendants, no charges, no
--     indictment. It processed lists. Equally he was not a rubber stamp; he was
--     the NKVD's number two and is named first in the decision.
--   * Merkulov did not graduate from Petrograd University; he left in 1916 on
--     mobilisation. "University-educated" is fair, "graduate" is not.
-- Excluded as memoir/legend: Stalin's reported rebuke about the plays ("the
-- minister of state security should catch spies, not write plays") is his son's
-- recollection and is internally shaky on dates; the "refused to beat prisoners"
-- story is memoir and contradicted by his own reported testimony, which itself
-- has weak citation. Neither is asserted.
--   * Slutsky: do NOT say cyanide. Jansen & Petrov, from the investigation
--     files, state explicitly that potassium cyanide was NOT used and that the
--     poison was chosen to mimic heart failure, against Orlov's memoir. The
--     poisoning rests entirely on coerced interrogation testimony (Frinovsky,
--     Alekhin, Yezhov) with no published forensic evidence, so the fate label
--     hedges and the moment is attributed as testimony, not narrated.
--   * Slutsky's posthumous party expulsion is April 1938 (Petrov & Skorkin), not
--     1939 as some web sources have it.

-- 1. Merkulov ---------------------------------------------------------------
UPDATE commulingo_people SET
    epithet_ko = '카틴 명령에 첫 번째로 이름을 올린 NKGB 수장, 필명으로 희곡을 쓴 사람',
    epithet_en = 'The NKGB chief named first in the Katyn order, who wrote plays under a pseudonym',
    moment_ko = $q$1953년 7월, 베리야가 체포된 뒤 그는 흐루쇼프에게 긴 편지를 썼다. 베리야가 자신이 쓰지 않은 책에 서명한 일을 두고 그는 이렇게 적었다. "마음속으로 고백하건대 나는 베리야가 조금 부끄러웠다. 어떻게 남의 저작에 자기 서명을 올릴 수 있는가. 이것은 표절도 아니고 그 이상이다." 문학적 명예에 선을 그은 그 손은, 십삼 년 전 폴란드인 이만여 명의 사형 명단에는 아무 선도 긋지 않았다.$q$,
    moment_en = $q$In July 1953, after Beria's arrest, he wrote a long letter to Khrushchev. On Beria having signed a book he had not written, he set down: "In my heart, I confess, I felt a little ashamed for Beria: how can one put one's signature under someone else's work. This is not even plagiarism, it is something more." The hand that drew a line at literary dishonour had drawn none, thirteen years earlier, at the death lists of some twenty-two thousand Poles.$q$,
    bio_ko = $q$베리야 측근 가운데 가장 교육받은 사람이자, 십 년간 그의 실무를 대신한 손이었다. 1895년 캅카스의 자카탈라에서 귀족 가문에 태어나 1913년 티플리스 김나지움을 마치고 페트로그라드 대학 물리수학부에 들어갔으나 1916년 동원으로 학위 없이 떠났고, 남서전선에서 소위로 복무했다. 1921년 10월 조지아 체카에 들어가 그곳에서 베리야를 만났다. 1931년 베리야는 그를 보안기관에서 빼내 자캅카스 당 기구로 옮겼고, 조지아 대테러의 시기 내내 그는 NKVD가 아니라 당의 특별부와 산업수송부를 운영했다. 1938년 9월 베리야가 그를 모스크바로 불렀고, 그해 12월 17일 내무 제1부인민위원 겸 국가보안총국장, 곧 NKVD의 이인자가 되었다. 1939년부터 1941년 사이의 대량작전과 발트·폴란드 추방이 그의 손을 거쳤다. 1940년 3월 5일 정치국은 폴란드인 포로와 수감자 약 21,857명의 사형을 심리도 기소도 없이 처결할 삼인 트로이카를 지정했고, 결정문에 첫 번째로 적힌 이름이 메르쿨로프였다. 트로이카는 아무것도 심리하지 않았다. 피고를 부르지도, 기소장을 만들지도 않고 명단을 처리했을 뿐이다. 1943년 독일이 무덤을 발견하자 그는 크루글로프와 함께 이를 독일 소행으로 돌릴 부르덴코 위원회의 토대를 닦는 예비조사를 지휘했다. 집행한 자가 부인까지 조직한 셈이다. 1941년 2월과 1943년 4월 두 차례 국가보안인민위원이 되어 1946년 5월까지 전시·전후 정보와 방첩을 이끌었고, 1944년 3월 카라차이인과 칼미크인, 체첸인, 잉구시인 강제이주의 공로로 쿠투조프 훈장 1급을 받았다. 소비에트 국가 자신이 1962년 이를 취소했다. 그는 체키스트 가운데 이례적이었다. 브세볼로드 로크라는 필명으로 희곡을 썼고, 전시 희곡 『엔지니어 세르게예프』는 1942년부터 소련 각지에서 상연되어 1944년 2월 말리 극장에 올랐으며 『프라우다』와 『이즈베스티야』의 상찬을 받았다가 그가 실각한 순간 레퍼토리에서 사라졌다. 1946년 5월 중앙위원회가 그의 업무를 「불만족」으로 규정하며 아바쿠모프가 자리를 가져갔다. 1950년 국가통제장관이 되었고 1953년 9월 18일 체포되어 12월 23일 베리야와 함께 총살됐다. 복권되지 않았다.$q$,
    bio_en = $q$Merkulov was the most educated man in Beria's circle and, for a decade, his indispensable executive hand. Born in 1895 at Zakatala in the Caucasus to a family of noble origin, he finished the Tiflis gymnasium in 1913 and studied physics and mathematics at Petrograd University, leaving in 1916 without a degree when he was mobilised, and served as an ensign on the Southwestern Front. He entered the Georgian Cheka in October 1921, where he met Beria. In 1931 Beria pulled him out of the security organs into the Transcaucasian party apparatus, and through the years of the Georgian terror he ran not the NKVD but the party's special sectors and industrial departments. In September 1938 Beria brought him to Moscow; by 17 December he was First Deputy People's Commissar of Internal Affairs and chief of the GUGB, the NKVD's number two. The mass operations of 1939 to 1941 and the Baltic and Polish deportations passed through his hands. On 5 March 1940 the Politburo named a three-man troika to dispose of the cases of some 21,857 Polish prisoners without hearings or charges, and the first name written in the decision was Merkulov's. The troika adjudicated nothing: it called no defendants, drew no indictments, and simply processed lists. When the Germans found the graves in 1943, he and Kruglov directed the preliminary work that laid the ground for the Burdenko Commission's attribution of the massacre to the Germans, so the man who organized the killing organized the denial. He headed the state security commissariat twice, from February 1941 and again from April 1943 until May 1946, running wartime and postwar intelligence and counter-intelligence, and in March 1944 received the Order of Kutuzov 1st Class for the deportation of the Karachais, Kalmyks, Chechens and Ingush; the Soviet state itself annulled it in 1962. He was unusual among Chekists: under the pseudonym Vsevolod Rokk he wrote plays, and his wartime drama "Engineer Sergeyev" was staged across the USSR from 1942, reached the Maly Theatre in February 1944 and was praised in Pravda and Izvestia, then vanished from the repertoire the moment he fell. In May 1946 a Central Committee resolution called his work unsatisfactory and Abakumov took his place. He became Minister of State Control in 1950, was arrested on 18 September 1953, and was shot with Beria on 23 December. He has never been rehabilitated.$q$,
    updated_at = NOW()
WHERE id = 'merkulov';

-- His five career rows were vague ranges; replace them wholesale.
DELETE FROM commulingo_person_career_entries WHERE person_id = 'merkulov';

-- 2. Slutsky ----------------------------------------------------------------
INSERT INTO commulingo_people
    (id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
     name_ko, name_en, epithet_ko, epithet_en, moment_ko, moment_en, bio_ko, bio_en,
     fate_kind, fate_label_ko, fate_label_en,
     citizenship_code, citizenship_label_ko, citizenship_label_en,
     origin_code, origin_label_ko, origin_label_en, updated_at)
SELECT 'slutsky', 'stalin-era',
       (SELECT COALESCE(MAX(sort_order), -1) + 1 FROM commulingo_people),
       'А', 'Абрам Слуцкий', '1898–1938', 1898, 1938,
       '아브람 슬루츠키', 'Abram Slutsky',
       '야고다 시대에서 마지막까지 남은 대외정보국장',
       'The last of Yagoda''s department heads, and chief of foreign intelligence',
       $q$1939년 심문에서 프리놉스키는 이렇게 진술했다. "기회를 잡아 자콥스키가 슬루츠키의 얼굴에 클로로포름 마스크를 씌웠다. 그는 이삼 분 만에 잠들었고, 옆방에서 기다리던 알료힌이 오른팔 근육에 독을 주사했다. 슬루츠키는 즉시 사망했다. 몇 분 뒤 나는 위생과 당직 의사를 불렀고, 의사는 슬루츠키의 급사를 확인했다." 예조프의 지시는 그를 체포하지 말고 "소리 없이 제거하라"는 것이었다. 대외정보국장이 체포되었다는 소식이 해외의 비합법 요원들에게 닿으면 그들이 귀국을 거부할 수 있었기 때문이다. 숙청이 제 요원들에게 보이지 않도록 설계된 살해였다.$q$,
       $q$Under interrogation in 1939, Frinovsky testified: "Seizing the moment, Zakovsky threw a mask with chloroform over Slutsky's face. He fell asleep within a couple of minutes, and then Alekhin, who had been waiting for us in the next room, injected poison into the muscle of his right arm, from which Slutsky died immediately. A few minutes later I summoned the duty doctor from the medical section, who certified Slutsky's sudden death." Yezhov's instruction, he said, had been not to arrest him but to remove him "without noise": if word reached the illegals abroad that the chief of foreign intelligence had been arrested, they might refuse to come home. It was a killing designed to keep the purge invisible to his own agents.$q$,
       $q$1898년 체르니히프 지방 파라피이우카에서 유대인 철도 차장의 아들로 태어나 투르케스탄의 안디잔에서 자랐다. 1917년 12월 볼셰비키에 가담해 안디잔 혁명재판소 의장을 거쳐 1920년 9월 타슈켄트에서 체카에 들어갔고, 여러 지구 체카 정치국을 이끈 뒤 투르케스탄 자치공화국 최고재판소 부의장을 지냈다. 법학 학위는 중앙아시아 대학에서 외부생으로 받았다. 1926년 6월 OGPU 경제국에 들어가 산업 첩보를 전문으로 다루며 1929년 부국장이 되었고, 1930년 1월 대외정보국(INO)으로 옮겨 아르투조프의 보좌로 일하다 1931년 8월 부국장이 되어 유럽 작전을 운영했으며 일부 기간은 베를린에 잠복했다. 1935년 5월 21일 아르투조프를 이어 INO 국장이 되었고, 부서는 1936년 12월 제7부로 개칭됐다. 그는 비합법 레지덴투라 체계가 정점에 있던 시기의 소비에트 대외정보를 지휘했다. 아르놀트 도이치와 테오도어 말리가 케임브리지 조직망을 구축하던 그 체계다. 동시에 그 기구를 스탈린의 해외 적들에게 돌려, 파리의 트로츠키 문서고 탈취, 1937년 9월 로잔에서의 이그나체 라이스 살해, 파리의 밀레르 장군 납치, 그리고 그의 부하 오를로프가 레지덴트로 있던 스페인의 작전들이 그의 재임 중에 이루어졌다. 1937년 중반 그는 야고다 시대의 국가보안총국 부서장 가운데 마지막까지 자리를 지킨 사람이었고, 바로 그 점이 그를 부담으로 만들었다. 1938년 2월 17일 그는 예조프의 부인민위원 프리놉스키의 집무실에서 사망했다. 『프라우다』는 그가 "전투 초소에서 죽었다"고 썼다. 명예위병이 선 공식 장례를 치르고 노보데비치 묘지에 묻혔으나, 두 달 뒤인 1938년 4월 「인민의 적」으로 당에서 제명됐다.$q$,
       $q$Slutsky was born in 1898 in Parafiivka, Chernihiv province, the son of a Jewish railway conductor, and grew up in Andijan in Turkestan. He joined the Bolsheviks in December 1917, chaired the Andijan revolutionary tribunal, entered the Cheka at Tashkent in September 1920, headed several district Cheka political bureaus and served as deputy chairman of the Turkestan Supreme Tribunal, taking a law degree externally. He joined the OGPU's Economic Directorate in June 1926, specializing in industrial espionage and rising to assistant chief in 1929, then transferred to foreign intelligence in January 1930 as assistant to Artuzov, became deputy chief in August 1931 and ran European operations, partly under cover in Berlin. On 21 May 1935 he succeeded Artuzov as chief of the Foreign Department, renamed the 7th Department in December 1936. He directed Soviet foreign intelligence at the height of its illegal-residency system, the machinery through which Arnold Deutsch and Theodore Maly built the Cambridge networks, while simultaneously turning it against Stalin's enemies abroad: the theft of Trotsky's Paris archive, the murder of Ignace Reiss at Lausanne in September 1937, the kidnapping of General Miller in Paris, and the operations in Spain where his protege Orlov was rezident all fall in his tenure. By mid-1937 he was the last GUGB department head from Yagoda's era still in post, which is precisely what made him a liability. On 17 February 1938 he died in the office of Yezhov's deputy Frinovsky. Pravda wrote that he had died "at his combat post". He was given an official funeral with an honour guard and buried at Novodevichy, and two months later, in April 1938, was expelled from the party as an enemy of the people.$q$,
       'murdered', '독살로 전한다', 'Reported poisoned',
       'soviet', '소련', 'Soviet Union',
       'ukraine', '우크라이나', 'Ukraine',
       NOW()
ON CONFLICT (id) DO UPDATE SET
    group_id = EXCLUDED.group_id, initial = EXCLUDED.initial, cyrillic = EXCLUDED.cyrillic,
    years_label = EXCLUDED.years_label, birth_year = EXCLUDED.birth_year, death_year = EXCLUDED.death_year,
    name_ko = EXCLUDED.name_ko, name_en = EXCLUDED.name_en,
    epithet_ko = EXCLUDED.epithet_ko, epithet_en = EXCLUDED.epithet_en,
    moment_ko = EXCLUDED.moment_ko, moment_en = EXCLUDED.moment_en,
    bio_ko = EXCLUDED.bio_ko, bio_en = EXCLUDED.bio_en,
    fate_kind = EXCLUDED.fate_kind, fate_label_ko = EXCLUDED.fate_label_ko, fate_label_en = EXCLUDED.fate_label_en,
    citizenship_code = EXCLUDED.citizenship_code,
    citizenship_label_ko = EXCLUDED.citizenship_label_ko, citizenship_label_en = EXCLUDED.citizenship_label_en,
    origin_code = EXCLUDED.origin_code,
    origin_label_ko = EXCLUDED.origin_label_ko, origin_label_en = EXCLUDED.origin_label_en,
    updated_at = NOW();

INSERT INTO commulingo_person_patronymics (person_id, patronymic_ko, patronymic_en, cyrillic_patronymic, updated_at)
VALUES ('slutsky', '아로노비치', 'Aronovich', 'Аронович', NOW())
ON CONFLICT (person_id) DO UPDATE SET
    patronymic_ko = EXCLUDED.patronymic_ko, patronymic_en = EXCLUDED.patronymic_en,
    cyrillic_patronymic = EXCLUDED.cyrillic_patronymic, updated_at = NOW();

INSERT INTO commulingo_person_roles (person_id, icon, office_id, label_ko, label_en, updated_at)
VALUES ('slutsky', '', 'state-security', '', '', NOW())
ON CONFLICT (person_id) DO UPDATE SET office_id = EXCLUDED.office_id, updated_at = NOW();


-- 3. Aliases ----------------------------------------------------------------
-- Merkulov's literary pseudonym is a real alias, not trivia: the plays were
-- published and staged under it.
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order)
SELECT v.id, v.lang, v.alias, v.ord
FROM (VALUES
    ('merkulov', 'ko', '브세볼로드 니콜라예비치 메르쿨로프', 0),
    ('merkulov', 'ko', '브세볼로드 로크', 1),
    ('merkulov', 'en', 'Vsevolod Nikolayevich Merkulov', 0),
    ('merkulov', 'en', 'Vsevolod Rokk', 1),
    ('slutsky', 'ko', '아브람 아로노비치 슬루츠키', 0),
    ('slutsky', 'en', 'Abram Aronovich Slutsky', 0)
) AS v(id, lang, alias, ord)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.id)
ON CONFLICT (person_id, lang, alias) DO UPDATE SET sort_order = EXCLUDED.sort_order;


-- 4. Career entries ---------------------------------------------------------
INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, role_ko, role_en, updated_at)
SELECT v.id, v.ord, v.period, v.role_ko, v.role_en, NOW()
FROM (VALUES
    ('merkulov', 0, '1921–1931', '조지아 체카·GPU 경제부와 정보국', 'Georgian Cheka and GPU: Economic Department and Information Bureau'),
    ('merkulov', 1, '1931–1934', '자캅카스 지방위원회 제1서기(베리야)의 보좌관', 'Assistant to the First Secretary of the Transcaucasian Regional Committee, Beria'),
    ('merkulov', 2, '1934–1937', '자캅카스 지방위원회 소비에트무역부장, 이어 특별부장', 'Head of the Soviet Trade Department, then of the Special Sector, Transcaucasian Regional Committee'),
    ('merkulov', 3, '1937–1938', '조지아 공산당 중앙위원회 산업수송부장', 'Head of the Industrial-Transport Department, Central Committee of the Georgian Communist Party'),
    ('merkulov', 4, '1938', 'NKVD 국가보안총국 부국장', 'Deputy chief of the Main Directorate of State Security, NKVD'),
    ('merkulov', 5, '1938–1941', '내무 제1부인민위원 겸 국가보안총국장', 'First Deputy People''s Commissar of Internal Affairs and chief of the GUGB'),
    ('merkulov', 6, '1941', '국가보안인민위원(NKGB 1차)', 'People''s Commissar of State Security, the first NKGB'),
    ('merkulov', 7, '1941–1943', '내무 제1부인민위원', 'First Deputy People''s Commissar of Internal Affairs'),
    ('merkulov', 8, '1943–1946', '국가보안인민위원, 1946년부터 국가보안장관(MGB)', 'People''s Commissar of State Security, and from 1946 Minister of State Security'),
    ('merkulov', 9, '1947–1950', '대외 소비에트재산총국장', 'Chief of the Main Directorate of Soviet Property Abroad'),
    ('merkulov', 10, '1950–1953', '국가통제장관', 'Minister of State Control'),
    ('merkulov', 11, '1953', '체포, 재판과 처형', 'Arrested, tried and executed'),
    ('slutsky', 0, '1919–1922', '안디잔 혁명재판소 의장, 투르케스탄 체카', 'Chairman of the Andijan revolutionary tribunal; Cheka service in Turkestan'),
    ('slutsky', 1, '1922–1925', '투르케스탄 최고재판소 부의장, 이어 군사재판소 의장', 'Deputy chairman of the Turkestan Supreme Tribunal, then chairman of a military tribunal'),
    ('slutsky', 2, '1926–1930', 'OGPU 경제국 과장, 이어 부국장', 'Section head, then assistant chief, of the OGPU Economic Directorate'),
    ('slutsky', 3, '1930–1934', 'INO OGPU 부국장(유럽 담당, 일부 기간 베를린 잠복)', 'Deputy chief of INO OGPU, European operations, partly under cover in Berlin'),
    ('slutsky', 4, '1934–1935', '국가보안총국 대외국 부국장', 'Deputy chief of the Foreign Department, GUGB NKVD'),
    ('slutsky', 5, '1935–1936', '국가보안총국 대외국(INO) 국장', 'Chief of the Foreign Department, GUGB NKVD'),
    ('slutsky', 6, '1936–1938', '국가보안총국 제7부장', 'Chief of the 7th Department, GUGB NKVD'),
    ('slutsky', 7, '1938', '프리놉스키의 집무실에서 사망', 'Died in Frinovsky''s office')
) AS v(id, ord, period, role_ko, role_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.id)
  AND NOT EXISTS (
      SELECT 1 FROM commulingo_person_career_entries c
      WHERE c.person_id = v.id AND c.sort_order = v.ord
  );
