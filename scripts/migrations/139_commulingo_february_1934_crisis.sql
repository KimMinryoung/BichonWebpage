-- The 6 February 1934 crisis: one history event (sort_order 77, between the
-- Holodomor and the French Popular Front), its cast, and the glossary links.
--
-- The Popular Front entry (78) already opens on this night in three sentences,
-- because it had to: the front has no starting point without it. This entry is
-- the night itself and what it did to the Comintern's line, which is a
-- different subject from what the front then did in office. The two sit next to
-- each other in the reading order and each links the other through their prose.
--
-- Every person linked here already exists in the dictionary. Jean Chiappe,
-- Alexandre Stavisky, La Rocque and Doriot appear in the body only: they belong
-- to French domestic politics rather than to this dictionary's subject, and a
-- card for each would be a separate editorial decision.

BEGIN;

INSERT INTO commulingo_history_events (
  id, sort_order, period_label,
  title_ko, title_en, question_ko, question_en,
  summary_ko, summary_en, outcome_ko, outcome_en,
  body_ko, body_en, timeline, sources
) VALUES (
  'february-1934-crisis', 77, '1934.01–07',
  '1934년 2월 6일 위기', 'The 6 February 1934 Crisis',
  '파리의 하룻밤 폭동이 어떻게 코민테른의 노선을 뒤집었는가?',
  'How did one night of rioting in Paris overturn the line of the Comintern?',
  $t$1934년 2월 6일 저녁 파리 콩코르드 광장에서 극우 동맹들이 하원 의사당을 향해 밀어붙이다 경찰 발포로 15명이 죽었다. 스타비스키 금융 사기 사건으로 의회 부패에 대한 분노가 쌓인 끝이었다. 이튿날 의회 다수를 쥐고 있던 에두아르 달라디에 총리가 사임하면서, 제3공화국에서 처음으로 거리가 정부를 무너뜨렸다. 사흘 뒤 공산당 시위에서 다시 9명이 죽었고, 2월 12일 총파업에서는 따로 행진하던 사회당과 공산당의 대열이 나시옹 광장에서 만나 「단결!」을 외쳤다. 오늘날 연구는 그날 밤을 조직된 쿠데타로 보지 않지만, 히틀러 집권 1년째였던 당시 좌파에게 그것은 프랑스판 파시즘의 총연습이었다. 이 공포가 사회파시즘 노선을 무너뜨리고 7월 통일행동협정과 이듬해 게오르기 디미트로프의 인민전선 보고로 이어졌다.$t$,
  $t$On the evening of 6 February 1934 the far-right leagues pushed toward the Chamber of Deputies across the Place de la Concorde in Paris, and police fire left fifteen dead. The Stavisky financial scandal had spent six weeks turning ordinary distress into fury at a parliament seen as bought. The next day Prime Minister Édouard Daladier resigned although he held a parliamentary majority, the first time in the Third Republic that the street brought down a government. Nine more died in a Communist demonstration three days later, and on 12 February the Socialist and Communist columns, marching separately to a general strike, met at the Place de la Nation and embraced to shouts of 'Unity!'. Historians no longer read that night as an organised coup, but to a left one year into Hitler's rule it was a dress rehearsal for a French fascism. That fear broke the social-fascism line, produced the July pact of unity of action, and led the following year to Georgi Dimitrov's report on the popular front.$t$,
  $t$2월의 위기는 프랑스 좌파의 재편을 강제했다. 1934년 7월 27일 사회당과 공산당의 통일행동협정, 1935년 7월 14일 50만 명의 인민연합 선서, 1936년 5월 총선 승리로 이어져 레옹 블룸의 인민전선 정부가 들어섰다. 코민테른에서는 1935년 제7차 대회에서 사회파시즘 노선이 폐기되고 인민전선이 공식 노선이 되었으며, 이 노선은 스페인과 칠레의 인민전선 정부로 이어졌다가 1939년 독소 불가침조약과 함께 갑작스럽게 접혔다. 프랑스 극우에게 2월 6일은 순교의 기억으로 남아, 1940년 비시 체제의 인사들이 자기 정치의 기원으로 되짚는 날이 되었다.$t$,
  $t$The February crisis forced the reordering of the French left: the Socialist-Communist pact of unity of action on 27 July 1934, the oath of the Rassemblement populaire sworn by half a million people on 14 July 1935, the electoral victory of May 1936 and Léon Blum's Popular Front government. In the Comintern, the Seventh Congress of 1935 abandoned the social-fascism line and made the popular front official policy, which carried through to the Popular Front governments of Spain and Chile before being dropped overnight with the Nazi-Soviet pact of 1939. For the French far right, 6 February remained a day of martyrs, and in 1940 a striking number of Vichy's men traced their politics back to it.$t$,
  $t$## 스타비스키의 시신과 의회의 불신

프랑스에 대공황은 늦게 왔다. 1931년부터 수출이 무너지고 실업이 늘었지만 정부는 금본위와 균형재정을 지키느라 손발이 묶여 있었다. 1932년 총선에서 좌파가 이겼는데도 급진당은 사회당과 함께 정부를 꾸리지 못했고, 두 해 사이에 내각이 다섯 번 바뀌었다. 의회는 위기 앞에서 아무것도 결정하지 못하는 기구로 보이기 시작했다.

1933년 12월, 여기에 추문 하나가 얹혔다. 사업가 알렉상드르 스타비스키가 바욘 시립 전당포를 통해 담보가 부실한 채권을 발행해 수억 프랑을 끌어모은 사실이 드러났다. 그는 여러 차례 기소되고도 재판이 열아홉 번 연기되는 동안 자유롭게 지냈고, 그 뒤에는 급진당 정치인들과 사법부의 인맥이 있었다. 1934년 1월 8일 샤모니의 산장에서 총상을 입은 채 발견되었고 경찰은 자살로 발표했다. 「경찰이 아주 가까이서 쏘았다」는 조롱이 우파 신문의 표제가 되었다. 왕당파 악시옹 프랑세즈, 청년애국단, 연대 프랑스, 그리고 참전군인 조직에서 자라난 불의 십자단은 이 사건을 「부패한 공화국」의 증거로 삼아 거의 매일 밤 거리로 나섰다.

## 콩코르드의 밤

1월 27일 카미유 쇼탕 내각이 무너지고 30일 에두아르 달라디에가 정부를 세웠다. 그는 동맹들에게 관대하다는 평을 듣던 파리 경찰청장 장 시아프를 2월 3일 자리에서 물러나게 했다. 모로코 총감 자리를 제안했으나 시아프는 거부했고, 우파는 이것을 공화국이 자기 편 경찰을 쳐낸 사건으로 받아들였다.

2월 6일 저녁, 달라디에가 하원에서 신임을 묻는 동안 여러 동맹과 참전군인 단체가 각기 다른 길로 콩코르드 광장에 모였다. 광장에서 다리 하나만 건너면 하원 의사당이었다. 군중은 버스를 불태우고 철책을 뜯어 던졌으며, 다리를 막아선 경찰은 여러 차례 발포했다. 밤이 끝났을 때 15명이 죽고 1,500명 넘게 다쳤다. 사망자는 대부분 시위대였고 경찰 쪽에서도 수백 명이 다쳤다.

달라디에는 의회에서 신임을 얻었다. 그런데도 이튿날 사임했다. 군대를 부르면 더 큰 유혈이 온다는 것이 그의 설명이었다. 제3공화국에서 의회 다수를 쥔 정부가 거리에 밀려 물러난 것은 이때가 처음이었다. 후임은 정계에서 은퇴해 있던 전 대통령 가스통 두메르그였고, 그가 꾸린 거국내각에는 필리프 페탱 원수가 국방장관으로 들어갔다. 좌파가 보기에 이것은 거리의 폭력이 내각의 구성을 바꾼 사건이었다.

## 폭동인가 쿠데타인가

오늘날 연구는 2월 6일을 조직된 쿠데타로 보지 않는다. 세르주 베르스탱을 비롯한 연구자들이 정리했듯이 동맹들에게는 공동 지휘부도, 의사당을 점거한 뒤의 계획도 없었다. 불의 십자단을 이끌던 프랑수아 드 라 로크 대령은 자기 대열을 의사당 반대편에 세워 두었다가 해산시켰고, 이 신중함 때문에 뒷날 극우 진영 안에서 배신자로 몰렸다. 광장에 모인 사람들의 목적도 하나가 아니었다. 그 안에는 연금이 깎인 참전군인과 세금에 항의하는 상인이 함께 있었다.

그러나 정치를 움직인 것은 사건의 실제 성격이 아니라 그것을 읽은 방식이었다. 히틀러가 총리가 된 지 1년, 독일의 사회민주당과 공산당이 서로를 주적으로 부르다 함께 무너진 기억이 아직 생생했다. 프랑스 좌파는 콩코르드의 밤을 프랑스판 파시즘의 총연습으로 읽었고, 그 독법 위에서 움직였다. 사실 관계의 문제가 아니라 위협에 대한 판단의 문제였다는 이 구분이 이후에 벌어진 일을 이해하는 열쇠다.

## 2월 12일, 두 대열이 만나다

2월 9일 프랑스공산당이 부른 시위가 파리 레퓌블리크 광장 일대에서 경찰과 충돌해 9명이 죽었다. 사흘 뒤인 2월 12일에는 노동총동맹(CGT)이 공화국 방어를 내걸고 24시간 총파업을 불렀고, 갈라져 나가 있던 통일노동총동맹(CGTU)과 공산당도 각자의 이름으로 참가했다. 전국에서 파업과 집회가 이어졌다. 파리에서는 사회당 대열과 공산당 대열이 서로 다른 길로 나시옹 광장을 향해 행진했다. 두 대열이 만나는 순간 무슨 일이 벌어질지 아무도 장담하지 못했다. 여섯 해 동안 서로를 「사회파시스트」와 「분열주의자」로 부르던 사이였다. 대열은 충돌하지 않았다. 노동자들은 「단결!」을 외치며 서로 껴안았다.

이날의 광경은 그 뒤 몇 달 동안 프랑스 좌파 정치의 근거가 되었다. 당의 결정이 기층을 움직인 것이 아니라 기층이 당의 손을 묶었다. 생드니 시장이자 공산당 지도부의 한 사람이던 자크 도리오는 2월부터 사회당과의 공동행동을 공개로 요구했고, 모스크바의 소환에 응하지 않아 6월 27일 제명되었다. 뒷날 그가 파시스트 정당인 프랑스인민당을 세운다는 사실은 이 시기의 아이러니로 남는다. 같은 요구를 당의 이름으로 집행한 것은 그를 제명한 모리스 토레즈였다.

## 모스크바가 노선을 바꾸기까지

1928년 코민테른 제6차 대회 이래의 공식 노선은 사회민주주의를 파시즘의 「온건한 날개」로 규정하는 사회파시즘론이었다. 독일에서 그 결과가 무엇이었는지는 1933년에 이미 드러났지만, 코민테른은 히틀러의 집권을 자본주의 붕괴의 전조로 해석하며 노선을 유지했다.

전환의 인물은 게오르기 디미트로프였다. 국회의사당 방화 사건의 피고로 라이프치히 법정에 서서 괴링을 몰아붙이고 무죄를 받아 낸 그는, 콩코르드의 밤에서 3주 뒤인 1934년 2월 27일 모스크바에 도착했다. 그해 봄부터 그는 사회민주주의 노동자를 주적으로 두는 노선이 옳은지 묻는 메모를 쓰기 시작했고, 프랑스에서 벌어진 일이 그 물음의 구체적인 증거가 되었다. 결정은 그의 것이 아니었다. 스탈린의 재가가 있고 나서야 노선이 움직였고, 그 재가에는 소련 외교의 필요가 얹혀 있었다. 독일의 위협 앞에서 소련은 프랑스와 손을 잡아야 했는데, 프랑스공산당이 프랑스 정부를 무너뜨리려 애쓰는 상태로는 그 동맹이 성립하지 않았다.

7월 27일 사회당과 공산당이 통일행동협정에 서명했다. 10월 낭트에서 토레즈는 연합을 급진당까지 넓히자며 「노동과 자유와 평화의 인민전선」이라는 이름을 처음 내놓았다. 1935년 5월 프랑스-소련 상호원조조약이 서명되었고, 그해 7월 25일부터 8월 20일까지 열린 코민테른 제7차 대회에서 디미트로프는 8월 2일의 보고로 이 전환을 세계 공산주의 운동의 공식 노선으로 만들었다. 그 보고가 파시즘에 내린 정의는 이후 반세기 동안 공산주의 운동의 표준 정식이 된다. 「권력을 쥔 파시즘은 금융자본의 가장 반동적이고 가장 배외주의적이며 가장 제국주의적인 분자들의 공공연한 테러 독재이다.」 파시즘을 자본주의 일반의 다른 이름이 아니라 지배계급 안 특정 분파의 지배로 규정한 이 정식은, 나머지 부르주아 세력과의 동맹을 이론적으로 가능하게 만들었다. 사회파시즘론이 닫아 두었던 문이 그 자리에서 열렸다.

## 두 개의 기억

프랑스에서 2월 6일은 두 갈래의 기억으로 남았다. 좌파에게 그것은 인민전선의 출발점이었다. 2월 12일의 합류에서 1935년 7월 14일 50만 명의 인민연합 선서로, 1936년 5월 총선 승리와 레옹 블룸 정부로 이어지는 선이 그어졌다. 유급휴가와 주 40시간제가 그 선의 끝에 있었다.

우파에게 2월 6일은 순교의 날이었다. 죽은 열다섯 명은 「공화국이 쏘아 죽인 애국자」로 기려졌고 해마다 콩코르드 광장에서 추모가 열렸다. 1940년 패전 뒤 비시 정권의 인사들 가운데 상당수가 이 밤을 자기 정치의 기원으로 말했다. 같은 사건이 한쪽에는 반파시즘 연합의 출발점이 되고 다른 쪽에는 의회 공화국을 끝장낼 명분이 되었다.

역사학의 논쟁은 인과의 방향에 관한 것이다. 노선 전환은 파리의 거리에서 올라간 것인가, 아니면 소련 외교의 필요에서 내려온 것인가. 코민테른 문서고가 열린 뒤의 연구는 대체로 두 힘이 만난 지점을 가리킨다. 프랑스 지부는 모스크바의 허락이 떨어지기 전에 기층의 압력으로 먼저 움직였고, 모스크바는 그 움직임을 뒤늦게 추인하면서 자기 외교의 필요에 맞게 다듬었다. 어느 한쪽만으로는 노선이 바뀌지 않았을 것이다.$t$,
  $t$## Stavisky's body and a parliament nobody believed

The Depression reached France late. Exports collapsed and unemployment climbed from 1931, but governments were tied to the gold standard and to balanced budgets. The left won the 1932 elections and still the Radicals would not govern with the Socialists; five cabinets came and went in two years. Parliament began to look like a body incapable of deciding anything.

In December 1933 a scandal landed on top of that. Alexandre Stavisky, a financier, had raised hundreds of millions of francs on poorly secured bonds issued through the municipal pawnshop of Bayonne. He had been indicted repeatedly and had walked free while his trial was postponed nineteen times, protected by connections among Radical politicians and in the judiciary. On 8 January 1934 he was found in a chalet at Chamonix with a gunshot wound, and the police called it suicide. 'The police shot him from very close range' became a headline joke on the right. Action Française, the Jeunesses Patriotes, Solidarité Française and the Croix-de-Feu, the last grown out of a veterans' association, took the affair as proof of a rotten republic and went into the streets almost nightly.

## The night on the Concorde

Camille Chautemps's cabinet fell on 27 January and Édouard Daladier formed a government on the 30th. On 3 February he removed Jean Chiappe, the Paris prefect of police widely thought indulgent toward the leagues. Chiappe was offered the residency in Morocco and refused, and the right read the affair as the republic striking down its own policeman.

On the evening of 6 February, while Daladier faced a confidence vote in the Chamber, the leagues and the veterans' associations converged by different routes on the Place de la Concorde, one bridge away from the Palais Bourbon. The crowd burned buses and tore up railings; the police holding the bridge fired several times. By the end of the night fifteen were dead and more than 1,500 injured. Most of the dead were demonstrators, and several hundred police were injured too.

Daladier won his confidence vote. He resigned the next day all the same, explaining that calling in the army would mean far worse bloodshed. It was the first time under the Third Republic that a government with a parliamentary majority was pushed out by the street. His successor was Gaston Doumergue, a former president recalled from retirement, whose government of national union included Marshal Philippe Pétain as minister of war. To the left, street violence had just chosen a cabinet.

## Riot or coup

Historians no longer read 6 February as an organised coup. As Serge Berstein and others established, the leagues had no joint command and no plan for the morning after seizing the Chamber. Colonel François de La Rocque held his Croix-de-Feu columns on the far side of the building and then dispersed them, a caution for which the far right later called him a traitor. Nor did the crowds share one purpose: veterans whose pensions had been cut marched alongside shopkeepers protesting taxes.

What moved politics, though, was not what the night was but how it was read. Hitler had been chancellor for a year, and the memory was fresh of a German Social Democratic Party and Communist Party calling each other the main enemy until both were destroyed. The French left read the Concorde as a dress rehearsal for a French fascism, and acted on that reading. The distinction between what happened and what was believed to be at stake is the key to everything that followed.

## 12 February: two columns meet

On 9 February a demonstration called by the French Communist Party fought the police around the Place de la République, and nine people were killed. Three days later, on 12 February, the CGT called a 24-hour general strike in defence of the republic, and the breakaway Communist-led CGTU and the party joined it under their own banners. Strikes and meetings were held across the country. In Paris the Socialist and Communist columns marched toward the Place de la Nation by separate routes, and nobody could promise what would happen where they met: for six years they had called each other 'social fascists' and 'splitters'. The columns did not clash. The workers embraced, shouting 'Unity!'.

That scene became the ground of French left politics for months afterward. The decision did not come from the parties and move the base; the base tied the parties' hands. Jacques Doriot, mayor of Saint-Denis and a member of the Communist leadership, demanded joint action with the Socialists publicly from February, refused a summons to Moscow, and was expelled on 27 June. That he would go on to found the fascist Parti Populaire Français is the standing irony of the period. The one who carried the same demand out in the party's name was Maurice Thorez, who had expelled him.

## How Moscow came to change the line

Since the Sixth Comintern Congress of 1928, official policy had been the theory of social fascism, which cast social democracy as the moderate wing of fascism. What that had produced in Germany was plain by 1933, yet the Comintern kept the line, reading Hitler's rise as the harbinger of capitalism's collapse.

The man of the turn was Georgi Dimitrov. Tried at Leipzig for the Reichstag fire, he had cross-examined Göring from the dock and won an acquittal; three weeks after the night on the Concorde, on 27 February 1934, he arrived in Moscow. From that spring he began writing notes questioning whether a line that treated social-democratic workers as the main enemy could be right, and France supplied the concrete evidence for the question. The decision was not his. The line moved only once Stalin approved it, and that approval carried the needs of Soviet diplomacy with it: against the German threat the USSR needed France, and no such alliance was possible while the French Communists worked to bring French governments down.

On 27 July the Socialists and Communists signed their pact of unity of action. At Nantes in October, Thorez first proposed the name, a 'popular front of labour, liberty and peace', and proposed widening the alliance to the Radicals. The Franco-Soviet treaty of mutual assistance was signed in May 1935, and at the Seventh Comintern Congress, held from 25 July to 20 August 1935, Dimitrov's report of 2 August made the turn the official line of the world communist movement. Its definition of fascism became the movement's standard formula for the next half century: 'Fascism in power is the open terrorist dictatorship of the most reactionary, most chauvinistic and most imperialist elements of finance capital.' By defining fascism as the rule of a particular faction of the ruling class rather than as another name for capitalism in general, the formula made an alliance with the remaining bourgeois forces theoretically possible. The door that social fascism had held shut opened exactly there.

## Two memories

In France, 6 February survived as two memories. For the left it was the starting point of the Popular Front: a line runs from the junction of 12 February to the oath of the Rassemblement populaire sworn by half a million people on 14 July 1935, and on to the election of May 1936 and Blum's government. Paid holidays and the 40-hour week stand at the end of that line.

For the right it was a day of martyrs. The fifteen dead were honoured as 'patriots shot down by the republic', and commemorations were held on the Concorde every year. After the defeat of 1940 a striking number of Vichy's men described that night as the origin of their politics. One event became the starting point of an antifascist alliance for one side and the case for ending the parliamentary republic for the other.

The historiographical argument is about the direction of causation: did the turn rise from the streets of Paris, or descend from the needs of Soviet foreign policy? Work done since the Comintern archives opened tends to point at the place where the two met. The French section moved first, under pressure from below and before Moscow's permission arrived; Moscow ratified the movement late and shaped it to its own diplomatic needs. Neither force alone would have changed the line.$t$,
  $j$[
    {"date": "1933.12", "title": {"ko": "스타비스키 사건이 터지다", "en": "The Stavisky affair breaks"},
     "body": {"ko": "바욘 시립 전당포를 통한 알렉상드르 스타비스키의 채권 사기가 드러나고, 급진당 정치인들과의 인맥이 함께 알려졌다.", "en": "Alexandre Stavisky's bond fraud through the municipal pawnshop of Bayonne is exposed, along with his connections among Radical politicians."}},
    {"date": "1934.01.08", "title": {"ko": "스타비스키의 죽음", "en": "Stavisky's death"},
     "body": {"ko": "샤모니의 산장에서 총상을 입은 채 발견되었다. 경찰은 자살로 발표했고 우파 신문은 입막음 살해라고 썼다.", "en": "He is found shot in a chalet at Chamonix. The police call it suicide; the right-wing press calls it a silencing."}},
    {"date": "1934.01.27", "title": {"ko": "쇼탕 내각 붕괴", "en": "The Chautemps cabinet falls"},
     "body": {"ko": "추문에 몰린 카미유 쇼탕이 사임했다. 두 해 사이 다섯 번째 내각 교체였다.", "en": "Camille Chautemps resigns under the pressure of the scandal, the fifth change of cabinet in two years."}},
    {"date": "1934.01.30", "title": {"ko": "달라디에 내각 성립", "en": "Daladier forms a government"},
     "body": {"ko": "급진당의 에두아르 달라디에가 정부를 세우고 거리의 동맹들에 맞서겠다고 밝혔다.", "en": "Édouard Daladier of the Radical Party forms a government and promises to face down the leagues."}},
    {"date": "1934.02.03", "title": {"ko": "경찰청장 시아프 경질", "en": "Prefect Chiappe removed"},
     "body": {"ko": "동맹들에게 관대하다는 평을 듣던 파리 경찰청장 장 시아프가 물러났다. 우파는 이것을 도발로 받아들였다.", "en": "Jean Chiappe, the Paris prefect of police thought indulgent toward the leagues, is removed. The right takes it as a provocation."}},
    {"date": "1934.02.06", "title": {"ko": "콩코르드 광장의 폭동", "en": "Riot on the Place de la Concorde"},
     "body": {"ko": "극우 동맹들과 참전군인 단체가 하원 의사당을 향해 밀어붙이고, 다리를 막아선 경찰이 발포해 15명이 죽고 1,500명 넘게 다쳤다.", "en": "The leagues and veterans' associations push toward the Chamber of Deputies; police holding the bridge open fire, killing fifteen and injuring more than 1,500."}},
    {"date": "1934.02.07", "title": {"ko": "달라디에 사임", "en": "Daladier resigns"},
     "body": {"ko": "의회 신임을 얻고도 사임했다. 제3공화국에서 다수를 쥔 정부가 거리에 밀려 물러난 첫 사례였다. 후임 두메르그 거국내각에는 페탱이 국방장관으로 들어갔다.", "en": "He resigns despite holding his majority, the first government of the Third Republic pushed out by the street. Doumergue's government of national union brings in Pétain as minister of war."}},
    {"date": "1934.02.09", "title": {"ko": "공산당 시위와 두 번째 유혈", "en": "The Communist demonstration and a second bloodletting"},
     "body": {"ko": "프랑스공산당이 부른 시위가 레퓌블리크 광장 일대에서 경찰과 충돌해 9명이 죽었다.", "en": "A demonstration called by the French Communist Party fights the police around the Place de la République; nine are killed."}},
    {"date": "1934.02.12", "title": {"ko": "총파업과 나시옹 광장의 합류", "en": "General strike and the junction at the Nation"},
     "body": {"ko": "CGT의 24시간 총파업 날, 따로 행진하던 사회당과 공산당 대열이 나시옹 광장에서 만나 「단결!」을 외쳤다. 여섯 해의 적대가 기층에서 먼저 무너졌다.", "en": "On the day of the CGT's 24-hour general strike, the separately marching Socialist and Communist columns meet at the Place de la Nation shouting 'Unity!'. Six years of hostility break at the base first."}},
    {"date": "1934.02.27", "title": {"ko": "디미트로프 모스크바 도착", "en": "Dimitrov arrives in Moscow"},
     "body": {"ko": "라이프치히 재판에서 무죄를 받아 낸 게오르기 디미트로프가 소련에 도착했다. 그해 봄부터 사회파시즘 노선을 문제 삼는 메모를 쓰기 시작한다.", "en": "Georgi Dimitrov, acquitted at the Leipzig trial, arrives in the USSR. From that spring he begins writing notes challenging the social-fascism line."}},
    {"date": "1934.06.27", "title": {"ko": "도리오 제명", "en": "Doriot expelled"},
     "body": {"ko": "사회당과의 공동행동을 가장 먼저 공개로 요구했던 자크 도리오가 모스크바 소환을 거부해 공산당에서 제명되었다. 두 해 뒤 그는 파시스트 정당을 세운다.", "en": "Jacques Doriot, the first to demand joint action with the Socialists publicly, is expelled after refusing a summons to Moscow. Two years later he founds a fascist party."}},
    {"date": "1934.07.27", "title": {"ko": "사회당-공산당 통일행동협정", "en": "The Socialist-Communist pact of unity of action"},
     "body": {"ko": "두 당이 서로에 대한 공격을 멈추고 파시즘에 함께 맞서기로 서명했다. 10월 낭트에서 토레즈가 「인민전선」이라는 이름을 내놓는다.", "en": "The two parties sign an agreement to stop attacking each other and to face fascism together. At Nantes in October, Thorez proposes the name 'popular front'."}},
    {"date": "1935.08.02", "title": {"ko": "코민테른 제7차 대회, 디미트로프의 보고", "en": "Dimitrov's report to the Seventh Comintern Congress"},
     "body": {"ko": "디미트로프가 파시즘을 「금융자본의 가장 반동적인 분자들의 공공연한 테러 독재」로 정의하고 반파시즘 인민전선을 세계 공산주의 운동의 공식 노선으로 만들었다.", "en": "Dimitrov defines fascism as 'the open terrorist dictatorship of the most reactionary elements of finance capital' and makes the antifascist popular front the official line of the world communist movement."}}
  ]$j$::jsonb,
  $j$[
    "Serge Berstein, Le 6 février 1934 (Gallimard/Julliard, 1975)",
    "Julian Jackson, The Popular Front in France: Defending Democracy, 1934-38 (Cambridge University Press, 1988)",
    "Brian Jenkins (ed.), France in the Era of Fascism: Essays on the French Authoritarian Right (Berghahn Books, 2005)",
    "Kevin McDermott and Jeremy Agnew, The Comintern: A History of International Communism from Lenin to Stalin (Macmillan, 1996)",
    "Georgi Dimitrov, The Fascist Offensive and the Tasks of the Communist International (report to the Seventh World Congress, 2 August 1935)",
    "Georgi Dimitrov, Diary 1933-1949, ed. Ivo Banac (Yale University Press, 2003)",
    "Jessica Wardhaugh, In Pursuit of the People: Political Culture in France, 1934-39 (Palgrave Macmillan, 2009)"
  ]$j$::jsonb
);

