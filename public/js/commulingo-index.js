(function() {
    var strings = window.COMMULINGO_STRINGS || {};
    var shell = document.querySelector('.commulingo-shell');
    var lang = shell ? shell.getAttribute('data-lang') : 'ko';
    var raw = document.getElementById('commulingo-books');
    if (!raw) return;

    var data = JSON.parse(raw.textContent);
    var books = data.collections || [];
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

    function render() {
        renderResume();
        var allIds = [];
        books.forEach(function(book) {
            (book.lessonIds || []).forEach(function(id) { allIds.push(id); });
        });
        var done = allIds.filter(function(id) { return progress[id] && progress[id].completed; }).length;
        if (els.total) els.total.textContent = Math.round((done / (allIds.length || 1)) * 100) + '%';

        els.list.innerHTML = '';
        books.forEach(function(book) {
            els.list.appendChild(createBookCard(book));
        });
    }

    function createBookCard(book) {
        var stats = bookStats(book);
        var card = document.createElement('a');
        card.className = 'commu-book-card';
        card.setAttribute('href', '/commulingo/book/' + encodeURIComponent(book.id));
        var progressLabel = stats.completed
            ? escapeHtml((strings.progress || '진도') + ' ' + stats.percent + '% · ' + stats.completed + ' / ' + stats.total)
            : escapeHtml(strings.bookProgressEmpty || (lang === 'en' ? 'Not started yet' : '아직 시작하지 않음'));
        card.innerHTML = [
            '<div class="commu-book-card-body">',
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
