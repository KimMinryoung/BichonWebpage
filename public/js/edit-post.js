(function() {
    var content = document.getElementById('content');
    var overlay = document.getElementById('linkOverlay');
    var urlInput = document.getElementById('linkUrl');
    var titleInput = document.getElementById('linkTitle');
    var textInput = document.getElementById('linkText');
    var selStart, selEnd;

    document.getElementById('insertLinkBtn').addEventListener('click', function() {
        selStart = content.selectionStart;
        selEnd = content.selectionEnd;
        var selected = content.value.substring(selStart, selEnd);
        urlInput.value = '';
        titleInput.value = '';
        textInput.value = selected || '';
        overlay.style.display = 'flex';
        urlInput.focus();
    });

    document.getElementById('linkInsertBtn').addEventListener('click', function() {
        var url = urlInput.value.trim();
        if (!url) { urlInput.focus(); return; }
        var title = titleInput.value.trim();
        var text = textInput.value.trim() || url;
        var tag = '<a href="' + url + '" target="_blank"' + (title ? ' title="' + title + '"' : '') + '>' + text + '</a>';
        var before = content.value.substring(0, selStart);
        var after = content.value.substring(selEnd);
        content.value = before + tag + after;
        var cursorPos = selStart + tag.length;
        content.setSelectionRange(cursorPos, cursorPos);
        content.focus();
        overlay.style.display = 'none';
    });

    function closeModal() { overlay.style.display = 'none'; }
    document.getElementById('linkCancelBtn').addEventListener('click', closeModal);
})();
