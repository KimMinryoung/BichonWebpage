#!/usr/bin/env node
// The genealogy renderer keeps every node on its own year: where a lane is too
// crowded, the time axis stretches instead of boxes sliding past later years'
// gridlines. Also the node panel's stand-in note (an entry's description)
// is cut at a sentence end.
const assert = require('assert');
const { renderGenealogySvg } = require('../../data/commulingo/genealogy-svg');
const { clip } = require('../../data/commulingo/genealogy-notes');

const node = (id, year, column = 'a') => ({ id, year, column, label: { ko: id, en: id }, ref: { type: 'term', id } });
const chart = {
    id: 'layout-test', title: { ko: 't', en: 't' }, timeStart: 1900, timeEnd: 1940, pxPerYear: 6,
    columns: [{ id: 'a', label: { ko: 'A', en: 'A' } }, { id: 'b', label: { ko: 'B', en: 'B' } }],
    // Four boxes in one lane a year apart: far more than 6px a year can hold.
    nodes: [node('n1', 1910), node('n2', 1911), node('n3', 1912), node('n4', 1913), node('m', 1930, 'b')],
    edges: [{ from: 'n1', to: 'n2', type: 'succession', label: { ko: '이어짐', en: 'next' } }],
};
const { svg } = renderGenealogySvg(chart, 'ko');

const boxes = {};
for (const match of svg.matchAll(/data-node="([^"]+)"><rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="([\d.]+)"/g)) {
    boxes[match[1]] = { y: Number(match[2]), height: Number(match[3]) };
}
const ticks = {};
for (const match of svg.matchAll(/<text class="gen-year" x="[\d.]+" y="([\d.]+)"[^>]*>(\d+)<\/text>/g)) ticks[match[2]] = Number(match[1]) - 4;

assert.deepEqual(Object.keys(boxes).sort(), ['m', 'n1', 'n2', 'n3', 'n4']);
// Same lane: no overlap, in year order.
for (const [a, b] of [['n1', 'n2'], ['n2', 'n3'], ['n3', 'n4']]) {
    assert.ok(boxes[b].y >= boxes[a].y + boxes[a].height, `${b} overlaps ${a}`);
}
// Every box starts on (just above) its own year's line, so the 1920 and 1930
// gridlines come after the crowded 1910s and the 1930 node sits on 1930.
assert.ok(ticks['1920'] > boxes.n4.y, 'the 1920 line must come after the 1913 box');
assert.ok(Math.abs(boxes.m.y + 4 - ticks['1930']) < 1, 'the 1930 node sits on the 1930 line');
// No border radius on the boxes (site design standard).
assert.ok(!/<rect[^>]* rx=/.test(svg), 'node boxes are square');
// Edge labels come after every line, so no line is drawn across a label.
assert.ok(svg.lastIndexOf('class="gen-edge ') < svg.indexOf('class="gen-edge-label"') || !svg.includes('gen-edge-label'));

// Two labelled edges leaving one box for neighbouring targets: the labels
// must not sit on each other (each clears the boxes and the labels before it).
const fan = renderGenealogySvg({
    ...chart, id: 'fan-test', pxPerYear: 20, columns: chart.columns.slice(0, 1),
    nodes: [node('src', 1910), node('t1', 1914), node('t2', 1915)],
    edges: [
        { from: 'src', to: 't1', type: 'succession', label: { ko: '외채 상환 부담', en: 'a' } },
        { from: 'src', to: 't2', type: 'succession', label: { ko: '빚을 갚는 긴축', en: 'b' } },
    ],
}, 'ko').svg;
const labels = [...fan.matchAll(/class="gen-edge-label"[^>]* x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]+)</g)]
    .map(m => ({ x: Number(m[1]), y: Number(m[2]), half: m[3].length * 5 + 4 }));
assert.equal(labels.length, 2, 'both labels have room');
for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
    const [a, b] = [labels[i], labels[j]];
    const apart = Math.abs(a.x - b.x) >= a.half + b.half || Math.abs(a.y - b.y) >= 14;
    assert.ok(apart, 'edge labels overlap');
}

assert.equal(clip('짧은 설명.'), '짧은 설명.');
const long = '첫 문장은 이렇다. '.repeat(30);
const cut = clip(long);
assert.ok(cut.length <= 220 && cut.endsWith('.'), 'cut at a sentence end');
assert.ok(clip('가'.repeat(300)).endsWith('…'), 'one overlong sentence is cut with an ellipsis');
console.log('ok: genealogy layout');
