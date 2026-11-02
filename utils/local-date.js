// Server-side text for <time class="local-date"> and <time class="local-date-short">,
// so a date reads before JavaScript runs (and without it: crawlers, reader
// mode). Written for the site's home zone; public/js/common.js re-renders it
// in the viewer's own zone only when that gives a different day.
const TIME_ZONE = 'Asia/Seoul';
const formats = new Map();

function formatter(lang, short) {
    const key = `${lang}:${short ? 's' : 'l'}`;
    if (!formats.has(key)) {
        const options = short
            ? { timeZone: TIME_ZONE }
            : { timeZone: TIME_ZONE, year: 'numeric', month: 'long', day: 'numeric' };
        formats.set(key, new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'ko-KR', options));
    }
    return formats.get(key);
}

function toDate(value) {
    if (value === null || value === undefined || value === '') return null;
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
}

// "2026년 11월 2일" / "November 2, 2026", followed by the suffix ("에 작성").
function localDate(value, lang, suffix = '') {
    const date = toDate(value);
    return date ? formatter(lang, false).format(date) + (suffix || '') : '';
}

// "2026. 11. 2." / "11/2/2026".
function localDateShort(value, lang) {
    const date = toDate(value);
    return date ? formatter(lang, true).format(date) : '';
}

module.exports = { localDate, localDateShort, TIME_ZONE };
