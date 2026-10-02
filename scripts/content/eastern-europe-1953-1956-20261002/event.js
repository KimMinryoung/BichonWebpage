// Eastern Europe after Stalin: the crises of 1953–1956 (2026-10-02). Overview and
// parent of east-german-uprising-1953, hungary-new-course-1953, poznan-1956 and
// hungarian-revolution; it summarises and links them rather than retelling them.
// Built with the Baltic batch's lib.js. Source excerpts: temp_dev/eastern-europe-1953-1956/src/.
const { W, P, event: buildEvent } = require('../baltic-1940-1953-20261002/lib');

const E = t => W(encodeURI(t));
const S = {
    gdr53: E('East_German_uprising_of_1953'),
    newcourse: E('New_Course'),
    plzen: E('1953_Plzeň_uprising'),
    malenkov: E('Georgy_Malenkov'),
    beria: E('Lavrentiy_Beria'),
    rakosi: E('Mátyás_Rákosi'),
    nagy: E('Imre_Nagy'),
    wp: E('Warsaw_Pact'),
    ast: E('Austrian_State_Treaty'),
    belgrade: E('Belgrade_declaration'),
    cominform: E('Cominform'),
    secret: E('On_the_Cult_of_Personality_and_Its_Consequences'),
    bierut: E('Bolesław_Bierut'),
    ochab: E('Edward_Ochab'),
    rajk: E('László_Rajk'),
    poznan: E('1956_Poznań_protests'),
    polocto: E('Polish_October'),
    gomulka: E('Władysław_Gomułka'),
    rokoss: E('Konstantin_Rokossovsky'),
    hunrev: E('Hungarian_Revolution_of_1956'),
    kadar: E('János_Kádár'),
    rainer: 'https://www.wilsoncenter.org/sites/default/files/media/documents/publication/ACFAF2.pdf',
    kramer: 'https://www.wilsoncenter.org/sites/default/files/media/documents/publication/CWIHPBulletin8-9_p6.pdf',
    bekes: 'https://www.wilsoncenter.org/sites/default/files/media/documents/publication/CWIHPBulletin2.pdf',
    granville: 'https://doi.org/10.1111/1467-8497.00266',
    kempwelch: 'https://ideas.repec.org/a/taf/ceasxx/v58y2006i8p1261-1284.html',
};
const ev = id => `/commulingo/events/${id}`;
const L = (ko, id) => `「[${ko}](${ev(id)})」`;
const Le = (en, id) => `[${en}](${ev(id)})`;

