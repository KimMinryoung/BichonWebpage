const { renderMarkdown } = require('../../utils/markdown');
const { sanitizeRich } = require('../../utils/sanitize');
const { createLinker } = require('./linkify');

function renderLinkedContent(value, indexes, options) {
    const html = options.html ? String(value || '') : sanitizeRich(renderMarkdown(value || ''));
    const linker = createLinker(indexes, options);
    const linked = linker.html(html);
    return { html: linked, ...linker.found, links: linker.links };
}
module.exports = { renderLinkedContent };
