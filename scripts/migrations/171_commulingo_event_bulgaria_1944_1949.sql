-- Bulgaria, September 1944 to December 1949: one child document of the hub
-- event eastern-europe-peoples-democracies (relations.parent), sort_order 129
-- inside the hub's run. The hub carries the cross-country stages and the
-- historiography; this page is the Bulgarian record in order, from the
-- Fatherland Front's takeover to the Kostov trial. The Balkan federation and
-- the break with Yugoslavia are told only as far as they moved Bulgarian
-- politics; the Tito-Stalin split page keeps the split itself.
--
-- Dates, actors and official results are given with later-published counts
-- beside them; labels such as "show trial" are attributed to those who used
-- them; where readings differ they stand side by side.
--
-- Timeline entries carry a `country` flag code (data/commulingo/flag-icons.js)
-- for the per-country timeline tagging. No geo.
--
-- People rows use only ids present in the dictionary. Nikola Petkov, Traicho
-- Kostov, Kimon Georgiev, Anton Yugov, Vulko Chervenkov, Kosta Lulchev and
-- Georgi M. Dimitrov (the Agrarian) have no card and appear in the body only.

BEGIN;

INSERT INTO commulingo_history_events (
  id, sort_order, period_label,
  title_ko, title_en, question_ko, question_en,
  summary_ko, summary_en, outcome_ko, outcome_en,
  body_ko, body_en, timeline, locations, sources, relations
) VALUES (
  'bulgaria-1944-1949', 129, '1944–1949',
  '불가리아: 조국전선에서 코스토프 재판까지', 'Bulgaria: From the Fatherland Front to the Kostov Trial',
  '1944년 9월 조국전선 정권에서 1949년 12월 코스토프 재판까지, 불가리아의 권력은 어떤 순서로 공산당에 집중되었고 「인민공화국」이라는 말은 그 사이 무엇을 뜻했는가?',
  'From the Fatherland Front government of September 1944 to the Kostov trial of December 1949, in what order did power in Bulgaria pass to the Communist Party, and what did "people''s republic" mean along the way?',
  $t$1944년 9월 5일 소련이 불가리아에 선전포고하고 8일 국경을 넘자, 9일 새벽 공산당·농민동맹·즈베노·사회민주당의 조국전선이 소피아에서 정권을 잡았다. 인민재판소는 1945년 2월 1일 섭정과 장관들을 처형했고, 불가리아군은 붉은군대와 함께 유고슬라비아와 헝가리에서 싸웠다. 농민동맹은 1945년 페트코프의 야당과 조국전선 잔류파로 갈라졌고, 1946년 국민투표로 왕정이 폐지된 뒤 10월 대국민의회 선거에서 공산당이 과반, 야당이 28%를 얻었다. 1947년 페트코프가 국회에서 체포되어 9월 처형되었고, 12월 디미트로프 헌법과 국유화법이 통과되었다. 1948년 사회민주당이 공산당에 합쳐졌으며, 디미트로프는 12월 제5차 당대회에서 인민민주주의를 프롤레타리아 독재의 한 형태로 규정했다. 1949년 디미트로프가 죽고 부총리 코스토프가 재판을 받아 처형되었다.$t$,
  $t$After the Soviet Union declared war on Bulgaria on 5 September 1944 and crossed the frontier on the 8th, the Fatherland Front of Communists, Agrarians, Zveno and Social Democrats took power in Sofia in the early hours of the 9th. The People's Court executed the regents and ministers on 1 February 1945, and the Bulgarian army fought alongside the Red Army in Yugoslavia and Hungary. The Agrarian Union split in 1945 between Petkov's opposition and those who stayed in the Front; after the referendum of 1946 abolished the monarchy, the Grand National Assembly election of October gave the Communists a majority and the opposition 28 per cent. In 1947 Petkov was arrested in parliament and executed in September, and in December the Dimitrov constitution and the nationalisation law were passed. The Social Democrats were merged into the Communist Party in 1948, and at the Fifth Congress in December Dimitrov defined people's democracy as a form of the dictatorship of the proletariat. In 1949 Dimitrov died and the deputy prime minister Kostov was tried and executed.$t$,
  $t$1949년 말 불가리아에는 공산당이 지도하는 조국전선 단일 조직, 소련 헌법을 본뜬 1947년 헌법, 국유화된 공업과 은행, 시작 단계의 농업 집단화, 소련과의 1948년 양자조약이 자리 잡았다. 농민동맹은 조국전선 안의 위성 정당으로 남았고 사회민주당은 사라졌다. 발칸 연방 구상과 피린 마케도니아 정책은 1948년 유고슬라비아 결별로 뒤집혔다. 페트코프와 코스토프의 재판은 1956년 이후 각각 다른 방식으로 재검토되었다. 코스토프는 1956년 당에 의해 복권되었고, 페트코프는 1990년 법원에서 무죄가 선고되었다.$t$,
  $t$By the end of 1949 Bulgaria had a single Fatherland Front organisation led by the Communist Party, the constitution of 1947 modelled on the Soviet one, nationalised industry and banks, the beginnings of agricultural collectivisation, and the bilateral treaty with the Soviet Union of 1948. The Agrarian Union remained as a satellite party inside the Front and the Social Democrats had disappeared. The Balkan federation idea and the Pirin Macedonia policy were reversed by the break with Yugoslavia in 1948. The trials of Petkov and Kostov were re-examined after 1956 in different ways: Kostov was rehabilitated by the party in 1956, and Petkov was acquitted by a court in 1990.$t$,
  $t$## 1944년 9월: 선전포고와 9일의 정권 교체

1944년 여름 불가리아는 독일의 동맹국이었으나 소련과는 교전 상태가 아니었다. 1943년 8월 국왕 보리스 3세가 죽은 뒤 어린 시메온 2세를 대신해 섭정 세 명이 통치했고, 붉은군대가 8월 말 루마니아를 통과해 다뉴브강에 이르자 정부는 서둘러 움직였다. 8월 26일 이반 바그랴노프 정부는 중립을 선언했고, 9월 2일 들어선 콘스탄틴 무라비에프 정부는 독일과의 관계를 끊겠다고 밝혔다. 9월 5일 소련은 불가리아에 선전포고했다. 명분은 불가리아가 독일군의 철수 통로가 되고 있다는 것이었다. 무라비에프 정부는 9월 8일 독일에 선전포고했으나, 같은 날 표도르 톨부힌의 제3우크라이나 전선군이 국경을 넘었고 불가리아군은 저항하지 않았다.

9월 8일 밤과 9일 새벽 사이에 소피아에서 조국전선이 정권을 잡았다. 조국전선은 1942년 공산당이 제안해 1943년 결성된 연합으로, 공산당(당시 명칭은 불가리아노동자당), 농민동맹의 플라드네파, 즈베노, 사회민주당이 참여했다. 군 안에서는 즈베노와 연결된 다미안 벨체프 등 장교들이 국방부와 참모본부를 장악했고, 지방에서는 파르티잔과 조국전선 위원회가 관청을 접수했다. 총리는 즈베노의 키몬 게오르기에프였고, 내무장관 안톤 유고프와 법무장관 민초 네이체프를 비롯한 네 자리가 공산당에 갔다. 농민동맹은 니콜라 페트코프를 무임소장관으로 넣어 네 자리, 즈베노 네 자리, 사회민주당 두 자리였다. 9월 9일 아침 게오르기에프는 라디오로 새 정부의 강령을 읽었고, 그날 소피아에서는 총격이 거의 없었다. 무라비에프 정부의 각료들은 체포되었다. 부처의 배분보다 오래 남은 것은 경찰의 재편이었다. 유고프의 내무부 아래 인민민병대가 옛 경찰을 대신했고, 그 간부는 공산당원과 파르티잔 출신이었다.

10월 28일 모스크바에서 불가리아는 연합국과 휴전협정을 맺었다. 협정은 불가리아군의 대독 참전, 그리스와 유고슬라비아 점령지에서의 철수, 배상, 그리고 연합국 통제위원회의 설치를 정했다. 위원장은 톨부힌 원수였고, 실무는 부위원장 세르게이 비류조프 상장이 맡아 1947년까지 소피아에 머물렀다. 미국과 영국 대표는 위원회에 참석했으나 결정은 소련 측이 내렸다. [상위 문서](/commulingo/events/eastern-europe-peoples-democracies)가 정리한 대로 이 구조는 헝가리·루마니아와 같았고, 이탈리아의 선례를 뒤집어 적용한 것이었다.

## 인민재판소와 전선의 군대

정권 교체 뒤 처음 넉 달 동안 두 가지 일이 함께 진행되었다. 하나는 전 정권에 대한 재판이고, 다른 하나는 새 군대의 참전이었다.

1944년 9월 30일 정부는 인민재판소 설치령을 발표했다. 재판소는 헌법 밖에 세워진 특별 법정으로, 1941년 이후의 각료·의원·장교·언론인을 「국민을 전쟁에 끌어들인 죄」로 재판했다. 12월 20일 소피아에서 첫 재판이 열렸고, 1945년 2월 1일 판결이 내려졌다. 섭정 세 명(키릴 공, 보그단 필로프, 니콜라 미호프), 왕실 고문 여덟 명, 장관 스물두 명, 제25대 국회의원 예순일곱 명, 장성과 고위 장교 마흔일곱 명에게 사형이 선고되었고, 그날 밤 소피아 중앙교도소에서 처형되었다. 재판소는 1945년 4월까지 전국에서 135건의 재판으로 11,122명을 기소해 9,155명에게 판결을 내렸고, 그 가운데 사형 선고는 2,730건이었다. 실제 집행 수는 확정되어 있지 않다. 재판소와 별도로 1944년 9~10월 지방에서 재판 없이 살해된 사람의 수는 연구자에 따라 수천 명에서 3만 명까지 갈리며, 공식 문서로 확정된 수는 없다. 무라비에프 전 총리는 종신형을 받았다. 당시 정부는 재판을 파시즘 청산으로 설명했고, 야당과 서방 공사관은 규모와 절차를 문제 삼았다. 1996년 불가리아 대법원은 주요 판결을 파기했고, 2월 1일은 오늘날 추모일이다.

같은 기간 불가리아군은 붉은군대의 지휘 아래 서쪽으로 나갔다. 1944년 10월 제1·2·4군 약 45만 명이 유고슬라비아 남부로 진격해 니시·스코페·코소보 방면에서 독일군 E집단군의 철수를 막았고, 1945년 3월 블라디미르 스토이체프의 제1군은 헝가리 드라바강 전선에서 독일군의 봄 공세를 받아냈다. 5월 오스트리아 클라겐푸르트까지 진격한 이 군대의 손실은 두 단계를 합쳐 약 3만 2천 명이었다. 참전은 휴전협정의 의무였고, 동시에 조국전선이 파리 평화조약 협상에서 내세운 근거였다.

## 농민동맹의 분열과 미뤄진 선거

조국전선의 첫 균열은 가장 큰 참여 정당인 농민동맹 안에서 났다. 농민동맹은 전간기 불가리아에서 가장 많은 표를 얻은 정당이었고, 1944년 9월 시점의 지도자는 게오르기 M. 디미트로프(「게메토」라 불려 공산당의 디미트로프와 구별된다)였다. 그는 1945년 1월 공산당과 내무부의 압력 속에 서기장직에서 물러났고, 5월 미국 공사관에 피신했다가 9월 국외로 나갔다. 후임 니콜라 페트코프는 1923년 쿠데타로 살해된 알렉산다르 스탐볼리스키 정부의 각료였던 페트코 페트코프의 동생이자 조국전선 창설에 참여한 인물이었다.

1945년 5월 농민동맹 대회에서 페트코프는 조국전선 안에서 농민동맹의 독자적 조직과 지방 위원회의 동등한 참여를 요구했고, 알렉산다르 오보프가 이끄는 잔류파와 갈라섰다. 여름에 페트코프와 사회민주당의 그리고르 체시메지에프 등 야당 각료들이 사임했다. 정부는 8월 26일 총선을 조국전선 단일 명부로 치르려 했다. 미국과 영국은 선거가 얄타의 「해방된 유럽 선언」에 어긋난다고 항의했고, 소련은 처음에는 예정대로 치르자고 했으나 8월 24일 연기에 동의했다. 선거는 11월 18일에 치러졌다. 페트코프의 농민동맹과 코스타 룰체프의 사회민주당은 참여를 거부했고, 공식 결과는 조국전선 명부 약 88%였다. 12월 모스크바 외무장관 회의에서 미·영·소는 불가리아 정부에 야당 인사 두 명을 넣도록 권고하기로 했으나, 정부와 야당은 조건에서 합의하지 못했고 미국과 영국의 승인은 미뤄졌다.

1946년 1월 미국의 요구로 정부와 야당이 다시 협상했으나, 페트코프는 내무부와 법무부의 인사 교체를 조건으로 내걸었고 정부는 이를 거부했다. 이 시기 게오르기 디미트로프는 아직 모스크바에 있었다. 코민테른 서기장을 지낸 그는 1945년 11월 소피아로 돌아와 공산당 지도부와 함께 국회의원이 되었고, 1946년 11월까지는 정부 밖에서 당을 이끌었다.

## 디미트로프의 귀국, 국민투표, 대국민의회 선거

1946년의 정치는 세 번의 투표로 진행되었다. 3월 국회는 토지 소유 상한을 20헥타르(도브루자 30헥타르)로 정한 토지개혁법과 노동협동농장(TKZS) 법을 통과시켰다. 9월 8일 왕정 폐지 국민투표에서 공식 결과는 찬성 95.6%였고, 9월 15일 국회는 인민공화국을 선포했다. 시메온 2세와 왕실은 이튿날 출국했다. 야당도 왕정 폐지에는 반대하지 않았으므로 국민투표는 조국전선과 야당의 대결이 아니었다.

10월 27일 헌법 제정을 위한 제6차 대국민의회 선거는 달랐다. 선거는 정당별 명부로 치러졌고, 야당은 참여했다. 공식 결과는 공산당 53.9%(465석 중 278석), 조국전선 농민동맹 13.4%(68석), 사회민주당 조국전선파 1.9%(9석), 즈베노 1.7%(8석)였고, 페트코프의 농민동맹과 룰체프의 사회민주당이 연합한 야당 명부는 28.4%로 101석을 얻었다. 야당은 100만 표를 넘겼다. 선거 기간 미국 공사관은 야당 운동원에 대한 폭행과 체포를 보고했고, 정부는 야당이 「반동」과 연결되어 있다고 했다. 11월 22일 디미트로프가 총리가 되었고, 콜라로프는 임시 국가원수를 계속 맡았다. 대국민의회가 열리자 페트코프는 야당의 대표 발언자가 되어 인민민병대와 선거 절차를 문제 삼았다. 디미트로프의 첫 내각에는 즈베노의 게오르기에프가 외무장관, 조국전선 농민동맹의 오보프가 부총리로 남아 연립의 형식이 유지되었다. 1947년 봄까지 야당 신문 「나로드노 제멜레델스코 즈나메」와 「스보보덴 나로드」는 계속 발행되었다.

## 페트코프 재판과 평화조약

1947년 2월 10일 파리에서 연합국과 불가리아의 평화조약이 서명되었다. 조약은 남도브루자를 불가리아에 남겼고, 그리스와 유고슬라비아에 대한 배상을 정했으며, 발효 뒤 90일 안에 연합군의 철수를 규정했다. 미국 상원은 6월 4일 조약을 비준했다.

6월 5일 대국민의회는 페트코프의 면책특권을 박탈했고, 그는 회의장에서 체포되었다. 혐의는 군 안의 「중립장교연맹」과 결탁해 무장 쿠데타를 준비했다는 것이었다. 8월 5일부터 16일까지 소피아에서 재판이 열렸고, 페트코프는 혐의를 부인했다. 변호인 선임과 증인 신청은 제한되었다. 8월 16일 사형이 선고되었다. 미국과 영국은 판결 집행을 막아 달라고 여러 차례 요청했고, 소련은 내정 문제라고 답했다. 9월 15일 평화조약이 발효했고, 9월 23일 페트코프는 소피아 중앙교도소에서 교수형에 처해졌다. 정부는 처형 뒤 페트코프가 사면을 청원했다고 발표했으나 문서는 공개되지 않았다. 8월 26일 그의 농민동맹은 해산되었고, 야당 의원 스물세 명의 의원직이 박탈되었다. 영국 하원에서는 10월 27일 이 재판을 두고 토론이 있었다. 10월 1일 미국은 불가리아 정부를 승인했다.

페트코프 재판을 두고 두 서술이 맞섰다. 정부와 공산당은 재판 기록을 근거로 실제 음모가 있었다고 했고, 서방 공사관과 야당은 이를 정적 제거로 보았다. 1990년 불가리아 대법원은 판결을 파기하고 페트코프의 무죄를 선고했다. 룰체프의 사회민주당 야당 의원들은 1948년 11월 재판에서 징역형을 받았다.

## 헌법, 국유화, 사회민주당 통합

1947년 12월 4일 대국민의회는 새 헌법을 채택했다. 소련 법학자들이 초안 작업에 참여했고, 1936년 소련 헌법을 본뜬 구조에 국민의회와 국가원수 역할의 간부회를 두었다. 「디미트로프 헌법」이라 불린 이 헌법은 1971년까지 유지되었다. 12월 23일 「사영 공업·광업 기업 국유화법」이 통과되어 대기업 1,997곳과 소기업 4,027곳이 국가로 넘어갔고, 12월 27일 모든 사영 은행이 국유화되었다. 1948년 말까지 공업 생산의 약 85%가 국영 부문에서 나왔다.

1948년 2월 2일부터 3일까지 열린 조국전선 제2차 대회는 정당 연합이던 조국전선을 개인 가입의 단일 대중조직으로 바꾸었다. 즈베노는 1949년 2월 자진 해산했고, 조국전선 안의 농민동맹은 남았으나 독자 후보를 내지 않았다. 사회민주당의 조국전선파는 1948년 6월부터 당원 심사를 거쳐 8월 11일 공산당과의 통합을 결정했고, 심사에서 절반 정도가 공산당원이 되었다. 통합 절차는 그해 말 마무리되었다. 3월 18일 소피아에서 소련과 「우호·협력·상호원조조약」이 서명되었다.

1949년 5월 즈베노 출신의 전 국방장관 다미안 벨체프가 스위스 공사로 나가 있던 중 귀국을 거부했고, 같은 해 즈베노 계열 장교들이 군에서 물러났다. 농업에서는 노동협동농장이 늘었다. 1949년 말 약 1,600곳의 협동농장이 경작지의 11% 남짓을 차지했고, 대규모 집단화는 1950년 이후의 일이었다.

## 「인민공화국」의 뜻: 발칸 연방에서 제5차 당대회까지

1945년부터 1947년까지 디미트로프와 불가리아 공산당은 자기 체제를 소비에트 체제와 구별해 설명했다. 디미트로프는 1945~46년의 연설에서 불가리아가 소비에트 공화국이 아니라 인민공화국이 될 것이며, 조국전선의 틀 안에서 의회를 통해 사회주의로 갈 수 있다고 말했다. 그의 일기에 따르면 1946년 9월 2일 스탈린은 불가리아 대표단에게 소비에트 형태를 거치지 않는 길이 가능하며 그 경우 프롤레타리아 독재는 필요 없다고 말했다. 이 노선은 코민포름 창설 이전 각국 공산당의 「자국의 길」 담론과 같은 것이었다.

같은 시기 디미트로프는 유고슬라비아와의 연방을 추진했다. 1947년 8월 1일 블레드에서 디미트로프와 요시프 브로즈 티토는 관세동맹과 비자 폐지, 피린 마케도니아와 바르다르 마케도니아의 통합 준비, 서부 변경 지역의 불가리아 반환을 내용으로 하는 협정에 서명했고, 11월 27일 에브크시노그라드에서 우호조약을 맺었다. 피린 지방에서는 마케도니아어 교사와 서적이 들어왔고, 1946년 12월 인구조사에서 이 지방 주민 다수가 마케도니아인으로 등록되었다. 이 등록은 1948년 이후 취소되었고, 1956년 인구조사에서 다시 한 번 바뀌었다. 연방 구상이 불가리아 국내 정치에 남긴 것은 마케도니아 문제를 둘러싼 이 두 번의 번복이었다. 1948년 1월 17일 디미트로프는 부쿠레슈티에서 그리스까지 포함하는 발칸 연방 구상을 기자들에게 말했고, 1월 28일 프라우다는 이를 공개적으로 부인했다. 2월 10일 모스크바에서 스탈린과 몰로토프는 디미트로프·콜라로프·코스토프의 불가리아 대표단과 에드바르트 카르델·밀로반 질라스의 유고슬라비아 대표단을 함께 불러 사전 협의 없는 외교를 질책했다. 디미트로프는 잘못을 인정했다. 6월 코민포름이 유고슬라비아 공산당을 제명하자 불가리아 공산당은 결의를 지지했고, 피린 마케도니아 정책을 거두었다. 결별 자체는 [티토-스탈린 결별](/commulingo/events/tito-stalin-split) 항목이 다룬다.

정의가 바뀐 시점은 문서로 남아 있다. 1948년 12월 18일부터 25일까지 열린 제5차 당대회에서 디미트로프는 19일의 정치 보고에서 「인민민주주의 정권과 소비에트 정권은 같은 권력, 곧 프롤레타리아 독재의 두 형태」라고 규정했다. 대회는 당명을 불가리아공산당으로 바꾸고 5개년 계획을 채택했다. 1946년의 「소비에트 공화국이 아닌 인민공화국」과 1948년의 「프롤레타리아 독재의 한 형태」는 같은 사람의 말이었고, 그 사이에 코민포름과 유고슬라비아 제명이 있었다. 이 전환을 처음부터의 설계로 읽는 서술과 1947~48년의 정세 변화에 대한 대응으로 읽는 서술은 상위 문서의 해석 절에 정리되어 있다.

## 1949년: 디미트로프의 죽음과 코스토프 재판

1949년 봄 당 안의 정리가 시작되었다. 트라이초 코스토프는 전쟁 중 국내 지하조직을 이끌었고 1944년 이후 당 서기이자 부총리 겸 경제·재정위원회 의장으로 경제를 관장한 인물이었다. 3월 26일부터 27일까지의 중앙위원회 전원회의는 그를 「민족주의적 편향」으로 비판했고, 31일 부총리직에서 해임했다. 6월 11일부터 12일까지의 전원회의에서 콜라로프가 그의 「반당 활동」을 보고했고, 코스토프는 당에서 제명되어 6월 20일 체포되었다. 소련과의 무역에서 불가리아 측 정보를 소련 대표에게 숨기라고 지시했다는 것이 비판의 출발점이었다. 같은 봄 부다페스트에서는 러이크가 체포되었고, 두 사건은 코민포름의 유고슬라비아 결의 이후 각국 당이 「티토주의자」를 찾는 흐름 속에 있었다.

디미트로프는 4월 치료를 위해 소련으로 떠나 7월 2일 모스크바 근교 바르비하에서 죽었다. 유해는 소피아로 옮겨져 영묘에 안치되었다. 7월 20일 콜라로프가 총리가 되었고, 당의 실무는 서기 벌코 체르벤코프가 맡았다.

12월 7일부터 14일까지 소피아에서 코스토프와 피고 아홉 명의 재판이 열렸다. 기소장은 영국 정보기관을 위한 간첩 행위와 티토와 결탁한 정부 전복 음모였다. 코스토프는 재판 첫날 예심 자백을 철회하고 간첩과 음모 혐의를 부인했으며, 이 태도를 재판 끝까지 유지했다. 이 점에서 이 재판은 같은 해 9월 부다페스트의 러이크 재판과 달랐다. 12월 14일 사형이 선고되었고, 16일 집행되었다. 정부는 처형 뒤 코스토프가 사면 청원과 함께 자백서를 남겼다고 발표했다. 재판을 참관한 서방 기자들은 법정에서의 부인을 보도했고, 소련과 동유럽 언론은 판결문을 실었다. 1956년 4월 당 중앙위원회 전원회의는 코스토프를 복권했고, 같은 해 대법원이 판결을 파기했다. 콜라로프는 1950년 1월 23일 죽었고, 2월 체르벤코프가 총리가 되었다.

1949년 말의 불가리아에는 공산당이 지도하는 조국전선, 1947년 헌법, 국유화된 공업과 은행, 소련과의 조약, 그리고 당 안의 재판이 자리 잡았다. 1944년 9월의 연립에 참여한 네 세력 가운데 즈베노와 사회민주당은 없어졌고 농민동맹은 조국전선 안에 남았다. 페트코프 재판과 코스토프 재판은 각각 1990년과 1956년에 다른 방식으로 뒤집혔으며, 인민재판소 판결은 1996년에 파기되었다. 그 뒤로 이어진 일들은 [상위 문서](/commulingo/events/eastern-europe-peoples-democracies)가 정리한다.$t$,
  $t$## September 1944: The Declaration of War and the Change of Power on the 9th

In the summer of 1944 Bulgaria was an ally of Germany but not at war with the Soviet Union. Since the death of King Boris III in August 1943 three regents had ruled on behalf of the boy king Simeon II, and when the Red Army passed through Romania and reached the Danube at the end of August the government moved quickly. On 26 August the government of Ivan Bagryanov declared neutrality, and the government of Konstantin Muraviev, formed on 2 September, announced that it would break with Germany. On 5 September the Soviet Union declared war on Bulgaria, on the grounds that the country was serving as a corridor for the German withdrawal. The Muraviev government declared war on Germany on 8 September, but the same day Fyodor Tolbukhin's Third Ukrainian Front crossed the frontier, and the Bulgarian army did not resist.

Between the night of 8 September and the early hours of the 9th the Fatherland Front took power in Sofia. The Front was a coalition proposed by the Communists in 1942 and formed in 1943, comprising the Communist Party (then named the Bulgarian Workers' Party), the Pladne wing of the Agrarian Union, Zveno and the Social Democrats. Inside the army, officers linked to Zveno such as Damyan Velchev took over the war ministry and the general staff, while in the provinces partisans and Fatherland Front committees took over the local offices. The prime minister was Kimon Georgiev of Zveno; four posts went to the Communists, including the interior ministry under Anton Yugov and the justice ministry under Mincho Neychev. The Agrarians held four posts, with Nikola Petkov as minister without portfolio, Zveno four and the Social Democrats two. On the morning of 9 September Georgiev read the new government's programme over the radio, and there was little shooting in Sofia that day; the ministers of the Muraviev government were arrested. What outlasted the distribution of ministries was the reorganisation of the police: under Yugov's ministry a People's Militia replaced the old police, and its officers were Communists and former partisans.

On 28 October in Moscow Bulgaria signed an armistice with the Allies. It provided for Bulgarian participation in the war against Germany, withdrawal from the occupied territories in Greece and Yugoslavia, reparations, and the establishment of an Allied Control Commission. Marshal Tolbukhin was its chairman, and the vice-chairman, Colonel General Sergei Biryuzov, ran its work in Sofia until 1947. The American and British representatives sat on the commission, but the decisions were taken on the Soviet side. As the [parent page](/commulingo/events/eastern-europe-peoples-democracies) sets out, the arrangement was the same as in Hungary and Romania and applied the Italian precedent in reverse.

## The People's Court and the Army at the Front

Two things ran together in the first four months after the change of power: the trial of the old regime and the new army's entry into the war.

On 30 September 1944 the government issued the decree establishing the People's Court. It was a special court set up outside the constitutional order, and it tried the ministers, deputies, officers and journalists of the years after 1941 for "drawing the nation into the war". The first trial opened in Sofia on 20 December, and the verdicts came on 1 February 1945. Death sentences were passed on the three regents (Prince Kiril, Bogdan Filov and Nikola Mihov), eight royal advisers, twenty-two ministers, sixty-seven deputies of the 25th National Assembly and forty-seven generals and senior officers, and they were executed that night at Sofia Central Prison. By April 1945 the court had tried 135 cases across the country with 11,122 accused and passed judgement on 9,155, of whom 2,730 were sentenced to death. The number actually executed has not been established. Separately from the court, the number killed without trial in the provinces in September and October 1944 ranges in the scholarship from a few thousand to thirty thousand, and no figure has been fixed from official records; the former prime minister Muraviev received a life sentence. The government described the trials as the liquidation of fascism; the opposition and the Western legations questioned their scale and procedure. In 1996 the Bulgarian Supreme Court quashed the principal verdicts, and 1 February is today a day of remembrance.

In the same period the Bulgarian army moved west under Red Army command. In October 1944 the First, Second and Fourth Armies, some 450,000 men, advanced into southern Yugoslavia and blocked the withdrawal of German Army Group E around Niš, Skopje and Kosovo; in March 1945 Vladimir Stoychev's First Army took the German spring offensive on the Drava front in Hungary. The army reached Klagenfurt in Austria in May, and its losses over the two phases were about 32,000. Participation was an obligation of the armistice, and at the same time the argument the Fatherland Front put forward in the Paris peace negotiations.

## The Split in the Agrarian Union and the Postponed Election

The Front's first crack opened inside its largest member, the Agrarian Union. The Union had polled more votes than any other party in interwar Bulgaria, and its leader in September 1944 was Georgi M. Dimitrov, known as "Gemeto" to distinguish him from the Communist Dimitrov. Under pressure from the Communists and the interior ministry he resigned as secretary in January 1945, took refuge in the American legation in May and left the country in September. His successor Nikola Petkov was the brother of Petko Petkov, a minister in the government of Aleksandar Stamboliyski killed after the coup of 1923, and had taken part in founding the Fatherland Front.

At the Agrarian congress of May 1945 Petkov demanded an independent organisation for the Union inside the Front and equal participation in the local committees, and parted from the wing led by Aleksandar Obbov that stayed with the Front. In the summer Petkov and other opposition ministers, including the Social Democrat Grigor Cheshmedzhiev, resigned. The government intended to hold a general election on 26 August on a single Fatherland Front list. The United States and Britain protested that the election contravened the Yalta Declaration on Liberated Europe; the Soviet Union at first favoured going ahead but on 24 August agreed to a postponement. The election was held on 18 November. Petkov's Agrarians and Kosta Lulchev's Social Democrats refused to take part, and the official result gave the Front list about 88 per cent. At the Moscow conference of foreign ministers in December the three powers agreed to advise the Bulgarian government to include two opposition figures, but government and opposition could not agree on terms, and American and British recognition was withheld.

In January 1946 government and opposition negotiated again at American urging, but Petkov made the replacement of the interior and justice ministers his condition and the government refused. Georgi Dimitrov was still in Moscow in this period. The former general secretary of the Comintern returned to Sofia in November 1945, became a deputy alongside the party leadership, and led the party from outside the government until November 1946.

## Dimitrov's Return, the Referendum and the Grand National Assembly Election

The politics of 1946 proceeded through three votes. In March the National Assembly passed a land reform law setting a ceiling of twenty hectares on holdings (thirty in Dobruja) and a law on labour cooperative farms (TKZS). In the referendum of 8 September on abolishing the monarchy the official result was 95.6 per cent in favour, and on 15 September the Assembly proclaimed the People's Republic. Simeon II and the royal family left the country the next day. Since the opposition did not oppose the abolition of the monarchy, the referendum was not a contest between the Front and the opposition.

The election of 27 October for the Sixth Grand National Assembly, which was to write the constitution, was different. It was held on party lists, and the opposition took part. The official result gave the Communist Party 53.9 per cent (278 of 465 seats), the Fatherland Front Agrarians 13.4 per cent (68 seats), the Front Social Democrats 1.9 per cent (9 seats) and Zveno 1.7 per cent (8 seats), while the joint opposition list of Petkov's Agrarians and Lulchev's Social Democrats took 28.4 per cent and 101 seats. The opposition polled more than a million votes. During the campaign the American legation reported beatings and arrests of opposition workers, and the government said the opposition was linked to "reaction". On 22 November Dimitrov became prime minister, with Kolarov continuing as provisional head of state. When the Grand National Assembly met, Petkov became the opposition's principal speaker and challenged the People's Militia and the conduct of the election. In Dimitrov's first cabinet Georgiev of Zveno remained as foreign minister and Obbov of the Front Agrarians as deputy prime minister, so the form of a coalition was kept, and until the spring of 1947 the opposition papers Narodno zemedelsko zname and Svoboden narod continued to appear.

## The Petkov Trial and the Peace Treaty

On 10 February 1947 the peace treaty between the Allies and Bulgaria was signed in Paris. It left Southern Dobruja to Bulgaria, fixed reparations to Greece and Yugoslavia, and provided for the withdrawal of Allied forces within ninety days of its entry into force. The United States Senate ratified the treaty on 4 June.

On 5 June the Grand National Assembly stripped Petkov of his immunity, and he was arrested in the chamber. The charge was that he had conspired with the "Neutral Officers' League" inside the army to prepare an armed coup. The trial was held in Sofia from 5 to 16 August, and Petkov denied the charges; the choice of counsel and the calling of witnesses were restricted. On 16 August he was sentenced to death. The United States and Britain asked repeatedly that the sentence not be carried out, and the Soviet Union replied that it was an internal matter. The peace treaty came into force on 15 September, and on 23 September Petkov was hanged at Sofia Central Prison. After the execution the government announced that he had petitioned for clemency, but the document was not published. His Agrarian Union had been dissolved on 26 August, and twenty-three opposition deputies were deprived of their seats. The British House of Commons debated the trial on 27 October. On 1 October the United States recognised the Bulgarian government.

Two accounts of the Petkov trial stood against each other. The government and the party held, on the basis of the trial record, that there had been a real conspiracy; the Western legations and the opposition saw the removal of a political rival. In 1990 the Bulgarian Supreme Court quashed the verdict and acquitted Petkov. Lulchev's Social Democratic opposition deputies received prison sentences at a trial in November 1948.

## The Constitution, Nationalisation and the Social Democrats' Merger

On 4 December 1947 the Grand National Assembly adopted the new constitution. Soviet jurists took part in the drafting, and the structure, modelled on the Soviet constitution of 1936, provided for a National Assembly and a Presidium acting as head of state. Known as the "Dimitrov constitution", it remained in force until 1971. On 23 December the Law on the Nationalisation of Private Industrial and Mining Enterprises transferred 1,997 larger and 4,027 smaller enterprises to the state, and on 27 December all private banks were nationalised. By the end of 1948 about 85 per cent of industrial output came from the state sector.

The Second Congress of the Fatherland Front, on 2 and 3 February 1948, turned the Front from a coalition of parties into a single mass organisation with individual membership. Zveno dissolved itself in February 1949; the Agrarian Union inside the Front remained but no longer put forward its own candidates. The Front wing of the Social Democrats went through a vetting of members from June 1948 and on 11 August resolved to merge with the Communist Party; about half its members were admitted, and the process was completed at the end of the year. On 18 March the treaty of friendship, cooperation and mutual assistance with the Soviet Union was signed in Sofia.

In May 1949 the former war minister Damyan Velchev of Zveno, then minister in Switzerland, refused to return, and in the same year the Zveno officers left the army. In agriculture the labour cooperative farms grew. By the end of 1949 some 1,600 cooperatives held a little over 11 per cent of the arable land; large-scale collectivisation belonged to the years after 1950.

## What "People's Republic" Meant: From the Balkan Federation to the Fifth Congress

From 1945 to 1947 Dimitrov and the Bulgarian Communist Party explained their system as distinct from the Soviet one. In speeches of 1945 and 1946 Dimitrov said that Bulgaria would be a people's republic rather than a Soviet republic and could reach socialism through parliament within the framework of the Fatherland Front. According to his diary, on 2 September 1946 Stalin told the Bulgarian delegation that a road bypassing the Soviet form was possible and that in that case a dictatorship of the proletariat was unnecessary. The line was the same as the "own road" discourse of the other parties before the founding of the Cominform.

In the same years Dimitrov pursued a federation with Yugoslavia. On 1 August 1947 at Bled Dimitrov and Josip Broz Tito signed an agreement providing for a customs union and the abolition of visas, preparation for the union of Pirin and Vardar Macedonia, and the return of the Western Outlands to Bulgaria, and on 27 November they concluded a treaty of friendship at Evksinograd. Macedonian teachers and books came into the Pirin region, and in the census of December 1946 most of its inhabitants were registered as Macedonians; the registration was reversed after 1948 and changed once more in the census of 1956. What the federation idea left in Bulgarian domestic politics was this double reversal over the Macedonian question. On 17 January 1948 Dimitrov told journalists in Bucharest of a Balkan federation that would include Greece, and on 28 January Pravda publicly disowned the idea. On 10 February in Moscow Stalin and Molotov summoned the Bulgarian delegation of Dimitrov, Kolarov and Kostov together with the Yugoslav delegation of Edvard Kardelj and Milovan Djilas and rebuked them for diplomacy conducted without prior consultation. Dimitrov acknowledged his error. When the Cominform expelled the Yugoslav party in June, the Bulgarian party endorsed the resolution and withdrew its Pirin Macedonia policy. The split itself is covered in the [Tito-Stalin split](/commulingo/events/tito-stalin-split) entry.

The moment the definition changed is documented. At the Fifth Congress, held from 18 to 25 December 1948, Dimitrov's political report of the 19th defined "the people's democratic regime and the Soviet regime" as "two forms of one and the same power, the dictatorship of the proletariat". The congress renamed the party the Bulgarian Communist Party and adopted a five-year plan. The "people's republic, not a Soviet republic" of 1946 and the "form of the dictatorship of the proletariat" of 1948 were the words of the same man, with the Cominform and the expulsion of Yugoslavia between them. The reading of this turn as a design from the start, and the reading of it as a response to the changed situation of 1947–48, are set out in the parent page's section on interpretations.

## 1949: Dimitrov's Death and the Kostov Trial

In the spring of 1949 the settling of accounts inside the party began. Traicho Kostov had led the underground organisation at home during the war and since 1944 had been a party secretary, deputy prime minister and chairman of the Economic and Financial Committee in charge of the economy. The Central Committee plenum of 26 and 27 March criticised him for "nationalist deviation", and on the 31st he was removed as deputy prime minister. At the plenum of 11 and 12 June Kolarov reported on his "anti-party activity", Kostov was expelled from the party, and on 20 June he was arrested. The starting point of the criticism was an instruction that Bulgarian information in trade with the Soviet Union be withheld from the Soviet representatives. The same spring Rajk was arrested in Budapest, and the two cases belonged to the search for "Titoists" in each party after the Cominform resolution on Yugoslavia.

Dimitrov left for the Soviet Union for treatment in April and died on 2 July at Barvikha near Moscow. His body was brought to Sofia and placed in a mausoleum. On 20 July Kolarov became prime minister, and the running of the party fell to the secretary Vulko Chervenkov.

From 7 to 14 December the trial of Kostov and nine co-defendants was held in Sofia. The indictment charged espionage for British intelligence and a conspiracy with Tito to overthrow the government. On the first day Kostov withdrew the confession of the preliminary investigation and denied the charges of espionage and conspiracy, and he held to this position to the end of the trial; in this the trial differed from the Rajk trial in Budapest in September of the same year. He was sentenced to death on 14 December and executed on the 16th. After the execution the government announced that he had left a petition for clemency together with a confession. Western correspondents who attended reported his denial in court; the Soviet and Eastern European press printed the verdict. In April 1956 a plenum of the Central Committee rehabilitated Kostov, and the Supreme Court quashed the verdict the same year. Kolarov died on 23 January 1950, and in February Chervenkov became prime minister.

By the end of 1949 Bulgaria had a Fatherland Front led by the Communist Party, the constitution of 1947, nationalised industry and banks, the treaty with the Soviet Union, and trials inside the party. Of the four forces that had joined the coalition of September 1944, Zveno and the Social Democrats had disappeared and the Agrarian Union remained inside the Front. The Petkov and Kostov trials were reversed in different ways in 1990 and 1956, and the verdicts of the People's Court were quashed in 1996. What followed is set out in the [parent page](/commulingo/events/eastern-europe-peoples-democracies).$t$,
  $$[
    {"date":"1944.09.09","country":"bulgaria","title":{"ko":"조국전선의 정권 장악","en":"The Fatherland Front takes power"},"body":{"ko":"소련의 선전포고(5일)와 국경 통과(8일) 직후 공산당·농민동맹·즈베노·사회민주당의 조국전선이 소피아에서 정권을 잡았다. 즈베노의 키몬 게오르기에프가 총리, 공산당의 안톤 유고프가 내무장관이 되었고, 옛 경찰은 인민민병대로 대체되었다. 무라비에프 정부 각료들은 체포되었다.","en":"Days after the Soviet declaration of war on the 5th and entry on the 8th, the Fatherland Front of Communists, Agrarians, Zveno and Social Democrats took power in Sofia. Kimon Georgiev became prime minister and Anton Yugov interior minister."}},
    {"date":"1944.10.28","country":["bulgaria","soviet"],"title":{"ko":"모스크바 휴전협정","en":"The Moscow armistice"},"body":{"ko":"불가리아는 연합국과 휴전협정을 맺어 대독 참전, 그리스·유고슬라비아 점령지 철수, 배상, 연합국 통제위원회 설치를 받아들였다. 위원장은 톨부힌 원수, 실무는 부위원장 비류조프가 맡았고 미·영 대표는 통보를 받는 자리에 있었다. 불가리아군 45만 명이 유고슬라비아로 나갔다.","en":"Bulgaria signed an armistice with the Allies accepting participation in the war against Germany, withdrawal from Greece and Yugoslavia, reparations and an Allied Control Commission chaired by Tolbukhin and run by his deputy Biryuzov."}},
    {"date":"1945.02.01","country":"bulgaria","title":{"ko":"인민재판소 판결과 처형","en":"The People's Court verdicts and executions"},"body":{"ko":"헌법 밖에 세워진 인민재판소가 섭정 3명, 왕실 고문 8명, 장관 22명, 의원 67명, 장성·고위 장교 47명에게 사형을 선고했고 그날 밤 소피아 중앙교도소에서 집행되었다. 4월까지 전국 135건의 재판에서 11,122명이 기소되어 사형 선고는 2,730건이었다. 실제 집행 수는 확정되지 않았다.","en":"The People's Court sentenced to death the three regents, twenty-two ministers, sixty-seven deputies and forty-seven generals and senior officers, executed that night. By April death sentences across the country numbered 2,730."}},
    {"date":"1945.11.18","country":"bulgaria","title":{"ko":"미뤄진 총선","en":"The postponed general election"},"body":{"ko":"8월 26일 예정이던 총선이 미·영의 항의와 소련의 동의로 연기된 뒤 치러졌다. 여름에 조국전선을 떠난 페트코프의 농민동맹과 룰체프의 사회민주당은 참여를 거부했고, 조국전선 단일 명부가 공식 집계 약 88%를 얻었다. 미국과 영국은 새 정부의 승인을 미뤘다.","en":"Postponed from 26 August after American and British protests, the election was held with Petkov's Agrarians and Lulchev's Social Democrats abstaining; the single Fatherland Front list took about 88 per cent officially."}},
    {"date":"1946.09.08","country":"bulgaria","title":{"ko":"왕정 폐지 국민투표","en":"Referendum on the monarchy"},"body":{"ko":"공식 결과 찬성 95.6%로 왕정이 폐지되었고, 9월 15일 국회가 인민공화국을 선포했다. 아홉 살의 시메온 2세와 왕실은 이튿날 출국했고, 콜라로프가 임시 국가원수가 되었다. 야당도 왕정 폐지에는 반대하지 않았으므로 이 투표는 조국전선과 야당의 대결이 아니었다.","en":"With an official 95.6 per cent the monarchy was abolished, and on 15 September the Assembly proclaimed the People's Republic. Simeon II and the royal family left the next day. The opposition had not opposed abolition."}},
    {"date":"1946.10.27","country":"bulgaria","title":{"ko":"대국민의회 선거","en":"The Grand National Assembly election"},"body":{"ko":"헌법 제정을 위한 선거에서 공식 결과는 공산당 53.9%(465석 중 278석), 조국전선 농민동맹 13.4%(68석), 페트코프와 룰체프의 야당 연합 28.4%(101석)였다. 야당은 100만 표를 넘겼다. 11월 22일 디미트로프가 총리가 되었고, 페트코프는 의회에서 야당의 대표 발언자가 되었다.","en":"The Communists took 53.9 per cent (278 of 465 seats), the Front Agrarians 13.4 and the joint opposition of Petkov and Lulchev 28.4 per cent (101 seats). On 22 November Dimitrov became prime minister."}},
    {"date":"1947.08.01","country":["bulgaria","yugoslavia"],"title":{"ko":"블레드 협정","en":"The Bled agreement"},"body":{"ko":"디미트로프와 티토가 관세동맹, 비자 폐지, 피린·바르다르 마케도니아 통합 준비, 서부 변경 지역 반환을 담은 협정에 서명했다. 11월 27일 에브크시노그라드 우호조약이 뒤따랐고, 피린 지방에 마케도니아어 교사가 들어왔다. 1948년 1월 프라우다가 연방 구상을 부인했다.","en":"Dimitrov and Tito signed an agreement for a customs union, the end of visas and preparation for uniting Pirin and Vardar Macedonia. The Evksinograd treaty followed in November, and a rebuke in Moscow in February 1948."}},
    {"date":"1947.09.23","country":"bulgaria","title":{"ko":"페트코프 처형","en":"Petkov is executed"},"body":{"ko":"6월 5일 면책특권 박탈 뒤 국회에서 체포된 페트코프가 8월 5~16일 재판에서 군 장교들과의 쿠데타 음모 혐의로 사형을 선고받고, 평화조약 발효(9월 15일) 여드레 뒤 소피아 중앙교도소에서 교수형에 처해졌다. 그의 농민동맹은 8월 26일 해산되었다. 1990년 대법원이 무죄를 선고했다.","en":"Arrested in parliament on 5 June, Petkov was sentenced to death in August for plotting a military coup and hanged eight days after the peace treaty came into force on 15 September. His Agrarian Union had been dissolved on 26 August."}},
    {"date":"1947.12.04","country":"bulgaria","title":{"ko":"디미트로프 헌법","en":"The Dimitrov constitution"},"body":{"ko":"대국민의회가 소련 법학자들의 참여 아래 1936년 소련 헌법을 본뜬 새 헌법을 채택했다. 23일 공업·광업 국유화법으로 대기업 1,997곳과 소기업 4,027곳이, 27일 모든 사영 은행이 국가로 넘어갔다. 1948년 말 공업 생산의 약 85%가 국영 부문에서 나왔다.","en":"The Grand National Assembly adopted a constitution modelled on the Soviet one of 1936. On the 23rd the nationalisation law transferred 6,024 enterprises to the state, and on the 27th all private banks."}},
    {"date":"1948.02.10","country":["soviet","bulgaria","yugoslavia"],"title":{"ko":"모스크바 회동","en":"The Moscow meeting"},"body":{"ko":"스탈린과 몰로토프가 디미트로프·콜라로프·코스토프의 불가리아 대표단과 카르델·질라스의 유고슬라비아 대표단을 함께 불러 블레드 협정과 부쿠레슈티 발언 등 사전 협의 없는 연방 외교를 질책했다. 디미트로프는 잘못을 인정했고, 6월 코민포름 결의 뒤 불가리아는 유고슬라비아에 등을 돌렸다.","en":"Stalin and Molotov summoned Dimitrov, Kolarov and Kostov together with Kardelj and Djilas of Yugoslavia and rebuked them for federation diplomacy without prior consultation. Dimitrov acknowledged his error."}},
    {"date":"1948.12.19","country":"bulgaria","title":{"ko":"제5차 당대회 보고","en":"The Fifth Congress report"},"body":{"ko":"18~25일 열린 대회에서 디미트로프가 정치 보고를 통해 인민민주주의 정권과 소비에트 정권을 「같은 권력, 곧 프롤레타리아 독재의 두 형태」로 규정했다. 1946년의 「소비에트 공화국이 아닌 인민공화국」과 대비되는 정식이었다. 대회는 당명을 불가리아공산당으로 바꾸고 5개년 계획을 채택했다.","en":"Dimitrov defined the people's democratic and Soviet regimes as \"two forms of the dictatorship of the proletariat\". The congress renamed the party the Bulgarian Communist Party and adopted a five-year plan."}},
    {"date":"1949.12.16","country":"bulgaria","title":{"ko":"코스토프 처형","en":"Kostov is executed"},"body":{"ko":"3월 「민족주의적 편향」으로 해임되고 6월 체포된 전 부총리 코스토프가 12월 7~14일 재판에서 예심 자백을 철회하고 영국 간첩·티토 결탁 혐의를 부인했으나 14일 사형을 선고받아 집행되었다. 디미트로프는 7월에 죽었고 콜라로프가 총리였다. 코스토프는 1956년 복권되었다.","en":"Removed in March and arrested in June, the former deputy prime minister Kostov withdrew his confession at the trial of 7–14 December and denied espionage and conspiracy, but was sentenced to death and executed. He was rehabilitated in 1956."}}
  ]$$::jsonb,
  $$[
    {"lat":42.70,"lng":23.32,"kind":"main","label":{"ko":"소피아","en":"Sofia"}},
    {"lat":42.14,"lng":24.75,"label":{"ko":"플로브디프","en":"Plovdiv"}},
    {"lat":43.21,"lng":27.91,"label":{"ko":"바르나","en":"Varna"}},
    {"lat":46.37,"lng":14.11,"label":{"ko":"블레드","en":"Bled"}},
    {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"}}
  ]$$::jsonb,
  $$[
    "Ivo Banac, ed., The Diary of Georgi Dimitrov, 1933–1949, Yale University Press, 2003",
    "R. J. Crampton, A Concise History of Bulgaria, 2nd ed., Cambridge University Press, 2005",
    "R. J. Crampton, Bulgaria, Oxford University Press, 2007",
    "Vesselin Dimitrov, Stalin's Cold War: Soviet Foreign Policy, Democracy and Communism in Bulgaria, 1941–48, Palgrave Macmillan, 2008",
    "Michael M. Boll, Cold War in the Balkans: American Foreign Policy and the Emergence of Communist Bulgaria, 1943–1947, University Press of Kentucky, 1984",
    "Nissan Oren, Revolution Administered: Agrarianism and Communism in Bulgaria, Johns Hopkins University Press, 1973",
    "Norman Naimark and Leonid Gibianskii, eds., The Establishment of Communist Regimes in Eastern Europe, 1944–1949, Westview Press, 1997",
    "Foreign Relations of the United States, 1945, vol. IV; 1946, vol. VI; 1947, vol. IV (Bulgaria)",
    "The Trial of Traicho Kostov and His Group, Sofia: Press Department, Ministry of Foreign Affairs, 1949",
    "Georgi Dimitrov, Political Report to the Fifth Congress of the Bulgarian Communist Party, 19 December 1948",
    "Hansard, House of Commons, 27 October 1947: M. Petkov (Trial and Execution)"
  ]$$::jsonb,
  '{"parent":"eastern-europe-peoples-democracies"}'::jsonb
);

INSERT INTO commulingo_history_event_people
  (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('bulgaria-1944-1949', 'dimitrov', 0, 'leader',
   '공산당 지도자, 1946년부터 총리', 'Communist leader, prime minister from 1946',
   '1945년 11월 귀국해 1946년 11월 총리가 되었다. 1945~46년에는 불가리아가 소비에트 공화국이 아닌 인민공화국이 될 것이라 말했고, 1947년 티토와 블레드 협정을 맺었으며, 1948년 12월 제5차 당대회에서 인민민주주의를 프롤레타리아 독재의 한 형태로 규정했다. 1949년 7월 바르비하에서 죽었다.',
   'Returning in November 1945, he became prime minister in November 1946. In 1945–46 he said Bulgaria would be a people''s republic rather than a Soviet one, signed the Bled agreement with Tito in 1947, and at the Fifth Congress in December 1948 defined people''s democracy as a form of the dictatorship of the proletariat. He died at Barvikha in July 1949.'),
  ('bulgaria-1944-1949', 'vasil-kolarov', 1, 'leader',
   '임시 국가원수, 1949년 총리', 'Provisional head of state, prime minister in 1949',
   '1946년 공화국 선포 뒤 임시 국가원수를 맡았고 1947년 12월부터 외무장관을 겸했다. 1949년 6월 전원회의에서 코스토프의 「반당 활동」을 보고했고, 디미트로프 사후 7월 총리가 되어 1950년 1월 죽었다.',
   'Provisional head of state after the proclamation of the republic in 1946 and foreign minister from December 1947. At the plenum of June 1949 he reported on Kostov''s "anti-party activity", became prime minister in July after Dimitrov''s death, and died in January 1950.'),
  ('bulgaria-1944-1949', 'stalin', 2, 'leader',
   '소련 지도자', 'Soviet leader',
   '1944년 9월 선전포고를 결정했고, 1946년 9월 불가리아 대표단에게 소비에트 형태를 거치지 않는 길을 말했으며, 1948년 2월 모스크바에서 디미트로프의 연방 외교를 질책했다.',
   'He decided on the declaration of war in September 1944, told the Bulgarian delegation in September 1946 of a road bypassing the Soviet form, and in February 1948 rebuked Dimitrov''s federation diplomacy in Moscow.'),
  ('bulgaria-1944-1949', 'molotov', 3, 'participant',
   '소련 외무장관', 'Soviet foreign minister',
   '1944년 10월 휴전협정과 1945년 12월 모스크바 외무장관 회의에서 불가리아 문제를 다루었고, 1948년 2월 모스크바 회동에 배석했다.',
   'He handled the Bulgarian question at the armistice of October 1944 and the Moscow foreign ministers'' conference of December 1945, and sat in on the Moscow meeting of February 1948.'),
  ('bulgaria-1944-1949', 'fyodor-tolbukhin', 4, 'executor',
   '제3우크라이나 전선군 사령관, 통제위원회 위원장', 'Commander of the Third Ukrainian Front, chairman of the Control Commission',
   '1944년 9월 8일 불가리아 국경을 넘은 군의 사령관이었고, 휴전협정에 따른 연합국 통제위원회의 위원장을 맡았다. 불가리아군은 그의 전선군 아래 유고슬라비아와 헝가리에서 싸웠다.',
   'He commanded the forces that crossed the Bulgarian frontier on 8 September 1944 and chaired the Allied Control Commission under the armistice. The Bulgarian army fought in Yugoslavia and Hungary under his front.'),
  ('bulgaria-1944-1949', 'sergei-biryuzov', 5, 'executor',
   '통제위원회 부위원장', 'Vice-chairman of the Control Commission',
   '1944년부터 1947년까지 톨부힌 아래 부위원장으로 소피아의 통제위원회 실무를 이끌며 정부의 결정에 대한 승인권을 행사했다. 1945년 선거 연기와 1946년 선거 기간의 협의에 소련 측 대표로 나섰다.',
   'As vice-chairman under Tolbukhin he ran the commission in Sofia from 1944 to 1947, exercising approval over government decisions, and represented the Soviet side in the talks over the postponed election of 1945 and the election of 1946.'),
  ('bulgaria-1944-1949', 'josip-broz-tito', 6, 'participant',
   '블레드 협정의 상대', 'The other party to the Bled agreement',
   '1947년 8월 1일 디미트로프와 블레드 협정을, 11월 27일 에브크시노그라드 우호조약을 맺었다. 1948년 6월 코민포름 제명 뒤 불가리아는 그에게 등을 돌렸고, 코스토프 재판의 기소장은 그와의 결탁을 혐의로 들었다.',
   'He signed the Bled agreement with Dimitrov on 1 August 1947 and the Evksinograd treaty on 27 November. After the Cominform expulsion of June 1948 Bulgaria turned against him, and the Kostov indictment charged conspiracy with him.'),
  ('bulgaria-1944-1949', 'edvard-kardelj', 7, 'participant',
   '1948년 2월 모스크바 회동의 유고슬라비아 대표', 'Yugoslav delegate at the Moscow meeting of February 1948',
   '1948년 2월 10일 질라스와 함께 모스크바에서 불가리아 대표단과 나란히 스탈린의 질책을 받았다. 소련 측이 요구한 소련-유고슬라비아 협의 의정서에 서명했다.',
   'On 10 February 1948, with Djilas, he received Stalin''s rebuke in Moscow alongside the Bulgarian delegation, and signed the Soviet-Yugoslav consultation protocol the Soviet side demanded.'),
  ('bulgaria-1944-1949', 'zhdanov', 8, 'participant',
   '코민포름 창립회의 보고자', 'Rapporteur at the founding of the Cominform',
   '1947년 9월 「두 진영」 보고와 1948년 6월 코민포름 결의는 불가리아 공산당이 「자국의 길」 담론을 거두고 유고슬라비아에 등을 돌리는 계기가 되었다.',
   'His "two camps" report of September 1947 and the Cominform resolution of June 1948 were the occasions on which the Bulgarian party dropped its "own road" discourse and turned against Yugoslavia.'),
  ('bulgaria-1944-1949', 'todor-zhivkov', 9, 'participant',
   '소피아 당 조직 책임자', 'Head of the Sofia party organisation',
   '1944년 9월 소피아의 봉기 준비에 참여했고, 1948년부터 소피아 시당 제1서기로 당 조직을 맡았다. 1954년 당 제1서기가 되어 1956년 코스토프 복권을 결정한 전원회의를 이끌었다.',
   'He took part in preparing the rising in Sofia in September 1944 and from 1948 headed the Sofia city party organisation as first secretary. As party first secretary from 1954 he led the plenum that rehabilitated Kostov in 1956.'),
  ('bulgaria-1944-1949', 'james-f-byrnes', 10, 'participant',
   '미국 국무장관', 'United States secretary of state',
   '1945년 8월 불가리아 선거 연기를 요구했고, 12월 모스크바 외무장관 회의에서 야당 인사의 정부 참여를 조건으로 승인을 논의했다.',
   'He pressed for the postponement of the Bulgarian election in August 1945 and at the Moscow foreign ministers'' conference in December discussed recognition on condition that opposition figures joined the government.'),
  ('bulgaria-1944-1949', 'ernest-bevin', 11, 'participant',
   '영국 외무장관', 'British foreign secretary',
   '1947년 페트코프 재판과 처형에 항의했고, 10월 27일 하원 토론에서 정부의 입장을 설명했다.',
   'He protested the trial and execution of Petkov in 1947 and set out the government''s position in the House of Commons debate of 27 October.');

COMMIT;
