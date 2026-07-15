-- 054_commulingo_nkvd_event_links.sql
-- Wires the NKVD/OGPU/MVD people added in 052 (and Slutsky, added in 053) into
-- commulingo_history_event_people. 052 added them to the dictionary but left
-- them unlinked, so they did not surface on any event page.
--
-- APPLY 053 FIRST. The WHERE EXISTS guard below silently skips any person_id
-- that is not yet in commulingo_people, so running this before 053 would drop
-- the slutsky and merkulov rows without erroring.
--
-- Kind vocabulary per routes/commulingo-events.js:
--   executor > leader > participant > opponent > target > witness
-- Kinds are chosen per event to match the buckets that event already renders:
-- great-patriotic-war has no 'executor' group, so wartime security roles go in
-- as 'participant' rather than inventing a bucket for them.
--
-- Cohort logic. Most of these men both ran the terror and were consumed by it;
-- the PK is (event_id, person_id), so kind carries the bucket and relation_*
-- carries the nuance, following the existing 'postyshev' precedent
-- ("Enforcer turned target"). Deliberately NOT linked to great-terror:
--   tsanava, milshtein, mamulov, dekanozov, meshik  -- joined after Nov 1938
--   karanadze                                       -- party work until Nov 1938
--   frenkel                                         -- camp administrator, not a
--                                                      terror operative; he is
--                                                      linked to five-year-plans
-- Deliberately NOT linked to beria-purge:
--   karanadze -- never tried; rehabilitated and promoted in April 1953
--
-- sort_order 200+ (great-terror) and 50+ (others) appends after existing rows.
-- Idempotent via ON CONFLICT.

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT v.event_id, v.person_id, v.sort_order, v.relation_kind,
       v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES

-- ============================================================== great-terror
-- The machinery, central apparatus
('great-terror', 'molchanov', 200, 'executor', '집행자이자 표적', 'Enforcer turned target',
 '비밀정치국장으로 류틴 그룹 체포와 키로프 물결, 1936년 8월 재판의 수사 실무를 운영했고, 야고다의 기구가 숙청될 때 가장 먼저 체포된 고위 간부 중 하나로 1937년 처형됐다.',
 'As chief of the Secret Political Department he ran the Ryutin arrests, the Kirov stream and the investigative preparation of the August 1936 trial, then became one of the first senior officers taken when Yagoda''s apparatus was purged, and was shot in 1937.'),
('great-terror', 'pauker', 201, 'executor', '작전국장', 'Chief of the operations department',
 '체포와 수색, 처형과 크렘린 경비를 관장한 작전국을 이끌며 정치사건의 물리적 기구를 공급했고 1936년 8월 재판 뒤의 처형을 집행했다. 1937년 스탈린 암살 모의 혐의로 총살됐다.',
 'He ran the department that controlled arrests, searches, executions and Kremlin guard duty, supplying the physical machinery of the political cases and administering the executions after the August 1936 trial. He was shot in 1937 on a charge of plotting against Stalin.'),
('great-terror', 'georgy-prokofiev', 202, 'executor', '야고다의 제2부인민위원', 'Yagoda''s second deputy commissar',
 '경제국장으로 기술 전문가를 겨눈 파괴 공작 사건들을 만들어 낸 뒤 NKVD 창설과 함께 야고다의 제2부인민위원이 되었고, 야고다의 측근들과 함께 1937년 처형됐다.',
 'He built the wrecking cases against technical specialists as head of the Economic Directorate, became Yagoda''s second deputy on the NKVD''s creation, and was shot in 1937 with Yagoda''s circle.'),
('great-terror', 'belsky', 203, 'executor', '트로이카를 조직한 부인민위원', 'The deputy commissar behind the troikas',
 '소비에트 민병대 전체를 관장하다 1936년 11월 예조프의 부인민위원이 되어 대량 사형 판결을 내린 지방 트로이카들을 조직한 기구의 상층에 앉았고, 1939년 체포되어 1941년 총살됐다.',
 'He ran the entire Soviet militia before becoming Yezhov''s deputy commissar in November 1936, sitting atop the machinery that organized the regional troikas issuing mass death sentences. Arrested in 1939, he was shot in 1941.'),
