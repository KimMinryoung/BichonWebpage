// The Soviet occupation and annexation of the Baltic states and the June 1941
// deportation, September 1939 – June 1941 (Baltic 1940–1953 batch, 2026-10-02).
// Exports { event, people, terms } built with ./lib.js; person cards live in
// ./people-1940.js. Paired by the owner as the same subject as the existing term
// 'the-annexation-of-the-baltic-states-1940' (발트 병합 (1940)), so no term
// about the annexation itself is created here.
const { W, P, event: buildEvent, term } = require('./lib');

const E = t => W(encodeURI(t));
const ET = t => 'https://et.wikipedia.org/wiki/' + encodeURI(t);
const LV = t => 'https://lv.wikipedia.org/wiki/' + encodeURI(t);
const LT = t => 'https://lt.wikipedia.org/wiki/' + encodeURI(t);
const RU = t => 'https://ru.wikipedia.org/wiki/' + encodeURI(t);
const S = {
    occ: E('Occupation_of_the_Baltic_states'),
    occ40: E('Soviet_occupation_of_the_Baltic_states_(1940)'),
    estTreaty: E('Soviet–Estonian_Mutual_Assistance_Treaty'),
    latTreaty: E('Soviet–Latvian_Mutual_Assistance_Treaty'),
    litTreaty: E('Soviet–Lithuanian_Mutual_Assistance_Treaty'),
    ultimatum: E('Soviet_ultimatum_to_Lithuania'),
    estWW2: E('Estonia_in_World_War_II'),
    latSSR: E('Latvian_Soviet_Socialist_Republic'),
    estSSR: E('Estonian_Soviet_Socialist_Republic'),
    masl: E('Masļenki_border_incident'),
    estElec: E('1940_Estonian_parliamentary_election'),
    latElec: E('1940_Latvian_parliamentary_election'),
    parl: E("People's_Parliament"),
    seimas: E("People's_Seimas"),
    pats: E('Konstantin_Päts'),
    ulmanis: E('Kārlis_Ulmanis'),
    smetona: E('Antanas_Smetona'),
    laidoner: E('Johan_Laidoner'),
    merkys: E('Antanas_Merkys'),
    munters: E('Vilhelms_Munters'),
    vares: E('Johannes_Vares'),
    kirh: E('Augusts_Kirhenšteins'),
    ltKreve: LT('Vincas_Krėvė-Mickevičius'),
    uluots: E('Jüri_Uluots'),
    dekanozov: E('Vladimir_Dekanozov'),
    vyshinsky: E('Andrey_Vyshinsky'),
    zhdanov: E('Andrei_Zhdanov'),
    welles: E('Welles_Declaration'),
    wellesP: E('Sumner_Welles'),
    serov: E('Serov_Instructions'),
    serovP: E('Ivan_Serov'),
    june: E('June_deportation'),
    depEst: E('Soviet_deportations_from_Estonia'),
    depLit: E('Soviet_deportations_from_Lithuania'),
    etJune: ET('Juuniküüditamine'),
    lvJune: LV('1941._gada_jūnija_deportācijas_Latvijā'),
    ruJune: RU('Июньская_депортация_1941_года'),
    ruAnnex: RU('Присоединение_Прибалтики_к_СССР'),
    junUpr: E('June_Uprising_in_Lithuania'),
    rainiai: E('Rainiai_massacre'),
    summer: E('Summer_War'),
};

