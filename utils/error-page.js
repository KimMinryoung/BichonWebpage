/**
 * error-page.js — shared 404/500 page rendering.
 *
 * Every route used to inline its own `layouts/main` error body;
 * this keeps the markup and defaults in one place.
 */

function renderErrorPage(res, status, { message, backHref = '/', backLabel, robotsMeta } = {}) {
    const strings = (res.locals && res.locals.strings) || {};
    const errorStrings = strings.error || {};
    const heading = status === 404 ? '404' : 'Error';
    const msg = message || (status === 404 ? errorStrings.notFound : errorStrings.serverError) || heading;
    const label = backLabel || errorStrings.backHome || 'Home';
    const locals = {
        pageTitle: heading,
        body: `<div class="box"><h1>${heading}</h1><p>${msg}</p><a href="${backHref}">${label}</a></div>`,
    };
    if (robotsMeta) locals.robotsMeta = robotsMeta;
    return res.status(status).render('layouts/main', locals);
}

const notFound = (res, opts) => renderErrorPage(res, 404, opts);
const serverError = (res, opts) => renderErrorPage(res, 500, opts);

module.exports = { notFound, serverError };
