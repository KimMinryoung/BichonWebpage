// Only explicit year/month labels describe an event's duration. Never infer
// its years from mentions in the summary or timeline.
function eventPeriodYears(period = '') {
    const match = period.trim().match(/^(\d{4})(?:\.(?:0[1-9]|1[0-2]))?(?:\s*[-–—~]\s*(?:(\d{4})(?:\.(?:0[1-9]|1[0-2]))?|(?:0[1-9]|1[0-2])))?$/);
    if (!match) return { startYear: null, endYear: null };
    const startYear = Number(match[1]);
    const endYear = Number(match[2] || match[1]);
    return startYear > 0 && endYear >= startYear
        ? { startYear, endYear } : { startYear: null, endYear: null };
}

function parseEventPeriodQuery(query = '') {
    const periods = [];
    const keywords = query.replace(/(^|\s)(\d{4})(?:\s*년)?(?:\s*[-–—~〜]\s*(\d{4})(?:\s*년)?)?(?=\s|$)/g,
        (whole, space, first, last) => {
            const a = Number(first), b = Number(last || first);
            if (!a || !b) return whole;
            periods.push({ startYear: Math.min(a, b), endYear: Math.max(a, b) });
            return space;
        }).trim();
    return { periods, keywords };
}

module.exports = { eventPeriodYears, parseEventPeriodQuery };
