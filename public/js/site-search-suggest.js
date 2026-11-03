// Every integrated search box (partials/site-search-form) shows results as one
// types: GET <form action>/suggest (routes/search.js) answers with the same
// result groups the search page draws. Where they appear is the form's
// data-site-search:
//   dialog  the toolbar dialog (partials/nav). The magnifier, "/" (outside a
//           text field) and Ctrl/⌘+K open it; on the search page they focus
//           that page's box instead.
//   inline  a dropdown under the box (the home and CommuLingo front pages).
//   page    the search page's own results, which follow the box; the address
//           and the scope tabs carry the query.
// In each: Enter opens the full search page (on that page it settles the
// results), ↓/↑ walk the results, the clear button and Escape empty the box
// (Escape first closes an open dropdown or the dialog). Without this script
// every box is a plain GET form and the magnifier a link.
(function () {
    'use strict';
    if (!window.fetch || !window.Map || !window.URL) return;
    var DELAY = 180;

    // Answers by address, shared by every box on the page, so going back over
    // what one typed or reopening the dialog asks nothing. A few dozen at
    // most, the oldest dropped first; an answer with a failed section is not
    // kept.
    var answers = new Map();
    var KEEP = 40;
    function load(url, signal) {
        if (answers.has(url)) {
            var kept = answers.get(url);
            answers.delete(url);
            answers.set(url, kept);
            return Promise.resolve(kept);
        }
        return fetch(url, { signal: signal, credentials: 'same-origin', headers: { Accept: 'application/json' } })
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            }).then(function (data) {
                if (!data.failed) {
                    answers.set(url, data);
                    if (answers.size > KEEP) answers.delete(answers.keys().next().value);
                }
                return data;
            });
    }

    function fill(template, values) {
        return (template || '').replace(/\{(\w+)\}/g, function (match, key) {
            return key in values ? String(values[key]) : match;
        });
    }

    function within(node, root) {
        return !!(node && root && (node === root || root.contains(node)));
    }

    function SearchBox(form) {
        var mode = form.getAttribute('data-site-search');
        var input = form.querySelector('[data-search-input]');
        var clear = form.querySelector('[data-search-clear]');
        var status = form.querySelector('[data-site-search-status]');
        var panel = form.querySelector('[data-site-search-panel]');
        var results = panel ? panel.querySelector('[data-site-search-results]') : document.querySelector(form.getAttribute('data-results'));
        var all = form.querySelector('[data-site-search-all]');
        var dialog = mode === 'dialog' ? form.closest('dialog') : null;
        if (!input || !results) return null;
        var action = new URL(form.getAttribute('action'), location.href).pathname;
        var timer = null;
        var slow = null;
        var controller = null;
        // The query the results now show; the search page arrives with its own.
        var shown = mode === 'page' ? input.value.trim() : '';

        function label(name, values) { return fill(form.getAttribute('data-' + name + '-label'), values); }
        function message(text) {
            var p = document.createElement('p');
            p.className = 'site-search-status';
            p.textContent = text;
            return p;
        }

        // A dropdown shows while the box is in use; the dialog's while it is open.
        function inUse() {
            if (mode === 'dialog') return dialog.open;
            return mode === 'inline' && within(document.activeElement, form);
        }
        function setOpen(open) {
            if (!panel) return;
            open = open && !!shown;
            panel.hidden = !open;
            form.classList.toggle('is-open', open);
        }
        function setBusy(busy) {
            clearTimeout(slow);
            if (busy) {
                results.setAttribute('aria-busy', 'true');
                // An empty dropdown says it is searching only when the answer is slow.
                if (panel && !results.childElementCount) {
                    slow = setTimeout(function () {
                        if (results.childElementCount) return;
                        results.appendChild(message(label('loading', {})));
                        panel.hidden = !inUse();
                    }, 400);
                }
            } else {
                results.removeAttribute('aria-busy');
            }
        }

        // The search page: the address, title and scope tabs follow the box.
        // A search one arrived at, went Back to or settled with Enter keeps its
        // history entry: the first change after it adds one, which the rest of
        // the typing then rewrites.
        var settled = true;
        function follow(query, settle) {
            var url = new URL(location.href);
            if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
            // An expanded section (?more=) is the server's page: leaving it
            // asks the box's own results again, even for the same words.
            if (url.searchParams.has('more')) shown = '';
            url.searchParams.delete('more');
            url.hash = '';
            var next = url.pathname + url.search;
            if (next !== location.pathname + location.search) {
                history[settled ? 'pushState' : 'replaceState'](null, '', next);
            }
            settled = !!settle;
            retitle(query);
        }
        function retitle(query) {
            var base = results.getAttribute('data-title');
            if (base) document.title = query ? query + ' — ' + base : base;
            document.querySelectorAll('[data-site-search-scope]').forEach(function (tab) {
                var href = new URL(tab.href);
                if (query) href.searchParams.set('q', query); else href.searchParams.delete('q');
                tab.href = href.pathname + href.search;
            });
        }

        function render(query, data) {
            setBusy(false);
            shown = query;
            if (!query) {
                results.replaceChildren();
                if (mode === 'page') results.appendChild(message(results.getAttribute('data-prompt')));
                if (status) status.textContent = '';
            } else {
                results.innerHTML = data.html || '';
                if (status) status.textContent = label('count', { n: data.count || 0, q: query });
            }
            if (all) {
                all.href = action + '?q=' + encodeURIComponent(query);
                all.textContent = label('all', { q: query });
            }
            setOpen(inUse());
        }

        function cancel() {
            clearTimeout(timer);
            if (controller) controller.abort();
            controller = null;
        }

        function show(query) {
            cancel();
            if (!query) { render('', null); return; }
            if (query === shown) {
                setBusy(false);
                setOpen(inUse());
                return;
            }
            var current = controller = window.AbortController ? new AbortController() : null;
            setBusy(true);
            load(action + '/suggest?q=' + encodeURIComponent(query), current ? current.signal : undefined)
                .then(function (data) {
                    if (controller !== current || input.value.trim() !== query) return;
                    controller = null;
                    render(query, data);
                }).catch(function (err) {
                    if (err && err.name === 'AbortError') return;
                    if (controller !== current) return;
                    controller = null;
                    setBusy(false);
                    shown = '';
                    results.replaceChildren(message(label('error', {})));
                    if (panel) panel.hidden = !inUse();
                });
        }

        function update(delay) {
            var query = input.value.trim();
            if (clear) clear.hidden = !input.value;
            clearTimeout(timer);
            if (mode === 'page') follow(query, false);
            if (!query || !delay) { show(query); return; }
            timer = setTimeout(function () { show(query); }, delay);
        }

        function empty() {
            input.value = '';
            update(0);
            input.focus();
        }

        // The rows the arrows walk: the results, then the dropdown's "all" link.
        function rows() {
            var list = Array.prototype.slice.call(results.querySelectorAll('a[href]'));
            if (all && panel && !panel.hidden) list.push(all);
            return list;
        }
        function walk(event) {
            if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
            if (panel && panel.hidden) {
                // ↓ in the box reopens a dropdown closed with Escape.
                if (event.target === input && event.key === 'ArrowDown' && shown && shown === input.value.trim()) {
                    event.preventDefault();
                    setOpen(true);
                }
                return;
            }
            var list = rows();
            if (!list.length) return;
            var at = list.indexOf(document.activeElement);
            if (event.target === input) {
                if (event.key !== 'ArrowDown') return;
                event.preventDefault();
                list[0].focus();
            } else if (at !== -1) {
                event.preventDefault();
                if (event.key === 'ArrowDown') list[Math.min(at + 1, list.length - 1)].focus();
                else if (at === 0) input.focus();
                else list[at - 1].focus();
            }
        }

        input.addEventListener('input', function () { update(DELAY); });
        if (clear) clear.addEventListener('click', empty);
        form.addEventListener('keydown', walk);
        if (!panel) results.addEventListener('keydown', walk);

        form.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape' || event.isComposing) return;
            // A search input eats Escape to clear itself; this box decides.
            event.preventDefault();
            if (mode === 'dialog') { dialog.close(); return; }
            if (panel && !panel.hidden) {
                // Focus first: returning to the box would otherwise reopen it.
                input.focus();
                setOpen(false);
            } else if (input.value) {
                empty();
            }
        });

        form.addEventListener('submit', function (event) {
            var query = input.value.trim();
            // An empty box has no results page to open.
            if (!query) { event.preventDefault(); input.focus(); return; }
            if (mode !== 'page') return;
            // The search page already holds these results: settle the address
            // instead of loading the page again.
            event.preventDefault();
            follow(query, true);
            show(query);
        });

        if (mode === 'inline') {
            input.addEventListener('focus', function () { update(0); });
            // Away from the box closes its dropdown: a press elsewhere, or Tab
            // onward (a click that does not focus, as on Safari, leaves no
            // related target and is the press handler's to judge).
            document.addEventListener('pointerdown', function (event) {
                if (!within(event.target, form)) setOpen(false);
            });
            form.addEventListener('focusout', function (event) {
                if (event.relatedTarget && !within(event.relatedTarget, form)) setOpen(false);
            });
        }

        if (mode === 'page') {
            window.addEventListener('popstate', function () {
                settled = true;
                var url = new URL(location.href);
                // An expanded section and its anchor come only from the
                // server, so such an entry is loaded again.
                if (url.searchParams.has('more')) { location.reload(); return; }
                var query = url.searchParams.get('q') || '';
                input.value = query;
                if (clear) clear.hidden = !query;
                show(query.trim());
                retitle(query.trim());
            });
        }

        return {
            mode: mode,
            focus: function () {
                if (dialog && !dialog.open) dialog.showModal();
                input.focus();
                input.select();
                if (dialog) setOpen(true);
            },
        };
    }

    var boxes = Array.prototype.map.call(document.querySelectorAll('form[data-site-search]'), SearchBox).filter(Boolean);
    var pageBox = boxes.find(function (box) { return box.mode === 'page'; });
    var dialogBox = boxes.find(function (box) { return box.mode === 'dialog'; });
    var dialog = document.getElementById('siteSearchDialog');
    if (dialogBox && typeof dialog.showModal !== 'function') dialogBox = null;
    // The search page's own box answers the magnifier and the shortcuts.
    var target = pageBox || dialogBox;
    if (!target) return;

    var opener = document.querySelector('.toolbar-search-btn');
    if (opener) opener.addEventListener('click', function (event) {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        target.focus();
    });

    if (dialogBox) dialog.addEventListener('click', function (event) {
        // A press on the backdrop lands on the dialog element itself.
        if (event.target === dialog || event.target.closest('[data-search-close]')) dialog.close();
    });

    function typing(node) {
        if (!node || !node.tagName) return false;
        var tag = node.tagName;
        return node.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    }
    document.addEventListener('keydown', function (event) {
        if (event.defaultPrevented || event.isComposing) return;
        var key = (event.key || '').toLowerCase();
        if (key === 'k' && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey) {
            event.preventDefault();
            target.focus();
        } else if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !typing(event.target)) {
            event.preventDefault();
            target.focus();
        }
    });
})();
