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
    // Titles of the documents and events episodes cite, sent by the server so
    // the page only renders what the course data names.
    var refs = data.refs || { docs: {}, events: {} };
    var bookId = data.bookId || 'book';
    var storageKey = 'commulingo-decision-' + bookId;
    var en = lang === 'en';
    var choices = loadChoices();

    var L = {
        role: en ? 'Your role' : '당신의 역할',
        yourChoice: en ? 'Your choice' : '당신의 선택',
        actual: en ? 'What history did' : '실제 역사',
        outcome: en ? 'What actually happened' : '실제로 일어난 일',
        ripple: en ? 'The ripple' : '파장',
        insight: en ? 'The historians’ eye' : '역사가의 눈',
        redo: en ? 'Decide again' : '다시 선택하기',
        progress: en ? 'forks decided' : '갈림길 결정',
        matched: en ? 'You chose the road history took.' : '실제 역사와 같은 길을 골랐습니다.',
        diverged: en ? 'History took a different road here.' : '여기서 역사는 다른 길을 갔습니다.',
        remains: en ? 'So what remains? →' : '그래서 무엇이 남는가? →',
        fold: en ? 'Hide' : '접기',
        undecided: en ? 'Undecided' : '미결정',
        sources: en ? 'Read the sources' : '읽을 문헌',
        events: en ? 'Connected events' : '연결 사건',
        basis: en ? 'based on {n} of {total} forks' : '갈림길 {total}개 중 {n}개 기준',
        byPart: en ? 'By part' : '부별',
        julian: en ? 'O.S.' : '구력',
        note: en ? 'Commentary' : '해설',
        map: en ? 'Map of the forks' : '갈림길 노선도',
        mapMatch: en ? 'History’s road' : '실제 역사와 같은 길',
        mapDiverge: en ? 'A different road' : '다른 길',
        mapOpen: en ? 'Undecided' : '미결정',
        prev: en ? 'Previous' : '이전',
        next: en ? 'Next fork' : '다음 갈림길',
    };

    // date: { start: [y, m?, d?], end?: [y, m?, d?], calendar?: 'julian' }.
    // The label is composed here so dates stay data, not prose.
    var MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    function dateLabel(date) {
        if (!date || !Array.isArray(date.start)) return text(date);
        var a = date.start, b = Array.isArray(date.end) ? date.end : null;
        var label;
        if (en) {
            var one = function(d, withYear) {
                var parts = [];
                if (d[1]) parts.push(MONTHS_EN[d[1] - 1] + (d[2] ? ' ' + d[2] : ''));
                if (withYear) parts.push(String(d[0]));
                return parts.join(d[2] ? ', ' : ' ');
            };
            if (!b) label = one(a, true);
            else if (a[0] !== b[0]) label = (a[1] ? one(a, true) : a[0]) + '–' + (b[1] ? one(b, true) : b[0]);
            else if (a[1] && a[1] === b[1] && a[2] && b[2]) label = MONTHS_EN[a[1] - 1] + ' ' + a[2] + '–' + b[2] + ', ' + a[0];
            else label = one(a, false) + '–' + one(b, false) + (b[2] ? ', ' : ' ') + a[0];
        } else {
            var md = function(d) { return (d[1] ? d[1] + '월' : '') + (d[2] ? ' ' + d[2] + '일' : ''); };
            if (!b) label = a[0] + '년' + (a[1] ? ' ' + md(a) : '');
            else if (a[0] !== b[0]) label = a[1] ? a[0] + '년 ' + md(a) + '~' + b[0] + '년 ' + md(b) : a[0] + '~' + b[0] + '년';
            else if (a[1] && a[1] === b[1] && a[2] && b[2]) label = a[0] + '년 ' + a[1] + '월 ' + a[2] + '~' + b[2] + '일';
            else label = a[0] + '년 ' + md(a) + '~' + md(b);
        }
        return date.calendar === 'julian' ? label + ' (' + L.julian + ')' : label;
    }

    function yearsLabel(years) {
        if (!Array.isArray(years)) return text(years);
        return years[1] && years[1] !== years[0] ? years[0] + (en ? '–' : '~') + years[1] : String(years[0]);
    }

    function fill(template, values) {
        return template.replace(/\{(\w+)\}/g, function(_, k) { return values[k] == null ? '' : String(values[k]); });
    }

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

    // Person-name auto-linking. This page renders its episodes in the browser,
    // so it cannot call the shared linker (data/commulingo/linkify.js) — the
    // server ships it that linker's index instead. `data.people` =
    // [{id, name, epithet, aliases}] whose aliases already went through
    // buildPersonLinkIndex (bare words two people share are dropped there), and
    // `data.blocked` = the Korean compounds that contain an alias but must not
    // link (Hangul has no \b word boundary, so 레닌 would otherwise match inside
    // 레닌그라드); they join the alternation so the regex consumes them first and
    // the replacer passes them through untouched. Nothing below is a rule of its
    // own — the rules live server-side and this only applies them.
    var namePolicy = window.CommuLingoNameContext;
    var nameContextData = namePolicy && namePolicy.compile(data.contextData);
    var BLOCKED = data.blocked || [];
    var personByAlias = {};
    var aliasTokens = [];
    var personById = {};
    (data.people || []).forEach(function(person) {
        personById[person.id] = person;
        (person.aliases || []).forEach(function(alias) {
            if (!alias || personByAlias[alias]) return;
            personByAlias[alias] = person;
            aliasTokens.push(alias);
        });
    });
    var linkPattern = null;
    if (aliasTokens.length) {
        var tokens = BLOCKED.concat(aliasTokens, Object.keys(data.contextData && data.contextData.shorts || {})).sort(function(a, b) { return b.length - a.length; });
        var alternation = tokens.map(function(token) {
            return token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }).join('|');
        linkPattern = new RegExp(en ? '\\b(' + alternation + ')\\b' : '(' + alternation + ')', 'g');
    }

    // escape + linkify: use for narrative prose only, never inside <button>.
    // One passage, one seen-set: the first mention links and later ones stay
    // plain, and the link opens in a new tab — the same two rules the served
    // learning content follows, because leaving this page loses the reader's
    // place in the episode.
    function rich(value) {
        var escaped = escapeHtml(text(value));
        if (!linkPattern) return escaped;
        var seen = {};
        var context = nameContextData && namePolicy.analyze(escaped, nameContextData);
        return escaped.replace(linkPattern, function(match, _token, offset, source) {
            if (!en) {
                var prev = offset > 0 ? source.charAt(offset - 1) : '';
                if (/[0-9A-Za-z가-힣]/.test(prev)) return match;
            }
            var person = personByAlias[match];
            var expression = person && data.expressions && data.expressions[person.id + ':' + match];
            if (context) {
                var id = namePolicy.resolve(match, person && person.id, offset, source, nameContextData, context, expression && expression.policy);
                person = id && personById[id];
                expression = person && data.expressions && data.expressions[person.id + ':' + match];
            }
            if (expression && expression.policy === 'search') return match;
            if (!person || seen[person.id]) return match;
            seen[person.id] = true;
            return '<a class="commu-person-link" target="_blank" rel="noopener"'
                + ' href="/commulingo/people/' + encodeURIComponent(person.id)
                + '" title="' + escapeHtml(person.name + ': ' + person.epithet) + '">' + match + '</a>';
        });
    }

    // Prose with blank-line paragraph breaks: one link pass over the whole
    // passage (first mention links), then one <p> per paragraph.
    function paras(value) {
        return rich(value).split(/\n\s*\n/).map(function(part) { return '<p>' + part + '</p>'; }).join('');
    }

    // options[].actors: [{personId} | {label}] — the people (and groups) the
    // episode puts behind an option. refs.actors carries each person's short
    // name, position colour and icon; a group is a plain chip.
    function actorChips(opt) {
        var chips = (opt.actors || []).map(function(actor) {
            var person = actor.personId && refs.actors && refs.actors[actor.personId];
            if (person) {
                return '<span class="commu-dc-actor' + (person.position ? ' pos-' + escapeHtml(person.position) : '') + '">'
                    + (person.iconSvg || '') + escapeHtml(person.name) + '</span>';
            }
            return actor.label ? '<span class="commu-dc-actor is-group">' + escapeHtml(text(actor.label)) + '</span>' : '';
        }).join('');
        return chips ? '<span class="commu-dc-actors">' + chips + '</span>' : '';
    }

    var MARK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">';
    var MARK_CHOSEN = '<span class="commu-dc-mark is-chosen" title="' + escapeHtml(L.yourChoice) + '">' + MARK_SVG + '<path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';
    var MARK_ACTUAL = '<span class="commu-dc-mark is-actual" title="' + escapeHtml(L.actual) + '">' + MARK_SVG.replace('2.4', '2') + '<path d="M3 21h18"/><path d="M5 21V10"/><path d="M19 21V10"/><path d="M12 3 3 8h18l-9-5Z"/><path d="M9 21V10"/><path d="M15 21V10"/></svg></span>';

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
    // One fork at a time: the stage holds the current episode; the route map
    // above picks any fork and the step bar below moves back and forth.
    var current = 0;
    var stage = null;

    function eraOf(ep) {
        return (timeline.eras || []).filter(function(era) { return (era.episodes || []).indexOf(ep) >= 0; })[0] || {};
    }

    function firstUndecided() {
        for (var i = 0; i < episodes.length; i++) if (!choices[episodes[i].id]) return i;
        return 0;
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
        root.innerHTML = '';
        root.appendChild(renderCentral());
        root.appendChild(renderMap());
        stage = document.createElement('section');
        stage.className = 'commu-dc-stage';
        root.appendChild(stage);
        root.appendChild(renderVerdict());
        var epi = renderEpilogue();
        if (epi) root.appendChild(epi);
        // Deep links from the people page ("등장 장면" chips) arrive as
        // /commulingo/book/<id>#<episodeId>: start on that fork.
        var hashIndex = window.location.hash ? episodeIndex(window.location.hash.slice(1)) : -1;
        showEpisode(hashIndex >= 0 ? hashIndex : firstUndecided(), hashIndex >= 0);
        updateProgress();
    }

    function showEpisode(index, scroll) {
        current = Math.max(0, Math.min(episodes.length - 1, index));
        var ep = episodes[current];
        var era = eraOf(ep);
        stage.innerHTML = [
            '<header class="commu-dc-era-head">',
            '<span class="commu-dc-era-range">' + escapeHtml(yearsLabel(era.years || era.range)) + '</span>',
            '<h2>' + escapeHtml(text(era.title)) + '</h2>',
            era.intro ? '<p>' + rich(era.intro) + '</p>' : '',
            '</header>'
        ].join('');
        var card = document.createElement('article');
        card.className = 'commu-dc-episode is-open';
        card.setAttribute('data-episode', ep.id);
        card.innerHTML = '<div class="commu-dc-head"></div><div class="commu-dc-body"></div>';
        stage.appendChild(card);
        paintEpisode(card, ep);
        stage.appendChild(renderStep());
        paintMap();
        try { history.replaceState(null, '', '#' + ep.id); } catch (err) {}
        if (scroll) stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Previous / position / next. Next is the strong button once the current
    // fork is decided, so the reader reads the outcome and then moves on.
    function renderStep() {
        var bar = document.createElement('nav');
        bar.className = 'commu-dc-step';
        bar.setAttribute('aria-label', L.map);
        var decided = Boolean(choices[episodes[current].id]);
        bar.innerHTML = '<button type="button" data-step="-1"' + (current === 0 ? ' disabled' : '') + '>← ' + escapeHtml(L.prev) + '</button>'
            + '<span>' + (current + 1) + ' / ' + episodes.length + '</span>'
            + '<button type="button" data-step="1" class="' + (decided ? 'is-primary' : '') + '"' + (current === episodes.length - 1 ? ' disabled' : '') + '>' + escapeHtml(L.next) + ' →</button>';
        bar.addEventListener('click', function(event) {
            var button = event.target.closest('[data-step]');
            if (button && !button.disabled) showEpisode(current + Number(button.getAttribute('data-step')), true);
        });
        return bar;
    }

    function refreshStep() {
        var old = stage && stage.querySelector('.commu-dc-step');
        if (old) old.replaceWith(renderStep());
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
            '<div class="commu-dc-legend">' + legend + '</div>',
            '<div class="commu-dc-progress"><span id="commuDcProgressText"></span>',
            '<span class="commu-dc-progress-track"><span id="commuDcProgressFill"></span></span></div>'
        ].join('');
        return box;
    }

    // The route map: every fork as a stop on its part's line. A decided stop
    // takes the stance colour of the option chosen, filled when it matches
    // history and hollow when it does not; a tap opens that episode.
    function renderMap() {
        var nav = document.createElement('nav');
        nav.className = 'commu-dc-map box';
        nav.setAttribute('aria-label', L.map);
        nav.innerHTML = '<h2 class="commu-dc-map-title">' + escapeHtml(L.map) + '</h2>'
            + (timeline.eras || []).map(function(era) {
                var label = text(era.title).split(' · ')[0];
                var lastYear = null;
                return '<div class="commu-dc-map-row"><span class="commu-dc-map-era">' + escapeHtml(label) + '</span><ol>'
                    + (era.episodes || []).map(function(ep) {
                        // A stop names its year; a run of stops in one year names the months after the first.
                        var start = Array.isArray(ep.date && ep.date.start) ? ep.date.start : [];
                        var year = start[0] === lastYear && start[1] ? (en ? MONTHS_EN[start[1] - 1].slice(0, 3) : start[1] + '월') : (start[0] || '');
                        lastYear = start[0];
                        return '<li><button type="button" data-map-episode="' + escapeHtml(ep.id) + '" title="' + escapeHtml(dateLabel(ep.date) + ' · ' + text(ep.title)) + '">'
                            + '<span class="commu-dc-stop" aria-hidden="true"></span><span class="commu-dc-map-year">' + escapeHtml(year) + '</span>'
                            + '<span class="commu-sr-only">' + escapeHtml(text(ep.title)) + '</span></button></li>';
                    }).join('') + '</ol></div>';
            }).join('')
            + '<p class="commu-dc-map-legend"><span><span class="commu-dc-stop is-match" aria-hidden="true"></span>' + escapeHtml(L.mapMatch) + '</span>'
            + '<span><span class="commu-dc-stop is-diverge" aria-hidden="true"></span>' + escapeHtml(L.mapDiverge) + '</span>'
            + '<span><span class="commu-dc-stop" aria-hidden="true"></span>' + escapeHtml(L.mapOpen) + '</span>'
            + (timeline.stances || []).map(function(st) { return '<span class="stance-' + escapeHtml(st.id) + '"><span class="commu-dc-stop is-match" aria-hidden="true"></span>' + escapeHtml(text(st.label)) + '</span>'; }).join('') + '</p>';
        nav.addEventListener('click', function(event) {
            var button = event.target.closest('[data-map-episode]');
            var index = button ? episodeIndex(button.getAttribute('data-map-episode')) : -1;
            if (index >= 0) showEpisode(index, true);
        });
        return nav;
    }

    function paintMap() {
        document.querySelectorAll('[data-map-episode]').forEach(function(button) {
            var ep = episodes[episodeIndex(button.getAttribute('data-map-episode'))];
            var chosenId = ep && choices[ep.id];
            var opt = chosenId && (ep.options || []).filter(function(item) { return item.id === chosenId; })[0];
            button.className = (!chosenId ? '' : (chosenId === ep.actualId ? 'is-match' : 'is-diverge') + (opt && opt.stance ? ' stance-' + opt.stance : ''))
                + (ep === episodes[current] ? ' is-current' : '');
            if (ep === episodes[current]) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
        });
    }

    function updateProgress() {
        paintMap();
        var done = decidedCount();
        var total = episodes.length;
        var textEl = document.getElementById('commuDcProgressText');
        var fillEl = document.getElementById('commuDcProgressFill');
        if (textEl) textEl.textContent = done + ' / ' + total + ' ' + L.progress;
        if (fillEl) fillEl.style.width = Math.round((done / (total || 1)) * 100) + '%';
    }

    function paintEpisode(li, ep) {
        var chosenId = choices[ep.id];
        var head = li.querySelector('.commu-dc-head');
        var body = li.querySelector('.commu-dc-body');
        li.classList.toggle('is-decided', Boolean(chosenId));

        var status;
        if (!chosenId) status = '<span class="commu-dc-status">' + escapeHtml(L.undecided) + '</span>';
        else if (chosenId === ep.actualId) status = '<span class="commu-dc-status is-match" aria-label="' + escapeHtml(L.matched) + '"></span>';
        else status = '<span class="commu-dc-status is-diverge" aria-label="' + escapeHtml(L.diverged) + '"></span>';

        head.innerHTML = [
            '<span class="commu-dc-date">' + escapeHtml(dateLabel(ep.date)) + '</span>',
            '<span class="commu-dc-title"><strong>' + escapeHtml(text(ep.title)) + '</strong></span>',
            status
        ].join('');

        var parts = [
            '<p class="commu-dc-role"><span>' + escapeHtml(L.role) + '</span> ' + rich(ep.role) + '</p>',
            '<div class="commu-dc-briefing">' + paras(ep.briefing) + '</div>',
            '<p class="commu-dc-question">' + escapeHtml(text(ep.question)) + '</p>'
        ];

        if (!chosenId) {
            parts.push('<div class="commu-dc-options">' + (ep.options || []).map(function(opt) {
                return '<button type="button" class="commu-dc-option' + (opt.stance ? ' stance-' + escapeHtml(opt.stance) : '') + '" data-option="' + escapeHtml(opt.id) + '">'
                    + '<span class="commu-dc-option-label">' + escapeHtml(text(opt.label)) + '</span>'
                    + actorChips(opt)
                    + '</button>';
            }).join('') + '</div>');
        } else {
            // Decided: each option shows its stance as the card's colour (a left
            // band and wash, as on person cards); the reader's choice and history's
            // road are marks in the corner, explained once in the key line.
            parts.push('<p class="commu-dc-key">' + MARK_CHOSEN + escapeHtml(L.yourChoice) + '<span aria-hidden="true">·</span>' + MARK_ACTUAL + escapeHtml(L.actual) + '</p>');
            parts.push('<div class="commu-dc-options is-revealed">' + (ep.options || []).map(function(opt) {
                var marks = '';
                if (opt.id === chosenId) marks += MARK_CHOSEN;
                if (opt.id === ep.actualId) marks += MARK_ACTUAL;
                var stance = opt.stance && stanceById(opt.stance);
                var cls = 'commu-dc-option is-done';
                if (opt.id === chosenId) cls += ' is-chosen';
                if (opt.id === ep.actualId) cls += ' is-actual';
                if (opt.stance) cls += ' stance-' + opt.stance;
                var said = [];
                if (opt.id === chosenId) said.push(L.yourChoice);
                if (opt.id === ep.actualId) said.push(L.actual);
                if (stance) said.push(text(stance.label));
                var note = '';
                if (opt.note && (opt.id === chosenId || opt.id === ep.actualId)) note = '<div class="commu-dc-option-note">' + paras(opt.note) + '</div>';
                else if (opt.note) note = '<details class="commu-dc-option-note"><summary>' + escapeHtml(L.note) + '</summary>' + paras(opt.note) + '</details>';
                return '<div class="' + cls + '"' + (stance ? ' title="' + escapeHtml(text(stance.label)) + '"' : '') + '>'
                    + (marks ? '<span class="commu-dc-marks">' + marks + '</span>' : '')
                    + '<span class="commu-dc-option-label">' + escapeHtml(text(opt.label))
                    + (said.length ? '<span class="commu-sr-only"> (' + escapeHtml(said.join(', ')) + ')</span>' : '') + '</span>'
                    + actorChips(opt)
                    + note
                    + '</div>';
            }).join('') + '</div>');

            parts.push('<div class="commu-dc-block is-outcome"><span class="commu-dc-block-label">' + escapeHtml(L.outcome) + '</span>' + paras(ep.outcome) + '</div>');
            if (ep.ripple) parts.push('<details class="commu-dc-block is-ripple"><summary class="commu-dc-block-label">→ ' + escapeHtml(L.ripple) + '</summary>' + paras(ep.ripple) + '</details>');
            if (ep.insight) parts.push('<details class="commu-dc-block is-insight"><summary class="commu-dc-block-label">' + escapeHtml(L.insight) + '</summary>' + paras(ep.insight) + '</details>');
            parts.push(refList(L.sources, (ep.sources || []).map(function(src) {
                var title = refs.docs && refs.docs[src.doc];
                return title ? { href: '/commulingo/docs/' + encodeURIComponent(src.doc) + (src.anchor ? '#' + encodeURIComponent(src.anchor) : ''), label: text(title) } : null;
            })));
            parts.push(refList(L.events, (ep.eventIds || []).map(function(id) {
                var title = refs.events && refs.events[id];
                return title ? { href: '/commulingo/events/' + encodeURIComponent(id), label: text(title) } : null;
            })));
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
                    refreshStep();
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
                refreshStep();
            });
        }
    }

    function refList(label, items) {
        items = items.filter(Boolean);
        if (!items.length) return '';
        return '<div class="commu-dc-refs"><span class="commu-dc-block-label">' + escapeHtml(label) + '</span><ul>'
            + items.map(function(item) { return '<li><a href="' + escapeHtml(item.href) + '">' + escapeHtml(item.label) + '</a></li>'; }).join('')
            + '</ul></div>';
    }

    function tally(list) {
        var counts = {};
        (timeline.stances || []).forEach(function(s) { counts[s.id] = 0; });
        var scoredTotal = 0;
        var matches = 0;
        (list || episodes).forEach(function(ep) {
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

    // Shown from the first decision on: the stance tally so far, each part's
    // tally, and how often the reader took history's road.
    function paintVerdict(section) {
        var verdict = timeline.verdict || {};
        var done = decidedCount();
        var total = episodes.length;
        var stances = timeline.stances || [];

        if (!done) {
            section.innerHTML = [
                '<h2 class="commu-section-title">' + escapeHtml(text(verdict.title)) + '</h2>',
                '<p class="commu-section-hint">' + escapeHtml(text(verdict.lockedHint)) + '</p>'
            ].join('');
            return;
        }

        var result = tally();
        var dominant = null;
        stances.forEach(function(s) {
            if (result.counts[s.id] && (!dominant || result.counts[s.id] > result.counts[dominant])) dominant = s.id;
        });

        var bars = stances.map(function(s) {
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

        var parts = (timeline.eras || []).map(function(era) {
            var list = (era.episodes || []).filter(function(ep) { return choices[ep.id]; });
            if (!list.length) return '';
            var counts = tally(list).counts;
            return '<tr><th scope="row">' + escapeHtml(text(era.title)) + '</th>'
                + stances.map(function(s) { return '<td>' + (counts[s.id] || 0) + '</td>'; }).join('') + '</tr>';
        }).join('');

        var profile = dominant && verdict.profiles ? verdict.profiles[dominant] : null;

        section.innerHTML = [
            '<h2 class="commu-section-title">' + escapeHtml(text(verdict.title)) + '</h2>',
            '<p class="commu-section-hint">' + escapeHtml(fill(L.basis, { n: done, total: total })) + '</p>',
            '<div class="commu-dc-bars">' + bars + '</div>',
            profile ? '<p class="commu-dc-profile">' + escapeHtml(text(profile)) + '</p>' : '',
            parts ? '<table class="commu-dc-parts"><thead><tr><th scope="col">' + escapeHtml(L.byPart) + '</th>'
                + stances.map(function(s) { return '<th scope="col">' + escapeHtml(text(s.label)) + '</th>'; }).join('')
                + '</tr></thead><tbody>' + parts + '</tbody></table>' : '',
            '<p class="commu-dc-match">' + escapeHtml(text(verdict.matchLabel)) + ': <strong>' + result.matches + ' / ' + done + '</strong></p>',
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
