/* global module */
/* Scenario of 「조국 전선 1941–1945」: the Great Patriotic War from 22 June
   1941 to Berlin, played from the Stavka's seat. The war's content and its
   rules as data (the end of this file); the engine that runs them is
   war/engine.js (schema in dev_docs/war-engine.md). Dates, names and the
   "역사에서는" notes follow the CommuLingo event
   /commulingo/events/great-patriotic-war and its neighbours.

   Fronts are city chains from the inner city (the one the Red Army must
   not lose) outward to the enemy's capital; a front's line is how many of
   them the Red Army holds, and history[] is that number at the end of each
   season. A threat's pressure is the strength the Red Army needed to do as
   well as it did in history. The strategic unit (the engine's division) is
   an army here, the leader token a representative of the Stavka, the food
   the front's supply of shells and fuel. */
(function (root) {
    'use strict';

    const P = id => '/commulingo/people/' + id;
    const T = id => '/commulingo/terms/' + id;
    const E = id => '/commulingo/events/' + id;
    const D_ = id => '/commulingo/docs/' + id;
    // Where the speakers' words are written (scripts/content/gpw-game/sources.md):
    // memoirs and document collections on militera, Stalin's works vol. 15.
    const ML = page => 'https://militera.lib.ru/' + page + '.html';
    const ST = n => `https://www.marxists.org/russkij/stalin/t15/t15_${n}.htm`;

    // ── Fronts ──
    // Seasons (index): 0 1941.6–9, 1 1941.10–1942.1, 2 1942.2–4, 3 1942.5–7,
    // 4 1942.8–11, 5 1942.11–1943.3, 6 1943.4–8, 7 1943.9–12, 8 1944.1–5,
    // 9 1944.6–8, 10 1944.9–1945.1, 11 1945.2–5.
    const fronts = {
        north: {
            name: '레닌그라드 방면', short: '레닌그라드',
            cities: [['레닌그라드', 59.94, 30.31], ['노브고로드', 58.52, 31.27], ['프스코프', 57.82, 28.33], ['리가', 56.95, 24.11], ['쾨니히스베르크', 54.71, 20.51]],
            history: [1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 4, 5],
            holders: ['agn', 'agn', 'agn', 'agn', 'agn', 'agn', 'agn', 'agn', 'agn', 'agn', 'agn', 'agn'],
            // Leningrad lost: the Baltic Fleet, the city's works and its
            // people. It can be taken back.
            onLost: {
                at: 0, label: '레닌그라드 함락', effects: { industry: -10, staff: -10 },
                note: '레닌그라드가 떨어졌다. 발트함대와 키로프 공장, 250만 시민을 잃었다. 생산 −10, 지휘 체계 −10.',
                regained: '레닌그라드를 되찾았다.',
            },
        },
        west: {
            name: '모스크바 방면', short: '모스크바',
            cities: [['힘키', 55.89, 37.43], ['모자이스크', 55.50, 36.03], ['뱌지마', 55.21, 34.30], ['스몰렌스크', 54.78, 32.05], ['민스크', 53.90, 27.57], ['브레스트', 52.10, 23.70], ['바르샤바', 52.23, 21.01], ['베를린', 52.52, 13.40]],
            history: [3, 2, 2, 2, 2, 3, 3, 4, 4, 6, 7, 8],
            holders: ['agc', 'agc', 'agc', 'agc', 'agc', 'agc', 'agc', 'agc', 'agc', 'agc', 'agc', 'agc'],
            // Khimki, the capital's north-western gate, lost: Moscow falls.
            defeat: { at: 0, outcome: { kind: 'moscow', title: '모스크바가 떨어졌다', text: '독일군이 힘키를 지나 수도로 들어왔다. 모스크바의 철도 매듭이 끊겼고, 정부는 볼가강 너머로 물러났다. 전쟁은 여기서 끝나지 않았겠지만, 이 전쟁은 여기서 끝난다.' } },
        },
        southwest: {
            name: '키예프 방면', short: '키예프',
            cities: [['보로네시', 51.67, 39.20], ['하리코프', 49.99, 36.23], ['키예프', 50.45, 30.52], ['리보프', 49.84, 24.03], ['크라쿠프', 50.06, 19.94], ['프라하', 50.08, 14.44]],
            history: [2, 1, 1, 1, 1, 1, 2, 3, 3, 4, 5, 6],
            holders: ['ags', 'ags', 'ags', 'ags', 'ags', 'ags', 'ags', 'ags', 'ags', 'ags', 'agc', 'agc'],
        },
        south: {
            name: '스탈린그라드 방면', short: '스탈린그라드',
            cities: [['스탈린그라드', 48.71, 44.51], ['로스토프', 47.24, 39.71], ['스탈리노', 48.00, 37.80], ['오데사', 46.48, 30.73], ['부쿠레슈티', 44.43, 26.10], ['부다페스트', 47.50, 19.04], ['빈', 48.21, 16.37]],
            history: [4, 2, 2, 1, 1, 2, 2, 3, 4, 5, 5, 7],
            holders: ['romania', 'ags', 'ags', 'ags', 'ags', 'ags', 'ags', 'ags', 'romania', 'hungary', 'hungary', 'hungary'],
            // Stalingrad lost: the Volga cut, the oil of the Caucasus with it.
            onLost: {
                at: 0, label: '스탈린그라드 함락', effects: { industry: -12, staff: -8 },
                note: '스탈린그라드가 떨어졌다. 볼가강의 뱃길이 끊겨 캅카스의 석유가 올라오지 못한다. 생산 −12, 지휘 체계 −8.',
                regained: '스탈린그라드를 되찾았다. 볼가강이 다시 열렸다.',
            },
        },
        caucasus: {
            name: '캅카스 방면', short: '캅카스',
            cities: [['그로즈니', 43.32, 45.69], ['크라스노다르', 45.04, 38.98], ['세바스토폴', 44.62, 33.53]],
            history: [3, 3, 3, 2, 1, 2, 2, 2, 3, 3, 3, 3],
            holders: ['ags', 'ags', 'ags', 'ags', 'aga', 'aga', 'aga', 'aga', 'aga', 'aga', 'aga', 'aga'],
            onLost: {
                at: 0, label: '그로즈니 함락', effects: { industry: -10 },
                note: '그로즈니의 유전이 독일군 손에 들어갔다. 생산 −10.',
                regained: '그로즈니를 되찾았다.',
            },
        },
    };

    // ── The enemy ──
    const GERMAN = ['#000000', '#ffffff', '#dd0000'];
    const factions = {
        agn: {
            name: '북부 집단군', short: '북부 집단군', kind: 'axis', flag: GERMAN, sign: 'balkenkreuz',
            note: '레프 원수가 이끈 독일 북부 집단군. 발트 지역을 지나 레닌그라드로 향했고, 북쪽에서는 핀란드군이 옛 국경까지 내려왔다. 히틀러는 도시를 점령하지 말고 포위해 굶기라고 지시했다.',
            trait: { name: '포위와 굶주림', motion: 'march', when: { leader: false }, by: 2, rule: '스타프카 대표가 없으면 적의 힘 +2', text: '레닌그라드는 872일 동안 포위되었다. 봉쇄를 버티게 한 것은 라도가호의 얼음길과, 주코프·고보로프처럼 스타프카가 보낸 지휘관이 세운 방어였다.' },
            cries: { beaten: '루가강 뒤로 물러난다. 판터 방어선에서 다시 선다.', surging: '페테르부르크는 지도에서 지워진다!' },
            spoils: '포위선에 버려진 공성포',
        },
        agc: {
            name: '중부 집단군', short: '중부 집단군', kind: 'axis', flag: GERMAN, sign: 'balkenkreuz', link: T('blitzkrieg'),
            note: '독일군의 주력. 구데리안과 호트의 기갑 집단을 앞세워 민스크·스몰렌스크·뱌지마에서 붉은 군대를 차례로 포위했고, 1944년 여름 벨로루시에서 무너졌다.',
            trait: { name: '기갑 집단의 쐐기', motion: 'charge', when: { not: { card: 'reserve' } }, by: 2, rule: '스타프카 예비군이 이 전선에 없으면 적의 힘 +2', text: '기갑 집단은 전선의 약한 곳을 뚫고 뒤에서 만나 포위망을 닫았다. 뚫린 자리를 메울 예비군이 뒤에 서 있어야 쐐기가 멈춘다.' },
            cries: { beaten: '진창과 눈 속에 전차를 버리고 물러난다.', surging: '기갑 집단, 앞으로! 포위망을 닫아라!' },
            spoils: '눈 속에 버려진 전차와 화포',
        },
        ags: {
            name: '남부 집단군', short: '남부 집단군', kind: 'axis', flag: GERMAN, sign: 'balkenkreuz',
            note: '우크라이나와 돈바스, 볼가강으로 향한 독일 남부 집단군. 1942년 여름 A·B 집단군으로 나뉘었다가 스탈린그라드 뒤 만슈타인 아래에서 다시 섰다.',
            trait: { name: '엷은 곳을 치는 기갑', motion: 'charge', when: { alloc: ['<', 3] }, by: 2, rule: '이 방면에 보낸 군이 3개보다 적으면 적의 힘 +2', text: '남쪽의 초원은 넓고 기댈 강이 적다. 클라이스트와 만슈타인의 기갑은 엷게 늘어선 곳을 골라 뚫었다(1942년 5월 바르벤코보, 1943년 3월 하리코프). 군을 넉넉히 세워 두어야 한다.' },
            cries: { beaten: '드네프르강 뒤로! 다리를 폭파하라.', surging: '초원은 열려 있다. 볼가강까지 달린다!' },
            spoils: '초원에 버려진 연료 열차',
        },
        aga: {
            name: 'A 집단군', short: 'A 집단군', kind: 'axis', flag: GERMAN, sign: 'iron-cross', link: T('case-blue-fall-blau'),
            note: '1942년 여름 청색 작전에서 캅카스의 유전을 노리고 남쪽으로 내려간 독일 집단군. 1943년 초 포위를 피해 쿠반과 크림으로 물러났다.',
            trait: { name: '석유를 향한 진격', motion: 'march', when: { stat: ['industry', '<', 50] }, by: 2, rule: '생산이 50 아래면 적의 힘 +2', text: '독일은 마이코프와 그로즈니, 바쿠의 석유가 필요했다. 소련의 공장이 전차와 비행기를 대지 못하면 산맥의 고갯길을 막을 것이 없다.' },
            cries: { beaten: '쿠반 교두보로 물러난다.', surging: '엘브루스에 깃발을 꽂았다. 다음은 그로즈니다!' },
            spoils: '산길에 버려진 산악포',
        },
        romania: {
            name: '루마니아군', short: '루마니아군', kind: 'axis', flag: ['#002b7f', '#fcd116', '#ce1126'], sign: 'roundel', link: E('romania-1944-1948'),
            note: '안토네스쿠의 루마니아는 독일 다음으로 많은 병력을 동부전선에 보냈다. 오데사를 포위했고, 스탈린그라드에서 독일 제6군의 양옆을 맡았다가 무너졌다. 1944년 8월 23일 편을 바꿨다.',
            trait: { name: '약한 옆구리', motion: 'march', when: { leader: true }, by: -2, rule: '스타프카 대표가 있으면 적의 힘 −2', text: '루마니아군은 대전차포와 전차가 모자랐다. 스타프카는 독일군의 정면이 아니라 동맹군이 맡은 옆구리를 골라 쳤다(천왕성 작전).' },
            cries: { beaten: '전선이 무너졌다. 부쿠레슈티가 흔들린다.', surging: '오데사는 우리 것이다!' },
            spoils: '버려진 말과 수레, 야포',
        },
        hungary: {
            name: '독일·헝가리군', short: '독일·헝가리군', kind: 'axis', flag: ['#ce2939', '#ffffff', '#477050'], sign: 'roundel', link: E('hungary-1944-1945'),
            note: '1944년 가을 헝가리 평원과 부다페스트를 지킨 독일 남부 집단군과 헝가리군. 히틀러는 부다페스트를 요새로 선포하고 끝까지 지키게 했다.',
            trait: { name: '요새 부다페스트', motion: 'march', when: { stat: ['staff', '<', 50] }, by: 2, rule: '지휘 체계가 50 아래면 적의 힘 +2', text: '부다페스트 포위전은 108일 동안 이어졌다. 서두른 정면 공격은 시가전에 병력을 묻었다. 준비할 시간을 지휘관에게 주어야 한다.' },
            cries: { beaten: '부다 성이 무너진다. 빈으로!', surging: '벌러톤호에서 반격한다. 유전을 지켜라!' },
            spoils: '도나우강 가에 버려진 장갑차',
        },
    };

    // ── The Red Army's armies (the season's army) ──
    const troops = {
        border: { name: '국경 군관구의 군', link: T('red-army'), note: '1941년 6월 국경에 늘어서 있던 군. 편제와 장비를 바꾸는 중에 기습을 받았고, 여름이 가기 전에 대부분 포위망 속에서 사라졌다.' },
        reserve: { name: '예비 전선군의 군', link: T('stavka'), note: '내륙 군관구에서 급히 편성해 스몰렌스크와 모스크바 앞에 세운 군. 훈련도 장비도 모자랐지만 독일군이 계산하지 않은 병력이었다.' },
        militia: { name: '인민 의용군', link: T('destruction-battalions'), note: '모스크바와 레닌그라드의 공장·대학·관청에서 자원한 사람들로 만든 사단. 소총도 모자란 채 전선에 섰다.' },
        siberian: { name: '극동·시베리아의 사단', link: T('sorge-incident'), note: '일본이 남쪽으로 간다는 것이 분명해지자 극동에서 모스크바로 옮겨 온 사단. 겨울 장비와 훈련을 갖추고 있었다.' },
        rifle: { name: '제병 협동군', link: T('red-army'), note: '소총사단을 묶은 붉은 군대의 기본 야전군. 1942년부터 포병과 전차 여단이 붙어 차츰 두터워졌다.' },
        shock: { name: '충격군', link: T('deep-operation'), note: '적의 방어선을 뚫는 데 쓰려고 포병과 전차를 더 붙인 군. 제1충격군은 1941년 12월 모스크바 북쪽에서 반격을 열었다.' },
        guards: { name: '근위군', link: T('soviet-guards'), note: '전투에서 이름을 얻은 부대가 받은 근위 칭호의 군. 1941년 9월 옐냐에서 싸운 네 사단이 첫 근위사단이 되었다.' },
        tank: { name: '전차군', link: T('deep-operation'), note: '전차군단과 기계화군단만으로 짠 군. 1943년부터 뚫린 틈으로 들어가 적의 뒤 깊숙이 달렸다.' },
        air: { name: '항공군', link: T('red-army'), note: '1942년 5월부터 전선군마다 비행기를 하나의 항공군으로 묶었다. 1943년 쿠반과 쿠르스크 상공에서 제공권이 넘어왔다.' },
        polish: { name: '폴란드 제1군', link: E('poland-1944-1948'), note: '소련 땅에서 편성되어 붉은 군대와 함께 싸운 폴란드군. 1944년 여름 비스와강에 닿았고 베를린까지 갔다.' },
    };

    const frontOrder = ['north', 'west', 'southwest', 'south', 'caucasus'];
    const moscow = ['모스크바', 55.76, 37.62];
    const startLines = { north: 4, west: 6, southwest: 4, south: 4, caucasus: 3 };

    // ── Advisers' cards ──
    const cards = {
        reserve: {
            title: '스타프카 예비군', short: '예비군', onRail: true, advisor: ['보리스 샤포시니코프', 'boris-shaposhnikov'], cost: 1, target: 'front', bonus: 3,
            text: '최고사령부가 손에 쥔 예비군을 열차에 실어 위기의 전선으로 보낸다. 뚫린 자리를 메우고, 반격의 주먹이 된다.',
            note: '스타프카는 전쟁 내내 예비 전선군과 예비군을 따로 쥐고 있다가 결정적인 곳에 풀었다. 1941년 12월 모스크바, 1942년 11월 스탈린그라드, 1943년 7월 쿠르스크의 초원 전선군이 그랬다.',
            link: ['스타프카', T('stavka')],
        },
        militia: {
            title: '인민 의용군 소집', short: '의용군', advisor: ['알렉산드르 셰르바코프', 'alexander-shcherbakov'], cost: 1, divisions: 2, manpower: -5,
            text: '수도와 레닌그라드의 노동자·학생·사무원을 의용군 사단으로 묶어 전선에 세운다. 이번 시기 군 +2. 훈련받지 못한 사람들이 큰 값을 치른다.',
            note: '1941년 7월 모스크바에서만 열두 개 의용군 사단이 만들어졌다. 그 대부분이 10월 뱌지마 포위망에서 사라졌다.',
            link: ['섬멸대대', T('destruction-battalions')],
        },
        fareast: {
            title: '극동의 사단을 서쪽으로', short: '극동 사단', advisor: ['리하르트 조르게', 'sorge'], cost: 1, divisions: 2, flag: 'fareast',
            text: '도쿄의 조르게가 알렸다. 일본은 남쪽으로 간다. 극동에 묶어 둔 사단을 모스크바로 옮긴다. 이번 시기 군 +2.',
            note: '조르게는 1941년 9월 일본이 그해 소련을 치지 않는다고 보고했고, 10월 18일 체포되었다. 가을 동안 극동과 시베리아에서 여러 사단이 서쪽으로 옮겨 왔다.',
            link: ['조르게 사건', T('sorge-incident')],
        },
        guards: {
            title: '근위 칭호', short: '근위', advisor: ['게오르기 주코프', 'zhukov'], cost: 1, staff: 4, flag: 'guards',
            text: '잘 싸운 사단에 근위 칭호와 깃발을 준다. 물러서기만 하던 군대에 본보기가 생긴다. 지휘 체계 +4.',
            note: '1941년 9월 18일 국방인민위원 명령 308호로 옐냐에서 싸운 제100·127·153·161 소총사단이 제1–4 근위소총사단이 되었다.',
            link: ['소비에트 근위', T('soviet-guards')],
        },
        labour: {
            title: '후방의 총동원', short: '총동원', advisor: ['니콜라이 보즈네센스키', 'voznesensky'], cost: 1, industry: 5, manpower: -3,
            text: '여성과 청소년, 연금 생활자를 선반 앞에 세우고 하루 열한 시간 일하게 한다. 생산 +5. 그만큼 전선에 설 사람은 준다.',
            note: '1942년 2월 최고회의 간부회 정령으로 도시의 일할 수 있는 주민이 생산과 건설에 동원되었다. 1942년 말 군수 생산은 독일을 넘어섰다.',
            link: ['1941년 산업 소개', T('soviet-evacuation-1941')],
        },
        airarmy: {
            title: '항공군', short: '항공군', glyph: 'plane', advisor: ['알렉산드르 노비코프', 'alexander-novikov'], cost: 1, target: 'front', bonus: 2,
            text: '흩어져 있던 비행기를 항공군 하나로 묶어 한 전선의 하늘에 몬다. 그 전선의 우리 힘 +2.',
            note: '1942년 5월 공군 사령관 노비코프가 전선군마다 항공군을 만들었다. 스탈린그라드의 포위망은 하늘에서도 닫혔다.',
            link: ['붉은 군대', T('red-army')],
        },
        tankform: {
            title: '전차군 편성', short: '전차군 편성', advisor: ['파벨 로트미스트로프', 'pavel-rotmistrov'], cost: 1, divisions: -2, flag: 'tankArmies',
            text: '전차군단과 기계화군단을 보병에서 떼어 전차군으로 묶는다. 이번 시기 군 −2, 다음 시기부터 「전차군」 카드가 나온다.',
            note: '1943년 1월 28일 국가방위위원회가 새 편제의 전차군을 만들기로 했다. 봄까지 다섯 개 전차군이 섰다.',
            link: ['종심작전', T('deep-operation')],
        },
        tankarmy: {
            title: '전차군', short: '전차군', glyph: 'tank', advisor: ['파벨 리발코', 'pavel-rybalko'], cost: 0, target: 'front', bonus: 4, requires: 'tankArmies',
            historyAt: { kursk: 'southwest', dnieper: 'southwest', korsun: 'southwest', bagration: 'west', vistula: 'west', berlin: 'west' },
            text: '전차군을 한 전선의 돌파구에 넣는다. 그 전선의 우리 힘 +4.',
            note: '리발코의 제3근위전차군은 1943년 11월 류테시 교두보에서 나와 키예프를 뒤에서 끊었고, 1945년 4월 베를린 남쪽으로 들어갔다.',
            link: ['종심작전', T('deep-operation')],
        },
        partisans: {
            title: '레일 전쟁', short: '레일 전쟁', advisor: ['판텔레이몬 포노마렌코', 'panteleimon-ponomarenko'], cost: 1, calm: { fronts: ['west', 'southwest'], by: 2 },
            text: '점령지의 파르티잔이 한날한시에 철로를 끊는다. 이번과 다음 시기 모스크바·키예프 방면 적의 힘 −2.',
            note: '1943년 8월 3일 밤 파르티잔 중앙 본부의 지휘로 벨로루시와 우크라이나에서 철로 수만 곳이 끊겼다. 1944년 6월 바그라티온 작전 직전에도 그렇게 했다.',
            link: ['레일 전쟁', T('rail-war')],
        },
        pause: {
            title: '작전 휴지와 보충', short: '보충', advisor: ['알렉세이 안토노프', 'aleksei-antonov'], cost: 1, manpower: 4, food: -3,
            text: '한 방면의 공세를 멈추고 병력과 장비를 채운다. 인력 +4, 보급 −3.',
            note: '1944년 총참모부 제1차장 안토노프는 「열 번의 타격」을 차례로 짰다. 한 곳을 치는 동안 다른 곳은 쉬고 채웠다.',
            link: ['스타프카', T('stavka')],
        },
    };
    cards.lendlease = {
        title: '무기대여 물자', short: '무기대여', advisor: ['뱌체슬라프 몰로토프', 'molotov'], cost: 1, food: 3,
        text: '북극해의 수송선단과 이란 철도, 알래스카의 하늘길로 미국·영국의 트럭과 연료, 통조림이 들어온다. 보급 +3.',
        note: '1942년 6월 몰로토프가 워싱턴에서 상호 원조 협정을 맺었다. 전쟁 동안 소련은 트럭 40만 대와 항공 연료, 기관차, 식량을 받았다. 전차와 포는 대부분 소련 공장이 만들었다.',
        link: ['무기대여법', T('lend-lease')],
    };

    // ── The twelve seasons ──
    const turns = [
        {
            id: 'barbarossa', date: '1941년 6–9월', end: [1941, 9], title: '바르바로사',
            scene: {
                picture: 'barbarossa',
                lead: '1941년 6월 22일 새벽, 독일군 300만이 발트해에서 흑해까지 국경을 넘었다. 국경의 군은 포위망 속에서 사라지고, 민스크와 스몰렌스크가 차례로 떨어진다.',
                witness: { as: '최고사령부', text: '전투 중 계급장을 떼어 내고 후방으로 달아나거나 적에게 항복하는 지휘관과 정치일꾼은 악질 탈영병으로 보고, 그 가족은 … 체포한다.', src: ['최고사령부 명령 제270호, 1941년 8월 16일', ML('docs/da/nko_1941-1942/03')] },
            },
            mobilize: 10, commissars: 1, army: [['border', 6], ['reserve', 4]], battle: 'yelnya',
            brief: [
                '독일군은 세 갈래로 온다. 북부 집단군은 레닌그라드로, 중부 집단군은 민스크와 스몰렌스크를 지나 모스크바로, 남부 집단군은 키예프로 간다. 첫 석 주 동안 붉은 군대는 비행기 수천 대와 국경의 군 대부분을 잃었다.',
                '지금은 이길 수 없다. 얼마나 덜 잃고 시간을 버느냐의 싸움이다. 세 방면에 군을 나눠 보내 진격을 늦추고, 스몰렌스크 남동쪽 옐냐의 돌출부를 쳐서 모스크바로 가는 발판을 없애야 한다.',
            ],
            voices: [
                { who: ['뱌체슬라프 몰로토프', 'molotov'], at: 'moscow', text: '우리의 대의는 옳습니다. 적은 격파될 것입니다. 승리는 우리 것입니다.', src: ['몰로토프, 라디오 연설, 1941년 6월 22일', 'https://ru.wikisource.org/wiki/%D0%92%D1%8B%D1%81%D1%82%D1%83%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5_%D0%92._%D0%9C._%D0%9C%D0%BE%D0%BB%D0%BE%D1%82%D0%BE%D0%B2%D0%B0_%D0%BF%D0%BE_%D1%80%D0%B0%D0%B4%D0%B8%D0%BE_22_%D0%B8%D1%8E%D0%BD%D1%8F_1941_%D0%B3.'] },
                { by: 'agc', who: ['아돌프 히틀러', 'adolf-hitler'], at: 'west', text: '내 장군들은 전쟁 경제를 전혀 모른다.', src: ['구데리안, 『한 군인의 회상』(러시아어판), 1941년 8월 23일 회의', ML('memo/german/guderian/06')] },
                { who: ['이오시프 스탈린', 'stalin'], at: 'moscow', text: '동지 여러분! 시민 여러분! 형제자매 여러분! … 나의 벗들이여, 여러분께 호소합니다!', src: ['스탈린, 라디오 연설, 1941년 7월 3일', ST('07')] },
                { by: 'ags', at: 'southwest', text: '키예프의 러시아군은 물러나지 않는다. 구데리안이 남쪽으로 돌면 그 뒤가 닫힌다.' },
            ],
            threats: {
                north: { pressure: 3, foes: ['agn'], text: '북부 집단군이 발트 지역을 지나 루가강으로 온다. 9월이면 레닌그라드의 육로가 끊긴다.', who: ['빌헬름 리터 폰 레프', 'wilhelm-ritter-von-leeb'] },
                west: { pressure: 5, foes: ['agc'], text: '구데리안과 호트의 기갑 집단이 민스크에 이어 스몰렌스크에서 포위망을 닫는다.', who: ['하인츠 구데리안', 'heinz-guderian'] },
                southwest: { pressure: 2, foes: ['ags'], text: '남부 집단군이 키예프 남쪽에서 드네프르강을 건넜다. 북쪽에서 기갑 집단이 내려오면 키예프의 군은 포위된다.', who: ['미하일 키르포노스', 'mikhail-kirponos'] },
            },
            cards: ['reserve', 'militia', 'guards'],
            incident: {
                id: 'evacuation', title: '공장을 실어 낼 것인가', who: ['니콜라이 보즈네센스키', 'voznesensky'],
                text: '독일군이 오는 길에 나라의 군수 공장 대부분이 있다. 소개 위원회는 공장을 통째로 뜯어 우랄과 시베리아로 옮기자고 한다. 그러려면 전선으로 갈 열차를 공장에 내주어야 한다.',
                talk: [
                    { who: ['니콜라이 보즈네센스키', 'voznesensky'], text: '공장을 잃으면 내년에는 싸울 무기가 없다. 선반과 프레스를 화차에 싣고 노동자를 함께 태워 보내야 한다.' },
                    { who: ['세묜 티모셴코', 'timoshenko'], text: '지금 전선에는 사단을 실어 올 화차도 모자란다. 한 달 뒤에 올 전차보다 오늘 올 연대가 급하다.' },
                ],
                options: [
                    { id: 'evacuate', label: '공장을 동쪽으로 옮긴다', divisions: -1, flag: 'evacuated', effect: '역사대로 · 화차를 공장에 내준다 · 이번 시기 군 −1 · 1942년부터 생산이 되살아난다(시기마다 +5)' },
                    { id: 'trains', label: '열차를 전선에 먼저 준다', industry: -8, effect: '군은 줄지 않지만 공장이 적의 손에 떨어진다 · 생산 −8, 되살아나지 않는다' },
                ],
                history: 'evacuate',
                after: '6월 24일 소개 위원회가 섰다. 1941년 하반기에 1,523개 공장과 1,000만 명 넘는 사람이 화차 150만 량에 실려 우랄·시베리아·중앙아시아로 옮겨 갔다. 하리코프의 전차 공장은 니즈니타길에서, 레닌그라드의 키로프 공장은 첼랴빈스크에서 다시 돌았다.',
                links: [['1941년 산업 소개', T('soviet-evacuation-1941')], ['탱코그라드', T('tankograd')], ['니콜라이 보즈네센스키', P('voznesensky')]],
            },
            choice: {
                title: '키예프를 내줄 것인가', who: ['알렉산드르 바실렙스키', 'vasilevsky'],
                text: '중부 집단군의 기갑이 남쪽으로 돌았다. 이대로면 키예프의 남서전선군은 통째로 포위된다. 9월 초 총참모부의 샤포시니코프와 바실렙스키는 당장 드네프르강 뒤로 물리고 키예프를 내주자고 했다.',
                talk: [
                    { who: ['알렉산드르 바실렙스키', 'vasilevsky'], text: '남서전선군을 지금 드네프르강 너머로 물려야 합니다. 키예프는 내주어야 합니다.' },
                    { who: ['이오시프 스탈린', 'stalin'], text: '당신들도 부됸니처럼 가장 쉬운 길만 찾는군. 키예프는 내주지 않는다.' },
                    { who: ['세묜 부됸니', 'semyon-budyonny'], text: '포위가 눈앞이다. 물러날 허가를 달라. 늦으면 병력과 장비를 다 잃는다.' },
                ],
                options: [
                    { id: 'hold', label: '키예프를 지킨다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'withdraw', label: '드네프르강 뒤로 물린다', flag: 'kievSaved', manpower: 6, staff: 3, effect: '남서전선군을 살린다 · 인력 +6 · 지휘 체계 +3 · 다음 시기 군 +2 · 그러나 독일 기갑이 남쪽으로 돌지 않아 태풍이 일찍 온다(다음 시기 모스크바 방면 적의 힘 +4)' },
                ],
                history: 'hold',
                after: '7월 30일 주코프는 총참모장에서 예비 전선군 사령관으로 옮겨졌다. 그의 회고록은 키예프를 내주자고 했다가 밀려났다고 적는다. 9월 11일 스탈린은 키르포노스에게 허가 없이 키예프를 내주지 말라고 지시했고, 철수를 주장한 부됸니는 티모셴코로 바뀌었다. 13일 남서전선군 참모장 투피코프의 「파국」 보고는 「공황」이라는 꾸짖음을 들었다. 9월 15일 구데리안과 클라이스트의 기갑이 로흐비차에서 만나 포위망을 닫았다. 17일에야 철수가 허락되었지만 늦었다. 9월 19일 키예프가 떨어졌고, 사령관 키르포노스는 포위망 안에서 전사했다. 독일 쪽 집계로 포로 66만 5천 명이었다. 대신 중부 집단군의 모스크바 진격은 한 달 넘게 늦어졌다.',
                links: [['바르바로사 작전', T('operation-barbarossa')], ['미하일 키르포노스', P('mikhail-kirponos')], ['게오르기 주코프', P('zhukov')]],
            },
            after: '7월 16일 스몰렌스크가, 9월 19일 키예프가 떨어졌다. 9월 8일 실리셀부르크가 넘어가 레닌그라드의 육로가 끊겼다. 그러나 스몰렌스크 둘레의 두 달 싸움이 독일군의 시간표를 무너뜨렸고, 9월 6일 주코프의 예비 전선군이 옐냐를 되찾았다. 전쟁의 첫 승리였다.',
            links: [['대조국전쟁', E('great-patriotic-war')], ['바르바로사 작전', T('operation-barbarossa')], ['전격전', T('blitzkrieg')], ['레닌그라드 봉쇄', E('siege-of-leningrad')]],
        },
        {
            id: 'typhoon', date: '1941년 10월–1942년 1월', end: [1942, 1], title: '태풍',
            scene: {
                picture: 'moscow-defence',
                lead: '10월 2일 중부 집단군이 모스크바로 마지막 공세를 열었다. 뱌지마와 브랸스크에서 다섯 개 군이 포위되고, 수도 앞은 비었다.',
                witness: { as: '국가방위위원회', text: '1941년 10월 20일부터 모스크바시와 그 주변 지역에 계엄을 선포한다. … 질서를 어지럽히자고 선동하는 도발자, 첩자, 그 밖의 적 첩보원은 그 자리에서 총살한다.', src: ['국가방위위원회 결정 「모스크바 계엄에 관하여」, 1941년 10월 19일', ST(11)] },
            },
            mobilize: 10, commissars: 1, army: [['reserve', 5], ['militia', 2], ['siberian', 3]], battle: 'moscow',
            brief: [
                '뱌지마 포위망이 닫히자 모스크바로 가는 길에 남은 것은 사관생도와 의용군뿐이었다. 10월 10일 주코프가 서부전선군을 맡았다. 정부 기관은 쿠이비셰프로 옮겨 갔지만 스탈린은 모스크바에 남았다.',
                '모자이스크 방어선은 10월에 뚫린다. 중요한 것은 겨울이 오기 전에 수도를 지키고, 지친 적을 되밀어 그 선을 되찾는 일이다. 모스크바 방면에 군을 모으되, 레닌그라드와 로스토프도 비워 둘 수는 없다.',
            ],
            voices: [
                { who: ['게오르기 주코프', 'zhukov'], at: 'west', text: '전선의 부대는 내가 지휘한다! … 지금 선에서 방어하고 한 걸음도 물러서지 마라.', src: ['주코프가 로코솝스키에게 보낸 전보, 1941년 11월(로코솝스키, 『군인의 의무』)', ML('memo/russian/rokossovsky/06')] },
                { by: 'agc', who: ['하인츠 구데리안', 'heinz-guderian'], at: 'west', text: '모스크바 공세는 실패했다. 용감한 우리 부대의 모든 희생과 노력이 헛되었다.', src: ['구데리안, 『한 군인의 회상』(러시아어판), 1941년 12월을 회고', ML('memo/german/guderian/06')] },
                { who: ['이오시프 스탈린', 'stalin'], at: 'moscow', text: '위대한 해방의 사명이 여러분 몫이 되었습니다. 이 사명에 걸맞은 사람이 되십시오!', src: ['스탈린, 붉은 광장 열병식 연설, 1941년 11월 7일', ST(14)] },
                { by: 'agn', at: 'north', text: '티흐빈을 차지했다. 라도가호 뒤로 핀란드군과 손을 잡으면 레닌그라드는 굶어 죽는다.' },
            ],
            threats: {
                west: { pressure: 5, foes: ['agc'], text: '세 기갑 집단이 북쪽과 남쪽에서 모스크바를 감싸 온다. 12월 초 선봉은 수도에서 30킬로미터 앞에 있다.', who: ['하인츠 구데리안', 'heinz-guderian'] },
                north: { pressure: 2, foes: ['agn'], text: '북부 집단군이 티흐빈으로 나와 라도가호 동쪽의 마지막 철도를 끊으려 한다.', who: ['빌헬름 리터 폰 레프', 'wilhelm-ritter-von-leeb'] },
                south: { pressure: 3, foes: ['ags'], text: '남부 집단군이 돈바스를 지나 로스토프로 간다. 캅카스로 가는 문이다.', who: ['세묜 티모셴코', 'timoshenko'] },
            },
            cards: ['reserve', 'militia', 'fareast', 'guards', 'labour'],
            choice: {
                title: '예비 세 개 군을 언제 쓸 것인가', who: ['보리스 샤포시니코프', 'boris-shaposhnikov'],
                text: '11월 말, 스타프카는 모스크바 뒤에 새 군 셋(제1충격군·제20군·제10군)을 모았다. 전선은 날마다 밀리고, 로코솝스키는 한 개 연대라도 달라고 한다.',
                talk: [
                    { who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'], text: '제16군은 사단마다 수백 명밖에 남지 않았다. 이스트라 저수지 뒤로 물러나게 해 주든지, 예비를 달라.' },
                    { who: ['보리스 샤포시니코프', 'boris-shaposhnikov'], text: '적도 끝에 다다랐다. 예비를 조금씩 풀면 구멍만 메우다 끝난다. 적이 멈추는 날 한꺼번에 쳐야 한다.' },
                    { who: ['게오르기 주코프', 'zhukov'], text: '이스트라 뒤로 물러나는 것은 허락하지 않는다. 제16군은 지금 선에서 버텨라.' },
                ],
                options: [
                    { id: 'hoard', label: '반격의 날까지 쥐고 있는다', flag: 'reservesKept', effect: '역사대로 · 모스크바 전투에서 4턴에 예비 군이 반격에 나선다' },
                    { id: 'commit', label: '지금 방어선에 넣는다', effect: '이번 시기 모스크바 방면 우리 힘 +3 · 모스크바 전투에 예비 군이 오지 않는다' },
                ],
                history: 'hoard',
                after: '로코솝스키는 샤포시니코프의 승인까지 받아 이스트라 저수지 뒤로 물러나려 했지만 주코프가 명령을 취소했다. 독일군은 이스트라를 건너 솔네치노고르스크를 차지했다. 예비 군은 11월 말까지 전선 뒤에 숨어 있었다. 12월 5일 칼리닌 전선군, 6일 서부전선군이 반격에 나섰고, 제1충격군과 제20군이 모스크바 북쪽에서, 제10군이 남쪽에서 독일 기갑 집단의 옆구리를 쳤다. 중부 집단군은 100–250킬로미터를 밀려났다. 독일군이 이 전쟁에서 처음으로 크게 진 싸움이었다.',
                links: [['스타프카', T('stavka')], ['콘스탄틴 로코솝스키', P('konstantin-rokossovsky')], ['보리스 샤포시니코프', P('boris-shaposhnikov')]],
            },
            after: '10월 중순 모자이스크와 칼리닌이 떨어지고 모스크바에 계엄이 선포되었다. 11월 7일 붉은 광장의 열병식에 선 부대는 그대로 전선으로 갔다. 12월 반격으로 클린과 칼리닌을, 1월 20일 모자이스크를 되찾았다. 북쪽에서는 12월 9일 티흐빈을 되찾아 라도가호의 얼음길이 이어졌고, 남쪽에서는 11월 29일 로스토프를 되찾았다.',
            links: [['대조국전쟁', E('great-patriotic-war')], ['생명의 길', T('road-of-life')], ['조르게 사건', T('sorge-incident')], ['게오르기 주코프', P('zhukov')]],
        },
        {
            id: 'general', date: '1942년 2–4월', end: [1942, 4], title: '전면 공세',
            scene: {
                picture: 'general-offensive',
                lead: '모스크바 앞에서 독일군이 밀려나자 스탈린은 모든 전선에서 한꺼번에 치라고 명령했다. 눈 속의 공세는 봄까지 이어진다.',
            },
            mobilize: 11, commissars: 1, army: [['rifle', 7], ['shock', 3], ['guards', 1]],
            brief: [
                '1월 5일 스타프카 회의에서 스탈린은 레닌그라드에서 크림까지 모든 전선이 공세에 나서라고 했다. 주코프의 회고록에 따르면 주코프와 보즈네센스키는 물자가 모자라니 서부 방면에 힘을 모으자고 했다.',
                '겨울 공세는 르제프와 뱌지마, 레닌그라드 남쪽 류반, 하리코프 남쪽 바르벤코보에서 깊이 들어가 있다. 어느 한 곳이라도 끝을 보려면 힘을 모아야 한다. 이번 시기는 세 방면 모두 역사에서 도시를 얻지 못했다.',
            ],
            voices: [
                { who: ['이오시프 스탈린', 'stalin'], at: 'moscow', text: '독일군은 모스크바 패배로 갈팡질팡하고 겨울 준비도 제대로 못 했다. 공격해야 한다.', src: ['스탈린, 1942년 1월 5일 최고사령부 발언(전해지는 재구성본)', ST(15)] },
                { who: ['니콜라이 보즈네센스키', 'voznesensky'], at: 'moscow', text: '지금 우리에게는 모든 전선의 공세를 한꺼번에 댈 물자가 없습니다.' },
                { by: 'agc', who: ['발터 모델', 'walter-model'], at: 'west', text: '르제프는 내주지 않는다. 들어온 러시아군의 뒤를 끊는다.' },
                { by: 'agn', at: 'north', text: '볼호프강을 건너온 러시아 제2충격군은 늪 속의 좁은 통로 하나에 매달려 있다.' },
            ],
            threats: {
                west: { pressure: 3, foes: ['agc'], text: '모델의 제9군이 르제프 돌출부를 지키고, 뱌지마 뒤로 들어간 붉은 군대의 통로를 끊으려 한다.', who: ['발터 모델', 'walter-model'] },
                north: { pressure: 2, foes: ['agn'], text: '볼호프 전선군이 봉쇄를 풀려고 류반으로 들어갔지만, 북부 집단군이 그 뒤를 조인다.', who: ['키릴 메레츠코프', 'kirill-meretskov'] },
                southwest: { pressure: 2, foes: ['ags'], text: '바르벤코보의 돌출부는 하리코프를 남쪽에서 겨누지만, 양옆이 독일군에 열려 있다.', who: ['세묜 티모셴코', 'timoshenko'] },
            },
            cards: ['reserve', 'guards', 'labour'],
            choice: {
                title: '모든 전선에서, 아니면 한 곳에서', who: ['이오시프 스탈린', 'stalin'],
                text: '겨울 공세는 세 방면에서 깊이 들어갔지만 어디서도 끝을 보지 못했다. 병력과 포탄은 모든 전선군에 고루 나뉘고 있다.',
                talk: [
                    { who: ['이오시프 스탈린', 'stalin'], text: '공격해야 한다. 봄이 오기 전에 독일군이 예비를 다 써 버리게 만들어야 한다. 주공은 중부 집단군에 가한다.' },
                    { who: ['게오르기 주코프', 'zhukov'], text: '서부 방면은 이어 가야 합니다. 그러나 레닌그라드와 남서쪽은 포병 없이 적의 방어를 뚫지 못합니다. 병력만 잃습니다.' },
                    { who: ['니콜라이 보즈네센스키', 'voznesensky'], text: '소개한 공장은 이제 막 돌기 시작했습니다. 한 방면을 댈 포탄밖에 없습니다.' },
                ],
                options: [
                    { id: 'everywhere', label: '모든 전선에서 공세를 잇는다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'concentrate', label: '모스크바 방면 하나에 모은다', manpower: 5, staff: -3, effect: '이번 시기 모스크바 방면 우리 힘 +4, 레닌그라드·키예프 방면 −2 · 인력 +5 · 최고사령관의 뜻을 꺾은 값으로 지휘 체계 −3' },
                ],
                history: 'everywhere',
                after: '공세는 4월 진창이 올 때까지 모든 전선에서 이어졌다. 르제프–뱌지마 작전에서만 사상자가 77만 명이었고, 뱌지마 뒤로 들어간 제33군의 예프레모프는 포위 속에서 전사했다. 류반의 제2충격군은 여름에 포위되어 사라지고 사령관 블라소프는 독일군에 넘어갔다. 독일 중부 집단군은 무너지지 않았다.',
                links: [['르제프', T('rzhev')], ['바르벤코보 돌출부', T('barvenkovo-salient')], ['니콜라이 보즈네센스키', P('voznesensky')]],
            },
            after: '봄 진창으로 전선이 멈췄다. 붉은 군대는 모스크바의 위협을 걷어 냈지만 예비를 다 썼고, 바르벤코보와 류반에 양옆이 열린 돌출부를 남겼다. 독일군은 남쪽에서 여름 공세를 준비한다.',
            links: [['르제프', T('rzhev')], ['스타프카', T('stavka')], ['키릴 메레츠코프', P('kirill-meretskov')]],
        },
        {
            id: 'blau', date: '1942년 5–7월', end: [1942, 7], title: '청색 작전',
            scene: {
                picture: 'blau',
                lead: '스타프카는 독일의 여름 주공이 다시 모스크바로 온다고 믿었다. 그러나 히틀러가 고른 곳은 남쪽, 볼가강과 캅카스의 석유였다.',
            },
            mobilize: 11, commissars: 1, army: [['rifle', 8], ['guards', 2], ['tank', 1]],
            brief: [
                '5월 케르치에서 크림 전선군이 무너졌고, 하리코프를 치던 남서전선군은 바르벤코보에서 포위되었다. 6월 28일 독일군이 청색 작전을 열어 보로네시로, 7월에는 돈강을 따라 스탈린그라드와 캅카스로 쏟아져 내려온다.',
                '초원에는 기댈 방어선이 없다. 보로네시를 잃으면 모스크바와 남쪽을 잇는 철도가 끊기고, 로스토프를 잃으면 캅카스의 문이 열린다. 세 방면이 모두 급하다.',
            ],
            voices: [
                { by: 'ags', at: 'south', text: '돈강 굽이의 러시아군이 물러난다. 초원을 달려 볼가강으로 간다.' },
                { who: ['알렉산드르 바실렙스키', 'vasilevsky'], at: 'moscow', text: '바르벤코보의 공세를 당장 멈추고 남쪽 옆구리를 막아야 합니다.' },
                { by: 'ags', who: ['에리히 폰 만슈타인', 'erich-von-manstein'], at: 'caucasus', text: '세바스토폴의 요새는 열차포와 공병이 하나씩 부순다.' },
                { who: ['이오시프 스탈린', 'stalin'], at: 'moscow', text: '더 물러서는 것은 우리 자신을 망치고 우리 조국까지 망치는 일이다.', src: ['국방인민위원 명령 제227호, 1942년 7월 28일', ST(23)] },
            ],
            threats: {
                southwest: { pressure: 4, foes: ['ags'], text: '호트의 제4기갑군이 쿠르스크 동쪽에서 보로네시로 달린다.', who: ['헤르만 호트', 'hermann-hoth'] },
                south: { pressure: 5, foes: ['ags'], text: '파울루스의 제6군과 제1기갑군이 돈바스를 지나 로스토프와 돈강 굽이로 온다.', who: ['프리드리히 파울루스', 'friedrich-paulus'] },
                caucasus: { pressure: 3, foes: ['ags'], text: '만슈타인의 제11군이 케르치를 쓸어 내고 세바스토폴을 조인다.', who: ['에리히 폰 만슈타인', 'erich-von-manstein'] },
            },
            cards: ['reserve', 'airarmy', 'lendlease', 'labour'],
            choice: {
                title: '하리코프를 칠 것인가', who: ['세묜 티모셴코', 'timoshenko'],
                text: '3월 스타프카는 여름 계획을 다퉜다. 총참모장 샤포시니코프는 예비가 찰 때까지 전략적 방어를 하자고 했다. 남서 방면 사령관 티모셴코와 군사위원 흐루쇼프는 바르벤코보 돌출부에서 하리코프를 치겠다고 했다.',
                talk: [
                    { who: ['보리스 샤포시니코프', 'boris-shaposhnikov'], text: '여름까지는 방어하며 예비를 모아야 합니다. 지금 큰 공세를 벌일 병력이 없습니다.' },
                    { who: ['세묜 티모셴코', 'timoshenko'], text: '남서 방면군은 먼저 칠 수 있고 쳐야 합니다. 적의 여름 계획을 흩뜨려 놓겠습니다.' },
                    { who: ['이오시프 스탈린', 'stalin'], text: '방어만 하며 기다릴 수는 없다. 전략적으로 방어하면서 크림과 하리코프 같은 몇 곳에서는 부분 공세를 벌인다.' },
                ],
                options: [
                    { id: 'attack', label: '하리코프 공세를 승인한다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'defend', label: '여름까지 전략적 방어를 한다', manpower: 6, staff: -4, effect: '바르벤코보의 세 개 군을 잃지 않는다 · 이번 시기 스탈린그라드 방면 적의 힘 −3 · 인력 +6 · 최고사령관의 뜻을 꺾은 값으로 지휘 체계 −4' },
                ],
                history: 'attack',
                after: '5월 12일 공세가 시작되었다. 17일 클라이스트의 기갑이 돌출부의 남쪽 밑동을 쳤다. 총참모장 대리 바실렙스키가 여러 번 공세를 멈추자고 했지만 스탈린은 남서 방면의 정반대 보고를 근거로 물리쳤다. 18일 저녁에는 흐루쇼프의 중지 요청도 거절되었다. 19일에야 티모셴코가 공세를 멈췄지만 늦었다. 28일까지 27만 명을 잃었고, 남쪽 전선에 큰 구멍이 났다. 한 달 뒤 청색 작전이 그 구멍으로 들어왔다.',
                links: [['제2차 하리코프 전투', T('second-battle-of-kharkov')], ['바르벤코보 돌출부', T('barvenkovo-salient')], ['청색 작전', T('case-blue-fall-blau')], ['세묜 티모셴코', P('timoshenko')]],
            },
            after: '7월 4일 세바스토폴이 250일의 포위 끝에 떨어졌다. 독일군은 보로네시의 서쪽 절반을 차지했지만 돈강 동쪽은 넘지 못했다. 7월 23일 로스토프가 싸움다운 싸움 없이 떨어졌다. 닷새 뒤 스탈린이 명령 제227호에 서명했다.',
            links: [['청색 작전', T('case-blue-fall-blau')], ['총통 지령 제41호', D_('fuehrer-directive-41-1942')], ['명령 제227호', T('order-no-227')]],
        },
        {
            id: 'stalingrad', date: '1942년 8–11월', end: [1942, 11], title: '한 걸음도 물러서지 마라',
            scene: {
                picture: 'order227',
                lead: '8월 23일 독일 제6군이 스탈린그라드 북쪽에서 볼가강에 닿았다. 그날 하루의 폭격으로 도시가 불탔다. 싸움은 공장과 지하실로 들어간다.',
                witness: { who: ['이오시프 스탈린', 'stalin'], text: '이제 물러서는 것을 끝낼 때다. 한 걸음도 물러서지 마라! 이것이 이제 우리의 으뜸가는 구호여야 한다.', src: ['국방인민위원 명령 제227호, 1942년 7월 28일', D_('nko-order-227-1942') + '#order-227-1942'] },
            },
            mobilize: 12, commissars: 2, army: [['rifle', 8], ['guards', 3], ['tank', 1]], battle: 'stalingrad',
            brief: [
                '독일군은 둘로 갈라졌다. B 집단군은 스탈린그라드로, A 집단군은 캅카스의 유전으로 간다. 추이코프의 제62군이 볼가강을 등지고 도시의 폐허에서 버틴다. 증원은 밤마다 배로 강을 건너온다.',
                '도시에서 버티는 동안 스타프카는 독일군 양옆의 루마니아군을 칠 예비를 모으고 있다. 스탈린그라드 방면에서 도시를 지키고, 캅카스에서는 그로즈니로 가는 길을 막아야 한다. 르제프의 중부 집단군도 묶어 두어야 한다.',
            ],
            voices: [
                { who: ['바실리 추이코프', 'chuikov'], at: 'south', text: '맹세코 거기서 떠나지 않겠습니다. 우리는 도시를 지켜 내거나 거기서 죽을 것입니다.', src: ['추이코프, 『세기의 전투』, 1942년 9월 12일', ML('memo/russian/chuykov/04')] },
                { by: 'ags', who: ['아돌프 히틀러', 'adolf-hitler'], at: 'south', text: '우연히도 그 도시는 스탈린 자신의 이름을 달고 있지요. … 이제 아주 작은 자리 몇 군데만 남았습니다.', src: ['히틀러, 뮌헨 연설, 1942년 11월 8일(『브레머 차이퉁』 11월 9일 자)', 'https://brema.suub.uni-bremen.de/bremzeit/download/pdf/2265158'] },
                { by: 'aga', at: 'caucasus', text: '산악병이 엘브루스에 깃발을 꽂았다. 그러나 연료가 닿지 않는다.' },
                { who: ['알렉산드르 바실렙스키', 'vasilevsky'], at: 'moscow', text: '여기서 하나의 결론이 떠올랐다. 반격을 조직해 펼치는 것이다.', src: ['바실렙스키, 『일생의 사업』, 1942년 9월 중순을 회고', ML('memo/russian/vasilevsky/15')] },
            ],
            threats: {
                south: { pressure: 6, foes: ['ags'], text: '파울루스의 제6군이 도시를 구역마다 깎아 들어온다. 11월이면 추이코프에게 남은 것은 강가의 띠 몇 줄이다.', who: ['프리드리히 파울루스', 'friedrich-paulus'] },
                caucasus: { pressure: 4, foes: ['aga'], text: 'A 집단군이 마이코프를 차지하고 테레크강을 건너 그로즈니로 간다.', who: ['라브렌티 베리야', 'beria'] },
                west: { pressure: 4, foes: ['agc'], text: '르제프 돌출부의 모델이 모스크바를 겨눈 채 버틴다. 여기서 사단을 빼 남쪽으로 보내지 못하게 해야 한다.', who: ['발터 모델', 'walter-model'] },
            },
            cards: ['reserve', 'airarmy', 'lendlease', 'labour'],
            incident: {
                id: 'order227', title: '명령 제227호', who: ['이오시프 스탈린', 'stalin'],
                text: '로스토프가 명령 없이 버려졌다. 스탈린은 허가 없는 후퇴를 금지하고, 전선 뒤에 차단분견대를, 죄지은 지휘관과 병사에게는 형벌 부대를 두는 명령을 준비했다.',
                talk: [
                    { who: ['이오시프 스탈린', 'stalin'], text: '땅이 넓으니 더 물러나도 된다는 말은 틀렸다. 더 물러서면 우리도 조국도 망한다.' },
                    { who: ['알렉산드르 바실렙스키', 'vasilevsky'], text: '명령만으로 전선이 서지는 않습니다. 물러난 것은 겁이 아니라 열린 옆구리 때문이었습니다. 예비와 방어선이 먼저입니다.' },
                ],
                options: [
                    { id: 'issue', label: '명령을 내린다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'withhold', label: '후퇴의 판단을 전선 지휘관에게 맡긴다', manpower: 4, staff: 3, pressure: { south: 2, caucasus: 2 }, effect: '포위당하기 전에 물러날 수 있다 · 인력 +4 · 지휘 체계 +3 · 그러나 버티는 선이 밀린다(이번 시기 스탈린그라드·캅카스 방면 적의 힘 +2)' },
                ],
                history: 'issue',
                after: '7월 28일 명령 제227호가 모든 중대에서 낭독되었다. 전쟁 동안 형벌 부대를 거친 사람은 42만 명이 넘는다. 명령은 군의 분위기를 바꿨다고도, 이미 서 있던 방어를 가혹하게만 했다고도 평가된다.',
                links: [['명령 제227호', T('order-no-227')], ['차단분견대', T('blocking-detachments')], ['명령 원문', D_('nko-order-227-1942')]],
            },
            choice: {
                title: '도시에 쏟을 것인가, 모을 것인가', who: ['알렉산드르 바실렙스키', 'vasilevsky'],
                text: '9월, 도시 북쪽 코틀루반에서 세 개 군이 독일군의 볼가 통로를 치고 또 쳤지만 뚫지 못했다. 스탈린은 추이코프를 구하려면 계속 쳐야 한다고 한다. 주코프와 바실렙스키는 다른 안을 가져왔다.',
                talk: [
                    { who: ['이오시프 스탈린', 'stalin'], text: '스탈린그라드는 오늘 내일 떨어질 수 있다. 북쪽의 군이 당장 적을 쳐서 도시를 도와야 한다.' },
                    { who: ['게오르기 주코프', 'zhukov'], text: '같은 곳을 같은 병력으로 쳐서는 뚫지 못합니다. 도시는 최소한으로 버티게 하고, 예비를 모아 루마니아군이 선 양옆에서 크게 감싸야 합니다.' },
                    { who: ['알렉산드르 바실렙스키', 'vasilevsky'], text: '반격은 아무에게도 알리지 않고 준비해야 합니다. 그동안 추이코프가 도시에서 적을 묶어 지치게 해야 합니다.' },
                ],
                options: [
                    { id: 'hoard', label: '예비를 모아 양옆을 친다', flag: 'uranusReady', effect: '역사대로 · 다음 시기 천왕성 작전에 제5전차군이 나온다' },
                    { id: 'feed', label: '예비를 도시 북쪽 반격에 넣는다', effect: '이번 시기 스탈린그라드 방면 우리 힘 +3 · 다음 시기 포위 작전의 주먹이 준다(스탈린그라드 방면 우리 힘 −4, 제5전차군 없음)' },
                ],
                history: 'hoard',
                after: '바실렙스키에 따르면 반격은 9월 중순 스탈린과 주코프, 바실렙스키가 의견을 나눈 끝에 정해졌고, 국가방위위원회 위원에게도 알리지 않는 비밀로 부쳐졌다. 두 달 동안 100만 명과 전차 900대가 밤에만 움직여 돈강과 볼가강의 교두보에 모였다. 독일 정보부는 11월까지 큰 공세가 없다고 판단했다.',
                links: [['천왕성 작전', T('operation-uranus')], ['코틀루반 작전', T('kotluban-operations')], ['포옹 전술', T('hugging-the-enemy')], ['알렉산드르 바실렙스키', P('vasilevsky')]],
            },
            after: '9월 14일 독일군이 중앙 나루까지 왔다. 사령부 장교들이 나루를 지키는 사이, 그날 밤부터 로딤체프의 제13근위사단이 포화 속에 볼가강을 건너 시내 중심과 역, 마마이 언덕으로 들어갔다. 마마이 언덕과 공장들은 주인이 여러 번 바뀌었다. 11월 중순 제62군은 강가의 좁은 띠 셋에 갇혔지만 버텼다. 캅카스에서는 독일군이 오르조니키제 앞에서 멈췄다.',
            links: [['스탈린그라드 전투', E('stalingrad')], ['포옹 전술', T('hugging-the-enemy')], ['바실리 추이코프', P('chuikov')], ['알렉산드르 로딤체프', P('alexander-rodimtsev')]],
        },
        {
            id: 'uranus', date: '1942년 11월–1943년 3월', end: [1943, 3], title: '천왕성',
            scene: {
                picture: 'uranus',
                lead: '11월 19일 아침, 돈강의 안개 속에서 포 3,500문이 루마니아군 진지를 덮었다. 나흘 뒤 두 전선군의 전차가 칼라치에서 만난다. 포위망 안에 독일군 30만이 있다.',
                witness: { who: ['이오시프 스탈린', 'stalin'], text: '스탈린그라드에서 포위한 적군을 성공적으로 섬멸한 데 대해 당신과 돈강전선 부대에 축하를 보낸다.', src: ['스탈린, 보로노프·로코솝스키에게 보낸 축하, 1943년 2월 2일', ST(34)] },
            },
            mobilize: 13, commissars: 2, army: [['rifle', 7], ['guards', 3], ['shock', 1], ['tank', 2]], battle: 'uranus',
            brief: [
                '천왕성 작전의 목표는 스탈린그라드의 독일 제6군을 통째로 가두는 것이다. 돈강의 남서전선군과 도시 남쪽의 스탈린그라드 전선군이 루마니아군을 뚫고 칼라치에서 만나야 한다.',
                '포위망이 닫히면 만슈타인이 밖에서 뚫으러 오고, 캅카스의 A 집단군은 로스토프가 막히기 전에 빠져나가려 한다. 이긴 뒤에는 어디까지 쫓을지도 정해야 한다.',
            ],
            voices: [
                { who: ['알렉산드르 바실렙스키', 'vasilevsky'], at: 'south', text: '남서전선과 스탈린그라드전선이 돈강전선 오른쪽 날개의 도움을 받아 포위의 고리를 닫았다.', src: ['바실렙스키, 『일생의 사업』, 1942년 11월 23일을 회고', ML('memo/russian/vasilevsky/16')] },
                { by: 'ags', who: ['프리드리히 파울루스', 'friedrich-paulus'], at: 'south', text: '고리 안에 갇혔다. 남서쪽으로 뚫고 나가게 해 달라고 총통에게 청한다.' },
                { who: ['이오시프 스탈린', 'stalin'], at: 'southwest', text: '「토성」 작전을 바꿔야 한다. … 주공을 남쪽이 아니라 남동쪽 니즈니 아스타호프 쪽으로 돌려 모로좁스키로 나가는 것이다.', src: ['스탈린, 보로노프·바투틴·골리코프에게 보낸 지령, 1942년 12월 13일(바실렙스키 인용)', ML('memo/russian/vasilevsky/16')] },
                { by: 'ags', who: ['에리히 폰 만슈타인', 'erich-von-manstein'], at: 'southwest', text: '러시아군의 선봉은 드네프르강까지 늘어졌다. 이제 옆에서 자른다.' },
            ],
            threats: {
                south: { pressure: 6, foes: ['romania', 'ags'], text: '제6군의 양옆은 루마니아 제3군과 제4군이 맡고 있다. 포위 뒤에는 호트의 기갑이 코텔니코보에서 구하러 온다.', who: ['프리드리히 파울루스', 'friedrich-paulus'] },
                southwest: { pressure: 5, foes: ['ags'], text: '보로네시 전선군이 돈강의 이탈리아·헝가리군을 무너뜨리고 하리코프로 간다. 만슈타인이 반격할 기갑을 모은다.', who: ['에리히 폰 만슈타인', 'erich-von-manstein'] },
                caucasus: { pressure: 4, foes: ['aga'], text: 'A 집단군이 캅카스에서 물러나 쿠반과 타만반도에 교두보를 친다.', who: ['이반 튤레네프', 'ivan-tyulenev'] },
            },
            cards: ['reserve', 'tankform', 'airarmy', 'lendlease', 'labour'],
            incident: {
                id: 'guards2', title: '제2근위군을 어디로', who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'],
                text: '12월 12일 호트의 기갑이 포위망을 뚫으러 코텔니코보에서 올라온다. 스타프카의 가장 좋은 예비인 말리놉스키의 제2근위군은 포위망을 끝내려고 로코솝스키에게 가는 길이었다.',
                talk: [
                    { who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'], text: '제2근위군으로 지금 포위망을 끝내야 한다. 파울루스가 없어지면 만슈타인은 구할 군대가 없다.' },
                    { who: ['알렉산드르 바실렙스키', 'vasilevsky'], text: '호트는 미시코바강에 왔다. 포위망까지 40킬로미터다. 제2근위군을 그 앞에 세우지 않으면 고리가 뚫린다.' },
                ],
                options: [
                    { id: 'block', label: '만슈타인의 구원군 앞에 세운다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'ring', label: '포위망을 먼저 끝낸다', manpower: 3, pressure: { south: 3 }, effect: '포위전이 일찍 끝나 병력을 아낀다 · 인력 +3 · 그러나 구원군이 고리에 닿는다(이번 시기 스탈린그라드 방면 적의 힘 +3)' },
                ],
                history: 'block',
                after: '바실렙스키가 제2근위군을 남쪽으로 돌리자고 하자 스탈린은 처음에 거세게 반대했고, 로코솝스키도 끈질기게 말렸다. 스탈린은 13일 새벽에야 승인했다. 제2근위군은 눈보라 속을 걸어 미시코바강에 섰고, 12월 24일 호트를 되밀었다. 같은 때 「토성」을 줄인 「작은 토성」 작전이 돈강의 이탈리아 제8군을 무너뜨려 만슈타인은 구원을 접었다. 포위망을 끝내는 고리 작전은 1월 10일에야 시작되었고, 2월 2일 마지막 독일군이 항복했다. 포로 9만 1천 명, 원수 파울루스도 그 안에 있었다.',
                links: [['고리 작전', T('operation-ring')], ['로디온 말리놉스키', P('malinovsky')], ['항복 최후통첩', D_('nko-order-227-1942') + '#paulus-ultimatum-1943']],
            },
            choice: {
                title: '드네프르강까지 쫓을 것인가', who: ['니콜라이 바투틴', 'nikolai-vatutin'],
                text: '2월, 독일 남쪽 전선은 무너진 것처럼 보인다. 하리코프가 눈앞이고 정찰은 독일군이 드네프르강으로 물러난다고 한다. 그러나 붉은 군대의 전차군단은 전차가 수십 대씩만 남았고 보급 열차는 300킬로미터 뒤에 있다.',
                talk: [
                    { who: ['니콜라이 바투틴', 'nikolai-vatutin'], text: '적은 도망치고 있다. 봄 진창이 오기 전에 드네프르강의 나루를 차지해야 한다.' },
                    { who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'], text: '병사들은 석 달을 쉬지 않고 싸웠다. 적이 물러나는 것인지 모이는 것인지 우리는 모른다.' },
                ],
                options: [
                    { id: 'pursue', label: '드네프르강까지 쫓는다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'halt', label: '도네츠강에서 멈추고 채운다', flag: 'haltedDonets', manpower: 4, effect: '늘어진 선봉이 잘리지 않는다 · 이번 시기 키예프 방면 우리 힘 +4 · 인력 +4 · 그러나 물러나는 적을 놓친다(스탈린그라드·캅카스 방면 우리 힘 −2)' },
                ],
                history: 'pursue',
                after: '2월 16일 하리코프를 되찾았다. 그러나 2월 19일 만슈타인이 늘어진 선봉의 옆구리를 쳤다. 포포프의 기동 집단이 무너지고, 3월 15일 하리코프를, 18일 벨고로드를 다시 잃었다. 전선은 쿠르스크 둘레에 큰 돌출부를 남긴 채 봄 진창에 멈췄다.',
                links: [['천왕성 작전', T('operation-uranus')], ['에리히 폰 만슈타인', P('erich-von-manstein')], ['니콜라이 바투틴', P('nikolai-vatutin')]],
            },
            after: '11월 23일 포위망이 닫혔고, 2월 2일 스탈린그라드의 독일군이 항복했다. 2월 14일 로스토프, 2월 12일 크라스노다르를 되찾았고, 3월에는 르제프와 뱌지마에서 독일군이 스스로 물러났다. 1월 18일에는 레닌그라드 봉쇄에 좁은 육로가 뚫렸다. 하리코프만은 얻었다가 다시 잃었다.',
            links: [['스탈린그라드 전투', E('stalingrad')], ['천왕성 작전', T('operation-uranus')], ['고리 작전', T('operation-ring')], ['프리드리히 파울루스', P('friedrich-paulus')]],
        },
        {
            id: 'kursk', date: '1943년 4–8월', end: [1943, 8], title: '쿠르스크',
            scene: {
                picture: 'kursk',
                lead: '쿠르스크 둘레의 돌출부를 두고 두 군대가 석 달을 준비했다. 독일군은 새 전차 티거와 판터를 기다렸고, 붉은 군대는 여덟 겹의 방어선을 팠다.',
            },
            mobilize: 13, commissars: 2, army: [['rifle', 7], ['guards', 4], ['tank', 2]], battle: 'kursk',
            brief: [
                '독일군은 돌출부의 북쪽 밑동 오룔과 남쪽 밑동 벨고로드에서 한꺼번에 쳐서 쿠르스크에서 만나려 한다(성채 작전). 스타프카는 그 계획을 안다. 문제는 먼저 칠 것이냐, 받아 낸 뒤 칠 것이냐다.',
                '남쪽 면의 바투틴 앞에는 만슈타인의 기갑 군단 셋이 선다. 받아 내면 그 뒤에 오룔과 하리코프로 가는 반격이 기다린다. 키예프 방면이 주전장이고, 모스크바 방면은 오룔을, 스탈린그라드 방면은 미우스강을 친다.',
            ],
            voices: [
                { who: ['게오르기 주코프', 'zhukov'], at: 'moscow', text: '우리 방어선에서 적을 지치게 하고 전차를 부순 다음, 새 예비대를 넣어 총공세로 적 주력을 끝장내는 편이 낫습니다.', src: ['주코프가 스탈린에게 보낸 보고, 1943년 4월 8일(바실렙스키 인용)', ML('memo/russian/vasilevsky/18')] },
                { by: 'ags', who: ['아돌프 히틀러', 'adolf-hitler'], at: 'southwest', text: '쿠르스크의 승리는 세계에 봉화처럼 비쳐야 한다.', src: ['히틀러, 작전명령 제6호 「성채」, 1943년 4월 15일(『티롤러 타게스차이퉁』 인용)', 'https://www.tt.com/artikel/14537837/hitlers-letzte-offensive-im-osten'] },
                { who: ['니콜라이 바투틴', 'nikolai-vatutin'], at: 'southwest', text: '이러다 잠만 자다 때를 놓칩니다. … 참호 파기는 그만두고 우리가 먼저 시작합시다.', src: ['바실렙스키, 『일생의 사업』, 1943년 6월 무렵을 회고', ML('memo/russian/vasilevsky/18')] },
                { by: 'agc', who: ['발터 모델', 'walter-model'], at: 'west', text: '러시아군은 우리를 기다리고 있다. 포니리의 지뢰밭에서 하루에 몇 킬로미터밖에 나가지 못한다.' },
            ],
            threats: {
                southwest: { pressure: 6, foes: ['ags'], text: '호트의 제4기갑군과 켐프 분견군이 벨고로드에서 오보얀과 프로호롭카로 온다.', who: ['헤르만 호트', 'hermann-hoth'] },
                west: { pressure: 6, foes: ['agc'], text: '모델의 제9군이 오룔에서 내려온다. 받아 낸 뒤에는 오룔 돌출부를 세 방향에서 친다(쿠투조프 작전).', who: ['발터 모델', 'walter-model'] },
                south: { pressure: 4, foes: ['ags'], text: '미우스강의 독일 방어선은 돈바스를 가린다. 여기를 치면 만슈타인이 기갑을 쿠르스크에서 빼야 한다.', who: ['표도르 톨부힌', 'fyodor-tolbukhin'] },
            },
            cards: ['reserve', 'tankform', 'tankarmy', 'airarmy', 'lendlease', 'partisans'],
            choice: {
                title: '먼저 칠 것인가, 기다릴 것인가', who: ['니콜라이 바투틴', 'nikolai-vatutin'],
                text: '4월 8일 주코프는 돌출부에서 방어로 적의 전차를 부순 뒤 반격하자고 보고했다. 그러나 5월이 가고 6월이 가도 독일군은 오지 않는다. 보로네시 전선군의 바투틴은 기다리다 여름을 다 보낸다며 먼저 치자고 한다.',
                talk: [
                    { who: ['니콜라이 바투틴', 'nikolai-vatutin'], text: '적은 오지 않습니다. 우리가 벨고로드와 하리코프의 적을 먼저 쳐야 합니다. 가을이 오면 늦습니다.' },
                    { who: ['게오르기 주코프', 'zhukov'], text: '적의 전차는 우리 전차보다 포가 길다. 지뢰밭과 대전차포 앞으로 불러들여 부숴야 한다. 기다려야 한다.' },
                    { who: ['이오시프 스탈린', 'stalin'], text: '우리 군대가 독일 전차의 타격을 버텨 낼 수 있겠소? 1941년에도 1942년에도 버티지 못했소.' },
                ],
                options: [
                    { id: 'defend', label: '방어로 받아 낸 뒤 반격한다', effect: '역사대로 · 쿠르스크 전투를 치른다' },
                    { id: 'preempt', label: '먼저 공세에 나선다', staff: 2, manpower: -5, pressure: { southwest: 4 }, effect: '모아 둔 독일 기갑에 정면으로 부딪힌다 · 이번 시기 키예프 방면 적의 힘 +4 · 인력 −5 · 지휘 체계 +2 · 쿠르스크 전투 없음' },
                ],
                history: 'defend',
                after: '7월 5일 새벽, 독일군의 공격 시각을 안 붉은 군대가 먼저 포격을 퍼부었다. 북쪽의 모델은 일주일에 12킬로미터를 나가고 멈췄다. 남쪽에서는 친위 기갑 군단이 35킬로미터를 뚫었지만 7월 12일 프로호롭카에서 로트미스트로프의 제5근위전차군과 부딪혀 멈췄다. 그날 오룔을 향한 쿠투조프 작전이, 8월 3일 하리코프를 향한 루먄체프 작전이 시작되었다.',
                links: [['성채 작전', T('operation-citadel')], ['프로호롭카 전투', T('battle-of-prokhorovka')], ['쿠르스크 전투', E('battle-of-kursk')], ['니콜라이 바투틴', P('nikolai-vatutin')]],
            },
            after: '8월 5일 오룔과 벨고로드를 되찾았다. 그날 밤 모스크바에서 전쟁의 첫 축포가 울렸다. 8월 23일 하리코프를 되찾았다. 독일군은 다시는 동부전선에서 전략적 공세에 나서지 못했다.',
            links: [['쿠르스크 전투', E('battle-of-kursk')], ['성채 작전', T('operation-citadel')], ['콘체르트 작전', T('operation-concert')], ['파벨 로트미스트로프', P('pavel-rotmistrov')]],
        },
        {
            id: 'dnieper', date: '1943년 9–12월', end: [1943, 12], title: '드네프르강',
            scene: {
                picture: 'dnieper',
                lead: '독일군은 드네프르강 뒤로 물러나며 마을과 다리를 태운다. 높은 오른쪽 둑에 「동부 방벽」이 선다. 다섯 전선군이 700킬로미터 너비로 강을 향해 달린다.',
                witness: { as: '최고사령부', text: '스몰렌스크와 그 아래의 드네프르강처럼, 또는 건너기 어렵기가 드네프르에 맞먹는 강을 건넌 데 대해서는 … 부대 지휘관들을 소련 영웅 칭호에 추천하라.', src: ['최고사령부 지령 제30187호, 1943년 9월 9일', 'https://ru.wikisource.org/wiki/%D0%A1%D0%B1%D0%BE%D1%80%D0%BD%D0%B8%D0%BA_%D0%B1%D0%BE%D0%B5%D0%B2%D1%8B%D1%85_%D0%B4%D0%BE%D0%BA%D1%83%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2/05/09'] },
            },
            mobilize: 14, commissars: 2, army: [['rifle', 7], ['guards', 4], ['tank', 3]],
            brief: [
                '드네프르강은 유럽에서 세 번째로 큰 강이다. 9월 9일 스타프카는 강을 건넌 부대의 지휘관을 소비에트연방영웅 칭호에 추천하라고 지시했다. 병사들은 나룻배와 뗏목, 문짝과 드럼통으로 건넌다.',
                '강을 건너면 키예프와 스몰렌스크, 돈바스가 걸려 있다. 세 방면이 모두 전진하는 시기다. 뒤처지는 전선은 그만큼 덜 나아간다.',
            ],
            voices: [
                { who: ['니콜라이 바투틴', 'nikolai-vatutin'], at: 'southwest', text: '부크린에서는 뚫지 못한다. 스타프카의 명령대로 전차군을 몰래 북쪽 류테시로 옮긴다.' },
                { by: 'ags', who: ['에리히 폰 만슈타인', 'erich-von-manstein'], at: 'southwest', text: '드네프르강 뒤에서 버틸 사단이 없다. 강은 방벽이 아니라 지도 위의 선일 뿐이다.' },
                { who: ['이반 코네프', 'ivan-konev'], at: 'south', text: '초원 전선군은 행군하던 그대로 강을 건넌다. 손에 잡히는 것은 다 물에 띄워라.' },
                { by: 'agc', at: 'west', text: '스몰렌스크를 비운다. 판터 방어선으로 물러난다.' },
            ],
            threats: {
                southwest: { pressure: 9, foes: ['ags'], text: '키예프 앞의 부크린 교두보는 가파른 골짜기에 갇혔다. 북쪽 류테시의 작은 교두보가 남은 길이다.', who: ['에리히 폰 만슈타인', 'erich-von-manstein'] },
                west: { pressure: 9, foes: ['agc'], text: '서부전선군과 칼리닌 전선군이 스몰렌스크로 간다(수보로프 작전).', who: ['바실리 소콜롭스키', 'vasily-sokolovsky'] },
                south: { pressure: 7, foes: ['ags'], text: '남부전선군이 미우스강을 뚫고 돈바스로, 다시 몰로치나야강과 자포로제로 간다.', who: ['표도르 톨부힌', 'fyodor-tolbukhin'] },
            },
            cards: ['reserve', 'tankform', 'tankarmy', 'airarmy', 'lendlease', 'partisans', 'pause'],
            choice: {
                title: '행군하던 그대로 건널 것인가', who: ['이반 코네프', 'ivan-konev'],
                text: '선봉은 강에 닿았지만 가교 장비와 중포는 며칠 뒤에 있다. 지금 건너면 맨몸의 보병이 높은 둑의 기관총 앞에 선다. 기다리면 독일군이 둑에 참호를 판다.',
                talk: [
                    { who: ['이반 코네프', 'ivan-konev'], text: '적은 아직 둑에 다 서지 못했다. 손에 잡히는 것으로 지금 건너야 한다. 하루가 늦으면 사단 하나가 더 든다.' },
                    { who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'], text: '포병 없이 건넌 교두보는 독일 전차가 쓸어 버린다. 가교와 포탄이 올 때까지 기다려 한 번에 건너야 한다.' },
                ],
                options: [
                    { id: 'march', label: '행군하던 그대로 건넌다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'wait', label: '가교와 포병을 기다린다', manpower: 5, pressure: { southwest: 3, south: 3 }, effect: '도하의 손실을 줄인다 · 인력 +5 · 그러나 동부 방벽이 선다(이번 시기 키예프·스탈린그라드 방면 적의 힘 +3)' },
                ],
                history: 'march',
                after: '9월 22일부터 일주일 사이 붉은 군대는 강 오른쪽 둑에 교두보 스물세 곳을 잡았다. 드네프르 도하로 2,438명이 소비에트연방영웅이 되었다. 키예프 남쪽 부크린의 주공이 10월 내내 막히자 스타프카는 10월 25일 주력을 북쪽 류테시로 옮기라고 명령했다. 리발코의 전차군이 몰래 강을 두 번 건너 북쪽으로 갔고, 11월 6일 혁명 기념일 전날 키예프를 되찾았다. 드네프르 전투의 사상자는 100만 명이 넘는다.',
                links: [['소비에트연방영웅', T('hero-of-the-soviet-union')], ['파벨 리발코', P('pavel-rybalko')], ['이반 코네프', P('ivan-konev')]],
            },
            after: '9월 8일 스탈리노, 9월 25일 스몰렌스크, 11월 6일 키예프를 되찾았다. 11월 28일 테헤란에서 스탈린과 루스벨트, 처칠이 처음 만났고, 서방은 1944년 5월 프랑스에 상륙하겠다고 약속했다.',
            links: [['테헤란 회담', T('tehran-conference')], ['제2전선과 노르망디 상륙', E('second-front-normandy')], ['레일 전쟁', T('rail-war')]],
        },
        {
            id: 'korsun', date: '1944년 1–5월', end: [1944, 5], title: '봉쇄가 풀리다',
            scene: {
                picture: 'leningrad',
                lead: '1944년 1월 27일 레닌그라드에서 축포 스물네 발이 울렸다. 872일의 봉쇄가 끝났다. 남쪽에서는 우크라이나의 진창 속에서 전차군이 국경으로 간다.',
                witness: { who: ['레오니트 고보로프', 'leonid-govorov'], text: '레닌그라드 시민 여러분! 용감하고 꿋꿋한 레닌그라드 사람들이여! 여러분은 레닌그라드전선 부대와 함께 우리 고향 도시를 지켜 냈습니다.', src: ['레닌그라드 전선군 군사평의회 명령, 1944년 1월 27일(『렌타.ru』 인용)', 'https://lenta.ru/articles/2024/01/27/leningrad1944/'] },
            },
            mobilize: 14, commissars: 2, army: [['rifle', 7], ['guards', 4], ['tank', 3]],
            brief: [
                '1944년 스타프카는 한 곳씩 차례로 친다. 1월 레닌그라드와 노브고로드, 2월 코르순의 포위망, 3–4월 드네스트르강과 오데사, 5월 크림이다. 적이 예비를 한 곳으로 옮기면 다른 곳을 친다.',
                '네 방면이 모두 움직인다. 군이 모자라니 어느 타격에 힘을 실을지 골라야 한다. 여름의 주공을 어디에 둘지도 이번 시기에 정한다.',
            ],
            voices: [
                { who: ['레오니트 고보로프', 'leonid-govorov'], at: 'north', text: '싸움 끝에 역사적 과제가 풀렸다. 레닌그라드는 적의 봉쇄와 야만적인 포격에서 완전히 벗어났다.', src: ['레닌그라드 전선군 군사평의회 명령, 1944년 1월 27일(『렌타.ru』 인용)', 'https://lenta.ru/articles/2024/01/27/leningrad1944/'] },
                { by: 'agn', at: 'north', text: '레닌그라드 포위선을 버린다. 나르바와 프스코프의 판터 방어선으로!' },
                { who: ['이오시프 스탈린', 'stalin'], at: 'southwest', text: '그건 당신 판단으로 한 거요? 그건 전선 경계선 너머인데. … 아주 잘했소.', src: ['코네프, 『전선 사령관의 수기』, 1944년 2월 12일 통화', ML('memo/russian/konev/04')] },
                { by: 'aga', at: 'caucasus', text: '크림은 요새다. 세바스토폴을 끝까지 지키라는 총통의 명령이다.' },
            ],
            threats: {
                north: { pressure: 6, foes: ['agn'], text: '북부 집단군이 2년 넘게 판 포위선에 앉아 있다. 레닌그라드와 볼호프 두 전선군이 양쪽에서 친다.', who: ['레오니트 고보로프', 'leonid-govorov'] },
                southwest: { pressure: 5, foes: ['ags'], text: '드네프르강 가의 마지막 독일군이 코르순 돌출부에 남아 있다. 그 뒤에는 만슈타인의 기갑이 있다.', who: ['에리히 폰 만슈타인', 'erich-von-manstein'] },
                south: { pressure: 7, foes: ['ags', 'romania'], text: '진창이 된 우크라이나 남쪽을 지나 니콜라예프와 오데사로, 드네스트르강으로 간다.', who: ['로디온 말리놉스키', 'malinovsky'] },
                caucasus: { pressure: 4, foes: ['aga'], text: '독일 제17군이 페레코프와 시바시, 케르치 뒤의 크림에 갇혀 있다.', who: ['표도르 톨부힌', 'fyodor-tolbukhin'] },
            },
            cards: ['reserve', 'tankform', 'tankarmy', 'airarmy', 'lendlease', 'partisans', 'pause'],
            incident: {
                id: 'deportation', title: '체첸인과 잉구시인을 추방할 것인가', who: ['라브렌티 베리야', 'beria'],
                text: '내무인민위원 베리야가 보고한다. 독일 점령기에 협력자와 무장 집단이 있었다는 이유로 체첸인과 잉구시인 전체를 카자흐스탄과 키르기스로 옮기자는 것이다. 작전에는 내무군 10만 명과 화차 1만 4천 량이 든다.',
                talk: [
                    { who: ['라브렌티 베리야', 'beria'], text: '산악의 비적을 뿌리 뽑으려면 주민 전체를 옮겨야 한다. 준비는 끝났다. 여드레면 된다.' },
                    { as: '체첸-잉구시 자치공화국의 당 일꾼', text: '우리 공화국에서 붉은 군대에 간 사람이 수만이다. 죄는 죄지은 자에게 물어야지, 민족 전체에 물을 수는 없다.' },
                ],
                options: [
                    { id: 'deport', label: '추방을 승인한다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'refuse', label: '추방을 물리친다', divisions: 1, staff: -4, effect: '내무군과 화차가 전선에 남는다 · 이번 시기 군 +1 · 내무인민위원부와 부딪혀 지휘 체계 −4' },
                ],
                history: 'deport',
                after: '1944년 2월 23일부터 여드레 동안 체첸인과 잉구시인 약 50만 명이 화차에 실려 중앙아시아로 추방되었다. 전선에서 싸우던 병사들도 군에서 내보내져 뒤따랐다. 5월에는 크림 타타르인 19만 명이 같은 길을 갔다. 가는 길과 첫 몇 해에 수만 명이 죽었다. 1956–57년 이들의 명예가 회복되었고, 1989년 소련 최고회의는 추방을 불법이자 범죄로 선언했다.',
                links: [['라브렌티 베리야', P('beria')], ['굴라크', T('gulag')]],
            },
            choice: {
                title: '여름의 주공은 어디로', who: ['알렉세이 안토노프', 'aleksei-antonov'],
                text: '봄 공세로 붉은 군대는 우크라이나에서 국경을 넘었다. 전차군 여섯 가운데 다섯이 남쪽에 있고, 독일군도 기갑을 남쪽에 모았다. 북쪽에는 모스크바를 아직도 겨눈 「벨로루시 발코니」가 남아 있다.',
                talk: [
                    { who: ['알렉세이 안토노프', 'aleksei-antonov'], text: '적은 우리가 남쪽에서 리보프와 루마니아로 계속 간다고 믿습니다. 그 믿음을 그대로 두고, 벨로루시의 중부 집단군을 쳐야 합니다.' },
                    { who: ['이반 코네프', 'ivan-konev'], text: '남쪽에는 전차군과 보급이 이미 와 있다. 리보프를 지나 비스와강으로 가는 길이 가장 짧다.' },
                ],
                options: [
                    { id: 'belarus', label: '벨로루시에서 친다', flag: 'belarus', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'ukraine', label: '남쪽에서 계속 친다', flag: 'southMain', effect: '다음 시기 키예프 방면 우리 힘 +3 · 그러나 독일 기갑이 기다리는 곳이고, 중부 집단군이 온전히 남는다(다음 시기 모스크바 방면 적의 힘 +5)' },
                ],
                history: 'belarus',
                after: '스타프카는 벨로루시를 골랐다. 전차군이 남쪽에 그대로 있는 것처럼 무선과 가짜 진지로 꾸미고, 병력은 밤에만 옮겼다. 독일군은 기갑 사단의 대부분을 남쪽 북우크라이나 집단군에 둔 채 6월 22일을 맞았다.',
                links: [['바그라티온 작전', T('operation-bagration')], ['알렉세이 안토노프', P('aleksei-antonov')]],
            },
            after: '1월 20일 노브고로드를 되찾고 27일 레닌그라드의 봉쇄를 풀었다. 2월 코르순에서 독일군 두 개 군단을 포위했고, 포위된 적이 뚫고 나오려 하자 2월 12일 스탈린은 포위망 지휘를 코네프에게 맡겼다. 2월 29일 바투틴이 우크라이나 민족주의 무장대의 총에 맞아 4월에 죽었다. 4월 10일 오데사, 5월 9일 세바스토폴을 되찾았다.',
            links: [['레닌그라드 봉쇄', E('siege-of-leningrad')], ['생명의 길', T('road-of-life')], ['레오니트 고보로프', P('leonid-govorov')], ['니콜라이 바투틴', P('nikolai-vatutin')]],
        },
        {
            id: 'bagration', date: '1944년 6–8월', end: [1944, 8], title: '바그라티온',
            scene: {
                picture: 'bagration',
                lead: '침공 3년째 되는 날인 1944년 6월 22일, 네 전선군이 벨로루시의 중부 집단군을 쳤다. 두 주 만에 독일군 스물여덟 개 사단이 사라진다.',
            },
            mobilize: 15, commissars: 3, army: [['rifle', 7], ['guards', 4], ['tank', 3], ['polish', 1]], battle: 'bagration',
            brief: [
                '바그라티온 작전은 비텝스크와 보브루이스크에서 양쪽 날개를 꺾고 민스크 동쪽에서 중부 집단군을 가두려 한다. 늪과 숲의 땅이라 독일군은 전차가 올 수 없다고 믿었다.',
                '벨로루시가 열리면 리보프와 루마니아에서도 잇달아 친다. 7월 말이면 선봉이 비스와강과 바르샤바 앞에 닿는다. 모스크바 방면이 주전장이다.',
            ],
            voices: [
                { who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'], at: 'west', text: '게다가 두 공격 모두 주공이어야 했다. … 폴레시예의 늪지에서는 다른 길이 없었다.', src: ['로코솝스키, 『군인의 의무』, 1944년 5월을 회고', ML('memo/russian/rokossovsky/18')] },
                { by: 'agc', at: 'west', text: '비텝스크와 보브루이스크는 「요새」다. 총통은 한 걸음도 물러서지 말라고 한다.' },
                { who: ['이반 코네프', 'ivan-konev'], at: 'southwest', text: '브로디의 고리를 닫았다. 리보프로 간다.' },
                { by: 'romania', who: ['이온 안토네스쿠', 'ion-antonescu'], at: 'south', text: '전선이 무너졌다. 국왕이 나를 궁으로 불렀다.' },
            ],
            threats: {
                west: { pressure: 10, foes: ['agc'], text: '중부 집단군은 기갑을 남쪽에 빼앗긴 채 「요새」로 지정된 도시들에 묶여 있다.', who: ['발터 모델', 'walter-model'] },
                southwest: { pressure: 8, foes: ['ags'], text: '독일 기갑의 대부분이 리보프 앞에서 붉은 군대의 주공을 기다린다.', who: ['이반 코네프', 'ivan-konev'] },
                south: { pressure: 6, foes: ['romania', 'ags'], text: '야시와 키시뇨프 사이 독일 제6군의 양옆을 또다시 루마니아군이 맡고 있다.', who: ['이온 안토네스쿠', 'ion-antonescu'] },
            },
            cards: ['reserve', 'tankform', 'tankarmy', 'airarmy', 'lendlease', 'partisans', 'pause'],
            incident: {
                id: 'warsaw', title: '바르샤바가 일어났다', who: ['타데우시 부르코모로프스키', 'tadeusz-bor-komorowski'],
                text: '8월 1일, 런던 망명정부를 따르는 폴란드 국내군이 바르샤바에서 봉기했다. 붉은 군대가 들어오기 전에 수도를 제 손으로 풀어 놓으려는 것이다. 로코솝스키의 선봉은 비스와강 건너 프라가 앞에 있지만 600킬로미터를 달려와 지쳤고, 독일 기갑 사단 다섯이 반격하고 있다.',
                talk: [
                    { who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'], text: '600킬로미터를 달려와 보급도 병력도 바닥났다. 프라가 앞에서는 독일 기갑이 반격한다. 지금 바르샤바를 해방할 힘은 없다.' },
                    { who: ['윈스턴 처칠', 'winston-churchill'], text: '폴란드인이 독일군과 싸우고 있다. 무기를 떨어뜨릴 비행기가 소련 비행장에 내리게 해 달라.' },
                    { who: ['이오시프 스탈린', 'stalin'], text: '봉기는 우리와 상의 없이 벌인 모험이다. 소련 사령부는 그 책임을 질 수 없다.' },
                ],
                options: [
                    { id: 'halt', label: '비스와강에서 멈춘다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'storm', label: '지친 채로 바르샤바로 밀고 간다', manpower: -6, pressure: { south: 2 }, effect: '이번 시기 모스크바 방면 우리 힘 +3 · 인력 −6 · 발칸으로 갈 힘이 준다(이번 시기 스탈린그라드 방면 적의 힘 +2)' },
                ],
                history: 'halt',
                after: '로코솝스키의 회고에 따르면 스탈린은 바르샤바를 해방할 수 있느냐고 물었고, 안 된다는 답을 듣자 봉기한 이들에게 할 수 있는 도움을 주라고 했다. 붉은 군대는 9월 14일에야 프라가를 차지했고, 폴란드 제1군이 강을 건넜다가 밀려났다. 스탈린은 9월 중순까지 서방 비행기의 소련 비행장 착륙을 막았다. 봉기는 63일 만인 10월 2일 항복했다. 20만 명 가까이 죽고 독일군은 도시를 폭파했다. 멈춘 것이 지쳐서였는지 망명정부의 군대가 쓰러지기를 기다린 것인지는 지금도 다투어진다.',
                links: [['바르샤바 봉기', E('warsaw-uprising')], ['봉기를 둘러싼 외교 문서', D_('warsaw-uprising-soviet-documents-1944')], ['루블린 위원회', T('lublin-committee')], ['폴란드 망명정부', T('polish-government-in-exile')]],
            },
            choice: {
                title: '보브루이스크는 한 곳에서, 두 곳에서', who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'],
                text: '5월 22–23일 스타프카 회의. 제1벨로루시 전선군의 로코솝스키는 보브루이스크를 북쪽 로가초프와 남쪽 늪지대 두 곳에서 같은 힘으로 치겠다고 했다. 주공은 하나여야 한다는 것이 교범이었다.',
                talk: [
                    { who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'], text: '로가초프 쪽은 적이 기다리는 곳이다. 남쪽 늪으로 전차군단을 넣으면 적은 예비를 어디로 보낼지 모른다. 두 곳에서 쳐야 한다.' },
                    { who: ['이오시프 스탈린', 'stalin'], text: '주공은 하나여야 하오. 드네프르강의 로가초프 교두보에서 치시오.' },
                ],
                options: [
                    { id: 'two', label: '두 곳에서 친다', flag: 'twoBlows', effect: '역사대로 · 바그라티온 전투에 남쪽 늪지대의 타격 집단이 나온다' },
                    { id: 'one', label: '로가초프 한 곳에 모은다', effect: '교범대로 · 이번 시기 모스크바 방면 우리 힘 −2 · 바그라티온 전투에 남쪽 타격 집단이 없다' },
                ],
                history: 'two',
                after: '로코솝스키의 회고에 따르면 스탈린과 그 대리들은 주공을 로가초프 하나로 하라고 고집했고, 그는 두 번이나 옆방에 나가 다시 생각해 보라는 말을 들었다. 그래도 뜻을 굽히지 않자 스탈린은 「전선 사령관이 이렇게 고집하는 걸 보면 공세 준비를 꼼꼼히 생각했다는 것」이라며 받아들였다. 이 장면은 그의 회고에만 있다. 같은 회의를 적은 시테멘코는 다툼을 쓰지 않았고, 주코프는 두 주공이 회의 전에 이미 합의되었다고 썼다. 6월 24일 남쪽 집단은 통나무 길로 늪을 건너 첫날 20킬로미터를 뚫었고, 27일 보브루이스크에서 독일군 4만 명을 가뒀다.',
                links: [['바그라티온 작전', T('operation-bagration')], ['종심작전', T('deep-operation')], ['콘스탄틴 로코솝스키', P('konstantin-rokossovsky')]],
            },
            after: '7월 3일 민스크를 되찾았고, 동쪽 숲에 독일군 10만 명이 갇혔다. 17일 포로 5만 7천 명이 모스크바 거리를 걸었다. 7월 27일 리보프, 28일 브레스트를 되찾았고, 8월 20일 야시–키시뇨프 작전이 시작되자 23일 루마니아가 편을 바꿨다. 8월 31일 붉은 군대가 부쿠레슈티에 들어갔다.',
            links: [['바그라티온 작전', T('operation-bagration')], ['바르샤바 봉기', E('warsaw-uprising')], ['루마니아: 8월 23일', E('romania-1944-1948')], ['커즌 선', T('curzon-line')]],
        },
        {
            id: 'vistula', date: '1944년 9월–1945년 1월', end: [1945, 1], title: '비스와강에서 도나우강까지',
            scene: {
                picture: 'vistula-oder',
                lead: '가을, 전선은 발트해에서 도나우강까지 뻗었다. 루마니아와 불가리아가 편을 바꾸고, 헝가리 평원에서 부다페스트로 가는 싸움이 시작된다.',
            },
            mobilize: 15, commissars: 3, army: [['rifle', 7], ['guards', 4], ['tank', 3], ['polish', 1]],
            brief: [
                '북쪽에서는 리가를 되찾고 북부 집단군을 쿠를란트에 가둔다. 남쪽에서는 부다페스트가 걸려 있다. 가운데 비스와강의 교두보에서는 다음 큰 공세를 준비한다. 1월, 그 공세가 오데르강까지 간다.',
                '전쟁은 이긴 싸움이 되었지만 싸움마다 값이 크다. 서두르면 시가전에 병력을 묻는다. 세 방면에 군을 나누고, 부다페스트를 언제 칠지 정해야 한다.',
            ],
            voices: [
                { who: ['로디온 말리놉스키', 'malinovsky'], at: 'south', text: '닷새만 주십시오. 지금 치면 제46군 혼자 부다페스트 앞에서 멈춥니다.' },
                { by: 'hungary', who: ['아돌프 히틀러', 'adolf-hitler'], at: 'south', text: '부다페스트는 집 한 채씩 지킨다. 물러나는 것은 허락하지 않는다.' },
                { who: ['레프 메흘리스', 'lev-mekhlis'], at: 'south', text: '우리 전선 앞의 헝가리 제1군 부대들은 무너지고 사기가 떨어지고 있습니다. 날마다 1천, 1천5백, 2천 명 넘게 포로를 잡습니다.', src: ['메흘리스가 스탈린에게 보낸 전보, 1944년 10월 28일(시테멘코 인용)', ML('memo/russian/shtemenko/24')] },
                { by: 'agn', at: 'north', text: '리가를 내준다. 집단군은 쿠를란트에서 바다를 등지고 선다.' },
            ],
            threats: {
                west: { pressure: 9, foes: ['agc'], text: '비스와강의 세 교두보 앞에 독일 A 집단군이 일곱 겹 방어선을 팠다. 예비는 아르덴과 헝가리로 가 있다.', who: ['게오르기 주코프', 'zhukov'] },
                south: { pressure: 8, foes: ['hungary'], text: '독일·헝가리군이 부다페스트를 요새로 삼았다. 1월에는 친위 기갑 군단이 세 번 포위를 뚫으러 온다.', who: ['로디온 말리놉스키', 'malinovsky'] },
                north: { pressure: 6, foes: ['agn'], text: '북부 집단군이 리가와 서드비나강을 지킨다. 바다로 뚫으면 발트 지역에 갇힌다.', who: ['이반 바그라먄', 'ivan-bagramyan'] },
            },
            cards: ['reserve', 'tankform', 'tankarmy', 'airarmy', 'lendlease', 'pause'],
            choice: {
                title: '부다페스트를 당장 칠 것인가', who: ['이오시프 스탈린', 'stalin'],
                text: '10월 28일 밤, 스탈린이 제2우크라이나 전선군의 말리놉스키에게 전화했다. 헝가리의 호르티가 휴전을 꾀하다 독일군에 끌려갔고, 처칠과 발칸의 몫을 막 흥정한 뒤였다.',
                talk: [
                    { who: ['이오시프 스탈린', 'stalin'], text: '부다페스트를 며칠 안에 차지해야 하오. 정치적으로 꼭 그래야 하오. 내일 공격하시오.' },
                    { who: ['로디온 말리놉스키', 'malinovsky'], text: '닷새를 주십시오. 지금 치면 힘이 모자라 시 어귀에서 길고 힘든 싸움에 빠집니다.' },
                ],
                options: [
                    { id: 'now', label: '내일 공격한다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'five', label: '닷새를 기다려 힘을 모은다', staff: -3, manpower: 4, effect: '이번 시기 스탈린그라드 방면 우리 힘 +3 · 인력 +4 · 최고사령관의 뜻을 꺾은 값으로 지휘 체계 −3' },
                ],
                history: 'now',
                after: '스탈린은 닷새를 주지 않았다. 바로 내일 부다페스트로 공세에 나서라는 명령이었다. 10월 29일 제46군이 공격했고, 11월 3일 부다페스트 남쪽 10–15킬로미터에서 멈췄다. 총참모부의 시테멘코도 준비 없이 나선 공세였다는 지적을 인정했다. 포위망은 12월 26일에야 닫혔고, 시가전은 2월 13일까지 이어졌다. 부다페스트 작전의 108일 동안 붉은 군대의 사상자는 32만 명이었다.',
                links: [['독일 점령하의 헝가리', E('hungary-1944-1945')], ['백분율 협정', T('percentages-agreement')], ['로디온 말리놉스키', P('malinovsky')]],
            },
            after: '10월 13일 리가를 되찾고 북부 집단군을 쿠를란트에 가뒀다. 12월 26일 부다페스트가 포위되었다. 1월 12일, 아르덴에서 몰린 서방의 요청으로 날짜를 당긴 비스와–오데르 작전이 시작되었다. 17일 바르샤바를 되찾았고, 27일 아우슈비츠를 해방했다. 2월 초 선봉은 베를린에서 70킬로미터 떨어진 오데르강에 닿았다.',
            links: [['독일 점령하의 헝가리', E('hungary-1944-1945')], ['폴란드: 루블린 위원회에서', E('poland-1944-1948')], ['얄타 회담과 포츠담 회담', E('yalta-potsdam')]],
        },
        {
            id: 'berlin', date: '1945년 2–5월', end: [1945, 5], title: '베를린',
            scene: {
                picture: 'berlin',
                lead: '오데르강의 교두보에서 베를린까지 70킬로미터. 그 사이에 젤로 고지가 있고, 도시 안에는 히틀러가 있다. 서쪽에서는 미군이 엘베강으로 온다.',
                witness: { as: '제1벨로루시 전선군 군사평의회', text: '연료 2회분·탄약 2기수까지 채운 뒤, 1945년 2월 15~16일 재빠른 돌진으로 베를린을 차지한다.', src: ['제1벨로루시 전선군 지령, 1945년 2월 4일(추이코프, 『제3제국의 최후』 인용)', ML('memo/russian/chuykov2/05')] },
            },
            mobilize: 15, commissars: 3, army: [['rifle', 6], ['guards', 5], ['tank', 3], ['polish', 1]], battle: 'berlin',
            brief: [
                '2월, 주코프의 선봉은 오데르강을 건넜지만 북쪽 포메른에 독일 비스와 집단군이 옆구리를 겨누고 있다. 남쪽에서는 부다페스트가 떨어지고 빈으로 가는 길이 열린다. 북쪽에서는 쾨니히스베르크가 남았다.',
                '마지막 시기다. 모스크바 방면에 군을 모아 베를린 작전을 준비한다. 이 시기를 보내면 베를린 전투가 열린다. 젤로 고지를 넘어 제국의회에 깃발을 올리면 전쟁이 끝난다.',
            ],
            voices: [
                { who: ['게오르기 주코프', 'zhukov'], at: 'west', text: '탐조등 백마흔세 개를 켠다. 새벽 세 시에 포격을 시작한다.' },
                { by: 'agc', who: ['고트하르트 하인리치', 'gotthard-heinrici'], at: 'west', text: '포격 전날 밤 첫 참호를 비워 두었다. 러시아의 포탄은 빈 땅에 떨어진다.' },
                { who: ['이반 코네프', 'ivan-konev'], at: 'west', text: '전차군은 뒤돌아보지 말고 베를린 남쪽으로 달려라.' },
                { who: ['이오시프 스탈린', 'stalin'], at: 'moscow', text: '먼저 뛰어드는 쪽이 베를린을 가지라고 하시오.', src: ['시테멘코, 『전쟁 시기의 총참모부』, 1945년 4월 1일 회의 뒤', ML('memo/russian/shtemenko/14')] },
            ],
            threats: {
                west: { pressure: 11, foes: ['agc'], text: '하인리치의 비스와 집단군이 젤로 고지에, 도시 안에는 국민돌격대와 친위대가 있다.', who: ['고트하르트 하인리치', 'gotthard-heinrici'] },
                south: { pressure: 9, foes: ['hungary'], text: '3월 벌러톤호에서 독일군의 마지막 공세가 온다. 받아 낸 뒤 빈으로 간다.', who: ['표도르 톨부힌', 'fyodor-tolbukhin'] },
                north: { pressure: 7, foes: ['agn'], text: '동프로이센의 독일군이 쾨니히스베르크 요새와 바닷가에 몰려 있다.', who: ['알렉산드르 바실렙스키', 'vasilevsky'] },
            },
            cards: ['reserve', 'tankform', 'tankarmy', 'airarmy', 'lendlease', 'pause'],
            choice: {
                title: '2월에 베를린으로 갈 것인가', who: ['바실리 추이코프', 'chuikov'],
                text: '2월 초 제1벨로루시 전선군은 오데르강의 퀴스트린 교두보에 섰다. 베를린 앞의 독일군은 아직 엉성하다. 그러나 스무 날에 500킬로미터를 달려온 군은 포탄과 연료가 바닥났고, 북쪽 동포메른에서는 독일 비스와 집단군이 옆구리를 겨눈다.',
                talk: [
                    { who: ['바실리 추이코프', 'chuikov'], text: '베를린 앞의 적은 아직 준비되지 않았다. 지금 가면 2월에 베를린을 차지할 수 있다. 전선 지령도 2월 15–16일을 말한다.' },
                    { who: ['게오르기 주코프', 'zhukov'], text: '동포메른에서 오데르로 나간 우리 주력의 옆구리와 뒤를 치는 반격의 위험이 커지고 있다. 그 적을 두고 베를린으로 갈 수는 없다.' },
                ],
                options: [
                    { id: 'flank', label: '포메른의 옆구리를 먼저 턴다', effect: '역사대로 · 따로 변하는 수치 없음' },
                    { id: 'dash', label: '2월에 베를린으로 달린다', manpower: 5, effect: '전쟁을 줄인다 · 인력 +5 · 그러나 옆구리가 열린 채다(이번 시기 모스크바 방면 우리 힘 −4, 베를린 전투에 나올 부대가 준다)' },
                ],
                history: 'flank',
                after: '2–3월 주코프와 로코솝스키는 포메른을 쓸어 발트해에 닿았다. 4월 1일 스타프카 회의 뒤 스탈린은 작전 지도에서 두 전선군의 경계선을 베를린 남동쪽 뤼벤에서 말없이 끊었다. 시테멘코의 회고로는 먼저 뛰어드는 쪽이 베를린을 가지라는 뜻이었다. 추이코프는 1960년대에 2월에 갈 수 있었다고 주장했고, 주코프는 포메른의 위협을 들어 반박했다.',
                links: [['베를린 전투', E('battle-of-berlin')], ['얄타 회담과 포츠담 회담', E('yalta-potsdam')], ['바실리 추이코프', P('chuikov')]],
            },
            after: '2월 13일 부다페스트, 4월 9일 쾨니히스베르크, 4월 13일 빈이 떨어졌다. 4월 16일 베를린 작전이 시작되었다.',
            links: [['베를린 전투', E('battle-of-berlin')], ['국민돌격대', T('volkssturm')], ['총통 벙커', T('fuhrerbunker')], ['무조건 항복', T('unconditional-surrender')]],
        },
    ];

    // ── Battles ──
    // Boards run north (row 0) to south; the Red Army is the player (red),
    // the Wehrmacht and its allies the enemy (axis). Every board has
    // supply (battle.js): a unit that cannot trace open ground back to its
    // side's source is cut off, and prisoners leave the board.
    const SIDES = { player: 'red', enemy: 'axis' };
    const SUPPLY_BRIEF = '보급선: 판 위의 굵은 점선이 보급선이다(붉은 점선은 붉은 군대, 회색 점선은 적). 부대는 판 가장자리의 세모(보급 기지)까지 이 길이 이어져야 한다. 적 부대가 선 칸, 그리고 적 곁인데 아군은 곁에 없는 칸(×로 표시)으로는 보급이 지나가지 못한다. 길이 끊긴 부대는 「포위」 띠를 달고 공격이 절반, 방어가 1 줄며 턴마다 병력 2를 잃는다. 포위된 채 한 턴을 넘기고 병력이 절반 아래로 꺾인 적은 항복한다.';
    const ARMS_BRIEF = '병종: 전차는 적 곁을 멈추지 않고 지나가고(돌파) 보병에게 강하다. 대전차포는 전차를 칠 때 피해 +3, 보병이 전차를 치면 피해 −2다.';

    // Yelnya, 30 August–8 September 1941: the first ground won back. The
    // salient juts east; its neck and the Germans' supply lie west.
    const yelnya = {
        id: 'yelnya', sides: SIDES, front: 'west', final: false, prisoners: true,
        scene: { picture: 'yelnya', witness: { as: '국방인민위원부', text: '적이 밀어붙여도 이 사단들은 겁에 질리지 않았고, 무기를 버리지 않았고, … 「포위됐다」고 외치지 않고, 질서 있게 적의 타격에 타격으로 맞섰다.', src: ['국방인민위원 명령 제308호(첫 근위사단), 1941년 9월 18일', ML('docs/da/nko_1941-1942/04')] } },
        title: '옐냐 돌출부', date: '1941년 8월 30일–9월 8일',
        settle: '옐냐로 →', board: '옐냐 전장', enemyName: '독일군',
        legend: [['steppe', '들판'], ['forest', '숲 (방어 +1, 이동 2)'], ['trench', '참호 (방어 +2, 이동 2, 포격으로 깎임)'], ['town', '옐냐 (방어 +1)']],
        reward: { quick: 4, quickBy: 3, lostBy: -4 },
        supply: { player: [[2, 9], [0, 9], [5, 9]], enemy: [[2, 0]] },
        map: [
            '..f.......',
            '...tt.....',
            '....Et....',
            '...tt.....',
            '.f........',
            '..........',
        ],
        voices: [
            { when: 'start', unit: ['yhq', 'y100'], who: ['게오르기 주코프', 'zhukov'], text: '돌출부의 목을 북쪽과 남쪽에서 조인다. 정면으로 밀지 말고 뒤를 끊어라.' },
            { when: 'start', unit: 'g78', by: 'agc', text: '옐냐는 모스크바로 가는 발판이다. 기갑이 돌아올 때까지 참호에서 버틴다.' },
            { when: 'cut', unit: ['y100', 'y303', 'y107', 'y106'], face: 'red-soldier-41', text: '목이 닫혔다! 놈들에게 포탄이 오지 않는다.' },
            { when: 'feat:first-salvo', unit: 'yrs', face: 'red-soldier-41', text: '레일 위의 로켓이 한꺼번에 날아간다. 병사들은 이것을 「카추샤」라고 부른다.' },
            { when: 'surrender', unit: ['y100', 'y303', 'y19'], face: 'red-soldier-41', text: '독일군이 손을 들었다. 이 전쟁에서 처음 보는 광경이다.' },
            { when: 'goal', unit: ['y100', 'y19', 'y303', 'y107'], face: 'red-soldier-41', text: '옐냐다! 우리가 도시를 되찾았다!' },
        ],
        goals: [{ at: [2, 4], name: '옐냐' }],
        towns: [['옐냐', 2, 4]],
        places: [['스몰렌스크 쪽', 4, 0.2], ['데스나강 쪽', 5, 8.4]],
        areas: [
            { name: '독일군의 돌출부', tiles: [[1, 3], [1, 4], [2, 3], [2, 4], [2, 5], [3, 3], [3, 4]] },
            { name: '돌출부의 목', tiles: [[2, 1], [2, 2]] },
        ],
        turnLimit: 7,
        lines: {}, sectors: {},
        terrain: {
            '.': { name: '들판', cost: 1, def: 0, cls: 'steppe' },
            f: { name: '숲', cost: 2, def: 1, cls: 'forest' },
            t: { name: '참호', cost: 2, def: 2, fort: 'salient', cls: 'trench' },
            E: { name: '옐냐', cost: 1, def: 1, cls: 'town' },
        },
        units: [
            { id: 'y100', tag: '100', side: 'red', name: '제100소총사단', sub: '루시야노프', kind: 'inf', at: [0, 3], hp: 10, atk: 5, def: 3, mv: 3, lead: true, look: 'pilotka' },
            { id: 'y107', tag: '107', side: 'red', name: '제107소총사단', sub: '북쪽 집단', kind: 'inf', at: [0, 5], hp: 10, atk: 5, def: 3, mv: 3 },
            { id: 'y102', tag: '전차', side: 'red', name: '제102전차사단', sub: '낡은 전차 스무 대', kind: 'tank', at: [0, 1], hp: 6, atk: 5, def: 2, mv: 4, need: 3 },
            { id: 'y303', tag: '303', side: 'red', name: '제303소총사단', sub: '남쪽 집단', kind: 'inf', at: [5, 3], hp: 10, atk: 5, def: 3, mv: 3 },
            { id: 'y106', tag: '106', side: 'red', name: '제106차량화사단', sub: '남쪽 집단', kind: 'inf', at: [5, 5], hp: 9, atk: 5, def: 3, mv: 3 },
            { id: 'y19', tag: '19', side: 'red', name: '제19소총사단', sub: '정면', kind: 'inf', at: [2, 8], hp: 10, atk: 4, def: 3, mv: 3 },
            { id: 'yart', tag: '포병', side: 'red', name: '제24군 포병', kind: 'art', at: [1, 8], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'yrs', tag: '카추샤', side: 'red', name: '로켓포 대대', sub: '카추샤', kind: 'art', at: [3, 8], hp: 5, atk: 5, def: 1, mv: 2, range: 3,
                feat: { id: 'first-salvo', name: '일제 사격', kind: 'barrage', plus: 2, text: '로켓 수백 발이 한 번에 떨어진다. 이번 공격 피해 +2, 반격 없음. 맞은 부대 곁의 적도 절반의 피해를 입는다.', history: '로켓포 BM-13은 1941년 7월 오르샤에서 처음 쓰였고, 옐냐 공세에도 나왔다. 병사들이 붙인 이름이 「카추샤」다.' } },
            { id: 'y309', tag: '예비', side: 'red', name: '제309소총사단', sub: '스타프카 예비', kind: 'inf', at: [4, 8], hp: 10, atk: 5, def: 3, mv: 3, card: 'reserve' },
            { id: 'yhq', tag: '사령부', side: 'red', name: '예비 전선군 사령부', sub: '주코프', kind: 'inf', at: [2, 9], hp: 6, atk: 3, def: 3, mv: 2, person: ['게오르기 주코프', 'zhukov'],
                feat: { id: 'night-attack', name: '오늘의 명령', kind: 'order', plus: 2, text: '이번 턴, 붉은 부대가 다른 붉은 부대와 함께 붙어 치는 모든 공격의 피해 +2. 사령부는 이번 턴 다른 행동을 하지 않는다.', history: '주코프는 포병을 한데 모아 좁은 구역에 쏟게 하고, 부대들이 서로 맞추어 치도록 날마다 명령을 고쳐 내렸다.' } },
            { id: 'g15', tag: '15', side: 'axis', name: '제15보병사단', sub: '북쪽 면', kind: 'inf', at: [1, 3], hp: 13, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'g268', tag: '268', side: 'axis', name: '제268보병사단', sub: '북쪽 면', kind: 'inf', at: [1, 4], hp: 13, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'g292', tag: '292', side: 'axis', name: '제292보병사단', sub: '돌출부 끝', kind: 'inf', at: [2, 5], hp: 14, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'g78', tag: '78', side: 'axis', name: '제78보병사단', sub: '옐냐 수비', kind: 'inf', at: [2, 4], hp: 14, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'g137', tag: '137', side: 'axis', name: '제137보병사단', sub: '남쪽 면', kind: 'inf', at: [3, 4], hp: 13, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'g263', tag: '263', side: 'axis', name: '제263보병사단', sub: '남쪽 면', kind: 'inf', at: [3, 3], hp: 13, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'gres', tag: '예비', side: 'axis', name: '제20군단 예비', sub: '돌출부의 목', kind: 'inf', at: [2, 2], hp: 11, atk: 6, def: 2, mv: 3, role: 'guard', reach: 2 },
        ],
        summary: '옐냐에 서면 승리 · 7턴 · 돌출부의 목을 조이면 참호의 적이 포위된다',
        brief: [
            '스몰렌스크 남동쪽 옐냐에서 독일군의 전선이 동쪽(판의 오른쪽)으로 불룩 튀어나와 있다. 판 가운데 점선 테두리가 그 돌출부이고, 서쪽으로 이어지는 좁은 자리가 「목」이다. 모스크바로 가는 발판이다. 주코프의 예비 전선군이 북쪽과 남쪽에서 그 목을 조인다.',
            '옐냐에 붉은 부대를 세우면 이긴다. 7턴이 주어진다. 4턴 안에 되찾으면 모스크바 방면의 우리 힘이 3 늘고, 되찾지 못하면 4 준다.',
            SUPPLY_BRIEF,
            '독일군의 보급은 서쪽 끝에서 온다. 북쪽과 남쪽 집단이 목에서 만나면 참호의 사단들이 한꺼번에 포위된다. 참호를 정면에서 치는 것보다 빠르다.',
            '독일 예비대는 목 가까이 오는 부대를 치러 나왔다가 제자리로 돌아간다. 포병은 참호의 방어를 깎는다.',
            '결정적 한 수(★): 전투마다 한 번. 카추샤의 「일제 사격」, 사령부의 「오늘의 명령」.',
        ],
        history: '8월 30일 제24군이 북쪽과 남쪽에서 공세를 시작했다. 목이 좁아지자 독일군은 9월 5일 밤부터 돌출부를 비웠고, 6일 붉은 군대가 옐냐에 들어갔다. 포위망을 닫을 전차는 없었다. 그래도 이 전쟁에서 독일군이 처음으로 내준 땅이었다. 이 싸움의 네 사단이 9월 18일 첫 근위사단이 되었다.',
    };

    // Moscow, late November–December 1941: the Volokolamsk highway held,
    // then the reserves' counterstroke north of the city. West (the
    // Germans) is left, Moscow the right edge.
    const moscowBattle = {
        id: 'moscow', sides: SIDES, front: 'west', final: false, outlast: true, prisoners: true,
        scene: { picture: 'moscow-counter' },
        title: '모스크바 방어와 반격', date: '1941년 11월 16일–12월 15일',
        settle: '모스크바 앞으로 →', board: '모스크바 북서쪽', enemyName: '독일군',
        pushNote: '독일 선봉. 힘키로 곧장 온다. 붉은 부대 곁에서는 멈춰 싸운다(전차는 지나친다). 힘키에 독일군이 들어서면 진다.',
        huntNote: '곁에 붉은 부대가 가장 적은 붉은 부대를 찾아가 친다.',
        legend: [['snow', '눈밭'], ['forest', '숲 (방어 +1, 이동 2)'], ['town', '마을 (방어 +1)']],
        reward: { quick: 7, quickBy: 3, lostBy: -6 },
        supply: { player: [[3, 10], [0, 10], [6, 10]], enemy: [[3, 0], [0, 0]] },
        map: [
            'f..K....f..',
            '..f...S....',
            '....f......',
            'V....I..R.H',
            '...f...f...',
            '.f....D....',
            '....f......',
        ],
        voices: [
            { when: 'start', unit: ['m8g', 'mhq'], who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'], text: '뒤에는 모스크바다. 대로를 따라 한 마을씩 내주며 시간을 번다.' },
            { when: 'start', unit: ['p7', 'p2'], by: 'agc', text: '크렘린의 탑이 쌍안경에 보인다. 마지막 대대까지 밀어 넣어라.' },
            { when: 'start', unit: 'mkt', who: ['미하일 카투코프', 'mikhail-katukov'], text: '전차는 숲 가장자리에 묻는다. 지나가는 놈의 옆구리를 쏜다.' },
            { when: 'turn:4', unit: ['m1s', 'm20', 'm1b', 'mhq'], who: ['게오르기 주코프', 'zhukov'], text: '적은 끝에 다다랐다. 제1충격군과 제20군, 앞으로!' },
            { when: 'turn:4', unit: ['p7', 'p2', 'i35'], by: 'agc', who: ['하인츠 구데리안', 'heinz-guderian'], text: '영하 삼십 도다. 기관총도 전차도 얼어붙었다.' },
            { when: 'cut', unit: ['m1s', 'm20', 'm8g'], face: 'red-soldier-41', text: '놈들의 뒤가 끊겼다! 전차를 버리고 걸어서 달아난다.' },
            { when: 'goal', unit: ['m1s', 'm20', 'm1b', 'mdv'], face: 'red-soldier-41', text: '클린이다! 독일군이 물러난다!' },
        ],
        goals: [{ at: [0, 3], name: '클린' }],
        protect: { at: [3, 10], name: '힘키' },
        towns: [['클린', 0, 3], ['힘키', 3, 10]],
        places: [['솔네치노고르스크', 1, 6], ['볼로콜람스크', 3, 0], ['이스트라', 3, 5], ['크류코보', 3, 8], ['데도프스크', 5, 6], ['모스크바 →', 2, 9.9], ['볼로콜람스크 대로', 4, 2]],
        turnLimit: 8,
        lines: {}, sectors: {},
        terrain: {
            '.': { name: '눈밭', cost: 1, def: 0, cls: 'snow' },
            f: { name: '숲', cost: 2, def: 1, cls: 'forest' },
            K: { name: '클린', cost: 1, def: 1, cls: 'town' },
            S: { name: '솔네치노고르스크', cost: 1, def: 1, cls: 'town' },
            V: { name: '볼로콜람스크', cost: 1, def: 1, cls: 'town' },
            I: { name: '이스트라', cost: 1, def: 1, cls: 'town' },
            R: { name: '크류코보', cost: 1, def: 1, cls: 'town' },
            D: { name: '데도프스크', cost: 1, def: 1, cls: 'town' },
            H: { name: '힘키', cost: 1, def: 1, cls: 'town' },
        },
        units: [
            { id: 'm8g', tag: '8근위', side: 'red', name: '제8근위소총사단', sub: '판필로프 사단', kind: 'inf', at: [3, 6], hp: 10, atk: 5, def: 3, mv: 3, lead: true, look: 'ushanka',
                feat: { id: 'stand-fast', name: '한 걸음도 물러서지 않는다', kind: 'brace', def: 3, text: '다음 내 차례까지 방어 +3. 맞으면 반드시 되받아친다.', history: '판필로프의 제316소총사단은 볼로콜람스크 대로에서 한 달을 버텼다. 11월 18일 사단장이 전사한 날 사단은 제8근위사단이 되었다.' } },
            { id: 'mkt', tag: '카투코프', side: 'red', name: '제1근위전차여단', sub: '카투코프', kind: 'tank', at: [2, 6], hp: 8, atk: 6, def: 3, mv: 4, person: ['미하일 카투코프', 'mikhail-katukov'],
                feat: { id: 'ambush', name: '매복', kind: 'strike', plus: 3, text: '숨어 있다가 옆구리를 쏜다. 이번 공격 피해 +3, 반격 없음.', history: '카투코프의 여단은 10월 므첸스크에서 매복으로 구데리안의 제4기갑사단을 멈춰 세웠고, 11월 볼로콜람스크 대로로 옮겨 왔다.' } },
            { id: 'mdv', tag: '도바토르', side: 'red', name: '제2근위기병군단', sub: '도바토르', kind: 'cav', at: [1, 8], hp: 8, atk: 5, def: 2, mv: 5, skirmish: true, look: 'ushanka' },
            { id: 'mat', tag: '대전차', side: 'red', name: '대전차 포병 연대', kind: 'at', at: [3, 7], hp: 7, atk: 4, def: 2, mv: 2 },
            { id: 'mcd', tag: '생도', side: 'red', name: '사관생도 연대', sub: '크렘린 군사학교', kind: 'inf', at: [5, 7], hp: 7, atk: 4, def: 3, mv: 3 },
            { id: 'm78', tag: '78', side: 'red', name: '제78소총사단', sub: '극동에서 온 벨로보로도프', kind: 'inf', at: [4, 6], hp: 10, atk: 6, def: 3, mv: 3, need: 0, look: 'ushanka' },
            { id: 'mart', tag: '포병', side: 'red', name: '제16군 포병', kind: 'art', at: [3, 9], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
            { id: 'mhq', tag: '사령부', side: 'red', name: '서부전선군 예비', sub: '스타프카 예비군', kind: 'inf', at: [4, 9], hp: 10, atk: 5, def: 3, mv: 3, card: 'reserve', look: 'ushanka' },
            { id: 'm5a', tag: '5군', side: 'red', name: '제5군 소총사단', sub: '모자이스크 대로', kind: 'inf', at: [5, 9], hp: 9, atk: 5, def: 3, mv: 3, need: 3 },
            { id: 'm1s', tag: '1충격', side: 'red', name: '제1충격군 스키 여단', sub: '쿠즈네초프', kind: 'inf', at: [0, 9], hp: 10, atk: 6, def: 3, mv: 4, arrive: 4, flag: 'reservesKept', look: 'ushanka' },
            { id: 'm1b', tag: '1충격', side: 'red', name: '제1충격군 소총여단', sub: '쿠즈네초프', kind: 'inf', at: [0, 10], hp: 10, atk: 6, def: 3, mv: 3, arrive: 4, flag: 'reservesKept', look: 'ushanka' },
            { id: 'm20', tag: '20군', side: 'red', name: '제20군', sub: '반격의 예비', kind: 'inf', at: [1, 10], hp: 10, atk: 6, def: 3, mv: 3, arrive: 4, flag: 'reservesKept', look: 'ushanka' },
            { id: 'p7', tag: '7기갑', side: 'axis', name: '제7기갑사단', sub: '제3기갑 집단', kind: 'tank', at: [1, 4], hp: 13, atk: 7, def: 3, mv: 4, role: 'push' },
            { id: 'p2', tag: '2기갑', side: 'axis', name: '제2기갑사단', sub: '제4기갑 집단', kind: 'tank', at: [2, 3], hp: 13, atk: 7, def: 3, mv: 4, role: 'push' },
            { id: 'i35', tag: '35', side: 'axis', name: '제35보병사단', sub: '대로', kind: 'inf', at: [3, 3], hp: 13, atk: 6, def: 3, mv: 3, role: 'push' },
            { id: 'iss', tag: '친위', side: 'axis', name: '친위 「다스 라이히」 사단', sub: '이스트라 쪽', kind: 'inf', at: [4, 3], hp: 14, atk: 7, def: 3, mv: 3, role: 'push' },
            { id: 'i106', tag: '106', side: 'axis', name: '제106보병사단', sub: '북쪽 옆구리', kind: 'inf', at: [0, 2], hp: 10, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'i23', tag: '23', side: 'axis', name: '제23보병사단', sub: '클린 수비', kind: 'inf', at: [0, 3], hp: 10, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'p11', tag: '11기갑', side: 'axis', name: '제11기갑사단', sub: '둘째 물결', kind: 'tank', at: [2, 0], hp: 12, atk: 7, def: 3, mv: 4, role: 'push', arrive: 2 },
            { id: 'i252', tag: '252', side: 'axis', name: '제252보병사단', sub: '둘째 물결', kind: 'inf', at: [5, 0], hp: 12, atk: 6, def: 3, mv: 3, role: 'hunt', arrive: 3 },
            { id: 'gart', tag: '포대', side: 'axis', name: '군단 포병', kind: 'art', at: [3, 1], hp: 9, atk: 6, def: 1, mv: 2, range: 2, role: 'hold' },
        ],
        summary: '8턴 끝까지 힘키를 지키면 승리 · 클린에 서면 그 자리에서 승리',
        brief: [
            '11월 중순 독일군의 마지막 공세가 모스크바 북서쪽으로 온다. 로코솝스키의 제16군이 볼로콜람스크 대로를 지킨다. 판 오른쪽 끝 힘키 뒤가 모스크바다.',
            '8턴이 끝날 때까지 힘키에 독일군을 들이지 않으면 이긴다. 그 전에 클린에 붉은 부대를 세우면 그 자리에서 이긴다. 7턴 안에 이기면 모스크바 방면의 우리 힘이 3 늘고, 지면 6 준다.',
            '독일 선봉은 힘키로 곧장 온다. 보병은 붉은 부대 곁에서 멈추지만 전차는 지나친다. 대전차포와 숲에 숨긴 전차로 전차를 잡고, 힘키로 가는 길을 비우지 말아야 한다.',
            '예비를 쥐고 있기로 했다면 4턴에 제1충격군과 제20군이 북동쪽에서 온다. 독일 선봉의 뒤(서쪽에서 오는 보급선)를 끊으면 선봉이 포위된다.',
            SUPPLY_BRIEF,
            ARMS_BRIEF,
        ],
        history: '11월 16일 시작된 공세로 독일군은 클린과 솔네치노고르스크, 이스트라를 차지하고 12월 초 크류코보와 운하 건너 야흐로마까지 왔다. 정찰대는 힘키에 닿았다. 12월 5–6일 반격이 시작되어 제1충격군과 제20군, 제16군이 15일 클린을, 20일 볼로콜람스크를 되찾았다.',
    };

    // Stalingrad, September–November 1942: the 62nd Army in the ruins with
    // the Volga at its back. West (the steppe, the Germans) is left; the
    // river runs down column 7, the ferry crosses it at the landing.
    const stalingradBattle = {
        id: 'stalingrad', sides: SIDES, front: 'south', final: false, outlast: true, prisoners: true,
        scene: { picture: 'order227' },
        title: '스탈린그라드 시가전', date: '1942년 9월 13일–11월 18일',
        settle: '스탈린그라드로 →', board: '스탈린그라드 시가', enemyName: '독일군',
        pushNote: '독일 돌격대. 중앙 나루로 곧장 온다. 붉은 부대 곁에서는 멈춰 싸운다(전차는 지나친다). 나루에 독일군이 들어서면 진다.',
        huntNote: '곁에 붉은 부대가 가장 적은 붉은 부대를 찾아가 친다.',
        legend: [['steppe', '초원'], ['city', '폐허 (방어 +2, 이동 2)'], ['works', '공장 (방어 +2, 이동 2)'], ['heights', '마마이 언덕 (방어 +2, 이동 2)'], ['kremlin', '파블로프의 집 (방어 +3)'], ['docks', '강가와 나루'], ['river', '볼가강'], ['crossing', '나룻길 (보급이 건넌다)']],
        reward: { lostBy: -6 },
        supply: { player: [[4, 8]], enemy: [[4, 0], [1, 0], [7, 0]] },
        air: { turns: [1, 3, 5], units: ['s95', 's284', 's10', 's13'], dmg: 2, name: '급강하 폭격기' },
        map: [
            '..WW..d~.',
            '..WWr.d~.',
            '..rrr.d~.',
            '.Hrrr.d~.',
            '..rSrrLF.',
            '..rrPr.~.',
            '..rrr.d~.',
            '.Er...d~.',
            '......d~.',
        ],
        voices: [
            { when: 'start', unit: ['shq', 's95'], who: ['바실리 추이코프', 'chuikov'], text: '적에게 바짝 붙어라. 참호와 참호 사이를 수류탄 던질 거리로 좁혀라. 그러면 놈들의 비행기는 제 편을 맞힐까 봐 폭탄을 떨구지 못한다.' },
            { when: 'start', unit: ['a71', 'a295'], by: 'ags', who: ['프리드리히 파울루스', 'friedrich-paulus'], text: '역을 지나 강까지 800미터다. 나루를 차지하면 도시는 끝난다.' },
            { when: 'air', unit: ['s95', 's284', 's10'], face: 'red-soldier-42', text: '또 온다! 사이렌 소리다. 지하실로!' },
            { when: 'turn:2', unit: ['s13', 'shq'], who: ['알렉산드르 로딤체프', 'alexander-rodimtsev'], text: '저는 공산주의자입니다. 여기서 떠날 생각이 없고, 떠나지 않을 겁니다.', src: ['추이코프, 『세기의 전투』, 1942년 9월 14일', ML('memo/russian/chuykov/06')] },
            { when: 'feat:pavlov-house', unit: 'spv', face: 'red-soldier-42', text: '이 집은 내주지 않는다. 창마다 기관총을 걸어라.' },
            { when: 'turn:6', unit: ['a71', 'a295', 'a24'], by: 'ags', text: '지하실 하나, 계단 하나를 두고 며칠을 싸운다. 이것은 전쟁이 아니라 쥐들의 싸움이다.' },
        ],
        goals: [],
        protect: { at: [4, 6], name: '중앙 나루' },
        towns: [['중앙 나루', 4, 6]],
        places: [['트랙터 공장', 0, 2.5], ['마마이 언덕', 3, 1], ['중앙역', 4, 3], ['파블로프의 집', 5, 4], ['곡물 창고', 7, 1], ['볼가강', 2, 7], ['강 건너', 6, 8]],
        turnLimit: 7,
        lines: {}, sectors: {},
        terrain: {
            '.': { name: '초원', cost: 1, def: 0, cls: 'steppe' },
            r: { name: '폐허', cost: 2, def: 2, cls: 'city' },
            W: { name: '공장', cost: 2, def: 2, cls: 'works' },
            H: { name: '마마이 언덕', cost: 2, def: 2, cls: 'heights' },
            S: { name: '중앙역', cost: 2, def: 2, cls: 'city' },
            P: { name: '파블로프의 집', cost: 2, def: 3, cls: 'kremlin' },
            E: { name: '곡물 창고', cost: 2, def: 2, cls: 'works' },
            d: { name: '강가', cost: 1, def: 0, cls: 'docks' },
            L: { name: '중앙 나루', cost: 1, def: 1, cls: 'docks' },
            '~': { name: '볼가강', cost: 99, def: 0, water: true, cls: 'river' },
            F: { name: '나룻길', cost: 99, def: 0, water: true, supply: true, cls: 'crossing' },
        },
        units: [
            { id: 's95', tag: '95', side: 'red', name: '제95소총사단', sub: '마마이 언덕', kind: 'inf', at: [3, 2], hp: 10, atk: 5, def: 3, mv: 3, lead: true },
            { id: 's284', tag: '284', side: 'red', name: '제284소총사단', sub: '바튜크의 시베리아 사단', kind: 'inf', at: [2, 3], hp: 10, atk: 5, def: 3, mv: 3 },
            { id: 's308', tag: '308', side: 'red', name: '제308소총사단', sub: '공장 지구', kind: 'inf', at: [1, 3], hp: 9, atk: 5, def: 3, mv: 3, need: 0 },
            { id: 's10', tag: '내무', side: 'red', name: '제10내무군 사단', sub: '중앙역', kind: 'inf', at: [4, 3], hp: 8, atk: 4, def: 3, mv: 3 },
            { id: 's92', tag: '해병', side: 'red', name: '제92해군보병여단', sub: '곡물 창고', kind: 'inf', at: [7, 2], hp: 8, atk: 5, def: 3, mv: 3, look: 'sailor' },
            { id: 'spv', tag: '파블로프', side: 'red', name: '파블로프의 집 수비대', sub: '제42근위연대', kind: 'inf', at: [5, 4], hp: 6, atk: 4, def: 3, mv: 2,
                feat: { id: 'pavlov-house', name: '집을 요새로', kind: 'brace', def: 3, text: '다음 내 차례까지 방어 +3. 맞으면 반드시 되받아친다.', history: '파블로프 하사와 스물네 명이 1월 9일 광장의 4층 아파트를 58일 동안 지켰다. 추이코프는 이 집 앞에서 죽은 독일군이 파리를 차지하며 죽은 독일군보다 많다고 썼다.' } },
            { id: 'shq', tag: '사령부', side: 'red', name: '제62군 사령부', sub: '추이코프', kind: 'inf', at: [4, 6], hp: 6, atk: 3, def: 3, mv: 2, person: ['바실리 추이코프', 'chuikov'],
                feat: { id: 'hugging', name: '포옹 전술', kind: 'order', plus: 2, text: '이번 턴, 붉은 부대가 다른 붉은 부대와 함께 붙어 치는 모든 공격의 피해 +2. 사령부는 이번 턴 다른 행동을 하지 않는다.', history: '추이코프는 작은 돌격조가 적 진지에 바짝 붙어 싸우게 했다. 독일 비행기와 포병은 제 편이 맞을까 봐 쏘지 못했다.' } },
            { id: 'sgun', tag: '강 건너', side: 'red', name: '강 건너 포병 집단', sub: '볼가강 동쪽 둑', kind: 'art', at: [3, 8], hp: 8, atk: 5, def: 1, mv: 1, range: 5,
                feat: { id: 'volga-guns', name: '카추샤 일제 사격', kind: 'barrage', plus: 2, text: '이번 공격 피해 +2, 반격 없음. 맞은 부대 곁의 적도 절반의 피해를 입는다.', history: '제62군의 중포와 로켓포는 강 동쪽 둑에 있었다. 도시 안의 관측병이 부르면 강 너머에서 쏘았다.' } },
            { id: 's13', tag: '13근위', side: 'red', name: '제13근위소총사단', sub: '로딤체프', kind: 'inf', at: [4, 6], hp: 11, atk: 6, def: 3, mv: 3, arrive: 2, person: ['알렉산드르 로딤체프', 'alexander-rodimtsev'], look: 'helmet' },
            { id: 's39', tag: '39근위', side: 'red', name: '제39근위소총사단', sub: '붉은 10월 공장', kind: 'inf', at: [2, 6], hp: 9, atk: 5, def: 3, mv: 3, arrive: 4, need: 3 },
            { id: 's138', tag: '138', side: 'red', name: '제138소총사단', sub: '류드니코프, 스타프카 예비', kind: 'inf', at: [6, 6], hp: 10, atk: 5, def: 3, mv: 3, arrive: 3, card: 'reserve' },
            { id: 'a71', tag: '71', side: 'axis', name: '제71보병사단', sub: '중앙역으로', kind: 'inf', at: [4, 1], hp: 14, atk: 7, def: 3, mv: 3, role: 'push' },
            { id: 'a295', tag: '295', side: 'axis', name: '제295보병사단', sub: '마마이 언덕으로', kind: 'inf', at: [3, 0], hp: 14, atk: 7, def: 3, mv: 3, role: 'push' },
            { id: 'a94', tag: '94', side: 'axis', name: '제94보병사단', sub: '남쪽', kind: 'inf', at: [6, 1], hp: 13, atk: 6, def: 3, mv: 3, role: 'push' },
            { id: 'a24', tag: '24기갑', side: 'axis', name: '제24기갑사단', sub: '남쪽 강가로', kind: 'tank', at: [8, 1], hp: 12, atk: 7, def: 3, mv: 3, role: 'push' },
            { id: 'a389', tag: '389', side: 'axis', name: '제389보병사단', sub: '공장 지구로', kind: 'inf', at: [1, 0], hp: 13, atk: 6, def: 3, mv: 3, role: 'hunt' },
            { id: 'a14', tag: '14기갑', side: 'axis', name: '제14기갑사단', sub: '둘째 물결', kind: 'tank', at: [2, 0], hp: 12, atk: 7, def: 3, mv: 3, role: 'push', arrive: 3 },
            { id: 'a305', tag: '305', side: 'axis', name: '제305보병사단', sub: '둘째 물결', kind: 'inf', at: [5, 0], hp: 13, atk: 7, def: 3, mv: 3, role: 'push', arrive: 4 },
            { id: 'a100', tag: '100엽병', side: 'axis', name: '제100엽병사단', sub: '셋째 물결', kind: 'inf', at: [3, 0], hp: 13, atk: 7, def: 3, mv: 3, role: 'hunt', arrive: 5 },
            { id: 'aart', tag: '포대', side: 'axis', name: '제6군 포병', kind: 'art', at: [5, 1], hp: 9, atk: 6, def: 1, mv: 2, range: 2, role: 'hold' },
        ],
        summary: '7턴 끝까지 중앙 나루를 지키면 승리 · 나루가 끊기면 도시의 부대가 모두 포위된다',
        brief: [
            '독일 제6군이 서쪽 초원에서 도시로 들어온다. 추이코프의 제62군은 볼가강을 등지고 폐허에서 싸운다. 사람과 포탄은 밤마다 배로 강을 건너 중앙 나루에 닿는다.',
            '7턴이 끝날 때까지 중앙 나루에 독일군을 들이지 않으면 이긴다. 지면 이 시기 스탈린그라드 방면의 우리 힘이 6 준다.',
            '붉은 군대의 보급은 강 건너에서 나룻길을 지나 나루로 온다. 나루 곁에 독일군이 서고 나루가 비면 보급이 끊겨 도시의 모든 부대가 포위된다. 나루에는 늘 부대를 두어야 한다.',
            '폐허와 공장은 방어 +2다. 독일 전차는 폐허에서 느리다. 2턴에 로딤체프의 제13근위사단이 나루에 내린다. 강 건너 포병은 사거리 5로 도시 안까지 쏜다.',
            '독일 급강하 폭격기가 1·3·5턴 끝에 온다(피해 2). 독일 증원은 3·4·5턴에 서쪽에서 온다.',
            SUPPLY_BRIEF,
        ],
        history: '9월 13일 독일군이 시가로 들어와 14일 중앙역과 강가에 닿았다. 그날 밤 로딤체프의 제13근위사단이 포화 속에 강을 건너 나루를 되찾았다. 마마이 언덕과 중앙역은 주인이 열 번 넘게 바뀌었다. 10월에는 공장 지구에서, 11월에는 강가의 좁은 띠에서 싸움이 이어졌다. 제62군은 11월 19일까지 버텼다.',
    };

    // Uranus, 19–23 November 1942: two pincers through the Romanian armies
    // to the Don bridge at Kalach and Sovetsky east of it. The Don runs
    // down column 6; the Sixth Army sits in the east.
    const uranusBattle = {
        id: 'uranus', sides: SIDES, front: 'south', final: false, prisoners: true, goalsAll: true,
        scene: { picture: 'uranus' },
        title: '천왕성 작전', date: '1942년 11월 19–23일',
        settle: '돈강으로 →', board: '돈강과 볼가강 사이', enemyName: '추축군',
        huntNote: '독일 기갑 예비. 곁에 붉은 부대가 가장 적은 붉은 부대를 찾아가 친다. 2턴이 끝날 때까지는 제자리에 있다.',
        legend: [['snow', '눈 덮인 초원'], ['forest', '골짜기 숲 (방어 +1, 이동 2)'], ['trench', '루마니아군 참호 (방어 +2, 이동 2, 포격으로 깎임)'], ['river', '돈강'], ['bridge', '칼라치 다리'], ['town', '소비에츠키 (방어 +1)'], ['city', '스탈린그라드 외곽 (방어 +1)']],
        reward: { quick: 4, quickBy: 3, lostBy: -6 },
        supply: { player: [[0, 4], [8, 9]], enemy: [[4, 0], [5, 0], [6, 0]] },
        map: [
            '............',
            '..tt.tt.....',
            '............',
            '...f..~..SS.',
            '......~...S.',
            '......B.V...',
            '......~.....',
            '......~.t.tt',
            '............',
        ],
        voices: [
            { when: 'start', unit: ['u26', 'uart'], who: ['니콜라이 바투틴', 'nikolai-vatutin'], text: '포병이 길을 연다. 전차군은 루마니아군을 지나쳐 칼라치의 다리로 달려라.' },
            { when: 'start', unit: ['r13', 'r14'], by: 'romania', text: '안개 속에서 전차 소리가 난다. 우리에게는 그것을 막을 포가 없다.' },
            { when: 'start', unit: ['u4m', 'u51'], who: ['안드레이 예료멘코', 'andrei-yeryomenko'], text: '남쪽 집단은 호수 사이로 뚫고 소비에츠키로 간다. 북쪽의 전차와 거기서 만난다.' },
            { when: 'feat:headlights', unit: 'u26', face: 'red-soldier-42', text: '전조등을 켜라! 놈들은 제 편 훈련 부대인 줄 안다. 다리는 우리 것이다!' },
            { when: 'cut', unit: ['u26', 'u1t', 'u21a', 'u4m'], face: 'red-soldier-42', text: '루마니아군이 줄지어 손을 들고 나온다. 뒤로 보내라, 우리는 계속 간다.' },
            { when: 'goal', unit: ['u26', 'u4m', 'u1t', 'u13'], who: ['알렉산드르 바실렙스키', 'vasilevsky'], text: '두 전선군이 만났다. 제6군은 고리 안에 있다.' },
        ],
        goals: [{ at: [5, 6], name: '칼라치 다리' }, { at: [5, 8], name: '소비에츠키' }],
        towns: [['소비에츠키', 5, 8]],
        places: [['칼라치', 5, 5.3], ['돈강', 7, 6], ['세라피모비치 교두보', 0, 4], ['사르파 호수 쪽', 8, 9.6], ['스탈린그라드 →', 3, 10.6]],
        turnLimit: 7,
        lines: {}, sectors: {},
        terrain: {
            '.': { name: '눈 덮인 초원', cost: 1, def: 0, cls: 'snow' },
            f: { name: '골짜기 숲', cost: 2, def: 1, cls: 'forest' },
            t: { name: '루마니아군 참호', cost: 2, def: 2, fort: 'romanian', cls: 'trench' },
            '~': { name: '돈강', cost: 99, def: 0, water: true, cls: 'river' },
            B: { name: '칼라치 다리', cost: 1, def: 0, span: true, cls: 'bridge' },
            V: { name: '소비에츠키', cost: 1, def: 1, cls: 'town' },
            S: { name: '스탈린그라드 외곽', cost: 1, def: 1, cls: 'city' },
        },
        units: [
            { id: 'u1t', tag: '1전차', side: 'red', name: '제1전차군단', sub: '제5전차군', kind: 'tank', at: [0, 3], hp: 10, atk: 6, def: 3, mv: 4, flag: 'uranusReady' },
            { id: 'u26', tag: '26전차', side: 'red', name: '제26전차군단', sub: '제5전차군, 로딘', kind: 'tank', at: [0, 5], hp: 10, atk: 6, def: 3, mv: 4, flag: 'uranusReady',
                feat: { id: 'headlights', name: '전조등을 켜고', kind: 'ride', mv: 3, text: '이번 턴 이동 +3, 적 곁을 멈추지 않고 지나간다. 움직이기 전에 쓴다.', history: '11월 22일 새벽 필리포프 중령의 선견대가 전조등을 켠 채 줄지어 달렸다. 독일 경비대는 노획 전차로 훈련하는 제 편인 줄 알았고, 칼라치의 다리는 폭파되지 않은 채 넘어왔다.' } },
            { id: 'u21a', tag: '21군', side: 'red', name: '제21군 소총사단', sub: '북쪽 집단', kind: 'inf', at: [0, 2], hp: 10, atk: 5, def: 3, mv: 3, lead: true },
            { id: 'u65', tag: '65군', side: 'red', name: '제65군 소총사단', sub: '바토프', kind: 'inf', at: [0, 6], hp: 10, atk: 5, def: 3, mv: 3 },
            { id: 'u3c', tag: '3기병', side: 'red', name: '제3근위기병군단', sub: '플리예프', kind: 'cav', at: [0, 7], hp: 8, atk: 5, def: 2, mv: 5, skirmish: true, need: 2 },
            { id: 'uart', tag: '포병', side: 'red', name: '돌파 포병 사단', sub: '11월 19일 아침', kind: 'art', at: [0, 4], hp: 7, atk: 6, def: 1, mv: 2, range: 2,
                feat: { id: 'artillery-day', name: '포병의 날', kind: 'barrage', plus: 3, text: '이번 공격 피해 +3, 반격 없음. 맞은 부대 곁의 적도 절반의 피해를 입는다.', history: '11월 19일 07시 30분 포 3,500문이 80분 동안 루마니아 제3군 진지를 쏘았다. 이날은 뒤에 포병의 날이 되었다.' } },
            { id: 'u4m', tag: '4기계', side: 'red', name: '제4기계화군단', sub: '볼스키', kind: 'tank', at: [8, 9], hp: 10, atk: 6, def: 3, mv: 4 },
            { id: 'u13', tag: '13전차', side: 'red', name: '제13전차군단', sub: '남쪽 집단', kind: 'tank', at: [8, 10], hp: 8, atk: 5, def: 3, mv: 4, need: 3 },
            { id: 'u51', tag: '51군', side: 'red', name: '제51군 소총사단', sub: '남쪽 집단', kind: 'inf', at: [8, 8], hp: 10, atk: 5, def: 3, mv: 3 },
            { id: 'u57', tag: '57군', side: 'red', name: '제57군 소총사단', sub: '남쪽 집단', kind: 'inf', at: [8, 11], hp: 9, atk: 5, def: 3, mv: 3 },
            { id: 'u2g', tag: '예비', side: 'red', name: '스타프카 예비 소총사단', sub: '스타프카 예비군', kind: 'inf', at: [0, 1], hp: 10, atk: 5, def: 3, mv: 3, card: 'reserve' },
            { id: 'r13', tag: '루13', side: 'axis', name: '루마니아 제13보병사단', sub: '루마니아 제3군', kind: 'inf', at: [1, 2], hp: 9, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'r14', tag: '루14', side: 'axis', name: '루마니아 제14보병사단', sub: '루마니아 제3군', kind: 'inf', at: [1, 3], hp: 9, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'r5', tag: '루5', side: 'axis', name: '루마니아 제5보병사단', sub: '루마니아 제3군', kind: 'inf', at: [1, 5], hp: 9, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'r6', tag: '루6', side: 'axis', name: '루마니아 제6보병사단', sub: '라스카르 집단', kind: 'inf', at: [1, 6], hp: 10, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'r1t', tag: '루전차', side: 'axis', name: '루마니아 제1기갑사단', sub: '체코제 경전차', kind: 'tank', at: [2, 4], hp: 8, atk: 5, def: 2, mv: 3, role: 'guard', reach: 2 },
            { id: 'g22', tag: '22기갑', side: 'axis', name: '제22기갑사단', sub: '제48기갑군단', kind: 'tank', at: [4, 2], hp: 12, atk: 7, def: 3, mv: 4, role: 'hunt', wake: 3 },
            { id: 'gbr', tag: '경비', side: 'axis', name: '칼라치 다리 경비대', sub: '공병 학교와 대공포', kind: 'inf', at: [5, 6], hp: 9, atk: 4, def: 3, mv: 2, role: 'hold' },
            { id: 'gsv', tag: '후방', side: 'axis', name: '제6군 후방 부대', sub: '소비에츠키의 창고', kind: 'inf', at: [5, 8], hp: 9, atk: 4, def: 3, mv: 2, role: 'hold' },
            { id: 'g16', tag: '16기갑', side: 'axis', name: '제16기갑사단', sub: '제6군, 서쪽으로 돌려 보냄', kind: 'tank', at: [3, 8], hp: 12, atk: 7, def: 3, mv: 4, role: 'guard', reach: 3, wake: 3 },
            { id: 'g6a', tag: '6군', side: 'axis', name: '제6군 보병', sub: '시가전에 묶임', kind: 'inf', at: [3, 9], hp: 14, atk: 6, def: 3, mv: 3, role: 'hold' },
            { id: 'g6b', tag: '6군', side: 'axis', name: '제6군 보병', sub: '시가전에 묶임', kind: 'inf', at: [4, 10], hp: 14, atk: 6, def: 3, mv: 3, role: 'hold' },
            { id: 'g29', tag: '29차량', side: 'axis', name: '제29차량화사단', sub: '제4기갑군 예비', kind: 'inf', at: [6, 10], hp: 13, atk: 7, def: 3, mv: 4, role: 'guard', reach: 2 },
            { id: 'r20', tag: '루20', side: 'axis', name: '루마니아 제20보병사단', sub: '루마니아 제4군', kind: 'inf', at: [7, 8], hp: 9, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'r2', tag: '루2', side: 'axis', name: '루마니아 제2보병사단', sub: '루마니아 제4군', kind: 'inf', at: [7, 10], hp: 8, atk: 4, def: 2, mv: 3, role: 'hold' },
            { id: 'r18', tag: '루18', side: 'axis', name: '루마니아 제18보병사단', sub: '루마니아 제4군', kind: 'inf', at: [7, 11], hp: 8, atk: 4, def: 2, mv: 3, role: 'hold' },
        ],
        summary: '칼라치 다리와 소비에츠키에 모두 서면 승리 · 7턴',
        brief: [
            '스탈린그라드의 독일 제6군은 시가전에 묶여 있고, 그 양옆을 루마니아군이 맡고 있다. 북쪽 돈강 교두보의 남서전선군과 남쪽 호수 지대의 스탈린그라드 전선군이 양옆을 뚫고 돈강의 칼라치에서 만난다.',
            '칼라치 다리와 그 동쪽 소비에츠키에 붉은 부대가 함께 서면 고리가 닫히고 이긴다. 7턴이 주어진다. 4턴 안에 닫으면 스탈린그라드 방면의 우리 힘이 3 늘고, 닫지 못하면 6 준다.',
            '루마니아군 참호를 하나하나 부술 필요는 없다. 전차는 적 곁을 지나쳐 달릴 수 있다. 지나친 뒤 서쪽으로 가는 길을 막으면 참호의 루마니아군은 포위되어 항복한다.',
            '돈강은 칼라치 다리로만 건넌다. 다리에는 약한 경비대가 있다. 독일 기갑 예비(제22기갑사단, 제16기갑사단)는 3턴부터 움직인다. 스탈린그라드 외곽의 제6군 보병은 가까이 가지 않으면 나오지 않는다.',
            SUPPLY_BRIEF,
            ARMS_BRIEF,
        ],
        history: '11월 19일 남서전선군과 돈 전선군이, 20일 스탈린그라드 전선군이 공세에 나섰다. 루마니아 제3군은 이틀 만에 무너졌고 라스카르 집단 2만 7천 명이 항복했다. 22일 새벽 제26전차군단의 선견대가 칼라치의 다리를 빼앗았고, 23일 오후 4시 소비에츠키에서 제4전차군단과 제4기계화군단이 만났다. 고리 안에 22개 사단, 30만 명 가까이가 갇혔다.',
    };

    // Kursk, the southern face, 5–12 July 1943: Hoth's armour comes north
    // through the defence belts for Oboyan and Prokhorovka.
    const kurskBattle = {
        id: 'kursk', sides: SIDES, front: 'southwest', final: false, outlast: true, prisoners: true, when: { choice: 'defend' },
        scene: { picture: 'kursk' },
        title: '쿠르스크: 남쪽 면', date: '1943년 7월 5–12일',
        settle: '쿠르스크로 →', board: '오보얀과 프로호롭카 앞', enemyName: '독일군',
        pushNote: '독일 기갑 쐐기. 오보얀이나 프로호롭카 가운데 가까운 쪽으로 곧장 온다. 전차는 붉은 부대 곁을 지나친다. 두 곳 가운데 하나라도 독일군이 들어서면 진다.',
        legend: [['steppe', '밀밭'], ['forest', '숲 (방어 +1, 이동 2)'], ['trench', '방어 지대 (방어 +2, 이동 2, 포격으로 깎임)'], ['town', '마을 (방어 +1)']],
        reward: { lostBy: -6 },
        supply: { player: [[0, 2], [0, 8], [0, 5]], enemy: [[6, 2], [6, 5], [6, 8]] },
        air: [{ turns: [1, 2], units: ['kat1', 'kat2', 'k52'], dmg: 2, name: '급강하 폭격기' }, { turns: [3, 5], units: ['lah', 'gd'], dmg: 2, against: 'enemy', name: '습격기 편대' }],
        map: [
            '..O.....P..',
            '....f......',
            '.tt...tt...',
            '....f....f.',
            '..ttt.ttt..',
            '...........',
            '...........',
        ],
        voices: [
            { when: 'start', unit: ['khq', 'k52'], who: ['니콜라이 바투틴', 'nikolai-vatutin'], text: '적이 올 곳도 시각도 안다. 지뢰밭과 대전차포 앞으로 불러들여 부순다.' },
            { when: 'start', unit: ['lah', 'gd'], by: 'ags', who: ['헤르만 호트', 'hermann-hoth'], text: '티거를 쐐기의 끝에 세워라. 오보얀이 막히면 프로호롭카로 돈다.' },
            { when: 'start', unit: 'k1t', who: ['미하일 카투코프', 'mikhail-katukov'], text: '전차는 포탑까지 땅에 묻는다. 티거는 정면에서 못 뚫는다. 옆을 보일 때까지 기다려라.' },
            { when: 'air', unit: ['kat1', 'kat2', 'k52'], face: 'red-soldier-43', text: '급강하 폭격기다! 포를 버리지 마라!' },
            { when: 'turn:4', unit: ['k5t', 'k5u', 'khq'], who: ['파벨 로트미스트로프', 'pavel-rotmistrov'], text: '제5근위전차군은 사흘에 300킬로미터를 달려왔다. 바짝 붙어라. 가까이서는 티거의 긴 포도 소용없다.' },
            { when: 'feat:close-in', unit: ['k5t', 'k5u'], face: 'red-soldier-43', text: '전속으로! 놈들의 대열 속으로 들어가라!' },
        ],
        goals: [],
        protect: [{ at: [0, 2], name: '오보얀' }, { at: [0, 8], name: '프로호롭카' }],
        towns: [['오보얀', 0, 2], ['프로호롭카', 0, 8]],
        places: [['쿠르스크 ↑', 0, 5], ['벨고로드 ↓', 6, 5], ['첫째 방어 지대', 5, 5], ['둘째 방어 지대', 3, 2]],
        turnLimit: 7,
        lines: {}, sectors: {},
        terrain: {
            '.': { name: '밀밭', cost: 1, def: 0, cls: 'steppe' },
            f: { name: '숲', cost: 2, def: 1, cls: 'forest' },
            t: { name: '방어 지대', cost: 2, def: 2, fort: 'belt', cls: 'trench' },
            O: { name: '오보얀', cost: 1, def: 1, cls: 'town' },
            P: { name: '프로호롭카', cost: 1, def: 1, cls: 'town' },
        },
        units: [
            { id: 'k52', tag: '52근위', side: 'red', name: '제52근위소총사단', sub: '제6근위군', kind: 'inf', at: [4, 7], hp: 10, atk: 5, def: 3, mv: 3, lead: true, look: 'helmet' },
            { id: 'k67', tag: '67근위', side: 'red', name: '제67근위소총사단', sub: '제6근위군', kind: 'inf', at: [4, 3], hp: 10, atk: 5, def: 3, mv: 3, look: 'helmet' },
            { id: 'k375', tag: '375', side: 'red', name: '제375소총사단', sub: '제6근위군', kind: 'inf', at: [4, 8], hp: 9, atk: 5, def: 3, mv: 3, need: 0 },
            { id: 'kat1', tag: '대전차', side: 'red', name: '대전차 포병 여단', sub: '서쪽 거점', kind: 'at', at: [4, 2], hp: 7, atk: 5, def: 2, mv: 2 },
            { id: 'kat2', tag: '대전차', side: 'red', name: '대전차 포병 여단', sub: '동쪽 거점', kind: 'at', at: [4, 6], hp: 7, atk: 5, def: 2, mv: 2,
                feat: { id: 'fire-sack', name: '화력 주머니', kind: 'brace', def: 2, text: '다음 내 차례까지 방어 +2. 맞으면 반드시 되받아친다.', history: '대전차포는 여러 문이 한 지휘관 아래 한 목표를 쏘는 거점으로 묶였다. 전차가 지뢰밭에서 멈춘 틈에 옆구리를 쏘았다.' } },
            { id: 'k1t', tag: '1전차군', side: 'red', name: '제1전차군', sub: '카투코프, 땅에 묻은 전차', kind: 'tank', at: [2, 2], hp: 10, atk: 6, def: 4, mv: 4, person: ['미하일 카투코프', 'mikhail-katukov'],
                feat: { id: 'dug-in', name: '매복 사격', kind: 'strike', plus: 3, text: '이번 공격 피해 +3, 반격 없음.', history: '카투코프는 반격하라는 명령에 맞서, 전차를 땅에 묻고 매복으로 싸우게 해 달라고 스탈린에게 직접 청했다. 받아들여졌다.' } },
            { id: 'k2t', tag: '2근위', side: 'red', name: '제2근위전차군단', sub: '둘째 방어 지대', kind: 'tank', at: [2, 7], hp: 9, atk: 6, def: 3, mv: 4, need: 2 },
            { id: 'krs', tag: '카추샤', side: 'red', name: '근위 박격포 연대', sub: '카추샤', kind: 'art', at: [1, 5], hp: 6, atk: 5, def: 1, mv: 2, range: 3,
                feat: { id: 'counter-prep', name: '선제 포격', kind: 'barrage', plus: 3, text: '이번 공격 피해 +3, 반격 없음. 맞은 부대 곁의 적도 절반의 피해를 입는다.', history: '7월 5일 새벽, 붙잡은 독일 공병이 공격 시각을 말했다. 붉은 군대의 포병은 독일군이 출발선에 모인 때를 골라 먼저 쏘았다.' } },
            { id: 'khq', tag: '사령부', side: 'red', name: '보로네시 전선군 사령부', sub: '바투틴', kind: 'inf', at: [0, 5], hp: 6, atk: 3, def: 3, mv: 2, person: ['니콜라이 바투틴', 'nikolai-vatutin'],
                feat: { id: 'shturmovik', name: '습격기를 부른다', kind: 'sortie', dmg: 4, by: '습격기 편대', text: '판 위의 적 부대 하나에 피해 4(마지막 병력은 남는다). 사령부는 이번 턴 다른 행동을 하지 않는다.', history: '쿠르스크에서 Il-2 습격기는 새 대전차 소형 폭탄을 처음 썼다. 제2항공군이 남쪽 면의 하늘을 맡았다.' } },
            { id: 'k5t', tag: '5근위전차', side: 'red', name: '제5근위전차군', sub: '로트미스트로프', kind: 'tank', at: [0, 8], hp: 11, atk: 6, def: 3, mv: 4, arrive: 4, person: ['파벨 로트미스트로프', 'pavel-rotmistrov'],
                feat: { id: 'close-in', name: '바짝 붙어라', kind: 'strike', plus: 3, text: '이번 공격 피해 +3, 반격 없음.', history: '7월 12일 프로호롭카에서 제5근위전차군은 전속으로 달려들어 독일 전차와 뒤섞였다. 붉은 군대의 전차 손실은 훨씬 컸지만 친위 기갑 군단의 진격은 거기서 멈췄다.' } },
            { id: 'k5u', tag: '18전차', side: 'red', name: '제18전차군단', sub: '제5근위전차군', kind: 'tank', at: [0, 9], hp: 9, atk: 6, def: 3, mv: 4, arrive: 4 },
            { id: 'k5g', tag: '5근위군', side: 'red', name: '제5근위군', sub: '초원 전선군에서, 스타프카 예비군', kind: 'inf', at: [0, 7], hp: 10, atk: 5, def: 3, mv: 3, arrive: 3, card: 'reserve', look: 'helmet' },
            { id: 'k3t', tag: '전차군', side: 'red', name: '제10전차군단', sub: '전차군 카드', kind: 'tank', at: [0, 3], hp: 9, atk: 6, def: 3, mv: 4, arrive: 2, card: 'tankarmy' },
            { id: 'gd', tag: '대독일', side: 'axis', name: '「대독일」 기갑척탄병사단', sub: '제48기갑군단, 판터 여단', kind: 'tank', at: [6, 2], hp: 13, atk: 7, def: 4, mv: 3, role: 'push', aim: [0, 2] },
            { id: 'p11k', tag: '11기갑', side: 'axis', name: '제11기갑사단', sub: '제48기갑군단', kind: 'tank', at: [6, 3], hp: 11, atk: 6, def: 3, mv: 4, role: 'push', aim: [0, 2] },
            { id: 'i332', tag: '332', side: 'axis', name: '제332보병사단', sub: '서쪽 옆구리', kind: 'inf', at: [6, 1], hp: 9, atk: 5, def: 3, mv: 3, role: 'push', aim: [0, 2] },
            { id: 'lah', tag: '친위1', side: 'axis', name: '친위 「아돌프 히틀러 경호대」', sub: '제2친위기갑군단, 티거 중대', kind: 'tank', at: [6, 6], hp: 13, atk: 8, def: 4, mv: 3, role: 'push', aim: [0, 8] },
            { id: 'dr', tag: '친위2', side: 'axis', name: '친위 「다스 라이히」', sub: '제2친위기갑군단', kind: 'tank', at: [6, 7], hp: 12, atk: 7, def: 3, mv: 4, role: 'push', aim: [0, 8] },
            { id: 'tk', tag: '친위3', side: 'axis', name: '친위 「토텐코프」', sub: '제2친위기갑군단', kind: 'tank', at: [6, 8], hp: 12, atk: 7, def: 3, mv: 4, role: 'push', aim: [0, 8] },
            { id: 'i167', tag: '167', side: 'axis', name: '제167보병사단', sub: '쐐기 사이', kind: 'inf', at: [6, 5], hp: 9, atk: 5, def: 3, mv: 3, role: 'hunt' },
            { id: 'k3p', tag: '3기갑군단', side: 'axis', name: '제3기갑군단', sub: '켐프 분견군, 동쪽에서', kind: 'tank', at: [6, 10], hp: 11, atk: 6, def: 3, mv: 4, role: 'push', aim: [0, 8], arrive: 3 },
        ],
        summary: '7턴 끝까지 오보얀과 프로호롭카를 지키면 승리',
        brief: [
            '독일 제4기갑군이 남쪽에서 온다. 서쪽 쐐기(제48기갑군단)는 오보얀으로, 동쪽 쐐기(친위 기갑 군단)는 프로호롭카로 간다. 바투틴의 보로네시 전선군이 두 겹의 방어 지대에서 기다린다.',
            '7턴이 끝날 때까지 오보얀과 프로호롭카에 독일군을 들이지 않으면 이긴다. 지면 이 시기 키예프 방면의 우리 힘이 6 준다.',
            '독일 전차는 붉은 부대 곁을 멈추지 않고 지나친다. 방어 지대에 선 부대로 길 자체를 막아야 한다. 티거는 정면에서 잘 뚫리지 않는다. 대전차포(전차에 피해 +3)와 여럿이 둘러싼 공격으로 잡는다.',
            '4턴에 로트미스트로프의 제5근위전차군이 프로호롭카에 온다. 독일 급강하 폭격기는 1·2턴에 대전차포를 노리고, 붉은 군대의 습격기는 3·5턴에 쐐기의 끝을 친다.',
            SUPPLY_BRIEF,
            ARMS_BRIEF,
        ],
        history: '7월 5일 시작된 공세에서 제48기갑군단은 오보얀 길에서 카투코프의 묻힌 전차에 막혔다. 친위 기갑 군단은 동쪽으로 돌아 프로호롭카로 갔고, 7월 12일 로트미스트로프의 제5근위전차군과 부딪혔다. 그날 북쪽에서 오룔을 향한 반격이 시작되었고, 연합군은 이틀 전 시칠리아에 상륙해 있었다. 7월 13일 히틀러는 성채 작전을 멈췄다.',
    };

    // Bagration at Bobruisk, 24–29 June 1944: Rokossovsky's two blows. The
    // Berezina runs down column 4; Bobruisk and the road west lie on its
    // western bank, the German divisions in their trenches east of it.
    const bagrationBattle = {
        id: 'bagration', sides: SIDES, front: 'west', final: false, prisoners: true,
        scene: { picture: 'bagration' },
        title: '바그라티온: 보브루이스크', date: '1944년 6월 24–29일',
        settle: '보브루이스크로 →', board: '베레지나강', enemyName: '독일군',
        huntNote: '독일 기갑 예비. 곁에 붉은 부대가 가장 적은 붉은 부대를 찾아가 친다. 2턴이 끝날 때까지는 제자리에 있다.',
        legend: [['steppe', '들판'], ['forest', '숲 (방어 +1, 이동 2)'], ['marsh', '늪 (이동 2, 통나무 길)'], ['trench', '참호 (방어 +2, 이동 2, 포격으로 깎임)'], ['river', '베레지나강'], ['bridge', '보브루이스크 다리'], ['city', '보브루이스크 (방어 +2)']],
        reward: { quick: 4, quickBy: 3, lostBy: -6 },
        supply: { player: [[1, 10], [3, 10], [7, 2]], enemy: [[3, 0]] },
        air: { turns: [2, 4], units: ['b20p', 'b36', 'b134'], dmg: 3, against: 'enemy', name: '제16항공군' },
        map: [
            '....~......',
            '....~..t...',
            '.f..~..t...',
            '...KB..t...',
            '....~..t...',
            '.mmm~.f....',
            '.mmm~......',
            '....~......',
        ],
        voices: [
            { when: 'start', unit: ['bhq', 'b9t'], who: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'], text: '북쪽 집단은 참호를 돌아 다리 동쪽 끝으로, 남쪽 집단은 늪을 건너 도시 뒤로 간다.' },
            { when: 'start', unit: ['b134', 'b36'], by: 'agc', text: '보브루이스크는 「요새」다. 총통의 허락 없이는 참호를 떠날 수 없다.' },
            { when: 'start', unit: ['b65', 'b1g'], who: ['파벨 바토프', 'pavel-batov'], text: '병사들은 버들가지로 엮은 늪신을 신었다. 전차는 통나무 길로 간다. 적은 이쪽을 보지 않는다.' },
            { when: 'cut', unit: ['b9t', 'b3a', 'b48'], face: 'red-soldier-43', text: '다리 길을 막았다! 강 동쪽의 독일군은 갈 곳이 없다.' },
            { when: 'air', unit: ['b20p', 'b36', 'b134'], by: 'agc', text: '하늘이 러시아 비행기로 덮였다. 길 위의 대열이 불탄다.' },
            { when: 'goal', unit: ['b65', 'b1g', 'bkm', 'b9t'], face: 'red-soldier-43', text: '보브루이스크다! 민스크로 가는 길이 열렸다.' },
        ],
        goals: [{ at: [3, 3], name: '보브루이스크' }],
        towns: [['보브루이스크', 3, 3]],
        places: [['베레지나강', 6, 4], ['민스크 쪽 ↖', 0, 0.6], ['로가초프 쪽', 1, 9.6], ['파리치 쪽', 7, 2], ['늪지대', 5, 2]],
        turnLimit: 7,
        lines: {}, sectors: {},
        terrain: {
            '.': { name: '들판', cost: 1, def: 0, cls: 'steppe' },
            f: { name: '숲', cost: 2, def: 1, cls: 'forest' },
            m: { name: '늪', cost: 2, def: 0, cls: 'marsh' },
            t: { name: '참호', cost: 2, def: 2, fort: 'drut', cls: 'trench' },
            '~': { name: '베레지나강', cost: 99, def: 0, water: true, cls: 'river' },
            B: { name: '보브루이스크 다리', cost: 1, def: 0, span: true, cls: 'bridge' },
            K: { name: '보브루이스크', cost: 1, def: 2, cls: 'city' },
        },
        units: [
            { id: 'b3a', tag: '3군', side: 'red', name: '제3군 소총군단', sub: '고르바토프, 북쪽 집단', kind: 'inf', at: [1, 9], hp: 10, atk: 6, def: 3, mv: 3, lead: true, look: 'helmet' },
            { id: 'b48', tag: '48군', side: 'red', name: '제48군 소총군단', sub: '북쪽 집단', kind: 'inf', at: [3, 9], hp: 10, atk: 5, def: 3, mv: 3, look: 'helmet' },
            { id: 'b9t', tag: '9전차', side: 'red', name: '제9전차군단', sub: '바하로프, 북쪽 집단', kind: 'tank', at: [0, 9], hp: 10, atk: 6, def: 3, mv: 4 },
            { id: 'bart', tag: '포병', side: 'red', name: '돌파 포병 군단', sub: '이중 탄막', kind: 'art', at: [2, 9], hp: 7, atk: 6, def: 1, mv: 2, range: 2,
                feat: { id: 'double-barrage', name: '이중 탄막', kind: 'barrage', plus: 3, text: '이번 공격 피해 +3, 반격 없음. 맞은 부대 곁의 적도 절반의 피해를 입는다.', history: '제1벨로루시 전선군의 포병은 보병 앞 두 줄에 탄막을 치고 함께 옮겨 가는 「이중 탄막」을 여기서 처음 썼다.' } },
            { id: 'bhq', tag: '사령부', side: 'red', name: '제1벨로루시 전선군 사령부', sub: '로코솝스키', kind: 'inf', at: [2, 10], hp: 6, atk: 3, def: 3, mv: 2, person: ['콘스탄틴 로코솝스키', 'konstantin-rokossovsky'],
                feat: { id: 'air-army', name: '제16항공군을 부른다', kind: 'sortie', dmg: 5, by: '제16항공군', text: '판 위의 적 부대 하나에 피해 5(마지막 병력은 남는다). 사령부는 이번 턴 다른 행동을 하지 않는다.', history: '6월 27일 저녁 제16항공군의 비행기 526대가 한 시간 반 동안 보브루이스크 남동쪽에 갇힌 독일군 대열을 쳤다.' } },
            { id: 'b65', tag: '65군', side: 'red', name: '제65군 소총군단', sub: '바토프, 남쪽 집단', kind: 'inf', at: [7, 2], hp: 10, atk: 6, def: 3, mv: 3, flag: 'twoBlows', look: 'helmet', person: ['파벨 바토프', 'pavel-batov'] },
            { id: 'b1g', tag: '1근위전차', side: 'red', name: '제1근위전차군단', sub: '파노프, 남쪽 집단', kind: 'tank', at: [7, 1], hp: 10, atk: 6, def: 3, mv: 4, flag: 'twoBlows' },
            { id: 'b28', tag: '28군', side: 'red', name: '제28군 소총군단', sub: '남쪽 집단', kind: 'inf', at: [7, 3], hp: 10, atk: 5, def: 3, mv: 3, flag: 'twoBlows', need: 0, look: 'helmet' },
            { id: 'bkm', tag: '기병기계', side: 'red', name: '플리예프 기병기계화 집단', sub: '남쪽 집단', kind: 'cav', at: [7, 0], hp: 9, atk: 5, def: 2, mv: 5, skirmish: true, flag: 'twoBlows', need: 3 },
            { id: 'b2t', tag: '전차군', side: 'red', name: '제1기계화군단', sub: '전차군 카드', kind: 'tank', at: [0, 10], hp: 9, atk: 6, def: 3, mv: 4, card: 'tankarmy' },
            { id: 'bres', tag: '예비', side: 'red', name: '전선군 예비 소총군단', sub: '스타프카 예비군', kind: 'inf', at: [4, 10], hp: 10, atk: 5, def: 3, mv: 3, card: 'reserve', look: 'helmet' },
            { id: 'b134', tag: '134', side: 'axis', name: '제134보병사단', sub: '제35군단', kind: 'inf', at: [1, 7], hp: 13, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'b296', tag: '296', side: 'axis', name: '제296보병사단', sub: '제35군단', kind: 'inf', at: [2, 7], hp: 13, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'b6', tag: '6', side: 'axis', name: '제6보병사단', sub: '제35군단', kind: 'inf', at: [3, 7], hp: 13, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'b36', tag: '36', side: 'axis', name: '제36보병사단', sub: '제41기갑군단', kind: 'inf', at: [4, 7], hp: 13, atk: 5, def: 3, mv: 3, role: 'hold' },
            { id: 'b20p', tag: '20기갑', side: 'axis', name: '제20기갑사단', sub: '집단군의 하나뿐인 기갑', kind: 'tank', at: [3, 5], hp: 13, atk: 7, def: 3, mv: 4, role: 'hunt', wake: 3 },
            { id: 'bgar', tag: '수비대', side: 'axis', name: '보브루이스크 수비대', sub: '「요새」 사령관 하만', kind: 'inf', at: [3, 3], hp: 17, atk: 6, def: 4, mv: 2, role: 'hold' },
            { id: 'b35', tag: '35', side: 'axis', name: '제35보병사단', sub: '늪 가장자리', kind: 'inf', at: [4, 2], hp: 11, atk: 5, def: 3, mv: 3, role: 'guard', reach: 2 },
            { id: 'b383', tag: '383', side: 'axis', name: '제383보병사단', sub: '민스크 길', kind: 'inf', at: [2, 2], hp: 11, atk: 5, def: 3, mv: 3, role: 'guard', reach: 2 },
            { id: 'b12p', tag: '12기갑', side: 'axis', name: '제12기갑사단', sub: '북부 집단군에서 급히', kind: 'tank', at: [1, 0], hp: 13, atk: 7, def: 3, mv: 4, role: 'hunt', arrive: 5 },
        ],
        summary: '보브루이스크에 서면 승리 · 7턴 · 다리 길을 막으면 강 동쪽의 적이 포위된다',
        brief: [
            '독일 제9군이 베레지나강 동쪽의 참호에 앉아 있고, 그 뒤 강 서쪽에 보브루이스크가 있다. 강을 건너는 길은 보브루이스크 다리 하나다. 독일군의 보급은 판 서쪽 끝에서 도시와 다리를 지나 온다.',
            '보브루이스크에 붉은 부대를 세우면 이긴다. 7턴이 주어진다. 4턴 안에 차지하면 모스크바 방면의 우리 힘이 3 늘고, 차지하지 못하면 6 준다.',
            '두 곳에서 치기로 했다면 남쪽 집단이 강 서쪽 늪지대에서 올라온다. 도시 수비대는 강하지만, 서쪽으로 가는 길을 막아 포위하면 약해진다. 북쪽 집단이 다리 동쪽 끝 길을 막으면 강 동쪽의 사단들이 통째로 포위된다.',
            '한 곳에서만 친다면 북쪽 집단은 참호를 뚫거나 돌아 다리를 건너야 한다. 제16항공군이 2·4턴에 독일군을 친다. 독일 기갑 예비는 3턴부터 움직이고, 5턴에 또 하나가 서쪽에서 온다.',
            SUPPLY_BRIEF,
            ARMS_BRIEF,
        ],
        history: '6월 24일 로코솝스키의 두 집단이 공세에 나섰다. 남쪽 집단은 늪을 건너 첫날 20킬로미터를 뚫었고, 북쪽 로가초프 집단은 이틀을 참호에 막혔다가 바하로프의 전차군단이 돌아 들어가 다리 동쪽 길을 끊었다. 27일 독일군 여섯 개 사단 4만 명이 보브루이스크 남동쪽에 갇혔다. 29일 도시가 떨어졌다. 닷새 뒤 민스크가 해방되었다.',
    };

    // Berlin, 16 April–2 May 1945: the Seelow Heights, the city, the
    // Reichstag. The Oder bridgehead is the right edge; Konev comes from
    // the south-east.
    const berlinBattle = {
        id: 'berlin', sides: SIDES, front: 'west', final: true, prisoners: true,
        scene: { picture: 'berlin' },
        title: '베를린', date: '1945년 4월 16일–5월 2일',
        settle: '베를린으로 →', open: '베를린 작전 →', board: '오데르강에서 제국의회까지', enemyName: '독일군',
        huntNote: '벵크의 제12군. 6턴에 서쪽에서 와서, 곁에 붉은 부대가 가장 적은 붉은 부대를 찾아가 친다.',
        legend: [['steppe', '들판'], ['forest', '숲 (방어 +1, 이동 2)'], ['heights', '젤로 고지 (방어 +3, 이동 2, 포격으로 깎임)'], ['city', '베를린 시가 (방어 +2, 이동 2)'], ['kremlin', '제국의회 (방어 +3, 이동 2, 포격으로 깎임)'], ['stream', '운하 (이동 2)']],
        supply: { player: [[2, 11], [4, 11], [8, 11]], enemy: [[2, 0], [4, 0]] },
        air: { turns: [1, 3, 5, 7], units: ['z9a', 'z9b', 'zpz', 'zfl'], dmg: 2, against: 'enemy', name: '제16항공군' },
        map: [
            '..CCC...h...',
            '.CCCCC..h...',
            '.CCRCC..h...',
            '.CCCCC..h...',
            '.CCCCC..h...',
            '..CCC...h...',
            '..www...f...',
            '....f.......',
            '............',
        ],
        voices: [
            { when: 'start', unit: ['ehq', 'e8g'], who: ['게오르기 주코프', 'zhukov'], text: '새벽 세 시, 탐조등을 켜라. 포는 킬로미터마다 이백칠십 문이다.' },
            { when: 'start', unit: ['z9a', 'z9b'], by: 'agc', who: ['고트하르트 하인리치', 'gotthard-heinrici'], text: '첫 참호는 어젯밤 비웠다. 러시아의 포탄은 빈 땅을 갈고, 탐조등은 제 병사의 눈을 멀게 한다.' },
            { when: 'start', unit: ['e3t', 'e4t'], who: ['이반 코네프', 'ivan-konev'], text: '나이세강은 연막 속에서 건넜다. 전차군은 도시를 남쪽에서 감싼다.' },
            { when: 'turned:seelow', unit: ['e8g', 'e5s', 'e1t'], face: 'red-soldier-45', text: '고지를 돌았다! 베를린이 보인다.' },
            { when: 'turn:6', unit: ['zwk'], by: 'agc', text: '벵크의 군이 온다! 총통은 벵크를 기다린다.' },
            { when: 'feat:banner', unit: 'e3s', face: 'red-soldier-45', text: '제150사단의 깃발이다. 지붕까지 들고 올라가라!' },
            { when: 'goal', unit: ['e3s', 'e8g', 'e5s', 'e3t'], face: 'red-soldier-45', text: '제국의회 지붕에 붉은 깃발이 올랐다. 끝났다. 정말로 끝났다.' },
        ],
        goals: [{ at: [2, 3], name: '제국의회' }],
        towns: [],
        places: [['제국의회', 2, 3], ['젤로 고지', 0, 8], ['퀴스트린 교두보', 3, 10.6], ['텔토 운하', 6, 3], ['포츠담 쪽', 5, 0.4], ['나이세강 쪽', 8, 10.4]],
        turnLimit: 9, par: 7,
        lines: { seelow: { name: '젤로 고지', rear: { rows: [0, 5], cols: [6, 7] }, label: [4, 6.5], fallback: [3, 5] } },
        sectors: {},
        terrain: {
            '.': { name: '들판', cost: 1, def: 0, cls: 'steppe' },
            f: { name: '숲', cost: 2, def: 1, cls: 'forest' },
            h: { name: '젤로 고지', cost: 2, def: 3, fort: 'seelow', cls: 'heights' },
            C: { name: '베를린 시가', cost: 2, def: 2, cls: 'city' },
            R: { name: '제국의회', cost: 2, def: 3, fort: 'reichstag', cls: 'kremlin' },
            w: { name: '텔토 운하', cost: 2, def: 0, cls: 'stream' },
        },
        units: [
            { id: 'e8g', tag: '8근위', side: 'red', name: '제8근위군', sub: '추이코프, 스탈린그라드의 군', kind: 'inf', at: [2, 10], hp: 11, atk: 6, def: 3, mv: 3, lead: true, look: 'helmet', person: ['바실리 추이코프', 'chuikov'],
                feat: { id: 'storm-groups', name: '돌격조', kind: 'assault', after: 2, plus: 2, text: '고지나 건물의 방어를 무시하고 친다. 피해 +2. 붉은 부대가 진지 위의 적을 두 번 친 뒤에 쓸 수 있다.', history: '추이코프는 스탈린그라드에서 익힌 대로 보병과 공병, 전차, 포 한 문을 묶은 돌격조로 베를린의 건물을 하나씩 차지했다.' } },
            { id: 'e5s', tag: '5충격', side: 'red', name: '제5충격군', sub: '베르자린', kind: 'inf', at: [1, 10], hp: 10, atk: 6, def: 3, mv: 3, look: 'helmet' },
            { id: 'e3s', tag: '3충격', side: 'red', name: '제3충격군', sub: '쿠즈네초프, 제150소총사단', kind: 'inf', at: [0, 10], hp: 10, atk: 6, def: 3, mv: 3, look: 'helmet',
                feat: { id: 'banner', name: '승리의 깃발', kind: 'strike', plus: 4, text: '이번 공격 피해 +4, 반격 없음.', history: '4월 30일 제150소총사단이 제국의회로 들어갔다. 그날 밤 예고로프와 칸타리야가 베레스트 중위와 함께 지붕에 깃발을 세웠다. 건물 안의 싸움은 5월 2일까지 이어졌다.' } },
            { id: 'e1t', tag: '1근위전차', side: 'red', name: '제1근위전차군', sub: '카투코프', kind: 'tank', at: [3, 10], hp: 10, atk: 6, def: 3, mv: 4, person: ['미하일 카투코프', 'mikhail-katukov'] },
            { id: 'e2t', tag: '2근위전차', side: 'red', name: '제2근위전차군', sub: '보그다노프', kind: 'tank', at: [0, 11], hp: 10, atk: 6, def: 3, mv: 4, need: 2 },
            { id: 'ea1', tag: '포병', side: 'red', name: '돌파 포병 군단', sub: '북쪽', kind: 'art', at: [1, 11], hp: 7, atk: 6, def: 1, mv: 2, range: 2 },
            { id: 'ea2', tag: '포병', side: 'red', name: '돌파 포병 군단', sub: '남쪽', kind: 'art', at: [4, 10], hp: 7, atk: 6, def: 1, mv: 2, range: 2 },
            { id: 'ers', tag: '카추샤', side: 'red', name: '근위 박격포 여단', sub: '카추샤', kind: 'art', at: [3, 11], hp: 6, atk: 5, def: 1, mv: 2, range: 3,
                feat: { id: 'last-salvo', name: '일제 사격', kind: 'barrage', plus: 3, text: '이번 공격 피해 +3, 반격 없음. 맞은 부대 곁의 적도 절반의 피해를 입는다.', history: '베를린 작전에서 붉은 군대는 포와 박격포 4만 2천 문, 로켓포 3천 대를 모았다.' } },
            { id: 'ehq', tag: '사령부', side: 'red', name: '제1벨로루시 전선군 사령부', sub: '주코프', kind: 'inf', at: [2, 11], hp: 6, atk: 3, def: 3, mv: 2, person: ['게오르기 주코프', 'zhukov'],
                feat: { id: 'tank-armies-in', name: '전차군을 넣는다', kind: 'order', plus: 2, text: '이번 턴, 붉은 부대가 다른 붉은 부대와 함께 붙어 치는 모든 공격의 피해 +2. 사령부는 이번 턴 다른 행동을 하지 않는다.', history: '첫날 보병이 고지를 넘지 못하자 주코프는 계획을 바꿔 두 전차군을 고지 앞에 넣었다. 길은 막혔고 손실은 컸지만 사흘째 고지가 넘어갔다.' } },
            { id: 'epl', tag: '폴란드', side: 'red', name: '폴란드 제1군', sub: '포프와프스키', kind: 'inf', at: [5, 10], hp: 9, atk: 5, def: 3, mv: 3, need: 4 },
            { id: 'e3t', tag: '3근위전차', side: 'red', name: '제3근위전차군', sub: '리발코, 제1우크라이나 전선군', kind: 'tank', at: [8, 10], hp: 10, atk: 6, def: 3, mv: 4, need: 1, person: ['파벨 리발코', 'pavel-rybalko'] },
            { id: 'e4t', tag: '4근위전차', side: 'red', name: '제4근위전차군', sub: '렐류셴코, 전차군 카드', kind: 'tank', at: [8, 11], hp: 10, atk: 6, def: 3, mv: 4, card: 'tankarmy' },
            { id: 'e28', tag: '28군', side: 'red', name: '제28군', sub: '스타프카 예비군', kind: 'inf', at: [7, 11], hp: 10, atk: 5, def: 3, mv: 3, card: 'reserve', look: 'helmet' },
            { id: 'z9a', tag: '9군', side: 'axis', name: '제9군 보병', sub: '젤로 고지 북쪽', kind: 'inf', at: [1, 8], hp: 11, atk: 5, def: 3, mv: 3, role: 'wall', line: 'seelow' },
            { id: 'z9b', tag: '9군', side: 'axis', name: '제9군 보병', sub: '젤로 마을', kind: 'inf', at: [2, 8], hp: 11, atk: 5, def: 3, mv: 3, role: 'wall', line: 'seelow' },
            { id: 'z9c', tag: '9군', side: 'axis', name: '제9낙하산사단', sub: '젤로 고지', kind: 'inf', at: [3, 8], hp: 9, atk: 5, def: 3, mv: 3, role: 'wall', line: 'seelow' },
            { id: 'z9d', tag: '9군', side: 'axis', name: '제9군 보병', sub: '젤로 고지 남쪽', kind: 'inf', at: [4, 8], hp: 11, atk: 5, def: 3, mv: 3, role: 'wall', line: 'seelow' },
            { id: 'zpz', tag: '56기갑', side: 'axis', name: '제56기갑군단', sub: '바이들링', kind: 'tank', at: [2, 6], hp: 11, atk: 6, def: 3, mv: 4, role: 'guard', reach: 3, person: ['헬무트 바이들링', 'helmuth-weidling'] },
            { id: 'zss', tag: '노르트란트', side: 'axis', name: '친위 「노르트란트」 사단', sub: '시가 동쪽', kind: 'inf', at: [3, 5], hp: 11, atk: 6, def: 3, mv: 3, role: 'guard', reach: 2 },
            { id: 'zv1', tag: '돌격대', side: 'axis', name: '국민돌격대', sub: '노인과 소년', kind: 'inf', at: [1, 5], hp: 6, atk: 3, def: 2, mv: 2, role: 'hold' },
            { id: 'zv2', tag: '돌격대', side: 'axis', name: '국민돌격대', sub: '남쪽 시가', kind: 'inf', at: [5, 3], hp: 6, atk: 3, def: 2, mv: 2, role: 'hold' },
            { id: 'zv3', tag: '소년단', side: 'axis', name: '히틀러 소년단 대전차조', sub: '판처파우스트', kind: 'at', at: [4, 4], hp: 5, atk: 4, def: 2, mv: 2, role: 'hold' },
            { id: 'zfl', tag: '대공포탑', side: 'axis', name: '동물원 대공포탑', sub: '128밀리 대공포', kind: 'art', at: [2, 2], hp: 9, atk: 6, def: 3, mv: 0, range: 3, role: 'hold' },
            { id: 'zrt', tag: '제국의회', side: 'axis', name: '제국의회 수비대', sub: '친위대와 수병', kind: 'inf', at: [2, 3], hp: 12, atk: 5, def: 3, mv: 2, role: 'hold' },
            { id: 'zmk', tag: '몽케', side: 'axis', name: '몽케 전투단', sub: '관청가', kind: 'inf', at: [3, 3], hp: 9, atk: 5, def: 3, mv: 2, role: 'guard', reach: 1 },
            { id: 'zwk', tag: '12군', side: 'axis', name: '벵크의 제12군', sub: '엘베강에서 돌아서', kind: 'inf', at: [5, 0], hp: 9, atk: 5, def: 3, mv: 3, role: 'hunt', arrive: 6 },
        ],
        summary: '제국의회에 서면 승리 · 9턴 · 고지를 돌거나 포격으로 깎는다',
        brief: [
            '오데르강의 퀴스트린 교두보에서 베를린까지 70킬로미터다. 그 사이에 젤로 고지가 있다. 남동쪽에서는 코네프의 제1우크라이나 전선군이 나이세강을 건너 온다.',
            '제국의회에 붉은 부대를 세우면 전쟁이 끝난다. 9턴이 주어진다.',
            '젤로 고지는 방어 +3이다. 포병이 칠 때마다 방어가 1씩 깎이고, 붉은 부대가 고지 뒤(점선 구역)에 서면 수비대는 퇴로를 걱정해 진지의 이점을 거의 잃는다. 남쪽에는 고지가 없다. 전차군이 그리로 돌 수 있다.',
            '시가는 방어 +2에 이동 2다. 전차는 시가에서 대전차조에 약하다. 제국의회는 방어 +3이고 포격으로 깎인다. 동물원 대공포탑은 사거리 3으로 쏜다. 제16항공군이 1·3·5·7턴에 독일군을 친다. 6턴에 벵크의 제12군이 서쪽에서 온다.',
            '결정적 한 수(★): 제8근위군의 「돌격조」는 진지의 방어를 무시한다. 제3충격군의 「승리의 깃발」, 카추샤의 「일제 사격」, 사령부의 「전차군을 넣는다」.',
            SUPPLY_BRIEF,
        ],
        history: '4월 16일 새벽 공세가 시작되었다. 젤로 고지는 사흘 만에 넘어갔고, 그 값은 붉은 군대 3만 명이었다. 25일 주코프와 코네프의 선봉이 포츠담 서쪽에서 만나 도시를 가뒀고, 같은 날 엘베강의 토르가우에서 미군과 만났다. 30일 히틀러가 벙커에서 자살했고, 그날 밤 제국의회에 깃발이 올랐다. 5월 2일 바이들링이 항복했다. 베를린 작전에서 붉은 군대는 8만 명 가까이 전사했다.',
    };

    const battles = { yelnya, moscow: moscowBattle, stalingrad: stalingradBattle, uranus: uranusBattle, kursk: kurskBattle, bagration: bagrationBattle, berlin: berlinBattle };

    // ── The map ──
    // The trunk railways of 1941 by station [lat, lon] (approximate);
    // junctions repeat the same coordinates so the lines make one net.
    const M = [55.76, 37.62];
    const railways = [
        { id: 'october', name: '모스크바–레닌그라드 철도', label: [57.6, 35.2], pts: [M, [56.86, 35.90], [57.88, 34.05], [59.12, 31.68], [59.94, 30.31]] },
        { id: 'novgorod', name: '추도보–노브고로드', pts: [[59.12, 31.68], [58.52, 31.27]] },
        { id: 'baltic', name: '레닌그라드–프스코프–리가', pts: [[59.94, 30.31], [58.74, 29.85], [57.82, 28.33], [57.54, 25.42], [56.95, 24.11]] },
        { id: 'pskov-novgorod', name: '노브고로드–프스코프', pts: [[58.52, 31.27], [58.02, 29.9], [57.82, 28.33]] },
        { id: 'prussia', name: '리가–쾨니히스베르크', pts: [[56.95, 24.11], [55.93, 23.32], [55.08, 21.88], [54.71, 20.51]] },
        { id: 'minsk', name: '모스크바–민스크–브레스트 철도', label: [54.9, 31.0], pts: [M, [55.50, 36.03], [55.21, 34.30], [54.78, 32.05], [54.51, 30.42], [53.90, 27.57], [53.13, 26.01], [52.10, 23.70]] },
        { id: 'warsaw', name: '브레스트–바르샤바–베를린', pts: [[52.10, 23.70], [52.23, 21.01], [52.41, 16.93], [52.34, 14.55], [52.52, 13.40]] },
        { id: 'kursk', name: '모스크바–쿠르스크–하리코프 철도', pts: [M, [54.19, 37.62], [52.97, 36.07], [51.73, 36.19], [50.60, 36.59], [49.99, 36.23]] },
        { id: 'ryazan', name: '모스크바–보로네시–로스토프 철도', pts: [M, [54.63, 39.74], [52.90, 40.50], [52.50, 39.93], [51.67, 39.20], [50.20, 39.57], [48.15, 40.20], [47.24, 39.71]] },
        { id: 'voronezh-kursk', name: '보로네시–쿠르스크', pts: [[51.67, 39.20], [51.83, 38.13], [51.73, 36.19]] },
        { id: 'kiev', name: '하리코프–키예프', pts: [[49.99, 36.23], [49.59, 34.55], [50.45, 30.52]] },
        { id: 'lvov', name: '키예프–리보프–크라쿠프', pts: [[50.45, 30.52], [49.71, 28.83], [50.18, 27.06], [49.84, 24.03], [49.78, 22.77], [50.06, 19.94]] },
        { id: 'prague', name: '크라쿠프–프라하', pts: [[50.06, 19.94], [49.84, 18.29], [49.59, 17.25], [50.08, 14.44]] },
        { id: 'stalingrad', name: '모스크바–스탈린그라드 철도', label: [51.0, 43.0], pts: [[52.50, 39.93], [51.20, 42.25], [49.80, 43.66], [48.71, 44.51]] },
        { id: 'likhaya', name: '스탈린그라드–리하야', pts: [[48.71, 44.51], [48.35, 41.83], [48.15, 40.20]] },
        { id: 'donbass', name: '로스토프–스탈리노', pts: [[47.24, 39.71], [47.21, 38.93], [48.00, 37.80]] },
        { id: 'odessa', name: '스탈리노–오데사', pts: [[48.00, 37.80], [48.46, 35.05], [47.90, 33.34], [46.97, 32.00], [46.48, 30.73]] },
        { id: 'bucharest', name: '오데사–부쿠레슈티', pts: [[46.48, 30.73], [46.84, 29.63], [47.16, 27.59], [44.94, 26.02], [44.43, 26.10]] },
        { id: 'danube', name: '부쿠레슈티–부다페스트–빈', pts: [[44.43, 26.10], [44.32, 23.80], [45.75, 21.23], [46.25, 20.15], [47.50, 19.04], [47.69, 17.63], [48.21, 16.37]] },
        { id: 'caucasus', name: '로스토프–그로즈니 철도', label: [44.9, 42.3], pts: [[47.24, 39.71], [45.85, 40.13], [45.00, 41.12], [44.21, 43.14], [43.32, 45.69]] },
        { id: 'kuban', name: '티호레츠크–크라스노다르', pts: [[45.85, 40.13], [45.04, 38.98]] },
        { id: 'crimea', name: '크라스노다르–세바스토폴', pts: [[45.04, 38.98], [45.35, 36.47], [45.71, 34.39], [44.95, 34.10], [44.62, 33.53]] },
    ];

    const map = {
        box: { west: 11.5, east: 48.5, south: 42.2, north: 61.2 }, control: 'great-patriotic-war', title: '대조국전쟁 작전 지도',
        hub: moscow, hubId: 'moscow', railways,
        labelAt: { 힘키: [-4, -9, 'end'], 모자이스크: [-6, 14, 'end'], 뱌지마: [0, -9, 'middle'], 하리코프: [8, 4, 'start'], 스탈리노: [0, -9, 'middle'] },
        places: [
            ['볼가강', 50.9, 46.1, 'river'], ['돈강', 49.6, 41.2, 'river'], ['드네프르강', 49.2, 32.4, 'river'], ['비스와강', 51.4, 21.6, 'river'], ['오데르강', 52.9, 14.5, 'river'],
            ['벨로루시', 53.2, 28.6, 'region'], ['우크라이나', 48.9, 31.0, 'region'], ['크림', 45.3, 34.3, 'region'], ['돈바스', 48.5, 38.6, 'region'], ['캅카스', 43.6, 43.0, 'region'],
            ['발트 지역', 57.4, 25.6, 'region'], ['동프로이센', 54.0, 21.3, 'region'], ['루마니아', 45.6, 25.2, 'region'], ['헝가리', 46.9, 19.8, 'region'], ['폴란드', 51.6, 19.6, 'region'],
            ['르제프', 56.26, 34.33, 'town', 'above'], ['툴라', 54.19, 37.62, 'town', 'below'], ['오룔', 52.97, 36.07, 'town'], ['쿠르스크', 51.73, 36.19, 'town', 'below'],
            ['티흐빈', 59.64, 33.53, 'town', 'above'], ['옐냐', 54.57, 33.17, 'town', 'below'], ['칼라치', 48.69, 43.53, 'town', 'below'], ['보브루이스크', 53.15, 29.23, 'town', 'below'],
            ['코르순', 49.42, 31.26, 'town', 'below'], ['마이코프', 44.61, 40.10, 'town', 'below'],
        ],
        beyond: [['우랄의 공장', 56.84, 60.6], ['무르만스크', 68.97, 33.08], ['쿠이비셰프', 53.2, 50.15], ['바쿠', 40.41, 49.87], ['엘베강', 51.56, 13.0]],
        legend: [['cw-key-held', '붉은 군대'], ['cw-key-lost k-axis', '독일과 추축국']],
        historyLegend: [['is-red', '소련군'], ['is-blue', '독일과 추축국'], ['is-purple', '서방 연합군'], ['is-gray', '휴전 (핀란드)']],
    };

    // ── Pictures (public/images/great-patriotic-war/, CREDITS.md there) ──
    const C = file => 'https://commons.wikimedia.org/wiki/File:' + file;
    const pictures = {
        cover: { w: 1600, h: 1155, sm: true, caption: '예브게니 할데이, 「제국의회 위의 깃발」, 1945년 5월 2일', credit: ['예브게니 할데이', C('Raising_a_flag_over_the_Reichstag_-_Restoration.jpg')] },
        barbarossa: { w: 1178, h: 1600, sm: true, caption: '1941년 6월 22일 모스크바, 전쟁이 시작되었다는 방송을 듣는 시민들', credit: ['예브게니 할데이', C('Первый_день_войны._Объявление_о_начале_Великой_Отечественной_войны._Улица_25-го_Октября.jpg')] },
        smolensk1941: { w: 1600, h: 1051, sm: true, caption: '1941년 6월 말, 벨로루시의 길 위의 피란민', credit: ['다비트 민스케르 · CC BY 4.0', C('Беженцы_на_дороге_в_Белорусской_ССР_конец_июня_1941_г._фото_Минскера.jpg')] },
        yelnya: { w: 1600, h: 1123, sm: true, caption: '되찾은 옐냐를 지나는 예비 전선군 부대, 1941년 9월', credit: ['레오니트 벨리크자닌', C('Продвижение_советских_войск_24-й_и_43-й_армий_Резервного_фронта_через_освобожденный_город_Ельня,_1941_г.jpg')] },
        "moscow-parade": { w: 1600, h: 1053, sm: true, caption: '1941년 11월 7일 붉은 광장의 열병식, 기관총 부대', credit: ['미하일 칼라시니코프', C('Парад_а_Красной_площади_7_ноября_1941_года._Пулеметчики.jpg')] },
        "moscow-defence": { w: 1127, h: 688, sm: true, caption: '모스크바 「프라우다」 인쇄소 앞의 대전차 장애물과 바리케이드, 1941년', credit: ['미하일 칼라시니코프', C('Противотанковые_ежи_и_баррикады_у_комбината_«Правда».jpg')] },
        "moscow-counter": { w: 1311, h: 816, sm: true, caption: '되찾은 클린을 지나 행군하는 붉은 군대, 1941년 12월', credit: ['레오니트 벨리크자닌', C('Битва_за_Москву._Советские_войска_на_марше_проходят_через_освобожденный_город_Клин.jpg')] },
        "general-offensive": { w: 1024, h: 682, sm: true, caption: '공격에 나선 붉은 군대 보병, 1942년 2월', credit: ['막시모프 · RIA 노보스티 · CC BY-SA 3.0', C('RIAN_archive_301_An_attack.jpg')] },
        kharkov1942: { w: 800, h: 600, caption: '테르노바야 역 부근의 전투, 남서전선군, 1942년 5월', credit: ['세묜 알페린', C('Семён_Альперин._Бой_в_районе_станции_Терновая._Юго-Западный_фронт._1942_год.jpg')] },
        blau: { w: 800, h: 523, caption: '스탈린그라드로 진격하는 독일군, 1942년 8월', credit: ['헤르버 · 독일 연방문서고 · CC BY-SA 3.0 de', C('Bundesarchiv_Bild_183-B28114,_Russland,_Kampf_um_Stalingrad,_Vormarsch.jpg')] },
        order227: { w: 671, h: 1024, caption: '스탈린그라드의 폐허에서 싸우는 붉은 군대 병사들, 1942년', credit: ['게오르기 젤마 · RIA 노보스티 · CC BY-SA 3.0', C('RIAN_archive_602770_Battle_of_Stalingrad.jpg')] },
        uranus: { w: 950, h: 854, sm: true, caption: '소비에츠키에서 만난 두 전선군의 병사들, 1942년 11월', credit: ['사진가 미상', C('Chiusura_della_sacca.jpg')] },
        paulus: { w: 1196, h: 804, sm: true, caption: '포로가 된 파울루스 원수, 1943년 2월', credit: ['예핌 코피트', C('Паулюс_фото_Копыта.jpg')] },
        kursk: { w: 1600, h: 905, sm: true, caption: '프로호롭카에서 T-34 전차 뒤를 따라 반격하는 보로네시 전선군, 1943년 7월', credit: ['붉은 군대 사진가 · 러시아 국방부 · CC BY 4.0', C('Soviet_troops_and_T-34_tanks_counterattacking_Kursk_Voronezh_Front_July_1943.jpg')] },
        dnieper: { w: 1600, h: 958, sm: true, caption: '드네프르강을 건너는 붉은 군대, 로예프 부근, 1943년 10월', credit: ['알렉산드르 디틀로프', C('Форсирование_Днепра_в_районе_г.п._Лоев_Гомельской_области.jpg')] },
        leningrad: { w: 1024, h: 688, sm: true, caption: '라도가호의 얼음길 「생명의 길」, 1941–1942년', credit: ['예브게니 할데이', C('Фото_"«Дорога_жизни»"_(183932_3).jpg')] },
        bagration: { w: 1600, h: 1067, sm: true, caption: '1944년 7월 17일, 모스크바 거리를 지나는 독일군 포로를 지켜보는 시민들', credit: ['미하일 트라흐만 · 모스크바시 문서고 · CC BY 4.0', C('Muscovites_on_Parade_of_the_Vanquished.jpg')] },
        warsaw1944: { w: 1095, h: 1600, sm: true, caption: '봉기 뒤 폐허가 된 바르샤바, 1945년', credit: ['사진가 미상', C('Ruins_of_Warsaw_(1945)_3.jpg')] },
        'vistula-oder': { w: 1600, h: 1054, sm: true, caption: '부서진 다리 곁에서 오데르강에 부교를 놓는 공병, 1945년 1월', credit: ['세묜 알페린', C('Советские_саперы_наводят_понтонную_переправу_через_реку_Одер_рядом_с_разрушенным_мостом.jpg')] },
        berlin: { w: 1447, h: 1080, sm: true, caption: '베를린 시가의 전투, 1945년 4월', credit: ['빅토르 툐민 · 러시아 국방부 · CC BY 4.0', C('Темин_Бой_на_улицах_Берлина.jpg')] },
        reichstag: { w: 800, h: 796, caption: '불탄 제국의회 건물, 1945년 7월', credit: ['영국 육군 사진반', C('Berlin-_the_Capture_and_Aftermath_of_War_1945-1947_BU8922.jpg')] },
        victory: { w: 1600, h: 1231, sm: true, caption: '1945년 5월 8일 베를린 카를스호르스트, 항복 문서에 서명하는 카이텔 원수', credit: ['미 육군 사진병', C('Field_Marshal_Keitel_signs_German_surrender_terms_in_Berlin_8_May_1945_-_Restoration.jpg')] },
    };

    // ── Portraits (art.js FEATURES) ──
    const portraits = {
        stalin: { side: 'red', hair: 'swept', moustache: 'great', grey: true, dress: 'tunic' },
        molotov: { side: 'red', hair: 'swept', glasses: 'pince', moustache: true, dress: 'suit' },
        zhukov: { side: 'red', cap: 'peaked', face: 'square', dress: 'tunic' },
        vasilevsky: { side: 'red', cap: 'peaked', face: 'square', brows: 'heavy', dress: 'boards' },
        'boris-shaposhnikov': { side: 'red', hair: 'swept', face: 'long', grey: true, dress: 'tunic' },
        timoshenko: { side: 'red', hair: 'bald', face: 'long', dress: 'tunic' },
        'semyon-budyonny': { side: 'red', cap: 'peaked', moustache: 'great', dress: 'tunic' },
        voznesensky: { side: 'red', hair: 'swept', face: 'square', dress: 'suit' },
        'mikhail-kirponos': { side: 'red', cap: 'peaked', face: 'long', dress: 'tunic' },
        'konstantin-rokossovsky': { side: 'red', cap: 'peaked', face: 'long', dress: 'boards' },
        'kirill-meretskov': { side: 'red', cap: 'ushanka', face: 'square', dress: 'greatcoat' },
        chuikov: { side: 'red', hair: 'shock', face: 'square', brows: 'heavy', dress: 'tunic' },
        beria: { side: 'red', hair: 'bald', glasses: 'pince', dress: 'suit' },
        'nikolai-vatutin': { side: 'red', cap: 'peaked', face: 'square', dress: 'boards' },
        'ivan-tyulenev': { side: 'red', cap: 'peaked', moustache: true, dress: 'tunic' },
        'pavel-rotmistrov': { side: 'red', cap: 'peaked', glasses: 'round', moustache: true, dress: 'boards' },
        'fyodor-tolbukhin': { side: 'red', cap: 'peaked', brows: 'heavy', dress: 'boards' },
        'ivan-konev': { side: 'red', hair: 'bald', face: 'square', dress: 'boards' },
        'vasily-sokolovsky': { side: 'red', cap: 'peaked', face: 'long', brows: 'heavy', dress: 'boards' },
        'leonid-govorov': { side: 'red', cap: 'peaked', moustache: true, dress: 'boards' },
        malinovsky: { side: 'red', hair: 'swept', face: 'square', brows: 'heavy', dress: 'boards' },
        'aleksei-antonov': { side: 'red', hair: 'swept', face: 'long', dress: 'boards' },
        'ivan-bagramyan': { side: 'red', hair: 'bald', moustache: true, dress: 'boards' },
        'alexander-shcherbakov': { side: 'red', hair: 'swept', glasses: 'round', dress: 'tunic' },
        sorge: { side: 'red', hair: 'shock', face: 'long', brows: 'heavy', dress: 'suit' },
        'alexander-novikov': { side: 'red', cap: 'peaked', dress: 'boards' },
        'pavel-rybalko': { side: 'red', hair: 'bald', brows: 'heavy', dress: 'boards' },
        'panteleimon-ponomarenko': { side: 'red', hair: 'swept', dress: 'tunic' },
        'mikhail-katukov': { side: 'red', cap: 'ushanka', face: 'long', dress: 'leather' },
        'alexander-rodimtsev': { side: 'red', cap: 'pilotka', face: 'long', dress: 'tunic' },
        'andrei-yeryomenko': { side: 'red', cap: 'peaked', face: 'square', brows: 'heavy', dress: 'greatcoat' },
        'pavel-batov': { side: 'red', cap: 'pilotka', dress: 'boards' },
        'lev-mekhlis': { side: 'red', hair: 'shock', face: 'long', dress: 'tunic' },
        // Soldiers who speak for their units, by the year's uniform.
        'red-soldier-41': { side: 'red', cap: 'pilotka', dress: 'tunic' },
        'red-soldier-42': { side: 'red', cap: 'helmet', dress: 'greatcoat' },
        'red-soldier-43': { side: 'red', cap: 'helmet', moustache: true, dress: 'boards' },
        'red-soldier-45': { side: 'red', cap: 'pilotka', moustache: true, dress: 'boards' },
        'winston-churchill': { side: 'interv', hair: 'bald', face: 'square', dress: 'suit' },
        'tadeusz-bor-komorowski': { side: 'national', cap: 'maciejowka', moustache: true, dress: 'field' },
        'adolf-hitler': { side: 'axis', hair: 'swept', moustache: true, dress: 'feldgrau' },
        'wilhelm-ritter-von-leeb': { side: 'axis', cap: 'peaked', face: 'long', grey: true, moustache: true, dress: 'feldgrau' },
        'heinz-guderian': { side: 'axis', cap: 'peaked', moustache: true, dress: 'feldgrau' },
        'hermann-hoth': { side: 'axis', cap: 'peaked', face: 'long', dress: 'feldgrau' },
        'erich-von-manstein': { side: 'axis', cap: 'peaked', face: 'long', brows: 'heavy', dress: 'feldgrau' },
        'friedrich-paulus': { side: 'axis', cap: 'peaked', face: 'long', grey: true, dress: 'greatcoat' },
        'walter-model': { side: 'axis', cap: 'peaked', glasses: 'round', dress: 'feldgrau' },
        'gotthard-heinrici': { side: 'axis', cap: 'peaked', face: 'square', dress: 'feldgrau' },
        'helmuth-weidling': { side: 'axis', cap: 'stahlhelm', glasses: 'round', dress: 'feldgrau' },
        'ion-antonescu': { side: 'axis', cap: 'peaked', face: 'square', brows: 'heavy', dress: 'epaulets' },
    };

    // What each speaker was at the time ([season id, title] pairs in
    // calendar order when the post changed).
    const roles = {
        stalin: '최고사령관',
        molotov: '외무인민위원',
        zhukov: [['barbarossa', '총참모장'], ['typhoon', '서부전선군 사령관'], ['stalingrad', '최고사령관 대리'], ['bagration', '스타프카 대표'], ['vistula', '제1벨로루시 전선군 사령관']],
        vasilevsky: [['barbarossa', '총참모장 대리'],['stalingrad', '총참모장'], ['berlin', '제3벨로루시 전선군 사령관']],
        'boris-shaposhnikov': '총참모장',
        timoshenko: [['barbarossa', '국방인민위원'], ['typhoon', '남서 방면 총사령관']],
        'semyon-budyonny': '남서 방면 총사령관',
        voznesensky: '국가계획위원회 의장',
        'mikhail-kirponos': '남서전선군 사령관',
        'konstantin-rokossovsky': [['typhoon', '제16군 사령관'], ['uranus', '돈 전선군 사령관'], ['dnieper', '중부전선군 사령관'], ['bagration', '제1벨로루시 전선군 사령관']],
        'kirill-meretskov': '볼호프 전선군 사령관',
        chuikov: [['stalingrad', '제62군 사령관'], ['berlin', '제8근위군 사령관']],
        beria: '내무인민위원',
        'nikolai-vatutin': [['uranus', '남서전선군 사령관'], ['kursk', '보로네시 전선군 사령관'], ['dnieper', '제1우크라이나 전선군 사령관']],
        'ivan-tyulenev': '자캅카스 전선군 사령관',
        'pavel-rotmistrov': '제5근위전차군 사령관',
        'fyodor-tolbukhin': [['kursk', '남부전선군 사령관'], ['korsun', '제4우크라이나 전선군 사령관'], ['berlin', '제3우크라이나 전선군 사령관']],
        'ivan-konev': [['dnieper', '초원 전선군 사령관'], ['korsun', '제2우크라이나 전선군 사령관'], ['bagration', '제1우크라이나 전선군 사령관']],
        'vasily-sokolovsky': '서부전선군 사령관',
        'leonid-govorov': '레닌그라드 전선군 사령관',
        malinovsky: [['uranus', '제2근위군 사령관'], ['korsun', '제3우크라이나 전선군 사령관'], ['vistula', '제2우크라이나 전선군 사령관']],
        'aleksei-antonov': '총참모부 제1차장',
        'ivan-bagramyan': '제1발트 전선군 사령관',
        'lev-mekhlis': '제4우크라이나 전선군 군사평의회 위원',
        'winston-churchill': '영국 총리',
        'tadeusz-bor-komorowski': '폴란드 국내군 사령관',
        'adolf-hitler': '독일 총통',
        'wilhelm-ritter-von-leeb': '북부 집단군 사령관',
        'heinz-guderian': '제2기갑 집단 사령관',
        'hermann-hoth': '제4기갑군 사령관',
        'erich-von-manstein': [['blau', '제11군 사령관'], ['uranus', '돈 집단군 사령관'], ['kursk', '남부 집단군 사령관']],
        'friedrich-paulus': '제6군 사령관',
        'walter-model': [['general', '제9군 사령관'], ['bagration', '중부 집단군 사령관']],
        'gotthard-heinrici': '비스와 집단군 사령관',
        'ion-antonescu': '루마니아 국가 지도자',
    };

    // Words a newcomer may not know (the briefs and the events).
    const glossary = [
        { term: '적의 힘', gloss: '그 전선에서 역사만큼 해내는 데 드는 힘. 우리 힘이 이만큼이면 역사대로 간다.', href: null },
        { term: '우리 힘', gloss: '전선에 보낸 군과 스타프카 대표, 카드가 함께 내는 힘.', href: null },
        { term: '지휘력', gloss: '조언자의 카드를 쓰는 데 드는 점수. 지휘 체계가 설수록 많다.', href: null },
        { term: '지휘 체계', gloss: '최고사령부와 전선 지휘관이 서로 얼마나 믿고 맞물려 움직이는가. 낮아지면 지휘력과 스타프카 대표가 준다.', href: null },
        { term: '스타프카 대표', gloss: '최고사령부가 전선에 보내 여러 전선군을 함께 움직이게 한 사람. 주코프와 바실렙스키가 주로 맡았다. 전선에 두면 우리 힘이 는다.', href: T('stavka') },
        { term: '스타프카', gloss: '붉은 군대의 최고사령부. 스탈린이 최고사령관이었다.', href: T('stavka') },
        { term: '총참모부', gloss: '작전 계획을 짜는 최고사령부의 두뇌. 총참모장은 주코프, 샤포시니코프, 바실렙스키, 안토노프 순으로 맡았다.', href: T('stavka') },
        { term: '전선군', gloss: '여러 군을 묶은 붉은 군대의 가장 큰 작전 단위. 독일군의 집단군에 해당한다.', href: null },
        { term: '집단군', gloss: '여러 군을 묶은 독일군의 가장 큰 작전 단위.', href: null },
        { term: '기갑 집단', gloss: '전차 사단과 차량화 사단만 묶은 독일군의 기동 부대. 뒤에 기갑군이 되었다.', href: T('blitzkrieg') },
        { term: '포위망', gloss: '적을 사방에서 둘러싸 보급과 퇴로를 끊은 것. 이 전쟁의 큰 싸움은 대부분 포위로 결판났다.', href: null },
        { term: '돌출부', gloss: '전선이 적 쪽으로 불룩 튀어나온 곳. 양쪽 밑동을 치면 통째로 잘린다.', href: null },
        { term: '교두보', gloss: '강 건너편에 미리 잡아 둔 발판.', href: null },
        { term: '소개 위원회', gloss: '공장과 사람을 동쪽으로 옮기는 일을 맡은 기관. 1941년 6월 24일 섰다.', href: T('soviet-evacuation-1941') },
        { term: '차단분견대', gloss: '전선 바로 뒤에서 허가 없이 물러나는 병사를 붙잡은 부대.', href: T('blocking-detachments') },
        { term: '형벌 부대', gloss: '군법을 어긴 장교와 병사를 가장 위험한 곳에 세운 부대.', href: T('order-no-227') },
        { term: '근위', gloss: '전투에서 공을 세운 부대가 받은 칭호. 급여와 장비가 더 나왔다.', href: T('soviet-guards') },
        { term: '전차군', gloss: '전차군단과 기계화군단만으로 짠 군. 뚫린 틈으로 들어가 적의 뒤를 달렸다.', href: T('deep-operation') },
        { term: '파르티잔', gloss: '점령지에서 독일군의 뒤를 친 무장대.', href: T('soviet-partisan-movement') },
        { term: '무기대여', gloss: '미국이 연합국에 무기와 물자를 빌려준 제도.', href: T('lend-lease') },
        { term: '성채 작전', gloss: '1943년 여름 독일군이 쿠르스크 돌출부를 잘라 내려 한 공세.', href: T('operation-citadel') },
        { term: '청색 작전', gloss: '1942년 여름 독일군이 볼가강과 캅카스의 유전을 향해 벌인 공세.', href: T('case-blue-fall-blau') },
        { term: '국내군', gloss: '런던의 폴란드 망명정부를 따른 지하 군대.', href: T('polish-government-in-exile') },
        { term: '국민돌격대', gloss: '1944년 가을 독일이 16–60세 남자를 모아 만든 민병대.', href: T('volkssturm') },
        { term: '내무인민위원', gloss: '경찰과 국경 수비, 수용소를 맡은 내무인민위원부(NKVD)의 우두머리.', href: null },
        { term: '내무군', gloss: '내무인민위원부에 딸린 군대. 후방 경비와 추방 작전을 맡았다.', href: null },
    ];

    // ── The screen's words ──
    const ui = {
        aria: { calendar: '열두 시기', stats: '나라의 상황', army: '붉은 군대의 구성' },
        player: '붉은 군대', playerUnits: '붉은 부대', enemy: '독일군', enemyAll: '독일과 추축국',
        unit: '군', leader: '스타프카 대표', food: '보급', unrest: '재편',
        hud: [
            { stat: 'manpower', label: '인력', note: '동원에 영향', warnBelow: 35, warnNote: '동원이 준다', chart: 40, chartNote: '40 이상이면 별' },
            { stat: 'industry', label: '생산', note: '보급에 영향', warnBelow: 45, chart: null },
            { stat: 'staff', label: '지휘 체계', warnBelow: 40, command: true, chart: 30, chartNote: '30 아래면 대표 −1', split: '불신: 스타프카 대표 −1' },
        ],
        cardStats: { manpower: '인력', industry: '생산', staff: '지휘' },
        words: { strength: '우리 힘', pressure: '적의 힘', perDivision: '군 하나의 힘' },
        save: 'great-patriotic-war-v1-save',
        theme: 'axis', caps: { red: 'helmet', white: 'stahlhelm' },
        medal: {
            name: '모스크바의 축포', short: '축포',
            rule: '어느 전선도 역사보다 뒤처지지 않고 한 곳 이상 앞서면',
            note: '1943년 8월 5일 오룔과 벨고로드를 되찾은 날 밤, 모스크바에서 포 124문이 열두 번 쏘았다. 전쟁의 첫 축포였고, 그 뒤 큰 도시를 되찾을 때마다 울렸다.',
        },
        merits: { quick: '빠른 승리', whole: '한 부대도 잃지 않음' },
        coach: { stats: '위의 세 막대가 나라의 형편입니다. 인력은 전선에 설 사람, 생산은 공장이 대는 무기와 포탄, 지휘 체계는 최고사령부와 장군들 사이의 믿음입니다.' },
        kinds: { tank: '전차', at: '대전차포' },
    };

    // ── The campaign's rules (war/engine.js; schema in dev_docs/war-engine.md) ──
    const texts = {
        leader: '스타프카 대표',
        moved: '철도로 옮겨 온 군 {n}',
        momentumPart: '적의 기세 +{n}',
        pursuitPart: '추격 −{n}',
        behindPart: '역사보다 밀린 전선 +{n}',
        aheadPart: '역사보다 앞선 전선 −{n}',
        battleLost: '{title} 실패',
        battleQuick: '{title} ({quick}턴 안)',
        battleWon: '{title} 성공',
        hunger: '포탄과 연료가 모자랐다. 다음 시기, 흩어진 부대만큼 군이 준다.',
        momentumNote: '{front}: 더 잃을 도시가 없는데도 막지 못해, 적이 기세를 몰아 온다. 이 전선의 다음 싸움에서 적의 힘 +{n}.',
        pursuitNote: '{front}: 무너진 적을 쫓는다. 이 전선의 다음 싸움에서 적의 힘 −{n}.',
    };

    // Stats (0–100) and supply. Manpower: the people left to put in the
    // line (the war cost the Union some 27 million lives); industry: what
    // the works turn out; staff: how well the Stavka and its generals
    // work together. Supply each season: 6, one more per 10 industry,
    // cards. A sent army uses 1, one in reserve half.
    const UPKEEP = 3;
    const economy = {
        stats: { manpower: { start: 70, min: 10 }, industry: { start: 60, min: 20 }, staff: { start: 50, min: 15 } },
        food: { start: 8, base: 6, per: ['industry', 10], fed: 0.5, hunger: 0.75, desert: 6, reserveEats: 0.5 },
        policies: [
            { flag: 'evacuated', label: '우랄로 옮긴 공장', when: { turn: ['general', 'blau', 'stalingrad', 'uranus', 'kursk'] }, each: { industry: 5 } },
        ],
        settleOrder: ['manpower', 'staff', 'cities', 'industry'],
        upkeep: [
            { label: '전쟁의 소모', each: { manpower: -UPKEEP }, note: `전선은 날마다 사람을 삼킨다. 인력 −${UPKEEP}.` },
            { when: { turn: ['barbarossa', 'typhoon'] }, label: '점령당한 공업 지대', each: { industry: -6 }, note: '우크라이나와 돈바스의 공장과 탄광이 적의 손에 떨어졌다. 생산 −6.' },
            { when: { stat: ['manpower', '<', 25] }, label: '바닥난 인력', each: { staff: -3 }, note: '인력이 25 아래다. 채우지 못한 사단을 두고 최고사령부와 전선이 다툰다. 지휘 체계 −3.' },
        ],
    };
    const command = { stat: 'staff', tiers: [[70, 4], [40, 3], [20, 2], [0, 1]], note: '지휘 체계 {value}: 다음 시기 지휘력은 {n}이다.' };
    const leaders = {
        strength: 1.5,
        fewer: [{ when: { stat: ['staff', '<', 30] }, n: 1, note: '최고사령관이 장군들을 믿지 않는다. 다음 시기 스타프카 대표가 하나 준다.' }],
    };
    // An army's quality: the Red Army learns the war.
    const quality = { base: 0.75, mods: [{ when: { turnMin: 2 }, add: 0.1 }, { when: { turnMin: 5 }, add: 0.1 }, { when: { turnMin: 7 }, add: 0.1 }] };
    const mobilize = {
        min: 3, minLabel: '최소 동원',
        sources: [
            { stat: 'manpower', base: 60, per: 10, label: '인력 {value}' },
            { from: 'deserted', label: '보급이 끊겨 흩어진 부대' },
            { fallen: 'north', n: -1, label: '레닌그라드 상실' },
            { from: 'captured', label: '노획한 장비와 해방지의 보충' },
            { when: { flag: 'kievSaved', turn: 'typhoon' }, n: 2, label: '드네프르강 뒤로 물린 남서전선군' },
        ],
    };
    const unrest = { levels: [], note: '' };
    const outcome = { step: 3, slack: 1, momentum: 2, pursuit: 2, chase: 2, transfer: 0.5, standing: 1, standingFrom: 2, standingMax: 3 };
    const spoils = { food: 2, max: 2 };
    const frontMoves = { gained: { manpower: 1, label: '해방한 땅의 보충' }, lost: { industry: -2, label: '잃은 땅의 공장' }, net: { gained: { manpower: 1, label: '해방한 땅의 보충' }, lost: { industry: -2, label: '잃은 땅의 공장' } } };
    const verdict = { behind: { staff: -3, label: '역사보다 뒤처짐', note: '역사보다 밀린 책임을 두고 최고사령관이 전선 지휘관을 갈아 치운다. 지휘 체계 −3.' }, ahead: {} };

    const modifiers = [
        { front: 'west', when: { turn: 'typhoon', flag: 'kievSaved' }, pressure: 4, label: '한 달 일찍 온 태풍' },
        { front: 'west', when: { turn: 'typhoon', choice: 'commit' }, strength: 3, label: '방어선에 넣은 예비 군' },
        { front: 'west', when: { turn: 'general', choice: 'concentrate' }, strength: 4, label: '모스크바 방면에 모은 힘' },
        { fronts: ['north', 'southwest'], when: { turn: 'general', choice: 'concentrate' }, strength: -2, label: '모스크바 방면으로 간 포탄' },
        { front: 'south', when: { turn: 'blau', choice: 'defend' }, pressure: -3, label: '바르벤코보에서 잃지 않은 군' },
        { front: 'south', when: { turn: 'stalingrad', choice: 'feed' }, strength: 3, label: '도시 북쪽 반격에 넣은 예비' },
        { front: 'south', when: { turn: 'uranus', noFlag: 'uranusReady' }, strength: -4, label: '가을에 써 버린 예비' },
        { front: 'southwest', when: { turn: 'uranus', choice: 'halt' }, strength: 4, label: '도네츠강에서 멈춰 채운 군' },
        { fronts: ['south', 'caucasus'], when: { turn: 'uranus', choice: 'halt' }, strength: -2, label: '쫓지 않아 빠져나간 적' },
        { front: 'southwest', when: { turn: 'bagration', flag: 'southMain' }, strength: 3, label: '남쪽에 둔 주공' },
        { front: 'west', when: { turn: 'bagration', flag: 'southMain' }, pressure: 5, label: '온전한 중부 집단군' },
        { front: 'west', when: { turn: 'bagration', choice: 'one' }, strength: -2, label: '한 곳에 몰린 돌파' },
        { front: 'south', when: { turn: 'vistula', choice: 'five' }, strength: 3, label: '닷새 동안 모은 힘' },
        { front: 'west', when: { turn: 'berlin', choice: 'dash' }, strength: -4, label: '열린 포메른 옆구리' },
    ];
    const extraThreats = [];
    const scoring = {
        stars: [
            { id: 'berlin', label: '제국의회의 깃발', when: { won: true } },
            { id: 'history', label: '쥔 도시 합계가 역사 이상', when: { historyDiff: ['>=', 0] } },
            { id: 'manpower', label: '인력 40 이상으로 종전', when: { stat: ['manpower', '>=', 40] } },
        ],
        won: { kicker: '승리', title: '제국의회에 깃발이 올랐다', text: '1945년 5월 8일 밤 베를린 카를스호르스트에서 독일이 무조건 항복에 서명했다. 모스크바 시각으로는 5월 9일이었다.' },
        stalled: { kicker: '베를린을 넘지 못함', title: '베를린 앞에서 멈췄다', text: '제국의회까지 가지 못했다. 역사에서는 4월 30일 밤 깃발이 올랐고, 5월 2일 베를린 수비대가 항복했다.' },
    };
    const epilogue = {
        title: '승리의 값',
        scene: { picture: 'victory' },
        texts: [
            { when: { stat: ['manpower', '>=', 55] }, text: '전쟁은 끝났다. 덜 무모한 공세와 제때 물린 군대가 수백만의 목숨을 남겼다. 그래도 서쪽의 마을 일곱만 곳이 재가 되었고, 돌아오지 못한 사람은 헤아릴 수 없다. 살아남은 사람들이 무너진 드네프르 발전소와 스탈린그라드의 공장을 다시 세운다. 승리는 이 나라를 초강대국으로 만들었고, 그 승리를 이끈 체제를 누구도 물을 수 없게 만들었다.' },
            { when: { stat: ['manpower', '>=', 40] }, text: '전쟁은 끝났다. 소련은 2천만이 넘는 사람을 잃었다. 1923년에 태어난 남자 가운데 살아 돌아온 사람은 몇 되지 않는다. 그래도 최악은 피했다. 장군들은 싸우는 법을 배웠고, 최고사령부는 차츰 그들의 말을 들었다. 승리는 이 나라를 초강대국으로 만들었고, 그 승리를 이끈 체제를 누구도 물을 수 없게 만들었다.' },
            { text: '전쟁은 끝났다. 소련은 2,700만 명을 잃었다. 군인이 870만, 나머지는 점령지에서 학살당하고 굶고 끌려간 민간인이었다. 1941년의 포위망과 1942년의 무모한 공세, 「어떤 값을 치르더라도」 내려진 명령들이 그 숫자에 들어 있다. 마을 7만 곳과 도시 1,700곳이 폐허가 되었다. 승리는 이 나라를 초강대국으로 만들었고, 그 승리를 이끈 체제를 누구도 물을 수 없게 만들었다. 승리의 값을 따져 묻는 일은 1956년에야, 그리고 1980년대 말에야 다시 시작되었다.' },
        ],
        links: [['대조국전쟁', E('great-patriotic-war')], ['얄타 회담과 포츠담 회담', E('yalta-potsdam')], ['대조국전쟁 숭배', T('cult-of-the-great-patriotic-war')], ['흐루쇼프의 비밀 연설', D_('khrushchev-secret-speech-1956')]],
    };

    const promo = {
        pitch: '1941년 6월 22일, 국경이 무너졌다. 최고사령부의 자리에서 군을 나눠 보내고, 모스크바·스탈린그라드·쿠르스크·베를린의 전투를 직접 지휘한다.',
        picture: 'cover',
        events: ['great-patriotic-war'],
        battles: {
            yelnya: { picture: 'yelnya', pitch: '1941년 9월, 주코프가 옐냐 돌출부의 목을 조인다. 이 전쟁에서 독일군이 처음으로 내준 땅.' },
            moscow: { picture: 'moscow-counter', pitch: '볼로콜람스크 대로에서 버티고, 눈 속에 숨겨 둔 예비 군으로 클린을 되찾는다.' },
            stalingrad: { picture: 'order227', events: ['stalingrad'], terms: ['hugging-the-enemy'], pitch: '볼가강을 등진 폐허. 일곱 턴 동안 중앙 나루를 지켜야 강 건너의 배가 닿는다.' },
            uranus: { picture: 'uranus', terms: ['operation-uranus'], pitch: '루마니아군을 지나쳐 달린다. 칼라치의 다리와 소비에츠키에서 두 전선군이 만나면 제6군이 갇힌다.' },
            kursk: { picture: 'kursk', events: ['battle-of-kursk'], terms: ['operation-citadel', 'battle-of-prokhorovka'], pitch: '티거를 앞세운 기갑 쐐기가 온다. 대전차포와 묻어 둔 전차로 오보얀과 프로호롭카를 지킨다.' },
            bagration: { picture: 'bagration', terms: ['operation-bagration'], pitch: '로코솝스키의 두 주먹. 늪을 건너 보브루이스크 뒤를 끊고 강 동쪽의 독일군을 가둔다.' },
            berlin: { picture: 'berlin', events: ['battle-of-berlin'], pitch: '젤로 고지를 넘어 베를린으로. 제국의회에 깃발을 올리면 전쟁이 끝난다.' },
        },
    };

    const rehearsal = { lead: ['reserve'], skip: ['militia', 'pause', 'labour'], guard: { stat: 'manpower', min: 30 }, spread: true };
    const data = {
        id: 'great-patriotic-war', title: '조국 전선 1941–1945', saveVersion: 1, factions, troops, fronts, frontOrder, startLines, cards, turns, battles, epilogue,
        map, ui, portraits, pictures, pictureDir: '/images/great-patriotic-war/', roles, glossary,
        texts, economy, command, leaders, quality, mobilize, unrest, outcome, spoils, frontMoves, verdict, modifiers, extraThreats, scoring, rehearsal, promo,
    };
    if (typeof module === 'object' && module.exports) module.exports = data;
    else (root.WarScenarios = root.WarScenarios || {})[data.id] = data;
})(typeof window !== 'undefined' ? window : globalThis);
