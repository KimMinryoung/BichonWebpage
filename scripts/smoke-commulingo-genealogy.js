#!/usr/bin/env node
// Every genealogy chart under data/commulingo/genealogy/ must be drawable:
// unique node ids, every edge joining two existing nodes in time order (the
// renderer draws top to bottom and silently skips a dangling endpoint, so a
// typo would vanish instead of failing), known edge types, nodes in declared
// columns, bilingual labels, refs of a linkable kind, and at least one edge
// (a chart with none is a list, not a genealogy). Pure file check, no DB.
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'data', 'commulingo', 'genealogy');
const EDGE_TYPES = new Set(['succession', 'split', 'merge', 'influence', 'opposition', 'end']);
const REF_TYPES = new Set(['term', 'person', 'event', 'doc']);

function bilingual(value, where) {
    assert.ok(value && typeof value === 'object', where + ' must be localized');
    assert.ok(String(value.ko || '').trim(), where + '.ko is empty');
    assert.ok(String(value.en || '').trim(), where + '.en is empty');
}

const files = fs.readdirSync(DIR).filter(name => name.endsWith('.json')).sort();
assert.ok(files.length, 'no genealogy charts found');
for (const name of files) {
    const chart = JSON.parse(fs.readFileSync(path.join(DIR, name), 'utf8'));
    const where = name;
    assert.strictEqual(chart.id + '.json', name, where + ': id must match the file name');
    bilingual(chart.title, where + '.title');
    bilingual(chart.description, where + '.description');
    assert.ok(Number.isFinite(chart.timeStart) && Number.isFinite(chart.timeEnd) && chart.timeEnd > chart.timeStart, where + ': timeStart/timeEnd');
    assert.ok(Array.isArray(chart.columns) && chart.columns.length, where + ': columns');
    const columns = new Set();
    chart.columns.forEach((col, i) => {
        assert.ok(col && typeof col.id === 'string' && !columns.has(col.id), where + '.columns[' + i + '] id missing or duplicate');
        columns.add(col.id);
        bilingual(col.label, where + '.columns[' + i + '].label');
    });
    assert.ok(Array.isArray(chart.nodes) && chart.nodes.length, where + ': nodes');
    const nodes = new Map();
    chart.nodes.forEach((node, i) => {
        const at = where + '.nodes[' + i + ']';
        assert.ok(node && typeof node.id === 'string' && node.id, at + ' id missing');
        assert.ok(!nodes.has(node.id), at + ' duplicate id ' + node.id);
        nodes.set(node.id, node);
        assert.ok(columns.has(node.column), at + ' (' + node.id + ') unknown column ' + node.column);
        assert.ok(Number.isInteger(node.year) && node.year >= chart.timeStart && node.year <= chart.timeEnd, at + ' (' + node.id + ') year out of range');
        bilingual(node.label, at + ' (' + node.id + ').label');
        if (node.note) bilingual(node.note, at + ' (' + node.id + ').note');
        assert.ok(node.ref && REF_TYPES.has(node.ref.type) && typeof node.ref.id === 'string' && node.ref.id, at + ' (' + node.id + ') ref must be {type: term|person|event|doc, id}');
    });
    assert.ok(Array.isArray(chart.edges), where + ': edges must be an array');
    assert.ok(chart.edges.length, where + ': a genealogy needs at least one edge');
    const seen = new Set();
    chart.edges.forEach((edge, i) => {
        const at = where + '.edges[' + i + ']';
        assert.ok(nodes.has(edge.from), at + ' unknown from ' + edge.from);
        assert.ok(nodes.has(edge.to), at + ' unknown to ' + edge.to);
        assert.notStrictEqual(edge.from, edge.to, at + ' self-loop ' + edge.from);
        assert.ok(EDGE_TYPES.has(edge.type), at + ' unknown type ' + edge.type);
        assert.ok(nodes.get(edge.from).year <= nodes.get(edge.to).year, at + ' runs backwards in time: ' + edge.from + ' -> ' + edge.to);
        const key = edge.from + '>' + edge.to + ':' + edge.type;
        assert.ok(!seen.has(key), at + ' duplicate edge ' + key);
        seen.add(key);
        if (edge.label) bilingual(edge.label, at + '.label');
    });
}
console.log('ok: ' + files.length + ' genealogy charts');
