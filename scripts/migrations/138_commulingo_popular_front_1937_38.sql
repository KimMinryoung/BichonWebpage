-- Expand the 1937-38 decline of the French Popular Front event (136/137).
-- The whole unravelling sat in one paragraph; it becomes two body sections
-- (「돈의 파업」과 상원의 벽 / 해체: 쇼탕에서 11월 30일까지) covering the pause,
-- Clichy, the Senate vetoes, the Chautemps interlude and SNCF, the second Blum
-- government under the Anschluss, the Radicals' turn, and the breaking of the
-- 30 November 1938 strike. Timeline grows 18 → 22 entries (Clichy, SNCF,
-- second Blum government; the pause and 30 November entries rewritten).
-- Full-column UPDATE of body_ko / body_en / timeline.
--
-- Applied to leninbot-pg on 2026-08-11; committed as a record.

BEGIN;

UPDATE commulingo_history_events SET
  updated_at = now(),
  body_ko = $b$## 광장의 폭동에서 하나의 선서로

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

## 「돈의 파업」과 상원의 벽

마티뇽의 성과는 1년을 버티지 못하고 물가에 잡아먹혔다. 평가절하와 함께 돌아올 것이라던 자본은 돌아오지 않았고, 물가는 1937년 여름까지 임금 인상분을 사실상 도로 삼켰으며, 프랑스은행의 금은 계속 새어 나갔다. 좌파는 이것을 「돈의 파업」이라 불렀고, 「200가문」이 공화국을 인질로 잡았다고 썼다. 문제는 정부가 그 진단에서 아무 결론도 끌어내지 않았다는 데 있다. 외환 통제를 도입하지 않는 한 자본 이동은 합법이었고, 재정 정통주의를 받아들인 정부에 남은 대답은 지출 축소뿐이었다. 1937년 2월 13일 블룸은 개혁의 「휴지기」를 선언하고 공공사업 계획을 줄였으며, 프랑 방어를 정통파 경제학자 3인 위원회에 맡겼다. 시장을 안심시키기 위한 조치였지만 시장은 안심하지 않았고, 지지자들은 항복 선언으로 들었다.

한 달 뒤에는 피가 흘렀다. 3월 16일 노동자 도시 클리시에서 해산된 불의 십자단의 후신인 프랑스사회당(PSF)이 영화관 집회를 열자 인민전선 지지자 수천 명이 항의 시위에 나섰고, 경찰이 시위대에 발포해 5명이 죽고 수백 명이 다쳤다. 죽은 것은 정부의 적이 아니라 정부의 지지자들이었다. CGT는 항의 반나절 총파업을 불렀고, 그날 밤 병원을 찾은 블룸은 사임을 생각했다고 훗날 말했다. 인민전선 정부가 인민전선의 군중에게 총을 쏜 셈이 된 이 사건 뒤로 거리의 열기는 다시 조직되지 않았다.

6월에 투기가 다시 프랑을 덮치자 블룸은 재정 전권을 요청했다. 하원은 가결했으나 급진당 원로 카요가 버티는 상원은 두 차례 거부했다. 싸울 길이 없지는 않았다. 하원의 다수를 앞세워 버티거나 거리에 호소하는 길이 있었고, 실제로 그렇게 하라는 요구가 당 안팎에서 나왔다. 블룸은 둘 다 거부했다. 합법성의 틀 안에서 위임받은 만큼만 하겠다던 약속은, 선출되지 않은 것이나 다름없는 상원이 벽을 세우면 그 앞에서 멈춘다는 뜻이기도 했다. 6월 21일 그는 사임했다. 1년 전 「모든 것이 가능하다」던 나라에서, 정부는 은행과 상원 중 어느 쪽과도 싸워 보지 않고 물러났다.

## 해체: 쇼탕에서 11월 30일까지

