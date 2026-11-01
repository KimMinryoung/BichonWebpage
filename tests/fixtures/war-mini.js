// A war that never was, for the tests only (scripts/test-war-scenarios.js):
// the smallest scenario the war engine (public/js/war/) runs, with other
// names for everything the first scenario has — sides blue and grey,
// morale and trust instead of the peasants and the party, rations instead
// of grain, a line turned from the west (the rear lies east of it) and a
// reserve that answers from the column side. Not published, no history:
// the numbers are only there to be played through.
const fronts = {
    river: {
        name: '강 방면', short: '강',
        cities: [['A', 50, 10], ['B', 50, 12], ['C', 50, 14]],
        history: [1, 2], holders: ['grey', 'grey'],
        defeat: { at: 0, outcome: { kind: 'defeat', title: '수도가 떨어졌다', text: '강을 지키지 못했다.' } },
    },
    hills: {
        name: '언덕 방면', short: '언덕',
        cities: [['D', 52, 10], ['E', 53, 10]],
        history: [1, 1], holders: ['grey', 'hillmen'],
        onLost: { at: 0, effects: { trust: -5 }, note: 'D를 잃었다.', regained: 'D를 되찾았다.' },
        cap: { reach: 1, unlock: { choice: 'push', margin: 5 }, failed: { deserted: 1, note: 'E 앞에서 꺾였다.' }, reached: { note: 'E에 들어갔다.' } },
    },
};

const factions = {
    grey: { name: '회색군', short: '회색', kind: 'white', text: '', sign: 'eagle', cries: { beaten: '물러난다.', surging: '앞으로!' }, spoils: '보급 수레',
        trait: { name: '느린 행군', motion: 'march', when: { leader: false }, by: 1, rule: '지휘관이 없으면 압력 +1' } },
    hillmen: { name: '언덕 부족', short: '부족', kind: 'national', text: '', cries: { beaten: '산으로.', surging: '우리 땅이다!' },
        trait: { name: '산사람', motion: 'charge', when: { stat: ['trust', '<', 50] }, by: 2, rule: '신뢰가 50 아래면 압력 +2' } },
};

const SIDES = { player: 'blue', enemy: 'grey' };
const TERRAIN = {
    '.': { name: '들', cost: 1, def: 0, cls: 'steppe' },
    '~': { name: '강', cost: 99, def: 0, water: true, cls: 'river' },
    T: { name: '보루', cost: 2, def: 2, fort: 'wall', cls: 'trench' },
    v: { name: '마을', cost: 1, def: 1, cls: 'town' },
};

// The player comes from the west; the line's rear is east of the fort.
const ford = {
    id: 'ford', sides: SIDES, front: 'river', final: false,
    title: '여울 전투', date: '1년 봄', settle: '여울로 →', open: '여울 전투 →', board: '여울', reserveName: '회색 예비대',
    legend: [['steppe', '들'], ['trench', '보루']], reward: { quick: 4, quickBy: 2, lostBy: -4 },
    map: [
        '..T...',
        '..T...',
        '..T..v',
        '..T...',
    ],
    voices: [{ when: 'start', unit: 'b1', face: 'blue-soldier', text: '건너가자.' }],
    goals: [{ at: [2, 5], name: '마을' }],
    towns: [], places: [],
    lines: { wall: { name: '보루', rear: { rows: [0, 3], cols: [3, 5] }, label: [3, 4], fallback: [2, 4] } },
    sectors: { east: { name: '동쪽', rows: [0, 3], alarm: { axis: 'c', at: 3, dir: 1 } } },
    turnLimit: 6,
    terrain: TERRAIN,
    units: [
        { id: 'b1', tag: '1', side: 'blue', name: '제1대', kind: 'inf', at: [0, 0], hp: 10, atk: 6, def: 3, mv: 3, lead: true,
            feat: { id: 'charge', name: '돌격', kind: 'strike', plus: 2, text: '', history: '' } },
        { id: 'b2', tag: '2', side: 'blue', name: '제2대', kind: 'inf', at: [3, 0], hp: 10, atk: 6, def: 3, mv: 3, need: 0 },
        { id: 'b3', tag: '포', side: 'blue', name: '포대', kind: 'art', at: [1, 0], hp: 7, atk: 5, def: 1, mv: 2, range: 2 },
        { id: 'g1', tag: '회1', side: 'grey', name: '회색 수비대', kind: 'inf', at: [1, 2], hp: 6, atk: 3, def: 2, mv: 3, role: 'wall', line: 'wall' },
        { id: 'g2', tag: '예비', side: 'grey', name: '회색 예비대', kind: 'cav', at: [3, 5], hp: 5, atk: 3, def: 1, mv: 4, role: 'strike' },
    ],
    summary: '마을에 서면 승리', brief: [], history: '',
};