('great-terror', 'zhukovsky', 204, 'executor', '예조프의 부인민위원', 'Yezhov''s deputy commissar',
 '대외무역 관리 출신으로 예조프에게 발탁되어 행정경제국을 운영하다 1938년 1월 부인민위원이 되었고, 스탈린이 예조프의 사람들을 제거하기 시작하자 가장 먼저 체포되어 1940년 총살됐다.',
 'A foreign-trade official recruited by Yezhov, he ran the Administrative-Economic Directorate and became a deputy commissar in January 1938. He was among the first taken as Stalin dismantled Yezhov''s circle, and was shot in 1940.'),
('great-terror', 'blokhin', 205, 'executor', '사형집행 책임자', 'The executioner',
 '루뱐카 내부감옥의 사형 집행을 맡은 사령부를 이십칠 년간 이끌며 모스크바 재판의 피고들과 1938년에서 1939년 사이 무너진 NKVD 지도부 상당수를 직접 처형하거나 감독했다.',
 'He headed the Kommandatura that carried out death sentences in the Lubyanka''s internal prison for twenty-seven years, personally shooting or supervising the shooting of the Moscow Trial defendants and much of the NKVD leadership that fell in 1938 and 1939.'),
('great-terror', 'vlodzimirsky', 206, 'executor', '숙청자를 숙청한 수사관', 'The investigator who purged the purgers',
 '1937년 중앙기구로 옮겨 수사부에서 예조프 시대 엘리트들의 심문을 담당했고, 이후 베리야의 특별중요사건 수사부장이 되었다.',
 'Transferred to the central apparatus in 1937, he worked in the Investigative Unit handling the interrogation of the Yezhov-era elite, and later became Beria''s head of especially important cases.'),
('great-terror', 'slutsky', 207, 'executor', '대외정보국장', 'Chief of foreign intelligence',
 '1935년부터 NKVD 대외정보국(INO)을 이끌며 해외 망명자와 트로츠키파를 겨눈 작전을 관장했고, 1938년 2월 프리놉스키의 집무실에서 급사했다.',
 'He headed the NKVD''s Foreign Department from 1935, directing operations against émigrés and Trotskyists abroad, and died suddenly in Frinovsky''s office in February 1938.'),

-- The regional barons
('great-terror', 'balitsky', 210, 'executor', '우크라이나의 집행자이자 표적', 'Ukraine''s enforcer, and its target',
 '십사 년 대부분을 우크라이나 보안기구의 수장으로 보내며 키로프 암살 뒤의 대량 체포와 추방, 조작된 민족주의 사건들을 운영했으나, 1937년 5월 극동으로 전출된 뒤 7월 예조프의 영장으로 체포되어 11월 총살됐다.',
 'He headed the Ukrainian security apparatus for most of fourteen years, running the mass arrests and deportations after Kirov''s murder and the fabricated nationalist cases, then was transferred to the Far East in May 1937, arrested in July on Yezhov''s warrant, and shot in November.'),
('great-terror', 'deribas', 211, 'executor', '극동의 총독이자 표적', 'The Far East''s viceroy, and its target',
 '팔 년간 극동의 보안 총독으로 수용소 경제와 국경 방첩을 운영했으나, 예조프가 지방 NKVD 실력자들을 겨누자 1937년 8월 체포되어 이듬해 처형됐다.',
 'For eight years he was the security viceroy of the Far East, running its camp economy and frontier counter-intelligence, until Yezhov moved against the regional NKVD barons: arrested in August 1937 and executed the following year.'),
