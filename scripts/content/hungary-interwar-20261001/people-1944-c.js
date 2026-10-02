// Person cards for event-1944.js (Hungary 1944–1945), see lib.js person().
const { W, HU, person } = require('./lib');

const S = {
    mindszenty: W('József_Mindszenty'),
    huMindszenty: HU('Mindszenty_József'),
};

// A religious office has no catalog affiliation (no Catholic Church entry), so
// it is stored unresolved, as in event-axis.js unresolvedReligion.
const unresolvedReligion = card => {
    for (const a of card.activities) if (a.functionId === 'religion') Object.assign(a, { affiliationId: null, affiliationStatus: 'unresolved', relation: 'unresolved' });
    return card;
};

module.exports = [
    unresolvedReligion(person({
        id: 'jozsef-mindszenty',
        given: ['요제프', 'József'], family: ['민드센티', 'Mindszenty'], nativeName: 'Mindszenty József', years: '1892–1975',
        origin: { code: 'hungary', label: { ko: '헝가리(독일계 집안)', en: 'Hungarian; family of German origin' } },
        epithet: ['1949년 여론 재판에서 종신형을 받고 1956년부터 미국 대사관에 피신한 에스테르곰 대주교·추기경',
            'Archbishop of Esztergom and cardinal sentenced to life in a 1949 show trial, who sheltered in the US embassy in Budapest from 1956'],
        bio: ['버시주 체히민드센트의 독일계 성을 쓰는 집안에서 나 1915년 사제가 되었고, 1919년 카로이·쿤 벨러 정부에 잇달아 체포되었다. 뒤에 성을 고향 마을 이름을 딴 민드센티로 바꾸었다. 1944년 3월 베스프렘 주교가 되었고, 11월 화살십자당 정권에 체포되었다가 1945년 4월 풀려났다. 1945년 에스테르곰 대주교·수좌대주교, 1946년 추기경이 되어 교회 학교 국유화 등에 맞섰다. 1948년 12월 체포되어 고문 끝에 자백했고, 1949년 2월 여론 재판에서 종신형을 받았다. 1956년 혁명 중 풀려났고 소련군이 들어오자 미국 대사관에 피신해 15년을 지냈다. 1971년 빈으로 떠났고, 1974년 바오로 6세가 대주교좌 공석을 선언했으며 1975년 빈에서 숨졌다.',
            'Born at Csehimindszent in Vas County into a family with a German surname, he was ordained in 1915 and in 1919 was arrested by the Károlyi and then the Kun government. He later took the name Mindszenty from his home village. Consecrated Bishop of Veszprém in March 1944, he was arrested by the Arrow Cross government in November and released in April 1945. Appointed Archbishop of Esztergom and Primate in 1945 and made a cardinal in 1946, he resisted the Communists, notably over church schools. Arrested in December 1948 and beaten until he confessed, he was sentenced to life imprisonment at a show trial in February 1949. Freed during the 1956 revolution, he took refuge in the US embassy when the Soviets invaded and stayed there fifteen years. Allowed to leave in 1971, he settled in Vienna; in February 1974 Paul VI declared the see of Esztergom vacant, and he died in Vienna in 1975.'],
        fate: ['natural', '망명지 빈에서 사망', 'Died in exile in Vienna'],
        aliases: { ko: [], en: ['József Mindszenty', 'Mindszenty József', 'Joseph Mindszenty', 'József Pehm', 'Pehm József'] },
        linkExpressions: [['ko', '민드센티 추기경'], ['en', 'Cardinal Mindszenty']],
        sources: [S.mindszenty, S.huMindszenty],
        facts: {
            years: { claim: '1892–1975', locator: 'lead', excerpt: '29 March 1892 – 6 May 1975' },
            citizenship: { claim: 'Hungarian cardinal', locator: 'lead', excerpt: 'was a Hungarian cardinal of the Catholic Church who served as Archbishop of Esztergom and leader of the Catholic Church in Hungary from 1945 to 1973' },
            nationalOrigin: [
                { claim: 'family surname of German origin', source: S.huMindszenty, locator: 'Püspöki kinevezése', excerpt: 'változtatta meg német eredetű családnevét' },
                { claim: 'earliest known ancestor settled from the German-speaking area', source: S.huMindszenty, locator: 'Szülei és ifjúkora', excerpt: 'első név szerint ismert őse a német nyelvterületről idetelepült' },
                { claim: 'renamed during a Magyarisation campaign among Germans in Hungary', locator: 'Early life and career', excerpt: 'during a Magyarization campaign amongst Germans living in Hungary, he adopted his new Hungarian name of Mindszenty, part of his home village\'s name' },
            ],
            bio: [
                { claim: 'born Pehm József at Csehimindszent, Vas County', locator: 'Early life and career', excerpt: 'Mindszenty was born on 29 March 1892 in Csehimindszent, Vas County, Austria-Hungary, to József Pehm and Borbála Kovács.' },
                { claim: 'original name Pehm József', source: S.huMindszenty, locator: 'bevezető', excerpt: 'eredeti nevén Pehm József' },
                { claim: 'ordained 1915', locator: 'Early life and career', excerpt: 'Mindszenty was ordained a priest by Bishop János Mikes on 12 June 1915' },
                { claim: 'arrested by the Károlyi and Kun governments in 1919', locator: 'Early life and career', excerpt: 'He was arrested by Mihály Károlyi\'s progressive government on 9 February 1919 for speaking out against its \'socialist policies\', then rearrested by the communist Béla Kun government on 31 July that year.' },
                { claim: 'took the name Mindszenty from his home village', locator: 'Early life and career', excerpt: 'he adopted his new Hungarian name of Mindszenty, part of his home village\'s name' },
                { claim: 'Bishop of Veszprém, March 1944', locator: 'Early life and career', excerpt: 'On 25 March 1944, he was consecrated Bishop of Veszprém.' },
                { claim: 'arrested by the Arrow Cross in November 1944', locator: 'Early life and career', excerpt: 'Mindszenty was arrested on 27 November 1944 for his opposition to the Arrow Cross government\'s plan to quarter soldiers in parts of his official palace.' },
                { claim: 'released in April 1945', locator: 'Early life and career', excerpt: 'In April 1945, with the Arrow Cross puppet state collapsing, Mindszenty was released from house arrest at a church in Sopron.' },
                { claim: 'Primate and Archbishop of Esztergom, September 1945', locator: 'Church leader and opposition to communism', excerpt: 'On 15 September 1945, Mindszenty was appointed Primate of Hungary and Archbishop of Esztergom' },
                { claim: 'cardinal 1946', locator: 'Church leader and opposition to communism', excerpt: 'On 21 February 1946, Archbishop Mindszenty was elevated to Cardinal-Priest of Santo Stefano Rotondo by Pope Pius XII' },
                { claim: 'opposed communism', locator: 'lead', excerpt: 'After the war, he opposed communism and communist persecution in his country.' },
                { claim: 'fought the seizure of church schools', locator: 'Church leader and opposition to communism', excerpt: 'he fought fiercely against the state policy to emancipate the Hungarian educational system from Church control by seizing parochial schools' },
                { claim: 'arrested 26 December 1948', locator: 'Church leader and opposition to communism', excerpt: 'On 26 December 1948, Cardinal Mindszenty was arrested and accused of treason, conspiracy, and other offences against the new Hungarian People\'s Republic.' },
                { claim: 'beaten until he confessed', locator: 'Church leader and opposition to communism', excerpt: 'While imprisoned, Mindszenty was repeatedly hit with rubber truncheons and subjected to other forms of abuse, until he agreed to confess.' },
                { claim: 'show trial February 1949, life sentence', locator: 'Church leader and opposition to communism', excerpt: 'On 8 February, Mindszenty was sentenced to life imprisonment for black marketeering, treason and espionage.' },
                { claim: 'show trial began 3 February 1949', locator: 'Church leader and opposition to communism', excerpt: 'On 3 February 1949, Mindszenty\'s show trial began.' },
                { claim: 'freed during the 1956 revolution', locator: 'Church leader and opposition to communism', excerpt: 'on 30 October 1956, in the midst of the Hungarian Revolution, Mindszenty was released from prison' },
                { claim: 'asylum in the US embassy when the Soviets invaded; fifteen years', locator: 'Confinement at the US embassy', excerpt: 'On 4 November 1956, when the Soviet Union invaded Hungary to restore the communist government, Cardinal Mindszenty sought Imre Nagy\'s advice, and was granted political asylum at the United States embassy in Budapest. Mindszenty lived there for the next 15 years' },
                { claim: 'allowed to leave in 1971', locator: 'Exile', excerpt: 'The Hungarian government allowed Mindszenty to leave the country on 28 September 1971.' },
                { claim: 'lived in Vienna from October 1971', locator: 'Exile', excerpt: 'Beginning on 23 October 1971, he lived in Vienna, Austria' },
                { claim: 'Paul VI declared the see vacant on 5 February 1974', source: S.huMindszenty, locator: 'Az esztergomi prímási szék megüresedettnek nyilvánítása', excerpt: 'Koncepciós perének 25. évfordulóján, 1974. február 5-én VI. Pál pápa megüresedettnek nyilvánította az esztergomi érseki széket' },
                { claim: 'died in exile in Vienna, 1975', locator: 'Exile', excerpt: 'Mindszenty died on 6 May 1975, at the age of 83, in exile in Vienna.' },
            ],
        },
        activities: [
            { functionId: 'religion', affiliationId: null, startYear: 1944, endYear: 1974, primary: true, claim: '베스프렘 주교, 에스테르곰 대주교·수좌대주교, 추기경', locator: 'lead', excerpt: 'was a Hungarian cardinal of the Catholic Church who served as Archbishop of Esztergom and leader of the Catholic Church in Hungary from 1945 to 1973' },
        ],
        career: [
            ['1915', '사제 서품', 'Ordained priest'],
            ['1919', '카로이 정부와 쿤 벨러 정부에 체포됨', 'Arrested by the Károlyi and Béla Kun governments'],
            ['1944', '베스프렘 주교, 11월 화살십자당 정권에 체포됨', 'Bishop of Veszprém; arrested by the Arrow Cross government in November'],
            ['1945–1974', '에스테르곰 대주교, 수좌대주교', 'Archbishop of Esztergom, Primate of Hungary'],
            ['1946', '추기경 서임', 'Made a cardinal'],
            ['1948–1949', '체포, 여론 재판에서 종신형', 'Arrested; sentenced to life at a show trial'],
            ['1956–1971', '혁명 중 석방, 부다페스트 미국 대사관에 피신', 'Freed in the revolution; refuge in the US embassy in Budapest'],
            ['1971–1975', '빈에서 망명 생활', 'Exile in Vienna'],
        ],
    })),
];
