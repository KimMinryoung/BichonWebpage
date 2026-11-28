// The one-sentence introduction (migration 389): what happened, when, who and
// how it ended. Empty clears it; otherwise one line, one sentence, short enough
// to read at a glance in a link preview.
const BLURB_MAX = { ko: 100, en: 220 };
function blurbProblem(text, lang) {
    const value = String(text ?? '');
    if (!value.trim()) return '';
    if (/\n/.test(value)) return 'one line, no line breaks';
    if ([...value].length > BLURB_MAX[lang]) return `at most ${BLURB_MAX[lang]} characters (has ${[...value].length})`;
    // A sentence end followed by more text is a second sentence: in Korean a
    // verb ending (…다. …), in English a lowercase word's full stop before a
    // capital, so "U.S." and "Mr." do not count.
    const secondSentence = lang === 'ko' ? /[다요][.!]\s+\S/ : /[a-z]{2}[.!]\s+[A-Z]/;
    if (secondSentence.test(value.trim())) return 'one sentence only';
    if (/\?/.test(value)) return 'a statement, not a question';
    return '';
}

module.exports = { blurbProblem, BLURB_MAX };
