-- Romania, 23 August 1944 to February 1948: one child document of the hub
-- event eastern-europe-peoples-democracies (relations.parent), sort_order 128.
--
-- The hub carries the cross-country stages, the concept of people's democracy
-- and the historiography; this entry is the Romanian record alone, from the
-- royal coup to the Workers' Party congress, with the April 1948 constitution
-- and the Pătrășcanu case as the close. Yalta and the percentages agreement
-- are pointed to, not retold.
--
-- Editorial line: dates, actors, official results and later-published counts
-- side by side; evaluative labels attributed to whoever used them; readings
-- set in parallel without adopting one. Timeline entries carry a `country`
-- flag code (romania, plus soviet where the Soviet state is the actor).
--
-- Every person linked here exists in the dictionary. Rădescu, Sănătescu,
-- Tătărescu, Pătrășcanu, Mihalache, Bodnăraș and Susaikov appear in the body
-- only.

BEGIN;

INSERT INTO commulingo_history_events (
  id, sort_order, period_label,
  title_ko, title_en, question_ko, question_en,
  summary_ko, summary_en, outcome_ko, outcome_en,
  body_ko, body_en, timeline, locations, sources, relations
) VALUES (
  'romania-1944-1948', 128, '1944–1948',
  '루마니아: 8월 23일에서 인민공화국까지', 'Romania: From 23 August to the People''s Republic',
  '1944년 8월 23일 국왕이 안토네스쿠를 체포한 뒤 1948년 2월 노동자당이 세워지기까지, 루마니아의 정부는 어떤 순서로 바뀌었고 각 단계를 움직인 것은 누구였는가?',
  'From the king''s arrest of Antonescu on 23 August 1944 to the founding of the Workers'' Party in February 1948, in what order did Romania''s governments change, and who moved each step?',
  $t$1944년 8월 23일 국왕 미하이 1세가 이온 안토네스쿠를 체포하고 연합국 측으로 돌아서면서 루마니아는 전쟁의 반대편에 섰다. 9월 12일 모스크바 휴전협정으로 소련군 사령부가 이끄는 연합국 통제위원회가 들어섰고, 서너테스쿠와 러데스쿠의 연립정부는 공산당이 주도한 민족민주전선의 요구와 부딪혔다. 1945년 2월 말 소련 외무부차관 비신스키가 부쿠레슈티에 와서 정부 교체를 요구했고, 3월 6일 페트루 그로자 정부가 세워져 토지개혁을 공포했다. 국왕은 8월부터 이듬해 1월까지 법령 서명을 거부했으나 모스크바 외무장관 회의 뒤 야당 각료 두 명이 추가되는 선에서 마무리되었다. 1946년 11월 19일 총선의 공식 결과는 정부 블록 69.8%였고, 후대에 공개된 당 내부 문서는 다른 수치를 남겼다. 1947년 평화조약 발효 뒤 국민농민당이 해산되고 마니우가 재판을 받았으며, 12월 30일 국왕이 퇴위해 인민공화국이 선포되었다. 1948년 2월 공산당과 사회민주당이 루마니아노동자당으로 합쳤다.$t$,
  $t$On 23 August 1944 King Michael I arrested Ion Antonescu and took Romania over to the Allies. The Moscow armistice of 12 September installed an Allied Control Commission run by the Soviet command, and the coalition governments of Sănătescu and Rădescu collided with the demands of the communist-led National Democratic Front. In late February 1945 Soviet deputy foreign minister Vyshinsky came to Bucharest to demand a change of government; on 6 March the Groza government took office and decreed land reform. From August to the following January the king refused to sign its decrees, an episode settled after the Moscow foreign ministers'' conference by the addition of two opposition ministers. The election of 19 November 1946 was officially won by the government bloc with 69.8 per cent; party documents published later record different figures. After the peace treaty came into force in 1947 the National Peasant Party was dissolved and Maniu tried, and on 30 December the king abdicated and the People's Republic was proclaimed. In February 1948 the Communist and Social Democratic parties merged as the Romanian Workers' Party.$t$,
  $t$1948년 봄 루마니아에는 노동자당이 이끄는 인민민주전선의 단일 명부 의회, 4월 13일의 인민공화국 헌법, 소련과의 우호조약(2월 4일), 소브롬 합작회사가 자리 잡았다. 국민농민당과 국민자유당은 해산되었고 지도자들은 시게트를 비롯한 감옥에 있었다. 공산당 안에서는 8월 23일의 주역이었던 법무장관 루크레치우 파트라슈카누가 2월 대회에서 비판받고 4월 28일 체포되어 1954년 처형되었다. 소련군은 1958년까지 주둔했다. 이 시기에 세워진 제도의 동유럽 전체 맥락은 상위 문서가 다룬다.$t$,
  $t$By the spring of 1948 Romania had a single-list parliament of the People's Democratic Front led by the Workers' Party, the People's Republic constitution of 13 April, a treaty of friendship with the Soviet Union (4 February) and the SovRom joint companies. The National Peasant and National Liberal parties had been dissolved and their leaders were in Sighet and other prisons. Inside the Communist Party, Lucrețiu Pătrășcanu, the justice minister who had been one of the men of 23 August, was criticised at the February congress, arrested on 28 April and executed in 1954. Soviet troops remained until 1958. The parent page sets these institutions in their Eastern European context.$t$,
  $t$## 8월 23일: 국왕의 쿠데타와 휴전

1944년 여름 루마니아군은 소련군의 야시-키시너우 공세 앞에서 무너지고 있었다. 8월 20일 시작된 공세는 사흘 만에 루마니아 제3군과 제4군의 전선을 뚫었다. 8월 23일 오후 국왕 미하이 1세는 왕궁으로 부른 이온 안토네스쿠 원수에게 즉시 휴전을 요구했고, 안토네스쿠가 거부하자 근위대에 체포를 명령했다. 그날 밤 국왕은 라디오로 연합국과의 휴전 수락과 대독 전쟁을 선언했다. 쿠데타는 국왕과 궁정, 국민농민당의 율리우 마니우와 국민자유당의 디누 브러티아누, 사회민주당의 티텔 페트레스쿠, 공산당의 루크레치우 파트라슈카누와 에밀 보드너라시가 함께 준비한 것이었다. 국왕이 읽은 선언문의 초안은 파트라슈카누가 썼고, 체포된 안토네스쿠는 공산당 측에 넘겨져 9월 1일 소련군에 인도되었다.

쿠데타에 앞선 협상도 있었다. 1944년 봄 마니우의 밀사 바르부 슈티르베이가 카이로에서 연합국과 접촉했고, 4월 12일 소련은 국경 인정과 배상, 대독 참전을 골자로 하는 휴전 조건을 제시했다. 국왕과 정당들은 이 조건을 받아들일지 여름 내내 미루다가 전선이 무너지자 행동했다. 소련군은 8월 23일 뒤에도 며칠 동안 루마니아군 부대를 무장해제해 약 13만 명을 포로로 삼았고, 휴전협정 서명 전까지 루마니아를 교전국으로 다루었다.

새 정부는 콘스탄틴 서너테스쿠 장군이 이끌었고, 네 정당(국민농민당, 국민자유당, 사회민주당, 공산당)이 각각 무임소 장관 한 명씩을 냈다. 독일군은 8월 24일 부쿠레슈티를 폭격했으나 루마니아군에 밀려났고, 소련군은 8월 31일 부쿠레슈티에 들어왔다. 휴전협정은 9월 12일 모스크바에서 서명되었다. 루마니아는 3억 달러의 배상을 6년에 걸쳐 물자로 지불하고, 1940년 소련에 넘긴 베사라비아와 북부코비나의 국경을 인정하며, 북트란실바니아는 「평화조약에서 확인될 것을 조건으로」 루마니아에 돌려주기로 했다. 연합국 통제위원회는 소련군 최고사령부의 지도 아래 협정 이행을 감독하기로 했고, 위원장은 명목상 로디온 말리놉스키 원수였으나 실무는 블라디슬라프 비노그라도프 중장이, 1945년부터는 이반 수사이코프 상장이 맡았다. 미국과 영국의 대표는 통보를 받는 자리에 있었다. 1944년 10월 9일 모스크바에서 처칠과 스탈린이 나눈 백분율 협정에서 루마니아는 소련 90 대 영국 10으로 적혔다. 협정의 내용과 성격은 상위 문서와 [얄타·포츠담 회담](/commulingo/events/yalta-potsdam) 항목이 다룬다.

## 두 번의 서너테스쿠 정부와 러데스쿠 정부

공산당은 1944년 8월 당원이 1천 명 안팎이었고, 1945년 10월 전국협의회 때는 25만 명을 넘었다고 당은 발표했다. 소련에서 루마니아 포로로 편성된 투도르 블라디미레스쿠 사단이 8월 말 소련군과 함께 귀국해 정치 교육을 받은 병력의 저수지가 되었다. 당 지도부는 세 갈래였다. 감옥에서 나온 게오르게 게오르기우데지, 모스크바에서 돌아온 아나 파우커와 바실레 루카, 국내 지하에 있던 파트라슈카누와 보드너라시였다. 농민전선은 1933년 데바에서 페트루 그로자가 세운 트란실바니아 농민 조직으로, 1935년부터 공산당과 협력해 왔다. 10월 12일 공산당은 사회민주당, 농민전선, 애국동맹, 노동조합과 함께 민족민주전선을 결성하고 정부 안에서 더 많은 자리를 요구했다. 11월 4일 서너테스쿠의 두 번째 정부가 세워져 각 정당이 부처를 나눠 맡았고, 공산당은 법무부(파트라슈카누)와 교통부(게오르기우데지)를 얻었다. 민족민주전선은 내무부와 국방부를 요구했고, 국민농민당과 국민자유당은 서너테스쿠가 공산당에 지나치게 양보한다고 보았다. 12월 초 서너테스쿠가 물러나고 니콜라에 러데스쿠 장군이 정부를 맡았다. 내무부는 러데스쿠 자신이 겸했고, 공산당의 테오하리 제오르제스쿠가 차관으로 들어갔다. 서너테스쿠는 일기에 소련 측이 「정부의 구성을 자기들이 정하려 한다」고 적었고, 공산당 측 문서는 두 정부를 「반동의 잔재를 보호하는 정부」로 규정했다. 같은 사건을 두고 남은 두 기록이다.

같은 시기 북트란실바니아에서는 소련군이 루마니아 행정을 물리치고 11월 12일 직접 군정을 세웠다. 소련 측은 루마니아 헌병의 헝가리인 학대를 이유로 들었다. 이 지역을 언제 누구에게 돌려주느냐는 이후 몇 달 동안 부쿠레슈티 정치의 지렛대가 되었다. 1945년 1월 소련 당국은 루마니아 국적 독일계 주민 약 7만 명을 소련 노동에 징발했고, 러데스쿠 정부는 이에 항의했으나 막지 못했다.

## 1945년 2월과 3월: 비신스키와 그로자 정부

1945년 2월 민족민주전선은 전국에서 정부 교체를 요구하는 집회를 열었고, 지방에서는 농민들이 대토지를 점거했다. 2월 24일 부쿠레슈티 왕궁 광장의 집회에서 총격이 일어나 여러 명이 죽었다. 발포의 주체를 두고 정부와 민족민주전선은 서로를 지목했다. 러데스쿠는 그날 밤 라디오 연설에서 파우커와 루카를 「하이에나」, 「핏줄도 신도 없는 외국인」이라 불렀다. 소련 측 언론과 통제위원회는 러데스쿠를 파시스트 테러의 책임자로 규정했다.

2월 27일 소련 외무부차관 안드레이 비신스키가 부쿠레슈티에 도착해 국왕을 만났다. 다음 날 그는 러데스쿠 정부의 해임을 요구하며 두 시간의 시한을 통보했고, 국왕의 집무실 문을 세게 닫고 나갔다는 회고가 남아 있다. 국왕 측이 국민농민당의 바르부 슈티르베이를 총리로 내세우려 하자 비신스키는 거부하고 그로자를 지명했다. 소련은 그로자 정부가 서면 조건이라고 국왕에게 전했다. 북트란실바니아는 「민주 정부」가 들어서면 루마니아에 돌려준다는 것이었다. 3월 6일 페트루 그로자를 총리로 하는 정부가 세워졌다. 그로자는 농민전선의 지도자였고 공산당원이 아니었다. 정부에는 국민자유당에서 갈라져 나온 게오르게 터터레스쿠 파가 외무부를 맡았고, 공산당은 내무부(제오르제스쿠), 법무부(파트라슈카누), 교통부, 국방부 차관(보드너라시)을 얻었다. 마니우와 브러티아누의 두 당은 참여를 거부했다. 3월 9일 스탈린은 북트란실바니아의 루마니아 행정 복귀를 허가했다.

3월 23일 정부는 법률 187호로 토지개혁을 공포했다. 50헥타르를 넘는 토지와 전범·부재 지주·독일계 주민의 토지가 몰수되어 약 80만 가구에 분배되었고, 대상 토지는 100만 헥타르를 넘었다. 이 개혁은 국민농민당의 1921년 개혁 이후 남아 있던 대토지를 겨냥했고, 마니우의 당도 원칙에서 반대하지 않았다. 4월 그로자 정부는 인민재판소를 세워 전범 재판을 시작했고, 안토네스쿠는 1946년 5월 재판을 받아 6월 1일 처형되었다. 5월 8일 모스크바에서 소련과 루마니아는 합작기업 협정을 맺었고, 7월 17일 첫 소브롬 회사인 소브롬페트롤이 세워져 프라호바의 석유 채굴과 정유를 맡았다. 10월 16일부터 21일까지 열린 공산당 전국협의회는 게오르기우데지를 서기장으로 선출하고, 당의 노선을 「민주적 통일전선의 강화」로 정했다.

## 국왕의 서명 거부와 모스크바 회의

포츠담 회담에서 미국과 영국은 루마니아 정부를 승인하지 않겠다는 입장을 정했다. 8월 21일 국왕은 그로자에게 사임을 요구했고, 그로자가 거부하자 정부 법령에 서명하지 않기 시작했다. 이 「국왕의 파업」은 1946년 1월 7일까지 이어졌다. 정부는 국왕 서명 없이 법령을 공포했고, 11월 8일 국왕의 명명일에 왕궁 광장에 모인 지지 군중과 정부 지지자들이 충돌해 사망자가 났다. 미국 대표 버튼 베리와 영국 대표 이언 르 루지텔은 그로자 정부 승인을 거부했으나, 소련 측은 이 정부가 「광범한 민주 세력의 대표」라고 답했다.

12월 16일부터 26일까지 모스크바에서 열린 미·영·소 외무장관 회의는 루마니아에 대해 타협안을 냈다. 그로자 정부에 국민농민당과 국민자유당에서 한 명씩 각료를 추가하고, 정부가 자유선거와 언론 자유를 보장하면 미국과 영국이 승인한다는 것이었다. 세 나라 대사 위원회가 부쿠레슈티에 파견되었고, 1946년 1월 7일 국민농민당의 에밀 하치에가누와 국민자유당의 미하일 롬니체아누가 무임소 장관으로 들어갔다. 미국과 영국은 2월 5일 정부를 승인했다. 국왕은 서명 거부를 접었다. 두 각료는 부처 없이 각의에 앉았고, 이후의 선거 준비에서 실질적인 발언권은 갖지 못했다. 하치에가누는 1946년 봄 선거법 심의에서 야당 감시원의 개표 참관을 요구했으나 받아들여지지 않았고, 두 사람은 선거 뒤 정부를 떠났다. 이 결과를 두고 마니우는 서방이 루마니아를 포기했다고 보았고, 미국 국무부 문서는 소련이 이미 장악한 나라에서 얻을 수 있는 최대치였다고 적었다.

## 1946년 11월 19일: 두 개의 집계

총선은 여러 차례 미뤄져 1946년 11월 19일에 치러졌다. 선거법은 상원을 없애고 여성 참정권을 도입했다. 사회민주당은 3월 10일 대회에서 공산당과의 공동 명부를 가결했고, 반대한 총재 티텔 페트레스쿠는 당을 떠나 5월 독립사회민주당을 세웠다. 정부 측은 공산당, 사회민주당, 농민전선, 터터레스쿠의 국민자유당, 국민인민당, 애국동맹이 민주정당블록으로 단일 명부를 냈다. 국민농민당과 브러티아누의 국민자유당은 각자 명부를 냈다. 선거 기간 야당의 집회는 방해받았고 후보와 운동원이 체포되었으며, 야당 신문의 발행이 막혔다. 미국과 영국은 선거 전후로 항의 각서를 보냈다.

투표일에는 유권자 약 690만 명이 등록되어 있었고, 개표는 내무부가 임명한 위원회가 맡았다. 11월 21일 발표된 공식 결과는 민주정당블록 69.8%(347석), 국민농민당 12.9%(33석), 국민자유당 3.8%(3석), 헝가리인민연합 8.3%였다. 야당은 즉시 결과를 부정하고 의회 등원을 거부했다. 후대의 연구는 다른 수치를 남겼다. 역사가 페트레 추를레아는 공산당 내부의 비밀 보고서를 분석해 블록의 실제 득표가 45~47%였다고 결론지었고, 국민농민당이 다수였다는 주장과 야당이 80%를 얻었다는 당시 야당의 주장은 근거가 다르다. 2006년 대통령 위원회의 최종 보고서는 이 선거를 조작된 선거로 기록했다. 어느 집계를 취하든, 공식 결과는 정부 블록에 의회의 5분의 4를 주었고, 그 의회가 이후 1년 동안의 법률을 통과시켰다.

## 1947년: 평화조약, 터머더우, 마니우 재판

1947년 2월 10일 파리에서 평화조약이 서명되었다. 루마니아는 북트란실바니아를 되찾고 베사라비아·북부코비나·남도브루자를 잃었으며, 배상 3억 달러가 확정되었다. 조약은 9월 15일 발효했고, 그날 연합국 통제위원회는 해산했다. 소련군은 오스트리아 점령군과의 연락선 유지를 명분으로 계속 주둔했다. 통제위원회의 해산은 미국과 영국이 루마니아 내정에 개입할 마지막 제도적 통로가 사라졌음을 뜻했다.

7월 14일 부쿠레슈티 근교 터머더우 비행장에서 국민농민당 부총재 이온 미할라케와 니콜라에 페네스쿠, 일리에 라자르, 니콜라에 카란디노 등이 국외로 나가려다 체포되었다. 비행기는 내무부가 미리 알고 있던 것이었다. 7월 19일 의회는 국민농민당 의원들의 면책특권을 박탈했고, 7월 30일 제오르제스쿠 내무장관의 보고에 따라 당이 해산되었다. 마니우는 7월 22일 체포되었다. 재판은 10월 29일부터 11월 11일까지 부쿠레슈티 군사법원에서 열렸고, 마니우와 미할라케는 반역 혐의로 종신 중노동형을 받았다. 마니우는 1953년 2월 5일 시게트 감옥에서 사망했다. 검찰은 이들이 미국·영국 공관과 연결된 반역자라고 했고, 마니우는 법정에서 자신의 행동이 합법적 정치 활동이었다고 답했다. 재판 기록은 1990년 이후 공개되었다.

1946년과 1947년 몰도바의 가뭄으로 기근이 들어 정부는 소련의 곡물 원조를 받았고, 1947년 8월 15일 화폐개혁으로 옛 레우가 2만 대 1로 교환되면서 도시 중산층의 저축이 사라졌다. 정부는 이를 투기 세력에 대한 조치로, 야당은 몰수로 불렀다. 11월 초 터터레스쿠의 국민자유당 파가 정부에서 밀려났고, 브러티아누의 국민자유당은 11월 1일 활동을 중단했다. 11월 6일 의회는 외무장관 터터레스쿠에 대한 불신임안을 통과시켰고, 11월 7일 아나 파우커가 외무장관이 되었다. 바실레 루카는 재무장관, 에밀 보드너라시는 12월 23일 국방장관이 되었다. 이로써 정부의 주요 부처는 모두 공산당 손에 있었다.

## 12월 30일: 퇴위와 공화국

11월 국왕은 런던에서 열린 엘리자베스 공주의 결혼식에 참석했고, 그곳에서 부르봉파르마의 안나와 약혼했다. 12월 21일 귀국한 국왕은 시나이아의 펠레슈 성에 머물렀다. 12월 30일 아침 그로자는 국왕을 부쿠레슈티로 불렀다. 엘리사베타 궁에 도착한 국왕은 투도르 블라디미레스쿠 사단 병력이 궁을 둘러싼 것을 보았고, 그로자와 게오르기우데지가 미리 작성한 퇴위 문서를 내밀었다. 국왕의 회고에 따르면 전화선이 끊겨 있었고, 서명하지 않으면 구금된 학생 1천여 명이 처형될 것이라는 말을 들었다. 그로자는 훗날 자기 주머니의 권총을 보이며 「나도 준비를 했다」고 농담했다고 전한다. 국왕은 정오가 조금 지나 서명했다. 같은 날 오후 의회는 법률 363호로 군주제 폐지와 루마니아인민공화국 수립을 의결했다. 국왕은 1948년 1월 3일 열차로 루마니아를 떠났고, 3월 런던에서 퇴위가 강요된 것이므로 무효라고 선언했다.

미국과 영국은 1948년 1월 각서로 퇴위가 강요된 것이라는 견해를 밝혔으나 새 정부와의 외교관계는 유지했다. 소련은 1월 초 인민공화국을 승인했다.

퇴위의 성격을 두고 설명은 갈린다. 정부는 국왕이 「자발적으로」 퇴위했다고 발표했고, 국왕과 측근은 무력 아래의 강요였다고 했다. 1990년대 이후 루마니아 역사 서술은 대체로 후자를 따르며, 2006년 대통령 위원회 보고서도 그렇게 기록했다. 다른 한편 그로자 정부 측 문서는 군주제가 1946년 선거 이후 이미 실권을 잃었고 퇴위는 그 사실의 확인이었다고 적었다.

## 1948년 2월: 노동자당, 그리고 확정된 것

1948년 2월 4일 모스크바에서 루마니아와 소련은 우호협력상호원조조약을 맺었다. 2월 21일부터 23일까지 부쿠레슈티에서 공산당과 사회민주당(페트레스쿠 파가 떠난 뒤 남은 조직)의 통합대회가 열려 루마니아노동자당이 세워졌다. 게오르기우데지가 서기장, 파우커·루카·제오르제스쿠가 서기국을 이루었다. 대회에서 파트라슈카누는 「민족주의적 편향」으로 비판받고 중앙위원회에 들지 못했으며, 2월 23일 법무장관에서 물러나 4월 28일 체포되었다. 그는 1954년 4월 재판을 받고 17일 질라바에서 처형되었고, 1968년 복권되었다. 통합대회는 「인민민주주의」를 프롤레타리아 독재로 가는 길로 규정하는 상위 문서의 1948년 말 정식을 루마니아에서 앞당겨 채택한 셈이었다.

3월 28일 인민민주전선의 단일 명부 선거가 치러져 공식 결과 93.2%를 얻었고, 4월 13일 대국민의회는 루마니아인민공화국 헌법을 채택했다. 6월 11일 공업·은행·보험·광산·운수 기업이 국유화되었고, 8월 30일 내무부 산하에 국가보안총국(세쿠리타테)이 세워졌다. 그 초대 국장 게오르게 핀틸리에는 소련 정보기관 출신이었고, 소련 고문단이 함께 배치되었다. 소브롬은 석유에 이어 운수(소브롬트란스포르트), 은행(소브롬방크), 목재, 화학으로 늘어나 1947년까지 열 곳을 넘었고, 2월 4일 조약은 독일 또는 독일과 연합한 국가의 공격에 대한 상호 원조를 규정했다. 1948년 봄의 루마니아에는 노동자당이 이끄는 단일 명부 의회, 헌법, 소련과의 조약, 소브롬 합작회사, 소련 고문단이 있는 군과 보안기관이 있었다. 1944년 8월 23일 함께 왕궁에 있던 사람들 가운데 마니우는 감옥에, 파트라슈카누는 구금 중에, 국왕은 국외에 있었다. 이 순서가 동유럽의 다른 나라와 어디서 같고 어디서 달랐는지는 [상위 문서](/commulingo/events/eastern-europe-peoples-democracies)가 다룬다.$t$,
  $t$## 23 August: The King's Coup and the Armistice

In the summer of 1944 the Romanian army was collapsing before the Soviet Iași-Chișinău offensive, which opened on 20 August and broke the fronts of the Romanian Third and Fourth Armies within three days. On the afternoon of 23 August King Michael I summoned Marshal Ion Antonescu to the palace and demanded an immediate armistice; when Antonescu refused, the king ordered the palace guard to arrest him. That night the king announced on the radio that Romania accepted an armistice with the Allies and was at war with Germany. The coup had been prepared jointly by the king and his court, Iuliu Maniu of the National Peasant Party, Dinu Brătianu of the National Liberals, Titel Petrescu of the Social Democrats, and Lucrețiu Pătrășcanu and Emil Bodnăraș of the Communists. Pătrășcanu drafted the proclamation the king read; the arrested Antonescu was handed to the Communists and delivered to the Soviet army on 1 September.

Negotiation had preceded the coup. In the spring of 1944 Maniu's emissary Barbu Știrbei had made contact with the Allies in Cairo, and on 12 April the Soviet Union had set out armistice terms: recognition of the frontier, reparations and war against Germany. The king and the parties put off accepting them through the summer and acted when the front collapsed. For several days after 23 August the Soviet army went on disarming Romanian units and took some 130,000 prisoners, treating Romania as a belligerent until the armistice was signed.

The new government was led by General Constantin Sănătescu, with each of the four parties (National Peasants, National Liberals, Social Democrats, Communists) providing one minister without portfolio. German aircraft bombed Bucharest on 24 August but German forces were driven off by the Romanian army, and Soviet troops entered Bucharest on 31 August. The armistice was signed in Moscow on 12 September. Romania was to pay 300 million dollars in reparations in goods over six years, to accept the frontier that had given Bessarabia and northern Bukovina to the Soviet Union in 1940, and to receive northern Transylvania back "subject to confirmation in the peace settlement". An Allied Control Commission was to supervise the armistice under the direction of the Soviet High Command; its nominal chairman was Marshal Rodion Malinovsky, but the work was done by Lieutenant General Vladislav Vinogradov and, from 1945, Colonel General Ivan Susaikov. The American and British representatives were there to be informed. In the percentages agreement exchanged by Churchill and Stalin in Moscow on 9 October 1944, Romania was written as 90 Soviet to 10 British; the agreement itself is covered in the parent page and in the [Yalta and Potsdam](/commulingo/events/yalta-potsdam) entry.

## The Two Sănătescu Governments and the Rădescu Government

In August 1944 the Communist Party had around a thousand members; by its national conference of October 1945 it claimed more than 250,000. The Tudor Vladimirescu Division, formed in the Soviet Union from Romanian prisoners of war, returned with the Soviet army at the end of August and became a reservoir of politically trained troops. Its leadership came in three strands: Gheorghe Gheorghiu-Dej, released from prison; Ana Pauker and Vasile Luca, returned from Moscow; and Pătrășcanu and Bodnăraș from the underground at home. The Ploughmen's Front was a Transylvanian peasant organisation founded by Petru Groza at Deva in 1933, which had cooperated with the Communists since 1935. On 12 October the party formed the National Democratic Front with the Social Democrats, the Ploughmen's Front, the Patriotic Union and the trade unions, and demanded more places in government. On 4 November Sănătescu's second government was formed with the parties dividing the ministries; the Communists received Justice (Pătrășcanu) and Communications (Gheorghiu-Dej). The Front demanded the Interior and War ministries, and the National Peasants and Liberals judged that Sănătescu was conceding too much to the Communists. In early December Sănătescu resigned and General Nicolae Rădescu took the government, keeping the Interior Ministry himself with the Communist Teohari Georgescu as under-secretary. Sănătescu wrote in his diary that the Soviet side "means to decide the composition of the government itself", while the Communist Party's papers described both governments as "protecting the remnants of reaction": two records of the same events.

In the same weeks the Soviet army removed the Romanian administration from northern Transylvania and installed direct military government there on 12 November, citing the treatment of Hungarians by Romanian gendarmes. When and to whom the region would be returned became the lever of Bucharest politics for the following months. In January 1945 the Soviet authorities conscripted some 70,000 Romanian citizens of German origin for labour in the Soviet Union; the Rădescu government protested but could not prevent it.

## February and March 1945: Vyshinsky and the Groza Government

In February 1945 the National Democratic Front held rallies across the country demanding a change of government, while in the provinces peasants occupied the large estates. At a rally in Palace Square in Bucharest on 24 February shots were fired and several people were killed; the government and the Front each blamed the other. That night Rădescu, in a radio address, called Pauker and Luca "hyenas" and "foreigners without kin or God". The Soviet press and the Control Commission described Rădescu as responsible for fascist terror.

On 27 February Soviet deputy foreign minister Andrei Vyshinsky arrived in Bucharest and saw the king. The next day he demanded the dismissal of the Rădescu government and gave a two-hour deadline; the recollection that he slammed the door of the king's study on leaving has entered the record. When the king's side proposed Barbu Știrbei of the National Peasants as prime minister, Vyshinsky refused and named Groza. The Soviet side told the king that a Groza government was the written condition on which northern Transylvania would be returned to a "democratic government". On 6 March a government with Petru Groza as prime minister took office. Groza led the Ploughmen's Front and was not a party member. The Tătărescu wing that had split from the National Liberals took the foreign ministry; the Communists received Interior (Georgescu), Justice (Pătrășcanu), Communications and the under-secretaryship of War (Bodnăraș). The parties of Maniu and Brătianu refused to take part. On 9 March Stalin authorised the return of Romanian administration to northern Transylvania.

On 23 March the government decreed land reform by Law 187. Holdings above fifty hectares and the land of war criminals, absentee landlords and citizens of German origin were confiscated and distributed to some 800,000 households; the land involved exceeded a million hectares. The reform targeted the large estates that had survived the National Peasants' reform of 1921, and Maniu's party did not oppose it in principle. In April the Groza government set up people's tribunals for war crimes; Antonescu was tried in May 1946 and executed on 1 June. On 8 May in Moscow the Soviet Union and Romania signed an agreement on joint companies, and on 17 July the first SovRom, Sovrompetrol, was set up to run oil extraction and refining in Prahova. The party's national conference of 16 to 21 October elected Gheorghiu-Dej general secretary and set its line as "strengthening the democratic united front".

## The King's Refusal to Sign and the Moscow Conference

At Potsdam the United States and Britain decided not to recognise the Romanian government. On 21 August the king asked Groza to resign, and when Groza refused he stopped signing government decrees. This "royal strike" lasted until 7 January 1946. The government promulgated its decrees without the royal signature, and on 8 November, the king's name day, a crowd of his supporters in Palace Square clashed with government supporters and there were deaths. The American representative Burton Berry and the British representative Ian Le Rougetel refused recognition, while the Soviet side answered that the government represented "the broad democratic forces".

The conference of the American, British and Soviet foreign ministers in Moscow from 16 to 26 December produced a compromise on Romania: one minister each from the National Peasant and National Liberal parties would be added to the Groza government, and once the government guaranteed free elections and freedom of the press, the United States and Britain would recognise it. A commission of the three ambassadors went to Bucharest, and on 7 January 1946 Emil Hațieganu of the National Peasants and Mihail Romniceanu of the National Liberals entered the government as ministers without portfolio. The United States and Britain recognised the government on 5 February. The king ended his refusal. The two ministers sat in cabinet without departments and had no effective voice in the preparation of the election that followed. In the spring of 1946 Hațieganu asked during the drafting of the electoral law that opposition scrutineers be admitted to the count, and was refused; both men left the government after the election. Maniu read the outcome as the West abandoning Romania; the American State Department papers record it as the most that could be obtained in a country the Soviet Union already held.

## 19 November 1946: Two Counts

The general election, postponed several times, was held on 19 November 1946. The electoral law abolished the Senate and introduced women's suffrage. At its congress of 10 March the Social Democratic Party voted for a joint list with the Communists; its president Titel Petrescu, who had opposed the decision, left and founded the Independent Social Democratic Party in May. The government side, the Communists, the Social Democrats, the Ploughmen's Front, Tătărescu's National Liberals, the National People's Party and the Patriotic Union, ran a single list as the Bloc of Democratic Parties. The National Peasants and Brătianu's National Liberals ran their own lists. During the campaign opposition meetings were obstructed, candidates and organisers arrested and opposition newspapers stopped. The United States and Britain sent notes of protest before and after the vote.

Some 6.9 million voters were registered, and the count was in the hands of commissions appointed by the Interior Ministry. The official result, announced on 21 November, gave the Bloc 69.8 per cent and 347 seats, the National Peasants 12.9 per cent and 33 seats, the National Liberals 3.8 per cent and 3 seats, and the Hungarian People's Union 8.3 per cent. The opposition rejected the result at once and refused to take its seats. Later research left different figures. The historian Petre Țurlea, analysing a confidential internal report of the Communist Party, concluded that the Bloc had in fact received between 45 and 47 per cent; the claim that the National Peasants held a majority and the opposition's contemporary claim of 80 per cent rest on different evidence. The final report of the Presidential Commission of 2006 recorded the election as falsified. Whichever count is taken, the official result gave the government bloc four fifths of the chamber, and that chamber passed the laws of the following year.

## 1947: The Peace Treaty, Tămădău and the Maniu Trial

The peace treaty was signed in Paris on 10 February 1947. Romania recovered northern Transylvania and lost Bessarabia, northern Bukovina and southern Dobruja, and reparations were fixed at 300 million dollars. The treaty came into force on 15 September, and the Allied Control Commission was dissolved that day. Soviet troops stayed on, citing the maintenance of lines of communication with the occupation forces in Austria. The dissolution of the commission removed the last institutional channel through which the United States and Britain could intervene in Romanian domestic affairs.

On 14 July, at Tămădău airfield near Bucharest, the National Peasant vice-president Ion Mihalache, Nicolae Penescu, Ilie Lazăr, Nicolae Carandino and others were arrested while attempting to leave the country; the Interior Ministry had known of the aircraft in advance. On 19 July the chamber stripped the National Peasant deputies of their immunity, and on 30 July the party was dissolved on the report of Interior Minister Georgescu. Maniu was arrested on 22 July. The trial ran from 29 October to 11 November before a military court in Bucharest, and Maniu and Mihalache were sentenced to hard labour for life for treason. Maniu died in Sighet prison on 5 February 1953. The prosecution called the accused traitors linked to the American and British legations; Maniu answered in court that his actions had been lawful political activity. The trial record was published after 1990.

Drought in Moldavia in 1946 and 1947 brought famine, and the government took Soviet grain aid; the currency reform of 15 August 1947 exchanged old lei at 20,000 to one and wiped out the savings of the urban middle class, a measure the government called a blow against speculators and the opposition called confiscation. In early November Tătărescu's National Liberal wing was pushed out of the government, and Brătianu's National Liberals had ceased activity on 1 November. On 6 November the chamber passed a motion of no confidence in Tătărescu as foreign minister, and on 7 November Ana Pauker took the ministry. Vasile Luca became finance minister and Emil Bodnăraș minister of war on 23 December. Every major ministry was now in Communist hands.

## 30 December: Abdication and Republic

In November the king attended the wedding of Princess Elizabeth in London, where he became engaged to Anne of Bourbon-Parma. He returned on 21 December and stayed at Peleș Castle in Sinaia. On the morning of 30 December Groza summoned him to Bucharest. Arriving at the Elisabeta Palace, the king found it surrounded by troops of the Tudor Vladimirescu Division, and Groza and Gheorghiu-Dej presented him with a pre-typed instrument of abdication. By the king's account the telephone lines had been cut and he was told that a thousand detained students would be shot if he did not sign; Groza is said to have joked afterwards, showing the pistol in his pocket, that he too had come prepared. The king signed shortly after noon. That afternoon the chamber passed Law 363 abolishing the monarchy and establishing the Romanian People's Republic. The king left Romania by train on 3 January 1948, and in March in London declared the abdication void as extracted under duress.

The United States and Britain stated in notes of January 1948 that the abdication had been extracted under duress, but kept relations with the new government; the Soviet Union recognised the People's Republic in early January.

Accounts of the abdication diverge. The government announced that the king had abdicated "of his own will"; the king and his circle said it was coercion under arms. Romanian historiography since the 1990s largely follows the latter, as did the Presidential Commission report of 2006. On the other side, the Groza government's papers recorded that the monarchy had lost real power after the 1946 election and that the abdication confirmed that fact.

## February 1948: The Workers' Party, and What Was Fixed

On 4 February 1948 Romania and the Soviet Union signed a treaty of friendship, cooperation and mutual assistance in Moscow. From 21 to 23 February the unification congress of the Communist Party and the Social Democrats (the organisation that remained after Petrescu's wing had left) met in Bucharest and founded the Romanian Workers' Party. Gheorghiu-Dej became general secretary, with Pauker, Luca and Georgescu in the secretariat. At the congress Pătrășcanu was criticised for "nationalist deviation" and was not elected to the Central Committee; he left the Justice Ministry on 23 February and was arrested on 28 April. He was tried in April 1954, executed at Jilava on the 17th, and rehabilitated in 1968. The unification congress had, in effect, adopted in Romania ahead of time the formula of late 1948, set out in the parent page, that defined people's democracy as a road to the dictatorship of the proletariat.

On 28 March a single-list election of the People's Democratic Front returned an official 93.2 per cent, and on 13 April the Grand National Assembly adopted the constitution of the Romanian People's Republic. On 11 June industrial, banking, insurance, mining and transport enterprises were nationalised, and on 30 August the General Directorate of State Security, the Securitate, was set up under the Interior Ministry; its first director, Gheorghe Pintilie, came from Soviet intelligence, and Soviet advisers were attached to it. The SovRoms had grown from oil to transport (Sovromtransport), banking (Sovrombanc), timber and chemicals, more than ten by 1947, and the treaty of 4 February provided for mutual assistance against an attack by Germany or a state allied with it. Romania in the spring of 1948 had a single-list parliament led by the Workers' Party, a constitution, a treaty with the Soviet Union, the SovRom companies, and an army and security service with Soviet advisers. Of the men who had been in the palace together on 23 August 1944, Maniu was in prison, Pătrășcanu in detention and the king abroad. Where this sequence matched the other countries of Eastern Europe and where it differed is the subject of the [parent page](/commulingo/events/eastern-europe-peoples-democracies).$t$,
  $$[
    {"date":"1944.08.23","country":"romania","title":{"ko":"국왕의 쿠데타","en":"The king's coup"},"body":{"ko":"국왕 미하이 1세가 안토네스쿠 원수를 왕궁에서 체포하고 라디오로 연합국과의 휴전과 대독 전쟁을 선언했다. 선언문 초안은 공산당의 파트라슈카누가 썼고, 서너테스쿠 장군의 정부에 국민농민당·국민자유당·사회민주당·공산당이 무임소 장관 한 명씩을 냈다.","en":"King Michael I arrested Marshal Antonescu at the palace and announced on the radio an armistice with the Allies and war on Germany. Four parties supplied ministers without portfolio to General Sănătescu's government."}},
    {"date":"1944.09.12","country":["romania","soviet"],"title":{"ko":"모스크바 휴전협정","en":"The Moscow armistice"},"body":{"ko":"루마니아는 3억 달러의 배상과 1940년 국경을 받아들였고, 북트란실바니아는 평화조약의 확인을 조건으로 돌려받기로 했다. 소련군 사령부가 이끄는 연합국 통제위원회가 설치되어 협정 이행을 감독했고, 미국과 영국 대표는 통보를 받는 자리에 있었다.","en":"Romania accepted 300 million dollars in reparations and the 1940 frontier, with northern Transylvania to be returned subject to the peace settlement. An Allied Control Commission under the Soviet command was installed."}},
    {"date":"1944.10.12","country":"romania","title":{"ko":"민족민주전선 결성","en":"The National Democratic Front is formed"},"body":{"ko":"공산당이 사회민주당, 농민전선, 애국동맹, 노동조합과 함께 민족민주전선을 결성하고 정부 안에서 더 많은 자리를 요구했다. 11월 4일 두 번째 서너테스쿠 정부에서 법무부와 교통부를 얻었고, 12월 초 러데스쿠 장군이 정부를 이었다.","en":"The Communists formed the National Democratic Front with the Social Democrats, the Ploughmen's Front, the Patriotic Union and the trade unions and demanded more places in government, obtaining Justice and Communications in the second Sănătescu government of 4 November."}},
    {"date":"1945.02.24","country":"romania","title":{"ko":"왕궁 광장의 총격","en":"Shots in Palace Square"},"body":{"ko":"정부 교체를 요구하는 민족민주전선 집회에서 총격으로 여러 명이 죽었다. 발포 주체를 두고 정부와 전선이 서로를 지목했고, 러데스쿠는 그날 밤 라디오에서 파우커와 루카를 「하이에나」라 불렀다. 소련 측은 러데스쿠를 파시스트 테러의 책임자로 규정했다.","en":"Several people were killed by gunfire at a Front rally demanding a change of government. Each side blamed the other, and Rădescu on the radio called Pauker and Luca \"hyenas\"."}},
    {"date":"1945.03.06","country":["romania","soviet"],"title":{"ko":"그로자 정부","en":"The Groza government"},"body":{"ko":"2월 27일 부쿠레슈티에 온 비신스키가 러데스쿠 정부의 해임을 두 시간 시한으로 요구하고 국왕이 내세운 슈티르베이를 거부한 뒤, 농민전선의 페트루 그로자를 총리로 하는 정부가 세워졌다. 마니우와 브러티아누의 당은 참여를 거부했고, 3월 9일 북트란실바니아의 루마니아 행정이 복귀했다.","en":"After Vyshinsky, in Bucharest from 27 February, demanded the Rădescu government's dismissal on a two-hour deadline, a government under Petru Groza of the Ploughmen's Front took office. Romanian administration returned to northern Transylvania on 9 March."}},
    {"date":"1945.03.23","country":"romania","title":{"ko":"토지개혁법","en":"The land reform law"},"body":{"ko":"법률 187호로 50헥타르 초과 토지와 전범·부재 지주·독일계 주민의 토지가 몰수되어 약 80만 가구에 분배되었다. 1921년 개혁 뒤 남아 있던 대토지가 대상이었고, 마니우의 국민농민당도 원칙에서는 반대하지 않았다. 5월 8일 소련과 합작기업 협정이 맺어졌다.","en":"Law 187 confiscated holdings above fifty hectares and the land of war criminals, absentee landlords and citizens of German origin, distributing it to some 800,000 households. Maniu's National Peasants did not oppose it in principle."}},
    {"date":"1945.08.21","country":"romania","title":{"ko":"국왕의 서명 거부","en":"The royal strike"},"body":{"ko":"포츠담에서 미국과 영국이 승인 거부를 정한 뒤, 국왕이 그로자에게 사임을 요구하고 거부당하자 정부 법령 서명을 중단했다. 정부는 서명 없이 법령을 공포했고, 11월 8일 국왕 명명일 집회에서 충돌이 일어나 사망자가 났다. 거부는 1946년 1월 7일까지 이어졌다.","en":"The king asked Groza to resign and, refused, stopped signing decrees. The government promulgated them without his signature, and a clash occurred at the name-day rally of 8 November. The refusal lasted until 7 January 1946."}},
    {"date":"1946.01.07","country":"romania","title":{"ko":"야당 각료 두 명의 입각","en":"Two opposition ministers join"},"body":{"ko":"12월 모스크바 외무장관 회의의 합의에 따라 국민농민당의 하치에가누와 국민자유당의 롬니체아누가 무임소 장관으로 들어갔다. 정부가 자유선거와 언론 자유를 약속하자 미국과 영국은 2월 5일 정부를 승인했고, 국왕은 서명 거부를 접었다.","en":"Under the Moscow foreign ministers' agreement, Hațieganu of the National Peasants and Romniceanu of the National Liberals entered the government without portfolio. The United States and Britain recognised the government on 5 February."}},
    {"date":"1946.11.19","country":"romania","title":{"ko":"총선","en":"The general election"},"body":{"ko":"공식 결과는 민주정당블록 69.8%(347석), 국민농민당 12.9%(33석), 국민자유당 3.8%(3석)였다. 야당은 결과를 부정하고 등원을 거부했다. 후대에 추를레아는 공산당 내부 보고서를 근거로 블록의 실제 득표를 45~47%로 추정했고, 2006년 대통령 위원회 보고서는 조작된 선거로 기록했다.","en":"The official result gave the Bloc of Democratic Parties 69.8 per cent and 347 seats, the National Peasants 12.9 per cent and 33. The opposition rejected the result and refused its seats. Țurlea, from an internal party report, put the Bloc's real share at 45 to 47 per cent."}},
    {"date":"1947.07.14","country":"romania","title":{"ko":"터머더우와 국민농민당 해산","en":"Tămădău and the dissolution of the National Peasants"},"body":{"ko":"미할라케 등 국민농민당 지도부가 터머더우 비행장에서 국외로 나가려다 체포되었다. 7월 19일 의원 면책특권이 박탈되고 30일 당이 해산되었으며, 마니우와 미할라케는 10월 29일부터 11월 11일까지의 군사재판에서 반역 혐의로 종신 중노동형을 받았다.","en":"Mihalache and other National Peasant leaders were arrested at Tămădău airfield while trying to leave the country. The party was dissolved on 30 July, and Maniu and Mihalache were sentenced to hard labour for life at the trial of 29 October to 11 November."}},
    {"date":"1947.12.30","country":"romania","title":{"ko":"퇴위와 인민공화국","en":"Abdication and the People's Republic"},"body":{"ko":"그로자와 게오르기우데지가 병력이 둘러싼 엘리사베타 궁에서 국왕에게 미리 작성한 퇴위 문서를 내밀었고, 국왕은 정오 무렵 서명했다. 같은 날 오후 의회가 법률 363호로 루마니아인민공화국을 선포했다. 파우커는 11월 7일부터 외무장관, 보드너라시는 12월 23일부터 국방장관이었다.","en":"At the Elisabeta Palace, surrounded by troops, Groza and Gheorghiu-Dej presented the king with the instrument of abdication, which he signed around noon. The chamber proclaimed the Romanian People's Republic the same day. Pauker had been foreign minister since 7 November."}},
    {"date":"1948.02.23","country":"romania","title":{"ko":"루마니아노동자당 창당","en":"The Romanian Workers' Party is founded"},"body":{"ko":"2월 21일부터 열린 공산당과 사회민주당의 통합대회가 루마니아노동자당을 세우고 게오르기우데지를 서기장으로 선출했다. 파트라슈카누는 대회에서 「민족주의적 편향」으로 비판받고 4월 28일 체포되었다. 3월 28일 단일 명부 선거와 4월 13일 인민공화국 헌법이 뒤따랐다.","en":"The unification congress of the Communists and Social Democrats founded the Romanian Workers' Party with Gheorghiu-Dej as general secretary. Pătrășcanu was criticised at the congress and arrested on 28 April. A single-list election on 28 March and the constitution of 13 April followed."}}
  ]$$::jsonb,
  $$[
    {"lat":44.43,"lng":26.10,"kind":"main","label":{"ko":"부쿠레슈티","en":"Bucharest"}},
    {"lat":47.16,"lng":27.59,"label":{"ko":"야시","en":"Iași"}},
    {"lat":46.77,"lng":23.59,"label":{"ko":"클루지","en":"Cluj"}},
    {"lat":45.35,"lng":25.55,"label":{"ko":"시나이아","en":"Sinaia"}},
    {"lat":44.35,"lng":26.48,"label":{"ko":"터머더우","en":"Tămădău"}},
    {"lat":47.93,"lng":23.89,"label":{"ko":"시게트","en":"Sighet"}},
    {"lat":55.75,"lng":37.62,"label":{"ko":"모스크바","en":"Moscow"}}
  ]$$::jsonb,
  $$[
    "Dennis Deletant, Communist Terror in Romania: Gheorghiu-Dej and the Police State, 1948–1965, Hurst, 1999",
    "Dennis Deletant, Romania under Communist Rule, Center for Romanian Studies, 1999",
    "Vladimir Tismaneanu, Stalinism for All Seasons: A Political History of Romanian Communism, University of California Press, 2003",
    "Keith Hitchins, Rumania 1866–1947, Oxford University Press, 1994",
    "Ghiță Ionescu, Communism in Rumania 1944–1962, Oxford University Press, 1964",
    "Robert Levy, Ana Pauker: The Rise and Fall of a Jewish Communist, University of California Press, 2001",
    "Dinu C. Giurescu, Romania's Communist Takeover: The Rădescu Government, East European Monographs, 1994",
    "Petre Țurlea, Alegerile parlamentare din noiembrie '46, Editura Enciclopedică, 2006",
    "Comisia Prezidențială pentru Analiza Dictaturii Comuniste din România, Raport final, 2006",
    "Norman Naimark and Leonid Gibianskii, eds., The Establishment of Communist Regimes in Eastern Europe, 1944–1949, Westview Press, 1997",
    "Arthur Gould Lee, Crown Against Sickle: The Story of King Michael of Rumania, Hutchinson, 1950"
  ]$$::jsonb,
  '{"parent":"eastern-europe-peoples-democracies"}'::jsonb
);

INSERT INTO commulingo_history_event_people
  (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('romania-1944-1948', 'michael-i-of-romania', 0, 'leader',
   '루마니아 국왕', 'King of Romania',
   '1944년 8월 23일 안토네스쿠를 체포해 연합국 측으로 돌아섰고, 1945년 8월부터 이듬해 1월까지 그로자 정부의 법령 서명을 거부했으며, 1947년 12월 30일 퇴위 문서에 서명했다.',
   'He arrested Antonescu on 23 August 1944 and took Romania to the Allies, refused to sign the Groza government''s decrees from August 1945 to January 1946, and signed the instrument of abdication on 30 December 1947.'),
  ('romania-1944-1948', 'ion-antonescu', 1, 'opponent',
   '체포된 국가지도자', 'The Conducător arrested at the palace',
   '8월 23일 왕궁에서 즉시 휴전을 거부하다 체포되어 소련군에 인도되었고, 1946년 5월 인민재판소에서 재판을 받아 6월 1일 처형되었다.',
   'Refusing an immediate armistice at the palace on 23 August, he was arrested and handed to the Soviet army; tried by a people''s tribunal in May 1946, he was executed on 1 June.'),
  ('romania-1944-1948', 'stalin', 2, 'leader',
   '소련 지도자', 'Soviet leader',
   '1944년 10월 처칠과 루마니아를 90 대 10으로 적었고, 1945년 3월 비신스키를 통해 그로자 정부를 세운 뒤 북트란실바니아의 루마니아 행정 복귀를 허가했다.',
   'He wrote Romania down as 90 to 10 with Churchill in October 1944, installed the Groza government through Vyshinsky in March 1945, and then authorised the return of Romanian administration to northern Transylvania.'),
  ('romania-1944-1948', 'molotov', 3, 'leader',
   '소련 외무인민위원', 'Soviet foreign minister',
   '1944년 9월 휴전협정에 서명했고, 1945년 12월 모스크바 외무장관 회의에서 그로자 정부에 야당 각료 두 명을 추가하는 타협안에 합의했다.',
   'He signed the armistice in September 1944 and at the Moscow foreign ministers'' conference of December 1945 agreed the compromise adding two opposition ministers to the Groza government.'),
  ('romania-1944-1948', 'vyshinsky', 4, 'executor',
   '부쿠레슈티에 파견된 외무부차관', 'Deputy foreign minister sent to Bucharest',
   '1945년 2월 27일 부쿠레슈티에 도착해 이튿날 두 시간 시한으로 러데스쿠 정부의 해임을 요구했고, 국왕이 내세운 슈티르베이를 거부하고 그로자를 지명했다.',
   'Arriving in Bucharest on 27 February 1945, he demanded the Rădescu government''s dismissal the next day on a two-hour deadline, rejected the king''s choice of Știrbei and named Groza.'),
  ('romania-1944-1948', 'malinovsky', 5, 'participant',
   '연합국 통제위원회의 명목상 위원장', 'Nominal chairman of the Allied Control Commission',
   '제2우크라이나 전선군 사령관으로 야시-키시너우 공세를 지휘했고, 휴전 뒤 통제위원회 위원장을 맡았으나 실무는 비노그라도프와 수사이코프가 보았다.',
   'Commanding the Second Ukrainian Front in the Iași-Chișinău offensive, he became chairman of the Control Commission after the armistice, the work being done by Vinogradov and Susaikov.'),
  ('romania-1944-1948', 'petru-groza', 6, 'executor',
   '1945년 3월부터의 총리', 'Prime minister from March 1945',
   '농민전선 지도자로 1945년 3월 6일 총리가 되어 토지개혁을 공포했고, 국왕의 사임 요구를 거부했으며, 1947년 12월 30일 게오르기우데지와 함께 퇴위 문서를 내밀었다.',
   'Leader of the Ploughmen''s Front, he became prime minister on 6 March 1945 and decreed land reform, refused the king''s demand that he resign, and with Gheorghiu-Dej presented the abdication on 30 December 1947.'),
  ('romania-1944-1948', 'gheorghe-gheorghiu-dej', 7, 'executor',
   '공산당 서기장', 'General secretary of the Communist Party',
   '1944년 8월 감옥에서 나와 당을 이끌었고, 교통장관과 경제장관을 거쳐 1947년 12월 퇴위 문서 전달, 1948년 2월 노동자당 서기장 선출, 파트라슈카누 제거를 주도했다.',
   'Released from prison in August 1944, he led the party through the Communications and Economy ministries, delivered the abdication in December 1947, was elected general secretary of the Workers'' Party in February 1948 and directed the removal of Pătrășcanu.'),
  ('romania-1944-1948', 'ana-pauker', 8, 'executor',
   '당 서기국원, 1947년 11월부터 외무장관', 'Secretariat member, foreign minister from November 1947',
   '1944년 모스크바에서 돌아와 당 서기국의 한 자리를 맡았고, 러데스쿠의 「하이에나」 연설의 표적이었으며, 1947년 11월 7일 터터레스쿠를 대신해 외무장관이 되었다.',
   'Returning from Moscow in 1944 to a seat in the party secretariat, she was a target of Rădescu''s "hyenas" speech and replaced Tătărescu as foreign minister on 7 November 1947.'),
  ('romania-1944-1948', 'vasile-luca', 9, 'executor',
   '당 서기국원, 재무장관', 'Secretariat member, finance minister',
   '파우커와 함께 모스크바에서 돌아와 서기국에 들어갔고, 1947년 11월 재무장관이 되어 1948년의 국유화와 통화 정책을 맡았다.',
   'Returning from Moscow with Pauker to the secretariat, he became finance minister in November 1947 and handled the nationalisation and currency measures of 1948.'),
  ('romania-1944-1948', 'teohari-georgescu', 10, 'executor',
   '내무장관', 'Interior minister',
   '1944년 12월 내무차관, 1945년 3월부터 내무장관으로 경찰과 보안기관을 맡았고, 1947년 7월 그의 보고에 따라 국민농민당이 해산되었다.',
   'Under-secretary of the Interior from December 1944 and minister from March 1945 in charge of police and security, he filed the report on which the National Peasant Party was dissolved in July 1947.'),
  ('romania-1944-1948', 'iuliu-maniu', 11, 'target',
   '국민농민당 총재, 1947년 재판의 피고', 'President of the National Peasant Party, tried in 1947',
   '8월 23일 쿠데타의 준비자였으나 그로자 정부 참여를 거부했고, 1946년 선거 결과를 부정했으며, 1947년 11월 종신 중노동형을 받아 1953년 시게트에서 사망했다.',
   'A preparer of the 23 August coup, he refused to join the Groza government, rejected the 1946 result, was sentenced to hard labour for life in November 1947 and died at Sighet in 1953.'),
  ('romania-1944-1948', 'vladimir-tismaneanu', 12, 'witness',
   '루마니아 공산주의 정치사의 연구자', 'Historian of Romanian communism',
   '『모든 계절의 스탈린주의』(2003)에서 세 갈래 당 지도부의 형성을 정리했고, 2006년 대통령 위원회의 최종 보고서를 이끌었다.',
   'In Stalinism for All Seasons (2003) he set out the formation of the party''s three leadership strands, and he chaired the Presidential Commission whose final report appeared in 2006.');

COMMIT;
