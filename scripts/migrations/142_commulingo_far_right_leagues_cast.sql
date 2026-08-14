-- The men who led the other forces on the square of 6 February 1934, alongside
-- La Rocque of the Croix-de-Feu (140): Charles Maurras and Léon Daudet of
-- Action Française, Pierre Taittinger of the Jeunesses Patriotes, and François
-- Coty, whose perfume fortune paid for a good deal of it. All four are named in
-- the event body; these are their cards and their links back.
--
-- Filed under counterrevolution: none of them held office in 1934, and the
-- dictionary's foreign-statesman category would say the wrong thing about a
-- pamphleteer, a league chief and a financier of leagues.

BEGIN;

-- ─── 샤를 모라스 ─────────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'charles-maurras', 'international-counterrevolutionary', 19321133, '', 'Charles Maurras', '1868–1952', 1868, 1952,
  '샤를 모라스', 'Charles Maurras',
  '악시옹 프랑세즈의 두뇌, 「통합민족주의」의 이름으로 공화국 자체를 부정한 왕당파 이론가',
  'The brain of Action Française, the royalist theorist who denied the republic itself in the name of integral nationalism',
  $t$프로방스 마르티그에서 태어나 청년기에 청력을 잃은 시인이자 논객으로, 드레퓌스 사건을 계기로 결성된 악시옹 프랑세즈를 반세기 동안 이끌었다. 그가 말한 「통합민족주의」는 왕정 복고와 의회 공화국의 폐기를 내걸고 유대인, 개신교도, 프리메이슨, 외국인을 프랑스를 안에서 좀먹는 「네 개의 연합국」으로 지목했다. 1926년 교황청이 악시옹 프랑세즈를 단죄했음에도 세력은 유지되었고, 1938년에는 아카데미 프랑세즈 회원이 되었다. 1934년 1월 스타비스키 사건 내내 그의 신문은 「도둑들」을 날마다 지목했고 2월 6일 아침 지면은 저녁에 의사당 앞으로 나오라고 독자들에게 호소했다. 1940년 페탱의 집권을 「신의 뜻밖의 선물」이라 부르며 비시를 지지했고, 점령기 내내 저항 세력과 유대인을 지면에서 고발했다. 1945년 1월 대적 협력 혐의로 종신형과 공민권 박탈을 선고받았다.$t$,
  $t$A poet and polemicist from Martigues in Provence, deaf from his youth, who led Action Française for half a century after the movement formed out of the Dreyfus affair. His 'integral nationalism' called for the restoration of the monarchy and the abolition of the parliamentary republic, and named Jews, Protestants, Freemasons and foreigners as the 'four confederate states' eating France from within. The movement survived the Vatican's condemnation of 1926, and in 1938 he was elected to the Académie Française. Through January 1934 his paper named 'the thieves' day after day, and on the morning of 6 February it called on its readers to come to the Chamber that evening. He welcomed Pétain's accession in 1940 as a 'divine surprise', backed Vichy, and denounced resisters and Jews in print throughout the occupation. In January 1945 he was sentenced to life imprisonment and national degradation for collusion with the enemy.$t$,
  'natural', '종신형 복역 중 병으로 석방되어 사망', 'Released from a life sentence in ill health and died',
  $t$「이것은 드레퓌스의 복수다!」, 종신형 선고를 듣고 리옹 법정에서, 1945년 1월 27일$t$,
  $t$'It is the revenge of Dreyfus!', on hearing his life sentence in the court at Lyon, 27 January 1945$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '샤를', 'Charles', '모라스', 'Maurras'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('charles-maurras', 'counterrevolution');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('charles-maurras', 'ko', '모라스', 0),
  ('charles-maurras', 'en', 'Maurras', 0);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('charles-maurras', 0, '1868–1890', 1868, 1890, '마르티그 출생, 청력을 잃고 파리에서 문필 활동 시작', 'Born at Martigues; loses his hearing; begins writing in Paris'),
  ('charles-maurras', 1, '1899–1908', 1899, 1908, '드레퓌스 사건을 계기로 악시옹 프랑세즈에 합류, 1908년 일간지 창간', 'Joins Action Française out of the Dreyfus affair; the daily is founded in 1908'),
  ('charles-maurras', 2, '1908–1939', 1908, 1939, '「통합민족주의」의 이론가로 프랑스 극우 전체에 영향', 'Theorist of integral nationalism, shaping the whole of the French far right'),
  ('charles-maurras', 3, '1926', 1926, 1926, '교황청이 악시옹 프랑세즈를 단죄', 'The Vatican condemns Action Française'),
  ('charles-maurras', 4, '1934.01–02', 1934, 1934, '스타비스키 사건 지면 공세, 2월 6일 시위 호소', 'Press offensive over the Stavisky affair; calls for the demonstration of 6 February'),
  ('charles-maurras', 5, '1938', 1938, 1938, '아카데미 프랑세즈 회원 선출', 'Elected to the Académie Française'),
  ('charles-maurras', 6, '1940–1944', 1940, 1944, '비시 지지, 저항 세력과 유대인을 지면에서 고발', 'Backs Vichy; denounces resisters and Jews in print'),
  ('charles-maurras', 7, '1945.01', 1945, 1945, '대적 협력으로 종신형과 공민권 박탈 선고', 'Sentenced to life and national degradation for collusion with the enemy'),
  ('charles-maurras', 8, '1952', 1952, 1952, '병으로 석방된 해에 투르에서 사망', 'Released in ill health and dies at Tours the same year');

