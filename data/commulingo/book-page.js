const { loadCommuLingoLesson } = require('./shards');
const { localize } = require('./localize');
const { getLinkIndexes, createLinker, clientPersonLinkPayload } = require('./linkify');

// Book and lesson page data: the memoized per-book payload (decision-history
// links, linked chapter prose, dictionary chips) and the lesson linkifier.
// Pure functions of the catalog and the link indexes; the routes in
// routes/commulingo-books.js only add caching headers and rendering.

// Lessons speak the same vocabulary as the three dictionaries — 마르크스,
// 라살레, 임금철칙, 노동전수익권 — and said it in plain text, so a reader who
// met a name or a term in a concept brief had to go looking for it. The payload
// keeps its bilingual shape and gains *Html siblings; the client renders those
// where it has them and escapes the plain text where it does not, so a payload
// cached before this change still displays.
//
// Prompts and choices are deliberately left unlinked. A link inside a question
// invites the reader out of it mid-answer, and on a multiple-choice item it can
// point at the answer.
//
// One set of indexes per language, shared by the book page and the lesson
// payload. Each returned factory opens a fresh linker, so a passage links an
// entry at its first mention and leaves the rest plain. Everything else about
// the pass — which dictionaries, in what order, and the new tab a lesson's links
// open in — is the `learning` surface in linkify.js.
// Memoized per-book page data: the decision-history payload, the linked
// chapter prose, and the dictionary chips. Keyed by the collection and
// link-index references, which stay stable until the catalog or one of the
// dictionaries actually changes. The index object is the WeakMap key (as in
// personBodyMemo) so a rotated index set drops its generation instead of the
// entry pinning it until that book is next opened.
const bookPageMemo = new WeakMap(); // indexes -> Map(`${collectionId}:${lang}` -> { collectionRef, ... })

async function bookPageData(collection, langRaw) {
    const lang = langRaw === 'en' ? 'en' : 'ko';
    const indexes = await getLinkIndexes(lang);
    const key = `${collection.id}:${lang}`;
    let generation = bookPageMemo.get(indexes);
    if (!generation) {
        generation = new Map();
        bookPageMemo.set(indexes, generation);
    }
    const cached = generation.get(key);
    if (cached && cached.collectionRef === collection) return cached;

    // The decision-history book renders its episodes in the browser, so the
    // person index goes with the payload instead of a linker: the aliases are
    // the ones buildPersonLinkIndex kept, so the client applies the shared
    // policy rather than a hand-synced copy of it.
    const decisionLinks = collection.format === 'decision-history'
        ? clientPersonLinkPayload(indexes)
        : { blocked: [], people: [] };

    // Chapter summaries and learning focuses are the prose the book's own
    // page shows before a lesson is ever opened, so they carry the same
    // dictionary links the concept briefs do.
    const linkers = await commuLingoLinkers();
    const linked = {
        ...collection,
        chapters: (collection.chapters || []).map(chapter => ({
            ...chapter,
            summaryHtml: linkLocalized(linkers, chapter.summary),
            focusHtml: linkLocalized(linkers, chapter.learningFocus),
        })),
    };
    const dictionaryEntries = await bookDictionaryEntries(collection, lang);

    const entry = { collectionRef: collection, linked, dictionaryEntries, decisionLinks };
    generation.set(key, entry);
    return entry;
}

async function commuLingoLinkers() {
    const byLang = {};
    for (const lang of ['ko', 'en']) {
        const indexes = await getLinkIndexes(lang);
        byLang[lang] = () => {
            const link = createLinker(indexes, { surface: 'learning' });
            return value => (typeof value === 'string' && value ? link.plain(value) : '');
        };
    }
    return byLang;
}

// {ko, en} of prose in, {ko, en} of linked HTML out, each language with its own
// seen-set. Returns null for anything that is not a bilingual object, so the
// client keeps falling back to the plain field.
function linkLocalized(linkers, value) {
    if (!value || typeof value !== 'object') return null;
    const out = {};
    for (const lang of ['ko', 'en']) out[lang] = linkers[lang]()(value[lang] || '');
    return out;
}

