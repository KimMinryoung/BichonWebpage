#!/usr/bin/env node
// Czechoslovakia 1945–1948 (Košice to February) event batch (2026-09-29), a
// child of eastern-europe-peoples-democracies like the Polish, Romanian,
// Bulgarian and Hungarian documents. Source of truth for
// ../czechoslovakia-1945-1948-20260929.json and ../czechoslovakia-1945-1948-20260929-people.json.
// Edit here, run `node build.js`, commit the JSON with it.
const fs = require('fs');
const path = require('path');

const W = t => 'https://en.wikipedia.org/wiki/' + t;
const S = {
    coup: W('1948_Czechoslovak_coup_d%27%C3%A9tat'),
    third: W('Third_Czechoslovak_Republic'),
    fierlinger: W('Zden%C4%9Bk_Fierlinger'),
    expulsion: W('Expulsion_of_Germans_from_Czechoslovakia'),
    election1946: W('1946_Czechoslovak_parliamentary_election'),
    slovakDemocrats: W('Democratic_Party_(Slovakia,_1944)'),
    zenkl: W('Petr_Zenkl'),
    nosek: W('V%C3%A1clav_Nosek'),
    zorin: W('Valerian_Zorin'),
    svoboda: W('Ludv%C3%ADk_Svoboda'),
    masaryk: W('Jan_Masaryk'),
    clementis: W('Vladim%C3%ADr_Clementis'),
    constitution: W('Ninth-of-May_Constitution'),
    election1948: W('1948_Czechoslovak_parliamentary_election'),
    ripka: W('Hubert_Ripka'),
    horakova: W('Milada_Hor%C3%A1kov%C3%A1'),
    slansky: W('Rudolf_Sl%C3%A1nsk%C3%BD'),
    koCoup: 'https://ko.wikipedia.org/wiki/1948%EB%85%84_%EC%B2%B4%EC%BD%94%EC%8A%AC%EB%A1%9C%EB%B0%94%ED%82%A4%EC%95%84_%EC%BF%A0%EB%8D%B0%ED%83%80',
};

