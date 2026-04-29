# Frontend audit and improvement plan

Date: 2026-04-29

## Scope

This review covered the Express/EJS frontend application, public static assets, route handlers, authentication middleware, cache helpers, and deployment files.

The codebase is mostly server-rendered with Express and EJS, backed by PostgreSQL, Redis, WebAuthn, and a proxied LeninBot API. SQL access generally uses parameter binding, so the immediate SQL injection surface is low. The largest improvement areas are security headers, public API abuse controls, external API resilience, static asset caching, and sanitization boundaries for trusted HTML.

## High-priority risks

1. Admin IP allowlist fails open
   - `middleware/auth.js` allows all admin traffic when `ADMIN_ALLOWED_IPS` is empty.
   - Production should fail closed or require an explicit `ADMIN_IP_ALLOW_ALL=true` development override.

2. Required production secrets are not validated at startup
   - `SESSION_SECRET`, `LENINBOT_ADMIN_KEY`, DB config, Redis URL, and WebAuthn RP settings should be validated before the app starts.
   - In production, missing required secrets should terminate startup.

3. CSP is too permissive
   - `script-src` currently allows `unsafe-inline`, `unsafe-eval`, and third-party CDNs.
   - This weakens XSS containment. Move third-party scripts to self-hosted assets or nonce/hash-based policies.

4. Rate limiting is installed but not wired
   - `express-rate-limit` is present in dependencies but unused.
   - Add route-specific limits for `/auth/webauthn/*`, `/admin/webauthn/*`, `/api/proxy`, and admin log APIs.

5. HTML trust boundaries are inconsistent
   - Research views render `htmlBody` directly with `<%- htmlBody %>`.
   - Post views sanitize server-side, page views sanitize client-side, and report/research rendering differs by path.
   - Centralize server-side sanitization and reserve client-side DOMPurify as defense-in-depth only.

6. iframe allowance needs tightening
   - Post sanitizer allows relative iframes.
   - Restrict iframe `src` to known embed paths and add `sandbox`, `referrerpolicy`, and explicit sizing constraints.

## Performance opportunities

1. Replace `Date.now()` cache busting
   - CSS/JS URLs use per-request cache busters, which defeats browser caching.
   - Use a deployment version or manifest hash instead.

2. Bundle or version game assets
   - Game pages load many individual JS files with per-request cache busting.
   - A bundle or stable version query would reduce requests and improve cache hit rates.

3. Remove raw and backup assets from public delivery
   - `public/img/game/raw/*` contains development assets.
   - Keep source assets outside `public` or block static delivery.

4. Standardize upstream API timeouts
   - Several `fetch()` calls have no timeout.
   - Use a shared wrapper with `AbortController`, bounded timeout, and stale-cache fallback where possible.

5. Redis cache degradation should be consistent
   - Some cache modules check `redis.isReady`; others call Redis directly.
   - All caches should degrade to a miss when Redis is unavailable.

## Low-impact changes applied first

The first pass intentionally avoids behavior-changing auth or CSP hardening. It applies low-risk resilience and exposure reductions:

- Add a shared `fetchWithTimeout()` helper.
- Apply bounded upstream timeouts to hub, page, report, and admin log proxy routes.
- Clamp admin chat-log pagination parameters before forwarding.
- Make post-cache Redis calls check `redis.isReady` consistently.
- Block static delivery of `public/img/game/raw/*`.
- Exclude raw game assets and hidden puzzle backups from Docker build context.

## Second pass applied

The second pass improved static asset caching without changing page behavior:

- Add a process-level `assetVersion` local.
- Prefer `ASSET_VERSION`, then `GIT_SHA`, then process startup timestamp.
- Replace per-request `Date.now()` asset cache busters in EJS templates.
- Add `ASSET_VERSION` to `.env.example`.

This keeps cache invalidation available at deploy/restart boundaries while avoiding a new CSS/JS URL on every request.

## Third pass applied

The third pass wires the existing `express-rate-limit` dependency into high-risk routes:

- WebAuthn ceremony endpoints share a conservative authentication limiter.
- Signup registration options get a stricter hourly limiter.
- Chat proxy requests get a broad per-minute limiter to avoid breaking normal streaming use.
- Admin log API requests get a separate limiter.
- Limits are environment-variable tunable.

## Fourth pass applied

The fourth pass starts centralizing server-side HTML sanitization:

- Add `utils/sanitize.js` with basic, rich, and post sanitizers.
- Use the shared helpers for EJS locals instead of inline sanitizer definitions.
- Sanitize research HTML on the server before rendering.
- Restrict post iframes to relative `/posts-embed/*.html` paths and force defensive iframe attributes.

## Fifth pass applied

The fifth pass improves first-visit language defaults:

- Add `utils/language.js` to resolve language from an existing `lang` cookie first.
- If no language cookie exists, infer Korean when the browser's preferred supported language is `ko` or proxy country headers identify `KR`; otherwise default to English.
- Persist the inferred language in a one-year `lang` cookie so later visits follow the cached/toggled setting.
- Update the language toggle cookie attributes to use `Path=/`, `Max-Age`, `SameSite=Lax`, and `Secure` on HTTPS.

## Next recommended implementation order

1. Add production environment validation in warning-only mode, then switch production to fail-closed after confirming deployed env values.
2. Wire `express-rate-limit` to login, WebAuthn, signup, chat proxy, and admin log endpoints.
3. Replace `Date.now()` asset URLs with `ASSET_VERSION` or a generated asset manifest.
4. Centralize HTML sanitization for post, page, research, and report content.
5. Tighten iframe policy with an allowlist and sandbox attributes.
6. Move CDN dependencies to local static files and remove `unsafe-eval` from CSP.
7. Add smoke tests for auth pages, public pages, CSRF rejection, sanitizer fixtures, and timeout fallback behavior.

## Validation notes

Dependency audit was not run because `npm audit` requires sending dependency metadata to the external npm audit service. Run it only after explicit approval for that external disclosure.