const sections = [
    {
        heading: { ko: '비밀의정서와 기지 조약 (1939년 9–10월)', en: 'The secret protocol and the bases treaties (September–October 1939)' },
        paragraphs: [
            {
                ko: '1939년 8월 독소불가침조약의 비밀의정서는 에스토니아와 라트비아를 소련의 세력권에 넣었고, 처음에 독일 몫이던 리투아니아도 9월 28일의 독소 국경·우호 조약으로 대부분 소련 쪽에 넘어갔다. 9월 17일 폴란드를 침공한 소련은 이튿날 탈린에 억류되어 있던 폴란드 잠수함 오르젤이 빠져나가자 에스토니아의 중립을 문제 삼았다. 모스크바의 신문과 라디오가 에스토니아를 「적대적」이라고 몰아붙이고 붉은 해군 군함과 폭격기가 탈린 앞바다와 하늘에 나타난 가운데, 9월 24일 모스크바에 간 외무장관 카를 셀테르는 군사기지를 허용하는 상호원조조약을 요구받았다. 에스토니아 정부는 굴복했고, 9월 28일 셀테르와 뱌체슬라프 몰로토프가 조약에 서명했다. 조약은 두 나라의 주권과 정치·경제 체제를 건드리지 않는다고 적었지만, 소련은 에스토니아의 두 섬과 팔디스키 항에 해군·공군·육군 기지를 두고 유럽의 전쟁이 이어지는 동안 2만 5,000명을 주둔시킬 권리를 얻었다.',
                en: 'The secret protocol of the Nazi–Soviet Pact of August 1939 placed Estonia and Latvia in the Soviet sphere of influence, and Lithuania, first assigned to Germany, passed for the most part to the Soviet side under the German–Soviet Boundary and Friendship Treaty of 28 September. Having invaded Poland on 17 September, the Soviet Union questioned Estonia’s neutrality after the Polish submarine Orzeł escaped from internment in Tallinn the next day. While the Moscow press and radio attacked Estonia as “hostile” and Red Navy warships and bombers appeared off Tallinn and over it, Foreign Minister Karl Selter, in Moscow on 24 September, was presented with a demand for a mutual assistance treaty that would admit Soviet military bases. The Estonian government yielded, and on 28 September Selter and Vyacheslav Molotov signed the treaty. It declared that the sovereignty and the political and economic systems of both parties would not be affected, but it gave the Soviet Union naval, air and army bases on two Estonian islands and at the port of Paldiski and the right to station 25,000 troops for the duration of the European war.',
                sources: [S.estTreaty, S.occ40, S.estWW2],
            },
            {
                ko: '라트비아는 10월 5일 외무장관 빌헬름스 문테르스가, 리투아니아는 10월 10일 같은 조약에 서명했다. 10월 3일 모스크바에 온 리투아니아 외무장관 유오자스 우르브시스에게 이오시프 스탈린은 직접 독소 비밀의정서와 세력권 지도를 보여 주었다. 우르브시스가 소련군 기지는 사실상의 점령이라며 반대하자 스탈린은 「빌뉴스를 받든 말든 소련군은 어차피 리투아니아에 들어간다」고 말했다. 결국 리투아니아는 소련이 폴란드 침공으로 차지한 빌뉴스 지역의 약 5분의 1과 옛 수도 빌뉴스를 받는 대신 소련군 2만 명의 주둔을 받아들였고, 라트비아에는 3만 명이 배정되었다. 소련 선전은 이를 약소국에 대한 스탈린의 관대함으로 내세웠고 리투아니아 정치인들도 공개적으로는 「전통적인 소련–리투아니아 우호」를 칭송했지만, 거리에는 「빌뉴스는 우리 것, 리투아니아는 러시아 것」이라는 말이 돌았다.',
                en: 'Latvia signed a similar treaty on 5 October through its foreign minister Vilhelms Munters, and Lithuania on 10 October. When the Lithuanian foreign minister Juozas Urbšys came to Moscow on 3 October, Joseph Stalin personally told him about the secret protocols and showed him maps of the spheres of influence. When Urbšys objected that Soviet bases would mean a virtual occupation, Stalin replied: “No matter if you take Vilnius or not, Soviet troops will enter Lithuania anyway.” In the end Lithuania received about a fifth of the Vilnius Region, which the Soviets had taken in the invasion of Poland, including the historic capital Vilnius, in exchange for accepting 20,000 Soviet troops; Latvia was allotted 30,000. Soviet propaganda presented the treaty as proof of Stalin’s benevolence towards small nations, and Lithuanian politicians publicly praised the “traditional Soviet–Lithuanian friendship”, but in the street people said: “Vilnius is ours, but Lithuania is Russia’s.”',
                sources: [S.latTreaty, S.litTreaty, S.occ40, S.ultimatum],
            },
            {
                ko: '10월 28일 리투아니아군이 1920년 이후 처음으로 빌뉴스에 들어갔다. 소련군은 떠나기 전에 공장 설비와 병원 장비, 차량, 박물관과 도서관의 문화재를 실어 갔고, 10월 30일부터 11월 1일까지 빵값이 갑자기 오르자 지역 공산주의자와 폴란드인의 충돌이 유대인을 겨냥한 폭동으로 번졌다. 리투아니아 안의 소련군 기지는 알리투스, 프리에나이, 가이쥬나이, 나우요이빌니아 네 곳에 1만 8,786명으로 정해졌다. 에스토니아에서는 1만 2,000~1만 8,000명의 발트 독일인이 독일로 이주했다. 같은 요구를 거부한 핀란드와 11월 30일 겨울전쟁이 벌어졌을 때 발트 3국은 공식적으로 중립이었지만, 소련 폭격기는 에스토니아의 기지를 핀란드 폭격에 썼다. 그 뒤 몇 달 동안 소련은 발트 국가들의 내정에 간섭하지 않았고, 기지의 소련 병사들도 규율을 지켰다. 1940년 3월 29일에도 몰로토프는 최고소비에트에서 세 나라와의 상호원조조약 이행에 만족한다고 말했다.',
                en: 'On 28 October the Lithuanian Army entered Vilnius for the first time since 1920. Before handing over the city the Soviets carried off factory equipment, hospital equipment, vehicles and cultural objects from museums and libraries, and when the price of bread suddenly rose on 30 October – 1 November, clashes between local communists and Poles turned into a riot against the Jewish population. The Soviet bases in Lithuania were fixed at four sites — Alytus, Prienai, Gaižiūnai and Naujoji Vilnia — with 18,786 men. From Estonia some 12,000–18,000 Baltic Germans left for Germany. When Finland, which had rejected the same demands, was attacked on 30 November in the Winter War, the Baltic states were officially neutral, but Soviet bombers used bases in Estonia to bomb Finland. For some months afterwards the Soviets did not interfere in the Baltic states’ domestic affairs and the soldiers in the bases were well-behaved; as late as 29 March 1940 Molotov told the Supreme Soviet that he was satisfied with the execution of the mutual assistance treaties.',
                sources: [S.litTreaty, S.estWW2, S.occ40, S.ultimatum],
            },
        ],
    },
    {
        heading: { ko: '최후통첩 (1940년 5–6월)', en: 'The ultimatums (May–June 1940)' },
        paragraphs: [
            {
                ko: '독일이 서유럽에서 승리를 거듭하자 소련의 태도가 바뀌었다. 5월 16일 『이즈베스티야』는 거인들이 생존을 걸고 싸우는 동안 작은 나라가 중립을 지키려는 것은 순진하다고 썼고, 5월 25일 몰로토프는 리투아니아가 기지의 소련 병사 셋을 납치했다고 항의했다. 소련이 살해되었다고 주장한 병사 부타예프는 실제로는 부대를 탈영했다가 리투아니아 경찰에 발견되자 스스로 목숨을 끊은 사람이었고, 리투아니아 조사위원회의 자료 요청에 소련은 답하지 않았다. 6월 7일 몰로토프가 지목한 대로 총리 안타나스 메르키스가 모스크바에 갔지만 납치 혐의만 되풀이해 들었고, 9일에는 리투아니아가 라트비아·에스토니아와 발트 협상을 통해 비밀 군사동맹을 꾸며 조약을 어겼다는 비난까지 받았다. 안타나스 스메토나 대통령은 미하일 칼리닌에게 친서를 보내 리투아니아가 조약을 늘 지켜 왔다고 밝혔지만, 11일의 마지막 회담도 아무 결론 없이 끝났다.',
                en: 'As Germany won victory after victory in western Europe, the Soviet attitude changed. On 16 May Izvestia warned that it was naive for a small country to attempt neutrality while giants were fighting for survival, and on 25 May Molotov accused Lithuania of abducting three Soviet soldiers from the bases. The soldier Butayev, whom the Soviets claimed had been murdered, had in fact deserted his unit and killed himself when the Lithuanian police found him, and the Soviets left the Lithuanian commission’s requests for information unanswered. On 7 June Prime Minister Antanas Merkys, the only negotiator Molotov would accept, came to Moscow and heard the kidnapping charges repeated; on the 9th Lithuania was also accused of conspiring with Latvia and Estonia through the Baltic Entente to form a secret military union in violation of the treaty. President Antanas Smetona wrote to Mikhail Kalinin that Lithuania had always honoured the pact, but the last meeting on the 11th brought no resolution.',
                sources: [S.ultimatum],
            },
            {
                ko: '붉은 군대는 이미 공격을 준비하고 있었다. 6월 5일 발트 지역의 모든 소련군이 국방인민위원 세묜 티모셴코의 지휘 아래 들어갔고, 드미트리 파블로프 장군은 11일 리투아니아 공격 계획을 확정했다. 리투아니아 동쪽 국경에 모인 병력은 22만 1,260명에 항공기 1,140대, 전차 1,513대였고, 리투아니아군은 2만 8,005명이었다. 9일 티모셴코는 에스토니아와 라트비아의 함선을 나포하고 해안을 봉쇄하며 두 정부의 탈출을 막을 준비를 지시했고, 14일 에스토니아에 대한 해상 봉쇄가 시작되었다. 같은 날 소련 폭격기 두 대가 탈린에서 헬싱키로 가던 핀란드 여객기 칼레바를 격추해, 미국 공관들의 외교 행낭을 나르던 미국 외무직원 헨리 W. 앤사일 주니어가 숨졌다. 세계의 눈이 파리 함락에 쏠린 6월 14일 자정 직전, 몰로토프는 모스크바에서 우르브시스에게 최후통첩을 건넸다. 내무장관과 국가보안국장을 재판에 넘길 것, 상호원조조약을 더 잘 이행할 정부를 세울 것, 「충분히 많은」 소련군의 진입을 허용할 것, 그리고 이튿날 오전 10시까지 답할 것이었다.',
                en: 'The Red Army was already preparing to attack. On 5 June all Soviet forces in the Baltic region were placed under the People’s Commissar for Defence, Semyon Timoshenko, and on the 11th General Dmitry Pavlov finalised the plan of attack on Lithuania. The forces gathered on Lithuania’s eastern border numbered 221,260 men with 1,140 aircraft and 1,513 tanks, against a Lithuanian army of 28,005. On the 9th Timoshenko ordered preparations to seize the Estonian and Latvian vessels, blockade their coasts and prevent the evacuation of the two governments, and on the 14th the naval blockade of Estonia went into effect. The same day two Soviet bombers shot down the Finnish airliner Kaleva on its way from Tallinn to Helsinki, killing the American diplomatic employee Henry W. Antheil Jr., who was carrying diplomatic pouches from the American legations. Just before midnight on 14 June, while the world watched the fall of Paris, Molotov handed Urbšys the ultimatum in Moscow: the interior minister and the director of state security were to be put on trial, a government more capable of adhering to the mutual assistance pact was to be formed, a “sufficiently large” number of Soviet troops was to be allowed in, and an answer was due by 10 a.m. the next morning.',
                sources: [S.ultimatum, S.occ40, S.estWW2],
            },
            {
                ko: '리투아니아 정부는 밤새 회의를 열었다. 스메토나는 상징적인 무력 저항이라도 하자고 했지만, 메르키스와 군 지휘관들은 이미 소련군이 나라 안에 있고 동원도 되지 않은 상태에서 저항은 불가능하다고 보았고, 정부는 아침 7시 항의 없이 모든 요구를 받아들이기로 했다. 정오에 모스크바는 새 총리 후보를 거부하고 몰로토프의 차관 블라디미르 데카노조프가 새 정부 구성을 감독한다고 알려 왔다. 스메토나는 대통령 직무를 메르키스에게 맡기고 「내 손으로 리투아니아를 볼셰비키 나라로 만들고 싶지 않다」며 15일 저녁 키바르타이에서 국경 개울을 걸어서 건너 독일로 갔다. 같은 날 새벽 소련 NKVD 부대는 라트비아 동부 마슬렌키 등의 국경 초소를 습격해 국경수비대원 3명과 민간인 2명을 죽이고 37명을 끌고 갔다. 16일 라트비아와 에스토니아에 거의 같은 최후통첩이 전해졌다. 응답 시한은 여덟 시간(라트비아에는 여섯 시간이었다는 서술도 있다)뿐이었고, 리투아니아가 이미 소련군 손에 들어간 상황에서 두 나라도 요구를 받아들였다.',
                en: 'The Lithuanian government debated through the night. Smetona argued for military resistance, even if only symbolic, but Merkys and the commanders held that resistance was impossible with Soviet troops already in the country and the army unmobilised, and at 7 a.m. the government decided to accept all the demands without protest. At noon Moscow rejected the proposed new prime minister and announced that Molotov’s deputy Vladimir Dekanozov would supervise the formation of a new government. Smetona handed his duties to Merkys, saying “I do not want to make Lithuania a bolshevik country with my own hands”, and on the evening of the 15th waded across the border stream at Kybartai into Germany. At dawn that day Soviet NKVD troops attacked Latvian border posts in the east of the country, at Masļenki and elsewhere, killing three border guards and two civilians and carrying off 37 people. On the 16th almost identical ultimatums went to Latvia and Estonia, with only eight hours to reply (six for Latvia, by another account); with Lithuania already in Soviet hands, both accepted.',
                sources: [S.ultimatum, S.smetona, S.masl, S.latTreaty],
            },
        ],
    },
    {
        heading: { ko: '점령과 모스크바의 특사들 (1940년 6월)', en: 'Occupation and Moscow’s emissaries (June 1940)' },
        paragraphs: [
            {
                ko: '6월 15일 소련군이 리투아니아에, 16~17일 라트비아와 에스토니아에 들어갔다. 당시 『타임』 기사에 따르면 며칠 사이에 약 50만 명의 붉은 군대가 세 나라를 점령했고, 에스토니아에는 기지 밖에서 약 9만 명이 더 들어왔다. 리투아니아군은 저항하지 말고 친절하게 맞이하라는 명령을 받았고, 카를리스 울마니스는 라디오로 붉은 군대에 저항하지 말라고 명령하며 「나는 내 자리에 남을 테니 여러분도 여러분의 자리에 남으라」고 말했다. 에스토니아 군대와 방위연맹도 정부의 명령에 따라 무장을 해제당했다. 탈린 라우아 거리의 독립 통신대대만이 6월 21일 붉은 군대와 공산주의자 민병대 「인민자위대」에 맞서 몇 시간 동안 싸우다 협상 끝에 항복했고, 같은 날 탈린 성의 탑에 걸린 에스토니아 국기가 붉은 깃발로 바뀌었다. 세 나라의 점령은 소련군이 뒷받침한 공산주의자들의 쿠데타와 함께 진행되었다.',
                en: 'Soviet troops entered Lithuania on 15 June and Latvia and Estonia on the 16th–17th. According to a Time magazine article of the day, some 500,000 Red Army troops occupied the three countries within days, and about 90,000 more entered Estonia in addition to the garrisons. The Lithuanian Army was ordered not to resist and to extend friendly greetings, and Kārlis Ulmanis, in a nationwide radio address ordering no resistance, said: “I will remain in my place and you remain in yours.” The Estonian Defence Forces and Defence League were likewise disarmed on their government’s orders. Only the Independent Signal Battalion in Raua Street in Tallinn fought the Red Army and the communist “People’s Self-Defence” militia for several hours on 21 June before surrendering after negotiations; the same day the Estonian flag on the Pikk Hermann tower was replaced with a red flag. In each country the occupation coincided with a communist coup d’état supported by the Soviet troops.',
                sources: [S.occ40, S.estWW2, S.ultimatum, S.ulmanis],
            },
            {
                ko: '모스크바는 나라마다 특사를 보내 새 정권을 만들었다. 리투아니아에는 데카노조프가 6월 15일 카우나스에 도착해 소련 대사관에 자리를 잡았다. 안타나스 스니에치쿠스가 이끄는 리투아니아 공산당이 그의 손발이 되었고, 모스크바에서 온 소련 행정 전문가와 보안기관원들이 그를 도왔다. 라트비아에는 안드레이 비신스키가 6월부터 8월까지 머물며 친소 정부 수립과 소련 편입을 감독하고 라트비아 공산당에서 「트로츠키주의자와 부하린주의자」를 숙청했다. 에스토니아에는 레닌그라드 당 지도자로 발트해에서 소련의 입지를 넓히는 데 관심을 두었던 안드레이 즈다노프가 갔다. 몰로토프는 6월 18일 독일 대사 슐렌부르크에게 프랑스에서 거둔 독일의 승리를 「따뜻하게」 축하하며, 영국과 프랑스가 발트 국가들에서 독일과 소련 사이를 이간질하려던 음모를 끝내야 했다고 설명했다.',
                en: 'Moscow sent an emissary to each country to build the new regime. In Lithuania Dekanozov arrived in Kaunas on 15 June and installed himself in the Soviet embassy; the Communist Party of Lithuania, headed by Antanas Sniečkus, was at his disposal, and he was aided by specialists in Soviet administration and by security officers sent from Moscow. In Latvia Andrey Vyshinsky stayed from June to August to supervise the establishment of a pro-Soviet government and the country’s incorporation, and purged the Latvian Communist Party of “Trotskyists and Bukharinites”. Andrei Zhdanov, the Leningrad party chief who had an interest in enlarging the Soviet presence in the Baltic Sea, went to Estonia. On 18 June Molotov “warmly” congratulated the German ambassador Schulenburg on Germany’s success in France and explained that it had become necessary to put an end to the intrigues by which England and France had tried to sow discord between Germany and the Soviet Union in the Baltic states.',
                sources: [S.dekanozov, S.vyshinsky, S.zhdanov, S.occ, S.occ40],
            },
        ],
    },
    {
        heading: { ko: '세 개의 「인민정부」 (1940년 6–7월)', en: 'Three “people’s governments” (June–July 1940)' },
        paragraphs: [
            {
                ko: '리투아니아에서는 스메토나가 떠나자 메르키스가 대통령 직무를 맡았고, 이튿날 라디오로 스메토나를 해임하고 스스로 대통령이 되었다고 발표했다. 6월 17일 그는 소련의 요구대로 좌파 언론인 유스타스 팔레츠키스를 총리로 임명하고 물러났으며, 팔레츠키스가 대통령 직무까지 맡았다. 이른바 「인민정부」에는 소련 점령의 도구가 아니라 권위주의적인 스메토나 정권을 갈아 치운 정부로 보이도록 이름난 인사들이 들어갔다. 작가 빈차스 크레베미츠케비추스가 외무장관과 총리 직무를 맡았다. 스메토나 정권에 대한 반감이 컸던 탓에 일부 리투아니아인은 이를 독립의 상실보다 대통령 권력의 해체로 받아들였다. 리투아니아는 1990년 이후 스메토나가 사임한 적이 없으므로 메르키스의 권한 장악은 위헌이었고, 따라서 그 뒤 병합에 이르는 모든 조치가 무효라는 입장을 지킨다.',
                en: 'In Lithuania Merkys took over the presidential duties when Smetona left and announced on the radio the next day that he had removed Smetona and was now president in his own right. On 17 June, as the Soviets demanded, he appointed the left-wing journalist Justas Paleckis prime minister and resigned, leaving Paleckis acting president as well. The so-called People’s Government included well-known public figures so that it would look not like a tool of Soviet occupation but like a replacement for Smetona’s authoritarian regime; the writer Vincas Krėvė-Mickevičius became foreign minister and acting prime minister. Because opposition to Smetona had been strong, some Lithuanians took the change as the end of presidential rule rather than the loss of independence. Since 1990 Lithuania has maintained that Merkys’s takeover of the presidency was unconstitutional because Smetona never resigned, and that every subsequent step towards annexation was therefore void.',
                sources: [S.merkys, S.ultimatum, S.seimas, S.ltKreve],
            },
            {
                ko: '라트비아에서는 울마니스가 쿠데타 사흘 뒤 총리직을 내놓고, 사실은 소련 대사관이 정한 아우구스츠 키르헨슈테인스의 좌파 정부를 임명했다. 미생물학자인 키르헨슈테인스는 소련 대사관에 불려 가 새 정부의 수반 자리를 제안받았고, 작가 빌리스 라치스가 내무장관이 되었다. 울마니스는 그 뒤 한 달 동안 소련에 협조했다. 7월 14~15일 선거 전까지 라트비아에서는 소련식 정치 질서를 도입하거나 소련에 가입하겠다는 정부 계획이 공개적으로 언급되지 않았다.',
                en: 'In Latvia Ulmanis resigned as prime minister three days after the coup and appointed a left-wing government under Augusts Kirhenšteins, which had in truth been chosen by the Soviet embassy. Kirhenšteins, a microbiologist, had been invited to the embassy and offered the leadership of the new government, and the writer Vilis Lācis became interior minister. For the next month Ulmanis cooperated with the Soviets. Until the election of 14–15 July there was no public statement in Latvia about any government plan to introduce a Soviet political order or to join the Soviet Union.',
                sources: [S.ulmanis, S.kirh, S.latSSR, S.munters],
            },
            {
                ko: '에스토니아에서는 즈다노프가 6월 21일 콘스탄틴 페츠 대통령에게 의사이자 시인인 요하네스 바레스를 총리로 하는 괴뢰 정부를 임명하게 했다. 페츠는 자리를 지켰지만 그 자신이 꼭두각시가 되어 한 달 동안 새 정권이 내놓은 200개 가까운 법령에 서명했고, 그 가운데에는 조기 선거를 가능하게 한 선거법 개정도 있었다. 의회 상원인 국가평의회가 해산된 채 다시 소집되지 않았으므로 이 개정은 위헌이었다. 마지막 합헌 총리 위리 울루오츠의 정부는 지하로 들어갔고, 1944년 4월 비밀리에 모인 에스토니아 공화국 선거위원회는 바레스의 임명이 불법이었다고 선언했다.',
                en: 'In Estonia Zhdanov forced President Konstantin Päts on 21 June to appoint a puppet government under the doctor and poet Johannes Vares. Päts stayed in office but became effectively a puppet himself, signing nearly 200 decrees of the new regime over the following month, among them a change to the electoral law that allowed snap elections. Because the upper house, the National Council, had been dissolved and never reconvened, the change was unconstitutional. The government of Jüri Uluots, the last constitutional prime minister, went underground, and in April 1944 the Electoral Committee of the Republic of Estonia, meeting in secret, declared Vares’s appointment illegal.',
                sources: [S.pats, S.vares, S.uluots],
            },
        ],
    },
    {
        heading: { ko: '단일 명부 선거와 「가입 요청」 (1940년 7–8월)', en: 'Single-list elections and the “requests” to join (July–August 1940)' },
        paragraphs: [
            {
                ko: '세 정부는 기존 의회를 해산하고 7월 14~15일에 「인민의회」 선거를 치르기로 했다. 공산당 아닌 정당과 단체는 이미 모두 금지되었고, 지하에서 나온 공산당은 리투아니아 1,500명, 라트비아 500명, 에스토니아 133명에 지나지 않았다. 후보는 공산당이 만든 「근로인민연합」이 의석 하나에 한 명씩만 냈고, 그 상당수는 공산당원이 아니었다. 리투아니아에서는 선거 전 약 2,000명의 정치 활동가가 체포되었다. 투표한 사람은 여권에 도장을 받았고, 투표하지 않은 사람은 「인민의 적」으로 찍혀 뒷날의 박해를 각오해야 했다. 런던의 소련 대사관은 투표가 끝나기도 전에 결과를 발표했고, 라트비아의 결과는 투표 마감 24시간 전에 런던 신문에 실렸다.',
                en: 'The three governments dissolved the existing parliaments and called elections to “People’s Parliaments” for 14–15 July. All non-communist parties and organisations had already been outlawed, and the communist parties that came out of hiding had only 1,500 members in Lithuania, 500 in Latvia and 133 in Estonia. Only the communist-made Working People’s Leagues put up candidates, exactly one for each seat, many of them not party members. In Lithuania some 2,000 political activists were arrested before the vote. Those who voted had their passports stamped, while anyone who did not was branded an “enemy of the people” and could expect persecution later. The Soviet envoy in London released the results before the polls closed, and the Latvian results appeared in a London newspaper 24 hours before voting ended.',
                sources: [S.parl, S.seimas, S.latSSR],
            },
            {
                ko: '에스토니아에서는 사흘 만에 야당이 80개 선거구 가운데 66곳에 후보 78명을 냈지만, 즈다노프가 바레스에게 야당 후보를 명부에서 빼라고 명령했고 거의 모두가 협박과 폭력, 무효 처리로 사라졌다. 남은 야당 후보 한 사람도 뒤에 체포되었다. 공식 발표로 근로인민연합은 80석을 모두 차지했는데, 독일 점령기에 다시 집계해 보니 투표율은 80.1%, 득표율은 91.6%였고 선거위원회가 3만 5,119표를 위조한 증거가 나왔다. 라트비아에서는 금지된 정당들의 「민주 블록」이 명부에 오르려 했지만 사무실이 폐쇄되고 지도자들이 체포되었다. 리투아니아의 공식 결과는 투표율 95.51%, 찬성 99.19%였다. 공식 발표된 세 나라의 득표율은 92.2~99.2%였다.',
                en: 'In Estonia the opposition, with only three days to organise, put up 78 candidates in 66 of the 80 constituencies, but Zhdanov ordered Vares to remove them from the ballot, and almost all were eliminated by threats, violence and invalidations; the one who remained, Jüri Rajur-Liivak, was later arrested. Officially the Working People’s Union won all 80 seats, but a re-examination during the German occupation found a turnout of 80.1% and a vote share of 91.6%, with evidence that the election committee had forged 35,119 votes. In Latvia the “Democratic Bloc” of the banned parties tried to get on the ballot, but its office was closed and its leaders arrested. Lithuania’s official result was a turnout of 95.51% with 99.19% for the official list. Across the three states the Soviet-sponsored slates were reported at between 92.2% and 99.2%.',
                sources: [S.estElec, S.latElec, S.latSSR, S.ultimatum, S.welles],
            },
            {
                ko: '세 인민의회는 7월 21일 일제히 열려 토론도 없이 만장일치로 자국을 소비에트 사회주의 공화국으로 선포하고 소련 가입을 청원했다. 초기 회의들에서는 대기업과 부동산, 토지의 국유화도 결의했다. 크레베미츠케비추스는 7월 1일 밤 모스크바에서 몰로토프로부터 발트 국가들이 모두 소련에 들어가야 한다는 말을 듣고 돌아와 사임서를 썼다. 7월 21일 울마니스는 대통령직에서 밀려났고 키르헨슈테인스가 그 직무를 맡았다. 페츠는 같은 날 아들을 탈린의 미국 공사관에 보내 망명을 청했으나, 사임 날짜조차 21~23일로 기록이 엇갈리는 가운데 바레스가 대통령 권한을 넘겨받았다. 전 정권의 지도자들은 곧바로 사라졌다. 외무장관 문테르스 가족은 7월 16일 내무장관 빌리스 라치스가 지켜보는 가운데 추방되었고, 메르키스는 스웨덴으로 탈출하려다 리가에서 붙잡혔다. 요한 라이도네르 총사령관 부부는 7월 19일 펜자로, 페츠 일가는 30일 우파로, 울마니스는 스타브로폴로 보내졌다.',
                en: 'The three People’s Parliaments met together on 21 July and, without discussion and unanimously, proclaimed their countries Soviet socialist republics and petitioned to join the Soviet Union; their early sessions also resolved to nationalise larger enterprises, real estate and land. Krėvė-Mickevičius had already been told by Molotov in Moscow on the night of 1 July that all the Baltic states had to join the Soviet Union, and on his return he wrote his resignation. On 21 July Ulmanis was forced out of the presidency and Kirhenšteins took over its duties. The same day Päts sent his son to the US legation in Tallinn to ask for asylum, but — with the date of his resignation recorded variously as the 21st to the 23rd — Vares took over the president’s powers. The leaders of the old order disappeared at once: the family of the foreign minister Munters was deported on 16 July in the presence of the interior minister Vilis Lācis; Merkys was arrested in Riga trying to escape to Sweden; the commander-in-chief Johan Laidoner and his wife were sent to Penza on 19 July, the Päts family to Ufa on the 30th and Ulmanis to Stavropol.',
                sources: [S.parl, S.ltKreve, S.ulmanis, S.pats, S.munters, S.merkys, S.laidoner],
            },
            {
                ko: '8월 1일 세 나라 대표단이 모스크바의 소련 최고소비에트에 청원을 냈고, 리투아니아가 3일, 라트비아가 5일, 에스토니아가 6일에 받아들여졌다. 에스토니아 대표단은 바레스가 이끌었다. 인민의회들은 이름을 각 공화국의 최고소비에트로 바꾸었고, 리투아니아 인민의회는 8월 25일 1936년 소련 헌법을 본뜬 새 헌법을 채택했다. 바레스와 키르헨슈테인스는 각각 에스토니아와 라트비아 최고소비에트 상임간부회 의장이 되었다. 공식 소련 서사는 세 나라가 동시에 사회주의 혁명을 일으켜 자발적으로 가입을 요청했다는 것이었다. 그러나 라트비아 헌법은 국가 체제의 근본 변경에 유권자 3분의 2가 찬성하는 국민투표를 요구했고, 에스토니아에서는 상원 없이 하원만 선출되었다. 세 나라는 1990~1991년 독립을 회복하면서 이런 근거로 병합 절차 전체가 무효였다는 입장을 세웠다.',
                en: 'On 1 August the three delegations presented their petitions to the Supreme Soviet in Moscow, which admitted Lithuania on the 3rd, Latvia on the 5th and Estonia on the 6th; the Estonian delegation was headed by Vares. The People’s Parliaments renamed themselves the Supreme Soviets of their republics, and on 25 August the Lithuanian one adopted a new constitution closely copied from the Soviet Constitution of 1936. Vares and Kirhenšteins became chairmen of the presidiums of the Estonian and Latvian Supreme Soviets. The official Soviet narrative held that the three states had simultaneously carried out socialist revolutions and voluntarily requested to join. But the Latvian constitution required a plebiscite approved by two-thirds of the electorate for any change to the basic order of the state, and in Estonia only the lower house had been elected, without an upper house; on such grounds the three states, restoring their independence in 1990–1991, held the whole annexation to be void.',
                sources: [S.parl, S.seimas, S.vares, S.kirh, S.occ40, S.latElec, S.estElec],
            },
        ],
    },
    {
        heading: { ko: '웰스 선언과 불승인', en: 'The Welles Declaration and non-recognition' },
        paragraphs: [
            {
                ko: '미국은 7월 15일 행정명령을 고쳐 발트 3국의 자산을 동결하고 이들을 독일 점령국들과 같은 범주에 넣었다. 7월 23일 국무장관 대행 섬너 웰스는 소련의 발트 3국 점령을 규탄하고 병합을 승인하지 않는다는 성명을 발표했다. 국무부 유럽 담당 관리들이 처음 쓴 초안을 웰스는 너무 약하다며 그 자리에서 프랭클린 D. 루스벨트 대통령에게 전화로 읽어 주었고, 두 사람은 문안을 더 강하게 고쳤다. 웰스 선언은 무력에 의한 영토 변경을 인정하지 않는 1932년 스팀슨 독트린을 적용한 것으로, 미국은 발트 국가들의 공사들을 계속 주권국 정부의 사절로 인정했다. 『뉴욕 타임스』는 이를 「여러 해 만에 국무부가 낸 가장 이례적인 외교 문서 가운데 하나」라고 했다. 하루 전 웰스는 페츠 일가에게 외교 비자를 내주도록 허가했지만, 페츠는 끝내 떠나지 못했다.',
                en: 'On 15 July the United States amended an executive order to freeze the Baltic states’ assets, grouping them with the German-occupied countries, and on 23 July the acting Secretary of State, Sumner Welles, issued a statement condemning the Soviet occupation of the three Baltic countries and refusing to recognise their annexation. Finding the first draft by State Department officials too weak, Welles read it to President Franklin D. Roosevelt over the telephone, and the two strengthened it. The Welles Declaration applied the Stimson Doctrine of 1932, which refused to recognise territorial changes made by force, and Welles announced that the United States would continue to recognise the Baltic envoys as representatives of sovereign governments; The New York Times called it “one of the most exceptional diplomatic documents issued by the Department of State in many years.” The day before, Welles had authorised diplomatic visas for the Päts family, but Päts never got away.',
                sources: [S.welles, S.wellesP, S.pats],
            },
            {
                ko: '선언은 뒤에 미국·영국·소련 동맹 안에서 마찰의 원인이 되었지만, 웰스는 소련이 침략 행위에 「합법성의 냄새」를 입히려 했다며 이를 끝까지 옹호했다. 1942년 그는 병합을 지지한 국민투표를 「조작된」 것이라고 부르고 싶었다고 적었고, 병합이 「모든 도덕적 관점에서 변호할 수 없을 뿐 아니라 놀랄 만큼 어리석다」고 썼다. 미국은 소련과 군사적으로 맞서지 않았지만, 선언 덕분에 발트 국가들은 독립된 외교 공관을 유지했고 행정명령 8484가 그들의 금융 자산을 보호했다. 에스토니아 해외에 있던 선박 42척의 선원들은 귀국을 거부했고, 이 배들은 영국에 징발되어 대서양 호송선단에 쓰였다. 불승인은 이후의 모든 미국 대통령과 의회 결의가 이어받아 반세기 동안 유지되었다.',
                en: 'The declaration later became a point of contention within the alliance of the Americans, the British and the Soviets, but Welles persistently defended it, saying the Soviets had manoeuvred to give “an odor of legality to acts of aggression for purposes of the record.” In 1942 he wrote that he would have preferred to call the plebiscites supporting the annexations “faked”, and that the annexation was “not only indefensible from every moral standpoint, but likewise extraordinarily stupid.” The United States did not confront the Soviet Union militarily, but the declaration enabled the Baltic states to maintain independent diplomatic missions, and Executive Order 8484 protected their financial assets. The crews of 42 Estonian ships in foreign waters refused to return home; the ships were requisitioned by the British and used in Atlantic convoys. The non-recognition, supported by every later US president and by congressional resolutions, lasted five decades.',
                sources: [S.welles, S.estWW2],
            },
        ],
    },
    {
        heading: { ko: '소비에트화와 체포 (1940–1941)', en: 'Sovietisation and arrests (1940–1941)' },
        paragraphs: [
            {
                ko: '새 정권은 곧바로 경제를 소련식으로 바꾸었다. 에스토니아에서는 7월 23일 모든 토지와 은행, 큰 산업 기업이 국유화되었고, 큰 기업 대부분과 주택의 절반이 국가 소유가 되었으며 크론을 루블로 바꾸는 인위적으로 낮은 환율로 저축이 사라졌다. 리투아니아에서는 모든 은행과 1,000리타스가 넘는 예금, 170제곱미터가 넘는 부동산, 노동자 20명 이상의 기업이 국유화되었고, 토지는 모두 국유화된 뒤 큰 농장을 30헥타르로 줄여 남는 약 57만 5,000헥타르를 소농에게 나눠 주었다. 리타스는 실제 가치의 3분의 1~4분의 1로 평가 절하된 끝에 1941년 3월까지 회수되었다. 집단화는 곧바로 하지 않았지만 농업 세금이 50~200% 올랐다. 라트비아에서도 1940년에는 집단화 소문을 공식 부인하며 땅 없는 농민 5만 2,000명에게 10헥타르까지의 작은 땅을 주었으나, 1941년 초부터 집단화 준비가 시작되었다.',
                en: 'The new regimes immediately remade the economy on the Soviet model. In Estonia all land, banks and major industrial enterprises were nationalised on 23 July; most larger businesses and half of the housing became state property, and savings were destroyed by an artificially low exchange rate from the kroon to the rouble. In Lithuania all banks, deposits over 1,000 litas, real estate over 170 square metres and enterprises with more than 20 workers were nationalised; all land was nationalised, the largest farms were cut to 30 hectares and some 575,000 hectares were distributed to small farmers. The litas, depreciated to a third or a quarter of its actual value, was withdrawn by March 1941. Collectivisation was not introduced at once, but farm taxes were raised by 50–200%. In Latvia, too, rumours of collectivisation were officially denied in 1940 and 52,000 landless peasants received small plots of up to 10 hectares, but preparations for collectivisation began in early 1941.',
                sources: [S.estSSR, S.estWW2, S.ultimatum, S.latSSR],
            },
            {
                ko: '사회와 정치 조직도 해체되었다. 리투아니아에서는 7월 1일 모든 문화·종교 단체가 폐쇄되고 공산당과 그 청년 조직만이 합법 정치 조직으로 남았다. 라트비아에서는 8월 7일 모든 인쇄 매체와 인쇄소가 국유화되었고, 11월부터 모두 4,000종의 책이 금지되어 회수되었다. 소련 헌법과 러시아에서 옮겨 온 형법이 도입되었고, 1941년 1월에는 소련 최고소비에트 선거가 치러졌다. 세 나라의 공산당은 1940년 10월 전연방공산당(볼셰비키)의 지부가 되었다. 라트비아에 남아 있던 발트 독일인과 그렇다고 주장할 수 있는 사람들은 이 무렵 독일로 떠났다.',
                en: 'Social and political organisations were dismantled. In Lithuania all cultural and religious organisations were closed on 1 July, leaving the Communist Party and its youth branch as the only legitimate political bodies. In Latvia all print media and printing houses were nationalised on 7 August, and from November a total of 4,000 titles were banned and removed from circulation. The Soviet constitution and a criminal code copied from Russia were introduced, and elections to the Supreme Soviet of the Soviet Union followed in January 1941. The three communist parties became branches of the All-Union Communist Party (Bolsheviks) in October 1940. The remaining Baltic Germans in Latvia, and anyone who could claim to be one, left for Germany in these months.',
                sources: [S.ultimatum, S.latSSR, S.ruAnnex, S.vares],
            },
            {
                ko: '체포는 병합 전부터 시작되었다. 에스토니아에서는 점령 첫해에 주요 정치인과 장교 대부분을 포함해 8,000명 넘게 체포되었고, 장교 약 800명이 체포되어 그 절반가량이 처형되거나 수용소에서 굶어 죽었다. 리투아니아에서는 병합 뒤 한 해 동안 약 1만 2,000명이 「인민의 적」으로 투옥되었다. 라트비아에서는 울마니스와 전쟁장관 발로디스, 군 총사령관 베르키스가 1940년 7월 체포되었고, 라트비아로 피신해 있던 백계 러시아인 대부분도 NKVD에 붙잡혔다. 숙청은 괴뢰 정부까지 미쳐 복지장관 율리스 라치스가 체포되었다. NKVD는 1940년 늦여름부터 「반소비에트 분자」를 등록했는데, 리투아니아에서만 인구의 약 15%인 32만 명을 등록 대상으로 잡았고, 그 가족까지 합치면 인구의 절반에 이르렀다.',
                en: 'Arrests began even before the annexation. In Estonia over 8,000 people, including most of the country’s leading politicians and military officers, were arrested in the first year of the occupation, and about 800 officers were arrested, roughly half of whom were executed or starved to death in prison camps. In Lithuania an estimated 12,000 people were imprisoned as “enemies of the people” during the year after the annexation. In Latvia Ulmanis, the war minister Jānis Balodis and the army chief Krišjānis Berķis were arrested in July 1940, and the NKVD arrested most of the White Russian exiles who had found refuge there; the purge reached even the puppet government, whose welfare minister Jūlijs Lācis was arrested. From late summer 1940 the NKVD registered “anti-Soviet elements”; in Lithuania alone it reckoned it needed to register 320,000 people, about 15% of the population, or with their families about half of it.',
                sources: [S.estWW2, S.ultimatum, S.latSSR, S.depLit],
            },
        ],
    },
    {
        heading: { ko: '1941년 6월 14일', en: '14 June 1941' },
        paragraphs: [
            {
                ko: '1941년 5월 14일 소련공산당 중앙위원회와 인민위원회의는 제1299-526ss호 공동 결정으로 발트 공화국들과 서부 우크라이나, 서부 벨라루스, 몰다비아에서 「사회적 이질 분자」를 내쫓기로 했다. 실무 절차는 국가보안 부인민위원 이반 세로프가 서명한 이른바 세로프 지령이 정했다. 날짜가 없는 이 문서는 NKGB가 생긴 1941년 2월과 사본이 접수된 6월 7일 사이에 쓰였을 것이다. 지령은 추방을 최대한 은밀하고 조용하고 빠르게 하라고 했고, 가족마다 100킬로그램까지의 짐만 허용했으며, 가장은 굴라크 수용소로, 나머지 가족은 먼 특별이주지로 보내게 했다. 리투아니아에서는 네 명으로 이루어진 집행조가 두 가족씩 맡았다. 체포 대상 명단은 계속 바뀌었다. 5월 13일 보고서는 수용소로 보낼 체포자 1만 9,610명과 가족 2,954명을 꼽았지만, 한 달 뒤에는 체포자 8,598명과 가족 1만 3,654명으로 바뀌어 「반소비에트 가족」 전체를 없애려는 방침을 드러냈다.',
                en: 'On 14 May 1941 a joint decree, No. 1299-526ss, of the Central Committee of the All-Union Communist Party and the Council of People’s Commissars ordered the removal of “socially alien elements” from the Baltic republics, western Ukraine, western Belarus and Moldavia. The procedure was set by the so-called Serov Instructions, signed by Ivan Serov, deputy People’s Commissar for State Security; the undated document must have been written between February 1941, when the NKGB was created, and 7 June, when a copy was stamped as received. The instructions required the deportations to be carried out as secretly, quietly and quickly as possible, allowed each family up to 100 kilograms of belongings, and sent heads of families to Gulag camps and the other members to forced settlements in remote regions. In Lithuania each four-member executive group was assigned two families. The lists kept changing: a report of 13 May named 19,610 people to be arrested and sent to prison camps and 2,954 family members, but a month later the figures were 8,598 arrested and 13,654 family members, showing a policy of eliminating entire “anti-Soviet” families.',
                sources: [S.depEst, S.lvJune, S.serov, S.serovP, S.depLit],
            },
            {
                ko: '작전은 6월 13일 밤부터 14일 새벽에 세 나라에서 동시에 시작되었고, 러시아·우크라이나·벨라루스에서 온 NKVD와 NKGB 부대가 지역 경찰, 공산당원과 함께 집을 에워쌌다. 끌려간 사람의 수는 출처마다 다르다. 에스토니아는 공식 자료 9,156명(러시아어 위키백과)부터 9,254~1만 861명(영어 위키백과), 열차 문서에 따른 1만 16명(러시아어 위키백과)까지 엇갈리며, 유럽인권재판소는 약 1만 명이라고 적었다. 라트비아는 1만 5,424명으로, 그 가운데 유대인 1,771명과 러시아인 742명이 있었다(라트비아어 위키백과는 「1만 5,400명 이상」). 리투아니아는 6월 19일의 NKVD 보고가 1만 7,485명을 집계했지만 통계가 불완전하고 혼란스러웠으며, 리투아니아 대학살·저항 연구 센터는 1만 6,246명의 운명을 추적해 발표했다. 리투아니아에서는 16일에도 명단에서 약 1,400명이 모자라자 소련 관리들이 16~18일 2,000명을 서둘러 더 붙잡았다. 에스토니아에서는 유대인 439명이, 라트비아에서는 리테네 군 야영지에서 장교 600명이 붙잡혔다.',
                en: 'The operation began simultaneously in all three countries on the night of 13–14 June, with NKVD and NKGB troops from Russia, Ukraine and Belarus surrounding houses together with local police and Communist Party members. The numbers taken differ by source. For Estonia they range from an official 9,156 (Russian Wikipedia) and 9,254–10,861 (English Wikipedia) to 10,016 according to the train records (Russian Wikipedia), and the European Court of Human Rights wrote of about 10,000. For Latvia the figure is 15,424, including 1,771 Jews and 742 Russians (Latvian Wikipedia: “more than 15,400”). For Lithuania an NKVD report of 19 June counted 17,485 deportees, though the official statistics were incomplete and confused, and the Genocide and Resistance Research Centre of Lithuania has traced and published the fate of 16,246. In Lithuania, still some 1,400 short of their lists on the 16th, Soviet officials hurriedly arrested another 2,000 people on 16–18 June. In Estonia 439 Jews were among the deportees, and in Latvia 600 officers were arrested at the Litene army camp.',
                sources: [S.depLit, S.june, S.ruJune, S.depEst, S.estWW2, S.latSSR, S.lvJune],
            },
            {
                ko: '가족들은 화물차에 실려 떠났다. 리투아니아의 열차는 나우요이빌니아에 모였고, 남자들은 추가 조사나 서류 처리를 핑계로 가족과 떨어져 수용소행 열차에 따로 실렸다. 열일곱 편의 열차는 19일 출발해 6월 30일에서 7월 9일 사이에 도착했다. 남자들은 대부분 시베리아의 굴라크 수용소에서 죽었다. 에스토니아어 위키백과는 에스토니아에서 붙잡힌 남자 약 3,000명이 거의 모두 처형되거나 수용소에서 죽었다고 적는다. 여자와 아이들은 옴스크주와 노보시비르스크주, 크라스노야르스크, 알타이, 카자흐스탄 등지의 특별이주지에 내려졌고, 열악한 생활 조건 때문에 사망률이 매우 높았다. 에스토니아 추방자의 사망률은 60%로 추산되며, 역사가 아르비다스 아누샤우스카스는 1941년의 리투아니아 추방자 가운데 약 8,000명이 죽었다고 보았다.',
                en: 'The families left in cattle cars. The Lithuanian trains gathered at Naujoji Vilnia, where the men, on the pretext of further inspection or paperwork, were separated from their families and loaded onto trains bound for prison camps; the seventeen trains left on 19 June and reached their destinations between 30 June and 9 July. Most of the men died in Gulag camps in Siberia; Estonian Wikipedia states that of the roughly 3,000 men taken from Estonia nearly all were executed or died in the camps. Women and children were put down in forced settlements in Omsk and Novosibirsk oblasts, Krasnoyarsk, the Altai and Kazakhstan, where poor living conditions made mortality very high. The mortality rate among the Estonian deportees has been estimated at 60%, and the historian Arvydas Anušauskas counted some 8,000 deaths among the Lithuanian deportees of 1941.',
                sources: [S.depLit, S.june, S.etJune],
            },
            {
                ko: '여드레 뒤인 6월 22일 독일이 소련을 침공했다. 수십만 명을 더 추방하려던 당장의 계획은 전쟁으로 멈췄다. 리투아니아에서는 리투아니아 행동주의 전선이 준비해 온 6월 봉기가 일어나 리투아니아 임시정부를 세웠고, 퇴각하는 NKVD는 라이니아이 숲 등지에서 정치범을 학살했으며, 에스토니아에서는 「숲의 형제」가 소련군과 싸웠다. 이 이야기와 이어진 독일 점령은 다음 사건에서 다룬다. 페츠와 문테르스는 26일, 라이도네르는 28일 유형지에서 다시 체포되었다. 처음에 많은 발트인은 독일군을 해방자로 맞았다. 오늘날 발트 3국은 6월 14일을 추모일로 지킨다.',
                en: 'Eight days later, on 22 June, Germany invaded the Soviet Union, and the war cut short plans to deport several hundred thousand more. In Lithuania the Lithuanian Activist Front launched the anti-Soviet uprising it had been preparing and set up a provisional government; the retreating NKVD massacred political prisoners in the Rainiai forest and elsewhere; and in Estonia the Forest Brothers fought the Soviet troops — a story, together with the German occupation that followed, told in the next event. Päts and Munters were re-arrested in their places of exile on the 26th and Laidoner on the 28th. At first many people in the Baltic states greeted the Germans as liberators. Today the Baltic states keep 14 June as a day of remembrance.',
                sources: [S.latSSR, S.junUpr, S.rainiai, S.summer, S.pats, S.munters, S.laidoner, S.occ40, S.june],
            },
        ],
    },
];

