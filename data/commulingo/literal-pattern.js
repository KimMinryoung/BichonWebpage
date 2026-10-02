// A drop-in for the literal alternations the linkers use: a RegExp built as
// `(tok1|tok2|…)` with the tokens sorted longest first, optionally wrapped in
// the English letter boundaries `(?<![\p{L}\p{N}_])(…)(?![\p{L}\p{N}_])`.
//
// V8 tries thousands of alternatives one after another at every position of
// the text, which made linking a report take up to a second. A character trie
// answers the same question by walking only as far as the text agrees with a
// token. The result is the regex's: at the leftmost position, the first
// alternative in source order that matches — with longest-first sorting, the
// longest token there (for English, the longest whose following character is
// not a letter, digit or underscore).
//
// Only what callers use is implemented natively: String#replace with a
// function, String#matchAll, exec/test. Anything else (a replacement string,
// split, search) delegates to the equivalent RegExp, built on first use.
// COMMULINGO_REGEX_PATTERNS=1 turns the trie off (callers keep the RegExp).

const WORD = /[\p{L}\p{N}_]/u;

function enabled() {
    return typeof process === 'undefined' || !process.env || process.env.COMMULINGO_REGEX_PATTERNS !== '1';
}

function buildTrie(tokens) {
    const root = { next: new Map(), end: false };
    for (const token of tokens) {
        let node = root;
        for (let i = 0; i < token.length; i++) {
            const code = token.charCodeAt(i);
            let child = node.next.get(code);
            if (!child) node.next.set(code, child = { next: new Map(), end: false });
            node = child;
        }
        node.end = true;
    }
    return root;
}

function isHigh(code) { return code >= 0xD800 && code <= 0xDBFF; }
function isLow(code) { return code >= 0xDC00 && code <= 0xDFFF; }

// The code point that ends just before `index` / starts at `index`, as a string.
function pointBefore(text, index) {
    if (index <= 0) return '';
    const low = text.charCodeAt(index - 1);
    if (isLow(low) && index >= 2 && isHigh(text.charCodeAt(index - 2))) return text.slice(index - 2, index);
    return text[index - 1];
}
function pointAt(text, index) {
    if (index >= text.length) return '';
    const high = text.charCodeAt(index);
    if (isHigh(high) && index + 1 < text.length && isLow(text.charCodeAt(index + 1))) return text.slice(index, index + 2);
    return text[index];
}

class LiteralPattern {
    // tokens: the alternatives in the regex's source order (longest first).
    constructor(tokens, { escape, unicode = false, boundary = false, group = false }) {
        this.tokens = tokens;
        this.escape = escape;
        this.unicode = unicode;
        this.boundary = boundary;
        this.group = group;
        this.flags = unicode ? 'gu' : 'g';
        this.global = true;
        this.lastIndex = 0;
        this.trie = buildTrie(tokens);
    }

    get source() {
        if (this._source === undefined) {
            const alternation = this.tokens.map(this.escape).join('|');
            const body = this.group ? '(' + alternation + ')' : alternation;
            this._source = this.boundary ? '(?<![\\p{L}\\p{N}_])' + body + '(?![\\p{L}\\p{N}_])' : body;
        }
        return this._source;
    }

    regex() {
        if (!this._regex) this._regex = new RegExp(this.source, this.flags);
        return this._regex;
    }

    // Length of the match starting at `index`, or -1.
    matchAt(text, index) {
        if (this.boundary && WORD.test(pointBefore(text, index))) return -1;
        let node = this.trie;
        let best = -1;
        let lengths = null;
        for (let i = index; i < text.length; i++) {
            node = node.next.get(text.charCodeAt(i));
            if (!node) break;
            if (node.end) {
                if (this.boundary) (lengths || (lengths = [])).push(i + 1 - index);
                else best = i + 1 - index;
            }
        }
        if (!this.boundary) return best;
        if (!lengths) return -1;
        for (let k = lengths.length - 1; k >= 0; k--) {
            if (!WORD.test(pointAt(text, index + lengths[k]))) return lengths[k];
        }
        return -1;
    }

    step(text, index) {
        return this.unicode && isHigh(text.charCodeAt(index)) && isLow(text.charCodeAt(index + 1)) ? 2 : 1;
    }

    // Next match at or after `from`: [index, length] or null.
    find(text, from) {
        for (let i = from; i < text.length; i += this.step(text, i)) {
            if (!this.trie.next.has(text.charCodeAt(i))) continue;
            const length = this.matchAt(text, i);
            if (length > 0) return [i, length];
        }
        return null;
    }

    result(text, index, length) {
        const match = text.slice(index, index + length);
        const out = this.group ? [match, match] : [match];
        out.index = index;
        out.input = text;
        out.groups = undefined;
        return out;
    }

    exec(text) {
        const value = String(text);
        const found = this.lastIndex <= value.length ? this.find(value, this.lastIndex) : null;
        if (!found) { this.lastIndex = 0; return null; }
        this.lastIndex = found[0] + found[1];
        return this.result(value, found[0], found[1]);
    }

    test(text) {
        return this.exec(text) !== null;
    }

    [Symbol.replace](text, replacer) {
        const value = String(text);
        if (typeof replacer !== 'function') return value.replace(this.regex(), replacer);
        this.lastIndex = 0;
        let out = '';
        let last = 0;
        for (let found = this.find(value, 0); found; found = this.find(value, found[0] + found[1])) {
            const [index, length] = found;
            const match = value.slice(index, index + length);
            out += value.slice(last, index);
            out += String(this.group ? replacer(match, match, index, value) : replacer(match, index, value));
            last = index + length;
        }
        return out + value.slice(last);
    }

    * [Symbol.matchAll](text) {
        const value = String(text);
        for (let found = this.find(value, 0); found; found = this.find(value, found[0] + found[1])) {
            yield this.result(value, found[0], found[1]);
        }
    }

    [Symbol.split](text, limit) { return String(text).split(this.regex(), limit); }
    [Symbol.search](text) { return String(text).search(this.regex()); }
    toString() { return '/' + this.source + '/' + this.flags; }
}

// null when the trie is off or cannot reproduce the regex (an empty token
// would match the empty string); the caller then builds its RegExp.
function createLiteralPattern(tokens, options) {
    if (!enabled() || !tokens.length || tokens.some(token => !token)) return null;
    return new LiteralPattern(tokens, options);
}

module.exports = { createLiteralPattern, LiteralPattern };
