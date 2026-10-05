// Helpers the stages share (ported from leninbot commulingo/pipeline/stages.py).
const { workTopics } = require('../bundles');

// Artifacts after the latest topic hand-off; earlier topics' work is history.
function currentArtifacts(artifacts) {
    for (let i = artifacts.length - 1; i >= 0; i--) {
        if (artifacts[i].value && artifacts[i].value.remaining_topics) return artifacts.slice(i + 1);
    }
    return artifacts;
}

// The editor (version 2) stores research and draft inside one artifact.
function latest(artifacts, stage) {
    for (const artifact of [...currentArtifacts(artifacts)].reverse()) {
        const value = artifact.value || {};
        if (value.editor_version === 2 && ['research', 'draft'].includes(stage) && stage in value) return value[stage];
        if (artifact.stage === stage) return value;
    }
    return {};
}

function writeRequest(job, draft) {
    return { target: draft.target || job.kind, action: draft.action || job.action, id: job.target,
        fields: draft.fields, sources: draft.sources, changedBy: 'commulingo-pipeline' };
}

// The citation gate's verdict numbers stay in the artifact, not in the suggestion history.
function reviewNoteChecks(checks) {
    return (checks || []).map(check => {
        if (!check || typeof check !== 'object') return check;
        const rest = { ...check };
        delete rest.citation_check;
        return rest;
    });
}

function isRevisionConflict(err) {
    return err && (err.code === 'revision_conflict' || /revision_conflict/.test(err.message || ''));
}

// Editorial-store rejections (4xx) are stage outcomes; anything else is a failure.
function isRejection(err) {
    return err && err.status && err.status < 500;
}

function topicsLabel(job) {
    return `[${workTopics(job).map(topic => `'${topic}'`).join(', ')}]`;
}

module.exports = { currentArtifacts, latest, writeRequest, reviewNoteChecks, isRevisionConflict, isRejection, topicsLabel };
