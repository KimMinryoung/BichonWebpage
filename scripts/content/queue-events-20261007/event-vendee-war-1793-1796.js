// The War in the Vendée, 1793–1796 (queue 2063): a child event of the French
// Revolution. Eight sections come from sec-vendee-a (background, March 1793,
// the Catholic and Royal Army's spring and summer, the Virée de Galerne) and
// sec-vendee-b (repression, Thermidor and La Jaunaye, the second war,
// assessment); each part keeps its own sources, timeline rows and person
// relations, joined here in order. `links` holds the link-review decisions for
// the event title and the batch's new glossary terms.
const { event: buildEvent } = require('./lib');

const parts = ['a', 'b'].map(slug => require(`./sec-vendee-${slug}`));
const sections = parts.flatMap(p => p.sections);
const timeline = parts.flatMap(p => p.timeline).sort((x, y) => x[0].localeCompare(y[0]));

// A person named in both parts gets one relation: the strongest kind, the
// first side and title, and both notes.
const RANK = ['leader', 'executor', 'participant', 'opponent', 'target', 'witness', 'historian'];
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

const event = buildEvent({
    id: 'vendee-war-1793-1796',
    title: { ko: '방데 전쟁', en: 'The War in the Vendée' },
    period: '1793–1796',
    sortOrder: 3,
    question: {
        ko: '1793년 3월 프랑스 서부의 농민은 왜 징집령에 맞서 무기를 들었고, 공화국은 왜 전투가 끝난 뒤에도 이 지역을 불태우고 포로를 익사시켰으며, 그 희생자 수와 성격을 두고 역사가들은 무엇을 다투는가?',
        en: 'Why did the peasants of western France take up arms against conscription in March 1793, why did the Republic go on burning the region and drowning prisoners after the fighting was over, and what do historians dispute about the number and nature of the victims?',
    },
    summary: {
        ko: '1793년 3월 30만 명 징집령은 성직자 민사기본법과 국유재산 매각으로 쌓인 서부 농촌의 불만에 불을 붙였다. 「군사적 방데」의 농민과 장인은 가톨릭 왕당군을 세워 봄과 여름에 투아르·퐁트네·소뮈르를 점령했으나 낭트에서 막혔고, 10월 숄레에서 패한 뒤 영국의 도움을 찾아 루아르강을 건넌 6만~10만 명은 르망과 사부네에서 섬멸되었다. 공포정치 아래 낭트와 앙제에서 약 1만 5천 명이 익사·총살·참수되었고, 1794년 1~5월 튀로의 지옥 종대는 민간인 2만~5만 명을 죽이며 봉기를 되살렸다. 테르미도르 뒤 1795년 2월 라자주네 조약으로 첫 전쟁이 끝났으나 키브롱 상륙과 함께 두 번째 전쟁이 터졌고, 오슈가 사면과 예배의 자유와 기동 종대로 1796년 스토플레와 샤레트를 잡아 전쟁을 끝냈다.',
        en: 'The levy of 300,000 men in March 1793 set fire to grievances that the Civil Constitution of the Clergy and the sale of church property had piled up in the western countryside. The peasants and artisans of the Vendée militaire formed a Catholic and Royal Army that took Thouars, Fontenay and Saumur in the spring and summer but was stopped at Nantes; after the defeat at Cholet in October, 60,000 to 100,000 people crossed the Loire in search of British help and were destroyed at Le Mans and Savenay. Under the Terror about 15,000 people were drowned, shot or guillotined at Nantes and Angers, and from January to May 1794 Turreau’s infernal columns killed 20,000 to 50,000 civilians and revived the rising. After Thermidor the Treaty of La Jaunaye of February 1795 ended the first war, but a second broke out with the Quiberon landing, and Hoche ended it in 1796 by capturing Stofflet and Charette with amnesty, freedom of worship and mobile columns.',
    },
    outcome: {
        ko: '1796년 2월 스토플레, 3월 샤레트가 총살되었고 7월 16일 총재정부는 전쟁의 종결을 선포했다. 군사적 방데 주민 약 17만 명(전쟁 전 인구 75만 5천 명의 22~23%)을 포함해 약 20만 명이 죽은 것으로 추산되며, 공화국군 전사자는 2만 6천~5만 명으로 본다. 1980년대 이후 「제노사이드」 규정을 둘러싼 논쟁이 이어졌으나 대다수 역사가는 전쟁범죄와 내전의 학살로 규정한다. 방데는 1799년, 1815년, 1832년에 작은 봉기를 더 겪었고, 「방데」라는 이름은 농민 반혁명의 보통명사가 되었다.',
        en: 'Stofflet was shot in February 1796 and Charette in March, and on 16 July the Directory proclaimed the war over. About 200,000 people are thought to have died, including some 170,000 inhabitants of the Vendée militaire (22 to 23 per cent of a pre-war population of 755,000), with Republican military dead put at 26,000 to 50,000. The debate over the label “genocide” has continued since the 1980s, but most historians characterise the events as war crimes and the massacres of a civil war. The Vendée saw smaller risings in 1799, 1815 and 1832, and its name became a common noun for peasant counter-revolution.',
    },
    sections,
    timeline,
    locations: [
        ['숄레', 'Cholet', 47.0600, -0.8800, 'main'],
        ['낭트', 'Nantes', 47.2184, -1.5536, 'place'],
        ['앙제', 'Angers', 47.4784, -0.5632, 'place'],
        ['소뮈르', 'Saumur', 47.2600, -0.0770, 'place'],
        ['투아르', 'Thouars', 46.9760, -0.2150, 'place'],
        ['퐁트네르콩트', 'Fontenay-le-Comte', 46.4660, -0.8060, 'place'],
        ['마슈쿨', 'Machecoul', 46.9933, -1.8236, 'place'],
        ['사부네', 'Savenay', 47.3600, -1.9420, 'place'],
        ['르망', 'Le Mans', 48.0061, 0.1996, 'place'],
        ['그랑빌', 'Granville', 48.8378, -1.5970, 'place'],
        ['누아르무티에', 'Noirmoutier', 47.0000, -2.2500, 'place'],
        ['키브롱', 'Quiberon', 47.4840, -3.1200, 'place'],
    ],
    countries: ['france', 'uk'],
    relations: { parent: 'french-revolution-1789-1799', related: ['french-revolutionary-wars-1792-1802'] },
    sides: [
        { id: 'vendee-royalists', label: { ko: '방데 가톨릭 왕당군과 슈앙', en: 'The Vendéan Catholic and Royal Army and the Chouans' } },
        { id: 'republic', label: { ko: '공화국군과 국민공회 파견의원', en: 'The Republican armies and the Convention’s representatives on mission' } },
        { id: 'britain-emigres', label: { ko: '영국과 망명 귀족', en: 'Britain and the émigrés' } },
    ],
    // 마르탱(Jean-Clément Martin), 마르탱 라치스가 아님; 튀로는 장군과 파견의원
    // 사촌이 같은 성이라 본문은 사촌을 이름 없이 부른다. 「뒤마」는 알렉상드르
    // 뒤마 장군(소설가의 아버지)이라 인물 카드와 겹칠 수 있어 막는다.
    noAutoLink: ['마르탱', '뒤마', '마르탱 라치스'],
    people,
});