-- ─── 레옹 도데 ───────────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'leon-daudet', 'international-counterrevolutionary', 19321134, '', 'Léon Daudet', '1867–1942', 1867, 1942,
  '레옹 도데', 'Léon Daudet',
  '악시옹 프랑세즈의 목소리, 추문을 날마다 지면에서 거리로 밀어 올린 논객',
  'The voice of Action Française, the polemicist who pushed a scandal from the page into the street day after day',
  $t$소설가 알퐁스 도데의 아들로 태어나 의학을 공부하다 문필로 옮겨 간 논객으로, 모라스와 함께 《악시옹 프랑세즈》를 창간하고 그 논조를 만들었다. 1919년부터 1924년까지 파리 선출 하원의원을 지냈으며, 인신공격과 고발을 무기로 삼는 그의 문체는 프랑스 정치 언어에 한 세대의 흔적을 남겼다. 1923년 아들 필리프의 죽음을 경찰의 소행이라 주장하며 벌인 소송에서 명예훼손으로 유죄를 받고 1927년 벨기에로 달아났다가 1930년 사면으로 돌아왔다. 1934년 1월 스타비스키 사건에서 그는 연루된 정치인들의 이름을 날마다 지면에 올려 「도둑들의 공화국」이라는 구도를 만들었고, 이 지면 공세가 2월 6일 광장으로 이어졌다.$t$,
  $t$The son of the novelist Alphonse Daudet, a medical student turned polemicist, who founded the daily Action Française with Maurras and set its tone. He sat as a deputy for Paris from 1919 to 1924, and his method of personal attack and denunciation left its mark on a generation of French political language. After losing a libel case brought over his claim that the police had killed his son Philippe in 1923, he fled to Belgium in 1927 and returned under an amnesty in 1930. In January 1934 he printed the names of the politicians touched by the Stavisky affair day after day, building the picture of a 'republic of thieves' that carried the paper's readers to the square on 6 February.$t$,
  'natural', '병사', 'Illness',
  $t$1934년 1월 내내 그의 지면은 연루된 의원의 이름을 하나씩 불러냈고, 2월 6일 아침 신문은 저녁에 의사당 앞으로 나오라고 독자에게 호소했다. 그날 밤 광장에 모인 대열의 앞자리에는 악시옹 프랑세즈의 행동대 카믈로 뒤 루아가 있었다$t$,
  $t$Through January 1934 his columns called out the implicated deputies one by one, and on the morning of 6 February the paper urged its readers to come to the Chamber that evening. At the front of the columns that filled the square that night were the Camelots du Roi, the action squads of Action Française$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '레옹', 'Léon', '도데', 'Daudet'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('leon-daudet', 'counterrevolution');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('leon-daudet', 'en', 'Daudet', 0);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('leon-daudet', 0, '1867–1890', 1867, 1890, '파리 출생, 알퐁스 도데의 아들로 의학 수학', 'Born in Paris, son of Alphonse Daudet; studies medicine'),
  ('leon-daudet', 1, '1900–1908', 1900, 1908, '왕당파로 전향, 악시옹 프랑세즈 합류', 'Turns royalist and joins Action Française'),
  ('leon-daudet', 2, '1908–1942', 1908, 1942, '《악시옹 프랑세즈》 공동 창간자이자 주필', 'Co-founder and leading writer of the daily Action Française'),
  ('leon-daudet', 3, '1919–1924', 1919, 1924, '파리 선출 하원의원', 'Deputy for Paris'),
  ('leon-daudet', 4, '1923–1927', 1923, 1927, '아들 필리프의 죽음을 둘러싼 소송, 명예훼손 유죄로 벨기에 망명', 'The lawsuits over his son Philippe''s death; convicted of libel and flees to Belgium'),
  ('leon-daudet', 5, '1930', 1930, 1930, '사면으로 귀국', 'Returns under an amnesty'),
  ('leon-daudet', 6, '1934.01–02', 1934, 1934, '스타비스키 사건 지면 공세로 2월 6일 시위를 조성', 'The press offensive over the Stavisky affair that produced the demonstration of 6 February'),
  ('leon-daudet', 7, '1942', 1942, 1942, '생레미드프로방스에서 사망', 'Dies at Saint-Rémy-de-Provence');

