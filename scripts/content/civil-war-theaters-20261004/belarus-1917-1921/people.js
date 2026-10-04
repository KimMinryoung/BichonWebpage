// Person cards for the belarus-1917-1921 event (the Belarusian People's
// Republic and Soviet Byelorussia, 1917–1921), see lib.js person(). Excerpts are
// verbatim from the cited pages (en/ru/be Wikipedia as fetched 2026-10-04).
// Bodies with no catalog affiliation (the Belarusian Socialist Hramada and its
// successor parties, the Belarusian People's Committee, the Belarusian National
// Committee in Vilnius, the Borisov soviet) stay unresolved; literary work is
// independent. BNR service uses state-belarus; Soviet Byelorussian service uses
// state-soviet (the catalog has no separate Soviet Belarus affiliation).
// Native names are Belarusian Cyrillic. The card name 즈미체르 / Zmicier follows
// the event text; the sources give Зміцер / Змітро (Zmicier), kept as aliases.
// ru «Середа, Иван Емельянович» is a different person (a Soviet jurist) and is
// not used for Sierada; his card rests on en Jan Sierada and be Іван Мікітавіч Серада.
const { W, person } = require('../lib');

const E = t => W(encodeURI(t));
const RU = t => 'https://ru.wikipedia.org/wiki/' + encodeURI(t);
const BE = t => 'https://be.wikipedia.org/wiki/' + encodeURI(t);
const S = {
    sierada: E('Jan_Sierada'),
    sieradaBE: BE('Іван_Мікітавіч_Серада'),
    luck: E('Anton_Luckievich'),
    luckRU: RU('Луцкевич,_Антон_Иванович'),
    last: E('Vatslaw_Lastowski'),
    lastRU: RU('Ластовский,_Вацлав_Устинович'),
    zhyl: E('Zmicier_Zhylunovich'),
    zhylRU: RU('Жилунович,_Дмитрий_Фёдорович'),
    zhylBE: BE('Зміцер_Жылуновіч'),
    krech: E('Pyotra_Krecheuski'),
    krechRU: RU('Кречевский,_Пётр_Антонович'),
    krechBE: BE('Пётр_Антонавіч_Крачэўскі'),
};

// Activities without a catalog affiliation: literary work is independent,
// party and movement work in bodies the catalog lacks is unresolved.
const settle = card => ({
    ...card,
    activities: card.activities.map(a => (a.affiliationId ? a
        : a.functionId === 'arts' ? { ...a, affiliationStatus: 'independent', relation: 'independent' }
            : { ...a, affiliationStatus: 'unresolved', relation: 'unresolved' })),
});

