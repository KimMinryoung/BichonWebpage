// The East German uprising of June 1953 (2026-10-02). Child of the overview
// eastern-europe-crisis-1953-1956, next to hungary-new-course-1953,
// poznan-1956 and hungarian-revolution. Built with the Baltic batch's lib.js.
// Fetched source excerpts: temp_dev/east-germany/src/1953-*.
const { W, P, event: buildEvent } = require('../baltic-1940-1953-20261002/lib');

const E = t => W(encodeURI(t));
const DE = t => 'https://de.wikipedia.org/wiki/' + encodeURI(t);
const C = id => `https://www.17juni53.de/chronik/${id}.html`;
const S = {
    en: E('East_German_uprising_of_1953'),
    de: DE('Aufstand_vom_17._Juni_1953'),
    c5207: C('5207'),
    c5209: C('5209'),
    c5303: C('5303'),
    c5305: C('5305'),
    c0602: C('530602'),
    c0609: C('530609'),
    c0611: C('530611'),
    c0612: C('530612'),
    c0615: C('530615'),
    c0616: C('530616'),
    c0617: C('530617'),
    c0626: C('530626'),
    c5307: C('5307'),
    tote: 'https://www.17juni53.de/tote/recherche.html',
    goettling: 'https://www.17juni53.de/tote/goettling.html',
    fricke: 'https://www.bpb.de/shop/zeitschriften/apuz/27597/die-nationale-dimension-des-17-juni-1953/',
    kowalczuk: 'https://boeckler.de/43723_43733.htm',
    herrnstadt: DE('Rudolf_Herrnstadt'),
    stasi: E('Stasi'),
    kampf: DE('Kampfgruppen_der_Arbeiterklasse'),
    brecht: E('Bertolt_Brecht'),
    loesung: DE('Die_Lösung_(Gedicht)'),
    grechko: E('Andrei_Grechko'),
    beria: E('Lavrentiy_Beria'),
    state: 'https://history.state.gov/milestones/1953-1960/east-german-uprising',
    ostermann: 'https://www.wilsoncenter.org/publication/the-united-states-the-east-german-uprising-1953-and-the-limits-rollback',
    nagy: E('Imre_Nagy'),
};
const ev = id => `/commulingo/events/${id}`;

