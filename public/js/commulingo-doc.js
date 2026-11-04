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
            label.textContent = fill(strings.note || '{n}', { n: li.getAttribute('data-note') || ref.textContent.replace(/^[[(](.*)[\])]$/, '$1').trim() });
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
        function show(anchor) {
            if (open && open.anchor === anchor) return true;
            var content = contentFor(anchor);
            if (!content) return false;
            close();
            var pop = document.createElement('span');
            pop.className = 'doc-pop doc-pop-' + content.kind;
            pop.appendChild(content.nodes);
            pop.addEventListener('mouseenter', cancelClose);
            pop.addEventListener('mouseleave', scheduleClose);
            anchor.insertAdjacentElement('afterend', pop);
            anchor.setAttribute('aria-expanded', 'true');
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

    function ready() {
        popovers();
        contentsPanel();
        versionSwitch();
        readingPosition();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
    else ready();
})();
