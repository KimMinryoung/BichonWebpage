// Field evidence on person and term edits: every item is checked and every
// problem reported at once, each saying which item, which key and what the
// edit allows, with the expected item shape. Rejections here were the most
// common MCP write failure (about 120 in three weeks to 2026-11-14), mostly
// fixed by trial and error because the old messages named only the rule.
const { badRequest } = require('./people-admin-fields');

const SHAPE = 'each item is {field, claim, source (one of this edit\'s sources), locator (page/section), excerpt?, stance?: supports|disputes}';

// sources: this edit's source list. allowed(field): whether the edit can carry
// evidence for that field; allowedLabel names those fields in the message.
// required: fields this edit changes that need evidence.
function evidenceProblems(evidence, { sources, allowed, allowedLabel, required }) {
    if (!Array.isArray(evidence)) return ['evidence must be an array'];
    const problems = [];
    evidence.forEach((e, i) => {
        const at = `evidence[${i}]`;
        if (!e || typeof e !== 'object' || Array.isArray(e)) { problems.push(`${at} is not an object`); return; }
        const wrongType = ['field', 'claim', 'source', 'locator', 'excerpt', 'stance'].filter(k => e[k] !== undefined && typeof e[k] !== 'string');
        if (wrongType.length) problems.push(`${at}: ${wrongType.join(', ')} must be text`);
        const missing = ['field', 'claim', 'locator'].filter(k => typeof e[k] !== 'string' || !e[k].trim());
        if (missing.length) problems.push(`${at}${e.field ? ` (${e.field})` : ''}: missing ${missing.join(', ')}`);
        if (!sources.includes(e.source)) {
            problems.push(`${at}${e.field ? ` (${e.field})` : ''}: source ${e.source === undefined ? 'is missing' : JSON.stringify(e.source) + ' is not one of this edit\'s sources'}`);
        }
        if (!['supports', 'disputes'].includes(e.stance || 'supports')) problems.push(`${at}: stance must be supports or disputes`);
        if (typeof e.field === 'string' && e.field.trim() && !allowed(e.field)) {
            problems.push(`${at}: field ${e.field} is not part of this edit (evidence can name ${allowedLabel})`);
        }
    });
    const covered = new Set(evidence.filter(e => e && typeof e === 'object').map(e => e.field));
    const uncovered = required.filter(field => !covered.has(field));
    if (uncovered.length) problems.push(`missing evidence for ${uncovered.join(', ')}`);
    return problems;
}

// prefix(missingFields | null) keeps each rule's old wording at the start of the message.
function assertEvidence(evidence, options, prefix) {
    if (!Array.isArray(evidence)) throw badRequest('evidence must be an array');
    const problems = evidenceProblems(evidence, options);
    if (!problems.length) return;
    const missing = problems.length === 1 && problems[0].startsWith('missing evidence for ') ? problems[0].slice('missing evidence for '.length) : null;
    throw badRequest(`${prefix(missing)}: ${problems.join('; ')} — ${SHAPE}`);
}

module.exports = { evidenceProblems, assertEvidence };
