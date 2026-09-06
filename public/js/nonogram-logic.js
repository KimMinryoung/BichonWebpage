/* global module */
/* Pure line deductions, shared by hints and content validation. 0 unknown,
 * 1 filled, -1 empty. No solution bitmap is consulted by the hint engine. */
(function (root) {
    'use strict';
    function clues(line) {
        const out = []; let run = 0;
        for (const value of [...line, 0]) {
            if (value === 1) run++;
            else if (run) { out.push(run); run = 0; }
        }
        return out;
    }
    function possibilities(length, hints, known) {
        const out = [];
        function place(index, from, line) {
            if (index === hints.length) {
                const candidate = line.concat(Array(length - line.length).fill(-1));
                if (candidate.every((v, i) => !known[i] || known[i] === v)) out.push(candidate);
                return;
            }
            const remaining = hints.slice(index).reduce((a, b) => a + b, 0) + hints.length - index - 1;
            for (let start = from; start <= length - remaining; start++) {
                const next = line.concat(Array(start - line.length).fill(-1), Array(hints[index]).fill(1));
                if (index < hints.length - 1) next.push(-1);
                if (next.every((v, i) => !known[i] || known[i] === v)) place(index + 1, next.length, next);
            }
        }
        place(0, 0, []);
        return out;
    }
    function deduce(puzzle, input) {
        const [rows, cols] = puzzle.size;
        const cells = input ? input.map(r => r.slice()) : Array.from({ length: rows }, () => Array(cols).fill(0));
        const steps = []; let changed = true;
        while (changed) {
            changed = false;
            for (const axis of ['row', 'col']) {
                const count = axis === 'row' ? rows : cols;
                for (let line = 0; line < count; line++) {
                    const known = axis === 'row' ? cells[line] : cells.map(r => r[line]);
                    const options = possibilities(known.length, puzzle[axis + '_hints'][line], known);
                    if (!options.length) return { cells, steps, conflict: { axis, line }, solved: false };
                    for (let i = 0; i < known.length; i++) {
                        if (known[i] || !options.every(o => o[i] === options[0][i])) continue;
                        const row = axis === 'row' ? line : i, col = axis === 'col' ? line : i;
                        cells[row][col] = options[0][i];
                        steps.push({ row, col, value: options[0][i], axis, line, options: options.length });
                        changed = true;
                    }
                }
            }
        }
        return { cells, steps, conflict: null, solved: cells.every(r => r.every(Boolean)) };
    }
    function solutionCount(puzzle, limit = 2) {
        function search(input, budget) {
            const result = deduce(puzzle, input);
            if (result.conflict) return 0;
            if (result.solved) return 1;
            const row = result.cells.findIndex(r => r.includes(0)), col = result.cells[row].indexOf(0);
            let count = 0;
            for (const value of [1, -1]) {
                const next = result.cells.map(r => r.slice()); next[row][col] = value;
                count += search(next, budget - count);
                if (count >= budget) break;
            }
            return count;
        }
        return search(null, limit);
    }
    const api = { clues, possibilities, deduce, solutionCount };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    else root.NonogramLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
