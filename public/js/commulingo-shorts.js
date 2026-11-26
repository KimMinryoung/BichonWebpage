(function() {
    // 쇼츠: 한 화면에 카드 한 장, 위로 넘기며 읽기만 한다. 강좌 한 편의 장면을
    // 순서대로 보이고, 편과 편 사이에 오늘의 역사와 인물 카드를 끼운다.
    // 인물은 오늘 태어났거나 죽은 사람이 먼저, 그다음 무작위.
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var metaNode = document.getElementById('commulingo-shorts-meta');
    var feed = document.getElementById('shortsFeed');
    if (!metaNode || !feed) return;
    var meta = JSON.parse(metaNode.textContent);
    var loadingNode = document.getElementById('shortsLoading');
    var RENDER_AHEAD = 3;
    var REFILL_BELOW = 6;
    var PEOPLE_BETWEEN = 2;

    var episodeOrder = shuffle(range(meta.episodeCount));
    var episodePointer = 0;
    var peopleOrder = shuffle(range(meta.peopleBucketCount));
    var peoplePointer = 0;
    var people = [];
    var todayPeople = [];
    var seenPeople = {};
    var today = [];
    var todayKey = seoulDay();
    var fetching = false;
    var queue = [];
    var rendered = [];
    var currentIndex = 0;

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

    // 「오늘」은 한국 날짜다(방문 통계와 같은 기준).
    function seoulDay() {
        try {
            var parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
            var month = '';
            var day = '';
            parts.forEach(function(part) {
                if (part.type === 'month') month = part.value;
                if (part.type === 'day') day = part.value;
            });
            if (month && day) return month + '-' + day;
        } catch (err) { /* 아래 */ }
        var now = new Date();
        return String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
    }

    function getJson(path) {
        return fetch(path + '?v=' + encodeURIComponent(meta.version), { credentials: 'same-origin' })
            .then(function(res) {
                if (!res.ok) throw new Error('feed load failed');
                return res.json();
            });
    }

    // ------------------------------------------------------------ 피드 채우기

    function sizeFeed() {
        var top = feed.getBoundingClientRect().top + window.scrollY;
        var height = Math.max(420, Math.floor(window.innerHeight - top - 12));
        feed.style.setProperty('--shorts-height', height + 'px');
        var current = rendered[currentIndex];
        if (current) feed.scrollTop = current.offsetTop;
    }

    // 오늘의 인물부터. 한 번 보인 사람은 무작위 묶음에서 다시 나오지 않는다.
    function takePeople(count) {
        var out = [];
        while (out.length < count && (todayPeople.length || people.length)) {
            var person = todayPeople.length ? todayPeople.shift() : people.shift();
            if (seenPeople[person.id]) continue;
            seenPeople[person.id] = true;
            out.push(person);
        }
        return out;
    }

    function nextPeople() {
        if (people.length + todayPeople.length >= PEOPLE_BETWEEN || !meta.peopleBucketCount) return Promise.resolve();
        var index = peopleOrder[peoplePointer];
        peoplePointer = (peoplePointer + 1) % peopleOrder.length;
        return getJson('/commulingo/drill/shorts/feed/p' + index).then(function(payload) {
            people = people.concat(shuffle((payload.cards || []).filter(function(person) { return !seenPeople[person.id]; })));
        });
    }

    // 편 하나와 그 뒤의 쉬는 카드(오늘의 역사 하나, 인물 둘)를 큐에 붙인다.
    function fetchEpisode() {
        if (fetching || !meta.episodeCount) return;
        fetching = true;
        var index = episodeOrder[episodePointer];
        episodePointer += 1;
        if (episodePointer >= episodeOrder.length) {
            episodeOrder = shuffle(range(meta.episodeCount));
            episodePointer = 0;
        }
        Promise.all([getJson('/commulingo/drill/shorts/feed/e' + index), nextPeople()])
            .then(function(results) {
                fetching = false;
                var episode = results[0].episode;
                var total = episode.scenes.length;
                episode.scenes.forEach(function(scene, i) {
                    queue.push({ kind: 'scene', episode: episode, scene: scene, index: i, total: total });
                });
                if (today.length) queue.push({ kind: 'today', row: today.shift() });
                takePeople(PEOPLE_BETWEEN).forEach(function(person) {
                    queue.push({ kind: 'person', person: person });
                });
                if (loadingNode && loadingNode.parentNode) loadingNode.parentNode.removeChild(loadingNode);
                fill();
            })
            .catch(function() {
                fetching = false;
                if (!rendered.length && loadingNode) loadingNode.className = 'commu-shorts-loading';
                if (!rendered.length && loadingNode) loadingNode.textContent = strings.drillLoadFail || 'Could not load the cards.';
            });
    }

    function fill() {
        while (queue.length && rendered.length - currentIndex <= RENDER_AHEAD) {
            renderCard(queue.shift());
        }
        if (queue.length < REFILL_BELOW) fetchEpisode();
    }

    // ------------------------------------------------------------- 카드 그리기

    function lookupButton(href, label) {
        var link = el('a', 'commu-drill-lookup commu-story-more', label);
        link.href = href;
        return link;
    }

    function sceneCard(item) {
        var episode = item.episode;
        var scene = item.scene;
        var inner = el('div', 'commu-short-inner');
        var head = el('p', 'commu-short-topic');
        head.appendChild(el('span', '', text(episode.course)));
        head.appendChild(el('span', 'commu-story-step', (strings.shortsScene || 'Scene') + ' ' + (item.index + 1) + ' / ' + item.total));
        inner.appendChild(head);
        if (item.index === 0) inner.appendChild(el('p', 'commu-story-episode', text(episode.title)));
        if (scene.when) inner.appendChild(el('p', 'commu-story-when', text(scene.when)));
        inner.appendChild(el('h2', 'commu-story-title', text(scene.title)));
        var body = el('div', 'commu-story-lines');
        (scene.lines[lang] || scene.lines.ko || []).forEach(function(line) {
            body.appendChild(el('p', '', line));
        });
        inner.appendChild(body);
        if (item.index === item.total - 1) inner.appendChild(lookupButton(episode.href, strings.shortsEpisode || 'Open the lesson'));
        return inner;
    }

    function todayCard(item) {
        var row = item.row;
        var inner = el('div', 'commu-short-inner');
        var date = row.date;
        var label = lang === 'en'
            ? (strings.shortsToday || 'On this day') + ' · ' + new Date(Date.UTC(2000, date[1] - 1, date[2])).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', timeZone: 'UTC' })
            : (strings.shortsToday || '오늘의 역사') + ' · ' + date[1] + '월 ' + date[2] + '일';
        inner.appendChild(el('p', 'commu-short-topic', label));
        inner.appendChild(el('p', 'commu-story-year', lang === 'en' ? String(date[0]) : date[0] + '년'));
        inner.appendChild(el('h2', 'commu-story-title', text(row.title)));
        var body = el('div', 'commu-story-lines');
        body.appendChild(el('p', '', text(row.body)));
        inner.appendChild(body);
        inner.appendChild(lookupButton(row.href, text(row.event)));
        return inner;
    }

    // 사인별 아이콘(사망 칸 kind 10종). 모르는 kind는 촛불.
    var FATE_ICONS = {
        natural: '🕯️', executed: '⚖️', assassinated: '🗡️', murdered: '🩸', killed: '⚔️',
        accident: '💥', custody: '⛓️', suicide: '🥀', disappeared: '🌫️', unknown: '❔'
    };
    var BIRTH_ICON = '🎂';

    function yearText(date) {
        return lang === 'en' ? String(date[0]) : date[0] + '년';
    }

    // 「🎂 1870년 오늘 태어남」 / 「⚖️ 1938년 오늘 사망 · 처형」
    function dayBadge(person, on) {
        var row = el('p', 'commu-story-day is-' + on + (on === 'death' && person.fate ? ' is-' + person.fate.kind : ''));
        var icon = on === 'birth' ? BIRTH_ICON : FATE_ICONS[person.fate && person.fate.kind] || FATE_ICONS.natural;
        row.appendChild(el('span', 'commu-story-day-icon', icon)).setAttribute('aria-hidden', 'true');
        var date = person[on];
        var words = on === 'birth'
            ? (lang === 'en' ? 'Born on this day, ' + date[0] : yearText(date) + ' 오늘 태어남')
            : (lang === 'en' ? 'Died on this day, ' + date[0] : yearText(date) + ' 오늘 사망');
        var label = on === 'death' && person.fate ? text(person.fate.label) || '' : '';
        row.appendChild(el('span', '', label ? words + ' · ' + label : words));
        return row;
    }

    function personCard(item) {
        var person = item.person;
        var inner = el('div', 'commu-short-inner');
        var on = person.on || [];
        var topic = on.length ? (strings.shortsPersonToday || 'Today’s people') : (strings.shortsPerson || 'People');
        inner.appendChild(el('p', 'commu-short-topic', topic));
        on.forEach(function(which) {
            if (person[which]) inner.appendChild(dayBadge(person, which));
        });
        var name = el('h2', 'commu-story-title commu-story-name');
        if (person.flag) {
            var flag = document.createElement('img');
            flag.className = 'commu-story-flag';
            flag.src = person.flag.src;
            flag.alt = text(person.flag.label);
            flag.height = 18;
            name.appendChild(flag);
        }
        name.appendChild(document.createTextNode(text(person.name)));
        inner.appendChild(name);
        var sub = [person.years, text(person.epithet)].filter(Boolean).join(' · ');
        if (sub) inner.appendChild(el('p', 'commu-story-when', sub));
        inner.appendChild(el('blockquote', 'commu-story-moment', text(person.moment)));
        inner.appendChild(lookupButton(person.href, strings.shortsPersonOpen || 'Open the person'));
        return inner;
    }

    function renderCard(item) {
        var article = el('article', 'commu-short commu-story commu-story--' + item.kind);
        article.setAttribute('aria-roledescription', 'card');
        var inner = item.kind === 'scene' ? sceneCard(item) : item.kind === 'today' ? todayCard(item) : personCard(item);
        article.appendChild(inner);
        feed.appendChild(article);
        rendered.push(article);
        observer.observe(article);
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

    // 첫 카드는 오늘의 역사. 그날 줄이 없거나 받지 못하면 바로 편으로.
    getJson('/commulingo/drill/shorts/feed/d' + todayKey)
        .then(function(payload) {
            today = shuffle(payload.rows || []);
            todayPeople = shuffle(payload.people || []);
        })
        .catch(function() { today = []; todayPeople = []; })
        .then(function() {
            if (today.length) queue.push({ kind: 'today', row: today.shift() });
            fetchEpisode();
        });
})();
