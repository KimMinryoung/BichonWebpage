// New people for the Sino-Vietnamese War batch, in the commulingo-people-upsert
// payload shape. Chinese generals follow Xu Xiangqian (china-mao-era,
// military-commander); Vietnamese leaders follow Lê Duẩn (international-revolutionary).
const W = t => 'https://en.wikipedia.org/wiki/' + t;
const person = (id, groupId, [gko, gen], [fko, fen], nativeName, years, citizenship, origin, role, epithet, bio, fate, aliases, sources) => ({
    id, groupId,
    givenName: { ko: gko, en: gen }, familyName: { ko: fko, en: fen },
    nativeName, years,
    citizenship: { code: citizenship }, nationalOrigin: typeof origin === 'string' ? { code: origin } : origin,
    role: { category: role },
    epithet: { ko: epithet[0], en: epithet[1] },
    bio: { ko: bio[0], en: bio[1] },
    fate: { kind: fate[0], label: { ko: fate[1], en: fate[2] } },
    aliases, sources,
    evidence: [
        { field: 'bio', claim: bio[1] },
        { field: 'years', claim: years },
        { field: 'citizenship', claim: `${id}: citizenship ${citizenship}` },
        { field: 'nationalOrigin', claim: `${id}: national background ${typeof origin === 'string' ? origin : origin.code}` },
    ].map(e => ({ ...e, source: sources[0], locator: 'Wikipedia article: lead, biography sections' })),
});
const WAR = W('Sino-Vietnamese_War');

