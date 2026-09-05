// Relations store one parent id; children and siblings are derived from the
// published snapshot, so reciprocal lists cannot drift or expose draft pages.
const { localize } = require('./localize');

function eventRelationsFor(events, eventId, lang) {
    const byId = new Map(events.map(event => [event.id, event]));
    const event = byId.get(eventId);
    if (!event) return [];
    const relations = event.relations || {};
    const parent = byId.get(relations.parent);
    const result = [];
    const seen = new Set([eventId]);
    const add = (item, kind) => {
        if (!item || seen.has(item.id)) return;
        seen.add(item.id);
        result.push({ id: item.id, title: localize(item.title, lang), period: item.period, kind });
    };
    add(parent, 'parent');
    events.filter(item => item.relations?.parent === eventId).forEach(item => add(item, 'child'));
    if (parent && parent.id !== eventId) {
        // The page itself stays in the sibling run (kind 'self') so the panel can
        // mark where the reader is inside the cluster instead of hiding the slot.
        events.filter(item => item.relations?.parent === parent.id).forEach(item => {
            if (item.id === eventId) result.push({ id: item.id, title: localize(item.title, lang), period: item.period, kind: 'self' });
            else add(item, 'sibling');
        });
    }
    (Array.isArray(relations.related) ? relations.related : []).forEach(id => add(byId.get(id), 'related'));
    return result;
}

module.exports = { eventRelationsFor };
