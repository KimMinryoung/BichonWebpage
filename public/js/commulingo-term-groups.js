// Lazy group loading for the glossary list. Loads a group's cards when
// its heading nears the viewport, when its index-bar link is clicked,
// independently of the paginated search results.
(function() {
    var list = document.getElementById('commu-term-list');
    if (!list || !list.hasAttribute('data-lazy')) return;
    var sort = list.getAttribute('data-sort') || 'name';
    var pending = {};
    var failures = {};
    var en = document.documentElement.lang === 'en';
    var heads = Array.prototype.slice.call(
        list.querySelectorAll('.commu-term-group-head[data-pending]'));

    function showRetry(head) {
        if (failures[head.id]) return;
        var notice = document.createElement('div');
        notice.className = 'commu-people-loading';
        var message = document.createElement('span');
        message.setAttribute('role', 'status');
        message.textContent = en ? 'Failed to load this group. ' : '이 분류를 불러오지 못했습니다. ';
        var retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'btn btn-small';
        retry.textContent = en ? 'Retry' : '다시 시도';
        retry.addEventListener('click', function() { loadGroup(head).catch(function() {}); });
        notice.append(message, retry);
        head.after(notice);
        failures[head.id] = notice;
    }

    function loadGroup(head) {
        if (!head || !head.hasAttribute('data-pending')) return Promise.resolve();
        var id = head.id;
        if (pending[id]) return pending[id];
        if (failures[id]) { failures[id].remove(); delete failures[id]; }
        head.setAttribute('aria-busy', 'true');
        var langPrefix = location.pathname.indexOf('/en/') === 0 ? '/en' : '';
        pending[id] = fetch(langPrefix + '/commulingo/terms/cards?sort=' + encodeURIComponent(sort)
                + '&group=' + encodeURIComponent(id), { credentials: 'same-origin' })
            .then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.text();
            })
            .then(function(html) {
                if (head.hasAttribute('data-pending')) {
                    head.removeAttribute('data-pending');
                    head.removeAttribute('aria-busy');
                    head.insertAdjacentHTML('afterend', html);
                }
            })
            .catch(function(err) {
                delete pending[id];
                head.removeAttribute('aria-busy');
                showRetry(head);
                throw err;
            });
        return pending[id];
    }

    var io = 'IntersectionObserver' in window
        ? new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting || list.hidden) return;
                io.unobserve(entry.target);
                loadGroup(entry.target).catch(function() {});
            });
        }, { rootMargin: '300px 0px' })
        : null;
    if (io) heads.forEach(function(head) { io.observe(head); });
    else heads.forEach(function(head) { loadGroup(head).catch(function() {}); });

    // Index-bar jumps and #hash arrivals load their target right away.
    Array.prototype.forEach.call(
        document.querySelectorAll('.commu-dict-index a[href^="#"]'),
        function(link) {
            link.addEventListener('click', function() {
                var head = document.getElementById(link.getAttribute('href').slice(1));
                if (head) loadGroup(head).catch(function() {});
            });
        });
    if (window.location.hash) {
        var target = document.getElementById(window.location.hash.slice(1));
        if (target && target.hasAttribute('data-pending')) loadGroup(target).catch(function() {});
    }
})();