module.exports = [
    person('xu-shiyou', 'china-mao-era', ['스유', 'Shiyou'], ['쉬', 'Xu'], '许世友', '1906–1985', 'china', 'china', 'military-commander',
        ['소림사에서 무술을 익힌 홍군 장군으로, 1979년 중월전쟁에서 광저우 군구를 이끌고 동부 전선을 지휘한 인물',
            'Shaolin-trained Red Army general who led the Guangzhou military region on the eastern front of the 1979 war with Vietnam'],
        ['허난 신셴 출신으로 소림사에서 8년 동안 무술을 익혔고, 「불교의 벗」이라는 뜻의 이름을 가졌다. 홍군에 들어가 항일전쟁과 국공내전을 치렀고, 오랫동안 난징 군구를 이끌었다. 1974년 광저우 군구 사령관으로 옮겼고, 1976년 저우언라이 사후 4인방에게 밀려난 덩샤오핑을 정치위원 웨이궈칭과 함께 보호했다. 1979년 중월전쟁에서 중국군을 이끌며 까오방·랑선 방향의 동부 전선을 지휘했다. 1969~1982년 정치국원을 지냈고 1985년 난징에서 숨졌다.',
            'From Xinxian in Henan, he studied martial arts at the Shaolin Temple for eight years and took a name meaning “friend of Buddhism”. Joining the Red Army, he fought the war against Japan and the civil war and long commanded the Nanjing military region. Moved to the Guangzhou region in 1974, he and political commissar Wei Guoqing protected Deng Xiaoping when the Gang of Four purged him after Zhou Enlai’s death in 1976. In the 1979 war with Vietnam he led the Chinese forces and commanded the eastern front towards Cao Bằng and Lạng Sơn. A Politburo member from 1969 to 1982, he died in Nanjing in 1985.'],
        ['natural', '자연사', 'Natural causes'], { ko: ['허세우'], en: ['Hsu Shih-yu'] }, [W('Xu_Shiyou'), WAR]),
    person('yang-dezhi', 'china-mao-era', ['더즈', 'Dezhi'], ['양', 'Yang'], '杨得志', '1911–1994', 'china', 'china', 'military-commander',
        ['한국전쟁에 참전하고 1979년 중월전쟁에서 쿤밍 군구를 이끌고 서부 전선을 지휘한 뒤 총참모장이 된 장군',
            'General who fought in Korea, commanded the Kunming region on the western front in 1979 and became chief of the General Staff'],
        ['후난 리링 출신으로 1928년 홍군에 들어가 항일전쟁과 국공내전, 한국전쟁에 참전했다. 지난 군구와 우한 군구를 거쳐 1979년 1월 쿤밍 군구 사령관이 되었고, 중월전쟁에서 서북부 방향의 서부 전선을 지휘했다. 쉬스유가 동부 전선을 맡았다. 1980년 인민해방군 총참모장이 되었고 1994년 베이징에서 숨졌다.',
            'Born in Liling, Hunan, he joined the Red Army in 1928 and fought against Japan, in the civil war and in Korea. After commanding the Jinan and Wuhan military regions he took over the Kunming region in January 1979 and commanded the western front in the northwest in the war with Vietnam, while Xu Shiyou led the east. He became chief of the PLA General Staff in 1980 and died in Beijing in 1994.'],
        ['natural', '자연사', 'Natural causes'], { ko: ['양득지'], en: ['Yang Te-chih'] }, [W('Yang_Dezhi'), WAR]),
    person('van-tien-dung', 'international-revolutionary', ['띠엔중', 'Tiến Dũng'], ['반', 'Văn'], 'Văn Tiến Dũng', '1917–2002', 'vietnam', 'vietnam', 'socialist-bloc-leader',
        ['1975년 사이공 점령을 지휘하고 1979년 캄보디아 침공과 중국과의 국경 전쟁을 이끈 장군',
            'Vietnamese general who led the 1975 spring offensive to Saigon and directed the 1979 invasion of Cambodia and border war with China'],
        ['하노이 근교 뜨리엠 출신으로 1936년 공산당에 들어갔다. 디엔비엔푸 전투를 치렀고, 1953~1954년과 1954~1978년 베트남 인민군 총참모장을 지냈다. 1975년 봄 공세를 현지에서 지휘해 사이공 함락을 이끌었다. 이어 크메르루주 캄보디아 침공과 1979년 중국과의 국경 전쟁을 지휘했다. 1980년 보응우옌잡의 뒤를 이어 국방장관이 되어 1987년까지 재임했고, 1976~1986년 정치국원이었다. 2002년 하노이에서 숨졌다.',
            'Born at Từ Liêm near Hanoi, he joined the Communist Party in 1936. He fought at Điện Biên Phủ and was chief of the General Staff in 1953–1954 and 1954–1978. He commanded the 1975 spring offensive in the field that ended with the fall of Saigon, then directed the invasion of Khmer Rouge Cambodia and the 1979 border war with China. Succeeding Võ Nguyên Giáp as defence minister in 1980, he served until 1987 and sat on the Politburo from 1976 to 1986. He died in Hanoi in 2002.'],
        ['natural', '자연사', 'Natural causes'], { ko: ['반띠엔중'], en: ['Van Tien Dung'] }, [W('V%C4%83n_Ti%E1%BA%BFn_D%C5%A9ng'), WAR]),
    person('hoang-van-hoan', 'international-revolutionary', ['반호안', 'Văn Hoan'], ['호앙', 'Hoàng'], 'Hoàng Văn Hoan', '1905–1991', 'vietnam', 'vietnam', 'socialist-bloc-leader',
        ['북베트남의 초대 주중 대사이자 친중파 원로로, 1979년 중월전쟁 뒤 중국으로 망명한 정치국원 출신 정치가',
            'Pro-Chinese veteran, North Vietnam’s first ambassador to China, who defected to China after the 1979 war'],
        ['응에안 성 출신의 혁명가로 호찌민과 함께 초기 공산주의 운동에 참여했다. 1950~1957년 북베트남의 초대 주중 대사를 지내며 두 나라를 잇는 핵심 통로였고, 1956~1976년 정치국원, 1958~1979년 국회 부의장을 지냈다. 중소분열 때 북베트남이 잠시 중국 쪽으로 기운 1960년대 초 영향력이 정점에 이르렀으나, 중국과의 관계가 나빠지면서 밀려났다. 1979년 7월 동독으로 치료를 받으러 가던 중 카라치에서 감시를 따돌리고 중국 영사관으로 피신해 베이징으로 갔고, 8월 기자회견에서 베트남의 화교 박해를 비난했다. 1991년 베이징에서 숨졌다.',
            'A revolutionary from Nghệ An, he took part in the early communist movement with Ho Chi Minh. As North Vietnam’s first ambassador to China (1950–1957) he was a crucial link between the two countries, and he sat on the Politburo from 1956 to 1976 and was vice-chairman of the National Assembly from 1958 to 1979. His influence peaked in the early 1960s when Hanoi briefly leaned towards Beijing in the Sino-Soviet dispute, and waned as relations with China soured. In July 1979, travelling to East Germany for treatment, he slipped his escorts at Karachi, took refuge at the Chinese consulate and flew to Beijing, denouncing Vietnam’s persecution of the Hoa at a press conference in August. He died in Beijing in 1991.'],
        ['exile', '망명지에서 사망', 'Died in exile'], { ko: ['호앙반호안'], en: ['Hoang Van Hoan'] }, [W('Ho%C3%A0ng_V%C4%83n_Hoan'), WAR]),
];
