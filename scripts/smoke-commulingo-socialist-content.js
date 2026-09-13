const assert = require('node:assert/strict');
const path = require('node:path');

const state = require('./content/socialist-states-20260908.json');
const depth = require('./content/socialist-event-depth-20260908.json');
const graphIds = [
    'socialist-planning-and-reform',
    'socialist-economies-and-decolonization',
    'socialist-economies-state-building',
];
const localized = (value, label) => {
    assert.equal(typeof value?.ko, 'string', label + '.ko');
    assert.equal(typeof value?.en, 'string', label + '.en');
    assert(value.ko.trim() && value.en.trim(), label + ' must be bilingual');
};
const sources = (value, label) => {
    assert(Array.isArray(value) && value.length, label + ' sources required');
    for (const source of value) assert(/^https:\/\//.test(source), label + ' source must use HTTPS: ' + source);
};
const uniqueIds = (entries, label) => {
    assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length, label + ' IDs must be unique');
};

assert.equal(state.id, 'socialist-states-20260908');
assert.deepEqual(
    { terms: state.terms.length, events: state.events.length, people: state.people.length, coverage: state.coverage.length },
    { terms: 23, events: 16, people: 21, coverage: 25 }
);
for (const [label, entries] of Object.entries({ terms: state.terms, events: state.events, people: state.people })) uniqueIds(entries, label);
for (const term of state.terms) {
    assert(term.term_ko && term.term_en && term.definition_ko && term.definition_en && term.body_ko && term.body_en, 'incomplete term: ' + term.id);
    assert(Array.isArray(term.people), 'term people must be an array: ' + term.id);
    sources(term.sources, term.id);
}
for (const event of state.events) {
    assert(event.title_ko && event.title_en && event.summary_ko && event.summary_en && event.body_ko && event.body_en, 'incomplete event: ' + event.id);
    assert(Array.isArray(event.people) && Array.isArray(event.countries) && event.countries.length, 'event relations required: ' + event.id);
    assert(Array.isArray(event.locations) && event.locations.filter(location => location.kind === 'main').length === 1, 'one main location required: ' + event.id);
    sources(event.sources, event.id);
    for (const personId of event.people) {
        const role = state.eventRoles?.[event.id]?.[personId];
        assert(role?.kind && role.ko && role.en, 'missing bilingual event role: ' + event.id + '/' + personId);
    }
}
for (const person of state.people) {
    localized(person.bio, person.id + '.bio');
    for (const lang of ['ko', 'en']) {
        assert(person.givenName?.[lang]?.trim() || person.familyName?.[lang]?.trim(), 'person name required: ' + person.id + '.' + lang);
    }
    assert(person.citizenship?.code && person.nationalOrigin?.code && person.role?.category, 'incomplete person identity: ' + person.id);
    assert(Array.isArray(person.evidence) && person.evidence.length, 'person evidence required: ' + person.id);
    sources(person.sources, person.id);
    for (const section of person.sections) {
        localized(section.heading, person.id + '/' + section.slug + '.heading');
        localized(section.body, person.id + '/' + section.slug + '.body');
        sources(section.sources, person.id + '/' + section.slug);
    }
}
assert.equal(new Set(state.coverage.map(entry => entry.code)).size, 25, 'coverage country codes must be unique');
for (const entry of state.coverage) assert(entry.code && entry.event && entry.term && Array.isArray(entry.people), 'incomplete country coverage');

assert.equal(depth.id, 'socialist-event-depth-20260908');
assert.equal(depth.events.length, 16);
uniqueIds(depth.events, 'event depth');
assert.deepEqual(new Set(depth.events.map(entry => entry.id)), new Set(state.events.map(entry => entry.id)));
for (const event of depth.events) {
    assert(event.sections.length >= 5, 'event depth requires at least five sections: ' + event.id);
    sources(event.fields.sources, event.id + '.depth');
    for (const section of event.sections) for (const paragraph of section.paragraphs) {
        assert(paragraph.ko && paragraph.en, 'bilingual depth paragraph required: ' + event.id);
        sources(paragraph.sources, event.id + '.paragraph');
    }
}

let graphNodeCount = 0;
for (const graphId of graphIds) {
    const graph = require(path.join('..', 'data', 'commulingo', 'genealogy', graphId + '.json'));
    uniqueIds(graph.nodes, graphId + ' nodes');
    graphNodeCount += graph.nodes.length;
    const nodeIds = new Set(graph.nodes.map(node => node.id));
    for (const edge of graph.edges) assert(nodeIds.has(edge.from) && nodeIds.has(edge.to), 'unknown graph edge endpoint: ' + graphId);
}
assert.equal(graphNodeCount, 50, 'socialist economy graphs must contain 50 nodes');
console.log('socialist state, event-depth and genealogy artifacts passed');
