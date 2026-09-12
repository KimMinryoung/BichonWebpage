// Pairs the campaign map with the timeline list. Both are rendered server
// side and share ①②… numbers (data-geo-num), so without JavaScript the
// pairing already reads like an atlas plate; this only adds highlighting.
//
// Two strengths of highlight, because the timeline is long and the map
// scrolls away: hovering a numbered row lights its geometry while the pointer
// stays; CLICKING a row pins the highlight, so the reader can scroll back up
// to the map with number ⑨ still lit. Clicking the same row again, another
// row, or empty map unpins. Tapping a map badge pins and scrolls to its row.
(function () {
    'use strict';
    // Keep the full SVG (including its legend) reachable at every scale.
    // A fixed viewport uses native scrolling on both axes, including touch
    // and keyboard navigation, while the controls stay outside the scroller.
    document.querySelectorAll('.commu-event-map').forEach(function (figure) {
        var viewport = figure.querySelector('.commu-event-map-viewport');
        var svg = figure.querySelector('.emap-svg');
        var section = figure.closest('.commu-event-timeline');
        var tools = section && section.querySelector('.commu-event-map-tools');
        if (!viewport || !svg || !tools) return;
        var box = svg.viewBox.baseVal;
        if (!box.width || !box.height) return;
        var scale = 1;
        var maxZoom = 12;
        var zoomIn = tools.querySelector('[data-map-action="zoom-in"]');
        var zoomOut = tools.querySelector('[data-map-action="zoom-out"]');
        viewport.style.aspectRatio = box.width + ' / ' + box.height;
        viewport.tabIndex = 0;
        viewport.setAttribute('role', 'region');
        viewport.setAttribute('aria-label', svg.getAttribute('aria-label') || document.title);
        tools.hidden = false;

        function setScale(next) {
            next = Math.max(1, Math.min(maxZoom, next));
            var ratio = next / scale;
            var x = (viewport.scrollLeft + viewport.clientWidth / 2) * ratio - viewport.clientWidth / 2;
            var y = (viewport.scrollTop + viewport.clientHeight / 2) * ratio - viewport.clientHeight / 2;
            scale = next;
            svg.style.width = (scale * 100) + '%';
            svg.style.maxWidth = 'none';
            viewport.scrollLeft = x;
            viewport.scrollTop = y;
            zoomIn.disabled = scale >= maxZoom;
            zoomOut.disabled = scale <= 1;
        }

        tools.addEventListener('click', function (event) {
            var button = event.target.closest('[data-map-action]');
            if (!button || button.disabled) return;
            var action = button.getAttribute('data-map-action');
            if (action === 'zoom-in') setScale(scale / 0.72);
            else if (action === 'zoom-out') setScale(scale * 0.72);
            else if (action === 'reset') setScale(1);
        });
        setScale(1);
    });

    // Both maps of the page carry the numbered geometry — the orientation map
    // at the top and the campaign map in the timeline section — and they
    // highlight together.
    var svgs = Array.prototype.slice.call(
        document.querySelectorAll('.commu-event-map .emap-svg'));
    var rows = Array.prototype.slice.call(
        document.querySelectorAll('.commu-event-timeline-list > li[data-geo-num]'));
    if (!svgs.length || !rows.length) return;

    function shapes(num) {
        return svgs.reduce(function (all, svg) {
            return all.concat(Array.prototype.slice.call(
                svg.querySelectorAll('[data-geo-num="' + num + '"]')));
        }, []);
    }
    var shown = null;   // number currently lit
    var pinned = null;  // number held through mouseleave/scroll, or null

    // The pinned row wears the map badge's red so held ≠ hovered at a glance.
    function markPinned() {
        rows.forEach(function (row) {
            row.classList.toggle('is-map-pinned',
                row.getAttribute('data-geo-num') === String(pinned));
        });
    }

    function show(num) {
        if (shown === num) return;
        if (shown !== null) {
            shapes(shown).forEach(function (el) { el.classList.remove('is-active'); });
            rows.forEach(function (row) { row.classList.remove('is-map-active'); });
        }
        shown = num;
        svgs.forEach(function (svg) { svg.classList.toggle('has-active', num !== null); });
        if (num === null) return;
        shapes(num).forEach(function (el) { el.classList.add('is-active'); });
        rows.forEach(function (row) {
            if (row.getAttribute('data-geo-num') === String(num)) row.classList.add('is-map-active');
        });
    }

    rows.forEach(function (row) {
        var num = parseInt(row.getAttribute('data-geo-num'), 10);
        row.addEventListener('mouseenter', function () {
            if (pinned === null) show(num);
        });
        row.addEventListener('mouseleave', function () {
            if (pinned === null) show(null);
        });
        row.addEventListener('click', function (event) {
            if (event.target.closest('a')) return;
            pinned = pinned === num ? null : num;
            markPinned();
            show(num);          // unpinning keeps it lit — the pointer is still here
        });
    });

    svgs.forEach(function (svg) {
        svg.addEventListener('click', function (event) {
            var group = event.target.closest('[data-geo-num]');
            if (!group) {
                pinned = null;
                markPinned();
                show(null);
                return;
            }
            var num = parseInt(group.getAttribute('data-geo-num'), 10);
            pinned = num;
            markPinned();
            show(num);
            var row = rows.filter(function (r) {
                return r.getAttribute('data-geo-num') === String(num);
            })[0];
            if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
})();
