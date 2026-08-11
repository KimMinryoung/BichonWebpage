-- Supporting cast of the French Popular Front event (136): Édouard Daladier,
-- Marceau Pivert, Roger Salengro, Léo Lagrange — all four already named in the
-- event body, now given their own dictionary entries and linked back.
-- Daladier is also linked to winter-war (he fell over the failure to aid
-- Finland in March 1940).
--
-- Applied to leninbot-pg on 2026-08-11; committed as a record.

BEGIN;

-- ─── 에두아르 달라디에 ───────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'edouard-daladier', 'foreign-statesmen', 19321093, '', 'Édouard Daladier', '1884–1970', 1884, 1970,
  '에두아르 달라디에', 'Édouard Daladier',
  '인민전선을 함께 세우고 제 손으로 청산한 급진당의 「보클뤼즈의 황소」',
  'The Radicals'' ''Bull of Vaucluse'', who helped build the Popular Front and dismantled it with his own hands',
  $t$빵집 아들 출신의 역사 교사로 급진당을 이끈 정치인. 1934년 2월 6일 폭동 이튿날 총리에서 물러났고, 급진당을 이끌고 인민전선에 참여해 블룸 내각의 국방장관을 지냈다. 1938년 4월 총리로 돌아와 9월 뮌헨 협정에 서명했고, 11월 법령으로 주 40시간제를 해체하고 항의 총파업을 꺾어 인민전선을 끝냈다. 1939년 9월 대독 선전포고를 했고 독소 불가침조약 뒤 공산당을 불법화했으며, 1940년 3월 핀란드 지원 실기의 책임을 지고 실각했다. 비시 정권의 리옴 재판에서 블룸과 나란히 피고석에 섰다가 부헨발트에 억류되었고, 전후 하원에 복귀해 1958년까지 활동했다.$t$,
  $t$A baker's son and history teacher who rose to lead the Radical Party. He resigned as premier the day after the riot of 6 February 1934, then brought the Radicals into the Popular Front and served as Blum's defence minister. Returning as premier in April 1938, he signed the Munich agreement in September, dismantled the 40-hour week by decree in November and broke the protest general strike, ending the Popular Front. He declared war on Germany in September 1939 and banned the Communist Party after the Nazi-Soviet pact, then fell in March 1940 over the failure to aid Finland. Tried alongside Blum at Vichy's Riom trial and interned near Buchenwald, he returned to the Chamber after the war and sat until 1958.$t$,
  'natural', '병사', 'Illness',
  $t$「바보들 같으니. 저들이 무엇에 환호하는지 안다면」, 뮌헨 협정에서 돌아와 부르제 공항의 환호 인파를 보고 측근에게 (동승자들의 증언으로 전하는 말), 1938년 9월 30일$t$,
  $t$'The fools! If only they knew what they are cheering', to an aide on seeing the crowds cheering him at Le Bourget airfield on his return from Munich, 30 September 1938 (as recalled by those who flew with him)$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '에두아르', 'Édouard', '달라디에', 'Daladier'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('edouard-daladier', 'foreign-statesman');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('edouard-daladier', 'ko', '달라디에', 0),
  ('edouard-daladier', 'en', 'Daladier', 0),
  ('edouard-daladier', 'en', 'Edouard Daladier', 1);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('edouard-daladier', 0, '1884–1914', 1884, 1914, '카르팡트라 빵집 아들, 역사 교사', 'Baker''s son from Carpentras; history teacher'),
  ('edouard-daladier', 1, '1914–1918', 1914, 1918, '1차 대전 참전, 사병에서 중위까지', 'Fights the First World War, rising from private to lieutenant'),
  ('edouard-daladier', 2, '1919–1933', 1919, 1933, '급진당 하원의원, 당의 지도자로 부상', 'Radical deputy; rises to lead the party'),
  ('edouard-daladier', 3, '1934.01–02', 1934, 1934, '총리, 2월 6일 폭동 이튿날 사임', 'Premier; resigns the day after the riot of 6 February'),
  ('edouard-daladier', 4, '1936–1937', 1936, 1937, '블룸 인민전선 내각의 국방장관', 'Defence minister in Blum''s Popular Front cabinet'),
  ('edouard-daladier', 5, '1938.04–09', 1938, 1938, '총리 복귀, 뮌헨 협정 서명', 'Returns as premier; signs the Munich agreement'),
  ('edouard-daladier', 6, '1938.11', 1938, 1938, '법령으로 40시간제 해체, 총파업 진압으로 인민전선 청산', 'Dismantles the 40-hour week by decree and breaks the general strike'),
  ('edouard-daladier', 7, '1939.09', 1939, 1939, '대독 선전포고, 독소 불가침조약 뒤 공산당 불법화', 'Declares war on Germany; bans the Communist Party after the Nazi-Soviet pact'),
  ('edouard-daladier', 8, '1940.03', 1940, 1940, '핀란드 지원 실기의 책임으로 실각', 'Falls over the failure to aid Finland'),
  ('edouard-daladier', 9, '1942–1945', 1942, 1945, '리옴 재판 피고, 부헨발트 인근 억류', 'Defendant at the Riom trial; interned near Buchenwald'),
  ('edouard-daladier', 10, '1946–1958', 1946, 1958, '하원 복귀, 급진당 원로', 'Returns to the Chamber; elder of the Radical Party'),
  ('edouard-daladier', 11, '1970.10', 1970, 1970, '파리에서 사망', 'Dies in Paris');

