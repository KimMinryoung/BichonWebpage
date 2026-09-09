const fs = require('node:fs/promises');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');
const root = path.join(__dirname, '..');
let versionPromise;

// Persist across container restarts and unrelated deployments, but never reuse
// HTML produced by a different renderer/linking policy or dependency version.
function cacheVersion() {
    if (!versionPromise) versionPromise = (async () => {
        const files = ['package-lock.json', 'public/js/commulingo-name-context.js'];
        for (const directory of ['utils', 'data/commulingo', 'services']) {
            for (const name of await fs.readdir(path.join(root, directory))) {
                if (name.endsWith('.js') && (directory !== 'services' || /^(research-|report-mentions)/.test(name))) files.push(directory + '/' + name);
            }
        }
        const hash = createHash('sha256').update('report-render-cache-v1');
        for (const file of files.sort()) hash.update(file).update(await fs.readFile(path.join(root, file)));
        // Absolute same-origin manual links depend on the configured public URL.
        hash.update(require('../utils/seo').absoluteUrl('/'));
        return hash.digest('hex');
    })();
    return versionPromise;
}

class ResearchCacheDisk {
    constructor(cache, { filename = process.env.REPORT_RENDER_CACHE_PATH || path.join(root, 'data/cache/report-renders.json'), version = cacheVersion } = {}) {
        this.cache = cache;
        this.filename = filename;
        this.version = version;
        this.restoring = null;
        this.writing = null;
    }
    restore() {
        if (!this.restoring) this.restoring = this.read();
        return this.restoring;
    }
    async read() {
        if (this.filename === '0') return;
        try {
            const stat = await fs.stat(this.filename);
            if (stat.size > 80 * 1024 * 1024) return;
            const saved = JSON.parse(await fs.readFile(this.filename, 'utf8'));
            if (saved.version !== await this.version()) return;
            this.cache.import(saved.generations);
            console.log('[report cache] restored saved render cache');
        } catch (error) {
            if (error.code !== 'ENOENT') console.error('[report cache] restore skipped:', error.message);
        }
    }
    save() {
        if (this.filename === '0') return Promise.resolve();
        // Serialize writes so a slower older snapshot cannot replace a newer one.
        this.writing = (this.writing || Promise.resolve()).then(async () => {
            const temporary = this.filename + '.' + randomUUID() + '.tmp';
            try {
                const version = await this.version();
                const generations = this.cache.export();
                await fs.mkdir(path.dirname(this.filename), { recursive: true });
                await fs.writeFile(temporary, JSON.stringify({ version, generations }), { mode: 0o600 });
                await fs.rename(temporary, this.filename);
            } catch (error) {
                console.error('[report cache] save skipped:', error.message);
                await fs.unlink(temporary).catch(() => {});
            }
        });
        return this.writing;
    }
}
module.exports = { ResearchCacheDisk };
