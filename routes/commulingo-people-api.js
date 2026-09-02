const express = require('express');
const { setShortPublicCache } = require('../data/commulingo/page-helpers');
const { redirectTarget } = require('../data/commulingo/people-store');
const { loadStandardizedPeople, localizedPersonSections } = require('../data/commulingo/people-view');

// JSON API over the people dictionary (people, offices). Same snapshot and
// standardization as the pages; thirty-second public cache.

const router = express.Router();

// The full people payload is ~9 MB of JSON; serializing it took ~100 ms of
// event-loop time per request. It is a pure function of the standardized
// snapshot (and the source label, which flips snapshot→db once after a cold
// start), so the string is memoized the way catalog.json is.
const peopleApiMemo = new WeakMap(); // standardized -> Map(source -> JSON string)

router.get('/api/people', async (req, res) => {
    try {
        const { loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        let bySource = peopleApiMemo.get(standardized);
        if (!bySource) {
            bySource = new Map();
            peopleApiMemo.set(standardized, bySource);
        }
        let body = bySource.get(loaded.source);
        if (!body) {
            body = JSON.stringify({
                schemaVersion: standardized.schemaVersion,
                source: loaded.source,
                lang: standardized.lang,
                peopleCount: standardized.people.length,
                people: standardized.people,
                groups: standardized.groups.map(group => ({
                    id: group.id,
                    range: group.range,
                    title: group.title,
                    blurb: group.blurb,
                    people: group.people.map(person => person.id),
                })),
            });
            bySource.set(loaded.source, body);
        }
        setShortPublicCache(res);
        res.type('application/json').send(body);
    } catch (err) {
        console.error('commulingo people api:', err);
        res.status(500).json({ error: 'failed to load people data' });
    }
});

router.get('/api/people/:personId', async (req, res) => {
    try {
        const personId = typeof req.params.personId === 'string' ? req.params.personId.trim() : '';
        const { loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        const person = standardized.peopleById[personId];
        if (!person) {
            const merged = redirectTarget(loaded.data, 'person', personId);
            if (merged) return res.redirect(301, `/commulingo/api/people/${merged}`);
            return res.status(404).json({ error: 'person not found' });
        }
        const sections = localizedPersonSections((loaded.data.sections || {})[personId] || [], standardized.lang);
        setShortPublicCache(res);
        res.json({ schemaVersion: standardized.schemaVersion, source: loaded.source, lang: standardized.lang, person, sections });
    } catch (err) {
        console.error('commulingo person api:', err);
        res.status(500).json({ error: 'failed to load person data' });
    }
});

router.get('/api/offices', async (req, res) => {
    try {
        const { loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        setShortPublicCache(res);
        res.json({
            schemaVersion: standardized.schemaVersion,
            source: loaded.source,
            lang: standardized.lang,
            offices: standardized.offices,
        });
    } catch (err) {
        console.error('commulingo offices api:', err);
        res.status(500).json({ error: 'failed to load offices data' });
    }
});

router.get('/api/offices/:officeId', async (req, res) => {
    try {
        const officeId = typeof req.params.officeId === 'string' ? req.params.officeId.trim() : '';
        const { loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        const office = standardized.offices.find(item => item.id === officeId);
        if (!office) return res.status(404).json({ error: 'office not found' });
        setShortPublicCache(res);
        res.json({ schemaVersion: standardized.schemaVersion, source: loaded.source, lang: standardized.lang, office });
    } catch (err) {
        console.error('commulingo office api:', err);
        res.status(500).json({ error: 'failed to load office data' });
    }
});

module.exports = router;