('great-terror', 'redens', 212, 'executor', '모스크바주 트로이카 의장', 'Chairman of the Moscow region troika',
 '1937년 7월 명령 제00447호에 따른 모스크바주 트로이카를 주재하며 대량 사형 판결을 내렸고, 처형은 부토보와 코무나르카에서 집행됐다. 스탈린의 처남이었으나 1938년 체포되어 1940년 총살됐다.',
 'He chaired the Moscow region troika under Order No. 00447 from July 1937, presiding over mass death sentences carried out at Butovo and Kommunarka. Stalin''s brother-in-law, he was nonetheless arrested in 1938 and shot in 1940.'),
('great-terror', 'evdokimov', 213, 'executor', '북캅카스 후견망의 수장', 'Head of the North Caucasus network',
 '1934년 보안기관을 떠나 당 사업으로 옮겼으나 그의 북캅카스 부하들이 예조프의 중앙 NKVD를 채웠고, 1937년 2월 총회에서 야고다를 공격했다. 예조프와 함께 무너져 1938년 체포되고 1940년 총살됐다.',
 'He had left the organs for party work in 1934, but his North Caucasus proteges filled Yezhov''s central NKVD and he attacked Yagoda at the February 1937 plenum. He fell with Yezhov: arrested in 1938, shot in 1940.'),
('great-terror', 'leplevsky', 214, 'executor', '우크라이나 대량작전을 정점으로', 'He drove the Ukrainian mass operations to their peak',
 '1937년 6월 우크라이나 NKVD 수장으로 명령 제00447호와 제00485호에 따른 작전, 조작된 「우크라이나 군사조직」 사건을 지휘했고, 이듬해 4월 체포되어 7월 코무나르카에서 총살됐다.',
 'As Ukrainian NKVD chief from June 1937 he directed the operations under Orders No. 00447 and No. 00485 and the invented "Ukrainian Military Organisation" case. He was arrested that April and shot at Kommunarka in July 1938.'),
('great-terror', 'uspensky', 215, 'executor', '자살을 위장하고 달아난 집행자', 'The enforcer who faked his suicide and ran',
 '오렌부르크에서 대량작전을 유별난 열의로 밀어붙여 예조프의 눈에 들었고 1938년 우크라이나 테러의 마지막 국면을 주재했다. 그해 11월 드네프르 강가에 유서를 남겨 자살을 위장하고 달아났으나 다섯 달 뒤 붙잡혀 1940년 총살됐다.',
 'His exceptional zeal in the Orenburg mass operations brought him to Yezhov''s attention, and in 1938 he presided over the final phase of the terror in Ukraine. That November he faked his suicide at the Dnieper and fled, was caught five months later, and was shot in 1940.'),

-- Georgia
('great-terror', 'goglidze', 220, 'executor', '조지아 트로이카 의장', 'Chairman of the Georgian troika',
 '1934년부터 조지아 내무인민위원으로 공화국 NKVD 트로이카를 주재하며 조지아 대테러의 실무를 총괄했고, 1938년 말 레닌그라드로 옮겨 예조프의 사람들을 정리했다.',
 'People''s Commissar of Internal Affairs of Georgia from 1934, he chaired the republic''s NKVD troika and was the operational manager of the terror in Georgia, then moved to Leningrad in late 1938 to clear out Yezhov''s men.'),
('great-terror', 'rapava', 221, 'executor', '조지아 특별 트로이카 위원', 'Member of the Georgian special troika',
 '1937년 명령 제00447호로 재판 외 사형 판결 권한을 부여받은 NKVD 특별 트로이카에 앉았고, 이듬해부터 조지아 NKVD를 이끌었다.',
 'He sat on the NKVD special troika empowered by Order No. 00447 in 1937 to pass extrajudicial death sentences, and headed the Georgian NKVD from the following year.'),
('great-terror', 'shalva-tsereteli', 222, 'executor', '조지아 특별 트로이카 위원', 'Member of the Georgian special troika',
 '제정군 장교 출신으로 1937년과 1938년 조지아 민병대를 이끌며 NKVD 특별 트로이카에 앉았다.',
 'A former tsarist officer, he headed the Georgian militia in 1937 and 1938 and sat on the NKVD special troika.'),
