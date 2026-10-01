// The Hungarian Soviet Republic (1918.10–1919.08): Aster Revolution, Károlyi's
// republic, the Vix note and the 21 March merger, the Revolutionary Governing
// Council, socialisation, the Entente and the intervention wars, the northern
// campaign and the Slovak Soviet Republic, the Red Terror, the collapse and the
// road to Horthy. Part of the Hungary 1919–1944 batch (2026-10-01).
const { W, HU, P, event, person, term } = require('./lib');

const w = t => W(encodeURI(t));
const hu = t => HU(encodeURI(t));
const M = p => 'https://www.marxists.org/archive/lenin/works/' + p;
const S = {
    hsr: w('Hungarian_Soviet_Republic'),
    huhsr: hu('Magyarországi_Tanácsköztársaság'),
    aster: w('Aster_Revolution'),
    koAster: 'https://ko.wikipedia.org/wiki/' + encodeURI('과꽃_혁명'),
    karolyi: w('Mihály_Károlyi'),
    vix: w('Vix_Note'),
    firstRep: w('First_Hungarian_Republic'),
    kun: w('Béla_Kun'),
    garbai: w('Sándor_Garbai'),
    huGarbai: hu('Garbai_Sándor'),
    landler: w('Jenő_Landler'),
    huLandler: hu('Landler_Jenő'),
    bohm: w('Vilmos_Böhm'),
    huBohm: hu('Böhm_Vilmos'),
    szamuely: w('Tibor_Szamuely'),
    korvin: w('Ottó_Korvin'),
    peidl: w('Gyula_Peidl'),
    huPeidl: hu('Peidl_Gyula'),
    leninBoys: w('Lenin_Boys'),
    redTerror: w('Red_Terror_(Hungary)'),
    whiteTerror: w('White_Terror_(Hungary)'),
    hrWar: w('Hungarian–Romanian_War'),
    hcWar: w('Hungarian–Czechoslovak_War'),
    slovak: w('Slovak_Soviet_Republic'),
    huClemenceau: hu('Clemenceau-jegyzék'),
    lukacs: w('György_Lukács'),
    horthy: w('Miklós_Horthy'),
    lenin0322: M('1919/mar/22.htm'),
    lenin0323: M('1919/mar/23.htm'),
    lenin0527: M('1919/may/27.htm'),
    leninTheses: M('1920/jul/04.htm'),
    leninCongress: M('1920/jul/x03.htm'),
};

