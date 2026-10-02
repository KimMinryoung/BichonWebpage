const { loadCommuLingoLesson, loadCommuLingoCatalog } = require('./shards');
const { localize } = require('./localize');
const { getLinkIndexes, createLinker, clientPersonLinkPayload } = require('./linkify');
const { blockedPhrases } = require('./link-blocklist');
const { WORD_CHAR } = require('./people-linkify');

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
    const linkers = await commuLingoLinkers(collection.noAutoLink);
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

async function commuLingoLinkers(noAutoLink = []) {
    const byLang = {};
    for (const lang of ['ko', 'en']) {
        const indexes = await getLinkIndexes(lang);
        byLang[lang] = () => {
            const link = createLinker(indexes, { surface: 'learning', blockStrings: noAutoLink });
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
    for (const chapter of collection.chapters || []) {
        for (const passage of chapterPassages(chapter, lang)) {
            const linked = passageEntries(indexes, collection, passage);
            Object.keys(found).forEach(kind => {
                linked[kind].forEach(entry => {
                    const label = LABELS[kind](entry);
                    if (label && !found[kind].has(entry.id)) found[kind].set(entry.id, { id: entry.id, label });
                });
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

// The prose of one chapter a reader meets: summary, focus, and each lesson
// shard's brief, map, diagram notes and answer explanations.
function chapterPassages(chapter, lang) {
    const passages = [];
    const add = value => { if (value) passages.push(value); };
    add(chapter.summary && chapter.summary[lang]);
    add(chapter.learningFocus && chapter.learningFocus[lang]);
    for (const stub of chapter.lessons || []) {
        const payload = loadCommuLingoLesson(stub.id);
        if (!payload) continue;
        const lesson = payload.lesson;
        ((lesson.conceptBrief && lesson.conceptBrief[lang]) || []).forEach(section => {
            add(section.text);
            (section.items || []).forEach(add);
        });
        ((lesson.conceptMap && lesson.conceptMap[lang]) || []).forEach(node => add(node.text));
        const diagram = lesson.diagram && lesson.diagram[lang];
        if (diagram) {
            (diagram.steps || []).forEach(step => add(step.note));
            [diagram.left, diagram.right].forEach(side => {
                if (side) (side.rows || []).forEach(add);
            });
        }
        (lesson.questions || []).forEach(question => add(question.explanation && question.explanation[lang]));
    }
    return passages;
}

// A fresh linker per passage, the same restraint the reader sees: an entry
// linked once in a passage.
function passageEntries(indexes, collection, passage) {
    const link = createLinker(indexes, { surface: 'learning', blockStrings: collection.noAutoLink || [] });
    link.plain(passage);
    return link.found;
}

// The reverse of bookDictionaryEntries, per chapter: which course chapters a
// dictionary entry is linked from, so its detail page can send a reader into
// the lesson (/commulingo/book/<book>#lesson=<first lesson>). Chapters where
// the entry is linked from more passages come first.
//
// Walking every lesson shard takes seconds of CPU, so the build yields after
// each chapter and a detail page never waits for it: until the index for the
// current link-index generation is ready the section is simply left out.
const courseIndexMemo = new WeakMap(); // indexes -> { catalogRef, byEntry, building }

// Glossary and event spellings kept out of automatic linking ('search' policy,
// e.g. 자코뱅파) still say what a chapter is about. They count only when the
// chapter uses them at least twice, and never when the phrase is blocklisted.
const SEARCH_ONLY_MIN_HITS = 2;

function searchOnlyExpressions(indexes, lang) {
    const blocked = new Set(blockedPhrases(lang));
    const out = [];
    for (const [indexKind, kind] of [['term', 'terms'], ['event', 'events']]) {
        const index = indexes[indexKind];
        Object.entries((index && index.expressions) || {}).forEach(([key, expression]) => {
            if (expression.policy !== 'search' || [...expression.text].length < 2 || blocked.has(expression.text)) return;
            out.push({ key: kind + ':' + key.slice(0, key.length - expression.text.length - 1), text: expression.text });
        });
    }
    return out;
}

function countMentions(text, phrase, lang) {
    let count = 0;
    for (let at = text.indexOf(phrase); at !== -1; at = text.indexOf(phrase, at + phrase.length)) {
        const before = text[at - 1] || '';
        const after = text[at + phrase.length] || '';
        // Korean refuses only a match glued to a preceding word (particles
        // follow); English needs a boundary on both sides.
        if (WORD_CHAR.test(before)) continue;
        if (lang === 'en' && WORD_CHAR.test(after)) continue;
        count += 1;
    }
    return count;
}

async function buildCourseChapterIndex(indexes, catalog, lang) {
    const byEntry = new Map(); // `${kind}:${id}` -> [{ ..., hits }]
    const searchOnly = searchOnlyExpressions(indexes, lang);
    for (const collection of (catalog && catalog.collections) || []) {
        for (const chapter of collection.chapters || []) {
            const lesson = (chapter.lessons || [])[0];
            if (!lesson) continue;
            await new Promise(resolve => setImmediate(resolve));
            const hits = new Map();
            const passages = chapterPassages(chapter, lang);
            const chapterText = passages.join('\n');
            searchOnly.forEach(({ key, text }) => {
                const count = countMentions(chapterText, text, lang);
                if (count >= SEARCH_ONLY_MIN_HITS) hits.set(key, (hits.get(key) || 0) + count);
            });
            for (const passage of passages) {
                // Yield per passage, not per chapter: one long chapter took up
                // to 7 s of uninterrupted CPU and stalled every request meanwhile.
                await new Promise(resolve => setImmediate(resolve));
                const linked = passageEntries(indexes, collection, passage);
                for (const kind of ['people', 'terms', 'events']) {
                    linked[kind].forEach(entry => {
                        const key = kind + ':' + entry.id;
                        hits.set(key, (hits.get(key) || 0) + 1);
                    });
                }
            }
            hits.forEach((count, key) => {
                const list = byEntry.get(key) || byEntry.set(key, []).get(key);
                list.push({
                    bookId: collection.id,
                    bookTitle: localize(collection.title, lang),
                    chapterNumber: chapter.chapterNumber,
                    chapterTitle: localize(chapter.title, lang),
                    lessonId: lesson.id,
                    hits: count,
                });
            });
        }
    }
    byEntry.forEach(list => list.sort((a, b) => b.hits - a.hits));
    return byEntry;
}

// The ready index, or null while it is (re)building.
async function courseChapterIndex(lang) {
    const indexes = await getLinkIndexes(lang);
    const catalog = loadCommuLingoCatalog();
    let memo = courseIndexMemo.get(indexes);
    if (!memo || memo.catalogRef !== catalog) {
        memo = { catalogRef: catalog, byEntry: null };
        courseIndexMemo.set(indexes, memo);
        memo.building = buildCourseChapterIndex(indexes, catalog, lang)
            .then(byEntry => { memo.byEntry = byEntry; })
            .catch(err => console.error('commulingo course chapters build:', err));
    }
    return memo;
}

// keys are `${kind}:${id}` with kind 'people' | 'terms' | 'events' (a paired
// term/event page passes both). Failure only costs the section.
async function courseChaptersFor(keys, lang, limit = 6) {
    try {
        const { byEntry } = await courseChapterIndex(lang === 'en' ? 'en' : 'ko');
        if (!byEntry) return [];
        const seen = new Set();
        return keys.flatMap(key => byEntry.get(key) || [])
            .sort((a, b) => b.hits - a.hits)
            .filter(item => !seen.has(item.lessonId) && seen.add(item.lessonId))
            .slice(0, limit);
    } catch (err) {
        console.error('commulingo course chapters:', err);
        return [];
    }
}

// Course chapters built on a reference document: those whose sourceUrl is the
// document page (any anchor), so a reader of the text can go and study it.
function courseChaptersForDoc(docId, lang) {
    const prefix = '/commulingo/docs/' + docId;
    const out = [];
    for (const collection of (loadCommuLingoCatalog() || {}).collections || []) {
        for (const chapter of collection.chapters || []) {
            const url = String(chapter.sourceUrl || '');
            const lesson = (chapter.lessons || [])[0];
            if (!lesson || (url !== prefix && !url.startsWith(prefix + '#'))) continue;
            out.push({
                bookId: collection.id,
                bookTitle: localize(collection.title, lang),
                chapterNumber: chapter.chapterNumber,
                chapterTitle: localize(chapter.title, lang),
                lessonId: lesson.id,
            });
        }
    }
    return out;
}

// Startup warm-up, one language after the other.
async function warmCourseChapters() {
    for (const lang of ['ko', 'en']) {
        try {
            await (await courseChapterIndex(lang)).building;
        } catch (err) {
            console.error('commulingo course chapters warm-up:', err.message);
        }
    }
}

async function linkifyLessonPayload(lesson) {
    const linkers = await commuLingoLinkers(lesson.noAutoLink);
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

module.exports = { bookPageData, linkifyLessonPayload, courseChaptersFor, courseChaptersForDoc, warmCourseChapters };
