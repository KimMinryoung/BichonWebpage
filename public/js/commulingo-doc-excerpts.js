// Reference-document boxes on dictionary entry pages (commulingo-doc-excerpts
// partial). A text taller than the preview folds to it, with a button that
// unfolds it into the page; without this script every text shows in full.
//
// The height is measured once the box is laid out. On a paired term/event page
// one panel starts hidden and measures as zero, so a ResizeObserver waits for
// the tab that shows it.
(function () {
    function previewHeight(box) {
        box.classList.add('is-folded');
        var h = box.querySelector('.commu-doc-excerpt-body').clientHeight;
        box.classList.remove('is-folded');
        return h;
    }

    function setup(box) {
        var body = box.querySelector('.commu-doc-excerpt-body');
        var button = box.querySelector('.commu-doc-excerpt-toggle');
        if (!body || !button) return false;
        var full = body.scrollHeight;
        if (!full) return false; // hidden panel: not laid out yet
        // Fold only when it hides at least another preview's worth: folding a text
        // a few paragraphs over the preview (the 1940 Vichy law, 554px on a phone)
        // costs a click to save less than a screen of scrolling.
        if (full <= previewHeight(box) * 2) return true;
        box.classList.add('is-folded');
        button.hidden = false;
        button.addEventListener('click', function () {
            var folded = box.classList.toggle('is-folded');
            button.setAttribute('aria-expanded', folded ? 'false' : 'true');
            button.textContent = folded ? button.dataset.expand : button.dataset.collapse;
            // Folding a long text from its end would leave the reader far below
            // the box; bring its head back into view.
            if (folded && box.getBoundingClientRect().top < 0) box.scrollIntoView({ block: 'start' });
        });
        return true;
    }

    var boxes = Array.prototype.slice.call(document.querySelectorAll('.commu-doc-excerpt'));
    var pending = boxes.filter(function (box) { return !setup(box); });
    if (!pending.length || typeof ResizeObserver === 'undefined') return;
    var observer = new ResizeObserver(function (entries) {
        entries.forEach(function (entry) {
            if (setup(entry.target)) observer.unobserve(entry.target);
        });
    });
    pending.forEach(function (box) { observer.observe(box); });
})();
