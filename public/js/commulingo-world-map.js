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
    var initialView = WORLD;
    var currentView = WORLD;

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

    function clampView(view) {
        var minWidth = WORLD.width / MAX_ZOOM;
        var width = Math.max(minWidth, Math.min(WORLD.width, view.width));
        var height = width * WORLD.height / WORLD.width;
        var x = Math.max(WORLD.x, Math.min(WORLD.x + WORLD.width - width, view.x));
        var y = Math.max(WORLD.y, Math.min(WORLD.y + WORLD.height - height, view.y));
        return { x: x, y: y, width: width, height: height };
    }

    function setView(view) {
        currentView = clampView(view);
        svg.setAttribute('viewBox', [currentView.x, currentView.y, currentView.width, currentView.height]
            .map(function (value) { return value.toFixed(2); }).join(' '));
        if (!controls) return;
        var zoomIn = controls.querySelector('[data-map-action="zoom-in"]');
        var zoomOut = controls.querySelector('[data-map-action="zoom-out"]');
        if (zoomIn) zoomIn.disabled = currentView.width <= WORLD.width / MAX_ZOOM + 0.1;
        if (zoomOut) zoomOut.disabled = currentView.width >= WORLD.width - 0.1;
    }

    function selectedView() {
        if (!root.closest('.commu-country-page')) return WORLD;
        var selected = svg.querySelector('.wmap-highlight.is-selected');
        if (!selected || typeof selected.getBBox !== 'function') return WORLD;
        var bounds = selected.getBBox();
        if (!bounds.width || !bounds.height) return WORLD;
        var width = Math.max(bounds.width * 1.9, WORLD.width / 8);
        var height = Math.max(bounds.height * 1.9, WORLD.height / 8);
        var aspect = WORLD.width / WORLD.height;
        if (width / height > aspect) height = width / aspect;
        else width = height * aspect;
        return clampView({
            x: bounds.x + bounds.width / 2 - width / 2,
            y: bounds.y + bounds.height / 2 - height / 2,
            width: width,
            height: height,
        });
    }

    function zoom(multiplier) {
        var width = currentView.width * multiplier;
        var height = currentView.height * multiplier;
        setView({
            x: currentView.x + (currentView.width - width) / 2,
            y: currentView.y + (currentView.height - height) / 2,
            width: width,
            height: height,
        });
    }

    if (controls) {
        controls.addEventListener('click', function (event) {
            var button = event.target.closest('[data-map-action]');
            if (!button || button.disabled) return;
            var action = button.getAttribute('data-map-action');
            if (action === 'zoom-in') zoom(0.72);
            else if (action === 'zoom-out') zoom(1 / 0.72);
            else if (action === 'reset') setView(initialView);
        });
    }

    // Compute the selected territory after SVG layout. Country hubs open at a
    // fitted scale; the overview stays at the full-world extent.
    requestAnimationFrame(function () {
        initialView = selectedView();
        setView(initialView);

        // The SVG stays wide enough for labels and controls on a phone. Center
        // its horizontally scrollable viewport on the selected territory.
        if (root.scrollWidth <= root.clientWidth) return;
        var selected = root.querySelector('.wmap-marker.is-selected');
        if (!selected) {
            root.scrollLeft = Math.round((root.scrollWidth - root.clientWidth) * 0.52);
            return;
        }
        var markerRect = selected.getBoundingClientRect();
        var rootRect = root.getBoundingClientRect();
        root.scrollLeft += markerRect.left + markerRect.width / 2 - rootRect.left - rootRect.width / 2;
    });
})();
