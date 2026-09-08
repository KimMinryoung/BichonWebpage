const { readPersonEditorial, submitPersonEdit, reviewPersonSuggestion, saveEnrichment } = require('../data/commulingo/person-editorial-service');
const express = require('express');
const { requireAdminIp } = require('../middleware/auth');
const {
    listPeopleAdmin,
} = require('../data/commulingo/people-admin-store');
const {
    listOfficesAdmin,
    getOfficeAdmin,
    createOfficeRowAdmin,
    updateOfficeRowAdmin,
    deleteOfficeRowAdmin,
} = require('../data/commulingo/people-offices-store');
const {
    listPersonSectionsAdmin,
} = require('../data/commulingo/people-sections-store');
const { importDoc, updateDocMeta, removeDoc } = require('../data/commulingo/docs-import');
const { listCommuLingoDocs } = require('../data/commulingo/docs-store');
const { loadCommuLingoPeople } = require('../data/commulingo/people-store');
const { loadCommuLingoTerms } = require('../data/commulingo/terms-store');
const { loadCommuLingoHistoryEvents } = require('../data/commulingo/history-events-store');

const router = express.Router();

router.use(requireAdminIp);

function changedBy(req) {
    return req.session && req.session.isAuthenticated ? 'admin-session' : `admin-ip:${req.ip || 'unknown'}`;
}

function sendError(res, err) {
    const status = err.status || 500;
    if (status >= 500) console.error('commulingo admin api:', err);
    res.status(status).json({ error: err.message || 'internal error',
        ...(err.code === 'revision_conflict' ? { code: err.code, currentRevision: err.currentRevision } : {}) });
}

// Every handler funnels failures into sendError with the same shape; wrap the
// handler once (sync throws and rejections alike) instead of repeating the
// try/catch nineteen times.
function h(fn) {
    return async (req, res) => {
        try {
            await fn(req, res);
        } catch (err) {
            sendError(res, err);
        }
    };
}

router.get('/people', h(async (req, res) => {
    const people = await listPeopleAdmin({
        q: req.query.q,
        groupId: req.query.groupId,
        limit: req.query.limit,
        offset: req.query.offset,
    });
    res.json({ people });
}));

function personWrite(target, action) {
    return h(async (req, res) => {
        const fields = { ...(req.body || {}), ...(target === 'person_section' ? { slug: req.params.slug } : {}) };
        const result = await submitPersonEdit({ target, action, id: req.params.personId || fields.id,
            fields, sources: fields.sources }, { changedBy: changedBy(req) });
        if (result.status === 'pending') return res.status(202).json(result);
        res.status(action === 'create' ? 201 : 200).json(target === 'person' && action !== 'delete'
            ? { person: result.value } : target === 'person_section' && action !== 'delete'
                ? { section: result.value } : result.value);
    });
}
router.post('/people', personWrite('person', 'create'));

router.get('/people/:personId', h(async (req, res) => {
    const person = await readPersonEditorial(req.params.personId);
    if (!person) return res.status(404).json({ error: 'person not found' });
    res.json({ person });
}));

router.patch('/people/:personId', personWrite('person', 'update'));
router.delete('/people/:personId', personWrite('person', 'delete'));

router.get('/people/:personId/sections', h(async (req, res) => {
    const sections = await listPersonSectionsAdmin(req.params.personId);
    res.json({ sections });
}));

router.get('/people/:personId/sections/:slug', h(async (req, res) => {
    const sections = await listPersonSectionsAdmin(req.params.personId);
    const section = sections.find(item => item.slug === req.params.slug);
    if (!section) return res.status(404).json({ error: 'section not found' });
    res.json({ section });
}));

router.put('/people/:personId/sections/:slug', h(async (req, res) => {
    const exists = (await listPersonSectionsAdmin(req.params.personId)).some(s => s.slug === req.params.slug);
    return personWrite('person_section', exists ? 'update' : 'create')(req, res);
}));
router.delete('/people/:personId/sections/:slug', personWrite('person_section', 'delete'));
router.post('/people-suggestions/:id/review', h(async (req, res) => {
    if (typeof req.body?.approve !== 'boolean') return res.status(400).json({ error: 'approve must be boolean' });
    res.json(await reviewPersonSuggestion(req.params.id, req.body.approve, req.body.note, { changedBy: changedBy(req) }));
}));
router.put('/people/:personId/enrichment/:topic', h(async (req, res) => {
    res.json(await saveEnrichment({ ...req.body, id: req.params.personId, topic: req.params.topic }, { changedBy: changedBy(req) }));
}));