const sections = [
    {
        heading: { ko: '과꽃 혁명과 카로이의 인민공화국', en: 'The Aster Revolution and Károlyi’s People’s Republic' },
        paragraphs: [
            {
                ko: '1918년 10월 23일 오스트리아-헝가리가 무너지는 가운데 카로이 미하이의 독립48년당, 야시 오스카르의 급진당, 사회민주당이 헝가리 국민평의회를 세웠다. 10월 30일 카를 국왕이 기성 정치인 허디크 야노시를 총리로 임명하자 부다페스트의 병사들은 모자의 장미를 떼고 과꽃을 꽂은 채 국민평의회에 충성을 맹세했고, 병사평의회가 시내의 요지를 장악했다. 혁명은 이 꽃의 이름을 따 과꽃 혁명(애스터 혁명)으로 불린다. 허디크는 17시간 만에 물러났고 10월 31일 카로이가 총리가 되었으며, 같은 날 전 총리 티서 이슈트반이 병사들에게 살해되었다. 11월 13일 카를이 국정에서 물러나겠다고 밝힌 뒤 11월 16일 헝가리 인민공화국이 선포되었고, 카로이가 임시 국가원수를 겸했다. 자유선거는 끝내 치러지지 않았다.',
                en: 'On 23 October 1918, as Austria-Hungary fell apart, Mihály Károlyi’s Party of Independence and ’48, Oszkár Jászi’s Radicals and the Social Democrats formed the Hungarian National Council. When King Charles appointed the establishment politician János Hadik prime minister on 30 October, soldiers in Budapest tore the roses from their caps, put in asters and swore allegiance to the National Council, and the Soldiers’ Council took over strategic points in the city; the revolution is named the Aster Revolution after that flower. Hadik resigned after seventeen hours, Károlyi became prime minister on 31 October, and the same day the former prime minister István Tisza was killed by soldiers. After Charles withdrew from affairs of state on 13 November, the Hungarian People’s Republic was proclaimed on 16 November with Károlyi also serving as provisional head of state. Free elections were never held.',
                sources: [S.aster, S.koAster],
            },
            {
                ko: '카로이 정부는 윌슨 미국 대통령의 평화 원칙에 기대를 걸고, 11월 2일 국방장관 린데르 벨러의 지휘로 아직 140만 명이 넘던 군의 무장해제를 시작했다. 11월 13일 베오그라드 군사협정은 헝가리 영토 안쪽에 분계선을 그었고, 세르비아·프랑스군이 남쪽에서, 체코슬로바키아군이 북쪽에서, 루마니아군이 동쪽에서 국경을 넘었다. 카로이 정부 시기에 헝가리는 전쟁 전 영토의 약 75%에 대한 통제를 무력 저항 없이 잃었다. 카로이는 본보기로 자기 가문의 영지를 소작인들에게 내주었지만 다른 토지 이전은 이루어지지 않았다. 1919년 1월 그는 대통령이 되었고 총리직은 베린케이 데네시가 이었다.',
                en: 'The Károlyi government pinned its hopes on President Wilson’s peace principles and on 2 November, under War Minister Béla Linder, began disarming an army that still had more than 1.4 million men. The Belgrade military convention of 13 November drew a demarcation line inside Hungary, and Serbian and French troops crossed the southern border, Czechoslovak troops the northern and Romanian troops the eastern. Under Károlyi’s government Hungary lost control of about 75 per cent of its pre-war territory without armed resistance. As an example Károlyi gave his own family estates to his tenants, but no other transfer of land followed. In January 1919 he became president, and Dénes Berinkey prime minister.',
                sources: [S.firstRep, S.huClemenceau, S.karolyi],
            },
            {
                ko: '러시아 포로수용소에서 공산주의를 받아들이고 내전에서 볼셰비키 편에 서서 싸운 쿤 벨러는 1918년 11월 소비에트 측이 준 거액의 자금을 가지고 귀국해, 11월 24일 헝가리 공산주의자당(KMP)을 창립했다. 당은 「붉은 신문」을 내며 카로이 정부와 사회민주당을 공격했고, 1919년 2월 당원은 3만~4만 명으로 추산된다(쿤 벨러 항목은 3만 명 미만, 사회민주당은 70만 명으로 적는다). 2월 20일 공산당 시위대가 사회민주당 기관지 「네프서버」 편집국을 습격해 경찰관을 포함한 7명이 죽었고, 정부는 쿤 등 지도자들을 체포했다. 경찰이 이들을 구타한 일이 알려지자 오히려 동정 여론이 일었고, 옥중의 쿤은 하루에 수백 명의 방문객을 맞으며 당을 지휘했다.',
                en: 'Béla Kun, who had embraced communism in a Russian prisoner-of-war camp and fought for the Bolsheviks in the Civil War, came home in November 1918 with a large sum of money provided by the Soviets and founded the Party of Communists in Hungary (KMP) on 24 November. The party published Red News and attacked the Károlyi government and the Social Democrats; its membership in February 1919 is put at 30,000 to 40,000 (the article on Kun gives fewer than 30,000, against the Social Democrats’ 700,000). On 20 February Communist demonstrators attacked the offices of the Social Democratic daily Népszava; seven people, some of them policemen, were killed, and the government arrested Kun and other leaders. Reports that the police had beaten them won the party sympathy, and from his cell Kun directed the party, receiving hundreds of visitors a day.',
                sources: [S.hsr, S.kun],
            },
        ],
    },
    {
        heading: { ko: '빅스 각서와 3월 21일의 합당', en: 'The Vix note and the merger of 21 March' },
        paragraphs: [
            {
                ko: '1919년 3월 20일 협상국 군사사절단장인 프랑스의 페르낭 빅스 중령은 카로이 정부에 헝가리군을 베오그라드 협정선보다 더 뒤로 물리라는 각서를 전달했다. 내용은 2월 말 파리 강화회의에서 정해졌지만 전달된 뒤 이행까지는 18시간밖에 남지 않았다. 새 군사분계선이 곧 전후 국경이 되리라는 것이 일반적인 예상이었다. 카로이와 베린케이는 각서를 받아들이면 영토 보전이 위태로워지지만 거부할 힘도 없다고 판단했고, 베린케이 내각은 사임했다. 카로이는 도시 노동계급의 지지를 받는 사회민주당만이 새 정부를 꾸릴 수 있다고 내각에 알렸다.',
                en: 'On 20 March 1919 the French Lieutenant Colonel Fernand Vix, head of the Entente military mission, handed the Károlyi government a note ordering Hungarian troops to withdraw beyond the line of the Belgrade convention. Its contents had been decided at the Paris Peace Conference in late February, but only eighteen hours remained for its implementation once it was delivered. It was widely assumed that the new military line would become the post-war frontier. Károlyi and Berinkey concluded that accepting the note would endanger the country’s territorial integrity but that they were in no position to reject it, and the Berinkey cabinet resigned. Károlyi told the ministers that only the Social Democrats, with their support among the urban working class, could form a new government.',
                sources: [S.vix, S.hsr, S.firstRep],
            },
            {
                ko: '사회민주당은 쿤의 볼셰비키 인맥을 통해 러시아 붉은군대의 도움을 얻기를 바랐고, 그 기대 때문에 수감자인 쿤이 오히려 조건을 정했다. 3월 21일 런들레르 예뇌는 감옥에서 쿤 일행과 프롤레타리아 독재 도입에 합의했고, 두 당은 헝가리 사회당이라는 이름으로 합당했다. 합당 문서는 옥중의 코르빈 오토가 타자로 쳤다. 그날 저녁 카로이가 모르는 사이 대통령과 정부가 스스로 물러나 권력을 프롤레타리아트에게 넘겼다는 소식이 퍼졌고, 이튿날 신문이 그렇게 보도했다. 카로이 명의의 포고문은 파리 강화회의의 결정에 맞서 「세계 프롤레타리아트에게 정의와 도움을 호소한다」고 썼다. 카로이는 당시에는 이를 부인하지 않았으나 훗날 그런 성명을 낸 적이 없다고 했다.',
                en: 'The Social Democrats hoped to use Kun’s Bolshevik connections to obtain help from the Russian Red Army, and that hope let Kun, a prisoner, dictate the terms. On 21 March Jenő Landler agreed with Kun and his comrades in prison on introducing the dictatorship of the proletariat, and the two parties merged as the Hungarian Socialist Party; Ottó Korvin typed the text of the merger in his cell. That evening, without Károlyi’s knowledge, word spread that the president and the government had resigned of their own accord and handed power to the proletariat, and the papers reported it so the next morning. A proclamation in Károlyi’s name appealed, against the decision of the Paris conference, “to the proletariat of the world for justice and help”. Károlyi did not disavow it at the time but later denied having made such a statement.',
                sources: [S.kun, S.huhsr, S.korvin],
            },
            {
                ko: '3월 21일 사회민주당의 거르버이 샨도르와 공산당의 쿤 벨러가 평의회 공화국을 선포했다. 러시아에 이어 유럽에서 두 번째로 공산주의자가 이끄는 정권이었다. 쿤은 무선 전신으로 레닌에게 헝가리에 프롤레타리아 독재가 세워졌다고 알리고 러시아 사회주의 연방 소비에트 공화국과의 동맹 조약을 요청했지만, 내전에 묶인 소비에트 러시아는 이를 받아들이지 않았다. 레닌은 3월 22일 무선으로 「헝가리 소비에트 공화국의 프롤레타리아 정부, 특히 쿤 벨러 동지」에게 인사를 보냈고, 이튿날에는 새 정부가 단순한 사회주의 정부, 곧 「배신자 사회주의자들」의 정부가 아니라 실제로 공산주의 정부가 되리라는 「실질적 보장」이 무엇인지, 공산주의자가 정부의 다수인지를 물었다. 그는 같은 전문에서 헝가리 혁명의 특수한 조건에서 러시아의 전술을 세부까지 모방하는 것은 잘못이라고 경고했다.',
                en: 'On 21 March the Social Democrat Sándor Garbai and the Communist Béla Kun proclaimed the Republic of Councils — the second Communist-led regime in Europe after Russia. By radiotelegraph Kun told Lenin that a dictatorship of the proletariat had been established in Hungary and asked for a treaty of alliance with the Russian SFSR, which, tied down by the Civil War, declined. On 22 March Lenin radioed greetings “to the proletarian government of the Hungarian Soviet Republic, and especially to Comrade Bela Kun”; the next day he asked “what real guarantees” Kun had that the new government would actually be communist and not simply socialist, “i.e., one traitor-socialists”, and whether the Communists had a majority in it. In the same message he warned that it would be a mistake merely to imitate Russian tactics in all details in the specific conditions of the Hungarian revolution.',
                sources: [S.hsr, S.kun, S.lenin0322, S.lenin0323],
            },
        ],
    },
    {
        heading: { ko: '혁명통치평의회와 사회화', en: 'The Revolutionary Governing Council and socialisation' },
        paragraphs: [
            {
                ko: '새 정부인 혁명통치평의회의 의장은 거르버이였고 쿤은 외무 인민위원이었지만, 레닌과 무선으로 직접 연락하는 쿤이 실권을 쥐었다. 인민위원 33명 가운데 옛 공산당원은 14명, 옛 사회민주당원은 17명, 무소속은 2명이었고, 쿤을 뺀 인민위원은 모두 옛 사회민주당원, 인민위원 대리는 모두 옛 공산당원이었다. 런들레르가 내무, 뵘 빌모시가 사회화, 바르가 예뇌(훗날 소련의 경제학자 예브게니 바르가)가 재무를 맡았고, 루카치 죄르지는 교육 인민위원 대리가 되었다. 4월 2일의 임시 헌법은 노동자·병사·농민 평의회가 법을 만들고 집행하며 재판한다고 규정했다. 4월 7일 평의회 선거에서는 헝가리에서 처음으로 여성이 투표했지만, 고용주와 성직자 등은 선거권이 없었고 후보는 통합 사회당만 낼 수 있었다. 거르버이의 제안으로 국호의 「소비에트」는 헝가리어 「터나치」(평의회)로 바뀌었고, 6월 23일 최종 헌법은 국호를 「헝가리 사회주의 연방 평의회 공화국」으로 정했다.',
                en: 'The new government, the Revolutionary Governing Council, was chaired by Garbai, with Kun as People’s Commissar for Foreign Affairs, but real power lay with Kun, who was in direct radio contact with Lenin. Of its thirty-three commissars fourteen were former Communists, seventeen former Social Democrats and two non-party; with the exception of Kun every commissar was a former Social Democrat and every deputy commissar a former Communist. Landler took the interior, Vilmos Böhm socialisation and Jenő Varga (later the Soviet economist Evgeny Varga) finance, and György Lukács became deputy commissar for education. The provisional constitution of 2 April vested the making, execution and adjudication of laws in the workers’, soldiers’ and peasants’ councils. In the council elections of 7 April women voted for the first time in Hungary, but employers, the clergy and others were disenfranchised and only the merged Socialist Party could field candidates. At Garbai’s suggestion “soviet” in the state’s name gave way to the Hungarian word tanács (council), and the final constitution of 23 June named the state the Socialist Federative Republic of Councils in Hungary.',
                sources: [S.kun, S.hsr, S.huhsr],
            },
            {
                ko: '정부는 귀족 칭호와 특권을 없애고 교회와 국가를 분리했으며, 첫날부터 전국적 금주령을 내렸다. 주택, 호텔, 상점, 백화점, 대외무역, 금융기관, 학교, 극장, 영화관, 약국과 노동자 20명이 넘는 공업·광업·운수 기업이 보상 없이 사회화되었다. 몰수 대상 토지의 기준은 자료에 따라 100홀드(약 57헥타르) 초과 또는 40헥타르 초과로 다르게 적힌다. 8시간 노동제가 도입되고 집세가 20% 내렸으며, 방이 여럿인 부르주아 주택에 노동자 가족이 들어갔다. 공장 경영은 노동자와 공장평의회에 맡겨졌고 사회보험이 확대되었다. 그러나 집세 인하와 임금 인상은 곧 인플레이션에 묻혔고, 3주 만에 공산당원들은 경제 분야에서 옛 사회민주당원들에게 밀려났다. 금주령은 포도주 산지의 반발을 사 4월 포도주 수출이, 7월 노동자 1인당 하루 반 리터의 포도주가 허용되면서 넉 달 만에 끝났다.',
                en: 'The government abolished aristocratic titles and privileges, separated church and state and, from its first day, imposed nationwide prohibition. Housing, hotels, shops, department stores, foreign trade, financial institutions, schools, theatres, cinemas, pharmacies and industrial, mining and transport firms with more than twenty workers were socialised without compensation; the threshold for confiscated land is given as more than 100 hold (about 57 hectares) or more than 40 hectares depending on the source. The eight-hour day was introduced, rents were cut by 20 per cent and working-class families were moved into large bourgeois flats. Management of the factories was entrusted to the workers and factory councils, and social insurance was extended. But rent cuts and wage rises were soon wiped out by inflation, and within three weeks the Communists had been edged out of economic affairs by the former Social Democrats. Prohibition provoked resistance in the wine regions and ended after four months, with wine exports allowed in April and half a litre of wine a day for workers in July.',
                sources: [S.hsr, S.huhsr, S.kun],
            },
            {
                ko: '농업 문제는 평의회 공화국의 가장 큰 약점이었다. 정부는 몰수한 중대 토지를 농민에게 나누지 않고 협동조합과 국영농장으로 운영하기로 했으며, 옛 지주와 관리인, 마름이 새 농장의 관리자로 남는 경우가 많았다. 땅에서 일하지 않는 사람은 토지를 소유할 수 없다는 원칙이 선언되었지만, 분배를 기다리던 농업노동자와 빈농은 실망했고 다시 몰수될 것을 두려워한 자영농은 체제에 등을 돌렸다. 빈농에게 텃밭이 나누어진 것은 6월 말이었다. 정부가 농산물 값을 농민이 믿지 않는 새 지폐로 치르면서 도시의 식량 사정도 나빠졌고, 레닌 소년단 같은 무장대가 농촌에서 식량을 징발했다. 체제의 실질적 지지 기반은 부다페스트를 비롯한 대공업 중심지의 노동자에 머물렀고, 농촌에서는 정부의 권위가 거의 미치지 않았다.',
                en: 'The agrarian question was the republic’s greatest weakness. The government did not divide the confiscated estates among the peasants but kept them as co-operatives and state farms, often retaining the former owners, managers and bailiffs as their managers. It declared that no one who did not work the land could own it, but the farmhands and poor peasants waiting for land were disappointed, and smallholders afraid of further expropriation turned against the regime; garden plots were handed out to poor peasants only from the end of June. Because the government paid for farm produce in a new paper currency the peasants did not trust, food supply to the towns worsened, and armed detachments such as the Lenin Boys requisitioned food in the countryside. The regime’s real base remained the workers of Budapest and the other big industrial centres, while in the countryside its authority was often nonexistent.',
                sources: [S.kun, S.huhsr, S.hsr],
            },
        ],
    },
    {
        heading: { ko: '스뮈츠 사절과 루마니아·체코슬로바키아의 개입', en: 'The Smuts mission and the Romanian and Czechoslovak intervention' },
        paragraphs: [
            {
                ko: '평의회 공화국의 수립에 놀란 파리 강화회의는 4월 4일 남아프리카의 얀 스뮈츠 장군을 부다페스트에 보냈다. 스뮈츠는 빅스 각서보다 유리한 분계선을 제시하고, 이를 받아들이면 경제 봉쇄를 풀고 헝가리를 강화 협상에 초청하겠다고 했다. 혁명통치평의회는 루마니아군이 마로시(무레슈)강 선까지 물러나고 점령군이 경제·정치에 간섭하지 않으며 세게드와 아라드에 프롤레타리아 독재를 되돌려 놓아야 한다는 조건을 달았고, 스뮈츠는 협상을 끝내고 떠났다. 그 사이 옛 지배층은 빈에서 베틀렌 이슈트반을 중심으로 반볼셰비키 위원회를 만들었고, 5월 30일 프랑스군이 점령한 세게드에서 카로이 줄러를 총리로 하는 반혁명 정부가 섰다. 전 해군 제독 호르티 미클로시가 그 국방장관이자 국민군 사령관이 되어 6월 6일 세게드에 도착했다.',
                en: 'Alarmed by the new republic, the Paris Peace Conference sent the South African general Jan Smuts to Budapest on 4 April. Smuts offered a more favourable line than the Vix note and promised that if it were accepted the blockade would be lifted and Hungary invited to the peace negotiations. The Revolutionary Governing Council made its acceptance conditional on Romanian troops returning to the line of the Maros (Mureș), on the occupying forces not interfering in economic and political affairs and on the restoration of the proletarian dictatorship in Szeged and Arad, and Smuts broke off the talks and left. Meanwhile the old elite formed an Anti-Bolshevik Committee in Vienna around István Bethlen, and on 30 May a counter-revolutionary government under Gyula Károlyi was set up in French-occupied Szeged. The former admiral Miklós Horthy became its war minister and commander of its National Army, arriving in Szeged on 6 June.',
                sources: [S.huhsr, S.hrWar, S.horthy],
            },
            {
                ko: '4월 16일 루마니아군이 분계선을 넘어 공세를 시작했다. 4월 26일 반혁명 성향의 크러토흐빌 카로이가 지휘하던 정예 세케이 사단이 루마니아군과 협상한 끝에 무기를 내려놓아 130킬로미터의 전선이 열렸고, 5월 1일까지 루마니아군은 티서강 동쪽을 모두 차지했다. 북쪽에서는 체코슬로바키아군이 5월 2일 미슈콜츠에 들어왔다. 쿤은 4월 19일 집회에서 「우리는 영토 보전의 교리를 신봉하지 않는다」며 이 싸움이 국제 혁명과 국제 반혁명의 싸움이라고 했고, 4월 22일 레닌에게는 필요하다면 「브레스트-리토프스크식」 강화라도 맺겠다고 썼다. 4월 26일 그는 협상국의 제안을 거부한 것이 실수였다고 공개적으로 인정하고 사임을 입에 올렸다. 루마니아군이 티서강에서 멈춘 것은 5월 1일 소비에트 러시아 외무인민위원 게오르기 치체린이 베사라비아에서 물러나지 않으면 공격하겠다는 최후통첩을 보내자 루마니아가 5월 2일 부다페스트와 휴전했기 때문이었다.',
                en: 'On 16 April the Romanian army crossed the demarcation line and attacked. On 26 April the elite Székely Division, commanded by the counter-revolutionary Károly Kratochvil, laid down its arms after a week of talks with the Romanians, opening 130 kilometres of front, and by 1 May the Romanians held everything east of the Tisza. In the north Czechoslovak troops entered Miskolc on 2 May. At a rally on 19 April Kun declared that “we do not profess the doctrine of territorial integrity” and that the struggle was one between international revolution and international counter-revolution; on 22 April he wrote to Lenin that if need be he would sign a peace “à la Brest-Litovsk”. On 26 April he publicly admitted that rejecting the Allied proposals had been a mistake and spoke of resigning. The Romanians stopped at the Tisza because on 1 May the Soviet foreign commissar Georgy Chicherin threatened to attack unless Romania withdrew from Bessarabia, and Romania agreed a truce with Budapest on 2 May.',
                sources: [S.huhsr, S.hrWar, S.kun, S.hcWar],
            },
            {
                ko: '지도부는 처음부터 러시아 붉은군대와의 연결에 기대를 걸었다. 5월 18일 서무엘리 티보르는 비행기로 키이우에 가서 우크라이나의 포드보이스키 군사인민위원, 안토노프-옵세옌코 사령관과 협의하고 모스크바에서 레닌과 여러 차례 회담하며 루마니아에 대한 공동 작전을 제안했다. 그러나 5월 31일 돌아온 서무엘리는 백군이 모스크바를 위협하고 우크라이나의 붉은군대도 백군·폴란드군과 싸우고 있어 실질적인 도움을 기대할 수 없다고 보고했다. 레닌은 5월 27일 「헝가리 노동자들에게 보내는 인사」에서 헝가리 프롤레타리아트가 조직 면에서 이미 러시아를 앞선 듯하다고 칭찬하며, 착취자의 저항을 「무자비하게 엄격하고 신속하며 단호하게」 분쇄하라고 촉구했다.',
                en: 'From the start the leadership counted on joining hands with the Russian Red Army. On 18 May Tibor Szamuely flew to Kyiv to confer with the Ukrainian war commissar Podvoisky and commander Antonov-Ovseenko, then held several talks with Lenin in Moscow, proposing a joint operation against Romania. But on his return on 31 May he reported that the Whites were threatening Moscow and the Ukrainian Red Army was fighting the Whites and the Poles, so no effective help could be expected. In his “Greetings to the Hungarian Workers” of 27 May Lenin praised the Hungarian proletariat for apparently having “excelled us” in organisation and called for the “ruthlessly severe, swift and resolute use of force” to crush the resistance of the exploiters.',
                sources: [S.huhsr, S.lenin0527],
            },
        ],
    },
    {
        heading: { ko: '북부 원정과 슬로바키아 평의회 공화국', en: 'The northern campaign and the Slovak Soviet Republic' },
        paragraphs: [
            {
                ko: '루마니아·체코슬로바키아군의 진격 앞에서 정부는 계급 구호 대신 조국 방위를 호소했고, 붉은군대는 5월 말 20만 명으로 불었다. 총사령관은 뵘 빌모시였고 실제 지휘는 참모장 시트롬펠드 어우렐 대령이 맡았다. 옛 왕국군의 장교와 병사 다수가 공산주의자를 위해서가 아니라 나라를 지키기 위해 돌아왔다. 5월 20일 붉은군대는 체코슬로바키아군에 반격해 미슈콜츠를 되찾고 루마니아군과 체코슬로바키아군 사이를 갈라놓았다. 이어진 북부 원정에서 6월 6일 코시체(커샤)를 점령했고, 3주 만에 니트라–즈볼렌–코시체 선까지 나아가 바르데요우(바르트퍼)에서 폴란드 국경에 이르렀다.',
                en: 'Faced with the Romanian and Czechoslovak advance, the government appealed for the defence of the country rather than for class war, and the Red Army grew to 200,000 by the end of May. Its commander-in-chief was Vilmos Böhm, while the chief of staff, Colonel Aurél Stromfeld, directed operations in practice; many officers and soldiers of the old royal army returned, not to fight for the Communists but to defend their country. On 20 May the Red Army counter-attacked the Czechoslovaks, retook Miskolc and drove a wedge between the Czechoslovak and Romanian armies. In the northern campaign that followed it took Košice (Kassa) on 6 June and within three weeks reached the Nitra–Zvolen–Košice line and the Polish border at Bardejov (Bártfa).',
                sources: [S.huhsr, S.hcWar],
            },
            {
                ko: '되찾은 도시에 걸린 것은 헝가리 삼색기가 아니라 붉은 깃발이었다. 6월 16일 프레쇼우(에페리에시)에서 체코인 언론인 안토닌 야노우셰크를 수반으로 하는 슬로바키아 평의회 공화국이 선포되었다. 이 국가는 생산수단의 사회화와 노동자 20명 이상의 공장·대토지·금융기관의 국유화를 포고하고 혁명재판소와 슬로바키아 「붉은군대」를 세웠지만, 부다페스트에 의존했고 헝가리의 일부인지 독립국인지, 국경이 어디인지도 분명하지 않았다. 쿤은 6월 10일 코시체에서 「우리 볼셰비키는 헝가리의 통합을 지지한다」고 연설했고, 체코 역사가 야로슬라프 셰베크는 이 국가를 슬로바키아에서 헝가리의 영향력을 되살리려는 덮개로도 본다. 반대로 헝가리의 민족주의자와 직업 장교들은 슬로바키아 공화국의 선포를 공산주의 정부가 잃은 땅을 되찾을 뜻이 없다는 신호로 받아들였다.',
                en: 'The flag raised over the recaptured towns was not the Hungarian tricolour but the red flag. On 16 June the Slovak Soviet Republic was proclaimed in Prešov (Eperjes), headed by the Czech journalist Antonín Janoušek. It decreed the socialisation of the means of production and the nationalisation of factories with more than twenty workers, large estates and financial institutions, and set up revolutionary tribunals and a Slovak “Red Army”, but it depended on Budapest, and it was never clear whether it was part of Hungary or independent, or where its borders lay. Kun told a meeting in Košice on 10 June that “we Bolsheviks are for the integrity of Hungary”, and the Czech historian Jaroslav Šebek sees the state partly as a cover for renewing Hungarian influence in Slovakia. Hungarian nationalists and professional officers, on the contrary, took its proclamation as a sign that the Communist government had no intention of recovering the lost territories.',
                sources: [S.huhsr, S.slovak, S.hsr],
            },
            {
                ko: '조르주 클레망소 프랑스 총리는 6월 7일 전보로 공격 중지를 요구했고, 6월 13일에는 강화회의가 정한 헝가리의 북부·동부 국경을 통보하며 붉은군대가 그 뒤로 물러나면 루마니아군도 티서강 동쪽에서 철수시키겠다고 약속했다. 지도부는 긴 논쟁 끝에 이를 받아들였고, 쿤은 「강요된 제국주의적 강화는 브레스트-리토프스크 강화보다 오래가지 않을 것」이라고 말했다. 6월 24일 전투가 멈췄고 6월 30일 철수가 시작되어 7월 7일 슬로바키아 평의회 공화국도 사라졌다. 그러나 루마니아군은 티서강에서 움직이지 않았다. 희생을 치르고 얻은 땅을 내준 데 반발해 시트롬펠드가 사임했고, 장교와 병사가 대거 떠나면서 붉은군대는 무너지기 시작했다.',
                en: 'On 7 June the French prime minister Georges Clemenceau telegraphed a demand to halt the offensive, and on 13 June he communicated Hungary’s northern and eastern frontiers as fixed by the conference, promising that if the Red Army withdrew behind them the Romanians would evacuate the land east of the Tisza. After long debate the leadership accepted, Kun declaring that “the imperialist peace that we are forced to conclude will not last longer than that of Brest-Litovsk”. Fighting stopped on 24 June, the withdrawal began on 30 June, and on 7 July the Slovak Soviet Republic ceased to exist. But the Romanians did not move from the Tisza. Stromfeld resigned in protest at giving up the ground won at such cost, officers and men left in large numbers, and the Red Army began to disintegrate.',
                sources: [S.huClemenceau, S.hcWar, S.kun, S.huhsr, S.slovak],
            },
        ],
    },
    {
        heading: { ko: '적색 테러', en: 'The Red Terror' },
        paragraphs: [
            {
                ko: '혁명통치평의회는 3월 21일 계엄을 선포하고 혁명재판소를 두었으며, 경찰과 헌병을 붉은 경비대로 대체했다. 공산당은 정치경찰을 쥐었고, 6월부터 코르빈 오토가 정치조사국을 이끌었다. 서무엘리는 4월 20일 죄르 연설에서 「피를 두려워해서는 안 된다」고 말했다. 체르니 요제프가 조직한 약 200명의 무장대는 「레닌 소년단」을 자칭하며 서무엘리의 장갑열차를 타고 전국을 돌았고, 반혁명이 의심되는 곳에서 재판 없이 사람을 처형했다. 4월 마코에서 잡힌 인질 가운데 전 하원의장 나바이 러요시와 마코 시장 등은 부다페스트로 끌려가던 도중에 총살되었다. 루카치는 붉은군대 제5사단 정치위원으로서 5월 포로슬로에서 자기 부대 병사 8명을 처형하게 했다.',
                en: 'On 21 March the Revolutionary Governing Council imposed martial law and set up revolutionary tribunals, replacing the police and gendarmerie with the Red Guard. The Communists kept the political police, and from June Ottó Korvin headed its political investigation department. In a speech at Győr on 20 April Szamuely declared, “We must not be afraid of blood.” A band of some two hundred men organised by József Cserny, calling themselves the “Lenin Boys”, toured the country on Szamuely’s armoured train and executed people without trial wherever counter-revolution was suspected. In April hostages taken at Makó, among them the former Speaker Lajos Návay and the mayor of Makó, were shot on the way to Budapest. As political commissar of the Red Army’s Fifth Division, Lukács ordered the execution of eight of his own soldiers at Poroszló in May.',
                sources: [S.huhsr, S.szamuely, S.leninBoys, S.redTerror, S.lukacs],
            },
            {
                ko: '테러는 정부 안에서도 다툼거리였다. 사회민주당 출신 인민위원들은 서무엘리와 체르니를 억제하라고 요구했고, 국방 인민위원 뵘은 4월 말 무장대와 재판소의 해산을 명령했다. 서무엘리는 이를 따르지 않고 5월 솔노크와 어보니에서 재판을 이어 갔다. 5월 19일 군은 괴될뢰에서 체르니 부대를 무장해제했지만, 그 가운데 43명은 코르빈의 정치조사국에 배속되어 「두 번째 체르니 부대」가 되었다. 6월 24일 부다페스트에서 루도비커 사관학교 생도들이 봉기하고 다뉴브강의 모니터함이 인민위원들의 숙소인 헝가리아 호텔을 포격했으나 하루 만에 진압되었다. 같은 시기 칼로처와 두너퍼터이 일대의 농민 봉기는 서무엘리의 징벌대와 레닌 소년단에게 유혈 진압되었고 공개 교수형이 집행되었다. 부다페스트의 유일한 협상국 대표였던 이탈리아의 귀도 로마넬리 중령은 테러에 항의했고, 6월 봉기 가담자들을 보복에서 구해 냈다.',
                en: 'The terror divided the government itself. The commissars who had been Social Democrats demanded that Szamuely and Cserny be reined in, and the defence commissar Böhm ordered the paramilitaries and tribunals dissolved at the end of April; Szamuely ignored him and continued his tribunals at Szolnok and Abony in May. On 19 May the army disarmed the Cserny group at Gödöllő, but 43 of its men were assigned to Korvin’s political investigation department as the “second Cserny group”. On 24 June cadets of the Ludovika Academy rose in Budapest and river monitors on the Danube shelled the Hotel Hungária where the commissars lived; the rising was crushed within a day. At the same time peasant revolts around Kalocsa and Dunapataj were put down bloodily by Szamuely’s punitive detachment and the Lenin Boys, with public hangings. The Italian Lieutenant Colonel Guido Romanelli, the only Entente representative in Budapest, protested against the terror and saved the participants of the June rising from reprisals.',
                sources: [S.szamuely, S.leninBoys, S.huhsr, S.kun],
            },
            {
                ko: '적색 테러의 사망자 수는 자료마다 다르다. 헝가리어 위키백과는 여러 자료가 300~600명으로 본다고 정리하고, 영어권 서술은 혁명재판소가 370~587명을 처형했다고 하거나 1922년 바리 얼베르트의 『헝가리 적색 테러의 희생자』를 따라 590명을 든다. 1919년 12월 체르니와 레닌 소년단원 13명이 부다페스트의 군 교도소에서 처형되었고, 코르빈도 같은 달 교수형에 처해졌다. 뒤이은 헝가리 백색테러의 희생자는 1,500~6,000명으로 추산되며, 쿤 벨러 항목은 그것이 적색 테러의 열 배에 이르렀다고 쓴다.',
                en: 'Estimates of the Red Terror’s death toll differ. The Hungarian Wikipedia summarises various sources as putting it at 300 to 600; English-language accounts say the revolutionary tribunals executed between 370 and 587 people, or give 590 following Albert Váry’s 1922 book The Victims of Red Terror in Hungary. In December 1919 Cserny and thirteen other Lenin Boys were executed in the Budapest military prison, and Korvin was hanged the same month. The White Terror that followed is estimated to have killed 1,500 to 6,000 people, ten times as many as the Red Terror according to the article on Kun.',
                sources: [S.huhsr, S.redTerror, S.leninBoys, S.korvin, S.whiteTerror, S.kun],
            },
        ],
    },
    {
        heading: { ko: '붕괴: 티서 공세에서 부다페스트 점령까지', en: 'Collapse: from the Tisza offensive to the occupation of Budapest' },
        paragraphs: [
            {
                ko: '7월 20일 붉은군대는 티서강을 건너 루마니아군을 공격했지만, 루마니아군은 며칠 만에 공세를 멈춰 세우고 헝가리군의 전선을 돌파했다. 그 사이 7월 23일 빈 주재 공사로 부임한 뵘은 사회민주당 지도부의 위임을 받아 협상국 사절단과 평의회 정부의 퇴진을 합의했다. 파리 강화회의의 5인 위원회는 협상국이 받아들일 수 있는 새 정부가 서야만 식량을 보내고 봉쇄를 풀며 강화를 맺겠다고 선언했고, 「네프서버」가 7월 30일 이를 실었다. 쿤은 7월 27일과 30일 모스크바에, 30일에는 레닌에게 직접 베사라비아에서 루마니아를 공격해 달라고 요청했으나, 7월 31일 우크라이나의 사정 때문에 당장은 불가능하다는 답이 왔다. 루마니아군은 7월 29~30일 티서강을 건너 부다페스트로 향했다.',
                en: 'On 20 July the Red Army crossed the Tisza and attacked the Romanians, who halted the offensive within days and broke through the Hungarian lines. Meanwhile Böhm, who had arrived in Vienna as envoy on 23 July, agreed with the Entente missions, on behalf of the Social Democratic leadership, on the removal of the council government. The Council of Five of the Paris conference declared that it would send food, lift the blockade and make peace only if a new government acceptable to it were formed, and Népszava printed the statement on 30 July. On 27 and 30 July Kun asked the party leadership in Moscow, and on the 30th Lenin personally, to open a front against Romania in Bessarabia; on 31 July the answer came that the situation in Ukraine made an immediate relief offensive impossible. On 29–30 July the Romanians crossed the Tisza and headed for Budapest.',
                sources: [S.hsr, S.huhsr, S.huBohm],
            },
            {
                ko: '7월 31일 쿤 등 지도자들은 전선 근처의 체글레드에 다녀왔고, 8월 1일 당 지도부와 혁명통치평의회의 합동회의는 사퇴를 결정했다. 쿤은 마지막 연설에서 「헝가리 프롤레타리아트는 지도자가 아니라 자기 자신을 배신했다」고 말하며, 공장에서 「프롤레타리아 독재 타도」를 외치던 노동자들이 앞으로 어떤 정부에도 만족하지 못할 것이라고 했다. 인민위원들은 특별열차로 빈에 갔고 오스트리아에서 억류되었다. 쿤은 지하조직을 위해 루카치와 코르빈을 남겼는데, 코르빈은 8월 체포되어 고문을 받았다. 서무엘리는 8월 2일 자동차로 오스트리아 국경을 넘다 붙잡혔고, 헝가리와 오스트리아 당국은 그가 권총으로 자살했다고 발표했지만 국경 경비대에 사살되었다는 견해도 있다.',
                en: 'On 31 July Kun and other leaders went to Cegléd near the front and came back, and on 1 August a joint meeting of the party leadership and the Revolutionary Governing Council decided to resign. In his last speech Kun said that “the Hungarian proletariat betrayed not their leaders but itself”, adding that workers who had shouted “Down with the dictatorship of the proletariat” in the factories would be even less satisfied with any future government. The commissars left for Vienna by special train and were interned in Austria. Kun left Lukács and Korvin behind to organise the underground party; Korvin was arrested in August and tortured. Szamuely was caught on 2 August after crossing the Austrian border by car; Hungarian and Austrian authorities reported that he had shot himself, though some believe he was shot by the border guards.',
                sources: [S.huhsr, S.kun, S.lukacs, S.korvin, S.szamuely],
            },
            {
                ko: '부다페스트 노동자평의회는 인쇄공 노동조합 지도자 페이들 줄러에게 정부를 맡겼다. 이른바 「노동조합 정부」는 8월 2일 첫 회의에서 평의회 공화국을 폐지하고 인민공화국을 되살렸으며, 혁명재판소를 해산하고 정치범을 석방했고, 8월 4일 붉은 경비대를 해산했다. 사회화된 재산은 옛 소유주에게 돌려주었지만 농민을 의식해 대토지는 지주에게 돌려주지 않았다. 루마니아군은 협상국의 금지에도 8월 3일 기병대를, 4일 본대를 부다페스트에 들여보냈고, 미국의 해리 힐 밴드홀츠 장군이 국립박물관의 약탈을 막았다. 협상국은 사회주의자만으로 된 정부를 승인하지 않았고, 8월 6일 우익 단체 「백악관 동지회」의 프리드리히 이슈트반이 루마니아군을 등에 업고 페이들 정부를 몰아냈다. 이튿날 요제프 아우구스트 대공이 섭정을 자처하며 프리드리히를 총리로 임명했다.',
                en: 'The Budapest Workers’ Council entrusted the government to the printers’ union leader Gyula Peidl. At its first meeting on 2 August this “trade-union government” abolished the Republic of Councils and restored the People’s Republic, disbanded the revolutionary tribunals and released political prisoners, and on 4 August it dissolved the Red Guard. Socialised property was returned to its former owners, though as a gesture to the peasantry the estates were not handed back to the landowners. Despite the Entente’s prohibition, Romanian cavalry entered Budapest on 3 August and the main force on the 4th, and the American General Harry Hill Bandholtz prevented the looting of the National Museum. The Allies refused to recognise a purely socialist government, and on 6 August István Friedrich of the right-wing White House Comrades’ Association, backed by the Romanian army, drove out the Peidl government. The next day Archduke Joseph August declared himself regent and appointed Friedrich prime minister.',
                sources: [S.hsr, S.peidl, S.huPeidl, S.firstRep, S.hrWar, S.huhsr],
            },
            {
                ko: '루마니아군은 벌러톤 호 주변을 뺀 헝가리 대부분을 점령했다가 1920년 초 식량과 공장 설비, 철도 차량을 가지고 철수했다. 세게드에서 국민군을 키운 호르티는 1919년 11월 국민군을 이끌고 부다페스트에 들어왔고, 넉 달 뒤인 1920년 3월 1일 다시 세워진 헝가리 왕국의 섭정이 되었다. 그 사이 국민군 장교들은 공산주의자, 사회민주주의자, 유대인을 겨냥한 헝가리 백색테러를 벌였다.',
                en: 'Romania occupied all of Hungary except the area around Lake Balaton and withdrew in early 1920, taking food, factory equipment and rolling stock with it. Horthy, who had built up the National Army in Szeged, led it into Budapest in November 1919 and four months later, on 1 March 1920, became regent of the re-established Kingdom of Hungary. In the meantime officers of the National Army carried out the White Terror against Communists, Social Democrats and Jews.',
                sources: [S.hrWar, S.whiteTerror, S.horthy],
            },
        ],
    },
    {
        heading: { ko: '평가', en: 'Assessment' },
        paragraphs: [
            {
                ko: '레닌은 1919년 5월 헝가리에서 프롤레타리아 독재로의 이행이 러시아보다 「비교할 수 없이 쉽고 평화로웠다」며, 부르주아 정부의 자발적 사퇴와 공산주의 강령에 따른 노동계급의 즉각적 통일을 높이 평가했다. 패배 뒤 평가는 달라졌다. 1920년 코민테른 제2차 대회를 위한 테제에서 그는 개량주의자들을 그대로 받아들이면 「서둘러 공산주의자라는 이름을 단 헝가리 사회민주당원들이 저지른 것과 같은 배신」이 되풀이된다고 경고했다. 같은 대회에서 그는 바르가의 책을 들어 프롤레타리아 독재가 헝가리 농촌을 거의 바꾸지 못했고 일용 노동자는 아무 변화를 보지 못했으며 소농은 아무것도 얻지 못했다고 지적했다. 몰수한 대토지의 일부라도 소농에게 넘기지 않으면 소농은 옛 질서와 소비에트 독재의 차이를 보지 못하고 프롤레타리아 국가는 권력을 지킬 수 없다는 것이었다.',
                en: 'In May 1919 Lenin held that the transition to the dictatorship of the proletariat had been “incomparably easier and more peaceful” in Hungary than in Russia, praising the voluntary resignation of the bourgeois government and the instantaneous unity of the working class on a communist programme. After the defeat his judgement changed. In his theses for the Second Congress of the Comintern in 1920 he warned that admitting reformists threatened “a repetition of the same acts of treachery as were perpetrated by the Hungarian Social-Democrats, who so hastily assumed the title of Communists”. At the same congress he cited Varga’s book to the effect that the proletarian dictatorship had hardly changed anything in the Hungarian countryside, that the day-labourers saw no changes and the small peasants got nothing; unless part of the confiscated estates went to the small peasants, he argued, they would see no difference between the old order and Soviet rule, and the proletarian state would be unable to retain power.',
                sources: [S.lenin0527, S.leninTheses, S.leninCongress],
            },
            {
                ko: '오늘날 헝가리 역사학에서는 공산당의 집권을 혁명보다 쿠데타에 가까운 것으로 보는 견해가 우세하다. 롬시치 이그나츠는 1918년 10월의 혁명이 거대한 대중운동을 동반한 것과 달리 1919년 3월의 권력 이양은 몇몇 지도자의 막후 합의로 「거의 쿠데타처럼」 이루어져 수도와 지방의 주민을 놀라게 했다고 쓴다. 다만 이 정권 교체가 외국군의 압박과 잇따른 각서·최후통첩 속에서 빠르게 동원할 군대가 절실해진 상황에서 일어났다는 점도 함께 지적된다. 이탈리아 외교관 출신의 역사가 알베르토 인델리카토는 붕괴의 원인을 협상국이나 백군의 개입이 아니라 체제 자신의 사회·경제 정책의 결함에서 찾는다. 반면 협상국의 봉쇄와 고립, 이웃 나라들과의 전쟁, 내전 중인 러시아 붉은군대와 손잡을 수 없었던 사정이 국내 개혁의 실패와 겹쳐 붕괴를 불렀다는 정리도 있다.',
                en: 'In Hungarian historiography the view now prevails that the Communist assumption of power was closer to a coup than a revolution. Ignác Romsics writes that whereas the October 1918 revolution was preceded and accompanied by elemental mass movements, the transfer of power in March 1919 came about “almost like a coup” through a behind-the-scenes agreement among a few leaders, surprising the population of the capital and the provinces alike. It is also pointed out, however, that the change took place under the pressure of foreign armies and successive notes and ultimatums, when a quickly mobilisable army had become urgently necessary. The Italian diplomat and historian Alberto Indelicato attributes the downfall not to intervention by the Entente or the Whites but to the regime’s own social and economic policies; other accounts see the Entente blockade and isolation, the wars with the neighbours and the impossibility of joining forces with the Red Army during the Russian Civil War compounding the failure of internal reform.',
                sources: [S.huhsr, S.kun, S.hsr],
            },
            {
                ko: '지도부의 상당수가 유대계였다는 사실은 붕괴 뒤 반유대주의를 부추겼다. 롬시치는 유대계 인민위원과 인민위원 대리의 비율이 60%, 아마도 70~75%에 이르렀다고 쓰지만, 헝가리 유대인 대다수는 볼셰비키 지지자가 아니었다. 헝가리 백색테러는 유대인 전체를 공산주의자로 몰아 약탈하고 학살했고, 미국 역사가 앤드루 C. 야노시는 그 테러가 붉은 경비대의 무작위 폭력보다 더 잔인했으며 사적 보복과 이득의 수단이 되었다고 평가한다. 공산당 정권은 1959년 법률로 평의회 공화국을 기념했지만 이 법은 1993년 폐지되었고, 2019년 11월 부다페스트에는 1934년 호르티 시대의 적색 테러 희생자 기념비가 복원되었다. 평의회 공화국의 인민위원이던 라코시는 1949~1956년 두 번째 공산주의 국가의 지도자가 되었고, 쿤은 1938년 소련의 대숙청 때 처형되었다.',
                en: 'The fact that many of the leaders were of Jewish origin fuelled antisemitism after the fall. Romsics writes that the share of commissars and deputy commissars of Jewish origin reached 60 and probably 70–75 per cent, yet most Hungarian Jews were not supporters of the Bolsheviks. The White Terror robbed and massacred Jews on the assumption that all were communists, and the American historian Andrew C. Janos judged that it was more savage than the random violence of the Red Guard and often became an instrument for settling personal accounts and for personal gain. The Communist regime enshrined the memory of the Republic of Councils in a law of 1959, which was repealed in 1993, and in November 2019 a reconstruction of a 1934 Horthy-era monument to the victims of the Red Terror was erected in Budapest. Rákosi, one of the republic’s commissars, led the second Communist state from 1949 to 1956, while Kun was executed in the Soviet Great Purge in 1938.',
                sources: [S.huhsr, S.horthy, S.whiteTerror, S.redTerror, S.hsr, S.kun],
            },
        ],
    },
];

