// Genealogy chart page (/commulingo/genealogy/<id>): selecting a node.
//
// The svg is drawn server side (data/commulingo/genealogy-svg.js) and every
// node is an ordinary link to its dictionary entry, so without JavaScript the
// chart still works as a map of links. With it, a click selects the node
// instead: its lineage lights up and the rest of the chart dims, and a panel
// pinned to the bottom of the figure shows the node's note (otherwise only a
// hover tooltip, which a phone never shows), the link to its entry, and its
// direct connections as rows that select the node at the other end.
//
// The lineage is what came before and after the node along succession, split
// and merger lines, followed all the way up and down. Influence, antagonism
// and suppression lines are not lines of descent, so only the node's own such
// lines and their far ends light up.
//
// The selection lives in the address (#<node id>): an entry page's 계보도 link
// opens the chart with that node selected, and a reload keeps it.
(function () {
    'use strict';
    var svg = document.querySelector('.gen-svg');
    var panel = document.getElementById('gen-panel');
    var dataEl = document.getElementById('gen-data');
    if (!svg || !panel || !dataEl) return;
    var data;
    try { data = JSON.parse(dataEl.textContent); } catch (err) { return; }

    var FLOW = { succession: true, split: true, merge: true };
    var nodes = {};
    data.nodes.forEach(function (node) { nodes[node.id] = node; });
    var incoming = {};
    var outgoing = {};
    data.edges.forEach(function (edge) {
        (outgoing[edge.from] = outgoing[edge.from] || []).push(edge);
        (incoming[edge.to] = incoming[edge.to] || []).push(edge);
    });

    var nodeEls = {};
    Array.prototype.forEach.call(svg.querySelectorAll('.gen-node[data-node]'), function (el) {
        nodeEls[el.getAttribute('data-node')] = el;
    });
    var edgeEls = Array.prototype.slice.call(svg.querySelectorAll('[data-from][data-to]'));

    var meta = panel.querySelector('.gen-panel-meta');
    var title = panel.querySelector('.gen-panel-title');
    var note = panel.querySelector('.gen-panel-note');
    var entry = panel.querySelector('.gen-panel-entry');
    var groups = {
        from: panel.querySelector('.gen-panel-group[data-dir="from"]'),
        to: panel.querySelector('.gen-panel-group[data-dir="to"]'),
    };
    var selected = null;

    function edgeKey(from, to) { return from + '\u0000' + to; }

    // Walk flow lines in one direction from the node, collecting the nodes
    // reached and the lines walked.
    function walk(start, edgesOf, nextOf, onNodes, onEdges) {
        var queue = [start];
        while (queue.length) {
            var id = queue.shift();
            (edgesOf[id] || []).forEach(function (edge) {
                if (!FLOW[edge.type]) return;
                onEdges[edgeKey(edge.from, edge.to)] = true;
                var next = nextOf(edge);
                if (!onNodes[next]) {
                    onNodes[next] = true;
                    queue.push(next);
                }
            });
        }
    }

    function highlight(id) {
        var onNodes = {};
        var onEdges = {};
        onNodes[id] = true;
        walk(id, incoming, function (edge) { return edge.from; }, onNodes, onEdges);
        walk(id, outgoing, function (edge) { return edge.to; }, onNodes, onEdges);
        (incoming[id] || []).concat(outgoing[id] || []).forEach(function (edge) {
            if (FLOW[edge.type]) return;
            onEdges[edgeKey(edge.from, edge.to)] = true;
            onNodes[edge.from] = true;
            onNodes[edge.to] = true;
        });
        svg.classList.add('has-selection');
        Object.keys(nodeEls).forEach(function (key) {
            nodeEls[key].classList.toggle('is-on', !!onNodes[key]);
            nodeEls[key].classList.toggle('is-selected', key === id);
        });
        edgeEls.forEach(function (el) {
            var on = !!onEdges[edgeKey(el.getAttribute('data-from'), el.getAttribute('data-to'))];
            el.classList.toggle('is-on', on);
        });
    }

    function clearHighlight() {
        svg.classList.remove('has-selection');
        Object.keys(nodeEls).forEach(function (key) {
            nodeEls[key].classList.remove('is-on', 'is-selected');
        });
        edgeEls.forEach(function (el) { el.classList.remove('is-on'); });
    }

    function row(edge, otherId) {
        var other = nodes[otherId];
        var li = document.createElement('li');
        var button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('data-node', otherId);
        var rel = document.createElement('span');
        rel.className = 'gen-panel-rel';
        rel.textContent = edge.label || data.text.rel[edge.type] || '';
        var name = document.createElement('strong');
        name.textContent = other.label;
        var period = document.createElement('span');
        period.className = 'gen-panel-period';
        period.textContent = other.period;
        button.appendChild(rel);
        button.appendChild(name);
        button.appendChild(period);
        li.appendChild(button);
        return li;
    }

    function fillGroup(group, edges, otherOf) {
        var list = group.querySelector('ul');
        list.textContent = '';
        edges.forEach(function (edge) {
            var otherId = otherOf(edge);
            if (nodes[otherId]) list.appendChild(row(edge, otherId));
        });
        group.hidden = !list.children.length;
    }

    function fillPanel(node) {
        meta.textContent = node.column + ' · ' + node.period;
        title.textContent = node.label;
        note.textContent = node.note;
        note.hidden = !node.note;
        if (node.href) {
            entry.href = node.href;
            entry.textContent = (data.text.open[node.refType] || data.text.open.term) + ' →';
            entry.hidden = false;
        } else {
            entry.hidden = true;
        }
        fillGroup(groups.from, incoming[node.id] || [], function (edge) { return edge.from; });
        fillGroup(groups.to, outgoing[node.id] || [], function (edge) { return edge.to; });
        panel.hidden = false;
    }

    function setHash(id) {
        var url = location.pathname + location.search + (id ? '#' + encodeURIComponent(id) : '');
        try { history.replaceState(null, '', url); } catch (err) { /* sandboxed frames */ }
    }

    function reveal(id) {
        var el = nodeEls[id];
        if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    }

    function select(id, options) {
        var node = nodes[id];
        if (!node) return;
        selected = id;
        highlight(id);
        fillPanel(node);
        setHash(id);
        if (options && options.reveal) reveal(id);
    }

    function clear() {
        if (!selected) return;
        selected = null;
        clearHighlight();
        panel.hidden = true;
        setHash('');
    }

    // A plain click selects; a modified click (new tab, new window) still
    // follows the node's link.
    svg.addEventListener('click', function (event) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        var nodeEl = event.target.closest('.gen-node[data-node]');
        if (!nodeEl) {
            clear();
            return;
        }
        event.preventDefault();
        select(nodeEl.getAttribute('data-node'));
    });

    panel.addEventListener('click', function (event) {
        var button = event.target.closest('button');
        if (!button) return;
        if (button.classList.contains('gen-panel-close')) {
            clear();
            return;
        }
        var id = button.getAttribute('data-node');
        if (id) select(id, { reveal: true });
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') clear();
    });

    function fromHash() {
        var id = '';
        try { id = decodeURIComponent(location.hash.slice(1)); } catch (err) { id = ''; }
        if (id && nodes[id]) select(id, { reveal: true });
        else if (!id) clear();
    }
    window.addEventListener('hashchange', fromHash);
    fromHash();

    // The pinned header row sits under the CommuLingo crumb bar, which is
    // itself pinned to the top of the window.
    var cols = document.querySelector('.gen-cols');
    var crumb = document.querySelector('.commu-crumb');
    function placeHeader() {
        if (cols && crumb) cols.style.top = crumb.getBoundingClientRect().height + 'px';
    }
    placeHeader();
    window.addEventListener('resize', placeHeader);
})();
