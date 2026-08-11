-- The French Popular Front and the strikes of 1936: one history event
-- (sort_order 78, between Holodomor and the Spanish civil war), two people
-- (Léon Blum, Léon Jouhaux), three glossary terms (popular-front,
-- matignon-agreements, sit-down-strike), and the cross-links between them.
--
-- The bare aliases 인민전선 / Popular Front / Popular Fronts / People's Front
-- move from popular-fronts-ussr (the perestroika-era item) to the new generic
-- popular-front term; the USSR item keeps its specific aliases (라흐바린네,
-- 국민전선, Rahvarinne …) and the two items point at each other through
-- commulingo_term_relations.
--
-- Jouhaux deliberately gets no bare 주오 Korean alias: the people linkifier
-- would mis-link 「나를 기다려 주오」 (Simonov) and 주오스트리아 대사 (Ilyichev).
--
-- Applied to leninbot-pg on 2026-08-11; committed as a record.

BEGIN;

-- ─── 레옹 블룸 ───────────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'leon-blum', 'foreign-statesmen', 19321091, '', 'Léon Blum', '1872–1950', 1872, 1950,
  '레옹 블룸', 'Léon Blum',
  '유급휴가와 주 40시간제를 남긴 프랑스 최초의 사회주의자 총리',
  'France''s first Socialist prime minister, who left behind paid holidays and the 40-hour week',
  $t$드레퓌스 사건으로 정치에 들어와 1920년 투르 대회에서 다수파의 코민테른 가입에 맞서 사회당(SFIO)의 「낡은 집」을 지킨 지도자. 1936년 인민전선 정부의 총리로 마티뇽 협정을 중재하고 2주 유급휴가와 주 40시간제를 입법했으며, 프랑스 최초의 사회주의자 총리이자 최초의 유대인 총리로서 극우의 표적이 되었다. 1940년 페탱 전권 위임에 반대한 80인 중 한 명으로 비시 정권의 리옴 재판에서 피고석을 인민전선 변호의 연단으로 바꾸었고, 부헨발트 억류에서 살아 돌아와 1946년 말 과도정부 총리를 지냈다.$t$,
  $t$A literary critic drawn into politics by the Dreyfus affair, he kept the Socialist SFIO's 'old house' standing at the 1920 Congress of Tours when the majority left to found the Communist Party. As prime minister of the 1936 Popular Front government he brokered the Matignon Agreements and enacted two weeks of paid holidays and the 40-hour week, becoming France's first Socialist and first Jewish head of government and a target of the far right. One of the eighty parliamentarians who voted against full powers for Pétain in 1940, he turned Vichy's Riom trial into a platform for defending the Popular Front, survived internment near Buchenwald, and briefly headed a caretaker government in late 1946.$t$,
  'natural', '심장질환으로 사망', 'Heart failure',
  $t$「집권하는 동안 나는 집무실을 거의 떠나지 못했다. 그러나 밖에 나가 파리 교외를 지나며 고물 자동차와 오토바이와 2인승 자전거의 행렬을, 맞춰 입은 스웨터 차림의 노동자 부부들을 보았을 때, 그래도 내가 어렵고 어두운 삶들에 일종의 갠 하늘을, 한 줄기 트임을 들여놓았다는 느낌을 받았다」, 리옴 재판 진술, 1942년 3월$t$,
  $t$'I rarely left my desk while in power; but whenever I went out and crossed the Paris suburbs and saw the roads covered with processions of jalopies, motorcycles and tandems, with working-class couples in matching pullovers, I had the feeling that, despite everything, I had brought a kind of clearing, a break in the clouds, into difficult and obscure lives', statement at the Riom trial, March 1942$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '레옹', 'Léon', '블룸', 'Blum'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('leon-blum', 'foreign-statesman');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('leon-blum', 'ko', '블룸', 0),
  ('leon-blum', 'en', 'Blum', 0),
  ('leon-blum', 'en', 'Leon Blum', 1);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('leon-blum', 0, '1894–1906', 1894, 1906, '국사원 법관이자 문예비평가, 드레퓌스 사건을 계기로 조레스를 따라 사회주의 운동에 입문', 'Conseil d''État jurist and literary critic; the Dreyfus affair draws him to Jaurès and socialism'),
  ('leon-blum', 1, '1914–1919', 1914, 1919, '전시 사회당 각료 비서실장, 종전 후 하원의원 당선', 'Chef de cabinet to a Socialist minister in the war government; elected deputy in 1919'),
  ('leon-blum', 2, '1920.12', 1920, 1920, '투르 대회에서 다수파의 코민테른 가입에 맞서 「낡은 집」 사수 연설', 'At the Congress of Tours, keeps ''the old house'' as the majority founds the Communist Party'),
  ('leon-blum', 3, '1921–1936', 1921, 1936, 'SFIO 재건, 『르 포퓔레르』 주필, 원내 지도자', 'Rebuilds the SFIO; political director of Le Populaire; parliamentary leader'),
  ('leon-blum', 4, '1936.02', 1936, 1936, '왕당파 행동대 카믈로 뒤 루아에게 폭행당해 중상', 'Beaten nearly to death by the royalist Camelots du Roi'),
  ('leon-blum', 5, '1936.06–1937.06', 1936, 1937, '인민전선 정부 총리, 마티뇽 협정·유급휴가·주 40시간제', 'Prime minister of the Popular Front: Matignon Agreements, paid holidays, the 40-hour week'),
  ('leon-blum', 6, '1938.03–04', 1938, 1938, '제2차 블룸 내각, 상원의 벽에 다시 막혀 한 달 만에 붕괴', 'Second Blum government collapses within a month against the Senate'),
  ('leon-blum', 7, '1940.07', 1940, 1940, '비시에서 페탱 전권 위임에 반대표를 던진 80인 중 한 명', 'One of the eighty who vote against full powers for Pétain at Vichy'),
  ('leon-blum', 8, '1942–1945', 1942, 1945, '리옴 재판에서 인민전선을 변호, 이후 부헨발트 인근 특별수용소 억류', 'Defends the Popular Front at the Riom trial; interned in a special camp near Buchenwald'),
  ('leon-blum', 9, '1946.12–1947.01', 1946, 1947, '과도정부 총리, 전후 재건과 미국 차관 교섭(블룸-번스 협정)', 'Heads the caretaker government; postwar reconstruction and the Blum-Byrnes loan agreement'),
  ('leon-blum', 10, '1950.03', 1950, 1950, '주이앙조자스에서 사망', 'Dies at Jouy-en-Josas');

-- ─── 레옹 주오 ───────────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'leon-jouhaux', 'international-revolutionary', 19321092, '', 'Léon Jouhaux', '1879–1954', 1879, 1954,
  '레옹 주오', 'Léon Jouhaux',
  '31년간 CGT를 이끌고 마티뇽 협정에 서명한 생디칼리스트, 노벨 평화상 수상자',
  'The syndicalist who led the CGT for 31 years, signed the Matignon Agreements and won the Nobel Peace Prize',
  $t$성냥 공장 노동자 출신으로 1909년 서른 살에 노동총동맹(CGT) 사무총장이 되어 1940년까지 이끈 프랑스 노동운동의 얼굴. 혁명적 생디칼리슴에서 출발했으나 1914년 신성동맹을 받아들이며 개혁주의로 옮겨 갔고, 베르사유 조약의 노동 조항 기초와 국제노동기구(ILO) 창설에 참여했다. 1936년 재통합된 CGT를 이끌고 마티뇽 협정에 서명했으며, 비시 정권 아래 억류되어 독일로 이송되었다가 살아 돌아와 1948년 공산당 주도의 CGT에서 갈라져 나온 「노동자의 힘」(FO)의 창립 의장이 되었고 1951년 노벨 평화상을 받았다.$t$,
  $t$A match-factory worker who became secretary-general of the CGT at thirty in 1909 and led it until 1940, the public face of French trade unionism. Starting as a revolutionary syndicalist, he moved to reformism when he accepted the union sacrée in 1914, helped draft the labour clauses of the Versailles Treaty and co-found the International Labour Organization. He led the reunified CGT into the Matignon Agreements in 1936, was interned under Vichy and deported to Germany, and after the war became founding president of Force Ouvrière, the 1948 breakaway from the communist-led CGT, receiving the Nobel Peace Prize in 1951.$t$,
  'natural', '병사', 'Illness',
  $t$「노동운동의 역사에서 이보다 큰 승리는 없었다」, 마티뇽 협정 타결 직후 라디오 연설에서, 1936년 6월$t$,
  $t$'The labour movement has never won a greater victory', radio address just after the conclusion of the Matignon Agreements, June 1936$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '레옹', 'Léon', '주오', 'Jouhaux'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('leon-jouhaux', 'non-soviet-revolutionary');