const sections = [
    {
        heading: { ko: '1945년: 코시체 강령과 민족전선', en: '1945: the Košice programme and the National Front' },
        paragraphs: [
            {
                ko: '1945년 4월 붉은군대가 해방한 동부 슬로바키아의 코시체에 런던에서 돌아온 베네시 대통령이 도착했고, 모스크바의 공산당 망명 지도부와 협상해 만든 코시체 정부강령으로 민족전선 연립정부가 출범했다. 총리는 소련과 가까운 사회민주당의 즈데네크 피를링게르였고, 내무부는 공산당의 바츨라프 노세크가 맡았다. 정부는 5월 10일 해방된 프라하로 옮겨 갔고, 6월 29일 소련의 압력 속에 카르파티아 루테니아를 우크라이나 소비에트 공화국에 넘기는 조약을 맺었다.',
                en: 'In April 1945 President Beneš, back from London, arrived in Košice in eastern Slovakia, liberated by the Red Army, and a National Front coalition took office on the Košice government programme negotiated with the Communist leaders exiled in Moscow. The prime minister was the pro-Soviet Social Democrat Zdeněk Fierlinger, and the Communist Václav Nosek held the interior ministry. The government moved to Prague after its liberation on 10 May, and on 29 June, under Soviet pressure, signed a treaty ceding Carpathian Ruthenia to the Ukrainian Soviet Republic.',
                sources: [S.third, S.fierlinger, S.coup],
            },
            {
                ko: '공산당 지도자 클레멘트 고트발트는 1945년 「당면 목표는 소비에트와 사회주의가 아니라 철저한 민주주의적 민족 혁명」이라고 말하며 당을 체코의 민주주의 전통과 반독일 민족 감정에 결합시켰다. 전쟁 중의 깨끗한 경력과 해방자 소련과의 연대로 공산당원은 1945년 4만 명에서 1948년 135만 명으로 늘었다. 1945년 10월 대통령 포고로 주요 산업이 국유화되었다.',
                en: 'In 1945 the Communist leader Klement Gottwald said that “the next goal is not soviets and socialism, but rather carrying out a really thorough democratic national revolution”, tying his party to the Czech democratic tradition and to anti-German national feeling. A clean wartime record and identification with the Soviet liberators lifted party membership from 40,000 in 1945 to 1.35 million in 1948. Presidential decrees of October 1945 nationalised the main industries.',
                sources: [S.coup, S.third],
            },
            {
                ko: '포츠담 회담의 결정에 따라 독일계 주민의 추방이 진행되었다. 전쟁 직후의 무질서한 「야만적 추방」에 이어 1946년 1월부터 10월까지 조직적 이송이 이루어져 약 130만 명이 미국 점령지구로, 약 80만 명이 소련 점령지구로 보내졌다. 1995년 독일·체코 공동 역사위원회는 사망자를 최소 1만 5천 명, 최대 3만 명으로 추산했다.',
                en: 'Following the decisions of the Potsdam Conference, the German population was expelled. After the disorderly “wild transfer” just after the war, organised transports from January to October 1946 sent about 1.3 million people to the American zone and some 800,000 to the Soviet zone. A joint German–Czech commission of historians in 1995 put the death toll at no fewer than 15,000 and at most 30,000.',
                sources: [S.expulsion],
            },
        ],
    },
    {
        heading: { ko: '1946년 선거와 고트발트 정부', en: 'The 1946 election and the Gottwald government' },
        paragraphs: [
            {
                ko: '1946년 5월 26일 제헌의회 선거에서 체코 공산당이 31.2%, 슬로바키아 공산당이 6.9%를 얻어 합쳐 38%로 제1당이 되었다. 유럽 공산당이 자유선거에서 거둔 최고 성적이었다. 페트르 젠클의 국민사회당이 18.4%, 인민당이 15.7%, 사회민주당이 12.1%였고, 슬로바키아에서는 민주당이 62%를 얻었다. 베네시는 고트발트를 총리로 지명했다.',
                en: 'In the Constituent Assembly election of 26 May 1946 the Czech Communists won 31.2 per cent and the Slovak Communists 6.9, together 38 per cent and first place — the best result a European Communist party ever achieved in a free election. Petr Zenkl’s National Socialists took 18.4 per cent, the People’s Party 15.7 and the Social Democrats 12.1, while in Slovakia the Democratic Party won 62 per cent. Beneš named Gottwald prime minister.',
                sources: [S.election1946, S.coup, S.slovakDemocrats],
            },
            {
                ko: '내각은 공산당 9명, 비공산당 17명으로 비공산당이 다수였지만, 공산당은 경찰과 군을 장악하고 선전·교육·사회복지·농업 부처와 관료 조직을 차지해 갔다. 베네시는 체코슬로바키아가 동과 서를 잇는 「다리」가 될 수 있다고 믿었다.',
                en: 'Non-Communists held a cabinet majority of seventeen to nine, but the Communists controlled the police and armed forces and came to dominate the ministries of propaganda, education, social welfare and agriculture as well as the civil service. Beneš believed Czechoslovakia could be a “bridge” between East and West.',
                sources: [S.coup, S.third],
            },
        ],
    },
    {
        heading: { ko: '1947년: 마셜 플랜 거부와 코민포름', en: '1947: the Marshall Plan refused and the Cominform' },
        paragraphs: [
            {
                ko: '1947년 7월 스탈린은 체코슬로바키아의 마셜 플랜 참여에 개입했고, 정부는 참가 결정을 번복했다. 동서를 잇는 다리라는 베네시의 구상은 무너졌다. 그해 여름 공산당의 인기는 크게 떨어져 있었다. 노세크의 경찰은 많은 시민의 반감을 샀고, 농민은 집단화 논의에, 노동자는 임금 없는 증산 요구에 반발했다. 1948년 5월 선거에서 공산당이 크게 질 것이라는 예상이 일반적이었다.',
                en: 'In July 1947 Stalin intervened against Czechoslovak participation in the Marshall Plan and the government reversed its acceptance; Beneš’s idea of a bridge between East and West collapsed. By that summer the Communists’ popularity had fallen sharply: Nosek’s police offended many citizens, farmers objected to talk of collectivisation and workers resented demands for more output without higher pay. The general expectation was that the Communists would be soundly beaten in the May 1948 elections.',
                sources: [S.third, S.coup],
            },
            {
                ko: '9월 코민포름 창립 회의에서 즈다노프는 체코슬로바키아만이 「권력 다툼이 아직 결정되지 않은」 나라라고 지적했고, 공산당 서기장 루돌프 슬란스키는 「국내 전선에서도 공세로 넘어갔다」며 권력 장악 계획을 들고 돌아왔다. 같은 달 외무장관 얀 마사리크, 부총리 젠클, 법무장관 프로코프 드르티나에게 폭발물이 든 상자가 배달되었다. 슬로바키아에서는 1947~1948년 공산당이 중앙정부의 다수를 이용해 선거 승자인 민주당의 권력을 빼앗았다.',
                en: 'At the founding meeting of the Cominform in September Zhdanov observed that Czechoslovakia was the one country “where the power contest still remains undecided”, and the Communist general secretary Rudolf Slánský returned with a plan to take power, declaring that “we have gone on the offensive on the domestic front as well”. That month Foreign Minister Jan Masaryk, Deputy Prime Minister Zenkl and Justice Minister Prokop Drtina received boxes containing explosives. In Slovakia the Communists, using their majority in the central government, stripped the Democratic Party that had won the election of its power in 1947–1948.',
                sources: [S.coup, S.zenkl, S.slovakDemocrats],
            },
        ],
    },
    {
        heading: { ko: '1948년 2월', en: 'February 1948' },
        paragraphs: [
            {
                ko: '1948년 2월 노세크는 국민보안대에 남아 있던 비공산당 간부들을 숙청하려 했다. 내각이 다수결로 비공산당 경찰 간부 8명의 복직을 결정했지만 노세크는 고트발트의 지지 속에 거부했다. 2월 21일 국민사회당·인민당·슬로바키아 민주당의 장관 12명이 항의 사임했다. 그들은 베네시가 사표를 받지 않으리라 기대했지만, 피를링게르의 사회민주당 장관들은 자리를 지키며 공산당 편에 섰다.',
                en: 'In February 1948 Nosek set out to purge the remaining non-Communist officers of the National Police. When the cabinet voted by majority to reinstate eight non-Communist senior officers, Nosek, backed by Gottwald, refused. On 21 February twelve ministers of the National Socialist, People’s and Slovak Democratic parties resigned in protest, expecting Beneš to refuse their resignations — but the Social Democratic ministers under Fierlinger stayed and sided with the Communists.',
                sources: [S.coup, S.nosek, S.fierlinger],
            },
            {
                ko: '공산당은 아래로부터 권력 장악을 조직했다. 1945~1947년 주체코 대사였던 소련 외무차관 발레리안 조린이 프라하에 돌아와 마지막 준비를 도왔다. 무장한 노동자 민병대와 경찰이 프라하를 장악했고, 공산당 「행동위원회」가 관청과 기관에서 반대파를 몰아냈으며, 반공 학생 시위는 해산되었다. 사임한 장관들은 자기 부처에 들어가지 못했다. 고트발트는 10만 명 앞에서 베네시가 공산당 주도의 정부를 받아들이지 않으면 총파업을 벌이겠다고 위협했다. 조린이 국경의 소련군 지원을 제안했지만 고트발트는 필요 없다고 답했다.',
                en: 'The Communists organised the seizure of power from below. Valerian Zorin, Soviet deputy foreign minister and ambassador in Prague from 1945 to 1947, returned to help with the final arrangements. Armed workers’ militia and police took over Prague, Communist “Action Committees” drove opponents out of offices and institutions, and an anti-Communist student demonstration was broken up; the resigning ministers were barred from their own ministries. Before 100,000 people Gottwald threatened a general strike unless Beneš accepted a Communist-led government. Zorin offered the Red Army on the borders, but Gottwald declined.',
                sources: [S.coup, S.zorin],
            },
            {
                ko: '형식상 무소속인 국방장관 루드비크 스보보다는 군을 병영에 묶어 두었고, 군은 개입하지 않았다. 1945년부터 건강이 나빴던 베네시는 내전과 소련군 개입을 두려워해 2월 25일 사표를 수리하고 고트발트가 제시한 새 내각을 승인했다. 25명 가운데 공산당원이 13명이었고, 나머지 정당 몫의 장관들도 공산당이 고른 동조자들이었다.',
                en: 'The formally non-party Defence Minister Ludvík Svoboda kept the army in its barracks, and it did not intervene. Beneš, in poor health since 1945 and fearing civil war and Soviet intervention, accepted the resignations on 25 February and approved the new cabinet Gottwald proposed. Thirteen of its twenty-five members were Communists, and the ministers under other party labels were fellow travellers hand-picked by the Communists.',
                sources: [S.coup, S.svoboda],
            },
        ],
    },
    {
        heading: { ko: '마사리크의 죽음과 인민민주주의 헌법', en: 'Masaryk’s death and the people’s democratic constitution' },
        paragraphs: [
            {
                ko: '공산당원도 동조자도 아닌 유일한 중진이던 외무장관 얀 마사리크는 3월 10일 체르닌 궁 창문 아래에서 숨진 채 발견되었다. 자살이라는 견해와 살해되었다는 의혹이 맞섰고, 2021년 종결된 수사는 살해·사고·자살 모두 가능하다고 결론지었다. 외무장관 자리는 슬로바키아 공산주의자 블라디미르 클레멘티스가 이었다.',
                en: 'Foreign Minister Jan Masaryk, the only senior minister who was neither a Communist nor a fellow traveller, was found dead beneath a window of the Czernin Palace on 10 March. Suicide and murder were both alleged, and an investigation closed in 2021 found murder, accident and suicide all possible. The Slovak Communist Vladimír Clementis succeeded him as foreign minister.',
                sources: [S.coup, S.masaryk, S.clementis],
            },
            {
                ko: '공산당은 빠르게 권력을 굳혔다. 수천 명이 해고되고 수백 명이 체포되었으며, 수천 명이 나라를 떠났다. 사임한 국민사회당의 젠클과 대외무역장관 후베르트 립카도 망명했다. 3월 의회는 230 대 0으로 새 정부를 신임했다. 5월 9일 의회는 체코슬로바키아를 「인민민주주의 국가」로 선언한 헌법을 채택했지만 베네시는 서명을 거부했다. 5월 30일 민족전선 단일 명부 선거는 공식적으로 89.2%를 얻었고, 공산당은 명부 안에서 214석의 절대다수를 차지했다.',
                en: 'The Communists consolidated fast: thousands were fired, hundreds arrested and thousands fled, among them the National Socialist leader Zenkl and Foreign Trade Minister Hubert Ripka. In March parliament gave the new government a unanimous 230–0 vote of confidence. On 9 May it adopted a constitution declaring Czechoslovakia a “people’s democratic state”, which Beneš refused to sign. In the single-list National Front election of 30 May the list officially won 89.2 per cent, and within it the Communists held an absolute majority of 214 seats.',
                sources: [S.coup, S.zenkl, S.ripka, S.constitution, S.election1948],
            },
            {
                ko: '6월 사회민주당은 공산당에 흡수되었다. 베네시는 6월 초 사임했고, 14일 고트발트가 대통령이 되었다. 9월 베네시가 숨지자 장례에는 말없는 군중이 모여 그와 함께 사라진 민주주의를 애도했다. 공산당 정권은 이 사건을 「승리의 2월」이라 불렀다.',
                en: 'In June the Social Democrats were absorbed into the Communist Party. Beneš resigned in early June and on the 14th Gottwald became president. When Beneš died in September, a vast silent crowd came to his funeral to mourn him and the democracy he had stood for. The Communist regime called the events “Victorious February”.',
                sources: [S.coup, S.fierlinger],
            },
        ],
    },
    {
        heading: { ko: '여파: 냉전과 재판', en: 'Aftermath: the Cold War and the trials' },
        paragraphs: [
            {
                ko: '동유럽의 마지막 자유민주주의가 무너지자 서방은 충격을 받았다. 한 달 뒤 서유럽 동맹인 브뤼셀 조약이 맺어졌고, 마셜 플랜의 신속한 승인과 서독 국가 수립, 1년 뒤 북대서양 조약 기구 창설에 박차가 가해졌다. 위기가 이어진 2월 20~27일 서방 외무장관들은 런던에 모여 있었다.',
                en: 'The fall of Eastern Europe’s last liberal democracy shocked the West. The Brussels Treaty of Western European alliance followed a month later, and the coup spurred quick adoption of the Marshall Plan, the creation of a West German state and, a year later, NATO. Western foreign ministers were meeting in London throughout the crisis of 20–27 February.',
                sources: [S.coup],
            },
            {
                ko: '공포는 곧 안으로 향했다. 쿠데타 직후 의원직을 내놓고 망명하지 않은 국민사회당의 밀라다 호라코바는 1949년 체포되어 조작된 음모·반역 혐의로 재판을 받았다. 아인슈타인과 처칠, 엘리너 루스벨트가 구명을 호소했으나 1950년 6월 27일 교수형에 처해졌다. 권력 장악의 설계자였던 슬란스키와 외무장관 클레멘티스도 1952년 슬란스키 재판에서 「티토주의」 등의 혐의로 처형되었다.',
                en: 'The terror soon turned inward. Milada Horáková of the National Socialists, who resigned her seat after the coup and chose not to emigrate, was arrested in 1949 and tried on fabricated charges of conspiracy and treason; despite appeals from Einstein, Churchill and Eleanor Roosevelt she was hanged on 27 June 1950. Slánský, the architect of the takeover, and Foreign Minister Clementis were themselves executed after the Slánský trial of 1952 on charges including “Titoism”.',
                sources: [S.horakova, S.slansky, S.clementis],
            },
        ],
    },
];

