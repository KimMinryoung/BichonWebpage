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
// Place labels: a far-away label keeps its own line; near ones stack apart.
const labelYs = svg => [...svg.matchAll(/<text class="emap-label[^"]*" x="[\d.]+" y="([\d.]+)"[^>]*>([^<]+)/g)]
    .reduce((o, m) => ({ ...o, [m[2]]: Number(m[1]) }), {});
const markerYs = svg => [...svg.matchAll(/<circle class="emap-marker[^"]*" cx="[\d.]+" cy="([\d.]+)"/g)].map(m => Number(m[1]));
const spread = renderEventMapSvg([
    { lat: 55.75, lng: 37.62, label: { en: 'Moscow' } }, { lat: 55.3, lng: 38.4, label: { en: 'Kolomna' } },
    { lat: 52.29, lng: 104.28, label: { en: 'Irkutsk' } }, { lat: 43.12, lng: 131.89, label: { en: 'Vladivostok' } },
], 'en', 'Labels', []).svg;
const ys = labelYs(spread);
const irkutskMarker = markerYs(spread).find(y => Math.abs(y + 4 - ys.Irkutsk) < 0.2);
assert(irkutskMarker !== undefined, 'a label with no neighbour stays beside its marker');
assert(Math.abs(ys.Moscow - ys.Kolomna) >= 18.5, 'overlapping neighbours stack apart');
console.log('event arrows: upstream heading, visible open heads, connected shafts, sizing and degenerate routes OK');
