// East Germany 1945–1949: from the Soviet Military Administration to the
// founding of the GDR (2026-10-02). Sixth country child of
// eastern-europe-peoples-democracies, next to poland-1944-1948,
// romania-1944-1948, bulgaria-1944-1949, hungary-1945-1949 and
// czechoslovakia-1945-1948. Built with the Baltic batch's lib.js.
// Fetched source excerpts: temp_dev/east-germany/src/.
const { W, P, event: buildEvent } = require('../baltic-1940-1953-20261002/lib');

const E = t => W(encodeURI(t));
const DE = t => 'https://de.wikipedia.org/wiki/' + encodeURI(t);
const S = {
    smad: E('Soviet_Military_Administration_in_Germany'),
    smadDe: DE('Sowjetische_Militäradministration_in_Deutschland'),
    ulbrichtGroup: E('Ulbricht_Group'),
    bloc: DE('Demokratischer_Block_der_Parteien_und_Massenorganisationen'),
    gdrHist: E('History_of_East_Germany'),
    demontage: DE('Demontage_(Reparation)'),
    sag: DE('Sowjetische_Aktiengesellschaft'),
    camps: E('NKVD_special_camps_in_Germany_1945–1950'),
    campsDe: DE('Speziallager'),
    naimark: 'https://www.h-net.org/reviews/showrev.php?id=420',
    landReform: DE('Bodenreform_in_Deutschland'),
    saxony: DE('Volksentscheid_in_Sachsen_1946'),
    merger: DE('Zwangsvereinigung_von_SPD_und_KPD_zur_SED'),
    grotewohl: E('Otto_Grotewohl'),
    schumacher: E('Kurt_Schumacher'),
    fdj: E('Free_German_Youth'),
    landtag: DE('Landtagswahlen_in_der_SBZ_1946'),
    berlin46: E('1946_Berlin_state_election'),
    cdu: E('Christian_Democratic_Union_(East_Germany)'),
    tiulpanov: E('Sergei_Ivanovich_Tiulpanov'),
    dwk: DE('Deutsche_Wirtschaftskommission'),
    newType: DE('Partei_neuen_Typus'),
    volkskongress: DE('Deutscher_Volkskongress'),
    volksrat: DE('Deutscher_Volksrat'),
    founding: DE('Gründung_der_Deutschen_Demokratischen_Republik'),
    ulbricht: E('Walter_Ulbricht'),
    stalinNote: E('Stalin_Note'),
    loth: 'https://www.h-net.org/reviews/showrev.php?id=24359',
    wettig: 'https://www.h-net.org/reviews/showrev.php?id=23280',
    semyonov: E('Vladimir_Semyonov_(politician)'),
};
const ev = id => `/commulingo/events/${id}`;

