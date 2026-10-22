// A standalone [[doc-excerpt:document-id]] paragraph places an event's declared
// reader in its narrative; [[doc-excerpt:document-id#heading-id]] places one
// piece of a document that lends several, so each clause or passage can stand
// where the narrative reaches it. Resolve after Markdown/linkify so headings,
// citations and first-mention links still share a single rendering pass.
// Undeclared or repeated markers remain ordinary library links, never
// arbitrary embedded HTML.
function placeEventDocExcerpts(bodyHtml, excerpts, lang) {
    const parts = [];
    const placed = new Set();
    let offset = 0;
    const pattern = /<p>\s*\[\[doc-excerpt:([a-z0-9][a-z0-9-]*)(?:#([A-Za-z0-9_-]+))?\]\]\s*<\/p>/g;
    for (const match of bodyHtml.matchAll(pattern)) {
        const [, docId, anchor] = match;
        if (match.index > offset) parts.push({ html: bodyHtml.slice(offset, match.index) });
        const index = excerpts.findIndex((excerpt, i) => excerpt.docId === docId
            && (anchor ? excerpt.anchor === anchor : !placed.has(i)));
        if (index >= 0 && !placed.has(index)) {
            parts.push({ excerpt: excerpts[index], index });
            placed.add(index);
        } else {
            const label = lang === 'en' ? 'Read in the reference library' : '참고 문헌에서 읽기';
            parts.push({ html: `<p><a href="/commulingo/docs/${docId}${anchor ? `#${anchor}` : ''}">${label}</a></p>` });
        }
        offset = match.index + match[0].length;
    }
    if (offset < bodyHtml.length) parts.push({ html: bodyHtml.slice(offset) });
    return {
        parts,
        trailing: excerpts.flatMap((excerpt, index) => placed.has(index) ? [] : [{ excerpt, index }]),
    };
}

module.exports = { placeEventDocExcerpts };