const timeline = [
    ['1918.10.31', '과꽃 혁명', 'Aster Revolution', '병사평의회가 부다페스트의 요지를 장악했고 국왕은 카로이를 총리로 임명했다.', 'The Soldiers’ Council seized key points in Budapest and the king appointed Károlyi prime minister.', 'hungary', P(47.4925, 19.0514, '부다페스트', 'Budapest')],
    ['1918.11.16', '인민공화국 선포', 'People’s Republic proclaimed', '카를의 퇴진 선언 뒤 카로이가 임시 국가원수를 겸했다.', 'After Charles withdrew, Károlyi also became provisional head of state.', 'hungary'],
    ['1918.11.24', '헝가리 공산주의자당 창립', 'Party of Communists in Hungary founded', '모스크바에서 돌아온 쿤 벨러 등이 당을 세웠다.', 'Béla Kun and others back from Moscow founded the party.', ['hungary', 'soviet']],
    ['1919.02.20', '「네프서버」 습격과 쿤의 체포', '“Népszava” attack; Kun arrested', '7명이 죽었고 정부는 공산당 지도자들을 체포했다.', 'Seven people died and the government arrested the Communist leaders.', 'hungary'],
    ['1919.03.20', '빅스 각서', 'Vix note', '협상국이 헝가리군의 추가 철수를 요구했고 베린케이 내각이 사임했다.', 'The Entente demanded a further Hungarian withdrawal; the Berinkey cabinet resigned.', ['hungary', 'france']],
    ['1919.03.21', '합당과 평의회 공화국 선포', 'Merger and proclamation of the Republic of Councils', '사회민주당과 공산당이 합당하고 혁명통치평의회가 섰다.', 'Social Democrats and Communists merged and the Revolutionary Governing Council took office.', 'hungary'],
    ['1919.04.04', '스뮈츠 사절', 'Smuts mission', '협상국의 타협안을 혁명통치평의회가 조건부로 거부했다.', 'The Revolutionary Governing Council rejected the Entente’s compromise with conditions.', ['hungary', 'france']],
    ['1919.04.16', '루마니아군의 공세', 'Romanian offensive', '5월 1일까지 루마니아군이 티서강 동쪽을 차지했다.', 'By 1 May the Romanians held everything east of the Tisza.', ['romania', 'hungary']],
    ['1919.05.20', '북부 원정 시작', 'Northern campaign begins', '붉은군대가 미슈콜츠를 되찾고 체코슬로바키아군을 밀어냈다.', 'The Red Army retook Miskolc and pushed back the Czechoslovaks.', ['hungary', 'czechoslovakia'], P(48.1035, 20.7784, '미슈콜츠', 'Miskolc')],
    ['1919.05.30', '세게드 반혁명 정부', 'Counter-revolutionary government in Szeged', '호르티가 국방장관이자 국민군 사령관이 되었다.', 'Horthy became war minister and commander of the National Army.', ['hungary', 'france'], P(46.253, 20.1414, '세게드', 'Szeged')],
    ['1919.06.13', '클레망소 각서', 'Clemenceau note', '강화회의가 정한 국경 뒤로 붉은군대의 철수를 요구했다.', 'It ordered the Red Army back behind the frontiers fixed by the conference.', ['france', 'hungary']],
    ['1919.06.16', '슬로바키아 평의회 공화국', 'Slovak Soviet Republic', '프레쇼우에서 선포되어 7월 7일까지 존속했다.', 'Proclaimed in Prešov, it lasted until 7 July.', ['czechoslovakia', 'hungary'], P(48.9984, 21.2339, '프레쇼우', 'Prešov')],
    ['1919.06.24', '부다페스트 봉기 진압', 'Budapest rising crushed', '루도비커 생도와 모니터함의 반란이 하루 만에 진압되었다.', 'The rising of Ludovika cadets and river monitors was crushed within a day.', 'hungary'],
    ['1919.07.20', '티서 공세', 'Tisza offensive', '붉은군대의 마지막 공세가 루마니아군에 막혔다.', 'The Red Army’s last offensive was stopped by the Romanians.', ['hungary', 'romania']],
    ['1919.08.01', '혁명통치평의회 사퇴', 'Revolutionary Governing Council resigns', '인민위원들은 빈으로 떠났고 페이들의 노동조합 정부가 들어섰다.', 'The commissars left for Vienna and Peidl’s trade-union government took over.', ['hungary', 'austria'], P(48.2082, 16.3738, '빈', 'Vienna')],
    ['1919.08.04', '루마니아군의 부다페스트 입성', 'Romanian army enters Budapest', '전날 기병대에 이어 본대가 시내에서 행진했다.', 'After the cavalry the day before, the main force paraded through the city.', ['romania', 'hungary']],
    ['1919.08.06', '프리드리히의 쿠데타', 'Friedrich coup', '루마니아군을 등에 업은 우익 세력이 페이들 정부를 몰아냈다.', 'Right-wing forces backed by the Romanian army ousted the Peidl government.', ['hungary', 'romania']],
    ['1919.11', '국민군의 부다페스트 입성', 'National Army enters Budapest', '호르티가 국민군을 이끌고 수도에 들어왔다.', 'Horthy led the National Army into the capital.', 'hungary'],
];