const sections = [
    {
        heading: { ko: '1945년: 카를스호르스트의 군정과 울브리히트 그룹', en: '1945: military government in Karlshorst and the Ulbricht Group' },
        paragraphs: [
            {
                ko: '포츠담 협정은 오데르-나이세 선에서 서방 점령지구 경계까지의 독일 중부를 소련 점령지구로 정했다. 이 지역은 대부분 옛 프로이센의 중심부였고, 1947년 프로이센이 해체된 뒤 브란덴부르크·메클렌부르크·작센·작센안할트·튀링겐의 다섯 주로 나뉘었다. 베를린은 네 나라가 함께 관리하는 도시로 남았다. 점령지구를 다스린 기구는 1945년 6월 9일 소련 점령군 최고사령관의 명령 1호로 세워진 소련군정청(SMAD)이었다. 본부는 베를린 동남쪽 카를스호르스트에 있었고, 소련 정부(인민위원평의회, 1946년부터 각료회의), 곧 스탈린에게 직접 속했다. 각 주에는 군정청 지부가, 그 아래에는 지역 사령부가 있었다.',
                en: 'The Potsdam Agreement assigned central Germany, from the Oder–Neisse line to the boundary of the western zones, to the Soviet zone of occupation. The area consisted mostly of the old Prussian heartland; after Prussia was dissolved in 1947 it was divided into five states: Brandenburg, Mecklenburg, Saxony, Saxony-Anhalt and Thuringia. Berlin remained under four-power control. The zone was governed by the Soviet Military Administration in Germany (SMAD), created by Order No. 1 of the Soviet supreme commander on 9 June 1945. Its headquarters were at Karlshorst in south-eastern Berlin, and it answered directly to the Council of People’s Commissars (from 1946 the Council of Ministers), that is, to Stalin. Each state had its own SMA branch, with local military commandants below.',
                sources: [S.gdrHist, S.smad, S.smadDe],
            },
            {
                ko: '군정청의 수장은 1945년 6월부터 1946년 봄까지 게오르기 주코프, 그 뒤 1949년 3월까지 바실리 소콜롭스키, 이어 바실리 추이코프였다. 이들은 동시에 독일 주둔 소련군 총사령관이었다. 그러나 군정청이 소련 정책을 혼자 결정하지는 않았다. 정치고문 블라디미르 세묘노프와 선전국장 세르게이 튤파노프는 모스크바의 외무부·당 기관과 따로 연결되어 있었고, 국가보안 기관들은 군정청과 별개로 움직였다. 7월 27일 명령 17호로 독일 중앙행정청이 만들어지기 시작해 그해 가을까지 교통·산업·농업·재정·교육·사법 등을 맡은 열한 곳이 생겼다. 이 기관들은 군정청의 「보조 기관」이었고 그 가운데 일부는 1949년 동독의 부처로 그대로 넘어갔다.',
                en: 'SMAD was headed by Georgy Zhukov from June 1945 until spring 1946, then by Vasily Sokolovsky until March 1949, and finally by Vasily Chuikov; each was at the same time commander-in-chief of the Soviet forces in Germany. Yet SMAD did not make Soviet policy alone. The political adviser Vladimir Semyonov and the head of the Propaganda Administration, Sergei Tiulpanov, had their own lines to the Foreign Ministry and the party apparatus in Moscow, and the security services operated independently of the military government. Order No. 17 of 27 July began the creation of German Central Administrations; by autumn there were eleven, for transport, industry, agriculture, finance, education, justice and other fields. They were “auxiliary organs” of SMAD, and some of them passed directly into the ministries of the GDR in 1949.',
                sources: [S.smadDe, S.smad, S.semyonov],
            },
            {
                ko: '독일 공산당 지도부는 붉은군대와 함께 돌아왔다. 1945년 4월 25일 모스크바에서 빌헬름 피크와 게오르기 디미트로프가 귀국 간부들의 임무를 정했고, 4월 30일 발터 울브리히트가 이끄는 열 명의 「울브리히트 그룹」이 비행기로 독일에 들어왔다. 작센에는 안톤 아커만의 그룹, 메클렌부르크에는 구스타프 조보트카의 그룹이 따로 보내졌다. 울브리히트 그룹은 5월 2일 베를린 동쪽 30킬로미터의 브루흐뮐레에서 일을 시작해 베를린 20개 구의 행정을 짰다. 구청장으로는 사회민주당원이나 시민 출신을 앉히되 인사와 교육 부서는 공산당원이 맡게 했고, 5월 12일 베를린 구청장과 시 참사회가 울브리히트의 명단 그대로 임명되었다. 그룹의 막내였던 볼프강 레온하르트는 1955년의 회고록에서 울브리히트가 「민주적으로 보여야 한다. 그러나 모든 것을 우리 손에 쥐고 있어야 한다」고 말했다고 전한다.',
                en: 'The leadership of the Communist Party of Germany (KPD) returned with the Red Army. On 25 April 1945 Wilhelm Pieck and Georgi Dimitrov set out the tasks of the returning cadres in Moscow, and on 30 April the ten-strong “Ulbricht Group” under Walter Ulbricht flew into Germany. Separate groups were sent to Saxony under Anton Ackermann and to Mecklenburg under Gustav Sobottka. The Ulbricht Group began work on 2 May at Bruchmühle, 30 kilometres east of Berlin, and organised administrations in all 20 Berlin districts: Social Democrats or non-party professionals were to be district mayors, while Communists took the personnel and education departments. On 12 May the district administrators and city council were appointed exactly as Ulbricht had listed them. Wolfgang Leonhard, the group’s youngest member, reported in his 1955 memoir Ulbricht’s remark: “It must look democratic, but we must have everything in hand.”',
                sources: [S.ulbrichtGroup],
            },
            {
                ko: '6월 4일 울브리히트·아커만·조보트카는 모스크바에서 피크, 안드레이 즈다노프와 함께 스탈린을 만났다. 스탈린은 노동자뿐 아니라 농민과 지식인에게도 열린 전국 정당을 만들고 통일 독일을 위해 일하라고 주문했다. 6월 10일 군정청 명령 2호가 반파시즘 정당과 단체의 결성을 허가했고, 이튿날 공산당이 베를린에서 가장 먼저 창당 호소문을 냈다. 아커만이 쓴 이 문서는 독일에 소비에트 체제를 강요하는 것은 잘못이라고 밝히고, 1848년 혁명이 시작한 시민적 민주주의 변혁의 완수와 「모든 민주적 권리와 자유를 갖춘 반파시즘 민주공화국」을 목표로 내걸었다. 사회민주당이 6월 15일, 기독교민주연합(CDU)이 6월 26일 뒤따랐고, 자유민주당(LDP)은 7월 10일 「블록」 가입을 조건으로 허가를 받았다. 7월 14일 네 당은 공산당의 주도로 「반파시즘 민주정당 통일전선」을 결성했다. 블록의 결정은 만장일치여야 했으므로, 공산당을 빼거나 공산당에 맞서는 연립은 처음부터 불가능했다.',
                en: 'On 4 June Ulbricht, Ackermann and Sobottka met Stalin in Moscow together with Pieck and Andrei Zhdanov. Stalin told them to build a nationwide party open to farmers and intellectuals as well as workers, and to work for a unified Germany. On 10 June SMAD Order No. 2 permitted antifascist parties and organisations, and the next day the KPD was the first to publish a founding appeal in Berlin. Written by Ackermann, it declared that it would be wrong to force the Soviet system on Germany and set as its aim the completion of the bourgeois-democratic transformation begun in 1848 and “an anti-fascist, democratic republic with all democratic rights and freedoms for the people.” The SPD followed on 15 June and the Christian Democratic Union (CDU) on 26 June; the Liberal Democratic Party (LDP) was licensed on 10 July on condition that it join the “bloc”. On 14 July the four parties, at the KPD’s initiative, formed the “united front of anti-fascist democratic parties”. Its decisions had to be unanimous, which ruled out from the start any coalition without or against the KPD.',
                sources: [S.ulbrichtGroup, S.bloc, S.gdrHist],
            },
        ],
    },
    {
        heading: { ko: '점령의 비용: 해체와 배상, 특별수용소', en: 'The costs of occupation: dismantling, reparations and the special camps' },
        paragraphs: [
            {
                ko: '포츠담 회담은 배상 문제를 매듭짓지 못했고, 각 점령국이 자기 지구에서 배상을 가져가는 방식이 남았다. 소련은 100억 달러를 요구했고, 1947년 12월까지 서방이 이를 받아들이지 않을 것이 분명해지자 그 금액을 자기 점령지구에서 거두려 했다. 1945년 8월 2일 이전의 반출은 배상으로 계산되지 않았는데, 소련 외무부 자료에 따르면 전리품 대대가 128만 톤의 자재와 360만 톤의 설비를 실어 갔다. 해체 규모의 추계는 엇갈린다. 독일 측 연구는 1952년까지 약 3,400개 공장, 1944년 공업 능력의 약 30%가 해체되었다고 보며, 자동차 공업의 5분의 4와 제철 능력의 4분의 3, 1947년까지 철도망의 48%가 뜯겨 나갔다고 집계한다. 네이마크는 1950년 무렵까지 해체와 현재 생산에서의 반출을 합쳐 소련이 100억 달러 목표를 채웠고, 동부 독일 공업 기반의 3분의 1 가량이 사라졌다고 추산했다.',
                en: 'The Potsdam Conference failed to settle reparations, leaving each occupying power to take them from its own zone. The Soviet Union demanded $10 billion, and when it became clear by December 1947 that the Western governments would not agree, it sought to extract that sum from its own zone. Removals before 2 August 1945 were not counted as reparations; according to Soviet Foreign Ministry data, trophy battalions removed 1.28 million tons of materials and 3.6 million tons of equipment. Estimates of dismantling differ. German research counts about 3,400 plants dismantled by 1952, around 30 per cent of the 1944 industrial capacity, including four-fifths of the vehicle industry, three-quarters of iron production and, by 1947, 48 per cent of the railway network. Naimark estimates that through removals and deliveries from current production the Soviets reached their $10 billion goal by around 1950, at the cost of perhaps a third of eastern Germany’s industrial base.',
                sources: [S.gdrHist, S.demontage, S.naimark],
            },
            {
                ko: '1946년 6월 5일 군정청 명령 167호는 해체 대상이던 대기업 약 200곳을 「소련 주식회사(SAG)」로 바꾸었다. 공장을 뜯어 가는 대신 현재 생산에서 배상을 가져가는 방식으로 바꾼 것이다. 이 회사들은 30만 명을 고용했고 1947년 점령지구 공업 생산의 20%를 차지했다. 1947년 5월 소련 각료회의 결정으로 세워지고 7월 작센의 아우에에 등록된 비스무트 주식회사는 소련 핵무기 계획에 결정적인 기업으로, 소련 주식회사와 별개로 소련이 직접 관리했다. 군정청에서 소련 주식회사를 맡은 부책임자는 1947년 5월부터 보그단 코불로프였다. 배상은 1953년 6월 봉기 뒤인 1954년 1월 1일에야 끝났다.',
                en: 'SMAD Order No. 167 of 5 June 1946 converted some 200 large enterprises earmarked for dismantling into Soviet joint-stock companies (SAG), switching from removing plants to taking reparations from current production. They employed 300,000 people and in 1947 accounted for 20 per cent of the zone’s industrial output. Wismut AG, founded by a decision of the Soviet Council of Ministers in May 1947 and registered at Aue in Saxony that July, was of key importance to the Soviet atomic weapons programme and was run directly by the Soviets, separately from the SAGs. Within SMAD the joint-stock companies were overseen from May 1947 by Bogdan Kobulov as deputy. Reparations ended only on 1 January 1954, after the uprising of June 1953.',
                sources: [S.sag, S.smadDe],
            },
            {
                ko: '1945년 4월 18일 내무인민위원부 명령 00315호는 군사 재판 없이 「간첩·파괴분자·테러리스트·나치당 활동가」를 억류하도록 했다. 이에 따라 점령지구에는 열 곳의 특별수용소가 세워졌고, 부헨발트와 작센하우젠처럼 옛 나치 강제수용소 자리를 쓴 곳도 있었다. 1945년 7월 4일 베리야는 이반 세로프를 점령군의 내무인민위원부 전권대표로 임명했다. 소련 공식 집계로는 독일인 122,671명을 포함해 157,837명이 수용되었고 그 가운데 적어도 43,035명이 죽었다. 실제 독일인 수감자는 이보다 3만 명가량 많았다는 추산도 있다. 수감자 가운데 나치당원의 비율은 시간이 갈수록 줄었고, 사회민주당원, 청소년, 귀환 포로가 끌려왔다. 수용소는 1948년 8월 굴라크 아래로 들어갔고 1950년 초 동독 정부에 넘겨졌다.',
                en: 'NKVD Order No. 00315 of 18 April 1945 provided for interning “spies, saboteurs, terrorists and active NSDAP members” without trial. Ten special camps were set up in the zone, some, like Buchenwald and Sachsenhausen, on the sites of former Nazi concentration camps. On 4 July 1945 Beria appointed Ivan Serov as the NKVD plenipotentiary for the Soviet forces in Germany. Official Soviet figures record 157,837 detainees, 122,671 of them Germans, of whom at least 43,035 died; other estimates put the real number of German prisoners some 30,000 higher. The share of Nazi Party members among inmates fell steadily over time, while Social Democrats, young people and returning prisoners of war were taken in. The camps were placed under the Gulag in August 1948 and handed to the East German government in early 1950.',
                sources: [S.camps, S.campsDe, S.naimark],
            },
            {
                ko: '네이마크는 붉은군대 병사들의 대규모 강간이 독일 땅에 들어선 때부터 종전 뒤까지 이어졌다고 썼다. 그는 피해 여성이 200만 명에 이를 수 있다는 독일 연구자들의 추계를 지지했고, 군정청과 독일 공산당 지도부가 이를 알면서도 막지 못하거나 막지 않았다고 보았다. 그의 결론은 강간, 약탈, 해체, 우라늄 채굴, 특별수용소가 점령지구 주민의 마음을 소련과 독일 공산당에게서 돌려세웠다는 것이었다.',
                en: 'Naimark wrote that mass rape by Red Army soldiers continued from the moment they reached German soil until well after the end of hostilities. He supported German researchers’ estimate that as many as two million women may have been victims, and found that SMAD officers and German Communist leaders knew of it but were unable or unwilling to stop it. His conclusion was that rape, plunder, dismantling, uranium mining and the special camps turned the zone’s population against the Soviets and the German Communists.',
                sources: [S.naimark],
            },
        ],
    },
    {
        heading: { ko: '토지개혁과 작센 국민투표', en: 'Land reform and the Saxony referendum' },
        paragraphs: [
            {
                ko: '1945년 8월 초 공산당 기관지 『도이체 폴크스차이퉁』이 「융커」의 토지를 농민에게 넘기라는 운동을 시작했고, 9월 3일부터 11일까지 각 주와 지방 행정청이 거의 같은 내용의 토지개혁 시행령을 차례로 냈다. 첫 지역은 작센 지방이었다. 100헥타르가 넘는 토지를 가진 지주와 전범·나치 활동가로 분류된 사람의 토지가 보상 없이 몰수되었다. 몰수된 대농장은 7,160곳, 100헥타르 이하 농장은 4,537곳이었고, 국유지와 산림을 합쳐 329만 8천 헥타르, 당시 농지의 약 35%가 다시 분배되었다. 받은 사람은 새로 농민이 된 사람 183,261명, 동쪽에서 쫓겨 온 이주민 91,155명, 땅이 적은 농민 82,483명 등이었다. 1948년까지 새 농가의 43.3%가 이주민에게 돌아갔다.',
                en: 'In early August 1945 the KPD newspaper Deutsche Volkszeitung launched a campaign to hand the land of the “Junkers” to the peasants, and between 3 and 11 September the state and provincial administrations issued nearly identical land reform ordinances, beginning in the Province of Saxony. Estates of more than 100 hectares, and the land of people classed as war criminals or Nazi activists, were confiscated without compensation. A total of 7,160 large estates and 4,537 smaller farms were expropriated; together with state land and forests, 3.298 million hectares, about 35 per cent of the farmland of the time, was redistributed. Recipients included 183,261 new farmers, 91,155 expellees from the east and 82,483 land-poor peasants. By 1948, 43.3 per cent of the new farms had gone to expellees.',
                sources: [S.landReform],
            },
            {
                ko: '대지주는 땅만 잃지 않았다. 집과 재산을 몰수당했고 살던 군(郡) 밖으로 추방되었으며, 상당수는 정치 경력과 상관없이 특별수용소에 갇혔다. 반파시즘과 대지주의 경제력 해체는 네 당의 공통 입장이었고, 오토 그로테볼도 9월 14일 사회민주당 간부들 앞에서 개혁을 지지했다. 그러나 보상을 요구한 기독교민주연합 의장 안드레아스 헤르메스는 군정청의 압력으로 물러나야 했다. 새 농가의 평균 면적은 10헥타르가 안 되었다. 농업 생산협동조합은 1952년에야 처음 생겼고, 집단화가 끝난 것은 1960년이었다.',
                en: 'The great landowners lost more than their land. Their houses and property were confiscated, they were expelled from their home districts, and many were interned in special camps regardless of their political record. Antifascism and breaking the economic power of the big landowners were common ground for all four parties, and Otto Grotewohl defended the reform before SPD officials on 14 September. But Andreas Hermes, chairman of the CDU, who demanded compensation, was forced by SMAD to resign. The average new farm was under 10 hectares. The first agricultural production cooperatives were founded only in 1952, and collectivisation was completed in 1960.',
                sources: [S.landReform, S.cdu],
            },
            {
                ko: '공업에서는 군정청이 먼저 움직였다. 1945년 10월 30일 명령 124호가 수많은 기업과 공장주의 재산을 압류해 관리인에게 맡겼고, 1946년 5월 명령으로 압류 재산의 처분권이 주와 지방 행정청에 넘어갔다. 작센 공산당의 헤르만 마테른이 몰수를 주민투표에 부치자고 제안했고, 3월 울브리히트가 군정청의 승인을 알렸다. 작센에서 압류된 4,700개 기업은 몰수·반환·군정청 보유의 세 명단으로 나뉘었고, 투표일에는 몰수 명단의 1,861개 기업이 표결에 올랐다. 캠페인은 「사회주의」나 「국유화」라는 말을 피하고 「전범 처벌」과 「인민 소유」를 내세웠다.',
                en: 'In industry SMAD moved first. Order No. 124 of 30 October 1945 placed the property of many companies and industrialists under sequestration, and an order of May 1946 transferred control of the sequestered property to the state and provincial administrations. Hermann Matern of the Saxon KPD proposed putting expropriation to a popular vote, and in March Ulbricht signalled SMAD’s approval. The 4,700 enterprises sequestered in Saxony were sorted into lists for expropriation, return and retention by SMAD; on polling day 1,861 enterprises on the expropriation list were put to the vote. The campaign avoided the words “socialism” and “nationalisation” and spoke instead of “punishing war criminals” and “people’s ownership”.',
                sources: [S.saxony],
            },
            {
                ko: '1946년 6월 30일 작센 주민투표는 투표율 93.7%에 찬성 77.6%로 통과되었다. 나치 활동가로 지목된 14,228명은 투표권이 없었고, 법에 정해진 주민 발의 절차는 행정 명령으로 건너뛰었지만, 투표 자체는 대체로 바르게 치러졌다고 평가된다. 이는 소련 점령지구에서 열린 유일한 주민투표였다. 다른 네 주는 투표 없이 법령으로 같은 몰수를 했다. 압류 기업과 해체를 면한 공장 가운데 소련 주식회사로 가지 않은 것은 「인민 소유 기업」이 되었고, 군정청에 몰수된 공업은 점령지구 공업 생산의 약 60%였다.',
                en: 'The Saxony referendum of 30 June 1946 passed with 77.6 per cent in favour on a turnout of 93.7 per cent. The 14,228 people named as Nazi activists had no vote, and the popular initiative required by law was bypassed by decree, but the vote itself is considered to have been conducted properly. It was the only referendum held in the Soviet zone; the other four states carried out the same expropriations by decree without a vote. Confiscated enterprises that did not go to the Soviet joint-stock companies became “people’s enterprises”; the industry confiscated by the occupation authority amounted to about 60 per cent of the zone’s industrial output.',
                sources: [S.saxony, S.gdrHist],
            },
        ],
    },
    {
        heading: { ko: '1946년 4월: 독일사회통일당의 창당', en: 'April 1946: the founding of the Socialist Unity Party' },
        paragraphs: [
            {
                ko: '1945년 여름에는 두 노동자 정당 모두에 통합을 바라는 목소리가 있었다. 나치 집권이 노동운동의 분열 때문이었다고 보는 사회민주당원들이 있었고, 오토 그로테볼이 이끄는 베를린의 사회민주당 중앙위원회도 처음에는 통합을 원했다. 그때 통합을 미룬 쪽은 오히려 군정청과 공산당이었다. 공산당이 혼자 힘으로 가장 강한 당이 될 것이라 보았기 때문이다. 계산이 바뀐 것은 1945년 11월이었다. 헝가리 총선에서 공산당이 17%, 오스트리아에서 5.4%에 그치자, 스탈린과 울브리히트는 「오스트리아의 위험」을 피하려고 그달 안에 강력한 통합 캠페인을 시작했다. 그 무렵 사회민주당원들은 군정청의 압박을 겪으며 통합에서 멀어지고 있었다.',
                en: 'In summer 1945 there were voices for unity in both workers’ parties. Some Social Democrats blamed the Nazi seizure of power on the split in the labour movement, and the SPD Central Committee in Berlin under Otto Grotewohl initially favoured a merger. At that point it was SMAD and the KPD that held back, expecting the Communists to become the strongest party on their own. The calculation changed in November 1945. After the Communists won only 17 per cent in Hungary and 5.4 per cent in Austria, Stalin and Ulbricht, seeing the “Austrian danger”, launched a forced unity campaign that same month. By then, repression by SMAD had made Social Democrats more reluctant to merge.',
                sources: [S.merger, S.grotewohl],
            },
            {
                ko: '1946년 초 점령지구의 모든 주에서 통합에 반대하는 사회민주당원들이 체포되거나 협박을 받았다. 그로테볼은 2월 초 영국 군정의 크리스토퍼 스틸에게 사회민주당원들이 「러시아의 총검에 간지럽혀지고」 있으며, 나흘 전까지 저항하겠다던 사람들이 이제는 빨리 끝내 달라고 애원한다고 말했다. 서독 사회민주당의 에리히 올렌하우어는 1961년 1945년 12월부터 1946년 4월 사이 적어도 2만 명의 사회민주당원이 징계·투옥·살해되었다고 추산했다. 영국 역사가 개리스 프리처드는 이 수치가 과장일 수 있지만 체포에 대한 공포는 널리 퍼져 있었고, 수백에서 수천 명이 서쪽으로 도피했다고 본다. 서방 점령지구 사회민주당을 이끈 쿠르트 슈마허는 통합에 반대했다.',
                en: 'In early 1946 Social Democrats opposed to the merger were arrested or threatened in every state of the zone. In early February Grotewohl told Christopher Steel of the British military government that Social Democrats were “being tickled by Russian bayonets” and that men who had assured him four days earlier that they would resist were now begging him to get it over with. In 1961 Erich Ollenhauer of the West German SPD estimated that at least 20,000 Social Democrats had been disciplined, imprisoned or even killed between December 1945 and April 1946. The British historian Gareth Pritchard considers the figure possibly exaggerated but holds that fear of arrest was widespread and that hundreds if not thousands fled west. Kurt Schumacher, who led the SPD in the western zones, opposed the merger.',
                sources: [S.merger, S.schumacher],
            },
            {
                ko: '베를린은 네 나라가 관리했기 때문에 사정이 달랐다. 3월 31일 베를린 사회민주당은 당원투표를 실시했으나, 소련 점령 구역에서는 투표가 금지되어 서방 구역에서만 치러졌다. 투표권자 32,547명 가운데 23,755명이 참여해 82%인 19,529명이 즉각 통합에 반대했고, 두 당의 협력 관계에는 62%가 찬성했다. 반대파는 4월 7일 독자적인 베를린 사회민주당 조직을 세웠다. 4월 21일과 22일 베를린 소련 구역의 아트미랄스팔라스트에서 열린 통합대회는 만장일치로 독일사회통일당을 세웠다. 공동의장은 피크와 그로테볼, 부의장은 울브리히트와 막스 페히너였고, 모든 기관은 두 당 출신이 반씩 나누었다. 1946년 4월 공산당원은 62만 4천 명, 3월 말 사회민주당원은 69만 5천4백 명이었는데, 새 당의 당원은 129만 7천6백 명이었다. 수만 명의 사회민주당원이 새 당에 등록하지 않았기 때문이다.',
                en: 'Berlin, under four-power control, was different. On 31 March the Berlin SPD held a membership ballot, but the Soviets banned it in their sector, so it took place only in the western sectors. Of 32,547 eligible members 23,755 voted; 19,529, or 82 per cent, rejected an immediate merger, while 62 per cent supported an alliance between the two parties. The opponents set up an independent Berlin SPD on 7 April. On 21–22 April the unification congress in the Admiralspalast in the Soviet sector unanimously founded the Socialist Unity Party of Germany (SED). Pieck and Grotewohl became co-chairmen, Ulbricht and Max Fechner their deputies, and every body was staffed equally from both parties. In April 1946 the KPD had 624,000 members and at the end of March the SPD had 695,400, but the new party counted 1,297,600, because tens of thousands of Social Democrats never registered in it.',
                sources: [S.merger],
            },
            {
                ko: '1946년 3월 7일에는 에리히 호네커를 의장으로 하는 자유독일청년단(FDJ)이 공식 창립되었다. 처음에는 비정치적인 통일 청년 조직을 표방하며 네 점령지구 모두에서 활동했지만, 실제로는 사회통일당의 청년 조직이었다. 같은 해 사회민주당의 구스타프 다렌도르프는 사회통일당의 탄생을 「강제 통합」이라 불렀다. 각국의 사회민주당 흡수 과정은 [동유럽 인민민주주의 정권의 수립](/commulingo/events/eastern-europe-peoples-democracies) 항목이 함께 다루는데, 소련 점령지구는 그 첫 사례였다.',
                en: 'On 7 March 1946 the Free German Youth (FDJ) was formally founded with Erich Honecker as its chairman. It presented itself as a non-political, united youth organisation active in all four zones, but in practice it was the SED’s youth wing. In the same year the Social Democrat Gustav Dahrendorf called the founding of the SED a “forced merger”. The absorption of the Social Democratic parties across the region is covered in [The People’s Democracies of Eastern Europe](/commulingo/events/eastern-europe-peoples-democracies); the Soviet zone was the first case.',
                sources: [S.fdj, S.merger],
            },
        ],
    },
    {
        heading: { ko: '1946년 10월 선거와 블록 정당의 길들이기', en: 'The October 1946 elections and the taming of the bloc parties' },
        paragraphs: [
            {
                ko: '1946년 10월 20일 다섯 주에서 주의회 선거가 치러졌다. 1990년까지 이 지역에서 자유·보통·비밀 선거의 외양을 갖춘 유일한 주의회 선거였다. 조건은 고르지 않았다. 사회민주당은 통합 뒤 따로 출마할 수 없었고, 공산당 신문은 35만 부를 찍은 반면 다른 당 신문은 25만 부씩만 허용되었다. 튤파노프는 비밀 지시로 「시민 정당의 지부 결성을 형식상 금지하지는 말되」 여러 핑계로 그 수를 묶어 두라고 했고, 그에 앞선 지방선거에서 기독교민주연합과 자유민주당이 후보 명부를 낼 수 있었던 곳은 시·읍·면의 20%뿐이었다. 그런데도 사회통일당은 제1당이 되었을 뿐 어느 주에서도 과반을 얻지 못했고, 작센안할트와 브란덴부르크에서는 기독교민주연합과 자유민주당의 연립도 가능한 의석 분포였다.',
                en: 'State elections were held in the five states on 20 October 1946, the only state elections in the area before 1990 that had the appearance of being free, universal and secret. The conditions were uneven. After the merger the SPD was not allowed to run separately; the Communist newspaper was printed in 350,000 copies, the other parties’ papers in 250,000 each. Tiulpanov secretly instructed regional SMAD offices “not formally to prohibit” local groups of the bourgeois parties but to find “various formal pretexts” to keep their number limited, and in the preceding municipal elections the CDU and LDP were able to field lists in only 20 per cent of communities. Even so, the SED became the largest party but won an absolute majority in no state; in Saxony-Anhalt and Brandenburg a CDU–LDP coalition would have been arithmetically possible.',
                sources: [S.landtag, S.merger],
            },
            {
                ko: '같은 날 치러진 대(大)베를린 시의회 선거는 더 분명한 결과를 보여 주었다. 투표율 92.3%에 사회민주당 48.7%, 기독교민주연합 22.2%, 사회통일당 19.8%, 자유민주당 9.3%였다. 1990년까지 베를린 전체에서 치러진 유일한 선거였다. 시의회가 1947년 에른스트 로이터를 시장으로 뽑자 소련 측은 승인을 거부했다. 군정청과 사회통일당은 선거 결과에 실망했고, 이후의 선거를 각 당이 따로 경쟁하는 방식이 아니라 단일 명부에 찬반을 묻는 방식으로 바꾸었다.',
                en: 'The Greater Berlin city council election held the same day gave a clearer verdict. On a turnout of 92.3 per cent the SPD won 48.7 per cent, the CDU 22.2, the SED 19.8 and the LDP 9.3. It was the only all-Berlin election before 1990. When the council elected Ernst Reuter mayor in 1947, the Soviet authorities refused to confirm him. SMAD and the SED were disappointed by the results and thereafter replaced competitive party lists with single “unity lists” put to a yes-or-no vote.',
                sources: [S.berlin46, S.landtag],
            },
            {
                ko: '블록에 남은 두 시민 정당은 지도부를 잇달아 잃었다. 헤르메스의 뒤를 이은 기독교민주연합의 야코프 카이저는 공산당이 내놓은 중공업 국유화와 토지 분배에는 찬성한 사람이었지만, 공산당을 비판했다는 이유로 1947년 12월 에른스트 레머와 함께 군정청에 의해 물러났다. 직접적인 계기는 사회통일당이 주도한 독일 인민회의에 참여하기를 거부한 일이었다. 자리를 이은 오토 누슈케는 고분고분한 인물이었다. 자유민주당은 대다수 주 조직의 뜻을 거슬러 인민회의에 참여했다. 1948년 4월과 5월에 새로 생긴 민주농민당과 국가민주당도 블록에 들어왔다.',
                en: 'The two bourgeois parties in the bloc lost their leaders one after another. Jakob Kaiser, who had succeeded Hermes at the head of the CDU, favoured the nationalisation of heavy industry and the land distribution proposed by the Communists, but because of his criticism of the Communists he was removed by SMAD in December 1947 together with Ernst Lemmer; the immediate trigger was the CDU’s refusal to take part in the SED-led German People’s Congress. His successor Otto Nuschke was more pliant. The LDP joined the congress against the wishes of most of its state associations. The Democratic Farmers’ Party and the National Democratic Party, founded in April and May 1948, also joined the bloc.',
                sources: [S.cdu, S.volkskongress, S.bloc],
            },
        ],
    },
    {
        heading: { ko: '1947~1949년: 경제위원회, 인민회의, 「새로운 형태의 당」', en: '1947–1949: the Economic Commission, the People’s Congresses and the “party of a new type”' },
        paragraphs: [
            {
                ko: '국가의 골격은 경제 행정에서 먼저 생겼다. 1947년 6월 11일 군정청 명령 138호로 독일경제위원회(DWK)가 세워져 산업·무역·교통·농림·연료 중앙행정청과 배상 납품을 조정했다. 미국과 영국 점령지구가 1947년 1월 「비존」으로 합쳐지고 12월 런던 외무장관 회의가 결렬되자, 1948년 2월 12일 소콜롭스키의 명령 32호가 경제위원회에 점령지구의 모든 독일 기관에 대한 명령권을 주었다. 위원장은 하인리히 라우, 부위원장은 브루노 로이슈너와 프리츠 젤프만으로 모두 사회통일당원이었다. 위원은 11월 27일 38명에서 101명으로 늘었다. 경제위원회는 경제를 넘어 사실상의 정부가 되었고, 1949년 10월 그 기구가 동독 임시정부로 넘어갔다.',
                en: 'The skeleton of a state appeared first in economic administration. SMAD Order No. 138 created the German Economic Commission (DWK) on 11 June 1947 to coordinate the central administrations for industry, trade, transport, agriculture and fuel and the delivery of reparations. After the American and British zones merged into the Bizone in January 1947 and the London foreign ministers’ conference broke down in December, Sokolovsky’s Order No. 32 of 12 February 1948 empowered the DWK to issue binding orders to all German organs in the zone. Heinrich Rau became its chairman, with Bruno Leuschner and Fritz Selbmann as deputies, all SED members. On 27 November its membership rose from 38 to 101. The DWK became a government in all but name, and in October 1949 its apparatus passed to the provisional government of the GDR.',
                sources: [S.dwk, S.smadDe],
            },
            {
                ko: '정치 쪽 통로는 인민회의 운동이었다. 사회통일당의 주도로 1947년 11월 26일 시작된 이 운동은 런던 외무장관 회의에 맞추어 12월 6~7일 베를린에서 「통일과 정의로운 평화를 위한」 제1차 독일 인민회의를 열었다. 대표 약 2,000명은 선거가 아니라 정당과 대중조직의 지명으로 뽑혔고, 대중조직 대표 대부분이 사회통일당원이었기 때문에 에리히 그니프케는 참가자의 62%가 사회통일당원이었다고 추산했다. 1848년 3월 혁명 100주년인 1948년 3월 17~18일의 제2차 인민회의에는 서방 지구 대표 512명을 포함해 1,898명이 참석해 마셜 플랜을 거부하고 독일 통일을 위한 청원 운동을 결의했으며, 400명으로 된 독일 인민평의회를 뽑았다. 인민평의회의 헌법위원회는 그로테볼이 이끌었고, 사회통일당이 1946년 11월에 만든 초안을 바탕으로 1949년 3월 19일 헌법안을 확정했다.',
                en: 'The political channel was the People’s Congress movement. Launched at the SED’s initiative on 26 November 1947, it convened the First German People’s Congress “for Unity and a Just Peace” in Berlin on 6–7 December, timed to the London foreign ministers’ conference. Its roughly 2,000 delegates were nominated by parties and mass organisations rather than elected; since most mass-organisation delegates were SED members, Erich Gniffke estimated that 62 per cent of participants belonged to the SED. The Second Congress, on 17–18 March 1948, the centenary of the March Revolution of 1848, gathered 1,898 delegates, 512 from the western zones. It rejected the Marshall Plan, called a petition campaign for German unity and elected a 400-member German People’s Council. The council’s constitutional committee, chaired by Grotewohl, worked from an SED draft of November 1946 and formally adopted a draft constitution on 19 March 1949.',
                sources: [S.volkskongress, S.volksrat, S.dwk],
            },
            {
                ko: '그 사이 사회통일당 자체가 바뀌었다. 1948년 9월 15~16일 당 집행부 제13차 회의와 1949년 1월 제1차 당협의회는 사회통일당을 레닌식 「새로운 형태의 당」으로 개조한다고 결의했다. 당은 마르크스-레닌주의와 민주집중제를 공식 원칙으로 채택했고 「분파와 그룹의 용인은 당의 성격과 양립할 수 없다」고 규정했다. 옛 사회민주당원과 공산당원이 반씩 나누던 원칙은 1949년 무렵 사실상 사라졌고, 1948년부터 1951년 사이 자기 목소리를 내던 사회민주당 출신들이 숙청되거나 투옥되었다. 네이마크는 사회통일당을 「새로운 형태의 당」으로 만든 소련 측 인물로 튤파노프를 꼽는다. 그의 선전국은 1946년이면 점령지구의 정치를 사실상 운영하고 있었다.',
                en: 'Meanwhile the SED itself was transformed. The 13th session of the party executive on 15–16 September 1948 and the First Party Conference in January 1949 resolved to turn the SED into a Leninist “party of a new type”. It formally adopted Marxism–Leninism and democratic centralism and declared that “tolerating factions and groupings is incompatible with its Marxist–Leninist character.” Parity between former Social Democrats and Communists had effectively ended by 1949, and between 1948 and 1951 outspoken former Social Democrats were purged and imprisoned. Naimark identifies Tiulpanov as the Soviet official who shaped the SED into “a party of a new type”; by 1946 his office was running politics in the zone.',
                sources: [S.newType, S.merger, S.naimark],
            },
            {
                ko: '1949년 5월 15~16일 제3차 인민회의 대표 선거는 「나는 독일의 통일과 정의로운 평화 조약에 찬성한다. 나는 다음의 후보 명부에 동의한다」는 문장에 찬반을 묻는 방식이었다. 유권자 약 1,350만 명 가운데 400만 명 넘게 반대에 표시했고, 공식 찬성률은 약 66%였다. 빈 투표용지 약 100만 장이 찬성으로 계산되었기 때문에 이 수치에도 의문이 남는다. 5월 29~30일 베를린에 모인 제3차 인민회의는 서독 기본법 공포 직후였는데, 점령지구 대표 1,400명과 서방 지구 대표 610명이 참석해 반대 한 표로 헌법안을 채택하고 제2차 인민평의회를 뽑았다.',
                en: 'The elections to the Third People’s Congress on 15–16 May 1949 asked voters to approve or reject a single statement: “I am for the unity of Germany and a just peace treaty. I agree to the following list of candidates.” More than four million of some 13.5 million eligible voters marked no; the official approval rate was about 66 per cent, and even that figure is doubtful because roughly a million blank ballots were counted as yes votes. Meeting in Berlin on 29–30 May, just after the West German Basic Law had been promulgated, the Third Congress, with 1,400 delegates from the zone and 610 from the western zones, adopted the draft constitution with one vote against and elected the Second People’s Council.',
                sources: [S.volkskongress],
            },
        ],
    },
    {
        heading: { ko: '1949년 10월: 늦게 온 국가', en: 'October 1949: a state that came late' },
        paragraphs: [
            {
                ko: '헌법은 준비되었지만 소련은 국가 수립을 서두르지 않았다. 1949년 9월 15일 콘라트 아데나워가 서독 총리로 선출된 이튿날, 피크·그로테볼·울브리히트 등 사회통일당 대표단이 비밀 협의를 위해 모스크바로 갔다. 이들은 국가 수립 방안을 내놓았지만, 소련 측과 짠 세부 일정에 스탈린이 서면 동의를 내리기까지 열흘을 기다려야 했고 스탈린을 직접 만나지는 못했다. 돌아온 뒤 예정되었던 선거는 1950년 중반으로 미뤄졌는데, 좋은 결과를 기대하던 기독교민주연합과 자유민주당은 이에 불만을 품었다.',
                en: 'The constitution was ready, but the Soviet Union was in no hurry to found a state. On 16 September 1949, the day after Konrad Adenauer was elected West German chancellor, an SED delegation including Pieck, Grotewohl and Ulbricht travelled to Moscow for secret consultations. They presented their proposals for founding the GDR but had to wait ten days for Stalin’s written approval of the detailed timetable worked out with Soviet officials, and never met him in person. On their return the planned elections were postponed to mid-1950, to the annoyance of the CDU and LDP, who had hoped for a good result.',
                sources: [S.founding],
            },
            {
                ko: '10월 7일 인민평의회는 독일경제위원회 건물에서 마지막 회의를 열고 스스로 임시 인민의회로 바뀌어 헌법을 발효시켰고, 그로테볼에게 정부 구성을 맡겼다. 헌법 조문과 그 뒤 며칠의 절차는 [베를린 봉쇄와 공수](/commulingo/events/berlin-blockade) 항목이 자세히 다룬다. 10월 10일 저녁 피크·그로테볼·울브리히트는 카를스호르스트의 추이코프 사령부를 찾았고, 추이코프는 행정 기능을 새 정부에 넘겼다. 1945년 5월 8일 독일의 항복 문서가 서명된 곳이었다. 군정청은 이날 소련 통제위원회로 바뀌었다. 11일 피크가 대통령으로 선출되었고, 그날 밤 공식 집계 20만 명의 자유독일청년단원이 운터 덴 린덴을 행진하며 호네커가 공화국에 대한 「청년의 서약」을 낭독했다. 12일 그로테볼 정부는 사회통일당과 네 블록 정당의 각료로 꾸려졌다.',
                en: 'On 7 October the People’s Council held its last session in the building of the German Economic Commission, reconstituted itself as the Provisional People’s Chamber, put the constitution into force and charged Grotewohl with forming a government. The constitution’s articles and the procedure of the following days are described in detail in [The Berlin Blockade and Airlift](/commulingo/events/berlin-blockade). On the evening of 10 October Pieck, Grotewohl and Ulbricht went to Chuikov’s headquarters in Karlshorst, where the German surrender had been signed on 8 May 1945, and Chuikov handed over administrative functions to the new government; SMAD became the Soviet Control Commission. On the 11th Pieck was elected president, and that night officially 200,000 FDJ members marched along Unter den Linden while Honecker read the “oath of youth” to the republic. On the 12th Grotewohl presented a government of SED and bloc-party ministers.',
                sources: [S.founding, S.smadDe],
            },
            {
                ko: '이웃 나라들에는 1945년부터 자국 정부가 있었는데, 소련 점령지구는 왜 1949년 10월까지 경제위원회 같은 보조 기관만 가진 채 국가가 되지 않았는가. 점령지구는 독립국이 아니라 네 나라가 함께 결정해야 하는 독일의 일부였고, 소련은 배상과 루르 공업, 독일 전체에 대한 발언권을 걸고 있었다. 스탈린은 1945년 6월 통일 독일을 위해 일하라고 주문했고, 동독 수립 뒤에도 한동안 통일 독일의 선택지를 열어 두었다. 사회통일당이 「사회주의 건설」을 선언한 것은 통일 협상이 막힌 1952년 7월이었다. 같은 해 3월 10일 스탈린은 중립 통일 독일을 제안하는 각서를 서방에 보냈다. 국가 수립의 순서도 이를 보여 준다. 서방의 런던 회의와 서독 기본법, 서독 정부가 먼저였고, 동독의 각 단계는 그 뒤를 따랐다.',
                en: 'Its neighbours had had governments of their own since 1945; why did the Soviet zone, with only auxiliary bodies such as the Economic Commission, not become a state until October 1949? The zone was not an independent country but part of a Germany whose future the four powers were to decide together, and the Soviet Union had reparations, the Ruhr’s industry and a say over all of Germany at stake. Stalin had told the German Communists in June 1945 to work for a unified Germany, and even after the GDR was founded he kept the option of a reunified Germany open for some time; the SED proclaimed the “building of socialism” only in July 1952, after the talks on unity had stalled. On 10 March of that year Stalin sent the Western powers a note proposing a neutral, unified Germany. The sequence of state-building points the same way: the Western London conference, the Basic Law and the West German government came first, and each East German step followed.',
                sources: [S.ulbrichtGroup, S.ulbricht, S.stalinNote, S.founding, S.volkskongress, S.dwk],
            },
        ],
    },
    {
        heading: { ko: '해석의 갈래: 계획이 있었는가, 원치 않은 아이였는가', en: 'Interpretations: a plan, or an unwanted child?' },
        paragraphs: [
            {
                ko: '동독의 공식 역사서술은 사회통일당의 창당을 노동계급의 통일 열망이 이룬 「자발적 결합」으로 설명하고 「강제 통합의 전설」을 부정했다. 서독 역사가들 가운데서도 「강제 통합」이라는 말이 지나치게 일방적이라며 받아들이지 않은 이들이 있었고, 헬가 그레빙은 2007년 이 말이 통합 과정의 복잡함을 담지 못한다고 썼다. 반면 하인리히 아우구스트 빙클러는 2002년 이 말이 진실에 가깝다고 썼고, 일코사샤 코발추크는 통합이 결국 소련 점령 당국이 사회민주당 지도자들에게 가한 압력으로만 가능했다고 보았다. 튀링겐을 연구한 슈테펜 카헬은 오랜 협력 전통이 있던 그곳에서는 통합이 1948년의 스탈린화 전까지 실제 지지를 받았다고 보았다. 러시아 문서고가 열린 뒤의 연구들은 통합이 민주적 의사 형성의 결과가 아니었고 독일 자신의 이해가 중심에 있지도 않았다는 데 대체로 일치한다.',
                en: 'Official East German historiography described the founding of the SED as a “voluntary union” born of the working class’s desire for unity and rejected the “legend of the forced merger”. Some West German historians, too, rejected the term “forced merger” as too one-sided, and in 2007 Helga Grebing wrote that it did not capture the complexity of the process. Heinrich August Winkler, on the other hand, wrote in 2002 that the term came close to the truth, and Ilko-Sascha Kowalczuk concluded that the merger came about only through the pressure the Soviet authorities exerted on leading Social Democrats. Steffen Kachel’s local study of Thuringia, with its long tradition of SPD–KPD cooperation, found genuine support for unity there until the Stalinisation of 1948. The monographs written since the Russian archives opened broadly agree that the merger was neither the result of democratic decision-making nor centred on genuinely German interests.',
                sources: [S.merger],
            },
            {
                ko: '소련 문서를 처음으로 폭넓게 쓴 연구는 노먼 네이마크의 『독일의 러시아인들』(1995)이었다. 네이마크는 소련이 「구체적인 장기 목표」나 세부 계획을 갖고 독일을 점령하지 않았다고 보았다. 점령은 기회주의, 원칙, 「볼셰비키적 성향」, 서방과의 갈등이 뒤섞인 결과였다. 소련은 독일 전체에 대한 우위, 나치의 청산, 「민주적·반파시즘」 독일, 배상, 그리고 대중의 지지를 함께 원했지만, 군대의 행동과 여러 소련 기관의 독자 행동, 자발성을 용납하지 않는 태도가 마지막 목표를 불가능하게 했다. 그래서 동독은 「진흙 발」로 태어났다는 것이 그의 결론이다. 1947~1948년의 소비에트화도 계획의 실행이라기보다 경제난, 소련과 사회통일당의 인기 하락, 동서 분열의 결과로 읽힌다.',
                en: 'The first study to draw extensively on Soviet records was Norman Naimark’s The Russians in Germany (1995). Naimark argued that the Soviets did not occupy Germany with “specific long-range goals” or a detailed plan; the occupation was shaped by a mixture of opportunism, principle, “Bolshevik predisposition” and conflict with the West. The Soviets wanted hegemony over all of Germany, the elimination of Nazism, a “democratic” and “antifascist” German state, reparations and popular support, but the army’s behaviour, the independent actions of several Soviet agencies and an unwillingness to tolerate spontaneity made the last goal impossible. The GDR, he concluded, was born with feet of clay. The Sovietisation of 1947–1948 appears in his account less as the execution of a plan than as the result of economic hardship, the unpopularity of the Soviets and the SED, and the deepening East–West split.',
                sources: [S.naimark],
            },
            {
                ko: '빌프리트 로트는 1994년 『스탈린의 원치 않은 아이: 모스크바는 왜 동독을 원하지 않았나』에서 더 나아갔다. 그는 피크의 메모를 근거로 스탈린이 별도의 사회주의 국가를 원하지 않았고 통일된 민주 독일을 진지하게 원했다고 주장했다. 별도 국가를 밀어붙인 것은 튤파노프와 울브리히트의 독자적 행동이었고 이는 「객관적으로」 스탈린의 의도에 반했으며, 스탈린이 1948년 8월 2일 말했듯 서방이 소련을 자기 지구에 정부를 세우도록 몰아갔고, 아데나워가 총리가 된 뒤에야 스탈린이 동독 수립에 동의했다는 것이다. 이 책은 격렬하고 긴 논쟁을 불렀다. 빙클러는 로트의 견해를 「기이하다」고 했고, 비판자들은 피크의 메모가 단어 몇 개뿐이라 해석의 여지가 크며 튤파노프에 대한 모스크바의 비판도 다르게 읽을 수 있다고 지적했다. 몰로토프 문서를 본 페터 루겐탈러는 1952년의 스탈린 각서가 서독의 서방 통합을 흔들기 위한 것이었다고 보았다.',
                en: 'Wilfried Loth went further in Stalin’s Unwanted Child: Why Moscow Did Not Want the GDR (1994). Drawing on Pieck’s notes, he argued that Stalin had not sought a separate socialist state and had seriously favoured a unified democratic Germany. It was Tiulpanov and Ulbricht who pushed for a separate state on their own initiative, “objectively” against Stalin’s intentions; as Stalin put it on 2 August 1948, the West forced the Soviet Union to install a government in its zone, and only after Adenauer became chancellor did Stalin assent to the GDR. The book set off a fierce and lasting controversy. Winkler called Loth’s views more or less “bizarre”, and critics noted that Pieck jotted down only key words, leaving much room for interpretation, and that Moscow’s criticism of Tiulpanov could be read differently. Peter Ruggenthaler, working from the Molotov papers, concluded that the 1952 Stalin Note was meant to destabilise West Germany’s integration with the West.',
                sources: [S.loth, S.tiulpanov],
            },
            {
                ko: '반대편 끝에는 게르하르트 베티히가 있다. 그는 「스탈린이 모든 것을 통제했다」는 결론 아래, 1945년 이후 스탈린이 약속한 「인민민주주의」가 철저한 소비에트화 계획과 모순되지 않았으며 서방이 볼셰비키의 민주주의 개념을 이해하지 못했을 뿐이라고 보았다. 그에게 소련의 독일 정책은 점령지구의 소비에트화를 확보하면서 서독에서의 영향력을 넓히려는 전술 변화와 선전의 연속이었다. 이 논쟁은 같은 사실, 곧 1945년 6월 스탈린의 통일 독일 발언, 1946년의 강제 통합, 1949년의 늦은 국가 수립을 서로 다르게 배열한다. 다툼은 무엇이 일어났는가보다 스탈린이 무엇을 원했는가에 있다.',
                en: 'At the other end stands Gerhard Wettig, whose verdict is that “Stalin controlled everything.” He argued that the “people’s democracy” Stalin promised after 1945 did not contradict a plan of thorough Sovietisation, and that the West simply failed to grasp the Bolshevik concept of democracy. For him Soviet German policy was a series of tactical shifts and propaganda campaigns designed to secure the Sovietisation of the eastern zone while extending influence in western Germany. The debate arranges the same facts, Stalin’s call for a unified Germany in June 1945, the forced merger of 1946 and the late founding of 1949, in different ways. What is disputed is less what happened than what Stalin wanted.',
                sources: [S.wettig, S.loth],
            },
        ],
    },
];