('great-terror', 'amayak-kobulov', 223, 'executor', '가그라·압하지야 NKVD', 'The Gagra and Abkhaz NKVD',
 '대테러기에 가그라 NKVD와 압하지야 NKVD를 운영했고, 1938년 12월 서른둘의 나이에 우크라이나 NKVD 대행 수장이 되었다.',
 'He ran the Gagra and Abkhaz NKVD during the terror, and in December 1938 became acting NKVD chief of Ukraine at thirty-two.'),
('great-terror', 'rukhadze', 224, 'executor', '가그라 지구 NKVD', 'The Gagra district NKVD',
 '1937년 압하지야 가그라의 NKVD 지구부를 이끌었고, 남아 있는 그의 기소장은 이 시기 「간이 수사」 방식으로 이루어진 삼백 건 이상의 체포를 그에게 돌린다.',
 'He headed the NKVD district office in Gagra, Abkhazia, in 1937; his surviving indictment attributes to him over 300 arrests conducted by "simplified investigation" methods.'),
('great-terror', 'krimyan', 225, 'executor', '조지아 NKVD 수사관', 'Investigator in the Georgian NKVD',
 '1937년과 1938년 조지아 NKVD 국가보안관리국 과장을 지냈고 이어 공화국 수사부를 이끌었다. 1955년 트빌리시 재판에서 이 시기의 행위로 사형을 선고받았다.',
 'He was a section chief in the Georgian NKVD state security directorate in 1937 and 1938 and went on to head the republic''s Investigative Department. He was sentenced to death for this period at the 1955 Tbilisi trial.'),
('great-terror', 'khazan', 226, 'executor', '조지아 비밀정치부', 'The Georgian Secret-Political Department',
 '1937년 조지아 NKVD 비밀정치부 제1과장이 되었고, 이듬해 2월 도발적 수사 방식을 이유로 체포되었다가 두 달 뒤 베리야의 지시로 풀려났다.',
 'He became head of the 1st section of the Georgian NKVD''s Secret-Political Department in 1937, was arrested in February 1938 for provocative investigative methods, and was released two months later on Beria''s instructions.'),
('great-terror', 'savitsky', 227, 'executor', '조지아 NKVD 제4부', 'The Georgian NKVD''s 4th department',
 '1937년과 1938년 조지아 NKVD 제4부에서 요원과 과장, 부부장으로 일했고 1955년 트빌리시 재판에서 이 시기의 행위로 사형을 선고받았다.',
 'He served as an operative, section head and assistant head of the Georgian NKVD''s 4th department in 1937 and 1938, and was sentenced to death for that work at the 1955 Tbilisi trial.'),
('great-terror', 'nadaraya', 228, 'executor', '조지아 NKVD 내부감옥', 'The Georgian NKVD internal prison',
 '대테러가 절정이던 1937년 조지아 NKVD 내부감옥을 운영했고, 1955년 기소장은 그곳에서의 수감자 구타 관여와 허위 사망진단서 작성을 그에게 물었다.',
 'He ran the NKVD internal prison of the Georgian SSR at the height of the terror in 1937. The 1955 indictment charged him with involvement in the beating of prisoners there and with arranging falsified death certificates.'),

-- The camp system: administrators who were themselves consumed
('great-terror', 'matvei-berman', 230, 'executor', '테러의 수감자를 받은 굴라크 수장', 'The Gulag chief who received the terror''s prisoners',
 '1932년부터 1937년까지 굴라크를 이끌며 수용소 체계가 테러의 수감자들을 흡수하는 동안 그 정점에 있었고, 1938년 12월 체포되어 이듬해 총살됐다.',
 'He headed the Gulag from 1932 to 1937, sitting at the top of the camp system as it absorbed the terror''s prisoners, and was arrested in December 1938 and shot the following year.'),
