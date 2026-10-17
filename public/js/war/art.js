/* global module */
/* Pictures of the war games: poster-style portraits of the people who
   speak or advise, and the factions' shields. Drawn, not photographs: a
   head in paper tone on a disc of the speaker's side, with the few marks
   that made each of them recognisable on a poster (glasses, a goatee, a
   papakha, a naval cap). Returns svg strings, so the screen can set them as
   markup and Node can test them.

   WarArt.create(scenario) draws a scenario's people (scenario.portraits:
   id → { side, hair, face, glasses, beard, moustache, cap }, the values
   below) and factions (scenario.factions[id]: flag stripes or kind, and
   sign, one of SIGNS; the White cross when none). */
(function (root) {
    'use strict';

    const INK = '#1d1d1b';
    const PAPER = '#f1e6cf';
    const RED = '#a21e2a';
    const SIDE = { red: RED, white: '#e8e4da', interv: '#2f6fb8', central: '#c7861c', national: '#8d8d86', black: '#2b2b28' };

    const esc = text => String(text).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

    // A head on a 40×40 square. Paper face and collar, ink features.
    function portrait(people, id, label) {
        const p = people[id] || { side: 'red' };
        const disc = SIDE[p.side] || RED;
        const long = p.face === 'long';
        const out = [];
        out.push(`<rect width="40" height="40" fill="${disc}"/>`);
        // Shoulders and collar.
        out.push(`<path d="M5 40c1-8 7-11 15-11s14 3 15 11z" fill="${INK}"/>`);
        out.push(`<path d="M15 29l5 6 5-6" fill="none" stroke="${PAPER}" stroke-width="1.6"/>`);
        // Hair behind the head.
        if (p.hair === 'shock') out.push(`<path d="M10 17c-1-7 4-11 10-11s11 4 10 11l-2 2c0-4-2-7-8-7s-8 3-8 7z" fill="${INK}"/>`);
        if (p.hair === 'long') out.push(`<path d="M10 18c-1-8 4-12 10-12s11 4 10 12l1 9-4-2-1-9h-12l-1 9-4 2z" fill="${INK}"/>`);
        if (p.hair === 'bun') out.push(`<circle cx="20" cy="7" r="4" fill="${INK}"/><path d="M11 17c0-6 4-9 9-9s9 3 9 9c-2-3-5-5-9-5s-7 2-9 5z" fill="${INK}"/>`);
        // Neck and face.
        out.push(`<rect x="17" y="24" width="6" height="6" fill="${PAPER}"/>`);
        out.push(long ? `<ellipse cx="20" cy="18" rx="7" ry="9.5" fill="${PAPER}"/>` : `<ellipse cx="20" cy="18" rx="8" ry="8.8" fill="${PAPER}"/>`);
        if (p.hair === 'swept') out.push(`<path d="M12 16c0-6 4-8 8-8 5 0 8 2 8 7-3-3-7-4-11-3z" fill="${INK}"/>`);
        if (p.hair === 'bald') out.push(`<path d="M12 17c-1 2-1 4 0 5M28 17c1 2 1 4 0 5" stroke="${INK}" stroke-width="1.6" fill="none"/>`);
        // Eyes and brows.
        out.push(`<circle cx="16.8" cy="18" r=".95" fill="${INK}"/><circle cx="23.2" cy="18" r=".95" fill="${INK}"/>`);
        out.push(`<path d="M15 15.8h3.4M21.6 15.8h3.4" stroke="${INK}" stroke-width=".9"/>`);
        if (p.glasses === 'round') out.push(`<g fill="none" stroke="${INK}" stroke-width=".9"><circle cx="16.8" cy="18" r="2.3"/><circle cx="23.2" cy="18" r="2.3"/><path d="M19.1 18h1.8"/></g>`);
        if (p.glasses === 'pince') out.push(`<g fill="none" stroke="${INK}" stroke-width=".7"><ellipse cx="16.8" cy="18" rx="2" ry="1.7"/><ellipse cx="23.2" cy="18" rx="2" ry="1.7"/><path d="M18.8 17.6q1.2-1 2.4 0"/></g>`);
        // Beard, then moustache over it.
        if (p.beard === 'goatee') out.push(`<path d="M17.5 24.5c1 4 4 4 5 0z" fill="${INK}"/>`);
        if (p.beard === 'short') out.push(`<path d="M13 21c1 6 4 7.5 7 7.5s6-1.5 7-7.5c-2 2-4 2.5-7 2.5s-5-.5-7-2.5z" fill="${INK}"/>`);
        if (p.beard === 'pointed') out.push(`<path d="M13.5 21.5c1 4 4 8 6.5 9 2.5-1 5.5-5 6.5-9-2 1.6-4 2.2-6.5 2.2s-4.5-.6-6.5-2.2z" fill="${INK}"/>`);
        if (p.beard === 'full') out.push(`<path d="M12.5 19c0 7 3.5 10.5 7.5 10.5s7.5-3.5 7.5-10.5c-1.5 3-4 4.5-7.5 4.5s-6-1.5-7.5-4.5z" fill="${INK}"/>`);
        if (p.moustache === 'great') out.push(`<path d="M20 21.6c-2-1-5-1-8 1.4 3 0 5 .2 8-.4 3 .6 5 .4 8 .4-3-2.4-6-2.4-8-1.4z" fill="${INK}"/>`);
        else if (p.moustache) out.push(`<path d="M16.5 22.4c1.6-1.2 5.4-1.2 7 0-2.3.4-4.7.4-7 0z" fill="${INK}"/>`);
        else out.push(`<path d="M18 23.4h4" stroke="${INK}" stroke-width=".8"/>`);
        // Headgear.
        if (p.cap === 'budenovka') out.push(`<path d="M11 14c0-6 4-9.5 9-11.5 5 2 9 5.5 9 11.5z" fill="${INK}"/><path d="M20 2.2v-1.2" stroke="${INK}" stroke-width="1.6"/><path d="M20 6.2l1 2.3h2.4l-2 1.5.8 2.4-2.2-1.5-2.2 1.5.8-2.4-2-1.5h2.4z" fill="${RED}"/>`);
        if (p.cap === 'peaked') out.push(`<path d="M10.5 12.5c0-4 4-6 9.5-6s9.5 2 9.5 6z" fill="${INK}"/><path d="M11 12.5h18l-3 2.4h-12z" fill="${INK}"/><circle cx="20" cy="10.4" r="1.1" fill="${PAPER}"/>`);
        if (p.cap === 'naval') out.push(`<path d="M10 12c0-4 4-6 10-6s10 2 10 6z" fill="${PAPER}" stroke="${INK}" stroke-width=".8"/><path d="M11 12h18v2.2h-18z" fill="${INK}"/><path d="M14 14.2h12l-2 1.6h-8z" fill="${INK}"/><circle cx="20" cy="13.1" r="1" fill="#e8b10c"/>`);
        if (p.cap === 'papakha') out.push(`<path d="M11 13.5v-8c3-2 15-2 18 0v8c-4-1.2-14-1.2-18 0z" fill="${INK}"/><path d="M12.5 6.5h15" stroke="${PAPER}" stroke-width=".5" stroke-dasharray="1 1.4"/>`);
        if (p.cap === 'worker') out.push(`<path d="M11 13c0-5 4-7.5 9-7.5s9 2.5 9 7.5z" fill="${INK}"/><path d="M11.5 13h15l2.5 1.7h-15z" fill="${INK}"/>`);
        if (p.cap === 'maciejowka') out.push(`<path d="M11 13l1-6h16l1 6z" fill="#5b6a52"/><path d="M11 13h18l-2.5 2h-13z" fill="${INK}"/><path d="M12 7h16" stroke="${INK}" stroke-width=".6"/>`);
        return svgOf(out.join(''), label);
    }

    // A faction's shield: its flag's stripes (or its side's colour), and an
    // ink sign of what it was: a legion's rails, the interventionists'
    // anchor, the White cross, an eagle, a trident.
    const SIGNS = {
        rails: `<g fill="none" stroke="${INK}" stroke-width="1.4"><path d="M13 30l4-16M27 30l-4-16"/><path d="M14 26h12M15 21.5h10M16 17h8"/></g>`,
        anchor: `<g fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"><circle cx="20" cy="13" r="2"/><path d="M20 15v15M15.5 18h9M13 24c1 4 4 6 7 6s6-2 7-6"/></g>`,
        'iron-cross': `<path d="M17.5 12h5v5.5h5.5v5h-5.5v5.5h-5v-5.5h-5.5v-5h5.5z" fill="${INK}"/>`,
        eagle: `<path d="M20 12c-2 0-3 1.5-3 3l-4-2 1.5 4-3 1 4 2-1 5 4.5-2 1 5 1-5 4.5 2-1-5 4-2-3-1 1.5-4-4 2c0-1.5-1-3-3-3z" fill="${INK}"/>`,
        trident: `<path d="M20 11v18M14 13v9c0 3 2.5 5 6 5s6-2 6-5v-9M17 18v5M23 18v5" fill="none" stroke="${INK}" stroke-width="1.6"/>`,
        charter: `<g fill="none" stroke="${INK}" stroke-width="1.4"><path d="M13 14h14v14h-14z"/><path d="M16 18h8M16 21.5h8M16 25h5"/></g>`,
        sabres: `<g fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round"><path d="M13 29l14-16M27 29l-14-16"/><path d="M12 25l3 3M28 25l-3 3"/></g>`,
    };
    const cross = `<path d="M18.5 12h3v6.5h6.5v3h-6.5v8.5h-3v-8.5h-6.5v-3h6.5z" fill="${INK}"/>`;

    let seq = 0;    // clip ids stay unique however many shields are drawn
    function shield(id, faction, label) {
        const out = [];
        const clip = `cwsh-${id}-${++seq}`;
        const SH = 'M8 6h24v13c0 9-6 14-12 16-6-2-12-7-12-16z';
        out.push(`<clipPath id="${clip}"><path d="${SH}"/></clipPath>`);
        const stripes = faction.flag || [SIDE[faction.kind] || SIDE.white];
        const h = 30 / stripes.length;
        out.push(`<g clip-path="url(#${clip})">${stripes.map((c, i) => `<rect x="8" y="${(6 + i * h).toFixed(2)}" width="24" height="${(h + 0.2).toFixed(2)}" fill="${c}"/>`).join('')}</g>`);
        out.push(`<path d="${SH}" fill="none" stroke="${INK}" stroke-width="1.6"/>`);
        // The sign sits on a paper patch so it reads on any stripe.
        out.push(`<circle cx="20" cy="20.5" r="9.5" fill="${PAPER}" stroke="${INK}" stroke-width=".8"/>`);
        out.push(`<g transform="translate(20 20.5) scale(.62) translate(-20 -21)">${SIGNS[faction.sign] || cross}</g>`);
        return svgOf(out.join(''), label);
    }

    function svgOf(body, label) {
        const a11y = label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"';
        return `<svg class="cw-face" viewBox="0 0 40 40" ${a11y}>${body}</svg>`;
    }

    function create(scenario) {
        const people = scenario.portraits || {};
        return { people, portrait: (id, label) => portrait(people, id, label), shield };
    }

    const Art = { create, SIGNS, SIDE };
    if (typeof module !== 'undefined' && module.exports) module.exports = Art;
    else root.WarArt = Art;
}(typeof window !== 'undefined' ? window : globalThis));
