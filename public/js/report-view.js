document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('report-content');
    var rawEl = document.getElementById('report-raw');
    if (!rawEl) return;

    var raw = JSON.parse(rawEl.textContent);

    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
        el.innerHTML = DOMPurify.sanitize(marked.parse(raw));
    } else {
        el.textContent = raw;
    }
});
