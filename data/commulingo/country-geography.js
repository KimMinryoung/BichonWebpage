const { FLAG_NAMES, hasFlag, flagLabel } = require('./flag-icons');

// Flag/nationality code -> present-day Natural Earth map units. Historical
// entries are deliberately approximations based on successor territories; the
// UI always labels them as such. This is geography for orientation, not a
// claim that present borders existed throughout CommuLingo's period.
const COUNTRY_GEOGRAPHY = {
    soviet: { kind: 'historical', members: ['RUS','UKR','BLR','MDA','EST','LVA','LTU','GEO','ARM','AZE','KAZ','UZB','TKM','TJK','KGZ'], center: [48, 55], continent: 'eurasia' },
    russia: { members: ['RUS'], continent: 'europe' },
    ukraine: { members: ['UKR'], continent: 'europe' },
    georgia: { members: ['GEO'], continent: 'asia' },
    armenia: { members: ['ARM'], continent: 'asia' },
    azerbaijan: { members: ['AZE'], continent: 'asia' },
    belarus: { members: ['BLR'], continent: 'europe' },
    kazakhstan: { members: ['KAZ'], continent: 'asia' },
    latvia: { members: ['LVA'], continent: 'europe' },
    lithuania: { members: ['LTU'], continent: 'europe' },
    estonia: { members: ['EST'], continent: 'europe' },
    poland: { members: ['POL'], continent: 'europe' },
    finland: { members: ['FIN'], continent: 'europe' },
    germany: { members: ['DEU'], continent: 'europe' },
    austria: { members: ['AUT'], continent: 'europe' },
    hungary: { members: ['HUN'], continent: 'europe' },
    france: { members: ['FXX'], continent: 'europe' },
    italy: { members: ['ITA'], continent: 'europe' },
    uk: { members: ['ENG','SCT','WLS','NIR'], center: [-2.8, 54], continent: 'europe' },
    usa: { members: ['USA'], center: [-101, 39], continent: 'americas' },
    china: { members: ['CHN'], continent: 'asia' },
    netherlands: { members: ['NLD'], continent: 'europe' },
    belgium: { members: ['BEL'], continent: 'europe' },
    bulgaria: { members: ['BGR'], continent: 'europe' },
    cuba: { members: ['CUB'], continent: 'americas' },
    spain: { members: ['ESP'], continent: 'europe' },
    romania: { members: ['ROU'], continent: 'europe' },
    yugoslavia: { kind: 'historical', members: ['SRS','HRV','BIH','SVN','MNE','MKD','KOS'], center: [20, 44], continent: 'europe' },
    czechia: { members: ['CZE'], continent: 'europe' },
    'east-germany': { kind: 'historical', special: 'eastGermany', center: [12.2, 52], continent: 'europe' },
    uzbekistan: { members: ['UZB'], continent: 'asia' },
    moldova: { members: ['MDA'], continent: 'europe' },
    turkmenistan: { members: ['TKM'], continent: 'asia' },
    tajikistan: { members: ['TJK'], continent: 'asia' },
    kyrgyzstan: { members: ['KGZ'], continent: 'asia' },
    japan: { members: ['JPN'], continent: 'asia' },
    india: { members: ['IND'], continent: 'asia' },
    turkey: { members: ['TUR'], continent: 'asia' },
    greece: { members: ['GRC'], continent: 'europe' },
    argentina: { members: ['ARG'], continent: 'americas' },
    chile: { members: ['CHL'], continent: 'americas' },
    'north-korea': { members: ['PRK'], continent: 'asia' },
    'south-korea': { members: ['KOR'], continent: 'asia' },
    vietnam: { members: ['VNM'], continent: 'asia' },
    albania: { members: ['ALB'], continent: 'europe' },
    angola: { members: ['AGO'], continent: 'africa' },
    'burkina-faso': { members: ['BFA'], continent: 'africa' },
    congo: { members: ['COD'], continent: 'africa' },
    ghana: { members: ['GHA'], continent: 'africa' },
    'guinea-bissau': { members: ['GNB'], continent: 'africa' },
    indonesia: { members: ['IDN'], continent: 'asia' },
    mozambique: { members: ['MOZ'], continent: 'africa' },
    peru: { members: ['PER'], continent: 'americas' },
    trinidad: { members: ['TTO'], continent: 'americas' },
    portugal: { members: ['PRT'], continent: 'europe' },
    brazil: { members: ['BRA'], continent: 'americas' },
    'el-salvador': { members: ['SLV'], continent: 'americas' },
    grenada: { members: ['GRD'], continent: 'americas' },
    guyana: { members: ['GUY'], continent: 'americas' },
    nicaragua: { members: ['NIC'], continent: 'americas' },
    'south-africa': { members: ['ZAF'], continent: 'africa' },
    tanzania: { members: ['TZA'], continent: 'africa' },
    ireland: { members: ['IRL'], continent: 'europe' },
    slovakia: { members: ['SVK'], continent: 'europe' },
    czechoslovakia: { kind: 'historical', members: ['CZE','SVK'], center: [17, 49.5], continent: 'europe' },
    korea: { kind: 'region', members: ['PRK','KOR'], center: [127.4, 38], continent: 'asia' },
    martinique: { kind: 'region', members: ['MTQ'], center: [-61.02, 14.64], continent: 'americas' },
    israel: { members: ['ISR'], continent: 'asia' },
    afghanistan: { members: ['AFG'], continent: 'asia' },
};

const CONTINENT_LABELS = {
    europe: { ko: '유럽', en: 'Europe' },
    asia: { ko: '아시아', en: 'Asia' },
    eurasia: { ko: '유럽·아시아', en: 'Europe & Asia' },
    africa: { ko: '아프리카', en: 'Africa' },
    americas: { ko: '아메리카', en: 'Americas' },
};

function countryHref(code) {
    return hasCountry(code) ? `/commulingo/countries/${encodeURIComponent(code)}` : '';
}

function hasCountry(code) {
    return hasFlag(code) && Object.prototype.hasOwnProperty.call(COUNTRY_GEOGRAPHY, code);
}

function countryCodes() {
    return Object.keys(FLAG_NAMES).filter(hasCountry);
}

function countryInfo(code, lang) {
    if (!hasCountry(code)) return null;
    const geography = COUNTRY_GEOGRAPHY[code];
    return {
        code,
        label: flagLabel(code, lang),
        href: countryHref(code),
        kind: geography.kind || 'modern',
        continent: geography.continent,
        continentLabel: (CONTINENT_LABELS[geography.continent] || {})[lang === 'en' ? 'en' : 'ko'] || '',
        geography,
    };
}

module.exports = { COUNTRY_GEOGRAPHY, CONTINENT_LABELS, countryHref, hasCountry, countryCodes, countryInfo };
