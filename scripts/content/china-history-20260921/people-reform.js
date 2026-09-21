// 개혁개방의 세대 (group china-reform).
const W = 'https://en.wikipedia.org/wiki/';
const L = 'Wikipedia article: lead, biography sections';

module.exports = [
    {
        id: 'hua-guofeng', group: 'china-reform',
        family: { ko: '화', en: 'Hua' }, given: { ko: '궈펑', en: 'Guofeng' }, native: '华国锋',
        years: '1921–2008', role: 'socialist-bloc-leader',
        epithet: { ko: '「네가 일을 맡으면 내가 안심한다」는 마오의 후계자, 4인방을 체포하고 덩샤오핑에게 밀려났다', en: 'Mao’s designated successor — “With you in charge, I am at ease” — who arrested the Gang of Four and was eased out by Deng Xiaoping' },
        bio: {
            ko: '산시 출신으로 후난에서 지방 간부로 일하다 마오의 눈에 들었고, 1976년 1월 저우언라이 사후 총리 대행, 4월 톈안먼 사건 뒤 제1부주석 겸 총리가 되었다. 마오 사후 10월 예젠잉·왕둥싱과 4인방을 체포하고 당 주석·군사위 주석을 겸했다. 「마오 주석의 결정은 모두 지키고 지시는 모두 따른다」는 양개범시로 정통성을 세우려 했으나 1978년 진리 기준 논쟁과 11기 3중전회에서 덩샤오핑에게 주도권을 잃었고 1980~1981년 총리와 당 주석직을 내놓았다. 2002년까지 중앙위원으로 남았다.',
            en: 'From Shanxi, he rose as a provincial cadre in Hunan, caught Mao’s attention, and in 1976 became acting premier after Zhou Enlai’s death in January and first vice-chairman and premier after the April Tiananmen incident. After Mao died he arrested the Gang of Four in October with Ye Jianying and Wang Dongxing and took the party and Military Commission chairmanships. He sought legitimacy in the “two whatevers” — uphold every decision Chairman Mao made, follow every instruction he gave — but lost the initiative to Deng Xiaoping in the 1978 debate on the criterion of truth and at the Third Plenum, giving up the premiership and party chairmanship in 1980–1981. He remained on the Central Committee until 2002.',
        },
        fate: { kind: 'deposed', label: { ko: '퇴임 1981 · 자연사', en: 'Left office 1981 · natural causes' } },
        aliases: { ko: ['화국봉'], en: ['Hua Kuo-feng'] },
        career: [
            { y: '1976–1980', r: { ko: '국무원 총리', en: 'Premier of the State Council' } },
            { y: '1976–1981', r: { ko: '중공 중앙 주석', en: 'Chairman of the Central Committee' } },
        ],
        sources: [W + 'Hua_Guofeng', W + 'Gang_of_Four'], locator: L,
        sections: [{
            slug: 'two-whatevers-and-the-turn-of-1978', sortOrder: 197800,
            heading: { ko: '양개범시와 1978년의 전환', en: 'The two whatevers and the turn of 1978' },
            body: {
                ko: '1977년 2월 『인민일보』 사설이 내건 양개범시는 화궈펑의 권위가 마오의 지명에서 나온다는 사정을 반영했다. 그러나 같은 원칙은 1976년 4월 톈안먼 사건을 「반혁명」으로 규정한 결정과 덩샤오핑의 실각도 유지해야 한다는 뜻이었고, 복권을 요구하는 원로들과 충돌했다. 1978년 5월 「실천은 진리를 검증하는 유일한 기준」이라는 논문이 발표되면서 논쟁은 마오의 권위를 어떻게 다룰지의 문제가 되었다.\n\n그해 11~12월의 중앙공작회의와 11기 3중전회는 톈안먼 사건을 재평가하고 당의 중심을 계급투쟁에서 경제건설로 옮겼다. 화궈펑은 직위를 유지했지만 실권은 덩샤오핑과 천윈에게 넘어갔고, 1980년 자오쯔양이 총리, 1981년 후야오방이 당 주석이 되었다. 1981년 「역사결의」는 화궈펑이 4인방 분쇄에 공을 세웠으나 좌경 오류를 계속했다고 평가했다. 그의 시기는 마오 시대와 개혁기의 접합부로, 대약진식 「양약진」 투자 계획과 개혁의 첫 조치가 겹친다.',
                en: 'The two whatevers, proclaimed in a People’s Daily editorial in February 1977, reflected the fact that Hua’s authority derived from Mao’s nomination. But the same principle meant upholding the verdict that the April 1976 Tiananmen incident was “counter-revolutionary” and keeping Deng Xiaoping out, which collided with the veterans demanding rehabilitation. When the article “Practice is the sole criterion of truth” appeared in May 1978, the debate became one about how to handle Mao’s authority.\n\nThe central work conference and the Third Plenum of November–December 1978 reversed the Tiananmen verdict and moved the party’s focus from class struggle to economic construction. Hua kept his titles, but power passed to Deng Xiaoping and Chen Yun; Zhao Ziyang became premier in 1980 and Hu Yaobang party chairman in 1981. The 1981 “Resolution on History” credited Hua with crushing the Gang of Four while faulting him for continuing leftist errors. His years are the seam between the Mao era and the reforms, where a Great Leap-style “foreign leap” investment plan overlapped with the first reform measures.',
            },
            sources: [W + 'Hua_Guofeng', W + 'Boluan_Fanzheng'],
        }],
    },
    {
        id: 'hu-yaobang', group: 'china-reform',
        family: { ko: '후', en: 'Hu' }, given: { ko: '야오방', en: 'Yaobang' }, native: '胡耀邦',
        years: '1915–1989', role: 'socialist-bloc-reform-leader',
        epithet: { ko: '문화대혁명 피해자의 복권과 사상 해방을 이끈 개혁파 총서기, 그의 죽음이 1989년 시위를 불렀다', en: 'The reformist general secretary who rehabilitated the Cultural Revolution’s victims and freed thought; his death sparked the 1989 protests' },
        bio: {
            ko: '후난 출신으로 열네 살에 소년 홍군이 되어 대장정에 참여했고 건국 후 공산주의청년단을 이끌었다. 문화대혁명에서 박해받았으며 1977년 중앙조직부장으로 수백만 건의 억울한 사건을 재심해 복권시켰고, 1978년 「진리 기준」 논쟁을 조직해 덩샤오핑의 복귀를 뒷받침했다. 1981년 당 주석, 1982년 총서기로 개혁개방을 추진했으나 1986년 말 학생 시위 뒤 「자산계급 자유화」에 관대했다는 이유로 1987년 1월 사임을 강요당했다. 1989년 4월 15일 심장마비로 사망했고 추모 집회가 톈안먼 시위로 번졌다.',
            en: 'From Hunan, he joined the Red Army at fourteen, marched on the Long March and led the Communist Youth League after 1949. Persecuted in the Cultural Revolution, as head of the Organisation Department from 1977 he reviewed and reversed millions of unjust cases and in 1978 organised the “criterion of truth” debate that underpinned Deng Xiaoping’s return. Party chairman in 1981 and general secretary from 1982, he drove reform and opening, but after the student protests of late 1986 he was forced to resign in January 1987 for laxity toward “bourgeois liberalisation”. He died of a heart attack on 15 April 1989, and the mourning gatherings grew into the Tiananmen protests.',
        },
        fate: { kind: 'deposed', label: { ko: '실각 1987 · 심장마비', en: 'Removed 1987 · heart attack' } },
        aliases: { ko: ['호요방'], en: ['Hu Yao-pang'] },
        career: [
            { y: '1977–1978', r: { ko: '중공 중앙 조직부장', en: 'Head of the Central Organisation Department' } },
            { y: '1981–1982', r: { ko: '중공 중앙 주석', en: 'Chairman of the Central Committee' } },
            { y: '1982–1987', r: { ko: '중공 중앙 총서기', en: 'General Secretary of the Central Committee' } },
        ],
        sources: [W + 'Hu_Yaobang', W + '1989_Tiananmen_Square_protests_and_massacre'], locator: L,
    },
    {
        id: 'zhao-ziyang', group: 'china-reform',
        family: { ko: '자오', en: 'Zhao' }, given: { ko: '쯔양', en: 'Ziyang' }, native: '赵紫阳',
        years: '1919–2005', role: 'socialist-bloc-reform-leader',
        epithet: { ko: '쓰촨의 농업개혁에서 총서기까지, 1989년 계엄에 반대해 15년 연금으로 생을 마친 개혁가', en: 'From Sichuan’s farm reforms to general secretary, the reformer who opposed martial law in 1989 and died under house arrest' },
        bio: {
            ko: '허난 출신으로 광둥의 지방 간부였다가 문화대혁명에서 실각했고, 1975년 쓰촨 제1서기로 복귀해 농가생산책임제와 기업 자율화 실험으로 「먹으려면 자오쯔양을 찾으라」는 말을 낳았다. 1980년 총리, 1987년 총서기가 되어 가격개혁과 정치체제 개혁 구상을 추진했다. 1989년 5월 학생 시위에 대한 계엄에 반대해 광장에서 학생들에게 「우리는 너무 늦게 왔다」고 말한 뒤 실각했고, 이후 2005년 죽을 때까지 베이징 자택에 연금되었다. 몰래 녹음한 회고록이 사후 홍콩에서 출간되었다.',
            en: 'From Henan, he was a provincial cadre in Guangdong until purged in the Cultural Revolution, returned as Sichuan first secretary in 1975 and, with household contracting and enterprise autonomy, earned the saying “If you want to eat, look for Ziyang”. Premier from 1980 and general secretary from 1987, he pushed price reform and plans for political reform. In May 1989 he opposed martial law against the student protests, told students in the square “We have come too late”, and fell; he remained under house arrest in Beijing until his death in 2005. His secretly recorded memoirs were published posthumously in Hong Kong.',
        },
        fate: { kind: 'deposed', label: { ko: '실각 1989 · 연금 중 사망', en: 'Removed 1989 · died under house arrest' } },
        aliases: { ko: ['조자양'], en: ['Chao Tzu-yang'] },
        career: [
            { y: '1975–1980', r: { ko: '쓰촨성 당위원회 제1서기', en: 'First Secretary of the Sichuan Party Committee' } },
            { y: '1980–1987', r: { ko: '국무원 총리', en: 'Premier of the State Council' } },
            { y: '1987–1989', r: { ko: '중공 중앙 총서기', en: 'General Secretary of the Central Committee' } },
        ],
        sources: [W + 'Zhao_Ziyang', W + '1989_Tiananmen_Square_protests_and_massacre'], locator: L,
        sections: [{
            slug: 'may-1989', sortOrder: 198905,
            heading: { ko: '1989년 5월: 계엄 반대와 실각', en: 'May 1989: opposing martial law and the fall' },
            body: {
                ko: '후야오방 추모에서 시작된 시위가 4월 26일 『인민일보』 사설로 「동란」으로 규정되자 자오쯔양은 5월 4일 아시아개발은행 연설에서 학생들의 요구가 애국적이라며 대화를 제안해 강경파와 갈라섰다. 고르바초프 방중 기간 단식 시위가 확대되는 가운데 5월 17일 덩샤오핑 자택 회의는 계엄을 결정했고, 자오쯔양은 이에 반대하며 사직 의사를 밝혔다.\n\n5월 19일 새벽 그는 원자바오와 함께 광장을 찾아 학생들에게 「우리는 너무 늦게 왔다」고 말했고, 이것이 마지막 공개 출현이 되었다. 6월 4일 진압 뒤 6월 하순의 4중전회는 그를 「동란 지지와 당 분열」로 총서기와 정치국 상무위원에서 해임했다. 그는 당적은 유지한 채 기소 없이 연금되었고, 2000년대 초까지 이어진 연금 기록과 회고록은 지도부 결정 과정에 관한 드문 내부 증언으로 남았다.',
                en: 'When the protests that began as mourning for Hu Yaobang were branded “turmoil” by the People’s Daily editorial of 26 April, Zhao broke with the hardliners in his 4 May speech to the Asian Development Bank, calling the students’ demands patriotic and proposing dialogue. As hunger strikes spread during Gorbachev’s visit, a meeting at Deng Xiaoping’s home on 17 May decided on martial law; Zhao opposed it and offered to resign.\n\nBefore dawn on 19 May he went to the square with Wen Jiabao and told the students “We have come too late” — his last public appearance. After the crackdown of 4 June, the Fourth Plenum in late June removed him as general secretary and from the Politburo Standing Committee for “supporting the turmoil and splitting the party”. He kept his party membership but was confined without charge, and his account of the confinement and the leadership’s decisions remains a rare insider testimony.',
            },
            sources: [W + 'Zhao_Ziyang', W + '1989_Tiananmen_Square_protests_and_massacre'],
        }],
    },
    {
        id: 'wan-li', group: 'china-reform',
        family: { ko: '완', en: 'Wan' }, given: { ko: '리', en: 'Li' }, native: '万里',
        years: '1916–2015', role: 'socialist-bloc-reform-leader',
        epithet: { ko: '「쌀을 먹으려면 완리를 찾으라」 — 안후이에서 농가생산책임제를 허용한 개혁의 선구자', en: '“If you want rice, look for Wan Li” — the reform pioneer who let Anhui’s peasants contract land to households' },
        bio: {
            ko: '산둥 출신으로 건국 후 베이징 부시장으로 인민대회당 등 「10대 건축」을 지휘했고 문화대혁명에서 박해받았다. 1977년 안후이 제1서기로 부임해 기근에 시달리던 농촌에서 샤오강촌의 비밀 토지 분배를 묵인하고 「성위 6조」로 농가생산책임제를 허용해 개혁의 출발점을 만들었다. 1980년 부총리로 전국 농업을 맡아 인민공사를 해체했고 1988~1993년 전국인민대표대회 상무위원장을 지냈다. 1989년 5월 해외 순방 중 귀국해 계엄을 지지했다. 2015년 99세로 사망했다.',
            en: 'From Shandong, he was vice-mayor of Beijing after 1949, directing the “ten great buildings” including the Great Hall of the People, and was persecuted in the Cultural Revolution. Appointed Anhui first secretary in 1977, he tolerated the secret land division at Xiaogang village and with the provincial “six articles” allowed household contracting in the famine-stricken countryside, the starting point of rural reform. As vice-premier for agriculture from 1980 he dismantled the people’s communes, and he chaired the National People’s Congress Standing Committee from 1988 to 1993. Returning from abroad in May 1989, he endorsed martial law. He died in 2015 at 99.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['만리'], en: ['Wan Li'] },
        career: [
            { y: '1977–1980', r: { ko: '안후이성 당위원회 제1서기', en: 'First Secretary of the Anhui Party Committee' } },
            { y: '1988–1993', r: { ko: '전국인민대표대회 상무위원회 위원장', en: 'Chairman of the NPC Standing Committee' } },
        ],
        sources: [W + 'Wan_Li', W + 'Household_responsibility_system'], locator: L,
    },
    {
        id: 'xi-zhongxun', group: 'china-reform',
        family: { ko: '시', en: 'Xi' }, given: { ko: '중쉰', en: 'Zhongxun' }, native: '习仲勋',
        years: '1913–2002', role: 'socialist-bloc-reform-leader',
        epithet: { ko: '산베이 근거지의 창건자, 16년 실각 뒤 광둥에서 경제특구를 열어 낸 개혁가', en: 'A founder of the northern Shaanxi base, purged for sixteen years, who opened Guangdong’s special economic zones' },
        bio: {
            ko: '산시 출신으로 류즈단과 함께 산간 근거지를 세워 대장정의 종착지를 마련했다. 건국 후 서북국 서기와 국무원 비서장·부총리를 지냈으나 1962년 소설 『류즈단』이 가오강을 옹호한 「반당」 작품이라는 캉성의 고발로 실각해 16년 동안 감금·하방되었다. 1978년 광둥 제1서기로 복귀해 홍콩 탈출 문제의 해법으로 중앙에 「선행일보(先行一步)」의 권한을 요구했고, 이는 1980년 선전·주하이·산터우 경제특구로 이어졌다. 1980년대 서기처 서기로 후야오방을 지지했으며 1987년 그의 해임에 반대했다. 시진핑의 아버지다.',
            en: 'From Shaanxi, he founded the Shaanxi–Gansu base with Liu Zhidan, the destination of the Long March. After 1949 he headed the Northwest Bureau and served as State Council secretary-general and vice-premier, but in 1962 Kang Sheng denounced the novel Liu Zhidan as an “anti-party” defence of Gao Gang and Xi was purged, spending sixteen years in confinement and rural exile. Returning as Guangdong first secretary in 1978, he asked the centre for the power to “take one step ahead” to stem the flight to Hong Kong, which led to the Shenzhen, Zhuhai and Shantou special economic zones in 1980. A Secretariat member in the 1980s, he supported Hu Yaobang and opposed his removal in 1987. He was Xi Jinping’s father.',
        },
        fate: { kind: 'deposed', label: { ko: '실각 1962 · 자연사', en: 'Removed 1962 · natural causes' } },
        aliases: { ko: ['습중훈'], en: ['Hsi Chung-hsun'] },
        career: [
            { y: '1959–1962', r: { ko: '국무원 부총리 겸 비서장', en: 'Vice-Premier and Secretary-General of the State Council' } },
            { y: '1978–1980', r: { ko: '광둥성 당위원회 제1서기', en: 'First Secretary of the Guangdong Party Committee' } },
        ],
        sources: [W + 'Xi_Zhongxun', W + 'Special_economic_zones_of_China'], locator: L,
    },
    {
        id: 'bo-yibo', group: 'china-reform',
        family: { ko: '보', en: 'Bo' }, given: { ko: '이보', en: 'Yibo' }, native: '薄一波',
        years: '1908–2007', role: 'socialist-bloc-leader',
        epithet: { ko: '초대 재정부장이자 「61인 반도 사건」의 당사자, 개혁기에 보수적 원로로 돌아온 인물', en: 'First finance minister and central figure of the “61 renegades” case, who returned in the reform era as a conservative elder' },
        bio: {
            ko: '산시 출신으로 1936년 당의 지시로 국민당 감옥에서 「전향서」에 서명하고 출옥한 61명 중 한 사람이었고, 이 일은 문화대혁명에서 「61인 반도 집단」 사건으로 되살아나 그를 12년 감금으로 몰았다. 건국 후 초대 재정부장으로 세제와 통화 통일을 맡았고 1953년 「신세제」 논란으로 마오의 비판을 받았다. 1979년 복귀해 부총리와 중앙고문위원회 부주임으로 「팔대 원로」의 한 사람이 되어 1987년 후야오방 해임 회의를 주재했다. 2007년 98세로 사망했으며 아들이 보시라이다.',
            en: 'From Shanxi, he was one of the 61 men who on party orders signed “recantations” to leave a Kuomintang prison in 1936, an episode revived in the Cultural Revolution as the “61 renegades” case that kept him confined for twelve years. As the first finance minister after 1949 he unified taxation and currency and was criticised by Mao in the 1953 “new tax system” affair. Returning in 1979 as vice-premier and vice-chairman of the Central Advisory Commission, he was one of the “eight elders” and chaired the meeting that removed Hu Yaobang in 1987. He died in 2007 at 98; Bo Xilai is his son.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['박일파'], en: ['Po I-po'] },
        career: [
            { y: '1949–1953', r: { ko: '재정부장', en: 'Minister of Finance' } },
            { y: '1982–1992', r: { ko: '중앙고문위원회 부주임', en: 'Vice-Chairman of the Central Advisory Commission' } },
        ],
        sources: [W + 'Bo_Yibo'], locator: L,
    },
    {
        id: 'jiang-zemin', group: 'china-reform',
        family: { ko: '장', en: 'Jiang' }, given: { ko: '쩌민', en: 'Zemin' }, native: '江泽民',
        years: '1926–2022', role: 'socialist-bloc-leader',
        epithet: { ko: '1989년 상하이에서 발탁된 「핵심」, 톈안먼 이후의 중국을 시장경제와 「3개 대표」로 이끈 총서기', en: 'The “core” plucked from Shanghai in 1989 who led post-Tiananmen China into the market economy and the “Three Represents”' },
        bio: {
            ko: '장쑤 출신 전기공학자로 소련 자동차공장에서 연수했고 1985년 상하이 시장, 1987년 상하이 서기가 되었다. 1989년 시위 때 상하이의 자유주의 신문 『세계경제도보』를 폐간하고 시위를 큰 유혈 없이 수습해 6월 자오쯔양 대신 총서기로 발탁되었다. 1992년 덩샤오핑의 남순강화 뒤 「사회주의 시장경제」를 당의 목표로 삼았고 국유기업 개혁과 WTO 가입, 홍콩 반환을 이끌었다. 2002년 총서기, 2004년 군사위 주석에서 물러나며 「3개 대표」론으로 자본가의 입당을 열었다. 2022년 백혈병으로 사망했다.',
            en: 'An electrical engineer from Jiangsu who trained at a Soviet car plant, he became mayor of Shanghai in 1985 and its party secretary in 1987. In 1989 he closed the liberal World Economic Herald and defused the Shanghai protests without major bloodshed, and in June was chosen to replace Zhao Ziyang as general secretary. After Deng Xiaoping’s southern tour in 1992 he made the “socialist market economy” the party’s goal and oversaw state-enterprise reform, WTO accession and the return of Hong Kong. Stepping down as general secretary in 2002 and Military Commission chairman in 2004, he left the “Three Represents”, which opened the party to private entrepreneurs. He died of leukaemia in 2022.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['강택민'], en: ['Chiang Tse-min'] },
        career: [
            { y: '1989–2002', r: { ko: '중공 중앙 총서기', en: 'General Secretary of the Central Committee' } },
            { y: '1993–2003', r: { ko: '중화인민공화국 주석', en: 'President of the People’s Republic of China' } },
        ],
        sources: [W + 'Jiang_Zemin', W + '1989_Tiananmen_Square_protests_and_massacre'], locator: L,
    },
    {
        id: 'li-peng', group: 'china-reform',
        family: { ko: '리', en: 'Li' }, given: { ko: '펑', en: 'Peng' }, native: '李鹏',
        years: '1928–2019', role: 'socialist-bloc-leader',
        epithet: { ko: '1989년 5월 계엄을 선포한 총리, 「베이징의 도살자」라 불린 저우언라이의 양자', en: 'The premier who declared martial law in May 1989, called “the butcher of Beijing”; Zhou Enlai’s ward' },
        bio: {
            ko: '쓰촨 출신으로 아버지가 1931년 국민당에게 처형된 뒤 저우언라이 부부의 보호 아래 자랐다. 모스크바 동력학원에서 수력발전을 배워 전력 관료로 성장했고 1987년 자오쯔양의 뒤를 이어 총리가 되었다. 1989년 5월 18일 학생 대표들과의 텔레비전 대화가 결렬된 뒤 5월 20일 베이징 계엄을 선포했고 6월 4일 진압의 정부 측 책임자가 되었다. 총리 재임 중 삼협댐 건설을 밀어붙였고 1998~2003년 전국인민대표대회 상무위원장을 지냈다. 2019년 사망했다.',
            en: 'From Sichuan, he was raised under the protection of Zhou Enlai and his wife after the Nationalists executed his father in 1931. Trained in hydroelectric engineering at the Moscow Power Institute, he rose through the electricity ministry and succeeded Zhao Ziyang as premier in 1987. After the televised dialogue with student representatives collapsed on 18 May 1989 he declared martial law in Beijing on 20 May and was the government’s responsible official for the crackdown of 4 June. As premier he pushed through the Three Gorges Dam, and he chaired the National People’s Congress Standing Committee from 1998 to 2003. He died in 2019.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['이붕'], en: ['Li P’eng'] },
        career: [
            { y: '1987–1998', r: { ko: '국무원 총리', en: 'Premier of the State Council' } },
            { y: '1998–2003', r: { ko: '전국인민대표대회 상무위원회 위원장', en: 'Chairman of the NPC Standing Committee' } },
        ],
        sources: [W + 'Li_Peng', W + '1989_Tiananmen_Square_protests_and_massacre'], locator: L,
    },
    {
        id: 'wei-jingsheng', group: 'china-reform',
        family: { ko: '웨이', en: 'Wei' }, given: { ko: '징성', en: 'Jingsheng' }, native: '魏京生',
        years: '1950–', role: 'theorist',
        epithet: { ko: '민주의 벽에 「제5의 현대화」를 붙인 전기공, 18년 옥살이 뒤 추방된 민주운동의 상징', en: 'The electrician who pasted “The Fifth Modernisation” on Democracy Wall, deported after eighteen years in prison' },
        bio: {
            ko: '베이징의 고급 간부 집안에서 자라 홍위병으로 지방을 떠돌며 기근의 흔적을 본 뒤 동물원 전기공이 되었다. 1978년 12월 시단 민주의 벽에 「제5의 현대화 — 민주」를 붙여 덩샤오핑의 4개 현대화가 민주 없이는 공허하다고 주장했고 잡지 『탐색』을 냈다. 1979년 3월 체포되어 「반혁명 선전과 군사기밀 누설」로 15년형을 받았으며, 1993년 석방 뒤 다시 체포되어 14년형을 받았다. 1997년 병 치료를 이유로 미국으로 추방되어 망명 민주운동을 이어가고 있다.',
            en: 'Raised in a senior-cadre family in Beijing, he wandered the countryside as a Red Guard and saw the traces of famine before becoming an electrician at the Beijing Zoo. In December 1978 he pasted “The Fifth Modernisation — Democracy” on the Xidan Democracy Wall, arguing that Deng Xiaoping’s four modernisations were hollow without democracy, and published the journal Explorations. Arrested in March 1979, he received fifteen years for “counter-revolutionary propaganda and leaking military secrets”; released in 1993, he was rearrested and sentenced to fourteen more. Deported to the United States on medical grounds in 1997, he continues the democracy movement in exile.',
        },
        aliases: { ko: ['위경생'], en: ['Wei Jing-sheng'] },
        career: [
            { y: '1978–1979', r: { ko: '민주의 벽 운동 · 잡지 『탐색』 편집', en: 'Democracy Wall activist and editor of Explorations' } },
        ],
        sources: [W + 'Wei_Jingsheng', W + 'Democracy_Wall'], locator: L,
    },
    {
        id: 'fang-lizhi', group: 'china-reform',
        family: { ko: '팡', en: 'Fang' }, given: { ko: '리즈', en: 'Lizhi' }, native: '方励之',
        years: '1936–2012', role: 'scholar',
        epithet: { ko: '「중국의 사하로프」, 1986년 학생 시위와 1989년 미국 대사관 피신으로 알려진 천체물리학자', en: '“China’s Sakharov”, the astrophysicist known for the 1986 student protests and his 1989 refuge in the US embassy' },
        bio: {
            ko: '베이징 출신 천체물리학자로 1957년 우파로 몰렸다가 복권되어 중국과학기술대학 부총장이 되었다. 1986년 강연에서 마르크스주의의 과학적 권위와 당의 지도를 공개 비판해 그해 말 학생 시위의 정신적 지주로 지목되었고, 1987년 당적 박탈과 함께 후야오방 실각의 빌미가 되었다. 1989년 1월 덩샤오핑에게 웨이징성 석방을 청원하는 공개서한을 보냈고, 6월 4일 진압 뒤 아내 리수셴과 미국 대사관에 피신해 13개월을 보낸 뒤 출국이 허용되었다. 애리조나대학 교수로 지내다 2012년 사망했다.',
            en: 'An astrophysicist from Beijing, labelled a rightist in 1957 and later rehabilitated, he became vice-president of the University of Science and Technology of China. In 1986 lectures he openly questioned Marxism’s scientific authority and party leadership, was named the spiritual guide of that winter’s student protests, and in 1987 was expelled from the party — a pretext for Hu Yaobang’s fall. In January 1989 he wrote an open letter to Deng Xiaoping asking for Wei Jingsheng’s release; after the crackdown of 4 June he and his wife Li Shuxian took refuge in the US embassy for thirteen months before being allowed to leave. He taught at the University of Arizona and died in 2012.',
        },
        fate: { kind: 'exile', label: { ko: '망명 1990 · 자연사', en: 'Exile 1990 · natural causes' } },
        aliases: { ko: ['방려지'], en: ['Fang Li-chih'] },
        career: [
            { y: '1984–1987', r: { ko: '중국과학기술대학 부총장', en: 'Vice-President of the University of Science and Technology of China' } },
        ],
        sources: [W + 'Fang_Lizhi', W + '1989_Tiananmen_Square_protests_and_massacre'], locator: L,
    },
];