-- 성 단독 별칭 「주오」는 「나를 기다려 주오」·「주오스트리아」 오연결 때문에 넣지 않는다
INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('leon-jouhaux', 'en', 'Jouhaux', 0),
  ('leon-jouhaux', 'en', 'Leon Jouhaux', 1);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('leon-jouhaux', 0, '1895–1906', 1895, 1906, '오베르빌리에 성냥 공장 노동자, 아버지를 실명시킨 백린에 맞선 파업으로 해고', 'Match-factory worker at Aubervilliers; sacked for striking against the white phosphorus that blinded his father'),
  ('leon-jouhaux', 1, '1909–1940', 1909, 1940, '노동총동맹(CGT) 사무총장', 'Secretary-general of the CGT'),
  ('leon-jouhaux', 2, '1914.08', 1914, 1914, '반전 총파업 노선을 접고 「신성동맹」 수용, 조레스 장례식에서 연설', 'Abandons the antiwar general strike for the union sacrée; speaks at Jaurès''s funeral'),
  ('leon-jouhaux', 3, '1919–1921', 1919, 1921, '베르사유 조약 노동 조항 기초, ILO 창설 참여; CGT 분열로 혁명파가 CGTU로 이탈', 'Helps draft the Versailles labour clauses and found the ILO; the CGT''s revolutionary wing splits off as the CGTU'),
  ('leon-jouhaux', 4, '1936.03–06', 1936, 1936, '재통합 CGT를 이끌고 마티뇽 협정 서명, 조합원 100만에서 400만으로', 'Leads the reunified CGT into the Matignon Agreements; membership soars from one to four million'),
  ('leon-jouhaux', 5, '1940–1945', 1940, 1945, '비시 정권의 CGT 해산 뒤 가택연금, 1943년 독일 이송·억류', 'CGT dissolved by Vichy; house arrest, then deported to Germany in 1943'),
  ('leon-jouhaux', 6, '1947–1948', 1947, 1948, '공산당 주도 CGT와 재분열, 「노동자의 힘」(FO) 창립 의장', 'Breaks with the communist-led CGT; founding president of Force Ouvrière'),
  ('leon-jouhaux', 7, '1947–1954', 1947, 1954, '프랑스 경제이사회 의장, 1951년 노벨 평화상 수상', 'President of the French Economic Council; Nobel Peace Prize, 1951'),
  ('leon-jouhaux', 8, '1954.04', 1954, 1954, '파리에서 사망', 'Dies in Paris');

COMMIT;
BEGIN;

