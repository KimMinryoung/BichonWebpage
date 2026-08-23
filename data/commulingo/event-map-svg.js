// Server-side SVG renderer for the historical-event location map.
//
// Deliberately a coastline-only map: modern national borders under a 1917
// event would be an anachronism, so the base layer is Natural Earth land
// (baked by scripts/bake-event-basemap.js) and nothing else. The frame is
// fitted to the event's markers with padding, so a city-scale event shows its
// region and a continent-scale war shows the continent; a small world inset
// locates the frame on the globe. All colors come from CSS classes
// (commulingo.css) so the map follows the site theme.
const { localize } = require('./localize');

const BASEMAP = require('./event-basemap.json');

const WIDTH = 720;
const MIN_HEIGHT = 300;
const MAX_HEIGHT = 460;
const PAD_FACTOR = 1.6;     // frame span = marker span × this (≥30% air each side)
const MIN_LAT_SPAN = 7;     // one city marker still gets a regional frame
const MIN_LON_SPAN = 10;
const LOW_RES_LON_SPAN = 100;  // wider frames use the 110m rings
const INSET_W = 126;
const INSET_LAT_TOP = 84;   // world inset crops the empty polar bands
const INSET_LAT_BOTTOM = -60;

function esc(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// Rings as point arrays with precomputed bboxes, unpacked once per process.
let unpacked = null;
function rings(level) {
    if (!unpacked) {
        const unpack = flats => flats.map(flat => {
            const pts = [];
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (let i = 0; i < flat.length; i += 2) {
                const x = flat[i];
                const y = flat[i + 1];
                pts.push([x, y]);
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
            }
            return { pts, minX, maxX, minY, maxY };
        });
        unpacked = {
            low: unpack(BASEMAP.low), high: unpack(BASEMAP.high),
            rivers: unpack(BASEMAP.rivers || []), lakes: unpack(BASEMAP.lakes || []),
        };
    }
    return unpacked[level];
}

// Sutherland–Hodgman against an axis-aligned rect (convex, so the clipped
// output is the exact intersection). Points are [lng, lat].
function clipRing(pts, x0, x1, y0, y1) {
    const edges = [
        p => p[0] >= x0, p => p[0] <= x1,
        p => p[1] >= y0, p => p[1] <= y1,
    ];
    const cross = [
        (a, b) => [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])],
        (a, b) => [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])],
        (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0],
        (a, b) => [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1],
    ];
    let output = pts;
    for (let e = 0; e < 4 && output.length; e++) {
        const input = output;
        output = [];
        let prev = input[input.length - 1];
        let prevIn = edges[e](prev);
        for (const point of input) {
            const curIn = edges[e](point);
            if (curIn !== prevIn) output.push(cross[e](prev, point));
            if (curIn) output.push(point);
            prev = point;
            prevIn = curIn;
        }
    }
    return output;
}

// Land inside the frame as one evenodd path (lake rings punch their holes).
// Frames can extend past 180° for dateline-spanning events (the Pacific War),
// so every ring is also tried shifted a world-width to either side.
function landPath(level, frame, project) {
    const parts = [];
    for (const ring of rings(level)) {
        for (const shift of [-360, 0, 360]) {
            if (ring.minX + shift > frame.x1 || ring.maxX + shift < frame.x0) continue;
            if (ring.minY > frame.y1 || ring.maxY < frame.y0) continue;
            const pts = shift === 0 ? ring.pts : ring.pts.map(p => [p[0] + shift, p[1]]);
            const clipped = clipRing(pts, frame.x0, frame.x1, frame.y0, frame.y1);
            if (clipped.length < 3) continue;
            const coords = clipped.map(p => {
                const [x, y] = project(p[0], p[1]);
                return `${x.toFixed(1)} ${y.toFixed(1)}`;
            });
            parts.push(`M${coords.join('L')}Z`);
        }
    }
    return parts.join('');
}

