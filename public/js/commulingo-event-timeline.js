// Timeline country filter. The panel prints one chip per country that appears
// in the timeline (event-countries.js) and a data-countries attribute on each
// row; this script hides the rows a chosen chip does not cover and dims their
// map badges. Without JavaScript the chips are inert and the full list shows.
(function () {
    var filter = document.querySelector('[data-tl-filter]');
    if (!filter) return;
    var chips = Array.prototype.slice.call(filter.querySelectorAll('.commu-tl-chip'));
    var rows = Array.prototype.slice.call(document.querySelectorAll('.commu-event-timeline-list > li'));
    var svgs = Array.prototype.slice.call(document.querySelectorAll('.commu-event-map svg'));

    function badges(num) {
        return svgs.reduce(function (all, svg) {
            return all.concat(Array.prototype.slice.call(svg.querySelectorAll('[data-geo-num="' + num + '"]')));
        }, []);
    }

    function apply(code) {
        chips.forEach(function (chip) {
            var on = (chip.getAttribute('data-country') || '') === code;
            chip.classList.toggle('is-active', on);
            chip.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        rows.forEach(function (row) {
            var list = (row.getAttribute('data-countries') || '').split(' ');
            var shown = !code || list.indexOf(code) !== -1;
            row.hidden = !shown;
            var num = row.getAttribute('data-geo-num');
            if (num) badges(num).forEach(function (el) { el.classList.toggle('is-filtered-out', !shown); });
        });
    }

    chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
            var code = chip.getAttribute('data-country') || '';
            apply(chip.classList.contains('is-active') && code ? '' : code);
        });
    });
})();
