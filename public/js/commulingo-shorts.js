(function() {
    // 훈련장 쇼츠: 한 화면에 카드 한 장, 위로 넘기며 푼다. 서버의 카드 묶음을
    // 무작위 순서로 받아 이어 붙이고, 틀리거나 「몰랐다」인 카드는 몇 장 뒤에
    // 한 번 더 끼워 넣는다. 기록은 이 페이지 안에서만 유지한다.
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var metaNode = document.getElementById('commulingo-shorts-meta');
    var feed = document.getElementById('shortsFeed');
    if (!metaNode || !feed) return;
    var meta = JSON.parse(metaNode.textContent);
    var loadingNode = document.getElementById('shortsLoading');
    var streakNode = document.getElementById('shortsStreak');
    var measure = window.CommuLingoMeasurement;

    var RENDER_AHEAD = 3;
    var REFILL_BELOW = 10;
    var MAX_REPEATS = 2;
    var COMPLETE_AFTER = 10;
    var MAX_MEASURED = 500;

    var bucketOrder = shuffle(range(meta.bucketCount));
    var bucketPointer = 0;
    var fetching = false;
    var queue = [];          // 아직 화면에 붙이지 않은 카드
    var rendered = [];       // 붙인 카드 article
    var currentIndex = 0;
    var repeats = {};        // key → 다시 낸 횟수
    var serial = 0;
    var streak = 0;
    var answeredCount = 0;

    function text(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[lang] || value.ko || value.en || '';
    }

    function range(n) {
        var out = [];
        for (var i = 0; i < n; i += 1) out.push(i);
        return out;
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

    function randomBetween(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    function el(tag, className, content) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (content) node.textContent = content;
        return node;
    }

    // 첫 문장은 굵게 「한 줄 정리」로, 나머지는 작게.
    function splitLead(value) {
        var s = String(value || '').trim();
        var m = /^[\s\S]*?[.!?。](?=\s|$)/.exec(s);
        if (!m || m[0].length >= s.length) return [s, ''];
        return [m[0].trim(), s.slice(m[0].length).trim()];
    }

    // ------------------------------------------------------------ 피드 채우기

    function sizeFeed() {
        var top = feed.getBoundingClientRect().top + window.scrollY;
        var height = Math.max(420, window.innerHeight - top - 12);
        feed.style.setProperty('--shorts-height', height + 'px');
    }

    // 용어 flip 뒤 3~6장 사이에 같은 용어의 pick을 끼워, 한 개념을 형식을 바꿔
    // 두 번 만나게 한다.
    function arrangeBucket(cards) {
        var flipKeys = {};
        cards.forEach(function(card) { if (card.kind === 'flip') flipKeys[card.key] = true; });
        var followers = [];
        var main = [];
        cards.forEach(function(card) {
            if (card.kind === 'pick' && flipKeys[card.key]) followers.push(card);
            else main.push(card);
        });
        var order = shuffle(main);
        followers.forEach(function(card) {
            var at = -1;
            for (var i = 0; i < order.length; i += 1) {
                if (order[i].kind === 'flip' && order[i].key === card.key) { at = i; break; }
            }
            var pos = at < 0 ? order.length : Math.min(order.length, at + randomBetween(3, 6));
            order.splice(pos, 0, card);
        });
        return order;
    }

    function fetchBucket() {
        if (fetching || bucketPointer >= bucketOrder.length) return;
        fetching = true;
        var index = bucketOrder[bucketPointer];
        bucketPointer += 1;
        fetch('/commulingo/drill/shorts/feed/' + index + '?v=' + encodeURIComponent(meta.version), { credentials: 'same-origin' })
            .then(function(res) {
                if (!res.ok) throw new Error('feed load failed');
                return res.json();
            })
            .then(function(payload) {
                fetching = false;
                queue = queue.concat(arrangeBucket(payload.cards || []));
                if (loadingNode && loadingNode.parentNode) loadingNode.parentNode.removeChild(loadingNode);
                fill();
            })
            .catch(function() {
                fetching = false;
                if (!rendered.length && loadingNode) loadingNode.textContent = strings.drillLoadFail || 'Could not load the cards.';
            });
        // 전부 돌았으면 순서를 새로 섞어 처음부터.
        if (bucketPointer >= bucketOrder.length) {
            bucketOrder = shuffle(range(meta.bucketCount));
            bucketPointer = 0;
        }
    }

    function fill() {
        while (queue.length && rendered.length - currentIndex <= RENDER_AHEAD) {
            renderCard(queue.shift());
        }
        if (queue.length < REFILL_BELOW) fetchBucket();
    }

    // 몇 장 뒤에 다시. 이미 화면에 붙어 있는 앞쪽 카드 수만큼 덜 미룬다.
    function requeue(card) {
        var count = repeats[card.key] || 0;
        if (count >= MAX_REPEATS) return;
        repeats[card.key] = count + 1;
        var ahead = rendered.length - currentIndex - 1;
        var pos = Math.max(0, Math.min(queue.length, randomBetween(4, 7) - ahead));
        queue.splice(pos, 0, Object.assign({}, card, { again: true }));
    }

    // ------------------------------------------------------------- 카드 그리기

    function renderCard(card) {
        serial += 1;
        var article = el('article', 'commu-short commu-short--' + card.kind);
        article.setAttribute('aria-roledescription', 'card');
        var inner = el('div', 'commu-short-inner');
        var topic = el('p', 'commu-short-topic', text(card.topic));
        if (card.again) topic.appendChild(el('span', 'ui-badge commu-short-again', strings.shortsAgain || 'Once more'));
        inner.appendChild(topic);
        var body = el('div', 'commu-short-body');
        inner.appendChild(body);
        var after = el('div', 'commu-short-after');
        after.hidden = true;
        inner.appendChild(after);
        article.appendChild(inner);
        if (card.kind === 'flip') renderFlip(card, body, after, article);
        else renderPick(card, body, after, article);
        feed.appendChild(article);
        rendered.push(article);
        observer.observe(article);
    }

    function renderPick(card, body, after, article) {
        body.appendChild(el('h2', 'commu-short-prompt', text(card.prompt)));
        if (card.quote) {
            var quote = el('blockquote', 'commu-drill-quote commu-short-quote');
            if (card.quoteHeading) quote.appendChild(el('strong', '', text(card.quoteHeading)));
            quote.appendChild(el('span', '', text(card.quote)));
            body.appendChild(quote);
        }
        var choices = el('div', 'commu-short-choices');
        shuffle([0, 1]).forEach(function(index) {
            var button = el('button', 'commu-choice', text(card.choices)[index] || '');
            button.type = 'button';
            button.setAttribute('data-index', String(index));
            button.addEventListener('click', function() { choosePick(card, index, choices, after, article); });
            choices.appendChild(button);
        });
        body.appendChild(choices);
    }

    function choosePick(card, index, choices, after, article) {
        if (article.classList.contains('is-answered')) return;
        article.classList.add('is-answered');
        var correct = index === Number(card.answer);
        Array.prototype.forEach.call(choices.children, function(button) {
            var i = Number(button.getAttribute('data-index'));
            button.disabled = true;
            if (i === Number(card.answer)) button.classList.add('is-correct');
            if (i === index && !correct) button.classList.add('is-wrong');
        });
        var feedback = el('div', 'commu-feedback' + (correct ? '' : ' is-wrong'));
        feedback.appendChild(el('strong', 'commu-feedback-marker', correct ? (strings.correct || 'Correct') : (strings.incorrect || 'Incorrect')));
        if (!correct && card.wrongNote) feedback.appendChild(el('span', 'commu-choice-feedback', text(card.wrongNote)));
        var parts = splitLead(text(card.explanation));
        feedback.appendChild(el('strong', 'commu-short-lead', parts[0]));
        if (parts[1]) feedback.appendChild(el('span', 'commu-short-rest', parts[1]));
        after.appendChild(feedback);
        record(card, correct, after);
    }

    function renderFlip(card, body, after, article) {
        body.appendChild(el('p', 'commu-short-recall', strings.shortsRecall || 'What does it mean?'));
        body.appendChild(el('h2', 'commu-short-term', text(card.front)));
        var reveal = el('button', 'commu-short-reveal', strings.shortsReveal || 'Tap to check');
        reveal.type = 'button';
        var back = el('p', 'commu-short-back', text(card.back));
        back.hidden = true;
        var rate = el('div', 'commu-short-rate');
        rate.hidden = true;
        [[false, strings.shortsDidntKnow || "Didn't know"], [true, strings.shortsKnew || 'Knew it']].forEach(function(pair) {
            var button = el('button', 'btn' + (pair[0] ? ' btn-primary' : ''), pair[1]);
            button.type = 'button';
            button.addEventListener('click', function() {
                if (article.classList.contains('is-answered')) return;
                article.classList.add('is-answered');
                Array.prototype.forEach.call(rate.children, function(b) { b.disabled = true; });
                button.classList.add('is-chosen');
                record(card, pair[0], after);
            });
            rate.appendChild(button);
        });
        reveal.addEventListener('click', function() {
            reveal.hidden = true;
            back.hidden = false;
            rate.hidden = false;
            rate.firstChild.focus({ preventScroll: true });
        });
        body.appendChild(reveal);
        body.appendChild(back);
        body.appendChild(rate);
    }

    // 답 하나를 기록하고 「자세히·다음」 줄을 연다.
    function record(card, correct, after) {
        if (correct) streak += 1;
        else {
            streak = 0;
            requeue(card);
        }
        showStreak();
        answeredCount += 1;
        if (measure && answeredCount <= MAX_MEASURED) {
            measure.answer(correct);
            if (answeredCount === COMPLETE_AFTER) measure.complete();
        }
        var actions = el('div', 'commu-short-actions');
        if (card.href) {
            var more = el('a', 'commu-drill-lookup', strings.shortsMore || 'Learn more');
            more.href = card.href;
            more.target = '_blank';
            more.rel = 'noopener';
            actions.appendChild(more);
        }
        var next = el('button', 'btn btn-small commu-short-next', (strings.shortsNext || 'Next card') + ' ↓');
        next.type = 'button';
        next.addEventListener('click', function() { goTo(currentIndex + 1); });
        actions.appendChild(next);
        after.appendChild(actions);
        after.appendChild(el('p', 'commu-short-swipe', strings.shortsSwipe || 'Swipe up'));
        after.hidden = false;
        fill();
    }

    function showStreak() {
        if (!streakNode) return;
        streakNode.hidden = streak < 2;
        streakNode.textContent = (strings.shortsStreak || 'Streak') + ' ' + streak;
        streakNode.classList.remove('is-pop');
        if (streak >= 2 && streak % 5 === 0) {
            void streakNode.offsetWidth;
            streakNode.classList.add('is-pop');
        }
    }

    // --------------------------------------------------------------- 넘기기

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting || entry.intersectionRatio < 0.6) return;
            var index = rendered.indexOf(entry.target);
            if (index < 0 || index === currentIndex) return;
            currentIndex = index;
            fill();
        });
    }, { root: feed, threshold: [0.6] });

    function goTo(index) {
        if (!rendered.length) return;
        var target = rendered[Math.max(0, Math.min(rendered.length - 1, index))];
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        feed.scrollTo({ top: target.offsetTop, behavior: reduce ? 'auto' : 'smooth' });
    }

    feed.addEventListener('keydown', function(event) {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        var key = event.key;
        if (key === 'ArrowDown' || key === 'PageDown' || key === 'j') {
            event.preventDefault();
            goTo(currentIndex + 1);
        } else if (key === 'ArrowUp' || key === 'PageUp' || key === 'k') {
            event.preventDefault();
            goTo(currentIndex - 1);
        }
    });

    sizeFeed();
    window.addEventListener('resize', sizeFeed);
    if (measure) measure.begin('drill', 'shorts', meta.version, 'quiz');
    fetchBucket();
})();
