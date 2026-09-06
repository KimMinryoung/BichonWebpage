// Walk trusted/rendered fragments without rewriting their HTML. Quoted '>' and
// comments are tokens, never prose. Keep paragraph context across inline tags.
const TOKEN = /<!--[\s\S]*?-->|<\/?[A-Za-z][^>"']*(?:(?:"[^"]*"|'[^']*')[^>"']*)*>|<![^>]*>|[^<]+|</g;
const BLOCK = /^(?:p|div|li|td|th|tr|h[1-6]|blockquote|section|article|br|hr)$/;
const LITERAL = new Set(['code', 'pre', 'script', 'style', 'textarea']);

function tagInfo(token) {
    const match = token.match(/^<\s*(\/?)\s*([a-zA-Z0-9]+)/);
    return match ? { name: match[2].toLowerCase(), close: Boolean(match[1]), self: /\/\s*>$/.test(token) } : null;
}
function attributes(tag) {
    const out = Object.create(null);
    const rest = tag.replace(/^<\/?[\w-]+/, '').replace(/\/?\s*>$/, '');
    for (const m of rest.matchAll(/([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
        out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
    }
    return out;
}
function decode(text) {
    return text.replace(/&(?:amp|quot|apos|lt|gt|nbsp|#\d+|#x[\da-f]+);/gi, entity => {
        const named = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&nbsp;': ' ' };
        if (named[entity.toLowerCase()]) return named[entity.toLowerCase()];
        const n = entity[2].toLowerCase() === 'x' ? parseInt(entity.slice(3, -1), 16) : parseInt(entity.slice(2, -1), 10);
        return n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : entity;
    });
}
function walk(html, onText, onTag) {
    const output = [];
    let group = { text: '', nodes: [] };
    let literals = 0, anchors = 0;
    const flush = () => {
        for (const node of group.nodes) {
            if (!node.skip) output[node.index] = onText(node.text, { text: group.text, offset: node.offset });
        }
        group = { text: '', nodes: [] };
    };
    for (const m of String(html).matchAll(TOKEN)) {
        const value = m[0], tag = tagInfo(value);
        const index = output.length;
        output.push(value);
        if (tag) {
            if (BLOCK.test(tag.name) || LITERAL.has(tag.name)) flush();
            if (onTag) output[index] = onTag(value, tag, { literal: literals > 0 });
            if (LITERAL.has(tag.name)) literals = Math.max(0, literals + (tag.close ? -1 : tag.self ? 0 : 1));
            if (tag.name === 'a') anchors = Math.max(0, anchors + (tag.close ? -1 : tag.self ? 0 : 1));
        } else if (!value.startsWith('<') && !literals) {
            // Blank lines are paragraph boundaries in raw prose too.
            if (/\n\s*\n/.test(value)) {
                flush();
                output[index] = value.split(/(\n\s*\n)/).map(part => /\n\s*\n/.test(part) || anchors
                    ? part : onText(part, { text: part, offset: 0 })).join('');
            } else {
                group.nodes.push({ index, text: value, offset: group.text.length, skip: anchors > 0 });
                group.text += value;
            }
        }
    }
    flush();
    return output.join('');
}

module.exports = { walk, attributes, decode };
