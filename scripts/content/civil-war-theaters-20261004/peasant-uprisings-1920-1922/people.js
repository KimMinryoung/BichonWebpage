// Person cards for the peasant-uprisings-1920-1922 event (the Tambov rebellion and
// the peasant uprisings), see lib.js person(). Excerpts are verbatim from the cited
// pages. Bodies with no catalog affiliation (the Tambov insurgent armies, the Union
// of Working Peasantry, Sapozhkov's "Army of Truth") stay unresolved.
// Existing card alexander-antonov is the Tambov leader himself; no new card for him.
const { W, person } = require('../lib');

const E = t => W(encodeURI(t));
const RU = t => 'https://ru.wikipedia.org/wiki/' + encodeURI(t);
const S = {
    tokm: RU('Токмаков,_Пётр_Михайлович'),
    tambEn: E('Tambov_Rebellion'),
    tambRu: RU('Тамбовское_восстание'),
    sapp: RU('Сапожков,_Александр_Васильевич'),
    sapRising: RU('Восстание_Сапожкова'),
    kakEn: E('Nikolai_Kakurin'),
    kakRu: RU('Какурин,_Николай_Евгеньевич'),
};

const unaffiliated = card => ({
    ...card,
    activities: card.activities.map(a => (a.affiliationId ? a : { ...a, affiliationStatus: 'unresolved', relation: 'unresolved' })),
});