-- ─── 피에르 테탱제 ───────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'pierre-taittinger', 'international-counterrevolutionary', 19321135, '', 'Pierre Taittinger', '1887–1965', 1887, 1965,
  '피에르 테탱제', 'Pierre Taittinger',
  '청년애국단을 세운 의원, 거리의 부대와 의사당 의석을 함께 가진 사람',
  'The deputy who founded the Jeunesses Patriotes, holding a street force and a seat in the Chamber at once',
  $t$1차 대전 참전 뒤 하원의원이 된 정치인으로, 1924년 좌파연합의 집권에 맞서 청년애국단을 세워 수만 명 규모의 준군사 조직으로 키웠다. 파란 외투와 베레모를 갖춘 이 조직은 공산당 집회를 습격하고 거리를 다투는 일을 활동으로 삼았고, 그러면서도 지도자는 의회 안에 자리를 두고 있었다. 이 이중성은 프랑스 극우 동맹들의 특징이었다. 1934년 2월 6일 청년애국단은 콩코르드 광장의 주력 대열 가운데 하나였고 사망자도 그 대열에서 나왔다. 1940년 페탱 전권 위임에 찬성표를 던졌고 점령기 파리 시의회 의장을 지냈으며, 해방 뒤 구금되었다가 풀려났다.$t$,
  $t$A First World War veteran turned deputy who founded the Jeunesses Patriotes in 1924 against the incoming Cartel des Gauches and built it into a paramilitary body tens of thousands strong. Equipped with blue raincoats and berets, it broke up Communist meetings and fought for the streets, while its leader kept his seat inside parliament: a doubleness characteristic of the French leagues. On 6 February 1934 the Jeunesses Patriotes formed one of the main columns on the Place de la Concorde, and some of the dead came from its ranks. He voted full powers to Pétain in 1940, presided over the Paris municipal council under the occupation, and was detained and then released after the liberation.$t$,
  'natural', '병사', 'Illness',
  $t$「거리도 우리 것이다」라는 뜻으로 그는 의회 의석과 준군사 조직을 함께 유지했다. 1934년 2월 6일 밤 콩코르드에 도착한 대열 가운데 청년애국단이 있었고, 그날 죽은 열다섯 명 가운데 여럿이 그 조직의 단원이었다$t$,
  $t$He kept a parliamentary seat and a paramilitary organisation at the same time, on the principle that the street belonged to his side too. The Jeunesses Patriotes were among the columns that reached the Concorde on the night of 6 February 1934, and several of the fifteen dead were their members$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '피에르', 'Pierre', '테탱제', 'Taittinger'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('pierre-taittinger', 'counterrevolution');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('pierre-taittinger', 'ko', '테탱제', 0),
  ('pierre-taittinger', 'en', 'Taittinger', 0);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('pierre-taittinger', 0, '1887–1918', 1887, 1918, '파리 출생, 1차 대전 참전', 'Born in Paris; serves in the First World War'),
  ('pierre-taittinger', 1, '1919–1940', 1919, 1940, '하원의원', 'Deputy in the Chamber'),
  ('pierre-taittinger', 2, '1924', 1924, 1924, '청년애국단 창설', 'Founds the Jeunesses Patriotes'),
  ('pierre-taittinger', 3, '1925–1936', 1925, 1936, '수만 명 규모의 준군사 동맹을 지휘', 'Commands a paramilitary league tens of thousands strong'),
  ('pierre-taittinger', 4, '1934.02.06', 1934, 1934, '청년애국단이 콩코르드 광장의 주력 대열로 참가', 'The Jeunesses Patriotes form one of the main columns on the Concorde'),
  ('pierre-taittinger', 5, '1940.07', 1940, 1940, '페탱 전권 위임에 찬성', 'Votes full powers to Pétain'),
  ('pierre-taittinger', 6, '1943–1944', 1943, 1944, '점령기 파리 시의회 의장', 'Presides over the Paris municipal council under the occupation'),
  ('pierre-taittinger', 7, '1944–1945', 1944, 1945, '해방 후 구금되었다가 석방', 'Detained after the liberation, then released');

