// Canonical Korean terminology for Soviet-history public prose. The country,
// language, and people are always 그루지야 in Korean copy, including
// post-independence contexts (owner decision, 2026-08-02). The one thing this
// must never touch is the US state (조지아주, 현대차 조지아 공장) — that prose
// lives outside CommuLingo, so the blanket replace here stays safe.
function normalizeSovietKoreanText(value) {
    return typeof value === 'string' ? value.replaceAll('조지아', '그루지야') : value;
}

module.exports = { normalizeSovietKoreanText };
