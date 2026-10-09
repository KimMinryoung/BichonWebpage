const { renderMarkdown } = require('../../utils/markdown');
const { sanitizeRich } = require('../../utils/sanitize');
const { createLinker } = require('./linkify');

function renderLinkedContent(value, indexes, options) {
    const html = options.html ? String(value || '') : sanitizeRich(renderMarkdown(value || ''));
    if (options.surface === 'doc') {
        const raw = options.doc || { id: options.exclude?.doc, people: [], noAutoLink: options.blockStrings };
        const linked = require('./doc-person-links').renderDocPersonLinks(html, raw, indexes).html;
        return require('./linked-entities').collectLinkedEntities(linked, indexes);
    }
    const linker = createLinker(indexes, options);
    const linked = linker.html(html);
    return { html: linked, ...linker.found, links: linker.links };
}
module.exports = { renderLinkedContent };
