// Promise wrapper over req.app.render, for routes that build memoized HTML
// fragments outside the response cycle. Was previously defined identically in
// routes/commulingo.js and routes/commulingo-terms.js.
function renderAppView(req, view, locals) {
    return new Promise((resolve, reject) => {
        req.app.render(view, locals, (err, html) => (err ? reject(err) : resolve(html)));
    });
}

module.exports = { renderAppView };
