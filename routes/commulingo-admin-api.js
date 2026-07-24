const express = require('express');
const { requireAdminIp } = require('../middleware/auth');
const {
    listPeopleAdmin,
    getPersonAdmin,
    createPersonAdmin,
    updatePersonAdmin,
    deletePersonAdmin,
    listOfficesAdmin,
    getOfficeAdmin,
    createOfficeRowAdmin,
    updateOfficeRowAdmin,
    deleteOfficeRowAdmin,
    listPersonSectionsAdmin,
    upsertPersonSectionAdmin,
    deletePersonSectionAdmin,
} = require('../data/commulingo/people-admin-store');
const { importDoc, updateDocMeta, removeDoc } = require('../data/commulingo/docs-import');
const { listCommuLingoDocs } = require('../data/commulingo/docs-store');

const router = express.Router();

router.use(requireAdminIp);

function changedBy(req) {
    return req.session && req.session.isAuthenticated ? 'admin-session' : `admin-ip:${req.ip || 'unknown'}`;
}

function sendError(res, err) {
    const status = err.status || 500;
    if (status >= 500) console.error('commulingo admin api:', err);
    res.status(status).json({ error: err.message || 'internal error' });
}

router.get('/people', async (req, res) => {
    try {
        const people = await listPeopleAdmin({
            q: req.query.q,
            groupId: req.query.groupId,
            limit: req.query.limit,
            offset: req.query.offset,
        });
        res.json({ people });
    } catch (err) {
        sendError(res, err);
    }
});

router.post('/people', async (req, res) => {
    try {
        const person = await createPersonAdmin(req.body || {}, { changedBy: changedBy(req) });
        res.status(201).json({ person });
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/people/:personId', async (req, res) => {
    try {
        const person = await getPersonAdmin(req.params.personId);
        if (!person) return res.status(404).json({ error: 'person not found' });
        res.json({ person });
    } catch (err) {
        sendError(res, err);
    }
});

router.patch('/people/:personId', async (req, res) => {
    try {
        const person = await updatePersonAdmin(req.params.personId, req.body || {}, { changedBy: changedBy(req) });
        res.json({ person });
    } catch (err) {
        sendError(res, err);
    }
});

router.delete('/people/:personId', async (req, res) => {
    try {
        const result = await deletePersonAdmin(req.params.personId, { changedBy: changedBy(req) });
        res.json(result);
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/people/:personId/sections', async (req, res) => {
    try {
        const sections = await listPersonSectionsAdmin(req.params.personId);
        res.json({ sections });
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/people/:personId/sections/:slug', async (req, res) => {
    try {
        const sections = await listPersonSectionsAdmin(req.params.personId);
        const section = sections.find(item => item.slug === req.params.slug);
        if (!section) return res.status(404).json({ error: 'section not found' });
        res.json({ section });
    } catch (err) {
        sendError(res, err);
    }
});

router.put('/people/:personId/sections/:slug', async (req, res) => {
    try {
        const section = await upsertPersonSectionAdmin(
            req.params.personId,
            req.params.slug,
            req.body || {},
            { changedBy: changedBy(req) }
        );
        res.json({ section });
    } catch (err) {
        sendError(res, err);
    }
});

router.delete('/people/:personId/sections/:slug', async (req, res) => {
    try {
        const result = await deletePersonSectionAdmin(
            req.params.personId,
            req.params.slug,
            { changedBy: changedBy(req) }
        );
        res.json(result);
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/offices', async (req, res) => {
    try {
        const offices = await listOfficesAdmin();
        res.json({ offices });
    } catch (err) {
        sendError(res, err);
    }
});

router.get('/offices/:officeId', async (req, res) => {
    try {
        const office = await getOfficeAdmin(req.params.officeId);
        if (!office) return res.status(404).json({ error: 'office not found' });
        res.json({ office });
    } catch (err) {
        sendError(res, err);
    }
});

router.post('/offices/:officeId/rows', async (req, res) => {
    try {
        const row = await createOfficeRowAdmin(req.params.officeId, req.body || {}, { changedBy: changedBy(req) });
        res.status(201).json({ row });
    } catch (err) {
        sendError(res, err);
    }
});

router.patch('/office-rows/:rowId', async (req, res) => {
    try {
        const row = await updateOfficeRowAdmin(req.params.rowId, req.body || {}, { changedBy: changedBy(req) });
        res.json({ row });
    } catch (err) {
        sendError(res, err);
    }
});

router.delete('/office-rows/:rowId', async (req, res) => {
    try {
        const result = await deleteOfficeRowAdmin(req.params.rowId, { changedBy: changedBy(req) });
        res.json(result);
    } catch (err) {
        sendError(res, err);
    }
});

// ---- Reference documents (참고 문헌) ----------------------------------------
// Files under the host-mounted data/commulingo/docs/, so API writes land in
// the working tree — review and commit them afterwards.

router.get('/docs', (req, res) => {
    try {
        res.json({ docs: listCommuLingoDocs() });
    } catch (err) {
        sendError(res, err);
    }
});

// Upload a document: raw HTML body (Content-Type: text/html), slug and flags
// in the query string. Converts to a fragment and registers it, exactly like
// scripts/import-commulingo-doc.js. ?dryRun=1 previews without writing.
//   curl -sS -X POST -H 'Content-Type: text/html' --data-binary @doc.html \
//     '<admin-origin>/commulingo/admin/api/docs?id=my-doc'
const rawHtmlBody = express.text({ type: ['text/html', 'application/xhtml+xml'], limit: '20mb' });
router.post('/docs', rawHtmlBody, (req, res) => {
    try {
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
    } catch (err) {
        sendError(res, err);
    }
});

// Merge metadata into a manifest entry ({ko,en} fields merge per-language;
// people/tocExclude replace wholesale).
//   curl -sS -X PATCH -H 'Content-Type: application/json' \
//     -d '{"description":{"ko":"…"},"source":"…"}' '<admin-origin>/commulingo/admin/api/docs/my-doc'
router.patch('/docs/:docId', (req, res) => {
    try {
        res.json({ entry: updateDocMeta(req.params.docId, req.body || {}) });
    } catch (err) {
        sendError(res, err);
    }
});

router.delete('/docs/:docId', (req, res) => {
    try {
        res.json({ removed: removeDoc(req.params.docId) });
    } catch (err) {
        sendError(res, err);
    }
});

module.exports = router;
