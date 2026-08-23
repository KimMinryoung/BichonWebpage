#!/usr/bin/env node
// Bake the event-map base map from Natural Earth land polygons.
//
// The event map (data/commulingo/event-map-svg.js) draws coastlines only — no
// modern borders, so a 1917 event never sits on top of an anachronistic map.
// Natural Earth is public domain. Two resolutions: 110m for world-scale frames
// and the inset, 50m for regional frames.
//
// Usage:
//   node scripts/bake-event-basemap.js <ne_110m_land.geojson> <ne_50m_land.geojson>
// Sources:
//   https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_land.geojson
//   https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson
//
// Output data/commulingo/event-basemap.json (tracked in git, unlike
// generated/ — the source is an external download, not repo data):
//   { "low": [ring, ...], "high": [ring, ...] }
// where each ring is a flat [lng, lat, lng, lat, ...] outline rounded to 2
// decimals (~1 km), consecutive duplicates dropped. Interior rings (lakes) are
// kept — the renderer draws with fill-rule evenodd so they read as water.

const fs = require('fs');
const path = require('path');

function bakeRings(geojsonPath, { minSpan }) {
    const geo = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
    const rings = [];
    for (const feature of geo.features) {
        const geom = feature.geometry;
        if (!geom) continue;
        const polys = geom.type === 'Polygon' ? [geom.coordinates]
            : geom.type === 'MultiPolygon' ? geom.coordinates : [];
        for (const poly of polys) {
            for (const ring of poly) {
                const flat = [];
                let prevX = null;
                let prevY = null;
                let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                for (const [lng, lat] of ring) {
                    const x = Math.round(lng * 100) / 100;
                    const y = Math.round(lat * 100) / 100;
                    if (x === prevX && y === prevY) continue;
                    flat.push(x, y);
                    prevX = x; prevY = y;
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
                // Drop degenerate slivers and specks below the resolution the
                // map is ever drawn at; a speck island would render as noise.
                if (flat.length < 8) continue;
                if (maxX - minX < minSpan && maxY - minY < minSpan) continue;
                rings.push(flat);
            }
        }
    }
    return rings;
}

function main() {
    const [lowPath, highPath] = process.argv.slice(2);
    if (!lowPath || !highPath) {
        console.error('Usage: node scripts/bake-event-basemap.js <ne_110m_land.geojson> <ne_50m_land.geojson>');
        process.exit(2);
    }
    const low = bakeRings(lowPath, { minSpan: 0.4 });
    const high = bakeRings(highPath, { minSpan: 0.12 });
    const outPath = path.join(__dirname, '..', 'data', 'commulingo', 'event-basemap.json');
    const payload = JSON.stringify({ low, high });
    fs.writeFileSync(outPath, payload);
    const kb = Math.round(payload.length / 1024);
    console.log(`Wrote ${outPath}: low ${low.length} rings, high ${high.length} rings, ${kb} KB`);
}

main();
