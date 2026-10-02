// Hungary under German occupation, March 1944 – February 1945 (Hungary 1919–1944 batch, 2026-10-01).
// Exports { event, people, terms } built with ./lib.js. Person cards live in
// ./people-1944-a.js and ./people-1944-b.js.
const { W, HU, P, event: buildEvent, term } = require('./lib');

const E = t => W(encodeURI(t));
const H = t => HU(encodeURI(t));
const KO = t => 'https://ko.wikipedia.org/wiki/' + encodeURI(t);
const S = {
    marg: E('German_invasion_of_Hungary_(1944)'),
    huMarg: H('Margarethe_hadművelet'),
    holo: E('The_Holocaust_in_Hungary'),
    ushmm: 'https://encyclopedia.ushmm.org/content/en/article/the-holocaust-in-hungary',
    sztojay: E('Döme_Sztójay'),
    huSztojayGov: H('Sztójay-kormány'),
    veesenmayer: E('Edmund_Veesenmayer'),
    endre: E('László_Endre'),
    baky: E('László_Baky'),
    jaross: E('Andor_Jaross'),
    bajcsy: E('Endre_Bajcsy-Zsilinszky'),
    seredi: E('Jusztinián_György_Serédi'),
    protocols: E('Auschwitz_Protocols'),
    kasztner: E('Kastner_train'),
    lakatos: E('Géza_Lakatos'),
    huBreakout: H('1944-es_kiugrási_kísérlet'),
    panzerfaust: E('Operation_Panzerfaust'),
    koPanzerfaust: KO('판처파우스트_작전'),
    miklos: E('Béla_Miklós'),
    szalasi: E('Ferenc_Szálasi'),
    arrow: E('Arrow_Cross_Party'),
    ghetto: E('Budapest_Ghetto'),
    shoes: E('Shoes_on_the_Danube_Bank'),
    wallenberg: E('Raoul_Wallenberg'),
    lutz: E('Carl_Lutz'),
    perlasca: E('Giorgio_Perlasca'),
    debrecen: E('Battle_of_Debrecen'),
    bpOffensive: E('Budapest_offensive'),
    siege: E('Siege_of_Budapest'),
    huSiege: H('Budapest_ostroma'),
    koSiege: KO('부다페스트_공방전'),
    mnffb: H('Magyar_Nemzeti_Felkelés_Felszabadító_Bizottsága'),
    pfeffer: E('Karl_Pfeffer-Wildenbruch'),
};

