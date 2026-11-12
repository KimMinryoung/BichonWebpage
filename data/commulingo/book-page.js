const { loadCommuLingoLesson, loadCommuLingoCatalog } = require('./shards');
const { localize } = require('./localize');
const { getLinkIndexes, createLinker, clientPersonLinkPayload, standardizedFor } = require('./linkify');
const { roleIconSvg } = require('./role-icons');

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
    const chapterDictionary = await chapterDictionaryEntries(collection, lang);

    const entry = { collectionRef: collection, linked, chapterDictionary, decisionLinks };
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

// Which dictionary entries each chapter actually talks about, read off what the
// linker found rather than curated by hand. The lesson screen shows a chapter's
// entries under its concept brief; one list for the whole book ran to dozens
// of chips that had little to do with any one chapter. Walks every lesson
// shard of the collection, so it only runs from bookPageData's memo miss, not
// per request.
//
// A chip carries the entry's headword, not whichever alias the prose happened to
// use: prose saying 맬서스 인구론 or 감소되지 않은 노동수익 lists 맬서스주의 and
// 노동전수익권, the names those entries are filed under. The index entries carry
// exactly those labels, so no second lookup table is needed.
async function chapterDictionaryEntries(collection, lang) {
    const indexes = await getLinkIndexes(lang);
    const LABELS = {
        people: entry => entry.displayName || localize(entry.name, lang),
        terms: entry => entry.label,
        events: entry => entry.title,
        docs: entry => entry.label,
    };
    const byChapter = {};
    for (const chapter of collection.chapters || []) {
        const found = { people: new Map(), terms: new Map(), events: new Map(), docs: new Map() };
        for (const passage of chapterPassages(chapter, lang)) {
            const linked = passageEntries(indexes, collection, passage);
            Object.keys(found).forEach(kind => {
                linked[kind].forEach(entry => {
                    const label = LABELS[kind](entry);
                    if (label && !found[kind].has(entry.id)) found[kind].set(entry.id, { id: entry.id, label });
                });
            });
        }
        if (!Object.values(found).some(map => map.size)) continue;
        byChapter[chapter.id] = {
            people: [...found.people.values()],
            terms: [...found.terms.values()],
            events: [...found.events.values()],
            docs: [...found.docs.values()],
        };
    }
    return byChapter;
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
            if (section.table) (section.table.rows || []).forEach(row => (row || []).forEach(add));
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

// The course chapters that teach a dictionary entry, for its detail page's
// practice links: those that list it by hand in chapter.eventIds,
// chapter.personIds or chapter.termIds. Nothing is inferred from the lesson
// prose; an unlisted chapter is not offered. Each link opens the chapter's
// first lesson (/commulingo/book/<book>#lesson=<lesson>).
const CHAPTER_ENTRY_FIELDS = { events: 'eventIds', people: 'personIds', terms: 'termIds' };

// keys are `${kind}:${id}` with kind 'people' | 'terms' | 'events' (a paired
// term/event page passes both). Catalog order: course by course, chapter by
// chapter.
async function courseChaptersFor(keys, lang) {
    const wanted = new Set(keys);
    const out = [];
    const seen = new Set();
    for (const collection of (loadCommuLingoCatalog() || {}).collections || []) {
        for (const chapter of collection.chapters || []) {
            const lesson = (chapter.lessons || [])[0];
            if (!lesson || seen.has(lesson.id)) continue;
            const listed = Object.entries(CHAPTER_ENTRY_FIELDS).some(([kind, field]) => (
                Array.isArray(chapter[field]) && chapter[field].some(id => wanted.has(kind + ':' + id))
            ));
            if (!listed) continue;
            seen.add(lesson.id);
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

// Scene cards: a cast entry may name a political-position collection
// (cast[].position, a people-index collection id such as monarchist or
// national-liberation). It gains the chip the person cards wear for that
// position: the collection's label and glyph, and its colour key.
async function decorateStoryCast(lesson) {
    const story = lesson.storyCards;
    if (!story) return;
    const wanted = ['ko', 'en'].flatMap(lang => ((story[lang] && story[lang].cards) || [])
        .flatMap(card => (card.cast || []).filter(member => member.position)));
    if (!wanted.length) return;
    const { loadCommuLingoPeople } = require('./people-store');
    const { collectionPosition } = require('./person-position');
    const loaded = await loadCommuLingoPeople();
    const byId = new Map(((loaded && loaded.data && loaded.data.collections) || []).map(c => [c.id, c]));
    for (const lang of ['ko', 'en']) {
        ((story[lang] && story[lang].cards) || []).forEach(card => (card.cast || []).forEach(member => {
            const collection = member.position && byId.get(member.position);
            if (!collection) return;
            member.positionTag = {
                label: localize(collection.title, lang),
                colour: collectionPosition(collection.id),
                iconSvg: collection.icon ? roleIconSvg(collection.icon) : '',
            };
        }));
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
            if (section.table && Array.isArray(section.table.rows)) {
                section.table.rowsHtml = section.table.rows.map(row => (row || []).map(linkBrief));
            }
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
    await decorateStoryCast(lesson);
    return lesson;
}

// The titles of the documents and history events a decision book's episodes
// cite (episode.sources[].doc, episode.eventIds), so the browser only renders
// the links the course data names. Unknown ids are left out; the write gate
// refuses them anyway.
async function decisionRefs(collection, lang = 'ko') {
    const timeline = collection && collection.decisionTimeline;
    const out = { docs: {}, events: {}, actors: {} };
    if (!timeline) return out;
    const episodes = (timeline.eras || []).flatMap(era => era.episodes || []);
    const { getCommuLingoDoc } = require('./docs-store');
    for (const ep of episodes) {
        for (const src of ep.sources || []) {
            const doc = src && getCommuLingoDoc(src.doc);
            if (doc) out.docs[doc.id] = doc.title;
        }
    }
    const wanted = new Set(episodes.flatMap(ep => ep.eventIds || []));
    if (wanted.size) {
        const { loadCommuLingoHistoryEvents } = require('./history-events-store');
        for (const event of await loadCommuLingoHistoryEvents()) {
            if (wanted.has(event.id)) out.events[event.id] = event.title;
        }
    }
    // options[].actors: the people the episode puts behind each option. The
    // chip carries the person's short name and the colour and icon of the
    // person card's political position.
    const actorIds = new Set(episodes.flatMap(ep => (ep.options || []).flatMap(opt => (opt.actors || []).map(actor => actor.personId)).filter(Boolean)));
    if (actorIds.size) {
        const { loadCommuLingoPeople } = require('./people-store');
        const loaded = await loadCommuLingoPeople();
        const { standardized } = standardizedFor(loaded.data, loadCommuLingoCatalog(), lang);
        for (const person of standardized.people) {
            if (!actorIds.has(person.id)) continue;
            out.actors[person.id] = {
                name: person.names.shortLabel,
                position: person.position || '',
                iconSvg: person.positionTag && person.positionTag.icon ? roleIconSvg(person.positionTag.icon) : '',
            };
        }
    }
    return out;
}

module.exports = { decisionRefs, bookPageData, linkifyLessonPayload, courseChaptersFor, courseChaptersForDoc };
