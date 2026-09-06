-- Hungary 1944–1949: one national document of the people's democracies
-- cluster (parent eastern-europe-peoples-democracies, sort_order 130, after
-- Poland 127, Romania 128 and Bulgaria 129), its cast, timeline and map.
--
-- The overview carries the phases and the change in the term "people's
-- democracy"; this document follows one country from the Debrecen assembly to
-- the Rajk verdict. Dates, official results and later estimates sit side by
-- side; evaluative labels (salami, coup) are attributed to the people who used
-- them; the readings section lists interpretations without adopting one.
--
-- Every person linked here already exists in the dictionary. Ferenc Nagy,
-- Béla Kovács, Lajos Dinnyés, Árpád Szakasits, József Mindszenty, Gábor
-- Péter, Dezső Sulyok and Zoltán Pfeiffer appear in the body only; a card for
-- each is a separate editorial decision.

BEGIN;

INSERT INTO commulingo_history_events (
  id, sort_order, period_label,
  title_ko, title_en, question_ko, question_en,
  summary_ko, summary_en, outcome_ko, outcome_en,
  body_ko, body_en, timeline, locations, sources, relations
) VALUES (
  'hungary-1945-1949', 130, '1944–1949',
  '헝가리: 소농당의 승리에서 러이크 재판까지', 'Hungary: From the Smallholders'' Victory to the Rajk Trial',
  '1945년 11월 소농당이 과반을 얻은 나라에서, 1949년까지 권력은 어떤 순서로 공산당에 모였는가?',
  'In the country where the Smallholders won a majority in November 1945, in what order did power pass to the Communist Party by 1949?',
  $t$1944년 12월 데브레첸의 임시국민의회에서 출발한 헝가리의 전후 정치는 1945년 11월 4일 총선에서 소농당이 57%를 얻은 데서 시작한다. 연합국 통제위원회 위원장 보로실로프의 요구로 4당 연립이 유지되었고, 내무부는 공산당이 맡았다. 1946년 3월 좌익블록이 소농당 의원 축출을 요구했고, 1947년 2월 소련군이 소농당 사무총장 코바치 벨러를 체포했으며, 5월 총리 너지 페렌츠가 국외에서 사임했다. 8월 31일 「푸른 투표용지」 선거에서 공산당은 22.3%로 제1당이 되었다. 1948년 6월 사회민주당이 공산당과 통합했고, 12월 민드센티 추기경이 체포되었다. 1949년 5월 단일 명부 선거와 8월 20일 헌법으로 인민공화국이 세워졌고, 9월 전 내무장관 러이크 라슬로가 재판을 받아 10월 처형되었다.$t$,
  $t$Hungary's post-war politics began at the Provisional National Assembly in Debrecen in December 1944 and took shape with the general election of 4 November 1945, in which the Smallholders won 57 per cent. At the demand of Voroshilov, chairman of the Allied Control Commission, the four-party coalition continued and the interior ministry went to the Communists. In March 1946 the Left Bloc demanded the expulsion of Smallholder deputies; in February 1947 Soviet forces arrested the Smallholders' general secretary Béla Kovács; in May Prime Minister Ferenc Nagy resigned from abroad. In the "blue ballot" election of 31 August the Communists became the largest party with 22.3 per cent. The Social Democrats merged with the Communists in June 1948, and Cardinal Mindszenty was arrested in December. A single-list election in May 1949 and the constitution of 20 August established the People's Republic; in September the former interior minister László Rajk was tried, and he was executed in October.$t$,
  $t$1949년 말 헝가리에는 헝가리근로자당이 지도하는 단일 명부 의회, 8월 20일 헌법, 종업원 100인 이상 기업까지 국유화된 공업, 국가보위청과 소련 고문단, 1948년 2월의 소련-헝가리 조약이 자리 잡았다. 소농당과 사회민주당은 이름만 남거나 흡수되었고, 그 지도자들은 망명(너지 페렌츠, 파이퍼 졸탄), 소련 억류(코바치 벨러), 연금(틸디 졸탄), 투옥(서커시치 아르파드, 1950)으로 갈렸다. 러이크 재판은 1949~52년 동유럽 전시재판의 첫 사례가 되었고, 1956년 3월 복권과 10월 6일 재매장은 [헝가리 혁명](/commulingo/events/hungarian-revolution)의 서막이 되었다. 코바치 벨러는 1955년 소련에서 돌아와 1956년 너지 임레 정부의 장관이 되었다.$t$,
  $t$By the end of 1949 Hungary had a single-list parliament led by the Hungarian Working People's Party, the constitution of 20 August, industry nationalised down to firms of a hundred employees, the State Protection Authority with its Soviet advisers, and the Soviet-Hungarian treaty of February 1948. The Smallholders and Social Democrats survived in name only or were absorbed, and their leaders went into exile (Ferenc Nagy, Zoltán Pfeiffer), Soviet custody (Béla Kovács), house arrest (Zoltán Tildy) or prison (Árpád Szakasits, 1950). The Rajk trial became the first of the Eastern European show trials of 1949–52; his rehabilitation in March 1956 and reburial on 6 October were the prelude to the [Hungarian Revolution](/commulingo/events/hungarian-revolution). Béla Kovács returned from the Soviet Union in 1955 and served in Imre Nagy's government in 1956.$t$,
  $t$## 데브레첸: 임시국민의회와 휴전협정

붉은군대는 1944년 9월 말 헝가리 국경을 넘어 12월까지 동부와 남부를 점령했고, 부다페스트는 12월 26일 포위되어 1945년 2월 13일 함락되었다. 그 사이 1944년 12월 21일 데브레첸에서 임시국민의회가 열렸다. 소련군 점령 지역에서 뽑힌 대의원 230명은 공산당, 사회민주당, 소농당, 국민농민당과 노동조합의 대표였고, 12월 22일 미클로시 벨러 장군을 총리로 하는 임시정부가 세워졌다. 미클로시는 호르티의 장군으로 10월 소련 측에 넘어온 인물이었다. 내각 12명 가운데 공산당원은 농업장관 너지 임레와 통상장관 가보르 요제프였고, 국방장관과 내무장관은 소농당과 국민농민당 몫이었다.

1945년 1월 20일 모스크바에서 휴전협정이 서명되었다. 헝가리는 1937년 12월 31일 국경으로 돌아가고, 6년간 3억 달러의 배상(소련 2억, 유고슬라비아 7천만, 체코슬로바키아 3천만)을 물며, 연합국 통제위원회의 감독을 받기로 했다. 위원장은 클리멘트 보로실로프 원수였고 정치고문으로 게오르기 푸시킨이 있었다. 미국과 영국 대표는 통보를 받는 자리였다. 위원회는 정당의 허가, 언론 인가, 정부 인사에 대해 발언했고, 소련군은 휴전협정에 따라 주둔했다. 이 구도는 1947년 9월 평화조약 발효로 위원회가 해산될 때까지 이어졌다.

점령 초기의 조건도 정치의 출발점이었다. 소련군은 1944년 말부터 1945년 초에 걸쳐 헝가리 민간인 수십만 명을 「말렌키 로보트」(잠깐의 노동)라는 이름으로 소련의 노동수용소에 보냈고, 그 수는 연구에 따라 20만에서 60만 사이로 추계된다. 이들은 1947년 이후에야 돌아오기 시작했다. 배상과 점령군 유지비는 1945~46년 국가 지출의 절반 안팎을 차지했다.

전후 정치의 첫 결정은 정당의 범위였다. 임시정부는 1944년 12월의 「독립전선」 강령에 참여한 다섯 세력만 정당으로 허가했고, 전쟁 전의 정부여당과 극우 정당은 해산되었다. 1945년 1월 인민재판소가 설치되어 전시 지도자들을 재판했다. 전 총리 임레디 벨러, 바르도시 라슬로, 스토여이 되메, 살러시 페렌츠가 1946년까지 처형되었다.

## 토지개혁과 인플레이션

1945년 3월 17일 임시정부는 토지개혁 포고(600/1945)를 공포했다. 초안은 농업장관 너지 임레가 만들었고, 국민농민당과 소농당의 안이 토대가 되었다. 1천 홀드(약 575헥타르) 이상의 대토지는 전부, 100홀드 이상의 지주 토지는 일부가 몰수되었고, 전범과 화살십자당원의 토지는 규모에 상관없이 몰수되었다. 몰수된 토지는 약 320만 헥타르로 전국 농지의 3분의 1이 넘었고, 그 가운데 190만 헥타르가 64만 2천 가구에 분배되었다. 나머지는 국유림과 국영농장이 되었다. 헝가리의 대토지 소유는 1848년 이후 유럽에서 가장 집중된 편에 속했고, 개혁은 그것을 한 해 만에 끝냈다. 분배는 지역마다 토지청구위원회가 맡았고, 공산당은 이 위원회를 통해 농촌에 조직을 세웠다. 소농당은 개혁을 지지하면서도 절차의 위법을 문제 삼았다. 교회는 가장 큰 지주였던 만큼 가장 큰 피몰수자였고, 이 점은 1948년 교회와 국가의 충돌에서 다시 나타났다. 분배받은 농민 대부분은 5헥타르 안팎의 소농이 되었고, 1948년 8월 라코시가 집단화를 처음 언급할 때까지 새 소유는 안정된 것으로 보였다.

경제는 개혁보다 배상과 점령 비용에 눌렸다. 공장의 40%가 파괴되었고 철도 차량의 대부분이 없어졌으며, 소련은 배상 외에 독일 소유 자산을 접수해 소련-헝가리 합작회사를 세웠다. 정부는 지출을 화폐 발행으로 메웠고, 펭괴는 1945년 여름부터 1946년 7월까지 역사상 가장 빠른 인플레이션을 겪었다. 1946년 7월 10일 하루 물가 상승률은 350%에 이르렀고, 7월 말에는 10의 20제곱 펭괴 지폐가 인쇄되었다. 1946년 8월 1일 새 화폐 포린트가 도입되었다. 환율은 40만 조조(4×10²⁹) 펭괴에 1포린트였다. 안정화는 공산당의 게뢰 에르뇌와 버시 졸탄이 주도했고, 미국이 1945년 억류했던 헝가리 국립은행의 금을 돌려주면서 뒷받침되었다. 공산당은 이 성공을 자기 성과로 내세웠고, 안정화 뒤 국영 부문의 확대를 요구했다.

## 1945년 11월 4일 총선과 대연립

첫 시험은 10월 7일 부다페스트 시의회 선거였다. 공산당과 사회민주당은 공동 명부로 나섰고 소농당이 50.5%, 노동자 공동 명부가 42.8%를 얻었다. 공산당이 예상하지 못한 결과였다. 보로실로프는 총선에서도 공동 명부와 의석 사전 배분을 요구했으나 소농당과 사회민주당이 거부했고, 11월 4일 총선은 정당별 명부로 치러졌다. 결과는 소농당 57.0%, 사회민주당 17.4%, 공산당 17.0%, 국민농민당 6.9%였다. 투표율은 92%였고 여성이 처음 투표했다.

소농당은 단독 정부를 꾸릴 의석(409석 중 245석)을 얻었지만, 보로실로프는 선거 전 합의를 근거로 4당 연립 유지를 요구했다. 소농당 지도부는 이를 받아들였다. 11월 15일 틸디 졸탄이 총리가 되었고, 내무부는 공산당의 너지 임레가 맡았다. 공산당은 내무부 외에 통상·교통을 얻었고, 사회민주당은 산업과 법무를, 소농당은 재무·국방·외무·농무를 가졌다. 1946년 2월 1일 국회는 왕정을 폐지하고 공화국을 선포했다. 틸디가 대통령이 되었고 소농당의 너지 페렌츠가 2월 4일 총리를 이었다. 3월 20일 내무장관은 러이크 라슬로로 바뀌었고, 그는 그해 국가보안기관을 재편해 국가보안국(ÁVO)을 세웠다.

연립 안에서 공산당은 의석의 17%로 내무부와 함께 경찰의 상급 인사권을 얻었고, 지방 행정에서는 「국민위원회」를 통해 1945년 봄부터 자리를 잡고 있었다. 사회민주당은 좌파의 서커시치 아르파드와 마로샨 죄르지가 공산당과의 협력을, 우파의 케트이 언너와 페이에르 카로이가 독자 노선을 주장했다. 국민농민당은 베레시 페테르가 이끌었고, 그 안에서도 에르데이 페렌츠 등 공산당에 가까운 인사들이 있었다.

미국은 1945년 11월 총선을 자유선거로 평가하고 임시정부를 승인했다. 이 선거는 이후 논쟁의 준거점이 되었다. 소련이 자유선거를 허용했다는 주장과, 그 결과가 정부 구성에 반영되지 않았다는 주장이 같은 사실에서 나온다.

## 좌익블록과 소농당의 분열

1946년 3월 5일 공산당·사회민주당·국민농민당과 노동조합평의회가 「좌익블록」을 결성하고 소농당 안의 「반동」 의원들의 축출을 요구했다. 3월 7일 부다페스트에서 수십만 명이 참가한 시위가 열렸고, 3월 12일 소농당은 슈요크 데죄를 포함한 의원 20명을 제명했다. 제명된 이들은 헝가리자유당을 만들었다. 이 요구의 형식이 이후 반복되었다. 블록은 소농당의 「우파」를 지목하고, 소농당 지도부는 연립 유지를 위해 그들을 내보냈다.

1946년 여름 러이크는 내무장관으로서 가톨릭 청년조직 KALOT를 포함한 단체 1,500여 곳을 해산했다. 7월 소련군 장교 살해 사건이 계기였다. 1946년 12월 국가보안국은 「헝가리 공동체」라는 전전 비밀결사의 회원들을 체포하고 「공화국 반대 음모」 수사를 발표했다. 체포는 소농당 인사로 번졌다. 1947년 1월 소농당 의원 여럿이 면책특권을 잃고 체포되었고, 소농당 사무총장 코바치 벨러가 음모의 배후로 지목되었다. 국회가 2월 25일 코바치의 면책특권 박탈을 거부하자, 같은 날 소련군 당국이 그를 「붉은군대에 대한 간첩 행위와 지하 반소 조직」 혐의로 체포해 소련으로 이송했다. 그는 소련에서 20년형을 받았고 1955년에야 돌아왔다. 미국과 영국은 통제위원회에 항의했으나 소련 측은 이를 거부했다. 소농당은 항의 성명을 냈으나 연립에 남았다. 「공화국 반대 음모」 재판은 1947년 봄 부다페스트 인민법원에서 열려 참모본부 장교 출신 등 피고들에게 사형과 장기형이 선고되었고, 소농당 소속 국회의원 여러 명이 뒤이어 재판을 받았다. 이 사건이 실제 조직이었는지, 어디까지가 국가보안국의 구성물이었는지는 1989년 이후 헝가리 연구자들 사이에서 계속 논의되었다. 결사가 존재했다는 점과 그것이 소농당 전체를 겨냥한 재판으로 확대되었다는 점은 함께 인정된다.

## 1947년: 너지 페렌츠의 사임과 푸른 투표용지 선거

총리 너지 페렌츠는 5월 14일 스위스로 휴가를 떠났다. 5월 28일 소련 측은 코바치의 진술이라며 너지가 음모에 연루되었다는 문서를 헝가리 정부에 넘겼고, 부총리 라코시 마차시는 전화로 사임을 요구했다. 너지의 어린 아들이 부다페스트에 있었다. 5월 30일 너지는 사임을 통보했고, 6월 초 아들이 스위스로 보내졌다. 너지는 미국으로 가 이듬해 회고록을 냈다. 국회의장 버르거 벨러도 6월 국외로 나갔다. 후임 총리는 소농당 좌파의 디녜시 러요시였다. 소농당은 그 뒤 도비 이슈트반이 이끌었다.

파리 평화조약은 1947년 2월 10일 서명되어 9월 15일 발효되었다. 조약은 헝가리의 국경과 배상을 확정했고, 통제위원회는 해산되었다. 소련군은 오스트리아 점령군과의 연락선 유지를 명목으로 헝가리에 남았다. 1948년 2월 18일 모스크바에서 소련-헝가리 우호협력상호원조조약이 서명되었다.

8월 31일 총선은 새 선거법 아래 치러졌다. 선거법은 전전 정당 관련자 등 수십만 명의 투표권을 박탈했고, 거주지 밖에서 투표할 수 있는 「푸른 투표용지」 제도를 두었다. 공산당 활동가들이 이 용지로 여러 투표소에서 투표한 사실이 선거 뒤 드러났다. 부정 투표의 규모는 6만 표 안팎으로 추정되고 더 높게 보는 연구도 있다. 공식 결과는 공산당 22.3%, 민주인민당(버런코비치 이슈트반) 16.4%, 소농당 15.4%, 사회민주당 14.9%, 헝가리독립당(파이퍼 졸탄) 13.4%, 국민농민당 8.3%였다. 공산당은 제1당이 되었으나 좌익블록 네 당의 합계는 60.9%였고, 야당 세 당은 35%가 넘었다. 11월 국회는 헝가리독립당의 선거 부정을 이유로 의석 49석을 무효 처리했고 파이퍼는 국외로 나갔다. 라코시는 나중에 이 선거를 두고 「우리는 옳은 일을 했다」고 말했고, 사회민주당 안에서는 이 선거를 계기로 통합 반대파와 찬성파가 갈렸다.

## 통합과 국유화

1947년 11월 대은행이 국유화되었고, 1948년 3월 25일 종업원 100인 이상 기업이 국유화되었다. 3월 25일의 국유화는 사전 예고 없이 하루에 이루어졌고, 594개 기업이 국가 소유가 되었다. 1948년 6월 16일 국회는 교회 학교의 국유화를 의결했다. 헝가리 학교의 3분의 2가 교회 학교였다. 민드센티 요제프 추기경은 이를 거부하고 교사들에게 협조하지 말 것을 요구했다.

사회민주당은 1948년 초 통합 반대파를 제명했다. 2월 켈레멘 줄러, 서케시츠의 반대파 등이 당에서 밀려났고, 3월 당대회는 통합을 의결했다. 6월 12일 사회민주당과 공산당은 헝가리근로자당(MDP)으로 합쳤다. 당수는 사회민주당의 서커시치 아르파드, 서기장은 라코시였고, 부서기장은 카다르 야노시, 파르카시 미하이, 러이크 라슬로였다. 7월 30일 틸디 대통령은 사위 초르노키 빅토르의 간첩 혐의 체포 뒤 사임했고, 서커시치가 대통령이 되었다. 러이크는 8월 5일 내무장관에서 외무장관으로 옮겼고 내무부는 카다르가 맡았다. 국가보안국은 9월 국가보위청(ÁVH)으로 개편되어 총리실 직속이 되었다. 청장은 페테르 가보르였다.

12월 26일 민드센티가 체포되었다. 1949년 2월 3일부터 8일까지의 재판에서 그는 반역과 외환 범죄 혐의로 종신형을 받았다. 재판은 서방에서 큰 반향을 일으켰고, 헝가리 정부는 그의 자백을 근거로 내세웠다. 그는 1956년 10월 혁명 중 풀려났다. 개신교 쪽에서는 1948년 10월 개혁교회가, 12월 루터교회가 국가와 협약을 맺었고, 이를 거부한 루터교 감독 오르도시 러요시는 재판을 받았다. 1948년 8월 20일 라코시는 케치케메트 연설에서 농업 협동조합화를 처음 공개적으로 제기했고, 그해 가을 첫 협동조합들이 조직되었다.

## 1949년: 단일 명부, 헌법, 러이크 재판

1949년 2월 헝가리 독립인민전선이 결성되어 남은 정당들을 하나의 명부로 묶었다. 5월 15일 총선은 이 단일 명부에 대한 찬반 투표로 치러졌고, 공식 결과는 찬성 95.6%였다. 8월 18일 국회는 헌법(1949년 제20호 법률)을 채택했고, 헌법은 8월 20일, 곧 성 이슈트반 축일에 공포되었다. 국호는 헝가리인민공화국이 되었고, 헌법 전문은 소련군의 해방과 소련의 원조를 명시했다. 대통령제는 폐지되고 인민공화국 간부회가 국가원수 기능을 맡았다. 서커시치가 간부회 의장이 되었다가 1950년 4월 체포되었다.

같은 해 5월 30일 러이크 라슬로가 체포되었다. 그는 외무장관이었고 5월 15일 선거에서 당선된 직후였다. 체포는 라코시의 결정이었고, 소련 국가보안부의 표도르 벨킨 중장이 이끄는 고문단이 신문에 참여했다. 카다르는 라코시의 지시로 러이크를 찾아가 자백을 설득했고, 이 대화의 녹음은 1950년대 말 공개되었다. 9월 16일부터 24일까지 부다페스트 인민법원에서 러이크, 쇠니 티보르, 설러이 언드라시 등 8명이 재판을 받았다. 혐의는 티토 정부와 미국 정보기관의 지시로 헝가리 정부 전복을 꾀했다는 것이었고, 기소장은 티토를 「제국주의의 앞잡이」로 규정했다. 러이크는 법정에서 혐의를 모두 인정했다. 9월 24일 러이크, 쇠니, 설러이에게 사형이 선고되었고 10월 15일 집행되었다. 팔피 죄르지 장군 등 군인 피고 4명은 별도 군사재판에서 사형을 받았다. 피고 가운데 러저르 브런코프는 유고슬라비아 외교관이었고, 그의 존재는 재판이 티토 정부를 겨냥한 것임을 드러냈다. 재판 뒤 당은 「러이크 사건」 학습을 전 당원에게 요구했고, 1950년까지 당원 재심사와 함께 카다르, 칼라이 줄러, 도나트 페렌츠 등 「국내파」 공산주의자들이 차례로 체포되었다.

러이크 재판의 기록은 여러 언어로 출판되어 1949년 12월 소피아의 코스토프 재판과 1952년 프라하의 슬란스키 재판의 본보기가 되었다. 1954년 카다르가 감옥에서 풀려났고, 1955년 라코시는 재판이 「도발자 페테르 가보르」의 조작이었다고 말했다. 1956년 3월 러이크는 복권되었고, 10월 6일 재매장에 10만여 명이 모였다.

## 「살라미」라는 말과 해석의 갈래

라코시는 1952년 2월 당 고등학교 강연 「헝가리 인민민주주의의 길」에서 1945~48년을 돌아보며, 소농당 안의 반동 세력을 「살라미처럼 한 조각씩」 잘라냈다고 말했다. 이 말은 그 뒤 헝가리의 이 시기를 가리키는 용어가 되었고 다른 나라에도 적용되었다. 그러나 이것은 1952년의 회고이지 1945년의 계획서가 아니다. 이 시기를 어떻게 읽을지는 그 차이에서 갈린다.

헝가리근로자당의 공식 서술은 1945년의 「인민민주주의 혁명」이 1948년 「사회주의 혁명」으로 성장 전화했다고 설명했다. 소농당은 지주와 옛 지배층의 피난처였고, 그 분열은 당 안의 「민주 세력」이 「반동」과 갈라선 결과였다는 것이다. 1956년 이후 이 서술은 러이크 재판 부분을 「사회주의 법질서 위반」으로 고쳐 유지되었다.

서방과 망명자의 서술은 너지 페렌츠의 1948년 회고록 『철의 장막 뒤의 투쟁』에서 출발한다. 소련의 점령과 보로실로프의 개입이 없었다면 1945년의 다수가 정부를 구성했을 것이며, 1947년의 사건들은 모스크바의 지시에 따른 쿠데타였다는 것이다. 찰스 가티는 『헝가리와 소비에트 블록』(1986)에서 소련 문서와 헝가리 당 기록을 검토해, 1947년 초까지 모스크바에 헝가리의 일당화 일정표는 없었고, 라코시 자신이 1946년까지 연립의 장기 유지를 전제로 움직였다고 보았다. 반면 라슬로 보르히는 『냉전 속의 헝가리, 1945~1956』(2004)에서 1945년부터 소련이 경제와 보안기관을 통해 통제권을 확보했고, 선거의 허용은 그 통제를 전제로 한 것이었다고 정리했다. 페테르 케네즈는 『나치에서 소비에트로』(2006)에서 두 해석 사이에서 각 단계의 우연과 선택을 추적했다. 1945년 총선은 자유선거였는가, 그 결과가 무엇을 바꾸었는가, 1947년의 가속은 마셜 플랜에 대한 대응이었는가에 대한 답이 각 해석을 가른다. 전체 비교는 상위 문서 [동유럽 인민민주주의 정권의 수립](/commulingo/events/eastern-europe-peoples-democracies)에 있다.

이 시기에 세워진 제도와 인물의 운명은 7년 뒤로 이어졌다. 1953년 너지 임레가 총리가 되어 「새로운 길」을 말했고, 1956년 10월 러이크의 재매장 3주 뒤 [헝가리 혁명](/commulingo/events/hungarian-revolution)이 일어났으며, 틸디와 코바치 벨러는 너지 정부에 들어갔다.$t$,
  $t$## Debrecen: The Provisional National Assembly and the Armistice

The Red Army crossed the Hungarian frontier at the end of September 1944 and by December held the east and south of the country; Budapest was encircled on 26 December and fell on 13 February 1945. In the meantime a Provisional National Assembly met at Debrecen on 21 December 1944. Its 230 delegates, chosen in the Soviet-occupied areas, represented the Communists, the Social Democrats, the Smallholders, the National Peasants and the trade unions, and on 22 December a provisional government was formed under General Béla Miklós, one of Horthy's generals who had crossed to the Soviet side in October. Of twelve ministers two were Communists, Imre Nagy at agriculture and József Gábor at trade; defence and the interior went to the Smallholders and the National Peasants.

The armistice was signed in Moscow on 20 January 1945. Hungary returned to its frontiers of 31 December 1937, undertook reparations of 300 million dollars over six years (200 million to the Soviet Union, 70 million to Yugoslavia, 30 million to Czechoslovakia), and came under the supervision of an Allied Control Commission. Its chairman was Marshal Kliment Voroshilov, with Georgy Pushkin as political adviser; the American and British representatives were there to be informed. The commission spoke on the licensing of parties, the press and government appointments, and Soviet troops were stationed under the armistice. This arrangement lasted until the commission was dissolved when the peace treaty came into force in September 1947.

The conditions of the early occupation were also a starting point of politics. From late 1944 into early 1945 Soviet forces sent several hundred thousand Hungarian civilians to labour camps in the Soviet Union under the name "malenky robot" (a little work); estimates range from 200,000 to 600,000, and they began to return only after 1947. Reparations and the upkeep of the occupying army took around half of state spending in 1945–46.

The first decision of post-war politics concerned the range of parties. The provisional government licensed only the five forces that had joined the "Independence Front" programme of December 1944; the pre-war governing party and the far-right parties were dissolved. People's courts were set up in January 1945 to try the wartime leaders, and the former prime ministers Béla Imrédy, László Bárdossy, Döme Sztójay and Ferenc Szálasi were executed by 1946.

## Land Reform and Inflation

On 17 March 1945 the provisional government issued the land reform decree (600/1945). The draft was the work of the agriculture minister Imre Nagy and rested on the proposals of the National Peasants and the Smallholders. Estates above 1,000 hold (about 575 hectares) were confiscated in full, landlords' holdings above 100 hold in part, and the land of war criminals and Arrow Cross members regardless of size. Some 3.2 million hectares, more than a third of the country's farmland, were taken, of which 1.9 million hectares went to 642,000 households; the rest became state forest and state farms. Hungarian landownership had been among the most concentrated in Europe since 1848, and the reform ended it in a year. Distribution was handled by local land-claims committees, through which the Communist Party built its organisation in the countryside. The Smallholders supported the reform while objecting to irregularities in its procedure. The churches, as the largest landowners, were the largest losers, a fact that resurfaced in the conflict of church and state in 1948. Most recipients became smallholders of around five hectares, and the new ownership looked settled until Rákosi first spoke of collectivisation in August 1948.

The economy was weighed down less by the reform than by reparations and the costs of occupation. Forty per cent of industrial plant had been destroyed and most of the railway rolling stock was gone, and the Soviet Union took over German-owned assets in addition to reparations, forming Soviet-Hungarian joint companies. The government met its spending by printing money, and from the summer of 1945 to July 1946 the pengő went through the fastest inflation in history. On 10 July 1946 prices rose 350 per cent in a day, and by the end of the month a note of 10²⁰ pengő was printed. On 1 August 1946 the new forint was introduced at 400,000 quadrillion (4 × 10²⁹) pengő to one forint. The stabilisation was led by the Communists Ernő Gerő and Zoltán Vas and underpinned by the return of the National Bank's gold, which the United States had held since 1945. The Communists claimed the success as their own and, once it held, pressed for the expansion of the state sector.

## The Election of 4 November 1945 and the Grand Coalition

The first test was the Budapest municipal election of 7 October 1945. The Communists and Social Democrats ran a joint list; the Smallholders took 50.5 per cent and the workers' list 42.8. The Communists had not expected the result. Voroshilov asked for a joint list and a pre-agreed division of seats in the general election too, but the Smallholders and Social Democrats refused, and the election of 4 November was held on party lists. The result was Smallholders 57.0 per cent, Social Democrats 17.4, Communists 17.0, National Peasants 6.9. Turnout was 92 per cent, and women voted for the first time.

The Smallholders had the seats to govern alone (245 of 409), but Voroshilov required the four-party coalition to continue, citing the pre-election agreement, and the Smallholder leadership agreed. Zoltán Tildy became prime minister on 15 November and the interior ministry went to the Communist Imre Nagy. Besides the interior the Communists received trade and transport; the Social Democrats industry and justice; the Smallholders finance, defence, foreign affairs and agriculture. On 1 February 1946 parliament abolished the monarchy and proclaimed a republic; Tildy became president and Ferenc Nagy of the Smallholders succeeded him as prime minister on 4 February. On 20 March the interior ministry passed to László Rajk, who reorganised the security service that year as the State Security Department (ÁVO).

Within the coalition the Communists, with 17 per cent of the seats, held the interior ministry and with it the senior appointments of the police, and in local administration they had been in place since the spring of 1945 through the "national committees". Among the Social Democrats, Árpád Szakasits and György Marosán on the left argued for cooperation with the Communists, Anna Kéthly and Károly Peyer on the right for an independent line. The National Peasants were led by Péter Veres, and among them too were figures close to the Communists such as Ferenc Erdei.

The United States judged the election of November 1945 free and recognised the provisional government. The vote became the reference point of later argument: the claim that the Soviet Union allowed a free election and the claim that its result was not reflected in the composition of the government both rest on the same facts.

## The Left Bloc and the Splitting of the Smallholders

On 5 March 1946 the Communists, Social Democrats, National Peasants and the Trade Union Council formed the "Left Bloc" and demanded the expulsion of "reactionary" deputies from the Smallholders. A demonstration of several hundred thousand was held in Budapest on 7 March, and on 12 March the Smallholders expelled twenty deputies, among them Dezső Sulyok, who founded the Hungarian Freedom Party. The form of the demand was repeated thereafter: the bloc named the Smallholders' "right wing", and the Smallholder leadership let them go to keep the coalition.

In the summer of 1946 Rajk, as interior minister, dissolved some 1,500 associations including the Catholic youth organisation KALOT, after the killing of a Soviet officer in July. In December 1946 the security service arrested members of a pre-war secret society, the "Hungarian Community", and announced an investigation into a "conspiracy against the republic". The arrests spread to Smallholder figures. In January 1947 several Smallholder deputies lost their immunity and were arrested, and the party's general secretary Béla Kovács was named as the conspiracy's patron. When parliament refused on 25 February to lift Kovács's immunity, the Soviet military authorities arrested him the same day on charges of "espionage against the Red Army and underground anti-Soviet organisation" and took him to the Soviet Union, where he was sentenced to twenty years; he returned only in 1955. The United States and Britain protested to the control commission and the Soviet side rejected the protest. The Smallholders issued a statement of protest and stayed in the coalition. The "conspiracy against the republic" trial was held before the People's Court in Budapest in the spring of 1947 and imposed death sentences and long terms on defendants including former general staff officers, and several Smallholder deputies were tried afterwards. Whether the society was a real organisation, and how much of the case was the security department's construction, has been discussed by Hungarian researchers since 1989; that the society existed, and that the case was expanded into a prosecution aimed at the Smallholders as a whole, are accepted together.

## 1947: Ferenc Nagy's Resignation and the Blue-Ballot Election

Prime Minister Ferenc Nagy left for a holiday in Switzerland on 14 May. On 28 May the Soviet side handed the Hungarian government documents, presented as Kovács's statements, implicating Nagy in the conspiracy, and the deputy prime minister Mátyás Rákosi demanded his resignation by telephone. Nagy's young son was in Budapest. On 30 May Nagy gave notice of his resignation, and in early June the boy was sent to Switzerland. Nagy went on to the United States and published his memoirs the following year. The speaker of parliament, Béla Varga, also left the country in June. The new prime minister was Lajos Dinnyés of the Smallholders' left, and the party was thereafter led by István Dobi.

The Paris peace treaty was signed on 10 February 1947 and came into force on 15 September. It fixed Hungary's frontiers and reparations, and the control commission was dissolved. Soviet troops remained in Hungary on the ground of maintaining lines of communication with the occupation forces in Austria. On 18 February 1948 the Soviet-Hungarian treaty of friendship, cooperation and mutual assistance was signed in Moscow.

The general election of 31 August was held under a new electoral law, which disenfranchised several hundred thousand people including those connected with the pre-war parties and created "blue ballots" allowing a voter to cast a ballot away from home. After the election it emerged that Communist activists had used these slips to vote at several polling stations. The fraudulent votes are estimated at around 60,000, with some studies putting the figure higher. The official result was Communists 22.3 per cent, Democratic People's Party (István Barankovics) 16.4, Smallholders 15.4, Social Democrats 14.9, Hungarian Independence Party (Zoltán Pfeiffer) 13.4, National Peasants 8.3. The Communists became the largest party, but the four parties of the Left Bloc together held 60.9 per cent and the three opposition parties more than 35. In November parliament annulled the Independence Party's 49 seats on grounds of electoral fraud and Pfeiffer left the country. Rákosi later said of the election that "we did the right thing", and within the Social Democrats the vote divided the opponents and supporters of merger.

## Merger and Nationalisation

The large banks were nationalised in November 1947, and on 25 March 1948 all firms with more than a hundred employees: the nationalisation of 25 March was carried out in a single day without prior notice and took 594 enterprises into state ownership. On 16 June 1948 parliament voted to nationalise church schools, which made up two-thirds of Hungary's schools. Cardinal József Mindszenty rejected the measure and called on teachers not to cooperate.

The Social Democrats expelled their anti-merger wing early in 1948; in February Gyula Kelemen and the other opponents were forced out and a March congress voted for union. On 12 June 1948 the Social Democrats and Communists merged as the Hungarian Working People's Party (MDP). Its chairman was Árpád Szakasits of the Social Democrats, its general secretary Rákosi, and its deputy general secretaries János Kádár, Mihály Farkas and László Rajk. On 30 July President Tildy resigned after the arrest of his son-in-law Viktor Csornoky on espionage charges, and Szakasits became president. On 5 August Rajk moved from the interior to the foreign ministry and Kádár took the interior. In September the security department became the State Protection Authority (ÁVH), attached to the prime minister's office, under Gábor Péter.

Mindszenty was arrested on 26 December. At his trial from 3 to 8 February 1949 he was sentenced to life imprisonment for treason and currency offences. The trial caused a stir in the West; the Hungarian government relied on his confession. He was freed during the revolution of October 1956. On the Protestant side the Reformed Church concluded an agreement with the state in October 1948 and the Lutheran Church in December; the Lutheran bishop Lajos Ordass, who refused, was put on trial. On 20 August 1948, at Kecskemét, Rákosi first raised the collectivisation of agriculture in public, and the first cooperatives were organised that autumn.

## 1949: Single List, Constitution, the Rajk Trial

In February 1949 the Hungarian Independence People's Front was formed, gathering the remaining parties on one list. The election of 15 May 1949 was a vote for or against that list, and the official result was 95.6 per cent in favour. On 18 August parliament adopted the constitution (Act XX of 1949), promulgated on 20 August, St Stephen's Day. The state became the Hungarian People's Republic, and the preamble of the constitution recorded the liberation by the Soviet army and Soviet assistance. The presidency was abolished and a Presidential Council took the functions of head of state; Szakasits became its chairman and was arrested in April 1950.

On 30 May of the same year László Rajk was arrested. He was foreign minister and had just been elected on 15 May. The arrest was Rákosi's decision, and a team of advisers from the Soviet Ministry of State Security under Lieutenant General Fyodor Belkin took part in the interrogation. On Rákosi's instructions Kádár visited Rajk to persuade him to confess; the recording of that conversation was made public in the late 1950s. From 16 to 24 September Rajk, Tibor Szőnyi, András Szalai and five others were tried before the People's Court in Budapest. The charge was that they had plotted to overthrow the Hungarian government on the instructions of the Tito government and American intelligence, and the indictment called Tito "an agent of imperialism". Rajk admitted every charge in court. On 24 September Rajk, Szőnyi and Szalai were sentenced to death, and the sentences were carried out on 15 October. Four military defendants including General György Pálffy were sentenced to death in a separate military trial. One defendant, Lazar Brankov, was a Yugoslav diplomat, and his presence showed the trial's aim at the Tito government. After the trial the party required every member to study the "Rajk case", and by 1950, alongside the re-screening of the membership, the "home" Communists Kádár, Gyula Kállai and Ferenc Donáth were arrested in turn.

The record of the Rajk trial was published in several languages and became the model for the Kostov trial in Sofia in December 1949 and the Slánský trial in Prague in 1952. Kádár was released from prison in 1954; in 1955 Rákosi said the case had been fabricated by "the provocateur Gábor Péter". Rajk was rehabilitated in March 1956, and some 100,000 people attended his reburial on 6 October.

## The Word "Salami" and the Readings

In a lecture at the party's higher school in February 1952, "The Road of the Hungarian People's Democracy", Rákosi looked back on 1945–48 and said that the reactionary forces inside the Smallholders had been cut off "like a salami, slice by slice". The phrase became a name for the period in Hungary and was applied to other countries. But it is a retrospect of 1952, not a plan of 1945, and the readings of the period divide over that difference.

The official account of the Hungarian Working People's Party explained that the "people's democratic revolution" of 1945 grew over into the "socialist revolution" of 1948. The Smallholders had been a refuge for landlords and the old ruling class, and their splitting was the result of the "democratic forces" inside the party parting from the "reaction". After 1956 this account was kept with the Rajk trial rewritten as a "violation of socialist legality".

The Western and émigré account begins with Ferenc Nagy's memoir of 1948, The Struggle Behind the Iron Curtain: without the Soviet occupation and Voroshilov's intervention the majority of 1945 would have formed the government, and the events of 1947 were a coup on Moscow's instructions. Charles Gati, in Hungary and the Soviet Bloc (1986), examined Soviet documents and Hungarian party records and concluded that until early 1947 Moscow had no timetable for a one-party Hungary and that Rákosi himself had worked on the assumption of a long-lasting coalition until 1946. László Borhi, in Hungary in the Cold War, 1945–1956 (2004), held instead that the Soviet Union secured control from 1945 through the economy and the security services, and that the elections were permitted on that premise. Peter Kenez, in Hungary from the Nazis to the Soviets (2006), traced the contingencies and choices of each stage between the two readings. Whether the election of 1945 was free, what its result changed, and whether the acceleration of 1947 was a response to the Marshall Plan are the questions on which the readings part. The comparison across countries is in the overview, [The People's Democracies of Eastern Europe](/commulingo/events/eastern-europe-peoples-democracies).

