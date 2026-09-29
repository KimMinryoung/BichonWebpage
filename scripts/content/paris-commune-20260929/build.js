#!/usr/bin/env node
// Paris Commune event batch (2026-09-29). Source of truth for
// ../paris-commune-20260929.json (event + relations) and
// ../paris-commune-20260929-people.json (new people for commulingo-people-upsert).
// Edit here, run `node build.js`, commit the JSON with it.
const fs = require('fs');
const path = require('path');

const W = t => 'https://en.wikipedia.org/wiki/' + t;
const D = f => `https://www.marxists.org/history/france/paris-commune/documents/${f}.htm`;
const S = {
    fpw: W('Franco-Prussian_War'),
    sedan: W('Battle_of_Sedan'),
    gnd: W('Government_of_National_Defense'),
    siege: W('Siege_of_Paris_(1870%E2%80%931871)'),
    empire: W('Proclamation_of_the_German_Empire'),
    pc: W('Paris_Commune'),
    pcKo: 'https://ko.wikipedia.org/wiki/%ED%8C%8C%EB%A6%AC_%EC%BD%94%EB%AE%8C',
    election: W('1871_French_legislative_election'),
    thiers: W('Adolphe_Thiers'),
    guard: W('National_Guard_(France)'),
    michel: W('Louise_Michel'),
    constituted: D('constituted'),
    manifesto: D('manifesto'),
    churchState: D('church-state'),
    frankel: W('Le%C3%B3_Frankel'),
    varlin: W('Eug%C3%A8ne_Varlin'),
    union: W('Union_des_femmes_pour_la_d%C3%A9fense_de_Paris_et_les_soins_aux_bless%C3%A9s'),
    workingWomen: D('working-women'),
    courbet: W('Gustave_Courbet'),
    vendome: W('Vend%C3%B4me_Column'),
    reprisals: D('reprisals'),
    cps: W('Committee_of_Public_Safety_(1871)'),
    delescluze: W('Louis_Charles_Delescluze'),
    frankfurt: W('Treaty_of_Frankfurt_(1871)'),
    lyon: W('Lyon_Commune'),
    marseille: W('Marseille_Commune'),
    semaine: W('Semaine_sanglante'),
    dabrowski: W('Jaros%C5%82aw_D%C4%85browski'),
    darboy: W('Georges_Darboy'),
    wall: W('Communards%27_Wall'),
    thiersCircular: D('thiers-victory'),
    macmahon: W('Patrice_de_MacMahon'),
    sacreCoeur: W('Sacr%C3%A9-C%C5%93ur,_Paris'),
    civilWarWiki: W('The_Civil_War_in_France'),
    civilWarCh5: 'https://www.marxists.org/archive/marx/works/1871/civil-war-france/ch05.htm',
    engels1891: 'https://www.marxists.org/archive/marx/works/1871/civil-war-france/postscript.htm',
    kugelmann: 'https://www.marxists.org/archive/marx/works/1871/letters/71_04_12.htm',
    bakunin: 'https://www.marxists.org/reference/archive/bakunin/works/1871/paris-commune.htm',
    bebel: W('August_Bebel'),
    lenin1908: 'https://www.marxists.org/archive/lenin/works/1908/mar/23.htm',
    lenin1917: 'https://www.marxists.org/archive/lenin/works/1917/staterev/ch03.htm',
    lissagaray: W('Prosper-Olivier_Lissagaray'),
    lissagarayBook: 'https://www.marxists.org/history/france/archive/lissagaray/index.htm',
    internationale: W('The_Internationale'),
    pottier: W('Eug%C3%A8ne_Pottier'),
};