const sections = [
    {
        heading: { ko: '「사회주의 건설」의 대가: 1952~1953년의 위기', en: 'The price of “building socialism”: the crisis of 1952–1953' },
        paragraphs: [
            {
                ko: '1952년 5월 서독이 중립 통일 독일을 제안한 「스탈린 각서」를 물리치고 유럽방위공동체 조약에 서명하자, 동독의 집권당 독일 사회주의통일당의 서기장 발터 울브리히트는 이를 동독에서 사회주의 건설을 서둘러도 좋다는 신호로 받아들였다. 7월 9일부터 12일까지 동베를린 베르너 젤렌빈더 홀에서 열린 제2차 당 협의회에서 울브리히트는 마지막 날 「사회주의 기초의 계획적 건설」을 선포했다. 협의회는 농업 집단화와 재무장을 비롯해 경제·행정·사법 전반의 개편을 결정했다. 다섯 개 주는 14개 「지구(Bezirk)」로 바뀌었고 동베를린이 열다섯 번째 행정 단위가 되었으며, 막 꾸려지던 병영인민경찰은 「인민군」으로 키워질 예정이었다. 동독 국가가 세워지기까지의 과정은 「[동독: 소련 군정에서 독일민주공화국까지](' + ev('soviet-zone-gdr-1945-1949') + ')」 항목이 다룬다.',
                en: 'In May 1952 West Germany rejected the “Stalin Note”, which had offered a neutral, reunified Germany, and signed the European Defence Community treaty instead. Walter Ulbricht, General Secretary of the ruling Socialist Unity Party of Germany (SED), read this as a green light to accelerate the building of socialism in East Germany. At the SED’s Second Party Conference, held in the Werner-Seelenbinder-Halle in East Berlin from 9 to 12 July, Ulbricht proclaimed on the final day the “planned construction of the foundations of socialism”. The conference resolved on sweeping changes to the economy, administration and judiciary, collectivisation and rearmament among them. The five Länder were replaced by fourteen districts (Bezirke), with East Berlin as a fifteenth unit, and the Barracked People’s Police, then being built up, was to become a “people’s army”. How the East German state came into being is told in [East Germany: from Soviet military administration to the German Democratic Republic](' + ev('soviet-zone-gdr-1945-1949') + ').',
                sources: [S.en, S.de, S.c5207],
            },
            {
                ko: '대가는 곧바로 생활로 돌아왔다. 병영인민경찰 건설로 1952년 군사비는 33억 마르크, 국가 예산의 8.4%로 불어났고, 재무장비와 점령 비용·배상 같은 전쟁의 뒷감당이 1952년 예산의 22%, 1953년에는 18% 넘게 묶였다. 투자는 동독에 기반이 거의 없던 중공업으로 몰렸고, 저녁마다 산업용 전력을 대려고 가정의 전기를 끊었다. 1952년 가을 수확은 평년을 크게 밑돌아, 주민이 손에 쥘 수 있는 고기와 지방은 전쟁 전의 절반에 그쳤다. 배급표 없이 살 수 있는 국영 상점(HO)의 값은 서독보다 훨씬 비싸서, 서독에서 50페니히 하는 초콜릿 한 판이 동독에서는 8마르크였다. 1952년 11월부터 켐니츠·드레스덴·라이프치히·할레·줄 같은 공업 중심지에서는 산발적인 식량 소요와 작업장 분규가 일어났다.',
                en: 'The cost soon came home. Building up the Barracked People’s Police drove military spending in 1952 to 3.3 billion marks, 8.4 per cent of the budget, and armaments together with the burdens left by the war — occupation costs and reparations — absorbed 22 per cent of the 1952 budget and more than 18 per cent in 1953. Investment flowed into heavy industry, for which East Germany had almost no base, and household electricity was cut off at dusk to meet industrial peak demand. The autumn harvest of 1952 was well below average, leaving people with half the pre-war quantity of meat and fat. In the state HO shops, where goods could be bought without ration coupons, prices were far above West German levels: a bar of chocolate that cost 50 pfennigs in the West cost eight marks in the East. From November 1952 there were sporadic food riots and industrial unrest in Chemnitz, Dresden, Leipzig, Halle and Suhl.',
                sources: [S.de, S.en],
            },
            {
                ko: '농촌과 중간층은 더 직접적인 압박을 받았다. 개인 농민과 수공업자·상인은 공출과 세금이 오르고 식료품·의복·연료 배급에서 빠졌다. 1952년 9월 493개였던 농업생산협동조합(LPG)은 이듬해 3월 2,787개로 늘었지만, 같은 3월 한 달에만 2,641명의 농민이 농장을 버렸다. 교회도 표적이었다. 정권은 개신교 청년 조직 「청년회(Junge Gemeinde)」를 「불법 조직」으로 몰아 학생 담당 목사와 청년 지도자들을 투옥하고, 교회 수련원을 자유독일청년단에 넘겼으며, 신앙을 밝힌 고등학생을 졸업 시험 직전에 퇴학시키기도 했다. 1953년 5월 오토 그로테볼 총리는 청년회를 「싸워 없애야 할 미 제국주의의 위장 조직」이라 불렀다.',
                en: 'Farmers and the middle strata felt the pressure more directly. Independent farmers, artisans and shopkeepers faced higher delivery quotas and taxes and were excluded from the ration system for food, clothing and fuel. The number of agricultural production co-operatives (LPGs) rose from 493 in September 1952 to 2,787 in March 1953, yet in that March alone 2,641 farmers abandoned their farms. The churches were a target too. The regime branded the Protestant youth organisation, the Junge Gemeinde, an “illegal organisation”, jailed student chaplains and youth leaders, handed church retreat houses to the Free German Youth, and sometimes expelled pupils who professed their faith just before their final school examinations. In May 1953 Prime Minister Otto Grotewohl called the Junge Gemeinde “a cover organisation of US imperialism that must be fought”.',
                sources: [S.de, S.c5209, S.c5303, S.c5305],
            },
            {
                ko: '많은 사람이 떠나는 쪽을 택했다. 국경이 대부분 막혔는데도 1953년 첫 넉 달 동안에만 12만 2,000명이 서쪽으로 갔다. 1953년 3월 서쪽에 등록된 동독 난민은 5만 8,605명으로 최고치를 기록했다. 그런데도 당 중앙위원회는 5월 13~14일 국영 기업 전체의 작업 기준량(노르마)을 6월 30일, 곧 울브리히트의 60번째 생일까지 10% 올리기로 결정했고 각료회의가 5월 28일 이를 확인했다. 형식은 「권고」였지만 사실상 같은 임금에 10%를 더 일하라는 명령, 곧 임금 삭감이었다. 탈출의 흐름은 이후 「[베를린 장벽 건설](' + ev('berlin-wall') + ')」로 이어지는 문제의 출발점이기도 했다.',
                en: 'Many chose to leave. Although the border was by then mostly sealed, 122,000 people went west in the first four months of 1953 alone. In March 1953 the West registered a record 58,605 refugees from the GDR. Nevertheless the SED Central Committee decided on 13–14 May to raise work norms in all state-owned enterprises by ten per cent by 30 June, Ulbricht’s sixtieth birthday, and the Council of Ministers confirmed this on 28 May. It was issued as a “recommendation”, but in effect it ordered ten per cent more work for the same pay — a wage cut. The exodus was also the starting point of the problem that later led to [The Building of the Berlin Wall](' + ev('berlin-wall') + ').',
                sources: [S.en, S.c5303, S.de],
            },
        ],
    },
    {
        heading: { ko: '모스크바의 명령과 「새 노선」', en: 'Moscow’s orders and the “New Course”' },
        paragraphs: [
            {
                ko: '1953년 3월 5일 스탈린이 죽자 모스크바의 새 집단지도부는 동독을 다시 들여다보았다. 4월 초 소련 통제위원회가 동독 경제의 참상을 자세히 보고했고, 5월 5일 소련 각료회의 간부회는 처음으로 동독 문제를 논의해 외무장관 몰로토프에게 독일 문제 안건을 맡겼다. 6월 2일 각료회의는 「동독의 정치 상황 건전화를 위한 조치」를 결정했고, 같은 날 모스크바에 도착한 울브리히트·그로테볼·프레트 욀스너에게 이를 건넸다. 결정은 사회주의 건설의 가속을 정면으로 비판하며, 대량 탈출이 동독의 정치적 안정을 심각하게 위협한다고 지적했다. 강제 집단화와 사기업 공격을 멈추고, 중공업 대신 소비재로 투자를 돌리고, 개신교회에 대한 강압을 그만두라는 것이었다. 울브리히트의 「냉혹한 권력 행사」도 질책을 받았다. 게오르기 말렌코프 총리는 바꾸지 않으면 파국이 온다고 경고했다. 그러나 문서에는 작업 기준량 인상을 거두라는 요구가 명시되지 않았다. 스탈린 사후 크렘린의 권력 다툼은 「[베리야의 몰락](' + ev('beria-purge') + ')」 항목이 다룬다.',
                en: 'After Stalin died on 5 March 1953, the new collective leadership in Moscow took a fresh look at East Germany. In early April the Soviet Control Commission sent a detailed report on the dire state of the East German economy, and on 5 May the Presidium of the Soviet Council of Ministers discussed the GDR for the first time and charged Foreign Minister Molotov with drafting a paper on the German question. On 2 June the Council of Ministers adopted the “Measures to improve the health of the political situation in the GDR” and handed them to Ulbricht, Grotewohl and Fred Oelssner, who arrived in Moscow that day. The decree sharply criticised the accelerated construction of socialism and warned that mass flight was a serious threat to the GDR’s political stability. Forced collectivisation and the war on private enterprise were to end, investment was to shift from heavy industry to consumer goods, and coercion of the Protestant Church was to stop; Ulbricht’s “cold exercise of power” was rebuked as well. Prime Minister Georgy Malenkov warned that without change there would be a catastrophe. Yet the decree made no explicit demand to revoke the higher work norms. The power struggle in the Kremlin after Stalin’s death is covered in [The Fall of Beria](' + ev('beria-purge') + ').',
                sources: [S.en, S.c5305, S.c0602],
            },
            {
                ko: '소련의 새 고등판무관 블라디미르 세묘노프는 서두르라고 다그쳤다. 사회주의통일당 간부들이 더 신중하고 느린 전환을 청하자 그는 「두 주 뒤면 당신들에게는 국가가 없을지도 모른다」고 잘라 말했다. 6월 9일 세묘노프가 배석한 정치국은 학교·재정·교회·식량·농업·탈출·국경·수감자 문제 등 16개 조치를 결정하고, 당 기관지 《노이에스 도이칠란트》의 편집장 루돌프 헤른슈타트에게 공보문을 쓰게 했다. 6월 11일 발표된 공보문은 「과거에 일련의 오류가 있었다」고 인정하고, 개인 농민·상인·수공업자·지식인·교회의 이익을 소홀히 한 결과 「많은 사람이 공화국을 떠났다」고 썼다. 같은 날 각료회의는 배급표 제한 해제, 가격 인하, 강제로 빼앗은 사업체와 농장의 반환, 돌아오는 탈출자의 시민권 회복을 결정했다. 청년회 탄압도 멈추어 목사들이 풀려나고 퇴학당한 학생들이 복학했다.',
                en: 'The new Soviet High Commissioner, Vladimir Semyonov, pressed for speed. When SED leaders asked for a more cautious and gradual change of course, he replied: “In fourteen days you may no longer have a state.” On 9 June the Politburo, with Semyonov present, adopted sixteen measures covering schools, finance, the churches, food supply, agriculture, flight from the republic, the border regime and prisoners, and charged Rudolf Herrnstadt, editor-in-chief of the party newspaper Neues Deutschland, with writing a communiqué. Published on 11 June, it admitted that “a series of errors were committed in the past” and that, because the interests of independent farmers, retailers, artisans, the intelligentsia and the Church had been neglected, “numerous persons have left the republic”. The same day the Council of Ministers lifted restrictions on ration cards, cut prices, offered to return confiscated businesses and farms, and restored full civic rights to returning refugees. The campaign against the Junge Gemeinde was halted; pastors were released and expelled pupils readmitted.',
                sources: [S.de, S.herrnstadt, S.c0609, S.c0611],
            },
            {
                ko: '그러나 노동자에게 가장 절실했던 기준량 인상은 그대로 남았다. 새 노선의 혜택은 농민과 남은 시민 중간층에게 돌아가고 노동자는 빠진 셈이어서, 노동자를 대표한다는 국가의 정당성이 흔들렸다. 당원들은 어제까지 현장에서 밀어붙인 정책이 하루아침에 「오류」가 되자 배신감에 빠졌고, 주민들은 전환을 정권의 약함으로 받아들였다. 공보문이 실린 신문은 몇 시간 만에 동났다. 이미 6월 9일 헤닝스도르프 제강·압연 공장의 노동자 약 2,000명이 기준량 인상에 맞서 파업했고, 6월 12일 브란덴부르크안데어하펠에서는 약 5,000명이 교도소 앞에 모여 수감자 석방을 요구했다. 할레·노이루핀·귀스트로·슈트랄준트의 교도소 앞에도 사람들이 몰렸다. 같은 해 헝가리에서도 너지 임레가 총리에 올라 「새 노선」을 폈다(「[헝가리의 새 노선](' + ev('hungary-new-course-1953') + ')」).',
                en: 'But the norm increase, the measure that mattered most to workers, stayed. The New Course benefited farmers and the remaining bourgeois middle strata while leaving out the workers, which shook the legitimacy of a state that claimed to represent them. Party members felt betrayed when the policies they had enforced on the ground were suddenly declared “errors”, and the wider population saw the change as a sign of the regime’s weakness. Newspapers carrying the communiqué sold out within hours. Already on 9 June some 2,000 workers at the Hennigsdorf steel and rolling mill had struck against the norm increase, and on 12 June about 5,000 people gathered outside the prison in Brandenburg an der Havel demanding the release of inmates; crowds also formed outside prisons in Halle, Neuruppin, Güstrow and Stralsund. That same year Imre Nagy became prime minister of Hungary and pursued a “New Course” there too ([Hungary’s New Course](' + ev('hungary-new-course-1953') + ')).',
                sources: [S.en, S.de, S.c0609, S.c0611, S.c0612, S.nagy],
            },
        ],
    },
    {
        heading: { ko: '6월 16일: 스탈린알레의 건설 노동자들', en: '16 June: the building workers of the Stalinallee' },
        paragraphs: [
            {
                ko: '불씨는 동베를린의 간판 공사장에서 일었다. 6월 14일 《노이에스 도이칠란트》는 건설 현장의 기준량 인상 방식을 비판하는 「나무망치를 내려놓을 때가 되었다」는 기사를 실었지만 인상 자체는 문제 삼지 않았다. 이튿날 아침 프리드리히스하인 병원 신축 현장과 스탈린알레(오늘날의 카를 마르크스 알레) 40블록 등에서 노동자들이 일손을 놓았고, 인상 철회를 요구하는 결의문을 그로테볼 총리에게 보내며 16일 정오까지 답을 달라고 했다. 그로테볼은 응하지 않았다. 16일 아침 노동조합 신문 《트리뷔네》는 10% 인상이 「전적으로 옳다」는 노동조합 연맹 부위원장의 글을 실었다.',
                en: 'The spark came from East Berlin’s showcase building sites. On 14 June Neues Deutschland ran an article, “It is time to put the mallet aside”, criticising how the higher norms were being imposed in construction, without questioning the increase itself. The next morning workers downed tools at the new Friedrichshain hospital and at Block 40 of the Stalinallee (today’s Karl-Marx-Allee), among other sites, and sent resolutions to Prime Minister Grotewohl demanding that the increase be withdrawn and an answer given by noon on the 16th. Grotewohl ignored them. On the morning of 16 June the trade union paper Tribüne printed an article by the deputy chairman of the trade union federation declaring that the ten per cent increase was “entirely correct”.',
                sources: [S.de, S.en, S.c0615, S.c0616],
            },
            {
                ko: '16일 오전 두 현장에서 출발한 수백 명의 행렬은 자유독일노동조합연맹 본부를 거쳐 라이프치거 슈트라세의 정부 청사 「각료의 집」으로 향하며 수천 명으로 불어났다. 「동료들이여 대열에 서라, 우리는 자유인이 되고 싶다!」는 구호가 울렸다. 군중은 울브리히트와 그로테볼을 불렀지만 나온 사람은 중공업 장관 프리츠 젤프만과 평화평의회 의장 로베르트 하베만뿐이었고, 그들의 말은 고함에 묻혔다. 정치국은 몇 시간을 망설인 끝에 정오 무렵 기준량 인상을 「완전히 잘못된」 결정이라며 철회했지만, 그 소식이 청사 앞에 닿았을 때 요구는 이미 정부 퇴진과 자유선거로 넓어져 있었다. 노동자들은 빼앗은 확성기 차로 총파업을 선언하고, 이튿날 아침 7시 슈트라우스베르거 광장에 모이자고 외쳤다.',
                en: 'On the morning of the 16th a column of a few hundred set out from the two sites, passed the headquarters of the Free German Trade Union Federation and headed for the government seat on Leipziger Strasse, the House of Ministries, swelling to several thousand on the way to the chant “Colleagues, join in — we want to be free people!” The crowd called for Ulbricht and Grotewohl, but only Heavy Industry Minister Fritz Selbmann and Robert Havemann, president of the GDR Peace Council, came out, and they were shouted down. After hours of indecision the Politburo withdrew the norm increase around midday, calling the decision “completely wrong”; but by the time the news reached the crowd outside the ministries, the demands had widened to the government’s resignation and free elections. Using a captured loudspeaker van, the workers proclaimed a general strike and called for a rally at Strausberger Platz at seven the next morning.',
                sources: [S.en, S.de, S.c0616],
            },
            {
                ko: '소식을 동독 전역으로 퍼뜨린 것은 서베를린의 미국 점령지구 방송 RIAS였다. RIAS는 15일 저녁부터 파업을 보도했고 16일에는 시위를 자세히 전했다. 파업 대표들이 방송국을 찾아와 총파업을 호소해 달라고 했지만, 편집장 에곤 바르와 정치 국장 고든 유잉은 방송이 봉기의 대변자가 되면 전쟁을 부를 수 있다며 거절했다. 대신 RIAS는 노동자들의 요구와 이튿날 집회 시간·장소를 밤새 거듭 내보냈고, 17일 새벽 5시 36분부터는 서베를린 노동조합총연맹(DGB) 위원장 에른스트 샤르노프스키의 호소를 네 차례 방송했다. 총파업 호소를 금지당한 그는 동독 사람들에게 「어디서나 슈트라우스베르거 광장」을 찾으라고 말했다. 그사이 세묘노프는 16일 저녁 사회주의통일당 지도부에 소련군을 베를린에 들이겠다고 통보했다.',
                en: 'It was RIAS, the radio station of the American sector of West Berlin, that carried the news across East Germany. RIAS reported the strikes from the evening of the 15th and covered the demonstrations in detail on the 16th. Strike delegates came to the station asking it to call a general strike, but editor-in-chief Egon Bahr and political director Gordon Ewing refused, fearing that acting as the uprising’s mouthpiece could start a war. Instead RIAS repeated the workers’ demands and the time and place of the next day’s rally throughout the night, and from 5.36 a.m. on the 17th it broadcast four times an appeal by Ernst Scharnowski, chairman of the West Berlin trade union federation (DGB). Forbidden to call a general strike, he urged East Germans to seek out “their Strausberger Platz everywhere”. Meanwhile, on the evening of the 16th, Semyonov informed the SED leadership that Soviet troops would be brought into Berlin.',
                sources: [S.en, S.de, S.c0617],
            },
        ],
    },
    {
        heading: { ko: '6월 17일: 700여 곳에서 일어난 봉기', en: '17 June: a rising in some 700 places' },
        paragraphs: [
            {
                ko: '17일 아침 동베를린 곳곳에서 노동자들이 행진을 시작했다. 인민경찰과 병영인민경찰은 처음에는 지시가 없어 손을 쓰지 못했다. 시위대는 옛 기준량 회복과 가격 인하, 전날 체포된 동료의 석방, 동서 경계의 철폐, 자유로운 전 독일 선거를 요구했고, 「정부는 물러가라」, 「총 대신 버터를」 같은 구호를 내걸었다. 오전 9시 각료의 집 앞에는 2만 5,000명이 모였다. 그 무렵 소련 전차는 이미 시내로 들어오고 있었다. 사회주의통일당 지도부는 카를스호르스트의 소련군 사령부로 피신했다. 오후 1시 무렵 소련 지구 군사령관 표트르 디브로바 소장이 동베를린에 비상사태를 선포했고, 비상사태는 7월 11일에야 풀렸다. 포츠담 광장의 국영 백화점 콜룸부스하우스와 「하우스 파터란트」가 불탔다.',
                en: 'On the morning of the 17th workers began marching all over East Berlin. The regular and Barracked People’s Police, apparently without instructions, did not intervene at first. The marchers demanded the old norms, lower prices, the release of colleagues arrested the day before, an end to the barriers between East and West and free all-German elections, under slogans such as “Down with the government!” and “Butter, not guns”. By 9 a.m. 25,000 people had gathered in front of the House of Ministries. Soviet tanks were by then entering the city, and the SED leadership took refuge at the Soviet headquarters in Karlshorst. Around 1 p.m. the military commandant of the Soviet sector, Major General Pyotr Dibrova, declared a state of emergency in East Berlin, which was not lifted until 11 July. The state department store Columbushaus and the Haus Vaterland on Potsdamer Platz went up in flames.',
                sources: [S.en, S.de, S.c0617],
            },
            {
                ko: '봉기는 베를린만의 일이 아니었다. 당시 서방 언론과 아마 시위 참가자 대부분도 몰랐지만, 그날 동독 전역의 공장에서 아침 교대조가 일을 멈추고 도심으로 행진했다. 참가자 수는 정확히 셀 수 없어 40만 명에서 150만 명까지 추산이 엇갈리며, 흔히 100만 명 이상으로 본다. 시위대는 군청 11곳, 시청 14곳, 사회주의통일당 군당 7곳과 지구당 1곳을 점거했고 교도소 9곳과 국가보안부 건물 2곳을 습격했다. 중심지는 베를린과 할레 주변의 「화학 삼각지대」, 그리고 마그데부르크·라이프치히·드레스덴 같은 지구 수도였다. 농촌에서도 12일부터 인구 2,000명 미만 마을 300여 곳에서 깃발을 태우고 촌장과 당 간부를 쫓아내는 일이 벌어졌다. 소련 당국은 동독 217개 군 가운데 167개 군에 비상사태를 선포했다.',
                en: 'The rising was not confined to Berlin. Western media at the time, and probably most of the protesters themselves, did not grasp its national scale, but that morning early shifts in factories across East Germany stopped work and marched into town centres. The number of participants cannot be fixed precisely; estimates range from 400,000 to 1.5 million, and more than a million is commonly cited. Insurgents occupied 11 district council buildings, 14 mayors’ offices, seven SED district offices and one regional party headquarters, and stormed nine prisons and two Ministry for State Security buildings. The centres were Berlin, the “chemical triangle” around Halle, and regional capitals such as Magdeburg, Leipzig and Dresden. In the countryside, from 12 June villagers in more than 300 communities of under 2,000 inhabitants burned flags and drove out mayors and party officials. The Soviet authorities declared a state of emergency in 167 of the GDR’s 217 districts.',
                sources: [S.de, S.fricke],
            },
            {
                ko: '지방에서는 봉기가 베를린보다 더 조직적인 모습을 띠기도 했다. 할레에서는 9만~10만 명이 거리로 나왔고, 시위대가 클라이네 슈타인슈트라세 교도소에서 여성 248명과 남성 3명을 풀어 주었지만 「붉은 황소」 교도소 습격은 실패해 4~5명이 숨졌다. 비터펠트 지역 중앙 파업 지도부는 정부 퇴진, 노동자로 이루어진 임시 정부, 넉 달 안의 자유·비밀·직접 선거, 모든 정치범 석방, 지역 경계 철폐, 「이른바 인민군」의 즉각 해체를 요구하는 강령을 전보로 정부에 보냈다. 국경 도시 괴를리츠에서는 3만 명이 당사와 보안경찰 사무실, 교도소를 부수었고, 괴를리츠와 니스키 두 군에서는 몇 시간 동안 사회주의통일당 정권이 사라졌다. 마그데부르크에서는 당사와 교도소가 불탔다. 라이프치히에서는 비상사태 선포 전인 오후 1~2시에 지구당 서기 파울 프뢸리히가 발포를 명령해 19세 디터 타이히와 64세 연금 생활자 엘리자베트 브뢰커가 총에 맞아 숨졌다.',
                en: 'In the provinces the rising was sometimes better organised than in Berlin. In Halle 90,000 to 100,000 people took to the streets; demonstrators freed 248 women and three men from the prison on Kleine Steinstrasse, but an assault on the “Red Ox” prison failed and four or five people were killed. The central strike committee of Bitterfeld district telegraphed the government a programme demanding its resignation, a provisional government of workers, free, secret and direct elections within four months, the release of all political prisoners, the abolition of the zonal border and the immediate disbanding of the “so-called people’s army”. In the border town of Görlitz 30,000 people wrecked the party headquarters, the secret police offices and the prison, and in the districts of Görlitz and Niesky SED rule vanished for a few hours. In Magdeburg the party headquarters and the prison were set on fire. In Leipzig the regional party secretary Paul Fröhlich ordered police and Stasi to open fire between 1 and 2 p.m., before the state of emergency had been declared, and 19-year-old Dieter Teich and 64-year-old pensioner Elisabeth Bröcker were shot dead.',
                sources: [S.de, S.en],
            },
            {
                ko: '파업 지도부는 대개 당원이 아니었고, 그 가운데에는 쫓겨난 사회주의통일당원, 특히 옛 사회민주당원이 많았다. 1933년 이전 정치·노동조합 투쟁을 겪은 나이 든 노동자와 기술·사무직원이 앞장서는 일이 잦았고, 뒷날 정권의 선전과 달리 옛 나치당원의 비율은 매우 낮았다. 지도부들은 재산 파괴와 폭력을 막으려 했고, 소련에 맞서서는 아무것도 바꿀 수 없음을 알았기에 반소 구호를 삼갔다. 여러 곳에서 사회민주당 재건을 요구했고, 1946년 공산당과 사회민주당의 통합을 이끈 옛 사회민주당 지도자 그로테볼에게는 「배신자」라는 원성이 쏟아졌다. 그러나 봉기에는 전국을 이끄는 지도부도, 하루를 넘는 계획도 없었다. 오후 2시 그로테볼은 라디오에서 기준량 철회를 다시 확인하면서도, 봉기를 「외국 세력의 도발자와 파시스트 첩자들의 소행」이라 불렀다.',
                en: 'Most strike leaders were not party members, though many were former SED members who had been expelled, often ex-Social Democrats. Older workers and technical or clerical staff who had experience of political and trade union struggle before 1933 frequently took the lead, and, contrary to later regime propaganda, the share of former Nazi party members among them was very small. The committees tried to prevent damage to property and violence against people, and they avoided anti-Soviet slogans, knowing that nothing could be changed in the GDR against the Soviet Union. In many places workers demanded the re-founding of the Social Democratic Party, and Grotewohl, the former Social Democratic leader who had led the 1946 merger with the Communists, was reviled as a traitor. But the rising had no national leadership and no plan beyond the day. At 2 p.m. Grotewohl confirmed on the radio that the norm increase had been withdrawn, while calling the uprising “the work of provocateurs and fascist agents of foreign powers”.',
                sources: [S.de, S.en],
            },
        ],
    },
    {
        heading: { ko: '진압과 희생자: 엇갈리는 숫자', en: 'Suppression and victims: the disputed numbers' },
        paragraphs: [
            {
                ko: '진압의 주력은 소련군이었다. 1953년 독일 주둔 소련군 총사령관에 오른 안드레이 그레치코가 진압을 지휘했다. 독일어권 연구가 정리한 바에 따르면 소련군 16개 사단의 병력 약 2만 명과 병영인민경찰 약 8,000명이 투입되었다. 전차가 도착하자 봉기는 대부분 급속히 힘을 잃었고 군대에 대한 큰 공격은 없었다. 세묘노프는 회고록에서 17일 오전 11시 모스크바로부터 발포하고 군사 즉결재판소를 세워 「주모자 12명을 총살하라」는 지시를 받았다고 썼다. 18일에도 시위가 이어졌고, 예나의 카를 차이스 공장에서는 7월 10~11일, 슈코파우의 부나 공장에서는 7월 16~17일에 다시 파업이 일어났다.',
                en: 'The Soviet army bore the brunt of the suppression. Andrei Grechko, appointed commander-in-chief of Soviet forces in Germany in 1953, directed it. According to German research, some 20,000 troops of sixteen Soviet divisions and about 8,000 members of the Barracked People’s Police were deployed. Once the tanks arrived the rising mostly lost momentum quickly, and there were no major attacks on the troops. Semyonov wrote in his memoirs that at 11 a.m. on the 17th he received instructions from Moscow to open fire, set up military summary courts and “shoot twelve ringleaders”. Protests continued on the 18th, and strikes broke out again at Carl Zeiss in Jena on 10–11 July and at the Buna works in Schkopau on 16–17 July.',
                sources: [S.grechko, S.de, S.goettling],
            },
            {
                ko: '희생자 수는 오랫동안 정치의 도구였다. 동독은 사망자를 25명이라 했고 서방에서는 507명이라는 숫자가 돌았다. 연방정치교육원·도이칠란트라디오와 함께 진행한 포츠담 현대사연구소(ZZF)의 조사는 사료로 확인되는 사망자를 55명으로 정리했다. 34명이 17일부터 23일 사이 인민경찰과 소련군의 총에 맞아 숨졌고, 5명은 소련 점령 당국의 판결로, 2명은 동독 법원의 판결로 처형되었다. 4명은 비인간적인 수감 환경 탓에, 4명은 수감 중 자살로(적어도 두 건은 타살 가능성을 배제할 수 없다) 숨졌고, 1명은 경찰서 습격 중 심장마비로 죽었다. 동독 보안기관 쪽에서도 5명이 죽었다. 조사는 이 밖에 25건의 불확실한 사례 가운데 7건이 봉기와 무관함을 밝혔다. 반면 그레치코의 비밀 보고는 18일까지 사상자를 209명으로 적었고, 적어도 125명이 죽었다는 추산도 있다.',
                en: 'The death toll long served political ends. The GDR spoke of 25 dead; in the West a figure of 507 circulated. A project of the Centre for Contemporary History (ZZF) in Potsdam, run with the Federal Agency for Civic Education and Deutschlandradio, documented 55 deaths in the sources. Thirty-four demonstrators and bystanders were shot by People’s Police or Soviet soldiers between the 17th and 23 June; five men were executed after sentences by Soviet occupation authorities and two after sentences by GDR courts; four died as a result of inhumane prison conditions and four killed themselves in custody (in at least two cases outside involvement cannot be ruled out); and one demonstrator died of heart failure while storming a police station. Five members of the GDR security forces were also killed. Of 25 further alleged or unexplained deaths, the project established that seven were unconnected with the uprising. By contrast, a declassified report by Grechko put casualties at 209 by 18 June, and other estimates speak of at least 125 dead.',
                sources: [S.tote, S.de, S.en],
            },
            {
                ko: '즉결 처형의 규모도 논란거리다. ZZF 조사가 확인한 소련 측 처형은 5명이지만, 소련군 즉결재판소가 17~22일 19명에게 사형을 선고해 총살했다는 연구도 있으며, 언론인 카를 빌헬름 프리케는 소련 군사재판소의 사형 판결 수가 아직 정확히 밝혀지지 않았다고 썼다. 첫 처형 공고의 대상은 서베를린에 살던 1918년생 실직 화가 빌리 괴틀링이었다. 그는 재판도 없이 주독 소련군 군사평의회의 지시로 총살되었고, 2003년 러시아 군 검찰은 그의 유죄를 입증하는 증거가 하나도 없다며 복권했다. 마그데부르크의 알프레트 다르치와 헤르베르트 슈타우흐, 예나에서 붙잡혀 바이마르에서 총살된 26세 자동차 정비공 알프레트 디너도 같은 운명이었다. 사격을 거부해 처형된 소련 병사가 41명이라는 이야기는 근거가 확인되지 않아, ZZF는 이를 냉전의 전설로 본다.',
                en: 'The scale of summary executions is also disputed. The ZZF project confirmed five Soviet executions, but other research holds that Soviet summary courts sentenced 19 insurgents to death and had them shot between 17 and 22 June, and the journalist Karl Wilhelm Fricke wrote that the number of death sentences passed by Soviet military tribunals has never been precisely established. The first execution notice named Willi Göttling, an unemployed painter from West Berlin born in 1918. He was shot without trial on the instruction of the Military Council of the Group of Soviet Forces in Germany; in 2003 the Russian military prosecutor rehabilitated him, finding not a single piece of evidence of his guilt. Alfred Dartsch and Herbert Stauch in Magdeburg, and Alfred Diener, a 26-year-old car mechanic arrested in Jena and shot in Weimar, met the same fate. Reports that 41 Soviet soldiers were shot for refusing to fire have never been substantiated, and the ZZF regards them as a Cold War legend.',
                sources: [S.tote, S.de, S.fricke, S.goettling],
            },
            {
                ko: '체포와 재판이 뒤따랐다. 국가보안부 집계로 7월 3일 아침까지 1만 506명이 체포되었고(인민경찰 5,705명, 국가보안부 4,801명), 그 가운데 6,529명은 풀려났다. 1954년 3월 검찰총장의 보고에 따르면 1954년 1월 말까지 동독 법원은 1,526명에게 유죄를 선고했다. 할레에서 교도소를 나왔다가 붙잡힌 에르나 도른과 마그데부르크의 정원사 에른스트 옌리히 두 사람은 사형을 선고받고 드레스덴에서 단두대에 올랐다. 프리케는 동독 법원에서 형을 받은 사람을 적어도 1,600명으로 보았고, 이후의 추산은 수감된 사람을 1만 5,000명 이상으로 잡는다. 소련 군사재판소는 따로 수백 명에게 대개 25년의 강제노동형을 선고했고, 그 5분의 1가량은 보르쿠타 같은 굴라크로 보내졌다. 6월 17일 관련 수감자는 감옥에서 노란 「X」 표지를 달았다.',
                en: 'Arrests and trials followed. By the morning of 3 July, according to the Stasi, 10,506 people had been arrested (5,705 by the People’s Police and 4,801 by the Stasi), of whom 6,529 were released. According to the Prosecutor General’s report of March 1954, GDR courts had convicted 1,526 people by the end of January 1954. Two were sentenced to death and guillotined in Dresden: Erna Dorn, who had been freed from prison in Halle and recaptured, and Ernst Jennrich, a gardener from Magdeburg. Fricke put the number convicted by GDR courts at no fewer than 1,600, and later estimates put the number imprisoned at more than 15,000. Soviet military tribunals separately sentenced several hundred people, usually to 25 years’ forced labour, about a fifth of whom were sent to the Gulag, Vorkuta above all. Prisoners held in connection with 17 June wore a yellow “X” in jail.',
                sources: [S.c5307, S.de, S.fricke],
            },
        ],
    },
    {
        heading: { ko: '울브리히트의 생존과 국가의 재건', en: 'Ulbricht survives and the state rebuilds' },
        paragraphs: [
            {
                ko: '봉기 직후만 해도 울브리히트의 몰락은 시간문제로 보였다. 6월 24일 세묘노프와 파벨 유딘, 바실리 소콜롭스키는 모스크바에 보낸 보고서에서 소련 기관의 책임을 줄이고 울브리히트의 책임을 강조하며 그의 서기장직을 없애고 집단지도로 가자고 권했다. 동베를린 정치국에서는 헤른슈타트와 국가보안부 장관 빌헬름 차이서가 당 개편을 밀어붙였다. 7월 7일 밤부터 8일까지 이어진 정치국 회의에서 헤른슈타트가 집단지도 방안을 내놓자 차이서와 프리드리히 에베르트, 하인리히 라우, 엘리 슈미트가 찬성했고, 울브리히트 편에 선 사람은 헤르만 마테른과 자유독일청년단 지도자 에리히 호네커뿐이었다.',
                en: 'Immediately after the rising Ulbricht’s fall seemed only a matter of time. On 24 June Semyonov, Pavel Yudin and Vasily Sokolovsky sent Moscow a report that played down the responsibility of the Soviet authorities, stressed Ulbricht’s, and recommended abolishing his post of General Secretary in favour of collective leadership. In the East Berlin Politburo, Herrnstadt and Minister of State Security Wilhelm Zaisser pressed for a reorganisation of the party. At the Politburo session that ran through the night of 7–8 July, Herrnstadt presented proposals for collective leadership; Zaisser, Friedrich Ebert, Heinrich Rau and Elli Schmidt agreed, and only Hermann Matern and Free German Youth leader Erich Honecker sided with Ulbricht.',
                sources: [S.en, S.herrnstadt],
            },
            {
                ko: '울브리히트를 구한 것은 모스크바의 정변이었다. 라브렌티 베리야는 동독을 「소련군 덕분에 겨우 유지되는 진짜 국가도 아닌 것」이라 부른 적이 있었고, 다른 지도자들은 그가 독일 통일을 미국과 거래할까 의심했다. 봉기는 몰로토프·말렌코프·불가닌에게 베리야의 노선이 소련 권력을 흔든다는 확신을 주었고, 베리야는 6월 26일 체포되었다. 7월 2일 모스크바의 위원회는 동독의 큰 개혁안을 미루었다. 소련 지도부는 경험 많고 믿을 만한, 비록 스탈린주의적이고 인기는 없더라도 울브리히트를 지키는 쪽을 택했다. 흐루쇼프와 말렌코프의 지지를 얻은 울브리히트는 7월 24~26일 중앙위원회 제15차 총회에서 헤른슈타트와 차이서를 베리야와 이어진 「분파」로 몰아 정치국과 중앙위원회에서 몰아냈다.',
                en: 'What saved Ulbricht was a coup in Moscow. Lavrentiy Beria had once called East Germany “not even a real state but one kept in being only by Soviet troops”, and other leaders suspected him of being ready to trade German reunification for American support. The uprising convinced Molotov, Malenkov and Bulganin that Beria’s policies endangered Soviet power, and Beria was arrested on 26 June. On 2 July a commission in Moscow shelved far-reaching reforms in the GDR; the Soviet leadership chose to keep an experienced and reliable, if Stalinist and unpopular, ruler. Backed by Khrushchev and Malenkov, Ulbricht used the Central Committee’s 15th plenum on 24–26 July to brand Herrnstadt and Zaisser a “faction” linked to Beria and to remove them from the Politburo and the Central Committee.',
                sources: [S.beria, S.en, S.herrnstadt],
            },
            {
                ko: '숙청은 위에서 아래로 번졌다. 차이서는 국가보안부 장관직을 잃었고 헤른슈타트는 《노이에스 도이칠란트》에서 쫓겨난 뒤 1954년 1월 당에서 제명되었다. 파업 노동자 처벌을 누그러뜨리려 한 법무장관 막스 페히너는 7월 14일 해임되어 투옥되었고, 후임 힐데 벤야민은 가혹한 판결을 이끌었다. 옛 사회민주당 출신 온건파 당원들이 당에서 밀려났고, 지구·군·공장 당 조직의 간부 대부분이 교체되었다. 이 숙청 뒤로 에리히 밀케 같은 강경파가 동독 정치의 방향을 정했다. 국가보안부는 일단 내무부 산하 국가보안청으로 격하되어 에른스트 볼베버의 손에 넘어갔다가 1955년 11월 다시 부(部)로 올라섰다.',
                en: 'The purge spread downwards. Zaisser lost his post as Minister of State Security, and Herrnstadt, removed from Neues Deutschland, was expelled from the party in January 1954. Justice Minister Max Fechner, who had tried to moderate the prosecution of striking workers, was dismissed on 14 July and imprisoned; his successor Hilde Benjamin pressed for harsh sentences. Moderate members, above all former Social Democrats, were pushed out of the party, and most leading officials at regional, district and factory level were replaced. After these purges hard-liners such as Erich Mielke set the course of East German politics. The Ministry for State Security was downgraded to a State Secretariat within the Ministry of the Interior under Ernst Wollweber, and restored to ministry status in November 1955.',
                sources: [S.herrnstadt, S.de, S.stasi],
            },
            {
                ko: '정권은 봉기에서 두 가지 교훈을 얻었다. 하나는 작업장의 불만이 큰 충돌로 번지기 전에 막아야 한다는 것이었다. 공장 감시가 강화되었고, 국가보안부는 조직적인 저항을 신속히 다룰 수 있도록 커졌다. 1953년 하반기에는 공장마다 무장 「노동자계급 전투대」가 꾸려지기 시작해 1954년에 정식으로 출범했다. 다른 하나는 「사회주의 건설의 가속」 같은 무리한 시도를 되풀이해서는 안 된다는 것이었다. 정권은 다시는 일률적인 기준량 인상을 시도하지 않았고, 새 노선의 소비재 투자와 보조금은 생활수준을 끌어올렸다. 모스크바도 막대한 경제·재정 지원을 약속하고 배상을 그해 말로 끝내기로 했으며, 전쟁포로를 더 풀어 주고 동베를린의 소련 대표부를 대사관으로 격상했다. 6월 26일 그로테볼은 각료의 집 앞 집회에서 「근로자들의 신뢰를 되찾아야 한다」고 말했지만, 같은 날 당 보고서는 주민 상당수가 6월 사건을 파시스트 도발이 아니라 「노동자들의 정당한 일」로 여긴다고 적었다.',
                en: 'The regime drew two lessons from the rising. The first was that shop-floor discontent had to be stopped before it escalated. Factory surveillance was stepped up and the Stasi was expanded to deal swiftly with organised protest. Armed factory “Combat Groups of the Working Class” began to be formed in the second half of 1953 and were formally launched in 1954. The second was that a venture like the “accelerated construction of socialism” must never be repeated. The regime never again attempted a blanket norm increase, and the New Course’s investment in consumer goods and its subsidies raised living standards. Moscow pledged substantial economic and financial aid, agreed to end reparations by the end of the year, released more prisoners of war and raised its mission in East Berlin to an embassy. On 26 June Grotewohl told a rally outside the House of Ministries that “we must win back the trust of the working people”; yet a party report that same day noted that much of the population regarded the June events not as a fascist provocation but as “a just cause of the workers”.',
                sources: [S.en, S.kampf, S.c0626],
            },
        ],
    },
    {
        heading: { ko: '동과 서의 기억, 「해결책」', en: 'Memory in East and West, and “The Solution”' },
        paragraphs: [
            {
                ko: '사회주의통일당은 봉기를 처음부터 바깥에서 꾸민 일로 규정했다. 6월 21일 중앙위원회 제14차 총회는 「파시스트의 도발」과 「오래전에 준비된 X데이」를 말했고, 7월 제15차 총회에서는 이것이 「파시스트 쿠데타 기도」가 되었다. 1974년 동독 과학아카데미가 낸 동독사도 봉기를 「반혁명 쿠데타 기도」로, 소련군의 개입을 「프롤레타리아 국제주의의 정신」에 따른 행동으로 그렸다. 이 해석은 국가가 사라질 때까지 공식 노선으로 남았다. 봉기는 당 안에도 상처를 남겼다. 인민경찰이 노동자에게 총을 쏘았다는 사실에 많은 당원이 당을 떠났고, 알텐베르크의 텍스티마 공장에서만 7월 7일까지 당원 450명이 탈당했다.',
                en: 'From the outset the SED defined the rising as something staged from outside. On 21 June the Central Committee’s 14th plenum spoke of a “fascist provocation” and a long-prepared “Day X”; at the 15th plenum in July this became a “fascist putsch attempt”. A history of the GDR published by the East German Academy of Sciences in 1974 still described a “counter-revolutionary putsch attempt” and presented the Soviet intervention as an act in “the spirit of proletarian internationalism”. This remained the official reading until the state disappeared. The rising also left wounds inside the party: the fact that the People’s Police had shot at workers drove many members out, and at the Textima plant in Altenberg alone 450 SED members had left by 7 July.',
                sources: [S.fricke, S.de, S.en],
            },
            {
                ko: '베르톨트 브레히트는 이 모순을 몸소 드러냈다. 그는 6월 17일 울브리히트에게 「역사는 사회주의통일당의 혁명적 조급함에 경의를 표할 것」이라며 당에 대한 연대를 밝히는 짧은 편지를 보냈는데, 6월 21일 《노이에스 도이칠란트》는 정작 대중과의 토론을 말한 둘째 문장을 빼고 실었다. 작가동맹 서기 쿠르트 바르텔이 6월 20일 노동자들에게 「부끄럽지 않은가」, 잃어버린 신뢰를 되찾으려면 아주 많이 일해야 한다고 쓴 전단이 스탈린알레에 뿌려지자, 브레히트는 그해 여름 부코의 별장에서 시 「해결책」을 썼다. 정부가 인민을 해산하고 새 인민을 뽑는 편이 더 간단하지 않겠느냐고 묻는 이 시는 생전에 발표되지 않았고, 1959년 서독 신문 《디 벨트》에 처음 실렸다. 8월 20일의 작업일지에는 노동자들의 시위가 방향도 조직도 없었지만 「여기 상승하는 계급이 있다」는 것을 보여 주었다고 적었다.',
                en: 'Bertolt Brecht embodied the contradiction. On 17 June he sent Ulbricht a short letter affirming his allegiance to the party — “history will pay its respects to the revolutionary impatience of the Socialist Unity Party” — but when Neues Deutschland printed it on 21 June it omitted the second sentence, which spoke of a great discussion with the masses. After Kurt Barthel, secretary of the Writers’ Union, published a piece on 20 June, also distributed as a leaflet on the Stalinallee, asking the workers whether they were ashamed and telling them they would have to work very hard to regain lost trust, Brecht wrote the poem “Die Lösung” (“The Solution”) that summer at his country house in Buckow. The poem, which asks whether it would not be simpler for the government to dissolve the people and elect another, was not published in his lifetime; it first appeared in 1959 in the West German newspaper Die Welt. In his work journal on 20 August he noted that the workers’ demonstrations, aimless and unorganised as they were, still showed that “here is the rising class”.',
                sources: [S.loesung, S.brecht, S.de],
            },
            {
                ko: '서독에서 6월 17일은 통일의 상징이 되었다. 콘라트 아데나워 총리는 6월 19일 베를린으로 가 희생자를 추모했고, 서베를린 시장 에른스트 로이터는 빈에서 급히 돌아갈 군용기를 미국에 청했다가 거절당했다. 6월 22일 베를린 시 정부는 브란덴부르크 문 서쪽의 샤를로텐부르크 대로를 「6월 17일 거리」로 바꾸었고, 7월 3일 연방의회는 6월 17일을 「독일 통일의 날」로 정해 8월 4일 법으로 공휴일이 되었다. 같은 날 아데나워는 통일의 전제로 자유선거를 요구했다. 그러나 프란츠 요제프 슈트라우스가 회고했듯 본 정부가 할 수 있는 일은 성명과 호소뿐이었고, 그것은 「독일의 무력함」을 다시 깨닫게 했다. 6월 17일은 1990년 통일 뒤 10월 3일에 국경일 자리를 넘기고 기념일로 남았다.',
                en: 'In West Germany 17 June became a symbol of unity. Chancellor Konrad Adenauer went to Berlin on 19 June to honour the dead, while West Berlin’s mayor Ernst Reuter, attending a conference in Vienna, asked the Americans for a military plane to fly him back at once and was refused. On 22 June the Berlin Senate renamed the Charlottenburger Chaussee west of the Brandenburg Gate “Strasse des 17. Juni”; on 3 July the Bundestag made 17 June the “Day of German Unity”, a public holiday by law of 4 August, and the same day Adenauer named free elections as the precondition of reunification. Yet, as Franz Josef Strauss recalled, Bonn could offer nothing but declarations and appeals, which brought home “the whole of German impotence”. After reunification in 1990 the national holiday moved to 3 October, and 17 June remained a day of remembrance.',
                sources: [S.de, S.c5307],
            },
            {
                ko: '서방 강대국은 개입하지 않았다. 미국은 처음에 이것이 소련군을 베를린 전체로 들여보내려는 술책이 아닌지 의심했다. 그 뒤 아이젠하워 정부는 서베를린 35곳에서 1,500만 달러어치의 식량을 나누어 주는 「아이젠하워 소포」 계획을 7월 10일 발표해 27일부터 10월 초까지 시행했고, 500만 개가 넘는 소포가 동독 주민 100만여 명에게 돌아갔다. 미국 국무부 사학실은 아이젠하워와 존 포스터 덜레스 국무장관이 봉기를 이용하려 했으며, 이 계획이 인도적 목적과 함께 울브리히트 정권을 흔들고, 소련의 통일 공세를 꺾고, 유럽방위공동체와 아데나워를 지키려는 것이었다고 정리한다. 윈스턴 처칠 영국 총리는 4대국 회담 구상이 틀어질까 걱정해 소련 정부에 진압이 정당했다고 말하기도 했다.',
                en: 'The Western powers did not intervene. The United States at first suspected a Soviet ruse to bring troops into the whole of Berlin. The Eisenhower administration then announced on 10 July a programme to distribute $15 million worth of food from 35 centres in West Berlin; the “Eisenhower packages” were handed out from 27 July until early October, and more than five million parcels went to over a million East Germans. The US State Department’s Office of the Historian notes that Eisenhower and Secretary of State John Foster Dulles sought to exploit the uprising and that, besides its humanitarian aims, the programme sought to destabilise Ulbricht’s regime, undercut the Soviet campaign for unification, and protect the European Defence Community and Adenauer. Winston Churchill, fearing for his initiative for a four-power conference, even told the Soviet government that it had been right to put the rising down.',
                sources: [S.de, S.state],
            },
        ],
    },
    {
        heading: { ko: '해석의 쟁점: 노동자 봉기인가, 인민 봉기인가', en: 'The debate: a workers’ uprising or a popular uprising?' },
        paragraphs: [
            {
                ko: '6월 17일을 무엇이라 부를지는 그 자체로 논쟁이었다. 독일어권에서는 「인민 봉기(Volksaufstand)」와 「노동자 봉기(Arbeiteraufstand)」라는 이름이 함께 쓰인다. 역사가 일코사샤 코발추크는 서독에서 시간이 흐르며 이 사건이 전국적 인민 봉기에서 동베를린의 노동자 봉기로, 자유와 통일을 위한 투쟁에서 기준량에 맞선 사회정책 투쟁으로 축소되었다고 비판한다. 그는 1990년 이후 기록보관소가 열리면서야 봉기를 그 폭 그대로 연구할 수 있게 되었다고 본다. 실제로 확인된 봉기 장소는 1991년 토르스텐 디드리히의 373곳에서, 1995년 코발추크와 아르민 미터의 563곳, 코발추크의 701곳으로 늘었다. 그로테볼이 당시 공식적으로 밝힌 272곳은 의도적으로 줄인 숫자였다.',
                en: 'What to call 17 June was itself contested. In German both “popular uprising” (Volksaufstand) and “workers’ uprising” (Arbeiteraufstand) are used. The historian Ilko-Sascha Kowalczuk criticises how, over time, West Germany shrank a nationwide popular rising into an East Berlin workers’ revolt, and a struggle for freedom and unity into a social-policy protest against work norms; only with the opening of the archives after 1990, he argues, could the rising be studied in its full breadth. Indeed, the number of documented sites of protest grew from Torsten Diedrich’s 373 in 1991 to 563 in Kowalczuk and Armin Mitter’s work of 1995, and to 701 in Kowalczuk’s later count. The 272 places officially admitted by Grotewohl at the time had been deliberately falsified.',
                sources: [S.kowalczuk, S.fricke, S.de],
            },
            {
                ko: '1990년 이후의 연구는 봉기를 「독일의 혁명적 봉기」의 계보에 놓는 쪽으로 기울었다. 후베르투스 크나베는 이를 독일의 큰 혁명적 봉기들 가운데 하나로 꼽았고, 코발추크 등은 「억압된 혁명」이라는 제목으로 그 자리를 다시 매기려 했다. 코발추크·미터·슈테판 볼레는 1952~1954년의 위기가 오히려 동독의 「내적 국가 건설」을 낳았다고 보았다. 반면 옛 사회주의통일당 쪽 저자들과 국가보안부 출신 장성들은 통일 뒤에도 외부 개입을 강조하며 「통일을 위한 노동자 봉기」라는 규정을 부정했는데, 프리케는 이를 진실을 거스르는 서술이라 비판했다. 왼쪽에서의 해석도 있었다. 유고슬라비아의 에드바르드 카르델은 6월 28일 이것이 민족 문제가 아니라 「사회주의」를 자칭하는 국가자본주의 체제에 맞선 독일 노동자의 계급적 저항이라고 썼다.',
                en: 'Research after 1990 has tended to place the rising in the line of Germany’s revolutionary uprisings. Hubertus Knabe counted it among the great revolutionary risings in German history, and Kowalczuk and his co-authors sought to re-establish its place under the title “The suppressed revolution”. Kowalczuk, Mitter and Stefan Wolle argued that the crisis of 1952–1954 in fact produced the GDR’s “inner founding of the state”. By contrast, former SED authors and ex-Stasi generals continued after reunification to stress outside interference and to deny that it had been a workers’ uprising for unity — accounts Fricke dismissed as writing against the truth. There was also a reading from the left: on 28 June the Yugoslav Edvard Kardelj wrote that the driving force was not national but the class protest of the German worker against a state-capitalist system that called itself socialist.',
                sources: [S.de, S.fricke],
            },
            {
                ko: '냉전사 연구는 서방의 역할에 주목했다. 크리스티안 오스터만은 미국 정부 문서를 바탕으로 봉기를 「롤백의 한계」를 드러낸 사건으로 분석했다. 아이젠하워 정부는 공산권을 밀어내겠다고 말했지만, 정작 봉기가 일어나자 개입하지 않고 식량 소포 같은 심리전으로 위기를 연장하는 데 그쳤다. 봉기한 사람들도 대규모로 정권에 맞서면 서방의 도움 없이 홀로 남는다는 교훈을 얻었다. 그 대안이 다시 탈출이었고, 울브리히트는 결국 1961년 국경을 막았다.',
                en: 'Cold War historians have focused on the role of the West. Drawing on US government records, Christian Ostermann analysed the rising as revealing “the limits of rollback”: the Eisenhower administration spoke of pushing back Communism, yet when an uprising actually broke out it did not intervene and confined itself to prolonging the crisis through psychological warfare such as the food parcels. The insurgents in turn learned that if they confronted the regime openly and in large numbers they would be left to face it alone. The alternative was once again flight, and in 1961 Ulbricht finally sealed the border.',
                sources: [S.ostermann, S.state, S.en, S.de],
            },
            {
                ko: '1953년 6월은 스탈린주의 체제 아래 일어난 첫 인민 봉기였고, 흐루쇼프 쪽 소련 지도자들은 그 본보기가 폴란드·체코슬로바키아·헝가리로 번질까 두려워했다. 폴란드 통일노동자당은 6월 23일의 분석에서 기준량의 과도한 인상과 사회주의 건설의 가속 같은 독일 형제당의 오류가 「도발」의 토대를 제공했다고 적었다. 3년 뒤 그 두려움은 「[포즈난 봉기](' + ev('poznan-1956') + ')」와 「[헝가리 혁명](' + ev('hungarian-revolution') + ')」으로 현실이 되었다. 세 사건의 비교는 「[스탈린 사후 동유럽의 위기, 1953–1956](' + ev('eastern-europe-crisis-1953-1956') + ')」 항목이 다룬다.',
                en: 'June 1953 was the first popular uprising under Stalinism, and the Soviet leaders around Khrushchev feared that its example would spread to Poland, Czechoslovakia and Hungary. In an analysis of 23 June the Polish United Workers’ Party wrote that the errors of its German sister party — the excessive raising of norms and the accelerated construction of socialism — had undoubtedly provided the basis for the “provocation”. Three years later those fears came true in [The Poznań Uprising](' + ev('poznan-1956') + ') and [The Hungarian Revolution](' + ev('hungarian-revolution') + '). The three are compared in [Eastern Europe after Stalin: the crises of 1953–1956](' + ev('eastern-europe-crisis-1953-1956') + ').',
                sources: [S.fricke, S.de],
            },
        ],
    },
];

