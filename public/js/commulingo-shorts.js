(function() {
    // 훈련장 쇼츠: 한 화면에 카드 한 장, 위로 넘기며 본다. 질문만 보이고 탭하면
    // 답과 해설이 열린다. 보기·채점은 없다. 서버의 카드 묶음을 무작위 순서로
    // 받아 이어 붙인다.
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var metaNode = document.getElementById('commulingo-shorts-meta');
    var feed = document.getElementById('shortsFeed');
    if (!metaNode || !feed) return;
    var meta = JSON.parse(metaNode.textContent);
    var loadingNode = document.getElementById('shortsLoading');
    var RENDER_AHEAD = 3;
    var REFILL_BELOW = 10;
    var bucketOrder = shuffle(range(meta.bucketCount));
    var bucketPointer = 0;
    var fetching = false;
    var queue = [];          // 아직 화면에 붙이지 않은 카드
    var rendered = [];       // 붙인 카드 article
    var currentIndex = 0;
    var serial = 0;

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

    function el(tag, className, content) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (content) node.textContent = content;
        return node;
    }

    // ------------------------------------------------------------ 피드 채우기

    function sizeFeed() {
        var top = feed.getBoundingClientRect().top + window.scrollY;
        // 정수로 내린다. 높이가 소수점이면 카드 위치와 스크롤 위치가 1px 미만
        // 어긋나 윗 카드 가장자리가 비친다.
        var height = Math.max(420, Math.floor(window.innerHeight - top - 12));
        feed.style.setProperty('--shorts-height', height + 'px');
        // 카드 높이가 바뀌어도 보던 카드에 맞춘다(모바일 주소창이 접힐 때 등).
        var current = rendered[currentIndex];
        if (current) feed.scrollTop = current.offsetTop;
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
                queue = queue.concat(shuffle(payload.cards || []));
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

    // ------------------------------------------------------------- 카드 그리기

    function renderCard(card) {
        serial += 1;
        var article = el('article', 'commu-short' + (card.kind === 'term' ? ' commu-short--term' : ''));
        article.setAttribute('aria-roledescription', 'card');
        var inner = el('div', 'commu-short-inner');
        inner.appendChild(el('p', 'commu-short-topic', text(card.topic)));
        var body = el('div', 'commu-short-body');
        if (card.kind === 'term') {
            body.appendChild(el('p', 'commu-short-recall', strings.shortsRecall || 'What does it mean?'));
            body.appendChild(el('h2', 'commu-short-term', text(card.term)));
        } else {
            body.appendChild(el('h2', 'commu-short-prompt', text(card.prompt)));
            if (card.quote) {
                var quote = el('blockquote', 'commu-drill-quote commu-short-quote');
                if (card.quoteHeading) quote.appendChild(el('strong', '', text(card.quoteHeading)));
                quote.appendChild(el('span', '', text(card.quote)));
                body.appendChild(quote);
            }
        }
        var answerId = 'shortAnswer' + serial;
        var reveal = el('button', 'commu-short-reveal', strings.shortsReveal || 'Tap to see the answer');
        reveal.type = 'button';
        reveal.setAttribute('aria-expanded', 'false');
        reveal.setAttribute('aria-controls', answerId);
        body.appendChild(reveal);
        var after = el('div', 'commu-short-after');
        after.id = answerId;
        after.hidden = true;
        reveal.addEventListener('click', function() {
            reveal.hidden = true;
            reveal.setAttribute('aria-expanded', 'true');
            showAnswer(card, after);
        });
        inner.appendChild(body);
        inner.appendChild(after);
        article.appendChild(inner);
        feed.appendChild(article);
        rendered.push(article);
        observer.observe(article);
    }

    // 「자세히 보기」는 답 바로 아래에 둔다. 해설이 길어 작은 화면에서 넘쳐도
    // 링크는 보이게 하기 위해서다. 다음 카드는 위로 밀어 넘긴다.
    function showAnswer(card, after) {
        var answer = el('div', 'commu-short-answer');
        answer.appendChild(el('p', 'commu-short-answer-text', text(card.answer)));
        if (card.href) {
            var more = el('a', 'commu-drill-lookup commu-short-more', strings.shortsMore || 'Learn more');
            more.href = card.href;
            more.target = '_blank';
            more.rel = 'noopener';
            answer.appendChild(more);
        }
        if (card.explanation) answer.appendChild(el('p', 'commu-short-rest', text(card.explanation)));
        after.appendChild(answer);
        after.hidden = false;
        // 숨긴 버튼에서 초점이 사라지지 않게 피드로 옮겨 ↑↓로 계속 넘기게 한다.
        feed.focus({ preventScroll: true });
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
    fetchBucket();
})();
