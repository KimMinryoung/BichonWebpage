const assert = require('node:assert/strict');
const { renderEventMapSvg } = require('../data/commulingo/event-map-svg');
const head = require('../data/commulingo/vendor/leaflet-polyline-decorator/arrow-head');
const { projectPatternOnPointPath, parseRelativeOrAbsoluteValue } = require('../data/commulingo/vendor/leaflet-polyline-decorator/pattern-utils');
const pattern = { offset: parseRelativeOrAbsoluteValue('100%'), endOffset: parseRelativeOrAbsoluteValue(0), repeat: parseRelativeOrAbsoluteValue(0) };
// Upstream must use the last nonzero segment, including paths with a repeated endpoint.
const [end] = projectPatternOnPointPath([{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:10,y:10}],pattern);
assert.deepEqual(end.pt,{x:10,y:10});
assert.equal(end.heading,180);
const wings=head(end,10,60);
assert.deepEqual(wings[1],end.pt);
assert(wings[0].y<10&&wings[2].y<10);
assert(Math.abs(Math.hypot(wings[0].x-wings[2].x,wings[0].y-wings[2].y)-10)<.001);
const label={ko:'검증',en:'Check'};
const locations=[{lat:40,lng:0,kind:'main',label},{lat:50,lng:20,label}];
const timeline=[.05,.5,8].map(d=>({geo:{kind:'arrow',points:[[45,5],[45,5+d]],variant:'axis'}}));
const {svg}=renderEventMapSvg(locations,'en','Check',timeline);
const shafts=[...svg.matchAll(/<path class="emap-arrow is-axis" d="([^"]+)" style="([^"]+)"/g)];
const tips=[...svg.matchAll(/<path class="emap-arrow-tip is-axis" d="([^"]+)" style="stroke-width:([^"]+)"/g)];
assert.equal(shafts.length,3);assert.equal(tips.length,3);
const spans=tips.map(([,path,stroke],i)=>{
 const c=path.match(/-?\d+(?:\.\d+)?/g).map(Number);
 const [lx,ly,tx,ty,rx,ry]=c;
 const span=Math.hypot(lx-rx,ly-ry);
 assert(span>Number(stroke)*3.8,'open wings must stand out from the shaft');
 assert(span<=12.01,'long routes have bounded heads');
 assert(tx>lx&&tx>rx,'eastward heads point east');
 const shaft=shafts[i][1].match(/-?\d+(?:\.\d+)?/g).map(Number);
 assert.deepEqual([tx,ty],shaft.slice(-2),'head must meet route endpoint');
 assert.match(shafts[i][2],/stroke-dasharray:none/);
 return span;
});
assert(spans[0]<spans[1]&&spans[1]<spans[2]);
const zero=renderEventMapSvg(locations,'en','Check',[{geo:{kind:'arrow',points:[[45,5],[45,5]]}}]).svg;
assert(!zero.includes('NaN'));assert(!zero.includes('class="emap-arrow-tip'));
// Place labels: a far-away label keeps its spot beside its marker; near
// ones move round their markers without covering each other or a marker.
const labelBoxes = svg => [...svg.matchAll(/<text class="emap-label[^"]*" x="([\d.]+)" y="([\d.]+)" text-anchor="(\w+)"[^>]*>([^<]+)/g)]
    .map(m => {
        const w = Array.from(m[4]).reduce((sum, ch) => sum + (ch.charCodeAt(0) > 0x2e80 ? 17 : 9), 0);
        const x = Number(m[1]);
        const x0 = m[3] === 'start' ? x : m[3] === 'end' ? x - w : x - w / 2;
        return { text: m[4], x, y: Number(m[2]), x0, x1: x0 + w, y0: Number(m[2]) - 13, y1: Number(m[2]) + 4 };
    });
const markerXYs = svg => [...svg.matchAll(/<circle class="emap-marker[^"]*" cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => [Number(m[1]), Number(m[2])]);
const spread = renderEventMapSvg([
    { lat: 55.75, lng: 37.62, label: { en: 'Moscow' } }, { lat: 55.3, lng: 38.4, label: { en: 'Kolomna' } },
    { lat: 55.9, lng: 38.1, label: { en: 'Sergiyev Posad' } },
    { lat: 52.29, lng: 104.28, label: { en: 'Irkutsk' } }, { lat: 43.12, lng: 131.89, label: { en: 'Vladivostok' } },
], 'en', 'Labels', []).svg;
const boxes = labelBoxes(spread);
const irkutsk = boxes.find(b => b.text === 'Irkutsk');
assert(markerXYs(spread).some(([x, y]) => Math.abs(y + 4 - irkutsk.y) < 0.2 && Math.abs(x + 9 - irkutsk.x) < 0.2),
    'a label with no neighbour stays beside its marker');
boxes.forEach((a, i) => boxes.slice(i + 1).forEach(b => assert(
    Math.min(a.x1, b.x1) <= Math.max(a.x0, b.x0) || Math.min(a.y1, b.y1) <= Math.max(a.y0, b.y0),
    `${a.text} and ${b.text} do not overlap`)));
for (const b of boxes) {
    assert(markerXYs(spread).every(([x, y]) => !(x > b.x0 + 2 && x < b.x1 - 2 && y > b.y0 + 2 && y < b.y1 - 2)),
        `${b.text} covers no marker`);
}
// Zooming out: the geography is nested and drawn past the frame.
const surround = spread.match(/data-surround="([-\d. ]+)"/);
assert(surround, 'the map carries its surround');
const [sx, sy, sw, sh] = surround[1].split(' ').map(Number);
assert(sx < 0 && sy < 0 && sw > 720 && sh > 0, 'the surround contains the frame');
assert.match(spread, /<svg class="emap-world" x="0" y="0" width="720"/);
console.log('event arrows: upstream heading, visible open heads, connected shafts, sizing and degenerate routes OK');
