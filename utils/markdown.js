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
    const tag = list[0].ordered ? 'ol' : 'ul';
    out.push(`<${tag}>`);
    for (const item of list) out.push(`<li>${inlineMarkdown(item.text)}</li>`);
    out.push(`</${tag}>`);
    list.length = 0;
}

function splitTableRow(line) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return null;
    return trimmed.slice(1, -1).split('|').map(cell => cell.trim());
}

function isTableDivider(line) {
    const cells = splitTableRow(line);
    return !!cells && cells.length > 0 && cells.every(cell => /^:?-{3,}:?$/.test(cell));
}

function flushTable(out, table) {
    if (!table.length) return;
    const [header, divider, ...rows] = table;
    if (!divider || !isTableDivider(divider)) {
        for (const row of table) out.push(`<p>${inlineMarkdown(row)}</p>`);
        table.length = 0;
        return;
    }

    const headers = splitTableRow(header) || [];
    out.push('<table>');
    out.push('<thead><tr>');
    for (const cell of headers) out.push(`<th>${inlineMarkdown(cell)}</th>`);
    out.push('</tr></thead>');
    if (rows.length) {
        out.push('<tbody>');
        for (const row of rows) {
            const cells = splitTableRow(row) || [];
            out.push('<tr>');
            for (const cell of cells) out.push(`<td>${inlineMarkdown(cell)}</td>`);
            out.push('</tr>');
        }
        out.push('</tbody>');
    }
    out.push('</table>');
    table.length = 0;
}

function renderMarkdown(markdown = '') {
    const lines = String(markdown).replace(/\r\n/g, '\n').split('\n');
    const out = [];
    const paragraph = [];
    const list = [];
    const table = [];
    let inCode = false;
    let code = [];

    for (const rawLine of lines) {
        const line = rawLine.replace(/\s+$/, '');

        if (line.startsWith('```')) {
            flushParagraph(out, paragraph);
            flushList(out, list);
            flushTable(out, table);
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
            flushTable(out, table);
            continue;
        }

        const tableRow = splitTableRow(line);
        if (tableRow) {
            flushParagraph(out, paragraph);
            flushList(out, list);
            table.push(line);
            continue;
        }

        flushTable(out, table);

        if (/^\s*-{3,}\s*$/.test(line)) {
            flushParagraph(out, paragraph);
            flushList(out, list);
            out.push('<hr>');
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
            if (list.length && list[0].ordered) flushList(out, list);
            list.push({ ordered: false, text: bullet[1] });
            continue;
        }

        const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
        if (ordered) {
            flushParagraph(out, paragraph);
            if (list.length && !list[0].ordered) flushList(out, list);
            list.push({ ordered: true, text: ordered[1] });
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
    flushTable(out, table);

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
