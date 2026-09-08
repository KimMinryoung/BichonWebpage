const assert = require('node:assert/strict');
const { renderEventMapSvg } = require('../data/commulingo/event-map-svg');

const label = { ko: '검증', en: 'Check' };
const locations = [
    { lat: 40, lng: 0, kind: 'main', label },
    { lat: 50, lng: 20, label },
];
const timeline = [0.01, 0.5, 8].map(distance => ({
    geo: { kind: 'arrow', points: [[45, 5], [45, 5 + distance]], variant: 'axis', actor: label },
}));
const { svg } = renderEventMapSvg(locations, 'en', 'Check', timeline);
const paths = [...svg.matchAll(/<path class="emap-arrow is-axis" d="([^"]+)" style="([^"]+)" marker-end="url\(#([^)]*)\)"/g)];
assert.equal(paths.length, 3);
const sizes = paths.map(([, path, style, id]) => {
    const marker = svg.match(new RegExp(`<marker id="${id}"[^>]+>`))[0];
    assert.match(marker, /markerUnits="userSpaceOnUse"/, 'stroke changes must not inflate heads');
    const size = Number(marker.match(/markerWidth="([^"]+)"/)[1]);
    const coords = path.match(/-?\d+(?:\.\d+)?/g).map(Number);
    const distance = Math.hypot(coords.at(-2) - coords[0], coords.at(-1) - coords[1]);
    assert(size <= distance * 0.25 + 0.04, 'head must leave most of a short route visible');
    assert(size <= 8, 'long routes must not grow oversized heads');
    assert(Number(style.match(/stroke-width:([^;]+)/)[1]) <= size / 3 + 0.001);
    return size;
});
assert(sizes[0] < sizes[1] && sizes[1] < sizes[2]);
const degenerate = renderEventMapSvg(locations, 'en', 'Check', [{ geo: {
    kind: 'arrow', points: [[45, 5], [45, 5]],
} }]).svg;
assert(!degenerate.includes('NaN'));
assert(!degenerate.includes('<path class="emap-arrow'), 'zero-length route has no misleading head');
console.log('event arrows: short/long proportions, mobile-independent heads and zero-length routes OK');
