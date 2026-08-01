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
for (const stylesheet of ['palette.css', 'style.css', 'ui.css']) {
    if (!head.includes(`/css/${stylesheet}`)) {
        errors.push(`views/partials/head.ejs: missing ${stylesheet}`);
    }
}

const standaloneStyleViews = new Set([
    'views/admin/private-reports.ejs',
    'views/public/nonogram.ejs',
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

if (errors.length) {
    console.error(`UI check failed (${errors.length})\n`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
}

console.log(`UI check passed: ${walk(viewsRoot, '.ejs').length} EJS templates compiled; no unexpected inline styles.`);
