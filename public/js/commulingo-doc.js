// The reader's script (views/public/commulingo-doc.ejs). Loaded synchronously
// at the top of <main class="book">, because its first job must run before
// the page renders:
//
// 1. Anchor hop. On a paged document an anchor may live on another page; the
//    page carries the id → page map (#doc-page-map) and a reader arriving
//    at the wrong page is sent to the right one before any scrolling.
//
// Everything else waits for the DOM:
//
// 2. Footnote popover. A note number (a.note-ref) shows its note in a
//    popover instead of sending the reader to the notes section — on a paged
//    document that section is another page away, and even on one page the
//    jump and the ↩ back lose the place. Hover previews; a tap or click
//    pins; the popover's own link is the old jump to the notes list, and the
//    note's ↩ then comes back here with history.back() so a second reference
//    ([3] called twice) returns to the reference actually followed. The
//    note's text comes from the page's own notes list when it is there, else
//    from the hidden template the server prints for the notes this page
//    calls from other pages (docs-store pageNotes). Without script the
//    numbers stay plain links. Fictionalized names (a.fic-name,
//    data-real="실명", translated fiction) get the same popover naming the
//    historical figure. One popover at a time; Esc, a tap outside or a
//    second tap closes a pinned one. The popover is inserted after its
//    anchor, so keyboard focus moves from the anchor into its link.
//
// 3. Contents panel: collapses when an entry is picked, synchronously in the
//    click, so the sticky bar shrinks before the browser resolves the
//    fragment and the heading lands where expected.
//
// 4. Translation ↔ original switch: goes to the section being read — the
//    last heading passed (see currentHeading) that the other version also
//    has (the link's data-anchors: id → page there).
//
// 5. Reading position (이어 읽기). While the reader scrolls, the page and
//    the last heading passed are kept in localStorage per document; a later
//    plain visit (no page, anchor or search in the address) offers to continue
//    from there, and reaching the end of the last page forgets it. The
//    library list marks the documents being read (commulingo-docs-list.js).
//    Per browser only: nothing is sent anywhere.
//
// 6. Sharing. The bar's 공유 button copies the document's address; the
//    strip it opens offers to pick one paragraph instead. Each paragraph,
//    list item and quotation carries a stored id (p-N, doc-structure.js
//    freezeBlockIds); the one tapped is copied as …/docs/<id>?at=p-N, which
//    the route sends to the page holding it, so the link survives a
//    repagination. Picking is on for one tap only.
(function () {
    var book = document.querySelector('main.book');
    if (!book) return;
    var strings = {};
    try { strings = JSON.parse(book.getAttribute('data-doc-strings') || '{}'); } catch (e) { /* defaults below */ }
    var fill = function (template, values) {
        return String(template || '').replace(/\{(\w+)\}/g, function (all, key) { return values[key] !== undefined ? values[key] : all; });
    };
    var pageOf = function (search) {
        var m = /[?&]p=(\d+)/.exec(search || window.location.search);
        return m ? Number(m[1]) : 1;
    };

    // ---- 1. anchor hop (now, before the body renders) ----

    (function hop() {
        var map = document.getElementById('doc-page-map');
        if (!map) return;
        var pages = {};
        try { pages = JSON.parse(map.textContent || '{}'); } catch (e) { return; }
        var hash = window.location.hash.slice(1);
        if (hash && Object.prototype.hasOwnProperty.call(pages, hash) && pages[hash] !== pageOf()) {
            window.location.replace('?p=' + pages[hash] + '#' + hash);
        }
    })();

    // The heading being read: the last one whose top is under the sticky bar
    // — or where an anchor arrival lands it, just below the bar at its scroll
    // margin (3rem, the bar being 36px), so the section a reader just jumped
    // to counts as the one being read, not the one before it (2026-11-04).
    function currentHeading(heads) {
        if (!heads.length) return null;
        var bar = document.querySelector('.doc-toc');
        var margin = parseFloat(getComputedStyle(heads[0]).scrollMarginTop) || 0;
        var line = Math.max((bar ? bar.getBoundingClientRect().bottom : 0) + 8, margin + 2);
        var current = null;
        heads.forEach(function (h) { if (h.getBoundingClientRect().top <= line) current = h; });
        return current;
    }
    function headingsOf(filter) {
        return Array.prototype.filter.call(document.querySelectorAll('.book h1[id], .book h2[id], .book h3[id]'), filter || function () { return true; });
    }
    function headingText(h) {
        var copy = h.cloneNode(true);
        var refs = copy.querySelectorAll('.note-ref');
        for (var i = 0; i < refs.length; i++) refs[i].remove();
        return copy.textContent.replace(/\s+/g, ' ').trim();
    }

    // ---- 2. popovers ----

    function popovers() {
        var JUMP_KEY = 'commulingo-doc-note-jump';
        var open = null;
        var pinned = false;
        var closeTimer = null;

        function cancelClose() {
            if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
        }
        function close() {
            cancelClose();
            if (!open) return;
            open.anchor.removeAttribute('aria-expanded');
            open.el.remove();
            open = null;
            pinned = false;
        }
        function scheduleClose() {
            if (pinned) return;
            cancelClose();
            closeTimer = setTimeout(close, 220);
        }

        function noteId(ref) {
            var href = ref.getAttribute('href') || '';
            var hash = href.indexOf('#');
            return hash >= 0 ? decodeURIComponent(href.slice(hash + 1)) : '';
        }
        function noteElement(id) {
            if (!id) return null;
            var onPage = document.getElementById(id);
            if (onPage && onPage.closest('.notes-list')) return onPage;
            var inline = document.querySelector('template.doc-notes-inline');
            if (!inline) return null;
            var items = inline.content.querySelectorAll('li[id]');
            for (var i = 0; i < items.length; i++) if (items[i].id === id) return items[i];
            return null;
        }
        function noteContent(ref) {
            var li = noteElement(noteId(ref));
            if (!li) return null;
            var frag = document.createDocumentFragment();
            var label = document.createElement('span');
            label.className = 'doc-pop-label';
            var kind = li.getAttribute('data-note-kind');
            var kinds = strings.noteKinds || {};
            label.textContent = fill((kind && kinds[kind]) || strings.note || '{n}', { n: li.getAttribute('data-note') || ref.textContent.replace(/^[[(](.*)[\])]$/, '$1').trim() });
            frag.appendChild(label);
            var body = document.createElement('span');
            body.className = 'doc-pop-body';
            var copy = li.cloneNode(true);
            var backs = copy.querySelectorAll('.back-link');
            for (var i = 0; i < backs.length; i++) backs[i].remove();
            while (copy.firstChild) body.appendChild(copy.firstChild);
            frag.appendChild(body);
            var jump = document.createElement('a');
            jump.className = 'doc-pop-jump';
            jump.href = ref.getAttribute('href');
            jump.textContent = strings.seeInNotes || '→';
            jump.addEventListener('click', function () {
                // Remembered for the note's ↩: it comes back here, not to the first reference.
                try { sessionStorage.setItem(JUMP_KEY, JSON.stringify({ note: noteId(ref), ref: ref.id, at: Date.now() })); } catch (e) { /* private mode */ }
            });
            frag.appendChild(jump);
            return { nodes: frag, kind: 'note' };
        }
        function nameContent(name) {
            var frag = document.createDocumentFragment();
            var label = document.createElement('span');
            label.className = 'doc-pop-label';
            label.textContent = strings.historicalFigure || '';
            frag.appendChild(label);
            var real = name.getAttribute('data-real') || '';
            var href = name.getAttribute('href');
            if (href) {
                var link = document.createElement('a');
                link.href = href;
                link.target = '_blank';
                link.rel = 'noopener';
                link.textContent = real + ' →';
                frag.appendChild(link);
            } else {
                frag.appendChild(document.createTextNode(real));
            }
            return { nodes: frag, kind: 'name' };
        }
        function anchorOf(target) {
            var el = target.closest && target.closest('a.note-ref, a.fic-name');
            return el && book.contains(el) ? el : null;
        }
        function contentFor(anchor) {
            return anchor.classList.contains('note-ref') ? noteContent(anchor) : nameContent(anchor);
        }
        function show(anchor, given) {
            if (open && open.anchor === anchor) return true;
            var content = given || contentFor(anchor);
            if (!content) return false;
            close();
            var pop = document.createElement('span');
            pop.className = 'doc-pop doc-pop-' + content.kind;
            pop.appendChild(content.nodes);
            pop.addEventListener('mouseenter', cancelClose);
            pop.addEventListener('mouseleave', scheduleClose);
            anchor.insertAdjacentElement('afterend', pop);
            // A hover preview of a link is not a control the link opens.
            if (!given) anchor.setAttribute('aria-expanded', 'true');
            open = { el: pop, anchor: anchor };
            place(pop, anchor);
            return true;
        }
        function place(pop, anchor) {
            var parent = pop.offsetParent || document.body;
            var base = parent.getBoundingClientRect();
            var rect = anchor.getBoundingClientRect();
            var width = pop.offsetWidth;
            var viewport = document.documentElement.clientWidth;
            var left = rect.left;
            if (left + width > viewport - 12) left = Math.max(12, viewport - 12 - width);
            pop.style.left = (left - base.left) + 'px';
            pop.style.top = (rect.bottom - base.top + 6) + 'px';
        }

        document.addEventListener('mouseover', function (event) {
            var anchor = anchorOf(event.target);
            if (!anchor) return;
            cancelClose();
            show(anchor);
        });
        document.addEventListener('mouseout', function (event) {
            var anchor = anchorOf(event.target);
            if (anchor && open && open.anchor === anchor) scheduleClose();
        });
        document.addEventListener('focusin', function (event) {
            var anchor = anchorOf(event.target);
            if (anchor) { cancelClose(); show(anchor); }
        });
        document.addEventListener('focusout', function (event) {
            if (!open || pinned) return;
            var next = event.relatedTarget;
            if (next && (open.el.contains(next) || next === open.anchor)) return;
            scheduleClose();
        });
        document.addEventListener('click', function (event) {
            var anchor = anchorOf(event.target);
            if (!anchor) {
                if (open && !open.el.contains(event.target)) close();
                return;
            }
            // The number is a link; a pin needs a popover with content, else the link works as ever.
            if (open && open.anchor === anchor) {
                event.preventDefault();
                if (pinned) close(); else pinned = true;
                return;
            }
            if (show(anchor)) {
                event.preventDefault();
                pinned = true;
            }
        });
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && open) {
                var anchor = open.anchor;
                close();
                anchor.focus();
            }
        });
        window.addEventListener('resize', function () { if (open) place(open.el, open.anchor); });

        // Person and event links: with a mouse, resting on one shows its name,
        // years and one line (GET /commulingo/api/preview/<kind>/<id>). The link
        // still opens the page as before; touch screens get nothing yet
        // (owner, 2026-11-28: the phone behaviour is decided later).
        var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (canHover) {
            var previews = {};
            var hovered = null;
            var hoverTimer = null;
            var prefix = /^\/en\//.test(window.location.pathname) ? '/en' : '';
            var entityOf = function (target) {
                var el = target.closest && target.closest('a.commu-person-link, a.commu-event-link');
                return el && book.contains(el) ? el : null;
            };
            var previewKey = function (a) {
                var m = (a.getAttribute('href') || '').match(/^(?:\/en)?\/commulingo\/(people|events)\/([a-z0-9-]+)/);
                return m ? (m[1] === 'people' ? 'person' : 'event') + '/' + m[2] : null;
            };
            var loadPreview = function (key) {
                if (!previews[key]) {
                    previews[key] = fetch(prefix + '/commulingo/api/preview/' + key, { headers: { Accept: 'application/json' } })
                        .then(function (r) { return r.ok ? r.json() : null; })
                        .catch(function () { return null; });
                }
                return previews[key];
            };
            var previewContent = function (data) {
                var frag = document.createDocumentFragment();
                var head = document.createElement('span');
                head.className = 'doc-pop-head';
                var title = document.createElement('strong');
                title.textContent = data.title || '';
                head.appendChild(title);
                if (data.meta) {
                    var meta = document.createElement('span');
                    meta.className = 'doc-pop-meta';
                    meta.textContent = data.meta;
                    head.appendChild(meta);
                }
                frag.appendChild(head);
                if (data.text) {
                    var text = document.createElement('span');
                    text.className = 'doc-pop-body';
                    text.textContent = data.text;
                    frag.appendChild(text);
                }
                return { nodes: frag, kind: 'entity' };
            };
            document.addEventListener('mouseover', function (event) {
                var a = entityOf(event.target);
                if (!a || hovered === a) return;
                hovered = a;
                if (open && open.anchor === a) { cancelClose(); return; }
                if (pinned) return;
                var key = previewKey(a);
                if (!key) return;
                clearTimeout(hoverTimer);
                hoverTimer = setTimeout(function () {
                    loadPreview(key).then(function (data) {
                        if (!data || hovered !== a || pinned) return;
                        cancelClose();
                        show(a, previewContent(data));
                    });
                }, 300);
            });
            document.addEventListener('mouseout', function (event) {
                var a = entityOf(event.target);
                if (!a || (event.relatedTarget && a.contains(event.relatedTarget))) return;
                hovered = null;
                clearTimeout(hoverTimer);
                if (open && open.anchor === a) scheduleClose();
            });
        }

        // The note's ↩ after a jump from the popover.
        document.addEventListener('click', function (event) {
            var back = event.target.closest && event.target.closest('a.back-link');
            if (!back || !book.contains(back)) return;
            var li = back.closest('li[id]');
            var jump = null;
            try { jump = JSON.parse(sessionStorage.getItem(JUMP_KEY) || 'null'); } catch (e) { /* none */ }
            if (!jump || !li || jump.note !== li.id || Date.now() - jump.at > 30 * 60 * 1000 || window.history.length < 2) return;
            event.preventDefault();
            try { sessionStorage.removeItem(JUMP_KEY); } catch (e) { /* none */ }
            window.history.back();
        });
    }

    // ---- 3. contents panel ----

    function contentsPanel() {
        var details = document.querySelector('.doc-toc-nav details');
        if (!details) return;
        details.addEventListener('click', function (event) {
            var link = event.target.closest('a[href^="#"]');
            if (link) details.open = false;
        });
    }

    // ---- 3b. full title ----
    // On a phone the bar's title cell keeps only a few characters beside the
    // home and references links and the contents/search/original buttons.
    // When the title is cut off, tapping it opens the whole title in a strip
    // under the bar; tapping it again closes the strip.

    function fullTitle() {
        var bar = document.querySelector('.doc-toc');
        var title = bar && bar.querySelector('.commu-crumb-current');
        if (!title) return;
        var strip = null;
        function clipped() { return title.scrollWidth > title.clientWidth + 1; }
        function sync() {
            var can = !!strip || clipped();
            title.classList.toggle('is-expandable', can);
            if (can) {
                title.setAttribute('role', 'button');
                title.setAttribute('tabindex', '0');
                title.setAttribute('aria-expanded', strip ? 'true' : 'false');
            } else {
                title.removeAttribute('role');
                title.removeAttribute('tabindex');
                title.removeAttribute('aria-expanded');
            }
        }
        function toggle() {
            if (strip) {
                strip.remove();
                strip = null;
            } else {
                if (!clipped()) return;
                strip = document.createElement('div');
                strip.className = 'doc-title-full';
                strip.textContent = title.textContent;
                strip.addEventListener('click', toggle);
                bar.appendChild(strip);
            }
            sync();
        }
        title.addEventListener('click', toggle);
        title.addEventListener('keydown', function (event) {
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            toggle();
        });
        window.addEventListener('resize', sync);
        sync();
    }

    // ---- 4. version switch ----

    function versionSwitch() {
        var link = document.querySelector('.doc-version-switch');
        if (!link) return;
        var anchors = {};
        try { anchors = JSON.parse(link.getAttribute('data-anchors') || '{}'); } catch (e) { /* no shared sections */ }
        link.addEventListener('click', function () {
            var heads = headingsOf(function (h) { return anchors[h.id]; });
            if (!heads.length) return;
            var current = currentHeading(heads);
            // Above the first section of page 1 the reader is at the
            // document's head: the other version's top is the right place.
            // Further pages open on their first section.
            if (!current) {
                if (pageOf() === 1) {
                    var top = new URL(link.href);
                    top.searchParams.delete('p');
                    top.hash = '';
                    link.href = top.href;
                    return;
                }
                current = heads[0];
            }
            var target = new URL(link.href);
            var page = anchors[current.id];
            if (page > 1) target.searchParams.set('p', page); else target.searchParams.delete('p');
            target.hash = current.id;
            link.href = target.href;
        });
    }

    // ---- 5. reading position ----

    function readingPosition() {
        var bar = document.querySelector('[data-doc-resume]');
        if (!bar) return;
        var KEY = 'commulingo-doc-reading:' + window.location.pathname;
        var page = pageOf();
        var lastPage = Number(bar.getAttribute('data-last-page')) || 1;
        var store = {
            read: function () { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } },
            write: function (value) { try { localStorage.setItem(KEY, JSON.stringify(value)); } catch (e) { /* storage off */ } },
            clear: function () { try { localStorage.removeItem(KEY); } catch (e) { /* storage off */ } },
        };
        var heads = headingsOf(function (h) { return !h.closest('section.notes'); });

        // The offer, on a plain visit only: an address with a page, anchor or
        // search already says where the reader wants to be.
        var plain = !window.location.hash && !/[?&](?:p|q|hit)=/.test(window.location.search);
        var saved = store.read();
        if (plain && saved && !saved.dismissed && (saved.page > 1 || saved.anchor) && saved.at > Date.now() - 180 * 24 * 3600 * 1000) {
            var link = bar.querySelector('.doc-resume-link');
            var text = saved.heading && saved.page > 1 ? fill(strings.resume, { page: saved.page, heading: saved.heading })
                : saved.heading ? fill(strings.resumeHeading, { heading: saved.heading })
                : fill(strings.resumePage, { page: saved.page });
            link.textContent = text;
            link.href = (saved.page > 1 ? '?p=' + saved.page : (window.location.pathname)) + (saved.anchor ? '#' + saved.anchor : '');
            bar.hidden = false;
            var dismiss = bar.querySelector('.doc-resume-dismiss');
            if (dismiss) dismiss.addEventListener('click', function () {
                bar.hidden = true;
                store.write(Object.assign({}, saved, { dismissed: true }));
            });
        }

        // Recording: after the reader scrolls, the page and the last heading
        // passed; the end of the last page forgets the document.
        var scrolled = false;
        var last = null;
        function record() {
            var root = document.documentElement;
            if (page === lastPage && window.scrollY + window.innerHeight >= root.scrollHeight - 120) {
                store.clear();
                last = 'done';
                return;
            }
            var current = currentHeading(heads);
            var key = page + ':' + (current ? current.id : '');
            if (key === last) return;
            last = key;
            store.write({ page: page, anchor: current ? current.id : '', heading: current ? headingText(current) : '', at: Date.now() });
        }
        var ticking = false;
        window.addEventListener('scroll', function () {
            scrolled = true;
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(function () { ticking = false; record(); });
        }, { passive: true });
        window.addEventListener('pagehide', function () { if (scrolled) record(); });
    }

    // ---- 6. sharing ----
    // The bar's 공유 button copies the document's own address (no page, no
    // anchor). The strip that says so under the bar offers 「문단 골라 공유」:
    // then every paragraph and heading (and each contents entry) becomes the
    // button, the one tapped is copied as …/docs/<id>?at=<its id> and
    // sharing turns off again. ✕, 공유 again or Esc
    // closes the strip.

    function sharing() {
        var toggle = document.querySelector('.doc-share');
        var article = book.querySelector('article');
        var bar = document.querySelector('.doc-toc');
        if (!toggle || !bar) return;
        var PARA = /^p-\d+$/;
        var root = document.documentElement;
        var strip = null;
        var closeTimer = null;

        function paragraphOf(node) {
            var start = node && node.nodeType === 1 ? node : node && node.parentElement;
            if (!article || !start || !article.contains(start) || start.closest('.notes-list, .doc-toc, aside.doc-editorial')) return null;
            for (var el = start; el && el !== article; el = el.parentElement) {
                if (/^(P|LI|BLOCKQUOTE)$/.test(el.tagName) && PARA.test(el.id)) return el;
                if (/^H[1-3]$/.test(el.tagName) && el.id) return el;
            }
            return null;
        }
        function linkTo(id) {
            return window.location.origin + window.location.pathname + '?at=' + encodeURIComponent(id);
        }
        function picked(id) {
            copy(linkTo(id), function () {
                root.classList.remove('doc-sharing');
                show(strings.paragraphLinkCopied || '링크를 복사했습니다', [], 1600);
            });
        }
        function button(text, action) {
            var b = document.createElement('button');
            b.type = 'button';
            b.textContent = text;
            b.addEventListener('click', action);
            return b;
        }
        // The strip: a message, then optional actions and ✕.
        function show(text, actions, autoClose) {
            if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            if (!strip) {
                strip = document.createElement('div');
                strip.className = 'doc-share-strip';
                bar.appendChild(strip);
            }
            strip.textContent = '';
            var message = document.createElement('span');
            message.setAttribute('role', 'status');
            message.textContent = text;
            strip.appendChild(message);
            (actions || []).forEach(function (b) { strip.appendChild(b); });
            var x = button('✕', close);
            x.setAttribute('aria-label', strings.shareClose || '닫기');
            strip.appendChild(x);
            toggle.setAttribute('aria-expanded', 'true');
            if (autoClose) closeTimer = setTimeout(close, autoClose);
        }
        function close() {
            if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
            root.classList.remove('doc-sharing');
            toggle.setAttribute('aria-expanded', 'false');
            if (strip) { strip.remove(); strip = null; }
        }
        function copy(url, then) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(then, function () { close(); window.prompt(strings.shareLink || '링크', url); });
            } else {
                close();
                window.prompt(strings.shareLink || '링크', url);
            }
        }
        function pickParagraph() {
            root.classList.add('doc-sharing');
            show(strings.shareHint || '공유할 문단을 누르세요');
        }
        toggle.addEventListener('click', function () {
            if (strip) { close(); return; }
            copy(window.location.origin + window.location.pathname, function () {
                show(strings.docLinkCopied || '문헌 링크를 복사했습니다',
                    article ? [button(strings.sharePickParagraph || '문단 골라 공유', pickParagraph)] : []);
            });
        });
        // Capture, so a link, note number or name inside the paragraph does
        // not go anywhere while picking: the paragraph is the target.
        if (article) article.addEventListener('click', function (event) {
            if (!root.classList.contains('doc-sharing')) return;
            var para = paragraphOf(event.target);
            if (!para) return;
            event.preventDefault();
            event.stopPropagation();
            picked(para.id);
        }, true);
        // A contents entry while picking: its section's link instead of the
        // jump (capture, before the panel's own click handler).
        document.addEventListener('click', function (event) {
            if (!root.classList.contains('doc-sharing')) return;
            var entry = event.target.closest && event.target.closest('.doc-toc-nav a[href*="#"]');
            if (!entry) return;
            event.preventDefault();
            event.stopPropagation();
            var details = entry.closest('details');
            if (details) details.open = false;
            picked(decodeURIComponent(entry.getAttribute('href').split('#')[1]));
        }, true);
        document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && strip) close(); });
    }

    function ready() {
        popovers();
        contentsPanel();
        fullTitle();
        versionSwitch();
        readingPosition();
        sharing();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
    else ready();
})();
