/**
 * error-page.js — shared 404/500 page rendering.
 *
 * Every route used to inline its own `layouts/main` error body;
 * this keeps the markup and defaults in one place.
 */

const allStrings = require('../config/strings');
const { iconPaths } = require('../data/icons');
const seo = require('./seo');

const FALLBACK_LANG = 'ko';

// Locals the layout tree (main + head/nav/footer) reads without a `typeof`
// guard. Error pages are reached by requests that never ran the locals
// middleware in server.js — static-asset paths take an early next(), and a
// request that fails in an earlier middleware jumps straight to the error
// handler — so the layout threw "lang is not defined", the 404 render failed,
// the error handler re-rendered, failed the same way, and the visitor got a
// blank body instead of a page (observed 2026-08-02 in production).
function fillLayoutLocals(res) {
    const locals = res.locals;
    if (!locals.lang) locals.lang = FALLBACK_LANG;
    if (!locals.strings) locals.strings = allStrings[locals.lang] || allStrings[FALLBACK_LANG];
    if (!locals.siteOrigin) locals.siteOrigin = seo.SITE_ORIGIN;
    if (!locals.languageUrl) locals.languageUrl = seo.languagePath;
    if (!locals.languageSwitchUrl) locals.languageSwitchUrl = seo.languageSwitchPath;
    if (!locals.urlLanguage) locals.urlLanguage = FALLBACK_LANG;
    if (!locals.jsonLdScript) locals.jsonLdScript = seo.jsonLdScript;
    if (!locals.iconPaths) locals.iconPaths = iconPaths;
    if (locals.assetVersion === undefined) locals.assetVersion = '';
    if (locals.currentUser === undefined) locals.currentUser = null;
    if (locals.isAuthenticated === undefined) locals.isAuthenticated = false;
}

function renderErrorPage(res, status, { message, backHref = '/', backLabel, robotsMeta } = {}) {
    fillLayoutLocals(res);
    const strings = res.locals.strings || {};
    const errorStrings = strings.error || {};
    const heading = status === 404 ? '404' : 'Error';
    const msg = message || (status === 404 ? errorStrings.notFound : errorStrings.serverError) || heading;
    const label = backLabel || errorStrings.backHome || 'Home';
    const locals = {
        pageTitle: heading,
        body: `<div class="box"><h1>${heading}</h1><p>${msg}</p><a href="${backHref}">${label}</a></div>`,
    };
    if (robotsMeta) locals.robotsMeta = robotsMeta;
    res.status(status);
    // Render through the callback so a future layout change cannot put us back
    // to serving a blank body: a broken template degrades to plain text here
    // rather than bubbling into the error handler that calls this same code.
    return res.render('layouts/main', locals, (err, html) => {
        if (err) {
            console.error('error page render failed:', err.stack || err);
            if (res.headersSent) return res.end();
            return res.type('text/plain; charset=utf-8').send(`${heading}\n${msg}\n`);
        }
        return res.send(html);
    });
}

const notFound = (res, opts) => renderErrorPage(res, 404, opts);
const serverError = (res, opts) => renderErrorPage(res, 500, opts);

module.exports = { notFound, serverError };
