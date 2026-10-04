// Revolution and war in the Caucasus, November 1917 – October 1921: a child
// event of the Russian Civil War (civil-war). The ten sections come from
// sec-a (1917, the Baku Commune, the Transcaucasian federation), sec-b
// (Georgia, Armenia), sec-c (Azerbaijan, Britain and the Whites, the North
// Caucasus) and sec-d (Sovietisation, assessment); each part keeps its own
// sources, timeline rows and person relations, joined here in that order.
const { event: buildEvent } = require('./lib');

const parts = ['a', 'b', 'c', 'd'].map(slug => require(`./sec-${slug}`));
const sections = parts.flatMap(p => p.sections);
const timeline = parts.flatMap(p => p.timeline).sort((x, y) => x[0].localeCompare(y[0]));

// A person named in several parts gets one relation: the strongest kind, the
// first side and title, and the parts' notes in section order.
const RANK = ['leader', 'executor', 'participant', 'target', 'witness', 'historian'];
const people = [];
for (const row of parts.flatMap(p => p.people)) {
    const [id, kind, rko, ren, nko, nen, side] = row;
    const seen = people.find(p => p[0] === id);
    if (!seen) { people.push([id, kind, rko, ren, nko, nen, side]); continue; }
    if (RANK.indexOf(kind) < RANK.indexOf(seen[1])) seen[1] = kind;
    if (!seen[6] && side) seen[6] = side;
    if (!seen[4].includes(nko)) seen[4] += ' ' + nko;
    if (!seen[5].includes(nen)) seen[5] += ' ' + nen;
}

// Merged notes that repeat themselves, and Karabekir's role in 1920 rather
// than 1918, written out by hand.
const OVERRIDES = {
    'alexander-khatisian': {
        3: 'Armenian foreign minister and prime minister',
        2: '아르메니아 외무장관·총리',
        4: '트라브존 강화 회의 대표단에 참여했고, 외무장관으로 바투미 조약에 서명했다. 총리로서 「통일 아르메니아 법」을 낭독했고 5월 봉기 와중에 내각과 함께 사임했다. 정부가 사임한 다음 날 새벽 알렉산드로폴 조약에 서명했다.',
        5: 'Sat on the delegation at the Trabzon peace conference and signed the Treaty of Batum as foreign minister. As prime minister he read out the Act of United Armenia and resigned with his cabinet during the May Uprising. Signed the Treaty of Alexandropol in the early hours after his government had resigned.',
    },
    'mammad-amin-rasulzade': {
        4: '1918년 5월 28일 아제르바이잔 민주공화국을 선포한 민족회의를 이끌었고 바투미 조약에 서명했다. 1920년 4월 권력 이양 조건에 반대했으나 다수 의견을 따랐고, 스탈린의 개입으로 처형을 면했다.',
        5: 'Led the National Council that proclaimed the Azerbaijan Democratic Republic on 28 May 1918, and signed the Treaty of Batum. In April 1920 he disagreed with the terms of surrender but bowed to the majority, and was spared execution through Stalin’s intervention.',
    },
    'kazim-karabekir': { 2: '터키 동부전선 사령관', 3: 'Commander of the Turkish Eastern Front' },
};
for (const row of people) Object.assign(row, OVERRIDES[row[0]] || {});

