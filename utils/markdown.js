function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function cleanCitationUrl(value = '') {
    return String(value).replace(/[.,;:]+$/, '');
}

function collectCitationLinks(markdown = '') {
    const links = new Map();
    const lines = String(markdown).replace(/\r\n/g, '\n').split('\n');
    let inCode = false;
    let pendingNumber = null;

    for (const rawLine of lines) {
        const line = rawLine.replace(/\s+$/, '');

        if (line.startsWith('```')) {
            inCode = !inCode;
            pendingNumber = null;
            continue;
        }
        if (inCode) continue;

        const reference = line.match(/^\s*\[([1-9]\d*)\]:\s*(https?:\/\/[^\s<>)]+)/);
        if (reference) {
            links.set(reference[1], cleanCitationUrl(reference[2]));
            pendingNumber = null;
            continue;
        }

        const bracketed = line.match(/^\s*\[([1-9]\d*)\][^\n]*(https?:\/\/[^\s<>)]+)/);
        if (bracketed) {
            links.set(bracketed[1], cleanCitationUrl(bracketed[2]));
            pendingNumber = null;
            continue;
        }

        const numbered = line.match(/^\s*([1-9]\d*)\.\s+(.+)$/);
        if (numbered) {
            const sameLineUrl = numbered[2].match(/https?:\/\/[^\s<>)]+/);
            if (sameLineUrl) {
                links.set(numbered[1], cleanCitationUrl(sameLineUrl[0]));
                pendingNumber = null;
            } else {
                pendingNumber = numbered[1];
            }
            continue;
        }

        if (pendingNumber) {
            const nextLineUrl = line.match(/^\s*(https?:\/\/[^\s<>)]+)/);
            if (nextLineUrl) {
                links.set(pendingNumber, cleanCitationUrl(nextLineUrl[1]));
            }
            pendingNumber = null;
        }
    }

    return links;
}

function inlineMarkdown(text, citationLinks = new Map()) {
    const codeSegments = [];
    const protectedText = String(text).replace(/`([^`]+)`/g, (_match, code) => {
        const index = codeSegments.push(`<code>${escapeHtml(code)}</code>`) - 1;
        return `\u0000CODE${index}\u0000`;
    });

    return escapeHtml(protectedText)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
        .replace(/\[([1-9]\d*)\]/g, (match, number) => {
            const href = citationLinks.get(number);
            if (!href) return match;
            return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">[${number}]</a>`;
        })
        .replace(/\u0000CODE(\d+)\u0000/g, (_match, index) => codeSegments[Number(index)] || '');
}

function flushParagraph(out, paragraph, citationLinks) {
    if (!paragraph.length) return;
    out.push(`<p>${inlineMarkdown(paragraph.join(' '), citationLinks)}</p>`);
    paragraph.length = 0;
}

function flushList(out, list, citationLinks) {
    if (!list.length) return;
    const tag = list[0].ordered ? 'ol' : 'ul';
    out.push(`<${tag}>`);
    for (const item of list) out.push(`<li>${inlineMarkdown(item.text, citationLinks)}</li>`);
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

function flushTable(out, table, citationLinks) {
    if (!table.length) return;
    const [header, divider, ...rows] = table;
    if (!divider || !isTableDivider(divider)) {
        for (const row of table) out.push(`<p>${inlineMarkdown(row, citationLinks)}</p>`);
        table.length = 0;
        return;
    }

    const headers = splitTableRow(header) || [];
    out.push('<table>');
    out.push('<thead><tr>');
    for (const cell of headers) out.push(`<th>${inlineMarkdown(cell, citationLinks)}</th>`);
    out.push('</tr></thead>');
    if (rows.length) {
        out.push('<tbody>');
        for (const row of rows) {
            const cells = splitTableRow(row) || [];
            out.push('<tr>');
            for (const cell of cells) out.push(`<td>${inlineMarkdown(cell, citationLinks)}</td>`);
            out.push('</tr>');
        }
        out.push('</tbody>');
    }
    out.push('</table>');
    table.length = 0;
}

function renderMarkdown(markdown = '') {
    const lines = String(markdown).replace(/\r\n/g, '\n').split('\n');
    const citationLinks = collectCitationLinks(markdown);
    const out = [];
    const paragraph = [];
    const list = [];
    const table = [];
    let inCode = false;
    let code = [];

    for (const rawLine of lines) {
        const line = rawLine.replace(/\s+$/, '');

        if (line.startsWith('```')) {
            flushParagraph(out, paragraph, citationLinks);
            flushList(out, list, citationLinks);
            flushTable(out, table, citationLinks);
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
            flushParagraph(out, paragraph, citationLinks);
            flushList(out, list, citationLinks);
            flushTable(out, table, citationLinks);
            continue;
        }

        const tableRow = splitTableRow(line);
        if (tableRow) {
            flushParagraph(out, paragraph, citationLinks);
            flushList(out, list, citationLinks);
            table.push(line);
            continue;
        }

        flushTable(out, table, citationLinks);

        if (/^\s*-{3,}\s*$/.test(line)) {
            flushParagraph(out, paragraph, citationLinks);
            flushList(out, list, citationLinks);
            out.push('<hr>');
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            flushParagraph(out, paragraph, citationLinks);
            flushList(out, list, citationLinks);
            const level = heading[1].length;
            out.push(`<h${level}>${inlineMarkdown(heading[2], citationLinks)}</h${level}>`);
            continue;
        }

        const bullet = line.match(/^\s*[-*+]\s+(.+)$/);
        if (bullet) {
            flushParagraph(out, paragraph, citationLinks);
            if (list.length && list[0].ordered) flushList(out, list, citationLinks);
            list.push({ ordered: false, text: bullet[1] });
            continue;
        }

        const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
        if (ordered) {
            flushParagraph(out, paragraph, citationLinks);
            if (list.length && !list[0].ordered) flushList(out, list, citationLinks);
            list.push({ ordered: true, text: ordered[1] });
            continue;
        }

        const quote = line.match(/^\s*>\s+(.+)$/);
        if (quote) {
            flushParagraph(out, paragraph, citationLinks);
            flushList(out, list, citationLinks);
            out.push(`<blockquote>${inlineMarkdown(quote[1], citationLinks)}</blockquote>`);
            continue;
        }

        flushList(out, list, citationLinks);
        paragraph.push(line.trim());
    }

    if (inCode) out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
    flushParagraph(out, paragraph, citationLinks);
    flushList(out, list, citationLinks);
    flushTable(out, table, citationLinks);

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
