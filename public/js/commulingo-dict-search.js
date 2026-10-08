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
        // One chip row per facet: the kind row sends ?kind=, any other row
        // names its own parameter (data-param, e.g. the glossary's region).
        var facets = Array.from(document.querySelectorAll('[data-commu-dict-chips][data-target="' + selector + '"]')).map(function(chipRoot) {
            var chips = Array.from(chipRoot.querySelectorAll('[data-category]'));
            var active = chips.find(function(chip) { return chip.classList.contains('is-active'); });
            return {
                param: chipRoot.getAttribute('data-param') || 'kind', chips: chips,
                value: active ? active.getAttribute('data-category') : '',
                details: chipRoot.closest('[data-commu-dict-facet]')
            };
        });
        // A pick closes its dropdown and names itself in the summary.
        function showFacet(facet) {
            if (!facet.details) return;
            var chosen = facet.chips.find(function(chip) { return chip.classList.contains('is-active'); });
            facet.details.classList.toggle('is-set', !!facet.value);
            facet.details.querySelector('[data-commu-dict-facet-value]').textContent =
                facet.value && chosen ? chosen.getAttribute('data-label') : '';
            facet.details.open = false;
        }
        function setFacetParams(params) {
            facets.forEach(function(facet) {
                if (facet.value) params.set(facet.param, facet.value); else params.delete(facet.param);
            });
        }
        function anyFacet() { return facets.some(function(facet) { return !!facet.value; }); }
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
        var requests = search.createRequests();
        var loading = false;
        // Small country lists stay local. Normalize their text once, not on
        // every keystroke. Larger dictionaries keep this index on the server.
        var local = endpoint ? [] : Array.from(list.querySelectorAll('[data-search]')).map(function(card) {
            return { card: card, text: card.getAttribute('data-search').toLocaleLowerCase() };
        });

        function showCount(total, filtered) {
            var countText = total ? total + (en ? ' ' : '') + root.getAttribute(total === 1 ? 'data-result-one' : 'data-result-many')
                : root.getAttribute('data-result-empty');
            status.textContent = countText;
            status.classList.toggle('is-empty', total === 0);
            status.hidden = !filtered;
            if (count) { count.textContent = total ? countText : ''; count.hidden = !filtered || !total; }
        }
        function cancel() {
            requests.cancel();
            loading = false;
            list.removeAttribute('aria-busy');
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
            params.delete('q');
            setFacetParams(params);
            if (page > 1) params.set('page', page); else params.delete('page');
            var suffix = params.toString();
            window.history.replaceState(null, '', location.pathname + (suffix ? '?' + suffix : '') + location.hash);
        }
        function run(delay) {
            cancel();
            var query = input.value.trim();
            var filtered = !!query || anyFacet();
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
            requests.schedule(function(request) {
                var params = new URLSearchParams({ q: query, page: String(page) });
                setFacetParams(params);
                var source = browse || list;
                ['sort', 'country'].forEach(function(key) {
                    var value = source.getAttribute('data-' + key);
                    if (value) params.set(key, value);
                });
                var prefix = location.pathname.indexOf('/en/') === 0 ? '/en' : '';
                request.json(prefix + endpoint + '?' + params)
                    .then(function(data) {
                        loading = false;
                        list.removeAttribute('aria-busy');
                        list.innerHTML = data.html;
                        var pattern = search.pattern(typeof data.highlightQuery === 'string' ? data.highlightQuery : query);
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
                        if (err.name === 'AbortError') return;
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
        facets.forEach(function(facet) {
            facet.chips.forEach(function(chip) {
                chip.addEventListener('click', function(event) {
                    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                    event.preventDefault();
                    var next = chip.getAttribute('data-category') || '';
                    facet.value = facet.value === next ? '' : next;
                    facet.chips.forEach(function(other) {
                        var selected = (other.getAttribute('data-category') || '') === facet.value;
                        other.classList.toggle('is-active', selected);
                        other.setAttribute('aria-pressed', String(selected));
                    });
                    showFacet(facet);
                    page = 1;
                    run();
                });
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
        if (input.value.trim()) run();
    }
    document.querySelectorAll('[data-commu-dict-search]').forEach(initialize);

    // Dropdown filters close on a click outside or Escape, like the people facets.
    var dropdowns = Array.from(document.querySelectorAll('[data-commu-dict-facet]'));
    document.addEventListener('click', function(event) {
        dropdowns.forEach(function(details) { if (!details.contains(event.target)) details.open = false; });
    });
    dropdowns.forEach(function(details) {
        details.addEventListener('toggle', function() {
            if (!details.open) return;
            dropdowns.forEach(function(other) { if (other !== details) other.open = false; });
        });
        details.addEventListener('keydown', function(event) {
            if (event.key !== 'Escape' || !details.open) return;
            details.open = false;
            details.querySelector('summary').focus();
        });
    });
})();