const P = (lat, lng, ko, en) => ({ kind: 'point', lat, lng, label: { ko, en } });
const timeline = [
    ['1945.04.05', '코시체 정부강령', 'Košice government programme', '민족전선 연립정부가 코시체에서 출범했다.', 'The National Front coalition government took office in Košice.', 'czechoslovakia', P(48.72, 21.26, '코시체', 'Košice')],
    ['1945.05.10', '정부의 프라하 귀환', 'Government returns to Prague', '해방된 수도로 정부가 옮겨 갔다.', 'The government moved to the liberated capital.', 'czechoslovakia'],
    ['1945.06.29', '카르파티아 루테니아 할양', 'Carpathian Ruthenia ceded', '소련의 압력 속에 우크라이나 소비에트 공화국에 넘겼다.', 'Under Soviet pressure it was ceded to the Ukrainian Soviet Republic.', ['czechoslovakia', 'soviet']],
    ['1945.10', '국유화 포고', 'Nationalisation decrees', '대통령 포고로 주요 산업이 국유화되었다.', 'Presidential decrees nationalised the main industries.', 'czechoslovakia'],
    ['1946.01', '독일계 주민의 조직적 이송', 'Organised expulsion of Germans', '10월까지 약 210만 명이 미국·소련 점령지구로 보내졌다.', 'By October some 2.1 million had been sent to the American and Soviet zones.', 'czechoslovakia'],
    ['1946.05.26', '제헌의회 선거', 'Constituent Assembly election', '공산당이 38%로 제1당이 되었고 고트발트가 총리가 되었다.', 'The Communists came first with 38 per cent and Gottwald became prime minister.', 'czechoslovakia'],
    ['1947.07', '마셜 플랜 참가 번복', 'Marshall Plan acceptance reversed', '스탈린의 개입으로 정부가 참가 결정을 뒤집었다.', 'After Stalin intervened the government reversed its acceptance.', ['czechoslovakia', 'soviet'], P(55.75, 37.62, '모스크바', 'Moscow')],
    ['1947.09', '코민포름 창립과 폭탄 상자', 'Cominform founded; parcel bombs', '즈다노프가 체코슬로바키아를 미결정 국가로 지목했고, 비공산당 장관 셋에게 폭발물 상자가 배달되었다.', 'Zhdanov singled out Czechoslovakia as undecided; three non-Communist ministers received explosive parcels.', ['poland', 'czechoslovakia'], P(50.83, 15.52, '슈클라르스카포레바', 'Szklarska Poręba')],
    ['1948.02.21', '비공산당 장관 12명 사임', 'Twelve ministers resign', '경찰 숙청에 항의해 사임했으나 사회민주당은 남았다.', 'They resigned over the police purge, but the Social Democrats stayed.', 'czechoslovakia', P(50.087, 14.421, '프라하', 'Prague')],
    ['1948.02.25', '베네시의 굴복', 'Beneš gives way', '사표를 수리하고 공산당 주도의 새 내각을 승인했다.', 'He accepted the resignations and a Communist-led cabinet.', 'czechoslovakia'],
    ['1948.03.10', '얀 마사리크의 죽음', 'Death of Jan Masaryk', '외무장관이 체르닌 궁 창문 아래에서 숨진 채 발견되었다.', 'The foreign minister was found dead beneath a window of the Czernin Palace.', 'czechoslovakia'],
    ['1948.05.09', '5월 9일 헌법', 'Ninth-of-May Constitution', '「인민민주주의 국가」를 선언했고 베네시는 서명을 거부했다.', 'It declared a “people’s democratic state”; Beneš refused to sign.', 'czechoslovakia'],
    ['1948.05.30', '단일 명부 선거', 'Single-list election', '민족전선 명부가 공식적으로 89.2%를 얻었다.', 'The National Front list officially won 89.2 per cent.', 'czechoslovakia'],
    ['1948.06.14', '고트발트 대통령 취임', 'Gottwald becomes president', '베네시가 사임하고 고트발트가 뒤를 이었다.', 'Beneš resigned and Gottwald succeeded him.', 'czechoslovakia'],
].map(([date, tko, ten, bko, ben, country, geo]) => ({
    date, title: { ko: tko, en: ten }, body: { ko: bko, en: ben }, country: Array.isArray(country) ? country : [country], ...(geo ? { geo } : {}),
}));

