-- The late-Soviet arc that the events section was missing (1947-1991), drawn
-- from the decision-simulation episodes but merged into coherent standalone
-- events rather than one page per fork. Seven events between the Great Patriotic
-- War and the end of the USSR. Idempotent.

INSERT INTO commulingo_history_events
    (id, sort_order, period_label, title_ko, title_en, question_ko, question_en,
     summary_ko, summary_en, outcome_ko, outcome_en, timeline, sources, updated_at)
VALUES
    ('marshall-plan', 81, '1947–1948',
     '마셜 플랜과 냉전의 시작', 'The Marshall Plan and the Cold War',
     '전후 유럽은 왜 두 진영으로 갈라졌는가?',
     'Why did postwar Europe split into two camps?',
     '1947년 미국이 유럽 재건을 위한 마셜 플랜을 내놓자, 소련은 그것을 미국 자본에 유럽을 종속시키려는 시도로 규정했다. 몰로토프는 파리 회담에서 협상을 결렬시켰고, 스탈린은 동유럽 국가들이 원조를 받는 것을 막았다. 즈다노프의 「두 진영」 선언과 코민포름 창설로 세계는 냉전의 두 블록으로 굳어졌다.',
     'When the United States proposed the Marshall Plan to rebuild Europe in 1947, the Soviet Union cast it as an attempt to subordinate Europe to American capital. Molotov broke off the Paris talks, and Stalin blocked the Eastern European states from taking the aid. With Zhdanov’s declaration of “two camps” and the founding of the Cominform, the world hardened into the two blocs of the Cold War.',
     '유럽은 마셜 플랜을 받은 서방과 소련 주도의 동방으로 갈라졌고, 동유럽에서는 소비에트형 체제가 굳어졌다. 냉전의 진영 대립은 이후 40년 동안 세계 정치를 규정했다.',
     'Europe divided into a West that took the Marshall Plan and a Soviet-led East, and Soviet-type systems consolidated across Eastern Europe. The bloc rivalry of the Cold War would define world politics for the next four decades.',
     $$[
       {"date":"1947.06","title":{"ko":"마셜 플랜 발표","en":"The Marshall Plan announced"},"body":{"ko":"미 국무장관 마셜이 유럽 재건 원조 계획을 제안했다.","en":"U.S. Secretary of State Marshall proposed a plan of aid for European reconstruction."}},
       {"date":"1947.07","title":{"ko":"파리 회담 결렬","en":"The Paris talks collapse"},"body":{"ko":"몰로토프가 소련 대표단을 이끌고 회담에서 퇴장했다.","en":"Molotov led the Soviet delegation out of the talks."}},
       {"date":"1947.09","title":{"ko":"코민포름 창설","en":"The Cominform founded"},"body":{"ko":"즈다노프가 「두 진영」론을 내걸고 공산당 정보국을 세웠다.","en":"Zhdanov founded the Communist Information Bureau on the doctrine of two camps."}},
       {"date":"1948.02","title":{"ko":"체코 쿠데타","en":"The Czechoslovak coup"},"body":{"ko":"체코슬로바키아가 공산당 체제로 넘어가며 동유럽의 진영화가 완성됐다.","en":"Czechoslovakia passed to communist rule, completing the division of Eastern Europe."}}
     ]$$::jsonb,
     '["John Lewis Gaddis, The Cold War: A New History", "Encyclopaedia Britannica: Marshall Plan"]'::jsonb,
     NOW()),
    ('kosygin-reform', 94, '1965–1970',
     '코시긴 개혁', 'The Kosygin Reform',
     '계획경제에 이윤을 심으려던 시도는 왜 멈췄는가?',
     'Why did the attempt to plant profit in the planned economy stall?',
     '1965년 총리 코시긴은 기업의 자율성과 이윤·수익성 지표를 확대하는 경제개혁을 추진했다. 경제학자 리베르만의 제안에서 출발한 이 개혁은 계획경제의 효율을 높이려는 시도였다. 그러나 프라하의 봄이 개혁의 위험성을 부각시키고 브레즈네프와 보수파가 제동을 걸면서 개혁은 흐지부지됐다.',
     'In 1965 Premier Kosygin pushed an economic reform that widened enterprise autonomy and profit-and-profitability indicators. Growing out of the economist Liberman’s proposals, it was an attempt to raise the efficiency of the planned economy. But as the Prague Spring highlighted the dangers of reform and Brezhnev and the conservatives applied the brakes, the reform petered out.',
     '개혁은 부분적 성과에 그친 뒤 사실상 폐기됐고, 소련 경제는 「정체기」로 접어들었다. 계획 안에서 시장 원리를 도입하려던 이 실험은 훗날 페레스트로이카 논쟁의 전사(前史)가 됐다.',
     'After limited results the reform was effectively abandoned, and the Soviet economy entered the era of stagnation. This experiment in introducing market principles within the plan became a prelude to the later debates of perestroika.',
     $$[
       {"date":"1962","title":{"ko":"리베르만 논쟁","en":"The Liberman debate"},"body":{"ko":"프라우다에 실린 리베르만의 글이 이윤 지표 도입 논쟁을 열었다.","en":"Liberman’s article in Pravda opened a debate on introducing profit indicators."}},
       {"date":"1965.09","title":{"ko":"개혁의 개시","en":"The reform launched"},"body":{"ko":"코시긴이 기업 자율성과 수익성 지표를 확대하는 개혁을 발표했다.","en":"Kosygin announced a reform widening enterprise autonomy and profitability measures."}},
       {"date":"1968","title":{"ko":"제동","en":"The brakes"},"body":{"ko":"프라하의 봄 뒤 개혁이 위축되고 보수파가 우위를 점했다.","en":"After the Prague Spring the reform contracted and the conservatives gained the upper hand."}}
     ]$$::jsonb,
     '["Alec Nove, An Economic History of the USSR", "Encyclopaedia Britannica: Alexei Kosygin"]'::jsonb,
     NOW()),
    ('afghanistan-war', 100, '1979–1989',
     '소련-아프가니스탄 전쟁', 'The Soviet-Afghan War',
     '초강대국은 왜 국경 너머의 수렁으로 걸어 들어갔는가?',
     'Why did a superpower walk into a quagmire beyond its border?',
     '1979년 12월, 소련은 흔들리는 아프가니스탄 공산정권을 지키기 위해 군사 개입을 결정했다. 브레즈네프·안드로포프·우스티노프·그로미코가 주도한 이 결정은 짧은 안정화 작전으로 기획됐으나, 무자헤딘의 저항과 미국·파키스탄의 지원 속에서 10년에 걸친 소모전이 됐다.',
     'In December 1979 the Soviet Union decided on military intervention to prop up a faltering communist government in Afghanistan. Driven by Brezhnev, Andropov, Ustinov and Gromyko, the decision was conceived as a brief stabilization operation, but amid mujahideen resistance and U.S. and Pakistani support it became a decade-long war of attrition.',
     '약 1만 5천 명의 소련군과 훨씬 많은 아프간인이 죽었고, 전쟁은 소련의 국력과 위신을 갉아먹었다. 고르바초프는 1989년 철군을 명령했고, 이 전쟁은 「소련의 베트남」으로 불리며 체제 위기의 한 원인이 됐다.',
     'Some fifteen thousand Soviet soldiers and far more Afghans died, and the war drained Soviet strength and prestige. Gorbachev ordered the withdrawal in 1989, and the conflict, called the Soviet Vietnam, became one of the causes of the system’s crisis.',
     $$[
       {"date":"1978","title":{"ko":"4월 혁명","en":"The April Revolution"},"body":{"ko":"아프가니스탄 공산당이 정권을 잡았으나 내부 분열과 반란에 직면했다.","en":"The Afghan communist party took power but faced internal splits and revolt."}},
       {"date":"1979.12","title":{"ko":"소련의 개입","en":"The Soviet intervention"},"body":{"ko":"소련군이 카불로 진입해 아민을 제거하고 카르말 정권을 세웠다.","en":"Soviet forces entered Kabul, removed Amin, and installed the Karmal government."}},
       {"date":"1980–1988","title":{"ko":"소모전","en":"The war of attrition"},"body":{"ko":"무자헤딘의 저항이 미국·파키스탄의 지원 속에 이어졌다.","en":"Mujahideen resistance continued, backed by the United States and Pakistan."}},
       {"date":"1989.02","title":{"ko":"철군","en":"The withdrawal"},"body":{"ko":"고르바초프의 결정으로 소련군이 아프가니스탄에서 완전히 철수했다.","en":"By Gorbachev’s decision, Soviet forces withdrew completely from Afghanistan."}}
     ]$$::jsonb,
     '["Rodric Braithwaite, Afgantsy: The Russians in Afghanistan", "Encyclopaedia Britannica: Soviet invasion of Afghanistan"]'::jsonb,
     NOW()),
    ('perestroika', 105, '1985–1991',
     '페레스트로이카와 글라스노스트', 'Perestroika and Glasnost',
     '체제를 고치려던 개혁은 왜 체제를 끝냈는가?',
     'Why did a reform meant to fix the system end it?',
     '1985년 서기장이 된 고르바초프는 침체한 경제와 경직된 정치를 되살리기 위해 페레스트로이카(개혁)와 글라스노스트(개방)를 내걸었다. 야코블레프가 설계한 글라스노스트는 검열을 풀고 과거의 범죄를 드러냈으며, 셰바르드나제의 외교는 냉전을 끝으로 이끌었다. 그러나 개혁은 보수파와 급진파 사이에서 통제를 잃어 갔다.',
     'Becoming General Secretary in 1985, Gorbachev launched perestroika (restructuring) and glasnost (openness) to revive a stagnant economy and a rigid politics. The glasnost designed by Yakovlev lifted censorship and exposed past crimes, and Shevardnadze’s diplomacy steered the Cold War toward its end. But the reforms slipped out of control between conservatives and radicals.',
     '글라스노스트는 체제에 대한 신뢰를 무너뜨렸고, 경제 개혁은 부족과 혼란을 낳았다. 보수파의 반발과 옐친을 비롯한 급진파의 압박 사이에서 고르바초프의 중도 노선은 설 자리를 잃었고, 개혁은 결국 소련의 해체로 이어졌다.',
     'Glasnost eroded trust in the system, and economic reform brought shortages and disorder. Caught between a conservative backlash and radical pressure from figures like Yeltsin, Gorbachev’s centrist line lost its footing, and the reforms ultimately led to the dissolution of the Soviet Union.',
     $$[
       {"date":"1985.03","title":{"ko":"고르바초프의 집권","en":"Gorbachev takes power"},"body":{"ko":"젊은 서기장이 개혁을 예고했다.","en":"A young General Secretary signaled reform."}},
       {"date":"1986~","title":{"ko":"글라스노스트","en":"Glasnost"},"body":{"ko":"검열이 풀리고 언론과 역사에 대한 재평가가 시작됐다.","en":"Censorship eased and a reassessment of the press and history began."}},
       {"date":"1987–1988","title":{"ko":"경제·정치 개혁","en":"Economic and political reform"},"body":{"ko":"기업 자율화와 준경쟁 선거 등 개혁이 도입됐다.","en":"Reforms such as enterprise autonomy and semi-competitive elections were introduced."}},
       {"date":"1989","title":{"ko":"인민대의원대회","en":"The Congress of People’s Deputies"},"body":{"ko":"공개 선거와 생중계 토론이 정치의 문을 열었다.","en":"Open elections and televised debate opened the door of politics."}}
     ]$$::jsonb,
     '["Archie Brown, The Gorbachev Factor", "Encyclopaedia Britannica: Perestroika"]'::jsonb,
     NOW()),
    ('chernobyl', 106, '1986',
     '체르노빌 참사', 'The Chernobyl Disaster',
     '침묵의 체제는 재난 앞에서 무엇을, 언제 말해야 했는가?',
     'Faced with catastrophe, what and when should a system of silence have spoken?',
     '1986년 4월 26일, 우크라이나 체르노빌 원자력발전소의 4호기가 폭발해 대량의 방사성 물질이 유럽으로 퍼졌다. 초기에 사고를 축소·은폐한 관성은 글라스노스트를 표방한 새 지도부의 시험대가 됐다. 리시코프가 이끄는 정부위원회가 수습에 나섰고, 수십만 명의 「청산인」이 피폭을 무릅쓰고 동원됐다.',
     'On 26 April 1986, reactor no. 4 at the Chernobyl nuclear plant in Ukraine exploded, spreading large amounts of radioactive material across Europe. The reflex to minimize and conceal the accident became a test for a new leadership that professed glasnost. A government commission under Ryzhkov led the response, and hundreds of thousands of liquidators were mobilized at the risk of radiation.',
     '사고는 수많은 인명과 광대한 토지를 오염시켰고, 은폐가 드러나면서 체제의 신뢰가 크게 흔들렸다. 체르노빌은 글라스노스트를 가속한 계기이자 소련 체제의 취약함을 상징하는 사건이 됐다.',
     'The disaster cost many lives and contaminated vast lands, and as the cover-up came to light it badly shook trust in the system. Chernobyl accelerated glasnost and became a symbol of the fragility of the Soviet order.',
     $$[
       {"date":"1986.04.26","title":{"ko":"폭발","en":"The explosion"},"body":{"ko":"안전시험 중 4호기가 폭발해 노심이 파괴됐다.","en":"During a safety test, reactor no. 4 exploded and its core was destroyed."}},
       {"date":"1986.04–05","title":{"ko":"은폐와 지연","en":"Concealment and delay"},"body":{"ko":"초기 정보가 축소되고 주민 대피가 늦어졌다.","en":"Early information was minimized and the evacuation of residents was delayed."}},
       {"date":"1986.05","title":{"ko":"수습 작전","en":"The cleanup"},"body":{"ko":"정부위원회와 청산인들이 방사성 잔해를 처리하고 석관을 세웠다.","en":"The government commission and liquidators cleared radioactive debris and built the sarcophagus."}}
     ]$$::jsonb,
     '["Serhii Plokhy, Chernobyl: The History of a Nuclear Catastrophe", "Encyclopaedia Britannica: Chernobyl disaster"]'::jsonb,
     NOW()),
    ('revolutions-1989', 108, '1989',
     '1989년 동유럽 혁명', 'The Revolutions of 1989',
     '왜 이번에는 소련의 탱크가 오지 않았는가?',
     'Why, this time, did the Soviet tanks not come?',
     '1989년, 동유럽 전역에서 공산당 일당 체제가 잇따라 무너졌다. 헝가리는 국경을 열었고, 폴란드는 원탁회의로 자유선거에 이르렀으며, 베를린 장벽이 무너지고 루마니아에서는 차우셰스쿠가 처형됐다. 결정적 차이는 고르바초프가 1956년·1968년과 달리 무력 개입을 포기한 데 있었다.',
     'In 1989 one-party communist systems fell in quick succession across Eastern Europe. Hungary opened its border, Poland reached free elections through round-table talks, the Berlin Wall came down, and in Romania Ceaușescu was executed. The decisive difference was that Gorbachev, unlike in 1956 and 1968, renounced armed intervention.',
     '동유럽의 소비에트 블록이 해체되고 냉전의 분단선이 무너졌다. 「형제 국가」의 주권을 제한하던 브레즈네프 독트린은 폐기됐고, 이 물결은 곧 소련 자신에게 되돌아왔다.',
     'The Soviet bloc in Eastern Europe dissolved and the Cold War’s dividing line fell. The Brezhnev Doctrine that had limited the sovereignty of the fraternal states was abandoned, and the wave soon rebounded onto the Soviet Union itself.',
     $$[
       {"date":"1989.05","title":{"ko":"헝가리, 국경 개방","en":"Hungary opens the border"},"body":{"ko":"네메트 정부가 오스트리아와의 철조망을 걷어 냈다.","en":"The Németh government took down the fence along the Austrian border."}},
       {"date":"1989.06","title":{"ko":"폴란드 자유선거","en":"Free elections in Poland"},"body":{"ko":"원탁회의 뒤 치른 선거에서 연대노조가 압승했다.","en":"After round-table talks, Solidarity won a sweeping victory in the elections."}},
       {"date":"1989.11.09","title":{"ko":"베를린 장벽 붕괴","en":"The Berlin Wall falls"},"body":{"ko":"동독 체제가 무너지며 장벽이 열렸다.","en":"The East German system collapsed and the wall was opened."}},
       {"date":"1989.12","title":{"ko":"루마니아 혁명","en":"The Romanian revolution"},"body":{"ko":"봉기 끝에 차우셰스쿠 부부가 처형됐다.","en":"After an uprising, the Ceaușescus were executed."}}
     ]$$::jsonb,
     '["Victor Sebestyen, Revolution 1989: The Fall of the Soviet Empire", "Encyclopaedia Britannica: Revolutions of 1989"]'::jsonb,
     NOW()),
    ('soviet-collapse', 110, '1991',
     '8월 쿠데타와 소련의 해체', 'The August Coup and the Collapse of the USSR',
     '1917년에 태어난 국가는 어떻게 끝났는가?',
     'How did the state born in 1917 come to an end?',
     '1991년 8월, 신연방조약 체결을 막으려는 보수 강경파가 고르바초프를 감금하고 국가비상사태위원회를 세워 쿠데타를 일으켰다. 크류치코프·야조프·파블로프 등이 주도한 이 쿠데타는 옐친이 전차 위에 올라 저항하고 시민이 결집하면서 사흘 만에 무너졌다. 쿠데타의 실패는 오히려 연방의 해체를 가속했다.',
     'In August 1991, hardliners seeking to stop the signing of a new union treaty confined Gorbachev and set up a State Committee for the State of Emergency to stage a coup. Led by Kryuchkov, Yazov, Pavlov and others, the coup collapsed within three days as Yeltsin resisted atop a tank and citizens rallied. The coup’s failure only accelerated the dissolution of the union.',
     '쿠데타 실패 뒤 공산당은 활동을 멈췄고, 공화국들이 잇따라 독립을 선언했다. 1991년 12월 소련은 공식적으로 해체되었고 고르바초프는 사임했다. 70년간 이어진 소비에트 국가가 막을 내렸다.',
     'After the failed coup the Communist Party was suspended and the republics declared independence one after another. In December 1991 the Soviet Union was formally dissolved and Gorbachev resigned. The Soviet state that had lasted seventy years came to an end.',
     $$[
       {"date":"1991.08.19","title":{"ko":"쿠데타","en":"The coup"},"body":{"ko":"비상사태위원회가 고르바초프를 감금하고 권력 장악을 선언했다.","en":"The emergency committee confined Gorbachev and declared it had seized power."}},
       {"date":"1991.08.21","title":{"ko":"쿠데타 붕괴","en":"The coup collapses"},"body":{"ko":"옐친과 시민의 저항 속에 쿠데타가 사흘 만에 실패했다.","en":"Amid resistance by Yeltsin and citizens, the coup failed within three days."}},
       {"date":"1991.12.08","title":{"ko":"벨로베즈 협정","en":"The Belovezha Accords"},"body":{"ko":"러시아·우크라이나·벨라루스 지도자가 소련의 해체와 독립국가연합 창설을 선언했다.","en":"The leaders of Russia, Ukraine and Belarus declared the dissolution of the USSR and the founding of the Commonwealth of Independent States."}},
       {"date":"1991.12.25","title":{"ko":"고르바초프 사임","en":"Gorbachev resigns"},"body":{"ko":"고르바초프가 사임하고 크렘린의 소련 국기가 내려졌다.","en":"Gorbachev resigned, and the Soviet flag came down over the Kremlin."}}
     ]$$::jsonb,
     '["Serhii Plokhy, The Last Empire: The Final Days of the Soviet Union", "Encyclopaedia Britannica: Dissolution of the Soviet Union"]'::jsonb,
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
SELECT v.event_id, v.person_id, v.sort_order, v.relation_kind, v.relation_ko, v.relation_en, v.note_ko, v.note_en
FROM (VALUES
    -- Marshall Plan
    ('marshall-plan','stalin',0,'leader','원조 거부 결정','Rejected the aid','동유럽 국가들이 마셜 원조를 받는 것을 막고 진영 분리를 택했다.','He blocked the Eastern European states from taking Marshall aid and chose to divide the blocs.'),
    ('marshall-plan','molotov',1,'executor','파리 회담 결렬','Broke off the Paris talks','소련 대표단을 이끌고 파리 회담에서 퇴장했다.','He led the Soviet delegation out of the Paris talks.'),
    ('marshall-plan','zhdanov',2,'executor','「두 진영」과 코민포름','Two camps and the Cominform','「두 진영」론을 선언하고 코민포름을 세워 진영 대립을 제도화했다.','He proclaimed the doctrine of two camps and founded the Cominform, institutionalizing the bloc conflict.'),
    ('marshall-plan','vyshinsky',3,'participant','유엔 외교','UN diplomacy','유엔 무대에서 마셜 플랜을 침략적 도구로 규탄했다.','At the UN he denounced the Marshall Plan as a tool of aggression.'),
    ('marshall-plan','klement-gottwald',4,'participant','거부를 강요받은 체코','Czechoslovakia forced to reject','원조 수락을 검토했으나 모스크바의 압력으로 철회한 체코슬로바키아 지도자였다.','The Czechoslovak leader who explored accepting the aid but withdrew under pressure from Moscow.'),
    ('marshall-plan','wladyslaw-gomulka',5,'participant','거부를 강요받은 폴란드','Poland forced to decline','원조에 관심을 보였으나 결국 거부해야 했던 폴란드 지도자였다.','The Polish leader who showed interest in the aid but was made to decline.'),
    -- Kosygin Reform
    ('kosygin-reform','kosygin',0,'leader','개혁 주도','Led the reform','총리로서 기업 자율성과 수익성 지표를 확대하는 개혁을 이끌었다.','As premier, he led the reform widening enterprise autonomy and profitability measures.'),
    ('kosygin-reform','yevsei-liberman',1,'participant','이론적 촉매','Theoretical catalyst','이윤 지표 도입을 제안해 개혁의 이론적 촉매가 됐다.','His proposal to introduce profit indicators was the theoretical catalyst of the reform.'),
    ('kosygin-reform','leonid-kantorovich',2,'participant','수리경제 최적화','Mathematical optimization','계획을 수학으로 최적화하려 한 노벨상 경제학자였다.','A Nobel-winning economist who sought to optimize the plan through mathematics.'),
    ('kosygin-reform','viktor-glushkov',3,'participant','사이버네틱 계획','Cybernetic planning','전국 네트워크(OGAS)로 계획경제를 관리하려 한 사이버네틱스 학자였다.','A cyberneticist who sought to manage the planned economy through a nationwide network (OGAS).'),
    ('kosygin-reform','vasily-nemchinov',4,'participant','수리경제학','Mathematical economics','계획의 과학화를 꿈꾼 수리경제학의 조직자였다.','An organizer of mathematical economics who dreamed of putting planning on a scientific basis.'),
    ('kosygin-reform','brezhnev',5,'opponent','개혁을 제한','Curbed the reform','정치적 위험을 경계하며 개혁의 범위를 좁혔다.','Wary of the political risk, he narrowed the scope of the reform.'),
    ('kosygin-reform','suslov',6,'opponent','이념적 보수','Ideological conservative','당의 이념 책임자로 시장 지향 개혁에 반대했다.','As the party’s ideology chief, he opposed the market-oriented reform.'),
    -- Soviet-Afghan War
    ('afghanistan-war','brezhnev',0,'executor','침공 결정','Ordered the intervention','병약한 지도부의 정점에서 아프가니스탄 개입을 승인했다.','At the head of an ailing leadership, he approved the intervention in Afghanistan.'),
    ('afghanistan-war','ustinov',1,'executor','국방장관, 강력 주창','Defense minister, chief advocate','국방장관으로 군사 개입을 가장 강하게 밀어붙였다.','As defense minister, he pushed hardest for the military intervention.'),
    ('afghanistan-war','andropov',2,'executor','KGB, 개입 추진','KGB, pushed for it','KGB 의장으로 개입 결정의 핵심 3인 중 하나였다.','As KGB chairman, he was one of the three central figures behind the decision.'),
    ('afghanistan-war','gromyko',3,'executor','외교','Foreign minister','외무장관으로 개입 결정에 함께했다.','As foreign minister, he joined in the decision to intervene.'),
    ('afghanistan-war','gorbachev',4,'participant','철군을 명령','Ordered the withdrawal','1989년 소련군의 완전 철수를 명령해 전쟁을 끝냈다.','In 1989 he ordered the complete withdrawal of Soviet forces, ending the war.'),
    -- Perestroika
    ('perestroika','gorbachev',0,'leader','개혁의 주도자','Author of the reforms','페레스트로이카와 글라스노스트를 내걸어 체제를 되살리려 했다.','He launched perestroika and glasnost in an attempt to revive the system.'),
    ('perestroika','yakovlev',1,'participant','글라스노스트의 설계자','Architect of glasnost','이념 담당으로서 검열을 풀고 개방을 설계했다.','As ideology chief, he lifted censorship and designed the opening.'),
    ('perestroika','shevardnadze',2,'participant','냉전을 끝낸 외교','Cold-War-ending diplomacy','외무장관으로 군축과 화해로 냉전을 끝으로 이끌었다.','As foreign minister, he steered the Cold War to its end through disarmament and reconciliation.'),
    ('perestroika','ryzhkov',3,'participant','경제개혁 총리','Reform-era premier','총리로서 경제개혁의 실무를 맡았다.','As premier, he managed the practical side of economic reform.'),
    ('perestroika','abel-aganbegyan',4,'participant','수석 경제고문','Chief economic adviser','고르바초프의 수석 경제고문으로 시장개혁을 설계했다.','As Gorbachev’s chief economic adviser, he designed the market reforms.'),
    ('perestroika','tatyana-zaslavskaya',5,'participant','지적 뇌관','Intellectual detonator','사회학으로 체제의 병폐를 진단해 개혁의 지적 뇌관이 됐다.','Through sociology she diagnosed the ills of the system and became an intellectual detonator of reform.'),
    ('perestroika','leonid-abalkin',6,'participant','「규제된 시장」 설계','Designer of the regulated market','급진파와 보수파 사이에서 「규제된 시장」 노선을 설계했다.','He designed a regulated-market line between the radicals and the conservatives.'),
    ('perestroika','ligachev',7,'opponent','보수적 제2서기','Conservative second secretary','당의 제2서기로 개혁의 속도와 방향에 제동을 걸었다.','As the party’s second secretary, he braked the pace and direction of reform.'),
    ('perestroika','yeltsin',8,'opponent','급진 비판자','Radical critic','개혁이 너무 느리다며 급진 노선에서 고르바초프를 비판했다.','He attacked Gorbachev from the radical side, arguing the reforms were too slow.'),
    -- Chernobyl
    ('chernobyl','gorbachev',0,'leader','글라스노스트의 시험대','Test of glasnost','은폐의 관성과 개방의 약속 사이에서 시험대에 올랐다.','He was tested between the reflex of concealment and the promise of openness.'),
    ('chernobyl','ryzhkov',1,'executor','정부위원회 위원장','Head of the commission','총리로서 사고 수습을 지휘한 정부위원회를 이끌었다.','As premier, he led the government commission that directed the response.'),
    ('chernobyl','slavsky',2,'participant','핵산업 책임자','Head of the nuclear industry','원자로를 건설한 중형기계공업 장관으로 사고 뒤 물러났다.','The minister of medium machine building whose bureau built the reactor; he stepped down after the accident.'),
    -- Revolutions of 1989
    ('revolutions-1989','gorbachev',0,'leader','무력 개입을 포기','Renounced intervention','1956년·1968년과 달리 무력 개입을 포기해 변화를 허용했다.','Unlike in 1956 and 1968, he renounced armed intervention and allowed the change.'),
    ('revolutions-1989','miklos-nemeth',1,'participant','헝가리 국경 개방','Hungary opens its border','개혁 총리로 오스트리아와의 국경을 열어 물결의 첫 틈을 냈다.','As reform premier, he opened the border with Austria, making the first breach in the wave.'),
    ('revolutions-1989','wojciech-jaruzelski',2,'participant','폴란드 원탁회의','Poland’s round table','계엄령의 지도자에서 원탁회의로 이행을 이끈 폴란드 지도자였다.','The Polish leader who moved from martial law to a round table leading the transition.'),
    ('revolutions-1989','petar-mladenov',3,'participant','불가리아 전환','Bulgaria’s transition','지프코프를 밀어내고 불가리아의 전환을 연 외교관 출신 지도자였다.','A diplomat-turned-leader who pushed out Zhivkov and opened Bulgaria’s transition.'),
    ('revolutions-1989','erich-honecker',4,'target','무너진 동독 지도자','Fallen East German leader','장벽의 공화국을 장기 통치했으나 1989년 실각했다.','He long ruled the republic of the wall but was ousted in 1989.'),
    ('revolutions-1989','nicolae-ceausescu',5,'target','처형된 루마니아 지도자','Executed Romanian leader','개인숭배로 루마니아를 통치했으나 봉기 끝에 처형됐다.','He ruled Romania through a personality cult but was executed after an uprising.'),
    ('revolutions-1989','janos-kadar',6,'target','저무는 헝가리 체제','The waning Hungarian system','1956년 이후 헝가리를 이끌었으나 그의 체제가 해체되던 1989년 사망했다.','He had led Hungary since 1956 but died in 1989 as his system was dismantled.'),
    -- Collapse of the USSR
    ('soviet-collapse','gorbachev',0,'leader','무너지는 연방의 대통령','President of the collapsing union','개혁을 이끌었으나 쿠데타와 해체 앞에서 권력을 잃고 사임했다.','He led the reforms but lost power before the coup and the dissolution, and resigned.'),
    ('soviet-collapse','yeltsin',1,'leader','전차 위의 저항','Resistance atop a tank','전차 위에 올라 쿠데타에 맞섰고 러시아 대통령으로 해체를 이끌었다.','He stood atop a tank against the coup and, as Russian president, led the dissolution.'),
    ('soviet-collapse','kryuchkov',2,'executor','쿠데타 설계','Coup mastermind','KGB 의장으로 8월 쿠데타를 설계했다.','As KGB chairman, he masterminded the August coup.'),
    ('soviet-collapse','yazov',3,'executor','쿠데타의 국방장관','Coup defense minister','국방장관으로 쿠데타에 군을 동원했다.','As defense minister, he mobilized the army for the coup.'),
    ('soviet-collapse','pavlov',4,'executor','쿠데타 가담 총리','Coup-plotting premier','소련의 마지막 총리로 쿠데타에 가담했다.','The last Soviet premier, he joined the coup.'),
    ('soviet-collapse','gennady-yanayev',5,'executor','쿠데타의 얼굴','Face of the coup','부통령으로 비상사태위원회를 대표한 쿠데타의 얼굴이었다.','As vice-president, he fronted the emergency committee and became the face of the coup.'),
    ('soviet-collapse','shevardnadze',6,'participant','독재를 경고','Warned of dictatorship','1990년 사임하며 다가오는 독재를 경고한 외무장관이었다.','The foreign minister who resigned in 1990 warning of a coming dictatorship.')
) AS v(event_id, person_id, sort_order, relation_kind, relation_ko, relation_en, note_ko, note_en)
WHERE EXISTS (SELECT 1 FROM commulingo_people p WHERE p.id = v.person_id)
ON CONFLICT (event_id, person_id) DO UPDATE SET
    sort_order = EXCLUDED.sort_order, relation_kind = EXCLUDED.relation_kind,
    relation_ko = EXCLUDED.relation_ko, relation_en = EXCLUDED.relation_en,
    note_ko = EXCLUDED.note_ko, note_en = EXCLUDED.note_en;
