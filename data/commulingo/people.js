// CommuLingo — people index for the two decision-history books
// (history-russian-revolution, history-soviet-union).
//
// Consumed by routes/commulingo.js:
//   - GET /commulingo/people renders the browsable people page (SSR).
//   - The decision book route embeds {id, name, epithet, aliases[lang]} so
//     public/js/commulingo-decision.js can auto-link person names in the text.
//
// Card design: Cyrillic monogram medallion + one-line epithet + short
// story-style bio + a FATE CHIP (executed/assassinated/murdered/killed/
// deposed/exile/natural). The fate chips are the page's visual thesis:
// how rare "natural" is in this list is itself the lesson of both books.
//
// aliases.ko/en are the exact strings that appear in book text. The client
// linkifier blocks known compounds (레닌그라드, 스탈린그라드, …) — see
// commulingo-decision.js BLOCKED list before adding an alias that is a
// prefix of a place name.

function t(ko, en) {
    return { ko, en };
}

function fate(kind, labelKo, labelEn) {
    return { kind, label: t(labelKo, labelEn) };
}

// One career-timeline row: y = period string, r = localized role/event.
function c(y, roleKo, roleEn) {
    return { y, r: t(roleKo, roleEn) };
}

module.exports = {
    groups: [
        {
            id: 'old-regime',
            range: '1905–1917',
            title: t('구체제와 그 도전자들', 'The old regime and its challengers'),
            blurb: t('차르의 세계에서 살았고, 그 세계와 함께 무너진 사람들.', 'They lived in the Tsar’s world, and fell with it.'),
        },
        {
            id: 'bolshevik',
            range: '1917–1940',
            title: t('혁명 세대', 'The revolutionary generation'),
            blurb: t('10월을 만들었고, 대부분 10월의 이름으로 죽었다.', 'They made October — and most of them died in its name.'),
        },
        {
            id: 'stalin-era',
            range: '1929–1953',
            title: t('스탈린 시대의 사람들', 'People of the Stalin era'),
            blurb: t('전쟁과 공포의 시대를 집행하고, 견디고, 살아 낸 사람들.', 'They enforced, endured and survived the age of war and terror.'),
        },
        {
            id: 'thaw',
            range: '1953–1985',
            title: t('해빙과 정체의 사람들', 'People of the thaw and the stagnation'),
            blurb: t('관 뚜껑을 연 세대, 그리고 다시 덮은 세대.', 'The generation that opened the coffin lid — and the one that closed it again.'),
        },
        {
            id: 'perestroika',
            range: '1985–1991',
            title: t('마지막 세대', 'The last generation'),
            blurb: t('체제를 고치려던 사람과, 체제를 끝낸 사람.', 'The man who tried to repair the system, and the man who ended it.'),
        },
    ],
    people: [
        // ─── 구체제와 그 도전자들 ───
        {
            id: 'nicholas-ii',
            group: 'old-regime',
            initial: 'Н',
            cyrillic: 'Николай II',
            name: t('니콜라이 2세', 'Nicholas II'),
            years: '1868–1918',
            epithet: t('전제(專制)를 신이 맡긴 의무로 믿은 마지막 차르', 'The last Tsar, who believed autocracy was a duty from God'),
            bio: t(
                '1905년 군중에게 발포한 뒤에도, 1915년 총사령관을 자임해 패전의 책임을 스스로 뒤집어쓴 뒤에도, 그는 물려받은 전제를 한 치도 내줄 수 없는 신탁으로 믿었다. 1917년 2월 쏠 군대가 사라지자 300년 왕조는 일주일 만에 끝났고, 이듬해 7월 예카테린부르크의 지하실에서 가족과 함께 총살되었다.',
                'After the shootings of 1905, and even after taking personal command in 1915 and with it the blame for defeat, he held autocracy to be a trust from God that could not be yielded by an inch. In February 1917, when no army would fire for him, three hundred years of Romanov rule ended in a week; in July 1918 he was shot with his family in a cellar in Yekaterinburg.'
            ),
            fate: fate('executed', '처형 1918', 'Shot, 1918'),
            aliases: { ko: ['니콜라이 2세'], en: ['Nicholas II'] },
            scenes: [
                ['history-russian-revolution', 'bloody-sunday'],
                ['history-russian-revolution', 'october-manifesto'],
                ['history-russian-revolution', 'february-soldier'],
            ],
        },
        {
            id: 'gapon',
            group: 'old-regime',
            initial: 'Г',
            cyrillic: 'Георгий Гапон',
            name: t('게오르기 가폰', 'Georgy Gapon'),
            years: '1870–1906',
            epithet: t('행진을 이끈 신부, 이중 첩자로 끝나다', 'The priest who led the march, and ended a double agent'),
            bio: t(
                '1905년 1월 9일, 성상과 차르의 초상을 든 15만의 청원 행진을 겨울궁전으로 이끌었다. 학살에서 살아남아 「우리에게 더 이상 차르는 없다」는 격문을 쓰고 망명했으나, 경찰과의 오랜 이중 관계가 드러나 이듬해 사회혁명당 전투단에게 빈 별장에서 처형당했다.',
                'On January 9, 1905, he led 150,000 petitioners — icons and portraits of the Tsar in hand — to the Winter Palace. He survived the massacre to write “We no longer have a Tsar,” fled abroad, and when his long double game with the police surfaced, was hanged in an empty dacha by SR combatants the next year.'
            ),
            fate: fate('murdered', '살해 1906', 'Killed, 1906'),
            aliases: { ko: ['가폰'], en: ['Gapon'] },
            scenes: [['history-russian-revolution', 'bloody-sunday']],
        },
        {
            id: 'witte',
            group: 'old-regime',
            initial: 'В',
            cyrillic: 'Сергей Витте',
            name: t('세르게이 비테', 'Sergei Witte'),
            years: '1849–1915',
            epithet: t('차르가 미워한 구원투수', 'The fixer his Tsar could not forgive'),
            bio: t(
                '시베리아 횡단철도와 금본위제를 만든 제국 근대화의 설계자. 1905년 일본과의 강화를 성사시키고, 궁지에 몰린 차르에게서 10월 선언을 받아 낸 것도 그였다. 차르는 위기를 넘기게 해 준 그 공로를 평생 용서하지 않았고, 그는 한직에서 회고록을 쓰다 죽었다.',
                'Architect of the empire’s modernization — the Trans-Siberian railway, the gold standard. In 1905 he negotiated peace with Japan and wrung the October Manifesto out of a cornered Tsar, who never forgave him for saving the throne. He died in the political wilderness, writing his memoirs.'
            ),
            fate: fate('natural', '자연사 1915', 'Died 1915'),
            aliases: { ko: ['비테'], en: ['Witte'] },
            scenes: [['history-russian-revolution', 'october-manifesto']],
        },
        {
            id: 'stolypin',
            group: 'old-regime',
            initial: 'С',
            cyrillic: 'Пётр Столыпин',
            name: t('표트르 스톨리핀', 'Pyotr Stolypin'),
            years: '1862–1911',
            epithet: t('교수대와 개혁을 한 손에 쥔 총리', 'The premier who held the gallows in one hand and reform in the other'),
            bio: t(
                '1905년 혁명을 야전 군법회의로 짓눌렀고 — 교수형 밧줄에 「스톨리핀의 넥타이」라는 이름이 붙었다 — 동시에 공동체 농지를 해체해 부농을 키우는 농업개혁으로 체제의 새 지지 기반을 만들려 했다. 「국가에 20년의 평온을 달라」고 했지만, 1911년 키예프 오페라 극장에서 암살당했다. 그 20년은 주어지지 않았다.',
                'He crushed the 1905 revolution with field courts-martial — the noose was nicknamed “Stolypin’s necktie” — while breaking up the commune to breed prosperous farmers as a new base for the regime. “Give the state twenty years of quiet,” he asked. He was shot at the Kiev opera in 1911, and the twenty years were never given.'
            ),
            fate: fate('assassinated', '암살 1911', 'Assassinated, 1911'),
            aliases: { ko: ['스톨리핀'], en: ['Stolypin'] },
            scenes: [['history-russian-revolution', 'october-manifesto']],
        },
        {
            id: 'kerensky',
            group: 'old-regime',
            initial: 'К',
            cyrillic: 'Александр Керенский',
            name: t('알렉산드르 케렌스키', 'Alexander Kerensky'),
            years: '1881–1970',
            epithet: t('혁명과 반혁명 사이에서 갈려 나간 웅변가', 'The orator ground away between revolution and counter-revolution'),
            bio: t(
                '1917년 임시정부의 얼굴이자 마지막 총리. 8월에는 코르닐로프를 막기 위해 감옥의 볼셰비키까지 무장시켰고, 10월에는 그를 지키러 올 군대가 어디에도 없었다. 여장 탈출설은 소비에트의 날조다 — 그는 반세기를 망명지에서 「무엇이 잘못이었는가」를 강연하며 살다 뉴욕에서 죽었다.',
                'The face of the Provisional Government and its last premier. In August 1917 he armed even the jailed Bolsheviks to stop Kornilov; in October, no army anywhere would come to save him. The story of his escaping in a dress is a Soviet fabrication — he spent half a century in exile lecturing on what had gone wrong, and died in New York.'
            ),
            fate: fate('exile', '망명 · 1970 뉴욕', 'Exile · d. 1970, New York'),
            aliases: { ko: ['케렌스키'], en: ['Kerensky'] },
            scenes: [
                ['history-russian-revolution', 'kornilov'],
                ['history-russian-revolution', 'october'],
            ],
        },
        {
            id: 'kornilov',
            group: 'old-regime',
            initial: 'К',
            cyrillic: 'Лавр Корнилов',
            name: t('라브르 코르닐로프', 'Lavr Kornilov'),
            years: '1870–1918',
            epithet: t('「강한 손」을 자처한 장군', 'The general who offered Russia a “strong hand”'),
            bio: t(
                '카자크 병사의 아들로 태어나 총사령관까지 오른 입지전의 군인. 1917년 8월 소비에트를 부수러 수도로 군단을 보냈으나, 철도 노동자와 선동가들 앞에서 군대는 도착하기도 전에 녹았다. 내전 초기 백군 의용군을 이끌다 1918년 예카테리노다르 공격 중 포탄에 죽었다.',
                'A Cossack soldier’s son risen to commander-in-chief. In August 1917 he sent a cavalry corps against the Soviet — and railwaymen and agitators dissolved it before it arrived. Leading the White Volunteer Army in the early civil war, he was killed by a shell before Yekaterinodar in 1918.'
            ),
            fate: fate('killed', '전사 1918', 'Killed in action, 1918'),
            aliases: { ko: ['코르닐로프'], en: ['Kornilov'] },
            scenes: [['history-russian-revolution', 'kornilov']],
        },

        // ─── 혁명 세대 ───
        {
            id: 'lenin',
            group: 'bolshevik',
            initial: 'Л',
            cyrillic: 'Владимир Ленин',
            name: t('블라디미르 레닌', 'Vladimir Lenin'),
            years: '1870–1924',
            epithet: t('갈림길마다 방향을 바꾼 조타수', 'The helmsman who changed course at every fork'),
            bio: t(
                '1917년 4월에는 모두가 미쳤다던 테제로 당을 뒤집었고, 10월에는 봉기를 밀어붙였으며, 1918년 브레스트에서는 회의실에서 가장 신중한 후퇴파였고, 1921년에는 네프로 다시 후퇴했다. 확신과 유연함의 그 결합은 복제되지 못했다. 1922년부터 뇌졸중이 그를 삼켰고, 마지막 구술은 스탈린을 서기장에서 옮기라는 경고였다 — 경고는 봉인되었다.',
                'In April 1917 he upended his party with theses everyone called mad; in October he forced the insurrection; at Brest in 1918 he was the most cautious retreater in the room; in 1921 he retreated again, into NEP. That fusion of certainty and flexibility was never replicated. From 1922 strokes consumed him, and his last dictation warned the party to move Stalin from the General Secretaryship. The warning was sealed away.'
            ),
            fate: fate('natural', '병사(病死) 1924', 'Died of illness, 1924'),
            aliases: { ko: ['레닌'], en: ['Lenin'] },
            scenes: [
                ['history-russian-revolution', 'duma-boycott'],
                ['history-russian-revolution', 'april-theses'],
                ['history-russian-revolution', 'october'],
                ['history-russian-revolution', 'brest-litovsk'],
                ['history-russian-revolution', 'lenin-testament'],
            ],
        },
        {
            id: 'trotsky',
            group: 'bolshevik',
            initial: 'Т',
            cyrillic: 'Лев Троцкий',
            name: t('레프 트로츠키', 'Leon Trotsky'),
            years: '1879–1940',
            epithet: t('적군(赤軍)을 만든 웅변가, 얼음도끼에 스러지다', 'The orator who built the Red Army, felled by an ice axe'),
            bio: t(
                '1905년 26세에 페테르부르크 소비에트 의장, 1917년 10월 봉기의 연출가, 내전에서는 장갑열차를 타고 다니며 적군을 벼려 낸 전쟁인민위원. 그러나 당 기구의 조용한 싸움에서는 번번이 늦었다. 1929년 국외로 추방되었고, 1940년 멕시코시티의 서재에서 스탈린이 보낸 자객의 얼음도끼에 죽었다.',
                'Chairman of the Petersburg Soviet at 26 in 1905, stage-director of the October rising in 1917, then War Commissar forging the Red Army from an armoured train. But in the quiet war of the party apparatus he was always late. Deported in 1929, he was killed in his study in Mexico City in 1940 by an ice axe in the hand of Stalin’s assassin.'
            ),
            fate: fate('assassinated', '암살 1940 멕시코', 'Assassinated, 1940, Mexico'),
            aliases: { ko: ['트로츠키'], en: ['Trotsky'] },
            scenes: [
                ['history-russian-revolution', 'october-manifesto'],
                ['history-russian-revolution', 'october'],
                ['history-russian-revolution', 'brest-litovsk'],
                ['history-russian-revolution', 'lenin-testament'],
            ],
        },
        {
            id: 'stalin',
            group: 'bolshevik',
            initial: 'С',
            cyrillic: 'Иосиф Сталин',
            name: t('이오시프 스탈린', 'Joseph Stalin'),
            years: '1878–1953',
            epithet: t('「조용한 실무가」로 보였던 사람', 'The man who looked like a quiet administrator'),
            bio: t(
                '1917년에는 조연이었고 1924년에는 위험해 보이지 않는 서기장이었다 — 그 「실무」, 곧 인사권이 권력의 본체임을 라이벌들은 너무 늦게 알았다. 집단화와 공업화, 대숙청과 굴라크, 그리고 전쟁의 승리가 모두 한 장부에 적혀 있다. 1953년 뇌일혈로 쓰러졌을 때, 곁의 누구도 감히 먼저 의사를 부르지 못했다.',
                'A supporting actor in 1917, a harmless-looking General Secretary in 1924 — his rivals understood too late that the “administration,” the power of appointment, was power itself. Collectivization and industrialization, the Terror and the Gulag, and victory in the war are all entered in the same ledger. When a stroke felled him in 1953, no one at his side dared be the first to call a doctor.'
            ),
            fate: fate('natural', '자연사 1953', 'Died 1953'),
            aliases: { ko: ['스탈린'], en: ['Stalin'] },
            scenes: [
                ['history-russian-revolution', 'april-theses'],
                ['history-russian-revolution', 'lenin-testament'],
                ['history-russian-revolution', 'great-break'],
                ['history-soviet-union', 'barbarossa-eve'],
                ['history-soviet-union', 'moscow-panic'],
                ['history-soviet-union', 'marshall-plan'],
            ],
        },
        {
            id: 'zinoviev',
            group: 'bolshevik',
            initial: 'З',
            cyrillic: 'Григорий Зиновьев',
            name: t('그리고리 지노비예프', 'Grigory Zinoviev'),
            years: '1883–1936',
            epithet: t('10월에 반대했고, 스탈린을 변호했고, 스탈린에게 죽었다', 'He opposed October, vouched for Stalin, and was shot by him'),
            bio: t(
                '레닌의 오랜 망명 동지이자 코민테른 의장. 1917년 10월 봉기에 카메네프와 함께 반대표를 던졌고, 1924년에는 트로츠키를 막으려 「스탈린 동지는 우려를 불식했다」며 유언 공개를 막았다. 그 12년 뒤, 첫 모스크바 전시재판에서 「테러 음모」를 자백하고 총살되었다.',
                'Lenin’s long companion of exile and chairman of the Comintern. With Kamenev he voted against the October rising in 1917; in 1924, to block Trotsky, he vouched that “Comrade Stalin has dispelled the fears” and helped seal Lenin’s testament. Twelve years later he confessed to a “terrorist conspiracy” at the first Moscow show trial and was shot.'
            ),
            fate: fate('executed', '처형 1936', 'Shot, 1936'),
            aliases: { ko: ['지노비예프'], en: ['Zinoviev'] },
            scenes: [
                ['history-russian-revolution', 'october'],
                ['history-russian-revolution', 'lenin-testament'],
                ['history-russian-revolution', 'great-terror'],
            ],
        },
        {
            id: 'kamenev',
            group: 'bolshevik',
            initial: 'К',
            cyrillic: 'Лев Каменев',
            name: t('레프 카메네프', 'Lev Kamenev'),
            years: '1883–1936',
            epithet: t('당의 공인된 신중파 — 경고는 그보다 오래 살았다', 'The party’s licensed voice of caution — his warnings outlived him'),
            bio: t(
                '4월 테제에 반대했고, 10월 봉기에 반대했고, 그때마다 표결에서 지고도 당에 남아 일했다. 그의 경고 — 성급한 봉기는 고립과 내전을 부른다 — 는 틀리지 않았지만, 이긴 쪽의 역사에서 그는 「동요분자」로 기록되었다. 1936년 지노비예프와 나란히 법정에 세워져 총살되었다.',
                'He argued against the April Theses, argued against the October rising, lost the votes, and stayed to serve. His warning — that a premature rising meant isolation and civil war — was not wrong; but in the victors’ history he was filed under “waverers.” In 1936 he stood beside Zinoviev in the dock, and was shot.'
            ),
            fate: fate('executed', '처형 1936', 'Shot, 1936'),
            aliases: { ko: ['카메네프'], en: ['Kamenev'] },
            scenes: [
                ['history-russian-revolution', 'april-theses'],
                ['history-russian-revolution', 'october'],
                ['history-russian-revolution', 'lenin-testament'],
            ],
        },
        {
            id: 'bukharin',
            group: 'bolshevik',
            initial: 'Б',
            cyrillic: 'Николай Бухарин',
            name: t('니콜라이 부하린', 'Nikolai Bukharin'),
            years: '1888–1938',
            epithet: t('「당 전체의 총아」, 당의 이름으로 죽다', 'The “favourite of the whole party,” killed in its name'),
            bio: t(
                '레닌이 유언에서 「당 전체의 총아」라 부른 명민한 이론가. 브레스트에서는 혁명전쟁을 외친 최좌파였고, 10년 뒤에는 네프와 농민을 지키려 스탈린의 대전환에 맞선 「우편향」이 되었다. 1938년 재판 끝에 총살되었다. 스탈린에게 남긴 마지막 편지 — 「코바, 왜 나의 죽음이 필요한가?」 — 는 스탈린의 책상에서 발견되었다.',
                'The brilliant theorist Lenin’s testament called “the favourite of the whole party.” At Brest he was the far-left voice for revolutionary war; a decade later, defending NEP and the peasants against Stalin’s Great Break, he became the “Right Deviation.” Shot after the 1938 trial. His last note — “Koba, why do you need me to die?” — was found in Stalin’s desk.'
            ),
            fate: fate('executed', '처형 1938', 'Shot, 1938'),
            aliases: { ko: ['부하린'], en: ['Bukharin'] },
            scenes: [
                ['history-russian-revolution', 'brest-litovsk'],
                ['history-russian-revolution', 'great-break'],
                ['history-russian-revolution', 'great-terror'],
            ],
        },
        {
            id: 'luxemburg',
            group: 'bolshevik',
            initial: 'Р',
            cyrillic: 'Роза Люксембург',
            name: t('로자 룩셈부르크', 'Rosa Luxemburg'),
            years: '1871–1919',
            epithet: t('「자유는 언제나, 다르게 생각하는 사람의 자유다」', '“Freedom is always the freedom of the one who thinks differently”'),
            bio: t(
                '폴란드 태생의 독일 혁명가이자 볼셰비키의 가장 날카로운 동지적 비판자. 감옥에서 러시아 혁명을 옹호하는 바로 그 글에 제헌의회 해산과 언론 통제를 겨눈 경고를 함께 적었다. 1919년 1월 베를린 봉기 진압 때 우익 의용군에게 살해되어 란트베어 운하에 버려졌다.',
                'Polish-born German revolutionary, and the Bolsheviks’ sharpest comradely critic. From prison she wrote the defence of the Russian Revolution that also carried her warning against the dissolved Assembly and the muzzled press. Murdered by right-wing Freikorps troops during the January 1919 Berlin rising, her body thrown into the Landwehr Canal.'
            ),
            fate: fate('murdered', '살해 1919 베를린', 'Murdered, 1919, Berlin'),
            aliases: { ko: ['로자 룩셈부르크', '룩셈부르크'], en: ['Rosa Luxemburg', 'Luxemburg'] },
            scenes: [['history-russian-revolution', 'constituent-assembly']],
        },
        // ─── 스탈린 시대의 사람들 ───
        {
            id: 'molotov',
            group: 'stalin-era',
            initial: 'М',
            cyrillic: 'Вячеслав Молотов',
            name: t('뱌체슬라프 몰로토프', 'Vyacheslav Molotov'),
            years: '1890–1986',
            epithet: t('「돌엉덩이」 — 마지막까지 신념을 바꾸지 않은 사람', '“Stone-arse” — the man who never changed his mind'),
            bio: t(
                '독소불가침조약과 마셜 플랜 거부에 서명한 외무인민위원 — 별명 「돌엉덩이」는 그 지치지 않는 완고함에 레닌이 붙였다고 전한다. 아내가 수용소로 끌려갈 때도 스탈린 곁을 지켰고, 1957년 흐루쇼프 축출에 실패해 몽골 대사로 좌천되었다. 96세로 죽는 날까지 스탈린 시대를 후회하지 않았다.',
                'The Foreign Commissar whose signature sits on the Nazi–Soviet pact and the Marshall Plan refusal — the nickname “stone-arse,” for his tireless obstinacy, is said to go back to Lenin. He stood by Stalin even as his own wife was taken to the camps; in 1957 he tried to oust Khrushchev, failed, and was exiled as ambassador to Mongolia. He died at 96, regretting nothing.'
            ),
            fate: fate('natural', '자연사 1986', 'Died 1986'),
            aliases: { ko: ['몰로토프'], en: ['Molotov'] },
            scenes: [
                ['history-soviet-union', 'barbarossa-eve'],
                ['history-soviet-union', 'marshall-plan'],
                ['history-soviet-union', 'secret-speech'],
            ],
        },
        {
            id: 'beria',
            group: 'stalin-era',
            initial: 'Б',
            cyrillic: 'Лаврентий Берия',
            name: t('라브렌티 베리야', 'Lavrentiy Beria'),
            years: '1899–1953',
            epithet: t('개혁안을 든 비밀경찰 총수', 'The secret-police chief who arrived carrying reforms'),
            bio: t(
                '스탈린의 마지막 비밀경찰 총수이자 원폭 계획의 감독자 — 그리고 스탈린이 죽자 가장 급진적인 개혁안을 쏟아 낸 사람. 동료들이 두려워한 것은 그의 개혁이 아니라 그의 서류함이었다. 1953년 6월 회의장에서 주코프의 손에 체포되어 12월 총살되었다. 소련 최고 권력투쟁의 마지막 처형이다.',
                'Stalin’s last secret-police chief and overseer of the bomb project — and, the moment Stalin died, the man pouring out the most radical reforms. What his colleagues feared was not his reforms but his files. Arrested by Zhukov’s officers in mid-session in June 1953 and shot in December: the last execution in a Soviet succession struggle.'
            ),
            fate: fate('executed', '처형 1953', 'Shot, 1953'),
            aliases: { ko: ['베리야'], en: ['Beria'] },
            scenes: [
                ['history-soviet-union', 'moscow-panic'],
                ['history-soviet-union', 'beria-question'],
            ],
        },
        {
            id: 'kirov',
            group: 'stalin-era',
            initial: 'К',
            cyrillic: 'Сергей Киров',
            name: t('세르게이 키로프', 'Sergei Kirov'),
            years: '1886–1934',
            epithet: t('그의 죽음이 대숙청의 총성이 되었다', 'His death was the starting shot of the Great Terror'),
            bio: t(
                '아제르바이잔 재건을 거쳐 1926년 레닌그라드 당 조직을 맡아 도시의 공업화를 이끈, 연설로 사랑받던 정치국원. 1934년 12월 1일 스몰니 청사 복도에서 해고에 앙심을 품은 전 당원 레오니트 니콜라예프의 총에 죽었다 — 문서고 개방 이후의 연구들은 단독 범행으로 결론짓는 쪽이다. 확실한 것은 그다음이다: 사건 당일 발효된 신속 처형령(「12월 1일법」)과 함께, 그의 죽음은 당 전체를 향한 숙청의 법적 구실이 되었다.',
                'A Politburo member who rebuilt Azerbaijan’s oil industry, then from 1926 ran the Leningrad organization and its industrialization — and was genuinely loved as a speaker. On December 1, 1934, he was shot in the corridor of the Smolny by Leonid Nikolaev, an expelled party member with a grudge; post-archive scholarship largely concludes the assassin acted alone. What is certain is what followed: with the express-execution decree issued that same day, his death became the legal pretext for the purge of the whole party.'
            ),
            fate: fate('assassinated', '암살 1934', 'Assassinated, 1934'),
            aliases: { ko: ['키로프'], en: ['Kirov'] },
            scenes: [
                ['history-russian-revolution', 'great-break'],
                ['history-russian-revolution', 'great-terror'],
            ],
        },
        {
            id: 'zhukov',
            group: 'stalin-era',
            initial: 'Ж',
            cyrillic: 'Георгий Жуков',
            name: t('게오르기 주코프', 'Georgy Zhukov'),
            years: '1896–1974',
            epithet: t('위기마다 불려 나온 소방수, 평화가 오자 치워지다', 'The fireman summoned to every crisis, shelved when peace came'),
            bio: t(
                '모스크바, 스탈린그라드, 레닌그라드, 베를린 — 전쟁의 고비마다 그가 파견되었고, 1945년 베를린의 항복 문서를 받은 것도 그였다. 1953년 베리야 체포조를 이끌었고 1957년 흐루쇼프를 구했다. 너무 큰 명성의 값은 두 번의 실각(1946, 1957)으로 치렀다 — 그래도 회고록을 남기고 침대에서 죽었다.',
                'Moscow, Stalingrad, Leningrad, Berlin — he was sent wherever the war was breaking, and it was he who took Germany’s surrender in 1945. He led Beria’s arrest in 1953 and saved Khrushchev in 1957. The price of so much glory was two disgraces (1946, 1957) — yet he lived to publish his memoirs and die in bed.'
            ),
            fate: fate('natural', '두 번 실각 · 자연사 1974', 'Twice disgraced · d. 1974'),
            aliases: { ko: ['주코프'], en: ['Zhukov'] },
            scenes: [
                ['history-soviet-union', 'barbarossa-eve'],
                ['history-soviet-union', 'moscow-panic'],
                ['history-soviet-union', 'stalingrad-1942'],
                ['history-soviet-union', 'beria-question'],
            ],
        },
        {
            id: 'sorge',
            group: 'stalin-era',
            initial: 'З',
            cyrillic: 'Рихард Зорге',
            name: t('리하르트 조르게', 'Richard Sorge'),
            years: '1895–1944',
            epithet: t('도쿄에서 전쟁의 시간표를 훔친 스파이', 'The spy who stole the war’s timetable in Tokyo'),
            bio: t(
                '도쿄 주재 독일 신문 특파원으로 위장한 소련 정보원. 바르바로사의 날짜를 타전했으나 무시당했고, 「일본은 북진하지 않는다」는 그의 마지막 정보는 시베리아 사단들을 모스크바 방어전으로 불러왔다. 1941년 일본에 체포되어 1944년 처형되었다. 소련은 20년간 그의 존재 자체를 부인하다 1964년에야 영웅 칭호를 추서했다.',
                'A Soviet officer under cover as a German correspondent in Tokyo. His warning of Barbarossa’s date was ignored; his last signal — Japan will not strike north — released the Siberian divisions for the defence of Moscow. Arrested by Japan in 1941 and hanged in 1944. For twenty years the USSR denied he existed, then made him a Hero of the Soviet Union in 1964.'
            ),
            fate: fate('executed', '처형 1944 도쿄', 'Hanged, 1944, Tokyo'),
            aliases: { ko: ['조르게'], en: ['Sorge'] },
            scenes: [
                ['history-soviet-union', 'barbarossa-eve'],
                ['history-soviet-union', 'moscow-panic'],
            ],
        },
        {
            id: 'chuikov',
            group: 'stalin-era',
            initial: 'Ч',
            cyrillic: 'Василий Чуйков',
            name: t('바실리 추이코프', 'Vasily Chuikov'),
            years: '1900–1982',
            epithet: t('「볼가 너머에 우리 땅은 없다」', '“There is no land for us beyond the Volga”'),
            bio: t(
                '스탈린그라드 폐허의 제62군 사령관. 독일군과 수류탄 투척 거리에 지휘소를 두는 「포옹 전술」로 도시를 버텼고, 자신의 군대가 계획의 미끼였다는 사실은 나중에야 알았다. 그 부대는 근위 제8군이 되어 베를린까지 걸어갔다. 유언대로 스탈린그라드의 마마예프 언덕, 자기 병사들 곁에 묻혔다.',
                'Commander of the 62nd Army in the rubble of Stalingrad. He held the city by “hugging” the enemy — keeping his command post within grenade range — and learned only later that his army had been the plan’s bait. That army, renamed the 8th Guards, walked all the way to Berlin. As he willed, he is buried on Mamayev Kurgan at Stalingrad, beside his soldiers.'
            ),
            fate: fate('natural', '자연사 1982', 'Died 1982'),
            aliases: { ko: ['추이코프'], en: ['Chuikov'] },
            scenes: [['history-soviet-union', 'stalingrad-1942']],
        },
        {
            id: 'vasilevsky',
            group: 'stalin-era',
            initial: 'В',
            cyrillic: 'Александр Василевский',
            name: t('알렉산드르 바실렙스키', 'Aleksandr Vasilevsky'),
            years: '1895–1977',
            epithet: t('천왕성 작전을 설계한 신학교 출신 참모', 'The seminarian-turned-staff-officer who designed Uranus'),
            bio: t(
                '사제가 되려던 신학생에서 참모총장까지 간 사람. 주코프와 함께 스탈린그라드의 「다른 해법」 — 천왕성 작전 — 을 설계했고, 전쟁 후반 소련군의 거의 모든 대작전 기획에 그의 서명이 있다. 스탈린에게 이견을 말하고도 살아남는 드문 재주가 있었고, 조용히 은퇴해 조용히 죽었다 — 이 목록에서 흔치 않은 결말이다.',
                'A seminary student who became Chief of the General Staff. With Zhukov he designed Stalingrad’s “other solution,” Operation Uranus, and his signature is on nearly every great Soviet operation of the war’s second half. He had the rare gift of disagreeing with Stalin and surviving it, retired quietly and died quietly — an uncommon ending on this list.'
            ),
            fate: fate('natural', '자연사 1977', 'Died 1977'),
            aliases: { ko: ['바실렙스키'], en: ['Vasilevsky'] },
            scenes: [['history-soviet-union', 'stalingrad-1942']],
        },

        // ─── 해빙과 정체의 사람들 ───
        {
            id: 'khrushchev',
            group: 'thaw',
            initial: 'Х',
            cyrillic: 'Никита Хрущёв',
            name: t('니키타 흐루쇼프', 'Nikita Khrushchev'),
            years: '1894–1971',
            epithet: t('관 뚜껑을 연 사람 — 그리고 침대에서 죽은 첫 지도자', 'He opened the coffin lid — and became the first leader to die in bed'),
            bio: t(
                '스탈린의 궁정에서 광대 역까지 견디며 살아남았고, 1956년 비밀연설로 관 뚜껑을 열었다. 헝가리를 진압했고, 쿠바에서 물러서 세계를 구했으며, 그 후퇴의 값으로 1964년 동료들에게 해임당했다. 실각 후 이렇게 말했다고 전한다 — 「그들이 나를 총살이 아니라 표결로 보낼 수 있었다는 것, 그것이 나의 업적이다.」',
                'He survived Stalin’s court — playing the fool when required — and in 1956 opened the coffin lid with the Secret Speech. He crushed Hungary, backed down over Cuba and saved the world, and paid for the retreat in 1964, when his colleagues voted him out. In retirement he is said to have remarked: that they could remove me by a vote and not a bullet — that is my achievement.'
            ),
            fate: fate('deposed', '실각 1964 · 자연사 1971', 'Deposed 1964 · d. 1971'),
            aliases: { ko: ['흐루쇼프'], en: ['Khrushchev'] },
            scenes: [
                ['history-soviet-union', 'beria-question'],
                ['history-soviet-union', 'secret-speech'],
                ['history-soviet-union', 'hungary-1956'],
                ['history-soviet-union', 'cuba-1962'],
            ],
        },
        {
            id: 'malenkov',
            group: 'thaw',
            initial: 'М',
            cyrillic: 'Георгий Маленков',
            name: t('게오르기 말렌코프', 'Georgy Malenkov'),
            years: '1902–1988',
            epithet: t('패자가 죽지 않게 된 시대의 첫 패자', 'The first loser of the age when losers stopped dying'),
            bio: t(
                '스탈린의 서류를 관리하던 후계 서열 1위. 스탈린 사후 총리가 되어 소비재와 감세를 말한 첫 지도자였지만, 당 기구를 쥔 흐루쇼프에게 밀렸고 1957년 「반당 그룹」으로 몰려 카자흐스탄의 수력발전소 소장으로 좌천되었다. 총살 대신 좌천 — 새 규칙의 첫 수혜자로 30년을 더 살았다.',
                'Keeper of Stalin’s paperwork and first in the line of succession. As premier after Stalin’s death he was the first leader to talk of consumer goods and lower taxes — but Khrushchev held the party machine, and in 1957 the “Anti-Party Group” label sent him to manage a power station in Kazakhstan. Demotion instead of a bullet: first beneficiary of the new rule, he lived another thirty years.'
            ),
            fate: fate('deposed', '실각 1957 · 자연사 1988', 'Deposed 1957 · d. 1988'),
            aliases: { ko: ['말렌코프'], en: ['Malenkov'] },
            scenes: [['history-soviet-union', 'beria-question']],
        },
        {
            id: 'mikoyan',
            group: 'thaw',
            initial: 'М',
            cyrillic: 'Анастас Микоян',
            name: t('아나스타스 미코얀', 'Anastas Mikoyan'),
            years: '1895–1978',
            epithet: t('소련의 식탁을 만든 사람 — 그리고 「일리치에서 일리치까지」의 협상가', 'The man who built the Soviet table — and the negotiator “from Ilyich to Ilyich”'),
            bio: t(
                '반세기 동안 소련의 먹고 사는 일을 관장한 실무의 거장. 식품공업인민위원으로서 1936년 두 달간 미국의 공장들을 시찰하고 돌아와 통조림·소시지·냉동식품 산업과 대량생산 아이스크림을 이식했고 — 「미코얀 커틀릿」이라는 이름이 붙은 것도 있다 — 이후 수십 년간 대외무역과 소비재 공급을 맡았다. 정치에서는 1956년 헝가리 무력 개입에 거의 홀로 반대했고, 쿠바 위기 뒷수습으로 아바나에서 카스트로를 3주간 설득했다. 「일리치(레닌)에서 일리치(브레즈네프)까지」 최고 지도부를 통과하고 은퇴를 「허락받은」 드문 거물.',
                'For half a century the master craftsman of how the USSR ate and traded. As Commissar of the Food Industry he spent two months touring American plants in 1936 and came home to transplant canning, sausage-making, frozen food and mass-produced ice cream — a cutlet still bears his name — then ran foreign trade and consumer supply for decades. In politics he stood almost alone against the second intervention in Hungary in 1956, and spent three weeks in Havana talking Castro through the aftermath of the missile crisis. He passed through the top leadership “from Ilyich to Ilyich” — Lenin to Brezhnev — and was one of the few grandees permitted to retire.'
            ),
            fate: fate('natural', '자연사 1978', 'Died 1978'),
            aliases: { ko: ['미코얀'], en: ['Mikoyan'] },
            scenes: [['history-soviet-union', 'hungary-1956']],
        },
        {
            id: 'nagy',
            group: 'thaw',
            initial: 'N',
            cyrillic: 'Nagy Imre',
            name: t('너지 임레', 'Imre Nagy'),
            years: '1896–1958',
            epithet: t('13일의 총리', 'Premier for thirteen days'),
            bio: t(
                '모스크바 망명을 거친 개혁 공산주의자 — 1956년 봉기가 그를 총리로 불러냈고, 그는 대중을 따라 다당제와 바르샤바조약 탈퇴 선언까지 갔다. 유고슬라비아 대사관에서 안전 통행을 약속받고 나오다 납치되었고, 1958년 비밀 재판 뒤 교수형당했다. 1989년 부다페스트 영웅광장의 재매장에 20만이 모였다 — 그의 복권이자, 체제의 부고였다.',
                'A reform communist seasoned by Moscow exile — the 1956 rising called him to the premiership, and he followed the people all the way to multi-party rule and withdrawal from the Warsaw Pact. Leaving the Yugoslav embassy under a promise of safe conduct, he was abducted; after a secret trial he was hanged in 1958. In 1989 two hundred thousand attended his reburial on Heroes’ Square — his rehabilitation, and the system’s obituary.'
            ),
            fate: fate('executed', '처형 1958', 'Hanged, 1958'),
            aliases: { ko: ['너지 임레', '너지'], en: ['Imre Nagy', 'Nagy'] },
            scenes: [['history-soviet-union', 'hungary-1956']],
        },
        {
            id: 'brezhnev',
            group: 'thaw',
            initial: 'Б',
            cyrillic: 'Леонид Брежнев',
            name: t('레오니트 브레즈네프', 'Leonid Brezhnev'),
            years: '1906–1982',
            epithet: t('흔들지 않는 것을 통치로 삼은 사람', 'The man whose statecraft was not rocking the boat'),
            bio: t(
                '흐루쇼프를 밀어낸 「안정」의 얼굴. 프라하와 아프가니스탄에 군대를 보냈고, 국내에서는 아무것도 흔들지 않았다 — 간부들은 종신이 되었고, 문제들은 이월되었다. 말년의 훈장 수집벽과 노쇠는 농담의 소재가 되었지만, 그 18년의 청구서는 후임들에게 넘어갔다. 그의 장례식은 정체(застой) 그 자체의 장례식으로 기억된다.',
                'The face of the “stability” that removed Khrushchev. He sent armies to Prague and Afghanistan and rocked nothing at home — officials served for life, and the problems rolled over. His late-life medal collecting and frailty fed a thousand jokes, but the bill for those eighteen years was passed to his successors. His funeral is remembered as the funeral of the stagnation itself.'
            ),
            fate: fate('natural', '자연사 1982', 'Died 1982'),
            aliases: { ko: ['브레즈네프'], en: ['Brezhnev'] },
            scenes: [
                ['history-soviet-union', 'prague-1968'],
                ['history-soviet-union', 'afghanistan-1979'],
            ],
        },
        {
            id: 'kosygin',
            group: 'thaw',
            initial: 'К',
            cyrillic: 'Алексей Косыгин',
            name: t('알렉세이 코시긴', 'Alexei Kosygin'),
            years: '1904–1980',
            epithet: t('계획에 이윤을 심으려 한 총리', 'The premier who tried to plant profit inside the plan'),
            bio: t(
                '레닌그라드 봉쇄의 「생명의 길」 수송을 지휘했던 테크노크라트. 1965년 총리로서 이윤과 자율을 계획경제에 심으려 했으나, 프라하 이후 자신의 개혁이 소리 없이 회수되는 것을 지켜보았다. 1979년 아프가니스탄 파병에 반대한 몇 안 되는 목소리였고 — 「파병만은 안 된다」 — 실각 두 달 뒤 죽었다.',
                'The technocrat who ran the “Road of Life” supply line into besieged Leningrad. As premier in 1965 he tried to plant profit and autonomy inside the planned economy, then watched his reform being quietly withdrawn after Prague. In 1979 his was one of the few voices against sending troops to Afghanistan — “troops, never” — and he died two months after losing office.'
            ),
            fate: fate('natural', '자연사 1980', 'Died 1980'),
            aliases: { ko: ['코시긴'], en: ['Kosygin'] },
            scenes: [
                ['history-soviet-union', 'kosygin-reform'],
                ['history-soviet-union', 'afghanistan-1979'],
            ],
        },
        {
            id: 'dubcek',
            group: 'thaw',
            initial: 'D',
            cyrillic: 'Alexander Dubček',
            name: t('알렉산드르 두브체크', 'Alexander Dubček'),
            years: '1921–1992',
            epithet: t('인간의 얼굴을 꿈꾸다 산림청으로 보내진 사람', 'He dreamed of a human face, and was posted to the forestry service'),
            bio: t(
                '소련에서 자란 슬로바키아인 — 당이 스스로 뽑은 제1서기로서 검열을 없애고 「인간의 얼굴을 한 사회주의」를 열었다. 침공 후 모스크바로 연행되어 서명을 강요당했고, 서기장에서 대사로, 대사에서 산림청 말단으로 한 계단씩 지워졌다. 1989년 벨벳 혁명의 발코니에 하벨과 나란히 다시 섰고, 3년 뒤 교통사고로 죽었다.',
                'A Slovak raised in the USSR — the First Secretary the party itself elected, who lifted censorship and opened “socialism with a human face.” Abducted to Moscow after the invasion and made to sign, he was then erased a step at a time: from General Secretary to ambassador, from ambassador to a forestry office. In 1989 he stood beside Havel on the balcony of the Velvet Revolution; three years later he died after a car crash.'
            ),
            fate: fate('deposed', '실각 1969 · 사고사 1992', 'Removed 1969 · d. 1992'),
            aliases: { ko: ['두브체크'], en: ['Dubček', 'Dubcek'] },
            scenes: [['history-soviet-union', 'prague-1968']],
        },
        {
            id: 'sakharov',
            group: 'thaw',
            initial: 'С',
            cyrillic: 'Андрей Сахаров',
            name: t('안드레이 사하로프', 'Andrei Sakharov'),
            years: '1921–1989',
            epithet: t('수소폭탄을 만들고, 체제에 등을 돌린 물리학자', 'He built the hydrogen bomb, then turned on the system'),
            bio: t(
                '소련 수소폭탄의 아버지이자 32세의 최연소 정회원 원사(院士) — 그리고 그 모든 특권을 내려놓은 반체제의 양심. 1968년 프라하 진압 즈음 체제와 공개적으로 갈라섰고, 아프가니스탄 침공을 비판하다 1980년 고리키로 유형당했다. 1986년 고르바초프의 전화 한 통으로 돌아와, 인민대의원 자격으로 연단에서 싸우다 죽었다.',
                'Father of the Soviet hydrogen bomb, a full academician at 32 — and the conscience that laid all those privileges down. He broke openly with the system around the crushing of Prague in 1968, and criticism of the Afghan invasion sent him into internal exile in Gorky in 1980. A single telephone call from Gorbachev brought him back in 1986; he died a people’s deputy, still fighting from the rostrum.'
            ),
            fate: fate('exile', '유형 1980 · 복권 1986', 'Internal exile 1980 · returned 1986'),
            aliases: { ko: ['사하로프'], en: ['Sakharov'] },
            scenes: [['history-soviet-union', 'prague-1968']],
        },
        {
            id: 'andropov',
            group: 'thaw',
            initial: 'А',
            cyrillic: 'Юрий Андропов',
            name: t('유리 안드로포프', 'Yuri Andropov'),
            years: '1914–1984',
            epithet: t('KGB에서 개혁가를 길러 낸 역설', 'The paradox: a reformer’s patron inside the KGB'),
            bio: t(
                '1956년 부다페스트 주재 대사로 탱크를 부른 사람, 15년간 KGB 의장으로 반체제를 짓밟은 사람 — 그리고 체제의 실상을 가장 정확히 알았기에 고르바초프를 발탁해 키운 사람. 서기장 15개월의 「규율 캠페인」은 신부전이 먼저 끝냈다. 그의 유산이 탄압인지 개혁의 씨앗인지, 답은 아직 갈린다.',
                'As ambassador in Budapest in 1956 he called in the tanks; for fifteen years as KGB chairman he broke the dissidents — and, knowing better than anyone the true state of the system, he picked out and promoted Gorbachev. His fifteen-month “discipline campaign” as General Secretary was ended first by kidney failure. Whether his legacy is repression or the seed of reform is still an open verdict.'
            ),
            fate: fate('natural', '자연사 1984', 'Died 1984'),
            aliases: { ko: ['안드로포프'], en: ['Andropov'] },
            scenes: [
                ['history-soviet-union', 'afghanistan-1979'],
                ['history-soviet-union', 'gorbachev-1985'],
            ],
        },
        {
            id: 'gromyko',
            group: 'thaw',
            initial: 'Г',
            cyrillic: 'Андрей Громыко',
            name: t('안드레이 그로미코', 'Andrei Gromyko'),
            years: '1909–1989',
            epithet: t('「미스터 니예트」, 마지막 수로 개혁가를 추천하다', '“Mister Nyet,” whose last move was to nominate the reformer'),
            bio: t(
                '28년간 외무장관 — 얄타에서 쿠바 위기, 데탕트까지 모든 협상 탁자에 그가 앉아 있었고, 서방은 그 완강함에 「미스터 니예트」라는 별명을 붙였다. 1985년 3월, 최고참 보수파로서 고르바초프 추천 연설에 나섰다: 「이 사람은 미소가 부드럽지만 이빨은 강철입니다.」 자신이 세운 개혁가가 여는 시대를 지켜보다 죽었다.',
                'Foreign minister for twenty-eight years — from Yalta through the missile crisis to détente, he sat at every table, and the West named his obduracy “Mister Nyet.” In March 1985, doyen of the conservatives, he rose to nominate Gorbachev: “This man has a nice smile, but teeth of iron.” He died watching the era his own protégé had opened.'
            ),
            fate: fate('natural', '자연사 1989', 'Died 1989'),
            aliases: { ko: ['그로미코'], en: ['Gromyko'] },
            scenes: [
                ['history-soviet-union', 'afghanistan-1979'],
                ['history-soviet-union', 'gorbachev-1985'],
            ],
        },

        // ─── 마지막 세대 ───
        {
            id: 'gorbachev',
            group: 'perestroika',
            initial: 'Г',
            cyrillic: 'Михаил Горбачёв',
            name: t('미하일 고르바초프', 'Mikhail Gorbachev'),
            years: '1931–2022',
            epithet: t('체제를 고치려다 체제를 끝낸 사람', 'He set out to repair the system, and ended it'),
            bio: t(
                '체제가 스스로 뽑은 개혁가. 글라스노스트와 페레스트로이카로 체제를 구하려 했고, 1989년 동유럽에서 쏘지 않기로 결정했으며, 1991년 크림 연금에서 돌아와 자신의 자리가 사라지는 문서에 서명했다. 서방의 갈채와 국내의 원망을 동시에 받으며, 자신이 끝낸 나라보다 31년을 더 살았다.',
                'The reformer the system elected for itself. He tried to save it with glasnost and perestroika, decided in 1989 that the tanks would not fire in Eastern Europe, and in 1991 — back from house arrest in Crimea — signed the papers in which his own office ceased to exist. Applauded abroad and resented at home, he outlived the country he ended by thirty-one years.'
            ),
            fate: fate('natural', '자연사 2022', 'Died 2022'),
            aliases: { ko: ['고르바초프'], en: ['Gorbachev'] },
            scenes: [
                ['history-soviet-union', 'gorbachev-1985'],
                ['history-soviet-union', 'chernobyl-1986'],
                ['history-soviet-union', 'autumn-1989'],
                ['history-soviet-union', 'august-1991'],
            ],
        },
        {
            id: 'yeltsin',
            group: 'perestroika',
            initial: 'Е',
            cyrillic: 'Борис Ельцин',
            name: t('보리스 옐친', 'Boris Yeltsin'),
            years: '1931–2007',
            epithet: t('전차 위에 올라간 남자', 'The man who climbed onto the tank'),
            bio: t(
                '고르바초프가 모스크바로 불러올린 지방 서기 — 그리고 그를 밀어낸 사람. 1987년 당 지도부를 정면 비판해 좌천되었다가 선거로 되살아났고, 1991년 8월 백악관 앞 전차 위에 올라선 사진 한 장으로 러시아의 권력이 되었다. 그해 12월 벨라베자 숲에서 소련을 서명으로 끝냈고, 1999년 마지막 연설에서 국민에게 용서를 구하며 물러났다.',
                'The provincial secretary Gorbachev brought to Moscow — and the man who displaced him. Demoted in 1987 for attacking the leadership to its face, he was resurrected by the ballot box, and one photograph — standing on a tank before the White House in August 1991 — made him Russia’s power. That December, in the Belavezha forest, he signed the Soviet Union out of existence; in his last address, in 1999, he asked his people’s forgiveness and stepped down.'
            ),
            fate: fate('natural', '자연사 2007', 'Died 2007'),
            aliases: { ko: ['옐친'], en: ['Yeltsin'] },
            scenes: [
                ['history-soviet-union', 'gorbachev-1985'],
                ['history-soviet-union', 'august-1991'],
            ],
        },

        // ─── 시대별 추가 인물 (책 본문 미등장 인물 포함: scenes는 비워 둔다) ───
        {
            id: 'rasputin',
            group: 'old-regime',
            initial: 'Р',
            cyrillic: 'Григорий Распутин',
            name: t('그리고리 라스푸틴', 'Grigori Rasputin'),
            years: '1869–1916',
            epithet: t('제국의 침실까지 들어온 시베리아의 「성자」', 'The Siberian “holy man” who reached the imperial bedchamber'),
            bio: t(
                '황태자의 혈우병을 「다스리는」 듯 보인 신비가 황후의 절대 신임이 되었고, 1915년 차르가 전선으로 떠나자 장관들의 운명이 그의 응접실에서 갈렸다. 군주정을 구하겠다는 귀족들이 1916년 12월 그를 독살하고 쏘고 강에 던졌다 — 왕조는 그보다 두 달을 더 살았을 뿐이다.',
                'His seeming power over the heir’s haemophilia became the Empress’s absolute faith, and once the Tsar left for the front in 1915, ministers’ fates were decided in his parlour. In December 1916 aristocrats out to save the monarchy poisoned him, shot him and put him through the river ice — the dynasty outlived him by two months.'
            ),
            fate: fate('murdered', '살해 1916', 'Murdered, 1916'),
            aliases: { ko: ['라스푸틴'], en: ['Rasputin'] },
            scenes: [],
        },
        {
            id: 'plekhanov',
            group: 'old-regime',
            initial: 'П',
            cyrillic: 'Георгий Плеханов',
            name: t('게오르기 플레하노프', 'Georgi Plekhanov'),
            years: '1856–1918',
            epithet: t('러시아 마르크스주의의 아버지 — 제자들의 혁명에 반대하다', 'The father of Russian Marxism — against his own pupils’ revolution'),
            bio: t(
                '나로드니키로 출발해 러시아에 마르크스주의를 이식한 사람 — 레닌 세대 전체가 그의 책으로 배웠다. 그러나 1917년 37년 만에 귀국한 그는 10월 봉기를 「역사의 단계를 무시한 시기상조」라 규탄했다. 제자들이 세운 정권 아래에서 결핵으로 죽었고, 장례식은 반(半)야당 시위가 되었다.',
                'He began as a Populist and transplanted Marxism into Russia — Lenin’s whole generation learned from his books. But returning in 1917 after thirty-seven years abroad, he condemned the October rising as premature, a violation of history’s stages. He died of tuberculosis under the regime his pupils had built, and his funeral became a half-opposition demonstration.'
            ),
            fate: fate('natural', '자연사 1918', 'Died 1918'),
            aliases: { ko: ['플레하노프'], en: ['Plekhanov'] },
            scenes: [],
        },
        {
            id: 'martov',
            group: 'old-regime',
            initial: 'М',
            cyrillic: 'Юлий Мартов',
            name: t('율리 마르토프', 'Julius Martov'),
            years: '1873–1923',
            epithet: t('레닌의 가장 오랜 벗이자 가장 원칙적인 적수', 'Lenin’s oldest friend and most principled adversary'),
            bio: t(
                '이스크라를 레닌과 함께 만든 동지였으나, 1903년 당원 자격 조항 하나를 두고 갈라져 멘셰비키의 지도자가 되었다. 10월 이후에도 나라를 떠나지 않고 합법 야당의 자리를 지키려 애썼고, 1920년 출국을 「허락받아」 베를린에서 결핵으로 죽었다. 병상의 레닌이 그의 안부를 물었다는 이야기가 전한다.',
                'He built Iskra alongside Lenin, then split with him in 1903 over a single clause on party membership and led the Mensheviks. After October he stayed, fighting to keep a legal opposition alive, and in 1920 was permitted to leave — he died of tuberculosis in Berlin. It is told that the dying Lenin asked after him.'
            ),
            fate: fate('exile', '망명 · 1923 베를린', 'Exile · d. 1923, Berlin'),
            aliases: { ko: ['마르토프'], en: ['Martov'] },
            scenes: [],
        },
        {
            id: 'dzerzhinsky',
            group: 'bolshevik',
            initial: 'Д',
            cyrillic: 'Феликс Дзержинский',
            name: t('펠릭스 제르진스키', 'Felix Dzerzhinsky'),
            years: '1877–1926',
            epithet: t('「철의 펠릭스」 — 혁명의 칼을 만든 금욕주의자', '“Iron Felix” — the ascetic who forged the revolution’s sword'),
            bio: t(
                '차르의 감옥과 유형지에서 11년을 보낸 폴란드 귀족 가문 출신 혁명가. 1917년 12월 체카를 창설해 적색 테러를 집행했고, 요원들에게 「깨끗한 손, 차가운 머리, 뜨거운 심장」을 요구했다. 1926년 중앙위원회에서 격렬한 연설을 마친 직후 심장마비로 죽었다 — 그가 만든 기관은 이름을 바꿔 가며 그보다 오래 살았다.',
                'Born to Polish gentry, he spent eleven years in Tsarist prisons and exile. In December 1917 he founded the Cheka and administered the Red Terror, demanding of his men “clean hands, a cool head and a burning heart.” He died of a heart attack in 1926, minutes after a furious speech to the Central Committee — the institution he built outlived him under many names.'
            ),
            fate: fate('natural', '자연사 1926', 'Died 1926'),
            aliases: { ko: ['제르진스키'], en: ['Dzerzhinsky'] },
            scenes: [],
        },
        {
            id: 'kollontai',
            group: 'bolshevik',
            initial: 'К',
            cyrillic: 'Александра Коллонтай',
            name: t('알렉산드라 콜론타이', 'Alexandra Kollontai'),
            years: '1872–1952',
            epithet: t('여성 해방을 혁명의 의제로 만든 최초의 여성 각료', 'She made women’s liberation the revolution’s business'),
            bio: t(
                '장군의 딸로 태어나 세계 최초의 여성 정부 각료(복지인민위원)가 되었고, 자유연애론과 가사노동의 사회화 주장으로 당 안에서도 논쟁을 일으켰다. 노동자 반대파에 섰다가 외교관으로 「명예 유배」되었는데 — 노르웨이와 스웨덴의 대사관저가 그녀를 대숙청에서 살렸다. 옛 볼셰비키 가운데 드물게 침대에서 죽었다.',
                'A general’s daughter who became the world’s first woman cabinet minister, as Commissar of Welfare, and scandalized even her own party with free love and the socialization of housework. Siding with the Workers’ Opposition earned her an honourable exile into diplomacy — and the embassies of Norway and Sweden carried her alive through the Terror. One of the few Old Bolsheviks to die in bed.'
            ),
            fate: fate('natural', '자연사 1952', 'Died 1952'),
            aliases: { ko: ['콜론타이'], en: ['Kollontai'] },
            scenes: [],
        },
        {
            id: 'tukhachevsky',
            group: 'stalin-era',
            initial: 'Т',
            cyrillic: 'Михаил Тухачевский',
            name: t('미하일 투하쳅스키', 'Mikhail Tukhachevsky'),
            years: '1893–1937',
            epithet: t('「붉은 나폴레옹」 — 자신이 만든 군대의 손에 죽다', '“The Red Napoleon,” killed by the army he built'),
            bio: t(
                '27세에 바르샤바까지 진격한 내전의 신동이자, 크론시타트와 탐보프 농민 반란의 진압자. 종심작전 교리로 붉은 군대를 현대화한 원수였으나, 1937년 「독일 간첩」으로 몰려 비밀 재판 하루 만에 총살되었다. 그와 함께 시작된 장교단 숙청의 청구서는 1941년 6월에 도착했다.',
                'The civil-war prodigy who marched on Warsaw at twenty-seven — and the suppressor of Kronstadt and the Tambov peasant rising. The marshal whose deep-operations doctrine modernized the Red Army was branded a German spy in 1937 and shot within a day of a secret trial. The bill for the officer-corps purge that began with him was delivered in June 1941.'
            ),
            fate: fate('executed', '처형 1937', 'Shot, 1937'),
            aliases: { ko: ['투하쳅스키'], en: ['Tukhachevsky'] },
            scenes: [],
        },
        {
            id: 'yezhov',
            group: 'stalin-era',
            initial: 'Е',
            cyrillic: 'Николай Ежов',
            name: t('니콜라이 예조프', 'Nikolai Yezhov'),
            years: '1895–1940',
            epithet: t('대숙청의 집행자, 같은 지하실에서 끝나다', 'The executor of the Terror, finished in the same cellar'),
            bio: t(
                '키 151센티미터로 「피의 난쟁이」라 불린 내무인민위원. 1937~38년의 대테러를 집행해 그 시기에 「예조프시나(예조프의 시대)」라는 이름이 붙었다. 쓸모가 다하자 그 자신이 「간첩」으로 체포되어, 자신이 세운 절차 그대로 1940년 총살되었다. 오늘날 그는 스탈린 곁에서 지워진 사진 속의 빈자리로 가장 유명하다.',
                'The five-foot Commissar of Internal Affairs whom prisoners called “the bloody dwarf.” He administered the Terror of 1937–38 — an era named the Yezhovshchina after him — and when his usefulness ended, he was arrested as a “spy” himself and shot in 1940 by the very procedure he had built. He is most famous today as the empty space airbrushed out of the photographs beside Stalin.'
            ),
            fate: fate('executed', '처형 1940', 'Shot, 1940'),
            aliases: { ko: ['예조프'], en: ['Yezhov'] },
            scenes: [],
        },
        {
            id: 'ordzhonikidze',
            group: 'stalin-era',
            initial: 'О',
            cyrillic: 'Серго Орджоникидзе',
            name: t('세르고 오르조니키제', 'Sergo Ordzhonikidze'),
            years: '1886–1937',
            epithet: t('대전환의 공업 사령관, 스스로 방아쇠를 당기다', 'Commander of the industrial front — he pulled the trigger himself'),
            bio: t(
                '스탈린의 오랜 조지아 동향 친구이자 중공업인민위원 — 마그니토고르스크의 용광로들이 그의 관할이었다. 대숙청이 자신의 공장장들과 친형을 삼키자 스탈린과 정면으로 충돌했고, 1937년 2월 자택에서 권총으로 목숨을 끊었다. 공식 발표는 심장마비였다.',
                'Stalin’s old Georgian comrade and Commissar of Heavy Industry — the blast furnaces of Magnitogorsk answered to him. When the Terror began devouring his plant directors and his own brother, he collided head-on with Stalin, and in February 1937 shot himself at home. The official bulletin said heart failure.'
            ),
            fate: fate('suicide', '자살 1937', 'Suicide, 1937'),
            aliases: { ko: ['오르조니키제'], en: ['Ordzhonikidze'] },
            scenes: [],
        },
        {
            id: 'korolev',
            group: 'thaw',
            initial: 'К',
            cyrillic: 'Сергей Королёв',
            name: t('세르게이 코롤료프', 'Sergei Korolev'),
            years: '1907–1966',
            epithet: t('수용소에서 우주로 — 이름조차 국가기밀이었던 설계자', 'From the Gulag to space — the designer whose name was a state secret'),
            bio: t(
                '1938년 숙청에 걸려 콜리마 금광에서 건강과 이를 잃은 로켓 기술자. 살아 돌아와 스푸트니크와 가가린을 쏘아 올린 로켓을 만들었지만, 생전에 그의 이름은 기밀이었다 — 노벨상 위원회의 문의에 소련은 「수석설계자」라고만 답했다. 수용소가 망가뜨린 몸은 1966년의 수술을 견디지 못했다.',
                'A rocket engineer swept up in the 1938 purge, he left his health and his teeth in the Kolyma gold mines. He came back to build the rockets that lifted Sputnik and Gagarin — yet in his lifetime his name was classified: to the Nobel committee’s inquiry, the USSR answered only “the Chief Designer.” The body the camps had broken did not survive surgery in 1966.'
            ),
            fate: fate('natural', '자연사 1966', 'Died 1966'),
            aliases: { ko: ['코롤료프'], en: ['Korolev'] },
            scenes: [],
        },
        {
            id: 'gagarin',
            group: 'thaw',
            initial: 'Г',
            cyrillic: 'Юрий Гагарин',
            name: t('유리 가가린', 'Yuri Gagarin'),
            years: '1934–1968',
            epithet: t('인류 최초로 지구를 벗어난 미소', 'The first human smile to leave the Earth'),
            bio: t(
                '집단농장 목수의 아들이 1961년 4월 12일, 108분 만에 지구를 한 바퀴 돌았다 — 「파예할리!(갑시다!)」. 냉전의 한복판에서 두 진영이 함께 사랑한 유일한 사람이 되었고, 우주로 돌아갈 날을 준비하며 훈련하다 1968년 미그기 추락으로 죽었다. 서른네 살이었다.',
                'A collective-farm carpenter’s son circled the planet in 108 minutes on April 12, 1961 — “Poyekhali!”, let’s go. In the middle of the Cold War he became the one man both camps loved. Training for a return to space, he died in a MiG crash in 1968. He was thirty-four.'
            ),
            fate: fate('killed', '추락사 1968', 'Killed in crash, 1968'),
            aliases: { ko: ['가가린'], en: ['Gagarin'] },
            scenes: [],
        },
        {
            id: 'solzhenitsyn',
            group: 'thaw',
            initial: 'С',
            cyrillic: 'Александр Солженицын',
            name: t('알렉산드르 솔제니친', 'Aleksandr Solzhenitsyn'),
            years: '1918–2008',
            epithet: t('수용소 군도를 세계에 증언한 죄수 Щ-854', 'Prisoner Shch-854, who told the world about the Archipelago'),
            bio: t(
                '포병 대위로 참전 중 사신(私信)에서 스탈린을 비꼬았다가 8년형을 받았다. 『이반 데니소비치의 하루』(1962)로 해빙의 상징이 되었고, 『수용소군도』로 노벨상과 국외 추방(1974)을 함께 얻었다. 1994년 귀국해 러시아에서 죽었다 — 자신이 증언한 체제보다 17년을 더 살았다.',
                'An artillery captain sentenced to eight years for mocking Stalin in a private letter. One Day in the Life of Ivan Denisovich (1962) made him the emblem of the thaw; The Gulag Archipelago earned him the Nobel Prize and deportation (1974) together. He returned in 1994 and died in Russia — outliving the system he had testified against by seventeen years.'
            ),
            fate: fate('exile', '추방 1974 · 귀국 1994', 'Deported 1974 · returned 1994'),
            aliases: { ko: ['솔제니친'], en: ['Solzhenitsyn'] },
            scenes: [],
        },
        {
            id: 'shevardnadze',
            group: 'perestroika',
            initial: 'Ш',
            cyrillic: 'Эдуард Шеварднадзе',
            name: t('예두아르트 셰바르드나제', 'Eduard Shevardnadze'),
            years: '1928–2014',
            epithet: t('냉전을 끝낸 외무장관, 내전의 대통령으로', 'The foreign minister who ended the Cold War — then a president in a civil war'),
            bio: t(
                '그로미코의 「니예트」 28년을 물려받아, 5년 만에 군축과 아프가니스탄 철군과 독일 통일 협상을 끝냈다. 1990년 12월 「독재가 다가오고 있다」고 경고하며 전격 사임했고 — 8개월 뒤의 쿠데타가 그 예언을 증명했다. 소련이 무너지자 고향 조지아로 돌아가 내전과 암살 기도 속에서 대통령으로 통치했다.',
                'Inheriting twenty-eight years of Gromyko’s “nyet,” he needed five to negotiate the arms cuts, the Afghan withdrawal and German unification. In December 1990 he resigned overnight, warning that “dictatorship is coming” — a prophecy the coup honoured eight months later. When the Union fell he went home to Georgia, governing as president through civil war and assassination attempts.'
            ),
            fate: fate('natural', '자연사 2014', 'Died 2014'),
            aliases: { ko: ['셰바르드나제'], en: ['Shevardnadze'] },
            scenes: [],
        },
        {
            id: 'yakovlev',
            group: 'perestroika',
            initial: 'Я',
            cyrillic: 'Александр Яковлев',
            name: t('알렉산드르 야코블레프', 'Alexander Yakovlev'),
            years: '1923–2005',
            epithet: t('글라스노스트의 설계자 — 이념 담당이 이념을 해체하다', 'The architect of glasnost — the ideology chief who dismantled the ideology'),
            bio: t(
                '전쟁에서 다리를 다친 상이군인이자 당 선전부의 엘리트. 러시아 민족주의를 비판한 논문으로 캐나다 대사 10년의 「유배」를 살았고, 그곳에서 시찰 온 고르바초프를 만났다. 정치국의 이념 담당으로 글라스노스트와 역사 재심을 밀어붙였고, 말년에는 비밀 의정서와 숙청 문서의 공개·복권 작업을 이끌었다.',
                'A war invalid and an elite of the party’s propaganda department. An article criticizing Russian nationalism bought him a ten-year “exile” as ambassador to Canada — where he met a visiting Gorbachev. As the Politburo’s ideology chief he drove glasnost and the re-examination of history, and in his last years led the publication of the secret protocols and the rehabilitation of the purged.'
            ),
            fate: fate('natural', '자연사 2005', 'Died 2005'),
            aliases: { ko: ['야코블레프'], en: ['Yakovlev'] },
            scenes: [],
        },
        {
            id: 'kryuchkov',
            group: 'perestroika',
            initial: 'К',
            cyrillic: 'Владимир Крючков',
            name: t('블라디미르 크류치코프', 'Vladimir Kryuchkov'),
            years: '1924–2007',
            epithet: t('8월 쿠데타를 설계한 KGB 의장', 'The KGB chairman who designed the August coup'),
            bio: t(
                '1956년 부다페스트의 안드로포프 밑에서 경력을 시작해 KGB 의장까지 오른 심복. 1991년 8월 국가비상사태위원회를 조직해 고르바초프를 크림에 연금했으나, 군이 움직이지 않자 쿠데타는 사흘 만에 무너졌다. 감옥에서 회고록을 썼고, 1994년 사면되어 조용히 죽었다 — 그가 지키려던 나라보다 16년을 더 살았다.',
                'Andropov’s man from Budapest 1956, risen to chairman of the KGB. In August 1991 he organized the State Emergency Committee and confined Gorbachev in Crimea — and when the army would not move, the coup collapsed in three days. He wrote his memoirs in prison, was amnestied in 1994, and died quietly — outliving the country he meant to save by sixteen years.'
            ),
            fate: fate('deposed', '체포 1991 · 사면 1994', 'Arrested 1991 · amnestied 1994'),
            aliases: { ko: ['크류치코프'], en: ['Kryuchkov'] },
            scenes: [['history-soviet-union', 'august-1991']],
        },
    ],
    // Per-person career timeline, keyed by person id — rendered as the
    // click-to-expand "상세 이력" <details> on each card. c(y, r) = one row.
    careers: {
        'nicholas-ii': [
            c('1894', '차르 즉위', 'Accedes to the throne'),
            c('1904–05', '러일전쟁 패배, 1905년 혁명', 'Defeat by Japan; the 1905 revolution'),
            c('1906', '기본법 공포, 제한된 두마 체제 출범', 'Fundamental Laws: a hedged Duma order'),
            c('1915', '총사령관을 자임하고 전선으로, 패전 책임이 왕좌로 직결', 'Takes supreme command, defeat now attaches to the throne'),
            c('1917.3', '퇴위', 'Abdicates'),
            c('1918.7', '예카테린부르크에서 가족과 함께 처형', 'Shot with his family at Yekaterinburg'),
        ],
        'gapon': [
            c('1902–04', '경찰 후원 합법 노동회(주바토프식) 「공장노동자회」 조직', 'Organizes the police-sponsored Assembly of Factory Workers'),
            c('1905.1.9', '겨울궁전 청원 행진 인솔, 피의 일요일', 'Leads the Winter Palace petition march, Bloody Sunday'),
            c('1905–06', '망명, 혁명 정당들과 접촉', 'Exile; contacts with the revolutionary parties'),
            c('1906', '경찰 내통이 드러나 SR 전투단에 처형', 'His police ties exposed; hanged by SR combatants'),
        ],
        'witte': [
            c('1892–1903', '재무장관, 금본위제, 시베리아 횡단철도, 공업화 드라이브', 'Finance Minister: gold standard, Trans-Siberian, industrial drive'),
            c('1905.9', '포츠머스에서 일본과의 강화 협상 타결', 'Negotiates the Portsmouth peace with Japan'),
            c('1905.10', '초대 총리, 10월 선언 기초', 'First prime minister; drafts the October Manifesto'),
            c('1906.4', '해임, 이후 국가평의회 한직', 'Dismissed; sidelined to the State Council'),
        ],
        'stolypin': [
            c('1906', '내무장관을 거쳐 총리', 'Interior Minister, then premier'),
            c('1906–07', '야전군법회의로 혁명 진압', 'Field courts-martial against the revolution'),
            c('1906–11', '농업개혁, 공동체 탈퇴와 자영농 육성', 'Agrarian reform: exit from the commune, independent farmers'),
            c('1907.6', '「6월 3일 체제」, 선거법 개정으로 두마 장악', 'The June 3 system: a rewritten franchise tames the Duma'),
            c('1911.9', '키예프 오페라 극장에서 피격, 사망', 'Shot at the Kiev opera; dies of the wound'),
        ],
        'kerensky': [
            c('1912–17', '두마 의원(트루도비키), 정치재판 변호사로 명성', 'Duma deputy (Trudovik); famed defence lawyer in political trials'),
            c('1917.3', '임시정부 법무장관, 정치범 사면, 사형 폐지', 'Justice Minister: amnesty, abolition of the death penalty'),
            c('1917.5', '육해군장관, 6월 공세 강행과 실패', 'War Minister: the failed June offensive'),
            c('1917.7–10', '총리, 코르닐로프 사건, 10월에 실각', 'Premier: the Kornilov affair; overthrown in October'),
            c('1918–70', '파리·뉴욕 망명, 저술과 강연', 'Exile in Paris and New York: writing and lecturing'),
        ],
        'kornilov': [
            c('1914–16', '사단장, 오스트리아 포로가 되었다 탈출해 전국적 명성', 'Divisional commander; escapes Austrian captivity to national fame'),
            c('1917.3', '페트로그라드 군관구 사령관, 황후의 연금을 집행', 'Commands Petrograd district; places the Empress under arrest'),
            c('1917.7', '총사령관 임명', 'Appointed commander-in-chief'),
            c('1917.8', '수도로 군단 이동, 실패, 비호프 수도원 연금', 'Moves the corps on the capital; fails, held at Bykhov'),
            c('1917.11–1918.4', '탈출, 백군 의용군 창설, 예카테리노다르에서 전사', 'Escapes to found the Volunteer Army; killed before Yekaterinodar'),
        ],
        'lenin': [
            c('1895–1900', '체포, 시베리아 유형', 'Arrest; Siberian exile'),
            c('1900–05', '이스크라, 『무엇을 할 것인가』, 볼셰비키 분파 형성', 'Iskra and What Is to Be Done?; the Bolshevik faction forms'),
            c('1914–17', '치머발트 좌파, 「제국주의 전쟁을 내전으로」', 'Zimmerwald Left: turn the imperialist war into civil war'),
            c('1917.4', '귀국, 4월 테제', 'Returns; the April Theses'),
            c('1917.10', '봉기 관철, 인민위원회의 의장', 'Forces the insurrection; chairs Sovnarkom'),
            c('1918–21', '브레스트 강화, 내전, 전시공산주의', 'Brest peace, civil war, War Communism'),
            c('1921', '네프로의 후퇴', 'The retreat into NEP'),
            c('1922–24', '뇌졸중, 「대회에 보내는 편지」 구술', 'Strokes; dictates the Letter to the Congress'),
        ],
        'trotsky': [
            c('1905', '26세에 페테르부르크 소비에트 의장', 'Chairs the Petersburg Soviet at 26'),
            c('1907–17', '망명, 빈·파리·뉴욕에서 언론 활동', 'Exile journalism: Vienna, Paris, New York'),
            c('1917.9–10', '페트로그라드 소비에트 의장, 군사혁명위, 봉기 설계', 'Chairs the Soviet and the MRC; designs the rising'),
            c('1918–25', '전쟁인민위원, 적군 창설, 내전 승리', 'War Commissar: builds the Red Army, wins the civil war'),
            c('1923–27', '좌익반대파, 패배, 출당', 'The Left Opposition: defeat and expulsion'),
            c('1929–40', '국외 추방, 제4인터내셔널(1938), 멕시코에서 암살', 'Deportation; the Fourth International (1938); killed in Mexico'),
        ],
        'stalin': [
            c('1902–17', '지하활동, 체포·유형을 거듭하다 1917년 프라우다로', 'Underground work, repeated exile; Pravda in 1917'),
            c('1917–22', '민족인민위원, 내전기 차리친 전선', 'Commissar of Nationalities; the Tsaritsyn front'),
            c('1922', '서기장 취임, 인사권 장악', 'General Secretary: the power of appointment'),
            c('1928–33', '대전환, 집단화·5개년 계획', 'The Great Break: collectivization, the Five-Year Plans'),
            c('1936–38', '대숙청', 'The Great Terror'),
            c('1941–45', '국가방위위원회 의장·최고사령관', 'Chairs the GKO; Supreme Commander'),
            c('1945–53', '전후 재건과 냉전, 1953년 3월 사망', 'Postwar rule and Cold War; dies March 1953'),
        ],
        'zinoviev': [
            c('1907–17', '망명기 레닌의 최측근', 'Lenin’s closest companion of the exile years'),
            c('1917.10', '카메네프와 봉기 반대, 계획 누설 파동', 'With Kamenev, opposes the rising; the leak scandal'),
            c('1919–26', '코민테른 초대 의장', 'First chairman of the Comintern'),
            c('1923–25', '트로이카, 트로츠키 견제', 'The triumvirate against Trotsky'),
            c('1926–27', '통합반대파, 출당과 굴복 반복', 'The United Opposition; expulsions and recantations'),
            c('1936', '제1차 모스크바 재판, 처형', 'The first Moscow trial; shot'),
        ],
        'kamenev': [
            c('1914', '두마 볼셰비키 의원단 재판, 시베리아 유형', 'Tried with the Bolshevik Duma fraction; Siberian exile'),
            c('1917', '프라우다 편집, 4월 테제와 10월 봉기에 반대', 'Edits Pravda; opposes the Theses and the rising'),
            c('1918–26', '모스크바 소비에트 의장', 'Chairs the Moscow Soviet'),
            c('1922–24', '레닌 병중 정치국 주재, 트로이카', 'Presides in the Politburo during Lenin’s illness; the triumvirate'),
            c('1936', '지노비예프와 나란히 재판, 처형', 'Tried beside Zinoviev; shot'),
        ],
        'bukharin': [
            c('1916–17', '뉴욕에서 망명 신문 편집', 'Edits the émigré press in New York'),
            c('1918', '좌파 공산주의자, 브레스트 반대', 'Left Communist against the Brest peace'),
            c('1918–29', '프라우다 주필, 코민테른 지도부', 'Editor of Pravda; Comintern leadership'),
            c('1925–28', '네프 이론가, 「부유해지십시오」', 'Theorist of NEP: “Enrich yourselves”'),
            c('1929', '「우편향」으로 실각', 'Falls as the Right Deviation'),
            c('1934–36', '이즈베스티야 주필, 1936년 헌법 기초 참여', 'Edits Izvestia; helps draft the 1936 constitution'),
            c('1938', '제3차 모스크바 재판, 처형', 'The third Moscow trial; shot'),
        ],
        'luxemburg': [
            c('1893', '폴란드왕국 사회민주당 공동 창립', 'Co-founds the Polish social democracy'),
            c('1898–1914', '독일 사민당 좌파의 이론가, 수정주의 논쟁', 'Theorist of the SPD left; the revisionism dispute'),
            c('1906', '『대중파업론』', 'The Mass Strike'),
            c('1915–18', '반전 투옥, 옥중에서 러시아 혁명 논평 집필', 'Jailed for anti-war work; writes on the Russian Revolution from prison'),
            c('1918.12', '독일공산당 창립', 'Co-founds the German Communist Party'),
            c('1919.1', '베를린 봉기 진압 중 의용군에게 살해', 'Murdered by Freikorps troops in the January rising'),
        ],
        'molotov': [
            c('1912', '프라우다 창간 실무진', 'On the founding staff of Pravda'),
            c('1930–41', '인민위원회의 의장(총리)', 'Chairman of Sovnarkom (premier)'),
            c('1939', '독소불가침조약 서명', 'Signs the Nazi–Soviet pact'),
            c('1939–49, 1953–56', '외무인민위원·외무장관', 'Foreign Commissar, then Foreign Minister'),
            c('1957', '「반당 그룹」, 몽골 대사로 좌천', 'The Anti-Party Group; ambassador to Mongolia'),
            c('1962/1984', '출당, 그리고 22년 뒤 복당', 'Expelled from the party; readmitted twenty-two years later'),
        ],
        'beria': [
            c('1921–31', '캅카스 체카·GPU', 'Cheka and GPU work in the Caucasus'),
            c('1931–38', '조지아 당 제1서기', 'First Secretary of Georgia'),
            c('1938–45', '내무인민위원, 예조프 숙청 마무리와 굴라크 관리, 1944년 민족 강제이주 집행', 'NKVD chief: winds down the Yezhov terror, runs the Gulag, executes the 1944 deportations'),
            c('1945–53', '원폭 계획 총괄(특별위원회 의장)', 'Oversees the atomic project'),
            c('1953.3–6', '제1부총리, 사면·복권 등 개혁안 연발', 'First deputy premier: the burst of reform decrees'),
            c('1953.6/12', '체포, 처형', 'Arrested; shot'),
        ],
        'kirov': [
            c('1909–17', '블라디캅카스에서 언론·지하활동', 'Journalism and underground work in Vladikavkaz'),
            c('1921–26', '아제르바이잔 당 제1서기, 바쿠 유전 재건', 'First Secretary of Azerbaijan; rebuilds the Baku oilfields'),
            c('1926', '레닌그라드 당 제1서기, 지노비예프의 기반 인수', 'Takes over Leningrad from Zinoviev’s machine'),
            c('1930', '정치국원', 'Full Politburo member'),
            c('1934.12.1', '스몰니에서 니콜라예프에게 피살, 같은 날 신속 처형령 발효', 'Shot by Nikolaev at the Smolny; the express-execution decree issued the same day'),
        ],
        'zhukov': [
            c('1939', '할힌골에서 일본군 격파', 'Defeats the Japanese at Khalkhin Gol'),
            c('1941', '참모총장, 이후 레닌그라드·모스크바 방어 지휘', 'Chief of the General Staff; then Leningrad and Moscow'),
            c('1942–45', '최고부사령관, 스탈린그라드·쿠르스크·베를린', 'Deputy Supreme Commander: Stalingrad, Kursk, Berlin'),
            c('1945', '독일 항복 접수, 소련 점령지구 사령관', 'Takes the German surrender; commands the occupation zone'),
            c('1946', '1차 실각, 오데사 군관구로', 'First disgrace: the Odessa district'),
            c('1953/1955–57', '베리야 체포 가담, 국방장관, 1957년 해임', 'Helps arrest Beria; Defence Minister until the 1957 removal'),
            c('1969', '회고록 출간으로 복권', 'Rehabilitated with his memoirs'),
        ],
        'sorge': [
            c('1925–29', '코민테른·적군 정보부 요원', 'Comintern, then Red Army intelligence'),
            c('1930–33', '상하이 정보망', 'The Shanghai network'),
            c('1933–41', '도쿄, 독일 대사관의 신임을 얻은 특파원', 'Tokyo: the correspondent the German embassy trusted'),
            c('1941.5–6', '바르바로사 경고 타전, 묵살', 'Warns of Barbarossa; ignored'),
            c('1941.9', '「일본은 북진하지 않는다」, 시베리아 사단 이동의 근거', '“Japan will not strike north”, the basis for moving the Siberian divisions'),
            c('1941.10/1944.11', '체포, 도쿄에서 처형', 'Arrested; hanged in Tokyo'),
        ],
        'chuikov': [
            c('1942.9', '제62군 사령관, 스탈린그라드 시가전', 'Commands the 62nd Army in Stalingrad'),
            c('1943–45', '근위 제8군, 베를린까지', 'The 8th Guards Army, all the way to Berlin'),
            c('1945.5.1', '베를린에서 독일군의 첫 항복 교섭을 접수', 'Receives the first German surrender overtures in Berlin'),
            c('1949–53', '독일 주둔 소련군 총사령관', 'Commands Soviet forces in Germany'),
            c('1955/1960–64', '원수 승진, 지상군 총사령관', 'Marshal; C-in-C of Ground Forces'),
        ],
        'vasilevsky': [
            c('1937–41', '참모본부 작전부, 숙청으로 빈 자리를 채우며 초고속 승진', 'General Staff operations; rapid rise into purge-emptied posts'),
            c('1942–45', '참모총장, 천왕성 작전 공동 설계', 'Chief of the General Staff; co-designs Uranus'),
            c('1945.8', '극동군 총사령관, 만주 전역', 'C-in-C Far East: the Manchurian campaign'),
            c('1949–53', '군사장관', 'Minister of the Armed Forces'),
        ],
        'khrushchev': [
            c('1935–38', '모스크바 당 제1서기, 지하철 건설', 'Moscow First Secretary; the Metro'),
            c('1938–49', '우크라이나 당 제1서기', 'First Secretary of Ukraine'),
            c('1942–43', '스탈린그라드 전선 군사위원', 'Military council member at Stalingrad'),
            c('1953–64', '당 제1서기', 'First Secretary of the party'),
            c('1954–56', '처녀지 개간, 비밀연설', 'The Virgin Lands; the Secret Speech'),
            c('1957', '「반당 그룹」 격퇴', 'Defeats the Anti-Party Group'),
            c('1961', '제22차 당대회, 스탈린 시신을 묘소에서 이장', 'The 22nd Congress; Stalin’s body moved out of the mausoleum'),
            c('1964', '해임, 연금 생활', 'Voted out; retirement on a pension'),
        ],
        'malenkov': [
            c('1939–45', '서기국 간부 인사, 전시 국가방위위원회에서 항공기 생산 총괄', 'Cadres in the Secretariat; aircraft production on the wartime GKO'),
            c('1953.3–55', '총리, 소비재·감세·「핵전쟁에 승자 없다」 발언', 'Premier: consumer goods, lower taxes, “no victors in nuclear war”'),
            c('1957', '「반당 그룹」 주모자로 실각', 'Falls as ringleader of the Anti-Party Group'),
            c('1957–68', '카자흐스탄 우스티카메노고르스크 수력발전소장', 'Manages the Ust-Kamenogorsk power station in Kazakhstan'),
        ],
        'mikoyan': [
            c('1926–30', '대외·국내상업인민위원, 30대의 최연소 인민위원', 'Commissar of Trade, the youngest commissar, in his thirties'),
            c('1934–38', '식품공업인민위원, 1936년 미국 시찰, 통조림·냉동식품·대량생산 아이스크림 도입', 'Food Industry Commissar: the 1936 US tour; canning, frozen food, mass ice cream'),
            c('1938–49', '대외무역인민위원, 전시 렌드리스 수령 총괄', 'Foreign Trade Commissar; runs wartime Lend-Lease intake'),
            c('1953–64', '무역·소비재 담당 부총리, 흐루쇼프의 해빙 지원', 'Deputy premier for trade and consumer goods; backs the thaw'),
            c('1956/1962', '헝가리 개입 반대, 아바나에서 카스트로 설득', 'Opposes the Hungary intervention; talks Castro down in Havana'),
            c('1964–65', '최고소비에트 간부회의 의장(명목상 국가원수), 이후 은퇴', 'Titular head of state; then retirement'),
        ],
        'nagy': [
            c('1916–21', '러시아군 포로, 적군 가담, 볼셰비키 입당', 'POW in Russia; joins the Red Army and the party'),
            c('1930–44', '모스크바 망명, 코민테른 농업 연구', 'Moscow exile; agrarian research for the Comintern'),
            c('1945–46', '농업장관, 토지개혁 집행', 'Agriculture Minister: land reform'),
            c('1953–55', '총리, 「새 노선」: 수용소 해산, 농민 부담 경감', 'Premier: the New Course, camps closed, peasant burdens eased'),
            c('1955', '실각·출당', 'Removed and expelled'),
            c('1956.10–11', '봉기의 총리, 다당제·중립 선언', 'Premier of the rising: multi-party rule, neutrality'),
            c('1958/1989', '비밀 재판 후 처형, 1989년 영웅광장 재매장', 'Hanged after a secret trial; reburied on Heroes’ Square in 1989'),
        ],
        'brezhnev': [
            c('1950–52', '몰다비아 당 제1서기', 'First Secretary of Moldavia'),
            c('1954–56', '카자흐스탄에서 처녀지 개간 지휘', 'Runs the Virgin Lands campaign in Kazakhstan'),
            c('1964.10', '흐루쇼프 해임을 주도하고 제1서기로', 'Leads Khrushchev’s removal; becomes First Secretary'),
            c('1968', '체코슬로바키아 침공, 브레즈네프 독트린', 'The invasion of Czechoslovakia; the Brezhnev Doctrine'),
            c('1972–79', '데탕트: SALT I·II, 헬싱키 협정', 'Détente: SALT I and II, the Helsinki Accords'),
            c('1977', '신헌법 제정, 국가원수 겸임', 'The new constitution; head of state as well'),
            c('1979', '아프가니스탄 침공 승인', 'Approves the Afghanistan intervention'),
        ],
        'kosygin': [
            c('1939–40', '섬유공업인민위원', 'Commissar of the Textile Industry'),
            c('1941–42', '레닌그라드 소개위원회: 「생명의 길」 보급선 운영', 'Leningrad evacuation board; runs the Road of Life'),
            c('1943–46', '러시아공화국 총리', 'Premier of the Russian republic'),
            c('1949', '「레닌그라드 사건」 숙청에서 살아남다', 'Survives the Leningrad Affair purge'),
            c('1964–80', '각료회의 의장(총리)', 'Chairman of the Council of Ministers'),
            c('1965', '이윤·자율 지표의 경제개혁 발의', 'Launches the profit-and-autonomy economic reform'),
            c('1966–70', '제8차 5개년 계획: 전후 최고 성장', 'The Eighth Five-Year Plan, the best postwar numbers'),
        ],
        'dubcek': [
            c('1925–38', '소련 이주 노동자 가정에서 성장', 'Raised in a worker family in the USSR'),
            c('1944', '슬로바키아 민족봉기 참가', 'Fights in the Slovak National Uprising'),
            c('1963–68', '슬로바키아 당 제1서기', 'First Secretary of the Slovak party'),
            c('1968.1', '체코슬로바키아 당 제1서기: 프라하의 봄', 'First Secretary of Czechoslovakia; the Prague Spring'),
            c('1968.8', '모스크바로 연행, 의정서 서명 강요', 'Taken to Moscow; forced to sign the protocol'),
            c('1969–70', '해임, 터키 대사를 거쳐 산림청으로', 'Removed; ambassador to Turkey, then the forestry service'),
            c('1989.12', '연방의회 의장으로 복귀', 'Returns as chairman of the Federal Assembly'),
        ],
        'sakharov': [
            c('1948–53', '수소폭탄 개발 참여, 1953년 실험 성공', 'On the hydrogen bomb project; the 1953 test'),
            c('1953', '32세에 과학아카데미 정회원', 'Full academician at thirty-two'),
            c('1961', '대기권 실험 반대를 흐루쇼프에게 직접 진언', 'Argues against atmospheric testing to Khrushchev’s face'),
            c('1968', '『진보, 평화공존, 지적 자유』 지하 유통', 'Progress, Coexistence and Intellectual Freedom circulates in samizdat'),
            c('1975', '노벨평화상(출국 불허, 아내가 대리 수상)', 'Nobel Peace Prize; barred from travel, his wife accepts it'),
            c('1980–86', '고리키 유형', 'Internal exile in Gorky'),
            c('1989', '인민대의원, 12월 사망', 'People’s deputy; dies in December'),
        ],
        'andropov': [
            c('1954–57', '부다페스트 주재 대사: 1956년 개입의 현장', 'Ambassador in Budapest through 1956'),
            c('1957–67', '중앙위 사회주의국가 관계 부장', 'Heads the CC department for socialist countries'),
            c('1967–82', 'KGB 의장: 반체제 단속, 제5국 신설', 'KGB chairman: the dissident crackdown, the Fifth Directorate'),
            c('1979', '아프가니스탄 개입 결정의 핵심 3인', 'One of the three behind the Afghan decision'),
            c('1982–84', '서기장: 규율 캠페인, 고르바초프 등 신진 발탁', 'General Secretary: discipline campaign; promotes Gorbachev’s cohort'),
        ],
        'gromyko': [
            c('1943–46', '30대의 워싱턴 주재 대사', 'Ambassador in Washington in his thirties'),
            c('1944–45', '덤바턴오크스·얄타·샌프란시스코: 유엔 창설 실무', 'Dumbarton Oaks, Yalta, San Francisco: building the UN'),
            c('1957–85', '외무장관 28년', 'Foreign Minister for twenty-eight years'),
            c('1962', '쿠바 위기의 협상 창구', 'The negotiating channel of the missile crisis'),
            c('1970s', '데탕트 조약들의 서명자', 'Signatory of the détente treaties'),
            c('1985', '고르바초프 추천 연설, 명목상 국가원수로 이동', 'Nominates Gorbachev; moves to the titular presidency'),
        ],
        'gorbachev': [
            c('1970–78', '스타브로폴 지방 당 제1서기', 'First Secretary of Stavropol region'),
            c('1978–85', '농업 담당 서기, 49세에 정치국원', 'CC Secretary for agriculture; Politburo at forty-nine'),
            c('1985.3', '서기장 선출', 'Elected General Secretary'),
            c('1986–88', '글라스노스트·페레스트로이카, 체르노빌 대응', 'Glasnost and perestroika; Chernobyl'),
            c('1987–89', '중거리핵조약, 아프간 철군, 동유럽 불개입', 'The INF treaty, the Afghan withdrawal, non-intervention in Eastern Europe'),
            c('1990', '초대 대통령, 노벨평화상', 'First president of the USSR; the Nobel Peace Prize'),
            c('1991.12.25', '사임 연설, 소련 국기 하강', 'Resigns; the red flag comes down'),
        ],
        'yeltsin': [
            c('1976–85', '스베르들롭스크 주 당 제1서기', 'First Secretary of Sverdlovsk region'),
            c('1985–87', '모스크바 당 제1서기: 특권 비판으로 인기', 'Moscow party chief; popular for attacking privilege'),
            c('1987', '지도부 정면 비판 후 해임', 'Removed after criticizing the leadership to its face'),
            c('1989–90', '인민대의원 압승, 러시아 최고소비에트 의장, 탈당', 'Landslide deputy; chairs the Russian parliament; quits the party'),
            c('1991.6', '러시아 대통령(사상 첫 직선)', 'President of Russia, the first direct election'),
            c('1991.8/12', '쿠데타 저지, 벨라베자 합의 서명', 'Faces down the coup; signs the Belavezha accords'),
            c('1999.12.31', '사임, 국민에게 사과', 'Resigns, asking his people’s forgiveness'),
        ],
        'rasputin': [
            c('1900s', '시베리아 순례자에서 페테르부르크 살롱으로', 'From Siberian pilgrim to the Petersburg salons'),
            c('1905–07', '황실에 소개되어 황태자의 발작을 진정', 'Introduced at court; calms the heir’s attacks'),
            c('1911–16', '인사 개입 스캔들, 전시의 「장관 도약」', 'Patronage scandals; the wartime “ministerial leapfrog”'),
            c('1916.12', '유수포프 저택에서 살해', 'Killed at the Yusupov palace'),
        ],
        'plekhanov': [
            c('1876–80', '「토지와 자유」 활동가, 망명', 'Land and Liberty populist; emigrates'),
            c('1883', '제네바에서 「노동해방단」 창립: 러시아 마르크스주의의 시작', 'Founds the Emancipation of Labour group in Geneva'),
            c('1889–1914', '제2인터내셔널의 러시아 대표 이론가', 'Russia’s leading theorist in the Second International'),
            c('1903', '당 분열에서 점차 멘셰비키 쪽으로', 'Drifts to the Mensheviks after the 1903 split'),
            c('1917', '37년 만의 귀국, 10월 봉기 반대', 'Returns after thirty-seven years; opposes October'),
        ],
        'martov': [
            c('1895', '페테르부르크 노동계급해방투쟁동맹(레닌과 공동)', 'Co-founds the Petersburg League of Struggle with Lenin'),
            c('1900–03', '이스크라 편집진, 1903년 분열로 멘셰비키 지도자', 'On Iskra; leads the Mensheviks after the split'),
            c('1914–17', '반전 국제주의파', 'Anti-war internationalist'),
            c('1917–20', '멘셰비키 국제주의파 지도, 합법 야당 시도', 'Leads the Menshevik Internationalists; tries legal opposition'),
            c('1921–23', '베를린에서 『사회주의 통보』 창간', 'Founds the Socialist Courier in Berlin'),
        ],
        'dzerzhinsky': [
            c('1897–1917', '체포와 유형 11년, 1917년 석방', 'Eleven years of prison and exile; freed in 1917'),
            c('1917.12', '체카 창설, 의장', 'Founds and chairs the Cheka'),
            c('1921–24', '교통인민위원 겸임: 철도 복구', 'Also Commissar of Transport; rebuilds the railways'),
            c('1924–26', '국민경제최고회의 의장: 공업 재건', 'Chairs the Supreme Economic Council; industrial recovery'),
            c('1926.7', '중앙위 연설 직후 심장마비로 사망', 'Dies of a heart attack after a CC speech'),
        ],
        'kollontai': [
            c('1908–17', '망명, 여성 노동운동 조직', 'Exile; organizing working women'),
            c('1917–18', '복지인민위원: 세계 첫 여성 각료', 'Commissar of Welfare, the first woman in a cabinet'),
            c('1919–22', '여성부(제노트델) 지도', 'Leads the Zhenotdel, the women’s department'),
            c('1920–21', '노동자반대파 참여', 'Sides with the Workers’ Opposition'),
            c('1923–45', '노르웨이·멕시코·스웨덴 공사·대사: 세계 첫 여성 공사', 'Envoy to Norway, Mexico, Sweden: the first woman minister-diplomat'),
            c('1944', '소련-핀란드 강화 교섭 중개', 'Brokers the Soviet–Finnish armistice contacts'),
        ],
        'tukhachevsky': [
            c('1918–20', '25세에 제1군 사령관, 폴란드 전쟁 서부전선 사령관', 'Army commander at twenty-five; Western Front in the Polish war'),
            c('1921', '크론시타트·탐보프 진압 지휘', 'Commands the suppression of Kronstadt and Tambov'),
            c('1925–28', '참모총장', 'Chief of Staff'),
            c('1931–37', '군 현대화: 기계화군단, 공수부대, 종심작전 교리', 'Modernization: mechanized corps, airborne troops, deep operations'),
            c('1935', '초대 원수 5인 중 하나', 'One of the first five marshals'),
            c('1937/1957', '비밀 재판 후 처형, 1957년 복권', 'Shot after a secret trial; rehabilitated in 1957'),
        ],
        'yezhov': [
            c('1922–34', '당 기구에서 간부 인사 담당으로 성장', 'Rises through cadre work in the apparatus'),
            c('1934–36', '키로프 사건 수사 감독', 'Oversees the Kirov investigation'),
            c('1936.9', '내무인민위원', 'Commissar of Internal Affairs'),
            c('1937–38', '대테러 집행: 「예조프시나」', 'Administers the Terror: the Yezhovshchina'),
            c('1938.11', '수리교통인민위원으로 전보(사실상 실각)', 'Shunted to Water Transport, in effect deposed'),
            c('1939/1940', '체포, 처형', 'Arrested; shot'),
        ],
        'ordzhonikidze': [
            c('1912', '프라하 협의회에서 중앙위원 선출', 'Elected to the CC at the Prague conference'),
            c('1921', '캅카스 소비에트화 지휘, 「조지아 사건」 논란', 'Sovietizes the Caucasus; the Georgian affair'),
            c('1926–30', '중앙통제위원회 의장', 'Chairs the Central Control Commission'),
            c('1930–32', '국민경제최고회의 의장', 'Chairs the Supreme Economic Council'),
            c('1932–37', '중공업인민위원: 5개년 계획의 공업 총괄', 'Commissar of Heavy Industry through the Five-Year Plans'),
        ],
        'korolev': [
            c('1933', '제트추진연구그룹(GIRD) 출신으로 로켓연구소 창설 참여', 'From the GIRD rocket group to the new research institute'),
            c('1938–40', '체포, 콜리마 금광', 'Arrested; the Kolyma gold mines'),
            c('1940–44', '옥중 설계국(샤라시카)에서 항공기 설계', 'Aircraft design in a prison design bureau'),
            c('1946–57', '수석설계자: R-7 대륙간탄도미사일', 'Chief Designer: the R-7 ICBM'),
            c('1957/1961', '스푸트니크, 보스토크(가가린) 발사', 'Sputnik; Vostok and Gagarin'),
            c('1966', '수술 중 사망, 사후에야 실명 공개', 'Dies in surgery; his name published only after death'),
        ],
        'gagarin': [
            c('1955–57', '공군 조종사', 'Air force pilot'),
            c('1960', '제1기 우주비행사단 선발', 'Selected for the first cosmonaut group'),
            c('1961.4.12', '보스토크 1호: 인류 첫 우주비행 108분', 'Vostok 1: the first human spaceflight, 108 minutes'),
            c('1961–67', '세계 순방, 우주비행사 훈련 부책임자', 'World tours; deputy head of cosmonaut training'),
            c('1968.3', '미그-15 훈련비행 중 추락', 'Dies in a MiG-15 training crash'),
        ],
        'solzhenitsyn': [
            c('1945–53', '사신 검열로 체포, 수용소 8년(마르피노·에키바스투즈)', 'Arrested over a censored letter; eight years in the camps'),
            c('1953–56', '카자흐스탄 유형, 교사 생활', 'Exile in Kazakhstan; schoolteaching'),
            c('1962', '『이반 데니소비치의 하루』: 흐루쇼프의 재가로 출간', 'One Day published with Khrushchev’s sanction'),
            c('1970', '노벨문학상', 'The Nobel Prize in Literature'),
            c('1973–74', '『수용소군도』 파리 출간, 국외 추방', 'The Gulag Archipelago in Paris; deportation'),
            c('1976–94', '미국 버몬트 은둔, 1994년 귀국', 'Vermont seclusion; returns in 1994'),
        ],
        'shevardnadze': [
            c('1965–72', '조지아 내무장관', 'Interior Minister of Georgia'),
            c('1972–85', '조지아 당 제1서기: 부패 단속과 실험적 개혁', 'First Secretary of Georgia: anti-corruption, experiments'),
            c('1985–90', '외무장관: 군축, 아프간 철군, 독일 통일 협상', 'Foreign Minister: arms cuts, the Afghan exit, German unification'),
            c('1990.12', '「독재가 오고 있다」 경고하며 사임', 'Resigns warning that dictatorship is coming'),
            c('1992–2003', '조지아 국가수반, 대통령: 2003년 장미혁명으로 퇴진', 'Leads Georgia; steps down in the 2003 Rose Revolution'),
        ],
        'yakovlev': [
            c('1941–43', '전선 복무 중 중상', 'Badly wounded at the front'),
            c('1953–72', '중앙위 선전부에서 성장', 'Rises through the CC propaganda department'),
            c('1972–83', '반민족주의 논문 파문으로 캐나다 대사 10년', 'A controversial article buys ten years as ambassador to Canada'),
            c('1983–85', '세계경제국제관계연구소(IMEMO) 소장', 'Directs the IMEMO institute'),
            c('1985–90', '선전부장, 정치국원: 글라스노스트 설계', 'Propaganda chief, Politburo member: designs glasnost'),
            c('1989–2000s', '비밀 의정서 조사위원장, 이후 복권위원회 위원장', 'Chairs the secret-protocols inquiry, then the rehabilitation commission'),
        ],
        'kryuchkov': [
            c('1956', '부다페스트 대사관 3등서기관(안드로포프 휘하)', 'Third secretary in Budapest, under Andropov'),
            c('1967–74', 'KGB 의장 비서실', 'Andropov’s secretariat at the KGB'),
            c('1974–88', '제1총국장: 해외정보 총괄', 'Heads the First Chief Directorate, foreign intelligence'),
            c('1988–91', 'KGB 의장', 'Chairman of the KGB'),
            c('1991.8', '국가비상사태위원회 주도', 'Leads the State Emergency Committee'),
            c('1991–94', '수감, 사면', 'Prison; amnesty'),
        ],
    },
};