// Liang–Barsky: the part of segment a→b inside the rect, or null.
function clipSegment(a, b, x0, x1, y0, y1) {
    let t0 = 0;
    let t1 = 1;
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const p = [-dx, dx, -dy, dy];
    const q = [a[0] - x0, x1 - a[0], a[1] - y0, y1 - a[1]];
    for (let i = 0; i < 4; i++) {
        if (p[i] === 0) {
            if (q[i] < 0) return null;
            continue;
        }
        const r = q[i] / p[i];
        if (p[i] < 0) {
            if (r > t1) return null;
            if (r > t0) t0 = r;
        } else {
            if (r < t0) return null;
            if (r < t1) t1 = r;
        }
    }
    return [[a[0] + t0 * dx, a[1] + t0 * dy], [a[0] + t1 * dx, a[1] + t1 * dy]];
}

// Rivers and lakes, drawn only on regional frames — a campaign's geography
// (the Volga at Stalingrad, Ladoga at Leningrad) is often the point of the
// map, but at world scale they are noise. Returns '' at low res.
function waterLayers(level, frame, project) {
    if (level !== 'high') return '';
    const parts = [];
    const lakeCoords = [];
    for (const ring of rings('lakes')) {
        if (ring.minX > frame.x1 || ring.maxX < frame.x0) continue;
        if (ring.minY > frame.y1 || ring.maxY < frame.y0) continue;
        const clipped = clipRing(ring.pts, frame.x0, frame.x1, frame.y0, frame.y1);
        if (clipped.length < 3) continue;
        lakeCoords.push('M' + clipped.map(p => {
            const [x, y] = project(p[0], p[1]);
            return `${x.toFixed(1)} ${y.toFixed(1)}`;
        }).join('L') + 'Z');
    }
    if (lakeCoords.length) parts.push(`<path class="emap-lake" d="${lakeCoords.join('')}"/>`);
    const riverCoords = [];
    for (const river of rings('rivers')) {
        if (river.minX > frame.x1 || river.maxX < frame.x0) continue;
        if (river.minY > frame.y1 || river.maxY < frame.y0) continue;
        let pen = null;
        let d = '';
        for (let i = 0; i < river.pts.length - 1; i++) {
            const seg = clipSegment(river.pts[i], river.pts[i + 1], frame.x0, frame.x1, frame.y0, frame.y1);
            if (!seg) { pen = null; continue; }
            const [ax, ay] = project(seg[0][0], seg[0][1]);
            const [bx, by] = project(seg[1][0], seg[1][1]);
            if (!pen || Math.abs(pen[0] - ax) > 0.2 || Math.abs(pen[1] - ay) > 0.2) {
                d += `M${ax.toFixed(1)} ${ay.toFixed(1)}`;
            }
            d += `L${bx.toFixed(1)} ${by.toFixed(1)}`;
            pen = [bx, by];
        }
        if (d) riverCoords.push(d);
    }
    if (riverCoords.length) parts.push(`<path class="emap-river" d="${riverCoords.join('')}"/>`);
    return parts.join('');
}

function graticuleStep(lonSpan) {
    if (lonSpan >= 100) return 30;
    if (lonSpan >= 40) return 10;
    if (lonSpan >= 16) return 5;
    return 2;
}

