// Reader popovers (views/public/commulingo-doc.ejs).
//
// Footnotes: a note number (a.note-ref) shows its note in a popover instead
// of sending the reader to the notes section — on a paged document that
// section is another page away, and even on one page the jump and the ↩ back
// lose the place. Hover previews; a tap or click pins; the popover's own link
// is the old jump to the notes list, and the note's ↩ then comes back here
// with history.back() so a second reference ([3] called twice) returns to the
// reference actually followed. The note's text comes from the page's own
// notes list when it is there, else from the hidden template the server
// prints for the notes this page calls from other pages (docs-store
// pageNotes). Without script the numbers stay plain links.
//
// Fictionalized names (a.fic-name, data-real="실명", translated fiction): the
// same popover names the historical figure, with a link to the person page.
// The names carry no decoration (hundreds a page); the popover is the
// affordance.
//
// One popover at a time; Esc, a tap outside or a second tap closes a pinned
// one. The popover is inserted after its anchor, so keyboard focus moves from
// the anchor into the popover's link.
(function () {
    var book = document.querySelector('main.book');
    if (!book) return;
    var strings = {};
    try { strings = JSON.parse(book.getAttribute('data-doc-strings') || '{}'); } catch (e) { /* defaults below */ }
    var fill = function (template, n) { return String(template || '{n}').replace('{n}', n); };
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

    // ---- content ----

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
        label.textContent = fill(strings.note, li.getAttribute('data-note') || ref.textContent.replace(/^[[(](.*)[\])]$/, '$1').trim());
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

    // ---- placing ----

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

    // ---- events ----

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

    // ---- the note's ↩ after a jump from the popover ----

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
})();