-- ─── 프랑수아 코티 ───────────────────────────────────────────
INSERT INTO commulingo_people (
  id, group_id, sort_order, initial, cyrillic, years_label, birth_year, death_year,
  name_ko, name_en, epithet_ko, epithet_en, bio_ko, bio_en,
  fate_kind, fate_label_ko, fate_label_en, moment_ko, moment_en,
  citizenship_code, citizenship_label_ko, citizenship_label_en,
  origin_code, origin_label_ko, origin_label_en,
  given_name_ko, given_name_en, family_name_ko, family_name_en
) VALUES (
  'francois-coty', 'international-counterrevolutionary', 19321136, '', 'François Coty', '1874–1934', 1874, 1934,
  '프랑수아 코티', 'François Coty',
  '향수 재벌의 돈으로 극우 동맹과 대중지를 함께 사들인 후원자',
  'The perfume magnate who bought both the far-right leagues and a mass newspaper',
  $t$코르시카 출신으로 향수 산업에서 당대 유럽 최대의 재산을 쌓은 실업가. 1922년 《르 피가로》를 사들이고 1928년에는 값싼 대중지 《라미 뒤 푀플》을 창간해 반공과 반유대, 반의회 선동의 무기로 삼았다. 조르주 발루아의 파소와 초기 불의 십자단을 지원했고 1933년에는 연대 프랑스를 직접 만들어 자금을 댔다. 그의 이력은 1930년대 프랑스 극우 동맹의 물음, 곧 누가 이 조직들의 비용을 댔는가에 대한 대답의 큰 몫이다. 1934년 2월 6일 광장에는 그가 세운 조직이 대열로 나와 있었고, 그는 그해 7월 이혼 소송과 재정 파탄 끝에 죽었다.$t$,
  $t$A Corsican who built the largest fortune in the European perfume industry of his day. He bought Le Figaro in 1922 and founded the cheap mass daily L'Ami du peuple in 1928, using both as instruments of anticommunist, antisemitic and antiparliamentary agitation. He financed Georges Valois's Faisceau and the early Croix-de-Feu, and in 1933 created and funded Solidarité Française outright. His career is a large part of the answer to the question that hangs over the French leagues of the 1930s: who paid for them. The organisation he had founded was on the Place de la Concorde as a column on 6 February 1934, and he died that July, ruined by a divorce settlement and his debts.$t$,
  'natural', '재정 파탄 뒤 병사', 'Died in ill health after financial ruin',
  $t$1928년 그는 한 부에 10상팀짜리 일간지를 창간해 발행 부수를 백만 부 가까이 끌어올렸다. 신문은 손해를 봤지만 그것이 목적이 아니었다. 값이 싼 만큼 널리 읽혔고, 그 지면에서 자란 언어가 1934년 2월 광장에 나온 대열들의 언어가 되었다$t$,
  $t$In 1928 he launched a daily at ten centimes a copy and drove its circulation toward a million. The paper lost money, which was not the point: it was cheap enough to be read everywhere, and the language grown on its pages became the language of the columns that filled the square in February 1934$t$,
  'france', '프랑스', 'France',
  'france', '프랑스', 'France',
  '프랑수아', 'François', '코티', 'Coty'
);

