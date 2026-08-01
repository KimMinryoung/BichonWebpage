(function() {
    // Prevent double form submission
    var form = document.querySelector('.box form[action^="/admin/posts/"]');
    form.addEventListener('submit', function(e) {
        var btn = form.querySelector('button[type="submit"]');
        if (btn.disabled) { e.preventDefault(); return; }
        btn.disabled = true;
    });

    var content = document.getElementById('content');
    var overlay = document.getElementById('linkOverlay');
    var urlInput = document.getElementById('linkUrl');
    var titleInput = document.getElementById('linkTitle');
    var textInput = document.getElementById('linkText');
    var openButton = document.getElementById('insertLinkBtn');
    var selStart, selEnd;

    // Prevent Enter in modal inputs from submitting the main form
    var modalInputs = [urlInput, titleInput, textInput];
    modalInputs.forEach(function(input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('linkInsertBtn').click();
            }
        });
    });

    openButton.addEventListener('click', function() {
        selStart = content.selectionStart;
        selEnd = content.selectionEnd;
        var selected = content.value.substring(selStart, selEnd);
        urlInput.value = '';
        titleInput.value = '';
        textInput.value = selected || '';
        overlay.setAttribute('aria-hidden', 'false');
        urlInput.focus();
    });

    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    document.getElementById('linkInsertBtn').addEventListener('click', function() {
        var url = urlInput.value.trim();
        if (!url) { urlInput.focus(); return; }
        var title = titleInput.value.trim();
        var text = textInput.value.trim() || url;
        var tag = '<a href="' + escapeHtml(url) + '" target="_blank"' + (title ? ' title="' + escapeHtml(title) + '"' : '') + '>' + escapeHtml(text) + '</a>';
        var before = content.value.substring(0, selStart);
        var after = content.value.substring(selEnd);
        content.value = before + tag + after;
        var cursorPos = selStart + tag.length;
        content.setSelectionRange(cursorPos, cursorPos);
        content.focus();
        closeModal(false);
    });

    function closeModal(restoreFocus) {
        overlay.setAttribute('aria-hidden', 'true');
        if (restoreFocus !== false) openButton.focus();
    }
    document.getElementById('linkCancelBtn').addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });
})();
