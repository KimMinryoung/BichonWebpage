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

        const reference = line.match(/^\s*\[\^?([A-Za-z0-9_]+)\]:\s*(?:.*?\s)?(https?:\/\/[^\s<>)]+)/);
        if (reference) {
            links.set(reference[1], cleanCitationUrl(reference[2]));
            pendingNumber = null;
            continue;
        }

        const bracketed = line.match(/^\s*\[\^?([A-Za-z0-9_]+)\][^\n]*(https?:\/\/[^\s<>)]+)/);
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

function collectFootnoteDefinitions(markdown = '') {
    const definitions = new Set();
    const lines = String(markdown).replace(/\r\n/g, '\n').split('\n');
    let inCode = false;

    for (const rawLine of lines) {
        const line = rawLine.replace(/\s+$/, '');
        if (line.startsWith('```')) {
            inCode = !inCode;
            continue;
        }
        if (inCode) continue;

        const reference = line.match(/^\s*\[\^?([A-Za-z0-9_]+)\]:\s*/);
        if (reference) definitions.add(reference[1]);
    }

    return definitions;
}

function inlineMarkdown(text, citationLinks = new Map(), footnoteDefinitions = new Set()) {
    const codeSegments = [];
    const protectedText = String(text).replace(/`([^`]+)`/g, (_match, code) => {
        const index = codeSegments.push(`<code>${escapeHtml(code)}</code>`) - 1;
        return `\u0000CODE${index}\u0000`;
    });

    return escapeHtml(protectedText)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        // Only absolute URLs used to be linked, so the 'Preceding reports' lines
        // that point at /reports/... rendered their markdown source as text, and
        // the bare (/reports/very-long-slug) made one unbreakable token that
        // stretched the justified line around it. Site-relative and in-page
        // targets link too, and stay in the same tab; anything with another
        // scheme is left exactly as written rather than turned into a link.
        .replace(/\[([^\]]+)]\(([^)\s]+)\)/g, (match, label, href) => {
            if (/^https?:\/\//i.test(href)) {
                return `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`;
            }
            if (/^[/#]/.test(href)) return `<a href="${href}">${label}</a>`;
            return match;
        })
        .replace(/\[\^?([A-Za-z0-9_]+)\]/g, (match, label) => {
            const href = citationLinks.get(label);
            if (href) return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">[${label}]</a>`;
            if (footnoteDefinitions.has(label)) return `<a href="#fn-${escapeHtml(label)}" class="footnote-ref">[${label}]</a>`;
            return match;
        })
        .replace(/\u0000CODE(\d+)\u0000/g, (_match, index) => codeSegments[Number(index)] || '');
}

function flushParagraph(out, paragraph, citationLinks, footnoteDefinitions) {
    if (!paragraph.length) return;
    out.push(`<p>${inlineMarkdown(paragraph.join(' '), citationLinks, footnoteDefinitions)}</p>`);
    paragraph.length = 0;
}

