// Client of the leninbot agent worker (leninbot dev_docs/agent_worker.md):
// stateless JSON-RPC tools/call to /worker/mcp with this service's token.
const URL_DEFAULT = 'http://host.docker.internal:8000/worker/mcp';

class WorkerUnavailable extends Error {}
class WorkerRejected extends Error {
    constructor(payload) {
        super(payload.error || 'worker rejected the call');
        this.status = payload.status;
    }
}

let nextId = 1;

async function call(name, args, { timeoutMs = 30000 } = {}) {
    const token = process.env.COMMULINGO_WORKER_TOKEN;
    if (!token) throw new WorkerUnavailable('COMMULINGO_WORKER_TOKEN is not set');
    let response;
    try {
        response = await fetch(process.env.COMMULINGO_WORKER_URL || URL_DEFAULT, {
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
            body: JSON.stringify({ jsonrpc: '2.0', id: nextId++, method: 'tools/call', params: { name, arguments: args } }),
            signal: AbortSignal.timeout(timeoutMs),
        });
    } catch (err) {
        throw new WorkerUnavailable(`worker unreachable: ${err.cause?.code || err.message}`);
    }
    if (!response.ok) throw new WorkerUnavailable(`worker HTTP ${response.status}`);
    const message = await response.json();
    if (message.error) throw new WorkerUnavailable(`worker ${name}: ${message.error.message}`);
    if (message.result.isError) throw new WorkerRejected(message.result.structuredContent || {});
    return message.result.structuredContent;
}

const submit = (idempotencyKey, request) => call('agent_task_submit', { idempotencyKey, request });
const get = taskId => call('agent_task_get', { taskId: String(taskId) });
const cancel = taskId => call('agent_task_cancel', { taskId: String(taskId) });

module.exports = { submit, get, cancel, WorkerUnavailable, WorkerRejected };
