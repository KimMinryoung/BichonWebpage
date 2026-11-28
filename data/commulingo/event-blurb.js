// The one-sentence introduction (migration 389): what happened, when, who and
// how it ended. Empty clears it; otherwise one line, one sentence, short enough
// to read at a glance in a link preview. How to write one: BLURB_GUIDE, which
// the MCP tool descriptions quote.
const BLURB_GUIDE = 'blurb {ko, en}: the one-sentence introduction shown under the event title, in link previews, on the event list '
    + 'and as the page description. One sentence that says when, who did what and how it ended, starting from the event itself, '
    + 'not its background; Korean ends in a noun naming the event (…한 전쟁. / …한 과정. / …한 봉기.), English is a noun phrase '
    + '(The war of 1912–1913 in which …). At most 100 (ko) / 220 (en) characters, one line, no question.';
const BLURB_MAX = { ko: 100, en: 220 };
function blurbProblem(text, lang) {
    const value = String(text ?? '');
    if (!value.trim()) return '';
    if (/\n/.test(value)) return 'one line, no line breaks';
    if ([...value].length > BLURB_MAX[lang]) return `at most ${BLURB_MAX[lang]} characters (has ${[...value].length})`;
    // A sentence end followed by more text is a second sentence: in Korean a
    // full stop after a syllable, digit or closing mark (…다. … / …전쟁. …),
    // in English a lowercase word's full stop before a capital, so "U.S." and
    // "Mr." do not count.
    const secondSentence = lang === 'ko' ? /[가-힣0-9)」』\]][.!]\s+\S/ : /[a-z]{2}[.!]\s+[A-Z]/;
    if (secondSentence.test(value.trim())) return 'one sentence only';
    if (/\?/.test(value)) return 'a statement, not a question';
    return '';
}

module.exports = { blurbProblem, BLURB_MAX, BLURB_GUIDE };
