/* global module */
/* Scenario of 「붉은 전선 1918–1920」: the eight seasons of the Russian Civil
   War from the Czech revolt to Perekop, played from the Soviet side.
   Content only; rules live in civil-war-engine.js. Dates, names and the
   "역사에서는" notes follow the CommuLingo event /commulingo/events/civil-war
   and its timeline. Fronts are city chains from the inner city (nearest
   Moscow) outward; a front's line is how many of them the Reds hold, and
   history[] is that number at the end of each season. A threat's pressure
   is the strength the Reds needed to do as well as they did in history:
   meeting it repeats the season's historical change of line. holders[] names
   who held a front's lost cities in each season (a faction id below); a
   threat's foes[] names who attacks. */
(function (root) {
    'use strict';

    const P = id => '/commulingo/people/' + id;
    const T = id => '/commulingo/terms/' + id;
    const E = id => '/commulingo/events/' + id;

    const fronts = {
        east: {
            name: '동부전선', short: '동부',
            cities: [['카잔', 55.79, 49.12], ['심비르스크', 54.31, 48.40], ['사마라', 53.20, 50.15], ['우파', 54.74, 55.97], ['예카테린부르크', 56.84, 60.61]],
            history: [0, 4, 3, 5, 5, 5, 5, 5],
            holders: ['czech', 'komuch', 'kolchak', 'kolchak', 'kolchak', 'kolchak', 'kolchak', 'kolchak'],
        },
        volga: {
            name: '차리친 방면', short: '차리친',
            cities: [['사라토프', 51.53, 46.03], ['차리친', 48.71, 44.51]],
            history: [2, 2, 2, 1, 1, 2, 2, 2],
            holders: ['don', 'don', 'don', 'denikin', 'denikin', 'denikin', 'denikin', 'denikin'],
        },
        south: {
            name: '남부전선', short: '남부',
            cities: [['툴라', 54.19, 37.62], ['오룔', 52.97, 36.07], ['쿠르스크', 51.73, 36.19], ['하리코프', 49.99, 36.23], ['로스토프', 47.24, 39.71], ['예카테리노다르', 45.04, 38.98]],
            history: [3, 3, 4, 3, 2, 6, 6, 6],
            holders: ['central', 'central', 'denikin', 'denikin', 'denikin', 'denikin', 'wrangel', 'wrangel'],
            capital: true,
        },
        northwest: {
            name: '북서전선', short: '북서',
            cities: [['페트로그라드', 59.94, 30.31], ['가치나', 59.57, 30.13], ['얌부르크', 59.37, 28.61]],
            history: [3, 3, 3, 2, 1, 3, 3, 3],
            holders: ['central', 'yudenich', 'yudenich', 'yudenich', 'yudenich', 'yudenich', 'yudenich', 'yudenich'],
            petrograd: true,
        },
        north: {
            name: '북부전선', short: '북부',
            cities: [['볼로그다', 59.22, 39.89], ['아르한겔스크', 64.54, 40.54]],
            history: [1, 1, 1, 1, 1, 2, 2, 2],
            holders: ['allies', 'allies', 'allies', 'allies', 'allies', 'north', 'north', 'north'],
        },
        west: {
            name: '서부전선', short: '서부',
            cities: [['스몰렌스크', 54.78, 32.05], ['민스크', 53.90, 27.57], ['바르샤바', 52.23, 21.01]],
            history: [1, 2, 2, 2, 1, 1, 2, 2],
            holders: ['central', 'central', 'poland', 'poland', 'poland', 'poland', 'poland', 'poland'],
        },
        southwest: {
            name: '남서전선', short: '남서',
            cities: [['키예프', 50.45, 30.52], ['리비우', 49.84, 24.03]],
            history: [0, 0, 1, 1, 0, 1, 1, 1],
            holders: ['central', 'unr', 'poland', 'poland', 'denikin', 'poland', 'poland', 'poland'],
        },
        crimea: {
            name: '크림 방면', short: '크림',
            cities: [['알렉산드롭스크', 47.84, 35.14], ['멜리토폴', 46.85, 35.37], ['페레코프', 46.16, 33.69]],
            history: [0, 0, 0, 0, 0, 2, 1, 3],
            holders: ['central', 'denikin', 'denikin', 'denikin', 'denikin', 'wrangel', 'wrangel', 'wrangel'],
        },
    };

    // Who the Reds fought. kind colours the map: white (the White movement
    // and its allies), interv (foreign intervention), central (Germany and
    // Austria), national (the new states). flag: horizontal stripes, top
    // first, as flown in these years.
    const TRICOLOR = ['#ffffff', '#0039a6', '#d52b1e'];
    const factions = {
        czech: {
            name: '체코슬로바키아 군단', short: '체코 군단', kind: 'white', flag: ['#ffffff', '#d7141a'], link: T('czechoslovak-legion'),
            note: '오스트리아군에서 넘어온 체코·슬로바키아 포로로 만든 군단. 프랑스 전선으로 가려고 시베리아 횡단철도를 타고 있었다. 1918–1920년 체코슬로바키아 국기는 폴란드처럼 흰색·빨간색 두 줄이었고, 1920년 3월 파란 삼각형이 더해졌다.',
        },
        komuch: {
            name: '코무치 인민군', short: '코무치', kind: 'white',
            note: '사마라에 선 사회혁명당 계열 제헌의회 의원 위원회(코무치)의 군대. 9월 옴스크의 디렉토리로 합쳐졌다가 11월 콜차크의 쿠데타로 밀려났다.',
        },
        kolchak: {
            name: '콜차크 정부군', short: '콜차크', kind: 'white', flag: TRICOLOR, link: P('alexander-kolchak'),
            note: '옴스크의 「최고 통치자」 콜차크 제독의 군대. 영국이 소총과 군복을 댔다. 백군은 제정 러시아의 흰색·파란색·빨간색 삼색기를 썼다.',
        },
        don: {
            name: '돈 카자크군', short: '돈 카자크', kind: 'white', flag: ['#0033a0', '#ffd500', '#d52b1e'], link: P('pyotr-krasnov'),
            note: '아타만 크라스노프가 이끈 돈 카자크의 군대. 1918년에는 우크라이나를 점령한 독일의 지원을 받았다. 깃발은 돈 공화국의 파란색·노란색·빨간색.',
        },
        denikin: {
            name: '남러시아군(데니킨)', short: '데니킨', kind: 'white', flag: TRICOLOR, link: P('anton-denikin'),
            note: '코르닐로프가 세운 의용군에 돈·쿠반 카자크군을 묶은 데니킨의 군대. 1919년 여름 「모스크바 지령」으로 북진했다.',
        },
        yudenich: {
            name: '북서군(유데니치)', short: '유데니치', kind: 'white', flag: TRICOLOR, link: P('nikolai-yudenich'),
            note: '에스토니아를 발판으로 페트로그라드를 노린 유데니치 장군의 백군.',
        },
        allies: {
            name: '연합국 간섭군', short: '간섭군', kind: 'interv',
            note: '영국을 중심으로 프랑스·미국 병력이 무르만스크와 아르한겔스크에 상륙해 북부 정부를 세웠다. 영국군은 1919년 가을 철수했다.',
        },
        north: {
            name: '북부 정부군', short: '북부 정부', kind: 'white', flag: TRICOLOR, link: P('yevgeny-miller'),
            note: '영국군이 떠난 뒤 밀러 장군이 이끈 아르한겔스크의 백군.',
        },
        central: {
            name: '독일·오스트리아군', short: '독일·오스트리아', kind: 'central', flag: ['#000000', '#ffffff', '#dd0000'], link: E('brest-litovsk'),
            note: '브레스트 강화로 우크라이나·벨라루스·발트를 점령한 동맹국 군대. 1918년 11월 독일이 항복한 뒤 물러났다. 깃발은 독일 제국의 검은색·흰색·빨간색.',
        },
        poland: {
            name: '폴란드군', short: '폴란드', kind: 'national', flag: ['#ffffff', '#dc143c'], link: P('jozef-pilsudski'),
            note: '1918년 독립을 되찾은 폴란드의 군대. 피우수트스키가 이끌었다.',
        },
        unr: {
            name: '우크라이나 인민공화국군', short: '우크라이나', kind: 'national', link: P('symon-petliura'),
            note: '페틀류라가 이끈 디렉토리 정부의 군대. 1920년 폴란드와 동맹해 키예프로 들어왔다.',
        },
        wrangel: {
            name: '러시아군(브란겔)', short: '브란겔', kind: 'white', flag: TRICOLOR, link: P('pyotr-wrangel'),
            note: '노보로시스크 철수 뒤 데니킨에게서 지휘권을 넘겨받은 브란겔이 크림에서 다시 세운 백군.',
        },
    };

    // What the Red Army's divisions were made of, season by season. A
    // turn's army[] lists [troop id, count]; the counts add up to its
    // mobilize (the game's unit, not the historical division count).
    const troops = {
        latvian: {
            name: '라트비아 소총사단', link: T('red-army'),
            note: '옛 제국군의 라트비아 소총병 연대들로 1918년 4월 만든 사단. 내전 초기 붉은 군대에서 가장 믿을 만한 부대였다.',
        },
        baltic: {
            name: '라트비아·에스토니아 소총사단', link: T('red-army'),
            note: '1919년 10월 오룔 반격의 충격군. 의용군의 정예 사단들을 측면에서 쳤다.',
        },
        guards: {
            name: '노동자 분견대·적위대', link: T('red-guards'),
            note: '10월 혁명을 치른 공장 노동자의 무장대. 열의는 높았지만 훈련이 모자랐다.',
        },
        volunteers: {
            name: '의용병 연대', link: T('red-army'),
            note: '1월 창설 법령에 따라 지원한 병사들의 연대. 봄까지 20만 명 안팎이 등록했다.',
        },
        internationalists: {
            name: '국제주의자 부대',
            note: '러시아에 잡혀 있던 헝가리·독일·오스트리아 전쟁 포로 가운데 혁명에 가담한 이들의 부대.',
        },
        flotilla: {
            name: '볼가 소함대', link: P('fyodor-raskolnikov'),
            note: '라스콜니코프가 이끈 강 함대. 1918년 9월 카잔 탈환에 함께했다.',
        },
        conscripts: {
            name: '징집 소총사단', link: T('political-commissar'),
            note: '1918년 6월 볼가·우랄에서 시작한 징집으로 만든 사단. 구 장교가 지휘하고 정치위원이 감시했다.',
        },
        cavalry: {
            name: '붉은 기병', link: P('semyon-budyonny'),
            note: '돈의 부됸니가 키운 기병. 1919년 기병군단, 그해 11월 제1기병군이 된다.',
        },
    };

    const frontOrder = ['northwest', 'north', 'west', 'southwest', 'south', 'crimea', 'volga', 'east'];
    const moscow = ['모스크바', 55.76, 37.62];
    // Lines at the start, June 1918. Ukraine and the Baltic are under German
    // occupation; Kharkiv and Rostov are in German and Don Cossack hands.
    const startLines = { east: 5, volga: 2, south: 3, northwest: 3, north: 2, west: 1, southwest: 0, crimea: 0 };

    // Action cards, played with command points before the season is settled.
    // effect: immediate on play (divisions, grain…); bonus: front strength at
    // settlement. turns: indices in which the card is offered.
    const cards = {
        train: {
            title: '트로츠키의 장갑열차', advisor: ['레프 트로츠키', 'trotsky'], cost: 1, target: 'front', bonus: 3,
            turns: [0, 1, 2, 3, 4, 5, 6],
            text: '전쟁인민위원의 열차가 위기의 전선으로 달려간다. 인쇄소·전신국·예비 무기와 함께 도망친 부대를 다시 세운다.',
            note: '트로츠키는 내전 동안 이 열차로 10만 킬로미터 넘게 전선을 돌았다.',
        },
        requisition: {
            title: '식량 징발대 파견', advisor: ['블라디미르 레닌', 'lenin'], cost: 1, grain: 5, peasants: -4,
            turns: [0, 1, 2, 3, 4, 5, 6],
            text: '무장한 노동자 분견대를 곡창 지대로 보내 「잉여」 곡물을 거둔다. 도시와 군대는 먹지만 마을은 등을 돌린다.',
            link: ['식량 독재', T('food-dictatorship')],
        },
        kombedy: {
            title: '빈농위원회', advisor: ['야코프 스베르들로프', 'sverdlov'], cost: 1, grain: 3, peasants: -4, workers: 3,
            turns: [0, 1],
            text: '마을의 빈농을 조직해 부농의 곡물을 찾아내게 한다. 1918년 12월 마을 소비에트로 흡수되기까지 여름과 가을 동안만 쓸 수 있다.',
            link: ['빈농위원회', T('kombedy-committees-of-the-poor')],
        },
        cheka: {
            title: '체카의 후방 단속', advisor: ['펠릭스 제르진스키', 'dzerzhinsky'], cost: 1, needs: 'revolt', peasants: -3, cohesion: -3,
            turns: [1, 2, 3, 4, 5, 6],
            text: '후방의 농민 봉기를 비상위원회가 진압한다. 봉기에 묶인 사단의 절반이 바로 전선으로 돌아오지만, 공포는 지지를 깎는다.',
            link: ['적색 테러', T('red-terror')],
        },
        amnesty: {
            title: '탈영병 자수 기간', advisor: ['레프 트로츠키', 'trotsky'], cost: 1, divisions: 2, cohesion: -2,
            turns: [2, 3, 4, 5],
            text: '정해진 기간 안에 돌아온 탈영병은 처벌하지 않고 부대로 돌려보낸다. 1919년 한 해 동안 탈영병 수십만 명이 이렇게 돌아왔다.',
        },
        propaganda: {
            title: '간섭군 병사에게 선전', advisor: ['블라디미르 레닌', 'lenin'], cost: 1, calm: ['north', 'south'], calmBy: 2,
            turns: [2, 3],
            text: '외국어 전단과 신문을 간섭군 병영에 들여보낸다. 1919년 4월 오데사 앞바다에서 프랑스 수병들이 반란을 일으켰고, 프랑스는 남부에서 병력을 거두었다.',
        },
        partyWeek: {
            title: '당 주간', advisor: ['블라디미르 레닌', 'lenin'], cost: 1, divisions: 3, workers: 4, cohesion: 3,
            turns: [4],
            text: '위기의 가을, 당이 입당 문을 활짝 열고 공산주의자를 대거 전선으로 보낸다. 1919년 가을의 당 주간에 20만 명 넘게 입당했다.',
        },
        cavalry: {
            title: '제1기병군 창설', advisor: ['세묜 부됸니', 'semyon-budyonny'], cost: 1, flag: 'cavalry', divisions: -2,
            turns: [5],
            text: '부됸니의 기병군단을 군으로 키운다. 보병 두 개 사단 몫을 떼어 주면, 이후 남부·크림·남서 전선에서 늘 +4의 타격력을 낸다.',
            note: '1919년 11월 창설. 백군 기병의 기동에 처음으로 같은 무기로 맞섰다.',
        },
    };

    // One season each. threats: the active fronts and what the enemy brings.
    // choice: the season's dilemma, with the side history took.
    const turns = [
        {
            id: 'czech', date: '1918년 6–8월', end: [1918, 8], title: '체코 군단의 반란',
            mobilize: 6, commissars: 1, army: [['latvian', 1], ['guards', 2], ['volunteers', 2], ['internationalists', 1]], phase: 1,
            brief: [
                '1918년 5월 25일, 시베리아 횡단철도를 따라 블라디보스토크로 가던 체코슬로바키아 군단 약 4만 명이 무장해제 명령을 거부했다. 6월 초까지 펜자에서 크라스노야르스크까지 철도 연선의 소비에트 권력이 무너졌고, 6월 8일 사마라에 사회혁명당 계열의 코무치 정부가 섰다.',
                '붉은 군대는 1월에 창설 법령이 나왔을 뿐, 전투 부대라 부를 만한 것은 라트비아 소총병과 노동자 분견대 몇몇이었다. 남쪽에서는 크라스노프의 돈군이 볼가의 요충 차리친으로 향하고, 북쪽 바다에는 영국 함대가 와 있다.',
            ],
            threats: {
                east: { pressure: 6, foes: ['czech', 'komuch'], text: '군단과 코무치 인민군이 볼가를 거슬러 오른다. 카펠의 부대는 카잔의 금 보유고를 노린다.', who: ['블라디미르 카펠', 'vladimir-kappel'] },
                volga: { pressure: 2, foes: ['don'], text: '크라스노프의 돈군이 차리친을 처음으로 공격한다.', who: ['표트르 크라스노프', 'pyotr-krasnov'] },
                north: { pressure: 1, foes: ['allies'], text: '연합군 함대가 아르한겔스크 앞바다에 나타났다.' },
            },
            cards: ['train', 'requisition', 'kombedy'],
            choice: {
                title: '누가 군대를 지휘하는가', who: ['레프 트로츠키', 'trotsky'],
                text: '3월에 전쟁인민위원이 된 트로츠키가 제안한다. 차르 군대의 장교 수만 명을 「군사전문가」로 다시 부르고, 명령마다 정치위원이 함께 서명하게 하자. 많은 볼셰비키는 반대한다. 혁명을 짓밟은 장교에게 혁명의 군대를 맡기느냐고.',
                options: [
                    { id: 'experts', label: '군사전문가를 기용한다', flag: 'experts', cohesion: -6, effect: '다음 시기부터 모든 전선의 전투력 +25%. 당 결속 −6', voices: '트로츠키·레닌' },
                    { id: 'elected', label: '선출 지휘관과 유격대로 싸운다', cohesion: 4, divisions: 1, effect: '이번 시기 사단 +1, 당 결속 +4. 전투력은 그대로', voices: '좌파 공산주의자, 훗날의 「군사 반대파」' },
                ],
                history: 'experts',
                after: '붉은 군대는 1918년 말까지 구 장교 2만여 명을, 내전 동안 모두 7만 명 넘게 기용했다. 반대파는 1919년 3월 제8차 당대회에서 「군사 반대파」로 맞섰고, 차리친의 스탈린·보로실로프도 이들과 부딪쳤다.',
                links: [['군사 반대파', T('military-opposition')], ['정치위원', T('political-commissar')]],
            },
            after: '8월 7일 카펠의 부대가 카잔과 제정의 금 보유고를 빼앗았다. 사마라·심비르스크·우파·예카테린부르크가 이미 넘어갔고, 8월 2일 연합군이 아르한겔스크에 상륙했다. 차리친은 크라스노프의 첫 공격을 막아 냈다.',
            links: [['체코슬로바키아 군단', T('czechoslovak-legion')], ['러시아 내전', E('civil-war')]],
        },
        {
            id: 'volga', date: '1918년 9–12월', end: [1918, 12], title: '스비야시스크에서 차리친까지',
            mobilize: 9, commissars: 2, army: [['conscripts', 5], ['latvian', 1], ['guards', 1], ['internationalists', 1], ['flotilla', 1]], phase: 1,
            brief: [
                '트로츠키는 장갑열차로 카잔 건너편 스비야시스크에 사령부를 차리고, 도망친 연대의 지휘관과 정치위원을 총살하며 제5군을 다시 세웠다. 8월 30일 레닌이 저격당했고, 인민위원회는 「적색 테러」를 선포했다.',
                '11월 독일이 항복해 우크라이나와 발트에서 물러나기 시작한다. 같은 달 옴스크에서는 콜차크 제독이 쿠데타로 「최고 통치자」가 되었다. 크라스노프는 차리친을 다시 노린다.',
            ],
            threats: {
                east: { pressure: 7, foes: ['komuch', 'kolchak'], text: '카잔의 백군은 지쳤다. 지금 몰아치면 볼가를 되찾을 수 있다.', who: ['알렉산드르 콜차크', 'alexander-kolchak'] },
                volga: { pressure: 5, foes: ['don'], text: '돈군이 차리친을 포위하려 한다. 식량 전권을 가지고 온 스탈린이 지휘까지 쥐었다.', who: ['표트르 크라스노프', 'pyotr-krasnov'] },
            },
            cards: ['train', 'requisition', 'kombedy', 'cheka'],
            choice: {
                title: '곡물을 어떻게 거둘 것인가', who: ['블라디미르 레닌', 'lenin'],
                text: '도시는 굶고 군대는 빵이 모자란다. 곡물 독점과 고정가로는 농민이 곡물을 내놓지 않는다. 나라가 필요한 곡물 총량을 정해 현마다 할당하고, 무장 분견대로 거두어야 하는가?',
                options: [
                    { id: 'razverstka', label: '식량 할당제를 도입한다', flag: 'razverstka', effect: '매 시기 곡물 +7, 농민 지지 −3', voices: '레닌, 식량인민위원부' },
                    { id: 'market', label: '고정가 수매와 교환을 늘린다', flag: 'market', effect: '매 시기 곡물 +2, 농민 지지 +2', voices: '좌파 사회혁명당 출신 농민 대표들' },
                ],
                history: 'razverstka',
                after: '1919년 1월 식량 할당제가 도입되었다. 군대와 도시는 빵을 얻었지만, 할당량을 채우려는 징발은 마을의 씨앗 곡물까지 가져갔다. 이 체제가 「전시 공산주의」의 핵심이었다.',
                links: [['식량 할당제', T('prodrazvyorstka')], ['전시 공산주의', T('war-communism')]],
            },
            after: '9월 10일 카잔, 12일 심비르스크, 10월 7일 사마라를 되찾았다. 붉은 군대의 첫 승리였다. 12월 31일에는 우파도 탈환했다. 차리친은 세 차례 공격을 모두 버텼고, 독일군이 떠난 자리로 붉은 군대가 들어가 1919년 1월 초 리가와 빌뉴스, 하리코프에 이르렀다.',
            links: [['적색 테러', T('red-terror')], ['야코프 스베르들로프', P('sverdlov')]],
        },
        {
            id: 'kolchak', date: '1919년 1–4월', end: [1919, 4], title: '콜차크의 춘계 공세',
            mobilize: 13, commissars: 2, army: [['conscripts', 10], ['latvian', 1], ['cavalry', 1], ['internationalists', 1]], phase: 2,
            brief: [
                '3월, 영국이 대 준 소총으로 무장한 콜차크군이 우랄을 넘었다. 한진의 서부군이 3월 13일 우파를 점령하고 볼가 100킬로미터 앞까지 밀려온다.',
                '돈에서는 3월 베셴스카야의 카자크가 붉은 군대 후방에서 봉기했다. 남쪽의 데니킨은 쿠반과 북캅카스를 손에 넣고 북쪽을 바라본다.',
            ],
            threats: {
                east: { pressure: 10, foes: ['kolchak'], text: '콜차크의 서부군이 볼가로 진격한다. 사마라와 카잔이 위험하다.', who: ['알렉산드르 콜차크', 'alexander-kolchak'] },
                south: { pressure: 6, foes: ['don', 'denikin'], text: '돈 카자크의 봉기가 남부전선의 후방을 흔든다.', who: ['안톤 데니킨', 'anton-denikin'] },
                volga: { pressure: 4, foes: ['don'], text: '차리친 앞의 돈군은 아직 물러서지 않았다.' },
            },
            cards: ['train', 'requisition', 'cheka', 'propaganda', 'amnesty'],
            choice: {
                title: '콜차크의 늘어진 측면', who: ['미하일 프룬제', 'frunze'],
                text: '남부집단군을 맡은 프룬제가 말한다. 콜차크의 진격로는 너무 길게 늘어졌다. 지금 정면에 병력을 쏟지 말고 부줄루크 남쪽에 모아 두었다가, 4월 말 그 측면을 찌르자. 그동안 정면은 더 밀릴 것이다.',
                options: [
                    { id: 'flank', label: '측면 반격을 준비한다', flag: 'flank', effect: '이번 시기 동부 전투력 −3, 다음 시기 동부 +7', voices: '프룬제, 세르게이 카메네프' },
                    { id: 'front', label: '정면을 증원해 버틴다', effect: '이번 시기 동부 전투력 +3', voices: '동부전선 사령부의 일부' },
                ],
                history: 'flank',
                after: '4월 28일 프룬제의 남부집단군이 콜차크군의 늘어진 측면을 찔러 5월 부구루슬란과 부굴마를 되찾았다. 차파예프의 제25사단이 이 반격의 선봉이었다.',
                links: [['미하일 프룬제', P('frunze')], ['바실리 차파예프', P('vasily-chapayev')]],
            },
            after: '콜차크군은 우파를 빼앗고 볼가 가까이 왔지만 사마라와 카잔에는 닿지 못했다. 4월 오데사의 프랑스 함대에서 수병 반란이 일어나 프랑스가 남부에서 철수했다.',
            links: [['알렉산드르 콜차크', P('alexander-kolchak')], ['녹색군', T('green-armies')]],
        },
        {
            id: 'directive', date: '1919년 5–7월', end: [1919, 7], title: '「모스크바 지령」',
            mobilize: 15, commissars: 3, army: [['conscripts', 12], ['latvian', 1], ['cavalry', 2]], phase: 2,
            brief: [
                '동부에서는 반격이 시작되었다. 하지만 남쪽이 무너지고 있다. 돈 봉기가 붉은 군대를 묶은 사이 데니킨이 6월 25일 하리코프, 30일 차리친을 차지했고, 7월 3일 차리친에서 모스크바로의 세 갈래 진격을 명령했다.',
                '5월에는 유데니치의 북서군이 에스토니아에서 페트로그라드로 첫 공세를 시작했다. 이 공세의 길목인 얌부르크가 넘어갔다.',
            ],
            threats: {
                east: { pressure: 5, foes: ['kolchak'], text: '콜차크군이 우랄로 물러난다. 추격할 때다.' },
                south: { pressure: 9, foes: ['denikin'], text: '데니킨의 의용군이 하리코프로 쳐들어온다.', who: ['안톤 데니킨', 'anton-denikin'] },
                volga: { pressure: 5, foes: ['denikin'], text: '브란겔의 캅카스군이 차리친을 공격한다.', who: ['표트르 브란겔', 'pyotr-wrangel'] },
                northwest: { pressure: 4, foes: ['yudenich'], text: '유데니치의 북서군이 얌부르크로 온다.', who: ['니콜라이 유데니치', 'nikolai-yudenich'] },
            },
            cards: ['train', 'requisition', 'cheka', 'amnesty', 'propaganda'],
            choice: {
                title: '우랄 너머로, 아니면 남쪽으로', who: ['세르게이 카메네프', 'sergey-kamenev'],
                text: '총사령관 바치에티스와 트로츠키는 우랄에서 멈추고 동부의 사단을 위기의 남부로 돌리자고 한다. 동부전선 사령관 카메네프는 지금 멈추면 콜차크가 겨울 동안 다시 일어선다며 끝까지 추격하자고 한다.',
                options: [
                    { id: 'pursue', label: '우랄 너머로 추격한다', flag: 'pursue', effect: '다음 시기 동부의 콜차크는 무너진다. 남부는 이번 병력만으로', voices: '카메네프, 레닌' },
                    { id: 'turn', label: '우랄에서 멈추고 남쪽으로 돌린다', flag: 'turned', effect: '다음 시기 남부 전투력 +5. 동부 압력은 다음 두 시기 계속', voices: '트로츠키, 바치에티스' },
                ],
                history: 'pursue',
                after: '중앙위원회는 추격을 택했다. 7월 바치에티스가 물러나고 카메네프가 총사령관이 되었다. 붉은 군대는 7월 14일 예카테린부르크를 되찾고 11월 옴스크까지 진격했다. 남부는 그 대가로 가을 내내 위기에 빠졌다.',
                links: [['세르게이 카메네프', P('sergey-kamenev')], ['유쿰스 바치에티스', P('ioakim-vatsetis')]],
            },
            after: '6월 9일 우파, 7월 14일 예카테린부르크를 되찾았다. 남쪽에서는 하리코프와 차리친이 넘어갔고, 북서에서는 유데니치가 얌부르크를 차지했다.',
            links: [['안톤 데니킨', P('anton-denikin')], ['니콜라이 유데니치', P('nikolai-yudenich')]],
        },
        {
            id: 'orel', date: '1919년 8–10월', end: [1919, 10], title: '위기의 정점: 오룔과 페트로그라드',
            mobilize: 16, commissars: 3, army: [['conscripts', 12], ['baltic', 2], ['cavalry', 2]], phase: 3,
            brief: [
                '8월 마몬토프의 기병이 남부전선의 후방을 휩쓸었다. 8월 31일 백군은 키예프에 들어갔고, 9월 20일 쿠르스크가 떨어졌다. 의용군의 정예 사단들이 오룔과 툴라, 그리고 모스크바를 향한다.',
                '10월, 유데니치가 다시 페트로그라드로 온다. 서쪽에서는 폴란드군이 8월에 민스크를 차지했다. 데니킨의 후방 우크라이나에서는 마흐노의 반란군이 9월 페레고노프카에서 백군을 깨고 보급선을 끊고 있다.',
            ],
            threats: {
                south: { pressure: 14, foes: ['denikin'], text: '쿠테포프의 제1군단이 오룔로 진격한다. 오룔 다음은 툴라, 툴라 다음은 모스크바다.', who: ['안톤 데니킨', 'anton-denikin'] },
                northwest: { pressure: 6, foes: ['yudenich'], text: '유데니치의 북서군이 가치나를 지나 풀코보 고지로 온다.', who: ['니콜라이 유데니치', 'nikolai-yudenich'] },
                volga: { pressure: 3, foes: ['denikin'], text: '차리친의 캅카스군은 볼가를 따라 북상하려 한다.' },
                west: { pressure: 3, foes: ['poland'], text: '폴란드군이 민스크로 진격한다.', who: ['유제프 피우수트스키', 'jozef-pilsudski'] },
            },
            cards: ['train', 'requisition', 'cheka', 'amnesty', 'partyWeek'],
            choice: {
                title: '페트로그라드를 내줄 것인가', who: ['레프 트로츠키', 'trotsky'],
                text: '10월 중순, 남쪽과 북서쪽이 동시에 무너진다. 모스크바를 지키려면 페트로그라드를 내주고 그 병력을 남쪽으로 돌려야 한다는 의견이 나왔다. 트로츠키는 혁명의 도시를 거리마다 지키겠다며 직접 가겠다고 한다.',
                options: [
                    { id: 'hold', label: '페트로그라드를 사수한다', flag: 'heldPetrograd', effect: '북서 전투력 +4', voices: '트로츠키, 정치국' },
                    { id: 'yield', label: '북서를 비우고 남쪽에 모은다', effect: '남부 전투력 +4, 북서 압력 +6', voices: '한때 레닌이 기울었던 안' },
                ],
                history: 'hold',
                after: '정치국은 10월 15일 페트로그라드를 지키기로 했다. 트로츠키가 조직한 제7군과 노동자들이 풀코보 고지에서 유데니치를 막고 에스토니아로 밀어냈다. 남쪽에서는 라트비아·에스토니아 소총병 사단이 10월 20일 오룔을 되찾았다.',
                links: [['제7군', T('seventh-army-red-army')], ['레프 트로츠키', P('trotsky')]],
            },
            after: '10월 13일 오룔이 떨어졌다가 20일 되찾아졌다. 부됸니의 기병이 보로네시에서 백군 기병을 깨뜨렸다. 10월 20일 유데니치는 페트로그라드 외곽 풀코보 고지에 닿았지만 더 나아가지 못했다.',
            links: [['마흐노 운동', T('makhnovshchina')], ['세묜 부됸니', P('semyon-budyonny')]],
        },
        {
            id: 'counter', date: '1919년 11월–1920년 3월', end: [1920, 3], title: '남쪽으로의 반격',
            mobilize: 18, commissars: 3, army: [['conscripts', 14], ['baltic', 1], ['cavalry', 3]], phase: 4,
            brief: [
                '11월 14일 옴스크가 함락되었다. 콜차크군은 시베리아 횡단철도를 따라 2천 킬로미터를 물러나는 「대시베리아 빙상 행군」에 들어갔다. 남쪽의 데니킨군은 오룔에서 꺾여 돈으로 물러난다.',
                '1920년 2월, 트로츠키가 우랄에서 돌아와 중앙위원회에 곡물 징발을 세금으로 바꾸자고 제안한다. 마을마다 징발대에 맞선 봉기가 늘고 있다.',
            ],
            threats: {
                south: { pressure: 13, foes: ['denikin'], text: '데니킨군이 하리코프와 로스토프를 지나 쿠반으로 물러난다. 다시 버티지 못하게 몰아쳐야 한다.' },
                volga: { pressure: 3, foes: ['denikin'], text: '차리친의 캅카스군이 고립되었다.' },
                northwest: { pressure: 3, foes: ['yudenich'], text: '유데니치군이 에스토니아 국경으로 밀려났다.' },
                north: { pressure: 3, foes: ['north'], text: '영국군이 떠난 아르한겔스크의 북부 정부가 흔들린다.' },
            },
            cards: ['train', 'requisition', 'cheka', 'amnesty', 'cavalry'],
            choice: {
                title: '징발 대신 세금을?', who: ['레프 트로츠키', 'trotsky'],
                text: '트로츠키의 제안: 할당량을 정해 거두는 대신 수확에 비례한 현물세를 매기고, 나머지는 농민이 팔게 하자. 농민이 다시 씨를 뿌리게 해야 한다. 다수는 반대한다. 전쟁이 끝나지 않았는데 곡물 공급을 시장에 맡길 수는 없다고.',
                options: [
                    { id: 'keep', label: '할당제를 유지한다', effect: '곡물 수입 그대로', voices: '중앙위원회 다수' },
                    { id: 'tax', label: '현물세로 바꾼다', flag: 'tax', effect: '매 시기 곡물 −4, 농민 지지 +8', voices: '트로츠키' },
                ],
                history: 'keep',
                after: '중앙위원회는 11대 4로 트로츠키의 제안을 부결했다. 같은 생각은 1921년 3월, 탐보프의 안토노프 봉기와 크론시타트 반란을 겪은 뒤에야 신경제정책으로 채택되었다.',
                links: [['신경제정책', T('nep')], ['안토노프 봉기', T('antonovshchina')]],
            },
            after: '1920년 1월 3일 차리친, 8일 로스토프를 되찾았다. 2월 21일 아르한겔스크, 3월 17일 예카테리노다르에 들어갔고, 3월 27일 데니킨군은 노보로시스크에서 배를 타고 크림으로 철수했다. 2월 7일 콜차크는 이르쿠츠크에서 총살되었다.',
            links: [['알렉산드르 콜차크', P('alexander-kolchak')], ['제1기병군의 부됸니', P('semyon-budyonny')]],
        },
        {
            id: 'poland', date: '1920년 4–8월', end: [1920, 8], title: '바르샤바로?',
            mobilize: 19, commissars: 3, army: [['conscripts', 15], ['latvian', 1], ['cavalry', 3]], phase: 5,
            brief: [
                '4월 25일 피우수트스키의 폴란드군이 페틀류라의 우크라이나군과 함께 공세를 시작해 5월 7일 키예프에 들어갔다. 붉은 군대는 6월 12일 키예프를 되찾고, 투하쳅스키의 서부전선이 7월 민스크를 지나 서쪽으로 내달린다.',
                '6월, 데니킨에게서 지휘권을 넘겨받은 브란겔이 크림에서 나와 북타브리아를 차지했다. 7월 11일 영국 외무장관 커즌이 휴전과 「커즌선」을 제안한다.',
            ],
            threats: {
                west: { pressure: 10, foes: ['poland'], text: '폴란드군이 벨라루스에서 물러난다.', who: ['유제프 피우수트스키', 'jozef-pilsudski'] },
                southwest: { pressure: 8, foes: ['poland', 'unr'], text: '키예프를 차지한 폴란드군을 몰아내야 한다.' },
                crimea: { pressure: 8, foes: ['wrangel'], text: '브란겔의 러시아군이 크림에서 나와 북타브리아로 진격한다.', who: ['표트르 브란겔', 'pyotr-wrangel'] },
            },
            cards: ['train', 'requisition', 'cheka', 'amnesty'],
            choice: {
                title: '커즌선을 넘을 것인가', who: ['미하일 투하쳅스키', 'tukhachevsky'],
                text: '레닌과 투하쳅스키는 바르샤바까지 가면 폴란드 노동자가 일어서고 독일 혁명으로 가는 길이 열린다고 본다. 커즌의 제안을 받아 민족 경계선에서 멈추고 강화하자는 목소리도 있다. 남서전선의 예고로프와 스탈린은 바르샤바가 아니라 리비우를 노린다.',
                options: [
                    { id: 'warsaw', label: '바르샤바로 진격한다', flag: 'warsaw', effect: '바르샤바를 칠 수 있다. 실패하면 서부전선이 무너진다', voices: '레닌, 투하쳅스키' },
                    { id: 'curzon', label: '커즌선에서 멈추고 강화한다', flag: 'curzon', effect: '서부를 지키고, 남은 사단으로 크림을 친다(페레코프 전투에 증원 1개 사단)', voices: '트로츠키, 라데크' },
                ],
                history: 'warsaw',
                after: '붉은 군대는 8월 바르샤바 앞까지 갔지만, 8월 16일 피우수트스키의 반격에 측면이 무너졌다. 폴란드 노동자는 일어서지 않았다. 남서전선은 리비우에 매달려 서부전선을 돕지 못했다. 10월 휴전과 1921년 리가 조약으로 벨라루스와 우크라이나 서부가 폴란드에 넘어갔다.',
                links: [['커즌선', T('curzon-line')], ['소비에트-폴란드 전쟁', E('soviet-polish-war')]],
            },
            after: '6월 12일 키예프를 되찾고 7월 11일 민스크에 들어갔지만, 8월 바르샤바 전투에서 졌다. 남쪽에서는 브란겔이 크림에서 나와 멜리토폴과 북타브리아를 차지했다.',
            links: [['미하일 투하쳅스키', P('tukhachevsky')], ['유제프 피우수트스키', P('jozef-pilsudski')]],
        },
        {
            id: 'perekop', date: '1920년 9–11월', end: [1920, 11], title: '페레코프',
            mobilize: 18, commissars: 3, army: [['conscripts', 14], ['latvian', 1], ['cavalry', 3]], phase: 6, battle: true,
            brief: [
                '10월 폴란드와 휴전하자 붉은 군대는 남쪽으로 돌아섰다. 프룬제의 남부전선이 10월 말 북타브리아의 브란겔군을 크림으로 몰아넣는다.',
                '크림으로 가는 길은 폭 8킬로미터의 페레코프 지협, 그 위를 가로막은 높이 10미터의 「터키 방벽」뿐이다. 동쪽은 얕은 석호 시바시다.',
            ],
            threats: {
                crimea: { pressure: 12, foes: ['wrangel'], text: '브란겔군이 북타브리아에서 크림의 방어선으로 물러난다.', who: ['표트르 브란겔', 'pyotr-wrangel'] },
            },
            cards: ['train', 'requisition', 'cheka'],
            choice: {
                title: '마흐노와 손을 잡을 것인가', who: ['네스토르 마흐노', 'nestor-makhno'],
                text: '브란겔이 우크라이나 남부로 올라오자 마흐노의 반란군이 다시 협정을 제안한다. 1919년 여름 붉은 군대는 마흐노를 무법자로 선포했었다. 아나키스트를 다시 믿어도 되는가?',
                options: [
                    { id: 'makhno', label: '스타로빌스크 협정을 맺는다', flag: 'makhno', effect: '페레코프 전투에 마흐노 부대(기관총 수레 기병) 합류', voices: '프룬제, 남부전선 혁명군사회의' },
                    { id: 'alone', label: '붉은 군대만으로 싸운다', cohesion: 3, effect: '당 결속 +3', voices: '마흐노를 믿지 않는 이들' },
                ],
                history: 'makhno',
                after: '10월 스타로빌스크에서 협정이 맺어졌고, 카레트니크의 마흐노 부대가 페레코프 작전에 참가해 시바시를 건넜다. 크림이 해방되자 붉은 군대는 11월 26일 마흐노 운동을 공격했고, 카레트니크는 체포되어 총살되었다.',
                links: [['네스토르 마흐노', P('nestor-makhno')], ['마흐노 운동', T('makhnovshchina')]],
            },
            after: '11월 8일 밤 프룬제의 부대가 시바시를 건너 브란겔의 페레코프 방어선을 우회했고, 11일 유순 방어선이 뚫렸다. 브란겔은 11월 13일부터 16일까지 126척의 배에 군인과 민간인 14만 5천 명을 태워 콘스탄티노폴리스로 떠났다.',
            links: [['미하일 프룬제', P('frunze')], ['표트르 브란겔', P('pyotr-wrangel')]],
        },
    ];

    // The decisive battle: Perekop, the Sivash and Chongar, 7–12 November
    // 1920. Grid rows run north (Red mainland) to south (Crimea). Terrain:
    // . steppe, ~ Sivash shallows (fordable while the west wind holds),
    // # deep water, W the Turkish Wall, Y the Yushun lines, C the Chongar
    // positions, b the burnt Chongar bridge, t town.
    const battle = {
        title: '페레코프-촌가르 작전', date: '1920년 11월 7–12일',
        map: [
            '#............',
            '#............',
            '#...~~~~~~...',
            '#WWW~~~~~~...',
            '#...~~~~~~~..',
            '#t..~~...~~..',
            '#...~....~#bb',
            '#.........CCC',
            '#YYYYYYYY....',
            '#..t.........',
            '#.........t..',
            '#............',
        ],
        goals: [{ at: [9, 3], name: '유순 역' }, { at: [10, 10], name: '잔코이' }],
        towns: [['아르먄스크', 5, 1]],
        places: [['터키 방벽', 3, 0.1], ['시바시', 3, 6], ['리톱스키 반도', 6, 5], ['유순 방어선', 8, 0.1], ['북타브리아', 0, 4], ['촌가르 반도', 2, 9.6], ['촌가르 해협', 6, 9.2], ['크림', 11, 6]],
        windTurns: 4,
        turnLimit: 12,
        // A Red unit on dry ground south of a line, within its columns and
        // rows (the outlined area on the board), turns it; its garrison
        // makes for the fallback tile.
        lines: {
            wall: { name: '터키 방벽', row: 3, until: 7, cols: [1, 8], label: [7, 4.1], fallback: [7, 2] },
            chongar: { name: '촌가르 방어선', row: 7, until: 11, cols: [9, 12], label: [11, 9.1], fallback: [9, 11] },
        },
        // The White reserve answers Red units past a sector's alarm row.
        sectors: {
            perekop: { name: '페레코프', cols: [0, 8], alarm: 4 },
            chongar: { name: '촌가르', cols: [9, 12], alarm: 6 },
        },
        terrain: {
            '.': { name: '초원', cost: 1, def: 0 },
            '~': { name: '시바시 여울', cost: 2, def: -1, ford: true },
            '#': { name: '깊은 물', cost: 99, def: 0 },
            W: { name: '터키 방벽', cost: 3, def: 3, fort: 'wall' },
            Y: { name: '유순 방어선', cost: 2, def: 2, fort: 'yushun' },
            C: { name: '촌가르 방어선', cost: 2, def: 2, fort: 'chongar' },
            b: { name: '촌가르 해협', cost: 2, def: 0 },
            t: { name: '마을', cost: 1, def: 1 },
        },
        units: [
            { id: 'r51a', tag: '51', side: 'red', name: '제51사단', sub: '블류헤르', kind: 'inf', at: [0, 1], hp: 10, atk: 5, def: 3, mv: 3, person: ['바실리 블류헤르', 'vasily-blyukher'] },
            { id: 'r51b', tag: '51돌격', side: 'red', name: '제51사단 돌격여단', sub: '블류헤르', kind: 'inf', at: [0, 3], hp: 10, atk: 5, def: 3, mv: 3 },
            { id: 'r51g', tag: '51포병', side: 'red', name: '제51사단 포병', kind: 'art', at: [1, 2], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'r6g', tag: '중포', side: 'red', name: '제6군 중포병', kind: 'art', at: [1, 1], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'rcz', tag: '증원', side: 'red', name: '증원 사단', sub: '서부에서 온', kind: 'inf', at: [0, 2], hp: 10, atk: 4, def: 3, mv: 3, flag: 'curzon' },
            { id: 'r15', tag: '15', side: 'red', name: '제15사단', sub: '시바시 도하', kind: 'inf', at: [1, 5], hp: 10, atk: 4, def: 3, mv: 3 },
            { id: 'rmk', tag: '마흐노', side: 'red', name: '마흐노 부대', sub: '카레트니크', kind: 'cav', at: [1, 6], hp: 8, atk: 5, def: 2, mv: 5, flag: 'makhno', person: ['네스토르 마흐노', 'nestor-makhno'] },
            { id: 'r52', tag: '52', side: 'red', name: '제52사단', sub: '시바시 도하', kind: 'inf', at: [1, 7], hp: 10, atk: 4, def: 3, mv: 3 },
            { id: 'r1c', tag: '1기병', side: 'red', name: '제1기병군', sub: '부됸니', kind: 'cav', at: [0, 8], hp: 12, atk: 6, def: 2, mv: 5, person: ['세묜 부됸니', 'semyon-budyonny'] },
            { id: 'r30', tag: '30', side: 'red', name: '제30사단', sub: '제4군', kind: 'inf', at: [1, 11], hp: 10, atk: 4, def: 3, mv: 3 },
            { id: 'r30b', tag: '30여단', side: 'red', name: '제30사단 여단', sub: '제4군', kind: 'inf', at: [1, 12], hp: 10, atk: 4, def: 3, mv: 3 },
            { id: 'r4g', tag: '4군포', side: 'red', name: '제4군 포병', kind: 'art', at: [0, 11], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'w1', tag: '드로즈', side: 'white', name: '드로즈돕스키 사단', sub: '방벽 수비', kind: 'inf', at: [3, 1], hp: 10, atk: 4, def: 3, mv: 3, role: 'wall', line: 'wall' },
            { id: 'w2', tag: '드로즈', side: 'white', name: '드로즈돕스키 사단', sub: '방벽 수비', kind: 'inf', at: [3, 2], hp: 10, atk: 4, def: 3, mv: 3, role: 'wall', line: 'wall' },
            { id: 'w2b', tag: '수비대', side: 'white', name: '방벽 수비대', kind: 'inf', at: [3, 3], hp: 8, atk: 3, def: 3, mv: 3, role: 'wall', line: 'wall' },
            { id: 'wg', tag: '포대', side: 'white', name: '방벽 포대', kind: 'art', at: [4, 2], hp: 6, atk: 4, def: 1, mv: 2, range: 2, role: 'wall', line: 'wall' },
            { id: 'w3', tag: '쿠반', side: 'white', name: '쿠반 여단', sub: '리톱스키 반도', kind: 'inf', at: [5, 7], hp: 8, atk: 3, def: 2, mv: 3, role: 'hold' },
            { id: 'w4', tag: '바르보', side: 'white', name: '바르보비치 기병군단', sub: '예비', kind: 'cav', at: [9, 6], hp: 10, atk: 6, def: 2, mv: 5, role: 'strike' },
            { id: 'w5', tag: '코르닐', side: 'white', name: '코르닐로프 사단', sub: '유순 방어선', kind: 'inf', at: [8, 2], hp: 10, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'w6', tag: '마르코', side: 'white', name: '마르코프 사단', sub: '유순 방어선', kind: 'inf', at: [8, 5], hp: 9, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'wc1', tag: '촌가르', side: 'white', name: '촌가르 수비대', sub: '다리 어귀', kind: 'inf', at: [7, 11], hp: 8, atk: 4, def: 3, mv: 3, role: 'wall', line: 'chongar' },
            { id: 'wc2', tag: '촌가르', side: 'white', name: '촌가르 수비대', sub: '동쪽 진지', kind: 'inf', at: [7, 12], hp: 8, atk: 3, def: 3, mv: 3, role: 'wall', line: 'chongar' },
            { id: 'wcg', tag: '포대', side: 'white', name: '촌가르 포대', kind: 'art', at: [8, 11], hp: 6, atk: 4, def: 1, mv: 2, range: 2, role: 'wall', line: 'chongar' },
        ],
        brief: [
            '크림으로 들어가는 길은 셋이다. 서쪽 페레코프 지협의 터키 방벽(방어 +3), 그 동쪽 시바시의 얕은 여울, 동쪽 끝의 촌가르 해협이다. 유순 역이나 잔코이에 붉은 군대 부대를 세우면 크림으로 가는 길이 열린다. 12턴이 주어진다.',
            '포병은 진지(방벽·유순·촌가르) 위의 적을 칠 때마다 그 진지의 방어를 1씩 깎는다. 포격을 거듭하면 정면으로도 방벽을 넘을 수 있지만 시간이 든다. 첫 칸은 비용이 이동력보다 커도 들어갈 수 있어서, 포병도 한 턴에 방벽 한 칸씩 넘는다.',
            '시바시 여울은 이동 비용 2, 방어 −1이다. 4턴이 지나면 바람이 바뀌어 물이 다시 차오른다. 그 뒤로는 여울에 들어갈 수 없고, 여울에 남은 부대는 턴마다 피해를 입는다.',
            '방어선 뒤의 노란 점선 지역에 붉은 부대가 서면 그 방어선은 우회된다. 수비대의 진지 방어는 +1로 줄고, 수비대는 물러날 길을 찾는다.',
            '백군 예비대인 바르보비치 기병군단은 하나뿐이다. 붉은 군대가 가장 깊이 들어온 구역으로 달려가고, 그 구역의 위협이 사라질 때까지 다른 곳으로 가지 않는다. 한쪽에서 먼저 압박해 예비대를 끌어낸 뒤 다른 쪽을 칠 수 있다.',
            '적과 맞닿은 칸에 들어가면 그 턴의 이동은 끝난다. 한 적을 여럿이 둘러싸고 치면 둘러싼 부대마다 피해가 1씩 늘어난다.',
        ],
        history: '11월 8일 새벽 제51사단의 방벽 정면 공격은 철조망과 기관총 앞에서 막혔다. 같은 날 밤 제15·52사단과 마흐노 부대가 현지 주민의 안내로 시바시를 건너 리톱스키 반도에 올랐고, 바르보비치 기병의 반격을 버텼다. 퇴로를 위협받은 백군은 9일 새벽 방벽을 버렸다. 11일 유순 방어선이 뚫렸고, 같은 날 밤 제4군의 제30사단이 촌가르 진지를 돌파했다. 붉은 기병이 그 뒤를 따라 크림으로 들어갔다.',
    };

    const epilogue = {
        lowPeasants: '1921년 봄, 내전에서 이긴 소비에트 정권 앞에 새 전선이 열렸다. 탐보프의 안토노프 봉기와 시베리아·우크라이나의 농민 반란, 그리고 3월 크론시타트 수병의 봉기. 제10차 당대회는 징발을 현물세로 바꾸는 신경제정책을 채택했다.',
        highPeasants: '징발의 부담을 덜어 둔 덕에 농촌의 원한은 역사보다 얕다. 실제 역사에서는 1921년 탐보프의 안토노프 봉기와 크론시타트 반란이 일어난 뒤에야 징발이 현물세로 바뀌었다.',
        links: [['크론시타트 반란', E('kronstadt-1921')], ['안토노프 봉기', T('antonovshchina')], ['신경제정책', T('nep')]],
    };

    const data = { factions, troops, fronts, frontOrder, moscow, startLines, cards, turns, battle, epilogue };
    if (typeof module === 'object' && module.exports) module.exports = data;
    else root.CivilWarData = data;
})(typeof window !== 'undefined' ? window : globalThis);
