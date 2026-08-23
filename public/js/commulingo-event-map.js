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
    var svg = document.querySelector('.commu-event-timeline-map .emap-svg');
    if (!svg) return;
    var rows = Array.prototype.slice.call(
        document.querySelectorAll('.commu-event-timeline-list > li[data-geo-num]'));
    if (!rows.length) return;

    function shapes(num) {
        return Array.prototype.slice.call(
            svg.querySelectorAll('[data-geo-num="' + num + '"]'));
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
        svg.classList.toggle('has-active', num !== null);
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
})();
