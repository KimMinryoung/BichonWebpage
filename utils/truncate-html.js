/**
 * Truncate an HTML string to roughly maxLen visible characters,
 * keeping tags balanced (open tags are closed at the cut point).
 */
function truncateHtml(html, maxLen) {
    var result = '';
    var textLen = 0;
    var openTags = [];
    var i = 0;
    while (i < html.length && textLen < maxLen) {
        if (html[i] === '<') {
            var end = html.indexOf('>', i);
            if (end === -1) break;
            var tag = html.substring(i, end + 1);
            var closing = tag[1] === '/';
            if (closing) {
                openTags.pop();
            } else if (!tag.endsWith('/>') && !tag.startsWith('<!')) {
                var name = tag.match(/^<\s*([a-zA-Z][a-zA-Z0-9]*)/);
                if (name) openTags.push(name[1]);
            }
            result += tag;
            i = end + 1;
        } else {
            result += html[i];
            textLen++;
            i++;
        }
    }
    // Ellipsis only when visible text (not just trailing markup) was cut off;
    // scanning the unconsumed tail is enough — no second full-string scan.
    var truncated = i < html.length && html.slice(i).replace(/<[^>]*>/g, '').trim().length > 0;
    while (openTags.length) result += '</' + openTags.pop() + '>';
    if (truncated) result += '...';
    return result;
}

module.exports = { truncateHtml };
