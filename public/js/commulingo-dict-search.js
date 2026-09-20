(function() {
    'use strict';
    var search = window.__commuSearch;
    var en = document.documentElement.lang === 'en';

    function initialize(root) {
        var input = root.querySelector('[data-commu-dict-search-input]');
        var clear = root.querySelector('[data-commu-dict-search-clear]');
        var status = root.querySelector('[data-commu-dict-search-status]');
        var count = root.querySelector('[data-commu-dict-search-count]');
        var selector = root.getAttribute('data-target');
        var list = document.querySelector(selector);
        if (!list || !input || !clear || !status) return;
        input.maxLength = 200;
        var endpoint = list.getAttribute('data-search-endpoint');
        var chipRoot = document.querySelector('[data-commu-dict-chips][data-target="' + selector + '"]');
        var chips = chipRoot ? Array.from(chipRoot.querySelectorAll('[data-category]')) : [];
        var active = chips.find(function(chip) { return chip.classList.contains('is-active'); });
        var category = active ? active.getAttribute('data-category') : '';
        var browse = list.hasAttribute('data-lazy') ? list : null;
        var indexBar = browse ? document.querySelector('.commu-dict-index') : null;
        if (browse) {
            list = document.createElement('section');
            list.className = browse.className;
            list.id = browse.id + '-results';
            list.setAttribute('aria-label', browse.getAttribute('aria-label'));
            list.hidden = true;
            browse.after(list);
        }
        var pager = document.querySelector('[data-commu-list-pager][data-target="' + selector + '"]');
        if (endpoint && !pager) {
            pager = document.createElement('div');
            pager.hidden = true;
            list.after(pager);
        }
        var retry = document.createElement('button');
        retry.type = 'button';
        retry.className = 'btn btn-small';
        retry.textContent = en ? 'Retry' : '다시 시도';
        retry.hidden = true;
        status.after(retry);
        var page = Number(list.getAttribute('data-page')) || 1;
        var requestId = 0, timer = null, controller = null, loading = false;
        // Small country lists stay local. Normalize their text once, not on
        // every keystroke. Larger dictionaries keep this index on the server.
        var local = endpoint ? [] : Array.from(list.querySelectorAll('[data-search]')).map(function(card) {
            return { card: card, text: card.getAttribute('data-search').toLocaleLowerCase() };
        });

        function showCount(total, filtered) {
            status.textContent = total ? total + (en ? ' ' : '') + root.getAttribute(total === 1 ? 'data-result-one' : 'data-result-many')
                : root.getAttribute('data-result-empty');
            status.classList.toggle('is-empty', total === 0);
            status.hidden = !filtered;
            if (count) { count.textContent = total ? status.textContent : ''; count.hidden = !filtered || !total; }
        }
        function cancel() {
            clearTimeout(timer);
            if (controller) controller.abort();
            loading = false;
            list.removeAttribute('aria-busy');
            return ++requestId;
        }
        function applyLocal(query) {
            var terms = search.terms(query), pattern = search.pattern(query), total = 0;
            local.forEach(function(row) {
                search.clearHighlights(row.card);
                row.card.hidden = !terms.every(function(term) { return row.text.includes(term); });
                if (!row.card.hidden) {
                    total++;
                    if (pattern) search.highlight(row.card, pattern);
                }
            });
            list.querySelectorAll('.commu-country-group').forEach(function(group) {
                group.hidden = !group.querySelector('[data-search]:not([hidden])');
            });
            showCount(total, !!query);
        }
        function updateUrl() {
            if (browse || input.value.trim()) return;
            var params = new URLSearchParams(window.location.search);
            if (category) params.set('kind', category); else params.delete('kind');
            if (page > 1) params.set('page', page); else params.delete('page');
            var suffix = params.toString();
            window.history.replaceState(null, '', location.pathname + (suffix ? '?' + suffix : '') + location.hash);
        }
        function run(delay) {
            var id = cancel();
            var query = input.value.trim();
            var filtered = !!(query || category);
            clear.hidden = !query;
            retry.hidden = true;
            if (!endpoint) { applyLocal(query); return; }
            if (browse) {
                browse.hidden = filtered;
                list.hidden = !filtered;
                if (indexBar) indexBar.hidden = filtered;
                if (!filtered) {
                    list.replaceChildren();
                    pager.hidden = true;
                    showCount(0, false);
                    return;
                }
            }
            list.replaceChildren();
            list.classList.toggle('is-filtering', !!query);
            pager.hidden = true;
            status.hidden = false;
            status.classList.remove('is-empty');
            status.textContent = en ? 'Loading…' : '불러오는 중…';
            if (count) count.hidden = true;
            loading = true;
            list.setAttribute('aria-busy', 'true');
            timer = setTimeout(function() {
                controller = new AbortController();
                var params = new URLSearchParams({ q: query, page: String(page) });
                if (category) params.set('kind', category);
                var source = browse || list;
                ['sort', 'country'].forEach(function(key) {
                    var value = source.getAttribute('data-' + key);
                    if (value) params.set(key, value);
                });
                var prefix = location.pathname.indexOf('/en/') === 0 ? '/en' : '';
                fetch(prefix + endpoint + '?' + params, { credentials: 'same-origin', signal: controller.signal })
                    .then(function(res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
                    .then(function(data) {
                        if (id !== requestId) return;
                        loading = false;
                        list.removeAttribute('aria-busy');
                        list.innerHTML = data.html;
                        var pattern = search.pattern(query);
                        if (pattern) Array.from(list.children).forEach(function(card) { search.highlight(card, pattern); });
                        var holder = document.createElement('template');
                        holder.innerHTML = data.pager;
                        var renderedPager = holder.content.firstElementChild;
                        pager.replaceChildren.apply(pager, Array.from(renderedPager.childNodes));
                        pager.hidden = renderedPager.hidden;
                        page = data.page;
                        showCount(data.total, filtered);
                        updateUrl();
                    }).catch(function(err) {
                        if (id !== requestId || err.name === 'AbortError') return;
                        loading = false;
                        list.removeAttribute('aria-busy');
                        status.textContent = en ? 'Failed to load results' : '검색 결과를 불러오지 못했습니다';
                        retry.hidden = false;
                    });
            }, delay || 0);
        }
        input.addEventListener('input', function() { page = 1; run(180); });
        function reset() { input.value = ''; page = 1; run(); }
        clear.addEventListener('click', function() { reset(); input.focus(); });
        retry.addEventListener('click', function() { run(); });
        input.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && input.value) { event.preventDefault(); reset(); }
            else if (event.key === 'Enter' && input.value.trim() && !loading) {
                var first = list.querySelector('a[href]:not([hidden])');
                if (first) location.href = first.href;
            }
        });
        chips.forEach(function(chip) {
            chip.addEventListener('click', function(event) {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                var next = chip.getAttribute('data-category') || '';
                category = category === next ? '' : next;
                chips.forEach(function(other) {
                    var selected = (other.getAttribute('data-category') || '') === category;
                    other.classList.toggle('is-active', selected);
                    other.setAttribute('aria-pressed', String(selected));
                });
                page = 1;
                run();
            });
        });
        if (pager) pager.addEventListener('click', function(event) {
            var link = event.target.closest('a[href]');
            if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            page = Number(new URL(link.href).searchParams.get('page')) || 1;
            run();
            root.scrollIntoView({ block: 'start' });
        });
        if (input.value.trim()) { page = 1; run(); }
    }
    document.querySelectorAll('[data-commu-dict-search]').forEach(initialize);
})();
