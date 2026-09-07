(function () {
    'use strict';
    var root = document.querySelector('[data-world-map]');
    if (!root) return;
    var related = Array.prototype.slice.call(document.querySelectorAll('[data-country-code]'));

    function setActive(code, active) {
        related.forEach(function (item) {
            if (item.getAttribute('data-country-code') === code) item.classList.toggle('is-map-active', active);
        });
        var svg = root.querySelector('svg');
        if (svg) svg.classList.toggle('has-active', active);
    }

    related.forEach(function (item) {
        var code = item.getAttribute('data-country-code');
        item.addEventListener('mouseenter', function () { setActive(code, true); });
        item.addEventListener('mouseleave', function () { setActive(code, false); });
        item.addEventListener('focus', function () { setActive(code, true); });
        item.addEventListener('blur', function () { setActive(code, false); });
    });

    // The map stays large enough for flags to be legible on a phone, so its
    // container scrolls horizontally there. Start on the selected country;
    // the overview starts over Europe/Africa instead of at the far western
    // edge. This changes only the viewport — every link remains usable without
    // JavaScript through the country list below the map.
    requestAnimationFrame(function () {
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
