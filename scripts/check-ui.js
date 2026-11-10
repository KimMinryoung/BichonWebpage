#!/usr/bin/env node

/* Fast, dependency-free UI guardrails for local design work and CI. */

const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const root = path.resolve(__dirname, '..');
const viewsRoot = path.join(root, 'views');
const errors = [];

function walk(directory, extension) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return walk(fullPath, extension);
        return fullPath.endsWith(extension) ? [fullPath] : [];
    });
}

for (const file of walk(viewsRoot, '.ejs')) {
    const source = fs.readFileSync(file, 'utf8');
    try {
        ejs.compile(source, { filename: file });
    } catch (error) {
        errors.push(`${path.relative(root, file)}: ${error.message}`);
    }
}

const head = fs.readFileSync(path.join(viewsRoot, 'partials', 'head.ejs'), 'utf8');
for (const stylesheet of ['palette.css', 'site-core.css', 'ui.css']) {
    if (!head.includes(`/css/${stylesheet}`)) {
        errors.push(`views/partials/head.ejs: missing ${stylesheet}`);
    }
}

const sharedStyle = fs.readFileSync(path.join(root, 'public', 'css', 'style.css'), 'utf8');
const globalNavRule = sharedStyle.match(/(?:^|\n)nav\s*\{([^}]*)\}/);
if (globalNavRule && /position\s*:\s*sticky/.test(globalNavRule[1])) {
    errors.push('public/css/style.css: keep sticky positioning scoped to application chrome, not every <nav>');
}

const sharedNav = fs.readFileSync(path.join(viewsRoot, 'partials', 'nav.ejs'), 'utf8');
if (!/<nav\s+class="site-nav"/.test(sharedNav)) {
    errors.push('views/partials/nav.ejs: primary navigation must use the site-nav chrome class');
}

const standaloneStyleViews = new Set([
    'views/public/novel-view.ejs',
]);

for (const file of walk(viewsRoot, '.ejs')) {
    const relative = path.relative(root, file);
    if (standaloneStyleViews.has(relative)) continue;
    const source = fs.readFileSync(file, 'utf8');
    if (/\sstyle\s*=\s*["']/.test(source) || /<style(?:\s|>)/.test(source)) {
        errors.push(`${relative}: use a shared class instead of inline styles`);
    }
}

/* House style of the site stylesheets (dev_docs/design-system.md). The games
   and the admin screens keep their own sheets and are not checked here. */
const postcss = require('postcss');
const houseSheets = ['games.css', 'commulingo.css', 'style.css', 'commulingo-doc.css', 'ui.css', 'report.css', 'commulingo-crumb.css'];
// The person card and person head are the owner's own design; their sizes stay as written.
const ownerDesigned = /commu-person-|commu-career-|commu-fate|commu-scene-chip/;
const roundedAllowed = /commu-flag-link|commu-tenure-swatch/;
for (const sheet of houseSheets) {
    const file = path.join(root, 'public', 'css', sheet);
    postcss.parse(fs.readFileSync(file, 'utf8')).walkDecls((decl) => {
        const selector = decl.parent.selector || '';
        const where = `public/css/${sheet}:${decl.source.start.line}`;
        if (decl.prop === 'color' && /^var\(--accent(-green)?\s*[,)]/.test(decl.value)) {
            errors.push(`${where}: text takes --link, not --accent (invisible on the dark theme)`);
        }
        if (decl.prop === 'border-radius' && !/^(0|50%|inherit|var\(--radius-[a-z]+\))$/.test(decl.value) && !roundedAllowed.test(selector)) {
            errors.push(`${where}: corners are square (border-radius ${decl.value})`);
        }
        const size = decl.prop === 'font-size' && decl.value.match(/^(\d*\.?\d+)(rem|px)$/);
        if (size && (size[2] === 'px' ? size[1] / 16 : +size[1]) <= 1.4 && !ownerDesigned.test(selector)) {
            errors.push(`${where}: use a --text-* step instead of ${decl.value}`);
        }
    });
}

if (errors.length) {
    console.error(`UI check failed (${errors.length})\n`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
}

console.log(`UI check passed: ${walk(viewsRoot, '.ejs').length} EJS templates compiled; no unexpected inline styles.`);
