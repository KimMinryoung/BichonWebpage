// Minimal ESLint: undefined identifiers and unused variables only. The
// browser files are classic scripts (IIFE-wrapped, no modules); the server
// side is CommonJS on Node 20. Run with scripts/lint (or `npm run lint`).
const browserGlobals = {
    window: 'readonly', document: 'readonly', navigator: 'readonly', location: 'readonly',
    fetch: 'readonly', FormData: 'readonly', URL: 'readonly', URLSearchParams: 'readonly',
    localStorage: 'readonly', sessionStorage: 'readonly', history: 'readonly',
    setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly',
    requestAnimationFrame: 'readonly', cancelAnimationFrame: 'readonly',
    IntersectionObserver: 'readonly', MutationObserver: 'readonly', ResizeObserver: 'readonly',
    AbortController: 'readonly', AbortSignal: 'readonly', TextDecoder: 'readonly', TextEncoder: 'readonly',
    Node: 'readonly', NodeFilter: 'readonly', Element: 'readonly', HTMLElement: 'readonly', Event: 'readonly', CustomEvent: 'readonly',
    console: 'readonly', alert: 'readonly', confirm: 'readonly', prompt: 'readonly',
    getComputedStyle: 'readonly', matchMedia: 'readonly', crypto: 'readonly', performance: 'readonly',
    Promise: 'readonly', Map: 'readonly', Set: 'readonly', WeakMap: 'readonly', Symbol: 'readonly',
    marked: 'readonly', DOMPurify: 'readonly', SimpleWebAuthnBrowser: 'readonly',
};
const nodeGlobals = {
    require: 'readonly', module: 'writable', exports: 'writable', process: 'readonly',
    __dirname: 'readonly', __filename: 'readonly', Buffer: 'readonly', console: 'readonly',
    setTimeout: 'readonly', clearTimeout: 'readonly', setInterval: 'readonly', clearInterval: 'readonly',
    setImmediate: 'readonly', URL: 'readonly', URLSearchParams: 'readonly', fetch: 'readonly',
    AbortController: 'readonly', AbortSignal: 'readonly', TextDecoder: 'readonly', TextEncoder: 'readonly',
    Promise: 'readonly', Map: 'readonly', Set: 'readonly', WeakMap: 'readonly', Symbol: 'readonly',
};
const rules = {
    'no-undef': 'error',
    'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
};
module.exports = [
    { ignores: ['node_modules/**', 'public/fonts/**', 'public/puzzles/**', 'data/commulingo/docs/**', 'docs/**', 'temp_dev/**', 'tools/**'] },
    {
        files: ['public/js/**/*.js'],
        languageOptions: { ecmaVersion: 2020, sourceType: 'script', globals: browserGlobals },
        rules,
    },
    {
        files: ['server.js', 'routes/**/*.js', 'services/**/*.js', 'middleware/**/*.js', 'utils/**/*.js', 'config/**/*.js', 'data/**/*.js', 'scripts/**/*.js', 'eslint.config.js'],
        languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs', globals: nodeGlobals },
        rules,
    },
    {
        // Playwright crawler: page.evaluate() callbacks run in the browser.
        files: ['scripts/audit-overflow.js'],
        languageOptions: { ecmaVersion: 2022, sourceType: 'commonjs', globals: { ...nodeGlobals, ...browserGlobals } },
        rules,
    },
];