const sections = [
    {
        heading: { ko: '스탈린의 죽음과 모스크바의 「새 노선」', en: 'Stalin’s death and Moscow’s “New Course”' },
        paragraphs: [
            {
                ko: '1953년 3월 5일 스탈린이 죽자 게오르기 말렌코프가 각료회의 의장과 당 서열 1위 서기 자리를 이어받았다. 그러나 3월 14일 간부회 동료들은 그에게 서기국에서 물러나게 했고, 당 제1서기 대행은 니키타 흐루쇼프에게 돌아갔다. 한동안 나라는 말렌코프(정부), 뱌체슬라프 몰로토프(외교), 라브렌티 베리야(내무부와 비밀경찰)의 3인 체제로 움직였다. 말렌코프는 중공업 대신 소비재 생산을 늘려 생활수준을 끌어올리고, 농민 세금을 깎고 국가 수매가를 올리자고 주장했다.',
                en: 'When Stalin died on 5 March 1953, Georgy Malenkov succeeded him as Chairman of the Council of Ministers and highest-ranking secretary of the Central Committee. On 14 March, however, his Presidium colleagues made him give up the Secretariat, leaving Nikita Khrushchev as acting First Secretary. For a time the country was run by a troika — Malenkov over the government, Vyacheslav Molotov over diplomacy and Lavrentiy Beria over the interior ministry and secret police. Malenkov argued for shifting the economy from heavy industry to consumer goods to raise living standards, for tax cuts for peasants and for higher state prices for grain.',
                sources: [S.malenkov],
            },
            {
                ko: '스탈린식 경찰 테러의 화신이던 베리야는 이 석 달 동안 오히려 개혁가로 나섰다. 4월 4일 「의사들의 음모」 사건 피해자들을 풀어 주었고, 굴라크 수감자의 거의 절반인 약 120만 명을 내보내는 사면을 공포했다. 독일 문제에서도 그는 동독을 「소련군이 지탱하는, 진짜 국가도 아닌 것」이라고 말했다. 다른 지도자들은 그가 독일 통일을 미국의 지원과 맞바꿀 생각을 한다고 의심했다.',
                en: 'In those three months Beria, the embodiment of Stalinist police terror, paradoxically emerged as a reformer. On 4 April he released the victims of the Doctors’ Plot, and he had an amnesty promulgated that freed nearly half of the Gulag’s inmates, some 1.2 million people. On Germany he said that the GDR was “not even a real state but one kept in being only by Soviet troops”, and the other leaders suspected him of being ready to trade German reunification for American support.',
                sources: [S.beria],
            },
            {
                ko: '새 집단지도부는 위성국들의 사정이 폭발 직전이라고 보았다. 4월 초 독일 주재 소련 통제위원회가 보낸 보고서는 동독 경제의 참상을 상세히 전했다. 동독을 떠난 사람은 1951년 16만 명, 1952년 18만 2,000명이었고, 1953년에는 넉 달 만에 12만 2,000명이었다. 6월 2일 모스크바에 도착한 독일사회통일당 지도자 발터 울브리히트와 오토 그로테볼에게 소련 지도부는 「독일민주공화국의 정치 상황을 바로잡기 위한 조치에 관하여」라는 지시를 건넸다. 「가속적 사회주의 건설」, 강제 집단화와 사기업 탄압, 교회 압박을 중단하고 중공업 대신 소비재에 투자하라는 내용이었다. 말렌코프는 바꾸지 않으면 파국이 온다고 경고했다. 그러나 지시에는 노동자들이 가장 싫어하던 작업 기준량 인상을 되돌리라는 요구가 없었다.',
                en: 'The new collective leadership judged the satellites to be close to breaking point. In early April a report from the Soviet Control Commission in Germany gave a devastating account of the East German economy: 160,000 people had left the GDR in 1951, 182,000 in 1952 and 122,000 in the first four months of 1953 alone. On 2 June, the day they landed in Moscow, the Socialist Unity Party leaders Walter Ulbricht and Otto Grotewohl were handed the order “On Measures to Improve the Health of the Political Situation in the GDR”: forced collectivisation, the war on private enterprise and the pressure on the Protestant Church were to end, and investment was to shift from heavy industry to consumer goods. Malenkov warned that change was essential to avoid a catastrophe. The order did not, however, demand the reversal of the highly unpopular increase in work quotas.',
                sources: [S.gdr53],
            },
            {
                ko: '헝가리 지도부도 같은 「협의」에 불려 갔다. 6월 13일부터 16일까지 크렘린에서 말렌코프·베리야·몰로토프·흐루쇼프·불가닌·미코얀은 라코시 마차시를 비롯한 헝가리 노동인민당 지도자들을 질책했다. 라코시는 소련식 집단지도를 받아들여 당 지도자 자리는 지키되 총리직은 너지 임레에게 넘겨야 했다. 이렇게 소련에서 시작된 「새 노선」은 동독에서 처음 공표된 뒤 다른 동구권 나라들로 퍼졌다. 소비재 확대, 테러 중단, 이념 통제 완화가 그 세 축이었다.',
                en: 'The Hungarian leaders were summoned to a similar “consultation”. From 13 to 16 June in the Kremlin, Malenkov, Beria, Molotov, Khrushchev, Bulganin and Mikoyan dressed down Mátyás Rákosi and the other leaders of the Hungarian Working People’s Party. Rákosi had to accept the Soviet model of collective leadership: he kept the party leadership but gave up the premiership to Imre Nagy. Initiated in the Soviet Union and first announced in East Germany, the New Course was thus extended to the other Eastern bloc countries; its three thrusts were more consumer goods, an end to terror and a relaxation of ideological standards.',
                sources: [S.rainer, S.rakosi, S.newcourse],
            },
            {
                ko: '야노시 라이너가 회의록으로 재구성한 크렘린 회담은 거의 공개 재판이었다. 말렌코프는 헝가리 동지들이 결함을 과소평가한다고 잘랐고, 가장 많은 숫자를 들고 나온 베리야는 「인구 950만의 헝가리에서 150만 명을 기소한 것이 용납되는가」라고 물으며 라코시가 국가보안기관을 직접 지휘하고 수사에 개입했다고 비난했다. 국방장관 퍼르커시 미하이는 버터 이슈트반으로 바뀌어야 했다. 참석자들의 회고에 따르면 베리야는 라코시가 돕지 않으면 「등뼈를 부러뜨리겠다」고까지 말했다. 라코시는 「이런 가르침을 진작 받지 못한 것이 유감」이라고 답했다.',
                en: 'The Kremlin meeting, which János Rainer has reconstructed from its minutes, was close to a trial. Malenkov told the Hungarians that they underestimated their shortcomings; Beria, who used the most figures, asked whether it was “acceptable in Hungary, with its population of 9,500,000, to have instituted proceedings against 1,500,000 people”, and denounced Rákosi for personally directing state security and intervening in investigations. The defence minister Mihály Farkas was to be replaced by István Bata. According to recollections, Beria said that if Rákosi did not help, “we will break his spine.” Rákosi replied: “I very much regret that I was not taught a lesson like this before.”',
                sources: [S.rainer],
            },
        ],
    },
    {
        heading: { ko: '1953년: 플젠, 동베를린, 부다페스트', en: '1953: Plzeň, East Berlin, Budapest' },
        paragraphs: [
            {
                ko: '첫 폭발은 새 노선이 닿기도 전에 체코슬로바키아에서 일어났다. 1953년 5월 31일 밤 10시 체코슬로바키아 공산당 정부는 오래 부인해 온 화폐개혁을 발표했다. 저축은 50 대 1, 임금은 5 대 1로 바뀌었고, 값싼 배급이 끝나고 작업 기준량이 올라갔다. 플젠의 슈코다 공장 야간조가 파업에 들어갔고, 이튿날 시내로 행진한 노동자들은 시청을 점거하고 바리케이드를 쌓았으며 일당 지배를 끝내라는 구호를 내걸었다. 정부는 경찰 2개 대대 약 8,000명과 전차 80대를 갖춘 군 병력 2,500명을 보내 진압했다. 부상자는 200여 명이었고 사망자는 없었으며, 2,000명 넘게 붙잡혔다. 보헤미아와 모라비아의 대공장 19곳에서도 파업이 일어나 약 36만 명이 참여했다.',
                en: 'The first explosion came in Czechoslovakia, before the New Course had arrived. At 10 p.m. on 31 May 1953 the Communist government announced the currency reform it had long denied: savings were devalued at fifty to one and wages at five to one, subsidised rationing ended and work quotas rose. The night shift at the Škoda Works in Plzeň struck; the next day workers marched into the city, stormed the city hall, built barricades and put up slogans demanding the end of one-party rule. The government sent two police battalions of about 8,000 men and an army unit of 2,500 men with 80 tanks. Some 200 people were injured, none fatally, and more than 2,000 were taken prisoner. Strikes also broke out at 19 large plants across Bohemia and Moravia, involving an estimated 360,000 workers.',
                sources: [S.plzen],
            },
            {
                ko: '당은 사건을 「제국주의 첩자」의 도발로 규정했고 이 공식 설명은 1989년까지 유지되었다. 6월 8일 화폐개혁을 뺀 5월 31일의 다른 조치들이 철회되었다. 파업 물결과 모스크바의 압력이 겹치면서 체코슬로바키아도 생활수준 개선에 초점을 둔 새 노선 쪽으로 조심스럽게 돌아섰다. 1953년 9월 정부는 소매가 인하와 이듬해 주택 4만 호 건설 계획을 발표했고, 1956년 가을까지 소매가는 여섯 차례 내렸다.',
                en: 'The party presented the events as provoked by agents of imperialism, the official explanation until 1989. On 8 June the measures of 31 May were recalled, except for the currency reform. The strikes, together with pressure from Moscow, pushed the Czechoslovak party towards a tentative New Course focused on workers’ living standards: in September 1953 the government announced retail price cuts and plans to build 40,000 homes in 1954, and between autumn 1953 and autumn 1956 retail prices were reduced six times.',
                sources: [S.plzen],
            },
            {
                ko: '동독에서는 새 노선이 도리어 불을 댕겼다. 사회통일당은 6월 11일 당 기관지에 새 노선을 실어 지난 잘못을 인정했지만, 10퍼센트 작업 기준량 인상은 그대로 두었다. 기준량 인상과 물가 인상을 합치면 월급을 33퍼센트 깎는 셈이었다. 6월 16일 동베를린 스탈린알레 건설 현장 노동자 300명이 파업에 나섰고, 이튿날 시위는 전국 약 700곳에서 100만 명 넘게 참여한 봉기로 번졌다. 인구 5만이 넘는 도시 24곳 모두에서 소요가 일었고, 베를린 밖에서만 약 33만 9,000명이 시위에, 22만 5,000명 넘게 파업에 나섰다. 소련군 전차가 동베를린에 들어와 계엄을 선포하고 군중에게 발포했다. 사망자는 독일의 국제방송 도이체벨레가 확인한 민간인 55명에서 최근 추산 최소 125명까지 갈리고, 최대 1만 명이 구금되었다. 봉기의 경과는 ' + L('1953년 동독 6월 봉기', 'east-german-uprising-1953') + ' 항목에, 그 배경이 된 국가 건설은 ' + L('동독: 소련 군정에서 독일민주공화국까지', 'soviet-zone-gdr-1945-1949') + ' 항목에 있다.',
                en: 'In East Germany the New Course lit the fuse instead. On 11 June the Socialist Unity Party published it in its newspaper and admitted past mistakes, but kept the 10 per cent increase in work quotas which, with price rises, amounted to a 33 per cent cut in monthly pay. On 16 June 300 construction workers on East Berlin’s Stalinallee went on strike; the next day the protest became an uprising of over a million people in some 700 localities. Every one of the GDR’s 24 cities of more than 50,000 inhabitants saw unrest; outside Berlin some 339,000 people took part in demonstrations and over 225,000 went on strike. Soviet tanks entered East Berlin, martial law was declared and troops fired into crowds. Deutsche Welle counts 55 confirmed civilian deaths, newer estimates at least 125, and up to 10,000 people were detained. The uprising is covered in ' + Le('The East German uprising of 1953', 'east-german-uprising-1953') + ', and the state-building behind it in ' + Le('East Germany: from Soviet military administration to the German Democratic Republic', 'soviet-zone-gdr-1945-1949') + '.',
                sources: [S.gdr53],
            },
            {
                ko: '봉기는 울브리히트의 몰락으로 이어질 뻔했다. 동베를린의 소련 대표들은 6월 24일 모스크바에 그를 서기장에서 물리고 집단지도로 가자고 보고했다. 그러나 6월 26일 모스크바에서 베리야가 체포되자 분위기가 바뀌었다. 7월 2일 소련 지도부는 동독의 정치 개편을 미루고, 인기는 없어도 경험 많고 믿을 만한 스탈린주의 지도자를 밀어주는 쪽을 택했다. 울브리히트는 7월 말 빌헬름 차이서와 루돌프 헤른슈타트 등 반대파를 정치국에서 몰아냈고, 소련은 경제 원조를 늘리고 배상금 징수를 그해 말에 끝내기로 했다. 베리야는 12월 23일 처형되었다(' + L('베리야의 몰락', 'beria-purge') + ').',
                en: 'The uprising nearly cost Ulbricht his post. On 24 June the senior Soviet officials in East Berlin reported to Moscow that he should be removed as General Secretary and that the party should move to collective leadership. But on 26 June Beria was arrested in Moscow, and on 2 July the Soviet leadership shelved far-reaching changes in East Germany in favour of an experienced, reliable, if Stalinist and unpopular, ruler. In late July Ulbricht expelled his main opponents, Wilhelm Zaisser and Rudolf Herrnstadt among them, from the Politburo, while Moscow increased economic aid and ended reparation payments by the end of the year. Beria was executed on 23 December (' + Le('The Fall of Beria', 'beria-purge') + ').',
                sources: [S.gdr53, S.beria],
            },
            {
                ko: '헝가리에서는 개혁이 위로부터 왔다. 7월 4일 국회에서 선출된 너지 정부의 강령 연설은 라디오로 전국에 방송되었다. 가을까지 사면 조치가 약 74만 8,000명에게 미쳤고, 수감자 약 4만 명 가운데 1만 5,761명이 풀려났으며, 호르토바지 강제이주 수용소와 국가보안기관(ÁVH)의 수용소들이 문을 닫아 헝가리의 굴라크는 사실상 사라졌다. 농민들은 협동조합을 떠나기 시작해, 1953년 말까지 조합원이 37만 6,000명에서 25만 명으로 줄었다. 그러나 라코시는 당 제1서기로 남아 있었다. 그 과정은 ' + L('헝가리의 새 노선', 'hungary-new-course-1953') + ' 항목에 있다.',
                en: 'In Hungary reform came from above. On 4 July the newly elected Nagy government presented its programme to parliament in a speech broadcast nationwide. By the autumn the amnesty measures had affected almost 748,000 people; 15,761 of some 40,000 prisoners were released, and the Hortobágy deportation camp and the ÁVH internment camps were closed, so that the Hungarian gulag more or less ceased to exist. Peasants began to leave the cooperatives, whose membership fell from 376,000 to 250,000 by the end of 1953. Rákosi, however, remained party leader. The story is told in ' + Le('Hungary’s New Course', 'hungary-new-course-1953') + '.',
                sources: [S.rainer, S.rakosi],
            },
        ],
    },
    {
        heading: { ko: '후퇴와 재반격, 1954–1955년', en: 'Retreat and counter-attack, 1954–1955' },
        paragraphs: [
            {
                ko: '새 노선의 운명은 모스크바의 권력투쟁에 묶여 있었다. 라코시는 자신을 가장 매섭게 공격하던 베리야가 사라지자 반격에 나섰고, 부당한 재판을 조사하는 위원회의 위원장 자리를 차지해 숙청 피해자의 복권을 되돌리려 했다. 1955년 2월 말렌코프가 소비재 편중과 베리야와의 친분을 이유로 총리에서 물러나자 그의 경공업 우선 정책도 버려졌다. 헝가리에서는 3월 9일 중앙지도부가 너지를 「우익 편향」으로 단죄했고, 4월 14일 당직을 박탈당한 너지는 18일 총리에서 해임되었다. 후임은 라코시의 측근인 헤게뒤시 언드라시였다.',
                en: 'The fate of the New Course was tied to the power struggle in Moscow. With Beria, his most hostile critic, gone, Rákosi counter-attacked, taking the chair of the commission set up to investigate the unlawful trials and trying to reverse the rehabilitation of show-trial victims. When Malenkov was forced out as premier in February 1955, accused among other things of favouring consumer goods and of closeness to Beria, his light-industry programme was abandoned as well. In Hungary the Central Committee condemned Nagy for “rightist deviation” on 9 March; he was stripped of his party offices on 14 April and dismissed as prime minister on 18 April, to be succeeded by Rákosi’s confidant András Hegedüs.',
                sources: [S.rakosi, S.malenkov, S.hunrev],
            },
            {
                ko: '그러나 1953년 이전으로 완전히 돌아갈 수는 없었다. 스탈린이 아니라 흐루쇼프가 소련을 이끄는 한 라코시는 너지를 쇼 재판에 세울 수 없었고, 사람들은 이미 「살 만한」 공산주의를 맛본 뒤였다. 너지는 자신에 대한 비판에 답하는 글들을 써서 100명 가까운 사람에게 돌려 읽혔고, 그 둘레에 당내 반대파가 모였다. 이 글들은 1957년 서방에서 『공산주의에 관하여: 새 노선을 위한 변호』로 출간되었다. 폴란드에서는 비밀경찰 간부 유제프 시비아트워의 망명과 폭로로 공안부가 약해졌고, 1951년부터 갇혀 있던 브와디스와프 고무우카가 1954년 풀려났다.',
                en: 'Yet a full return to the years before 1953 was impossible. With Khrushchev rather than Stalin at the head of the Soviet Union, Rákosi could not put Nagy on trial, and people had already experienced a more livable version of communism. Nagy wrote studies answering the charges against him and lent them to nearly a hundred readers, around whom an opposition within the party took shape; they were published in the West in 1957 as On Communism: In Defense of the New Course. In Poland the much-publicised defection of the secret police officer Józef Światło weakened the Ministry of Public Security, and Władysław Gomułka, imprisoned since 1951, was released in 1954.',
                sources: [S.rakosi, S.nagy, S.polocto],
            },
            {
                ko: '1955년 5월에는 동유럽의 국제적 틀이 바뀌었다. 5월 9일 서독이 북대서양조약기구에 가입하자, 5월 14일 소련과 동구권 7개국은 바르샤바에서 「우호·협력·상호원조 조약」을 맺었다. 조약은 회원국의 독립과 주권 존중, 내정 불간섭을 원칙으로 내걸었다. 이튿날인 5월 15일에는 오스트리아 국가조약이 조인되어 점령군이 그해 10월 25일까지 철수했고, 오스트리아는 영세중립을 선언했다. 소련이 군대를 빼고 중립을 받아들인 이 선례는 1년 반 뒤 헝가리에서 다시 불려 나온다(' + L('바르샤바 조약 기구 창설', 'warsaw-pact') + ').',
                en: 'In May 1955 the international framework of Eastern Europe changed. After West Germany joined NATO on 9 May, the Soviet Union and seven Eastern bloc states signed the Treaty of Friendship, Cooperation and Mutual Assistance in Warsaw on 14 May; its stated principles included respect for the independence and sovereignty of member states and non-interference in their internal affairs. The next day, 15 May, the Austrian State Treaty was signed; the last occupation troops left by 25 October, and Austria declared its permanent neutrality. This precedent of Soviet withdrawal and neutrality would be invoked in Hungary eighteen months later (' + Le('The Founding of the Warsaw Pact', 'warsaw-pact') + ').',
                sources: [S.wp, S.ast, S.hunrev],
            },
            {
                ko: '흐루쇼프는 유고슬라비아와도 화해했다. 1955년 5월 27일부터 6월 2일까지 베오그라드를 찾은 그는 티토와 「베오그라드 선언」에 서명해 유고슬라비아 내정 불간섭과 각국의 서로 다른 사회주의 발전 경로를 인정했다. 1948년 이래의 단절(' + L('티토-스탈린 결별', 'tito-stalin-split') + ')을 끝낸 1949년 러이크를 「티토의 사냥개」로 몰아 처형하며 반티토 숙청의 본보기로 삼았던 라코시는 헝가리·유고슬라비아 화해의 걸림돌이었고, 1956년 7월 중앙위원회에서 그는 미코얀의 사퇴 권고 뒤에 「티토가 내 목을 요구했다」는 사정이 있었을지 모른다고 말했다. 1956년 4월 17일에는 유고슬라비아 파문의 무대였던 코민포름이 해산되었다.',
                en: 'Khrushchev also made peace with Yugoslavia. Visiting Belgrade from 27 May to 2 June 1955, he signed with Tito the Belgrade declaration, which guaranteed non-interference in Yugoslavia’s internal affairs and legitimised different paths of socialist development. Ending the break of 1948 (' + Le('The Tito–Stalin Split', 'tito-stalin-split') + '), the declaration embarrassed Rákosi, who in 1949 had had Rajk executed as Tito’s “chained dog” to set an example for the anti-Titoist purges; he was the main obstacle to Hungarian–Yugoslav reconciliation, and in July 1956 he told the Central Committee that Mikoyan’s suggestion that he step down might have been influenced by the fact that “Tito demanded my head”. On 17 April 1956 the Cominform, the body that had excommunicated Yugoslavia, was dissolved.',
                sources: [S.belgrade, S.rajk, S.rakosi, S.cominform],
            },
        ],
    },
    {
        heading: { ko: '1956년 2월: 비밀연설의 충격', en: 'February 1956: the shock of the Secret Speech' },
        paragraphs: [
            {
                ko: '1956년 2월 25일 흐루쇼프는 소련 공산당 제20차 대회의 비공개 회의에서 「개인숭배와 그 결과에 대하여」라는 보고로 스탈린의 숙청과 개인숭배를 고발했다. 연설은 「공개 금지」로 분류되었지만 소련 곳곳의 당 회의에서 낭독되었고, 몇 주 만에 서방에 알려져 6월 5일 『뉴욕 타임스』에 전문이 실렸다. 흐루쇼프는 동유럽 동맹국과 상의 없이 연설했고, 스탈린의 후원으로 권좌에 오른 지도자들은 하루아침에 기반을 잃었다. 대회와 연설의 내용은 ' + L('제20차 당대회와 비밀연설', 'twentieth-party-congress') + ' 항목에 있다.',
                en: 'On 25 February 1956, at a closed session of the Twentieth Congress of the Soviet Communist Party, Khrushchev denounced Stalin’s purges and personality cult in his report “On the Cult of Personality and Its Consequences”. Classified as “not for publication”, the speech was nonetheless read out at party meetings across the Soviet Union, became known in the West within weeks and was printed in full by The New York Times on 5 June. Khrushchev had not consulted his East European allies, and leaders who owed their positions to Stalin’s patronage suddenly found the ground giving way. The congress and the speech are covered in ' + Le('The Twentieth Party Congress and the Secret Speech', 'twentieth-party-congress') + '.',
                sources: [S.secret],
            },
            {
                ko: '충격은 폴란드에서 가장 컸다. 대회에 참석했던 폴란드 통일노동자당 서기장 볼레스와프 비에루트는 독감이 폐렴으로 번져 모스크바에 남았다가 3월 12일 심장마비로 숨졌다. 장례에 온 흐루쇼프가 지켜보는 가운데 3월 20일 중앙위원회는 개혁파(푸와비파)와 강경파(나톨린파) 사이의 절충 후보로 에드바르트 오하프를 제1서기로 뽑았다. 당 서기국은 동구권에서 유일하게 비밀연설을 널리 돌리기로 했고, 3월 말부터 4월 초까지 전국에서 열린 수천 차례의 당 회의에서는 카틴 학살과 소련군 주둔, 고무우카 투옥 같은 금기가 거론되었다.',
                en: 'The shock was greatest in Poland. Bolesław Bierut, General Secretary of the Polish United Workers’ Party, had stayed in Moscow after the congress, hospitalised with influenza that turned into pneumonia, and died of a heart attack on 12 March. With Khrushchev, who had come for the funeral, looking on, the Central Committee unanimously elected Edward Ochab First Secretary on 20 March as a compromise between the reformist Puławy and hardline Natolin factions. The party Secretariat decided, uniquely in the Eastern bloc, to circulate the Secret Speech widely, and at thousands of party meetings in late March and early April taboo subjects were raised — the Katyn massacre, the Soviet military presence, the imprisonment of Gomułka.',
                sources: [S.bierut, S.ochab, S.polocto],
            },
            {
                ko: '헝가리에서는 라코시가 3월 28일 1949년 쇼 재판으로 처형된 러이크 라슬로를 복권하면서도 자기 책임은 덮으려 했다. 그러나 비판은 당 조직과 작가동맹, 신문으로 번졌고, 너지 시절에 만들어진 토론 모임 페퇴피 서클이 되살아났다. 6월 28일 언론 자유 토론회에서는 너지의 복귀를 외치는 목소리가 나왔다. 모스크바는 6월 미하일 수슬로프를, 7월에는 아나스타스 미코얀을 부다페스트에 보냈고, 7월 18일 라코시는 제1서기에서 물러나 소련으로 떠났다. 후임은 그의 측근 게뢰 에르뇌였다. 라코시 체제와 그 몰락은 ' + L('헝가리: 소농당의 승리에서 러이크 재판까지', 'hungary-1945-1949') + '와 ' + L('헝가리 혁명', 'hungarian-revolution') + ' 항목에서 이어진다.',
                en: 'In Hungary Rákosi rehabilitated László Rajk, executed after the 1949 show trial, on 28 March while trying to gloss over his own culpability. Criticism nonetheless spread through the party, the Writers’ Union and the press, and the Petőfi Circle, a debating club founded in Nagy’s time, was revived; at its press-freedom debate on 28 June voices called for Nagy’s return. Moscow sent Mikhail Suslov to Budapest in June and Anastas Mikoyan in July, and on 18 July Rákosi resigned as First Secretary and left for the Soviet Union. His successor was his second-in-command, Ernő Gerő. The Rákosi regime and its fall are followed in ' + Le('Hungary from the Smallholders’ victory to the Rajk trial', 'hungary-1945-1949') + ' and ' + Le('The Hungarian Revolution', 'hungarian-revolution') + '.',
                sources: [S.rajk, S.kramer, S.rakosi],
            },
            {
                ko: '게뢰의 양보는 오히려 위기를 키웠다. 10월 6일 러이크와 다른 숙청 희생자 세 명의 유해가 부다페스트에 다시 묻힐 때 수십만 명이 지켜보았다. 크레이머에 따르면 게뢰는 이 재매장을 티토의 환심을 사고 긴장을 누그러뜨릴 기회로 보았지만, 12일 소련 대사 유리 안드로포프에게 그것이 당 지도부에 「막대한 타격」을 주었다고 털어놓았다. 너지는 10월 13일 당에 복귀했고, 게뢰는 10월 15일부터 22일까지 유고슬라비아에 머물렀다. 그가 자리를 비운 사이 폴란드의 소식이 헝가리를 달구었다.',
                en: 'Gerő’s concessions only deepened the crisis. On 6 October the remains of Rajk and three other victims of the purges were reburied in Budapest as a crowd of several hundred thousand looked on. According to Kramer, Gerő had seen the reburial as a way to ingratiate himself with Tito and defuse tensions, but on 12 October he confided to the Soviet ambassador Yuri Andropov that it had dealt “a massive blow” to the party leadership. Nagy was readmitted to the party on 13 October, and Gerő spent 15–22 October in Yugoslavia; while he was away, news from Poland stirred Hungary further.',
                sources: [S.kramer, S.nagy],
            },
        ],
    },
    {
        heading: { ko: '폴란드: 포즈난에서 10월로', en: 'Poland: from Poznań to October' },
        paragraphs: [
            {
                ko: '1956년 6월 28일 포즈난의 체겔스키 공장(당시 이름은 스탈린 금속공장) 노동자들이 임금과 세금 문제로 거리에 나섰고, 미츠키에비치 광장 일대에 약 10만 명이 모였다. 시위는 공안부 건물을 둘러싼 총격전으로 번졌고, 스타니스와프 포프와프스키가 지휘한 군과 국내보안군 약 1만 명과 전차 수백 대가 도시를 진압했다. 사망자는 국가기억연구소(IPN) 연구자 우카시 야스트솜프의 57명에서 같은 연구소 스타니스와프 얀코비아크의 100여 명까지 추산이 갈린다. 당은 처음에 시위대를 「도발자이자 제국주의 첩자」로 몰았으나 곧 임금 인상과 개혁을 약속했다. 봉기와 재판은 ' + L('포즈난 봉기', 'poznan-1956') + ' 항목에 있다.',
                en: 'On 28 June 1956 workers of Poznań’s Cegielski Factories (then named after Stalin) took to the streets over pay and taxes, and some 100,000 people gathered around Adam Mickiewicz Square. The protest turned into a gun battle around the Public Security building, and about 10,000 soldiers and Internal Security Corps troops with hundreds of tanks under Stanislav Poplavsky suppressed the city. Estimates of the dead range from 57, according to Łukasz Jastrząb of the Institute of National Remembrance (IPN), to slightly over 100, according to his IPN colleague Stanisław Jankowiak. The party first branded the protesters “provocateurs and imperialist agents” but soon promised wage rises and reform. The rising and the trials that followed are covered in ' + Le('The Poznań Uprising', 'poznan-1956') + '.',
                sources: [S.poznan, S.polocto],
            },
            {
                ko: '포즈난 이후 개혁파는 고무우카의 복귀를 원했다. 1948년 「우익 민족주의 편향」으로 밀려나 1951년 투옥되었던 그는 스탈린주의의 추문에 연루되지 않았다는 점에서 개혁파와 강경파 모두에게 받아들여질 수 있었다. 고무우카는 개혁을 실행할 실권을 요구했고, 특히 포즈난 진압에 군을 보낸 소련 원수 출신 국방장관 콘스탄틴 로코솝스키를 정치국과 국방부에서 내보내라는 조건을 걸었다. 오하프는 이를 받아들여 10월 19일 열린 중앙위원회 제8차 전원회의에 고무우카를 제1서기 후보로 내세웠다.',
                en: 'After Poznań the reformers wanted Gomułka back. Pushed out in 1948 for “right-wing nationalist deviation” and imprisoned in 1951, he was untouched by the scandals of Stalinism and so acceptable to reformers and hardliners alike. Gomułka insisted on real power to carry out reforms, and in particular on the removal from the Politburo and the defence ministry of Konstantin Rokossovsky, the Soviet marshal serving as Polish defence minister, who had sent troops against the Poznań workers. Ochab agreed and proposed Gomułka as First Secretary at the Eighth Plenum of the Central Committee, which opened on 19 October.',
                sources: [S.polocto, S.gomulka, S.rokoss],
            },
            {
                ko: '같은 날 흐루쇼프는 미코얀·불가닌·몰로토프·카가노비치·코네프를 이끌고 바르샤바로 날아왔다. 폴란드 주둔 소련군 기갑사단들은 기지를 떠나 수도로 움직였고, 멈추라는 명령을 받았을 때 바르샤바에서 100킬로미터 거리에 있었다. 크레이머에 따르면 로코솝스키의 영향은 정규군에 머물렀고, 내무부 소속 국내보안군(KBW) 부대들은 새 지도부를 지키려고 바르샤바 둘레에 진지를 잡았다. 폴란드가 소련과 충돌하는 동시에 내전에 빠질 수 있는 상황이었다. 고무우카는 개혁은 내정 문제이며 폴란드는 공산주의도 소련과의 조약도 버리지 않을 것이라고 흐루쇼프를 설득했다.',
                en: 'That same day Khrushchev flew to Warsaw with Mikoyan, Bulganin, Molotov, Kaganovich and Konev. Soviet armoured divisions stationed in Poland left their bases and moved towards the capital; when ordered to halt they were 100 km from Warsaw. According to Kramer, Rokossovsky’s influence did not extend to the Internal Security Corps (KBW) units of the interior ministry, which took up positions around Warsaw to defend the new leadership, so that for a brief while Poland seemed on the verge of civil war as well as of conflict with the Soviet Union. Gomułka assured Khrushchev that the reforms were internal matters and that Poland had no intention of abandoning communism or its treaties with the Soviet Union.',
                sources: [S.polocto, S.kramer],
            },
            {
                ko: '10월 21일 소련 공산당 간부회는 만장일치로 「군사 개입을 삼가고」 「인내를 보이기로」 결정했다. 흐루쇼프는 24일 간부회에서 「폴란드와 무력 충돌할 구실을 찾기는 쉽지만, 그 충돌을 끝낼 길을 찾기는 매우 어렵다」고 말했다. 같은 날 바르샤바 집회에 약 50만 명이 모였고, 고무우카는 소련과의 정치·군사 유대를 강조하며 바르샤바 조약에서 멀어지려는 이들을 비판했다. 중국 공산당도 고무우카를 지지했다. 11월 중순까지 폴란드는 대소 채무 탕감, 강제 집단화 포기, 가톨릭 교회와의 관계 완화를 얻어 냈고, 로코솝스키는 모스크바로 소환되었으며 스테판 비신스키 추기경이 풀려났다.',
                en: 'On 21 October the CPSU Presidium unanimously decided to “refrain from military intervention” and to “display patience”. Khrushchev told an expanded Presidium meeting on the 24th that “finding a reason for an armed conflict [with Poland] now would be very easy, but finding a way to put an end to such a conflict later on would be very hard.” That day some 500,000 people attended a rally in Warsaw, where Gomułka called for stronger ties with the Soviet Union and condemned those trying to steer Poland away from the Warsaw Pact; the Chinese Communist Party, too, supported Gomułka. By mid-November Poland had won the cancellation of its debts, the abandonment of forced collectivisation and an easing of policy towards the Catholic Church; Rokossovsky was recalled to Moscow and Cardinal Stefan Wyszyński was released.',
                sources: [S.kramer, S.polocto],
            },
        ],
    },
    {
        heading: { ko: '헝가리 혁명과 두 개의 결말', en: 'The Hungarian Revolution and two outcomes' },
        paragraphs: [
            {
                ko: '10월 23일 부다페스트의 대학생들은 폴란드의 변화를 지지하고 같은 변화를 요구하는 시위를 열었다. 오후 벰 장군 동상 앞에 약 2만 명이 모였고, 저녁에는 라디오 방송국 앞에서 국가보안기관과 군중 사이에 총격이 시작되었다. 게뢰는 그날 소련군 개입을 요청했고, 24일 새벽 소련군 전차가 부다페스트에 들어왔다. 같은 날 너지가 총리가 되었다. 전국에서 노동자평의회와 혁명위원회가 당 기구를 대신해 지방 행정을 넘겨받았다. 혁명의 전개와 진압은 ' + L('헝가리 혁명', 'hungarian-revolution') + ' 항목에 있다.',
                en: 'On 23 October students in Budapest held a demonstration to express approval of the developments in Poland and to demand similar changes at home. Some 20,000 people gathered at the statue of General Bem in the afternoon, and in the evening shooting began between the ÁVH and the crowd outside the radio building. Gerő requested Soviet intervention that day, and in the early hours of the 24th Soviet tanks entered Budapest; the same day Nagy became prime minister. Across the country workers’ councils and revolutionary committees took over local government from the defunct party apparatus. The course of the revolution and its suppression are covered in ' + Le('The Hungarian Revolution', 'hungarian-revolution') + '.',
                sources: [S.kramer, S.hunrev],
            },
            {
                ko: '모스크바는 한동안 흔들렸다. 10월 28일 휴전 뒤 소련군이 부다페스트에서 물러나기 시작했고, 30일 소련 정부는 사회주의 국가들과의 관계에서 「평등 원칙 위반」을 인정하고 바르샤바 조약국 주둔 소련군의 재검토를 약속하는 선언을 냈다. 크레이머는 말린 메모를 근거로 30일 간부회에 철수 쪽 합의가 있었다고 본다. 그러나 31일 흐루쇼프는 태도를 뒤집었다. 29일 이스라엘이 이집트를 침공했고, 30일 영국과 프랑스가 최후통첩을 보낸 뒤 31일 이집트를 폭격하기 시작했다. 크레이머는 수에즈 위기가 헝가리 문제를 빨리 결판내야 한다는 강한 동기가 되었다고 본다. 반면 베케시 처버가 정리한 연구에 따르면 헝가리 사태는 영국·프랑스·이스라엘이 비밀리에 계획한 공격의 시점에 영향을 주지 않았다. 그사이 게뢰 등 강경파는 소련으로 떠났고, 너지 정부는 30일 1945년 연립 정당들에 기초한 복수정당제를 되살리겠다고 발표했다. 11월 1일 너지 정부는 바르샤바 조약 탈퇴와 중립을 선언했다.',
                en: 'For a time Moscow wavered. After the ceasefire of 28 October Soviet troops began to leave Budapest, and on the 30th the Soviet government issued a declaration admitting “violations of the principle of equality” in relations with other socialist states and promising to re-examine the Soviet troop presence in the Warsaw Pact countries. Drawing on the Malin notes, Kramer finds a consensus in the Presidium on the 30th in favour of withdrawal; on the 31st, however, Khrushchev reversed course. Israel had invaded Egypt on 29 October, and Britain and France, after an ultimatum on the 30th, began bombing Egyptian cities on the 31st; Kramer concludes that the Suez Crisis gave the Soviet leaders a powerful incentive to settle Hungary quickly and decisively. Research summarised by Csaba Békés shows, conversely, that the Hungarian events did not affect the timing of the secretly planned Anglo-French-Israeli attack. Meanwhile Gerő and the other hard-liners had left for the Soviet Union, and on the 30th the Nagy government announced its intent to restore a multi-party system based on the coalition parties of 1945. On 1 November it declared Hungary’s withdrawal from the Warsaw Pact and its neutrality.',
                sources: [S.kramer, S.hunrev, S.bekes, S.nagy],
            },
            {
                ko: '개입 결정 뒤 흐루쇼프는 동맹국의 동의를 모았다. 모스크바에 머물던 류사오치는 그동안 헝가리 노동계급이 스스로 봉기를 수습하게 두자는 마오쩌둥의 견해를 전해 왔지만, 31일 간부회는 공항에서 중국 대표단에 새 결정을 알렸다. 흐루쇼프는 브레스트에서 고무우카를, 부쿠레슈티에서 루마니아·체코슬로바키아·불가리아 지도자들을 만났다. 폴란드 정치국은 11월 1일 소련군 투입을 비판했다가 헝가리의 조약 탈퇴와 중립 선언 뒤 태도를 바꾸었다. 11월 2일 밤 브리오니 섬에서 열 시간 동안 흐루쇼프와 말렌코프를 만난 티토는 개입에 동의했고, 새 정부 수반으로 페렌츠 뮌니히 대신 숙청 피해자였던 카다르 야노시를 추천했다.',
                en: 'Having decided to intervene, Khrushchev gathered his allies’ consent. Liu Shaoqi, in Moscow since 23 October, had been relaying Mao Zedong’s view that the Hungarian working class should be allowed to put down the uprising on its own; on the 31st the whole Presidium went to the airport to tell the departing Chinese delegation of the new decision. Khrushchev met Gomułka in Brest and the Romanian, Czechoslovak and Bulgarian leaders in Bucharest. The Polish Politburo condemned the use of Soviet troops on 1 November but modified its position after Hungary’s withdrawal from the Pact and declaration of neutrality. On the night of 2 November, in ten hours of talks on the island of Brioni, Tito agreed with Khrushchev and Malenkov on intervention and urged them to install János Kádár, a prisoner of the Stalin-era purges, rather than Ferenc Münnich.',
                sources: [S.kramer, S.hunrev, S.bekes],
            },
            {
                ko: '11월 4일 새벽 코네프 원수가 지휘한 「회오리바람」 작전으로 17개 사단까지 늘어난 소련군이 부다페스트를 공격했고, 카다르는 솔노크에서 「혁명 노동자·농민 정부」를 선포했다. 저항은 체펠과 두너우이바로시 등에서 며칠 더 이어졌다. 사상자 집계는 자료마다 다르다. 헝가리인 약 2,500명과 소련군 약 700명이 죽었다는 추산이 널리 쓰이고, 소련 자료는 소련군 전사 669명, 부상 1,450명, 실종 51명과 헝가리인 희생자 약 4,000명을 든다. 약 20만 명이 나라를 떠났고 대부분 오스트리아로 갔다.',
                en: 'At dawn on 4 November Soviet forces, built up to 17 divisions for Operation Whirlwind under Marshal Konev, attacked Budapest, and Kádár proclaimed a “Revolutionary Workers’ and Peasants’ Government” at Szolnok. Resistance continued for some days in Csepel, Dunaújváros and elsewhere. Casualty counts differ: a widely used estimate is about 2,500 Hungarians and some 700 Soviet soldiers killed, while Soviet sources give 669 Soviet soldiers killed, 1,450 wounded and 51 missing, and about 4,000 Hungarian victims. Some 200,000 people fled the country, most of them to Austria.',
                sources: [S.hunrev, S.bekes],
            },
            {
                ko: '왜 폴란드는 타협으로 끝나고 헝가리는 진압되었는가. 크레이머는 폴란드의 결말이 「어디까지 허용되는가」의 선례가 되었다고 본다. 고무우카는 공산당 체제를 지키고 바르샤바 조약에 남겠다고 약속했지만, 소련 간부회는 곧 헝가리를 「폴란드와 비교할 수 없다」고 결론지었다. 「폴란드 10월」을 다룬 연구들은 헝가리에서는 사회적 항의가 정치체제를 무너뜨렸고 폴란드에서는 체제 안에 흡수되었다고 정리한다. 조해나 그랜빌은 두 위기를 비교하며 기존의 「역사적 요인」, 「인물」, 「중립 선언」 설명을 검토하고, 새 문서들이 이 설명들을 근본적으로 뒤집지는 않지만 고무우카의 입지가 생각보다 불안했고 너지가 처음에는 그가 내린 것으로 기억되는 결정들에 반대했을 수 있다고 덧붙인다.',
                en: 'Why did Poland end in compromise and Hungary in invasion? Kramer argues that the Polish outcome set a precedent of what would be tolerated: Gomułka promised to preserve the Communist system and remain in the Warsaw Pact, whereas the Soviet Presidium soon concluded that there was “no comparison with Poland” in Hungary. Studies of the Polish October sum it up thus: in Hungary social protest destroyed the political system, in Poland it was absorbed into it. Comparing the two crises, Johanna Granville reviews the “historical”, “personality” and “neutrality” theses and finds that the new archival sources do not radically alter them, while suggesting that Gomułka was less secure than once thought and that Nagy may at first have opposed the very decisions for which he is remembered.',
                sources: [S.kramer, S.polocto, S.granville],
            },
        ],
    },
    {
        heading: { ko: '결과와 해석', en: 'Consequences and interpretations' },
        paragraphs: [
            {
                ko: '헝가리에서는 보복이 뒤따랐다. 1990년대 초 연구를 정리한 베케시에 따르면 1956~1959년 3만 5,000명이 혁명 활동으로 조사받았고 2만 6,000명이 재판에 회부되어 2만 2,000명이 형을 받았으며, 1957~1960년 1만 3,000명이 구금되었다. 처형된 사람은 229명이라는 집계와 280~300명이라는 집계가 함께 쓰인다. 너지는 유고슬라비아 대사관을 나서다 납치되어 루마니아로 끌려갔고, 1958년 6월 16일 반역죄로 처형되었다. 카다르는 라코시의 「우리 편이 아니면 적」을 「우리에게 반대하지 않는 자는 우리 편」으로 바꾸어 국내 합의를 구했지만, 대외정책에서는 소련에 끝까지 충실했다.',
                en: 'In Hungary reprisals followed. According to the research of the early 1990s summarised by Békés, 35,000 people were investigated for their activities in the revolution between 1956 and 1959, 26,000 were brought to trial and 22,000 sentenced, and 13,000 were interned between 1957 and 1960; the number executed is given as 229 in one count and 280–300 in another. Nagy was seized as he left the Yugoslav embassy, taken to Romania and executed for treason on 16 June 1958. Kádár turned Rákosi’s “he who is not with us is against us” into “who is not against us is with us” and sought a domestic consensus, while remaining strictly loyal to the Soviet Union in foreign policy.',
                sources: [S.bekes, S.hunrev, S.nagy, S.kadar],
            },
            {
                ko: '폴란드의 성과도 제한적이었다. 토니 켐프웰치는 1956년 폴란드 공산주의자들이 처음으로 사회의 목소리를 듣지 않고는 통치할 수 없다고 인정했으며, 당이 개인농과 가톨릭 교회를 겨냥한 운동이 실패했음을 인정하고 두 세력에게 「사회주의 질서」 안의 영구적 자리를 약속했다고 쓴다. 그러나 경제 합리화에 대한 노동자의 기대와 더 자유로운 공적 생활에 대한 지식인의 열망은 곧 실망으로 끝났고 1970년대에야 되살아났다. 고무우카의 「해빙」은 1960년대에 경직되었고, 경제난과 민심 이반 속에 1970년 권좌에서 밀려났다. 노먼 데이비스는 1956년의 변화를 폴란드가 꼭두각시 국가에서 종속 국가로 바뀐 것이라고 요약했다.',
                en: 'Poland’s gains were limited too. Tony Kemp-Welch writes that in 1956 Polish communists first acknowledged that society could no longer be ruled without listening to its voice, and that the party admitted the failure of its campaigns against private agriculture and the Catholic Church, both of which were promised a permanent place within the “socialist order”; but workers’ hopes for economic rationality and intellectuals’ aspirations for a freer public life were soon disappointed and did not revive until the 1970s. Gomułka’s thaw hardened in the 1960s, and mounting economic problems and popular discontent removed him from power in 1970. Norman Davies sums up the change of 1956 as Poland’s transformation from puppet state to client state.',
                sources: [S.kempwelch, S.polocto],
            },
            {
                ko: '1956년은 서방의 한계도 드러냈다. 베케시가 소개한 기밀 해제 문서에 따르면 미국 국가안보회의는 1956년 7월 위성국에 대한 정치·군사적 개입을 배제했고, 서방은 부다페스트의 봉기에 놀라 소련을 자극하지 않는 신중한 불개입을 지켰다. 서유럽 공산당들은 큰 타격을 입었다. 영국 공산당은 수천 명의 당원을 잃었고, 진압을 보도한 당 기관지 『데일리 워커』 특파원 피터 프라이어는 기사가 검열되자 사직했다가 제명되었다. 프랑스에서도 역사가 에마뉘엘 르루아라뒤리 같은 당원들이 당을 떠났다. 중국 지도자들 가운데 일부는 폴란드와 헝가리의 사태를 중공업만 앞세우고 민생을 소홀히 한 데서 온 위험으로 읽었다.',
                en: 'The year 1956 also exposed the limits of the West. Declassified documents discussed by Békés show that a US National Security Council paper of July 1956 disavowed political and military intervention in the Soviet satellites, and that the Western powers, taken by surprise by the revolt in Budapest, pursued a cautious non-intervention so as not to antagonise the Soviets. Western communist parties suffered heavily: the Communist Party of Great Britain lost thousands of members, and Peter Fryer, the Daily Worker correspondent who reported the suppression, resigned when his dispatches were censored and was expelled; in France members such as the historian Emmanuel Le Roy Ladurie resigned. Some Chinese leaders read the events in Poland and Hungary as showing the danger of overemphasising heavy industry at the expense of people’s livelihoods.',
                sources: [S.bekes, S.hunrev, S.polocto],
            },
            {
                ko: '1990년대 동유럽과 러시아 문서가 열리면서 해석도 달라졌다. 크레이머는 말린 메모가 보여 주는 10월 30일의 철수 합의를 근거로 「아주 희박하나마」 1989년의 사건이 33년 일찍 일어날 가능성이 있었다고 쓴다. 동독 연구에서는 역사가 코리 로스가 사회통일당이 1953년에서 두 교훈을 얻었다고 정리한다. 공장 불만이 번지기 전에 막아야 한다는 것, 그리고 「가속적 사회주의 건설」 같은 강행은 다시 할 수 없다는 것이다. 공장 감시가 강화되고 노동계급 전투단이 만들어졌으며 국가보안부가 커졌다. 1953년과 1956년의 위기는 모스크바가 허용하는 탈스탈린화의 폭을 정했고, 그 경계는 12년 뒤 ' + L('프라하의 봄', 'prague-spring') + '에서 다시 시험되었다.',
                en: 'The opening of East European and Russian archives in the 1990s changed the interpretation. Citing the consensus for withdrawal on 30 October recorded in the Malin notes, Kramer writes that there was a chance, “if only a very slender one”, that the events of 1989 could have occurred 33 years earlier. On East Germany, the historian Corey Ross identifies two lessons the Socialist Unity Party drew from 1953: that shop-floor discontent had to be stopped before it escalated, and that a forced venture like the “accelerated construction of socialism” could never be repeated. Factory surveillance was raised, the Combat Groups of the Working Class were created and the Stasi was expanded. The crises of 1953 and 1956 set the bounds of the de-Stalinisation Moscow would allow, and those bounds were tested again twelve years later in the ' + Le('Prague Spring', 'prague-spring') + '.',
                sources: [S.kramer, S.gdr53],
            },
        ],
    },
];

