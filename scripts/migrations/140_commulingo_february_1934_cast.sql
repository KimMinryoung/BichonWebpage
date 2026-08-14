-- Three men named in the body of the 6 February 1934 crisis (139), now given
-- their own dictionary entries and linked back to the event: Jean Chiappe, the
-- prefect whose dismissal lit the fuse; François de La Rocque, who commanded the
-- largest league on the square and turned it away from the Chamber; and Jacques
-- Doriot, who demanded the popular front before the party line allowed it and
-- ended in German uniform.
--
-- Alexandre Stavisky stays in the body only (owner decision, 2026-08-14): every
-- existing role category would misfile a swindler, and the dictionary is not
-- adding one for a single card.
--
-- Doriot is filed under counterrevolution for where he ended, not where he
-- began; the fourteen years in the PCF and the Comintern executive are in the
-- bio and the career table, which is where a trajectory belongs.

BEGIN;

-- ─── 장 시아프 ───────────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'jean-chiappe', 'international-counterrevolutionary', 19321130, '', 'Jean Chiappe', '1878–1940', 1878, 1940,
  '장 시아프', 'Jean Chiappe',
  '좌파에 엄격하고 동맹에 관대했던 파리 경찰청장, 그 해임이 2월 6일의 도화선이 되다',
  'The Paris prefect of police, hard on the left and indulgent to the leagues, whose dismissal lit the fuse of 6 February',
  $t$코르시카 아자시오 출신의 경찰 관료로 1927년부터 1934년까지 파리 경찰청장을 지냈다. 좌파 시위에는 엄격하고 극우 동맹의 가두 행동에는 관대하다는 평이 따라다녔으며, 우파 신문과 참전군인 조직 사이에서 인기가 높았다. 1934년 2월 3일 에두아르 달라디에 총리가 그를 자리에서 물러나게 하자 우파는 공화국이 자기 편 경찰을 쳐낸 사건으로 받아들였고, 사흘 뒤 콩코르드 광장에서 폭동이 일어났다. 해임된 뒤에도 파리에서 우파 정치의 중심 인물로 남았고, 1940년 비시 정권이 레반트 고등판무관으로 임명해 부임하던 길에 지중해 상공에서 비행기가 격추되어 죽었다.$t$,
  $t$A Corsican from Ajaccio who rose through the police administration and served as prefect of police of Paris from 1927 to 1934. He had a standing reputation for severity toward left-wing demonstrations and indulgence toward the street actions of the far-right leagues, and was popular with the right-wing press and the veterans' associations. When Prime Minister Édouard Daladier removed him on 3 February 1934, the right read it as the republic striking down its own policeman, and three days later the Place de la Concorde erupted. He remained a central figure of Paris right-wing politics after his dismissal, and died in 1940 when the aircraft carrying him to take up the Vichy post of high commissioner in the Levant was shot down over the Mediterranean.$t$,
  'killed', '부임 길에 비행기가 격추되어 사망', 'Killed when his aircraft was shot down',
  $t$「그렇다면 나는 거리에 있게 되겠군요」, 해임을 통보하는 달라디에와의 전화에서, 1934년 2월 3일. 우파 신문은 이 말을 거리로 나가겠다는 예고로 읽었고, 시아프는 실직을 뜻했을 뿐이라고 했다$t$,
  $t$'Then I shall be in the street', on the telephone with Daladier as he was removed, 3 February 1934. The right-wing press read it as notice that he would take to the streets; Chiappe said he had meant only that he would be out of a job$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '장', 'Jean', '시아프', 'Chiappe'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('jean-chiappe', 'counterrevolution');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('jean-chiappe', 'ko', '시아프', 0),
  ('jean-chiappe', 'en', 'Chiappe', 0);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('jean-chiappe', 0, '1878', 1878, 1878, '코르시카 아자시오에서 출생', 'Born at Ajaccio in Corsica'),
  ('jean-chiappe', 1, '1900년대–1926', 1900, 1926, '경찰 행정의 요직을 거치며 승진', 'Rises through senior posts in the police administration'),
  ('jean-chiappe', 2, '1927–1934', 1927, 1934, '파리 경찰청장', 'Prefect of police of Paris'),
  ('jean-chiappe', 3, '1934.02.03', 1934, 1934, '달라디에가 해임, 모로코 총감 제안을 거부', 'Removed by Daladier; refuses the residency-general in Morocco'),
  ('jean-chiappe', 4, '1935–1940', 1935, 1940, '파리 우파 정치의 중심 인물로 남음', 'Remains a central figure of the Paris right'),
  ('jean-chiappe', 5, '1940.11', 1940, 1940, '비시의 레반트 고등판무관 임명, 부임 길에 격추되어 사망', 'Appointed Vichy high commissioner in the Levant; shot down on the way');

