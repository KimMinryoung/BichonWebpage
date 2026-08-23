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
        unpacked = { low: unpack(BASEMAP.low), high: unpack(BASEMAP.high) };
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

// locations: [{ lat, lng, label: {ko,en}, kind? }] from the event row; kind
// 'main' gets the emphasized marker, anything else the standard one.
function renderEventMapSvg(locations, lang, title) {
    const markers = (Array.isArray(locations) ? locations : []).filter(loc =>
        loc && Number.isFinite(loc.lat) && Number.isFinite(loc.lng)
        && Math.abs(loc.lat) <= 85 && Math.abs(loc.lng) <= 180);
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

module.exports = { renderEventMapSvg };
