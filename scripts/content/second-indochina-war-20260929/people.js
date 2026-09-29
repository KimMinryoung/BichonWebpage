// New people for the Second Indochina War batch, in the commulingo-people-upsert
// payload shape. Thiệu follows Ngô Đình Diệm (international-counterrevolutionary),
// Westmoreland follows de Lattre (foreign-statesmen, counterrevolution), Lê Đức Thọ
// and Nguyễn Thị Bình follow Lê Duẩn (international-revolutionary). Bình is living,
// so she has no fate.
const W = t => 'https://en.wikipedia.org/wiki/' + t;
const person = (id, groupId, [gko, gen], [fko, fen], nativeName, years, citizenship, origin, role, epithet, bio, fate, aliases, sources) => ({
    id, groupId,
    givenName: { ko: gko, en: gen }, familyName: { ko: fko, en: fen },
    nativeName, years,
    citizenship: { code: citizenship }, nationalOrigin: typeof origin === 'string' ? { code: origin } : origin,
    role: { category: role },
    epithet: { ko: epithet[0], en: epithet[1] },
    bio: { ko: bio[0], en: bio[1] },
    ...(fate ? { fate: { kind: fate[0], label: { ko: fate[1], en: fate[2] } } } : {}),
    aliases, sources,
    evidence: [
        { field: 'bio', claim: bio[1] },
        { field: 'years', claim: years },
        { field: 'citizenship', claim: `${id}: citizenship ${citizenship}` },
        { field: 'nationalOrigin', claim: `${id}: national background ${typeof origin === 'string' ? origin : origin.code}` },
    ].map(e => ({ ...e, source: sources[0], locator: 'Wikipedia article: lead, biography sections' })),
});
const WAR = W('Vietnam_War');