-- ─── 프랑수아 드 라 로크 ─────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'francois-de-la-rocque', 'international-counterrevolutionary', 19321131, '', 'François de La Rocque', '1885–1946', 1885, 1946,
  '프랑수아 드 라 로크', 'François de La Rocque',
  '의사당 앞에서 대열을 돌린 불의 십자단의 대령',
  'The colonel of the Croix-de-Feu who turned his columns away from the Chamber',
  $t$장군의 아들로 태어나 생시르를 거쳐 모로코와 1차 대전에서 복무하고 중령으로 예편한 직업군인. 1931년부터 참전군인 조직 불의 십자단을 이끌며 수십만 규모의 대중운동으로 키웠고, 규율과 자동차 대열을 앞세운 그 행동양식은 프랑스 좌파에게 파시즘의 얼굴로 보였다. 1934년 2월 6일 밤 그의 대열은 하원 뒤편까지 이르렀으나 그는 돌입 대신 해산을 명령했고, 이 신중함 때문에 극우 진영 안에서 배신자로 몰렸다. 1936년 인민전선 정부가 동맹을 해산하자 프랑스사회당(PSF)을 세워 선거정치로 방향을 틀었고, 이 당은 1930년대 말 프랑스 최대의 우파 정당이 되었다. 1940년 페탱을 지지해 비시 국민평의회에 참여하면서 동시에 영국에 정보를 넘기는 조직을 운영하다 1943년 게슈타포에 체포되어 독일에 억류되었고, 해방 뒤에는 비시 부역 혐의로 프랑스 당국에 다시 구금되었다가 1946년 병으로 죽었다. 그가 파시스트였는가 아니면 권위주의적 보수의 프랑스적 형태였는가는 스테른헬 이래 오늘날까지 프랑스 우파 연구의 중심 논쟁으로 남아 있다.$t$,
  $t$The son of a general, trained at Saint-Cyr, who served in Morocco and the First World War and retired as a lieutenant-colonel. From 1931 he led the veterans' association Croix-de-Feu and built it into a mass movement of several hundred thousand, whose discipline and motorised rallies looked to the French left like the face of fascism. On the night of 6 February 1934 his columns reached the rear of the Chamber and he ordered them to disperse rather than storm it, a caution for which the far right called him a traitor. When the Popular Front government dissolved the leagues in 1936 he founded the Parti Social Français and turned toward electoral politics, building what became the largest party of the French right by the late 1930s. He backed Pétain and sat on Vichy's National Council while running an intelligence network that passed information to the British, was arrested by the Gestapo in 1943 and interned in Germany, and after the liberation was detained again by the French authorities as a Vichy man before dying of illness in 1946. Whether he was a fascist or the French form of authoritarian conservatism has been the central argument in the study of the French right from Sternhell onward.$t$,
  'natural', '억류 후유증으로 병사', 'Died of illness after internment',
  $t$2월 6일 밤 그의 대열은 하원 뒤편까지 이르렀으나 그는 돌입 대신 해산을 명령했다. 좌파는 그 밤에서 파시즘의 총연습을 보았고 극우는 그를 배신자라 불렀다. 두 평가는 그 뒤로도 그를 함께 따라다녔다$t$,
  $t$That night his columns reached the rear of the Chamber and he ordered them to disperse rather than storm it. The left saw a dress rehearsal for fascism in the same night; the far right called him a traitor. Both verdicts followed him for the rest of his life$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '프랑수아', 'François', '드 라 로크', 'de La Rocque'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('francois-de-la-rocque', 'counterrevolution');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('francois-de-la-rocque', 'ko', '라 로크', 0),
  ('francois-de-la-rocque', 'ko', '드 라 로크', 1),
  ('francois-de-la-rocque', 'en', 'La Rocque', 0),
  ('francois-de-la-rocque', 'en', 'de La Rocque', 1);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('francois-de-la-rocque', 0, '1885', 1885, 1885, '로리앙에서 장군의 아들로 출생', 'Born at Lorient, the son of a general'),
  ('francois-de-la-rocque', 1, '1907–1918', 1907, 1918, '생시르 졸업, 모로코 근무와 1차 대전 복무', 'Saint-Cyr, service in Morocco and the First World War'),
  ('francois-de-la-rocque', 2, '1919–1928', 1919, 1928, '참모 근무를 거쳐 중령으로 예편', 'Staff service; retires as a lieutenant-colonel'),
  ('francois-de-la-rocque', 3, '1929–1931', 1929, 1931, '불의 십자단 가입, 회장 취임', 'Joins the Croix-de-Feu and becomes its president'),
  ('francois-de-la-rocque', 4, '1931–1936', 1931, 1936, '불의 십자단을 수십만 규모의 대중운동으로 확대', 'Expands the Croix-de-Feu into a mass movement of hundreds of thousands'),
  ('francois-de-la-rocque', 5, '1934.02.06', 1934, 1934, '의사당 앞에서 대열을 해산시킴', 'Disperses his columns at the Chamber'),
  ('francois-de-la-rocque', 6, '1936.06', 1936, 1936, '동맹 해산령 뒤 프랑스사회당(PSF) 창당', 'Founds the Parti Social Français after the leagues are dissolved'),
  ('francois-de-la-rocque', 7, '1936–1939', 1936, 1939, 'PSF를 프랑스 최대 우파 정당으로 키움', 'Builds the PSF into the largest party of the French right'),
  ('francois-de-la-rocque', 8, '1940–1942', 1940, 1942, '페탱 지지, 비시 국민평의회 참여', 'Backs Pétain; sits on Vichy''s National Council'),
  ('francois-de-la-rocque', 9, '1942–1943', 1942, 1943, '영국에 정보를 넘기는 조직 운영, 1943년 3월 게슈타포에 체포', 'Runs an intelligence network for the British; arrested by the Gestapo in March 1943'),
  ('francois-de-la-rocque', 10, '1943–1945', 1943, 1945, '독일로 이송되어 억류', 'Deported to Germany and interned'),
  ('francois-de-la-rocque', 11, '1945–1946', 1945, 1946, '해방 후 프랑스 당국에 구금, 이듬해 병사', 'Detained by the French authorities after the liberation; dies the next year'),
  ('francois-de-la-rocque', 12, '1961', 1961, 1961, '저항 강제이송자로 사후 인정', 'Posthumously recognised as a deported member of the Resistance');