const sections = [
    {
        heading: { ko: '제국의 패전과 포위된 파리', en: 'The fall of the Empire and the siege of Paris' },
        paragraphs: [
            {
                ko: '1870년 7월 나폴레옹 3세의 제2제정은 프로이센에 전쟁을 선포했지만, 9월 2일 스당에서 황제가 10만 명의 군대와 함께 항복했다. 9월 4일 파리 군중이 입법원에 몰려들자 공화파 의원들은 시청에서 공화국을 선포하고 트로쉬 장군을 수반으로 하는 국민방위정부를 세웠다.',
                en: 'Napoleon III’s Second Empire declared war on Prussia in July 1870, but on 2 September the emperor surrendered at Sedan with an army of about a hundred thousand. When crowds invaded the Legislative Body on 4 September, republican deputies proclaimed the Republic at the Hôtel de Ville and set up a Government of National Defence under General Trochu.',
                sources: [S.fpw, S.sedan, S.gnd],
            },
            {
                ko: '9월 19~20일 독일군이 파리를 에워싸면서 넉 달의 포위가 시작되었다. 정규군 대부분이 포로가 되거나 메스에 갇혀 있었으므로, 도시 방어는 무장한 시민군인 국민방위군이 맡았다. 하루 1.5프랑의 수당은 일자리를 잃은 노동자 가족의 생계가 되었고, 노동자 구역의 대대들은 장교를 스스로 뽑았다. 겨울이 되자 시민들은 말과 개, 동물원의 코끼리까지 먹어야 했다.',
                en: 'German armies surrounded Paris on 19–20 September and a four-month siege began. With most of the regular army captured or shut up in Metz, the city was defended by the armed citizens’ militia, the National Guard. Its pay of 1.5 francs a day kept unemployed workers’ families alive, and the battalions of working-class districts elected their own officers. By winter Parisians were eating horses, dogs and even the zoo’s elephants.',
                sources: [S.siege, S.guard, S.pc],
            },
            {
                ko: '정부가 강화를 모색한다는 의심은 두 차례 봉기로 터졌다. 10월 31일 메스 항복 소식에 블랑키와 플루랑스가 이끈 대대들이 시청을 점거했다가 물러났고, 1871년 1월 22일 시청 앞 시위에는 기동대가 발포했다. 1월 18일 베르사유 궁전에서 독일 제국이 선포된 뒤, 1월 28일 정부는 휴전에 서명하고 파리의 요새를 넘겼다.',
                en: 'Suspicion that the government was seeking peace broke out in two risings. On 31 October, at the news of Metz’s surrender, battalions led by Blanqui and Flourens occupied the Hôtel de Ville before withdrawing; on 22 January 1871 the Garde Mobile fired on a demonstration in front of it. After the German Empire was proclaimed in the Palace of Versailles on 18 January, the government signed an armistice on 28 January and handed over the forts of Paris.',
                sources: [S.siege, S.empire, S.pc],
            },
        ],
    },
    {
        heading: { ko: '보르도 의회와 3월 18일', en: 'The Bordeaux Assembly and 18 March' },
        paragraphs: [
            {
                ko: '1871년 2월 8일 휴전 조건에 따라 치른 총선에서 농촌은 강화를 약속한 왕당파를 대거 뽑았고, 파리는 공화파와 급진파를 뽑았다. 보르도에 모인 국민의회는 아돌프 티에르를 행정 수반으로 세웠다. 의회는 포위 중 유예되었던 어음과 집세의 지급을 되살리고 국민방위군 수당을 끊는 법을 통과시킨 뒤, 파리가 아닌 베르사유로 옮겨 가기로 했다.',
                en: 'In the elections of 8 February 1871, held under the armistice, the countryside returned a large monarchist majority pledged to peace, while Paris elected republicans and radicals. The National Assembly meeting in Bordeaux made Adolphe Thiers chief executive. It ended the siege moratorium on bills and rents, cut the National Guard’s pay and decided to sit at Versailles rather than Paris.',
                sources: [S.election, S.thiers, S.pc],
            },
            {
                ko: '파리의 국민방위군은 무장해제되지 않았고, 2월 중순부터 대대 대표들이 중앙위원회를 꾸려 「국민방위군 공화 연맹」을 만들었다. 시민의 모금으로 사들인 대포는 독일군이 입성하기 전에 몽마르트르와 벨빌 같은 노동자 구역으로 옮겨졌다. 티에르에게 이 대포는 국가 권위의 상징이었다.',
                en: 'The Paris National Guard had not been disarmed, and from mid-February battalion delegates formed a Central Committee and a Republican Federation of the National Guard. Cannon bought by public subscription were hauled to working-class districts such as Montmartre and Belleville before the Germans entered the city. For Thiers the guns became the symbol of state authority.',
                sources: [S.pc, S.guard],
            },
            {
                ko: '3월 18일 새벽 정규군이 몽마르트르 언덕의 대포를 끌어내려 했으나 말이 제때 오지 않았고, 모여든 여성과 주민, 방위군에 둘러싸인 병사들은 발포 명령을 거부하고 군중과 섞였다. 르콩트 장군과 클레망 토마 장군이 그날 오후 처형되었다. 티에르는 정부와 군대, 관청을 베르사유로 철수시켰고, 그날 밤 중앙위원회가 시청을 차지했다. 루이즈 미셸은 이날 아침 언덕에서 사람들을 깨운 이들 가운데 있었다.',
                en: 'At dawn on 18 March regular troops tried to remove the cannon on the Butte Montmartre, but the horses did not arrive in time; surrounded by women, residents and guardsmen, the soldiers refused orders to fire and fraternised with the crowd. Generals Lecomte and Clément-Thomas were executed that afternoon. Thiers withdrew the government, the army and the administration to Versailles, and that night the Central Committee took the Hôtel de Ville. Louise Michel was among those who roused the hill that morning.',
                sources: [S.pc, S.thiers, S.michel],
            },
        ],
    },
    {
        heading: { ko: '코뮌의 선출과 구성', en: 'Electing and organising the Commune' },
        paragraphs: [
            {
                ko: '중앙위원회는 권력을 쥐지 않고 선거에 넘겼다. 3월 26일 유권자 48만 5천 명 가운데 23만 3천 명이 투표해 인구 2만 명당 한 명씩 92명을 뽑았다. 부유한 7·8구는 기권이 70%를 넘었고, 노동자 구역인 20구는 투표율이 76%였다. 온건 공화파 등 당선자 일부가 취임을 거부해 실제 의원은 60여 명이었다. 3월 28일 시청 앞에서 코뮌 성립이 선포되었다.',
                en: 'The Central Committee did not keep power but handed it to an election. On 26 March 233,000 of 485,000 registered voters chose 92 members, one for every 20,000 residents. Abstention exceeded 70 per cent in the wealthy 7th and 8th arrondissements, while turnout reached 76 per cent in the working-class 20th. Some winners, among them moderate republicans, refused their seats, leaving about sixty members. The Commune was proclaimed in front of the Hôtel de Ville on 28 March.',
                sources: [S.pc, S.constituted],
            },
            {
                ko: '의원 가운데 노동자가 33명이었다. 블랑키파, 들레클뤼즈 같은 자코뱅계 「독립 혁명가」, 인터내셔널 회원인 프루동주의자와 바를랭·프랑켈이 섞여 있었다. 블랑키 자신은 3월 17일 체포되어 옥중에서 당선되었다. 코뮌에는 대통령도 시장도 총사령관도 없었고, 아홉 개 위원회가 집행위원회에 보고했으며, 의원은 선거구에 책임을 지고 소환될 수 있었다. 징병제를 폐지하고 건강한 남성 시민 전원을 국민방위군으로 삼았다.',
                en: 'Thirty-three members were workers. Blanquists, Jacobin “independent revolutionaries” such as Delescluze, and members of the International — Proudhonists alongside Varlin and Frankel — sat together. Blanqui himself, arrested on 17 March, was elected from prison. The Commune had no president, mayor or commander-in-chief; nine commissions reported to an Executive Commission, and members were answerable to and revocable by their constituents. It abolished conscription and made every able-bodied male citizen a member of the National Guard.',
                sources: [S.pc, S.civilWarCh5],
            },
            {
                ko: '4월 19일 「프랑스 인민에게 보내는 선언」은 코뮌이 요구하는 것이 프랑스 모든 코뮌의 자치이며, 국가는 자율적인 코뮌들의 자유로운 연합이어야 한다고 밝혔다. 파리가 프랑스를 지배하려는 것이 아니라 중앙집권을 해체하려 한다는 이 연방주의 강령은 프루동주의의 영향을 보여 준다.',
                en: 'The Declaration to the French People of 19 April demanded the autonomy of every commune in France and a nation formed as a free federation of self-governing communes. This federalist programme, in which Paris sought not to rule France but to dissolve centralisation, showed the influence of Proudhonism.',
                sources: [S.manifesto, S.pc],
            },
        ],
    },
    {
        heading: { ko: '노동과 일상을 바꾼 법령', en: 'Decrees on labour and daily life' },
        paragraphs: [
            {
                ko: '두 달 남짓한 기간에 실제로 시행된 법령은 많지 않았지만 방향은 분명했다. 코뮌은 포위 기간의 집세를 면제하고, 전당포에 맡긴 20프랑 이하의 공구와 살림살이를 무상으로 돌려주게 했다. 제빵 노동자의 야간 노동과 고용주가 임금에서 떼는 벌금을 금지했고, 전사한 방위군의 혼인하지 않은 동반자와 자녀에게도 연금을 주었다.',
                en: 'In little over two months few decrees were actually carried out, but their direction was clear. The Commune remitted rents owed for the siege and had pawnshops return free of charge tools and household goods pledged for up to 20 francs. It banned night work in bakeries and fines deducted from wages by employers, and granted pensions to the unmarried companions and children of guardsmen killed in action.',
                sources: [S.pc, S.pcKo],
            },
            {
                ko: '4월 16일 법령은 주인이 버리고 떠난 작업장을 조사해 노동자 협동조합이 운영하게 했다. 이 일을 맡은 노동·교환위원회의 대표는 헝가리 출신 금세공인이자 인터내셔널 회원 레오 프랑켈이었고, 제본공 외젠 바를랭은 재정을 맡았다. 옛 소유주의 보상 청구권은 인정되었으므로 수용은 아니었지만, 노동자의 자주관리를 공공 정책으로 삼은 첫 시도였다.',
                en: 'A decree of 16 April had workshops abandoned by their owners surveyed and handed to workers’ cooperatives. The Commission of Labour and Exchange that carried it out was headed by Leó Frankel, a Hungarian jeweller and member of the International, while the bookbinder Eugène Varlin handled finance. Former owners kept a right to compensation, so this was not expropriation, but it was the first attempt to make workers’ self-management public policy.',
                sources: [S.pc, S.frankel, S.varlin],
            },
            {
                ko: '4월 2일 코뮌은 교회와 국가를 분리하고 종교 예산을 폐지했으며 교회 재산을 국유화했다. 학교에서 종교 교육을 없애는 세속 교육이 추진되었다. 마르크스는 코뮌이 공무원의 봉급을 노동자 임금 수준으로 묶고 상비군을 무장한 인민으로 대체한 것을 「마침내 발견된 정치 형태」라고 평했다.',
                en: 'On 2 April the Commune separated church and state, abolished the religious budget and declared church property national property; secular schooling without religious instruction was pursued. Marx singled out its capping of officials’ pay at workmen’s wages and its replacement of the standing army by the armed people as “the political form at last discovered”.',
                sources: [S.churchState, S.pc, S.civilWarCh5],
            },
        ],
    },
    {
        heading: { ko: '여성과 예술가', en: 'Women and artists' },
        paragraphs: [
            {
                ko: '여성은 투표권도 의석도 없었지만 3월 18일부터 코뮌의 중심에 있었다. 4월 11일 러시아 출신 인터내셔널 회원 엘리자베트 드미트리예프와 제본공 나탈리 르멜은 「파리 방위와 부상자 간호를 위한 여성 연합」을 세웠다. 연합은 구마다 위원회를 두고 여성 노동자의 협동 작업장을 조직하려 했으며, 여성 노동자에게 코뮌 방위에 나서라고 호소했다.',
                en: 'Women had neither votes nor seats, yet they were at the centre of the Commune from 18 March. On 11 April the Russian International member Elisabeth Dmitrieff and the bookbinder Nathalie Lemel founded the Women’s Union for the Defence of Paris and Care of the Wounded. The Union set up committees in each arrondissement, tried to organise cooperative workshops for women workers and called on working women to defend the Commune.',
                sources: [S.union, S.workingWomen, S.pc],
            },
            {
                ko: '교사 루이즈 미셸은 몽마르트르 감시위원회에서 활동하고 방위군 대대와 함께 싸웠으며, 구급 활동을 조직했다. 여성들은 클럽에서 연설하고 무료 학교를 열었으며, 피의 주간에는 바리케이드를 지켰다. 베르사유 측 언론은 이들을 건물에 불을 지르는 「석유 방화녀」로 그렸지만, 이 혐의는 대부분 입증되지 않았다.',
                en: 'The teacher Louise Michel served on the Montmartre vigilance committee, fought with a Guard battalion and organised ambulance work. Women spoke in the clubs, opened free schools and held barricades in Bloody Week. The Versailles press portrayed them as pétroleuses setting buildings alight, a charge that was largely unproven.',
                sources: [S.michel, S.pc],
            },
            {
                ko: '화가 귀스타브 쿠르베는 예술가 연맹을 이끌며 미술관과 예술가의 자치를 요구했고, 6구에서 코뮌 의원으로 뽑혔다. 코뮌은 4월 12일 방돔 광장의 나폴레옹 기념 원주를 「야만의 기념물」로 규정해 철거를 결의했고, 5월 16일 원주가 군중 앞에서 쓰러졌다. 쿠르베는 뒤에 이 철거의 책임을 지고 재건 비용을 물어야 했다.',
                en: 'The painter Gustave Courbet led the Federation of Artists, which demanded self-government for museums and artists, and was elected to the Commune for the 6th arrondissement. On 12 April the Commune condemned the Napoleonic column in the Place Vendôme as “a monument of barbarism”, and on 16 May it was pulled down before a crowd. Courbet was later held responsible and ordered to pay for its reconstruction.',
                sources: [S.courbet, S.vendome, S.pc],
            },
        ],
    },
    {
        heading: { ko: '베르사유와의 전쟁과 내부의 분열', en: 'War with Versailles and division within' },
        paragraphs: [
            {
                ko: '4월 2일 베르사유군이 쿠르브부아를 공격하며 내전이 시작되었다. 이튿날 방위군 2만 7천 명이 세 갈래로 베르사유를 향해 나섰지만 몽발레리앵 요새의 포격에 무너졌고, 지휘관 플루랑스와 뒤발은 포로가 된 뒤 살해되었다. 코뮌은 4월 5일 인질 법령으로 응수했다. 베르사유가 포로를 처형하면 인질을 세 배로 처형한다는 이 법령에 따라 파리 대주교 다르부아가 붙잡혔고, 코뮌은 그를 블랑키와 맞바꾸자고 제안했지만 티에르는 거절했다.',
                en: 'Civil war began on 2 April when Versailles troops attacked Courbevoie. The next day 27,000 guardsmen marched on Versailles in three columns but broke under the guns of Fort Mont-Valérien, and their commanders Flourens and Duval were killed after capture. The Commune replied on 5 April with the Decree on Hostages, threatening three hostages for every prisoner executed by Versailles. Archbishop Darboy of Paris was seized under it, and the Commune offered to exchange him for Blanqui; Thiers refused.',
                sources: [S.pc, S.reprisals, S.darboy],
            },
            {
                ko: '군사 상황이 나빠지자 5월 1일 코뮌은 1793년의 이름을 딴 공안위원회를 세우기로 했다. 블랑키파와 자코뱅파의 「다수파」는 전쟁을 위한 권력 집중을 주장했고, 바를랭·프랑켈·쿠르베·발레스 등 인터내셔널 계열의 「소수파」는 독재라며 반대 성명을 냈다. 방위군 지휘권은 클뤼즈레, 로셀을 거쳐 5월 11일 민간인 들레클뤼즈에게 넘어갔다.',
                en: 'As the military position worsened, on 1 May the Commune voted to create a Committee of Public Safety named after that of 1793. The Blanquist and Jacobin “majority” wanted power concentrated for the war, while the “minority” around the International — Varlin, Frankel, Courbet, Vallès — protested against a dictatorship. Command of the Guard passed from Cluseret to Rossel and on 11 May to the civilian Delescluze.',
                sources: [S.cps, S.pc, S.delescluze],
            },
            {
                ko: '파리는 고립되어 있었다. 3월 하순 리옹·마르세유·생테티엔·툴루즈 등에서 선포된 코뮌은 며칠 만에 진압되었고, 마르세유는 4월 4일 포격 끝에 함락되었다. 5월 10일 프랑크푸르트 조약으로 알자스와 로렌 일부를 넘기고 50억 프랑의 배상을 약속한 베르사유 정부는 독일이 풀어 준 포로로 마크마옹 원수 휘하의 군대를 다시 채웠다. 티에르는 파리 탈환에 15만 명이 필요하다고 보았다.',
                en: 'Paris stood alone. Communes proclaimed in late March in Lyon, Marseille, Saint-Étienne, Toulouse and elsewhere were put down within days; Marseille fell to bombardment on 4 April. Having ceded Alsace and part of Lorraine and promised five billion francs in the Treaty of Frankfurt on 10 May, the Versailles government refilled Marshal MacMahon’s army with prisoners released by Germany; Thiers reckoned he needed 150,000 men to retake Paris.',
                sources: [S.lyon, S.marseille, S.frankfurt, S.pc],
            },
        ],
    },
    {
        heading: { ko: '피의 주간', en: 'Bloody Week' },
        paragraphs: [
            {
                ko: '1871년 5월 21일 일요일, 베르사유군은 비어 있던 서쪽 성벽의 생클루 문으로 파리에 들어왔다. 중앙의 지휘는 무너졌고 방위군은 제 구역의 바리케이드로 흩어졌다. 5월 23일 몽마르트르가 함락되었고, 폴란드 망명 장교 야로스와프 동브로프스키가 그 부근에서 치명상을 입었다. 퇴각하던 코뮌 측은 튀일리 궁과 시청, 재무부 등 권력의 상징에 불을 질렀다.',
                en: 'On Sunday 21 May 1871 the Versailles army entered Paris through the unguarded Porte de Saint-Cloud in the western ramparts. Central command collapsed and the Guard scattered to the barricades of its own districts. Montmartre fell on 23 May, and the Polish exile officer Jarosław Dąbrowski was mortally wounded nearby. Retreating Communards set fire to symbols of power — the Tuileries, the Hôtel de Ville, the Ministry of Finance.',
                sources: [S.semaine, S.dabrowski, S.pc],
            },
            {
                ko: '정규군은 무기를 들었거나 손에 화약 흔적이 있다는 이유만으로 포로를 즉결 처형했다. 이에 맞서 5월 24일 라로케트 감옥에서 다르부아 대주교 등 인질 여섯 명이, 26일 악소 거리에서 사제와 헌병 등 약 50명이 코뮌 측에게 살해되었다. 5월 25일 들레클뤼즈는 샤토도 광장의 바리케이드 위로 걸어 올라가 총에 맞았다.',
                en: 'Regular troops summarily shot prisoners for carrying weapons or having powder-blackened hands. In retaliation Communards killed six hostages including Archbishop Darboy at La Roquette prison on 24 May, and about fifty priests, gendarmes and others in the rue Haxo on 26 May. On 25 May Delescluze walked up onto the barricade at the Château-d’Eau and was shot.',
                sources: [S.semaine, S.darboy, S.delescluze],
            },
            {
                ko: '마지막 저항은 벨빌과 페르라셰즈 묘지에서 끝났다. 5월 28일 묘지 동쪽 벽 앞에서 코뮌 전사 147명이 총살되었고, 이 「코뮌 전사의 벽」은 뒤에 노동운동의 추모지가 되었다. 같은 날 바를랭은 붙잡혀 몽마르트르로 끌려가 구타당한 뒤 총살되었다. 티에르는 지방 관청에 「땅이 그들의 시체로 덮여 있다」며 이 광경이 교훈이 되기를 바란다고 알렸다.',
                en: 'The last resistance ended in Belleville and the Père Lachaise cemetery. On 28 May 147 fighters were shot against the cemetery’s eastern wall, the Communards’ Wall that later became a place of labour-movement remembrance. That day Varlin was captured, dragged to Montmartre, beaten and shot. Thiers told the prefects that “the ground is covered with their corpses” and hoped the sight would serve as a lesson.',
                sources: [S.wall, S.varlin, S.thiersCircular],
            },
            {
                ko: '사망자 수는 지금도 논쟁 중이다. 정부군 공식 보고는 4~5월 전사자를 877명으로 집계했다. 코뮌 측은 리사가레가 말한 2만 명에서, 묘지 기록을 다시 조사한 로버트 톰스의 6천~7천 명(2012), 이를 반박한 미셸 오댕의 1만~1만 5천 명 이상(2021)까지 추정이 엇갈린다. 어느 쪽이든 짧은 기간에 한 도시에서 벌어진 학살로는 19세기 유럽에서 유례가 드물었다.',
                en: 'The death toll is still disputed. The army’s official report counted 877 soldiers killed in April and May. Estimates for the Communards range from Lissagaray’s twenty thousand to Robert Tombs’s six to seven thousand from cemetery records (2012) and Michèle Audin’s rebuttal of more than ten to fifteen thousand (2021). On any count it was a massacre with few parallels in nineteenth-century Europe for one city in so short a time.',
                sources: [S.pc, S.semaine, S.lissagaray],
            },
        ],
    },
    {
        heading: { ko: '재판, 유형, 사면', en: 'Trials, deportation and amnesty' },
        paragraphs: [
            {
                ko: '군은 4만 3,522명을 포로로 잡았고, 그 가운데 여성이 1,054명이었다. 절반 이상은 곧 풀려났지만 약 1만 5천 명이 군사 법정에 섰고, 사형 선고 가운데 25명이 실제로 총살되었다. 유형 선고를 받은 이들은 대부분 뉴칼레도니아로 보내졌고, 루이즈 미셸도 1873년 그곳에 도착했다. 체포를 피한 수천 명은 잉글랜드와 벨기에, 스위스로 망명했다.',
                en: 'The army took 43,522 prisoners, 1,054 of them women. More than half were soon released, but some 15,000 were tried by military courts and 25 of those sentenced to death were shot. Most of those sentenced to deportation were shipped to New Caledonia, where Louise Michel arrived in 1873, and thousands who escaped arrest went into exile in England, Belgium and Switzerland.',
                sources: [S.pc, S.michel],
            },
            {
                ko: '티에르는 1871년 8월 대통령이 되었고, 1873년 그를 이은 마크마옹은 왕정복고를 노리는 「도덕 질서」 정부를 이끌었다. 같은 해 국민의회는 몽마르트르 언덕에 사크레쾨르 대성당을 짓기로 의결했는데, 이는 패전과 코뮌에 대한 속죄를 뜻했다. 1879년 부분 사면과 1880년 7월 11일 전면 사면으로 유형수와 망명자가 돌아왔다.',
                en: 'Thiers became president in August 1871; MacMahon, who succeeded him in 1873, led a “Moral Order” government hoping for a restoration. That year the National Assembly voted to build the Basilica of Sacré-Cœur on the Butte Montmartre as expiation for defeat and the Commune. A partial amnesty in 1879 and a general amnesty on 11 July 1880 brought the deportees and exiles home.',
                sources: [S.thiers, S.macmahon, S.sacreCoeur, S.pc],
            },
        ],
    },
    {
        heading: { ko: '코뮌의 해석과 기억', en: 'Interpreting and remembering the Commune' },
        paragraphs: [
            {
                ko: '마르크스는 4월 12일 쿠겔만에게 파리 사람들이 「하늘을 향해 돌격했다」고 썼고, 코뮌이 무너진 직후인 5월 30일 인터내셔널 총평의회의 이름으로 『프랑스 내전』을 발표했다. 그는 코뮌을 「본질적으로 노동계급의 정부」로 보고, 노동계급은 기존 국가기구를 그대로 넘겨받아 쓸 수 없다고 결론지었다. 1891년 엥겔스는 이 책의 서문에서 「프롤레타리아 독재가 어떤 것인지 알고 싶다면 파리 코뮌을 보라」고 썼다.',
                en: 'On 12 April Marx wrote to Kugelmann that the Parisians were “storming heaven”, and on 30 May, just after the fall, he published The Civil War in France in the name of the International’s General Council. He saw the Commune as “essentially a working-class government” and concluded that the working class cannot simply lay hold of the ready-made state machinery. In his 1891 introduction Engels wrote: “Do you want to know what this dictatorship looks like? Look at the Paris Commune.”',
                sources: [S.kugelmann, S.civilWarWiki, S.civilWarCh5, S.engels1891],
            },
            {
                ko: '해석은 곧 갈라졌다. 바쿠닌은 코뮌을 국가 자체의 부정으로 읽었고, 이 대립은 1872년 인터내셔널의 분열로 이어졌다. 독일 제국의회에서 베벨은 코뮌을 앞으로 올 싸움의 「전초전」이라 불렀다. 레닌은 1908년 「코뮌의 교훈」에서 코뮌이 베르사유로 진격하지 않고 프랑스 은행을 접수하지 않은 것을 실패의 원인으로 꼽았고, 1917년 『국가와 혁명』에서 코뮌을 소비에트 국가의 원형으로 삼았다.',
                en: 'Interpretations soon diverged. Bakunin read the Commune as the negation of the state itself, a dispute that led to the split of the International in 1872. In the German Reichstag Bebel called the Commune a “preliminary skirmish” of the struggle to come. Lenin’s “Lessons of the Commune” of 1908 blamed its defeat on the failure to march on Versailles and to take over the Bank of France, and in The State and Revolution of 1917 he made the Commune the prototype of the Soviet state.',
                sources: [S.bakunin, S.bebel, S.lenin1908, S.lenin1917],
            },
            {
                ko: '코뮌 의원이던 외젠 포티에는 1871년 6월 숨어 지내며 「인터내셔널가」의 가사를 썼고, 1888년 피에르 드제이테르의 곡이 붙어 세계 노동운동의 노래가 되었다. 바리케이드에서 싸운 프로스페르올리비에 리사가레는 1876년 망명지에서 『1871년 파리 코뮌의 역사』를 펴내, 참여자의 증언으로 베르사유 측의 서사에 맞섰다.',
                en: 'Eugène Pottier, a member of the Commune, wrote the words of “The Internationale” in hiding in June 1871; set to music by Pierre De Geyter in 1888, it became the anthem of the world labour movement. Prosper-Olivier Lissagaray, who had fought on the barricades, published his History of the Paris Commune of 1871 in exile in 1876, countering the Versailles narrative with a participant’s testimony.',
                sources: [S.internationale, S.pottier, S.lissagaray, S.lissagarayBook],
            },
        ],
    },
];

