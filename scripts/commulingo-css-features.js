#!/usr/bin/env node
// Which commulingo.css classes belong to one page feature only, so their
// rules can leave the shared sheet (scripts/build-commulingo-list-css.js
// builds commulingo-core.css and one commulingo-<feature>.css per feature;
// config/commulingo-page-css.js names the views that load each one).
//
// A class is a feature's when the files that name it all belong to that
// feature (its views, partials, browser scripts and server-side SVG
// builders). A class named anywhere else, or nowhere (dead, or built by
// string concatenation), stays in the shared sheet, which is always safe.
// Stored-content classes (doc bodies, person sections) are not feature
// classes: none of them is named only by feature files.
//
// The result is committed (commulingo-css-features.json) because the CSS
// release build sees only public/ and the build scripts. Rerun after adding
// or moving a class: node scripts/commulingo-css-features.js
// (tests/unit/commulingo-page-css.js fails while the file is stale).
const fs = require('node:fs');
const path = require('node:path');
const postcss = require('postcss');

const ROOT = path.join(__dirname, '..');
const OUTPUT = path.join(__dirname, 'commulingo-css-features.json');

// feature -> the files only it uses; the views that load it are in
// config/commulingo-page-css.js (PAGE_FEATURES).
const FEATURE_FILES = {
    play: [
        /^views\/public\/commulingo-(?:book|drill|drill-index|shorts)\.ejs$/,
        /^public\/js\/commulingo(?:-decision|-graph|-drill|-shorts|-name-context)?\.js$/,
    ],
    event: [
        // The term page carries the paired event's panel, so it loads this sheet too.
        /^views\/public\/commulingo-(?:event|term)\.ejs$/,
        /^views\/partials\/commulingo-(?:event-panel|term-panel|pair-tabs|doc-excerpts)\.ejs$/,
        /^public\/js\/commulingo-(?:event-map|event-timeline|doc-excerpts|pair-tabs)\.js$/,
        /^data\/commulingo\/event-map-svg\.js$/,
    ],
    world: [
        /^views\/public\/commulingo-(?:map|country|internationalist)\.ejs$/,
        /^views\/partials\/commulingo-(?:world-map-controls|affiliation-groups)\.ejs$/,
        /^public\/js\/commulingo-world-map\.js$/,
        /^data\/commulingo\/world-map-svg\.js$/,
    ],
    genealogy: [
        /^views\/public\/commulingo-genealog(?:y|ies)\.ejs$/,
        /^public\/js\/commulingo-genealogy\.js$/,
        /^data\/commulingo\/genealogy-svg\.js$/,
    ],
    politburo: [
        /^views\/public\/commulingo-politburo\.ejs$/,
    ],
};
const FEATURES = Object.keys(FEATURE_FILES);
// Where markup and class names come from (the test container has no git).
const SCAN_DIRS = ['views', 'public/js', 'data', 'routes', 'services', 'utils', 'config', 'middleware', 'mcp'];

function featureOfFile(file) {
    return FEATURES.find(name => FEATURE_FILES[name].some(rx => rx.test(file))) || null;
}

function classesOf(css) {
    const classes = new Set();
    postcss.parse(css).walkRules(rule => {
        for (const match of rule.selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) classes.add(match[1]);
    });
    return classes;
}

function computeFeatureClasses() {
    const files = SCAN_DIRS.flatMap(dir => fs.readdirSync(path.join(ROOT, dir), { recursive: true })
        .map(file => `${dir}/${file.split(path.sep).join('/')}`))
        .filter(file => /\.(?:ejs|js)$/.test(file)).sort();
    const sources = files.map(file => ({ file, feature: featureOfFile(file), text: fs.readFileSync(path.join(ROOT, file), 'utf8') }));
    // A feature's partial or browser script used by a file outside the
    // feature (the event panel includes the world map's zoom controls)
    // carries its classes to that page too: it counts as shared, and so do
    // the classes only it names.
    for (const source of sources) {
        if (!source.feature) continue;
        const name = path.basename(source.file).replace(/\.(?:ejs|js)$/, '').replace(/[-]/g, '\\-');
        const use = source.file.startsWith('views/partials/') ? new RegExp(`include\\(\\s*['"](?:\\.\\./partials/)?${name}['"]`)
            : source.file.startsWith('public/js/') ? new RegExp(`/js/${name}\\.js`) : null;
        // Pages load scripts and partials in views only (data/ and services/ merely mention them).
        if (use && sources.some(other => other.feature !== source.feature && other.file.startsWith('views/') && use.test(other.text))) source.feature = null;
    }
    const result = Object.fromEntries(FEATURES.map(name => [name, []]));
    const classes = classesOf(fs.readFileSync(path.join(ROOT, 'public/css/commulingo.css'), 'utf8'));
    for (const name of [...classes].sort()) {
        const token = new RegExp(`(?:^|[^\\w-])${name.replace(/[-]/g, '\\-')}(?:$|[^\\w-])`);
        const users = new Set(sources.filter(source => token.test(source.text)).map(source => source.feature));
        if (users.size === 1 && !users.has(null)) result[[...users][0]].push(name);
    }
    return result;
}

function serialize(map) {
    return JSON.stringify(map, null, 1) + '\n';
}

if (require.main === module) {
    fs.writeFileSync(OUTPUT, serialize(computeFeatureClasses()));
}

module.exports = { FEATURES, FEATURE_FILES, computeFeatureClasses, serialize, OUTPUT };
