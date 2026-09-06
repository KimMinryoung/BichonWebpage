-- The people's democracies of Eastern Europe, 1944–1949: one history event
-- (sort_order 127, between the Manchurian operation at 125 and the Marshall
-- Plan at 130), its cast, its timeline and its map.
--
-- The four neighbouring entries already tell parts of this story: Yalta and
-- Potsdam the diplomatic frame, the Marshall Plan the Cominform and the Prague
-- February, the Tito-Stalin split the Yugoslav contrast, the Warsaw Pact the
-- treaty and garrison network. This entry is the country-by-country record of
-- how power was reordered between the arrival of the Red Army and 1949, and of
-- how the term "people's democracy" changed its meaning in the same years.
-- Where a neighbour already covers a step in full, the body points to it
-- rather than retelling it.
--
-- The body records dates, actors, official results and later-published
-- counts side by side, and attributes evaluative labels (salami tactics,
-- satellite, coup) to the people who used them. The historiography section
-- lists the readings without adopting one.
--
-- Every person linked here already exists in the dictionary. Ferenc Nagy,
-- Béla Kovács, Nikola Petkov and Traicho Kostov appear in the body only; a
-- card for each is a separate editorial decision.

BEGIN;

INSERT INTO commulingo_history_events (
  id, sort_order, period_label,
  title_ko, title_en, question_ko, question_en,
  summary_ko, summary_en, outcome_ko, outcome_en,
  body_ko, body_en, timeline, locations, sources
) VALUES (
  'eastern-europe-peoples-democracies', 127, '1944–1949',
  '동유럽 인민민주주의 정권의 수립', 'The People''s Democracies of Eastern Europe',
  '1944년 붉은군대 진주부터 1949년까지 동유럽 각국의 권력은 어떤 단계를 거쳐 공산당으로 집중되었고, 「인민민주주의」라는 말은 그 사이 어떻게 뜻이 바뀌었는가?',
  'Between the Red Army''s arrival in 1944 and 1949, through what stages did power in each Eastern European state pass to the communist parties, and how did the meaning of "people''s democracy" change along the way?',
  $t$1944년 여름부터 붉은군대가 진주한 폴란드·루마니아·불가리아·헝가리와 소련 점령지구 독일, 그리고 자력으로 해방을 이룬 체코슬로바키아·유고슬라비아·알바니아에서는 공산당이 참여하는 연립정부가 세워졌다. 각국은 토지개혁과 기간산업 국유화를 거쳤고, 1945~46년의 선거는 헝가리와 체코슬로바키아처럼 결과가 갈린 곳도, 폴란드와 루마니아처럼 공식 집계와 후대에 공개된 기록이 어긋나는 곳도 있었다. 1947년에 연립의 다른 정당들이 해체·분열·재판을 거쳐 밀려났고, 1946~48년에 각국 사회민주당이 공산당과 통합되었다. 같은 시기 「인민민주주의」는 소비에트와 다른 「새로운 길」로 설명되다가 1948년 12월 「프롤레타리아 독재의 한 형태」로 재정의되었다. 1949년까지 각국은 헌법과 단일 명부 선거로 새 체제를 확정했고, 당 안에서는 재판과 숙청이 시작되었다.$t$,
  $t$From the summer of 1944, coalition governments with communist participation were formed in Poland, Romania, Bulgaria and Hungary as the Red Army arrived, in the Soviet zone of Germany, and in Czechoslovakia, Yugoslavia and Albania, which had been liberated largely by their own forces. Each country passed through land reform and the nationalisation of major industry. The elections of 1945–46 produced divided results in Hungary and Czechoslovakia, while in Poland and Romania the official counts diverge from records published later. In 1947 the other coalition parties were pushed out through dissolution, splits and trials, and between 1946 and 1948 the social democratic parties were merged into the communist parties. Over the same years "people's democracy" was explained first as a "new road" distinct from the Soviet system and then, in December 1948, redefined as a form of the dictatorship of the proletariat. By 1949 constitutions and single-list elections had fixed the new order in every country, and trials and purges had begun inside the parties themselves.$t$,
  $t$1949년까지 폴란드·체코슬로바키아·헝가리·루마니아·불가리아·알바니아와 새로 세워진 독일민주공화국에는 공산당이 지도하는 단일 명부 체제, 새 헌법, 국유화된 산업과 소련과의 양자조약이 자리 잡았다. 소련 고문단은 각국 군과 보안기관에 배치되었고, 1949년 라이크 재판과 코스토프 재판, 1952년 슬란스키 재판으로 이어지는 당내 재판이 시작되었다. 유고슬라비아는 1948년 코민포름에서 제명되어 이 체계 밖으로 나갔다. 이 시기에 세워진 제도는 1953년 동베를린, 1956년 포즈난과 부다페스트, 1968년 프라하, 1980년 그단스크의 사건들이 벌어지는 무대가 되었고, 1989년에 해체되었다.$t$,
  $t$By 1949 Poland, Czechoslovakia, Hungary, Romania, Bulgaria, Albania and the newly founded German Democratic Republic each had a single-list political order led by the communist party, a new constitution, nationalised industry and a bilateral treaty with the Soviet Union. Soviet advisers sat in each army and security service, and the intra-party trials had begun: Rajk and Kostov in 1949, Slánský in 1952. Yugoslavia, expelled from the Cominform in 1948, stood outside the system. The institutions built in these years were the setting for East Berlin in 1953, Poznań and Budapest in 1956, Prague in 1968 and Gdańsk in 1980, and were dismantled in 1989.$t$,
  $t$## 1944년 가을, 서로 다른 출발점

붉은군대가 1944년 여름 소련 국경을 넘었을 때, 그 앞에 놓인 나라들의 조건은 제각각이었다. 폴란드는 독일 점령 아래 있었고, 런던에 망명정부가 있었으며, 국내에는 망명정부 계열의 국내군과 공산당 계열의 인민군이 따로 있었다. 루마니아·헝가리·불가리아는 독일과 동맹한 나라였다. 체코슬로바키아는 런던의 베네시 정부가 1943년 12월 소련과 조약을 맺어 두었고, 유고슬라비아와 알바니아는 공산당이 이끄는 파르티잔이 자력으로 해방을 진행 중이었다.

폴란드에서는 1944년 7월 22일 폴란드민족해방위원회가 헤움에서 선언문을 내고 루블린에 자리 잡았다. 위원회는 소련이 후원한 조직으로, 런던 망명정부를 인정하지 않았고 9월 6일 토지개혁 포고를 발표했다. 같은 해 8월부터 10월까지 바르샤바 봉기가 진행되는 동안 소련군은 비스와강 동안에 머물렀다. 12월 31일 위원회는 스스로 임시정부를 선포했고, 소련은 1945년 1월 5일 이를 승인했다.

루마니아에서는 1944년 8월 23일 국왕 미하이 1세가 안토네스쿠 원수를 체포하고 연합국 측으로 돌아섰다. 콘스탄틴 서너테스쿠와 니콜라에 러데스쿠가 이끄는 정부에는 국민농민당·국민자유당·사회민주당·공산당이 함께 들어갔다. 불가리아에서는 소련이 9월 5일 선전포고하고 8일 국경을 넘자, 9일 새벽 조국전선이 소피아에서 정권을 잡았다. 조국전선은 공산당, 농민동맹, 즈베노, 사회민주당의 연합이었고, 12월부터 이듬해 초까지 인민재판소가 전 정권의 섭정·장관·의원들을 재판해 약 2,700건의 사형을 선고했다. 1945년 2월 1일 섭정 세 명과 장관 스물두 명이 처형되었다.

10월 9일 모스크바에서 처칠과 스탈린은 이른바 백분율 협정을 나누었다. 처칠이 적은 쪽지에는 루마니아 90 대 10(소련 우위), 그리스 90 대 10(영국 우위), 유고슬라비아와 헝가리 50 대 50, 불가리아 75 대 25가 적혀 있었고, 이든과 몰로토프의 후속 협의에서 헝가리와 불가리아는 80 대 20으로 조정되었다. 이 문서의 법적 지위는 없었다. 다만 소련이 루마니아와 불가리아에서, 영국이 그리스에서 어떻게 행동했는지를 보면 두 지도자가 그것을 어떻게 이해했는지는 드러난다.

휴전협정에 따라 루마니아·불가리아·헝가리에는 연합국 통제위원회가 설치되었다. 위원장은 세 곳 모두 소련 장성이었다. 헝가리의 클리멘트 보로실로프, 불가리아의 세르게이 비류조프(톨부힌 원수 아래 부위원장으로 실무를 맡았다), 루마니아의 소련군 사령부가 각국 정부의 결정에 대한 최종 승인권을 쥐었고, 미국과 영국의 대표는 통보를 받는 자리에 있었다. 이탈리아에서는 반대로 서방 연합국이 통제위원회를 주도하고 소련 대표가 통보를 받았는데, 소련은 이 이탈리아 선례를 자기 점령지에서 그대로 적용했다.

밀로반 질라스가 전하는 1945년 4월 스탈린의 말은 이 시기를 압축한다. 「이 전쟁은 과거의 전쟁과 다르다. 영토를 점령한 자는 그 영토에 자기의 사회체제를 심는다. 각자 자기 군대가 미치는 곳까지 자기 체제를 심는다. 다른 방법은 없다.」

## 연립정부와 선거, 1945~1946년

1945년의 각국 정부는 모두 여러 당의 연립이었다. 폴란드에서는 얄타 합의에 따라 6월 28일 국민통일임시정부가 세워져 런던 망명정부 총리였던 스타니스와프 미코와이치크가 부총리 겸 농업장관으로 들어갔고, 미국과 영국은 7월 5일 이 정부를 승인했다. 헝가리에서는 1944년 12월 데브레첸에서 임시국민의회가 열렸고, 체코슬로바키아에서는 1945년 4월 5일 코시체 정부강령으로 민족전선 여섯 당의 정부가 출범했다. 독일 소련 점령지구에서는 소련군정청 명령 2호로 1945년 6월 10일 정당 활동이 허가되어 공산당이 이튿날 가장 먼저 재건되었다.

연립 안에서 공산당이 맡은 부처에는 공통점이 있었다. 폴란드의 공안부, 헝가리의 내무부(1946년 3월부터 러이크 라슬로), 체코슬로바키아의 내무부(바츨라프 노세크), 루마니아의 내무부(테오하리 제오르제스쿠), 불가리아의 내무부(안톤 유고프)가 그것이었다. 경찰과 보안기관, 그리고 토지개혁을 집행하는 농업부가 공산당 몫이었고, 재무와 외무는 대체로 다른 당에 갔다.

토지개혁은 어느 나라에서나 연립의 첫 공동사업이었다. 폴란드는 1944년 9월, 루마니아는 1945년 3월 23일, 헝가리는 1945년 3월 17일, 독일 소련 점령지구는 1945년 9월에 대토지를 분배했다. 헝가리에서는 320만 헥타르가 몰수되어 64만여 가구에 나뉘었다. 이 조치들은 대부분의 연립 정당이 지지했다. 기간산업 국유화도 마찬가지였다. 체코슬로바키아의 1945년 10월 국유화 포고는 베네시 대통령의 이름으로 나왔고, 폴란드의 1946년 1월 국유화법은 미코와이치크의 농민당도 찬성했다.

선거 결과는 나라마다 달랐다. 헝가리의 1945년 11월 4일 총선은 이 시기 동유럽에서 가장 자유로운 선거로 꼽히는데, 소농당이 57.0%, 사회민주당 17.4%, 공산당 17.0%, 국민농민당 6.9%를 얻었다. 소농당은 단독 정부를 꾸릴 수 있는 의석을 얻었으나, 보로실로프는 연립 유지를 요구했고 소농당은 이를 받아들였다. 틸디 졸탄이 총리가 되었다가 1946년 2월 1일 공화국 선포와 함께 대통령이 되었고, 너지 페렌츠가 총리를 이었다. 체코슬로바키아의 1946년 5월 26일 총선에서는 공산당이 체코 지역 40.2%, 슬로바키아 30.4%로 전국 38%를 얻어 제1당이 되었고, 슬로바키아에서는 민주당이 62%를 얻었다. 클레멘트 고트발트가 총리가 되었다.

폴란드와 루마니아의 집계는 다른 문제를 남겼다. 폴란드 정부는 총선을 미루고 1946년 6월 30일 상원 폐지, 토지개혁과 국유화, 오데르-나이세 국경의 세 항목에 대한 국민투표를 실시했다. 공식 결과는 첫 항목 68.2% 찬성이었고, 미코와이치크의 농민당은 첫 항목에 반대 투표를 권고하며 실제로는 반대가 다수였다고 주장했다. 1989년 이후 안제이 파치코프스키가 폴란드와 소련 문서에서 찾아낸 내부 집계는 첫 항목 찬성이 26.9%였음을 보여준다. 루마니아의 1946년 11월 19일 총선은 공식적으로 공산당이 이끄는 민주정당블록이 69.8%를 얻었다고 발표되었다. 1990년대에 공개된 당 문서와 지방 집계에 대한 연구는 국민농민당이 실제로 다수였다는 쪽을 가리킨다. 불가리아의 1946년 10월 27일 대국민의회 선거는 조국전선 70.1%(공산당 53.2%), 야당 28.3%로, 니콜라 페트코프의 농민동맹이 이끄는 야당이 101석을 얻었다.

독일 소련 점령지구의 1946년 10월 20일 주의회 선거에서 사회통일당은 다섯 주 합계 47.5%를 얻어 어느 주에서도 과반을 얻지 못했고, 같은 날 사분할 베를린 시의회 선거에서는 사회민주당 48.7%, 사회통일당 19.8%였다.

## 연립의 해체, 1947년

1947년은 각국에서 연립의 다른 정당들이 정부 밖으로 나가거나 해체된 해였다. 순서와 방식은 나라마다 달랐다.

폴란드의 총선은 1947년 1월 19일에 치러졌다. 공식 결과는 공산당·사회당·민주당의 민주블록 80.1%, 농민당 10.3%였다. 선거 전 농민당 후보 수십 명이 체포되었고 여러 선거구에서 농민당 명부가 무효 처리되었다. 미코와이치크는 10월 21일 폴란드를 떠나 영국으로 갔다.

헝가리에서는 1946년 3월 공산당·사회민주당·국민농민당·노동조합이 「좌익블록」을 결성하고 소농당 안의 「반동」 의원 축출을 요구했다. 소농당은 3월 12일 의원 스무 명을 제명했다. 1947년 1월 「공화국 반대 음모」 수사가 시작되어 소농당 인사들이 잇달아 체포되었고, 2월 25일 국회가 면책특권 박탈을 거부하자 소련 당국이 소농당 사무총장 코바치 벨러를 붉은군대에 대한 간첩 혐의로 직접 체포해 소련으로 이송했다. 총리 너지 페렌츠는 스위스 휴가 중이던 5월 30일 사임했다. 그의 어린 아들이 부다페스트에 남아 있었고, 사임서와 아들의 출국이 맞교환되었다. 8월 31일 총선에서 공산당은 22.3%로 제1당이 되었다. 이 선거는 다른 선거구에서 투표할 수 있는 「푸른 투표용지」가 대량 발급되어 그 이름으로 불리며, 부정 투표 규모는 6만 표 안팎으로 추정된다. 선거 뒤 13.4%를 얻은 헝가리독립당은 의석을 무효 처리당했다. 라코시 마차시는 1952년 2월 당 고등학교 강연에서 이 과정을 돌아보며 상대를 「살라미처럼 한 조각씩 잘라냈다」고 표현했고, 이 말은 이후 이 시기를 가리키는 용어가 되었다.

불가리아에서는 1947년 6월 5일 국회가 페트코프의 면책특권을 박탈하고 회의장에서 체포했다. 8월 재판에서 그는 군사 쿠데타 음모 혐의로 사형을 선고받았고, 파리 평화조약이 발효한 9월 15일로부터 여드레 뒤인 9월 23일 교수형에 처해졌다. 그의 농민동맹은 8월 26일 해산되었다. 루마니아에서는 7월 14일 국민농민당 지도부가 터머더우 비행장에서 국외로 나가려다 체포되었고, 당은 7월 29일 해산되었다. 율리우 마니우는 10월 29일부터 11월 11일까지 재판을 받고 종신 중노동형을 선고받아 1953년 시게트 감옥에서 사망했다. 11월 초 국민자유당의 게오르게 터터레스쿠가 외무장관에서 물러나고 아나 파우커가 그 자리를 이었다. 12월 30일 페트루 그로자와 게오르게 게오르기우데지는 국왕 미하이 1세에게 퇴위 문서를 제시했고, 국왕은 같은 날 서명했다. 그날 저녁 루마니아인민공화국이 선포되었다.

체코슬로바키아는 1947년 말까지 다당제와 자유로운 언론을 유지한 유일한 나라였다. 1948년 2월의 내각 위기와 고트발트 정부의 성립은 마셜 플랜 항목이 다룬다. 5월 9일 새 헌법이 채택되었고, 5월 30일 단일 명부 선거가 치러졌으며, 6월 7일 베네시가 사임하고 14일 고트발트가 대통령이 되었다.

## 두 당이 하나가 되다, 1946~1948년

각국에서 사회민주당과 공산당의 통합은 연립 해체와 나란히 진행되었다. 첫 사례는 독일 소련 점령지구였다. 1946년 4월 21일부터 22일까지 베를린에서 공산당과 사회민주당 점령지구 조직이 합쳐져 독일사회통일당이 세워졌고, 빌헬름 피크와 오토 그로테볼이 공동의장이 되었다. 통합에 앞서 3월 31일 베를린 서방 점령 구역의 사회민주당원들이 당원투표를 했는데 82%가 즉각 통합에 반대했다. 소련 점령 구역에서는 투표가 허용되지 않았다. 사회통일당은 1948년 「새로운 형태의 당」을 선언하고 옛 사회민주당원에 대한 심사를 시작했다.

루마니아에서는 1948년 2월 21일부터 23일까지 공산당과 사회민주당이 루마니아노동자당으로 합쳤다. 헝가리에서는 1948년 6월 12일 사회민주당이 공산당과 통합해 헝가리근로자당이 되었고, 통합에 반대한 사회민주당 인사들은 그 전에 당에서 제명되어 있었다. 체코슬로바키아 사회민주당은 1948년 6월 27일 공산당에 흡수되었다. 불가리아 사회민주당은 8월 11일 공산당에 합쳐졌다. 폴란드에서는 12월 15일부터 21일까지 바르샤바 통합대회에서 노동자당과 사회당이 폴란드통일노동자당을 결성했다. 통합 전 사회당은 자체 심사로 당원 8만여 명을 제명했다.

통합의 형식은 모든 나라에서 대등한 합당이었고, 실질은 공산당 조직에 사회민주당원이 편입되는 것이었다. 새 당의 지도부 구성, 통합 뒤의 당원 재등록, 「사회민주주의 편향」에 대한 심사가 이를 보여준다. 통합에 응한 사회민주당 지도자들 가운데 폴란드의 유제프 치란키에비치와 동독의 그로테볼은 새 당의 지도부에 남았고, 헝가리의 서커시치 아르파드는 1950년 체포되었다.

## 「새로운 길」에서 「프롤레타리아 독재의 한 형태」로

「인민민주주의」라는 말은 1945년부터 각국 공산당이 자기 체제를 부르는 이름이었고, 1947년까지 그 뜻은 소비에트 체제와 구별되는 무엇이었다. 게오르기 디미트로프는 1945~46년의 연설에서 불가리아가 소비에트 공화국이 아니라 인민공화국이 될 것이며, 프롤레타리아 독재 없이도 사회주의로 갈 수 있다고 말했다. 브와디스와프 고무우카는 1946년 11월 「폴란드의 사회주의로 가는 길」을 제목으로 강연하며 프롤레타리아 독재와 집단화 없이 가는 독자적인 경로를 말했다. 고트발트도 「체코슬로바키아의 독자적인 길」을 말했다.

이 표현들은 각국 당의 임기응변이 아니었다. 디미트로프의 일기에 따르면 1946년 9월 스탈린은 불가리아 대표단에게 소비에트 형태를 거치지 않고도 사회주의로 갈 수 있으며, 그 경우 프롤레타리아 독재는 불필요하다고 말했다. 모스크바에서는 예브게니 바르가가 1946년의 저서와 1947년의 논문 「새로운 형태의 민주주의」에서 이 나라들의 체제를 자본주의도 사회주의도 아닌 과도적 형태로 규정했다. 바르가의 책은 1947년 5월 경제학연구소 토론에서 비판을 받았고, 연구소는 그해 가을 문을 닫았다.

전환은 1947년 9월 코민포름 창립회의에서 시작되었다. 안드레이 즈다노프의 「두 진영」 보고와 프랑스·이탈리아 공산당에 대한 비판, 유고슬라비아를 모범으로 내세운 논의는 마셜 플랜 항목에 정리되어 있다. 이 회의에서 고무우카는 코민포름 창설 자체에 유보를 표했고, 이 태도는 이듬해 그에 대한 비판의 근거가 되었다. 1948년 6월 코민포름이 유고슬라비아 공산당을 제명한 뒤, 각국 당은 자국의 「길」에 대해 자아비판을 했다.

정의가 바뀐 시점은 문서로 확인된다. 1948년 12월 19일 불가리아 공산당 제5차 대회에서 디미트로프는 「인민민주주의 정권과 소비에트 정권은 같은 권력, 곧 프롤레타리아 독재의 두 형태」라고 보고했다. 같은 달 폴란드 통합대회의 강령, 1949년의 헝가리·체코슬로바키아 당 문서가 같은 정식을 채택했다. 이로써 「인민민주주의」는 소비에트 모델의 대안이 아니라 소비에트 모델로 가는 이행 형태를 가리키는 말이 되었다. 소련과 각국 당의 공식 역사서술은 이후 이 시기를 「반파시즘 민주혁명이 사회주의 혁명으로 성장 전화한 과정」으로 서술했다.

## 1948년 이후: 당 안의 정리와 고문단

1948년 여름부터 각국 당은 자기 안을 정리하기 시작했다. 폴란드에서는 8월 31일부터 9월 3일까지의 중앙위원회 전원회의가 고무우카의 「우익 민족주의 편향」을 비판하고 서기장직에서 해임했으며, 볼레스와프 비에루트가 그 자리를 이었다. 고무우카는 1951년 8월 체포되어 재판 없이 1954년 12월까지 구금되었다. 루마니아에서는 1948년 2월 루크레치우 파트라슈카누가 지도부에서 제외되고 4월 체포되어 1954년 처형되었다. 알바니아에서는 유고슬라비아와 가까웠던 코치 조제가 1949년 6월 처형되었다.

공개 재판은 1949년에 시작되었다. 헝가리 전 내무장관 러이크 라슬로는 5월 30일 체포되어 9월 16일부터 24일까지 부다페스트에서 티토와 서방 정보기관을 위한 간첩 혐의로 재판을 받고 10월 15일 처형되었다. 재판의 준비에는 소련 국가보안부의 표도르 벨킨 중장이 참여했다. 불가리아에서는 부총리 트라이초 코스토프가 3월 지도부에서 물러나 6월 체포되었고, 12월 7일부터 14일까지의 재판에서 법정에서 자백을 철회했으나 12월 16일 처형되었다. 체코슬로바키아에서는 당 서기장 루돌프 슬란스키가 1951년 11월 체포되어 1952년 11월 20일부터 27일까지 재판을 받았고, 피고 열네 명 가운데 열한 명이 12월 3일 처형되었다. 이 재판들의 피고는 1956년 이후 각국에서 복권되었고, 러이크의 1956년 10월 6일 재매장에는 10만여 명이 모였다.

소련 고문단은 각국 보안기관과 군에 배치되었다. 헝가리 국가보위청, 폴란드 공안부, 체코슬로바키아 국가보안부에는 소련 국가보안부 고문이 상주했고, 러이크 재판과 슬란스키 재판의 신문 기록에 그들의 이름이 남아 있다. 군에서는 1949년 11월 7일 소련 원수 콘스탄틴 로코솝스키가 폴란드 국방장관에 임명되어 폴란드 원수 계급을 받았고, 소련군 장교 수백 명이 폴란드군의 지휘부에 들어갔다. 경제에서는 루마니아·헝가리·불가리아에 소련이 지분을 가진 합작회사가 세워졌고, 소련과 각국의 양자조약은 바르샤바 조약 기구 항목이 정리한 대로 1945년 폴란드부터 1948년 불가리아까지 차례로 체결되었다.

1949년에 각국은 새 체제를 헌법으로 확정했다. 헝가리는 5월 15일 단일 명부 선거 뒤 8월 20일 헌법을 공포했고, 폴란드는 1952년, 루마니아는 1948년 4월, 불가리아는 1947년 12월, 체코슬로바키아는 1948년 5월에 헌법을 채택했다. 1949년 10월 7일 소련 점령지구에서 독일민주공화국이 세워졌다. 1949년 1월에는 경제상호원조회의가 출범했다.

## 해석의 갈래

이 5년에 대한 서술은 크게 네 갈래로 나뉜다.

소련과 각국 당의 공식 서술은 이 과정을 반파시즘 민족전선이 사회주의 혁명으로 발전한 것으로 설명했다. 붉은군대는 해방자였고, 토지개혁과 국유화는 다수 인민의 요구였으며, 연립의 다른 정당들은 반동 세력과 외국 정보기관에 연결되어 스스로를 배제했다는 것이다. 이 서술은 1949년 재판 기록과 각국 당사(黨史)에 남아 있고, 1956년 이후에는 재판 부분이 수정되었다.

서방의 초기 서술은 휴 시턴왓슨의 『동유럽 혁명』(1950)이 세운 틀을 따랐다. 그는 이 과정을 진짜 연립, 가짜 연립, 단일 정권의 세 단계로 나누고, 모스크바가 처음부터 정해 둔 순서에 따라 각국이 같은 길을 갔다고 보았다. 즈비그니에프 브제진스키의 『소비에트 블록』(1960)도 같은 전제 위에 있다. 이 독법에서 1945~46년의 연립과 「새로운 길」은 목적을 가리기 위한 단계였다.

1960~70년대의 수정주의 연구는 소련의 행동을 서방의 행동에 대한 대응으로 읽었다. 가브리엘 콜코, 게이르 룬데스타, 그리고 헝가리를 다룬 찰스 가티는 1947년까지 소련에 고정된 일정표가 없었고, 마셜 플랜과 트루먼 독트린 뒤에야 연립의 해체가 빨라졌다고 보았다. 헝가리·체코슬로바키아 선거의 결과가 나라마다 달랐다는 점, 1946년 스탈린이 각국에 서로 다른 조언을 했다는 점이 근거였다.

1991년 이후 문서고가 열리면서 논의는 다시 정리되었다. 노먼 네이마크와 레오니트 기비안스키가 엮은 『동유럽 공산정권의 수립, 1944~1949』(1997)는 각국의 경로가 달랐고 현지 공산당의 판단이 결과에 영향을 미쳤음을 보여주었다. 에두아르드 마크는 「단계적 혁명」(2001)에서 1941년부터 소련이 「민족전선」 전략을 세워 두었고, 연립 단계 자체가 그 설계의 일부였다고 주장했다. 마크 크레이머는 2009년 논문에서 스탈린에게 세부 청사진은 없었으나 소련의 통제라는 방향은 처음부터 있었고, 1947~48년의 가속은 마셜 플랜과 티토 결별에 대한 대응이었다고 정리했다. 앤 애플바움의 『철의 장막』(2012)은 동독·폴란드·헝가리를 비교하며 보안기관, 청년조직, 방송의 장악이 선거보다 먼저 이루어졌다는 점을 강조했다. 이보 바나츠가 편집한 디미트로프 일기(2003)와 줄리아노 프로카치 등이 편집한 코민포름 회의록(1994)은 이 논의의 1차 자료가 되었다.

네 갈래는 같은 사실을 다르게 배열한다. 1946년 9월 스탈린이 불가리아 대표단에게 한 말은 「새로운 길」이 진심이었다는 근거로도, 단계적 설계의 증거로도 읽힌다. 헝가리의 1945년 선거는 소련이 자유선거를 허용했다는 근거로도, 그 결과가 곧 뒤집혔다는 근거로도 쓰인다. 어느 쪽이든 논쟁의 대상은 의도이지 순서가 아니다.

## 1949년에 확정된 것과 그 뒤로 이어진 것

1949년 말의 동유럽에는 공통된 제도가 자리 잡았다. 공산당이 지도하는 단일 명부 의회, 국유화된 공업과 시작 단계의 농업 집단화, 소련과의 양자조약, 소련 고문단이 있는 군과 보안기관, 그리고 「프롤레타리아 독재의 한 형태」로 정의된 인민민주주의 헌법이 그것이다. 유고슬라비아만이 이 체계 밖에 있었다.

이 제도들은 그 뒤 40년의 사건들이 벌어지는 틀이 되었다. 1953년 6월 동베를린의 노동자 봉기, 1956년 포즈난과 부다페스트, 1968년 프라하, 1980년 그단스크의 사건들은 모두 이 시기에 세워진 당과 국가의 관계, 소련과 각국의 관계 안에서 일어났다. 1956년 헝가리의 너지 임레와 폴란드의 고무우카가 내건 것은 1946년의 「자국의 길」이었고, 1989년의 원탁회의는 1947년에 해체된 정당들의 이름을 다시 불러냈다. 1945년부터 1949년까지 세워진 것이 무엇이었는지에 대한 판단은 그 뒤에 일어난 일들에 대한 판단과 분리되지 않는다.$t$,
  $t$## Autumn 1944: Different Starting Points

When the Red Army crossed the Soviet frontier in the summer of 1944, the countries ahead of it stood in very different conditions. Poland was under German occupation, with a government-in-exile in London and, at home, two separate underground forces: the Home Army loyal to London and the People's Army linked to the communists. Romania, Hungary and Bulgaria were allies of Germany. Czechoslovakia's Beneš government in London had signed a treaty with the Soviet Union in December 1943, while in Yugoslavia and Albania communist-led partisans were liberating their countries by their own efforts.

In Poland, the Polish Committee of National Liberation issued its manifesto at Chełm on 22 July 1944 and established itself in Lublin. The committee was a Soviet-sponsored body that did not recognise the London government, and on 6 September it decreed land reform. While the Warsaw Uprising ran from August to October, Soviet forces remained on the east bank of the Vistula. On 31 December the committee proclaimed itself the provisional government, which the Soviet Union recognised on 5 January 1945.

In Romania, King Michael I arrested Marshal Antonescu on 23 August 1944 and took the country over to the Allied side. The governments of Constantin Sănătescu and Nicolae Rădescu included the National Peasants, the National Liberals, the Social Democrats and the Communists. In Bulgaria, after the Soviet Union declared war on 5 September and crossed the border on 8 September, the Fatherland Front took power in Sofia in the early hours of 9 September. The Front was a coalition of the Communist Party, the Agrarian Union, Zveno and the Social Democrats. From December into the following year a People's Court tried the regents, ministers and deputies of the old regime and passed some 2,700 death sentences; on 1 February 1945 three regents and twenty-two ministers were executed.

On 9 October in Moscow, Churchill and Stalin exchanged what became known as the percentages agreement. Churchill's note gave Romania 90 to 10 in the Soviet favour, Greece 90 to 10 in the British favour, Yugoslavia and Hungary 50 to 50, and Bulgaria 75 to 25; in the follow-up talks between Eden and Molotov, Hungary and Bulgaria were adjusted to 80 to 20. The document had no legal standing. What the two leaders understood by it can be seen in how the Soviet Union acted in Romania and Bulgaria, and Britain in Greece.

Under the armistice agreements, Allied Control Commissions were set up in Romania, Bulgaria and Hungary. In all three the chairman was a Soviet general. Kliment Voroshilov in Hungary, Sergei Biryuzov in Bulgaria (vice-chairman under Marshal Tolbukhin, and the working head) and the Soviet command in Romania held the final say over each government's decisions, while the American and British representatives were there to be informed. In Italy the arrangement had been the reverse, with the Western Allies leading the commission and the Soviet representative being informed, and the Soviet Union applied the Italian precedent directly to its own zones.

Stalin's words in April 1945, as reported by Milovan Djilas, compress the period: "This war is not as in the past; whoever occupies a territory also imposes on it his own social system. Everyone imposes his own system as far as his army can reach. It cannot be otherwise."

## Coalition Governments and Elections, 1945–1946

Every government of 1945 was a coalition of several parties. In Poland, under the Yalta agreement, the Provisional Government of National Unity was formed on 28 June with Stanisław Mikołajczyk, the former prime minister of the London government, as deputy prime minister and minister of agriculture; the United States and Britain recognised it on 5 July. In Hungary a Provisional National Assembly had met at Debrecen in December 1944, and in Czechoslovakia the Košice government programme of 5 April 1945 launched a National Front government of six parties. In the Soviet zone of Germany, Order No. 2 of the Soviet military administration permitted party activity on 10 June 1945, and the Communist Party was the first to be refounded the next day.

The ministries the communists held within the coalitions had something in common: the Ministry of Public Security in Poland, the Interior Ministry in Hungary (László Rajk from March 1946), in Czechoslovakia (Václav Nosek), in Romania (Teohari Georgescu) and in Bulgaria (Anton Yugov). The police and security services, and the agriculture ministries that carried out land reform, went to the communists; finance and foreign affairs mostly went to other parties.

Land reform was the coalitions' first joint undertaking everywhere. Poland in September 1944, Romania on 23 March 1945, Hungary on 17 March 1945 and the Soviet zone of Germany in September 1945 broke up the large estates. In Hungary 3.2 million hectares were confiscated and distributed to some 640,000 households. Most coalition parties supported these measures. The same was true of the nationalisation of major industry: Czechoslovakia's nationalisation decrees of October 1945 were issued in President Beneš's name, and Mikołajczyk's Peasant Party voted for Poland's nationalisation law of January 1946.

Election results differed from country to country. Hungary's general election of 4 November 1945 is counted the freest in Eastern Europe in this period: the Smallholders took 57.0 per cent, the Social Democrats 17.4, the Communists 17.0 and the National Peasants 6.9. The Smallholders had the seats to govern alone, but Voroshilov required the coalition to continue and the Smallholders agreed. Zoltán Tildy became prime minister, then president when the republic was proclaimed on 1 February 1946, and Ferenc Nagy succeeded him as prime minister. In Czechoslovakia's election of 26 May 1946 the Communists took 40.2 per cent in the Czech lands and 30.4 in Slovakia, 38 per cent nationally, and became the largest party, while in Slovakia the Democratic Party won 62 per cent. Klement Gottwald became prime minister.

The counts in Poland and Romania left a different legacy. The Polish government postponed the election and on 30 June 1946 held a referendum on three questions: abolition of the Senate, land reform and nationalisation, and the Oder-Neisse frontier. The official result on the first question was 68.2 per cent in favour; Mikołajczyk's Peasant Party, which had urged a "no" on that question, claimed that "no" had in fact won. Internal tallies found by Andrzej Paczkowski in Polish and Soviet archives after 1989 show 26.9 per cent in favour on the first question. Romania's election of 19 November 1946 was officially won by the communist-led Bloc of Democratic Parties with 69.8 per cent. Research on party documents and local tallies published in the 1990s points to the National Peasants having in fact held the majority. Bulgaria's Grand National Assembly election of 27 October 1946 gave the Fatherland Front 70.1 per cent (the Communist Party 53.2) and the opposition 28.3, with the opposition led by Nikola Petkov's Agrarians taking 101 seats.

In the Landtag elections of 20 October 1946 in the Soviet zone of Germany, the Socialist Unity Party took 47.5 per cent across the five states and a majority in none; in the four-power Berlin city election the same day, the Social Democrats took 48.7 per cent and the Socialist Unity Party 19.8.

## The Coalitions Come Apart, 1947

In 1947 the other coalition parties left government or were dissolved in every country. The order and the method differed.

Poland's election was held on 19 January 1947. The official result gave the Democratic Bloc of the Workers' Party, the Socialists and the Democrats 80.1 per cent and the Peasant Party 10.3. Dozens of Peasant Party candidates had been arrested before the vote, and the party's lists were invalidated in several districts. Mikołajczyk left Poland for Britain on 21 October.

In Hungary, in March 1946 the Communists, Social Democrats, National Peasants and the trade unions formed a "Left Bloc" and demanded the expulsion of "reactionary" deputies from the Smallholders. The Smallholders expelled twenty deputies on 12 March. In January 1947 an investigation into a "conspiracy against the republic" began and Smallholder figures were arrested one after another; when parliament refused on 25 February to lift the immunity of the party's general secretary Béla Kovács, the Soviet authorities arrested him themselves on charges of espionage against the Red Army and took him to the Soviet Union. Prime Minister Ferenc Nagy, on holiday in Switzerland, resigned on 30 May; his young son was still in Budapest, and the resignation was exchanged for the boy's departure. In the election of 31 August the Communists became the largest party with 22.3 per cent. The vote is known by the "blue ballots" issued in large numbers to allow voting outside one's own district, and the fraudulent votes are estimated at around 60,000. After the election the Hungarian Independence Party, which had taken 13.4 per cent, had its seats annulled. Looking back in a lecture at the party's higher school in February 1952, Mátyás Rákosi said the opposition had been cut off "like a salami, slice by slice", and the phrase became a name for the period.

In Bulgaria, on 5 June 1947 parliament stripped Petkov of his immunity and he was arrested in the chamber. Tried in August on charges of plotting a military coup, he was sentenced to death and hanged on 23 September, eight days after the Paris peace treaty came into force on 15 September. His Agrarian Union was dissolved on 26 August. In Romania, the National Peasant leadership was arrested on 14 July at Tămădău airfield while attempting to leave the country, and the party was dissolved on 29 July. Iuliu Maniu was tried from 29 October to 11 November, sentenced to hard labour for life, and died in Sighet prison in 1953. In early November Gheorghe Tătărescu of the National Liberals left the foreign ministry and Ana Pauker took his place. On 30 December Petru Groza and Gheorghe Gheorghiu-Dej presented King Michael I with an act of abdication, which he signed the same day. The Romanian People's Republic was proclaimed that evening.

Czechoslovakia was the only country that kept a multi-party system and a free press to the end of 1947. The cabinet crisis of February 1948 and the formation of the Gottwald government are covered in the Marshall Plan entry. A new constitution was adopted on 9 May, a single-list election held on 30 May, and Beneš resigned on 7 June; Gottwald became president on the 14th.

## Two Parties Become One, 1946–1948

The merger of the social democratic parties into the communist parties ran alongside the break-up of the coalitions. The first case was the Soviet zone of Germany. On 21 and 22 April 1946 in Berlin the zonal organisations of the Communist and Social Democratic parties were united as the Socialist Unity Party of Germany, with Wilhelm Pieck and Otto Grotewohl as co-chairmen. Before the merger, on 31 March, Social Democratic members in the Western sectors of Berlin held a ballot in which 82 per cent opposed immediate unification; in the Soviet sector the ballot was not permitted. In 1948 the Socialist Unity Party declared itself a "party of a new type" and began vetting its former Social Democrats.

In Romania the Communists and Social Democrats merged as the Romanian Workers' Party from 21 to 23 February 1948. In Hungary the Social Democratic Party merged with the Communists on 12 June 1948 to form the Hungarian Working People's Party, the Social Democrats who had opposed the merger having already been expelled. The Czechoslovak Social Democrats were absorbed into the Communist Party on 27 June 1948, and the Bulgarian Social Democrats on 11 August. In Poland, at the Unification Congress in Warsaw from 15 to 21 December, the Workers' Party and the Socialist Party formed the Polish United Workers' Party; before the congress the Socialists had expelled some 80,000 of their own members in an internal vetting.

In form the mergers were unions of equals in every country; in substance they incorporated social democratic members into the communist organisation. The composition of the new leaderships, the re-registration of members after the merger, and the vetting for "social democratic deviation" show as much. Of the social democratic leaders who accepted the merger, Józef Cyrankiewicz in Poland and Grotewohl in East Germany remained in the new leaderships; Árpád Szakasits in Hungary was arrested in 1950.

## From the "New Road" to "a Form of the Dictatorship of the Proletariat"

"People's democracy" was the name each communist party gave its system from 1945, and until 1947 the term meant something distinct from the Soviet system. In speeches of 1945 and 1946 Georgi Dimitrov said that Bulgaria would be a people's republic rather than a Soviet republic and could reach socialism without a dictatorship of the proletariat. In November 1946 Władysław Gomułka lectured on "the Polish road to socialism", a distinct path without the dictatorship of the proletariat or collectivisation. Gottwald likewise spoke of "Czechoslovakia's own road".

These formulations were not improvisations by the national parties. According to Dimitrov's diary, in September 1946 Stalin told a Bulgarian delegation that socialism could be reached without passing through the Soviet form, and that in that case a dictatorship of the proletariat was unnecessary. In Moscow, Evgeny Varga's book of 1946 and his 1947 article "Democracy of a New Type" defined these systems as a transitional form that was neither capitalist nor socialist. Varga's book was criticised at a discussion of the Institute of Economics in May 1947, and the institute was closed that autumn.

The turn began at the founding conference of the Cominform in September 1947. Andrei Zhdanov's "two camps" report, the criticism of the French and Italian parties and the presentation of Yugoslavia as the model are set out in the Marshall Plan entry. At that conference Gomułka expressed reservations about creating the Cominform at all, and his stance became grounds for the criticism of him the following year. After the Cominform expelled the Yugoslav party in June 1948, each party made self-criticism over its own "road".

The moment the definition changed is documented. At the Fifth Congress of the Bulgarian Communist Party on 19 December 1948, Dimitrov reported that "the people's democratic regime and the Soviet regime are two forms of one and the same power, the dictatorship of the proletariat". The programme of the Polish unification congress the same month and the Hungarian and Czechoslovak party documents of 1949 adopted the same formula. "People's democracy" thereby ceased to denote an alternative to the Soviet model and came to denote a transitional form on the way to it. The official histories of the Soviet Union and of each party thereafter described the period as "the growing-over of the anti-fascist democratic revolution into the socialist revolution".

## After 1948: Settling Accounts Inside the Parties, and the Advisers

From the summer of 1948 each party began to put its own house in order. In Poland the Central Committee plenum of 31 August to 3 September condemned Gomułka's "rightist-nationalist deviation" and removed him as general secretary; Bolesław Bierut took his place. Gomułka was arrested in August 1951 and held without trial until December 1954. In Romania, Lucrețiu Pătrășcanu was dropped from the leadership in February 1948, arrested in April and executed in 1954. In Albania, Koçi Xoxe, who had been close to Yugoslavia, was executed in June 1949.

The public trials began in 1949. László Rajk, Hungary's former interior minister, was arrested on 30 May, tried in Budapest from 16 to 24 September as a spy for Tito and Western intelligence, and executed on 15 October. Lieutenant General Fyodor Belkin of the Soviet Ministry of State Security took part in preparing the case. In Bulgaria the deputy prime minister Traicho Kostov was removed from the leadership in March and arrested in June; at his trial from 7 to 14 December he withdrew his confession in open court, and he was executed on 16 December. In Czechoslovakia the party's general secretary Rudolf Slánský was arrested in November 1951 and tried from 20 to 27 November 1952; eleven of the fourteen defendants were executed on 3 December. The defendants in these trials were rehabilitated in their countries after 1956, and some 100,000 people attended Rajk's reburial on 6 October 1956.

Soviet advisers were placed in each security service and army. Advisers from the Soviet Ministry of State Security sat in the Hungarian State Protection Authority, the Polish Ministry of Public Security and the Czechoslovak State Security, and their names appear in the interrogation records of the Rajk and Slánský cases. In the armies, Soviet Marshal Konstantin Rokossovsky was appointed Poland's minister of national defence on 7 November 1949 and given the rank of Marshal of Poland, and several hundred Soviet officers entered the Polish command. In the economy, joint companies with Soviet shareholdings were set up in Romania, Hungary and Bulgaria, and the bilateral treaties between the Soviet Union and each country were concluded in turn from Poland in 1945 to Bulgaria in 1948, as the Warsaw Pact entry sets out.

In 1949 each country fixed the new order in a constitution. Hungary promulgated its constitution on 20 August after a single-list election on 15 May; Poland adopted its constitution in 1952, Romania in April 1948, Bulgaria in December 1947 and Czechoslovakia in May 1948. On 7 October 1949 the German Democratic Republic was founded in the Soviet zone. In January 1949 the Council for Mutual Economic Assistance was established.

## The Readings

Accounts of these five years fall into four broad lines.

The official account of the Soviet Union and of each party explained the process as the development of an anti-fascist national front into a socialist revolution. The Red Army was a liberator, land reform and nationalisation were the demands of the majority, and the other coalition parties had excluded themselves through their links to reactionary forces and foreign intelligence services. This account survives in the trial records of 1949 and in the party histories, with the trial portions revised after 1956.

Early Western accounts followed the frame set by Hugh Seton-Watson's The East European Revolution (1950). He divided the process into three stages, genuine coalition, bogus coalition and monolithic regime, and held that each country followed the same path in an order fixed in Moscow from the start. Zbigniew Brzezinski's The Soviet Bloc (1960) rests on the same premise. In this reading the coalitions of 1945–46 and the "new road" were stages that concealed the end.

The revisionist scholarship of the 1960s and 1970s read Soviet conduct as a response to Western conduct. Gabriel Kolko, Geir Lundestad and, on Hungary, Charles Gati held that the Soviet Union had no fixed timetable before 1947 and that the break-up of the coalitions accelerated only after the Marshall Plan and the Truman Doctrine. The differing outcomes of the Hungarian and Czechoslovak elections, and the differing advice Stalin gave each country in 1946, were the evidence.

The opening of the archives after 1991 reordered the debate. The Establishment of Communist Regimes in Eastern Europe, 1944–1949 (1997), edited by Norman Naimark and Leonid Gibianskii, showed that the paths differed by country and that the judgements of the local parties affected the outcomes. Eduard Mark, in "Revolution by Degrees" (2001), argued that the Soviet Union had a "national front" strategy from 1941 and that the coalition stage was itself part of the design. Mark Kramer, in a 2009 essay, concluded that Stalin had no detailed blueprint but that the direction of Soviet control was present from the start, and that the acceleration of 1947–48 was a response to the Marshall Plan and the break with Tito. Anne Applebaum's Iron Curtain (2012), comparing East Germany, Poland and Hungary, stressed that control of the security services, youth organisations and broadcasting came before the elections. Dimitrov's diary, edited by Ivo Banac (2003), and the Cominform minutes edited by Giuliano Procacci and others (1994) became the primary sources of this discussion.

The four lines arrange the same facts differently. Stalin's words to the Bulgarian delegation in September 1946 are read both as evidence that the "new road" was meant and as evidence of a staged design. Hungary's election of 1945 is cited both as proof that the Soviet Union allowed a free election and as proof that its result was soon overturned. In either case what is disputed is intention, not sequence.

## What Was Fixed by 1949, and What Followed

By the end of 1949 a common set of institutions was in place across Eastern Europe: a single-list parliament led by the communist party, nationalised industry and the beginnings of agricultural collectivisation, a bilateral treaty with the Soviet Union, an army and a security service with Soviet advisers, and a people's democratic constitution defined as "a form of the dictatorship of the proletariat". Only Yugoslavia stood outside the system.

These institutions were the frame within which the events of the next forty years took place. The workers' rising in East Berlin in June 1953, Poznań and Budapest in 1956, Prague in 1968 and Gdańsk in 1980 all occurred inside the relationship between party and state, and between the Soviet Union and each country, that was built in these years. What Imre Nagy in Hungary and Gomułka in Poland raised in 1956 was the "own road" of 1946, and the round tables of 1989 recalled the names of the parties dissolved in 1947. A judgement on what was built between 1945 and 1949 is not separable from a judgement on what happened afterwards.$t$,
  $$[
    {"date":"1944.07.22","title":{"ko":"루블린 위원회의 선언","en":"The Lublin Committee's manifesto"},"body":{"ko":"폴란드민족해방위원회가 헤움에서 선언문을 내고 루블린에 자리 잡았다. 소련이 후원한 이 위원회는 런던 망명정부를 인정하지 않았고, 12월 31일 스스로 임시정부를 선포했다.","en":"The Polish Committee of National Liberation issued its manifesto at Chełm and settled in Lublin. Sponsored by the Soviet Union, it did not recognise the London government and proclaimed itself the provisional government on 31 December."}},
    {"date":"1944.09.09","title":{"ko":"소피아의 조국전선 정권","en":"The Fatherland Front takes power in Sofia"},"body":{"ko":"소련의 선전포고와 진주 직후 공산당·농민동맹·즈베노·사회민주당의 조국전선이 소피아에서 정권을 잡았다. 12월부터 인민재판소가 전 정권 인사들을 재판했다.","en":"Days after the Soviet declaration of war and entry, the Fatherland Front of Communists, Agrarians, Zveno and Social Democrats took power in Sofia. From December a People's Court tried the figures of the old regime."}},
    {"date":"1944.10.09","title":{"ko":"모스크바의 백분율 협정","en":"The percentages agreement in Moscow"},"body":{"ko":"처칠과 스탈린이 루마니아·그리스·유고슬라비아·헝가리·불가리아에 대한 영향력 비율을 쪽지로 주고받았다. 법적 효력은 없었으나 두 나라의 이후 행동과 맞아떨어졌다.","en":"Churchill and Stalin exchanged a note giving percentages of influence in Romania, Greece, Yugoslavia, Hungary and Bulgaria. It had no legal force, but the subsequent conduct of both countries matched it."}},
    {"date":"1945.03.06","title":{"ko":"부쿠레슈티의 그로자 정부","en":"The Groza government in Bucharest"},"body":{"ko":"소련 외무부차관 비신스키가 국왕 미하이 1세에게 러데스쿠 정부의 해임을 요구한 뒤, 농민전선의 페트루 그로자가 이끄는 정부가 들어섰다. 3월 23일 토지개혁이 공포되었다.","en":"After Soviet deputy foreign minister Vyshinsky demanded that King Michael I dismiss the Rădescu government, a government led by Petru Groza of the Ploughmen's Front took office. Land reform was decreed on 23 March."}},
    {"date":"1945.11.04","title":{"ko":"헝가리 총선","en":"Hungary's general election"},"body":{"ko":"소농당이 57.0%, 사회민주당 17.4%, 공산당 17.0%를 얻었다. 연합국 통제위원회 위원장 보로실로프의 요구로 연립정부가 유지되었고, 공산당은 내무부를 맡았다.","en":"The Smallholders took 57.0 per cent, the Social Democrats 17.4 and the Communists 17.0. At the insistence of Voroshilov, chairman of the Allied Control Commission, the coalition continued, with the Communists holding the interior ministry."}},
    {"date":"1946.04.22","title":{"ko":"독일사회통일당 창당","en":"The Socialist Unity Party is founded"},"body":{"ko":"소련 점령지구의 공산당과 사회민주당이 베를린에서 통합했다. 3주 전 서방 점령 구역의 사회민주당원 82%가 즉각 통합에 반대하는 투표를 했으나, 소련 점령 구역에서는 투표가 허용되지 않았다.","en":"The Communist and Social Democratic parties of the Soviet zone merged in Berlin. Three weeks earlier 82 per cent of Social Democrats in the Western sectors had voted against immediate unification; no ballot was permitted in the Soviet sector."}},
    {"date":"1947.01.19","title":{"ko":"폴란드 총선","en":"Poland's general election"},"body":{"ko":"공식 결과는 민주블록 80.1%, 농민당 10.3%였다. 선거 전 농민당 후보들이 체포되고 여러 선거구의 명부가 무효 처리되었다. 미코와이치크는 10월에 폴란드를 떠났다.","en":"The official result gave the Democratic Bloc 80.1 per cent and the Peasant Party 10.3. Peasant Party candidates had been arrested before the vote and the party's lists invalidated in several districts. Mikołajczyk left Poland in October."}},
    {"date":"1947.05.30","title":{"ko":"너지 페렌츠의 사임","en":"Ferenc Nagy resigns"},"body":{"ko":"2월 소련 당국이 소농당 사무총장 코바치 벨러를 직접 체포한 뒤, 총리 너지 페렌츠가 스위스 휴가 중 사임했다. 8월 31일 「푸른 투표용지」 선거에서 공산당이 22.3%로 제1당이 되었다.","en":"After the Soviet authorities arrested the Smallholders' general secretary Béla Kovács in February, Prime Minister Ferenc Nagy resigned while on holiday in Switzerland. In the \"blue ballot\" election of 31 August the Communists became the largest party with 22.3 per cent."}},
    {"date":"1947.09.23","title":{"ko":"페트코프 처형","en":"Petkov is executed"},"body":{"ko":"6월 국회에서 체포된 불가리아 야당 지도자 니콜라 페트코프가 군사 쿠데타 음모 혐의로 사형 선고를 받고 교수형에 처해졌다. 파리 평화조약 발효 여드레 뒤였다.","en":"Nikola Petkov, the Bulgarian opposition leader arrested in parliament in June, was hanged after being sentenced to death for plotting a military coup, eight days after the Paris peace treaty came into force."}},
    {"date":"1947.12.30","title":{"ko":"미하이 1세의 퇴위","en":"Michael I abdicates"},"body":{"ko":"그로자와 게오르기우데지가 국왕에게 퇴위 문서를 제시했고, 국왕은 같은 날 서명했다. 그날 저녁 루마니아인민공화국이 선포되었다. 마니우는 11월에 종신형을 선고받은 뒤였다.","en":"Groza and Gheorghiu-Dej presented the king with an act of abdication, which he signed the same day. The Romanian People's Republic was proclaimed that evening. Maniu had been sentenced to life imprisonment in November."}},
    {"date":"1948.12.19","title":{"ko":"디미트로프의 제5차 당대회 보고","en":"Dimitrov's report to the Fifth Congress"},"body":{"ko":"불가리아 공산당 제5차 대회에서 디미트로프는 인민민주주의 정권과 소비에트 정권이 「프롤레타리아 독재의 두 형태」라고 보고했다. 같은 달 폴란드 통합대회가 같은 정식을 채택했다.","en":"At the Fifth Congress of the Bulgarian Communist Party, Dimitrov reported that the people's democratic and Soviet regimes were \"two forms of the dictatorship of the proletariat\". The Polish unification congress adopted the same formula that month."}},
    {"date":"1949.09.24","title":{"ko":"러이크 재판 판결","en":"Verdict in the Rajk trial"},"body":{"ko":"헝가리 전 내무장관 러이크 라슬로가 부다페스트에서 티토와 서방 정보기관을 위한 간첩 혐의로 사형을 선고받았다. 12월 소피아의 코스토프 재판, 1952년 프라하의 슬란스키 재판이 이어졌다.","en":"László Rajk, Hungary's former interior minister, was sentenced to death in Budapest as a spy for Tito and Western intelligence. The Kostov trial in Sofia in December and the Slánský trial in Prague in 1952 followed."}}
  ]$$::jsonb,
  $$[
    {"lat":55.75,"lng":37.62,"kind":"main","label":{"ko":"모스크바","en":"Moscow"}},
    {"lat":52.23,"lng":21.01,"label":{"ko":"바르샤바","en":"Warsaw"}},
    {"lat":51.25,"lng":22.57,"label":{"ko":"루블린","en":"Lublin"}},
    {"lat":52.52,"lng":13.40,"label":{"ko":"베를린","en":"Berlin"}},
    {"lat":50.08,"lng":14.44,"label":{"ko":"프라하","en":"Prague"}},
    {"lat":47.50,"lng":19.04,"label":{"ko":"부다페스트","en":"Budapest"}},
    {"lat":44.43,"lng":26.10,"label":{"ko":"부쿠레슈티","en":"Bucharest"}},
    {"lat":42.70,"lng":23.32,"label":{"ko":"소피아","en":"Sofia"}}
  ]$$::jsonb,
  $$[
    "Norman Naimark and Leonid Gibianskii, eds., The Establishment of Communist Regimes in Eastern Europe, 1944–1949, Westview Press, 1997",
    "Ivo Banac, ed., The Diary of Georgi Dimitrov, 1933–1949, Yale University Press, 2003",
    "Giuliano Procacci et al., eds., The Cominform: Minutes of the Three Conferences 1947/1948/1949, Feltrinelli, 1994",
    "Eduard Mark, “Revolution by Degrees: Stalin's National-Front Strategy for Europe, 1941–1947,” Cold War International History Project Working Paper 31, 2001",
    "Mark Kramer, “Stalin, Soviet Policy, and the Consolidation of a Communist Bloc in Eastern Europe, 1944–53,” in Vladimir Tismaneanu, ed., Stalinism Revisited, CEU Press, 2009",
    "Hugh Seton-Watson, The East European Revolution, Methuen, 1950",
    "Charles Gati, Hungary and the Soviet Bloc, Duke University Press, 1986",
    "Anne Applebaum, Iron Curtain: The Crushing of Eastern Europe 1944–1956, Doubleday, 2012",
    "Tony Judt, Postwar: A History of Europe Since 1945, Penguin, 2005",
    "Andrzej Paczkowski, “Referendum z 30 czerwca 1946 r. Próba wstępnego bilansu,” in Referendum w Polsce i w Europie Wschodniej, 1993",
    "Milovan Djilas, Conversations with Stalin, Harcourt, 1962",
    "Georgi Dimitrov, Political Report to the Fifth Congress of the Bulgarian Communist Party, 19 December 1948"
  ]$$::jsonb
);

