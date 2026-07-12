// CommuLingo — Russian Revolution history, 1905–1937, taught as a DECISION SIMULATION.
//
// Method ("결정의 순간"): instead of quiz cards, the learner is dropped into each
// historical turning point with only the information available AT THE TIME, and must
// commit to a decision BEFORE the reveal (prediction-with-feedback beats passive
// reading). The reveal then shows: what actually happened, what became of the losing
// options, and the causal ripple into the next episode — so the period is learned as
// a chain of contingent choices, not a list of dates.
//
// Anti-dogmatic rules for this book:
//   - Matching "actual history" is NOT scored as "correct". The point is that the
//     fork really existed.
//   - Every option names the real people who advocated it and what became of them.
//   - The epilogue stages live historiographical disputes instead of a verdict.
// Dates before Feb 1918 follow the Russian (Julian) calendar, as people then used it.
//
// Consumed by data/commulingo/shards.js (passes `format` + `decisionTimeline` through)
// and rendered by public/js/commulingo-decision.js.

function t(ko, en) {
    return { ko, en };
}

// A decision option: stance is one of 'radical' | 'cautious' | 'reform' (or null to
// exclude from the temperament tally). `note` = who advocated this path and its fate,
// revealed for every option after the learner decides.
function o(id, stance, labelKo, labelEn, noteKo, noteEn) {
    return { id, stance, label: t(labelKo, labelEn), note: t(noteKo, noteEn) };
}

