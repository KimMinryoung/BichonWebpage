// Validation for the CommuLingo course documents (`course/<id>` data
// documents, see index.js). Three layers:
//
// validateCourseShape   — cheap structural checks run by validateDataDocument
//                         on every write, so a put cannot break a loader.
// courseIssues          — the content rules (scripts/lib/commulingo-checks.js)
//                         over a list of courses; scripts/validate-commulingo.js
//                         runs it over the whole bundle in npm test.
// gateCourseWrite       — what a write must pass on top of the shape: no rule
//                         failure the course did not already have (outside
//                         the tolerated baseline), Korean excerpts verbatim in
//                         the site documents, and no question replaced outright
//                         while keeping its id (learner history is keyed by
//                         lesson id + question id).
const fs = require('fs');
const path = require('path');

const SCRIPTS = path.join(__dirname, '..', '..', 'scripts');
const BASELINE_PATH = path.join(SCRIPTS, 'commulingo-quality-baseline.json');
const ID = /^[A-Za-z0-9_-]+$/;
const QUIZ_FORMATS = new Set(['', 'short-learning', 'guided-reading']);
const SPECIAL_FORMATS = new Set(['decision-history', 'concept-graph']);

function badRequest(message, status = 400) {
    const err = new Error(message);
    err.status = status;
    return err;
}

function checks() {
    return require('../../scripts/lib/commulingo-checks');
}

// ── Shape ──────────────────────────────────────────────────────────────────
function validateCourseShape(key, course) {
    const id = key.slice('course/'.length);
    if (course.id !== id) throw badRequest(`${key}: course id must match the key`);
    if (!ID.test(id)) throw badRequest(`${key}: unsafe course id`);
    const format = course.format || '';
    if (!QUIZ_FORMATS.has(format) && !SPECIAL_FORMATS.has(format)) throw badRequest(`${key}: unknown format ${format}`);
    if (course.publicChapterLimit !== undefined
        && (!Number.isInteger(course.publicChapterLimit) || course.publicChapterLimit < 0)) {
        throw badRequest(`${key}: publicChapterLimit must be a non-negative integer`);
    }
    if (!course.title || typeof course.title !== 'object') throw badRequest(`${key}: title missing`);
    // genealogy: a site genealogy chart (/commulingo/genealogy/<id>) linked
    // under the course description; sourceProblems checks that it exists.
    if (course.genealogy !== undefined && !(typeof course.genealogy === 'string' && ID.test(course.genealogy))) {
        throw badRequest(`${key}: genealogy must be a chart id`);
    }
    if (!Array.isArray(course.chapters)) throw badRequest(`${key}: chapters must be an array`);
    if (SPECIAL_FORMATS.has(format)) {
        if (course.chapters.length) throw badRequest(`${key}: a ${format} course has no quiz chapters`);
        if (format === 'decision-history' && !course.decisionTimeline) throw badRequest(`${key}: decisionTimeline missing`);
        if (format === 'concept-graph' && !course.conceptGraph) throw badRequest(`${key}: conceptGraph missing`);
        return;
    }
    const chapterIds = new Set();
    for (const chapter of course.chapters) {
        if (!chapter || typeof chapter.id !== 'string' || !chapter.id) throw badRequest(`${key}: every chapter needs an id`);
        if (chapterIds.has(chapter.id)) throw badRequest(`${key}: duplicate chapter id ${chapter.id}`);
        chapterIds.add(chapter.id);
        if (!Number.isInteger(chapter.chapterNumber)) throw badRequest(`${key}: ${chapter.id} chapterNumber must be an integer`);
        if (!Array.isArray(chapter.lessons)) throw badRequest(`${key}: ${chapter.id} lessons must be an array`);
        checkChapterCard(key, chapter);
        for (const lesson of chapter.lessons) {
            if (!lesson || !ID.test(lesson.id || '')) throw badRequest(`${key}: ${chapter.id} has a lesson with an unsafe or missing id`);
            if (!Array.isArray(lesson.questions)) throw badRequest(`${key}: ${lesson.id} questions must be an array`);
            const questionIds = new Set();
            for (const question of lesson.questions) {
                if (!question || typeof question.id !== 'string' || !question.id) throw badRequest(`${key}: ${lesson.id} has a question without an id`);
                if (questionIds.has(question.id)) throw badRequest(`${key}: ${lesson.id} duplicate question id ${question.id}`);
                questionIds.add(question.id);
            }
        }
    }
}

