const { localize } = require('./localize');
const { loadCommuLingoDrills, drillDecksForHrefs } = require('./drills');

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

// 사전 상세 페이지의 「퀴즈로 익히기」 목록. 실패해도 그 칸만 비우고 페이지는 산다.
async function practiceDecksFor(hrefs, lang) {
    try {
        const drills = await loadCommuLingoDrills();
        return drillDecksForHrefs(drills, hrefs).map(meta => ({
            id: meta.id,
            kind: meta.kind,
            group: localize(meta.groupLabel, lang),
            title: localize(meta.title, lang),
        }));
    } catch (err) {
        console.error('commulingo practice decks:', err);
        return [];
    }
}

module.exports = { localizedMeta, deckBody, practiceDecksFor };