const siege = {
    id: 'siege', sides: SIDES, front: 'hills', final: true,
    title: '언덕 포위', date: '1년 가을', settle: '언덕으로 →', open: '언덕 포위 →', board: '언덕', reserveName: '',
    legend: [['steppe', '들']],
    map: [
        '.....',
        '..v..',
        '.....',
    ],
    voices: [{ when: 'start', unit: ['s1'], who: ['장군', 'blue-general'], text: '언덕을 친다.' }],
    goals: [{ at: [1, 2], name: '언덕 마을' }],
    towns: [], places: [], lines: {}, sectors: {},
    turnLimit: 5,
    terrain: TERRAIN,
    units: [
        { id: 's1', tag: '1', side: 'blue', name: '제1대', kind: 'inf', at: [0, 0], hp: 10, atk: 6, def: 3, mv: 3, person: ['장군', 'blue-general'] },
        { id: 's2', tag: '2', side: 'blue', name: '제2대', kind: 'inf', at: [2, 0], hp: 10, atk: 6, def: 3, mv: 3 },
        { id: 'h1', tag: '부족', side: 'grey', name: '부족 전사', kind: 'inf', at: [1, 4], hp: 6, atk: 3, def: 1, mv: 3, role: 'hold' },
    ],
    summary: '언덕 마을에 서면 승리', brief: [], history: '',
};

const hub = ['수도', 51, 8];