const event = buildEvent({
    id: 'east-german-uprising-1953',
    title: { ko: '1953년 동독 6월 봉기', en: 'The East German uprising of 1953' },
    period: '1952.07–1953.07',
    sortOrder: 193,
    question: {
        ko: '1953년 6월 동베를린 건설 노동자들의 파업은 어떻게 하루 만에 동독 전역의 봉기로 번졌으며, 소련군의 진압 뒤 동독 국가와 그 기억은 어떻게 달라졌는가?',
        en: 'How did a strike by East Berlin building workers in June 1953 become a nationwide uprising within a day, and how did the Soviet suppression change the East German state and the memory of the event?',
    },
    summary: {
        ko: '1952년 7월 독일 사회주의통일당은 「사회주의의 계획적 건설」을 선포하고 집단화·재무장·중공업 투자와 교회 탄압을 밀어붙였다. 생활이 무너지고 탈출이 급증하자 스탈린 사후 모스크바는 1953년 6월 「새 노선」을 명령했지만, 정권은 노동자의 작업 기준량 10% 인상만은 거두지 않았다. 6월 16일 동베를린 스탈린알레의 건설 노동자들이 파업하고 행진했고, 서베를린 RIAS 방송을 타고 소식이 퍼지면서 17일에는 700여 곳에서 100만 명 이상이 파업과 시위에 나서 정부 퇴진과 자유선거를 요구했다. 소련군은 비상사태를 선포하고 전차로 봉기를 진압했다. 사료로 확인된 사망자는 55명이며 처형과 대량 체포가 뒤따랐다.',
        en: 'In July 1952 the Socialist Unity Party proclaimed the “planned construction of socialism”, pushing through collectivisation, rearmament, heavy-industry investment and repression of the churches. As living standards collapsed and flight to the West soared, post-Stalin Moscow ordered a “New Course” in June 1953, but the regime kept the ten per cent increase in workers’ norms. On 16 June building workers on East Berlin’s Stalinallee struck and marched; as the news spread over West Berlin’s RIAS radio, on the 17th more than a million people in some 700 localities struck and demonstrated, demanding the government’s resignation and free elections. Soviet forces declared a state of emergency and crushed the rising with tanks. Fifty-five deaths are documented in the sources, and executions and mass arrests followed.',
    },
    outcome: {
        ko: '기준량 인상은 철회되었고 새 노선의 양보와 소련의 지원으로 생활은 나아졌지만, 정권은 소련의 무력으로만 유지된다는 사실이 드러났다. 6월 26일 베리야가 체포되자 모스크바는 울브리히트를 지키기로 했고, 울브리히트는 헤른슈타트와 차이서를 숙청하고 국가보안부와 공장 감시를 키웠다. 1만여 명이 체포되고 동독 법원만 1,500명 넘게 처벌했다. 사회주의통일당은 봉기를 「파시스트 쿠데타 기도」로 규정했고, 서독은 6월 17일을 「독일 통일의 날」로 기념했다. 3년 뒤 폴란드와 헝가리에서 비슷한 위기가 되풀이되었다.',
        en: 'The norm increase was revoked, and New Course concessions and Soviet aid improved living standards, but it was now plain that the regime survived only by Soviet arms. After Beria’s arrest on 26 June Moscow decided to keep Ulbricht, who purged Herrnstadt and Zaisser and expanded the Stasi and factory surveillance. Some 10,000 people were arrested and GDR courts alone convicted more than 1,500. The SED branded the rising a “fascist putsch attempt”, while West Germany commemorated 17 June as the “Day of German Unity”. Three years later similar crises recurred in Poland and Hungary.',
    },
    sections,
    timeline: [
        ['1952.07.12', '제2차 당 협의회', 'Second Party Conference', '울브리히트가 「사회주의 기초의 계획적 건설」을 선포했다.', 'Ulbricht proclaimed the “planned construction of the foundations of socialism”.', 'east-germany'],
        ['1953.03.05', '스탈린 사망', 'Death of Stalin', '모스크바의 새 집단지도부가 동독 정책을 다시 검토하기 시작했다.', 'The new collective leadership in Moscow began to review its policy on the GDR.', 'soviet'],
        ['1953.03', '탈출 최고치', 'Record flight', '한 달 동안 5만 8,605명의 동독 난민이 서쪽에 등록되었다.', 'A record 58,605 East German refugees were registered in the West in a single month.', ['east-germany', 'germany']],
        ['1953.05.14', '작업 기준량 10% 인상', 'Work norms raised by 10%', '사회주의통일당 중앙위원회가 6월 30일까지 기준량을 10% 올리기로 결정했다.', 'The SED Central Committee decided to raise work norms by ten per cent by 30 June.', 'east-germany'],
        ['1953.06.02', '모스크바의 조치 결정', 'Moscow’s decree', '소련 각료회의가 「정치 상황 건전화를 위한 조치」를 동독 지도부에 건넸다.', 'The Soviet Council of Ministers handed the East German leaders its “measures to improve the political situation”.', ['soviet', 'east-germany']],
        ['1953.06.11', '「새 노선」 공보문', 'New Course communiqué', '정치국이 오류를 인정하고 양보를 발표했지만 기준량 인상은 남겼다.', 'The Politburo admitted errors and announced concessions but kept the norm increase.', 'east-germany'],
        ['1953.06.12', '브란덴부르크 교도소 앞 집회', 'Rally at Brandenburg prison', '약 5,000명이 교도소 앞에 모여 수감자 석방을 요구했다.', 'About 5,000 people gathered outside the prison demanding the release of inmates.', 'east-germany', P(52.4125, 12.5316, '브란덴부르크안데어하펠', 'Brandenburg an der Havel')],
        ['1953.06.16', '스탈린알레 파업', 'Stalinallee strike', '건설 노동자들이 각료의 집으로 행진하고 이튿날 총파업을 호소했다.', 'Building workers marched on the House of Ministries and called a general strike for the next day.', 'east-germany', P(52.5182, 13.4279, '스탈린알레·슈트라우스베르거 광장', 'Stalinallee / Strausberger Platz')],
        ['1953.06.17', '동베를린 봉기와 비상사태', 'Rising and state of emergency in East Berlin', '각료의 집 앞에 2만 5,000명이 모였고 소련군이 오후 1시 무렵 비상사태를 선포했다.', '25,000 gathered at the House of Ministries; Soviet forces declared a state of emergency around 1 p.m.', ['east-germany', 'soviet'], P(52.5096, 13.3830, '각료의 집(라이프치거 슈트라세)', 'House of Ministries, Leipziger Strasse')],
        ['1953.06.17', '할레의 봉기', 'Rising in Halle', '9만~10만 명이 시위하고 교도소에서 수감자 251명을 풀어 주었다.', '90,000–100,000 demonstrated and freed 251 prisoners from a jail.', 'east-germany', P(51.4825, 11.9697, '할레', 'Halle')],
        ['1953.06.17', '괴를리츠의 봉기', 'Rising in Görlitz', '3만 명이 당사와 교도소를 부수었고 몇 시간 동안 정권이 무너졌다.', '30,000 wrecked the party offices and the prison, and SED rule collapsed for a few hours.', 'east-germany', P(51.1528, 14.9873, '괴를리츠', 'Görlitz')],
        ['1953.06.18', '즉결 처형', 'Summary executions', '서베를린의 빌리 괴틀링, 마그데부르크의 다르치와 슈타우흐가 소련군 명령으로 총살되었다.', 'Willi Göttling of West Berlin and Dartsch and Stauch in Magdeburg were shot on Soviet orders.', ['east-germany', 'soviet'], P(52.1205, 11.6276, '마그데부르크', 'Magdeburg')],
        ['1953.06.26', '베리야 체포', 'Beria arrested', '모스크바의 정변으로 울브리히트를 몰아내려던 구상이 힘을 잃었다.', 'The coup in Moscow undercut plans to remove Ulbricht.', 'soviet'],
        ['1953.07.03', '「독일 통일의 날」', '“Day of German Unity”', '서독 연방의회가 6월 17일을 국경일로 정했다.', 'The West German Bundestag made 17 June a national holiday.', 'germany'],
        ['1953.07.10', '예나 카를 차이스 파업', 'Carl Zeiss strike in Jena', '봉기 진압 뒤에도 7월 10~11일 예나의 카를 차이스 공장에서 파업이 일어났다.', 'Even after the suppression, workers at Carl Zeiss in Jena struck on 10–11 July.', 'east-germany', P(50.9272, 11.5892, '예나', 'Jena')],
        ['1953.07.26', '헤른슈타트·차이서 숙청', 'Herrnstadt and Zaisser purged', '제15차 중앙위원회 총회가 두 사람을 정치국과 중앙위원회에서 몰아냈다.', 'The Central Committee’s 15th plenum removed both from the Politburo and the Central Committee.', 'east-germany'],
        ['1953.07.27', '아이젠하워 소포', 'Eisenhower packages', '미국이 서베를린에서 동독 주민에게 식량 소포를 나누어 주기 시작했다.', 'The United States began handing out food parcels to East Germans in West Berlin.', ['usa', 'germany', 'east-germany']],
    ],
    // Within 0.05° of another Berlin marker (audit-event-locations): kept only as a timeline map point.
    locations: [
        ['동베를린', 'East Berlin', 52.5200, 13.4050, 'main'],
        ['할레', 'Halle', 51.4825, 11.9697, 'place'],
        ['비터펠트', 'Bitterfeld', 51.6236, 12.3270, 'place'],
        ['라이프치히', 'Leipzig', 51.3397, 12.3731, 'place'],
        ['마그데부르크', 'Magdeburg', 52.1205, 11.6276, 'place'],
        ['괴를리츠', 'Görlitz', 51.1528, 14.9873, 'place'],
        ['예나', 'Jena', 50.9272, 11.5892, 'place'],
    ],
    countries: ['east-germany', 'soviet', 'germany', 'usa'],
    relations: { parent: 'eastern-europe-crisis-1953-1956', related: ['soviet-zone-gdr-1945-1949', 'beria-purge', 'berlin-wall'] },
    noAutoLink: ['New Course', 'The New Course', 'Presidium', 'Republic', 'strike committee', 'plenum', '트랄'],
    focus: null,
    sides: [
        { id: 'insurgents', label: { ko: '파업 노동자와 봉기한 시민', en: 'Striking workers and protesters' } },
        { id: 'regime', label: { ko: '사회주의통일당 정권과 소련군', en: 'The SED regime and Soviet forces' } },
    ],
    people: [
        ['walter-ulbricht', 'leader', '사회주의통일당 서기장', 'General Secretary of the SED', '「사회주의의 계획적 건설」을 선포했고, 봉기 뒤 베리야의 몰락 덕에 자리를 지키며 반대파를 숙청했다.', 'Proclaimed the “planned construction of socialism” and, after the rising, kept power thanks to Beria’s fall and purged his opponents.', 'regime'],
        ['otto-grotewohl', 'leader', '동독 총리', 'Prime Minister of the GDR', '노동자들의 청원을 묵살했고 17일 라디오에서 봉기를 「파시스트 첩자들의 소행」이라 불렀다.', 'Ignored the workers’ petition and on the 17th called the rising the work of “fascist agents” on the radio.', 'regime'],
        ['vladimir-semyonov', 'executor', '소련 고등판무관', 'Soviet High Commissioner in Germany', '새 노선을 서두르게 했고 16일 밤 소련군 투입을 통보했으며, 주모자 총살 지시를 받았다고 회고했다.', 'Pressed for a hasty New Course, announced the deployment of Soviet troops on the 16th, and recalled receiving orders to shoot ringleaders.', 'regime'],
        ['grechko', 'executor', '주독 소련군 총사령관', 'Commander-in-chief of Soviet forces in Germany', '봉기 진압을 지휘했고, 그의 비밀 보고는 18일까지 사상자를 209명으로 적었다.', 'Directed the suppression; his secret report put casualties at 209 by 18 June.', 'regime'],
        ['vasily-sokolovsky', 'participant', '소련군 원수', 'Marshal of the Soviet Union', '세묘노프·유딘과 함께 울브리히트 퇴진을 권고하는 6월 24일 보고서를 썼다.', 'Co-signed with Semyonov and Yudin the report of 24 June recommending Ulbricht’s removal.', 'regime'],
        ['malenkov', 'leader', '소련 각료회의 의장', 'Chairman of the Soviet Council of Ministers', '6월 2일 동독 지도부에 바꾸지 않으면 파국이 온다고 경고했고, 이후 울브리히트를 지지했다.', 'Warned the East German leaders on 2 June that without change catastrophe would follow, and later backed Ulbricht.', 'regime'],
        ['beria', 'participant', '소련 내무장관', 'Soviet Minister of Internal Affairs', '동독을 「진짜 국가도 아닌 것」이라 불렀고, 봉기 뒤인 6월 26일 체포되었다.', 'Called East Germany “not even a real state” and was arrested on 26 June, after the rising.', 'regime'],
        ['molotov', 'participant', '소련 외무장관', 'Soviet Foreign Minister', '5월 5일 독일 문제 안건 작성을 맡았고, 봉기를 계기로 베리야의 노선을 위험하다고 보게 되었다.', 'Was charged on 5 May with drafting a paper on Germany and was convinced by the rising that Beria’s line was dangerous.', 'regime'],
        ['khrushchev', 'participant', '소련 공산당 중앙위원회 서기', 'Secretary of the CPSU Central Committee', '베리야 체포 뒤 울브리히트를 지지해 그의 생존을 도왔다.', 'Backed Ulbricht after Beria’s arrest, helping him survive.', 'regime'],
        ['erich-honecker', 'participant', '자유독일청년단 지도자', 'Leader of the Free German Youth', '7월 8일 정치국에서 마테른과 함께 울브리히트를 편든 두 사람 가운데 하나였다.', 'Was one of only two Politburo members, with Matern, who backed Ulbricht on 8 July.', 'regime'],
        ['erich-mielke', 'participant', '국가보안부 차관', 'Deputy Minister of State Security', '봉기 뒤 숙청을 거치며 동독 정치를 이끈 강경파로 꼽힌다.', 'Counted among the hard-liners who shaped East German politics after the post-uprising purges.', 'regime'],
        ['bertolt-brecht', 'witness', '극작가·시인', 'Playwright and poet', '울브리히트에게 연대의 편지를 보냈으나 시 「해결책」으로 정권을 풍자했다.', 'Sent Ulbricht a letter of allegiance yet satirised the regime in the poem “Die Lösung”.'],
        ['konrad-adenauer', 'participant', '서독 총리', 'West German Chancellor', '6월 19일 베를린에서 희생자를 추모했고 통일의 전제로 자유선거를 요구했다.', 'Mourned the dead in Berlin on 19 June and demanded free elections as the precondition of unity.'],
        ['ernst-reuter', 'witness', '서베를린 시장', 'Governing Mayor of West Berlin', '빈에서 급히 돌아가려 했으나 미국에게서 군용기를 얻지 못했다.', 'Tried to rush back from Vienna but was refused a US military plane.'],
        ['dwight-d-eisenhower', 'participant', '미국 대통령', 'President of the United States', '7월 10일 동독 주민을 위한 식량 소포 계획을 발표했다.', 'Announced the food parcel programme for East Germans on 10 July.'],
        ['john-foster-dulles', 'participant', '미국 국무장관', 'US Secretary of State', '아이젠하워와 함께 봉기를 소련의 통일 공세를 꺾는 데 이용하려 했다.', 'With Eisenhower, sought to exploit the rising to undercut the Soviet unification campaign.'],
    ],
});

module.exports = { event };
