// 이 역사를 연구한 사람들 (group scholar) — historians of the Chinese revolution.
const W = 'https://en.wikipedia.org/wiki/';
const L = 'Wikipedia article: lead, career and works sections';

module.exports = [
    {
        id: 'stuart-schram', group: 'scholar',
        family: { ko: '슈람', en: 'Schram' }, given: { ko: '스튜어트', en: 'Stuart' }, native: 'Stuart R. Schram',
        years: '1924–2012', role: 'scholar', citizenship: 'usa', origin: 'usa',
        epithet: { ko: '『마오쩌둥의 정치사상』과 10권짜리 『마오의 혁명 노정』을 편찬한 마오 연구의 개척자', en: 'Pioneer of Mao studies, author of The Political Thought of Mao Tse-tung and editor of the ten-volume Mao’s Road to Power' },
        bio: {
            ko: '미네소타 출신의 물리학도로 맨해튼 계획에 참여한 뒤 정치학으로 옮겨 파리에서 가르쳤고, 런던 SOAS 현대중국연구소를 이끌었다. 1963년 『마오쩌둥의 정치사상』으로 마오의 사상을 원문에 근거해 체계적으로 분석한 첫 서구 연구자였으며, 마오 사상이 소련 마르크스주의의 단순한 복제가 아니라 중국의 조건에 맞춘 독자적 변형이라고 주장했다. 만년에는 하버드 페어뱅크센터에서 1912~1949년 마오의 저작을 원문 그대로 모은 『마오의 혁명 노정』을 편찬했다.',
            en: 'A Minnesotan trained in physics who worked on the Manhattan Project before turning to political science, he taught in Paris and directed the Contemporary China Institute at SOAS in London. His 1963 The Political Thought of Mao Tse-tung was the first systematic Western analysis of Mao’s thought grounded in the original texts, arguing that it was not a copy of Soviet Marxism but a distinct adaptation to Chinese conditions. In his later years at Harvard’s Fairbank Center he edited Mao’s Road to Power, the unexpurgated collection of Mao’s writings from 1912 to 1949.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['스튜어트 슈람'], en: ['Stuart Reynolds Schram'] },
        career: [
            { y: '1968–1989', r: { ko: 'SOAS 현대중국연구소 소장 · 정치학 교수', en: 'Director of the Contemporary China Institute and professor of politics, SOAS' } },
        ],
        sources: [W + 'Stuart_R._Schram'], locator: L,
    },
    {
        id: 'roderick-macfarquhar', group: 'scholar',
        family: { ko: '맥파쿼', en: 'MacFarquhar' }, given: { ko: '로더릭', en: 'Roderick' }, native: 'Roderick MacFarquhar',
        years: '1930–2019', role: 'scholar', citizenship: 'uk', origin: 'uk',
        epithet: { ko: '『문화대혁명의 기원』 3부작과 『마오의 마지막 혁명』으로 엘리트 정치를 해부한 하버드의 중국학자', en: 'Harvard sinologist whose Origins of the Cultural Revolution trilogy and Mao’s Last Revolution dissected China’s elite politics' },
        bio: {
            ko: '인도에서 태어난 영국인으로 언론인과 노동당 하원의원을 거쳐 학자가 되었고 『차이나 쿼털리』를 창간해 편집했다. 1974년부터 1997년까지 낸 『문화대혁명의 기원』 3부작은 1956년 백화제방부터 1966년까지 최고 지도부 안의 노선 대립을 추적해 문화대혁명이 마오 개인의 변덕이 아니라 대약진 실패 이후 누적된 정치적 갈등의 귀결임을 보였다. 2006년 마이클 쇤할스와 쓴 『마오의 마지막 혁명』은 1966~1976년 전체를 다룬 표준적 서술이다. 하버드대학 교수와 페어뱅크센터 소장을 지냈다.',
            en: 'A Briton born in India, he was a journalist and a Labour MP before becoming a scholar, and founded and edited The China Quarterly. The three volumes of The Origins of the Cultural Revolution (1974–1997) traced the line struggles inside the top leadership from the Hundred Flowers of 1956 to 1966, showing the Cultural Revolution as the outcome of political conflicts accumulated since the failure of the Great Leap rather than a personal whim of Mao. Mao’s Last Revolution (2006, with Michael Schoenhals) is the standard narrative of 1966–1976. He was a professor at Harvard and director of its Fairbank Center.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['로더릭 맥파커'], en: ['Roderick Lemonde MacFarquhar'] },
        career: [
            { y: '1974–1979', r: { ko: '영국 노동당 하원의원 (벨퍼)', en: 'Labour MP for Belper' } },
            { y: '1984–2019', r: { ko: '하버드대학 정치학 교수', en: 'Professor of government, Harvard University' } },
        ],
        sources: [W + 'Roderick_MacFarquhar'], locator: L,
    },
    {
        id: 'maurice-meisner', group: 'scholar',
        family: { ko: '마이스너', en: 'Meisner' }, given: { ko: '모리스', en: 'Maurice' }, native: 'Maurice Meisner',
        years: '1931–2012', role: 'scholar', citizenship: 'usa', origin: 'usa',
        epithet: { ko: '『마오의 중국과 그 이후』로 중국 혁명을 마르크스주의의 관점에서 비판적으로 평가한 역사가', en: 'Historian whose Mao’s China and After judged the Chinese revolution critically from within the Marxist tradition' },
        bio: {
            ko: '디트로이트 출신으로 위스콘신대학 매디슨 교수를 지냈다. 첫 저작 『리다자오와 중국 마르크스주의의 기원』(1967)은 마르크스주의가 중국에 수용되는 과정에서 민족주의와 농민에 대한 신뢰가 결합한 방식을 밝혔다. 1977년 초판이 나온 『마오의 중국과 그 이후』는 인민공화국사의 표준 교과서로, 마오주의를 사회주의의 이상과 후진국 근대화라는 이중 과제 사이의 긴장 속에서 읽었다. 그는 마오 시대의 억압을 비판하면서도 개혁기의 시장화가 사회주의의 약속을 저버렸다고 보았다.',
            en: 'From Detroit, he taught at the University of Wisconsin–Madison. His first book, Li Ta-chao and the Origins of Chinese Marxism (1967), showed how nationalism and faith in the peasantry combined as Marxism was received in China. Mao’s China and After, first published in 1977, became the standard textbook history of the People’s Republic, reading Maoism through the tension between socialist ideals and the modernisation of a backward country. He criticised the repression of the Mao years while judging that the marketisation of the reform era had abandoned socialism’s promise.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['모리스 마이스너'], en: ['Maurice J. Meisner'] },
        career: [
            { y: '1968–1999', r: { ko: '위스콘신대학 매디슨 역사학 교수', en: 'Professor of history, University of Wisconsin–Madison' } },
        ],
        sources: [W + 'Maurice_Meisner'], locator: L,
    },
    {
        id: 'frank-dikotter', group: 'scholar',
        family: { ko: '디쾨터', en: 'Dikötter' }, given: { ko: '프랑크', en: 'Frank' }, native: 'Frank Dikötter',
        years: '1961–', role: 'scholar', citizenship: 'netherlands', origin: 'netherlands',
        epithet: { ko: '지방 당안(檔案)으로 대기근 사망자를 4,500만으로 추산한 「인민 3부작」의 저자', en: 'Author of the “People’s Trilogy”, who used provincial party archives to put the Great Famine’s death toll at 45 million' },
        bio: {
            ko: '네덜란드 출신으로 런던 SOAS를 거쳐 홍콩대학 교수로 있다. 2010년 『마오의 대기근』은 2000년대에 열린 중국 지방 당안관 자료를 이용해 대약진 시기 최소 4,500만 명이 굶주림·폭력·과로로 죽었다고 추산하고, 기근이 자연재해나 계획 착오가 아니라 국가 폭력의 결과였다고 주장해 새뮤얼 존슨상을 받았다. 이어 『해방의 비극』(1949~1957)과 『문화대혁명』(1962~1976)으로 3부작을 완성했다. 그의 수치와 해석은 학계에서 논쟁의 대상이며, 다른 연구자들은 사망자 수를 1,500만~3,600만으로 추정한다.',
            en: 'A Dutch historian who taught at SOAS in London before becoming a professor at the University of Hong Kong. Mao’s Great Famine (2010), drawing on provincial party archives opened in the 2000s, estimated that at least 45 million people died of hunger, violence and overwork during the Great Leap and argued that the famine was the result of state violence rather than natural disaster or planning error; it won the Samuel Johnson Prize. The Tragedy of Liberation (1949–1957) and The Cultural Revolution (1962–1976) completed the trilogy. His figures and interpretation are contested; other scholars put the famine’s toll between 15 and 36 million.',
        },
        aliases: { ko: ['프랑크 디쾨터'], en: ['Frank Dikotter'] },
        career: [
            { y: '2006–', r: { ko: '홍콩대학 인문학 석좌교수', en: 'Chair professor of humanities, University of Hong Kong' } },
        ],
        sources: [W + 'Frank_Dik%C3%B6tter', W + 'Great_Chinese_Famine'], locator: L,
    },
    {
        id: 'yang-jisheng', group: 'scholar',
        family: { ko: '양', en: 'Yang' }, given: { ko: '지성', en: 'Jisheng' }, native: '杨继绳',
        years: '1940–', role: 'scholar', citizenship: 'china', origin: 'china',
        epithet: { ko: '아버지를 기근에 잃은 신화사 기자, 『묘비』로 대기근 사망자 3,600만을 기록한 중국의 역사가', en: 'The Xinhua reporter who lost his father to the famine and, in Tombstone, documented 36 million Great Famine deaths' },
        bio: {
            ko: '후베이 출신으로 1959년 대약진 기근 때 양아버지가 굶어 죽는 것을 지켜보았으나 당시에는 그것이 전국적 재난임을 몰랐다. 신화사 기자로 일하며 1990년대부터 전국의 당안관과 생존자를 찾아 10여 년의 조사 끝에 2008년 홍콩에서 『묘비』를 냈다. 이 책은 1958~1962년 기근 사망자를 약 3,600만 명으로 추산하고 원인을 인민공사·강제 징발·「반우경」 정치에 두었으며, 대륙에서는 금서다. 이어 2016년 문화대혁명사 『천지번복』을 냈다. 잡지 『옌황춘추』 부사장을 지냈다.',
            en: 'From Hubei, he watched his adoptive father starve in the Great Leap famine of 1959 without knowing it was a nationwide disaster. As a Xinhua reporter he began in the 1990s to search archives and interview survivors across the country, and after more than a decade published Tombstone in Hong Kong in 2008. The book estimates about 36 million famine deaths in 1958–1962 and traces them to the communes, forced procurement and “anti-rightist” politics; it is banned on the mainland. His history of the Cultural Revolution, The World Turned Upside Down, followed in 2016. He was deputy publisher of the journal Yanhuang Chunqiu.',
        },
        aliases: { ko: ['양계승'], en: ['Yang Jisheng'] },
        career: [
            { y: '1968–2001', r: { ko: '신화통신 기자', en: 'Reporter for the Xinhua News Agency' } },
        ],
        sources: [W + 'Yang_Jisheng_(journalist)', W + 'Great_Chinese_Famine'], locator: L,
    },
    {
        id: 'gao-hua', group: 'scholar',
        family: { ko: '가오', en: 'Gao' }, given: { ko: '화', en: 'Hua' }, native: '高华',
        years: '1954–2011', role: 'scholar', citizenship: 'china', origin: 'china',
        epithet: { ko: '『붉은 태양은 어떻게 떠올랐나』로 옌안 정풍운동을 해부한 난징대학의 역사가', en: 'Nanjing University historian whose How the Red Sun Rose dissected the Yan’an rectification movement' },
        bio: {
            ko: '난징 출신으로 문화대혁명기 아버지가 「우파」로 박해받는 것을 보며 자랐고, 난징대학에서 중국 현대사를 가르쳤다. 2000년 홍콩에서 낸 『붉은 태양은 어떻게 떠올랐나 — 옌안 정풍운동의 전말』은 공개된 문헌만으로 1942~1945년 정풍운동을 재구성해, 마오가 사상 개조와 심사·「구조 운동」을 통해 당의 권력을 자신에게 집중하고 이후 정치운동의 틀을 만든 과정을 보여주었다. 대륙에서 출판이 금지되었으나 널리 읽혔으며, 그는 2011년 간암으로 사망했다.',
            en: 'Born in Nanjing, he grew up watching his father persecuted as a “rightist” during the Cultural Revolution and taught modern Chinese history at Nanjing University. How the Red Sun Rose: The Origins and Development of the Yan’an Rectification Movement, published in Hong Kong in 2000, reconstructed the movement of 1942–1945 from published sources alone, showing how Mao concentrated the party’s power in himself through thought reform, cadre screening and the “rescue campaign”, and set the template for later political campaigns. Banned on the mainland but widely read there, he died of liver cancer in 2011.',
        },
        fate: { kind: 'natural', label: { ko: '간암', en: 'Liver cancer' } },
        aliases: { ko: ['고화'], en: ['Gao Hua'] },
        career: [
            { y: '1978–2011', r: { ko: '난징대학 역사학 교수', en: 'Professor of history, Nanjing University' } },
        ],
        sources: [W + 'Gao_Hua', W + 'Yan%27an_Rectification_Movement'], locator: L,
    },
];