('great-terror', 'firin', 231, 'target', '수용소 관리자이자 표적', 'Camp administrator and target',
 '드미트라크 수용소장으로 「개조」 선전을 연출했으나 야고다의 사람이었던 탓에 1937년 4월 NKVD 내부의 음모를 이끌었다는 혐의로 체포되어 8월 총살됐다.',
 'He staged the "reforging" propaganda as chief of Dmitlag, but as one of Yagoda''s men he was arrested in April 1937 on a charge of leading a conspiracy inside the NKVD and shot that August.'),
('great-terror', 'lazar-kogan', 232, 'target', '굴라크 초대 수장이자 표적', 'The Gulag''s first chief, and a target',
 '굴라크의 초대 수장이자 백해-발트 운하 건설 책임자였으나 야고다 시대의 사람으로 몰려 1938년 1월 체포되었고, 예조프와 베리야에게 참회의 편지를 거듭 쓴 끝에 1939년 총살됐다.',
 'The first head of the Gulag and the builder of the White Sea-Baltic Canal, he was marked as a man of the Yagoda era, arrested in January 1938 and shot in 1939 after writing repeated letters of repentance to Yezhov and then Beria.'),

-- ================================================================ beria-purge
('beria-purge', 'goglidze', 50, 'target', '1953년 12월 함께 총살', 'Shot with Beria, December 1953',
 '1953년 7월 3일 동독에서 구금되어 베리야와 함께 특별재판부의 비공개 재판을 받고 12월 23일 당일 총살됐다.',
 'Detained in East Germany on 3 July 1953, he was tried in camera with Beria by the Special Judicial Presence and shot on 23 December, the day of the verdict.'),
('beria-purge', 'dekanozov', 51, 'target', '1953년 12월 함께 총살', 'Shot with Beria, December 1953',
 '베리야가 조지아 내무장관에 앉힌 지 석 달 만인 1953년 6월 30일 체포되어 12월 23일 총살됐다.',
 'Arrested on 30 June 1953, three months after Beria had made him MVD minister of Georgia, he was shot on 23 December.'),
('beria-purge', 'meshik', 52, 'target', '1953년 12월 함께 총살', 'Shot with Beria, December 1953',
 '베리야의 민족정책 노선을 집행하던 우크라이나 내무장관으로, 1953년 6월 30일 키예프 당 중앙위원회 건물에서 체포되어 12월 23일 총살됐다.',
 'MVD minister of Ukraine, where he was executing Beria''s nationalities line, he was arrested in the Ukrainian party Central Committee building in Kyiv on 30 June 1953 and shot on 23 December.'),
('beria-purge', 'vlodzimirsky', 53, 'target', '1953년 12월 함께 총살', 'Shot with Beria, December 1953',
 '베리야가 1953년 3월 MVD 특별수사부장으로 복귀시킨 지 넉 달 만인 7월 17일 체포되어 12월 23일 총살됐다.',
 'Restored by Beria in March 1953 to head the MVD''s special investigations, he was arrested four months later on 17 July and shot on 23 December.'),
('beria-purge', 'amayak-kobulov', 54, 'target', '별도 재판 뒤 처형', 'Tried separately and executed',
 '1953년 6월 27일 동독에서 체포되었으나 베리야 집단과 함께가 아니라 별도로 재판을 받아 1954년 10월 선고, 1955년 2월 총살됐다.',
 'Arrested in East Germany on 27 June 1953, he was tried separately from the Beria group, condemned in October 1954 and shot in February 1955.'),
('beria-purge', 'milshtein', 55, 'target', '별도 재판 뒤 처형', 'Tried separately and executed',
 '베리야가 우크라이나 제1부장관으로 보낸 지 넉 달 만인 1953년 7월 3일 체포되어 별도 재판 끝에 1955년 1월 총살됐다.',
 'Arrested on 3 July 1953, four months after Beria sent him to Ukraine as first deputy minister, he was shot in January 1955 after a separate trial.'),
