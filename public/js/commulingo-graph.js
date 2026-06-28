(function() {
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var raw = document.getElementById('commulingo-graph');
    var root = document.getElementById('commuGraph');
    if (!raw || !root) return;

    var graph;
    try {
        graph = JSON.parse(raw.textContent);
    } catch (err) {
        return;
    }

    var en = lang === 'en';

    function text(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[lang] || value.ko || value.en || '';
    }

    function localizeList(value) {
        if (!value) return [];
        var list = Array.isArray(value) ? value : (value[lang] || value.ko || value.en);
        return Array.isArray(list) ? list : [];
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function render() {
        root.innerHTML = '';
        root.appendChild(renderCentral());
        root.appendChild(renderLegend());

        var chain = document.createElement('ol');
        chain.className = 'commu-graph-chain';
        (graph.nodes || []).forEach(function(node, index) {
            chain.appendChild(renderNode(node, index));
        });
        root.appendChild(chain);

        var myths = renderMisconceptions();
        if (myths) root.appendChild(myths);
    }

    function renderMisconceptions() {
        var mc = graph.misconceptions;
        if (!mc || !Array.isArray(mc.cards) || !mc.cards.length) return null;
        var sec = document.createElement('section');
        sec.className = 'commu-myths';
        sec.innerHTML = [
            '<h2 class="commu-myths-title">' + escapeHtml(text(mc.title) || (en ? 'Correcting common misreadings' : '흔한 오해 바로잡기')) + '</h2>',
            mc.hint ? '<p class="commu-myths-hint">' + escapeHtml(text(mc.hint)) + '</p>' : '',
            '<div class="commu-myth-grid"></div>'
        ].join('');
        var grid = sec.querySelector('.commu-myth-grid');
        mc.cards.forEach(function(card) { grid.appendChild(renderMythCard(card)); });
        return sec;
    }

    function renderMythCard(card) {
        var el = document.createElement('button');
        el.type = 'button';
        el.className = 'commu-myth-card';
        el.setAttribute('aria-expanded', 'false');
        el.innerHTML = [
            '<span class="commu-myth-tag">' + escapeHtml(en ? 'Common misreading' : '흔한 오해') + '</span>',
            '<p class="commu-myth-claim">“' + escapeHtml(text(card.claim)) + '”</p>',
            '<span class="commu-myth-verdict">' + escapeHtml(text(card.verdict)) + '</span>',
            '<div class="commu-myth-truth"><p>' + escapeHtml(text(card.truth)) + '</p></div>',
            '<span class="commu-myth-reveal">' + escapeHtml(en ? 'Tap to see the correction →' : '눌러서 정정 확인 →') + '</span>'
        ].join('');
        el.addEventListener('click', function() {
            var open = el.classList.toggle('is-revealed');
            el.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        return el;
    }

    function renderCentral() {
        var box = document.createElement('section');
        box.className = 'commu-graph-central box';
        box.innerHTML = [
            '<span class="commu-graph-kicker">' + escapeHtml(en ? 'Central question' : '핵심 질문') + '</span>',
            '<h2 class="commu-graph-question">' + escapeHtml(text(graph.question)) + '</h2>',
            graph.thesis ? '<p class="commu-graph-thesis">' + escapeHtml(text(graph.thesis)) + '</p>' : '',
            '<p class="commu-graph-hint">' + escapeHtml(strings.graphHint || (en
                ? 'Open each link of the chain below, one at a time.'
                : '아래 사슬의 고리를 하나씩 눌러 펼쳐 보세요.')) + '</p>'
        ].join('');
        return box;
    }

    var stageClass = { plain: 'is-plain', engels: 'is-engels', critique: 'is-critique' };

    function renderLegend() {
        var labels = localizeList(graph.legend);
        var legend = document.createElement('div');
        legend.className = 'commu-graph-legend';
        var kinds = ['plain', 'engels', 'critique'];
        legend.innerHTML = labels.map(function(label, i) {
            return '<span class="commu-graph-legend-item ' + (stageClass[kinds[i]] || '') + '">'
                + escapeHtml(label) + '</span>';
        }).join('');
        return legend;
    }

    function renderNode(node, index) {
        var li = document.createElement('li');
        li.className = 'commu-graph-node';

        var panelId = 'commu-node-' + (node.id || index);
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'commu-graph-node-head';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', panelId);
        button.innerHTML = [
            '<span class="commu-graph-node-index">' + (index + 1) + '</span>',
            '<span class="commu-graph-node-text">',
            '<strong>' + escapeHtml(text(node.label)) + '</strong>',
            node.summary ? '<small>' + escapeHtml(text(node.summary)) + '</small>' : '',
            '</span>',
            '<span class="commu-graph-node-toggle" aria-hidden="true">+</span>'
        ].join('');

        var panel = document.createElement('div');
        panel.className = 'commu-graph-stages';
        panel.id = panelId;
        panel.innerHTML = (node.stages || []).map(renderStage).join('');

        button.addEventListener('click', function() {
            var open = li.classList.toggle('is-open');
            button.setAttribute('aria-expanded', open ? 'true' : 'false');
            button.querySelector('.commu-graph-node-toggle').textContent = open ? '−' : '+';
        });

        li.appendChild(button);
        li.appendChild(panel);
        return li;
    }

    function renderStage(stage) {
        return [
            '<div class="commu-graph-stage ' + (stageClass[stage.kind] || '') + '">',
            '<span class="commu-graph-stage-label">' + escapeHtml(text(stage.label)) + '</span>',
            '<p>' + escapeHtml(text(stage.text)) + '</p>',
            '</div>'
        ].join('');
    }

    render();
})();
