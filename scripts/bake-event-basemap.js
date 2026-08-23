#!/usr/bin/env node
// Bake the event-map base map from Natural Earth land polygons.
//
// The event map (data/commulingo/event-map-svg.js) draws coastlines only — no
// modern borders, so a 1917 event never sits on top of an anachronistic map.
// Natural Earth is public domain. Two resolutions: 110m for world-scale frames
// and the inset, 50m for regional frames.
//
// Usage:
//   node scripts/bake-event-basemap.js <ne_110m_land.geojson> <ne_50m_land.geojson> <ne_50m_rivers_lake_centerlines.geojson> <ne_50m_lakes.geojson>
// Sources (https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/):
//   ne_110m_land.geojson, ne_50m_land.geojson,
//   ne_50m_rivers_lake_centerlines.geojson, ne_50m_lakes.geojson
//
// Output data/commulingo/event-basemap.json (tracked in git, unlike
// generated/ — the source is an external download, not repo data):
//   { "low": [ring, ...], "high": [ring, ...],
//     "rivers": [line, ...], "lakes": [ring, ...] }
// where each ring/line is a flat [lng, lat, lng, lat, ...] outline rounded to
// 2 decimals (~1 km), consecutive duplicates dropped. Interior land rings
// (the Caspian) are kept — the renderer draws with fill-rule evenodd so they
// read as water. Rivers and lakes only appear on regional frames, where a
// campaign's geography (the Volga at Stalingrad, Ladoga at Leningrad) is the
// point of the map.

const fs = require('fs');
const path = require('path');

function bakeRings(geojsonPath, { minSpan, dropFeature }) {
    const geo = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
    const rings = [];
    for (const feature of geo.features) {
        const geom = feature.geometry;
        if (!geom) continue;
        if (dropFeature && dropFeature(feature)) continue;
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

function bakeLines(geojsonPath) {
    const geo = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
    const lines = [];
    for (const feature of geo.features) {
        const geom = feature.geometry;
        if (!geom) continue;
        const parts = geom.type === 'LineString' ? [geom.coordinates]
            : geom.type === 'MultiLineString' ? geom.coordinates : [];
        for (const part of parts) {
            const flat = [];
            let prevX = null;
            let prevY = null;
            for (const [lng, lat] of part) {
                const x = Math.round(lng * 100) / 100;
                const y = Math.round(lat * 100) / 100;
                if (x === prevX && y === prevY) continue;
                flat.push(x, y);
                prevX = x; prevY = y;
            }
            if (flat.length >= 4) lines.push(flat);
        }
    }
    return lines;
}

function main() {
    const [lowPath, highPath, riversPath, lakesPath] = process.argv.slice(2);
    if (!lowPath || !highPath || !riversPath || !lakesPath) {
        console.error('Usage: node scripts/bake-event-basemap.js <ne_110m_land> <ne_50m_land> <ne_50m_rivers_lake_centerlines> <ne_50m_lakes> (geojson each)');
        process.exit(2);
    }
    const low = bakeRings(lowPath, { minSpan: 0.4 });
    const high = bakeRings(highPath, { minSpan: 0.12 });
    const rivers = bakeLines(riversPath);
    // Reservoirs are dropped: nearly all are postwar works (Rybinsk 1941–47,
    // Kuybyshev 1955–57, Kakhovka 1956…) and a historical-event map showing
    // them would be the anachronism this basemap exists to avoid.
    const lakes = bakeRings(lakesPath, {
        minSpan: 0.15,
        dropFeature: f => /reservoir/i.test((f.properties && f.properties.featurecla) || ''),
    });
    const outPath = path.join(__dirname, '..', 'data', 'commulingo', 'event-basemap.json');
    const payload = JSON.stringify({ low, high, rivers, lakes });
    fs.writeFileSync(outPath, payload);
    const kb = Math.round(payload.length / 1024);
    console.log(`Wrote ${outPath}: low ${low.length}, high ${high.length} rings; ${rivers.length} rivers, ${lakes.length} lakes; ${kb} KB`);
}

main();
