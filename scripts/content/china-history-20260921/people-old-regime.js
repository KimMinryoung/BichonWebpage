// 구체제와 국민당 — the side the Communists fought (group china-old-regime).
const W = 'https://en.wikipedia.org/wiki/';
const L = 'Wikipedia article: lead, biography sections';

module.exports = [
    {
        id: 'yuan-shikai', group: 'china-old-regime',
        family: { ko: '위안', en: 'Yuan' }, given: { ko: '스카이', en: 'Shikai' }, native: '袁世凯',
        years: '1859–1916', role: 'qing-kuomintang-warlords',
        epithet: { ko: '신해혁명의 성과를 가로채 황제가 되려 한 북양군벌의 총수', en: 'The Beiyang strongman who took over the 1911 revolution and tried to make himself emperor' },
        bio: {
            ko: '청 말 북양신군을 키운 군인·관료였다. 1911년 신해혁명이 일어나자 청 조정과 혁명파 사이에서 양쪽을 압박해 1912년 청 황제의 퇴위와 자신의 중화민국 임시대총통 취임을 함께 얻어냈다. 이후 국회를 무력화하고 국민당을 해산했으며, 1915년 말 스스로 황제를 칭했다가 각 성의 반발로 이듬해 제정을 취소하고 곧 병사했다. 그의 죽음 뒤 북양군은 분열해 군벌 시대가 열렸다.',
            en: 'A soldier-official who built the Beiyang New Army in the late Qing. When the 1911 revolution broke out he pressed both the court and the revolutionaries, securing the Qing emperor’s abdication and his own installation as provisional president of the Republic in 1912. He then hollowed out parliament, dissolved the Kuomintang and, in late 1915, proclaimed himself emperor; provincial revolts forced him to cancel the monarchy in 1916, and he died months later. His death fractured the Beiyang army and opened the warlord era.',
        },
        fate: { kind: 'natural', label: { ko: '병사', en: 'Illness' } },
        aliases: { ko: ['원세개'], en: ['Yuan Shih-kai'] },
        career: [
            { y: '1901–1907', r: { ko: '직례총독 겸 북양대신', en: 'Viceroy of Zhili and Minister of Beiyang' } },
            { y: '1912–1916', r: { ko: '중화민국 대총통', en: 'President of the Republic of China' } },
            { y: '1915.12–1916.03', r: { ko: '「중화제국」 황제 자칭', en: 'Self-proclaimed emperor of the “Empire of China”' } },
        ],
        sources: [W + 'Yuan_Shikai', W + 'Xinhai_Revolution'], locator: L,
    },
    {
        id: 'wang-jingwei', group: 'china-old-regime',
        family: { ko: '왕', en: 'Wang' }, given: { ko: '징웨이', en: 'Jingwei' }, native: '汪精卫',
        years: '1883–1944', role: 'qing-kuomintang-warlords',
        epithet: { ko: '쑨원의 후계자에서 일본 점령하 난징 정권의 수반이 된 국민당 좌파', en: 'Sun Yat-sen’s heir and Kuomintang left leader who ended as head of the Japanese-sponsored Nanjing regime' },
        bio: {
            ko: '청 섭정왕 암살 미수로 이름을 얻은 동맹회 혁명가로, 쑨원의 유촉을 받아쓴 측근이었다. 1927년 우한 국민정부를 이끌며 한때 공산당과의 합작을 유지했으나 그해 7월 분공(分共)으로 돌아섰다. 이후 장제스와 경쟁·협력을 반복하다 1938년 충칭을 떠나 일본과의 「평화」를 주장했고, 1940년 일본이 세운 난징 국민정부의 주석이 되었다. 1944년 나고야에서 병사했으며 중국에서는 대표적 한간(漢奸)으로 기억된다.',
            en: 'A Tongmenghui revolutionary famous for a failed attempt on the Qing regent, and the confidant who took down Sun Yat-sen’s political testament. He led the Wuhan Nationalist government in 1927 and briefly kept the alliance with the Communists before breaking with them that July. After years of rivalry and cooperation with Chiang Kai-shek he left Chongqing in 1938 to advocate “peace” with Japan, and in 1940 became head of the Japanese-sponsored Nanjing government. He died of illness in Nagoya in 1944 and is remembered in China as the archetypal collaborator.',
        },
        fate: { kind: 'natural', label: { ko: '병사 · 나고야', en: 'Illness · Nagoya' } },
        aliases: { ko: ['왕정위', '왕자오밍'], en: ['Wang Ching-wei', 'Wang Zhaoming'] },
        career: [
            { y: '1927', r: { ko: '우한 국민정부 주석', en: 'Chairman of the Wuhan Nationalist government' } },
            { y: '1932–1935', r: { ko: '국민정부 행정원장', en: 'President of the Executive Yuan' } },
            { y: '1940–1944', r: { ko: '난징 국민정부(일본 후원) 주석', en: 'Head of the Japanese-sponsored Nanjing government' } },
        ],
        sources: [W + 'Wang_Jingwei', W + 'First_United_Front'], locator: L,
    },
    {
        id: 'zhang-xueliang', group: 'china-old-regime',
        family: { ko: '장', en: 'Zhang' }, given: { ko: '쉐량', en: 'Xueliang' }, native: '张学良',
        years: '1901–2001', role: 'qing-kuomintang-warlords',
        epithet: { ko: '시안에서 장제스를 감금해 제2차 국공합작의 길을 연 「젊은 원수」', en: 'The “Young Marshal” who detained Chiang Kai-shek at Xi’an and opened the way to the second united front' },
        bio: {
            ko: '만주 군벌 장쭤린의 아들로 1928년 아버지가 일본군에 폭살되자 동북을 물려받았고, 그해 말 난징 국민정부에 귀순했다. 1931년 만주사변으로 근거지를 잃은 뒤 공산당 토벌에 투입되었으나, 1936년 12월 시안에서 양후청과 함께 장제스를 감금해 내전 중지와 항일을 요구했다. 사건은 저우언라이의 중재로 풀렸지만 그는 장제스와 함께 난징으로 돌아가 이후 반세기 넘게 연금되었다. 1990년대 풀려나 하와이에서 100세로 사망했다.',
            en: 'Son of the Manchurian warlord Zhang Zuolin, he inherited the Northeast when the Japanese killed his father in 1928 and pledged allegiance to Nanjing that year. Driven from Manchuria in 1931, he was sent against the Communists, but in December 1936 he and Yang Hucheng seized Chiang Kai-shek at Xi’an to demand an end to civil war and resistance to Japan. Zhou Enlai brokered the release; Zhang flew back with Chiang and spent more than fifty years under house arrest. Freed in the 1990s, he died in Hawaii at 100.',
        },
        fate: { kind: 'deposed', label: { ko: '체포 1936 · 자연사', en: 'Arrested 1936 · natural causes' } },
        aliases: { ko: ['장학량'], en: ['Chang Hsueh-liang'] },
        career: [
            { y: '1928–1931', r: { ko: '동북 변방군 사령관', en: 'Commander of the Northeastern Army' } },
            { y: '1936.12', r: { ko: '시안 사변 주도', en: 'Instigator of the Xi’an Incident' } },
        ],
        sources: [W + 'Zhang_Xueliang', W + 'Xi%27an_Incident'], locator: L,
    },
    {
        id: 'puyi', group: 'china-old-regime',
        family: { ko: '푸이', en: 'Puyi' }, native: '溥仪',
        years: '1906–1967', role: 'qing-kuomintang-warlords',
        epithet: { ko: '청의 마지막 황제이자 만주국의 꼭두각시 황제, 인민공화국의 「개조된」 시민', en: 'Last emperor of the Qing, puppet emperor of Manchukuo, and a “remoulded” citizen of the People’s Republic' },
        bio: {
            ko: '세 살에 청의 선통제로 즉위해 1912년 신해혁명으로 퇴위했다. 자금성에 머물다 1924년 쫓겨나 톈진의 일본 조계로 갔고, 1932년 일본이 세운 만주국의 집정, 1934년부터 황제가 되었다. 1945년 소련군에 붙잡혀 억류된 뒤 1950년 중국에 송환되어 푸순 전범관리소에서 개조 교육을 받았고 1959년 특사로 풀려났다. 베이징 식물원 정원사와 정협 위원으로 살다 문화대혁명 초기인 1967년 병사했다.',
            en: 'Enthroned at three as the Xuantong Emperor, he abdicated in the 1911 revolution. Expelled from the Forbidden City in 1924, he went to the Japanese concession in Tianjin and in 1932 became chief executive, then emperor, of Japan’s puppet state Manchukuo. Captured by the Soviets in 1945 and returned to China in 1950, he was “remoulded” at the Fushun war criminals’ prison and pardoned in 1959. He lived as a gardener and later a political-consultative delegate in Beijing and died of illness in 1967, early in the Cultural Revolution.',
        },
        fate: { kind: 'deposed', label: { ko: '퇴위 1912 · 자연사', en: 'Abdicated 1912 · natural causes' } },
        aliases: { ko: ['선통제', '부의', '아이신줴뤄 푸이'], en: ['Xuantong Emperor', 'Henry Pu Yi', 'Aisin-Gioro Puyi'] },
        career: [
            { y: '1908–1912', r: { ko: '청 선통제', en: 'Xuantong Emperor of the Qing' } },
            { y: '1934–1945', r: { ko: '만주국 황제', en: 'Emperor of Manchukuo' } },
            { y: '1950–1959', r: { ko: '푸순 전범관리소 수감', en: 'Prisoner at the Fushun war criminals’ management centre' } },
        ],
        sources: [W + 'Puyi', W + 'Xinhai_Revolution'], locator: L,
    },
    {
        id: 'hu-shih', group: 'china-old-regime',
        family: { ko: '후', en: 'Hu' }, given: { ko: '스', en: 'Shih' }, native: '胡适',
        years: '1891–1962', role: 'theorist',
        epithet: { ko: '백화문 운동을 이끈 신문화운동의 자유주의자, 뒤에 국민정부의 외교관', en: 'The liberal of the New Culture Movement who led the vernacular-language campaign and later served the Nationalists as a diplomat' },
        bio: {
            ko: '미국에서 존 듀이에게 배운 철학자로 1917년 『신청년』에 문학개량을 제안해 백화문 운동을 열었다. 5·4 시기 「문제를 많이 연구하고 주의(主義)를 적게 말하라」며 마르크스주의로 기운 리다자오·천두슈와 갈라섰다. 베이징대 교수와 총장을 지냈고 항일전쟁기 주미대사로 일했다. 1949년 뒤 미국과 대만에서 활동했으며 대륙에서는 1950년대 그의 사상을 겨냥한 대규모 비판운동이 벌어졌다. 타이베이에서 심장마비로 사망했다.',
            en: 'A philosopher trained under John Dewey in the United States, he proposed literary reform in New Youth in 1917 and launched the vernacular-language movement. In the May Fourth years he urged “more study of problems, less talk of isms”, parting ways with Li Dazhao and Chen Duxiu as they turned to Marxism. He was a professor and later president of Peking University and served as ambassador to the United States during the war with Japan. After 1949 he worked in the United States and Taiwan, while the mainland mounted a mass campaign against his thought in the 1950s. He died of a heart attack in Taipei.',
        },
        fate: { kind: 'natural', label: { ko: '심장마비', en: 'Heart attack' } },
        aliases: { ko: ['호적', '후스즈'], en: ['Hu Shi'] },
        career: [
            { y: '1917–1926', r: { ko: '베이징대학 교수', en: 'Professor at Peking University' } },
            { y: '1938–1942', r: { ko: '주미 중화민국 대사', en: 'Ambassador of the Republic of China to the United States' } },
            { y: '1946–1948', r: { ko: '베이징대학 총장', en: 'President of Peking University' } },
        ],
        sources: [W + 'Hu_Shih', W + 'New_Culture_Movement'], locator: L,
    },
];
