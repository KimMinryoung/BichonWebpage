// The trie matcher must give exactly the RegExp's matches. Compare both on
// fixed edge cases and on random text built from overlapping tokens.
const assert = require('node:assert/strict');
const { createLiteralPattern } = require('../data/commulingo/literal-pattern');
const { escapeRegExp } = require('../data/commulingo/people-linkify');

// The three shapes in use: English links, Korean links, name-context patterns.
const SHAPES = {
    en: { unicode: true, boundary: true, group: true },
    ko: { unicode: false, boundary: false, group: true },
    names: { unicode: true, boundary: false, group: false },
};

function both(tokens, shape) {
    const { unicode, boundary, group } = SHAPES[shape];
    const all = [...tokens].sort((a, b) => b.length - a.length);
    const alternation = all.map(escapeRegExp).join('|');
    const body = group ? '(' + alternation + ')' : alternation;
    const regex = new RegExp(boundary ? '(?<![\\p{L}\\p{N}_])' + body + '(?![\\p{L}\\p{N}_])' : body, unicode ? 'gu' : 'g');
    const trie = createLiteralPattern(all, { escape: escapeRegExp, unicode, boundary, group });
    assert.equal(trie.source, regex.source);
    assert.equal(trie.flags, regex.flags);
    return { regex, trie };
}

function same(tokens, shape, text) {
    const { regex, trie } = both(tokens, shape);
    const calls = pattern => {
        const seen = [];
        const out = text.replace(pattern, (...args) => { seen.push(args.slice(0, -1)); return '[' + args[0] + ']'; });
        return { out, seen };
    };
    assert.deepEqual(calls(trie), calls(regex), JSON.stringify({ tokens, shape, text }));
    const all = pattern => [...text.matchAll(pattern)].map(m => [m.index, ...m]);
    assert.deepEqual(all(trie), all(regex));
}

// Longest wins; a blocked compound is consumed before the name inside it.
same(['레닌', '레닌그라드', '그라드'], 'ko', '레닌그라드의 레닌과 그라드 레닌그');
// Korean has no boundary: the alias inside a longer word still matches.
same(['미르'], 'ko', '블라디미르 미르');
// English boundaries: the longest token followed by a letter backs off.
same(['Lenin', 'Leningrad', 'Lenin Prize'], 'en', 'Leningrads Leningrad, Lenin Prizes and Lenin.');
same(['Stalin'], 'en', 'Stalinism Stalin_x xStalin Stalin1 (Stalin) Stalin');
// Surrogate pairs as neighbours and inside tokens; replacement strings delegate.
same(['Ab', '𝒜b'], 'en', '𝒜Ab 𝒜b A𝒜b 😀Ab Ab😀');
same(['b'], 'ko', '😀b\uD800b');
assert.equal('x Lenin y'.replace(both(['Lenin'], 'en').trie, '<$1>'), 'x <Lenin> y');
// Name-context patterns: no group, Unicode, no boundaries.
same(['코바', '이오시프 스탈린', '스탈린'], 'names', '이오시프 스탈린과 코바, 스탈린');

// Random text over overlapping tokens.
let seed = 7;
const rand = n => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed % n; };
const alphabet = ['a', 'b', 'ab', 'ba', 'A', ' ', '-', '가', '나', '가나', '😀', '1', '_', '.'];
for (let round = 0; round < 900; round++) {
    const tokens = [...new Set(Array.from({ length: 1 + rand(8) }, () => Array.from({ length: 1 + rand(3) }, () => alphabet[rand(alphabet.length)]).join('')))];
    const text = Array.from({ length: rand(40) }, () => alphabet[rand(alphabet.length)]).join('');
    same(tokens, Object.keys(SHAPES)[round % 3], text);
}

// An empty token or no tokens: the caller keeps its RegExp.
assert.equal(createLiteralPattern(['', 'a'], { escape: escapeRegExp }), null);
assert.equal(createLiteralPattern([], { escape: escapeRegExp }), null);
console.log('literal pattern: same matches as the RegExp on edge cases and 300 random alternations in each link shape');