router.get('/offices', h(async (req, res) => {
    const offices = await listOfficesAdmin();
    res.json({ offices });
}));

router.get('/offices/:officeId', h(async (req, res) => {
    const office = await getOfficeAdmin(req.params.officeId);
    if (!office) return res.status(404).json({ error: 'office not found' });
    res.json({ office });
}));

router.post('/offices/:officeId/rows', h(async (req, res) => {
    const row = await createOfficeRowAdmin(req.params.officeId, req.body || {}, { changedBy: changedBy(req) });
    res.status(201).json({ row });
}));

router.patch('/office-rows/:rowId', h(async (req, res) => {
    const row = await updateOfficeRowAdmin(req.params.rowId, req.body || {}, { changedBy: changedBy(req) });
    res.json({ row });
}));

router.delete('/office-rows/:rowId', h(async (req, res) => {
    const result = await deleteOfficeRowAdmin(req.params.rowId, { changedBy: changedBy(req) });
    res.json(result);
}));

// ---- Reference documents (참고 문헌) ----------------------------------------
// Files under the host-mounted data/commulingo/docs/, so API writes land in
// the working tree — review and commit them afterwards.

router.get('/docs', h((req, res) => {
    res.json({ docs: listCommuLingoDocs() });
}));

// id + bilingual name for every linkable person/term/event — feeds the admin
// GUI's link pickers.
router.get('/docs-link-options', h(async (req, res) => {
    const [people, terms, events] = await Promise.all([
        loadCommuLingoPeople().then(loaded => (loaded.data.people || []).map(p => ({ id: p.id, name: p.name }))),
        loadCommuLingoTerms().then(list => list.map(t => ({ id: t.id, name: t.term }))),
        loadCommuLingoHistoryEvents().then(list => list.map(e => ({ id: e.id, name: e.title }))),
    ]);
    res.json({ people, terms, events });
}));

// Upload a document: raw HTML body (Content-Type: text/html), slug and flags
// in the query string. Converts to a fragment and registers it, exactly like
// scripts/import-commulingo-doc.js. ?dryRun=1 previews without writing.
//   curl -sS -X POST -H 'Content-Type: text/html' --data-binary @doc.html \
//     '<admin-origin>/commulingo/admin/api/docs?id=my-doc'
const rawHtmlBody = express.text({ type: ['text/html', 'application/xhtml+xml'], limit: '20mb' });
router.post('/docs', rawHtmlBody, h((req, res) => {
    if (typeof req.body !== 'string') {
        return res.status(415).json({ error: 'send the document as the raw request body with Content-Type: text/html' });
    }
    const result = importDoc({
        rawHtml: req.body,
        id: req.query.id,
        dryRun: req.query.dryRun === '1' || req.query.dryRun === 'true',
        force: req.query.force === '1' || req.query.force === 'true',
        overrides: { docLang: req.query.lang },
    });
    res.status(result.overwrote ? 200 : 201).json({
        ...result,
        url: `/commulingo/docs/${result.entry.id}`,
        next: 'fill in title.en/description/source via PATCH or by editing manifest.json, then commit data/commulingo/docs/',
    });
}));

// Merge metadata into a manifest entry ({ko,en} fields merge per-language;
// people/tocExclude replace wholesale).
//   curl -sS -X PATCH -H 'Content-Type: application/json' \
//     -d '{"description":{"ko":"…"},"source":"…"}' '<admin-origin>/commulingo/admin/api/docs/my-doc'
router.patch('/docs/:docId', h((req, res) => {
    res.json({ entry: updateDocMeta(req.params.docId, req.body || {}) });
}));

router.delete('/docs/:docId', h((req, res) => {
    res.json({ removed: removeDoc(req.params.docId) });
}));

module.exports = router;