('beria-purge', 'mamulov', 56, 'target', '십오 년형', 'Fifteen years',
 '권력이 절차적이고 파생적이었던 탓에 1953년 12월의 집단이 아니라 1954년 9월 베리야의 각료회의 서기국을 운영한 루드비고프와 함께 재판을 받아 십오 년형을 받고 형기를 다 채웠다.',
 'His power was procedural and derivative, so he was tried not with the December 1953 group but in September 1954, alongside Ludvigov who had run Beria''s Council of Ministers secretariat. He received fifteen years and served the full term.'),
('beria-purge', 'tsanava', 57, 'target', '재판 없이 옥중 사망', 'Died in custody, never tried',
 '미호엘스 사건을 다시 열던 베리야 자신의 MVD에 1953년 4월 체포되었고, 베리야가 몰락한 뒤에도 기소가 이어졌으나 재판을 받지 못한 채 1955년 10월 부티르카 감옥에서 사망했다.',
 'He was arrested in April 1953 by Beria''s own MVD as it reopened the Mikhoels case, and the case against him continued after Beria fell, but he died in Butyrka prison in October 1955 without ever coming to trial.'),
('beria-purge', 'rapava', 58, 'target', '트빌리시 재판, 1955년', 'The Tbilisi trial, 1955',
 '십 년간 조지아 경찰기구를 운영한 뒤 1953년 7월 재체포되어 1955년 9월 트빌리시 공개 재판에서 사형을 선고받고 11월 15일 총살됐다.',
 'After running the Georgian police apparatus for a decade he was re-arrested in July 1953, sentenced to death at the public Tbilisi trial in September 1955, and shot on 15 November.'),
('beria-purge', 'rukhadze', 59, 'target', '트빌리시 재판, 1955년', 'The Tbilisi trial, 1955',
 '베리야의 부하들을 겨눈 「밍그렐리아 사건」을 몰아붙였던 그는 1952년 11월 이미 체포되어 있었고, 결국 그 사건이 아니라 베리야 집단의 일원이라는 혐의로 1955년 총살됐다.',
 'He had driven the "Mingrelian affair" against Beria''s own clients and was already under arrest from November 1952, yet was ultimately shot in 1955 not for that case but as an alleged member of Beria''s group.'),
('beria-purge', 'shalva-tsereteli', 60, 'target', '트빌리시 재판, 1955년', 'The Tbilisi trial, 1955',
 '베리야의 은밀한 공작에 동원된 요원으로 지목되어 1953년 8월 체포되었고 1955년 11월 15일 총살됐다.',
 'Identified as one of the operatives used for Beria''s covert work, he was arrested in August 1953 and shot on 15 November 1955.'),
('beria-purge', 'savitsky', 61, 'target', '트빌리시 재판, 1955년', 'The Tbilisi trial, 1955',
 '보그단 코불로프의 개인 비서이자 보좌관으로 베리야가 몰락한 며칠 뒤인 1953년 7월 1일 체포되어 대령 계급에 그쳤음에도 사형 피고가 되었다.',
 'Bogdan Kobulov''s personal secretary and assistant, he was arrested on 1 July 1953, days after Beria''s fall, and became a capital defendant despite holding only the rank of colonel.'),
('beria-purge', 'khazan', 62, 'target', '트빌리시 재판, 1955년', 'The Tbilisi trial, 1955',
 '1945년 이미 보안기관을 떠나 있었으나 베리야가 몰락한 뒤 체포되어 조지아 NKVD 수사관 가운데 하나로 재판을 받고 1955년 총살됐다.',
 'He had already left the security service in 1945, but was arrested after Beria''s fall, tried as one of the Georgian NKVD investigators, and shot in 1955.'),
('beria-purge', 'krimyan', 63, 'target', '트빌리시 재판, 1955년', 'The Tbilisi trial, 1955',
 '1951년 보안기관에서 물러나 아르메니아 식품공업부에서 일하고 있었으나 1953년 9월 체포되어 1955년 11월 15일 총살됐다.',
 'He had left the organs in 1951 and was working in Armenia''s food industry ministry when he was arrested in September 1953. He was shot on 15 November 1955.'),
