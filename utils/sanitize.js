const sanitizeHtml = require('sanitize-html');

const linkAttrs = ['href', 'title', 'target', 'rel'];
const textTags = [
    'a', 'br', 'b', 'i', 'strong', 'em', 'p', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre',
];
const richTags = [
    ...textTags,
    'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
];

const baseOptions = {
    allowedAttributes: {
        a: linkAttrs,
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
        a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }, true),
    },
};

function isAllowedPostEmbedSrc(src) {
    try {
        const parsed = new URL(src, 'https://cyber-lenin.local');
        return parsed.origin === 'https://cyber-lenin.local'
            && /^\/posts-embed\/[A-Za-z0-9_-]+\.html$/.test(parsed.pathname);
    } catch (_error) {
        return false;
    }
}

function sanitizeBasic(html) {
    return sanitizeHtml(html || '', {
        ...baseOptions,
        allowedTags: textTags,
    });
}

function sanitizeRich(html) {
    return sanitizeHtml(html || '', {
        ...baseOptions,
        allowedTags: richTags,
        allowedAttributes: {
            ...baseOptions.allowedAttributes,
            th: ['align'],
            td: ['align'],
        },
    });
}

function sanitizePost(html) {
    return sanitizeHtml(html || '', {
        ...baseOptions,
        allowedTags: [...textTags, 'iframe'],
        allowedAttributes: {
            ...baseOptions.allowedAttributes,
            iframe: ['src', 'width', 'height', 'frameborder', 'class', 'loading', 'title', 'sandbox', 'referrerpolicy'],
        },
        allowedIframeHostnames: [],
        allowIframeRelativeUrls: true,
        transformTags: {
            ...baseOptions.transformTags,
            iframe: function (_tagName, attribs) {
                const src = attribs.src || '';
                if (!isAllowedPostEmbedSrc(src)) {
                    return { tagName: 'span', text: '' };
                }
                return {
                    tagName: 'iframe',
                    attribs: {
                        ...attribs,
                        sandbox: 'allow-same-origin',
                        referrerpolicy: 'no-referrer',
                        loading: 'lazy',
                    },
                };
            },
        },
    });
}

module.exports = {
    sanitizeBasic,
    sanitizeRich,
    sanitizePost,
};