const P = (lat, lng, ko, en) => ({ kind: 'point', lat, lng, label: { ko, en } });
const timeline = [
    ['1870.07.19', '프랑스, 프로이센에 선전포고', 'France declares war on Prussia', '제2제정이 에스파냐 왕위 계승 문제를 빌미로 전쟁에 나섰다.', 'The Second Empire went to war over the Spanish succession dispute.', ['france', 'germany']],
    ['1870.09.02', '스당 항복', 'Surrender at Sedan', '나폴레옹 3세가 군대와 함께 포로가 되었다.', 'Napoleon III was taken prisoner with his army.', ['france', 'germany'], P(49.70, 4.94, '스당', 'Sedan')],
    ['1870.09.04', '공화국 선포', 'Republic proclaimed', '파리 시청에서 국민방위정부가 수립되었다.', 'The Government of National Defence was set up at the Hôtel de Ville.', ['france'], P(48.8566, 2.3522, '파리 시청', 'Hôtel de Ville, Paris')],
    ['1870.09.19', '파리 포위 시작', 'Siege of Paris begins', '독일군이 파리를 에워쌌고 국민방위군이 도시를 지켰다.', 'German armies encircled Paris and the National Guard defended the city.', ['france', 'germany']],
    ['1870.10.31', '시청 점거 봉기', 'Rising at the Hôtel de Ville', '메스 항복 소식에 블랑키파 대대들이 시청을 점거했다가 물러났다.', 'At the news of Metz’s surrender Blanquist battalions occupied the Hôtel de Ville, then withdrew.', ['france']],
    ['1871.01.18', '독일 제국 선포', 'German Empire proclaimed', '베르사유 궁전 거울의 방에서 빌헬름 1세가 독일 황제가 되었다.', 'Wilhelm I became German emperor in the Hall of Mirrors at Versailles.', ['germany', 'france'], P(48.8049, 2.1204, '베르사유 궁전', 'Palace of Versailles')],
    ['1871.01.28', '휴전과 파리 항복', 'Armistice and capitulation of Paris', '정부가 휴전에 서명하고 파리의 요새를 넘겼다.', 'The government signed an armistice and surrendered the forts of Paris.', ['france', 'germany']],
    ['1871.02.08', '국민의회 선거', 'National Assembly elections', '농촌은 왕당파를, 파리는 공화파·급진파를 뽑았다. 의회는 티에르를 행정 수반으로 세웠다.', 'The countryside elected monarchists and Paris republicans and radicals; the Assembly made Thiers chief executive.', ['france'], P(44.8378, -0.5792, '보르도', 'Bordeaux')],
    ['1871.03.18', '몽마르트르의 대포', 'The cannon of Montmartre', '대포를 빼앗으려던 정규군이 군중과 섞였고, 티에르는 정부를 베르사유로 철수시켰다.', 'Troops sent to seize the cannon fraternised with the crowd; Thiers withdrew the government to Versailles.', ['france'], P(48.8867, 2.3431, '몽마르트르', 'Montmartre')],
    ['1871.03.26', '코뮌 선거', 'Commune elections', '23만 3천 명이 투표해 92명의 의원을 뽑았고, 28일 코뮌 성립이 선포되었다.', '233,000 voters elected 92 members; the Commune was proclaimed on the 28th.', ['france']],
    ['1871.04.02', '정교분리 법령과 내전 개시', 'Separation of church and state; civil war begins', '코뮌이 교회와 국가를 분리했고, 베르사유군이 쿠르브부아를 공격했다.', 'The Commune separated church and state as Versailles troops attacked Courbevoie.', ['france']],
    ['1871.04.04', '마르세유 코뮌 함락', 'Fall of the Marseille Commune', '지방 코뮌 가운데 가장 오래 버틴 마르세유가 포격 끝에 진압되었다.', 'Marseille, the longest-lasting provincial commune, was crushed after bombardment.', ['france'], P(43.2965, 5.3698, '마르세유', 'Marseille')],
    ['1871.04.11', '여성 연합 창립', 'Women’s Union founded', '드미트리예프와 르멜이 파리 방위와 부상자 간호를 위한 여성 연합을 세웠다.', 'Dmitrieff and Lemel founded the Women’s Union for the Defence of Paris and Care of the Wounded.', ['france']],
    ['1871.04.16', '버려진 작업장 법령', 'Decree on abandoned workshops', '주인이 떠난 작업장을 노동자 협동조합이 운영하게 했다.', 'Workshops left by their owners were to be run by workers’ cooperatives.', ['france']],
    ['1871.04.19', '프랑스 인민에게 보내는 선언', 'Declaration to the French People', '자치 코뮌들의 자유로운 연합을 강령으로 밝혔다.', 'The Commune set out its programme of a free federation of self-governing communes.', ['france']],
    ['1871.05.01', '공안위원회 설치', 'Committee of Public Safety', '권력 집중을 둘러싸고 다수파와 소수파가 갈라졌다.', 'The majority and the minority split over the concentration of power.', ['france']],
    ['1871.05.10', '프랑크푸르트 조약', 'Treaty of Frankfurt', '알자스와 로렌 일부를 넘기고 50억 프랑의 배상을 약속했다.', 'France ceded Alsace and part of Lorraine and promised five billion francs.', ['france', 'germany'], P(50.1109, 8.6821, '프랑크푸르트', 'Frankfurt')],
    ['1871.05.16', '방돔 원주 철거', 'Vendôme Column pulled down', '나폴레옹의 전승 기념 원주가 군중 앞에서 쓰러졌다.', 'Napoleon’s victory column fell before a crowd.', ['france'], P(48.8675, 2.3294, '방돔 광장', 'Place Vendôme')],
    ['1871.05.21', '피의 주간 시작', 'Bloody Week begins', '베르사유군이 생클루 문으로 파리에 들어왔다.', 'The Versailles army entered Paris through the Porte de Saint-Cloud.', ['france'], P(48.8378, 2.2567, '생클루 문', 'Porte de Saint-Cloud')],
    ['1871.05.25', '들레클뤼즈 전사', 'Death of Delescluze', '전쟁 대표 들레클뤼즈가 샤토도 광장의 바리케이드에서 쓰러졌다.', 'War delegate Delescluze fell on the barricade at the Château-d’Eau.', ['france'], P(48.8674, 2.3635, '샤토도 광장', 'Place du Château-d’Eau')],
    ['1871.05.28', '페르라셰즈의 마지막 총살', 'Last executions at Père Lachaise', '코뮌 전사 147명이 묘지 동쪽 벽 앞에서 총살되었다.', '147 fighters were shot against the cemetery’s eastern wall.', ['france'], P(48.8614, 2.3933, '페르라셰즈 묘지', 'Père Lachaise cemetery')],
    ['1871.05.30', '『프랑스 내전』', 'The Civil War in France', '마르크스가 인터내셔널 총평의회의 이름으로 코뮌을 옹호했다.', 'Marx defended the Commune in the name of the International’s General Council.', ['uk'], P(51.5074, -0.1278, '런던', 'London')],
    ['1873', '뉴칼레도니아 유형', 'Deportation to New Caledonia', '루이즈 미셸 등 유형 선고를 받은 코뮌 가담자들이 태평양의 유형지로 보내졌다.', 'Communards sentenced to deportation, Louise Michel among them, were shipped to the Pacific penal colony.', ['france'], P(-22.2758, 166.458, '누메아 (뉴칼레도니아)', 'Nouméa, New Caledonia')],
    ['1880.07.11', '전면 사면', 'General amnesty', '남은 유형수와 궐석 판결자들이 프랑스로 돌아올 수 있게 되었다.', 'The remaining deportees and those condemned in absentia could return to France.', ['france']],
].map(([date, tko, ten, bko, ben, country, geo]) => ({
    date, title: { ko: tko, en: ten }, body: { ko: bko, en: ben }, country, ...(geo ? { geo } : {}),
}));

