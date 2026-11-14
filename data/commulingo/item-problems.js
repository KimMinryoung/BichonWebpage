// Batch writers (people_upsert, editorial_batch) run each item in its own
// savepoint, so one rejected item does not hide the problems of the rest: the
// caller gets every rejection at once instead of fixing and resending one at a
// time. The batch stays all or nothing — any problem fails the whole call
// after the last item. Errors without an HTTP-like status (a broken
// connection, a bug) still stop the batch at once.
const MAX_LISTED = 40;

async function eachItem(client, items, fn, describe) {
    const problems = [];
    for (const [index, item] of items.entries()) {
        await client.query('SAVEPOINT batch_item');
        try {
            await fn(item, index);
            await client.query('RELEASE SAVEPOINT batch_item');
        } catch (err) {
            await client.query('ROLLBACK TO SAVEPOINT batch_item');
            if (!err.status || err.status >= 500) throw err;
            problems.push({ index, ...describe(item, index), error: err.message, status: err.status,
                ...(err.code ? { code: String(err.code) } : {}), ...(err.currentRevision ? { currentRevision: err.currentRevision } : {}) });
        }
    }
    if (problems.length) throw batchError(problems, items.length);
}

function batchError(problems, total) {
    const lines = problems.slice(0, MAX_LISTED).map(p => `items[${p.index}]${p.label ? ` ${p.label}` : ''}: ${p.error}`);
    if (problems.length > MAX_LISTED) lines.push(`… and ${problems.length - MAX_LISTED} more (see problems)`);
    const statuses = new Set(problems.map(p => p.status));
    return Object.assign(new Error(`${problems.length} of ${total} item(s) rejected; nothing was written\n${lines.join('\n')}`), {
        status: statuses.size === 1 ? problems[0].status : 400,
        problems,
    });
}

module.exports = { eachItem, batchError };