const sections = [
    {
        heading: { ko: '클레스하임에서 마르가레테 작전으로 (1944년 3월)', en: 'From Klessheim to Operation Margarethe (March 1944)' },
        paragraphs: [
            {
                ko: '헝가리가 연합국과 강화를 꾀한다고 의심한 히틀러는 1944년 3월 헝가리 점령을 명령했다. 실제로 칼러이 미클로시 정부의 외교관 베레시 라슬로는 1943년 9월 서방 연합국에 무조건 항복한다는 비밀 협정에 서명한 바 있었다. 호르티는 오스트리아의 클레스하임 성으로 불려 가 더 큰 복종을 요구받았고, 3월 18일까지 이어진 회담 끝에 솜버테이이 페렌츠 참모총장의 설득과 「나의 신임을 받는 새 헝가리 정부가 들어서면 독일군을 철수시키겠다」는 히틀러의 약속을 받고 의정서에 서명했다. 독일군은 호르티의 귀국 열차를 일부러 돌려 늦추었고, 그사이 3월 19일 독일군이 국경을 넘었다. 칼러이의 비상회의에 불려 온 장군들은 저항이 소용없다고 했고, 솜버테이이는 호르티가 돌아올 때까지 저항하지 말라는 전보를 보냈다.',
                en: 'Suspecting that Hungary was seeking peace with the Allies, Hitler ordered its occupation in March 1944; in fact László Veress, a diplomat of Miklós Kállay’s government, had secretly signed an agreement to surrender unconditionally to the Western Allies in September 1943. Horthy was summoned to Schloss Klessheim in Austria and pressed for greater acquiescence; when the talks ended on 18 March, persuaded by his chief of staff Ferenc Szombathelyi and by Hitler’s promise that “the German troops shall be withdrawn as soon as a new Hungarian government that has my confidence has been formed”, he signed the protocol. The Germans kept side-tracking Horthy’s train home, and meanwhile, on 19 March, German troops crossed the border. The generals Kállay called to an emergency meeting told him that resistance was futile, and Szombathelyi telegraphed that there was to be no resistance until Horthy returned.',
                sources: [S.holo, S.marg, S.sztojay],
            },
            {
                ko: '기습이었던 점령은 빠르고 거의 피를 흘리지 않고 끝났다. 국경 경비대의 산발적 발포와 비치케 철도 노동자들의 파업 정도가 저항의 전부였고, 작전을 지휘한 막시밀리안 폰 바이흐스 원수는 「부다페스트는 조용하다」고 보고했다. 부다페스트 역에 도착한 호르티는 칼러이를 내보내고 독일에 전면 협력하는 정부를 세워야만 헝가리가 주권을 유지할 수 있다는 통보를 받았다. 왕실 회의에서 칼러이와 내무장관 케레스테시피셰르 페렌츠는 헝가리가 더는 독립국이 아니라고 말했고, 칼러이와 전 총리 베틀렌 이슈트반은 점령을 정당화하지 않도록 퇴위하라고 권했다. 그러나 더 나쁜 사람이 국가원수가 될 것을 걱정한 유대인 지도자들은 남아 달라고 청했고, 호르티는 「선장은 가라앉는 배를 떠날 수 없다」며 섭정 자리에 남았다. 이 결정은 지금도 역사가들 사이에서 논쟁거리다.',
                en: 'The occupation, a complete surprise, was quick and nearly bloodless: a few frontier guards opened fire and the railwaymen at Bicske went on strike, and Field Marshal Maximilian von Weichs, who directed the operation, reported that “in Budapest there is quiet”. At the Budapest station Horthy was told that Hungary would stay sovereign only if he removed Kállay and installed a government that would co-operate fully with Germany. At the Crown Council Kállay and the interior minister Ferenc Keresztes-Fischer said that Hungary was no longer independent, and Kállay and the former prime minister István Bethlen urged Horthy to abdicate rather than lend the occupation legitimacy. Jewish leaders, fearing that someone worse would replace him, asked him to stay, and Horthy remained regent, saying that “the captain cannot leave his sinking ship” — a decision still debated by historians.',
                sources: [S.marg],
            },
            {
                ko: '독일은 임레디 벨러를 총리로 원했으나 호르티는 거부했다. 3월 22일 18시까지 독일이 받아들일 정부를 세우지 않으면 왕궁을 공격하겠다는 최후통첩을 받은 호르티는 그날 오후 베를린 주재 대사였던 스토여이 되메를 총리로 하는 정부에 동의했고, 스토여이는 23일 총리 겸 외무장관에 취임했다. 임레디 자신은 빠졌지만 그의 헝가리 쇄신당 사람들이 농업·재무·산업 장관을 맡았고, 케레스테시피셰르 대신 급진 반유대주의자 여로시 언도르가 국가경찰과 헌병대를 관장하는 내무장관이 되었다. 여로시 밑의 두 차관 엔드레 라슬로와 버키 라슬로는 헝가리 나치 정당 출신의 열렬한 반유대주의자였다. 독일이 「존중할 만한」 정부를 원했기 때문에 살러시 페렌츠의 화살십자당은 내각에서 빠졌다. 히틀러의 대리인으로는 친위대 여단지도자 에드문트 페젠마이어가 제국 전권대표로 부임했다.',
                en: 'The Germans wanted Béla Imrédy as prime minister, but Horthy refused him. Given an ultimatum to form a government acceptable to the Reich by 6 p.m. on 22 March or see the Royal Castle stormed, Horthy agreed that afternoon to a government under Döme Sztójay, the minister in Berlin, who was sworn in as prime minister and foreign minister on the 23rd. Imrédy himself was left out, but members of his Party of Hungarian Renewal took agriculture, finance and industry, and in place of Keresztes-Fischer the radical antisemite Andor Jaross became interior minister, controlling the State Police and the gendarmerie. Jaross’s two state secretaries, László Endre and László Baky, were enthusiastic antisemites from the Hungarian National Socialist Party. Because the Germans wanted a “respectable” government, Ferenc Szálasi’s Arrow Cross was kept out of the cabinet. Hitler’s man in Budapest was SS-Brigadeführer Edmund Veesenmayer, installed as Reich plenipotentiary.',
                sources: [S.marg, S.sztojay, S.huSztojayGov, S.veesenmayer, S.holo],
            },
            {
                ko: '점령과 함께 대대적인 체포가 시작되었다. 3월 19일 아침 친위대가 아파트 문을 부수고 들어오자 야당 정치인 버이치질린스키 엔드레는 권총으로 맞서다 총상을 입고 끌려갔다. 케레스테시피셰르는 게슈타포에 체포되어 다하우 수용소로 보내졌고, 칼러이는 튀르키예 공사관으로 피신했으며 베틀렌은 장교로 변장해 트란실바니아로 몸을 숨겼다. 사회민주당 지도자 페이에르 카로이는 가족이 인질로 잡히자 자수했다. 4월 28일까지 독일은 헝가리에서 8,240명을 체포했는데, 그 가운데 다수는 칼러이 정부가 받아 준 탈출 연합군 포로와 1939년에 넘어온 폴란드 군인이었다. 3월 22일 의회가 열렸을 때 하원 의원 13명과 상원 의원 9명이 친위대에 체포되어 나오지 못했고, 스토여이는 의회를 무기한 휴회하고 법령으로 통치했다. 정부는 야당과 노동조합을 금지하고 언론을 검열했으며, 페젠마이어는 4월까지 주지사 41명 가운데 29명을 갈아치웠다.',
                en: 'Mass arrests accompanied the occupation. When the SS broke down his door on the morning of 19 March, the opposition politician Endre Bajcsy-Zsilinszky fought back with his pistol and was carried off wounded. Keresztes-Fischer was arrested by the Gestapo and sent to Dachau; Kállay took refuge in the Turkish legation, and Bethlen, disguised as an officer, went into hiding in Transylvania. The Social Democratic leader Károly Peyer gave himself up after the Germans took his family hostage. By 28 April the Germans had arrested 8,240 people in Hungary, many of them escaped Allied prisoners of war and Polish soldiers who had found sanctuary under Kállay. When parliament met on 22 March, 13 members of the lower house and 9 of the upper house were absent under SS arrest, and Sztójay adjourned it indefinitely and ruled by decree. The government banned the opposition parties and the trade unions and censored the press, and by April Veesenmayer had replaced 29 of the 41 lord lieutenants.',
                sources: [S.marg, S.bajcsy],
            },
        ],
    },
    {
        heading: { ko: '노란 별과 게토 (1944년 3–5월)', en: 'The yellow star and the ghettos (March–May 1944)' },
        paragraphs: [
            {
                ko: '점령 당시 헝가리에는 76만~78만 명의 유대인이 살고 있었고, 이는 유럽에 남은 가장 큰 유대인 공동체였다. 스토여이 정부는 수십 개의 반유대 법령으로 이들을 고립시키고 낙인찍고 빈곤하게 만들었다. 유대인은 자동차, 전화, 라디오, 자전거를 내놓아야 했고, 비유대인과 함께 영화나 연극을 보는 것이 금지되었으며 식량 배급이 줄었다. 3월 31일의 법령에 따라 4월 5일부터 6세 이상의 유대인은 옷 왼쪽 가슴에 가로세로 10cm의 노란 다윗의 별을 달아야 했다. 스토여이는 화살십자당을 합법화했고, 4월 5일 수좌대주교 세레디 유스티니안에게 가톨릭으로 개종한 유대인에게도 인종법을 적용하되 사제와 수도자만 예외로 하겠다고 통보했다.',
                en: 'At the time of the occupation between 760,000 and 780,000 Jews lived in Hungary, the largest Jewish community still alive in Europe. Sztójay’s government issued dozens of antisemitic decrees designed to isolate, stigmatise and impoverish them. Jews had to hand over cars, telephones, radios and bicycles, were barred from films and plays with non-Jews, and had their food rations cut. A decree of 31 March required every Jew aged six and over to wear a yellow Star of David, ten centimetres across, on the left breast from 5 April. Sztójay legalised the Arrow Cross, and on 5 April told the Prince Primate, Cardinal Jusztinián Serédi, that Jewish converts to Catholicism would be subject to the racial laws, with exemptions only for priests, monks and nuns.',
                sources: [S.ushmm, S.huSztojayGov, S.holo, S.sztojay],
            },
            {
                ko: '친위대 중령 아돌프 아이히만은 이송 전문가들로 이루어진 특별작전대를 이끌고 부다페스트에 와 마제스틱 호텔에 본부를 차렸다. 아이히만의 부대는 200명 남짓이었고, 이송 실무의 대부분은 헝가리 관리들이 맡았다. 아이히만은 3월 20일 유대인 지도층을 불러 유대인 평의회를 만들게 하고 「동방 이주」를 준비하라고 지시했다. 4월 4일 버키가 주재하고 아이히만 특별작전대 간부들, 엔드레, 헌병 중령 페렌치 라슬로가 참석한 회의는 유대인의 재산을 먼저 빼앗고 도시의 게토에 모은 뒤 독일로 이송하기로 정했다. 버키는 여로시에게 「헝가리 왕국 정부는 곧 나라에서 유대인을 일소할 것이다. 성별과 나이를 가리지 않고 지정된 수용소로 이송하라」고 썼다. 헝가리와 독일 당국은 전국을 여섯 개 작전 구역으로 나누어 구역마다 게토화와 이송을 차례로 진행했다.',
                en: 'SS-Obersturmbannführer Adolf Eichmann came to Budapest with a special commando of deportation experts and set up his staff in the Majestic Hotel. His unit numbered only some 200 men; most of the work of deportation was done by Hungarian officials. On 20 March Eichmann summoned the Jewish elite to form a Jewish Council and prepare the community for “resettlement in the East”. A meeting chaired by Baky on 4 April, attended by senior members of Eichmann’s commando, Endre and the gendarmerie lieutenant-colonel László Ferenczy, agreed that Jews would first be stripped of their possessions, then concentrated in urban ghettos and deported to Germany. Baky wrote to Jaross that “the Royal Hungarian Government will soon have the country purged of Jews… irrespective of sex or age”. German and Hungarian authorities divided the country into six operational zones, in each of which ghettoisation preceded deportation.',
                sources: [S.holo, S.marg, S.baky, S.ushmm],
            },
            {
                ko: '4월부터 지방 관리, 시장, 경찰, 헌병이 전국의 도시에 임시 게토를 세웠다. 게토는 유대인 거리나 공장, 창고, 벽돌 공장 같은 큰 건물에 마련되었고 이송이 쉽도록 대개 철도 가까이에 있었다. 작은 마을의 유대인은 큰 도시의 게토로 옮겨져 며칠에서 몇 주 동안 헝가리 당국의 감시 아래 갇혔고, 약탈과 고문이 뒤따랐다. 계획은 5월 중순부터 화물차 45량짜리 열차를 하루 네 편씩 보내 지방에서 매일 1만 2,000명을 이송하고, 7월 15일 무렵부터 부다페스트의 유대인을 이송하는 것이었다. 유대인 가족이 끌려가면 이웃들이 곧바로 집을 털었고, 중산층 유대인의 재산을 차지하려는 탐욕이 이송을 뒷받침했다.',
                en: 'From April regional and district officials, mayors, policemen and gendarmes set up transit ghettos in towns and cities. They were placed in Jewish neighbourhoods or in large buildings such as factories, warehouses and brickyards, usually near the railway to simplify deportation. Jews from villages were moved into the ghettos of larger towns and held there for days or weeks under Hungarian guard, amid widespread plunder and torture. The plan was to run four trains of 45 cattle cars a day from mid-May, deporting 12,000 Jews from the countryside every day, and to deport the Jews of Budapest from about 15 July. When a Jewish family was taken away, neighbours promptly looted the home; greed for the property of the Jewish middle class sustained the deportations.',
                sources: [S.ushmm, S.holo, S.marg],
            },
        ],
    },
    {
        heading: { ko: '147개의 열차: 아우슈비츠 이송 (1944년 5–7월)', en: '147 trains: the deportations to Auschwitz (May–July 1944)' },
        paragraphs: [
            {
                ko: '첫 이송 열차는 4월 29일 노동 능력이 있다고 판정된 1,800명을 싣고 부다페스트를 떠났다. 대량 이송은 5월 14~15일 시작되어, 대개 하루 서너 편의 열차가 커셔(코시체) 역을 지나 북쪽 국경으로 갔고 국경까지는 헝가리 정부가 책임졌다. 첫 열차들은 5월 16일 아우슈비츠에 닿았다. 미국 홀로코스트 기념관에 따르면 5월 15일부터 7월 9일까지 약 43만 7,000명이 열차 147편으로 이송되었고 그 가운데 약 42만 명이 아우슈비츠-비르케나우로 갔다. 그곳에서 약 10만 명이 강제노동에 뽑혔고 나머지 약 33만 명은 도착 즉시 가스실에서 살해되었다. 아우슈비츠-비르케나우에서 가장 많은 사람이 죽은 시기였다.',
                en: 'The first train left Budapest on 29 April with 1,800 people deemed fit for work. The mass transports began on 14–15 May: on a typical day three or four trains passed through Kassa (Košice) towards the northern border, up to which the Hungarian government was responsible for them. The first trains reached Auschwitz on 16 May. According to the US Holocaust Memorial Museum, some 437,000 Jews were deported on 147 trains between 15 May and 9 July, about 420,000 of them to Auschwitz-Birkenau. There some 100,000 were selected for forced labour, and the remaining 330,000 or so were murdered in the gas chambers on arrival. It was the deadliest period in the history of Auschwitz-Birkenau.',
                sources: [S.holo, S.ushmm],
            },
            {
                ko: '헌병대의 페렌치 라슬로는 7월 9일까지 147편의 열차로 43만 4,351명이 이송되었다고 셌고, 페젠마이어는 43만 7,402명으로 보고했다. 페젠마이어는 6월 13일 외무부에 카르파티아와 트란실바니아에서 열차 92편으로 유대인 28만 9,357명을 실어 보냈다고 전보했고, 6월 15일에는 리벤트로프에게 약 34만 명이 제국에 넘겨졌다고 보고하며 이송이 끝나면 90만 명에 이를 것이라고 내다보았다. 아우슈비츠의 초대 소장 루돌프 회스는 5월 8일부터 7월 29일까지 수용소로 돌아와 헝가리 유대인의 학살을 감독했고, 독일인들은 이를 「회스 작전」이라 불렀다. 회스에 따르면 하인리히 힘러는 이송을 더 서두르기를 바랐다. 6월에는 약 1만 5,000명(영어 위키백과는 약 2만 1,000명)이 빈 근처 슈트라스호프로 돌려져 강제노동을 했고, 이들은 상대적으로 많이 살아남았다.',
                en: 'László Ferenczy of the gendarmerie counted 434,351 Jews deported in 147 trains by 9 July; Veesenmayer reported 437,402. On 13 June Veesenmayer cabled the Foreign Office that 289,357 Jews had been transported from the Carpathians and Transylvania in 92 trains, and on 15 June told Ribbentrop that some 340,000 had been delivered to the Reich, predicting that the total would reach 900,000. Rudolf Höss, the first commandant of Auschwitz, returned to the camp from 8 May to 29 July to oversee the arrival and gassing of the Hungarian Jews, and the Germans called the killings “Operation Höss”; according to Höss, Heinrich Himmler wanted the deportations speeded up. In June some 15,000 Jews (about 21,000 according to English Wikipedia) were diverted to Strasshof near Vienna for forced labour, and a much larger share of them survived.',
                sources: [S.holo, S.veesenmayer, S.ushmm],
            },
            {
                ko: '부다페스트의 유대인 구조위원회는 나치 지도자들과 협상하고 뇌물을 써서 사람을 구하려 했다. 아이히만은 4월 말 위원회 측에 연합국 트럭 1만 대와 유대인 100만 명을 맞바꾸자는 「물자와 피」 제안을 했지만, 이 제안은 영국 정부가 막았다. 위원회의 커스트네르 레죄는 아이히만, 친위대 장교 쿠르트 베허와 따로 거래해 금, 다이아몬드, 현금을 몸값으로 치르고 유대인들을 태운 화물차 35량의 열차를 6월 30일 부다페스트에서 내보냈다. 열차는 베르겐벨젠 수용소로 돌려져 7월 9일 그곳에서 1,684명이 등록되었고, 살아남은 1,670명이 8월과 12월에 스위스에 닿았다. 커스트네르는 아우슈비츠의 학살을 4~5월에 알고도 공동체 전체에 경고하지 않았다는 비난을 받았다. 이스라엘에서 열린 재판에서 1955년 1심 판사는 그가 「악마에게 영혼을 팔았다」고 했고, 그가 1957년 3월 암살된 뒤 대법원은 판결의 대부분을 뒤집었다.',
                en: 'The Aid and Rescue Committee in Budapest tried to save Jews by negotiating with and bribing Nazi leaders. In late April Eichmann put to the committee a “blood for goods” offer to exchange one million Jews for 10,000 trucks from the Allies, which the British government blocked. Rezső Kasztner of the committee made a separate deal with Eichmann and the SS officer Kurt Becher: for a ransom of gold, diamonds and cash, a train of 35 cattle wagons carrying Jews left Budapest on 30 June. Diverted to Bergen-Belsen, where 1,684 passengers were registered on 9 July, its 1,670 surviving passengers reached Switzerland in August and December. Kasztner was accused of knowing about the gassings at Auschwitz in April or May without warning the wider community. In an Israeli trial the judge ruled in 1955 that he had “sold his soul to the devil”; after he was assassinated in March 1957, the Supreme Court overturned most of the ruling.',
                sources: [S.ushmm, S.holo, S.kasztner],
            },
        ],
    },
    {
        heading: { ko: '아우슈비츠 보고서와 이송 중단 (1944년 6–7월)', en: 'The Auschwitz reports and the halt to the deportations (June–July 1944)' },
        paragraphs: [
            {
                ko: '1944년 4월 7~11일 아우슈비츠에서 탈출한 슬로바키아 출신 수감자 루돌프 브르바와 알프레트 베츨러는 가스실의 작동을 자세히 적은 보고서를 남겼다. 이 보고서는 4월 브라티슬라바의 유대인 구조 조직을 통해 퍼졌고, 5월 초에는 호르티의 아들과 며느리도 사본을 받았다. 부다페스트에서 스위스로 전해진 요약본은 커스트네르가 비밀로 해 달라고 했는데도 6월 공개되어, 스위스에서 대규모 시위와 약 400건의 신문 기사가 쏟아졌다. BBC는 6월 16일 보고서 내용을 방송했고 『뉴욕 타임스』는 20일 보도했다. 다른 탈출자들의 보고와 함께 「아우슈비츠 의정서」로 불리게 된 이 문서들은 11월 미국 전쟁난민위원회가 전문을 발표했다.',
                en: 'Rudolf Vrba and Alfred Wetzler, two Slovak prisoners who escaped from Auschwitz on 7–11 April 1944, compiled a detailed report on the gas chambers. It was circulated in April by the Bratislava Working Group, and in early May Horthy’s son and daughter-in-law received copies. A summary that reached Switzerland from Budapest was published in June despite Kasztner’s request to keep it confidential, setting off mass demonstrations and some 400 press headlines in Switzerland. The BBC broadcast its findings on 16 June and The New York Times reported them on the 20th. Together with other escapees’ accounts, the documents became known as the Auschwitz Protocols; the US War Refugee Board published them in full in November.',
                sources: [S.protocols, S.holo, S.wallenberg],
            },
            {
                ko: '6월 15일 미국 폭격기가 부다페스트 상공에 유대인 이송에 가담한 자를 처벌하겠다는 전단을 뿌렸다. 보고서를 근거로 교황 비오 12세가 6월 25일, 프랭클린 D. 루스벨트 미국 대통령이 26일, 스웨덴 국왕 구스타프 5세가 30일 호르티에게 이송 중단을 호소했고, 루스벨트는 군사적 보복을 경고했다. 윈스턴 처칠은 헝가리 유대인 박해가 「아마도 세계 역사상 가장 크고 끔찍한 범죄」라고 썼다. 헝가리 가톨릭교회의 수장 세레디는 봄에 인종을 이유로 한 유대인 공격과 이송을 비판하는 성명을 내고 개종자의 면제를 요구했지만, 국내 신자들에게 이송을 공개적으로 규탄하지는 않았다. 주교들의 압력으로 6월 29일 이송 중단을 요구하는 사목 서한을 썼으나, 학살 보고를 조사해 사실이면 이송을 멈추겠다는 스토여이의 약속을 받고 서한을 발표하지 않기로 했다.',
                en: 'On 15 June American bombers dropped leaflets over Budapest threatening punishment for those involved in the deportations. On the basis of the report, Pope Pius XII on 25 June, President Franklin D. Roosevelt on the 26th and King Gustaf V of Sweden on the 30th appealed to Horthy to stop them, and Roosevelt threatened military retaliation. Winston Churchill wrote that the persecution of Hungary’s Jews was “probably the greatest and most horrible crime ever committed in the whole history of the world”. Serédi, head of the Hungarian Catholic Church, condemned attacks on Jews and their deportation on racial grounds in the spring and sought exemptions for converts, but made no public condemnation of the deportations to Catholics at home. Under pressure from his bishops he wrote a pastoral letter on 29 June demanding that the deportations stop, but agreed not to issue it in return for Sztójay’s promise to investigate the reports of extermination and halt the deportations if they were true.',
                sources: [S.holo, S.wallenberg, S.seredi, S.sztojay],
            },
            {
                ko: '호르티는 6월 초 스토여이에게 편지를 보내 유대인이 비인도적으로 다루어진다는 보고를 들었다며 엔드레와 버키를 내무부에서 물러나게 하라고 요구했지만 소용이 없었다. 6월 26일 왕실 회의에서 이송 중단을 제안했는데도 이송은 계속되었고, 7월 초 버키가 부다페스트 유대인을 이송하려고 헌병 수천 명을 수도로 불러들이려 하자 호르티는 쿠데타를 우려해 기갑부대로 이들을 막았다. 호르티는 7월 6일(미국 홀로코스트 기념관은 7일) 이송 중단을 명령했고, 부다페스트 주변 도시들의 이송은 9일에야 멈추었다. 이때 지방의 유대인 공동체는 거의 모두 사라진 뒤였다. 아이히만과 헝가리 협력자들은 7월 말과 8월에도 수용소에서 몇 차례 이송을 강행했다. 약 20만 명의 부다페스트 유대인은 6월 시장의 지정으로 약 1,950채의 「노란 별 집」에 모여 살아야 했다.',
                en: 'In early June Horthy wrote to Sztójay that he had heard of inhumane treatment of the Jews and asked him to remove Endre and Baky from the Interior Ministry, to no effect. He proposed halting the deportations at a Crown Council on 26 June, but they continued; when Baky tried in early July to bring thousands of gendarmes into the capital to deport the Jews of Budapest, Horthy, fearing a coup, sent armoured units to stop them. On 6 July (7 July according to the US Holocaust Memorial Museum) Horthy ordered the deportations halted; transports from the towns around Budapest stopped only on the 9th, by which time almost the entire Jewish community of the countryside was gone. Eichmann and his Hungarian allies still carried out a few deportations from internment camps in late July and August. Budapest’s 200,000 or so Jews had been ordered by the mayor in June to move into some 1,950 designated “yellow star houses”.',
                sources: [S.sztojay, S.huSztojayGov, S.holo, S.ushmm],
            },
        ],
    },
    {
        heading: { ko: '루마니아의 전향과 러커토시 정부의 휴전 시도 (1944년 8–10월)', en: 'Romania’s switch and the Lakatos government’s armistice attempt (August–October 1944)' },
        paragraphs: [
            {
                ko: '1944년 8월 23일 루마니아 국왕 미하이 1세가 이온 안토네스쿠를 해임하고 연합국과 휴전한 뒤 독일과 헝가리에 선전포고했다. 독일은 주요 석유 공급원을 잃었고, 소련·루마니아군이 1940년 헝가리가 얻은 북부 트란실바니아로 밀고 들어왔다. 8월 25일 호르티, 베틀렌, 러커토시 게저 장군이 만나 스토여이를 내보내기로 했고, 호르티는 8월 29일 러커토시를 총리로 임명했다. 베틀렌은 눈에 띄지 않으면서도 충성스러운 보수파 장군인 러커토시가 휴전에 알맞다고 보았다. 러커토시는 엔드레를 입각시키라는 페젠마이어의 요구를 거절했고, 여로시와 엔드레, 버키도 여름과 가을 사이에 자리에서 밀려났다. 내무장관 대리 호르바트 벨러는 헌병대에 어떤 이송 시도도 무력으로 막으라고 명령했다.',
                en: 'On 23 August 1944 King Michael I of Romania dismissed Ion Antonescu, concluded an armistice with the Allies and declared war on Germany and Hungary. Germany lost its main source of oil, and Soviet and Romanian forces pushed into Northern Transylvania, which Hungary had gained in 1940. On 25 August Horthy, Bethlen and General Géza Lakatos decided to remove Sztójay, and on 29 August Horthy made Lakatos prime minister; Bethlen saw Lakatos, an obscure but loyal conservative general, as the right man for an armistice. Lakatos refused Veesenmayer’s demand to include Endre in his cabinet, and Jaross, Endre and Baky were all pushed out between the summer and autumn. The acting interior minister, Béla Horváth, ordered the gendarmes to use deadly force against any attempt at deportation.',
                sources: [S.lakatos, S.endre, S.jaross, S.baky],
            },
            {
                ko: '9월 6일 붉은군대가 카르파티아의 독일·헝가리 전선을 뚫자 러커토시는 휴전을 서둘러야 한다고 보고했다. 그러나 내각의 친독 각료들이 곧바로 페젠마이어에게 알렸고, 24시간 안에 기갑사단 다섯 개를 보내 달라는 요구를 독일이 받아들이면서 결정은 늦어졌다. 러커토시는 뒤에 「이로써 우리는 휴전을 늦추었고, 동시에 독일의 주의를 우리의 준비로 끌어들였다」며 이를 최악의 실수라고 썼다. 9월 10일 왕실 회의에서 베틀렌은 전쟁은 졌으며 즉시 휴전해야 한다고 말했지만, 장군 대다수는 휴전이 공산 체제를 부른다며 반대했다. 호르티는 여전히 영미군의 점령을 바랐으나, 이탈리아로 보낸 너더이 이슈트반 장군은 연합국 셋 모두와 휴전하든지 아무와도 하지 말라는 답을 들고 왔다. 9월 22일 호르티는 소련과 휴전해야 한다는 것을 받아들였고, 같은 날 붉은군대가 대평원에 들어섰다.',
                en: 'On 6 September, when the Red Army broke through the German–Hungarian lines in the Carpathians, Lakatos told Horthy that an armistice could not wait. But pro-German ministers promptly informed Veesenmayer, and a demand that Germany send five panzer divisions within 24 hours — which Germany accepted — delayed the decision; Lakatos later called it his worst mistake: “With this we delayed the step for an armistice. At the same time we drew the Germans’ attention to our preparations.” At the Crown Council of 10 September Bethlen said that the war was lost and an armistice must be signed at once, but most generals objected that it would bring a Communist regime. Horthy still hoped for an Anglo-American occupation, but General István Náday, sent to Italy, came back with the answer that Hungary must sign with all three Allied powers or none. On 22 September Horthy accepted that he would have to sign with the Soviet Union; that same day the Red Army entered the Great Hungarian Plain.',
                sources: [S.lakatos],
            },
            {
                ko: '9월 28일 모스크바 주재 무관을 지낸 퍼러고 가보르 장군이 이끄는 3인 대표단이 모스크바로 떠났다. 10월 1일부터 열흘 동안 이어진 협상에서 소련 측은 무조건 항복, 독일에 대한 선전포고, 1937년 국경 뒤로의 철수, 붉은군대의 통과를 요구했고 북부 트란실바니아는 루마니아에 돌려준다고 했다. 마침 모스크바에서 스탈린과 회담하던 처칠과 앤서니 이든도 소련의 조건을 지지했다. 호르티는 10월 9일 조건을 받아들였고, 11일 퍼러고와 소련 외무인민위원 뱌체슬라프 몰로토프가 예비 휴전에 서명했다. 같은 날 페젠마이어는 살러시를 만나 독일이 호르티를 몰아내기로 했으니 화살십자당은 쿠데타를 준비하라고 전했다.',
                en: 'On 28 September a three-man delegation led by General Gábor Faragho, a former military attaché in Moscow, left for the Soviet capital. In talks that began on 1 October and dragged on for ten days, the Soviet side demanded unconditional surrender, a declaration of war on Germany, withdrawal behind the 1937 frontiers and transit for the Red Army, and insisted that Northern Transylvania go back to Romania. Churchill and Anthony Eden, then in Moscow for talks with Stalin, backed the Soviet terms. Horthy accepted them on 9 October, and on the 11th Faragho and the Soviet foreign commissar Vyacheslav Molotov signed a preliminary armistice. The same day Veesenmayer met Szálasi and told him that Germany had decided to depose Horthy and that the Arrow Cross should prepare for a coup.',
                sources: [S.lakatos, S.huBreakout],
            },
        ],
    },
    {
        heading: { ko: '10월 15일: 휴전 선언, 판처파우스트 작전, 화살십자당 집권', en: '15 October: the armistice proclamation, Operation Panzerfaust and the Arrow Cross takeover' },
        paragraphs: [
            {
                ko: '호르티가 소련과 비밀 협상을 한다는 것을 안 히틀러는 친위대 특공대장 오토 스코르체니를 헝가리로 보냈다. 10월 15일 아침 스코르체니의 부대는 티토의 밀사를 만나게 해 주겠다며 호르티의 아들을 도나우 항만청 사무실로 꾀어내 총격전 끝에 붙잡았고, 카펫에 말아 비행기로 빈에 보낸 뒤 마우트하우젠 수용소에 가두었다. 그날 오전 왕실 회의에서 호르티는 휴전을 요청했다고 밝혔고, 아들의 납치를 모른다고 잡아떼는 페젠마이어 앞에 현장에서 주운 독일 탄피를 내던졌다. 낮 1시 무렵 라디오는 독일이 전쟁에서 졌으며 「적들에게 휴전을 요청하고 적대 행위를 멈춘다」는 섭정의 선언을 세 번 방송했다. 이미 11일에 예비 휴전에 서명했다는 사실은 빠졌고, 러커토시의 요구로 「오늘부터 헝가리는 독일과 전쟁 상태에 있다」는 문장도 지워져 있었다.',
                en: 'When Hitler learned that Horthy was secretly negotiating with the Soviets, he sent the SS commando leader Otto Skorzeny to Hungary. On the morning of 15 October Skorzeny’s men lured Horthy’s son to the offices of the Danube ports administration with a promise of a meeting with envoys of Tito, seized him after a gunfight, rolled him in a carpet and flew him to Vienna, from where he was taken to Mauthausen. At the Crown Council that morning Horthy announced that he had asked for an armistice, and threw German cartridge cases from the scene onto the table before Veesenmayer, who claimed to know nothing of the kidnapping. Around 1 p.m. the radio broadcast three times the regent’s proclamation that Germany had lost the war and that “we are asking our enemies for an armistice and ceasing hostilities against them”. It did not mention that a preliminary armistice had already been signed on the 11th, and at Lakatos’s insistence the sentence “from this day Hungary considers herself to be at war with Germany” had been deleted.',
                sources: [S.panzerfaust, S.huBreakout, S.lakatos],
            },
            {
                ko: '참모본부는 휴전 명령을 부대에 내려보내지 않았고, 오후 3시 참모총장 뵈뢰시 야노시는 섭정의 말은 휴전 협상을 시작한다는 뜻일 뿐이니 싸움을 계속하라는 「해명」을 보냈다. 화살십자당은 독일의 도움으로 방송국을 장악해 살러시가 스스로를 「민족 지도자」라 부르며 무장한 국민에게 전쟁을 계속하라고 명령하는 성명을 내보냈고, 독일 전차가 다리와 우체국 등 수도의 요지를 차지했다. 스코르체니는 티거 전차 네 대를 앞세워 왕궁 언덕에 다가갔고, 호르티 곁에는 경비병 약 300명만 남았다. 16일 새벽 페젠마이어와 러커토시가 아들의 목숨을 보장하겠다며 12분 안에 항복하라고 하자, 호르티는 휴전 선언을 철회하고 살러시를 총리로 임명하는 퇴위 문서에 서명했다. 그는 뒤에 「나는 사임하지도 살러시를 총리로 임명하지도 않았다. 내 서명을 아들의 목숨과 맞바꾸었을 뿐이다」라고 썼다. 호르티는 독일 바일하임 근처의 성에 갇혔고 아들은 종전 때까지 수용소에 있었다.',
                en: 'The general staff never passed the armistice order to the troops, and at 3 p.m. the chief of staff, János Vörös, issued a “clarification” that the regent had merely announced armistice talks and that the fighting must go on. With German help the Arrow Cross seized the radio station and broadcast a proclamation in which Szálasi, calling himself “leader of the nation”, ordered the armed nation to fight on, while German tanks occupied the bridges, the post office and other strategic points in the capital. Skorzeny advanced on Castle Hill behind four Tiger II tanks; only some 300 guards were left with Horthy. Early on the 16th, when Veesenmayer and Lakatos promised his son’s life and gave him twelve minutes to surrender, Horthy signed a document revoking the armistice proclamation, abdicating and appointing Szálasi prime minister. “I neither resigned nor appointed Szálasi Premier,” he later wrote, “I merely exchanged my signature for my son’s life.” Horthy was held in a castle near Weilheim in Germany, and his son remained in a concentration camp until the end of the war.',
                sources: [S.lakatos, S.huBreakout, S.panzerfaust],
            },
            {
                ko: '섭정의 뜻을 따른 장교는 드물었다. 8월부터 제1군 사령관이던 미클로시 벨러 상급대장은 추축국 이탈을 지지했는데, 10월 16일 독일군 사령부로 출두하라는 명령을 받자 체포를 의심해 부관과 부사관 둘을 데리고 전선을 넘어 소련군에 투항했다. 17일 아침 소련군 사령부가 있던 레스코에서 그는 라디오로 제1군 지휘관들에게 부대를 이끌고 넘어오라고 호소했지만, 이에 응한 사람은 연대장 한 명뿐이었고 그마저 독일군에 체포되어 처형되었다. 호르티를 도우려던 제2군 사령관 달노키 베레시 러요시는 독일군에 체포되었다. 소련 측과의 대항 정부 협상도 결실이 없었다. 미클로시는 12월 21일 데브레첸에서 열린 임시국민의회에서 임시정부의 총리로 뽑혔다.',
                en: 'Few officers rallied to the regent. Colonel General Béla Miklós, commander of the First Army since August, supported leaving the Axis; ordered on 16 October to report to German headquarters and suspecting arrest, he crossed the front with an aide and two sergeants and went over to the Soviets. On the morning of the 17th, at the Soviet headquarters in Lesko, he appealed by radio to the commanders of the First Army to bring their units over, but only one regimental commander did so, and he was arrested and executed by the Germans. General Lajos Dálnoki Veress of the Second Army, who tried to come to Horthy’s aid, was arrested by the Germans. Talks with the Soviets on a Hungarian counter-government came to nothing; on 21 December the Provisional National Assembly at Debrecen elected Miklós head of a provisional government.',
                sources: [S.miklos, S.huBreakout, S.lakatos],
            },
            {
                ko: '10월 16일 살러시의 「국민단결정부」가 들어섰다. 의회는 3인 섭정회의를 세웠고, 살러시는 11월 초 왕궁에서 성 이슈트반 왕관 앞에 「민족 지도자」로 선서해 국가원수와 정부 수반을 겸했다. 하원 의원 370명 가운데 55명만 선서식에 나왔지만, 공무원과 장교단 대부분은 새 체제를 받아들였다. 장관 16명 가운데 절반이 화살십자당원이었다. 살러시는 독일에 내는 월 분담금을 2억 펭괴에서 3억 펭괴로 올렸고, 전 총리 칼러이를 독일에 넘겨 수용소에 가두게 했다. 정권은 계엄령과 군사재판으로 「위험 분자」를 처형했고, 가축과 기계, 원자재를 독일로 실어 보냈으며, 젊은이와 노인까지 징집해 붉은군대와의 가망 없는 싸움에 내보냈다. 페젠마이어조차 뒤에 살러시를 「으스대다가 굽실거리는 어릿광대」라고 평했다.',
                en: 'Szálasi’s “Government of National Unity” was formed on 16 October. Parliament set up a three-man Council of Regency, and in early November Szálasi took his oath before the Holy Crown of Saint Stephen at the Royal Castle as “Leader of the Nation”, combining the offices of head of state and head of government. Only 55 of the 370 members of the lower house attended, but most civil servants and officers accepted the new regime. Half of his sixteen ministers were Arrow Cross members. Szálasi raised the monthly payment to the Reich from 200 to 300 million pengő and handed the former prime minister Kállay over to the Germans, who put him in a concentration camp. The regime used martial law and courts martial to execute those it deemed dangerous, shipped cattle, machinery and raw materials to Germany, and conscripted young and old for hopeless battles against the Red Army. Even Veesenmayer later called Szálasi “a buffoon who alternatively swaggered and grovelled”.',
                sources: [S.szalasi, S.arrow],
            },
        ],
    },
    {
        heading: { ko: '화살십자당 테러와 구조 활동 (1944년 10월–1945년 1월)', en: 'Arrow Cross terror and rescue (October 1944 – January 1945)' },
        paragraphs: [
            {
                ko: '10월 20일 화살십자당 민병대가 강제노동을 위해 유대인을 잡아들이기 시작했고, 이튿날 정부는 유대인 남녀에게 강제노동 의무를 부과했다. 수만 명이 붙잡혀 처음에는 수도 주변에서 대전차호를 팠다. 11월 6일부터는 이들을 약 160km 서쪽 오스트리아 국경의 헤제시헐롬까지 걸어서 보냈는데, 많은 사람이 도중에 죽거나 총에 맞았다. 살아서 도착한 사람들은 「대여」라는 명목으로 독일에 넘겨졌다. 11~12월에 수만 명의 헝가리 유대인이 독일에 넘겨져 방어 진지를 파다가 수천 명이 죽었고, 많은 사람이 1945년 봄의 죽음의 행진에서 또 목숨을 잃었다. 영어 위키백과의 화살십자당 문서는 화살십자당 집권기에 8만 명이 헝가리에서 오스트리아의 수용소로 이송되었다고 적는다.',
                en: 'On 20 October Arrow Cross militias began rounding up Jews for forced labour, and the next day the government made forced labour compulsory for Jewish men and women. Tens of thousands were seized and at first made to dig anti-tank ditches around the capital. From 6 November they were sent on foot some 160 kilometres west to Hegyeshalom on the Austrian border; many died or were shot on the way. Those who survived the march were handed over to the Germans, supposedly “on loan”. Tens of thousands of Hungarian Jews were handed over in November and December to dig defences, thousands of them died, and many more perished on the death marches of spring 1945. The English Wikipedia article on the Arrow Cross puts at 80,000 the number deported from Hungary to camps in Austria during its rule.',
                sources: [S.ushmm, S.holo, S.arrow],
            },
            {
                ko: '1944년 가을 부다페스트의 화살십자당원은 4,000명을 넘지 않았지만, 이들은 100만 명의 도시를 공포에 몰아넣었다. 이들은 거리에서 유대인을 잡아 도나우강 강변으로 끌고 가 신발을 벗기고 쏘아 시신이 강물에 떨어지게 했으며, 총알을 아끼려고 세 사람을 철사로 묶어 가운데 사람만 쏘기도 했다. 독일군 지휘관 카를 페퍼빌덴브루흐는 부하들에게 학살에 가담하지 말라고 명령했지만, 페젠마이어는 화살십자당을 최대한 도우라는 지시를 받았다. 살러시는 중립국 외교관들의 눈을 의식해 살해를 더 조용히 하라고 했을 뿐이다. 희생자 수는 엇갈린다. 영어 위키백과는 1944년 11월~1945년 2월 도나우강 강변에서 1만~1만 5,000명이 총살되었다고 적고, 역사가 웅가리 크리스티안은 포위전 중 화살십자당의 대량 처형 희생자를 1만 5,000명으로 추산했으며, 화살십자당의 살해를 많게는 3만 8,000명까지 보는 추계도 있다. 2005년 강변에 세워진 「도나우 강변의 신발」이 이들을 기린다.',
                en: 'In autumn 1944 there were no more than 4,000 Arrow Cross members in Budapest, yet they terrorised a city of a million. They seized Jews in the streets, marched them to the Danube, made them take off their shoes and shot them so that the bodies fell into the river; to save ammunition they sometimes wired three people together and shot only the one in the middle. The German commander Karl Pfeffer-Wildenbruch ordered his troops not to take part in the killings, but Veesenmayer was instructed to give the Arrow Cross as much help as he could. Szálasi, mindful of neutral diplomats, merely ordered that the killings be carried out more discreetly. Estimates of the victims differ: English Wikipedia states that 10,000–15,000 Jews were shot on the banks of the Danube between November 1944 and February 1945; the historian Krisztián Ungváry puts the victims of Arrow Cross mass executions during the siege at 15,000; and some estimates of Arrow Cross killings run as high as 38,000. The Shoes on the Danube Bank, set up on the embankment in 2005, commemorate them.',
                sources: [S.arrow, S.holo, S.siege, S.shoes],
            },
            {
                ko: '화살십자당 정권은 부다페스트에 게토 두 곳을 만들었다. 중립국 보호장을 가진 유대인은 우이리포트바로시의 「국제 게토」에 모였는데, 스위스가 7,800장, 스웨덴이 4,500장, 바티칸·포르투갈·스페인이 합쳐 3,300장의 보호장을 낼 수 있었다. 공식 거주자는 1만 5,600명이었지만 위조 서류를 가진 사람 등 수천 명이 더 몸을 숨겼다. 11월 29일의 정부 법령으로 도하니 거리 회당이 있는 옛 유대인 구역에 울타리를 친 큰 게토가 만들어졌고, 12월에 봉쇄된 이곳에 약 7만 명이 갇혔다. 음식 반입이 막히고 시신이 거리에 쌓였으며 장티푸스가 돌았다. 약 3,000명이 그 안에서 죽었고, 두 게토 모두 화살십자당원의 습격과 처형에 시달렸다. 살러시는 12월 국제적십자의 원조 제안을 게토에도 구호품이 간다는 이유로 거절했다.',
                en: 'The Arrow Cross regime created two ghettos in Budapest. Jews holding protective papers of neutral powers were gathered in the “international ghetto” in Újlipótváros; Switzerland was allowed to issue 7,800 protective passes, Sweden 4,500, and the Vatican, Portugal and Spain 3,300 between them. Officially 15,600 people lived there, but thousands more, some with forged papers, sought safety in it. A government decree of 29 November created the large fenced ghetto in the old Jewish quarter around the Dohány Street Synagogue; sealed in December, it held about 70,000 people. No food was allowed in, the dead piled up in the streets and typhoid spread; some 3,000 people died there, and both ghettos suffered Arrow Cross raids and executions. In December Szálasi refused an offer of help from the International Red Cross because the aid would also reach the ghetto.',
                sources: [S.holo, S.ushmm, S.ghetto, S.szalasi],
            },
            {
                ko: '중립국 외교관들은 보호 문서와 은신처로 사람을 구했다. 미국 전쟁난민위원회가 추천한 스웨덴 외교관 라울 발렌베리는 7월 9일 부다페스트에 와서, 소지자를 귀국을 기다리는 스웨덴 국민으로 보는 「보호 여권」을 발급하고 건물 32채를 빌려 스웨덴 치외법권 시설로 선포해 약 1만 명을 보호했다. 그가 구한 사람이 10만 명이라는 주장도 있지만 역사가들은 과장으로 보며, 야드 바솀은 그가 보호 문서를 준 사람을 약 4,500명으로 추산한다. 스위스 부영사 카를 루츠는 8,000명분의 이민 허가를 가족 단위로 해석해 수만 장의 보호 편지를 내주었고, 76채의 「안전 가옥」을 스위스 공사관 부속 시설로 선포했다. 그 가운데 「유리 집」에만 약 3,000명이 피신했고, 페젠마이어는 11월 루츠를 암살하게 해 달라고 베를린에 요청했다. 스페인 총영사를 사칭한 이탈리아인 사업가 조르조 페를라스카는 5,218명을 구했다. 1945년 1월 큰 게토를 없애려던 계획이 저지된 공을 두고는 발렌베리 쪽 증언과 페를라스카의 증언이 엇갈린다.',
                en: 'Neutral diplomats saved people with protective documents and safe houses. The Swedish diplomat Raoul Wallenberg, recruited by the American War Refugee Board, arrived in Budapest on 9 July; he issued “protective passports” identifying the bearers as Swedish subjects awaiting repatriation, and rented 32 buildings that he declared extraterritorial, eventually housing almost 10,000 people. Claims that he saved 100,000 Jews are regarded by historians as an exaggeration; Yad Vashem estimates the number granted his protective paperwork at about 4,500. The Swiss vice-consul Carl Lutz treated a permit for 8,000 emigrants as applying to families and issued tens of thousands of protective letters, and declared 76 “safe houses” annexes of the Swiss legation; some 3,000 people found refuge in the Glass House alone, and in November Veesenmayer asked Berlin for permission to assassinate him. Giorgio Perlasca, an Italian businessman posing as the Spanish consul-general, saved 5,218 Jews. Accounts differ over who stopped a plan to destroy the large ghetto in January 1945: testimony crediting Wallenberg conflicts with Perlasca’s.',
                sources: [S.wallenberg, S.ushmm, S.lutz, S.perlasca, S.ghetto],
            },
        ],
    },
    {
        heading: { ko: '저항과 부다페스트 포위 (1944년 10월–1945년 2월)', en: 'Resistance and the siege of Budapest (October 1944 – February 1945)' },
        paragraphs: [
            {
                ko: '루마니아의 전향 뒤 로디온 말리놉스키의 제2우크라이나 전선군과 표도르 톨부힌의 제3우크라이나 전선군이 헝가리로 밀고 들어왔다. 10월 6~29일의 데브레첸 작전에서 양측은 「전쟁에서 가장 격렬한 전차전 가운데 하나」를 벌였고, 데브레첸은 10월 19~20일 소련 제27군과 함께 공격한 루마니아 사단들에 점령되었다. 10월 28일 스탈린은 말리놉스키에게 닷새 안에 부다페스트를 점령하라고 직접 명령했고, 29일 시작된 공세는 11월 7일 도심에서 약 20km 떨어진 동쪽 교외에 이르렀지만 도시를 빼앗지는 못했다. 12월에 베오그라드를 해방한 톨부힌의 군대가 도나우강 서쪽에서 올라오면서 남북 양쪽에서 수도를 에워싸는 공격이 가능해졌다. 그사이 12월 21일 데브레첸에서 임시국민의회가 열려 새 정부를 세웠다.',
                en: 'After Romania’s switch, Rodion Malinovsky’s 2nd Ukrainian Front and Fyodor Tolbukhin’s 3rd Ukrainian Front pushed into Hungary. In the Debrecen operation of 6–29 October the two sides fought “one of the wildest tank battles of the war”, and Debrecen was taken on 19–20 October by Romanian divisions attacking alongside the Soviet 27th Army. On 28 October Stalin personally ordered Malinovsky to take Budapest within five days; the offensive launched on the 29th reached the eastern suburbs, some 20 kilometres from the centre, on 7 November, but could not take the city. In December Tolbukhin’s front, fresh from the liberation of Belgrade, advanced west of the Danube, making a two-pronged attack around the capital possible. Meanwhile, on 21 December, a Provisional National Assembly met in Debrecen and formed a new government.',
                sources: [S.debrecen, S.siege, S.bpOffensive, S.miklos],
            },
            {
                ko: '10월 11일 러커토시 정부의 요구로 풀려난 버이치질린스키는 11월 9일 부다페스트의 한 공장에서 다른 정당 지도자들과 「헝가리 민족봉기 해방위원회」를 결성하고 의장이 되었다. 위원회는 소련군과 협력해 독일군을 몰아내고 화살십자당 지배를 무너뜨리는 것을 목표로 내걸고 10일 성명을 냈으며, 퇴역 중장 키시 야노시가 군사 참모부를 이끌었다. 버이치질린스키는 공산당의 러이크 라슬로와 만나 소련의 도움을 구했고, 공산당이 유격전을 맡고 키시는 붉은군대가 다가오면 봉기할 무장 부대를 준비하기로 했다. 그러나 밀고로 11월 22일 회합 장소가 습격되어 지도부가 체포되었고, 버이치질린스키도 그날 밤 붙잡혔다. 화살십자당 정권의 특별재판소는 12월 6일 그와 장교 세 명에게 사형을 선고했고, 장교들은 12월 8일, 버이치질린스키는 12월 24일 쇼프론쾨히더 감옥에서 처형되었다.',
                en: 'Released on 11 October at the demand of the Lakatos government, Bajcsy-Zsilinszky met leaders of other parties at a Budapest factory on 9 November and founded the Liberation Committee of the Hungarian National Uprising, with himself as president. The committee, which aimed to drive out the Germans in co-operation with the Soviet army and overthrow Arrow Cross rule, issued a proclamation on the 10th, and the retired lieutenant general János Kiss headed its military staff. Bajcsy-Zsilinszky met the Communist László Rajk to seek Soviet help; it was agreed that the Communists would wage guerrilla war while Kiss prepared an armed force to rise when the Red Army drew near. But on 22 November, after a betrayal, a meeting was raided and the leaders arrested, and Bajcsy-Zsilinszky was seized that evening. A special court of the Arrow Cross regime sentenced him and three officers to death on 6 December; the officers were executed on 8 December, and Bajcsy-Zsilinszky on 24 December at Sopronkőhida prison.',
                sources: [S.bajcsy, S.mnffb],
            },
            {
                ko: '12월 26일 소련군이 빈으로 가는 도로를 끊으면서 포위가 완성되었다. 살러시는 이미 12월 초 수도를 떠났다. 히틀러는 철수를 허락하지 않고 부다페스트를 끝까지 지킬 「요새」로 선포했으며, 무장친위대 제9산악군단장 카를 페퍼빌덴브루흐가 방어를 지휘했다. 포위망 안에는 독일군 약 3만 3,000명과 헝가리군 약 3만 7,000명(다른 집계는 약 7만 9,000명)과 함께 80만 명이 넘는 민간인이 갇혔다. 12월 29일 항복을 권하러 온 소련 군사 사절 두 명이 숨졌는데, 경위는 지금도 분명하지 않다. 독일군의 세 차례 구원 작전은 수도에서 20~25km 앞에서 멈추었다. 1월 17일 히틀러가 페스트 철수를 허락했고, 철수는 18일 아침에 끝났으며 독일군은 사슬다리를 비롯한 다리들을 폭파했다. 소련군은 국제 게토를 1월 16일, 큰 게토를 17~18일 해방했고, 부다페스트에서 약 11만 9,000명의 유대인이 살아남았다.',
                en: 'The encirclement was completed on 26 December, when Soviet troops cut the road to Vienna; Szálasi had already left the capital in early December. Hitler refused a withdrawal and declared Budapest a fortress to be defended to the last man, with Karl Pfeffer-Wildenbruch, commander of the IX SS Mountain Corps, in charge of its defence. Some 33,000 German and 37,000 Hungarian soldiers (about 79,000 by another count) were trapped, along with more than 800,000 civilians. On 29 December two Soviet envoys sent to call for surrender were killed in circumstances that remain unclear. Three German relief operations stalled 20–25 kilometres from the city. On 17 January Hitler allowed the evacuation of Pest, completed by the next morning, and the Germans blew up the bridges, including the Chain Bridge. Soviet troops liberated the international ghetto on 16 January and the large ghetto on 17–18 January; some 119,000 Jews survived in Budapest.',
                sources: [S.siege, S.huSiege, S.bpOffensive, S.ushmm, S.holo],
            },
            {
                ko: '1월 17일 발렌베리는 간첩 혐의로 소련 방첩기관 스메르시에 붙잡혀 사라졌다. 소련은 1957년 그가 1947년 모스크바 루뱐카 감옥에서 심장마비로 죽었다고 밝혔지만, 사인과 날짜는 지금까지 다투어진다. 부다의 겔레르트 언덕이 2월 11일 함락되자, 페퍼빌덴브루흐는 히틀러의 금지를 어기고 그날 밤 독일·헝가리 병사 약 2만 8,000명과 민간인들을 이끌고 탈출을 시도했다. 소련군의 포격으로 수천 명이 죽었고, 5,000~1만 명이 부다페스트 북서쪽 숲에 이르렀지만 독일군 전선까지 닿은 병사는 600~700명뿐이었다. 페퍼빌덴브루흐는 붙잡혔고, 남은 수비대는 2월 13일 항복했다. 108일의 싸움에서 소련군의 사상자는 32만 82명이었고, 웅가리는 포위 중 민간인 약 3만 8,000명이 죽었다고 추산한다. 건물의 80% 이상이 부서지거나 손상되었고 도나우강의 다리는 모두 무너졌다.',
                en: 'On 17 January Wallenberg was detained by the Soviet counter-intelligence agency SMERSH on suspicion of espionage and disappeared; in 1957 the Soviet authorities said he had died of a heart attack in Moscow’s Lubyanka prison in 1947, but the cause and date of his death are still disputed. When Gellért Hill in Buda fell on 11 February, Pfeffer-Wildenbruch defied Hitler’s ban and that night led a breakout of some 28,000 German and Hungarian troops, with civilians among them. Soviet artillery killed thousands; between 5,000 and 10,000 people reached the wooded hills north-west of Budapest, but only 600–700 soldiers got through to the German lines. Pfeffer-Wildenbruch was captured, and the rest of the garrison surrendered on 13 February. In 108 days of fighting the Soviet forces suffered 320,082 casualties, and Ungváry estimates that some 38,000 civilians died during the siege. More than 80 per cent of the buildings were destroyed or damaged, and every bridge over the Danube was down.',
                sources: [S.wallenberg, S.siege, S.koSiege, S.pfeffer],
            },
        ],
    },
];

