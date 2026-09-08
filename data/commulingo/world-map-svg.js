const MAP = require('./world-map.json');
const { countryInfo, hasCountry, countryCodes } = require('./country-geography');

const WIDTH = 1000;
const HEIGHT = 480;
const LAT_TOP = 84;
const LAT_BOTTOM = -60;

function esc(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function project(lng, lat) {
    return [(lng + 180) / 360 * WIDTH, (LAT_TOP - lat) / (LAT_TOP - LAT_BOTTOM) * HEIGHT];
}

function ringPath(ring) {
    // Keep microstates visible: world-scale rounding can collapse their entire
    // outline to a point before the browser has a chance to zoom in.
    const longitudes = ring.filter((_, index) => index % 2 === 0);
    const latitudes = ring.filter((_, index) => index % 2 === 1);
    const precision = Math.max(Math.max(...longitudes) - Math.min(...longitudes),
        Math.max(...latitudes) - Math.min(...latitudes)) < 0.1 ? 3 : 1;
    let d = '';
    for (let i = 0; i < ring.length; i += 2) {
        const [x, y] = project(ring[i], ring[i + 1]);
        d += `${i ? 'L' : 'M'}${x.toFixed(precision)} ${y.toFixed(precision)}`;
    }
    return d + 'Z';
}

function featureId(code) {
    return `wmap-unit-${String(code).replace(/[^A-Za-z0-9_-]/g, '-')}`;
}

function codeUses(info) {
    if (info.geography.special) return [`special-${info.geography.special}`];
    return info.geography.members || [];
}

function markerPositions(entries) {
    const placed = [];
    return entries.map(entry => {
        const desired = project(entry.center[0], entry.center[1]);
        let point = desired;
        const conflicts = candidate => placed.some(p => Math.hypot(p[0] - candidate[0], p[1] - candidate[1]) < 25);
        if (conflicts(point)) {
            const radii = [28, 42, 58];
            outer: for (const radius of radii) {
                for (let step = 0; step < 12; step++) {
                    const angle = (step * 5 % 12) * Math.PI / 6;
                    const candidate = [
                        Math.max(17, Math.min(WIDTH - 17, desired[0] + Math.cos(angle) * radius)),
                        Math.max(13, Math.min(HEIGHT - 13, desired[1] + Math.sin(angle) * radius)),
                    ];
                    if (!conflicts(candidate)) { point = candidate; break outer; }
                }
            }
        }
        placed.push(point);
        return { ...entry, desired, point };
    });
}

function centerFor(info) {
    if (info.geography.center) return info.geography.center;
    const first = (info.geography.members || [])[0];
    const meta = MAP.meta[first];
    return meta && meta.label ? meta.label : [0, 0];
}

function renderWorldMapSvg({ codes, selectedCode = '', lang = 'ko', territoryLinks = false, countryLink } = {}) {
    const valid = [...new Set((codes || []).filter(hasCountry))];
    const infos = valid.map(code => countryInfo(code, lang)).filter(Boolean)
        .map(info => countryLink ? { ...info, href: countryLink(info.code) } : info);
    const markers = markerPositions(infos.map(info => ({ ...info, center: centerFor(info) })));
    const selected = hasCountry(selectedCode) ? selectedCode : '';
    const label = lang === 'en' ? 'Interactive map of countries represented in CommuLingo' : 'CommuLingo에 등장하는 국가와 지역의 세계지도';
    // Keep the nested country links exposed to assistive technology: this is
    // an interactive group, not one indivisible image.
    const parts = [`<svg xmlns="http://www.w3.org/2000/svg" class="wmap-svg${selected ? ' has-selection' : ''}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="group" aria-label="${esc(label)}">`];
    parts.push('<defs>');
    Object.entries(MAP.units).forEach(([code, rings]) => {
        parts.push(`<path id="${featureId(code)}" d="${rings.map(ringPath).join('')}"/>`);
    });
    Object.entries(MAP.special || {}).forEach(([code, rings]) => {
        parts.push(`<path id="${featureId(`special-${code}`)}" d="${rings.map(ringPath).join('')}"/>`);
    });
    parts.push('<pattern id="wmap-history-pattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="8" class="wmap-history-line"/></pattern>');
    parts.push('</defs>');
    parts.push(`<rect class="wmap-sea" width="${WIDTH}" height="${HEIGHT}"/>`);
    parts.push('<g class="wmap-grid">');
    for (let lon = -150; lon <= 150; lon += 30) { const [x] = project(lon, 0); parts.push(`<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${HEIGHT}"/>`); }
    for (let lat = -30; lat <= 60; lat += 30) { const [, y] = project(0, lat); parts.push(`<line x1="0" y1="${y.toFixed(1)}" x2="${WIDTH}" y2="${y.toFixed(1)}"/>`); }
    parts.push('</g><g class="wmap-base">');
    Object.keys(MAP.units).forEach(code => parts.push(`<use href="#${featureId(code)}"/>`));
    parts.push('</g>');
    if (territoryLinks) {
        // One destination per present-day map unit. Modern countries take
        // precedence over overlapping historical unions and cultural regions.
        const owners = new Map();
        const priority = { modern: 0, region: 1, historical: 2 };
        infos.slice().sort((a, b) => priority[a.kind] - priority[b.kind]).forEach(info => {
            (info.geography.members || []).forEach(code => {
                if (!owners.has(code)) owners.set(code, info.code);
            });
        });
        parts.push('<g class="wmap-territories">');
        infos.forEach(info => {
            const units = (info.geography.members || []).filter(code => owners.get(code) === info.code);
            if (!units.length) return;
            parts.push(`<a class="wmap-territory" data-country-code="${esc(info.code)}" href="${esc(info.href)}" aria-label="${esc(info.label)}"${info.code === selected ? ' aria-current="page"' : ''}><title>${esc(info.label)}</title>`);
            units.forEach(code => parts.push(`<use href="#${featureId(code)}"/>`));
            parts.push('</a>');
        });
        parts.push('</g>');
    }
    parts.push('<g class="wmap-highlights">');
    infos.forEach(info => {
        const classes = ['wmap-highlight', `is-${info.kind}`];
        if (info.code === selected) classes.push('is-selected');
        parts.push(`<g class="${classes.join(' ')}" data-country-code="${esc(info.code)}">`);
        codeUses(info).forEach(code => parts.push(`<use href="#${featureId(code)}"/>`));
        parts.push('</g>');
    });
    parts.push('</g><g class="wmap-markers">');
    (territoryLinks ? [] : markers).forEach(marker => {
        const [x, y] = marker.point;
        const moved = Math.hypot(marker.desired[0] - x, marker.desired[1] - y) > 4;
        if (moved) parts.push(`<line class="wmap-marker-leader" data-country-code="${esc(marker.code)}" x1="${marker.desired[0].toFixed(1)}" y1="${marker.desired[1].toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`);
        const current = marker.code === selected ? ' is-selected' : '';
        parts.push(`<a class="wmap-marker${current}" data-country-code="${esc(marker.code)}" href="${esc(marker.href)}" aria-label="${esc(marker.label)}">`
            + `<title>${esc(marker.label)}</title><rect x="${(x - 14).toFixed(1)}" y="${(y - 10).toFixed(1)}" width="28" height="20" rx="2"/>`
            + `<image href="/flags/${esc(marker.code)}.svg" x="${(x - 12).toFixed(1)}" y="${(y - 8).toFixed(1)}" width="24" height="16" preserveAspectRatio="xMidYMid meet"/>`
            + '</a>');
    });
    parts.push('</g><rect class="wmap-border" x="0.5" y="0.5" width="999" height="479"/></svg>');
    return parts.join('');
}

function renderCountryMapSvg({ selectedCode, lang = 'ko', countryLink } = {}) {
    return renderWorldMapSvg({ codes: countryCodes(), selectedCode, lang, territoryLinks: true, countryLink });
}

module.exports = { renderWorldMapSvg, renderCountryMapSvg };