module.exports = {
    id: 'mini', title: '작은 전쟁', saveVersion: 1,
    factions, fronts, frontOrder: ['river', 'hills'], startLines: { river: 1, hills: 1 },
    troops: { militia: { name: '민병', note: '' } },
    cards: {
        wagon: { title: '수레 행렬', short: '수레', advisor: ['장군', 'blue-general'], cost: 1, target: 'front', bonus: 2, onRail: true, text: '' },
        drill: { title: '훈련', advisor: ['장군', 'blue-general'], cost: 1, morale: 5, divisions: 1, text: '' },
    },
    turns: [
        {
            id: 'spring', date: '1년 봄', end: [1, 4], title: '봄', mobilize: 4, commissars: 1, army: [['militia', 4]], battle: 'ford',
            brief: [], voices: [{ by: 'grey', at: 'river', text: '강은 우리 것이다.' }, { who: ['장군', 'blue-general'], at: 'hub', text: '나아가라.' }],
            threats: { river: { pressure: 3, foes: ['grey'], text: '' }, hills: { pressure: 2, foes: ['hillmen'], text: '' } },
            cards: ['wagon', 'drill'],
            choice: { title: '봄의 갈림길', text: '', options: [{ id: 'rest', label: '쉰다', morale: 3 }, { id: 'march', label: '행군한다', flag: 'marched', divisions: 1 }], history: 'march', after: '', links: [] },
            after: '', links: [],
        },
        {
            id: 'autumn', date: '1년 가을', end: [1, 10], title: '가을', mobilize: 4, commissars: 1, army: [['militia', 4]], battle: 'siege',
            brief: [], voices: [{ by: 'hillmen', at: 'hills', text: '산으로 오라.' }],
            threats: { hills: { pressure: 4, foes: ['hillmen'], text: '' }, river: { pressure: 2, foes: ['grey'], text: '' } },
            cards: ['wagon'],
            incident: { id: 'storm', title: '폭풍', text: '', options: [{ id: 'wait', label: '기다린다', trust: 2 }, { id: 'go', label: '간다', pressure: { hills: 2 }, flag: 'stormed' }], history: 'wait', after: '', links: [] },
            choice: { title: '가을의 갈림길', text: '', options: [{ id: 'push', label: 'E로 밀고 간다', flag: 'push' }, { id: 'hold', label: '지킨다', trust: 4 }], history: 'hold', after: '', links: [] },
            after: '', links: [],
        },
    ],
    battles: { ford, siege },
    epilogue: { title: '그 뒤', texts: [{ when: { stat: ['trust', '>=', 60] }, text: '사람들이 믿었다.' }, { text: '사람들이 흩어졌다.' }], links: [] },
    portraits: { 'blue-general': { side: 'red', cap: 'peaked' }, 'blue-soldier': { side: 'red', cap: 'budenovka' } },
    map: {
        box: { west: 5, east: 20, south: 45, north: 58 }, control: 'none', title: '작은 지도', hub, hubId: 'hub',
        railways: [{ id: 'main', name: '본선', pts: [[51, 8], [50, 10], [50, 12]] }],
        legend: [['cw-key-held', '청군']], historyLegend: [['is-red', '청군']],
    },
    ui: {
        aria: { calendar: '두 시기', stats: '나라의 상황', army: '청군의 구성' },
        player: '청군', playerUnits: '청군 부대', enemy: '회색군', enemyAll: '회색군', unit: '대대', leader: '지휘관', food: '식량', unrest: '소요',
        hud: [{ stat: 'morale', label: '사기', warnBelow: 30, chart: 30, command: true }, { stat: 'trust', label: '신뢰', warnBelow: 40, chart: null }],
        cardStats: { morale: '사기', trust: '신뢰' },
        save: 'war-mini-save',
    },
    texts: {
        leader: '지휘관', moved: '옮겨 온 대대 {n}', momentumPart: '적의 기세 +{n}', pursuitPart: '추격 −{n}',
        battleLost: '{title} 실패', battleQuick: '{title} ({quick}턴 안)', hunger: '식량이 모자랐다.',
        momentumNote: '{front}: 기세 +{n}.', pursuitNote: '{front}: 추격 −{n}.',
    },
    economy: {
        stats: { morale: { start: 50 }, trust: { start: 55, min: 0, max: 80 } },
        food: { start: 2, base: 2, per: ['trust', 20], fed: 0.5, hunger: 0.75, desert: 4, reserveEats: 0.5 },
        policies: [],
    },
    command: { stat: 'morale', tiers: [[60, 3], [30, 2], [0, 1]], note: '사기 {value}: 지휘력 {n}.' },
    leaders: { strength: 1, fewer: [{ when: { stat: ['morale', '<', 20] }, n: 1, note: '지휘관이 떠났다.' }] },
    quality: { base: 1, mods: [{ when: { flag: 'marched' }, add: 0.1 }] },
    mobilize: { min: 1, minLabel: '최소 동원', sources: [{ stat: 'trust', base: 50, per: 10, label: '신뢰 {value}' }, { from: 'deserted', label: '탈영' }, { fallen: 'hills', n: -1, label: 'D 상실' }, { from: 'captured', label: '포로' }] },
    unrest: { levels: [{ when: { stat: ['trust', '<', 30] }, n: 1 }], note: '소요로 대대 {n}개가 묶인다.' },
    outcome: { step: 2, slack: 1, momentum: 1, pursuit: 1, chase: 1, transfer: 0.5 },
    spoils: { food: 1, max: 1 },
    frontMoves: { gained: { trust: 1 }, lost: { trust: -1 } },
    verdict: { behind: { morale: -2, note: '사기가 꺾였다.' }, ahead: { morale: 1 } },
    modifiers: [{ front: 'river', when: { turn: 'spring', choice: 'march' }, strength: 1, label: '행군' }],
    extraThreats: [],
    scoring: {
        stars: [{ id: 'won', label: '언덕을 넘음', when: { won: true } }, { id: 'trust', label: '신뢰 50 이상', when: { stat: ['trust', '>=', 50] } }],
        won: { title: '이겼다', text: '' }, stalled: { title: '멈췄다', text: '' },
    },
};