const people = [
    ['eugene-varlin', 'leader', '코뮌 의원 · 재정 담당 · 인터내셔널', 'Commune member, finance, International', '제본공 출신 인터내셔널 지도자로 재정을 맡았고, 5월 28일 붙잡혀 총살되었다.', 'Bookbinder and International leader who ran finance; captured and shot on 28 May.'],
    ['leo-frankel', 'leader', '노동·교환위원회 대표', 'Delegate for Labour and Exchange', '제빵 야간 노동 금지와 버려진 작업장 법령을 추진했다.', 'Drove the bakery night-work ban and the abandoned-workshops decree.'],
    ['charles-delescluze', 'leader', '공안위원 · 전쟁 대표', 'Committee of Public Safety, war delegate', '자코뱅계 원로로 5월 11일 전쟁 대표가 되었고 5월 25일 바리케이드에서 전사했다.', 'Veteran Jacobin who became war delegate on 11 May and died on the barricade on 25 May.'],
    ['jaroslaw-dabrowski', 'executor', '코뮌군 장군', 'Commune general', '폴란드 망명 장교로 서부 전선을 지휘했고 5월 23일 몽마르트르에서 치명상을 입었다.', 'Polish exile officer who commanded the western front; mortally wounded at Montmartre on 23 May.'],
    ['louis-auguste-blanqui', 'participant', '옥중 당선 코뮌 의원', 'Member elected from prison', '3월 17일 체포되어 옥중에서 당선되었고, 코뮌은 대주교와의 교환을 제안했다.', 'Arrested on 17 March and elected from prison; the Commune offered to exchange him for the archbishop.'],
    ['louise-michel', 'participant', '몽마르트르 감시위원 · 방위군 대원', 'Montmartre vigilance committee, guardswoman', '3월 18일 몽마르트르에 있었고 바리케이드에서 싸운 뒤 뉴칼레도니아로 유형되었다.', 'On Montmartre on 18 March, fought on the barricades and was deported to New Caledonia.'],
    ['gustave-courbet', 'participant', '코뮌 의원 · 예술가 연맹 의장', 'Commune member, Federation of Artists', '방돔 원주 철거의 책임을 지고 재건 비용 청구를 받아 스위스로 망명했다.', 'Held responsible for the Vendôme Column, charged its rebuilding cost and fled to Switzerland.'],
    ['eugene-pottier', 'participant', '코뮌 의원 · 「인터내셔널가」 작사', 'Commune member, author of “The Internationale”', '2구 의원으로 선출되었고 피의 주간 뒤 숨어서 「인터내셔널가」를 썼다.', 'Elected for the 2nd arrondissement; wrote “The Internationale” in hiding after Bloody Week.'],
    ['prosper-olivier-lissagaray', 'participant', '바리케이드 전사 · 『파리 코뮌의 역사』 저자', 'Barricade fighter, historian of the Commune', '마지막 바리케이드까지 싸웠고 1876년 망명지에서 코뮌사를 펴냈다.', 'Fought to the last barricade and published his history of the Commune in exile in 1876.'],
    ['adolphe-thiers', 'opponent', '행정 수반', 'Chief executive', '대포 회수를 명령하고 베르사유에서 진압을 지휘했다.', 'Ordered the seizure of the cannon and directed the repression from Versailles.'],
    ['patrice-de-mac-mahon', 'opponent', '베르사유군 사령관', 'Commander of the Versailles army', '독일에서 돌아온 포로로 재편한 군대로 피의 주간의 진압을 지휘했다.', 'Led the army rebuilt from prisoners returned by Germany through Bloody Week.'],
    ['karl-marx', 'witness', '『프랑스 내전』 저자', 'Author of The Civil War in France', '인터내셔널 총평의회의 이름으로 코뮌을 노동계급의 정부로 옹호했다.', 'Defended the Commune as a working-class government for the International’s General Council.'],
    ['friedrich-engels', 'witness', '인터내셔널 총평의회 위원', 'Member of the International’s General Council', '1891년 서문에서 코뮌을 프롤레타리아 독재의 실례로 제시했다.', 'His 1891 introduction presented the Commune as the dictatorship of the proletariat.'],
    ['mikhail-bakunin', 'witness', '아나키스트 논평자', 'Anarchist commentator', '「파리 코뮌과 국가 사상」에서 코뮌을 국가의 부정으로 읽었다.', 'Read the Commune as the negation of the state in “The Paris Commune and the Idea of the State”.'],
    ['august-bebel', 'witness', '독일 제국의회 의원', 'Reichstag deputy', '제국의회에서 코뮌을 앞으로 올 싸움의 「전초전」이라 불렀다.', 'Called the Commune a “preliminary skirmish” in the Reichstag.'],
    ['wilhelm-liebknecht', 'witness', '독일 사회민주주의 지도자', 'German Social Democratic leader', '베벨과 함께 합병 반대와 코뮌 연대를 표명했다.', 'With Bebel opposed annexation and declared solidarity with the Commune.'],
    ['lenin', 'historian', '「코뮌의 교훈」 · 『국가와 혁명』', '“Lessons of the Commune”, The State and Revolution', '코뮌의 실패에서 교훈을 끌어내고 소비에트 국가의 원형으로 삼았다.', 'Drew lessons from its defeat and made it the prototype of the Soviet state.'],
].map(([person_id, relation_kind, relation_ko, relation_en, note_ko, note_en], sort_order) => ({
    person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en,
}));

