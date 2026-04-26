function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function inlineMarkdown(text) {
    return escapeHtml(text)
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

function flushParagraph(out, paragraph) {
    if (!paragraph.length) return;
    out.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`);
    paragraph.length = 0;
}

function flushList(out, list) {
    if (!list.length) return;
    out.push('<ul>');
    for (const item of list) out.push(`<li>${inlineMarkdown(item)}</li>`);
    out.push('</ul>');
    list.length = 0;
}

function renderMarkdown(markdown = '') {
    const lines = String(markdown).replace(/\r\n/g, '\n').split('\n');
    const out = [];
    const paragraph = [];
    const list = [];
    let inCode = false;
    let code = [];

    for (const rawLine of lines) {
        const line = rawLine.replace(/\s+$/, '');

        if (line.startsWith('```')) {
            flushParagraph(out, paragraph);
            flushList(out, list);
            if (inCode) {
                out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
                code = [];
                inCode = false;
            } else {
                inCode = true;
            }
            continue;
        }

        if (inCode) {
            code.push(rawLine);
            continue;
        }

        if (!line.trim()) {
            flushParagraph(out, paragraph);
            flushList(out, list);
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            flushParagraph(out, paragraph);
            flushList(out, list);
            const level = heading[1].length;
            out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`);
            continue;
        }

        const bullet = line.match(/^\s*[-*+]\s+(.+)$/);
        if (bullet) {
            flushParagraph(out, paragraph);
            list.push(bullet[1]);
            continue;
        }

        const quote = line.match(/^\s*>\s+(.+)$/);
        if (quote) {
            flushParagraph(out, paragraph);
            flushList(out, list);
            out.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
            continue;
        }

        flushList(out, list);
        paragraph.push(line.trim());
    }

    if (inCode) out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
    flushParagraph(out, paragraph);
    flushList(out, list);

    return out.join('\n');
}

function stripFirstHeading(markdown = '') {
    return String(markdown).replace(/^\s*#\s+.+\r?\n+/, '');
}

function titleFromMarkdown(markdown = '', fallback = '') {
    const match = String(markdown).match(/^#\s+(.+)/m);
    return match ? match[1].trim() : fallback;
}

module.exports = {
    escapeHtml,
    renderMarkdown,
    stripFirstHeading,
    titleFromMarkdown,
};
