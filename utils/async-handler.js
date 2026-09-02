// asyncHandler(fn) — route an async handler's rejection (or a sync throw) to
// Express's error handler. Express 4 does not catch promise rejections: an
// awaited failure outside a try block leaves the request hanging and surfaces
// as an unhandledRejection, which on Node ≥15 kills the process by default.
//
// Handlers that already funnel every failure into their own response shape
// (routes/commulingo-admin-api.js `h()`) keep doing that; this is for the
// plain page/feed routes whose failure should render the error page.
function asyncHandler(fn) {
    return function wrapped(req, res, next) {
        Promise.resolve()
            .then(() => fn(req, res, next))
            .catch(next);
    };
}

module.exports = { asyncHandler };