const event = buildEvent({
    id: 'baltic-soviet-occupation-1940-1941',
    title: { ko: '발트 3국 병합과 1941년 6월 추방', en: 'The annexation of the Baltic states and the June 1941 deportation' },
    period: '1939.09–1941.06',
    sortOrder: 103,
    question: {
        ko: '1939년 기지 조약에서 1941년 6월의 대규모 추방까지, 소련은 어떻게 발트 3국을 큰 전투 없이 점령하고 「자발적 가입」의 형식으로 병합했으며, 그 대가는 누가 치렀는가?',
        en: 'From the bases treaties of 1939 to the mass deportation of June 1941, how did the Soviet Union occupy the Baltic states without a war, annex them in the form of a “voluntary” accession, and who paid the price?',
    },
    summary: {
        ko: '독소불가침조약의 비밀의정서에 따라 소련은 1939년 9~10월 에스토니아·라트비아·리투아니아에 상호원조조약과 소련군 기지를 강요했고, 리투아니아에는 그 대가로 빌뉴스를 넘겼다. 1940년 6월 파리가 함락되던 때 세 나라에 최후통첩을 보내 붉은 군대로 점령했고, 블라디미르 데카노조프·안드레이 비신스키·안드레이 즈다노프가 유스타스 팔레츠키스·아우구스츠 키르헨슈테인스·요하네스 바레스의 「인민정부」를 세웠다. 7월의 단일 명부 선거로 뽑힌 인민의회들은 소련 가입을 청원했고, 8월 3~6일 세 나라는 소련 공화국이 되었다. 안타나스 스메토나는 망명했고 콘스탄틴 페츠와 카를리스 울마니스, 요한 라이도네르는 소련으로 끌려갔다. 미국은 웰스 선언으로 병합을 승인하지 않았다. 국유화와 체포 끝에 1941년 6월 14일 밤 수만 명이 시베리아로 추방되었고, 여드레 뒤 독일이 소련을 침공했다.',
        en: 'Under the secret protocol of the Nazi–Soviet Pact, the Soviet Union forced mutual assistance treaties and Soviet bases on Estonia, Latvia and Lithuania in September–October 1939, giving Lithuania Vilnius in return. In June 1940, as Paris fell, it sent the three states ultimatums and occupied them with the Red Army, and Vladimir Dekanozov, Andrey Vyshinsky and Andrei Zhdanov installed the “people’s governments” of Justas Paleckis, Augusts Kirhenšteins and Johannes Vares. People’s Parliaments chosen in single-list elections in July petitioned to join the Soviet Union, and on 3–6 August the three states became Soviet republics. Antanas Smetona fled abroad, while Konstantin Päts, Kārlis Ulmanis and Johan Laidoner were taken to the Soviet Union; the United States refused recognition in the Welles Declaration. After a year of nationalisation and arrests, tens of thousands were deported to Siberia on the night of 14 June 1941, eight days before Germany invaded the Soviet Union.',
    },
    outcome: {
        ko: '세 나라는 소련의 공화국이 되었고, 국가의 지도층은 망명하거나 소련의 감옥과 유형지로 사라졌다. 1941년 6월의 추방으로 에스토니아에서 약 1만 명, 라트비아에서 약 1만 5,400명, 리투아니아에서 약 1만 6,000~1만 7,500명이 끌려갔고 그 상당수가 돌아오지 못했다. 이 경험은 많은 발트인이 독일군을 해방자로 맞은 배경이 되었고, 미국의 불승인은 1991년 독립 회복 때까지 이어졌다.',
        en: 'The three states became Soviet republics, and their leaders went into exile or vanished into Soviet prisons and places of exile. The June 1941 deportation took about 10,000 people from Estonia, some 15,400 from Latvia and roughly 16,000–17,500 from Lithuania, many of whom never returned. The experience is part of why many Balts greeted the German army as liberators, and US non-recognition lasted until independence was restored in 1991.',
    },
    sections,
    timeline: [
        ['1939.09.18', '오르젤 사건', 'The Orzeł incident', '탈린에 억류된 폴란드 잠수함이 탈출하자 소련이 에스토니아의 중립을 문제 삼았다.', 'A Polish submarine escaped internment in Tallinn, and the Soviets questioned Estonia’s neutrality.', ['estonia', 'soviet', 'poland'], P(59.4370, 24.7536, '탈린', 'Tallinn')],
        ['1939.09.28', '소련–에스토니아 상호원조조약', 'Soviet–Estonian treaty', '에스토니아가 소련군 기지와 2만 5,000명 주둔을 받아들였다.', 'Estonia accepted Soviet bases and 25,000 troops.', ['estonia', 'soviet'], P(55.7520, 37.6175, '모스크바 크렘린', 'Moscow Kremlin')],
        ['1939.10.05', '소련–라트비아 상호원조조약', 'Soviet–Latvian treaty', '문테르스 외무장관이 서명했다.', 'Foreign Minister Munters signed it.', ['latvia', 'soviet']],
        ['1939.10.10', '소련–리투아니아 상호원조조약', 'Soviet–Lithuanian treaty', '빌뉴스를 받는 대신 소련군 2만 명 주둔을 허용했다.', 'Lithuania received Vilnius in exchange for 20,000 Soviet troops.', ['lithuania', 'soviet']],
        ['1939.10.28', '리투아니아군 빌뉴스 입성', 'Lithuanian Army enters Vilnius', '1920년 이후 처음으로 리투아니아군이 빌뉴스에 들어갔다.', 'The Lithuanian Army entered Vilnius for the first time since 1920.', 'lithuania', P(54.6872, 25.2797, '빌뉴스', 'Vilnius')],
        ['1940.05.25', '납치 혐의 각서', 'The kidnapping note', '몰로토프가 리투아니아가 소련 병사들을 납치했다고 항의했다.', 'Molotov accused Lithuania of abducting Soviet soldiers.', ['soviet', 'lithuania']],
        ['1940.06.07', '메르키스의 모스크바 회담', 'Merkys in Moscow', '11일까지 세 차례 회담에서 몰로토프가 비난만 되풀이했다.', 'In three meetings to the 11th Molotov only repeated his accusations.', ['lithuania', 'soviet']],
        ['1940.06.14', '리투아니아에 최후통첩', 'Ultimatum to Lithuania', '파리 함락의 날 자정 직전에 전달되었고, 여객기 칼레바가 격추되었다.', 'Delivered just before midnight as Paris fell; the airliner Kaleva was shot down.', ['soviet', 'lithuania', 'estonia', 'finland']],
        ['1940.06.15', '리투아니아 점령, 스메토나 망명', 'Lithuania occupied; Smetona flees', '붉은 군대가 들어왔고 스메토나가 키바르타이에서 독일로 넘어갔다. 마슬렌키 국경 초소도 습격당했다.', 'The Red Army entered and Smetona crossed into Germany at Kybartai; the Masļenki border post was attacked.', ['soviet', 'lithuania', 'latvia', 'germany'], P(54.6386, 22.7569, '키바르타이', 'Kybartai')],
        ['1940.06.16', '라트비아·에스토니아에 최후통첩', 'Ultimatums to Latvia and Estonia', '두 나라는 몇 시간 만에 요구를 받아들였다.', 'Both accepted within hours.', ['soviet', 'latvia', 'estonia']],
        ['1940.06.17', '라트비아·에스토니아 점령, 팔레츠키스 정부', 'Latvia and Estonia occupied; Paleckis government', '메르키스가 팔레츠키스를 총리로 임명하고 물러났다.', 'Merkys appointed Paleckis prime minister and resigned.', ['soviet', 'latvia', 'estonia', 'lithuania']],
        ['1940.06.20', '키르헨슈테인스 정부', 'Kirhenšteins government', '소련 대사관이 정한 정부가 리가에서 들어섰다.', 'A government chosen by the Soviet embassy took office in Riga.', 'latvia', P(56.9496, 24.1052, '리가', 'Riga')],
        ['1940.06.21', '바레스 정부와 탈린의 교전', 'Vares government; fighting in Tallinn', '안드레이 즈다노프의 강요로 바레스 정부가 섰고, 독립 통신대대가 몇 시간 저항했다.', 'Andrei Zhdanov imposed the Vares government; the Independent Signal Battalion resisted for hours.', ['estonia', 'soviet']],
        ['1940.07.14', '인민의회 선거', 'People’s Parliament elections', '15일까지 단일 명부로 치러졌고 결과는 조작되었다.', 'Held with single lists until the 15th; the results were falsified.', ['estonia', 'latvia', 'lithuania']],
        ['1940.07.21', '소비에트 공화국 선포', 'Soviet republics proclaimed', '세 인민의회가 소련 가입을 청원했다.', 'The three People’s Parliaments petitioned to join the USSR.', ['estonia', 'latvia', 'lithuania']],
        ['1940.07.23', '웰스 선언', 'Welles Declaration', '미국이 소련의 점령을 규탄하고 병합을 승인하지 않았다.', 'The United States condemned the occupation and refused to recognise the annexation.', ['usa', 'soviet'], P(38.8977, -77.0390, '워싱턴 국무부', 'State Department, Washington')],
        ['1940.07.30', '페츠 추방', 'Päts deported', '페츠 일가가 우파로 보내졌다.', 'The Päts family was sent to Ufa.', ['estonia', 'soviet'], P(54.7388, 55.9721, '우파', 'Ufa')],
        ['1940.08.03', '소련 편입', 'Admission to the USSR', '리투아니아(3일), 라트비아(5일), 에스토니아(6일)가 소련 공화국이 되었다.', 'Lithuania (3rd), Latvia (5th) and Estonia (6th) became Soviet republics.', ['soviet', 'lithuania', 'latvia', 'estonia']],
        ['1941.05.14', '추방 결정', 'Deportation decree', '「사회적 이질 분자」 추방을 정한 공동 결정이 내려졌다.', 'A joint decree ordered the removal of “socially alien elements”.', 'soviet'],
        ['1941.06.14', '6월 추방', 'The June deportation', '13~14일 밤 세 나라에서 수만 명이 동시에 끌려갔다.', 'Tens of thousands were taken in all three countries on the night of 13–14 June.', ['soviet', 'estonia', 'latvia', 'lithuania'], P(54.6936, 25.4231, '나우요이빌니아', 'Naujoji Vilnia')],
        ['1941.06.22', '독일의 소련 침공', 'German invasion of the USSR', '리투아니아에서 6월 봉기가 일어났다.', 'An anti-Soviet uprising broke out in Lithuania.', ['germany', 'soviet', 'lithuania'], P(54.8985, 23.9036, '카우나스', 'Kaunas')],
    ],
    locations: [
        ['리가', 'Riga', 56.9496, 24.1052, 'main'],
        ['탈린', 'Tallinn', 59.4370, 24.7536, 'place'],
        ['카우나스', 'Kaunas', 54.8985, 23.9036, 'place'],
        ['빌뉴스', 'Vilnius', 54.6872, 25.2797, 'place'],
        ['모스크바', 'Moscow', 55.7558, 37.6173, 'place'],
        ['키바르타이', 'Kybartai', 54.6386, 22.7569, 'place'],
        ['나우요이빌니아', 'Naujoji Vilnia', 54.6936, 25.4231, 'place'],
        ['우파', 'Ufa', 54.7388, 55.9721, 'place'],
    ],
    countries: ['estonia', 'latvia', 'lithuania', 'soviet', 'germany', 'finland', 'poland', 'usa'],
    relations: { related: ['nazi-soviet-pact', 'baltic-german-occupation-1941-1944', 'baltic-sovietisation-1944-1953', 'winter-war', 'fall-of-france', 'baltic-wars-of-independence', 'great-patriotic-war', 'baltic-independence'] },
    focus: { ko: '소련 점령하의 발트 3국', en: 'The Baltic states under Soviet occupation' },
    people: [
        ['stalin', 'leader', '소련 지도자', 'Soviet leader', '우르브시스에게 비밀의정서 지도를 보여 주며 소련군은 어차피 리투아니아에 들어간다고 말했다.', 'Showed Urbšys the maps of the secret protocol and told him Soviet troops would enter Lithuania anyway.'],
        ['molotov', 'leader', '외무인민위원', 'People’s Commissar for Foreign Affairs', '기지 조약에 서명하고 1940년 6월 세 나라에 최후통첩을 보냈으며, 크레베미츠케비추스에게 발트 국가들이 모두 소련에 들어가야 한다고 말했다.', 'Signed the bases treaties, delivered the ultimatums of June 1940 and told Krėvė-Mickevičius that all the Baltic states had to join the Soviet Union.'],
        ['dekanozov', 'executor', '리투아니아 파견 특사', 'Emissary to Lithuania', '외무인민위원 대리로 카우나스에 와 인민정부 구성과 인민의회 선거를 감독했다.', 'As deputy foreign commissar, came to Kaunas and supervised the People’s Government and the People’s Seimas election.'],
        ['vyshinsky', 'executor', '라트비아 파견 특사', 'Emissary to Latvia', '6~8월 라트비아에 머물며 친소 정부 수립과 소련 편입을 감독했다.', 'Stayed in Latvia from June to August to supervise the pro-Soviet government and incorporation.'],
        ['zhdanov', 'executor', '에스토니아 파견 특사', 'Emissary to Estonia', '페츠에게 바레스 정부를 임명하게 하고 야당 후보를 선거 명부에서 빼게 했다.', 'Forced Päts to appoint the Vares government and had opposition candidates struck from the ballot.'],
        ['timoshenko', 'executor', '국방인민위원', 'People’s Commissar for Defence', '발트 지역 소련군을 지휘하고 에스토니아·라트비아 봉쇄를 지시했다.', 'Commanded the Soviet forces in the Baltic region and ordered the blockade of Estonia and Latvia.'],
        ['dmitry-pavlov', 'executor', '소련군 장군', 'Red Army general', '1940년 6월 리투아니아 공격 계획을 확정했다.', 'Finalised the plan of attack on Lithuania in June 1940.'],
        ['serov', 'executor', '국가보안 부인민위원', 'Deputy People’s Commissar for State Security', '1941년 6월 추방의 절차를 정한 세로프 지령에 서명했다.', 'Signed the Serov Instructions that set the procedure for the June 1941 deportation.'],
        ['beria', 'executor', '내무인민위원', 'People’s Commissar for Internal Affairs', '6월 추방의 최고 집행 책임자였고, 문테르스가 유형지에서 그에게 청원서를 보냈다.', 'Was the senior executor of the June deportation; Munters wrote to him from exile.'],
        ['kalinin', 'participant', '소련 최고소비에트 상임간부회 의장', 'Soviet head of state, chairman of the Supreme Soviet presidium', '스메토나에게서 리투아니아가 조약을 지켜 왔다는 친서를 받았다.', 'Received Smetona’s letter assuring him that Lithuania had honoured the pact.'],
        ['antanas-smetona', 'target', '리투아니아 대통령', 'President of Lithuania', '최후통첩에 상징적 저항을 주장했으나 받아들여지지 않자 독일로 망명했다.', 'Argued for at least symbolic resistance to the ultimatum and, overruled, fled to Germany.'],
        ['antanas-merkys', 'participant', '리투아니아 총리', 'Prime minister of Lithuania', '최후통첩 수락을 주장하고 대통령 권한을 쥔 뒤 팔레츠키스를 총리로 임명했으며, 탈출하려다 붙잡혀 추방되었다.', 'Argued for accepting the ultimatum, took over the presidency, appointed Paleckis and was arrested and deported trying to flee.'],
        ['paleckis', 'leader', '리투아니아 인민정부 총리·대통령 직무대행', 'Prime minister and acting president of Lithuania', '메르키스에게 총리로 임명된 뒤 대통령 직무를 맡아 병합의 형식적 승인을 제공했다.', 'Appointed prime minister by Merkys, then acting president, he provided the formal sanction for annexation.'],
        ['vincas-kreve-mickevicius', 'participant', '인민정부 외무장관·총리 직무', 'Foreign minister and acting prime minister', '7월 1일 몰로토프에게서 병합 방침을 듣고 사임서를 썼다.', 'Wrote his resignation after Molotov told him on 1 July that the Baltic states would be annexed.'],
        ['antanas-snieckus', 'executor', '리투아니아 공산당 지도자', 'Leader of the Communist Party of Lithuania', '그가 이끄는 공산당이 데카노조프의 손발이 되었다.', 'The party he led was at Dekanozov’s disposal.'],
        ['karlis-ulmanis', 'target', '라트비아 대통령', 'President of Latvia', '저항하지 말라고 방송한 뒤 키르헨슈테인스 정부를 임명했고, 7월 대통령직에서 밀려나 소련으로 보내졌다.', 'Broadcast an order not to resist, appointed the Kirhenšteins government, was forced out in July and sent to the Soviet Union.'],
        ['vilhelms-munters', 'target', '라트비아 외무장관', 'Foreign minister of Latvia', '소련–라트비아 조약에 서명했고 1940년 7월 가족과 함께 추방되었다.', 'Signed the Soviet–Latvian treaty and was deported with his family in July 1940.'],
        ['augusts-kirhensteins', 'leader', '라트비아 괴뢰 정부 총리', 'Puppet prime minister of Latvia', '소련 대사관이 정한 정부를 이끌고 대통령 직무를 맡아 소련 편입을 요청했다.', 'Headed the government chosen by the Soviet embassy and, as acting president, requested incorporation into the USSR.'],
        ['vilis-lacis', 'executor', '라트비아 괴뢰 정부 내무장관', 'Interior minister of Latvia’s puppet government', '문테르스 가족의 추방에 입회했다.', 'Was present at the deportation of the Munters family.'],
        ['konstantin-pats', 'target', '에스토니아 대통령', 'President of Estonia', '안드레이 즈다노프의 강요로 바레스 정부를 임명하고 법령에 서명하다 7월 말 우파로 추방되었다.', 'Forced by Andrei Zhdanov to appoint the Vares government and sign its decrees, he was deported to Ufa at the end of July.'],
        ['johan-laidoner', 'target', '에스토니아군 총사령관', 'Commander-in-chief of the Estonian armed forces', '1940년 7월 부인과 함께 펜자로 추방되었고, 1941년 6월 다시 체포되었다.', 'Was deported to Penza with his wife in July 1940 and re-arrested in June 1941.'],
        ['juri-uluots', 'participant', '에스토니아 총리', 'Prime minister of Estonia', '마지막 합헌 총리로, 바레스 정부가 들어서자 그의 정부는 지하로 들어갔다.', 'The last constitutional prime minister; his government went underground when the Vares government was installed.'],
        ['johannes-vares', 'leader', '에스토니아 괴뢰 정부 총리', 'Puppet prime minister of Estonia', '안드레이 즈다노프의 명령에 따라 선거를 치르고 소련 가입 청원 대표단을 이끌었다.', 'Ran the election on Andrei Zhdanov’s orders and headed the delegation petitioning to join the USSR.'],
        ['sumner-welles', 'opponent', '미국 국무장관 대행', 'Acting US Secretary of State', '7월 23일 병합을 승인하지 않는 웰스 선언을 발표했다.', 'Issued the Welles Declaration refusing to recognise the annexation on 23 July.'],
        ['franklin-d-roosevelt', 'opponent', '미국 대통령', 'President of the United States', '웰스와 함께 선언 문안을 더 강하게 고쳤다.', 'Strengthened the text of the declaration together with Welles.'],
    ],
});