-- ─── 마르소 피베르 ───────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'marceau-pivert', 'international-revolutionary', 19321094, '', 'Marceau Pivert', '1895–1958', 1895, 1958,
  '마르소 피베르', 'Marceau Pivert',
  '「모든 것이 가능하다」를 쓴 사회당 좌파, 인민전선의 왼쪽 경계',
  'The Socialist left''s tribune who wrote ''Everything is possible'', the Popular Front''s left frontier',
  $t$교사 출신의 사회당(SFIO) 좌파 지도자. 1935년 당내 분파 「혁명적 좌익」을 결성해 인민전선을 지지하되 그 너머의 혁명적 출구를 주장했고, 1936년 5월 파업이 절정으로 치닫던 때 『르 포퓔레르』에 「모든 것이 가능하다」를 실어 논쟁의 한복판에 섰다. 블룸 총리실의 공보 업무를 맡으면서도 급진화를 멈추지 않았고, 1938년 당에서 제명되자 노동자농민사회당(PSOP)을 세웠다. 전쟁 중 멕시코에 망명했고, 전후 SFIO에 복귀해 죽을 때까지 당내 좌파와 반식민주의 진영에 섰다.$t$,
  $t$A schoolmaster who became the leader of the Socialist SFIO's left. In 1935 he founded the Revolutionary Left tendency, supporting the Popular Front while arguing for a revolutionary way beyond it, and at the height of the strikes in May 1936 he planted himself at the centre of the argument with 'Everything is possible' in Le Populaire. He ran the premier's press service under Blum without ceasing to radicalize, and when the party expelled him in 1938 he founded the Workers' and Peasants' Socialist Party (PSOP). Exiled in Mexico during the war, he returned to the SFIO afterward and stood on its left and in the anticolonial camp until his death.$t$,
  'natural', '병사', 'Illness',
  $t$「모든 것이 가능하다」, 파업이 절정으로 치닫던 때 『르 포퓔레르』 1면에 실은 기고의 제목이자 결론, 1936년 5월 27일$t$,
  $t$'Everything is possible', the title and the conclusion of his front-page article in Le Populaire as the strikes surged, 27 May 1936$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '마르소', 'Marceau', '피베르', 'Pivert'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('marceau-pivert', 'non-soviet-revolutionary');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('marceau-pivert', 'ko', '피베르', 0),
  ('marceau-pivert', 'en', 'Pivert', 0);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('marceau-pivert', 0, '1895–1914', 1895, 1914, '센에마른의 교사 집안, 사범학교를 나와 교사가 됨', 'Teacher''s family in Seine-et-Marne; trained and worked as a schoolmaster'),
  ('marceau-pivert', 1, '1914–1918', 1914, 1918, '1차 대전 참전, 전쟁이 그를 반군국주의자로 만듦', 'The war turns him into an antimilitarist'),
  ('marceau-pivert', 2, '1924–1935', 1924, 1935, 'SFIO 파리 연맹과 교원노조 운동', 'SFIO Paris federation; teachers'' union activist'),
  ('marceau-pivert', 3, '1935', 1935, 1935, '당내 분파 「혁명적 좌익」 결성', 'Founds the Revolutionary Left tendency inside the SFIO'),
  ('marceau-pivert', 4, '1936.05', 1936, 1936, '「모든 것이 가능하다」 기고', 'Publishes ''Everything is possible'''),
  ('marceau-pivert', 5, '1936–1937', 1936, 1937, '블룸 총리실의 공보 업무 책임', 'Runs the premier''s press and information service'),
  ('marceau-pivert', 6, '1938', 1938, 1938, '제명 뒤 노동자농민사회당(PSOP) 창당', 'Expelled; founds the Workers'' and Peasants'' Socialist Party'),
  ('marceau-pivert', 7, '1940–1946', 1940, 1946, '멕시코 망명', 'Exile in Mexico'),
  ('marceau-pivert', 8, '1946–1958', 1946, 1958, 'SFIO 복귀, 당내 좌파와 반식민주의 진영에서 활동', 'Returns to the SFIO; on its left and in the anticolonial camp'),
  ('marceau-pivert', 9, '1958.06', 1958, 1958, '파리에서 사망', 'Dies in Paris');