const event = buildEvent({
    id: 'eastern-europe-crisis-1953-1956',
    title: { ko: '스탈린 사후 동유럽의 위기, 1953–1956', en: 'Eastern Europe after Stalin: the crises of 1953–1956' },
    period: '1953–1956',
    sortOrder: 192,
    question: {
        ko: '스탈린이 죽은 뒤 소련의 새 지도부가 동유럽에 요구한 「새 노선」과 탈스탈린화는 왜 1953년 동베를린과 플젠, 1956년 포즈난과 부다페스트의 봉기로 이어졌으며, 같은 해 폴란드는 타협으로, 헝가리는 무력 진압으로 끝난 까닭은 무엇인가?',
        en: 'Why did the “New Course” and de-Stalinisation that Stalin’s successors demanded of Eastern Europe lead to risings in East Berlin and Plzeň in 1953 and in Poznań and Budapest in 1956, and why did Poland end in compromise while Hungary was crushed by force?',
    },
    summary: {
        ko: '1953년 3월 스탈린이 죽자 말렌코프·베리야·흐루쇼프의 집단지도부는 동독과 헝가리 지도자를 모스크바로 불러 강행 공업화와 테러를 늦추는 「새 노선」을 지시했다. 그러나 개혁은 위기를 먼저 터뜨렸다. 5월 말 체코슬로바키아의 화폐개혁은 플젠 봉기를, 작업 기준량을 그대로 둔 동독의 새 노선은 6월 17일 봉기를 불렀고 둘 다 무력으로 진압되었다. 헝가리에서는 너지 임레가 총리가 되어 수용소를 닫고 사면을 폈지만, 베리야와 말렌코프가 차례로 밀려나자 라코시가 1955년 그를 몰아냈다. 1955년 바르샤바 조약, 오스트리아 중립화, 유고슬라비아와의 화해에 이어 1956년 2월 흐루쇼프의 비밀연설은 스탈린의 후계자들을 흔들었다. 폴란드에서는 비에루트가 죽고 6월 포즈난 봉기를 거쳐 10월 고무우카가 돌아왔고, 흐루쇼프는 바르샤바까지 날아왔다가 무력 개입을 접었다. 폴란드를 지지하는 부다페스트의 시위는 혁명이 되었지만, 너지 정부가 바르샤바 조약 탈퇴와 중립을 선언하자 소련군은 11월 4일 이를 진압하고 카다르 정권을 세웠다.',
        en: 'After Stalin’s death in March 1953 the collective leadership of Malenkov, Beria and Khrushchev summoned the East German and Hungarian leaders to Moscow and ordered a “New Course” that slowed forced industrialisation and terror. Reform, however, set off crises first: Czechoslovakia’s currency reform at the end of May provoked the Plzeň uprising, and the East German New Course, which kept the higher work quotas, provoked the uprising of 17 June; both were put down by force. In Hungary Imre Nagy became prime minister, closed the camps and granted amnesties, but after Beria and then Malenkov fell, Rákosi ousted him in 1955. The Warsaw Pact, Austrian neutrality and reconciliation with Yugoslavia in 1955 were followed in February 1956 by Khrushchev’s Secret Speech, which shook Stalin’s heirs. In Poland Bierut died, the Poznań rising came in June and Gomułka returned in October; Khrushchev flew to Warsaw but gave up military intervention. A Budapest demonstration in support of Poland became a revolution, and when the Nagy government declared withdrawal from the Warsaw Pact and neutrality, Soviet forces crushed it on 4 November and installed Kádár.',
    },
    outcome: {
        ko: '1956년 말 동유럽의 공산당 정권은 모두 살아남았지만 스탈린 시대의 방식으로 돌아가지는 않았다. 폴란드는 고무우카 아래 개인농과 교회를 인정받고 소련 고문단을 내보냈으며, 헝가리는 수만 명이 재판받고 20만 명이 망명한 뒤 카다르의 타협 체제로 들어섰다. 동독의 울브리히트는 1953년 봉기 뒤 오히려 입지를 굳히고 감시 체계를 키웠다. 소련은 체제와 동맹을 유지하는 한에서만 「자기 길」을 허용한다는 경계를 그었고, 서방은 그 경계 안에 개입하지 않는다는 것이 드러났다. 1956년은 서유럽 공산당의 대량 탈당으로도 이어졌다.',
        en: 'By the end of 1956 every Communist regime in Eastern Europe had survived, but none returned to the methods of Stalin’s time. Under Gomułka Poland won recognition for private farming and the Church and sent Soviet advisers home; Hungary, after tens of thousands of trials and some 200,000 refugees, entered Kádár’s regime of compromise; in East Germany Ulbricht emerged from 1953 stronger and expanded the apparatus of surveillance. The Soviet Union drew a line, allowing “separate roads” only so long as the system and the alliance were kept, and the West showed that it would not intervene inside that line. 1956 also brought mass resignations from Western communist parties.',
    },
    sections,
    timeline: [
        ['1953.03.05', '스탈린 사망', 'Death of Stalin', '말렌코프가 총리가 되고 말렌코프·몰로토프·베리야의 3인 체제가 들어섰다.', 'Malenkov became premier, and a troika of Malenkov, Molotov and Beria took over.', 'soviet', P(55.7520, 37.6175, '모스크바', 'Moscow')],
        ['1953.06.01', '플젠 봉기', 'Plzeň uprising', '화폐개혁에 맞선 슈코다 공장 노동자들이 시청을 점거했다가 진압되었다.', 'Škoda workers protesting the currency reform stormed the city hall and were suppressed.', 'czechoslovakia', P(49.7384, 13.3736, '플젠', 'Plzeň')],
        ['1953.06.02', '동독 지도부에 내려진 지시', 'Moscow’s order to the SED', '소련 지도부가 울브리히트와 그로테볼에게 「가속적 사회주의 건설」 중단을 지시했다.', 'The Soviet leaders ordered Ulbricht and Grotewohl to halt the “accelerated construction of socialism”.', ['soviet', 'east-germany']],
        ['1953.06.13', '크렘린의 헝가리 회담', 'Hungarians in the Kremlin', '소련 지도부가 라코시 등을 질책하고 총리직을 너지에게 넘기게 했다.', 'The Soviet leaders dressed down Rákosi and his colleagues and had the premiership passed to Nagy.', ['soviet', 'hungary']],
        ['1953.06.17', '동독 6월 봉기', 'East German uprising', '동베를린 건설 노동자의 파업이 전국 봉기로 번졌고 소련군 전차가 진압했다.', 'A strike of East Berlin builders became a nationwide uprising, crushed by Soviet tanks.', ['east-germany', 'soviet'], P(52.5186, 13.4269, '동베를린 스탈린알레', 'Stalinallee, East Berlin')],
        ['1953.06.26', '베리야 체포', 'Arrest of Beria', '베리야가 체포되었고, 이 일로 울브리히트와 라코시가 숨을 돌렸다.', 'Beria was arrested, giving Ulbricht and Rákosi a reprieve.', 'soviet'],
        ['1953.07.04', '너지 정부의 강령 연설', 'Nagy’s programme speech', '너지가 국회에서 새 노선을 밝히는 강령 연설을 했다.', 'Nagy set out the New Course in his programme speech to parliament.', 'hungary', P(47.5071, 19.0457, '부다페스트 국회의사당', 'Parliament, Budapest')],
        ['1955.04.18', '너지 해임', 'Nagy dismissed', '말렌코프의 실각 뒤 너지가 「우익 편향」으로 몰려 총리에서 해임되었다.', 'After Malenkov’s fall, Nagy was condemned for “rightist deviation” and dismissed as premier.', 'hungary'],
        ['1955.05.14', '바르샤바 조약', 'Warsaw Pact', '소련과 동구권 7개국이 바르샤바에서 상호원조 조약을 맺었다. 이튿날 오스트리아 국가조약이 조인되었다.', 'The Soviet Union and seven Eastern bloc states signed the treaty in Warsaw; the Austrian State Treaty followed the next day.', ['soviet', 'poland', 'east-germany', 'hungary', 'czechoslovakia', 'austria'], P(52.2297, 21.0122, '바르샤바', 'Warsaw')],
        ['1955.06.02', '베오그라드 선언', 'Belgrade declaration', '흐루쇼프와 티토가 내정 불간섭과 서로 다른 사회주의의 길을 인정했다.', 'Khrushchev and Tito recognised non-interference and different roads to socialism.', ['soviet', 'yugoslavia'], P(44.8125, 20.4612, '베오그라드', 'Belgrade')],
        ['1956.02.25', '비밀연설', 'Secret Speech', '흐루쇼프가 제20차 당대회 비공개 회의에서 스탈린을 고발했다.', 'Khrushchev denounced Stalin at a closed session of the Twentieth Congress.', 'soviet'],
        ['1956.03.12', '비에루트 사망', 'Death of Bierut', '폴란드 지도자 비에루트가 모스크바에서 숨지고 오하프가 뒤를 이었다.', 'The Polish leader Bierut died in Moscow and was succeeded by Ochab.', ['poland', 'soviet']],
        ['1956.06.28', '포즈난 봉기', 'Poznań uprising', '체겔스키 공장 노동자의 시위가 총격전으로 번졌고 군이 진압했다.', 'A protest by Cegielski workers turned into a gun battle and was put down by the army.', 'poland', P(52.4064, 16.9252, '포즈난 미츠키에비치 광장', 'Mickiewicz Square, Poznań')],
        ['1956.07.18', '라코시 퇴진', 'Rákosi resigns', '미코얀의 압력으로 라코시가 물러나고 게뢰가 제1서기가 되었다.', 'Under pressure from Mikoyan, Rákosi resigned and Gerő became First Secretary.', ['hungary', 'soviet']],
        ['1956.10.06', '러이크 재매장', 'Reburial of Rajk', '복권된 러이크의 장례에 수십만 명이 모였다.', 'Several hundred thousand people attended the reburial of the rehabilitated Rajk.', 'hungary', P(47.4966, 19.0911, '부다페스트 케레페시 묘지', 'Kerepesi Cemetery, Budapest')],
        ['1956.10.19', '흐루쇼프의 바르샤바 방문', 'Khrushchev in Warsaw', '고무우카 복귀를 막으려 흐루쇼프가 날아왔고, 21일 소련 간부회는 개입을 삼가기로 했다.', 'Khrushchev flew in to block Gomułka’s return; on the 21st the Presidium decided against intervention.', ['poland', 'soviet'], P(52.2297, 21.0122, '바르샤바', 'Warsaw')],
        ['1956.10.23', '부다페스트 시위', 'Budapest demonstration', '폴란드 지지 시위가 라디오 방송국 앞 총격 뒤 혁명으로 번졌다.', 'A demonstration in support of Poland turned into revolution after shooting at the radio building.', 'hungary', P(47.4979, 19.0402, '부다페스트', 'Budapest')],
        ['1956.11.02', '브리오니 회담', 'Brioni talks', '티토가 흐루쇼프의 헝가리 개입에 동의하고 카다르를 추천했다.', 'Tito agreed to Khrushchev’s intervention in Hungary and recommended Kádár.', ['yugoslavia', 'soviet'], P(44.9167, 13.7667, '브리오니 섬', 'Brioni')],
        ['1956.11.04', '소련군의 부다페스트 공격', 'Soviet assault on Budapest', '소련군이 혁명을 진압하고 카다르 정부가 세워졌다.', 'Soviet forces crushed the revolution and the Kádár government was installed.', ['hungary', 'soviet'], P(47.4979, 19.0402, '부다페스트', 'Budapest')],
    ],
    locations: [
        ['부다페스트', 'Budapest', 47.4979, 19.0402, 'main'],
        ['동베를린', 'East Berlin', 52.5186, 13.4269, 'place'],
        ['플젠', 'Plzeň', 49.7384, 13.3736, 'place'],
        ['포즈난', 'Poznań', 52.4064, 16.9252, 'place'],
        ['바르샤바', 'Warsaw', 52.2297, 21.0122, 'place'],
        ['모스크바', 'Moscow', 55.7520, 37.6175, 'place'],
        ['베오그라드', 'Belgrade', 44.8125, 20.4612, 'place'],
        ['브리오니 섬', 'Brioni', 44.9167, 13.7667, 'place'],
    ],
    countries: ['soviet', 'east-germany', 'hungary', 'poland', 'czechoslovakia', 'yugoslavia', 'austria', 'china'],
    // soviet-zone-gdr-1945-1949 joins related in migration 247: it is registered after
    // this batch, which must come first as the parent of east-german-uprising-1953.
    relations: { related: ['twentieth-party-congress', 'beria-purge', 'warsaw-pact'] },
    focus: null,
    sides: null,
    people: [
        ['khrushchev', 'leader', '소련 공산당 제1서기', 'First Secretary of the CPSU', '비밀연설로 탈스탈린화를 열고, 폴란드와는 타협했으며 헝가리 개입을 결정했다.', 'Opened de-Stalinisation with the Secret Speech, compromised with Poland and decided on intervention in Hungary.'],
        ['malenkov', 'leader', '소련 각료회의 의장', 'Chairman of the Soviet Council of Ministers', '1953년 소비재 중심의 새 노선을 이끌다 1955년 총리에서 물러났다.', 'Led the consumer-oriented New Course in 1953 and was forced out as premier in 1955.'],
        ['beria', 'participant', '소련 내무장관', 'Soviet interior minister', '사면과 동독·헝가리 지도부 질책에 앞장섰다가 1953년 6월 체포되었다.', 'Pushed amnesty and the dressing-down of the East German and Hungarian leaders before his arrest in June 1953.'],
        ['molotov', 'participant', '소련 외무장관', 'Soviet foreign minister', '3인 체제의 일원으로 1953년 크렘린 회담과 1956년 바르샤바 방문에 함께했다.', 'Member of the troika; took part in the 1953 Kremlin talks and the 1956 Warsaw visit.'],
        ['mikoyan', 'participant', '소련 부총리', 'Soviet deputy premier', '1956년 7월 라코시의 퇴진을 이끌고 10월 부다페스트에 파견되었다.', 'Engineered Rákosi’s resignation in July 1956 and was sent to Budapest in October.'],
        ['suslov', 'participant', '소련 공산당 서기', 'CPSU secretary', '1956년 6월과 10월 부다페스트에 파견되었다.', 'Was sent to Budapest in June and October 1956.'],
        ['walter-ulbricht', 'participant', '독일사회통일당 서기장', 'General Secretary of the SED', '1953년 6월 봉기 뒤 해임될 뻔했으나 베리야의 몰락으로 살아남았다.', 'Nearly removed after the June 1953 uprising, he survived thanks to Beria’s fall.'],
        ['otto-grotewohl', 'participant', '동독 총리', 'East German prime minister', '1953년 6월 모스크바에서 새 노선 지시를 받았다.', 'Received the New Course instructions in Moscow in June 1953.'],
        ['vladimir-semyonov', 'executor', '독일 주재 소련 고등판무관', 'Soviet High Commissioner in Germany', '새 노선의 즉각 공표를 고집했고 동베를린에 소련군을 투입했다.', 'Insisted on the immediate publication of the New Course and brought Soviet troops into East Berlin.'],
        ['matyas-rakosi', 'participant', '헝가리 노동인민당 제1서기', 'First Secretary of the Hungarian Working People’s Party', '1953년 총리직을 잃었으나 1955년 너지를 몰아냈고 1956년 7월 물러났다.', 'Lost the premiership in 1953, ousted Nagy in 1955 and resigned in July 1956.'],
        ['nagy', 'leader', '헝가리 총리', 'Hungarian prime minister', '1953~1955년 새 노선을 이끌었고 1956년 혁명 정부를 이끌다 1958년 처형되었다.', 'Led the New Course in 1953–1955 and the revolutionary government of 1956; executed in 1958.'],
        ['erno-gero', 'participant', '헝가리 노동인민당 제1서기', 'First Secretary of the Hungarian Working People’s Party', '라코시의 후임으로 러이크 재매장을 허용했고 10월 23일 소련군 개입을 요청했다.', 'Succeeding Rákosi, allowed Rajk’s reburial and requested Soviet intervention on 23 October.'],
        ['janos-kadar', 'participant', '헝가리 혁명 노동자·농민 정부 수반', 'Head of the Revolutionary Workers’ and Peasants’ Government', '11월 4일 소련군과 함께 정권을 잡고 보복과 타협을 함께 폈다.', 'Took power with the Soviet army on 4 November, combining reprisals with compromise.'],
        ['laszlo-rajk', 'target', '1949년 쇼 재판의 희생자', 'Victim of the 1949 show trial', '1956년 3월 복권되었고 10월 6일 재매장이 혁명의 전조가 되었다.', 'Rehabilitated in March 1956; his reburial on 6 October foreshadowed the revolution.'],
        ['boleslaw-bierut', 'participant', '폴란드 통일노동자당 서기장', 'General Secretary of the Polish United Workers’ Party', '제20차 당대회 뒤 모스크바에서 숨졌다.', 'Died in Moscow after the Twentieth Congress.'],
        ['edward-ochab', 'participant', '폴란드 통일노동자당 제1서기', 'First Secretary of the Polish United Workers’ Party', '비밀연설을 널리 돌리게 하고 10월 고무우카에게 자리를 넘겼다.', 'Let the Secret Speech circulate widely and handed over to Gomułka in October.'],
        ['wladyslaw-gomulka', 'leader', '폴란드 통일노동자당 제1서기', 'First Secretary of the Polish United Workers’ Party', '1956년 10월 복귀해 흐루쇼프를 설득하고 「폴란드의 길」을 내세웠다.', 'Returned in October 1956, talked Khrushchev down and proclaimed a “Polish road”.'],
        ['konstantin-rokossovsky', 'executor', '폴란드 국방장관', 'Polish defence minister', '포즈난 진압에 군을 보냈고 폴란드 10월 뒤 소련으로 돌아갔다.', 'Sent troops against Poznań and returned to the Soviet Union after the Polish October.'],
        ['ivan-konev', 'executor', '바르샤바 조약군 총사령관', 'Commander of the Warsaw Pact forces', '바르샤바 방문에 동행했고 11월 4일 헝가리 공격을 지휘했다.', 'Accompanied the Warsaw visit and commanded the assault on Hungary on 4 November.'],
        ['josip-broz-tito', 'participant', '유고슬라비아 대통령', 'President of Yugoslavia', '1955년 소련과 화해했고 1956년 11월 브리오니에서 헝가리 개입에 동의했다.', 'Reconciled with Moscow in 1955 and agreed to the Hungarian intervention at Brioni in November 1956.'],
        ['liu-shaoqi', 'participant', '중국 공산당 부주석', 'Vice-Chairman of the Chinese Communist Party', '1956년 10월 모스크바에서 헝가리 문제에 관한 마오쩌둥의 견해를 전했다.', 'Conveyed Mao Zedong’s views on Hungary in Moscow in October 1956.'],
        ['mark-kramer', 'historian', '냉전사 연구자', 'Cold War historian', '말린 메모를 바탕으로 1956년 소련의 결정 과정을 재구성했다.', 'Reconstructed Soviet decision-making in 1956 from the Malin notes.'],
        ['csaba-bekes', 'historian', '헝가리 역사가', 'Hungarian historian', '1956년 혁명의 국제적 맥락과 보복에 관한 새 연구를 정리했다.', 'Summarised new research on the international context of 1956 and the reprisals.'],
    ],
});

module.exports = { event };
