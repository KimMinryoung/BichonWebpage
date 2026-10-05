(function() {
    'use strict';
    var root = document.querySelector('[data-event-country-filter]');
    if (!root) return;
    var en = document.documentElement.lang === 'en';
    var facet = root.querySelector('details');
    var input = root.querySelector('[data-country-search]');
    var status = root.querySelector('[data-country-search-status]');
    var countries = Array.from(root.querySelectorAll('[data-country-label]'));
    var normalize = function(value) { return value.normalize('NFKC').toLocaleLowerCase(); };
    input.hidden = false;
    input.addEventListener('input', function() {
        var query = normalize(input.value.trim());
        var count = 0;
        countries.forEach(function(country) {
            country.hidden = !normalize(country.dataset.countryLabel).includes(query);
            if (!country.hidden) count++;
        });
        status.hidden = !query;
        status.textContent = en ? count + ' matches' : count + '개 일치';
    });
    facet.addEventListener('toggle', function() {
        if (facet.open && window.matchMedia('(min-width: 641px)').matches) input.focus({ preventScroll: true });
    });
    document.addEventListener('click', function(event) {
        if (!facet.contains(event.target)) facet.open = false;
    });
    facet.addEventListener('keydown', function(event) {
        if (event.key !== 'Escape') return;
        facet.open = false;
        facet.querySelector('summary').focus();
    });

    // Country links remain ordinary URLs, including without JavaScript.
    // Carry the live event search into a country change; pagination resets.
    var search = document.querySelector('[data-commu-dict-search-input]');
    function updateLinks() {
        root.querySelectorAll('[data-country-link]').forEach(function(link) {
            var url = new URL(link.href);
            if (search.value.trim()) url.searchParams.set('q', search.value.trim());
            else url.searchParams.delete('q');
            link.href = url.pathname + url.search;
        });
    }
    search.addEventListener('input', updateLinks);
    document.querySelector('[data-commu-dict-search-clear]').addEventListener('click', updateLinks);
    search.addEventListener('keydown', function(event) { if (event.key === 'Escape') updateLinks(); });
    updateLinks();
})();