const people = [
    ['klement-gottwald', 'leader', '공산당 의장 · 총리', 'Communist chairman, prime minister', '1946년 총리가 되어 2월 권력 장악을 이끌고 6월 대통령이 되었다.', 'Prime minister from 1946, he led the February takeover and became president in June.'],
    ['rudolf-slansky', 'leader', '공산당 서기장', 'Communist general secretary', '코민포름에서 권력 장악 계획을 들고 돌아왔고 1952년 처형되었다.', 'Brought the plan for taking power back from the Cominform; executed in 1952.'],
    ['stalin', 'leader', '소련 지도자', 'Soviet leader', '마셜 플랜 참여를 막고 고트발트에게 권력 장악을 지시했다.', 'Blocked the Marshall Plan and ordered Gottwald to seize power.'],
    ['vaclav-nosek', 'executor', '내무장관', 'Interior minister', '경찰 숙청으로 위기를 촉발하고 내각의 복직 결정을 거부했다.', 'Triggered the crisis by purging the police and defied the cabinet’s reinstatement vote.'],
    ['antonin-zapotocky', 'participant', '노동조합 중앙평의회 의장', 'Chairman of the trade-union central council', '노동조합 중앙평의회 의장이자 당 간부회 위원으로, 2월 사건 뒤 6월 고트발트의 뒤를 이어 총리가 되었다.', 'Chairman of the trade-union central council and a party presidium member, he succeeded Gottwald as prime minister in June 1948.'],
    ['valerian-zorin', 'executor', '소련 외무차관', 'Soviet deputy foreign minister', '프라하에 돌아와 권력 장악의 마지막 준비를 도왔다.', 'Returned to Prague to help with the final arrangements of the takeover.'],
    ['zdenek-fierlinger', 'participant', '사회민주당 지도자', 'Social Democratic leader', '사임하지 않고 공산당 편에 섰으며 당을 공산당에 합쳤다.', 'Stayed in government on the Communist side and merged his party into it.'],
    ['ludvik-svoboda', 'participant', '국방장관', 'Defence minister', '군을 병영에 묶어 개입하지 않게 했다.', 'Kept the army in barracks so that it did not intervene.'],
    ['vladimir-clementis', 'participant', '마사리크의 후임 외무장관', 'Masaryk’s successor as foreign minister', '1948년 외무장관이 되었고 1952년 슬란스키 재판에서 처형되었다.', 'Became foreign minister in 1948 and was executed after the Slánský trial of 1952.'],
    ['jan-masaryk', 'participant', '외무장관', 'Foreign minister', '사임하지 않은 유일한 비공산당 중진으로 3월 10일 숨진 채 발견되었다.', 'The only senior non-Communist to stay, he was found dead on 10 March.'],
    ['edvard-benes', 'opponent', '대통령', 'President', '공산당 주도 정부를 거부하다 2월 25일 굴복했고, 헌법 서명을 거부한 뒤 사임했다.', 'Resisted a Communist-led government until giving way on 25 February, refused to sign the constitution and resigned.'],
    ['petr-zenkl', 'opponent', '국민사회당 의장 · 부총리', 'National Socialist chairman, deputy prime minister', '장관 사임을 이끌었고 쿠데타 뒤 망명했다.', 'Led the ministers’ resignation and went into exile after the coup.'],
    ['hubert-ripka', 'opponent', '대외무역장관', 'Foreign trade minister', '사임한 장관 가운데 하나로 쿠데타 뒤 다시 망명했다.', 'One of the resigning ministers, he went back into exile after the coup.'],
    ['milada-horakova', 'opponent', '국민사회당 의원', 'National Socialist deputy', '쿠데타에 항의해 의원직을 내놓았고 1950년 처형되었다.', 'Resigned her seat in protest at the coup and was executed in 1950.'],
].map(([person_id, relation_kind, relation_ko, relation_en, note_ko, note_en], sort_order) => ({
    person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en,
}));