// The chapter card's length and readings are fields, not prose to parse: the
// summary no longer opens with 약 12분 · / About 12 minutes ·, and each
// reading is { author?, title, year, endYear?, doc?, anchor? } with ko and en
// text. doc names the site reference document holding the full text (anchor:
// the section read); the page only renders the link, and sourceProblems checks
// that the document and anchor exist.
const LENGTH_PREFIX = /^\s*(약\s*\d+\s*분|About\s+\d+\s+minutes?)\s*·/i;
function checkChapterCard(key, chapter) {
    const where = `${key}: ${chapter.id}`;
    if (chapter.minutes !== undefined && !(Number.isInteger(chapter.minutes) && chapter.minutes > 0 && chapter.minutes <= 180)) {
        throw badRequest(`${where} minutes must be a whole number of minutes`);
    }
    const summary = chapter.summary || {};
    for (const lang of ['ko', 'en']) {
        if (typeof summary[lang] === 'string' && LENGTH_PREFIX.test(summary[lang])) {
            throw badRequest(`${where} summary.${lang} starts with the reading time; put it in minutes`);
        }
    }
    if (chapter.readings === undefined) return;
    if (!Array.isArray(chapter.readings) || !chapter.readings.length) throw badRequest(`${where} readings must be a non-empty array`);
    const bilingual = value => value && typeof value === 'object'
        && typeof value.ko === 'string' && value.ko.trim() && typeof value.en === 'string' && value.en.trim();
    chapter.readings.forEach((reading, index) => {
        const at = `${where} readings[${index}]`;
        if (!reading || typeof reading !== 'object') throw badRequest(`${at} must be an object`);
        if (!bilingual(reading.title)) throw badRequest(`${at}.title needs ko and en`);
        if (reading.author !== undefined && !bilingual(reading.author)) throw badRequest(`${at}.author needs ko and en`);
        if (!Number.isInteger(reading.year)) throw badRequest(`${at}.year must be an integer`);
        if (reading.endYear !== undefined && !(Number.isInteger(reading.endYear) && reading.endYear > reading.year)) {
            throw badRequest(`${at}.endYear must be an integer after year`);
        }
        if (reading.doc !== undefined && !(typeof reading.doc === 'string' && ID.test(reading.doc))) throw badRequest(`${at}.doc must be a document id`);
        if (reading.anchor !== undefined && !(reading.doc && typeof reading.anchor === 'string' && ID.test(reading.anchor))) {
            throw badRequest(`${at}.anchor needs a doc and must be an element id`);
        }
        // url: the original elsewhere, for works the library does not host
        // (copyright still running); a reading links to a site doc or a url, not both.
        if (reading.url !== undefined && !(typeof reading.url === 'string' && /^https?:\/\/[^\s"'<>]+$/.test(reading.url))) {
            throw badRequest(`${at}.url must be an http(s) address`);
        }
        if (reading.url !== undefined && reading.doc !== undefined) throw badRequest(`${at} has both doc and url`);
        if (reading.offsite !== undefined && !(reading.url && typeof reading.offsite === 'string' && reading.offsite.trim())) {
            throw badRequest(`${at}.offsite needs a url and says why the site document does not serve`);
        }
        // genealogy: a site genealogy chart (/commulingo/genealogy/<id>) the
        // chapter is mapped on; one link target per reading.
        if (reading.genealogy !== undefined && !(typeof reading.genealogy === 'string' && ID.test(reading.genealogy))) {
            throw badRequest(`${at}.genealogy must be a chart id`);
        }
        if (reading.genealogy !== undefined && (reading.doc !== undefined || reading.url !== undefined)) {
            throw badRequest(`${at} links to a genealogy chart and to a doc or url`);
        }
        const extra = Object.keys(reading).filter(k => !['author', 'title', 'year', 'endYear', 'doc', 'anchor', 'url', 'genealogy', 'offsite'].includes(k));
        if (extra.length) throw badRequest(`${at} has unknown fields ${extra.join(', ')}`);
    });
}

// Lesson ids must be unique across the whole site (they are URLs and
// progress keys); the shape check sees one course, this sees them all.
function duplicateLessonIds(courses) {
    const seen = new Map();
    const duplicates = [];
    for (const course of courses) {
        for (const chapter of course.chapters || []) {
            for (const lesson of chapter.lessons || []) {
                if (seen.has(lesson.id) && seen.get(lesson.id) !== course.id) duplicates.push(`${lesson.id} (${seen.get(lesson.id)}, ${course.id})`);
                seen.set(lesson.id, course.id);
            }
        }
    }
    return duplicates;
}

// ── Content rules ──────────────────────────────────────────────────────────
function checkSpecialCourse(lib, out, course) {
    const id = course.id;
    lib.allLocalizedText(out, course.title, id + '.title');
    lib.allLocalizedText(out, course.description, id + '.description');
    if (course.format === 'concept-graph') {
        const graph = course.conceptGraph || {};
        lib.allLocalizedText(out, graph.question, id + '.conceptGraph.question');
        lib.allLocalizedText(out, graph.thesis, id + '.conceptGraph.thesis');
        const nodes = graph.nodes || [];
        if (!nodes.length) out.add('shape', id, id + '.conceptGraph has no nodes');
        lib.checkLocalizedItems(out, nodes, id + '.conceptGraph.nodes', ['label', 'summary']);
        const seen = new Set();
        nodes.forEach((node, index) => {
            if (!node || !String(node.id || '').trim()) out.add('shape', id, `${id}.conceptGraph.nodes[${index}].id is empty`);
            else if (seen.has(node.id)) out.add('shape', id, `${id} duplicate concept node id ${node.id}`);
            else seen.add(node.id);
            lib.checkLocalizedItems(out, (node && node.stages) || [], `${id}.conceptGraph.nodes[${index}].stages`, ['label', 'text']);
        });
        return;
    }
    const timeline = course.decisionTimeline || {};
    lib.allLocalizedText(out, timeline.question, id + '.decisionTimeline.question');
    lib.allLocalizedText(out, timeline.thesis, id + '.decisionTimeline.thesis');
    lib.checkLocalizedItems(out, timeline.stances, id + '.decisionTimeline.stances', ['label', 'desc']);
    const eras = timeline.eras || [];
    if (!eras.length) out.add('shape', id, id + '.decisionTimeline has no eras');
    lib.checkLocalizedItems(out, eras, id + '.decisionTimeline.eras', ['title', 'intro']);
    const stanceIds = new Set((timeline.stances || []).map(stance => stance && stance.id));
    const seen = new Set();
    eras.forEach((era, eraIndex) => {
        const eraLabel = `${id}.decisionTimeline.eras[${eraIndex}]`;
        if (!yearsOk(era && era.years)) out.add('shape', id, eraLabel + '.years must be [start year, end year?]');
        const episodes = (era && era.episodes) || [];
        lib.checkLocalizedItems(out, episodes, eraLabel + '.episodes',
            ['title', 'role', 'briefing', 'question', 'outcome', 'ripple', 'insight']);
        episodes.forEach((episode, episodeIndex) => {
            const label = `${eraLabel}.episodes[${episodeIndex}]`;
            if (!episode || !String(episode.id || '').trim()) { out.add('shape', id, label + '.id is empty'); return; }
            if (seen.has(episode.id)) out.add('shape', id, `${id} duplicate episode id ${episode.id}`);
            else seen.add(episode.id);
            decisionEpisodeProblems(episode, stanceIds).forEach(problem => out.add('shape', id, `${label} (${episode.id}) ${problem}`));
            lib.checkLocalizedItems(out, episode.options, label + '.options', ['label', 'note']);
        });
    });
    // No em dash in the Korean prose (the house rule for new writing).
    walkKorean(timeline, '', (value, where) => {
        if (value.includes('—')) out.add('wording', id, `${id}.decisionTimeline${where} has an em dash (—) in Korean text`);
    });
}

// Decision-history episodes keep their facts as data: date
// { start: [y, m?, d?], end?, calendar? }, 2-4 options whose stance (optional)
// is one of the book's stances, sources [{ doc, anchor? }] and eventIds.
const CALENDARS = new Set(['julian', 'gregorian']);
function dateTupleOk(value) {
    if (!Array.isArray(value) || value.length < 1 || value.length > 3) return false;
    const [y, m, d] = value;
    if (!Number.isInteger(y) || y < 1000 || y > 2100) return false;
    if (m !== undefined && !(Number.isInteger(m) && m >= 1 && m <= 12)) return false;
    if (d !== undefined && !(m !== undefined && Number.isInteger(d) && d >= 1 && d <= 31)) return false;
    return true;
}
function yearsOk(value) {
    return Array.isArray(value) && value.length >= 1 && value.length <= 2
        && value.every(year => Number.isInteger(year)) && (value.length === 1 || value[1] >= value[0]);
}
function decisionEpisodeProblems(episode, stanceIds) {
    const problems = [];
    const date = episode.date;
    if (!date || typeof date !== 'object' || !dateTupleOk(date.start)) problems.push('date.start must be [year, month?, day?]');
    else {
        if (date.end !== undefined && !dateTupleOk(date.end)) problems.push('date.end must be [year, month?, day?]');
        if (date.calendar !== undefined && !CALENDARS.has(date.calendar)) problems.push('date.calendar must be julian or gregorian');
    }
    const options = Array.isArray(episode.options) ? episode.options : [];
    if (options.length < 2 || options.length > 4) problems.push('needs 2 to 4 options');
    const optionIds = new Set();
    options.forEach(option => {
        if (!option || !ID.test(option.id || '')) { problems.push('has an option without a safe id'); return; }
        if (optionIds.has(option.id)) problems.push(`duplicate option id ${option.id}`);
        optionIds.add(option.id);
        if (option.stance !== undefined && option.stance !== null && !stanceIds.has(option.stance)) problems.push(`option ${option.id} has unknown stance ${option.stance}`);
    });
    if (!optionIds.has(episode.actualId)) problems.push('actualId is not one of its options');
    if (episode.historyEventId !== undefined) problems.push('historyEventId is replaced by eventIds');
    if (episode.eventIds !== undefined && !(Array.isArray(episode.eventIds) && episode.eventIds.every(item => typeof item === 'string' && ID.test(item)))) {
        problems.push('eventIds must be an array of event ids');
    }
    if (episode.sources !== undefined) {
        if (!Array.isArray(episode.sources)) problems.push('sources must be an array');
        else episode.sources.forEach((src, index) => {
            if (!src || typeof src.doc !== 'string' || !ID.test(src.doc)) problems.push(`sources[${index}].doc must be a document id`);
            if (src && src.anchor !== undefined && !(typeof src.anchor === 'string' && ID.test(src.anchor))) problems.push(`sources[${index}].anchor must be an element id`);
            const extra = Object.keys(src || {}).filter(k => k !== 'doc' && k !== 'anchor');
            if (extra.length) problems.push(`sources[${index}] has unknown fields ${extra.join(', ')}`);
        });
    }
    return problems;
}
function walkKorean(value, where, visit) {
    if (Array.isArray(value)) value.forEach((item, index) => walkKorean(item, `${where}[${index}]`, visit));
    else if (value && typeof value === 'object') {
        Object.keys(value).forEach(key => {
            if (key === 'ko' && typeof value.ko === 'string') visit(value.ko, `${where}.ko`);
            else walkKorean(value[key], `${where}.${key}`, visit);
        });
    }
}

// [{ rule, label, message }] for these courses, checked together (the
// duplicate-prompt rule looks across courses).
function courseIssues(courses) {
    const lib = checks();
    const out = lib.createCollector();
    const quiz = [];
    for (const course of courses) {
        if (SPECIAL_FORMATS.has(course.format)) { checkSpecialCourse(lib, out, course); continue; }
        lib.allLocalizedText(out, course.title, course.id + '.title');
        lib.allLocalizedText(out, course.description, course.id + '.description');
        if (!(course.chapters || []).length) out.add('shape', course.id, course.id + ' has no chapters');
        quiz.push(course);
    }
    lib.checkChapters(out, quiz);
    duplicateLessonIds(courses).forEach(entry => out.add('shape', 'bundle', 'duplicate lesson id ' + entry));
    return out.issues;
}

function readBaseline() {
    try {
        return JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));
    } catch (err) {
        return { tolerated: {} };
    }
}

