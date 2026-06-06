function t(ko, en) {
    return { ko, en };
}

function q(answer, koPrompt, enPrompt, koChoices, enChoices, koExplanation, enExplanation) {
    function explainTheoristPrompt(ko, en) {
        const notes = [
            {
                test: /카우츠키|Kautsky/,
                ko: '여기서 카우츠키의 주장은 제국주의를 독점자본주의의 구조가 아니라 산업자본이 선택할 수 있는 정책, 또는 강대국들이 평화적으로 결합할 수 있는 “초제국주의” 전망으로 보는 입장이다.',
                en: 'Here Kautsky’s claim treats imperialism not as the structure of monopoly capitalism, but as a policy industrial capital might choose, or as a possible “ultra-imperialist” peaceful combination of great powers.',
            },
            {
                test: /홉슨|Hobson/,
                ko: '홉슨은 제국주의의 폭력과 금융 이해를 비판한 부르주아 비판자지만, 레닌이 보기에 독점자본주의의 계급적 토대까지는 분석하지 못했다.',
                en: 'Hobson is a bourgeois critic who criticizes imperialist violence and financial interests, but for Lenin he does not reach the class basis of monopoly capitalism.',
            },
            {
                test: /마르크스와 엥겔스|Marx and Engels/,
                ko: '이 언급은 영국의 식민지 초과이윤이 일부 노동자 상층과 기회주의를 떠받칠 수 있다는 문제를 가리킨다.',
                en: 'This reference concerns the problem that British colonial superprofits could support upper layers of workers and opportunism.',
            },
            {
                test: /세실 로즈|Cecil Rhodes/,
                ko: '세실 로즈의 주장은 식민지 팽창을 국내 실업과 사회불안을 완화하는 출구로 정당화하는 제국주의 정치인의 논리다.',
                en: 'Cecil Rhodes’s claim justifies colonial expansion as an outlet for domestic unemployment and social unrest.',
            },
        ];
        const found = notes.find((note) => note.test.test(ko) || note.test.test(en));
        if (!found) return [ko, en];
        const koWithNote = ko.includes(found.ko) ? ko : ko + ' ' + found.ko;
        const enWithNote = en.includes(found.en) ? en : en + ' ' + found.en;
        return [koWithNote, enWithNote];
    }

    const [explainedKoPrompt, explainedEnPrompt] = explainTheoristPrompt(koPrompt, enPrompt);

    function ordered(choices) {
        return [
            choices[answer],
            ...choices.filter((_, index) => index !== answer),
        ];
    }
    return {
        type: 'multiple_choice',
        points: 0,
        prompt: t(explainedKoPrompt, explainedEnPrompt),
        choices: { ko: ordered(koChoices), en: ordered(enChoices) },
        answer: 0,
        explanation: t(koExplanation, enExplanation),
    };
}

function lesson(ch, level, titleKo, titleEn, questions) {
    const lessonQuestions = level === 'basic' && modernApplicationQuestions[ch]
        ? [...questions.slice(0, 4), modernApplicationQuestions[ch]]
        : questions;
    return {
        id: `imperialism-ch${String(ch).padStart(2, '0')}-${level}`,
        level,
        title: t(titleKo, titleEn),
        questions: lessonQuestions.map((item, index) => ({
            ...item,
            id: `q${index + 1}`,
            points: level === 'advanced' ? 3 : 2,
        })),
    };
}

function map(ko, en) {
    return {
        ko: ko.map(([title, text]) => ({ title, text })),
        en: en.map(([title, text]) => ({ title, text })),
    };
}

const briefNotes = {
    1: t(
        '집중은 기업이 커지는 현상이고, 독점은 그 집중이 가격·생산량·시장·원료를 통제하는 힘으로 굳어진 단계다. 레닌의 핵심은 독점이 자유경쟁 바깥에서 온 예외가 아니라 자유경쟁 자체가 낳은 결과라는 점이다.',
        'Concentration is the growth of giant firms; monopoly is the stage where concentration hardens into power over prices, output, markets, and raw materials. Lenin’s point is that monopoly is not an exception from outside free competition, but its own result.'
    ),
    2: t(
        '은행은 단순한 송금·결제 중개자가 아니다. 예금, 계좌, 지점망, 신용 정보를 집중하면서 어떤 기업에 돈을 줄지 끊을지 결정하는 통제 기관으로 변한다.',
        'Banks are not mere payment middlemen. By concentrating deposits, accounts, branch networks, and credit information, they become institutions of control deciding which firms receive or lose credit.'
    ),
    3: t(
        '금융자본은 은행자본과 산업자본이 독점 단계에서 융합한 자본이다. 금융과두제는 이 융합을 이용해 적은 직접 소유로도 참여제도와 지분망을 통해 거대한 자본을 지배하는 층이다.',
        'Finance capital is the fusion of bank capital and industrial capital in the monopoly stage. The financial oligarchy is the layer that uses this fusion, participation systems, and shareholding chains to control vast capital with limited direct ownership.'
    ),
    4: t(
        '상품수출은 물건을 파는 것이고, 자본수출은 돈이나 생산자본을 해외에 투자해 이자·배당·이윤을 얻는 것이다. 레닌에게 제국주의 단계의 특징은 상품수출보다 자본수출의 비중이 결정적으로 커지는 데 있다.',
        'Export of commodities means selling goods; export of capital means investing money or productive capital abroad to obtain interest, dividends, or profit. For Lenin, the imperialist stage is marked by the decisive growth of capital export.'
    ),
    5: t(
        '세계분할은 단순한 지도 색칠이 아니다. 국제 카르텔과 독점체들이 판매시장, 원료지, 투자처를 자본력에 따라 나누는 경제적 분할이다. 자본력은 불균등하게 변하므로 분할은 언제나 재분할 압력을 낳는다.',
        'World division is not merely colouring maps. International cartels and monopolies divide markets, raw materials, and investment fields according to capital strength. Since capital strength changes unevenly, division creates pressure for redivision.'
    ),
    6: t(
        '식민지, 반식민지, 세력권은 지배의 강도가 다른 형태다. 레닌은 직접 통치만 보지 않고, 차관·철도·항만·외국 금융을 통한 종속도 세계분할의 일부로 본다.',
        'Colonies, semi-colonies, and spheres of influence are different forms of domination. Lenin does not look only at direct rule; dependence through loans, railways, ports, and foreign finance also belongs to world partition.'
    ),
    7: t(
        '레닌의 짧은 정의는 제국주의를 독점 단계의 자본주의라고 잡는다. 다섯 특징은 생산집중과 독점, 금융자본, 자본수출, 국제 독점체의 세계분할, 열강의 영토분할이다.',
        'Lenin’s short definition identifies imperialism as capitalism at the monopoly stage. The five features are concentration and monopoly, finance capital, export of capital, world division by international monopolies, and territorial division by great powers.'
    ),
    8: t(
        '기생성은 발전이 완전히 멈춘다는 뜻이 아니다. 독점이 기술과 생산을 발전시키면서도 금리생활자, 초과이윤, 노동귀족 매수, 정체 경향을 함께 낳는 모순적 성격을 뜻한다.',
        'Parasitism does not mean development simply stops. It names the contradictory character by which monopoly can develop technique and production while also producing rentiers, superprofits, bribery of a labour aristocracy, and stagnation tendencies.'
    ),
    9: t(
        '레닌의 비판 대상은 제국주의를 나쁜 정책이나 금융만의 일탈로 보는 설명이다. 카우츠키 비판의 핵심은 제국주의가 독점자본주의의 경제구조이지 선택 가능한 평화정책의 반대말이 아니라는 점이다.',
        'Lenin targets explanations that treat imperialism as a bad policy or a deviation of finance alone. His critique of Kautsky insists that imperialism is the economic structure of monopoly capitalism, not merely the opposite of a selectable peaceful policy.'
    ),
    10: t(
        '역사적 위치란 제국주의가 자본주의 발전에서 어떤 단계인가를 묻는 말이다. 레닌은 그것을 독점자본주의, 기생적·부패한 자본주의, 이행기의 자본주의로 종합한다.',
        'Historical place asks what stage imperialism occupies in capitalist development. Lenin synthesizes it as monopoly capitalism, parasitic and decaying capitalism, and capitalism in transition.'
    ),
};

const termNotes = {
    1: t(
        '카르텔은 독립 기업들이 가격·생산량·판매구역을 맞추는 담합이다. 신디케이트는 각 기업이 생산은 따로 하지만 판매를 한 조직으로 묶는 공동 판매조직이다. 트러스트는 여러 기업이 사실상 하나의 지휘 아래 묶인 통합된 기업집단이다.',
        'A cartel is collusion among formally separate firms over prices, output, or territories. A syndicate is a joint sales organization: firms may produce separately but sell through one body. A trust is an integrated corporate group under unified command.'
    ),
    2: t(
        '계열 또는 참여는 대은행이 작은 은행·기업을 완전히 합병하지 않아도 지분, 대출, 이사회, 결제망으로 묶는 방식이다. 당좌계정은 기업의 입출금과 거래 흐름이 계속 드러나는 은행 계좌다.',
        'Affiliation or participation means a big bank can bind smaller banks and firms through shares, loans, boards, and payment networks without fully merging them. A current account reveals a firm’s continuing payment and transaction flows.'
    ),
    3: t(
        '금융자본은 단순히 돈이 많은 자본이 아니라 대은행과 산업독점이 결합한 자본이다. 금융과두제는 그 결합을 지분망, 참여제도, 주식발행, 국가대출로 지배하는 소수 금융-산업 집단이다.',
        'Finance capital is not just capital with a lot of money; it is the fusion of big banks and industrial monopoly. Financial oligarchy is the small finance-industrial layer ruling through holdings, participation systems, share issues, and state loans.'
    ),
    4: t(
        '상품수출은 물건을 해외에 파는 것이고, 자본수출은 대출·채권·직접투자처럼 자본 자체를 해외에 보내 이자·배당·이윤을 얻는 것이다. 차관은 국가나 기업에 빌려주는 큰 대출이다.',
        'Export of goods means selling commodities abroad. Export of capital means sending capital itself abroad through loans, bonds, or direct investment to obtain interest, dividends, or profit. A loan here is a large credit to a state or firm.'
    ),
    5: t(
        '국제 카르텔은 여러 나라의 독점기업들이 세계시장, 판매구역, 특허, 원료지를 나누는 국제 담합이다. “분할”은 지도를 칠하는 일만이 아니라 시장과 투자처를 자본력에 따라 배정하는 경제적 행위다.',
        'An international cartel is international collusion among monopolies dividing world markets, sales territories, patents, or raw materials. “Partition” is not only map-colouring; it is the economic allocation of markets and investment fields according to capital strength.'
    ),
    6: t(
        '식민지는 직접 통치되는 종속지다. 반식민지는 형식적 독립은 남아도 차관, 항만, 철도, 외국 군사·금융 압력에 묶인 나라다. 세력권은 특정 강대국이 투자와 외교에서 우선권을 주장하는 지역이다.',
        'A colony is a directly ruled dependency. A semi-colony remains formally independent but is bound by loans, ports, railways, and foreign military or financial pressure. A sphere of influence is a region where a great power claims priority in investment and diplomacy.'
    ),
    7: t(
        '레닌의 “짧은 정의”는 제국주의를 독점 단계의 자본주의로 잡는 압축 공식이다. “다섯 특징”은 그 압축 정의를 생산집중, 금융자본, 자본수출, 국제 독점체, 영토분할로 풀어 쓴 목록이다.',
        'Lenin’s “short definition” compresses imperialism as capitalism at the monopoly stage. The “five features” spell that definition out as concentration, finance capital, export of capital, international monopolies, and territorial partition.'
    ),
    8: t(
        '금리생활자는 생산을 직접 지휘하지 않고 이자·배당·채권수익으로 사는 층이다. 노동귀족은 제국주의 초과이윤의 일부로 상대적으로 안정된 지위를 얻어 기회주의에 끌릴 수 있는 노동자 상층을 뜻한다.',
        'A rentier is someone living from interest, dividends, or bond income without directly directing production. Labour aristocracy means an upper layer of workers whose relatively secure position can be supported by a share of imperialist superprofits and drawn toward opportunism.'
    ),
    9: t(
        '소부르주아 비판은 독점과 금융자본의 토대를 건드리기보다 “정직한 경쟁”이나 규제 강화로 돌아가려는 비판이다. 초제국주의는 강대국들이 하나의 평화적 세계연합처럼 결합할 수 있다는 카우츠키의 전망이다.',
        'Petty-bourgeois critique seeks a return to “honest competition” or stronger regulation rather than attacking monopoly and finance capital. Ultra-imperialism is Kautsky’s prospect that great powers could combine into something like one peaceful world alliance.'
    ),
    10: t(
        '“기생적·부패한 자본주의”는 성장이 멈춘다는 뜻이 아니라 독점, 금리생활자, 초과이윤, 노동귀족 매수, 정체 경향이 빠른 성장과 함께 나타날 수 있다는 말이다. “이행기”는 사회화된 생산이 사적 소유의 껍질과 충돌하는 단계라는 뜻이다.',
        '“Parasitic and decaying capitalism” does not mean growth stops; monopoly, rentiers, superprofits, bribery of labour aristocracy, and stagnation tendencies can coexist with rapid growth. “Transition” means socialized production clashes with the shell of private ownership.'
    ),
};

const modernExamples = {
    1: t(
        '클라우드 컴퓨팅에서 몇몇 거대 플랫폼이 데이터센터, 반도체 조달, 개발자 생태계, 가격조건을 좌우한다면, 단순히 “큰 회사가 많다”가 아니라 집중이 독점적 통제력으로 바뀌는지를 물어야 한다.',
        'In cloud computing, if a few giant platforms control data centers, chip procurement, developer ecosystems, and pricing terms, ask whether concentration has become monopolistic control, not merely whether firms are large.'
    ),
    2: t(
        '대형 결제망이나 클라우드 금융 인프라가 수많은 스타트업의 매출 흐름과 신용 접근을 쥔다면, 은행의 “새로운 역할”처럼 정보와 신용이 통제 권력으로 바뀌는지를 볼 수 있다.',
        'If a large payment network or cloud financial infrastructure controls revenue flows and credit access for many startups, it resembles the bank’s “new role”: information and credit become power of control.'
    ),
    3: t(
        '거대 투자회사와 은행이 반도체, 방산, 클라우드 기업 지분과 채권, 정부 보조금, 이사회 네트워크를 동시에 쥔다면, 금융과 산업의 분리보다 지배망의 결합을 분석해야 한다.',
        'If giant asset managers and banks hold shares, bonds, subsidies, and board networks across semiconductors, defense, and cloud firms, analyze the combined network of rule rather than a clean separation of finance and industry.'
    ),
    4: t(
        '해외 데이터센터, 광산, 배터리 공장, 항만에 대한 대출과 직접투자가 장기 구매계약과 현지 정책 조건을 동반한다면, 이는 단순 상품수출보다 자본수출의 논리에 가깝다.',
        'If loans and direct investments in overseas data centers, mines, battery factories, or ports bring long-term purchase contracts and policy conditions, this follows the logic of capital export more than simple goods export.'
    ),
    5: t(
        '반도체 장비, 해저케이블, 위성망, 전기차 배터리 원료에서 기업들이 공급권역과 특허 사용, 장기 구매처를 나눈다면, 오늘의 세계분할도 시장·기술·원료 배정의 형태로 나타난다.',
        'If firms in semiconductor equipment, submarine cables, satellite networks, or EV battery materials divide supply zones, patent use, and long-term buyers, today’s world division appears as allocation of markets, technology, and raw materials.'
    ),
    6: t(
        '어떤 국가는 정치적으로 독립되어도 핵심 항만 운영권, 외채 조건, 군사기지, 희토류 채굴권이 특정 강대국과 금융기관에 묶일 수 있다. 이때 형식 독립과 실질 종속을 구분해야 한다.',
        'A country can be politically independent while key port operations, debt terms, military bases, or rare-earth concessions are tied to a particular great power and financial institutions. Distinguish formal independence from material dependence.'
    ),
    7: t(
        '오늘의 제국주의를 볼 때 군사개입 하나만 보지 말고, 독점 플랫폼, 금융 지배, 해외투자, 공급망 분할, 군사동맹이 함께 작동하는지를 다섯 특징의 묶음으로 점검한다.',
        'When analyzing imperialism today, do not look only at military intervention. Check whether monopoly platforms, financial rule, foreign investment, supply-chain partition, and military alliances operate together as a bundle of features.'
    ),
    8: t(
        '고성장 기술기업이 동시에 특허 봉쇄, 자사주 매입, 배당, 하청 노동 압박, 일부 고임금 기술직 포섭을 만들어 낸다면, 빠른 성장과 기생성·부패가 함께 갈 수 있다는 관점으로 볼 수 있다.',
        'If fast-growing tech firms also produce patent blocking, buybacks, dividends, subcontracted labour pressure, and co-optation of some high-paid technical workers, this shows how rapid growth can coexist with parasitism and decay.'
    ),
    9: t(
        '빅테크나 금융자본의 문제를 “공정경쟁법을 조금 강화하자”는 수준으로만 다루면, 독점과 금융자본의 토대를 건드리지 않는 비판이 된다. 레닌식 질문은 그 지배구조 자체를 묻는다.',
        'If the problem of Big Tech or finance capital is treated only as “slightly stronger fair-competition law,” the critique leaves monopoly and finance capital intact. Lenin’s question targets the structure of rule itself.'
    ),
    10: t(
        'AI 인프라, 반도체, 클라우드, 물류가 전 세계적으로 계획되고 연결되지만 소유와 이윤은 소수 기업과 금융집단에 집중된다면, 사회화된 생산과 사적 전유의 충돌이라는 최종 장의 논리로 읽을 수 있다.',
        'If AI infrastructure, semiconductors, cloud, and logistics are globally planned and connected while ownership and profit concentrate in a few firms and financial groups, read this through the final chapter’s contradiction between socialized production and private appropriation.'
    ),
};