module.exports = {
    id: 'history-russian-revolution',
    volumeNumber: 0,
    format: 'decision-history',
    title: t('러시아 혁명사 1905–1937: 결정의 순간', 'The Russian Revolution 1905–1937: Decision Points'),
    bookTitle: t('러시아 혁명사 1905–1937', 'The Russian Revolution, 1905–1937'),
    badge: t('결정 시뮬레이션', 'Decision simulation'),
    description: t(
        '연표 암기 대신, 1905년 피의 일요일부터 1937년 대숙청까지 14개의 갈림길에 직접 서 봅니다.',
        'Instead of memorizing a timeline, stand at 14 forks in the road from Bloody Sunday 1905 to the Great Terror of 1937.'
    ),
    chapters: [],
    decisionTimeline: {
        question: t(
            '혁명은 필연이었는가, 선택의 연쇄였는가?',
            'Was the revolution inevitable, or a chain of choices?'
        ),
        thesis: t(
            '1905년부터 1937년까지, 러시아의 역사는 몇 개의 갈림길에서 결정되었다. 각 장면에서 당신은 그때 그 자리의 사람이 되어, 그들이 알던 것만 알고 결정한다. 실제 역사와 다른 선택이 「틀린」 것이 아니다 — 그 갈림길이 실제로 존재했다는 것, 그것이 이 책의 요점이다. (1918년 2월 이전의 날짜는 당시 러시아 달력(구력) 기준.)',
            'From 1905 to 1937, Russian history was decided at a handful of forks. In each scene you become a person of that time and place, knowing only what they knew, and you decide. Choosing differently from actual history is not “wrong” — the point of this book is that the fork really existed. (Dates before February 1918 follow the Russian calendar of the time.)'
        ),
        stances: [
            { id: 'radical', label: t('정면 돌파', 'Head-on'), desc: t('지금 밀어붙인다. 기다림은 패배다.', 'Push through now; waiting is defeat.') },
            { id: 'cautious', label: t('신중한 계산', 'Careful calculation'), desc: t('살아남는 것이 먼저다. 후퇴도 무기다.', 'Survival first; retreat is also a weapon.') },
            { id: 'reform', label: t('타협과 제도', 'Compromise & institutions'), desc: t('제도 안에서, 연합으로, 단계적으로.', 'Within institutions, in coalition, step by step.') },
        ],
        eras: [
            {
                id: 'era-1',
                range: t('1905–1916', '1905–1916'),
                title: t('제1부 · 흔들리는 차르 체제', 'Part I · The Tsarist order shakes'),
                intro: t(
                    '패전과 굶주림 속에서 「신성한 차르」라는 신화가 금이 가기 시작한다.',
                    'Amid defeat and hunger, the myth of the “sacred Tsar” begins to crack.'
                ),
                episodes: [
                    {
                        id: 'bloody-sunday',
                        historyEventId: 'revolution-1905',
                        date: t('1905년 1월 9일', 'January 9, 1905'),
                        title: t('피의 일요일', 'Bloody Sunday'),
                        role: t(
                            '당신은 페테르부르크 푸틸로프 공장의 노동자다.',
                            'You are a worker at the Putilov plant in St. Petersburg.'
                        ),
                        briefing: t(
                            '동료 넷이 부당 해고되자 공장 전체가 파업에 들어갔고, 파업은 도시로 번졌다. 가폰 신부가 내일 겨울궁전으로 평화 행진을 이끈다고 한다. 성상과 차르의 초상을 들고, 8시간 노동과 헌법을 청원하는 행진이다. 많은 이들이 아직 믿는다 — 관리들이 나쁠 뿐, 차르 아버지는 백성의 호소를 들으실 것이라고. 일본과의 전쟁은 지고 있고, 빵값은 오르고 있다.',
                            'After four comrades were unjustly fired, the whole plant struck, and the strike spread across the city. Father Gapon will lead a peaceful march to the Winter Palace tomorrow — icons and portraits of the Tsar in hand, petitioning for the eight-hour day and a constitution. Many still believe it: the officials are wicked, but the Father-Tsar will hear his people. The war with Japan is being lost, and the price of bread is rising.'
                        ),
                        question: t('내일 아침, 당신은 어떻게 하는가?', 'What do you do tomorrow morning?'),
                        options: [
                            o('march', 'reform',
                                '행진에 참가한다 — 차르에게 직접 청원하자',
                                'Join the march — petition the Tsar directly',
                                '가폰과 15만 명이 실제로 간 길이다. 이 소박한 믿음이 총탄에 부서지는 순간, 러시아 정치의 전제 하나가 영원히 사라진다.',
                                'The path Gapon and 150,000 actually took. The moment this simple faith was shattered by bullets, one premise of Russian politics vanished forever.'),
                            o('arm', 'radical',
                                '청원은 소용없다 — 무기를 준비하자고 동료를 설득한다',
                                'Petitions are useless — urge your comrades to arm themselves',
                                '사회민주당 활동가 일부의 입장이었지만, 이날의 대중은 아직 그들을 따르지 않았다. 이 주장이 설득력을 얻는 것은 바로 이날 저녁부터다.',
                                'The position of some Social-Democratic activists — but the crowd was not yet with them. This argument began to persuade only from the evening of this very day.'),
                            o('stay', 'cautious',
                                '함정이다 — 집에 남는다',
                                'It is a trap — stay home',
                                '적지 않은 이들이 그렇게 했고 목숨을 건졌다. 그러나 역사는 광장에 나간 사람들의 피로 방향을 틀었다.',
                                'Quite a few did, and lived. But history turned on the blood of those who went to the square.'),
                        ],
                        actualId: 'march',
                        outcome: t(
                            '군대가 비무장 행렬에 발포했다. 공식 발표로도 백여 명, 실제로는 수백 명이 죽었다. 「차르 아버지」 신앙은 그날 눈 위에서 죽었다. 파업이 제국 전역을 휩쓸었고, 러시아 최초의 혁명 — 1905년 혁명이 시작되었다.',
                            'Troops fired on the unarmed procession. Officially over a hundred died; in reality, hundreds. Faith in the “Father-Tsar” died on the snow that day. Strikes swept the empire, and Russia’s first revolution — 1905 — had begun.'
                        ),
                        ripple: t(
                            '파업을 조직하는 과정에서 노동자들은 새로운 발명품을 만든다 — 공장 대표들의 평의회, 「소비에트」. 12년 뒤 국가의 이름이 될 단어다.',
                            'Organizing the strikes, workers invent something new — councils of factory delegates, the “soviets.” Twelve years later, that word will name a state.'
                        ),
                        insight: t(
                            '역사가들은 이날을 「혁명을 만든 것은 혁명가가 아니라 정권의 총탄이었다」는 사례로 자주 인용한다. 탄압이 체제의 정당성 자체를 파괴한 순간이다.',
                            'Historians often cite this day to show that it was the regime’s bullets, not the revolutionaries, that made the revolution — repression destroying the system’s own legitimacy.'
                        ),
                    },
                    {
                        id: 'october-manifesto',
                        date: t('1905년 10월', 'October 1905'),
                        title: t('10월 선언 — 양보를 받을 것인가', 'The October Manifesto — take the concession?'),
                        role: t(
                            '당신은 페테르부르크 소비에트의 집행위원이다.',
                            'You sit on the executive of the St. Petersburg Soviet.'
                        ),
                        briefing: t(
                            '10월 총파업이 철도·전신·공장을 멈춰 제국을 마비시켰다. 궁지에 몰린 차르가 비테의 조언을 받아 「10월 선언」을 발표했다: 언론·집회·결사의 자유, 그리고 입법권을 가진 의회(두마)를 약속한다. 자유주의자들은 축배를 들고 있다. 그러나 약속을 강제할 장치는 아무것도 없고, 군대는 여전히 차르의 것이다.',
                            'The October general strike froze railways, telegraphs and factories, paralyzing the empire. Cornered, the Tsar — on Witte’s advice — issues the October Manifesto: civil liberties and a legislative assembly, the Duma. The liberals are raising toasts. But nothing enforces the promise, and the army still belongs to the Tsar.'
                        ),
                        question: t('소비에트는 어떻게 답해야 하는가?', 'How should the Soviet answer?'),
                        options: [
                            o('accept', 'reform',
                                '선언을 받아들이고 파업을 푼다 — 이제 두마에서 싸우자',
                                'Accept and end the strike — fight in the Duma now',
                                '자유주의자(입헌민주당·10월당)의 길. 그들은 두마를 얻었지만, 차르는 1906년 기본법으로 두마의 손발을 미리 묶었고 마음에 안 들면 해산했다.',
                                'The liberals’ path (Kadets, Octobrists). They got their Duma — but the 1906 Fundamental Laws tied its hands in advance, and the Tsar dissolved it at will.'),
                            o('press-on', 'radical',
                                '종이 약속을 믿지 말라 — 무장봉기로 끝장을 본다',
                                'Trust no paper promise — finish it with an armed rising',
                                '12월 모스크바 봉기의 길. 프레스냐 노동자 지구는 열흘을 버텼지만 세묘놉스키 근위연대의 포격에 짓밟혔다.',
                                'The road of the December rising in Moscow. The Presnya workers’ district held out ten days before the Semyonovsky Guards’ artillery crushed it.'),
                            o('wait', 'cautious',
                                '파업은 유지하되 봉기는 피한다 — 조직을 보존하며 다음 파도를 기다린다',
                                'Keep the strike but avoid a rising — preserve the organization for the next wave',
                                '일부 멘셰비키의 감각에 가까운 길. 그러나 파업은 무한정 지속될 수 없었고, 「다음 파도」는 12년 뒤에야 왔다.',
                                'Closest to some Mensheviks’ instinct. But a strike cannot last forever, and the “next wave” came only twelve years later.'),
                        ],
                        actualId: 'press-on',
                        outcome: t(
                            '선언은 반대 진영을 정확히 갈랐다. 만족한 자유주의자들이 이탈하자 정권은 힘을 회복했고, 12월에 페테르부르크 소비에트 지도부를 체포하고(의장단에 26세의 트로츠키가 있었다) 모스크바 봉기를 포격으로 진압했다. 이후 스톨리핀의 교수대와 농업개혁이 「위로부터의 안정화」를 시도한다.',
                            'The Manifesto split the opposition precisely. Once the satisfied liberals peeled away, the regime recovered its strength: in December it arrested the Petersburg Soviet’s leadership (a 26-year-old Trotsky among its chairs) and shelled the Moscow rising into submission. Then came Stolypin’s gallows and agrarian reform — stabilization from above.'
                        ),
                        ripple: t(
                            '패배한 혁명은 학교가 되었다. 소비에트라는 형식, 총파업이라는 무기, 그리고 「양보는 회수된다」는 교훈 — 1917년의 배우들은 모두 1905년의 졸업생이다.',
                            'The defeated revolution became a school: the soviet as a form, the general strike as a weapon, and the lesson that concessions get clawed back. Every actor of 1917 was a graduate of 1905.'
                        ),
                        insight: t(
                            '양보는 운동을 달래는 도구이면서 동시에 운동을 분열시키는 무기다. 10월 선언은 「타이밍 좋은 양보」가 혁명을 어떻게 해체하는지 보여 주는 고전적 사례로 연구된다.',
                            'A concession soothes a movement — and splits it. The October Manifesto is studied as the classic case of a well-timed concession dismantling a revolution.'
                        ),
                    },
                    {
                        id: 'duma-boycott',
                        date: t('1906년 봄', 'Spring 1906'),
                        title: t('두마 보이콧 논쟁', 'The Duma boycott dispute'),
                        role: t(
                            '당신은 사회민주노동당의 지하 활동가다.',
                            'You are an underground activist of the Social-Democratic Labour Party.'
                        ),
                        briefing: t(
                            '혁명은 진압되었고, 약속된 첫 두마 선거가 시작된다. 선거법은 지주와 부유층에 압도적으로 유리하게 짜였고, 두마의 권한은 기본법으로 미리 잘려 있다. 당 안에서 논쟁이 불붙었다. 「이 가짜 의회에 참여하는 것은 반동에 정당성을 주는 짓이다」 — 「아니다, 합법 연단은 지하당이 대중을 만나는 유일한 창구다」.',
                            'The revolution is crushed, and elections to the promised First Duma begin. The franchise is stacked toward landlords and the wealthy; the Duma’s powers were clipped in advance by the Fundamental Laws. The party is aflame: “Joining this sham parliament legitimizes the reaction” — “No: a legal tribune is an underground party’s only window to the masses.”'
                        ),
                        question: t('선거를 어떻게 할 것인가?', 'What to do about the election?'),
                        options: [
                            o('boycott', 'radical',
                                '보이콧한다 — 가짜 의회에 정당성을 주지 말라',
                                'Boycott — give the sham no legitimacy',
                                '볼셰비키가 실제로 간 길. 그러나 대중은 선거에 참여했고, 레닌은 훗날 『좌익 공산주의』(1920)에서 이 보이콧을 명시적으로 「오류」라고 결산했다.',
                                'The road the Bolsheviks actually took. But the masses voted anyway, and in “Left-Wing” Communism (1920) Lenin explicitly wrote this boycott off as an error.'),
                            o('tribune', 'reform',
                                '참여한다 — 의회를 선동의 연단으로 쓴다',
                                'Participate — use parliament as a tribune for agitation',
                                '멘셰비키가 기운 길이고, 볼셰비키 자신이 제2~4대 두마부터 채택한 길이다. 볼셰비키 두마 의원단은 이후 당의 가장 값진 합법 자산이 된다.',
                                'The road the Mensheviks leaned to — and the one the Bolsheviks themselves adopted from the Second Duma on. Their Duma fraction became the party’s most valuable legal asset.'),
                            o('conditional', 'cautious',
                                '조건부 참여 — 들어가되 언제든 걷어차고 나올 준비를 한다',
                                'Conditional entry — go in, ready to walk out at any moment',
                                '여러 활동가들의 절충안. 실제 역사에서 「연단으로 쓰되 환상은 갖지 않는다」는 태도로 수렴해 갔다.',
                                'The compromise of many activists — which is roughly where practice converged: use the tribune, keep no illusions.'),
                        ],
                        actualId: 'boycott',
                        outcome: t(
                            '볼셰비키는 보이콧했고, 첫 두마는 입헌민주당과 농민 트루도비키가 휩쓸었다. 두마가 토지개혁을 요구하자 차르는 72일 만에 해산해 버렸다. 보이콧으로 얻은 것은 없었다 — 레닌 스스로 나중에 인정했듯이.',
                            'The Bolsheviks boycotted; Kadets and peasant Trudoviks swept the First Duma. When it demanded land reform, the Tsar dissolved it after 72 days. The boycott gained nothing — as Lenin himself later admitted.'
                        ),
                        ripple: t(
                            '「반동기에는 합법 공간을 버리지 말라」 — 이 값비싼 교훈과 함께, 당은 파업과 지하 신문과 두마 연단을 결합하는 법을 배우며 다음 위기를 기다린다. 그 위기는 1914년, 전혀 다른 방향에서 온다.',
                            '“In a time of reaction, never abandon legal openings” — with this costly lesson, the party learns to combine strikes, underground papers and the Duma tribune, and waits. The next crisis comes in 1914, from an entirely different direction.'
                        ),
                        insight: t(
                            '이 장면의 재미는 정답이 아니라 결산에 있다. 레닌은 자기 당의 결정을 사후에 공개적으로 「오류」로 정리했다 — 혁명 정치에서도 노선은 시행착오로 배워졌다.',
                            'The interest here is not the right answer but the audit: Lenin later publicly booked his own party’s decision as an error. Even revolutionary lines were learned by trial and error.'
                        ),
                    },
                    {
                        id: 'war-credits',
                        date: t('1914년 8월', 'August 1914'),
                        title: t('전쟁과 사회주의자', 'The war and the socialists'),
                        role: t(
                            '당신은 두마의 사회주의 계열 의원이다.',
                            'You are a socialist deputy in the Duma.'
                        ),
                        briefing: t(
                            '유럽 전체가 전쟁에 뛰어들었다. 충격적인 소식이 도착한다 — 독일 사회민주당이, 인터내셔널의 자랑이던 그 당이, 제국의회에서 전쟁 공채에 찬성표를 던졌다. 프랑스 사회주의자들도 「조국 방어」로 돌아섰다. 오늘 두마가 전쟁 예산을 표결한다. 거리는 애국 열기로 끓고 있고, 반전 발언은 반역으로 몰릴 것이다.',
                            'All Europe has plunged into war. Shattering news arrives: the German Social Democrats — the pride of the International — voted for war credits in the Reichstag. The French socialists too have swung to “national defence.” Today the Duma votes the war budget. The streets are boiling with patriotism; an anti-war speech will be branded treason.'
                        ),
                        question: t('표결에서 당신은?', 'Your vote?'),
                        options: [
                            o('credits', 'reform',
                                '찬성한다 — 지금은 조국 방어가 먼저다',
                                'Vote yes — national defence comes first now',
                                '유럽 대부분의 사회주의 정당이 간 길. 제2인터내셔널은 이 표결과 함께 사실상 붕괴했고, 「사회애국주의」라는 낙인이 남았다.',
                                'The road of most European socialist parties. The Second International effectively collapsed with these votes, leaving the stigma of “social-patriotism.”'),
                            o('walkout', 'radical',
                                '반대한다 — 표결을 거부하고 퇴장한다',
                                'Refuse — reject the vote and walk out',
                                '러시아 사회민주당 의원들 — 볼셰비키와 멘셰비키 모두 — 이 실제로 간, 유럽에서 드문 길. 볼셰비키 의원 5인은 그해 겨울 체포되어 시베리아로 유형당했다.',
                                'What the Russian Social-Democratic deputies — Bolshevik and Menshevik alike — actually did, rare in Europe. The five Bolshevik deputies were arrested that winter and exiled to Siberia.'),
                            o('abstain', 'cautious',
                                '기권한다 — 정면충돌은 피하되 손은 더럽히지 않는다',
                                'Abstain — avoid collision, keep your hands clean',
                                '일부 서유럽 의원들의 선택. 안전했지만, 전쟁이 길어질수록 「그때 어디 있었나」라는 질문 앞에 초라해졌다.',
                                'Some Western deputies’ choice. Safe — but as the war dragged on, it looked threadbare before the question “where were you then?”'),
                        ],
                        actualId: 'walkout',
                        outcome: t(
                            '러시아의 사회주의 의원들은 공채 표결을 거부하고 퇴장했다. 볼셰비키 의원단은 체포·유형되었다. 국제적으로는 반전 좌파가 치머발트(1915)에 모여 불씨를 지켰다. 그리고 전쟁 자체가 최강의 혁명가였다 — 1,500만 동원, 연이은 패전, 인플레이션이 차르 체제를 안에서부터 갈아 없앴다.',
                            'Russia’s socialist deputies refused the vote and walked out; the Bolshevik fraction was arrested and exiled. Internationally, the anti-war left kept the flame at Zimmerwald (1915). And the war itself proved the greatest revolutionary: fifteen million mobilized, defeat after defeat, inflation — grinding the Tsarist order down from within.'
                        ),
                        ripple: t(
                            '1916년 겨울, 페트로그라드(전쟁으로 「독일식」 이름을 버린 페테르부르크)의 빵 배급 줄이 길어진다. 다음 장면의 주인공은 정치가가 아니라, 그 줄에 선 여성 노동자들과 발포 명령을 받은 병사들이다.',
                            'By the winter of 1916 the bread lines of Petrograd (Petersburg, shorn of its “German” name by the war) grow long. The next scene belongs not to politicians but to the women workers in those lines — and the soldiers ordered to fire on them.'
                        ),
                        insight: t(
                            '1914년 8월은 20세기 좌파의 원죄 논쟁이 시작된 지점이다. 「국제주의는 전쟁의 첫 포성에 무너지는가?」 — 러시아 의원단의 퇴장은 예외였기에 더 큰 상징이 되었다.',
                            'August 1914 opened the left’s great original-sin dispute: does internationalism collapse at the first cannon shot? The Russian deputies’ walkout mattered precisely because it was the exception.'
                        ),
                    },
                ],
            },
            {
                id: 'era-2',
                range: t('1917', '1917'),
                title: t('제2부 · 1917, 두 개의 혁명', 'Part II · 1917, two revolutions'),
                intro: t(
                    '8개월 사이에 제국이 무너지고, 임시정부가 소모되고, 소비에트가 권력을 잡는다.',
                    'In eight months an empire falls, a Provisional Government burns out, and the soviets take power.'
                ),
                episodes: [
                    {
                        id: 'february-soldier',
                        historyEventId: 'february-revolution',
                        date: t('1917년 2월 27일', 'February 27, 1917'),
                        title: t('페트로그라드의 병사', 'A soldier in Petrograd'),
                        role: t(
                            '당신은 볼린스키 근위연대의 병사다. 어제 당신의 부대는 군중에게 발포했다.',
                            'You are a soldier of the Volynsky Guards. Yesterday your unit fired on the crowd.'
                        ),
                        briefing: t(
                            '2월 23일 「세계 여성의 날」, 빵을 요구하는 여성 섬유노동자들의 파업이 도시 전체 파업으로 번졌다. 나흘째, 어제 당신들은 발포 명령을 받았고 네프스키 대로에서 수십 명이 죽었다. 밤새 막사가 술렁인다. 「내일 또 쏘라고 하면?」 군중 속에는 당신 같은 농민의 딸들, 당신 고향의 얼굴들이 있다. 명령 불복종은 총살감이다. 그러나 어제의 발포를 부대의 누구도 자랑스러워하지 않는다.',
                            'On February 23, Women’s Day, striking women textile workers demanding bread set off a citywide strike. It is day four. Yesterday you were ordered to fire; dozens died on Nevsky Prospekt. The barracks seethe all night: “And if they order us to shoot again tomorrow?” In that crowd are peasants’ daughters like your own kin, faces from your village. Disobeying orders means the firing squad. But no one in the unit is proud of yesterday.'
                        ),
                        question: t('아침 점호, 장교가 다시 출동을 명령한다. 당신은?', 'Morning roll call — the officer orders you out again. You?'),
                        options: [
                            o('obey', 'cautious',
                                '복종한다 — 명령은 명령이다, 살아남아야 한다',
                                'Obey — orders are orders; stay alive',
                                '많은 부대가 첫날에는 그렇게 했다. 그러나 발포하는 군대는 도시 전체를 적으로 만들었고, 병사 개개인은 매일 밤 같은 선택 앞에 다시 세워졌다.',
                                'Many units did, at first. But an army that fires makes the whole city its enemy — and every soldier stood before the same choice again each night.'),
                            o('refuse', 'reform',
                                '출동은 하되 쏘지 않는다 — 허공에 쏘고 시간을 끈다',
                                'Go out but do not shoot — fire high, play for time',
                                '며칠 사이 실제로 번지던 행동이다. 카자크 기병 일부는 군중이 지나가도록 길을 비켜 주었다. 「쏘지 않는 군대」는 이미 절반쯤 반란한 군대다.',
                                'Exactly what was spreading those days — some Cossacks even opened their ranks to let the crowd through. An army that will not shoot is already half in mutiny.'),
                            o('mutiny', 'radical',
                                '반란한다 — 발포를 명령하는 장교를 쏘고 군중과 합류한다',
                                'Mutiny — shoot the officer who orders fire, and join the crowd',
                                '볼린스키 연대 하사관 키르피치니코프가 이끈 실제의 길. 이날 아침의 이 총성이 수비대 전체의 반란 신호가 되었다.',
                                'The actual road, led by Sergeant Kirpichnikov of the Volynsky regiment. That morning’s shot became the signal for the whole garrison to rise.'),
                        ],
                        actualId: 'mutiny',
                        outcome: t(
                            '2월 27일 아침 볼린스키 연대가 반란했고, 하루 만에 수비대 전체 — 십수만의 무장 병력 — 가 혁명 편으로 넘어갔다. 쏠 군대가 없어진 차르는 3월 2일 퇴위했다. 로마노프 왕조 300년이 일주일 만에 끝났다. 어떤 정당도 이 혁명을 「지도」하지 못했다 — 레닌은 취리히에, 트로츠키는 뉴욕에, 스탈린은 시베리아에 있었다.',
                            'On the morning of February 27 the Volynsky regiment mutinied; within a day the whole garrison — over a hundred thousand armed men — crossed to the revolution. With no army willing to shoot, the Tsar abdicated on March 2. Three hundred years of Romanov rule ended in a week. No party “led” this revolution: Lenin was in Zurich, Trotsky in New York, Stalin in Siberia.'
                        ),
                        ripple: t(
                            '권력은 둘로 쪼개져 태어난다 — 두마가 세운 임시정부, 그리고 병사·노동자의 페트로그라드 소비에트. 「이중권력」이라는 이 불안정한 동거가 1917년의 무대다.',
                            'Power is born split in two: the Duma’s Provisional Government, and the workers’ and soldiers’ Petrograd Soviet. This unstable cohabitation — “dual power” — is the stage of 1917.'
                        ),
                        insight: t(
                            '혁명의 임계점은 대중의 분노가 아니라 강제력의 이탈이다. 「군대가 누구 편인가」가 갈리는 순간이 구체제의 사망 시각이라는 것 — 1917년 2월이 모든 혁명 이론에 남긴 정리다.',
                            'The tipping point of a revolution is not popular anger but the defection of coercion. The old regime dies at the moment the army changes sides — February 1917’s theorem, written into every theory of revolution since.'
                        ),
                    },
                    {
                        id: 'april-theses',
                        date: t('1917년 4월', 'April 1917'),
                        title: t('4월 테제 — 미친 소리인가', 'The April Theses — madness?'),
                        role: t(
                            '당신은 볼셰비키 페트로그라드 위원회의 위원이다.',
                            'You are a member of the Bolshevik Petrograd committee.'
                        ),
                        briefing: t(
                            '독일이 내준 봉인열차로 망명에서 돌아온 레닌이 핀란드 역에 내리자마자 폭탄선언을 했다. 「임시정부를 일절 지지하지 말라. 모든 권력을 소비에트로. 전쟁 반대. 혁명은 부르주아 단계에서 멈추지 않는다.」 당의 공식 노선 — 프라우다를 이끄는 카메네프와 스탈린의 노선 — 은 정반대다: 러시아는 이제 막 부르주아 혁명을 마쳤으니 임시정부를 조건부로 지지해야 한다는 것. 원로 당원들은 수군댄다. 「망명 생활이 너무 길었던 것 아닌가. 마르크스주의의 단계를 건너뛰겠다니.」',
                            'Back from exile on the sealed train Germany let through, Lenin detonates his bombshell the moment he steps off at the Finland Station: no support whatsoever for the Provisional Government; all power to the soviets; down with the war; the revolution does not stop at its bourgeois stage. The party’s official line — Kamenev’s and Stalin’s, running Pravda — says the opposite: Russia has just completed its bourgeois revolution, so support the government conditionally. Old party hands mutter: has exile been too long? He wants to skip a stage of Marxism itself.'
                        ),
                        question: t('당 회의에서 당신은 어느 쪽에 서는가?', 'At the party meeting, where do you stand?'),
                        options: [
                            o('lenin', 'radical',
                                '레닌을 지지한다 — 소비에트로 권력을, 지금',
                                'Back Lenin — power to the soviets, now',
                                '몇 주 만에 당 전체가 이 노선으로 넘어간 실제의 길. 전쟁과 토지 문제에 임시정부가 답하지 못하는 한, 이 「미친 소리」가 대중의 기분과 공명했다.',
                                'Where the whole party swung within weeks. As long as the government could answer neither war nor land, this “madness” resonated with the popular mood.'),
                            o('stages', 'cautious',
                                '단계론을 지킨다 — 부르주아 혁명을 건너뛸 수는 없다',
                                'Hold the stage theory — you cannot skip the bourgeois revolution',
                                '카메네프·스탈린이 4월 초까지 실제로 견지한 당의 공식 입장. 4월 당협의회에서 패배했지만, 카메네프는 이후에도 당 안에서 「신중파」의 목소리로 남았다.',
                                'The party’s actual official line, held by Kamenev and Stalin into early April. Defeated at the April conference — though Kamenev remained the party’s in-house voice of caution.'),
                            o('reunite', 'reform',
                                '한발 더 — 이참에 멘셰비키와 재통합해 단일 사회주의 정당을 만들자',
                                'Go further — reunite with the Mensheviks into one socialist party',
                                '당시 당 기층에 실제로 있던 흐름이다. 레닌의 테제는 정확히 이 흐름을 끊는 칼이기도 했다 — 통합 대신 분립, 연합 대신 독자 노선.',
                                'A real current in the party rank and file at the time. Lenin’s theses were also a knife aimed precisely at it: separation over merger, an independent line over coalition.'),
                        ],
                        actualId: 'lenin',
                        outcome: t(
                            '4월 당협의회에서 레닌의 노선이 승리했다. 당은 「전쟁 반대, 임시정부 불신임, 모든 권력을 소비에트로」라는, 다른 어떤 정당도 내걸지 않은 구호를 들고 여름을 맞는다. 임시정부가 6월 공세 실패와 토지개혁 지연으로 소모될수록 이 구호의 주가는 올랐다.',
                            'Lenin’s line won at the April conference. The party entered the summer with slogans no other party would touch: against the war, no confidence in the government, all power to the soviets. The more the government burned itself out — the failed June offensive, land reform postponed — the higher those slogans’ stock rose.'
                        ),
                        ripple: t(
                            '7월, 성급한 무장시위(7월 사태)가 진압되며 볼셰비키는 한때 궤멸 직전까지 몰린다 — 레닌은 다시 도피, 트로츠키는 투옥. 당을 구해 준 것은 뜻밖에도 우익 장군의 쿠데타였다.',
                            'In July a premature armed demonstration (the July Days) is crushed and the Bolsheviks are nearly destroyed — Lenin flees again, Trotsky is jailed. What saves the party, unexpectedly, is a right-wing general’s coup.'
                        ),
                        insight: t(
                            '「당은 하나의 강철 기계」라는 통념과 달리, 1917년의 볼셰비키당은 노선을 공개 논쟁으로 갈아 끼우는 시끄러운 조직이었다. 지도자의 테제도 표결로 이겨야 노선이 되었다.',
                            'Contrary to the “party of steel” cliché, the Bolsheviks of 1917 were a noisy organization that swapped lines through open argument. Even the leader’s theses became the line only by winning a vote.'
                        ),
                    },
                    {
                        id: 'kornilov',
                        date: t('1917년 8월', 'August 1917'),
                        title: t('코르닐로프가 온다', 'Kornilov is coming'),
                        role: t(
                            '당신은 임시정부 총리 케렌스키다.',
                            'You are Kerensky, prime minister of the Provisional Government.'
                        ),
                        briefing: t(
                            '당신이 임명한 총사령관 코르닐로프 장군이 크리모프의 기병 군단을 페트로그라드로 이동시키고 있다. 중개인을 거친 대화는 서로 어긋났고, 이제 확실한 것은 하나 — 그는 소비에트를 부수고 「강한 정부」를 세우려 한다. 그 정부에 당신의 자리는 없을 것이다. 수도에는 그를 막을 믿을 만한 병력이 없다. 있는 것은 소비에트, 철도 노조, 그리고 7월에 당신이 감옥에 처넣은 볼셰비키의 조직력뿐이다.',
                            'General Kornilov — your own appointed commander-in-chief — is moving Krymov’s cavalry corps on Petrograd. The talks through an intermediary went crossways; only one thing is now certain: he means to smash the Soviet and install a “strong government,” with no seat in it for you. You have no reliable troops in the capital. What you do have: the Soviet, the railway union, and the organizing muscle of the Bolsheviks you threw in prison in July.'
                        ),
                        question: t('누구의 손을 잡는가?', 'Whose hand do you take?'),
                        options: [
                            o('deal', 'reform',
                                '코르닐로프와 타협한다 — 좌파보다는 장군들이 낫다',
                                'Cut a deal with Kornilov — better the generals than the left',
                                '입헌민주당 일부와 재계가 바란 길. 성공했다면 군사독재였을 것이다 — 그리고 많은 역사가들은 그 독재가 내전을 앞당겼을 뿐이라고 본다.',
                                'What some Kadets and business circles wanted. Success would have meant military dictatorship — which many historians think would only have brought the civil war forward.'),
                            o('arm-left', 'radical',
                                '소비에트에 호소한다 — 볼셰비키까지 무장시켜 수도를 방어한다',
                                'Appeal to the Soviet — arm even the Bolsheviks to defend the capital',
                                '실제의 길. 쿠데타는 막았지만, 풀려난 볼셰비키와 무기를 반납하지 않은 적위대는 두 달 뒤 당신을 겨눈다.',
                                'The actual road. It stopped the coup — but the freed Bolsheviks and the Red Guards who never returned their rifles would point them at you two months later.'),
                            o('loyal-only', 'cautious',
                                '정부군만으로 버틴다 — 좌파를 무장시키는 것은 자살행위다',
                                'Hold with loyal troops only — arming the left is suicide',
                                '문제는 「정부군」이 존재하지 않았다는 것이다. 7월 이후 수도의 병사들은 정부를 위해 죽을 생각이 없었다.',
                                'The problem: “loyal troops” did not exist. After July, the soldiers of the capital had no intention of dying for this government.'),
                        ],
                        actualId: 'arm-left',
                        outcome: t(
                            '총성 한 방 없이 끝났다. 철도 노동자들이 열차를 엉뚱한 선로로 돌리고, 선동가들이 병사들을 설득하자 크리모프의 군단은 도착하기도 전에 녹아 버렸다. 그러나 진짜 승자는 볼셰비키였다 — 「혁명의 수호자」로 부활해 9월에 페트로그라드·모스크바 소비에트의 다수파가 되었다. 장교단은 케렌스키를 배신자로 낙인찍었다. 10월에 그를 지키러 올 군대는 이제 어디에도 없다.',
                            'It ended without a shot: railwaymen shunted the trains onto wrong tracks, agitators talked the soldiers around, and Krymov’s corps dissolved before it arrived. But the real winner was the Bolsheviks — reborn as “defenders of the revolution,” they won majorities in the Petrograd and Moscow soviets by September. The officer corps branded Kerensky a traitor. In October, no army anywhere would come to save him.'
                        ),
                        ripple: t(
                            '9월의 페트로그라드: 소비에트 의장은 감옥에서 나온 트로츠키, 적위대의 소총은 그대로, 그리고 핀란드의 은신처에서 레닌이 편지를 퍼붓기 시작한다 — 「지금 봉기하지 않으면 모든 것을 잃는다」.',
                            'Petrograd in September: Trotsky, out of prison, chairs the Soviet; the Red Guards still have their rifles; and from his Finnish hideout Lenin begins bombarding the party with letters — rise now, or lose everything.'
                        ),
                        insight: t(
                            '케렌스키의 선택은 「나쁜 선택지들 사이의 결정」의 표본으로 읽힌다. 어느 손을 잡아도 그의 정부는 소모품이었다 — 구조가 좁혀 놓은 선택지 안에서 행위자가 고를 수 있는 것이 무엇이었는지 물어보라.',
                            'Kerensky’s dilemma is read as a specimen of choosing among bad options: whichever hand he took, his government was expendable. Ask what an actor can still choose once structure has narrowed the menu.'
                        ),
                    },
                    {
                        id: 'october',
                        historyEventId: 'october-revolution',
                        date: t('1917년 10월 10일', 'October 10, 1917'),
                        title: t('봉기 전야', 'The eve of insurrection'),
                        role: t(
                            '당신은 볼셰비키 중앙위원이다. 변장한 레닌이 방금 회의실에 들어왔다.',
                            'You are a Bolshevik Central Committee member. Lenin, in disguise, has just entered the room.'
                        ),
                        briefing: t(
                            '레닌이 결의안을 내밀었다: 무장봉기를 「의사일정에」 올리자. 근거 — 당은 양대 수도의 소비에트 다수파고, 농민 반란은 전국으로 번졌고, 전선의 군대는 녹아내리고 있으며, 기다리면 케렌스키가 선수를 치거나 수도를 독일군에 내줄 수 있다. 지노비예프와 카메네프가 정면으로 반박한다: 대중은 봉기를 원하지 않는다, 국제 혁명은 아직이다, 성급한 봉기는 당과 혁명을 함께 묻을 것이다 — 소비에트 대회와 제헌의회를 통한 합법적 다수파 전략으로 가자. 2주 뒤 제2차 소비에트 대회가 열린다.',
                            'Lenin lays down his resolution: put armed insurrection “on the order of the day.” His case — the party holds majorities in both capitals’ soviets, peasant revolt has swept the countryside, the army at the front is melting, and waiting lets Kerensky strike first or surrender the capital to the Germans. Zinoviev and Kamenev push back hard: the masses do not want an insurrection, the international revolution has not come, and a premature rising will bury party and revolution together — take the legal-majority road through the Congress of Soviets and the Constituent Assembly. The Second Congress of Soviets meets in two weeks.'
                        ),
                        question: t('표결이다. 당신의 한 표는?', 'The vote is called. Yours?'),
                        options: [
                            o('rise', 'radical',
                                '봉기에 찬성 — 지금이 아니면 기회는 없다',
                                'For insurrection — now or never',
                                '10 대 2로 통과된 실제의 결정. 다만 실행은 트로츠키의 설계대로 소비에트 대회 개막일에 맞춰졌다 — 당의 쿠데타가 아니라 「소비에트 권력의 방어」라는 형식을 입도록.',
                                'The actual decision, carried 10–2. Execution, though, followed Trotsky’s design — timed to the Congress’s opening day, dressed not as a party coup but as the “defence of soviet power.”'),
                            o('congress', 'cautious',
                                '반대 — 소비에트 대회의 표결에 맡기자, 무장봉기는 도박이다',
                                'Against — let the Congress of Soviets decide; insurrection is a gamble',
                                '지노비예프·카메네프의 실제 입장. 두 사람은 반대 의견을 당 밖 신문에 실어 봉기 계획을 사실상 누설했고, 레닌은 「배신」이라 격노했다. 그러나 그들의 경고 — 고립과 내전 — 는 이후 역사에서 자주 다시 읽힌다.',
                                'Zinoviev’s and Kamenev’s actual stand. They aired their dissent in a non-party paper, effectively leaking the plan; Lenin raged at the “treachery.” Yet their warning — isolation and civil war — has been reread ever since.'),
                            o('assembly', 'reform',
                                '반대 — 제헌의회 선거까지 기다리자, 합법 권력이 더 단단하다',
                                'Against — wait for the Constituent Assembly; legal power is firmer',
                                '멘셰비키와 사회혁명당 다수파의 논리. 문제는 시간이었다 — 전선과 농촌은 의회의 시간표를 기다려 주지 않았다.',
                                'The logic of the Mensheviks and most SRs. The problem was time: neither the front nor the villages were waiting on a parliamentary calendar.'),
                        ],
                        actualId: 'rise',
                        outcome: t(
                            '10월 24~25일, 군사혁명위원회가 다리·전신국·역을 거의 무혈로 접수했고, 겨울궁전은 대회 개막 밤에 떨어졌다. 제2차 소비에트 대회는 권력 이양을 추인했다 — 멘셰비키와 우파 사회혁명당이 항의 퇴장하자 트로츠키가 외쳤다. 「당신들의 자리는 역사의 쓰레기통이다!」 새 정부는 첫날 밤 평화 포고령과 토지 포고령을 통과시켰다.',
                            'On October 24–25 the Military-Revolutionary Committee took the bridges, telegraph and stations almost bloodlessly; the Winter Palace fell on the night the Congress opened. The Second Congress ratified the transfer of power — and as the Mensheviks and right SRs walked out in protest, Trotsky called after them: “To the dustbin of history!” That first night, the new government passed the Decrees on Peace and on Land.'
                        ),
                        ripple: t(
                            '권력을 잡는 데는 하루가 걸렸다. 문제는 그다음이다 — 3주 뒤 제헌의회 선거에서 볼셰비키는 4분의 1을 얻는 데 그친다.',
                            'Taking power took a day. The problem is what follows: three weeks later, in the Constituent Assembly elections, the Bolsheviks win only a quarter of the vote.'
                        ),
                        insight: t(
                            '「혁명인가 쿠데타인가」는 이 책 말미의 논쟁으로 미뤄 두자. 여기서 확인할 것은 하나 — 반대표를 던진 두 사람의 이름과 논거가 기록되어 있다는 것. 10월은 만장일치가 아니었다.',
                            'Save “revolution or coup?” for this book’s closing dispute. What to fix here is one fact: the names and arguments of the two who voted no are on the record. October was not unanimous.'
                        ),
                    },
                ],
            },
            {
                id: 'era-3',
                range: t('1918–1921', '1918–1921'),
                title: t('제3부 · 생존의 대가', 'Part III · The price of survival'),
                intro: t(
                    '권력을 지키는 결정들이 하나씩, 혁명이 약속했던 것들을 잘라 낸다.',
                    'One by one, the decisions that keep power alive cut away what the revolution had promised.'
                ),
                episodes: [
                    {
                        id: 'constituent-assembly',
                        date: t('1918년 1월 5일', 'January 5, 1918'),
                        title: t('제헌의회의 하루', 'The Constituent Assembly’s one day'),
                        role: t(
                            '당신은 인민위원회의(소브나르콤)의 일원이다.',
                            'You sit on the Council of People’s Commissars (Sovnarkom).'
                        ),
                        briefing: t(
                            '러시아 역사상 첫 보통선거의 결과가 나왔다. 사회혁명당 약 40%, 볼셰비키 24%. 수십 년간 모든 혁명가가 꿈꿔 온 제헌의회가 오늘 개원하는데, 그 다수파는 당신들이 아니다. 의회는 소비에트 권력을 추인하는 「근로 피착취 인민의 권리 선언」 채택을 거부했다. 당 안의 논리는 이렇다 — 선거는 사회혁명당이 분당(좌파 SR은 지금 우리 연립 파트너다)되기 전 명부로 치러졌고, 소비에트는 의회보다 높은 형태의 민주주의다. 반대편 논리는 단순하다 — 이것은 인민이 방금 뽑은 의회다.',
                            'The results of Russia’s first universal-suffrage election are in: SRs about 40%, Bolsheviks 24%. The Constituent Assembly every revolutionary dreamed of for decades opens today — and its majority is not you. It has refused to adopt the Declaration of Rights of the Working and Exploited People, which would ratify soviet power. The party’s reasoning: the vote used lists drawn before the SR split (the Left SRs now sit in your coalition), and soviets are a higher form of democracy than parliament. The other side’s reasoning is simpler: this is the assembly the people just elected.'
                        ),
                        question: t('내일 아침, 의회를 어떻게 하는가?', 'Tomorrow morning — what happens to the Assembly?'),
                        options: [
                            o('dissolve', 'radical',
                                '해산한다 — 소비에트가 더 높은 민주주의다',
                                'Dissolve it — the soviets are the higher democracy',
                                '실제의 길. 새벽에 경비대장이 「경비병이 피곤하다」며 산회시켰고, 의회는 다시 열리지 못했다. 지지 시위는 발포로 해산됐다.',
                                'The actual road. At dawn the head of the guard adjourned it — “the guard is tired” — and it never met again. Demonstrations in its support were dispersed by gunfire.'),
                            o('coexist', 'cautious',
                                '병존시킨다 — 소비에트와 의회의 권한을 협상하고 재선거를 열어 둔다',
                                'Let them coexist — negotiate powers and keep re-election open',
                                '일부 좌파 SR과 온건파가 모색한 길. 그러나 두 「주권」의 동거가 얼마나 불안정한지는 1917년의 이중권력이 이미 보여 준 터였다.',
                                'What some Left SRs and moderates felt for. But 1917’s dual power had already shown how unstable two “sovereignties” under one roof can be.'),
                            o('yield', 'reform',
                                '결과에 승복한다 — 다수파에게 정부를 넘기고 야당이 된다',
                                'Accept the result — hand government to the majority and go into opposition',
                                '멘셰비키·우파 SR이 요구한 길. 볼셰비키에게 이것은 10월 자체의 취소를 뜻했고, 고려된 적이 없다.',
                                'What the Mensheviks and right SRs demanded. To the Bolsheviks it meant undoing October itself, and was never considered.'),
                        ],
                        actualId: 'dissolve',
                        outcome: t(
                            '의회는 단 하루 열리고 해산되었다. 이 결정으로 사회주의 진영 내부의 균열은 봉합 불가능해졌다 — 내전에서 사회혁명당은 볼가강 유역에 「제헌의회 위원회」 정부(코무치)를 세워 맞선다. 감옥에서 이 소식을 들은 로자 룩셈부르크는 동지적 비판을 남겼다: 「자유는 언제나, 다르게 생각하는 사람의 자유다.」',
                            'The Assembly sat for a single day. The split inside socialism now became unbridgeable — in the civil war the SRs would raise a rival government in its name on the Volga (Komuch). From prison, Rosa Luxemburg set down her comradely warning: “Freedom is always the freedom of the one who thinks differently.”'
                        ),
                        ripple: t(
                            '정통성의 문제는 총구의 문제가 되었다. 이제 정권의 생사는 의회가 아니라 전쟁 — 우선 독일과의 전쟁 — 이 결정한다.',
                            'The question of legitimacy became a question of guns. The regime’s life would now be decided not by any parliament but by war — first of all, the war with Germany.'
                        ),
                        insight: t(
                            '해산 자체보다 그 후가 문제였다는 해석이 유력하다 — 경쟁 정당·언론이 차례로 닫히며, 「소비에트 민주주의」가 일당의 민주주의로 좁아지는 경로가 여기서 시작되었다는 것이다.',
                            'Many historians stress less the dissolution than what followed: rival parties and papers closed one after another, and here began the narrowing of “soviet democracy” into the democracy of a single party.'
                        ),
                    },
                    {
                        id: 'brest-litovsk',
                        date: t('1918년 2월', 'February 1918'),
                        title: t('브레스트-리토프스크 — 굴욕이냐 전쟁이냐', 'Brest-Litovsk — humiliation or war'),
                        role: t(
                            '당신은 중앙위원이다. 독일의 최후통첩이 탁자 위에 있다.',
                            'You are on the Central Committee. Germany’s ultimatum lies on the table.'
                        ),
                        briefing: t(
                            '평화 협상에서 독일이 내민 조건은 강탈이다 — 폴란드, 발트, 우크라이나의 상실. 군대는 이미 존재하지 않는다. 세 입장이 정면으로 충돌한다. 레닌: 「즉시 서명하라. 혁명에겐 숨 쉴 틈이 필요하다. 서명하지 않으면 더 나쁜 조건으로 서명하게 될 것이다.」 부하린과 좌파 공산주의자·좌파 SR: 「제국주의와의 강화는 혁명의 배신이다. 혁명전쟁으로 독일 노동자들의 봉기를 촉발하자.」 트로츠키: 「전쟁도 평화도 아니다 — 서명을 거부하고 전쟁 종료를 일방 선언한다. 독일이 감히 진격하지 못할 것이고, 진격한다면 세계가 제국주의의 맨얼굴을 볼 것이다.」',
                            'Germany’s terms are robbery: Poland, the Baltic, Ukraine — gone. The army no longer exists. Three positions collide head-on. Lenin: sign at once — the revolution needs breathing space; refuse now and you will sign worse terms later. Bukharin, the Left Communists and Left SRs: peace with imperialism betrays the revolution — wage revolutionary war and ignite the German workers. Trotsky: neither war nor peace — refuse to sign, declare the war over unilaterally; Germany will not dare advance, and if it does, the world will see imperialism’s naked face.'
                        ),
                        question: t('어느 안에 표를 던지는가?', 'Which motion gets your vote?'),
                        options: [
                            o('rev-war', 'radical',
                                '혁명전쟁 — 굴욕적 강화는 혁명의 배신이다',
                                'Revolutionary war — a shameful peace betrays the revolution',
                                '부하린·좌파 SR의 길. 싸울 군대가 없다는 것이 치명적 결함이었다. 좌파 SR은 강화 조약에 항의해 연립을 깨고 나갔고, 7월에는 반란까지 일으킨다.',
                                'Bukharin’s and the Left SRs’ road. Its fatal flaw: there was no army to fight with. The Left SRs quit the coalition over the treaty — and rose in revolt that July.'),
                            o('sign', 'cautious',
                                '즉시 서명 — 살아남는 것이 먼저다',
                                'Sign now — survival first',
                                '레닌의 길. 처음엔 중앙위에서도 소수였고, 그는 사임 위협까지 꺼내야 했다. 결국 이 길이 이겼다 — 다만 더 비싸진 값으로.',
                                'Lenin’s road — at first a minority even in the CC; he had to threaten resignation. In the end it won, though at a steeper price.'),
                            o('neither', 'reform',
                                '전쟁도 평화도 아니다 — 서명 거부, 일방적 전쟁 종료 선언',
                                'Neither war nor peace — refuse to sign, declare the war over',
                                '트로츠키의 도박. 독일 혁명이 임박했다는 판단에 건 수였다. 중앙위는 처음에 이 안을 채택했다.',
                                'Trotsky’s gamble, staked on the nearness of a German revolution. The CC adopted it first.'),
                        ],
                        actualId: 'neither',
                        outcome: t(
                            '트로츠키의 안이 먼저 시도되었다. 독일의 답은 진격이었다 — 일주일 만에 독일군은 거의 무저항으로 광대한 영토를 삼켰다. 결국 3월 3일, 처음보다 훨씬 가혹한 조건으로 서명했다: 인구의 3분의 1, 경작지와 공업의 심장부 상실. 레닌의 예언 — 「지금 안 하면 더 나쁜 조건으로 하게 된다」 — 이 글자 그대로 실현된 것이다. 그리고 8개월 뒤 독일이 패전하자 조약은 휴지가 되었다.',
                            'Trotsky’s formula was tried first. Germany’s answer was to advance — in a week, against almost no resistance, it swallowed vast territory. On March 3 Russia signed far harsher terms than the original: a third of its population, its best farmland and industrial heartland. Lenin’s prophecy — refuse now, sign worse later — came true to the letter. Eight months on, Germany lost the war and the treaty turned to paper.'
                        ),
                        ripple: t(
                            '숨 쉴 틈은 오지 않았다. 1918년 여름부터 백군, 농민군, 외국 간섭군과의 전면 내전이 시작된다 — 그리고 내전은 국가의 모양 자체를 바꾼다: 적군(赤軍), 체카, 곡물 징발.',
                            'The breathing space never came. From the summer of 1918, full civil war — Whites, peasant armies, foreign intervention. And civil war reshapes the state itself: the Red Army, the Cheka, grain requisitioning.'
                        ),
                        insight: t(
                            '이 장면의 묘미: 「정면 돌파의 레닌」이 여기서는 가장 신중한 후퇴파다. 노선은 사람의 기질이 아니라 정세 판단의 산물이다 — 이 책의 성향 집계를 너무 믿지 말라는 각주이기도 하다.',
                            'The twist here: Lenin, the man of the head-on charge, is the most cautious retreater in the room. Lines flow from readings of the situation, not fixed temperaments — a footnote telling you not to over-trust this book’s own tally.'
                        ),
                    },
                    {
                        id: 'kronstadt-nep',
                        historyEventId: 'new-economic-policy',
                        date: t('1921년 3월', 'March 1921'),
                        title: t('크론시타트, 그리고 후퇴', 'Kronstadt, and the retreat'),
                        role: t(
                            '당신은 제10차 당대회 대의원이다.',
                            'You are a delegate to the Tenth Party Congress.'
                        ),
                        briefing: t(
                            '내전은 이겼지만 나라는 폐허다. 공업 생산은 전전의 5분의 1, 도시는 굶주리고, 곡물 징발에 지친 농민 반란이 탐보프에서 시베리아까지 번졌다. 그리고 지금, 1917년 「혁명의 자랑」이던 크론시타트 요새의 수병들이 봉기했다. 요구: 소비에트 재선거, 사회주의 정당들의 언론·집회 자유, 징발 폐지. 정부는 이를 백군의 음모라 부르지만, 대의원들은 안다 — 저것은 우리의 언어다. 얼음이 녹으면 요새는 함대와 함께 난공불락이 된다. 대회장 안에는 두 개의 안건이 함께 올라와 있다: 징발을 현물세로 바꾸고 소상거래를 허용하는 「신경제정책」, 그리고 당내 분파 결성을 금지하는 결의안.',
                            'The civil war is won; the country is a ruin. Industry runs at a fifth of prewar; the cities starve; peasant risings against requisitioning stretch from Tambov to Siberia. And now the sailors of Kronstadt — “the pride of the revolution” in 1917 — have risen. Their demands: re-elected soviets, freedom of press and assembly for socialist parties, an end to requisitioning. The government calls it a White plot, but the delegates know: that is our own language. When the ice melts, the fortress and its fleet become impregnable. Before the congress lie two motions: the “New Economic Policy” — a tax in kind instead of requisitioning, small trade legalized — and a resolution banning organized factions inside the party.'
                        ),
                        question: t('당신의 표는 어디로 가는가?', 'Where does your vote go?'),
                        options: [
                            o('hold-line', 'radical',
                                '진압하고 전시공산주의를 고수한다 — 지금 시장에 문을 열면 자본주의가 돌아온다',
                                'Crush the rising and hold War Communism — open the door to the market and capitalism walks back in',
                                '「노동의 군사화」를 주장하던 흐름의 연장선. 그러나 징발을 계속할 경우 농민 전쟁이 정권을 삼킬 것이라는 계산이 대회를 지배했다.',
                                'The extension of the “militarization of labour” current. But the congress was ruled by one calculation: keep requisitioning, and the peasant war swallows the regime.'),
                            o('retreat', 'cautious',
                                '진압하되 후퇴한다 — 네프로 농민과 강화를 맺는다',
                                'Crush it, but retreat — make peace with the peasants through NEP',
                                '실제의 길. 대회 대의원 300명이 직접 얼음 위 돌격에 합류해 요새를 진압했고, 같은 회기에 네프와 분파 금지를 통과시켰다.',
                                'The actual road. Three hundred congress delegates joined the assault across the ice, and the same session passed both NEP and the ban on factions.'),
                            o('concede', 'reform',
                                '요구를 수용한다 — 소비에트 재선거와 사회주의 정당 개방으로 화답한다',
                                'Concede — answer with re-elected soviets and legal socialist parties',
                                '크론시타트 결의문 그 자체이자, 멘셰비키가 요구하던 길. 당 지도부에게 이것은 권력 상실의 다른 이름이었고, 표결에 오르지도 못했다.',
                                'The Kronstadt resolution itself — and the Mensheviks’ demand. To the leadership it was another name for losing power, and it never reached a vote.'),
                        ],
                        actualId: 'retreat',
                        outcome: t(
                            '요새는 얼음 위의 돌격으로 함락되었고, 수병들은 처형되거나 수용소로 갔다. 경제에서는 대담한 후퇴가 시작되었다 — 네프 아래 농민은 세금을 내고 남은 것을 팔았고, 몇 해 만에 시장과 도시가 되살아났다. 정치에서는 정반대였다: 분파 금지로 당내 이견의 조직화가 불법이 되었고, 당 밖의 정당들은 이미 소멸 중이었다. 경제는 열고 정치는 닫는다 — 1920년대 소련의 기본 구도가 이날 정해졌다.',
                            'The fortress fell to an assault over the ice; its sailors were shot or sent to camps. In the economy, a bold retreat began: under NEP peasants paid a tax and sold the rest, and within a few years markets and cities revived. In politics, the opposite: the ban on factions outlawed organized dissent inside the party, while the parties outside it were already being extinguished. Open the economy, close the politics — the basic architecture of the Soviet 1920s was set that day.'
                        ),
                        ripple: t(
                            '분파 금지는 「임시 조치」로 통과되었다. 그러나 임시 조치는 회수되지 않았고, 곧 당내 투쟁의 결정적 무기가 된다 — 그 무기를 쥐게 될 자리가 이듬해 신설된다: 서기장.',
                            'The ban on factions passed as a “temporary measure.” It was never repealed — and it soon became the decisive weapon of inner-party struggle. The office that would wield it was created the following year: General Secretary.'
                        ),
                        insight: t(
                            '크론시타트는 좌파 역사 서술의 가장 아픈 매듭으로 남아 있다 — 혁명 정권이 혁명의 언어로 봉기한 이들을 진압한 사건. 「생존이냐 원칙이냐」라는 이 책의 질문이 가장 날카로워지는 지점이다.',
                            'Kronstadt remains the sorest knot in left historiography — a revolutionary regime crushing a rising that spoke the revolution’s own language. This is where the book’s question, survival or principle, cuts deepest.'
                        ),
                    },
                ],
            },
            {
                id: 'era-4',
                range: t('1922–1937', '1922–1937'),
                title: t('제4부 · 혁명이 자식을 삼키다', 'Part IV · The revolution devours its children'),
                intro: t(
                    '레닌이 쓰러진 뒤, 후계 투쟁과 대전환이 혁명 세대 자신을 향한다.',
                    'After Lenin falls, the succession struggle and the Great Break turn on the revolutionary generation itself.'
                ),
                episodes: [
                    {
                        id: 'lenin-testament',
                        date: t('1924년 5월', 'May 1924'),
                        title: t('레닌의 유언', 'Lenin’s testament'),
                        role: t(
                            '당신은 제13차 당대회를 앞둔 중앙위원이다.',
                            'You are a Central Committee member on the eve of the Thirteenth Congress.'
                        ),
                        briefing: t(
                            '레닌이 죽었다. 그가 병상에서 구술한 「대회에 보내는 편지」가 낭독된다. 지도자들을 한 명씩 평가한 편지는 스탈린 항목에서 못을 박는다 — 「스탈린은 너무 거칠다. … 서기장 자리에서 그를 옮기는 방안을 생각해 보라.」 그러나 회의장의 계산은 복잡하다. 지노비예프와 카메네프는 스탈린과 트로이카를 이뤄 트로츠키를 견제하는 중이고, 그들에게 당장의 위험은 「보나파르트가 될 수 있는」 적군의 창설자 트로츠키다. 스탈린은 조용한 실무가로 보이고, 이미 사직 의사까지 밝혔다.',
                            'Lenin is dead. His dictated “Letter to the Congress” is read aloud — a one-by-one appraisal of the leaders that drives its nail in the Stalin entry: “Stalin is too rude… consider a way of removing him from the post of General Secretary.” But the arithmetic in the room is tangled. Zinoviev and Kamenev run a triumvirate with Stalin to box in Trotsky — and to them the present danger is Trotsky, founder of the Red Army, the man who could play Bonaparte. Stalin looks like a quiet administrator, and has already offered to resign.'
                        ),
                        question: t('편지를 어떻게 처리하는가?', 'What do you do with the letter?'),
                        options: [
                            o('remove', 'radical',
                                '유언대로 한다 — 편지를 공개하고 스탈린을 서기장에서 해임한다',
                                'Do as it says — publish the letter and remove Stalin as General Secretary',
                                '아무도 조직하지 않은 길. 트로츠키조차 이 싸움을 정면으로 걸지 않았다. 서기장의 인사권이 이미 당 기구 전체에 뻗어 있었다는 사실은 나중에야 무게가 보였다.',
                                'The road nobody organized. Even Trotsky would not force this fight head-on. How far the General Secretary’s power of appointment already reached through the apparatus became visible only later.'),
                            o('suppress', 'cautious',
                                '봉인한다 — 지금의 위험은 트로츠키다, 집단지도로 간다',
                                'Seal it — the danger now is Trotsky; hold to collective leadership',
                                '실제의 길. 지노비예프가 「스탈린 동지는 우려를 불식했다」고 변호했고, 편지는 공개되지 않았다. 12년 뒤 지노비예프와 카메네프는 스탈린의 첫 전시재판에서 처형된다.',
                                'The actual road. Zinoviev vouched that “Comrade Stalin has dispelled the fears,” and the letter stayed unpublished. Twelve years later, Zinoviev and Kamenev were shot after Stalin’s first show trial.'),
                            o('congress-decide', 'reform',
                                '공개하되 결정은 대회에 — 대의원 전체 앞에서 표결한다',
                                'Publish, but let the congress decide — a vote before all the delegates',
                                '절차적으로 가장 「레닌의 편지」다운 길. 실제로는 대표단별 비공개 낭독으로 절충되었고, 전문은 소련에서 1956년에야 공식 공개된다.',
                                'Procedurally the most faithful to the letter’s intent. In practice it was compromised into closed readings by delegation; the full text was published in the USSR only in 1956.'),
                        ],
                        actualId: 'suppress',
                        outcome: t(
                            '편지는 봉인되었고 스탈린은 자리를 지켰다. 이후의 전개는 각개격파의 교과서다 — 스탈린은 지노비예프·카메네프와 함께 트로츠키를 꺾고(1925), 부하린과 함께 지노비예프·카메네프를 꺾고(1926~27), 마지막으로 부하린을 꺾는다(1929). 트로츠키는 1927년 출당, 1929년 국외 추방. 반대파를 차례로 물리친 무기는 바로 1921년의 분파 금지 조항이었다.',
                            'The letter was sealed; Stalin kept his post. What followed is a textbook of defeat in detail: with Zinoviev and Kamenev, Stalin broke Trotsky (1925); with Bukharin, he broke Zinoviev and Kamenev (1926–27); finally he broke Bukharin (1929). Trotsky: expelled 1927, deported 1929. The weapon that felled each opposition in turn was the 1921 ban on factions.'
                        ),
                        ripple: t(
                            '후계 투쟁은 노선 투쟁이기도 했다 — 「일국사회주의」냐 세계혁명이냐, 그리고 무엇보다: 네프를 계속할 것인가. 1927년의 곡물 수매 위기가 그 질문을 강제로 소환한다.',
                            'The succession fight was also a fight over the line — “socialism in one country” or world revolution, and above all: continue NEP or not. The grain crisis of 1927 forces that question onto the table.'
                        ),
                        insight: t(
                            '이 장면의 공포는 악의가 아니라 근시(近視)다. 모두가 눈앞의 라이벌만 계산했고, 그 계산들의 합이 아무도 원하지 않은 결과를 만들었다 — 집합행동 문제로 읽는 독재의 탄생.',
                            'The horror here is not malice but myopia: each man priced in only the rival in front of him, and the sum of those calculations produced an outcome none of them wanted — the birth of a dictatorship as a collective-action failure.'
                        ),
                    },
                    {
                        id: 'great-break',
                        historyEventId: 'five-year-plans',
                        date: t('1928–1929년', '1928–1929'),
                        title: t('대전환 — 네프를 죽일 것인가', 'The Great Break — kill NEP?'),
                        role: t(
                            '당신은 정치국원이다.',
                            'You sit on the Politburo.'
                        ),
                        briefing: t(
                            '곡물 수매가 무너졌다. 국가 수매가가 낮아 농민이 곡물을 내놓지 않는다 — 도시와 군대를 먹일 빵이 부족하다. 전쟁 공포(1927년 영국과의 단교)가 겹치며 「이대로는 공업화도 국방도 없다」는 초조함이 당을 사로잡았다. 스탈린은 이미 답을 정했다: 비상 조치 — 곡물 강제 압수, 그리고 그 너머의 전면 집단화와 초고속 공업화. 부하린이 정면으로 맞선다: 농민과의 강화는 정권의 토대다, 강제 징발은 내전의 재판이 될 것이다, 공업화는 농업의 성장 위에서 점진적으로 가능하다. 트로츠키의 좌파 반대파는 이미 축출되었다 — 아이러니하게도 「농민에게서 더 짜내라」던 그들의 강령을 이제 스탈린이 몇 배로 키워 실행하려 한다.',
                            'Grain procurement has collapsed. State prices are too low; the peasants withhold their grain — there is not enough bread for the cities and the army. A war scare (Britain broke relations in 1927) feeds the anxiety: at this rate, neither industrialization nor defence. Stalin has already chosen: emergency measures — forcible seizure of grain — and beyond them, full collectivization and breakneck industrialization. Bukharin fights back head-on: peace with the peasants is the regime’s foundation; forced requisitioning will replay the civil war; industry can grow step by step on a rising agriculture. Trotsky’s Left Opposition is already expelled — and, in bitter irony, its program of squeezing the peasants harder is what Stalin now takes up, multiplied.'
                        ),
                        question: t('어느 노선에 서는가?', 'Which line do you stand on?'),
                        options: [
                            o('collectivize', 'radical',
                                '대전환 — 전면 집단화와 초고속 공업화를 강행한다',
                                'The Great Break — force through collectivization and breakneck industrialization',
                                '스탈린의 실제 노선. 10년 안에 공업국을 만든다는 목표는 달성되었다 — 그 비용은 아래 「실제로 일어난 일」에 있다.',
                                'Stalin’s actual line. The goal — an industrial power within a decade — was met. The bill is itemized below, under “what actually happened.”'),
                            o('nep-line', 'reform',
                                '네프를 지킨다 — 수매가를 올리고 농민 경제 위에서 점진 공업화한다',
                                'Defend NEP — raise procurement prices, industrialize gradually on the peasant economy',
                                '부하린·리코프·톰스키 「우편향」의 길. 1929년에 패배해 셋 다 요직에서 쫓겨났고, 부하린과 리코프는 1938년 재판 끝에 처형된다.',
                                'The road of Bukharin, Rykov and Tomsky — the “Right Deviation.” Defeated in 1929 and stripped of their posts; Bukharin and Rykov were shot after the 1938 trial.'),
                            o('managed', 'cautious',
                                '속도 조절 — 비상 조치는 한시로 묶고, 곡물 수입과 부분 개혁으로 위기를 넘긴다',
                                'Manage the pace — cap the emergency measures, ride out the crisis with imports and partial reform',
                                '당 안팎의 여러 실무가들이 기대한 절충. 그러나 「비상 조치」는 한시로 묶이지 않았다 — 우랄-시베리아 방식은 상설 제도가 되었다.',
                                'The middle course many practical men hoped for. But the “emergency measures” were never capped — the Urals-Siberian method hardened into a standing institution.'),
                        ],
                        actualId: 'collectivize',
                        outcome: t(
                            '「위대한 전환의 해」(1929)가 선포되었다. 수백만 가구가 「쿨라크 청산」으로 추방·유형되었고, 농민은 가축을 내주느니 도살했다. 1932~33년, 우크라이나·카자흐스탄·볼가 유역을 대기근이 덮쳐 수백만이 굶어 죽었다 — 같은 시기 곡물 수출은 계속되었다. 한편 마그니토고르스크의 용광로가 서고 5개년 계획의 공장들이 올라갔다. 하나의 결정이 산업 강국과 인구학적 재앙을 동시에 낳았다.',
                            'The “year of the Great Break” (1929) was proclaimed. Millions of households were deported or exiled as “kulaks”; peasants slaughtered their livestock rather than surrender it. In 1932–33 famine engulfed Ukraine, Kazakhstan and the Volga — millions starved, while grain exports continued. Meanwhile the blast furnaces of Magnitogorsk rose and the Five-Year Plan’s factories went up. One decision produced an industrial power and a demographic catastrophe at once.'
                        ),
                        ripple: t(
                            '대전환은 당도 바꿨다 — 목표 수치에 이의를 다는 것 자체가 「우편향」이 되는 당. 그 당에서 1934년, 인기 있는 레닌그라드 서기 키로프에게 총성이 울린다.',
                            'The Break remade the party too — a party where questioning a target figure was itself “right deviation.” In that party, in 1934, a shot rings out for Kirov, the popular Leningrad secretary.'
                        ),
                        insight: t(
                            '20세기 역사학 최대의 반사실(反事實) 논쟁이 여기 걸려 있다 — 「부하린 대안」은 실행 가능했는가. 이 논쟁은 책 말미의 에필로그에서 정면으로 다룬다.',
                            'One of twentieth-century historiography’s great counterfactuals hangs here: was the “Bukharin alternative” viable? The epilogue takes that dispute head-on.'
                        ),
                    },
                    {
                        id: 'great-terror',
                        historyEventId: 'great-terror',
                        date: t('1937년', '1937'),
                        title: t('대숙청 — 선택이 사라진 방', 'The Great Terror — a room without choices'),
                        role: t(
                            '당신은 1905년부터 당원이었던 옛 볼셰비키다. 오늘 새벽 체포되었다.',
                            'You are an Old Bolshevik, a party member since 1905. You were arrested before dawn today.'
                        ),
                        briefing: t(
                            '키로프 암살(1934) 이후 시작된 수사는 이제 당 자체를 삼키고 있다. 지노비예프와 카메네프는 공개재판에서 「테러 음모」를 자백하고 총살되었다(1936). 신문은 매일 새로운 「인민의 적」을 발표한다. 취조관이 조서를 내민다 — 외국 정보기관의 간첩이었다고, 동지 몇 명의 이름을 대라고. 서명하면 가족은 건드리지 않겠다고 한다. 당신은 알고 있다: 어제의 재판에서 크레스틴스키가 법정에서 자백을 번복했지만, 하룻밤 만에 다시 「자백」했다. 그리고 당신 안의 어떤 목소리는 이렇게 속삭인다 — 당이 그것을 요구한다면, 이것이 당에 바치는 마지막 복무인가.',
                            'The investigations that began with Kirov’s murder (1934) are now devouring the party itself. Zinoviev and Kamenev confessed to a “terrorist conspiracy” at a public trial and were shot (1936). Every day the papers name new “enemies of the people.” The interrogator pushes the deposition across the table: you were a foreign spy; name a few comrades. Sign, and your family will not be touched. You know that at yesterday’s trial Krestinsky retracted his confession in open court — and by the next morning had “confessed” again. And some voice inside you whispers: if the party demands it, is this one’s last service to the party?'
                        ),
                        question: t('조서 앞에서, 당신은?', 'The deposition is before you. You?'),
                        options: [
                            o('confess', null,
                                '서명한다 — 가족을 지키고, 당에 대한 마지막 복무로',
                                'Sign — protect your family; one last service to the party',
                                '대부분의 피고가 간 길. 고문, 가족 인질, 그리고 평생을 바친 당을 부정할 수 없다는 심리가 겹쳐 있었다. 부하린은 스탈린에게 마지막 편지를 남겼다 — 「코바, 왜 나의 죽음이 필요한가?」',
                                'The road most defendants took — under torture, with families held hostage, and unable to renounce the party they had given their lives to. Bukharin left Stalin a last letter: “Koba, why do you need me to die?”'),
                            o('deny', null,
                                '법정에서 부인한다 — 세계가 지켜보는 곳에서 진실을 말한다',
                                'Deny it in court — speak the truth where the world is watching',
                                '크레스틴스키가 하루 동안 간 길이다. 밤사이 무슨 일이 있었는지는 기록에 없다. 다음 날 그는 번복을 번복했다.',
                                'Krestinsky’s road — for one day. What happened that night is not in the record. The next morning he retracted his retraction.'),
                            o('refuse', null,
                                '끝까지 서명을 거부한다',
                                'Refuse to sign, to the end',
                                '적지 않은 이들이 그렇게 버텼다. 그들은 공개재판 없이, 특별협의회의 서류 몇 장으로 처리되었다. 자백은 재판의 연료였을 뿐, 판결의 조건이 아니었다.',
                                'Not a few held out. They were processed without public trial, by a few sheets from a special board. Confession fuelled the spectacle; it was never a condition of the verdict.'),
                        ],
                        actualId: 'confess',
                        outcome: t(
                            '어느 길을 골랐든 결과는 거의 같았다 — 총살, 혹은 수용소. 1937~38년 대테러로 약 70만 명이 처형되었다. 10월 봉기를 결정한 1917년 중앙위원 가운데 스탈린 시대를 산 채로 통과한 사람은 손에 꼽는다. 혁명 20주년이 되는 1937년, 혁명을 만든 세대가 혁명의 이름으로 소거되었다. 이 장면에 「점수」가 없는 이유가 그것이다 — 대테러의 본질은 나쁜 선택이 아니라, 선택 자체의 소거였다.',
                            'Whichever road you chose, the end was nearly the same — a bullet, or the camps. In 1937–38 some 700,000 people were executed. Of the 1917 Central Committee that voted the October rising, those who passed through the Stalin years alive can be counted on one hand. In 1937, the revolution’s twentieth year, the generation that made it was erased in its name. That is why this scene keeps no score: the essence of the Terror was not a bad choice, but the erasure of choice itself.'
                        ),
                        ripple: t(
                            '이 책의 시간은 여기서 멈춘다. 1905년의 갈림길들에서 출발한 연쇄가 왜, 어떻게 여기에 닿았는가 — 필연이었는지, 어긋난 선택들의 누적이었는지는 아래 에필로그의 논쟁으로 넘긴다.',
                            'The book’s clock stops here. How the chain that began at the forks of 1905 arrived at this room — necessity, or an accumulation of choices gone wrong — is handed to the disputes of the epilogue below.'
                        ),
                        insight: t(
                            '피고들의 자백은 오래 수수께끼였다 — 쾨슬러의 『한낮의 어둠』은 「당에 대한 마지막 복무」 가설을, 이후의 문서 공개는 고문과 가족 인질이라는 더 단순한 답을 보탰다. 두 답은 배타적이지 않다.',
                            'The confessions puzzled the world for decades — Koestler’s Darkness at Noon proposed the “last service to the party” thesis; the later archives added the simpler answers of torture and hostage families. The two answers do not exclude each other.'
                        ),
                    },
                ],
            },
        ],
        verdict: {
            title: t('나의 혁명 노선', 'My revolutionary line'),
            lockedHint: t(
                '모든 갈림길을 결정하면, 당신의 선택 성향이 여기에 나타납니다.',
                'Decide every fork, and your pattern of choices will appear here.'
            ),
            matchLabel: t('실제 역사와 같은 길을 택한 횟수', 'Times you chose the road history took'),
            matchNote: t(
                '실제 역사와 다른 선택이 「틀린」 것이 아닙니다 — 그 갈림길이 실재했다는 것이 이 책의 요점입니다. 그리고 브레스트의 레닌이 보여 주듯, 같은 사람도 정세에 따라 다른 노선에 섭니다.',
                'Choosing differently from history is not being “wrong” — the book’s point is that the fork was real. And as Lenin at Brest shows, the same person stands on different lines as the situation changes.'
            ),
            profiles: {
                radical: t(
                    '당신은 갈림길마다 정면 돌파를 골랐습니다. 1917년 4월과 10월의 레닌, 1929년의 스탈린이 그 길에 서 있었습니다 — 역사를 실제로 움직인 길이지만, 청구서도 가장 큰 길이었습니다.',
                    'You chose the head-on charge at fork after fork. Lenin in April and October 1917, Stalin in 1929 stood on that road — the road that actually moved history, and the one with the steepest bill.'
                ),
                cautious: t(
                    '당신은 살아남는 쪽에 걸었습니다. 브레스트에서 서명한 레닌, 네프로 후퇴한 1921년의 당이 그 길에 서 있었습니다 — 혁명을 구한 길이지만, 그때마다 무언가를 잘라 내야 했던 길이기도 합니다.',
                    'You bet on survival. Lenin signing at Brest, the party retreating into NEP in 1921 stood on that road — the road that saved the revolution, and each time cut something away from it.'
                ),
                reform: t(
                    '당신은 제도와 타협의 길을 골랐습니다. 멘셰비키, 제헌의회, 네프를 지키려던 부하린이 그 길에 서 있었습니다 — 러시아에서 번번이 좁아진 길이지만, 그것이 이 길의 오류를 증명하는지는 역사가들이 아직 다투고 있습니다.',
                    'You chose institutions and compromise. The Mensheviks, the Constituent Assembly, Bukharin defending NEP stood on that road — a road that kept narrowing in Russia, though whether that proves it wrong is still disputed by historians.'
                ),
            },
            resetLabel: t('처음부터 다시 결정하기', 'Decide everything again'),
        },
        epilogue: {
            title: t('에필로그 · 역사가들의 법정', 'Epilogue · The historians’ tribunal'),
            hint: t(
                '이 시기를 둘러싼 살아 있는 논쟁 세 가지. 양쪽 주장을 읽고, 「그래서 무엇이 남는가」를 눌러 가려 보세요.',
                'Three live disputes over this period. Read both sides, then tap “So what remains?” to sort it out.'
            ),
            rounds: [
                {
                    topic: t('10월은 혁명인가, 쿠데타인가', 'October: revolution or coup?'),
                    sideALabel: t('쿠데타론', 'The coup thesis'),
                    sideA: t(
                        '10월은 대중 봉기가 아니라 소수 정예의 정변이었다. 겨울궁전을 점령한 것은 군중이 아니라 조직된 부대였고, 대중 대부분은 구경꾼이었다. 볼셰비키는 권력을 「주운」 것이 아니라 음모로 탈취했다.',
                        'October was a putsch by a disciplined few, not a mass rising. The Winter Palace was taken by organized detachments, not crowds; most of the population were bystanders. The Bolsheviks did not “pick up” power — they seized it by conspiracy.'
                    ),
                    sideBLabel: t('사회사 학파', 'The social historians'),
                    sideB: t(
                        '1917년 가을 페트로그라드 노동자·병사의 급진화는 문서로 확인되는 실재였고, 볼셰비키의 구호(평화·토지·소비에트 권력)는 그 기분과 공명했기에 이겼다. 봉기는 소비에트 대회의 개막에 맞춰졌고 대회가 이를 추인했다 — 조직된 실행과 대중적 기반은 모순이 아니다.',
                        'The radicalization of Petrograd’s workers and soldiers in autumn 1917 is documented fact, and the Bolshevik slogans — peace, land, soviet power — won because they resonated with it. The rising was timed to the Congress of Soviets, which ratified it. Organized execution and a popular base are not contradictions.'
                    ),
                    takeaway: t(
                        '두 질문을 분리하라 — 「누가 실행했는가」(소수의 조직된 부대)와 「무엇이 그것을 가능하게 했는가」(임시정부의 소진과 대중의 급진화). 실행의 형태만 보면 정변이고, 가능 조건까지 보면 혁명이다. 논쟁은 어느 쪽을 본질로 볼 것인가의 싸움이다.',
                        'Separate two questions: who executed it (organized detachments of a few) and what made it possible (a spent government and a radicalized populace). Look only at the execution and it is a coup; include the conditions and it is a revolution. The dispute is over which one counts as the essence.'
                    ),
                },
                {
                    topic: t('레닌에서 스탈린으로 — 필연이었는가', 'From Lenin to Stalin — was it inevitable?'),
                    sideALabel: t('연속성론', 'The continuity thesis'),
                    sideA: t(
                        '스탈린주의는 배신이 아니라 상속이다. 일당 지배, 체카, 경쟁 정당·언론의 폐쇄, 분파 금지 — 대테러가 쓸 장치는 모두 레닌 시대에 제작되었다. 스탈린은 그 논리를 끝까지 밀었을 뿐이다.',
                        'Stalinism was an inheritance, not a betrayal. One-party rule, the Cheka, the closing of rival parties and papers, the ban on factions — every instrument the Terror would use was manufactured in Lenin’s time. Stalin only drove the logic to its end.'
                    ),
                    sideBLabel: t('단절론', 'The rupture thesis'),
                    sideB: t(
                        '장치의 존재가 사용의 규모를 결정하지 않는다. 네프 시대의 소련은 상대적 다원성이 살아 있는 사회였고, 레닌은 말년에 스탈린의 권력을 경계했으며, 부하린 노선이라는 실재하는 대안이 당내에 있었다. 자기 당의 절반을 총살하는 체제는 새로운 발명이다.',
                        'The existence of an instrument does not fix the scale of its use. NEP-era Soviet society retained real pluralism; Lenin in his last years warned against Stalin’s power; and the Bukharin line was a live alternative inside the party. A regime that shoots half its own party is a new invention.'
                    ),
                    takeaway: t(
                        '구조와 행위자를 함께 보라. 장치는 물려받은 것이지만(연속), 그것을 당 자신에게 겨눈 규모와 방식은 선택이었다(단절). 「필연」은 대개 결과를 알고 난 뒤에 쓰이는 단어다 — 이 책이 갈림길마다 당신을 세운 이유다.',
                        'Hold structure and agency together: the instruments were inherited (continuity), but the scale and direction of their use — against the party itself — was chosen (rupture). “Inevitable” is a word usually written after the outcome is known; that is why this book kept standing you at the forks.'
                    ),
                },
                {
                    topic: t('대안은 있었는가 — 부하린 노선 논쟁', 'Was there an alternative? The Bukharin dispute'),
                    sideALabel: t('불가피론', 'The no-alternative case'),
                    sideA: t(
                        '네프는 이미 한계였다. 낮은 곡물 수매가와 공업품 부족이 만든 위기는 구조적이었고, 다가오는 전쟁(1941년은 실제로 왔다)에 대비할 공업화를 농민 경제의 속도로는 이룰 수 없었다. 잔혹했으되 다른 길은 없었다.',
                        'NEP had hit its ceiling. The crisis born of low procurement prices and scarce industrial goods was structural, and industrialization for the coming war — and 1941 did come — could never have been achieved at the pace of a peasant economy. Brutal, but there was no other road.'
                    ),
                    sideBLabel: t('대안 실재론', 'The real-alternative case'),
                    sideB: t(
                        '1928년의 위기는 정책 실패였지 네프의 파산이 아니었다 — 수매가 조정과 수입으로 관리 가능했다. 부하린식 점진 공업화는 실행 가능한 프로그램이었고, 집단화가 초래한 농업 파괴와 기근은 오히려 공업화의 발목을 잡았다. 「1941년을 위해 불가피했다」는 사후 정당화다.',
                        'The 1928 crisis was a policy failure, not NEP’s bankruptcy — manageable with price adjustment and imports. Bukharinist gradual industrialization was a workable program, and the agricultural ruin and famine that collectivization caused in fact dragged industrialization back. “Necessary for 1941” is justification after the fact.'
                    ),
                    takeaway: t(
                        '반사실은 증명할 수 없다 — 그러나 「대안이 없었다」도 똑같이 증명할 수 없다. 확실한 것은 갈림길이 실재했고, 당대인들이 그것을 두고 목숨을 걸고 싸웠다는 사실이다. 필연은 흔히 승자가 사후에 발행하는 증명서다.',
                        'A counterfactual cannot be proven — but neither can “there was no alternative.” What is certain is that the fork was real, and that people of the time staked their lives fighting over it. Inevitability is usually a certificate the winners issue after the fact.'
                    ),
                },
            ],
        },
    },
};