function flushList(out, list, citationLinks, footnoteDefinitions) {
    if (!list.length) return;
    const tag = list[0].ordered ? 'ol' : 'ul';
    out.push(`<${tag}>`);
    for (const item of list) out.push(`<li>${inlineMarkdown(item.text, citationLinks, footnoteDefinitions)}</li>`);
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

function flushTable(out, table, citationLinks, footnoteDefinitions) {
    if (!table.length) return;
    const [header, divider, ...rows] = table;
    if (!divider || !isTableDivider(divider)) {
        for (const row of table) out.push(`<p>${inlineMarkdown(row, citationLinks, footnoteDefinitions)}</p>`);
        table.length = 0;
        return;
    }

    const headers = splitTableRow(header) || [];
    // Tables are the one block that will not fit a phone: a four-column report
    // table measured 410px against a 366px column, pushing the whole page into
    // horizontal scroll. Wrapping it lets the table scroll inside itself and
    // keeps the table layout algorithm, which display:block on the table would
    // break.
    out.push('<div class="table-scroll">');
    out.push('<table>');
    out.push('<thead><tr>');
    for (const cell of headers) out.push(`<th>${inlineMarkdown(cell, citationLinks, footnoteDefinitions)}</th>`);
    out.push('</tr></thead>');
    if (rows.length) {
        out.push('<tbody>');
        for (const row of rows) {
            const cells = splitTableRow(row) || [];
            out.push('<tr>');
            for (const cell of cells) out.push(`<td>${inlineMarkdown(cell, citationLinks, footnoteDefinitions)}</td>`);
            out.push('</tr>');
        }
        out.push('</tbody>');
    }
    out.push('</table>');
    out.push('</div>');
    table.length = 0;
}

// ::: 외부문헌 / ::: source — a fenced card that introduces an important
// external text (a translation, an archive edition) with its site/translator
// instead of a bare inline link:
//   :::외부문헌
//   제목: 「이행 강령」(1938) 한국어 전문 번역
//   출처: 볼셰비키그룹 (bolky.jinbo.net)
//   번역: ...            (optional)
//   링크: https://...
//   :::
const SOURCE_CARD_OPEN = /^:::\s*(외부문헌|source)\s*$/;
const SOURCE_CARD_LABELS = { '외부문헌': '외부 문헌', source: 'External text' };

function renderSourceCard(kind, lines) {
    const fields = {};
    for (const line of lines) {
        const match = line.match(/^\s*(제목|출처|번역|링크|설명|title|source|translator|url|note)\s*:\s*(.+)$/);
        if (match) fields[match[1]] = match[2].trim();
    }
    const title = fields['제목'] || fields.title || '';
    const origin = fields['출처'] || fields.source || '';
    const translator = fields['번역'] || fields.translator || '';
    const note = fields['설명'] || fields.note || '';
    const url = cleanCitationUrl(fields['링크'] || fields.url || '');
    if (!title || !/^https?:\/\//.test(url)) {
        // Malformed card: fall back to plain paragraphs so nothing is lost.
        return lines.map(line => `<p>${inlineMarkdown(line)}</p>`).join('\n');
    }
    const meta = [origin, translator].filter(Boolean).join(' · ');
    const parts = [
        '<div class="report-source-card">',
        `<span class="report-source-kicker">${escapeHtml(SOURCE_CARD_LABELS[kind] || SOURCE_CARD_LABELS['외부문헌'])}</span>`,
        `<p class="report-source-title"><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a></p>`,
    ];
    if (meta) parts.push(`<p class="report-source-meta">${escapeHtml(meta)}</p>`);
    if (note) parts.push(`<p class="report-source-note">${escapeHtml(note)}</p>`);
    parts.push('</div>');
    return parts.join('\n');
}

// Internal report links whose target is not published render as plain text.
// The '선행 보고서' line links sibling reports by slug, and slugs get renamed or
// never published: 38 of the 177 such references in the database point at
// nothing. Showing the title without a link beats a live 404, and beats hiding
// the reference. Applied as a pass over the HTML this module just produced,
// rather than threaded through every flush* helper.
const REPORT_ANCHOR_RE = /<a href="(\/reports\/[^"]*)"[^>]*>((?:(?!<\/a>)[\s\S])*)<\/a>/g;