INSERT INTO commulingo_history_event_people
  (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('eastern-europe-peoples-democracies', 'stalin', 0, 'leader',
   '소련 지도자', 'Soviet leader',
   '1944년 처칠과 백분율 협정을 나누었고, 1946년 9월 불가리아 대표단에게 소비에트 형태를 거치지 않는 길을 말했으며, 1947년 코민포름 창설과 1948년 유고슬라비아 제명을 지시했다.',
   'He exchanged the percentages agreement with Churchill in 1944, told a Bulgarian delegation in September 1946 of a road that bypassed the Soviet form, and directed the founding of the Cominform in 1947 and the expulsion of Yugoslavia in 1948.'),
  ('eastern-europe-peoples-democracies', 'molotov', 1, 'leader',
   '소련 외무인민위원·외무장관', 'Soviet foreign minister',
   '백분율 협정의 후속 협의에서 헝가리·불가리아 비율을 조정했고, 1945년 12월 모스크바 외무장관 회의에서 루마니아·불가리아 정부 승인 조건을 협상했다.',
   'He adjusted the Hungarian and Bulgarian percentages in the follow-up talks and negotiated the terms for recognising the Romanian and Bulgarian governments at the Moscow foreign ministers'' conference of December 1945.'),
  ('eastern-europe-peoples-democracies', 'zhdanov', 2, 'leader',
   '코민포름 창립회의 보고자', 'Rapporteur at the founding of the Cominform',
   '1947년 9월 「두 진영」 보고로 각국의 「독자적인 길」 담론이 끝나는 전환점을 만들었다.',
   'His "two camps" report of September 1947 marked the turn that ended the talk of each country''s "own road".'),
  ('eastern-europe-peoples-democracies', 'vyshinsky', 3, 'executor',
   '부쿠레슈티에 파견된 외무부차관', 'Deputy foreign minister sent to Bucharest',
   '1945년 2월 27일 부쿠레슈티에 도착해 국왕 미하이 1세에게 러데스쿠 정부의 해임과 그로자 정부의 수립을 요구했다.',
   'He arrived in Bucharest on 27 February 1945 and demanded that King Michael I dismiss the Rădescu government and install Groza.'),
  ('eastern-europe-peoples-democracies', 'voroshilov', 4, 'executor',
   '헝가리 연합국 통제위원회 위원장', 'Chairman of the Allied Control Commission in Hungary',
   '1945년 11월 소농당이 과반을 얻은 뒤에도 연립정부 유지와 공산당의 내무부 장악을 요구했다.',
   'After the Smallholders'' majority of November 1945 he required the coalition to continue and the interior ministry to go to the Communists.'),
  ('eastern-europe-peoples-democracies', 'sergei-biryuzov', 5, 'executor',
   '불가리아 연합국 통제위원회 부위원장', 'Vice-chairman of the Allied Control Commission in Bulgaria',
   '1944~47년 톨부힌 원수 아래 부위원장으로 소피아의 통제위원회 실무를 이끌며 조국전선 정부의 결정에 대한 승인권을 행사했다.',
   'As vice-chairman under Marshal Tolbukhin he ran the commission in Sofia from 1944 to 1947, exercising approval over the decisions of the Fatherland Front government.'),
  ('eastern-europe-peoples-democracies', 'dimitrov', 6, 'leader',
   '불가리아 총리, 인민민주주의 개념의 재정의자', 'Bulgarian prime minister who redefined people''s democracy',
   '1945~46년에는 불가리아가 소비에트 공화국이 아니라 인민공화국이 될 것이라 말했고, 1948년 12월 제5차 당대회에서 인민민주주의를 프롤레타리아 독재의 한 형태로 규정했다. 그의 일기는 이 시기의 핵심 사료다.',
   'In 1945–46 he said Bulgaria would be a people''s republic rather than a Soviet republic; at the Fifth Congress in December 1948 he defined people''s democracy as a form of the dictatorship of the proletariat. His diary is a central source for the period.'),
  ('eastern-europe-peoples-democracies', 'vasil-kolarov', 7, 'participant',
   '불가리아 공산당 지도부', 'Bulgarian Communist leadership',
   '1946년 공화국 선포 뒤 임시 국가원수를 맡았고, 1947년 12월부터 부총리 겸 외무장관, 1949년 디미트로프 사후 총리가 되었다.',
   'Provisional head of state after the proclamation of the republic in 1946, deputy prime minister and foreign minister from December 1947, and prime minister after Dimitrov''s death in 1949.'),
  ('eastern-europe-peoples-democracies', 'boleslaw-bierut', 8, 'executor',
   '폴란드 국가평의회 의장·대통령', 'Chairman of the Polish National Council, then president',
   '루블린 위원회 시기부터 국가원수 역할을 맡았고, 1948년 9월 고무우카를 대신해 노동자당 서기장이 되었다.',
   'Head of state from the Lublin Committee onward, he replaced Gomułka as general secretary of the Workers'' Party in September 1948.'),
  ('eastern-europe-peoples-democracies', 'wladyslaw-gomulka', 9, 'participant',
   '폴란드노동자당 서기장', 'General secretary of the Polish Workers'' Party',
   '1946년 11월 「폴란드의 사회주의로 가는 길」을 강연했고, 1947년 코민포름 창설에 유보를 표했으며, 1948년 9월 「우익 민족주의 편향」으로 해임되어 1951년 체포되었다.',
   'He lectured on "the Polish road to socialism" in November 1946, expressed reservations about founding the Cominform in 1947, was removed for "rightist-nationalist deviation" in September 1948 and arrested in 1951.'),
  ('eastern-europe-peoples-democracies', 'jakub-berman', 10, 'executor',
   '폴란드 정치국원, 보안 담당', 'Polish Politburo member in charge of security',
   '1944년부터 공안부와 이데올로기 부문을 관장했고, 1949년 이후 당내 조사와 재판 준비를 지휘했다.',
   'From 1944 he oversaw public security and ideology, and after 1949 directed the intra-party investigations and trial preparations.'),
  ('eastern-europe-peoples-democracies', 'stanisaw-mikoajczyk', 11, 'participant',
   '국민통일임시정부 부총리, 농민당 지도자', 'Deputy prime minister, leader of the Peasant Party',
   '1945년 6월 런던에서 돌아와 부총리 겸 농업장관이 되었고, 1946년 국민투표와 1947년 총선에서 농민당을 이끈 뒤 10월 폴란드를 떠났다.',
   'He returned from London in June 1945 as deputy prime minister and minister of agriculture, led the Peasant Party through the 1946 referendum and the 1947 election, and left Poland in October 1947.'),
  ('eastern-europe-peoples-democracies', 'konstantin-rokossovsky', 12, 'executor',
   '폴란드 국방장관에 임명된 소련 원수', 'Soviet marshal appointed Polish defence minister',
   '1949년 11월 7일 폴란드 국방장관에 임명되고 폴란드 원수 계급을 받았다.',
   'Appointed Poland''s minister of national defence on 7 November 1949 and given the rank of Marshal of Poland.'),
  ('eastern-europe-peoples-democracies', 'matyas-rakosi', 13, 'executor',
   '헝가리 공산당 서기장', 'General secretary of the Hungarian Communist Party',
   '1946년 좌익블록 결성과 1947년 소농당 해체를 이끌었고, 1952년 강연에서 이 과정을 「살라미처럼 한 조각씩」 잘라냈다고 표현했다.',
   'He led the formation of the Left Bloc in 1946 and the break-up of the Smallholders in 1947, and in a 1952 lecture described the process as cutting "like a salami, slice by slice".'),
  ('eastern-europe-peoples-democracies', 'laszlo-rajk', 14, 'target',
   '헝가리 내무장관, 1949년 재판의 피고', 'Hungarian interior minister, defendant in 1949',
   '1946년 3월부터 내무장관으로 국가보위청을 세우고 1947년의 체포와 정당 해산을 집행했으며, 1949년 9월 티토와 서방 정보기관을 위한 간첩 혐의로 재판을 받고 10월 처형되었다.',
   'Interior minister from March 1946, he built the State Protection Authority and carried out the arrests and party dissolutions of 1947; in September 1949 he was tried as a spy for Tito and Western intelligence and executed in October.'),
  ('eastern-europe-peoples-democracies', 'zoltan-tildy', 15, 'participant',
   '소농당 출신 총리·대통령', 'Smallholder prime minister, then president',
   '1945년 11월 총선 뒤 총리가 되었고, 1946년 2월 공화국 선포와 함께 대통령이 되어 1948년 7월까지 재임했다.',
   'Prime minister after the election of November 1945, he became president when the republic was proclaimed in February 1946 and served until July 1948.'),
  ('eastern-europe-peoples-democracies', 'klement-gottwald', 16, 'executor',
   '체코슬로바키아 총리, 대통령', 'Czechoslovak prime minister, then president',
   '1946년 총선 뒤 총리가 되어 「체코슬로바키아의 독자적인 길」을 말했고, 1948년 2월 이후 6월에 대통령이 되었다.',
   'Prime minister after the 1946 election, he spoke of "Czechoslovakia''s own road"; after February 1948 he became president in June.'),
  ('eastern-europe-peoples-democracies', 'edvard-bene', 17, 'participant',
   '체코슬로바키아 대통령', 'President of Czechoslovakia',
   '1943년 12월 소련과 조약을 맺었고, 1945년 10월 국유화 포고를 내렸으며, 1948년 6월 사임했다.',
   'He signed the treaty with the Soviet Union in December 1943, issued the nationalisation decrees of October 1945, and resigned in June 1948.'),
  ('eastern-europe-peoples-democracies', 'vaclav-nosek', 18, 'executor',
   '체코슬로바키아 내무장관', 'Czechoslovak interior minister',
   '1945년부터 내무부와 경찰을 맡았고, 1948년 2월 경찰 간부 교체가 내각 위기의 계기가 되었다.',
   'In charge of the interior ministry and police from 1945; his replacement of police officers in February 1948 was the trigger of the cabinet crisis.'),
  ('eastern-europe-peoples-democracies', 'rudolf-slansky', 19, 'target',
   '체코슬로바키아 공산당 서기장, 1952년 재판의 피고', 'General secretary of the Czechoslovak party, defendant in 1952',
   '1947년 코민포름 창립회의에서 국내 공세 전환을 선언했고, 1951년 11월 체포되어 1952년 11월 재판 뒤 12월 3일 처형되었다.',
   'He declared the turn to the domestic offensive at the founding of the Cominform in 1947, was arrested in November 1951, tried in November 1952 and executed on 3 December.'),
  ('eastern-europe-peoples-democracies', 'petru-groza', 20, 'executor',
   '루마니아 총리', 'Prime minister of Romania',
   '1945년 3월 6일 농민전선 지도자로 총리가 되었고, 1947년 12월 30일 게오르기우데지와 함께 국왕에게 퇴위 문서를 제시했다.',
   'Leader of the Ploughmen''s Front, he became prime minister on 6 March 1945 and, with Gheorghiu-Dej, presented the king with the act of abdication on 30 December 1947.'),
  ('eastern-europe-peoples-democracies', 'gheorghe-gheorghiu-dej', 21, 'executor',
   '루마니아 공산당 서기장', 'General secretary of the Romanian Communist Party',
   '1945년부터 당을 이끌었고, 1947년 국왕 퇴위와 1948년 노동자당 창당, 파트라슈카누 제거를 주도했다.',
   'He led the party from 1945 and directed the king''s abdication in 1947, the founding of the Workers'' Party in 1948 and the removal of Pătrășcanu.'),
  ('eastern-europe-peoples-democracies', 'ana-pauker', 22, 'executor',
   '루마니아 외무장관', 'Romanian foreign minister',
   '1947년 11월 터터레스쿠를 대신해 외무장관이 되었고, 당 서기국에서 게오르기우데지와 함께 지도부를 이루었다.',
   'She replaced Tătărescu as foreign minister in November 1947 and formed the leadership with Gheorghiu-Dej in the party secretariat.'),
  ('eastern-europe-peoples-democracies', 'iuliu-maniu', 23, 'target',
   '국민농민당 지도자, 1947년 재판의 피고', 'Leader of the National Peasant Party, tried in 1947',
   '1946년 총선에서 야당을 이끌었고, 1947년 7월 당 해산 뒤 11월 종신 중노동형을 선고받아 1953년 시게트 감옥에서 사망했다.',
   'He led the opposition in the 1946 election; after the party''s dissolution in July 1947 he was sentenced in November to hard labour for life and died in Sighet prison in 1953.'),
  ('eastern-europe-peoples-democracies', 'michael-i-of-romania', 24, 'participant',
   '루마니아 국왕', 'King of Romania',
   '1944년 8월 23일 안토네스쿠를 체포하고 연합국 측으로 돌아섰으며, 1945년 그로자 정부 수립을 받아들인 뒤 1947년 12월 30일 퇴위했다.',
   'He arrested Antonescu on 23 August 1944 and took Romania over to the Allies, accepted the Groza government in 1945, and abdicated on 30 December 1947.'),
  ('eastern-europe-peoples-democracies', 'walter-ulbricht', 25, 'executor',
   '독일사회통일당 지도부', 'Socialist Unity Party leadership',
   '1945년 4월 30일 모스크바에서 돌아와 소련 점령지구의 행정과 당 조직을 세웠고, 1946년 사회통일당 창당과 1948년 「새로운 형태의 당」 전환을 이끌었다.',
   'Returning from Moscow on 30 April 1945, he built the administration and party organisation of the Soviet zone and led the founding of the Socialist Unity Party in 1946 and its turn to a "party of a new type" in 1948.'),
  ('eastern-europe-peoples-democracies', 'wilhelm-pieck', 26, 'participant',
   '독일사회통일당 공동의장', 'Co-chairman of the Socialist Unity Party',
   '1946년 4월 공산당 측 공동의장이 되었고, 1949년 10월 독일민주공화국 초대 대통령이 되었다.',
   'Co-chairman on the Communist side from April 1946, he became the first president of the German Democratic Republic in October 1949.'),
  ('eastern-europe-peoples-democracies', 'otto-grotewohl', 27, 'participant',
   '사회민주당 측 통합 지도자', 'Social Democratic leader of the merger',
   '소련 점령지구 사회민주당을 이끌어 1946년 4월 통합에 서명했고, 1949년 독일민주공화국 초대 총리가 되었다.',
   'Leading the Social Democrats of the Soviet zone, he signed the merger in April 1946 and became the first prime minister of the German Democratic Republic in 1949.'),
  ('eastern-europe-peoples-democracies', 'enver-hoxha', 28, 'participant',
   '알바니아 공산당 지도자', 'Leader of the Albanian Communists',
   '1945년 12월 민주전선 단일 명부 선거와 1946년 1월 인민공화국 선포를 이끌었고, 1948년 티토 결별 뒤 코치 조제를 처형했다.',
   'He led the Democratic Front''s single-list election of December 1945 and the proclamation of the People''s Republic in January 1946, and after the break with Tito in 1948 had Koçi Xoxe executed.'),
  ('eastern-europe-peoples-democracies', 'evgeny-varga', 29, 'participant',
   '「새로운 형태의 민주주의」 이론가', 'Theorist of "democracy of a new type"',
   '1946년 저서와 1947년 논문에서 인민민주주의를 자본주의도 사회주의도 아닌 과도적 형태로 규정했다가 1947년 5월 비판을 받았다.',
   'In his 1946 book and 1947 article he defined people''s democracy as a transitional form that was neither capitalist nor socialist, and was criticised in May 1947.'),
  ('eastern-europe-peoples-democracies', 'winston-churchill', 30, 'participant',
   '백분율 협정의 상대', 'The other party to the percentages agreement',
   '1944년 10월 9일 모스크바에서 스탈린에게 영향력 비율을 적은 쪽지를 건넸고, 그리스에서 영국의 우위를 확보하는 대가로 루마니아·불가리아의 소련 우위를 받아들였다.',
   'On 9 October 1944 in Moscow he handed Stalin the note of percentages, accepting Soviet predominance in Romania and Bulgaria in return for British predominance in Greece.'),
  ('eastern-europe-peoples-democracies', 'leonid-gibianskii', 31, 'witness',
   '문서고 개방 이후의 연구를 정리한 역사학자', 'Historian of the post-archival scholarship',
   '네이마크와 함께 『동유럽 공산정권의 수립, 1944~1949』(1997)를 엮어 각국 경로의 차이를 정리했다.',
   'With Naimark he edited The Establishment of Communist Regimes in Eastern Europe, 1944–1949 (1997), setting out the differences between the national paths.'),
  ('eastern-europe-peoples-democracies', 'mark-kramer', 32, 'witness',
   '「청사진 없는 방향」 해석의 역사학자', 'Historian of the "direction without a blueprint" reading',
   '2009년 논문에서 스탈린에게 세부 계획은 없었으나 통제의 방향은 처음부터 있었고, 1947~48년의 가속은 마셜 플랜과 티토 결별에 대한 대응이었다고 정리했다.',
   'In a 2009 essay he concluded that Stalin had no detailed plan but that the direction of control was present from the start, and that the acceleration of 1947–48 responded to the Marshall Plan and the break with Tito.'),
  ('eastern-europe-peoples-democracies', 'anne-applebaum', 33, 'witness',
   '『철의 장막』의 저자', 'Author of Iron Curtain',
   '동독·폴란드·헝가리를 비교해 보안기관·청년조직·방송의 장악이 선거보다 먼저 이루어졌다고 정리했다.',
   'Comparing East Germany, Poland and Hungary, she set out how control of the security services, youth organisations and broadcasting preceded the elections.');

COMMIT;