const people = [
    ['bela-kun', 'leader', '외무 인민위원 · 실권자', 'Foreign commissar, de facto leader', '옥중에서 합당 조건을 정했고 외무 인민위원으로서 레닌과 직접 연락하며 평의회 공화국을 이끌었다.', 'Dictated the merger terms from prison and led the republic as foreign commissar in direct contact with Lenin.'],
    ['sandor-garbai', 'leader', '혁명통치평의회 의장', 'Chairman of the Revolutionary Governing Council', '합당을 지지했고 평의회 공화국의 법적 국가원수 겸 총리를 지냈다.', 'Backed the merger and served as the republic’s formal head of state and government.'],
    ['jeno-landler', 'participant', '내무 인민위원 · 붉은군대 지휘관', 'Interior commissar, Red Army commander', '감옥에서 쿤과 독재 도입에 합의했고 내무 인민위원과 북부 원정의 군단장을 지냈다.', 'Agreed the dictatorship with Kun in prison, then served as interior commissar and corps commander in the northern campaign.'],
    ['vilmos-bohm', 'participant', '국방 인민위원 · 붉은군대 총사령관', 'Defence commissar, Red Army commander-in-chief', '붉은군대를 지휘했고 7월 빈에서 협상국과 평의회 정부의 퇴진을 합의했다.', 'Commanded the Red Army and in July agreed with the Entente in Vienna on removing the council government.'],
    ['evgeny-varga', 'participant', '재무 인민위원 · 국민경제최고회의 의장', 'Finance commissar, chairman of the economic council', '재무 인민위원과 국민경제최고회의 의장으로 사회화를 이끌었고, 그의 책은 레닌의 농업 비판의 근거가 되었다.', 'Directed socialisation as finance commissar and economic council chairman; Lenin later cited his book on the agrarian failure.'],
    ['matyas-rakosi', 'participant', '사회적 생산 인민위원', 'Commissar for social production', '상업 인민위원 대리와 사회적 생산 인민위원을 지냈고 7월 말 붉은 경비대를 지휘했다.', 'Served as deputy trade commissar and commissar for social production and commanded the Red Guard in late July.'],
    ['gyorgy-lukacs', 'participant', '교육 인민위원 · 사단 정치위원', 'Education commissar, divisional commissar', '교육 인민위원으로 일하고 제5사단 정치위원으로 병사 8명을 처형하게 했으며, 붕괴 뒤 지하당을 맡았다.', 'Served as education commissar, had eight soldiers executed as Fifth Division commissar and stayed behind for the underground party.'],
    ['tibor-szamuely', 'executor', '군사 인민위원 대리', 'Deputy war commissar', '장갑열차와 레닌 소년단으로 적색 테러를 이끌었고 모스크바에서 레닌에게 군사 지원을 요청했다.', 'Led the Red Terror with his armoured train and the Lenin Boys, and asked Lenin for military help in Moscow.'],
    ['otto-korvin', 'executor', '정치조사국장', 'Head of the political investigation department', '옥중에서 합당 문서를 타자로 쳤고 정치경찰을 이끌었으며 붕괴 뒤 체포되어 처형되었다.', 'Typed the merger text in prison, ran the political police and was executed after the fall.'],
    ['lenin', 'participant', '소비에트 러시아 인민위원회의 의장', 'Chairman of Soviet Russia’s Council of People’s Commissars', '쿤과 무선으로 연락하며 공산당의 주도를 요구했고 패배 뒤 합당과 농업 정책을 비판했다.', 'Corresponded with Kun by radio, demanded Communist control and after the defeat criticised the merger and the agrarian policy.'],
    ['chicherin', 'participant', '소비에트 러시아 외무인민위원', 'Soviet Russian foreign commissar', '5월 1일 베사라비아 문제로 루마니아에 최후통첩을 보내 루마니아군을 티서강에 멈춰 세웠다.', 'His ultimatum to Romania over Bessarabia on 1 May helped halt the Romanians at the Tisza.'],
    ['podvoisky', 'participant', '우크라이나 군사인민위원', 'Ukrainian war commissar', '5월 키이우에서 서무엘리와 공동 작전을 협의했다.', 'Discussed joint operations with Szamuely in Kyiv in May.'],
    ['antonov-ovseenko', 'participant', '우크라이나 붉은군대 사령관', 'Ukrainian Red Army commander', '5월 키이우에서 서무엘리와 루마니아에 대한 공동 작전을 협의했다.', 'Discussed a joint operation against Romania with Szamuely in Kyiv in May.'],
    ['mihaly-karolyi', 'participant', '인민공화국 대통령', 'President of the People’s Republic', '빅스 각서로 정부가 무너졌고, 그의 명의로 권력을 프롤레타리아트에 넘긴다는 포고가 나왔다.', 'His government fell over the Vix note, and a proclamation in his name handed power to the proletariat.'],
    ['gyula-peidl', 'opponent', '노동조합 정부 총리', 'Prime minister of the trade-union government', '합당과 독재에 반대해 물러났고 8월 1일 총리가 되어 평의회 정부의 법령을 철회했다.', 'Opposed the merger and dictatorship, then as prime minister from 1 August revoked the council decrees.'],
    ['miklos-horthy', 'opponent', '세게드 정부 국방장관 · 국민군 사령관', 'Szeged war minister, National Army commander', '세게드 반혁명 정부의 국민군을 이끌었고 11월 부다페스트에 들어와 이듬해 섭정이 되었다.', 'Led the Szeged counter-revolutionary National Army, entered Budapest in November and became regent the next year.'],
];