module.exports = [
    person('nguyen-van-thieu', 'international-counterrevolutionary', ['반티에우', 'Văn Thiệu'], ['응우옌', 'Nguyễn'], 'Nguyễn Văn Thiệu', '1923–2001', 'vietnam', 'vietnam', 'counterrevolution',
        ['1967~1975년 남베트남 대통령으로 파리 협정에 반대하고 사이공 함락 직전 사임한 장군',
            'General who was president of South Vietnam from 1967 to 1975, opposed the Paris Peace Accords and resigned days before the fall of Saigon'],
        ['판랑 출신으로 1945년 베트민에 들어갔다가 한 해 만에 나와 베트남국 군대에 들어갔다. 1963년 11월 지엠을 무너뜨린 쿠데타에 가담해 장군이 되었고, 1965년 군사정부의 명목상 국가원수가 되었다. 1967년 부정 선거로 대통령에 당선되었고, 1971년에는 경쟁자가 모두 빠진 단독 출마로 재선되었다. 1973년 파리 협정에 반대했으나 서명했다. 1975년 4월 21일 미국이 남베트남을 배신했다고 선언하며 사임해 타이완으로 떠났고, 뒤에 미국 보스턴 근교에서 살다 2001년 숨졌다.',
            'Born in Phan Rang, he joined the Viet Minh in 1945 but left after a year for the army of the State of Vietnam. He joined the November 1963 coup against Diệm, was made a general and in 1965 became the junta’s nominal head of state. He won the presidency in a rigged election in 1967 and was re-elected unopposed in 1971 after rivals were barred or withdrew. He opposed the 1973 Paris Peace Accords but signed them. On 21 April 1975 he resigned, declaring that the United States had betrayed South Vietnam, and left for Taiwan; he later lived near Boston and died in 2001.'],
        ['exile', '망명지에서 사망', 'Died in exile'], { ko: ['티에우', '응우옌반티에우 대통령'], en: ['Nguyen Van Thieu', 'Thieu'] }, [W('Nguy%E1%BB%85n_V%C4%83n_Thi%E1%BB%87u'), WAR]),
    person('le-duc-tho', 'international-revolutionary', ['득토', 'Đức Thọ'], ['레', 'Lê'], 'Lê Đức Thọ', '1911–1990', 'vietnam', 'vietnam', 'socialist-bloc-leader',
        ['키신저와 비밀 협상으로 파리 협정을 이끌고 노벨 평화상을 거부한 베트남 노동당 정치국원',
            'Vietnamese Politburo member who negotiated the Paris Peace Accords with Kissinger and declined the Nobel Peace Prize'],
        ['남딘 출신으로 본명은 판딘카이다. 1930년 인도차이나 공산당 창당에 참여했고 1930~1936년과 1939~1944년 프랑스 식민 감옥에 갇혔다. 항불전쟁 때 남부에서 레주언과 함께 당 조직을 맡았고, 1955년 베트남 노동당 정치국에 들어갔다. 1968년 6월 파리 협상에 합류해 실질적으로 북베트남 대표단을 이끌었고, 1970년 2월부터 키신저와 비밀 협상을 벌여 1973년 1월 파리 협정을 맺었다. 그해 키신저와 함께 노벨 평화상 수상자로 정해졌으나 남베트남에 아직 평화가 오지 않았다며 거부했다. 1990년 하노이에서 숨졌다.',
            'Born Phan Đình Khải in Nam Định, he helped found the Indochinese Communist Party in 1930 and was held in French colonial prisons in 1930–1936 and 1939–1944. During the war against France he ran party organisation in the south alongside Lê Duẩn, and in 1955 he joined the Politburo of the Vietnam Workers’ Party. He arrived in Paris in June 1968 to take effective charge of the North Vietnamese delegation, and from February 1970 held secret talks with Kissinger that led to the Paris Peace Accords of January 1973. Named joint winner of that year’s Nobel Peace Prize with Kissinger, he declined it on the ground that peace had not yet been established in South Vietnam. He died in Hanoi in 1990.'],
        ['natural', '자연사', 'Natural causes'], { ko: ['레득토'], en: ['Le Duc Tho', 'Phan Dinh Khai'] }, [W('L%C3%AA_%C4%90%E1%BB%A9c_Th%E1%BB%8D'), W('Paris_Peace_Accords')]),
    person('nguyen-thi-binh', 'international-revolutionary', ['티빈', 'Thị Bình'], ['응우옌', 'Nguyễn'], 'Nguyễn Thị Bình', '1927–', 'vietnam', 'vietnam', 'socialist-bloc-leader',
        ['남베트남 임시혁명정부 외무장관으로 파리 협정에 서명한 유일한 여성이자 뒤에 베트남 부주석이 된 외교관',
            'PRG foreign minister, the only woman to sign the Paris Peace Accords, and later vice president of Vietnam'],
        ['사덱 성 출신으로 민족주의 지도자 판쩌우찐의 외손녀다. 1948년 공산당에 들어갔고 1951~1953년 프랑스 당국에 체포되어 사이공의 치호아 감옥에 갇혔다. 베트남 전쟁 동안 민족해방전선 중앙위원을 지냈고, 1969년 남베트남 임시혁명정부의 외무장관이 되어 파리 협상 대표단을 이끌었다. 1973년 파리 협정에 서명한 유일한 여성이다. 통일 뒤 교육부 장관을 지냈고, 1992~2002년 두 차례 베트남 국가부주석으로 선출되었다.',
            'Born in Sa Đéc province and a granddaughter of the nationalist leader Phan Châu Trinh, she joined the Communist Party in 1948 and was held by the French in Saigon’s Chí Hòa prison in 1951–1953. During the Vietnam War she sat on the Central Committee of the National Liberation Front, and in 1969 she became foreign minister of the Provisional Revolutionary Government of the Republic of South Vietnam, leading its delegation in Paris. She was the only woman to sign the 1973 Paris Peace Accords. After reunification she was minister of education, and the National Assembly twice elected her vice president of Vietnam, for 1992–2002.'],
        null, { ko: ['빈 여사', '마담 빈'], en: ['Nguyen Thi Binh', 'Madame Binh', 'Madame Bình'] }, [W('Nguy%E1%BB%85n_Th%E1%BB%8B_B%C3%ACnh'), W('Paris_Peace_Accords')]),
    person('william-westmoreland', 'foreign-statesmen', ['윌리엄', 'William'], ['웨스트모얼랜드', 'Westmoreland'], 'William Westmoreland', '1914–2005', 'usa', 'usa', 'counterrevolution',
        ['1964~1968년 남베트남 주둔 미군을 지휘하며 소모전과 사살 집계를 앞세운 미국 육군 장군',
            'US Army general who commanded American forces in South Vietnam from 1964 to 1968 and pursued a strategy of attrition measured by body count'],
        ['사우스캐롤라이나 출신으로 1936년 웨스트포인트를 수석으로 졸업했고 2차 대전 유럽 전선과 한국전쟁에 참전했다. 1964년 1월 남베트남에 파견되어 6월 베트남 군사원조사령부를 맡았다. 해병대 상륙 뒤 방어 위주에서 벗어나 미군이 직접 적을 찾아 섬멸하는 소모전을 주장했고, 대규모 포격과 공습을 썼다. 1967년 11월 「끝이 보인다」고 말했으나 1968년 뗏 공세 뒤 20만 명 증파 요청이 알려지면서 3월 교체되었다. 1968~1972년 육군 참모총장을 지냈다.',
            'From South Carolina, he graduated first in his West Point class in 1936 and served in the European theatre of the Second World War and in Korea. Sent to South Vietnam in January 1964, he took command of Military Assistance Command, Vietnam in June. After the Marines landed he argued for abandoning a defensive posture in favour of an attrition war in which US forces sought out and destroyed the enemy, using artillery and air power on a huge scale. In November 1967 he said “the end comes into view”; after the Tet Offensive his request for 200,000 more troops leaked and he was replaced in March 1968. He was Army Chief of Staff from 1968 to 1972.'],
        ['natural', '자연사', 'Natural causes'], { ko: ['웨스트모얼랜드 장군'], en: ['Westmoreland', 'General Westmoreland'] }, [W('William_Westmoreland'), WAR]),
];