정부는 급진당의 쇼탕에게 넘어갔고 블룸은 부총리로 남았다. 쇼탕 정부는 프랑을 변동환율로 풀어 두 번째 평가절하를 사실상 집행했고, 개혁 목록에 마지막 큰 항목 하나를 보탰다. 1937년 8월 적자에 허덕이던 다섯 민간 철도회사를 국가가 과반을 쥐는 하나의 회사로 통합해 국유 철도공사(SNCF)를 세운 것이다. 그러나 방향은 이미 되감기였다. 노동자들이 얻은 것을 지켜 줄 정부는 없다는 감각이 퍼지면서 파업은 다시 잦아졌고 사용자들은 마티뇽에서 내준 것을 사업장 단위로 회수하기 시작했다. 1938년 1월 쇼탕은 사회당을 뺀 내각을 다시 짰고, 3월 12일 히틀러가 오스트리아를 병합하던 바로 그 주말에 프랑스에는 총리가 없었다.

3월 13일 블룸이 두 번째로 내각을 맡았다. 그는 안슐루스 앞에서 토레즈부터 우파의 레노까지 아우르는 거국내각을 제안했으나 우파가 거부했고, 자본 과세와 외환 통제를 담은 비상 재정계획을 들고, 이번에는 망데스 프랑스를 재무차관으로 세워 다시 상원 앞에 섰다. 결과는 1년 전과 같았고 두 번째 내각은 26일 만에 끝났다. 4월 10일 달라디에가 정부를 세웠을 때 의석 배치는 1936년 그대로였지만 다수의 성격은 이미 다른 것이었다. 같은 인민전선 의석으로 달라디에는 9월 뮌헨 협정의 승인을 얻어 냈고(반대는 공산당 의원들을 비롯한 75표뿐이었다), 10월 마르세유 대회에서 급진당은 공산당과의 절연을 선언했다. 인민전선은 해산 선언도 없이, 구성 정당들이 하나씩 빠져나가는 방식으로 사라지고 있었다.

마지막 일격은 11월에 왔다. 재무장관 레노가 법령으로 주 40시간제를 사실상 해체하며 「두 번의 일요일이 있는 주는 끝났다」고 선언하자, CGT는 11월 30일 하루 총파업을 불렀다. 정부는 철도를 징발하고 파업 예정 사업장에 경찰과 군을 미리 투입했으며 점거 시도를 그 자리에서 진압했다. 파업은 하루 만에 꺾였고, 르노를 비롯한 공장들에서 수천 명이 보복 해고되거나 재고용 각서를 쓰고서야 돌아갔으며, 400만이던 CGT 조합원은 이듬해 100만 대로 무너졌다. 1936년 6월이 세운 힘의 균형은 그렇게 30개월 만에 청산되었다.

## 1936년 6월을 어떻게 읽을 것인가

당대의 논쟁이 그대로 사학사의 논쟁이 되었다. 트로츠키에게 1936년 6월은 시작된 혁명이었고, 인민전선은 그것을 의회의 틀에 가두어 죽인 계급협조의 기계였다. 반대편에서 보면 인민전선은 프랑스에서 파시즘의 길을 막고 민주주의를 지킨 방벽이었으며, 마티뇽의 성과는 혁명 없이 얻어 낸 것 가운데 가장 큰 것이었다. 잭슨을 비롯한 연구자들은 두 독법 사이에서 이 정부가 안고 있던 제약을 강조한다. 급진당 없이는 다수가 없었고, 상원은 끝까지 적대적이었으며, 재정 정통주의를 받아들인 순간 개혁의 여력은 자본 이동이 결정했다.

분명한 것은 남은 것들이다. 유급휴가와 단체협약은 이후 프랑스 노동법의 골격이 되었고, 1936년의 기억은 1944년 레지스탕스 전국평의회 강령과 해방 후 사회보장으로 이어졌다. 그리고 「인민전선」이라는 이름 자체가 스페인에서 칠레까지, 그리고 반세기 뒤 소련의 마지막 몇 해까지, 좌파가 위기 앞에서 연합을 부르는 보통명사가 되었다.$b$,
  body_en = $b$## From a Riot to an Oath

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

## The 'Strike of Money' and the Wall of the Senate

