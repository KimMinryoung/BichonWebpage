// Hover previews for the dictionary links in any page's text (loaded by
// partials/head site-wide and by the reference reader, 2026-11-28): with a mouse, resting on a person, event or
// term link shows its name, years and one line in a box under the link —
// GET /commulingo/api/preview/<person|event|term>/<id>. The link still opens
// its page. Touch screens get nothing yet (owner, 2026-11-28: the phone
// behaviour is decided later). While the box is in use the link's title (the
// browser's own tooltip, 「이름: 소개」) is taken off, so the two never stack;
// a link with no preview gets it back.
(function () {
    'use strict';
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (!window.fetch) return;

    var SELECTOR = 'a.commu-person-link, a.commu-event-link, a.commu-term-link';
    var KINDS = { people: 'person', events: 'event', terms: 'term' };
    var prefix = /^\/en\//.test(window.location.pathname) ? '/en' : '';
    var previews = {};
    var hovered = null;
    var hoverTimer = null;
    var closeTimer = null;
    var open = null; // { el, anchor }

    function linkOf(target) {
        var el = target && target.closest ? target.closest(SELECTOR) : null;
        // Text links anywhere but the site's menus and the box itself.
        return el && !el.closest('.home-toolbar, .link-pop') ? el : null;
    }
    function keyOf(a) {
        var m = (a.getAttribute('href') || '').match(/^(?:https?:\/\/[^/]+)?(?:\/en)?\/commulingo\/(people|events|terms)\/([a-z0-9-]+)/);
        return m ? KINDS[m[1]] + '/' + m[2] : null;
    }
    function load(key) {
        if (!previews[key]) {
            previews[key] = fetch(prefix + '/commulingo/api/preview/' + key, { headers: { Accept: 'application/json' } })
                .then(function (r) { return r.ok ? r.json() : null; })
                .catch(function () { return null; });
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

    function box(data) {
        var pop = document.createElement('div');
        pop.className = 'link-pop';
        pop.setAttribute('role', 'tooltip');
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
        pop.addEventListener('mouseenter', cancelClose);
        pop.addEventListener('mouseleave', scheduleClose);
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
    function show(anchor, data, x, y) {
        close();
        var pop = box(data);
        document.body.appendChild(pop);
        place(pop, anchor, x, y);
        open = { el: pop, anchor: anchor };
    }

    document.addEventListener('mouseover', function (event) {
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
        var a = linkOf(event.target);
        if (!a || (event.relatedTarget && a.contains(event.relatedTarget))) return;
        hovered = null;
        clearTimeout(hoverTimer);
        if (open && open.anchor === a) scheduleClose();
    });
    // A click opens the page (a new tab, mostly): the box goes with it.
    document.addEventListener('click', close);
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') close(); });
    window.addEventListener('scroll', close, { passive: true });
})();
