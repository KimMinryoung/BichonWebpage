(function() {
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var storageKey = 'commulingo-drill-v1';

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

    function shuffle(items) {
        var out = items.slice();
        for (var i = out.length - 1; i > 0; i -= 1) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = out[i];
            out[i] = out[j];
            out[j] = tmp;
        }
        return out;
    }

    function loadRecords() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || '{}');
        } catch (err) {
            return {};
        }
    }

    function saveRecord(deckId, score, total) {
        var records = loadRecords();
        var item = records[deckId] || { best: 0, total: 0, rounds: 0 };
        item.rounds = (Number(item.rounds) || 0) + 1;
        var oldRatio = item.total ? item.best / item.total : -1;
        if (total && score / total > oldRatio) {
            item.best = score;
            item.total = total;
        }
        item.updatedAt = new Date().toISOString();
        records[deckId] = item;
        try {
            localStorage.setItem(storageKey, JSON.stringify(records));
        } catch (err) {}
    }

    // ------------------------------------------------------------- 허브
    var deckList = document.getElementById('commuDrillDeckList');
    if (deckList) {
        var records = loadRecords();
        Array.prototype.forEach.call(deckList.querySelectorAll('[data-drill-best]'), function(node) {
            var item = records[node.getAttribute('data-drill-best')];
            if (!item || !item.total) return;
            node.textContent = (strings.drillBest || 'Best') + ' ' + item.best + ' / ' + item.total
                + ' · ' + item.rounds + ' ' + (strings.drillRoundsDone || 'rounds');
        });
        return;
    }

    // ---------------------------------------------------------- 플레이어
    var metaNode = document.getElementById('commulingo-drill-meta');
    if (!metaNode) return;
    var meta = JSON.parse(metaNode.textContent);

    var els = {
        count: document.getElementById('drillCount'),
        meter: document.getElementById('drillMeterFill'),
        heading: document.getElementById('drillHeading'),
        prompt: document.getElementById('drillPrompt'),
        quote: document.getElementById('drillQuote'),
        choices: document.getElementById('drillChoices'),
        orderList: document.getElementById('drillOrderList'),
        feedback: document.getElementById('drillFeedback'),
        next: document.getElementById('drillNextBtn')
    };

    var deck = null;
    var round = null;

    function setMeter(done, total) {
        if (els.count) els.count.textContent = done + ' / ' + total;
        if (els.meter) els.meter.style.width = Math.round((done / (total || 1)) * 100) + '%';
    }

    function showLoadError() {
        var target = els.prompt || els.heading;
        if (target) target.textContent = strings.drillLoadFail || 'Could not load the questions.';
        if (els.next) els.next.disabled = true;
    }

    fetch('/commulingo/drill/deck/' + encodeURIComponent(meta.id) + '?v=' + encodeURIComponent(meta.version), { credentials: 'same-origin' })
        .then(function(res) {
            if (!res.ok) throw new Error('deck load failed');
            return res.json();
        })
        .then(function(payload) {
            deck = payload.deck;
            if (meta.kind === 'timeline') startTimelineRound();
            else startQuizRound();
        })
        .catch(showLoadError);

    // ------------------------------------------------------- 퀴즈 라운드

    function startQuizRound() {
        var size = Math.min(deck.roundSize || 10, deck.questions.length);
        round = { questions: shuffle(deck.questions).slice(0, size), index: 0, score: 0, answered: false, finished: false };
        els.next.textContent = strings.next || 'Next';
        els.next.disabled = true;
        renderQuizQuestion();
    }

    function renderQuizQuestion() {
        var question = round.questions[round.index];
        setMeter(round.index, round.questions.length);
        els.prompt.textContent = text(question.prompt);
        var quoteHtml = '';
        if (question.quoteHeading && text(question.quoteHeading)) {
            quoteHtml += '<strong>' + escapeHtml(text(question.quoteHeading)) + '</strong>';
        }
        quoteHtml += '<span>' + escapeHtml(text(question.quote)) + '</span>';
        els.quote.innerHTML = quoteHtml;
        els.quote.classList.remove('is-hidden');
        els.feedback.className = 'commu-feedback is-hidden';
        els.feedback.textContent = '';
        els.next.disabled = true;
        els.next.textContent = round.index >= round.questions.length - 1 ? (strings.finish || 'Finish') : (strings.next || 'Next');

        els.choices.innerHTML = '';
        var order = shuffle(text(question.choices).map(function(label, index) {
            return { label: label, originalIndex: index };
        }));
        order.forEach(function(choice) {
            var button = document.createElement('button');
            button.type = 'button';
            button.className = 'commu-choice';
            button.textContent = choice.label;
            button.setAttribute('data-original-index', String(choice.originalIndex));
            button.addEventListener('click', function() { chooseAnswer(question, choice.originalIndex); });
            els.choices.appendChild(button);
        });
    }

    function chooseAnswer(question, index) {
        if (round.answered) return;
        round.answered = true;
        var correct = index === Number(question.answer);
        if (correct) round.score += 1;

        Array.prototype.forEach.call(els.choices.children, function(button) {
            var originalIndex = Number(button.getAttribute('data-original-index'));
            button.disabled = true;
            if (originalIndex === Number(question.answer)) button.classList.add('is-correct');
            if (originalIndex === index && !correct) button.classList.add('is-wrong');
        });

        var parts = [
            '<strong class="commu-feedback-marker">' + escapeHtml(correct ? (strings.correct || 'Correct') : (strings.incorrect || 'Incorrect')) + '</strong>',
            '<span>' + escapeHtml(text(question.explanation)) + '</span>'
        ];
        if (question.href) {
            parts.push('<a class="commu-drill-lookup" target="_blank" rel="noopener" href="' + escapeHtml(question.href) + '">'
                + escapeHtml(strings.drillLookup || 'Open dictionary entry') + '</a>');
        }
        els.feedback.className = 'commu-feedback' + (correct ? '' : ' is-wrong');
        els.feedback.innerHTML = parts.join('');
        els.next.disabled = false;
        setMeter(round.index + 1, round.questions.length);
    }

    function finishQuizRound() {
        round.finished = true;
        saveRecord(deck.id, round.score, round.questions.length);
        els.prompt.textContent = strings.drillRoundDone || 'Round complete';
        els.quote.classList.add('is-hidden');
        els.choices.innerHTML = '';
        var perfect = round.score === round.questions.length;
        els.feedback.className = 'commu-feedback' + (perfect ? ' is-perfect' : '');
        els.feedback.innerHTML = '<strong class="commu-feedback-marker">'
            + escapeHtml((strings.score || 'Score') + ': ' + round.score + ' / ' + round.questions.length) + '</strong>';
        els.next.disabled = false;
        els.next.textContent = strings.drillNextRound || 'Next round';
    }

    if (els.next && meta.kind !== 'timeline') {
        els.next.addEventListener('click', function() {
            if (!round || !deck) return;
            if (round.finished) { startQuizRound(); return; }
            if (!round.answered) return;
            if (round.index >= round.questions.length - 1) { finishQuizRound(); return; }
            round.index += 1;
            round.answered = false;
            renderQuizQuestion();
        });
    }

    // ------------------------------------------------------- 연표 라운드

    function sampleEventsRound() {
        var taken = [];
        var years = {};
        shuffle(deck.pool).forEach(function(event) {
            if (taken.length >= deck.roundSize || years[event.year]) return;
            years[event.year] = true;
            taken.push({ label: text(event.title), reveal: event.period, sortKey: event.year });
        });
        return { heading: '', items: taken };
    }

    function sampleEpisodesRound() {
        var source = deck.pool[Math.floor(Math.random() * deck.pool.length)];
        var indexes = shuffle(source.entries.map(function(entry, index) { return index; }))
            .slice(0, deck.roundSize)
            .sort(function(a, b) { return a - b; });
        var items = indexes.map(function(entryIndex, position) {
            var entry = source.entries[entryIndex];
            return { label: text(entry.title), reveal: entry.date, sortKey: position };
        });
        return { heading: text(source.title) + ' (' + source.period + ')', items: items };
    }

    function startTimelineRound() {
        var sample = meta.mode === 'episodes' ? sampleEpisodesRound() : sampleEventsRound();
        var display = shuffle(sample.items);
        var guard = 0;
        while (display.length > 1 && isSorted(display) && guard < 10) {
            display = shuffle(sample.items);
            guard += 1;
        }
        round = { items: display, answerKeys: sortedKeys(sample.items), graded: false };
        if (els.heading) {
            els.heading.textContent = sample.heading;
            els.heading.classList.toggle('is-hidden', !sample.heading);
        }
        els.feedback.className = 'commu-feedback is-hidden';
        els.feedback.textContent = '';
        els.next.disabled = false;
        els.next.textContent = strings.drillCheckOrder || 'Check order';
        setMeter(0, round.items.length);
        renderOrderList();
    }

    function sortedKeys(items) {
        return items.map(function(item) { return item.sortKey; }).sort(function(a, b) { return a - b; });
    }

    function isSorted(items) {
        for (var i = 1; i < items.length; i += 1) {
            if (items[i - 1].sortKey > items[i].sortKey) return false;
        }
        return true;
    }

    function renderOrderList() {
        els.orderList.innerHTML = '';
        round.items.forEach(function(item, index) {
            var li = document.createElement('li');
            li.className = 'commu-drill-order-item';
            var label = document.createElement('span');
            label.className = 'commu-drill-order-label';
            label.textContent = item.label;
            li.appendChild(label);
            var reveal = document.createElement('span');
            reveal.className = 'commu-drill-order-reveal';
            li.appendChild(reveal);
            if (!round.graded) {
                var controls = document.createElement('span');
                controls.className = 'commu-drill-order-controls';
                controls.appendChild(moveButton('▲', strings.drillMoveUp || 'Move up', index, -1));
                controls.appendChild(moveButton('▼', strings.drillMoveDown || 'Move down', index, 1));
                li.appendChild(controls);
            } else {
                reveal.textContent = item.reveal;
            }
            els.orderList.appendChild(li);
        });
    }

    function moveButton(glyph, label, index, delta) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'commu-drill-order-move';
        button.textContent = glyph;
        button.setAttribute('aria-label', label);
        button.disabled = index + delta < 0 || index + delta >= round.items.length;
        button.addEventListener('click', function() {
            var other = round.items[index + delta];
            round.items[index + delta] = round.items[index];
            round.items[index] = other;
            renderOrderList();
        });
        return button;
    }

    function gradeTimelineRound() {
        round.graded = true;
        var score = 0;
        renderOrderList();
        Array.prototype.forEach.call(els.orderList.children, function(li, index) {
            var correct = round.items[index].sortKey === round.answerKeys[index];
            li.classList.add(correct ? 'is-correct' : 'is-wrong');
            if (correct) score += 1;
        });
        saveRecord(deck.id, score, round.items.length);
        setMeter(score, round.items.length);
        var perfect = score === round.items.length;
        els.feedback.className = 'commu-feedback' + (perfect ? ' is-perfect' : (score ? '' : ' is-wrong'));
        els.feedback.innerHTML = '<strong class="commu-feedback-marker">'
            + escapeHtml((strings.score || 'Score') + ': ' + score + ' / ' + round.items.length) + '</strong>';
        els.next.textContent = strings.drillNextRound || 'Next round';
    }

    if (els.next && meta.kind === 'timeline') {
        els.next.addEventListener('click', function() {
            if (!round || !deck) return;
            if (round.graded) startTimelineRound();
            else gradeTimelineRound();
        });
    }
})();
