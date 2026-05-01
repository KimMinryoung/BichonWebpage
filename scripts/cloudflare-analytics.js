#!/usr/bin/env node

require('dotenv').config();

const fs = require('fs');
const path = require('path');

const API_BASE = 'https://api.cloudflare.com/client/v4';
const DEFAULT_ZONE_NAME = 'cyber-lenin.com';
const DEFAULT_DAYS = 7;
const DEFAULT_TOP = 20;

function parseArgs(argv) {
    const args = {
        zoneName: process.env.CF_ZONE_NAME || process.env.CLOUDFLARE_ZONE_NAME || DEFAULT_ZONE_NAME,
        zoneId: process.env.CF_ZONE_ID || process.env.CLOUDFLARE_ZONE_ID || '',
        days: DEFAULT_DAYS,
        top: DEFAULT_TOP,
        json: false,
        since: '',
        until: '',
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
        else if (arg === '--days') args.days = Number.parseInt(next(), 10);
        else if (arg === '--top') args.top = Number.parseInt(next(), 10);
        else if (arg === '--since') args.since = next();
        else if (arg === '--until') args.until = next();
        else if (arg === '--json') args.json = true;
        else if (arg === '-h' || arg === '--help') {
            printUsage();
            process.exit(0);
        } else {
            throw new Error(`Unknown argument: ${arg}`);
        }
    }

    if (!Number.isFinite(args.days) || args.days < 1 || args.days > 90) {
        throw new Error('--days must be an integer from 1 to 90');
    }
    if (!Number.isFinite(args.top) || args.top < 1 || args.top > 100) {
        throw new Error('--top must be an integer from 1 to 100');
    }

    return args;
}

function printUsage() {
    console.log(`Usage:
  node scripts/cloudflare-analytics.js [--days 7] [--top 20]
  node scripts/cloudflare-analytics.js --since 2026-05-01T00:00:00Z --until 2026-05-02T00:00:00Z
  node scripts/cloudflare-analytics.js --json

Environment:
  CF_ANALYTICS_TOKEN      Cloudflare API token with Zone Analytics Read and Zone Read
  CLOUDFLARE_ZONE_ID      Optional. If missing, the script looks up cyber-lenin.com
  CF_ZONE_NAME            Optional. Defaults to cyber-lenin.com`);
}

function isoDateOnly(date) {
    return date.toISOString().slice(0, 10);
}

function resolveWindow(args) {
    if (args.since || args.until) {
        if (!args.since || !args.until) throw new Error('--since and --until must be provided together');
        const start = new Date(args.since);
        const end = new Date(args.until);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
            throw new Error('--since/--until must be ISO datetimes');
        }
        if (start >= end) throw new Error('--since must be before --until');
        return { start, end };
    }

    const end = new Date();
    const start = new Date(end.getTime() - args.days * 24 * 60 * 60 * 1000);
    return { start, end };
}

function splitIntoDailyWindows(window) {
    const windows = [];
    let cursor = new Date(window.start);
    while (cursor < window.end) {
        const next = new Date(Math.min(cursor.getTime() + 24 * 60 * 60 * 1000, window.end.getTime()));
        windows.push({ start: new Date(cursor), end: next });
        cursor = next;
    }
    return windows;
}

