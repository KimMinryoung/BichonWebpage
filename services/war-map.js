// The strategic map of a war game (/games/<scenario>/): the coastline-only
// event basemap with the war's control phases (the scenario's
// map.control event-control document), framed on map.box, plus the
// screen position of the hub, every front's cities and the railways the
// game draws on it. Built once per scenario and control document; the
// game's own layer is drawn by public/js/war/ui/game.js.
const { renderRegionMapSvg } = require('../data/commulingo/event-map-svg');
const { loadEventControl, presentEventControl } = require('../data/commulingo/event-control');

const SCENARIOS = {
    'civil-war': require('../public/js/war/scenarios/civil-war'),
};
const cached = new Map();

function warMap(id) {
    const scenario = SCENARIOS[id];
    if (!scenario) throw new Error(`unknown war scenario ${id}`);
    const { box, control: controlId, title, hub, railways = [] } = scenario.map;
    const control = loadEventControl(controlId);
    const hit = cached.get(id);
    if (hit && hit.control === control) return hit.map;
    const region = renderRegionMapSvg(box, control, title);
    const at = ([name, lat, lng]) => {
        const [x, y] = region.project(lat, lng);
        return { name, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    };
    const points = { hub: at(hub), fronts: {}, railways: [], lines: [] };
    for (const [fid, front] of Object.entries(scenario.fronts)) points.fronts[fid] = front.cities.map(at);
    // The railways go into the basemap (drawn once as the bitmap, over
    // history's control areas, under the game layer). Their names and
    // their lines (for routing the fronts along them) go with the points.
    const xy = ([lat, lng]) => region.project(lat, lng).map(v => Math.round(v * 10) / 10);
    const rails = railways.map(r => {
        points.lines.push(r.pts.map(xy));
        const pts = r.pts.map(p => xy(p).join(',')).join(' ');
        if (r.label) points.railways.push({ id: r.id, name: r.name, at: xy(r.label) });
        return `<polyline class="cw-railway-bed" points="${pts}"/><polyline class="cw-railway" points="${pts}"/>`;
    });
    // Named places that are not front cities, and those beyond the frame
    // pinned to its edge where the line from the middle leaves it.
    points.places = (scenario.map.places || []).map(([name, lat, lng, kind, pos]) => Object.assign(at([name, lat, lng]), { kind, pos: pos || null }));
    const mid = [region.width / 2, region.height / 2];
    points.beyond = (scenario.map.beyond || []).map(([name, lat, lng]) => {
        const [x, y] = region.project(lat, lng);
        const dx = x - mid[0], dy = y - mid[1];
        const k = Math.min(Math.abs(mid[0] / (dx || 1e-9)), Math.abs(mid[1] / (dy || 1e-9)));
        const side = Math.abs(dx) * mid[1] >= Math.abs(dy) * mid[0] ? (dx > 0 ? 'east' : 'west') : (dy > 0 ? 'south' : 'north');
        return { name, side, x: Math.round((mid[0] + dx * k) * 10) / 10, y: Math.round((mid[1] + dy * k) * 10) / 10 };
    });
    const end = region.svg.lastIndexOf('</svg>');
    const svg = `${region.svg.slice(0, end)}<g class="cw-railways" aria-hidden="true">${rails.join('')}</g>\n${region.svg.slice(end)}`;
    const presented = presentEventControl(control, 'ko');
    const map = {
        svg, width: region.width, height: region.height, points,
        phases: presented ? presented.phases : [], sides: presented ? presented.sides : [],
    };
    cached.set(id, { control, map });
    return map;
}

module.exports = { warMap, SCENARIOS };
