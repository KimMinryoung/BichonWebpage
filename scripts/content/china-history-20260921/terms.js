// Glossary entries for the Chinese revolution and the People's Republic.
// Headwords are specific (migration 155): a bare common noun is an alias at
// most. Definitions ≤ 400 ko / 900 en characters.
const W = 'https://en.wikipedia.org/wiki/';
const M = 'https://www.marxists.org/reference/archive/mao/selected-works/';
const L = 'Wikipedia article: lead and background sections';

module.exports = [
    {
        id: 'kmt-ccp-united-front', term: { ko: '국공합작', en: 'KMT–CCP united front' }, category: 'party-state',
        period: { ko: '1924–1927, 1937–1945', en: '1924–1927, 1937–1945' }, startYear: 1924, endYear: 1945,
        definition: {
            ko: '중국국민당과 중국공산당이 공동의 적에 맞서 맺은 두 차례의 제휴. 제1차(1924~1927)는 코민테른의 주선으로 공산당원이 개인 자격으로 국민당에 가입해 군벌 타도의 북벌을 함께 수행하다 1927년 장제스의 4·12 정변과 우한 정부의 분공으로 깨졌다. 제2차(1937~1945)는 시안 사변 뒤 항일을 위해 성립해 홍군이 국민혁명군 팔로군·신4군으로 개편되었으나, 1941년 완난 사변 이후 사실상 대립 관계로 돌아갔다.',
            en: 'The two alliances between the Kuomintang and the Chinese Communist Party against a common enemy. The first (1924–1927), brokered by the Comintern, had Communists join the KMT as individuals and fight the warlords together in the Northern Expedition until Chiang Kai-shek’s coup of 12 April 1927 and the Wuhan government’s expulsion of the Communists. The second (1937–1945) formed after the Xi’an Incident to resist Japan, with the Red Army reorganised as the Eighth Route and New Fourth Armies of the National Revolutionary Army, but it decayed into hostility after the New Fourth Army incident of 1941.',
        },
        body: {
            ko: '제1차 합작은 1923년 쑨원-요페 공동선언과 1924년 국민당 제1차 전국대표대회에서 형식을 갖추었다. 코민테른은 중국의 부르주아 민족혁명을 지원한다는 판단 아래 공산당에 「당내 합작」을 지시했고, 소련 고문 보로딘이 국민당을 재편했으며 황푸군관학교가 세워졌다. 공산당은 이 시기에 노동자·농민 운동을 크게 확장했다.\n\n1926년 북벌이 진행되며 국민당 내부의 좌우 대립과 농민운동을 둘러싼 갈등이 커졌고, 스탈린은 합작 유지를 고집한 반면 트로츠키는 공산당의 독자 노선을 주장했다. 1927년 4월 상하이의 반공 정변과 7월 우한 정부의 분공으로 합작은 무너졌고, 공산당은 무장 봉기와 농촌 근거지로 방향을 바꿨다.\n\n제2차 합작은 「항일 민족통일전선」의 이름으로 성립했다. 공산당은 소비에트 정부와 토지 몰수를 중단하는 대신 산간닝 변구와 군대의 독자성을 유지했고, 통일전선 아래 근거지를 크게 넓혔다. 1941년 신4군 사건 이후 두 당은 서로를 견제하며 항일전쟁을 치렀고, 1945년 일본 항복 뒤 마셜의 중재도 내전을 막지 못했다.',
            en: 'The first united front took shape in the Sun–Joffe statement of 1923 and the KMT’s First National Congress in 1924. Judging that China faced a bourgeois national revolution, the Comintern ordered the Communists into a “bloc within”; the Soviet adviser Borodin reorganised the KMT and the Whampoa Military Academy was founded. The Communists expanded the labour and peasant movements dramatically in these years.\n\nAs the Northern Expedition advanced in 1926, the KMT’s left–right split and conflict over the peasant movement deepened; Stalin insisted on keeping the alliance while Trotsky argued for an independent Communist line. The anti-Communist coup in Shanghai in April 1927 and the Wuhan government’s break in July destroyed the front, and the Communists turned to armed uprisings and rural bases.\n\nThe second front was formed as the “anti-Japanese national united front”. The Communists gave up their soviet government and land confiscation but kept the Shaan-Gan-Ning border region and their own army, and under the front they greatly enlarged their base areas. After the New Fourth Army incident of 1941 the two parties fought the war while watching each other, and after Japan’s surrender in 1945 Marshall’s mediation could not prevent civil war.',
        },
        aliases: { ko: ['제1차 국공합작', '제2차 국공합작', '항일 민족통일전선'], en: ['First United Front', 'Second United Front'] },
        people: ['sun-yat-sen', 'chiang-kai-shek', 'mikhail-borodin', 'zhang-xueliang', 'zhou-enlai'],
        events: ['first-united-front-1924-1927', 'sino-japanese-war-1937-1945'],
        sources: [W + 'First_United_Front', W + 'Second_United_Front'], locator: L,
    },
    {
        id: 'yanan-rectification', term: { ko: '옌안 정풍운동', en: 'Yan’an Rectification Movement' }, category: 'factions',
        period: { ko: '1942–1945', en: '1942–1945' }, startYear: 1942, endYear: 1945,
        definition: {
            ko: '1942년 2월 마오쩌둥의 「당의 작풍을 정돈하자」 연설로 시작된 중국공산당의 사상·조직 정비 운동. 「주관주의·종파주의·당팔고」를 비판 대상으로 삼아 왕밍 등 모스크바 유학파의 교조주의를 밀어내고 마오의 지도권과 「마오쩌둥 사상」을 확립했다. 학습·자아비판·심사가 결합되었고, 1943년 캉성이 주도한 「구조 운동」에서는 수천 명이 특무로 몰렸다. 이후 정치운동의 원형이 되었다.',
            en: 'The Chinese Communist Party’s ideological and organisational campaign launched by Mao Zedong’s February 1942 speech “Rectify the Party’s Style of Work”. Targeting “subjectivism, sectarianism and party formalism”, it displaced the dogmatism of Wang Ming’s Moscow-trained group and established Mao’s leadership and “Mao Zedong Thought”. Study, self-criticism and cadre screening were combined, and in Kang Sheng’s 1943 “rescue campaign” thousands were branded enemy agents. It became the template for later political campaigns.',
        },
        body: {
            ko: '정풍은 세 단계로 진행되었다. 1942년의 문헌 학습과 토론에서 간부들은 지정된 마오의 글과 당 문건을 읽고 자기 사상을 검토했다. 왕스웨이의 「야생 백합」과 딩링의 「3·8절 유감」처럼 옌안의 현실을 비판한 문인들은 곧 비판의 표적이 되었고, 마오의 「옌안 문예좌담회 연설」은 문예가 정치에 복무해야 한다는 원칙을 세웠다.\n\n1943년의 「간부 심사」와 「구조 운동」에서 캉성의 사회부는 국민당 지역에서 온 지식인과 청년을 대거 특무로 지목했고, 집단 압박과 자백 강요가 널리 쓰였다. 마오는 1944년 과잉을 인정하고 「사람을 죽이지 않는다」는 원칙으로 억제했으나 책임은 묻지 않았다.\n\n1945년 「약간의 역사 문제에 관한 결의」는 당사(黨史)를 마오의 노선이 옳았던 과정으로 다시 썼고 제7차 당대회는 마오쩌둥 사상을 당 규약에 넣었다. 가오화의 연구는 정풍이 사상 통일과 함께 마오 개인의 권위를 제도화했음을 보여주며, 반우파 투쟁과 문화대혁명의 방법이 여기서 나왔다는 해석이 널리 받아들여진다.',
            en: 'Rectification ran in three phases. In the document study and discussion of 1942, cadres read assigned writings of Mao and party documents and examined their own thinking. Writers who criticised conditions at Yan’an, such as Wang Shiwei in “Wild Lilies” and Ding Ling in “Thoughts on March 8”, quickly became targets, and Mao’s “Talks at the Yan’an Forum on Literature and Art” laid down that art must serve politics.\n\nIn the cadre screening and “rescue campaign” of 1943, Kang Sheng’s Social Affairs Department labelled large numbers of intellectuals and youths from the Nationalist areas as enemy agents, with group pressure and forced confessions widely used. Mao acknowledged the excesses in 1944 and restrained them under the rule of “no killing”, but no one was held responsible.\n\nThe 1945 “Resolution on Certain Questions in the History of Our Party” rewrote party history as the vindication of Mao’s line, and the Seventh Congress wrote Mao Zedong Thought into the party constitution. Gao Hua’s research shows that rectification institutionalised Mao’s personal authority along with ideological unity, and the view that the methods of the anti-rightist campaign and the Cultural Revolution originated here is widely accepted.',
        },
        aliases: { ko: ['정풍운동', '연안 정풍운동', '구조 운동'], en: ['Rectification Movement', 'Zhengfeng'] },
        people: ['mao-zedong', 'kang-sheng', 'wang-shiwei', 'ding-ling', 'wang-ming', 'gao-hua'],
        events: ['sino-japanese-war-1937-1945'],
        sources: [W + 'Yan%27an_Rectification_Movement', M + 'volume-3/mswv3_06.htm'], locator: L,
    },
    {
        id: 'three-anti-five-anti-campaigns', term: { ko: '삼반·오반 운동', en: 'Three-anti and Five-anti Campaigns' }, category: 'repression',
        period: { ko: '1951–1952', en: '1951–1952' }, startYear: 1951, endYear: 1952,
        definition: {
            ko: '건국 초기 중국공산당이 벌인 두 대중운동. 삼반(1951년 말~)은 당·정 간부의 부패·낭비·관료주의를, 오반(1952년)은 민간 자본가의 뇌물·탈세·국가재산 절취·부실공사·국가경제정보 절취를 겨냥했다. 고발과 「호랑이 사냥」 집회로 수십만 명이 조사받았고 상하이 등에서 자살이 잇따랐다. 오반은 민족자본가를 국가에 종속시켜 1953년 이후 사회주의 개조의 길을 닦았다.',
            en: 'Two mass campaigns of the early People’s Republic. The Three-anti (from late 1951) targeted corruption, waste and bureaucratism among party and state cadres; the Five-anti (1952) targeted bribery, tax evasion, theft of state property, cheating on government contracts and stealing state economic information by private businessmen. Denunciations and “tiger-hunting” meetings put hundreds of thousands under investigation and produced waves of suicides in Shanghai and elsewhere. The Five-anti subordinated the national bourgeoisie to the state and prepared the socialist transformation after 1953.',
        },
        body: {
            ko: '삼반 운동은 한국전쟁의 재정 압박 속에서 시작되었다. 동북의 가오강이 먼저 벌인 반부패 운동을 마오가 전국으로 확대했고, 톈진의 지구당 서기 류칭산·장쯔산의 처형은 당이 자기 간부에게도 사형을 적용한다는 신호였다. 운동은 할당된 「호랑이」 수를 채우려는 압박으로 과잉 고발을 낳았다.\n\n오반 운동은 삼반에서 드러난 간부 부패의 「배후」로 자본가를 지목하면서 시작되었다. 노동자와 점원이 고용주를 고발하도록 조직되었고 벌금과 추징으로 기업 자산이 국가로 이전되었다. 신민주주의가 약속한 민족자본의 보호는 이 운동으로 사실상 끝났고, 1953년 이행 총노선과 1956년 공사합영으로 이어졌다.\n\n두 운동은 반혁명 진압운동(1950~1951)과 함께 건국 초기의 억압 체계를 이루었다. 딩링의 소설과 당대 보고서는 대중 고발 집회의 분위기를 전하며, 디쾨터 등은 이 시기를 「해방의 비극」으로 다시 읽고 있다.',
            en: 'The Three-anti began under the fiscal strain of the Korean War. Mao extended nationwide an anti-corruption drive that Gao Gang had first run in the Northeast, and the execution of the Tianjin prefectural secretaries Liu Qingshan and Zhang Zishan signalled that the party would apply the death penalty to its own cadres. Quotas of “tigers” to be caught produced over-denunciation.\n\nThe Five-anti began by identifying capitalists as the “backers” of the cadre corruption exposed in the Three-anti. Workers and shop assistants were organised to denounce their employers, and fines and back-taxes transferred business assets to the state. The protection of national capital promised by New Democracy effectively ended with the campaign, leading to the 1953 general line for the transition and the joint state-private enterprises of 1956.\n\nTogether with the Campaign to Suppress Counter-revolutionaries (1950–1951) the two movements formed the repressive framework of the early People’s Republic. Contemporary reports convey the atmosphere of the mass accusation meetings, and historians such as Dikötter now reread the period as “the tragedy of liberation”.',
        },
        aliases: { ko: ['삼반운동', '오반운동', '삼반오반'], en: ['Three-anti Campaign', 'Five-anti Campaign'] },
        people: ['mao-zedong', 'gao-gang', 'bo-yibo', 'frank-dikotter'],
        events: ['prc-consolidation-1949-1956'],
        sources: [W + 'Three-anti_and_Five-anti_Campaigns', W + 'Campaign_to_Suppress_Counterrevolutionaries'], locator: L,
    },
    {
        id: 'resist-america-aid-korea', term: { ko: '항미원조', en: 'Resist America, Aid Korea' }, category: 'international',
        period: { ko: '1950–1953', en: '1950–1953' }, startYear: 1950, endYear: 1953,
        definition: {
            ko: '중국이 한국전쟁 참전을 부른 공식 명칭이자 국내 동원 운동. 1950년 10월 펑더화이가 지휘하는 「중국인민지원군」이 압록강을 건너 유엔군을 38선 남쪽으로 밀어냈고 1953년 정전까지 싸웠다. 국내에서는 「항미원조 보가위국」 운동으로 무기 헌납·증산·반미 선전이 조직되었고 반혁명 진압과 사상 개조가 가속되었다. 중국은 소련과의 동맹을 굳히고 대국의 지위를 주장하게 되었으나 대만 문제는 고착되었다.',
            en: 'China’s official name for its intervention in the Korean War and the domestic mobilisation campaign around it. In October 1950 the “Chinese People’s Volunteers” under Peng Dehuai crossed the Yalu, drove the UN forces south of the 38th parallel and fought until the 1953 armistice. At home the “Resist America, Aid Korea, protect the home and defend the country” campaign organised weapons donations, production drives and anti-American propaganda, and accelerated the suppression of counter-revolutionaries and thought reform. China cemented its alliance with the Soviet Union and claimed great-power standing, while the Taiwan question hardened.',
        },
        body: {
            ko: '참전 결정은 1950년 10월 초 정치국에서 격론 끝에 내려졌다. 인천 상륙 뒤 유엔군의 북진이 만주를 위협한다는 판단, 스탈린의 공군 지원 약속과 그 철회, 김일성의 지원 요청이 얽혔고, 마오는 참전이 신생 정권을 굳히고 소련의 신뢰를 얻는 길이라고 보았다. 「지원군」이라는 명칭은 미국과의 전면전을 피하려는 장치였다.\n\n국내 동원은 「항미원조 총회」가 주관했다. 도시와 농촌에서 애국 공약, 증산 절약, 전투기 헌납 운동이 벌어졌고 미국을 「종이호랑이」로 그리는 선전이 대중적 반미 의식을 형성했다. 같은 시기 반혁명 진압운동과 지식인 사상개조가 전쟁의 이름으로 정당화되었다.\n\n전쟁은 중국에 수십만 명의 인명 손실과 무거운 재정 부담을 남겼으나 신생 정권은 세계 최강국과 맞섰다는 자신감을 얻었다. 소련의 원조와 군 현대화가 뒤따랐고, 마오의 아들 마오안잉의 전사는 뒤에 마오의 개인사로 널리 회자되었다. 정전은 1953년 7월 판문점에서 체결되었다.',
            en: 'The decision to intervene was taken in early October 1950 after fierce debate in the Politburo. The judgement that the UN advance after Inchon threatened Manchuria, Stalin’s promise and then withdrawal of air cover, and Kim Il Sung’s appeal for help were all entangled; Mao saw intervention as the way to consolidate the new regime and win Moscow’s trust. The label “Volunteers” was a device to avoid open war with the United States.\n\nDomestic mobilisation was run by the Resist America Aid Korea association. Patriotic pledges, production and thrift drives and a campaign to donate fighter aircraft spread through town and country, and propaganda painting America as a “paper tiger” shaped mass anti-American sentiment. The suppression of counter-revolutionaries and the thought reform of intellectuals were justified in the name of the war.\n\nThe war cost China hundreds of thousands of casualties and a heavy fiscal burden, but the new regime gained confidence from having stood against the strongest power in the world. Soviet aid and military modernisation followed, and the death in action of Mao’s son Mao Anying later became a widely told part of Mao’s personal story. The armistice was signed at Panmunjom in July 1953.',
        },
        aliases: { ko: ['항미원조 전쟁', '항미원조 보가위국'], en: ['War to Resist US Aggression and Aid Korea'] },
        people: ['peng-dehuai', 'mao-zedong', 'deng-hua', 'kim-il-sung', 'stalin'],
        events: ['korean-war', 'prc-consolidation-1949-1956'],
        sources: [W + 'People%27s_Volunteer_Army', W + 'Korean_War'], locator: L,
    },
    {
        id: 'hundred-flowers-campaign', term: { ko: '백화제방·백가쟁명', en: 'Hundred Flowers Campaign' }, category: 'culture',
        period: { ko: '1956–1957', en: '1956–1957' }, startYear: 1956, endYear: 1957,
        definition: {
            ko: '「백 가지 꽃이 함께 피고 백 가지 학파가 다투게 하라」는 구호 아래 1956년 마오쩌둥이 지식인에게 당에 대한 비판을 권한 운동. 흐루쇼프의 비밀연설과 헝가리 혁명 뒤 당 관료주의를 견제하려는 의도였고, 1957년 5~6월 「대명대방」 국면에서 지식인·민주당파·학생이 일당 독점과 소련 모방을 비판하는 발언을 쏟아냈다. 6월 8일 마오가 방향을 바꾸면서 반우파 투쟁이 시작되었다.',
            en: 'The campaign in which Mao Zedong, under the slogan “Let a hundred flowers bloom, let a hundred schools of thought contend”, invited intellectuals in 1956 to criticise the party. Intended after Khrushchev’s secret speech and the Hungarian revolution to check party bureaucratism, it produced in May–June 1957 an outpouring of criticism of one-party monopoly and Soviet imitation from intellectuals, the minor democratic parties and students. On 8 June Mao reversed course and the Anti-Rightist Campaign began.',
        },
        body: {
            ko: '구호는 1956년 5월 처음 제기되었고 1957년 2월 마오의 「인민 내부 모순의 올바른 처리」 연설에서 이론화되었다. 마오는 사회주의 사회에도 적대적 모순과 비적대적 모순이 있으며 후자는 토론과 설득으로 풀어야 한다고 말했다. 당 지도부 다수는 지식인에게 문을 여는 데 소극적이었고 실제 「방명」은 1957년 5월 초 시작되었다.\n\n몇 주 동안 신문과 좌담회에서 비판이 이어졌다. 민주당파의 장보쥔·뤄룽지는 「정치 설계원」과 당·정 분리를 제안했고, 학생들은 베이징대학의 「민주의 벽」에 대자보를 붙였으며 일부는 소련의 헝가리 개입을 비판했다. 비판의 범위가 당의 지도 원칙 자체에 이르자 마오는 6월 8일 「이것은 무엇 때문인가」 사설로 「우파의 진공」을 선언했다.\n\n운동이 처음부터 반대자를 끌어내는 「양모(陽謀)」였는지, 예상보다 커진 비판에 놀란 뒤바꿈이었는지는 여전히 논쟁이다. 마오 자신은 뒤에 「뱀을 굴에서 끌어냈다」고 말했다. 어느 쪽이든 결과는 같았다. 발언한 사람들은 이후 20년 동안 우파의 낙인을 안고 살았다.',
            en: 'The slogan was first raised in May 1956 and theorised in Mao’s February 1957 speech “On the Correct Handling of Contradictions Among the People”. Mao said that socialist society too had antagonistic and non-antagonistic contradictions, and that the latter must be resolved by discussion and persuasion. Most of the leadership was reluctant to open the door to intellectuals, and the real “blooming” began only in early May 1957.\n\nFor several weeks criticism poured out in newspapers and forums. Zhang Bojun and Luo Longji of the democratic parties proposed a “political design institute” and the separation of party and state; students pasted big-character posters on a “democracy wall” at Peking University, and some criticised the Soviet intervention in Hungary. When the criticism reached the party’s leading role itself, Mao declared on 8 June, in the editorial “What is this for?”, that the rightists were attacking.\n\nWhether the campaign was from the start an “open plot” to draw out opponents, or a reversal after criticism grew beyond expectation, remains disputed; Mao himself later said he had “lured the snakes out of their holes”. Either way the result was the same: those who spoke carried the rightist label for the next twenty years.',
        },
        aliases: { ko: ['백화제방', '백가쟁명', '쌍백 방침'], en: ['Hundred Flowers Movement', 'Double Hundred policy'] },
        people: ['mao-zedong', 'zhou-enlai', 'deng-xiaoping'],
        events: ['hundred-flowers-anti-rightist'],
        sources: [W + 'Hundred_Flowers_Campaign', M + 'volume-5/mswv5_58.htm'], locator: L,
    },
    {
        id: 'anti-rightist-campaign', term: { ko: '반우파 투쟁', en: 'Anti-Rightist Campaign' }, category: 'repression',
        period: { ko: '1957–1959', en: '1957–1959' }, startYear: 1957, endYear: 1959,
        definition: {
            ko: '백화제방 운동에서 당을 비판한 지식인·간부·학생을 「우파분자」로 규정해 처벌한 1957~1959년의 정치운동. 덩샤오핑이 실무를 총괄했고 각 단위에 할당 비율이 내려와 공식 집계로 약 55만 명이 우파로 낙인찍혀 강등·해고·노동교양·농촌 하방을 당했다. 지식인의 비판 통로가 막히면서 대약진의 과오를 견제할 힘이 사라졌고, 1978~1980년 대부분이 「착오 판정」으로 복권되었다.',
            en: 'The political campaign of 1957–1959 that punished intellectuals, cadres and students who had criticised the party during the Hundred Flowers as “rightists”. Run in practice by Deng Xiaoping, with quotas handed down to each unit, it labelled about 550,000 people by the official count and subjected them to demotion, dismissal, re-education through labour and rural exile. With the channels for criticism closed, nothing remained to check the errors of the Great Leap; most labels were reversed as mistaken in 1978–1980.',
        },
        body: {
            ko: '운동은 1957년 6월 8일 『인민일보』 사설과 마오의 당내 지시로 시작되었다. 표적은 먼저 민주당파와 언론계·학계의 유명 인사였고, 이어 각 기관과 대학에서 5% 안팎의 할당을 채우는 방식으로 확대되었다. 딩링·아이칭 같은 작가, 마인추 같은 학자, 수많은 대학생과 중등교사가 포함되었으며 실제 낙인 수는 공식 집계보다 훨씬 많다는 추정이 있다.\n\n처벌은 노동교양 제도의 확립과 맞물렸다. 1957년 8월 도입된 노동교양은 재판 없이 행정 결정으로 수용을 허용했고, 간쑤의 자볜거우 농장처럼 우파 수용소에서 대기근 시기에 대량 아사가 일어났다. 1959년 루산 회의 뒤 펑더화이 비판과 함께 「반우경」 운동이 당 내부로 확대되었다.\n\n1978년 이후 당은 반우파 투쟁이 「필요했으나 심각하게 확대되었다」고 규정하며 약 55만 명 가운데 극소수를 제외한 전원의 낙인을 취소했다. 운동 자체의 정당성은 공식적으로 유지되었고, 이 시기의 침묵이 대약진 재난의 정치적 조건이었다는 평가가 일반적이다.',
            en: 'The campaign opened with the People’s Daily editorial of 8 June 1957 and Mao’s internal directive. The first targets were prominent figures in the democratic parties, the press and academia; it then spread through every institution and university, where quotas of around five per cent were filled. Writers such as Ding Ling and Ai Qing, scholars such as Ma Yinchu, and countless students and schoolteachers were included, and the real number labelled is thought to exceed the official count considerably.\n\nPunishment was tied to the establishment of re-education through labour. Introduced in August 1957, it allowed confinement by administrative decision without trial, and in rightist camps such as Jiabiangou farm in Gansu mass starvation followed during the Great Famine. After the Lushan Conference of 1959 the criticism of Peng Dehuai extended an “anti-right-deviation” drive into the party itself.\n\nAfter 1978 the party ruled that the campaign had been “necessary but seriously enlarged” and cancelled the labels of all but a handful of the roughly 550,000. The legitimacy of the campaign itself was officially maintained, and the silence of these years is generally judged to have been the political condition for the disaster of the Great Leap.',
        },
        aliases: { ko: ['반우파 운동', '우파분자'], en: ['Anti-Rightist Movement', 'rightist label'] },
        people: ['mao-zedong', 'deng-xiaoping', 'ding-ling', 'fang-lizhi'],
        events: ['hundred-flowers-anti-rightist'],
        sources: [W + 'Anti-Rightist_Campaign', W + 'Hundred_Flowers_Campaign'], locator: L,
    },
    {
        id: 'peoples-commune', term: { ko: '인민공사', en: 'People’s commune' }, category: 'economy',
        period: { ko: '1958–1983', en: '1958–1983' }, startYear: 1958, endYear: 1983,
        definition: {
            ko: '대약진 시기인 1958년 여름 농업생산합작사를 통합해 만든 농촌의 대규모 집단 조직으로, 평균 5천 가구 규모에서 생산·행정·민병·교육을 한 단위로 묶었다. 공동식당과 「공급제」 분배, 사유 텃밭의 폐지, 대규모 수리·철강 노동 동원이 특징이었고 국가 징발의 단위가 되어 대기근을 키웠다. 1962년 이후 생산대를 기본 회계 단위로 낮추어 유지되다 1983년 농가생산책임제로 해체되었다.',
            en: 'The large rural collective created in summer 1958 during the Great Leap by merging agricultural cooperatives, averaging about five thousand households and combining production, administration, militia and schooling in one unit. Communal dining halls and “free supply” distribution, the abolition of private plots and the mass mobilisation of labour for irrigation and steel were its marks, and as the unit of state procurement it magnified the Great Famine. After 1962 it survived with the production team as the basic accounting unit until the household responsibility system dissolved it in 1983.',
        },
        body: {
            ko: '인민공사는 허난 등에서 자생적으로 시작된 합작사 통합을 마오가 1958년 8월 「인민공사는 좋다」고 칭찬하고 베이다이허 회의가 결의하면서 몇 달 만에 전국 농촌의 99%로 퍼졌다. 공산주의로의 지름길이라는 선전 아래 공동식당에서 마음껏 먹게 하고, 노동은 군대식으로 편성되었으며, 농민의 가축·농기구·주택까지 공유화되기도 했다.\n\n1958~1959년의 수확 과장 보고는 국가 징발량을 높였고, 공사가 곡물을 통제하는 구조는 농민이 스스로 식량을 지킬 수단을 없앴다. 공동식당의 낭비와 이후 식량 고갈, 수리·철강 동원으로 인한 수확 방치가 겹쳐 1959~1961년 대기근이 일어났다. 1960년 말부터 「12조」와 1962년 「60조」로 사유 텃밭과 생산대 회계가 복원되었다.\n\n축소된 인민공사는 이후 20년 동안 농촌의 기본 단위로 남아 다자이 모델의 무대가 되었다. 1978년 이후 안후이·쓰촨의 농가 청부 실험이 확산되면서 1983년 중앙 문건으로 정사분리(政社分離)가 결정되어 향 정부가 행정을 맡고 공사는 사라졌다.',
            en: 'The communes began as spontaneous mergers of cooperatives in Henan and elsewhere; after Mao praised them in August 1958 — “people’s communes are good” — and the Beidaihe conference endorsed them, they covered 99 per cent of the countryside within months. Advertised as a shortcut to communism, they let peasants eat freely in communal dining halls, organised labour on military lines and in places collectivised livestock, tools and even houses.\n\nInflated harvest reports in 1958–1959 raised state procurement, and the commune’s control of grain removed the peasants’ means of protecting their own food. The waste of the dining halls followed by exhaustion of stocks, and harvests left in the fields while labour was diverted to irrigation and steel, combined to produce the famine of 1959–1961. From late 1960 the “twelve articles” and the “sixty articles” of 1962 restored private plots and team-level accounting.\n\nThe reduced commune remained the basic rural unit for the next twenty years and was the stage for the Dazhai model. As household contracting spread from Anhui and Sichuan after 1978, a central document of 1983 separated government from commune, giving administration to township governments and ending the commune.',
        },
        aliases: { ko: ['농촌인민공사', '공동식당'], en: ['rural people’s commune', 'commune system'] },
        people: ['mao-zedong', 'chen-yonggui', 'wan-li', 'liu-shaoqi'],
        events: ['great-leap-forward', 'reform-and-opening'],
        sources: [W + 'People%27s_commune', W + 'Great_Leap_Forward'], locator: L,
    },
    {
        id: 'lushan-conference-1959', term: { ko: '루산 회의 (1959)', en: 'Lushan Conference of 1959' }, category: 'factions',
        period: { ko: '1959년 7~8월', en: 'July–August 1959' }, startYear: 1959, endYear: 1959,
        definition: {
            ko: '1959년 7~8월 장시성 루산에서 열린 정치국 확대회의와 8기 8중전회. 대약진의 과오를 조정하려는 분위기에서 펑더화이가 마오에게 보낸 사신(私信)이 「소자산계급의 광열성」을 지적하자 마오는 이를 공개해 「우경 기회주의」로 규정했고, 펑더화이·황커청·장원톈·저우샤오저우가 「반당집단」으로 실각했다. 회의 뒤 전국의 「반우경」 운동이 조정 정책을 뒤집어 대기근을 악화시켰다.',
            en: 'The enlarged Politburo meeting and Eighth Plenum held at Lushan, Jiangxi, in July–August 1959. In an atmosphere inclined to correct the Great Leap, Peng Dehuai’s private letter to Mao criticising “petty-bourgeois fanaticism” was made public by Mao and condemned as “right opportunism”; Peng, Huang Kecheng, Zhang Wentian and Zhou Xiaozhou were purged as an “anti-party clique”. The nationwide “anti-right-deviation” campaign that followed reversed the retreat and worsened the famine.',
        },
        body: {
            ko: '회의는 「신선회」로 불릴 만큼 느슨하게 시작되었다. 마오 자신이 1958년의 과열을 인정하며 지표 조정을 논의했고, 펑더화이는 고향 후난에서 본 기근과 소형 용광로의 낭비를 7월 14일 편지에 적어 마오에게 보냈다. 편지는 대약진의 성과를 인정하면서도 「성적은 크고 문제도 적지 않다」며 정치가 경제를 대신한 데서 원인을 찾았다.\n\n마오는 7월 23일 연설에서 편지를 우경 공격으로 규정하고, 자신이 물러나면 「농촌에 가서 농민을 이끌고 정부를 뒤엎겠다」며 군의 충성을 시험했다. 지도부 대부분은 마오 편에 섰고 8중전회는 펑더화이 등을 비판하는 결의를 채택했다. 린뱌오가 국방부장으로 펑을 대신했다.\n\n회의의 결과는 두 가지였다. 당내에서 대약진을 비판하는 것이 불가능해져 1960년까지 급진 정책이 계속되었고, 마오와 원로 간의 신뢰가 무너져 이후 문화대혁명의 씨앗이 되었다. 1965년 우한의 『해서파관』 비판이 펑더화이 사건의 은유로 읽힌 것은 이 때문이다.',
            en: 'The conference began loosely enough to be called a “meeting of immortals”. Mao himself acknowledged the overheating of 1958 and discussed lowering targets, and Peng Dehuai wrote to him on 14 July about the hunger he had seen in his native Hunan and the waste of the backyard furnaces. The letter recognised the achievements of the Leap but said that “the gains are great and the problems not few”, and blamed politics taking the place of economics.\n\nIn his speech of 23 July Mao branded the letter a rightist attack and tested the army’s loyalty by saying that if he were forced out he would “go to the countryside, lead the peasants and overthrow the government”. Most of the leadership sided with Mao, and the Eighth Plenum adopted a resolution condemning Peng and the others. Lin Biao replaced Peng as minister of defence.\n\nThe conference had two consequences. Criticism of the Great Leap inside the party became impossible and radical policy continued into 1960, and the trust between Mao and the veterans broke down, sowing the seeds of the Cultural Revolution. This is why the 1965 attack on Wu Han’s Hai Rui Dismissed from Office was read as an allegory of the Peng Dehuai affair.',
        },
        aliases: { ko: ['루산 회의', '여산 회의', '펑더화이 사건'], en: ['Lushan Plenum', 'Peng Dehuai affair'] },
        people: ['peng-dehuai', 'mao-zedong', 'zhang-wentian', 'lin-biao', 'liu-shaoqi'],
        events: ['great-leap-forward'],
        sources: [W + 'Lushan_Conference', W + 'Great_Leap_Forward'], locator: L,
    },
    {
        id: 'socialist-education-movement', term: { ko: '사회주의 교육운동', en: 'Socialist Education Movement' }, category: 'party-state',
        period: { ko: '1963–1966', en: '1963–1966' }, startYear: 1963, endYear: 1966,
        definition: {
            ko: '대약진 조정기 이후 농촌 간부의 부패와 「자본주의 부활」을 막는다는 명분으로 1963년 시작된 운동으로, 장부·창고·재산·노동점수를 조사하는 「사청(四淸)」 운동으로도 불린다. 류사오치는 공작대를 파견해 기층 간부를 대규모로 처벌하는 방식을 택했고, 마오는 1965년 「23조」에서 표적을 「당내 자본주의의 길을 걷는 당권파」로 옮겼다. 이 대립이 문화대혁명에서 류사오치 타도로 이어졌다.',
            en: 'The campaign launched in 1963, after the post-Leap retreat, to stop corruption among rural cadres and the “restoration of capitalism”; also called the Four Cleanups, for its audits of accounts, granaries, property and work points. Liu Shaoqi sent work teams that punished grassroots cadres on a large scale, while Mao’s “twenty-three articles” of 1965 shifted the target to “those in authority within the party taking the capitalist road”. That clash led to Liu’s overthrow in the Cultural Revolution.',
        },
        body: {
            ko: '운동의 출발점은 1962년 9월 8기 10중전회에서 마오가 「계급투쟁을 잊지 말자」고 한 데 있다. 대기근 뒤 농촌에서 청부 생산과 시장이 되살아나고 간부들이 이를 묵인하자 마오는 이를 계급투쟁의 부활로 보았다. 1963년 5월 「전10조」는 빈농·하중농에 의지해 간부를 정리하라고 지시했다.\n\n류사오치와 아내 왕광메이가 허베이 타오위안에서 실험한 방식은 공작대가 마을에 상주하며 간부를 격리 심사하는 것이었고, 1964년 「후10조 수정안」으로 전국화되었다. 수백만 명의 기층 간부가 조사받았고 자살이 잇따랐다. 마오는 1964년 말 이 방식이 「대중을 믿지 않는다」며 비판했고 1965년 1월 「23조」는 운동의 성격을 사회주의와 자본주의의 모순으로 재규정했다.\n\n「23조」에 등장한 「당권파」라는 표현은 이후 문화대혁명의 핵심 구호가 되었다. 사회주의 교육운동은 농촌에서 문화대혁명에 흡수되었고, 류사오치가 운동 방식을 놓고 마오와 정면으로 충돌한 일은 그가 「중국의 흐루쇼프」로 지목되는 배경이 되었다.',
            en: 'The movement began with Mao’s call at the Tenth Plenum in September 1962 to “never forget class struggle”. As household contracting and markets revived in the countryside after the famine and cadres tolerated them, Mao saw a resurgence of class struggle; the “first ten points” of May 1963 ordered the cleansing of cadres by relying on poor and lower-middle peasants.\n\nThe method Liu Shaoqi and his wife Wang Guangmei tested at Taoyuan in Hebei — work teams stationed in the village isolating and interrogating cadres — was generalised nationwide in the revised “later ten points” of 1964. Millions of grassroots cadres were investigated and suicides followed. At the end of 1964 Mao attacked the method for “not trusting the masses”, and the “twenty-three articles” of January 1965 redefined the movement as the contradiction between socialism and capitalism.\n\nThe phrase “those in authority taking the capitalist road” that appeared in the twenty-three articles became the central slogan of the Cultural Revolution. The Socialist Education Movement was absorbed into it in the countryside, and Liu Shaoqi’s head-on clash with Mao over its methods became the background to his denunciation as “China’s Khrushchev”.',
        },
        aliases: { ko: ['사청운동', '사청'], en: ['Four Cleanups Movement', 'Siqing'] },
        people: ['mao-zedong', 'liu-shaoqi', 'peng-zhen'],
        events: ['cultural-revolution'],
        sources: [W + 'Socialist_Education_Movement', W + 'Cultural_Revolution'], locator: L,
    },
    {
        id: 'red-guards-china', term: { ko: '홍위병', en: 'Red Guards (China)' }, category: 'party-state',
        period: { ko: '1966–1968', en: '1966–1968' }, startYear: 1966, endYear: 1968,
        definition: {
            ko: '문화대혁명 초기 중·고등학생과 대학생이 조직한 대중운동 조직. 1966년 5월 칭화대학 부속중학에서 시작되었고 8월 마오가 톈안먼에서 홍위병을 접견하고 「사령부를 포격하라」고 부추기면서 전국으로 번졌다. 「4구(舊) 타파」의 이름으로 교사·지식인·「출신 나쁜」 이들을 폭행하고 문화재를 파괴했으며 곧 파벌로 갈려 무장 충돌했다. 1968년 여름 마오가 노동자 선전대를 투입해 해산시켰고 수백만이 상산하향으로 농촌에 보내졌다.',
            en: 'The mass organisations of secondary-school and university students in the first phase of the Cultural Revolution. Begun at the middle school attached to Tsinghua University in May 1966, they spread nationwide after Mao received the Red Guards at Tiananmen in August and urged them to “bombard the headquarters”. In the name of “destroying the Four Olds” they beat teachers, intellectuals and people of “bad class origin” and destroyed cultural relics, then split into factions that fought armed battles. In summer 1968 Mao sent in worker propaganda teams to disband them, and millions were sent to the countryside.',
        },
        body: {
            ko: '홍위병의 첫 세대는 간부·군인 자녀 중심의 「노홍위병」으로 「혈통론」을 내세워 출신 성분이 나쁜 학생을 배제했다. 1966년 8~9월 베이징에서만 수천 명이 맞아 죽은 「붉은 8월」이 이 시기에 일어났고, 전국의 홍위병이 무료 열차로 베이징에 모여 여덟 차례 톈안먼 접견에 참석했다.\n\n1966년 말부터 「반란파」 홍위병이 등장해 노홍위병과 당 조직을 공격했고, 1967년에는 학교와 도시마다 두세 개 파벌이 상대를 「보수파」로 몰며 싸웠다. 각지에서 총기가 유출되어 충칭·우한 등에서 대규모 무장 충돌이 벌어졌고, 광시에서는 학살과 식인 사건까지 보고되었다.\n\n1968년 7월 마오는 칭화대학의 파벌 지도자들을 불러 「너희는 나를 실망시켰다」고 말했고, 노동자·군 선전대가 학교를 접수했다. 이어 「지식청년은 농촌으로 가라」는 지시로 약 1,700만 명이 상산하향했다. 홍위병 세대의 경험은 뒤에 「상흔문학」과 민주의 벽 운동으로 표출되었다.',
            en: 'The first generation were the “old Red Guards”, mostly children of cadres and soldiers, who used the “bloodline theory” to exclude students of bad class origin. The “Red August” of 1966, in which thousands were beaten to death in Beijing alone, belongs to this phase, and Red Guards from across the country travelled free by rail to attend eight receptions at Tiananmen.\n\nFrom late 1966 “rebel” Red Guards emerged and attacked both the old Red Guards and party organisations; in 1967 every school and city had two or three factions branding each other “conservatives”. Weapons leaked out everywhere and large armed clashes took place in Chongqing, Wuhan and elsewhere, while massacres and even cannibalism were reported in Guangxi.\n\nIn July 1968 Mao summoned the faction leaders of Tsinghua and told them “you have let me down”; worker and army propaganda teams took over the schools. The order that “educated youth go to the countryside” then sent some seventeen million down to the villages. The Red Guard generation’s experience later found expression in “scar literature” and the Democracy Wall movement.',
        },
        aliases: { ko: ['홍위병 운동', '조반파', '4구 타파'], en: ['Red Guard movement', 'Hongweibing'] },
        people: ['mao-zedong', 'jiang-qing', 'chen-boda', 'wei-jingsheng'],
        events: ['cultural-revolution'],
        sources: [W + 'Red_Guards', W + 'Cultural_Revolution'], locator: L,
    },
    {
        id: 'down-to-the-countryside-movement', term: { ko: '상산하향 운동', en: 'Down to the Countryside Movement' }, category: 'party-state',
        period: { ko: '1968–1980', en: '1968–1980' }, startYear: 1968, endYear: 1980,
        definition: {
            ko: '1968년 12월 마오쩌둥의 「지식청년은 농촌으로 가서 빈농·하중농에게 재교육을 받아야 한다」는 지시에 따라 도시의 중·고등학교 졸업생을 농촌과 변경의 생산건설병단으로 보낸 정책. 1950년대의 소규모 하향과 달리 1968~1980년 약 1,700만 명이 동원되어 홍위병 운동을 종식하고 도시 실업을 흡수했다. 1978년 윈난 병단의 청년 파업 뒤 사실상 폐지되었고, 「지청」 세대의 경험은 상흔문학과 개혁기 정치의식의 바탕이 되었다.',
            en: 'The policy, following Mao Zedong’s December 1968 instruction that “educated youth must go to the countryside to be re-educated by the poor and lower-middle peasants”, of sending urban secondary-school graduates to villages and frontier production-construction corps. Unlike the small-scale transfers of the 1950s, it moved about seventeen million people between 1968 and 1980, ending the Red Guard movement and absorbing urban unemployment. It was effectively abolished after the 1978 strikes of youths in the Yunnan corps, and the experience of the “zhiqing” generation underlay scar literature and the political consciousness of the reform era.',
        },
        body: {
            ko: '운동의 직접적 계기는 1968년 홍위병 파벌 투쟁의 종식이었다. 학교가 2년 넘게 멈춘 상태에서 1966~1968년 졸업생 「노삼계(老三屆)」가 누적되었고, 도시는 이들에게 줄 일자리가 없었다. 농촌에서 「재교육」을 받는다는 이념적 명분과 도시 인구 압력의 해소가 결합했다.\n\n지청은 대개 마을의 생산대에 「삽대(插隊)」해 농민과 함께 일하거나 헤이룽장·윈난·신장·네이멍구의 병단에 배치되었다. 도시 청년은 농민보다 낮은 노동점수를 받아 생계가 어려웠고, 간부의 성폭력과 「뒷문」을 통한 귀향이 만연했다. 부모의 정치적 지위가 귀향 여부를 좌우했다.\n\n1978년 윈난 시솽반나 병단의 지청 5만 명이 귀향을 요구하며 파업·단식을 벌였고, 국무원은 1979년 대규모 귀향을 허용했다. 이 세대에서 시진핑 등 개혁기 지도자들이 나왔으며, 그들의 회고는 「청춘무회(青春無悔)」와 「잃어버린 세대」 사이에서 갈린다.',
            en: 'The immediate occasion was the end of the Red Guard factional struggle in 1968. With schools closed for more than two years the graduating classes of 1966–1968, the “three old classes”, had piled up, and the cities had no jobs for them. The ideological justification of “re-education” in the countryside combined with relief of urban population pressure.\n\nMost sent-down youths were “inserted” into village production teams to work alongside peasants or posted to the corps in Heilongjiang, Yunnan, Xinjiang and Inner Mongolia. Urban youths earned fewer work points than peasants and struggled to live; sexual abuse by cadres and return to the city through the “back door” were widespread, and a parent’s political standing decided who went home.\n\nIn 1978 some fifty thousand youths in the Xishuangbanna corps in Yunnan struck and went on hunger strike demanding to return, and in 1979 the State Council allowed mass return. Reform-era leaders such as Xi Jinping came from this generation, whose memories divide between “no regrets for our youth” and a “lost generation”.',
        },
        aliases: { ko: ['상산하향', '지식청년 하방', '지청'], en: ['Up to the Mountains and Down to the Countryside', 'sent-down youth', 'zhiqing'] },
        people: ['mao-zedong', 'wei-jingsheng'],
        events: ['cultural-revolution'],
        sources: [W + 'Down_to_the_Countryside_Movement', W + 'Cultural_Revolution'], locator: L,
    },
    {
        id: 'gang-of-four', term: { ko: '4인방', en: 'Gang of Four' }, category: 'factions',
        period: { ko: '1966–1976', en: '1966–1976' }, startYear: 1966, endYear: 1976,
        definition: {
            ko: '문화대혁명기 마오쩌둥의 급진 노선을 대변한 장칭·장춘차오·야오원위안·왕훙원의 상하이계 정치국 그룹. 선전과 문화를 장악하고 저우언라이·덩샤오핑의 정상화 노선에 맞섰으며, 1976년 4월 톈안먼 사건 뒤 덩샤오핑 재실각을 이끌었다. 마오 사망 한 달 뒤인 10월 6일 화궈펑·예젠잉·왕둥싱이 이들을 체포했고, 1980~1981년 특별법정에서 문화대혁명의 죄를 이들에게 집중시킨 재판이 열렸다. 「4인방」이라는 이름은 마오가 1974년 이들을 경고하며 쓴 말이다.',
            en: 'The Shanghai-based Politburo group of Jiang Qing, Zhang Chunqiao, Yao Wenyuan and Wang Hongwen, who represented Mao Zedong’s radical line in the Cultural Revolution. Controlling propaganda and culture, they fought the normalisation course of Zhou Enlai and Deng Xiaoping and engineered Deng’s second fall after the April 1976 Tiananmen incident. A month after Mao’s death, on 6 October 1976, Hua Guofeng, Ye Jianying and Wang Dongxing had them arrested, and the special court of 1980–1981 concentrated the guilt of the Cultural Revolution on them. Mao himself coined the name when warning them in 1974.',
        },
        body: {
            ko: '네 사람의 결합은 1965년 상하이에서 야오원위안의 『해서파관』 비판문을 준비하던 때로 거슬러 간다. 장칭은 문예 분야를 맡아 「양판희(樣板戲)」로 혁명 문화를 규정했고, 장춘차오는 상하이 코뮌과 「자산계급 법권 제한론」으로 이론을 제공했으며, 왕훙원은 노동자 조직을 대표했다. 1973년 제10차 당대회 뒤 이들은 정치국에서 급진파 블록을 이루었다.\n\n마오는 이들을 이용하면서도 견제했다. 1974년 「너희는 4인방을 만들지 말라」고 경고했고 저우언라이와 덩샤오핑에게 정부 운영을 맡겼다. 그러나 1975년 말 「덩샤오핑 비판·우경번안풍 반격」 운동으로 다시 급진파가 우세했고, 1976년 4월 저우 추모 시위를 「반혁명」으로 규정해 덩을 실각시켰다.\n\n마오 사후 이들이 당권을 노린다는 판단 아래 예젠잉이 화궈펑을 설득했고, 10월 6일 중난하이에서 장춘차오·왕훙원·야오원위안이, 이어 장칭이 체포되었다. 재판에서 장칭은 「나는 마오 주석의 개였다」며 책임을 마오에게 돌렸고 사형 집행유예를 받았다. 4인방 규정은 문화대혁명의 책임을 마오에게서 분리하는 장치이기도 했다.',
            en: 'The four came together in Shanghai in 1965 while preparing Yao Wenyuan’s attack on Hai Rui Dismissed from Office. Jiang Qing ran the arts and defined revolutionary culture through the “model operas”; Zhang Chunqiao supplied theory with the Shanghai Commune and the doctrine of “restricting bourgeois right”; Wang Hongwen represented the worker organisations. After the Tenth Congress of 1973 they formed a radical bloc in the Politburo.\n\nMao used them and checked them. In 1974 he warned “don’t form a gang of four” and entrusted the government to Zhou Enlai and Deng Xiaoping. But from late 1975 the campaign to “criticise Deng and beat back the right-deviationist reversal of verdicts” restored the radicals’ advantage, and in April 1976 they had the mourning protests for Zhou declared counter-revolutionary and Deng removed.\n\nAfter Mao’s death, judging that the four were reaching for the party leadership, Ye Jianying persuaded Hua Guofeng; on 6 October Zhang Chunqiao, Wang Hongwen and Yao Wenyuan were seized at Zhongnanhai, then Jiang Qing. At the trial Jiang Qing declared “I was Chairman Mao’s dog” and shifted the blame to Mao, receiving a suspended death sentence. The label “Gang of Four” was also a device for separating responsibility for the Cultural Revolution from Mao.',
        },
        aliases: { ko: ['사인방', '상하이방'], en: ['Shanghai clique'] },
        people: ['jiang-qing', 'zhang-chunqiao', 'yao-wenyuan', 'wang-hongwen', 'hua-guofeng', 'ye-jianying', 'wang-dongxing'],
        events: ['cultural-revolution', 'reform-and-opening'],
        sources: [W + 'Gang_of_Four', W + 'Cultural_Revolution'], locator: L,
    },
    {
        id: 'four-modernizations', term: { ko: '4개 현대화', en: 'Four Modernizations' }, category: 'economy',
        period: { ko: '1964–', en: '1964–' }, startYear: 1964,
        definition: {
            ko: '농업·공업·국방·과학기술의 현대화라는 국가 목표. 1964년 저우언라이가 전국인민대표대회에서 처음 제시했고 1975년 다시 내걸었으나 급진파의 반대로 묻혔다. 1978년 11기 3중전회가 당의 중심 과제를 계급투쟁에서 4개 현대화로 옮기면서 개혁개방의 공식 목표가 되었다. 웨이징성이 「제5의 현대화」로 민주를 요구한 것은 이 구호에 대한 응답이었으며, 덩샤오핑은 「4항 기본원칙」으로 정치적 한계를 그었다.',
            en: 'The national goal of modernising agriculture, industry, national defence and science and technology. First set out by Zhou Enlai at the National People’s Congress in 1964 and raised again in 1975, it was buried by radical opposition until the Third Plenum of 1978 moved the party’s central task from class struggle to the four modernisations, making it the official aim of reform and opening. Wei Jingsheng’s demand for democracy as the “fifth modernisation” answered the slogan, and Deng Xiaoping drew its political limits with the “four cardinal principles”.',
        },
        body: {
            ko: '1964년 12월 저우언라이의 정부활동보고는 「금세기 안에 현대적 농업·공업·국방·과학기술을 갖춘 사회주의 강국」을 목표로 제시했다. 문화대혁명으로 사라졌던 이 구상은 1975년 제4기 전국인민대표대회에서 저우가 다시 제기했고 덩샤오핑이 「정돈」으로 뒷받침했으나 곧 「덩샤오핑 비판」 운동에 부딪혔다.\n\n1978년 화궈펑도 4개 현대화를 내걸고 대규모 설비 수입 계획을 추진했으며, 11기 3중전회는 이를 당의 중심 과제로 확정했다. 1979년 3월 덩샤오핑은 「4개 현대화의 실현에는 4항 기본원칙(사회주의 노선·프롤레타리아 독재·당의 지도·마르크스레닌주의와 마오쩌둥 사상)이 필요하다」고 연설해 민주의 벽 운동을 억제했다.\n\n1987년 제13차 당대회는 「세 걸음(三步走)」 전략으로 21세기 중반까지의 현대화 시간표를 제시했다. 4개 현대화는 정치체제 개혁을 포함하지 않는다는 점에서 소련 페레스트로이카와 구별되었고, 이 차이가 1989년 이후 두 체제의 다른 궤적을 설명하는 논점이 되었다.',
            en: 'Zhou Enlai’s government work report of December 1964 set the goal of “a socialist power with modern agriculture, industry, national defence and science and technology within this century”. Lost in the Cultural Revolution, the idea was raised again by Zhou at the Fourth National People’s Congress in 1975 and backed by Deng Xiaoping’s “consolidation”, but soon ran into the campaign to criticise Deng.\n\nIn 1978 Hua Guofeng too proclaimed the four modernisations and pushed a large programme of equipment imports, and the Third Plenum confirmed them as the party’s central task. In March 1979 Deng said that realising them required the “four cardinal principles” — the socialist road, the dictatorship of the proletariat, party leadership, and Marxism-Leninism and Mao Zedong Thought — reining in the Democracy Wall movement.\n\nThe Thirteenth Congress of 1987 set a timetable for modernisation to the middle of the twenty-first century with the “three steps” strategy. The four modernisations excluded reform of the political system, which distinguished them from Soviet perestroika, and that difference became a point of argument in explaining the two systems’ divergent paths after 1989.',
        },
        aliases: { ko: ['사개현대화', '네 가지 현대화'], en: ['four modernisations'] },
        people: ['zhou-enlai', 'deng-xiaoping', 'hua-guofeng', 'wei-jingsheng'],
        events: ['reform-and-opening'],
        sources: [W + 'Four_Modernizations', 'https://www.marxists.org/reference/archive/deng-xiaoping/1979/115.htm'], locator: L,
    },
    {
        id: 'household-responsibility-system', term: { ko: '농가생산책임제', en: 'Household responsibility system' }, category: 'economy',
        period: { ko: '1978–', en: '1978–' }, startYear: 1978,
        definition: {
            ko: '집단 소유의 토지를 농가별로 청부해 국가 납부량과 집단 유보분을 뺀 나머지를 농가가 갖게 한 제도. 1978년 안후이 펑양현 샤오강촌 농민들이 비밀리에 토지를 나눈 데서 시작해 완리·자오쯔양이 묵인·확산했고, 1982년 중앙 1호 문건이 공식 승인해 1983년 인민공사 해체와 함께 전국화되었다. 1978~1984년 농업 생산의 급증을 가져와 개혁개방의 첫 성공으로 꼽히며, 토지 소유는 집단에 남고 경작권만 농가에 주는 구조가 오늘까지 이어진다.',
            en: 'The system under which collectively owned land is contracted to individual households, which keep what remains after the state quota and collective retention. It began with the secret division of land by peasants at Xiaogang village in Fengyang, Anhui, in 1978, was tolerated and spread by Wan Li and Zhao Ziyang, was officially approved in the No. 1 Central Document of 1982 and became universal with the dissolution of the communes in 1983. It produced the surge in farm output of 1978–1984 counted as the first success of reform, and its structure — ownership with the collective, cultivation rights with the household — persists today.',
        },
        body: {
            ko: '청부제는 새로운 발명이 아니었다. 1956년, 1959년, 1962년에도 기근 지역에서 「포산도호(包産到戶)」가 나타났고 그때마다 「자본주의의 길」로 비판받았다. 1978년 겨울 샤오강촌의 18호 농민이 손도장을 찍은 계약서는 감옥에 갈 각오로 토지를 나눈 것이었으며, 이듬해 수확이 몇 배로 늘자 현과 성이 이를 묵인했다.\n\n중앙에서는 화궈펑과 농업 담당 부총리 천융구이가 반대했고, 1979년 4중전회 문건은 청부제를 산간벽지 등에 한정했다. 완리가 부총리가 되고 자오쯔양이 총리가 되면서 정책이 바뀌어 1980년 「75호 문건」이 빈곤 지역의 청부를 허용했고 1982년 1호 문건이 「사회주의 집단경제의 생산책임제」로 정당화했다.\n\n1984년까지 농가의 99%가 청부제로 옮겨 갔고 곡물 생산은 1978년 3억 톤에서 1984년 4억 톤으로 늘었다. 이후 청부 기간이 15년, 30년으로 연장되고 2000년대에는 「토지 경영권」의 유통이 허용되었으나 집단 소유 원칙은 유지되었다. 소규모 분산 경작과 농민공 문제는 이 제도의 다른 면이다.',
            en: 'Contracting was not an invention of 1978. “Fixing output to the household” had appeared in famine areas in 1956, 1959 and 1962 and was condemned each time as the capitalist road. The contract that eighteen households at Xiaogang signed with thumbprints in the winter of 1978 divided the land at the risk of prison, and when the next harvest multiplied, the county and province looked away.\n\nAt the centre Hua Guofeng and the agriculture vice-premier Chen Yonggui opposed it, and the Fourth Plenum document of 1979 confined contracting to remote mountain areas. Policy changed as Wan Li became vice-premier and Zhao Ziyang premier: “Document 75” of 1980 allowed contracting in poor areas, and the No. 1 Document of 1982 legitimised it as “a production responsibility system of the socialist collective economy”.\n\nBy 1984, 99 per cent of households had moved to contracting and grain output rose from 300 million tonnes in 1978 to 400 million in 1984. Contract terms were later extended to fifteen and thirty years, and in the 2000s transfer of “land management rights” was allowed, but collective ownership remained. Small fragmented plots and the migrant-worker question are the other face of the system.',
        },
        aliases: { ko: ['포산도호', '가정연산승포책임제', '샤오강촌'], en: ['household contract responsibility system', 'baochan daohu'] },
        people: ['wan-li', 'zhao-ziyang', 'deng-xiaoping', 'chen-yonggui'],
        events: ['reform-and-opening'],
        sources: [W + 'Household_responsibility_system', W + 'Chinese_economic_reform'], locator: L,
    },
    {
        id: 'special-economic-zones-china', term: { ko: '경제특구 (중국)', en: 'Special economic zones of China' }, category: 'economy',
        period: { ko: '1980–', en: '1980–' }, startYear: 1980,
        definition: {
            ko: '외국 자본과 기술을 끌어들이기 위해 세제·토지·노동·외환에 특례를 준 지역. 1979년 광둥의 시중쉰이 「선행일보」를 요청하고 덩샤오핑이 「특구」라는 이름을 붙여 1980년 선전·주하이·산터우·샤먼에 설치되었고 1988년 하이난이 더해졌다. 홍콩 자본의 가공무역으로 출발한 선전은 어촌에서 대도시로 성장해 개혁의 상징이 되었으며, 1984년 14개 연해 개방도시와 1990년 상하이 푸둥으로 확산되었다. 특구는 계획 밖에서 시장을 실험하는 「창구」였고 보수파는 이를 조계의 재현으로 비판했다.',
            en: 'Areas given exceptional tax, land, labour and foreign-exchange rules to attract foreign capital and technology. After Xi Zhongxun of Guangdong asked in 1979 to “take one step ahead” and Deng Xiaoping supplied the name, they were established in 1980 at Shenzhen, Zhuhai, Shantou and Xiamen, with Hainan added in 1988. Shenzhen, which began with processing trade for Hong Kong capital, grew from a fishing town into a metropolis and became the symbol of reform, and the model spread to fourteen coastal cities in 1984 and to Pudong in Shanghai in 1990. The zones were “windows” for testing the market outside the plan; conservatives attacked them as a revival of the foreign concessions.',
        },
        body: {
            ko: '특구 구상은 홍콩으로의 대량 탈출이라는 광둥의 위기에서 나왔다. 1978년 부임한 시중쉰은 탈출의 원인을 소득 격차에서 찾았고, 1979년 4월 중앙공작회의에서 광둥에 대외 경제활동의 자율권을 요구했다. 덩샤오핑은 「옌안 시절의 산간닝 변구도 특구였다」며 지지했고 7월 중앙은 광둥·푸젠에 「특수 정책과 유연한 조치」를 승인했다.\n\n선전은 1980년 8월 정식 출범했다. 홍콩과의 접경, 3래1보(원자재·견본·부품 위탁가공과 보상무역), 토지 사용권의 유상 양도, 계약제 노동 등이 중국 최초로 시험되었고 1984년 덩샤오핑의 첫 남순은 「선전의 경험은 옳다」고 확인했다. 1985년 밀수 스캔들과 「이념적 오염」 비판이 있었으나 정책은 유지되었다.\n\n1992년 덩의 두 번째 남순은 1989년 이후 위축된 개혁을 재가동하는 무대로 선전을 택했다. 특구는 이후 자유무역시험구와 슝안 신구 등으로 이어졌으며, 개발도상국 다수가 중국식 특구를 모방했다. 노동조건·토지 수용·호구제 차별은 특구 성공의 그늘로 남았다.',
            en: 'The idea grew out of Guangdong’s crisis of mass flight to Hong Kong. Xi Zhongxun, appointed in 1978, traced the flight to the income gap and at the central work conference of April 1979 asked for autonomy in foreign economic activity; Deng Xiaoping supported him — “the Shaan-Gan-Ning border region at Yan’an was a special zone too” — and in July the centre approved “special policies and flexible measures” for Guangdong and Fujian.\n\nShenzhen was formally launched in August 1980. Its border with Hong Kong, the “three imports and one compensation” processing trade, paid transfer of land-use rights and contract labour were all tested there for the first time in China, and Deng’s first southern tour in 1984 confirmed that “the experience of Shenzhen is correct”. Smuggling scandals and attacks on “ideological pollution” in 1985 did not change the policy.\n\nIn 1992 Deng chose Shenzhen as the stage of his second southern tour, restarting reforms that had stalled after 1989. The zones were followed by free-trade pilot zones and the Xiong’an New Area, and many developing countries copied the Chinese model. Labour conditions, land expropriation and discrimination under the household registration system remain the shadow of the zones’ success.',
        },
        aliases: { ko: ['경제특구', '선전 경제특구'], en: ['Shenzhen Special Economic Zone', 'SEZ'] },
        people: ['deng-xiaoping', 'xi-zhongxun', 'jiang-zemin'],
        events: ['reform-and-opening'],
        sources: [W + 'Special_economic_zones_of_China', W + 'Chinese_economic_reform'], locator: L,
    },
];
