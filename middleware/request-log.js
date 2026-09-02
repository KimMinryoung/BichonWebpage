// One-line access log, off by default: `LOG_REQUESTS=1` prints
// `method path status ms` for every request. nginx keeps no access log for
// this vhost, so this is the only way to attribute a slow response or a 500
// to a path from inside the container.
function requestLog(req, res, next) {
    const startedAt = process.hrtime.bigint();
    res.on('finish', () => {
        const ms = Number(process.hrtime.bigint() - startedAt) / 1e6;
        console.log(`[req] ${req.method} ${req.originalUrl.split('?')[0]} ${res.statusCode} ${ms.toFixed(1)}ms`);
    });
    next();
}

module.exports = { requestLog };
