const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const logic = require('../public/js/nonogram-logic');
const index = require('../public/puzzles/index.json');
const entries = index.series.flatMap(s => s.puzzles);
assert.equal(new Set(entries.map(e => e.id)).size, entries.length);
assert.equal(index.default, 'workers-hammer');
for (const entry of entries) {
    const puzzle = JSON.parse(fs.readFileSync(path.join(__dirname, '../public', entry.path)));
    assert.equal(puzzle.id, entry.id);
    assert.deepEqual(puzzle.size, entry.size);
    assert.ok(['beginner', 'intermediate', 'challenge'].includes(entry.difficulty));
    assert.equal(puzzle.solution.length, puzzle.size[0]);
    puzzle.solution.forEach(row => { assert.equal(row.length, puzzle.size[1]); row.forEach(v => assert.ok(v === 0 || v === 1)); });
    assert.deepEqual(puzzle.row_hints, puzzle.solution.map(logic.clues), entry.id + ' row clues');
    assert.deepEqual(puzzle.col_hints, puzzle.solution[0].map((_, c) => logic.clues(puzzle.solution.map(r => r[c]))), entry.id + ' column clues');
    assert.equal(logic.solutionCount(puzzle), 1, entry.id + ' must have exactly one solution');
    if (entry.id.startsWith('workers-')) {
        const result = logic.deduce(puzzle);
        assert.ok(result.solved, entry.id + ' must need no guesses');
        assert.deepEqual(result.cells.map(r => r.map(v => v === 1 ? 1 : 0)), puzzle.solution);
    }
    assert.ok(puzzle.questions.length >= 2);
    puzzle.questions.forEach(q => {
        assert.ok(typeof q.q === 'string' && q.q.length);
        assert.ok(q.a.length >= 2 && new Set(q.a).size === q.a.length);
        assert.ok(Number.isInteger(q.correct) && q.correct >= 0 && q.correct < q.a.length);
        assert.ok(q.explanation?.length > 0);
        if (q.source_url) assert.equal(new URL(q.source_url).protocol, 'https:');
    });
}
const ambiguous = { size: [2, 2], row_hints: [[1], [1]], col_hints: [[1], [1]] };
assert.equal(logic.solutionCount(ambiguous), 2, 'a second solution must be detected');
assert.equal(logic.deduce(ambiguous).steps.length, 0, 'hints must not guess');
assert.ok(logic.deduce(ambiguous, [[1, 1], [0, 0]]).conflict);
assert.equal(logic.solutionCount({ ...ambiguous, row_hints: [[2], [2]] }), 0, 'contradictory clues have no solution');
assert.deepEqual(logic.possibilities(5, [2, 1], [0, 0, 0, 0, 0]), [[1, 1, -1, 1, -1], [1, 1, -1, -1, 1], [-1, 1, 1, -1, 1]]);
console.log(`Nonogram: all ${entries.length} published puzzles have exactly one solution; six new puzzles solve by line deductions; content and contradictory/ambiguous cases passed.`);
