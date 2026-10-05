// Stages whose model work runs in the leninbot worker as CommuLingo task kinds:
// the author session (research and draft) and the independent review. The
// worker returns the stage result, the checkpoints it saved (the engine stores
// them as artifacts) and review notes, which are written here.
const { execute } = require('../../../data/commulingo/editorial-pipeline-service');
const { topicsLabel } = require('./shared');

function workerJob(job) {
    const rest = { ...job };
    delete rest.lease_token;
    delete rest.lease_until;
    return rest;
}

function workerArtifacts(artifacts) {
    return artifacts.map(({ stage, value }) => ({ stage, value }));
}

function stageResult(task) {
    const stage = task.result && task.result.stage;
    if (!stage) throw new Error(`worker task ${task.taskId} returned no stage result`);
    return { value: stage.value, nextStage: stage.nextStage, status: stage.status || 'ready', delaySeconds: stage.delaySeconds || 0 };
}

const editor = {
    async request(job, artifacts) {
        return { request: { kind: 'commulingo_editor', input: { job: workerJob(job), artifacts: workerArtifacts(artifacts) } } };
    },
    async complete(job, artifacts, task) {
        return stageResult(task);
    },
};

// A review that ends without publishing tells the entry's next author why.
async function leaveNote(job, artifacts, note) {
    const text = `검토 ${note.decision} (작업 ${job.id}, ${topicsLabel(job)}): ${(note.reason || '').trim()}`.slice(0, 4000);
    try {
        await execute({ command: 'note', target: job.kind, id: job.target, note: text, changedBy: 'commulingo-pipeline-reviewer',
            jobRef: `job ${job.id} review`, idempotencyKey: `pipeline:${job.id}:${artifacts.length}:review-note` });
    } catch (err) {
        console.warn(`[pipeline] review note not saved for ${job.target}: ${err.message}`);
    }
}

const review = {
    async request(job, artifacts) {
        return { request: { kind: 'commulingo_review', input: { job: workerJob(job), artifacts: workerArtifacts(artifacts) } } };
    },
    async complete(job, artifacts, task) {
        for (const note of (task.result && task.result.notes) || []) await leaveNote(job, artifacts, note);
        return stageResult(task);
    },
};

// Discovery: which requested (or, with discovery on, mentioned) entries are
// missing. The engine turns accepted candidates into create jobs.
const discover = {
    async request(job, artifacts) {
        return { request: { kind: 'commulingo_discover', input: { job: workerJob(job), artifacts: workerArtifacts(artifacts) } } };
    },
    async complete(job, artifacts, task) {
        return stageResult(task);
    },
};

module.exports = { editor, review, discover, leaveNote };