-- ─── 자크 도리오 ─────────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'jacques-doriot', 'international-counterrevolutionary', 19321132, '', 'Jacques Doriot', '1898–1945', 1898, 1945,
  '자크 도리오', 'Jacques Doriot',
  '인민전선을 가장 먼저 요구하고 파시스트로 끝난 생드니의 공산주의자',
  'The Saint-Denis Communist who demanded the popular front first and ended a fascist',
  $t$생드니의 금속노동자 출신으로 스물여섯에 하원의원이 되고 코민테른 집행위원까지 오른 프랑스공산당의 젊은 지도자. 리프 전쟁 반대 선동으로 투옥되었고 1927년에는 코민테른 특사로 중국에 파견되었으며, 1931년부터 생드니 시장을 지냈다. 1934년 2월의 위기 직후 그는 당론에 앞서 사회당과의 즉각적 공동행동을 공개로 요구했고, 모스크바의 소환을 거부해 6월 27일 제명되었다. 한 달 뒤 당은 그가 요구한 것과 같은 통일행동협정에 서명했지만 그는 이미 밖에 있었다. 1936년 프랑스인민당(PPF)을 세워 파시즘 쪽으로 옮겨 갔고, 1941년 반볼셰비키 프랑스의용군단에 참여해 독일군복을 입고 동부전선에서 싸웠으며, 1945년 2월 독일에서 연합군 항공기의 기총소사를 맞고 죽었다.$t$,
  $t$A metalworker from Saint-Denis who became a deputy at twenty-six and rose to the executive committee of the Comintern as one of the French Communist Party's young leaders. He was jailed for agitation against the Rif war, sent to China as a Comintern envoy in 1927, and elected mayor of Saint-Denis in 1931. Immediately after the February 1934 crisis he demanded, publicly and ahead of the party line, immediate joint action with the Socialists; he refused a summons to Moscow and was expelled on 27 June. A month later the party signed the very pact of unity of action he had called for, and he was already outside it. In 1936 he founded the Parti Populaire Français and moved toward fascism; in 1941 he helped create the Légion des Volontaires Français against Bolshevism and fought on the Eastern Front in German uniform; he was killed in Germany in February 1945 when Allied aircraft strafed his car.$t$,
  'killed', '독일에서 연합군 항공기의 기총소사로 사망', 'Killed by Allied aircraft strafing in Germany',
  $t$1934년 4월 그는 코민테른에 보낸 공개서한에서 사회당과의 즉각적 공동행동을 요구했다. 6월에 제명되었고, 7월에 당은 그가 요구한 바로 그 협정에 서명했다$t$,
  $t$In April 1934 he sent an open letter to the Comintern demanding immediate joint action with the Socialists. In June he was expelled; in July the party signed the very pact he had demanded$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '자크', 'Jacques', '도리오', 'Doriot'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('jacques-doriot', 'counterrevolution');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('jacques-doriot', 'ko', '도리오', 0),
  ('jacques-doriot', 'en', 'Doriot', 0);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('jacques-doriot', 0, '1898', 1898, 1898, '우아즈 브렐에서 노동자 집안에 출생', 'Born to a working-class family at Bresles in the Oise'),
  ('jacques-doriot', 1, '1915–1922', 1915, 1922, '생드니의 금속노동자, 공산주의 청년운동에 투신', 'Metalworker at Saint-Denis; joins the Communist youth movement'),
  ('jacques-doriot', 2, '1923–1924', 1923, 1924, '공산주의청년인터내셔널 지도부, 1924년 하원의원 당선', 'Leads the Communist Youth International; elected deputy in 1924'),
  ('jacques-doriot', 3, '1925', 1925, 1925, '리프 전쟁 반대 선동으로 투옥', 'Jailed for agitation against the Rif war'),
  ('jacques-doriot', 4, '1927', 1927, 1927, '코민테른 특사로 중국 파견', 'Sent to China as a Comintern envoy'),
  ('jacques-doriot', 5, '1931–1937', 1931, 1937, '생드니 시장', 'Mayor of Saint-Denis'),
  ('jacques-doriot', 6, '1934.02–06', 1934, 1934, '사회당과의 공동행동 공개 요구, 모스크바 소환 거부, 6월 27일 제명', 'Publicly demands joint action with the Socialists, refuses a summons to Moscow, expelled on 27 June'),
  ('jacques-doriot', 7, '1936', 1936, 1936, '프랑스인민당(PPF) 창당', 'Founds the Parti Populaire Français'),
  ('jacques-doriot', 8, '1941–1944', 1941, 1944, '반볼셰비키 프랑스의용군단 참여, 독일군복으로 동부전선 종군', 'Helps found the anti-Bolshevik French volunteer legion; serves on the Eastern Front in German uniform'),
  ('jacques-doriot', 9, '1945.02', 1945, 1945, '독일에서 연합군 항공기의 기총소사로 사망', 'Killed in Germany when Allied aircraft strafe his car');