const sources = [];
for (const s of sections) for (const p of s.paragraphs) for (const u of p.sources) if (!sources.includes(u)) sources.push(u);
const body = lang => sections.map(s => '## ' + s.heading[lang] + '\n\n' + s.paragraphs.map(p =>
    p[lang] + ' ' + p.sources.map(u => `[${sources.indexOf(u) + 1}](${u})`).join(' ')).join('\n\n')).join('\n\n');

const event = {
    id: 'czechoslovakia-1945-1948',
    expected: null,
    fields: {
        title_ko: '체코슬로바키아: 코시체 강령에서 2월 사건까지',
        title_en: 'Czechoslovakia: from the Košice programme to February 1948',
        period_label: '1945–1948',
        sort_order: 131,
        question_ko: '자유선거에서 38%를 얻은 공산당은 왜 1948년 2월 선거가 아닌 거리와 경찰로 권력을 잡았는가?',
        question_en: 'Why did a Communist party that had won 38 per cent in a free election take power in February 1948 through the streets and the police rather than the ballot?',
        summary_ko: '1945년 코시체 강령으로 출범한 민족전선 연립정부에서 공산당은 1946년 자유선거 제1당이 되어 고트발트 정부를 세웠다. 1947년 마셜 플랜 거부 뒤 인기가 떨어지자, 공산당은 1948년 2월 경찰 숙청에 항의한 비공산당 장관들의 사임을 기회로 행동위원회·민병대·총파업 위협으로 베네시를 굴복시켰다. 5월 헌법과 단일 명부 선거로 체코슬로바키아는 인민민주주의 국가가 되었다.',
        summary_en: 'In the National Front coalition launched by the Košice programme of 1945, the Communists came first in the free election of 1946 and formed Gottwald’s government. When their popularity fell after the Marshall Plan was refused in 1947, they turned the resignation of non-Communist ministers over a police purge in February 1948 into a seizure of power, forcing Beneš to give way with action committees, militia and the threat of a general strike. The May constitution and a single-list election made Czechoslovakia a people’s democracy.',
        outcome_ko: '동유럽에서 다당제와 언론 자유를 유지하던 마지막 나라가 공산당 일당 체제가 되어 1989년까지 이어졌다. 사건은 서방의 브뤼셀 조약과 북대서양 조약 기구 창설을 재촉했고, 공포 정치는 곧 호라코바 재판과 슬란스키 재판으로 이어졌다.',
        outcome_en: 'The last country in Eastern Europe with multi-party politics and a free press became a Communist one-party state until 1989. The events hastened the Brussels Treaty and the founding of NATO in the West, and the terror soon led to the Horáková and Slánský trials.',
        body_ko: body('ko'),
        body_en: body('en'),
        timeline,
        sources,
        locations: [
            { label: { ko: '프라하', en: 'Prague' }, lat: 50.0755, lng: 14.4378, kind: 'main' },
            { label: { ko: '코시체', en: 'Košice' }, lat: 48.72, lng: 21.26, kind: 'place' },
            { label: { ko: '브라티슬라바', en: 'Bratislava' }, lat: 48.15, lng: 17.11, kind: 'place' },
        ],
        countries: ['czechoslovakia', 'soviet', 'poland'],
        relations: { parent: 'eastern-europe-peoples-democracies' },
        no_auto_link: [],
        link_expressions: [],
        focus: { ko: '체코슬로바키아 공산당', en: 'The Communist Party of Czechoslovakia' },
    },
    sections,
    people,
};

fs.writeFileSync(path.join(__dirname, '..', 'czechoslovakia-1945-1948-20260929.json'),
    JSON.stringify({ id: 'czechoslovakia-1945-1948-20260929', events: [event] }, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, '..', 'czechoslovakia-1945-1948-20260929-people.json'),
    JSON.stringify({ changedBy: 'czechoslovakia-1945-1948-20260929', people: require('./people') }, null, 2) + '\n');
console.log(`event ${event.id}: ${sections.length} sections, ${sources.length} sources, ${timeline.length} timeline, ${people.length} relations`);
