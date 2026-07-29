// CommuLingo — Engels, "The Origin of the Family, Private Property and the State" (1884).
//
// This book is taught NOT as a quiz but as an interactive concept map: the point of
// the work is the *relations* between family, property and the state, not isolated
// terms. The map is a chain of nodes; clicking a node opens three stages:
//   1) 쉬운 설명   — plain, beginner-friendly framing
//   2) 엥겔스의 주장 — what Engels actually argues in the text
//   3) 현대적 비판 — honest modern critique, so the single-line evolutionary scheme
//                    is never taught as established fact.
//
// Consumed by data/commulingo/shards.js (passes `format` + `conceptGraph` through to
// the public catalog) and rendered by public/js/commulingo-graph.js.

function t(ko, en) {
    return { ko, en };
}

function stage(kind, labelKo, labelEn, textKo, textEn) {
    return { kind, label: t(labelKo, labelEn), text: t(textKo, textEn) };
}

// Each node carries the same three stages, authored from the 1884 text.
function node(id, labelKo, labelEn, summaryKo, summaryEn, plain, engels, critique) {
    return {
        id,
        label: t(labelKo, labelEn),
        summary: t(summaryKo, summaryEn),
        stages: [
            stage('plain', '쉬운 설명', 'In plain terms', plain[0], plain[1]),
            stage('engels', '엥겔스의 주장', 'Engels’s argument', engels[0], engels[1]),
            stage('critique', '현대적 비판', 'Modern critique', critique[0], critique[1]),
        ],
    };
}

// A misconception card: the common misreading, a short verdict tag, and the correction.
function myth(claimKo, claimEn, verdictKo, verdictEn, truthKo, truthEn) {
    return {
        claim: t(claimKo, claimEn),
        verdict: t(verdictKo, verdictEn),
        truth: t(truthKo, truthEn),
    };
}

// A "modern application" case: a present-day scene, a question, and a suggested
// reading through Engels's lens (revealed on tap). These are modern extensions,
// not direct conclusions of the 1884 text — the answer text says so where it matters.
function acase(labelKo, labelEn, sceneKo, sceneEn, questionKo, questionEn, answerKo, answerEn) {
    return {
        label: t(labelKo, labelEn),
        scene: t(sceneKo, sceneEn),
        question: t(questionKo, questionEn),
        answer: t(answerKo, answerEn),
    };
}

// A debate round: Engels's claim, a modern scholar's objection, and what remains.
function round(topicKo, topicEn, engelsKo, engelsEn, criticKo, criticEn, takeawayKo, takeawayEn) {
    return {
        topic: t(topicKo, topicEn),
        engels: t(engelsKo, engelsEn),
        critic: t(criticKo, criticEn),
        takeaway: t(takeawayKo, takeawayEn),
    };
}