The institutions built in these years, and the fates of their people, carried seven years forward. In 1953 Imre Nagy became prime minister and spoke of a "new course"; in October 1956, three weeks after Rajk's reburial, the [Hungarian Revolution](/commulingo/events/hungarian-revolution) broke out, and Tildy and Béla Kovács joined Nagy's government.$t$,
  $$[
    {"date":"1944.12.22","country":"hungary","title":{"ko":"데브레첸 임시정부","en":"The provisional government at Debrecen"},"body":{"ko":"소련군 점령 지역에서 뽑힌 대의원 230명의 임시국민의회가 전날 개회했고, 호르티의 장군이었던 미클로시 벨러를 총리로 하는 임시정부가 세워졌다. 공산당은 농업과 통상, 소농당과 국민농민당은 국방과 내무를 맡았다. 부다페스트는 아직 포위 중이었다.","en":"The Provisional National Assembly, chosen in the Soviet-occupied areas, had opened the day before, and a provisional government was formed under Béla Miklós, one of Horthy's generals. The Communists took agriculture and trade, the Smallholders and National Peasants defence and the interior."}},
    {"date":"1945.01.20","country":["hungary","soviet"],"title":{"ko":"모스크바 휴전협정","en":"The armistice in Moscow"},"body":{"ko":"헝가리는 1937년 국경으로 돌아가고 6년간 3억 달러의 배상을 물며 연합국 통제위원회의 감독을 받기로 했다. 위원장은 보로실로프 원수, 정치고문은 푸시킨이었고 미국·영국 대표는 통보를 받는 자리였다. 위원회는 1947년 9월까지 정당·언론·인사에 발언했다.","en":"Hungary returned to its 1937 frontiers, undertook 300 million dollars in reparations and came under an Allied Control Commission. Marshal Voroshilov was chairman with Pushkin as political adviser; the American and British representatives were there to be informed."}},
    {"date":"1945.03.17","country":"hungary","title":{"ko":"토지개혁 포고","en":"The land reform decree"},"body":{"ko":"농업장관 너지 임레가 초안한 포고로 1천 홀드 이상의 대토지가 전부, 100홀드 이상의 지주 토지가 일부 몰수되었다. 약 320만 헥타르가 몰수되어 190만 헥타르가 64만 2천 가구에 분배되었고, 공산당은 지역 토지청구위원회를 통해 농촌 조직을 세웠다.","en":"By a decree drafted by the agriculture minister Imre Nagy, estates above 1,000 hold were confiscated in full. Some 3.2 million hectares were taken and 1.9 million distributed to 642,000 households through local land-claims committees."}},
    {"date":"1945.11.04","country":"hungary","title":{"ko":"총선: 소농당 57%","en":"General election: Smallholders 57 per cent"},"body":{"ko":"소농당 57.0%, 사회민주당 17.4%, 공산당 17.0%, 국민농민당 6.9%였고 투표율은 92%였다. 소농당은 409석 중 245석으로 단독 정부 의석을 얻었으나 보로실로프의 요구로 4당 연립이 유지되었고, 내무부는 공산당의 너지 임레가 맡았다.","en":"Smallholders 57.0 per cent, Social Democrats 17.4, Communists 17.0, National Peasants 6.9. The Smallholders had the seats to govern alone, but at Voroshilov's demand the four-party coalition continued and the interior went to the Communists."}},
    {"date":"1946.02.01","country":"hungary","title":{"ko":"공화국 선포","en":"The republic proclaimed"},"body":{"ko":"국회가 왕정을 폐지하고 공화국을 선포했다. 소농당의 틸디 졸탄이 대통령, 너지 페렌츠가 총리가 되었고, 3월 20일 내무장관은 러이크 라슬로로 바뀌었다. 러이크는 그해 국가보안기관을 재편해 국가보안국(ÁVO)을 세웠다.","en":"Parliament abolished the monarchy and proclaimed a republic. Zoltán Tildy became president and Ferenc Nagy prime minister, and on 20 March László Rajk took the interior ministry."}},
    {"date":"1946.03.05","country":"hungary","title":{"ko":"좌익블록 결성","en":"The Left Bloc formed"},"body":{"ko":"공산당·사회민주당·국민농민당과 노동조합평의회가 소농당 안의 「반동」 의원 축출을 요구했다. 3월 7일 부다페스트의 대규모 시위 뒤 3월 12일 소농당은 슈요크 데죄 등 의원 20명을 제명했고, 제명된 이들은 헝가리자유당을 세웠다.","en":"The Communists, Social Democrats, National Peasants and the Trade Union Council demanded the expulsion of \"reactionary\" Smallholder deputies. After a mass demonstration on 7 March, the Smallholders expelled twenty deputies including Dezső Sulyok on 12 March."}},
    {"date":"1946.08.01","country":"hungary","title":{"ko":"포린트 도입","en":"The forint introduced"},"body":{"ko":"7월 10일 하루 350%에 이른 역사상 가장 빠른 인플레이션 끝에 새 화폐 포린트가 4×10²⁹ 펭괴에 1포린트로 도입되었다. 안정화는 공산당의 게뢰 에르뇌가 주도했고 미국이 돌려준 국립은행의 금이 뒷받침했다. 공산당은 이를 자기 성과로 내세웠다.","en":"After the fastest inflation in history, the new forint was introduced at 4 × 10²⁹ pengő to one forint. The stabilisation was led by the Communist Ernő Gerő and underpinned by the National Bank's gold, returned by the United States."}},
    {"date":"1947.02.25","country":["hungary","soviet"],"title":{"ko":"코바치 벨러 체포","en":"Béla Kovács arrested"},"body":{"ko":"국회가 소농당 사무총장 코바치 벨러의 면책특권 박탈을 거부하자 같은 날 소련군 당국이 그를 붉은군대에 대한 간첩 혐의로 체포해 소련으로 이송했다. 그는 20년형을 받고 1955년에 돌아왔다. 미국과 영국의 항의는 통제위원회에서 거부되었다.","en":"When parliament refused to lift the immunity of the Smallholders' general secretary Béla Kovács, the Soviet military authorities arrested him the same day for espionage against the Red Army and took him to the Soviet Union. He was sentenced to twenty years and returned in 1955."}},
    {"date":"1947.05.30","country":"hungary","title":{"ko":"너지 페렌츠의 사임","en":"Ferenc Nagy resigns"},"body":{"ko":"5월 14일 스위스로 떠난 총리 너지 페렌츠는 소련 측이 넘긴 음모 연루 문서와 라코시의 전화 요구 뒤 사임을 통보했다. 부다페스트에 남은 아들은 6월 초 스위스로 보내졌고, 소농당 좌파의 디녜시 러요시가 총리를 이었다. 너지는 미국으로 갔다.","en":"Prime Minister Ferenc Nagy, in Switzerland, gave notice of his resignation after the Soviet side handed over documents implicating him and Rákosi demanded it by telephone. His son, still in Budapest, was sent to Switzerland in early June; Lajos Dinnyés succeeded him."}},
    {"date":"1947.08.31","country":"hungary","title":{"ko":"「푸른 투표용지」 선거","en":"The \"blue ballot\" election"},"body":{"ko":"공산당 22.3%, 민주인민당 16.4%, 소농당 15.4%, 사회민주당 14.9%, 헝가리독립당 13.4%였다. 거주지 밖 투표용지를 이용한 부정 투표는 6만 표 안팎으로 추정되며, 11월 헝가리독립당의 의석 49석이 무효 처리되었다.","en":"Communists 22.3 per cent, Democratic People's Party 16.4, Smallholders 15.4, Social Democrats 14.9, Hungarian Independence Party 13.4. Fraudulent votes cast on out-of-district ballots are estimated at around 60,000; in November the Independence Party's 49 seats were annulled."}},
    {"date":"1948.06.12","country":"hungary","title":{"ko":"헝가리근로자당 창당","en":"The Hungarian Working People's Party founded"},"body":{"ko":"통합 반대파를 제명한 사회민주당이 공산당과 합쳐 헝가리근로자당이 되었다. 당수는 서커시치 아르파드, 서기장은 라코시였다. 3월 25일 종업원 100인 이상 기업 594곳이 국유화되었고, 6월 16일 교회 학교가 국유화되어 민드센티 추기경이 반대했다.","en":"The Social Democrats, having expelled their anti-merger wing, united with the Communists; Árpád Szakasits became chairman and Rákosi general secretary. On 25 March 594 firms with more than a hundred employees had been nationalised, and church schools followed on 16 June."}},
    {"date":"1949.09.24","country":"hungary","title":{"ko":"러이크 재판 판결","en":"Verdict in the Rajk trial"},"body":{"ko":"5월 단일 명부 선거와 8월 20일 헌법으로 인민공화국이 세워진 뒤, 전 내무장관 러이크 라슬로가 티토와 미국 정보기관을 위한 음모 혐의로 사형을 선고받고 10월 15일 처형되었다. 소련 국가보안부 벨킨 중장의 고문단이 신문에 참여했다.","en":"After the constitution of 20 August established the People's Republic, the former interior minister László Rajk was sentenced to death for conspiracy on behalf of Tito and American intelligence and executed on 15 October. Advisers under Lieutenant General Belkin of the Soviet Ministry of State Security took part in the interrogation."}}
  ]$$::jsonb,
  $$[
    {"lat":47.50,"lng":19.04,"kind":"main","label":{"ko":"부다페스트","en":"Budapest"}},
    {"lat":47.53,"lng":21.63,"label":{"ko":"데브레첸","en":"Debrecen"}},
    {"lat":46.07,"lng":18.23,"label":{"ko":"페치","en":"Pécs"}},
    {"lat":46.25,"lng":20.15,"label":{"ko":"세게드","en":"Szeged"}},
    {"lat":47.79,"lng":18.74,"label":{"ko":"에스테르곰","en":"Esztergom"}},
    {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"}}
  ]$$::jsonb,
  $$[
    "Charles Gati, Hungary and the Soviet Bloc, Duke University Press, 1986",
    "László Borhi, Hungary in the Cold War, 1945–1956: Between the United States and the Soviet Union, CEU Press, 2004",
    "Peter Kenez, Hungary from the Nazis to the Soviets: The Establishment of the Communist Regime in Hungary, 1944–1948, Cambridge University Press, 2006",
    "Bennett Kovrig, Communism in Hungary: From Kun to Kádár, Hoover Institution Press, 1979",
    "Ignác Romsics, Hungary in the Twentieth Century, Corvina, 1999",
    "Ferenc Nagy, The Struggle Behind the Iron Curtain, Macmillan, 1948",
    "László Rajk and His Accomplices before the People's Court, Budapest, 1949",
    "Mátyás Rákosi, A magyar népi demokrácia útja (lecture at the Party Higher School, 29 February 1952), Szikra, 1952",
    "Norman Naimark and Leonid Gibianskii, eds., The Establishment of Communist Regimes in Eastern Europe, 1944–1949, Westview Press, 1997",
    "Foreign Relations of the United States, 1947, vol. IV: Eastern Europe; The Soviet Union (Hungary)",
    "Mark Pittaway, The Workers' State: Industrial Labor and the Making of Socialist Hungary, 1944–1958, University of Pittsburgh Press, 2012"
  ]$$::jsonb,
  '{"parent":"eastern-europe-peoples-democracies"}'::jsonb
);

