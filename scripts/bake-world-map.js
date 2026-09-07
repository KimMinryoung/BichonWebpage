#!/usr/bin/env node
// Bake a compact, self-hosted political world map for CommuLingo.
//
// The event map deliberately has no modern borders. This separate learning
// map does: it is used only by /commulingo/map and the nationality/country
// hubs, where locating a country in the present-day world is the point.
// Natural Earth data is public domain.
//
// Usage:
//   node scripts/bake-world-map.js <ne_110m_admin_0_map_units.geojson> <ne_10m_admin_1_states_provinces.geojson> <ne_50m_admin_0_map_units.geojson>

// Output: data/commulingo/world-map.json
//   units: map-unit code -> rounded polygon rings
//   meta:  map-unit code -> label point + continent
//   special.eastGermany: an explicitly approximate union of the five eastern
//     German states and Berlin, used only with an explanatory legend.

const fs = require('fs');
const path = require('path');

function roundedRings(geometry, precision, minSpan) {
    if (!geometry) return [];
    const polygons = geometry.type === 'Polygon' ? [geometry.coordinates]
        : geometry.type === 'MultiPolygon' ? geometry.coordinates : [];
    const rings = [];
    for (const polygon of polygons) {
        for (const ring of polygon) {
            const flat = [];
            let previous = null;
            let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
            for (const point of ring) {
                const lng = Math.round(point[0] / precision) * precision;
                const lat = Math.round(point[1] / precision) * precision;
                if (previous && previous[0] === lng && previous[1] === lat) continue;
                flat.push(Number(lng.toFixed(3)), Number(lat.toFixed(3)));
                previous = [lng, lat];
                minX = Math.min(minX, lng); maxX = Math.max(maxX, lng);
                minY = Math.min(minY, lat); maxY = Math.max(maxY, lat);
            }
            if (flat.length < 8) continue;
            // Tiny islands remain discoverable through their flag marker. At
            // world scale their polygons are sub-pixel noise.
            if (maxX - minX < minSpan && maxY - minY < minSpan) continue;
            rings.push(flat);
        }
    }
    return rings;
}

function main() {
    const [unitsPath, admin1Path, detailUnitsPath] = process.argv.slice(2);
    if (!unitsPath || !admin1Path || !detailUnitsPath) {
        console.error('Usage: node scripts/bake-world-map.js <ne_110m_admin_0_map_units.geojson> <ne_10m_admin_1_states_provinces.geojson> <ne_50m_admin_0_map_units.geojson>');
        process.exit(2);
    }
    const source = JSON.parse(fs.readFileSync(unitsPath, 'utf8'));
    const units = {};
    const meta = {};
    for (const feature of source.features || []) {
        const props = feature.properties || {};
        const code = props.GU_A3 || props.ADM0_A3;
        if (!code) continue;
        const rings = roundedRings(feature.geometry, 0.03, 0.08);
        if (!rings.length) continue;
        if (!units[code]) units[code] = [];
        units[code].push(...rings);
        if (!meta[code]) {
            meta[code] = {
                label: [Number(props.LABEL_X) || 0, Number(props.LABEL_Y) || 0],
                continent: props.CONTINENT || '',
            };
        }
    }

    // The 110m source omits these tiny but represented places completely.
    // Pull only their rings from 50m; every other country keeps the compact
    // world-scale geometry.
    const detailCodes = new Set(['GRD', 'MTQ']);
    const detailSource = JSON.parse(fs.readFileSync(detailUnitsPath, 'utf8'));
    for (const feature of detailSource.features || []) {
        const props = feature.properties || {};
        const code = props.GU_A3 || props.ADM0_A3;
        if (!detailCodes.has(code)) continue;
        const rings = roundedRings(feature.geometry, 0.02, 0.01);
        if (!rings.length) continue;
        units[code] = rings;
        meta[code] = {
            label: [Number(props.LABEL_X) || 0, Number(props.LABEL_Y) || 0],
            continent: props.CONTINENT || '',
        };
    }

    const easternStateCodes = new Set(['DE-MV', 'DE-BB', 'DE-ST', 'DE-TH', 'DE-SN', 'DE-BE']);
    const admin1 = JSON.parse(fs.readFileSync(admin1Path, 'utf8'));
    const eastGermany = [];
    for (const feature of admin1.features || []) {
        const props = feature.properties || {};
        if (!easternStateCodes.has(props.iso_3166_2)) continue;
        eastGermany.push(...roundedRings(feature.geometry, 0.02, 0.04));
    }
    if (!eastGermany.length) throw new Error('Natural Earth input did not contain the East Germany approximation states');

    const payload = JSON.stringify({ source: 'Natural Earth 110m map units, selected 50m islands, and 10m admin-1; public domain', units, meta, special: { eastGermany } });
    const output = path.join(__dirname, '..', 'data', 'commulingo', 'world-map.json');
    fs.writeFileSync(output, payload);
    console.log(`Wrote ${output}: ${Object.keys(units).length} map units, ${eastGermany.length} East Germany rings, ${Math.round(payload.length / 1024)} KB`);
}

main();