function isTolerated(baseline, issue) {
    const list = baseline && baseline.tolerated && baseline.tolerated[issue.rule];
    return Boolean(list && list.includes(issue.label));
}

// ── Off-site links to hosted works ─────────────────────────────────────────
// A reading or question source that names, in 『』 or 「」, a work the library
// hosts must link the site document, not marxists.org (2026-11-09: Lenin's
// Imperialism, Hilferding, Engels's Origin of the Family, Kollontai and The
// State and Revolution were all linked off-site). Titles come from each
// document's Korean title and aliases. When the site document lacks the part
// cited (a chapter outside a selection), `offsite: "<why>"` on the source or
// reading keeps the external link.
const BRACKETED = /[『「]([^』」]+)[』」]/g;
const titleKey = value => String(value || '').replace(/[\s·,.:!?()「」『』<>-]/g, '').toLowerCase();

function hostedTitles(docs) {
    const out = new Map();
    for (const doc of docs) {
        const texts = [doc.title && doc.title.ko, ...((doc.aliases && doc.aliases.ko) || [])].filter(Boolean);
        for (const text of texts) {
            const keys = [...String(text).matchAll(BRACKETED)].map(m => m[1]);
            if (!/[『「]/.test(text)) keys.push(text);
            for (const key of keys.map(titleKey)) if (key.length >= 4 && !out.has(key)) out.set(key, doc.id);
        }
    }
    return out;
}