INSERT INTO commulingo_history_event_people
  (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('hungary-1945-1949', 'matyas-rakosi', 0, 'executor',
   '공산당 서기장, 부총리', 'General secretary of the Communist Party, deputy prime minister',
   '1946년 좌익블록과 1947년 너지 페렌츠 사임 요구, 1948년 통합, 1949년 러이크 체포를 결정했고, 1952년 강연에서 이 과정을 「살라미처럼 한 조각씩」 잘라냈다고 표현했다.',
   'He drove the Left Bloc of 1946, the demand for Ferenc Nagy''s resignation in 1947, the merger of 1948 and the arrest of Rajk in 1949, and in a 1952 lecture described the process as cutting "like a salami, slice by slice".'),
  ('hungary-1945-1949', 'laszlo-rajk', 1, 'target',
   '내무장관, 1949년 재판의 피고', 'Interior minister, defendant in 1949',
   '1946년 3월부터 내무장관으로 국가보안국을 세우고 단체 해산과 1947년의 체포를 집행했으며, 1949년 5월 체포되어 9월 재판에서 사형을 선고받고 10월 15일 처형되었다.',
   'Interior minister from March 1946, he built the State Security Department and carried out the dissolutions and the arrests of 1947; arrested in May 1949, he was sentenced to death in September and executed on 15 October.'),
  ('hungary-1945-1949', 'zoltan-tildy', 2, 'participant',
   '소농당 총리, 공화국 초대 대통령', 'Smallholder prime minister, first president of the republic',
   '1945년 11월 총선 뒤 총리가 되어 보로실로프의 연립 유지 요구를 받아들였고, 1946년 2월 대통령이 되었다가 1948년 7월 사위의 체포 뒤 사임했다.',
   'Prime minister after the election of November 1945, he accepted Voroshilov''s demand that the coalition continue, became president in February 1946 and resigned in July 1948 after his son-in-law''s arrest.'),
  ('hungary-1945-1949', 'voroshilov', 3, 'executor',
   '연합국 통제위원회 위원장', 'Chairman of the Allied Control Commission',
   '1945년 총선 전 공동 명부를 요구했고, 소농당 과반 뒤 연립 유지와 공산당의 내무부 장악을 요구해 관철했다.',
   'He asked for a joint list before the 1945 election and, after the Smallholders'' majority, required the coalition to continue with the interior ministry in Communist hands.'),
  ('hungary-1945-1949', 'georgy-pushkin', 4, 'executor',
   '통제위원회 정치고문, 소련 공사', 'Political adviser to the commission, Soviet envoy',
   '1945년부터 부다페스트에서 통제위원회의 정치고문과 소련 공사로 일하며 모스크바와 헝가리 공산당 사이의 연락을 맡았다.',
   'From 1945 he served in Budapest as political adviser to the commission and Soviet envoy, the channel between Moscow and the Hungarian Communists.'),
  ('hungary-1945-1949', 'nagy', 5, 'participant',
   '농업장관, 토지개혁 포고의 기초자', 'Agriculture minister, drafter of the land reform',
   '1945년 3월 토지개혁 포고를 기초했고, 11월부터 1946년 3월까지 내무장관을 지낸 뒤 국회의장이 되었다.',
   'He drafted the land reform decree of March 1945, served as interior minister from November 1945 to March 1946 and then became speaker of parliament.'),
  ('hungary-1945-1949', 'janos-kadar', 6, 'participant',
   '부서기장, 1948년 8월부터 내무장관', 'Deputy general secretary, interior minister from August 1948',
   '1948년 통합 뒤 부서기장이 되었고 러이크의 뒤를 이어 내무장관을 맡았으며, 1949년 라코시의 지시로 러이크에게 자백을 설득했다.',
   'Deputy general secretary after the 1948 merger and Rajk''s successor at the interior, he was sent by Rákosi in 1949 to persuade Rajk to confess.'),
  ('hungary-1945-1949', 'ern-ger', 7, 'executor',
   '경제 안정화와 국유화의 책임자', 'In charge of stabilisation and nationalisation',
   '1946년 포린트 안정화를 주도했고, 1947~48년 은행과 100인 이상 기업의 국유화를 이끌었다.',
   'He led the forint stabilisation of 1946 and the nationalisation of the banks and of firms above a hundred employees in 1947–48.'),
  ('hungary-1945-1949', 'stalin', 8, 'leader',
   '소련 지도자', 'Soviet leader',
   '1945년 헝가리에 연립정부와 선거를 허용했고, 1947년 코바치 체포와 너지 페렌츠 사임 요구, 1949년 러이크 재판 준비를 승인했다.',
   'He allowed a coalition government and elections in Hungary in 1945, and approved the arrest of Kovács and the demand for Ferenc Nagy''s resignation in 1947 and the preparation of the Rajk trial in 1949.'),
  ('hungary-1945-1949', 'molotov', 9, 'leader',
   '소련 외무장관', 'Soviet foreign minister',
   '1945년 1월 휴전협정과 1947년 2월 파리 평화조약의 소련 측 책임자로 헝가리의 국경과 배상, 소련군 주둔 조건을 정했다.',
   'The Soviet principal for the armistice of January 1945 and the Paris peace treaty of February 1947, he set Hungary''s frontiers, reparations and the terms of the Soviet garrison.');

COMMIT;