INSERT INTO commulingo_history_event_people
  (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en) VALUES
  ('february-1934-crisis', 'edouard-daladier', 0, 'leader',
   '2월 6일의 총리', 'Prime minister on 6 February',
   '동맹들에 맞서겠다며 경찰청장 시아프를 경질했고, 폭동 이튿날 의회 다수를 쥐고도 사임해 제3공화국에서 거리에 밀려 물러난 첫 총리가 되었다.',
   'He removed Prefect Chiappe promising to face down the leagues, then resigned the day after the riot although he held his majority: the first premier of the Third Republic pushed out by the street.'),
  ('february-1934-crisis', 'maurice-thorez', 1, 'leader',
   'PCF 서기장', 'General secretary of the PCF',
   '2월까지도 사회당과의 협력을 거부하던 노선에서 다섯 달 만에 통일행동협정으로 돌아섰고, 10월 낭트에서 「인민전선」이라는 이름을 처음 내놓았다.',
   'Still refusing cooperation with the Socialists in February, within five months he signed the pact of unity of action, and at Nantes in October he first proposed the name "popular front".'),
  ('february-1934-crisis', 'dimitrov', 2, 'leader',
   '코민테른 노선 전환의 인물', 'The man of the Comintern''s turn',
   '폭동 3주 뒤 모스크바에 도착해 사회파시즘 노선의 재검토를 시작했고, 1935년 8월 제7차 대회 보고에서 파시즘을 금융자본의 가장 반동적인 분자들의 테러 독재로 정의하며 인민전선을 공식 노선으로 만들었다.',
   'He reached Moscow three weeks after the riot and began reopening the social-fascism line; his report to the Seventh Congress in August 1935 defined fascism as the terrorist dictatorship of the most reactionary elements of finance capital and made the popular front official policy.'),
  ('february-1934-crisis', 'stalin', 3, 'participant',
   '노선 전환의 최종 결재자', 'Whose approval the turn required',
   '프랑스 지부가 먼저 움직인 뒤에야 노선 변경을 재가했다. 독일에 맞선 프랑스와의 동맹이라는 소련 외교의 필요가 그 재가에 얹혀 있었다.',
   'He sanctioned the change of line only after the French section had already moved, and the sanction carried the Soviet diplomatic need for a French alliance against Germany.'),
  ('february-1934-crisis', 'manuilsky', 4, 'participant',
   '코민테른 집행위 서기', 'Secretary of the Comintern executive',
   '프랑스 지부의 통일행동 요구를 모스크바에서 다루며 노선 전환의 실무를 관리했다.',
   'He handled the French section''s demand for unity of action in Moscow and managed the practical side of the turn.'),
  ('february-1934-crisis', 'togliatti', 5, 'participant',
   '제7차 대회 전쟁 문제 보고자', 'Reporter on the war question at the Seventh Congress',
   '디미트로프의 보고와 짝을 이루는 제국주의 전쟁 준비에 관한 보고를 맡아 새 노선을 이론적으로 뒷받침했다.',
   'His report on the preparation of imperialist war was the companion to Dimitrov''s and gave the new line its second theoretical pillar.'),
  ('february-1934-crisis', 'leon-blum', 6, 'participant',
   'SFIO 지도자', 'Leader of the SFIO',
   '2월 12일 총파업에 사회당을 이끌고 참여했다. 두 해 뒤 그 합류의 끝에서 인민전선 정부의 총리가 된다.',
   'He led the Socialists into the general strike of 12 February; two years later, at the end of that convergence, he headed the Popular Front government.'),
  ('february-1934-crisis', 'leon-jouhaux', 7, 'leader',
   'CGT 사무총장, 2월 12일 총파업 소집자', 'CGT general secretary, who called the strike of 12 February',
   '정치 파업을 꺼려 온 CGT를 움직여 공화국 방어를 내걸고 24시간 총파업을 불렀고, 이 파업이 두 노동총동맹의 재통합으로 이어졌다.',
   'He moved a CGT long wary of political strikes to call a 24-hour general strike in defence of the republic, which opened the way to the reunification of the two labour confederations.'),
  ('february-1934-crisis', 'litvinov', 8, 'participant',
   '집단안보 노선의 소련 외무인민위원', 'Soviet foreign commissar of the collective-security line',
   '프랑스와의 접근을 추진한 집단안보 외교가 인민전선 노선의 외교적 짝이었다. 1935년 5월 프랑스-소련 상호원조조약으로 이어졌다.',
   'The collective-security diplomacy he pursued toward France was the foreign-policy counterpart of the popular front line, and led to the Franco-Soviet treaty of mutual assistance in May 1935.'),
  ('february-1934-crisis', 'trotsky', 9, 'opponent',
   '노선의 비판자', 'Critic of the line',
   '1934년 『프랑스는 어디로 가는가』에서 2월의 위기를 혁명적 위기로 읽고, 노동자 민병과 자체 권력기관을 세우라고 주장했다. 급진당까지 끌어안는 연합은 노동자를 부르주아 정치에 묶어 둘 뿐이라고 보았다.',
   'In Whither France? (1934) he read the February crisis as a revolutionary one and argued for workers'' militias and organs of workers'' power, holding that an alliance stretched to the Radicals could only tie the workers to bourgeois politics.');

INSERT INTO commulingo_term_events (term_id, event_id, sort_order) VALUES
  ('popular-front', 'february-1934-crisis', 0),
  ('social-fascism', 'february-1934-crisis', 1),
  ('comintern', 'february-1934-crisis', 2),
  ('collective-security', 'february-1934-crisis', 3);

COMMIT;
