-- The late-Soviet nationalities crisis, 1988-1991, from Sumgait to Vilnius.
--
-- A composite entry rather than a single named event: the four bloodlettings
-- (Sumgait 1988, Tbilisi 1989, Baku 1990, Vilnius 1991) were not the same kind
-- of episode, and the card says so plainly. What joins them is the contradiction
-- the period exposed, that the centre could no longer protect citizens from
-- ethnic violence while it could still send troops against republics leaving it.
--
-- sort_order 107 sits between Chernobyl (106) and the revolutions of 1989 (108),
-- which is where a 1988-1991 process belongs on this timeline; perestroika (105)
-- is the frame it happens inside.
--
-- Casualty figures are the official/commission ones and are labelled as such
-- where they are disputed, following the site's post-archive standard. No em
-- dashes in new text.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('nationalities-crisis', 107, '1988–1991',
     '민족위기와 중앙권력의 붕괴', 'The Nationalities Crisis and the Collapse of Central Authority',
     '시민을 지키지 못하게 된 국가가 어떻게 시위대에는 여전히 군대를 보낼 수 있었는가?',
     'How could a state that could no longer protect its citizens still send troops against demonstrators?',
     '1988년 숨가이트 포그롬에서 1991년 빌뉴스 유혈사태에 이르는 일련의 사건은 페레스트로이카 아래에서 소련의 민족질서와 중앙권력이 함께 무너져 가는 과정이다. 네 사건의 성격은 같지 않다. 숨가이트는 나고르노카라바흐 문제를 계기로 터진 반아르메니아 포그롬이자 국가의 치안 실패였고, 1989년 트빌리시는 비무장 민족·독립운동에 대한 군사적 진압이었으며, 1990년 바쿠는 민족폭력과 중앙권력 붕괴가 겹친 자리에서 이루어진 대규모 군사개입이었고, 1991년 빌뉴스는 독립을 선언한 연방공화국의 주권기관에 대한 강제력 행사였다. 그러나 하나의 공통된 위기를 보여 준다. 중앙정부는 민족 간 폭력으로부터 주민을 지키지 못하면서도, 공화국의 정치적 이탈에는 반복해서 군사력을 썼다.',
     'The sequence running from the Sumgait pogrom of 1988 to the killings in Vilnius in 1991 is the process by which the Soviet national order and Soviet central authority came apart together under perestroika. The four episodes were not of one kind. Sumgait was an anti-Armenian pogrom touched off by the Nagorno-Karabakh question and a failure of policing; Tbilisi in 1989 was the military dispersal of an unarmed national and independence movement; Baku in 1990 was a large military intervention where ethnic violence and the collapse of central power overlapped; Vilnius in 1991 was force used against the sovereign institutions of a republic that had declared independence. Yet they show one crisis. The centre could not protect people from ethnic violence, and still reached for the army whenever a republic moved politically away from it.',
     '이 과정은 소련 민족정책의 근본 모순을 드러냈다. 소련은 수십 년에 걸쳐 공화국·자치지역·민족언어·민족관료제를 제도화했으나, 그 공동체가 영토와 주권을 실제로 재협상할 절차는 두지 않았다. 글라스노스트가 당의 통제력을 약화시키자 그 단위들이 곧바로 주권운동의 기반이 됐다. 중앙은 협상·연방개혁·치안·강압 사이에서 원칙을 세우지 못했고, 유혈이 거듭될수록 그 지역에서 소련 국가의 정당성은 깎였다. 「소련은 더 이상 중립적인 연방정부가 아니다」라는 인식이 퍼졌고, 이 연쇄적 정당성 붕괴는 1991년 해체로 이어진 주요 경로 가운데 하나였다.',
     'The period exposed the founding contradiction of Soviet nationalities policy. Over decades the Soviet Union institutionalized republics, autonomous areas, national languages and national bureaucracies, while providing no procedure by which those communities could actually renegotiate territory or sovereignty. When glasnost weakened the party''s grip, those same units became the base of the sovereignty movements. The centre never settled on a principle among negotiation, federal reform, policing and coercion, and each round of bloodshed cost the Soviet state more of its legitimacy where it happened. The conviction spread that the Union was no longer a neutral federal government, and that chain of collapsing legitimacy was one of the main political routes to the dissolution of 1991.',
     $$[
       {"date":"1988.02.20","title":{"ko":"카라바흐 결의","en":"The Karabakh resolution"},"body":{"ko":"나고르노카라바흐 자치주 소비에트가 아르메니아로의 이관을 요청했다. 연방 헌법에는 이런 요구를 처리할 절차가 사실상 없었다.","en":"The soviet of the Nagorno-Karabakh Autonomous Oblast asked to be transferred to Armenia. The Union constitution had, in practice, no procedure for such a request."}},
       {"date":"1988.02.27–29","title":{"ko":"숨가이트 포그롬","en":"The Sumgait pogrom"},"body":{"ko":"아제르바이잔 SSR 숨가이트에서 아르메니아인을 겨냥한 폭력이 사흘간 이어졌다. 공식 사망자는 32명이며 아르메니아 측은 더 많다고 본다. 군 투입은 늦었다.","en":"Violence against Armenians ran for three days in Sumgait, Azerbaijan SSR. The official toll was 32 dead, a figure Armenian accounts dispute as too low. Troops arrived late."}},
       {"date":"1988–1989","title":{"ko":"민족전선의 형성","en":"The national fronts form"},"body":{"ko":"발트 3국과 캅카스에서 인민전선·사유디스가 결성되어 기존 공화국 제도를 대중정치의 기반으로 삼았다.","en":"Popular fronts and Sąjūdis formed in the Baltics and the Caucasus, turning existing republic institutions into the base of mass politics."}},
       {"date":"1989.04.09","title":{"ko":"트빌리시","en":"Tbilisi"},"body":{"ko":"조지아의 독립 요구 집회를 소련군이 삽과 가스를 써서 해산했다. 21명이 죽었고 다수가 여성이었다. 소브차크 위원회가 책임 소재를 조사했다.","en":"Soviet troops cleared a Georgian independence rally with sapper shovels and gas, killing 21, most of them women. The Sobchak commission investigated responsibility."}},
       {"date":"1990.01.13–19","title":{"ko":"바쿠의 포그롬","en":"The Baku pogrom"},"body":{"ko":"바쿠에서 아르메니아인을 겨냥한 폭력이 며칠간 이어지는 동안 주둔 병력은 개입하지 않았다.","en":"Violence against Armenians ran for days in Baku while the garrison did not intervene."}},
       {"date":"1990.01.19–20","title":{"ko":"검은 1월","en":"Black January"},"body":{"ko":"소련군이 바쿠에 진입해 민간인 130여 명이 죽었다. 포그롬은 막지 못한 군대가 인민전선의 권력 도전에는 투입된 셈이었다.","en":"Soviet troops entered Baku and about 130 civilians were killed. The army that had not stopped the pogrom was used against the Popular Front's challenge for power."}},
       {"date":"1990.03.11","title":{"ko":"리투아니아 독립 선언","en":"Lithuania declares independence"},"body":{"ko":"리투아니아 최고회의가 독립 회복을 선언했다. 모스크바는 이를 무효로 규정하고 경제 봉쇄로 대응했다.","en":"The Lithuanian Supreme Council declared independence restored. Moscow declared it void and answered with an economic blockade."}},
       {"date":"1991.01.13","title":{"ko":"빌뉴스","en":"Vilnius"},"body":{"ko":"소련군과 특수부대가 텔레비전 탑과 방송국을 장악하려 했고 민간인 14명이 죽었다. 명령 계통이 어디까지 올라가는지는 끝내 규명되지 않았다.","en":"Soviet troops and special forces moved to seize the television tower and broadcasting centre; 14 civilians died. How far up the chain the order ran was never established."}},
       {"date":"1991.03.17","title":{"ko":"연방 국민투표","en":"The Union referendum"},"body":{"ko":"연방 유지를 묻는 국민투표가 실시됐으나 발트 3국·조지아·아르메니아·몰도바는 참가하지 않았다. 연방의 범위 자체가 이미 다투어지고 있었다.","en":"A referendum on preserving the Union was held, but the Baltic republics, Georgia, Armenia and Moldova did not take part. The extent of the Union was itself already in dispute."}}
     ]$$,
     $$["Mark R. Beissinger, Nationalist Mobilization and the Collapse of the Soviet State (Cambridge University Press, 2002)", "Human Rights Watch / Helsinki Watch, Conflict in the Soviet Union: Black January in Azerbaidzhan (1991)", "Thomas de Waal, Black Garden: Armenia and Azerbaijan Through Peace and War (NYU Press, 2003)"]$$,
     NOW())
