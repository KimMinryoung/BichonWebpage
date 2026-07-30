# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BichonWebsite — Personal website (Node.js/Express + EJS + PostgreSQL) with:
- Blog posts and AI diary (backed by LeninBot API + PostgreSQL)
- Chat page (SSE streaming to LeninBot API)
- Admin dashboard with login

## Caution
- When running bash commands on Windows, use /dev/null for output redirection, not nul.

## User Preferences

### Workflow
- Always commit AND push together unless explicitly told otherwise
- Test before committing — run relevant tests or verify server starts
- Korean is the primary language for creative/design feedback; English for technical instructions
- When debugging visuals, ask for a screenshot path rather than guessing
- User provides screenshots in temp_dev/ — always read them when referenced
- Update architecture/design docs after significant feature work
- Prefer quick pragmatic fixes over extended analysis — don't overthink simple problems
- Never modify story/narrative content without explicit instruction

### Git
- Use descriptive commit messages with type prefix (feat/fix/art/refactor/docs)
- Never amend commits — always create new ones
- Push immediately after commit unless there's a reason not to

### Admin auth (Passkey / WebAuthn)
- Admin login is passkey-only. No password. IP whitelist (ADMIN_ALLOWED_IPS) is still enforced on `/admin/*`.
- **Admin URL**: `https://leninbot.tail6ecbbc.ts.net:8443/admin/login` — served by `tailscale serve --https=8443` (nginx already owns 443 for the public site). HTTP over Tailscale IP still works for the non-admin public site, but WebAuthn ceremonies need this HTTPS origin. RP_ID = `leninbot.tail6ecbbc.ts.net`, RP_ORIGIN = `https://leninbot.tail6ecbbc.ts.net:8443` (in `.env`).
- Owner-only writer lives on the same tailnet admin origin: `https://leninbot.tail6ecbbc.ts.net:8443/writer`. Public-host `/writer` and `/api/proxy/writer` are intentionally hidden with 404 responses.
- If `tailscale serve` config is ever wiped, recreate: `tailscale serve --bg --https=8443 http://127.0.0.1:3000` (run after `sudo tailscale set --operator=$USER` so sudo isn't needed).
- Bootstrap: when `user_passkeys` is empty, `/admin/login` shows a register form that any allowlisted tailnet device can use to register the first passkey.
- Add more passkeys after login at `/admin/passkeys` (one per device: Galaxy fingerprint, Windows Hello, USB key, …).
- Recovery (lost all passkeys): SSH in and run `docker exec leninbot-frontend node /app/scripts/reset-passkeys.js [username]`. Next `/admin/login` from an allowlisted IP re-enters bootstrap mode.
- DB tables: `users` (id, username, is_admin), `user_passkeys` (credential_id, public_key, counter, transports, device_name, backed_up). The old `admins` table is dropped by the migration.

### Deployment / Data-only updates
- Production container mounts host data with `-v /home/grass/frontend/data:/app/data`; data-only changes under `data/` are visible to the running app without rebuilding the Docker image.
- For CommuLingo content-only edits in `data/commulingo/lessons.json` or `data/commulingo/courses/*.js`, do not run `scripts/deploy` just to rebuild/restart the frontend. Commit/push the data change, then verify the live API/page.
- `routes/commulingo.js` loads CommuLingo through `data/commulingo/index.js` and caches the bundle by the maximum mtime across `lessons.json` and `courses/*.js`, so changed host data is picked up on the next request after mtime changes. Verify with `curl -s http://127.0.0.1:3000/commulingo/lesson/<lesson-id>`.
- CommuLingo reference documents (참고 문헌 전문) live in `data/commulingo/docs/` — `manifest.json` registry plus one HTML body fragment per doc; see `data/commulingo/docs/README.md` for the authoring rules. Adding/editing a document is data-only (mtime-cached): commit/push, then verify `/commulingo/docs/<id>`. The reader chrome lives in `views/public/commulingo-doc.ejs` + `public/css/commulingo-doc.css` (code — needs deploy).
- Merging a duplicate CommuLingo person (or renaming an office / role-category id) is DB-only: merge the rows, then `INSERT INTO commulingo_id_redirects (entity_type, from_id, to_id, note)` in the same transaction. The retired id starts 301ing to its target within one people-store refresh (~60s) — no commit, no rebuild. Chains (A→B→C) collapse to one hop at load time; a cycle drops the entry and logs it.
- Run the full deploy script for code, dependency, CSS/JS/template, server, route, config, or Docker image changes that require a new container image/restart.
- Never recreate or restart the production `leninbot-frontend` container with an ad hoc `docker run`. Use `scripts/deploy --restart` so the required labels, host data mount, and the `leninbot_default` network are applied consistently.
- The frontend connects to the local `leninbot-pg` Postgres container (`DB_HOST=leninbot-pg`, pgvector/pg17) over the `leninbot_default` Docker network — the same network used for Redis. The DB migrated off Supabase in July 2026; the old `leninbot_ipv6` network and the `ENETUNREACH` IPv6 failure mode are gone.
- If recent posts/reports/hub/diary suddenly render as empty, check `docker logs leninbot-frontend` for connection errors to `:5432`, confirm `leninbot-pg` is healthy (`docker ps`), and confirm both containers share `leninbot_default` (`docker network connect leninbot_default leninbot-frontend` if missing). Then verify `/`, `/posts`, `/reports`, `/hub`, and `/ai-diary` show content again.

### CSS / Mobile
- CSS cache busting is active: `?v=<%= Date.now() %>` in head.ejs
- Use `dvh` units instead of `vh` for mobile viewport height
- Test mobile via Tailscale: production container binds to `127.0.0.1:3000` (not LAN-reachable), so use `cyber-lenin.com` (live) or run `scripts/dev-preview start` for a bind-mounted preview on `<tailscale-ip>:3001`.
- The dev preview container is `leninbot-frontend-dev`; use `scripts/dev-preview stop|restart|status|logs`. It sets `DEV_MODE=1`, disables view/static asset caching, and publishes only to the Tailscale interface.
- Use `chrome://inspect` for remote debugging on Android
