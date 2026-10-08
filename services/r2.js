// Minimal Cloudflare R2 client (S3 API, SigV4) with no SDK dependency.
//
// Credentials come from .env, scoped to one bucket:
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET
// Used by scripts/archive-work-r2.js; the CommuLingo content store will read
// document bodies through the same client.

const crypto = require('crypto');

const REGION = 'auto';
const SERVICE = 's3';

function r2Config(env = process.env) {
    const cfg = {
        accountId: env.R2_ACCOUNT_ID || '',
        accessKeyId: env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: env.R2_SECRET_ACCESS_KEY || '',
        bucket: env.R2_BUCKET || '',
    };
    const missing = [['R2_ACCOUNT_ID', cfg.accountId], ['R2_ACCESS_KEY_ID', cfg.accessKeyId],
        ['R2_SECRET_ACCESS_KEY', cfg.secretAccessKey], ['R2_BUCKET', cfg.bucket]]
        .filter(([, v]) => !v).map(([k]) => k);
    if (missing.length) throw new Error(`R2 credentials missing in .env: ${missing.join(', ')}`);
    return cfg;
}

const sha256Hex = (data) => crypto.createHash('sha256').update(data).digest('hex');
const hmac = (key, data) => crypto.createHmac('sha256', key).update(data).digest();

// RFC 3986 encoding as SigV4 expects (encodeURIComponent leaves !'()* alone).
function uriEncode(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function objectPath(bucket, key) {
    return '/' + uriEncode(bucket) + (key ? '/' + key.split('/').map(uriEncode).join('/') : '');
}

function signedRequest(cfg, { method, key = '', query = {}, headers = {}, body = '' }) {
    const host = `${cfg.accountId}.r2.cloudflarestorage.com`;
    const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
    const date = amzDate.slice(0, 8);
    const payloadHash = sha256Hex(body);
    const path = objectPath(cfg.bucket, key);
    const canonicalQuery = Object.keys(query).sort()
        .map(k => `${uriEncode(k)}=${uriEncode(String(query[k]))}`).join('&');
    const allHeaders = { ...headers, host, 'x-amz-content-sha256': payloadHash, 'x-amz-date': amzDate };
    const names = Object.keys(allHeaders).map(h => h.toLowerCase()).sort();
    const lower = Object.fromEntries(Object.entries(allHeaders).map(([k, v]) => [k.toLowerCase(), String(v).trim()]));
    const canonicalHeaders = names.map(n => `${n}:${lower[n]}\n`).join('');
    const signedHeaders = names.join(';');
    const canonicalRequest = [method, path, canonicalQuery, canonicalHeaders, signedHeaders, payloadHash].join('\n');
    const scope = `${date}/${REGION}/${SERVICE}/aws4_request`;
    const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256Hex(canonicalRequest)].join('\n');
    let signingKey = hmac('AWS4' + cfg.secretAccessKey, date);
    for (const part of [REGION, SERVICE, 'aws4_request']) signingKey = hmac(signingKey, part);
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');
    lower.authorization = `AWS4-HMAC-SHA256 Credential=${cfg.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    delete lower.host;
    const url = `https://${host}${path}${canonicalQuery ? '?' + canonicalQuery : ''}`;
    return fetch(url, { method, headers: lower, body: method === 'GET' || method === 'HEAD' ? undefined : body });
}

async function check(res, what) {
    if (res.ok) return res;
    const text = await res.text().catch(() => '');
    throw new Error(`R2 ${what} failed: HTTP ${res.status} ${text.slice(0, 300)}`);
}

const xmlDecode = s => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'").replace(/&amp;/g, '&');

function createR2Client(cfg = r2Config()) {
    return {
        bucket: cfg.bucket,
        async put(key, body, contentType = 'application/octet-stream') {
            await check(await signedRequest(cfg, { method: 'PUT', key, body, headers: { 'content-type': contentType } }), `PUT ${key}`);
        },
        async get(key) {
            const res = await signedRequest(cfg, { method: 'GET', key });
            if (res.status === 404) return null;
            await check(res, `GET ${key}`);
            return Buffer.from(await res.arrayBuffer());
        },
        async copy(fromKey, toKey) {
            const source = objectPath(cfg.bucket, fromKey);
            await check(await signedRequest(cfg, { method: 'PUT', key: toKey, headers: { 'x-amz-copy-source': source } }), `COPY ${fromKey}`);
        },
        // Map of key -> { size, etag } under the prefix.
        async list(prefix = '') {
            const out = new Map();
            let token = '';
            for (;;) {
                const query = { 'list-type': 2, prefix };
                if (token) query['continuation-token'] = token;
                const xml = await (await check(await signedRequest(cfg, { method: 'GET', query }), `LIST ${prefix}`)).text();
                for (const m of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
                    const field = name => (m[1].match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`)) || [])[1] || '';
                    out.set(xmlDecode(field('Key')), { size: Number(field('Size')), etag: xmlDecode(field('ETag')).replace(/"/g, '') });
                }
                const next = (xml.match(/<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/) || [])[1];
                if (!/<IsTruncated>true<\/IsTruncated>/.test(xml) || !next) return out;
                token = xmlDecode(next);
            }
        },
    };
}

module.exports = { createR2Client, r2Config, uriEncode, objectPath };