INSERT INTO commulingo_history_events (
  id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
  summary_ko, summary_en, outcome_ko, outcome_en, body_ko, body_en, timeline, sources
) VALUES (
  'french-popular-front', 78, '1934–1938',
  '프랑스 인민전선과 1936년 총파업',
  'The French Popular Front and the Strikes of 1936',
  '파시즘의 위협은 어떻게 어제의 적들을 한 줄에 세웠고, 200만 노동자가 공장을 점거한 한 달은 무엇을 얻고 무엇을 얻지 못했는가?',
  'How did the fascist threat line up yesterday''s enemies side by side, and what did a month of two million workers occupying their factories win, and fail to win?',
  $s$1934년 2월 극우 동맹들의 폭동을 계기로 사회당·공산당·급진당이 결성한 인민전선은 1936년 5월 총선에서 승리해 레옹 블룸의 정부를 세웠다. 승리와 취임 사이의 공백기에 프랑스 역사상 최대의 파업이 터졌다. 6월 한 달에만 파업 12,142건에 참가자 183만 명, 그 4분의 3이 공장을 점거한 채 기계 옆에서 먹고 자는 새로운 방식의 파업이었다. 6월 7일 밤 마티뇽 협정으로 사용자들은 임금 인상과 단체협약, 노조 활동의 자유를 한꺼번에 내주었고, 의회는 곧바로 2주 유급휴가와 주 40시간제를 입법했다. 그러나 스페인 불개입과 프랑 평가절하, 개혁의 「휴지기」를 거치며 연합은 안에서부터 무너졌고, 1938년 11월 총파업의 패배로 인민전선 시대는 막을 내렸다.$s$,
  $s$Formed by Socialists, Communists and Radicals after the far-right leagues' riot of February 1934, the Popular Front won the elections of May 1936 and brought Léon Blum to power. In the interval between victory and taking office, the greatest strike wave in French history erupted: 12,142 strikes with 1.83 million participants in June alone, three quarters of them a new kind of strike in which workers occupied their factories, eating and sleeping beside the machines. In the Matignon Agreements of the night of 7 June, employers conceded wage rises, collective bargaining and union rights all at once, and parliament immediately legislated two weeks of paid holidays and the 40-hour week. But through non-intervention in Spain, the devaluation of the franc and the 'pause' in reform, the coalition crumbled from within, and the defeat of the general strike of November 1938 closed the Popular Front era.$s$,
  $s$인민전선 정부 자체는 2년을 채 버티지 못했고 40시간제는 1938년의 법령들로 해체되었지만, 유급휴가·단체협약·노동자 대표 제도는 프랑스 노동법의 골격으로 살아남아 1944년 레지스탕스 전국평의회 강령과 전후 사회보장으로 이어졌다. 코민테른에는 프랑스가 인민전선 노선의 첫 실험장이자 진열장이었고, 그 성공과 한계는 같은 해 스페인에서의 개입 노선에 그대로 투영되었다. 파시즘에 맞선 방벽이었는가, 의회의 틀에 갇혀 버린 혁명이었는가라는 당대의 논쟁은 지금도 1936년 6월을 읽는 두 축으로 남아 있다.$s$,
  $s$The Popular Front government itself lasted barely two years, and the 40-hour week was dismantled by decree in 1938; but paid holidays, collective agreements and workers' delegates survived as the skeleton of French labour law, feeding into the 1944 programme of the National Council of the Resistance and postwar social security. For the Comintern, France was the first laboratory and the showcase of the popular-front line, and its successes and limits were projected directly onto the intervention in Spain that same year. Whether it was a rampart against fascism or a revolution caged in parliamentary form, the argument of the time remains the two axes along which June 1936 is still read.$s$,
  $b$## 광장의 폭동에서 하나의 선서로

1934년 2월 6일 저녁, 악시옹 프랑세즈와 불의 십자단을 비롯한 극우 동맹들이 하원 의사당을 향해 행진했다. 경찰이 콩코르드 광장에서 발포해 15명이 죽고 1,500명 넘게 다쳤으며, 급진당 총리 달라디에는 이튿날 사임했다. 폭동 자체는 조직된 쿠데타가 아니었다는 것이 오늘날 연구의 대체적인 결론이지만, 당시 좌파는 이것을 프랑스판 파시즘의 총연습으로 읽었다. 독일에서 히틀러가 집권한 지 1년, 사회민주당과 공산당이 서로를 주적으로 부르다 각개격파당한 기억이 생생할 때였다.

응답은 아래로부터 왔다. 2월 12일 CGT가 부른 총파업 날, 사회당과 공산당은 따로 행진을 시작했으나 나시옹 광장에서 두 대열이 만나자 노동자들은 「단결!」을 외치며 서로 껴안았다. 지도부의 협정은 그 다섯 달 뒤였다. 7월 27일 사회당과 공산당이 통일행동협정에 서명했고, 10월 낭트에서 토레즈는 연합을 급진당까지 넓히자며 「노동과 자유와 평화의 인민전선」이라는 이름을 처음 내놓았다. 코민테른 상부가 주저하는 동안 프랑스 지부가 앞서 나간 이 순서는 이듬해 8월 코민테른 제7차 대회에서 디미트로프의 보고로 추인되어 세계 공산주의 운동의 공식 노선이 된다.

1935년 5월 프랑스-소련 상호원조조약이 서명되고 스탈린이 「프랑스의 국방 노력을 완전히 이해하고 승인한다」고 선언하자, 반군국주의를 정체성으로 삼아 온 프랑스공산당은 하루아침에 국방 예산 반대를 접었다. 파리 거리에 「스탈린이 옳다」라는 당의 포스터가 붙었다. 7월 14일 혁명기념일에는 50만 명이 파리에서 행진하며 인민연합의 선서를 낭독했다. 빵과 평화와 자유, 동맹들의 해산, 공화국의 방어가 그 내용이었다.

## 「빵, 평화, 자유」: 온건한 강령, 선명한 승리

1936년 1월 발표된 인민전선 강령은 혁명 강령이 아니었다. 파시스트 동맹 해산, 프랑스은행 개혁, 공공사업, 곡가 지지, 군수산업 국유화, 주 40시간제의 검토가 골자였고, 사회주의로의 이행을 말하는 조항은 없었다. 급진당이 받아들일 수 있는 선이 상한선이었기 때문이다. 블룸 자신이 이것을 권력의 「정복」이 아니라 「행사」라고 못박았다. 자본주의의 틀 안에서, 합법성의 틀 안에서, 위임받은 만큼만 하겠다는 것이었다.

4월 26일과 5월 3일의 총선에서 인민전선은 608석 중 386석을 얻었다. 사회당이 147석으로 사상 처음 제1당이 되었고 공산당은 10석에서 72석으로 뛰었으며 급진당은 오히려 줄었다. 좌파 전체의 득표 증가는 완만했지만 표의 이동은 왼쪽으로 선명했다. 공산당은 각료를 내지 않고 밖에서 지지하는 길을 택했다. 토레즈는 입각이 「공포를 부추길 것」이라 했고 모스크바의 판단도 같았다.

승리와 취임 사이에는 한 달의 공백이 있었다. 헌정 관행상 블룸은 6월 초까지 기다려야 했고, 그 한 달을 채운 것은 의회가 아니라 공장이었다.

## 기계 옆에서 잠드는 파업

5월 11일 르아브르의 브레게 항공기 공장에서 노동자들이 공장 안에 눌러앉았다. 메이데이에 파업했다는 이유로 해고된 동료 두 명의 복직을 요구한 점거는 하루 만에 이겼다. 툴루즈의 라테코에르와 쿠르브부아의 블로크가 뒤따랐고, 5월 28일에는 비양쿠르의 르노에서 3만 3천 명이 기계를 세웠다. 6월 첫 주에 파업은 금속을 넘어 백화점과 카페, 보험사와 농장으로 번졌다. 노동부 통계로 6월 한 달 파업 12,142건에 참가자 183만 명, 그중 8,941건이 점거 파업이었다.

점거는 이 파업의 발명품이었다. 공장 안에 머무름으로써 대체 인력 투입을 막았고, 기계를 지킴으로써 파괴자라는 비난을 차단했다. 그리고 그 안에서 노동자들은 무도회를 열고 아코디언을 연주했다. 르노 공장에서 일했던 시몬 베유는 이 「순수한 기쁨」을 기록했다. 명령에 쫓기지 않고, 고개를 숙이지 않고, 자기가 일하는 자리를 자기 발로 걸어 다니는 기쁨이었다. 파업은 지도부가 조직한 것이 아니었다. CGT도 공산당도 파업의 뒤를 쫓아갔고, 트로츠키는 6월 9일 「프랑스 혁명이 시작되었다」고 썼으며, 사회당 좌파의 피베르는 「모든 것이 가능하다」고 썼다. 공산당 기관지는 모든 것이 가능하지는 않다고 답했다.

6월 4일 밤 블룸이 내각을 구성했다. 프랑스 최초의 사회주의자 총리이자 최초의 유대인 총리였고, 여성에게 투표권이 없던 나라에서 여성 차관 세 명을 앉힌 내각이었다. 우파 의원 그자비에 발라는 의사당에서 「이 오래된 갈로로마의 나라가 처음으로 유대인의 통치를 받게 되었다」고 말했다. 취임 사흘 뒤인 6월 7일 밤 총리 관저 오텔 마티뇽에서 경영자총연합과 CGT가 마주 앉았고, 다음 날 새벽까지 이어진 협상에서 사용자들은 임금 7~15% 인상, 단체협약, 노조 활동의 자유, 노동자 대표 제도를 한꺼번에 내주었다. 주오는 이것을 노동운동 역사상 최대의 승리라 불렀고, 협상장의 사용자 대표들은 공장을 돌려받는 값이라 여겼다.

의회는 6월 11일 2주 유급휴가법을 563 대 1로, 12일 주 40시간제를 통과시켰다. 11일 저녁 토레즈는 파리의 당 활동가들 앞에서 「요구가 관철되었으면 파업을 끝낼 줄도 알아야 한다」고 말했다. 아직 모든 것이 가능하지는 않다는 것이었다. 공산당의 무게가 복귀 쪽에 실리면서 점거는 6월 말까지 차례로 풀렸다.

## 첫 휴가와 첫 후퇴

그해 여름 60만 명이 국철의 40% 할인 「인민 티켓」으로 생애 첫 휴가를 떠났다. 여가·스포츠 담당 차관 레오 라그랑주가 만든 제도였다. 유스호스텔이 두 해 만에 열 배로 늘었고 해변은 처음으로 노동자의 것이 되었다. 훗날 블룸이 리옴 법정에서 자기 정부의 업적으로 꼽은 것도 국유화나 임금이 아니라 어렵고 어두운 삶들에 들여놓은 「한 줄기 갠 하늘」이었다.

후퇴는 여름부터 시작되었다. 7월 스페인에서 군부 반란이 일어나자 블룸은 처음에 공화국 정부를 돕고자 했으나, 영국의 압력과 급진당의 반대, 내전이 프랑스로 번질 공포 앞에서 8월 불개입 정책으로 돌아섰다. 공산당은 「스페인에 대포와 비행기를」 캠페인으로 맞섰고 연합의 안쪽에서 금이 가기 시작했다. 9월에는 하지 않겠다고 약속했던 프랑 평가절하를 해야 했다. 자본은 이미 국경을 넘고 있었다. 11월에는 극우 동맹 해산을 집행한 내무장관 살랑그로가 극우 주간지의 날조 보도에 몰려 스스로 목숨을 끊었다.

1937년 2월 블룸은 개혁의 「휴지기」를 선언했다. 3월 클리시에서 경찰이 반파시즘 시위대에 발포해 5명이 죽자 지지자들의 신뢰도 흔들렸다. 6월 상원이 재정 전권을 거부하자 블룸은 싸우는 대신 물러났다. 1938년 3월의 2차 내각은 한 달을 못 갔고, 4월에 들어선 달라디에 정부는 11월의 법령들로 40시간제를 사실상 해체했다. CGT가 11월 30일 항의 총파업으로 답했으나 실패했고 수천 명이 해고되었다. 인민전선은 그렇게 끝났다.

## 1936년 6월을 어떻게 읽을 것인가

당대의 논쟁이 그대로 사학사의 논쟁이 되었다. 트로츠키에게 1936년 6월은 시작된 혁명이었고, 인민전선은 그것을 의회의 틀에 가두어 죽인 계급협조의 기계였다. 반대편에서 보면 인민전선은 프랑스에서 파시즘의 길을 막고 민주주의를 지킨 방벽이었으며, 마티뇽의 성과는 혁명 없이 얻어 낸 것 가운데 가장 큰 것이었다. 잭슨을 비롯한 연구자들은 두 독법 사이에서 이 정부가 안고 있던 제약을 강조한다. 급진당 없이는 다수가 없었고, 상원은 끝까지 적대적이었으며, 재정 정통주의를 받아들인 순간 개혁의 여력은 자본 이동이 결정했다.

분명한 것은 남은 것들이다. 유급휴가와 단체협약은 이후 프랑스 노동법의 골격이 되었고, 1936년의 기억은 1944년 레지스탕스 전국평의회 강령과 해방 후 사회보장으로 이어졌다. 그리고 「인민전선」이라는 이름 자체가 스페인에서 칠레까지, 그리고 반세기 뒤 소련의 마지막 몇 해까지, 좌파가 위기 앞에서 연합을 부르는 보통명사가 되었다.$b$,
  $b$## From a Riot to an Oath

On the evening of 6 February 1934, the far-right leagues, Action Française and the Croix-de-Feu among them, marched on the Chamber of Deputies. Police opened fire on the Place de la Concorde; fifteen people died and more than 1,500 were injured, and the Radical premier Daladier resigned the next day. Most historians now conclude the riot was not an organized coup, but the left of the time read it as a dress rehearsal for a French fascism. Hitler had taken power in Germany just a year earlier, and the memory of Social Democrats and Communists calling each other the main enemy while being destroyed one by one was fresh.

The answer came from below. On 12 February, the day of the CGT's general strike, the Socialist and Communist columns set out separately, but when they met at the Place de la Nation the workers embraced to shouts of 'Unity!'. The leaders' pact came five months later: on 27 July the two parties signed a unity-of-action agreement, and in October at Nantes, Thorez proposed widening the alliance to the Radicals, coining the name 'Popular Front of labour, liberty and peace'. This sequence, in which the French section ran ahead while the Comintern's upper floors hesitated, was ratified the following August at the Seventh Comintern Congress by Dimitrov's report and became the official line of world communism.

When the Franco-Soviet mutual assistance treaty was signed in May 1935 and Stalin declared that he 'fully understood and approved the national defence policy of France', the French Communist Party, whose identity had been built on antimilitarism, dropped its opposition to the defence budget overnight. Party posters reading 'Stalin is right' went up in the streets of Paris. On Bastille Day, half a million people marched in Paris and recited the oath of the Rassemblement Populaire: bread, peace and liberty, the dissolution of the leagues, the defence of the Republic.

## 'Bread, Peace, Liberty': A Modest Programme, a Clear Victory

The Popular Front programme published in January 1936 was no revolutionary charter. Dissolution of the fascist leagues, reform of the Bank of France, public works, support for grain prices, nationalization of the arms industry, and a 'study' of the 40-hour week: there was no clause about a transition to socialism, because the ceiling was what the Radicals could accept. Blum himself insisted this would be the 'exercise' of power, not its 'conquest': within capitalism, within legality, only as far as the mandate reached.

In the elections of 26 April and 3 May 1936 the Popular Front took 386 of 608 seats. The Socialists became the largest party for the first time with 147 seats, the Communists jumped from 10 to 72, and the Radicals actually shrank. The total left vote grew only modestly, but its movement leftward was unmistakable. The Communists chose to support the government from outside without taking ministries; Thorez argued that joining would 'feed the panic', and Moscow judged likewise.

Between victory and taking office lay a month's gap. By constitutional custom Blum had to wait until early June, and what filled that month was not parliament but the factories.

## The Strike That Sleeps Beside the Machines

On 11 May, workers at the Bréguet aircraft plant in Le Havre sat down inside their factory, demanding the reinstatement of two comrades sacked for striking on May Day. The occupation won within a day. Latécoère in Toulouse and Bloch in Courbevoie followed, and on 28 May, 33,000 workers stopped the machines at Renault in Billancourt. In the first week of June the strikes spread beyond metalworking to department stores and cafés, insurance offices and farms. By the Labour Ministry's count, June alone saw 12,142 strikes with 1,830,000 participants, 8,941 of them with occupation.

Occupation was this movement's invention. Staying inside the factory blocked replacement labour, and guarding the machines forestalled the charge of sabotage. And inside, the workers held dances and played accordions. Simone Weil, who had worked at Renault, recorded this 'pure joy': the joy of walking on one's own feet through the place where one works, unhounded by orders, head unbowed. The strikes were not organized from above; the CGT and the Communist Party alike ran to catch up. Trotsky wrote on 9 June that 'the French revolution has begun'; Marceau Pivert of the Socialist left wrote that 'everything is possible'. The Communist daily replied that it was not.

On the night of 4 June, Blum formed his cabinet: France's first Socialist and first Jewish prime minister, with three women undersecretaries in a country where women could not vote. In the Chamber, the right-wing deputy Xavier Vallat declared that 'this ancient Gallo-Roman country will for the first time be governed by a Jew'. Three days into the government, on the night of 7 June, the employers' confederation and the CGT sat down at the Hôtel Matignon, and in negotiations lasting into the small hours the employers conceded everything at once: wage rises of 7 to 15 per cent, collective agreements, freedom of union activity, elected workers' delegates. Jouhaux called it the greatest victory in the history of the labour movement; the employers' delegates considered it the price of getting their factories back.

Parliament passed the two-week paid holidays law on 11 June by 563 votes to 1, and the 40-hour week on the 12th. On the evening of the 11th, Thorez told Communist activists of the Paris region that 'one must know how to end a strike once satisfaction has been obtained'. Not everything was possible yet. With the party's weight behind the return to work, the occupations wound down one by one through the end of June.

## First Holidays, First Retreats

That summer, 600,000 people left on the first holidays of their lives with the railways' 40-per-cent-discount 'popular tickets', created by Léo Lagrange, the undersecretary for leisure and sport. Youth hostels multiplied tenfold in two years, and the beaches belonged to workers for the first time. When Blum, before his deportation to Buchenwald, listed his government's achievements at the Riom trial, what he chose was not nationalization or wages but the 'break in the clouds' let into difficult and obscure lives.

The retreats began the same summer. When the generals rose in Spain in July, Blum at first wanted to help the Republic, but under British pressure, Radical opposition and the fear of the war spreading into France, he turned in August to non-intervention. The Communists answered with the campaign 'Planes and guns for Spain', and the coalition began to crack from inside. In September came the devaluation of the franc he had promised to avoid; capital was already crossing the border. In November, interior minister Salengro, who had carried out the dissolution of the leagues, was hounded into suicide by a fabricated story in a far-right weekly.

In February 1937 Blum declared a 'pause' in reform. In March at Clichy, police fired on an antifascist crowd and five people died, shaking the faith of the government's own supporters. In June, when the Senate refused him financial powers, Blum resigned rather than fight. His second cabinet in March 1938 lasted barely a month, and the Daladier government that followed in April dismantled the 40-hour week by decree that November. The CGT answered with a protest general strike on 30 November; it failed, thousands were sacked, and the Popular Front was over.

## How to Read June 1936

The argument of the time became the argument of the historians. For Trotsky, June 1936 was a revolution that had begun, and the Popular Front was the machinery of class collaboration that caged and killed it in parliamentary form. Seen from the other side, the Popular Front was the rampart that blocked the road to fascism in France and defended democracy, and Matignon was the greatest gain ever won without a revolution. Scholars such as Julian Jackson stress, between the two readings, the constraints the government carried: no majority without the Radicals, a Senate hostile to the end, and once financial orthodoxy was accepted, room for reform decided by capital flight.

What is beyond dispute is what remained. Paid holidays and collective agreements became the skeleton of French labour law; the memory of 1936 fed the 1944 programme of the National Council of the Resistance and postwar social security. And the name 'Popular Front' itself became, from Spain to Chile and on to the Soviet Union's final years half a century later, the common noun by which the left calls for unity in the face of danger.$b$,
  $j$[
    {"date": "1934.02.06", "title": {"ko": "콩코르드 광장의 폭동", "en": "Riot on the Place de la Concorde"}, "body": {"ko": "극우 동맹들이 하원 의사당을 향해 행진하고 경찰 발포로 15명이 사망한다. 달라디에 총리는 이튿날 사임했고, 좌파는 이 밤을 프랑스판 파시즘의 총연습으로 읽었다.", "en": "The far-right leagues march on the Chamber of Deputies; police fire kills fifteen. Premier Daladier resigns the next day, and the left reads the night as a dress rehearsal for a French fascism."}},
    {"date": "1934.02.12", "title": {"ko": "반파시즘 총파업", "en": "The Anti-Fascist General Strike"}, "body": {"ko": "CGT가 부른 총파업 날, 따로 출발한 사회당과 공산당의 대열이 나시옹 광장에서 만나 「단결!」을 외친다. 지도부의 협정보다 거리의 단결이 먼저였다.", "en": "On the day of the CGT's general strike, the separate Socialist and Communist columns meet at the Place de la Nation to shouts of 'Unity!'. The street united before the leaders did."}},
    {"date": "1934.07.27", "title": {"ko": "사회당·공산당 통일행동협정", "en": "The Socialist-Communist Unity Pact"}, "body": {"ko": "두 당이 통일행동협정에 서명한다. 10월 낭트에서 토레즈는 연합을 급진당까지 넓히자며 「인민전선」이라는 이름을 처음 내놓는다.", "en": "The two parties sign a unity-of-action pact. In October at Nantes, Thorez proposes extending the alliance to the Radicals and coins the name 'Popular Front'."}},
    {"date": "1935.05.02", "title": {"ko": "프랑스-소련 상호원조조약", "en": "The Franco-Soviet Pact"}, "body": {"ko": "조약 서명 2주 뒤 스탈린이 프랑스의 국방 노력을 「완전히 이해하고 승인한다」고 선언하자, 반군국주의를 정체성으로 삼던 프랑스공산당은 국방 예산 반대를 접는다.", "en": "Two weeks after the treaty is signed, Stalin declares he 'fully understands and approves' French national defence; the PCF, built on antimilitarism, drops its opposition to the defence budget."}},
    {"date": "1935.07.14", "title": {"ko": "인민연합의 선서", "en": "The Oath of the Rassemblement Populaire"}, "body": {"ko": "혁명기념일에 50만 명이 파리에서 행진하며 빵과 평화와 자유, 동맹 해산, 공화국 방어를 선서한다.", "en": "On Bastille Day half a million people march in Paris, swearing to bread, peace and liberty, the dissolution of the leagues, and the defence of the Republic."}},
    {"date": "1935.08.02", "title": {"ko": "코민테른 제7차 대회", "en": "The Seventh Comintern Congress"}, "body": {"ko": "디미트로프의 보고로 반파시즘 인민전선이 세계 공산주의 운동의 공식 노선이 된다. 프랑스에서 이미 진행 중이던 실험의 추인이었다.", "en": "Dimitrov's report makes the antifascist popular front the official line of world communism, ratifying the experiment already under way in France."}},
    {"date": "1936.01", "title": {"ko": "「빵, 평화, 자유」 강령 발표", "en": "The Programme: 'Bread, Peace, Liberty'"}, "body": {"ko": "동맹 해산, 프랑스은행 개혁, 공공사업, 군수산업 국유화가 골자인 온건한 강령이 발표된다. 사회주의로의 이행 조항은 없었다.", "en": "A modest programme is published: dissolving the leagues, reforming the Bank of France, public works, nationalizing the arms industry. There is no clause on a transition to socialism."}},
    {"date": "1936.03", "title": {"ko": "CGT 재통합", "en": "The CGT Reunified"}, "body": {"ko": "툴루즈 대회에서 CGT와 공산당계 CGTU가 15년 만에 재통합한다. 조합원은 그해 안에 100만에서 400만으로 불어난다.", "en": "At the Congress of Toulouse the CGT and the communist CGTU reunite after fifteen years. Membership swells from one million to four million within the year."}},
    {"date": "1936.05.03", "title": {"ko": "인민전선 총선 승리", "en": "The Popular Front Wins the Elections"}, "body": {"ko": "결선에서 인민전선이 608석 중 386석을 얻는다. 사회당이 147석으로 제1당이 되고 공산당은 10석에서 72석으로 뛴다. 공산당은 입각하지 않고 밖에서 지지하기로 한다.", "en": "In the second round the Popular Front takes 386 of 608 seats; the Socialists become the largest party with 147, the Communists jump from 10 to 72 and choose to support the government without joining it."}},
    {"date": "1936.05.11", "title": {"ko": "르아브르에서 시작된 점거", "en": "The First Occupation, Le Havre"}, "body": {"ko": "브레게 공장 노동자들이 메이데이 파업으로 해고된 동료들의 복직을 요구하며 공장 안에 눌러앉아 하루 만에 이긴다. 툴루즈와 쿠르브부아가 뒤따른다.", "en": "Workers at the Bréguet plant sit down inside to demand the reinstatement of comrades sacked for striking on May Day, and win within a day. Toulouse and Courbevoie follow."}},
    {"date": "1936.05.28", "title": {"ko": "르노 비양쿠르 점거", "en": "Renault Billancourt Occupied"}, "body": {"ko": "3만 3천 명이 기계를 세운다. 6월 들어 파업은 백화점과 카페, 보험사와 농장으로 번져 한 달간 12,142건, 참가자 183만 명에 이른다.", "en": "33,000 workers stop the machines. Into June the strikes spread to department stores, cafés, insurance offices and farms: 12,142 strikes and 1.83 million strikers in a single month."}},
    {"date": "1936.06.04", "title": {"ko": "블룸 내각 출범", "en": "Blum Takes Office"}, "body": {"ko": "프랑스 최초의 사회주의자 총리이자 최초의 유대인 총리가, 여성 참정권이 없던 나라에서 여성 차관 세 명과 함께 취임한다. 취임하는 그 주에 파업 참가자는 200만에 육박했다.", "en": "France's first Socialist and first Jewish prime minister takes office, with three women undersecretaries in a country where women cannot vote, as the strike wave approaches two million."}},
    {"date": "1936.06.07", "title": {"ko": "마티뇽 협정", "en": "The Matignon Agreements"}, "body": {"ko": "총리 관저에서 밤샘 협상 끝에 사용자들이 임금 7~15% 인상, 단체협약, 노조 활동의 자유, 노동자 대표 제도를 한꺼번에 내준다. 주오는 이를 「노동운동 역사상 최대의 승리」라 불렀다.", "en": "After all-night talks at the prime minister's residence, the employers concede wage rises of 7 to 15 per cent, collective agreements, union freedom and workers' delegates all at once. Jouhaux calls it 'the greatest victory in the history of the labour movement'."}},
    {"date": "1936.06.11", "title": {"ko": "유급휴가·40시간제, 그리고 「파업을 끝낼 줄 알아야 한다」", "en": "Paid Holidays, the 40-Hour Week, and 'Knowing How to End a Strike'"}, "body": {"ko": "하원이 2주 유급휴가법을 563 대 1로, 이튿날 주 40시간제를 통과시킨다. 같은 날 저녁 토레즈는 「요구가 관철되었으면 파업을 끝낼 줄도 알아야 한다」고 말했고, 점거는 6월 말까지 차례로 풀린다.", "en": "The Chamber passes two weeks' paid holidays by 563 to 1, and the 40-hour week the next day. That evening Thorez declares that 'one must know how to end a strike once satisfaction has been obtained', and the occupations wind down through late June."}},
    {"date": "1936.08.08", "title": {"ko": "스페인 불개입", "en": "Non-Intervention in Spain"}, "body": {"ko": "스페인 공화국의 무기 지원 요청 앞에서 블룸은 영국의 압력과 급진당의 반대에 밀려 불개입을 택한다. 공산당은 「스페인에 대포와 비행기를」 캠페인으로 맞서고, 연합에 금이 가기 시작한다.", "en": "Faced with the Spanish Republic's appeal for arms, Blum yields to British pressure and Radical opposition and chooses non-intervention. The Communists campaign for 'planes and guns for Spain', and the coalition begins to crack."}},
    {"date": "1936.09.25", "title": {"ko": "프랑 평가절하", "en": "The Franc Devalued"}, "body": {"ko": "자본 유출 앞에서 정부는 하지 않겠다고 약속했던 평가절하를 단행한다. 11월에는 내무장관 살랑그로가 극우 주간지의 날조 보도에 몰려 스스로 목숨을 끊는다.", "en": "Facing capital flight, the government carries out the devaluation it had promised to avoid. In November, interior minister Salengro is hounded to suicide by a fabricated story in a far-right weekly."}},
    {"date": "1937.02.13", "title": {"ko": "개혁의 「휴지기」", "en": "The 'Pause'"}, "body": {"ko": "블룸이 시장을 안심시키기 위해 개혁의 휴지기를 선언한다. 3월 클리시에서 경찰이 반파시즘 시위대에 발포해 5명이 죽자 지지층의 신뢰가 흔들린다.", "en": "Blum declares a pause in reform to reassure the markets. In March at Clichy, police fire on an antifascist crowd, killing five, and the faith of the government's own base is shaken."}},
    {"date": "1937.06.21", "title": {"ko": "블룸 사퇴", "en": "Blum Resigns"}, "body": {"ko": "상원이 재정 전권을 거부하자 블룸은 싸우는 대신 물러난다. 1938년 3월의 2차 내각도 상원의 벽 앞에 한 달을 못 넘긴다.", "en": "When the Senate refuses him financial powers, Blum resigns rather than fight. His second cabinet in March 1938 also fails against the Senate within a month."}},
    {"date": "1938.11.30", "title": {"ko": "11월 총파업의 패배", "en": "Defeat of the November General Strike"}, "body": {"ko": "달라디에 정부의 법령이 40시간제를 해체하자 CGT가 항의 총파업으로 답하지만 실패한다. 수천 명이 해고되고, 인민전선 시대가 막을 내린다.", "en": "When the Daladier government's decrees dismantle the 40-hour week, the CGT answers with a protest general strike. It fails, thousands are sacked, and the Popular Front era closes."}}
  ]$j$::jsonb,
  $j$[
    "Julian Jackson, The Popular Front in France: Defending Democracy, 1934–38 (Cambridge University Press, 1988)",
    "Jacques Danos & Marcel Gibelin, June '36: Class Struggle and the Popular Front in France (Bookmarks, 1986)",
    "Georgi Dimitrov, The Fascist Offensive and the Tasks of the Communist International (제7차 코민테른 대회 보고, 1935.08.02) — https://www.marxists.org/reference/archive/dimitrov/works/1935/08_02.htm",
    "Leon Trotsky, Whither France? (1934–1936) — https://www.marxists.org/archive/trotsky/1936/whitherfrance/",
    "Léon Blum, L'Exercice du pouvoir (Gallimard, 1937) 및 리옴 재판 진술(1942.03)",
    "Antoine Prost, Autour du Front populaire (Seuil, 2006)",
    "Simone Weil, La Condition ouvrière (Gallimard, 1951) 중 「공장 점거의 나날」 관련 서한"
  ]$j$::jsonb
);

INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('french-popular-front', 'leon-blum', 0, 'leader', '인민전선 정부 총리', 'Prime minister of the Popular Front government',
   '권력의 「정복」이 아니라 「행사」를 내걸고 마티뇽 협정을 중재했으며, 유급휴가와 주 40시간제를 입법했다. 스페인 불개입과 상원의 벽 앞에서 1년 만에 물러났다.',
   'Promising the ''exercise'' rather than the ''conquest'' of power, he brokered the Matignon Agreements and enacted paid holidays and the 40-hour week, then fell within a year to non-intervention in Spain and the Senate.'),
  ('french-popular-front', 'maurice-thorez', 1, 'leader', 'PCF 서기장, 「인민전선」 이름의 발명자', 'PCF secretary-general who coined the name ''Popular Front''',
   '1934년 낭트에서 연합을 급진당까지 넓히자며 이름을 처음 내놓았고, 1936년 6월에는 「파업을 끝낼 줄도 알아야 한다」로 복귀를 이끌었다.',
   'At Nantes in 1934 he proposed extending the alliance to the Radicals and named it; in June 1936 he led the return to work with ''one must know how to end a strike''.'),
  ('french-popular-front', 'leon-jouhaux', 2, 'leader', 'CGT 사무총장, 마티뇽 협정 서명자', 'CGT secretary-general, signatory of the Matignon Agreements',
   '재통합된 CGT를 이끌고 협상 테이블에 앉아 협정을 「노동운동 역사상 최대의 승리」라 불렀다. 조합원은 그해 100만에서 400만으로 불어났다.',
   'He led the reunified CGT to the table and called the accords ''the greatest victory in the history of the labour movement''; membership swelled from one to four million that year.'),
  ('french-popular-front', 'jacques-duclos', 3, 'participant', 'PCF 지도부, 하원 부의장', 'PCF leadership; vice-president of the Chamber',
   '토레즈와 함께 지지하되 입각하지 않는 노선을 집행했고, 인민전선 다수 의석의 하원에서 부의장을 맡았다.',
   'With Thorez he executed the line of support without participation, and served as vice-president of the Popular Front Chamber.'),
  ('french-popular-front', 'dimitrov', 4, 'participant', '코민테른 서기장, 인민전선 노선의 정식화자', 'Comintern general secretary who codified the popular-front line',
   '1935년 8월 제7차 대회 보고로 프랑스에서 진행 중이던 실험을 세계 공산주의 운동의 공식 노선으로 추인했다.',
   'His report to the Seventh Congress in August 1935 ratified the experiment under way in France as the official line of world communism.'),
  ('french-popular-front', 'stalin', 5, 'participant', '프랑스-소련 조약과 국방 승인 선언', 'The Franco-Soviet pact and the defence declaration',
   '1935년 5월 「프랑스의 국방 노력을 완전히 이해하고 승인한다」는 선언으로 프랑스공산당의 반군국주의 노선을 하루아침에 뒤집었다.',
   'His May 1935 declaration that he ''fully understood and approved'' French national defence reversed the PCF''s antimilitarism overnight.'),
  ('french-popular-front', 'litvinov', 6, 'participant', '집단안보 노선의 소련 외무인민위원', 'Soviet foreign commissar of collective security',
   '프랑스-소련 상호원조조약으로 이어진 집단안보 외교를 이끌었다. 인민전선 노선의 외교적 짝이었다.',
   'He drove the collective-security diplomacy that produced the Franco-Soviet pact, the diplomatic twin of the popular-front line.'),
  ('french-popular-front', 'trotsky', 7, 'opponent', '인민전선 노선의 비판자', 'Critic of the popular-front line',
   '1936년 6월 9일 「프랑스 혁명이 시작되었다」고 썼고, 인민전선을 시작된 혁명을 의회의 틀에 가두어 죽인 계급협조의 기계라고 비판했다.',
   'On 9 June 1936 he wrote that ''the French revolution has begun'', and attacked the Popular Front as the machinery of class collaboration that caged and killed it.');

