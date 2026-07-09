(function() {
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var raw = document.getElementById('commulingo-decision');
    var root = document.getElementById('commuDecision');
    if (!raw || !root) return;

    var data;
    try {
        data = JSON.parse(raw.textContent);
    } catch (err) {
        return;
    }

    var timeline = data.timeline || {};
    var bookId = data.bookId || 'book';
    var storageKey = 'commulingo-decision-' + bookId;
    var en = lang === 'en';
    var choices = loadChoices();

    var L = {
        role: en ? 'Your role' : '당신의 역할',
        decide: en ? 'Decide first — the reveal comes after.' : '먼저 결정하세요 — 결과는 그다음에 열립니다.',
        yourChoice: en ? 'Your choice' : '당신의 선택',
        actual: en ? 'What history did' : '실제 역사',
        outcome: en ? 'What actually happened' : '실제로 일어난 일',
        ripple: en ? 'The ripple' : '파장',
        insight: en ? 'The historians’ eye' : '역사가의 눈',
        redo: en ? 'Decide again' : '다시 선택하기',
        progress: en ? 'forks decided' : '갈림길 결정',
        matched: en ? 'You chose the road history took.' : '실제 역사와 같은 길을 골랐습니다.',
        diverged: en ? 'History took a different road here.' : '여기서 역사는 다른 길을 갔습니다.',
        noScore: en ? 'This scene keeps no score.' : '이 장면에는 점수가 없습니다.',
        remains: en ? 'So what remains? →' : '그래서 무엇이 남는가? →',
        fold: en ? 'Hide' : '접기',
        undecided: en ? 'Undecided' : '미결정',
    };

    function text(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[lang] || value.ko || value.en || '';
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // Person-name auto-linking. `data.people` = [{id, name, epithet, aliases}]
    // for the current language. BLOCKED lists compounds that contain an alias
    // but must not link (Hangul has no \b word boundary, so 레닌 would otherwise
    // match inside 레닌그라드); they join the alternation so the regex consumes
    // them first, and the replacer passes them through untouched.
    var BLOCKED = ['레닌그라드', '스탈린그라드', '레닌주의', '스탈린주의'];
    var personByAlias = {};
    var aliasTokens = [];
    (data.people || []).forEach(function(person) {
        (person.aliases || []).forEach(function(alias) {
            if (!alias || personByAlias[alias]) return;
            personByAlias[alias] = person;
            aliasTokens.push(alias);
        });
    });
    var linkPattern = null;
    if (aliasTokens.length) {
        var tokens = BLOCKED.concat(aliasTokens).sort(function(a, b) { return b.length - a.length; });
        var alternation = tokens.map(function(token) {
            return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }).join('|');
        linkPattern = new RegExp(en ? '\\b(' + alternation + ')\\b' : '(' + alternation + ')', 'g');
    }

    // escape + linkify: use for narrative prose only, never inside <button>.
    function rich(value) {
        var escaped = escapeHtml(text(value));
        if (!linkPattern) return escaped;
        return escaped.replace(linkPattern, function(match) {
            var person = personByAlias[match];
            if (!person) return match;
            return '<a class="commu-person-link" href="/commulingo/people#p-' + person.id
                + '" title="' + escapeHtml(person.name + ' — ' + person.epithet) + '">' + match + '</a>';
        });
    }

    function loadChoices() {
        try {
            var parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (err) {
            return {};
        }
    }

    function saveChoices() {
        try { localStorage.setItem(storageKey, JSON.stringify(choices)); } catch (err) {}
    }

    function allEpisodes() {
        var list = [];
        (timeline.eras || []).forEach(function(era) {
            (era.episodes || []).forEach(function(ep) { list.push(ep); });
        });
        return list;
    }

    var episodes = allEpisodes();
    var epNodes = {};

    function setOpen(li, open) {
        li.classList.toggle('is-open', open);
        var head = li.querySelector('.commu-dc-head');
        if (head) {
            head.setAttribute('aria-expanded', open ? 'true' : 'false');
            var toggle = head.querySelector('.commu-dc-toggle');
            if (toggle) toggle.textContent = open ? '−' : '+';
        }
    }

    // Opens the first undecided episode at (or after) the given index, so the
    // learner always has the next fork in front of them.
    function openNextUndecided(fromIndex) {
        for (var i = fromIndex; i < episodes.length; i++) {
            var ep = episodes[i];
            if (choices[ep.id]) continue;
            var li = epNodes[ep.id];
            if (li) setOpen(li, true);
            return;
        }
    }

    function episodeIndex(id) {
        for (var i = 0; i < episodes.length; i++) {
            if (episodes[i].id === id) return i;
        }
        return -1;
    }

    function decidedCount() {
        return episodes.filter(function(ep) { return choices[ep.id]; }).length;
    }

    function stanceById(id) {
        var found = (timeline.stances || []).filter(function(s) { return s.id === id; })[0];
        return found || null;
    }

    function render() {
        epNodes = {};
        root.innerHTML = '';
        root.appendChild(renderCentral());
        (timeline.eras || []).forEach(function(era) {
            root.appendChild(renderEra(era));
        });
        root.appendChild(renderVerdict());
        var epi = renderEpilogue();
        if (epi) root.appendChild(epi);
        updateProgress();
        openNextUndecided(0);
        openHashEpisode();
    }

    // Deep links from the people page ("등장 장면" chips) arrive as
    // /commulingo/book/<id>#<episodeId> — open that scene and scroll to it once.
    var hashHandled = false;
    function openHashEpisode() {
        if (hashHandled) return;
        var hash = window.location.hash ? window.location.hash.slice(1) : '';
        if (!hash || !epNodes[hash]) return;
        hashHandled = true;
        setOpen(epNodes[hash], true);
        epNodes[hash].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderCentral() {
        var box = document.createElement('section');
        box.className = 'commu-graph-central box';
        var legend = (timeline.stances || []).map(function(s) {
            return '<span class="commu-dc-stance is-' + escapeHtml(s.id) + '" title="' + escapeHtml(text(s.desc)) + '">'
                + escapeHtml(text(s.label)) + '</span>';
        }).join('');
        box.innerHTML = [
            '<span class="commu-graph-kicker">' + escapeHtml(en ? 'Central question' : '핵심 질문') + '</span>',
            '<h2 class="commu-graph-question">' + escapeHtml(text(timeline.question)) + '</h2>',
            timeline.thesis ? '<p class="commu-graph-thesis">' + rich(timeline.thesis) + '</p>' : '',
            timeline.howTo ? '<p class="commu-graph-hint">' + escapeHtml(text(timeline.howTo)) + '</p>' : '',
            '<div class="commu-dc-legend">' + legend + '</div>',
            '<div class="commu-dc-progress"><span id="commuDcProgressText"></span>',
            '<span class="commu-dc-progress-track"><span id="commuDcProgressFill"></span></span></div>'
        ].join('');
        return box;
    }

    function updateProgress() {
        var done = decidedCount();
        var total = episodes.length;
        var textEl = document.getElementById('commuDcProgressText');
        var fillEl = document.getElementById('commuDcProgressFill');
        if (textEl) textEl.textContent = done + ' / ' + total + ' ' + L.progress;
        if (fillEl) fillEl.style.width = Math.round((done / (total || 1)) * 100) + '%';
    }

    function renderEra(era) {
        var section = document.createElement('section');
        section.className = 'commu-dc-era';
        section.innerHTML = [
            '<header class="commu-dc-era-head">',
            '<span class="commu-dc-era-range">' + escapeHtml(text(era.range)) + '</span>',
            '<h2>' + escapeHtml(text(era.title)) + '</h2>',
            era.intro ? '<p>' + rich(era.intro) + '</p>' : '',
            '</header>'
        ].join('');
        var list = document.createElement('ol');
        list.className = 'commu-dc-list';
        (era.episodes || []).forEach(function(ep) {
            list.appendChild(renderEpisode(ep));
        });
        section.appendChild(list);
        return section;
    }

    function renderEpisode(ep) {
        var li = document.createElement('li');
        li.className = 'commu-dc-episode';
        li.setAttribute('data-episode', ep.id);

        var head = document.createElement('button');
        head.type = 'button';
        head.className = 'commu-dc-head';
        head.setAttribute('aria-expanded', 'false');

        var body = document.createElement('div');
        body.className = 'commu-dc-body';

        head.addEventListener('click', function() {
            var open = li.classList.toggle('is-open');
            head.setAttribute('aria-expanded', open ? 'true' : 'false');
            var toggle = head.querySelector('.commu-dc-toggle');
            if (toggle) toggle.textContent = open ? '−' : '+';
        });

        li.appendChild(head);
        li.appendChild(body);
        epNodes[ep.id] = li;
        paintEpisode(li, ep);
        return li;
    }

    function paintEpisode(li, ep) {
        var chosenId = choices[ep.id];
        var head = li.querySelector('.commu-dc-head');
        var body = li.querySelector('.commu-dc-body');
        li.classList.toggle('is-decided', Boolean(chosenId));

        var status;
        if (!chosenId) status = '<span class="commu-dc-status">' + escapeHtml(L.undecided) + '</span>';
        else if (chosenId === ep.actualId) status = '<span class="commu-dc-status is-match">●</span>';
        else status = '<span class="commu-dc-status is-diverge">●</span>';

        head.innerHTML = [
            '<span class="commu-dc-date">' + escapeHtml(text(ep.date)) + '</span>',
            '<span class="commu-dc-title"><strong>' + escapeHtml(text(ep.title)) + '</strong></span>',
            status,
            '<span class="commu-dc-toggle" aria-hidden="true">' + (li.classList.contains('is-open') ? '−' : '+') + '</span>'
        ].join('');

        var parts = [
            '<p class="commu-dc-role"><span>' + escapeHtml(L.role) + '</span> ' + rich(ep.role) + '</p>',
            '<p class="commu-dc-briefing">' + rich(ep.briefing) + '</p>',
            '<p class="commu-dc-question">' + escapeHtml(text(ep.question)) + '</p>'
        ];

        if (!chosenId) {
            parts.push('<p class="commu-dc-hint">' + escapeHtml(L.decide) + '</p>');
            parts.push('<div class="commu-dc-options">' + (ep.options || []).map(function(opt) {
                return '<button type="button" class="commu-dc-option" data-option="' + escapeHtml(opt.id) + '">'
                    + '<span class="commu-dc-option-label">' + escapeHtml(text(opt.label)) + '</span>'
                    + '</button>';
            }).join('') + '</div>');
        } else {
            parts.push('<div class="commu-dc-options is-revealed">' + (ep.options || []).map(function(opt) {
                var chips = '';
                if (opt.id === chosenId) chips += '<span class="commu-dc-chip is-chosen">' + escapeHtml(L.yourChoice) + '</span>';
                if (opt.id === ep.actualId) chips += '<span class="commu-dc-chip is-actual">' + escapeHtml(L.actual) + '</span>';
                var cls = 'commu-dc-option is-done';
                if (opt.id === chosenId) cls += ' is-chosen';
                if (opt.id === ep.actualId) cls += ' is-actual';
                if (opt.stance) cls += ' stance-' + opt.stance;
                return '<div class="' + cls + '">'
                    + '<span class="commu-dc-option-label">' + escapeHtml(text(opt.label)) + (chips ? '<span class="commu-dc-chips">' + chips + '</span>' : '') + '</span>'
                    + (opt.note ? '<p class="commu-dc-option-note">' + rich(opt.note) + '</p>' : '')
                    + '</div>';
            }).join('') + '</div>');

            var matchLine;
            var scored = (ep.options || []).some(function(opt) { return opt.stance; });
            if (!scored) matchLine = L.noScore;
            else matchLine = chosenId === ep.actualId ? L.matched : L.diverged;
            parts.push('<p class="commu-dc-matchline ' + (chosenId === ep.actualId && scored ? 'is-match' : '') + '">' + escapeHtml(matchLine) + '</p>');

            parts.push('<div class="commu-dc-block is-outcome"><span class="commu-dc-block-label">' + escapeHtml(L.outcome) + '</span><p>' + rich(ep.outcome) + '</p></div>');
            if (ep.ripple) parts.push('<div class="commu-dc-block is-ripple"><span class="commu-dc-block-label">→ ' + escapeHtml(L.ripple) + '</span><p>' + rich(ep.ripple) + '</p></div>');
            if (ep.insight) parts.push('<div class="commu-dc-block is-insight"><span class="commu-dc-block-label">' + escapeHtml(L.insight) + '</span><p>' + rich(ep.insight) + '</p></div>');
            parts.push('<button type="button" class="commu-dc-redo">' + escapeHtml(L.redo) + '</button>');
        }

        body.innerHTML = parts.join('');

        if (!chosenId) {
            body.querySelectorAll('.commu-dc-option').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    choices[ep.id] = btn.getAttribute('data-option');
                    saveChoices();
                    paintEpisode(li, ep);
                    refreshVerdict();
                    updateProgress();
                    openNextUndecided(episodeIndex(ep.id) + 1);
                });
            });
        } else {
            var redo = body.querySelector('.commu-dc-redo');
            if (redo) redo.addEventListener('click', function() {
                delete choices[ep.id];
                saveChoices();
                paintEpisode(li, ep);
                refreshVerdict();
                updateProgress();
            });
        }
    }

    function tally() {
        var counts = { radical: 0, cautious: 0, reform: 0 };
        var scoredTotal = 0;
        var matches = 0;
        episodes.forEach(function(ep) {
            var chosenId = choices[ep.id];
            if (!chosenId) return;
            if (chosenId === ep.actualId) matches += 1;
            var opt = (ep.options || []).filter(function(item) { return item.id === chosenId; })[0];
            if (opt && opt.stance && counts.hasOwnProperty(opt.stance)) {
                counts[opt.stance] += 1;
                scoredTotal += 1;
            }
        });
        return { counts: counts, scoredTotal: scoredTotal, matches: matches };
    }

    function renderVerdict() {
        var section = document.createElement('section');
        section.className = 'commu-dc-verdict box';
        section.id = 'commuDcVerdict';
        paintVerdict(section);
        return section;
    }

    function refreshVerdict() {
        var section = document.getElementById('commuDcVerdict');
        if (section) paintVerdict(section);
    }

    function paintVerdict(section) {
        var verdict = timeline.verdict || {};
        var done = decidedCount();
        var total = episodes.length;

        if (done < total) {
            section.innerHTML = [
                '<h2 class="commu-section-title">' + escapeHtml(text(verdict.title)) + '</h2>',
                '<p class="commu-section-hint">' + escapeHtml(text(verdict.lockedHint)) + ' (' + done + ' / ' + total + ')</p>'
            ].join('');
            return;
        }

        var result = tally();
        var dominant = 'radical';
        ['cautious', 'reform'].forEach(function(id) {
            if (result.counts[id] > result.counts[dominant]) dominant = id;
        });

        var bars = (timeline.stances || []).map(function(s) {
            var count = result.counts[s.id] || 0;
            var pct = Math.round((count / (result.scoredTotal || 1)) * 100);
            return [
                '<div class="commu-dc-bar-row">',
                '<span class="commu-dc-bar-label is-' + escapeHtml(s.id) + '">' + escapeHtml(text(s.label)) + '</span>',
                '<span class="commu-dc-bar-track"><span class="commu-dc-bar-fill is-' + escapeHtml(s.id) + '" style="width:' + pct + '%"></span></span>',
                '<span class="commu-dc-bar-count">' + count + '</span>',
                '</div>'
            ].join('');
        }).join('');

        var profile = verdict.profiles ? verdict.profiles[dominant] : null;

        section.innerHTML = [
            '<h2 class="commu-section-title">' + escapeHtml(text(verdict.title)) + '</h2>',
            '<div class="commu-dc-bars">' + bars + '</div>',
            profile ? '<p class="commu-dc-profile">' + escapeHtml(text(profile)) + '</p>' : '',
            '<p class="commu-dc-match">' + escapeHtml(text(verdict.matchLabel)) + ': <strong>' + result.matches + ' / ' + total + '</strong></p>',
            verdict.matchNote ? '<p class="commu-dc-match-note">' + escapeHtml(text(verdict.matchNote)) + '</p>' : '',
            '<button type="button" class="commu-dc-reset">' + escapeHtml(text(verdict.resetLabel) || L.redo) + '</button>'
        ].join('');

        var reset = section.querySelector('.commu-dc-reset');
        if (reset) reset.addEventListener('click', function() {
            choices = {};
            saveChoices();
            render();
        });
    }

    function renderEpilogue() {
        var epi = timeline.epilogue;
        if (!epi || !Array.isArray(epi.rounds) || !epi.rounds.length) return null;
        var section = document.createElement('section');
        section.className = 'commu-debates';
        section.innerHTML = [
            '<h2 class="commu-section-title">' + escapeHtml(text(epi.title)) + '</h2>',
            epi.hint ? '<p class="commu-section-hint">' + escapeHtml(text(epi.hint)) + '</p>' : '',
            '<div class="commu-debate-list"></div>'
        ].join('');
        var list = section.querySelector('.commu-debate-list');
        epi.rounds.forEach(function(round) { list.appendChild(renderRound(round)); });
        return section;
    }

    function renderRound(round) {
        var card = document.createElement('div');
        card.className = 'commu-debate-card';
        card.innerHTML = [
            '<span class="commu-debate-topic">' + escapeHtml((en ? 'Dispute · ' : '쟁점 · ') + text(round.topic)) + '</span>',
            '<div class="commu-debate-line is-engels"><span class="commu-debate-who">' + escapeHtml(text(round.sideALabel)) + '</span><p>' + escapeHtml(text(round.sideA)) + '</p></div>',
            '<div class="commu-debate-line is-critic"><span class="commu-debate-who">' + escapeHtml(text(round.sideBLabel)) + '</span><p>' + escapeHtml(text(round.sideB)) + '</p></div>',
            '<button type="button" class="commu-debate-toggle" aria-expanded="false">' + escapeHtml(L.remains) + '</button>',
            '<div class="commu-debate-takeaway"><p>' + escapeHtml(text(round.takeaway)) + '</p></div>'
        ].join('');
        var btn = card.querySelector('.commu-debate-toggle');
        btn.addEventListener('click', function() {
            var open = card.classList.toggle('is-revealed');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            btn.textContent = open ? L.fold : L.remains;
        });
        return card;
    }

    render();
})();
