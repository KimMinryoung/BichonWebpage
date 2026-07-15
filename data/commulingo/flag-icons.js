// CommuLingo — nationality flags for the person cards.
//
// Real public-domain flag SVGs are vendored under public/flags/<code>.svg
// (sourced from Wikimedia Commons) and served statically, so the card markup
// only carries a small <img> tag — the browser caches each flag once no matter
// how many cards reuse it.
//
// A person shows up to two flags, citizenship first (the more important one),
// then birthplace origin: e.g. Stalin → 🇸🇺 Soviet Union, then Georgia.
//
// To add a nation: drop public/flags/<code>.svg in place and add the code to
// FLAG_NAMES below; the curator may then set citizenship_code / origin_code to
// that key. Codes not listed here render nothing (no broken image).

// code -> default localized label, used as the tooltip when the row carries no
// explicit label text of its own.
const FLAG_NAMES = {
    soviet: { ko: '소련', en: 'Soviet Union' },
    russia: { ko: '러시아', en: 'Russia' },
    ukraine: { ko: '우크라이나', en: 'Ukraine' },
    georgia: { ko: '조지아', en: 'Georgia' },
    armenia: { ko: '아르메니아', en: 'Armenia' },
    azerbaijan: { ko: '아제르바이잔', en: 'Azerbaijan' },
    belarus: { ko: '벨라루스', en: 'Belarus' },
    kazakhstan: { ko: '카자흐스탄', en: 'Kazakhstan' },
    latvia: { ko: '라트비아', en: 'Latvia' },
    lithuania: { ko: '리투아니아', en: 'Lithuania' },
    estonia: { ko: '에스토니아', en: 'Estonia' },
    poland: { ko: '폴란드', en: 'Poland' },
    finland: { ko: '핀란드', en: 'Finland' },
    germany: { ko: '독일', en: 'Germany' },
    austria: { ko: '오스트리아', en: 'Austria' },
    hungary: { ko: '헝가리', en: 'Hungary' },
    france: { ko: '프랑스', en: 'France' },
    italy: { ko: '이탈리아', en: 'Italy' },
    uk: { ko: '영국', en: 'United Kingdom' },
    usa: { ko: '미국', en: 'United States' },
    china: { ko: '중국', en: 'China' },
    netherlands: { ko: '네덜란드', en: 'Netherlands' },
    bulgaria: { ko: '불가리아', en: 'Bulgaria' },
    cuba: { ko: '쿠바', en: 'Cuba' },
    spain: { ko: '스페인', en: 'Spain' },
    romania: { ko: '루마니아', en: 'Romania' },
    czechia: { ko: '체코', en: 'Czechia' },
    'east-germany': { ko: '동독', en: 'East Germany' },
    uzbekistan: { ko: '우즈베키스탄', en: 'Uzbekistan' },
    moldova: { ko: '몰도바', en: 'Moldova' },
    turkmenistan: { ko: '투르크메니스탄', en: 'Turkmenistan' },
    tajikistan: { ko: '타지키스탄', en: 'Tajikistan' },
    kyrgyzstan: { ko: '키르기스스탄', en: 'Kyrgyzstan' },
    japan: { ko: '일본', en: 'Japan' },
    india: { ko: '인도', en: 'India' },
    turkey: { ko: '튀르키예', en: 'Turkey' },
    argentina: { ko: '아르헨티나', en: 'Argentina' },
    chile: { ko: '칠레', en: 'Chile' },
    'north-korea': { ko: '조선', en: 'North Korea' },
    'south-korea': { ko: '대한민국', en: 'South Korea' },
    vietnam: { ko: '베트남', en: 'Vietnam' },
    albania: { ko: '알바니아', en: 'Albania' },
    angola: { ko: '앙골라', en: 'Angola' },
    'burkina-faso': { ko: '부르키나파소', en: 'Burkina Faso' },
    congo: { ko: '콩고민주공화국', en: 'DR Congo' },
    ghana: { ko: '가나', en: 'Ghana' },
    'guinea-bissau': { ko: '기니비사우', en: 'Guinea-Bissau' },
    indonesia: { ko: '인도네시아', en: 'Indonesia' },
    mozambique: { ko: '모잠비크', en: 'Mozambique' },
    peru: { ko: '페루', en: 'Peru' },
    trinidad: { ko: '트리니다드 토바고', en: 'Trinidad and Tobago' },
    portugal: { ko: '포르투갈', en: 'Portugal' },
};

function hasFlag(code) {
    return typeof code === 'string' && Object.prototype.hasOwnProperty.call(FLAG_NAMES, code);
}

function escapeAttr(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Localized default label for a code, or '' when unknown.
function flagLabel(code, lang) {
    const entry = hasFlag(code) ? FLAG_NAMES[code] : null;
    if (!entry) return '';
    return (lang === 'en' ? entry.en : entry.ko) || entry.en || entry.ko || '';
}

// One flag <img>, or '' if the code has no vendored flag. `label` overrides the
// default tooltip text; `kindLabel` (e.g. 국적/출신) prefixes the tooltip.
function flagImg(code, label, kindLabel) {
    if (!hasFlag(code)) return '';
    const name = label || FLAG_NAMES[code].ko;
    const title = kindLabel ? `${kindLabel}: ${name}` : name;
    return (
        `<img class="commu-flag" src="/flags/${code}.svg" ` +
        `alt="${escapeAttr(name)}" title="${escapeAttr(title)}" loading="lazy" decoding="async" width="20" height="14">`
    );
}

module.exports = { FLAG_NAMES, hasFlag, flagLabel, flagImg };
