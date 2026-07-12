(function() {
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var raw = document.getElementById('commulingo-books');
    if (!raw) return;

    var data = JSON.parse(raw.textContent);
    var books = (data.collections || []).slice().sort(function(a, b) {
        return (a.volumeNumber || 0) - (b.volumeNumber || 0);
    });
    var storageKey = 'commulingo-progress-v1';
    var lastKey = 'commulingo-last-v1';
    var progress = loadLocalProgress();

    var els = {
        list: document.getElementById('commuBookList'),
        total: document.getElementById('commuProgressText'),
        resume: document.getElementById('commuResume')
    };

    syncServerProgress().finally(render);

    function text(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[lang] || value.ko || value.en || '';
    }

    function loadLocalProgress() {
        try {
            return JSON.parse(localStorage.getItem(storageKey) || '{}');
        } catch (err) {
            return {};
        }
    }

    function saveLocalProgress() {
        try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (err) {}
    }

    function loadLast() {
        try {
            return JSON.parse(localStorage.getItem(lastKey) || 'null');
        } catch (err) {
            return null;
        }
    }

    function mergeOne(existing, incoming) {
        existing = existing || {};
        return {
            completed: Boolean(existing.completed || incoming.completed),
            score: Math.max(Number(existing.score) || 0, Number(incoming.score) || 0),
            totalQuestions: Math.max(Number(existing.totalQuestions) || 0, Number(incoming.totalQuestions) || 0),
            updatedAt: incoming.updatedAt || existing.updatedAt
        };
    }

    function syncServerProgress() {
        return fetch('/commulingo/progress', { credentials: 'same-origin' })
            .then(function(res) { return res.ok ? res.json() : { authenticated: false }; })
            .then(function(payload) {
                if (!payload.authenticated) return;
                (payload.progress || []).forEach(function(item) {
                    progress[item.lessonId] = mergeOne(progress[item.lessonId], {
                        completed: item.completed,
                        score: item.score,
                        totalQuestions: item.totalQuestions,
                        updatedAt: item.updatedAt
                    });
                });
                saveLocalProgress();
            })
            .catch(function() {});
    }

    function bookStats(book) {
        var ids = book.lessonIds || [];
        var completed = ids.filter(function(id) {
            return progress[id] && progress[id].completed;
        }).length;
        return {
            completed: completed,
            total: ids.length,
            percent: Math.round((completed / (ids.length || 1)) * 100)
        };
    }

    function chapterCountLabel(count) {
        return count + ' ' + (lang === 'en' ? 'Chapters' : '챕터');
    }

    var bookGroups = [
        { label: function() { return strings.categoryHistory || (lang === 'en' ? 'History' : '역사'); }, match: function(b) { return /^history-/.test(b.id); }, historyLinks: true },
        { label: function() { return strings.authorMarx || '카를 마르크스'; }, match: function(b) { return /^capital/.test(b.id) || /^marx-/.test(b.id); } },
        { label: function() { return strings.authorEngels || '프리드리히 엥겔스'; }, match: function(b) { return /^engels/.test(b.id); } },
        { label: function() { return strings.authorLenin || '블라디미르 레닌'; }, match: function(b) { return /^lenin/.test(b.id); } }
    ];

    function groupBooks() {
        var groups = [];
        var assigned = {};
        bookGroups.forEach(function(def) {
            var items = books.filter(def.match);
            items.forEach(function(book) { assigned[book.id] = true; });
            if (items.length) groups.push({ label: def.label(), books: items, historyLinks: def.historyLinks });
        });
        var rest = books.filter(function(book) { return !assigned[book.id]; });
        if (rest.length) groups.push({ label: strings.authorOther || (lang === 'en' ? 'Other' : '그 외'), books: rest });
        return groups;
    }

    function render() {
        renderResume();
        var allIds = [];
        books.forEach(function(book) {
            (book.lessonIds || []).forEach(function(id) { allIds.push(id); });
        });
        var done = allIds.filter(function(id) { return progress[id] && progress[id].completed; }).length;
        if (els.total) els.total.textContent = Math.round((done / (allIds.length || 1)) * 100) + '%';

        els.list.innerHTML = '';
        groupBooks().forEach(function(group) {
            var section = document.createElement('section');
            section.className = 'commu-book-group';
            var head = document.createElement('div');
            head.className = 'commu-book-group-head';
            var heading = document.createElement('h3');
            heading.className = 'commu-book-group-title';
            heading.textContent = group.label;
            head.appendChild(heading);
            if (group.historyLinks) {
                var ctas = document.createElement('div');
                ctas.className = 'commu-group-ctas';
                var eventsCta = document.createElement('a');
                eventsCta.className = 'commu-group-cta is-events';
                eventsCta.setAttribute('href', '/commulingo/events');
                eventsCta.textContent = (lang === 'en' ? 'Historical events' : '역사 사건') + ' →';
                ctas.appendChild(eventsCta);
                var peopleCta = document.createElement('a');
                peopleCta.className = 'commu-group-cta';
                peopleCta.setAttribute('href', '/commulingo/people');
                peopleCta.textContent = (lang === 'en' ? 'People of the era' : '인물 사전') + ' →';
                ctas.appendChild(peopleCta);
                head.appendChild(ctas);
            }
            var grid = document.createElement('div');
            grid.className = 'commulingo-books';
            group.books.forEach(function(book) { grid.appendChild(createBookCard(book)); });
            section.appendChild(head);
            section.appendChild(grid);
            els.list.appendChild(section);
        });
    }

    function createBookCard(book) {
        var card = document.createElement('a');
        card.className = 'commu-book-card';
        card.setAttribute('href', '/commulingo/book/' + encodeURIComponent(book.id));
        var badge = text(book.badge);
        if (book.format === 'decision-history') {
            card.innerHTML = [
                '<div class="commu-book-card-body">',
                badge ? '<span class="commu-book-badge">' + escapeHtml(badge) + '</span>' : '',
                '<h3>' + escapeHtml(text(book.title)) + '</h3>',
                '<p class="commu-book-desc">' + escapeHtml(text(book.description)) + '</p>',
                '<p class="commu-book-meta">' + escapeHtml(episodeCountLabel(book.episodeCount || 0)) + '</p>',
                '</div>',
                '<div class="commu-book-progress">',
                '<span class="commu-book-progress-label">' + escapeHtml(strings.decideMode || (lang === 'en' ? 'Decide & learn' : '선택하며 학습')) + '</span>',
                '</div>'
            ].join('');
            return card;
        }
        if (book.format === 'concept-graph') {
            card.innerHTML = [
                '<div class="commu-book-card-body">',
                badge ? '<span class="commu-book-badge">' + escapeHtml(badge) + '</span>' : '',
                '<h3>' + escapeHtml(text(book.title)) + '</h3>',
                '<p class="commu-book-desc">' + escapeHtml(text(book.description)) + '</p>',
                '<p class="commu-book-meta">' + escapeHtml(nodeCountLabel(book.nodeCount || 0)) + '</p>',
                '</div>',
                '<div class="commu-book-progress">',
                '<span class="commu-book-progress-label">' + escapeHtml(strings.exploreMode || (lang === 'en' ? 'Tap to explore' : '클릭하며 탐색')) + '</span>',
                '</div>'
            ].join('');
            return card;
        }
        var stats = bookStats(book);
        var progressLabel = stats.completed
            ? escapeHtml((strings.progress || '진도') + ' ' + stats.percent + '% · ' + stats.completed + ' / ' + stats.total)
            : escapeHtml(strings.bookProgressEmpty || (lang === 'en' ? 'Not started yet' : '아직 시작하지 않음'));
        card.innerHTML = [
            '<div class="commu-book-card-body">',
            badge ? '<span class="commu-book-badge">' + escapeHtml(badge) + '</span>' : '',
            '<h3>' + escapeHtml(text(book.title)) + '</h3>',
            '<p class="commu-book-desc">' + escapeHtml(text(book.description)) + '</p>',
            '<p class="commu-book-meta">' + escapeHtml(chapterCountLabel(book.chapterCount || 0)) + '</p>',
            '</div>',
            '<div class="commu-book-progress">',
            '<span class="commu-book-progress-label">' + progressLabel + '</span>',
            '<span class="commu-book-progress-track"><span style="width:' + stats.percent + '%"></span></span>',
            '</div>'
        ].join('');
        return card;
    }

    function episodeCountLabel(count) {
        if (lang === 'en') return (strings.decisionSimLabel || 'Decision simulation') + ' · ' + count + ' turning points';
        return (strings.decisionSimLabel || '결정 시뮬레이션') + ' · 갈림길 ' + count + '개';
    }

    function nodeCountLabel(count) {
        if (lang === 'en') return (strings.conceptMapLabel || 'Interactive concept map') + ' · ' + count + ' nodes';
        return (strings.conceptMapLabel || '인터랙티브 개념지도') + ' · 노드 ' + count + '개';
    }

    function renderResume() {
        if (!els.resume) return;
        var last = loadLast();
        var book = last && books.filter(function(b) { return b.id === last.collectionId; })[0];
        if (!last || !book) {
            els.resume.classList.add('is-hidden');
            return;
        }
        var hash = last.lessonId ? '#lesson=' + encodeURIComponent(last.lessonId) : '';
        els.resume.setAttribute('href', '/commulingo/book/' + encodeURIComponent(last.collectionId) + hash);
        var chapter = last.chapterTitle ? text(book.title) + ' · ' + last.chapterTitle : text(book.title);
        els.resume.innerHTML = [
            '<span class="commu-resume-label">' + escapeHtml(strings.continueLearning || '이어서 학습하기') + '</span>',
            '<span class="commu-resume-target">' + escapeHtml(chapter) + '</span>'
        ].join('');
        els.resume.classList.remove('is-hidden');
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
})();