-- 스페인 내전 사건에도 블룸(불개입 정책)을 연결
INSERT INTO commulingo_history_event_people (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('spanish-civil-war', 'leon-blum', 94, 'participant', '불개입 정책을 택한 프랑스 총리', 'French premier who chose non-intervention',
   '처음에는 공화국에 무기를 보내려 했으나 영국의 압력과 연정 내 반대에 밀려 1936년 8월 불개입을 제안했다. 이후 국경을 눈감아 주는 「완화된 불개입」으로 흔들렸다.',
   'He first meant to arm the Republic but, under British pressure and coalition opposition, proposed non-intervention in August 1936, later wavering toward a ''relaxed'' version that winked at the border.');

COMMIT;
BEGIN;

-- ─── 인민전선 ────────────────────────────────────────────────
INSERT INTO commulingo_terms (
  id, sort_order, term_ko, term_en, original, period_label, period_ko, period_en,
  start_year, end_year, category, definition_ko, definition_en, body_ko, body_en, sources
) VALUES (
  'popular-front', 19565405, '인민전선', 'Popular Front', 'Front populaire / Народный фронт',
  '1934–1939', '1934–1939', '1934–1939', 1934, 1939, 'international',
  $d$파시즘의 위협 앞에서 공산당이 사회민주주의 정당은 물론 자유주의 정당까지 끌어안는 광범한 반파시즘 연합을 추구한 전략. 1934년 프랑스에서 실험이 시작되어 1935년 코민테른 제7차 대회에서 디미트로프의 보고로 세계 공산주의 운동의 공식 노선이 되었고, 1936년 프랑스와 스페인에서 인민전선 정부가 집권했다. 사회민주주의를 「사회파시즘」이라 부르던 직전 시기 노선의 정반대 방향 전환이었으며, 1939년 독소 불가침조약과 함께 갑작스럽게 폐기되었다.$d$,
  $d$The strategy by which communist parties, facing the fascist threat, sought broad antifascist coalitions embracing not only social-democratic but also liberal parties. The experiment began in France in 1934 and became the official line of world communism with Dimitrov's report to the Seventh Comintern Congress in 1935; popular-front governments took power in France and Spain in 1936. It was a complete reversal of the preceding line that had branded social democracy 'social fascism', and it was abruptly discarded with the Nazi-Soviet pact of 1939.$d$,
  $b$## 왜 코민테른은 노선을 뒤집었나

1928년 이후 코민테른의 공식 노선은 「계급 대 계급」이었다. 자본주의가 최후의 위기에 들어섰으니 혁명이 눈앞에 있고, 노동자들을 개량주의에 붙잡아 두는 사회민주주의야말로 「사회파시즘」, 곧 파시즘의 쌍둥이라는 것이었다. 이 노선 아래 독일공산당은 사회민주당을 주적으로 삼았고, 두 당이 서로 싸우는 동안 1933년 히틀러가 집권해 두 당을 모두 파괴했다.

전환의 첫 신호는 모스크바가 아니라 현장에서 왔다. 1934년 2월 프랑스에서 극우 동맹들의 폭동에 맞서 사회당과 공산당의 대열이 거리에서 합류했고, 그해 7월 두 당은 통일행동협정을 맺었다. 라이프치히 법정에서 나치의 국회의사당 방화 혐의 기소를 되받아친 것으로 유명해진 디미트로프가 코민테른의 새 서기장이 되었고, 1935년 8월 제7차 대회 보고에서 그는 파시즘을 「금융자본의 가장 반동적이고 배외주의적이며 제국주의적인 분자들의 공공연한 테러 독재」로 규정하며, 그것에 맞서는 가장 넓은 연합을 새 노선으로 선언했다. 사회파시즘론에 대한 명시적 자기비판은 없었지만, 방향은 정반대였다.

## 통일전선과 무엇이 다른가

두 낱말은 자주 섞여 쓰이지만 층위가 다르다. 통일전선은 1920년대 초부터 쓰인 개념으로, 노동자 정당과 노동조합, 곧 노동계급 조직들 사이의 공동 행동을 가리킨다. 인민전선은 그 바깥까지 나간다. 프랑스의 급진당, 스페인의 공화좌파 같은 자유주의·중간층 정당과의 연합, 그리고 사회주의가 아니라 부르주아 민주주의 자체의 방어를 당면 목표로 삼는 것이다.

바로 그 확장이 논쟁의 핵심이었다. 지지자들에게 이것은 파시즘이라는 더 큰 적 앞에서 민주주의를 지키는 유일하게 현실적인 길이었다. 비판자들에게 이것은 연합을 지키기 위해 노동자의 요구를 자유주의 정당이 받아들일 수 있는 선까지 깎아야 하는 구조, 곧 계급협조의 제도화였다.

## 어디서 어떻게 실험되었나

프랑스에서 인민전선은 1936년 5월 총선에서 승리해 블룸 정부를 세웠고, 총파업과 마티뇽 협정, 유급휴가와 주 40시간제를 남긴 뒤 2년 만에 무너졌다. 스페인에서는 1936년 2월 총선에서 인민전선이 승리했으나 7월 군부 반란으로 내전이 시작되었고, 인민전선 방어 전쟁의 안쪽에서 「전쟁이 먼저인가 혁명이 먼저인가」라는 노선 투쟁이 벌어졌다. 칠레에서는 1938년 급진당의 아기레 세르다가 인민전선 후보로 대통령에 당선되었다. 중국에서는 1937년 국공합작이 같은 논리로 정당화되었고, 미국공산당은 「공산주의는 20세기의 미국주의」라는 구호까지 나아갔다.

노선의 끝은 시작만큼 급격했다. 1939년 8월 독소 불가침조약이 체결되자 코민테른은 반파시즘 연합 노선을 하루아침에 접고 전쟁을 제국주의 상호 간의 전쟁으로 규정했으며, 각국 당은 다시 한 번 궤도를 급선회해야 했다. 1941년 6월 독일의 소련 침공과 함께 반파시즘 연합은 되살아났고, 전후 동유럽의 「민족전선」·「인민민주주의」는 인민전선 논리의 연장선에서 설명되었다.

## 무엇이 논쟁으로 남았나

트로츠키는 인민전선을 「배신의 다른 이름」이라 불렀다. 프랑스에서는 시작된 혁명을 의회의 틀에 가두었고, 스페인에서는 연합을 지킨다는 이유로 혁명을 되돌리다 전쟁까지 졌다는 것이다. 반대편의 옹호론은 두 나라에서 파시즘의 집권을 막거나 늦춘 것, 공산당들이 처음으로 대중정당이 된 것, 그리고 유급휴가에서 단체협약까지 노동자들이 손에 쥔 실물을 가리킨다. 연구자들은 노선 전환의 동기 자체도 나누어 본다. 각국 현장의 반파시즘 압력이 아래로부터 밀어 올린 전환이었다는 독법과, 집단안보로 돌아선 소련 외교의 필요가 위에서 내려보낸 전환이었다는 독법이 겹쳐 있고, 1939년의 급선회는 후자의 무게를 보여 주는 증거로 자주 인용된다.

이름은 개념보다 오래 살아남았다. 반세기 뒤 페레스트로이카 말기의 소련에서 발트 공화국들의 대중운동이 스스로를 「인민전선」이라 불렀을 때, 그 이름은 1930년대의 기억에서 빌려 온 것이었다.$b$,
  $b$## Why Did the Comintern Reverse Its Line?

From 1928 the Comintern's official line was 'class against class': capitalism had entered its final crisis, revolution was imminent, and social democracy, which kept workers tied to reformism, was 'social fascism', fascism's twin. Under this line the German Communist Party treated the Social Democrats as the main enemy, and while the two fought each other, Hitler took power in 1933 and destroyed them both.

The first signal of the turn came not from Moscow but from the field. In February 1934 in France, Socialist and Communist columns merged in the streets against the far-right leagues' riot, and that July the two parties signed a unity-of-action pact. Dimitrov, famous for turning the Nazi arson charges back on his accusers at the Leipzig trial, became the Comintern's new general secretary, and in his report to the Seventh Congress in August 1935 he defined fascism as 'the open terrorist dictatorship of the most reactionary, most chauvinistic and most imperialist elements of finance capital' and proclaimed the broadest possible coalition against it as the new line. There was no explicit self-criticism of the social-fascism thesis, but the direction was the exact opposite.

## How Does It Differ from the United Front?

The two words are often mixed, but they operate at different levels. The united front, a concept in use since the early 1920s, means joint action among working-class organizations: workers' parties and trade unions. The popular front goes beyond them, to alliance with liberal and middle-class parties like the French Radicals or the Spanish Republican Left, and takes as its immediate goal the defence not of socialism but of bourgeois democracy itself.

That extension was the heart of the controversy. To its supporters, it was the only realistic road to defending democracy against the greater enemy of fascism. To its critics, it was a structure in which workers' demands had to be trimmed to what liberal parties could accept in order to preserve the alliance: the institutionalization of class collaboration.

## Where and How Was It Tried?

In France the Popular Front won the elections of May 1936 and installed the Blum government, leaving behind the great strikes, the Matignon Agreements, paid holidays and the 40-hour week before collapsing within two years. In Spain the Popular Front won the elections of February 1936, but the generals' rising in July began a civil war, inside which raged the struggle over 'war first or revolution first'. In Chile, the Radical Aguirre Cerda won the presidency as the popular-front candidate in 1938. In China the second united front of 1937 was justified by the same logic, and the American party went as far as the slogan 'Communism is twentieth-century Americanism'.

The line ended as abruptly as it began. When the Nazi-Soviet pact was signed in August 1939, the Comintern dropped the antifascist coalition overnight and declared the war an inter-imperialist one, forcing every party into another hairpin turn. The antifascist alliance revived with the German invasion of the Soviet Union in June 1941, and the postwar 'national fronts' and 'people's democracies' of Eastern Europe were explained as extensions of popular-front logic.

## What Remains in Dispute?

Trotsky called the popular front another name for betrayal: in France it caged a revolution that had begun inside parliamentary forms, and in Spain it rolled back the revolution to preserve the alliance and lost the war as well. The defence points to fascism blocked or delayed in both countries, to communist parties becoming mass parties for the first time, and to the tangible things workers gained, from paid holidays to collective agreements. Historians also divide over the motive of the turn itself: a change pushed up from below by antifascist pressure in each country, or handed down from above by the needs of Soviet diplomacy as it turned to collective security. The hairpin turn of 1939 is regularly cited as evidence of the latter's weight.

The name outlived the concept. Half a century later, when the mass movements of the Baltic republics in the last years of perestroika called themselves 'popular fronts', they were borrowing the name from the memory of the 1930s.$b$,
  $j$[
    "Georgi Dimitrov, The Fascist Offensive and the Tasks of the Communist International (1935.08.02) — https://www.marxists.org/reference/archive/dimitrov/works/1935/08_02.htm",
    "Leon Trotsky, Whither France? (1934–1936) — https://www.marxists.org/archive/trotsky/1936/whitherfrance/",
    "Julian Jackson, The Popular Front in France: Defending Democracy, 1934–38 (Cambridge University Press, 1988)",
    "Kevin McDermott & Jeremy Agnew, The Comintern: A History of International Communism from Lenin to Stalin (Macmillan, 1996)",
    "E. H. Carr, The Twilight of the Comintern, 1930–1935 (Macmillan, 1982)"
  ]$j$::jsonb
);

-- ─── 마티뇽 협정 ─────────────────────────────────────────────
INSERT INTO commulingo_terms (
  id, sort_order, term_ko, term_en, original, period_label, period_ko, period_en,
  start_year, end_year, category, definition_ko, definition_en, body_ko, body_en, sources
) VALUES (
  'matignon-agreements', 19565415, '마티뇽 협정', 'Matignon Agreements', 'Accords de Matignon',
  '1936년 6월 7일', '1936년 6월 7일', '7 June 1936', 1936, 1936, 'international',
  $d$1936년 6월 총파업이 절정에 이르렀을 때 총리 관저 오텔 마티뇽에서 블룸 정부의 중재로 경영자총연합(CGPF)과 노동총동맹(CGT)이 맺은 협정. 임금 7~15% 인상, 단체협약 체결, 노조 가입·활동의 자유, 노동자 대표(델레게) 제도, 파업 참가자 보복 금지를 담았고, 곧이어 의회가 2주 유급휴가와 주 40시간제를 입법했다. 프랑스 노사관계사에서 국가가 중재하는 전국 단위 노사협정의 첫 사례다.$d$,
  $d$The agreement brokered by the Blum government between the employers' confederation (CGPF) and the CGT at the Hôtel Matignon at the height of the June 1936 strikes. It provided wage rises of 7 to 15 per cent, collective agreements, freedom to join and organize unions, elected workers' delegates, and no reprisals against strikers; parliament immediately followed with two weeks of paid holidays and the 40-hour week. It was the first national, state-brokered labour settlement in French history.$d$,
  $b$## 무엇을 합의했나

1936년 6월 7일 저녁, 취임 사흘째의 블룸 총리가 경영자총연합과 CGT의 대표들을 총리 관저로 불렀다. 파업 참가자가 200만에 육박하고 점거된 공장이 수천에 이르던 시점이었다. 다음 날 새벽 1시경 서명된 협정은 짧지만 전례가 없었다. 임금을 낮은 구간 15%에서 높은 구간 7%까지 평균 12% 인상하고, 산업별 단체협약을 체결하며, 노조 가입과 활동을 이유로 한 불이익을 금지하고, 종업원 10인 이상 사업장에 노동자가 뽑는 대표를 두며, 파업 참가자에게 보복하지 않는다는 내용이었다. 협정 자체에는 없던 유급휴가와 40시간제는 며칠 안에 의회가 입법으로 얹었다.

## 왜 사용자들이 하룻밤에 물러섰나

몇 주 전까지 단체협약조차 거부하던 사용자들이 모든 것을 한꺼번에 내준 이유는 협상장 밖에 있었다. 공장은 이미 노동자들의 손에 있었고, 파업은 매일 새 업종으로 번지고 있었으며, 경영자 단체는 회원사들의 통제력 상실을 자인하고 정부에 중재를 먼저 요청한 쪽이었다. 사용자 대표 중 한 사람은 훗날 「우리는 공장을 돌려받는 값을 치렀다」고 회고했다. 정부와 CGT, 그리고 공산당까지 질서 있는 복귀를 보증하는 쪽에 섰다는 점도 계산에 들어 있었다. 협정은 혁명의 문턱에서 이루어진 교환이었다. 노동자는 제도를 얻었고, 사용자는 공장을, 국가는 질서를 돌려받았다.

## 협정 뒤에 무엇이 왔나

단기적으로 협정과 후속 입법은 프랑스 노동자의 일상을 바꾸었다. 그해 여름 60만 명이 생애 첫 유급휴가를 떠났고, CGT 조합원은 100만에서 400만으로 불어났으며, 단체협약의 수는 한 해 만에 수십 배가 되었다. 그러나 되감기도 빨랐다. 물가 상승이 임금 인상분을 잠식했고, 1938년 11월 달라디에 정부의 법령들이 40시간제를 사실상 해체했으며, 이에 맞선 총파업의 패배로 마티뇽 체제의 힘 관계는 2년 반 만에 끝났다.

그럼에도 협정이 만든 틀, 곧 국가가 중재하고 전국 단위 노사 대표가 서명하는 사회적 타협의 형식과 단체협약·노동자 대표 제도는 프랑스 노동법에 남았다. 1968년 5월 총파업을 끝낸 그르넬 협정은 이름의 형식까지 마티뇽을 본떴고, 유급휴가는 이후 3주(1956), 4주(1969), 5주(1982)로 늘며 프랑스적 삶의 일부가 되었다.$b$,
  $b$## What Was Agreed?

On the evening of 7 June 1936, three days into his government, Blum summoned the leaders of the employers' confederation and the CGT to the prime minister's residence. Strikers were approaching two million and thousands of factories were occupied. The agreement signed around one in the morning was short but unprecedented: wage rises averaging 12 per cent, from 15 per cent at the bottom of the scale to 7 at the top; collective agreements by industry; no penalties for union membership or activity; elected workers' delegates in every workplace of more than ten employees; no reprisals against strikers. Paid holidays and the 40-hour week were not in the accords themselves; parliament added them by statute within days.

## Why Did the Employers Yield Overnight?

The reason employers who had refused even collective bargaining a few weeks earlier now conceded everything at once lay outside the negotiating room. The factories were already in the workers' hands, the strikes were spreading to new trades daily, and it was the employers' organization, admitting it had lost control of its member firms, that had first asked the government to mediate. One employers' delegate later recalled that 'we paid the price of getting our factories back'. That the government, the CGT and even the Communist Party stood behind an orderly return to work was part of the calculation. The agreement was an exchange made on the threshold of revolution: the workers gained institutions, the employers got back their factories, and the state got back order.

## What Came After?

In the short run the accords and the laws that followed changed French working-class life. Six hundred thousand people left on their first paid holidays that summer, CGT membership swelled from one million to four, and the number of collective agreements multiplied dozens of times over within a year. But the rollback was fast too: inflation ate the wage rises, the Daladier government's decrees of November 1938 dismantled the 40-hour week in practice, and the defeat of the general strike called against them ended the Matignon balance of forces within two and a half years.

Yet the form the accords created, a national social compromise brokered by the state and signed by peak labour and employer organizations, and the institutions of collective agreements and workers' delegates, remained in French labour law. The Grenelle agreements that ended the general strike of May 1968 copied Matignon down to the style of their name, and paid holidays grew to three weeks in 1956, four in 1969 and five in 1982, becoming part of French life.$b$,
  $j$[
    "Julian Jackson, The Popular Front in France: Defending Democracy, 1934–38 (Cambridge University Press, 1988)",
    "Jacques Danos & Marcel Gibelin, June '36: Class Struggle and the Popular Front in France (Bookmarks, 1986)",
    "Antoine Prost, Autour du Front populaire (Seuil, 2006)",
    "https://fr.wikipedia.org/wiki/Accords_de_Matignon_(1936) — 협정 조항 원문과 서명 경위"
  ]$j$::jsonb
);

-- ─── 점거 파업 ───────────────────────────────────────────────
INSERT INTO commulingo_terms (
  id, sort_order, term_ko, term_en, original, period_label, period_ko, period_en,
  start_year, end_year, category, definition_ko, definition_en, body_ko, body_en, sources
) VALUES (
  'sit-down-strike', 19565425, '점거 파업', 'Sit-down Strike', 'grève sur le tas / sit-down strike',
  '1936년–현재', '1936년–현재', '1936–present', 1936, NULL, 'theory',
  $d$작업장을 떠나는 대신 그 안에 머무르며 벌이는 파업. 공장 안에 있음으로써 대체 인력 투입을 물리적으로 막고, 기계를 지킴으로써 파괴자라는 비난을 차단하며, 생산수단에 대한 사실상의 통제를 시위한다. 1920년 이탈리아의 공장점거가 선례지만, 1936년 프랑스 5~6월 파업에서 대중적 전술로 확립되어 같은 해 말 미국 플린트의 GM 공장 점거로 이어졌다.$d$,
  $d$A strike waged by staying inside the workplace instead of leaving it. Remaining in the plant physically blocks replacement labour, guarding the machines forestalls the charge of sabotage, and the occupation demonstrates de facto control over the means of production. The Italian factory occupations of 1920 were the precedent, but the tactic was established on a mass scale in the French strikes of May-June 1936 and carried on that winter into the GM occupation at Flint.$d$,
  $b$## 왜 공장 밖이 아니라 안인가

전통적인 파업의 약점은 공장 문 앞에 있다. 노동자들이 밖으로 나가는 순간 사용자는 대체 인력을 들일 수 있고, 파업 대오는 피케팅으로 그것을 막다가 경찰과 충돌하게 된다. 점거는 이 문제를 뒤집는다. 노동자들이 기계 옆에 머무르는 한 공장은 돌릴 수도 비울 수도 없고, 이들을 끌어내려면 국가가 사유지에 병력을 투입하는 부담을 져야 한다. 동시에 점거자들은 기계와 재고를 지킴으로써 파괴자라는 오래된 비난을 무력화한다. 1936년 프랑스의 점거 공장들에서 규율은 파업위원회가 세웠고, 술은 금지되었으며, 설비는 파업 전보다 깨끗하게 관리되는 일이 많았다.

점거에는 제도 요구를 넘어서는 차원이 있었다. 자기가 일하는 공간을 자기 발로 걸어 다니고, 작업장에서 무도회를 열고, 명령 없이 하루를 조직하는 경험이다. 르노에서 일했던 시몬 베유는 1936년 6월의 점거를 「순수한 기쁨」이라 적었고, 연구자들은 이 축제적 성격을 점거 파업이 남긴 가장 독특한 기록으로 꼽는다.

## 1936년, 두 나라

프랑스에서 점거는 1936년 5월 르아브르의 브레게 공장에서 시작되어 6월 한 달 파업 12,142건 중 8,941건이 점거를 동반하는 규모로 폭발했고, 마티뇽 협정과 유급휴가·주 40시간제 입법을 끌어냈다. 블룸 정부는 점거가 명백한 소유권 침해라는 사용자들의 항의에도 강제 해산을 거부했다. 총리 자신이 의회에서, 법을 집행하겠다고 약속하되 「피로써 집행하지는 않겠다」고 답했다.

같은 해 12월 미국 미시간주 플린트에서 GM 노동자들이 같은 전술로 공장을 점거했다. 44일의 점거 끝에 GM은 1937년 2월 전미자동차노조(UAW)를 교섭 상대로 인정했고, 점거 파업은 미국 산업별 노조운동(CIO)의 도약대가 되었다. 그러나 1939년 미국 연방대법원은 팬스틸 판결로 점거 파업을 불법으로 확정했고, 프랑스에서도 판례는 점거를 소유권 침해로 다루어 왔다. 전술의 힘이 합법성의 바깥에서 나온다는 사실은 그 뒤로도 변하지 않았다.

## 어디로 이어졌나

계보는 앞뒤로 뻗는다. 1920년 9월 이탈리아 북부에서 금속노동자 40만 명이 공장을 점거하고 일부는 생산까지 이어 갔던 「공장점거」(occupazione delle fabbriche)가 선례였고, 그람시의 공장평의회론이 그 경험에서 나왔다. 1936년 이후로는 1968년 5월 프랑스에서 1,000만 총파업의 상당 부분이 다시 점거의 형태를 취했고, 1970~80년대 한국과 폴란드의 노동운동에서도, 2008년 시카고의 리퍼블릭 윈도우 공장에서도 같은 전술이 되살아났다. 작업장을 떠나지 않는 파업은, 노동자가 생산수단을 실제로 움직이는 사람이 누구인지를 보여 주는 가장 직접적인 형식으로 남아 있다.$b$,
  $b$## Why Inside the Factory Rather than Outside?

The weakness of the traditional strike stands at the factory gate: the moment workers walk out, the employer can bring in replacements, and the strikers clash with police trying to stop them by picketing. Occupation inverts the problem. As long as workers stay beside the machines, the plant can be neither run nor cleared, and removing them means the state must bear the burden of sending force onto private property. At the same time, by guarding machines and stock, the occupiers neutralize the old charge of sabotage. In the occupied French factories of 1936, discipline was kept by strike committees, alcohol was banned, and the machinery was often kept cleaner than before the strike.

There was also a dimension beyond institutional demands: the experience of walking on one's own feet through the place where one works, holding dances on the shop floor, organizing the day without orders. Simone Weil, who had worked at Renault, wrote of the June 1936 occupations as 'pure joy', and historians count this festive character among the tactic's most distinctive records.

## 1936, Two Countries

In France, occupation began at the Bréguet plant in Le Havre in May 1936 and exploded to the point where 8,941 of June's 12,142 strikes involved occupation, extracting the Matignon Agreements and the legislation of paid holidays and the 40-hour week. The Blum government refused to clear the factories despite employers' protests that occupation was a plain violation of property; the premier himself told parliament he would enforce the law, but 'not with blood'.

That December, GM workers in Flint, Michigan occupied their plants with the same tactic. After 44 days, GM recognized the United Auto Workers in February 1937, and the sit-down strike became the springboard of the CIO's industrial unionism. But in 1939 the US Supreme Court's Fansteel ruling fixed the sit-down strike as illegal, and French case law likewise treated occupation as a violation of property. That the tactic's power comes from outside legality has not changed since.

## Where Did It Lead?

The lineage runs both ways. The precedent was the Italian occupation of the factories of September 1920, when 400,000 metalworkers seized their plants in the north and some kept production running; Gramsci's theory of factory councils came out of that experience. After 1936, much of the ten-million-strong general strike of May 1968 in France again took the form of occupation, and the same tactic revived in the Korean and Polish labour movements of the 1970s and 1980s and at the Republic Windows factory in Chicago in 2008. The strike that does not leave the workplace remains the most direct form in which workers show who actually moves the means of production.$b$,
  $j$[
    "Julian Jackson, The Popular Front in France: Defending Democracy, 1934–38 (Cambridge University Press, 1988)",
    "Simone Weil, La Condition ouvrière (Gallimard, 1951) — 1936년 6월 점거에 관한 서한",
    "Sidney Fine, Sit-down: The General Motors Strike of 1936–1937 (University of Michigan Press, 1969)",
    "Paolo Spriano, The Occupation of the Factories: Italy 1920 (Pluto Press, 1975)"
  ]$j$::jsonb
);

-- ─── 별칭 ───────────────────────────────────────────────────
-- 일반 명칭 별칭을 페레스트로이카 항목에서 1930년대 본항목으로 이관
DELETE FROM commulingo_term_aliases
 WHERE term_id = 'popular-fronts-ussr'
   AND ((lang = 'ko' AND alias = '인민전선')
     OR (lang = 'en' AND alias IN ('Popular Front', 'Popular Fronts', 'People''s Front')));

INSERT INTO commulingo_term_aliases (term_id, lang, alias, sort_order) VALUES
  ('popular-front', 'ko', '인민전선', 0),
  ('popular-front', 'ko', '반파시즘 인민전선', 1),
  ('popular-front', 'en', 'Popular Front', 0),
  ('popular-front', 'en', 'Popular Fronts', 1),
  ('popular-front', 'en', 'People''s Front', 2),
  ('popular-front', 'en', 'Front populaire', 3),
  ('matignon-agreements', 'ko', '마티뇽협정', 0),
  ('matignon-agreements', 'en', 'Matignon Agreements', 0),
  ('matignon-agreements', 'en', 'Matignon Accords', 1),
  ('matignon-agreements', 'en', 'Accords de Matignon', 2),
  ('sit-down-strike', 'ko', '공장 점거 파업', 0),
  ('sit-down-strike', 'ko', '연좌 파업', 1),
  ('sit-down-strike', 'en', 'Sit-down strike', 0),
  ('sit-down-strike', 'en', 'Sit-down strikes', 1),
  ('sit-down-strike', 'en', 'Occupation strike', 2);

-- ─── 연결: 용어 ↔ 사건 ──────────────────────────────────────
INSERT INTO commulingo_term_events (term_id, event_id, sort_order) VALUES
  ('popular-front', 'french-popular-front', 0),
  ('popular-front', 'spanish-civil-war', 1),
  ('matignon-agreements', 'french-popular-front', 0),
  ('sit-down-strike', 'french-popular-front', 0);

-- ─── 연결: 용어 ↔ 인물 ──────────────────────────────────────
INSERT INTO commulingo_term_people (term_id, person_id, sort_order) VALUES
  ('popular-front', 'dimitrov', 0),
  ('popular-front', 'maurice-thorez', 1),
  ('popular-front', 'leon-blum', 2),
  ('popular-front', 'jose-diaz', 3),
  ('popular-front', 'trotsky', 4),
  ('matignon-agreements', 'leon-blum', 0),
  ('matignon-agreements', 'leon-jouhaux', 1);

-- ─── 연결: 용어 ↔ 용어 ──────────────────────────────────────
INSERT INTO commulingo_term_relations (term_id, related_id, sort_order) VALUES
  ('popular-front', 'comintern', 0),
  ('popular-front', 'matignon-agreements', 1),
  ('popular-front', 'popular-fronts-ussr', 2),
  ('popular-fronts-ussr', 'popular-front', 90),
  ('matignon-agreements', 'popular-front', 0),
  ('matignon-agreements', 'sit-down-strike', 1),
  ('sit-down-strike', 'matignon-agreements', 0),
  ('sit-down-strike', 'mass-strike', 1);

COMMIT;