-- ─── 로제 살랑그로 ───────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'roger-salengro', 'foreign-statesmen', 19321095, '', 'Roger Salengro', '1890–1936', 1890, 1936,
  '로제 살랑그로', 'Roger Salengro',
  '극우 언론의 중상에 목숨으로 답한 인민전선의 내무장관',
  'The Popular Front''s interior minister, hounded to death by the far-right press',
  $t$릴 시장 출신의 사회당 정치인으로 블룸 내각의 내무장관. 1936년 6월 파업 국면에서 점거 공장에 대한 강제 해산을 거부했고, 인민전선 강령의 첫 항목이던 극우 동맹 해산을 집행했다. 극우 주간지 『그랭구아르』가 1차 대전 중 탈영했다는 날조 기사를 퍼붓자 군 명예심사와 하원의 압도적 표결이 거듭 무고를 확인했지만 캠페인은 멈추지 않았고, 그는 11월 17일 릴의 자택에서 스스로 목숨을 끊었다. 장례에는 수십만이 모였고, 그의 죽음은 언론의 명예훼손을 규제하는 입법 논의를 촉발했다.$t$,
  $t$A Socialist politician, mayor of Lille, and Blum's interior minister. In the strike wave of June 1936 he refused to clear the occupied factories by force, and he carried out the dissolution of the far-right leagues, the first item of the Popular Front programme. When the far-right weekly Gringoire barraged him with a fabricated story of desertion in the First World War, a military court of honour and an overwhelming vote of the Chamber cleared him twice over; the campaign did not stop, and on 17 November he took his own life at his home in Lille. Hundreds of thousands came to his funeral, and his death set off the debate on legislating against press defamation.$t$,
  'suicide', '자살', 'Suicide',
  '', '',
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '로제', 'Roger', '살랑그로', 'Salengro'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('roger-salengro', 'foreign-statesman');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('roger-salengro', 'ko', '살랑그로', 0),
  ('roger-salengro', 'en', 'Salengro', 0);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('roger-salengro', 0, '1890–1914', 1890, 1914, '릴의 사회주의 학생운동, 당 기관지 기자', 'Socialist student politics in Lille; party journalist'),
  ('roger-salengro', 1, '1914–1918', 1914, 1918, '전우의 시신을 수습하러 나갔다 포로가 되어 독일 수용소 억류', 'Captured retrieving a comrade''s body; German prison camps'),
  ('roger-salengro', 2, '1925–1936', 1925, 1936, '릴 시장', 'Mayor of Lille'),
  ('roger-salengro', 3, '1928–1936', 1928, 1936, '하원의원, 사회당 노르 연맹 지도자', 'Deputy; leader of the SFIO''s Nord federation'),
  ('roger-salengro', 4, '1936.06', 1936, 1936, '내무장관, 점거 공장 강제 해산 거부와 극우 동맹 해산 집행', 'Interior minister: no force against the occupations; dissolves the leagues'),
  ('roger-salengro', 5, '1936.07–11', 1936, 1936, '『그랭구아르』의 탈영 날조 캠페인, 군 심사와 하원 표결로 거듭 무고 확인', 'Gringoire''s fabricated desertion campaign; cleared by a court of honour and the Chamber'),
  ('roger-salengro', 6, '1936.11.17', 1936, 1936, '릴 자택에서 자살, 장례에 수십만 추모', 'Takes his life in Lille; vast crowds at his funeral');

