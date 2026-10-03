(function () {
    'use strict';
    var root = document.querySelector('[data-world-map]');
    if (!root) return;
    var svg = root.querySelector('svg');
    if (!svg) return;
    var related = Array.prototype.slice.call(document.querySelectorAll('[data-country-code]'));
    var controls = root.parentElement.querySelector('[data-world-map-controls]');
    var WORLD = { x: 0, y: 0, width: 1000, height: 480 };
    var MAX_ZOOM = 12;

    function setActive(code, active) {
        related.forEach(function (item) {
            if (item.getAttribute('data-country-code') === code) item.classList.toggle('is-map-active', active);
        });
        svg.classList.toggle('has-active', active);
    }

    related.forEach(function (item) {
        var code = item.getAttribute('data-country-code');
        item.addEventListener('mouseenter', function () { setActive(code, true); });
        item.addEventListener('mouseleave', function () { setActive(code, false); });
        item.addEventListener('focus', function () { setActive(code, true); });
        item.addEventListener('blur', function () { setActive(code, false); });
    });

    // Zoom like the event maps (commulingo-event-map.js): the SVG grows inside
    // a fixed scrolling viewport, so every part of the enlarged map stays
    // reachable by native scrolling, touch and keyboard while the controls
    // stay put outside the scroller.
    var MIN_BASE_WIDTH = 720;
    var scale = 1;
    var initialScale = 1;
    var zoomIn = controls && controls.querySelector('[data-map-action="zoom-in"]');
    var zoomOut = controls && controls.querySelector('[data-map-action="zoom-out"]');
    root.tabIndex = 0;
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', svg.getAttribute('aria-label') || document.title);

    function clamp(value, low, high) { return Math.max(low, Math.min(high, value)); }
    function baseWidth() { return Math.max(root.clientWidth, MIN_BASE_WIDTH); }

    function fitHeight() {
        var height = root.clientWidth >= MIN_BASE_WIDTH
            ? root.clientWidth * WORLD.height / WORLD.width
            : MIN_BASE_WIDTH * WORLD.height / WORLD.width;
        root.style.height = height + 'px';
        // A horizontal scrollbar takes its height out of the viewport.
        root.style.height = (height + root.offsetHeight - root.clientHeight) + 'px';
    }

    // Center on a point given in SVG units.
    function centerOn(x, y) {
        var unit = baseWidth() * scale / WORLD.width;
        root.scrollLeft = x * unit - root.clientWidth / 2;
        root.scrollTop = y * unit - root.clientHeight / 2;
    }

    function setScale(next, center) {
        var unit = svg.getBoundingClientRect().width / WORLD.width;
        var point = center || {
            x: (root.scrollLeft + root.clientWidth / 2) / unit,
            y: (root.scrollTop + root.clientHeight / 2) / unit,
        };
        scale = clamp(next, 1, MAX_ZOOM);
        svg.style.minWidth = '0';
        svg.style.maxWidth = 'none';
        svg.style.width = (baseWidth() * scale) + 'px';
        fitHeight();
        centerOn(point.x, point.y);
        if (zoomIn) zoomIn.disabled = scale >= MAX_ZOOM - 1e-6;
        if (zoomOut) zoomOut.disabled = scale <= 1 + 1e-6;
    }

    // Country hubs open fitted to the selected territory; the overview opens
    // at the full world, its scroll (on a phone) a little east of centre.
    function initialFrame() {
        var fallback = { scale: 1, center: { x: WORLD.width * 0.52, y: WORLD.height / 2 } };
        var selected = svg.querySelector('.wmap-highlight.is-selected');
        if (!selected || typeof selected.getBBox !== 'function') return fallback;
        var bounds = selected.getBBox();
        if (!bounds.width || !bounds.height) return fallback;
        var center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
        if (!root.closest('.commu-world-map-panel.is-country')) return { scale: 1, center: center };
        var width = Math.max(bounds.width * 1.9, WORLD.width / 8);
        var height = Math.max(bounds.height * 1.9, WORLD.height / 8);
        var fit = Math.min(WORLD.width / width, WORLD.height / height);
        return { scale: clamp(fit, 1, MAX_ZOOM), center: center };
    }

    if (controls) {
        controls.addEventListener('click', function (event) {
            var button = event.target.closest('[data-map-action]');
            if (!button || button.disabled) return;
            var action = button.getAttribute('data-map-action');
            if (action === 'zoom-in') setScale(scale / 0.72);
            else if (action === 'zoom-out') setScale(scale * 0.72);
            else if (action === 'reset') setScale(initialScale, initialCenter);
        });
    }

    var initialCenter = null;
    // Compute the selected territory after SVG layout.
    requestAnimationFrame(function () {
        var frame = initialFrame();
        initialScale = frame.scale;
        initialCenter = frame.center;
        setScale(initialScale, initialCenter);
    });

    var lastWidth = root.clientWidth;
    window.addEventListener('resize', function () {
        if (root.clientWidth === lastWidth) return;
        lastWidth = root.clientWidth;
        setScale(scale);
    });
})();