const ev = event({
    id: 'hungarian-soviet-republic-1919',
    title: { ko: '헝가리 평의회 공화국', en: 'The Hungarian Soviet Republic' },
    period: '1918.10–1919.08',
    sortOrder: 38,
    question: {
        ko: '러시아에 이어 유럽에서 두 번째로 선포된 평의회 공화국은 왜 133일 만에 무너졌는가?',
        en: 'Why did the second soviet republic in Europe, after Russia, collapse after only 133 days?',
    },
    summary: {
        ko: '1918년 10월 과꽃 혁명으로 들어선 카로이의 인민공화국은 영토 상실과 경제난 속에 1919년 3월 빅스 각서로 무너졌고, 사회민주당과 공산당이 합당해 3월 21일 평의회 공화국을 선포했다. 거르버이 샨도르가 의장, 쿤 벨러가 실권자인 혁명통치평의회는 기업과 대토지를 사회화했지만 토지를 농민에게 나누지 않았고, 레닌 소년단의 적색 테러는 지지를 더 깎았다. 붉은군대는 북부 원정에서 이겼으나 클레망소 각서에 따라 물러났고, 7월 티서 공세가 실패하자 8월 1일 정부가 사퇴하고 루마니아군이 부다페스트에 들어왔다.',
        en: 'Károlyi’s People’s Republic, born of the Aster Revolution of October 1918, fell in March 1919 over the Vix note amid territorial losses and economic hardship, and the Social Democrats and Communists merged to proclaim the Republic of Councils on 21 March. The Revolutionary Governing Council, chaired by Sándor Garbai and led in practice by Béla Kun, socialised industry and the large estates but did not give land to the peasants, and the Red Terror of the Lenin Boys eroded its support further. The Red Army won the northern campaign but withdrew under the Clemenceau note; after the failure of the Tisza offensive in July the government resigned on 1 August and the Romanian army entered Budapest.',
    },
    outcome: {
        ko: '평의회 공화국의 붕괴 뒤 루마니아군이 헝가리 대부분을 점령했고, 페이들의 노동조합 정부는 엿새 만에 쫓겨났으며 호르티의 국민군이 권력을 잡아 헝가리 백색테러를 벌였다. 레닌과 코민테른은 사회민주당과의 합당과 토지 미분배를 패배의 교훈으로 삼았다.',
        en: 'After the republic’s fall the Romanian army occupied most of Hungary, Peidl’s trade-union government was ousted within six days, and Horthy’s National Army took power and carried out the White Terror. Lenin and the Comintern drew lessons from the merger with the Social Democrats and the failure to give land to the peasants.',
    },
    sections,
    timeline,
    locations: [
        ['부다페스트', 'Budapest', 47.4979, 19.0402, 'main'],
        ['세게드', 'Szeged', 46.253, 20.1414, 'place'],
        ['미슈콜츠', 'Miskolc', 48.1035, 20.7784, 'place'],
        ['프레쇼우', 'Prešov', 48.9984, 21.2339, 'place'],
        ['빈', 'Vienna', 48.2082, 16.3738, 'place'],
    ],
    countries: ['hungary', 'romania', 'czechoslovakia', 'soviet', 'austria', 'france'],
    relations: { related: ['german-revolution-1918-1919', 'comintern-founding-1919-1921', 'october-revolution'] },
    noAutoLink: ['백색테러', '백색 테러', '적색 테러', 'White Terror', 'Red Terror', 'Red Guard'],
    focus: { ko: '헝가리 평의회 공화국 혁명통치평의회', en: 'The Revolutionary Governing Council of the Hungarian Soviet Republic' },
    people,
});

