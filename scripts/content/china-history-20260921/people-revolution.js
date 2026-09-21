// 중국 혁명 세대 (group china-revolution) and the Comintern adviser who
// travelled with them (Otto Braun stays in international-revolutionary).
const W = 'https://en.wikipedia.org/wiki/';
const L = 'Wikipedia article: lead, biography sections';

module.exports = [
    {
        id: 'sun-yat-sen', group: 'china-revolution',
        family: { ko: '쑨', en: 'Sun' }, given: { ko: '원', en: 'Yat-sen' }, native: '孙中山',
        years: '1866–1925', role: 'non-soviet-revolutionary',
        epithet: { ko: '중화민국의 「국부」, 삼민주의와 제1차 국공합작을 설계한 혁명가', en: 'Founding father of the Republic of China who framed the Three Principles of the People and the first united front' },
        bio: {
            ko: '광둥 출신으로 하와이와 홍콩에서 교육받고 의사가 되었다. 1894년 흥중회, 1905년 도쿄에서 동맹회를 조직해 청 타도와 공화국 수립을 내걸었고, 1911년 신해혁명 뒤 중화민국 임시대총통이 되었으나 곧 위안스카이에게 자리를 넘겼다. 민족·민권·민생의 삼민주의를 제창했으며 1923년 소련의 요페와 공동선언을 내고 소련의 원조와 공산당원의 개인 자격 입당을 받아들여 제1차 국공합작을 열었다. 1925년 베이징에서 간암으로 사망했고, 국민당과 공산당이 모두 그의 유산을 주장했다.',
            en: 'Born in Guangdong and educated in Hawaii and Hong Kong, he trained as a physician. He founded the Revive China Society in 1894 and the Tongmenghui in Tokyo in 1905 to overthrow the Qing and build a republic; after the 1911 revolution he became provisional president but soon yielded to Yuan Shikai. He formulated the Three Principles of the People (nationalism, democracy, people’s livelihood) and in 1923, after a joint statement with the Soviet envoy Joffe, accepted Soviet aid and Communist members joining the Kuomintang as individuals, opening the first united front. He died of liver cancer in Beijing in 1925; both Nationalists and Communists claimed his legacy.',
        },
        fate: { kind: 'natural', label: { ko: '간암', en: 'Liver cancer' } },
        aliases: { ko: ['손문', '쑨중산', '손중산'], en: ['Sun Zhongshan', 'Sun Wen'] },
        career: [
            { y: '1905–1912', r: { ko: '중국동맹회 총리', en: 'Leader of the Tongmenghui' } },
            { y: '1912.01–03', r: { ko: '중화민국 임시대총통', en: 'Provisional President of the Republic of China' } },
            { y: '1919–1925', r: { ko: '중국국민당 총리', en: 'Leader of the Kuomintang' } },
        ],
        sources: [W + 'Sun_Yat-sen', W + 'First_United_Front'], locator: L,
        sections: [{
            slug: 'three-principles-and-united-front', sortOrder: 192301,
            heading: { ko: '삼민주의와 소련과의 제휴', en: 'The Three Principles and the alliance with Moscow' },
            body: {
                ko: '쑨원의 삼민주의는 민족(만주족 지배와 열강으로부터의 독립), 민권(공화제와 인민의 정치적 권리), 민생(토지 소유의 균등과 자본의 절제)으로 이루어졌다. 1924년 광저우 강연에서 그는 민생주의가 공산주의와 목표를 공유한다고 말했지만, 계급투쟁이 아니라 국가가 주도하는 점진적 개혁을 방법으로 삼았다.\n\n서방 열강의 지원을 얻지 못한 쑨원은 1923년 1월 소련 대표 요페와 공동선언을 발표했다. 선언은 소비에트 제도가 중국에 적용될 수 없다고 명시하면서도 소련의 지원을 약속했고, 이어 보로딘이 고문으로 와 국민당을 볼셰비키식 대중정당으로 개조했다. 황푸군관학교 설립과 공산당원의 개인 자격 입당은 이 제휴의 산물이었으며, 그의 사후 이 구도를 어떻게 해석할지가 국민당 좌우파와 공산당의 분열선이 되었다.',
                en: 'Sun’s Three Principles were nationalism (independence from Manchu rule and the foreign powers), democracy (a republic and the people’s political rights) and people’s livelihood (equalisation of land ownership and restraint of capital). In his 1924 Guangzhou lectures he said the livelihood principle shared its aims with communism, but his method was gradual, state-led reform rather than class struggle.\n\nUnable to win support from the Western powers, Sun issued a joint statement with the Soviet envoy Adolph Joffe in January 1923. It declared that the Soviet system could not be applied to China yet promised Soviet help; Borodin then arrived as adviser and rebuilt the Kuomintang as a Bolshevik-style mass party. The Whampoa Military Academy and the admission of Communists as individual members were products of this alliance, and after his death the question of how to read that arrangement became the dividing line between the Kuomintang’s left and right and the Communists.',
            },
            sources: [W + 'Sun_Yat-sen', W + 'First_United_Front'],
        }],
    },
    {
        id: 'song-qingling', group: 'china-revolution',
        family: { ko: '쑹', en: 'Soong' }, given: { ko: '칭링', en: 'Ching-ling' }, native: '宋庆龄',
        years: '1893–1981', role: 'prc-government',
        epithet: { ko: '쑨원의 부인으로 국민당 좌파에 남아 인민공화국의 국가부주석이 된 인물', en: 'Sun Yat-sen’s widow who stayed with the Kuomintang left and became a vice-chair of the People’s Republic' },
        bio: {
            ko: '상하이의 부유한 기독교 집안 쑹씨 세 자매의 둘째로, 1915년 쑨원과 결혼했다. 1927년 장제스의 반공 정변에 반대해 국민당 좌파의 상징이 되었고 모스크바로 갔다가 1930년대 상하이에서 민권보장동맹을 이끌었다. 항일전쟁기 홍콩에서 보위중국동맹을 조직해 공산당 근거지에 물자를 보냈다. 1949년 인민공화국의 중앙인민정부 부주석이 되었고 1981년 사망 직전 공산당에 입당해 명예국가주석 칭호를 받았다. 동생 쑹메이링은 장제스의 부인이었다.',
            en: 'The second of the three Soong sisters of a wealthy Christian Shanghai family, she married Sun Yat-sen in 1915. Opposing Chiang Kai-shek’s anti-Communist coup in 1927 she became the symbol of the Kuomintang left, went to Moscow, and in the 1930s led the China League for Civil Rights in Shanghai. During the war with Japan she organised the China Defence League in Hong Kong to supply the Communist base areas. In 1949 she became a vice-chair of the Central People’s Government; shortly before her death in 1981 she joined the Communist Party and was named honorary president. Her younger sister Soong Mei-ling was Chiang Kai-shek’s wife.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['송경령', '쑹칭링'], en: ['Song Qingling', 'Madame Sun Yat-sen'] },
        career: [
            { y: '1949–1954', r: { ko: '중앙인민정부 부주석', en: 'Vice-Chair of the Central People’s Government' } },
            { y: '1959–1975', r: { ko: '중화인민공화국 부주석', en: 'Vice-President of the People’s Republic of China' } },
        ],
        sources: [W + 'Soong_Ching-ling'], locator: L,
    },
    {
        id: 'li-lisan', group: 'china-revolution',
        family: { ko: '리', en: 'Li' }, given: { ko: '리싼', en: 'Lisan' }, native: '李立三',
        years: '1899–1967', role: 'ccp-leadership',
        epithet: { ko: '1930년 도시 봉기 노선 「리리싼 노선」으로 당을 이끌다 실각한 노동운동 지도자', en: 'Labour organiser whose 1930 urban-insurrection “Li Lisan line” led the party and cost him his position' },
        bio: {
            ko: '후난 출신으로 프랑스 근공검학 시절 입당했고 1922년 안위안 탄광 파업, 1925년 5·30 운동의 조직자였다. 1928년 이후 당 중앙의 실권을 쥐고 1930년 혁명의 고조가 왔다며 창사·우한 등 대도시 공격을 명령했으나 실패했고, 코민테른의 비판으로 실각해 모스크바로 소환되었다. 15년 동안 소련에 머물며 소련인 아내를 맞았고 1946년 귀국해 노동부장을 지냈다. 문화대혁명 초기 박해 속에 1967년 자살했으며 1980년 복권되었다.',
            en: 'From Hunan, he joined the party while a work-study student in France and organised the Anyuan miners’ strike of 1922 and the May Thirtieth Movement of 1925. From 1928 he held effective control of the Central Committee and in 1930, declaring a revolutionary high tide, ordered attacks on Changsha, Wuhan and other cities that failed; condemned by the Comintern, he was removed and summoned to Moscow, where he stayed fifteen years and married a Soviet wife. He returned in 1946 and served as labour minister. Persecuted early in the Cultural Revolution, he killed himself in 1967 and was rehabilitated in 1980.',
        },
        fate: { kind: 'suicide', label: { ko: '실각 1930 · 자살', en: 'Removed 1930 · suicide' } },
        aliases: { ko: ['이립삼'], en: ['Li Li-san'] },
        career: [
            { y: '1928–1930', r: { ko: '중공 중앙 선전부장 · 실질적 지도자', en: 'Head of propaganda and de facto party leader' } },
            { y: '1949–1954', r: { ko: '노동부장', en: 'Minister of Labour' } },
        ],
        sources: [W + 'Li_Lisan'], locator: L,
    },
    {
        id: 'zhang-guotao', group: 'china-revolution',
        family: { ko: '장', en: 'Zhang' }, given: { ko: '궈타오', en: 'Guotao' }, native: '张国焘',
        years: '1897–1979', role: 'ccp-leadership',
        epithet: { ko: '창당 대회 의장에서 대장정 중 마오와 결별해 국민당으로 간 홍군 지도자', en: 'Chair of the founding congress who split with Mao on the Long March and defected to the Nationalists' },
        bio: {
            ko: '베이징대 학생으로 5·4 운동에 앞장섰고 1921년 제1차 당대회를 주재했다. 노동운동을 조직하다 1931년 어위완 소비에트로 가 제4방면군의 정치적 지도자가 되었고, 1935년 대장정 중 쓰촨에서 마오의 중앙홍군과 합류했다. 북상 대 서진을 놓고 마오와 대립해 별도의 「중앙」을 세우고 남하했으나 병력을 잃고 1936년 옌안에 합류했다. 1937년 비판을 받은 뒤 1938년 국민당 지역으로 탈출해 당에서 제명되었고, 만년에 홍콩과 캐나다에서 회고록을 썼다. 토론토에서 사망했다.',
            en: 'A Peking University student leader in May Fourth, he chaired the party’s founding congress in 1921. After years of labour organising he went to the Eyuwan Soviet in 1931 and became political leader of the Fourth Front Army, which met Mao’s Central Red Army in Sichuan on the Long March in 1935. Clashing with Mao over marching north or west, he set up a rival “centre” and turned south, lost much of his army, and rejoined at Yan’an in 1936. Criticised in 1937, he fled to the Nationalist zone in 1938 and was expelled; he later wrote his memoirs in Hong Kong and Canada and died in Toronto.',
        },
        fate: { kind: 'deposed', label: { ko: '실각 1938 · 자연사', en: 'Removed 1938 · natural causes' } },
        aliases: { ko: ['장국도'], en: ['Chang Kuo-tao'] },
        career: [
            { y: '1921', r: { ko: '중국공산당 제1차 전국대표대회 의장', en: 'Chairman of the First Party Congress' } },
            { y: '1931–1935', r: { ko: '어위완 소비에트 · 제4방면군 지도자', en: 'Leader of the Eyuwan Soviet and the Fourth Front Army' } },
        ],
        sources: [W + 'Zhang_Guotao', W + 'Long_March'], locator: L,
    },
    {
        id: 'zhang-wentian', group: 'china-revolution',
        family: { ko: '장', en: 'Zhang' }, given: { ko: '원톈', en: 'Wentian' }, native: '张闻天',
        years: '1900–1976', role: 'ccp-leadership',
        epithet: { ko: '쭌이 회의 뒤 총서기를 맡은 「28인의 볼셰비키」, 1959년 루산에서 펑더화이 편에 섰다', en: 'A “28 Bolsheviks” returnee who became general secretary after Zunyi and sided with Peng Dehuai at Lushan in 1959' },
        bio: {
            ko: '모스크바 중산대학 출신으로 「28인의 볼셰비키」의 한 사람이었으나 1935년 쭌이 회의에서 보구 대신 마오를 지지해 당 총서기(총부책)를 맡았다. 옌안에서 선전·이론 부문을 이끌었고 정풍운동 이후 마오에게 실권을 넘겼다. 건국 후 주소련 대사와 외교부 부부장을 지냈으며 1959년 루산 회의에서 대약진을 비판해 펑더화이와 함께 「반당집단」으로 몰려 실각했다. 문화대혁명기 유배지에서 1976년 심장병으로 사망했고 1979년 복권되었다.',
            en: 'A Sun Yat-sen University graduate counted among the “28 Bolsheviks”, he backed Mao against Bo Gu at the Zunyi Conference in 1935 and became the party’s general secretary. He led propaganda and theory at Yan’an and ceded real power to Mao after the rectification movement. After 1949 he was ambassador to Moscow and vice-minister of foreign affairs; at the 1959 Lushan Conference he criticised the Great Leap and was purged with Peng Dehuai as an “anti-party clique”. Exiled during the Cultural Revolution, he died of heart disease in 1976 and was rehabilitated in 1979.',
        },
        fate: { kind: 'deposed', label: { ko: '실각 1959 · 심장마비', en: 'Removed 1959 · heart attack' } },
        aliases: { ko: ['뤄푸', '장문천'], en: ['Luo Fu', 'Chang Wen-tien'] },
        career: [
            { y: '1935–1943', r: { ko: '중공 중앙 총서기', en: 'General Secretary of the Central Committee' } },
            { y: '1951–1955', r: { ko: '주소련 대사', en: 'Ambassador to the Soviet Union' } },
            { y: '1954–1959', r: { ko: '외교부 부부장', en: 'Vice-Minister of Foreign Affairs' } },
        ],
        sources: [W + 'Zhang_Wentian', W + 'Lushan_Conference'], locator: L,
    },
    {
        id: 'ren-bishi', group: 'china-revolution',
        family: { ko: '런', en: 'Ren' }, given: { ko: '비스', en: 'Bishi' }, native: '任弼时',
        years: '1904–1950', role: 'ccp-leadership',
        epithet: { ko: '옌안 시기 「5대 서기」의 한 사람이었던 조직가, 건국 이듬해 요절했다', en: 'The organiser among Yan’an’s five secretaries, dead a year after the People’s Republic was founded' },
        bio: {
            ko: '후난 출신으로 모스크바 동방노력자공산대학에서 배우고 공산주의청년단을 이끌었다. 대장정 때 허룽과 함께 제2방면군을 지휘했고 1938년 코민테른 주재 중공 대표로 마오의 지도권을 인정받는 데 기여했다. 1943년부터 중앙서기처 서기로 당 조직과 재정을 맡아 마오·류사오치·저우언라이·주더와 함께 「5대 서기」로 불렸다. 1949년 건국 후 병세가 악화되어 1950년 뇌출혈로 46세에 사망했다.',
            en: 'From Hunan, he studied at the Communist University of the Toilers of the East in Moscow and led the Communist Youth League. On the Long March he commanded the Second Front Army with He Long, and as the party’s delegate to the Comintern in 1938 he helped win recognition of Mao’s leadership. From 1943 he ran party organisation and finance as a Secretariat member, one of the “five secretaries” with Mao, Liu Shaoqi, Zhou Enlai and Zhu De. His health failed after 1949 and he died of a cerebral haemorrhage in 1950 at 46.',
        },
        fate: { kind: 'natural', label: { ko: '뇌출혈', en: 'Cerebral haemorrhage' } },
        aliases: { ko: ['임필시'], en: ['Jen Pi-shih'] },
        career: [
            { y: '1938–1940', r: { ko: '코민테른 주재 중공 대표', en: 'Party delegate to the Comintern' } },
            { y: '1943–1950', r: { ko: '중앙서기처 서기', en: 'Member of the Central Secretariat' } },
        ],
        sources: [W + 'Ren_Bishi'], locator: L,
    },
    {
        id: 'lu-xun', group: 'china-revolution',
        family: { ko: '루', en: 'Lu' }, given: { ko: '쉰', en: 'Xun' }, native: '鲁迅',
        years: '1881–1936', role: 'writer-artist',
        epithet: { ko: '『아Q정전』의 작가, 신문화운동의 비판정신을 좌익작가연맹으로 이어 간 중국 현대문학의 아버지', en: 'Author of The True Story of Ah Q, father of modern Chinese literature who carried May Fourth’s critical spirit into the left-wing league' },
        bio: {
            ko: '저장 사오싱 출신으로 일본에서 의학을 배우다 「국민의 정신을 고치겠다」며 문학으로 돌아섰다. 1918년 『신청년』에 발표한 「광인일기」는 최초의 백화 단편으로, 이어 「아Q정전」에서 낡은 사회의 정신적 노예상태를 그렸다. 1927년 이후 상하이에서 마르크스주의 문예이론을 번역하고 1930년 좌익작가연맹의 정신적 지도자가 되었으나 공산당원은 아니었다. 1936년 결핵으로 사망했으며 마오는 그를 「중국 문화혁명의 주장(主將)」이라 불렀다.',
            en: 'Born in Shaoxing, Zhejiang, he abandoned medical studies in Japan to “cure the spirit” of his people through literature. “Diary of a Madman”, published in New Youth in 1918, was the first vernacular short story; “The True Story of Ah Q” anatomised the spiritual servitude of the old society. After 1927 he translated Marxist literary theory in Shanghai and in 1930 became the guiding figure of the League of Left-Wing Writers, though never a party member. He died of tuberculosis in 1936; Mao later called him the “chief commander of China’s cultural revolution”.',
        },
        fate: { kind: 'natural', label: { ko: '결핵', en: 'Tuberculosis' } },
        aliases: { ko: ['노신', '저우수런'], en: ['Zhou Shuren', 'Lu Hsun'] },
        career: [
            { y: '1920–1926', r: { ko: '베이징대학 강사', en: 'Lecturer at Peking University' } },
            { y: '1930–1936', r: { ko: '중국좌익작가연맹 지도자', en: 'Leading figure of the League of Left-Wing Writers' } },
        ],
        sources: [W + 'Lu_Xun', 'https://www.marxists.org/archive/lu-xun/index.htm'], locator: L,
    },
    {
        id: 'he-long', group: 'china-revolution',
        family: { ko: '허', en: 'He' }, given: { ko: '룽', en: 'Long' }, native: '贺龙',
        years: '1896–1969', role: 'military-commander',
        epithet: { ko: '「식칼 두 자루」로 봉기했다는 후난의 사나이, 난창 봉기 총지휘와 제2방면군 사령관', en: 'The Hunanese who rose “with two kitchen knives”, commander of the Nanchang Uprising and the Second Front Army' },
        bio: {
            ko: '후난 서부의 가난한 집안 출신으로 지방 무장을 이끌다 국민혁명군 군장이 되었고, 1927년 8월 1일 난창 봉기의 총지휘를 맡은 직후 입당했다. 후난·후베이 서부에 근거지를 세우고 대장정에서 제2방면군을 이끌었으며 항일전쟁기 120사단장이었다. 건국 후 10대 원수의 한 사람으로 국가체육위원회 주임과 군사위원회 부주석을 지냈다. 문화대혁명에서 린뱌오·캉성의 공격을 받아 감금되었고 1969년 치료를 거부당한 채 사망했다. 1974년 복권되었다.',
            en: 'From a poor family in western Hunan, he led local armed bands, rose to command a Nationalist army corps, and joined the party days after commanding the Nanchang Uprising of 1 August 1927. He built a base on the Hunan–Hubei border, led the Second Front Army on the Long March and the 120th Division in the war with Japan. After 1949 he was one of the ten marshals, chairman of the state sports commission and a vice-chairman of the Military Commission. Attacked by Lin Biao and Kang Sheng in the Cultural Revolution, he was confined and died in 1969 after being denied treatment; he was rehabilitated in 1974.',
        },
        fate: { kind: 'natural', label: { ko: '옥사', en: 'Died in custody' } },
        aliases: { ko: ['하룡'], en: ['Ho Lung'] },
        career: [
            { y: '1927.08', r: { ko: '난창 봉기 총지휘', en: 'Commander-in-chief of the Nanchang Uprising' } },
            { y: '1936–1937', r: { ko: '홍군 제2방면군 총지휘', en: 'Commander of the Second Front Army' } },
            { y: '1955', r: { ko: '중화인민공화국 원수', en: 'Marshal of the People’s Republic of China' } },
        ],
        sources: [W + 'He_Long', W + 'Nanchang_uprising'], locator: L,
    },
    {
        id: 'liu-bocheng', group: 'china-revolution',
        family: { ko: '류', en: 'Liu' }, given: { ko: '보청', en: 'Bocheng' }, native: '刘伯承',
        years: '1892–1986', role: 'military-commander',
        epithet: { ko: '「외눈의 용」, 덩샤오핑과 짝을 이룬 홍군 총참모장이자 회하이 전역의 지휘관', en: 'The “one-eyed dragon”, Red Army chief of staff and Deng Xiaoping’s partner who commanded at Huaihai' },
        bio: {
            ko: '쓰촨의 군인으로 1916년 전투에서 오른눈을 잃었고 1926년 입당해 난창 봉기에 참여했다. 소련 프룬제 군사아카데미에서 배운 뒤 홍군 총참모장으로 대장정을 이끌었고, 항일전쟁기 129사단장으로 정치위원 덩샤오핑과 「류덩」 부대를 이루었다. 국공내전에서 1947년 다볘산 진격과 1948~1949년 회하이 전역을 지휘해 승리의 결정적 국면을 만들었다. 건국 후 원수가 되어 난징 군사학원을 세웠으며 1958년 「교조주의」 비판을 받고 물러났다.',
            en: 'A Sichuan soldier who lost his right eye in battle in 1916, he joined the party in 1926 and took part in the Nanchang Uprising. Trained at the Frunze Military Academy, he was Red Army chief of staff on the Long March and, as commander of the 129th Division with Deng Xiaoping as political commissar, formed the “Liu–Deng” army in the war with Japan. In the civil war he led the 1947 thrust into the Dabie Mountains and the Huaihai campaign of 1948–1949, the decisive phase of the Communist victory. A marshal after 1949, he founded the Nanjing Military Academy and withdrew after being criticised for “dogmatism” in 1958.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['유백승'], en: ['Liu Po-cheng'] },
        career: [
            { y: '1932–1937', r: { ko: '홍군 총참모장', en: 'Chief of Staff of the Red Army' } },
            { y: '1937–1945', r: { ko: '팔로군 129사단장', en: 'Commander of the 129th Division, Eighth Route Army' } },
            { y: '1955', r: { ko: '중화인민공화국 원수', en: 'Marshal of the People’s Republic of China' } },
        ],
        sources: [W + 'Liu_Bocheng', W + 'Huaihai_campaign'], locator: L,
    },
    {
        id: 'wang-shiwei', group: 'china-revolution',
        family: { ko: '왕', en: 'Wang' }, given: { ko: '스웨이', en: 'Shiwei' }, native: '王实味',
        years: '1906–1947', role: 'writer-artist',
        epithet: { ko: '「야생 백합」으로 옌안의 특권을 비판했다가 정풍운동의 첫 희생자가 된 작가', en: 'The writer whose “Wild Lilies” criticised privilege at Yan’an and made him the rectification movement’s first victim' },
        bio: {
            ko: '허난 출신 번역가·작가로 1937년 옌안에 가 마르크스주의 고전을 번역했다. 1942년 3월 『해방일보』에 실은 잡문 「야생 백합」에서 간부의 식사·의복 등급과 청년의 좌절을 지적했고, 곧 정풍운동에서 「트로츠키파」로 몰려 비판 대회의 표적이 되었다. 1943년 체포되어 감금되었고, 1947년 국민당군의 옌안 공격으로 철수하던 중 산시성 싱현에서 처형되었다. 1991년 공안부가 트로츠키파 혐의를 공식 철회했다.',
            en: 'A translator and writer from Henan, he went to Yan’an in 1937 and translated Marxist classics. In March 1942 his essay “Wild Lilies” in Liberation Daily pointed to graded rations and clothing for cadres and to the disillusionment of the young; in the rectification movement he was branded a “Trotskyist” and became the target of mass criticism meetings. Arrested in 1943, he was executed at Xing County, Shanxi, in 1947 during the retreat from Yan’an before the Nationalist offensive. In 1991 the Ministry of Public Security formally withdrew the Trotskyist charge.',
        },
        fate: { kind: 'executed', label: { ko: '처형', en: 'Executed' } },
        aliases: { ko: ['왕실미'], en: ['Wang Shih-wei'] },
        career: [
            { y: '1937–1942', r: { ko: '마르크스-레닌학원 번역원', en: 'Translator at the Marx–Lenin Institute, Yan’an' } },
        ],
        sources: [W + 'Wang_Shiwei', W + 'Yan%27an_Rectification_Movement'], locator: L,
    },
    {
        id: 'ding-ling', group: 'china-revolution',
        family: { ko: '딩', en: 'Ding' }, given: { ko: '링', en: 'Ling' }, native: '丁玲',
        years: '1904–1986', role: 'writer-artist',
        epithet: { ko: '『소피 여사의 일기』에서 『태양은 쌍간강을 비춘다』까지, 옌안과 반우파 투쟁을 모두 겪은 작가', en: 'From Miss Sophia’s Diary to The Sun Shines over the Sanggan River, a writer who lived through Yan’an and the anti-rightist purge' },
        bio: {
            ko: '후난 출신으로 1928년 『소피 여사의 일기』로 신여성의 내면을 그려 이름을 얻었고, 남편 후예핀이 1931년 국민당에게 처형된 뒤 입당했다. 1936년 산베이의 홍군 지역에 도착해 마오의 환영을 받았으나 1942년 「3·8절 유감」으로 옌안의 성차별을 지적해 정풍운동에서 비판받았다. 토지개혁을 그린 『태양은 쌍간강을 비춘다』로 1951년 스탈린상을 받았고, 1957년 반우파 투쟁에서 우파로 몰려 북대황 농장에서 20년 넘게 노동했다. 1979년 복권되었다.',
            en: 'From Hunan, she made her name in 1928 with Miss Sophia’s Diary, a portrait of the modern woman’s inner life, and joined the party after the Nationalists executed her husband Hu Yepin in 1931. She reached the Red Army area in northern Shaanxi in 1936 and was welcomed by Mao, but her 1942 essay “Thoughts on March 8” on sexism at Yan’an drew criticism in the rectification movement. Her land-reform novel The Sun Shines over the Sanggan River won a Stalin Prize in 1951; in the 1957 anti-rightist campaign she was labelled a rightist and spent more than twenty years labouring on a farm in the Great Northern Wilderness. She was rehabilitated in 1979.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['정령', '장빙즈'], en: ['Ting Ling', 'Jiang Bingzhi'] },
        career: [
            { y: '1949–1957', r: { ko: '중국작가협회 부주석', en: 'Vice-chair of the Chinese Writers’ Association' } },
        ],
        sources: [W + 'Ding_Ling', W + 'Anti-Rightist_Campaign'], locator: L,
    },
    {
        id: 'otto-braun', group: 'international-revolutionary',
        family: { ko: '브라운', en: 'Braun' }, given: { ko: '오토', en: 'Otto' }, native: 'Otto Braun',
        years: '1900–1974', role: 'non-soviet-revolutionary', citizenship: 'germany', origin: 'germany',
        epithet: { ko: '「리더」, 대장정에 동행한 유일한 서양인이자 쭌이 회의에서 책임을 추궁당한 코민테른 군사고문', en: '“Li De”, the only Westerner on the Long March and the Comintern military adviser blamed at Zunyi' },
        bio: {
            ko: '뮌헨 출신 독일 공산당원으로 1928년 탈옥해 소련에 가 프룬제 군사아카데미에서 배웠다. 1932년 코민테른의 군사고문으로 상하이에 왔고 1933년 장시 소비에트에 들어가 보구와 함께 진지전 방어를 지휘했으나 제5차 포위토벌에 패했다. 대장정에서 1935년 쭌이 회의는 그와 보구의 군사 지도를 비판하고 마오를 앞세웠다. 1939년 모스크바로 돌아갔고 전후 동독에서 번역가·교수로 살며 1973년 회고록 『중국 기록』을 냈다.',
            en: 'A German Communist from Munich who escaped prison in 1928 and studied at the Frunze Military Academy in the Soviet Union. Sent to Shanghai as Comintern military adviser in 1932, he entered the Jiangxi Soviet in 1933 and with Bo Gu directed a positional defence that lost the fifth encirclement campaign. On the Long March the Zunyi Conference of 1935 condemned his and Bo Gu’s military leadership and elevated Mao. He returned to Moscow in 1939 and after the war lived in East Germany as a translator and lecturer, publishing his memoir A Comintern Agent in China in 1973.',
        },
        fate: { kind: 'natural', label: { ko: '자연사', en: 'Natural causes' } },
        aliases: { ko: ['리더', '오토 브라운'], en: ['Li De', 'Hua Fu'] },
        career: [
            { y: '1932–1939', r: { ko: '코민테른 파견 중국 군사고문', en: 'Comintern military adviser in China' } },
        ],
        sources: [W + 'Otto_Braun_(communist)', W + 'Zunyi_Conference'], locator: L,
    },
];
