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

module.exports = { parseEventPeriodQuery };