function offsiteHostedWork(titles, label) {
    for (const m of String(label || '').matchAll(BRACKETED)) {
        const id = titles.get(titleKey(m[1]));
        if (id) return { title: m[0], id };
    }
    return null;
}

// ── Source excerpts (site documents) ───────────────────────────────────────
// A guided-reading question must quote the site's own translation verbatim.
// External sources (marxists.org, for Capital) are only shape-checked here:
// scripts/check-course-source-excerpts.js verifies them against its cache.
function sourceProblems(course) {
    const text = require('../../scripts/lib/commulingo-source-text');
    const { getCommuLingoDoc, getCommuLingoDocContent } = require('./docs-store');
    const required = course.format === 'guided-reading';
    const docs = new Map();
    const siteDoc = id => {
        if (!docs.has(id)) {
            const doc = getCommuLingoDoc(id);
            if (!doc) docs.set(id, null);
            else {
                const raw = getCommuLingoDocContent(doc).html;
                docs.set(id, { text: text.normalizeSiteDoc(raw), ids: text.anchorsOf(raw) });
            }
        }
        return docs.get(id);
    };
    const problems = [];
    const timeline = course.decisionTimeline;
    if (timeline) {
        let events = null;
        const eventIds = () => {
            if (!events) {
                try {
                    const { SNAPSHOT_PATH } = require('./history-events-store');
                    events = new Set(JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf8')).map(event => event.id));
                } catch (err) { events = null; }
            }
            return events;
        };
        for (const episode of (timeline.eras || []).flatMap(era => (era && era.episodes) || [])) {
            (episode.sources || []).forEach((src, index) => {
                if (!src || !src.doc) return;
                const page = siteDoc(src.doc);
                if (!page) problems.push(`${episode.id}/sources[${index}]: document ${src.doc} not found`);
                else if (src.anchor && !page.ids.has(src.anchor)) problems.push(`${episode.id}/sources[${index}]: #${src.anchor} not in ${src.doc}`);
            });
            const known = (episode.eventIds || []).length ? eventIds() : null;
            if (known) (episode.eventIds || []).forEach(eventId => {
                if (!known.has(eventId)) problems.push(`${episode.id}: history event ${eventId} not found`);
            });
        }
    }
    if (course.genealogy) {
        const { getGenealogyChart } = require('./genealogy-store');
        if (!getGenealogyChart(course.genealogy)) problems.push(`genealogy chart ${course.genealogy} not found`);
    }
    let titles = null;
    const hosted = label => {
        if (!titles) {
            try { titles = hostedTitles(require('./docs-store').listCommuLingoDocs()); } catch (err) { titles = new Map(); }
        }
        return offsiteHostedWork(titles, label);
    };
    for (const chapter of course.chapters || []) {
        (chapter.readings || []).forEach((reading, index) => {
            const work = reading && reading.url && !reading.offsite ? hosted(reading.title && reading.title.ko) : null;
            if (work) problems.push(`${chapter.id}/readings[${index}]: ${work.title} links off-site (${reading.url}) but the library hosts it: use doc ${work.id} (or offsite: "<why>")`);
            if (reading && reading.genealogy) {
                const { getGenealogyChart } = require('./genealogy-store');
                if (!getGenealogyChart(reading.genealogy)) problems.push(`${chapter.id}/readings[${index}]: genealogy chart ${reading.genealogy} not found`);
                return;
            }
            if (!reading || !reading.doc) return;
            const where = `${chapter.id}/readings[${index}]`;
            const page = siteDoc(reading.doc);
            if (!page) problems.push(`${where}: document ${reading.doc} not found`);
            else if (reading.anchor && !page.ids.has(reading.anchor)) problems.push(`${where}: #${reading.anchor} not in ${reading.doc}`);
        });
        for (const lesson of chapter.lessons || []) {
            for (const question of lesson.questions || []) {
                const where = `${lesson.id}/${question.id}`;
                const source = question.source;
                if (!source) { if (required) problems.push(`${where}: no source`); continue; }
                const work = /^https?:/.test(String(source.href || '')) && !source.offsite ? hosted(source.label && source.label.ko) : null;
                if (work) problems.push(`${where}: ${work.title} links off-site (${source.href}) but the library hosts it: use /commulingo/docs/${work.id} (or offsite: "<why>")`);
                const site = /^\/commulingo\/docs\/([^#]+)#(.+)$/.exec(String(source.href || ''));
                if (!site) continue;
                const page = siteDoc(site[1]);
                if (!page) { problems.push(`${where}: document ${site[1]} not found`); continue; }
                if (!page.ids.has(site[2])) problems.push(`${where}: #${site[2]} not in ${site[1]}`);
                const quote = source.quote && source.quote.ko;
                // A `reference` source points at the passage without quoting it.
                if (!quote && source.kind === 'reference' && !required) continue;
                if (!quote) { problems.push(`${where}: no Korean quote`); continue; }
                for (const piece of text.quotePieces(quote)) {
                    if (!text.containsQuote(page.text, piece)) problems.push(`${where}: not verbatim in ${site[1]}: ${piece.slice(0, 40)}…`);
                }
            }
        }
    }
    return problems;
}

// ── Question ids ───────────────────────────────────────────────────────────
function questionMap(course) {
    const out = new Map();
    for (const chapter of (course && course.chapters) || []) {
        for (const lesson of chapter.lessons || []) {
            for (const q of lesson.questions || []) {
                const choices = (q.choices && q.choices.ko) || [];
                out.set(`${lesson.id}/${q.id}`, { prompt: (q.prompt && q.prompt.ko) || '', answer: choices[q.answer] || '' });
            }
        }
    }
    return out;
}

function lessonIds(course) {
    return new Set(((course && course.chapters) || []).flatMap(chapter => (chapter.lessons || []).map(lesson => lesson.id)));
}

// What the write changes, for the dry-run report.
function changeSummary(prev, next) {
    const before = questionMap(prev);
    const after = questionMap(next);
    const lessonsBefore = lessonIds(prev);
    const lessonsAfter = lessonIds(next);
    const changed = [...after.keys()].filter(key => before.has(key)
        && JSON.stringify(before.get(key)) !== JSON.stringify(after.get(key)));
    return {
        lessonsAdded: [...lessonsAfter].filter(id => !lessonsBefore.has(id)),
        lessonsRemoved: [...lessonsBefore].filter(id => !lessonsAfter.has(id)),
        questionsAdded: [...after.keys()].filter(key => !before.has(key)).length,
        questionsRemoved: [...before.keys()].filter(key => !after.has(key)),
        questionsChanged: changed.length,
        publicChapterLimit: [prev ? prev.publicChapterLimit || 0 : null, next.publicChapterLimit || 0],
    };
}

// ── Write gate ─────────────────────────────────────────────────────────────
// others: the other courses as they will stand after this write.
function gateCourseWrite({ key, next, prev, others }) {
    const failures = [];
    const baseline = readBaseline();
    const fingerprint = issue => `${issue.rule}\0${issue.label}\0${issue.message}`;
    const before = new Set(prev ? courseIssues([...others, prev]).map(fingerprint) : []);
    courseIssues([...others, next])
        .filter(issue => !before.has(fingerprint(issue)) && !isTolerated(baseline, issue))
        .forEach(issue => failures.push(`[${issue.rule}] ${issue.message}`));

    const oldSources = new Set(prev ? sourceProblems(prev) : []);
    sourceProblems(next).filter(problem => !oldSources.has(problem))
        .forEach(problem => failures.push(`[source] ${problem}`));

    if (prev) {
        const ids = require('../../scripts/lib/commulingo-question-ids');
        for (const found of ids.replacedIds(questionMap(prev), questionMap(next), ids.loadKeepList())) {
            failures.push(`[question-id] ${found.key} now asks a different question (prompt ${found.promptSim.toFixed(2)}, answer ${found.answerSim.toFixed(2)}): `
                + `give it a new id such as ${ids.replacementId(found.key.split('/')[1], new Set())}`);
        }
    }
    if (failures.length) {
        const shown = failures.slice(0, 30).join('\n');
        throw badRequest(`${key}: ${failures.length} problem(s)\n${shown}${failures.length > 30 ? `\n… ${failures.length - 30} more` : ''}`);
    }
    return changeSummary(prev, next);
}

module.exports = { hostedTitles, offsiteHostedWork, validateCourseShape, courseIssues, readBaseline, isTolerated, sourceProblems, gateCourseWrite, changeSummary };