// Fit a frame around the markers: pad, honor minimum spans, then trade span
// for aspect so the height stays in a pleasant band at a fixed width.
function fitFrame(markers) {
    let lons = markers.map(m => m.lng);
    if (Math.max(...lons) - Math.min(...lons) > 180) {
        lons = lons.map(lng => (lng < 0 ? lng + 360 : lng));
    }
    const lats = markers.map(m => m.lat);
    const midLon = (Math.min(...lons) + Math.max(...lons)) / 2;
    let midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    let lonSpan = Math.max((Math.max(...lons) - Math.min(...lons)) * PAD_FACTOR, MIN_LON_SPAN);
    let latSpan = Math.max((Math.max(...lats) - Math.min(...lats)) * PAD_FACTOR, MIN_LAT_SPAN);
    const kx = Math.max(0.2, Math.cos(midLat * Math.PI / 180));

    let height = WIDTH * latSpan / (lonSpan * kx);
    if (height < MIN_HEIGHT) {
        latSpan = MIN_HEIGHT * lonSpan * kx / WIDTH;
        height = MIN_HEIGHT;
    } else if (height > MAX_HEIGHT) {
        lonSpan = WIDTH * latSpan / (MAX_HEIGHT * kx);
        height = MAX_HEIGHT;
    }
    if (lonSpan > 360) lonSpan = 360;

    // Keep the frame on the map vertically (its lon seam is handled by the
    // shifted-ring pass instead).
    let y0 = midLat - latSpan / 2;
    let y1 = midLat + latSpan / 2;
    if (y1 > 88) { y0 -= y1 - 88; y1 = 88; }
    if (y0 < -88) { y1 += -88 - y0; y0 = -88; }

    return {
        x0: midLon - lonSpan / 2, x1: midLon + lonSpan / 2,
        y0, y1, lonSpan, latSpan: y1 - y0, kx,
        width: WIDTH, height: Math.round(height),
        lonShifted: lons.some((lng, i) => lng !== markers[i].lng),
    };
}

function renderInset(frame) {
    const w = INSET_W;
    const h = Math.round(w * (INSET_LAT_TOP - INSET_LAT_BOTTOM) / 360);
    const px = lng => (lng + 180) / 360 * w;
    const py = lat => (INSET_LAT_TOP - lat) / (INSET_LAT_TOP - INSET_LAT_BOTTOM) * h;
    const parts = [];
    const x = WIDTH - w - 10;
    const y = 10;
    parts.push(`<g class="emap-inset" transform="translate(${x} ${y})">`);
    parts.push(`<rect class="emap-inset-sea" x="0" y="0" width="${w}" height="${h}"/>`);
    const coords = [];
    for (const ring of rings('low')) {
        // Every second point is plenty at ~0.35 px per degree.
        const step = ring.pts.length > 60 ? 2 : 1;
        const pts = [];
        for (let i = 0; i < ring.pts.length; i += step) {
            pts.push(`${px(ring.pts[i][0]).toFixed(1)} ${py(ring.pts[i][1]).toFixed(1)}`);
        }
        if (pts.length >= 3) coords.push(`M${pts.join('L')}Z`);
    }
    parts.push(`<path class="emap-inset-land" fill-rule="evenodd" d="${coords.join('')}"/>`);
    // The frame rectangle, wrapped into [-180, 180]; a dateline-spanning frame
    // becomes two slices.
    const fy = Math.max(0, py(frame.y1));
    const fh = Math.max(2, Math.min(h, py(frame.y0)) - fy);
    const spans = [];
    let a = frame.x0;
    let b = frame.x1;
    while (a > 180) { a -= 360; b -= 360; }
    if (b > 180) {
        spans.push([a, 180], [-180, b - 360]);
    } else {
        spans.push([a, b]);
    }
    for (const [s0, s1] of spans) {
        const fx = px(Math.max(-180, s0));
        const fw = Math.max(2, px(Math.min(180, s1)) - fx);
        parts.push(`<rect class="emap-inset-frame" x="${fx.toFixed(1)}" y="${fy.toFixed(1)}" width="${fw.toFixed(1)}" height="${fh.toFixed(1)}"/>`);
    }
    parts.push(`<rect class="emap-inset-border" x="0.5" y="0.5" width="${w - 1}" height="${h - 1}"/>`);
    parts.push('</g>');
    return parts.join('');
}