const persons = [
    person({
        id: 'mihaly-karolyi',
        given: ['미하이', 'Mihály'], family: ['카로이', 'Károlyi'], nativeName: 'Károlyi Mihály', years: '1875–1955',
        epithet: ['과꽃 혁명으로 총리가 되고 헝가리 제1공화국 대통령을 지낸 자유주의 귀족',
            'Liberal aristocrat who came to power in the Aster Revolution and was president of the First Hungarian Republic'],
        bio: ['부유한 가톨릭 대귀족 가문 출신으로, 제1차 세계대전 중 즉각 강화를 요구한 의회 반전파를 이끌었다. 1918년 10월 과꽃 혁명으로 총리가 되었고, 11월 16일 인민공화국이 선포되자 임시 국가원수를 겸했으며 1919년 1월 대통령으로 인정되었다. 토지개혁의 본보기로 자기 가문의 영지를 소작인들에게 내주었다. 1919년 3월 빅스 각서로 정부가 무너진 뒤 평의회 공화국이 선포되었고, 7월 망명했다. 1946년 귀국해 1947~1949년 주프랑스 대사를 지냈으나 러이크 재판에 항의해 사임했고, 1955년 프랑스 방스에서 죽었다.',
            'Born into an extremely wealthy Catholic aristocratic family, he led the small anti-war faction in parliament that demanded an immediate peace during the First World War. The Aster Revolution of October 1918 made him prime minister; when the People’s Republic was proclaimed on 16 November he also became provisional head of state, and in January 1919 he was recognised as president. As an example for land reform he gave his family estates to his tenants. After his government fell over the Vix note in March 1919 the Soviet Republic was proclaimed, and in July he went into exile. He returned in 1946 and was ambassador to France from 1947 to 1949, resigning in protest at the Rajk trial, and died in Vence, France, in 1955.'],
        fate: ['natural', '자연사', 'Natural causes'],
        aliases: { ko: [], en: ['Michael Károlyi'] },
        sources: [S.karolyi, S.aster],
        facts: {
            years: [
                { claim: 'Born 4 March 1875 in Pest', locator: 'Early life', excerpt: 'Mihály Károlyi was born on March 4, 1875, in the Károlyi Palace in the aristocratic palace district of Pest.' },
                { claim: 'Died 19 March 1955 in Vence', locator: 'Post WW2', excerpt: 'He died in Vence, France, on 19 March 1955 at the age of 80.' },
            ],
            citizenship: { claim: 'Hungarian politician', locator: 'Lead', excerpt: 'was a Hungarian politician who served as a leader of the short-lived and unrecognized First Hungarian Republic from 1918 to 1919' },
            nationalOrigin: { claim: 'Hungarian aristocratic family', locator: 'Early life', excerpt: 'The Károlyi family were an illustrious, extremely wealthy, Catholic aristocratic family who had played an important role in Hungarian society since the 17th century.' },
            bio: [
                { claim: 'Led the anti-war faction', locator: 'World War I', excerpt: 'Károlyi became part of a small but very active pacifist anti-war maverick faction in the Hungarian parliament.' },
                { claim: 'Prime minister and president 1918–1919', locator: 'Lead', excerpt: 'He served as prime minister between 1 and 16 November 1918 and as president between 16 November 1918 and 21 March 1919.' },
                { claim: 'Gave his estates to tenants', locator: 'Leading the Democratic Republic', excerpt: 'To set an example, he gave all of his own vast family estates to his tenants.' },
                { claim: 'Ambassador to France, resigned over Rajk', locator: 'Post WW2', excerpt: 'In 1946, Károlyi, who by that time had become a socialist, returned to Hungary and from 1947 to 1949 served as the Hungarian Ambassador to France. In 1949, he resigned in protest over the show trial and execution of László Rajk.' },
            ],
        },
        activities: [
            { functionId: 'political-leadership', affiliationId: 'state-hungary', startYear: 1918, endYear: 1919, primary: true, claim: 'Prime minister and president of the First Hungarian Republic', locator: 'Lead', excerpt: 'He served as prime minister between 1 and 16 November 1918 and as president between 16 November 1918 and 21 March 1919.' },
            { functionId: 'diplomacy', affiliationId: 'state-hungary', startYear: 1947, endYear: 1949, claim: 'Hungarian ambassador to France', locator: 'Post WW2', excerpt: 'from 1947 to 1949 served as the Hungarian Ambassador to France' },
        ],
        career: [
            ['1910', '독립당 하원의원', 'Member of parliament for the Party of Independence'],
            ['1918', '헝가리 국민평의회 결성, 과꽃 혁명으로 총리', 'Formed the Hungarian National Council; prime minister after the Aster Revolution'],
            ['1918–1919', '인민공화국 임시 국가원수·대통령', 'Provisional head of state and president of the People’s Republic'],
            ['1919–1946', '망명(프랑스·영국)', 'Exile in France and Britain'],
            ['1947–1949', '주프랑스 헝가리 대사', 'Hungarian ambassador to France'],
        ],
    }),
    person({
        id: 'sandor-garbai',
        given: ['샨도르', 'Sándor'], family: ['거르버이', 'Garbai'], nativeName: 'Garbai Sándor', years: '1879–1947',
        epithet: ['평의회 공화국 혁명통치평의회 의장을 지낸 건설노동자 출신 사회민주주의자',
            'Bricklayer turned Social Democrat who chaired the Revolutionary Governing Council of the Hungarian Soviet Republic'],
        bio: ['키슈쿤할러스의 개신교 집안에서 자라 벽돌공으로 일하며 노동운동에 들어섰고, 1901년 사회민주당에 입당해 건설노동자 조합과 노동자보험기금을 이끌었다. 1919년 3월 21일 사회민주당과 공산당의 합당을 지지했고, 혁명통치평의회 의장으로서 평의회 공화국의 법적 국가원수 겸 총리가 되었으나 실권은 쿤 벨러에게 있었다. 붕괴 뒤 페이들 정부의 교육장관을 지냈고, 루마니아군에 붙잡혔다가 클루지에서 탈출해 브라티슬라바, 빈, 파리에서 망명 생활을 했다. 전후 귀국이 허락되지 않은 채 1947년 파리에서 죽었다.',
            'Raised in a Protestant family in Kiskunhalas, he worked as a bricklayer, joined the labour movement and in 1901 the Social Democratic Party, and led the building workers’ union and the Workers’ Insurance Fund. He backed the merger of the Social Democrats and Communists on 21 March 1919 and, as chairman of the Revolutionary Governing Council, became the Soviet Republic’s formal head of state and prime minister, though real power lay with Béla Kun. After the fall he was education minister in the Peidl government; captured by the Romanian army, he escaped from Cluj and lived in exile in Bratislava, Vienna and Paris. Refused permission to return after the war, he died in Paris in 1947.'],
        fate: ['natural', '자연사', 'Natural causes'],
        aliases: { ko: [], en: [] },
        sources: [S.garbai, S.huGarbai],
        facts: {
            years: { claim: 'Lived 1879–1947', locator: 'Lead', excerpt: 'Sándor Garbai (27 March 1879 – 7 November 1947) was a Hungarian socialist politician' },
            citizenship: { claim: 'Hungarian socialist politician', locator: 'Lead', excerpt: 'was a Hungarian socialist politician who was the de jure leader of the Hungarian Soviet Republic as both its head of state and prime minister in 1919' },
            nationalOrigin: { claim: 'Grew up in a Calvinist family in Kiskunhalas', locator: 'Életútja', excerpt: 'Kiskunhalasi református családban nőtt fel', source: S.huGarbai },
            bio: [
                { claim: 'Bricklayer family; joined MSZDP in 1901', locator: 'Life and political career', excerpt: 'Garbai was born into the family of a Protestant bricklayer. An active participant in the labor movement from a young age, he joined the Social Democratic Party of Hungary (MSZDP) in 1901 and quickly rose through its ranks.' },
                { claim: 'Backed the merger; head of state and prime minister', locator: 'Life and political career', excerpt: 'This led to the foundation of the Hungarian Soviet Republic, with Garbai as the Chairman of the Central Executive Council, both head of state and prime minister.' },
                { claim: 'Escaped Romanian captivity and emigrated', locator: 'Life and political career', excerpt: 'Fearing reprisals, Garbai escaped from Romanian captivity in Cluj and fled to Czechoslovakia and first in settled Bratislava and then emigrated to Vienna.' },
                { claim: 'Died in Paris', locator: 'Life and political career', excerpt: 'Garbai remained in Paris where he died on 7 November 1947.' },
            ],
        },
        activities: [
            { functionId: 'political-leadership', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, primary: true, claim: 'Chairman of the Revolutionary Governing Council', locator: 'Life and political career', excerpt: 'This led to the foundation of the Hungarian Soviet Republic, with Garbai as the Chairman of the Central Executive Council, both head of state and prime minister.' },
            { functionId: 'government', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, claim: 'Education minister in the Peidl government', locator: 'Emigrációban', excerpt: '1919. augusztus 1-jétől augusztus 6-áig közoktatásügyi miniszter a Peidl-kormányban.', source: S.huGarbai },
        ],
        career: [
            ['1901', '사회민주당 입당', 'Joined the Social Democratic Party'],
            ['1903', '건설노동자 전국연맹 의장', 'Chairman of the National Federation of Building Workers'],
            ['1908', '노동자보험기금 의장', 'Chairman of the Workers’ Insurance Fund'],
            ['1919', '혁명통치평의회 의장', 'Chairman of the Revolutionary Governing Council'],
            ['1919', '페이들 정부 교육장관', 'Education minister in the Peidl government'],
            ['1920–1947', '망명(브라티슬라바·빈·파리)', 'Exile in Bratislava, Vienna and Paris'],
        ],
    }),
    person({
        id: 'tibor-szamuely',
        given: ['티보르', 'Tibor'], family: ['서무엘리', 'Szamuely'], nativeName: 'Szamuely Tibor', years: '1890–1919',
        origin: { code: 'hungary', label: { ko: '헝가리 (유대계)', en: 'Hungary (Jewish)' } },
        epithet: ['평의회 공화국의 군사 인민위원 대리로 적색 테러와 레닌 소년단을 이끈 공산주의자',
            'Communist deputy war commissar of the Hungarian Soviet Republic and a leading figure of its Red Terror'],
        bio: ['니레지하저의 유대계 가정에서 태어난 언론인으로, 제1차 세계대전 중 러시아군의 포로가 되었다. 10월 혁명 뒤 모스크바에서 쿤 벨러와 함께 헝가리인 포로 공산주의자들을 조직했고, 1918년 12월 독일 스파르타쿠스단 창립에도 참여했다. 평의회 공화국에서 군사 인민위원 대리와 교육 인민위원을 지냈으며, 그의 무장대는 레닌 소년단으로 불렸다. 반혁명 혐의자를 재판 없이 처형한 적색 테러의 중심인물로, 5월 말에는 모스크바로 날아가 레닌을 만났다. 1919년 8월 2일 오스트리아 국경을 넘다 붙잡혀 죽었는데, 당국은 자살로 발표했다.',
            'Born to a Jewish family in Nyíregyháza, he became a journalist and was taken prisoner by Russia during the First World War. After the October Revolution he organised Communist Hungarian prisoners of war in Moscow with Béla Kun, and in December 1918 he took part in founding the Spartacist League in Germany. In the Soviet Republic he was deputy people’s commissar of war and commissar of public education, and his guards became known as the Lenin Boys. A central figure of the Red Terror, which executed suspected counter-revolutionaries without trial, he flew to Moscow in late May to see Lenin. He died on 2 August 1919 after being caught crossing into Austria; the authorities reported that he had shot himself.'],
        fate: ['suicide', '자살(이설 있음)', 'Suicide (disputed)'],
        aliases: { ko: [], en: [] },
        sources: [S.szamuely],
        facts: {
            years: { claim: 'Lived 1890–1919', locator: 'Lead', excerpt: 'Tibor Szamuely (December 27, 1890 – August 2, 1919) was a Hungarian communist politician and journalist' },
            citizenship: { claim: 'Hungarian communist politician', locator: 'Lead', excerpt: 'was a Hungarian communist politician and journalist who was Deputy People\'s Commissar of War and People\'s Commissar of Public Education during the Hungarian Soviet Republic' },
            nationalOrigin: { claim: 'Jewish family in Nyíregyháza', locator: 'Early life', excerpt: 'Born in Nyíregyháza, in northeastern Hungary, Szamuely was the oldest son of five children of a Jewish family.' },
            bio: [
                { claim: 'Prisoner of war; organised Hungarian POWs with Kun', locator: 'Political career', excerpt: 'In Moscow, he organised a communist group together with Béla Kun among the Hungarian prisoners of war.' },
                { claim: 'Spartacist League', locator: 'Political career', excerpt: 'Szamuely later went to Germany and in December 1918, he participated in the formation of the Spartacist League, with Karl Liebknecht and Rosa Luxemburg.' },
                { claim: 'Red Terror and Lenin Boys', locator: 'Political career', excerpt: 'He became a figure of the so-called "Red Terror" of Hungary. Szamuely\'s guards became nicknamed the "Lenin Boys" or "Lenin Youth".' },
                { claim: 'Death at the Austrian border', locator: 'Later life', excerpt: 'Both Hungarian and Austrian authorities reported that Szamuely had shot himself while the Communist partisan who smuggled him across the border was searched.' },
            ],
        },
        activities: [
            { functionId: 'military', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, primary: true, claim: 'Deputy People\'s Commissar of War', locator: 'Lead', excerpt: 'was a Hungarian communist politician and journalist who was Deputy People\'s Commissar of War and People\'s Commissar of Public Education during the Hungarian Soviet Republic' },
            { functionId: 'security', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, claim: 'Led the Red Terror', locator: 'Political career', excerpt: 'He became a figure of the so-called "Red Terror" of Hungary.' },
            { functionId: 'organizing', affiliationId: 'party-hungarian-communist', startYear: 1919, endYear: 1919, claim: 'Member of the KMP Central Committee', locator: 'Political career', excerpt: 'He became a member of the Central Committee of the Hungarian Communist Party and joined the editing of the Red Paper.' },
        ],
        career: [
            ['1915', '러시아군 포로', 'Captured by the Russian army'],
            ['1918', '모스크바에서 헝가리인 포로 공산주의 그룹 조직', 'Organised the Hungarian POW Communist group in Moscow'],
            ['1918', '스파르타쿠스단 창립 참여', 'Took part in founding the Spartacist League'],
            ['1919', '헝가리 공산주의자당 중앙위원', 'Member of the KMP Central Committee'],
            ['1919', '군사 인민위원 대리, 교육 인민위원', 'Deputy war commissar; commissar of public education'],
        ],
    }),
    person({
        id: 'jeno-landler',
        given: ['예뇌', 'Jenő'], family: ['런들레르', 'Landler'], nativeName: 'Landler Jenő', years: '1875–1928',
        origin: { code: 'hungary', label: { ko: '헝가리 (유대계)', en: 'Hungary (Jewish)' } },
        epithet: ['평의회 공화국의 내무 인민위원이자 붉은군대 지휘관을 지낸 노동 변호사 출신 공산주의자',
            'Labour lawyer turned Communist who was interior commissar and a Red Army commander in the Hungarian Soviet Republic'],
        bio: ['겔세의 유대계 가정에서 태어난 변호사로, 철도노동자 연맹의 법률고문으로서 1904년 전국 철도 파업 지도자들을 변호했다. 1908년 사회민주당에 들어갔고 점차 좌경화해 공산주의자가 되었다. 1919년 3월 감옥에서 쿤 벨러와 프롤레타리아 독재 도입에 합의했고, 평의회 공화국에서 내무·상업 인민위원을 지낸 뒤 붉은군대 제3군단장으로 북부 원정을 지휘했으며 7월에는 총사령관이 되었다. 붕괴 뒤 오스트리아로 망명해 망명 공산주의 운동을 이끌었다. 1928년 칸에서 죽었고 유골은 크렘린 벽에 안치되었다.',
            'Born to a Jewish family in Gelse, he became a lawyer and, as legal adviser to the railway workers’ federation, defended the leaders of the national railway strike in 1904. He joined the Social Democratic Party in 1908 and moved steadily left until he became a Communist. In March 1919 he agreed with Béla Kun in prison on introducing the dictatorship of the proletariat; in the Soviet Republic he was commissar for the interior and for trade, then commanded the Red Army’s III Corps in the northern campaign and became commander-in-chief in July. After the fall he emigrated to Austria and led the exiled Communist movement. He died in Cannes in 1928, and his ashes were placed in the Kremlin Wall.'],
        fate: ['natural', '심부전', 'Heart failure'],
        aliases: { ko: [], en: [] },
        sources: [S.landler, S.huLandler, S.huhsr],
        facts: {
            years: { claim: 'Lived 1875–1928', locator: 'Lead', excerpt: 'Jenő Landler (23 November 1875 – 25 February 1928) was a Hungarian politician and socialist leader.' },
            citizenship: { claim: 'Hungarian politician', locator: 'Lead', excerpt: 'was a Hungarian politician and socialist leader' },
            nationalOrigin: { claim: 'Jewish family', locator: 'Lead', excerpt: 'Born in to a Jewish family, he studied to be a lawyer' },
            bio: [
                { claim: 'Railway workers’ lawyer; 1904 strike', locator: 'Életpályája', excerpt: 'Miután megszerezte diplomáját, kinevezték a Magyar Vasutas Szövetség jogtanácsosának.', source: S.huLandler },
                { claim: 'Commissar and Red Army commander', locator: 'Életpályája', excerpt: 'Szociáldemokrata politikusként a Tanácsköztársaság idején belügyi és kereskedelmi népbiztos, majd a magyar Vörös Hadsereg 3. hadtestének parancsnoka', source: S.huLandler },
                { claim: 'Agreed with Kun in prison', locator: 'Előzményei, kikiáltása', excerpt: 'Landler Jenő a Gyűjtőfogházban megegyezett Kun Béláékkal a proletárdiktatúra bevezetéséről', source: S.huhsr },
                { claim: 'Exile and death', locator: 'Lead', excerpt: 'Jenő Landler died in 1928 in exile in Cannes. His ashes were taken to Moscow and placed in the Kremlin wall.' },
            ],
        },
        activities: [
            { functionId: 'government', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, primary: true, claim: 'People’s commissar of interior affairs', locator: 'Lead', excerpt: 'After the Hungarian Revolution of 1919, he became people\'s commissar of interior affairs in the new communist government.' },
            { functionId: 'military', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, claim: 'Red Army commander', locator: 'Lead', excerpt: 'He was also a commander of the Hungarian Red Army fighting the foreign troops of the interventionists.' },
        ],
        career: [
            ['1904', '철도 파업 지도자 변호', 'Defended the leaders of the railway strike'],
            ['1908', '사회민주당 입당', 'Joined the Social Democratic Party'],
            ['1919', '내무·상업 인민위원', 'Commissar for the interior and for trade'],
            ['1919', '붉은군대 제3군단장, 7월 총사령관', 'Commander of III Corps; commander-in-chief from July'],
            ['1919–1928', '오스트리아 망명, 망명 공산주의 운동 지도', 'Exile in Austria; leader of the exiled Communist movement'],
        ],
    }),
    person({
        id: 'vilmos-bohm',
        given: ['빌모시', 'Vilmos'], family: ['뵘', 'Böhm'], nativeName: 'Böhm Vilmos', years: '1880–1949',
        origin: { code: 'hungary', label: { ko: '헝가리 (유대계)', en: 'Hungary (Jewish)' } },
        epithet: ['평의회 공화국의 국방 인민위원이자 붉은군대 총사령관을 지낸 사회민주당 지도자',
            'Social Democratic leader who was defence commissar and Red Army commander-in-chief of the Hungarian Soviet Republic'],
        bio: ['부다페스트의 유대계 가정에서 태어난 기계공으로, 금속노동자 조합 서기를 거쳐 사회민주당 지도부에 들어갔다. 1919년 1월 베린케이 정부의 국방장관이 되었고, 공산당과의 합당 협상에 참여했다. 평의회 공화국에서 국방 인민위원과 붉은군대 총사령관을 지냈고, 7월 빈 주재 공사로 가서 사회민주당 지도부의 위임으로 협상국 사절단과 평의회 정부의 퇴진을 합의했다. 망명 뒤 빈, 체코슬로바키아, 스웨덴에서 살았고, 1946~1948년 스웨덴 주재 헝가리 공사를 지내다 사회민주당이 공산당에 통합되자 사임했다. 1949년 스톡홀름에서 죽었다.',
            'Born to a middle-class Jewish family, he trained as a mechanic and rose through the iron and metal workers’ union to the Social Democratic leadership. He became war minister in the Berinkey government in January 1919 and took part in the merger talks with the Communists. In the Soviet Republic he was defence commissar and commander-in-chief of the Red Army, and in July, as envoy in Vienna, he agreed with the Entente missions, on behalf of the Social Democratic leadership, on removing the council government. In exile he lived in Vienna, Czechoslovakia and Sweden; he headed the Hungarian legation in Sweden from 1946 to 1948 and resigned when the Social Democrats were merged into the Communist Party. He died in Stockholm in 1949.'],
        fate: ['natural', '자연사', 'Natural causes'],
        aliases: { ko: [], en: ['Wilhelm Böhm'] },
        sources: [S.bohm, S.huBohm],
        facts: {
            years: { claim: 'Lived 1880–1949', locator: 'Lead', excerpt: '6 January 1880 – 28 October 1949' },
            citizenship: { claim: 'Hungarian Social Democrat and ambassador', locator: 'Lead', excerpt: 'was a Hungarian Social Democrat and Hungary\'s ambassador to Sweden after World War II' },
            nationalOrigin: { claim: 'Middle-class Jewish family', locator: 'Biography', excerpt: 'He was born to a middle-class Jewish family.' },
            bio: [
                { claim: 'Metal workers’ union secretary', locator: 'Biography', excerpt: 'He became involved in the labour movement at an early stage in his career, assuming the role of secretary of the National Federation of Iron and Metal Workers.' },
                { claim: 'War minister, Red Army commander', locator: 'Biography', excerpt: 'In April, Böhm assumed the role of Commander-in-Chief of the Red Army.' },
                { claim: 'Agreed with the Entente on removing the council government', locator: 'Életpályája', excerpt: 'megegyezik az antantmissziókkal a tanácskormány eltávolításáról', source: S.huBohm },
                { claim: 'Envoy in Sweden, resigned after the merger', locator: 'Életpályája', excerpt: 'Az MSZDP és az MKP egyesülése után lemondott tisztéről és 1948-tól ismét mint emigráns élt Stockholmban.', source: S.huBohm },
            ],
        },
        activities: [
            { functionId: 'military', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, primary: true, claim: 'Commander-in-chief of the Red Army', locator: 'Biography', excerpt: 'In April, Böhm assumed the role of Commander-in-Chief of the Red Army.' },
            { functionId: 'government', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, claim: 'War minister in the Berinkey government', locator: 'Biography', excerpt: 'in January 1919 he assumed the role of Minister of Defense in the Berinkey Government' },
            { functionId: 'diplomacy', affiliationId: 'state-hungary', startYear: 1946, endYear: 1948, claim: 'Head of the Hungarian legation in Sweden', locator: 'Életpályája', excerpt: '1946. május 1-jétől ismét Svédországban dolgozott, a magyar követség vezetője lett', source: S.huBohm },
        ],
        career: [
            ['1911', '노동조합 평의회 위원', 'Member of the Trade Union Council'],
            ['1919', '베린케이 정부 국방장관', 'War minister in the Berinkey government'],
            ['1919', '국방 인민위원, 붉은군대 총사령관', 'Defence commissar and Red Army commander-in-chief'],
            ['1919', '빈 주재 공사', 'Envoy in Vienna'],
            ['1946–1948', '스웨덴 주재 헝가리 공사', 'Head of the Hungarian legation in Sweden'],
        ],
    }),
    person({
        id: 'otto-korvin',
        given: ['오토', 'Ottó'], family: ['코르빈', 'Korvin'], nativeName: 'Korvin Ottó', years: '1894–1919',
        origin: { code: 'hungary', label: { ko: '헝가리 (유대계)', en: 'Hungary (Jewish)' } },
        epithet: ['평의회 공화국 정치조사국장으로 정치경찰을 이끈 공산주의자',
            'Communist who ran the political police of the Hungarian Soviet Republic as head of its political investigation department'],
        bio: ['부유한 유대계 가정에서 태어나 갈릴레이 서클에서 활동했고, 은행원으로 일하며 1918년 반군국주의 혁명적 사회주의자 지하조직을 이끌었다. 헝가리 공산주의자당 창립에 참여해 중앙위원이 되었고, 1919년 3월 21일 옥중에서 두 당의 합당 문서를 타자로 쳤다. 평의회 공화국에서 상점 사회화를 맡은 뒤 내무 인민위원부 정치조사국장으로 반혁명 혐의자를 추적했다. 붕괴 뒤 루카치 죄르지와 함께 지하당 재건을 맡았다가 체포되어 고문을 받았고, 1919년 12월 교수형에 처해졌다.',
            'Born into a wealthy, enlightened Jewish family, he was active in the Galileo Circle and, while working as a bank official, led the illegal anti-militarist group of revolutionary socialists in 1918. He helped found the Party of Communists in Hungary and joined its Central Committee, and on 21 March 1919 he typed the text of the merger of the two parties in prison. In the Soviet Republic he first handled the socialisation of shops and then, as head of the political investigation department of the interior commissariat, hunted suspected counter-revolutionaries. After the fall he stayed behind with György Lukács to rebuild the underground party, was arrested and tortured, and was hanged in December 1919.'],
        fate: ['executed', '처형', 'Executed'],
        aliases: { ko: ['클레인 오토 (본명)'], en: ['Ottó Klein (birth name)'] },
        sources: [S.korvin],
        facts: {
            years: { claim: 'Lived 1894–1919', locator: 'Lead', excerpt: 'Ottó Korvin (born Ottó Klein; 24 May 1894 – 28 December 1919) was a Hungarian communist who was politically active in the Hungarian Soviet Republic.' },
            citizenship: { claim: 'Hungarian communist', locator: 'Lead', excerpt: 'was a Hungarian communist who was politically active in the Hungarian Soviet Republic' },
            nationalOrigin: { claim: 'Jewish family', locator: 'Biography', excerpt: 'Born into a wealthy, enlightened Jewish family' },
            bio: [
                { claim: 'Led the anti-militarist group', locator: 'Biography', excerpt: 'He became this group\'s leader and remained so when the Galileo Circle was again legalized after the Aster Revolution.' },
                { claim: 'Typed the merger text in prison', locator: 'Biography', excerpt: 'In prison on March 21, he typed the text on the merger of the two parties (MSZDP and KMP).' },
                { claim: 'Head of the political department', locator: 'Lead', excerpt: 'He served as the chief of the Political Department of Internal Affairs.' },
                { claim: 'Arrested and hanged', locator: 'Lead', excerpt: 'After the fall of the Hungarian Soviet Republic, Korvin was arrested by counter-revolutionary forces and hanged.' },
            ],
        },
        activities: [
            { functionId: 'security', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, primary: true, claim: 'Chief of the Political Department of Internal Affairs', locator: 'Lead', excerpt: 'He served as the chief of the Political Department of Internal Affairs.' },
            { functionId: 'organizing', affiliationId: 'party-hungarian-communist', startYear: 1918, endYear: 1919, claim: 'Co-founder and Central Committee member of the KMP', locator: 'Biography', excerpt: 'He participated in the establishment of the Communist Party (KMP) and then became a member of the Central Committee.' },
        ],
        career: [
            ['1917', '갈릴레이 서클·반군국주의 운동 참여', 'Joined the Galileo Circle and the anti-militarist movement'],
            ['1918', '헝가리 공산주의자당 창립, 중앙위원', 'Co-founded the KMP; Central Committee member'],
            ['1919', '상점 사회화 담당', 'In charge of socialising shops'],
            ['1919', '내무 인민위원부 정치조사국장', 'Head of the political investigation department'],
        ],
    }),
    person({
        id: 'gyula-peidl',
        given: ['줄러', 'Gyula'], family: ['페이들', 'Peidl'], nativeName: 'Peidl Gyula', years: '1873–1943',
        epithet: ['평의회 공화국 붕괴 뒤 엿새 동안 「노동조합 정부」를 이끈 인쇄공 출신 사회민주당 지도자',
            'Printer and Social Democratic leader who headed the six-day “trade-union government” after the fall of the Soviet Republic'],
        bio: ['죄르 주 러버즈드의 정육점 집안에서 태어난 식자공으로, 인쇄노동자 조합과 소비협동조합을 이끌고 1909년 사회민주당 지도부에 들어갔다. 1919년 베린케이 정부의 노동·복지장관을 지냈고, 공산당과의 합당과 프롤레타리아 독재 선포에 반대해 당직에서 물러났다. 1919년 8월 1일 평의회 정부가 사퇴하자 총리가 되어 평의회 공화국을 폐지하고 그 법령을 철회했지만, 8월 6일 루마니아군의 지원을 받은 프리드리히 이슈트반에게 쫓겨났다. 그 뒤 사회민주당 재건에 참여했고 1922~1931년 국회의원을 지냈다.',
            'Born in Ravazd in Győr County, the son of a butcher, he became a typesetter, led the printers’ union and the consumer co-operative movement, and joined the Social Democratic leadership in 1909. He was labour and welfare minister in the Berinkey government in 1919 and resigned his party posts in opposition to the merger with the Communists and the proclamation of the dictatorship of the proletariat. When the council government resigned on 1 August 1919 he became prime minister, abolished the Soviet Republic and revoked its decrees, but on 6 August he was ousted by István Friedrich with Romanian backing. He then helped rebuild the Social Democratic Party and sat in parliament from 1922 to 1931.'],
        fate: ['natural', '자연사', 'Natural causes'],
        aliases: { ko: [], en: [] },
        sources: [S.peidl, S.huPeidl],
        facts: {
            years: { claim: 'Lived 1873–1943', locator: 'Lead', excerpt: 'Gyula Peidl (4 April 1873 – 22 January 1943) was a Hungarian trade union leader and social democrat politician' },
            citizenship: { claim: 'Hungarian trade union leader', locator: 'Lead', excerpt: 'was a Hungarian trade union leader and social democrat politician who served as prime minister and acting head of state of Hungary for 6 days in August 1919' },
            nationalOrigin: { claim: 'Born in Ravazd, Győr County', locator: 'Early life and career', excerpt: 'Gyula Peidl was born on 4 April 1873 in Ravazd, Győr County.' },
            bio: [
                { claim: 'Butcher’s son, typesetter', locator: 'Early life and career', excerpt: 'His father, a butcher, died early, thus Peidl was raised by his mother.' },
                { claim: 'Labour minister; opposed the merger', locator: 'Early life and career', excerpt: 'In opposition to the union of the party with the Party of Communists in Hungary (KMP) at the beginning of the Hungarian Soviet Republic, he resigned his position in the leadership' },
                { claim: 'Dissolved the Soviet Republic', locator: 'His government', excerpt: 'At its first meeting on 2 August 1919, it officially dissolved the Hungarian Soviet Republic and declared again the Hungarian People\'s Republic' },
                { claim: 'Ousted by Friedrich; MP 1922–1931', locator: 'Politikusi szerepe', excerpt: '1922-től 1931-ig nemzetgyűlési, illetve országgyűlési képviselő volt.', source: S.huPeidl },
            ],
        },
        activities: [
            { functionId: 'political-leadership', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, primary: true, claim: 'Prime minister for six days in August 1919', locator: 'Lead', excerpt: 'served as prime minister and acting head of state of Hungary for 6 days in August 1919' },
            { functionId: 'government', affiliationId: 'state-hungary', startYear: 1919, endYear: 1919, claim: 'Minister of Labour and Welfare', locator: 'Early life and career', excerpt: 'he was Minister of Labour and Welfare in the government of Dénes Berinkey' },
            { functionId: 'legislature', affiliationId: 'state-hungary', startYear: 1922, endYear: 1931, claim: 'Member of parliament 1922–1931', locator: 'Politikusi szerepe', excerpt: '1922-től 1931-ig nemzetgyűlési, illetve országgyűlési képviselő volt.', source: S.huPeidl },
        ],
        career: [
            ['1900–1918', '인쇄노동자 주간지 『티포그라피아』 편집', 'Editor of the printers’ weekly Typographia'],
            ['1909', '사회민주당 지도부', 'Social Democratic Party leadership'],
            ['1919', '베린케이 정부 노동·복지장관', 'Labour and welfare minister in the Berinkey government'],
            ['1919', '「노동조합 정부」 총리', 'Prime minister of the “trade-union government”'],
            ['1922–1931', '국회의원', 'Member of parliament'],
        ],
    }),
];

