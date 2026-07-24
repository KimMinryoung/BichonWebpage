// Canonical Korean terminology for Soviet-history public prose. Keep this
// separate from nationality labels: modern citizenship may still be 조지아,
// while historical/narrative Korean copy uses the Soviet-era name 그루지야.
function normalizeSovietKoreanText(value) {
    return typeof value === 'string' ? value.replaceAll('조지아', '그루지야') : value;
}

module.exports = { normalizeSovietKoreanText };