const modernApplicationQuestions = {
    1: q(
        0,
        '현대 클라우드 시장에서 세 기업이 데이터센터, AI 반도체 조달, 개발자 도구, 가격조건을 장악하고 중소 서비스가 이 인프라 없이는 운영되기 어렵다고 하자. 1장의 집중과 독점 개념으로 가장 먼저 물어야 할 것은 무엇인가?',
        'In today’s cloud market, suppose three firms control data centers, AI chip procurement, developer tools, and pricing terms, and smaller services can hardly operate without this infrastructure. Using Chapter 1’s concepts of concentration and monopoly, what should we ask first?',
        [
            '대규모 생산 집중이 가격·기술·접근 조건을 좌우하는 독점적 통제력으로 바뀌었는가를 보아야 한다.',
            '기업 수가 셋이면 경쟁이 충분하므로 독점 문제는 사라진다고 보아야 한다.',
            '디지털 서비스는 물질적 원료가 없으므로 생산 집중과 무관하다고 보아야 한다.',
            '개발자가 무료 계정을 만들 수 있으면 사적 전유 문제도 없어졌다고 보아야 한다.',
        ],
        [
            'Ask whether large-scale concentration has become monopolistic control over prices, technique, and access conditions.',
            'If there are three firms, competition is sufficient and monopoly is no longer an issue.',
            'Digital services have no material raw materials, so concentration of production is irrelevant.',
            'If developers can create free accounts, private appropriation has disappeared.',
        ],
        '현대 사례에서도 핵심은 “큰 회사” 자체가 아니라 관문 통제다. 데이터센터, 칩, 도구, 가격조건을 쥔 기업은 생산의 사회적 연결망을 사적 이윤에 맞게 조정할 수 있다.',
        'The key in a modern case is not firm size alone but control of gateways. Firms controlling data centers, chips, tools, and pricing can organize a social production network around private profit.'
    ),
    2: q(
        1,
        '어떤 대형 결제 플랫폼이 온라인 상점들의 매출 흐름, 환불 기록, 대출 심사, 계정 정지 권한을 모두 쥐고 있다. 2장의 은행 분석을 적용하면 무엇이 드러나는가?',
        'A major payment platform controls online shops’ revenue flows, refund records, loan scoring, and account suspensions. Applying Chapter 2’s analysis of banks, what becomes visible?',
        [
            '결제 플랫폼은 판매자를 도와주는 기술 도구일 뿐이고 신용 권력과는 무관하다.',
            '거래 정보와 신용 접근을 집중한 기관이 상점의 생존 조건을 좌우하는 통제 권력이 될 수 있다.',
            '온라인 결제는 은행이 아니므로 자본 집중 분석에서 제외해야 한다.',
            '계정 정지는 개별 약관 문제일 뿐 시장 구조와 연결되지 않는다.',
        ],
        [
            'A payment platform is only a technical helper and has no relation to credit power.',
            'An institution concentrating transaction information and credit access can become a power controlling shops’ conditions of survival.',
            'Online payments are not banks, so they must be excluded from analysis of capital concentration.',
            'Account suspension is only a matter of individual terms and has no link to market structure.',
        ],
        '레닌의 은행 분석은 결제 중개가 정보와 신용 통제로 바뀌는 지점을 본다. 오늘의 결제·금융 플랫폼도 매출 데이터와 대출 접근을 쥐면 기업을 종속시킬 수 있다.',
        'Lenin’s bank analysis looks at the point where payment mediation becomes control over information and credit. Today’s payment and finance platforms can subordinate firms when they control revenue data and credit access.'
    ),
    3: q(
        2,
        '한 투자그룹이 반도체 기업, 클라우드 기업, 방산 기업의 지분과 채권을 보유하고 정부 보조금 자문과 이사회 인맥까지 연결한다. 이 사례를 단순한 포트폴리오 투자로만 보면 무엇을 놓치는가?',
        'An investment group holds shares and bonds in semiconductor, cloud, and defense firms while also connecting subsidy advice and board networks. What is missed if this is treated as only portfolio investment?',
        [
            '금융투자는 생산현장 밖의 일이라 산업 지배와 분리해서 보아야 한다.',
            '여러 산업에 투자하면 위험이 분산되므로 지배력은 약해진다.',
            '은행·증권·산업 지분·국가 지원이 얽혀 소수 집단이 광범한 자본 흐름을 지휘하는 구조를 보아야 한다.',
            '정부 보조금이 들어가면 그 기업은 더 이상 자본주의 기업이 아니다.',
        ],
        [
            'Financial investment happens outside production and should be separated from industrial rule.',
            'Investment across many industries only spreads risk, so control weakens.',
            'We should see the structure in which banks, securities, industrial holdings, and state support let a small group command broad capital flows.',
            'Once state subsidies are involved, the firm is no longer capitalist.',
        ],
        '금융자본은 금융과 산업이 깨끗이 분리된 상태가 아니라 서로 얽힌 지배망이다. 지분, 채권, 이사회, 보조금, 대출 조건이 결합하면 금융과두제의 통제가 넓어진다.',
        'Finance capital is not a clean separation of finance and industry but an interwoven command network. Shares, bonds, boards, subsidies, and loan conditions widen oligarchic control.'
    ),
    4: q(
        0,
        '한 강대국의 은행과 기업이 해외 배터리 광산에 대출과 지분투자를 제공하면서 장기 구매계약, 항만 사용권, 현지 세제 혜택을 조건으로 건다. 4장의 자본수출 개념으로 가장 적절한 설명은 무엇인가?',
        'Banks and firms from a great power lend to and invest in an overseas battery mine while requiring long-term purchase contracts, port rights, and local tax privileges. What is the best Chapter 4 explanation of export of capital?',
        [
            '자본이 해외로 나가 이자·이윤을 얻는 동시에 원료, 계약, 정책 조건을 묶는 자본수출 사례다.',
            '광물을 나중에 수입하므로 단순 상품수출만 있고 자본수출은 없다.',
            '대출이 포함되면 기업 이윤과 무관한 순수 원조가 된다.',
            '현지 세제 혜택이 있으면 채무국이 금융자본을 완전히 통제한다.',
        ],
        [
            'It is export of capital: capital goes abroad for interest and profit while tying in raw materials, contracts, and policy conditions.',
            'Because minerals are later imported, this is only export of goods and not export of capital.',
            'Once a loan is involved, it becomes pure aid unrelated to corporate profit.',
            'If local tax privileges exist, the debtor country fully controls finance capital.',
        ],
        '레닌에게 자본수출은 돈의 이동만이 아니다. 차관과 투자는 원료지, 구매계약, 항만, 정책 조건을 함께 묶어 채권국 자본의 영향력을 넓힌다.',
        'For Lenin, export of capital is not just money moving abroad. Loans and investments bind raw materials, purchase contracts, ports, and policy conditions, expanding the creditor capital’s influence.'
    ),
    5: q(
        3,
        '몇몇 글로벌 반도체 장비 기업이 특정 지역에는 장비를 팔지 않고, 다른 지역에는 장기 서비스 계약과 특허 사용 조건을 묶어 공급권역을 사실상 나눈다. 5장의 관점에서 이는 무엇에 가까운가?',
        'Several global semiconductor-equipment firms refuse to sell into some regions and tie other regions to long-term service contracts and patent-use terms, effectively dividing supply zones. From Chapter 5’s standpoint, what is this closest to?',
        [
            '기술 서비스라서 세계시장 분할과 무관하다.',
            '모든 구매자가 같은 조건을 받으므로 독점 문제가 없다.',
            '국가가 개입하지 않으면 국제 독점체로 볼 수 없다.',
            '시장·기술·서비스 접근을 자본력과 협정에 따라 나누는 현대적 세계분할이다.',
        ],
        [
            'Because it is technical service, it has no relation to world-market division.',
            'All buyers receive the same conditions, so there is no monopoly issue.',
            'Without direct state action, it cannot be treated as international monopoly.',
            'It is a modern world division of markets, technology, and service access according to capital strength and agreements.',
        ],
        '5장의 세계분할은 지도 색칠만이 아니다. 오늘날에는 장비, 특허, 유지보수, 공급권역을 나누는 방식으로도 국제 독점의 분할이 나타날 수 있다.',
        'Chapter 5’s world division is not only map-colouring. Today it can appear through the division of equipment, patents, maintenance, and supply zones by international monopolies.'
    ),
    6: q(
        1,
        '어떤 나라는 공식적으로 독립국이지만, 핵심 항만 운영권과 외채 재조정 조건, 군사기지 사용권, 희토류 채굴권이 한 강대국과 그 금융기관에 묶여 있다. 6장의 범주로 보면 무엇을 따져야 하는가?',
        'A country is formally independent, but key port operation rights, debt-restructuring terms, military base access, and rare-earth concessions are tied to one great power and its financial institutions. Using Chapter 6’s categories, what should we examine?',
        [
            '국기가 있고 선거가 있으면 종속 문제는 분석할 필요가 없다.',
            '형식적 독립과 별개로 금융·군사·원료 조건을 통한 반식민지적 종속이나 세력권 관계가 있는지 보아야 한다.',
            '직접 총독이 파견되지 않았으므로 제국주의와 무관하다.',
            '항만과 광산은 경제 문제이므로 세계분할과 분리해야 한다.',
        ],
        [
            'If there is a flag and elections, dependence needs no analysis.',
            'Apart from formal independence, we should examine semi-colonial dependence or a sphere-of-influence relation through finance, military access, and raw materials.',
            'If no governor is directly appointed, it has no relation to imperialism.',
            'Ports and mines are economic matters and should be separated from world partition.',
        ],
        '레닌은 직접 식민통치만 보지 않는다. 차관, 항만, 군사기지, 원료 권리가 특정 강대국에 묶이면 정치적 독립 안에서도 실질 종속이 생길 수 있다.',
        'Lenin does not look only at direct colonial rule. Loans, ports, bases, and raw-material rights tied to a great power can create material dependence inside formal independence.'
    ),
    7: q(
        0,
        '현대의 한 분쟁을 분석할 때 군사개입만 눈에 띈다. 그런데 배경에는 독점 플랫폼의 시장 장악, 금융기관의 차관 조건, 해외 인프라 투자, 공급망 재편, 군사동맹이 함께 있다. 7장의 다섯 특징으로 보면 어떻게 접근해야 하는가?',
        'In analyzing a modern conflict, military intervention is most visible. Behind it, however, are monopoly platforms’ market control, financial loan terms, foreign infrastructure investment, supply-chain restructuring, and military alliances. How should Chapter 7’s five features guide the analysis?',
        [
            '군사정책 하나만 보지 말고 독점, 금융자본, 자본수출, 국제 독점체, 영토·세력권 분할이 함께 작동하는지 보아야 한다.',
            '군사개입이 있으면 경제적 분석은 불필요하다.',
            '플랫폼과 공급망은 디지털 문제라 제국주의의 다섯 특징과 연결되지 않는다.',
            '차관 조건은 금융 문제일 뿐 정치적 세력권과 무관하다.',
        ],
        [
            'Do not look only at military policy; examine whether monopoly, finance capital, export of capital, international monopolies, and territorial or sphere division operate together.',
            'Once military intervention appears, economic analysis is unnecessary.',
            'Platforms and supply chains are digital issues and do not connect to the five features of imperialism.',
            'Loan terms are only financial issues and have no relation to political spheres of influence.',
        ],
        '7장은 제국주의를 하나의 정책이 아니라 특징들의 결합으로 정의한다. 현대 사례도 군사, 금융, 독점, 투자, 공급망을 따로 떼지 않고 묶어서 보아야 한다.',
        'Chapter 7 defines imperialism not as one policy but as a combination of features. Modern cases should likewise connect military, finance, monopoly, investment, and supply chains.'
    ),
    8: q(
        2,
        '한 고성장 기술기업이 신제품을 빠르게 내놓는 동시에 핵심 특허를 묶어 경쟁 기술을 막고, 자사주 매입과 배당을 늘리며, 하청 노동을 압박하고 일부 고임금 기술직을 포섭한다. 8장의 “기생성과 부패”를 적용하면 무엇이 보이는가?',
        'A fast-growing tech firm rapidly releases new products while bundling key patents to block rival technologies, increasing buybacks and dividends, squeezing subcontracted labour, and co-opting some high-paid technical workers. Applying Chapter 8’s “parasitism and decay,” what becomes visible?',
        [
            '빠른 성장이 있으므로 기생성이나 부패는 분석할 수 없다.',
            '특허와 배당은 생산과 무관한 작은 회계 문제일 뿐이다.',
            '기생성은 성장 부재가 아니라 독점이 혁신 억제, 금리적 수입, 노동자층 분할과 함께 빠르게 성장할 수도 있다는 모순을 뜻한다.',
            '고임금 기술직이 있으면 노동귀족이나 기회주의 문제는 사라진다.',
        ],
        [
            'Because there is rapid growth, parasitism or decay cannot be analyzed.',
            'Patents and dividends are small accounting matters unrelated to production.',
            'Parasitism does not mean no growth; it names the contradiction by which monopoly can grow rapidly while blocking innovation, expanding rent-like income, and dividing workers.',
            'If high-paid technical workers exist, the problem of labour aristocracy and opportunism disappears.',
        ],
        '레닌의 부패 개념은 “성장이 멈춤”이 아니다. 독점은 빠르게 성장하면서도 특허 봉쇄, 배당과 금리생활자 수입, 노동자 상층 포섭을 함께 낳을 수 있다.',
        'Lenin’s concept of decay does not mean “growth stops.” Monopoly can grow rapidly while producing patent blocking, dividend and rentier income, and the co-optation of upper worker layers.'
    ),
    9: q(
        3,
        '빅테크 독점에 대한 어떤 비판이 “담합 벌금과 공정경쟁 규칙을 조금 강화하면 된다”고 말하지만, 플랫폼 소유와 금융자본의 지배는 그대로 둔다. 9장의 비판 기준으로 무엇이 부족한가?',
        'A critique of Big Tech monopoly says “slightly stronger collusion fines and fair-competition rules are enough,” while leaving platform ownership and finance-capital control intact. By Chapter 9’s standard of critique, what is missing?',
        [
            '법 집행을 말하면 이미 독점의 경제 토대를 건드린 것이다.',
            '공정경쟁 규칙은 자유경쟁을 복원하므로 제국주의 문제도 사라진다.',
            '빅테크는 디지털 산업이므로 독점자본주의 비판과 무관하다.',
            '독점과 금융자본의 소유·지배 구조를 그대로 두고 표면의 과잉만 고치는 한계가 있다.',
        ],
        [
            'Once law enforcement is mentioned, the economic basis of monopoly has already been addressed.',
            'Fair-competition rules restore free competition, so the imperialist problem disappears.',
            'Big Tech is digital, so it has no relation to the critique of monopoly capitalism.',
            'It only corrects surface excesses while leaving the ownership and command structure of monopoly and finance capital intact.',
        ],
        '레닌은 제국주의 비판이 폭력과 부패의 표면만 비난하고 독점·금융자본의 토대를 보존하는 것을 문제 삼는다. 현대 독점 비판도 지배구조를 묻지 않으면 같은 한계에 빠진다.',
        'Lenin criticizes critiques that denounce the surface of violence and corruption while preserving the basis of monopoly and finance capital. Modern monopoly critique has the same limit if it does not question the structure of rule.'
    ),
    10: q(
        0,
        'AI 인프라, 반도체 생산, 클라우드, 물류망이 전 세계적으로 연결되어 계획되지만, 소유권과 이윤은 몇몇 기업과 금융집단에 집중된다. 10장의 역사적 위치 논리로 보면 가장 중요한 모순은 무엇인가?',
        'AI infrastructure, semiconductor production, cloud, and logistics are globally connected and planned, while ownership and profit concentrate in a few firms and financial groups. Using Chapter 10’s logic of historical place, what is the key contradiction?',
        [
            '생산은 사회화되고 계획적으로 연결되지만 그 통제와 성과는 사적 소유와 금융집단에 갇힌다는 모순이다.',
            '세계적 연결이 커지면 소유와 이윤 문제도 기술적 조정 문제로 약해진다는 점이다.',
            '첨단산업은 빠르게 성장하므로 기생성이나 이행기 문제와 무관하다는 점이다.',
            '금융집단이 참여하면 생산의 사회적 성격이 줄어들어 다시 소상품생산으로 돌아간다는 점이다.',
        ],
        [
            'Production is socialized and planned in connected form, but control and results remain trapped in private ownership and financial groups.',
            'As global connection grows, ownership and profit also become weaker technical coordination issues.',
            'Because advanced industries grow rapidly, they have no relation to parasitism or transition.',
            'Once financial groups participate, production becomes less social and returns to small commodity production.',
        ],
        '최종 장의 핵심은 성장 여부가 아니라 역사적 모순이다. 독점은 생산을 사회적으로 연결하지만 그 껍질은 사적 소유와 독점이윤이므로, 내용과 형식의 충돌이 커진다.',
        'The final chapter’s key is historical contradiction, not whether growth exists. Monopoly socially connects production, but its shell remains private ownership and monopoly profit, intensifying the clash between content and form.'
    ),
};

function brief(ch, conceptKo, conceptEn, focusKo, focusEn) {
    function sections(lang, concepts, focus) {
        const note = briefNotes[ch][lang];
        return [
            {
                title: lang === 'ko' ? '핵심 개념 먼저' : 'Core concepts first',
                items: concepts.map(([title, text]) => title + ': ' + text),
            },
            {
                title: lang === 'ko' ? '용어 풀이' : 'Term guide',
                items: [termNotes[ch][lang], note],
            },
            {
                title: lang === 'ko' ? '현대 적용' : 'Modern application',
                text: modernExamples[ch][lang],
            },
            {
                title: lang === 'ko' ? '이 장의 초점' : 'Chapter focus',
                text: focus,
            },
        ];
    }
    return {
        ko: sections('ko', conceptKo, focusKo),
        en: sections('en', conceptEn, focusEn),
    };
}

function chapter(ch, titleKo, titleEn, summaryKo, summaryEn, focusKo, focusEn, conceptKo, conceptEn, basic, advanced) {
    return {
        id: `imperialism-ch${String(ch).padStart(2, '0')}`,
        volumeNumber: 1,
        chapterNumber: ch,
        title: t(titleKo, titleEn),
        sourceUrl: `https://www.marxists.org/archive/lenin/works/1916/imp-hsc/ch${String(ch).padStart(2, '0')}.htm`,
        summary: t(summaryKo, summaryEn),
        learningFocus: t(focusKo, focusEn),
        conceptBrief: brief(ch, conceptKo, conceptEn, focusKo, focusEn),
        conceptMap: map(conceptKo, conceptEn),
        lessons: [
            lesson(ch, 'basic', `${titleKo} 기본`, `${titleEn}: Basics`, basic),
            lesson(ch, 'advanced', `${titleKo} 심화`, `${titleEn}: Advanced`, advanced),
        ],
    };
}