module.exports = [
    settle(person({
        id: 'jan-sierada', groupId: 'world-interwar',
        given: ['얀', 'Jan'], family: ['세라다', 'Sierada'], nativeName: 'Ян Серада', years: '1879–1943 이후',
        citizenship: 'belarus', origin: 'belarus',
        epithet: ['제1차 전벨라루스 대회를 이끌고 라다 의장으로 독립 선포를 주재한 수의사',
            'Veterinarian who chaired the First All-Belarusian Congress and, as chairman of the Rada, presided over the declaration of independence'],
        bio: ['1879년 민스크현 자즈베야에서 태어나 1903년 바르샤바 수의학교를 마쳤고, 수의사이자 마리나호르카 농업학교 교사로 일했다. 러일전쟁에 종군했고 벨라루스 사회주의 흐라마다에서 활동했다. 1917년 12월 제1차 전벨라루스 대회 의장으로 뽑혔고 대회가 해산될 때 체포되었다. 1918년 2월 브레스트-리토프스크 강화 회담에 벨라루스 대표로 갔고, 3월 라다 의장이 되어 독립을 선포한 3월 24~25일 회의를 이끌었으며, 7~11월에는 인민서기국 의장을 지냈다. 1920년대 소비에트 벨로루시의 농업 부문에서 일하다 1930년 「벨라루스 해방동맹」 사건으로 체포되어 유형과 굴라크를 거쳤고, 1943년 석방된 뒤의 행적은 알려지지 않았다.',
            'Born in Zadzvieja in the Minsk Governorate in 1879, he graduated from the veterinary school in Warsaw in 1903 and worked as a veterinarian and as a teacher at the agricultural college in Marjina Horka. He served in the Russo-Japanese War and was active in the Belarusian Socialist Hramada. Elected chairman of the First All-Belarusian Congress in December 1917, he was arrested when it was dispersed. In February 1918 he was a Belarusian delegate at the Brest-Litovsk peace talks; as chairman of the Rada from March he presided over the session of 24–25 March that proclaimed independence, and from July to November he headed the People’s Secretariat. In the 1920s he worked in agriculture in Soviet Byelorussia; arrested in 1930 in the case of the “Union of Liberation of Belarus”, he passed through exile and the Gulag, and his fate after his release in 1943 is unknown.'],
        fate: ['', '행적 미상', 'Fate unknown'],
        aliases: { ko: ['이반 세라다', '얀카 세라다'], en: ['Ivan Sierada', 'Janka Sierada', 'Ivan Mikitavič Sierada', 'Yan Serada'] },
        sources: [S.sierada, S.sieradaBE],
        facts: {
            years: { claim: '1879 – after 1943', locator: 'lead', excerpt: '(13 May [O.S. 1 May] 1879 – after 19 November 1943)' },
            citizenship: { claim: 'Belarusian statesman, first president of the Rada', locator: 'lead', excerpt: 'was a Belarusian statesman, pedagogist and writer who served as the first president of the Rada of the Belarusian Democratic Republic' },
            nationalOrigin: { claim: 'born in Zadzvieja, Minsk Governorate', locator: 'Biography', excerpt: 'Ivan Mikitavič Sierada was born in the village of Zadzvieja in Minsk Governorate of the Russian Empire (now in Brest Region, Belarus).' },
            bio: [
                { claim: 'Russo-Japanese War service', locator: 'Biography', excerpt: 'From 1905 to 1906, Sierada served in the Imperial Russian Army in Manchuria during the Russo-Japanese War' },
                { claim: 'veterinary school in Warsaw; veterinarian and agricultural-college teacher', locator: 'Biography', excerpt: 'He graduated from a veterinary school in Warsaw in 1903 and worked as a veterinarian in the Minsk Governorate in 1907–1911. At the same time he was a teacher at an agricultural college in Marjina Horka.' },
                { claim: 'member of the Belarusian Socialist Hramada', locator: 'Biography', excerpt: 'Jan Sierada was an active member of the Belarusian Socialist Assembly.' },
                { claim: 'chairman of the First All-Belarusian Congress', locator: 'Biography', excerpt: 'In 1917, he was elected the chairman of the First All-Belarusian Congress.' },
                { claim: 'arrested at the dispersal of the congress', source: S.sieradaBE, locator: 'Біяграфія', excerpt: 'Пасля разгону З’езда бальшавікамі, быў арыштаваны разам з яшчэ 27 актыўнымі ўдзельнікамі, але ўсіх хутка адпусцілі.' },
                { claim: 'Belarusian delegate at Brest-Litovsk', locator: 'Biography', excerpt: 'In February 1918, he was a member of the Belarusian delegation (together with Simon Rak-Mikhailovsky and Alaksandar Ćvikievič) at the peace talks in Brest-Litovsk.' },
                { claim: 'Rada under his chairmanship adopted the Third Charter on the night of 24–25 March 1918', source: S.sieradaBE, locator: 'Біяграфія', excerpt: 'Пад кіраўніцтвам Янкі Серады Рада БНР на пасяджэнні ў ноч з 24 на 25 сакавіка 1918 года бальшынёй галасоў прыняла Трэцюю Устаўную грамату' },
                { claim: 'chairman of the People’s Secretariat until 11 November 1918', source: S.sieradaBE, locator: 'Біяграфія', excerpt: 'У ім Серада заняў пасаду Старшыні Народнага Сакратарыята і быў народным сакратаром замежных спраў да 11 лістапада 1918 года.' },
                { claim: 'worked in the agriculture ministry of the BSSR in the 1920s', locator: 'Biography', excerpt: 'In the 1920s, Sierada worked on different positions in the Agriculture Ministry of the Byelorussian Soviet Socialist Republic' },
                { claim: 'arrested in 1930 in the Union of Liberation of Belarus case', locator: 'Biography', excerpt: 'On 4 July 1930, Sierada was arrested by the NKVD as part of the so-called Case of the Union of Liberation of Belarus.' },
                { claim: 'exile, Gulag sentence, release in 1943, fate unknown', locator: 'Biography', excerpt: 'He was set free, on 19 November 1943, from the gulag camp chain (Krasnoyarsk Krai) and his further fate is unknown.' },
            ],
        },
        activities: [
            { functionId: 'legislature', affiliationId: 'state-belarus', startYear: 1918, endYear: 1918, primary: true, claim: 'First chairman of the Rada of the Belarusian People’s Republic', source: S.sieradaBE, locator: 'Біяграфія', excerpt: 'Першы старшыня Рады Беларускай Народнай Рэспублікі (18 сакавіка—14 траўня 1918).' },
            { functionId: 'government', affiliationId: 'state-belarus', startYear: 1918, endYear: 1918, claim: 'Chairman of the People’s Secretariat and secretary for foreign affairs', source: S.sieradaBE, locator: 'Біяграфія', excerpt: 'У ім Серада заняў пасаду Старшыні Народнага Сакратарыята і быў народным сакратаром замежных спраў да 11 лістапада 1918 года.' },
            { functionId: 'diplomacy', affiliationId: 'state-belarus', startYear: 1918, endYear: 1918, claim: 'Member of the Belarusian delegation at Brest-Litovsk', locator: 'Biography', excerpt: 'In February 1918, he was a member of the Belarusian delegation (together with Simon Rak-Mikhailovsky and Alaksandar Ćvikievič) at the peace talks in Brest-Litovsk.' },
            { functionId: 'organizing', affiliationId: null, startYear: 1917, endYear: 1917, claim: 'Chairman of the First All-Belarusian Congress (no catalog affiliation)', locator: 'Biography', excerpt: 'In 1917, he was elected the chairman of the First All-Belarusian Congress.' },
            { functionId: 'agriculture', affiliationId: 'state-soviet', startYear: 1921, endYear: 1925, claim: 'Worked in the People’s Commissariat of Agriculture of the BSSR', locator: 'Biography', excerpt: 'In the 1920s, Sierada worked on different positions in the Agriculture Ministry of the Byelorussian Soviet Socialist Republic' },
            { functionId: 'education', affiliationId: 'state-soviet', startYear: 1925, endYear: 1929, claim: 'Docent at the Belarusian Agricultural Academy in Horki', source: S.sieradaBE, locator: 'Біяграфія', excerpt: 'У ліпені 1925—снежні 1929 гадоў дацэнт Беларускай сельскагаспадарчай акадэміі ў Горы-Горках' },
        ],
        career: [
            ['1907–1911', '민스크현 수의사, 마리나호르카 농업학교 교사', 'Veterinarian in the Minsk Governorate; teacher at the Marjina Horka agricultural college'],
            ['1917', '제1차 전벨라루스 대회 의장', 'Chairman of the First All-Belarusian Congress'],
            ['1918', '브레스트-리토프스크 강화 회담 벨라루스 대표단원', 'Member of the Belarusian delegation at the Brest-Litovsk peace talks'],
            ['1918', '벨라루스 인민공화국 라다 의장', 'Chairman of the Rada of the Belarusian People’s Republic'],
            ['1918', '벨라루스 인민공화국 인민서기국 의장·외무 서기', 'Chairman of the People’s Secretariat and secretary for foreign affairs'],
            ['1925–1929', '벨로루시 농업 아카데미 강사', 'Docent at the Belarusian Agricultural Academy'],
        ],
    })),
    settle(person({
        id: 'anton-luckievic', groupId: 'world-interwar',
        given: ['안톤', 'Anton'], family: ['루츠케비치', 'Luckievič'], nativeName: 'Антон Луцкевіч', years: '1884–1942',
        citizenship: 'belarus', origin: 'belarus',
        epithet: ['흐라마다를 세우고 벨라루스 인민공화국 총리로 파리 강화회의에 승인을 구한 민족운동가',
            'Founder of the Hramada who, as prime minister of the Belarusian People’s Republic, sought its recognition at the Paris Peace Conference'],
        bio: ['1884년 샤울랴이에서 몰락 귀족 집안에 태어나 1903년 형 이반 등과 벨라루스 혁명 흐라마다(뒤의 사회주의 흐라마다)를 세웠다. 빌뉴스에서 『나샤 니바』 등 첫 벨라루스어 신문들을 냈고, 1915년 독일 점령 아래에서 비밀 조직 벨라루스 민중위원회를 이끌었다. 1918년 빌뉴스 벨라루스 평의회 의장으로 독립 선포에 참여했고, 10월 총리, 이어 외무장관이 되었다. 1919년 파리 강화회의에 대표단을 이끌고 폴란드와 국가 연합을 협상했으나 성과 없이 1920년 2월 사임했다. 서벨라루스에서 출판과 교육에 힘쓰다 1939년 소련 당국에 체포되었고, 1942년 수용소로 이송되던 중 죽었다.',
            'Born into an impoverished noble family in Šiauliai in 1884, he founded the Belarusian Revolutionary Hramada (later the Belarusian Socialist Hramada) with his brother Ivan and others in 1903. In Vilnius he brought out the first Belarusian newspapers, Nasha Niva among them, and under German occupation in 1915 he led the clandestine Belarusian People’s Committee. As president of the Belarusian Council of Vilnius he took part in the declaration of independence in 1918, and in October he became prime minister and then foreign minister. In 1919 he led the delegation to the Paris Peace Conference and negotiated a union with Poland, but with no result he resigned in February 1920. He devoted himself to publishing and education in Western Belarus until the Soviet authorities arrested him in 1939, and he died in 1942 while being transferred to a prison camp.'],
        fate: ['natural', '이송 중 사망', 'Died in prisoner transit'],
        aliases: { ko: [], en: ['Anton Luckievich', 'Anton Łuckievič', 'Anton Lutskevich', 'Antoni Łuckiewicz', 'Antonas Luckevičius'] },
        sources: [S.luck, S.luckRU],
        facts: {
            years: { claim: '1884–1942', locator: 'lead', excerpt: '29 January 1884 – 23 March 1942' },
            citizenship: { claim: 'leader of the Belarusian independence movement and BNR prime minister', locator: 'lead', excerpt: 'was a leading figure of the Belarusian independence movement in the early 20th century, an initiator of the proclamation of the independence of Belarus, the Prime Minister and the Minister of Foreign Affairs of the Belarusian Democratic Republic' },
            nationalOrigin: { claim: 'born in Šiauliai into a petty noble family', locator: 'Early life', excerpt: 'Luckievič was born in Šiauliai, Kovno Governorate, Russian Empire into the family of a petty nobleman' },
            bio: [
                { claim: 'founded the Belarusian Revolutionary Hramada in 1903', locator: 'Involvement in revolutionary activities', excerpt: 'In 1903 Luckievič, together with his brother Ivan and another prominent figure of the Belarusian national movement, Vacłaŭ Ivanoŭski, founded the Belarusian Revolutionary Assembly (later the Belarusian Socialist Assembly)' },
                { claim: 'first Belarusian newspapers in Vilnius', locator: 'Involvement in revolutionary activities', excerpt: 'the publication of the first Belarusian newspapers "Naša Dolia" ("Our Destiny"), "Naša Niva" ("Our Cornfield") and "Homan" (the "Babble")' },
                { claim: 'headed the clandestine Belarusian People’s Committee', locator: 'World War I', excerpt: "this Society actually covered the clandestine Belarusian People's Committee that was also headed by Luckievič" },
                { claim: 'president of the Belarusian Council of Vilnius; independence declaration', locator: 'At the time of the Belarusian Democratic Republic', excerpt: 'In 1918, Luckievič was elected President of the Belarusian Council of Vilnius.' },
                { claim: 'prime minister and foreign minister from October 1918', locator: 'At the time of the Belarusian Democratic Republic', excerpt: 'On 12 October 1918, he was appointed prime minister, and later that year, Minister of Foreign Affairs.' },
                { claim: 'Paris Peace Conference memorandum', locator: 'At the time of the Belarusian Democratic Republic', excerpt: 'Luckievič made every effort in order for representatives of the Belarusian Democratic Republic to participate in the Paris Peace Conference (1919–1920).' },
                { claim: 'draft union agreement with Poland handed to Paderewski', locator: 'At the time of the Belarusian Democratic Republic', excerpt: 'handed over a draft agreement “On the Creation of the Union of Two Sovereign States – the Belarusian Democratic Republic and the Polish Republic” to him' },
                { claim: 'resigned on 28 February 1920', locator: 'At the time of the Belarusian Democratic Republic', excerpt: 'However, having failed to come to an agreement with Poland, Luckievič resigned on 28 February 1920 and left for Vilnius.' },
                { claim: 'teaching and publishing in Vilnius', locator: 'In Western Belarus', excerpt: 'He also taught in the Belarusian Gymnasium of Vilnius' },
                { claim: 'arrested by the Soviet authorities in 1939', locator: 'Arrest by Soviet authorities and death', excerpt: 'On 30 September 1939, Luckievič was arrested by the Soviet authorities in Vilnius and, later, transferred to Minsk.' },
                { claim: 'died during transfer to a prison camp', locator: 'Arrest by Soviet authorities and death', excerpt: 'Luckievič died on 23 March 1942 during his transfer to the prison camp.' },
            ],
        },
        activities: [
            { functionId: 'government', affiliationId: 'state-belarus', startYear: 1918, endYear: 1920, primary: true, claim: 'Prime minister of the Belarusian People’s Republic, 1918–1920', locator: 'At the time of the Belarusian Democratic Republic', excerpt: 'On 12 October 1918, he was appointed prime minister, and later that year, Minister of Foreign Affairs.' },
            { functionId: 'diplomacy', affiliationId: 'state-belarus', startYear: 1919, endYear: 1919, claim: 'Led the BNR approach to the Paris Peace Conference', locator: 'At the time of the Belarusian Democratic Republic', excerpt: 'On 22 January 1919, he signed a memorandum of the Belarusian Government to the Chairperson of the Paris Peace Conference' },
            { functionId: 'organizing', affiliationId: null, startYear: 1903, endYear: null, claim: 'Co-founder of the Belarusian Revolutionary (Socialist) Hramada (no catalog affiliation)', locator: 'Involvement in revolutionary activities', excerpt: 'In 1903 Luckievič, together with his brother Ivan and another prominent figure of the Belarusian national movement, Vacłaŭ Ivanoŭski, founded the Belarusian Revolutionary Assembly (later the Belarusian Socialist Assembly)' },
            { functionId: 'organizing', affiliationId: null, startYear: 1915, endYear: 1918, claim: 'Head of the clandestine Belarusian People’s Committee in Vilnius (no catalog affiliation)', locator: 'World War I', excerpt: "this Society actually covered the clandestine Belarusian People's Committee that was also headed by Luckievič" },
            { functionId: 'organizing', affiliationId: null, startYear: 1921, endYear: null, claim: 'President of the Belarusian National Committee in Vilnius (no catalog affiliation)', locator: 'In Western Belarus', excerpt: 'In 1921, Luckievič became President of the Belarusian National Committee in Vilnius.' },
        ],
        career: [
            ['1903', '벨라루스 혁명 흐라마다 공동 창립', 'Co-founder of the Belarusian Revolutionary Hramada'],
            ['1915', '빌뉴스의 비밀 조직 벨라루스 민중위원회 지도', 'Head of the clandestine Belarusian People’s Committee in Vilnius'],
            ['1918', '빌뉴스 벨라루스 평의회 의장', 'President of the Belarusian Council of Vilnius'],
            ['1918–1920', '벨라루스 인민공화국 총리·외무장관', 'Prime minister and foreign minister of the Belarusian People’s Republic'],
            ['1921', '빌뉴스 벨라루스 민족위원회 의장', 'President of the Belarusian National Committee in Vilnius'],
            ['1921–1939', '빌뉴스 벨라루스 박물관장', 'Director of the Belarusian Museum in Vilnius'],
        ],
    })),
    settle(person({
        id: 'vaclau-lastouski', groupId: 'world-interwar',
        given: ['바츨라우', 'Vaclau'], family: ['라스토우스키', 'Lastouski'], nativeName: 'Вацлаў Ластоўскі', years: '1883–1938',
        citizenship: 'belarus', origin: 'belarus',
        epithet: ['벨라루스 인민공화국 망명 정부를 이끌다 소비에트 벨로루시로 돌아가 처형된 역사가',
            'Historian who headed the government of the Belarusian People’s Republic in exile, moved to Soviet Byelorussia and was executed'],
        bio: ['1883년 빌뉴스현 디스나군의 땅 없는 귀족 집안에서 태어나 정규 교육을 거의 받지 못했다. 1906~1908년 흐라마다에서 활동하고 『나샤 니바』 편집 비서를 지냈으며, 1915년부터 러시아와 폴란드 양쪽으로부터의 독립을 공개적으로 주장했다. 1918년 빌뉴스 벨라루스 평의회 대표로 라다에 들어갔고, 1919년 벨라루스 사회혁명당을 이끌었다. 1919년 12월 총리가 되었으나 곧 폴란드 당국에 체포되었고, 이듬해 풀려나 리가로 간 뒤 유럽 각국을 돌며 승인을 호소하다 1923년 물러났다. 1927년 소비에트 벨로루시로 가 국립박물관장과 과학아카데미 회원이 되었으나, 1930년 체포되어 사라토프로 유배되었고 1938년 총살되었다.',
            'Born into a landless noble family in the Disna district of the Vilna Governorate in 1883, he had almost no formal schooling. He was active in the Hramada in 1906–1908, was editorial secretary of Nasha Niva and from 1915 openly advocated independence from both Russia and Poland. In 1918 he joined the Rada as a delegate of the Belarusian Council of Vilnius, and in 1919 he led the Belarusian Socialist Revolutionaries. Appointed prime minister in December 1919, he was soon arrested by the Polish authorities; released the following year, he went to Riga and toured European capitals seeking recognition until he stepped down in 1923. In 1927 he moved to Soviet Byelorussia, where he became director of the State Museum and a member of the Academy of Sciences, but he was arrested in 1930, exiled to Saratov and shot in 1938.'],
        fate: ['executed', '총살', 'Executed by shooting'],
        aliases: { ko: ['바츨라프 라스톱스키'], en: ['Vatslaw Lastowski', 'Vacłaŭ Lastoŭski', 'Wacław Łastowski', 'Vaclovas Lastauskas', 'Vatslav Lastovsky'] },
        sources: [S.last, S.lastRU],
        facts: {
            years: { claim: '1883–1938', locator: 'lead', excerpt: '8 November 1883 – 23 January 1938' },
            citizenship: { claim: 'Belarusian independence leader and BNR prime minister', locator: 'lead', excerpt: 'was a leading figure of the Belarusian independence movement in the early 20th century and the Prime Minister of the Belarusian Democratic Republic from 1919 to 1923' },
            nationalOrigin: { claim: 'born in the Disna uyezd of the Vilna Governorate', locator: 'Early years', excerpt: 'Lastowski was born on 8 November 1883 in the village of Kalyesnikaw in the Disna uyezd of the Vilna Governorate of the Russian Empire (now Lastovichi, Belarus) into the family of a landless nobleman.' },
            bio: [
                { claim: 'no formal education', locator: 'Early years', excerpt: 'Afterwards, he would not be formally educated anywhere.' },
                { claim: 'Hramada member 1906–1908; Nasha Niva secretary', locator: 'Early years', excerpt: 'He was a member of the Belarusian Socialist Assembly between 1906 and 1908 and was imprisoned for socialist propaganda for several months in 1906. Lastowski was also a secretary of the editorial board of the Belarusian newspaper Nasha Niva.' },
                { claim: 'independence from Russia and Poland from 1915', locator: 'Involvement in the Belarusian independence movement', excerpt: 'Starting from 1915, Lastowski openly supported the idea of independence of Belarus both from Russia and Poland.' },
                { claim: 'delegate of the Vilnius council to the Rada', locator: 'Involvement in the Belarusian independence movement', excerpt: 'He was elected as one of the representatives of this council to participate in the Rada of the Belarusian Democratic Republic' },
                { claim: 'leader of the Belarusian SRs in 1919', locator: 'Involvement in the Belarusian independence movement', excerpt: 'In 1919 he became the leader of the Belarusian Socialist Revolutionaries.' },
                { claim: 'prime minister in December 1919, arrested by the Poles', locator: 'Involvement in the Belarusian independence movement', excerpt: 'On 17 December 1919, he was arrested in Minsk by the Polish authorities that did not recognise the independent Belarusian state.' },
                { claim: 'released, went to Riga', locator: 'Involvement in the Belarusian independence movement', excerpt: 'Released in February 1920, Lastowski went to Riga.' },
                { claim: 'resigned in 1923', locator: 'Involvement in the Belarusian independence movement', excerpt: 'In 1923 he resigned from the post of prime minister of the Belarusian Democratic Republic and withdrew from political activities.' },
                { claim: 'moved to Soviet Belarus in 1927; museum director', locator: 'Life in Lithuania and relocation to Soviet Belarus', excerpt: 'He was appointed Director of the Belarusian State Museum, worked at the Inbelkult, and was head of the ethnographic department of the Belarusian Academy of Sciences.' },
                { claim: 'arrested 1930, exiled to Saratov', locator: 'Persecution by the Soviet authorities and death', excerpt: 'On 10 April 1931 Lastowski was sentenced to be exiled for five years to Saratov' },
                { claim: 'shot on 23 January 1938', source: S.lastRU, locator: 'Репрессии и расстрел', excerpt: 'В начале 1938 года повторно арестован в Саратове и 23 января расстрелян.' },
            ],
        },
        activities: [
            { functionId: 'government', affiliationId: 'state-belarus', startYear: 1919, endYear: 1923, primary: true, claim: 'Prime minister of the Belarusian People’s Republic, 1919–1923', locator: 'lead', excerpt: 'the Prime Minister of the Belarusian Democratic Republic from 1919 to 1923' },
            { functionId: 'diplomacy', affiliationId: 'state-belarus', startYear: 1920, endYear: 1923, claim: 'Diplomatic missions for the BNR government', locator: 'Involvement in the Belarusian independence movement', excerpt: 'From 1920 to 1923 Lastowski went on diplomatic missions to Belgium, Germany, the Vatican, Italy, Czechoslovakia, France, Switzerland, and other countries.' },
            { functionId: 'political-leadership', affiliationId: null, startYear: 1919, endYear: 1919, claim: 'Leader of the Belarusian Socialist Revolutionaries (no catalog affiliation)', locator: 'Involvement in the Belarusian independence movement', excerpt: 'In 1919 he became the leader of the Belarusian Socialist Revolutionaries.' },
            { functionId: 'scholarship', affiliationId: 'state-soviet', startYear: 1927, endYear: 1930, claim: 'Director of the Belarusian State Museum and academician in Soviet Belarus', locator: 'Life in Lithuania and relocation to Soviet Belarus', excerpt: 'He was appointed Director of the Belarusian State Museum, worked at the Inbelkult, and was head of the ethnographic department of the Belarusian Academy of Sciences.' },
        ],
        career: [
            ['1909', '『나샤 니바』 편집 비서', 'Editorial secretary of Nasha Niva'],
            ['1918', '벨라루스 인민공화국 라다 위원(빌뉴스 벨라루스 평의회 대표)', 'Member of the Rada for the Belarusian Council of Vilnius'],
            ['1918', '리투아니아 주재 벨라루스 대표', 'Head of the Belarusian representation in Lithuania'],
            ['1919–1923', '벨라루스 인민공화국 총리', 'Prime minister of the Belarusian People’s Republic'],
            ['1927–1930', '벨로루시 국립박물관장', 'Director of the Belarusian State Museum'],
            ['1928', '벨로루시 과학아카데미 회원', 'Academician of the Belarusian Academy of Sciences'],
        ],
    })),
    settle(person({
        id: 'zmicier-zhylunovich', groupId: 'bolshevik',
        given: ['즈미체르', 'Zmicier'], family: ['질루노비치', 'Zhylunovich'], nativeName: 'Зміцер Жылуновіч', years: '1887–1937',
        citizenship: 'soviet', origin: 'belarus',
        epithet: ['「치시카 하르트니」라는 필명의 노동자 시인으로 소비에트 벨로루시 첫 정부를 이끈 볼셰비키',
            'Worker-poet known as Tsishka Hartny who headed the first Soviet government of Byelorussia'],
        bio: ['1887년 코필의 농민 집안에서 태어나 무두장이로 일했고, 1904년 흐라마다에 들어가 『나샤 니바』에 기고했다. 1913년부터 페트로그라드의 공장에서 일하며 「치시카 하르트니」라는 필명으로 시를 썼다. 1918년 벨라루스 민족위원부 비서로서 빌헬름 크노린과 알렉산드르 먀스니코프에 맞서 벨라루스 공화국 수립을 주장해 레닌과 스탈린의 지지를 얻었다. 1919년 1월 1일부터 2월 3일까지 벨로루시 사회주의 소비에트 공화국 임시 노동자·농민 정부 수반을 지냈다. 뒤에 출판·문화 기관을 이끌고 학술원 회원이 되었으나 1931년 당에서 제명되었고, 1936년 체포되어 1937년 모길료프의 정신병원에서 죽었다. 자살했다는 기록도 있다.',
            'Born into a peasant family in Kapyl in 1887, he worked as a tanner, joined the Hramada in 1904 and wrote for Nasha Niva. From 1913 he worked in Petrograd factories and wrote poetry under the pen name Tsishka Hartny. In 1918, as secretary of the Belarusian National Commissariat, he campaigned for a Belarusian republic against Vilgelm Knorin and Alexander Myasnikov and won the support of Lenin and Stalin. From 1 January to 3 February 1919 he headed the Provisional Workers’ and Peasants’ Government of the Socialist Soviet Republic of Byelorussia. He later ran publishing and cultural institutions and became an academician, but was expelled from the party in 1931, arrested in 1936 and died in 1937 in a psychiatric hospital in Mogilev; some accounts say he took his own life.'],
        fate: ['', '구금 중 사망', 'Died in custody'],
        aliases: { ko: ['치시카 하르트니', '즈미치에르 질루노비치', '드미트리 질루노비치'], en: ['Tsishka Hartny', 'Ciška Hartny', 'Zmicier Žyłunovič', 'Dmitri Zhilunovich', 'Dmitry Zhilunovich'] },
        sources: [S.zhyl, S.zhylRU, S.zhylBE],
        facts: {
            years: { claim: '1887–1937', locator: 'lead', excerpt: '(October 13, 1887 – April 11, 1937)' },
            citizenship: { claim: 'head of the Provisional Government of the SSRB', source: S.zhylRU, locator: 'lead', excerpt: 'Глава Временного рабоче-крестьянского правительства Советской Социалистической Республики Белоруссия (1 января 1919 года — 3 февраля 1919 года).' },
            nationalOrigin: { claim: 'born in Kapyl; Belarusian', source: S.zhylRU, locator: 'Биография', excerpt: 'Родился 4 ноября 1887 года в городском посёлке Копыль (ныне Минская область, Беларусь) в крестьянской семье. По национальности белорус.' },
            bio: [
                { claim: 'worked in a tannery', source: S.zhylRU, locator: 'Биография', excerpt: 'Работал в кожевенной мастерской.' },
                { claim: 'joined the Hramada in 1904; Nasha Niva', locator: 'Life', excerpt: 'In 1904, Zhylunovich joined the Belarusian Socialist Assembly and took part in organizing Belarusian workers. He contributed to the newspaper Nasha Niva and helped in its distribution.' },
                { claim: 'Vulkan plant in Petersburg from 1913', source: S.zhylRU, locator: 'Биография', excerpt: 'В мае 1913 года начал работать на заводе «Вулкан» в Петербурге.' },
                { claim: 'pen name Tsishka Hartny', locator: 'lead', excerpt: 'known under pen name Tsishka Hartny' },
                { claim: 'Belnatskom secretary; fought Knorin and Myasnikov for a republic, backed by Lenin and Stalin', source: S.zhylRU, locator: 'Биография', excerpt: 'Вёл борьбу за создание Беларуской Республики против Вильгельма Кнорина и Александра Мясникова, не признававших белорусов самостоятельной нацией, нашёл поддержку у В. И. Ленина и И. В. Сталина.' },
                { claim: 'head of the provisional government, 1 January – 3 February 1919', source: S.zhylRU, locator: 'Биография', excerpt: 'Со дня создания Советской Социалистической Республики Беларусь (1 января 1919) до 3 февраля 1919 года был главой Временного рабоче-крестьянского правительства Советской Беларуси.' },
                { claim: 'academician from 1928', source: S.zhylRU, locator: 'Биография', excerpt: 'в 1928 году избран академиком Академии Наук БССР' },
                { claim: 'expelled from the party in 1931', source: S.zhylRU, locator: 'Биография', excerpt: 'В 1931 г. был исключен из Коммунистической партии за связь с «нацдемовским подпольем».' },
                { claim: 'arrested 15 November 1936', source: S.zhylRU, locator: 'Биография', excerpt: '15 ноября 1936 года был арестован.' },
                { claim: 'died in the Mogilev psychiatric hospital; possibly suicide', source: S.zhylRU, locator: 'Биография', excerpt: 'переведён в Могилёвскую психиатрическую лечебницу, где и умер 11 апреля 1937 года. По некоторым данным — покончил жизнь самоубийством.' },
            ],
        },
        activities: [
            { functionId: 'government', affiliationId: 'state-soviet', startYear: 1919, endYear: 1919, primary: true, claim: 'Head of the Provisional Workers’ and Peasants’ Government of the SSRB', source: S.zhylRU, locator: 'lead', excerpt: 'Глава Временного рабоче-крестьянского правительства Советской Социалистической Республики Белоруссия (1 января 1919 года — 3 февраля 1919 года).' },
            { functionId: 'government', affiliationId: 'state-soviet', startYear: 1918, endYear: 1918, claim: 'Secretary of the Belarusian National Commissariat', source: S.zhylBE, locator: 'Біяграфія', excerpt: 'З лютага па снежань 1918 — сакратар Беларускага нацыянальнага камісарыята.' },
            { functionId: 'legislature', affiliationId: 'state-soviet', startYear: 1920, endYear: 1931, claim: 'Member of the Central Executive Committee of the BSSR', source: S.zhylRU, locator: 'Биография', excerpt: 'Был членом ЦИК БССР (1920—1931).' },
            { functionId: 'propaganda', affiliationId: 'state-soviet', startYear: 1921, endYear: null, claim: 'Head of the State Publishing House and Glaviskusstvo of the BSSR, deputy commissar of education', source: S.zhylBE, locator: 'Біяграфія', excerpt: 'Узначальваў Дзяржвыдавецтва БССР і Цэнтральны архіў БССР, працаваў намеснікам наркама асветы і старшынёй Галоўмастацтва БССР' },
            { functionId: 'organizing', affiliationId: null, startYear: 1904, endYear: null, claim: 'Member of the Belarusian Socialist Hramada, organizing Belarusian workers (no catalog affiliation)', locator: 'Life', excerpt: 'In 1904, Zhylunovich joined the Belarusian Socialist Assembly and took part in organizing Belarusian workers.' },
            { functionId: 'arts', affiliationId: null, startYear: null, endYear: null, claim: 'Poet, prose writer and playwright Tsishka Hartny', source: S.zhylRU, locator: 'lead', excerpt: 'белорусский прозаик, поэт, публицист, драматург, переводчик, журналист' },
        ],
        career: [
            ['1913', '페트로그라드 「불칸」 공장 노동자', 'Worker at the Vulkan plant in Petrograd'],
            ['1918', '벨라루스 민족위원부 비서', 'Secretary of the Belarusian National Commissariat'],
            ['1919', '벨로루시 사회주의 소비에트 공화국 임시 노동자·농민 정부 수반', 'Head of the Provisional Workers’ and Peasants’ Government of the Socialist Soviet Republic of Byelorussia'],
            ['1920–1931', '벨로루시 중앙집행위원회 위원', 'Member of the Central Executive Committee of the BSSR'],
            ['1928', '벨로루시 과학아카데미 회원', 'Academician of the Academy of Sciences of the BSSR'],
        ],
    })),
    settle(person({
        id: 'piotra-krecheuski', groupId: 'world-interwar',
        given: ['피오트라', 'Piotra'], family: ['크레체우스키', 'Krečeŭski'], nativeName: 'Пётра Крэчэўскі', years: '1879–1928',
        citizenship: 'belarus', origin: 'belarus',
        epithet: ['1919년부터 죽을 때까지 망명지 프라하에서 벨라루스 인민공화국 라다를 이끈 의장',
            'Chairman of the Rada of the Belarusian People’s Republic from 1919 until his death, leading it in exile from Prague'],
        bio: ['1879년 그로드노현의 시골 교회 보제 집안에서 태어나 빌뉴스 신학교를 마치고 교사로 일했으며, 1909년부터 빌뉴스 국립은행에서 근무했다. 1917년 보리소프 노동자·병사 대표 소비에트 의장으로 제1차 전벨라루스 대회에 대의원으로 참석해 집행위원회에 들어갔다. 1918년 인민서기국의 국가감사관, 재무·통상 서기를 지냈고 사회주의 연방주의자당의 지도자가 되었다. 1919년 12월 13일 라다 의장이 되었고, 1920년 망명해 카우나스와 베를린을 거쳐 1923년부터 프라하에서 라다를 대표했다. 1921년 리가 조약을 규탄한 프라하 회의를 열었고, 1925년 망명 정부의 자진 해산 결정을 인정하지 않았다. 1928년 프라하에서 죽었다.',
            'Born in 1879 into the family of a village church deacon in the Grodno Governorate, he graduated from the seminary in Vilnius, worked as a teacher and from 1909 was employed at the Vilnius State Bank. In 1917, as chairman of the Borisov Soviet of Workers’ and Soldiers’ Deputies, he was a delegate to the First All-Belarusian Congress and joined its executive committee. In 1918 he was state controller and then secretary for finance and for trade in the People’s Secretariat, and became one of the leaders of the Socialist Federalist party. He became chairman of the Rada on 13 December 1919, went into exile in 1920 and represented the Rada from Kaunas and Berlin and, from 1923, Prague. In 1921 he organised a conference in Prague that condemned the Peace of Riga, and in 1925 he refused to accept the decision to dissolve the government in exile. He died in Prague in 1928.'],
        fate: ['exile', '망명지에서 사망', 'Died in exile'],
        aliases: { ko: ['표트르 크레쳅스키'], en: ['Pyotra Krecheuski', 'Piotra Krecheuski', 'Pyotr Krechevsky'] },
        sources: [S.krech, S.krechRU, S.krechBE],
        facts: {
            years: { claim: '1879–1928', locator: 'lead', excerpt: 'August 7, 1879 – March 8, 1928, Prague' },
            citizenship: { claim: 'Belarusian statesman, president of the Rada in exile', locator: 'lead', excerpt: 'was a Belarusian statesman and president of the Rada of the Belarusian Democratic Republic in exile' },
            nationalOrigin: { claim: 'born near Kobryn into a deacon’s family', source: S.krechRU, locator: 'Ранние годы', excerpt: 'Родился неподалёку от города Кобрина (либо в д. Дубно Гродненского уезда, ныне: Мостовский район) в семье дьякона деревенской церкви.' },
            bio: [
                { claim: 'Vilnius seminary, teacher, then State Bank from 1909', source: S.krechRU, locator: 'Ранние годы', excerpt: 'Вскоре Кречевский отказался и от преподавательской работы, устроившись в администрацию Виленского государственного банка (1909 год).' },
                { claim: 'chairman of the Borisov soviet; delegate to the congress and member of its executive', source: S.krechRU, locator: 'БНР', excerpt: 'В 1917 году — председатель Совета рабочих и солдатских депутатов города Борисова. От Совета делегирован на Всебелорусский съезд, где вошёл в состав исполкома.' },
                { claim: 'state controller, finance and trade in the People’s Secretariat', source: S.krechRU, locator: 'БНР', excerpt: 'В феврале 1918 года стал членом первого белорусского правительства, Народного секретариата, с функцией государственного контролёра.' },
                { claim: 'leader of the Socialist Federalists', source: S.krechBE, locator: 'Біяграфія', excerpt: 'адзін з лідараў Беларускай партыі сацыялістаў-федэралістаў' },
                { claim: 'chairman of the Rada from 13 December 1919', source: S.krechRU, locator: 'БНР', excerpt: '13 декабря 1919 года Кречевский сменил Язепа Лёсика на посту председателя Рады (фактически — президента) БНР.' },
                { claim: 'exile via Kaunas and Berlin to Prague', source: S.krechRU, locator: 'БНР', excerpt: 'В феврале 1920 года он был вынужден эмигрировать вместе с Радой, представляя интересы белорусов в Ковно, Берлине и — с 1923 года — в Праге.' },
                { claim: 'Prague conference of 1921 condemned the Peace of Riga', locator: 'lead', excerpt: 'He organized a conference of Belarusian emigrant organizations in September 1921 that criticized the Polish-Bolshevist Peace of Riga that divided Belarus in two parts.' },
                { claim: 'rejected the 1925 Berlin decision to liquidate the BNR government', source: S.krechRU, locator: 'В эмиграции', excerpt: 'Не признал просоветского решения Всебелорусской конференции в Берлине (1925) о ликвидации правительства БНР.' },
                { claim: 'died in Prague in 1928', source: S.krechRU, locator: 'В эмиграции', excerpt: 'Возглавлял Раду БНР до самой смерти. Умер в 1928 году в Праге.' },
            ],
        },
        activities: [
            { functionId: 'legislature', affiliationId: 'state-belarus', startYear: 1919, endYear: 1928, primary: true, claim: 'Chairman of the Rada of the Belarusian People’s Republic, 1919–1928', source: S.krechRU, locator: 'БНР', excerpt: '13 декабря 1919 года Кречевский сменил Язепа Лёсика на посту председателя Рады (фактически — президента) БНР.' },
            { functionId: 'economy', affiliationId: 'state-belarus', startYear: 1918, endYear: 1918, claim: 'Secretary for finance and then for trade of the BNR', source: S.krechRU, locator: 'БНР', excerpt: 'В апреле того же года занял пост министра финансов, а в мае — министра торговли Белорусской Народной Республики.' },
            { functionId: 'diplomacy', affiliationId: 'state-belarus', startYear: 1920, endYear: 1928, claim: 'Represented the BNR in exile in Kaunas, Berlin and, from 1923, Prague', source: S.krechRU, locator: 'БНР', excerpt: 'В феврале 1920 года он был вынужден эмигрировать вместе с Радой, представляя интересы белорусов в Ковно, Берлине и — с 1923 года — в Праге.' },
            { functionId: 'organizing', affiliationId: null, startYear: 1917, endYear: 1917, claim: 'Chairman of the Borisov Soviet of Workers’ and Soldiers’ Deputies (no catalog affiliation)', source: S.krechRU, locator: 'БНР', excerpt: 'В 1917 году — председатель Совета рабочих и солдатских депутатов города Борисова.' },
            { functionId: 'political-leadership', affiliationId: null, startYear: 1918, endYear: null, claim: 'A leader of the Belarusian Party of Socialist Federalists (no catalog affiliation)', source: S.krechBE, locator: 'Біяграфія', excerpt: 'адзін з лідараў Беларускай партыі сацыялістаў-федэралістаў' },
        ],
        career: [
            ['1902', '빌뉴스 신학교 졸업, 교사', 'Graduated from the Vilnius seminary; teacher'],
            ['1909', '빌뉴스 국립은행 근무', 'Employee of the Vilnius State Bank'],
            ['1917', '보리소프 노동자·병사 대표 소비에트 의장', 'Chairman of the Borisov Soviet of Workers’ and Soldiers’ Deputies'],
            ['1918', '인민서기국 국가감사관, 재무·통상 서기', 'State controller, then secretary for finance and for trade in the People’s Secretariat'],
            ['1918', '벨라루스 인민공화국 라다 서기', 'Secretary of the Rada of the Belarusian People’s Republic'],
            ['1919–1928', '벨라루스 인민공화국 라다 의장', 'Chairman of the Rada of the Belarusian People’s Republic'],
            ['1926', '연감 『해외 벨라루스』 편집', 'Editor of the almanac Zamiežnaja Biełaruś'],
        ],
    })),
];