ON CONFLICT (id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, period_label = EXCLUDED.period_label,
    title_ko = EXCLUDED.title_ko, title_en = EXCLUDED.title_en,
    question_ko = EXCLUDED.question_ko, question_en = EXCLUDED.question_en,
    summary_ko = EXCLUDED.summary_ko, summary_en = EXCLUDED.summary_en,
    outcome_ko = EXCLUDED.outcome_ko, outcome_en = EXCLUDED.outcome_en,
    timeline = EXCLUDED.timeline, sources = EXCLUDED.sources, updated_at = NOW();

INSERT INTO commulingo_history_event_people
    (event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
SELECT 'nationalities-crisis', v.person_id, v.sort_order, v.relation_kind,
       v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    ('gorbachev', 0, 'leader', '서기장 · 일관된 원칙의 부재', 'General secretary, and the missing principle',
     '협상과 무력 사이를 오갔고, 빌뉴스와 바쿠의 명령 관계를 끝까지 분명히 밝히지 않았다.',
     'He moved between negotiation and force, and never made clear how far the orders at Baku and Vilnius reached him.'),
    ('yazov', 1, 'executor', '국방장관 · 군 투입', 'Defence minister, who supplied the troops',
     '바쿠와 빌뉴스에 투입된 병력의 책임 계통 위쪽에 있었다.',
     'He stood at the top of the chain for the troops used at Baku and at Vilnius.'),
    ('kryuchkov', 2, 'executor', 'KGB 의장 · 특수부대', 'KGB chairman, and the special forces',
     '빌뉴스 작전에 투입된 특수부대를 관할했고, 이듬해 8월 쿠데타의 주동자가 됐다.',
     'The special forces used at Vilnius were his, and he led the August coup the following year.'),
    ('boris-pugo', 3, 'executor', '내무장관 · 내무부 병력', 'Interior minister, and his ministry troops',
     '내무부 병력을 관할했고 발트 지역 강경책의 한 축이었다.',
     'He commanded the interior ministry troops and was one axis of the hard line in the Baltics.'),
    ('shevardnadze', 4, 'witness', '외무장관 · 사임 경고', 'Foreign minister, who resigned in warning',
     '1990년 12월 독재가 오고 있다고 경고하며 사임했고, 트빌리시는 그의 고향 공화국이었다.',
     'He resigned in December 1990 warning that dictatorship was coming; Tbilisi was his own republic.'),
    ('yakovlev', 5, 'participant', '개혁파 · 발트 정책', 'The reform wing, and Baltic policy',
     '개혁파의 이론가로 독소불가침조약 비밀의정서 조사를 이끌어 발트의 주권 주장에 근거를 열었다.',
     'The reform wing''s theorist; his inquiry into the secret protocol of the Nazi-Soviet pact opened the ground for Baltic sovereignty claims.'),
    ('ligachev', 6, 'opponent', '보수파 · 연방 유지', 'The conservative wing, holding the Union',
     '공화국의 이탈 요구에 반대하며 연방 유지와 강경 대응을 주장했다.',
     'He opposed the republics'' demands and argued for holding the Union together by a hard line.'),
    ('heydar-aliyev', 7, 'participant', '검은 1월 규탄 · 아제르바이잔', 'Condemning Black January, from Azerbaijan',
     '검은 1월 직후 모스크바에서 군사개입을 공개 규탄하고 당을 떠났다.',
     'Days after Black January he publicly condemned the intervention in Moscow and left the party.')
) AS v(person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