module.exports = {
    id: 'lenin-imperialism',
    volumeNumber: 4,
    title: t('레닌: 제국주의론', 'Lenin: Imperialism'),
    bookTitle: t('제국주의, 자본주의의 최고 단계', 'Imperialism, the Highest Stage of Capitalism'),
    description: t(
        '레닌의 『제국주의, 자본주의의 최고 단계』를 10개 장별로 읽으며 독점, 금융자본, 자본수출, 세계분할, 기회주의 비판을 학습합니다.',
        'Study Lenin’s Imperialism, the Highest Stage of Capitalism chapter by chapter: monopoly, finance capital, export of capital, world division, and the critique of opportunism.'
    ),
    chapters: [
        chapter(
            1,
            '생산의 집중과 독점',
            'Concentration of Production and Monopolies',
            '대공업의 집중이 카르텔·신디케이트·트러스트를 낳고, 자유경쟁을 독점으로 전화시키는 과정을 추적한다.',
            'Traces how industrial concentration produces cartels, syndicates, and trusts, turning free competition into monopoly.',
            '독점은 경쟁 바깥에서 온 예외가 아니라 경쟁이 낳은 결과이며, 사회화된 생산과 사적 전유의 충돌을 더 날카롭게 만든다는 점을 잡는다.',
            'See monopoly not as an exception from outside competition, but as competition’s result, sharpening the clash between socialized production and private appropriation.',
            [
                ['집중', '소수 대기업이 노동자, 동력, 산출, 기술을 압도적으로 장악하는 과정이다.'],
                ['독점', '카르텔과 트러스트가 가격, 생산량, 시장, 원료를 협정과 강제로 통제하는 단계다.'],
                ['모순', '생산은 점점 사회적으로 조직되지만 그 성과는 소수 자본의 사적 소유로 남는다.'],
            ],
            [
                ['Concentration', 'A few giant firms come to command workers, power, output, and technique.'],
                ['Monopoly', 'Cartels and trusts regulate prices, output, markets, and raw materials by agreement and coercion.'],
                ['Contradiction', 'Production becomes socially organized while its results remain privately appropriated.'],
            ],
            [
                q(1, '독일 통계에서 극소수 대기업이 노동자와 동력의 큰 몫을 차지한다. 레닌이 여기서 먼저 보여주려는 것은 무엇인가?', 'In the German statistics, a tiny minority of large firms commands a large share of workers and power. What is Lenin first trying to show?', ['소기업이 법률상 금지되어 사라졌다는 점', '생산의 집중이 독점 형성의 물질적 조건을 만든다는 점', '노동자의 숙련 향상이 기업 규모를 균등하게 만든다는 점', '국가 통계가 시장가격을 직접 결정한다는 점'], ['That small firms have been legally prohibited', 'That concentration of production creates the material condition for monopoly', 'That workers’ skill equalizes firm size', 'That state statistics directly set market prices'], '레닌의 출발점은 도덕적 비난이 아니라 구조 변화다. 경쟁 속에서 대기업이 생산수단과 동력을 집중시키고, 그 규모가 협정과 독점을 가능하게 한다.', 'Lenin starts from structural change rather than moral denunciation. Competition concentrates means of production and power in giant firms, and that scale makes agreement and monopoly possible.'),
                q(2, '카르텔이 판매조건, 지급기일, 생산량, 가격, 시장분할을 정한다면, 이는 단순한 사업자 모임과 어떻게 다른가?', 'If a cartel fixes terms of sale, payment dates, output, prices, and market division, how is it different from a mere business association?', ['회원들이 정치적 친목만 나누므로 경제 효과가 없다.', '주로 기술 표준을 교환하는 협회라서 가격과 생산량에는 영향을 주지 않는다.', '경쟁의 주요 조건을 협정으로 통제해 시장을 독점적으로 조직한다.', '소비자가 직접 생산량을 결정하게 하는 장치다.'], ['It is only political fellowship with no economic effect.', 'It is mainly a standards-exchange association and does not affect prices or output.', 'It controls major conditions of competition by agreement and organizes the market monopolistically.', 'It lets consumers directly decide output.'], '카르텔은 경쟁자가 남아 있는 외형을 보존할 수 있지만, 가격과 산출, 시장을 협정으로 묶는 순간 경쟁의 핵심 조건은 이미 독점적으로 조정된다.', 'A cartel may preserve the appearance of separate competitors, but once prices, output, and markets are bound by agreement, the central conditions of competition are already monopolistically regulated.'),
                q(0, '한 트러스트가 원료 공급, 운송로, 특허를 장악하고 외부 기업에 신용 차단과 덤핑을 가한다. 이 사례가 보여주는 독점의 성격은 무엇인가?', 'A trust controls raw materials, transport routes, and patents, while using credit cutoff and dumping against outsiders. What character of monopoly does this show?', ['생산·기술·유통의 관문을 장악해 외부 기업을 종속시키는 권력', '일시적 저가판매를 통해 소비자 후생을 주된 목표로 삼는 장치', '작은 기업을 법적으로 보호하기 위한 임시 협약', '시장과 무관한 순수 기술 연구 조직'], ['A power that controls gateways of production, technique, and circulation and subordinates outsiders', 'A consumer-protection device that always keeps prices below cost', 'A temporary pact to legally protect small firms', 'A purely technical research body unrelated to markets'], '레닌에게 독점은 커진 기업 하나가 아니라 경제적 관문을 쥔 권력관계다. 원료, 신용, 운송, 특허를 장악하면 외부 기업은 형식상 독립적이어도 실질적으로 종속된다.', 'For Lenin, monopoly is not just one enlarged firm but a power relation controlling economic gateways. If raw materials, credit, transport, and patents are controlled, outsiders are formally independent but materially dependent.'),
                q(3, '레닌이 독점 단계에서 “생산은 사회화되지만 전유는 사적”이라고 보는 상황에 가장 가까운 것은 무엇인가?', 'Which case best matches Lenin’s point that under monopoly production is socialized while appropriation remains private?', ['각 생산자가 자기 집에서 완성품을 만들어 직접 소비한다.', '국가가 모든 이윤을 노동자에게 균등하게 배분한다.', '기업들이 서로 아무 연결 없이 작은 지방시장만 상대한다.', '거대 결합기업이 전국적 원료·기술·판매를 계획하지만 이윤은 주주와 금융가에게 귀속된다.'], ['Each producer makes finished goods at home for direct use.', 'The state distributes all profit equally to workers.', 'Firms have no links and serve only small local markets.', 'A giant combine plans raw materials, technique, and sales nationally, while profit goes to shareholders and financiers.'], '독점은 생산의 계획성과 상호연결을 크게 키우지만, 그 조직력은 사회적 필요가 아니라 사적 이윤을 위해 작동한다. 그래서 생산의 사회화와 소유의 사적 성격 사이의 충돌이 커진다.', 'Monopoly greatly increases planning and interconnection in production, but this organized power serves private profit rather than social need. The clash between socialized production and private ownership therefore grows.'),
                q(1, '이 장의 논리에서 자유경쟁과 독점의 관계를 가장 잘 잡은 설명은 무엇인가?', 'Which statement best captures the relation between free competition and monopoly in this chapter?', ['독점은 자유경쟁과 무관한 봉건 잔재다.', '자유경쟁이 생산 집중을 낳고, 집중이 일정 단계에서 독점으로 전화한다.', '자유경쟁은 장기적으로 기업 규모의 격차를 완화하는 경향이 있다.', '독점이 등장하면 경쟁과 위기는 완전히 사라진다.'], ['Monopoly is a feudal remnant unrelated to free competition.', 'Free competition produces concentration, and concentration turns into monopoly at a certain stage.', 'The stronger free competition is, the more equal firm size must become.', 'Once monopoly appears, competition and crisis disappear completely.'], '레닌의 핵심은 독점이 경쟁의 반대물이면서도 경쟁 자체의 산물이라는 데 있다. 독점은 경쟁을 폐지하지 않고 그 위에 올라서서 더 날카로운 충돌과 위기를 만든다.', 'Lenin’s point is that monopoly is the opposite of competition and also its product. Monopoly does not abolish competition; it stands above it and creates sharper conflicts and crises.'),
            ],
            [
                q(0, '레닌이 “결합기업”을 독점 형성에서 중요하게 보는 이유는 무엇인가?', 'Why does Lenin treat the “combined enterprise” as important for monopoly formation?', ['원료 채굴, 가공, 운송, 판매를 묶어 불황과 가격 변동을 견디며 외부 기업을 압박할 수 있기 때문이다.', '생산 단계가 많아질수록 상품교환이 사라지기 때문이다.', '각 단계가 흩어질수록 대기업의 우위가 커지기 때문이다.', '결합기업은 이윤을 추구하지 않는 공공기관이기 때문이다.'], ['Because it can bind mining, processing, transport, and sale, withstand crises and price shifts, and pressure outsiders.', 'Because commodity exchange disappears as production stages multiply.', 'Because the more scattered the stages are, the stronger giant firms become.', 'Because a combine is a public body that does not seek profit.'], '결합은 단순한 효율화가 아니다. 여러 생산 단계를 한 자본이 묶으면 원료와 비용, 판매 조건에서 우위를 얻고 비결합 기업을 불황 속에서 밀어낼 수 있다.', 'Combination is not mere efficiency. When one capital unites several stages, it gains advantages in raw materials, costs, and sales conditions and can drive out non-combined firms in crises.'),
                q(2, '카르텔이 위기를 없앤다는 주장에 대해 레닌은 어떻게 반박하는가?', 'How does Lenin answer the claim that cartels abolish crises?', ['카르텔은 가격을 낮추므로 과잉생산이 불가능하다고 본다.', '카르텔이 생기면 모든 산업이 같은 속도로 발전한다고 본다.', '일부 산업의 독점은 전체 경제의 불균형과 무정부성을 없애지 못하고 오히려 심화시킨다고 본다.', '카르텔은 국가기관이므로 시장법칙 밖에 있다고 본다.'], ['He says cartels lower prices, making overproduction impossible.', 'He says cartels make all industries develop at the same pace.', 'He says monopoly in some branches does not abolish the imbalance and anarchy of the whole economy and can intensify them.', 'He says cartels are state bodies outside market laws.'], '독점은 특정 부문을 조직하지만 자본주의 전체의 생산은 사적 이윤과 불균등 발전에 지배된다. 그래서 카르텔은 위기를 폐지하기보다 그 형태를 더 집중적이고 폭력적으로 만든다.', 'Monopoly organizes particular branches, but capitalist production as a whole remains ruled by private profit and uneven development. Cartels therefore do not abolish crises; they make their forms more concentrated and violent.'),
                q(1, '레닌이 원료 차단, 신용 차단, 보이콧 같은 독점체의 수단을 길게 열거하는 이유는 무엇인가?', 'Why does Lenin list methods such as raw-material cutoff, credit cutoff, and boycott used by monopolies?', ['독점 경쟁이 순수한 품질 개선만으로 진행된다는 점을 보이기 위해서', '최신 자본주의의 관계가 지배와 강제의 관계로 바뀐다는 점을 보이기 위해서', '소기업도 지역 금융을 활용해 독점체와 대등하게 버틴다는 점을 보이기 위해서', '소비자 선택이 독점체의 행동을 완전히 통제한다는 점을 보이기 위해서'], ['To show that monopoly competition proceeds only through pure quality improvement', 'To show that relations in latest capitalism become relations of domination and coercion', 'To show that small firms always have more financial resources than monopolies', 'To show that consumer choice fully controls monopoly behavior'], '레닌은 독점을 단순히 “큰 경쟁자”로 보지 않는다. 독점은 경제적 관문을 장악해 타 자본과 노동을 복종시키는 권력관계다.', 'Lenin does not treat monopoly as merely a “larger competitor.” Monopoly is a power relation that controls economic gateways and subordinates other capitals and labor.'),
                q(3, '독점이 기술 발전을 촉진하면서도 모순을 심화한다는 말의 뜻은 무엇인가?', 'What does it mean that monopoly promotes technical development while deepening contradiction?', ['독점에서는 기술 조직이 사적 이윤과 무관한 중립적 계획으로 작동한다는 뜻이다.', '기술 발전은 소유관계의 충돌을 점차 완화한다고 본다.', '기술 발전의 주된 공간은 독점 바깥의 독립기업이라고 본다.', '거대 독점은 연구와 생산을 조직하지만 그 성과를 소수 소유자의 지배와 이윤에 종속시킨다.'], ['Under monopoly, technical organization operates as neutral planning unrelated to private profit.', 'Whenever technique develops, private ownership automatically disappears.', 'Technical development is possible only in small firms.', 'Giant monopoly organizes research and production but subordinates their results to the rule and profit of a few owners.'], '레닌은 독점이 생산의 사회화와 기술 조직을 전진시킨다고 본다. 문제는 그 전진이 사회 전체의 통제가 아니라 사적 전유의 껍질 안에 갇힌다는 데 있다.', 'Lenin sees monopoly as advancing the socialization of production and technical organization. The problem is that this advance remains trapped inside the shell of private appropriation rather than social control.'),
                q(0, '이 장이 은행 분석으로 넘어가야 하는 이유는 무엇인가?', 'Why must this chapter move on to the analysis of banks?', ['산업 독점의 우위는 은행 신용과 결합될 때 소수 금융가의 지배로 더욱 압축되기 때문이다.', '산업 독점은 은행과 무관하므로 예외를 확인해야 하기 때문이다.', '레닌은 생산 집중보다 화폐 수량설을 더 중요하게 보기 때문이다.', '독점은 농업에서만 생기므로 산업 분석은 곧 끝나기 때문이다.'], ['Because industrial monopoly’s advantage becomes further compressed into the rule of a few financiers when joined with bank credit.', 'Because industrial monopoly is unrelated to banks, so an exception must be checked.', 'Because Lenin treats the quantity theory of money as more important than concentration of production.', 'Because monopoly arises only in agriculture, so the industrial analysis ends here.'], '생산 집중만으로도 독점의 물질적 기반은 보인다. 그러나 그 힘이 전국적·세계적 지배로 되는 경로는 은행 신용과 금융 연결을 통해 완성된다.', 'Concentration of production shows monopoly’s material basis. But its path into national and world domination is completed through bank credit and financial connections.'),
            ]
        ),
        chapter(
            2,
            '은행과 그 새로운 역할',
            'Banks and Their New Role',
            '은행이 단순한 지급 중개자에서 자본과 정보를 집중해 산업 전체를 통제하는 독점 권력으로 변하는 과정을 다룬다.',
            'Shows how banks change from payment middlemen into monopolist powers concentrating capital and information and controlling industry.',
            '예금·계좌·지점망·지분참여가 흩어진 자본가들을 하나의 집단적 자본으로 묶고 종속시키는 방식을 이해한다.',
            'Understand how deposits, accounts, branch networks, and holdings bind scattered capitalists into a collective capitalist and subordinate them.',
            [
                ['중개자', '초기의 은행은 지급을 매개하고 유휴 화폐를 이윤 낳는 자본으로 돌린다.'],
                ['집중망', '대은행은 예금, 계좌, 지점, 지분참여를 통해 전국의 자금 흐름을 본다.'],
                ['통제력', '신용을 넓히거나 막는 능력은 기업의 운명을 좌우하는 권력이 된다.'],
            ],
            [
                ['Middleman', 'Banks initially mediate payments and turn idle money into profit-yielding capital.'],
                ['Network', 'Big banks see national money flows through deposits, accounts, branches, and holdings.'],
                ['Control', 'The ability to expand or restrict credit becomes power over firms’ fate.'],
            ],
            [
                q(1, '은행이 단지 송금과 결제를 돕는 곳이라면 역할은 제한적이다. 레닌이 말하는 “새로운 역할”은 무엇인가?', 'If banks merely help transfers and payments, their role is limited. What is the “new role” Lenin identifies?', ['노동조합 회비를 대신 관리하는 행정기관이 된다.', '화폐자본을 집중하고 기업의 신용과 정보를 장악해 산업을 통제하는 독점체가 된다.', '소비자에게만 작은 대출을 하는 복지기관이 된다.', '국가 조세를 폐지하고 모든 가격을 정하는 기관이 된다.'], ['They become administrative bodies managing union dues.', 'They become monopolies that concentrate money capital and control industry through credit and information.', 'They become welfare offices making only small consumer loans.', 'They abolish state taxes and set all prices.'], '은행의 새 역할은 결제 편의가 아니라 지배력이다. 많은 자본가와 상인의 자금이 대은행에 모이면, 은행은 신용과 정보를 통해 기업 활동을 좌우한다.', 'The new role is command, not payment convenience. Once many capitalists’ and merchants’ funds gather in big banks, banks influence firms through credit and information.'),
                q(0, '대은행이 작은 은행을 없애지 않고 “계열”이나 “참여”로 묶는 방식은 무엇을 뜻하는가?', 'What does it mean when a big bank binds smaller banks through affiliation or holdings rather than simply abolishing them?', ['겉으로는 여러 기관이 남아도 실제로는 하나의 중심에 종속되는 중앙집중이다.', '작은 은행이 대은행을 민주적으로 통제한다는 뜻이다.', '은행업이 산업과 완전히 분리된다는 뜻이다.', '지방 금융이 세계시장과 무관해진다는 뜻이다.'], ['Several institutions may remain outwardly, but in reality they are centralized under one center.', 'Small banks democratically control the big bank.', 'Banking becomes completely separate from industry.', 'Local finance becomes unrelated to the world market.'], '레닌은 이런 “분산”이 실제로는 중앙집중이라고 본다. 독립된 이름과 지점이 남아도 지분, 신용, 계열 관계가 하나의 금융 중심에 대한 종속을 만든다.', 'Lenin treats this “decentralization” as real centralization. Independent names and branches may remain, but holdings, credit, and affiliation create dependence on one financial center.'),
                q(2, '대은행이 기업의 당좌계정과 거래 기록을 들여다볼 수 있다는 점은 왜 중요한다?', 'Why is it important that a big bank can see firms’ current accounts and transaction records?', ['기업의 상품 품질을 직접 검사할 수 있기 때문이다.', '노동자의 사생활을 모두 알게 되기 때문이다.', '기업의 재정상태를 파악하고 신용을 조절해 그 행동에 영향력을 행사할 수 있기 때문이다.', '모든 거래가 현물교환으로 되돌아가기 때문이다.'], ['Because it can directly inspect commodity quality.', 'Because it learns every detail of workers’ private lives.', 'Because it can know firms’ financial condition and influence them by adjusting credit.', 'Because all transactions return to barter.'], '은행의 정보력은 단순한 회계 지식이 아니다. 누가 자금난에 빠졌고 누가 확장할 수 있는지 알면, 은행은 신용을 통해 기업의 생사를 결정할 수 있다.', 'The bank’s information is not mere bookkeeping. Knowing who is short of funds and who can expand lets the bank decide firms’ fate through credit.'),
                q(3, '한 대은행이 수십 개 은행을 직접·간접 지분으로 거느리고 국가대출 같은 큰 거래를 주도한다. 이때 은행은 어떤 성격을 띠는가?', 'A big bank controls dozens of banks through direct and indirect holdings and leads large operations such as state loans. What character does it take on?', ['소액 예금자만을 위한 협동조합', '산업과 무관한 중립적 금고', '시장 밖에서만 작동하는 관료조직', '소수 독점자들의 결합체이자 금융 지휘부'], ['A cooperative only for small depositors', 'A neutral vault unrelated to industry', 'A bureaucracy operating only outside the market', 'An association of a few monopolists and a financial command center'], '레닌은 은행이 일정 규모를 넘으면 “중개자”의 성격을 벗어난다고 본다. 대은행은 자본을 모으고 배분하는 지휘부가 되어 산업과 국가 재정까지 연결한다.', 'Lenin argues that beyond a certain scale banks outgrow the role of “middleman.” They become command centers that collect and allocate capital, linking industry and state finance.'),
                q(1, '은행 집중이 제국주의 분석에 중요한 이유는 무엇인가?', 'Why is bank concentration important for the analysis of imperialism?', ['제국주의를 군인의 성격 문제로만 설명하게 해 주기 때문이다.', '산업 독점이 금융 독점과 결합해 전국적·세계적 자본 지배로 확장되는 통로이기 때문이다.', '은행이 많아질수록 독점이 불가능해진다는 증거이기 때문이다.', '은행이 상품생산을 폐지하고 곧바로 사회주의를 실시하기 때문이다.'], ['Because it lets imperialism be explained only by soldiers’ character.', 'Because it is the channel through which industrial monopoly joins financial monopoly and expands into national and world command of capital.', 'Because it proves monopoly becomes impossible as banks multiply.', 'Because banks abolish commodity production and immediately institute socialism.'], '생산 집중은 산업 안의 독점을 보여준다. 은행 집중은 그 독점이 신용, 지분, 정보망을 통해 사회 전체의 자본을 통합하고 세계경제로 뻗는 방식을 보여준다.', 'Concentration of production shows monopoly inside industry. Bank concentration shows how monopoly integrates social capital through credit, holdings, and information networks and reaches into the world economy.'),
            ],
            [
                q(2, '레닌은 대은행 지점망의 확대를 왜 단순한 서비스 개선으로 보지 않는가?', 'Why does Lenin not treat expansion of big-bank branch networks as mere service improvement?', ['지점은 예금을 받지 않기 때문이다.', '지점 확대는 관리비를 늘려 대은행의 지배력을 제한한다고 보기 때문이다.', '지점망은 지역 자금과 기업 정보를 하나의 중심으로 모으는 전국적 통제망이기 때문이다.', '지점은 주로 지방 예금 관리를 위한 보조 창구에 머문다고 보기 때문이다.'], ['Because branches do not receive deposits.', 'Because many branches necessarily eliminate bank profit.', 'Because the branch network gathers local funds and business information into one national control center.', 'Because branches connect only to peasants.'], '지점망은 편리한 창구이면서 동시에 중앙집중의 장치다. 지역 경제가 대은행의 계산과 신용정책 안으로 들어가면서 독립성은 줄어든다.', 'A branch network is a convenient service and a device of centralization. Local economies enter the calculations and credit policy of big banks and lose independence.'),
                q(0, '은행이 “흩어진 자본가들을 하나의 집단적 자본가로 전환한다”는 말은 어떤 뜻인가?', 'What does it mean that banks transform scattered capitalists into a “collective capitalist”?', ['각자의 자금이 은행을 통해 집중되어, 소수 금융 중심이 전체 자본의 흐름을 조정하게 된다는 뜻이다.', '모든 자본가가 법적으로 같은 회사의 직원이 된다는 뜻이다.', '자본가들이 더 이상 이윤을 서로 비교하지 않는다는 뜻이다.', '은행이 노동자 평의회로 변한다는 뜻이다.'], ['Their funds are concentrated through banks, allowing a few financial centers to coordinate the flow of total capital.', 'All capitalists legally become employees of one company.', 'Capitalists no longer compare profits with one another.', 'Banks turn into workers’ councils.'], '개별 자본가들은 여전히 사적으로 활동하지만, 그들의 자금 흐름은 대은행의 계좌와 신용망에 묶인다. 그래서 은행은 전체 자본의 집합적 의지를 행사하는 위치에 선다.', 'Individual capitalists still act privately, but their money flows are bound to big-bank accounts and credit networks. The bank thus occupies a position from which it can exercise the collective will of capital.'),
                q(0, '“신용을 제한하거나 확대한다”는 은행의 권한은 왜 산업 독점과 연결되는가?', 'Why is the bank’s power to restrict or expand credit connected to industrial monopoly?', ['은행 신용은 기업의 원료 구입, 확장, 생존을 좌우하므로 대기업과 계열기업을 유리하게 만들 수 있다.', '신용은 주로 소비 수요를 반영하므로 산업 재편과는 분리된다고 보아야 한다.', '신용 제한은 항상 소기업에게 더 유리하게 작동한다.', '은행은 모든 기업에 같은 액수의 돈을 빌려줘야 한다.'], ['Bank credit shapes firms’ raw-material purchases, expansion, and survival, so it can favor big and affiliated firms.', 'Credit mainly reflects consumer demand and should be treated as separate from industrial restructuring.', 'Credit restriction always favors small firms.', 'Banks must lend the same amount to every firm.'], '독점은 공장 안에서만 만들어지지 않는다. 대은행과 가까운 기업은 위기 때 버틸 수 있고, 그렇지 못한 기업은 흡수되거나 파산하므로 금융은 산업 재편의 무기가 된다.', 'Monopoly is not made only inside the factory. Firms close to big banks can survive crises, while others are absorbed or ruined, making finance a weapon of industrial reorganization.'),
                q(3, '레닌이 은행의 “정보”를 권력으로 보는 맥락을 가장 잘 설명한 것은 무엇인가?', 'Which statement best explains why Lenin treats bank “information” as power?', ['정보가 많으면 은행가가 상품을 직접 생산하기 때문이다.', '정보는 공개 통계와 같아서 아무도 우위를 갖지 못하기 때문이다.', '정보는 정치와 무관한 중립적 지식으로만 남기 때문이다.', '재무 상태를 아는 은행은 신용 조건을 통해 기업을 감시하고 압박하고 선택할 수 있기 때문이다.'], ['Because more information makes bankers directly produce commodities.', 'Because information is like public statistics and gives no one an advantage.', 'Because information remains neutral knowledge unrelated to politics.', 'Because a bank that knows financial conditions can monitor, pressure, and select firms through credit terms.'], '대은행의 정보력은 곧 선택권이다. 누가 자금을 받을지, 누가 비싼 조건을 감수할지, 누가 합병 압박을 받을지를 판단하는 권력으로 바뀐다.', 'The big bank’s information becomes a power of selection: who receives funds, who accepts costly terms, and who faces pressure to merge.'),
                q(0, '은행 장의 결론이 “금융자본” 장으로 이어지는 논리적 이유는 무엇인가?', 'What logical reason leads from the chapter on banks to the chapter on finance capital?', ['은행 독점이 산업 독점과 결합하면서 은행자본과 산업자본의 융합 문제가 전면에 나오기 때문이다.', '은행 분석만으로 식민지 분할 문제가 완전히 끝나기 때문이다.', '레닌은 은행이 산업보다 도덕적으로 우월하다고 보기 때문이다.', '금융자본은 은행이 사라진 뒤에야 생기는 현상이기 때문이다.'], ['Because bank monopoly joins industrial monopoly, bringing the fusion of bank capital and industrial capital to the fore.', 'Because the bank analysis fully settles colonial partition.', 'Because Lenin treats banks as morally superior to industry.', 'Because finance capital arises only after banks disappear.'], '2장은 대은행이 중개자를 넘어 지배자로 변하는 과정을 보인다. 다음 단계는 이 은행 지배가 산업 독점과 결합해 금융자본과 금융과두제로 굳어지는 과정을 설명하는 것이다.', 'Chapter 2 shows banks becoming rulers rather than middlemen. The next step is explaining how this bank power fuses with industrial monopoly into finance capital and financial oligarchy.'),
            ]
        ),
        chapter(
            3,
            '금융자본과 금융과두제',
            'Finance Capital and the Financial Oligarchy',
            '은행자본과 산업자본의 융합이 지분참여, 주식발행, 회사 설립, 국가대출을 통해 금융과두제의 지배로 굳어지는 과정을 분석한다.',
            'Analyzes how the fusion of bank and industrial capital hardens into rule by a financial oligarchy through holdings, share issues, company promotion, and state loans.',
            '금융자본을 단순한 돈의 축적이 아니라 독점적 산업자본과 대은행의 결합으로 파악하고, 그 결합이 사회 전체에 조공을 부과하는 방식을 이해한다.',
            'Grasp finance capital not as mere money accumulation but as the union of monopoly industrial capital and big banks, and see how it levies tribute on society.',
            [
                ['융합', '은행은 산업자본을 소유·통제하고 산업은 은행자금에 의존하면서 금융자본이 형성된다.'],
                ['참여제도', '모회사와 자회사 지분망은 적은 자기자본으로 거대한 타인 자본을 지배하게 한다.'],
                ['과두제', '주식발행, 창업이득, 국가대출은 소수 금융가가 사회 전체에서 이윤을 끌어내는 통로다.'],
            ],
            [
                ['Fusion', 'Finance capital forms as banks own or control industrial capital and industry depends on bank funds.'],
                ['Holding system', 'Parent and subsidiary share networks let a small amount of own capital control huge amounts of others’ capital.'],
                ['Oligarchy', 'Share issues, promoter’s profit, and state loans let a few financiers draw profit from society.'],
            ],
            [
                q(0, '은행과 산업 독점이 서로 얽힌 상황에서, 레닌이 금융자본으로 파악하는 관계는 무엇인가?', 'When Lenin speaks of finance capital, he does not simply mean “capital with lots of money.” What is central?', ['대은행 자본과 독점적 산업자본이 지분·신용·인적 결합을 통해 융합한다는 점', '화폐가 상품 없이도 가치의 유일한 원천이 된다는 점', '모든 은행 예금이 노동자의 공동소유가 된다는 점', '산업자본이 사라지고 상업만 남는다는 점'], ['Big-bank capital and monopoly industrial capital fuse through holdings, credit, and personal links', 'Money becomes the sole source of value without commodities', 'All bank deposits become workers’ common property', 'Industrial capital disappears and only commerce remains'], '금융자본은 은행에 돈이 많다는 사실이 아니라 은행과 산업 독점이 서로 얽혀 지배력을 행사하는 관계다. 이 결합이 금융과두제의 토대가 된다.', 'Finance capital is not the fact that banks hold much money; it is the relation in which banks and industrial monopoly interlock and exercise command. This union is the basis of financial oligarchy.'),
                q(2, '“참여제도”에서 모회사가 자회사 지분 일부만 갖고도 더 큰 자본을 지배할 수 있다. 이 장에서 이 구조가 중요한 이유는 무엇인가?', 'In the “holding system,” a parent company can control larger capital while owning only part of subsidiaries. Why is this structure important here?', ['소유와 통제가 완전히 일치한다는 점을 증명하기 때문이다.', '주식회사가 독점을 불가능하게 만든다는 점을 보여주기 때문이다.', '적은 자기자본으로 타인 자본을 층층이 지배해 금융과두제의 힘을 키우기 때문이다.', '소액주주가 총회 절차를 통해 경영을 안정적으로 견제하기 때문이다.'], ['Because it proves ownership and control always perfectly coincide.', 'Because it shows joint-stock companies make monopoly impossible.', 'Because a small amount of own capital can control layers of others’ capital and enlarge oligarchic power.', 'Because small shareholders always effectively control management.'], '참여제도는 소유가 넓게 분산된 듯 보이게 하지만 실제로는 통제를 집중시킨다. 모회사는 계열망을 통해 자기 자본보다 훨씬 큰 자본을 지휘한다.', 'The holding system makes ownership appear dispersed while concentrating control. Through affiliate layers, the parent company commands capital far beyond its own.'),
                q(0, '레닌이 주식발행과 회사 설립에서 “창업이득”을 강조하는 이유는 무엇인가?', 'Why does Lenin emphasize “promoter’s profit” in share issues and company formation?', ['금융가가 실제 생산을 늘리지 않고도 주식 가격과 발행 구조를 통해 거대한 이익을 챙길 수 있기 때문이다.', '주식발행은 생산 확대가 확인된 뒤에만 부수적으로 이익을 낳기 때문이다.', '새 회사는 모두 손실만 내므로 금융가는 이익을 얻지 못하기 때문이다.', '창업이득은 독점과 무관한 회계상의 작은 오차이기 때문이다.'], ['Because financiers can obtain huge gains through share prices and issue structures without increasing real production.', 'Because share issues bring gains only after a verified expansion of production.', 'Because all new companies only lose money, so financiers gain nothing.', 'Because promoter’s profit is a small accounting error unrelated to monopoly.'], '금융과두제는 생산 현장 밖의 증권 발행과 회사 조직 과정에서도 이윤을 뽑아낸다. 레닌은 이를 사회 전체에 대한 금융자본의 조공 징수 방식으로 본다.', 'The financial oligarchy extracts profit even through securities and company organization outside the immediate production process. Lenin treats this as one way finance capital levies tribute on society.'),
                q(3, '러시아 은행들이 외국 대은행의 “딸회사”처럼 종속된다는 사례는 무엇을 보여주는가?', 'What is shown by the example of Russian banks subordinated like “daughter companies” of foreign big banks?', ['국내 은행은 외국 금융과 절대 연결될 수 없다는 점', '정치적으로 독립된 나라에서는 금융 종속이 불가능하다는 점', '은행의 국적 이름만 보면 실제 지배관계를 알 수 없다는 점', '금융자본의 지배가 국경을 넘어 산업과 은행을 계열망으로 묶는다는 점'], ['That domestic banks can never be connected to foreign finance', 'That financial dependence is impossible in politically independent countries', 'That the national name of a bank always reveals the real relation of control', 'That finance capital’s rule crosses borders and binds industry and banks into affiliate networks'], '레닌은 금융자본이 한 나라 안의 현상에 머물지 않는다고 본다. 외국 대은행은 지분과 신용망을 통해 다른 나라의 은행과 산업을 실질적으로 지배할 수 있다.', 'Lenin sees finance capital as not confined within one country. Foreign big banks can materially dominate banks and industries in other countries through holdings and credit networks.'),
                q(0, '이 장의 결론에서 “금융과두제”란 어떤 지배를 가리키는가?', 'In this chapter’s conclusion, what rule does “financial oligarchy” name?', ['소수 금융가가 은행·산업·증권·국가대출의 연결망을 통해 사회 전체의 자본 흐름을 지배하는 것', '모든 시민이 은행 운영에 동등하게 참여하는 것', '국가가 이윤을 폐지하고 금융을 공공재로 만든 것', '산업자본가가 은행의 영향에서 완전히 벗어난 것'], ['The rule of a few financiers over social capital flows through networks of banks, industry, securities, and state loans', 'Equal participation of all citizens in bank management', 'The state abolition of profit and transformation of finance into a public good', 'Industrial capitalists’ complete independence from banks'], '금융과두제는 단순한 부자 집단이 아니라 경제적 지휘망이다. 은행, 산업, 증권, 국가 재정을 연결해 사회 전체에서 독점이윤을 끌어낸다.', 'Financial oligarchy is not simply a group of rich people; it is an economic command network. It connects banks, industry, securities, and state finance to extract monopoly profit from society.'),
            ],
            [
                q(1, '참여제도는 왜 “민주적 주식소유”처럼 보이면서도 금융과두제를 강화할 수 있는가?', 'Why can the holding system strengthen financial oligarchy while appearing as “democratic share ownership”?', ['주식 분산이 경영권 분산으로 곧장 이어진다고 보기 때문이다.', '소액 지분과 계열 지배를 통해 다수 주주의 분산된 소유 위에서 소수의 집중된 통제가 가능하기 때문이다.', '모든 주주는 회사 정보를 같은 수준으로 이용할 수 있기 때문이다.', '주식회사는 은행 신용 없이만 운영되기 때문이다.'], ['Because more shares automatically transfer voting power to workers.', 'Because small holdings and affiliate control make concentrated command possible over dispersed ownership.', 'Because all shareholders can use company information equally.', 'Because joint-stock companies operate only without bank credit.'], '레닌은 법적 소유 형태와 실제 통제를 구분한다. 주식이 널리 퍼져도 지분망과 은행 연결을 쥔 소수가 경영과 자금 흐름을 장악할 수 있다.', 'Lenin distinguishes legal ownership from real control. Even if shares are dispersed, those who hold the holding network and banking links can command management and capital flows.'),
                q(2, '금융자본이 국가대출과 연결될 때 왜 단순한 재정 문제가 아닌가?', 'Why is finance capital’s connection with state loans more than a fiscal matter?', ['국가대출은 항상 무이자이고 정치적 조건이 붙지 않기 때문이다.', '국가대출은 국내 조세와만 관계되고 국제정치와 무관하기 때문이다.', '대출은 군수주문, 철도·항만 계약, 외교적 영향력과 결합해 금융가의 이익을 국가권력과 연결하기 때문이다.', '국가는 금융가와 법적으로 접촉할 수 없기 때문이다.'], ['Because state loans are always interest-free and carry no political conditions.', 'Because state loans concern only domestic taxes and have no relation to international politics.', 'Because loans link financiers’ interests with state power through arms orders, railway and port contracts, and diplomatic influence.', 'Because the state cannot legally deal with financiers.'], '레닌에게 금융과두제는 국가와 분리된 사적 부문이 아니다. 국가대출은 증권수익과 외교·군사적 이해를 묶어 금융자본의 지배 범위를 넓힌다.', 'For Lenin, financial oligarchy is not a private sphere separate from the state. State loans join securities profit with diplomatic and military interests, widening finance capital’s rule.'),
                q(0, '금융자본 장에서 “생산적 투자”와 “투기적 투자”를 깨끗이 나누려는 개량주의적 관점의 약점은 무엇인가?', 'In this chapter, what is weak about the reformist attempt to cleanly separate “productive” from “speculative” investment?', ['독점 단계에서는 은행, 산업, 증권, 지분참여가 얽혀 있어 그 둘을 제도적으로 분리해 자본주의를 정화할 수 없다는 점을 놓친다.', '투기적 투자는 실제로 존재하지 않는다는 점을 과장한다.', '생산적 투자는 증권시장과 별도의 건전한 영역으로 분리될 수 있다고 본다.', '은행이 산업에 관여하지 않는다는 사실을 너무 강조한다.'], ['It misses that in the monopoly stage banks, industry, securities, and holdings are interwoven, so capitalism cannot be purified by institutionally separating the two.', 'It exaggerates that speculative investment does not really exist.', 'It admits that productive investment always belongs only to workers.', 'It overemphasizes the fact that banks do not intervene in industry.'], '레닌은 투기와 생산을 도덕적으로 분리하면 금융자본의 구조를 놓친다고 본다. 독점 단계에서는 산업 지배 자체가 증권, 은행, 지분참여와 결합해 있다.', 'Lenin argues that morally separating speculation from production misses the structure of finance capital. In the monopoly stage, industrial command itself is joined to securities, banks, and holdings.'),
                q(3, '금융과두제가 “사회 전체에 조공을 부과한다”는 표현을 가장 잘 설명한 것은 무엇인가?', 'Which statement best explains the idea that the financial oligarchy “levies tribute on society”?', ['노동자가 은행가에게 자발적으로 선물을 준다는 뜻이다.', '금융 이윤을 은행 내부 비용 절감의 결과로만 설명한다는 뜻이다.', '모든 조세가 폐지되어 금융가가 손해를 본다는 뜻이다.', '주식발행, 신용조건, 국가대출, 독점가격을 통해 광범한 사회적 소득이 소수 금융집단으로 이전된다는 뜻이다.'], ['Workers voluntarily give gifts to bankers.', 'Financial profit comes only from bank employees’ wages.', 'All taxes are abolished and financiers lose money.', 'Broad social income is transferred to a few financial groups through share issues, credit terms, state loans, and monopoly prices.'], '조공이라는 말은 봉건적 비유가 아니라 지배관계의 표현이다. 금융과두제는 직접 생산하지 않는 영역에서도 사회적 부를 자신에게 흘러오게 하는 장치를 가진다.', '“Tribute” is not a feudal nostalgia but an expression of domination. The financial oligarchy has mechanisms that make social wealth flow to it even outside direct production.'),
                q(1, '이 장이 자본수출 장으로 이어지는 이유는 무엇인가?', 'Why does this chapter lead into the chapter on export of capital?', ['금융과두제는 국내에서만 이윤을 얻고 해외투자는 하지 않기 때문이다.', '집중된 금융자본은 더 높은 수익과 세력권을 찾아 해외 투자와 차관으로 나아가기 때문이다.', '자본수출은 은행과 무관한 개인 여행비 지출이기 때문이다.', '해외투자는 독점 단계 이전에만 가능했기 때문이다.'], ['Because the financial oligarchy gains profit only domestically and does not invest abroad.', 'Because concentrated finance capital seeks higher returns and spheres of influence through foreign investment and loans.', 'Because export of capital is personal travel spending unrelated to banks.', 'Because foreign investment was possible only before the monopoly stage.'], '금융자본은 국내 산업 지배에 머물지 않는다. 집중된 자본은 고이윤, 차관 조건, 정치적 영향력을 찾아 해외로 흘러가며 제국주의의 다음 특징을 만든다.', 'Finance capital does not remain within domestic industrial command. Concentrated capital flows abroad in search of high profits, loan conditions, and political influence, producing the next feature of imperialism.'),
            ]
        ),
        chapter(
            4,
            '자본수출',
            'Export of Capital',
            '독점 단계에서 상품수출보다 자본수출이 중요해지는 이유와, 해외투자가 고이윤·차관·군수주문·양허권과 결합하는 방식을 다룬다.',
            'Explains why export of capital becomes more important than export of goods in the monopoly stage, and how foreign investment links high profits, loans, arms orders, and concessions.',
            '“과잉자본”이 대중의 생활수준 향상에 쓰이지 않고 더 높은 이윤을 찾아 해외로 나가는 계급적 이유를 파악한다.',
            'Identify the class reason why “surplus capital” goes abroad for higher profits rather than being used to raise living standards at home.',
            [
                ['낡은 전형', '자유경쟁 시기의 전형은 상품수출이다.'],
                ['새 전형', '독점 단계의 전형은 고이윤 지역으로 향하는 자본수출이다.'],
                ['부가조건', '차관은 항만, 철도, 군수품 주문, 조약상 이익 같은 조건을 끌고 온다.'],
            ],
            [
                ['Old type', 'The typical form under free competition is export of goods.'],
                ['New type', 'The typical form under monopoly is export of capital to high-profit regions.'],
                ['Extra terms', 'Loans bring port contracts, railways, arms orders, treaty advantages, and concessions.'],
            ],
            [
                q(0, '레닌은 자유경쟁 단계와 독점 단계의 국제경제를 구분하며 무엇이 특히 중요해졌다고 보는가?', 'Distinguishing free competition from the monopoly stage, what does Lenin say has become especially important?', ['상품수출과 구별되는 자본수출', '농민의 자급자족 생산', '국내 소매상 사이의 가격 흥정', '화폐 사용 이전의 물물교환'], ['Export of capital as distinct from export of goods', 'Peasant subsistence production', 'Price bargaining among domestic retailers', 'Barter before the use of money'], '자본주의 초기에도 상품은 해외로 팔렸다. 레닌이 강조하는 새 특징은 독점과 금융자본 아래에서 자본 자체가 높은 이윤을 찾아 해외로 투자된다는 점이다.', 'Goods were sold abroad earlier too. Lenin’s new feature is that under monopoly and finance capital, capital itself is invested abroad in search of higher profit.'),
                q(2, '레닌이 말하는 “과잉자본”은 왜 국내 대중의 생활 향상으로 자동 사용되지 않는가?', 'Why is Lenin’s “surplus capital” not automatically used to improve the living standards of the masses at home?', ['자본가들이 국내 소비재 생산법을 잊었기 때문이다.', '국내 소비 확대가 수익성 문제를 시장 균형으로 자연스럽게 해결한다고 보기 때문이다.', '자본은 사회적 필요가 아니라 더 높은 이윤율을 따라 움직이기 때문이다.', '국내에는 어떤 투자 대상도 존재하지 않기 때문이다.'], ['Because capitalists forget how to produce consumer goods at home.', 'Because expanded domestic consumption naturally solves profitability through market equilibrium.', 'Because capital moves according to higher profit rates, not social need.', 'Because there are no possible investments at home at all.'], '레닌은 “과잉”을 사회 전체의 필요가 충족된 상태로 보지 않는다. 대중이 가난해도 자본가에게 충분히 높은 이윤을 주지 않는다면 자본은 더 높은 수익을 찾아 해외로 나간다.', 'Lenin does not mean that social needs are satisfied. Even if the masses are poor, capital goes abroad if domestic conditions do not provide sufficiently high profit.'),
                q(1, '해외 차관이 항만 건설권, 철도 계약, 군수품 주문과 묶이는 사례는 자본수출의 어떤 면을 보여주는가?', 'What aspect of export of capital is shown when foreign loans are tied to port rights, railway contracts, or arms orders?', ['차관은 순수한 자선이라서 채권국 기업과 무관하다는 점', '자본수출이 상품수출과 정치적 영향력까지 끌어들이는 묶음 거래가 된다는 점', '해외투자는 주로 수입국의 자율적 산업정책에 종속된다는 점', '채무국은 차관을 받으면 금융 종속에서 벗어난다는 점'], ['Loans are pure charity and unrelated to creditor-country firms.', 'Export of capital becomes a package deal that draws in commodity exports and political influence.', 'Foreign investment is always controlled by local workers.', 'A debtor country escapes financial dependence by receiving a loan.'], '레닌은 차관이 돈의 이동에 그치지 않는다고 본다. 채권국은 대출을 통해 자국 기업의 주문, 양허권, 외교적 이익을 함께 확보한다.', 'Lenin sees loans as more than a movement of money. The creditor country uses lending to secure orders for its firms, concessions, and diplomatic advantages.'),
                q(3, '영국·프랑스·독일의 해외투자 분포가 서로 다른 점을 레닌은 왜 살피는가?', 'Why does Lenin examine the different foreign-investment patterns of Britain, France, and Germany?', ['세 나라가 같은 방식으로만 제국주의를 한다는 점을 증명하기 위해서', '해외투자가 국내 정치와 아무 관계 없다는 점을 보이기 위해서', '자본수출이 모든 나라에서 같은 지역으로만 향한다는 점을 보이기 위해서', '식민지형, 고리대형, 후발 경쟁형 등 금융자본의 구체적 형태가 다르게 나타남을 보이기 위해서'], ['To prove the three countries practice imperialism only in the same way', 'To show foreign investment has no relation to domestic politics', 'To show exported capital always goes to the same regions in every country', 'To show that finance capital takes different concrete forms such as colonial, usurer, and late-rival types'], '레닌은 추상 정의만 제시하지 않고 투자 대상과 지역을 비교한다. 영국은 식민지, 프랑스는 유럽 차관, 독일은 더 균등한 분포를 보이며 서로 다른 제국주의 형태를 드러낸다.', 'Lenin does not offer only an abstract definition; he compares destinations and regions. Britain, France, and Germany reveal different imperialist forms through colonies, European loans, and more even distribution.'),
                q(0, '자본수출이 수입국의 자본주의 발전을 “촉진”한다는 말은 레닌에게 어떤 의미인가?', 'What does Lenin mean when he says export of capital “accelerates” capitalist development in receiving countries?', ['종속적이고 불균등한 방식으로 철도·산업·금융관계를 확장해 세계 자본주의를 더 깊게 만든다는 뜻', '수입국이 곧바로 사회주의로 이행한다는 뜻', '채권국이 아무 이윤도 받지 않고 기술만 이전한다는 뜻', '수입국의 모든 지역이 같은 속도로 발전한다는 뜻'], ['It expands railways, industry, and financial relations in dependent and uneven ways, deepening world capitalism.', 'The receiving country immediately transitions to socialism.', 'The creditor country transfers technique without receiving any profit.', 'All regions of the receiving country develop at the same pace.'], '자본수출은 수입국을 정체 상태로만 남기지 않는다. 오히려 자본주의 관계를 확장하지만, 그 방향은 채권국 금융자본의 이윤과 영향력에 종속된다.', 'Export of capital does not simply leave receiving countries stagnant. It expands capitalist relations, but the direction is subordinated to the profit and influence of creditor finance capital.'),
            ],
            [
                q(2, '자본수출 장에서 “국내 투자가 불가능해서”가 아니라 “수익성 있는 투자처”가 문제라는 점은 왜 중요한가?', 'Why is it important that this chapter concerns “profitable investment fields,” not absolute impossibility of domestic investment?', ['국내 생산수단의 물리적 부족이 주된 원인이라는 뜻이기 때문이다.', '자본가가 국내 노동자의 생활을 올리는 데 관심이 많다는 뜻이기 때문이다.', '자본의 운동 기준이 사회적 필요가 아니라 이윤율임을 보여주기 때문이다.', '해외투자가 정치와 무관한 기술 협력임을 보여주기 때문이다.'], ['Because it means there are no means of production at home.', 'Because it means capitalists are eager to raise domestic workers’ living standards.', 'Because it shows that capital moves by profit rate, not social need.', 'Because it shows foreign investment is technical cooperation unrelated to politics.'], '국내 대중이 가난하다는 사실은 자본에게 곧 투자 동기가 되지 않는다. 이윤율이 낮으면 자본은 사회적 필요를 외면하고 더 높은 수익을 찾아 이동한다.', 'The poverty of the domestic masses does not automatically become an investment motive for capital. If profit rates are low, capital ignores social need and moves toward higher returns.'),
                q(1, '자본수출과 상품수출의 관계를 가장 정확히 설명한 것은 무엇인가?', 'Which statement best describes the relation between export of capital and export of goods?', ['자본수출이 시작되면 상품수출은 완전히 사라진다.', '해외 차관과 투자는 채권국 기업의 철도·무기·선박 주문을 동반하며 상품수출을 새 방식으로 촉진할 수 있다.', '상품수출은 노동자가 직접 결정하고 자본수출은 농민이 결정한다.', '두 현상은 같은 장에서 다루지만 서로 아무 관련이 없다.'], ['Once export of capital begins, export of goods disappears completely.', 'Foreign loans and investments can bring railway, arms, and ship orders for creditor-country firms, promoting goods export in a new way.', 'Workers decide goods export and peasants decide capital export.', 'The two are discussed together but have no relation.'], '레닌은 자본수출이 상품수출을 대체하기만 한다고 보지 않는다. 차관 조건은 채권국 기업의 주문을 만들며 상품수출과 정치적 영향력을 함께 묶는다.', 'Lenin does not say export of capital simply replaces export of goods. Loan conditions create orders for creditor-country firms and tie commodity export to political influence.'),
                q(3, '프랑스 자본수출을 “고리대 제국주의”에 가깝게 보는 맥락은 무엇인가?', 'What is the context for viewing French capital export as close to “usurer imperialism”?', ['프랑스 해외투자가 식민지 직접경영보다 국내 공업 확대에 치우쳤기 때문이다.', '프랑스 투자가 대부분 국내 농업에만 머물렀기 때문이다.', '프랑스가 식민지를 완전히 포기했기 때문이다.', '프랑스 자본수출에서 산업 직접투자보다 유럽 국가대출과 채권수익의 비중이 두드러졌기 때문이다.'], ['Because France made no foreign investments.', 'Because French investment stayed only in domestic agriculture.', 'Because France completely abandoned colonies.', 'Because European state loans and bond income stood out more than direct industrial investment in French capital export.'], '레닌은 나라별 자본수출의 형태를 구별한다. 프랑스의 경우 러시아 등 유럽에 대한 대부와 채권수익이 두드러져 고리대적 성격을 강조한다.', 'Lenin distinguishes national forms of capital export. In France’s case, lending to countries such as Russia and bond income stand out, so he stresses a usurer-like character.'),
                q(0, '차관에 “그 돈의 일부를 채권국 상품 구매에 써야 한다”는 조건이 붙는다면, 이는 무엇을 보여주는가?', 'If a loan requires that part of the money be spent on creditor-country goods, what does this show?', ['금융자본이 신용, 상품판매, 국가정책을 하나의 지배관계로 묶는다는 점', '채권국이 상품을 팔 능력이 없어 무상 원조만 한다는 점', '채무국이 차관을 통해 무역 조건을 일방적으로 정한다는 점', '자본수출이 국내 산업과 완전히 분리된다는 점'], ['That finance capital ties credit, commodity sales, and state policy into one relation of domination', 'That the creditor country cannot sell goods and only gives aid', 'That the debtor country unilaterally sets trade terms through the loan', 'That export of capital is completely separate from domestic industry'], '차관 조건은 금융과 산업, 외교가 분리되어 있지 않음을 보여준다. 돈을 빌려주는 행위가 곧 시장 확보와 세력권 확대의 수단이 된다.', 'Loan conditions show that finance, industry, and diplomacy are not separate. Lending money becomes a means of securing markets and expanding spheres of influence.'),
                q(2, '자본수출이 제국주의의 뒤 장들과 이어지는 고리는 무엇인가?', 'What links export of capital to the later chapters on imperialism?', ['해외투자가 늘수록 세계시장은 각 나라 안에 고립된다.', '자본수출은 식민지와 세력권 문제를 경제와 분리한다.', '자본수출은 투자처, 원료지, 차관 조건을 둘러싼 독점체와 강대국의 세계분할 경쟁을 낳는다.', '자본수출은 강대국 사이의 이해충돌을 안정적으로 완화한다.'], ['The more foreign investment grows, the more each national market becomes isolated.', 'Export of capital separates colonies and spheres of influence from economics.', 'Export of capital produces competition among monopolies and great powers over investment fields, raw materials, and loan terms.', 'Export of capital permanently reduces conflicts among great powers.'], '자본이 해외로 나가면 투자처와 원료지, 항만, 철도, 채무국 정책이 모두 경쟁 대상이 된다. 그래서 자본수출은 세계분할과 재분할의 경제적 토대가 된다.', 'When capital goes abroad, investment fields, raw materials, ports, railways, and debtor-state policy all become objects of rivalry. Export of capital thus becomes an economic basis for world division and redivision.'),
            ]
        ),
        chapter(
            5,
            '자본가 단체들의 세계분할',
            'Division of the World Among Capitalist Associations',
            '국내 독점이 세계시장으로 확장되어 국제 카르텔과 트러스트가 시장과 원료지, 기술권역을 나누는 과정을 추적한다.',
            'Tracks how domestic monopoly extends into the world market as international cartels and trusts divide markets, raw materials, and technical spheres.',
            '국제 협정이 평화의 증거가 아니라 자본력 비율에 따른 분할이며, 세력 변화가 재분할 투쟁을 낳는다는 점을 이해한다.',
            'Understand that international agreements are not proof of peace but divisions according to capital strength, and shifting strength brings struggles for redivision.',
            [
                ['국내분할', '카르텔은 먼저 자국 시장을 나누고 장악한다.'],
                ['세계분할', '자본수출과 해외 연결이 커지면 국제 협정이 시장을 나눈다.'],
                ['재분할', '힘의 비율이 바뀌면 평화적 협정은 충돌과 전쟁의 전주곡이 된다.'],
            ],
            [
                ['Domestic division', 'Cartels first divide and dominate their home markets.'],
                ['World division', 'As capital export and foreign links grow, international agreements divide markets.'],
                ['Redivision', 'When the relation of forces changes, peaceful agreements become preludes to conflict and war.'],
            ],
            [
                q(0, '국내 카르텔이 자국 시장을 나눈 뒤 해외 연결과 자본수출이 커진다. 레닌이 다음 단계로 보는 것은 무엇인가?', 'After domestic cartels divide their home markets, foreign links and capital export grow. What does Lenin see as the next step?', ['국제 독점체들이 세계시장을 협정으로 나누는 단계', '모든 나라가 관세를 폐지하고 자유경쟁으로 돌아가는 단계', '기업들이 국적을 버리고 이윤 추구를 중단하는 단계', '세계시장이 다시 지방시장들의 단순 합으로 해체되는 단계'], ['A stage in which international monopolies divide the world market by agreement', 'A stage in which all countries abolish tariffs and return to free competition', 'A stage in which firms abandon nationality and stop seeking profit', 'A stage in which the world market dissolves into local markets'], '레닌은 국내 독점과 세계시장 사이에 단절을 두지 않는다. 자본수출과 해외 지점, 원료지 경쟁은 국제 카르텔과 세계분할로 이어진다.', 'Lenin does not separate domestic monopoly from the world market. Capital export, foreign agencies, and rivalry over raw materials lead to international cartels and world division.'),
                q(2, '전기산업에서 미국 GE와 독일 AEG가 지역을 나누고 특허·경험을 교환하는 협정을 맺는 사례는 무엇을 보여주는가?', 'What is shown by the example of American GE and German AEG dividing territories and exchanging patents and experience?', ['기술 발전이 독점과 결코 결합하지 않는다는 점', '국제 협정은 항상 소비자를 위한 공공계획이라는 점', '최첨단 산업에서도 독점체들이 세계를 시장권역으로 나누고 협력과 경쟁을 동시에 한다는 점', '전기산업은 금융자본과 아무 관련이 없다는 점'], ['That technical development never combines with monopoly', 'That international agreements are always public planning for consumers', 'That even the most advanced industries divide the world into market spheres while combining cooperation and rivalry', 'That electrical industry has no relation to finance capital'], '전기산업 사례는 독점이 낡은 산업에만 국한되지 않음을 보여준다. 고도 기술 산업도 자본력과 은행 연결을 바탕으로 세계적 분할 협정을 맺는다.', 'The electrical example shows monopoly is not limited to old industries. Advanced technical sectors also use capital strength and bank connections to make world-division agreements.'),
                q(0, '국제 카르텔이 평화 협정을 맺었다고 해서 레닌이 평화주의적 결론을 내리지 않는 이유는 무엇인가?', 'Why does Lenin not draw a pacifist conclusion from peaceful agreements among international cartels?', ['협정은 현재 힘의 비율에 따른 분할일 뿐이고, 불균등 발전은 그 비율을 다시 흔들기 때문이다.', '협정이 있으면 계급대립과 국가 갈등이 제도적 조정으로 안정된다고 보기 때문이다.', '국제 카르텔은 실제로 존재하지 않았기 때문이다.', '협정은 주로 노동조합의 임금교섭 방식과 비슷하게 작동하기 때문이다.'], ['Because an agreement is only a division according to the current relation of forces, and uneven development disrupts that relation.', 'Because agreements supposedly stabilize class antagonisms and state conflicts through institutional adjustment.', 'Because international cartels did not really exist.', 'Because agreements are made only among trade unions.'], '레닌에게 평화적 협정과 전쟁은 서로 무관한 반대물이 아니다. 같은 세계분할의 토대 위에서 힘의 변화에 따라 협정이 충돌로, 충돌이 새 협정으로 바뀐다.', 'For Lenin, peaceful agreement and war are not unrelated opposites. On the same basis of world division, changes in strength turn agreements into conflicts and conflicts into new agreements.'),
                q(3, '석유시장에서 스탠더드 오일, 로스차일드·노벨, 독일 은행들이 얽히는 사례가 보여주는 것은 무엇인가?', 'What is shown by the oil-market example involving Standard Oil, Rothschild-Nobel interests, and German banks?', ['원료산업은 국제 경쟁과 무관하다는 점', '은행은 원료지 확보에 관심이 없다는 점', '국가정책은 독점체의 이해와 연결되지 않는다는 점', '원료지와 운송, 금융 연결을 둘러싼 독점체들의 세계적 재분할 투쟁'], ['That raw-material industries are unrelated to international rivalry', 'That banks have no interest in securing raw-material sources', 'That state policy is not linked to monopoly interests', 'A global struggle among monopolies over raw materials, transport, and financial links'], '석유 사례에서 독점체와 대은행, 국가정책은 분리되지 않는다. 원료와 운송을 둘러싼 경쟁은 이미 세계분할과 재분할의 문제다.', 'In the oil example, monopolies, big banks, and state policy are not separate. Rivalry over raw materials and transport is already a question of world division and redivision.'),
                q(0, '국제 철도 카르텔이 국가별 할당량을 정하고 인도 시장을 특정 국가에 남겨둔다. 이 장의 논리에서 이는 무엇인가?', 'An international rail cartel sets national quotas and reserves the Indian market for one country. In this chapter’s logic, what is this?', ['세계시장을 자본력과 기존 지배관계에 따라 나누는 국제 독점의 형태', '식민지 시장이 독점과 무관하다는 증거', '중소기업의 자유로운 진입을 돕는 공정경쟁 규칙', '노동자가 생산계획을 국제적으로 통제하는 방식'], ['A form of international monopoly dividing the world market according to capital strength and existing domination', 'Proof that colonial markets are unrelated to monopoly', 'A fair-competition rule helping small firms enter freely', 'A way for workers to control production planning internationally'], '할당량과 특정 시장 배정은 국제 카르텔이 세계시장을 이미 나누고 있음을 보여준다. 이는 평화적 외양을 띠어도 독점적 지배의 형식이다.', 'Quotas and market reservations show that international cartels already divide the world market. Even with a peaceful appearance, this is a form of monopolistic rule.'),
            ],
            [
                q(1, '레닌이 국제 카르텔을 “세계 집중의 더 높은 단계”로 보는 이유는 무엇인가?', 'Why does Lenin see international cartels as a higher stage of world concentration?', ['국내 독점이 해체되고 모든 기업이 작아지기 때문이다.', '국내 시장을 장악한 독점체들이 세계시장과 원료지까지 협정의 대상으로 삼기 때문이다.', '세계시장이 사라지고 지방 물물교환만 남기 때문이다.', '국제 카르텔은 이윤을 균등하게 노동자에게 배분하기 때문이다.'], ['Because domestic monopoly dissolves and all firms become small.', 'Because monopolies that dominate home markets make the world market and raw-material sources objects of agreement.', 'Because the world market disappears and only local barter remains.', 'Because international cartels distribute profit equally to workers.'], '세계 집중은 단순히 기업 수가 줄어드는 문제가 아니다. 국내 독점체들이 국경을 넘어 시장과 원료, 기술을 나누기 시작할 때 자본 집중은 세계적 형태를 얻는다.', 'World concentration is not merely a fall in the number of firms. When domestic monopolies cross borders and divide markets, raw materials, and techniques, concentration takes a world form.'),
                q(3, '국제 카르텔이 “평화적”으로 세계를 나눈다는 사실이 오히려 제국주의 모순을 보여주는 까닭은 무엇인가?', 'Why does the “peaceful” division of the world by international cartels itself reveal imperialist contradiction?', ['평화적 협정은 대체로 계급대립을 완화하는 제도적 조정이기 때문이다.', '카르텔이 맺은 협정은 법적으로 영구불변이기 때문이다.', '협정이 있으면 자본주의의 불균등 발전이 멈추기 때문이다.', '분할은 자본력에 비례해 이루어지며, 자본력은 불균등하게 변하기 때문에 재분할 압력이 생기기 때문이다.'], ['Because peaceful agreements are always the beginning of workers’ power.', 'Because cartel agreements are legally permanent.', 'Because agreements stop uneven capitalist development.', 'Because division occurs in proportion to capital strength, and capital strength changes unevenly, creating pressure for redivision.'], '레닌은 형식이 평화적인지 폭력적인지만 보지 않는다. 중요한 것은 분할의 기준이 자본력이고, 자본주의에서는 그 힘이 균등하게 변하지 않는다는 점이다.', 'Lenin does not focus only on whether the form is peaceful or violent. The key is that division is based on capital strength, and under capitalism that strength does not change evenly.'),
                q(0, 'AEG 같은 전기 독점체가 수많은 회사를 지배하고 해외 지점을 거느리는 구조는 은행 장과 어떻게 연결되는가?', 'How does the structure of an electrical monopoly such as AEG, controlling many companies and foreign agencies, connect to the chapter on banks?', ['대규모 해외 확장은 은행의 지분참여와 금융지원 없이는 설명하기 어렵다는 점에서 연결된다.', '전기산업은 대은행과 경쟁하지 않고 모두 현금거래만 한다는 점에서 연결된다.', '은행은 산업 독점이 커질수록 보조적 결제기관으로 물러난다는 점에서 연결된다.', '해외 지점은 금융자본이 아니라 소규모 수공업의 산물이라는 점에서 연결된다.'], ['It connects because large foreign expansion is hard to explain without bank holdings and financial support.', 'It connects because electrical industry avoids big banks and uses only cash.', 'It connects because banks immediately disappear once monopoly appears.', 'It connects because foreign agencies are products of small handicraft rather than finance capital.'], '레닌의 장들은 연결되어 있다. 산업 독점의 세계화는 대은행의 자금, 지분참여, 신용망과 결합할 때 가능한 규모를 얻는다.', 'Lenin’s chapters are connected. The globalization of industrial monopoly gains its scale when joined with big-bank funds, holdings, and credit networks.'),
                q(2, '국제 카르텔이 “초독점”처럼 보일 때 레닌이 묻는 핵심 질문은 무엇인가?', 'When an international cartel appears as a “supermonopoly,” what core question does Lenin ask?', ['그 협정의 로고가 얼마나 현대적인가', '경영자들이 서로 개인적으로 친한가', '어떤 자본력 비율로 세계가 나뉘었고 그 비율이 어떻게 변할 것인가', '소비자가 광고를 좋아하는가'], ['How modern the agreement’s logo is', 'Whether the managers are personally friendly', 'In what proportion of capital strength the world has been divided and how that proportion will change', 'Whether consumers like the advertising'], '국제 독점은 평화로운 세계정부가 아니다. 레닌은 협정의 표면보다 그 밑의 힘의 비율과 불균등 발전을 본다.', 'International monopoly is not peaceful world government. Lenin looks beneath the surface of agreement to the relation of forces and uneven development.'),
                q(0, '이 장이 곧바로 “열강 사이의 세계분할” 장으로 이어지는 이유는 무엇인가?', 'Why does this chapter lead directly into the chapter on division of the world among great powers?', ['기업들 사이의 경제적 분할은 국가, 식민지, 세력권 분할과 병행하고 서로 연결되기 때문이다.', '기업 카르텔은 국가와 아무 관련이 없으므로 반대 사례가 필요하기 때문이다.', '국가 간 영토 문제는 자본수출 이후 완전히 사라졌기 때문이다.', '레닌은 경제분석을 끝내고 순수 군사사로 넘어가려 하기 때문이다.'], ['Because economic division among firms runs parallel to and is connected with division among states, colonies, and spheres of influence.', 'Because corporate cartels have no relation to states and require a counterexample.', 'Because territorial questions among states completely disappear after capital export.', 'Because Lenin ends economic analysis and shifts to pure military history.'], '레닌은 기업의 세계분할과 국가의 영토분할을 별개로 두지 않는다. 독점체의 이해는 식민지, 세력권, 군사·외교정책과 맞물린다.', 'Lenin does not separate corporate world division from territorial division by states. Monopoly interests interlock with colonies, spheres of influence, and military-diplomatic policy.'),
            ]
        ),
        chapter(
            6,
            '열강 사이의 세계분할',
            'Division of the World Among the Great Powers',
            '식민지 획득 경쟁이 세계의 “미점령지”를 소진시키고, 이후의 제국주의를 새 영토 획득보다 재분할의 시대로 만든다는 점을 보인다.',
            'Shows how colonial conquest exhausts “unoccupied” territory and turns later imperialism into an era of redivision rather than first seizure.',
            '식민지·반식민지·세력권이 금융자본의 경제적 필요와 연결되는 방식, 그리고 “최종 분할”이 왜 평화가 아니라 재분할 압력인지 이해한다.',
            'See how colonies, semi-colonies, and spheres of influence are tied to finance capital’s economic needs, and why “final partition” means pressure for redivision, not peace.',
            [
                ['최종 분할', '세계가 이미 소유자들 사이에 나뉘어 더 이상 빈 땅으로 편입될 곳이 없다.'],
                ['반식민지', '정치적 독립이 남아도 금융자본은 차관과 세력권으로 국가를 종속시킬 수 있다.'],
                ['재분할 압력', '늦게 성장한 강대국은 기존 분할을 흔들며 새 몫을 요구한다.'],
            ],
            [
                ['Final partition', 'The world has already been divided among owners; no empty territory remains to seize.'],
                ['Semi-colony', 'Even with political independence, finance capital can subordinate states through loans and spheres of influence.'],
                ['Redivision pressure', 'Late-rising powers challenge the old division and demand a new share.'],
            ],
            [
                q(1, '레닌이 19세기 말 아프리카와 폴리네시아의 분할 통계를 드는 이유는 무엇인가?', 'Why does Lenin use statistics on the late-nineteenth-century partition of Africa and Polynesia?', ['식민지 경쟁이 경제와 무관한 우연이었음을 보이기 위해서', '세계의 미점령지가 거의 소진되어 이후에는 “획득”보다 “재분할”이 문제가 됨을 보이기 위해서', '모든 식민지가 자발적으로 합병을 요청했음을 보이기 위해서', '유럽 열강이 같은 속도로 식민지를 얻었음을 보이기 위해서'], ['To show colonial rivalry was an economic accident.', 'To show that unoccupied territory was nearly exhausted, so later the issue becomes redivision rather than first acquisition.', 'To show all colonies voluntarily asked for annexation.', 'To show European powers acquired colonies at the same pace.'], '레닌의 “최종 분할”은 더 이상 충돌이 없다는 뜻이 아니다. 빈 땅이 없으므로 새로 성장한 강대국은 이미 배정된 몫을 다시 나누려 한다는 뜻이다.', 'Lenin’s “final partition” does not mean no conflict remains. It means no empty land is left, so rising powers seek to redivide shares already assigned.'),
                q(0, '반식민지라는 범주는 왜 이 장에서 중요한다?', 'Why is the category of semi-colony important in this chapter?', ['정치적 독립 형식이 남아 있어도 차관, 세력권, 외국 금융을 통해 종속될 수 있음을 보여주기 때문이다.', '반식민지는 외국 금융의 영향이 제한적인 주변부 국가만 뜻하기 때문이다.', '반식민지는 식민지보다 항상 더 강한 제국주의 국가를 뜻하기 때문이다.', '반식민지는 세계분할 논의에서 제외되어야 하기 때문이다.'], ['Because it shows that even where political independence formally remains, loans, spheres of influence, and foreign finance can produce dependence.', 'Because semi-colony means only regions without any finance capital.', 'Because semi-colony always means an imperialist state stronger than a colony.', 'Because semi-colonies must be excluded from the analysis of world partition.'], '레닌은 지배를 국기 교체나 직접 통치만으로 보지 않는다. 금융자본은 정치적 독립을 남겨두고도 차관과 세력권으로 국가를 종속시킬 수 있다.', 'Lenin does not reduce domination to flag changes or direct rule. Finance capital can subordinate a state through loans and spheres of influence while leaving formal political independence.'),
                q(3, '1876년 이후 프랑스, 독일, 일본 등이 식민지 획득에 뛰어드는 변화는 무엇과 연결되는가?', 'What is the post-1876 entry of France, Germany, Japan, and others into colonial acquisition connected with?', ['농업 공동체의 자연적 확대', '열강이 더 이상 원료와 시장을 필요로 하지 않게 된 사실', '모든 나라의 경제 발전 속도가 같아진 사실', '자본주의가 자유경쟁 단계에서 독점·금융자본 단계로 넘어가는 과정'], ['The natural expansion of agrarian communities', 'The fact that great powers no longer need raw materials and markets', 'The equalization of all countries’ economic development rates', 'The transition of capitalism from free competition to monopoly and finance capital'], '레닌은 식민지 경쟁을 외교 취향으로 설명하지 않는다. 자유경쟁의 전성기가 끝나고 금융자본이 우세해질수록 원료지와 세력권 경쟁이 격화된다.', 'Lenin does not explain colonial rivalry as a diplomatic taste. As the age of free competition ends and finance capital prevails, rivalry over raw materials and spheres of influence intensifies.'),
                q(2, '세실 로즈가 실업과 사회문제의 해결책으로 식민지를 말하는 대목은 무엇을 드러내는가?', 'What is revealed when Cecil Rhodes presents colonies as a solution to unemployment and social problems?', ['식민주의자가 사회문제를 노동자 권력으로 해결하려 했다는 점', '식민지가 자본주의와 무관한 인도주의 사업이었다는 점', '제국주의가 국내 계급모순을 외부 팽창으로 우회하려는 부르주아적 해법으로 제시된다는 점', '영국 자본가들이 해외시장을 포기하려 했다는 점'], ['That colonialists wanted to solve social problems through workers’ power', 'That colonialism was a humanitarian project unrelated to capitalism', 'That imperialism is presented as a bourgeois way to divert domestic class contradictions through external expansion', 'That British capitalists wanted to abandon foreign markets'], '로즈의 솔직한 말은 제국주의의 사회적 기능을 드러낸다. 국내 계급갈등과 시장 문제를 식민지 획득과 해외시장 확대로 우회하려는 논리다.', 'Rhodes’s blunt statement reveals imperialism’s social function: domestic class conflict and market problems are to be diverted through colonial acquisition and foreign markets.'),
                q(0, '이 장에서 “작은 식민지 보유국”이 언급되는 이유는 무엇인가?', 'Why does this chapter mention small colonial powers?', ['그들의 식민지는 열강 간 이해충돌이 막고 있을 뿐, 앞으로 재분할 대상이 될 수 있음을 보이기 위해서', '작은 국가는 식민지를 가져도 제국주의와 무관함을 보이기 위해서', '작은 국가가 대영제국보다 항상 강하다는 점을 보이기 위해서', '식민지 분할이 끝났으므로 어떤 변화도 불가능함을 보이기 위해서'], ['To show that their colonies may become objects of redivision, preserved only by conflicts among greater powers', 'To show small states’ colonies are unrelated to imperialism', 'To show small states are always stronger than the British Empire', 'To show that because partition is complete, no change is possible'], '세계가 이미 나뉘었다는 것은 현상유지가 영원하다는 뜻이 아니다. 작은 보유국의 식민지는 열강의 힘 관계가 달라질 때 재분할의 대상이 될 수 있다.', 'That the world is already divided does not mean the status quo is eternal. Colonies held by small powers can become objects of redivision when great-power relations shift.'),
            ],
            [
                q(0, '“최종 분할”이라는 표현을 오해하지 않으려면 무엇을 구분해야 하는가?', 'What distinction is needed to avoid misunderstanding the phrase “final partition”?', ['더 이상 전쟁이 없다는 뜻과 더 이상 빈 영토가 없다는 뜻', '식민지와 상품시장이 항상 같은 말이라는 점', '정치적 지배와 경제적 종속이 절대 함께 나타날 수 없다는 점', '열강의 힘 관계가 조약을 통해 장기간 안정될 수 있다는 점'], ['The idea that there will be no more wars and the idea that there is no empty territory left', 'That colony and commodity market always mean the same thing', 'That political domination and economic dependence can never coexist', 'That great-power relations are permanently fixed'], '레닌의 “최종”은 빈 땅을 새로 차지하는 단계가 끝났다는 뜻이다. 그래서 이후의 충돌은 기존 소유자들 사이에서 빼앗고 다시 나누는 형태를 띤다.', 'Lenin’s “final” means the stage of newly seizing empty territory is over. Later conflicts therefore take the form of taking from existing owners and redistributing shares.'),
                q(0, '식민지 통계와 철도·원료·자본수출 논의가 연결되는 지점은 무엇인가?', 'Where do colonial statistics connect with railways, raw materials, and export of capital?', ['식민지 면적은 금융자본이 투자처, 운송로, 원료지를 확보하는 물질적 공간을 나타내기 때문이다.', '식민지 면적은 오직 지도 제작자의 관심사이기 때문이다.', '철도는 제국주의와 무관한 순수 관광 인프라이기 때문이다.', '자본수출은 식민지가 없는 곳에서만 가능하기 때문이다.'], ['Colonial area represents material space where finance capital secures investment fields, transport routes, and raw materials.', 'Colonial area is only a concern for mapmakers.', 'Railways are pure tourist infrastructure unrelated to imperialism.', 'Export of capital is possible only where there are no colonies.'], '레닌은 지리 통계를 경제분석과 분리하지 않는다. 영토와 인구는 원료, 철도, 시장, 차관, 군사거점의 조건으로 금융자본의 운동과 연결된다.', 'Lenin does not separate geographical statistics from economic analysis. Territory and population are conditions for raw materials, railways, markets, loans, and military bases, tied to finance capital’s movement.'),
                q(3, '독일처럼 후발적으로 빠르게 성장한 나라가 기존 식민지 분할에 불만을 품는 이유는 무엇인가?', 'Why would a rapidly rising latecomer such as Germany become dissatisfied with the existing colonial division?', ['경제력이 약한 국가는 보상적 외교로 더 많은 식민지를 배정받기 때문이다.', '식민지는 이미 모든 나라에 균등하게 배분되어 있기 때문이다.', '후발 국가는 해외시장에 관심이 없기 때문이다.', '자본력과 산업력이 커졌지만 과거 분할에서 받은 몫은 작아 새 세력관계와 기존 분할이 충돌하기 때문이다.'], ['Because the weaker a country becomes, the more colonies it automatically receives.', 'Because colonies have already been equally distributed to all countries.', 'Because latecomers have no interest in foreign markets.', 'Because its capital and industry have grown while its old share remains small, so the new relation of forces clashes with the old division.'], '제국주의의 폭발성은 불균등 발전에서 나온다. 힘은 변하지만 영토분할은 과거의 결과로 굳어져 있으므로, 새 강자는 재분할을 요구하게 된다.', 'Imperialism’s explosiveness comes from uneven development. Strength changes while territorial division is fixed from the past, so new powers demand redivision.'),
                q(2, '정치적으로 독립된 중국·페르시아·터키 같은 사례를 레닌이 반식민지로 다루는 이유는 무엇인가?', 'Why does Lenin treat cases such as China, Persia, and Turkey as semi-colonial despite formal political independence?', ['그 나라들이 이미 유럽의 지방정부였기 때문이다.', '그곳에는 어떤 외국 자본도 들어오지 않았기 때문이다.', '열강의 차관, 조차, 세력권, 군사·외교 압력이 실질적 종속을 만들기 때문이다.', '정치적 독립은 경제관계와 항상 무관하기 때문이다.'], ['Because they were already local European governments.', 'Because no foreign capital entered them.', 'Because loans, leases, spheres of influence, and military-diplomatic pressure by great powers created real dependence.', 'Because political independence is always unrelated to economic relations.'], '반식민지는 레닌의 제국주의 분석에서 중요한 중간형태다. 직접 병합이 없어도 금융자본과 열강의 압력은 국가의 선택지를 제한한다.', 'Semi-colony is an important transitional form in Lenin’s analysis. Even without direct annexation, finance capital and great-power pressure restrict a state’s choices.'),
                q(0, '이 장의 세계분할 분석이 “평화적 제국주의” 전망과 충돌하는 이유는 무엇인가?', 'Why does this chapter’s analysis of world partition conflict with hopes for “peaceful imperialism”?', ['세계가 이미 나뉘었고 불균등 발전이 계속되므로 새 힘의 비율은 기존 분할과 충돌할 수밖에 없기 때문이다.', '모든 열강이 같은 속도로 성장하므로 분쟁 원인이 사라지기 때문이다.', '식민지 문제는 금융자본과 거리가 있어 외교 협상으로 안정될 수 있기 때문이다.', '강대국은 한 번 획득한 식민지를 절대 경제적으로 사용하지 않기 때문이다.'], ['Because the world is already divided and uneven development continues, so new relations of strength must collide with the old division.', 'Because all great powers grow at the same pace, removing causes of conflict.', 'Because colonial questions are unrelated to finance capital and always end in negotiation.', 'Because great powers never economically use colonies once acquired.'], '레닌에게 평화적 분할은 일시적 형태일 뿐이다. 세계가 이미 나뉜 상태에서 자본주의적 힘의 불균등 변화는 재분할의 압력을 만든다.', 'For Lenin, peaceful division is only a temporary form. In a world already divided, uneven changes in capitalist strength produce pressure for redivision.'),
            ]
        ),
        chapter(
            7,
            '제국주의라는 특수 단계',
            'Imperialism as a Special Stage of Capitalism',
            '앞 장들의 논의를 묶어 제국주의를 독점, 금융자본, 자본수출, 국제 독점체의 세계분할, 영토분할의 완성으로 정의한다.',
            'Draws together the preceding chapters and defines imperialism by monopoly, finance capital, export of capital, international monopolist division, and completed territorial division.',
            '짧은 정의와 다섯 특징을 구분하고, 제국주의를 단순한 정책 취향이 아니라 자본주의 발전의 특수 단계로 파악한다.',
            'Distinguish the brief definition from the five features, and grasp imperialism as a special stage of capitalist development rather than a policy preference.',
            [
                ['짧은 정의', '제국주의는 자본주의의 독점 단계다.'],
                ['다섯 특징', '독점, 금융자본, 자본수출, 국제 독점체, 영토분할이 함께 작동한다.'],
                ['카우츠키 비판', '정책 형태만 떼어내면 금융자본의 경제적 토대와 모순을 흐리게 된다.'],
            ],
            [
                ['Brief definition', 'Imperialism is the monopoly stage of capitalism.'],
                ['Five features', 'Monopoly, finance capital, export of capital, international combines, and territorial partition operate together.'],
                ['Critique of Kautsky', 'Separating policy form from the economic basis obscures finance capital’s contradictions.'],
            ],
            [
                q(0, '레닌이 제국주의의 가장 짧은 정의로 제시하는 것은 무엇인가?', 'What is Lenin’s briefest definition of imperialism?', ['자본주의의 독점 단계', '모든 해외무역 일반', '군주제가 있는 나라의 외교정책', '가난한 나라의 민족주의'], ['The monopoly stage of capitalism', 'All foreign trade in general', 'The foreign policy of monarchies', 'Nationalism in poor countries'], '레닌은 제국주의를 단순히 침략적 태도나 해외정책으로 정의하지 않는다. 경제적 핵심은 자유경쟁에서 독점으로 이행한 자본주의의 특수 단계다.', 'Lenin does not define imperialism simply as an aggressive attitude or foreign policy. Its economic core is a special stage of capitalism in which free competition has turned into monopoly.'),
                q(2, '레닌의 다섯 특징에 포함되지 않는 것은 무엇인가?', 'Which is not one of Lenin’s five features of imperialism?', ['생산과 자본의 집중이 독점을 만든다.', '은행자본과 산업자본이 융합해 금융자본과 금융과두제가 생긴다.', '소상품생산자가 세계시장을 평등하게 지배한다.', '자본수출이 특별한 중요성을 얻고 국제 독점체가 세계를 나눈다.'], ['Concentration of production and capital creates monopoly.', 'Bank capital and industrial capital fuse into finance capital and a financial oligarchy.', 'Small commodity producers equally rule the world market.', 'Export of capital gains special importance and international monopolies divide the world.'], '레닌의 정의는 독점, 금융자본, 자본수출, 국제 독점체, 영토분할의 완성을 묶는다. 평등한 소상품생산자의 세계시장 지배는 정반대의 그림이다.', 'Lenin’s definition links monopoly, finance capital, export of capital, international monopolies, and completed territorial partition. Equal world rule by small commodity producers is the opposite picture.'),
                q(0, '레닌이 “경제적 핵심”을 강조하면서도 정치와 식민지를 함께 다루는 이유는 무엇인가?', 'Why does Lenin emphasize the “economic core” while also discussing politics and colonies?', ['정치와 식민지는 금융자본의 경제적 운동에서 떨어진 장식이 아니라 그 운동의 표현이기 때문이다.', '경제 분석은 중요하지 않고 식민지 지도만 중요하기 때문이다.', '정치는 모든 나라에서 같은 형태로 나타나기 때문이다.', '금융자본은 해외정책에 아무 영향이 없기 때문이다.'], ['Because politics and colonies are not ornaments detached from finance capital’s economic movement but expressions of it.', 'Because economic analysis is unimportant and only colonial maps matter.', 'Because politics takes the same form in every country.', 'Because finance capital has no effect on foreign policy.'], '레닌의 방법은 경제와 정치를 분리하지 않는다. 금융자본의 이익은 세력권, 병합, 식민지, 군사·외교정책 속에서 구체적 형태를 얻는다.', 'Lenin’s method does not separate economics from politics. Finance capital’s interests take concrete form in spheres of influence, annexation, colonies, and military-diplomatic policy.'),
                q(2, '카우츠키가 제국주의를 산업자본주의가 선호할 수 있는 하나의 정책으로 좁힐 때 레닌이 비판하는 지점은 무엇인가?', 'When Kautsky narrows imperialism to one policy preferred by industrial capitalism, what does Lenin criticize?', ['정책 문제를 너무 경제적으로 본다는 점', '식민지 문제를 지나치게 계급적으로 본다는 점', '금융자본의 독점 단계라는 경제적 토대를 흐리고 제국주의를 선택 가능한 정책처럼 만든다는 점', '자본수출의 중요성을 과도하게 인정한다는 점'], ['That he treats policy too economically', 'That he treats colonial questions too class-wise', 'That he obscures the economic basis in monopoly finance capital and makes imperialism look like a selectable policy', 'That he overrecognizes the importance of export of capital'], '레닌의 반박은 제국주의가 단순한 정책 선택이 아니라 자본주의 발전 단계라는 데 있다. 정책 형태만 보면 독점과 금융자본의 필연적 압력을 놓친다.', 'Lenin’s reply is that imperialism is not a mere policy choice but a stage of capitalist development. Looking only at policy form misses the necessary pressure of monopoly and finance capital.'),
                q(0, '제국주의의 다섯 특징을 함께 보아야 하는 이유는 무엇인가?', 'Why must the five features of imperialism be seen together?', ['각 특징이 따로 떨어진 현상이 아니라 독점자본주의가 세계경제를 지배하는 서로 연결된 고리이기 때문이다.', '서로 모순되므로 하나만 골라야 하기 때문이다.', '그중 하나만 확인하면 다른 특징은 부차적 배경으로 밀려나기 때문이다.', '레닌이 원래 경제분석을 피하려 했기 때문이다.'], ['Because they are interconnected links through which monopoly capitalism rules the world economy, not isolated phenomena.', 'Because they contradict one another and only one should be chosen.', 'Because if one exists, the others automatically disappear.', 'Because Lenin originally tried to avoid economic analysis.'], '독점은 은행과 결합해 금융자본을 만들고, 금융자본은 자본수출과 세계분할을 밀어붙인다. 다섯 특징은 제국주의 전체 구조의 연결된 측면이다.', 'Monopoly fuses with banks into finance capital, and finance capital drives capital export and world division. The five features are connected aspects of the whole imperialist structure.'),
            ],
            [
                q(1, '“독점 단계”라는 짧은 정의만으로 충분하지 않아 레닌이 다섯 특징을 제시하는 이유는 무엇인가?', 'Why does Lenin give five features if the brief definition “monopoly stage” is already available?', ['짧은 정의만으로는 구체적 매개가 잘 보이지 않기 때문이다.', '독점이 실제로 은행, 자본수출, 국제 카르텔, 영토분할과 어떻게 결합하는지 구체화해야 하기 때문이다.', '다섯 특징은 독점과 느슨하게만 연결된 보조 항목이기 때문이다.', '제국주의를 주로 정치 지도자의 선택 문제로 좁히기 위해서다.'], ['Because the brief definition is wrong.', 'Because it must be specified how monopoly concretely combines with banks, capital export, international cartels, and territorial partition.', 'Because the five features are an accidental list unrelated to monopoly.', 'To turn imperialism from economics into psychology.'], '짧은 정의는 핵심을 잡지만 충분한 분석은 아니다. 다섯 특징은 독점이 어떤 경제적·세계적 형태로 전개되는지 보여준다.', 'The brief definition captures the core but is not a full analysis. The five features show the economic and world forms through which monopoly unfolds.'),
                q(3, '레닌이 “순수하게 경제적인” 정의를 말할 때도 추상적 모델에 머물지 않는 이유는 무엇인가?', 'Why does Lenin not remain at an abstract model even when giving a “purely economic” definition?', ['구체적 통계를 모두 배제해야 정의가 가능하다고 보기 때문이다.', '경제와 역사는 서로 무관하다고 보기 때문이다.', '제국주의는 어느 시대에나 같은 일반 욕망이라고 보기 때문이다.', '20세기 초 금융자본의 역사적으로 구체적인 조건과 세계경제의 실제 분포를 함께 보아야 하기 때문이다.'], ['Because he thinks a definition requires excluding all concrete statistics.', 'Because he thinks economics and history are unrelated.', 'Because he sees imperialism as the same general desire in every age.', 'Because one must see the historically concrete conditions of early twentieth-century finance capital and the real distribution of the world economy.'], '레닌은 정의를 역사적 현실과 연결한다. 추상적 “강대국 욕망”이 아니라 독점, 금융, 철도, 식민지, 무역의 구체적 배치가 분석 대상이다.', 'Lenin connects definition to historical reality. The object is not abstract “great-power desire” but the concrete arrangement of monopoly, finance, railways, colonies, and trade.'),
                q(0, '카우츠키의 “초제국주의” 전망에 대한 레닌의 핵심 반론은 무엇인가?', 'What is Lenin’s central objection to Kautsky’s prospect of “ultra-imperialism”?', ['금융자본의 지배는 세계경제의 불균등성과 모순을 줄이지 않고 키운다는 점', '국제 카르텔의 실제 영향이 제한적이었다는 점', '제국주의 국가들은 협정을 맺을 수 없다는 점', '자본주의에서는 모든 나라가 같은 속도로 발전한다는 점'], ['The rule of finance capital increases rather than reduces unevenness and contradictions in the world economy.', 'International cartels never existed.', 'Imperialist states cannot make agreements.', 'All countries develop at the same pace under capitalism.'], '레닌은 국제 협정의 존재를 부정하지 않는다. 다만 그런 협정은 힘의 비율에 따른 일시적 분할이며, 불균등 발전이 그 토대를 흔든다고 본다.', 'Lenin does not deny the existence of international agreements. He argues that they are temporary divisions according to relations of strength, and uneven development undermines them.'),
                q(2, '철도 통계가 제국주의 특수 단계 분석에서 맡는 역할은 무엇인가?', 'What role do railway statistics play in the analysis of imperialism as a special stage?', ['철도 확장이 주로 지역 교통 개선의 지표라고 본다.', '철도 길이를 정치제도 발전의 대략적 지표로 읽는다.', '식민지와 반식민지에서 자본주의 발전이 빠르게 확장되지만 그 지배권은 소수 금융자본 국가에 집중됨을 보여준다.', '철도망 확대가 영토분할 문제를 점차 완화한다고 본다.'], ['They show railways are cultural facilities unrelated to finance capital.', 'Railway length directly measures democracy.', 'They show capitalist development rapidly expanding in colonies and semi-colonies while command remains concentrated in a few finance-capital countries.', 'When railways grow, territorial division disappears.'], '레닌은 철도를 세계 자본주의의 물질적 지표로 본다. 철도 확장은 발전이지만, 누가 투자하고 통제하는가를 보면 금융자본의 지배와 불균등성이 드러난다.', 'Lenin treats railways as a material indicator of world capitalism. Railway expansion is development, but who invests and controls reveals finance capital’s rule and unevenness.'),
                q(0, '이 장의 정의가 노동운동에 주는 함의는 무엇인가?', 'What implication does this chapter’s definition have for the workers’ movement?', ['반전과 반식민지 투쟁은 금융자본과 독점에 대한 투쟁과 분리될 수 없다.', '제국주의는 정책이므로 노동운동은 국내 임금 문제만 보면 된다.', '독점 단계에서는 계급대립이 사라진다.', '국제주의는 식민지 문제를 다루지 않을 때만 가능하다.'], ['Antiwar and anticolonial struggle cannot be separated from struggle against finance capital and monopoly.', 'Imperialism is only policy, so workers’ movements need look only at domestic wages.', 'In the monopoly stage class antagonism disappears.', 'Internationalism is possible only when colonial questions are ignored.'], '제국주의가 독점자본주의의 단계라면, 그것에 맞선 투쟁은 외교적 선의에 호소하는 데 그칠 수 없다. 노동운동의 계급 독립성과 국제주의가 핵심 문제가 된다.', 'If imperialism is a stage of monopoly capitalism, struggle against it cannot stop at appeals to diplomatic goodwill. Class independence and internationalism become central questions for the workers’ movement.'),
            ]
        ),
        chapter(
            8,
            '기생성과 부패',
            'Parasitism and Decay of Capitalism',
            '독점이 기술 정체, 금리생활자 계층, 채권국과 채무국의 분할, 노동귀족과 기회주의를 낳는 경향을 분석한다.',
            'Analyzes monopoly’s tendencies toward technical stagnation, rentiers, creditor-debtor division, labor aristocracy, and opportunism.',
            '부패가 성장 정지를 뜻하지 않는다는 점, 고독점이윤이 일부 노동자층을 매수할 경제적 가능성을 만든다는 점을 이해한다.',
            'Understand that decay does not mean no growth, and that high monopoly profits create the economic possibility of bribing sections of workers.',
            [
                ['정체 경향', '독점가격은 기술혁신 압력을 약화시키고 때로는 발명을 묻어둘 수 있다.'],
                ['금리생활자', '자본수출 수입은 생산에서 떨어진 지대적 생활층을 키운다.'],
                ['노동귀족', '초과이윤은 일부 노동자층을 제국주의 질서에 묶을 물질적 여지를 만든다.'],
            ],
            [
                ['Stagnation tendency', 'Monopoly prices weaken pressure for technical innovation and can bury inventions.'],
                ['Rentiers', 'Income from exported capital expands strata living apart from production.'],
                ['Labor aristocracy', 'Superprofits create material room to bind sections of workers to imperialist order.'],
            ],
            [
                q(2, '레닌이 독점에서 “기생성과 부패”를 말할 때, 곧바로 모든 성장이 멈춘다는 뜻인가?', 'When Lenin speaks of “parasitism and decay” under monopoly, does he mean all growth immediately stops?', ['그렇다. 독점의 우세는 생산과 기술의 활력을 크게 약화시킨다.', '그렇다. 부패는 주로 총생산 감소로만 확인된다.', '아니다. 급속한 성장도 가능하지만 독점이 정체, 금융수입, 매수, 불균등성을 함께 키운다는 뜻이다.', '아니다. 그래서 독점은 아무 모순도 없는 진보만 뜻한다.'], ['Yes. Once monopoly appears, production and technique immediately stop.', 'Yes. Decay means only a decline in total output.', 'No. Rapid growth is possible, but monopoly also expands stagnation, rentier income, bribery, and unevenness.', 'No. Therefore monopoly means pure progress without contradictions.'], '레닌의 “부패”는 단순한 정지론이 아니다. 독점자본주의는 기술과 생산을 발전시키면서도, 그 발전을 기생적 금융수입과 정체 경향, 계급 매수와 결합시킨다.', 'Lenin’s “decay” is not a simple theory of standstill. Monopoly capitalism can develop technique and production while tying that development to parasitic financial income, stagnation tendencies, and class bribery.'),
                q(0, '독점가격이 기술혁신을 늦출 수 있다는 레닌의 논리는 무엇인가?', 'What is Lenin’s logic for saying monopoly prices can slow technical innovation?', ['독점체는 높은 가격과 지배적 지위를 통해 비용절감 압력을 덜 받을 수 있고, 때로는 불리한 발명을 묻어둘 수 있다.', '독점체는 연구소를 절대 만들 수 없기 때문이다.', '기술혁신은 독점보다 분산된 생산자 사이에서 더 안정적으로 일어난다고 보기 때문이다.', '독점가격이 생기면 노동자가 모든 특허를 소유하기 때문이다.'], ['A monopoly can face less pressure to cut costs because of high prices and dominant position, and can sometimes suppress inconvenient inventions.', 'Because monopolies can never create laboratories.', 'Because technical innovation is possible only in agrarian society.', 'Because monopoly prices make workers own all patents.'], '독점은 기술을 조직하기도 하지만, 경쟁 압력이 약해진 지점에서는 혁신을 지연하거나 통제할 수 있다. 그래서 발전과 정체가 함께 나타난다.', 'Monopoly can organize technique, but where competitive pressure weakens it can delay or control innovation. Development and stagnation therefore coexist.'),
                q(0, '“금리생활자 국가” 또는 채권국의 성격은 무엇과 연결되는가?', 'What is the character of a “rentier state” or creditor country connected with?', ['국내 생산과 무관하게 해외투자 수익과 이자, 배당으로 살아가는 층이 커지는 현상', '노동자가 모든 은행 이자를 공동으로 나누는 현상', '해외 차관이 채권국의 산업 이해와 느슨하게만 연결되는 현상', '산업자본이 완전히 사라져 상품이 생산되지 않는 현상'], ['The growth of strata living from foreign-investment income, interest, and dividends apart from production', 'Workers collectively sharing all bank interest', 'Foreign loans always becoming grants', 'Industrial capital disappearing completely so no commodities are produced'], '자본수출이 커지면 채권국에는 생산에서 떨어진 금융수입층이 커진다. 레닌은 이를 제국주의의 기생성을 보여주는 중요한 징후로 본다.', 'As capital export grows, creditor countries develop strata living from financial income apart from production. Lenin sees this as an important sign of imperialism’s parasitism.'),
                q(3, '이민과 노동시장에 관한 레닌의 논의는 무엇을 보여주는가?', 'What does Lenin’s discussion of immigration and labor markets show?', ['제국주의 국가의 노동계급 내부 차이는 주로 숙련 차이로만 설명된다는 점', '이민 노동자는 항상 가장 높은 임금을 받는다는 점', '국경 이동은 경제와 무관한 문화 현상일 뿐이라는 점', '제국주의가 저임금 이민 노동자를 끌어들이며 노동계급 내부의 층화와 차별을 강화할 수 있다는 점'], ['That there are no differences within the working class in imperialist countries', 'That immigrant workers always receive the highest wages', 'That border movement is only a cultural phenomenon unrelated to economics', 'That imperialism can draw in low-wage immigrant labor and strengthen stratification and discrimination inside the working class'], '레닌은 노동계급을 추상적으로 균질한 집단으로만 보지 않는다. 제국주의 국가는 저임금 이민 노동과 특권적 노동자층을 함께 만들어 계급 내부 분할을 강화할 수 있다.', 'Lenin does not treat the working class as abstractly homogeneous. Imperialist countries can produce both low-wage immigrant labor and privileged worker layers, strengthening internal divisions.'),
                q(0, '초과이윤과 노동귀족의 연결을 가장 정확히 설명한 것은 무엇인가?', 'Which statement best explains the link between superprofits and the labor aristocracy?', ['식민지와 세계시장 독점에서 나온 초과이윤 일부가 노동자 상층을 매수해 기회주의의 물질적 토대가 될 수 있다.', '초과이윤은 임금협상을 통해 노동계급 전체에 비교적 고르게 돌아간다.', '노동귀족은 자본주의 이전의 신분제 잔재일 뿐이다.', '기회주의는 경제적 토대 없이 순수한 개인 취향으로만 생긴다.'], ['A portion of superprofits from colonies and world-market monopoly can bribe upper layers of workers and become a material basis for opportunism.', 'Superprofits are always distributed equally to all workers.', 'The labor aristocracy is only a pre-capitalist status remnant.', 'Opportunism arises only as a personal preference without economic basis.'], '레닌은 기회주의를 단순한 사상 오류로만 보지 않는다. 독점이윤과 식민지 수탈은 일부 노동자층을 부르주아 질서에 묶을 경제적 여지를 만든다.', 'Lenin does not treat opportunism merely as an ideological error. Monopoly profit and colonial exploitation create economic room to bind some worker layers to bourgeois order.'),
            ],
            [
                q(0, '부패와 빠른 발전이 함께 나타날 수 있다는 점을 이해하는 것이 왜 중요한가?', 'Why is it important to understand that decay and rapid development can coexist?', ['정체만 보면 독점이 생산력과 세계연결을 발전시키면서도 모순을 키우는 방식을 놓치기 때문이다.', '빠른 발전이 있으면 착취가 사라진다는 뜻이기 때문이다.', '부패라는 말은 레닌에게 도덕적 욕설일 뿐이기 때문이다.', '독점자본주의에는 금융수입이 없기 때문이다.'], ['Because seeing imperialism only as stagnation misses how monopoly develops productive forces and world links while intensifying contradictions.', 'Because rapid development means exploitation disappears.', 'Because “decay” is only a moral insult for Lenin.', 'Because monopoly capitalism has no financial income.'], '레닌의 분석은 변증법적이다. 제국주의는 생산을 사회화하고 기술을 발전시키지만, 그 발전은 기생성, 불균등성, 전쟁, 기회주의와 얽힌다.', 'Lenin’s analysis is dialectical. Imperialism socializes production and develops technique, but that development is entangled with parasitism, unevenness, war, and opportunism.'),
                q(1, '영국 노동운동에 관한 마르크스와 엥겔스의 언급을 레닌이 끌어오는 이유는 무엇인가?', 'Why does Lenin invoke Marx and Engels on the British workers’ movement?', ['영국 노동운동이 식민지 수익과 별개로 형성되었다는 점을 보이기 위해서', '식민지와 세계시장 독점이 노동운동 안의 부르주아화·기회주의와 연결될 수 있음을 보이기 위해서', '노동운동은 경제조건과 무관하다는 점을 보이기 위해서', '영국에는 노동계급이 존재하지 않았다는 점을 보이기 위해서'], ['To show British workers always fought colonial policy revolutionarily', 'To show that colonial and world-market monopoly can be connected with bourgeoisification and opportunism inside the workers’ movement', 'To show workers’ movements are unrelated to economic conditions', 'To show there was no working class in Britain'], '레닌은 영국 사례를 우연으로 보지 않는다. 세계시장과 식민지 독점에서 나온 이익이 노동자 상층과 지도부를 부르주아 정치에 묶을 수 있음을 보여준다.', 'Lenin does not treat the British case as accidental. It shows how gains from world-market and colonial monopoly can bind upper worker layers and leaders to bourgeois politics.'),
                q(0, '이 장에서 기회주의 비판이 제국주의 분석의 부록이 아니라 중심인 이유는 무엇인가?', 'Why is the critique of opportunism central rather than an appendix to the analysis of imperialism?', ['제국주의 초과이윤이 노동운동 내부의 특정 층과 정치노선을 물질적으로 뒷받침할 수 있기 때문이다.', '기회주의는 식민지 문제보다 주로 국내 의회전술에서만 생긴다고 보기 때문이다.', '레닌은 경제 분석을 포기하고 당내 논쟁만 하려 했기 때문이다.', '독점 단계에서는 노동운동이 더 이상 존재하지 않기 때문이다.'], ['Because imperialist superprofits can materially support particular layers and political lines within the workers’ movement.', 'Because opportunism is completely unrelated to colonial questions.', 'Because Lenin abandons economic analysis for internal party debate.', 'Because workers’ movements no longer exist in the monopoly stage.'], '반제국주의는 외교 입장이 아니라 노동운동의 계급노선 문제다. 초과이윤이 일부 노동자를 매수할 수 있다면, 기회주의 비판은 제국주의론의 핵심 일부가 된다.', 'Anti-imperialism is not merely a diplomatic position but a question of class line in the workers’ movement. If superprofits can bribe some workers, critique of opportunism is central to imperialism theory.'),
                q(3, '제국주의 국가로의 이민 증가를 레닌이 다룰 때 피해야 할 해석은 무엇인가?', 'What interpretation should be avoided when reading Lenin on increased immigration into imperialist countries?', ['노동시장 내부의 임금·직무 위계와 제국주의 수익이 연결될 수 있다는 해석', '이민 노동자가 제국주의 경제에서 낮은 임금 부문에 배치될 수 있다는 해석', '노동계급 내부 분할이 기회주의와 연결될 수 있다는 해석', '이민 노동자를 문제의 원인으로 돌리고 제국주의적 착취구조를 가리는 해석'], ['An interpretation linking internal wage and job hierarchies to imperialist income', 'An interpretation that immigrant labor can be placed in low-wage sectors of imperialist economies', 'An interpretation linking internal divisions of the working class to opportunism', 'An interpretation that blames immigrant workers and obscures the imperialist structure of exploitation'], '레닌의 초점은 이민 노동자 비난이 아니다. 문제는 제국주의 경제가 저임금 노동과 특권적 노동자층을 함께 만들어 계급연대를 약화시키는 구조다.', 'Lenin’s focus is not blaming immigrant workers. The issue is the structure by which imperialist economies produce both low-wage labor and privileged worker layers, weakening class solidarity.'),
                q(0, '이 장이 다음 “제국주의 비판” 장으로 이어지는 이유는 무엇인가?', 'Why does this chapter lead into the next chapter on the critique of imperialism?', ['기생성과 노동귀족 문제는 제국주의를 어떻게 비판할 것인가, 특히 기회주의와 어떻게 싸울 것인가의 문제로 이어지기 때문이다.', '부패 분석은 제국주의를 변호하는 결론으로 이어지기 때문이다.', '기생성은 경제와 무관한 심리 현상이기 때문이다.', '노동귀족 문제가 나오면 더 이상 정치논쟁은 필요 없기 때문이다.'], ['Because parasitism and the labor-aristocracy question lead to how imperialism should be criticized, especially how to fight opportunism.', 'Because the analysis of decay leads to a defense of imperialism.', 'Because parasitism is a psychological phenomenon unrelated to economics.', 'Because once labor aristocracy is mentioned, political debate is no longer needed.'], '제국주의 비판은 “나쁜 면을 줄이자”는 도덕론으로 끝날 수 없다. 독점이윤과 기회주의의 관계를 보면 어떤 비판이 계급적으로 일관된지 따져야 한다.', 'The critique of imperialism cannot end as moralism about reducing “bad aspects.” Once the relation between monopoly profit and opportunism is seen, one must ask what critique is class-consistent.'),
            ]
        ),
        chapter(
            9,
            '제국주의 비판',
            'Critique of Imperialism',
            '제국주의에 대한 부르주아·소부르주아·카우츠키식 비판을 검토하며, 독점의 토대를 건드리지 않는 평화론과 자유경쟁 복귀론을 비판한다.',
            'Examines bourgeois, petty-bourgeois, and Kautskyan critiques of imperialism, criticizing pacifism and returns to free competition that leave monopoly’s basis intact.',
            '제국주의의 “과잉”만 비판하는 입장과 금융자본의 경제적 토대를 겨냥하는 마르크스주의 비판을 구분한다.',
            'Distinguish criticism of imperialist “excesses” from Marxist criticism aimed at finance capital’s economic basis.',
            [
                ['표면비판', '경찰식 규제나 평화 호소는 독점의 경제 토대를 그대로 둔다.'],
                ['카우츠키', '제국주의를 금융자본의 단계가 아니라 선호 가능한 정책처럼 분리한다.'],
                ['마르크스주의', '독점과 자유경쟁의 공존, 금융이윤과 “정직한 거래”의 모순을 드러낸다.'],
            ],
            [
                ['Surface critique', 'Police regulation or appeals for peace leave monopoly’s economic basis intact.'],
                ['Kautsky', 'He separates imperialism as a policy preference rather than a stage of finance capital.'],
                ['Marxist critique', 'It exposes contradictions between monopoly and competition, financial gains and “honest trade.”'],
            ],
            [
                q(1, '어떤 비판자가 식민지 폭력과 부패를 비난하면서도 독점과 금융자본은 건드리지 않는다. 레닌이 문제 삼는 지점은 무엇인가?', 'What is Lenin’s main problem with bourgeois critiques of imperialism?', ['제국주의를 너무 계급적으로 비판한다는 점', '독점과 금융자본의 토대는 그대로 둔 채 부패, 과잉, 폭력만 줄이려 한다는 점', '해외투자의 존재를 부차적인 외교 문제로만 다룬다는 점', '평화 호소를 모두 혁명적 노선으로 만든다는 점'], ['That they criticize imperialism too class-consciously', 'That they leave the basis of monopoly and finance capital intact while trying to reduce corruption, excess, or violence', 'That they deny the existence of foreign investment entirely', 'That they make all appeals for peace revolutionary'], '레닌은 제국주의의 나쁜 결과만 비판하고 경제적 토대를 보존하는 입장을 비판한다. 독점과 금융자본을 건드리지 않으면 같은 압력이 반복된다.', 'Lenin criticizes views that attack only imperialism’s bad results while preserving its economic basis. If monopoly and finance capital are untouched, the same pressures recur.'),
                q(0, '자유경쟁으로 돌아가자는 소부르주아적 비판에 대해 레닌이 제기하는 반론은 무엇인가?', 'What objection does Lenin raise against the petty-bourgeois call to return to free competition?', ['독점은 자유경쟁이 낳은 산물이므로, 그 토대를 보존한 채 과거의 “평화로운 경쟁”으로 돌아갈 수 없다는 점', '자유경쟁은 역사상 존재한 적이 없다는 점', '독점은 봉건제가 만든 것이므로 자본주의와 무관하다는 점', '자유경쟁 회복이 노동운동의 조건을 충분히 개선한다고 보는 점'], ['Monopoly is the product of free competition, so one cannot preserve the basis and return to past “peaceful competition.”', 'Free competition never existed in history.', 'Monopoly was created by feudalism and has no relation to capitalism.', 'Returning to free competition automatically creates workers’ power.'], '레닌에게 독점은 자유경쟁의 외부 적이 아니라 그 결과다. 따라서 독점의 폐해만 싫어하며 자유경쟁 자본주의로 회귀하자는 주장은 역사적 운동을 거꾸로 돌리려는 환상이다.', 'For Lenin, monopoly is not an external enemy of free competition but its result. Wanting only to remove monopoly’s harms and return to free-competition capitalism is an illusion of reversing historical development.'),
                q(3, '국제 카르텔과 국가 간 협정이 있으니 장기 평화가 가능하다는 주장에 대해, 레닌은 어디를 찌르는가?', 'What is central in Lenin’s critique of Kautsky’s “ultra-imperialism”?', ['국제적 평화 협정은 실제로 한 번도 없었다는 주장', '제국주의 국가는 협정을 맺을 능력이 없다는 주장', '평화 가능성을 제시하는 것만으로 노동자 정치가 충분히 급진화된다는 주장', '자본주의가 유지되는 한 국제 동맹은 일시적 휴전일 뿐, 불균등 발전과 세력 변화가 새 충돌을 낳는다는 주장'], ['The claim that international peaceful agreements have never existed', 'The claim that imperialist states cannot make agreements', 'The claim that telling workers peace is possible is always revolutionary', 'The claim that as long as capitalism remains, international alliances are temporary truces and uneven development produces new conflicts'], '레닌은 협정의 가능성을 부정하지 않는다. 문제는 협정을 영구평화의 씨앗처럼 제시해 현재의 모순과 기회주의를 가리는 데 있다.', 'Lenin does not deny that agreements are possible. The problem is presenting them as seeds of permanent peace, thereby obscuring current contradictions and opportunism.'),
                q(2, '중국 분할을 둘러싼 열강의 공동 행동과 경쟁을 레닌이 함께 보는 이유는 무엇인가?', 'Why does Lenin examine both joint action and rivalry among great powers over China?', ['공동 행동이 있으면 경쟁은 완전히 사라지기 때문이다.', '경쟁이 있으면 어떤 공동 행동도 불가능하기 때문이다.', '제국주의적 동맹과 갈등은 같은 세계분할 토대 위에서 번갈아 나타날 수 있기 때문이다.', '중국 문제는 금융자본과 무관한 문화교류이기 때문이다.'], ['Because if joint action exists, rivalry disappears completely.', 'Because if rivalry exists, joint action is impossible.', 'Because imperialist alliances and conflicts can alternate on the same basis of world division.', 'Because the China question was cultural exchange unrelated to finance capital.'], '레닌은 “공동 행동이 있으니 평화”라는 결론을 거부한다. 같은 열강들이 오늘은 공동으로 분할하고 내일은 몫을 두고 충돌할 수 있다.', 'Lenin rejects the conclusion “joint action means peace.” The same powers can jointly divide today and clash tomorrow over shares.'),
                q(0, '이 장에서 마르크스주의적 제국주의 비판의 기준은 무엇인가?', 'What is the criterion of a Marxist critique of imperialism in this chapter?', ['금융자본의 경제적 토대와 그것이 낳는 전쟁·분할·기회주의를 함께 겨냥하는가', '외교적 표현이 더 절제된 형태를 취하는가', '자본가가 더 공정한 식민지 행정을 약속하는가', '자유경쟁 시절의 상업 윤리를 그리워하는가'], ['Whether it targets the economic basis of finance capital and monopoly together with the wars, divisions, and opportunism they produce', 'Whether diplomats use polite language', 'Whether capitalists promise fairer colonial administration', 'Whether it nostalgically misses the commercial ethics of free competition'], '레닌에게 마르크스주의 비판은 제국주의의 표면적 과잉만 다루지 않는다. 독점·금융자본의 토대와 노동운동 내부의 기회주의까지 함께 겨냥해야 한다.', 'For Lenin, Marxist critique does not address only imperialism’s surface excesses. It must target the basis of monopoly and finance capital and the opportunism inside the workers’ movement.'),
            ],
            [
                q(0, '홉슨 같은 부르주아 비판자에게서 레닌이 자료를 사용하면서도 정치적 결론은 거부하는 이유는 무엇인가?', 'Why does Lenin use material from bourgeois critics such as Hobson while rejecting their political conclusions?', ['자료와 관찰은 유용할 수 있지만, 독점자본주의를 넘어서지 않는 개량적 결론은 모순의 토대를 보존하기 때문이다.', '부르주아 비판자는 모든 면에서 항상 혁명적이기 때문이다.', '레닌은 자료보다 저자의 계급 출신만 보았기 때문이다.', '홉슨은 금융자본의 존재를 완전히 부정했기 때문이다.'], ['Because their facts and observations may be useful, but reformist conclusions that do not go beyond monopoly capitalism preserve the basis of contradiction.', 'Because bourgeois critics are always revolutionary in every respect.', 'Because Lenin cared only about class origin, not evidence.', 'Because Hobson completely denied the existence of finance capital.'], '레닌은 자료 사용과 정치노선 평가를 구분한다. 부르주아 비판자는 중요한 사실을 제공할 수 있지만, 해결책은 독점의 토대를 보존하는 개량에 머물 수 있다.', 'Lenin distinguishes using evidence from evaluating political line. Bourgeois critics can provide important facts, while their solutions remain reforms preserving monopoly’s basis.'),
                q(3, '카우츠키가 “산업자본은 평화롭고 금융자본만 폭력적”인 것처럼 나누는 데 담긴 문제는 무엇인가?', 'What is the problem when Kautsky divides matters as if “industrial capital is peaceful and only finance capital is violent”?', ['산업자본이 제국주의에서 상대적으로 수동적이었다는 점을 과장한다.', '금융자본은 산업과 절대 융합하지 않는다는 점을 인정한다.', '자본수출은 산업 주문과 무관하다는 점을 보여준다.', '독점 단계에서 은행자본과 산업자본이 융합한다는 핵심을 흐려 제국주의를 정책 선택으로 축소한다.'], ['It exaggerates that industrial capital never participated in imperialism.', 'It admits finance capital never fuses with industry.', 'It shows capital export is unrelated to industrial orders.', 'It obscures the fusion of bank and industrial capital in the monopoly stage and reduces imperialism to policy choice.'], '레닌에게 금융자본은 산업과 분리된 외부 기생충이 아니다. 독점 산업과 대은행의 융합을 놓치면 제국주의의 경제적 필연성을 흐리게 된다.', 'For Lenin, finance capital is not an external parasite separate from industry. Missing the fusion of monopoly industry and big banks obscures imperialism’s economic necessity.'),
                q(0, '“평화적 동맹은 전쟁을 준비하고, 전쟁은 새 평화적 동맹을 낳는다”는 레닌의 논리는 무엇을 겨냥하는가?', 'What does Lenin target with the logic that peaceful alliances prepare wars and wars produce new peaceful alliances?', ['평화와 전쟁을 서로 다른 체제의 산물처럼 분리해 노동자를 안심시키는 초제국주의 환상', '외교 협정이 사회주의적 조정으로 발전할 수 있다는 주장', '전쟁의 원인을 주로 외교적 오판에서 찾는 주장', '노동운동이 국제문제를 다루면 안 된다는 주장'], ['The ultra-imperialist illusion that separates peace and war as products of different systems and reassures workers', 'The claim that every diplomatic agreement is immediately socialism', 'The claim that war has no relation to economics', 'The claim that workers’ movements must not address international questions'], '레닌은 평화 협정과 전쟁을 한 사슬의 서로 다른 고리로 본다. 둘 다 금융자본과 세계분할의 같은 토대 위에서 나타난다.', 'Lenin treats peaceful agreements and wars as different links in one chain. Both arise on the same basis of finance capital and world division.'),
                q(2, '제국주의 비판에서 “정직한 경쟁”에 대한 향수가 위험한 이유는 무엇인가?', 'Why is nostalgia for “honest competition” dangerous in the critique of imperialism?', ['정직한 경쟁은 독점보다 더 높은 단계의 사회주의이기 때문이다.', '상업 관행을 더 투명하게 만들면 금융자본의 지배도 점차 약해진다고 보기 때문이다.', '독점이 자유경쟁 자체에서 발생했다는 역사적 사실을 가리고, 자본주의의 낡은 형태로 퇴행하는 환상을 주기 때문이다.', '노동자에게 국제주의보다 소비자 윤리가 더 중요하다는 뜻이기 때문이다.'], ['Because honest competition is a higher stage of socialism than monopoly.', 'Because restoring moral competition automatically abolishes finance capital.', 'Because it hides the historical fact that monopoly arose from free competition itself and creates the illusion of regressing to an older capitalism.', 'Because consumer ethics are more important for workers than internationalism.'], '레닌은 독점의 폐해를 자유경쟁의 미화로 해결할 수 없다고 본다. 자유경쟁은 바로 독점을 낳은 역사적 토대였다.', 'Lenin argues that monopoly’s harms cannot be solved by idealizing free competition. Free competition was precisely the historical basis that produced monopoly.'),
                q(0, '이 장의 비판이 다음 최종 장의 “역사적 위치”로 넘어가는 이유는 무엇인가?', 'Why does this chapter’s critique lead to the final chapter on imperialism’s historical place?', ['잘못된 비판들을 걷어낸 뒤, 제국주의가 자본주의 발전 속에서 어떤 단계이고 무엇을 예비하는지 종합해야 하기 때문이다.', '비판을 끝내면 경제적 정의는 필요 없기 때문이다.', '레닌은 마지막에 제국주의를 긍정하려 하기 때문이다.', '역사적 위치는 앞 장들과 무관한 문학적 결론이기 때문이다.'], ['Because after clearing away false critiques, Lenin must synthesize what stage imperialism is in capitalist development and what it prepares.', 'Because once critique is done, economic definition is unnecessary.', 'Because Lenin wants to affirm imperialism at the end.', 'Because historical place is a literary conclusion unrelated to the earlier chapters.'], '9장은 어떤 비판이 부족한지 가른다. 10장은 그 위에서 제국주의를 독점자본주의, 기생적 자본주의, 이행기의 자본주의로 종합한다.', 'Chapter 9 distinguishes inadequate critiques. Chapter 10 then synthesizes imperialism as monopoly capitalism, parasitic capitalism, and capitalism in transition.'),
            ]
        ),
        chapter(
            10,
            '제국주의의 역사적 위치',
            'The Place of Imperialism in History',
            '제국주의를 독점자본주의, 기생적·부패한 자본주의, 이행기의 자본주의로 규정하며 앞 논의를 역사적으로 종합한다.',
            'Historically synthesizes the argument by defining imperialism as monopoly capitalism, parasitic and decaying capitalism, and capitalism in transition.',
            '독점의 네 형태와 이행기 규정을 연결하고, “부패”가 빠른 성장과 함께 나타날 수 있는 모순적 성격을 파악한다.',
            'Connect the forms of monopoly with the definition of a transitional epoch, and grasp how “decay” can coexist with rapid growth.',
            [
                ['독점자본주의', '생산집중, 원료 장악, 은행 독점, 식민정책에서 독점이 나타난다.'],
                ['부패와 성장', '기생성은 성장 부재가 아니라 모순이 더 날카로운 성장과 함께 간다.'],
                ['이행기', '사회화된 생산은 사적 소유의 껍질과 충돌하며 더 높은 질서의 조건을 만든다.'],
            ],
            [
                ['Monopoly capitalism', 'Monopoly appears in concentration of production, raw-material control, bank monopoly, and colonial policy.'],
                ['Decay and growth', 'Parasitism does not mean no growth; it accompanies sharper contradictory growth.'],
                ['Transition', 'Socialized production collides with the shell of private property and creates conditions for a higher order.'],
            ],
            [
                q(0, '레닌이 최종 장에서 제국주의를 역사적으로 규정하는 첫 번째 말은 무엇인가?', 'What is Lenin’s first historical characterization of imperialism in the final chapter?', ['독점자본주의', '봉건제의 부활', '순수 자유경쟁의 완성', '소상품생산의 황금기'], ['Monopoly capitalism', 'A revival of feudalism', 'The completion of pure free competition', 'A golden age of small commodity production'], '최종 장의 출발점은 앞 장들의 종합이다. 생산집중, 은행, 금융자본, 세계분할은 제국주의가 자본주의의 독점 단계임을 보여준다.', 'The final chapter begins by synthesizing the previous chapters. Concentration, banks, finance capital, and world division show imperialism as the monopoly stage of capitalism.'),
                q(2, '레닌이 말하는 독점의 주요 형태로 가장 적절한 묶음은 무엇인가?', 'Which set best matches the main forms of monopoly Lenin discusses?', ['농촌 공동체, 길드, 왕실 특권, 교회 토지', '소비자 협동조합, 노동자 평의회, 지방시장, 수공업', '카르텔·트러스트, 원료지 장악, 은행 독점, 식민지 분할', '소매상 할인, 가족기업, 현금판매, 지역축제'], ['Peasant communes, guilds, royal privilege, church land', 'Consumer cooperatives, workers’ councils, local markets, handicraft', 'Cartels and trusts, control of raw materials, bank monopoly, colonial partition', 'Retail discounts, family firms, cash sales, local fairs'], '레닌은 독점이 산업 내부의 카르텔만이 아니라 원료, 은행, 식민정책 속에서도 나타난다고 정리한다. 이것들이 제국주의의 역사적 위치를 규정한다.', 'Lenin summarizes monopoly not only as cartels inside industry but also in raw materials, banks, and colonial policy. These define imperialism’s historical place.'),
                q(1, '제국주의가 “이행기의 자본주의”라는 말은 무엇을 뜻하는가?', 'What does it mean that imperialism is “capitalism in transition”?', ['자본주의가 국제 협정을 통해 평화로운 조정 단계에 들어섰다는 뜻', '사회화된 생산이 사적 소유와 충돌하며 자본주의를 넘어설 물질적 조건을 성숙시킨다는 뜻', '자본주의가 다시 수공업으로 돌아간다는 뜻', '계급투쟁 없이 금융가가 자발적으로 권력을 포기한다는 뜻'], ['Capitalism has already automatically become a peaceful world government.', 'Socialized production collides with private ownership and matures material conditions for going beyond capitalism.', 'Capitalism returns to handicraft.', 'Financiers voluntarily give up power without class struggle.'], '이행기는 자동 붕괴나 평화적 조화가 아니다. 독점은 생산을 거대한 사회적 과정으로 조직하지만, 그 조직은 사적 소유와 이윤의 껍질 안에서 더 이상 맞지 않게 된다.', 'Transition does not mean automatic collapse or peaceful harmony. Monopoly organizes production as a vast social process, but this organization no longer fits the shell of private ownership and profit.'),
                q(3, '레닌이 독일과 미국의 빠른 발전을 언급하면서도 “기생성”을 말하는 이유는 무엇인가?', 'Why does Lenin speak of “parasitism” while also mentioning rapid German and American development?', ['빠른 성장이 있으면 독점이 사라진다는 점을 보이기 위해서', '미국과 독일에는 금융자본이 없었다는 점을 보이기 위해서', '기생성은 경제가 멈춘다는 뜻만 가진다는 점을 보이기 위해서', '빠른 발전 자체가 금융자본의 해외 팽창, 식민지 요구, 노동자 매수와 결합할 수 있음을 보이기 위해서'], ['To show rapid growth makes monopoly disappear', 'To show there was no finance capital in the United States or Germany', 'To show parasitism only means the economy stops', 'To show rapid development itself can combine with finance capital’s outward expansion, colonial demands, and bribery of workers'], '레닌에게 부패는 저성장과 같은 말이 아니다. 빠르게 성장한 금융자본일수록 새 식민지와 안정적 수익을 요구하며 기생적 성격을 강화할 수 있다.', 'For Lenin, decay is not the same as low growth. Rapidly growing finance capital can demand new colonies and stable income, intensifying parasitic features.'),
                q(0, '최종 장이 앞 장들의 학습을 종합해 보여주는 결론은 무엇인가?', 'What conclusion does the final chapter synthesize from the earlier chapters?', ['제국주의는 독점·금융자본·세계분할·기회주의가 얽힌 자본주의의 역사적 단계다.', '제국주의는 자본주의와 무관한 군사적 취향이다.', '독점은 자유경쟁을 완성하고 모든 모순을 없앤다.', '식민지 분할은 경제 분석 없이 외교사로만 설명된다.'], ['Imperialism is a historical stage of capitalism linking monopoly, finance capital, world division, and opportunism.', 'Imperialism is a military taste unrelated to capitalism.', 'Monopoly completes free competition and removes all contradictions.', 'Colonial partition is explained only as diplomatic history without economic analysis.'], '10장은 정의를 반복하는 데 그치지 않고 제국주의의 위치를 정리한다. 그것은 독점자본주의이고, 기생적·부패한 자본주의이며, 동시에 더 높은 사회질서를 위한 물질적 조건을 성숙시키는 이행기의 자본주의다.', 'Chapter 10 does not merely repeat a definition; it locates imperialism historically. It is monopoly capitalism, parasitic and decaying capitalism, and capitalism in transition that matures material conditions for a higher social order.'),
            ],
            [
                q(1, '“사적 소유의 껍질이 내용에 맞지 않게 된다”는 최종 장의 논리를 가장 잘 설명한 것은 무엇인가?', 'Which statement best explains the final chapter’s logic that the shell of private ownership no longer fits the content?', ['생산은 소규모 개인 작업으로 돌아가지만 소유만 사회화된다는 뜻', '거대 독점이 원료, 운송, 생산, 판매를 사회적으로 조직하지만 그 통제와 이윤은 사적 소유에 갇힌다는 뜻', '사적 소유가 기술 발전을 완전히 멈추게 했다는 뜻', '모든 주주가 노동자 평의회를 구성한다는 뜻'], ['Production returns to small individual work while only ownership is socialized.', 'Giant monopolies socially organize raw materials, transport, production, and sales, but control and profit remain trapped in private ownership.', 'Private ownership has completely stopped technical development.', 'All shareholders form workers’ councils.'], '레닌은 독점이 생산을 사회화한다고 본다. 그러나 그 사회화된 생산은 소수 소유자의 이윤 목적에 묶여 있어, 내용과 껍질의 충돌이 극대화된다.', 'Lenin sees monopoly as socializing production. But this socialized production is bound to the profit aims of a few owners, maximizing the conflict between content and shell.'),
                q(2, '최종 장에서 제국주의와 기회주의의 연결이 다시 등장하는 이유는 무엇인가?', 'Why does the link between imperialism and opportunism reappear in the final chapter?', ['기회주의를 제국주의보다 국내 정치문화의 산물로 보기 위해서', '노동운동 논의를 경제분석에서 제거하기 위해서', '독점이윤이 노동자 상층 매수의 물질적 가능성을 제공하므로 제국주의의 역사적 위치에 노동운동의 분열이 포함되기 때문이다.', '기회주의는 모든 노동자에게 같은 정도로 나타난다는 점을 보이기 위해서'], ['To emphasize that opportunism is unrelated to imperialism', 'To remove workers’ movement questions from economic analysis', 'Because monopoly profit provides the material possibility for bribing upper worker layers, so imperialism’s historical place includes splits in the workers’ movement', 'To show opportunism appears equally among all workers'], '레닌의 제국주의론은 경제구조와 노동운동 노선을 연결한다. 초과이윤이 일부 노동자층을 묶을 수 있다면, 기회주의는 제국주의의 정치적 산물이다.', 'Lenin’s theory connects economic structure with the political line of the workers’ movement. If superprofits can bind some worker layers, opportunism is a political product of imperialism.'),
                q(0, '레닌이 부르주아 경제학자의 “상호연결” 같은 표현을 비판적으로 다루는 이유는 무엇인가?', 'Why does Lenin critically handles bourgeois economists’ terms such as “interlocking”?', ['그 표현은 현상의 표면을 묘사하지만, 그 밑의 생산관계 변화와 사적 소유의 모순을 파악하지 못하기 때문이다.', '상호연결이라는 말만으로 생산관계의 변화를 충분히 설명한다고 보기 때문이다.', '부르주아 경제학자는 어떤 사실도 관찰하지 못하기 때문이다.', '레닌은 독점기업 사이의 연결을 부정하기 때문이다.'], ['Because such terms describe the surface but fail to grasp the underlying change in production relations and contradiction of private ownership.', 'Because “interlocking” is always a revolutionary slogan.', 'Because bourgeois economists cannot observe any facts.', 'Because Lenin denies connections among monopolies.'], '레닌은 부르주아 경제학이 사실을 전혀 못 본다고 하지 않는다. 문제는 나무는 세지만 숲을 보지 못하듯, 연결의 계급적 의미와 역사적 방향을 파악하지 못한다는 점이다.', 'Lenin does not say bourgeois economics sees no facts. The problem is that, like counting trees without seeing the forest, it misses the class meaning and historical direction of interconnection.'),
                q(3, '제국주의를 “사멸해 가는 자본주의”로 부를 때 피해야 할 오해는 무엇인가?', 'What misconception should be avoided when calling imperialism “moribund capitalism”?', ['자본주의 모순이 역사적으로 성숙했다는 뜻으로 이해하는 것', '독점이 사적 소유의 껍질과 사회화된 생산의 충돌을 키운다는 뜻으로 이해하는 것', '빠른 발전과 부패가 함께 있을 수 있다고 이해하는 것', '아무 정치적 투쟁 없이 자본주의가 자동으로 내일 사라진다는 뜻으로 이해하는 것'], ['Understanding it as the historical maturation of capitalist contradictions', 'Understanding that monopoly intensifies the clash between private ownership and socialized production', 'Understanding that rapid development and decay can coexist', 'Understanding it to mean capitalism will automatically disappear tomorrow without political struggle'], '사멸해 간다는 말은 자동적 시간표가 아니다. 독점 단계가 자본주의의 모순을 성숙시키고 이행의 조건을 만들지만, 그 해결은 계급투쟁의 문제로 남는다.', '“Moribund” is not an automatic timetable. The monopoly stage matures capitalism’s contradictions and creates conditions for transition, but their resolution remains a matter of class struggle.'),
                q(1, '제국주의론 전체의 학습을 마칠 때, 레닌의 분석을 가장 잘 요약하는 관점은 무엇인가?', 'At the end of the whole study, which view best summarizes Lenin’s analysis?', ['제국주의는 일부 정치인의 침략적 성격 때문에 생기는 예외다.', '제국주의는 생산집중에서 금융자본, 자본수출, 세계분할, 기회주의로 이어지는 독점자본주의의 총체적 구조다.', '제국주의는 해외무역이 있는 모든 사회를 가리키는 중립적 용어다.', '제국주의는 자유경쟁을 회복하면 아무 흔적 없이 사라지는 일시적 실수다.'], ['Imperialism is an exception caused by the aggressive character of a few politicians.', 'Imperialism is the total structure of monopoly capitalism running from concentration of production to finance capital, export of capital, world division, and opportunism.', 'Imperialism is a neutral term for every society with foreign trade.', 'Imperialism is a temporary mistake that disappears without trace if free competition is restored.'], '레닌의 강점은 제국주의를 단일 사건이나 정책이 아니라 자본주의 발전의 총체적 단계로 분석한다는 데 있다. 각 장은 그 구조의 한 고리를 보여준다.', 'Lenin’s strength is analyzing imperialism not as a single event or policy but as a total stage of capitalist development. Each chapter shows one link in that structure.'),
            ]
        ),
    ],
};