const people = require('./people-1940');

const terms = [
    term({
        id: 'june-1941-deportation', ko: '1941년 6월의 추방', en: 'June 1941 Deportation', category: 'repression', period: '1941', startYear: 1941, endYear: 1941,
        definition: ['1941년 5월 22일부터 6월 20일까지 소련이 1939~1940년에 점령한 에스토니아·라트비아·리투아니아와 서부 우크라이나·서부 벨라루스·몰다비아에서 수만 명을 소련 내지로 강제 이송한 작전. 발트 3국에서는 6월 13~14일 밤 동시에 시작되었고, 재판 없이 가족 단위로 끌려간 사람들 가운데 남자는 수용소로, 여자와 아이는 특별이주지로 보내졌다.',
            'The forced removal of tens of thousands of people into the interior of the Soviet Union, between 22 May and 20 June 1941, from Estonia, Latvia and Lithuania and from western Ukraine, western Belarus and Moldavia, all occupied by the USSR in 1939–1940. In the Baltic states it began simultaneously on the night of 13–14 June; whole families were taken without trial, the men sent to camps and the women and children to forced settlements.'],
        body: ['작전은 1941년 5월 14일 소련공산당 중앙위원회와 인민위원회의의 공동 결정에 따라 NKVD가 지휘했고, 절차는 이반 세로프가 서명한 세로프 지령이 정했다. 대상은 옛 정치인과 관리, 장교, 경찰, 부유한 농민과 상인, 각종 단체의 지도자와 그 가족이었다.\n\n끌려간 사람의 수는 출처마다 다르다. 에스토니아는 9,156~1만 861명(약 1만 명), 라트비아는 1만 5,424명, 리투아니아는 NKVD 보고 1만 7,485명과 리투아니아 대학살·저항 연구 센터가 추적한 1만 6,246명이 있다. 화물차에 실려 간 사람들의 사망률은 매우 높았다. 여드레 뒤 독일이 소련을 침공해 추가 추방은 멈췄고, 발트 3국은 6월 14일을 추모일로 지킨다.',
            'Directed by the NKVD under a joint decree of 14 May 1941 of the Central Committee of the All-Union Communist Party and the Council of People’s Commissars, the operation followed a procedure set by the Serov Instructions, signed by Ivan Serov. Its targets were former politicians and officials, officers, policemen, wealthier farmers and traders, leaders of organisations, and their families.\n\nThe numbers differ by source: for Estonia 9,156 to 10,861 (about 10,000), for Latvia 15,424, and for Lithuania 17,485 in an NKVD report against 16,246 traced by the Genocide and Resistance Research Centre of Lithuania. Mortality among those carried off in cattle cars was very high. Germany’s invasion of the Soviet Union eight days later stopped further deportations, and the Baltic states keep 14 June as a day of remembrance.'],
        aliases: { ko: ['6월 추방', '1941년 6월 추방', '발트 대추방', '1941년 발트 대추방'], en: ['June deportation', 'June deportations', 'June 1941 deportations', 'juuniküüditamine', 'jūnija deportācijas', 'birželio trėmimai'] },
        people: ['serov', 'beria', 'stalin'],
        events: ['baltic-soviet-occupation-1940-1941'],
        sources: [S.june, S.depEst, S.depLit, S.latSSR, S.ruJune, S.etJune], locator: 'lead; Deportations; June deportation of 1941; First deportation in 1941; 14 June deportations',
    }),
    term({
        id: 'serov-instructions', ko: '세로프 지령', en: 'Serov Instructions', category: 'repression', period: '1941', startYear: 1941, endYear: 1941,
        definition: ['1941년 6월 13~14일 리투아니아·라트비아·에스토니아에서 벌어진 대규모 추방의 절차를 정한 소련 국가보안 부인민위원 이반 세로프의 일급비밀 문서. 정식 제목은 「리투아니아, 라트비아, 에스토니아에서 반소비에트 분자의 추방을 수행하는 절차에 관하여」다.',
            'A top-secret document signed by Ivan Serov, Deputy People’s Commissar for State Security of the Soviet Union, setting the procedure for the mass deportations of 13–14 June 1941 from Lithuania, Latvia and Estonia; its full title was “On the Procedure for Carrying out the Deportation of Anti-Soviet Elements from Lithuania, Latvia, and Estonia”.'],
        body: ['지령은 추방을 최대한 은밀하고 조용하고 빠르게 하라고 했고, 가족마다 옷과 식량, 부엌살림 등 100킬로그램까지만 가져가게 했다. 가장은 굴라크 노동수용소로, 나머지 가족은 먼 특별이주지로 보냈다. 실제로는 붙잡힌 사람들이 학대와 약탈을 당했다는 증언이 많다.\n\n원본에는 날짜와 번호가 없다. 1939~1941년의 여러 날짜가 거론되지만 NKGB는 1941년 2월 3일에야 생겼고, 시아울랴이에서 발견된 사본에는 6월 7일 접수 도장이 있어 1941년 2~6월 사이에 쓰인 것으로 본다. 1939년 10월 11일 베리야가 서명한 NKVD 명령 제001223호와 자주 혼동되는데, 미국 하원 위원회의 보고서가 지령 전문을 그 제목 아래 실은 데서 비롯된 것으로 보인다.',
            'The instructions required the deportations to be carried out as secretly, quietly and speedily as possible and limited each family to 100 kilograms of clothes, food and kitchenware. Heads of families were sent to Gulag labour camps and the other members to forced settlements in remote areas; in practice, witnesses testified, those seized were often abused and robbed.\n\nThe original bears no date or number. Dates from 1939 to 1941 have been cited, but the NKGB was created only on 3 February 1941, and a copy found in Šiauliai was stamped as received on 7 June, so the document must date from February–June 1941. It is often confused with NKVD Order No. 001223, signed by Beria on 11 October 1939, apparently because a US House select committee report printed the full text of the instructions under that heading.'],
        aliases: { ko: ['세로프 훈령', '세로프 지침'], en: ['Serov Instructions', 'Serov instructions'] },
        people: ['serov', 'beria'],
        events: ['baltic-soviet-occupation-1940-1941'],
        sources: [S.serov, S.depLit, S.june], locator: 'lead; Dating and confusion; First deportation in 1941',
    }),
    term({
        id: 'welles-declaration', ko: '웰스 선언', en: 'Welles Declaration', category: 'international', period: '1940', startYear: 1940, endYear: 1940,
        definition: ['1940년 7월 23일 미국 국무장관 대행 섬너 웰스가 발표한 성명. 1940년 6월 소련군의 에스토니아·라트비아·리투아니아 점령을 규탄하고 세 나라의 소련 병합을 외교적으로 승인하지 않는다고 밝혀, 1991년까지 이어진 미국의 불승인 정책의 출발점이 되었다.',
            'A statement issued on 23 July 1940 by Sumner Welles, the acting US Secretary of State, condemning the Soviet army’s occupation of Estonia, Latvia and Lithuania in June 1940 and refusing to recognise their annexation into the Soviet Union; it began the US policy of non-recognition that lasted until 1991.'],
        body: ['선언은 무력에 의한 영토 변경을 인정하지 않는 1932년 스팀슨 독트린을 적용한 것으로, 웰스가 프랭클린 D. 루스벨트 대통령과 상의해 국무부 초안을 더 강한 문장으로 고쳤다. 미국은 그 직전인 7월 15일 발트 3국의 자산을 동결했고, 선언 뒤에도 세 나라의 공사들을 주권국 정부의 사절로 인정했다.\n\n선언은 미국·영국·소련 동맹 안에서 마찰의 원인이 되었지만 웰스는 이를 옹호했고, 1942년에는 병합이 「모든 도덕적 관점에서 변호할 수 없을 뿐 아니라 놀랄 만큼 어리석다」고 썼다. 미국은 소련과 군사적으로 맞서지 않았으나, 선언 덕분에 발트 국가들은 독립 외교 공관을 유지했고 행정명령 8484가 그 금융 자산을 보호했다. 이후의 모든 미국 대통령과 의회 결의가 그 취지를 이어받았다.',
            'An application of the Stimson Doctrine of 1932, which refused to recognise territorial changes made by force, the declaration was strengthened by Welles in consultation with President Franklin D. Roosevelt from a State Department draft. The United States had frozen the Baltic states’ assets on 15 July, and after the declaration it continued to recognise their envoys as representatives of sovereign governments.\n\nThe declaration became a point of contention within the American–British–Soviet alliance, but Welles defended it, writing in 1942 that the annexation was “not only indefensible from every moral standpoint, but likewise extraordinarily stupid.” The United States did not confront the Soviet Union militarily, but the declaration enabled the Baltic states to maintain independent diplomatic missions, and Executive Order 8484 protected their financial assets. Its essence was upheld by every later US president and by congressional resolutions.'],
        aliases: { ko: ['웰스 성명'], en: ['Welles declaration', 'Welles Statement'] },
        people: ['sumner-welles', 'franklin-d-roosevelt'],
        events: ['baltic-soviet-occupation-1940-1941'],
        sources: [S.welles, S.wellesP], locator: 'lead; Background; Formulation; Impact',
    }),
    term({
        id: 'baltic-mutual-assistance-treaties-1939', ko: '상호원조조약 (1939년 발트)', en: 'Soviet–Baltic Mutual Assistance Treaties (1939)', category: 'international', period: '1939', startYear: 1939, endYear: 1939,
        definition: ['1939년 9~10월 소련이 에스토니아(9월 28일), 라트비아(10월 5일), 리투아니아(10월 10일)에 강요한 세 개의 양자 조약. 서로의 주권과 체제를 존중한다고 적었지만 소련군 기지와 주둔을 허용해, 1940년 6월 소련의 점령으로 이어졌다.',
            'The three bilateral treaties the Soviet Union forced on Estonia (28 September), Latvia (5 October) and Lithuania (10 October) in September–October 1939. They declared respect for each party’s sovereignty and system but admitted Soviet military bases and garrisons, which facilitated the Soviet occupation of June 1940.'],
        body: ['소련은 폴란드 잠수함 오르젤의 탈출을 구실로 에스토니아의 중립을 문제 삼아 9월 24일 외무장관 카를 셀테르에게 조약을 요구했고, 라트비아는 외무장관 빌헬름스 문테르스가 서명했다. 조약은 제3국의 공격 때 군사 협력, 소련의 무기 지원, 기지 설치, 상대에 맞서는 동맹 금지, 정치·경제 체제와 주권의 불간섭을 담았다. 주둔 병력은 에스토니아 2만 5,000명, 라트비아 3만 명, 리투아니아 2만 명이었다.\n\n리투아니아와의 조약은 소련이 폴란드 침공으로 차지한 빌뉴스와 빌뉴스 지역 일부를 리투아니아에 넘겨주는 내용을 함께 담았다. 같은 조약을 거부한 핀란드는 1939년 11월 겨울전쟁으로 공격당했다. 1940년 6월 소련은 세 나라가 조약을 어기고 반소 동맹을 꾸몄다며 최후통첩을 보냈다.',
            'Using the escape of the Polish submarine Orzeł as a pretext to question Estonia’s neutrality, the Soviets demanded the treaty from the Estonian foreign minister Karl Selter on 24 September; in Latvia the foreign minister Vilhelms Munters signed. The treaties provided for military co-operation against an attack by a third party, Soviet help with armaments, the establishment of bases, a ban on alliances against the other party, and non-interference with each party’s political and economic systems and sovereignty. The garrisons were set at 25,000 troops in Estonia, 30,000 in Latvia and 20,000 in Lithuania.\n\nThe Lithuanian treaty also transferred to Lithuania Vilnius and part of the Vilnius Region, which the Soviets had taken in the invasion of Poland. Finland, which rejected a similar treaty, was attacked in the Winter War in November 1939. In June 1940 the Soviet Union sent the three states ultimatums, accusing them of violating the treaties and conspiring against it.'],
        aliases: { ko: ['기지 조약 (1939년 발트)', '소련–에스토니아 상호원조조약', '소련–라트비아 상호원조조약', '소련–리투아니아 상호원조조약', '발트 상호원조조약'], en: ['Soviet–Estonian Mutual Assistance Treaty', 'Soviet–Latvian Mutual Assistance Treaty', 'Soviet–Lithuanian Mutual Assistance Treaty', 'Baltic mutual assistance pacts', 'Soviet–Baltic mutual assistance pacts'] },
        people: ['molotov', 'stalin', 'vilhelms-munters'],
        events: ['baltic-soviet-occupation-1940-1941', 'nazi-soviet-pact', 'winter-war'],
        sources: [S.estTreaty, S.latTreaty, S.litTreaty, S.occ40], locator: 'lead; Background; Articles of the treaty; Aftermath',
    }),
];

module.exports = { event, people, terms };
