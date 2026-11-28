// Hover previews for the dictionary and reference-library links in any page's text (loaded by
// partials/head site-wide and by the reference reader, 2026-11-28): with a mouse, resting on a person, event,
// term or reference-library link shows its name, years and one line in a box under the link —
// GET /commulingo/api/preview/<person|event|term>/<id>. The link still opens
// its page. While the box is in use the link's title (the browser's own
// tooltip, 「이름: 소개」) is taken off, so the two never stack; a link with no
// preview gets it back.
//
// Touch (owner, 2026-11-28): a tap on the link shows the box instead of
// opening; the whole box is the button that opens the page, and a tap
// anywhere else only closes it. A long press is left to the browser, whose
// menu (new tab, copy link) the owner wants kept. Opening from the box goes the
// way the link itself would: a new tab where the surface stamped
// target="_blank" (courses, events, chat — linkify.js SURFACES.newTab, so a
// lesson or a long event page is not lost), the same tab elsewhere (moving
// between dictionary pages).
(function () {
    'use strict';
    if (!window.fetch) return;
    var hoverable = !!(window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches);

    var SELECTOR = 'a.commu-person-link, a.commu-event-link, a.commu-term-link, a.commu-doc-link';
    var KINDS = { people: 'person', events: 'event', terms: 'term', docs: 'doc' };
    var prefix = /^\/en\//.test(window.location.pathname) ? '/en' : '';
    var previews = {};
    var known = {}; // key -> preview data or null, once loaded
    var touching = false; // the last pointer was a finger or pen
    var pendingTap = null; // the link a tap is loading a box for
    var hovered = null;
    var hoverTimer = null;
    var closeTimer = null;
    var open = null; // { el, anchor }

    // Only the text linkers stamp these classes (linkify.js,
    // doc-presentation.js, commulingo-decision.js), never a menu, so the
    // class is the whole test.
    function linkOf(target) {
        return target && target.closest ? target.closest(SELECTOR) : null;
    }
    function keyOf(a) {
        var m = (a.getAttribute('href') || '').match(/^(?:https?:\/\/[^/]+)?(?:\/en)?\/commulingo\/(people|events|terms|docs)\/([a-z0-9-]+)/);
        return m ? KINDS[m[1]] + '/' + m[2] : null;
    }
    function load(key) {
        if (!previews[key]) {
            previews[key] = fetch(prefix + '/commulingo/api/preview/' + key, { headers: { Accept: 'application/json' } })
                .then(function (r) { return r.ok ? r.json() : null; })
                .catch(function () { return null; })
                .then(function (data) { known[key] = data; return data; });
        }
        return previews[key];
    }
    function hideTitle(a) {
        if (!a.hasAttribute('title')) return;
        a.setAttribute('data-preview-title', a.getAttribute('title'));
        a.removeAttribute('title');
    }
    function restoreTitle(a) {
        var title = a.getAttribute('data-preview-title');
        if (title === null) return;
        a.setAttribute('title', title);
        a.removeAttribute('data-preview-title');
    }

    function cancelClose() {
        if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    }
    function close() {
        cancelClose();
        if (!open) return;
        open.el.remove();
        open = null;
    }
    function scheduleClose() {
        cancelClose();
        closeTimer = setTimeout(close, 220);
    }

    // Where the link would have gone, the way it would have gone there.
    function follow(a) {
        if (a.target === '_blank') window.open(a.href, '_blank', 'noopener');
        else window.location.assign(a.href);
    }

    function box(data, tapAnchor) {
        var pop = document.createElement('div');
        pop.className = 'link-pop' + (tapAnchor ? ' is-tap' : '');
        pop.setAttribute('role', tapAnchor ? 'link' : 'tooltip');
        var head = document.createElement('div');
        head.className = 'link-pop-head';
        var title = document.createElement('strong');
        title.textContent = data.title || '';
        head.appendChild(title);
        if (data.meta) {
            var meta = document.createElement('span');
            meta.className = 'link-pop-meta';
            meta.textContent = data.meta;
            head.appendChild(meta);
        }
        pop.appendChild(head);
        if (data.text) {
            var text = document.createElement('div');
            text.className = 'link-pop-body';
            text.textContent = data.text;
            pop.appendChild(text);
        }
        if (tapAnchor) {
            var go = document.createElement('div');
            go.className = 'link-pop-open';
            go.textContent = prefix ? 'Open →' : '열기 →';
            pop.appendChild(go);
            pop.addEventListener('click', function (event) {
                event.preventDefault();
                close();
                follow(tapAnchor);
            });
        } else {
            pop.addEventListener('mouseenter', cancelClose);
            pop.addEventListener('mouseleave', scheduleClose);
        }
        return pop;
    }
    // Under the line the pointer is on (a link broken over two lines has two
    // boxes), kept inside the viewport.
    function place(pop, anchor, x, y) {
        var rects = anchor.getClientRects();
        var rect = rects[0];
        for (var i = 0; i < rects.length; i++) {
            if (y >= rects[i].top && y <= rects[i].bottom) { rect = rects[i]; break; }
        }
        if (!rect) return;
        var viewport = document.documentElement.clientWidth;
        var width = pop.offsetWidth;
        var left = Math.min(Math.max(12, rect.left), viewport - 12 - width);
        pop.style.left = (left + window.scrollX) + 'px';
        pop.style.top = (rect.bottom + window.scrollY + 6) + 'px';
    }
    function show(anchor, data, x, y, tap) {
        close();
        var pop = box(data, tap ? anchor : null);
        document.body.appendChild(pop);
        place(pop, anchor, x, y);
        open = { el: pop, anchor: anchor, tap: !!tap };
    }

    // ---- touch: tap shows, the box opens ----
    function notePointer(event) { touching = event.pointerType === 'touch' || event.pointerType === 'pen'; }
    if (window.PointerEvent) {
        document.addEventListener('pointerdown', notePointer, true);
    } else {
        document.addEventListener('touchstart', function () { touching = true; }, { capture: true, passive: true });
        document.addEventListener('mousedown', function () { touching = false; }, true);
    }
    // While a tapped box is open, a tap outside it (and off another previewed
    // link) only closes it: capture on window, before anything on the page acts.
    window.addEventListener('click', function (event) {
        if (!open || !open.tap) return;
        if (open.el.contains(event.target)) return;
        var a = linkOf(event.target);
        if (a && keyOf(a)) return;
        event.preventDefault();
        event.stopPropagation();
        close();
    }, true);
    // Bubble phase, so a page's own capture handler (the reader's paragraph
    // picker) that already took the tap wins.
    document.addEventListener('click', function (event) {
        if (!touching || event.defaultPrevented) return;
        var a = linkOf(event.target);
        if (!a) return;
        var key = keyOf(a);
        if (!key || known[key] === null) return; // no box: the link opens as ever
        event.preventDefault();
        if (open && open.anchor === a) { close(); follow(a); return; } // tapped again
        var x = event.clientX;
        var y = event.clientY;
        clearTimeout(hoverTimer);
        pendingTap = a;
        hideTitle(a);
        load(key).then(function (data) {
            if (pendingTap !== a) return;
            pendingTap = null;
            if (!data) { restoreTitle(a); follow(a); return; }
            show(a, data, x, y, true);
        });
    });

    // ---- mouse: rest on the link ----
    document.addEventListener('mouseover', function (event) {
        if (!hoverable || touching) return; // a tap's emulated mouseover
        var a = linkOf(event.target);
        if (!a || hovered === a) return;
        hovered = a;
        if (open && open.anchor === a) { cancelClose(); return; }
        var key = keyOf(a);
        if (!key) return;
        hideTitle(a);
        var x = event.clientX;
        var y = event.clientY;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () {
            load(key).then(function (data) {
                if (!data) { restoreTitle(a); return; }
                if (hovered !== a) return;
                cancelClose();
                show(a, data, x, y);
            });
        }, 300);
    });
    document.addEventListener('mouseout', function (event) {
        if (!hoverable) return;
        var a = linkOf(event.target);
        if (!a || (event.relatedTarget && a.contains(event.relatedTarget))) return;
        hovered = null;
        clearTimeout(hoverTimer);
        if (open && open.anchor === a) scheduleClose();
    });
    // A click opens the page (a new tab, mostly): the box goes with it.
    document.addEventListener('click', function () { if (open && !open.tap) close(); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });
    window.addEventListener('scroll', function () { pendingTap = null; close(); }, { passive: true });
})();
