(function() {
    'use strict';
    // Each dropdown lists only choices that still have people under the other
    // one, so apply a change at once; the Apply button is the no-JS fallback.
    var form = document.querySelector('.commu-activity-filters');
    if (form) {
        form.querySelectorAll('select').forEach(function(field) {
            field.addEventListener('change', function() { form.submit(); });
        });
        var apply = form.querySelector('button[type="submit"]');
        if (apply) apply.hidden = true;
    }
})();

(function() {
    'use strict';
    var input = document.querySelector('[data-affiliation-search]');
    var select = document.querySelector('#activity-affiliation');
    var panel = document.querySelector('[data-affiliation-search-panel]');
    var status = document.querySelector('#affiliation-search-status');
    if (!input || !select || !panel || !status) return;
    var en = document.documentElement.lang === 'en';
    var groups = Array.from(select.querySelectorAll('optgroup')).map(function(group) {
        return { node: group, options: Array.from(group.children) };
    });
    var all = select.options[0];
    panel.hidden = false;
    input.addEventListener('input', function() {
        var query = input.value.trim().normalize('NFKC').toLocaleLowerCase();
        var selected = select.value;
        var count = 0;
        // Preserve the selection while narrowing the list, including on mobile
        // native pickers, where hiding individual options is not reliable.
        select.replaceChildren(all);
        groups.forEach(function(group) {
            var options = group.options.filter(function(option) {
                var text = (group.node.label + ' ' + option.textContent).normalize('NFKC').toLocaleLowerCase();
                var match = !query || text.includes(query);
                if (match) count++;
                return match || option.value === selected;
            });
            group.node.replaceChildren.apply(group.node, options);
            if (options.length) select.appendChild(group.node);
        });
        select.value = selected;
        status.hidden = !query;
        status.textContent = (en ? count + ' matching affiliations.' : '일치하는 소속 ' + count + '개.')
            + (selected ? (en ? ' Your current selection is also kept.' : ' 현재 선택한 소속은 유지됩니다.') : '');
    });
})();
