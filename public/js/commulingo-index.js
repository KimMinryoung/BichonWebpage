(function() {
    function revealUpdates() {
        if (window.location.hash !== '#updates') return;
        var updates = document.getElementById('updates');
        if (updates) updates.open = true;
    }
    revealUpdates();
    window.addEventListener('hashchange', revealUpdates);

    // Also enforce one open category in browsers without details[name] support.
    var updateGroups = document.querySelectorAll('.commu-updates-group');
    updateGroups.forEach(function(group) {
        group.addEventListener('toggle', function() {
            if (!group.open) return;
            updateGroups.forEach(function(other) {
                if (other !== group) other.open = false;
            });
        });
    });

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
        totalBar: document.getElementById('commuProgressBar'),
        resume: document.getElementById('commuResume')
    };

    function text(value) {
        if (!value) return '';
        if (typeof value === 'string') return value;
        return value[lang] || value.ko || value.en || '';
    }

    function loadLocalProgress() {
        try {
            var parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
            return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
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
            .then(function(res) { return res.ok ? res.json() : null; })
            .then(function(payload) {
                if (!payload) return false;
                // Records of another account (or left after signing out) are
                // removed by settleOwner; repaint without them.
                var Schedule = window.CommuLingoSchedule;
                var dropped = Schedule && Schedule.settleOwner ? Schedule.settleOwner(payload) : false;
                if (dropped) progress = {};
                if (!payload.authenticated) return dropped;
                var changed = dropped;
                (payload.progress || []).forEach(function(item) {
                    var merged = mergeOne(progress[item.lessonId], {
                        completed: item.completed,
                        score: item.score,
                        totalQuestions: item.totalQuestions,
                        updatedAt: item.updatedAt
                    });
                    if (JSON.stringify(merged) !== JSON.stringify(progress[item.lessonId])) changed = true;
                    progress[item.lessonId] = merged;
                });
                if (changed) saveLocalProgress();
                return changed;
            })
            .catch(function() { return false; });
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

    function render() {
        renderResume();
        var allIds = [];
        books.forEach(function(book) {
            (book.lessonIds || []).forEach(function(id) { allIds.push(id); });
        });
        var done = allIds.filter(function(id) { return progress[id] && progress[id].completed; }).length;
        var percent = Math.round((done / (allIds.length || 1)) * 100);
        if (els.total) els.total.textContent = percent + '%';
        if (els.totalBar) els.totalBar.value = percent;

        books.forEach(function(book) {
            if (book.format === 'decision-history' || book.format === 'concept-graph') return;
            var card = Array.from(els.list.querySelectorAll('[data-book-id]')).find(function(node) {
                return node.getAttribute('data-book-id') === book.id;
            });
            if (!card) return;
            var stats = bookStats(book);
            card.querySelector('.commu-book-progress-label').textContent = stats.completed
                ? (strings.progress || '진도') + ' ' + stats.percent + '% · ' + stats.completed + ' / ' + stats.total
                : (strings.bookProgressEmpty || (lang === 'en' ? 'Not started yet' : '아직 시작하지 않음'));
            card.querySelector('.commu-book-progress-track > span').style.width = stats.percent + '%';
        });
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
        // Missed questions of that book that are due again, from the shared
        // schedule store; the book page carries the review itself.
        var Schedule = window.CommuLingoSchedule;
        var due = Schedule && Array.isArray(book.lessonIds) ? Schedule.dueList(Schedule.load(), book.lessonIds, Date.now()).length : 0;
        els.resume.innerHTML = [
            '<span class="commu-resume-label">' + escapeHtml(strings.continueLearning || '이어서 학습하기') + '</span>',
            '<span class="commu-resume-target">' + escapeHtml(chapter) + '</span>',
            due ? '<span class="commu-resume-review">' + escapeHtml(String(strings.reviewDueCount || '{count} due').replace('{count}', String(due))) + '</span>' : ''
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

    // Enhance server-rendered cards with local progress, then merge server progress.
    render();
    syncServerProgress().then(function(changed) {
        if (changed) render();
    });
})();