const event = buildEvent({
    id: 'hungary-1944-1945',
    title: { ko: '독일 점령하의 헝가리: 마르가레테 작전에서 부다페스트 포위까지', en: 'Hungary under German occupation: from Operation Margarethe to the siege of Budapest' },
    period: '1944.03–1945.02',
    sortOrder: 108,
    question: {
        ko: '독일에 점령된 헝가리에서 어떻게 한 해 사이에 수십만 명의 유대인이 학살되었고, 전쟁에서 빠져나가려던 호르티의 시도는 왜 화살십자당 집권과 수도의 파괴로 끝났는가?',
        en: 'How were hundreds of thousands of Jews murdered within a single year in German-occupied Hungary, and why did Horthy’s attempt to leave the war end with the Arrow Cross in power and the capital in ruins?',
    },
    summary: {
        ko: '1944년 3월 19일 독일군은 연합국과 휴전을 꾀하던 헝가리를 점령했다. 섭정 호르티는 자리를 지켰고 스토여이 되메 정부의 내무부와 헌병대가 아이히만 특별작전대와 함께 5~7월 약 43만 7,000명의 유대인을 아우슈비츠로 이송했다. 국제적 항의 속에 호르티는 7월 초 이송을 멈추고 8월 러커토시 정부를 세워 소련과 예비 휴전에 서명했지만, 10월 15일의 휴전 선언은 독일의 판처파우스트 작전과 살러시 페렌츠의 화살십자당 쿠데타로 무너졌다. 화살십자당은 부다페스트 유대인을 도나우강 강변에서 학살하고 국경으로 걸어서 보냈고, 중립국 외교관들은 보호 문서로 사람을 구했다. 1944년 12월 26일 포위된 부다페스트는 1945년 2월 13일 소련군에 함락되었다.',
        en: 'On 19 March 1944 German troops occupied Hungary, which had been seeking an armistice with the Allies. Regent Horthy stayed in office, and the Interior Ministry and gendarmerie of Döme Sztójay’s government, together with Eichmann’s commando, deported some 437,000 Jews to Auschwitz between May and July. Amid international protest Horthy halted the deportations in early July and in August installed the Lakatos government, which signed a preliminary armistice with the Soviet Union; but his armistice proclamation of 15 October collapsed under Germany’s Operation Panzerfaust and the Arrow Cross coup of Ferenc Szálasi. The Arrow Cross shot Budapest’s Jews on the banks of the Danube and sent them on foot to the border, while neutral diplomats saved people with protective papers. Encircled on 26 December 1944, Budapest fell to the Soviet army on 13 February 1945.',
    },
    outcome: {
        ko: '미국 홀로코스트 기념관은 헝가리 통치하에 있던 약 82만 5,000명의 유대인 가운데 약 55만 명이 홀로코스트로 죽었다고 보며(역사가 랜돌프 브레이엄은 56만 4,000여 명으로 추산), 그 대부분인 약 50만 명이 독일 점령 뒤 한 해 사이에 살해되었다. 부다페스트는 폐허가 되었고, 데브레첸의 임시정부와 소련군 점령 아래 전후 헝가리가 시작되었다.',
        en: 'The US Holocaust Memorial Museum estimates that some 550,000 of the roughly 825,000 Jews under Hungarian rule were killed in the Holocaust (the historian Randolph Braham estimated just over 564,000), about 500,000 of them in the single year after the German occupation. Budapest lay in ruins, and postwar Hungary began under the provisional government of Debrecen and Soviet occupation.',
    },
    sections,
    timeline: [
        ['1944.03.18', '클레스하임 회담', 'Klessheim meeting', '호르티가 독일군 진주를 받아들이는 의정서에 서명했다.', 'Horthy signed the protocol accepting German occupation.', ['hungary', 'germany'], P(47.8226, 12.9956, '클레스하임 성', 'Schloss Klessheim')],
        ['1944.03.19', '마르가레테 작전', 'Operation Margarethe', '독일군이 거의 저항 없이 헝가리를 점령했다.', 'German troops occupied Hungary almost unopposed.', ['germany', 'hungary']],
        ['1944.03.23', '스토여이 정부', 'Sztójay government', '베를린 주재 대사 스토여이가 총리가 되었고 여로시·엔드레·버키가 내무부를 맡았다.', 'The minister in Berlin became prime minister; Jaross, Endre and Baky took the Interior Ministry.', 'hungary'],
        ['1944.04.05', '노란 별', 'The yellow star', '6세 이상의 유대인에게 노란 다윗의 별 착용이 의무화되었다.', 'Jews aged six and over had to wear the yellow Star of David.', 'hungary'],
        ['1944.05.15', '대량 이송 시작', 'Mass deportations begin', '7월 9일까지 약 43만 7,000명이 열차 147편으로 이송되었다.', 'Some 437,000 Jews were deported on 147 trains by 9 July.', ['hungary', 'germany', 'poland'], P(50.0343, 19.1784, '아우슈비츠-비르케나우', 'Auschwitz-Birkenau')],
        ['1944.06.25', '국제적 호소', 'International appeals', '교황 비오 12세, 루스벨트(26일), 구스타프 5세(30일)가 이송 중단을 호소했다.', 'Pius XII, Roosevelt (26th) and Gustaf V (30th) appealed for a halt.', ['hungary', 'usa', 'sweden']],
        ['1944.06.30', '커스트네르 열차 출발', 'The Kasztner train leaves', '몸값을 치른 유대인 1,600여 명이 부다페스트를 떠나 뒤에 스위스에 닿았다.', 'Over 1,600 ransomed Jews left Budapest, later reaching Switzerland.', ['hungary', 'germany', 'switzerland']],
        ['1944.07.06', '이송 중단 명령', 'Deportations halted', '호르티가 이송 중단을 명령했고 이송은 9일 멈추었다.', 'Horthy ordered a halt; the transports stopped on the 9th.', 'hungary'],
        ['1944.07.09', '발렌베리 도착', 'Wallenberg arrives', '스웨덴 공사관에 부임해 보호 여권을 발급하기 시작했다.', 'He joined the Swedish legation and began issuing protective passports.', ['hungary', 'sweden']],
        ['1944.08.23', '루마니아의 전향', 'Romania changes sides', '루마니아가 연합국과 휴전하고 독일과 헝가리에 선전포고했다.', 'Romania made an armistice and declared war on Germany and Hungary.', ['romania', 'soviet', 'germany', 'hungary']],
        ['1944.08.29', '러커토시 정부', 'Lakatos government', '호르티가 스토여이를 해임하고 휴전을 준비할 러커토시를 앉혔다.', 'Horthy dismissed Sztójay and installed Lakatos to prepare an armistice.', 'hungary'],
        ['1944.10.06', '데브레첸 작전', 'Debrecen operation', '29일까지 이어진 전차전 끝에 데브레첸이 소련·루마니아군에 넘어갔다.', 'After tank battles lasting until the 29th, Debrecen fell to Soviet and Romanian forces.', ['soviet', 'romania', 'hungary', 'germany'], P(47.5316, 21.6273, '데브레첸', 'Debrecen')],
        ['1944.10.11', '모스크바 예비 휴전', 'Preliminary armistice in Moscow', '퍼러고와 몰로토프가 서명했다.', 'Faragho and Molotov signed it.', ['hungary', 'soviet'], P(55.7558, 37.6173, '모스크바', 'Moscow')],
        ['1944.10.15', '휴전 선언과 판처파우스트 작전', 'Armistice proclamation and Operation Panzerfaust', '호르티의 아들이 납치되고 화살십자당이 방송국을 장악했다.', 'Horthy’s son was kidnapped and the Arrow Cross seized the radio.', ['hungary', 'germany'], P(47.4962, 19.0396, '부다 왕궁', 'Buda Castle')],
        ['1944.10.16', '살러시 정부', 'Szálasi government', '호르티가 강압 속에 퇴위하고 살러시를 총리로 임명하는 문서에 서명했다.', 'Under duress Horthy signed his abdication and Szálasi’s appointment.', ['hungary', 'germany']],
        ['1944.10.17', '미클로시 벨러의 호소', 'Béla Miklós’s appeal', '소련군에 넘어간 제1군 사령관이 부대의 투항을 호소했다.', 'The First Army commander, now with the Soviets, appealed to his units to defect.', ['hungary', 'soviet'], P(49.4703, 22.3300, '레스코', 'Lesko')],
        ['1944.11.06', '헤제시헐롬 도보 이송', 'Foot marches to Hegyeshalom', '부다페스트 유대인이 오스트리아 국경까지 걸어서 끌려가 독일에 넘겨졌다.', 'Budapest Jews were marched to the Austrian border and handed to the Germans.', ['hungary', 'germany', 'austria'], P(47.9139, 17.1567, '헤제시헐롬', 'Hegyeshalom')],
        ['1944.11.09', '민족봉기 해방위원회', 'Liberation Committee founded', '버이치질린스키를 의장으로 지하 저항 조직이 결성되었다.', 'An underground resistance body was founded under Bajcsy-Zsilinszky.', 'hungary'],
        ['1944.11.29', '부다페스트 게토', 'Budapest Ghetto', '법령으로 옛 유대인 구역에 큰 게토가 만들어졌다.', 'A decree created the large ghetto in the old Jewish quarter.', 'hungary'],
        ['1944.12.24', '버이치질린스키 처형', 'Bajcsy-Zsilinszky executed', '해방위원회 의장이 화살십자당 재판 끝에 처형되었다.', 'The committee’s president was executed after an Arrow Cross trial.', 'hungary', P(47.7113, 16.6207, '쇼프론쾨히더', 'Sopronkőhida')],
        ['1944.12.26', '부다페스트 포위', 'Budapest encircled', '빈으로 가는 도로가 끊겨 포위가 완성되었다.', 'The road to Vienna was cut, completing the encirclement.', ['soviet', 'romania', 'hungary', 'germany']],
        ['1945.01.18', '페스트 함락', 'Pest falls', '수비대가 부다로 물러나며 다리를 폭파했고 게토들이 해방되었다.', 'The defenders withdrew to Buda, blowing the bridges; the ghettos were liberated.', ['soviet', 'hungary', 'germany']],
        ['1945.02.13', '부다 함락', 'Buda falls', '11일 밤의 탈출 시도가 실패한 뒤 남은 수비대가 항복했다.', 'The rest of the garrison surrendered after the failed breakout of the 11th.', ['soviet', 'hungary', 'germany']],
    ],
    locations: [
        ['부다페스트', 'Budapest', 47.4979, 19.0402, 'main'],
        ['클레스하임 성', 'Schloss Klessheim', 47.8226, 12.9956, 'place'],
        ['아우슈비츠-비르케나우', 'Auschwitz-Birkenau', 50.0343, 19.1784, 'place'],
        ['데브레첸', 'Debrecen', 47.5316, 21.6273, 'place'],
        ['모스크바', 'Moscow', 55.7558, 37.6173, 'place'],
        ['헤제시헐롬', 'Hegyeshalom', 47.9139, 17.1567, 'place'],
        ['쇼프론쾨히더', 'Sopronkőhida', 47.7113, 16.6207, 'place'],
    ],
    countries: ['hungary', 'germany', 'soviet', 'romania', 'austria', 'poland', 'sweden', 'switzerland', 'usa', 'uk'],
    relations: { related: ['hungary-axis-1938-1944', 'great-patriotic-war', 'hungary-1945-1949', 'romania-1944-1948'] },
    // 임시정부 is the Russian Provisional Government term almost everywhere else.
    noAutoLink: ['임시정부'],
    focus: { ko: '독일 점령기의 헝가리', en: 'Hungary under German occupation' },
    people: [
        ['miklos-horthy', 'leader', '섭정', 'Regent', '점령 뒤에도 섭정 자리를 지켰고, 7월 초 유대인 이송을 멈추었으며, 10월 15일 휴전을 선언했다가 아들이 납치되자 살러시에게 권력을 넘기는 문서에 서명했다.', 'Stayed on as regent after the occupation, halted the deportations in early July and proclaimed an armistice on 15 October, then signed power over to Szálasi after his son was kidnapped.'],
        ['dome-sztojay', 'leader', '총리(1944.3–8)', 'Prime minister, March–August 1944', '독일의 요구로 총리가 되어 화살십자당을 합법화하고 유대인 이송에 협력했으며, 세레디의 사목 서한 발표를 막았다.', 'Became prime minister at German insistence, legalised the Arrow Cross, co-operated in the deportations and talked Serédi out of issuing his pastoral letter.'],
        ['geza-lakatos', 'leader', '총리(1944.8–10)', 'Prime minister, August–October 1944', '이송 재개를 막고 소련과의 휴전을 준비했으나, 10월 16일 호르티에게 항복과 퇴위를 받아들이게 했다.', 'Blocked any resumption of the deportations and prepared the armistice with the Soviets, but on 16 October brought Horthy to surrender and abdicate.'],
        ['ferenc-szalasi', 'leader', '화살십자당 지도자, 「민족 지도자」', 'Arrow Cross leader, “Leader of the Nation”', '판처파우스트 작전 뒤 「국민단결정부」를 세워 유대인 강제노동과 도보 이송을 재개했고, 12월 초 수도를 떠났다.', 'Formed the “Government of National Unity” after Operation Panzerfaust, resumed forced labour and foot deportations of Jews, and left the capital in early December.'],
        ['edmund-veesenmayer', 'executor', '헝가리 주재 제국 전권대표', 'Reich plenipotentiary in Hungary', '헝가리 정부에 유대인 이송을 압박하고 이송 인원을 베를린에 보고했으며, 10월 호르티를 구금하고 살러시의 집권을 도왔다.', 'Pressed the Hungarian government to deport its Jews and reported the numbers to Berlin; in October took Horthy into custody and helped bring Szálasi to power.'],
        ['adolf-eichmann', 'executor', '친위대 특별작전대 지휘관', 'Head of the SS special commando', '부다페스트에 본부를 두고 유대인 평의회를 세우게 했으며 헝가리 관리들과 함께 지방 유대인의 아우슈비츠 이송을 조직했다.', 'Set up his staff in Budapest, had a Jewish Council formed and organised the deportation of provincial Jews to Auschwitz with Hungarian officials.'],
        ['andor-jaross', 'executor', '내무장관(1944.3–8)', 'Interior minister, March–August 1944', '국가경찰과 헌병대를 관장하며 차관 엔드레·버키와 함께 이송을 지휘했다.', 'Controlled the State Police and the gendarmerie and directed the deportations with his state secretaries Endre and Baky.'],
        ['laszlo-endre', 'executor', '내무부 차관', 'State secretary, Interior Ministry', '게토화와 이송의 전권을 받아 아이히만을 도왔고, 호르티가 6월 초 해임을 요구했다.', 'Given sweeping powers over ghettoisation and deportation, he assisted Eichmann; Horthy demanded his removal in early June.'],
        ['laszlo-baky', 'executor', '내무부 차관', 'State secretary, Interior Ministry', '4월 4일 게토화와 이송 방침을 정한 회의를 주재했고, 7월 초 헌병대를 수도에 들여 부다페스트 유대인을 이송하려다 저지되었다.', 'Chaired the meeting of 4 April that set the plan for ghettos and deportation, and in early July tried to bring gendarmes into the capital to deport Budapest’s Jews.'],
        ['adolf-hitler', 'participant', '독일 총통', 'German Führer', '헝가리 점령을 명령하고 클레스하임에서 호르티의 동의를 받아 냈으며, 부다페스트를 끝까지 지킬 「요새」로 선포했다.', 'Ordered the occupation, extracted Horthy’s consent at Klessheim and declared Budapest a fortress to be held to the last man.'],
        ['heinrich-himmler', 'participant', '친위대 전국지도자', 'Reichsführer-SS', '회스에 따르면 헝가리 유대인의 이송을 더 서두르기를 바랐다.', 'According to Höss, wanted the deportation of Hungary’s Jews speeded up.'],
        ['joachim-von-ribbentrop', 'participant', '독일 외무장관', 'German foreign minister', '클레스하임에서 호르티를 히틀러에게 다시 불러들였고, 페젠마이어에게서 이송 인원 보고를 받았다.', 'Called Horthy back to Hitler at Klessheim and received Veesenmayer’s reports on the numbers deported.'],
        ['maximilian-von-weichs', 'executor', '독일군 원수', 'German field marshal', '마르가레테 작전을 지휘하고 점령이 계획대로 진행된다고 보고했다.', 'Directed Operation Margarethe and reported that the occupation was going according to plan.'],
        ['otto-skorzeny', 'executor', '친위대 특공대장', 'SS commando leader', '10월 15일 호르티의 아들을 납치하고 전차를 앞세워 왕궁 언덕으로 진격했다.', 'Kidnapped Horthy’s son on 15 October and advanced on Castle Hill with tanks.'],
        ['ferenc-szombathelyi', 'participant', '참모총장', 'Chief of the General Staff', '클레스하임에서 호르티에게 의정서 서명을 권했고 독일군에 저항하지 말라고 명령했으나, 점령 뒤 해임되었다.', 'Persuaded Horthy to sign the Klessheim protocol and ordered no resistance to the Germans, but was dismissed after the occupation.'],
        ['miklos-kallay', 'target', '전 총리', 'Former prime minister', '점령으로 물러나 튀르키예 공사관에 피신했고, 살러시 정권에 의해 독일에 넘겨졌다.', 'Ousted by the occupation, he took refuge in the Turkish legation and was handed to the Germans by Szálasi’s regime.'],
        ['ferenc-keresztes-fischer', 'target', '내무장관', 'Interior minister', '헝가리가 더는 독립국이 아니라고 말했고, 게슈타포에 체포되어 다하우로 보내졌다.', 'Declared that Hungary was no longer independent and was arrested by the Gestapo and sent to Dachau.'],
        ['istvan-bethlen', 'participant', '전 총리, 보수파 원로', 'Former prime minister, conservative elder', '호르티에게 퇴위를 권한 뒤 몸을 숨겼고, 러커토시를 총리로 추천하고 즉시 휴전을 주장했다.', 'Urged Horthy to abdicate before going into hiding, then recommended Lakatos and argued for an immediate armistice.'],
        ['bela-imredy', 'participant', '헝가리 쇄신당 지도자', 'Leader of the Party of Hungarian Renewal', '독일이 총리로 원했으나 호르티가 거부했고, 그의 당 사람들이 스토여이 내각에 들어갔다.', 'Wanted by the Germans as prime minister but rejected by Horthy; members of his party entered Sztójay’s cabinet.'],
        ['karoly-peyer', 'target', '사회민주당 지도자', 'Social Democratic leader', '가족이 인질로 잡히자 독일군에 자수했다.', 'Gave himself up to the Germans after his family was taken hostage.'],
        ['endre-bajcsy-zsilinszky', 'opponent', '헝가리 민족봉기 해방위원회 의장', 'President of the Liberation Committee of the Hungarian National Uprising', '3월 19일 체포에 총으로 맞섰고, 풀려난 뒤 해방위원회를 이끌다 12월 24일 처형되었다.', 'Resisted arrest with his pistol on 19 March; after his release he led the Liberation Committee and was executed on 24 December.'],
        ['laszlo-rajk', 'opponent', '공산당 지하 지도자', 'Underground Communist leader', '버이치질린스키와 만나 공산당이 유격전을 맡기로 합의했다.', 'Met Bajcsy-Zsilinszky and agreed that the Communists would wage guerrilla war.'],
        ['jusztinian-seredi', 'participant', '수좌대주교', 'Prince Primate', '개종 유대인의 면제를 요구하고 이송을 비판했으나, 6월 말 스토여이의 약속을 받고 사목 서한을 발표하지 않았다.', 'Sought exemptions for converts and criticised the deportations, but withheld his pastoral letter at the end of June on Sztójay’s promise.'],
        ['rezso-kasztner', 'participant', '부다페스트 유대인 구조위원회 위원', 'Member of the Budapest Aid and Rescue Committee', '아이히만·베허와 협상해 1,600여 명을 태운 열차를 스위스로 내보냈고, 전후 이스라엘에서 협력 논란에 휘말렸다.', 'Negotiated with Eichmann and Becher a train that took over 1,600 Jews to Switzerland, and after the war was accused in Israel of collaboration.'],
        ['franklin-d-roosevelt', 'participant', '미국 대통령', 'US president', '6월 26일 호르티에게 이송 중단을 요구하며 군사적 보복을 경고했다.', 'On 26 June demanded that Horthy stop the deportations and threatened military retaliation.'],
        ['winston-churchill', 'witness', '영국 총리', 'British prime minister', '헝가리 유대인 박해를 세계 역사상 가장 끔찍한 범죄라고 썼고, 10월 모스크바에서 소련의 휴전 조건을 지지했다.', 'Wrote that the persecution of Hungary’s Jews was the most horrible crime in world history, and in October in Moscow backed the Soviet armistice terms.'],
        ['anthony-eden', 'witness', '영국 외무장관', 'British foreign secretary', '10월 모스크바에서 처칠과 함께 소련의 휴전 조건을 지지했다.', 'In October in Moscow, with Churchill, backed the Soviet armistice terms.'],
        ['michael-i-of-romania', 'participant', '루마니아 국왕', 'King of Romania', '8월 23일 안토네스쿠를 해임하고 독일과 헝가리에 선전포고했다.', 'On 23 August dismissed Antonescu and declared war on Germany and Hungary.'],
        ['ion-antonescu', 'target', '루마니아 지도자', 'Romanian leader', '8월 23일 국왕에게 해임되었다.', 'Dismissed by the king on 23 August.'],
        ['molotov', 'participant', '소련 외무인민위원', 'Soviet foreign commissar', '10월 11일 퍼러고와 예비 휴전에 서명했다.', 'Signed the preliminary armistice with Faragho on 11 October.'],
        ['stalin', 'participant', '소련 지도자', 'Soviet leader', '10월 28일 말리놉스키에게 닷새 안에 부다페스트를 점령하라고 명령했다.', 'On 28 October ordered Malinovsky to take Budapest within five days.'],
        ['bela-miklos', 'opponent', '제1군 사령관', 'Commander, First Army', '10월 16일 소련군에 투항해 부대의 투항을 호소했고, 12월 데브레첸 임시정부의 총리가 되었다.', 'Went over to the Soviets on 16 October and appealed to his troops to follow; in December became head of the provisional government at Debrecen.'],
        ['malinovsky', 'opponent', '제2우크라이나 전선군 사령관', 'Commander, 2nd Ukrainian Front', '데브레첸 작전과 부다페스트 공세를 지휘했다.', 'Commanded the Debrecen operation and the Budapest offensive.'],
        ['fyodor-tolbukhin', 'opponent', '제3우크라이나 전선군 사령관', 'Commander, 3rd Ukrainian Front', '베오그라드 해방 뒤 도나우강 서쪽에서 부다페스트 포위에 가담했다.', 'After liberating Belgrade, joined the encirclement of Budapest from west of the Danube.'],
        ['karl-pfeffer-wildenbruch', 'participant', '부다페스트 방어 사령관', 'Commander of the defence of Budapest', '항복 권고를 거부하고 포위전을 지휘했으며, 2월 11일 탈출을 이끌다 소련군에 붙잡혔다.', 'Rejected calls to surrender and commanded the defence, and was captured leading the breakout of 11 February.'],
        ['raoul-wallenberg', 'participant', '스웨덴 특사', 'Swedish special envoy', '보호 여권과 스웨덴 보호 건물로 부다페스트 유대인을 구했고, 1945년 1월 17일 스메르시에 붙잡혀 사라졌다.', 'Saved Budapest Jews with protective passports and Swedish protected buildings, and disappeared after his arrest by SMERSH on 17 January 1945.'],
        ['carl-lutz', 'participant', '스위스 부영사', 'Swiss vice-consul', '보호 편지 수만 장과 76채의 안전 가옥으로 유대인을 보호했다.', 'Protected Jews with tens of thousands of protective letters and 76 safe houses.'],
    ],
});