('beria-purge', 'nadaraya', 64, 'target', '십 년형', 'Ten years',
 '베리야의 경호 책임자로 1955년 트빌리시 재판의 여덟 번째 피고가 되었으나 여섯 명의 고위 피고와 달리 처형을 면하고 십 년형을 받아 1965년 석방됐다.',
 'Beria''s bodyguard chief and the eighth defendant at the 1955 Tbilisi trial, he escaped the fate of the six senior defendants, received ten years, and was released in 1965.'),

-- ================================================================ doctors-plot
('doctors-plot', 'goglidze', 50, 'executor', '수사 감독', 'He supervised the investigation',
 '1951년 8월 국가보안 제1부장관으로 중앙에 복귀했고, 1952년 11월 류민이 해임된 뒤 「의사들의 음모」 수사를 넘겨받아 감독했다.',
 'Brought back to the centre as first deputy MGB minister in August 1951, he took over supervision of the Doctors'' Plot investigation after Ryumin''s removal in November 1952.'),

-- ==================================================================== civil-war
('civil-war', 'evdokimov', 100, 'executor', '크림 타격단 책임자', 'Head of the Cheka''s Crimean Strike Group',
 '1920년 11월 체카 「크림 타격단」을 이끌어 항복한 브란겔군 병사들에 대한 대량 처형을 조직했고, 이 현장의 폭력이 그의 경력을 만들었다.',
 'He headed the Cheka''s "Crimean Strike Group" from November 1920, organizing the mass executions of Wrangel''s surrendered soldiers. That violence in the field made his career.'),
('civil-war', 'redens', 101, 'executor', '크림 체카 의장', 'Chairman of the Crimean Cheka',
 '1920년 크림 체카 의장으로 항복한 브란겔군에 대한 대량 보복을 지휘했다. 뒷날 스탈린의 처남이 되었으나 1940년 총살됐다.',
 'As chairman of the Crimean Cheka in 1920 he directed the mass reprisals against Wrangel''s surrendered forces. He later became Stalin''s brother-in-law, and was shot in 1940.'),

-- =============================================================== five-year-plans
('five-year-plans', 'lazar-kogan', 100, 'executor', '벨로모르 건설 책임자', 'Chief of construction at Belomor',
 '굴라크의 초대 수장으로 1931년부터 백해-발트 운하 건설을 지휘했다. 약 십칠만 명의 죄수가 이 년이 못 되어 227킬로미터 수로를 뚫었고 사망자는 수만 명에 이르렀다. 강제노동으로 기반시설을 지을 수 있음을 보여 주려 한 체제의 전시 사업이었다.',
 'The Gulag''s first chief, he directed construction of the White Sea-Baltic Canal from 1931. Roughly 170,000 prisoners cut the 227-kilometre waterway in under two years, with tens of thousands of deaths. It was the regime''s showcase demonstration that forced labour could build infrastructure.'),
('five-year-plans', 'matvei-berman', 101, 'executor', '굴라크를 경제의 도구로', 'He made the Gulag an instrument of the economy',
 '1932년부터 1937년까지 굴라크를 이끌며 수용소 체계를 교정노동 실험에서 소비에트 경제의 핵심 도구로 확장했고, 백해-발트 운하에 이어 모스크바-볼가 운하를 죄수 노동으로 건설했다.',
 'Heading the Gulag from 1932 to 1937, he expanded the camp system from a corrective-labour experiment into a central instrument of the Soviet economy, building the White Sea-Baltic and then the Moscow-Volga Canal with prisoner labour.'),
('five-year-plans', 'frenkel', 102, 'executor', '배급을 생산량에 묶은 행정가', 'The administrator who tied rations to output',
 '솔로프키의 죄수에서 행정가가 된 뒤 벨로모르 공사 책임자를 거쳐 1937년부터 NKVD 철도건설총국 전체를 이끌었다. 죄수의 배급을 생산량에 연동한 체계와 결부되는 인물로, 약한 수감자부터 죽어 나갔다.',
 'He went from Solovki prisoner to administrator, ran the works at Belomor, and from 1937 headed the NKVD''s entire railway construction directorate. He is associated with the system that tied a prisoner''s ration to his output, which killed the weakest first.'),
