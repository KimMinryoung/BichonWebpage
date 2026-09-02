# Site-wide Optimization & Refactoring Pass

> **Progress log** (update after each phase; next session starts here)
> - 2026-08-04: Plan approved by user. Decisions: deep refactors included (gradual), `font-display: swap` approved, pg_stat_statements skipped (no pg restart).
> - 2026-08-04: Phase 0 baseline recorded (see below). **Next: Phase 1 나머지.**
> - 2026-08-04: Phase 1 부분 완료 — A1 (recentDictionaryItems 60s memo, `services/commulingo-updates.js`) + B8 (`/flags/` in isStaticAssetPath, `server.js`) 커밋됨, dev-preview 검증 완료 (홈 200 + recent 섹션 렌더, flags 200 svg). **아직 배포 안 함.** 남은 것: A9 (passkey 세션 캐시 + chat proxy destroy + chat.js AbortController), A6-lite (sitemap/rss/atom Redis 캐시), A7-safe (listPagesLite), 그리고 신규 발견 `commulingo_people_revisions` 183k seq_scan 조사. 전부 끝나면 deploy #1.
> - 2026-08-04: A9 서버 측 완료 — chat 프록시 res close 시 `proxyReq.destroy()` (writer 브랜치와 대칭), passkey fingerprint 60초 세션 캐시 (`server.js`). dev-preview 스모크 통과 (home/chat/flags 200). **A9 클라이언트 측(chat.js AbortController + reader.cancel, `public/js/chat.js:820-827`)은 미착수** — stop/regenerate 수동 테스트 필요해서 다음 세션으로. 커밋됨, 미배포. deploy #1 전 검증 항목: 채팅 스트리밍 + 중간 탭 닫기, sitemap 동일 출력, 홈 HTML 동일.
> - 2026-08-04: A6-lite 완료 — sitemap/rss/atom XML을 Redis 600초 캐시(`cachedXml`, `routes/public.js`; 피드는 lang별 키, sitemap은 단일 키 — 출력에 lang 의존 없음 확인). dev-preview 검증: sitemap 160ms→2.8ms, 출력 byte-identical, rss/atom 200 + 올바른 content-type. 커밋됨, 미배포.
> - 2026-08-04: **deploy #1 실행 완료** (커밋 1c673e0, 사용자 지시로 부분 상태에서 조기 배포). 프로덕션 검증: 홈 10회 히트에 `commulingo_people` seq_scan delta=0 (A1 작동), 전 페이지 200, sitemap 2.4ms 캐시 적중, flags 정상, 로그 에러 없음, cyber-lenin.com 200 + recent 섹션 렌더.
> - 2026-08-04: **Phase 1 완료.** (1) `people_revisions` 183k seq_scan 원인 규명 — leninbot maintainer의 인물별 상관 서브쿼리(`entity_id LIKE p.id||'/%'` + `changed_by LIKE`)가 기존 인덱스를 못 타서 폴마다 ~1,284회 풀스캔. `entity_id text_pattern_ops` 인덱스 추가(마이그레이션 121, 프로덕션 적용·EXPLAIN 검증 2.3ms→0.4ms). (2) A7: `listPages`에서 TOAST된 html_body 컬럼 제거, has_en_body SQL 플래그로 대체 — 전 14페이지 구/신 플래그 동등성 확인, dev-preview에서 /reports·/p/* 200. (3) A9 클라이언트 측은 **불필요 판정**: 스트리밍 중 `busy` 가드가 새 대화/재전송을 차단하고, 탭 닫기는 브라우저가 fetch를 자동 중단 → 배포된 서버 측 `proxyReq.destroy()`가 업스트림 정리. AbortController를 넣어도 실행 경로가 없음.
> - 남은 실사용 확인 1건: 채팅 스트리밍 + 중간 탭 닫기 (서버 측 destroy 검증). 사용자 채팅 사용 시 자연 확인됨.
> - 2026-08-04: **Phase 2 완료·배포** (커밋 2b49d2f). report-mentions 빌드를 문서 단위 setImmediate 양보로 변경 — 리빌드 중 최악 지연 3.2s→0.43s (dev-preview 부하 측정). 스토어 5곳 타이머 지터, 풀 min 2 + idle 300s, genealogy/docs/catalog 500ms stat 디바운스 (계보도 touch 후 리로드 정상 확인). 배포 후 전 페이지 200.
> - ⚠ 확인 대기 1건: 배포 직후 pg 연결 40개(프로드+dev-preview 풀이 idle 300s 동안 유지, max_connections 100이라 여유). 5분 뒤 min 2 근처로 드레인되는지 다음 틱에서 재확인 — 안 되면 DB_IDLE_TIMEOUT_MS 120s로 축소 검토.
> - 2026-08-04: 풀 드레인 확인 — 24개(전부 idle)로 안정. 프로드 스토어의 분당 리프레시 워킹셋이라 설계 의도대로, max_connections 100 대비 여유. 대기 항목 해소.
> - 2026-08-04: **Phase 3 완료·배포** (커밋 8cd3aae). termPanelMemo/eventPanelMemo (personBodyMemo 패턴 + 스냅숏 ref 검사, 미지 id 미캐시), 사건 페이지 용어 풀스캔 2곳 스냅숏별 캐시, peopleShellMemo. 검증: prod/dev 14개 페이지 byte-diff 동일, 배포 후 프로드 페이지도 배포 전과 동일.
> - 2026-08-04: **Phase 4 완료·배포** (커밋 85fbf61). GIT_SHA 캐시버스팅 검증: 재시작 후 ?v=85fbf616b5f1 유지. 국기 SVGO p0 (640→176KB, 비교 페이지로 사용자 승인). 삭제 ~1.9천 줄. **탐사 보고 정정 2건**: layouts/main.ejs는 error-page.js가 사용(유지), /reports/private 심은 실링크 존재(유지). puzzles root-소유 백업 1.35MB는 sudo 필요해서 미처리 — 사용자가 직접: `sudo rm -rf public/puzzles/.minchong-15.owner-nobody-backup`
> - 2026-08-04: **Phase 5 완료·배포** (커밋 ef4631d, 사용자 dev-preview 승인 후). Pretendard v1.3.9 dynamic-subset(92 슬라이스) + Plex woff2 + display:swap, 매 페이지 폰트 preload 제거. 측정: 한글 용어 페이지 폰트 전송 2.77MB→624KB. 라이브에서 슬라이스 immutable + CF HIT 확인. 참고: Pretendard 업그레이드 시 dist/web/variable 슬라이스 92개 + CSS 재-vendor 필요 (family명 'Pretendard'로 sed, 경로 /fonts/pretendard/woff2-dynamic-subset/).
> - 2026-08-04: **Phase 6 완료·배포** (커밋 dddafb9 + e16bbb9). 노노그램 35KB 인라인 → 정적 파일(HTML 1219줄→74줄), nav.js defer(39페이지 파서 차단 해제), report-view/chat/page-view의 CDN 스크립트 defer 체인(+page-view 인라인은 DOMContentLoaded로). 헤드리스로 마크다운 렌더·새니타이즈·채팅 UI·노노그램 보드 검증.
> - **B5(WebAuthn 공용 JS)는 의도적 보류**: 실제 공유 가능 코어는 jsonFetch·취소판정 ~30줄(감사의 21KB 추정은 페이지별 로직+EJS 주입 문자열 포함). no-store 인증 페이지 몇 KB 이득 대비 어드민 잠금 리스크 큼. 재검토 시 사용자 실기기 패스키 테스트 동반 필수 (복구: scripts/reset-passkeys.js).
> - Phase 0: ✅  Phase 1: ✅  Phase 2: ✅  Phase 3: ✅  Phase 4: ✅  Phase 5: ✅  Phase 6: ✅  Phase 7: ☐
> - 2026-08-04: **Phase 7 진행 중** — C5(localize 9중복+renderAppView+관련문헌 매핑 통합, 14페이지 byte-diff 동일), C4(admin API 19핸들러 → h() 래퍼, 응답 형태 검증), C2(redis-json 공용화, report-cache 122→56줄), C3(entry-routes 팩토리, posts·ai-diary ~250줄 통합, C8의 catch 중복도 해소) 완료·배포 (커밋 288fb4a…3e06de7).
> - 2026-08-04: **보너스 버그 수정**: C3 byte-diff가 잡아낸 EJS 전역 누출 — 13개 뷰의 `<% pageTitle = ... %>` bare 대입이 with() 스코프를 새어 Node 전역이 되고 404 등 이후 요청에 누출 (프로드 404가 노노그램 설명을 표시). include 인자 전달로 수리, 프로드에서 누출 소멸 확인.
> - 2026-08-04: **Phase 7 완결 — 전체 계획 완료.** C8(hub/reports 헬퍼, 8페이지 diff 동일), C7(config/services.js + proxyLeninbot 통합, admin 302/404 클로킹 정상), C1(snapshot-store.js 팩토리 — 레지스트리 2종 + 사전형 3종 이관, 12페이지 diff 동일 + 스냅숏 md5 불변 + drift-check 통과). A4는 탈락 확정(aliases/scenes/redirects에 updated_at 없음 + DELETE+INSERT 편집이라 count 시그니처가 실변경 놓침).
>
> ## 2차 패스 (2026-09-02, 계획: ~/.claude/plans/rustling-exploring-peach.md)
> - 2026-09-02: **배치 0 완료·배포** (커밋 f2d24f8 + f990f31). 원인: `createRegistrySnapshotStore`가 변경 감지 없이 매분 `install(rows)` → `blocklistRef`/`termCategoriesRef` 회전 → linkify `stdMemo`/`indexMemo` 매분 리셋(163ms 동기) → WeakMap(indexes) 메모 전부 폐기, plain Map 셋(`researchRenderMemo`·`bookPageMemo`·`lessonPayloadMemo`)이 `indexesRef`로 옛 세대를 고정 → 약 7.9h마다 2GB 힙 OOM(9-01 21:56, 9-02 05:40 재시작). 수정: 레지스트리 스토어 sha1 변경 감지(파일 원문 시드 포함), 세 메모 WeakMap(indexes)→Map. 검증: prod↔dev 48/48 바이트 동일, 배포 전후 prod 46/46 동일, 스모크 6종, 416요청 3회 크롤 뒤 dev RSS 183MiB 복귀, dev 인물 p90 48→17ms(매분 :40 절벽 소멸). 신규 `scripts/diff-preview`(집 검증법 스크립트화). 3시간 RSS 샘플 파일은 세션 scratchpad `prod-rss-3h.txt`.
> - 2026-09-02: **배치 1 완료·배포** (커밋 c48e09b, b255632, c9cab7d). utils/async-handler.js(.md 피드 4개·lesson 라우트), process unhandledRejection/uncaughtException 핸들러, keepAliveTimeout 65s, 종료 시 closeIdleConnections/closeAllConnections(SIGTERM clean exit 465ms, 이전엔 10초 강제 종료), 비인증 `?fresh=1` 제거(433~689ms→37ms)·사이트맵 `{fresh:true}` 제거, `/commulingo/api/people` 8.9MB JSON 메모, reports 캐시 쓰기 Promise.all, Redis 재접속 백오프+로그 스로틀, pg statement_timeout 60s·set_config 제거, manifest pospelov 사건 참조 great-terror, `npm test`(scripts/test). 검증: prod↔dev 48/48 동일, 배포 전후 동일, 고의 실패 주입으로 exit 1 확인. 다음: 배치 2(CSRF 지연 발급·의존성 패치·Dockerfile 고정·deploy 게이트·CDN 핀) — **사용자 패스키 실기기 테스트 게이트**.
> - 배치 2~9는 계획 파일 참조.
>
> ## 최종 결과 (베이스라인 대비, 2026-08-04)
> - 용어 페이지 warm 10~14ms → **4~8ms**, 인물 페이지 12~20ms → **5~13ms**, sitemap 17~30ms → **4ms**
> - `commulingo_people` seq_scan 요청당 증가 → **정지** (분당 리프레시만), `people_revisions` 183k에서 **동결**
> - 폰트: 페이지당 2.77MB → **624KB** (이후 페이지는 캐시), asset 캐시버스팅 재시작-안정화
> - 죽은 코드/자산 ~2.3천 줄+2.6MB 제거, 중복 스캐폴드 ~1천 줄 통합 (localize 9벌, 스토어 5벌, 라우트 2벌, 핸들러 19벌…)
> - 발견·수정한 기존 버그: EJS bare 대입 전역 누출(13뷰), maintainer 풀스캔 인덱스(마이그레이션 121), 미사용 의존성/파일
> - 전 페이지 스윕 16라우트 200, drift-check OK, 에러 로그 없음. 총 15회 배포.
> - 미처리 1건: `sudo rm -rf public/puzzles/.minchong-15.owner-nobody-backup` (root 소유 1.35MB 중복 — 사용자 직접)

## Phase 0 baseline (2026-08-04 ~02:00 UTC, prod localhost:3000)

Latency, 10× `curl -w '%{time_total}'` (first hit then warm):
- `/` — 0.061 cold, ~0.010-0.013 warm
- `/commulingo/people` — ~0.012-0.020
- `/commulingo/terms/nep` — ~0.010-0.014 (the 3.2 s report-mentions stall is intermittent, not caught in this sample)
- `/sitemap.xml` — 0.073 cold, ~0.017-0.030 warm

`pg_stat_user_tables` seq_scan (top; compare deltas after Phase 1-2):
```
commulingo_people_revisions  seq_scan=183085  seq_tup_read=939098921   <-- NOT in audit findings! investigate
commulingo_people            seq_scan=44269   seq_tup_read=54379910    (A1 homepage UNION)
commulingo_history_events    seq_scan=27387
commulingo_terms             seq_scan=16821
(remaining commulingo_* tables cluster at ~13.8-16.7k = the 60s snapshot refresh)
research_documents           seq_scan=3148    (A2 report-mentions full pulls)
```
Containers at rest: frontend CPU 0.00% / 471 MiB; pg CPU 0.01% / 675 MiB.

**New finding for Phase 1**: `commulingo_people_revisions` at 183k seq scans / 939M tuples read dwarfs everything — find what queries it (likely people-admin-store or the people refresh) and whether it needs an index or narrower query.

## Context

Broad "optimize and refactor" pass over cyber-lenin.com (Express/EJS/PostgreSQL). Scope confirmed with user: **everything, prioritized**, at **conservative risk** — behavior-preserving only, each phase verified on dev-preview before deploy. Decisions: include the deep refactors (gradual migration), `font-display: swap`, skip pg_stat_statements (no pg restart).

Three exploration agents audited server structure, frontend assets, and the data layer (measured live against running containers); a Plan agent sequenced the work and corrected several raw findings. The site is already well-architected (modular routes, reference-stable snapshot stores, correct cache headers, compression); problems are concentrated:

- **Fonts: 2.57 MB preloaded on every page** (`views/partials/head.ejs:34-37`) — unsubsetted 2.0 MB Pretendard variable woff2 + IBM Plex as raw TTF, all `font-display: block` (text invisible until loaded).
- **Homepage runs an uncached 3-table UNION ALL seq scan per request** (`services/commulingo-updates.js:69-102`) for a 2-item list — 44k seq scans of `commulingo_people` observed.
- **`services/report-mentions.js` buildIndex blocks the event loop 3.15 s** every 10 min + at boot (observed 3.2 s request stalls).
- **5 snapshot stores refresh simultaneously every 60 s** → 21 queries vs pool max 20; pool saturates then drains to 0 (no `min`/`idleTimeoutMillis`); 11.6 MB `JSON.stringify`+sha1 per minute just to detect no change.
- **`ASSET_VERSION` falls to boot-time `Date.now()`** (`server.js:32`; neither `.env` nor Dockerfile sets it) → every restart invalidates the whole Cloudflare 7-day CSS/JS cache.
- **~400 lines of copy-pasted snapshot-store scaffolding**; `routes/ai-diary.js` near-clone of posts routes; `localize()` defined 10×; dead code/assets (~1.6 MB incl. root-owned duplicate PNG, `connect-pg-simple`, `paginationHelper.js`).

### Corrections established during verification (do NOT undo)
- `/nonogram/` must NOT be added to `isStaticAssetPath` — the route reads `req.session` for CSRF. Only `/flags/` is safe to add.
- Term/event panel memos must cover only the pure part (presented term + rendered markdown/linkify HTML) — `relatedReports`/`relatedDocs`/`genealogies` refresh on their own cadences and must stay per-request, mirroring `personBodyMemo` (`routes/commulingo.js:103,436-465`).
- Sitemap/feeds: server-side Redis cache only; keep `private` headers unless XML is proven language-independent (Cloudflare ignores `Vary` for text).
- No `LIMIT` on `routes/admin.js:75` (would truncate admin listing — behavior change).
- The genealogy `soviet-foreign-policy.json` warning is already fixed by the user; no action.
- A4 (cheap change-detection signature) only inside the C1 factory, and only if all 12 child tables have `updated_at` (check schema first); people snapshot aggregates 12 tables.

## Phases

Each phase = its own commit series + one `scripts/deploy`. Dev loop: edit → `scripts/dev-preview restart` → verify on `<tailscale-ip>:3001` → commit+push → deploy. Commit prefixes fix/perf/refactor per type; never amend.

### Phase 0 — Baseline (no deploy, ~30 min)
Record: `pg_stat_user_tables` seq_scan counters for `commulingo_*`; 20× `curl -w '%{time_total}'` on `/`, a person page, a term page, `/sitemap.xml`; `docker stats leninbot-frontend` over 2 min (captures the 60s refresh spike). Save to scratchpad for after-comparison.

### Phase 1 — Server hot-path quick wins (deploy #1)
Files: `services/commulingo-updates.js`, `server.js`, `routes/public.js`, `config/page-store.js`, `public/js/chat.js`.
- **A1**: 60 s module-level memo (per-lang, coalesced in-flight promise) around `recentDictionaryItems`.
- **A9**: cache passkey `fingerprintsForUser` on `req.session` (short TTL) instead of a DB query per proxied request (`server.js:179-191`); add `proxyReq.destroy()` on `res close` in the POST `/chat` proxy branch (`server.js:360-369`, mirror writer branch at 352-359); add `AbortController` + `reader.cancel()` in `public/js/chat.js:820-827`.
- **A6-lite**: Redis-cache generated sitemap/rss/atom XML per lang, TTL 5-10 min (reuse `getJson`/`setJson` pattern from `config/redis-entry-cache.js`). Headers unchanged.
- **A7-safe**: add `listPagesLite` (drop `html_body`/`html_body_en`, 324 KB/call) in `config/page-store.js` for `/`, `/reports`, sitemap callers — grep first that none read the body.
- **B8**: add `/flags/` to `isStaticAssetPath` (`server.js:44-51`).

Verify: homepage HTML byte-identical (curl diff); `commulingo_people` seq_scan counter stops climbing per homepage hit; chat streaming works incl. mid-stream tab close (watch `docker logs`); stop/regenerate chat flows manually tested (abort semantics are the one behavior-adjacent change); `/sitemap.xml` output identical, second hit fast.

### Phase 2 — Event-loop & pool health (deploy #2)
Files: `services/report-mentions.js`, `config/database.js`, 5 snapshot stores (one line each), `data/commulingo/genealogy-store.js`, `data/commulingo/docs-store.js`.
- **A2**: chunk `buildIndex`'s `rows.forEach` with `setImmediate` batches (N docs per tick). The build is already coalesced (`pending`) and stale-while-refresh, so slower wall-clock is invisible.
- **A3**: random initial jitter before each store's `setInterval` so refreshes de-synchronize; `config/database.js` add `idleTimeoutMillis: 300000`, `min: 2`.
- **A8**: 500 ms freshness debounce on `genealogy-store.js:24-52` `readdirSync`/`statSync` and `docs-store.js:45` / `shards.js:251` `statSync`, copying the existing `shards.js:207-216` debounce pattern.

Verify: hammer a person page during a forced report-mentions rebuild (restart dev-preview, curl loop) — no multi-second stall; `pg_stat_activity` holds ~2 idle connections at rest, no saturation spike at minute boundaries; genealogy JSON edits in `data/` still live-reload within ~1 s.

### Phase 3 — Render memoization (deploy #3)
Files: `routes/commulingo-terms.js`, `routes/commulingo-events.js`, `routes/commulingo.js`.
- **A5**: `WeakMap(indexes) → Map(id → {definitionHtml, bodyHtml, presented})` memo in `buildTermPanel` (`commulingo-terms.js:333-375`) and `buildEventPanel` (`commulingo-events.js:140-170`) — pure parts only per correction above; also memoize `relatedTermsForEvent`/`pairedTermIdFor` 425-term scans (`commulingo-events.js:33-49`).
- **A10**: fold `routes/commulingo.js:257-263` filter-in-map and `:136-151` re-sort into the adjacent existing memo (`peopleGroupCardsMeta` pattern, `:99-127`), keyed on the same snapshot objects.

Verify: byte-diff rendered HTML of 3 term pages, 3 event pages, `/commulingo/people` (both langs) before/after; edit a term via admin on dev-preview → change appears after snapshot refresh (WeakMap identity invalidation works); relatedReports still updates on its 10-min cadence.

### Phase 4 — Cache foundation + dead weight (deploy #4; user gate: flag visuals)
Files: `Dockerfile`, `scripts/deploy`, `CLAUDE.md`, `views/partials/head.ejs`, `public/flags/*.svg`, deletions.
- **B2**: `scripts/deploy` already computes `$LOCAL` (git SHA) — add `--build-arg GIT_SHA=$LOCAL`; `ARG GIT_SHA` / `ENV GIT_SHA=$GIT_SHA` in Dockerfile. Fix stale CLAUDE.md:45 (`?v=<%= Date.now() %>` → assetVersion/GIT_SHA description). This must precede the font/JS phases so their CSS/JS deploys are cache-stable.
- **B7-preconnect**: `<link rel="preconnect">` for `assets.cyber-lenin.com`, `cdn.jsdelivr.net`, `cdnjs.cloudflare.com` in head.ejs; `fetchpriority="high"` on the homepage LCP img (`views/public/index.ejs:13`).
- **B6 + C6 deletions** (grep repo-wide before each): `public/fonts/space-grotesk/` (zero refs), `public/img/favicon.png` + `og-image.jpg` (consumers use assets.cyber-lenin.com), `views/layouts/main.ejs`, `server.js.redirect`, `connect-pg-simple` from package.json, `config/paginationHelper.js` + dead import `routes/public.js:6`, unused `isConnectionError` import `routes/ai-diary.js:4`, redundant `/reports/private` shims. Root-owned `public/puzzles/.minchong-15.owner-nobody-backup/` (1.35 MB duplicate) needs sudo — ask user or leave note.
- **B3**: SVGO aggressive pass on the 9 heavy flags (640 KB → ~60 KB; el-salvador.svg alone is 280 KB / 968 paths rendered at 20×14 px). Show before/after on dev-preview people page; **user confirms visually before deploy**.

Verify: after deploy, restart container and confirm asset `?v=` unchanged (the point of B2); `curl -sI` CF cache HIT on warmed CSS; `npm ls` clean after dependency removal; server starts.

### Phase 5 — Fonts (deploy #5; user gate: Korean rendering + FOUT acceptance)
Files: `views/partials/head.ejs:34-37`, `views/public/commulingo-doc.ejs:9-11`, `public/css/style.css` @font-face blocks, `public/fonts/**`.
- **B1**: (a) vendor Pretendard's official **dynamic-subset** woff2 build + its unicode-range @font-face CSS (do not hand-subset Korean — the official slices cover full range via unicode-range; typical page pulls 100-200 KB instead of 2 MB); (b) convert 5 IBM Plex TTF → woff2 (`fonttools`/`woff2_compress`), update `format('truetype')` → `format('woff2')` in style.css; (c) `font-display: swap` on all faces (user-approved); (d) drop the Plex preloads from head.ejs, keep at most 1-2 above-the-fold slices; (e) same preload change in commulingo-doc.ejs's hand-rolled head — nothing else there (its drift is deliberate).

Verify: headless Chromium screenshots first (ko+en, both themes, incl. Cyrillic-heavy person pages), then dev-preview on real device via Tailscale, **user confirms**; DevTools network shows per-page font transfer ~2.6 MB → ~300-450 KB. Fallback position if user dislikes FOUT: keep `block` with the smaller files.

### Phase 6 — JS extraction + defer (deploy #6, possibly split; user gate: none, but careful batching)
Files: nonogram view/route + new `public/css/nonogram.css` + `public/js/nonogram.js`; new `public/js/webauthn.js` + 5 auth views; script tags across views.
- **B4**: extract nonogram's 35 KB inline CSS/JS verbatim to static files (page is `setNoStore`; extraction makes them immutable-cached).
- **B5**: extract shared WebAuthn client (~21 KB duplicated across `public/login`, `admin/login`, `account`, `admin/passkeys`; `signup` shares the fetch helper). Test register+login on the tailnet HTTPS origin per the `admin-passkeys` skill BEFORE deploy (read its recovery section first — failure mode is bricked admin login); smoke-test login on prod immediately after deploy.
- **B7-defer**: audit each of the 25 non-deferred scripts individually; defer only those that bind on DOMContentLoaded with no inline sync dependents. Do in small batches. Leave `chat-viewport.js` (intentionally early viewport sizing) unless proven safe. `nav.js` (blocks parse on 39 pages) is the priority.

Verify: nonogram fully playable (fresh + resumed localStorage game); WebAuthn full flows; per deferred script, exercise its feature with cache disabled; console clean.

### Phase 7 — Refactors, smallest-risk first (3-4 deploys)
Order: **C5 → C4 → C2 → C8 → C3 → C7 → C1(+A4)**. All behavior-preserving; guard is output diffing.
- **C5**: single `data/commulingo/localize.js` replacing 10 identical definitions; dedupe `renderAppView` (`routes/commulingo.js:88` / `routes/commulingo-terms.js:221`); dedupe triplicated docs-mapping block.
- **C4**: `asyncHandler` wrapper for the 17 identical try/catch handlers in `routes/commulingo-admin-api.js` — error JSON shapes must stay identical.
- **C2**: hoist `getJson`/`setJson` from `config/redis-entry-cache.js:16-30` into a shared module; rewrite `config/report-cache.js` on top (~70 lines removed).
- **C8**: hoist duplicated render-locals in catch blocks (`routes/public.js`, `ai-diary.js`, `hub.js`, `reports.js`); diff error-page HTML.
- **C3**: `createEntryRoutes` factory collapsing `routes/ai-diary.js` + posts half of `routes/public.js` (~250 → ~80 lines). Verify: curl matrix — list/detail/prev-next/.md/404 × both routes × both langs, diffed.
- **C7**: first resolve the upstream-URL disagreement (`https://leninbot.duckdns.org` in `routes/admin.js:235,256` vs `http://host.docker.internal:8000` defaults elsewhere — check `.env` for what actually wins, preserve each callsite's effective URL exactly); then extract `config/services.js` for the 4 upstream base URLs + admin header factory; make `/api/logs` use `leninbotAdminBase()` (defined 2 lines below where it's inlined, `routes/admin.js:234-264`).
- **C1 (last, riskiest)**: `createSnapshotStore()` factory (mirroring `createEntryCache` at `config/redis-entry-cache.js:15`) absorbing the 5 stores. **Migrate one store per commit**, byte-diffing snapshot JSON + served pages after each. Critical invariant: preserve reference identity when content hash is unchanged (`people-store.js:342-344`) — linkify memos key on snapshot object identity. Implement **A4** (DB-side `max(updated_at)+count(*)` signature gate before the 11.6 MB stringify) once here, only if schema check shows all child tables have `updated_at`. `term-categories.js` and `link-blocklist.js` carry seed/fallback values — move code only, never content values; run `docker exec leninbot-frontend node /app/scripts/check-commulingo-code-db-drift.js` after touching them.

### Explicitly SKIPPED (assessed, not worth it / not safe)
- CSS/JS minification (~2-4 KB gz total).
- style.css↔ui.css ownership war (22 duplicated selectors, 15 `!important`) — high regression risk, zero user-visible gain. Dead-class deletion only where grep (incl. dynamically-constructed name fragments) proves unused.
- `LIMIT` on admin posts listing; `/nonogram/` in isStaticAssetPath; commulingo-doc.ejs head normalization; `Vary: Cookie` fragmentation; pg_stat_statements (user declined pg restart).

## Verification (end-to-end, after final phase)
- Re-run Phase 0 measurements and compare: homepage/term/person/sitemap latencies, seq_scan deltas, container CPU at rest.
- Full page sweep on prod: `/`, `/posts`, `/reports`, `/hub`, `/ai-diary`, `/chat`, `/commulingo` (+people/terms/events/docs/genealogy subpages), `/nonogram`, admin login — headless Chromium checks done by me per standing preference.
- `docker logs leninbot-frontend` clean; drift-check script passes.

## Effort
| Phase | Content | Effort | User gate |
|---|---|---|---|
| 0 | Baseline metrics | 0.5 h | no |
| 1 | A1, A9, A6-lite, A7-safe, B8 | 2-3 h | no |
| 2 | A2, A3, A8 | 2-3 h | no |
| 3 | A5, A10 | 2 h | no |
| 4 | B2, preconnects, deletions, flags | 2 h | flags visual |
| 5 | Fonts | 3-5 h | **Korean rendering / FOUT** |
| 6 | Nonogram+WebAuthn extraction, defer | 2-4 h | spot-check |
| 7 | C5→C4→C2→C8→C3→C7→C1(+A4) | 6-10 h | no |

Phases 1-3 deliver most of the measured server-side win; Phase 5 is the biggest user-facing win (2.6 MB → ~0.4 MB fonts per cold page load).
