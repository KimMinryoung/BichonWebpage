const express = require('express');
const { setShortPublicCache } = require('../data/commulingo/page-helpers');
const { redirectTarget } = require('../data/commulingo/people-store');
const { loadStandardizedPeople, localizedPersonSections } = require('../data/commulingo/people-view');
const { peopleApiBody } = require('../data/commulingo/people-presentation');

// JSON API over the people dictionary (people, offices). Same snapshot and
// standardization as the pages; thirty-second public cache.

const router = express.Router();
router.get('/api/activity-catalog', (req, res) => {
    setShortPublicCache(res);
    res.json(require('../data/commulingo/person-activities').catalog);
});

router.get('/api/people', async (req, res) => {
    try {
        const { loaded, standardized } = await loadStandardizedPeople(res.locals.lang);
        setShortPublicCache(res);
        res.type('application/json').send(peopleApiBody(loaded, standardized));
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

// A hover preview of the person, event, term or reference document a link points at
// (public/js/commulingo-link-preview.js): name, years and one line. Person:
// the card's epithet. Event: its one-sentence blurb, else its summary's first sentence. Term: its
// definition's first sentence, the original name and years beside the name.
// Document: its summary's first sentence, the year and kind beside the title.
// Course: its description, or a chapter's title and summary.
const firstSentence = (text, max = 200) => {
    const plain = String(text || '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`#>]/g, '').replace(/\s+/g, ' ').trim();
    const m = plain.match(/^(.+?[.!?。])(?=\s|$)/);
    const one = m && m[1].length >= 12 ? m[1] : plain;
    return [...one].length > max ? [...one].slice(0, max - 1).join('') + '…' : one;
};

router.get('/api/preview/:kind/:id', async (req, res) => {
    try {
        const id = typeof req.params.id === 'string' ? req.params.id.trim() : '';
        const lang = res.locals.lang === 'en' ? 'en' : 'ko';
        let preview = null;
        if (req.params.kind === 'person') {
            const { loaded, standardized } = await loadStandardizedPeople(lang);
            const person = standardized.peopleById[id] || standardized.peopleById[redirectTarget(loaded.data, 'person', id)];
            if (person) preview = { title: person.displayName, meta: person.yearsLabel || '', text: person.epithet || firstSentence(person.bio) };
        } else if (req.params.kind === 'event') {
            const events = await require('../data/commulingo/history-events-store').loadCommuLingoHistoryEvents();
            const event = events.find(item => item.id === id);
            if (event) preview = { title: event.title[lang] || event.title.ko, meta: event.period || '',
                text: (event.blurb && (event.blurb[lang] || event.blurb.ko)) || firstSentence(event.summary[lang] || event.summary.ko) };
        } else if (req.params.kind === 'term') {
            const terms = await require('../data/commulingo/terms-store').loadCommuLingoTerms();
            const term = terms.find(item => item.id === id);
            if (term) {
                const period = term.period?.[lang] || term.period?.ko || '';
                preview = { title: term.term[lang] || term.term.ko, meta: [term.original, period].filter(Boolean).join(' · '),
                    text: firstSentence(term.definition[lang] || term.definition.ko) };
            }
        } else if (req.params.kind === 'doc') {
            const docs = require('../data/commulingo/docs-store');
            const doc = docs.getCommuLingoDoc(id) || docs.getCommuLingoDocRedirect(id)?.doc;
            if (doc) {
                const year = (String(doc.date || '').match(/^-?\d{1,4}/) || [''])[0];
                preview = { title: doc.title?.[lang] || doc.title?.ko || id, meta: [year, doc.kind?.[lang] || doc.kind?.ko].filter(Boolean).join(' · '),
                    text: firstSentence(doc.summary?.[lang] || doc.summary?.ko) };
            }
        } else if (req.params.kind === 'book') {
            // A course, or one chapter of it when the link names a lesson
            // (/commulingo/book/<id>#lesson=<lesson>; the script sends the
            // lesson as ?lesson=, a hash never reaches the server).
            const { loadCommuLingoCatalog } = require('../data/commulingo/shards');
            const collection = ((loadCommuLingoCatalog() || {}).collections || []).find(item => item.id === id);
            if (collection) {
                const pick = value => (value && (value[lang] || value.ko)) || '';
                const lesson = typeof req.query.lesson === 'string' ? req.query.lesson : '';
                const chapter = lesson && (collection.chapters || []).find(item => (item.lessons || []).some(l => l.id === lesson));
                preview = chapter
                    ? { title: pick(chapter.title), meta: [pick(collection.title), chapter.chapterNumber ? (lang === 'en' ? 'Ch. ' + chapter.chapterNumber : chapter.chapterNumber + '장') : ''].filter(Boolean).join(' · '),
                        text: firstSentence(pick(chapter.summary)) }
                    : { title: pick(collection.title), meta: lang === 'en' ? 'Course' : '강좌', text: firstSentence(pick(collection.description)) };
            }
        }
        if (!preview) return res.status(404).json({ error: 'not found' });
        setShortPublicCache(res);
        res.json(preview);
    } catch (err) {
        console.error('commulingo preview api:', err);
        res.status(500).json({ error: 'failed to load preview' });
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