const sources = [];
for (const s of sections) for (const p of s.paragraphs) for (const u of p.sources) if (!sources.includes(u)) sources.push(u);
const body = lang => sections.map(s => '## ' + s.heading[lang] + '\n\n' + s.paragraphs.map(p =>
    p[lang] + ' ' + p.sources.map(u => `[${sources.indexOf(u) + 1}](${u})`).join(' ')).join('\n\n')).join('\n\n');

const event = {
    id: 'paris-commune-1871',
    expected: null,
    fields: {
        title_ko: '파리 코뮌',
        title_en: 'The Paris Commune',
        period_label: '1870–1871',
        sort_order: 5,
        question_ko: '패전과 포위 속에서 태어난 파리의 노동자 정부는 무엇을 시도했고, 왜 72일 만에 학살로 끝났는가?',
        question_en: 'What did the workers’ government born of defeat and siege attempt, and why did it end in a massacre after 72 days?',
        summary_ko: '프로이센과의 전쟁에서 제2제정이 무너지고 파리가 넉 달 동안 포위된 뒤, 왕당파 다수의 국민의회와 무장한 파리 국민방위군이 충돌했다. 1871년 3월 18일 몽마르트르의 대포를 둘러싼 대치에서 정부가 베르사유로 물러나자 파리는 선거로 코뮌을 세웠다. 코뮌은 정교분리, 집세 면제, 노동자 협동조합 같은 법령을 내놓았지만, 5월 21~28일 「피의 주간」에 정부군에게 진압되었다.',
        summary_en: 'After the Second Empire collapsed in the war with Prussia and Paris endured a four-month siege, a monarchist National Assembly faced the armed Paris National Guard. When a stand-off over the cannon of Montmartre on 18 March 1871 drove the government to Versailles, Paris elected a Commune. It decreed the separation of church and state, remission of rents and workers’ cooperatives, but was crushed by the national army in the Bloody Week of 21–28 May.',
        outcome_ko: '피의 주간에 수천에서 1만 명이 넘는 코뮌 가담자가 죽었고 4만 3천여 명이 포로가 되었다. 뉴칼레도니아 유형과 망명이 이어졌으며, 1880년 전면 사면으로 생존자들이 돌아왔다. 마르크스·엥겔스·레닌은 코뮌을 프롤레타리아 독재의 첫 형태로 해석했고, 「인터내셔널가」와 코뮌 전사의 벽은 노동운동의 기억이 되었다.',
        outcome_en: 'Several thousand to more than ten thousand Communards died in Bloody Week and over 43,000 were taken prisoner. Deportation to New Caledonia and exile followed until the general amnesty of 1880 brought survivors home. Marx, Engels and Lenin read the Commune as the first form of the dictatorship of the proletariat, and “The Internationale” and the Communards’ Wall entered the memory of the labour movement.',
        body_ko: body('ko'),
        body_en: body('en'),
        timeline,
        sources,
        locations: [
            { label: { ko: '파리 시청', en: 'Hôtel de Ville, Paris' }, lat: 48.8566, lng: 2.3522, kind: 'main' },
            { label: { ko: '몽마르트르', en: 'Montmartre' }, lat: 48.8867, lng: 2.3431, kind: 'place' },
            { label: { ko: '베르사유', en: 'Versailles' }, lat: 48.8049, lng: 2.1204, kind: 'place' },
            { label: { ko: '페르라셰즈 묘지', en: 'Père Lachaise cemetery' }, lat: 48.8614, lng: 2.3933, kind: 'place' },
            { label: { ko: '리옹', en: 'Lyon' }, lat: 45.764, lng: 4.8357, kind: 'place' },
            { label: { ko: '마르세유', en: 'Marseille' }, lat: 43.2965, lng: 5.3698, kind: 'place' },
        ],
        countries: ['france', 'germany', 'uk'],
        relations: { related: ['french-revolution-1789-1799', 'october-revolution'] },
        no_auto_link: [],
        link_expressions: [],
        focus: { ko: '파리 코뮌과 그 방어자들', en: 'The Paris Commune and its defenders' },
    },
    sections,
    people,
};

fs.writeFileSync(path.join(__dirname, '..', 'paris-commune-20260929.json'),
    JSON.stringify({ id: 'paris-commune-20260929', events: [event] }, null, 2) + '\n');
fs.writeFileSync(path.join(__dirname, '..', 'paris-commune-20260929-people.json'),
    JSON.stringify({ changedBy: 'paris-commune-20260929', people: require('./people') }, null, 2) + '\n');
console.log(`event ${event.id}: ${sections.length} sections, ${sources.length} sources, ${timeline.length} timeline, ${people.length} relations`);