// ── Timeline campaign map ──
// Timeline entries may carry an optional geo field (inline, so reordering the
// timeline can never orphan it):
//   { "kind": "point", "lat": 48.71, "lng": 44.51 }
//   { "kind": "arrow", "points": [[49.6,42.7],[48.7,43.5]], "variant": "red" }
// point = a static event (uprising, conference, surrender) → marker;
// arrow = movement (advance, retreat, evacuation) → curved polyline with an
// arrowhead. variant picks the side: 'red' (Red Army and allies) or 'axis'
// (their opponents); anything else falls back to the neutral stroke. Entries
// with geo are numbered ①②…-style in timeline order, and the same number
// appears on the map badge and on the timeline row — the pairing works with
// no JS; commulingo-event-map.js only adds hover/tap highlighting on top.
// Give geo only when it adds spatial information: two timeline beats at the
// same spot should carry ONE geo between them, or their badges overlap.

function validGeo(geo) {
    if (!geo || typeof geo !== 'object') return false;
    if (geo.kind === 'point') {
        return Number.isFinite(geo.lat) && Number.isFinite(geo.lng)
            && Math.abs(geo.lat) <= 85 && Math.abs(geo.lng) <= 180;
    }
    if (geo.kind === 'arrow') {
        return Array.isArray(geo.points) && geo.points.length >= 2
            && geo.points.every(p => Array.isArray(p)
                && Number.isFinite(p[0]) && Number.isFinite(p[1])
                && Math.abs(p[0]) <= 85 && Math.abs(p[1]) <= 180);
    }
    return false;
}

// The numbered geo entries of a timeline, in timeline order. Exported so the
// route can stamp the same numbers onto the timeline rows — one source for
// the numbering, so map and list can never disagree.
function timelineGeos(timeline) {
    const geos = [];
    (Array.isArray(timeline) ? timeline : []).forEach((item, index) => {
        if (item && validGeo(item.geo)) geos.push({ index, num: geos.length + 1, geo: item.geo });
    });
    return geos;
}

const ARROW_VARIANTS = { red: 'red', axis: 'axis' };