The gains of Matignon did not survive a year against prices. The capital that was supposed to return with devaluation did not return; by the summer of 1937 inflation had effectively swallowed the wage rises back, and gold went on draining out of the Bank of France. The left called this 'the strike of money' and wrote that the 'two hundred families' were holding the Republic hostage. The trouble was that the government drew no conclusion from its own diagnosis. Without exchange controls, moving capital abroad was perfectly legal, and a government that had accepted financial orthodoxy had only one answer left: cutting spending. On 13 February 1937 Blum declared a 'pause' in reform, trimmed the public works programme, and entrusted the defence of the franc to a committee of three orthodox economists. The measures were meant to reassure the markets; the markets were not reassured, and the government's own supporters heard a declaration of surrender.

A month later came blood. On 16 March, in the working-class town of Clichy, the Parti Social Français, successor to the dissolved Croix-de-Feu, held a cinema meeting; thousands of Popular Front supporters demonstrated against it, and police fired into the crowd, killing five and wounding hundreds. The dead were not the government's enemies but its own voters. The CGT called a half-day general strike of protest, and Blum, who went to the hospitals that night, later said he had thought of resigning. After this night, on which a Popular Front government had in effect fired on a Popular Front crowd, the heat of the street was never organized again.

When speculation hit the franc again in June, Blum asked for emergency financial powers. The Chamber granted them; the Senate, where the Radical elder Caillaux held the finance committee, refused twice. There were ways to fight: to stand on the Chamber's majority and dare the Senate, or to appeal to the street, and voices inside and outside the party demanded both. Blum refused both. The promise to act within legality, only as far as the mandate reached, also meant stopping wherever the effectively unelected Senate built its wall. On 21 June he resigned. In the country where a year earlier 'everything was possible', the government withdrew without testing its strength against either the banks or the Senate.

## Unravelling: From Chautemps to 30 November

The government passed to the Radical Chautemps, with Blum staying on as vice-premier. The Chautemps government let the franc float, in effect a second devaluation, and added one last major item to the reform ledger: in August 1937 the five loss-making private railway companies were merged into a single company with a state majority, the SNCF. But the direction was already reverse. As the sense spread that no government would defend what the workers had won, strikes flared again and employers began clawing back, workplace by workplace, what they had conceded at Matignon. In January 1938 Chautemps re-formed his cabinet without the Socialists, and on the weekend of 12 March, as Hitler annexed Austria, France had no prime minister at all.

On 13 March Blum formed his second government. Facing the Anschluss, he proposed a government of national unity stretching from Thorez to Reynaud on the right; the right refused. He then went back before the Senate with an emergency financial plan built on a capital levy and exchange controls, this time with Mendès France as his treasury undersecretary. The result was the same as the year before, and the second government ended after 26 days. When Daladier formed his government on 10 April, the seats were exactly those of 1936, but the majority was already something else. With the same Popular Front chamber Daladier won approval for the Munich agreement in September (only 75 deputies, the Communists foremost among them, voted against), and in October, at its Marseille congress, the Radical Party declared its break with the Communists. The Popular Front was disappearing without any act of dissolution, its member parties stepping out one by one.

The final blow came in November. When finance minister Reynaud dismantled the 40-hour week by decree, declaring that 'the week of two Sundays has ceased to exist', the CGT called a one-day general strike for 30 November. The government requisitioned the railways, garrisoned the plants with police and troops in advance, and broke every attempted occupation on the spot. The strike collapsed within the day; thousands were sacked in reprisal at Renault and elsewhere or taken back only after signing individual re-engagement papers, and the CGT's four million members fell to around a million within a year. The balance of forces built in June 1936 was thus liquidated in thirty months.

## How to Read June 1936

The argument of the time became the argument of the historians. For Trotsky, June 1936 was a revolution that had begun, and the Popular Front was the machinery of class collaboration that caged and killed it in parliamentary form. Seen from the other side, the Popular Front was the rampart that blocked the road to fascism in France and defended democracy, and Matignon was the greatest gain ever won without a revolution. Scholars such as Julian Jackson stress, between the two readings, the constraints the government carried: no majority without the Radicals, a Senate hostile to the end, and once financial orthodoxy was accepted, room for reform decided by capital flight.