const event = buildEvent({
    id: 'soviet-zone-gdr-1945-1949',
    title: { ko: '동독: 소련 군정에서 독일민주공화국까지', en: 'East Germany: from Soviet military administration to the German Democratic Republic' },
    period: '1945–1949',
    sortOrder: 132,
    question: {
        ko: '1945년 소련 점령지구의 군정에서 1949년 10월 독일민주공화국 수립까지, 권력은 어떤 절차를 거쳐 독일사회통일당에 모였으며, 이 나라는 왜 다른 인민민주주의 국가보다 늦게 세워졌는가?',
        en: 'From the Soviet military government of 1945 to the founding of the German Democratic Republic in October 1949, through what procedures did power gather in the Socialist Unity Party, and why was this state founded later than the other people’s democracies?',
    },
    summary: {
        ko: '1945년 6월 카를스호르스트에 소련군정청이 세워졌고, 4월 말 모스크바에서 돌아온 울브리히트 그룹이 베를린 행정을 짰다. 6월 10일 정당 활동이 허가되어 공산당·사회민주당·기독교민주연합·자유민주당이 만장일치로 움직이는 반파시즘 블록을 이루었다. 소련은 공장 해체와 소련 주식회사로 배상을 거두었고, 특별수용소에는 15만여 명이 갇혔다. 1945년 9월 토지개혁으로 100헥타르 넘는 토지가 분배되었고, 1946년 6월 작센 주민투표가 공업 몰수를 승인했다. 1946년 4월 공산당과 사회민주당이 압력 속에 독일사회통일당으로 합쳐졌으나, 10월 선거에서 사회통일당은 어느 주에서도 과반을 얻지 못했고 베를린에서는 19.8%에 그쳤다. 1947년부터 독일경제위원회와 인민회의 운동이 국가의 골격을 만들었고, 사회통일당은 1948~49년 「새로운 형태의 당」이 되었다. 1949년 10월 7일 독일민주공화국이 수립되었다.',
        en: 'SMAD was set up at Karlshorst in June 1945, and the Ulbricht Group, back from Moscow at the end of April, organised Berlin’s administration. Parties were licensed on 10 June, and the KPD, SPD, CDU and LDP formed an antifascist bloc bound by unanimity. The Soviets took reparations through dismantling and Soviet joint-stock companies, and more than 150,000 people passed through the special camps. The land reform of September 1945 redistributed estates over 100 hectares, and the Saxony referendum of June 1946 approved industrial expropriation. In April 1946 the KPD and SPD were merged under pressure into the SED, which in the October elections won a majority in no state and only 19.8 per cent in Berlin. From 1947 the German Economic Commission and the People’s Congress movement built the framework of a state, and in 1948–49 the SED became a “party of a new type”. The GDR was founded on 7 October 1949.',
    },
    outcome: {
        ko: '1949년 10월의 동독에는 사회통일당이 지도하는 블록 정당 체제, 단일 명부에 찬반을 묻는 선거, 토지개혁과 몰수로 바뀐 소유 구조, 경제위원회에서 넘어온 중앙 행정, 그리고 소련 통제위원회로 이름을 바꾼 점령 당국이 자리 잡았다. 소련 주식회사와 배상은 1953년까지 이어졌고, 특별수용소는 1950년 동독에 넘겨졌다. 스탈린은 1952년 3월 중립 통일 독일을 제안했고 그 진의는 지금도 논쟁거리이며, 사회통일당은 같은 해 7월 「사회주의 건설」을 선언했다. 그 부담이 1953년 6월의 봉기로 이어졌다.',
        en: 'By October 1949 East Germany had an SED-led system of bloc parties, elections reduced to a yes-or-no vote on a single list, a property order reshaped by land reform and expropriation, a central administration inherited from the Economic Commission, and an occupation authority renamed the Soviet Control Commission. The Soviet joint-stock companies and reparations lasted until 1953, and the special camps were handed to the GDR in 1950. In March 1952 Stalin proposed a neutral, unified Germany, a proposal whose sincerity is still debated, and in July the SED proclaimed the “building of socialism”; its burdens led to the uprising of June 1953.',
    },
    sections,
    timeline: [
        ['1945.04.30', '울브리히트 그룹의 귀환', 'Return of the Ulbricht Group', '울브리히트가 이끄는 공산당 간부 열 명이 모스크바에서 날아와 5월 2일 브루흐뮐레에서 베를린 행정 재건을 시작했다.', 'Ten KPD cadres under Ulbricht flew in from Moscow and on 2 May began rebuilding Berlin’s administration from Bruchmühle.', ['east-germany', 'soviet'], P(52.5408, 13.8278, '브루흐뮐레', 'Bruchmühle')],
        ['1945.06.10', '군정청 명령 2호', 'SMAD Order No. 2', '하루 전 세워진 소련군정청이 반파시즘 정당과 단체의 결성을 허가했다.', 'The Soviet Military Administration, set up the day before, permitted antifascist parties and organisations.', ['east-germany', 'soviet'], P(52.4856, 13.5292, '베를린-카를스호르스트', 'Berlin-Karlshorst')],
        ['1945.06.11', '공산당 창당 호소문', 'KPD founding appeal', '공산당이 독일에 소비에트 체제를 강요하는 것은 잘못이라며 반파시즘 민주공화국을 목표로 내걸었다.', 'The KPD declared it wrong to impose the Soviet system on Germany and called for an antifascist democratic republic.', 'east-germany'],
        ['1945.07.14', '반파시즘 블록 결성', 'Antifascist bloc formed', '공산당·사회민주당·기독교민주연합·자유민주당이 만장일치로 결정하는 통일전선을 만들었다.', 'The KPD, SPD, CDU and LDP formed a united front whose decisions had to be unanimous.', 'east-germany'],
        ['1945.09.03', '토지개혁 시작', 'Land reform begins', '작센 지방을 시작으로 100헥타르 넘는 토지를 무상 몰수하는 시행령이 11일까지 잇달아 나왔다.', 'Beginning in the Province of Saxony, ordinances confiscating estates over 100 hectares without compensation followed until the 11th.', 'east-germany'],
        ['1946.03.31', '베를린 사회민주당 당원투표', 'Berlin SPD ballot', '서방 구역에서만 치러진 투표에서 82%가 즉각 통합에 반대했다.', 'In a ballot held only in the western sectors, 82 per cent rejected an immediate merger.', ['east-germany', 'germany']],
        ['1946.04.22', '독일사회통일당 창당', 'SED founded', '아트미랄스팔라스트의 통합대회가 공산당과 사회민주당을 합치고 피크와 그로테볼을 공동의장으로 뽑았다.', 'The unification congress in the Admiralspalast merged the KPD and SPD and elected Pieck and Grotewohl co-chairmen.', 'east-germany', P(52.5209, 13.3880, '아트미랄스팔라스트', 'Admiralspalast')],
        ['1946.06.30', '작센 주민투표', 'Saxony referendum', '전범·나치 기업의 몰수가 투표율 93.7%, 찬성 77.6%로 승인되었다.', 'Expropriation of the enterprises of war criminals and Nazis was approved by 77.6 per cent on a 93.7 per cent turnout.', 'east-germany', P(51.0504, 13.7373, '드레스덴', 'Dresden')],
        ['1946.10.20', '주의회·베를린 선거', 'State and Berlin elections', '사회통일당은 어느 주에서도 과반을 얻지 못했고 베를린에서는 19.8%로 3위였다.', 'The SED won a majority in no state and came third in Berlin with 19.8 per cent.', ['east-germany', 'germany']],
        ['1947.06.11', '독일경제위원회 설치', 'German Economic Commission', '군정청 명령 138호로 세워진 경제위원회가 1948년 2월 명령권을 얻어 사실상의 정부가 되었다.', 'Created by SMAD Order No. 138, the commission received the power to issue orders in February 1948 and became a de facto government.', ['east-germany', 'soviet']],
        ['1947.12.06', '제1차 독일 인민회의', 'First People’s Congress', '사회통일당 주도로 지명된 대표 약 2,000명이 베를린에서 독일 통일과 평화 조약을 요구했다.', 'Some 2,000 delegates nominated under SED leadership met in Berlin to demand German unity and a peace treaty.', 'east-germany'],
        ['1948.03.18', '독일 인민평의회 선출', 'People’s Council elected', '제2차 인민회의가 400명의 인민평의회를 뽑았고, 그 헌법위원회를 그로테볼이 이끌었다.', 'The Second People’s Congress elected the 400-member People’s Council, whose constitutional committee Grotewohl chaired.', 'east-germany'],
        ['1949.01', '「새로운 형태의 당」', '“Party of a new type”', '사회통일당 제1차 당협의회가 마르크스-레닌주의와 민주집중제를 채택하고 분파를 금지했다.', 'The SED’s First Party Conference adopted Marxism–Leninism and democratic centralism and banned factions.', 'east-germany'],
        ['1949.05.15', '단일 명부 투표', 'Single-list vote', '제3차 인민회의 선거에서 공식 찬성률은 약 66%였고 400만 명 넘게 반대했다.', 'In the vote for the Third People’s Congress the official approval rate was about 66 per cent, with more than four million voting no.', 'east-germany'],
        ['1949.10.07', '독일민주공화국 수립', 'GDR founded', '인민평의회가 임시 인민의회로 바뀌어 헌법을 발효시켰다.', 'The People’s Council reconstituted itself as the Provisional People’s Chamber and put the constitution into force.', 'east-germany', P(52.5096, 13.3837, '라이프치거 슈트라세의 경제위원회 건물', 'Economic Commission building, Leipziger Straße')],
        ['1949.10.10', '군정청에서 통제위원회로', 'From SMAD to Control Commission', '추이코프가 카를스호르스트에서 행정 기능을 새 정부에 넘기고 군정청은 소련 통제위원회가 되었다.', 'At Karlshorst Chuikov handed administrative functions to the new government, and SMAD became the Soviet Control Commission.', ['east-germany', 'soviet'], P(52.4856, 13.5292, '베를린-카를스호르스트', 'Berlin-Karlshorst')],
    ],
    locations: [
        ['베를린-카를스호르스트', 'Berlin-Karlshorst', 52.4856, 13.5292, 'main'],
        ['아트미랄스팔라스트', 'Admiralspalast', 52.5209, 13.3880, 'place'],
        ['라이프치거 슈트라세의 경제위원회 건물', 'Economic Commission building, Leipziger Straße', 52.5096, 13.3837, 'place'],
        ['브루흐뮐레', 'Bruchmühle', 52.5408, 13.8278, 'place'],
        ['드레스덴', 'Dresden', 51.0504, 13.7373, 'place'],
        ['부헨발트', 'Buchenwald', 51.0222, 11.2481, 'place'],
    ],
    countries: ['east-germany', 'soviet', 'germany'],
    relations: { parent: 'eastern-europe-peoples-democracies', related: ['yalta-potsdam', 'berlin-blockade', 'east-german-uprising-1953', 'berlin-wall'] },
    noAutoLink: ['민족전선', '국민전선', 'National Front', '임시정부', '명령 1호', 'Order No. 1', 'MAD'],
    focus: { ko: '독일 공산당과 독일사회통일당', en: 'The Communist Party of Germany and the Socialist Unity Party' },
    people: [
        ['walter-ulbricht', 'leader', '울브리히트 그룹 지도자, 사회통일당 부의장', 'Leader of the Ulbricht Group; SED deputy chairman', '1945년 4월 모스크바에서 돌아와 베를린 행정을 짰고, 1946년 사회통일당 부의장이 되었다.', 'Returned from Moscow in April 1945 to organise Berlin’s administration and became SED deputy chairman in 1946.'],
        ['wilhelm-pieck', 'leader', '공산당 의장, 사회통일당 공동의장, 초대 대통령', 'KPD chairman; SED co-chairman; first president', '1946년 4월 사회통일당 공동의장이 되었고, 1949년 10월 11일 동독 대통령으로 선출되었다.', 'Became SED co-chairman in April 1946 and was elected president of the GDR on 11 October 1949.'],
        ['otto-grotewohl', 'participant', '사회민주당 중앙위원회 의장, 사회통일당 공동의장, 초대 총리', 'SPD Central Committee chairman; SED co-chairman; first prime minister', '점령지구 사회민주당을 이끌고 통합에 응했으며, 인민평의회 헌법위원회를 맡은 뒤 1949년 정부를 구성했다.', 'Led the zone’s SPD into the merger, chaired the People’s Council’s constitutional committee and formed the government in 1949.'],
        ['stalin', 'leader', '소련 지도자', 'Soviet leader', '1945년 6월 4일 독일 공산당 지도부에 통일 독일을 위해 일하라고 주문했고, 1949년 9월 동독 수립에 서면 동의했다.', 'Told the German Communist leaders on 4 June 1945 to work for a unified Germany and gave written approval for the GDR in September 1949.'],
        ['zhukov', 'executor', '소련군정청 초대 최고사령관', 'First supreme chief of SMAD', '1945년 6월부터 1946년 봄까지 군정청과 독일 주둔 소련군을 이끌었다.', 'Headed SMAD and the Soviet forces in Germany from June 1945 to spring 1946.'],
        ['vasily-sokolovsky', 'executor', '소련군정청 최고사령관', 'Supreme chief of SMAD', '1946년부터 1949년 3월까지 군정청을 이끌었고, 1948년 2월 명령 32호로 경제위원회에 명령권을 주었다.', 'Headed SMAD from 1946 to March 1949 and gave the Economic Commission power to issue orders in February 1948.'],
        ['chuikov', 'executor', '마지막 군정청 최고사령관', 'Last supreme chief of SMAD', '1949년 10월 10일 카를스호르스트에서 행정 기능을 동독 정부에 넘기고 소련 통제위원회를 이끌었다.', 'Handed administrative functions to the GDR government at Karlshorst on 10 October 1949 and headed the Soviet Control Commission.'],
        ['vladimir-semyonov', 'executor', '소련군정청 정치고문', 'Political adviser to SMAD', '1946년부터 1949년까지 군정청 정치고문으로 모스크바 외무부와 직접 연결되어 있었다.', 'As SMAD’s political adviser from 1946 to 1949 he had a direct line to the Foreign Ministry in Moscow.'],
        ['serov', 'executor', '독일 주둔 내무인민위원부 전권대표', 'NKVD plenipotentiary in Germany', '1945년 7월 4일 임명되어 특별수용소를 관할했다.', 'Appointed on 4 July 1945, he was responsible for the special camps.'],
        ['beria', 'executor', '내무인민위원', 'People’s Commissar for Internal Affairs', '1945년 4월 18일 재판 없는 억류를 정한 명령 00315호를 내렸다.', 'Issued Order No. 00315 of 18 April 1945 providing for internment without trial.'],
        ['bogdan-kobulov', 'executor', '소련 주식회사 담당 부사령관', 'SMAD deputy chief for the Soviet joint-stock companies', '1947년 5월부터 1949년까지 군정청에서 소련 주식회사를 맡았다.', 'Oversaw the Soviet joint-stock companies within SMAD from May 1947 to 1949.'],
        ['dimitrov', 'participant', '소련공산당 국제정보부 간부', 'Official of the CPSU International Information Department', '1945년 4월 25일 피크와 함께 귀국하는 독일 공산당 간부들의 임무를 정했다.', 'Set out the tasks of the returning German Communist cadres with Pieck on 25 April 1945.'],
        ['zhdanov', 'participant', '소련공산당 정치국원', 'Soviet Politburo member', '1945년 6월 4일 스탈린과 독일 공산당 지도부의 회동에 함께했다.', 'Attended Stalin’s meeting with the German Communist leaders on 4 June 1945.'],
        ['erich-honecker', 'participant', '자유독일청년단 의장', 'Chairman of the Free German Youth', '1946년 3월 자유독일청년단을 창립했고, 1949년 10월 11일 「청년의 서약」을 낭독했다.', 'Founded the FDJ in March 1946 and read the “oath of youth” on 11 October 1949.'],
        ['ernst-reuter', 'opponent', '베를린 사회민주당 지도자', 'Berlin SPD leader', '1947년 시의회가 시장으로 뽑았으나 소련 측이 승인을 거부했다.', 'Elected mayor by the city council in 1947, but the Soviet authorities refused to confirm him.'],
        ['konrad-adenauer', 'participant', '서독 초대 총리', 'First West German chancellor', '1949년 9월 15일 그가 총리로 선출된 이튿날 사회통일당 대표단이 국가 수립을 협의하러 모스크바로 갔다.', 'The day after his election as chancellor on 15 September 1949, an SED delegation went to Moscow to arrange the founding of the GDR.'],
        ['lucius-d-clay', 'witness', '미국 군정장관', 'US military governor', '1946년 3월 베를린 사회민주당 당원투표에 처음에는 반대하며 관리이사회의 합의를 기대했다.', 'Initially opposed the Berlin SPD ballot of March 1946, hoping for agreement in the Control Council.'],
    ],
});

module.exports = { event };
