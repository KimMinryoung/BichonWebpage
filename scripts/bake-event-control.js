#!/usr/bin/env node
// Bake the event map's territorial-control phases.
//
// Reads each scripts/content/event-control/<eventId>.js (phases composed of
// traced areas, hand-drawn polygons, circles and railway corridors) and
// resolves it into disjoint per-side areas inside the region (the event's
// Natural Earth units and coastal waters, less neighbouring land), so the
// renderer only projects rings and clips them to its coastline.
//
// Usage:
//   node scripts/bake-event-control.js <ne_50m_admin_0_map_units.geojson>
// Source: https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_map_units.geojson
// Requires the polygon-clipping devDependency (bake time only).
//
// Output data/commulingo/event-control/<eventId>.json:
//   { eventId, base, region: [ring, ...], sides: [{ id, label }], note, sources,
//     phases: [{ date: 'YYYY.MM', label, traced, areas: { side: [ring, ...] } }] }
// where a ring is a flat [lng, lat, ...] outline rounded to 0.01°. The
// region is drawn once in the base side's colour (whatever no other side
// holds); each phase's other sides are even-odd paths on top and never
// overlap one another.

const fs = require('fs');
const path = require('path');
const pc = require('polygon-clipping');

// polygon-clipping 0.15 can recurse without end (RingOut.enclosingRing) on
// nearly coincident vertices, which the traced grid rings and the Natural
// Earth coast produce. Snapping every operand and result to 1e-4° avoids it.
const snap = geom => geom.map(poly => poly.map(ring => ring.map(([x, y]) => [
    Math.round(x * 1e4) / 1e4, Math.round(y * 1e4) / 1e4,
])));
const clip = name => (...geoms) => snap(pc[name](...geoms.map(snap)));
const union = clip('union');
const intersection = clip('intersection');
const difference = clip('difference');
const xor = clip('xor');

const CONTENT_DIR = path.join(__dirname, 'content', 'event-control');
const OUT_DIR = path.join(__dirname, '..', 'data', 'commulingo', 'event-control');
// Degrees. The event map draws no borders, so a control boundary on land is
// the only line there and can be coarse; the coast comes from the basemap.
const SIMPLIFY = 0.08;
const MIN_AREA = 0.004;  // square degrees; smaller slivers are dropped

function simplifyRing(ring, tol) {
    if (ring.length < 8) return ring;
    const keep = new Uint8Array(ring.length);
    const far = Math.floor(ring.length / 2);
    keep[0] = keep[far] = keep[ring.length - 1] = 1;
    const rec = (a, b) => {
        const [x1, y1] = ring[a];
        const [x2, y2] = ring[b];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const L = Math.hypot(dx, dy) || 1e-9;
        let best = -1, bi = -1;
        for (let i = a + 1; i < b; i++) {
            const d = Math.abs(dy * ring[i][0] - dx * ring[i][1] + x2 * y1 - y2 * x1) / L;
            if (d > best) { best = d; bi = i; }
        }
        if (best > tol) { keep[bi] = 1; rec(a, bi); rec(bi, b); }
    };
    rec(0, far);
    rec(far, ring.length - 1);
    return ring.filter((_, i) => keep[i]);
}

function ringArea(ring) {
    let a = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        a += (ring[j][0] + ring[i][0]) * (ring[j][1] - ring[i][1]);
    }
    return Math.abs(a / 2);
}

// The region the sides divide: the event's own Natural Earth units plus its
// coastal waters (spec.sea), less every other country's land. The areas may
// therefore run out to sea; the renderer clips them to the drawn coastline,
// so no phase repeats the coast's thousands of vertices. Only land borders
// with neighbours stay exact.
function regionGeometry(geojsonPath, codes, sea) {
    const geo = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
    const own = [];
    const others = [];
    for (const feature of geo.features) {
        const mine = codes.includes(feature.properties.ADM0_A3);
        const [x0, y0, x1, y1] = feature.bbox || [-180, -90, 180, 90];
        if (!mine && (x1 < 60 || x0 > 150 || y1 < 5 || y0 > 60)) continue;
        const g = feature.geometry;
        const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
        for (const poly of polys) {
            const rings = poly.map(r => simplifyRing(r, SIMPLIFY)).filter(r => r.length >= 4);
            if (rings.length) (mine ? own : others).push([rings]);
        }
    }
    if (!own.length) throw new Error(`no Natural Earth units ${codes.join(', ')}`);
    const land = union(...own);
    const waters = sea ? [[toRing(sea)]] : [];
    return difference(waters.length ? union(land, waters) : land, union(...others));
}

// [lat, lng] authoring coordinates -> [lng, lat] ring.
const toRing = points => points.map(([lat, lng]) => [lng, lat]);

function circlePolygon([lat, lng, r]) {
    const k = Math.cos(lat * Math.PI / 180);
    const ring = [];
    for (let i = 0; i < 32; i++) {
        const t = (i / 32) * 2 * Math.PI;
        ring.push([lng + (r / k) * Math.cos(t), lat + r * Math.sin(t)]);
    }
    return [[ring]];
}