module.exports = {
    id: 'engels-origin-family',
    volumeNumber: 0,
    format: 'concept-graph',
    title: t('엥겔스: 가족, 사유재산, 국가의 기원', 'Engels: The Origin of the Family, Private Property and the State'),
    bookTitle: t('가족, 사유재산, 국가의 기원', 'The Origin of the Family, Private Property and the State'),
    badge: t('인터랙티브 개념지도', 'Interactive concept map'),
    sourceUrl: 'https://www.marxists.org/archive/marx/works/1884/origin-family/',
    description: t(
        '가족·사유재산·국가가 따로 떨어진 것이 아니라 생산양식의 변화가 엮어 낸 하나의 사슬임을 보여 주는 책입니다.',
        'A book showing that the family, private property and the state are not separate things but one chain forged by changes in the mode of production.'
    ),
    chapters: [],
    conceptGraph: {
        question: t(
            '가족은 자연적 제도인가, 역사적 제도인가?',
            'Is the family a natural institution, or a historical one?'
        ),
        thesis: t(
            '엥겔스는 『가족, 사유재산, 국가의 기원』(1884)에서, 가족·재산·국가가 영원불변한 자연물이 아니라 생산양식의 변화가 사슬처럼 엮어 낸 역사적 산물이라고 본다. 아래 사슬을 따라 각 고리를 눌러, 한 고리가 어떻게 다음 고리를 부르는지 확인해 보라.',
            'In The Origin of the Family, Private Property and the State (1884), Engels argues that family, property and the state are not eternal natural objects but historical products, forged like a chain by changes in the mode of production. Follow the chain below and open each link to see how one calls forth the next.'
        ),
        legend: t(
            ['쉬운 설명', '엥겔스의 주장', '현대적 비판'],
            ['Plain explanation', 'Engels’s argument', 'Modern critique']
        ),
        nodes: [
            node(
                'production',
                '생산양식의 변화', 'The mode of production changes',
                '먹고사는 방식이 바뀌면 사회 전체가 따라 바뀐다.',
                'When the way people make a living changes, the whole society shifts with it.',
                [
                    '사람들이 먹고사는 방식—채집에서 목축과 농경으로—이 바뀌면, 살림의 토대가 달라지고 사회 전체가 그 위에서 다시 짜인다.',
                    'How people make their living—from foraging to herding and farming—changes the very foundation of life, and the whole society is rebuilt on top of it.',
                ],
                [
                    '엥겔스는 모건을 따라, 역사를 움직이는 「최종 심급」을 직접적 생활의 생산과 재생산으로 본다. 가축 사육·금속·농업 같은 생산도구의 발전이 그다음의 모든 변화—재산, 가족, 국가—를 떠받치는 토대가 된다.',
                    'Following Morgan, Engels takes the determining factor in history, in the last instance, to be the production and reproduction of immediate life. Advances in the tools of production—domesticated herds, metals, agriculture—form the base that underpins everything that follows: property, family, the state.',
                ],
                [
                    '생산력이 사회를 「결정한다」는 단선 도식은 너무 기계적이라는 비판을 받는다. 하지만 「살림의 물질적 조건이 가족·제도와 무관하지 않다」는 문제의식 자체는 오늘의 인류학에서도 여전히 살아 있다.',
                    'The one-way scheme in which productive forces “determine” society is criticized as too mechanical. Yet the core insight—that the material conditions of livelihood are not separate from family and institutions—remains alive in anthropology today.',
                ]
            ),
            node(
                'surplus',
                '잉여 생산물', 'A surplus product',
                '필요한 것보다 더 많이 생산되면서 「남는 것」이 처음 쌓인다.',
                'Producing more than is needed, a surplus piles up for the first time.',
                [
                    '가축과 농경이 퍼지자 사람들은 당장 먹을 것보다 더 많이 생산하게 된다. 역사상 처음으로 「남는 것」, 곧 잉여가 쌓이기 시작한다.',
                    'Once herding and farming spread, people begin to produce more than they immediately consume. For the first time in history, a surplus—something left over—starts to accumulate.',
                ],
                [
                    '엥겔스에게 잉여의 출현은 결정적 전환점이다. 남는 생산물이 생기자 「누가 그것을 차지하는가」가 비로소 문제가 되고, 노동력을 더 부려 잉여를 늘리려는 동기가 생긴다. 여기서 노예제와 사적 축적의 싹이 튼다.',
                    'For Engels the appearance of a surplus is the decisive turning point. Once there is a surplus, the question of who appropriates it arises for the first time, along with an incentive to set more labour to work and enlarge it. Here lie the seeds of slavery and of private accumulation.',
                ],
                [
                    '모든 사회가 잉여에서 곧장 사유재산으로 간 것은 아니다. 잉여를 축적하는 대신 잔치와 증여로 흩어 버린 사회(포틀래치 등)도 많았다. 남는 통찰: 사회 형태를 가르는 것은 풍요 자체가 아니라 「잉여를 처분하는 방식」이다.',
                    'Not every society moved straight from surplus to private property. Many dispersed their surplus through feasts and gift-giving (e.g., the potlatch) rather than hoarding it. The lasting insight: what shapes social form is not abundance itself but how a surplus is disposed of.',
                ]
            ),
            node(
                'property',
                '사유재산', 'Private property',
                '공동의 것이던 가축·토지가 특정 가문의 「내 것」이 된다.',
                'Herds and land once held in common become someone’s “mine.”',
                [
                    '잉여가 쌓이면 가축·토지·도구가 공동체의 것에서 특정 가문이나 개인의 「내 것」으로 바뀐다. 소유라는 관념이 사회의 중심으로 들어온다.',
                    'As surplus accumulates, herds, land and tools shift from belonging to the community to being someone’s “mine.” The idea of ownership moves to the centre of society.',
                ],
                [
                    '엥겔스는 사유재산이 인간 본성이 아니라 특정 역사 단계의 산물이라고 본다. 처음 사유화된 큰 재산은 주로 가축이었고, 그것은 대개 남성의 노동과 관할 영역에 있었다. 바로 이 사실이 다음 고리—상속과 부권—를 불러온다.',
                    'Engels treats private property not as human nature but as the product of a definite historical stage. The first large private wealth was mainly livestock, and it tended to fall within men’s sphere of labour and control. It is exactly this fact that calls forth the next link—inheritance and father-right.',
                ],
                [
                    '「원시 공산제 → 사유재산」이라는 깔끔한 2단계 도식은 고고학적으로 단순화다. 실제 소유 형태는 사회마다 훨씬 다양하고 점진적이었다. 그래도 「소유는 자연이 아니라 역사적 제도」라는 문제의식은 유효하다.',
                    'The tidy two-step scheme “primitive communism → private property” is an archaeological oversimplification; actual forms of ownership were far more varied and gradual. Still, the point stands: ownership is a historical institution, not nature.',
                ]
            ),
            node(
                'inheritance',
                '상속', 'Inheritance',
                '재산이 「내 것」이 되면, 누가 물려받느냐가 중대 문제가 된다.',
                'Once property is “mine,” who inherits it becomes a grave question.',
                [
                    '재산이 「내 것」이 되는 순간, 내가 죽은 뒤 그것을 누가 물려받느냐가 사적이면서도 정치경제적인 문제로 떠오른다.',
                    'The moment property becomes “mine,” the question of who inherits it after my death emerges as a matter at once private and political-economic.',
                ],
                [
                    '엥겔스는 여기서 핵심 동학을 본다. 남성의 손에 재산이 쌓이자, 그 재산을 「자기」 자식에게 물려주려는 요구가 생긴다. 그런데 기존의 모계적 혈통 계산법에서는 재산이 남성의 자식이 아니라 그가 속한 씨족(겐스)으로 돌아갔다. 그래서 상속 질서 자체를 부계로 뒤집어야 했다.',
                    'Here Engels sees the key dynamic. As wealth piles up in men’s hands, a demand arises to pass it to *his own* children. But under the older matrilineal reckoning of descent, property returned to the man’s gens, not to his children. So the very order of inheritance had to be overturned into a patrilineal one.',
                ],
                [
                    '모든 곳에서 모계에서 부계로 단선적으로 바뀐 것은 아니며, 모계 사회가 곧 「여성 지배」를 뜻하지도 않았다. 남는 통찰: 상속은 사적인 가족 문제처럼 보여도 실은 재산 질서를 떠받치는 핵심 장치다.',
                    'It was not a universal, one-way switch from matrilineal to patrilineal, and matriliny did not mean “rule by women.” The lasting insight: inheritance looks like a private family affair but is in fact a central mechanism propping up the property order.',
                ]
            ),
            node(
                'paternity',
                '친자 확인과 성 통제', 'Paternity and sexual control',
                '「내 자식」에게 물려주려면, 누가 내 자식인지 확실해야 한다.',
                'To pass it to “my child,” one must be certain who one’s child is.',
                [
                    '부계 상속이 중요해지면, 「누가 내 자식인지」가 확실해야 한다. 그래서 여성의 성과 출산이 통제의 대상이 된다.',
                    'Once patrilineal inheritance matters, one must be sure “who is my child.” So women’s sexuality and childbearing become objects of control.',
                ],
                [
                    '엥겔스는 부계 상속의 요구가 여성에 대한 엄격한 정조 요구—사실상 일방적 통제—로 이어졌다고 본다. 친자의 확실성이 재산 상속의 전제가 되면서, 여성의 자유로운 성적 결합은 억압되고 남성의 권위 아래 놓인다.',
                    'Engels argues that the demand for patrilineal inheritance led to a strict requirement of fidelity imposed on women—in effect a one-sided control. As certainty of paternity became the premise of inheritance, women’s free sexual union was suppressed and placed under male authority.',
                ],
                [
                    '친자 불안만으로 가부장제 전체를 설명할 수 있느냐는 비판이 있다. 종교·전쟁·정치 권력 등 다른 요인의 무게도 크다. 그래도 「성 규범이 재산 질서와 얽혀 있다」는 연결 자체는 날카롭고 지금도 유효하다.',
                    'Critics doubt that anxiety over paternity alone can explain the whole of patriarchy; religion, war and political power weigh heavily too. Still, the link itself—that sexual norms are entangled with the property order—is sharp and still holds.',
                ]
            ),
            node(
                'monogamy',
                '일부일처제 가족', 'The monogamous family',
                '한 남성과 한 여성의 결혼이 제도로 굳는다 — 흔히 「사랑의 완성」으로 여겨진다.',
                'Marriage of one man and one woman hardens into an institution—often seen as “the fulfilment of love.”',
                [
                    '한 남성과 한 여성의 결혼이 사회의 표준 제도로 굳는다. 흔히 이것은 「사랑이 발전해서 도달한 완성된 형태」로 이야기된다.',
                    'Marriage of one man and one woman hardens into society’s standard institution. It is commonly told as “the finished form that love evolved toward.”',
                ],
                [
                    '엥겔스의 유명한 주장: 일부일처제는 결코 개인적 성애의 산물이 아니다. 그것은 재산을 「확실한」 상속자에게 넘기기 위해 굳어진 가족 형태이며, 역사적으로 남성에게는 실제로 훨씬 많은 성적 자유가 허용되었다. 그는 이를 「최초의 계급 억압, 곧 남성에 의한 여성의 억압」과 일치한다고 본다.',
                    'Engels’s famous claim: monogamy was by no means the product of individual sex-love. It is a family form hardened in order to transmit property to “certain” heirs, and historically men were in fact allowed far more sexual latitude. He sees it as coinciding with “the first class oppression—that of the female sex by the male.”',
                ],
                [
                    '일부일처제의 기원을 오로지 재산으로 환원하는 것은 지나치다는 지적이 많다. 친밀성·돌봄·문화도 함께 작동한다. 버릴 것은 단선적 환원, 남길 것은 「가족 형태는 사랑만이 아니라 상속 질서와도 연결된다」는 시선이다.',
                    'Many object that reducing monogamy’s origin solely to property goes too far; intimacy, care and culture are also at work. Discard the one-way reduction; keep the lens that family form is tied not only to love but also to the order of inheritance.',
                ]
            ),
            node(
                'women',
                '여성의 종속', 'The subordination of women',
                '사슬이 맞물리며 여성의 사회적 지위가 떨어진다 — 「세계사적 패배」.',
                'As the links interlock, women’s social standing falls—a “world-historic defeat.”',
                [
                    '위의 고리들이 맞물리면서 여성의 사회적 지위가 떨어진다. 여성은 점점 가사와 양육의 사적 영역에 묶이고, 공적 생산과 재산에서 밀려난다.',
                    'As the links above interlock, women’s social standing falls. Women are increasingly confined to the private sphere of household and child-rearing and pushed out of public production and property.',
                ],
                [
                    '엥겔스는 모권의 전복을 「여성의 세계사적 패배」라 부른다. 여성 억압의 뿌리를 생물학이 아니라 재산·노동·가족 구조에서 찾은 것이다. 그는 여성 해방의 조건으로 여성의 사회적 생산 복귀와 가사노동의 사회화를 든다.',
                    'Engels calls the overthrow of mother-right “the world-historic defeat of the female sex,” locating the root of women’s oppression not in biology but in the structure of property, labour and family. He names women’s return to social production and the socialization of housework as the conditions of their emancipation.',
                ],
                [
                    '「옛날에 여성이 지배하던 황금기가 있었다」는 식의 단순화는 엥겔스의 본뜻도 아니고 인류학적으로도 지지받지 못한다. 또 임금노동 참여만으로 해방이 보장되지도 않는다. 남는 통찰: 여성 억압을 생물학이 아니라 노동·재산·가족 구조에서 보라는 요청이다.',
                    'The caricature that “there was once a golden age ruled by women” is neither Engels’s real meaning nor anthropologically supported; nor does wage-labour participation alone guarantee emancipation. The lasting insight: look for women’s oppression not in biology but in the structure of labour, property and family.',
                ]
            ),
            node(
                'state',
                '계급과 국가', 'Classes and the state',
                '가진 자와 못 가진 자로 갈라진 사회는 갈등을 「관리」할 권력—국가를 낳는다.',
                'A society split into haves and have-nots gives birth to a power to “manage” the conflict—the state.',
                [
                    '재산과 상속으로 사회가 가진 자와 못 가진 자로 갈라지면, 그 적대를 어떻게든 「관리」할 권력이 필요해진다. 그것이 국가다.',
                    'Once property and inheritance split society into haves and have-nots, a power becomes necessary to somehow “manage” the antagonism. That power is the state.',
                ],
                [
                    '엥겔스에게 국가는 사회 전체의 중립적 심판자가 아니다. 그것은 계급 대립이 「화해 불가능」해진 지점에서 생겨나, 겉으로는 질서를 지키는 척하지만 실은 가진 계급의 지배를 떠받치는 도구다. 따라서 국가는 영원하지 않다—계급과 함께 생겨났고, 계급과 함께 사라질 것이다.',
                    'For Engels the state is not a neutral arbiter standing over society. It arises at the point where class antagonisms become “irreconcilable,” and while it appears to keep order it is in fact an instrument upholding the rule of the propertied class. Hence the state is not eternal: it arose with classes and will vanish with them.',
                ],
                [
                    '국가를 오로지 「계급 지배 도구」로만 보는 환원에는 이론(異論)이 있다. 국가는 상대적 자율성과 공공 기능도 가진다. 그래도 「국가를 자연이나 중립으로 신비화하지 말고 그 계급적 토대를 물으라」는 요구는 오늘의 정치 분석에서도 강력하다.',
                    'Reducing the state to nothing but a “tool of class rule” is contested; the state also has relative autonomy and public functions. Still, the demand to stop mystifying the state as natural or neutral, and to ask after its class foundations, remains powerful in political analysis today.',
                ]
            ),
        ],
        misconceptions: {
            title: t('흔한 오해 바로잡기', 'Correcting common misreadings'),
            hint: t('카드를 눌러 정정을 확인하세요. 이 책은 오독이 많아, 무엇을 버리고 무엇을 남길지 가려내는 것이 중요합니다.',
                'Tap a card to reveal the correction. This book is often misread, so it matters to sort out what to discard and what to keep.'),
            cards: [
                myth(
                    '엥겔스는 아주 먼 옛날에 여성이 지배하는 낙원이 있었다고 주장했다.',
                    'Engels claimed there was once, in the distant past, a paradise ruled by women.',
                    '사실과 다르다', 'Not what he said',
                    '엥겔스는 모계적 친족 질서가 부계로 넘어가며 여성의 지위가 하락했다고 보았을 뿐, 고대를 「여성이 지배하던 낙원」으로 그리지 않았다. 모권(모계)은 「여성 지배」가 아니라 혈통을 어머니 쪽으로 세는 방식을 가리킨다.',
                    'Engels held that women’s status fell as a matrilineal kinship order gave way to a patrilineal one—he did not paint antiquity as a “paradise ruled by women.” Mother-right (matriliny) means reckoning descent through the mother, not rule by women.'
                ),
                myth(
                    '엥겔스는 그저 「가족을 없애자」고 말했다.',
                    'Engels simply said, “abolish the family.”',
                    '부정확하다', 'Inaccurate',
                    '엥겔스가 겨냥한 것은 「가족 일반」이 아니라 사유재산·상속·여성의 경제적 종속 위에 세워진 특정한 부르주아 가족 형태다. 그는 가족을 없애자기보다, 그 경제적 토대가 바뀌면 가족 형태도 함께 달라진다고 보았다.',
                    'What Engels targeted was not “the family in general” but a specific bourgeois family form built on private property, inheritance and women’s economic dependence. Rather than abolishing the family, he held that when its economic basis changes, the family form changes with it.'
                ),
                myth(
                    '일부일처제는 사랑이 무르익어 자연스럽게 도달한 제도다.',
                    'Monogamy is the institution that love naturally arrived at as it matured.',
                    '엥겔스는 반대한다', 'Engels disagrees',
                    '엥겔스에게 일부일처제의 역사적 기원은 개인적 사랑이 아니라, 재산을 「확실한」 상속자에게 넘기려는 요구와 친자 확인을 위한 여성 통제에 얽혀 있다. 사랑은 그 제도 안에서 나중에 자라난 것이지, 그 제도를 만든 원인이 아니다.',
                    'For Engels the historical origin of monogamy lies not in individual love but in the demand to pass property to “certain” heirs, entangled with the control of women to secure paternity. Love grew up later within the institution; it was not its cause.'
                ),
                myth(
                    '엥겔스의 발전 도식은 모든 인류가 똑같은 단계를 똑같은 순서로 거쳤음을 증명한다.',
                    'Engels’s scheme proves that all of humanity passed through the same stages in the same order.',
                    '현대 인류학의 비판', 'Criticized by modern anthropology',
                    '모건을 따른 엥겔스의 단선적 단계 도식(야만→미개→문명)은 오늘날 인류학에서 지지받지 못한다. 사회마다 친족·재산·결혼의 경로는 훨씬 다양했다. 버릴 것은 「모두가 같은 순서를 밟는다」는 단선성이고, 남길 것은 「가족 형태가 물질적 조건과 함께 변한다」는 문제의식이다.',
                    'The single-line stage scheme Engels took from Morgan (savagery → barbarism → civilization) is not supported by anthropology today; the paths of kinship, property and marriage varied widely across societies. Discard the single line—“everyone follows the same order”—and keep the insight that family forms change together with material conditions.'
                ),
                myth(
                    '국가는 사회 전체 위에 선 중립적인 심판자다.',
                    'The state is a neutral arbiter standing above society as a whole.',
                    '엥겔스는 반박한다', 'Engels refutes this',
                    '엥겔스는 국가가 계급 대립이 화해 불가능해진 지점에서 생겨나, 겉으로는 질서를 지키는 듯하지만 실은 가진 계급의 지배를 떠받친다고 본다. 다만 국가를 순전히 도구로만 보는 환원은 현대 정치학에서 비판받으며, 국가는 상대적 자율성과 공공 기능도 가진다.',
                    'Engels holds that the state arises where class antagonisms become irreconcilable and, while appearing to keep order, in fact upholds the rule of the propertied class. That said, reducing the state to a pure instrument is criticized in modern political science; the state also has relative autonomy and public functions.'
                ),
            ],
        },
        applications: {
            title: t('오늘에 적용하기', 'Apply it today'),
            hint: t('엥겔스의 렌즈로 현대 사례를 보면 어떤 질문이 열리는가. 먼저 스스로 생각한 뒤 카드를 눌러 펼쳐 보세요. (원문의 직접 결론이 아니라 현대적 확장입니다.)',
                'What questions open up when you look at present-day cases through Engels’s lens? Think first, then tap a card to reveal. (These are modern extensions, not direct conclusions of the text.)'),
            cases: [
                acase(
                    '결혼과 주택', 'Marriage and housing',
                    '현대 한국에서 결혼은 사랑만의 문제가 아니라 주택·소득·상속·돌봄 비용과 강하게 얽혀 있다.',
                    'In Korea today, marriage is not a matter of love alone but is tightly bound up with housing, income, inheritance and the cost of care.',
                    '결혼을 「두 사람의 사적 감정」으로만 보면 무엇을 놓치는가?',
                    'What do we miss if we see marriage as nothing but “the private feelings of two people”?',
                    '가족은 사적 감정의 영역처럼 보이지만, 실제로는 재산·주거·노동력 재생산의 제도와 연결되어 있다. 엥겔스의 렌즈는 「왜 사랑이 자꾸 집값·상속과 함께 계산되는가」를 묻게 한다.',
                    'The family looks like a sphere of private feeling, yet it is tied to the institutions of property, housing and the reproduction of labour-power. Engels’s lens prompts the question: why does love keep getting calculated together with house prices and inheritance?'
                ),
                acase(
                    '돌봄노동', 'Care work',
                    '출산·육아·간병 같은 돌봄의 큰 몫이 여전히 가족 안에서, 주로 여성에게 무급으로 흡수된다.',
                    'A large share of care—childbirth, child-rearing, nursing the sick—is still absorbed within the family, unpaid and mostly by women.',
                    '왜 가족은 돌봄 비용을 떠안는 장치로 작동하는가?',
                    'Why does the family work as a device for absorbing the cost of care?',
                    '엥겔스는 여성 해방의 조건으로 가사·돌봄의 「사회화」를 들었다. 돌봄이 가족 안 무급노동으로 남는 한, 노동력을 재생산하는 비용이 사적으로 여성에게 전가된다는 시선을 열어 준다.',
                    'Engels named the “socialization” of housework and care as a condition of women’s emancipation. As long as care remains unpaid labour inside the family, it opens the view that the cost of reproducing labour-power is privately shifted onto women.'
                ),
                acase(
                    '상속과 가족 갈등', 'Inheritance and family conflict',
                    '가족은 흔히 사랑의 공동체로 이야기되지만, 상속 분쟁은 가장 격렬한 가족 갈등 가운데 하나다.',
                    'The family is often described as a community of love, yet disputes over inheritance are among the fiercest of family conflicts.',
                    '가족이 순수한 사랑의 공동체라면, 왜 상속을 둘러싼 다툼은 그토록 치열한가?',
                    'If the family were a pure community of love, why are fights over inheritance so bitter?',
                    '엥겔스의 사슬(재산→상속→가족)을 따르면, 가족은 애정의 공동체이면서 동시에 재산을 다음 세대로 넘기는 제도이기도 하다. 상속 갈등은 그 두 얼굴이 정면으로 부딪히는 지점이다.',
                    'Following Engels’s chain (property → inheritance → family), the family is at once a community of affection and an institution for passing property to the next generation. Inheritance conflict is exactly where those two faces collide.'
                ),
                acase(
                    '저출생과 가족의 변형', 'Falling birth rates and changing families',
                    '많은 사회에서 결혼·출산이 줄고 가족 형태가 빠르게 다양해진다 — 비혼, 1인 가구, 동거, 비혈연 공동체.',
                    'In many societies marriage and childbirth are declining and family forms are diversifying fast—non-marriage, single-person households, cohabitation, non-kin communities.',
                    '「가족은 자연이라 변하지 않는다」는 통념을 이 변화는 어떻게 시험하는가?',
                    'How does this change test the common belief that “the family is natural and never changes”?',
                    '엥겔스의 핵심 통찰—가족 형태는 물질적 조건과 함께 변한다—은 바로 이런 변동을 설명하는 틀이 된다. 그러면 이 변화는 「가족의 위기」가 아니라 물질적 조건에 따른 형태 변동으로 읽을 수 있다.',
                    'Engels’s core insight—that family forms change together with material conditions—becomes the frame for exactly this shift. Read that way, the change is not “the crisis of the family” but a change of form driven by material conditions.'
                ),
            ],
        },
        debates: {
            title: t('엥겔스 vs 현대 학자', 'Engels vs. a modern scholar'),
            hint: t('각 쟁점에서 엥겔스의 주장과 현대의 반론을 나란히 두고, 「그럼 무엇이 남는가」를 눌러 가려 보세요.',
                'For each dispute, set Engels’s claim beside a modern objection, then tap “So what remains?” to sort it out.'),
            rounds: [
                round(
                    '일부일처제의 기원', 'The origin of monogamy',
                    '일부일처제는 개인적 성애의 산물이 아니라, 사유재산과 상속 문제 속에서 강화된 가족 형태다.',
                    'Monogamy is not the product of individual sex-love but a family form hardened amid the problems of private property and inheritance.',
                    '그 도식은 너무 단선적이다. 사회마다 결혼·친족·재산 구조는 훨씬 다양했고, 친밀성·돌봄·문화도 함께 작동한다.',
                    'That scheme is too single-tracked. Marriage, kinship and property structures varied widely across societies, and intimacy, care and culture are at work too.',
                    '남길 것 — 가족 형태가 사랑만이 아니라 경제적 조건과 연결된다는 문제의식. 버릴 것 — 모든 사회를 하나의 발전 단계로 줄 세우는 단선적 환원.',
                    'Keep — the insight that family form is tied not only to love but to economic conditions. Discard — the single-line reduction that lines every society up along one stage of development.'
                ),
                round(
                    '모권에서 부권으로의 이행', 'The shift from mother-right to father-right',
                    '모권의 전복은 「여성의 세계사적 패배」이며, 여성 억압의 뿌리는 생물학이 아니라 재산·노동 구조에 있다.',
                    'The overthrow of mother-right is “the world-historic defeat of the female sex”; the root of women’s oppression lies not in biology but in the structure of property and labour.',
                    '보편적 「모권 단계」가 실재했다는 증거는 약하고, 모계 사회가 곧 여성 우위를 뜻하지도 않았다.',
                    'Evidence for a universal “matriarchal stage” is weak, and matrilineal societies did not amount to the supremacy of women.',
                    '남길 것 — 여성 억압을 생물학이 아니라 노동·재산·가족 구조에서 보라는 요청. 버릴 것 — 「태초의 모권」을 모든 인류의 보편 단계로 못박는 역사 도식.',
                    'Keep — the demand to seek women’s oppression in the structure of labour, property and family rather than in biology. Discard — the historical scheme that fixes a “primeval mother-right” as a universal stage for all humanity.'
                ),
                round(
                    '국가의 성격', 'The character of the state',
                    '국가는 계급 대립이 화해 불가능해진 지점에서 생겨난, 그 대립을 관리하는 권력이며, 계급과 함께 사라질 것이다.',
                    'The state arises where class antagonisms become irreconcilable, as a power that manages them, and it will vanish together with classes.',
                    '국가는 단순한 계급 도구가 아니다. 상대적 자율성을 가지며, 계급 지배로 환원되지 않는 공공 기능도 수행한다.',
                    'The state is not a mere instrument of class. It has relative autonomy and performs public functions that do not reduce to class rule.',
                    '남길 것 — 국가를 자연이나 중립으로 신비화하지 말고 그 계급적 토대를 물으라는 요구. 버릴 것 — 국가를 순전히 지배계급의 도구로만 보는 단순 환원.',
                    'Keep — the demand to stop mystifying the state as natural or neutral and to ask after its class foundations. Discard — the flat reduction of the state to nothing but a tool of the ruling class.'
                ),
            ],
        },
    },
};
