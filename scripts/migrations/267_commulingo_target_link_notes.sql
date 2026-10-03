-- 2026-10-03: audit-event-people-kinds flagged 45 target links with no note,
-- left by earlier AI backfills. Each now has a note drawn from the person's card;
-- relation labels that contradicted the card are corrected (Trilisser, Shumsky,
-- Sukhanov, Blagonravov, Shumyatsky, Bryukhanov, Stukov, Serge) and vague ones
-- (수감자, 소비에트 지도자) made specific. Solzhenitsyn in the Great Patriotic War
-- and Petlyakov in the five-year plans were participants, not targets. Steklov's
-- link to the Great Patriotic War is removed: he was arrested in 1938 and died in
-- prison in 1941; his card says nothing about the war.
BEGIN;
UPDATE commulingo_history_event_people SET note_ko = '트로츠키 암살 작전을 함께 설계한 정보기관 간부로, 베리야 몰락 뒤 다시 체포되어 1964년에야 풀려났다.', note_en = 'Co-planner of the Trotsky assassination; re-arrested after Beria’s fall, he was not released until 1964.'
    WHERE event_id = 'beria-purge' AND person_id = 'naum-eitingon' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1953년 베리야의 「공범」으로 체포되어 15년을 감옥에서 보냈다.', note_en = 'Arrested in 1953 as Beria’s “accomplice”, he spent fifteen years in prison.'
    WHERE event_id = 'beria-purge' AND person_id = 'sudoplatov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '투폴레프 설계국에서 TB-1·TB-3 중폭격기의 날개를 설계했고, 1937년 체포된 뒤에도 샤라슈카에서 설계를 계속했다.', note_en = 'Designed the wings of the TB-1 and TB-3 heavy bombers in Tupolev’s bureau and kept designing in a sharashka after his 1937 arrest.', relation_kind = 'participant', relation_ko = '항공기 설계자', relation_en = 'Aircraft designer'
    WHERE event_id = 'five-year-plans' AND person_id = 'vladimir-petlyakov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '포병 대위로 참전하던 중 사신에서 스탈린을 비꼬았다가 1945년 체포되어 8년형을 받았다.', note_en = 'Fought as an artillery captain until a private letter mocking Stalin led to his arrest in 1945 and an eight-year sentence.', relation_kind = 'participant', relation_ko = '포병 대위', relation_en = 'Artillery captain'
    WHERE event_id = 'great-patriotic-war' AND person_id = 'solzhenitsyn' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1941년 포로가 된 뒤 나치의 회유를 모두 거부했고, 1945년 2월 마우트하우젠에서 얼음물 고문 끝에 숨졌다.', note_en = 'Captured in 1941, he refused every Nazi attempt to win him over and died under ice-water torture at Mauthausen in February 1945.'
    WHERE event_id = 'great-patriotic-war' AND person_id = 'dmitry-karbyshev' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1938년 남편 예조프의 몰락이 다가오며 친구들이 잇따라 체포되자 수면제 과다 복용으로 죽었다.', note_en = 'As her husband Yezhov’s fall approached and her friends were arrested one after another, she died of a sleeping-pill overdose in 1938.'
    WHERE event_id = 'great-terror' AND person_id = 'yevgenia-yezhova' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '헝가리 평의회 공화국 지도자로 코민테른에서 일하다 1937년 체포되어 이듬해 총살되었다.', note_en = 'Leader of the Hungarian Soviet Republic and Comintern functionary, he was arrested in 1937 and shot the following year.'
    WHERE event_id = 'great-terror' AND person_id = 'bela-kun' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '소련 영화산업을 이끌다 1938년 1월 해임·체포되어 7월 코뮤나르카에서 총살되었다.', note_en = 'Head of the Soviet film industry, he was dismissed and arrested in January 1938 and shot at Kommunarka in July.', relation_ko = '1938년 체포·총살', relation_en = 'Arrested and shot in 1938'
    WHERE event_id = 'great-terror' AND person_id = 'boris-shumyatsky' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '10월 혁명 때 페트로파블롭스크 요새 위원이었던 체카·OGPU 수송국장으로, 1937년 체포되어 이듬해 총살되었다.', note_en = 'Commissar of the Peter and Paul Fortress in October 1917 and later head of the Cheka–OGPU transport department, he was arrested in 1937 and shot the next year.', relation_ko = '1937년 체포, 1938년 총살', relation_en = 'Arrested in 1937, shot in 1938'
    WHERE event_id = 'great-terror' AND person_id = 'georgy-blagonravov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '체카·GPU 부의장과 혁명군사평의회 부의장을 지낸 뒤 1937년 체포되어 이듬해 총살되었다.', note_en = 'Former deputy chairman of the Cheka–GPU and of the Revolutionary Military Council, he was arrested in 1937 and shot the next year.'
    WHERE event_id = 'great-terror' AND person_id = 'iosif-unshlikht' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '첫 인민위원회의의 식량인민위원으로, 1937년 6월 체포되어 9월 「모스크바 센터」 재판 당일 총살되었다.', note_en = 'Food commissar in the first Sovnarkom, he was arrested in June 1937 and shot on the day of the “Moscow Centre” trial in September.'
    WHERE event_id = 'great-terror' AND person_id = 'ivan-teodorovich' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '카라한 선언을 낸 외교관으로, 1937년 「친파시스트 음모」 혐의로 처형되었다.', note_en = 'Diplomat behind the Karakhan Manifesto, he was executed in 1937 for a “pro-fascist conspiracy”.'
    WHERE event_id = 'great-terror' AND person_id = 'lev-karakhan' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1932년 스탈린 타도를 호소한 「류틴 강령」으로 체포되었고, 1937년 25분 재판 끝에 당일 총살되었다.', note_en = 'Arrested in 1932 for the “Ryutin Platform” calling for Stalin’s removal, he was shot in 1937 on the day of a 25-minute trial.'
    WHERE event_id = 'great-terror' AND person_id = 'martemyan-ryutin' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '적색 테러를 이론화한 체카 간부였으나 1937년 체포되어 1938년 총살되었다.', note_en = 'The Cheka official who theorised the Red Terror was himself arrested in 1937 and shot in 1938.'
    WHERE event_id = 'great-terror' AND person_id = 'martin-lacis' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '《프라우다》 스페인 특파원이었던 언론인으로, 1938년 체포되어 1940년 총살되었다.', note_en = 'Pravda’s correspondent in Spain, he was arrested in 1938 and shot in 1940.'
    WHERE event_id = 'great-terror' AND person_id = 'mikhail-koltsov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '소비에트 대외정보망을 세운 OGPU 해외부장 출신으로, 1938년 체포되어 1940년 총살되었다.', note_en = 'Former head of the OGPU Foreign Department who built the Soviet foreign intelligence network, he was arrested in 1938 and shot in 1940.', relation_ko = '1938년 체포, 1940년 총살', relation_en = 'Arrested in 1938, shot in 1940'
    WHERE event_id = 'great-terror' AND person_id = 'mikhail-trilisser' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '전 재무인민위원으로, 1938년 2월 체포되어 9월 총살되었다.', note_en = 'Former People’s Commissar of Finance, he was arrested in February 1938 and shot in September.', relation_ko = '1938년 체포·총살', relation_en = 'Arrested and shot in 1938'
    WHERE event_id = 'great-terror' AND person_id = 'nikolai-bryukhanov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '『혁명의 기록』의 저자로 1931년 멘셰비키 재판에서 투옥되었고, 1940년 거짓 혐의로 총살되었다.', note_en = 'Author of the Notes on the Revolution, jailed at the 1931 Menshevik trial, he was shot on false charges in 1940.', relation_ko = '1937년 재체포, 1940년 총살', relation_en = 'Re-arrested in 1937, shot in 1940'
    WHERE event_id = 'great-terror' AND person_id = 'nikolai-sukhanov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '스메노베호프스트보를 창시한 망명 법학자로, 1935년 귀국했다가 1937년 6월 체포되어 9월 총살되었다.', note_en = 'Founder of the Smenovekhovtsy movement, he returned from emigration in 1935, was arrested in June 1937 and shot in September.'
    WHERE event_id = 'great-terror' AND person_id = 'nikolai-ustryalov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '우크라이나 민족공산주의의 상징으로, 1933년 체포되어 솔로프키 수용소와 크라스노야르스크 유형을 겪었고 1946년 NKVD에 암살되었다.', note_en = 'Symbol of Ukrainian national communism, he was arrested in 1933, passed through the Solovki camp and exile in Krasnoyarsk, and was assassinated by the NKVD in 1946.', relation_ko = '1933년 체포, 수용소·유형', relation_en = 'Arrested in 1933; camp and exile'
    WHERE event_id = 'great-terror' AND person_id = 'oleksandr-shumsky' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1922년 그루지야 사건에서 스탈린의 자치화 계획에 맞섰던 볼셰비키로, 1937년 총살되었다.', note_en = 'The Bolshevik who opposed Stalin’s autonomisation plan in the 1922 Georgian Affair, he was shot in 1937.'
    WHERE event_id = 'great-terror' AND person_id = 'polikarp-mdivani' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '노동자 반대파 지도자로 1933년 출당되었고, 1937년 9월 거짓 기소로 처형되었다.', note_en = 'Leader of the Workers’ Opposition, expelled in 1933, he was executed on false charges in September 1937.'
    WHERE event_id = 'great-terror' AND person_id = 'shlyapnikov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '민주중앙집권파 지도자로 1927년 제명·유배되었고, 1937년 9월 처형되었다.', note_en = 'Leader of the Democratic Centralists, expelled and exiled in 1927, he was executed in September 1937.'
    WHERE event_id = 'great-terror' AND person_id = 'timofei-sapronov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '카자흐 대기근의 참상을 스탈린에게 알렸던 러시아 공화국 인민위원회의 부의장으로, 1938년 총살되었다.', note_en = 'Deputy chairman of the RSFSR Sovnarkom who had told Stalin of the horrors of the Kazakh famine, he was shot in 1938.'
    WHERE event_id = 'great-terror' AND person_id = 'turar-ryskulov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1937년부터 콜리마에서 오래 복역했고, 그 경험을 『콜리마 이야기』로 남겼다.', note_en = 'Served a long term in Kolyma from 1937 and recorded it in the Kolyma Tales.'
    WHERE event_id = 'great-terror' AND person_id = 'varlam-shalamov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '좌익 반대파로 1928년 제명·투옥되었고, 1936년 국제 구명 운동으로 소련을 떠나 대숙청을 피했다.', note_en = 'A Left Oppositionist expelled and jailed in 1928, he left the USSR in 1936 after an international campaign and escaped the Great Purge.', relation_ko = '투옥 뒤 1936년 소련 탈출', relation_en = 'Imprisoned; left the USSR in 1936'
    WHERE event_id = 'great-terror' AND person_id = 'victor-serge' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '첫 농업인민위원이자 계획경제의 통계 기반을 세운 경제학자로, 1937년 「우익 반혁명 조직」 혐의로 체포되어 처형되었다.', note_en = 'First People’s Commissar of Agriculture and an architect of planning statistics, he was arrested in 1937 for a “right-wing counter-revolutionary organisation” and executed.'
    WHERE event_id = 'great-terror' AND person_id = 'vladimir-milyutin' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '소련 군사정보 체계를 세운 정보국장으로, 1937년 11월 체포되어 1938년 7월 처형되었다.', note_en = 'Founder of Soviet military intelligence, he was arrested in November 1937 and executed in July 1938.'
    WHERE event_id = 'great-terror' AND person_id = 'yan-berzin' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '「트레스트」 작전을 설계한 방첩·해외첩보 책임자로, 1937년 처형되었다.', note_en = 'The counter-intelligence and foreign-intelligence chief who designed Operation Trust, he was executed in 1937.'
    WHERE event_id = 'great-terror' AND person_id = 'artur-artuzov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '주콥스키 공군사관학교장을 지낸 군사교육 지도자로, 대숙청 때 체포되어 15년을 갇혀 있었다.', note_en = 'Head of the Zhukovsky Air Force Academy, he was arrested in the purge and held for fifteen years.', relation_ko = '체포, 15년 수감', relation_en = 'Arrested; fifteen years in prison'
    WHERE event_id = 'great-terror' AND person_id = 'alexander-todorsky' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '민족문제 부인민위원과 카자흐 혁명위원회 의장을 지낸 볼셰비키로, 1937년 처형되었다.', note_en = 'Deputy Commissar for Nationalities and first chairman of the Kirghiz (Kazakh) Revolutionary Committee, he was executed in 1937.', relation_ko = '1937년 처형', relation_en = 'Executed in 1937'
    WHERE event_id = 'great-terror' AND person_id = 'stanislav-pestkovsky' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1937년 투폴레프와 함께 「사보타주」 혐의로 체포되어 NKVD 샤라슈카에서 설계를 계속했고, 1940년 풀려났다.', note_en = 'Arrested with Tupolev for “sabotage” in 1937, he kept designing in an NKVD sharashka and was released in 1940.', relation_ko = '1937년 체포, 샤라슈카 수감', relation_en = 'Arrested in 1937; held in a sharashka'
    WHERE event_id = 'great-terror' AND person_id = 'vladimir-petlyakov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = 'NKVD 특수임무반 책임자로, 1938년 체포되어 고문 끝에 거짓 자백하고 사형 선고를 받았다가 1941년 사면되었다.', note_en = 'Head of the NKVD Special Tasks group, he was arrested in 1938, made a false confession under torture and was sentenced to death, then pardoned in 1941.', relation_ko = '1938년 체포, 사형 선고', relation_en = 'Arrested in 1938; sentenced to death'
    WHERE event_id = 'great-terror' AND person_id = 'yakov-serebryansky' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1938년 체포되어 고문에도 죄를 인정하지 않았고, 콜리마 15년형을 받았다가 1941년 풀려났다.', note_en = 'Arrested in 1938, he admitted nothing under torture, was sentenced to fifteen years in Kolyma and released in 1941.'
    WHERE event_id = 'great-terror' AND person_id = 'alexander-gorbatov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '좌익 반대파에 차례로 가담했던 볼셰비키로, 1936년 체포되어 총살되었다.', note_en = 'A Bolshevik who had joined one left opposition after another, he was arrested in 1936 and shot.', relation_ko = '1936년 체포·총살', relation_en = 'Arrested in 1936 and shot'
    WHERE event_id = 'great-terror' AND person_id = 'innokenty-stukov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1938년 7월 체포되어 어떤 혐의도 인정하지 않았고, 1939년 5월 증거불충분으로 풀려나 군에 복귀했다.', note_en = 'Arrested in July 1938, he admitted no charge and was released for lack of evidence in May 1939 and returned to the army.'
    WHERE event_id = 'great-terror' AND person_id = 'kuzma-galitsky' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '붉은 군대 총정치국장이었으나 1949년 실각했고, 체포는 면했지만 군 정치 아카데미 원장으로 좌천되었다.', note_en = 'Head of the Red Army’s Main Political Directorate, he fell in 1949; spared arrest, he was demoted to head the military-political academy.'
    WHERE event_id = 'leningrad-affair' AND person_id = 'iosif-shikin' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1949년 1월 레닌그라드 무역박람회가 말렌코프의 공격을 받으며 사건의 발단이 되었고, 그해 8월 체포되어 1950년 처형되었다.', note_en = 'The Leningrad trade fair he hosted in January 1949 drew Malenkov’s attack and began the affair; he was arrested that August and executed in 1950.'
    WHERE event_id = 'leningrad-affair' AND person_id = 'pyotr-popkov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1988년 나고르노-카라바흐 시위에 동조했다는 이유로 모스크바가 「건강상 사유」를 내세워 해임했다.', note_en = 'Removed by Moscow in 1988, officially “for health reasons”, for sympathising with the Nagorno-Karabakh protests.'
    WHERE event_id = 'nationalities-crisis' AND person_id = 'karen-demirchyan' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1986년 12월 고르바초프가 그를 전격 해임하자 알마아타에서 젤톡산 시위가 일어났다.', note_en = 'His abrupt dismissal by Gorbachev in December 1986 set off the Jeltoqsan protests in Alma-Ata.'
    WHERE event_id = 'perestroika' AND person_id = 'dinmukhamed-kunaev' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1982년 비슬라브인으로는 드물게 소련 각료회의 제1부의장 겸 정치국원에 올랐으나 1987년 물러났다.', note_en = 'Rare among non-Slavs in rising to first deputy premier and Politburo member in 1982, he was removed in 1987.'
    WHERE event_id = 'perestroika' AND person_id = 'heydar-aliyev' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '1987년 마티아스 루스트의 붉은 광장 착륙 사건 뒤 고르바초프가 해임했다.', note_en = 'Dismissed by Gorbachev after Mathias Rust landed on Red Square in 1987.'
    WHERE event_id = 'perestroika' AND person_id = 'sokolov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '체르노빌 사고 때 정보 통제로 비판받았고, 1989년 고르바초프가 교체한 마지막 구세대 공화국 수반이었다.', note_en = 'Criticised for suppressing information after Chernobyl, he was the last old-guard republic leader Gorbachev replaced, in 1989.'
    WHERE event_id = 'perestroika' AND person_id = 'vladimir-shcherbitsky' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
UPDATE commulingo_history_event_people SET note_ko = '35년 동안 불가리아를 이끌었으나 1989년 11월 당내 쿠데타로 물러났다.', note_en = 'Bulgaria’s leader for 35 years, he was removed in a party coup in November 1989.'
    WHERE event_id = 'revolutions-1989' AND person_id = 'todor-zhivkov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
DELETE FROM commulingo_history_event_people WHERE event_id = 'great-patriotic-war' AND person_id = 'yuri-steklov' AND relation_kind = 'target' AND COALESCE(note_ko, '') = '';
COMMIT;
