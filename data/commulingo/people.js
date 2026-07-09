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
                '레닌그라드의 인기 있는 당 서기. 1934년 당대회에서 스탈린보다 반대표가 적었다는 소문이 그의 사형선고였다는 설이 지금도 따라다닌다. 그해 12월 스몰니의 복도에서 암살되었고, 스탈린은 그 총성을 당 전체를 숙청하는 법적 구실로 만들었다. 암살의 배후는 여전히 역사가들의 논쟁거리다.',
                'The popular Leningrad party secretary. The rumour that he drew fewer hostile votes than Stalin at the 1934 congress still trails him as a theory of his death sentence. Assassinated in the corridor of the Smolny that December — and Stalin turned the shot into the legal pretext for purging the whole party. Who stood behind the assassin is argued to this day.'
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
            epithet: t('「일리치에서 일리치까지」 살아남은 협상가', 'The negotiator who survived “from Ilyich to Ilyich”'),
            bio: t(
                '「일리치(레닌)에서 일리치(브레즈네프)까지, 심근경색 없이」라는 농담의 주인공. 스탈린 치하의 정치국을 통과해 살아남았고, 1956년 헝가리 무력 개입에 정치국에서 거의 홀로 반대했으며, 쿠바 위기의 뒷수습 협상을 위해 아바나로 날아가 카스트로를 달랬다. 은퇴를 「허락받은」 드문 거물.',
                'Subject of the joke “from Ilyich to Ilyich without infarction” — from Lenin to Brezhnev. He passed alive through Stalin’s Politburo, stood almost alone against the second intervention in Hungary in 1956, and flew to Havana to talk Castro down in the aftermath of the missile crisis. One of the few grandees permitted to retire.'
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
};
