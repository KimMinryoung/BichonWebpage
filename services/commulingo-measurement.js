// Learning-measurement event validation; who is counted lives in
// services/measurement-exclusion.js.
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function normalize(body) {
    if (!body || typeof body.runId !== 'string' || typeof body.eventId !== 'string' || !UUID.test(body.runId) || !UUID.test(body.eventId)) return null;
    if (!['lesson', 'drill'].includes(body.kind) || !['started', 'answered', 'completed'].includes(body.event)) return null;
    if (typeof body.contentId !== 'string' || !/^[a-z0-9-]{1,120}$/.test(body.contentId)) return null;
    if (typeof body.version !== 'string' || body.version.length > 100) return null;
    if (!['ko', 'en'].includes(body.lang) || !['lesson', 'retry', 'review', 'quiz', 'timeline'].includes(body.mode)) return null;
    if (!Number.isInteger(body.step) || body.step < 0 || body.step > 500) return null;
    if (body.event === 'answered' && (body.step < 1 || typeof body.correct !== 'boolean')) return null;
    if (body.event === 'started' && body.step !== 0) return null;
    if (body.event === 'completed' && body.step < 1) return null;
    if (body.kind === 'lesson' ? !['lesson', 'retry'].includes(body.mode) : !['quiz', 'timeline'].includes(body.mode)) return null;
    return { runId: body.runId, eventId: body.eventId, kind: body.kind, contentId: body.contentId,
        version: body.version, lang: body.lang, mode: body.mode, event: body.event, step: body.step,
        correct: body.event === 'answered' ? body.correct : null };
}

module.exports = { normalize };