// A buffered railway line: one quad per segment plus a round joint at each
// town, in a locally isotropic frame (degrees of latitude).
function corridorPolygon(points, width) {
    const parts = points.map(p => circlePolygon([p[0], p[1], width]));
    for (let i = 0; i < points.length - 1; i++) {
        const [la1, lo1] = points[i];
        const [la2, lo2] = points[i + 1];
        const k = Math.cos(((la1 + la2) / 2) * Math.PI / 180);
        const dx = (lo2 - lo1) * k;
        const dy = la2 - la1;
        const L = Math.hypot(dx, dy) || 1e-9;
        const nx = (-dy / L) * width;
        const ny = (dx / L) * width;
        parts.push([[[
            [lo1 + nx / k, la1 + ny], [lo2 + nx / k, la2 + ny],
            [lo2 - nx / k, la2 - ny], [lo1 - nx / k, la1 - ny],
        ]]]);
    }
    return union(...parts);
}

// Traced rings are an even-odd set: XOR turns them into a proper multipolygon.
function tracedGeometry(rings) {
    if (!rings || !rings.length) return [];
    return xor(...rings.map(r => [[r]]));
}

function resolveItem(item, side, phase, traced) {
    if (item === 'traced') return tracedGeometry((traced.phases[phase.date] || {})[side]);
    if (item && item.traced) return tracedGeometry((traced.phases[item.traced] || {}).ccp);
    if (item && item.circle) return circlePolygon(item.circle);
    if (item && item.corridor) return corridorPolygon(item.corridor, item.width);
    if (Array.isArray(item) && Array.isArray(item[0])) return [[toRing(item)]];
    throw new Error(`${phase.date} ${side}: unknown area item ${JSON.stringify(item).slice(0, 80)}`);
}

function unionOf(items, side, phase, traced) {
    const geoms = (items || []).map(item => resolveItem(item, side, phase, traced)).filter(g => g.length);
    if (!geoms.length) return [];
    return union(...geoms);
}

const minus = (a, ...bs) => {
    const rest = bs.filter(b => b.length);
    return a.length && rest.length ? difference(a, ...rest) : a;
};
const within = (a, region) => (a.length ? intersection(a, region) : []);

function flatten(multi) {
    const rings = [];
    for (const poly of multi) {
        poly.forEach((ring, index) => {
            // Keep holes regardless of size only when their shell survives.
            if (index === 0 && ringArea(ring) < MIN_AREA) return;
            if (index > 0 && ringArea(ring) < MIN_AREA / 4) return;
            const flat = [];
            let prev = null;
            for (const [lng, lat] of simplifyRing(ring, SIMPLIFY / 2)) {
                const x = Number(lng.toFixed(2));
                const y = Number(lat.toFixed(2));
                if (prev && prev[0] === x && prev[1] === y) continue;
                flat.push(x, y);
                prev = [x, y];
            }
            if (flat.length >= 8) rings.push(flat);
        });
    }
    return rings;
}

function bakeEvent(spec, ne) {
    const traced = spec.traced
        ? JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, spec.traced), 'utf8'))
        : { phases: {} };
    const region = regionGeometry(ne, spec.region, spec.sea);
    const used = new Set();
    const phases = spec.phases.map(phase => {
        const other = within(unionOf(phase.other, 'other', phase, traced), region);
        const soviet = minus(within(unionOf(phase.soviet, 'soviet', phase, traced), region), other);
        const ccp = minus(within(minus(unionOf(phase.ccp, 'ccp', phase, traced),
            unionOf(phase.kmt, 'kmt', phase, traced)), region), other, soviet);
        const japan = minus(within(unionOf(phase.japan, 'japan', phase, traced), region), other, soviet, ccp);
        // The Nationalist share is the remainder: the renderer lays the whole
        // region down in its colour once and draws the other sides on top,
        // so no shared boundary is stored twice.
        const areas = {};
        for (const [side, geom] of Object.entries({ ccp, japan, soviet, other })) {
            const rings = flatten(geom);
            if (rings.length) { areas[side] = rings; used.add(side); }
        }
        return { date: phase.date, label: phase.label, traced: Boolean(phase.traced), areas };
    });
    used.add(spec.base);
    return {
        eventId: spec.eventId,
        base: spec.base,
        region: flatten(region),
        sides: spec.sides.filter(side => used.has(side.id)),
        note: spec.note,
        sources: spec.sources,
        phases,
    };
}

function main() {
    const ne = process.argv[2];
    if (!ne) {
        console.error('usage: node scripts/bake-event-control.js <ne_50m_admin_0_map_units.geojson>');
        process.exit(2);
    }
    fs.mkdirSync(OUT_DIR, { recursive: true });
    for (const file of fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.js')).sort()) {
        const spec = require(path.join(CONTENT_DIR, file));
        const baked = bakeEvent(spec, ne);
        const target = path.join(OUT_DIR, `${spec.eventId}.json`);
        const text = JSON.stringify(baked) + '\n';
        // data/ is live-mounted in production: write beside, then rename.
        fs.writeFileSync(target + '.tmp', text);
        fs.renameSync(target + '.tmp', target);
        const points = baked.phases.reduce((s, p) => s + Object.values(p.areas)
            .reduce((t, rings) => t + rings.reduce((u, r) => u + r.length / 2, 0), 0), 0);
        console.log(`${spec.eventId}: ${baked.phases.length} phases, ${points} points, ${(text.length / 1024).toFixed(0)} KB`);
    }
}

if (require.main === module) main();
module.exports = { regionGeometry, bakeEvent, corridorPolygon, circlePolygon };
