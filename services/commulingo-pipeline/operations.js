// Operator actions that touch both the queue and the worker.
const db = require('../../config/database');
const store = require('./store');
const worker = require('./worker-client');

// Retry a held job. A parked worker task is cancelled first and its
// reservation settled with what the task reports having spent (kept when the
// cost is unknown), so a retry never leaks a day's budget reservation.
async function retry(jobId) {
    const job = (await db.query('SELECT payload FROM commulingo_pipeline_jobs WHERE id=$1', [jobId])).rows[0];
    const waiting = job && job.payload && job.payload.waiting;
    if (waiting) {
        await worker.cancel(waiting.taskId).catch(() => {});
        const task = await worker.get(waiting.taskId).catch(() => null);
        if (task && !['queued', 'running'].includes(task.status) && task.result?.costComplete !== false) {
            await store.settle(waiting.reservation, Number(task.usage?.costUsd) || 0).catch(() => {});
        }
    }
    return store.retry(jobId);
}

module.exports = { retry };
