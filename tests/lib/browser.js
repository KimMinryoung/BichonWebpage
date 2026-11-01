// Chromium for the browser tests. Playwright's own build is used when it is
// installed for this Playwright version; otherwise a preinstalled Chromium:
// CHROMIUM_PATH, or /opt/pw-browsers/chromium (Claude Code cloud sessions
// ship one there, built for a different Playwright release).
const fs = require('node:fs');
const { chromium } = require('playwright');

const FALLBACKS = [process.env.CHROMIUM_PATH, '/opt/pw-browsers/chromium'];

// undefined: Playwright's own build; a path: the fallback to launch; null: none.
function chromiumExecutable() {
    try {
        if (fs.existsSync(chromium.executablePath())) return undefined;
    } catch {
        // executablePath() throws when Playwright has no build registered.
    }
    return FALLBACKS.find(file => file && fs.existsSync(file)) || null;
}

// Why the browser tests cannot run here, or null when they can.
function chromiumMissing() {
    return chromiumExecutable() === null
        ? 'no Chromium for Playwright ' + require('playwright/package.json').version
            + ' (npx playwright install chromium, or set CHROMIUM_PATH)'
        : null;
}

function launchChromium(options = {}) {
    const executablePath = chromiumExecutable();
    return chromium.launch(executablePath ? { ...options, executablePath } : options);
}

module.exports = { chromiumMissing, launchChromium };
