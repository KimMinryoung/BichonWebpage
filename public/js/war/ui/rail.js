/* The strategic map's railways as a network (war/ui/game.js): the way
   between two cities along the rails when there is one, and a chain of
   cities as one route. WarRail.create(points.lines), the lines in map
   units from services/war-map.js. */
(function (root) {
    'use strict';

    // The railway network in map units: a node at every station point the
    // lines share (junctions are the same [lat, lng] in each line).
    function create(lines) {
        const railNet = (() => {
            const nodes = new Map();
            const node = ([x, y]) => { const k = `${x},${y}`; if (!nodes.has(k)) nodes.set(k, { x, y, edges: [] }); return k; };
            for (const line of lines || []) {
                for (let i = 1; i < line.length; i++) {
                    const a = node(line[i - 1]), b = node(line[i]);
                    const d = Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]);
                    nodes.get(a).edges.push([b, d]);
                    nodes.get(b).edges.push([a, d]);
                }
            }
            return nodes;
        })();
        const legs = new Map();
        // The way from city a to city b: along the railway when there is one
        // not much longer than the straight line (Moscow to Saratov by Tambov),
        // else straight (Kazan to Simbirsk was by the Volga, not by rail).
        function railLeg(a, b) {
            const id = `${a.x},${a.y}>${b.x},${b.y}`;
            if (legs.has(id)) return legs.get(id);
            const nearest = p => { let best = null, bd = 14; for (const [k, n] of railNet) { const d = Math.hypot(n.x - p.x, n.y - p.y); if (d < bd) { bd = d; best = k; } } return best; };
            const from = nearest(a), to = nearest(b);
            let leg = [a, b];
            if (from && to && from !== to) {
                const dist = new Map([[from, 0]]), prev = new Map(), open = new Set([from]);
                while (open.size) {
                    let k = null;
                    for (const o of open) if (k === null || dist.get(o) < dist.get(k)) k = o;
                    open.delete(k);
                    if (k === to) break;
                    for (const [n, d] of railNet.get(k).edges) {
                        const nd = dist.get(k) + d;
                        if (!dist.has(n) || nd < dist.get(n)) { dist.set(n, nd); prev.set(n, k); open.add(n); }
                    }
                }
                if (dist.has(to) && dist.get(to) <= 1.6 * Math.hypot(b.x - a.x, b.y - a.y)) {
                    const path = [];
                    for (let k = to; k !== undefined; k = prev.get(k)) path.unshift(railNet.get(k));
                    leg = [a, ...path, b];
                }
            }
            legs.set(id, leg);
            return leg;
        }
        // A chain of cities as one route along its legs.
        const routeOf = list => list.slice(1).reduce((out, p, i) => out.concat(railLeg(list[i], p).slice(i ? 1 : 0)), list.length === 1 ? list : []);
        return { railLeg, routeOf };
    }

    root.WarRail = { create };
})(window);
