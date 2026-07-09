// CommuLingo — Soviet history, 1941–1991, taught as a DECISION SIMULATION.
// Sequel to history-russian-revolution (1905–1937); same method ("결정의 순간"):
// the learner stands at each historical fork with only the information available
// AT THE TIME, commits to a decision BEFORE the reveal, then sees actual history,
// the fate of each option, and the causal ripple into the next episode.
//
// Anti-dogmatic rules (inherited from the first book):
//   - Matching "actual history" is NOT scored as "correct". The point is that the
//     fork really existed.
//   - Every option names the real people who advocated it and what became of them.
//   - The epilogue stages live historiographical disputes instead of a verdict.
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
    id: 'history-soviet-union',
    volumeNumber: 1,
    format: 'decision-history',
    title: t('소련사 1941–1991: 결정의 순간', 'The Soviet Union 1941–1991: Decision Points'),
    bookTitle: t('소련사 1941–1991', 'The Soviet Union, 1941–1991'),
    badge: t('결정 시뮬레이션', 'Decision simulation'),
    description: t(
        '초강대국은 왜 스스로 무너졌는가. 1941년 독일 침공 전야부터 1991년 8월의 전차 부대까지, 15개의 갈림길에 직접 서 봅니다. 그때 그 자리의 정보만 갖고 먼저 결정하고, 그다음 실제 역사와 각 선택의 운명, 다음 장면으로 번지는 파장을 확인합니다.',
        'Why did a superpower dismantle itself? Stand at 15 forks in the road, from the eve of the German invasion in 1941 to the tank crews of August 1991. Decide first with only what was known at the time — then see what actually happened, the fate of each path, and the ripple into the next scene.'
    ),
    chapters: [],
    decisionTimeline: {
        question: t(
            '초강대국의 붕괴는 필연이었는가, 선택의 연쇄였는가?',
            'Was the superpower’s collapse inevitable, or a chain of choices?'
        ),
        thesis: t(
            '1941년부터 1991년까지, 소련의 역사는 몇 개의 갈림길에서 결정되었다. 전쟁을 이긴 나라가 반세기 뒤 총성 없이 해체된다 — 그 사이에 놓인 결정들을, 당신은 그때 그 자리의 사람이 되어 그들이 알던 것만 알고 내린다. 실제 역사와 다른 선택이 「틀린」 것이 아니다 — 그 갈림길이 실제로 존재했다는 것, 그것이 이 책의 요점이다.',
            'From 1941 to 1991, Soviet history was decided at a handful of forks. A country that won the greatest of wars dissolved itself half a century later without a shot — and the decisions in between are yours to make, as a person of that time and place, knowing only what they knew. Choosing differently from actual history is not “wrong” — the point of this book is that the fork really existed.'
        ),
        howTo: t(
            '장면을 열고 상황 브리핑을 읽은 뒤, 실제 역사를 보기 전에 먼저 결정하세요. 결정해야 결과가 열립니다.',
            'Open a scene, read the briefing, and commit to a decision before the reveal. The outcome unlocks only after you decide.'
        ),
        stances: [
            { id: 'radical', label: t('힘의 해결', 'Force'), desc: t('질서는 힘으로 지킨다. 물러서면 전부 무너진다.', 'Order is kept by force; yield once and everything falls.') },
            { id: 'cautious', label: t('안정과 통제', 'Stability & control'), desc: t('흔들지 마라. 체제의 생존이 먼저다.', 'Do not rock the boat; the system’s survival comes first.') },
            { id: 'reform', label: t('개혁과 개방', 'Reform & opening'), desc: t('바꾸지 않으면 잃는다. 진실과 타협은 무기다.', 'Change or lose it all; truth and compromise are weapons.') },
        ],
        eras: [
            {
                id: 'era-1',
                range: t('1941–1953', '1941–1953'),
                title: t('제1부 · 전쟁이 만든 초강대국', 'Part I · The superpower the war made'),
                intro: t(
                    '침공 전야의 오판에서 독재자의 죽음까지 — 전쟁이 체제를 시험하고, 승리가 체제를 굳힌다.',
                    'From the miscalculation on the eve of invasion to the dictator’s death — war tests the system, and victory sets it in stone.'
                ),
                episodes: [
                    {
                        id: 'barbarossa-eve',
                        date: t('1941년 6월 21일', 'June 21, 1941'),
                        title: t('침공 전야 — 경보를 울릴 것인가', 'The eve of invasion — sound the alarm?'),
                        role: t(
                            '당신은 참모본부의 고위 작전 장교다. 주코프 참모총장이 크렘린으로 들어갔다.',
                            'You are a senior operations officer of the General Staff. Chief of Staff Zhukov has just gone into the Kremlin.'
                        ),
                        briefing: t(
                            '독일군 300만이 국경에 집결해 있다. 도쿄의 조르게, 베를린의 정보망, 처칠의 경고가 몇 달째 같은 말을 한다 — 침공이 온다. 오늘 저녁에는 독일 탈영병이 국경을 넘어와 「내일 새벽 공격」을 증언했다. 그러나 스탈린은 이 모든 것을 영국이 소·독을 싸움 붙이려는 공작으로 읽는다. 독소불가침조약은 아직 유효하고, 히틀러가 영국을 끝내기 전에 두 개의 전선을 열 리 없다는 것이다. 「도발에 말려들지 말라」 — 국경 부대는 대응 사격조차 금지되어 있다. 주코프와 티모셴코는 전군 전투태세를 요구하러 들어갔다.',
                            'Three million German troops are massed on the border. Sorge in Tokyo, the networks in Berlin, Churchill’s warnings — for months, one message: invasion is coming. This evening a German deserter crossed the lines to testify: the attack comes at dawn. But Stalin reads it all as a British plot to set the USSR and Germany at each other’s throats. The non-aggression pact still stands, and Hitler would never open a second front before finishing Britain. “Do not be provoked” — border units are forbidden even to return fire. Zhukov and Timoshenko have gone in to demand full combat readiness.'
                        ),
                        question: t('참모본부의 건의안, 당신이라면 어느 쪽인가?', 'The General Staff’s recommendation — which would yours be?'),
                        options: [
                            o('full-alert', 'radical',
                                '전군 전투태세 — 즉시 총동원하고 국경 부대를 전개한다',
                                'Full combat alert — mobilize now and deploy the border armies',
                                '주코프·티모셴코가 요구한 길. 스탈린은 「그것이 곧 전쟁이다」라며 거부했다. 전후 회고록 전쟁이 그들의 손을 들어 주었지만, 동원 자체가 침공 구실이 된 1914년의 기억도 실재했다.',
                                'What Zhukov and Timoshenko demanded. Stalin refused — “that means war.” Postwar memoirs vindicated them, but the memory of 1914, when mobilization itself became the pretext for war, was also real.'),
                            o('no-provoke', 'cautious',
                                '도발 회피 — 모호한 경계령만 내리고 시간을 번다',
                                'Avoid provocation — issue only an ambiguous alert and buy time',
                                '스탈린의 실제 노선. 자정 무렵에야 하달된 「지시 제1호」는 「도발에 응하지 말라」는 단서가 붙은 반쪽 경계령이었고, 많은 부대에는 포성보다 늦게 도착했다.',
                                'Stalin’s actual line. “Directive No. 1,” issued near midnight, was a half-alert hedged with “do not respond to provocations” — and reached many units later than the shells did.'),
                            o('diplomacy', 'reform',
                                '베를린에 긴급 교섭을 타진한다 — 요구 조건이라도 들어 보자',
                                'Sound out Berlin urgently — at least hear their demands',
                                '스탈린이 실제로 병행하던 태도다. 몰로토프가 그날 밤 독일 대사를 불러 「독일은 무엇이 불만인가」를 물었다. 슐렌부르크 대사는 답을 갖고 있지 않았다 — 몇 시간 뒤 그가 갖고 온 것은 선전포고였다.',
                                'Exactly what Stalin was trying in parallel: that night Molotov summoned the German ambassador to ask what Germany’s grievance was. Schulenburg had no answer — a few hours later, what he brought was the declaration of war.'),
                        ],
                        actualId: 'no-provoke',
                        outcome: t(
                            '6월 22일 새벽, 인류 역사상 최대의 침공이 시작되었다. 첫날에만 항공기 1,200대가 대부분 지상에서 파괴되었고, 여름이 끝나기 전에 수백만 명이 포로가 되었다. 스탈린은 처음 몇 시간 동안 「독일 장군들의 도발」이라는 해석에 매달렸다. 정보는 넘치도록 있었다 — 없었던 것은, 최고 권력자의 확신과 다른 해석을 그의 앞에 세울 수 있는 사람이었다.',
                            'At dawn on June 22 the largest invasion in human history began. On the first day some 1,200 aircraft were destroyed, most on the ground; before summer ended, millions were prisoners. For the first hours Stalin clung to the theory of a “provocation by German generals.” Intelligence there was in abundance — what did not exist was anyone able to stand a different interpretation in front of the supreme leader’s certainty.'
                        ),
                        ripple: t(
                            '전선은 몇 달 만에 레닌그라드와 모스크바 앞까지 밀린다. 10월, 수도 자체가 함락의 사정권에 들어오면서 다음 결정이 온다 — 정부는 떠나야 하는가.',
                            'Within months the front is pushed to the gates of Leningrad and Moscow. In October the capital itself comes within reach of capture — and the next decision arrives: must the government leave?'
                        ),
                        insight: t(
                            '1941년 6월은 「정보 실패」가 아니라 해석 실패의 표본으로 연구된다. 모든 경고를 한 사람의 확증편향이 걸러 낼 때, 정보기관의 규모는 의미를 잃는다 — 1937년에 이견을 말하는 법을 잊은 체제의 청구서이기도 했다.',
                            'June 1941 is studied not as an intelligence failure but as an interpretation failure: when one man’s confirmation bias filters every warning, the size of the intelligence apparatus stops mattering. It was also the bill for 1937 — a system that had unlearned how to voice dissent.'
                        ),
                    },
                    {
                        id: 'moscow-panic',
                        date: t('1941년 10월 16일', 'October 16, 1941'),
                        title: t('모스크바의 공황 — 수도를 버릴 것인가', 'The Moscow panic — abandon the capital?'),
                        role: t(
                            '당신은 국가방위위원회(GKO)의 일원이다.',
                            'You sit on the State Defence Committee (GKO).'
                        ),
                        briefing: t(
                            '독일군 선봉이 100킬로미터 밖이다. 뱌지마에서 60만이 포위되었고, 수도를 지킬 예비대는 사실상 없다. 어제 정부 기관·외교단·참모본부의 쿠이비셰프 소개(疏開)가 결정되자 도시가 무너졌다 — 관리들이 서류를 태우고 달아나고, 상점이 약탈당하고, 역마다 피난민이 뒤엉킨다. 레닌의 유해까지 시베리아로 옮겨졌다. 이제 마지막 질문이 남았다: 스탈린 자신은 어떻게 하는가. 그의 전용 열차가 역에서 증기를 올리고 있다.',
                            'The German spearheads are a hundred kilometres away. Six hundred thousand men are encircled at Vyazma; there are effectively no reserves left before the capital. Yesterday’s decision to evacuate the government, the diplomatic corps and the General Staff to Kuibyshev broke the city — officials burning papers and fleeing, shops looted, stations choked with refugees. Even Lenin’s body has been shipped east. One question remains: what does Stalin himself do? His special train stands at the station, steam up.'
                        ),
                        question: t('스탈린에게 무엇을 건의하는가?', 'What do you advise Stalin?'),
                        options: [
                            o('stay', 'radical',
                                '잔류 — 수도 사수를 선언하고 11월 7일 혁명 기념 열병식을 강행한다',
                                'Stay — declare the capital held, and hold the November 7 anniversary parade',
                                '실제의 길. 스탈린은 열차를 돌려보냈고, 계엄을 선포했으며, 독일군 포성이 들리는 거리에서 열병식을 열어 부대를 곧장 전선으로 행진시켰다.',
                                'The actual road. Stalin sent the train away, declared a state of siege, and held the parade within earshot of German guns — the troops marching straight from Red Square to the front.'),
                            o('evacuate', 'cautious',
                                '소개 — 정부와 함께 쿠이비셰프로 옮기고, 모스크바는 군에 맡긴다',
                                'Evacuate — move with the government to Kuibyshev and leave Moscow to the army',
                                '이미 절반은 실행된 길이었다 — 정부 기관 대부분은 실제로 떠났다. 그러나 지도자까지 떠난 수도가 버틸 수 있었을지는 10월 16일의 거리가 이미 답하고 있었다.',
                                'Half-taken already — most of the government did leave. But whether a capital abandoned by its leader too could have held, the streets of October 16 were already answering.'),
                            o('feelers', 'reform',
                                '후방에서 강화를 타진한다 — 브레스트의 선례를 기억하라',
                                'Put out peace feelers from the rear — remember the precedent of Brest',
                                '실제로 검토의 흔적이 남은 길이다 — 위기의 순간 베리야 쪽에서 불가리아 대사를 통한 타진설이 전해진다. 히틀러의 전쟁 목표가 영토가 아니라 절멸이었다는 점에서, 1918년의 반복은 애초에 성립하지 않았다.',
                                'A road of which traces remain — accounts have Beria’s people sounding out terms via the Bulgarian ambassador at the darkest moment. Since Hitler’s war aim was extermination, not territory, a repeat of 1918 was never actually on the table.'),
                        ],
                        actualId: 'stay',
                        outcome: t(
                            '스탈린은 남았다. 라디오가 「스탈린은 모스크바에 있다」고 전하자 공황이 가라앉기 시작했다. 조르게가 「일본은 북진하지 않는다」고 타전하자 시베리아 사단들이 서쪽으로 이동했고, 주코프의 지휘 아래 12월 5일 모스크바 앞에서 개전 후 첫 대반격이 시작되었다. 전격전은 모스크바 앞에서 죽었다 — 전쟁은 이제 소모전이고, 소모전은 더 많이 동원하는 자가 이긴다.',
                            'Stalin stayed. When radio announced that Stalin was in Moscow, the panic began to subside. When Sorge signalled that Japan would not strike north, the Siberian divisions rolled west — and on December 5, under Zhukov, the first great counteroffensive of the war opened before Moscow. Blitzkrieg died at the gates of the capital. The war was now attrition, and attrition is won by whoever mobilizes more.'
                        ),
                        ripple: t(
                            '모스크바 앞에서 살아난 전쟁은 이듬해 여름 남쪽으로 방향을 튼다 — 히틀러의 새 목표는 캅카스의 석유, 그리고 볼가 강가의 도시 하나다. 그 도시에는 최고지도자의 이름이 붙어 있다.',
                            'The war that survived before Moscow turns south the next summer — Hitler’s new objectives are the oil of the Caucasus, and one city on the Volga. The city bears the supreme leader’s name.'
                        ),
                        insight: t(
                            '독재의 역설이 응축된 장면이다 — 6월의 재앙을 만든 바로 그 권력 집중이, 10월에는 도시 하나의 사기를 한 사람의 잔류로 지탱해 냈다. 같은 구조가 정세에 따라 치명적 약점도, 비상한 강점도 된다.',
                            'The paradox of dictatorship, compressed into one scene: the same concentration of power that produced June’s catastrophe held a city’s morale together in October by one man’s staying. The same structure is a fatal weakness or an extraordinary strength, depending on the hour.'
                        ),
                    },
                    {
                        id: 'stalingrad-1942',
                        date: t('1942년 9월 12일', 'September 12, 1942'),
                        title: t('스탈린그라드 — 하나뿐인 예비대', 'Stalingrad — the only reserve there is'),
                        role: t(
                            '당신은 최고사령부(스타프카)의 작전 참모다. 지도 앞에서 주코프와 바실렙스키가 속삭이는 것을 스탈린이 들었다.',
                            'You are an operations officer of the Supreme Headquarters (Stavka). Stalin has just overheard Zhukov and Vasilevsky whispering at the map.'
                        ),
                        briefing: t(
                            '독일군의 여름 공세가 볼가에 닿았다. 추이코프의 제62군은 강을 등지고 도시의 폐허에 몰려 있고, 밤마다 강을 건너 들어가는 증원 사단이 며칠 만에 갈려 나간다. 7월의 명령 제227호 — 「한 걸음도 물러서지 마라」 — 이후 무단 후퇴는 형벌 부대행이다. 남쪽에는 캅카스의 유전이 걸려 있고, 도시에는 최고지도자의 이름이 붙어 있다. 방금 스탈린이 고개를 들고 물었다: 「방금 말한 「다른 해법」이란 게 무엇인가?」 회의실의 모두가 같은 산수를 알고 있다 — 전략 예비대는 하나뿐이고, 두 번 쓸 수 없다.',
                            'The German summer offensive has reached the Volga. Chuikov’s 62nd Army stands with its back to the river in the rubble of the city, and the divisions ferried across each night are ground away within days. Since July’s Order No. 227 — “Not one step back” — unauthorized retreat means a penal battalion. To the south lie the oilfields of the Caucasus; on the city hangs the supreme leader’s name. Stalin has just looked up: “And what is this ‘other solution’ you were discussing?” Everyone in the room knows the same arithmetic — there is one strategic reserve, and it cannot be spent twice.'
                        ),
                        question: t('하나뿐인 예비대, 어디에 거는가?', 'The only reserve — where do you stake it?'),
                        options: [
                            o('pour-in', 'radical',
                                '도시에 쏟는다 — 즉시 대반격으로 포위를 풀고 시가전에서 끝장을 본다',
                                'Pour it into the city — counterattack now, break the grip, finish it street by street',
                                '9월 초 도시 북쪽에서 실제로 반복된 시도들의 연장선이다. 준비 없이 투입된 반격은 며칠 만에 피만 남기고 멎었다 — 다만 그 압박이 독일군 예비대를 도시에 묶어 두기는 했다.',
                                'The extension of the attacks actually launched north of the city in early September. Thrown in unprepared, they bled out within days — though their pressure did pin German reserves to the city.'),
                            o('flank', 'cautious',
                                '도시는 버티게만 한다 — 예비대는 숨겨 두 달을 모으고, 측면의 루마니아군을 친다',
                                'Let the city just hold — hide the reserve, build it for two months, then strike the Romanian flanks',
                                '주코프·바실렙스키의 「다른 해법」, 실제의 길. 두 달 동안 백만이 넘는 병력이 무선 침묵 속에 집결했다 — 도시가 그때까지 버틴다는 전제 위에 세워진 계획이었다.',
                                'Zhukov’s and Vasilevsky’s “other solution” — the actual road. For two months over a million men assembled under radio silence: a plan built on the premise that the city holds until then.'),
                            o('east-bank', 'reform',
                                '도시를 내준다 — 볼가 동안으로 물러나 전선을 펴고 병력을 보존한다',
                                'Give up the city — pull back across the Volga, straighten the line, save the men',
                                '군사 교범으로는 논거가 있는 길이다. 그러나 볼가는 남부의 마지막 대동맥이었고, 도시의 이름이 이미 전쟁의 상징이 되어 있었다 — 명령 제227호가 나온 나라에서 이 안을 올린 사람은 없었다.',
                                'A road with textbook arguments behind it. But the Volga was the last great artery of the south, and the city’s name had already become the war’s symbol — in the country of Order No. 227, no one put this motion forward.'),
                        ],
                        actualId: 'flank',
                        outcome: t(
                            '제62군은 「볼가 너머에 우리 땅은 없다」를 구호로 폐허에서 버텼다 — 어떤 주에는 강가까지 수백 미터가 남아 있었다. 11월 19일, 천왕성 작전이 시작되었다. 포위망은 나흘 만에 칼라치에서 닫혔고, 파울루스의 제6군 약 30만이 갇혔다. 만슈타인의 구출 시도도, 괴링이 장담한 공중 보급도 실패했다. 1943년 2월 2일, 항복 전날 원수로 진급한 파울루스가 포로가 되었다 — 프로이센-독일 역사상 원수가 항복한 첫 사례였다. 전쟁의 주도권은 이날 이후 다시는 독일로 돌아가지 않았다.',
                            'The 62nd Army held in the rubble under the watchword “There is no land for us beyond the Volga” — some weeks, a few hundred metres of riverbank were all that remained. On November 19, Operation Uranus began; the ring closed at Kalach within four days, trapping some 300,000 men of Paulus’s Sixth Army. Manstein’s relief drive failed; so did the airlift Göring had promised. On February 2, 1943, Paulus — promoted field marshal the day before the end — surrendered: the first field marshal in Prussian-German history to do so. The initiative never returned to Germany again.'
                        ),
                        ripple: t(
                            '쿠르스크(1943년 7월)에서 독일의 마지막 전략 공세가 부러지고, 전선은 베를린까지 되감긴다. 그리고 승리는 정치가 된다 — 「스탈린그라드」는 이후 반세기 동안 체제 정당성의 가장 단단한 담보가 된다. 1945년의 승전국 앞에는 전혀 다른 질문이 놓인다: 미국이 지배하는 전후 세계에서 어디에 설 것인가.',
                            'At Kursk (July 1943) Germany’s last strategic offensive breaks, and the front rewinds all the way to Berlin. And victory becomes politics — for the next half-century, “Stalingrad” is the regime’s hardest collateral of legitimacy. Before the victor of 1945 stands an entirely different question: where to stand in a postwar world dominated by America.'
                        ),
                        insight: t(
                            '이 승리의 회계장부에는 잔혹한 항목이 있다 — 계획의 눈으로 제62군은 구원의 대상이 아니라 독일군을 도시에 묶어 갈아 없애는 맷돌이자 미끼였다. 버티는 쪽에는 그 사실이 알려지지 않았다. 승리한 결정의 장부에도 대개 이런 줄이 있다는 것 — 이 장면이 남기는 각주다.',
                            'The ledger of this victory carries a brutal line: seen from the plan, the 62nd Army was not the object of rescue but the millstone and the bait, pinning the Germans in the city to be ground down — a fact not shared with those doing the holding. That even victorious decisions keep such a line in their books is this scene’s footnote.'
                        ),
                    },
                    {
                        id: 'marshall-plan',
                        date: t('1947년 6월', 'June 1947'),
                        title: t('마셜 플랜 — 달러를 받을 것인가', 'The Marshall Plan — take the dollars?'),
                        role: t(
                            '당신은 외무성의 고위 관료다. 몰로토프가 파리 회담 대표단을 꾸리고 있다.',
                            'You are a senior official of the Foreign Ministry. Molotov is assembling the delegation to Paris.'
                        ),
                        briefing: t(
                            '전쟁은 이겼지만 나라는 폐허다 — 2,700만이 죽었고, 서부의 도시와 농촌이 잿더미이며, 1946년에는 기근까지 왔다. 미국이 유럽 부흥 계획을 발표했다: 소련과 동유럽도 초청 대상이다. 달러는 절실하다. 그러나 조건이 있다 — 경제 정보 공개, 유럽 공동 기구를 통한 집행. 크렘린의 독법으로 그것은 소련 경제의 장부를 열고 동유럽에 대한 통제를 달러와 바꾸라는 요구다. 트루먼 독트린(3월)이 이미 그리스·터키에서 반소 봉쇄를 선언한 터다. 몰로토프는 일단 파리로 간다 — 문제는 무엇을 들고 돌아오는가다.',
                            'The war is won; the country is a ruin — twenty-seven million dead, the western cities and countryside in ashes, and in 1946, famine. Now America announces a plan to rebuild Europe — and the USSR and Eastern Europe are invited. The dollars are desperately needed. But there are conditions: open economic data, administration through a joint European body. Read from the Kremlin, that means opening the Soviet books and trading control of Eastern Europe for dollars. The Truman Doctrine (March) has already proclaimed containment in Greece and Turkey. Molotov goes to Paris — the question is what he comes back with.'
                        ),
                        question: t('소련의 답은 무엇이어야 하는가?', 'What should the Soviet answer be?'),
                        options: [
                            o('refuse-bloc', 'radical',
                                '거부하고 봉쇄한다 — 동유럽의 참여도 막고 독자 블록을 세운다',
                                'Refuse and seal off — block Eastern Europe’s participation and build a bloc of our own',
                                '실제의 길. 몰로토프는 회담장을 박차고 나왔고, 이미 참여 의사를 밝힌 체코슬로바키아와 폴란드는 모스크바의 명령으로 철회했다. 마스테르코바 — 「우리는 초대장을 받고 문을 닫았다」.',
                                'The actual road. Molotov walked out of the conference; Czechoslovakia and Poland, which had already accepted, were ordered by Moscow to withdraw. An invitation received — and the door shut from inside.'),
                            o('negotiate', 'reform',
                                '조건부 참여를 교섭한다 — 통제는 지키되 달러는 받는다',
                                'Negotiate conditional entry — keep control, take the dollars',
                                '몰로토프가 파리에서 처음 며칠간 실제로 시도한 길이다. 「각국별 양자 원조」를 요구했으나 미국의 설계 자체가 통합 집행이었고 — 여러 역사가들은 그 설계가 소련의 거부를 사실상 계산에 넣은 것이었다고 본다.',
                                'What Molotov actually tried in his first days at Paris — demanding country-by-country bilateral aid. But the plan’s very design was joint administration, and many historians read that design as pricing in a Soviet refusal.'),
                            o('join-inside', 'cautious',
                                '일단 들어간다 — 안에서 조건을 무디게 만들고 정보는 통제한다',
                                'Enter first — blunt the conditions from inside, control what is disclosed',
                                '외무성 일각의 감각에 가까운 길. 그러나 스탈린에게 「미국 기구 안의 소련」은 형용모순이었고, 장부를 여는 순간 전시 경제의 실상이 드러나는 것 자체가 안보 문제였다.',
                                'Close to the instinct of some in the ministry. But to Stalin a “USSR inside an American framework” was a contradiction in terms — and the moment the books opened, the true state of the war-torn economy would itself be a security breach.'),
                        ],
                        actualId: 'refuse-bloc',
                        outcome: t(
                            '거부는 유럽의 분단선이 되었다. 9월 코민포름이 창설되어 「두 진영」 교리를 선포했고, 1948년 2월 프라하에서 쿠데타로 체코슬로바키아가 인민민주주의 진영에 못 박혔으며, 6월에는 베를린 봉쇄가 시작되었다 — 미국의 답은 공수(空輸)와 나토(1949)였다. 마셜 달러로 재건된 서유럽과, 배상과 자력으로 재건하는 동유럽 — 두 유럽의 경제 격차가 이 갈림길에서 벌어지기 시작한다.',
                            'The refusal became Europe’s line of partition. In September the Cominform proclaimed the “two camps”; in February 1948 the Prague coup nailed Czechoslovakia into the people’s-democracy camp; in June the Berlin blockade began — answered by the airlift and by NATO (1949). A Western Europe rebuilt on Marshall dollars, an Eastern Europe rebuilding out of reparations and its own hide: the economic gap between the two Europes starts widening at this fork.'
                        ),
                        ripple: t(
                            '냉전의 구도 — 두 진영, 두 독일, 핵 경쟁(소련 원폭은 1949년) — 이 굳는다. 그리고 1953년 3월, 이 구도를 설계한 사람이 뇌일혈로 쓰러진다. 후계 구도는 준비되어 있지 않다.',
                            'The Cold War architecture — two camps, two Germanys, a nuclear race (the Soviet bomb: 1949) — sets hard. Then, in March 1953, the man who designed it collapses with a stroke. No succession has been prepared.'
                        ),
                        insight: t(
                            '냉전사 최대 논쟁의 한 매듭이 여기 있다 — 거부는 소련의 선택이었는가, 미국이 설계한 함정이었는가. 확실한 것은 양쪽 모두에게 「상대가 거절할 수 없는 제안」보다 「상대가 거절해 주는 제안」이 정치적으로 쓸모 있는 순간이 있었다는 것이다.',
                            'One knot of the Cold War’s greatest dispute sits here: was the refusal a Soviet choice, or a trap of American design? What is certain is that, for both sides, there are moments when an offer the other refuses is politically more useful than an offer the other cannot refuse.'
                        ),
                    },
                    {
                        id: 'beria-question',
                        date: t('1953년 6월', 'June 1953'),
                        title: t('베리야 문제 — 개혁가인가 괴물인가', 'The Beria question — reformer or monster?'),
                        role: t(
                            '당신은 당 프레지디움(정치국) 위원이다. 흐루쇼프가 은밀히 당신을 찾아왔다.',
                            'You sit on the party Presidium (Politburo). Khrushchev has come to see you, quietly.'
                        ),
                        briefing: t(
                            '스탈린이 죽은 지 석 달. 그런데 가장 빠르게 움직이는 사람이 하필 베리야다 — 25년간 비밀경찰을 지휘하며 숙청을 집행한 바로 그 사람이, 지금 개혁안을 쏟아 내고 있다. 백만 명 사면, 「의사들의 음모」 사건 조작 인정과 피해자 복권, 고문 금지령, 민족 간부 등용, 심지어 「중립화된 통일 독일」 구상까지. 동독에서 6월 봉기가 터지자 그의 입지는 흔들렸지만, 그는 여전히 내무부와 경호 병력을 쥐고 있다. 흐루쇼프가 속삭인다 — 「저자가 우리 모두를 잡아넣기 전에 먼저 쳐야 하오. 주코프와 군이 함께할 거요.」 문제는, 그의 개혁안들이 대부분 옳아 보인다는 것이다.',
                            'Three months since Stalin died — and the man moving fastest is, of all people, Beria: twenty-five years at the head of the secret police, executioner of the purges, now pouring out reforms. An amnesty for a million prisoners; the “Doctors’ Plot” admitted as fabrication, its victims rehabilitated; torture banned; national cadres promoted; even a scheme for a neutralized, unified Germany. The June rising in East Germany has shaken his position — but he still holds the interior ministry and its troops. Khrushchev whispers: strike before he jails us all; Zhukov and the army are with us. The trouble is that most of his reforms look right.'
                        ),
                        question: t('흐루쇼프의 손을 잡는가?', 'Do you take Khrushchev’s hand?'),
                        options: [
                            o('arrest', 'radical',
                                '친다 — 프레지디움 회의장에서 군이 그를 체포한다',
                                'Strike — the army arrests him in the Presidium chamber itself',
                                '실제의 길. 6월 26일, 회의 도중 주코프와 무장 장교들이 들이닥쳐 베리야를 끌어냈다. 12월에 비밀 재판 뒤 총살 — 소련 최고 권력투쟁이 처형으로 끝난 마지막 사례가 된다.',
                                'The actual road. On June 26, mid-session, Zhukov and armed officers burst in and dragged Beria out. Shot in December after a secret trial — the last time a Soviet succession struggle ended in an execution.'),
                            o('balance', 'cautious',
                                '집단지도로 묶는다 — 그를 견제하되 제거하지 않는다',
                                'Bind him in collective leadership — check him, do not destroy him',
                                '말렌코프가 처음 기운 길이다. 그러나 「비밀경찰의 수장을 견제한다」는 말의 담보물이 무엇인지 아무도 답하지 못했다 — 서류함 속 동지들의 약점은 전부 그의 것이었다.',
                                'Where Malenkov first leaned. But no one could say what collateral backs the phrase “checking the chief of the secret police” — every comrade’s compromising file was his.'),
                            o('back-reforms', 'reform',
                                '개혁을 받는다 — 안(案)이 옳다면 제안자와도 함께 간다',
                                'Back the reforms — if the measures are right, work with the man who moved them',
                                '아무도 조직하지 않은 길. 베리야의 개혁안 다수는 그가 죽은 뒤 흐루쇼프의 이름으로 실행되었다 — 사면도, 복권도, 해빙도. 제안은 살고 제안자는 죽는, 승계 정치의 문법이다.',
                                'The road nobody organized. Most of Beria’s measures were carried out after his death under Khrushchev’s name — the amnesties, the rehabilitations, the thaw itself. The proposal survives, the proposer does not: the grammar of succession politics.'),
                        ],
                        actualId: 'arrest',
                        outcome: t(
                            '베리야는 체포되어 「영국 간첩」이라는, 그 자신이 수없이 만들어 냈던 종류의 죄목으로 처형되었다. 그러나 진짜 분수령은 그다음이다 — 이후의 패자들은 더 이상 죽지 않았다. 말렌코프는 발전소 소장으로, 몰로토프는 몽골 대사로 좌천되었을 뿐이다. 권력투쟁에서 지는 것과 목숨을 잃는 것이 분리된 순간, 소련 정치의 문법이 바뀌었다.',
                            'Beria was arrested and shot as a “British spy” — exactly the species of charge he had manufactured countless times himself. But the real watershed came after: the losers stopped dying. Malenkov was demoted to run a power station, Molotov sent to Mongolia as ambassador. The moment losing a power struggle and losing one’s life came apart, the grammar of Soviet politics changed.'
                        ),
                        ripple: t(
                            '수용소에서 죄수들이 돌아오기 시작한다. 그들의 이야기가 도시로 스며들수록 질문 하나가 커진다 — 이 모든 일을, 당은 언제까지 말하지 않을 것인가. 1956년 2월, 제20차 당대회가 소집된다.',
                            'Prisoners begin returning from the camps. As their stories seep into the cities, one question swells: how long will the party not speak of all this? In February 1956 the Twentieth Congress convenes.'
                        ),
                        insight: t(
                            '「개혁안이 옳은가」와 「제안자에게 권력을 줘도 되는가」는 다른 질문이다 — 이 장면은 둘을 일부러 충돌시킨다. 그리고 베리야 처형이 마지막 처형이 되었다는 사실은, 체제도 자신의 공포로부터 학습한다는 드문 증거로 읽힌다.',
                            '“Are the reforms right?” and “can the reformer be trusted with power?” are different questions — this scene collides them on purpose. And the fact that Beria’s was the last execution reads as rare evidence that even a system can learn from its own terror.'
                        ),
                    },
                ],
            },
            {
                id: 'era-2',
                range: t('1956–1964', '1956–1964'),
                title: t('제2부 · 해빙과 그 한계선', 'Part II · The thaw and its limits'),
                intro: t(
                    '진실을 절반 열고, 탱크로 절반 닫는다 — 개혁하는 제국의 자기모순이 드러난다.',
                    'Half-opening the truth, half-closing it with tanks — the self-contradiction of a reforming empire comes into view.'
                ),
                episodes: [
                    {
                        id: 'secret-speech',
                        date: t('1956년 2월', 'February 1956'),
                        title: t('비밀연설 — 판도라의 상자', 'The Secret Speech — Pandora’s box'),
                        role: t(
                            '당신은 제20차 당대회를 앞둔 프레지디움 위원이다.',
                            'You sit on the Presidium on the eve of the Twentieth Congress.'
                        ),
                        briefing: t(
                            '흐루쇼프가 폭탄을 탁자에 올렸다 — 당대회 비공개 회의에서 스탈린의 범죄를 보고하겠다는 것이다. 포스펠로프 위원회의 조사 결과는 참혹하다: 17차 당대회 중앙위원의 70%가 총살되었고, 자백은 고문으로 만들어졌다. 몰로토프·카가노비치·보로실로프가 격렬히 반대한다 — 「우리 모두 그 서류에 서명했다. 스탈린을 치는 것은 당의 30년을 치는 것이고, 적들에게 무기를 주는 것이다.」 흐루쇼프의 답: 「수용소에서 사람들이 돌아오고 있다. 대의원들이 먼저 듣지 않으면, 우리는 진실의 주인이 아니라 진실의 피고가 된다.」',
                            'Khrushchev has laid the bomb on the table: a report on Stalin’s crimes to a closed session of the congress. The Pospelov commission’s findings are hideous — seventy percent of the Central Committee elected in 1934 shot, the confessions manufactured by torture. Molotov, Kaganovich and Voroshilov object furiously: we all signed those papers; to strike Stalin is to strike thirty years of the party, and to hand our enemies a weapon. Khrushchev’s answer: people are coming back from the camps. If the delegates do not hear it first, we become not the owners of this truth but its defendants.'
                        ),
                        question: t('보고를 표결에 부친다. 당신은?', 'The report is put to a vote. You?'),
                        options: [
                            o('expose', 'reform',
                                '보고한다 — 진실을 당이 먼저 말해야 당이 산다',
                                'Deliver it — the party survives only by speaking the truth first',
                                '실제의 길. 2월 25일 새벽, 대의원들은 침묵 속에서 네 시간의 보고를 들었다. 회의장에서 실신자가 나왔다는 기록이 전한다.',
                                'The actual road. In the small hours of February 25 the delegates heard the four-hour report in silence; accounts tell of some fainting in the hall.'),
                            o('silence', 'cautious',
                                '침묵한다 — 복권은 조용히 진행하되 이름은 건드리지 않는다',
                                'Keep silent — rehabilitate quietly, touch no names',
                                '몰로토프·카가노비치의 길. 「관 속의 스탈린은 우리 편이지만, 재판정의 스탈린은 우리를 증인석에 세운다」는 계산이었다. 두 사람은 이듬해 흐루쇼프 축출을 시도하다 실패해 당에서 밀려난다.',
                                'Molotov’s and Kaganovich’s road: Stalin in his coffin is our ally; Stalin in the dock puts us on the witness stand. The next year both tried to oust Khrushchev, failed, and were pushed out of the leadership.'),
                            o('partial', 'radical',
                                '절반만 연다 — 「개인숭배」만 비판하고 문서고는 봉인한다',
                                'Open it halfway — criticize the “cult of personality,” seal the archives',
                                '실제 이후의 공식 노선에 가장 가까운 길이다. 비밀연설 자체가 정확히 이 선에서 멈췄다 — 스탈린의 범죄는 말하되, 1937년까지의 체제 형성과 살아 있는 지도부의 몫은 말하지 않는 것.',
                                'Closest to what the official line became anyway: the Secret Speech itself stopped precisely at this boundary — naming Stalin’s crimes, but not the making of the system before 1937, nor the share of the leaders still living.'),
                        ],
                        actualId: 'expose',
                        outcome: t(
                            '연설은 「비밀」로 남지 못했다 — 당 조직을 타고 낭독되었고, 폴란드에서 유출되어 몇 달 만에 전 세계가 읽었다. 수백만이 복권되었고 수용소 제국이 축소되었다. 그러나 흐루쇼프가 연 것은 조절 밸브가 아니라 판도라의 상자였다 — 「스탈린이 범죄자라면, 그를 만든 체제는 무엇인가」라는 질문에는 답이 준비되어 있지 않았다. 서방의 공산당들은 탈당 사태를 겪었고, 마오는 「수정주의」의 증거로 접수했다.',
                            'The speech did not stay secret — read down the party chain, leaked through Poland, it was read worldwide within months. Millions were rehabilitated; the camp empire shrank. But what Khrushchev had opened was not a control valve — it was Pandora’s box, and for the question “if Stalin was a criminal, what is the system that made him?” no answer had been prepared. Western communist parties bled members; Mao filed it away as proof of revisionism.'
                        ),
                        ripple: t(
                            '충격파는 진영의 가장 약한 고리에서 정치가 된다. 6월 포즈난에서 노동자들이 총에 맞고, 10월 폴란드가 고무우카로 흔들리고 — 부다페스트에서 학생들이 거리로 나온다.',
                            'The shockwave turns political at the bloc’s weakest links: workers shot in Poznań in June, Poland teetering into Gomułka in October — and in Budapest, students take to the streets.'
                        ),
                        insight: t(
                            '「제한된 진실 공개」는 통치술의 오랜 꿈이지만, 이 장면은 그 꿈의 반증 사례로 읽힌다 — 진실은 배급량을 지키지 않는다. 공개는 언제나 공개한 쪽의 통제를 넘어 번진다.',
                            'Rationed truth-telling is an old dream of statecraft, and this scene is read as its refutation: truth does not respect its ration. Disclosure always spreads past the discloser’s control.'
                        ),
                    },
                    {
                        id: 'hungary-1956',
                        date: t('1956년 10월 31일', 'October 31, 1956'),
                        title: t('부다페스트 — 탱크를 돌릴 것인가', 'Budapest — turn the tanks around?'),
                        role: t(
                            '당신은 프레지디움 위원이다. 이틀 전 당신들은 철군에 합의했었다.',
                            'You sit on the Presidium. Two days ago you agreed to withdraw.'
                        ),
                        briefing: t(
                            '헝가리 봉기 일주일째. 개혁파 너지 임레가 총리가 되었고, 소련군은 부다페스트에서 일단 철수했다. 어제 프레지디움은 「사회주의 국가 간 평등」 선언까지 채택했다 — 폴란드처럼 타협으로 끝나는 듯했다. 그런데 오늘 상황이 뒤집혔다. 부다페스트에서 비밀경찰 요원들이 군중에게 처형당했고, 너지는 다당제 부활과 바르샤바조약 탈퇴·중립화를 선언할 태세다. 수에즈 위기로 서방은 분열해 있다 — 영·프가 이집트를 치는 지금, 세계의 눈은 갈라져 있다. 미코얀은 여전히 반대한다: 「무력은 이제 우리가 쓸 수단이 아니다.」 흐루쇼프가 밤새 뒤척이다 말한다: 「철수하면 제국주의자들은 우리를 약하다고 읽을 것이다. 이집트에 헝가리까지 내줄 수는 없다.」',
                            'Day seven of the Hungarian rising. The reformer Imre Nagy is premier; Soviet troops have pulled out of Budapest. Only yesterday the Presidium adopted a declaration on “equality among socialist states” — a Polish-style compromise seemed near. Today everything has flipped: secret-police men lynched by crowds in Budapest, and Nagy ready to declare multi-party rule, withdrawal from the Warsaw Pact, neutrality. The West is split by Suez — with Britain and France striking Egypt, the world’s gaze is divided. Mikoyan still objects: force is no longer an instrument we can use. Khrushchev, after a sleepless night: if we pull out, the imperialists will read us as weak. We cannot hand them Hungary on top of Egypt.'
                        ),
                        question: t('두 번째 개입 — 표결한다. 당신은?', 'The second intervention is put to the vote. You?'),
                        options: [
                            o('invade', 'radical',
                                '개입한다 — 바르샤바조약 탈퇴는 넘을 수 없는 선이다',
                                'Intervene — leaving the Warsaw Pact is the line that cannot be crossed',
                                '실제의 길. 11월 4일 「회오리바람 작전」으로 소련군이 재진입해 열흘 만에 봉기를 진압했다. 흐루쇼프 자신의 말이 전한다 — 「부다페스트는 내 신발 속의 못이었다.」',
                                'The actual road. On November 4, Operation Whirlwind re-entered Hungary and crushed the rising within days. Khrushchev’s own words survive: Budapest was a nail in my shoe.'),
                            o('negotiate', 'reform',
                                '너지와 협상한다 — 중립 헝가리를 받아들이고 「핀란드화」를 실험한다',
                                'Negotiate with Nagy — accept a neutral Hungary, try “Finlandization”',
                                '너지가 마지막까지 기대었던 길이고, 훗날 1989년에 실제로 실현되는 길이다. 1956년의 프레지디움에는 「하나를 내주면 진영 전체가 풀린다」는 도미노 공포가 그것을 눌렀다.',
                                'The road Nagy leaned on to the end — and the one that did come true in 1989. In the Presidium of 1956 it was crushed by domino fear: yield one, and the whole camp unravels.'),
                            o('wait-out', 'cautious',
                                '관망한다 — 철군을 유지하고 폴란드식 타협이 익기를 기다린다',
                                'Wait it out — hold the withdrawal, let a Polish-style compromise ripen',
                                '이틀 전까지의 실제 노선이다. 10월 30일의 선언이 그 문서적 증거로 남아 있다 — 역사가들이 「가지 않은 길」의 실재를 다툴 때 가장 자주 꺼내는 종이다.',
                                'The actual line until two days before — the October 30 declaration remains its documentary trace, the paper historians reach for most often to prove this road really existed.'),
                        ],
                        actualId: 'invade',
                        outcome: t(
                            '소련군 재진입으로 약 2,500명의 헝가리인이 죽고 20만이 서방으로 탈출했다. 너지는 유고 대사관에서 안전 보장을 믿고 나왔다가 납치되었고, 1958년 비밀 재판 끝에 처형되었다. 카다르의 「정상화」가 시작되었다. 서방은 항의했으나 움직이지 않았다 — 해방 선전과 달리, 미국은 진영선 너머에서 싸울 뜻이 없음이 확인되었다.',
                            'The re-entry killed some 2,500 Hungarians; 200,000 fled west. Nagy left the Yugoslav embassy under a promise of safe conduct, was abducted, and was hanged in 1958 after a secret trial. Kádár’s “normalization” began. The West protested and did not move — whatever the liberation rhetoric, America would not fight across the line of the camps.'
                        ),
                        ripple: t(
                            '진영의 규칙이 판례로 굳었다: 내부 개혁은 참아도 이탈은 탱크다. 12년 뒤 프라하가 이 판례를 시험하고, 33년 뒤 고르바초프가 이 판례를 폐기한다 — 그러자 진영 자체가 사라진다.',
                            'The bloc’s rule hardened into precedent: internal reform may be tolerated; exit means tanks. Twelve years on, Prague tests the precedent; thirty-three years on, Gorbachev repeals it — and the bloc itself vanishes.'
                        ),
                        insight: t(
                            '해빙의 설계자가 해빙의 진압자가 되었다 — 위선이라기보다, 「개혁하되 통제한다」는 기획 자체의 모순이 무력으로 표출된 것이다. 개혁하는 제국은 언제나 이 장면으로 되돌아온다.',
                            'The architect of the thaw became its enforcer — less hypocrisy than the contradiction of the project itself, “reform under control,” surfacing as force. Every reforming empire returns to this scene.'
                        ),
                    },
                    {
                        id: 'cuba-1962',
                        date: t('1962년 10월 27일', 'October 27, 1962'),
                        title: t('카리브해의 13일 — 물러설 것인가', 'Thirteen days — back down?'),
                        role: t(
                            '당신은 흐루쇼프다. 토요일 밤, 노보-오가료보의 집무실.',
                            'You are Khrushchev. Saturday night, at the dacha outside Moscow.'
                        ),
                        briefing: t(
                            '쿠바에 배치한 미사일을 미국이 찾아냈고, 케네디는 해상 봉쇄를 선포했다. 오늘이 최악의 하루였다 — U-2 정찰기가 쿠바 상공에서 현지 방공부대에 격추되어 조종사가 죽었고, 또 다른 U-2는 시베리아 영공을 침범했으며, 봉쇄선의 소련 잠수함은 미군의 폭뢰 시위에 시달리고 있다(그 함내에 핵어뢰가 있다는 것을 당신은 안다). 카스트로는 「침공이 임박했다, 선제 핵공격을 각오하라」는 전보를 보내왔다. 케네디의 비공식 제안이 도착해 있다: 미사일을 철수하면 쿠바를 침공하지 않겠다 — 그리고 동생 로버트를 통한 밀약으로, 터키의 주피터 미사일도 몇 달 뒤 조용히 빼겠다. 단, 터키 건은 공개하면 없던 일이 된다. 군부는 격앙해 있고, 세계는 시계를 보고 있다.',
                            'America has found the missiles in Cuba, and Kennedy has declared a naval quarantine. Today was the worst day yet: a U-2 shot down over Cuba by local air defence, its pilot dead; another U-2 straying over Siberia; a Soviet submarine on the quarantine line harassed by signalling depth charges — and you know there is a nuclear torpedo aboard. Castro cables that invasion is imminent: be ready to strike first. Kennedy’s offer has arrived: withdraw the missiles and America will not invade Cuba — and, through his brother, a secret codicil: the Jupiters in Turkey will quietly leave within months. But publish the Turkish clause and it dies. The generals are seething. The world is watching the clock.'
                        ),
                        question: t('일요일 아침 방송에 내보낼 답은?', 'What answer goes out on Sunday morning’s broadcast?'),
                        options: [
                            o('deal', 'cautious',
                                '철수한다 — 쿠바 불침공 약속을 받고, 터키 밀약은 삼킨다',
                                'Withdraw — take the no-invasion pledge, swallow the Turkish deal in silence',
                                '실제의 길. 협상이 케네디의 통제 밖으로 넘어가기 전에, 흐루쇼프는 라디오 모스크바로 철수를 공개 발표해 버렸다 — 답신이 외교 경로를 도는 시간조차 위험했기 때문이다.',
                                'The actual road. Khrushchev announced the withdrawal over Radio Moscow before events slipped out of Kennedy’s control — even the hours a cable would take to travel felt dangerous.'),
                            o('escalate', 'radical',
                                '버틴다 — 봉쇄를 시험하고, 침공하면 베를린에서 되갚는다',
                                'Hold firm — test the quarantine; if they invade, answer in Berlin',
                                '군부 일각과 카스트로의 기대. 미국이 몰랐던 것이 있다 — 쿠바에는 이미 전술핵이 반입되어 있었고, 침공은 핵전쟁의 방아쇠가 될 뻔했다는 사실은 수십 년 뒤에야 문서로 확인된다.',
                                'What some of the military and Castro hoped for. America did not know that tactical nuclear weapons were already on the island; that an invasion would likely have triggered nuclear war was confirmed by documents only decades later.'),
                            o('un-track', 'reform',
                                '공개 협상으로 돌린다 — 유엔 중재 아래 터키·쿠바 동시 철수를 요구한다',
                                'Go public — demand a UN-brokered, simultaneous Turkey-for-Cuba swap',
                                '흐루쇼프가 27일 아침의 「두 번째 편지」에서 실제로 띄운 안이다. 케네디는 공개 맞교환은 거부했다 — 나토가 흔들린다는 이유로. 공개된 대칭 대신, 비공개의 대칭이 성사된 셈이다.',
                                'Exactly what Khrushchev floated in his “second letter” that Saturday morning. Kennedy refused a public swap — it would shake NATO. What was struck instead was the same symmetry, in private.'),
                        ],
                        actualId: 'deal',
                        outcome: t(
                            '10월 28일 아침, 라디오 모스크바가 철수를 발표했다. 세계는 숨을 내쉬었다. 쿠바 불침공 약속은 지켜졌고, 주피터는 이듬해 조용히 터키를 떠났으며, 모스크바–워싱턴 핫라인과 부분핵실험금지조약(1963)이 뒤따랐다. 그러나 밀약은 밀약이었기에, 세계가 본 것은 「흐루쇼프가 굴복했다」는 그림뿐이었다 — 베이징은 「모험주의에 이은 투항주의」라고 조롱했고, 소련 군부는 「다시는 열세로 협상하지 않는다」며 사상 최대의 핵 증강에 들어갔다.',
                            'On the morning of October 28, Radio Moscow announced the withdrawal, and the world exhaled. The no-invasion pledge held; the Jupiters quietly left Turkey the next year; the hotline and the Partial Test Ban Treaty (1963) followed. But a secret deal is secret: what the world saw was only Khrushchev capitulating. Beijing jeered — adventurism, then capitulationism; and the Soviet military, vowing never again to bargain from weakness, began the largest nuclear buildup in history.'
                        ),
                        ripple: t(
                            '세계를 구한 결정이 결정자를 잡아먹는다 — 2년 뒤 프레지디움 동료들은 흐루쇼프를 「경솔한 모험주의」 목록으로 탄핵하고 연금(年金)으로 밀어낸다. 쿠바가 그 목록의 첫 줄이었다. 다음 시대의 표어는 「안정」이다.',
                            'The decision that saved the world devours the decider: two years later his Presidium colleagues indict Khrushchev on a list of “hare-brained adventures” — Cuba at the top — and retire him on a pension. The next era’s watchword is stability.'
                        ),
                        insight: t(
                            '물러선 쪽이 세계를 구했고, 물러섰기에 권력을 잃었다 — 억지 이론이 다루지 못하는 「국내 청중 비용」의 고전적 사례다. 그리고 흐루쇼프는 침대에서 죽은 최초의 소련 최고지도자가 되었다: 그 자신이 만든, 패자가 죽지 않는 규칙의 수혜자로.',
                            'The side that backed down saved the world, and lost power for backing down — the classic case of the domestic audience costs deterrence theory struggles with. And Khrushchev became the first Soviet supreme leader to die in his bed: beneficiary of the rule he himself had made, that losers no longer die.'
                        ),
                    },
                ],
            },
            {
                id: 'era-3',
                range: t('1965–1985', '1965–1985'),
                title: t('제3부 · 안정의 대가', 'Part III · The price of stability'),
                intro: t(
                    '흔들지 않는 것을 통치의 원리로 삼은 20년 — 위기는 사라진 것이 아니라 이자를 붙이며 이월된다.',
                    'Twenty years of rule by not rocking the boat — the crises do not disappear; they roll over, compounding interest.'
                ),
                episodes: [
                    {
                        id: 'kosygin-reform',
                        date: t('1965년 9월', 'September 1965'),
                        title: t('코시긴 개혁 — 계획에 이윤을 심을 것인가', 'The Kosygin reform — plant profit inside the plan?'),
                        role: t(
                            '당신은 중앙위원회 전원회의를 앞둔 정치국원이다.',
                            'You are a Politburo member on the eve of the Central Committee plenum.'
                        ),
                        briefing: t(
                            '흐루쇼프를 밀어낸 지 1년, 새 지도부 앞에 경제 보고서가 놓여 있다. 성장률은 5개년 계획마다 떨어지고 있고, 공장들은 「총생산량」 지표를 채우려 아무도 사지 않는 물건을 찍어 낸다. 하리코프의 경제학자 리베르만이 프라우다에 던진 제안이 논쟁을 일으킨 지 3년 — 기업을 총량이 아니라 이윤과 판매로 평가하고, 경영에 자율을 주자는 것이다. 총리 코시긴이 이 안을 다듬어 전원회의에 올렸다. 반론도 만만치 않다: 「이윤은 자본주의의 범주다. 기업 자율은 계획의 통제를 허문다 — 그리고 통제를 허문 곳에서 무슨 일이 벌어지는지는 유고슬라비아가 보여 주지 않는가.」 다른 쪽 구석에서는 사이버네틱스 학자들이 전혀 다른 답을 내민다: 시장으로 갈 것이 아니라, 전국 컴퓨터망(OGAS)으로 계획을 실시간화하자는 것이다.',
                            'A year after Khrushchev’s removal, an economic report lies before the new leadership. Growth falls with every five-year plan; factories chase the gross-output target by producing goods nobody buys. Three years ago the Kharkov economist Liberman lit a debate in Pravda: judge enterprises by profit and sales, not tonnage, and give managers autonomy. Premier Kosygin has refined it into a motion for the plenum. The objections are serious: profit is a category of capitalism; enterprise autonomy erodes the plan’s control — and Yugoslavia shows what happens where control erodes. And from another corner, the cyberneticians offer an entirely different answer: not the market, but a national computer network (OGAS) to run the plan in real time.'
                        ),
                        question: t('전원회의에서 어느 안을 미는가?', 'Which motion do you push at the plenum?'),
                        options: [
                            o('reform-deep', 'reform',
                                '개혁을 끝까지 — 이윤 지표에 가격 자유화까지 얹는다',
                                'Reform all the way — profit indicators plus price liberalization',
                                '체코의 오타 시크, 헝가리의 「신경제 메커니즘」(1968)이 실제로 걸어간 길. 소련 안에서는 이 길을 공개적으로 조직한 세력이 없었다 — 1968년 이후에는 그 단어 자체가 위험해진다.',
                                'The road actually walked by Ota Šik in Czechoslovakia and Hungary’s New Economic Mechanism (1968). Inside the USSR no force openly organized for it — and after 1968 the very vocabulary became dangerous.'),
                            o('reform-capped', 'cautious',
                                '제한 도입 — 이윤 지표는 받되 가격과 인사는 중앙이 쥔다',
                                'Adopt it capped — take the profit indicator, keep prices and appointments central',
                                '실제의 길. 개혁은 화려하게 출발했으나, 가격이 통제된 채의 「이윤」은 회계 게임이 되었고, 성과가 좋은 기업은 계획 목표만 상향당했다 — 자율의 벌금. 개혁은 집행 과정에서 형해화된다.',
                                'The actual road. Launched with fanfare — but “profit” under controlled prices became an accounting game, and successful firms were simply assigned higher targets: a fine levied on autonomy. The reform was hollowed out in execution.'),
                            o('ogas', 'radical',
                                '시장이 아니라 기계로 — 전국 계획 전산망(OGAS)에 정면 투자한다',
                                'Not the market but the machine — invest head-on in the national planning network (OGAS)',
                                '글루시코프의 실제 제안. 우주 계획급 예산이 든다는 계산과, 정보 독점을 잃게 될 부처·통계기관의 저항 속에 각료회의에서 잘려 나갔다. 「계획경제의 인터넷」은 설계도로만 남았다.',
                                'Glushkov’s actual proposal. Costed at the scale of the space programme, and resisted by ministries and statistical agencies unwilling to lose their monopoly on information, it was cut down in the Council of Ministers. The “internet of the planned economy” survived only as blueprints.'),
                        ],
                        actualId: 'reform-capped',
                        outcome: t(
                            '제한된 개혁조차 처음에는 통했다 — 제8차 5개년 계획(1966–70)은 전후 최고의 성적을 냈다. 그러나 1968년 프라하의 봄이 「경제 개혁은 정치 개혁의 앞문」이라는 공포를 확정하자, 개혁은 소리 없이 회수되었다. 마침 서시베리아에서 초대형 유전이 터졌다(사모틀로르, 1965년 발견). 개혁 없이도 달러가 들어오는 나라가 되자, 개혁의 이유 자체가 증발했다 — 석유가 개혁의 대체재가 된 것이다.',
                            'Even the capped reform worked at first — the Eighth Five-Year Plan (1966–70) posted the best postwar numbers. But when the Prague Spring of 1968 confirmed the fear that economic reform is the front door to political reform, the reform was quietly withdrawn. And just then the supergiant oilfields of Western Siberia came in (Samotlor, discovered 1965). A country that earned dollars without reforming lost the very reason to reform — oil became the substitute for it.'
                        ),
                        ripple: t(
                            '「손대지 않는다」가 통치 원리가 된 나라에서, 이웃 체코슬로바키아가 정확히 반대 방향으로 달리기 시작한다 — 검열 폐지, 당내 민주화, 「인간의 얼굴을 한 사회주의」.',
                            'In a country whose ruling principle is now “touch nothing,” neighbouring Czechoslovakia starts running the opposite way — censorship abolished, the party democratized, “socialism with a human face.”'
                        ),
                        insight: t(
                            '실패한 개혁의 해부는 대개 「반대파」가 아니라 집행에서 발견된다 — 가격 없는 이윤, 벌금이 되는 성과. 그리고 자원 횡재가 개혁 유인을 죽이는 이 구도는 훗날 「자원의 저주」라는 이름을 얻는다.',
                            'The autopsy of a failed reform usually finds the cause not in its enemies but in its execution — profit without prices, success taxed with higher targets. And the pattern of a resource windfall killing the incentive to reform would later earn a name: the resource curse.'
                        ),
                    },
                    {
                        id: 'prague-1968',
                        date: t('1968년 8월', 'August 1968'),
                        title: t('프라하의 봄 — 인간의 얼굴이라는 위협', 'The Prague Spring — the menace of a human face'),
                        role: t(
                            '당신은 정치국원이다. 브레즈네프가 밤새 두브체크와 통화한 뒤다.',
                            'You are on the Politburo, the morning after Brezhnev’s all-night phone call with Dubček.'
                        ),
                        briefing: t(
                            '체코슬로바키아의 새 지도자 두브체크는 반란자가 아니다 — 당이 뽑은 제1서기이고, 바르샤바조약 탈퇴는 입에 담은 적도 없다. 그가 한 일은 검열 폐지, 희생자 복권, 「인간의 얼굴을 한 사회주의」 강령이다. 그래서 더 어렵다: 헝가리 때처럼 「반혁명 폭동」이라 부를 거리 사진이 없다. 그러나 KGB 보고서는 경고한다 — 검열 없는 신문이 당의 과거를 파헤치기 시작했고, 이 「전염병」은 이미 우크라이나와 발트로 스며들고 있다. 울브리히트와 고무우카는 강경 진압을 재촉한다. 반대편에는 다른 계산이 있다: 데탕트가 무르익고 있고, 침공은 서방과의 관계와 세계 공산주의 운동을 대가로 치를 것이다. 두브체크는 통화에서 또 약속했다 — 「통제하고 있습니다.」 믿을 것인가.',
                            'Dubček is no rebel — he is the First Secretary the party itself elected, and he has never breathed a word about leaving the Warsaw Pact. What he has done: abolished censorship, rehabilitated victims, proclaimed “socialism with a human face.” Which makes it harder: unlike Hungary, there are no street photographs to caption “counter-revolutionary riot.” But the KGB reports warn: uncensored newspapers have begun digging into the party’s past, and the contagion is already seeping into Ukraine and the Baltics. Ulbricht and Gomułka press for force. On the other side, another calculation: détente is ripening, and an invasion will be paid for in relations with the West and in the world communist movement. On the phone, Dubček promised again: everything is under control. Believe him?'
                        ),
                        question: t('정치국 표결. 당신은?', 'The Politburo votes. You?'),
                        options: [
                            o('invade', 'radical',
                                '개입한다 — 사회주의 진영 전체의 이익이 개별국 주권에 앞선다',
                                'Intervene — the interests of the whole socialist camp override any one state’s sovereignty',
                                '실제의 길. 8월 20일 밤 바르샤바조약 5개국 50만 병력이 국경을 넘었다. 이 논리는 곧 「브레즈네프 독트린」이라는 이름을 얻는다.',
                                'The actual road. On the night of August 20, half a million troops of five Warsaw Pact states crossed the border. The logic soon acquired a name: the Brezhnev Doctrine.'),
                            o('squeeze', 'cautious',
                                '침공 없이 조인다 — 주둔 협상, 경제 압박, 당내 보수파 지원으로 서서히 되감는다',
                                'Squeeze without invading — basing talks, economic pressure, backing the party’s hardliners to wind it back slowly',
                                '여름 내내 실제로 가동된 길이다 — 치에르나 회담, 국경의 기동훈련, 반(反)두브체크파 규합. 침공 결정은 이 압박이 「먹히지 않는다」는 판정과 함께 내려졌다.',
                                'The road actually worked all summer — the Čierna talks, manoeuvres on the border, the cultivation of anti-Dubček hardliners. The invasion order came with the verdict that the squeeze was not working.'),
                            o('tolerate', 'reform',
                                '실험을 허용한다 — 조약 잔류를 담보로 받고 내정은 각국의 길에 맡긴다',
                                'Tolerate the experiment — take Pact membership as the guarantee, leave the domestic road to each country',
                                '유고·루마니아와 서방 공산당들이 요구한 길이고, 20년 뒤 고르바초프가 채택하는 바로 그 원칙이다. 1968년의 정치국에서 이것은 「전염」의 다른 이름이었다.',
                                'What Yugoslavia, Romania and the Western communist parties demanded — and precisely the principle Gorbachev would adopt twenty years later. In the Politburo of 1968 it was another name for contagion.'),
                        ],
                        actualId: 'invade',
                        outcome: t(
                            '군사적으로는 완벽했고 정치적으로는 파산이었다. 체코슬로바키아군은 저항하지 않았지만 시민들은 도로 표지판을 돌려놓고 탱크를 토론으로 에워쌌다. 연행된 두브체크는 서명을 강요당한 뒤 서서히 제거되었고(마지막 직장은 산림청이었다), 「정상화」가 20년간 나라를 얼렸다. 서유럽 공산당들은 처음으로 모스크바를 공개 규탄했고(유로코뮤니즘의 출발점), 붉은 광장에서는 여덟 명이 「당신들과 우리의 자유를 위하여」라는 현수막을 들었다 — 그들은 몇 분 만에 체포되었다.',
                            'Militarily flawless, politically bankrupt. The Czechoslovak army did not resist; citizens turned the road signs around and surrounded the tanks with arguments. Dubček, abducted and forced to sign, was then removed by degrees — his last posting was the forestry administration — and “normalization” froze the country for twenty years. The Western European parties condemned Moscow openly for the first time (the seed of Eurocommunism), and on Red Square eight people raised a banner — “For your freedom and ours.” They were arrested within minutes.'
                        ),
                        ripple: t(
                            '국내의 개혁 담론도 함께 매장되었다 — 코시긴 개혁의 잔재가 정리되고, 사하로프 등 지식인들이 체제와 갈라선다(반체제 운동의 탄생). 「사회주의는 개혁 불가능하다」는 명제가 이날 동유럽 수백만의 머릿속에 등록되었다.',
                            'The reform conversation at home was buried in the same grave — what remained of the Kosygin reform was wound up, and intellectuals like Sakharov broke with the system (the birth of the dissident movement). The proposition “socialism cannot be reformed” was registered that day in millions of East European minds.'
                        ),
                        insight: t(
                            '헝가리(이탈)와 달리 프라하는 「충성스러운 개혁」이었다 — 그래서 이 진압은 진영의 규칙을 한 단계 좁혔다: 이탈만이 아니라 개혁 자체가 금지선이 된 것이다. 금지선이 좁아질수록, 터질 때는 한꺼번에 터진다.',
                            'Unlike Hungary (exit), Prague was loyal reform — so its crushing narrowed the bloc’s rule by one notch: not just exit but reform itself was now the forbidden line. And the narrower the line, the more total the eventual rupture.'
                        ),
                    },
                    {
                        id: 'afghanistan-1979',
                        date: t('1979년 12월', 'December 1979'),
                        title: t('아프가니스탄 — 국경 너머의 수렁', 'Afghanistan — the quagmire beyond the border'),
                        role: t(
                            '당신은 정치국원이다. 안건은 「A 문제」 — 회의록에조차 이름을 쓰지 않는다.',
                            'You are on the Politburo. The agenda item is “Question A” — its name is not written even in the minutes.'
                        ),
                        briefing: t(
                            '작년 4월 카불에서 좌파 장교들이 쿠데타로 집권한 뒤, 아프가니스탄은 수렁이 되어 가고 있다. 급진 개혁과 탄압이 농촌의 무장 반란을 키웠고, 집권당은 파벌 살육 중이다 — 9월에는 2인자 아민이 대통령 타라키를 목 졸라 죽였다. KGB 보고서는 아민을 「믿을 수 없는 자」로 찍는다: CIA와 접촉한다는 설, 미국으로 기울 수 있다는 설. 이란 혁명으로 미국이 중동 거점을 잃은 지금, 카불까지 내주면 남부 국경 전체가 흔들린다는 것이 안드로포프(KGB)·우스티노프(국방)·그로미코(외무)의 판단이다. 그러나 참모총장 오가르코프는 정면으로 반대한다: 「병력이 부족하고, 산악 게릴라전은 군이 훈련한 전쟁이 아니다.」 봄에 같은 안건이 올라왔을 때 코시긴도 잘라 말했었다 — 「파병만은 안 된다.」 브레즈네프는 병상에 가깝고, 결정은 사실상 서너 명의 손에 있다.',
                            'Since last April, when leftist officers seized Kabul in a coup, Afghanistan has been sliding into the mire. Radical reforms and repression have fed an armed rural revolt, and the ruling party is butchering its own factions — in September the number two, Amin, had President Taraki strangled. The KGB brief marks Amin “unreliable”: rumoured contacts with the CIA, a possible tilt to America. With Iran’s revolution costing Washington its foothold, Andropov (KGB), Ustinov (Defence) and Gromyko (Foreign Affairs) reason that losing Kabul too would unsettle the whole southern border. But Chief of Staff Ogarkov objects head-on: the forces are insufficient, and mountain guerrilla war is not the war this army trained for. When the question came up in spring, Kosygin was blunt: troops, never. Brezhnev is near his sickbed; the decision rests, in effect, with three or four men.'
                        ),
                        question: t('「A 문제」 — 당신의 표는?', '“Question A” — your vote?'),
                        options: [
                            o('invade', 'radical',
                                '제한 개입 — 아민을 제거하고 온건파를 세운 뒤 몇 달 안에 철수한다',
                                'Limited intervention — remove Amin, install moderates, withdraw within months',
                                '실제의 길. 12월 25일 제40군이 국경을 넘었고 특수부대가 대통령궁을 급습해 아민을 사살했다. 「몇 달」은 9년 2개월이 되었다.',
                                'The actual road. On December 25 the 40th Army crossed the border; special forces stormed the palace and killed Amin. “A few months” became nine years and two months.'),
                            o('advisers-only', 'cautious',
                                '파병 거부 — 고문단·무기·자금 지원선을 지킨다',
                                'No troops — hold the line at advisers, arms and money',
                                '오가르코프와 참모본부, 그리고 봄의 코시긴이 지킨 선이다. 「우리 군은 혁명을 수출하러 있는 것이 아니다」 — 이 반대는 회의록에 남았고, 예언이 되었다.',
                                'The line held by Ogarkov, the General Staff, and Kosygin in the spring. “Our army does not exist to export revolution” — the objection stayed in the record, and became prophecy.'),
                            o('deal-amin', 'reform',
                                '아민과 거래한다 — 믿을 수 없어도 그가 카불의 현실이다',
                                'Deal with Amin — untrustworthy, but he is the reality in Kabul',
                                '아민 자신이 소련군 「초청」을 반복 요청하며 매달린 길이다. KGB의 독법 — 「초청해 놓고 미국으로 넘어갈 자」 — 이 이 길을 막았다. 그 독법의 증거는 지금도 얇다.',
                                'The road Amin himself clung to, repeatedly requesting Soviet troops by “invitation.” The KGB’s reading — a man who would invite us in and then defect to America — closed it. The evidence for that reading remains thin to this day.'),
                        ],
                        actualId: 'invade',
                        outcome: t(
                            '「제한 개입」은 10년 전쟁이 되었다. 소련군 1만 5천이 죽고 아프가니스탄인은 백만 단위로 죽었으며 난민 500만이 국경을 넘었다. 미국·파키스탄·사우디가 무자헤딘에 무기를 대는 대리전이 되었고, 데탕트는 그 자리에서 사망했다 — 곡물 금수, 모스크바 올림픽 보이콧, 신냉전. 국내에서는 「국제주의적 의무」라는 공식 언어와 아연 관(棺)으로 돌아오는 아들들 사이의 간극이 벌어져 갔다.',
                            'The “limited intervention” became a ten-year war. Fifteen thousand Soviet soldiers died, Afghans died by the hundreds of thousands, five million refugees crossed the borders. It became a proxy war, with America, Pakistan and Saudi Arabia arming the mujahedin; détente died on the spot — grain embargo, the Moscow Olympics boycott, a new Cold War. At home, the gap widened between the official language of “internationalist duty” and the sons coming home in zinc coffins.'
                        ),
                        ripple: t(
                            '전비와 신냉전 군비가 정체된 경제를 누르는 사이, 지도부 자체가 소멸해 간다 — 브레즈네프(1982), 안드로포프(1984), 체르넨코(1985)가 3년 새 잇따라 죽는다. 정치국은 세 번째 장례식장에서 마침내 인정한다: 이대로는 안 된다.',
                            'As the war bill and the new arms race press down on a stagnant economy, the leadership itself dies off — Brezhnev (1982), Andropov (1984), Chernenko (1985), three funerals in three years. At the third, the Politburo finally concedes: not like this.'
                        ),
                        insight: t(
                            '노쇠한 최고지도자, 서너 명의 밀실 결정, 이름조차 쓰지 못하는 안건 — 아프가니스탄 결정은 「제도의 노화」가 어떻게 오판을 구조화하는지 보여 주는 표본으로 연구된다. 반대 의견은 존재했다. 그것이 결정에 닿을 통로가 없었을 뿐이다.',
                            'A failing supreme leader, a decision taken by three or four men behind closed doors, an agenda item too sensitive to name — the Afghanistan decision is studied as a specimen of how institutional senescence structures misjudgment. Dissent existed; it simply had no channel to the decision.'
                        ),
                    },
                ],
            },
            {
                id: 'era-4',
                range: t('1985–1991', '1985–1991'),
                title: t('제4부 · 개혁이 체제를 삼키다', 'Part IV · The reform devours the system'),
                intro: t(
                    '체제를 구하려던 개혁이 체제보다 커진다 — 그리고 1917년의 질문이 거울처럼 되돌아온다.',
                    'A reform meant to save the system outgrows it — and the question of 1917 returns, as in a mirror.'
                ),
                episodes: [
                    {
                        id: 'gorbachev-1985',
                        date: t('1985년 3월 10일', 'March 10, 1985'),
                        title: t('세 번째 장례식 — 누구를 세울 것인가', 'The third funeral — whom do we raise?'),
                        role: t(
                            '당신은 정치국원이다. 체르넨코가 오늘 저녁 죽었고, 회의는 내일 아침이다.',
                            'You are on the Politburo. Chernenko died this evening; the session is tomorrow morning.'
                        ),
                        briefing: t(
                            '3년 새 세 번째 서기장 장례식이다. 경제는 성장이 멈췄고, 아프가니스탄은 6년째이며, 미국은 「스타워즈」로 군비 경쟁의 판돈을 올리고 있다 — 서기국의 내부 보고서들은 이 경쟁을 지금 경제로는 따라갈 수 없다고 말한다. 후보는 셋으로 압축된다. 고르바초프, 54세 — 안드로포프가 키운 막내 정치국원, 정력적이고 언변이 좋으며, 지난해 런던에서 대처가 「거래할 수 있는 사람」이라 불렀다. 그리신, 70세 — 모스크바 당 서기, 현상 유지의 화신. 로마노프, 62세 — 레닌그라드와 군수산업의 사람, 규율과 강경의 카드. 어느 원로가 중얼거린다 — 「또 관을 메고 싶지 않으면 젊은 쪽이겠지. 그런데 저 젊은이가 무엇을 할지는 아무도 모르지 않나.」',
                            'The third General Secretary’s funeral in three years. Growth has stopped; Afghanistan is in its sixth year; America is raising the stakes with “Star Wars” — and the Secretariat’s own reports say this economy cannot match that race. The field narrows to three. Gorbachev, 54 — Andropov’s protégé, the youngest man in the room, energetic, articulate; in London last year Thatcher called him a man one can do business with. Grishin, 70 — Moscow party boss, incarnation of the status quo. Romanov, 62 — Leningrad and the defence industry, the card of discipline and rigour. One elder mutters: unless we want to carry another coffin, it must be the young one. But does anyone know what the young one will do?'
                        ),
                        question: t('내일 아침, 누구의 이름을 내는가?', 'Whose name do you put forward in the morning?'),
                        options: [
                            o('gorbachev', 'reform',
                                '고르바초프 — 세대를 교체하고 체제를 수리한다',
                                'Gorbachev — change the generation, repair the system',
                                '실제의 길. 외무장관 그로미코 — 최고참 보수파 — 가 직접 추천 연설에 나섰다: 「이 사람은 미소가 부드럽지만 이빨은 강철입니다.」 만장일치였다.',
                                'The actual road. It was Gromyko — the most senior of the conservatives — who gave the nominating speech: this man has a nice smile, but teeth of iron. The vote was unanimous.'),
                            o('grishin', 'cautious',
                                '그리신 — 검증된 안정, 흔들지 않는 손',
                                'Grishin — proven stability, a hand that rocks nothing',
                                '체르넨코 주변이 미련을 두던 카드. 그러나 「안정」은 방금 3년 연속 장례식이라는 성적표를 받은 참이었다. 그리신은 이듬해 모스크바 서기직에서 해임된다 — 후임은 옐친이었다.',
                                'The card Chernenko’s circle clung to. But “stability” had just been graded: three funerals in three years. Grishin lost Moscow the next year — his replacement was a man named Yeltsin.'),
                            o('romanov', 'radical',
                                '로마노프 — 군수산업과 규율로 조이는 강경 노선',
                                'Romanov — the hard line of the defence industry and discipline',
                                '「안드로포프식 조이기」의 연장선. 유리 우스티노프 사후 군부 후견을 잃은 그는 회의에서 밀렸고, 몇 달 뒤 「건강상 이유」로 은퇴당했다 — 고르바초프 인사의 첫 목록에 올라서.',
                                'The extension of Andropov-style tightening. His military patron Ustinov dead, he lost the room — and within months was retired “on health grounds,” first on the list of Gorbachev’s personnel changes.'),
                        ],
                        actualId: 'gorbachev',
                        outcome: t(
                            '고르바초프가 만장일치로 선출되었다. 처음 내건 것은 온건한 「가속화」였지만, 체르노빌(1986)이 은폐 체질의 비용을 폭로하자 처방이 근본으로 옮겨 갔다 — 글라스노스트(공개)와 페레스트로이카(개편), 그리고 1988년에는 경쟁 선거까지. 정치국의 계산은 「체제를 수리할 젊은 관리자」였다. 그들이 뽑은 것이 무엇이었는지는 6년 안에 판명된다.',
                            'Gorbachev was elected unanimously. He began with modest “acceleration” — but when Chernobyl (1986) exposed the price of a culture of concealment, the prescription went to the root: glasnost, perestroika, and by 1988 even competitive elections. The Politburo had ordered a young manager to repair the system. What they had actually chosen would become clear within six years.'
                        ),
                        ripple: t(
                            '새 서기장의 첫 시험은 정치국 회의장이 아니라 우크라이나의 원자력 발전소에서 온다 — 취임 13개월째의 어느 토요일 새벽, 체르노빌 4호기의 제어반 계기들이 미쳐 돌아가기 시작한다.',
                            'The new General Secretary’s first test comes not in the Politburo chamber but at a nuclear power station in Ukraine — one Saturday before dawn, thirteen months into his tenure, the instruments in the control room of Chernobyl’s reactor No. 4 begin to go mad.'
                        ),
                        insight: t(
                            '「체제가 스스로 개혁가를 뽑았다」는 이 장면은 붕괴 논쟁의 핵심 증거물이다 — 구조가 개혁을 강제했다는 쪽도, 고르바초프라는 우연이 결정적이었다는 쪽도, 같은 회의실을 가리킨다. 같은 사실이 두 개의 정반대 서사를 먹여 살린다.',
                            'That the system elected its own reformer is the key exhibit in the collapse debate — those who say structure compelled reform and those who say the accident named Gorbachev was decisive both point at the same room. One fact feeds two opposite narratives.'
                        ),
                    },
                    {
                        id: 'chernobyl-1986',
                        date: t('1986년 4월 28일', 'April 28, 1986'),
                        title: t('체르노빌 — 무엇을, 언제, 얼마나 말하는가', 'Chernobyl — what to say, when, and how much'),
                        role: t(
                            '당신은 정치국원이다. 사고 사흘째 아침, 스웨덴의 공식 문의가 외무부에 도착했다.',
                            'You are on the Politburo. On the third morning after the accident, Sweden’s official query has reached the Foreign Ministry.'
                        ),
                        briefing: t(
                            '토요일 새벽, 우크라이나의 체르노빌 원전 4호기가 시험 가동 중 폭발했다. 현지의 첫 보고는 「원자로는 건재, 방사선은 정상 범위」 — 그러나 정찰기가 찍어 온 사진에는 뚜껑이 날아간 노심이 하늘을 향해 타고 있다. 발전소 도시 프리퍄티의 주민 4만 9천 명은 사고 36시간이 지나서야 소개되었다. 그리고 오늘 아침, 1,200킬로미터 밖 스웨덴 포르스마르크 원전에서 출근하던 직원의 신발에서 방사능이 검출되었다 — 스톡홀름이 「귀국에서 무슨 일이 있었는가」를 공식으로 묻고 있다. 탁자 위에는 네 문장짜리 타스 발표문 초안이 놓여 있다. 사흘 뒤는 메이데이다 — 키예프의 퍼레이드를 취소하면 그 자체가 공황의 신호탄이 될 것이다. 글라스노스트를 선언한 지 1년이 되어 간다.',
                            'Before dawn on Saturday, reactor No. 4 at Chernobyl exploded during a test run. The first reports from the site: the reactor is intact, radiation within norms — but the reconnaissance photographs show the core, its lid blown off, burning open to the sky. The 49,000 residents of the plant town, Pripyat, were evacuated only 36 hours after the blast. And this morning, 1,200 kilometres away at Sweden’s Forsmark plant, radioactivity was detected on the shoes of a worker arriving for his shift — Stockholm is formally asking what has happened in your country. On the table lies a four-sentence draft for TASS. May Day is three days off — and cancelling the Kiev parade would itself be a starting gun for panic. It is nearly a year since glasnost was proclaimed.'
                        ),
                        question: t('정치국의 결정은?', 'What does the Politburo decide?'),
                        options: [
                            o('minimal', 'cautious',
                                '최소 발표 — 네 문장을 내보내고, 메이데이 퍼레이드는 예정대로 연다',
                                'Minimal statement — release the four sentences, hold the May Day parade as planned',
                                '실제의 길. 4월 28일 밤 타스는 「사고가 있었고 수습 중」이라는 짧은 발표를 냈고, 5월 1일 키예프의 퍼레이드는 낙진 속에 예정대로 열렸다. 고르바초프가 TV 앞에 선 것은 사고 18일 뒤였다.',
                                'The actual road. On the night of April 28 TASS issued a brief “an accident has occurred; measures are being taken”; on May 1 the Kiev parade went ahead under the fallout. Gorbachev faced the cameras eighteen days after the blast.'),
                            o('full-open', 'reform',
                                '전면 공개 — 오염 지도를 발표하고 소개를 확대하며 국제 지원을 요청한다',
                                'Full disclosure — publish the contamination maps, widen the evacuations, ask for international help',
                                '글라스노스트의 문자적 이행이자, 몇 달에 걸쳐 결국 단계적으로 채택된 길이다. 8월 빈의 IAEA 회의에서 소련 대표단은 이례적으로 상세한 보고서를 내놓아 세계를 놀라게 했다 — 처음부터 그랬다면 무엇이 달랐을지가 이 장면의 반사실이다.',
                                'Glasnost taken literally — and the road eventually adopted, by degrees, over the following months. At the IAEA conference in Vienna that August the Soviet delegation stunned the world with an unusually candid report. What would have differed had it begun that way is this scene’s counterfactual.'),
                            o('lockdown', 'radical',
                                '봉쇄한다 — 지역을 차단하고 유언비어를 단속하며, 서방 보도는 반소 선전으로 규정해 맞받는다',
                                'Seal it off — cordon the zone, prosecute “rumour-mongering,” and answer Western reports as anti-Soviet propaganda',
                                '체제의 오랜 기본기이자, 관영 매체가 처음 며칠 실제로 병행한 길이다 — 「서방이 과장 선전을 편다」. 문제는 방사능 구름이 국경 검문을 받지 않는다는 것이었다.',
                                'The system’s oldest reflex — and what the official media in fact ran in parallel for the first days: the West is peddling exaggerations. The trouble was that a radioactive cloud does not stop at border control.'),
                        ],
                        actualId: 'minimal',
                        outcome: t(
                            '은폐는 물리 법칙에 패배했다 — 방사능 구름이 발표문보다 먼저 유럽의 계측기에 도착했다. 발표는 짧았고 늦었으며, 키예프 시민들은 낙진 아래에서 행진했다. 불타는 노심을 덮은 것은 결국 헬기 조종사들과 60만 「리크비다토르(수습 작업자)」의 몸이었다. 그리고 정치적 낙진이 더 오래갔다: 국가가 말하는 것과 사람들이 겪는 것의 간극이 만천하에 드러나자, 고르바초프는 글라스노스트를 장식에서 수술칼로 바꿨다. 그 자신이 훗날 썼다 — 체르노빌이야말로 페레스트로이카의 진짜 출발점이었는지 모른다고.',
                            'The concealment lost to the laws of physics — the cloud reached Europe’s instruments before the communiqué did. The statement was short and late, and the people of Kiev marched under the fallout. What finally smothered the burning core were the bodies of helicopter pilots and 600,000 “liquidators.” And the political fallout outlasted the physical: with the gap between what the state said and what people lived through exposed to the world, Gorbachev turned glasnost from an ornament into a scalpel. He himself later wrote that Chernobyl, perhaps, was the real beginning of perestroika.'
                        ),
                        ripple: t(
                            '열린 언로는 원자로 다음에 문서고를 겨눈다 — 1937년, 몰로토프-리벤트로프 비밀 의정서, 카틴, 아프가니스탄의 아연 관들이 신문 1면으로 돌아온다. 우크라이나에서 체르노빌은 「중앙이 우리를 어떻게 다루는가」의 기억으로 남아 1991년의 독립 투표까지 흐른다. 그리고 진영의 가장 약한 고리들이 움직이기 시작한다.',
                            'Once opened, the channels of speech point past the reactor to the archives — 1937, the secret protocols, Katyn, the zinc coffins of Afghanistan return on front pages. In Ukraine, Chernobyl settles into memory as “how the centre treats us,” flowing on to the independence vote of 1991. And the weakest links of the bloc begin to move.'
                        ),
                        insight: t(
                            '사고와 은폐는 한 몸이었다 — RBMK 원자로의 결함은 앞선 사고들과 함께 기밀로 봉인되어 있었고, 운전원들은 자기 기계의 병력(病歷)을 모른 채 시험 버튼을 눌렀다. 비밀이 사고를 만들고, 사고가 비밀의 체제를 죽였다. 정보를 억누르는 비용은 장부에 늦게, 그리고 한꺼번에 계상된다.',
                            'The accident and the secrecy were one body: the RBMK reactor’s design flaws, like the accidents before it, were sealed as classified, and the operators pressed the test button not knowing their machine’s medical history. Secrecy made the accident, and the accident killed the regime of secrecy. The cost of suppressing information is booked late — and all at once.'
                        ),
                    },
                    {
                        id: 'autumn-1989',
                        date: t('1989년 10월', 'October 1989'),
                        title: t('1989년 가을 — 탱크는 가지 않는다', 'Autumn 1989 — the tanks stay home'),
                        role: t(
                            '당신은 고르바초프다. 동베를린, 동독 건국 40주년 기념식장.',
                            'You are Gorbachev, in East Berlin, at the fortieth-anniversary celebrations of the GDR.'
                        ),
                        briefing: t(
                            '진영이 한꺼번에 흔들리고 있다. 폴란드에서는 6월의 자유 선거에서 연대노조가 압승해 전후 첫 비공산 총리가 들어섰다. 헝가리는 오스트리아 국경의 철조망을 걷었고, 그 구멍으로 동독인 수만 명이 서쪽으로 빠져나가고 있다. 라이프치히에서는 매주 월요일 밤 시위가 불어난다 — 다음 월요일에는 10만이 모일 것이라 한다. 호네커는 「중국 동지들의 해법」을 공공연히 상찬한다 — 넉 달 전 톈안먼의 해법 말이다. 동독 주둔 소련군은 38만. 당신의 손에는 두 개의 선례가 있다: 1956년과 1968년의 탱크, 그리고 당신 자신이 유엔에서 한 약속 — 「선택의 자유는 예외 없는 원칙이다」(1988년 12월). 수행원이 묻는다: 라이프치히에서 발포가 시작되면, 우리 군은 어떻게 합니까?',
                            'The bloc is shaking all at once. In Poland, Solidarity swept June’s free elections and the first non-communist premier since the war has taken office. Hungary has cut the wire on the Austrian border, and tens of thousands of East Germans are pouring west through the gap. In Leipzig the Monday-night demonstrations swell — next Monday, they say, a hundred thousand. Honecker openly praises the “solution of our Chinese comrades” — Tiananmen, four months ago. There are 380,000 Soviet troops in Germany. In your hands, two precedents — the tanks of 1956 and 1968 — and your own promise at the UN: freedom of choice, a principle with no exceptions (December 1988). An aide asks: if the shooting starts in Leipzig, what do our troops do?'
                        ),
                        question: t('진영이 무너지기 시작했다. 소련의 원칙은?', 'The bloc has begun to fall. What is the Soviet principle?'),
                        options: [
                            o('no-intervene', 'reform',
                                '불개입 — 각국 인민의 선택에 맡기고, 소련군은 병영에 묶는다',
                                'No intervention — each people chooses; Soviet troops stay in barracks',
                                '실제의 길. 대변인 게라시모프가 훗날 이름을 붙였다 — 브레즈네프 독트린 대신 「시나트라 독트린」: 각자 자기 길을(My Way) 가게 하라.',
                                'The actual road. Spokesman Gerasimov later named it: in place of the Brezhnev Doctrine, the “Sinatra Doctrine” — let them do it their way.'),
                            o('intervene', 'radical',
                                '개입한다 — 동독은 진영의 초석이다, 여기가 마지노선이다',
                                'Intervene — the GDR is the keystone of the camp; this is the last line',
                                '진영 보수파(호네커, 체아우셰스쿠 — 그는 공개적으로 무력 개입을 촉구했다)의 기대. 소련군 38만이 실제로 그곳에 있었다 — 명령이 없었을 뿐이다. 이 선택지의 실재가 1989년의 무혈을 「기적」이 아니라 「결정」으로 만든다.',
                                'What the bloc’s hardliners hoped for (Honecker; Ceaușescu openly urged armed intervention). The 380,000 troops were really there — only the order never came. The reality of this option is what makes the bloodlessness of 1989 a decision, not a miracle.'),
                            o('managed', 'cautious',
                                '관리된 교체 — 개입 없이, 각국 당의 개혁파로 지도부를 갈아 블록을 존속시킨다',
                                'Managed succession — no intervention, but swap in reformist leaderships and preserve the bloc',
                                '크렘린이 실제로 병행하던 계산이다 — 호네커는 실각했고(10월 18일), 크렌츠·모드로프 같은 「개혁파」가 들어섰다. 그러나 대중은 더 이상 「개혁된 당」을 원하지 않았다. 교체는 유예가 아니라 가속이 되었다.',
                                'The calculation the Kremlin actually ran in parallel — Honecker fell (October 18), “reformers” like Krenz and Modrow came in. But the crowds no longer wanted a reformed party. The swap bought not a reprieve but an acceleration.'),
                        ],
                        actualId: 'no-intervene',
                        outcome: t(
                            '10월 9일 라이프치히의 7만 시위는 발포 없이 지나갔다 — 그리고 11월 9일 밤, 신임 지도부의 신임 대변인이 여행 자유화 발표문을 얼버무리는 사이(「즉시... 라고 알고 있습니다」), 베를린 장벽이 군중의 손에 열렸다. 몇 주 안에 프라하(벨벳 혁명), 소피아, 부쿠레슈티(이곳만은 유혈로)가 뒤따랐다. 12월 몰타에서 고르바초프와 부시는 냉전의 종언을 선언했다. 소련군 38만은 병영에서 나오지 않았다.',
                            'On October 9, seventy thousand marched in Leipzig and no one fired — and on the night of November 9, as the new leadership’s new spokesman fumbled the travel announcement (“immediately... as far as I know”), the Berlin Wall was opened by the crowd itself. Within weeks came Prague (the Velvet Revolution), Sofia, Bucharest (there alone, in blood). At Malta in December, Gorbachev and Bush declared the Cold War over. The 380,000 Soviet troops never left their barracks.'
                        ),
                        ripple: t(
                            '밖에서 세운 원칙이 안으로 되돌아온다 — 「선택의 자유」가 진영의 원칙이라면, 발트 3국은? 우크라이나는? 1990년 3월 리투아니아가 독립을 선언하고, 연방 자체가 다음 갈림길이 된다.',
                            'The principle proclaimed abroad turns homeward: if freedom of choice rules the bloc, what of the Baltic republics? Of Ukraine? In March 1990 Lithuania declares independence — and the Union itself becomes the next fork.'
                        ),
                        insight: t(
                            '제국은 대개 무력해서가 아니라 무력(武力)의 사용을 스스로 철회할 때 끝난다 — 1989년의 소련군은 패배한 적이 없다. 「쏠 수 있었으나 쏘지 않았다」는 사실이야말로, 이 책이 줄곧 물어 온 구조와 선택의 문제를 가장 순수한 형태로 보여 준다.',
                            'Empires usually end not from impotence but from the withdrawal of the will to use force — the Soviet army of 1989 was never defeated. That it could have fired and did not is the purest form of this book’s standing question about structure and choice.'
                        ),
                    },
                    {
                        id: 'august-1991',
                        date: t('1991년 8월 20일', 'August 20, 1991'),
                        title: t('8월의 전차 — 1917년의 거울', 'The tanks of August — the mirror of 1917'),
                        role: t(
                            '당신은 모스크바에 진입한 전차 중대의 지휘관이다. 당신의 전차는 지금 「백악관」 앞에 서 있다.',
                            'You command a tank company that has entered Moscow. Your tanks stand before the Russian “White House.”'
                        ),
                        briefing: t(
                            '어제 새벽 국가비상사태위원회가 선포되었다 — 부통령, 총리, 국방장관, KGB 의장. 그들은 고르바초프가 「건강상 이유로 직무 수행 불능」이라 발표했지만, 라디오는 그가 크림 별장에 연금되어 있다고 말한다. 내일은 연방을 주권 공화국들의 연합으로 재편하는 신연방조약 서명일이었다 — 쿠데타는 정확히 그것을 막으려는 것이다. 당신의 부대는 「질서 유지」 명령으로 진입했다. 그런데 러시아공화국 대통령 옐친이 바로 이 건물 앞에서 전차 위에 올라가 저항을 호소했고, 지금 수만 명의 시민이 바리케이드를 쌓고 있다. 병사들에게 시민들이 빵과 담배를 건넨다. 강습 명령이 준비 중이라는 소문이 무전으로 돈다. 당신은 1917년 2월의 볼린스키 연대 이야기를 사관학교에서 배웠다 — 그때는 그것이 「혁명 전통」이라고 배웠다.',
                            'Yesterday at dawn a State Committee for the State of Emergency proclaimed itself — the vice-president, the premier, the defence minister, the KGB chairman. They announce that Gorbachev is “unable to perform his duties for reasons of health”; the radio says he is under house arrest at his Crimean dacha. Tomorrow was to be the signing of the new Union Treaty, remaking the USSR as a union of sovereign republics — the coup exists precisely to stop it. Your unit entered under orders to “maintain order.” But Yeltsin, president of the Russian republic, climbed onto a tank in front of this very building to call for resistance, and tens of thousands are now building barricades. Civilians pass bread and cigarettes up to your soldiers. Word comes over the radio net that an assault order is being drafted. At the academy you were taught the story of the Volynsky regiment in February 1917 — taught, then, as “revolutionary tradition.”'
                        ),
                        question: t('강습 명령이 내려온다면, 당신은?', 'If the assault order comes down — you?'),
                        options: [
                            o('obey', 'radical',
                                '명령을 이행한다 — 군대가 정치를 고르기 시작하면 나라가 끝난다',
                                'Carry out the order — the day the army starts choosing its politics, the country is finished',
                                '알파 부대에 실제로 떨어질 뻔한 임무다. 지휘관들은 사상자 계산서를 앞에 두고 사실상 집행을 거부했다 — 「수천 명이 죽는다. 우리는 하지 않는다.」',
                                'The mission nearly handed to the Alpha group. Facing the casualty arithmetic, its commanders in effect refused — thousands would die; we will not do it.'),
                            o('stall', 'cautious',
                                '지연한다 — 명령의 계통과 적법성을 확인하며 움직이지 않는다',
                                'Stall — query the chain of command and its legality, and do not move',
                                '그 사흘간 군 전체가 실제로 한 일에 가장 가깝다. 국방장관 야조프 자신이 강습 서명을 미뤘고, 공군 사령관은 「명령해도 뜨지 않겠다」고 통고했다. 쿠데타는 집행자를 구하지 못해 죽어 갔다.',
                                'Closest to what the army as a whole actually did for those three days. Defence Minister Yazov himself withheld his signature; the air force commander gave notice his planes would not fly. The coup died for want of executioners.'),
                            o('defect', 'reform',
                                '포탑을 돌린다 — 부대를 이끌고 백악관 방어 측에 선다',
                                'Turn the turret — take your company over to the White House’s defenders',
                                '타만 사단 일부 전차 중대가 실제로 간 길이다. 8월 20일 밤, 백악관을 지키는 전차들의 사진이 전 세계로 타전되었다 — 옐친이 올라섰던 전차도 그중 하나가 되었다.',
                                'The road some tank companies of the Taman division actually took. On the night of August 20 the photographs went out worldwide: tanks defending the White House — among them the very kind Yeltsin had climbed.'),
                        ],
                        actualId: 'defect',
                        outcome: t(
                            '쿠데타는 60시간 만에 무너졌다 — 진압할 군대가 움직이지 않았고, 일부는 넘어갔기 때문이다(지하도에서 시민 3명이 죽었다). 그러나 승자는 고르바초프가 아니었다. 그가 크림에서 돌아왔을 때 권력은 이미 옐친과 공화국들에게 넘어가 있었다. 당은 활동 정지되었고, 8월 24일 우크라이나를 시작으로 공화국들이 연쇄 독립을 선언했다. 12월 8일 벨라베자 숲에서 러시아·우크라이나·벨라루스 정상이 연방 해체에 서명했고, 12월 25일 저녁 크렘린에서 붉은 기가 내려왔다. 핵 초강대국이, 내전 없이, 스스로 문을 닫았다.',
                            'The coup collapsed in sixty hours — the army it needed would not move, and some of it crossed over (three civilians died in an underpass). But the victor was not Gorbachev: by the time he returned from Crimea, power had passed to Yeltsin and the republics. The party was suspended; from August 24, Ukraine first, the republics declared independence in a chain. On December 8, in the Belavezha forest, the leaders of Russia, Ukraine and Belarus signed the Union out of existence; on the evening of December 25 the red flag came down over the Kremlin. A nuclear superpower closed itself down, without a civil war.'
                        ),
                        ripple: t(
                            '이 책의 시간은 여기서 멈춘다. 1917년 2월, 쏘기를 거부한 병사들의 반란으로 태어난 권력이 — 1991년 8월, 쏘기를 거부한 병사들 앞에서 끝났다. 그 74년이 필연의 곡선이었는지 선택의 연쇄였는지는, 아래 에필로그의 논쟁으로 넘긴다.',
                            'The book’s clock stops here. A power born in February 1917 of soldiers who refused to fire ended in August 1991 before soldiers who refused to fire. Whether those seventy-four years traced a curve of necessity or a chain of choices is handed to the disputes of the epilogue below.'
                        ),
                        insight: t(
                            '전편의 첫 장면(1917년 2월의 병사)과 이 마지막 장면은 같은 정리(定理)의 두 증명이다 — 체제의 사망 시각은 군대가 발포를 거부하는 순간이다. 다른 것은 하나뿐이다: 이번에는 그 사실을 지도부도 알고 있었고, 학살로 시간을 사는 길을 스스로 접었다.',
                            'The first scene of the previous book (the soldier of February 1917) and this last scene are two proofs of the same theorem: a regime dies at the moment its army refuses to fire. Only one thing differs — this time the leadership knew it too, and itself declined to buy time with a massacre.'
                        ),
                    },
                ],
            },
        ],
        verdict: {
            title: t('나의 통치 노선', 'My governing line'),
            lockedHint: t(
                '모든 갈림길을 결정하면, 당신의 선택 성향이 여기에 나타납니다.',
                'Decide every fork, and your pattern of choices will appear here.'
            ),
            matchLabel: t('실제 역사와 같은 길을 택한 횟수', 'Times you chose the road history took'),
            matchNote: t(
                '실제 역사와 다른 선택이 「틀린」 것이 아닙니다 — 그 갈림길이 실재했다는 것이 이 책의 요점입니다. 그리고 쿠바의 흐루쇼프가 보여 주듯, 같은 사람도 정세에 따라 다른 노선에 섭니다.',
                'Choosing differently from history is not being “wrong” — the book’s point is that the fork was real. And as Khrushchev over Cuba shows, the same person stands on different lines as the situation changes.'
            ),
            profiles: {
                radical: t(
                    '당신은 갈림길마다 힘의 해결을 골랐습니다. 부다페스트와 프라하의 탱크, 카불로 가는 제40군이 그 길에 서 있었습니다 — 매번 질서를 지켜 낸 길이지만, 그때마다 체제의 미래를 조금씩 태워 청구서를 다음 세대로 넘긴 길이기도 합니다.',
                    'You chose force at fork after fork. The tanks of Budapest and Prague, the 40th Army on the road to Kabul stood on that road — the road that kept order every time, and each time burned a little of the system’s future, passing the bill to the next generation.'
                ),
                cautious: t(
                    '당신은 흔들지 않는 쪽에 걸었습니다. 1941년의 「도발 회피」, 쿠바에서의 철수, 브레즈네프 시대의 「안정」이 그 길에 서 있었습니다 — 파국을 여러 번 피해 간 길이지만, 미뤄진 문제들이 복리로 돌아온 길이기도 합니다.',
                    'You bet on not rocking the boat. The “avoid provocation” of 1941, the withdrawal over Cuba, the “stability” of the Brezhnev years stood on that road — the road that dodged catastrophe more than once, and the road on which postponed problems came back with compound interest.'
                ),
                reform: t(
                    '당신은 개혁과 개방의 길을 골랐습니다. 비밀연설의 흐루쇼프, 코시긴, 그리고 고르바초프가 그 길에 서 있었습니다 — 체제를 구하려던 개혁이 번번이 체제보다 커져 버린 길입니다. 그것이 이 길의 오류를 증명하는지, 아니면 너무 늦게 걸은 값인지는 역사가들이 아직 다투고 있습니다.',
                    'You chose reform and opening. Khrushchev of the Secret Speech, Kosygin, and Gorbachev stood on that road — a road on which reforms meant to save the system kept outgrowing it. Whether that proves the road wrong, or is merely the price of walking it too late, historians still dispute.'
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
                    topic: t('냉전은 누가 시작했는가', 'Who started the Cold War?'),
                    sideALabel: t('전통주의', 'The traditionalists'),
                    sideA: t(
                        '냉전은 소련 팽창에 대한 서방의 방어였다. 동유럽의 위성국화, 약속된 자유선거의 파기, 베를린 봉쇄 — 스탈린의 행동이 먼저였고 봉쇄는 응답이었다. 마셜 플랜은 초대장이었으나 거절한 것은 모스크바다.',
                        'The Cold War was the West’s defence against Soviet expansion. The satellization of Eastern Europe, the broken promises of free elections, the Berlin blockade — Stalin’s actions came first, and containment answered them. The Marshall Plan was an invitation; it was Moscow that refused.'
                    ),
                    sideBLabel: t('수정주의', 'The revisionists'),
                    sideB: t(
                        '2,700만을 잃은 나라의 국경 완충지대 요구는 팽창이 아니라 안보였다. 원폭 독점의 과시, 소련이 참여할 수 없게 설계된 마셜 플랜, 달러 경제권의 확장 — 봉쇄가 아니라 포위가 먼저였다는 것이다. 냉전은 방어 대 팽창이 아니라 두 팽창의 충돌이었다.',
                        'For a country that had lost twenty-seven million, demanding a buffer on its border was security, not expansion. The brandished atomic monopoly, a Marshall Plan designed so the USSR could not join, the expanding dollar economy — encirclement, on this reading, preceded containment. The Cold War was not defence against expansion but the collision of two expansions.'
                    ),
                    takeaway: t(
                        '문서고 개방 이후의 탈수정주의는 양쪽을 이렇게 종합한다 — 쌍방 모두 자기 행동은 방어로, 상대 행동은 팽창으로 읽는 「안보 딜레마」가 작동했고, 거기에 스탈린 체제의 성격이 상수로 얹혔다. 「누가 시작했나」보다 나은 질문은 「어떤 구조가 양쪽의 최악의 해석을 매번 이기게 했나」다.',
                        'Post-archive scholarship synthesizes the two roughly so: a security dilemma in which each side read its own moves as defence and the other’s as expansion, with the character of Stalin’s regime as a constant on top. The better question than “who started it” is “what structure let each side’s worst interpretation win every round?”'
                    ),
                },
                {
                    topic: t('소련 붕괴는 필연이었는가', 'Was the collapse inevitable?'),
                    sideALabel: t('구조 결정론', 'The structural case'),
                    sideA: t(
                        '체제는 고칠 수 없는 것들로 죽었다. 혁신을 못 하는 명령경제, 유가에 매달린 재정, 감당 불가능한 군비와 제국 유지비, 그리고 연방의 형식 속에 잠재된 민족 문제 — 고르바초프가 아니었어도 시기만 달랐을 뿐 결과는 같았다. 개혁을 시작하는 순간 무너진다는 것 자체가 체제의 진단서다.',
                        'The system died of incurable conditions: a command economy that could not innovate, a budget hanging on the oil price, an unaffordable arms burden and empire, and the national question latent in the Union’s own federal form. Without Gorbachev the date changes, not the outcome. That it collapsed the moment reform began is itself the diagnosis.'
                    ),
                    sideBLabel: t('우연론', 'The contingency case'),
                    sideB: t(
                        '1985년의 소련은 침체였지 붕괴가 아니었다 — 파산도, 반란도, 패전도 없었다. 죽음은 진단이 아니라 처방에서 왔다: 경제를 고치기 전에 정치를 열었고, 당을 대체할 제도를 세우기 전에 당을 허물었다. 다른 인물, 다른 순서(중국은 정확히 반대 순서를 골랐다), 혹은 배럴당 몇 달러의 유가 차이로도 다른 역사가 가능했다.',
                        'The USSR of 1985 was stagnant, not collapsing — no bankruptcy, no uprising, no lost war. Death came from the prescription, not the diagnosis: politics was opened before the economy was fixed, and the party was dismantled before anything stood ready to replace it. A different man, a different sequence (China chose precisely the reverse), even a few dollars on a barrel of oil, and another history was possible.'
                    ),
                    takeaway: t(
                        '구조는 「위기」까지를 설명하고, 「그 위기가 하필 이렇게 끝났다」는 선택들이 설명한다 — 1989년에 쏘지 않기로 한 결정, 1991년 8월에 움직이지 않은 군대. 전편과 같은 결론이다: 필연은 대개 결과를 알고 난 뒤에 쓰이는 단어다.',
                        'Structure explains the crisis; the choices explain why the crisis ended this way and no other — the decision not to shoot in 1989, the army that would not move in August 1991. The conclusion is the same as the previous book’s: “inevitable” is a word usually written after the outcome is known.'
                    ),
                },
                {
                    topic: t('중국의 길은 소련에도 가능했는가', 'Was the Chinese road open to the USSR?'),
                    sideALabel: t('가능론', 'The case that it was'),
                    sideA: t(
                        '순서가 전부였다. 덩샤오핑은 정치를 닫아 둔 채 경제를 열었고, 당은 살아남아 성장을 지휘했다. 소련도 1965년의 코시긴 개혁, 혹은 1985년의 「가속화」를 그 순서로 밀고 나갔다면 — 글라스노스트 없이 농업 청부제와 경제특구부터 갔다면 — 당이 통제하는 시장화가 가능했다는 주장이다. 안드로포프가 더 살았다면, 이라는 반사실이 이 주장의 단골 형태다.',
                        'Sequence was everything. Deng opened the economy while keeping politics shut, and the party survived to preside over growth. Had the USSR pushed the Kosygin reform of 1965, or the “acceleration” of 1985, in that order — household contracting and special zones first, no glasnost — party-controlled marketization was possible. “Had Andropov lived” is this argument’s favourite counterfactual.'
                    ),
                    sideBLabel: t('불가능론', 'The case that it was not'),
                    sideB: t(
                        '두 나라는 출발선이 달랐다. 1978년 중국은 인구의 8할이 농민이라 「집단농장 해체」만으로 폭발적 성장이 나왔지만, 소련은 이미 도시화·산업화가 끝난 나라였다 — 개혁해야 할 것이 농촌이 아니라 당 자체와 유착된 거대 공업이었다. 게다가 소련은 공화국들로 조립된 다민족 연방이어서, 통제를 늦추면 시장이 아니라 국경이 먼저 움직였다. 같은 처방이 다른 몸에는 같은 약이 아니다.',
                        'The starting lines differed. In the China of 1978, eight in ten people were peasants — dissolving the communes alone released explosive growth. The USSR was already urbanized and industrialized; what needed reforming was not the village but a giant industry fused with the party itself. And the USSR was a multinational federation assembled from republics: loosen control, and it was borders, not markets, that moved first. The same prescription is not the same medicine in a different body.'
                    ),
                    takeaway: t(
                        '이 논쟁의 소득은 승패가 아니라 변수 목록이다 — 발전 단계, 농민의 비중, 당과 경제의 유착도, 연방이라는 형식. 「개혁 일반」은 없고 조건 속의 개혁만 있다는 것; 그리고 그 조건들의 상당 부분이 이 책 앞부분의 갈림길들에서 만들어졌다는 것이, 두 권을 관통하는 마지막 연결선이다.',
                        'The yield of this dispute is not a winner but a list of variables — stage of development, the peasant share, how deeply party and economy had fused, the federal form itself. There is no “reform in general,” only reform under conditions; and that so many of those conditions were made at the forks earlier in this book is the last thread connecting the two volumes.'
                    ),
                },
            ],
        },
    },
};