function downgradeUnknownReportLinks(html, isKnownReport) {
    if (typeof isKnownReport !== 'function') return html;
    return String(html).replace(REPORT_ANCHOR_RE, (match, href, label) => {
        const slug = href.split(/[?#]/)[0].split('/').filter(Boolean).pop();
        if (!slug) return label;
        return isKnownReport(slug) ? match : label;
    });
}

function renderMarkdown(markdown = '', options = {}) {
    const lines = String(markdown).replace(/\r\n/g, '\n').split('\n');
    const citationLinks = collectCitationLinks(markdown);
    const footnoteDefinitions = collectFootnoteDefinitions(markdown);
    const out = [];
    const paragraph = [];
    const list = [];
    const table = [];
    let inCode = false;
    let code = [];
    let sourceCard = null;  // { kind, lines } while inside a ::: fence

    for (const rawLine of lines) {
        const line = rawLine.replace(/\s+$/, '');

        if (sourceCard) {
            if (/^:::\s*$/.test(line)) {
                out.push(renderSourceCard(sourceCard.kind, sourceCard.lines));
                sourceCard = null;
            } else {
                sourceCard.lines.push(line);
            }
            continue;
        }
        const sourceOpen = line.match(SOURCE_CARD_OPEN);
        if (sourceOpen && !inCode) {
            flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
            flushList(out, list, citationLinks, footnoteDefinitions);
            flushTable(out, table, citationLinks, footnoteDefinitions);
            sourceCard = { kind: sourceOpen[1], lines: [] };
            continue;
        }

        if (line.startsWith('```')) {
            flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
            flushList(out, list, citationLinks, footnoteDefinitions);
            flushTable(out, table, citationLinks, footnoteDefinitions);
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
            flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
            flushList(out, list, citationLinks, footnoteDefinitions);
            flushTable(out, table, citationLinks, footnoteDefinitions);
            continue;
        }

        const tableRow = splitTableRow(line);
        if (tableRow) {
            flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
            flushList(out, list, citationLinks, footnoteDefinitions);
            table.push(line);
            continue;
        }

        flushTable(out, table, citationLinks, footnoteDefinitions);

        if (/^\s*-{3,}\s*$/.test(line)) {
            flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
            flushList(out, list, citationLinks, footnoteDefinitions);
            out.push('<hr>');
            continue;
        }

        const footnote = line.match(/^\s*\[\^?([A-Za-z0-9_]+)\]:\s*(.*)$/);
        if (footnote) {
            flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
            flushList(out, list, citationLinks, footnoteDefinitions);
            const label = footnote[1];
            const text = footnote[2] || '';
            out.push(`<p id="fn-${escapeHtml(label)}" class="footnote-def"><span class="footnote-label">[${label}]</span> ${inlineMarkdown(text, citationLinks, footnoteDefinitions)}</p>`);
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.+)$/);
        if (heading) {
            flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
            flushList(out, list, citationLinks, footnoteDefinitions);
            const level = heading[1].length;
            out.push(`<h${level}>${inlineMarkdown(heading[2], citationLinks, footnoteDefinitions)}</h${level}>`);
            continue;
        }

        const bullet = line.match(/^\s*[-*+]\s+(.+)$/);
        if (bullet) {
            flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
            if (list.length && list[0].ordered) flushList(out, list, citationLinks, footnoteDefinitions);
            list.push({ ordered: false, text: bullet[1] });
            continue;
        }

        const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
        if (ordered) {
            flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
            if (list.length && !list[0].ordered) flushList(out, list, citationLinks, footnoteDefinitions);
            list.push({ ordered: true, text: ordered[1] });
            continue;
        }

        const quote = line.match(/^\s*>\s+(.+)$/);
        if (quote) {
            flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
            flushList(out, list, citationLinks, footnoteDefinitions);
            out.push(`<blockquote>${inlineMarkdown(quote[1], citationLinks, footnoteDefinitions)}</blockquote>`);
            continue;
        }

        flushList(out, list, citationLinks, footnoteDefinitions);
        paragraph.push(line.trim());
    }

    if (inCode) out.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`);
    flushParagraph(out, paragraph, citationLinks, footnoteDefinitions);
    flushList(out, list, citationLinks, footnoteDefinitions);
    flushTable(out, table, citationLinks, footnoteDefinitions);

    return downgradeUnknownReportLinks(out.join('\n'), options.isKnownReport);
}

function stripFirstHeading(markdown = '') {
    return String(markdown).replace(/^\s*#\s+.+\r?\n+/, '');
}

function titleFromMarkdown(markdown = '', fallback = '') {
    const match = String(markdown).match(/^#\s+(.+)/m);
    return match ? match[1].trim() : fallback;
}

module.exports = {
    downgradeUnknownReportLinks,
    escapeHtml,
    renderMarkdown,
    stripFirstHeading,
    titleFromMarkdown,
};