async function cfRequest(endpoint, options = {}) {
    const token = process.env.CF_ANALYTICS_TOKEN;
    if (!token) throw new Error('CF_ANALYTICS_TOKEN is missing from environment');

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

function buildQuery() {
    return `query SiteAnalytics($zoneTag: string, $filter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject, $pageFilter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject, $errorFilter: ZoneHttpRequestsAdaptiveGroupsFilter_InputObject, $topLimit: uint64) {
  viewer {
    zones(filter: { zoneTag: $zoneTag }) {
      totals: httpRequestsAdaptiveGroups(limit: 1, filter: $filter) {
        count
        sum { visits edgeResponseBytes }
      }
      daily: httpRequestsAdaptiveGroups(limit: 120, filter: $filter) {
        count
        sum { visits edgeResponseBytes }
        dimensions { date }
      }
      topPaths: httpRequestsAdaptiveGroups(limit: $topLimit, filter: $pageFilter, orderBy: [count_DESC]) {
        count
        sum { visits edgeResponseBytes }
        dimensions { clientRequestPath }
      }
      statuses: httpRequestsAdaptiveGroups(limit: 20, filter: $filter, orderBy: [count_DESC]) {
        count
        dimensions { edgeResponseStatus }
      }
      countries: httpRequestsAdaptiveGroups(limit: 20, filter: $filter, orderBy: [count_DESC]) {
        count
        dimensions { clientCountryName }
      }
      errorPaths: httpRequestsAdaptiveGroups(limit: 40, filter: $errorFilter, orderBy: [count_DESC]) {
        count
        dimensions { clientRequestPath edgeResponseStatus }
      }
    }
  }
}`;
}

async function fetchAnalytics(zoneId, window, args) {
    const filter = {
        datetime_geq: window.start.toISOString(),
        datetime_leq: window.end.toISOString(),
        requestSource: 'eyeball',
    };
    const pageFilter = {
        ...filter,
        edgeResponseStatus_geq: 200,
        edgeResponseStatus_lt: 400,
    };
    const errorFilter = {
        ...filter,
        edgeResponseStatus_geq: 400,
    };
    const body = {
        query: buildQuery(),
        variables: {
            zoneTag: zoneId,
            filter,
            pageFilter,
            errorFilter,
            topLimit: Math.max(100, args.top * 8),
        },
    };
    const payload = await cfRequest('/graphql', { method: 'POST', body: JSON.stringify(body) });
    const zone = payload.data?.viewer?.zones?.[0];
    if (!zone) throw new Error('No analytics data returned for zone');
    return zone;
}

function mergeAnalytics(chunks) {
    const merged = {
        totals: [{ count: 0, sum: { visits: 0, edgeResponseBytes: 0 } }],
        daily: [],
        topPaths: [],
        statuses: [],
        countries: [],
        errorPaths: [],
    };

    for (const chunk of chunks) {
        const totals = chunk.totals?.[0];
        if (totals) {
            merged.totals[0].count += Number(totals.count || 0);
            merged.totals[0].sum.visits += Number(totals.sum?.visits || 0);
            merged.totals[0].sum.edgeResponseBytes += Number(totals.sum?.edgeResponseBytes || 0);
        }
        for (const key of ['daily', 'topPaths', 'statuses', 'countries', 'errorPaths']) {
            merged[key].push(...(chunk[key] || []));
        }
    }

    return merged;
}

function isStaticAsset(requestPath) {
    return /^\/(?:css|js|img|puzzles|fonts|assets)\//.test(requestPath)
        || /\.(?:css|js|mjs|map|png|jpe?g|gif|webp|svg|ico|woff2?|json|xml|txt|gz|br)$/i.test(requestPath);
}

function normalizeContentPath(requestPath) {
    if (!requestPath || requestPath === '/') return '/';
    const withoutTrailingSlash = requestPath.length > 1 ? requestPath.replace(/\/+$/, '') : requestPath;
    return withoutTrailingSlash || '/';
}

function classifyPath(requestPath) {
    if (requestPath === '/') return 'home';
    if (/^\/post\/\d+$/.test(requestPath)) return 'post';
    if (requestPath === '/posts') return 'posts-index';
    if (/^\/reports\/research\/[^/]+$/.test(requestPath)) return 'research';
    if (requestPath === '/reports') return 'reports-index';
    if (/^\/ai-diary\/\d+$/.test(requestPath)) return 'diary';
    if (requestPath === '/ai-diary') return 'diary-index';
    if (/^\/hub\/[^/]+$/.test(requestPath)) return 'hub';
    if (requestPath === '/hub') return 'hub-index';
    if (/^\/p\/[^/]+$/.test(requestPath)) return 'page';
    if (requestPath === '/nonogram') return 'game';
    if (requestPath === '/nonogram/') return 'game';
    return 'other';
}

function loadPostTitles() {
    const dir = path.join(process.cwd(), 'data', 'post-cache');
    const titles = new Map();
    if (!fs.existsSync(dir)) return titles;
    for (const file of fs.readdirSync(dir)) {
        if (!/^\d+\.json$/.test(file)) continue;
        try {
            const raw = fs.readFileSync(path.join(dir, file), 'utf8');
            const post = JSON.parse(raw);
            if (post && post.id && post.title) titles.set(`/post/${post.id}`, post.title);
        } catch {
            // Cache files are best-effort labels only.
        }
    }
    return titles;
}

function bytesToHuman(bytes) {
    const value = Number(bytes || 0);
    if (value >= 1024 * 1024 * 1024) return `${(value / 1024 / 1024 / 1024).toFixed(2)} GB`;
    if (value >= 1024 * 1024) return `${(value / 1024 / 1024).toFixed(1)} MB`;
    if (value >= 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${value} B`;
}

function formatInt(value) {
    return Number(value || 0).toLocaleString('en-US');
}

function compactRows(rows, keyGetter, limit) {
    const totals = new Map();
    for (const row of rows || []) {
        const key = keyGetter(row);
        if (!key) continue;
        totals.set(key, (totals.get(key) || 0) + Number(row.count || 0));
    }
    return [...totals.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([key, count]) => ({ key, count }));
}

function buildReport(raw, window, args) {
    const postTitles = loadPostTitles();
    const totals = raw.totals?.[0] || { count: 0, sum: {} };
    const dailyByDate = new Map();
    for (const row of raw.daily || []) {
        const date = row.dimensions.date;
        const current = dailyByDate.get(date) || { date, requests: 0, visits: 0, bytes: 0 };
        current.requests += Number(row.count || 0);
        current.visits += Number(row.sum?.visits || 0);
        current.bytes += Number(row.sum?.edgeResponseBytes || 0);
        dailyByDate.set(date, current);
    }
    const daily = [...dailyByDate.values()]
        .sort((a, b) => a.date.localeCompare(b.date));

    const seenPaths = new Map();
    for (const row of raw.topPaths || []) {
        const normalized = normalizeContentPath(row.dimensions.clientRequestPath);
        if (isStaticAsset(normalized)) continue;
        const current = seenPaths.get(normalized) || { path: normalized, requests: 0, visits: 0, bytes: 0 };
        current.requests += Number(row.count || 0);
        current.visits += Number(row.sum?.visits || 0);
        current.bytes += Number(row.sum?.edgeResponseBytes || 0);
        seenPaths.set(normalized, current);
    }

    const topPages = [...seenPaths.values()]
        .map((row) => ({
            ...row,
            type: classifyPath(row.path),
            title: postTitles.get(row.path) || '',
        }))
        .sort((a, b) => b.requests - a.requests)
        .slice(0, args.top);

    const contentPages = topPages.filter((row) => row.type !== 'other').slice(0, args.top);

    return {
        zone: args.zoneName,
        window: {
            start: window.start.toISOString(),
            end: window.end.toISOString(),
            days: Math.round((window.end - window.start) / (24 * 60 * 60 * 1000) * 100) / 100,
        },
        totals: {
            requests: Number(totals.count || 0),
            visits: Number(totals.sum?.visits || 0),
            bytes: Number(totals.sum?.edgeResponseBytes || 0),
        },
        daily,
        topPages,
        contentPages,
        statuses: compactRows(raw.statuses, (row) => String(row.dimensions.edgeResponseStatus), args.top),
        countries: compactRows(raw.countries, (row) => row.dimensions.clientCountryName || 'Unknown', args.top),
        errorPaths: compactRows(raw.errorPaths, (row) => `${row.dimensions.edgeResponseStatus} ${row.dimensions.clientRequestPath || '/'}`, args.top),
    };
}

function printTable(rows, columns) {
    if (!rows.length) {
        console.log('  (no data)');
        return;
    }
    const widths = columns.map((column) => Math.max(
        column.label.length,
        ...rows.map((row) => String(column.value(row)).length),
    ));
    console.log(columns.map((column, index) => column.label.padEnd(widths[index])).join('  '));
    console.log(widths.map((width) => '-'.repeat(width)).join('  '));
    for (const row of rows) {
        console.log(columns.map((column, index) => String(column.value(row)).padEnd(widths[index])).join('  '));
    }
}

function printReport(report) {
    console.log(`Cloudflare analytics: ${report.zone}`);
    console.log(`Window: ${report.window.start} -> ${report.window.end}`);
    console.log('');
    console.log(`Requests: ${formatInt(report.totals.requests)}`);
    console.log(`Visits:   ${formatInt(report.totals.visits)}`);
    console.log(`Bytes:    ${bytesToHuman(report.totals.bytes)}`);

    console.log('\nDaily');
    printTable(report.daily, [
        { label: 'Date', value: (row) => row.date },
        { label: 'Requests', value: (row) => formatInt(row.requests) },
        { label: 'Visits', value: (row) => formatInt(row.visits) },
        { label: 'Bytes', value: (row) => bytesToHuman(row.bytes) },
    ]);

    console.log('\nTop content paths');
    printTable(report.contentPages, [
        { label: 'Requests', value: (row) => formatInt(row.requests) },
        { label: 'Visits', value: (row) => formatInt(row.visits) },
        { label: 'Type', value: (row) => row.type },
        { label: 'Path', value: (row) => row.title ? `${row.path} - ${row.title}` : row.path },
    ]);

    console.log('\nTop paths, excluding static assets');
    printTable(report.topPages, [
        { label: 'Requests', value: (row) => formatInt(row.requests) },
        { label: 'Visits', value: (row) => formatInt(row.visits) },
        { label: 'Type', value: (row) => row.type },
        { label: 'Path', value: (row) => row.path },
    ]);

    console.log('\nStatus codes');
    printTable(report.statuses, [
        { label: 'Status', value: (row) => row.key },
        { label: 'Requests', value: (row) => formatInt(row.count) },
    ]);

    console.log('\nCountries');
    printTable(report.countries, [
        { label: 'Country', value: (row) => row.key },
        { label: 'Requests', value: (row) => formatInt(row.count) },
    ]);

    console.log('\nTop error paths');
    printTable(report.errorPaths, [
        { label: 'Requests', value: (row) => formatInt(row.count) },
        { label: 'Status path', value: (row) => row.key },
    ]);

    console.log('\nNote: path counts are Cloudflare edge request aggregates, not database-side unique readers.');
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const window = resolveWindow(args);
    const zoneId = await resolveZoneId(args);
    const chunks = [];
    for (const chunkWindow of splitIntoDailyWindows(window)) {
        chunks.push(await fetchAnalytics(zoneId, chunkWindow, args));
    }
    const raw = mergeAnalytics(chunks);
    const report = buildReport(raw, window, args);

    if (args.json) {
        console.log(JSON.stringify(report, null, 2));
        return;
    }
    printReport(report);
}

main().catch((error) => {
    console.error(error.message);
    process.exit(1);
});
