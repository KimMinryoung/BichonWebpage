const { localize } = require('./localize');

function localizedMeta(meta, lang) {
    return {
        id: meta.id,
        kind: meta.kind,
        mode: meta.mode,
        title: localize(meta.title, lang),
        description: localize(meta.description, lang),
        cardNote: meta.cardNote ? localize(meta.cardNote, lang) : '',
        roundSize: meta.roundSize,
        count: meta.count,
        countUnit: localize(meta.countUnit, lang),
    };
}

const deckJsonMemo = new WeakMap(); // drills.byId -> Map(deckId -> serialized)

function deckBody(drills, deckId) {
    let memo = deckJsonMemo.get(drills.byId);
    if (!memo) {
        memo = new Map();
        deckJsonMemo.set(drills.byId, memo);
    }
    let body = memo.get(deckId);
    if (!body) {
        body = JSON.stringify({ version: drills.version, deck: drills.byId.get(deckId) });
        memo.set(deckId, body);
    }
    return body;
}

module.exports = { localizedMeta, deckBody };