What is beyond dispute is what remained. Paid holidays and collective agreements became the skeleton of French labour law; the memory of 1936 fed the 1944 programme of the National Council of the Resistance and postwar social security. And the name 'Popular Front' itself became, from Spain to Chile and on to the Soviet Union's final years half a century later, the common noun by which the left calls for unity in the face of danger.$b$,
  timeline = $j$[
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
    {"date": "1937.02.13", "title": {"ko": "개혁의 「휴지기」", "en": "The 'Pause'"}, "body": {"ko": "물가가 임금 인상분을 삼키고 금이 새어 나가는 「돈의 파업」 앞에서, 블룸은 공공사업을 줄이고 프랑 방어를 정통파 경제학자들에게 맡긴다. 시장은 안심하지 않았고 지지자들은 항복 선언으로 들었다.", "en": "With prices swallowing the wage gains and gold draining out in a 'strike of money', Blum trims public works and entrusts the franc to orthodox economists. The markets are not reassured, and his own supporters hear a surrender."}},
    {"date": "1937.03.16", "title": {"ko": "클리시의 총성", "en": "The Shots at Clichy"}, "body": {"ko": "노동자 도시 클리시에서 경찰이 극우 PSF 집회에 항의하는 인민전선 지지 시위대에 발포해 5명이 죽는다. 정부가 제 지지자들에게 총을 쏜 셈이 되었고, 이날 이후 거리의 열기는 다시 조직되지 않았다.", "en": "In working-class Clichy, police fire on Popular Front supporters demonstrating against a far-right PSF meeting, killing five. A government of the left had in effect fired on its own crowd, and the heat of the street was never organized again."}},
    {"date": "1937.06.21", "title": {"ko": "블룸 사퇴", "en": "Blum Resigns"}, "body": {"ko": "프랑 투기 앞에서 요청한 재정 전권을 하원은 주고 상원은 두 차례 거부한다. 블룸은 하원 다수로 버티지도 거리에 호소하지도 않고 물러난다.", "en": "The Chamber grants the financial powers he asks for against the run on the franc; the Senate refuses twice. Blum neither stands on his Chamber majority nor appeals to the street, and resigns."}},
    {"date": "1937.08.31", "title": {"ko": "철도 국유화, SNCF", "en": "The Railways Nationalized: SNCF"}, "body": {"ko": "쇼탕 과도기의 정부가 적자에 허덕이던 다섯 민간 철도회사를 국가가 과반을 쥐는 국유 철도공사로 통합한다. 인민전선 개혁 목록의 마지막 큰 항목이었다.", "en": "The caretaker Chautemps government merges the five loss-making private railway companies into the state-majority SNCF, the last major item on the Popular Front's reform ledger."}},
    {"date": "1938.03.13", "title": {"ko": "안슐루스 그늘의 2차 블룸 내각", "en": "The Second Blum Government, in the Shadow of the Anschluss"}, "body": {"ko": "히틀러의 오스트리아 병합 이튿날 블룸이 토레즈부터 레노까지의 거국내각을 제안하지만 우파가 거부한다. 자본 과세·외환 통제 계획도 상원이 다시 막아, 내각은 26일 만에 끝나고 달라디에에게 넘어간다.", "en": "The day after Hitler annexes Austria, Blum proposes a national unity government from Thorez to Reynaud; the right refuses. The Senate again blocks his capital levy and exchange controls, the cabinet ends after 26 days, and Daladier takes over."}},
    {"date": "1938.11.30", "title": {"ko": "11월 총파업의 패배", "en": "Defeat of the November General Strike"}, "body": {"ko": "레노의 법령이 40시간제를 해체하자 CGT가 하루 총파업으로 답한다. 정부는 철도를 징발하고 군을 투입해 파업을 하루 만에 꺾었고, 수천 명이 보복 해고되며 CGT는 조합원 4분의 3을 잃는다. 인민전선 시대가 막을 내린다.", "en": "When Reynaud's decrees dismantle the 40-hour week, the CGT answers with a one-day general strike. The government requisitions the railways and sends in troops, the strike is broken within the day, thousands are sacked in reprisal and the CGT loses three quarters of its members. The Popular Front era closes."}}
  ]$j$::jsonb
WHERE id = 'french-popular-front';

COMMIT;
