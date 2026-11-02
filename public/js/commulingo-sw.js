// CommuLingo's service worker, served by routes/commulingo-pwa.js as
// /commulingo/sw.js with scope /commulingo (and /en/commulingo/sw.js with
// scope /en/commulingo). It never changes what an online reader gets:
// - pages in scope: network first; a copy is kept, and offline the kept copy
//   (or a short offline notice) answers;
// - lesson, deck and catalog data: network first, the kept copy offline;
// - CSS, JS and fonts: the kept copy at once, refreshed in the background
//   (their URLs change with their content).
// Everything else (other pages, POSTs, progress, other origins) is untouched.
/* global self, caches, fetch, Response, URL */
var PAGES = 'commulingo-pages-v1';
var DATA = 'commulingo-data-v1';
var STATIC = 'commulingo-static-v1';
var LIMITS = {};
LIMITS[PAGES] = 150;
LIMITS[DATA] = 150;
LIMITS[STATIC] = 200;

var scope = new URL(self.registration.scope).pathname.replace(/\/$/, '');
var english = scope.indexOf('/en/') === 0;

self.addEventListener('install', function () {
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(caches.keys().then(function (keys) {
        return Promise.all(keys.filter(function (key) {
            return key.indexOf('commulingo-') === 0 && !LIMITS[key];
        }).map(function (key) { return caches.delete(key); }));
    }).then(function () { return self.clients.claim(); }));
});

function inScope(path) {
    return (path === scope || path.indexOf(scope + '/') === 0) && !/\/admin(?:\/|$)/.test(path);
}

function isData(path) {
    return path === '/commulingo/catalog.json'
        || /^\/commulingo\/lesson\/[^/]+$/.test(path)
        || /^\/commulingo\/drill\/deck\/[^/]+$/.test(path)
        || /^\/commulingo\/drill\/shorts\/feed\/[^/]+$/.test(path);
}

function isStatic(path) {
    return /^\/(?:assets|css|js|fonts|icons|flags)\//.test(path);
}

// Oldest entries go first once a cache passes its limit.
function trim(name) {
    return caches.open(name).then(function (cache) {
        return cache.keys().then(function (keys) {
            var extra = keys.length - LIMITS[name];
            return Promise.all(keys.slice(0, Math.max(0, extra)).map(function (key) { return cache.delete(key); }));
        });
    });
}

function keep(name, request, response) {
    if (!response || response.status !== 200 || response.type !== 'basic') return;
    var copy = response.clone();
    caches.open(name).then(function (cache) {
        return cache.put(request, copy);
    }).then(function () { return trim(name); }).catch(function () {});
}

function offlinePage() {
    var text = english
        ? ['Offline', 'You are offline and this page has not been opened on this device before. Pages you have opened are available offline.', 'Back to CommuLingo']
        : ['오프라인', '인터넷에 연결되어 있지 않고, 이 화면은 이 기기에서 연 적이 없습니다. 열어 본 화면은 오프라인에서도 볼 수 있습니다.', '공산링고로'];
    var html = '<!doctype html><html lang="' + (english ? 'en' : 'ko') + '"><head><meta charset="utf-8">'
        + '<meta name="viewport" content="width=device-width, initial-scale=1"><title>' + text[0] + '</title>'
        + '<style>body{margin:0;padding:48px 16px;font:16px/1.6 system-ui,sans-serif;background:#010409;color:#e6edf3}'
        + '@media (prefers-color-scheme: light){body{background:#faf2da;color:#1f2328}}'
        + 'main{max-width:36rem;margin:0 auto}a{color:inherit}</style></head><body><main><h1>' + text[0] + '</h1><p>'
        + text[1] + '</p><p><a href="' + scope + '">' + text[2] + '</a></p></main></body></html>';
    return new Response(html, { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function networkFirst(name, request, fallback) {
    return fetch(request).then(function (response) {
        keep(name, request, response);
        return response;
    }).catch(function (err) {
        return caches.open(name).then(function (cache) {
            // Pages vary on Cookie and Accept-Language for HTTP caches; offline,
            // the kept copy is the one to show whatever they were.
            return cache.match(request, { ignoreVary: true });
        }).then(function (hit) {
            if (hit) return hit;
            if (fallback) return fallback();
            throw err;
        });
    });
}

function staleWhileRevalidate(request) {
    return caches.open(STATIC).then(function (cache) {
        return cache.match(request).then(function (hit) {
            var fresh = fetch(request).then(function (response) {
                keep(STATIC, request, response);
                return response;
            });
            if (hit) {
                fresh.catch(function () {});
                return hit;
            }
            return fresh;
        });
    });
}

self.addEventListener('fetch', function (event) {
    var request = event.request;
    if (request.method !== 'GET') return;
    var url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (request.mode === 'navigate') {
        if (inScope(url.pathname)) event.respondWith(networkFirst(PAGES, request, offlinePage));
        return;
    }
    if (isData(url.pathname)) event.respondWith(networkFirst(DATA, request));
    else if (isStatic(url.pathname)) event.respondWith(staleWhileRevalidate(request));
});
