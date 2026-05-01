#!/usr/bin/env node

require('dotenv').config();

const API_BASE = 'https://api.cloudflare.com/client/v4';
const DEFAULT_ZONE_NAME = 'cyber-lenin.com';

function printUsage() {
    console.log(`Usage:
  node scripts/cloudflare-purge.js /favicon.ico /img/og-image.png
  node scripts/cloudflare-purge.js https://cyber-lenin.com/apple-touch-icon.png
  node scripts/cloudflare-purge.js --dry-run /

Environment:
  CF_CACHE_PURGE_TOKEN   Cloudflare API token with Cache Purge and Zone Read
  CF_ZONE_ID             Optional. If missing, the script looks up cyber-lenin.com
  CF_ZONE_NAME           Optional. Defaults to cyber-lenin.com`);
}

function parseArgs(argv) {
    const args = {
        zoneName: process.env.CF_ZONE_NAME || process.env.CLOUDFLARE_ZONE_NAME || DEFAULT_ZONE_NAME,
        zoneId: process.env.CF_ZONE_ID || process.env.CLOUDFLARE_ZONE_ID || '',
        dryRun: false,
        urls: [],
    };

    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        const next = () => {
            i += 1;
            if (i >= argv.length) throw new Error(`Missing value for ${arg}`);
            return argv[i];
        };

        if (arg === '--zone') args.zoneName = next();
        else if (arg === '--zone-id') args.zoneId = next();
        else if (arg === '--dry-run') args.dryRun = true;
        else if (arg === '-h' || arg === '--help') {
            printUsage();
            process.exit(0);
        } else if (arg.startsWith('-')) {
            throw new Error(`Unknown argument: ${arg}`);
        } else {
            args.urls.push(arg);
        }
    }

    if (!args.urls.length) throw new Error('At least one URL or path is required');
    return args;
}

function normalizeUrl(input, zoneName) {
    if (/^https?:\/\//i.test(input)) {
        const url = new URL(input);
        return url.toString();
    }

    const path = input.startsWith('/') ? input : `/${input}`;
    return new URL(path, `https://${zoneName}`).toString();
}

function unique(values) {
    return [...new Set(values)];
}

async function cfRequest(endpoint, options = {}) {
    const token = process.env.CF_CACHE_PURGE_TOKEN || process.env.CLOUDFLARE_CACHE_PURGE_TOKEN;
    if (!token) throw new Error('CF_CACHE_PURGE_TOKEN is missing from environment');

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });
    const payload = await res.json();
    if (!res.ok || payload.success === false || payload.errors?.length) {
        const errors = (payload.errors || []).map((error) => error.message).join('; ');
        throw new Error(`Cloudflare API error ${res.status}: ${errors || res.statusText}`);
    }
    return payload;
}

async function resolveZoneId(args) {
    if (args.zoneId) return args.zoneId;

    const payload = await cfRequest(`/zones?name=${encodeURIComponent(args.zoneName)}&status=active&per_page=1`);
    const zone = payload.result && payload.result[0];
    if (!zone || !zone.id) throw new Error(`Could not find active Cloudflare zone: ${args.zoneName}`);
    return zone.id;
}

async function purgeUrls(zoneId, urls) {
    await cfRequest(`/zones/${zoneId}/purge_cache`, {
        method: 'POST',
        body: JSON.stringify({ files: urls }),
    });
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const urls = unique(args.urls.map((url) => normalizeUrl(url, args.zoneName)));

    if (urls.length > 30) {
        throw new Error('Cloudflare purge_cache accepts up to 30 file URLs per request');
    }

    if (args.dryRun) {
        console.log('Dry run. URLs that would be purged:');
        for (const url of urls) console.log(`  ${url}`);
        return;
    }

    const zoneId = await resolveZoneId(args);
    await purgeUrls(zoneId, urls);

    console.log(`Purged ${urls.length} URL${urls.length === 1 ? '' : 's'} from ${args.zoneName}:`);
    for (const url of urls) console.log(`  ${url}`);
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