const terms = [
        term({
        id: 'lenin-boys', ko: '레닌 소년단', en: 'Lenin Boys', category: 'repression',
        period: '1919', startYear: 1919, endYear: 1919,
        definition: ['헝가리 평의회 공화국 시기인 1919년 반혁명 진압에 동원된 공산당의 무장대. 체르니 요제프가 조직한 약 200명이 이렇게 자칭했고, 서무엘리 티보르의 장갑열차를 타고 전국을 돌며 반혁명 혐의자를 재판 없이 처형했다.',
            'The Communist paramilitary used to crush counter-revolution in the Hungarian Soviet Republic in 1919. Some two hundred men organised by József Cserny called themselves by this name; travelling the country on Tibor Szamuely’s armoured train, they executed suspected counter-revolutionaries without trial.'],
        body: ['레닌 소년단은 반혁명이 의심되는 마을에서 인질을 잡고 처형했으며 농촌에서 식량을 징발했고, 6월의 칼로처 일대 농민 봉기를 유혈 진압했다. 사회민주당 출신 인민위원들의 요구로 국방 인민위원 뵘 빌모시가 4월 말 해산을 명령했고, 5월 19일 군이 괴될뢰에서 체르니 부대를 무장해제했지만 일부는 코르빈 오토의 정치조사국에 들어갔다.\n\n평의회 공화국 시기 테러의 사망자는 자료에 따라 300~600명, 또는 590명으로 추산된다. 평의회 공화국 붕괴 뒤 체르니와 대원 13명이 재판을 받고 1919년 12월 처형되었다.',
            'The Lenin Boys took and executed hostages in villages suspected of counter-revolution, requisitioned food in the countryside and bloodily suppressed the peasant rising around Kalocsa in June. At the demand of the commissars who had been Social Democrats, the defence commissar Vilmos Böhm ordered them dissolved at the end of April, and on 19 May the army disarmed the Cserny group at Gödöllő, though some of its men joined Ottó Korvin’s political investigation department.\n\nEstimates of the dead of the Soviet Republic’s terror range from 300–600 to 590. After the fall of the Soviet Republic Cserny and thirteen of his men were tried and executed in December 1919.'],
        aliases: { ko: [], en: ['Lenin-fiúk', 'Lenin Youth'] },
        people: ['tibor-szamuely', 'otto-korvin', 'vilmos-bohm', 'bela-kun'],
        events: ['hungarian-soviet-republic-1919'],
        sources: [S.leninBoys, S.redTerror, S.huhsr, S.szamuely, S.kun], locator: 'Lead; History; Execution',
    }),
    term({
        id: 'aster-revolution', ko: '과꽃 혁명', en: 'Aster Revolution', category: 'party-state',
        period: '1918', startYear: 1918, endYear: 1918,
        definition: ['1918년 10월 말 부다페스트에서 일어나 카로이 미하이를 총리로 세우고 헝가리 인민공화국 수립으로 이어진 혁명. 병사들이 모자의 장미 대신 과꽃(애스터)을 꽂은 데서 이름이 나왔다.',
            'The revolution in Budapest at the end of October 1918 that made Mihály Károlyi prime minister and led to the Hungarian People’s Republic. It takes its name from the asters soldiers wore in their caps in place of the rose.'],
        body: ['10월 23일 카로이의 독립당과 급진당, 사회민주당이 헝가리 국민평의회를 세웠고, 10월 30일 국왕이 허디크 야노시를 총리로 임명하자 병사평의회가 부다페스트의 요지를 장악했다. 10월 31일 카로이가 총리가 되었고 같은 날 전 총리 티서 이슈트반이 살해되었다. 11월 16일 인민공화국이 선포되었다.\n\n카로이 정부는 군을 해산하고 협상국의 선의에 기대를 걸었지만 이웃 나라 군대의 점령으로 영토의 대부분을 잃었고, 1919년 3월 빅스 각서로 무너져 헝가리 평의회 공화국에 자리를 내주었다.',
            'On 23 October Károlyi’s Independence Party, the Radicals and the Social Democrats formed the Hungarian National Council, and when the king appointed János Hadik prime minister on 30 October the Soldiers’ Council seized key points in Budapest. Károlyi became prime minister on 31 October, the day the former premier István Tisza was killed, and the People’s Republic was proclaimed on 16 November.\n\nThe Károlyi government disbanded the army and relied on Entente goodwill, but lost most of the country to occupation by neighbouring armies; it fell over the Vix note in March 1919 and gave way to the Hungarian Soviet Republic.'],
        aliases: { ko: ['애스터 혁명', '국화 혁명'], en: ['Chrysanthemum Revolution', 'Őszirózsás forradalom'] },
        people: ['mihaly-karolyi', 'vilmos-bohm'],
        events: ['hungarian-soviet-republic-1919'],
        sources: [S.aster, S.koAster, S.firstRep], locator: 'Lead; Events; Aftermath',
    }),
    term({
        id: 'slovak-soviet-republic', ko: '슬로바키아 평의회 공화국', en: 'Slovak Soviet Republic', category: 'party-state',
        period: '1919', startYear: 1919, endYear: 1919,
        definition: ['헝가리 붉은군대의 북부 원정 중인 1919년 6월 16일 프레쇼우에서 선포되어 7월 7일까지 존속한 공산주의 국가. 체코인 언론인 안토닌 야노우셰크가 수반이었고 헝가리 평의회 공화국에 의존했다.',
            'A Communist state proclaimed in Prešov on 16 June 1919, during the Hungarian Red Army’s northern campaign, which lasted until 7 July. Headed by the Czech journalist Antonín Janoušek, it depended on the Hungarian Soviet Republic.'],
        body: ['생산수단의 사회화와 노동자 20명 이상의 공장·대토지·금융기관의 국유화를 포고하고 혁명재판소와 붉은군대, 붉은 경비대를 세웠지만, 헝가리의 일부인지 독립국인지, 국경이 어디인지는 끝내 분명하지 않았다. 체코 역사가 야로슬라프 셰베크는 이를 슬로바키아에서 헝가리의 영향력을 되살리려는 덮개로도 본다.\n\n클레망소 각서에 따라 헝가리군이 6월 말부터 분계선 뒤로 물러나면서 소멸했고, 그 영토는 체코슬로바키아에 편입되었다.',
            'It decreed the socialisation of the means of production and the nationalisation of factories with more than twenty workers, large estates and financial institutions, and set up revolutionary tribunals, a Red Army and a red guard, but whether it was part of Hungary or independent, and where its borders lay, was never settled. The Czech historian Jaroslav Šebek sees it partly as a cover for renewing Hungarian influence in Slovakia.\n\nIt disappeared when Hungarian troops withdrew behind the demarcation line from late June under the Clemenceau note, and its territory was incorporated into Czechoslovakia.'],
        aliases: { ko: ['슬로바키아 소비에트 공화국'], en: ['Slovak Republic of Councils', 'Slovenská republika rád'] },
        people: ['bela-kun'],
        events: ['hungarian-soviet-republic-1919'],
        sources: [S.slovak, S.hcWar, S.huhsr], locator: 'Lead; History',
    }),
];

module.exports = { event: ev, people: persons, terms };