// Gentle bow for a two-point arrow so it reads as movement, not a border.
function arrowPath(pts) {
    if (pts.length === 2) {
        const [a, b] = pts;
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const cx = a[0] + dx / 2 - dy * 0.14;
        const cy = a[1] + dy / 2 + dx * 0.14;
        return `M${a[0].toFixed(1)} ${a[1].toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
    }
    // Waypoint chains: quadratic through midpoints, standard smoothing.
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i][0] + pts[i + 1][0]) / 2;
        const my = (pts[i][1] + pts[i + 1][1]) / 2;
        d += ` Q${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
    }
    const last = pts[pts.length - 1];
    d += ` L${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
    return d;
}

// The campaign map for a timeline: every geo-carrying entry drawn and
// numbered. Null when no entry has geo — most political events, and that is
// the intended shape, not a gap. No world inset here: the orientation map at
// the top of the page already places the region.
function renderEventTimelineMapSvg(timeline, lang, title, locations) {
    const geos = timelineGeos(timeline);
    if (!geos.length) return null;

    const fitPoints = geos.flatMap(({ geo }) => geo.kind === 'point'
        ? [{ lat: geo.lat, lng: geo.lng }]
        : geo.points.map(p => ({ lat: p[0], lng: p[1] })));
    const frame = fitFrame(fitPoints);
    const project = (lng, lat) => [
        (lng - frame.x0) / frame.lonSpan * frame.width,
        (frame.y1 - lat) / frame.latSpan * frame.height,
    ];
    const projectPt = p => {
        const lng = frame.lonShifted && p[1] < 0 ? p[1] + 360 : p[1];
        return project(lng, p[0]);
    };

    const parts = [];
    const label = lang === 'en'
        ? `Campaign map: ${title || 'timeline'}`
        : `전황 지도: ${title || '연표'}`;
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" class="emap-svg emap-timeline-svg" viewBox="0 0 ${frame.width} ${frame.height}" role="img" aria-label="${esc(label)}">`);
    parts.push('<defs>'
        + '<marker id="emap-head-red" class="emap-head-red" markerWidth="7" markerHeight="7" refX="5.4" refY="3.5" orient="auto-start-reverse"><path d="M0.7 0.7 L6 3.5 L0.7 6.3 Z"/></marker>'
        + '<marker id="emap-head-axis" class="emap-head-axis" markerWidth="7" markerHeight="7" refX="5.4" refY="3.5" orient="auto-start-reverse"><path d="M0.7 0.7 L6 3.5 L0.7 6.3 Z"/></marker>'
        + '<marker id="emap-head-neutral" class="emap-head-neutral" markerWidth="7" markerHeight="7" refX="5.4" refY="3.5" orient="auto-start-reverse"><path d="M0.7 0.7 L6 3.5 L0.7 6.3 Z"/></marker>'
        + '</defs>');
    parts.push(`<rect class="emap-sea" x="0" y="0" width="${frame.width}" height="${frame.height}"/>`);
    const level = frame.lonSpan > LOW_RES_LON_SPAN ? 'low' : 'high';
    parts.push(`<path class="emap-land" fill-rule="evenodd" d="${landPath(level, frame, project)}"/>`);
    parts.push(waterLayers(level, frame, project));
    const step = graticuleStep(frame.lonSpan);
    for (let lon = Math.ceil(frame.x0 / step) * step; lon <= frame.x1; lon += step) {
        const [x] = project(lon, 0);
        parts.push(`<line class="emap-grid" x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${frame.height}"/>`);
    }
    for (let lat = Math.ceil(frame.y0 / step) * step; lat <= frame.y1; lat += step) {
        const [, y] = project(0, lat);
        parts.push(`<line class="emap-grid" x1="0" y1="${y.toFixed(1)}" x2="${frame.width}" y2="${y.toFixed(1)}"/>`);
    }

    // Reference cities under the geometry: the event's own location markers,
    // re-drawn small and muted so the campaign has named anchors. The frame is
    // fitted to the campaign, not to these — ones outside just stay off-map.
    // Their label boxes are kept so number badges dodge them below.
    const avoid = [];
    for (const loc of Array.isArray(locations) ? locations : []) {
        if (!loc || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) continue;
        const lng = frame.lonShifted && loc.lng < 0 ? loc.lng + 360 : loc.lng;
        if (lng < frame.x0 + 1 || lng > frame.x1 - 1) continue;
        if (loc.lat < frame.y0 + 0.5 || loc.lat > frame.y1 - 0.5) continue;
        const [x, y] = project(lng, loc.lat);
        const text = localize(loc.label, lang);
        if (loc.kind === 'geo') {
            // Physical geography (a river, a strait): a name floating on the
            // map at its coordinate, no marker dot — terrain, not a place.
            if (!text) continue;
            parts.push(`<text class="emap-label is-geo" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle">${esc(text)}</text>`);
            const w = text.length * 11.5;
            avoid.push({ x0: x - w / 2, x1: x + w / 2, y0: y - 11, y1: y + 4 });
            continue;
        }
        parts.push(`<circle class="emap-ref" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`);
        if (text) {
            const flip = x > frame.width * 0.8;
            const lx = flip ? x - 7 : x + 7;
            parts.push(`<text class="emap-label is-ref" x="${lx.toFixed(1)}" y="${(y + 12).toFixed(1)}" text-anchor="${flip ? 'end' : 'start'}">${esc(text)}</text>`);
            const w = text.length * 11.5;
            avoid.push({ x0: flip ? lx - w : lx, x1: flip ? lx : lx + w, y0: y + 2, y1: y + 15 });
        }
    }

    // Geometry first, then all badges on top. Badge anchors: the point itself,
    // or the arrow's midpoint; a collision pass pushes overlapping badges down.
    const badges = [];
    for (const { num, geo } of geos) {
        const name = localize(geo.label, lang);
        if (geo.kind === 'point') {
            const [x, y] = projectPt([geo.lat, geo.lng]);
            parts.push(`<g class="emap-geo" data-geo-num="${num}">`
                + `<circle class="emap-marker" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5"/>`
                + '</g>');
            badges.push({ num, name, x: x + 11, y: y - 11 });
        } else {
            const pts = geo.points.map(projectPt);
            const variant = ARROW_VARIANTS[geo.variant] || 'neutral';
            parts.push(`<g class="emap-geo" data-geo-num="${num}">`
                + `<path class="emap-arrow is-${variant}" d="${arrowPath(pts)}" marker-end="url(#emap-head-${variant})"/>`
                + '</g>');
            const mid = pts.length === 2
                ? [(pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2]
                : pts[Math.floor(pts.length / 2)];
            badges.push({ num, name, x: mid[0] + 12, y: mid[1] - 6 });
        }
    }
    // Each badge slides down until it clears both the city labels and every
    // badge already placed — iterated, because a push out of one collision can
    // land in another.
    badges.sort((a, b) => a.y - b.y || a.x - b.x);
    for (let i = 0; i < badges.length; i++) {
        for (let pass = 0; pass < 8; pass++) {
            let moved = false;
            for (const rect of avoid) {
                if (badges[i].x > rect.x0 - 10 && badges[i].x < rect.x1 + 10
                    && badges[i].y > rect.y0 - 12 && badges[i].y < rect.y1 + 10) {
                    badges[i].y = rect.y1 + 11;
                    moved = true;
                }
            }
            for (let j = 0; j < i; j++) {
                if (Math.abs(badges[i].x - badges[j].x) < 22 && Math.abs(badges[i].y - badges[j].y) < 22) {
                    badges[i].y = badges[j].y + 22;
                    moved = true;
                }
            }
            if (!moved) break;
        }
    }
    for (const badge of badges) {
        const x = Math.min(frame.width - 12, Math.max(12, badge.x));
        const y = Math.min(frame.height - 12, Math.max(12, badge.y));
        parts.push(`<g class="emap-badge" data-geo-num="${badge.num}">`
            + `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/>`
            + `<text x="${x.toFixed(1)}" y="${(y + 3.5).toFixed(1)}" text-anchor="middle">${badge.num}</text>`
            + '</g>');
        // The place name for this beat (geo.label), revealed only while its
        // number is highlighted — everything else is dimmed then, so the name
        // can sit large under the badge without ever colliding when at rest.
        if (badge.name) {
            const nx = Math.min(frame.width - 8, Math.max(8, x));
            parts.push(`<text class="emap-geo-label" data-geo-num="${badge.num}" x="${nx.toFixed(1)}" y="${(y + 24).toFixed(1)}" text-anchor="middle">${esc(badge.name)}</text>`);
        }
    }

    parts.push(`<rect class="emap-border" x="0.5" y="0.5" width="${frame.width - 1}" height="${frame.height - 1}"/>`);
    parts.push('</svg>');
    return { svg: parts.join('\n'), width: frame.width, height: frame.height };
}

// locations: [{ lat, lng, label: {ko,en}, kind? }] from the event row; kind
// 'main' gets the emphasized marker, kind 'geo' is a floating physical-
// geography name (river, strait — no dot, and no vote in the frame fit),
// anything else the standard marker.
function renderEventMapSvg(locations, lang, title) {
    const entries = (Array.isArray(locations) ? locations : []).filter(loc =>
        loc && Number.isFinite(loc.lat) && Number.isFinite(loc.lng)
        && Math.abs(loc.lat) <= 85 && Math.abs(loc.lng) <= 180);
    const markers = entries.filter(loc => loc.kind !== 'geo');
    if (!markers.length) return null;

    const frame = fitFrame(markers);
    const project = (lng, lat) => [
        (lng - frame.x0) / frame.lonSpan * frame.width,
        (frame.y1 - lat) / frame.latSpan * frame.height,
    ];

    const parts = [];
    const label = lang === 'en' ? `Map: ${title || 'event locations'}` : `지도: ${title || '사건 위치'}`;
    parts.push(`<svg xmlns="http://www.w3.org/2000/svg" class="emap-svg" viewBox="0 0 ${frame.width} ${frame.height}" role="img" aria-label="${esc(label)}">`);
    parts.push(`<rect class="emap-sea" x="0" y="0" width="${frame.width}" height="${frame.height}"/>`);

    const level = frame.lonSpan > LOW_RES_LON_SPAN ? 'low' : 'high';
    parts.push(`<path class="emap-land" fill-rule="evenodd" d="${landPath(level, frame, project)}"/>`);
    parts.push(waterLayers(level, frame, project));

    // Faint graticule so scale reads at a glance.
    const step = graticuleStep(frame.lonSpan);
    for (let lon = Math.ceil(frame.x0 / step) * step; lon <= frame.x1; lon += step) {
        const [x] = project(lon, 0);
        parts.push(`<line class="emap-grid" x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${frame.height}"/>`);
    }
    for (let lat = Math.ceil(frame.y0 / step) * step; lat <= frame.y1; lat += step) {
        const [, y] = project(0, lat);
        parts.push(`<line class="emap-grid" x1="0" y1="${y.toFixed(1)}" x2="${frame.width}" y2="${y.toFixed(1)}"/>`);
    }

    if (frame.lonSpan < 200) parts.push(renderInset(frame));

    // Physical-geography names under the markers.
    for (const loc of entries) {
        if (loc.kind !== 'geo') continue;
        const lng = frame.lonShifted && loc.lng < 0 ? loc.lng + 360 : loc.lng;
        if (lng < frame.x0 + 1 || lng > frame.x1 - 1) continue;
        if (loc.lat < frame.y0 + 0.5 || loc.lat > frame.y1 - 0.5) continue;
        const text = localize(loc.label, lang);
        if (!text) continue;
        const [x, y] = project(lng, loc.lat);
        parts.push(`<text class="emap-label is-geo" x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle">${esc(text)}</text>`);
    }

    // Markers, then labels nudged apart: sorted by y, a label landing within a
    // line-height of the previous one on the same side drops below it.
    const placed = markers.map(marker => {
        const lng = frame.lonShifted && marker.lng < 0 ? marker.lng + 360 : marker.lng;
        const [x, y] = project(lng, marker.lat);
        return { marker, x, y, main: marker.kind === 'main' };
    }).sort((a, b) => a.y - b.y || a.x - b.x);
    for (const p of placed) {
        parts.push(`<circle class="emap-marker${p.main ? ' is-main' : ''}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.main ? 5.5 : 4}"/>`);
    }
    const lastLabel = { start: null, end: null };
    for (const p of placed) {
        const text = localize(p.marker.label, lang);
        if (!text) continue;
        const flip = p.x > frame.width * 0.8;
        const side = flip ? 'end' : 'start';
        let ly = p.y + 4;
        const prev = lastLabel[side];
        // Spacing sized for the 17px mobile labels (the media query in
        // commulingo.css), the larger of the two scales this SVG renders at.
        if (prev && ly - prev < 19) ly = prev + 19;
        lastLabel[side] = ly;
        const lx = flip ? p.x - 9 : p.x + 9;
        parts.push(`<text class="emap-label${p.main ? ' is-main' : ''}" x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="${flip ? 'end' : 'start'}">${esc(text)}</text>`);
    }

    parts.push(`<rect class="emap-border" x="0.5" y="0.5" width="${frame.width - 1}" height="${frame.height - 1}"/>`);
    parts.push('</svg>');
    return { svg: parts.join('\n'), width: frame.width, height: frame.height };
}

module.exports = { renderEventMapSvg, renderEventTimelineMapSvg, timelineGeos };