-- ─── 레오 라그랑주 ───────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'leo-lagrange', 'foreign-statesmen', 19321096, '', 'Léo Lagrange', '1900–1940', 1900, 1940,
  '레오 라그랑주', 'Léo Lagrange',
  '노동자의 첫 휴가를 설계한 여가·스포츠 차관',
  'The undersecretary for leisure and sport who designed the workers'' first holidays',
  $t$변호사 출신의 사회당 하원의원으로, 블룸 정부가 세계 최초로 만든 여가·스포츠 담당 차관직을 맡았다. 국철 40% 할인 「인민 티켓」과 유스호스텔 확충, 대중 스포츠 자격증으로 1936년 여름 60만 명의 생애 첫 유급휴가를 조직했고, 여가 정책을 노동자에게 존엄을 돌려주는 일로 정의했다. 1939년 동원을 자원해 1940년 6월 9일 엔 강 전선에서 포탄에 맞아 전사했다. 오늘날 프랑스 전역의 수천 개 경기장과 체육관이 그의 이름을 달고 있다.$t$,
  $t$A lawyer and Socialist deputy who took the post the Blum government created first in the world: undersecretary for leisure and sport. With the railways' 40-per-cent-discount 'popular tickets', a boom in youth hostels and a popular sports certificate, he organized 600,000 first paid holidays in the summer of 1936, defining leisure policy as the restoration of dignity to workers. Volunteering for service in 1939, he was killed by shellfire on the Aisne front on 9 June 1940. Thousands of stadiums and gymnasiums across France carry his name today.$t$,
  'killed', '전사', 'Killed in action',
  $t$「우리의 단순하고 인간적인 목표는 프랑스의 청년 대중이 스포츠에서 기쁨과 건강을 찾게 하고, 노동자들의 여가를 조직해 그들이 되찾은 삶의 기쁨과 존엄을 누리게 하는 것이다」, 차관 취임 라디오 연설, 1936년 6월 10일$t$,
  $t$'Our simple and human aim is to let the mass of French youth find joy and health in sport, and to organize the leisure of the workers so that they may enjoy the joy of life and the dignity regained', radio address on taking office, 10 June 1936$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '레오', 'Léo', '라그랑주', 'Lagrange'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('leo-lagrange', 'foreign-statesman');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('leo-lagrange', 'ko', '라그랑주', 0),
  ('leo-lagrange', 'en', 'Lagrange', 0),
  ('leo-lagrange', 'en', 'Leo Lagrange', 1);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('leo-lagrange', 0, '1900–1932', 1900, 1932, '노르 출신, 파리에서 변호사', 'From the Nord; lawyer in Paris'),
  ('leo-lagrange', 1, '1932–1940', 1932, 1940, '사회당 하원의원', 'Socialist deputy'),
  ('leo-lagrange', 2, '1936.06', 1936, 1936, '세계 첫 여가·스포츠 담당 차관', 'The world''s first undersecretary for leisure and sport'),
  ('leo-lagrange', 3, '1936', 1936, 1936, '「인민 티켓」으로 60만 명의 생애 첫 휴가 조직', '600,000 first holidays on the discounted ''popular tickets'''),
  ('leo-lagrange', 4, '1936–1938', 1936, 1938, '유스호스텔 확충, 대중 스포츠 자격증(BSP) 창설', 'Youth hostels; creates the popular sports certificate'),
  ('leo-lagrange', 5, '1939–1940', 1939, 1940, '동원 자원, 1940년 6월 9일 엔 전선에서 전사', 'Volunteers for service; killed on the Aisne front, 9 June 1940');

-- ─── 사건 연결 ───────────────────────────────────────────────
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('french-popular-front', 'edouard-daladier', 8, 'participant', '급진당 지도자, 블룸 내각의 국방장관', 'Radical leader; Blum''s defence minister',
   '2월 폭동으로 물러난 총리이자 인민전선 연합의 우측 기둥. 1938년 총리로 돌아와 11월 법령과 총파업 진압으로 인민전선을 제 손으로 끝냈다.',
   'The premier toppled by the February riot and the right-hand pillar of the coalition; back as premier in 1938, he ended the Popular Front himself with the November decrees and the breaking of the general strike.'),
  ('french-popular-front', 'roger-salengro', 9, 'target', '내무장관, 극우 언론전의 표적', 'Interior minister, target of the far-right press war',
   '점거 공장의 강제 해산을 거부하고 극우 동맹 해산을 집행했으며, 『그랭구아르』의 탈영 날조 캠페인에 몰려 1936년 11월 스스로 목숨을 끊었다.',
   'He refused to clear the occupied factories by force and dissolved the leagues, then was hounded to suicide in November 1936 by Gringoire''s fabricated desertion campaign.'),
  ('french-popular-front', 'leo-lagrange', 10, 'participant', '여가·스포츠 담당 차관', 'Undersecretary for leisure and sport',
   '「인민 티켓」과 유스호스텔로 그해 여름 60만 명의 생애 첫 유급휴가를 조직했다.',
   'With the ''popular tickets'' and the youth hostels he organized 600,000 first paid holidays that summer.'),
  ('french-popular-front', 'marceau-pivert', 11, 'participant', '사회당 좌파 「혁명적 좌익」 지도자', 'Leader of the SFIO''s Revolutionary Left',
   '파업 절정에서 「모든 것이 가능하다」를 썼고, 인민전선의 왼쪽 경계에서 혁명적 출구를 주장하다 1938년 당에서 제명됐다.',
   'At the strikes'' height he wrote ''Everything is possible'', and argued for a revolutionary way out on the Popular Front''s left frontier until his expulsion in 1938.'),
  ('winter-war', 'edouard-daladier', 48, 'participant', '핀란드 지원을 추진하다 실각한 프랑스 총리', 'French premier who fell over aid to Finland',
   '영불 원정군 파견을 추진했으나 때를 놓쳤고, 1940년 3월 핀란드 강화 직후 그 책임론으로 물러났다.',
   'He pressed for an Anglo-French expedition but missed the moment, and resigned over it in March 1940, just after Finland made peace.');

COMMIT;
