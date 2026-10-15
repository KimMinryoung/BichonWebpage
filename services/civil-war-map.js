// The strategic map of the civil-war game (/games/civil-war/): the
// coastline-only event basemap with the Russian Civil War's control phases
// (event-control/civil-war), framed on European Russia, plus the screen
// position of every city the game draws on it. Built once per control
// document; the game's own layer is drawn by public/js/civil-war.js.
const { renderRegionMapSvg } = require('../data/commulingo/event-map-svg');
const { loadEventControl, presentEventControl } = require('../data/commulingo/event-control');
const DATA = require('../public/js/civil-war-data');

const BOX = { west: 19, east: 66, south: 42, north: 66 };
let cached = null;

function civilWarMap() {
    const control = loadEventControl('civil-war');
    if (cached && cached.control === control) return cached.map;
    const region = renderRegionMapSvg(BOX, control, '러시아 내전 작전 지도');
    const at = ([name, lat, lng]) => {
        const [x, y] = region.project(lat, lng);
        return { name, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    };
    const points = { moscow: at(DATA.moscow), fronts: {}, railways: [], lines: [] };
    for (const [id, front] of Object.entries(DATA.fronts)) points.fronts[id] = front.cities.map(at);
    // The railways go into the basemap (drawn once as the bitmap, over
    // history's control areas, under the game layer). Their names and
    // their lines (for routing the fronts along them) go with the points.
    const xy = ([lat, lng]) => region.project(lat, lng).map(v => Math.round(v * 10) / 10);
    const rails = DATA.railways.map(r => {
        points.lines.push(r.pts.map(xy));
        const pts = r.pts.map(p => xy(p).join(',')).join(' ');
        if (r.label) points.railways.push({ id: r.id, name: r.name, at: xy(r.label) });
        return `<polyline class="cw-railway-bed" points="${pts}"/><polyline class="cw-railway" points="${pts}"/>`;
    });
    const end = region.svg.lastIndexOf('</svg>');
    const svg = `${region.svg.slice(0, end)}<g class="cw-railways" aria-hidden="true">${rails.join('')}</g>\n${region.svg.slice(end)}`;
    const presented = presentEventControl(control, 'ko');
    const map = {
        svg, width: region.width, height: region.height, points,
        phases: presented ? presented.phases : [], sides: presented ? presented.sides : [],
    };
    cached = { control, map };
    return map;
}

module.exports = { civilWarMap };
