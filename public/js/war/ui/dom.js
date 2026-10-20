/* DOM helpers of the war games' screen (war/ui/game.js): elements and
   svg nodes from a tag and attributes, links that open beside the game, svg
   markup as a node, signed numbers, a label's rough width, and the Korean
   particle after a scenario's word. */
(function (root) {
    'use strict';

    const SVG_NS = 'http://www.w3.org/2000/svg';

    function el(tag, attrs, ...children) {
        const node = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs || {})) {
            if (v === null || v === undefined || v === false) continue;
            if (k === 'class') node.className = v;
            else if (k === 'text') node.textContent = v;
            else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
            else node.setAttribute(k, v === true ? '' : v);
        }
        for (const child of children.flat()) {
            if (child === null || child === undefined || child === false) continue;
            node.append(child.nodeType ? child : document.createTextNode(String(child)));
        }
        return node;
    }

    function svg(tag, attrs, text) {
        const node = document.createElementNS(SVG_NS, tag);
        for (const [k, v] of Object.entries(attrs || {})) if (v !== null && v !== undefined) node.setAttribute(k, v);
        if (text !== undefined) node.textContent = text;
        return node;
    }

    // Reference links open beside the game, so reading one never ends a
    // season in progress.
    const NEW_TAB = { target: '_blank', rel: 'noopener' };

    function link([label, href]) {
        return el('a', Object.assign({ href }, NEW_TAB), label);
    }

    // An svg string from war/art.js as a node.
    function picture(markup) {
        const t = document.createElement('template');
        t.innerHTML = markup;
        return t.content.firstChild;
    }

    const signed = n => (n > 0 ? '+' : n < 0 ? '−' : '±') + Math.abs(n);

    // Rough width of a label: Hangul at full size, Latin and digits at ~0.6.
    const textWidth = (t, size) => Array.from(t).reduce((w, ch) => w + (ch.charCodeAt(0) > 0x2e80 ? size : size * 0.6), 0);

    // A Korean particle after a word from the scenario: a for a final
    // consonant (사단이, 곡물이), b without one (장갑열차를, 봉기가).
    // Closing quotes and brackets are read past (「강철 사단」이), digits as
    // read aloud (제1군이, 제2군이 → 군; 2호가).
    const josa = (word, a, b) => {
        const last = word.replace(/[」』)\]"'’”\s]+$/, '').slice(-1);
        if (/\d/.test(last)) return word + ('013678'.includes(last) ? a : b);
        const code = last.charCodeAt(0) - 0xac00;
        return word + (code >= 0 && code < 11172 && code % 28 ? a : b);
    };

    root.WarDom = { el, svg, link, picture, signed, josa, textWidth, NEW_TAB };
})(window);