// Which dictionary entries a book actually talks about, read off what the
// linker found rather than curated by hand — a chapter list of one-line
// summaries shows almost none of them, so the book page would otherwise give no
// sign that the entries exist. Walks every lesson shard of the collection, so
// it only runs from bookPageData's memo miss, not per request.
//
// A chip carries the entry's headword, not whichever alias the prose happened to
// use: prose saying 맬서스 인구론 or 감소되지 않은 노동수익 lists 맬서스주의 and
// 노동전수익권, the names those entries are filed under. The index entries carry
// exactly those labels, so no second lookup table is needed.
async function bookDictionaryEntries(collection, lang) {
    const indexes = await getLinkIndexes(lang);
    const found = { people: new Map(), terms: new Map(), events: new Map(), docs: new Map() };
    const LABELS = {
        people: entry => entry.displayName || localize(entry.name, lang),
        terms: entry => entry.label,
        events: entry => entry.title,
        docs: entry => entry.label,
    };
    const collect = value => {
        if (!value) return;
        // A fresh linker per passage, the same restraint the reader sees: an
        // entry linked once in a passage, and the book's chip list is the union.
        const link = createLinker(indexes, { surface: 'learning' });
        link.plain(value);
        Object.keys(found).forEach(kind => {
            link.found[kind].forEach(entry => {
                const label = LABELS[kind](entry);
                if (label && !found[kind].has(entry.id)) found[kind].set(entry.id, { id: entry.id, label });
            });
        });
    };
    for (const chapter of collection.chapters || []) {
        collect(chapter.summary && chapter.summary[lang]);
        collect(chapter.learningFocus && chapter.learningFocus[lang]);
        for (const stub of chapter.lessons || []) {
            const payload = loadCommuLingoLesson(stub.id);
            if (!payload) continue;
            const lesson = payload.lesson;
            ((lesson.conceptBrief && lesson.conceptBrief[lang]) || []).forEach(section => {
                collect(section.text);
                (section.items || []).forEach(collect);
            });
            ((lesson.conceptMap && lesson.conceptMap[lang]) || []).forEach(node => collect(node.text));
            const diagram = lesson.diagram && lesson.diagram[lang];
            if (diagram) {
                (diagram.steps || []).forEach(step => collect(step.note));
                [diagram.left, diagram.right].forEach(side => {
                    if (side) (side.rows || []).forEach(collect);
                });
            }
            (lesson.questions || []).forEach(question => {
                collect(question.explanation && question.explanation[lang]);
            });
        }
    }
    return {
        people: [...found.people.values()],
        terms: [...found.terms.values()],
        events: [...found.events.values()],
        docs: [...found.docs.values()],
    };
}

async function linkifyLessonPayload(lesson) {
    const linkers = await commuLingoLinkers();
    // The chapter summary and focus shown above the brief, linked the same way
    // the book page links them so the two screens do not disagree.
    lesson.summaryHtml = linkLocalized(linkers, lesson.summary);
    lesson.focusHtml = linkLocalized(linkers, lesson.focus);
    for (const lang of ['ko', 'en']) {
        const linker = linkers[lang];
        // The brief and the map are one passage and share a set. Each
        // explanation gets its own, because the reader meets it on its own card
        // after answering — sharing the brief's set would leave the quiz almost
        // link-free for anyone who read the brief first.
        const linkBrief = linker();
        ((lesson.conceptBrief && lesson.conceptBrief[lang]) || []).forEach(section => {
            if (section.text) section.textHtml = linkBrief(section.text);
            if (Array.isArray(section.items)) section.itemsHtml = section.items.map(linkBrief);
        });
        ((lesson.conceptMap && lesson.conceptMap[lang]) || []).forEach(node => {
            if (node.text) node.textHtml = linkBrief(node.text);
        });
        const diagram = lesson.diagram && lesson.diagram[lang];
        if (diagram) {
            (diagram.steps || []).forEach(step => {
                if (step.note) step.noteHtml = linkBrief(step.note);
            });
            [diagram.left, diagram.right].forEach(side => {
                if (side && Array.isArray(side.rows)) side.rowsHtml = side.rows.map(linkBrief);
            });
        }
        (lesson.questions || []).forEach(question => {
            const explanation = question.explanation && question.explanation[lang];
            if (!explanation) return;
            question.explanationHtml = question.explanationHtml || {};
            question.explanationHtml[lang] = linker()(explanation);
        });
    }
    return lesson;
}

module.exports = { bookPageData, linkifyLessonPayload };
