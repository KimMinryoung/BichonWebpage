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
        // Zooming in enlarges the whole SVG inside the scroller; zooming out
        // widens the nested map's viewBox into the surround the server drew
        // round the frame (data-surround), so the inset, legend and border
        // keep their places.
        var world = svg.querySelector('.emap-world');
        var surround = (svg.getAttribute('data-surround') || '').split(' ').map(Number);
        var minZoom = world && surround.length === 4 && surround[2] > 0 && surround[3] > 0
            ? Math.max(box.width / surround[2], box.height / surround[3]) : 1;
        var zoomIn = tools.querySelector('[data-map-action="zoom-in"]');
        var zoomOut = tools.querySelector('[data-map-action="zoom-out"]');
        viewport.style.aspectRatio = box.width + ' / ' + box.height;
        viewport.tabIndex = 0;
        viewport.setAttribute('role', 'region');
        viewport.setAttribute('aria-label', svg.getAttribute('aria-label') || document.title);
        tools.hidden = false;

        function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }

        function setScale(next) {
            next = clamp(next, minZoom, maxZoom);
            if (Math.abs(next - 1) < 1e-6) next = 1;
            var enlarged = Math.max(next, 1);
            var ratio = enlarged / Math.max(scale, 1);
            var x = (viewport.scrollLeft + viewport.clientWidth / 2) * ratio - viewport.clientWidth / 2;
            var y = (viewport.scrollTop + viewport.clientHeight / 2) * ratio - viewport.clientHeight / 2;
            scale = next;
            svg.style.width = (enlarged * 100) + '%';
            svg.style.maxWidth = 'none';
            if (world) {
                // Widen round the frame's centre, slid back inside the surround.
                var w = box.width / Math.min(next, 1);
                var h = box.height / Math.min(next, 1);
                var vx = next < 1 ? clamp((box.width - w) / 2, surround[0], surround[0] + surround[2] - w) : 0;
                var vy = next < 1 ? clamp((box.height - h) / 2, surround[1], surround[1] + surround[3] - h) : 0;
                world.setAttribute('viewBox', [vx, vy, w, h].join(' '));
                svg.classList.toggle('is-zoomed-out', next < 1);
            }
            viewport.scrollLeft = x;
            viewport.scrollTop = y;
            zoomIn.disabled = scale >= maxZoom;
            zoomOut.disabled = scale <= minZoom + 1e-6;
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

    // Territorial-control phases: a slider and a play button step through
    // the dated <g data-phase> layers; the timeline rows carry the phase in
    // force at their date, so hovering or pinning a row moves the map too.
    var setPhase = function () {};
    var control = document.querySelector('[data-event-control]');
    if (control) (function () {
        var layers = Array.prototype.slice.call(document.querySelectorAll('.emap-phase[data-phase]'));
        var range = control.querySelector('[data-control-range]');
        var play = control.querySelector('[data-control-play]');
        var caption = control.querySelector('[data-control-caption]');
        var data = control.querySelector('[data-control-phases]');
        var phases = [];
        try { phases = JSON.parse(data.textContent); } catch (e) { return; }
        if (!layers.length || !range || !phases.length) return;
        control.querySelector('.commu-event-control-bar').hidden = false;
        var current = 0;
        var timer = null;

        setPhase = function (index) {
            index = Math.max(0, Math.min(phases.length - 1, index));
            current = index;
            layers.forEach(function (layer) {
                layer.classList.toggle('is-current', layer.getAttribute('data-phase') === String(index));
            });
            range.value = String(index);
            var phase = phases[index];
            range.setAttribute('aria-valuetext', phase.date + ' ' + phase.label);
            caption.querySelector('strong').textContent = phase.date;
            caption.querySelector('span').textContent = phase.label;
        };

        function stop() {
            if (timer === null) return;
            clearInterval(timer);
            timer = null;
            play.setAttribute('aria-pressed', 'false');
            play.textContent = play.getAttribute('data-label-play');
        }

        range.addEventListener('input', function () {
            stop();
            setPhase(parseInt(range.value, 10));
        });
        play.addEventListener('click', function () {
            if (timer !== null) { stop(); return; }
            if (current >= phases.length - 1) setPhase(0);
            play.setAttribute('aria-pressed', 'true');
            play.textContent = play.getAttribute('data-label-pause');
            timer = setInterval(function () {
                if (current >= phases.length - 1) { stop(); return; }
                setPhase(current + 1);
            }, 1600);
        });
        // A row without a map number still moves the map to its date.
        document.querySelectorAll('.commu-event-timeline-list > li[data-control-phase]').forEach(function (row) {
            if (row.hasAttribute('data-geo-num')) return;
            row.addEventListener('click', function (event) {
                if (event.target.closest('a')) return;
                stop();
                setPhase(parseInt(row.getAttribute('data-control-phase'), 10));
            });
        });
        setPhase(0);
        control.stopPlaying = stop;
    })();

    function followRow(num) {
        if (!control || num === null) return;
        var row = document.querySelector('.commu-event-timeline-list > li[data-geo-num="' + num + '"][data-control-phase]');
        if (!row) return;
        if (control.stopPlaying) control.stopPlaying();
        setPhase(parseInt(row.getAttribute('data-control-phase'), 10));
    }

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
        followRow(num);
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