const event = buildEvent({
    id: 'transcaucasia-1917-1921',
    title: { ko: '자캅카스의 혁명과 전쟁', en: 'Revolution and war in the Caucasus' },
    period: '1917.11–1921.10',
    sortOrder: 46,
    question: {
        ko: '러시아 제국이 무너진 캅카스에서 그루지야·아르메니아·아제르바이잔의 독립 공화국과 북캅카스의 산악민 정권은 어떻게 생겨났고, 왜 4년 만에 모두 소비에트 공화국이 되었나?',
        en: 'How did the independent republics of Georgia, Armenia and Azerbaijan and the mountaineer governments of the North Caucasus arise from the collapse of the Russian Empire, and why had all of them become Soviet republics within four years?',
    },
    summary: {
        ko: '10월 혁명을 인정하지 않은 자캅카스는 1918년 오스만의 공세 속에 한 달짜리 연방을 거쳐 그루지야·아르메니아·아제르바이잔 세 공화국으로 갈라졌다. 볼셰비키의 바쿠 코뮌, 민족 간 학살, 오스만·독일·영국의 잇단 주둔, 데니킨의 백군, 북캅카스의 산악공화국과 이맘의 봉기가 뒤얽힌 끝에, 1920~1921년 붉은 군대와 케말의 터키가 이 지역을 나눠 정리했다.',
        en: 'Refusing to recognise the October Revolution, Transcaucasia passed through a month-long federation under the Ottoman offensive of 1918 and split into three republics, Georgia, Armenia and Azerbaijan. After the Bolshevik Baku Commune, massacres between peoples, successive Ottoman, German and British occupations, Denikin’s Whites, and the mountaineer republic and imams’ risings of the North Caucasus, the Red Army and Kemal’s Turkey divided and settled the region in 1920–1921.',
    },
    outcome: {
        ko: '1920년 4월 아제르바이잔, 12월 아르메니아, 1921년 2월 그루지야가 붉은 군대에 의해 소비에트화되었고, 북캅카스에서는 1921년 5월 다게스탄 봉기가 진압되었다. 1921년 3월 모스크바 조약과 10월 카르스 조약은 카르스·아르다한을 터키에, 바투미를 그루지야에 두는 오늘날의 국경을 정했다. 세 공화국은 1922년 자캅카스 연방으로 묶여 소련 결성에 참여했다.',
        en: 'Azerbaijan in April 1920, Armenia in December and Georgia in February 1921 were Sovietised by the Red Army, and in the North Caucasus the Dagestan uprising was put down in May 1921. The Treaty of Moscow of March 1921 and the Treaty of Kars of October fixed the present borders, leaving Kars and Ardahan to Turkey and Batumi to Georgia. Bound together in the Transcaucasian federation in 1922, the three republics took part in the formation of the USSR.',
    },
    sections,
    timeline,
    locations: [
        ['트빌리시', 'Tbilisi', 41.69, 44.8, 'main'],
        ['바쿠', 'Baku', 40.41, 49.87, 'place'],
        ['예레반', 'Yerevan', 40.18, 44.51, 'place'],
        ['간자', 'Ganja', 40.68, 46.36, 'place'],
        ['바투미', 'Batumi', 41.64, 41.64, 'place'],
        ['카르스', 'Kars', 40.6, 43.1, 'place'],
        ['알렉산드로폴', 'Alexandropol', 40.79, 43.85, 'place'],
        ['슈샤', 'Shusha', 39.76, 46.75, 'place'],
        ['소치', 'Sochi', 43.6, 39.73, 'place'],
        ['블라디카프카스', 'Vladikavkaz', 43.02, 44.68, 'place'],
        ['테미르한슈라', 'Temir-Khan-Shura', 42.82, 47.12, 'place'],
    ],
    countries: ['georgia', 'armenia', 'azerbaijan', 'russia', 'soviet', 'turkey', 'uk', 'germany'],
    relations: { parent: 'civil-war', related: ['ussr-formation', 'brest-litovsk', 'ukraine-1917-1921'] },
    sides: [
        { id: 'soviet-forces', label: { ko: '소비에트 세력', en: 'Soviet forces' } },
        { id: 'national-governments', label: { ko: '자캅카스 민족 정부들', en: 'Transcaucasian national governments' } },
        { id: 'ottoman-turkish', label: { ko: '오스만·터키 국민군', en: 'Ottoman and Turkish nationalist forces' } },
        { id: 'british-and-whites', label: { ko: '영국과 백군', en: 'The British and the Whites' } },
        { id: 'north-caucasus-mountaineers', label: { ko: '북캅카스 산악민', en: 'North Caucasian mountaineers' } },
    ],
    // Tessa Hofmann, the historian, is not Max Hoffmann (Brest-Litovsk).
    noAutoLink: ['호프만'],
    people,
});

// The Formation of the USSR gains the new event as a related event (relations
// list one direction only; event-relations.js derives parents and siblings).
const relationsFix = { event: 'ussr-formation', column: 'relations', expected: {}, value: { related: ['transcaucasia-1917-1921'] } };

module.exports = { event, relationsFix };
