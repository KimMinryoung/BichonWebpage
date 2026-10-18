/* global module */
/* Scenario of 「붉은 전선 1918–1920」: the seasons of the Russian Civil
   War from the Czech revolt to Perekop, played from the Soviet side.
   The war's content and its rules as data (the end of this file); the
   engine that runs them is war/engine.js. Dates, names and the
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
    // Where a voice's words were found: Russian Wikipedia and Wikisource,
    // Trotsky's military writings on marxists.org (Russian).
    const RU = page => 'https://ru.wikipedia.org/wiki/' + page;
    const WS = page => 'https://ru.wikisource.org/wiki/' + page;
    const TR = n => `https://www.marxists.org/russkij/trotsky/works/trotl${n}.html`;
    const TRS = page => `https://www.marxists.org/russkij/trotsky/${page}.htm`;
    // Stalin's Works, volume 4 (marxists.org, Russian).
    const ST = page => `https://www.marxists.org/russkij/stalin/t4/${page}.htm`;
    // A CommuLingo reference document.
    const D_ = id => '/commulingo/docs/' + id;

    const fronts = {
        east: {
            name: '동부전선', short: '동부',
            cities: [['카잔', 55.79, 49.12], ['심비르스크', 54.31, 48.40], ['사마라', 53.20, 50.15], ['우파', 54.74, 55.97], ['예카테린부르크', 56.84, 60.61]],
            history: [0, 4, 2, 4, 3, 5, 5, 5, 5, 5],
            holders: ['czech', 'komuch', 'komuch', 'komuch', 'kolchak', 'kolchak', 'kolchak', 'kolchak', 'kolchak', 'kolchak'],
        },
        volga: {
            name: '차리친 방면', short: '차리친',
            cities: [['사라토프', 51.53, 46.03], ['차리친', 48.71, 44.51]],
            history: [2, 2, 2, 2, 2, 1, 1, 2, 2, 2],
            holders: ['don', 'don', 'don', 'don', 'don', 'denikin', 'denikin', 'denikin', 'denikin', 'denikin'],
        },
        south: {
            name: '남부전선', short: '남부',
            cities: [['툴라', 54.19, 37.62], ['오룔', 52.97, 36.07], ['쿠르스크', 51.73, 36.19], ['하리코프', 49.99, 36.23], ['로스토프', 47.24, 39.71], ['예카테리노다르', 45.04, 38.98]],
            history: [3, 3, 3, 3, 4, 3, 2, 6, 6, 6],
            holders: ['central', 'central', 'central', 'central', 'denikin', 'denikin', 'denikin', 'denikin', 'wrangel', 'wrangel'],
            // Tula's arms works lost: the road to Moscow is open.
            defeat: { at: 0, outcome: { kind: 'moscow', title: '툴라가 떨어졌다', text: '백군이 툴라의 무기 공장을 지나 모스크바로 향한다. 혁명 정부는 무너졌다.' } },
        },
        northwest: {
            name: '북서전선', short: '북서',
            cities: [['페트로그라드', 59.94, 30.31], ['가치나', 59.57, 30.13], ['얌부르크', 59.37, 28.61]],
            history: [3, 3, 3, 3, 3, 2, 1, 3, 3, 3],
            holders: ['central', 'yudenich', 'yudenich', 'yudenich', 'yudenich', 'yudenich', 'yudenich', 'yudenich', 'yudenich', 'yudenich'],
            // Petrograd lost: the workers shaken, the party too; it can be
            // taken back. Its draft is lost while it is (mobilize).
            onLost: {
                at: 0, label: '페트로그라드 함락', effects: { workers: -15, cohesion: -10 },
                note: '페트로그라드가 함락되었다. 혁명의 도시를 잃은 노동자들이 흔들린다.', regained: '페트로그라드를 되찾았다.',
            },
        },
        north: {
            name: '북부전선', short: '북부',
            cities: [['볼로그다', 59.22, 39.89], ['아르한겔스크', 64.54, 40.54]],
            history: [1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
            holders: ['allies', 'allies', 'allies', 'allies', 'allies', 'allies', 'allies', 'north', 'north', 'north'],
            // Arkhangelsk retaken in the winter of 1920 (rules 8): the stores
            // the British left, and the Northern Army's soldiers who came over.
            prize: { at: 2, when: { rules: ['>=', 8], turn: 'counter' }, food: 3, divisions: 1, what: '영국군이 두고 간 군수 창고와 넘어온 북부 정부군 병사' },
        },
        west: {
            name: '서부전선', short: '서부',
            cities: [['스몰렌스크', 54.78, 32.05], ['민스크', 53.90, 27.57], ['바르샤바', 52.23, 21.01]],
            history: [1, 2, 1, 2, 2, 2, 1, 1, 2, 2],
            holders: ['central', 'central', 'central', 'central', 'poland', 'poland', 'poland', 'poland', 'poland', 'poland'],
            // Warsaw, the third city, is out of reach but for the march on
            // Warsaw: before rules 6 with WARSAW (8) to spare, from rules 6
            // by winning the battle of Warsaw it brings. The march that falls
            // short is routed before the Vistula; the one that takes Warsaw
            // ends the Polish war (warsawTaken: the next season's divisions,
            // Crimea's pressure, a division at Perekop, the epilogue).
            cap: {
                reach: 2, unlock: { choice: 'warsaw', margin: 8 }, battle: { id: 'warsaw', when: { rules: ['>=', 6] } },
                failed: { deserted: 3, note: '바르샤바 앞에서 측면이 무너졌다. 포로와 동프로이센으로 넘어간 병력으로 다음 시기 사단 3개를 잃는다.' },
                reached: {
                    note: '바르샤바에 붉은 군대가 들어갔다. 역사와 다른 길이다. 폴란드 노동자가 일어설지는 아무도 모른다.',
                    reward: {
                        when: { rules: ['>=', 6] }, label: '바르샤바 입성', flag: 'warsawTaken', workers: 8, cohesion: 5,
                        note: '폴란드가 강화를 청한다. 유럽 혁명이 눈앞에 온 듯 공장과 당이 들끓는다. 노동자 지지 +8, 당 결속 +5. 다음 시기 서부전선 사단 4개가 남쪽으로 돌아오고, 브란겔은 고립된다.',
                    },
                },
            },
        },
        southwest: {
            name: '남서전선', short: '남서',
            cities: [['키예프', 50.45, 30.52], ['리비우', 49.84, 24.03]],
            history: [0, 0, 0, 0, 1, 1, 0, 1, 1, 1],
            holders: ['central', 'unr', 'central', 'unr', 'poland', 'poland', 'denikin', 'poland', 'poland', 'poland'],
        },
        crimea: {
            name: '크림 방면', short: '크림',
            cities: [['알렉산드롭스크', 47.84, 35.14], ['멜리토폴', 46.85, 35.37], ['페레코프', 46.16, 33.69]],
            history: [0, 0, 0, 0, 0, 0, 0, 2, 1, 3],
            holders: ['central', 'denikin', 'central', 'denikin', 'denikin', 'denikin', 'denikin', 'wrangel', 'wrangel', 'wrangel'],
        },
    };

    // Who the Reds fought. kind colours the map: white (the White movement
    // and its allies), interv (foreign intervention), central (Germany and
    // Austria), national (the new states). flag: horizontal stripes, top
    // first, as flown in these years. trait: what made each of them who
    // they were, and the lever the Reds had against it: on a front this
    // faction attacks, the pressure moves by `by` when `when` holds (the
    // train or a commissar on the front is / is not there, `at` reserve
    // divisions kept back, workers or peasants `below` a level). motion:
    // how its marker comes onto the map. spoils: what it leaves behind when
    // it breaks before a front with strength to spare (rules 3).
    const TRICOLOR = ['#ffffff', '#0039a6', '#d52b1e'];
    const factions = {
        czech: {
            name: '체코슬로바키아 군단', short: '체코 군단', kind: 'white', flag: ['#ffffff', '#d7141a'], link: T('czechoslovak-legion'),
            sign: 'rails',
            note: '오스트리아군에서 넘어온 체코·슬로바키아 포로로 만든 군단. 프랑스 전선으로 가려고 시베리아 횡단철도를 타고 있었다. 1918–1920년 체코슬로바키아 국기는 폴란드처럼 흰색·빨간색 두 줄이었고, 1920년 3월 파란 삼각형이 더해졌다.',
            trait: { name: '철도 위의 군단', motion: 'rail', when: { not: { card: 'train' } }, by: 2, rule: '장갑열차가 이 전선에 없으면 압력 +2', text: '군단은 열차를 집 삼아 시베리아 횡단철도를 따라 싸웠다. 철도를 쥔 쪽이 볼가를 쥐었다. 장갑열차로 철도를 되찾아야 한다.' },
            cries: { beaten: '열차로 물러난다. 블라디보스토크는 멀다.', surging: '철도는 우리 것이다!' },
            spoils: '영국군이 남기고 간 창고',
            spoils: '철도 위의 보급 열차',
        },
        komuch: {
            name: '코무치 인민군', short: '코무치', kind: 'white', link: T('komuch'),
            sign: 'charter',
            note: '사마라에 선 사회혁명당 계열 제헌의회 의원 위원회(코무치)의 군대. 9월 옴스크의 디렉토리로 합쳐졌다가 11월 콜차크의 쿠데타로 밀려났다.',
            trait: { name: '제헌의회의 깃발', motion: 'march', when: { stat: ['workers', '<', 55] }, by: 2, rule: '노동자 지지가 55 아래면 압력 +2', text: '사회혁명당의 코무치는 「모든 권력을 제헌의회로」를 내걸었다. 1918년 8월 이젭스크·봇킨스크의 무기 공장 노동자가 소비에트에 맞서 일어나 인민군에 합류했다. 노동자가 등을 돌리면 그들이 코무치 편에 선다.' },
            cries: { beaten: '사마라를 버린다. 옴스크로!', surging: '볼가는 제헌의회의 것이다!' },
            spoils: '카잔과 사마라의 탄약 창고',
        },
        kolchak: {
            name: '콜차크 정부군', short: '콜차크', kind: 'white', flag: TRICOLOR, link: P('alexander-kolchak'),
            note: '옴스크의 「최고 통치자」 콜차크 제독의 군대. 영국이 소총과 군복을 댔다. 백군은 제정 러시아의 흰색·파란색·빨간색 삼색기를 썼다.',
            trait: { name: '시베리아의 파르티잔', motion: 'march', when: { stat: ['peasants', '<', 45] }, by: 2, rule: '농민 지지가 45 아래면 압력 +2', text: '콜차크 정부의 징병과 징발에 시베리아 농민이 들고일어나, 철도 뒤에서 파르티잔이 백군을 흔들었다. 붉은 군대의 징발이 그만큼 가혹해지면 농민은 어느 편도 들지 않는다.' },
            cries: { beaten: '우랄 너머로 물러난다.', surging: '볼가가 눈앞이다!' },
            spoils: '영국제 소총과 군복을 실은 열차',
        },
        don: {
            name: '돈 카자크군', short: '돈 카자크', kind: 'white', flag: ['#0033a0', '#ffd500', '#d52b1e'], link: T('don-republic'),
            sign: 'sabres',
            note: '아타만 크라스노프가 이끈 돈 카자크의 군대. 1918년에는 우크라이나를 점령한 독일의 지원을 받았다. 깃발은 돈 공화국의 파란색·노란색·빨간색.',
            trait: { name: '카자크 기병의 습격', motion: 'charge', when: { reserve: ['>=', 2] }, by: -2, rule: '예비 사단을 2개 이상 남기면 압력 −2', text: '카자크 기병은 전선의 틈을 뚫고 후방의 철도와 창고를 휘저었다. 1919년 8월 마몬토프의 기병군단은 탐보프까지 들어왔다. 뒤에 남긴 예비 사단이 습격을 막는다.' },
            cries: { beaten: '돈으로 돌아간다. 카자크의 땅을 지켜라.', surging: '후방의 철도를 휘저어라!' },
            spoils: '말과 안장',
        },
        denikin: {
            // On two fronts at once in 1919: a season's threat adds who led
            // it there, or which army (`as`), to 「데니킨군」 (`army`), and
            // from rules 8 gives it that commander's trait (`traits`); the
            // officers' regiments below are Kutepov's 1st Corps.
            name: '남러시아군(데니킨)', short: '데니킨', army: '데니킨군', kind: 'white', flag: TRICOLOR, link: T('armed-forces-of-south-russia'),
            note: '코르닐로프가 세운 의용군에 돈·쿠반 카자크군을 묶은 데니킨의 군대. 1919년 여름 「모스크바 지령」으로 북진했다.',
            trait: { name: '장교 연대', motion: 'charge', when: { leader: false }, by: 2, rule: '정치위원이 없는 전선이면 압력 +2', text: '코르닐로프·마르코프·드로즈돕스키 연대는 장교로만 채운 의용군의 정예였다. 정치위원 없이 맞선 징집 사단은 그 앞에서 흩어졌다.' },
            cries: { beaten: '장교 연대가 꺾였다.', surging: '모스크바로!' },
            spoils: '영국이 보낸 탄약과 군복',
        },
        yudenich: {
            name: '북서군(유데니치)', short: '유데니치', kind: 'white', flag: TRICOLOR, link: T('north-western-army-white'),
            note: '에스토니아를 발판으로 페트로그라드를 노린 유데니치 장군의 백군.',
            trait: { name: '페트로그라드 기습', motion: 'charge', when: { any: [{ rules: ['<', 5], stat: ['workers', '<', 50] }, { rules: ['>=', 5], stat: ['workers', '<', 45] }] }, by: 2, rule: '노동자 지지가 45 아래면 압력 +2', text: '유데니치는 영국이 준 전차 여섯 대를 앞세워 풀코보 고지까지 왔다. 도시를 지킨 것은 거리에 바리케이드를 쌓은 페트로그라드 노동자였다.' },
            cries: { beaten: '에스토니아로 물러난다.', surging: '페트로그라드가 보인다!' },
            spoils: '탄약 수레와 군량',
        },
        allies: {
            name: '연합국 간섭군', short: '간섭군', kind: 'interv',
            sign: 'anchor',
            note: '영국을 중심으로 프랑스·미국 병력이 무르만스크와 아르한겔스크에 상륙해 북부 정부를 세웠다. 영국군은 1919년 가을 철수했다.',
            trait: { name: '지친 원정군', motion: 'sail', when: { leader: true }, by: -1, rule: '정치위원이 있으면 압력 −1', text: '세계대전을 마친 영국·미국·프랑스 병사들은 남의 나라 내전에 머물 생각이 없었다. 볼셰비키의 외국어 전단이 병영에 돌았고, 1919년 봄 반란과 명령 거부가 잇따랐다.' },
            cries: { beaten: '병사들은 집에 가고 싶어 한다.', surging: '드비나강을 거슬러 오른다.' },
            spoils: '아르한겔스크의 군수 창고',
        },
        north: {
            name: '북부 정부군', short: '북부 정부', kind: 'white', flag: TRICOLOR, link: T('northern-region-government'),
            note: '영국군이 떠난 뒤 밀러 장군이 이끈 아르한겔스크의 백군.',
            trait: { name: '버려진 정부', motion: 'march', when: { leader: true }, by: -2, rule: '정치위원이 있으면 압력 −2', text: '영국군이 떠나자 북부 정부군 병사들이 장교를 버리고 붉은 군대로 넘어왔다. 1920년 2월 밀러는 배로 달아났다.' },
            cries: { beaten: '배로 떠난다.', surging: '아르한겔스크는 아직 우리 것이다.' },
        },
        central: {
            name: '독일·오스트리아군', short: '독일·오스트리아', kind: 'central', flag: ['#000000', '#ffffff', '#dd0000'], link: E('brest-litovsk'),
            sign: 'iron-cross',
            note: '브레스트 강화로 우크라이나·벨라루스·발트를 점령한 동맹국 군대. 1918년 11월 독일이 항복한 뒤 물러났다. 깃발은 독일 제국의 검은색·흰색·빨간색.',
            trait: { name: '점령군', motion: 'march', text: '브레스트 강화로 얻은 땅을 지키는 군대. 1918년 11월 독일이 항복하자 싸우지 않고 물러난다.' },
            cries: { beaten: '휴전이다. 집으로 간다.', surging: '점령지를 지킨다.' },
            spoils: '점령지의 창고',
        },
        poland: {
            name: '폴란드군', short: '폴란드', kind: 'national', flag: ['#ffffff', '#dc143c'], link: P('jozef-pilsudski'),
            sign: 'eagle',
            note: '1918년 독립을 되찾은 폴란드의 군대. 피우수트스키가 이끌었다.',
            trait: { name: '조국을 지키는 군대', motion: 'march', rule: '바르샤바는 바르샤바 전투에서 이겨야 들어간다', text: '침공군으로 키예프까지 왔던 폴란드군도 비스와강 앞에서는 나라를 지키는 군대였다. 폴란드 노동자는 붉은 군대를 해방군으로 맞지 않았다.' },
            cries: { beaten: '부크강 뒤로 물러난다.', surging: '동쪽으로 밀어붙여라!' },
            spoils: '탄약 수레와 군량',
        },
        unr: {
            name: '우크라이나 인민공화국군', short: '우크라이나', kind: 'national', link: P('symon-petliura'),
            sign: 'trident',
            note: '페틀류라가 이끈 디렉토리 정부의 군대. 1920년 폴란드와 동맹해 키예프로 들어왔다.',
            trait: { name: '아타만의 농민군', motion: 'charge', when: { stat: ['peasants', '<', 40] }, by: 1, rule: '농민 지지가 40 아래면 압력 +1', text: '디렉토리의 병력은 저마다 아타만을 따르는 농민 무리였다. 징발에 지친 우크라이나 마을이 그들을 먹이고 숨겼다.' },
            cries: { beaten: '아타만들이 흩어진다.', surging: '키예프는 우크라이나의 것이다!' },
            spoils: '탄약과 말',
        },
        wrangel: {
            name: '러시아군(브란겔)', short: '브란겔', kind: 'white', flag: TRICOLOR, link: P('pyotr-wrangel'),
            note: '노보로시스크 철수 뒤 데니킨에게서 지휘권을 넘겨받은 브란겔이 크림에서 다시 세운 백군.',
            trait: { name: '브란겔의 토지법', motion: 'rail', when: { stat: ['peasants', '<', 40] }, by: 2, rule: '농민 지지가 40 아래면 압력 +2', text: '브란겔은 1920년 5월 지주의 땅 일부를 농민에게 넘기는 토지법을 내고 질서 있는 정부를 꾸몄다. 붉은 군대의 징발에 지친 북타브리아 농민 일부가 그에게 기대를 걸었다.' },
            cries: { beaten: '방벽 뒤로, 크림으로!', surging: '북타브리아의 곡식은 우리 것이다.' },
            spoils: '영국제 전차와 탄약',
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
            name: '라트비아·에스토니아 소총사단', link: T('orel-kromy-operation'),
            note: '1919년 10월 오룔 반격의 주력. 라트비아 소총사단이 충격군의 중심이 되어 의용군의 측면을 쳤고, 뒤이어 투입된 에스토니아 소총사단이 10월 20일 오룔에 들어갔다.',
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
            name: '붉은 기병', link: T('first-cavalry-army'),
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
            title: '트로츠키의 장갑열차', short: '장갑열차', onRail: true, advisor: ['레프 트로츠키', 'trotsky'], cost: 1, target: 'front', bonus: 3,
            turns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            text: '전쟁인민위원의 열차가 위기의 전선으로 달려간다. 인쇄소·전신국·예비 무기와 함께 도망친 부대를 다시 세운다.',
            note: '트로츠키는 내전 동안 이 열차로 10만 킬로미터 넘게 전선을 돌았다.',
            link: ['트로츠키의 열차', T('trotsky-train')],
        },
        requisition: {
            title: '식량 징발대 파견', advisor: ['블라디미르 레닌', 'lenin'], cost: 1, food: 5, peasants: -4,
            turns: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            text: '무장한 노동자 분견대를 곡창 지대로 보내 「잉여」 곡물을 거둔다. 도시와 군대는 먹지만 마을은 등을 돌린다.',
            link: ['식량 독재', T('food-dictatorship')],
        },
        kombedy: {
            title: '빈농위원회', advisor: ['야코프 스베르들로프', 'sverdlov'], cost: 1, food: 3, peasants: -4, workers: 3,
            turns: [0, 1, 2, 3],
            text: '마을의 빈농을 조직해 부농의 곡물을 찾아내게 한다. 1918년 12월 마을 소비에트로 흡수되기까지 여름과 가을 동안만 쓸 수 있다.',
            link: ['빈농위원회', T('kombedy-committees-of-the-poor')],
        },
        cheka: {
            title: '체카의 후방 단속', advisor: ['펠릭스 제르진스키', 'dzerzhinsky'], cost: 1, needs: 'unrest', idle: '농민 지지가 35 아래로 떨어져 봉기가 일어나야 쓸 수 있다', peasants: -3, cohesion: -3,
            turns: [1, 2, 3, 4, 5, 6, 7, 8],
            text: '후방의 농민 봉기를 비상위원회가 진압한다. 봉기에 묶인 사단의 절반이 바로 전선으로 돌아오지만, 공포는 지지를 깎는다.',
            link: ['적색 테러', T('red-terror')],
        },
        amnesty: {
            title: '탈영병 자수 기간', advisor: ['레프 트로츠키', 'trotsky'], cost: 1, divisions: 2, cohesion: -3, escalates: true,
            turns: [4, 5, 6, 7],
            text: '정해진 기간 안에 돌아온 탈영병은 처벌하지 않고 부대로 돌려보낸다. 1919년 한 해 동안 탈영병 수십만 명이 이렇게 돌아왔다.',
        },
        propaganda: {
            title: '간섭군 병사에게 선전', advisor: ['블라디미르 레닌', 'lenin'], cost: 1, calm: { fronts: ['north', 'south'], by: 2 },
            turns: [4, 5],
            text: '외국어 전단과 신문을 간섭군 병영에 들여보낸다. 1919년 4월 오데사 앞바다에서 프랑스 수병들이 반란을 일으켰고, 프랑스는 남부에서 병력을 거두었다.',
        },
        // Grain spent on the villages: while the requisition stands, the
        // only way the peasants' trust rises before the tax in kind.
        relief: {
            title: '할당량 감면', advisor: ['미하일 칼리닌', 'kalinin'], cost: 1, food: -6, peasants: 4,
            when: { flag: 'razverstka', noFlag: 'tax' },
            turns: [5, 6, 7, 8],
            text: '전러시아 중앙집행위원회 의장 칼리닌이 선전열차를 타고 마을을 돌며 농민의 청원을 듣는다. 흉작과 전투로 짓밟힌 군의 할당량을 깎아 주면 곡물은 덜 걷히지만 마을은 숨을 돌린다.',
            link: ['식량 할당제', T('prodrazvyorstka')],
        },
        partyWeek: {
            title: '당 주간', advisor: ['블라디미르 레닌', 'lenin'], cost: 1, divisions: 3, workers: 4, cohesion: 3,
            turns: [6],
            text: '위기의 가을, 당이 입당 문을 활짝 열고 공산주의자를 대거 전선으로 보낸다. 1919년 가을의 당 주간에 20만 명 넘게 입당했다.',
        },
        cavalry: {
            title: '제1기병군 창설', advisor: ['세묜 부됸니', 'semyon-budyonny'], cost: 1, flag: 'cavalry', divisions: -2,
            turns: [7],
            text: '부됸니의 기병군단을 군으로 키운다. 보병 두 개 사단 몫을 떼어 주면, 이후 남부·크림·남서 전선에서 늘 +4의 타격력을 낸다.',
            note: '1919년 11월 창설. 백군 기병의 기동에 처음으로 같은 무기로 맞섰다.',
        },
        mironov: {
            title: '미로노프의 제2기병군', short: '제2기병군', advisor: ['필리프 미로노프', 'filipp-mironov'], cost: 1, target: 'front', fronts: ['crimea'], requires: 'mironov', bonus: 3,
            turns: [9],
            text: '사면받은 미로노프가 이끄는 제2기병군. 10월 북타브리아에서 브란겔의 기병을 깨뜨렸다. 크림 방면에만 보낼 수 있고, 보내면 페레코프 전투에 합류한다.',
            note: '1919년 미로노프를 사면했을 때만 나온다.',
        },
        // Rules 6: the 1st Cavalry Army turned from Lviv to the Vistula, as
        // the commander-in-chief ordered and the South-Western Front did not.
        konarmia: {
            title: '부됸니의 제1기병군', short: '제1기병군', advisor: ['세르게이 카메네프', 'sergey-kamenev'], cost: 1, target: 'front', fronts: ['west'], requires: 'cavalry', bonus: 4,
            when: { rules: ['>=', 6] }, turns: [8],
            effect: '남서·크림의 제1기병군 +4가 빠진다 · 바르샤바 전투에 합류',
            text: '리비우를 치던 제1기병군을 북쪽으로 돌려 서부전선에 붙인다. 바르샤바 남쪽의 빈 옆구리를 막을 수 있는 것은 이 기병뿐이다. 대신 남서전선과 크림에서는 기병의 타격력이 빠진다.',
            note: '8월 중순 총사령관 카메네프가 제1기병군을 서부전선으로 넘기라고 명령했지만, 남서전선 혁명군사위원 스탈린은 그 명령에 서명하지 않았다. 기병군은 8월 20일 무렵까지 리비우에 매달려 있었다. 제1기병군을 창설했을 때만 나온다.',
            link: ['붉은 군대 제1기병군', T('first-cavalry-army')],
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
            voices: [
                { by: 'czech', at: 'east', text: '어디서도 소비에트에 무기를 내주지 마라. 먼저 싸움을 걸지는 말되, 공격받으면 맞서라.', src: ['군단 임시집행위원회의 명령, 1918년 5월', RU('Восстание_Чехословацкого_корпуса')] },
                { who: ['레프 트로츠키', 'trotsky'], at: 'moscow', text: '철도 연선의 모든 소비에트는 무거운 책임을 지고 체코슬로바키아인을 무장해제하라. 무기를 든 채 철도에서 발견되는 체코슬로바키아인은 누구든 그 자리에서 총살하라.', src: ['트로츠키의 전보, 1918년 5월 25일', RU('Восстание_Чехословацкого_корпуса')] },
                { by: 'komuch', at: 'east', text: '사마라에서 선포한다. 볼셰비키 권력은 끝났다. 모든 권력을 제헌의회로!' },
                { by: 'allies', at: 'north', text: '연합국이 보낸 군수품을 독일에 넘길 수는 없다. 아르한겔스크에 상륙한다.' },
                { who: ['이오시프 스탈린', 'stalin'], at: 'volga', text: '우리 군사 「전문가」(구두장이들!)가 잠자고 빈둥거리지 않았다면 철길은 끊기지 않았을 것이다.', src: ['스탈린이 레닌에게 보낸 편지, 차리친, 1918년 7월 7일', ST('letter_lenin1')] },
            ],
            threats: {
                east: { pressure: 6, foes: ['czech', 'komuch'], text: '군단과 코무치 인민군이 볼가를 거슬러 오른다. 카펠의 부대는 카잔의 금 보유고를 노린다.', who: ['블라디미르 카펠', 'vladimir-kappel'] },
                volga: { pressure: 2, foes: ['don'], text: '크라스노프의 돈군이 차리친을 처음으로 공격한다.', who: ['표트르 크라스노프', 'pyotr-krasnov'] },
                north: { pressure: 1, foes: ['allies'], text: '연합군 함대가 아르한겔스크 앞바다에 나타났다.' },
            },
            cards: ['train', 'requisition', 'kombedy'],
            incident: {
                id: 'leftsr', title: '좌파 사회혁명당의 봉기', who: ['마리야 스피리도노바', 'maria-spiridonova'],
                text: '7월 6일 좌파 사회혁명당원 블륨킨이 독일 대사 미르바흐를 암살하고, 당 지도부가 모스크바에서 봉기했다. 10일에는 동부전선 사령관 무라비요프가 심비르스크에서 독일과의 전쟁 재개를 외치며 반기를 들었다.',
                talk: [
                    { who: ['마리야 스피리도노바', 'maria-spiridonova'], text: '브레스트 강화는 혁명을 독일 제국주의에 팔아넘긴 것이다. 마을에서 곡식을 빼앗는 징발대도 더는 두고 볼 수 없다!' },
                    { who: ['블라디미르 레닌', 'lenin'], text: '대사를 죽여 독일과 다시 전쟁을 일으키려는 반란이다. 진압하고, 그 당을 소비에트에서 내보내야 한다.' },
                    { as: '좌파 사회혁명당 안의 온건파', text: '봉기는 지도부 몇 사람이 벌인 일이오. 주모자만 벌하고 연정은 살립시다. 농민의 당까지 잃어서는 안 되오.' },
                ],
                options: [
                    { id: 'purge', label: '봉기를 진압하고 좌파 사회혁명당을 소비에트에서 몰아낸다', peasants: -2, effect: '농민 지지 −2(이유: 농민을 대표하던 연정 상대를 잃음)' },
                    { id: 'coalition', label: '주모자만 처벌하고 농민 대표와의 연정을 살린다', cohesion: -3, peasants: 3, bars: ['kombedy'], effect: '농민 지지 +3, 당 결속 −3. 연정 상대가 반대하는 빈농위원회 카드를 1918년 내내 쓸 수 없다' },
                ],
                history: 'purge',
                after: '라트비아 소총병이 이틀 만에 봉기를 진압했고, 무라비요프는 11일 심비르스크에서 체포되던 중 사살되었다. 좌파 사회혁명당은 소비에트에서 쫓겨났고, 소비에트 정권은 볼셰비키 한 당의 정부가 되었다.',
                links: [['좌파 사회혁명당 봉기', T('left-sr-uprising-1918')], ['미하일 무라비요프', P('mikhail-muravyov')]],
            },
            choice: {
                title: '누가 군대를 지휘하는가', who: ['레프 트로츠키', 'trotsky'],
                text: '3월에 전쟁인민위원이 된 트로츠키가 차르 군대의 장교를 다시 불러 쓰자고 제안했다. 많은 볼셰비키가 반대한다.',
                talk: [
                    { who: ['레프 트로츠키', 'trotsky'], text: '차르 군대의 장교 수만 명을 「군사전문가」로 다시 부르자. 명령마다 정치위원이 함께 서명하게 하면 배신은 막을 수 있다.' },
                    { as: '좌파 공산주의자', text: '혁명을 짓밟은 장교에게 혁명의 군대를 맡기자는 말이오? 지휘관은 병사들이 뽑아야 하오.' },
                    { who: ['블라디미르 레닌', 'lenin'], text: '전쟁도 배워야 하는 기술이다. 옛 군대의 전문가를 부려 그들의 지식을 빼앗아야 한다.' },
                ],
                options: [
                    { id: 'experts', label: '군사전문가를 기용한다', flag: 'experts', cohesion: -6, effect: '다음 시기부터 모든 전선의 전투력 +25%. 당 결속 −6' },
                    { id: 'elected', label: '선출 지휘관과 유격대로 싸운다', cohesion: 4, divisions: 1, effect: '이번 시기 사단 +1, 당 결속 +4. 전투력은 그대로' },
                ],
                history: 'experts',
                after: '붉은 군대는 1918년 말까지 구 장교 2만여 명을, 내전 동안 모두 7만 명 넘게 기용했다. 반대파는 1919년 3월 제8차 당대회에서 「군사 반대파」로 맞섰고, 차리친의 스탈린·보로실로프도 이들과 부딪쳤다.',
                links: [['군사 반대파', T('military-opposition')], ['정치위원', T('political-commissar')]],
            },
            after: '8월 7일 카펠의 부대가 카잔과 제정의 금 보유고를 빼앗았다. 사마라·심비르스크·우파·예카테린부르크가 이미 넘어갔고, 8월 2일 연합군이 아르한겔스크에 상륙했다. 차리친은 크라스노프의 첫 공격을 막아 냈다.',
            links: [['체코슬로바키아 군단', T('czechoslovak-legion')], ['코무치', T('komuch')], ['얼음 행군', T('ice-march-1918')], ['러시아 내전', E('civil-war')]],
        },
        // The autumn of 1918 as one season, the calendar before rules 7
        // (an older save replays it); rules 7 splits it into Kazan
        // (September) and Tsaritsyn (October–December) below.
        {
            id: 'volga', date: '1918년 9–12월', end: [1918, 12], title: '스비야시스크에서 차리친까지', when: { rules: ['<', 7] },
            mobilize: 9, commissars: 2, army: [['conscripts', 5], ['latvian', 1], ['guards', 1], ['internationalists', 1], ['flotilla', 1]], phase: 1, battle: 'kazan',
            brief: [
                '트로츠키는 장갑열차로 카잔 건너편 스비야시스크에 사령부를 차리고, 도망친 연대의 지휘관과 정치위원을 총살하며 제5군을 다시 세웠다. 8월 30일 레닌이 저격당했고, 인민위원회는 「적색 테러」를 선포했다.',
                '11월 독일이 항복해 우크라이나와 발트에서 물러나기 시작한다. 같은 달 옴스크에서는 콜차크 제독이 쿠데타로 「최고 통치자」가 되었다. 크라스노프는 차리친을 다시 노린다.',
            ],
            voices: [
                { who: ['레프 트로츠키', 'trotsky'], at: 'east', text: '카잔은 반드시 되찾아야 한다!', src: ['트로츠키의 명령 「카잔은 반드시 되찾아야 한다!」, 1918년 8월 24일', TR(710)] },
                { by: 'komuch', at: 'east', text: '제정의 금 보유고가 우리 손에 있다. 카잔은 내주지 않는다.' },
                { by: 'don', who: ['표트르 크라스노프', 'pyotr-krasnov'], at: 'volga', text: '이번에는 차리친을 에워싸 굶긴다. 볼가를 끊으면 모스크바도 굶는다.' },
                { by: 'kolchak', who: ['알렉산드르 콜차크', 'alexander-kolchak'], at: 'east', text: '옴스크의 디렉토리는 끝났다. 이제 최고 통치자가 명령한다.' },
            ],
            threats: {
                east: { pressure: 7, foes: ['komuch', 'kolchak'], text: '카잔의 백군은 지쳤다. 지금 몰아치면 볼가를 되찾을 수 있다.', who: ['알렉산드르 콜차크', 'alexander-kolchak'] },
                volga: { pressure: 5, foes: ['don'], text: '돈군이 차리친을 포위하려 한다. 식량 전권을 가지고 온 스탈린이 지휘까지 쥐었다.', who: ['표트르 크라스노프', 'pyotr-krasnov'] },
            },
            cards: ['train', 'requisition', 'kombedy', 'cheka'],
            choice: {
                title: '곡물을 어떻게 거둘 것인가', who: ['블라디미르 레닌', 'lenin'],
                text: '도시는 굶고 군대는 빵이 모자란다. 곡물 독점과 고정가로는 농민이 곡물을 내놓지 않는다.',
                talk: [
                    { who: ['블라디미르 레닌', 'lenin'], text: '나라가 필요한 곡물 총량을 정해 현마다 할당하고, 무장 분견대로 거두자. 빵이 없으면 혁명도 없다.' },
                    { as: '좌파 사회혁명당 출신 농민 대표', text: '총을 들이대면 농민은 곡식을 숨기고 씨를 덜 뿌린다. 값을 올려 사고, 공산품과 바꿔 주시오.' },
                ],
                options: [
                    { id: 'razverstka', label: '식량 할당제를 도입한다', flag: 'razverstka', effect: '매 시기 곡물 +7, 농민 지지 −3' },
                    { id: 'market', label: '고정가 수매와 교환을 늘린다', flag: 'market', effect: '매 시기 곡물 +1, 농민 지지 +2, 노동자 지지 −2(이유: 배급이 줄어 도시가 굶음)' },
                ],
                history: 'razverstka',
                after: '1919년 1월 식량 할당제가 도입되었다. 군대와 도시는 빵을 얻었지만, 할당량을 채우려는 징발은 마을의 씨앗 곡물까지 가져갔다. 이 체제가 「전시 공산주의」의 핵심이었다.',
                links: [['식량 할당제', T('prodrazvyorstka')], ['전시 공산주의', T('war-communism')]],
            },
            after: '9월 10일 카잔, 12일 심비르스크, 10월 7일 사마라를 되찾았다. 붉은 군대의 첫 승리였다. 12월 31일에는 우파도 탈환했다. 차리친은 세 차례 공격을 모두 버텼고, 독일군이 떠난 자리로 붉은 군대가 들어가 1919년 1월 초 리가와 빌뉴스, 하리코프에 이르렀다.',
            links: [['카잔 작전', T('kazan-operation-1918')], ['차리친 방어', T('defence-of-tsaritsyn')], ['공화국 혁명군사평의회', T('revvoensovet')], ['적색 테러', T('red-terror')]],
        },
        {
            id: 'kazan', date: '1918년 9월', end: [1918, 9], title: '스비야시스크에서 카잔까지', when: { rules: ['>=', 7] },
            mobilize: 7, commissars: 2, army: [['conscripts', 3], ['latvian', 1], ['guards', 1], ['internationalists', 1], ['flotilla', 1]], phase: 1, battle: 'kazan',
            brief: [
                '트로츠키는 장갑열차로 카잔 건너편 스비야시스크에 사령부를 차리고, 도망친 연대의 지휘관과 정치위원을 총살하며 제5군을 다시 세웠다. 8월 30일 모스크바에서 레닌이 총에 맞았고, 같은 날 페트로그라드에서는 체카 의장 우리츠키가 암살되었다.',
                '9월 2일 전러시아 중앙집행위원회는 공화국을 하나의 군사 진영으로 선포하고, 트로츠키를 의장으로 한 공화국 혁명군사평의회와 총사령관 바체티스를 세웠다. 이제 모든 전선은 한 사령부의 명령을 받는다. 남쪽에서는 첫 공격에서 물러난 크라스노프가 차리친을 다시 노린다.',
            ],
            voices: [
                { who: ['레프 트로츠키', 'trotsky'], at: 'east', text: '카잔은 반드시 되찾아야 한다!', src: ['트로츠키의 명령 「카잔은 반드시 되찾아야 한다!」, 1918년 8월 24일', TR(710)] },
                { by: 'komuch', at: 'east', text: '제정의 금 보유고가 우리 손에 있다. 카잔은 내주지 않는다.' },
                { who: ['이오시프 스탈린', 'stalin'], at: 'volga', text: '레닌 동지의 목숨을 노린 비열한 기도에, 군사평의회는 부르주아지와 그 앞잡이들에 맞선 공공연하고 대대적이며 체계적인 테러를 조직하는 것으로 답한다.', src: ['스탈린·보로실로프가 스베르들로프에게 보낸 전보, 1918년 8월 31일', ST('telegram_sverdlov')] },
                { by: 'don', who: ['표트르 크라스노프', 'pyotr-krasnov'], at: 'volga', text: '첫 공격은 돈강 너머로 밀려났다. 이번에는 차리친을 세 방향에서 조인다.' },
            ],
            threats: {
                east: { pressure: 5, foes: ['komuch', 'czech'], text: '카잔의 백군은 지쳤다. 지금 몰아치면 볼가를 되찾을 수 있다.', who: ['블라디미르 카펠', 'vladimir-kappel'] },
                volga: { pressure: 2, foes: ['don'], text: '돈군이 두 번째 공세를 준비한다. 9월 21일 차리친 서쪽과 남쪽에서 다시 움직였다.', who: ['표트르 크라스노프', 'pyotr-krasnov'] },
            },
            cards: ['train', 'requisition', 'kombedy', 'cheka'],
            choice: {
                title: '적색 테러', who: ['펠릭스 제르진스키', 'dzerzhinsky'],
                text: '레닌이 총에 맞은 다음 날, 차리친의 스탈린과 보로실로프는 테러로 답하겠다고 전보했다. 체카는 법정을 거치지 않고 인질을 잡고 총살할 권한을 달라고 한다.',
                talk: [
                    { who: ['펠릭스 제르진스키', 'dzerzhinsky'], text: '체카는 혁명의 칼이다. 음모의 뿌리를 뽑으려면 재판을 기다릴 수 없다.' },
                    { who: ['야코프 스베르들로프', 'sverdlov'], text: '부르주아의 백색 테러에는 적색 테러로 답한다. 후방이 무너지면 전선도 없다.' },
                    { as: '혁명재판소 쪽 법률가들', text: '혁명재판소가 있다. 법정 없이 쏘기 시작하면 무고한 사람까지 휩쓸리고, 체카는 누구에게도 책임지지 않는 권력이 된다.' },
                ],
                options: [
                    { id: 'terror', label: '적색 테러를 선포한다', effect: '역사대로' },
                    { id: 'tribunals', label: '처벌을 혁명재판소에 맡긴다', peasants: 3, cohesion: -4, effect: '농민 지지 +3, 당 결속 −4(이유: 음모를 두려워하는 당이 흔들림)' },
                ],
                history: 'terror',
                after: '9월 5일 인민위원회는 「적색 테러에 관하여」 결정으로 계급의 적을 수용소에 가두고, 백군 조직과 음모·반란에 관련된 자를 총살한다고 선포했다. 페트로그라드에서만 수백 명의 인질이 총살되었다. 체카에 법정 밖의 권한을 줄 것인가를 두고 당 안의 논쟁은 그해 겨울까지 이어졌다.',
                links: [['적색 테러', T('red-terror')], ['체카', T('cheka')], ['펠릭스 제르진스키', P('dzerzhinsky')]],
            },
            after: '9월 10일 카잔, 12일 심비르스크를 되찾았다. 붉은 군대의 첫 승리였다. 9월 17일 남부전선이 서고 차르 군대 장군 출신 시틴이 사령관이 되었다. 차리친의 스탈린·보로실로프·미닌도 그 혁명군사평의회에 들어갔다.',
            links: [['카잔 작전', T('kazan-operation-1918')], ['공화국 혁명군사평의회', T('revvoensovet')], ['이오아킴 바체티스', P('ioakim-vatsetis')]],
        },
        {
            id: 'tsaritsyn', date: '1918년 10–12월', end: [1918, 12], title: '차리친 포위', when: { rules: ['>=', 7] },
            mobilize: 9, commissars: 2, army: [['conscripts', 6], ['guards', 1], ['internationalists', 1], ['flotilla', 1]], phase: 1, battle: 'tsaritsyn',
            brief: [
                '9월 21일 시작된 크라스노프의 두 번째 공세가 차리친을 조인다. 10월 8일 돈군이 틴구타에서 차리친–티호레츠카야 철도를 끊었고, 사렙타와 베케톱카가 넘어갔다. 15일 베케톱카 근처에서 제1·2농민연대가 백군에게 넘어갔다. 도시를 지키는 것은 순환 철도를 오가는 장갑열차와 쿨리크의 포병뿐이다.',
                '그사이 차리친의 세 사람, 스탈린·보로실로프·미닌은 남부전선 사령관 시틴과 맞서고 있다. 동부에서는 붉은 군대가 사마라로 다가간다. 11월에는 독일이 항복해 우크라이나와 발트에서 물러나기 시작하고, 옴스크에서는 콜차크 제독이 쿠데타로 「최고 통치자」가 된다.',
            ],
            voices: [
                { by: 'don', who: ['표트르 크라스노프', 'pyotr-krasnov'], at: 'volga', text: '차리친을 에워싸 굶긴다. 볼가를 끊으면 모스크바도 굶는다.' },
                { who: ['레프 트로츠키', 'trotsky'], at: 'moscow', text: '스탈린의 소환을 단호히 요구한다. 차리친 전선은 병력이 넘치는데도 형편이 좋지 않다. 보로실로프는 연대는 지휘할 수 있지만 5만 병사의 군대는 지휘하지 못한다.', src: ['트로츠키가 스베르들로프·레닌에게 보낸 전보, 1918년 10월 4일', TRS('1931/stalin_school/10')] },
                { by: 'komuch', at: 'east', text: '사마라를 버린다. 우파와 우랄에서 다시 선다.' },
                { by: 'kolchak', who: ['알렉산드르 콜차크', 'alexander-kolchak'], at: 'east', text: '옴스크의 디렉토리는 끝났다. 이제 최고 통치자가 명령한다.' },
            ],
            threats: {
                east: { pressure: 7, foes: ['komuch', 'kolchak'], text: '코무치 인민군이 사마라에서 우파로 물러난다. 우랄 앞에서 콜차크가 선다.', who: ['알렉산드르 콜차크', 'alexander-kolchak'] },
                volga: { pressure: 5, foes: ['don'], text: '돈군이 서쪽·남쪽에서 차리친의 순환 철도까지 밀고 들어왔다.', who: ['표트르 크라스노프', 'pyotr-krasnov'] },
            },
            cards: ['train', 'requisition', 'kombedy', 'cheka'],
            incident: {
                id: 'sytin', title: '차리친과 남부전선 사령부', who: ['이오시프 스탈린', 'stalin'],
                text: '9월 17일 남부전선 혁명군사평의회가 섰다. 사령관은 차르 군대 장군 출신 시틴, 위원은 스탈린·미닌·보로실로프였다. 차리친의 세 사람은 23일 스스로 스탈린을 의장으로 세우고 사령부를 코즐로프가 아니라 차리친에 두라고 했으며, 10월 1일 시틴을 물리고 보로실로프를 사령관에 앉혀 달라고 청했다. 중앙위원회는 「복종 없이는 하나의 군대가 없다」고 답했다.',
                talk: [
                    { who: ['이오시프 스탈린', 'stalin'], text: '시틴은 전선에 쓸모없을 뿐 아니라 믿을 수 없어 해로운 자다. 비당원 반혁명 진영에서 온 군사전문가 문제를 다시 따져야 한다.' },
                    { who: ['레프 트로츠키', 'trotsky'], text: '스탈린을 불러들여야 한다. 차리친은 아직 코즐로프에 작전 보고조차 보내지 않는다. 내일도 보내지 않으면 보로실로프와 미닌을 재판에 넘기겠다.' },
                    { who: ['야코프 스베르들로프', 'sverdlov'], text: '혁명군사평의회의 결정은 모든 전선을 묶는다. 옳지 않다고 여기면 따르면서 위에 호소하라. 어떤 다툼도 있어서는 안 된다.' },
                ],
                options: [
                    { id: 'recall', label: '스탈린을 불러들이고 차리친을 남부전선 사령부 아래에 둔다', effect: '역사대로. 보로실로프는 시틴에게 복종하는 조건으로 제10군을 맡는다' },
                    { id: 'tsaritsyn', label: '차리친의 청대로 시틴을 물리고 보로실로프에게 남부전선을 맡긴다', flag: 'tsaritsynGroup', cohesion: 3, pressure: { volga: -2 }, effect: '이번 시기 차리친 압력 −2, 당 결속 +3. 다음 시기 남부 압력 +3(이유: 전선끼리 손발이 맞지 않음)' },
                ],
                history: 'recall',
                after: '스탈린은 10월 초 모스크바로 갔다가 8일 공화국 혁명군사평의회 위원이 되어 11일 차리친으로 돌아왔고, 19일 다시 불려 갔다. 시틴은 11월까지 남부전선을 지휘했다. 23일 레닌은 트로츠키에게 「스탈린과 함께 일할 길을 찾는 데 온 힘을 다해야 한다」고 썼다. 그러나 12월 14일 트로츠키는 보로실로프를 더 둘 수 없다고 전보했고, 12월 말 예고로프가 제10군을 넘겨받았다. 1929년 보로실로프의 글 「스탈린과 붉은 군대」는 이 가을을 스탈린의 전략적 승리로 그렸고, 1989년 겔레르는 같은 일을 당과 군의 규율을 짓밟은 사건으로 그렸다.',
                links: [['차리친 방어', T('defence-of-tsaritsyn')], ['클리멘트 보로실로프', P('voroshilov')], ['파벨 시틴', P('pavel-sytin')], ['겔레르, 「스탈린의 인민위원」', D_('geller-stalinist-commissar-1989')]],
            },
            choice: {
                title: '곡물을 어떻게 거둘 것인가', who: ['블라디미르 레닌', 'lenin'],
                text: '도시는 굶고 군대는 빵이 모자란다. 곡물 독점과 고정가로는 농민이 곡물을 내놓지 않는다.',
                talk: [
                    { who: ['블라디미르 레닌', 'lenin'], text: '나라가 필요한 곡물 총량을 정해 현마다 할당하고, 무장 분견대로 거두자. 빵이 없으면 혁명도 없다.' },
                    { as: '좌파 사회혁명당 출신 농민 대표', text: '총을 들이대면 농민은 곡식을 숨기고 씨를 덜 뿌린다. 값을 올려 사고, 공산품과 바꿔 주시오.' },
                ],
                options: [
                    { id: 'razverstka', label: '식량 할당제를 도입한다', flag: 'razverstka', effect: '매 시기 곡물 +7, 농민 지지 −3' },
                    { id: 'market', label: '고정가 수매와 교환을 늘린다', flag: 'market', effect: '매 시기 곡물 +1, 농민 지지 +2, 노동자 지지 −2(이유: 배급이 줄어 도시가 굶음)' },
                ],
                history: 'razverstka',
                after: '1919년 1월 식량 할당제가 도입되었다. 군대와 도시는 빵을 얻었지만, 할당량을 채우려는 징발은 마을의 씨앗 곡물까지 가져갔다. 이 체제가 「전시 공산주의」의 핵심이었다.',
                links: [['식량 할당제', T('prodrazvyorstka')], ['전시 공산주의', T('war-communism')]],
            },
            after: '10월 15일 즐로바의 「강철 사단」이 북캅카스에서 800킬로미터를 걸어와 돈군의 뒤를 쳤고, 17일 결정적 공격은 쿨리크가 모은 포병에 꺾였다. 25일까지 돈군은 돈강 너머로 물러났다. 동부에서는 10월 7일 사마라, 12월 31일 우파를 되찾았다. 독일군이 떠난 자리로 붉은 군대가 들어가 1919년 1월 초 리가와 빌뉴스, 하리코프에 이르렀다.',
            links: [['차리친 방어', T('defence-of-tsaritsyn')], ['그리고리 쿨리크', P('grigory-kulik')], ['적색 테러', T('red-terror')]],
        },
        {
            id: 'kolchak', date: '1919년 1–4월', end: [1919, 4], title: '콜차크의 춘계 공세',
            mobilize: 13, commissars: 2, army: [['conscripts', 10], ['latvian', 1], ['cavalry', 1], ['internationalists', 1]], phase: 2,
            brief: [
                '3월, 영국이 대 준 소총으로 무장한 콜차크군이 우랄을 넘었다. 한진의 서부군이 3월 13일 우파를 점령하고 볼가 100킬로미터 앞까지 밀려온다.',
                '돈에서는 3월 베셴스카야의 카자크가 붉은 군대 후방에서 봉기했다. 남쪽의 데니킨은 쿠반과 북캅카스를 손에 넣고 북쪽을 바라본다.',
            ],
            voices: [
                { by: 'kolchak', who: ['알렉산드르 콜차크', 'alexander-kolchak'], at: 'east', text: '우랄을 넘었다. 볼가에서 데니킨과 손잡고 모스크바로 간다.' },
                { who: ['블라디미르 레닌', 'lenin'], at: 'moscow', text: '동부전선에서 콜차크가 거둔 승리는 소비에트 공화국에 몹시 무서운 위험을 낳고 있다.', src: ['레닌, 「동부전선의 정세에 관한 러시아 공산당 중앙위원회 테제」, 1919년 4월 11일', WS('Тезисы_ЦК_РКП(б)_в_связи_с_положением_Восточного_фронта_(Ленин)')] },
                { by: 'don', at: 'south', text: '뵤셴스카야가 일어섰다! 붉은 군대의 뒤를 끊어라.' },
                { who: ['미하일 프룬제', 'frunze'], at: 'east', text: '적의 진격로가 너무 길게 늘어졌다. 정면이 아니라 옆구리를 친다.' },
                { who: ['이오시프 스탈린', 'stalin'], at: 'moscow', text: '엄격한 규율을 갖춘 진짜 노동자·농민의 정규군을 만들어 공화국을 지키든가, 그러지 못하고 일을 망치든가 둘 중 하나다.', src: ['스탈린, 제8차 당대회 군사 문제 연설, 1919년 3월 21일', ST('military_question')] },
            ],
            threats: {
                east: { pressure: 10, foes: ['kolchak'], text: '한진의 서부군이 볼가로 진격한다. 사마라와 카잔이 위험하다.', who: ['미하일 한진', 'mikhail-hanzhin'] },
                south: { pressure: 6, foes: ['don', 'denikin'], text: '돈 카자크의 봉기가 남부전선의 후방을 흔든다.', who: ['안톤 데니킨', 'anton-denikin'] },
                volga: { pressure: 4, foes: ['don'], text: '차리친 앞의 돈군은 아직 물러서지 않았다.' },
            },
            cards: ['train', 'requisition', 'cheka', 'propaganda', 'amnesty'],
            incident: [{
                id: 'decossack', title: '탈카자크화 지령', who: ['야코프 스베르들로프', 'sverdlov'],
                text: '1월 24일 당 중앙위원회 조직국이 돈과 쿠반의 부유한 카자크와 백군에 가담한 카자크를 가차 없이 없애라는 비밀 지령을 내렸다. 붉은 군대가 들어간 돈 북부에서 혁명재판소의 처형이 시작되었다.',
                talk: [
                    { who: ['야코프 스베르들로프', 'sverdlov'], text: '카자크 상층은 반혁명의 기둥이다. 지령대로 가차 없이 집행하라.' },
                    { who: ['필리프 미로노프', 'filipp-mironov'], text: '이 지령은 중립을 지키던 카자크까지 백군 편으로 몰아낸다. 돈 전체가 들고일어날 것이다.' },
                    { who: ['그리고리 소콜니코프', 'sokolnikov'], text: '마을마다 총살하면 남부전선의 후방이 불탄다. 중립 카자크를 우리 편으로 끌어들여야 한다.' },
                ],
                options: [
                    { id: 'enforce', label: '지령대로 집행한다', effect: '역사대로. 3월 돈 북부의 봉기가 남부전선을 흔든다' },
                    { id: 'suspend', label: '지령을 거두고 중립 카자크를 끌어들인다', cohesion: -3, pressure: { south: -3 }, effect: '이번 시기 남부 압력 −3(이유: 봉기가 작아짐), 당 결속 −3' },
                ],
                history: 'enforce',
                after: '3월 11일 뵤셴스카야 스타니차에서 봉기가 일어나 붉은 군대의 후방을 끊었다. 중앙위원회는 3월 16일 지령을 멈췄지만, 봉기한 카자크는 6월 데니킨군과 합류할 때까지 버텼고 남부전선이 무너지는 길을 열었다.',
                links: [['탈카자크화', T('decossackization')], ['뵤셴스카야 봉기', T('vyoshenskaya-uprising')]],
            }, {
                id: 'congress8', title: '제8차 당대회와 군사 반대파', who: ['블라디미르 스미르노프', 'vladimir-smirnov'], when: { rules: ['>=', 7] },
                text: '3월 18일 제8차 당대회가 열렸다. 트로츠키는 전선에 남았고, 소콜니코프가 중앙위원회의 군사 테제를, 블라디미르 스미르노프가 「군사 반대파」의 부보고를 맡았다. 옛 좌파 공산주의자와 전선의 당 일꾼이 모인 반대파에는 차리친의 보로실로프와 미닌도 있었다. 대회의 군사 분과는 37대 20으로 반대파의 테제를 지지했다.',
                talk: [
                    { who: ['블라디미르 스미르노프', 'vladimir-smirnov'], text: '부르주아 군사전문가는 지휘관이 아니라 고문으로만 써야 한다. 병사에게 상관에게 경례하라는 규정은 전제와 농노제의 찌꺼기다.' },
                    { who: ['클리멘트 보로실로프', 'voroshilov'], text: '차리친은 노동자 부대와 당원이 지켰다. 전문가라는 자들은 우리를 배신하고 백군으로 넘어갔다.' },
                    { who: ['블라디미르 레닌', 'lenin'], text: '여러분은 빨치산 시절의 영웅적인 전통에 매여, 지금은 시기가 다르다는 것을 이해하려 하지 않는다. 이제는 군사전문가를 둔 정규군이 먼저다.' },
                    { who: ['이오시프 스탈린', 'stalin'], text: '스미르노프의 안은 군대의 규율을 무너뜨릴 뿐이다. 엄격한 규율의 정규군을 만들지 못하면 공화국을 지킬 수 없다.' },
                ],
                options: [
                    { id: 'compromise', label: '중앙위원회 테제를 기초로 하되 반대파의 비판을 결의에 담는다', effect: '역사대로. 정치위원과 당 세포의 권한이 커진다' },
                    { id: 'opposition', label: '군사 반대파의 테제를 채택한다', flag: 'advisers', cohesion: 4, effect: '당 결속 +4. 군사전문가를 기용했다면 다음 시기부터 그 +25% 가운데 15%p를 잃는다' },
                ],
                history: 'compromise',
                after: '3월 21일 비공개 회의에서 레닌이 몇 시간에 걸쳐 반대파를 반박했고, 스탈린도 정규군을 옹호했다. 중앙위원회 테제가 174대 95로 기초로 채택되었지만, 레닌은 당이 갈라질 것을 걱정해 화해 위원회를 세웠고, 23일 타협 결의가 만장일치(기권 1)로 채택되었다. 전러시아 군사위원국 대신 공화국 혁명군사평의회 정치부가 서고 정치위원의 권한이 커졌다. 트로츠키와 겔레르는 스탈린이 보로실로프를 앞세운 반대파의 막후였다고 보았지만, 기록으로 확인되는 것은 그가 공개적으로는 중앙위원회 편에 섰다는 것이다. 비공개 회의의 기록은 1989년에야 공개되었다.',
                links: [['군사 반대파', T('military-opposition')], ['블라디미르 스미르노프', P('vladimir-smirnov')], ['정치위원', T('political-commissar')]],
            }],
            choice: {
                title: '콜차크의 늘어진 측면', who: ['미하일 프룬제', 'frunze'],
                text: '콜차크군이 볼가를 향해 밀고 온다. 남부집단군을 맡은 프룬제가 반격 계획을 내놓았다.',
                talk: [
                    { who: ['미하일 프룬제', 'frunze'], text: '콜차크의 진격로는 너무 길게 늘어졌다. 정면에 병력을 쏟지 말고 부줄루크 남쪽에 모아 두었다가, 4월 말 그 측면을 찌르자.' },
                    { as: '동부전선 사령부의 일부', text: '그동안 정면은 더 밀린다. 사마라와 카잔을 내줄 셈이오? 지금 정면을 메워야 하오.' },
                    { who: ['세르게이 카메네프', 'sergey-kamenev'], text: '적이 길게 늘어질수록 측면은 얇아진다. 프룬제의 계획에 걸자.' },
                ],
                options: [
                    { id: 'flank', label: '측면 반격을 준비한다', flag: 'flank', effect: '이번 시기 동부 전투력 −3, 다음 시기 동부 +7' },
                    { id: 'front', label: '정면을 증원해 버틴다', effect: '이번 시기 동부 전투력 +3' },
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
            mobilize: 15, commissars: 3, army: [['conscripts', 12], ['latvian', 1], ['cavalry', 2]], phase: 2, battle: 'ufa',
            brief: [
                '동부에서는 반격이 시작되었다. 하지만 남쪽이 무너지고 있다. 돈 봉기가 붉은 군대를 묶은 사이 데니킨이 6월 25일 하리코프, 30일 차리친을 차지했고, 7월 3일 차리친에서 모스크바로의 세 갈래 진격을 명령했다.',
                '5월에는 유데니치의 북서군이 에스토니아에서 페트로그라드로 첫 공세를 시작했다. 이 공세의 길목인 얌부르크가 넘어갔다.',
            ],
            voices: [
                { by: 'denikin', who: ['안톤 데니킨', 'anton-denikin'], at: 'south', text: '러시아의 심장 모스크바를 차지하는 것을 최종 목표로 삼아 명령한다.', src: ['데니킨의 「모스크바 지령」, 1919년 7월 3일', RU('Московская_директива')] },
                { who: ['블라디미르 레닌', 'lenin'], at: 'moscow', text: '사회주의 혁명의 가장 위급한 순간 가운데 하나, 아마도 바로 가장 위급한 순간이 왔다.', src: ['레닌, 「모두 데니킨과의 싸움으로!」, 1919년 7월 9일', WS('Все_на_борьбу_с_Деникиным!_(Ленин)')] },
                { by: 'yudenich', at: 'northwest', text: '에스토니아에서 페트로그라드까지는 한 걸음이다.' },
                { by: 'kolchak', at: 'east', text: '우랄 너머로 물러난다. 시베리아에서 다시 일어설 것이다.' },
            ],
            threats: {
                east: { pressure: 5, foes: ['kolchak'], text: '콜차크군이 우랄로 물러난다. 추격할 때다.' },
                south: { pressure: 9, foes: ['denikin'], traits: { denikin: { name: '모스크바 지령', motion: 'charge', when: { stat: ['cohesion', '<', 50] }, by: 2, rule: '당 결속이 50 아래면 압력 +2', text: '7월 3일 데니킨은 차리친에서 「모스크바 지령」을 내리고 모든 군을 모스크바로 몰았다. 볼셰비키 정권이 안에서 무너지고 있다고 믿었다. 당이 흔들리면 그 계산이 맞아떨어진다.' } }, text: '데니킨의 의용군이 하리코프로 쳐들어온다.', who: ['안톤 데니킨', 'anton-denikin'] },
                volga: { pressure: 3, foes: ['denikin'], as: { denikin: '브란겔' }, traits: { denikin: { name: '차리친 강습', motion: 'charge', when: { alloc: ['<', 2] }, by: 2, rule: '이 전선에 사단이 2개 아래면 압력 +2', text: '브란겔의 캅카스군은 영국제 전차와 장갑열차를 앞세워 1919년 6월 30일 차리친에 들어갔다. 얇게 지킨 진지는 전차 앞에서 버티지 못했다.' } }, text: '브란겔의 캅카스군이 차리친을 공격한다.', who: ['표트르 브란겔', 'pyotr-wrangel'] },
                northwest: { pressure: 4, foes: ['yudenich'], text: '유데니치의 북서군이 얌부르크로 온다.', who: ['니콜라이 유데니치', 'nikolai-yudenich'] },
            },
            cards: ['train', 'requisition', 'relief', 'cheka', 'amnesty', 'propaganda'],
            incident: {
                id: 'hungary', title: '헝가리로 갈 것인가', who: ['니키포르 흐리호리우', 'nykyfor-hryhoriv'],
                text: '3월 21일 헝가리에 평의회 공화국이 섰다. 붉은 군대 우크라이나 전선은 베사라비아로 나아가 헝가리를 도우려 했다. 그런데 이 원정에 나설 아타만 흐리호리우의 사단이 5월 초 미콜라이우와 예카테리노슬라프 사이를 차지하고, 8일 「우니베르살」을 내 소비에트 정권에 반기를 들었다.',
                talk: [
                    { who: ['니키포르 흐리호리우', 'nykyfor-hryhoriv'], text: '우크라이나 인민이여, 코뮤니스트와 체카의 독재를 끝내라! 우크라이나는 우크라이나인의 것이다.' },
                    { who: ['쿤 벨러', 'bela-kun'], text: '헝가리 평의회 공화국은 사방에서 포위되었다. 붉은 군대여, 카르파티아를 넘어 와 달라!' },
                    { as: '우크라이나 전선 사령부', text: '흐리호리우를 등 뒤에 두고 원정을 떠날 수는 없다. 봉기부터 진압해야 한다.' },
                ],
                options: [
                    { id: 'crush', label: '원정을 미루고 흐리호리우부터 진압한다', effect: '역사대로' },
                    { id: 'hungary', label: '봉기는 남은 병력에 맡기고 헝가리로 간다', divisions: -2, workers: 3, cohesion: 2, pressure: { south: 2 }, effect: '이번 시기 사단 −2, 남부 압력 +2(이유: 흐리호리우 봉기), 노동자 지지 +3, 당 결속 +2' },
                ],
                history: 'crush',
                after: '흐리호리우의 봉기는 5월 말 진압되었고, 그는 7월 마흐노의 부대에 살해되었다. 그러나 봉기로 우크라이나 전선이 무너져 데니킨군에게 돈바스를 내주었고, 베사라비아로 가는 원정은 끝내 떠나지 못했다. 헝가리 평의회 공화국은 8월 1일 무너졌다.',
                links: [['니키포르 흐리호리우', P('nykyfor-hryhoriv')], ['헝가리 평의회 공화국', E('hungarian-soviet-republic-1919')]],
            },
            choice: {
                title: '우랄 너머로, 아니면 남쪽으로', who: ['세르게이 카메네프', 'sergey-kamenev'],
                text: '콜차크군이 우랄로 물러나는 동안, 남쪽에서는 데니킨의 의용군이 하리코프로 쳐들어온다.',
                talk: [
                    { who: ['이오아킴 바체티스', 'ioakim-vatsetis'], text: '우랄에서 멈추고 동부의 사단을 남쪽으로 돌려야 한다. 지금 더 급한 것은 데니킨이다.' },
                    { who: ['레프 트로츠키', 'trotsky'], text: '총사령관의 말이 옳다. 남부전선이 무너지면 모스크바가 위험하다.' },
                    { who: ['세르게이 카메네프', 'sergey-kamenev'], text: '지금 멈추면 콜차크는 겨울 동안 다시 일어선다. 끝까지 추격하자.' },
                    { who: ['블라디미르 레닌', 'lenin'], text: '겨울이 오기 전에 우랄을 되찾지 못하면 혁명은 끝장이다.' },
                ],
                options: [
                    { id: 'pursue', label: '우랄 너머로 추격한다', flag: 'pursue', effect: '다음 시기 동부의 콜차크는 무너진다. 남부는 이번 병력만으로' },
                    { id: 'turn', label: '우랄에서 멈추고 남쪽으로 돌린다', flag: 'turned', effect: '다음 시기 남부 전투력 +5. 동부 압력은 다음 두 시기 계속' },
                ],
                history: 'pursue',
                after: '중앙위원회는 추격을 택했다. 7월 바체티스가 물러나고 카메네프가 총사령관이 되었다. 붉은 군대는 7월 14일 예카테린부르크를 되찾고 11월 옴스크까지 진격했다. 남부는 그 대가로 가을 내내 위기에 빠졌다.',
                links: [['세르게이 카메네프', P('sergey-kamenev')], ['이오아킴 바체티스', P('ioakim-vatsetis')]],
            },
            after: '6월 9일 우파, 7월 14일 예카테린부르크를 되찾았다. 남쪽에서는 하리코프와 차리친이 넘어갔고, 북서에서는 유데니치가 얌부르크를 차지했다.',
            links: [['모스크바 지령', T('moscow-directive')], ['크라스나야 고르카 반란', T('krasnaya-gorka-mutiny')], ['안톤 데니킨', P('anton-denikin')], ['니콜라이 유데니치', P('nikolai-yudenich')]],
        },
        {
            id: 'orel', date: '1919년 8–10월', end: [1919, 10], title: '위기의 정점: 오룔과 페트로그라드',
            mobilize: 16, commissars: 3, army: [['conscripts', 12], ['baltic', 2], ['cavalry', 2]], phase: 3, battle: 'orel',
            brief: [
                '8월 마몬토프의 기병이 남부전선의 후방을 휩쓸었다. 8월 31일 백군은 키예프에 들어갔고, 9월 20일 쿠르스크가 떨어졌다. 의용군의 정예 사단들이 오룔과 툴라, 그리고 모스크바를 향한다.',
                '10월, 유데니치가 다시 페트로그라드로 온다. 서쪽에서는 폴란드군이 8월에 민스크를 차지했다. 데니킨의 후방 우크라이나에서는 마흐노의 반란군이 9월 페레고노프카에서 백군을 깨고 보급선을 끊고 있다.',
            ],
            voices: [
                { by: 'denikin', who: ['알렉산드르 쿠테포프', 'alexander-kutepov'], at: 'south', text: '오룔 다음은 툴라, 툴라 다음은 모스크바다!' },
                { by: 'yudenich', at: 'northwest', text: '풀코보 고지에서 이삭 대성당의 금빛 지붕이 보인다!' },
                { who: ['레프 트로츠키', 'trotsky'], at: 'northwest', text: '페트로그라드는 얌부르크도 루가도 아니다. 이 거대한 도시를 뚫고 들어온 백군은 돌로 된 미로에 갇힌다.', src: ['트로츠키, 「페트로그라드는 안에서 지킨다」, 1919년 10월 16일', TR(760)] },
                { by: 'poland', who: ['유제프 피우수트스키', 'jozef-pilsudski'], at: 'west', text: '민스크는 우리가 쥐었다. 데니킨이 모스크바에 가든 말든 서두를 것 없다.' },
                { who: ['이오시프 스탈린', 'stalin'], at: 'south', text: '실제로 이미 폐기된 옛 계획을 시간을 잃지 말고 지금 바꿔, 보로네시에서 하리코프와 돈바스를 거쳐 로스토프로 가는 주공 계획으로 대신해야 한다.', src: ['스탈린이 레닌에게 보낸 편지, 「1919년 10월 15일」 날짜', ST('letter_southern_front')] },
            ],
            threats: {
                south: { pressure: 14, foes: ['denikin'], as: { denikin: '쿠테포프' }, text: '쿠테포프의 제1군단이 오룔로 진격한다. 오룔 다음은 툴라, 툴라 다음은 모스크바다.', who: ['알렉산드르 쿠테포프', 'alexander-kutepov'] },
                northwest: { pressure: 6, foes: ['yudenich'], text: '유데니치의 북서군이 가치나를 지나 풀코보 고지로 온다.', who: ['니콜라이 유데니치', 'nikolai-yudenich'] },
                volga: { pressure: 3, foes: ['denikin'], as: { denikin: '브란겔' }, traits: { denikin: { name: '차리친 강습', motion: 'charge', when: { alloc: ['<', 2] }, by: 2, rule: '이 전선에 사단이 2개 아래면 압력 +2', text: '브란겔의 캅카스군은 영국제 전차와 장갑열차를 앞세워 1919년 6월 30일 차리친에 들어갔다. 얇게 지킨 진지는 전차 앞에서 버티지 못했다.' } }, text: '브란겔의 캅카스군은 볼가를 따라 북상하려 한다.', who: ['표트르 브란겔', 'pyotr-wrangel'] },
                west: { pressure: 3, foes: ['poland'], text: '폴란드군이 민스크로 진격한다.', who: ['유제프 피우수트스키', 'jozef-pilsudski'] },
            },
            cards: ['train', 'requisition', 'relief', 'cheka', 'amnesty', 'partyWeek'],
            incident: [{
                id: 'mironov', title: '미로노프의 무단 출정', who: ['필리프 미로노프', 'filipp-mironov'],
                text: '8월 말, 펜자 북동쪽 사란스크에서 돈 카자크 군단을 꾸리던 미로노프가 명령 없이 부대를 이끌고 남쪽으로 내려갔다. 고향 돈의 데니킨군과 직접 싸우겠다는 것이었다. 9월 그는 차리친 방면으로 가던 길에 부됸니의 기병에게 붙잡혀 군사재판에서 사형을 선고받았다.',
                talk: [
                    { who: ['필리프 미로노프', 'filipp-mironov'], text: '나는 돈으로 내려가 데니킨과 싸우겠다. 그리고 공산당 위원들의 전횡에도 맞서겠다.' },
                    { as: '군사재판', text: '명령 없이 전선을 떠난 반란이다. 본보기로 총살하라.' },
                    { who: ['레프 트로츠키', 'trotsky'], text: '그를 죽이면 붉은 카자크를 잃는다. 사면하고 다시 데니킨과 싸우게 하자.' },
                ],
                options: [
                    { id: 'pardon', label: '사면하고 다시 쓴다', flag: 'mironov', effect: '1920년 가을 「미로노프의 제2기병군」 카드를 쓸 수 있다' },
                    { id: 'execute', label: '본보기로 처형한다', cohesion: 3, effect: '당 결속 +3. 붉은 카자크 지휘관을 잃는다' },
                ],
                history: 'pardon',
                after: '트로츠키가 처형을 멈추었고, 10월 8일 전러시아 중앙집행위원회가 그를 사면했다. 미로노프는 1920년 입당해 그해 가을 제2기병군을 이끌고 브란겔군 기병을 꺾었다. 그러나 1921년 2월 다시 체포되었고, 4월 2일 부티르카 감옥 마당에서 보초에게 사살되었다. 경위는 밝혀지지 않았다. 1960년 복권되었다.',
                links: [['필리프 미로노프', P('filipp-mironov')], ['붉은 군대 제1기병군', T('first-cavalry-army')]],
            }, {
                id: 'axis', title: '남부전선의 주공은 어디로', who: ['세르게이 카메네프', 'sergey-kamenev'], when: { rules: ['>=', 7] },
                text: '1919년 8월, 총사령관 카메네프는 주공을 차리친 방면에 두고 그곳에서 데니킨의 근거지로 쳐 내려가게 했다. 그 사이 데니킨군은 남부전선에서 쿠르스크를 넘어 모스크바로 올라온다. 주공을 차리친 방면에 그대로 둘 것인가, 남부전선으로 옮길 것인가.',
                talk: [
                    { who: ['세르게이 카메네프', 'sergey-kamenev'], text: '차리친 방면에서 밀고 내려가 데니킨의 뒷마당을 끊어야 한다. 정한 계획을 흔들면 안 된다.' },
                    { who: ['레프 트로츠키', 'trotsky'], text: '차리친 아래는 카자크의 땅이다. 그리로 들어가면 카자크가 모두 들고일어난다. 주공을 남부전선으로 옮겨 노동자가 사는 하리코프와 돈바스, 적이 올라오는 길목을 쳐야 한다.' },
                    { who: ['블라디미르 레닌', 'lenin'], text: '총사령관의 계획을 이제 와서 뒤집지 마라.' },
                    { who: ['이오시프 스탈린', 'stalin'], text: '하지만 차리친 방면의 공세는 이미 실패했다. 주공을 남부전선으로, 하리코프와 돈바스로 돌려야 한다.' },
                ],
                options: [
                    { id: 'shift', label: '주공을 남부전선으로 옮긴다', cohesion: -3, effect: '당 결속 −3(이유: 총사령관의 계획을 뒤집음)' },
                    { id: 'don', label: '주공을 차리친 방면에 두고 공세를 이어 간다', pressure: { south: 3, volga: -2 }, effect: '이번 시기 남부 압력 +3(이유: 모스크바로 오는 길목이 비어 있음), 차리친 압력 −2(이유: 주공이 차리친 방면에 몰려 있음)' },
                ],
                history: 'shift',
                after: '8월 중순 차리친 방면에서 시작된 공세는 마몬토프의 습격에 후방이 짓밟히며 멈췄다. 9월 6일 정치국은 트로츠키 등의 계획 변경 요구를 「이미 정한 기본 전략 계획을 뒤집으려는 시도」라며 물리쳤다. 그러나 9월 20일 쿠르스크가 떨어지자 총사령부가 스스로 방향을 틀었다. 9월 30일 쇼린의 집단은 남동부전선으로 갈라졌고, 10월 9일 총사령관 지령으로 라트비아 사단과 파블로프·프리마코프 여단의 충격군이 크로미 북서쪽에 모였다. 11일 예고로프가 남부전선 사령관이 되었고 스탈린이 그 혁명군사평의회에 있었다. 「10월 15일」 날짜가 붙은 스탈린의 편지는 바꾸자는 옛 계획이 「실제로는 이미 폐기되었다」고 스스로 적었다. 1938년 『소련 공산당사 단기 과정』은 차리친 계획을 트로츠키의 것으로, 하리코프 계획을 스탈린의 것으로 바꿔 적었다.',
                links: [['마몬토프 습격', T('mamontov-raid')], ['오룔-크로미 작전', T('orel-kromy-operation')], ['『소련 공산당사 단기 과정』', D_('short-course-1938')]],
            }],
            choice: {
                title: '페트로그라드를 내줄 것인가', who: ['레프 트로츠키', 'trotsky'],
                text: '10월 중순, 남쪽에서는 데니킨군이 오룔에, 북서쪽에서는 유데니치군이 풀코보 고지에 다다랐다.',
                talk: [
                    { who: ['블라디미르 레닌', 'lenin'], text: '두 곳을 다 지킬 병력이 없다. 모스크바를 지키려면 페트로그라드를 내주고 그 병력을 남쪽으로 돌려야 하지 않겠나.' },
                    { who: ['레프 트로츠키', 'trotsky'], text: '혁명의 도시를 내줄 수는 없다. 거리마다 지키겠다. 내가 직접 가겠다.' },
                ],
                options: [
                    { id: 'hold', label: '페트로그라드를 사수한다', flag: 'heldPetrograd', effect: '북서 전투력 +4' },
                    { id: 'yield', label: '북서를 비우고 남쪽에 모은다', effect: '남부 전투력 +4, 북서 압력 +6' },
                ],
                history: 'hold',
                after: '정치국은 10월 15일 페트로그라드를 지키기로 했다. 트로츠키가 조직한 제7군과 노동자들이 풀코보 고지에서 유데니치를 막고 에스토니아로 밀어냈다. 남쪽에서는 라트비아·에스토니아 소총병 사단이 10월 20일 오룔을 되찾았다.',
                links: [['제7군', T('seventh-army-red-army')], ['레프 트로츠키', P('trotsky')]],
            },
            after: '10월 13일 오룔이 떨어졌다가 20일 되찾아졌다. 부됸니의 기병이 보로네시에서 백군 기병을 깨뜨렸다. 10월 20일 유데니치는 페트로그라드 외곽 풀코보 고지에 닿았지만 더 나아가지 못했다.',
            links: [['오룔-크로미 작전', T('orel-kromy-operation')], ['마몬토프 습격', T('mamontov-raid')], ['마흐노 운동', T('makhnovshchina')], ['세묜 부됸니', P('semyon-budyonny')]],
        },
        {
            id: 'counter', date: '1919년 11월–1920년 3월', end: [1920, 3], title: '남쪽으로의 반격',
            mobilize: 18, commissars: 3, army: [['conscripts', 14], ['baltic', 1], ['cavalry', 3]], phase: 4,
            brief: [
                '11월 14일 옴스크가 함락되었다. 콜차크군은 시베리아 횡단철도를 따라 2천 킬로미터를 물러나는 「대시베리아 빙상 행군」에 들어갔다. 남쪽의 데니킨군은 오룔에서 꺾여 돈으로 물러난다.',
                '1920년 2월, 트로츠키가 우랄에서 돌아와 중앙위원회에 곡물 징발을 세금으로 바꾸자고 제안한다. 마을마다 징발대에 맞선 봉기가 늘고 있다.',
            ],
            voices: [
                { who: ['세묜 부됸니', 'semyon-budyonny'], at: 'south', text: '기병에는 기병으로 맞선다. 제1기병군, 로스토프로!' },
                { by: 'denikin', at: 'south', text: '돈강 뒤에서 버틴다. 카자크의 땅을 내줄 수는 없다.' },
                { by: 'north', at: 'north', text: '영국군은 떠났다. 병사들이 장교를 버리고 넘어간다.' },
            ],
            threats: {
                south: { pressure: 13, foes: ['denikin'], traits: { denikin: { name: '카자크의 이탈', motion: 'march', when: { flag: 'mironov' }, by: -2, rule: '미로노프를 사면했으면 압력 −2', text: '퇴각 길에서 돈·쿠반 카자크는 고향을 지키겠다며 데니킨의 대열을 떠났다. 돈 카자크 사이에 이름이 높던 미로노프를 살려 두었다면 그들을 붉은 쪽으로 부를 수 있다.' } }, text: '데니킨군이 하리코프와 로스토프를 지나 쿠반으로 물러난다. 다시 버티지 못하게 몰아쳐야 한다.' },
                volga: { pressure: 3, foes: ['denikin'], as: { denikin: '캅카스군' }, traits: { denikin: { name: '고립된 캅카스군', motion: 'march', when: { played: 'cavalry' }, by: -2, rule: '제1기병군을 창설하면 압력 −2', text: '1920년 1월 제1기병군이 로스토프로 쳐들어가 데니킨군을 둘로 갈랐다. 차리친에 남은 캅카스군은 본대와 끊긴 채 무너졌다.' } }, text: '차리친의 캅카스군이 고립되었다.' },
                northwest: { pressure: 3, foes: ['yudenich'], text: '유데니치군이 에스토니아 국경으로 밀려났다.' },
                north: { pressure: 3, foes: ['north'], text: '영국군이 떠난 아르한겔스크의 북부 정부가 흔들린다.' },
            },
            cards: ['train', 'requisition', 'relief', 'cheka', 'amnesty', 'cavalry'],
            choice: {
                title: '징발 대신 세금을?', who: ['레프 트로츠키', 'trotsky'],
                text: '곡물 할당제가 2년째다. 농민은 거둬 갈 몫만큼 씨를 덜 뿌리고, 우랄을 돌아본 트로츠키가 중앙위원회에 다른 길을 내놓았다.',
                talk: [
                    { who: ['레프 트로츠키', 'trotsky'], text: '할당량을 정해 거두는 대신 수확에 비례한 현물세를 매기고, 나머지는 농민이 팔게 하자. 농민이 다시 씨를 뿌리게 해야 한다.' },
                    { as: '중앙위원회 다수', text: '전쟁이 끝나지 않았는데 곡물 공급을 시장에 맡길 수는 없다.' },
                ],
                options: [
                    { id: 'keep', label: '할당제를 유지한다', effect: '곡물 수입 그대로' },
                    { id: 'tax', label: '현물세로 바꾼다', flag: 'tax', effect: '매 시기 곡물 −10, 농민 지지 +8' },
                ],
                history: 'keep',
                after: '중앙위원회는 11대 4로 트로츠키의 제안을 부결했다. 같은 생각은 1921년 3월, 탐보프의 안토노프 봉기와 크론시타트 반란을 겪은 뒤에야 신경제정책으로 채택되었다.',
                links: [['신경제정책', T('nep')], ['안토노프 봉기', T('antonovshchina')]],
            },
            after: '1920년 1월 3일 차리친, 8일 로스토프를 되찾았다. 2월 21일 아르한겔스크, 3월 17일 예카테리노다르에 들어갔고, 3월 27일 데니킨군은 노보로시스크에서 배를 타고 크림으로 철수했다. 2월 7일 콜차크는 이르쿠츠크에서 총살되었다.',
            links: [['대시베리아 빙상 행군', T('great-siberian-ice-march')], ['노보로시스크 철수', T('novorossiysk-evacuation-1920')], ['붉은 군대 제1기병군', T('first-cavalry-army')], ['알렉산드르 콜차크', P('alexander-kolchak')]],
        },
        {
            id: 'poland', date: '1920년 4–8월', end: [1920, 8], title: '바르샤바로?',
            mobilize: 19, commissars: 3, army: [['conscripts', 15], ['latvian', 1], ['cavalry', 3]], phase: 5, battle: 'warsaw',
            brief: [
                '4월 25일 피우수트스키의 폴란드군이 페틀류라의 우크라이나군과 함께 공세를 시작해 5월 7일 키예프에 들어갔다. 붉은 군대는 6월 12일 키예프를 되찾고, 투하쳅스키의 서부전선이 7월 민스크를 지나 서쪽으로 내달린다.',
                '6월, 데니킨에게서 지휘권을 넘겨받은 브란겔이 크림에서 나와 북타브리아를 차지했다. 7월 11일 영국 외무장관 커즌이 휴전과 「커즌선」을 제안한다.',
            ],
            voices: [
                { by: 'poland', who: ['유제프 피우수트스키', 'jozef-pilsudski'], at: 'west', text: '키예프에 들어왔다. 이제 우크라이나가 러시아와 우리 사이의 방패가 된다.' },
                { by: 'wrangel', who: ['표트르 브란겔', 'pyotr-wrangel'], at: 'crimea', text: '크림에서 나간다. 땅은 그 땅을 가는 농민에게.' },
                { who: ['레프 트로츠키', 'trotsky'], at: 'west', text: '영웅들이여, 바르샤바로!', src: ['트로츠키의 명령 「영웅들이여, 바르샤바로!」, 1920년 8월 14일', TR(798)] },
            ],
            threats: {
                west: { pressure: 10, foes: ['poland'], text: '폴란드군이 벨라루스에서 물러난다.', who: ['유제프 피우수트스키', 'jozef-pilsudski'] },
                southwest: { pressure: 8, foes: ['poland', 'unr'], text: '키예프를 차지한 폴란드군을 몰아내야 한다.' },
                crimea: { pressure: 8, foes: ['wrangel'], text: '브란겔의 러시아군이 크림에서 나와 북타브리아로 진격한다.', who: ['표트르 브란겔', 'pyotr-wrangel'] },
            },
            cards: ['train', 'konarmia', 'requisition', 'relief', 'cheka', 'amnesty'],
            choice: {
                title: '커즌선을 넘을 것인가', who: ['미하일 투하쳅스키', 'tukhachevsky'],
                text: '7월, 폴란드군을 쫓던 붉은 군대가 영국 외무장관 커즌이 제안한 민족 경계선에 다다랐다.',
                talk: [
                    { who: ['미하일 투하쳅스키', 'tukhachevsky'], text: '서쪽으로! 백색 폴란드를 넘어 세계 혁명으로 가는 길이 열린다.' },
                    { who: ['블라디미르 레닌', 'lenin'], text: '바르샤바까지 가면 폴란드 노동자가 일어서고, 독일 혁명으로 가는 길이 열린다.' },
                    { who: ['카를 라데크', 'radek'], text: '총검으로 혁명을 들여갈 수는 없다. 폴란드 노동자에게 붉은 군대는 러시아 군대일 뿐이다. 커즌선에서 멈추고 강화하자.' },
                    { who: ['이오시프 스탈린', 'stalin'], text: '남서전선은 바르샤바가 아니라 리비우로 간다.' },
                ],
                options: [
                    { id: 'warsaw', label: '바르샤바로 진격한다', flag: 'warsaw', effect: '바르샤바 전투를 치른다. 이기면 바르샤바를 얻고 큰 보상, 지면 다음 시기 사단 −3' },
                    { id: 'curzon', label: '커즌선에서 멈추고 강화한다', flag: 'curzon', effect: '서부를 지키고, 남은 사단으로 크림을 친다(페레코프 전투에 증원 1개 사단)' },
                ],
                history: 'warsaw',
                after: '붉은 군대는 8월 바르샤바 앞까지 갔지만, 8월 16일 피우수트스키의 반격에 측면이 무너졌다. 폴란드 노동자는 일어서지 않았다. 남서전선은 리비우에 매달려 서부전선을 돕지 못했다. 10월 휴전과 1921년 리가 조약으로 벨라루스와 우크라이나 서부가 폴란드에 넘어갔다.',
                links: [['커즌선', T('curzon-line')], ['바르샤바 전투 (1920)', T('battle-of-warsaw-1920')], ['소비에트-폴란드 전쟁', E('soviet-polish-war')]],
            },
            after: '6월 12일 키예프를 되찾고 7월 11일 민스크에 들어갔지만, 8월 바르샤바 전투에서 졌다. 남쪽에서는 브란겔이 크림에서 나와 멜리토폴과 북타브리아를 차지했다.',
            links: [['미하일 투하쳅스키', P('tukhachevsky')], ['유제프 피우수트스키', P('jozef-pilsudski')]],
        },
        {
            id: 'perekop', date: '1920년 9–11월', end: [1920, 11], title: '페레코프',
            mobilize: 18, commissars: 3, army: [['conscripts', 14], ['latvian', 1], ['cavalry', 3]], phase: 6, battle: 'perekop',
            brief: [
                '10월 폴란드와 휴전하자 붉은 군대는 남쪽으로 돌아섰다. 프룬제의 남부전선이 10월 말 북타브리아의 브란겔군을 크림으로 몰아넣는다.',
                '크림으로 가는 길은 폭 8킬로미터의 페레코프 지협, 그 위를 가로막은 높이 10미터의 「터키 방벽」뿐이다. 동쪽은 얕은 석호 시바시다.',
            ],
            voices: [
                { who: ['레프 트로츠키', 'trotsky'], at: 'moscow', text: '다섯 개 군이 사방에서 집게를 조인다. 적은 이미 지협에서 끊겼다.', src: ['트로츠키, 「남부전선의 결정적인 날들」, 1920년 11월 2일', TR(819)] },
                { by: 'wrangel', who: ['표트르 브란겔', 'pyotr-wrangel'], at: 'crimea', text: '터키 방벽은 높이 10미터다. 크림에는 들어오지 못한다.' },
                { who: ['미하일 프룬제', 'frunze'], at: 'crimea', text: '더 버텨 봐야 쓸데없는 피만 흘릴 뿐이다. 저항을 멈추고 육군과 해군의 모든 병력과 함께 항복하라.', src: ['프룬제가 브란겔에게 보낸 무전, 1920년 11월 11일', 'https://aif.ru/society/history/molchanie-barona-pochemu-vrangel-vinovat-v-krasnom-terrore-v-krymu'] },
            ],
            threats: {
                crimea: { pressure: 12, foes: ['wrangel'], text: '브란겔군이 북타브리아에서 크림의 방어선으로 물러난다.', who: ['표트르 브란겔', 'pyotr-wrangel'] },
            },
            cards: ['train', 'mironov', 'requisition', 'relief', 'cheka'],
            choice: {
                title: '마흐노와 손을 잡을 것인가', who: ['네스토르 마흐노', 'nestor-makhno'],
                text: '브란겔이 우크라이나 남부로 올라오자 마흐노의 반란군이 다시 협정을 제안했다. 1919년 여름 붉은 군대는 마흐노를 무법자로 선포했었다.',
                talk: [
                    { who: ['네스토르 마흐노', 'nestor-makhno'], text: '브란겔은 우리 모두의 적이다. 함께 싸우자. 대신 감옥의 아나키스트를 풀어 주라.' },
                    { who: ['미하일 프룬제', 'frunze'], text: '마흐노의 기병이 함께 시바시를 건넌다면 크림은 더 빨리 떨어진다. 협정을 맺자.' },
                    { as: '마흐노를 믿지 않는 이들', text: '1919년에 등을 돌린 아나키스트다. 다시 믿었다가는 또 뒤통수를 맞는다.' },
                ],
                options: [
                    { id: 'makhno', label: '스타로빌스크 협정을 맺는다', flag: 'makhno', effect: '페레코프 전투에 마흐노 부대(기관총 수레 기병) 합류' },
                    { id: 'alone', label: '붉은 군대만으로 싸운다', cohesion: 3, effect: '당 결속 +3' },
                ],
                history: 'makhno',
                after: '10월 스타로빌스크에서 협정이 맺어졌고, 카레트니크의 마흐노 부대가 페레코프 작전에 참가해 시바시를 건넜다. 크림이 해방되자 붉은 군대는 11월 26일 마흐노 운동을 공격했고, 카레트니크는 체포되어 총살되었다.',
                links: [['스타로빌스크 협정', T('starobilsk-agreement')], ['세묜 카레트니크', P('semyon-karetnik')], ['네스토르 마흐노', P('nestor-makhno')]],
            },
            after: '11월 8일 밤 프룬제의 부대가 시바시를 건너 브란겔의 페레코프 방어선을 우회했고, 11일 유슌 방어선이 뚫렸다. 브란겔은 11월 13일부터 16일까지 126척의 배에 군인과 민간인 14만 5천 명을 태워 콘스탄티노폴리스로 떠났다.',
            links: [['페레코프-촌가르 작전', T('perekop-chongar-operation')], ['미하일 프룬제', P('frunze')], ['표트르 브란겔', P('pyotr-wrangel')]],
        },
    ];

    // Tactical battles, by id; a season's battle names one. A battle
    // fought on a front (front) takes its Red order of battle from the
    // season's plan there. final: the battle ends the war; otherwise it is
    // fought when the season is sent and its result joins the front's
    // strength before the settlement. cls is a terrain's look on the board;
    // legend lists the board's key.

    // The decisive battle: Perekop, the Sivash and Chongar, 7–12 November
    // 1920. Grid rows run north (Red mainland) to south (Crimea). Terrain:
    // . steppe, ~ Sivash shallows (fordable while the west wind holds),
    // # deep water, W the Turkish Wall, Y the Yushun lines, C the Chongar
    // positions, b the burnt Chongar bridge, t town.
    // Feats (rules 3): a unit's decisive moment, once a battle. kind
    // strike (plus damage, no counter), assault (on a fortification only,
    // its ground ignored, after `after` Red blows on fortifications),
    // muster (a new unit beside it), ride (move +mv this turn, past the
    // enemy). Units sharing a feat share its one use.
    // The battles' two sides (war/battle.js): the units' side ids.
    const SIDES = { player: 'red', enemy: 'white' };
    const THIRD_ASSAULT = {
        id: 'third-assault', name: '세 번째 돌격', kind: 'assault', after: 2, plus: 2,
        text: '진지 위의 적을 붉은 부대가 두 번 친 뒤에 쓸 수 있다. 이번 공격은 진지 방어를 무시하고 피해 +2.',
        history: '11월 8일 제51사단은 터키 방벽을 두 번 들이쳤다가 철조망과 기관총 앞에서 물러났다. 9일 새벽 세 번째 돌격에 방벽 위로 올라섰다.',
    };
    const perekop = {
        id: 'perekop', sides: SIDES, front: 'crimea', final: true,
        title: '페레코프-촌가르 작전', date: '1920년 11월 7–12일',
        settle: '페레코프로 →', open: '페레코프 전투 지휘하기 →', board: '페레코프 전장',
        ford: '시바시', reserveName: '바르보비치 기병군단',
        strikeNote: '백군의 예비대. 붉은 군대가 가장 깊이 들어온 구역(페레코프: 방벽 남쪽, 촌가르: 해협)으로 달려가 그 구역의 가장 약한 붉은 부대를 덮친다. 그 구역의 위협이 사라질 때까지 다른 구역으로 가지 않는다.',
        legend: [['steppe', '초원'], ['ford', '시바시 여울 (방어 −1, 이동 2)'], ['wall', '터키 방벽 (방어 +3, 이동 3)'], ['yushun', '유슌·촌가르 방어선 (방어 +2, 이동 2)'], ['strait', '촌가르 해협 (이동 2)'], ['town', '마을 (방어 +1)']],
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
        // The board's voices (war/ui/game.js renderBattleVoice): when says
        // the moment (start, goal emptied, turned:<line>, flood, reserve,
        // turn:N); unit, the speakers in order of preference; by / who /
        // face, the picture. src as for a season's voices; without it 각색.
        voices: [
            { when: 'start', unit: ['r15', 'r52'], face: 'red-soldier', text: '서풍이 시바시의 물을 밀어냈다. 오늘 밤 석호 바닥을 걸어서 건넌다.' },
            { when: 'start', unit: ['w1', 'w2'], by: 'wrangel', text: '터키 방벽은 높이 10미터다. 볼셰비키는 여기서 멈춘다.' },
            { when: 'start', unit: ['r51a', 'r51g'], who: ['바실리 블류헤르', 'vasily-blyukher'], text: '방벽을 정면으로 칠 거면 포병이 먼저 깎아야 한다.' },
            { when: 'start', unit: 'rmk', who: ['세묜 카레트니크', 'semyon-karetnik'], text: '기관총 수레가 간다. 리톱스키 반도는 우리에게 맡겨라.' },
            { when: 'reserve', unit: 'w4', who: ['이반 바르보비치', 'ivan-barbovich'], by: 'wrangel', text: '기병군단, 뚫린 곳으로! 놈들을 석호에 쓸어 넣어라.' },
            { when: 'flood', unit: ['r15', 'r52', 'rmk'], face: 'red-soldier', text: '바람이 바뀌었다! 물이 차오른다, 어서 건너라!' },
            { when: 'turned:wall', unit: ['w1', 'w2', 'w2b', 'w5'], by: 'wrangel', text: '뒤로 돌아 들어왔다! 방벽을 버리고 유슌으로 물러나라!' },
            { when: 'turned:chongar', unit: ['wc1', 'wc2', 'wcg'], by: 'wrangel', text: '촌가르가 뚫렸다. 잔코이로 가는 길이 열린다!' },
            { when: 'turn:10', unit: ['r1c', 'r15', 'r51a', 'r30'], face: 'red-soldier', text: '겨울이 오기 전에 크림에 들어간다. 서둘러라!' },
            { when: 'feat:third-assault', unit: ['r51a', 'r51b'], who: ['바실리 블류헤르', 'vasily-blyukher'], text: '세 번째다. 이번에는 방벽을 넘는다! 앞으로!' },
            { when: 'surrender', unit: ['r15', 'r52', 'r51a', 'r30', 'r1c'], face: 'red-soldier', text: '총을 내려놓았다! 쏘지 마라, 이제 우리 편이다.' },
        ],
        goals: [{ at: [9, 3], name: '유슌 역' }, { at: [10, 10], name: '잔코이' }],
        // The Salkovo–Dzhankoy railway over the Chongar strait: the train's road.
        rails: [[0, 10], [1, 10], [2, 10], [3, 10], [3, 11], [4, 11], [5, 11], [6, 11], [7, 11], [8, 11], [9, 11], [10, 11], [10, 10]],
        towns: [['아르먄스크', 5, 1]],
        places: [['터키 방벽', 3, 0.1], ['시바시', 3, 6], ['리톱스키 반도', 6, 5], ['유슌 방어선', 8, 0.1], ['북타브리아', 0, 4], ['촌가르 반도', 2, 9.6], ['촌가르 해협', 6, 9.2], ['크림', 11, 6]],
        windTurns: 4,
        turnLimit: 12,
        // A Red unit on dry ground in a line's rear (the outlined area on
        // the board) turns it; its garrison makes for the fallback tile.
        lines: {
            wall: { name: '터키 방벽', rear: { rows: [4, 7], cols: [1, 8] }, label: [7, 4.1], fallback: [7, 2] },
            chongar: { name: '촌가르 방어선', rear: { rows: [8, 11], cols: [9, 12] }, label: [11, 9.1], fallback: [9, 11] },
        },
        // The White reserve answers Red units past a sector's alarm row
        // (coming south, rows growing).
        sectors: {
            perekop: { name: '페레코프', cols: [0, 8], alarm: { axis: 'r', at: 4, dir: 1 } },
            chongar: { name: '촌가르', cols: [9, 12], alarm: { axis: 'r', at: 6, dir: 1 } },
        },
        terrain: {
            '.': { name: '초원', cost: 1, def: 0, cls: 'steppe' },
            '~': { name: '시바시 여울', cost: 2, def: -1, ford: true, cls: 'ford' },
            '#': { name: '깊은 물', cost: 99, def: 0, cls: 'deep' },
            W: { name: '터키 방벽', cost: 3, def: 3, fort: 'wall', cls: 'wall' },
            Y: { name: '유슌 방어선', cost: 2, def: 2, fort: 'yushun', cls: 'yushun' },
            C: { name: '촌가르 방어선', cost: 2, def: 2, fort: 'chongar', cls: 'chongar' },
            b: { name: '촌가르 해협', cost: 2, def: 0, cls: 'strait' },
            t: { name: '마을', cost: 1, def: 1, cls: 'town' },
        },
        units: [
            { id: 'r51a', tag: '51', side: 'red', name: '제51사단', sub: '블류헤르', kind: 'inf', at: [0, 1], hp: 10, atk: 5, def: 3, mv: 3, person: ['바실리 블류헤르', 'vasily-blyukher'], feat: THIRD_ASSAULT },
            { id: 'r51b', tag: '51돌격', side: 'red', name: '제51사단 돌격여단', sub: '블류헤르', kind: 'inf', at: [0, 3], hp: 10, atk: 5, def: 3, mv: 3, need: 5, feat: THIRD_ASSAULT },
            { id: 'r51g', tag: '51포병', side: 'red', name: '제51사단 포병', kind: 'art', at: [1, 2], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'r6g', tag: '중포', side: 'red', name: '제6군 중포병', kind: 'art', at: [1, 1], hp: 7, atk: 5, def: 1, mv: 2, range: 2, need: 3 },
            { id: 'rcz', tag: '증원', side: 'red', name: '증원 사단', sub: '서부에서 온', kind: 'inf', at: [0, 2], hp: 10, atk: 4, def: 3, mv: 3, flag: 'curzon' },
            { id: 'rwz', tag: '서부', side: 'red', name: '서부전선 사단', sub: '바르샤바에서 온', kind: 'inf', at: [0, 4], hp: 10, atk: 5, def: 3, mv: 3, flag: 'warsawTaken' },
            { id: 'r15', tag: '15', side: 'red', name: '제15사단', sub: '시바시 도하', kind: 'inf', at: [1, 5], hp: 10, atk: 4, def: 3, mv: 3, lead: true },
            { id: 'rmk', tag: '마흐노', look: 'tachanka', side: 'red', name: '마흐노 부대', sub: '카레트니크', kind: 'cav', at: [1, 6], hp: 8, atk: 5, def: 2, mv: 5, flag: 'makhno', person: ['세묜 카레트니크', 'semyon-karetnik'], skirmish: true },
            { id: 'r52', tag: '52', side: 'red', name: '제52사단', sub: '시바시 도하', kind: 'inf', at: [1, 7], hp: 10, atk: 4, def: 3, mv: 3 },
            { id: 'r1c', tag: '1기병', side: 'red', name: '제1기병군', sub: '부됸니', kind: 'cav', at: [0, 8], hp: 12, atk: 6, def: 2, mv: 5, need: 0, person: ['세묜 부됸니', 'semyon-budyonny'] },
            { id: 'r2c', tag: '2기병', look: 'cossack', side: 'red', name: '제2기병군', sub: '미로노프', kind: 'cav', at: [0, 9], hp: 10, atk: 5, def: 2, mv: 5, card: 'mironov', person: ['필리프 미로노프', 'filipp-mironov'] },
            { id: 'r30', tag: '30', side: 'red', name: '제30사단', sub: '제4군', kind: 'inf', at: [1, 11], hp: 10, atk: 4, def: 3, mv: 3 },
            { id: 'r30b', tag: '30여단', side: 'red', name: '제30사단 여단', sub: '제4군', kind: 'inf', at: [1, 12], hp: 10, atk: 4, def: 3, mv: 3, need: 3 },
            { id: 'rtr', tag: '열차', side: 'red', name: '장갑열차', sub: '트로츠키의 열차', kind: 'art', rail: true, at: [0, 10], hp: 6, atk: 4, def: 2, mv: 2, railMv: 6, range: 2, card: 'train' },
            { id: 'r4g', tag: '4군포', side: 'red', name: '제4군 포병', kind: 'art', at: [0, 11], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'w1', tag: '드로즈', look: 'officer', side: 'white', name: '드로즈돕스키 사단', sub: '방벽 수비', kind: 'inf', at: [3, 1], hp: 10, atk: 4, def: 3, mv: 3, role: 'wall', line: 'wall' },
            { id: 'w2', tag: '드로즈', look: 'officer', side: 'white', name: '드로즈돕스키 사단', sub: '방벽 수비', kind: 'inf', at: [3, 2], hp: 10, atk: 4, def: 3, mv: 3, role: 'wall', line: 'wall' },
            { id: 'w2b', tag: '수비대', side: 'white', name: '방벽 수비대', kind: 'inf', at: [3, 3], hp: 8, atk: 3, def: 3, mv: 3, role: 'wall', line: 'wall' },
            { id: 'wg', tag: '포대', side: 'white', name: '방벽 포대', kind: 'art', at: [4, 2], hp: 6, atk: 4, def: 1, mv: 2, range: 2, role: 'wall', line: 'wall' },
            { id: 'w3', tag: '쿠반', look: 'cossack', side: 'white', name: '쿠반 여단', sub: '리톱스키 반도', kind: 'inf', at: [5, 7], hp: 8, atk: 3, def: 2, mv: 3, role: 'hold' },
            { id: 'w4', tag: '바르보', side: 'white', name: '바르보비치 기병군단', sub: '예비', kind: 'cav', at: [9, 6], hp: 10, atk: 6, def: 2, mv: 5, role: 'strike', person: ['이반 바르보비치', 'ivan-barbovich'] },
            { id: 'w5', tag: '코르닐', look: 'officer', side: 'white', name: '코르닐로프 사단', sub: '유슌 방어선', kind: 'inf', at: [8, 2], hp: 10, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'w6', tag: '마르코', look: 'officer', side: 'white', name: '마르코프 사단', sub: '유슌 방어선', kind: 'inf', at: [8, 5], hp: 9, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'wc1', tag: '촌가르', side: 'white', name: '촌가르 수비대', sub: '다리 어귀', kind: 'inf', at: [7, 11], hp: 8, atk: 4, def: 3, mv: 3, role: 'wall', line: 'chongar' },
            { id: 'wc2', tag: '촌가르', side: 'white', name: '촌가르 수비대', sub: '동쪽 진지', kind: 'inf', at: [7, 12], hp: 8, atk: 3, def: 3, mv: 3, role: 'wall', line: 'chongar' },
            { id: 'wcg', tag: '포대', side: 'white', name: '촌가르 포대', kind: 'art', at: [8, 11], hp: 6, atk: 4, def: 1, mv: 2, range: 2, role: 'wall', line: 'chongar' },
        ],
        summary: '유슌 역이나 잔코이에 서면 승리 · 12턴 · 시바시 여울은 4턴 뒤 물에 잠긴다',
        brief: [
            '크림으로 들어가는 길은 셋이다. 서쪽 페레코프 지협의 터키 방벽(방어 +3), 그 동쪽 시바시의 얕은 여울, 동쪽 끝의 촌가르 해협이다. 유슌 역이나 잔코이에 붉은 군대 부대를 세우면 크림으로 가는 길이 열린다. 12턴이 주어진다.',
            '포병은 진지(방벽·유슌·촌가르) 위의 적을 칠 때마다 그 진지의 방어를 1씩 깎는다. 포격을 거듭하면 정면으로도 방벽을 넘을 수 있지만 시간이 든다. 첫 칸은 비용이 이동력보다 커도 들어갈 수 있어서, 포병도 한 턴에 방벽 한 칸씩 넘는다.',
            '시바시 여울은 이동 비용 2, 방어 −1이다. 4턴이 지나면 바람이 바뀌어 물이 다시 차오른다. 그 뒤로는 여울에 들어갈 수 없고, 여울에 남은 부대는 턴마다 피해를 입는다.',
            '방어선 뒤의 점선 지역에 붉은 부대가 서면 그 방어선은 우회된다. 수비대의 진지 방어는 +1로 줄고, 수비대는 물러날 길을 찾는다.',
            '백군 예비대인 바르보비치 기병군단은 하나뿐이다. 붉은 군대가 가장 깊이 들어온 구역으로 달려가고, 그 구역의 위협이 사라질 때까지 다른 곳으로 가지 않는다. 한쪽에서 먼저 압박해 예비대를 끌어낸 뒤 다른 쪽을 칠 수 있다.',
            '적과 맞닿은 칸에 들어가면 그 턴의 이동은 끝난다. 한 적을 여럿이 둘러싸고 치면 둘러싼 부대마다 피해가 1씩 늘어난다.',
            '결정적 한 수(★): 제51사단의 「세 번째 돌격」은 진지 위의 적을 두 번 친 뒤 한 번, 진지 방어를 무시하고 친다. 마흐노 부대의 기관총 수레(타찬카)는 치고 나서도 움직일 수 있다(아직 움직이지 않았으면).',
            '이미 병력이 절반 아래로 꺾인 백군 부대를 붉은 부대 셋이 둘러싼 채 치면, 그 부대는 총을 내려놓고 붉은 군대로 넘어온다(투항). 포로는 다음 시기 사단이 된다.',
        ],
        history: '11월 8일 새벽 제51사단의 방벽 정면 공격은 철조망과 기관총 앞에서 막혔다. 같은 날 밤 제15·52사단과 마흐노 부대가 현지 주민의 안내로 시바시를 건너 리톱스키 반도에 올랐고, 바르보비치 기병의 반격을 버텼다. 퇴로를 위협받은 백군은 9일 새벽 방벽을 버렸다. 11일 유슌 방어선이 뚫렸고, 같은 날 밤 제4군의 제30사단이 촌가르 진지를 돌파했다. 붉은 기병이 그 뒤를 따라 크림으로 들어갔다.',
    };

    // The war's afterword: the first text whose condition holds.
    const epilogue = {
        title: '그리고 1921년',
        texts: [
            { when: { flag: 'warsawTaken' }, text: '바르샤바를 차지한 붉은 군대 앞에서 폴란드는 강화를 청했다. 그러나 폴란드 노동자가 혁명에 나설지, 독일로 가는 길이 정말 열릴지는 총검이 정할 수 없는 일이었다. 실제 역사에서는 8월 16일 비스와강의 반격으로 서부전선이 무너졌고, 1921년 리가 조약으로 벨라루스와 우크라이나 서부가 폴란드에 넘어갔다.' },
            { when: { stat: ['peasants', '>=', 40] }, text: '징발의 부담을 덜어 둔 덕에 농촌의 원한은 역사보다 얕다. 실제 역사에서는 1921년 탐보프의 안토노프 봉기와 크론시타트 반란이 일어난 뒤에야 징발이 현물세로 바뀌었다.' },
            { text: '1921년 봄, 내전에서 이긴 소비에트 정권 앞에 새 전선이 열렸다. 탐보프의 안토노프 봉기와 시베리아·우크라이나의 농민 반란, 그리고 3월 크론시타트 수병의 봉기. 제10차 당대회는 징발을 현물세로 바꾸는 신경제정책을 채택했다.' },
        ],
        links: [['크론시타트 반란', E('kronstadt-1921')], ['안토노프 봉기', T('antonovshchina')], ['신경제정책', T('nep')]],
    };

    // Kazan, late August to 10 September 1918: Trotsky's train at
    // Sviyazhsk, the Volga flotilla on the river, the Whites holding the
    // city and Kappel's raiders loose on the right bank. Rows run north
    // (Kazan) to south (Sviyazhsk's bank). Terrain: . field, f wood,
    // ~ the Volga, B the Sviyazhsk railway bridge, S Sviyazhsk, K the city,
    // k the kremlin, P the wharves.
    const kazan = {
        id: 'kazan', sides: SIDES, front: 'east', final: false,
        title: '카잔 탈환', date: '1918년 8월 말–9월 10일',
        settle: '카잔으로 →', board: '카잔 전장',
        strikeNote: '',
        raidNote: '카펠의 기동대. 볼가 오른쪽 둑을 따라 스비야시스크로 달려간다. 붉은 부대 곁에서 멈추지 않고 지나치며, 더 다가갈 수 없을 때만 막아선 부대를 친다. 스비야시스크에 백군이 들어서면 진다.',
        legend: [['steppe', '들판'], ['forest', '숲 (방어 +1, 이동 2)'], ['river', '볼가강 (소함대만)'], ['bridge', '스비야시스크 철교'], ['town', '스비야시스크 (방어 +1)'], ['city', '카잔 시가 (방어 +1)'], ['kremlin', '카잔 크렘린 (방어 +2, 이동 2)'], ['docks', '부두']],
        // The season's eastern strength takes the battle's result: as
        // history went when Kazan is taken, a city further when it falls
        // within quick turns, two cities fewer when it is not.
        reward: { quick: 5, quickBy: 3, lostBy: -6 },
        map: [
            'ff..........',
            'f.....KKK...',
            '......KkK...',
            '......PPP...',
            '~~B~~~~~~~~~',
            '.S..........',
            '.....ff.....',
            '............',
        ],
        voices: [
            { when: 'start', unit: ['ktr', 'k5l'], who: ['레프 트로츠키', 'trotsky'], text: '이제 너희 차례다, 제5군 병사들이여! 제2군과 함께 카잔의 반혁명의 숨통을 끊어라.', src: ['트로츠키의 명령 「카잔은 반드시 되찾아야 한다!」, 1918년 8월 24일', TR(710)] },
            { when: 'start', unit: 'kfl', who: ['표도르 라스콜니코프', 'fyodor-raskolnikov'], text: '소함대는 부두 밑으로 들어간다. 포대부터 잠재운다.' },
            { when: 'start', unit: 'wkp', who: ['블라디미르 카펠', 'vladimir-kappel'], by: 'komuch', text: '스비야시스크만 차지하면 트로츠키의 열차도 끝이다.' },
            { when: 'start', unit: 'wk2', by: 'czech', text: '철교 북쪽은 군단이 지킨다. 건너오는 놈은 다리 위에서 쓰러진다.' },
            { when: 'goal', unit: ['k5l', 'k2a', 'k5c', 'ksl'], face: 'red-soldier', text: '크렘린이 비었다! 들어가라!' },
            { when: 'turn:6', unit: ['wk1', 'wk3', 'wk2'], by: 'komuch', text: '버텨라, 사마라에서 원군이 온다!' },
            { when: 'feat:night-raid', unit: 'kfl', who: ['표도르 라스콜니코프', 'fyodor-raskolnikov'], text: '불을 끄고 부두로 들어간다. 포대와 바지선부터 태워라!' },
            { when: 'feat:all-arms', unit: ['ktc', 'ktr'], who: ['레프 트로츠키', 'trotsky'], text: '서기도 취사병도 총을 들어라! 스비야시스크는 내주지 않는다.' },
            { when: 'surrender', unit: ['k5l', 'k5c', 'ksl', 'k2a'], face: 'red-soldier', text: '인민군 병사들이 손을 든다! 쏘지 마라, 이제 우리 편이다.' },
        ],
        goals: [{ at: [2, 7], name: '크렘린' }],
        // The Moscow–Kazan line: Sviyazhsk, its bridge over the Volga, Kazan.
        rails: [[5, 0], [5, 1], [5, 2], [4, 2], [3, 2], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]],
        protect: { at: [5, 1], name: '스비야시스크' },
        towns: [['스비야시스크', 5, 1]],
        places: [['카잔', 0, 6.2], ['볼가강', 4, 4], ['철교', 4, 2.05], ['부두', 3, 9], ['아르스크 길', 0, 9.6], ['오른쪽 둑', 7, 6]],
        turnLimit: 8,
        lines: {},
        sectors: {},
        terrain: {
            '.': { name: '들판', cost: 1, def: 0, cls: 'steppe' },
            f: { name: '숲', cost: 2, def: 1, cls: 'forest' },
            '~': { name: '볼가강', cost: 99, def: 0, water: true, cls: 'river' },
            B: { name: '스비야시스크 철교', cost: 1, def: 0, span: true, cls: 'bridge' },
            S: { name: '스비야시스크', cost: 1, def: 1, cls: 'town' },
            K: { name: '카잔 시가', cost: 1, def: 1, cls: 'city' },
            k: { name: '카잔 크렘린', cost: 2, def: 2, fort: 'kremlin', cls: 'kremlin' },
            P: { name: '부두', cost: 1, def: 0, cls: 'docks' },
        },
        units: [
            { id: 'k5l', tag: '라트비아', side: 'red', name: '라트비아 소총연대', sub: '제5군', kind: 'inf', at: [5, 3], hp: 10, atk: 5, def: 3, mv: 3, lead: true },
            { id: 'k5c', tag: '5군', side: 'red', name: '제5군 소총연대', sub: '징집병', kind: 'inf', at: [6, 2], hp: 10, atk: 4, def: 3, mv: 3 },
            { id: 'k5g', tag: '5군포', side: 'red', name: '제5군 포병', kind: 'art', at: [6, 1], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'kfl', tag: '소함대', side: 'red', name: '볼가 소함대', sub: '라스콜니코프', kind: 'art', naval: true, at: [4, 3], hp: 8, atk: 4, def: 2, mv: 4, range: 2, person: ['표도르 라스콜니코프', 'fyodor-raskolnikov'],
                feat: { id: 'night-raid', name: '야간 기습', kind: 'strike', plus: 3, text: '불을 끈 배들이 어둠을 타고 부두 밑까지 들어가 쏜다. 이번 공격 피해 +3, 반격 없음.', history: '8월 30일 밤 라스콜니코프의 수뢰정과 무장 기선이 트로츠키를 태우고 카잔 부두로 들어가 백군 포대와 함정·바지선을 불태우고 빠져나왔다.' } },
            { id: 'ksl', tag: '수병', look: 'sailor', side: 'red', name: '발트함대 수병 분견대', sub: '모스크바에서 온', kind: 'inf', at: [7, 3], hp: 9, atk: 5, def: 2, mv: 3, need: 0 },
            { id: 'k2a', tag: '2군', side: 'red', name: '제2군 소총사단', sub: '아진', kind: 'inf', at: [1, 11], hp: 10, atk: 5, def: 3, mv: 3, need: 3, person: ['블라디미르 아진', 'vladimir-azin'] },
            { id: 'kcp', tag: '당원', look: 'worker', side: 'red', name: '공산당원·사관생도 분견대', sub: '모스크바에서 온', kind: 'inf', at: [7, 1], hp: 8, atk: 4, def: 3, mv: 3, need: 6 },
            { id: 'ktr', tag: '열차', side: 'red', name: '장갑열차', sub: '트로츠키의 열차', kind: 'art', rail: true, at: [5, 1], hp: 6, atk: 4, def: 2, mv: 2, railMv: 6, range: 2, card: 'train', person: ['레프 트로츠키', 'trotsky'],
                feat: {
                    id: 'all-arms', name: '모두 총을 들어라', kind: 'muster',
                    unit: { id: 'ktc', tag: '승무원', name: '열차 승무원 분견대', sub: '트로츠키의 열차', kind: 'inf', hp: 6, atk: 4, def: 3, mv: 3 },
                    text: '열차의 승무원과 서기, 전신수, 취사병까지 총을 들고 내린다. 열차 곁에 분견대 하나가 생긴다(이번 턴은 행동하지 않음).',
                    history: '8월 28일 카펠과 사빈코프의 기습대가 스비야시스크 바로 앞 튜를레마 역까지 들어왔다. 트로츠키는 열차의 승무원과 참모, 사령부의 모든 사람을 무장시켜 내보냈고, 기습대는 물러났다.',
                } },
            { id: 'wk1', tag: '인민군', side: 'white', name: '코무치 인민군', sub: '크렘린 수비', kind: 'inf', at: [2, 7], hp: 8, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'wk2', tag: '체코', side: 'white', name: '체코슬로바키아 군단', sub: '철교 북쪽', kind: 'inf', at: [3, 2], hp: 10, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'wk3', tag: '인민군', side: 'white', name: '코무치 인민군', sub: '시가 동쪽', kind: 'inf', at: [2, 8], hp: 6, atk: 3, def: 2, mv: 3, role: 'hold' },
            { id: 'wk4', tag: '포대', side: 'white', name: '부두 포대', kind: 'art', at: [3, 7], hp: 6, atk: 4, def: 1, mv: 2, range: 2, role: 'hold' },
            { id: 'wkp', tag: '카펠', side: 'white', name: '카펠 부대', sub: '기동대', kind: 'cav', at: [7, 10], hp: 10, atk: 6, def: 2, mv: 4, role: 'raid', person: ['블라디미르 카펠', 'vladimir-kappel'] },
        ],
        summary: '크렘린에 서면 승리 · 8턴 · 스비야시스크를 비우지 말 것',
        brief: [
            '8월 7일 카펠의 부대가 카잔과 금 보유고를 빼앗았다. 트로츠키는 장갑열차로 카잔 서쪽 스비야시스크에 사령부를 차렸다. 볼가를 건너는 철교가 이곳에 있다.',
            '크렘린에 붉은 군대 부대를 세우면 카잔을 되찾는다. 8턴이 주어진다. 5턴 안에 되찾으면 동부전선이 한 도시 더 나아가고, 되찾지 못하면 이 시기 동부전선의 전투력이 6 준다.',
            '라스콜니코프의 볼가 소함대는 강 위로만 다니며 사거리 2로 부두와 강가를 친다. 크렘린의 방어도 소함대와 포병의 포격으로 깎인다.',
            '카펠의 기동대가 오른쪽 둑을 따라 스비야시스크로 온다. 기동대는 붉은 부대 곁을 멈추지 않고 지나친다. 스비야시스크에 백군이 들어서면 지므로, 그 칸에 부대 하나를 남겨 두어야 한다.',
            '적과 맞닿은 칸에 들어가면 그 턴의 이동은 끝난다. 한 적을 여럿이 둘러싸고 치면 둘러싼 부대마다 피해가 1씩 늘어난다.',
            '결정적 한 수(★): 전투마다 한 번씩 쓴다. 소함대의 「야간 기습」은 피해 +3에 반격이 없다. 장갑열차의 「모두 총을 들어라」는 열차 곁에 승무원 분견대를 세운다.',
            '이미 병력이 절반 아래로 꺾인 백군 부대를 붉은 부대 셋이 둘러싼 채 치면, 그 부대는 총을 내려놓고 붉은 군대로 넘어온다(투항). 포로는 다음 시기 사단이 된다.',
        ],
        history: '8월 말 카펠의 기습이 스비야시스크 코앞까지 닿았지만 사령부는 버텼다. 트로츠키는 모스크바에서 공산당원과 사관생도, 발트함대 수병을 끌어와 부대를 채웠고, 라스콜니코프의 볼가 소함대가 카잔의 백군 함정을 쳤다. 9월 10일 제5군과 볼가 소함대가 카잔을 되찾았다.',
    };

    // Tsaritsyn, 15–25 October 1918 (rules 7): the Don Army's second
    // offensive at the city's ring railway. Mamontov's cavalry rides for the
    // station from the north, the Don infantry comes on from Voroponovo in
    // the west once it has gathered, and the south (Beketovka, Sarepta,
    // Tundutovo) is lost; Zhloba's Steel Division arrives in the Whites'
    // rear from the North Caucasus. A board to be held: keeping the station
    // through the last turn is history, retaking Sarepta wins sooner. Rows
    // run north (Kotluban) to south (Tundutovo), the Volga on the east.
    // Terrain: . steppe, b a balka (gully), T the defence belt, G the gun
    // works, C the city, t a station village, ~ the Volga.
    const tsaritsyn = {
        id: 'tsaritsyn', sides: SIDES, front: 'volga', final: false, outlast: true,
        title: '차리친 방어', date: '1918년 10월 15–25일',
        settle: '차리친으로 →', board: '차리친 전장', enemyName: '돈군',
        strikeNote: '',
        raidNote: '마몬토프의 돈 카자크 기병. 북쪽에서 차리친역으로 달려간다. 붉은 부대 곁에서 멈추지 않고 지나치며, 더 다가갈 수 없을 때만 막아선 부대를 친다. 차리친역에 백군이 들어서면 진다.',
        pushNote: '돈군 보병과 넘어간 농민 연대. 2턴이 끝날 때까지 제자리에서 모이고, 그 뒤 차리친역으로 곧장 온다. 붉은 부대 곁에서는 멈춰 싸운다. 차리친역에 백군이 들어서면 진다.',
        legend: [['steppe', '초원'], ['ravine', '골짜기(발카) (방어 +1, 이동 2)'], ['trench', '방어 띠 (방어 +2, 이동 2, 포격으로 깎임)'], ['works', '대포 공장 (방어 +1)'], ['city', '차리친 시가 (방어 +1)'], ['town', '역 마을 (방어 +1)'], ['river', '볼가강 (소함대만)']],
        reward: { quick: 5, quickBy: 3, lostBy: -6 },
        map: [
            '....b.....~~',
            '..b......G~~',
            '.......T.C~~',
            '...b...T.C~~',
            '....b..TCC~~',
            '.....t.T..~~',
            '..b.....t.~~',
            '....b.....~~',
            '...b.....t~~',
            '.......t..~~',
        ],
        voices: [
            { when: 'start', unit: ['tvr', 'tkh'], who: ['이오시프 스탈린', 'stalin'], text: '붉은 깃발을 높이 들고 두려움 없이 앞으로 나아가라. 사회주의 러시아는 무너지지 않는다는 것을 온 세계에 보여 주라.', src: ['레닌·스탈린이 차리친 전선 사령관 보로실로프에게 보낸 전보, 1918년 9월 19일', ST('telegram_voroshilov')] },
            { when: 'start', unit: 'wd1', who: ['표트르 크라스노프', 'pyotr-krasnov'], by: 'don', text: '보로포노보에 모여 단숨에 친다. 역을 차지하면 볼가는 우리 것이다.' },
            { when: 'start', unit: 'wmm', who: ['콘스탄틴 마몬토프', 'konstantin-mamontov'], by: 'don', text: '북쪽 철길을 따라 역으로 달린다. 놈들의 장갑열차가 서기 전에.' },
            { when: 'start', unit: 'tzh', who: ['드미트리 즐로바', 'dmitry-zhloba'], text: '네빈노미스스카야에서 800킬로미터를 걸어왔다. 크라스노프의 등 뒤를 친다!' },
            { when: 'turn:3', unit: ['wd1', 'wd2'], by: 'don', text: '방어 띠만 넘으면 도시다! 앞으로!' },
            { when: 'goal', unit: ['tzh', 'tdm', 'tlr', 'tkp'], face: 'red-soldier', text: '사렙타가 비었다! 들어가라!' },
            { when: 'feat:massed-guns', unit: 'tku', who: ['그리고리 쿨리크', 'grigory-kulik'], text: '모든 포를 한곳에! 사도바야 앞을 쓸어버려라!' },
            { when: 'feat:long-march', unit: 'tzh', who: ['드미트리 즐로바', 'dmitry-zhloba'], text: '멈추지 마라! 툰두토보에서 사렙타까지 놈들의 뒤를 훑는다!' },
            { when: 'feat:landing', unit: ['tlr', 'tfl'], face: 'red-soldier', text: '베케톱카 앞에 상륙한다! 함포가 받쳐 준다!' },
            { when: 'feat:luhansk', unit: ['tlw', 'tvr'], who: ['클리멘트 보로실로프', 'voroshilov'], text: '루간스크 동무들, 총을 들어라! 여기서 더 물러설 곳은 없다.' },
            { when: 'surrender', unit: ['tzh', 'tvr', 'tkh', 'tkp'], face: 'red-soldier', text: '카자크들이 손을 든다! 쏘지 마라, 이제 우리 편이다.' },
        ],
        goals: [{ at: [8, 9], name: '사렙타' }],
        // The line north to Kotluban and Povorino, the line west to
        // Voroponovo and Kalach, the line south to Sarepta and Tikhoretskaya,
        // and the ring between Sadovaya and Beketovka.
        rails: [[0, 7], [1, 7], [1, 8], [2, 8], [3, 8], [4, 8], [4, 9],
            [4, 7], [4, 6], [5, 6], [5, 5], [5, 4], [5, 3], [5, 2], [5, 1], [5, 0],
            [5, 9], [6, 9], [7, 9], [8, 9], [9, 8], [9, 7],
            [5, 7], [6, 7], [6, 8]],
        protect: { at: [4, 9], name: '차리친역' },
        towns: [['보로포노보', 5, 5], ['베케톱카', 6, 8], ['툰두토보', 9, 7]],
        places: [['코틀루반 방면', 0, 5.6], ['대포 공장', 0.6, 9], ['사도바야', 3.4, 7], ['칼라치 방면', 6, 0.2], ['볼가강', 7, 10.5], ['티호레츠카야 방면', 9, 4.4]],
        turnLimit: 8,
        lines: {},
        sectors: {},
        terrain: {
            '.': { name: '초원', cost: 1, def: 0, cls: 'steppe' },
            b: { name: '골짜기(발카)', cost: 2, def: 1, cls: 'ravine' },
            T: { name: '방어 띠', cost: 2, def: 2, fort: 'belt', cls: 'trench' },
            G: { name: '대포 공장', cost: 1, def: 1, cls: 'works' },
            C: { name: '차리친 시가', cost: 1, def: 1, cls: 'city' },
            t: { name: '역 마을', cost: 1, def: 1, cls: 'town' },
            '~': { name: '볼가강', cost: 99, def: 0, water: true, cls: 'river' },
        },
        units: [
            { id: 'tvr', tag: '10군', side: 'red', name: '제10군 소총사단', sub: '보로실로프', kind: 'inf', at: [3, 8], hp: 10, atk: 4, def: 3, mv: 3, lead: true, person: ['클리멘트 보로실로프', 'voroshilov'],
                feat: {
                    id: 'luhansk', name: '루간스크의 노동자들', kind: 'muster',
                    unit: { id: 'tlw', tag: '루간스크', name: '루간스크 노동자 분견대', sub: '보로실로프와 온', kind: 'inf', hp: 6, atk: 4, def: 3, mv: 3 },
                    text: '돈바스에서 함께 물러나 온 노동자들이 총을 든다. 10군 곁에 노동자 분견대 하나가 생긴다(이번 턴은 행동하지 않음).',
                    history: '1918년 3월 보로실로프는 루간스크에서 노동자 분견대를 꾸렸다. 독일군이 돈바스로 밀려오자 그 분견대들이 모여 제5우크라이나군이 되었고, 노동자의 가족을 실은 열차와 함께 싸우며 차리친까지 물러났다. 6월 23일 이 부대들이 보로실로프 아래 하나로 묶였다.',
                } },
            { id: 'tkh', tag: '하르첸코', look: 'worker', side: 'red', name: '하르첸코 공산주의 연대', sub: '차리친역 수비', kind: 'inf', at: [4, 9], hp: 9, atk: 4, def: 3, mv: 3 },
            { id: 'tkp', tag: '콜파코프', side: 'red', name: '콜파코프 연대', sub: '방어 띠', kind: 'inf', at: [5, 7], hp: 9, atk: 4, def: 3, mv: 3 },
            { id: 'tku', tag: '쿨리크', side: 'red', name: '포병 집단', sub: '쿨리크', kind: 'art', at: [4, 7], hp: 8, atk: 5, def: 1, mv: 2, range: 2, person: ['그리고리 쿨리크', 'grigory-kulik'],
                feat: { id: 'massed-guns', name: '포 일제 사격', kind: 'strike', plus: 4, text: '방어 띠에 모은 포가 한 목표에 한꺼번에 쏟아진다. 이번 공격 피해 +4, 반격 없음.', history: '10월 17일 돈군의 결정적 공격은 사도바야–보로포노보 앞에 모은 포병에 꺾였다. 포의 수는 기록마다 100문 남짓에서 200문 넘게까지 다르다.' } },
            { id: 'tar', tag: '열차', side: 'red', name: '장갑열차 종대', sub: '알랴비예프', kind: 'art', rail: true, at: [5, 6], hp: 7, atk: 4, def: 2, mv: 2, railMv: 6, range: 2 },
            { id: 'tzh', tag: '강철', side: 'red', name: '「강철 사단」', sub: '즐로바 · 북캅카스에서', kind: 'inf', at: [9, 2], hp: 12, atk: 6, def: 3, mv: 3, person: ['드미트리 즐로바', 'dmitry-zhloba'],
                feat: { id: 'long-march', name: '등 뒤로', kind: 'ride', mv: 3, text: '이번 턴 이동 +3, 적 곁에서 멈추지 않고 지나간다. 움직이기 전에 쓴다. 다 달린 뒤 칠 수 있다.', history: '소로킨과 다툰 즐로바는 네빈노미스스카야에서 800킬로미터를 행군해 10월 15일 툰두토보와 사렙타 사이에서 돈군의 뒤를 쳤다. 45분 싸움에 아스트라한 지대가 무너지고 지휘관 데먀노프 장군이 죽었다.' } },
            { id: 'tfl', tag: '소함대', side: 'red', name: '볼가 소함대', sub: '아스트라한에서 올라온', kind: 'art', naval: true, at: [5, 10], hp: 7, atk: 4, def: 2, mv: 4, range: 2, need: 0,
                feat: {
                    id: 'landing', name: '상륙', kind: 'muster',
                    unit: { id: 'tlr', tag: '상륙', name: '상륙 연대', sub: '볼가 소함대', kind: 'inf', hp: 7, atk: 4, def: 2, mv: 3 },
                    text: '배에서 연대 하나를 강가에 내려놓는다. 소함대 곁에 상륙 연대가 생긴다(이번 턴은 행동하지 않음).',
                    history: '10월 15일 베케톱카 쪽 반격에서 볼가 소함대가 연대 하나를 강가에 내려놓고 함포로 받쳤다.',
                } },
            { id: 'tdm', tag: '두멘코', look: 'cossack', side: 'red', name: '두멘코 기병', sub: '부됸니가 부지휘관', kind: 'cav', at: [2, 7], hp: 8, atk: 5, def: 2, mv: 5, need: 3, person: ['보리스 두멘코', 'boris-dumenko'] },
            { id: 'twk', tag: '공장', look: 'worker', side: 'red', name: '대포 공장 노동자 분견대', kind: 'inf', at: [1, 9], hp: 7, atk: 3, def: 3, mv: 3, need: 6 },
            { id: 'wmm', tag: '마몬토프', look: 'cossack', side: 'white', name: '돈 카자크 기병', sub: '마몬토프', kind: 'cav', at: [0, 3], hp: 11, atk: 6, def: 2, mv: 4, role: 'raid', person: ['콘스탄틴 마몬토프', 'konstantin-mamontov'] },
            { id: 'wd1', tag: '돈군', look: 'cossack', side: 'white', name: '돈군 보병', sub: '보로포노보', kind: 'inf', at: [5, 5], hp: 12, atk: 6, def: 2, mv: 3, role: 'push', wake: 3 },
            { id: 'wd2', tag: '돈군', look: 'cossack', side: 'white', name: '돈군 보병', sub: '서쪽', kind: 'inf', at: [3, 5], hp: 12, atk: 6, def: 2, mv: 3, role: 'push', wake: 3 },
            { id: 'wda', tag: '포대', side: 'white', name: '돈군 포대', kind: 'art', at: [4, 4], hp: 6, atk: 4, def: 1, mv: 2, range: 2, role: 'hold' },
            { id: 'wbk', tag: '농민연대', side: 'white', name: '넘어간 농민 연대', sub: '베케톱카', kind: 'inf', at: [6, 8], hp: 8, atk: 4, def: 2, mv: 3, role: 'push', wake: 3 },
            { id: 'wtr', tag: '열차', side: 'white', name: '돈군 장갑열차', kind: 'art', rail: true, at: [7, 9], hp: 6, atk: 4, def: 2, mv: 2, range: 2, role: 'hold' },
            { id: 'wsp', tag: '수비대', look: 'cossack', side: 'white', name: '돈군 수비대', sub: '사렙타', kind: 'inf', at: [8, 9], hp: 8, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'was', tag: '아스트라한', side: 'white', name: '아스트라한 지대', sub: '데먀노프', kind: 'inf', at: [9, 7], hp: 8, atk: 4, def: 2, mv: 3, role: 'hold' },
        ],
        summary: '8턴 동안 차리친역을 지키면 승리 · 사렙타를 되찾으면 일찍 승리 · 역을 비우지 말 것',
        brief: [
            '10월 중순 돈군이 차리친의 순환 철도까지 밀고 들어왔다. 남쪽의 베케톱카와 사렙타는 이미 넘어갔고, 15일 베케톱카 근처에서 농민연대 둘이 백군에게 넘어갔다.',
            '차리친역에 백군이 들어서면 진다. 8턴이 끝날 때까지 역을 지키면 역사처럼 차리친을 지켜 낸다. 그 전에 사렙타에 붉은 부대를 세우면 일찍 이기고, 5턴 안이면 이 시기 차리친 방면의 전투력이 3 는다. 지면 6 준다.',
            '마몬토프의 기병은 북쪽에서 역으로 곧장 달려온다. 기병은 붉은 부대 곁을 멈추지 않고 지나치므로 역에 부대 하나를 남겨 두어야 한다. 보로포노보의 돈군 보병과 베케톱카의 농민 연대는 3턴부터 역으로 밀려온다. 방어 띠(방어 +2)에서 맞서라.',
            '즐로바의 「강철 사단」은 백군의 뒤, 남서쪽 끝에서 시작한다. 장갑열차는 철길로만 다니되 빠르다(이동 6). 볼가 소함대는 강 위로만 다니며 사거리 2로 강가를 친다.',
            '적과 맞닿은 칸에 들어가면 그 턴의 이동은 끝난다. 한 적을 여럿이 둘러싸고 치면 둘러싼 부대마다 피해가 1씩 늘어난다.',
            '결정적 한 수(★): 쿨리크 포병의 「포 일제 사격」은 피해 +4에 반격이 없다. 즐로바의 「등 뒤로」는 그 턴 이동 +3에 적 곁을 지나간다. 소함대의 「상륙」은 강가에 연대 하나를, 보로실로프 10군의 「루간스크의 노동자들」은 곁에 노동자 분견대 하나를 세운다.',
        ],
        history: '10월 15일 즐로바의 「강철 사단」이 북캅카스에서 800킬로미터를 행군해 와 툰두토보와 사렙타 사이에서 돈군의 뒤를 쳤고, 볼가 소함대가 베케톱카 앞에 연대를 내려놓았다. 17일 돈군의 결정적 공격은 방어 띠에 모은 포병에 꺾였다. 16–19일 붉은 군대가 스베틀리야르·아브가네로보·툰두토보를 되찾았고, 25일까지 돈군은 돈강 너머로 물러났다. 소련 시대에 「붉은 베르됭」으로 기려진 이 방어는 스탈린의 공적처럼 그려졌지만, 결정적인 몫은 차리친 노동자와 장갑열차, 포병, 그리고 북캅카스에서 올라온 즐로바의 사단이 맡았다.',
    };

    // Orel, 11–20 October 1919: Kutepov's corps has taken Orel and its
    // Kornilov shock regiment rides for Mtsensk on the road to Tula, while
    // the Latvian and Estonian shock group gathers west of the city against
    // its flank. Rows run north (Mtsensk, the 13th Army) to south (Kromy).
    // Terrain: . field, f wood, O the city of Orel (held as a position),
    // K Kromy, M Mtsensk.
    const orel = {
        id: 'orel', sides: SIDES, front: 'south', final: false,
        title: '오룔 반격', date: '1919년 10월 11–20일',
        settle: '오룔로 →', board: '오룔 전장',
        strikeNote: '',
        raidNote: '코르닐로프 충격연대. 툴라로 가는 길목 므첸스크로 달려간다. 붉은 부대 곁에서 멈추지 않고 지나치며, 더 다가갈 수 없을 때만 막아선 부대를 친다. 므첸스크에 백군이 들어서면 진다.',
        legend: [['steppe', '들판'], ['forest', '숲 (방어 +1, 이동 2)'], ['city', '오룔 시가 (방어 +3, 포격으로 깎임)'], ['town', '크로미·므첸스크 (방어 +1)']],
        reward: { quick: 6, quickBy: 3, lostBy: -6 },
        map: [
            'ff......f.M.',
            'f..........f',
            'f....f......',
            '.....OOO....',
            'ff...OOO..f.',
            'f...........',
            '.K....ff....',
            'ff..........',
            '...f......ff',
        ],
        voices: [
            { when: 'start', unit: ['wo1', 'wo2'], by: 'denikin', text: '오룔은 우리 것이다. 다음은 툴라, 그다음은 모스크바다.' },
            { when: 'start', unit: 'ol1', face: 'red-soldier', text: '라트비아 소총병은 정면으로 가지 않는다. 크로미 길로 돌아 옆구리를 친다.' },
            { when: 'start', unit: 'opr', who: ['비탈리 프리마코프', 'vitaly-primakov'], text: '붉은 카자크는 백군의 뒤로 돌아간다. 쿠르스크로 가는 길을 끊는다.' },
            { when: 'start', unit: 'wok', by: 'denikin', text: '므첸스크로 달린다. 놈들의 뒤를 칠 것이다.' },
            { when: 'turned:orel', unit: ['wo1', 'wo2', 'wob', 'wd1'], by: 'denikin', text: '퇴로가 끊긴다! 쿠르스크 길을 지켜라!' },
            { when: 'goal', unit: ['ol1', 'opv', 'o13a', 'oes'], face: 'red-soldier', text: '오룔 역이 비었다! 역으로!' },
            { when: 'feat:deep-raid', unit: 'opr', who: ['비탈리 프리마코프', 'vitaly-primakov'], text: '멈추지 마라! 놈들의 짐마차와 포대를 친다!' },
            { when: 'surrender', unit: ['ol1', 'oes', 'o13a', 'opv'], face: 'red-soldier', text: '총을 내려놓았다! 쏘지 마라, 이제 우리 편이다.' },
        ],
        goals: [{ at: [4, 6], name: '오룔 역' }],
        // The Moscow–Kursk line from Mtsensk through Orel station south,
        // and the Bryansk line west from the city.
        rails: [[0, 10], [1, 10], [1, 9], [2, 9], [2, 8], [3, 8], [3, 7], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6],
            [3, 5], [2, 5], [2, 4], [2, 3], [2, 2], [2, 1], [2, 0]],
        protect: { at: [0, 10], name: '므첸스크' },
        towns: [['므첸스크', 0, 10], ['크로미', 6, 1]],
        places: [['툴라 방면', 0, 4.5], ['오룔', 2.4, 6.2], ['크로미', 7, 0.2], ['쿠르스크 방면', 8, 5]],
        turnLimit: 8,
        // A Red unit south-east of the city cuts the road to Kursk behind
        // it, and the garrison's position falls to a trench; the garrison
        // holds on regardless (role hold), as the Kornilov division did.
        lines: {
            orel: { name: '오룔 수비', rear: { rows: [5, 8], cols: [5, 9] }, label: [7, 5.1], fallback: [8, 6] },
        },
        sectors: {},
        terrain: {
            '.': { name: '들판', cost: 1, def: 0, cls: 'steppe' },
            f: { name: '숲', cost: 2, def: 1, cls: 'forest' },
            O: { name: '오룔 시가', cost: 1, def: 3, fort: 'orel', cls: 'city' },
            K: { name: '크로미', cost: 1, def: 1, cls: 'town' },
            M: { name: '므첸스크', cost: 1, def: 1, cls: 'town' },
        },
        units: [
            { id: 'ol1', tag: '라트비아', side: 'red', name: '라트비아 소총사단', sub: '충격군', kind: 'inf', at: [3, 1], hp: 10, atk: 5, def: 3, mv: 3, lead: true },
            { id: 'oes', tag: '파블로프', side: 'red', name: '파블로프 소총여단', sub: '충격군', kind: 'inf', at: [5, 1], hp: 9, atk: 5, def: 3, mv: 3 },
            { id: 'opr', tag: '붉은카자크', look: 'cossack', side: 'red', name: '붉은 카자크 여단', sub: '프리마코프', kind: 'cav', at: [2, 2], hp: 8, atk: 5, def: 2, mv: 5, person: ['비탈리 프리마코프', 'vitaly-primakov'],
                feat: { id: 'deep-raid', name: '후방 습격', kind: 'ride', mv: 3, text: '이번 턴 이동 +3, 적 곁에서 멈추지 않고 지나간다. 움직이기 전에 쓴다. 다 달린 뒤 칠 수 있다.', history: '프리마코프의 붉은 카자크는 백군 전선의 틈으로 빠져나가 뒤쪽의 철도와 짐마차, 포대를 휘저었다. 오룔-크로미 작전 동안 의용군의 퇴로를 끊는 일을 맡았다.' } },
            { id: 'o13a', tag: '9사단', side: 'red', name: '제9소총사단', sub: '제13군', kind: 'inf', at: [1, 6], hp: 10, atk: 4, def: 3, mv: 3 },
            { id: 'o13b', tag: '13군', side: 'red', name: '제13군 소총사단', sub: '므첸스크 수비', kind: 'inf', at: [0, 10], hp: 9, atk: 4, def: 3, mv: 3 },
            { id: 'o13g', tag: '13군포', side: 'red', name: '제13군 포병', kind: 'art', at: [1, 7], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'opv', tag: '에스토니아', side: 'red', name: '에스토니아 소총사단', sub: '17일 투입', kind: 'inf', at: [2, 5], hp: 9, atk: 4, def: 3, mv: 3, need: 3 },
            { id: 'otw', tag: '툴라', look: 'worker', side: 'red', name: '툴라 노동자 연대', sub: '당 주간의 입당자', kind: 'inf', at: [0, 7], hp: 8, atk: 4, def: 3, mv: 3, need: 6 },
            { id: 'otr', tag: '열차', side: 'red', name: '장갑열차', sub: '트로츠키의 열차', kind: 'art', rail: true, at: [2, 4], hp: 6, atk: 4, def: 2, mv: 2, railMv: 6, range: 2, card: 'train', person: ['레프 트로츠키', 'trotsky'] },
            { id: 'wo1', tag: '코르닐', look: 'officer', side: 'white', name: '코르닐로프 연대', sub: '오룔 수비', kind: 'inf', at: [3, 6], hp: 10, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'wo2', tag: '코르닐', look: 'officer', side: 'white', name: '코르닐로프 연대', sub: '오룔 역', kind: 'inf', at: [4, 6], hp: 10, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'wob', tag: '포대', side: 'white', name: '오룔 포대', kind: 'art', at: [4, 7], hp: 6, atk: 4, def: 1, mv: 2, range: 2, role: 'hold' },
            { id: 'wok', tag: '충격', look: 'officer', side: 'white', name: '코르닐로프 충격연대', sub: '므첸스크로', kind: 'inf', at: [3, 9], hp: 9, atk: 5, def: 2, mv: 4, role: 'raid' },
            { id: 'wd1', tag: '드로즈', look: 'officer', side: 'white', name: '드로즈돕스키 연대', sub: '크로미 길', kind: 'inf', at: [5, 3], hp: 10, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'wd2', tag: '드로즈', look: 'officer', side: 'white', name: '드로즈돕스키 연대', sub: '크로미', kind: 'inf', at: [6, 1], hp: 8, atk: 4, def: 3, mv: 3, role: 'hold' },
        ],
        summary: '오룔 역에 서면 승리 · 8턴 · 남동쪽으로 돌면 진지가 약해진다 · 므첸스크를 비우지 말 것',
        brief: [
            '10월 13일 쿠테포프의 제1군단이 오룔을 차지했다. 코르닐로프 충격연대가 툴라로 가는 길목 므첸스크로 향한다. 그 서쪽에는 라트비아 소총사단과 파블로프 소총여단, 프리마코프의 붉은 카자크로 꾸린 충격군이 모였다. 북쪽에서는 제13군이 므첸스크 앞을 막고, 새로 온 에스토니아 소총사단이 뒤를 받친다.',
            '오룔 역에 붉은 군대 부대를 세우면 오룔을 되찾는다. 8턴이 주어진다. 6턴 안에 되찾으면 남부전선이 한 도시 더 나아가고, 되찾지 못하면 이 시기 남부전선의 전투력이 6 준다.',
            '오룔 시가는 진지다(방어 +3). 포병의 포격으로 깎이고, 붉은 부대가 오룔 남동쪽의 점선 지역에 서면 쿠르스크로 가는 퇴로가 끊겨 +1로 줄어든다. 정면으로 치기 전에 크로미 길로 돌아가 퇴로를 끊는 것이 충격군의 일이다.',
            '코르닐로프 충격연대가 므첸스크로 온다. 충격연대는 붉은 부대 곁을 멈추지 않고 지나친다. 므첸스크에 백군이 들어서면 지므로, 그 칸에 부대 하나를 남겨 두어야 한다.',
            '적과 맞닿은 칸에 들어가면 그 턴의 이동은 끝난다. 한 적을 여럿이 둘러싸고 치면 둘러싼 부대마다 피해가 1씩 늘어난다.',
            '결정적 한 수(★): 붉은 카자크의 「후방 습격」은 전투에서 한 번, 그 턴 이동 +3에 적 곁을 멈추지 않고 지나간다.',
            '이미 병력이 절반 아래로 꺾인 백군 부대를 붉은 부대 셋이 둘러싼 채 치면, 그 부대는 총을 내려놓고 붉은 군대로 넘어온다(투항). 포로는 다음 시기 사단이 된다.',
        ],
        history: '10월 11일 충격군이 오룔 서쪽에서 의용군의 측면을 쳐 15일 크로미에서 드로즈돕스키 연대들을 밀어냈다. 제13군이 므첸스크 앞에서 코르닐로프 연대들을 붙잡는 사이 충격군이 남쪽에서 퇴로를 위협했고, 코르닐로프 연대들은 19일 밤 오룔을 버렸다. 20일 에스토니아 소총사단과 제9소총사단이 오룔에 들어갔다. 크로미는 23일 백군에게 다시 넘어갔다가 26일 라트비아 소총병이 되찾았다. 의용군의 정예 연대들은 다시는 모스크바를 향하지 못했다.',
    };

    // Ufa, 7–9 June 1919: Frunze's Turkestan Army at the Belaya. Chapayev's
    // 25th Division crosses by night at Krasny Yar, north of the city and
    // clear of its works, in boats, on rafts and in two steamers and a barge
    // the cavalry had taken; White planes catch Frunze and Chapayev on the
    // bridgehead on the 8th; the Whites counterattack it on the 9th, and
    // that evening the division is in Ufa. Rows run north (Krasny Yar) to
    // south; the Reds hold the west bank. Terrain: . field, f wood, ~ the
    // Belaya, x the Krasny Yar crossing (boats and rafts), p the sappers'
    // pontoon bridge, b the blown
    // railway bridge, T the east bank's trenches, t a village, U the city.
    const ufa = {
        id: 'ufa', sides: SIDES, front: 'east', final: false,
        title: '우파 도하', date: '1919년 6월 7–9일',
        settle: '우파로 →', board: '우파 전장',
        strikeNote: '',
        raidNote: '9일의 반격대. 4턴 전에는 자리를 지키며 닿는 붉은 부대만 치고, 4턴부터 크라스니야르로 곧장 온다. 붉은 부대 곁에서 멈추지 않고 지나치며, 더 다가갈 수 없을 때만 막아선 부대를 친다. 크라스니야르에 백군이 들어서면 진다.',
        legend: [['steppe', '들판'], ['forest', '숲 (방어 +1, 이동 2)'], ['river', '벨라야강'], ['crossing', '크라스니야르 나루 (방어 −1, 이동 3)'], ['pontoon', '부교 (방어 −1, 이동 2)'], ['blown', '폭파된 철교'], ['trench', '강변 진지 (방어 +2, 포격으로 깎임)'], ['town', '마을 (방어 +1)'], ['city', '우파 시가 (방어 +1)']],
        reward: { quick: 6, quickBy: 3, lostBy: -6 },
        map: [
            'f...x.....f.',
            '..f.xt....f.',
            '....p.......',
            '.f..~..f....',
            '....~T......',
            '....~T..UUU.',
            '....bT..UUU.',
            '.f..~T..UUU.',
            '....~...f...',
        ],
        // The planes over the bridgehead on 8 June (the end of the second White turn).
        air: { turn: 2, units: ['u25', 'u73'], dmg: 3 },
        voices: [
            { when: 'start', unit: 'u25', who: ['바실리 차파예프', 'vasily-chapayev'], text: '우파 정면은 놈들이 파 놓은 참호투성이다. 우리는 북쪽 크라스니야르에서 밤에 건넌다.' },
            { when: 'start', unit: 'u73', who: ['이반 쿠탸코프', 'ivan-kutyakov'], text: '기병이 빼앗아 온 기선 두 척과 바지선이 있다. 여단의 선두는 배로 간다.' },
            { when: 'start', unit: ['wf1', 'wf2'], by: 'kolchak', text: '철교는 날려 버렸다. 벨라야를 건너는 놈은 강물에 묻힌다.' },
            { when: 'air', unit: 'u25', who: ['미하일 프룬제', 'frunze'], text: '폭탄이 바로 옆에 떨어졌다. 괜찮다, 교두보를 넓혀라!' },
            { when: 'air', unit: 'u25', who: ['바실리 차파예프', 'vasily-chapayev'], text: '머리에 총알이 박혔다. 붕대만 감아라. 지휘는 내가 한다.' },
            { when: 'turn:4', unit: ['wstu', 'w8b'], by: 'kolchak', text: '대열을 지켜라. 북소리에 맞춰, 앞으로!' },
            { when: 'turn:4', unit: ['u220', 'u217', 'u25'], face: 'red-soldier', text: '줄을 맞춰 걸어온다…. 기관총, 가까이 올 때까지 쏘지 마라.' },
            { when: 'feat:steamers', unit: 'u73', who: ['이반 쿠탸코프', 'ivan-kutyakov'], text: '기선에 올라라! 불빛은 모두 끄고 건너편으로!' },
            { when: 'feat:volley', unit: 'u220', face: 'red-soldier', text: '지금이다, 쏴라!' },
            { when: 'goal', unit: ['u217', 'u220', 'u73', 'u25', 'u31'], face: 'red-soldier', text: '우파 역이 비었다! 들어가라!' },
            { when: 'surrender', unit: ['u217', 'u220', 'u73', 'u31'], face: 'red-soldier', text: '총을 내려놓았다! 쏘지 마라, 이제 우리 편이다.' },
        ],
        goals: [{ at: [6, 9], name: '우파 역' }],
        // The Samara–Zlatoust line comes to the blown bridge on the west bank.
        rails: [[6, 0], [6, 1], [6, 2], [6, 3]],
        protect: { at: [1, 5], name: '크라스니야르' },
        towns: [['크라스니야르', 1, 5]],
        places: [['벨라야강', 8, 3.75], ['나루', 0, 4.05], ['부교', 2, 4.05], ['철교', 6, 3.2], ['우파', 4, 8.2], ['사마라 방면', 8, 0.1], ['첼랴빈스크 방면', 8, 9.4]],
        turnLimit: 8,
        lines: {},
        sectors: {},
        terrain: {
            '.': { name: '들판', cost: 1, def: 0, cls: 'steppe' },
            f: { name: '숲', cost: 2, def: 1, cls: 'forest' },
            '~': { name: '벨라야강', cost: 99, def: 0, water: true, cls: 'river' },
            x: { name: '크라스니야르 나루', cost: 3, def: -1, cls: 'crossing' },
            p: { name: '부교', cost: 2, def: -1, cls: 'pontoon' },
            b: { name: '폭파된 철교', cost: 99, def: 0, cls: 'blown' },
            T: { name: '강변 진지', cost: 2, def: 2, fort: 'belaya', cls: 'trench' },
            t: { name: '크라스니야르', cost: 1, def: 1, cls: 'town' },
            U: { name: '우파 시가', cost: 1, def: 1, cls: 'city' },
        },
        units: [
            { id: 'u73', tag: '73여단', side: 'red', name: '제73여단', sub: '쿠탸코프', kind: 'inf', at: [2, 2], hp: 10, atk: 5, def: 3, mv: 3, person: ['이반 쿠탸코프', 'ivan-kutyakov'],
                feat: {
                    id: 'steamers', name: '기선 두 척', kind: 'ferry', mv: 2,
                    text: '이번 턴 이동 +2, 벨라야강 위를 한 칸에 이동 1로 건너 건너편 땅에 내린다. 움직이기 전에 쓴다.',
                    history: '6월 2–3일 붉은 기병이 기선 두 척과 바지선을 빼앗았다. 7일 밤 이 배들이 쿠탸코프의 제73여단 선두를 크라스니야르로 실어 날랐고, 공병은 보병을 위해 부교를 놓았다.',
                } },
            { id: 'u217', tag: '217', side: 'red', name: '제217연대', sub: '제25사단', kind: 'inf', at: [1, 1], hp: 10, atk: 4, def: 3, mv: 3 },
            { id: 'u220', tag: '220', side: 'red', name: '제220연대', sub: '제25사단', kind: 'inf', at: [0, 2], hp: 10, atk: 5, def: 3, mv: 3, need: 0,
                feat: {
                    id: 'volley', name: '기관총 일제 사격', kind: 'strike', plus: 3,
                    text: '기관총이 대열이 가까이 올 때까지 기다렸다가 한꺼번에 쏜다. 이번 공격 피해 +3, 반격 없음.',
                    history: '9일 백군 제4·8사단과 시베리아 카자크가 교두보를 되치러 왔다. 제220연대 정치위원 카푸스탼스키는 병사들이 「사자처럼 싸웠다」고 적었다.',
                } },
            { id: 'u25', tag: '차파예프', look: 'cossack', side: 'red', name: '제25사단 기병대대', sub: '차파예프', kind: 'cav', at: [3, 0], hp: 8, atk: 5, def: 2, mv: 5, lead: true, person: ['바실리 차파예프', 'vasily-chapayev'] },
            { id: 'u25g', tag: '25포병', side: 'red', name: '제25사단 포병', kind: 'art', at: [3, 2], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'u31', tag: '31', side: 'red', name: '제31사단', sub: '8일 왼쪽으로 옮김', kind: 'inf', at: [2, 1], hp: 10, atk: 4, def: 3, mv: 3, need: 6 },
            { id: 'u24', tag: '24', side: 'red', name: '제24사단', sub: '철교 정면', kind: 'inf', at: [7, 2], hp: 10, atk: 4, def: 3, mv: 3, need: 3 },
            { id: 'utr', tag: '열차', side: 'red', name: '장갑열차', sub: '트로츠키의 열차', kind: 'art', rail: true, at: [6, 1], hp: 6, atk: 4, def: 2, mv: 2, railMv: 6, range: 2, card: 'train' },
            { id: 'wpost', tag: '경계', side: 'white', name: '경계 부대', sub: '크라스니야르', kind: 'inf', at: [1, 6], hp: 5, atk: 3, def: 2, mv: 3, role: 'hold' },
            { id: 'wf1', tag: '4사단', side: 'white', name: '제4사단', sub: '강변 진지', kind: 'inf', at: [5, 5], hp: 10, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'wf2', tag: '4사단', side: 'white', name: '제4사단', sub: '강변 진지', kind: 'inf', at: [7, 5], hp: 9, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'wbat', tag: '포대', side: 'white', name: '우파 포대', kind: 'art', at: [5, 8], hp: 6, atk: 4, def: 1, mv: 2, range: 2, role: 'hold' },
            { id: 'wcity', tag: '8사단', side: 'white', name: '제8사단', sub: '우파 역', kind: 'inf', at: [6, 9], hp: 9, atk: 4, def: 3, mv: 3, role: 'hold' },
            { id: 'wstu', tag: '의용', side: 'white', name: '교도대 의용 중대', sub: '검은 교복', kind: 'inf', at: [4, 9], hp: 6, atk: 3, def: 1, mv: 3, role: 'raid', wake: 4 },
            { id: 'w8b', tag: '8사단', side: 'white', name: '제8사단 연대', sub: '반격', kind: 'inf', at: [3, 10], hp: 9, atk: 3, def: 2, mv: 3, role: 'raid', wake: 4 },
            { id: 'wcos', tag: '카자크', look: 'cossack', side: 'white', name: '시베리아 카자크', sub: '반격', kind: 'cav', at: [0, 11], hp: 8, atk: 4, def: 2, mv: 4, role: 'raid', wake: 4 },
        ],
        summary: '우파 역에 서면 승리 · 8턴 · 크라스니야르를 비우지 말 것 · 4턴에 백군이 반격한다',
        brief: [
            '6월 9일 아침까지 벨라야강을 건너 우파를 되찾아야 한다. 우파 정면은 철교가 폭파되었고 건너편 강변에 진지(방어 +2)가 늘어서 있다. 차파예프의 제25사단은 그 북쪽 크라스니야르 나루에서 배와 뗏목으로(이동 3), 그 남쪽은 공병이 놓은 부교로(이동 2) 건넌다. 물 위에서는 방어 −1이다.',
            '우파 역에 붉은 군대 부대를 세우면 이긴다. 8턴이 주어진다. 6턴 안에 되찾으면 동부전선이 한 도시 더 나아가고, 되찾지 못하면 이 시기 동부전선의 전투력이 6 준다.',
            '2턴이 끝날 때 백군 비행기가 교두보를 덮쳐 차파예프의 기병대대와 제73여단이 피해를 입는다(쓰러지지는 않는다).',
            '4턴부터 백군 반격대(교도대 의용 중대, 제8사단 연대, 시베리아 카자크)가 크라스니야르로 곧장 온다. 크라스니야르에 백군이 들어서면 지므로, 건넌 뒤에도 그 칸을 지켜야 한다.',
            '적과 맞닿은 칸에 들어가면 그 턴의 이동은 끝난다. 한 적을 여럿이 둘러싸고 치면 둘러싼 부대마다 피해가 1씩 늘어난다.',
            '결정적 한 수(★): 제73여단의 「기선 두 척」은 한 번, 그 턴 이동 +2에 강 위를 건너 건너편에 내린다. 제220연대의 「기관총 일제 사격」은 피해 +3에 반격이 없다.',
            '이미 병력이 절반 아래로 꺾인 백군 부대를 붉은 부대 셋이 둘러싼 채 치면, 그 부대는 총을 내려놓고 붉은 군대로 넘어온다(투항). 포로는 다음 시기 사단이 된다.',
        ],
        history: '6월 7일 밤 제25사단의 제73여단 선두가 빼앗은 기선으로 크라스니야르에서 벨라야를 건넜고, 제217·220연대가 강가 마을들을 차지했다. 8일 교두보에 건너간 프룬제는 비행기의 폭탄에 타박상을 입었고, 차파예프는 기관총탄에 머리를 맞고도 지휘를 놓지 않았다. 9일 백군 제4·8사단과 시베리아 카자크의 반격을 물리친 제25사단이 그날 저녁 우파에 들어갔다. 영화 「차파예프」(1934)의 「심리 공격」, 검은 제복의 장교 연대가 북소리에 맞춰 총검을 앞세우고 줄지어 걸어오는 장면이 이 싸움을 그렸다.',
    };

    // Warsaw, 13–17 August 1920 (rules 6, the march on Warsaw): the 16th
    // Army takes Radzymin and strikes at the Praga bridgehead across the
    // Vistula from the city, while south of the woods and marshes the thin
    // Mozyr Group holds the Western Front's flank alone and Piłsudski
    // gathers a strike group on the Wieprz. Rows run north (Modlin, the
    // Wkra) to south (the Wieprz); the Vistula runs down the west, Warsaw
    // beyond it. Terrain: . field, f wood, ~ the Vistula, B the bridge,
    // W Warsaw, P the Praga bridgehead, R Radzymin, m woods and marshes,
    // G Garwolin.
    // Narrow by design: only the 1st Cavalry Army (the konarmia card) can
    // reach Garwolin before the strike group wakes, so without it the flank
    // falls at the end of turn 2; and the bridge wants every division the
    // front can bring (need) by turn 5.
    const warsaw = {
        id: 'warsaw', sides: SIDES, front: 'west', final: false,
        when: { rules: ['>=', 6], choice: 'warsaw' },
        title: '바르샤바 전투', date: '1920년 8월 13–17일',
        settle: '바르샤바로 →', board: '바르샤바 전장', enemyName: '폴란드군',
        strikeNote: '',
        pushNote: '피우수트스키의 타격 집단. 2턴이 끝날 때까지 자리를 지키며 닿는 붉은 부대만 치고, 그 뒤 가르볼린으로 곧장 온다. 붉은 부대 곁에서는 멈춰 싸운다. 가르볼린에 폴란드군이 들어서면 진다.',
        stakes: '이기면 바르샤바와 큰 보상 · 지면 역사처럼 무너지고 다음 시기 사단 −3',
        outcome: { won: '바르샤바에 들어갔다', lost: '역사처럼 비스와강 앞에서 무너졌다' },
        legend: [['steppe', '들판'], ['forest', '숲 (방어 +1, 이동 2) · 늪과 숲 (방어 +1, 이동 3)'], ['river', '비스와강'], ['bridge', '바르샤바 다리'], ['trench', '프라가 교두보 (방어 +1, 포격으로 깎임)'], ['town', '라지민·가르볼린 (방어 +1)'], ['city', '바르샤바 (방어 +1)']],
        map: [
            '.f~.....f....',
            '..~..........',
            'W.~..R.......',
            'WW~P.........',
            'WWBP.........',
            'WW~P.........',
            '..~mmmmmmmmmm',
            '..~mmmmmmmmmm',
            '..~..........',
            '..~..G.......',
            '..~..........',
        ],
        voices: [
            // Tukhachevsky led the Western Front from Minsk, some 500 km away; the Mozyr Group could not even tell his staff of the Polish blow.
            { when: 'start', unit: 'r27', who: ['미하일 투하쳅스키', 'tukhachevsky'], via: '민스크의 서부전선 사령부에서 온 무전', text: '제16군은 바르샤바를 쳐라. 남쪽 측면은 모지르 집단이 맡는다. 비스와강까지 멈추지 마라.' },
            { when: 'start', unit: 'r27', face: 'red-soldier', text: '라지민만 넘으면 프라가다. 그 다리 건너가 바르샤바다.' },
            { when: 'start', unit: ['wp2', 'wp1'], by: 'poland', text: '프라가 다리는 내주지 않는다. 바르샤바 노동자도 의용대로 나왔다.' },
            { when: 'start', unit: 'r57', face: 'red-soldier', text: '모지르 집단이 이 넓은 남쪽을 혼자 맡았다. 뒤에도 옆에도 아무도 없다.' },
            { when: 'start', unit: 'r1c', who: ['세묜 부됸니', 'semyon-budyonny'], text: '리비우를 두고 북쪽으로 왔다. 가르볼린 길은 기병군이 막는다.' },
            { when: 'turn:3', unit: ['wl1', 'wl3', 'wcv'], who: ['유제프 피우수트스키', 'jozef-pilsudski'], by: 'poland', text: '비에프시강에서 북쪽으로! 놈들의 등 뒤로 들어간다.' },
            { when: 'turn:5', unit: ['r27', 'r21', 'r2', 'r10'], face: 'red-soldier', text: '오늘 다리를 건너지 못하면 끝이다. 앞으로!' },
            { when: 'feat:konarmia-charge', unit: 'r1c', who: ['세묜 부됸니', 'semyon-budyonny'], text: '사브르를 뽑아라! 기병군, 돌격!' },
            { when: 'goal', unit: ['r27', 'r21', 'r2', 'r10', 'r8'], face: 'red-soldier', text: '다리 너머가 비었다! 바르샤바로!' },
            { when: 'surrender', unit: ['r27', 'r21', 'r2', 'r10', 'r1c'], face: 'red-soldier', text: '폴란드 병사들이 총을 내려놓는다. 쏘지 마라.' },
        ],
        goals: [{ at: [4, 1], name: '바르샤바' }],
        // The Warsaw–Brest railway from Praga station east.
        rails: [[4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10], [4, 11], [4, 12]],
        protect: { at: [9, 5], name: '가르볼린' },
        towns: [['라지민', 2, 5], ['가르볼린', 9, 5]],
        places: [['브크라강 방면', 0, 9.4], ['비스와강', 8, 2.05], ['바르샤바', 1.4, 0.1], ['프라가', 2.4, 3.05], ['늪과 숲', 6, 7], ['브레스트 방면', 3, 10.5], ['비에프시강', 10, 9.4]],
        turnLimit: 5,
        lines: {},
        sectors: {},
        terrain: {
            '.': { name: '들판', cost: 1, def: 0, cls: 'steppe' },
            f: { name: '숲', cost: 2, def: 1, cls: 'forest' },
            '~': { name: '비스와강', cost: 99, def: 0, water: true, cls: 'river' },
            B: { name: '바르샤바 다리', cost: 1, def: 0, cls: 'bridge' },
            W: { name: '바르샤바', cost: 1, def: 1, cls: 'city' },
            P: { name: '프라가 교두보', cost: 1, def: 1, fort: 'praga', cls: 'trench' },
            R: { name: '라지민', cost: 1, def: 1, cls: 'town' },
            m: { name: '늪과 숲', cost: 3, def: 1, cls: 'forest' },
            G: { name: '가르볼린', cost: 1, def: 1, cls: 'town' },
        },
        units: [
            { id: 'r27', tag: '27', side: 'red', name: '제27사단', sub: '제16군', kind: 'inf', at: [2, 6], hp: 10, atk: 5, def: 3, mv: 3, lead: true },
            { id: 'r21', tag: '21', side: 'red', name: '제21사단', sub: '제3군', kind: 'inf', at: [3, 7], hp: 10, atk: 4, def: 3, mv: 3, need: 0 },
            { id: 'r2', tag: '2', side: 'red', name: '제2사단', sub: '제16군', kind: 'inf', at: [4, 6], hp: 10, atk: 4, def: 3, mv: 3, need: 0 },
            { id: 'r10', tag: '10', side: 'red', name: '제10사단', sub: '제16군', kind: 'inf', at: [5, 7], hp: 10, atk: 4, def: 3, mv: 3, need: 0 },
            { id: 'r16g', tag: '16군포', side: 'red', name: '제16군 포병', kind: 'art', at: [4, 7], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'rhg', tag: '중포', side: 'red', name: '서부전선 중포병', kind: 'art', at: [5, 8], hp: 7, atk: 5, def: 1, mv: 2, range: 2, need: 3 },
            { id: 'r8', tag: '8', side: 'red', name: '제8사단', sub: '제16군', kind: 'inf', at: [3, 8], hp: 10, atk: 4, def: 3, mv: 3, need: 6 },
            { id: 'rtr', tag: '열차', side: 'red', name: '장갑열차', sub: '트로츠키의 열차', kind: 'art', rail: true, at: [4, 8], hp: 6, atk: 4, def: 2, mv: 2, railMv: 6, range: 2, card: 'train' },
            { id: 'r57', tag: '모지르', side: 'red', name: '모지르 집단', sub: '제57사단', kind: 'inf', at: [9, 5], hp: 4, atk: 3, def: 2, mv: 3 },
            { id: 'r1c', tag: '1기병', side: 'red', name: '제1기병군', sub: '부됸니', kind: 'cav', at: [8, 12], hp: 16, atk: 7, def: 3, mv: 5, card: 'konarmia', person: ['세묜 부됸니', 'semyon-budyonny'],
                feat: {
                    id: 'konarmia-charge', name: '기병군의 돌격', kind: 'strike', plus: 3,
                    text: '기병 사단들이 한꺼번에 들이친다. 이번 공격 피해 +3, 반격 없음.',
                    history: '1920년 6월 5일 제1기병군은 사모호로독 근처에서 폴란드 전선을 뚫고 키예프의 폴란드군 뒤로 들어갔다. 끊길 것을 두려워한 폴란드군은 곧 키예프를 버렸다.',
                } },
            { id: 'wrz', tag: '11사단', side: 'white', name: '제11보병사단', sub: '라지민', kind: 'inf', at: [2, 5], hp: 8, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'wp1', tag: '1군', side: 'white', name: '제1군', sub: '프라가 교두보', kind: 'inf', at: [3, 3], hp: 9, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'wp2', tag: '1군', side: 'white', name: '제1군', sub: '다리 어귀', kind: 'inf', at: [4, 3], hp: 10, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'wwa', tag: '의용대', side: 'white', name: '바르샤바 의용대', sub: '노동자·학생', kind: 'inf', at: [4, 1], hp: 10, atk: 3, def: 1, mv: 3, role: 'hold' },
            { id: 'wart', tag: '포대', side: 'white', name: '바르샤바 포대', kind: 'art', at: [3, 1], hp: 6, atk: 3, def: 1, mv: 2, range: 2, role: 'hold' },
            { id: 'w5', tag: '5군', side: 'white', name: '제5군', sub: '시코르스키', kind: 'inf', at: [0, 6], hp: 10, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'wl1', tag: '레기온1', side: 'white', name: '레기온 제1보병사단', sub: '타격 집단', kind: 'inf', at: [10, 3], hp: 10, atk: 5, def: 3, mv: 3, role: 'push', wake: 2 },
            { id: 'wl3', tag: '레기온3', side: 'white', name: '레기온 제3보병사단', sub: '타격 집단', kind: 'inf', at: [10, 7], hp: 8, atk: 4, def: 3, mv: 3, role: 'push', wake: 2 },
            { id: 'wcv', tag: '기병', side: 'white', name: '기병여단', sub: '타격 집단', kind: 'cav', at: [10, 4], hp: 8, atk: 5, def: 2, mv: 5, role: 'push', wake: 2 },
        ],
        summary: '바르샤바에 서면 승리 · 5턴 · 2턴 끝에 폴란드 타격 집단이 깨어난다 · 가르볼린을 비우지 말 것',
        brief: [
            '8월 13일, 투하쳅스키의 서부전선이 비스와강에 다다랐다. 제16군은 라지민을 거쳐 바르샤바의 동쪽 교두보 프라가를 친다. 다리를 건너 바르샤바에 붉은 군대 부대를 세우면 이긴다. 5턴이 주어진다.',
            '서부전선의 남쪽 옆구리는 비어 있다. 늪과 숲 너머 가르볼린을 지키는 것은 약한 모지르 집단뿐이다. 2턴이 끝날 때 피우수트스키가 비에프시강에 모은 타격 집단이 깨어나 가르볼린으로 온다. 가르볼린에 폴란드군이 들어서면 진다.',
            '늪과 숲(이동 3)이 보병을 묶어, 서부전선의 보병은 3턴에야 가르볼린에 닿는다. 그 전에 옆구리를 막을 수 있는 것은 남쪽에서 올라오는 부됸니의 제1기병군뿐이다(「부됸니의 제1기병군」 카드를 서부전선에 보냈을 때).',
            '프라가 교두보(방어 +1)는 포격으로 깎인다. 바르샤바로 가는 다리는 한 칸뿐이라, 다리 어귀의 수비대를 꺾어야 건널 수 있다. 서부전선에 보낸 전투력이 모자라면 다리까지 갈 부대가 나오지 않는다.',
            '적과 맞닿은 칸에 들어가면 그 턴의 이동은 끝난다. 한 적을 여럿이 둘러싸고 치면 둘러싼 부대마다 피해가 1씩 늘어난다.',
            '결정적 한 수(★): 제1기병군의 「기병군의 돌격」은 전투에서 한 번, 피해 +3에 반격이 없다.',
            '이미 병력이 절반 아래로 꺾인 폴란드군 부대를 붉은 부대 셋이 둘러싼 채 치면, 그 부대는 총을 내려놓고 붉은 군대로 넘어온다(투항). 포로는 다음 시기 사단이 된다.',
        ],
        history: '8월 13일 붉은 군대 제21·27사단이 라지민을 차지해 프라가 교두보 코앞까지 갔다. 14일 시코르스키의 제5군이 북쪽 브크라강에서 반격했고, 15일 폴란드군이 라지민을 되찾았다. 16일 피우수트스키가 비에프시강에 모은 타격 집단이 북쪽으로 치고 올라가 모지르 집단을 뚫고 서부전선의 등 뒤로 들어갔다. 제1기병군은 리비우에 매달려 있었다. 투하쳅스키의 군대는 동프로이센과 벨라루스 쪽으로 무너졌고, 폴란드는 이 승리를 「비스와강의 기적」이라 불렀다.',
    };

    // The main railway lines of 1918 on the map, as [lat, lng] stations
    // and junctions along them (approximate). The war was fought along
    // them: the Czech legion strung out on the Penza–Samara–Chelyabinsk
    // line, Trotsky's train, the Kazan bridge at Sviyazhsk. label: where
    // the line's name is written, for the few that matter most.
    const railways = [
        { id: 'nikolaev', name: '니콜라이 철도', pts: [[55.76, 37.62], [56.86, 35.90], [57.88, 34.05], [59.94, 30.31]] },
        { id: 'baltic', name: '페트로그라드–레발', pts: [[59.94, 30.31], [59.57, 30.13], [59.37, 28.61], [59.38, 28.19], [59.26, 25.96], [59.44, 24.75]] },
        { id: 'north', name: '아르한겔스크 철도', label: [62.6, 40.4], pts: [[55.76, 37.62], [56.30, 38.13], [57.63, 39.87], [58.19, 40.17], [59.22, 39.89], [60.97, 40.25], [61.67, 40.20], [63.45, 40.33], [64.54, 40.54]] },
        { id: 'perm', name: '페름 철도', label: [58.75, 52.6], pts: [[58.19, 40.17], [58.47, 41.53], [58.37, 45.51], [58.31, 48.32], [58.60, 49.66], [58.14, 52.66], [58.08, 54.66], [58.01, 56.23], [57.43, 56.94], [56.84, 60.61]] },
        { id: 'nizhny', name: '모스크바–니즈니노브고로드', pts: [[55.76, 37.62], [56.13, 40.41], [56.33, 44.00]] },
        { id: 'kazan', name: '모스크바–카잔 철도', label: [55.2, 45.2], pts: [[55.76, 37.62], [55.10, 38.77], [54.63, 39.74], [54.35, 41.92], [54.06, 44.95], [54.84, 46.58], [55.51, 47.49], [55.77, 48.66], [55.79, 49.12]] },
        { id: 'simbirsk', name: '심비르스크 지선', pts: [[54.06, 44.95], [53.85, 46.35], [54.31, 48.40]] },
        { id: 'transsib', name: '시베리아 횡단선', label: [54.85, 63.4], pts: [[54.63, 39.74], [53.71, 40.07], [53.44, 41.81], [53.20, 45.00], [53.12, 46.60], [53.16, 48.47], [53.20, 50.15], [53.22, 50.63], [53.65, 52.43], [53.68, 53.65], [54.74, 55.97], [55.17, 59.65], [55.16, 61.40], [55.44, 65.34]] },
        { id: 'chelyabinsk', name: '첼랴빈스크–예카테린부르크', pts: [[55.16, 61.40], [56.84, 60.61]] },
        { id: 'kursk', name: '모스크바–쿠르스크–아조프 철도', pts: [[55.76, 37.62], [54.92, 37.41], [54.19, 37.62], [53.28, 36.57], [52.97, 36.07], [51.73, 36.19], [50.60, 36.59], [49.99, 36.23], [48.89, 36.32], [48.85, 37.60], [48.53, 37.71], [47.92, 38.20], [47.21, 38.94], [47.24, 39.71]] },
        { id: 'sevastopol', name: '로조바야–세바스토폴 철도', pts: [[48.89, 36.32], [48.32, 35.52], [47.84, 35.14], [46.85, 35.37], [46.24, 34.64], [45.71, 34.39], [44.95, 34.10], [44.62, 33.52]] },
        { id: 'southeast', name: '남동 철도', pts: [[53.71, 40.07], [52.89, 40.49], [52.49, 39.94], [51.66, 39.20], [50.98, 39.50], [48.92, 40.39], [48.13, 40.80], [47.42, 40.09], [47.24, 39.71]] },
        { id: 'tsaritsyn', name: '그랴지–차리친 철도', pts: [[52.49, 39.94], [51.37, 42.09], [51.19, 42.25], [49.77, 43.66], [48.71, 44.51]] },
        { id: 'saratov', name: '랴잔–우랄 철도', pts: [[52.89, 40.49], [52.72, 41.44], [52.65, 42.73], [52.26, 43.78], [51.87, 45.00], [51.53, 46.03]] },
        { id: 'vladikavkaz', name: '블라디캅카스 철도', pts: [[47.24, 39.71], [45.85, 40.12], [45.04, 38.98], [44.72, 37.77]] },
        { id: 'salsk', name: '티호레츠카야–차리친 철도', pts: [[45.85, 40.12], [46.47, 41.54], [47.63, 43.14], [48.71, 44.51]] },
        { id: 'brest', name: '모스크바–브레스트 철도', pts: [[55.76, 37.62], [55.51, 36.03], [55.21, 34.30], [54.78, 32.05], [54.51, 30.42], [54.23, 28.50], [53.90, 27.57], [53.13, 26.01], [52.10, 23.69], [52.23, 21.01]] },
        { id: 'kiev', name: '모스크바–키예프 철도', pts: [[55.76, 37.62], [55.01, 36.46], [54.51, 36.26], [54.10, 35.34], [53.25, 34.37], [51.24, 33.20], [51.18, 32.82], [51.05, 31.88], [50.45, 30.52]] },
        { id: 'southwest', name: '남서 철도', pts: [[50.45, 30.52], [50.08, 29.92], [49.72, 28.83], [49.89, 28.60], [50.18, 27.06], [50.51, 26.25], [50.08, 25.15], [49.91, 24.62], [49.84, 24.03]] },
    ];

    const battles = { kazan, tsaritsyn, ufa, orel, warsaw, perekop };

    // The portraits (war/art.js): each person's headgear, hair, face, what
    // they wore and what they are drawn with. side colours the square behind
    // them; no two people are drawn alike (scripts/lib/war-scenario-check.js).
    const portraits = {
        trotsky: { side: 'red', hair: 'shock', glasses: 'round', beard: 'goatee', moustache: true, dress: 'greatcoat' },
        lenin: { side: 'red', hair: 'bald', beard: 'short', moustache: true, cap: 'worker', dress: 'suit' },
        sverdlov: { side: 'red', hair: 'shock', glasses: 'pince', beard: 'goatee', moustache: true, dress: 'leather' },
        kalinin: { side: 'red', cap: 'worker', glasses: 'round', beard: 'pointed', moustache: true, dress: 'shirt' },
        dzerzhinsky: { side: 'red', hair: 'swept', face: 'long', beard: 'goatee', moustache: true, dress: 'tunic' },
        stalin: { side: 'red', hair: 'swept', moustache: 'great', dress: 'tunic' },
        radek: { side: 'red', hair: 'shock', glasses: 'round', beard: 'full', dress: 'suit' },
        'bela-kun': { side: 'red', hair: 'swept', face: 'square', moustache: true, dress: 'suit' },
        'ioakim-vatsetis': { side: 'red', cap: 'peaked', face: 'square', brows: 'heavy', moustache: true, dress: 'greatcoat' },
        sokolnikov: { side: 'red', hair: 'swept', moustache: true, beard: 'short', dress: 'suit' },
        frunze: { side: 'red', cap: 'budenovka', beard: 'short', moustache: true, dress: 'tunic' },
        'semyon-budyonny': { side: 'red', cap: 'budenovka', moustache: 'great', dress: 'tunic' },
        'filipp-mironov': { side: 'red', cap: 'papakha', moustache: true, beard: 'short', grey: true, dress: 'tunic' },
        'sergey-kamenev': { side: 'red', cap: 'peaked', moustache: 'great', dress: 'greatcoat' },
        tukhachevsky: { side: 'red', cap: 'budenovka', dress: 'tunic' },
        'vitaly-primakov': { side: 'red', cap: 'papakha', dress: 'cherkeska' },
        'fyodor-raskolnikov': { side: 'red', cap: 'naval', dress: 'naval' },
        'vladimir-azin': { side: 'red', cap: 'budenovka', face: 'long', brows: 'heavy', moustache: true, dress: 'tunic' },
        voroshilov: { side: 'red', cap: 'peaked', moustache: true, dress: 'tunic' },
        'grigory-kulik': { side: 'red', cap: 'peaked', face: 'long', dress: 'tunic' },
        'boris-dumenko': { side: 'red', cap: 'papakha', face: 'square', moustache: 'great', dress: 'tunic' },
        'dmitry-zhloba': { side: 'red', cap: 'peaked', moustache: true, beard: 'short', dress: 'leather' },
        'vladimir-smirnov': { side: 'red', hair: 'swept', glasses: 'pince', beard: 'short', moustache: true, dress: 'leather' },
        // A soldier who speaks for his unit.
        'red-soldier': { side: 'red', cap: 'budenovka', moustache: true, dress: 'greatcoat' },
        'vasily-chapayev': { side: 'red', cap: 'papakha', moustache: 'curled', dress: 'tunic' },
        'vasily-blyukher': { side: 'red', cap: 'budenovka', face: 'square', brows: 'heavy', dress: 'tunic' },
        'ivan-kutyakov': { side: 'red', cap: 'peaked', dress: 'tunic' },
        'maria-spiridonova': { side: 'black', hair: 'bun', glasses: 'pince', dress: 'blouse' },
        'nestor-makhno': { side: 'black', hair: 'long', cap: 'papakha', dress: 'shirt' },
        'semyon-karetnik': { side: 'black', hair: 'swept', moustache: true, dress: 'shirt' },
        'nykyfor-hryhoriv': { side: 'national', cap: 'papakha', moustache: 'great', dress: 'greatcoat' },
        'symon-petliura': { side: 'national', cap: 'peaked', face: 'long', dress: 'greatcoat' },
        'jozef-pilsudski': { side: 'national', cap: 'maciejowka', brows: 'heavy', moustache: 'great', dress: 'field' },
        'alexander-kolchak': { side: 'white', cap: 'naval', face: 'long', brows: 'heavy', dress: 'naval' },
        'anton-denikin': { side: 'white', cap: 'peaked', beard: 'pointed', moustache: true, grey: true, dress: 'epaulets' },
        'pyotr-wrangel': { side: 'white', cap: 'papakha', face: 'long', dress: 'cherkeska' },
        'nikolai-yudenich': { side: 'white', cap: 'peaked', face: 'square', moustache: 'great', dress: 'epaulets' },
        'alexander-kutepov': { side: 'white', cap: 'peaked', beard: 'full', moustache: true, dress: 'epaulets' },
        'pyotr-krasnov': { side: 'white', cap: 'papakha', face: 'long', moustache: true, grey: true, dress: 'epaulets' },
        'konstantin-mamontov': { side: 'white', cap: 'papakha', moustache: 'great', grey: true, dress: 'epaulets' },
        'vladimir-kappel': { side: 'white', cap: 'peaked', moustache: true, beard: 'short', dress: 'epaulets' },
        'mikhail-hanzhin': { side: 'white', cap: 'peaked', moustache: true, dress: 'epaulets' },
        'ivan-barbovich': { side: 'white', cap: 'papakha', face: 'square', moustache: true, dress: 'epaulets' },
    };


    // The strategic map (services/war-map.js): its frame, the event-control
    // document whose phases colour history's control, the hub every front
    // runs out from (voices may speak at it: at 'moscow'), the railways,
    // and nudges for city names that would collide (dx, dy, anchor).
    const map = {
        box: { west: 19, east: 66, south: 42, north: 66 }, control: 'civil-war', title: '러시아 내전 작전 지도',
        hub: moscow, hubId: 'moscow', railways,
        labelAt: { 가치나: [8, 14, 'start'], 얌부르크: [-8, 4, 'end'], 페트로그라드: [8, -2, 'start'] },
        // Places the briefs and voices name that are not front cities:
        // regions, rivers and towns ([이름, 위도, 경도, kind, 'below' or 'above'
        // for a town named under or over its dot]); and
        // places beyond the frame, named at its edge in their direction.
        places: [
            ['볼가강', 53.6, 47.2, 'river'], ['돈강', 49.2, 41.6, 'river'], ['비스와강', 52.6, 21.6, 'river'],
            ['우랄', 60.6, 58.6, 'region'], ['시베리아', 60.2, 64.0, 'region'], ['크림', 45.3, 34.2, 'region'],
            ['쿠반', 45.5, 37.6, 'region'], ['돈바스', 48.3, 38.3, 'region'], ['캅카스', 44.5, 45.3, 'region'], ['우크라이나', 48.9, 32.6, 'region'],
            ['베사라비아', 47.2, 28.6, 'region'], ['에스토니아', 58.6, 24.2, 'region'], ['라트비아', 56.9, 24.9, 'region'],
            ['첼랴빈스크', 55.16, 61.4, 'town', 'above'], ['이젭스크', 56.85, 53.2, 'town'], ['펜자', 53.2, 45.0, 'town'],
            ['탐보프', 52.73, 41.45, 'town', 'below'], ['보로네시', 51.67, 39.2, 'town', 'below'], ['오데사', 46.48, 30.73, 'town'],
            ['노보로시스크', 44.72, 37.77, 'town', 'below'], ['페름', 58.01, 56.25, 'town'],
        ],
        // Operations told on the map (war/ui/game.js): when one plays (a
        // season's turn and phase, the flag a choice set or the card sent),
        // its steps go first among the season's voices, each drawing its
        // arrows ([위도, 경도] paths) as its words show. side: 'red' or a
        // faction kind; style: 'strike' (the move told), 'beaten' (a move
        // broken), 'next' (what is left to do, dashed); gather: a ring where
        // forces stand ready; clash: where they met. The bubble points at
        // the step's last arrowhead.
        operations: {
            frunze: {
                title: '프룬제의 측면 반격', who: ['미하일 프룬제', 'frunze'], turn: 'directive', phase: 'plan', flag: 'flank',
                steps: [
                    {
                        date: '1919년 3–4월', text: '콜차크의 서부군이 우파에서 볼가 쪽으로 깊이 들어왔다. 4월 10일 부구루슬란이 넘어갔다. 진격로는 길게 늘어졌고, 남쪽 옆구리는 비었다.',
                        draw: [{ side: 'white', style: 'strike', path: [[54.74, 55.97], [54.10, 54.12], [53.65, 52.43], [53.40, 51.30]], name: '콜차크 서부군' }],
                    },
                    {
                        date: '1919년 4월', text: '프룬제는 정면을 메우지 않고 남부집단군의 타격 부대를 부줄루크 둘레에 모았다. 차파예프의 제25사단이 그 선봉이다.',
                        draw: [{ gather: [52.79, 52.26], name: '부줄루크' }],
                    },
                    {
                        date: '1919년 4월 28일–5월 17일', text: '4월 28일 타격 부대가 북쪽으로 콜차크군의 옆구리를 찔렀다. 5월 4일 부구루슬란, 13일 부굴마, 17일 벨레베이. 늘어진 서부군은 끊길까 봐 우랄 쪽으로 물러났다.',
                        draw: [
                            { side: 'white', style: 'beaten', path: [[54.74, 55.97], [54.10, 54.12], [53.65, 52.43], [53.40, 51.30]] },
                            { side: 'red', style: 'strike', path: [[52.79, 52.26], [53.65, 52.43], [54.54, 52.79]], name: '부굴마' },
                            { side: 'red', style: 'strike', path: [[53.40, 52.55], [53.85, 53.40], [54.10, 54.12]], name: '벨레베이' },
                            { clash: [53.65, 52.43], name: '부구루슬란' },
                        ],
                    },
                    {
                        date: '1919년 6월', text: '남은 것은 벨라야강 건너의 우파다. 이번 시기에 그 강을 건넌다.',
                        draw: [{ side: 'red', style: 'next', path: [[54.10, 54.12], [54.45, 55.20], [54.74, 55.97]], name: '벨라야강 도하' }],
                    },
                ],
            },
            mironov: {
                title: '미로노프의 제2기병군', who: ['필리프 미로노프', 'filipp-mironov'], turn: 'perekop', phase: 'review', card: 'mironov',
                steps: [
                    {
                        date: '1920년 10월 초', text: '브란겔이 알렉산드롭스크와 니코폴 사이에서 드니프로강을 건너 서쪽으로 나왔다. 바비예프와 바르보비치의 기병군단이 카호프카의 붉은 교두보를 등 뒤에서 노린다.',
                        draw: [
                            { side: 'white', style: 'strike', path: [[47.80, 35.05], [47.62, 34.55], [47.66, 33.95]], name: '바르보비치 기병군단' },
                            { gather: [46.82, 33.48], name: '카호프카 교두보' },
                        ],
                    },
                    {
                        date: '1920년 10월 중순', text: '사면받은 미로노프의 제2기병군이 니코폴 서쪽에서 백군 기병을 맞받아쳤다. 바비예프가 쓰러졌고, 바르보비치의 군단은 드니프로강 너머로 쫓겨났다.',
                        draw: [
                            { side: 'red', style: 'strike', path: [[48.15, 33.75], [47.85, 33.90], [47.68, 34.02]], name: '제2기병군' },
                            { clash: [47.66, 33.98], name: '니코폴 서쪽' },
                            { side: 'white', style: 'beaten', path: [[47.66, 33.95], [47.62, 34.55], [47.80, 35.05]] },
                        ],
                    },
                    {
                        date: '1920년 10월 말', text: '붉은 군대가 북타브리아로 밀고 들어가자 제2기병군도 드니프로강을 건너 남쪽으로 브란겔군을 쫓았다. 브란겔은 크림으로 물러났다. 남은 것은 페레코프다.',
                        draw: [{ side: 'red', style: 'strike', path: [[47.57, 34.39], [47.05, 34.45], [46.55, 34.10]], name: '북타브리아' }],
                    },
                ],
            },
        },
        beyond: [['옴스크', 54.98, 73.37], ['블라디보스토크', 43.12, 131.9], ['이르쿠츠크', 52.29, 104.3], ['무르만스크', 68.97, 33.08]],
        // The map key: the game layer's colours (holders by faction kind),
        // and history's control layer.
        legend: [['cw-key-held', '붉은 군대'], ['cw-key-lost k-white', '백군'], ['cw-key-lost k-interv', '간섭군'], ['cw-key-lost k-central', '독일·오스트리아'], ['cw-key-lost k-national', '폴란드·우크라이나']],
        historyLegend: [['is-red', '붉은 군대'], ['is-blue', '백군·간섭군'], ['is-amber', '독일·오스트리아'], ['is-gray', '독립국·인접국'], ['is-black', '마흐노']],
    };

    // The screen's words for this war's things (war/ui/game.js), and the
    // stats the HUD shows: warn below a value, a chart line in the
    // retrospect, command when the stat sets the command points.
    const ui = {
        aria: { calendar: '여덟 시기', stats: '공화국의 상황', army: '붉은 군대의 구성' },
        player: '붉은 군대', playerUnits: '붉은 부대', enemy: '백군', enemyAll: '백군·간섭군',
        unit: '사단', leader: '정치위원', food: '곡물', unrest: '봉기',
        hud: [
            { stat: 'peasants', label: '농민 지지', warnBelow: 35, warnNote: '봉기 위험', chart: 40 },
            { stat: 'workers', label: '노동자 지지', note: '동원에 영향', warnBelow: 40, chart: null },
            { stat: 'cohesion', label: '당 결속', warnBelow: 40, command: true, chart: 30, split: '분열: 정치위원 −1' },
        ],
        cardStats: { peasants: '농민', workers: '노동자', cohesion: '결속' },
        save: 'civil-war-v1-save',
    };

    // ── The campaign's rules (war/engine.js; schema in dev_docs/war-engine.md) ──

    // The engine's words that name this war's things.
    const texts = {
        leader: '정치위원',
        moved: '철도로 옮겨 온 사단 {n}',
        momentumPart: '적의 기세 +{n}',
        pursuitPart: '추격 −{n}',
        battleLost: '{title} 실패',
        battleQuick: '{title} ({quick}턴 안)',
        hunger: '곡물이 모자라 병사들이 굶었다. 다음 시기 탈영으로 사단이 준다.',
        momentumNote: '{front}: 더 잃을 도시가 없는데도 막지 못해, 적이 기세를 몰아 온다. 이 전선의 다음 싸움에서 압력 +{n}.',
        pursuitNote: '{front}: 무너진 적을 쫓는다. 이 전선의 다음 싸움에서 압력 −{n}.',
    };

    const WORKERS_UPKEEP = 2;
    const UPKEEP_NOTE = `굶주림과 멈춘 공장, 전선으로 떠난 노동자로 도시가 비어 간다. 노동자 지지 −${WORKERS_UPKEEP}.`;
    // Stats of the republic (0–100), and grain. Grain each season: 3, one
    // more per 15 peasant trust, what the policy chosen changes (the tax in
    // kind leaves the peasants most of what the requisition took), cards.
    // A sent division eats 1, one in reserve half. Under HUNGER (0.75)
    // supplied, soldiers desert next season (ceil((1 − supply) × 6)); a
    // division's share of strength falls to FED (0.5) when starving.
    const economy = {
        stats: { peasants: { start: 60 }, workers: { start: 60 }, cohesion: { start: 60 } },
        food: { start: 6, base: 3, per: ['peasants', 15], fed: 0.5, hunger: 0.75, desert: 6, reserveEats: 0.5 },
        policies: [
            { flag: 'razverstka', label: '식량 할당제', food: 7, each: { peasants: -3 }, unless: 'tax' },
            { flag: 'market', label: '시장 수매', food: 1, each: { peasants: 2 } },
            // Rules 5: grain bought on the market does not reach the city
            // rations; the bagmen do.
            { flag: 'market', label: '시장 수매', when: { rules: ['>=', 5] }, each: { workers: -2 } },
            { flag: 'tax', label: '현물세', food: -10, each: { peasants: 8 } },
        ],
        // Peasants and cohesion land before Petrograd's fall, workers after
        // (its −15 joins the season's changes).
        settleOrder: ['peasants', 'cohesion', 'cities', 'workers'],
        // Rules 5: what every season costs. The war empties the cities
        // (hunger, idle factories, the best workers gone to the front); a
        // working class that turns away splits the party (the oppositions
        // of 1919–1920).
        upkeep: [
            { when: { rules: ['>=', 5] }, label: '전쟁의 부담', each: { workers: -WORKERS_UPKEEP }, note: UPKEEP_NOTE },
            { when: { rules: ['>=', 5], stat: ['workers', '<', 45] }, label: '노동자 반대파', each: { cohesion: -3 }, note: '노동자 지지가 45 아래다. 공장에서 등을 돌린 노동자를 두고 당 안에 반대파가 선다. 당 결속 −3.' },
        ],
    };

    // Command each season follows the party's cohesion: a united party
    // gives orders that are carried out, a split one argues them away.
    const command = { stat: 'cohesion', tiers: [[70, 4], [40, 3], [20, 2], [0, 1]], note: '당 결속 {value}: 다음 시기 지휘력은 {n}이다.' };
    // A commissar's strength on his front; below cohesion 30 one fewer.
    const leaders = {
        strength: 1.5,
        fewer: [{ when: { stat: ['cohesion', '<', 30] }, n: 1, note: '당이 분열하고 있다. 다음 시기 정치위원이 하나 준다.' }],
    };
    // A division's quality: the military specialists make it better.
    // The military opposition's theses (rules 7): specialists as advisers only.
    const quality = { base: 0.8, mods: [{ when: { flag: 'experts', turnMin: 1 }, add: 0.25 }, { when: { all: [{ flag: 'experts' }, { flag: 'advisers' }] }, add: -0.15 }] };

    // The season's draft: the season's mobilize, then these.
    const mobilize = {
        min: 2, minLabel: '최소 동원',
        sources: [
            { stat: 'workers', base: 60, per: 10, label: '노동자 지지 {value}' },
            { from: 'deserted', label: '굶주린 병사의 탈영' },
            { fallen: 'northwest', n: -2, label: '페트로그라드 상실' },
            { from: 'unrest', label: '농민 봉기로 후방에 묶임' },
            { from: 'captured', label: '포로 편입' },
            { when: { flag: 'warsawTaken', turn: 'perekop' }, n: 4, label: '폴란드와 강화하고 돌아온 서부전선' },
        ],
    };
    // The countryside answers requisition with risings (green armies).
    const unrest = {
        levels: [{ when: { stat: ['peasants', '<', 20] }, n: 5 }, { when: { stat: ['peasants', '<', 35] }, n: 2 }],
        note: '농민 봉기가 번진다. 다음 시기 사단 {n}개가 후방에 묶인다.',
    };
    // A front's result against history's: STEP of margin per city, SLACK
    // short still holds, MOMENTUM pressure per city lost beyond the last,
    // PURSUIT pressure off per STEP beyond the city gained (CHASE at most),
    // TRANSFER the share a division moved by rail brings (rules 2).
    const outcome = { step: 3, slack: 1, momentum: 2, pursuit: 2, chase: 2, transfer: 0.5 };
    // Spoils (rules 3): grain per front the enemy broke on; prisoners, at
    // most MAX divisions a season.
    const spoils = { food: 2, max: 2 };
    // Each front gained or lost moves the workers; the season's fronts
    // behind history split the party, ahead of it unite it.
    // From rules 5 once a season by the net, and a gain less than a loss:
    // victories do not feed the cities. Being ahead no longer unites the
    // party.
    const frontMoves = { gained: { workers: 2, label: '전선 진격' }, lost: { workers: -2, label: '전선 후퇴' }, net: { when: { rules: ['>=', 5] }, gained: { workers: 1, label: '전선 진격' }, lost: { workers: -2, label: '전선 후퇴' } } };
    const verdict = { behind: { cohesion: -3, label: '역사보다 뒤처짐', note: '역사보다 밀린 책임을 두고 당 안에서 논쟁이 벌어졌다. 당 결속 −3.' }, ahead: { cohesion: 2, label: '역사보다 앞섬', when: { rules: ['<', 5] } } };

    // What choices and seasons add to a front, in the order the card lists
    // them; afterBattle ones come after the season's battle.
    const modifiers = [
        // Rules 6: sent to the Vistula (the konarmia card), it is not here.
        { fronts: ['south', 'crimea', 'southwest'], when: { flag: 'cavalry', not: { played: 'konarmia' } }, strength: 4, label: '제1기병군' },
        { front: 'east', when: { turn: 'kolchak', choice: 'flank' }, strength: -3, label: '측면 반격 준비' },
        { front: 'south', when: { turn: 'kolchak', flag: 'tsaritsynGroup' }, pressure: 3, label: '남부전선의 지휘 혼란' },
        { front: 'east', when: { turn: 'kolchak', choice: 'front' }, strength: 3, label: '정면 증원' },
        { front: 'east', when: { turn: 'directive', flag: 'flank' }, strength: 7, label: '프룬제의 측면 반격' },
        { front: 'south', when: { turn: 'orel', flag: 'turned' }, strength: 5, label: '동부에서 온 사단', afterBattle: true },
        { front: 'northwest', when: { turn: 'orel', choice: 'hold' }, strength: 4, label: '페트로그라드 사수', afterBattle: true },
        { front: 'northwest', when: { turn: 'orel', choice: 'yield' }, pressure: 6, label: '병력을 남쪽으로 뺌', afterBattle: true },
        { front: 'south', when: { turn: 'orel', choice: 'yield' }, strength: 4, label: '북서에서 온 병력', afterBattle: true },
        // Rules 6: with Warsaw taken, France's help to Wrangel dries up.
        { front: 'crimea', when: { flag: 'warsawTaken' }, pressure: -3, label: '바르샤바 함락: 고립된 브란겔' },
    ];
    // Kolchak regrouping beyond the Urals for two seasons when the pursuit
    // stopped there.
    const extraThreats = [
        { when: { flag: 'turned' }, front: 'east', pressure: { orel: 7, counter: 4 }, foes: ['kolchak'], text: '우랄에서 멈춘 사이 콜차크군이 다시 일어서 동쪽에서 밀려온다.', who: ['알렉산드르 콜차크', 'alexander-kolchak'] },
    ];
    // Stars after Perekop: the battle won; the lines at least as far as
    // history, season by season; the countryside not driven to revolt.
    const scoring = {
        stars: [
            { id: 'perekop', label: '페레코프 돌파', when: { won: true } },
            { id: 'history', label: '전선 합계가 역사 이상', when: { historyDiff: ['>=', 0] } },
            { id: 'peasants', label: '농민 지지 40 이상으로 종전', when: { stat: ['peasants', '>=', 40] } },
        ],
        won: { title: '크림으로 가는 길이 열렸다', text: '유럽 러시아의 백군 저항은 끝났다.' },
        stalled: { title: '브란겔이 겨울을 넘긴다', text: '페레코프를 넘지 못했다. 역사에서는 11월 11일 유슌 방어선이 뚫렸고, 브란겔은 크림을 떠났다.' },
    };
    const data = {
        id: 'civil-war', title: '붉은 전선 1918–1920', saveVersion: 1, factions, troops, fronts, frontOrder, startLines, cards, turns, battles, epilogue,
        map, ui, portraits,
        texts, economy, command, leaders, quality, mobilize, unrest, outcome, spoils, frontMoves, verdict, modifiers, extraThreats, scoring,
    };
    if (typeof module === 'object' && module.exports) module.exports = data;
    else (root.WarScenarios = root.WarScenarios || {})[data.id] = data;
})(typeof window !== 'undefined' ? window : globalThis);
