// A term's period label replaces the formatted years only where the numbers
// cannot say it (owner's decision 2026-11-27): no date at all (개념, 냉전기),
// several spans (1924–1927, 1937–1945), centuries and vague edges
// (19세기 말–현재), two possible years (1917–1937/1938). It is not a remark:
// 「1793년 6월 24일 채택, 시행되지 않음」 is the date [1793, 6, 24] plus a
// sentence in the body. A label passes when, once numbers and separators are
// taken out, every word left is one of the period words below.
const SEPARATORS = /[\s0-9–—~\-,/·.()?]+/u;
const KO_WORDS = new Set([
    '년', '년대', '월', '일', '세기', '경', '무렵', '또는', '과', '와', '부터', '까지',
    '상순', '중순', '하순', '봄', '여름', '가을', '겨울',
    '초', '중', '말', '전반', '중반', '후반', '중후반', '초반',
    '현재', '이후', '이전',
    '개념', '고대', '중세', '근대', '현대', '냉전기', '구력', '신력',
]);
const EN_WORDS = new Set([
    'c', 'or', 'and', 'to', 'from', 'until', 's', 'th', 'st', 'nd', 'rd', 'century', 'centuries',
    'spring', 'summer', 'autumn', 'winter', 'the', 'up', 'onward', 'onwards', 'period',
    'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'sept', 'oct', 'nov', 'dec',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december',
    'early', 'mid', 'late', 'present', 'since', 'before', 'after',
    'concept', 'antiquity', 'ancient', 'medieval', 'middle', 'ages', 'modern', 'cold', 'war', 'era',
    'o', 'n', 'os', 'ns', 'bc', 'bce', 'ad', 'ce',
]);
// Korean words may be glued to numbers or to each other (1918년, 19세기말),
// so a Korean piece passes when it splits wholly into period words.
function koPieceOk(piece) {
    if (!piece) return true;
    for (let end = piece.length; end > 0; end -= 1) {
        if (KO_WORDS.has(piece.slice(0, end)) && koPieceOk(piece.slice(end))) return true;
    }
    return false;
}
function enPieceOk(piece) {
    return !piece || EN_WORDS.has(piece.toLowerCase());
}

// The words of a label that are not period words; [] when the label passes.
function termPeriodLabelProblems(label) {
    const out = [];
    for (const [lang, ok] of [['ko', koPieceOk], ['en', enPieceOk]]) {
        for (const piece of String(label?.[lang] || '').split(SEPARATORS)) {
            if (piece && !ok(piece)) out.push(`${lang}: ${piece}`);
        }
    }
    return out;
}

module.exports = { termPeriodLabelProblems, KO_WORDS, EN_WORDS };