INSERT INTO commulingo_person_roles (person_id, category_id)
VALUES ('francois-coty', 'counterrevolution');

INSERT INTO commulingo_person_aliases (person_id, lang, alias, sort_order) VALUES
  ('francois-coty', 'en', 'Coty', 0);

INSERT INTO commulingo_person_career_entries (person_id, sort_order, period_label, start_year, end_year, role_ko, role_en) VALUES
  ('francois-coty', 0, '1874–1904', 1874, 1904, '코르시카 아자시오 출생, 파리에서 향수 사업 시작', 'Born at Ajaccio in Corsica; starts in perfumery in Paris'),
  ('francois-coty', 1, '1905–1920', 1905, 1920, '향수 산업에서 당대 최대급 재산 축적', 'Builds one of the great fortunes of the perfume industry'),
  ('francois-coty', 2, '1922', 1922, 1922, '《르 피가로》 인수', 'Buys Le Figaro'),
  ('francois-coty', 3, '1925–1928', 1925, 1928, '발루아의 파소와 초기 불의 십자단에 자금 지원', 'Finances Valois''s Faisceau and the early Croix-de-Feu'),
  ('francois-coty', 4, '1928', 1928, 1928, '대중지 《라미 뒤 푀플》 창간', 'Founds the mass daily L''Ami du peuple'),
  ('francois-coty', 5, '1933', 1933, 1933, '연대 프랑스 창설과 자금 지원', 'Creates and funds Solidarité Française'),
  ('francois-coty', 6, '1934.07', 1934, 1934, '이혼 소송과 재정 파탄 끝에 사망', 'Dies after a divorce settlement and financial ruin');

INSERT INTO commulingo_history_event_people
  (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('february-1934-crisis', 'charles-maurras', 13, 'leader',
   '악시옹 프랑세즈의 이론가', 'Theorist of Action Française',
   '스타비스키 사건을 외국인과 유대인이 공화국을 좀먹었다는 이야기로 번역한 지면 공세의 중심이었고, 2월 6일 아침 그의 신문은 저녁에 의사당 앞으로 나오라고 호소했다.',
   'He stood at the centre of the press offensive that translated the Stavisky affair into a story of foreigners and Jews eating away at the republic, and on the morning of 6 February his paper called its readers to the Chamber that evening.'),
  ('february-1934-crisis', 'leon-daudet', 14, 'leader',
   '《악시옹 프랑세즈》 주필', 'Leading writer of the daily Action Française',
   '1월 내내 연루된 의원들의 이름을 지면에 올려 「도둑들의 공화국」이라는 구도를 만들었다. 그날 밤 광장 앞자리에는 악시옹 프랑세즈의 행동대 카믈로 뒤 루아가 있었다.',
   'Through January he printed the names of the implicated deputies and built the picture of a republic of thieves. At the front of the square that night were the Camelots du Roi, his movement''s action squads.'),
  ('february-1934-crisis', 'pierre-taittinger', 15, 'leader',
   '청년애국단 창설자', 'Founder of the Jeunesses Patriotes',
   '의회 의석과 준군사 조직을 함께 쥔 채 광장의 주력 대열 하나를 이끌었다. 그날 죽은 열다섯 명 가운데 여럿이 그 조직의 단원이었다.',
   'Holding a parliamentary seat and a paramilitary organisation at once, he led one of the main columns on the square; several of the fifteen dead were his members.'),
  ('february-1934-crisis', 'francois-coty', 16, 'participant',
   '동맹들의 자금줄', 'The leagues'' money',
   '연대 프랑스를 만들어 자금을 댔고 초기 불의 십자단도 지원했으며, 값싼 대중지 《라미 뒤 푀플》로 그 언어를 백만 부 가까이 퍼뜨렸다.',
   'He created and funded Solidarité Française, backed the early Croix-de-Feu, and spread the language of both through L''Ami du peuple at a circulation approaching a million.');

COMMIT;
