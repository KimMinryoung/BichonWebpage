// Security headers. The CSP allows the two script CDNs (marked/DOMPurify on
// the chat and report pages, @simplewebauthn/browser on the passkey pages)
// and the asset host for images; everything else is same-origin.
const helmet = require('helmet');

const securityHeaders = helmet({
    contentSecurityPolicy: {
        useDefaults: false,
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', 'https://cdnjs.cloudflare.com', "'unsafe-inline'"],
            workerSrc: ["'self'", 'blob:'],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'https://assets.cyber-lenin.com'],
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"]
        }
    },
    crossOriginEmbedderPolicy: false
});

module.exports = { securityHeaders };