('five-year-plans', 'firin', 103, 'executor', '「개조」 선전의 연출자', 'He staged the "reforging" propaganda',
 '모스크바-볼가 운하를 파던 드미트라크 수용소를 「개조」 선전의 전시장으로 만들었고, 1934년 고리키와 함께 운하를 찬양한 문집 『벨로모르』를 공동 편집했다. 드미트라크에서 그는 생산성이 낮다고 판정된 죄수의 배급을 깎았다.',
 'He made Dmitlag, the camp digging the Moscow-Volga Canal, a showpiece of the "reforging" propaganda, and co-edited with Gorky the 1934 volume "Belomor" celebrating the canal. At Dmitlag he cut rations for prisoners judged unproductive.'),

-- ========================================================== great-patriotic-war
-- This event renders no 'executor' bucket, so wartime security roles enter as
-- participants rather than inventing a group for them.
('great-patriotic-war', 'tsanava', 100, 'participant', '파르티잔운동 중앙참모부 부장', 'Deputy head of the Central Staff of the Partisan Movement',
 '벨로루시 국가보안 수장으로 서부전선 특별부를 관장했고 1942년부터 파르티잔운동 중앙참모부 부장을 지냈다.',
 'As head of Belorussian state security he ran the Special Departments of the Western Front, and from 1942 served as deputy head of the Central Staff of the Partisan Movement.'),
('great-patriotic-war', 'milshtein', 101, 'participant', '강제이주 열차를 조직한 수송총국장', 'The transport chief who assembled the deportation trains',
 '전쟁 중 NKVD 수송 부문을 운영하며 1943년과 1944년 카라차이인과 칼미크인, 체첸인, 잉구시인의 강제이주 열차를 편성하고 움직였다. 그 공로로 받은 수보로프 훈장 2급은 민간인을 강제이주시킨 대가로 주어진 전공 훈장이었고, 소비에트 국가 자신이 1962년 이를 취소했다.',
 'Running the NKVD''s transport apparatus through the war, he assembled and moved the trains for the deportations of the Karachais, Kalmyks, Chechens and Ingush in 1943 and 1944. The Order of Suvorov 2nd class he received for it was a combat decoration given for deporting civilians, and the Soviet state itself annulled it in 1962.'),
('great-patriotic-war', 'meshik', 102, 'participant', '스메르시 부국장', 'Deputy head of SMERSH',
 '전쟁기에 NKVD 경제국을 운영한 뒤 스메르시 방첩의 부국장을 지냈고, 1945년부터는 원폭 계획의 보안과 방첩을 맡았다.',
 'He ran the NKVD''s Economic Directorate during the war and then served as a deputy head of SMERSH counter-intelligence, taking over security for the atomic project from 1945.'),
-- Merkulov belongs here (NKGB chief 1943-46) but NOT in great-terror: during the
-- 1937-38 terror he was a Georgian party official, not an NKVD officer.
('great-patriotic-war', 'merkulov', 103, 'participant', '국가보안인민위원', 'People''s Commissar of State Security',
 '1941년 2월과 1943년 4월 두 차례 국가보안인민위원이 되어 1946년까지 전시 정보와 방첩을 이끌었다. 1944년 3월 카라차이인과 칼미크인, 체첸인, 잉구시인 강제이주의 공로로 쿠투조프 훈장 1급을 받았고, 소비에트 국가 자신이 1962년 이를 취소했다.',
 'He headed the state security commissariat twice, from February 1941 and again from April 1943 until 1946, running wartime intelligence and counter-intelligence. In March 1944 he received the Order of Kutuzov 1st Class for the deportation of the Karachais, Kalmyks, Chechens and Ingush; the Soviet state itself annulled it in 1962.')

) AS v(event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
  AND EXISTS (SELECT 1 FROM commulingo_history_events e WHERE e.id = v.event_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
