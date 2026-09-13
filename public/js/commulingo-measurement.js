(function() {
    'use strict';
    var context = null;
    var touched = false;
    var pending = [];
    var sending = false;
    var retries = 0;
    var query = new URLSearchParams(location.search);
    function uuid() {
        if (!window.crypto) return '';
        if (typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
        if (typeof window.crypto.getRandomValues !== 'function') return '';
        var bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 15) | 64;
        bytes[8] = (bytes[8] & 63) | 128;
        return Array.prototype.map.call(bytes, function(byte, index) {
            return ([4, 6, 8, 10].indexOf(index) >= 0 ? '-' : '') + byte.toString(16).padStart(2, '0');
        }).join('');
    }
    function cookie(name) { return document.cookie.split('; ').indexOf(name + '=1') >= 0; }
    function setCookie(name, enabled) {
        var secure = location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = name + '=' + (enabled ? '1' : '') + '; Path=/; SameSite=Lax; Max-Age=' + (enabled ? '31536000' : '0') + secure;
    }
    if (query.has('learning_test')) setCookie('commulingo_test', query.get('learning_test') !== '0');
    function disabled() {
        return navigator.webdriver || navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true
            || cookie('commulingo_test') || cookie('commulingo_measurement_off');
    }
    var optout = document.getElementById('commuMeasurementOff');
    if (optout) {
        optout.checked = cookie('commulingo_measurement_off');
        optout.addEventListener('change', function() {
            setCookie('commulingo_measurement_off', optout.checked);
            if (optout.checked) pending = [];
        });
    }
    ['click', 'keydown', 'pointerdown'].forEach(function(name) {
        document.addEventListener(name, function(event) { if (event.isTrusted) touched = true; }, true);
    });
    function flush() {
        if (sending || !pending.length || disabled()) return;
        sending = true;
        var item = pending[0];
        var retry = false;
        fetch('/commulingo/measurement', {
            method: 'POST', credentials: 'same-origin', keepalive: true,
            headers: { 'Content-Type': 'application/json', 'x-commulingo-measurement': '1' },
            body: JSON.stringify(item)
        }).then(function(res) {
            if (res.ok || (res.status >= 400 && res.status < 500 && res.status !== 429)) pending.shift();
            else retry = true;
        }).catch(function() { retry = true; }).finally(function() {
            sending = false;
            retries = retry ? retries + 1 : 0;
            if (pending.length && retries <= 3) setTimeout(flush, retry ? 2000 : 0);
            else if (retries > 3) { pending = []; retries = 0; }
        });
    }
    function emit(event, correct) {
        if (!context || !touched || disabled()) return;
        var eventId = uuid();
        if (!eventId) return;
        if (pending.length >= 100) return;
        pending.push(Object.assign({}, context, { eventId: eventId, event: event, correct: correct }));
        flush();
    }
    function start() {
        if (!context || context.started || !touched || disabled()) return;
        context.started = true;
        emit('started');
    }
    window.CommuLingoMeasurement = {
        stop: function() { context = null; },
        begin: function(kind, id, version, mode) {
            var runId = uuid();
            if (!runId) return;
            context = { runId: runId, kind: kind, contentId: id, version: String(version || ''),
                lang: document.documentElement.lang === 'en' ? 'en' : 'ko', mode: mode, step: 0, started: false };
            start();
        },
        answer: function(correct) {
            if (!context || !touched || disabled()) return;
            start();
            context.step += 1;
            emit('answered', !!correct);
        },
        complete: function() { if (context && context.step > 0) emit('completed'); }
    };
})();