const people = [...require('./people-1944-a'), ...require('./people-1944-b')];

const terms = [
    term({
        id: 'arrow-cross-party', ko: '화살십자당', en: 'Arrow Cross Party', category: 'factions', period: '1935–1945', startYear: 1935, endYear: 1945,
        definition: ['살러시 페렌츠가 이끈 헝가리의 극우 국수주의 정당. 1935년 민족의지당으로 출발해 1939년 화살십자당으로 재건되었고, 1944년 10월 15일부터 1945년 3월 28일까지 「국민단결정부」로 헝가리를 통치하며 유대인과 로마인 수만 명을 학살하거나 이송했다.',
            'A Hungarian far-right ultranationalist party led by Ferenc Szálasi. Founded in 1935 as the Party of National Will and reconstituted in 1939 as the Arrow Cross Party, it ruled Hungary as the “Government of National Unity” from 15 October 1944 to 28 March 1945, murdering or deporting tens of thousands of Jews and Roma.'],
        body: ['당은 1937년 금지되었다가 1939년 화살십자당으로 다시 세워졌고, 독일 나치당을 꽤 노골적으로 본떴다. 1944년 3월 독일이 헝가리를 점령한 뒤 스토여이 정부가 당을 합법화했고, 10월 15일 독일의 판처파우스트 작전으로 호르티가 물러나자 살러시가 「민족 지도자」가 되었다. 당원들은 부다페스트에서 유대인을 도나우강 강변으로 끌고 가 쏘았고, 유대인 수만 명을 강제노동과 도보 행진으로 오스트리아 국경에 보냈다.\n\n화살십자당 통치기에 살해된 민간인은 1만~1만 5,000명으로 추산되며 더 많게 보는 추계도 있다. 화살십자당 통치는 1945년 3월 28일 끝났고, 지도부는 전후 헝가리 법정에서 전범으로 재판받았다. 살러시와 측근 세 명은 1946년 3월 교수형에 처해졌다.',
            'Outlawed in 1937, the party was reconstituted in 1939 as the Arrow Cross Party and modelled fairly explicitly on the Nazi Party of Germany. After Germany occupied Hungary in March 1944 the Sztójay government legalised it, and when Germany’s Operation Panzerfaust removed Horthy on 15 October, Szálasi became “Leader of the Nation”. Its members marched Jews in Budapest to the Danube and shot them, and sent tens of thousands of Jews to forced labour and on foot to the Austrian border.\n\nEstimates of the civilians murdered under Arrow Cross rule run from 10,000 to 15,000, with some higher. Arrow Cross rule ended on 28 March 1945, and after the war its leaders were tried as war criminals by Hungarian courts; Szálasi and three of his key associates were hanged in March 1946.'],
        aliases: { ko: ['화살십자당-헝가리주의 운동'], en: ['Arrow Cross', 'Nyilaskeresztes Párt', 'Arrow Cross Party–Hungarist Movement', 'Nyilas'] },
        people: ['ferenc-szalasi', 'dome-sztojay', 'miklos-horthy', 'edmund-veesenmayer'],
        events: ['hungary-1944-1945', 'hungary-axis-1938-1944'],
        sources: [S.arrow, S.szalasi], locator: 'lead; Formation; Nazi support and killings of Jews; Arrow Cross rule; Post-war developments',
    }),
    term({
        id: 'operation-margarethe', ko: '마르가레테 작전', en: 'Operation Margarethe', category: 'international', period: '1944', startYear: 1944, endYear: 1944,
        definition: ['1944년 3월 19일 나치 독일이 동맹국 헝가리를 군사적으로 점령한 작전. 헝가리가 연합국과 휴전을 꾀하자 히틀러가 명령했고, 섭정 호르티를 자리에 둔 채 친독 스토여이 정부를 세워 헝가리 유대인의 대량 이송을 가능하게 했다.',
            'The military occupation of its ally Hungary by Nazi Germany on 19 March 1944. Ordered by Hitler when Hungary sought an armistice with the Allies, it kept Regent Horthy in office while installing the pro-German Sztójay government, opening the way to the mass deportation of Hungary’s Jews.'],
        body: ['히틀러는 1943년 9월 이탈리아가 휴전하자 헝가리 점령 계획(마르가레테 1)을 세우게 했고, 1944년 3월 호르티를 클레스하임 성으로 불러 점령에 동의하는 의정서에 서명하게 했다. 3월 19일 독일군이 국경을 넘었을 때 헝가리군은 저항하지 않았고, 점령은 빠르고 거의 피를 흘리지 않고 끝났다. 호르티는 섭정 자리에 남았지만 칼러이 총리 대신 베를린 주재 대사 스토여이 되메를 앉혀야 했다.\n\n점령과 함께 에드문트 페젠마이어가 제국 전권대표로 부임했고, 야당 정치인과 망명 군인 등 수천 명이 체포되었다. 아이히만의 특별작전대가 들어와 헝가리 내무부·헌병대와 함께 5~7월 약 43만 7,000명의 유대인을 아우슈비츠로 이송했다.',
            'After Italy’s armistice in September 1943 Hitler had a plan drawn up for the occupation of Hungary (Margarethe I), and in March 1944 he summoned Horthy to Schloss Klessheim and had him sign a protocol accepting it. When German troops crossed the border on 19 March the Hungarian army did not resist, and the occupation was quick and almost bloodless. Horthy remained regent but had to replace Prime Minister Kállay with Döme Sztójay, the minister in Berlin.\n\nWith the occupation Edmund Veesenmayer arrived as Reich plenipotentiary, and thousands of people, including opposition politicians and refugee soldiers, were arrested. Eichmann’s special commando entered the country and, with the Hungarian Interior Ministry and gendarmerie, deported some 437,000 Jews to Auschwitz between May and July.'],
        aliases: { ko: ['독일의 헝가리 점령', '독일의 헝가리 침공 (1944)'], en: ['German invasion of Hungary (1944)', 'German occupation of Hungary', 'Unternehmen Margarethe', 'Margarethe hadművelet'] },
        people: ['adolf-hitler', 'miklos-horthy', 'dome-sztojay', 'edmund-veesenmayer', 'maximilian-von-weichs', 'miklos-kallay'],
        events: ['hungary-1944-1945', 'hungary-axis-1938-1944'],
        sources: [S.marg, S.huMarg, S.ushmm], locator: 'lead; Course of events; Aftermath',
    }),
    term({
        id: 'operation-panzerfaust', ko: '판처파우스트 작전', en: 'Operation Panzerfaust', category: 'international', period: '1944', startYear: 1944, endYear: 1944,
        definition: ['1944년 10월 헝가리를 독일 편에 붙잡아 두려고 독일이 벌인 작전. 섭정 호르티가 소련과 휴전을 선언한 10월 15일 오토 스코르체니의 친위대 특공대가 호르티의 아들을 납치했고, 호르티는 이튿날 퇴위하고 살러시 페렌츠를 총리로 임명하는 문서에 서명했다.',
            'A German operation of October 1944 to keep Hungary on the German side. On 15 October, as Regent Horthy proclaimed an armistice with the Soviets, Otto Skorzeny’s SS commandos kidnapped Horthy’s son, and the next day Horthy signed a document abdicating and appointing Ferenc Szálasi prime minister.'],
        body: ['히틀러는 헝가리가 항복하면 루마니아가 이미 소련 편으로 넘어간 남쪽 측면이 열리고 발칸반도의 독일군이 고립될 것을 두려워했다. 스코르체니는 10월 15일 아침 티토의 밀사를 만나게 해 주겠다며 호르티의 아들을 꾀어내 붙잡았고, 그는 마우트하우젠 수용소에 갇혔다. 그날 낮 호르티의 휴전 선언이 방송되자 화살십자당이 독일의 도움으로 방송국을 장악했고, 스코르체니는 전차를 앞세워 왕궁 언덕으로 갔다.\n\n호르티는 아들의 목숨을 지키려고 퇴위 문서에 서명했고, 뒤에 「내 서명을 아들의 목숨과 맞바꾸었을 뿐」이라고 썼다. 그는 독일로 끌려갔고, 헝가리는 화살십자당 정권 아래 독일 편에서 끝까지 싸웠다.',
            'Hitler feared that a Hungarian surrender would expose his southern flank, where Romania had just joined the Soviets, and cut off the German troops in the Balkans. On the morning of 15 October Skorzeny lured Horthy’s son with a promise of a meeting with Tito’s envoys and seized him; he was held in Mauthausen. When Horthy’s armistice proclamation was broadcast that afternoon, the Arrow Cross seized the radio station with German help, and Skorzeny advanced on Castle Hill behind tanks.\n\nTo save his son’s life Horthy signed the abdication, later writing that he had “merely exchanged my signature for my son’s life”. He was taken to Germany, and Hungary fought on at Germany’s side under the Arrow Cross regime.'],
        aliases: { ko: [], en: ['Unternehmen Panzerfaust', 'Unternehmen Eisenfaust'] },
        people: ['otto-skorzeny', 'miklos-horthy', 'edmund-veesenmayer', 'geza-lakatos', 'ferenc-szalasi', 'adolf-hitler'],
        events: ['hungary-1944-1945'],
        sources: [S.panzerfaust, S.koPanzerfaust, S.lakatos], locator: 'lead; Prelude; Horthy’s declaration of armistice; Capture of Horthy',
    }),
    term({
        id: 'budapest-ghetto', ko: '부다페스트 게토', en: 'Budapest Ghetto', category: 'repression', period: '1944–1945', startYear: 1944, endYear: 1945,
        definition: ['화살십자당 정부가 1944년 11월 29일 법령으로 부다페스트의 옛 유대인 구역에 세운 울타리 친 게토. 약 7만 명의 유대인이 갇혔고, 1945년 1월 17~18일 소련군에 해방되었다.',
            'The fenced ghetto created in the old Jewish quarter of Budapest by a decree of the Arrow Cross government on 29 November 1944. Some 70,000 Jews were confined there until Soviet troops liberated it on 17–18 January 1945.'],
        body: ['게토는 도하니 거리 회당과 카진치 거리 회당이 있는 옛 유대인 구역의 몇 블록에 세워졌고, 높은 울타리로 둘러싸여 밖과 차단되었다. 음식 반입이 막히고 쓰레기가 치워지지 않았으며 시신이 거리에 쌓였고 장티푸스가 돌았다. 게토 안의 생활은 유대인 평의회가 꾸렸다. 중립국의 보호장을 가진 유대인은 따로 「국제 게토」에 살았다.\n\n미국 홀로코스트 기념관에 따르면 게토에서 약 3,000명이 죽었다. 1945년 1월 게토를 없애려던 계획은 막판에 저지되었는데, 그 공을 두고는 발렌베리 쪽 증언과 페를라스카의 증언이 엇갈린다.',
            'The ghetto occupied several blocks of the old Jewish quarter, including the Dohány Street and Kazinczy Street synagogues, and was surrounded by a high fence that cut it off from the outside world. No food was allowed in, rubbish was not collected, the dead lay in the streets and typhoid spread. Its inner life was run by the Central Jewish Council. Jews holding protective papers of neutral powers lived separately in the “international ghetto”.\n\nAccording to the US Holocaust Memorial Museum, some 3,000 people died in the ghetto. A plan to destroy it in January 1945 was stopped at the last minute; accounts crediting Wallenberg conflict with Perlasca’s.'],
        aliases: { ko: ['페스트 게토'], en: ['Pest ghetto', 'Budapest ghetto', 'pesti gettó'] },
        people: ['ferenc-szalasi', 'raoul-wallenberg', 'carl-lutz', 'adolf-eichmann'],
        events: ['hungary-1944-1945'],
        sources: [S.ghetto, S.ushmm, S.holo], locator: 'lead; History; Saving the ghetto in January 1945',
    }),
    term({
        id: 'kasztner-train', ko: '커스트네르 열차', en: 'Kasztner train', category: 'repression', period: '1944', startYear: 1944, endYear: 1944,
        definition: ['1944년 6월 30일 커스트네르 레죄가 아이히만과 협상해 몸값을 치르고 부다페스트에서 내보낸 열차. 1,600명이 넘는 유대인이 베르겐벨젠을 거쳐 8월과 12월에 스위스에 닿았다.',
            'The train that left Budapest on 30 June 1944 under a ransom deal Rezső Kasztner negotiated with Eichmann. Over 1,600 Jews reached Switzerland in August and December by way of Bergen-Belsen.'],
        body: ['열차는 화물차 35량으로 이루어졌고, 헝가리 유대인 43만 7,000명이 아우슈비츠로 이송되던 1944년 5~7월에 조직되었다. 승객은 여러 사회 계층에서 골랐고 고아를 포함한 어린이가 약 273명이었다. 부유한 승객 150명이 1인당 1,500달러를 내 다른 승객의 몫까지 댔고, 금·다이아몬드·현금이 친위대 장교 쿠르트 베허에게 건네졌다. 열차는 베르겐벨젠으로 돌려져 승객들이 몇 주에서 몇 달씩 갇혀 있었다.\n\n거래는 큰 논쟁을 낳았다. 커스트네르는 아우슈비츠의 학살을 알고도 공동체 전체에 알리지 않았고 가족과 고향 콜로주바르 사람 388명을 태웠다는 비판을 받았다. 1955년 이스라엘의 명예훼손 재판에서 판사는 그가 「악마에게 영혼을 팔았다」고 했고, 그가 1957년 3월 암살된 뒤 대법원이 판결의 대부분을 뒤집었다.',
            'The train consisted of 35 cattle wagons and was organised during the deportations of May–July 1944, when 437,000 Hungarian Jews were sent to Auschwitz. Its passengers were chosen from a wide range of social classes and included around 273 children, many of them orphaned. The wealthiest 150 passengers paid $1,500 each to cover their own and the others’ escape, and gold, diamonds and cash were handed to the SS officer Kurt Becher. The train was diverted to Bergen-Belsen, where the passengers were held for weeks and in some cases months.\n\nThe deal was deeply controversial. Kasztner was criticised for knowing of the gassings at Auschwitz without alerting the wider community, and for including his family and 388 people from his home town of Kolozsvár. In a 1955 Israeli libel trial the judge ruled that he had “sold his soul to the devil”; after his assassination in March 1957 the Supreme Court overturned most of the ruling.'],
        aliases: { ko: ['카스트너 열차'], en: ['Kastner train', 'Kasztner transport', 'Kastner transport'] },
        people: ['rezso-kasztner', 'adolf-eichmann'],
        events: ['hungary-1944-1945'],
        sources: [S.kasztner, S.ushmm, S.holo], locator: 'lead; Organizer; Passengers; Journey',
    }),
];

module.exports = { event, people, terms };
