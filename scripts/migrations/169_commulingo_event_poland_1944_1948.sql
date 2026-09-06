-- Poland 1944–1948: one child document of the hub event
-- eastern-europe-peoples-democracies (relations.parent), sort_order 127.
--
-- The hub carries the cross-country stages, the concept history of "people's
-- democracy" and the historiography. This entry is the Polish record only:
-- the two governments of 1944, the Yalta reorganisation and Mikołajczyk's
-- return, land reform and nationalisation, the security apparatus and the
-- underground, the 1946 referendum and the 1947 election with the official
-- and the later-published counts side by side, the "Polish road" and its
-- condemnation, and the unification congress of December 1948. Where the
-- Warsaw Uprising, Yalta and the hub already tell a step, the body links to
-- them instead of retelling.
--
-- Evaluative labels are attributed to who used them. Where readings differ
-- they are given in parallel. Every person linked here already exists in the
-- dictionary; Osóbka-Morawski, Radkiewicz, Minc, Spychalski, Okulicki,
-- Rzepecki and Paczkowski appear in the body only.
--
-- Timeline entries carry a `country` flag code (see flag-icons.js) for the
-- per-country timeline filter; no geo (political event).

BEGIN;

INSERT INTO commulingo_history_events (
  id, sort_order, period_label,
  title_ko, title_en, question_ko, question_en,
  summary_ko, summary_en, outcome_ko, outcome_en,
  body_ko, body_en, timeline, locations, sources, relations
) VALUES (
  'poland-1944-1948', 127, '1944–1948',
  '폴란드: 루블린 위원회에서 통일노동자당까지', 'Poland: From the Lublin Committee to the United Workers'' Party',
  '1944년 7월 루블린 위원회에서 1948년 12월 통합대회까지, 폴란드의 국가권력은 어떤 절차와 집계를 거쳐 노동자당으로 모였는가?',
  'From the Lublin Committee of July 1944 to the unification congress of December 1948, through what procedures and counts did state power in Poland gather in the Workers'' Party?',
  $t$1944년 7월 소련이 후원한 폴란드민족해방위원회가 루블린에 들어서면서 폴란드에는 런던 망명정부와 루블린의 두 정부가 생겼다. 얄타 합의에 따라 1945년 6월 국민통일임시정부가 세워져 미코와이치크가 부총리로 귀국했고, 미국과 영국이 이를 승인했다. 토지개혁과 기간산업 국유화는 연립의 여러 당이 함께 통과시켰다. 공안부와 소련 내무인민위원부는 국내군 후신의 지하조직을 상대했고, 1945년과 1947년 두 차례 사면이 있었다. 1946년 6월 국민투표와 1947년 1월 총선의 공식 결과는 정부 진영의 압승이었으나, 1989년 이후 공개된 집계는 다른 수치를 보여 준다. 미코와이치크는 1947년 10월 폴란드를 떠났다. 고무우카의 「폴란드의 길」은 1948년 9월 「우익 민족주의 편향」으로 비판되어 그가 해임되었고, 12월 노동자당과 사회당이 통합해 폴란드통일노동자당이 세워졌다.$t$,
  $t$When the Soviet-sponsored Polish Committee of National Liberation installed itself in Lublin in July 1944, Poland had two governments: the exile government in London and the committee in Lublin. Under the Yalta agreement a Provisional Government of National Unity was formed in June 1945, Mikołajczyk returned as deputy prime minister, and the United States and Britain recognised it. Land reform and the nationalisation of major industry were passed by several parties of the coalition together. The Ministry of Public Security and the Soviet NKVD faced the underground successors of the Home Army, and there were two amnesties, in 1945 and 1947. The official results of the referendum of June 1946 and the election of January 1947 were landslides for the government bloc; the tallies published after 1989 show different figures. Mikołajczyk left Poland in October 1947. Gomułka's "Polish road" was condemned as a "rightist-nationalist deviation" in September 1948 and he was removed; in December the Workers' Party and the Socialist Party merged into the Polish United Workers' Party.$t$,
  $t$1948년 12월 이후 폴란드에는 통일노동자당이 지도하는 단일한 집권당, 1947년 총선으로 구성된 입법의회, 국유화된 공업과 국가가 통제하는 상업, 공안부와 소련 고문단이 있는 군이 자리 잡았다. 1949년 11월 소련 원수 로코솝스키가 국방장관이 되었고, 같은 달 농민당 잔여 조직은 통일농민당으로 합쳐졌다. 고무우카는 1951년 체포되어 1954년까지 구금되었다가 1956년 10월 제1서기로 돌아왔고, 그때 그가 다시 내건 것은 1946년의 「폴란드의 길」이었다. 1946년 국민투표와 1947년 총선의 실제 집계는 1989년 이후 문서고에서 나왔고, 1947년의 사면으로 나온 지하조직원의 명단은 그 뒤의 체포에 쓰였다.$t$,
  $t$After December 1948 Poland had a single ruling party led by the United Workers' Party, a legislative Sejm returned by the election of 1947, nationalised industry with state-controlled trade, and an army with the Ministry of Public Security and Soviet advisers beside it. In November 1949 the Soviet marshal Rokossovsky became minister of national defence, and the same month the remnants of the Peasant Party were merged into the United Peasant Party. Gomułka was arrested in 1951 and held until 1954, returning as first secretary in October 1956, when what he raised again was the "Polish road" of 1946. The actual tallies of the 1946 referendum and the 1947 election came out of the archives after 1989, and the lists of underground members produced by the amnesty of 1947 were used in the arrests that followed.$t$,
  $t$## 두 개의 정부: 루블린 위원회와 런던 망명정부

1944년 7월 22일 폴란드민족해방위원회가 헤움 발로 선언문을 냈다. 문안은 모스크바에서 작성되었고, 위원회는 8월 1일 루블린에 자리 잡았다. 의장은 사회당 좌파의 에드바르트 오수프카모라프스키였고, 실권은 1944년 1월 1일 바르샤바 지하에서 결성된 국가국민평의회의 의장 볼레스와프 비에루트와 노동자당 서기장 브와디스와프 고무우카에게 있었다. 위원회는 1921년 헌법을 계승한다고 밝히면서 런던 망명정부를 「1935년 파시스트 헌법에 근거한 불법 정부」라 불렀다. 같은 날 소련과 위원회는 소련군 후방 지역의 행정을 위원회에 넘기는 협정을 맺었고, 7월 27일에는 커즌선을 국경으로 하는 비밀 협정이 뒤따랐다. 위원회에는 군대도 있었다. 1943년 소련에서 편성된 지그문트 베를링의 제1군은 1944년 7월 폴란드군으로 개편되었고, 총사령관은 미하우 롤라지미에르스키였다. 1945년 봄 이 군대는 약 40만 명에 이르렀다. 위원회의 구성원 15명 가운데 노동자당원은 소수였으나 공안, 국방, 정보, 행정 부문이 노동자당 몫이었다.

런던에는 1943년 7월부터 스타니스와프 미코와이치크가 이끄는 망명정부가 있었고, 국내에는 그 정부의 국내군과 정부 대표부가 있었다. 미코와이치크는 8월 초 모스크바에서 스탈린을 만났고, 10월에는 처칠과 함께 다시 모스크바에서 커즌선을 국경으로 받아들이라는 요구를 들었다. 그는 내각을 설득하지 못해 11월 24일 사임했고, 토마시 아르치셰프스키가 뒤를 이었다. 같은 8월부터 10월까지 바르샤바 봉기가 진행되는 동안 소련군은 비스와강 동안에 있었다. 봉기의 경과와 그 뒤의 논쟁은 [바르샤바 봉기](/commulingo/events/warsaw-uprising) 항목이 다룬다.

12월 31일 국가국민평의회는 위원회를 폴란드공화국 임시정부로 바꾸었고, 소련은 1945년 1월 5일 이를 승인했다. 1월 17일 소련군이 폐허가 된 바르샤바에 들어갔고, 1월 19일 국내군 사령관 레오폴트 오쿨리츠키가 국내군 해산을 명령했다. 폴란드에는 두 개의 정부와 두 개의 군대가 있었으나, 영토를 통치하는 정부는 하나뿐이었다.

## 얄타에서 국민통일임시정부까지: 미코와이치크의 귀국

1945년 2월 얄타에서 세 강대국은 「현재 폴란드에서 활동 중인 임시정부를 더 넓은 민주적 기반 위에 재조직」하고, 그 정부가 「보통선거와 비밀투표에 의한 자유롭고 구속 없는 선거」를 치른다는 데 합의했다. 합의문의 문안과 그 집행력에 관한 논쟁은 [얄타 회담](/commulingo/events/yalta-potsdam) 항목에 정리되어 있다. 재조직을 위한 3국 위원회가 몰로토프, 해리먼, 클라크 커로 모스크바에 설치되었다.

3월 27일과 28일 지하 정부 대표 얀 스타니스와프 얀코프스키와 오쿨리츠키를 비롯한 지하 지도자 열여섯 명이 소련군과의 회담을 위해 프루슈쿠프로 갔다가 내무인민위원부에 체포되어 모스크바로 이송되었다. 6월 17일부터 21일까지 미코와이치크가 모스크바에서 새 정부 구성을 협상하는 동안, 6월 18일부터 21일까지 같은 도시에서 「16인 재판」이 열렸다. 오쿨리츠키는 10년형, 얀코프스키는 8년형, 비엔과 야시우코비치는 5년형을 받았고, 세 명은 무죄였다. 오쿨리츠키는 1946년 12월 모스크바 감옥에서 죽었다.

6월 28일 국민통일임시정부가 출범했다. 총리는 오수프카모라프스키, 부총리는 고무우카와 미코와이치크였고, 미코와이치크는 농업장관을 겸했다. 런던에서 돌아온 쪽이 얻은 자리는 21개 부처 가운데 소수였다. 미국과 영국은 7월 5일 이 정부를 승인하고 런던 정부의 승인을 거두었다. 미코와이치크는 8월 22일 루블린 계열의 농민당과 결별해 폴란드농민당을 재건했고, 당은 1946년 초 당 발표로 80만 명의 당원을 헤아렸다. 노동자당은 1945년 12월 제1차 당대회에서 고무우카를 서기장으로 재확인했고, 당원은 1945년 말 약 23만 명이었다. 연립에는 이 밖에 오수프카모라프스키와 치란키에비치의 사회당, 루블린 계열의 농민당, 민주당이 있었고, 노동자당은 「민주 진영의 통일」을 내걸고 이들과 선거 연합을 추진했다.

1946년 1월 농민당 대회에서 미코와이치크는 얄타가 약속한 자유선거의 조기 실시를 요구했다. 2월 노동자당은 농민당에 단일 명부 참여를 제안하며 의석의 20%를 배정하겠다고 했고, 농민당은 75%를 요구하며 거부했다. 이 결렬이 총선을 미루고 국민투표를 먼저 치르는 결정으로 이어졌다. 그 사이 농민당 지방 조직에 대한 체포와 활동가 살해가 이어졌고, 농민당은 1947년 초까지 활동가 100여 명이 살해되었다고 집계했다. 정부는 이를 지하조직의 소행으로, 농민당은 공안부의 소행으로 설명했다.

## 토지개혁과 국유화: 연립이 함께 통과시킨 것

토지개혁은 위원회가 루블린에서 처음 한 일이었다. 1944년 9월 6일 포고는 농지 50헥타르(총면적 100헥타르)를 넘는 사유지와 독일인 소유지를 보상 없이 몰수해 분배하도록 했다. 1949년까지 약 610만 헥타르가 110만 농가에 나뉘었고, 그 절반 이상은 새로 얻은 서부 영토에 있었다. 미코와이치크의 농민당은 분배 방식과 국영농장 비율을 두고 노동자당과 다투었지만 개혁 자체에는 반대하지 않았다. 지주층은 포고 발표 뒤 곧바로 장원에서 쫓겨났고, 그 다수는 포츠담 이후 확정된 서부 국경 안의 새 정착지로 가지 않았다.

1946년 1월 3일 국가국민평의회는 기간산업 국유화법을 통과시켰다. 독일 국가와 독일인의 재산은 무상으로, 교대 근무 인원 50명을 넘는 폴란드 기업은 보상을 전제로 국유화되었다. 농민당은 이 법에 찬성했고, 대신 중소기업과 상업의 자유를 요구했다. 보상은 실제로는 거의 지급되지 않았다. 산업장관 힐라리 민츠는 1947년 「상업 전투」를 선포해 사영 도소매를 국영과 협동조합 상업으로 대체했고, 1947년부터 1949년까지의 3개년 계획은 전쟁 전 생산 수준 회복을 목표로 했다.

서부 영토에는 독일인이 떠난 자리에 동부에서 온 폴란드인이 정착했다. 1945년부터 1947년까지 약 300만 명의 독일인이 추방되었고, 소련에 넘어간 동부 영토에서 약 150만 명의 폴란드인이 옮겨 왔다. 이 이동은 연립의 어느 당도 반대하지 않았고, 서부 국경 문제는 1946년 국민투표의 세 번째 질문이 되었다. 1945년 11월 신설된 회복영토부는 고무우카가 1949년 1월까지 맡았고, 정착과 토지 분배, 독일인 추방의 행정이 이 부처를 거쳤다. 서부 영토는 노동자당이 토지개혁과 정착을 함께 집행하며 조직을 넓힌 곳이었고, 1946년 국민투표와 1947년 총선에서 정부 진영의 공식 득표가 가장 높게 발표된 곳이기도 했다.

## 공안부와 지하: 16인 재판, 아우구스투프, 두 번의 사면

위원회는 1944년 7월 공안 부문을 두었고, 1945년 1월 1일 이는 공안부가 되었다. 장관은 스타니스와프 라드키에비치였고, 당에서 공안을 관장한 것은 정치국원 야쿠프 베르만이었다. 공안부 요원은 1945년 말 약 2만 명이었고, 그 아래 국내보안군과 시민민병대, 1946년 2월 창설된 자원예비민병대가 있었다. 소련 내무인민위원부는 자체 부대와 고문단을 두었다. 이반 세로프는 1945년 초 제1벨로루시 전선군 후방의 내무인민위원부 전권대표로 폴란드에 있었고, 3월의 16인 체포는 그의 부하들이 집행했다. 1945년 7월 10일부터 25일까지 수바우키와 아우구스투프 일대에서 소련군의 소탕 작전으로 약 2,000명이 체포되었고, 그 가운데 약 600명은 돌아오지 않았다. 폴란드 국가기억원은 이들이 처형되어 러시아 영토에 묻혔다고 본다.

국내군이 해산된 뒤에도 무장 지하는 남았다. 1945년 9월 2일 국내군 출신 장교들이 바르샤바에서 자유독립협회(WiN)를 세웠고, 초대 회장 얀 제페츠키는 11월 5일 체포되었다. 국민군(NSZ) 계열의 부대도 각지에 있었다. 지하조직은 공안부와 민병대, 노동자당 활동가를 공격했고, 정부는 이들을 「반동 도적단」이라 불렀으며, 지하는 스스로를 국내군의 후계로 불렀다. 1989년 이후 폴란드에서는 「저주받은 병사들」이라는 이름이 쓰인다. 지하 활동과 그 진압으로 죽은 사람의 수는 추계가 갈리며, 양쪽 모두 수천 명 단위다. 1945년 무장 지하의 규모는 폴란드 역사학의 추계로 1만 5천 명에서 2만 명 사이였고, 1947년 사면 뒤에는 수백 명 단위의 소부대가 남아 1950년대 초까지 활동했다. 정부는 농민당과 지하의 연계를 재판과 선전에서 거듭 주장했고, 농민당은 이를 부인하며 자당이 합법 야당임을 내세웠다. 이 주장은 1947년 총선에서 농민당 명부를 무효화하는 근거로 쓰였다.

정부는 두 차례 사면을 내렸다. 1945년 7월 22일부터 10월 15일까지의 첫 사면에서 30,217명이 신고했고, 1947년 2월 22일 국회가 통과시켜 2월 25일부터 4월 25일까지 시행된 두 번째 사면에서는 76,774명이 신고했다. 공안부 자체 통계로 자유독립협회 성원의 90%, 국민군 성원의 60%였다. 신고 때 작성된 진술서는 그 뒤 체포의 자료가 되었다.

## 1946년 6월 30일 국민투표: 공식 집계와 문서고의 집계

정부는 얄타가 약속한 총선을 미루고 국민투표를 먼저 치렀다. 질문은 세 가지였다. 상원 폐지에 찬성하는가, 토지개혁과 기간산업 국유화를 헌법에 담는 데 찬성하는가, 발트해와 오데르·나이세강의 서부 국경을 확정하는 데 찬성하는가. 노동자당과 그 동맹은 「세 번 찬성」을 내걸었고, 국가 기관과 군, 언론이 이 구호를 실었다. 공식 투표율은 85%를 넘었다. 농민당은 두 번째와 세 번째 질문에는 찬성하되, 정부 진영과 구별되는 표를 만들기 위해 첫 질문에 반대를 권고했다.

7월 12일 발표된 공식 결과는 첫 질문 찬성 68.2%, 두 번째 77.2%, 세 번째 91.4%였다. 농민당은 자체 참관 결과를 근거로 첫 질문의 실제 결과가 반대 다수라고 발표했고, 참관이 가능했던 크라쿠프에서는 첫 질문 반대가 70% 안팎이었다. 1989년 이후 안제이 파치코프스키가 폴란드 당 문서에서 찾아낸 내부 집계는 첫 질문 찬성 26.9%, 두 번째 42.0%, 세 번째 66.9%였다. 러시아 문서를 연구한 니키타 페트로프에 따르면 소련 국가보안부의 아론 팔킨이 이끄는 요원단이 개표 서류를 다시 작성하는 일을 맡았다. 정부는 당시 이 결과를 「인민의 지지」로 발표했고, 농민당과 서방 정부는 집계 조작을 항의했다. 국민투표 나흘 뒤인 7월 4일 키엘체에서 유대인 42명이 살해된 사건은 국내외의 시선을 다른 곳으로 돌렸고, 정부는 이를 지하와 농민당의 책임으로 돌렸다.

## 1947년 1월 총선과 미코와이치크의 출국

총선은 1947년 1월 19일에 치러졌다. 노동자당, 사회당, 농민당(루블린 계열), 민주당은 「민주블록」의 단일 명부로 나섰다. 미코와이치크의 농민당은 단독으로 명부를 냈다. 선거 전 농민당 후보와 활동가 수백 명이 체포되었고, 52개 선거구 가운데 10곳에서 농민당 명부가 「지하와의 연계」를 이유로 무효 처리되었다. 투표 당일 공장과 부대는 대열을 지어 투표소로 갔고, 많은 곳에서 공개 투표가 요구되었다. 투표 뒤 미국과 영국은 얄타 합의 위반을 들어 항의 각서를 보냈고, 소련은 선거가 합의대로 치러졌다고 답했다. 공식 결과는 민주블록 80.1%(444석 중 394석), 농민당 10.3%(28석)였다. 농민당은 자체 집계로 자당이 다수를 얻었다고 발표했다. 1990년대에 공개된 문서에서 역사가들은 국민투표 때와 같은 방식이 쓰였음을 확인했고, 실제 득표는 문서로 남지 않아 추정만 있다.

2월 4일 입법의회가 열렸고, 5일 비에루트가 대통령에, 6일 사회당의 유제프 치란키에비치가 총리에 선출되었다. 2월 19일 「소헌법」이 통과되어 입법의회와 대통령, 국가평의회의 권한을 정했다. 미코와이치크는 정부에서 빠졌다. 1947년 봄부터 농민당 안에서는 정부와의 협력을 주장하는 흐름이 커졌고, 미코와이치크 계열은 지방 조직과 당 기관지에서 밀려났다. 농민당은 안에서 갈라져 정부 협력파가 「농민당 좌파」를 만들었고, 미코와이치크는 10월 20일 미국 대사관 트럭에 숨어 바르샤바를 떠나 그디니아에서 배로 영국에 갔다. 남은 농민당은 협력파가 이끌었고 1949년 11월 루블린 계열과 합쳐 통일농민당이 되었다.

## 「폴란드의 길」에서 「우익 민족주의 편향」으로

고무우카는 1945년부터 1947년까지의 연설과 글에서 폴란드가 소비에트 체제와 다른 길로 사회주의에 이른다고 말했다. 프롤레타리아 독재와 농업 집단화 없이, 다당 연립과 의회를 유지하면서, 그리고 폴란드 사회주의의 전통을 이어서 가는 길이었다. 1947년 9월 코민포름 창립회의에서 그는 기구의 창설 자체에 유보를 표했고, 이 회의의 경과는 [마셜 플랜](/commulingo/events/marshall-plan) 항목이 다룬다. 1948년 6월 3일 중앙위원회 전원회의에서 그는 폴란드 사회당의 독립 전통을 긍정하고 폴란드왕국·리투아니아 사회민주당의 민족 문제 노선을 비판하는 보고를 했다.

1948년 6월 코민포름이 유고슬라비아를 제명한 뒤 비판이 시작되었다. 8월 31일부터 9월 3일까지의 중앙위원회 전원회의는 고무우카의 「우익 민족주의 편향」을 비판했고, 그는 자아비판 뒤 9월 3일 서기장직에서 해임되었다. 비에루트가 그 자리를 이었다. 「우익 민족주의 편향」은 비에루트 진영이 쓴 용어였고, 고무우카 자신은 이를 받아들이는 형식을 취하면서도 이후의 회고에서 소련 모델의 기계적 적용에 대한 반대였다고 설명했다. 통합대회 뒤에도 그는 중앙위원으로 남았으나, 1949년 11월 전원회의는 고무우카, 국방차관을 지낸 마리안 스피할스키, 제논 클리슈코를 중앙위원회에서 제외했다. 스피할스키는 1950년 체포되었다. 고무우카는 1951년 8월 체포되어 재판 없이 1954년 12월까지 구금되었다. 그가 왜 재판에 넘겨지지 않았는지는 헝가리와 체코슬로바키아의 재판과 비교되어 논의되며, 비에루트의 판단, 소련의 지시, 고무우카가 자백을 거부한 사실이 각각 근거로 거론된다.

## 통합대회와 1949년: 확정된 것

사회당과 노동자당의 통합은 1948년 3월 치란키에비치가 모스크바에서 스탈린과 협의한 뒤 본격화되었다. 사회당은 4월 통합에 반대하는 인사를 집행부에서 제외했고, 10월 두 번째 당원 심사를 실시했다. 통합 직전 사회당 당원은 53만 1천 명으로 줄어 있었고, 심사에서 제명된 이들 가운데는 전쟁 전 사회당의 지도부 다수가 있었다. 노동자당 쪽도 같은 해 당원 재등록을 거쳤다. 12월 15일부터 21일까지 바르샤바 공과대학에서 열린 통합대회는 폴란드통일노동자당을 세웠고, 비에루트가 중앙위원회 의장, 치란키에비치가 서기장이 되었다. 통합 강령은 인민민주주의를 프롤레타리아 독재의 한 형태로 규정했다. 새 당의 당원은 약 150만 명이었고, 그 가운데 3분의 2가 노동자당 출신이었다. 이 정식의 내력은 [상위 문서](/commulingo/events/eastern-europe-peoples-democracies)가 다룬다.

1949년에 남은 것들이 정리되었다. 11월 소련 원수 콘스탄틴 로코솝스키가 국방장관에 임명되어 폴란드 원수 계급을 받았고, 소련군 장교 수백 명이 폴란드군 지휘부에 들어갔다. 같은 달 두 농민당이 통일농민당으로 합쳐졌다. 민주당은 별개 정당으로 남았다. 헌법은 1952년 7월 22일에 채택되었다.

이 5년을 폴란드 인민공화국의 공식 서술은 「인민민주주의 혁명」으로, 런던 망명 진영과 1989년 이후의 폴란드 역사학은 「체제의 강요」로 서술했다. 크리스티나 케르스텐의 『권력 체제의 탄생』(1985, 지하 출판)과 파치코프스키의 연구는 문서고의 집계를 이 논쟁에 더했다. 그 사이에 다른 독법도 있다. 얀 그로스는 1939년부터 1945년까지의 점령과 전쟁이 폴란드 사회의 옛 엘리트와 소유 관계를 이미 허물어, 1944년 이후의 조치가 백지 위가 아니라 전쟁이 바꾼 사회 위에 놓였다고 본다. 케르스텐과 파치코프스키는 같은 자료에서 소련의 결정과 공안부의 역할을 강조한다. 두 서술이 같은 사건을 다르게 부른다는 사실 자체가, 1944년부터 1948년까지 세워진 것이 무엇이었는지에 대한 판단이 아직 갈린다는 것을 보여 준다.$t$,
  $t$## Two Governments: The Lublin Committee and the Exile Government in London

On 22 July 1944 the Polish Committee of National Liberation issued its manifesto, dated at Chełm. The text had been drafted in Moscow, and the committee installed itself in Lublin on 1 August. Its chairman was Edward Osóbka-Morawski of the Socialist left; effective authority lay with Bolesław Bierut, chairman of the State National Council formed underground in Warsaw on 1 January 1944, and with Władysław Gomułka, general secretary of the Workers' Party. The committee declared itself the heir of the constitution of 1921 and called the London government "an illegal government based on the fascist constitution of 1935". The same day the Soviet Union and the committee signed an agreement handing the administration of the Soviet rear areas to the committee, and on 27 July a secret agreement on the Curzon line as the frontier followed. The committee had an army too: Zygmunt Berling's First Army, raised in the Soviet Union in 1943, was reorganised as the Polish Army in July 1944 under the commander-in-chief Michał Rola-Żymierski, and by the spring of 1945 it numbered some 400,000. Of the committee's fifteen members only a minority belonged to the Workers' Party, but security, defence, information and administration were the Workers' Party's portfolios.

In London stood the exile government led since July 1943 by Stanisław Mikołajczyk, and at home its Home Army and government delegation. Mikołajczyk met Stalin in Moscow at the beginning of August, and in October, in Moscow again with Churchill, he was told to accept the Curzon line as the frontier. Unable to carry his cabinet, he resigned on 24 November and Tomasz Arciszewski succeeded him. From August to October, while the Warsaw Uprising ran, Soviet forces stood on the east bank of the Vistula; the course of the rising and the debate that followed are covered in the [Warsaw Uprising](/commulingo/events/warsaw-uprising) entry.

On 31 December the State National Council turned the committee into the Provisional Government of the Republic of Poland, which the Soviet Union recognised on 5 January 1945. Soviet troops entered the ruins of Warsaw on 17 January, and on 19 January the Home Army's commander Leopold Okulicki ordered the Home Army dissolved. Poland had two governments and two armies, but only one government administered territory.

## From Yalta to the Provisional Government of National Unity: Mikołajczyk's Return

At Yalta in February 1945 the three powers agreed that "the Provisional Government which is now functioning in Poland should be reorganised on a broader democratic basis" and that it should hold "free and unfettered elections on the basis of universal suffrage and secret ballot". The wording and its enforceability are discussed in the [Yalta](/commulingo/events/yalta-potsdam) entry. A three-power commission of Molotov, Harriman and Clark Kerr was set up in Moscow for the reorganisation.

On 27 and 28 March sixteen underground leaders, among them the government delegate Jan Stanisław Jankowski and Okulicki, went to Pruszków for talks with the Soviet command, were arrested by the NKVD and taken to Moscow. From 17 to 21 June, while Mikołajczyk negotiated the new government in Moscow, the "Trial of the Sixteen" was held in the same city from 18 to 21 June. Okulicki received ten years, Jankowski eight, Bień and Jasiukowicz five, and three were acquitted. Okulicki died in a Moscow prison in December 1946.

The Provisional Government of National Unity took office on 28 June. Osóbka-Morawski was prime minister, Gomułka and Mikołajczyk deputy prime ministers, and Mikołajczyk also minister of agriculture. Those returning from London held a minority of the twenty-one ministries. The United States and Britain recognised the government on 5 July and withdrew recognition from London. On 22 August Mikołajczyk broke with the Lublin-line peasant party and refounded the Polish Peasant Party, which by early 1946 claimed 800,000 members. The Workers' Party confirmed Gomułka as general secretary at its first congress in December 1945; it had about 230,000 members at the end of that year. The coalition also held the Socialist Party of Osóbka-Morawski and Cyrankiewicz, the Lublin-line peasant party and the Democratic Party, and the Workers' Party pursued an electoral alliance with them under the banner of "unity of the democratic camp".

At the Peasant Party congress of January 1946 Mikołajczyk demanded the early free election promised at Yalta. In February the Workers' Party offered the Peasant Party a place on a single list with 20 per cent of the seats; the Peasant Party asked for 75 per cent and declined. That breakdown led to the decision to postpone the election and hold a referendum first. Meanwhile arrests of the Peasant Party's local organisations and killings of its activists continued; the party counted over a hundred activists killed by early 1947. The government attributed the killings to the underground, the Peasant Party to the security ministry.

## Land Reform and Nationalisation: What the Coalition Passed Together

Land reform was the committee's first act in Lublin. The decree of 6 September 1944 took private estates over 50 hectares of farmland (100 hectares in total area) and German-owned land without compensation, for distribution. By 1949 some 6.1 million hectares had gone to 1.1 million households, more than half of it in the newly acquired western territories. Mikołajczyk's Peasant Party argued with the Workers' Party over the method of distribution and the share kept as state farms, but did not oppose the reform itself. Landowners were removed from their estates immediately after the decree, and most did not go to new holdings inside the western frontier fixed after Potsdam.

On 3 January 1946 the State National Council passed the nationalisation of major industry. Property of the German state and of Germans was taken without compensation; Polish enterprises employing more than fifty per shift were nationalised with compensation promised. The Peasant Party voted for the law and asked in return for freedom for small and medium enterprise and for trade. Compensation was in practice hardly paid. In 1947 the minister of industry Hilary Minc declared a "battle for trade" that replaced private wholesale and retail with state and cooperative trade, and the three-year plan of 1947–49 aimed at restoring pre-war output.

In the western territories Poles from the east settled where Germans had left. Some three million Germans were expelled between 1945 and 1947, and about 1.5 million Poles moved from the eastern territories ceded to the Soviet Union. No party of the coalition opposed these transfers, and the western frontier became the third question of the 1946 referendum. The Ministry of Recovered Territories, created in November 1945, was held by Gomułka until January 1949, and settlement, land distribution and the expulsion of Germans passed through it. The western territories were where the Workers' Party built its organisation while carrying out land reform and settlement together, and where the government bloc's official vote in the 1946 referendum and the 1947 election was announced at its highest.

## The Security Ministry and the Underground: The Sixteen, Augustów, Two Amnesties

The committee set up a public security department in July 1944, which became the Ministry of Public Security on 1 January 1945. Its minister was Stanisław Radkiewicz; in the party, security was overseen by the Politburo member Jakub Berman. The ministry had some 20,000 officers at the end of 1945, with the Internal Security Corps, the Citizens' Militia and, from February 1946, the Volunteer Reserve Militia under it. The Soviet NKVD kept its own units and advisers. Ivan Serov was in Poland in early 1945 as NKVD plenipotentiary for the rear of the First Belorussian Front, and his men carried out the arrest of the sixteen in March. From 10 to 25 July 1945 a Soviet sweep in the Suwałki and Augustów districts arrested some 2,000 people, of whom about 600 never returned; Poland's Institute of National Remembrance holds that they were executed and buried on Russian territory.

The armed underground outlasted the Home Army's dissolution. On 2 September 1945 former Home Army officers founded the Freedom and Independence Association (WiN) in Warsaw; its first president, Jan Rzepecki, was arrested on 5 November. Units of the National Armed Forces (NSZ) also operated. The underground attacked the security ministry, the militia and Workers' Party activists; the government called them "reactionary bands", and the underground called itself the successor of the Home Army. Since 1989 the name "cursed soldiers" has been used in Poland. Estimates of the dead on both sides differ and run to thousands each. Polish historians put the armed underground in 1945 at between 15,000 and 20,000; after the amnesty of 1947 small units of a few hundred remained active into the early 1950s. The government repeatedly asserted a link between the Peasant Party and the underground in trials and propaganda; the party denied it and insisted on its standing as a legal opposition. The assertion served as the ground for striking off Peasant Party lists in the election of 1947.

The government declared two amnesties. In the first, from 22 July to 15 October 1945, 30,217 people came forward. The second, passed by the Sejm on 22 February 1947 and in force from 25 February to 25 April, brought 76,774; by the ministry's own figures, 90 per cent of WiN's members and 60 per cent of the NSZ's. The statements written at registration became material for the arrests that followed.

## The Referendum of 30 June 1946: The Official Count and the Archival Count

The government postponed the election promised at Yalta and held a referendum first. Three questions were put: whether to abolish the Senate, whether to write land reform and the nationalisation of major industry into the constitution, and whether to confirm the western frontier on the Baltic, the Oder and the Neisse. The Workers' Party and its allies campaigned for "three times yes", a slogan carried by the state administration, the army and the press. Official turnout exceeded 85 per cent. The Peasant Party supported the second and third questions and, to produce a vote distinguishable from the government's, urged "no" on the first.

The official result announced on 12 July gave 68.2 per cent "yes" on the first question, 77.2 on the second and 91.4 on the third. The Peasant Party, citing its own observers, announced that the real result on the first question was a majority of "no"; in Kraków, where observation was possible, "no" on the first question ran at around 70 per cent. After 1989 Andrzej Paczkowski found internal tallies in Polish party files showing 26.9 per cent "yes" on the first question, 42.0 on the second and 66.9 on the third. According to Nikita Petrov, working from Russian files, a team of the Soviet Ministry of State Security under Aron Palkin handled the rewriting of the count sheets. The government at the time announced the result as "the people's support"; the Peasant Party and Western governments protested falsification. Four days after the vote, on 4 July, forty-two Jews were killed in Kielce, and the government attributed the pogrom to the underground and the Peasant Party.

## The Election of January 1947 and Mikołajczyk's Departure

The election was held on 19 January 1947. The Workers' Party, the Socialists, the Lublin-line Peasant Party and the Democratic Party ran on the single list of the "Democratic Bloc". Mikołajczyk's Peasant Party ran alone. Before the vote several hundred of its candidates and activists were arrested, and in ten of the fifty-two districts its lists were struck off for "links with the underground". On polling day factories and army units marched to the polls in formation, and open voting was demanded in many places. Afterwards the United States and Britain sent notes of protest citing the Yalta agreement, and the Soviet Union replied that the election had been held as agreed. The official result gave the Democratic Bloc 80.1 per cent (394 of 444 seats) and the Peasant Party 10.3 (28 seats). The Peasant Party announced from its own count that it had won a majority. From files opened in the 1990s historians confirmed that the same method as in the referendum was used; the true vote was not recorded and only estimates exist.

The legislative Sejm met on 4 February; on the 5th it elected Bierut president and on the 6th the Socialist Józef Cyrankiewicz prime minister. On 19 February the "Little Constitution" defined the powers of the Sejm, the president and the Council of State. Mikołajczyk was out of the government. From the spring of 1947 a current favouring cooperation with the government grew inside the Peasant Party, and Mikołajczyk's followers were pushed out of the local organisations and the party press. The party split from within, its pro-government wing forming a "Peasant Party Left", and on 20 October Mikołajczyk left Warsaw hidden in a United States embassy truck and sailed from Gdynia to Britain. The remaining party was led by the cooperating wing and merged with the Lublin line in November 1949 as the United Peasant Party.

## From the "Polish Road" to "Rightist-Nationalist Deviation"

In speeches and articles from 1945 to 1947 Gomułka said that Poland would reach socialism by a road different from the Soviet system: without the dictatorship of the proletariat or agricultural collectivisation, keeping a multi-party coalition and a parliament, and continuing the tradition of Polish socialism. At the founding conference of the Cominform in September 1947 he expressed reservations about creating the body at all; that conference is covered in the [Marshall Plan](/commulingo/events/marshall-plan) entry. At the Central Committee plenum of 3 June 1948 he gave a report affirming the independence tradition of the Polish Socialist Party and criticising the line of the Social Democracy of the Kingdom of Poland and Lithuania on the national question.

The criticism began after the Cominform expelled Yugoslavia in June 1948. The Central Committee plenum of 31 August to 3 September condemned Gomułka's "rightist-nationalist deviation", and after self-criticism he was removed as general secretary on 3 September. Bierut took his place. "Rightist-nationalist deviation" was the term of Bierut's camp; Gomułka went through the form of accepting it while explaining in later recollections that his objection had been to mechanical application of the Soviet model. He remained on the Central Committee after the unification congress, but the plenum of November 1949 dropped Gomułka, the former deputy defence minister Marian Spychalski and Zenon Kliszko from it; Spychalski was arrested in 1950. Gomułka was arrested in August 1951 and held without trial until December 1954. Why he was never brought to trial is discussed by comparison with the Hungarian and Czechoslovak cases, with Bierut's judgement, Soviet instruction and Gomułka's refusal to confess each cited as reasons.

## The Unification Congress and 1949: What Was Fixed

The merger of the Socialist and Workers' parties gathered pace after Cyrankiewicz discussed it with Stalin in Moscow in March 1948. In April the Socialists removed opponents of the merger from their executive, and in October they carried out a second vetting of members; on the eve of the merger the party had shrunk to 531,000 members, and those expelled in the vetting included much of the pre-war Socialist leadership. The Workers' Party went through its own re-registration of members the same year. The unification congress, held at Warsaw Polytechnic from 15 to 21 December, founded the Polish United Workers' Party, with Bierut as chairman of the Central Committee and Cyrankiewicz as general secretary. Its programme defined people's democracy as a form of the dictatorship of the proletariat; The new party had about 1.5 million members, two thirds of them from the Workers' Party. The history of that formula is in the [parent entry](/commulingo/events/eastern-europe-peoples-democracies).

What remained was settled in 1949. In November the Soviet marshal Konstantin Rokossovsky was appointed minister of national defence and given the rank of Marshal of Poland, and several hundred Soviet officers entered the Polish command. The same month the two peasant parties merged as the United Peasant Party; the Democratic Party remained a separate party. The constitution was adopted on 22 July 1952.

The official account of the Polish People's Republic called these five years the "people's democratic revolution"; the London exile camp and Polish historiography after 1989 called them the imposition of a system. Krystyna Kersten's The Birth of the System of Power (1985, in underground print) and Paczkowski's research added the archival tallies to the debate. Other readings stand between them. Jan Gross holds that occupation and war from 1939 to 1945 had already dismantled the old elites and property relations of Polish society, so that the measures after 1944 fell not on a blank page but on a society the war had changed; Kersten and Paczkowski, from the same material, stress Soviet decision and the role of the security ministry. That the two accounts name the same events differently shows that the judgement on what was built between 1944 and 1948 is still divided.$t$,
  $$[
    {"date":"1944.07.22","country":["poland","soviet"],"title":{"ko":"루블린 위원회의 선언","en":"The Lublin Committee's manifesto"},"body":{"ko":"폴란드민족해방위원회가 헤움 발로 선언문을 내고 8월 1일 루블린에 자리 잡았다. 문안은 모스크바에서 작성되었고, 위원회는 런던 망명정부를 불법으로 규정했으며, 7월 27일 커즌선 국경에 관한 비밀 협정이 뒤따랐다.","en":"The Polish Committee of National Liberation issued its manifesto dated at Chełm and settled in Lublin on 1 August. The text was drafted in Moscow, the committee declared the London government illegal, and a secret agreement on the Curzon line followed on 27 July."}},
    {"date":"1944.09.06","country":"poland","title":{"ko":"토지개혁 포고","en":"The land reform decree"},"body":{"ko":"루블린 위원회의 포고는 농지 50헥타르를 넘는 사유지와 독일인 소유지를 무상 몰수해 분배하도록 했다. 1949년까지 약 610만 헥타르가 110만 농가에 나뉘었고, 미코와이치크의 농민당도 개혁 자체에는 반대하지 않았다.","en":"The Lublin Committee's decree took private estates over 50 hectares of farmland and German-owned land without compensation for distribution. By 1949 some 6.1 million hectares had gone to 1.1 million households, and Mikołajczyk's Peasant Party did not oppose the reform itself."}},
    {"date":"1944.12.31","country":["poland","soviet"],"title":{"ko":"임시정부 선포","en":"The Provisional Government proclaimed"},"body":{"ko":"국가국민평의회가 위원회를 폴란드공화국 임시정부로 바꾸었고, 소련은 1945년 1월 5일 이를 승인했다. 1월 17일 소련군이 폐허가 된 바르샤바에 들어갔고, 1월 19일 국내군 사령관 오쿨리츠키는 국내군 해산을 명령했다.","en":"The State National Council turned the committee into the Provisional Government of the Republic of Poland, recognised by the Soviet Union on 5 January 1945. Soviet troops entered ruined Warsaw on 17 January, and on 19 January the Home Army's commander Okulicki ordered it dissolved."}},
    {"date":"1945.03.28","country":["poland","soviet"],"title":{"ko":"지하 지도자 16인 체포","en":"The sixteen underground leaders arrested"},"body":{"ko":"지하 정부 대표 얀코프스키와 국내군 사령관 오쿨리츠키를 비롯한 열여섯 명이 프루슈쿠프에서 소련 내무인민위원부에 체포되어 모스크바로 이송되었다. 6월 18일부터 21일까지 재판을 받았다.","en":"Sixteen leaders including the government delegate Jankowski and the Home Army commander Okulicki were arrested at Pruszków by the Soviet NKVD and taken to Moscow. They were tried from 18 to 21 June."}},
    {"date":"1945.06.28","country":"poland","title":{"ko":"국민통일임시정부 출범","en":"The Provisional Government of National Unity"},"body":{"ko":"얄타 합의에 따라 재조직된 정부에 미코와이치크가 부총리 겸 농업장관으로 들어갔고, 런던에서 돌아온 쪽은 21개 부처 가운데 소수를 얻었다. 미국과 영국은 7월 5일 이 정부를 승인하고 런던 정부의 승인을 거두었다.","en":"Under the Yalta agreement the government was reorganised, with Mikołajczyk as deputy prime minister and minister of agriculture and a minority of the twenty-one ministries for those returning from London. The United States and Britain recognised it on 5 July and withdrew recognition from London."}},
    {"date":"1945.07.22","country":"poland","title":{"ko":"첫 사면","en":"The first amnesty"},"body":{"ko":"7월 22일부터 10월 15일까지의 사면에 지하조직원 30,217명이 신고했다. 같은 7월 아우구스투프 일대의 소련군 소탕 작전으로 약 600명이 사라졌고, 9월 2일에는 국내군 출신 장교들이 자유독립협회(WiN)를 세웠다.","en":"In the amnesty from 22 July to 15 October, 30,217 members of the underground came forward. The same July a Soviet sweep around Augustów left some 600 people missing, and on 2 September former Home Army officers founded the Freedom and Independence Association (WiN)."}},
    {"date":"1946.01.03","country":"poland","title":{"ko":"기간산업 국유화법","en":"The nationalisation of major industry"},"body":{"ko":"국가국민평의회가 독일인 재산과 교대 근무 인원 50명을 넘는 기업의 국유화를 통과시켰다. 미코와이치크의 농민당도 찬성하며 중소기업과 상업의 자유를 요구했고, 폴란드인 소유주에게 약속된 보상은 실제로는 거의 지급되지 않았다.","en":"The State National Council nationalised German property and enterprises employing more than fifty per shift. Mikołajczyk's Peasant Party voted for it while asking for freedom for small enterprise and trade; the compensation promised to Polish owners was in practice hardly paid."}},
    {"date":"1946.06.30","country":"poland","title":{"ko":"국민투표","en":"The referendum"},"body":{"ko":"상원 폐지, 개혁의 헌법화, 서부 국경의 세 질문에 대한 투표. 노동자당은 「세 번 찬성」을, 농민당은 첫 질문 반대를 권고했다. 공식 결과는 첫 질문 찬성 68.2%였고, 1989년 이후 파치코프스키가 공개한 내부 집계는 26.9%였다.","en":"A vote on three questions: abolishing the Senate, writing the reforms into the constitution, and the western frontier. The Workers' Party urged \"three times yes\", the Peasant Party \"no\" on the first. The official result on the first question was 68.2 per cent yes; the internal tally Paczkowski published after 1989 was 26.9."}},
    {"date":"1947.01.19","country":"poland","title":{"ko":"입법의회 선거","en":"The legislative election"},"body":{"ko":"공식 결과는 민주블록 80.1%, 농민당 10.3%였다. 선거 전 농민당 후보 수백 명이 체포되고 10개 선거구에서 명부가 무효 처리되었으며, 미국과 영국은 얄타 위반을 항의했다. 2월 5일 비에루트가 대통령, 6일 치란키에비치가 총리가 되었다.","en":"The official result gave the Democratic Bloc 80.1 per cent and the Peasant Party 10.3. Several hundred Peasant Party candidates had been arrested and its lists struck off in ten districts, and the United States and Britain protested a breach of Yalta. On 5 February Bierut became president and on the 6th Cyrankiewicz prime minister."}},
    {"date":"1947.10.20","country":"poland","title":{"ko":"미코와이치크의 출국","en":"Mikołajczyk leaves Poland"},"body":{"ko":"2월의 두 번째 사면에 76,774명이 신고한 뒤, 농민당은 안에서 갈라져 정부 협력파가 「농민당 좌파」를 만들었다. 미코와이치크는 미국 대사관 트럭에 숨어 바르샤바를 떠나 그디니아에서 배로 영국에 갔다.","en":"After 76,774 came forward in the second amnesty of February, the Peasant Party split from within, its pro-government wing forming a \"Peasant Party Left\". Mikołajczyk left Warsaw hidden in a United States embassy truck and sailed from Gdynia to Britain."}},
    {"date":"1948.09.03","country":"poland","title":{"ko":"고무우카의 해임","en":"Gomułka removed"},"body":{"ko":"코민포름의 유고슬라비아 제명 뒤 8월 31일부터 열린 중앙위원회 전원회의가 「우익 민족주의 편향」을 비판했고, 고무우카는 자아비판 뒤 서기장직에서 해임되었다. 비에루트가 그 자리를 이었고, 고무우카는 1951년 체포되었다.","en":"After the Cominform's expulsion of Yugoslavia, the Central Committee plenum that opened on 31 August condemned a \"rightist-nationalist deviation\", and after self-criticism Gomułka was removed as general secretary. Bierut took his place; Gomułka was arrested in 1951."}},
    {"date":"1948.12.15","country":"poland","title":{"ko":"통합대회","en":"The unification congress"},"body":{"ko":"12월 21일까지 바르샤바 공과대학에서 열린 대회가 노동자당과 심사를 거친 사회당을 합쳐 폴란드통일노동자당을 세웠다. 비에루트가 중앙위원회 의장, 치란키에비치가 서기장이 되었고, 강령은 인민민주주의를 프롤레타리아 독재의 한 형태로 규정했다.","en":"The congress at Warsaw Polytechnic, running to 21 December, merged the Workers' Party and the vetted Socialist Party into the Polish United Workers' Party. Bierut became chairman of the Central Committee and Cyrankiewicz general secretary, and the programme defined people's democracy as a form of the dictatorship of the proletariat."}}
  ]$$::jsonb,
  $$[
    {"lat":52.23,"lng":21.01,"kind":"main","label":{"ko":"바르샤바","en":"Warsaw"}},
    {"lat":51.25,"lng":22.57,"label":{"ko":"루블린","en":"Lublin"}},
    {"lat":51.14,"lng":23.47,"label":{"ko":"헤움","en":"Chełm"}},
    {"lat":50.06,"lng":19.94,"label":{"ko":"크라쿠프","en":"Kraków"}},
    {"lat":53.84,"lng":22.98,"label":{"ko":"아우구스투프","en":"Augustów"}},
    {"lat":54.52,"lng":18.53,"label":{"ko":"그디니아","en":"Gdynia"}},
    {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"}}
  ]$$::jsonb,
  $$[
    "Krystyna Kersten, The Establishment of Communist Rule in Poland, 1943–1948, University of California Press, 1991",
    "Andrzej Paczkowski, The Spring Will Be Ours: Poland and the Poles from Occupation to Freedom, Penn State University Press, 2003",
    "Andrzej Paczkowski, “Referendum z 30 czerwca 1946 r. Próba wstępnego bilansu,” in Referendum w Polsce i w Europie Wschodniej, 1993",
    "Nikita Petrov, Po scenariyu Stalina: rol organov NKVD-MGB SSSR v sovetizatsii stran Tsentralnoi i Vostochnoi Evropy 1945–1953, ROSSPEN, 2011",
    "Norman Naimark and Leonid Gibianskii, eds., The Establishment of Communist Regimes in Eastern Europe, 1944–1949, Westview Press, 1997",
    "Anne Applebaum, Iron Curtain: The Crushing of Eastern Europe 1944–1956, Doubleday, 2012",
    "Anita J. Prażmowska, Civil War in Poland, 1942–1948, Palgrave Macmillan, 2004",
    "Stanisław Mikołajczyk, The Rape of Poland: Pattern of Soviet Aggression, Whittlesey House, 1948",
    "Jan Gross, “War as Revolution,” in Naimark and Gibianskii, eds., The Establishment of Communist Regimes in Eastern Europe, 1997",
    "Antony Polonsky and Bolesław Drukier, eds., The Beginnings of Communist Rule in Poland, Routledge, 1980",
    "Instytut Pamięci Narodowej, materials on the Augustów roundup and the amnesty of 1947"
  ]$$::jsonb,
  '{"parent":"eastern-europe-peoples-democracies"}'::jsonb
);

INSERT INTO commulingo_history_event_people
  (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('poland-1944-1948', 'boleslaw-bierut', 0, 'leader',
   '국가국민평의회 의장, 대통령, 노동자당 서기장', 'Chairman of the State National Council, president, general secretary',
   '1944년 1월부터 국가국민평의회를 이끌었고, 1947년 2월 대통령이 되었으며, 1948년 9월 고무우카를 대신해 서기장이 되어 12월 통합대회에서 통일노동자당 중앙위원회 의장이 되었다.',
   'He led the State National Council from January 1944, became president in February 1947, replaced Gomułka as general secretary in September 1948 and chaired the United Workers'' Party''s Central Committee from the December congress.'),
  ('poland-1944-1948', 'wladyslaw-gomulka', 1, 'leader',
   '노동자당 서기장, 「폴란드의 길」', 'General secretary of the Workers'' Party, the "Polish road"',
   '1945년부터 소비에트 체제와 다른 폴란드의 길을 말했고 1947년 코민포름 창설에 유보를 표했다. 1948년 9월 「우익 민족주의 편향」으로 해임되었고, 1951년 체포되어 재판 없이 1954년까지 구금되었다.',
   'From 1945 he spoke of a Polish road distinct from the Soviet system and in 1947 expressed reservations about founding the Cominform. Removed for "rightist-nationalist deviation" in September 1948, he was arrested in 1951 and held without trial until 1954.'),
  ('poland-1944-1948', 'stanisaw-mikoajczyk', 2, 'participant',
   '망명정부 총리, 부총리, 농민당 지도자', 'Exile prime minister, deputy prime minister, Peasant Party leader',
   '1944년 11월 런던에서 사임한 뒤 1945년 6월 부총리 겸 농업장관으로 귀국해 농민당을 재건했다. 1946년 국민투표와 1947년 총선의 집계에 항의했고, 1947년 10월 미국 대사관의 도움으로 폴란드를 떠났다.',
   'After resigning in London in November 1944 he returned in June 1945 as deputy prime minister and minister of agriculture and refounded the Peasant Party. He protested the counts of the 1946 referendum and the 1947 election and left Poland in October 1947 with the help of the United States embassy.'),
  ('poland-1944-1948', 'jakub-berman', 3, 'executor',
   '정치국원, 공안 담당', 'Politburo member in charge of security',
   '1944년부터 당에서 공안부와 이데올로기 부문을 관장했고, 1948년 고무우카 비판과 이후의 당내 조사를 지휘했다.',
   'From 1944 he oversaw the security ministry and ideology for the party, and directed the criticism of Gomułka in 1948 and the intra-party investigations that followed.'),
  ('poland-1944-1948', 'serov', 4, 'executor',
   '소련 내무인민위원부 전권대표', 'NKVD plenipotentiary in Poland',
   '1945년 초 제1벨로루시 전선군 후방의 내무인민위원부 전권대표로 폴란드에 있었고, 3월 지하 지도자 16인의 체포를 그의 부하들이 집행했다.',
   'NKVD plenipotentiary for the rear of the First Belorussian Front in early 1945; his men carried out the arrest of the sixteen underground leaders in March.'),
  ('poland-1944-1948', 'jozef-cyrankiewicz', 5, 'participant',
   '사회당 서기장, 총리', 'General secretary of the Socialist Party, prime minister',
   '1947년 2월 총리가 되었고, 1948년 3월 모스크바에서 스탈린과 통합을 협의한 뒤 사회당의 당원 심사를 거쳐 12월 통합대회에서 통일노동자당 서기장이 되었다.',
   'Prime minister from February 1947, he discussed the merger with Stalin in Moscow in March 1948, carried the Socialists through the vetting of members and became general secretary of the United Workers'' Party at the December congress.'),
  ('poland-1944-1948', 'konstantin-rokossovsky', 6, 'executor',
   '폴란드 국방장관에 임명된 소련 원수', 'Soviet marshal appointed Polish defence minister',
   '1949년 11월 국방장관에 임명되어 폴란드 원수 계급을 받았고, 소련군 장교 수백 명이 함께 폴란드군 지휘부에 들어갔다.',
   'Appointed minister of national defence in November 1949 and given the rank of Marshal of Poland, with several hundred Soviet officers entering the Polish command alongside him.'),
  ('poland-1944-1948', 'stalin', 7, 'leader',
   '소련 지도자', 'Soviet leader',
   '1944년 루블린 위원회를 후원했고, 1945년 얄타에서 정부 재조직에 합의했으며, 1948년 3월 치란키에비치와 통합을 협의했다. 고무우카에 대한 비판은 코민포름의 유고슬라비아 제명 뒤 시작되었다.',
   'He sponsored the Lublin Committee in 1944, agreed the reorganisation of the government at Yalta in 1945 and discussed the party merger with Cyrankiewicz in March 1948. The criticism of Gomułka began after the Cominform expelled Yugoslavia.'),
  ('poland-1944-1948', 'molotov', 8, 'participant',
   '정부 재조직 3국 위원회의 소련 대표', 'Soviet member of the three-power commission',
   '1945년 얄타 이후 해리먼, 클라크 커와 함께 모스크바에서 임시정부 재조직을 협의하는 위원회의 소련 대표였다.',
   'The Soviet member of the Moscow commission with Harriman and Clark Kerr that negotiated the reorganisation of the Provisional Government after Yalta in 1945.'),
  ('poland-1944-1948', 'winston-churchill', 9, 'participant',
   '커즌선 수용을 요구한 영국 총리', 'British prime minister who pressed for the Curzon line',
   '1944년 10월 모스크바에서 미코와이치크에게 커즌선을 국경으로 받아들이라고 요구했고, 1945년 2월 얄타에서 정부 재조직과 자유선거 조항에 서명했다.',
   'In Moscow in October 1944 he pressed Mikołajczyk to accept the Curzon line as the frontier, and at Yalta in February 1945 signed the clauses on reorganising the government and holding free elections.'),
  ('poland-1944-1948', 'edward-ochab', 10, 'participant',
   '노동자당 중앙위원', 'Workers'' Party Central Committee member',
   '1944년부터 당 중앙에서 조직 업무를 맡았고, 1948년 고무우카 비판과 12월 통합대회에 참여했다.',
   'From 1944 he handled organisational work at the party centre and took part in the criticism of Gomułka in 1948 and the unification congress in December.'),
  ('poland-1944-1948', 'aleksander-zawadzki', 11, 'participant',
   '노동자당 정치국원', 'Workers'' Party Politburo member',
   '1944년 국가국민평의회와 폴란드군 정치 부문에서 일했고, 1948년 9월 전원회의 뒤 정치국에 남아 통합대회에 참여했다.',
   'He worked in the State National Council and the political department of the Polish army in 1944, remained in the Politburo after the plenum of September 1948 and took part in the unification congress.');

COMMIT;
