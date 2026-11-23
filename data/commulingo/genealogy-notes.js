// What the node panel says about a node the chart gives no note of its own.
//
// A chart's note tells where a node sits in the story; most nodes have none,
// and on a phone (no hover tooltip) the panel then showed a bare title. The
// linked dictionary entry already says what the thing is, so its short
// description stands in: a term's definition, an event's or a document's
// summary, a person's epithet. It is read from the entry each time rather than
// copied into the chart, so it never falls behind an edit of the entry.
const { termListData } = require('./term-presentation');
const { presentedEventList } = require('./event-presentation');
const { loadCommuLingoHistoryEvents } = require('./history-events-store');
const { listCommuLingoDocs } = require('./docs-store');
const { loadStandardizedPeople } = require('./people-view');
const { localize } = require('./localize');

const MAX_CHARS = 220;

// Whole sentences up to MAX_CHARS; a first sentence longer than that is cut.
function clip(text) {
    const value = String(text || '').replace(/\s+/g, ' ').trim();
    if (value.length <= MAX_CHARS) return value;
    const sentences = value.match(/[^.!?。]+[.!?。]+["”’」』)]*\s*/g) || [];
    let out = '';
    for (const sentence of sentences) {
        if ((out + sentence).trim().length > MAX_CHARS) break;
        out += sentence;
    }
    return out.trim() || `${value.slice(0, MAX_CHARS - 1).trim()}…`;
}

const SOURCES = {
    async term(lang) {
        const { terms } = await termListData(lang, 'name');
        return id => { const term = terms.find(t => t.id === id); return term && term.definition; };
    },
    async event(lang) {
        const events = presentedEventList(await loadCommuLingoHistoryEvents(), lang);
        return id => { const event = events.find(e => e.id === id); return event && event.summary; };
    },
    async doc(lang) {
        const docs = listCommuLingoDocs();
        return id => { const doc = docs.find(d => d.id === id); return doc && localize(doc.summary, lang); };
    },
    async person(lang) {
        const { standardized } = await loadStandardizedPeople(lang);
        const people = standardized.people || [];
        return id => { const person = people.find(p => p.id === id); return person && person.epithet; };
    },
};

// Fills `note` on the rendered nodes (genealogy-svg.js) that have none and
// marks those with `noteFromEntry`. A source that fails to load leaves its
// nodes as they were: the panel still works without the text.
async function fillMissingNotes(nodes, chartNodes, lang) {
    const refs = new Map(chartNodes.filter(n => n && n.ref).map(n => [n.id, n.ref]));
    const wanted = nodes.filter(node => !node.note && refs.get(node.id) && refs.get(node.id).id);
    const types = [...new Set(wanted.map(node => refs.get(node.id).type))].filter(type => SOURCES[type]);
    const lookups = {};
    await Promise.all(types.map(async type => {
        try { lookups[type] = await SOURCES[type](lang); } catch (err) {
            console.error(`[commulingo genealogy] ${type} summaries:`, err.message);
        }
    }));
    for (const node of wanted) {
        const ref = refs.get(node.id);
        const lookup = lookups[ref.type];
        let text = '';
        try { text = lookup ? clip(lookup(String(ref.id))) : ''; } catch (err) {
            console.error(`[commulingo genealogy] ${ref.type} ${ref.id} summary:`, err.message);
        }
        if (text) {
            node.note = text;
            node.noteFromEntry = true;
        }
    }
    return nodes;
}

module.exports = { fillMissingNotes, clip };
