/**
 * test-error-page.js — 404/500 페이지가 locals 없이도 렌더되는지 검증.
 *
 * server.js의 locals 미들웨어를 타지 못한 요청(정적 자산 경로, 앞단
 * 미들웨어에서 실패한 요청)이 에러 핸들러에 도달하면 레이아웃이
 * "lang is not defined"로 터져 사용자가 빈 화면을 받았다 (2026-08-02).
 */

const assert = require('assert');
const http = require('http');
const path = require('path');
const express = require('express');
const errorPage = require('../utils/error-page');

function buildApp() {
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'views'));

    // locals 미들웨어 없음 — 재현 조건 그대로.
    app.get('/boom', () => { throw new Error('synthetic route failure'); });
    app.use((req, res) => errorPage.notFound(res));
    app.use((err, req, res, next) => errorPage.serverError(res));
    return app;
}

function get(port, urlPath) {
    return new Promise((resolve, reject) => {
        http.get({ port, path: urlPath }, (res) => {
            let body = '';
            res.on('data', (c) => { body += c; });
            res.on('end', () => resolve({ status: res.statusCode, body }));
        }).on('error', reject);
    });
}

async function main() {
    const server = buildApp().listen(0);
    await new Promise((r) => server.once('listening', r));
    const port = server.address().port;
    let failures = 0;

    for (const [label, urlPath, expected, needle] of [
        ['404 (locals 없음)', '/nope', 404, '404'],
        ['500 (라우트 예외)', '/boom', 500, 'Error'],
    ]) {
        const res = await get(port, urlPath);
        try {
            assert.strictEqual(res.status, expected, `status ${res.status} != ${expected}`);
            assert.ok(res.body.includes(needle), `본문에 "${needle}" 없음`);
            assert.ok(res.body.trim().length > 0, '본문이 비어 있음');
            // 평문 최후수단이 아니라 실제 레이아웃이 렌더됐는지까지 확인한다.
            assert.ok(res.body.includes('<!DOCTYPE html>'), '레이아웃이 아닌 평문으로 떨어짐');
            assert.ok(res.body.includes('<nav'), 'nav 파셜이 렌더되지 않음');
            console.log(`  ok   ${label}: ${res.status}, ${res.body.length} bytes, 레이아웃+nav 렌더, "${needle}" 포함`);
        } catch (e) {
            failures += 1;
            console.log(`  FAIL ${label}: ${e.message}`);
            console.log(`       body[0:200]=${JSON.stringify(res.body.slice(0, 200))}`);
        }
    }

    server.close();
    console.log(failures === 0 ? 'error page smoke ok' : `error page smoke FAILED (${failures})`);
    process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error(e); process.exit(1); });