// Link-review decisions (scripts/reviews/commulingo-links-*.json `decisions`
// shape) for the event title and the batch's new glossary terms.
const D = (kind, id, lang, text, policy, note) => ({ kind, id, lang, text, role: 'identity', policy, note, original479: false, beforePolicy: 'search' });
const T = (id, lang, text, policy, note) => D('term', id, lang, text, policy, note);
const KO_NOTE = '2026-10-07 방데 전쟁 사건 등록과 함께 만든 용어의 고유 표제어·별칭. 이 항목만 가리키는 이름이라 자동 연결.';
const EN_NOTE = '2026-10-07 made with the War in the Vendée event: a name unique to this entry. Auto link.';
const KO_SEARCH = '2026-10-07 방데 전쟁 사건 등록과 함께 검토: 짧거나 일반어와 겹칠 수 있어 검색 전용.';
const EN_SEARCH = '2026-10-07 reviewed with the War in the Vendée event: short or generic enough to collide; search only.';
const links = [
    D('event', 'vendee-war-1793-1796', 'ko', '방데 전쟁', 'auto', '2026-10-07 사건 등록과 함께 검토: 사건 제목 전체 문자열이라 다른 대상과 겹치지 않음. 자동 연결.'),
    D('event', 'vendee-war-1793-1796', 'en', 'The War in the Vendée', 'auto', '2026-10-07 reviewed with the event registration: the full event title, unique to this event. Auto link.'),
    T('catholic-and-royal-army', 'ko', '가톨릭 왕당군', 'auto', KO_NOTE),
    T('catholic-and-royal-army', 'ko', '방데 가톨릭 왕당군', 'auto', KO_NOTE),
    T('catholic-and-royal-army', 'ko', '가톨릭 왕당파 군대', 'auto', KO_NOTE),
    T('catholic-and-royal-army', 'ko', '방데군', 'search', KO_SEARCH),
    T('catholic-and-royal-army', 'en', 'Catholic and Royal Army', 'auto', EN_NOTE),
    T('catholic-and-royal-army', 'en', 'Catholic and Royal Army of the Vendée', 'auto', EN_NOTE),
    T('catholic-and-royal-army', 'en', 'Armée catholique et royale', 'auto', EN_NOTE),
    T('catholic-and-royal-army', 'en', 'Royal and Catholic Army', 'auto', EN_NOTE),
    T('catholic-and-royal-army', 'en', 'Vendéan army', 'search', EN_SEARCH),
    T('infernal-columns', 'ko', '지옥 종대', 'auto', KO_NOTE),
    T('infernal-columns', 'ko', '튀로의 지옥 종대', 'auto', KO_NOTE),
    T('infernal-columns', 'ko', '방화 종대', 'search', KO_SEARCH),
    T('infernal-columns', 'ko', '콜론 앵페르날', 'auto', KO_NOTE),
    T('infernal-columns', 'en', 'Infernal columns', 'auto', EN_NOTE),
    T('infernal-columns', 'en', 'colonnes infernales', 'auto', EN_NOTE),
    T('infernal-columns', 'en', "Turreau's infernal columns", 'auto', EN_NOTE),
    T('infernal-columns', 'en', 'hellish columns', 'search', EN_SEARCH),
    T('drownings-at-nantes', 'ko', '낭트 익사형', 'auto', KO_NOTE),
    T('drownings-at-nantes', 'ko', '낭트의 익사형', 'auto', KO_NOTE),
    T('drownings-at-nantes', 'ko', '낭트 수장', 'auto', KO_NOTE),
    T('drownings-at-nantes', 'ko', '낭트의 수장', 'auto', KO_NOTE),
    T('drownings-at-nantes', 'ko', '루아르강 익사형', 'auto', KO_NOTE),
    T('drownings-at-nantes', 'en', 'Drownings at Nantes', 'auto', EN_NOTE),
    T('drownings-at-nantes', 'en', 'noyades de Nantes', 'auto', EN_NOTE),
    T('drownings-at-nantes', 'en', 'Nantes drownings', 'auto', EN_NOTE),
    T('drownings-at-nantes', 'en', 'noyades', 'search', EN_SEARCH),
    T('chouannerie', 'ko', '슈앙 반란', 'auto', KO_NOTE),
    T('chouannerie', 'ko', '슈아느리', 'auto', KO_NOTE),
    T('chouannerie', 'ko', '슈앙 봉기', 'auto', KO_NOTE),
    T('chouannerie', 'ko', '슈앙 전쟁', 'auto', KO_NOTE),
    T('chouannerie', 'ko', '올빼미당 반란', 'auto', KO_NOTE),
    T('chouannerie', 'en', 'Chouannerie', 'auto', EN_NOTE),
    T('chouannerie', 'en', 'Chouan rising', 'auto', EN_NOTE),
    T('chouannerie', 'en', 'Chouan uprising', 'auto', EN_NOTE),
    T('chouannerie', 'en', 'Chouan revolt', 'auto', EN_NOTE),
    T('chouannerie', 'en', 'Chouan insurrection', 'auto', EN_NOTE),
    T('treaty-of-la-jaunaye', 'ko', '라자주네 조약', 'auto', KO_NOTE),
    T('treaty-of-la-jaunaye', 'ko', '라 조네 조약', 'auto', KO_NOTE),
    T('treaty-of-la-jaunaye', 'ko', '라자주네 강화', 'auto', KO_NOTE),
    T('treaty-of-la-jaunaye', 'ko', '라자주네 평화조약', 'auto', KO_NOTE),
    T('treaty-of-la-jaunaye', 'en', 'Treaty of La Jaunaye', 'auto', EN_NOTE),
    T('treaty-of-la-jaunaye', 'en', 'Treaty of La Jaunaie', 'auto', EN_NOTE),
    T('treaty-of-la-jaunaye', 'en', 'Peace of La Jaunaye', 'auto', EN_NOTE),
    T('treaty-of-la-jaunaye', 'en', 'La Jaunaye treaty', 'auto', EN_NOTE),
    T('quiberon-expedition-1795', 'ko', '키브롱 상륙 (1795)', 'auto', KO_NOTE),
    T('quiberon-expedition-1795', 'ko', '키브롱 원정', 'auto', KO_NOTE),
    T('quiberon-expedition-1795', 'ko', '키브롱 전투', 'search', '2026-10-07 검토: 1759년 키브롱만 해전과 겹칠 수 있어 검색 전용.'),
    T('quiberon-expedition-1795', 'ko', '키브롱 상륙', 'auto', KO_NOTE),
    T('quiberon-expedition-1795', 'en', 'Quiberon expedition (1795)', 'auto', EN_NOTE),
    T('quiberon-expedition-1795', 'en', 'Battle of Quiberon', 'search', '2026-10-07 reviewed: may collide with the 1759 Battle of Quiberon Bay; search only.'),
    T('quiberon-expedition-1795', 'en', 'Quiberon landing', 'auto', EN_NOTE),
    T('quiberon-expedition-1795', 'en', 'Invasion of France (1795)', 'auto', EN_NOTE),
    T('quiberon-expedition-1795', 'en', 'expédition de Quiberon', 'auto', EN_NOTE),
];

module.exports = { event, links };