INSERT INTO commulingo_history_event_people
  (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('february-1934-crisis', 'jean-chiappe', 10, 'participant',
   '해임된 파리 경찰청장', 'The dismissed prefect of police',
   '동맹에 관대하다는 평 속에 2월 3일 물러났고, 우파는 이 해임을 도발로 받아들였다. 사흘 뒤 그가 지키던 광장에서 폭동이 일어났다.',
   'Removed on 3 February amid his reputation for indulgence toward the leagues, a dismissal the right took as a provocation. Three days later the square he had policed erupted.'),
  ('february-1934-crisis', 'francois-de-la-rocque', 11, 'leader',
   '불의 십자단 회장', 'President of the Croix-de-Feu',
   '광장에 나온 가장 큰 조직을 이끌었으나 의사당 돌입 대신 해산을 명령했다. 이 밤이 조직된 쿠데타가 아니었다는 오늘날의 판단은 그의 처신을 주요 근거로 삼는다.',
   'He led the largest organisation on the square and ordered it to disperse rather than storm the Chamber. His conduct is a main ground for the present judgement that the night was not an organised coup.'),
  ('february-1934-crisis', 'jacques-doriot', 12, 'participant',
   '통일행동을 가장 먼저 요구한 PCF 지도자', 'The PCF leader who demanded unity of action first',
   '당론에 앞서 사회당과의 공동행동을 공개로 요구하다 6월에 제명되었고, 한 달 뒤 당은 같은 협정에 서명했다. 두 해 뒤 그는 파시스트 정당을 세운다.',
   'Expelled in June for demanding joint action with the Socialists ahead of the party line, a month before the party signed the same pact. Two years later he founded a fascist party.');

COMMIT;