module.exports = [
    unaffiliated(person({
        id: 'pyotr-tokmakov', groupId: 'bolshevik',
        given: ['표트르', 'Pyotr'], family: ['토크마코프', 'Tokmakov'], nativeName: 'Пётр Токмаков', years: '?–1921',
        citizenship: { code: 'russia', label: { ko: '러시아 제국 → 소비에트 러시아', en: 'Russian Empire → Soviet Russia' } },
        origin: { code: 'russia', label: { ko: '러시아인', en: 'Russian' } },
        epithet: ['탐보프 연합 파르티잔 군 사령관이자 근로농민동맹 의장을 지낸 농민 출신 장교',
            'Peasant-born officer who commanded the United Partisan Army of Tambov and chaired the Union of Working Peasantry'],
        bio: ['탐보프주 키르사노프군 이노콥카 마을에서 태어나 1904년 러일전쟁 때 징집되었고, 상트페테르부르크에서 장기 복무했다. 제1차 세계대전에는 갈리치아에서 싸워 성 게오르기 십자훈장과 메달을 네 등급 모두 받았고, 1915년 장교로 임관해 1917년 중위에 올랐다. 브레스트 강화 뒤 고향에서 민경대원으로 일하다 1918년 유격대를 꾸렸다. 1920년 6월 제2봉기군 사령관, 11월 탐보프 연합 파르티잔 군 사령관이 되었고 근로농민동맹 의장도 겸했다. 러시아어 출처는 그가 1921년 2월 28일 보고슬롭카 마을 근처 교전에서 전사했다고 쓰지만, 영어 출처는 그의 죽음을 6월 무렵으로 적는다.',
            'Born in the village of Inokovka in Kirsanov district, Tambov province, he was conscripted in 1904 during the Russo-Japanese War and stayed on for extended service in St Petersburg. In the First World War he fought in Galicia, winning the full set of four St George Crosses and four St George Medals; he was commissioned in 1915 and made lieutenant in 1917. After the Treaty of Brest-Litovsk he returned home, worked in the local militia and in 1918 formed a partisan detachment. In June 1920 he took command of the 2nd Insurgent Army and in November of the United Partisan Army of the Tambov region, while also chairing the Union of Working Peasantry. The Russian-language source says he was killed in a clash near the village of Bogoslovka on 28 February 1921; the English-language source places his death around June 1921.'],
        fate: ['killed', '전사', 'Killed in action'],
        aliases: { ko: [], en: ['Peter Tokmakov', 'Petr Tokmakov'] },
        sources: [S.tokm, S.tambRu, S.tambEn],
        facts: {
            years: [
                { claim: 'birth year unknown; died 28 February 1921', locator: 'lead', excerpt: '(?—28 февраля 1921)' },
                { claim: 'English-language account: killed around June 1921, after Boguslavsky', source: S.tambEn, locator: 'Suppression', excerpt: 'Two weeks later rebel commander Aleksandr Boguslavski was killed in combat. The same fate befell Tokmakov, Karas and Selianski.' },
            ],
            citizenship: { claim: 'subject of the Russian Empire, officer of the Russian imperial army, leader of the Tambov uprising', locator: 'lead', excerpt: 'офицер военного времени Русской императорской армии (поручик), руководитель Тамбовского восстания 1920—1921 гг.' },
            nationalOrigin: { claim: 'born in a village of Tambov province, Russian Empire', locator: 'Биография', excerpt: 'Родился в селе Иноковка Тамбовской губернии Кирсановского уезда Российской империи.' },
            bio: [
                { claim: 'conscripted 1904, extended service in St Petersburg', locator: 'Биография', excerpt: 'В 1904 году, во время Русско-японской войны, был призван на службу в армию. Остался на сверхсрочную службу, которую проходил в Санкт-Петербурге' },
                { claim: 'fought in Galicia, full set of St George crosses and medals', locator: 'Биография', excerpt: 'Во ходе Первой мировой войны воевал в Галиции. За отвагу был награждён полным бантом георгиевского кавалера, четырьмя крестами и четырьмя Георгиевскими медалями.' },
                { claim: 'commissioned 1915', locator: 'Биография', excerpt: 'В 1915 году Токмаков был произведён в чин прапорщика (стал офицером).' },
                { claim: 'lieutenant 1917', locator: 'Биография', excerpt: 'В 1917 году дослужился до чина поручика.' },
                { claim: 'returned home after Brest-Litovsk, militia', locator: 'Биография', excerpt: 'После Брест-Литовского мира с Германией, Токмаков возвращается на свою родину, в Тамбовскую губернию. в родное село Иноковку, где устраивается работать милиционером.' },
                { claim: 'formed a partisan detachment in 1918', locator: 'Биография', excerpt: 'В 1918 году он организует партизанский отряд, покинув службу у большевиков.' },
                { claim: 'commander of the 2nd Insurgent Army, then of the United Partisan Army', locator: 'Биография', excerpt: 'В июне 1920 года П. М. Токмаков становится командующим 2-й повстанческой армией восставших, а затем в ноябре принимает командование Объединённой партизанской армией Тамбовской губернии' },
                { claim: 'chairman of the Union of Working Peasantry', locator: 'Биография', excerpt: 'Токмаков был также председателем Союза трудового крестьянства (СТК) и являлся, таким образом, главой тамбовских повстанцев как по военной, так и по политической линии.' },
                { claim: 'killed 28 February 1921 near Bogoslovka', locator: 'Биография', excerpt: '28 февраля 1921 года при боестолкновении (по сути обстреле колонны восставших) у села Богословка, от фактически шальной пули.' },
            ],
        },
        activities: [
            { functionId: 'military', affiliationId: null, startYear: 1918, endYear: 1921, primary: true, claim: 'Commander of the 2nd Insurgent Army and of the United Partisan Army of Tambov, no catalog affiliation', locator: 'Биография', excerpt: 'В июне 1920 года П. М. Токмаков становится командующим 2-й повстанческой армией восставших, а затем в ноябре принимает командование Объединённой партизанской армией Тамбовской губернии' },
            { functionId: 'political-leadership', affiliationId: null, startYear: 1920, endYear: 1921, claim: 'Chairman of the Union of Working Peasantry, no catalog affiliation', locator: 'Биография', excerpt: 'Токмаков был также председателем Союза трудового крестьянства (СТК)' },
            { functionId: 'military', affiliationId: 'russian-empire', startYear: 1904, endYear: 1917, claim: 'Served in the Russian imperial army from 1904, lieutenant by 1917', locator: 'Биография', excerpt: 'В 1904 году, во время Русско-японской войны, был призван на службу в армию.' },
            { functionId: 'political-leadership', affiliationId: 'russian-sr', relation: 'membership', startYear: null, endYear: 1921, claim: 'Described as an SR among the leaders of the Tambov force', source: S.tambEn, locator: 'Background', excerpt: 'The other leaders of this force were Alexander Antonov\'s younger brother, Dmitri Antonov, and the SR Peter Tokmakov.' },
        ],
        career: [
            ['1904', '러일전쟁 때 징집, 장기 복무', 'Conscripted during the Russo-Japanese War; extended service'],
            ['1915', '장교 임관', 'Commissioned as an officer'],
            ['1917', '중위', 'Lieutenant'],
            ['1918', '고향 이노콥카에서 유격대 조직', 'Formed a partisan detachment at Inokovka'],
            ['1920', '6월 제2봉기군 사령관, 11월 탐보프 연합 파르티잔 군 사령관·근로농민동맹 의장', 'Commander of the 2nd Insurgent Army (June); commander of the United Partisan Army of Tambov and chairman of the Union of Working Peasantry (November)'],
        ],
    })),
    unaffiliated(person({
        id: 'alexander-sapozhkov', groupId: 'bolshevik',
        given: ['알렉산드르', 'Alexander'], family: ['사포시코프', 'Sapozhkov'], nativeName: 'Александр Сапожков', years: '?–1920',
        citizenship: { code: 'russia', label: { ko: '러시아 제국 → 소비에트 러시아', en: 'Russian Empire → Soviet Russia' } },
        origin: { code: 'russia', label: { ko: '러시아인', en: 'Russian' } },
        epithet: ['1920년 징발에 맞서 「진리의 붉은 군대」를 일으킨 붉은 군대 사단장',
            'Red Army division commander who raised the "Red Army of Truth" against grain requisitioning in 1920'],
        bio: ['사마라주 노보우젠스크군의 농민 집안 출신으로, 제1차 세계대전에 참전해 1917년 소위로 노보우젠스크에 돌아와 군 소비에트 초대 의장이 되었다. 좌파 사회혁명당원이었으나 체코슬로바키아 군단 봉기 뒤 공산당에 들지 않은 채 공산주의자를 자처했다. 붉은 군대 제22사단장으로 1919년 우랄스크에서 80일 동안 포위를 버텼지만, 「서툰 지휘와 부대를 해치는 정치」를 이유로 전선에서 물러났다. 1920년 제9기병사단을 편성하다 해임되자 7월 14일 사단을 「제1 진리의 붉은 군대」로 바꾸어 봉기했고, 9월 6일 코임 아울 근처에서 추격대에 사살되었다.',
            'From a peasant family of Novouzensk district, Samara province, he fought in the First World War and returned to Novouzensk in 1917 as a second lieutenant, becoming the first chairman of the district soviet. A Left Socialist Revolutionary, after the revolt of the Czechoslovak Legion he called himself a communist without joining the party. As commander of the Red Army\'s 22nd Division he held Uralsk through an 80-day siege in 1919, but was removed from the front "for inept command and a corrupting policy". In 1920, while forming the 9th Cavalry Division, he learned of his dismissal and on 14 July renamed the division the "1st Red Army of Truth" and rose in revolt. He was killed by a pursuing detachment near the aul of Koim on 6 September 1920.'],
        fate: ['killed', '추격대에 사살', 'Killed by pursuing troops'],
        aliases: { ko: ['알렉산드르 사포즈코프'], en: ['Aleksandr Sapozhkov'] },
        sources: [S.sapp, S.sapRising],
        facts: {
            years: { claim: 'birth year unknown; died 6 September 1920', locator: 'lead', excerpt: '(? — 6 сентября 1920)' },
            citizenship: { claim: 'Russian Empire veteran, Red Army commander in Soviet Russia', locator: 'Биография', excerpt: 'Участвовал в Первой мировой войне, в 1917 в чине подпоручика вернулся в Новоузенск.' },
            nationalOrigin: { claim: 'from the peasantry of Novouzensk district, Samara province', source: S.sapRising, locator: 'Александр Сапожков', excerpt: 'Александр Сапожков происходил из крестьян Новоузенского уезда Самарской губернии.' },
            bio: [
                { claim: 'peasant family; WWI; second lieutenant back in Novouzensk 1917', locator: 'Биография', excerpt: 'Родился в крестьянской семье. Участвовал в Первой мировой войне, в 1917 в чине подпоручика вернулся в Новоузенск.' },
                { claim: 'first chairman of the Novouzensk district soviet', locator: 'Биография', excerpt: 'Стал первым председателем Новоузенского уездного совета' },
                { claim: 'Left SR who called himself a communist without joining', locator: 'Биография', excerpt: 'Был левым эсером, но после восстания Чехословацкого легиона стал называть себя коммунистом, однако не вступая в РКП(б).' },
                { claim: 'headed the 22nd Division', locator: 'Биография', excerpt: 'А. В. Сапожков возглавил дивизию.' },
                { claim: '80-day siege of Uralsk', locator: 'Биография', excerpt: 'Осада длилась 80 дней' },
                { claim: 'removed from the front', locator: 'Биография', excerpt: '«за неумелое командование и за разлагающую политику… был убран с фронта и послан в тыл для формирование частей из собранных дезертиров»' },
                { claim: 'charged with forming the 9th Cavalry Division', locator: 'Биография', excerpt: 'Однако именно ему было поручено формирование в Бузулукском уезде Самарской губернии 9-й кавалерийской дивизии' },
                { claim: 'Order No. 1 renaming the division, 14 July 1920', locator: 'Биография', excerpt: '14 июля на дивизионном митинге в селе Погромное в 25 верстах от Бузулука А. В. Сапожков зачитал приказ № 1 о переименовании 9-й кавалерийской дивизии в 1-ю Красную армию «Правды».' },
                { claim: 'learned of his dismissal on 9 July', locator: 'Биография', excerpt: '9 июля А. В. Сапожков на встрече с близкими ему командирами сообщил о своей отставке и предложил «выразить протест вооружённой силой».' },
                { claim: 'decisive fight near the aul of Koim, 6 September 1920', locator: 'Биография', excerpt: '6 сентября 1920 состоялся решающий бой, когда отряд красноармейцев Тимашёва в количестве 70 человек настиг остатки восставших в районе аула Койм.' },
                { claim: 'killed at point-blank range', locator: 'Биография', excerpt: 'Шевцов, видя, что живым взять Сапожкова не удастся, убил его, выстрелив в упор.' },
            ],
        },
        activities: [
            { functionId: 'military', affiliationId: 'state-soviet', startYear: 1918, endYear: 1920, primary: true, claim: 'Red Guard brigade commander, then commander of the 22nd Division of the Red Army', locator: 'Биография', excerpt: 'Красногвардейские бригады А. В. Сапожкова и Чапаева, собиравшего отряды в соседнем Николаевском уезде, вошли в созданную июне 1918 4-ю армию Восточного фронта.' },
            { functionId: 'military', affiliationId: null, startYear: 1920, endYear: 1920, claim: 'Leader of the "1st Red Army of Truth" revolt, no catalog affiliation', locator: 'Биография', excerpt: 'А. В. Сапожков зачитал приказ № 1 о переименовании 9-й кавалерийской дивизии в 1-ю Красную армию «Правды».' },
            { functionId: 'government', affiliationId: 'state-soviet', startYear: 1917, endYear: 1918, claim: 'First chairman of the Novouzensk district soviet', locator: 'Биография', excerpt: 'Стал первым председателем Новоузенского уездного совета, участник установления советской власти в уезде.' },
            { functionId: 'political-leadership', affiliationId: 'russian-left-sr', relation: 'membership', startYear: 1917, endYear: 1918, claim: 'Member of the Left SRs until the Czechoslovak revolt', locator: 'Биография', excerpt: 'Был левым эсером' },
            { functionId: 'military', affiliationId: 'russian-empire', startYear: null, endYear: 1917, claim: 'Served in the First World War, second lieutenant by 1917', locator: 'Биография', excerpt: 'Участвовал в Первой мировой войне, в 1917 в чине подпоручика вернулся в Новоузенск.' },
        ],
        career: [
            ['1917', '노보우젠스크군 소비에트 초대 의장', 'First chairman of the Novouzensk district soviet'],
            ['1918', '사마라주 혁명위원회 위원, 적위대 조직', 'Member of the Samara provincial revolutionary committee; organised Red Guard units'],
            ['1919', '붉은 군대 제22사단장, 우랄스크 80일 방어', 'Commander of the Red Army 22nd Division; 80-day defence of Uralsk'],
            ['1920', '제9기병사단 편성, 7월 「제1 진리의 붉은 군대」 봉기', 'Formed the 9th Cavalry Division; in July led the "1st Red Army of Truth" revolt'],
        ],
    })),
    person({
        id: 'nikolai-kakurin', groupId: 'bolshevik',
        given: ['니콜라이', 'Nikolai'], family: ['카쿠린', 'Kakurin'], nativeName: 'Николай Какурин', years: '1883–1936',
        citizenship: { code: 'soviet', label: { ko: '러시아 제국 → 소련', en: 'Russian Empire → Soviet Union' } },
        origin: { code: 'russia', label: { ko: '러시아인', en: 'Russian' } },
        epithet: ['탐보프 진압군 참모장을 지내고 내전사를 쓴 붉은 군대 지휘관·군사사가',
            'Red Army commander who was chief of staff of the Tambov suppression and became a historian of the Civil War'],
        bio: ['1883년 오룔의 세습 귀족 장교 집안에서 태어나 니콜라이 군사아카데미를 마치고 참모본부 장교가 되었고, 제1차 세계대전에서 사단 참모장 직무를 맡았다. 1918년 우크라이나 인민공화국 군에, 1919년 갈리치아군에 복무했다. 1920년 붉은 군대에 들어가 폴란드-소비에트 전쟁에서 제10사단과 제3군을 지휘했고, 1921년 투하쳅스키 아래 탐보프 진압군 참모장으로서 독가스 사용을 명한 명령 제0116호에 서명했다. 같은 해 공산당에 입당했다. 1923년 붉은 군대 참모부 내전사 부장이 되어 세 권짜리 내전사를 썼다. 1930년 체포되어 1936년 야로슬라블 감옥에서 숨졌다.',
            'Born in Oryol in 1883 into a hereditary noble family of army officers, he graduated from the Nicholas General Staff Academy and in the First World War served as acting chief of staff of a division. In 1918 he joined the army of the Ukrainian People\'s Republic and in 1919 the Ukrainian Galician Army. Joining the Red Army in 1920, he commanded the 10th Division and the 3rd Army in the Polish–Soviet War; in 1921, as chief of staff of the Tambov forces under Mikhail Tukhachevsky, he co-signed Order No. 0116 on the use of poison gas against the insurgents. He joined the Communist Party the same year. In 1923 he became head of the Civil War history department at the Red Army Staff and was one of the authors of a three-volume history of the Civil War. Arrested in 1930, he died in Yaroslavl prison in 1936.'],
        fate: ['natural', '옥사', 'Died in prison'],
        aliases: { ko: [], en: ['Nikolay Kakurin', 'N. E. Kakurin'] },
        sources: [S.kakRu, S.kakEn, S.tambRu],
        facts: {
            years: { claim: '1883–1936', locator: 'lead', excerpt: '(4 [16] сентября 1883 — 29 июля 1936)' },
            citizenship: { claim: 'Russian officer and Soviet military commander', locator: 'lead', excerpt: 'русский офицер Генерального штаба, советский военачальник, военный теоретик, публицист, историк и педагог.' },
            nationalOrigin: { claim: 'hereditary nobility of Oryol province, born in Oryol', locator: 'Биография', excerpt: 'Из потомственных дворян Орловской губернии.' },
            bio: [
                { claim: 'born in Oryol into an officer\'s family', locator: 'Биография', excerpt: 'Родился 4 (16) сентября 1883 года в Орле в многодетной семье офицера' },
                { claim: 'graduated from the Nicholas Academy, General Staff', source: S.kakEn, locator: 'Biography', excerpt: 'In 1910, he graduated from the Imperial Nicholas Military Academy as first of his class' },
                { claim: 'acting chief of staff of the 71st Infantry Division', locator: 'Первая мировая война', excerpt: '09.10.1915 назначен исправляющим должность начальника штаба 71-й пехотной дивизии' },
                { claim: 'joined the UNR army in 1918', source: S.kakEn, locator: 'Biography', excerpt: 'On 8 March, he joined the army of the Ukrainian People\'s Republic and became assistant to the chief of the General Staff of the Ukrainian People\'s Army.' },
                { claim: 'Ukrainian Galician Army from April 1919', locator: 'Гражданская война', excerpt: 'С апреля 1919 года Какурин служил в украинской Галицкой армии' },
                { claim: 'Red Army: 10th Division, march on Warsaw', source: S.kakEn, locator: 'Biography', excerpt: 'on 1 August 1920 commander of the 10th Infantry Division, with which he took part in the War with Poland, in the Red Army\'s march on Warsaw and the subsequent battles.' },
                { claim: 'commander of the 3rd Army', source: S.kakEn, locator: 'Biography', excerpt: 'from 24 October to 21 December 1920, the commander of the 3rd Army' },
                { claim: 'chief of staff of the Tambov group; signed Order No. 0116', locator: 'Гражданская война', excerpt: 'как начальник штаба подписал известный приказ № 0116 от 12 июня 1921 года о применении отравляющих веществ против скрывавшихся в лесу повстанцев.' },
                { claim: 'Order No. 0116 signed by Tukhachevsky and chief of staff Kakurin', source: S.tambRu, locator: 'Разгром восстания', excerpt: 'Начальник штаба войск Генштаба Какурин' },
                { claim: 'joined the RCP(b) in 1921', locator: 'Гражданская война', excerpt: 'в 1921 году вступил в РКП(б) одним из первых кадровых русских офицеров.' },
                { claim: 'head of the Civil War history department from 1923', source: S.kakEn, locator: 'Biography', excerpt: 'In 1923 he became the head of the Department of the History of the Civil War at the Red Army Headquarters' },
                { claim: 'author of the three-volume history of the Civil War', locator: 'Научно-преподавательская деятельность в РККА', excerpt: 'Один из инициаторов создания и автор трёхтомной истории Гражданской войны (издана в 1928—1930 годах).' },
                { claim: 'arrested 1930, sentenced 1932', source: S.kakEn, locator: 'Biography', excerpt: 'On 19 August 1930, he was arrested, and on 19 February 1932, sentenced to 10 years in prison. He died in the Yaroslavl Prison in 1936.' },
            ],
        },
        activities: [
            { functionId: 'military', affiliationId: 'state-soviet', startYear: 1920, endYear: 1922, primary: true, claim: 'Red Army division and army commander; chief of staff of the Tambov group of forces', source: S.kakEn, locator: 'Biography', excerpt: 'After Tukhachevsky was appointed commander of the Tambov Group of forces, he became the chief of staff of this group of forces and helped to suppress the Tambov Rebellion.' },
            { functionId: 'scholarship', affiliationId: 'state-soviet', startYear: 1923, endYear: 1930, claim: 'Head of the Civil War history department of the Red Army Staff; military historian and theorist', source: S.kakEn, locator: 'Biography', excerpt: 'In 1923 he became the head of the Department of the History of the Civil War at the Red Army Headquarters, and in 1925-1930 he worked again at the Military Academy named after Frunze.' },
            { functionId: 'military', affiliationId: 'ukraine-peoples-republic', startYear: 1918, endYear: 1919, claim: 'Assistant to the chief of the General Staff of the Ukrainian People\'s Army', source: S.kakEn, locator: 'Biography', excerpt: 'On 8 March, he joined the army of the Ukrainian People\'s Republic and became assistant to the chief of the General Staff of the Ukrainian People\'s Army.' },
            { functionId: 'military', affiliationId: 'russian-empire', startYear: 1902, endYear: 1917, claim: 'General Staff officer of the Russian imperial army', locator: 'Служба в Русской императорской армии', excerpt: 'В военную службу вступил 31.08.1902 в Санкт-Петербурге' },
            { functionId: 'political-leadership', affiliationId: 'soviet-party', relation: 'membership', startYear: 1921, endYear: null, claim: 'Joined the RCP(b) in 1921', locator: 'Гражданская война', excerpt: 'в 1921 году вступил в РКП(б) одним из первых кадровых русских офицеров.' },
        ],
        career: [
            ['1910', '니콜라이 군사아카데미 졸업, 참모본부 장교', 'Graduated from the Nicholas General Staff Academy'],
            ['1915', '제71보병사단 참모장 직무대리', 'Acting chief of staff of the 71st Infantry Division'],
            ['1918', '우크라이나 인민군 참모총장 보좌', 'Assistant to the chief of the General Staff of the Ukrainian People\'s Army'],
            ['1919', '갈리치아군 제4군단 참모장', 'Chief of staff of the 4th Corps of the Ukrainian Galician Army'],
            ['1920', '붉은 군대 제10사단장, 제3군 사령관', 'Commander of the Red Army 10th Division and the 3rd Army'],
            ['1921', '탐보프 진압군 참모장', 'Chief of staff of the Tambov group of forces'],
            ['1922', '부하라·페르가나 지역 소비에트군 사령관', 'Commander of Soviet troops in the Bukhara–Fergana region'],
            ['1923', '붉은 군대 참모부 내전사 부장', 'Head of the Civil War history department at the Red Army Staff'],
            ['1925–1930', '프룬제 군사아카데미 교관', 'Lecturer at the Frunze Military Academy'],
        ],
    }),
];
